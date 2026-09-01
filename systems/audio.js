(function(global){
  'use strict';

  let context=null;
  let introBuffer=null;
  let introLoading=null;

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

  function playIntroSample(ac){
    if(!introBuffer)return false;
    const source=ac.createBufferSource(),gain=ac.createGain();
    let volume=.8;try{const settings=JSON.parse(global.localStorage?.getItem('alpineRushPro')||'{}');if(Number.isFinite(Number(settings.volume)))volume=Math.max(0,Math.min(1,Number(settings.volume)))}catch{}
    source.buffer=introBuffer;gain.gain.value=.78*volume;source.connect(gain).connect(ac.destination);source.start();
    return true;
  }

  // Original ski-season sting: a clipped, descending garage-rock pulse.
  function intro(){
    if(global.localStorage?.getItem('alpineRushSound')==='off')return;
    const ac=ensure();
    if(!ac)return;
    ac.resume?.().catch(()=>{});
    if(playIntroSample(ac))return;
    if(introLoading)return;
    introLoading=global.fetch('./assets/ski-season-intro.mp3').then(response=>{if(!response.ok)throw new Error('intro sample unavailable');return response.arrayBuffer()}).then(data=>ac.decodeAudioData(data)).then(buffer=>{introBuffer=buffer;playIntroSample(ac)}).catch(()=>{introLoading=null;playProceduralIntro(ac)});
  }

  function playProceduralIntro(ac){
    const start=ac.currentTime+.04;
    const notes=[[82.41,0,.18],[82.41,.24,.16],[98,.48,.16],[110,.72,.22],[73.42,1.08,.18],[82.41,1.32,.18],[123.47,1.56,.2],[110,1.92,.18],[98,2.16,.18],[82.41,2.4,.28],[146.83,2.82,.16],[123.47,3.06,.16],[110,3.3,.34]];
    const master=ac.createGain();
    master.gain.setValueAtTime(.0001,start);master.gain.linearRampToValueAtTime(.14,start+.04);master.gain.setValueAtTime(.14,start+3.42);master.gain.exponentialRampToValueAtTime(.0001,start+3.78);master.connect(ac.destination);
    notes.forEach(([frequency,offset,length])=>{const oscillator=ac.createOscillator(),gain=ac.createGain(),filter=ac.createBiquadFilter();oscillator.type='sawtooth';oscillator.frequency.setValueAtTime(frequency,start+offset);oscillator.frequency.exponentialRampToValueAtTime(frequency*.94,start+offset+length);filter.type='lowpass';filter.frequency.value=1250;filter.Q.value=3.5;gain.gain.setValueAtTime(.0001,start+offset);gain.gain.exponentialRampToValueAtTime(.62,start+offset+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+offset+length);oscillator.connect(filter).connect(gain).connect(master);oscillator.start(start+offset);oscillator.stop(start+offset+length+.03)});
    [0,.48,1.08,1.92,2.82].forEach(offset=>{const oscillator=ac.createOscillator(),gain=ac.createGain();oscillator.type='square';oscillator.frequency.value=58;gain.gain.setValueAtTime(.1,start+offset);gain.gain.exponentialRampToValueAtTime(.0001,start+offset+.075);oscillator.connect(gain).connect(master);oscillator.start(start+offset);oscillator.stop(start+offset+.09)});
  }

  function close(){
    if(context){context.close();context=null}
  }

  global.AlpineRushAudio={ensure,tone,intro,close};
})(window);
