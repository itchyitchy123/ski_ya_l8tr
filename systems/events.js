(function(global){
  'use strict';

  const listeners=new Map();

  function on(name,handler){
    if(typeof handler!=='function')return()=>{};
    const set=listeners.get(name)||new Set();
    set.add(handler);
    listeners.set(name,set);
    return()=>set.delete(handler);
  }

  function emit(name,payload){
    const set=listeners.get(name);
    if(!set)return;
    [...set].forEach(handler=>{
      try{handler(payload)}catch(error){setTimeout(()=>{throw error},0)}
    });
  }

  global.AlpineRushEvents={on,emit};
})(window);
