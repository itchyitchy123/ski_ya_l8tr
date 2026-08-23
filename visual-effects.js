(function(){
  'use strict';
  const canvas=document.getElementById('visualLayer'),game=document.getElementById('game');
  if(!canvas||!game)return;
  const ctx=canvas.getContext('2d');let width=0,height=0,dpr=1,flakes=[],last=0,flash=0;
  function resize(){dpr=Math.min(devicePixelRatio||1,2);width=innerWidth;height=innerHeight;canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
  function seed(){flakes=Array.from({length:Math.max(18,Math.min(80,Math.round(width/16)))},()=>({x:Math.random()*width,y:Math.random()*height,s:1+Math.random()*3,a:.16+Math.random()*.5,drift:(Math.random()-.5)*.35}))}
  function draw(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;ctx.clearRect(0,0,width,height);if(!game.classList.contains('playing')){requestAnimationFrame(draw);return}const reduced=document.documentElement.dataset.quality==='low'||document.documentElement.dataset.motion==='reduced',boosted=game.classList.contains('boosted'),fast=game.classList.contains('fast');
    const hour=new Date().getHours(),night=hour<7||hour>19,dusk=!night&&(hour<9||hour>17),sky=ctx.createLinearGradient(0,0,0,height*.65);sky.addColorStop(0,night?'rgba(5,16,54,.28)':dusk?'rgba(111,55,76,.22)':'rgba(78,156,184,.12)');sky.addColorStop(.65,'rgba(255,255,255,0)');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height*.65);const sun=ctx.createRadialGradient(width*(dusk?.78:.72),height*(night?.16:.2),2,width*(dusk?.78:.72),height*(night?.16:.2),height*.35);sun.addColorStop(0,night?'rgba(103,157,255,.08)':dusk?'rgba(255,180,112,.18)':'rgba(255,248,202,.14)');sun.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=sun;ctx.fillRect(0,0,width,height*.65);
    if(!reduced){for(const flake of flakes){flake.y+=(35+flake.s*28+(fast?80:0))*dt;flake.x+=flake.drift*dt*(fast?3:1);if(flake.y>height+10){flake.y=-10;flake.x=Math.random()*width}ctx.strokeStyle=`rgba(255,255,255,${flake.a*(boosted?1.2:1)})`;ctx.lineWidth=flake.s;ctx.beginPath();ctx.moveTo(flake.x,flake.y);ctx.lineTo(flake.x-(fast?12:2),flake.y+5+flake.s*3);ctx.stroke()}}
      if(boosted){for(let i=0;i<12;i++){const x=Math.random()*width;const y=height*.42+Math.random()*height*.5;ctx.strokeStyle=`rgba(104,229,255,${.12+Math.random()*.2})`;ctx.lineWidth=1+Math.random()*2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(x-width/2)*.08,y+26+Math.random()*54);ctx.stroke()}}
    }
    const vignette=ctx.createRadialGradient(width/2,height*.52,height*.18,width/2,height*.52,height*.78);vignette.addColorStop(.55,'rgba(0,0,0,0)');vignette.addColorStop(1,boosted?'rgba(0,64,86,.3)':'rgba(2,12,24,.34)');ctx.fillStyle=vignette;ctx.fillRect(0,0,width,height);
    if(Math.random()<dt*.035&&game.classList.contains('boosted'))flash=.16;if(flash>0){flash-=dt;ctx.fillStyle=`rgba(180,244,255,${Math.max(0,flash)*.35})`;ctx.fillRect(0,0,width,height)}
    requestAnimationFrame(draw)
  }
  addEventListener('resize',()=>{resize();seed()});resize();seed();requestAnimationFrame(draw)
})();
