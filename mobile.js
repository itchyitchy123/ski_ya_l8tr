(function(){
  'use strict';
  const game=document.getElementById('game'),joystick=document.getElementById('joystick'),knob=document.getElementById('joystickKnob'),prompt=document.getElementById('orientationPrompt');
  const coarse=matchMedia('(pointer:coarse)').matches||'ontouchstart'in window;
  if(!coarse)return;
  const key=(type,keyName)=>window.dispatchEvent(new KeyboardEvent(type,{key:keyName,code:keyName===' '?'Space':keyName,bubbles:true}));
  let steering='';
  function steer(next){if(next===steering)return;if(steering)key('keyup',steering);steering=next;if(steering)key('keydown',steering)}
  function release(){steer('');if(knob)knob.style.transform='translate(-50%,-50%)'}
  joystick?.addEventListener('pointerdown',event=>{event.preventDefault();joystick.setPointerCapture?.(event.pointerId);move(event)});
  joystick?.addEventListener('pointermove',event=>{if(event.buttons)move(event)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>joystick?.addEventListener(type,release));
  function move(event){const rect=joystick.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,dx=event.clientX-cx,dy=event.clientY-cy,max=rect.width*.36,amount=Math.min(1,Math.hypot(dx,dy)/max),sensitivity={high:1.35,low:.75,standard:1}[window.AlpinePro?.settings.sensitivity||'standard'],x=Math.max(-1,Math.min(1,dx/max*sensitivity));if(knob)knob.style.transform=`translate(calc(-50% + ${Math.max(-max,Math.min(max,dx))}px),calc(-50% + ${Math.max(-max,Math.min(max,dy))}px))`;steer(Math.abs(x)>.2?(x<0?'ArrowLeft':'ArrowRight'):'');if(amount<.2)release()}
  let touchStart=null;
  const canvas=document.getElementById('gameCanvas');
  canvas?.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')touchStart={x:event.clientX,y:event.clientY,time:Date.now()}});
  canvas?.addEventListener('pointerup',event=>{if(!touchStart||event.pointerType!=='touch')return;const dx=event.clientX-touchStart.x,dy=event.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)<35&&Math.abs(dy)<35)return;if(Math.abs(dx)>Math.abs(dy))pulse(dx<0?'ArrowLeft':'ArrowRight');else if(dy<0)pulse(' ')});
  function pulse(name){if(window.AlpinePro?.settings.haptics==='on')navigator.vibrate?.(12);key('keydown',name);setTimeout(()=>key('keyup',name),180)}
  function orientation(){const portrait=innerHeight>innerWidth;prompt?.classList.toggle('visible',portrait);if(!portrait&&document.fullscreenElement&&screen.orientation?.lock)screen.orientation.lock('landscape').catch(()=>{})}
  addEventListener('resize',orientation);addEventListener('orientationchange',orientation);document.getElementById('orientationContinue')?.addEventListener('click',()=>prompt?.classList.remove('visible'));orientation();
  addEventListener('contextmenu',event=>{if(event.target.closest('#game'))event.preventDefault()});addEventListener('touchmove',event=>{if(event.target.closest('#game'))event.preventDefault()},{passive:false});document.querySelectorAll('.mobile-controls button').forEach(button=>button.addEventListener('pointerdown',()=>{if(window.AlpinePro?.settings.haptics==='on')navigator.vibrate?.(10)}));
  try{const constrained=(navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);if(constrained&&window.AlpinePro?.settings.quality==='high')AlpinePro.setSetting('quality','balanced')}catch{}
})();
