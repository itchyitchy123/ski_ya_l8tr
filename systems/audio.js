(function(global){
  'use strict';

  let context=null;

  function ensure(){
    if(context)return context;
    const AudioContext=global.AudioContext||global.webkitAudioContext;
    if(!AudioContext)return null;
    context=new AudioContext();
    return context;
  }

  function tone(freq,duration,type='triangle',volume=.045){
    const ac=ensure();
    if(!ac)return;
    ac.resume?.().catch(()=>{});
    const oscillator=ac.createOscillator();
    const gain=ac.createGain();
    oscillator.type=type;
    oscillator.frequency.value=freq;
    gain.gain.setValueAtTime(volume,ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);
    oscillator.connect(gain);
    gain.connect(ac.destination);
    oscillator.start();
    oscillator.stop(ac.currentTime+duration);
  }

  function close(){
    if(context){context.close();context=null}
  }

  global.AlpineRushAudio={ensure,tone,close};
})(window);
