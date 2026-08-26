(function(global){
  'use strict';

  const events=global.AlpineRushEvents;
  if(!events)return;

  const game=()=>document.getElementById('game');

  function setState(state,data={}){
    const root=game();
    if(!root)return;
    root.dataset.runState=state;
    Object.entries(data).forEach(([key,value])=>{
      if(value!==undefined&&value!==null)root.dataset[key]=String(value);
    });
  }

  events.on('run:start',data=>setState('playing',data));
  events.on('run:pause',data=>setState(data?.state||'paused'));
  events.on('run:finish',data=>setState('finished',data));
  events.on('player:crash',data=>setState('crashed',{lastEvent:'crash',lives:data?.lives}));
  events.on('surface:change',data=>setState('playing',{surface:data?.surface}));
})(window);
