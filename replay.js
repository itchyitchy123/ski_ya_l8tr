(function(){
  'use strict';
  const button=document.getElementById('replayButton');
  const relevant=new Set(['ArrowLeft','ArrowRight','a','d','q','e','w','s','Shift',' ','x','Escape']);
  let events=[],started=0,recording=false;
  const store=(value)=>{try{localStorage.setItem('alpineRushLastReplay',JSON.stringify(value))}catch{}};
  const start=()=>{events=[];started=performance.now();recording=true};
  const stop=()=>{if(!recording)return;recording=false;store({version:1,duration:Math.round(performance.now()-started),events:events.slice(-2500)});};
  new MutationObserver(()=>{const playing=document.getElementById('game')?.classList.contains('playing');if(playing&&!recording)start();if(!playing&&recording)stop()}).observe(document.getElementById('game'),{attributes:true,attributeFilter:['class']});
  addEventListener('keydown',event=>{if(recording&&relevant.has(event.key))events.push([Math.round(performance.now()-started),'down',event.key])});
  addEventListener('keyup',event=>{if(recording&&relevant.has(event.key))events.push([Math.round(performance.now()-started),'up',event.key])});
  button?.addEventListener('click',async()=>{let replay=null;try{replay=JSON.parse(localStorage.getItem('alpineRushLastReplay')||'null')}catch{}if(!replay){button.textContent='NO REPLAY YET';setTimeout(()=>button.textContent='EXPORT REPLAY',1200);return}const encoded=btoa(unescape(encodeURIComponent(JSON.stringify(replay))));try{await navigator.clipboard.writeText(encoded);button.textContent='REPLAY COPIED';setTimeout(()=>button.textContent='EXPORT REPLAY',1400)}catch{button.textContent='COPY BLOCKED';setTimeout(()=>button.textContent='EXPORT REPLAY',1400)}});
  window.AlpineRushReplay={latest:()=>{try{return JSON.parse(localStorage.getItem('alpineRushLastReplay')||'null')}catch{return null}}};
})();
