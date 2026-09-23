(()=>{
 const BACK='badilak_nav_stack_v1', FORWARD='badilak_nav_forward_v2', RESTORE='badilak_nav_restore_v1';
 const MAX=8, TTL=4*60*60*1000;
 const samePage=(a,b)=>{try{const x=new URL(a,location.href),y=new URL(b,location.href);return x.origin===y.origin&&x.pathname===y.pathname&&x.search===y.search&&x.hash===y.hash}catch{return a===b}};
 const isInternal=u=>{try{const x=new URL(u,location.href);if(x.origin!==location.origin)return false;return /\/(lab\.html|lab-guides\.html|lab-guide-[^/]+\.html)$/.test(x.pathname)}catch{return false}};
 const read=(k,fallback)=>{try{return JSON.parse(sessionStorage.getItem(k)||'')||fallback}catch{return fallback}};
 const write=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}};
 const cleanStack=k=>{const now=Date.now();return (read(k,[])||[]).filter(x=>x&&x.url&&now-(x.ts||0)<TTL).slice(-MAX)};
 const getBack=()=>cleanStack(BACK), setBack=s=>write(BACK,s.slice(-MAX));
 const getForward=()=>cleanStack(FORWARD), setForward=s=>write(FORWARD,s.slice(-MAX));
 const snapshot=()=>({url:location.href,y:Math.max(0,Math.round(window.scrollY||0)),title:document.title,ts:Date.now()});

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
   display:inline-flex;align-items:center;gap:7px;min-height:34px;padding:6px 11px;
   border-radius:999px;border:1px solid rgba(23,63,61,.22);
   background:rgba(255,253,248,.96);color:#173F3D;box-shadow:0 6px 18px rgba(23,63,61,.09);
   font-family:"Cairo","IBM Plex Sans Arabic",Tahoma,sans-serif;font-size:.66rem;font-weight:800;
   cursor:pointer;backdrop-filter:blur(7px);transition:transform .15s ease,box-shadow .15s ease,opacity .15s ease;
   pointer-events:auto;white-space:nowrap
  }
  .badilak-smart-memory:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(23,63,61,.13)}
  .badilak-smart-memory .arr{font-size:.9rem;line-height:1}
  .badilak-smart-forward{
   background:rgba(238,244,240,.97);border-color:rgba(23,63,61,.17)
  }
  @media(max-width:760px){
   .badilak-nav-memory{top:68px;left:9px;gap:5px}
   .badilak-smart-memory{min-height:32px;padding:5px 9px;font-size:.61rem;gap:5px}
  }
  @media(max-width:430px){
   .badilak-smart-memory{padding:5px 8px;font-size:.58rem}
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
   b.innerHTML='<span class="arr" aria-hidden="true">↩</span><span>ارجع لمكانك</span>';
   b.addEventListener('click',()=>{
    const st=trimCurrent(getBack()), target=st.pop();if(!target)return;
    const current=snapshot();
    setBack(st);
    setForward(pushUnique(getForward(),current));
    write(RESTORE,target);
    location.href=target.url;
   });
   wrap.appendChild(b);
  }

  if(forward.length){
   const f=document.createElement('button');
   f.className='badilak-smart-memory badilak-smart-forward';f.type='button';
   f.title='يرجعك للمكان الذي تركته عندما استخدمت الرجوع';
   f.innerHTML='<span class="arr" aria-hidden="true">↪</span><span>كمّل من هناك</span>';
   f.addEventListener('click',()=>{
    const st=trimCurrent(getForward()), target=st.pop();if(!target)return;
    const current=snapshot();
    setForward(st);
    setBack(pushUnique(getBack(),current));
    write(RESTORE,target);
    location.href=target.url;
   });
   wrap.appendChild(f);
  }

  document.body.appendChild(wrap);
 }

 function restoreIfNeeded(){
  const r=read(RESTORE,null);if(!r||!r.url)return;
  if(!samePage(r.url,location.href))return;
  try{sessionStorage.removeItem(RESTORE)}catch{}
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