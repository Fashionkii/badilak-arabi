/* Isolated journey experiment. Existing catalog, card and editorial renderers remain authoritative. */
(()=>{
 const panels=[...document.querySelectorAll('main > section')];
 const views=new Set(['home','directory','learning','competitionIndex','guides','knowledge','updates','nominate']);
 let view='home',lastUrl=location.pathname+location.search+location.hash,restoring=false;
 const normalize=id=>id==='top'||id==='start'?'home':id==='learning'?'directory':id;
 const routeView=()=>/^\/(category|discover)\//.test(location.pathname)?'directory':location.hash.slice(1)||'home';
 function updateTitle(){
  const title=document.getElementById('journeyResultTitle');if(!title)return;
  title.textContent=discoveryPaths[discoveryPath]?discoveryPaths[discoveryPath].name:originFilter?originContextLabel(originFilter):countryFilter?'اكتشافات من '+(arabProgressCountryNames[countryFilter]||countryFilter):subfilter!=='all'?subcategoryLabel(filter,subfilter):filter!=='all'?categoryLabel(filter):discoveryPurpose==='learn'?'تعلّم خطوة، ثم طبّقها':discoveryPurpose==='use'?'ابحث عمّا يساعدك على الإنجاز':'أداة تنجز بها، أو مصدر تتعلّم منه';
 }
 function snapshot(){return {view,discovery:window.badilakDiscoveryMemory?.capture(),y:window.scrollY};}
 function remember(){
  if(restoring||/^\/discover\//.test(location.pathname))return;
  history.replaceState({...history.state,journey:snapshot()},'');
 }
 function show(id,options={}){
  const next=normalize(id);if(!views.has(next))return false;
  if(id==='learning')enterUnifiedLearning();
  const previous=view;
  view=next;
  document.body.dataset.journey=view;
  panels.forEach(panel=>{
   const visible=panel.id==='start'?view==='home':panel.id?panel.id===view:
    panel.dataset.journeyPanel?panel.dataset.journeyPanel===view:
    (panel.classList.contains('commercial-demo-wrap')||panel.classList.contains('ad-demo-end'))?view==='directory':false;
   panel.hidden=!visible;
   // Preserve the static panel identity used before JavaScript loads.
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
  // A genuine section-to-directory visit may rotate discovery cards.
  // Initial routing and browser history restoration deliberately skip this.
  if(view==='directory'&&previous!==view&&options.history!==false){
   window.badilakDirectoryRotation?.enter();
  }
  window.badilakHomeOrigins?.navigate(view);
  ensureJourneyPanel(view);
  updateTitle();
  if(options.history!==false&&!restoring){
   const current=location.pathname+location.search+location.hash;
   const alreadyRouted=current!==lastUrl&&/^\/category\//.test(location.pathname)&&view==='directory';
   const url=view==='directory'?discoveryLocation():view==='home'?'/':'/#'+view;
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
  const id=a.hash.slice(1);if(!views.has(normalize(id)))return;
  e.preventDefault();remember();show(id);
 });
 window.addEventListener('hashchange',()=>{const next=routeView();if(views.has(next)&&next!==view)show(next,{history:false});});
 document.body.classList.add('guided-discovery');
 show(routeView(),{history:false,focus:false});
 // Defer until discovery-memory and smart-return have registered their own restoration.
 document.addEventListener('DOMContentLoaded',()=>{
  if(!restoreHistory())remember();
  const learningId=new URLSearchParams(location.search).get('learn');
  if(learning.some(x=>x.id===learningId)){
   show('learning',{history:false,focus:false});
   document.getElementById('journeyResultTitle').tabIndex=-1;
   document.getElementById('journeyResultTitle').focus({preventScroll:true});
   showLearningNote(learningId);
  }
 });
})();
