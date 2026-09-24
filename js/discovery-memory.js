/* Remember the visitor's choices before a reading detour, in this tab only.
   smart-return.js owns navigation; this adapter owns the discovery page state. */
(()=>{
 const byId=id=>document.getElementById(id);
 const value=id=>byId(id)?.value||'';
 const text=value=>typeof value==='string'?value.slice(0,300):'';
 const count=(value,max,fallback=0)=>Number.isFinite(value)?Math.max(0,Math.min(max,Math.floor(value))):fallback;
 const types=['platform','resource','channel','reciter'];
 window.badilakDiscoveryMemory={
  capture(){
   return {
    version:1,filter,subfilter,originFilter,countryFilter,directoryVisible,
    search:value('searchInput'),learningType,learningSearch:value('learningSearch'),learningField:value('learningField'),
    sections:{...learningSectionOpen},
    carousels:types.map(type=>{
     const group=byId('learning-group-'+type);
     return {type,index:learningCarouselIndex[type],x:group?.querySelector('.learning-carousel-track')?.scrollLeft||0,browsing:group?.classList.contains('is-browsing')||false};
    }),
    shelf:activeCardShelfId,detail:activeDetail?{...activeDetail,y:document.querySelector('#detailModal .modal-card')?.scrollTop||0}:null,
    metric:currentArabMetric,countries:arabCountryVisible
   };
  },
  restore(state){
   if(!state||state.version!==1||!byId('catalogGrid'))return;
   filter=Object.hasOwn(categoryNames,state.filter)?state.filter:'all';
   subfilter=(subfilterMap[filter]||[]).some(([id])=>id===state.subfilter)?state.subfilter:'all';
   originFilter=Object.hasOwn(originRouteMap,state.originFilter)?state.originFilter:null;
   countryFilter=Object.hasOwn(arabProgressCountryNames,state.countryFilter)?state.countryFilter:null;
   directoryVisible=Math.max(1,count(state.directoryVisible,items.length,directoryBatchSize()));
   byId('searchInput').value=text(state.search);
   document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
   document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.origin===originFilter)));
   buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();renderCards();
   if(state.search){
    byId('directoryRefineSearch')?.removeAttribute('hidden');
    document.querySelector('[data-refine-trigger="search"]')?.setAttribute('aria-expanded','true');
   }

   learningType=types.includes(state.learningType)?state.learningType:'all';
   byId('learningSearch').value=text(state.learningSearch);
   const field=byId('learningField');
   field.value=[...field.options].some(o=>o.value===state.learningField)?state.learningField:'all';
   for(const type of ['channel','reciter'])learningSectionOpen[type]=state.sections?.[type]===true;
   document.querySelectorAll('[data-learning-type]').forEach(b=>b.classList.toggle('active',b.dataset.learningType===learningType));
   renderLearning();
   for(const saved of Array.isArray(state.carousels)?state.carousels:[]){
    if(!types.includes(saved.type))continue;
    const group=byId('learning-group-'+saved.type);if(!group)continue;
    learningCarouselIndex[saved.type]=count(saved.index,learning.length);
    group.classList.toggle('is-browsing',saved.browsing===true);
    const more=group.querySelector('.learning-carousel-more-wrap');if(more)more.hidden=saved.browsing===true;
    const track=group.querySelector('.learning-carousel-track');
    if(track&&Number.isFinite(saved.x))track.scrollTo({left:saved.x,behavior:'instant'});
   }
   if(Object.hasOwn(arabProgressData,state.metric)){
    arabCountryVisible=Math.max(3,count(state.countries,arabProgressData[state.metric].rows.length,3));
    renderArabProgress(state.metric);
   }
   const shelfItem=items.find(x=>x.id===state.shelf);
   const shelfButton=shelfItem&&document.querySelector(`[data-item-id="${shelfItem.id}"] .more-btn`);
   if(shelfButton)openCardShelf(shelfItem.id,shelfButton,false);
   const detail=state.detail;
   if(detail?.kind==='directory'&&items.some(x=>x.id===detail.id)){
    document.querySelector(`[data-item-id="${detail.id}"] .item-identity`)?.focus({preventScroll:true});
    openDetail(detail.id);
   }else if(detail?.kind==='learning'&&learning.some(x=>x.id===detail.id)){
    document.querySelector(`[data-learning-id="${detail.id}"] .learning-actions button`)?.focus({preventScroll:true});
    showLearningNote(detail.id);
   }
   if(activeDetail){
    const modal=document.querySelector('#detailModal .modal-card');
    if(modal)modal.scrollTop=count(detail.y,modal.scrollHeight);
   }
  }
 };
})();
