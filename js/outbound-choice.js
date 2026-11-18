/* One exit choice for directory dialogs and directly opened service pages. */
(()=>{
 let dialog,returnFocus;
 function open(options){
  let url;try{url=new URL(options.url);if(!['https:','http:'].includes(url.protocol))return;}catch{return;}
  returnFocus=document.activeElement;
  if(!dialog){
   dialog=document.createElement('dialog');dialog.id='outboundDialog';dialog.className='outbound-dialog';
   dialog.setAttribute('aria-labelledby','outboundTitle');dialog.setAttribute('aria-describedby','outboundDescription');
   dialog.innerHTML='<h2 id="outboundTitle"></h2><p id="outboundDescription">يفتح الموقع في علامة تبويب جديدة، ويمكنك متابعة التصفح هنا أولًا.<span class="outbound-domain"></span></p><a class="outbound-continue" target="_blank">الانتقال إلى الموقع ↗</a><button type="button" class="outbound-dismiss">متابعة التصفح أولًا</button>';
   document.body.appendChild(dialog);
   dialog.addEventListener('close',()=>{document.body.classList.remove('outbound-open');if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
   dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
   window.addEventListener('popstate',()=>{if(dialog.open)dialog.close();});
  }
  dialog.querySelector('h2').textContent=options.name;
  dialog.querySelector('.outbound-domain').textContent=options.domain||url.hostname;
  const link=dialog.querySelector('.outbound-continue');link.href=url.href;
  link.rel=options.affiliate?'sponsored noopener noreferrer':'noopener noreferrer';
  link.setAttribute('aria-label','الانتقال إلى '+options.name+' — يفتح في علامة تبويب جديدة');
  link.onclick=()=>{dialog.close();options.onContinue?.();};
  dialog.querySelector('.outbound-dismiss').onclick=()=>dialog.close();
  document.body.classList.add('outbound-open');if(!dialog.open)dialog.showModal();link.focus({preventScroll:true});
 }
 window.badilakOutbound={open};
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('.standalone-detail a.destination-link');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();const article=link.closest('.standalone-detail');
  open({name:article.querySelector('h1').textContent.trim(),url:link.href,domain:link.querySelector('small')?.textContent,affiliate:link.rel.split(/\s+/).includes('sponsored'),
   onContinue:()=>document.dispatchEvent(new CustomEvent('badilak:outbound',{detail:{id:location.pathname.split('/').pop(),kind:link.rel.split(/\s+/).includes('sponsored')?'affiliate':'official'}}))
  });
 });
})();
