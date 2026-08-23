(function(){
  'use strict';
  const panel=document.getElementById('debugPanel');
  if(!panel)return;
  let visible=false,frames=0,last=performance.now(),sample=last;
  const $=id=>document.getElementById(id);
  addEventListener('keydown',event=>{if(event.key==='F3'){event.preventDefault();visible=!visible;panel.classList.toggle('visible',visible)}});
  function tick(now){frames++;if(now-sample>=500){$('debugFps').textContent=Math.round(frames*1000/(now-sample));$('debugFrame').textContent=`${(now-sample)/frames|0} ms`;$('debugCanvas').textContent=`${innerWidth}×${innerHeight} · ${devicePixelRatio||1}×`;$('debugNetwork').textContent=navigator.onLine?'ONLINE':'OFFLINE';frames=0;sample=now}last=now;requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
})();
