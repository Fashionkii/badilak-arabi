(()=>{
 const BACK='badilak_nav_stack_v1', FORWARD='badilak_nav_forward_v2', RESTORE='badilak_nav_restore_v1';
 const MAX=8, TTL=4*60*60*1000;
 const samePage=(a,b)=>{try{const x=new URL(a,location.href),y=new URL(b,location.href);return x.origin===y.origin&&x.pathname===y.pathname&&x.search===y.search&&x.hash===y.hash}catch{return a===b}};
 const isInternal=u=>{try{const x=new URL(u,location.href);if(x.origin!==location.origin)return false;return x.pathname==='/'||x.pathname==='/guides'||/^\/guides\/[^/]+$/.test(x.pathname)}catch{return false}};
 const read=(k,fallback)=>{try{return JSON.parse(sessionStorage.getItem(k)||'')||fallback}catch{return fallback}};
 const write=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}};
 const cleanStack=k=>{const now=Date.now();return (read(k,[])||[]).filter(x=>x&&x.url&&now-(x.ts||0)<TTL).slice(-MAX)};
 const getBack=()=>cleanStack(BACK), setBack=s=>write(BACK,s.slice(-MAX));
 const getForward=()=>cleanStack(FORWARD), setForward=s=>write(FORWARD,s.slice(-MAX));
 const snapshot=()=>({url:location.href,y:Math.max(0,Math.round(window.scrollY||0)),title:document.title,ts:Date.now(),discovery:window.badilakDiscoveryMemory?.capture()});

 // A saved directory dialog needs the discovery runtime; a fresh service URL does not.
 function restoreVisit(target,replace=false){
  const destination=new URL(target.url,location.href);
  if(target.discovery&&destination.origin===location.origin&&/^\/discover\//.test(destination.pathname)){
   destination.pathname='/';destination.search='';destination.hash='#directory';
  }
  write(RESTORE,{...target,url:destination.href});
  location[replace?'replace':'assign'](destination.href);
 }

 function pushUnique(stack,item){
  if(stack.length&&samePage(stack[stack.length-1].url,item.url))stack[stack.length-1]=item;
  else stack.push(item);
  return stack.slice(-MAX);
 }
 function pushCurrent(clearForward=true){
  setBack(pushUnique(getBack(),snapshot()));
  if(clearForward)setForward([]);
 }
 function trimCurrent(stack){
  while(stack.length&&samePage(stack[stack.length-1].url,location.href))stack.pop();
  return stack;
 }

 function installStyles(){
  if(document.getElementById('badilak-smart-return-style'))return;
  const st=document.createElement('style');st.id='badilak-smart-return-style';
  st.textContent=`
  .badilak-nav-memory{
   position:fixed;top:76px;left:16px;z-index:74;display:flex;align-items:center;gap:7px;
   direction:rtl;pointer-events:none
  }
  .badilak-smart-memory{
   width:38px;height:38px;min-width:38px;min-height:38px;padding:0;
   display:grid;place-items:center;
   border-radius:50%;border:1px solid rgba(23,63,61,.22);
   background:rgba(255,253,248,.96);color:#173F3D;box-shadow:0 6px 18px rgba(23,63,61,.09);
   font-family:"Cairo","IBM Plex Sans Arabic",Tahoma,sans-serif;font-size:.66rem;font-weight:800;
   cursor:pointer;backdrop-filter:blur(7px);transition:transform .15s ease,box-shadow .15s ease,opacity .15s ease;
   pointer-events:auto
  }
  .badilak-smart-memory:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(23,63,61,.13)}
  .badilak-smart-memory .arr{font-size:1.12rem;line-height:1}
  .badilak-smart-forward{
   background:rgba(238,244,240,.97);border-color:rgba(23,63,61,.17)
  }
  @media(max-width:760px){
   .badilak-nav-memory{top:68px;left:9px;gap:5px}
   .badilak-smart-memory{width:36px;height:36px;min-width:36px;min-height:36px;padding:0}
  }
  @media(max-width:430px){
   .badilak-smart-memory{width:34px;height:34px;min-width:34px;min-height:34px}
  }
  @media(prefers-reduced-motion:reduce){.badilak-smart-memory{transition:none!important}}
  `;
  document.head.appendChild(st);
 }

 function renderMemory(){
  document.getElementById('badilakNavMemory')?.remove();

  let back=trimCurrent(getBack());
  let forward=trimCurrent(getForward());
  setBack(back);setForward(forward);
  if(!back.length&&!forward.length)return;

  installStyles();
  const wrap=document.createElement('div');
  wrap.id='badilakNavMemory';wrap.className='badilak-nav-memory';
  wrap.setAttribute('aria-label','ذاكرة التنقل');

  if(back.length){
   const b=document.createElement('button');
   b.className='badilak-smart-memory badilak-smart-back';b.type='button';
   b.title='يرجعك لنفس المكان الذي كنت فيه قبل الانتقال';
   b.setAttribute('aria-label','ارجع لمكانك');b.innerHTML='<span class="arr" aria-hidden="true">↩</span>';
   b.addEventListener('click',()=>{
    const st=trimCurrent(getBack()), target=st.pop();if(!target)return;
    const current=snapshot();
    setBack(st);
    setForward(pushUnique(getForward(),current));
    restoreVisit(target);
   });
   wrap.appendChild(b);
  }

  if(forward.length){
   const f=document.createElement('button');
   f.className='badilak-smart-memory badilak-smart-forward';f.type='button';
   f.title='يرجعك للمكان الذي تركته عندما استخدمت الرجوع';
   f.setAttribute('aria-label','كمّل من هناك');f.innerHTML='<span class="arr" aria-hidden="true">↪</span>';
   f.addEventListener('click',()=>{
    const st=trimCurrent(getForward()), target=st.pop();if(!target)return;
    const current=snapshot();
    setForward(st);
    setBack(pushUnique(getBack(),current));
    restoreVisit(target);
   });
   wrap.appendChild(f);
  }

  document.body.appendChild(wrap);
 }

 function restoreIfNeeded(){
  const historyVisit=performance.getEntriesByType('navigation')[0]?.type==='back_forward';
  const previous=historyVisit?[...getBack(),...getForward()].filter(x=>samePage(x.url,location.href)).sort((a,b)=>b.ts-a.ts)[0]:null;
  const r=read(RESTORE,null)||previous;if(!r||!r.url||Date.now()-(r.ts||0)>=TTL)return;
  if(!samePage(r.url,location.href))return;
  if(r.discovery&&!window.badilakDiscoveryMemory&&/^\/discover\//.test(location.pathname)){restoreVisit(r,true);return;}
  try{sessionStorage.removeItem(RESTORE)}catch{}
  window.badilakDiscoveryMemory?.restore(r.discovery);
  if('scrollRestoration'in history)history.scrollRestoration='manual';
  const y=Number(r.y)||0;
  const go=()=>window.scrollTo({top:y,left:0,behavior:'auto'});
  requestAnimationFrame(()=>requestAnimationFrame(go));
  setTimeout(go,120);setTimeout(go,420);
 }

 document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest?.('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
  let u;try{u=new URL(a.href,location.href)}catch{return}
  if(!isInternal(u.href))return;
  const cur=new URL(location.href);
  if(u.pathname===cur.pathname&&u.search===cur.search)return;
  pushCurrent(true);
 },true);

 window.badilakNavigate=function(url){
  if(isInternal(url))pushCurrent(true);
  location.href=url;
 };

 function init(){restoreIfNeeded();renderMemory()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.addEventListener('pageshow',()=>setTimeout(renderMemory,0));
})();

/* Temporary lab-only social destinations until the official page links are supplied. */
(()=>{
 const install=()=>{
  const footer=document.querySelector('body>footer,footer.footer');
  if(!footer||footer.querySelector('.badilak-social-links'))return;
  const nav=document.createElement('nav');
  nav.className='badilak-social-links';
  nav.setAttribute('aria-label','منصات التواصل — روابط تجريبية');
  nav.innerHTML=`
  <a href="https://badilak-lab.vercel.app/" aria-label="Facebook — رابط تجريبي إلى الرئيسية" title="Facebook — رابط مؤقت إلى المختبر"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M14.5 21v-8h2.7l.4-3.2h-3.1V7.9c0-1 .3-1.6 1.7-1.6h1.6V3.5c-.3 0-1.3-.2-2.5-.2-2.6 0-4.3 1.5-4.3 4.4v2.1H8v3.2h3V21z" fill="currentColor"/></svg></a>
  <a href="https://badilak-lab.vercel.app/" aria-label="Instagram — رابط تجريبي إلى الرئيسية" title="Instagram — رابط مؤقت إلى المختبر"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.7" cy="6.4" r="1.2" fill="currentColor"/></svg></a>
  <a href="https://badilak-lab.vercel.app/" aria-label="X — رابط تجريبي إلى الرئيسية" title="X — رابط مؤقت إلى المختبر"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M4 3h4.2l11.8 18h-4.2L4 3zm15.3 0-6.4 7.4M4.6 21l6.5-7.5" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/></svg></a>
  <a href="https://badilak-lab.vercel.app/" aria-label="YouTube — رابط تجريبي إلى الرئيسية" title="YouTube — رابط مؤقت إلى المختبر"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="m10 9 6 3-6 3z" fill="currentColor"/></svg></a>
  <a href="https://badilak-lab.vercel.app/" aria-label="TikTok — رابط تجريبي إلى الرئيسية" title="TikTok — رابط مؤقت إلى المختبر"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M15 2v12.5a4 4 0 1 1-4-4v3a1 1 0 1 0 1 1V2h3zm0 0c.4 2.3 2.2 4.2 5 4.5v3c-1.9-.1-3.6-.7-5-1.9V2z" fill="currentColor"/></svg></a>
  `;
  const insertAt=footer.querySelector('.footer-inner')||footer.querySelector('.wrap')||footer;
  insertAt.appendChild(nav);
  const css=document.createElement('style');
  css.id='badilak-social-style';
  css.textContent=`
  .badilak-social-links{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;direction:ltr}
  .badilak-social-links a{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;min-width:36px;
   border:1px solid currentColor;border-radius:10px;color:inherit!important;background:rgba(255,255,255,.06);
   opacity:.88;text-decoration:none!important;transition:opacity .16s ease,background-color .16s ease}
  .badilak-social-links a:hover{opacity:1;background:rgba(165,191,181,.16)}
  .badilak-social-links a:focus-visible{outline:3px solid #c39543;outline-offset:3px}
  .badilak-social-links svg{width:19px;height:19px;display:block}
  @media(max-width:760px){.badilak-social-links{width:100%;justify-content:center;gap:9px}}
  @media(prefers-reduced-motion:reduce){.badilak-social-links a{transition:none}}
  `;
  document.head.appendChild(css);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
 else install();
})();
