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

function spawn(){riders.push({x:.23+Math.random()*.54,y:-.08,wobble:Math.random()*6.28,color:Math.random()>.5?'#f0443c':'#35d8d4',hit:false,cleared:false});}
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
      if(player.jump>38){r.cleared=true;const close=Math.max(0,1-dx/.075);const bonus=Math.round(200+close*150);score+=bonus;toast(`GREAT SCOTT! +${bonus}`);beep(700,.12);}
      else{r.hit=true;lives--;shake=10;toast('BIFFED IT!');beep(90,.25);if(lives<=0)setTimeout(end,350);}
    }
  });
  riders=riders.filter(r=>r.y<1.15);updateUI();
  if(Math.random()<dt*speed*18)snow.push({x:Math.random(),y:-.03,s:1+Math.random()*2});
  snow.forEach(s=>s.y+=dt*(.4+s.s*.05)*speed);snow=snow.filter(s=>s.y<1.05);
}

function mountain(){
  const horizon=H*.35,g=ctx.createLinearGradient(0,0,0,horizon);g.addColorStop(0,'#17183f');g.addColorStop(.55,'#633f87');g.addColorStop(1,'#f07a45');ctx.fillStyle=g;ctx.fillRect(0,0,W,horizon);
  ctx.fillStyle='#ffd55a';ctx.fillRect(W*.46,H*.16,W*.08,6);ctx.fillRect(W*.44,H*.17,W*.12,6);ctx.fillRect(W*.43,H*.18,W*.14,H*.08);
  const scroll=(performance.now()*.02*speed)%100;for(let side=0;side<2;side++)for(let i=-1;i<7;i++){const x=side?W*.73+i*100-scroll:W*.02+i*100+scroll*.5;building(x,horizon,70+(i%3)*16,side);}
  ctx.fillStyle='#403550';ctx.fillRect(0,horizon,W,H-horizon);ctx.fillStyle='#2a263c';ctx.beginPath();ctx.moveTo(W*.2,horizon);ctx.lineTo(W*.8,horizon);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  ctx.fillStyle='#c6b785';ctx.beginPath();ctx.moveTo(W*.18,horizon);ctx.lineTo(W*.205,horizon);ctx.lineTo(W*.04,H);ctx.lineTo(0,H);ctx.lineTo(0,horizon);ctx.fill();ctx.beginPath();ctx.moveTo(W*.795,horizon);ctx.lineTo(W*.82,horizon);ctx.lineTo(W,H);ctx.lineTo(W*.96,H);ctx.fill();
  ctx.fillStyle='#f4d34f';for(let i=0;i<5;i++){const p=((i*.24+performance.now()*.00008*speed)%1),y=horizon+p*(H-horizon),w=5+p*8;ctx.fillRect(W*.5-w/2,y,w,16+p*30);}
  ctx.fillStyle='#7d496c';ctx.fillRect(0,horizon-5,W,5);
}
function building(x,y,w,right){const h=55+(Math.abs(Math.floor(x/100))%3)*16;ctx.fillStyle=right?'#23274a':'#34234c';ctx.fillRect(x,y-h,w,h);ctx.fillStyle='#0a0c21';ctx.fillRect(x+7,y-h+10,w-14,20);ctx.fillStyle='#f6c64c';for(let j=0;j<3;j++)ctx.fillRect(x+12+j*18,y-h+15,8,7);ctx.fillStyle='#35d8d4';ctx.fillRect(x+4,y-10,w-8,5);}
function drawRider(r){const x=r.x*W,y=r.y*H;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(Math.sin(r.wobble+r.y*8)*.05);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#080a19';ctx.fillRect(-18,17,36,5);ctx.fillStyle='#f0c67d';ctx.fillRect(-5,-15,10,9);ctx.fillStyle='#19152d';ctx.fillRect(-8,-20,15,6);ctx.fillStyle=r.color;ctx.fillRect(-11,-6,22,21);ctx.fillStyle='#12152c';ctx.fillRect(-13,13,9,13);ctx.fillRect(5,13,9,13);ctx.fillStyle='#f0c67d';ctx.fillRect(-17,-3,7,15);ctx.fillRect(10,-3,7,15);ctx.restore();}
function drawPlayer(){const x=Math.round(player.x*W),y=Math.round(player.y*H-player.jump);ctx.save();ctx.translate(x,y);ctx.rotate(player.tilt);ctx.imageSmoothingEnabled=false;if(player.jump>5){ctx.fillStyle='rgba(4,5,15,.35)';ctx.fillRect(-25,player.jump+25,50,7);}ctx.fillStyle='#f0443c';ctx.fillRect(-26,24,52,5);ctx.fillStyle='#080a19';ctx.fillRect(-19,29,8,5);ctx.fillRect(12,29,8,5);ctx.fillStyle='#18234d';ctx.fillRect(-11,6,9,18);ctx.fillRect(4,6,9,18);ctx.fillStyle='#35d8d4';ctx.fillRect(-12,-13,24,21);ctx.fillStyle='#f0443c';ctx.fillRect(-11,-13,6,21);ctx.fillStyle='#f0c67d';ctx.fillRect(-5,-25,12,11);ctx.fillStyle='#493024';ctx.fillRect(-8,-29,18,7);ctx.fillRect(5,-25,7,5);ctx.fillStyle='#f0c67d';ctx.fillRect(-19,-9,8,18);ctx.fillRect(12,-8,8,18);ctx.restore();}
function draw(){ctx.save();if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.86;}mountain();riders.sort((a,b)=>a.y-b.y).forEach(drawRider);snow.forEach(s=>{ctx.fillStyle='rgba(255,217,74,.75)';ctx.fillRect(Math.round(s.x*W),Math.round(s.y*H),s.s*2,s.s*4);});drawPlayer();ctx.restore();}
function frame(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
