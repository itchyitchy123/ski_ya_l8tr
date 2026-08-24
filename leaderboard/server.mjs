import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';

const port=Number(process.env.PORT||8787);
const secret=process.env.LEADERBOARD_SECRET||'';
const allowedOrigin=process.env.LEADERBOARD_ORIGIN||'';
const modes=new Set(['freeride','training','timetrial','downhill','slalom','park','bigair','patrol','colorado','pondskim','parking']);
const scores=new Map();
const limits=new Map();

function headers(req){const origin=req.headers.origin,access=allowedOrigin&&origin===allowedOrigin?origin:undefined;return {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','content-security-policy':"default-src 'none'; frame-ancestors 'none'",...(access?{'access-control-allow-origin':access,'vary':'Origin'}:{})}}
const json=(req,res,status,value)=>{res.writeHead(status,headers(req));res.end(JSON.stringify(value))};
function allowed(req){const key=req.socket.remoteAddress||'unknown',now=Date.now(),entry=limits.get(key);if(limits.size>10000){for(const [address,item] of limits)if(now-item.started>60000)limits.delete(address)}if(!entry||now-entry.started>60000){limits.set(key,{started:now,count:1});return true}if(entry.count>=30)return false;entry.count++;return true}
function validSignature(raw,provided){if(!secret||typeof provided!=='string')return false;const expected=createHmac('sha256',secret).update(raw).digest('hex');return provided.length===expected.length&&timingSafeEqual(Buffer.from(expected),Buffer.from(provided))}
async function readBody(req){let raw='';req.setEncoding('utf8');for await(const chunk of req){raw+=chunk;if(raw.length>32768)throw new Error('body too large')}return raw}
function validKeyPart(value,max){return typeof value==='string'&&value.length>0&&value.length<=max&&/^[a-z0-9-]+$/i.test(value)}

const server=createServer(async(req,res)=>{
  if(req.method==='OPTIONS'){const origin=req.headers.origin;if(allowedOrigin&&origin!==allowedOrigin){res.writeHead(403,headers(req));return res.end()}res.writeHead(204,{...headers(req),'access-control-allow-methods':'GET,POST','access-control-allow-headers':'content-type,x-score-signature'});return res.end()}
  if(!allowed(req))return json(req,res,429,{error:'rate limit exceeded'});
  const url=new URL(req.url,'http://localhost');
  if(req.method==='POST'&&url.pathname==='/v1/scores'){
    let raw;try{raw=await readBody(req)}catch(error){return json(req,res,413,{error:error.message})}
    if(!validSignature(raw,req.headers['x-score-signature']))return json(req,res,401,{error:'invalid score signature'});
    let item;try{item=JSON.parse(raw)}catch{return json(req,res,400,{error:'invalid JSON'})}
    if(!item||!validKeyPart(item.route,2)||!validKeyPart(item.run,2)||!modes.has(item.mode)||!Number.isInteger(item.score)||item.score<0||item.score>100000000||!Number.isFinite(item.elapsed)||item.elapsed<=0||item.elapsed>86400)return json(req,res,422,{error:'invalid score envelope'});
    const key=`${item.route}/${item.run}/${item.mode}`,entry={score:item.score,elapsed:item.elapsed,createdAt:new Date().toISOString(),player:String(item.player||'anonymous').slice(0,24)};
    const list=scores.get(key)||[];list.push(entry);list.sort((a,b)=>b.score-a.score||a.elapsed-b.elapsed);scores.set(key,list.slice(0,100));
    return json(req,res,201,{accepted:true,rank:list.indexOf(entry)+1});
  }
  if(req.method==='GET'&&url.pathname.startsWith('/v1/leaderboards/')){const parts=url.pathname.slice('/v1/leaderboards/'.length).split('/');if(parts.length!==3||!validKeyPart(parts[0],2)||!validKeyPart(parts[1],2)||!modes.has(parts[2]))return json(req,res,400,{error:'invalid leaderboard key'});const list=scores.get(parts.join('/'))||[];return json(req,res,200,{items:list.slice(0,50)})}
  return json(req,res,404,{error:'not found'});
});
server.listen(port,()=>console.log(`Alpine Rush leaderboard listening on :${port}`));
