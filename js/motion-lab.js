/* Preview comparison controls only. No application state or persistent storage. */
(()=>{
 'use strict';
 if(window.parent===window)return;
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==window.parent)return;
  const data=event.data;
  if(!data||data.type!=='badilak-design-preview')return;
  if(typeof data.enabled==='boolean')document.body.classList.toggle('motion-lab',data.enabled);
  if(typeof data.motion==='boolean')document.documentElement.dataset.previewMotion=data.motion?'on':'off';
 });
 window.parent.postMessage({type:'badilak-design-ready'},location.origin);
})();
