(function(global){
  'use strict';

  const listeners=new Set();
  const bindings=new Map([
    ['ArrowLeft','left'],['a','left'],['A','left'],
    ['ArrowRight','right'],['d','right'],['D','right'],
    ['q','spinL'],['Q','spinL'],['e','spinR'],['E','spinR'],
    ['w','frontFlip'],['W','frontFlip'],['s','backFlip'],['S','backFlip'],
    ['Shift','grab']
  ]);

  function onAction(handler){
    if(typeof handler!=='function')return()=>{};
    listeners.add(handler);
    return()=>listeners.delete(handler);
  }

  function dispatch(action,pressed,event){
    listeners.forEach(handler=>handler({action,pressed,event}));
  }

  global.addEventListener('keydown',event=>{
    const action=bindings.get(event.key);
    if(action){dispatch(action,true,event);return}
    if(event.code==='Space'){event.preventDefault();dispatch('jump',true,event);return}
    if(['p','P','Escape'].includes(event.key)){event.preventDefault();dispatch('pause',true,event);return}
    if(['x','X'].includes(event.key)){dispatch('boost',true,event)}
  });

  global.addEventListener('keyup',event=>{
    const action=bindings.get(event.key);
    if(action)dispatch(action,false,event);
  });

  global.AlpineRushInput={onAction};
})(window);
