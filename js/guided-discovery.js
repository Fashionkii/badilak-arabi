/* Isolated journey experiment. Existing catalog, card and editorial renderers remain authoritative. */
(()=>{
 const panels=[...document.querySelectorAll('main > section')];
 const views=new Set(['home','directory','learning','competitionIndex','guides','knowledge','updates','nominate']);
 let view='home',lastUrl=location.pathname+location.search+location.hash,restoring=false;
 const normalize=id=>id==='top'||id==='start'?'home':id;
 const routeView=()=>/^\/(category|discover)\//.test(location.pathname)?'directory':normalize(location.hash.slice(1))||'home';
 function updateTitle(){
  const title=document.getElementById('journeyResultTitle');if(!title)return;
  title.textContent=originFilter?originContextLabel(originFilter):countryFilter?'اكتشافات من '+(arabProgressCountryNames[countryFilter]||countryFilter):subfilter!=='all'?subcategoryLabel(filter,subfilter):filter!=='all'?categoryLabel(filter):'اكتشف حسب حاجتك';
 }
 function snapshot(){return {view,discovery:window.badilakDiscoveryMemory?.capture(),y:window.scrollY};}
 function remember(){
  if(restoring||/^\/discover\//.test(location.pathname))return;
  history.replaceState({...history.state,journey:snapshot()},'');
 }
 function show(id,options={}){
  const next=normalize(id);if(!views.has(next))return false;
  const previous=view;
  view=next;
  document.body.dataset.journey=view;
  panels.forEach(panel=>{
   const visible=panel.id==='start'?view==='home':panel.id?panel.id===view:
    (panel.classList.contains('commercial-demo-wrap')||panel.classList.contains('ad-demo-end'))?view==='directory':view==='learning';
   panel.hidden=!visible;
   panel.dataset.journeyPanel='';
  });
  if(view==='knowledge'||view==='guides'){
   const body=document.getElementById(view+'Body');
   if(body?.hidden)toggleStaticDisclosure(body.id,document.querySelector('#'+view+' .section-fold-toggle'),'plain');
  }
  document.querySelectorAll('.navigation > a').forEach(a=>{
   const target=a.getAttribute('href');
   if(target==='#'+(view==='home'?'top':view))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('.journey-menu').forEach(menu=>menu.open=false);
  updateTitle();
  if(options.history!==false&&!restoring){
   const current=location.pathname+location.search+location.hash;
   const alreadyRouted=current!==lastUrl&&/^\/category\//.test(location.pathname)&&view==='directory';
   const url=alreadyRouted?current:view==='directory'&&/^\/category\//.test(location.pathname)?current:'/'+location.search+(view==='home'?'':'#'+view);
   const state={...history.state,journey:snapshot()};
   // Preserve the route already pushed by the catalog. Other panels get an ordinary history entry.
   if(alreadyRouted||previous===view)history.replaceState(state,'',url);else history.pushState(state,'',url);
  }
  lastUrl=location.pathname+location.search+location.hash;
  if(options.focus!==false){
   const target=view==='home'?document.querySelector('.origin-heading h2'):view==='directory'?document.getElementById('journeyResultTitle'):document.querySelector('#'+view+' h2');
   if(target){target.tabIndex=-1;target.focus({preventScroll:true});}
   window.scrollTo({top:0,behavior:'instant'});
  }
  return true;
 }
 function restoreHistory(){
  const saved=history.state?.journey;
  if(!saved||!views.has(saved.view))return false;
  restoring=true;
  try{
   show(saved.view,{history:false,focus:false});
   if(saved.discovery){
    // A panel history entry represents the page below the detail layer, not a modal.
    window.badilakDiscoveryMemory?.restore({...saved.discovery,journeyView:saved.view,detail:null});
   }
   requestAnimationFrame(()=>window.scrollTo({top:saved.y||0,behavior:'instant'}));
  }finally{restoring=false;}
  return true;
 }
 window.badilakJourney={show,remember,restoreHistory,updateTitle,get view(){return view;},home(){remember();show('home');}};
 // Ordinary fragment links, footer links and skip link must reveal their target before focusing it.
 document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a[href^="#"]');if(!a||a.hasAttribute('onclick'))return;
  const id=normalize(a.hash.slice(1));if(!views.has(id))return;
  e.preventDefault();remember();show(id);
 });
 window.addEventListener('hashchange',()=>{const next=routeView();if(views.has(next)&&next!==view)show(next,{history:false});});
 document.body.classList.add('guided-discovery');
 show(routeView(),{history:false,focus:false});
 // Defer until discovery-memory and smart-return have registered their own restoration.
 document.addEventListener('DOMContentLoaded',()=>{
  if(!restoreHistory())remember();
 });
})();
