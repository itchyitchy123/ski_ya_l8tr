import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';

const port=Number(process.env.PORT||8787);
const secret=process.env.LEADERBOARD_SECRET||'';
const scores=new Map();
const limits=new Map();

const json=(res,status,value)=>{res.writeHead(status,{'content-type':'application/json','access-control-allow-origin':'*'});res.end(JSON.stringify(value))};
function allowed(req){const key=req.socket.remoteAddress||'unknown',now=Date.now(),entry=limits.get(key);if(!entry||now-entry.started>60000){limits.set(key,{started:now,count:1});return true}if(entry.count>=30)return false;entry.count++;return true}
function validSignature(raw,provided){if(!secret||typeof provided!=='string')return false;const expected=createHmac('sha256',secret).update(raw).digest('hex');return provided.length===expected.length&&timingSafeEqual(Buffer.from(expected),Buffer.from(provided))}
async function readBody(req){let raw='';req.setEncoding('utf8');for await(const chunk of req){raw+=chunk;if(raw.length>32768)throw new Error('body too large')}return raw}

const server=createServer(async(req,res)=>{
  if(req.method==='OPTIONS'){res.writeHead(204,{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST','access-control-allow-headers':'content-type,x-score-signature'});return res.end()}
  if(!allowed(req))return json(res,429,{error:'rate limit exceeded'});
  const url=new URL(req.url,'http://localhost');
  if(req.method==='POST'&&url.pathname==='/v1/scores'){
    let raw;try{raw=await readBody(req)}catch(error){return json(res,413,{error:error.message})}
    if(!validSignature(raw,req.headers['x-score-signature']))return json(res,401,{error:'invalid score signature'});
    let item;try{item=JSON.parse(raw)}catch{return json(res,400,{error:'invalid JSON'})}
    if(!item.route||!item.run||!item.mode||!Number.isInteger(item.score)||item.score<0||item.score>100000000||!Number.isFinite(item.elapsed)||item.elapsed<=0)return json(res,422,{error:'invalid score envelope'});
    const key=`${item.route}/${item.run}/${item.mode}`,entry={score:item.score,elapsed:item.elapsed,createdAt:new Date().toISOString(),player:String(item.player||'anonymous').slice(0,24)};
    const list=scores.get(key)||[];list.push(entry);list.sort((a,b)=>b.score-a.score||a.elapsed-b.elapsed);scores.set(key,list.slice(0,100));
    return json(res,201,{accepted:true,rank:list.indexOf(entry)+1});
  }
  if(req.method==='GET'&&url.pathname.startsWith('/v1/leaderboards/')){const key=url.pathname.slice('/v1/leaderboards/'.length),list=scores.get(key)||[];return json(res,200,{items:list.slice(0,50)})}
  return json(res,404,{error:'not found'});
});
server.listen(port,()=>console.log(`Alpine Rush leaderboard listening on :${port}`));
