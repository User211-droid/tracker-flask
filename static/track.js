(function(){
  function beacon(data){
    new Image().src = '/collect?' + new URLSearchParams(data);
  }
  window.addEventListener('load', function(){
    var d = {
      ua: navigator.userAgent,
      lang: navigator.language,
      platform: navigator.platform,
      screen: screen.width+'x'+screen.height,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      mem: navigator.deviceMemory||'',
      cores: navigator.hardwareConcurrency||'',
      cookies: navigator.cookieEnabled,
      ref: document.referrer
    };
    // Canvas fingerprint
    try {
      var c=document.createElement('canvas'),ctx=c.getContext('2d');
      ctx.textBaseline='top'; ctx.font='16px Arial'; ctx.fillStyle='#069';
      ctx.fillText('FP',2,2);
      d.canvas=c.toDataURL();
    } catch(e){}
    collectWebRTC(d);
  });

  function collectWebRTC(d){
    try {
      var pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
      pc.onicecandidate = evt => {
        if(evt.candidate){
          var ips=evt.candidate.candidate.match(/\b\d{1,3}(\.\d{1,3}){3}\b/g);
          if(ips) d.webrtc = ips;
        } else {
          beacon(d);
        }
      };
      pc.createDataChannel('');
      pc.createOffer().then(o=>pc.setLocalDescription(o));
    } catch(e){
      beacon(d);
    }
  }
})();
