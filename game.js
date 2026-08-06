const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ui = {
  score: document.getElementById('score'), best: document.getElementById('best'), speed: document.getElementById('speed'),
  lives: document.getElementById('lives'), start: document.getElementById('startOverlay'), over: document.getElementById('gameOverOverlay'),
  final: document.getElementById('finalScore'), toast: document.getElementById('toast')
};
let W=0,H=0,last=0,state='menu',score=0,lives=3,speed=1,best=+(localStorage.powderHopBest||0),spawnTimer=0,shake=0,sound=true;
const keys={left:false,right:false};
const player={x:.5,y:.78,vx:0,jump:0,jumpV:0,tilt:0};
let riders=[], snow=[];

function resize(){ const r=canvas.getBoundingClientRect(); W=canvas.width=Math.round(r.width*devicePixelRatio); H=canvas.height=Math.round(r.height*devicePixelRatio); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); W=r.width; H=r.height; }
addEventListener('resize',resize); resize();
ui.best.textContent=String(best).padStart(5,'0');

function reset(){ score=0;lives=3;speed=1;spawnTimer=.8;riders=[];snow=[];player.x=.5;player.vx=0;player.jump=0; updateUI(); }
function start(){ reset();state='playing';ui.start.classList.add('hidden');ui.over.classList.add('hidden');beep(240,.08); }
function end(){ state='over';best=Math.max(best,Math.floor(score));localStorage.powderHopBest=best;ui.best.textContent=String(best).padStart(5,'0');ui.final.textContent=`You scored ${Math.floor(score)} points.`;ui.over.classList.remove('hidden'); }
function updateUI(){ui.score.textContent=String(Math.floor(score)).padStart(5,'0');ui.speed.textContent=speed.toFixed(1)+'×';ui.lives.textContent='● '.repeat(lives).trim()||'—';}
function beep(freq,duration){ if(!sound)return; const ac=beep.ac||(beep.ac=new(window.AudioContext||window.webkitAudioContext)()); const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.055,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+duration); }
function jump(){ if(state==='menu'||state==='over'){start();return;} if(player.jump===0){player.jumpV=620;player.jump=.01;beep(420,.1);} }
function bindHold(id,key){const el=document.getElementById(id); for(const ev of ['pointerdown','pointerenter'])el.addEventListener(ev,e=>{if(e.buttons||ev==='pointerdown')keys[key]=true}); for(const ev of ['pointerup','pointerleave','pointercancel'])el.addEventListener(ev,()=>keys[key]=false);}
bindHold('leftButton','left');bindHold('rightButton','right');document.getElementById('jumpButton').addEventListener('pointerdown',jump);
document.getElementById('startButton').onclick=start;document.getElementById('restartButton').onclick=start;
document.getElementById('soundButton').onclick=e=>{sound=!sound;e.currentTarget.textContent=sound?'SOUND ON':'SOUND OFF';};
addEventListener('keydown',e=>{if(['ArrowLeft','a','A'].includes(e.key))keys.left=true;if(['ArrowRight','d','D'].includes(e.key))keys.right=true;if(e.code==='Space'){e.preventDefault();jump();}});
addEventListener('keyup',e=>{if(['ArrowLeft','a','A'].includes(e.key))keys.left=false;if(['ArrowRight','d','D'].includes(e.key))keys.right=false;});

function spawn(){riders.push({x:.17+Math.random()*.66,y:-.08,wobble:Math.random()*6.28,color:Math.random()>.5?'#ff5636':'#145ee8',hit:false,cleared:false});}
function toast(text){ui.toast.textContent=text;ui.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>ui.toast.classList.remove('show'),700);}
function update(dt){
  if(state!=='playing')return;
  speed=Math.min(2.5,1+score/6000);score+=dt*18*speed;
  const dir=(keys.right?1:0)-(keys.left?1:0);player.vx+=dir*2.7*dt;player.vx*=Math.pow(.015,dt);player.x=Math.max(.12,Math.min(.88,player.x+player.vx*dt));player.tilt+=(dir*.28-player.tilt)*dt*10;
  if(player.jump>0){player.jumpV-=1450*dt;player.jump+=player.jumpV*dt;if(player.jump<=0){player.jump=0;player.jumpV=0;beep(180,.05);}}
  spawnTimer-=dt*speed;if(spawnTimer<=0){spawn();spawnTimer=.85+Math.random()*.55;}
  riders.forEach(r=>{
    r.y+=dt*.48*speed;
    const dx=Math.abs(r.x-player.x),dy=Math.abs(r.y-player.y);
    if(!r.hit&&!r.cleared&&dy<.075&&dx<.075){
      if(player.jump>38){r.cleared=true;const close=Math.max(0,1-dx/.075);const bonus=Math.round(200+close*150);score+=bonus;toast(`CLEAN AIR! +${bonus}`);beep(700,.12);}
      else{r.hit=true;lives--;shake=10;toast('OUCH!');beep(90,.25);if(lives<=0)setTimeout(end,350);}
    }
  });
  riders=riders.filter(r=>r.y<1.15);updateUI();
  if(Math.random()<dt*speed*18)snow.push({x:Math.random(),y:-.03,s:1+Math.random()*2});
  snow.forEach(s=>s.y+=dt*(.4+s.s*.05)*speed);snow=snow.filter(s=>s.y<1.05);
}

function mountain(){
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#b8d8e9');g.addColorStop(.46,'#eaf3f3');g.addColorStop(1,'#dce8e5');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#88aec4';ctx.beginPath();ctx.moveTo(0,H*.42);ctx.lineTo(W*.18,H*.08);ctx.lineTo(W*.33,H*.4);ctx.lineTo(W*.52,H*.03);ctx.lineTo(W*.75,H*.43);ctx.lineTo(W*.88,H*.17);ctx.lineTo(W,H*.4);ctx.lineTo(W,H*.55);ctx.lineTo(0,H*.55);ctx.fill();
  ctx.fillStyle='#f2f5f1';ctx.beginPath();ctx.moveTo(0,H*.42);ctx.lineTo(W*.18,H*.08);ctx.lineTo(W*.16,H*.28);ctx.lineTo(W*.23,H*.22);ctx.lineTo(W*.33,H*.4);ctx.lineTo(W*.52,H*.03);ctx.lineTo(W*.48,H*.28);ctx.lineTo(W*.56,H*.2);ctx.lineTo(W*.75,H*.43);ctx.lineTo(W*.88,H*.17);ctx.lineTo(W,H*.4);ctx.lineTo(W,H*.6);ctx.lineTo(0,H*.6);ctx.fill();
  ctx.fillStyle='#f8faf4';ctx.beginPath();ctx.moveTo(0,H*.49);ctx.quadraticCurveTo(W*.5,H*.37,W,H*.5);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  for(let i=0;i<11;i++){const x=(i/10)*W+(i%2?12:-8),y=H*(.42+(i%3)*.035);tree(x,y,18+(i%4)*5);}
  ctx.strokeStyle='rgba(38,111,160,.12)';ctx.lineWidth=2;for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(W*(i/8),H*.55);ctx.quadraticCurveTo(W*.5,H*.72,W*(.5+(i-4)*.1),H);ctx.stroke();}
}
function tree(x,y,s){ctx.fillStyle='#1c5160';ctx.fillRect(x-2,y,4,s*.8);ctx.beginPath();ctx.moveTo(x,y-s);ctx.lineTo(x-s*.38,y+s*.25);ctx.lineTo(x+s*.38,y+s*.25);ctx.fill();ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.moveTo(x,y-s);ctx.lineTo(x-s*.3,y);ctx.lineTo(x,y-s*.08);ctx.fill();}
function drawRider(r){const x=r.x*W,y=r.y*H;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(r.wobble+r.y*8)*.08);ctx.strokeStyle='#10243e';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-17,18);ctx.lineTo(18,21);ctx.stroke();ctx.fillStyle=r.color;ctx.fillRect(-9,-4,18,21);ctx.fillStyle='#10243e';ctx.beginPath();ctx.arc(0,-11,7,0,7);ctx.fill();ctx.strokeStyle='#10243e';ctx.beginPath();ctx.moveTo(-7,4);ctx.lineTo(-16,12);ctx.moveTo(7,4);ctx.lineTo(15,9);ctx.stroke();ctx.restore();}
function drawPlayer(){const x=player.x*W,y=player.y*H-player.jump;ctx.save();ctx.translate(x,y);ctx.rotate(player.tilt);if(player.jump>5){ctx.fillStyle='rgba(16,36,62,.15)';ctx.beginPath();ctx.ellipse(0,player.jump+26,27,7,0,0,7);ctx.fill();}ctx.strokeStyle='#145ee8';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-22,24);ctx.lineTo(5,19);ctx.moveTo(-5,27);ctx.lineTo(22,22);ctx.stroke();ctx.strokeStyle='#10243e';ctx.beginPath();ctx.moveTo(-7,7);ctx.lineTo(-11,21);ctx.moveTo(6,8);ctx.lineTo(11,21);ctx.stroke();ctx.fillStyle='#ff5636';ctx.beginPath();ctx.moveTo(-9,-12);ctx.lineTo(10,-8);ctx.lineTo(8,10);ctx.lineTo(-8,11);ctx.closePath();ctx.fill();ctx.strokeStyle='#10243e';ctx.beginPath();ctx.moveTo(-7,-5);ctx.lineTo(-18,8);ctx.moveTo(8,-3);ctx.lineTo(19,7);ctx.stroke();ctx.fillStyle='#10243e';ctx.beginPath();ctx.arc(0,-19,8,0,7);ctx.fill();ctx.fillStyle='#f5b740';ctx.fillRect(-8,-21,16,4);ctx.restore();}
function draw(){ctx.save();if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.86;}mountain();riders.sort((a,b)=>a.y-b.y).forEach(drawRider);snow.forEach(s=>{ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.s,0,7);ctx.fill();});drawPlayer();ctx.restore();}
function frame(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
