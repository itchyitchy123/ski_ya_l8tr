const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ui = {
  score: document.getElementById('score'), best: document.getElementById('best'), speed: document.getElementById('speed'),
  lives: document.getElementById('lives'), start: document.getElementById('startOverlay'), over: document.getElementById('gameOverOverlay'),
  final: document.getElementById('finalScore'), finalBest: document.getElementById('finalBest'), altitude: document.getElementById('altitude'),
  pause: document.getElementById('pauseOverlay'), pauseButton: document.getElementById('pauseButton'), toast: document.getElementById('toast')
};
let W=0,H=0,last=0,state='menu',score=0,lives=3,speed=1,best=+(localStorage.alpineRushBest||localStorage.powderHopBest||0),spawnTimer=0,shake=0,sound=true;
const keys={left:false,right:false};
const player={x:.5,y:.78,vx:0,jump:0,jumpV:0,tilt:0};
let riders=[], snow=[];

function resize(){ const r=canvas.getBoundingClientRect(); W=canvas.width=Math.round(r.width*devicePixelRatio); H=canvas.height=Math.round(r.height*devicePixelRatio); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); W=r.width; H=r.height; }
addEventListener('resize',resize); resize();
ui.best.textContent=String(best).padStart(5,'0');

function reset(){ score=0;lives=3;speed=1;spawnTimer=.8;riders=[];snow=[];player.x=.5;player.vx=0;player.jump=0; updateUI(); }
function start(){ reset();state='playing';ui.start.classList.add('hidden');ui.over.classList.add('hidden');ui.pause.classList.add('hidden');ui.pauseButton.disabled=false;beep(240,.08); }
function end(){ state='over';best=Math.max(best,Math.floor(score));localStorage.alpineRushBest=best;ui.best.textContent=String(best).padStart(5,'0');ui.final.textContent=Math.floor(score).toLocaleString();ui.finalBest.textContent=best.toLocaleString();ui.pauseButton.disabled=true;ui.over.classList.remove('hidden'); }
function togglePause(){if(state==='playing'){state='paused';keys.left=keys.right=false;ui.pause.classList.remove('hidden');ui.pauseButton.setAttribute('aria-pressed','true');ui.pauseButton.setAttribute('aria-label','Resume game');}else if(state==='paused'){state='playing';last=performance.now();ui.pause.classList.add('hidden');ui.pauseButton.setAttribute('aria-pressed','false');ui.pauseButton.setAttribute('aria-label','Pause game');}}
function updateUI(){ui.score.textContent=String(Math.floor(score)).padStart(5,'0');ui.speed.textContent=speed.toFixed(1)+'×';ui.altitude.innerHTML=`${Math.max(840,2840-Math.floor(score/3)).toLocaleString()}<sup>M</sup>`;ui.lives.textContent='● '.repeat(lives).trim()||'—';ui.lives.setAttribute('aria-label',`${lives} ${lives===1?'life':'lives'}`);}
function beep(freq,duration){ if(!sound)return; const ac=beep.ac||(beep.ac=new(window.AudioContext||window.webkitAudioContext)()); const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.055,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+duration); }
function jump(){ if(state==='menu'||state==='over'){start();return;} if(player.jump===0){player.jumpV=620;player.jump=.01;beep(420,.1);} }
function bindHold(id,key){const el=document.getElementById(id); for(const ev of ['pointerdown','pointerenter'])el.addEventListener(ev,e=>{if(e.buttons||ev==='pointerdown')keys[key]=true}); for(const ev of ['pointerup','pointerleave','pointercancel'])el.addEventListener(ev,()=>keys[key]=false);}
bindHold('leftButton','left');bindHold('rightButton','right');document.getElementById('jumpButton').addEventListener('pointerdown',jump);
document.getElementById('startButton').onclick=start;document.getElementById('restartButton').onclick=start;
document.getElementById('resumeButton').onclick=togglePause;ui.pauseButton.onclick=togglePause;
document.getElementById('soundButton').onclick=e=>{sound=!sound;e.currentTarget.setAttribute('aria-pressed',String(sound));e.currentTarget.setAttribute('aria-label',sound?'Mute sound':'Enable sound');e.currentTarget.querySelector('span').textContent=sound?'◖))':'◖×';};
addEventListener('keydown',e=>{if(['ArrowLeft','a','A'].includes(e.key))keys.left=true;if(['ArrowRight','d','D'].includes(e.key))keys.right=true;if(e.code==='Space'){e.preventDefault();jump();}if(['p','P','Escape'].includes(e.key)&&['playing','paused'].includes(state)){e.preventDefault();togglePause();}});
addEventListener('keyup',e=>{if(['ArrowLeft','a','A'].includes(e.key))keys.left=false;if(['ArrowRight','d','D'].includes(e.key))keys.right=false;});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')togglePause();});

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
      if(player.jump>38){r.cleared=true;const close=Math.max(0,1-dx/.075);const bonus=Math.round(200+close*150);score+=bonus;toast(`HUGE AIR +${bonus}`);beep(700,.12);}
      else{r.hit=true;lives--;shake=10;toast('WIPEOUT!');beep(90,.25);if(lives<=0)setTimeout(end,350);}
    }
  });
  riders=riders.filter(r=>r.y<1.15);updateUI();
  if(Math.random()<dt*speed*22)snow.push({x:.18+Math.random()*.64,y:-.03,s:1+Math.random()*2,a:.25+Math.random()*.55});
  snow.forEach(s=>s.y+=dt*(.4+s.s*.05)*speed);snow=snow.filter(s=>s.y<1.05);
}

function mountain(){
  const horizon=H*.42,sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#397aa3');sky.addColorStop(.55,'#9bc9df');sky.addColorStop(1,'#e8f4f8');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  const flare=ctx.createRadialGradient(W*.78,H*.12,2,W*.78,H*.12,W*.18);flare.addColorStop(0,'rgba(255,255,245,1)');flare.addColorStop(.15,'rgba(220,246,255,.75)');flare.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=flare;ctx.fillRect(0,0,W,H*.45);
  ctx.fillStyle='#668ba2';ctx.beginPath();ctx.moveTo(0,horizon);ctx.lineTo(W*.14,H*.16);ctx.lineTo(W*.27,H*.38);ctx.lineTo(W*.46,H*.09);ctx.lineTo(W*.66,H*.39);ctx.lineTo(W*.82,H*.2);ctx.lineTo(W,horizon);ctx.lineTo(W,H*.58);ctx.lineTo(0,H*.58);ctx.fill();
  ctx.fillStyle='#f5fbfd';ctx.beginPath();ctx.moveTo(0,horizon);ctx.lineTo(W*.14,H*.16);ctx.lineTo(W*.12,H*.3);ctx.lineTo(W*.18,H*.25);ctx.lineTo(W*.27,H*.38);ctx.lineTo(W*.46,H*.09);ctx.lineTo(W*.43,H*.28);ctx.lineTo(W*.51,H*.22);ctx.lineTo(W*.66,H*.39);ctx.lineTo(W*.82,H*.2);ctx.lineTo(W*.79,H*.32);ctx.lineTo(W*.86,H*.29);ctx.lineTo(W,horizon);ctx.lineTo(W,H*.58);ctx.lineTo(0,H*.58);ctx.fill();
  const slope=ctx.createLinearGradient(0,horizon,0,H);slope.addColorStop(0,'#eef8fb');slope.addColorStop(1,'#b9d8e3');ctx.fillStyle=slope;ctx.beginPath();ctx.moveTo(0,H*.47);ctx.quadraticCurveTo(W*.5,H*.36,W,H*.48);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  ctx.strokeStyle='rgba(74,145,177,.23)';ctx.lineWidth=2;for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(W*(i/7),H*.5);ctx.quadraticCurveTo(W*.5,H*.75,W*(.5+(i-3.5)*.13),H);ctx.stroke();}
  for(let i=0;i<12;i++)pine((i/11)*W+(i%2?10:-8),H*(.43+(i%3)*.035),18+(i%4)*7);
  const vignette=ctx.createRadialGradient(W*.5,H*.52,H*.25,W*.5,H*.52,W*.75);vignette.addColorStop(.55,'rgba(5,25,38,0)');vignette.addColorStop(1,'rgba(5,25,38,.28)');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
}
function pine(x,y,s){ctx.fillStyle='#315b68';ctx.fillRect(x-2,y-s*.2,4,s*.7);ctx.beginPath();ctx.moveTo(x,y-s);ctx.lineTo(x-s*.42,y+s*.25);ctx.lineTo(x+s*.42,y+s*.25);ctx.fill();ctx.fillStyle='rgba(245,252,255,.8)';ctx.beginPath();ctx.moveTo(x,y-s);ctx.lineTo(x-s*.3,y);ctx.lineTo(x+2,y-s*.12);ctx.fill();}
function drawRider(r){const x=r.x*W,y=r.y*H;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(r.wobble+r.y*8)*.08);ctx.strokeStyle='#1a3447';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-18,27);ctx.lineTo(5,22);ctx.moveTo(-5,29);ctx.lineTo(19,25);ctx.moveTo(-10,1);ctx.lineTo(-21,24);ctx.moveTo(10,1);ctx.lineTo(21,22);ctx.stroke();ctx.fillStyle='#14283b';ctx.beginPath();ctx.arc(0,-15,8,0,Math.PI*2);ctx.fill();ctx.fillStyle=r.color;ctx.beginPath();ctx.roundRect(-11,-7,22,24,5);ctx.fill();ctx.strokeStyle='#213648';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-6,14);ctx.lineTo(-10,25);ctx.moveTo(6,14);ctx.lineTo(10,25);ctx.stroke();ctx.restore();}
function drawPlayer(){const x=player.x*W,y=player.y*H-player.jump;ctx.save();ctx.translate(x,y);ctx.rotate(player.tilt);ctx.fillStyle=`rgba(28,76,96,${Math.max(.1,.25-player.jump/500)})`;ctx.beginPath();ctx.ellipse(0,player.jump+31,31,8,0,0,Math.PI*2);ctx.fill();ctx.shadowColor='#58d8ff';ctx.shadowBlur=9;ctx.strokeStyle='#1677ac';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-24,29);ctx.lineTo(7,23);ctx.moveTo(-5,31);ctx.lineTo(25,25);ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#152f43';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-7,7);ctx.lineTo(-10,25);ctx.moveTo(7,7);ctx.lineTo(11,24);ctx.stroke();const jacket=ctx.createLinearGradient(-12,-13,12,11);jacket.addColorStop(0,'#ff9138');jacket.addColorStop(1,'#db321e');ctx.fillStyle=jacket;ctx.beginPath();ctx.roundRect(-12,-14,24,24,6);ctx.fill();ctx.fillStyle='#11283a';ctx.beginPath();ctx.arc(0,-21,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#80dcff';ctx.fillRect(-8,-23,16,4);ctx.strokeStyle='#243d4c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-9,-7);ctx.lineTo(-21,25);ctx.moveTo(9,-6);ctx.lineTo(22,24);ctx.stroke();ctx.restore();}
function draw(){ctx.save();ctx.imageSmoothingEnabled=true;if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.86;}mountain();snow.forEach(s=>{ctx.strokeStyle=`rgba(255,255,255,${s.a})`;ctx.lineWidth=s.s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(s.x*W,s.y*H);ctx.lineTo(s.x*W,(s.y*H)+6+s.s*4);ctx.stroke();});riders.sort((a,b)=>a.y-b.y).forEach(drawRider);drawPlayer();ctx.restore();}
function frame(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
