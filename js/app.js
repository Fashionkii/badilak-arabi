/* main-runtime */
const initializedJourneyPanels=new Set();

function countryInfoHasCode(info,code){
 return countryEntries(info).some(v=>v&&v[0]===code);
}
let filter='all',subfilter='all',originFilter=null,countryFilter=null,learningType='all';
let directoryVisible=window.matchMedia('(max-width:760px)').matches?3:6;
let learningVisible={platform:4,channel:4,reciter:4};
const learningSectionOpen={channel:false,reciter:false};
const learningCarouselIndex={platform:0,resource:0,channel:0,reciter:0};

function directoryBatchSize(){
 const mobile=window.matchMedia('(max-width:760px)').matches;
 const q=(document.getElementById('searchInput')?.value||'').trim();
 const focused=filter!=='all'||subfilter!=='all'||!!originFilter||!!countryFilter||!!q;
 return mobile||focused ? 3 : 6;
}
function resetDirectoryLimit(){directoryVisible=directoryBatchSize()}
function showMoreDirectory(){directoryVisible+=directoryBatchSize();renderCards()}
function resetLearningLimit(){learningVisible={platform:4,resource:4,channel:4,reciter:4}}
function showMoreLearning(type){enableLearningCarousel(type)}

function go(id){
 if(window.badilakJourney?.show(id))return;
 document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
}
function categoryLabel(v){return categoryNames[v]||v}

function closeDirectoryRefiners(){
 document.querySelectorAll('.directory-refine-panel').forEach(p=>p.setAttribute('hidden',''));
 document.querySelectorAll('[data-refine-trigger]').forEach(b=>b.setAttribute('aria-expanded','false'));
}
function toggleDirectoryRefine(kind,btn){
 const map={search:'directoryRefineSearch',category:'directoryRefineCategory',sub:'directoryRefineSub'};
 const panel=document.getElementById(map[kind]);if(!panel)return;
 const opening=panel.hasAttribute('hidden');
 closeDirectoryRefiners();
 if(opening){
  panel.removeAttribute('hidden');
  if(btn)btn.setAttribute('aria-expanded','true');
  if(kind==='search')setTimeout(()=>document.getElementById('searchInput')?.focus(),30);
 }
}
function updateDirectoryRefineUI(){
 const root=document.getElementById('directoryActiveFilters');if(!root)return;
 const bits=[];
 if(countryFilter){
  const label=arabProgressCountryNames[countryFilter]||countryFilter;
  bits.push(`<span class="active-filter-pill has-flag"><img src="${flagAssetBase+countryFilter+'.png'}" alt=""><bdi>${label}</bdi></span>`);
 }
 if(originFilter)bits.push(`<span class="active-filter-pill"><bdi>من ${originContextLabel(originFilter)}</bdi></span>`);
 if(filter!=='all')bits.push(`<span class="active-filter-pill"><bdi>${categoryLabel(filter)}</bdi></span>`);
 if(subfilter!=='all')bits.push(`<span class="active-filter-pill"><bdi>${subcategoryLabel(filter,subfilter)}</bdi></span>`);
 const q=document.getElementById('searchInput')?.value.trim()||'';
 if(q)bits.push(`<span class="active-filter-pill search-pill"><bdi>بحث: ${q.replace(/[<>&"]/g,'')}</bdi></span>`);
 const contextWrap=root.closest('.directory-active-context');
 if(contextWrap)contextWrap.hidden=!bits.length;
 root.innerHTML=bits.length?bits.join(''):'';

 const subBtn=document.getElementById('subfilterTrigger');
 if(subBtn){
  const hasSub=filter!=='all'&&Array.isArray(subfilterMap[filter])&&subfilterMap[filter].length>1;
  subBtn.hidden=!hasSub;
  if(!hasSub){
   const panel=document.getElementById('directoryRefineSub');if(panel)panel.setAttribute('hidden','');
   subBtn.setAttribute('aria-expanded','false');
  }
 }
}
function goDirectoryResults(){
 if(window.badilakJourney?.show('directory'))return;
 const el=document.getElementById('directoryResultsStart')||document.getElementById('catalogGrid')||document.getElementById('directory');
 if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
}

function syncCategoryRoute(cat){
 if(!cat||cat==='all'||!categoryNames[cat])return;
 const path='/category/'+encodeURIComponent(cat);
 if(location.pathname===path)return;
 const state={badilakCategory:cat};
 if(/^\/category\//.test(location.pathname))history.replaceState(state,'',path);
 else history.pushState(state,'',path);
}
function openDirectory(cat,options={}){
 window.badilakJourney?.remember();
 if(options.route!==false)syncCategoryRoute(cat);
 setDirectoryFilter(cat);
 closeDirectoryRefiners();
 goDirectoryResults();
}
function setDirectoryFilter(v){
 filter=v;
 subfilter='all';
 originFilter=null;
 countryFilter=null;
 resetDirectoryLimit();
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===v));
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
}
function setFilter(v,el){
 filter=v;
 subfilter='all';
 if(originFilter){
  const route=originRouteMap[originFilter]||{cat:'all',sub:'all'};
  if(v!=='all'&&route.cat!==v){
   originFilter=null;
   document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
  }
 }
 resetDirectoryLimit();
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===v));
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
 if(v==='all'){
  if(/^\/category\//.test(location.pathname))history.replaceState({},'','/');
 }else if(!originFilter){
  syncCategoryRoute(v);
 }
}
function setSubfilter(v,el){
 subfilter=v;
 if(originFilter){
  const hasRelatedItems=items.some(x=>x.origin.includes(originFilter)&&(filter==='all'||x.cat===filter)&&x.sub===v);
  if(v!=='all'&&!hasRelatedItems){
   originFilter=null;
   document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
  }
 }
 resetDirectoryLimit();
 document.querySelectorAll('[data-subfilter]').forEach(b=>b.classList.remove('active'));
 if(el)el.classList.add('active');
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
}
function buildSubfilters(){
 const row=document.getElementById('subfilterRow'),root=document.getElementById('subfilters');
 if(filter==='all'||!subfilterMap[filter]){row.style.display='none';root.innerHTML='';return}
 row.style.display='flex';
 root.innerHTML=subfilterMap[filter].map(([id,label])=>
   `<button class="subfilter ${id===subfilter?'active':''}" data-subfilter="${id}" onclick="setSubfilter('${id}',this)">${label}</button>`
 ).join('');
}
function updateDirectoryCrumb(){
 const wrap=document.getElementById('directoryCrumbWrap'),el=document.getElementById('directoryCrumb');
 if(filter==='all'&&subfilter==='all'&&!originFilter&&!countryFilter){
  wrap.style.display='none';
  updateDirectoryRefineUI();
  return;
 }
 const parts=[];
 if(filter!=='all') parts.push(categoryLabel(filter));
 if(subfilter!=='all') parts.push(subcategoryLabel(filter,subfilter));
 if(originFilter) parts.push(originContextLabel(originFilter));
 if(countryFilter) parts.push(arabProgressCountryNames[countryFilter]||countryFilter);
 el.textContent=parts.join(' / ');
 wrap.style.display=parts.length?'inline':'none';
 updateDirectoryRefineUI();
}
function resetAllAndHome(){
 window.badilakJourney?.remember();
 if(!window.badilakJourney&&location.pathname!=='/')history.replaceState({},'','/');
 // Directory state
 filter='all';
 subfilter='all';
 originFilter=null;
 countryFilter=null;
 const searchInput=document.getElementById('searchInput');
 if(searchInput) searchInput.value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(
   b=>b.classList.toggle('active',b.dataset.filter==='all')
 );
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 resetDirectoryLimit();
 renderCards();

 // Learning state
 learningType='all';
 const learningSearch=document.getElementById('learningSearch');
 const learningField=document.getElementById('learningField');
 if(learningSearch) learningSearch.value='';
 if(learningField) learningField.value='all';
 document.querySelectorAll('[data-learning-type]').forEach(
   b=>b.classList.toggle('active',b.dataset.learningType==='all')
 );
 updateLearningCrumb();
 updateLearningActionLabel();
 resetLearningLimit();
 renderLearning();

 // Close any open detail layer, then return to the real homepage.
 closeModal({route:false});
 go('top');
}

function resetDirectory(){
 window.badilakJourney?.remember();
 if(/^\/category\//.test(location.pathname))history.replaceState({},'','/');
 filter='all';subfilter='all';originFilter=null;countryFilter=null;
 document.getElementById('searchInput').value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
 buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();closeDirectoryRefiners();renderCards();go('directory')
}
function showAllDirectory(){
 // Keep only the current TOP-LEVEL section.
 // Clear internal subsection, familiar-tool filter, and text search.
 originFilter=null;
 countryFilter=null;
 subfilter='all';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.getElementById('searchInput').value='';
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 resetDirectoryLimit();
 closeDirectoryRefiners();
 renderCards();
 goDirectoryResults();
}
function clearDirectoryContext(){
 if(countryFilter)countryFilter=null;
 else if(document.getElementById('searchInput').value.trim())document.getElementById('searchInput').value='';
 else{
  originFilter=null;subfilter='all';
  document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 }
 buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();
 closeDirectoryRefiners();renderCards();goDirectoryResults();
}
function updateDirectoryActionLabel(){
 const btn=document.getElementById('directoryContextBtn');
 const homeBtn=document.getElementById('directoryHomeBtn');
 if(!btn)return;
 const q=document.getElementById('searchInput')?.value.trim()||'';
 const hasAny=!!countryFilter||filter!=='all'||subfilter!=='all'||!!originFilter||!!q;
 const hasInner=!!countryFilter||subfilter!=='all'||!!originFilter||!!q;

 if(homeBtn)homeBtn.hidden=!hasAny;
 btn.hidden=!hasInner;
 if(!hasInner)return;

 if(countryFilter){
   btn.textContent='إلغاء الدولة';
   btn.title='إلغاء فلتر الدولة مع البقاء في المسار الحالي';
 }else if(q){
   btn.textContent='مسح البحث';
   btn.title='مسح عبارة البحث مع البقاء في المسار الحالي';
 }else{
   btn.textContent='كل '+categoryLabel(filter);
   btn.title='إلغاء التصفية الأدق مع البقاء داخل '+categoryLabel(filter);
 }
}
function toggleOriginOptions(btn){
 const root=document.querySelector('.origin-options');if(!root)return;
 const open=root.classList.toggle('is-expanded');
 btn.setAttribute('aria-expanded',open?'true':'false');
 btn.textContent=open?'عرض أقل −':'6 اختيارات أخرى +';
}
function chooseOrigin(v,el){
 window.badilakJourney?.remember();
 countryFilter=null;
 const same=originFilter===v;
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));

 if(same){
   originFilter=null;
 }else{
   const route=originRouteMap[v] || {cat:'all',sub:'all'};
   originFilter=v;
   filter=route.cat;
   subfilter=route.sub;
   el.setAttribute('aria-pressed','true');
   document.getElementById('searchInput').value='';
 }

 resetDirectoryLimit();
 document.querySelectorAll('[data-filter]').forEach(
   b=>b.classList.toggle('active',b.dataset.filter===filter)
 );
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
 goDirectoryResults();
}
function originContextLabel(id){return id==='youtube'?'محتوى عربي على YouTube':'خيارات في مجال '+originName(id)}


function setLearningPath(type='all',field='all'){
 window.badilakJourney?.remember();
 learningType=type;if(type==='channel'||type==='reciter')learningSectionOpen[type]=true;
 const search=document.getElementById('learningSearch'),select=document.getElementById('learningField');
 if(search)search.value='';
 if(select)select.value=field;
 document.querySelectorAll('[data-learning-type]').forEach(b=>b.classList.toggle('active',b.dataset.learningType===type));
 updateLearningCrumb();updateLearningActionLabel();resetLearningLimit();renderLearning();go('learning');
}
function sectionContinueMarkup(title,subtitle,actions=[]){
 if(!actions.length)return '';
 return `<div class="section-continue-copy"><strong>${title}</strong><span>${subtitle}</span></div><div class="section-continue-actions">${actions.map((a,i)=>`<button type="button" class="${i===0?'accent':''}" onclick="${a[1]}">${a[0]}</button>`).join('')}</div>`;
}
function updateDirectoryContinue(){
 const root=document.getElementById('directoryContinue');if(!root)return;
 let actions=[];
 const q=document.getElementById('searchInput')?.value.trim()||'';
 if(originFilter){
   actions.push([`كل ${subcategoryLabel(filter,subfilter)||categoryLabel(filter)}`,`openDiscoveryGroup('${filter}','${subfilter}')`]);
   actions.push([`كل ${categoryLabel(filter)}`,`openDiscoveryGroup('${filter}','all')`]);
 }else if(subfilter!=='all'){
   actions.push([`كل ${categoryLabel(filter)}`,`openDiscoveryGroup('${filter}','all')`]);
   actions.push(['أحدث ما راجعناه',"go('updates')"]);
 }else if(filter!=='all'){
   const subs=(subfilterMap[filter]||[]).filter(([id])=>id!=='all').slice(0,2);
   actions=subs.map(([id,label])=>[label,`openDiscoveryGroup('${filter}','${id}')`]);
   actions.push(['آخر المراجعات',"go('updates')"]);
 }else if(q){
   actions=[['كل الدليل',"resetDirectory()"],['آخر المراجعات',"go('updates')"],['مصادر التعلّم',"go('learning')"]];
 }else{
   actions=[[categoryLabel('tech'),"openDiscoveryGroup('tech','all')"],[categoryLabel('work'),"openDiscoveryGroup('work','all')"],[categoryLabel('learn'),"openDiscoveryGroup('learn','all')"]];
 }
 root.innerHTML=sectionContinueMarkup('تابع من نفس المسار','إذا كنت ما زلت تبحث، جرّب أحد المسارات القريبة.',actions.slice(0,3));
}
function updateLearningContinue(){
 const root=document.getElementById('learningContinue');if(!root)return;
 const field=document.getElementById('learningField')?.value||'all';
 let actions=[];
 if(field==='quran'){
   actions=[['قنوات القراء الرسمية',"setLearningPath('reciter','quran')"],['قنوات يوتيوب',"setLearningPath('channel','all')"],['كل مصادر التعلّم',"setLearningPath('all','all')"]];
 }else if(field!=='all'){
   actions=[['منصات لنفس الهدف',`setLearningPath('platform','${field}')`],['قنوات لنفس الهدف',`setLearningPath('channel','${field}')`],['قبل ما تدفع',"go('guides')"]];
 }else if(learningType==='platform'){
   actions=[['قنوات يوتيوب',"setLearningPath('channel','all')"],['كل مصادر التعلّم',"setLearningPath('all','all')"],['قبل ما تدفع',"go('guides')"]];
 }else if(learningType==='channel'){
   actions=[['قنوات القراء الرسمية',"setLearningPath('reciter','quran')"],['منصات الكورسات',"setLearningPath('platform','all')"],['كل مصادر التعلّم',"setLearningPath('all','all')"]];
 }else if(learningType==='reciter'){
   actions=[['قنوات يوتيوب',"setLearningPath('channel','all')"],['كل مصادر التعلّم',"setLearningPath('all','all')"],['مصادر إسلامية',"openDiscoveryGroup('learn','islamic')"]];
 }else{
   actions=[['منصات الكورسات',"setLearningPath('platform','all')"],['قنوات يوتيوب',"setLearningPath('channel','all')"],['قنوات القراء الرسمية',"setLearningPath('reciter','quran')"]];
 }
 root.innerHTML=sectionContinueMarkup('تابع من نفس الهدف','إذا كنت ما زلت تقارن، جرّب مصدرًا قريبًا من هدفك.',actions);
}

function learningGuideLinkMarkup(id,detail=false){return guideLinkMarkup(learningGuideMap[id],detail)}

function renderCards(){
 initializedJourneyPanels.add('directory');
 window.badilakJourney?.updateTitle();
 closeCardShelf();
 updateDirectoryRefineUI();
 const q=norm(document.getElementById('searchInput').value);
 const list=items.filter(x=>
   (filter==='all'||x.cat===filter) &&
   (subfilter==='all'||x.sub===subfilter) &&
   (!originFilter||x.origin.includes(originFilter)) &&
   (!countryFilter&&true||countryInfoHasCode(itemCountryMap[x.id],countryFilter)) &&
   (!q||norm([x.name,x.value,x.creator,x.availability,x.arabRelation,x.type].join(' ')).includes(q))
 );
 let context=[];
 if(filter!=='all') context.push(categoryLabel(filter));
 if(subfilter!=='all') context.push(subcategoryLabel(filter,subfilter));
 if(originFilter) context.push(originContextLabel(originFilter));
 if(countryFilter) context.push(arabProgressCountryNames[countryFilter]||countryFilter);
 const shown=list.slice(0,directoryVisible);
 document.getElementById('stateLine').textContent=`نعرض ${Math.min(shown.length,list.length)} من ${list.length}${context.length?' · '+context.join(' · '):' · كل الدليل'}`;
 const root=document.getElementById('catalogGrid');
 const more=document.getElementById('directoryMore');
 if(!list.length){
   root.innerHTML='<div class="empty">لم نجد نتيجة موثقة مطابقة الآن. جرّب توسيع البحث. <button class="more-btn" onclick="showAllDirectory()">عرض الكل</button></div>';
   if(more)more.innerHTML='';
   updateDirectoryContinue();
   return;
 }
 root.innerHTML=shown.map(directoryCardMarkup).join('');
 if(more){
   const remaining=list.length-shown.length;
   const moreLabel=originFilter ? 'بدائل أكثر لهذا الاختيار +' : subfilter!=='all' ? 'المزيد من '+subcategoryLabel(filter,subfilter)+' +' : filter!=='all' ? 'المزيد من '+categoryLabel(filter)+' +' : 'اكتشافات أكثر +';
   more.innerHTML=remaining>0 ? `<button class="load-more-btn" onclick="showMoreDirectory()">${moreLabel} <small>${remaining} متبقية</small></button>` : '';
 }
 updateDirectoryContinue();
}

function setLearningType(v,el){
 learningType=v;if(v==='channel'||v==='reciter')learningSectionOpen[v]=true;resetLearningLimit();document.querySelectorAll('[data-learning-type]').forEach(b=>b.classList.remove('active'));el.classList.add('active');updateLearningCrumb();updateLearningActionLabel();renderLearning()
}
function resetLearning(){
 window.badilakJourney?.remember();
 learningType='all';learningSectionOpen.channel=false;learningSectionOpen.reciter=false;
 document.getElementById('learningSearch').value='';
 document.getElementById('learningField').value='all';
 document.querySelectorAll('[data-learning-type]').forEach(b=>b.classList.toggle('active',b.dataset.learningType==='all'));
 updateLearningCrumb();updateLearningActionLabel();resetLearningLimit();renderLearning();go('learning')
}
function showAllLearning(){
 // Show ALL learning sources, regardless of platform/channel or field.
 learningType='all';learningSectionOpen.channel=false;learningSectionOpen.reciter=false;
 document.getElementById('learningField').value='all';
 document.getElementById('learningSearch').value='';
 document.querySelectorAll('[data-learning-type]').forEach(
   b=>b.classList.toggle('active',b.dataset.learningType==='all')
 );
 updateLearningCrumb();
 updateLearningActionLabel();
 resetLearningLimit();
 renderLearning();
 go('learning');
}
function updateLearningActionLabel(){
 const btn=document.getElementById('learningContextBtn');
 if(!btn)return;
 const hasAnyFilter =
   learningType!=='all' ||
   (document.getElementById('learningField')?.value||'all')!=='all' ||
   (document.getElementById('learningSearch')?.value.trim()||'')!=='';

 btn.hidden=!hasAnyFilter;
 btn.textContent='كل المصادر';
 btn.title='إلغاء التصفية وإظهار كل مصادر التعلّم';
}
function updateLearningCrumb(){
 const typeLabel=learningType==='platform'?'منصات الكورسات':learningType==='resource'?'مصادر عملية من المنصات':learningType==='channel'?'قنوات يوتيوب':learningType==='reciter'?'قنوات القراء الرسمية':'';
 const field=document.getElementById('learningField')?.value||'all';
 const fieldLabel=field==='all'?'':document.getElementById('learningField').options[document.getElementById('learningField').selectedIndex].text;
 const bits=[typeLabel,fieldLabel].filter(Boolean);
 const wrap=document.getElementById('learningCrumbWrap'),el=document.getElementById('learningCrumb');
 if(!bits.length){wrap.style.display='none'}else{el.textContent=bits.join(' / ');wrap.style.display='inline'}
}
function toggleLearningSection(type){
 if(type!=='channel'&&type!=='reciter')return;
 learningSectionOpen[type]=!learningSectionOpen[type];
 learningCarouselIndex[type]=0;
 renderLearning();
}
function enableLearningCarousel(type,btn){
 const group=document.getElementById('learning-group-'+type);
 if(!group)return;
 group.classList.add('is-browsing');
 if(btn&&btn.parentElement)btn.parentElement.hidden=true;
 scrollLearningCarousel(type,1);
}
function scrollLearningCarousel(type,dir){
 const group=document.getElementById('learning-group-'+type);if(!group)return;
 const track=group.querySelector('.learning-carousel-track');if(!track)return;
 const cards=[...track.querySelectorAll('.learning-card')];if(!cards.length)return;
 const perView=window.matchMedia('(max-width:760px)').matches?1:4;
 const maxStart=Math.max(0,cards.length-perView);
 let current=Number.isFinite(learningCarouselIndex[type])?learningCarouselIndex[type]:0;
 current=Math.max(0,Math.min(maxStart,current+(dir>0?perView:-perView)));
 learningCarouselIndex[type]=current;
 cards[current].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
}
function renderLearning(){
 initializedJourneyPanels.add('learning');
 updateLearningCrumb();updateLearningActionLabel();
 const q=norm(document.getElementById('learningSearch').value),field=document.getElementById('learningField').value;
 const list=learning.filter(x=>(learningType==='all'||x.type===learningType)&&(field==='all'||x.fields.includes(field))&&(!q||norm([x.name,x.teacher,x.focus].join(' ')).includes(q)));
 const groups=[['platform','منصات الكورسات'],['resource','مصادر عملية من المنصات'],['channel','قنوات يوتيوب مفيدة'],['reciter','قنوات رسمية لقراء القرآن']];
 document.getElementById('learningGroups').innerHTML=groups.map(([type,label])=>{
  const g=list.filter(x=>x.type===type);if(!g.length)return '';
  const foldable=type==='channel'||type==='reciter';
  if(foldable&&!learningSectionOpen[type]){
   return `<section class="learning-group learning-folded" id="learning-group-${type}">
    <div class="learning-folded-head"><div><h3 class="learning-group-title">${label}</h3><small>${g.length} مصدرًا متاحًا</small></div><button class="section-fold-toggle compact" type="button" aria-expanded="false" onclick="toggleLearningSection('${type}')"><span aria-hidden="true">+</span><span class="sr-only">فتح ${label}</span></button></div>
   </section>`;
  }
  const moreLabel=type==='platform'?'منصات كورسات أكثر +':type==='resource'?'مصادر عملية أكثر +':type==='channel'?'قنوات يوتيوب أكثر +':'قراء رسميون أكثر +';
  const titleMarkup=foldable
   ? `<div class="learning-group-title-row"><h3 class="learning-group-title">${label}</h3><button class="section-fold-toggle compact" type="button" aria-expanded="true" onclick="toggleLearningSection('${type}')"><span aria-hidden="true">−</span><span class="sr-only">طي ${label}</span></button></div>`
   : `<h3 class="learning-group-title">${label}</h3>`;
  return `<section class="learning-group learning-carousel-group" id="learning-group-${type}">${titleMarkup}
   <div class="learning-carousel-shell">
    <button class="learning-carousel-arrow learning-carousel-prev" type="button" aria-label="السابق" onclick="scrollLearningCarousel('${type}',-1)">›</button>
    <div class="learning-carousel-viewport"><div class="learning-grid learning-carousel-track">${g.map(x=>`
     <article class="learning-card" data-learning-id="${x.id}">
      ${logoMarkup(x.logo,'learning-logo',x.name)}
      <h3>${x.name}</h3>
      ${countryBadgeMarkup(x,learningCountryMap)}
      ${x.vendorContent?'<div class="learning-vendor-note">محتوى من الجهة نفسها</div>':''}
      <p class="learning-focus">${x.focus}</p>
      <div class="learning-card-guide-slot">${learningGuideLinkMarkup(x.id)}</div>
      <div class="learning-spacer"></div>
      <div class="learning-actions"><button type="button" onclick="showLearningNote('${x.id}');return false;">التفاصيل والمصادر</button></div>
     </article>`).join('')}</div></div>
    <button class="learning-carousel-arrow learning-carousel-next" type="button" aria-label="التالي" onclick="scrollLearningCarousel('${type}',1)">‹</button>
   </div>
   ${g.length>4?`<div class="load-more-wrap learning-carousel-more-wrap"><button class="load-more-btn" onclick="enableLearningCarousel('${type}',this)">${moreLabel} <small>${g.length-4} أخرى</small></button></div>`:''}
  </section>`;
 }).join('') || '<div class="empty">لا توجد مصادر مطابقة. <button class="more-btn" onclick="resetLearning()">كل المصادر</button></div>';
 updateLearningContinue();
}



function shortDecisionText(text='',max=112){
 const t=String(text).replace(/<[^>]+>/g,'').trim();
 return t.length>max?t.slice(0,max-1).trim()+'…':t;
}
const cardCautionOverrides={
 karnak:'إطلاق تجريبي؛ الدقة لم تُختبر مستقلًا.',
 dhawwi:'أرقام الاستخدام معلنة من الجهة نفسها.',
 midaad:'المجاني يضيف ختمًا خفيفًا للتصدير.',
 taqreer:'المجاني: 5 شرائح وتصدير PNG بعلامة مائية.',
 daftra:'التقييمات المستقلة المتاحة محدودة.',
 gravity:'لم نجمع بعد مراجعات لاعبين مستقلة.',
 shamaa:'توفر النص الكامل يختلف حسب حقوق النشر.',
 faseeh:'جودة اللهجات لم تُختبر بما يكفي.',
 arabicdesign:'التجربة المجانية 7 أيام وبرصيد محدود.',
 qriib:'لم ننفذ تجربة استخدام مستقلة.',
 vconnct:'البيانات المستقلة المتاحة محدودة.',
 mandumah:'الوصول الكامل قد يحتاج اشتراكًا مؤسسيًا.',
 zotero:'راجع بيانات المصدر قبل اعتماد التوثيق.',
 salla:'الباقات والتكاملات تختلف حسب السوق.',
 edraak:'إتاحة الشهادة وشروطها تختلف حسب الدورة.',
 openalex:'استخدمه للاكتشاف، وراجع المصدر الأصلي.',
 paymob:'الرسوم ووسائل الدفع تختلف حسب السوق.',
 munsit:'القياس المنشور لا يقيّم الخدمة الحالية.',
 arabybot:'الأتمتة والتكاملات لم تُختبر مستقلًا.',
 arabicai:'الأداء يختلف بين منتجات المنظومة.',
 wuzzuf:'لم ننفذ تجربة استخدام مستقلة.',
 falcon:'لم ننفذ تجربة استخدام مستقلة.',
 anghami:'لم نراجع كل المحتوى وإصدارات التطبيق.',
 hudhud:'نطاق الإتاحة الجغرافي مهم عند المقارنة.',
 khamsat:'راجع الأعمال السابقة وحدد طلبك بوضوح.',
 fanar:'التغطية اللغوية لا تعني دقة كل مهمة.',
 hsoub:'قارن المجاني والمدفوع حسب هدفك ووقتك.',
 noon:'الشحن والسعر يختلفان حسب البلد والمنتج.',
 opensooq:'تحقق من البائع والدفع قبل إتمام الصفقة.',
 mumzworld:'متجر متخصص للأم والطفل، لا سوق عام.',
 spacetoonyt:'راجع ملاءمة الحلقة لعمر الطفل.',
 majidkids:'راجع ملاءمة الحلقة لعمر الطفل.',
 marefa:'راجع المراجع الأصلية قبل الاعتماد.',
 arabency:'حداثة المواد تختلف حسب الموضوع.',
 dorar:'لا تختزل المسألة في نتيجة بحث واحدة.',
 tafsircenter:'مصدر قرآني متخصص، لا يغطي كل العلوم الشرعية.',
 shamela:'وجود الكتاب لا يعني اعتماد كل محتواه.',
 hindawi:'التوافر يتغير حسب حقوق النشر.',
 shahid:'المكتبة والإتاحة تختلف حسب البلد.',
 watchit:'الأسعار والمكتبة قد تتغير.',
 dubaiplus:'الإتاحة تتغير مع حقوق العرض.',
 almaany:'المعنى الصحيح يعتمد على السياق.'
};
function cardCautionText(x,n){
 if(cardCautionOverrides[x.id])return cardCautionOverrides[x.id];
 const first=String(n?.alert||x?.limit||'').split(/[.!؟]/)[0].trim();
 return shortDecisionText(first||n?.alert||'',74);
}
function decisionCardMarkup(x){
 const n=decisionNoteFor(x);
 const note=n?cardCautionText(x,n):'';
 return `<div class="decision-slot ${note?'has-note':'is-empty'}">${note?`<div class="card-decision-note"><b>${note}</b></div>`:''}</div>`;
}
function learningDecisionNoteFor(x){
 if(!x)return null;
 if(x.type==='reciter')return {
   alert:'قد تضم القناة تلاوات مختارة ولا تمثل مصحفًا كاملًا؛ راجع وصف التسجيل والجهة الناشرة.',
   action:'اختر السورة أو قائمة التلاوة التي تريدها، وراجع الرواية ونوع التسجيل إن كانا مذكورين.'
 };
 if(x.type==='platform')return {
   alert:'بعض المسارات أو الشهادات قد تكون مدفوعة حتى لو كانت المنصة نفسها مجانية.',
   action:'راجع صفحة المسار نفسه: التكلفة، شروط التسجيل، وهل الشهادة مشمولة قبل أن تبدأ.'
 };
 return {
   alert:'المحتوى الجيد لا يعني بالضرورة أن القناة مرتبة كمسار من البداية للنهاية.',
   action:'ابدأ بقائمة تشغيل مناسبة لمستواك وحدد هدفًا تطبيقيًا واضحًا بدل التنقل بين فيديوهات متفرقة.'
 };
}
function learningDecisionCardMarkup(x){
 const n=learningDecisionNoteFor(x);
 return `<div class="decision-slot ${n?'has-note':'is-empty'}">${n?`<div class="card-decision-note"><b>${shortDecisionText(n.alert,96)}</b></div>`:''}</div>`;
}
function learningDecisionPanelMarkup(x){
 const n=learningDecisionNoteFor(x);if(!n)return '';
 return `<section class="decision-panel">
  <p class="decision-alert-text">${n.alert}</p>
  <div class="decision-action"><b>ما الذي يمكنك فعله؟</b><span>${n.action}</span></div>
 </section>`;
}

function openDiscoveryGroup(cat,sub='all'){
 window.badilakJourney?.remember();
 closeModal({route:false});
 if(/^\/discover\//.test(location.pathname)){
  const path=sub==='all'?'/category/'+encodeURIComponent(cat):'/';
  history.replaceState(sub==='all'?{badilakCategory:cat}:{},'',path);
 }
 countryFilter=null;
 filter=cat;
 subfilter=(sub&&sub!=='all')?sub:'all';
 originFilter=null;
 document.getElementById('searchInput').value='';
 resetDirectoryLimit();
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===cat));
 buildSubfilters();
 document.querySelectorAll('[data-subfilter]').forEach(b=>b.classList.toggle('active',b.dataset.subfilter===subfilter));
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
 goDirectoryResults();
}
function relatedLearningItems(x){
 return learning
  .filter(a=>a.id!==x.id)
  .map(a=>{
   let score=a.type===x.type?3:0;
   score+=(a.fields||[]).filter(f=>(x.fields||[]).includes(f)).length*4;
   return {item:a,score};
  })
  .filter(r=>r.score>0)
  .sort((a,b)=>b.score-a.score||a.item.name.localeCompare(b.item.name,'ar'))
  .slice(0,2)
  .map(r=>r.item);
}
function learningDiscoveryMarkup(x){
 const related=relatedLearningItems(x);
 if(!related.length)return '';
 return `<section class="detail-discovery">
  <div class="detail-discovery-head"><h4>خيارات قريبة</h4><p>${x.type==='reciter'?'قنوات تلاوة أخرى قريبة من اختيارك.':'مصادر تعلم قريبة من نفس الهدف.'}</p></div>
  <div class="detail-related-grid">${related.map(a=>`<button type="button" class="detail-related" onclick="showLearningNote('${a.id}')"><strong>${a.name}</strong><small>${a.focus}</small></button>`).join('')}</div>
  <button type="button" class="detail-collection" onclick="closeModal();showAllLearning()">عرض كل مصادر التعلّم</button>
 </section>`;
}

let activeDetail=null;
let detailReturnFocus=null;
let detailRouteReturnPath=null;
function syncDetailRoute(id){
 const path='/discover/'+encodeURIComponent(id);
 if(location.pathname===path)return;
 if(/^\/discover\//.test(location.pathname)){
  const previous=history.state&&history.state.returnPath?history.state.returnPath:detailRouteReturnPath;
  history.replaceState({badilakDetail:true,returnPath:previous||'/'},'',path);
  return;
 }
 detailRouteReturnPath=location.pathname+location.search+location.hash;
 history.pushState({badilakDetail:true,returnPath:detailRouteReturnPath},'',path);
}
function openDetail(id,options={}){
 const x=items.find(a=>a.id===id);if(!x)return;
 if(options.route!==false){window.badilakJourney?.remember();syncDetailRoute(id);}
 activeDetail={kind:'directory',id};
 if(!document.getElementById('detailModal').open)detailReturnFocus=document.activeElement;
 document.getElementById('modalBody').innerHTML=directoryDetailMarkup(x);
 showDetailDialog()
}
const fieldNames={
 languages:'إنجليزي ولغات',
 tech:'برمجة وتقنية',
 design:'تصميم ومونتاج',
 business:'إدارة وتسويق',
 skills:'مهارات متنوعة',
 knowledge:'معرفة وعلوم',
 quran:'قرآن وتلاوة'
};
function showLearningNote(id){
 const x=learning.find(a=>a.id===id);if(!x)return;
 activeDetail={kind:'learning',id};
 if(!document.getElementById('detailModal').open)detailReturnFocus=document.activeElement;
 const fields=x.fields.map(f=>fieldNames[f]||f).join(' · ');
 const isChannel=x.type==='channel'||x.type==='reciter';
 const isReciter=x.type==='reciter';
 const facts=isReciter
  ? [['القارئ',x.teacher],['المجال',fields],['التوثيق',x.reference],['المشاهدة','عبر القناة الرسمية على YouTube']]
  : isChannel
  ? [['المقدم/الجهة',x.teacher],['المجال',fields],['نوع المحتوى',x.focus],['التوثيق',x.reference]]
  : x.type==='resource'
  ? [['الجهة',x.teacher],['المجالات',fields],['نوع المصدر','محتوى تعليمي من الجهة نفسها'],['الملاحظة التحريرية',x.reference]]
  : [['الجهة',x.teacher],['المجالات',fields],['نوع المنصة',x.reference],['ماذا تقدم',x.focus]];
 document.getElementById('modalBody').innerHTML=`
  <div class="detail-overview">
   <div class="detail-identity">${logoMarkup(x.logo,'detail-logo',x.name)}<h3 class="quick-title">${x.name}</h3>${countryBadgeMarkup(x,learningCountryMap)}</div>
   <p class="quick-purpose">${x.focus}</p>
   <div class="detail-facts">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}    ${learningDecisionPanelMarkup(x)}
   ${learningGuideLinkMarkup(x.id,true)}
   ${learningCommercialDisclosureMarkup(x)}
   <button class="destination-link" onclick="openLearningExternal('${x.id}')"><span class="destination-label"><bdi>${isReciter?'افتح القناة الرسمية':isChannel?'افتح القناة والدروس':x.type==='resource'?'افتح المصدر التعليمي':'اذهب إلى المنصة'}</bdi><small>${x.url.replace('https://','')}</small></span><span class="outbound-key">↗</span></button>
   ${learningDiscoveryMarkup(x)}
  </div>`;
 showDetailDialog()
}
// Central commercial-link model lives in /js/commercial-links.js.
// Activate a program only by updating that one asset.
const commercialLinks=window.BADILAK_COMMERCIAL_LINKS||{};
function resolveLearningCommercialLink(x){
 if(!x)return {url:'',affiliate:false,status:'none'};
 if(x.commercialId&&x.commercialContentKey&&window.badilakCommercialResolveContent){
  return window.badilakCommercialResolveContent(x.commercialId,x.commercialContentKey,x.url||'');
 }
 return {url:x.url||'',affiliate:false,status:'none'};
}
function learningCommercialDisclosureMarkup(x){
 const r=resolveLearningCommercialLink(x);
 if(!r.affiliate)return '';
 return window.badilakCommercialDisclosureHTML
  ? window.badilakCommercialDisclosureHTML()
  : '<div class="commercial-disclosure"><strong>إفصاح تجاري</strong><span>قد نحصل على عمولة إذا أدى هذا الرابط إلى عملية مؤهلة لاحقًا، دون تكلفة إضافية عليك أو تأثير على ترتيب المصدر.</span></div>';
}
function openLearningExternal(id){
 const x=learning.find(a=>a.id===id);if(!x||!x.url)return;
 const r=resolveLearningCommercialLink(x);
 const a=document.createElement('a');
 a.href=r.url||x.url;
 a.target='_blank';
 a.rel=r.affiliate?'sponsored noopener noreferrer':'noopener noreferrer';
 a.dataset.linkKind=r.affiliate?'affiliate-content':'official-content';
 a.dataset.learningId=id;
 if(x.commercialId)a.dataset.commercialId=x.commercialId;
 document.body.appendChild(a);a.click();a.remove();
 document.dispatchEvent(new CustomEvent('badilak:outbound',{detail:{id,kind:r.affiliate?'affiliate-content':'official-content'}}));
}

function openExternal(id){
 const x=items.find(a=>a.id===id);if(!x||!x.url||x.url==='#'){alert('لا يتوفر لهذا العنصر رابط رسمي موثق حاليًا.');return}
 const r=resolveCommercialLink(id,x.url);
 const a=document.createElement('a');
 a.href=r.url;
 a.target='_blank';
 a.rel=r.affiliate?'sponsored noopener noreferrer':'noopener noreferrer';
 a.dataset.linkKind=r.affiliate?'affiliate':'official';
 a.dataset.itemId=id;
 document.body.appendChild(a);
 a.click();
 a.remove();
 document.dispatchEvent(new CustomEvent('badilak:outbound',{detail:{id,kind:r.affiliate?'affiliate':'official'}}));
}
let methodologyReturnFocus=null;
function openMethodology(){
 activeDetail=null;
 methodologyReturnFocus=document.activeElement;
 document.getElementById('modalBody').innerHTML=`
  <div class="detail-overview">
   <h3 class="quick-title" id="methodology">منهج الاختيار</h3>
   <p class="quick-purpose">نبحث عن خيارات عربية تستحق وقتك، ونربط كل خيار بالحاجة التي يخدمها وما يلزم معرفته قبل استخدامه.</p>
   <section class="detail-section"><h4>ابدأ بحاجتك</h4><div>الأداة والدورة والكتاب وقناة التلاوة لا تُقاس بالمعيار نفسه. تبدأ المقارنة بالمهمة، ثم الفائدة والتكلفة وحدود الإتاحة.</div></section>
   <section class="detail-section"><h4>افهم نوع الاختيار</h4><div>بعض الخيارات بدائل تؤدي مهمة مشابهة، وبعضها مصادر أو محتوى عربي داخل منصة تستخدمها بالفعل؛ قناة عربية على YouTube ليست بديلًا تقنيًا عن YouTube.</div></section>    <section class="detail-section"><h4>ماذا يعني علم الدولة؟</h4><div>العلم لا يعني تلقائيًا أن هوية المنتج أو محتواه من تلك الدولة. نكتب بجواره نوع الصلة كلما لزم: تأسيس، تسجيل قانوني، مقر، مطوّر رسمي، أو سوق موجّه. ولا نستنتج البلد من الدومين أو لغة الموقع وحدهما.</div></section>
   <section class="detail-section"><h4>المصدر يوضح حدود المعلومة</h4><div>بيان الشركة يوضح ما تعلنه عن منتجها، ولا يثبت وحده جودة الأداء. وجود رابط رسمي لا يعني أننا اختبرنا كل ميزة؛ راجع مصدر المعلومة وتاريخ مراجعتها حيث يظهران.</div></section>
   <section class="detail-section"><h4>قبل التسجيل أو الدفع</h4><div>افحص خطة بلدك، وحدود المجاني، والتجديد والإلغاء، وحقوق الاستخدام. قد تتغير الأسعار والشروط بعد تاريخ المراجعة، والقرار النهائي يعود لصفحة الخدمة الحالية.</div></section>
   <section class="detail-section"><h4>قرار تحريري معلن</h4><div>معيار الترشيح هو فائدته للقارئ وحدوده المعلنة. أي تعاون تجاري يحتاج إفصاحًا واضحًا بجواره، ولا يكفي وحده سببًا للترشيح أو الأفضلية.</div></section>
  </div>`;
 showDetailDialog();
 document.querySelector('#detailModal .modal-card').scrollTop=0;
 document.querySelector('#detailModal .close').focus();
}
let activeCardShelfId=null;
let activeCardShelfBtn=null;

function closeCardShelf(returnFocus=false){
 const trigger=activeCardShelfBtn;
 const shelf=document.getElementById('cardDetailShelf');
 if(shelf)shelf.remove();
 if(activeCardShelfBtn){
  activeCardShelfBtn.setAttribute('aria-expanded','false');
  activeCardShelfBtn.removeAttribute('aria-controls');
  activeCardShelfBtn.textContent='تفاصيل +';
 }
 activeCardShelfId=null;
 activeCardShelfBtn=null;
 if(returnFocus&&trigger?.isConnected)trigger.focus({preventScroll:true});
}

function openCardShelf(id,btn,scroll=true){
 const grid=document.getElementById('catalogGrid');
 const card=btn?.closest('.item');
 const x=items.find(a=>a.id===id);
 if(!grid||!card||!x)return;

 if(activeCardShelfId===id){
  closeCardShelf();
  return;
 }
 closeCardShelf();

 const cards=[...grid.querySelectorAll(':scope > .item')];
 const index=cards.indexOf(card);
 const cols=Math.max(1,getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length);
 const rowEndIndex=Math.min(cards.length-1,Math.ceil((index+1)/cols)*cols-1);
 const anchor=cards[rowEndIndex]||card;
 const note=decisionNoteFor(x);

 const shelf=document.createElement('section');
 shelf.id='cardDetailShelf';
 shelf.className='card-detail-shelf';
 shelf.setAttribute('aria-label','مصادر ومعلومات عن '+x.name);
 shelf.innerHTML=`
  <div class="card-shelf-pointer" aria-hidden="true"></div>
  <div class="card-shelf-head">
   <div><small>المصادر والمعلومات</small><strong>${x.name}</strong></div>
   <button type="button" aria-label="إغلاق التفاصيل" onclick="closeCardShelf(true)">×</button>
  </div>
  ${note?`<div class="card-shelf-caution"><small>قبل الاختيار</small><strong>${cardCautionText(x,note)}</strong></div>`:''}
  <div class="card-shelf-facts">
   <div><small>السعر</small><strong>${x.price||'راجع الموقع'}</strong></div>
   <div><small>الإتاحة</small><strong>${x.availability||'—'}</strong></div>
   <div><small>الجهة / المنشأ</small><strong>${x.creator||'—'}</strong></div>
   <div><small>آخر مراجعة</small><strong>${x.reviewed||'—'}</strong></div>
   <div class="card-shelf-arab-relation"><small>صلته بالعربية</small><strong>${x.arabRelation||'—'}</strong></div>
  </div>
  <div class="card-shelf-actions">
   <button type="button" onclick="closeCardShelf(true);openDetail('${x.id}')">كل التفاصيل والمصادر</button>
  </div>`;

 anchor.insertAdjacentElement('afterend',shelf);
 activeCardShelfId=id;
 activeCardShelfBtn=btn;
 btn.setAttribute('aria-expanded','true');
 btn.setAttribute('aria-controls',shelf.id);
 btn.textContent='أقل −';

 requestAnimationFrame(()=>{
  const sr=shelf.getBoundingClientRect();
  const cr=card.getBoundingClientRect();
  const center=Math.max(24,Math.min(sr.width-24,(cr.left+cr.width/2)-sr.left));
  shelf.style.setProperty('--shelf-pointer',center+'px');
  if(scroll)shelf.scrollIntoView({behavior:'smooth',block:'nearest'});
 });
}

function toggleCardMore(id,btn){
 const panel=document.getElementById('card-more-'+id);if(!panel)return;
 const open=panel.hasAttribute('hidden');
 if(open)panel.removeAttribute('hidden');else panel.setAttribute('hidden','');
 btn.setAttribute('aria-expanded',open?'true':'false');
 btn.textContent=open?'أقل −':'تفاصيل +';
}
function toggleLearningMore(id,btn){
 const panel=document.getElementById('learning-more-'+id);if(!panel)return;
 const open=panel.hasAttribute('hidden');
 if(open)panel.removeAttribute('hidden');else panel.setAttribute('hidden','');
 btn.setAttribute('aria-expanded',open?'true':'false');
 btn.textContent=open?'أقل −':'تفاصيل +';
}
function toggleStaticDisclosure(bodyId,btn,kind){
 const body=document.getElementById(bodyId);if(!body)return;
 const opening=body.hasAttribute('hidden');
 if(opening)body.removeAttribute('hidden');else body.setAttribute('hidden','');
 const section=btn.closest('.fold-card');if(section)section.classList.toggle('is-open',opening);
 btn.setAttribute('aria-expanded',opening?'true':'false');
 const mark=btn.querySelector('[aria-hidden="true"]');if(mark)mark.textContent=opening?'−':'+';
 const label=btn.querySelector('.sr-only');if(label)label.textContent=opening?'إخفاء القسم':'إظهار القسم';
 if(opening&&kind==='competition'&&!body.dataset.loaded){
  body.dataset.loaded='1';
  setCompetitionStory('shopping',document.querySelector('.competition-tab[data-story="shopping"]'));
 }
}

function showDetailDialog(){
 const modal=document.getElementById('detailModal');
 modal.classList.add('show');
 if(!modal.open)modal.showModal();
 document.body.classList.add('lock');
 modal.querySelector('.modal-card').scrollTop=0;
 modal.querySelector('.close').focus({preventScroll:true});
}
function closeModal(options={}){
 const modal=document.getElementById('detailModal');
 if(!modal.open)return;
 const routedDetail=/^\/discover\//.test(location.pathname);
 const routeState=history.state;
 activeDetail=null;
 modal.close();
 modal.classList.remove('show');
 document.body.classList.remove('lock');
 if(detailReturnFocus?.isConnected)detailReturnFocus.focus({preventScroll:true});
 detailReturnFocus=null;
 if(methodologyReturnFocus?.isConnected)methodologyReturnFocus.focus({preventScroll:true});
 methodologyReturnFocus=null;
 if(options.route!==false&&routedDetail){
  if(routeState&&routeState.badilakDetail&&routeState.returnPath&&history.length>1)history.back();
  else history.replaceState({},'',detailRouteReturnPath||'/');
 }
}
document.getElementById('detailModal').addEventListener('cancel',event=>{event.preventDefault();closeModal();});
// Native dialogs own focus containment and make the background inert.
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&!document.querySelector('dialog[open]'))closeCardShelf(true);
});
document.addEventListener('DOMContentLoaded',()=>{if(location.hash==='#methodology')openMethodology();});

function ensureJourneyPanel(view){
 if(initializedJourneyPanels.has(view))return;
 if(view==='directory'){buildSubfilters();renderCards();updateDirectoryCrumb();updateDirectoryActionLabel();}
 else if(view==='learning'){renderLearning();updateLearningCrumb();updateLearningActionLabel();}
 else if(view==='competitionIndex')renderArabProgress(currentArabMetric);
}

function applyShareableRoute(){
 if(!/^\/discover\//.test(location.pathname)){
  if(document.getElementById('detailModal')?.classList.contains('show'))closeModal({route:false});
  if(window.badilakJourney?.restoreHistory())return;
 }
 const discover=location.pathname.match(/^\/discover\/([^/]+)\/?$/);
 if(discover){
  const id=decodeURIComponent(discover[1]);
  if(items.some(x=>x.id===id))openDetail(id,{route:false});
  return;
 }
 const category=location.pathname.match(/^\/category\/([^/]+)\/?$/);
 if(category){
  const cat=decodeURIComponent(category[1]);
  if(categoryNames[cat]&&cat!=='all'){
   openDirectory(cat,{route:false});
   const requestedSub=new URLSearchParams(location.search).get('sub');
   if((subfilterMap[cat]||[]).some(([id])=>id===requestedSub)){
    subfilter=requestedSub;buildSubfilters();updateDirectoryCrumb();renderCards();
   }
  }
  return;
 }
 if(document.getElementById('detailModal')?.classList.contains('show'))closeModal({route:false});
 if(location.pathname==='/'){
  filter='all';subfilter='all';originFilter=null;countryFilter=null;
  document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
  if(document.body.dataset.journey==='directory'){buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();renderCards();}
 }
}
applyShareableRoute();
window.addEventListener('popstate',()=>applyShareableRoute());

const backToTop=document.getElementById('backToTop');if(backToTop){const syncBackTop=()=>backToTop.classList.toggle('show',window.scrollY>700);window.addEventListener('scroll',syncBackTop,{passive:true});syncBackTop();}

;

/* badilak-signal-chart-v101 */
const competitionStories={
 shopping:{
  field:'تسوّق',mode:'numeric',metricLabel:'تنزيلات Google Play',
  regional:{
   name:'نون',domain:'noon.com',tag:'سوق إقليمي',desc:'متجر إلكتروني متعدد الفئات',
   reasons:['واجهة عربية','توصيل محلي','خيارات دفع للمنطقة'],
   signal:{value:50000000,display:'50M+'},
   rating:{score:4.6,reviews:'1.16M مراجعة'}
  },
  global:{
   name:'Amazon',domain:'amazon.com',tag:'مرجع عالمي',desc:'سوق إلكتروني عالمي',
   reasons:['تشكيلة ضخمة','متاجر حسب البلد','خيارات شراء واسعة'],
   signal:{value:1000000000,display:'1B+'},
   rating:{score:4.4,reviews:'4.69M مراجعة'}
  },
  difference:'نون أقرب لأسواق المنطقة؛ Amazon أوسع نطاقًا.',
  sources:[['Google Play · نون','https://play.google.com/store/apps/details?id=com.noon.buyerapp'],['Google Play · Amazon','https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping']]
 },
 academic:{
  field:'بحث أكاديمي',mode:'qualitative',metricLabel:'ما يميزه للباحث',
  regional:{
   name:'دار المنظومة',domain:'mandumah.com',tag:'قاعدة عربية متخصصة',desc:'قاعدة بيانات أكاديمية عربية',
   reasons:['رسائل عربية','دوريات عربية','تخصصات عربية'],
   signal:{display:'200K+ عنوان رسالة · 800+ جامعة'}
  },
  global:{
   name:'Google Scholar',domain:'scholar.google.com',tag:'اكتشاف أكاديمي واسع',desc:'محرك بحث أكاديمي',
   reasons:['بحث عالمي','تتبع الاستشهادات','مصادر أكاديمية متعددة'],
   signal:{display:'مقالات · رسائل · كتب · استشهادات'}
  },
  difference:'دار المنظومة للعمق العربي؛ Scholar للاكتشاف والاستشهادات.',
  sources:[['دار المنظومة','https://www.mandumah.com/databases/'],['Google Scholar','https://scholar.google.com/intl/en/scholar/about.html']]
 },
 ai:{
  field:'ذكاء اصطناعي',mode:'numeric',metricLabel:'تنزيلات Google Play',
  regional:{
   name:'فَنار',domain:'fanar.qa',tag:'ذكاء اصطناعي عربي أولًا',desc:'مساعد ذكاء اصطناعي عربي',
   reasons:['العربية واللهجات','صوت وصورة','مهام متعددة'],
   signal:{value:5000,display:'5K+'},
   rating:null
  },
  global:{
   name:'ChatGPT',domain:'chatgpt.com',tag:'مساعد عالمي',desc:'مساعد ذكاء اصطناعي عام',
   reasons:['كتابة وبحث','ملفات وصور','أدوات عامة كثيرة'],
   signal:{value:1000000000,display:'1B+'},
   rating:null
  },
  difference:'فَنار يركز على التجربة العربية؛ ChatGPT أوسع انتشارًا واستخدامًا عامًا.',
  sources:[['Google Play · فَنار','https://play.google.com/store/apps/details?id=com.fanarmobile'],['Google Play · ChatGPT','https://play.google.com/store/apps/details?id=com.openai.chatgpt']]
 },
 design:{
  field:'تصميم ومحتوى',mode:'numeric',metricLabel:'القوالب المتاحة',
  regional:{
   name:'ضوّي',domain:'dhawwi.com',tag:'محرر تصميم عربي',desc:'منصة تصميم عربية',
   reasons:['قوالب عربية','خطوط عربية','مناسبات محلية'],
   signal:{value:400,display:'400+ قالب عربي'},
   rating:null
  },
  global:{
   name:'Canva',domain:'canva.com',tag:'منصة تصميم عالمية',desc:'منصة تصميم مرئي',
   reasons:['قوالب ضخمة','فيديو وعروض','فرق وتعاون'],
   signal:{value:3600000,display:'3.6M+ قالب'},
   rating:null
  },
  difference:'ضوّي أقرب للمحتوى العربي؛ Canva أوسع في الأدوات والتعاون.',
  sources:[['ضوّي','https://www.dhawwi.com/'],['Canva · القوالب','https://www.canva.com/pricing/'],['Canva · المستخدمون','https://www.canva.com/newsroom/news/canva-2025-wrap/']]
 },
 documents:{
  field:'مستندات',mode:'qualitative',metricLabel:'ما يميزه في PDF',
  regional:{
   name:'مِداد',domain:'midaadapp.com',tag:'أداة عربية متخصصة',desc:'أداة PDF عربية',
   reasons:['OCR عربي','تحويل PDF','تحرير عربي'],
   signal:{display:'OCR عربي · تحرير PDF عربي'},
   rating:null
  },
  global:{
   name:'Acrobat',domain:'adobe.com',tag:'منظومة PDF واسعة',desc:'منصة PDF متكاملة',
   reasons:['تحرير وتوقيع','تحويل وOCR','أدوات PDF واسعة'],
   signal:{display:'تحرير · توقيع · تحويل · OCR · AI'},
   rating:null
  },
  difference:'مِداد يتخصص في العربية؛ Acrobat أوسع في دورة عمل PDF.',
  sources:[['مِداد','https://midaadapp.com/'],['Adobe Acrobat','https://play.google.com/store/apps/details?id=com.adobe.reader']]
 },
 reading:{
  field:'قراءة',mode:'numeric',metricLabel:'تنزيلات Google Play',
  regional:{
   name:'أبجد',domain:'abjjad.com',tag:'قراءة واستماع عربي',desc:'مكتبة قراءة واستماع عربية',
   reasons:['كتب عربية','صوتي وإلكتروني','اشتراك واحد'],
   signal:{value:1000000,display:'1M+'},
   rating:{score:4.5,reviews:'27.4K مراجعة'}
  },
  global:{
   name:'Kindle',domain:'amazon.com',tag:'منصة قراءة عالمية',desc:'منصة كتب إلكترونية',
   reasons:['مكتبة عالمية','أجهزة وتطبيقات','شراء وقراءة'],
   signal:{value:100000000,display:'100M+'},
   rating:{score:4.8,reviews:'4.8M مراجعة'}
  },
  difference:'أبجد يركز على العربية والاشتراك؛ Kindle أوسع عالميًا.',
  sources:[['Google Play · أبجد','https://play.google.com/store/apps/details?id=com.abjjad.app'],['Google Play · Kindle','https://play.google.com/store/apps/details?id=com.amazon.kindle']]
 }
};

function competitionLogo(domain){
 return 'https://www.google.com/s2/favicons?sz=128&domain_url='+encodeURIComponent('https://'+domain);
}
function resetCompetition(){
 const btn=document.querySelector('.competition-tab[data-story="shopping"]');
 setCompetitionStory('shopping',btn);
 const wrap=document.getElementById('competitionCrumbWrap');if(wrap)wrap.style.display='none';
 go('competitionIndex');
}
function updateCompetitionCrumb(id){
 const wrap=document.getElementById('competitionCrumbWrap'),el=document.getElementById('competitionCrumb');
 if(!wrap||!el)return;
 if(id==='shopping'){wrap.style.display='none';return}
 const btn=document.querySelector('.competition-tab[data-story="'+id+'"]');
 el.textContent=btn?btn.textContent.replace(/\s+/g,' ').trim():id;
 wrap.style.display='inline';
}
function pairPct(value,max){
 if(value==null||max==null||!isFinite(value)||!isFinite(max)||max<=0)return 0;
 return Math.max(0,Math.min(100,(value/max)*100));
}
function ratingPct(score){
 if(score==null||!isFinite(score))return 0;
 return Math.max(0,Math.min(100,(score/5)*100));
}
function metricBlock(item,story,kind,maxValue){
 if(story.mode!=='numeric'){
  return '<div class="signal-qualitative"><small>'+story.metricLabel+'</small><strong>'+item.signal.display+'</strong></div>';
 }
 const pct=pairPct(item.signal.value,maxValue);
 return '<div class="signal-metric">'+
  '<div class="signal-metric-head"><span>'+story.metricLabel+'</span><strong>'+item.signal.display+'</strong></div>'+
  '<div class="signal-track"><i class="'+kind+'" style="width:'+pct+'%"></i></div>'+
 '</div>';
}
function ratingBlock(item,kind,showRatings){
 if(!showRatings)return '';
 return '<div class="signal-rating">'+
  '<div class="signal-metric-head"><span>تقييم Google Play</span><strong>'+item.rating.score+'/5</strong></div>'+
  '<div class="signal-track rating-track"><i class="'+kind+'" style="width:'+ratingPct(item.rating.score)+'%"></i></div>'+
  '<small>'+item.rating.reviews+'</small>'+
 '</div>';
}
function reasonBlock(item){
 return '<div class="signal-reasons"><small>لماذا قد تختاره؟</small><div>'+
  item.reasons.map(x=>'<span>'+x+'</span>').join('')+
 '</div></div>';
}
function signalCard(item,story,kind,maxValue,showRatings){
 return '<article class="signal-card '+kind+'">'+
  '<div class="signal-brand-head"><span class="signal-logo"><img src="'+competitionLogo(item.domain)+'" alt=""></span>'+
   '<div><small>'+item.tag+'</small><h4>'+item.name+'</h4><p class="signal-desc">'+item.desc+'</p></div></div>'+
  metricBlock(item,story,kind,maxValue)+ratingBlock(item,kind,showRatings)+reasonBlock(item)+
 '</article>';
}
function setCompetitionStory(id,btn){
 const story=competitionStories[id]||competitionStories.shopping;
 updateCompetitionCrumb(id);
 document.querySelectorAll('.competition-tab').forEach(b=>{
  const active=b.dataset.story===id;
  b.classList.toggle('active',active);
  b.setAttribute('aria-selected',active?'true':'false');
 });
 const root=document.getElementById('competitionStory');if(!root)return;
 const maxValue=story.mode==='numeric'?Math.max(story.regional.signal.value||0,story.global.signal.value||0):0;
 const showRatings=!!(story.regional.rating&&story.global.rating);
 root.innerHTML=
  '<div class="signal-pair '+(story.mode==='numeric'?'has-bars':'no-bars')+'">'+
   signalCard(story.regional,story,'regional',maxValue,showRatings)+
   '<div class="signal-center" aria-hidden="true"><span>↔</span></div>'+
   signalCard(story.global,story,'global',maxValue,showRatings)+
  '</div>'+
  '<div class="signal-conclusion"><b>الفرق باختصار</b><span>'+story.difference+'</span></div>'+
  '<div class="signal-source-row">'+story.sources.map(s=>'<a href="'+s[1]+'" target="_blank" rel="noopener noreferrer">'+s[0]+' ↗</a>').join('')+'</div>'+
  '<p class="signal-scale-note">'+(story.mode==='numeric'?'الشريط يقيس الانتشار أو الحجم فقط؛ نقاط «لماذا قد تختاره؟» تشرح القيمة العملية ولا تدخل في طول الشريط.':'لا يوجد مقياس رقمي متكافئ هنا، لذلك نعرض نقاط القوة دون شريط يوحي بمقارنة رقمية غير عادلة.')+'</p>';
}
// Competition renders lazily when its folded section is opened.

;

/* badilak-arab-progress-data-v123 */
const arabProgressData={
 innovation:{
  title:'مؤشر الابتكار العالمي',
  why:'يعكس قدرة البلد على تحويل التعليم والبحث والاستثمار إلى أفكار وتقنيات ومنتجات جديدة',
  note:'المركز العالمي — الرقم الأقل أفضل',
  sourceLabel:'WIPO · GII 2025',
  sourceUrl:'https://www.wipo.int/web-publications/global-innovation-index-2025/en/gii-2025-results.html',
  type:'rank',
  rows:[
   ['ae','الإمارات',30],['sa','السعودية',46],['qa','قطر',48],['ma','المغرب',57],['bh','البحرين',62],['jo','الأردن',65],
   ['om','عُمان',69],['kw','الكويت',73],['tn','تونس',76],['eg','مصر',86]
  ]
 },
 patents:{
  title:'طلبات البراءات حسب بلد مقدم الطلب',
  why:'يبين كم ابتكارًا وصل إلى مرحلة طلب الحماية القانونية، لا مجرد فكرة لم تُسجّل بعد',
  note:'طلبات 2024 — مقيم + طلبات بالخارج',
  sourceLabel:'WIPO · IP Statistics 2024',
  sourceUrl:'https://www.wipo.int/en/web/ip-statistics/country-profiles',
  type:'count',
  rows:[
   ['sa','السعودية',6071],['ae','الإمارات',1184],['dz','الجزائر',1117],['eg','مصر',756],['ma','المغرب',421],['tn','تونس',265],
   ['om','عُمان',147],['qa','قطر',129],['jo','الأردن',92],['kw','الكويت',88]
  ]
 },
 research:{
  title:'الإنتاج العلمي المسجل',
  why:'يبين حجم البحث العلمي المنشور دوليًا؛ أي نشاط المعرفة والبحث، لا جودة كل بحث على حدة',
  note:'Output في SCImago ARAB — أحدث نسخة متاحة',
  sourceLabel:'SCImago ARAB · Countries',
  sourceUrl:'https://www.scimagoarab.com/countries.php',
  type:'count',
  rows:[
   ['sa','السعودية',278290],['eg','مصر',201905],['iq','العراق',113213],['ae','الإمارات',84300],['ma','المغرب',67954],['dz','الجزائر',54169],
   ['jo','الأردن',50934],['tn','تونس',50232],['qa','قطر',32041],['lb','لبنان',27977]
  ]
 },
 ai:{
  title:'جاهزية الذكاء الاصطناعي',
  why:'يبين مدى استعداد البلد لاستخدام الذكاء الاصطناعي والاستفادة منه، لا عدد النماذج التي اخترعها',
  note:'IMF AIPI 2023 — من 0 إلى 1، الأعلى أفضل',
  sourceLabel:'IMF · AI Preparedness Index',
  sourceUrl:'https://www.imf.org/external/datamapper/datasets/AIPI',
  type:'score',
  rows:[
   ['ae','الإمارات',0.63],['sa','السعودية',0.58],['qa','قطر',0.53],['om','عُمان',0.53],['jo','الأردن',0.48],['kw','الكويت',0.46],
   ['ma','المغرب',0.43],['eg','مصر',0.39],['iq','العراق',0.27]
  ]
 },
 digital:{
  title:'التطور الرقمي والاتصال',
  why:'يبين مدى سهولة وجودة الوصول للإنترنت واستخدامه فعليًا؛ أساس أي اقتصاد وخدمة رقمية',
  note:'ITU IDI 2026 — من 0 إلى 100، الأعلى أفضل',
  sourceLabel:'ITU · ICT Development Index 2026',
  sourceUrl:'https://www.itu.int/dms_pub/itu-d/opb/ind/D-IND-ICT_MDD-2026-PDF-E.pdf',
  type:'score100',
  rows:[
   ['sa','السعودية',99.8],['ae','الإمارات',98.8],['kw','الكويت',98.4],['qa','قطر',98.4],['bh','البحرين',98.0],['om','عُمان',91.6],
   ['ma','المغرب',89.2],['dz','الجزائر',87.8],['jo','الأردن',87.0],['tn','تونس',80.1],['eg','مصر',79.6]
  ]
 },
 services:{
  title:'الخدمات الإلكترونية الحكومية',
  why:'يبين إلى أي مدى يستطيع الناس إنجاز خدماتهم الحكومية إلكترونيًا بدل الإجراءات التقليدية',
  note:'UN Online Service Index 2024 — من 0 إلى 1، الأعلى أفضل',
  sourceLabel:'UN DESA · E-Government Survey 2024',
  sourceUrl:'https://desapublications.un.org/publications/un-e-government-survey-2024',
  type:'score',
  rows:[
   ['sa','السعودية',0.9899],['ae','الإمارات',0.9163],['bh','البحرين',0.9030],['om','عُمان',0.8077],['qa','قطر',0.7655],
   ['jo','الأردن',0.7591],['eg','مصر',0.7002],['kw','الكويت',0.6365],['ma','المغرب',0.5618],['dz','الجزائر',0.3320]
  ]
 },
 cyber:{
  title:'النضج في الأمن السيبراني',
  why:'يبين جاهزية البلد لحماية فضائه الرقمي بالقوانين والتقنية والمؤسسات والمهارات والتعاون',
  note:'ITU GCI 2024 — فئات أداء، وليست ترتيبًا داخل الفئة',
  sourceLabel:'ITU · Global Cybersecurity Index 2024',
  sourceUrl:'https://www.itu.int/pub/D-HDB-GCI.01-2024',
  type:'tier',
  rows:[
   ['sa','السعودية',1],['ae','الإمارات',1],['eg','مصر',1],['jo','الأردن',1],['ma','المغرب',1],['om','عُمان',1],
   ['qa','قطر',1],['bh','البحرين',1],['dz','الجزائر',3],['kw','الكويت',3],['tn','تونس',3]
  ]
 },
 govtech:{
  title:'نضج الحكومة الرقمية GovTech',
  why:'يبين مدى تحول الحكومة نفسها إلى أنظمة وخدمات رقمية مترابطة تخدم الناس بكفاءة أكبر',
  note:'World Bank GTMI 2025 — مجموعات A إلى D، بلا ترتيب داخل المجموعة',
  sourceLabel:'World Bank · GTMI 2025',
  sourceUrl:'https://www.worldbank.org/en/programs/govtech/gtmi-2025-update',
  type:'group',
  rows:[
   ['sa','السعودية','A'],['ae','الإمارات','A'],['qa','قطر','A'],['bh','البحرين','A'],['om','عُمان','A'],['eg','مصر','A'],['jo','الأردن','A'],
   ['kw','الكويت','B'],['dz','الجزائر','B'],['tn','تونس','B'],['ma','المغرب','B'],['iq','العراق','C'],['lb','لبنان','C']
  ]
 }
};

const arabProgressFlagBase='/images/flags/';
const arabProgressCountryNames={ae:'الإمارات',sa:'السعودية',qa:'قطر',ma:'المغرب',bh:'البحرين',jo:'الأردن',om:'عُمان',kw:'الكويت',tn:'تونس',eg:'مصر',dz:'الجزائر',iq:'العراق',lb:'لبنان',sy:'سوريا',us:'الولايات المتحدة',gb:'بريطانيا'};
const arabProgressMeta={
 innovation:{icon:'account_tree',badge:'GII 2025',summary:'كلما كانت منظومة الابتكار أقوى، كانت الدولة أقدر على تحويل المعرفة والاستثمار إلى حلول ومنتجات جديدة.',points:[['01','تعليم وبحث قوي','مواهب ومعرفة تدفع الابتكار'],['02','بيئة أعمال نشطة','تمويل وشركات وفرص لتجربة الأفكار'],['03','مخرجات ملموسة','معرفة وتقنيات ومنتجات إبداعية']]},
 patents:{icon:'description',badge:'WIPO 2024',summary:'طلبات البراءات تكشف جانبًا من النشاط الابتكاري الذي وصل إلى مرحلة الحماية القانونية.',points:[['01','ابتكار قابل للحماية','الفكرة وصلت إلى طلب قانوني رسمي'],['02','نشاط تقني','إشارة إلى حركة تطوير واختراع'],['03','ملكية فكرية','أصل يمكن البناء عليه تجاريًا وتقنيًا']]},
 research:{icon:'school',badge:'SCImago',summary:'الإنتاج العلمي المنشور يوضح حجم حضور الباحثين والمؤسسات في صناعة المعرفة القابلة للتداول عالميًا.',points:[['01','معرفة منشورة','أبحاث وصلت إلى قنوات علمية دولية'],['02','باحثون ومؤسسات','حضور الجامعات والمراكز البحثية'],['03','قاعدة للمستقبل','معرفة يمكن أن تغذي التقنية والابتكار']]},
 ai:{icon:'code',badge:'IMF 2023',summary:'الجاهزية للذكاء الاصطناعي تعني امتلاك بنية ومهارات ومؤسسات تساعد على تبنيه والاستفادة منه.',points:[['01','بنية رقمية','اتصال وأنظمة قادرة على دعم الاستخدام'],['02','مهارات بشرية','تعليم ومواهب قادرة على العمل بالتقنية'],['03','بيئة تنظيمية','مؤسسات وقواعد تساعد على التبني الآمن']]},
 digital:{icon:'language',badge:'ITU 2026',summary:'الاتصال الرقمي القوي هو البنية الأساسية لأي خدمة إلكترونية أو اقتصاد رقمي يعمل على نطاق واسع.',points:[['01','وصول أوسع','ناس أكثر قادرون على الاتصال'],['02','استخدام فعلي','اتصال يتحول إلى نشاط وخدمات'],['03','جودة وتكلفة','تجربة رقمية أفضل وأكثر قابلية للاستخدام']]},
 services:{icon:'account_tree',badge:'UN 2024',summary:'الخدمات الإلكترونية تقيس مدى قدرة المواطن على إنجاز معاملاته والوصول للمعلومة والخدمة رقميًا.',points:[['01','خدمة أسهل','إجراءات أقل اعتمادًا على الحضور التقليدي'],['02','بوابات أنضج','محتوى وخدمات رقمية أكثر تكاملًا'],['03','مشاركة أفضل','قنوات أوسع للتفاعل والوصول للمعلومة']]},
 cyber:{icon:'shield',badge:'ITU 2024',summary:'النضج السيبراني يوضح مدى استعداد الدولة لحماية بنيتها الرقمية بالقانون والتقنية والمهارات والتعاون.',points:[['01','قوانين ومؤسسات','إطار واضح للمساءلة والاستجابة'],['02','قدرات تقنية','أدوات وفرق لحماية الأنظمة'],['03','مهارات وتعاون','رفع الجاهزية وتقليل أثر التهديدات']]},
 govtech:{icon:'account_tree',badge:'WB 2025',summary:'GovTech يقيس مدى نضج استخدام الحكومة نفسها للتقنية في الأنظمة والخدمات والتفاعل مع المواطنين.',points:[['01','أنظمة مترابطة','إدارة حكومية أكثر رقمية'],['02','خدمات عامة','تقديم خدمات أكثر كفاءة عبر التقنية'],['03','مشاركة وممكنات','بيانات ومؤسسات وقدرات تدعم التحول']]}
};
let currentArabMetric='innovation';
let arabCountryVisible=3;

function directoryCountryCount(code){
 return Object.values(itemCountryMap).filter(v=>countryInfoHasCode(v,code)).length;
}
function openCountryDirectory(code,country){
 window.badilakJourney?.remember();
 if(!directoryCountryCount(code))return;
 countryFilter=code;
 filter='all';subfilter='all';originFilter=null;
 const search=document.getElementById('searchInput');if(search)search.value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
 buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();closeDirectoryRefiners();renderCards();goDirectoryResults();
}
function toggleArabExtraMetrics(btn){
 const panel=document.getElementById('arabExtraMetrics');if(!panel)return;
 const opening=panel.hasAttribute('hidden');
 if(opening)panel.removeAttribute('hidden');else panel.setAttribute('hidden','');
 btn.setAttribute('aria-expanded',opening?'true':'false');
 const mark=btn.querySelector('.arab-more-plus');if(mark)mark.textContent=opening?'−':'+';
}
function closeArabExtraMetrics(){
 const panel=document.getElementById('arabExtraMetrics');
 const btn=document.getElementById('arabMoreMetricsBtn');
 if(panel&&!panel.hasAttribute('hidden'))panel.setAttribute('hidden','');
 if(btn){
  btn.setAttribute('aria-expanded','false');
  const mark=btn.querySelector('.arab-more-plus');if(mark)mark.textContent='+';
 }
}
function selectArabMetric(metric,btn=null){
 currentArabMetric=metric;
 arabCountryVisible=3;
 renderArabProgress(metric,btn);
}
function showMoreArabCountries(){
 const d=arabProgressData[currentArabMetric]||arabProgressData.innovation;
 arabCountryVisible=Math.min(d.rows.length,arabCountryVisible+3);
 renderArabProgress(currentArabMetric,null);
}
function arabMetricVisual(d,value){
 if(d.type==='rank'){
  return `<div class="arab-rank-track" aria-hidden="true"><span style="--pos:${Math.min(99,Math.max(1,((value-1)/99)*100))}%"></span></div>`;
 }
 if(d.type==='tier'){
  const strength=(6-Number(value))/5*100;
  return `<div class="arab-progress-bar" aria-hidden="true"><span style="--w:${strength.toFixed(1)}%"></span></div>`;
 }
 if(d.type==='group'){
  const score=({A:4,B:3,C:2,D:1})[value]||1;
  return `<div class="arab-progress-bar" aria-hidden="true"><span style="--w:${(score/4*100).toFixed(1)}%"></span></div>`;
 }
 const max=d.type==='count'?Math.max(...d.rows.map(r=>Number(r[2])||0)):d.type==='score'?1:100;
 const pct=Math.max(7,(Number(value)/max)*100);
 return `<div class="arab-progress-bar" aria-hidden="true"><span style="--w:${pct.toFixed(1)}%"></span></div>`;
}
function arabMetricValue(d,value){
 if(d.type==='rank')return `#${value} عالميًا`;
 if(d.type==='score')return Number(value).toFixed(4).replace(/0+$/,'').replace(/\.$/,'');
 if(d.type==='score100')return Number(value).toFixed(1);
 if(d.type==='tier')return `الفئة T${value}`;
 if(d.type==='group')return `المجموعة ${value}`;
 return new Intl.NumberFormat('ar-EG').format(value);
}
function arabProgressCountryControl(code,country,value,visual,first=false){
 const count=directoryCountryCount(code);
 const cls='arab-progress-row'+(first?' is-first':'')+(count?' has-directory':'');
 const inner=`<div class="arab-progress-country"><img src="${arabProgressFlagBase+code+'.png'}" alt=""><b>${country}</b></div>${visual}<div class="arab-progress-value">${value}</div>`;
 return count
  ? `<button type="button" class="${cls}" onclick="openCountryDirectory('${code}','${country}')" title="اعرض ${count} عنصرًا من ${country} في الدليل">${inner}</button>`
  : `<div class="${cls}">${inner}</div>`;
}
function renderArabProgress(metric=currentArabMetric,btn=null){
 initializedJourneyPanels.add('competitionIndex');
 const d=arabProgressData[metric]||arabProgressData.innovation;
 currentArabMetric=metric;
 document.querySelectorAll('[data-arab-metric]').forEach(b=>b.classList.toggle('active',b.dataset.arabMetric===metric));
 const root=document.getElementById('arabProgressChart');
 const source=document.getElementById('arabProgressSource');
 if(!root||!source)return;

 const visibleRows=d.rows.slice(0,arabCountryVisible);
 const rows=visibleRows.map(([code,country,value],i)=>
  arabProgressCountryControl(code,country,arabMetricValue(d,value),arabMetricVisual(d,value),i===0)
 ).join('');
 const remaining=d.rows.length-visibleRows.length;
 const add=Math.min(3,remaining);

 const meta=arabProgressMeta[metric]||arabProgressMeta.innovation;
 root.innerHTML=`
  <div class="arab-metric-head">
   <div class="arab-metric-copy">
    <div class="arab-metric-title-wrap"><span class="arab-metric-medallion"><span class="material-symbols-outlined">${meta.icon}</span></span><strong>${d.title}</strong><span class="arab-metric-badge">${meta.badge}</span></div>
    <small class="arab-metric-why">${d.why||''}</small>
   </div>
   <span class="arab-metric-scale">ماذا يقيس؟ · ${d.note}</span>
  </div>
  ${rows}
  ${remaining>0?`<div class="arab-country-more-wrap"><button type="button" class="arab-country-more" onclick="showMoreArabCountries()">+ ${add} دول <small>${remaining} متبقية</small></button></div>`:''}`;

 source.innerHTML=`<span>المصدر:</span><a href="${d.sourceUrl}" target="_blank" rel="noopener noreferrer">${d.sourceLabel} ↗</a><span>· آخر تحقق: 22 سبتمبر 2026</span><span>· اضغط دولة لها عناصر لعرضها في الدليل</span>`;
 const insight=document.getElementById('arabProgressInsight');
 if(insight){
  insight.innerHTML=`
   <div class="arab-insight-head"><span class="arab-insight-emblem"><span class="material-symbols-outlined">${meta.icon}</span></span><h3>لماذا يهم؟</h3></div>
   <p class="arab-insight-summary">${meta.summary}</p>
   <div class="arab-insight-list">${meta.points.map(([n,t,s])=>`<div class="arab-insight-point"><span>${n}</span><div><b>${t}</b><small>${s}</small></div></div>`).join('')}</div>
   <div class="arab-insight-quote">هذا المؤشر لا يحكي القصة كاملة وحده؛ لكنه يوضح نوعًا محددًا من التقدم يمكن مقارنته بين الدول بمصدر واحد.</div>`;
 }
}
// The index renders when its panel is first opened.
