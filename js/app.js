/* main-runtime */
const initializedJourneyPanels=new Set();

function countryInfoHasCode(info,code){
 return countryEntries(info).some(v=>v&&v[0]===code);
}
let filter='all',subfilter='all',originFilter=null,countryFilter=null,learningType='all';
let directoryVisible=window.matchMedia('(max-width:760px)').matches?6:window.matchMedia('(max-width:1023px)').matches?8:12;
let learningVisible={platform:4,channel:4,reciter:4};
const learningSectionOpen={channel:false,reciter:false};
const learningCarouselIndex={platform:0,resource:0,channel:0,reciter:0};

function directoryBatchSize(){
 const mobile=window.matchMedia('(max-width:760px)').matches;
 const tablet=!mobile&&window.matchMedia('(max-width:1023px)').matches;
 const specific=subfilter!=='all'||!!originFilter||!!countryFilter||
  !!(document.getElementById('searchInput')?.value||'').trim();
 // Wider discovery batches; precise lookups remain deliberately smaller.
 return specific?(mobile?4:6):(mobile?6:tablet?8:12);
}
// Stable topic/name order. Familiar-service rotation on the homepage is independent.
const discoveryCategoryOrder=['work','learn','tech','create','culture','shopping'];
function discoveryPrimaryCategory(e){return e.directory?.cat||e.learningContexts?.[0]?.[0]||'learn';}
function orderDirectoryDiscoveryCards(list,search){
 if(search)return list;
 return list.slice().sort((a,b)=>discoveryCategoryOrder.indexOf(discoveryPrimaryCategory(a))-discoveryCategoryOrder.indexOf(discoveryPrimaryCategory(b))||(a.directory?.name||a.learning.name).localeCompare(b.directory?.name||b.learning.name,'ar')||a.id.localeCompare(b.id));
}
function beginDirectoryDiscoveryVisit(){} // Compatibility for existing navigation/history calls.
window.badilakDirectoryRotation={capture:()=>null,restore(){},enter:beginDirectoryDiscoveryVisit};
function discoveryResultGroups(list,q){
 if(q||discoveryPurpose!=='all'||discoveryType!=='all'||discoveryField!=='all'||countryFilter||originFilter)return null;
 if(discoveryPath!=='all')return [{id:'use',name:'خيارات تساعدك على التنفيذ',entries:list.filter(e=>!e.learn||e.use)},{id:'learn',name:'تعلّم ما يساعدك على التطبيق',entries:list.filter(e=>e.learn&&!e.use)}].filter(g=>g.entries.length);
 if(filter!=='all')return null;
 return discoveryCategoryOrder.map(cat=>({id:cat,name:categoryNames[cat],entries:list.filter(e=>discoveryPrimaryCategory(e)===cat)})).filter(g=>g.entries.length);
}
function visibleDiscoveryGroups(groups,limit){
 const visible=groups.map(g=>({...g,shown:[]}));
 let remaining=limit;
 for(let i=0;remaining>0;i++){
  let added=false;
  for(const group of visible){if(group.entries[i]&&remaining>0){group.shown.push(group.entries[i]);remaining--;added=true;}}
  if(!added)break;
 }
 return visible.filter(g=>g.shown.length);
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
 // Search remains visible when the visitor changes category or returns to results.
 document.getElementById('directoryRefineSearch')?.removeAttribute('hidden');
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

 const hasSub=filter!=='all'&&Array.isArray(subfilterMap[filter])&&subfilterMap[filter].length>1;
 const subPanel=document.getElementById('directoryRefineSub');if(subPanel)subPanel.hidden=!hasSub;
 document.querySelectorAll('[data-filter]').forEach(b=>{
  const selected=b.dataset.filter===filter;
  if(b.tagName==='A'){
   if(selected)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');
  }else b.setAttribute('aria-pressed',String(selected));
 });
 document.querySelectorAll('[data-subfilter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.subfilter===subfilter)));
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
 if(options.scroll!==false)goDirectoryResults();
}
function setDirectoryFilter(v){
 resetDiscoveryFilters();
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
// Each explicit filter choice is a restorable step; keep the directory route on “all”.
function discoveryLocation(){
 const params=new URLSearchParams();
 if(discoveryPath!=='all')params.set('path',discoveryPath);
 if(subfilter!=='all')params.set('sub',subfilter);
 if(discoveryPurpose!=='all')params.set('purpose',discoveryPurpose);
 if(discoveryType!=='all')params.set('type',discoveryType);
 if(discoveryField!=='all')params.set('field',discoveryField);
 return (filter==='all'?'/':'/category/'+encodeURIComponent(filter))+(params.size?'?'+params.toString():'')+(filter==='all'?'#directory':'');
}
function rememberDirectorySelection(){
 if(!originFilter&&!countryFilter){const url=discoveryLocation();if(location.pathname+location.search+location.hash!==url)history.pushState({},'',url);}
 window.badilakJourney?.remember();
}
function setFilter(v,el){
 window.badilakJourney?.remember();
 discoveryPath='all';
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
 beginDirectoryDiscoveryVisit(false);
 renderCards();
 rememberDirectorySelection();
}
function setSubfilter(v,el){
 window.badilakJourney?.remember();
 subfilter=v;
 if(originFilter){
  const hasRelatedItems=items.some(x=>matchesDirectoryOrigin(x,originFilter)&&(filter==='all'||x.cat===filter)&&x.sub===v);
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
 beginDirectoryDiscoveryVisit(false);
 renderCards();
 rememberDirectorySelection();
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
 resetDiscoveryFilters();
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
 resetDiscoveryFilters();
 if(/^\/category\//.test(location.pathname))history.replaceState({},'','/');
 filter='all';subfilter='all';originFilter=null;countryFilter=null;
 document.getElementById('searchInput').value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
 buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();closeDirectoryRefiners();renderCards();go('directory')
}
function showAllDirectory(){
 resetDiscoveryFilters();
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
 const hasAny=discoveryPath!=='all'||discoveryPurpose!=='all'||!!countryFilter||filter!=='all'||subfilter!=='all'||!!originFilter||!!q;
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
 resetDiscoveryFilters();
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
function originContextLabel(id){if(['claude','gemini','kimi','deepseek'].includes(id))return 'مهام عربية لمستخدمي '+originName(id);return id==='youtube'?'محتوى عربي على YouTube':'خيارات في مجال '+originName(id)}


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
 const path=discoveryPaths[discoveryPath];
 if(path){
   root.innerHTML=sectionContinueMarkup('وسّع نطاق الاكتشاف','لخيارات إضافية، انتقل إلى المجال الأوسع.',[[`كل ${categoryLabel(path.category)}`,`openDiscoveryGroup('${path.category}','all')`]]);
   return;
 }
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

// Card-only summaries; preserve complete focus text in learning details.
const learningDisplaySummaries={
  "yanfaa":"كورسات عربية في مهارات متعددة.",
  "edraak-learning":"مقررات ودورات عربية متنوعة.",
  "rwaq":"مساقات أكاديمية ومهارية بالعربية.",
  "almentor":"تعلم مهني ومهارات بالعربية.",
  "salla-academy":"دروس لإدارة المتاجر الإلكترونية.",
  "qoyod-academy":"دورات عربية في المحاسبة ونظام قيود.",
  "daftra-hub":"دروس في المحاسبة وإدارة الأعمال.",
  "khamsat-blog":"مقالات عن العمل الحر والتسويق.",
  "hsoub-library":"كتب ودروس في البرمجة والتقنية.",
  "zamerican":"شرح عربي لتعلم الإنجليزية.",
  "droosonline":"محتوى تعليمي ومهارات عملية.",
  "elzero":"دروس عربية في البرمجة وتطوير الويب.",
  "makram":"شروح عربية للتصميم والمونتاج.",
  "hsoub-youtube":"شروح في البرمجة وسوق العمل.",
  "akhdar-youtube":"ملخصات كتب ومهارات عملية بالعربية.",
  "khan-arabi":"دروس في الرياضيات والعلوم بالعربية.",
  "abdulbasit-official":"تلاوات الشيخ عبد الباسط الأصلية.",
  "hussary-official":"تلاوات مرتلة ومجودة للحصري.",
  "mostafa-ismail-official":"تسجيلات رسمية لتلاوات مصطفى إسماعيل.",
  "maher-official":"مصحف وتلاوات رسمية للمعيقلي.",
  "alafasy-official":"تلاوات وإصدارات صوتية للعفاسي.",
  "saad-ghamdi-official":"مصحف مرتل وتلاوات سعد الغامدي.",
  "misk-skills":"مهارات واستعداد مهني للشباب.",
  "thmanyah-youtube":"وثائقيات وبرامج وبودكاست عربي.",
  "alef-learning":"تعلم رقمي للمراحل المدرسية.",
  "dff-academy":"مهارات مستقبلية ودورات تدريبية.",
  "qdl-youtube":"فيديوهات عن أرشيف الخليج ومصادره.",
  "kezakoo-learning":"دروس وتمارين للثانوي المغربي.",
  "telmidtice-learning":"دروس وتمارين وامتحانات مغربية.",
  "bibf-learning":"دورات مهنية في التمويل والإدارة.",
  "edlal-learning":"تعلم عربي في المعرفة والمهارات.",
  "tadarab-learning":"دورات عربية في الأعمال والمهارات.",
  "gomycode-learning":"مسارات تقنية في البرمجة والبيانات.",
  "cnfepd-learning":"تكوين مهني عن بعد في تخصصات متنوعة.",
  "newton-learning":"دروس وكتب وتمارين للطلاب بالعراق.",
  "kamkalima-learning":"تعليم العربية للمدارس والمعلمين."
};
function learningGuideLinkMarkup(id,detail=false){return guideLinkMarkup(learningGuideMap[id],detail)}

function originFitNoteText(origin){
 const taskNotes={adobeexpress:'لتصميم محتوى عربي بالقوالب والنصوص؛ ليست مقارنة بكل قدرات Adobe Express أو ضمانًا لنقل ملفاته.',wix:'لإنشاء موقع أو متجر دون برمجة؛ راجع القوالب والتكاملات وإمكان نقل موقعك قبل التغيير.',smallpdf:'لمعالجة مستندات PDF بالعربية؛ تحقق من الأداة المطلوبة وحدود الملفات والخصوصية قبل رفع مستندك.',upwork:'لطرح مشروع واستقبال عروض مستقلين؛ تختلف العقود والرسوم وآليات الدفع والحماية بين المنصات.',ebay:'للبيع والشراء المباشر محليًا؛ الإعلانات المبوبة ليست سوق مزادات، ولا تضمن حماية المشتري أو الشحن مثل منصة أخرى.'};
 if(taskNotes[origin])return taskNotes[origin];
 if(['claude','gemini','kimi','deepseek'].includes(origin))return 'ابدأ بمهمة محادثة أو كتابة بالعربية. هذه خيارات لاستكشاف المهمة أو جزء منها، وليست بدائل كاملة لـ'+originName(origin)+' أو مقارنة موثقة بكل ميزاته. افتح المعلومات لتعرف الفرق بين مساعد جاهز، ونموذج للتطوير، وحل للمؤسسات.';
 if(origin==='chatgpt')return 'محادثة جاهزة، أم نموذج لتطوير تطبيق، أم خدمة للمؤسسة؟ هذه الخيارات ليست بدائل متطابقة. جرّب مهمتك أولًا؛ قد تكفيك أداة مكمّلة دون نقل عملك.';
 return origin==='canva'
  ? 'محرر تصميم، وعروض تقديمية، وخط عربي: اختر بحسب المهمة. قد تحتاج أداة مكمّلة فقط؛ جرّب مشروعًا واحدًا قبل نقل عملك. ترتيب العرض ليس تقييمًا للأفضل.'
  : 'خيارات تؤدي المهمة نفسها أو جزءًا منها؛ ترتيب العرض ليس تقييمًا للأفضل.';
}

function renderCards(){
 initializedJourneyPanels.add('directory');
 syncDiscoveryControls();
 window.badilakJourney?.updateTitle();
 updateDirectoryRefineUI();
 const q=document.getElementById('searchInput').value.trim();
 const list=searchDiscoveryEntries(discoveryIndex.filter(discoveryMatchesContext),q);
 const newsRoot=document.getElementById('directoryRelatedNews');
 newsRoot.innerHTML=discoveryEditorialMarkup(list);newsRoot.hidden=!newsRoot.innerHTML;
 let context=[];
 if(discoveryPaths[discoveryPath])context.push(discoveryPaths[discoveryPath].name);
 if(discoveryPurpose!=='all')context.push(discoveryPurpose==='learn'?'أتعلّم وأطبّق':'أستخدم وأنجز');
 if(discoveryType!=='all')context.push(discoveryTypeNames[discoveryType]);
 if(discoveryField!=='all')context.push(discoveryFieldNames[discoveryField]);
 if(filter!=='all') context.push(categoryLabel(filter));
 if(subfilter!=='all') context.push(subcategoryLabel(filter,subfilter));
 if(originFilter) context.push(originContextLabel(originFilter));
 if(countryFilter) context.push(arabProgressCountryNames[countryFilter]||countryFilter);
 const ordered=orderDirectoryDiscoveryCards(list,q),groups=discoveryResultGroups(ordered,q);
 const shownGroups=groups?visibleDiscoveryGroups(groups,directoryVisible):null;
 const shown=shownGroups?shownGroups.flatMap(g=>g.shown):ordered.slice(0,directoryVisible);
 const fitNote=document.getElementById('originFitNote');
 if(fitNote){fitNote.hidden=!originFilter;fitNote.textContent=originFitNoteText(originFilter);}
 document.getElementById('stateLine').textContent=`نعرض ${Math.min(shown.length,list.length)} من ${list.length} بطاقة${context.length?' · '+context.join(' · '):' · كل الاكتشافات'}`;
 const root=document.getElementById('catalogGrid');
 root.classList.toggle('is-grouped',!!shownGroups);
 const more=document.getElementById('directoryMore');
 if(!list.length){
   root.innerHTML='<div class="empty">لم تظهر نتائج بهذه العبارة ضمن التصفية الحالية. جرّب كلمة أخرى أو اعرض الكل. <button class="more-btn" onclick="showAllDirectory()">عرض الكل</button></div>';
   if(more)more.innerHTML='';
   updateDirectoryContinue();
   return;
 }
 root.innerHTML=shownGroups?shownGroups.map(g=>`<section class="catalog-group" aria-labelledby="catalog-group-${g.id}"><div class="catalog-group-head"><h3 id="catalog-group-${g.id}">${g.name}</h3>${discoveryPath==='all'?`<a href="/category/${g.id}" onclick="return badilakFilterCategory(event,'${g.id}',this)">عرض المجال (${g.entries.length}) ←</a>`:''}</div><div class="catalog-group-items">${g.shown.map(discoveryCardMarkup).join('')}</div></section>`).join(''):shown.map(discoveryCardMarkup).join('');
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
  const titleMarkup=`<h3 class="learning-group-title">${label}</h3>`;
  return `<section class="learning-group learning-carousel-group" id="learning-group-${type}">${titleMarkup}
   <div class="learning-carousel-shell">
    <div class="learning-carousel-viewport"><div class="learning-grid learning-carousel-track">${g.map(x=>`
     <article class="learning-card" data-learning-id="${x.id}">
      ${logoMarkup(x.logo,'learning-logo',x.name)}
      <h3>${x.name}</h3>
      ${countryBadgeMarkup(x,learningCountryMap)}
      ${x.vendorContent?'<div class="learning-vendor-note">محتوى من الجهة نفسها</div>':''}
      <p class="learning-focus">${learningDisplaySummaries[x.id]||compactCardLine(x.focus,30)}</p>
      <div class="learning-card-actions ${learningGuideMap[x.id]?'':'is-single'}">
       <div class="learning-actions"><button type="button" onclick="showLearningNote('${x.id}');return false;" aria-label="معلومات عن ${x.name}">معلومات</button></div>
       ${learningGuideMap[x.id]?`<div class="learning-card-guide-slot">${learningGuideLinkMarkup(x.id)}</div>`:''}
      </div>
     </article>`).join('')}</div></div>
   </div>
  </section>`;
 }).join('') || '<div class="empty">لا توجد مصادر مطابقة. <button class="more-btn" onclick="resetLearning()">كل المصادر</button></div>';
 updateLearningContinue();
}



function shortDecisionText(text='',max=112){
 const t=String(text).replace(/<[^>]+>/g,'').trim();
 return t.length>max?t.slice(0,max-1).trim()+'…':t;
}
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
// Editorial starting steps based on each curated source; not completed service tests.
const learningActions={
 "yanfaa": "حدّد مهارة تحتاجها في عملك، واختر دورة من ينفع تناسب مستواك. بعد درس متاح لك، نفّذ تطبيقًا صغيرًا دون تقليد الشرح، وسجّل ما احتجت إلى مراجعته.",
 "edraak-learning": "اختر مقررًا من إدراك يخدم سؤالًا محددًا لديك. بعد وحدة متاحة، اكتب إجابة السؤال من فهمك ثم راجعها بالمادة؛ افحص شروط الالتحاق والشهادة في صفحة المقرر.",
 "rwaq": "اقرأ خطة مادة في رواق ومتطلباتها، وحدّد موضوعًا تريد فهمه. لخّص درسًا متاحًا بثلاث نقاط، ثم اكتب سؤالًا لم تجب عنه المادة بعد.",
 "almentor": "قبل الاشتراك في المنتور، طابق محتوى دورة مع مهمة تحتاج إنجازها. إن أتيحت معاينة فقيّم وضوح الشرح، وبعد درس متاح لك طبّق خطوة على مثال من إعدادك.",
 "salla-academy": "اختر مادة عن وصف المنتجات أو إدارة الطلبات في أكاديمية سلة. اكتب وصفًا لمنتج افتراضي أو خطوات معالجة طلب على ورقة، ثم راجع ما ينقصه دون إنشاء متجر أو نشر عرض.",
 "qoyod-academy": "اختر درسًا تمهيديًا في أكاديمية قيود، وطبّق مفهومه على أرقام افتراضية في ورقة. اشرح سبب كل خطوة؛ لا تستخدم التمرين لإقرار ضريبة أو تسجيل حسابات فعلية.",
 "daftra-hub": "ابحث في مركز دفترة عن مفهوم محاسبي أو إداري تحتاجه. حوّل شرح المقال إلى مثال بأرقام افتراضية، وافصل القاعدة العامة عن الخطوات الخاصة ببرنامج دفترة.",
 "khamsat-blog": "اختر مقالًا عن وصف الخدمة في مدونة خمسات، واكتب مسودة لخدمة تعرف تنفيذها: الناتج وحدوده ومدة التسليم. راجع وضوحها وصدقها دون نشر أو وعد لا تستطيع الوفاء به.",
 "hsoub-library": "اختر درسًا تقنيًا من مكتبة حسوب يناسب مستواك. نفّذ مثالًا محليًا ببيانات تجريبية، ثم غيّر مدخلًا واحدًا واشرح أثره؛ راجع إصدار التقنية المذكور في الدرس.",
 "zamerican": "اختر درسًا من المستوى المناسب في zAmericanEnglish. استمع إلى مثال ثم كوّن ثلاث جمل جديدة باستخدامه؛ أعد الاستماع وراجع النطق والمعنى بدل حفظ المثال وحده.",
 "droosonline": "اختر فيديو من دروس أونلاين يحل مشكلة تعلّم تواجهك. حوّل فكرة واحدة إلى إجراء تنفذه اليوم، ثم دوّن ما تغيّر وما لم يساعدك بدل الانتقال مباشرة إلى فيديو آخر.",
 "elzero": "اختر درسًا من مسار يناسب مستواك في Elzero Web School. اكتب المثال بنفسك، ثم أعد بناء جزء منه دون الفيديو وغيّر قيمة واحدة لتتأكد أنك تفهم النتيجة.",
 "makram": "اختر شرحًا عند مصطفى مكرم يوافق البرنامج وإصداره لديك. طبّق مهارة واحدة على صورة أو مقطع تملك حق استخدامه، ثم احفظ نسخة وقارنها بالأصل من حيث وضوح النتيجة.",
 "hsoub-youtube": "اختر شرحًا برمجيًا من قناة أكاديمية حسوب، وسجّل المتطلبات قبل البدء. أعد المثال في بيئة تجريبية، ثم فسّر خطأ واجهك وكيف أصلحته دون نسخ أسرار أو بيانات عمل.",
 "akhdar-youtube": "اختر ملخص كتاب من أخضر، واكتب فكرته الأساسية وادعاءً يحتاج تحققًا. ارجع إلى الكتاب أو مصدره قبل نسبته للمؤلف؛ الملخص يساعدك على الاختيار ولا يغني عن الأصل.",
 "khan-arabi": "اختر شرحًا لمفهوم رياضي في KhanAcademyArabi. أوقف الفيديو قبل الحل وحاول بنفسك، ثم حل مثالًا بأرقام مختلفة واشرح سبب كل خطوة.",
 "abdulbasit-official": "اختر مقطعًا قصيرًا من تلاوات عبد الباسط، وحدّد من وصفه السورة ونوع التسجيل. تابعه في مصحف موثوق، وسجّل موضعًا تريد فهم حكم تلاوته مع معلّم.",
 "hussary-official": "اختر تسجيلًا مرتلًا للحصري وتحقّق من الرواية المذكورة. استمع إلى آيات قليلة مع المصحف، ثم كرّرها واعرض ما يشكل عليك على معلّم؛ الاستماع وحده لا يصحح كل أخطاء النطق.",
 "mostafa-ismail-official": "اختر تسجيلًا واضحًا لمصطفى إسماعيل وحدّد الآيات من وصفه. تابع مواضع الوقف في المصحف، ودوّن سؤالًا عن وقف لم تفهمه لمراجعته مع معلّم.",
 "maher-official": "اختر سورة قصيرة من قناة ماهر المعيقلي، وقسّم استماعك إلى آيات قليلة. بعد التكرار حاول استرجاعها ثم راجع النص في المصحف، دون اعتبار الحفظ دليلًا على سلامة التجويد.",
 "alafasy-official": "من قناة العفاسي اختر تلاوة قرآنية للسورة المقصودة، وراجع الرواية ووصف التسجيل. استمع إلى مقطع قصير وتابع الآيات في المصحف، ثم راجع الكلمات التي لم تلتقطها بوضوح.",
 "saad-ghamdi-official": "اختر مقطعًا من المصحف المرتل لسعد الغامدي، وحدّد مقدارًا صغيرًا للمراجعة. استمع ثم استرجع الآيات وراجع مواضع النسيان بالمصحف؛ استعن بمعلّم لتصحيح الأداء.",
 "misk-skills": "حدّد مهارة مهنية تستهدفها، ثم افحص أهلية الالتحاق والوقت المطلوب لبرنامج في مسك المهارات. اكتب ناتجًا عمليًا تريد الخروج به، مثل مسودة تعريف مهني، وقارنه بأهداف البرنامج.",
 "thmanyah-youtube": "اختر حلقة من ثمانية عن موضوع يهمك. اكتب ادعاءً واقعيًا ورأيًا شخصيًا وردا فيها، وابحث عن المصدر الأصلي للادعاء؛ شهرة الضيف لا تكفي للتحقق.",
 "alef-learning": "إذا أتاحت مدرستك الدخول إلى ألف، اختر مع المعلم درسًا من صفك. حل نشاطًا متاحًا ثم اشرح خطأ واحدًا وكيف صححته؛ إن لم يتوفر الدخول، استفسر من المدرسة قبل إنشاء حساب.",
 "dff-academy": "راجع دورة في أكاديمية دبي للمستقبل تناسب مهارة تريدها، وتحقّق من لغتها وإتاحتها. بعد جزء متاح، اكتب أثرًا محتملًا للفكرة على عملك وافتراضًا يحتاج دليلًا قبل تطبيقها.",
 "qdl-youtube": "اختر فيديو من قناة مكتبة قطر الرقمية عن وثيقة أو خريطة. دوّن اسمها وتاريخها إن ذُكرا، ثم ابحث عن سجلها في المكتبة واقرأ وصفها؛ افصل ما يظهر في الأصل عن تفسيره.",
 "kezakoo-learning": "اختر في Kezakoo مستواك ومادة من المنهج المغربي. حاول حل تمرين متاح قبل مشاهدة التصحيح، ثم حدّد موضع الخطأ وأعد الحل؛ راجع إتاحة الدرس ضمن حسابك.",
 "telmidtice-learning": "حدّد مستواك ومادتك في TelmidTICE، واختر درسًا وتمرينًا مرتبطًا به إن توفرا. حل على ورقة قبل مراجعة التصحيح، ثم اشرح القاعدة بكلماتك مع مراعاة المنهج المغربي.",
 "bibf-learning": "اختر برنامجًا في BIBF يناسب هدفك المهني، مثل فهم مبادئ التمويل الإسلامي. قارن محتواه ومتطلباته ولغته واعتراف جهة عملك بالشهادة قبل دفع أي رسوم.",
 "edlal-learning": "ابحث في إدلال عن دورة نشطة تناسب مهارة تحتاجها. راجع الإتاحة والمتطلبات، وإن أتيح درس فحوّل فكرته إلى إجراء صغير في يومك وقِس قدرتك على تنفيذه دون الرجوع للشرح.",
 "tadarab-learning": "اختر دورة في تدرب مرتبطة بمهمة محددة، وراجع المحتوى والمدرب وشروط الوصول. إن أتيح لك درس، أنجز تطبيقًا صغيرًا وراجع الناتج؛ شهادة الإتمام وحدها لا تثبت اكتساب المهارة.",
 "gomycode-learning": "حدّد مسارًا تقنيًا في GOMYCODE وفرعًا أو طريقة دراسة تناسبك. اسأل عن المتطلبات والمشروع العملي والتكلفة الكاملة؛ قيّم نموذج مشروع إن توفر قبل الالتزام بالبرنامج.",
 "cnfepd-learning": "اختر تخصصًا لدى CNFEPD وراجع شروطه الرسمية ومدته ونوع الشهادة وطريقة التقييم. طابقها مع مؤهلك ووقتك وهدفك المهني قبل تقديم وثائق أو دفع رسوم.",
 "newton-learning": "اختر صفك ومادتك في منصة نيوتن وفق المنهج العراقي. بعد محاضرة متاحة، حل سؤالًا من المادة دون الرجوع للشرح، ثم سجّل النقطة التي تحتاج سؤال المعلم عنها.",
 "kamkalima-learning": "إذا أتاحت مدرستك كم كلمة، اختر مع المعلم نشاط قراءة أو كتابة مناسبًا. اكتب فقرة قصيرة ثم راجع وضوح الفكرة ودليلها والأخطاء اللغوية وفق الملاحظات المتاحة."
};
function learningDecisionPanelMarkup(x){
 const n=learningDecisionNoteFor(x);if(!n)return '';
 return `<section class="decision-panel">
  <div class="decision-panel-head"><strong>مهم قبل الاختيار</strong></div>
  <p class="decision-alert-text">${n.alert}</p>
  <div class="decision-action"><b>ما الذي يمكنك فعله؟</b><span>${learningActions[x.id]||n.action}</span></div>
 </section>`;
}

function openDiscoveryGroup(cat,sub='all'){
 window.badilakJourney?.remember();
 resetDiscoveryFilters();
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
// Keep school curricula, professional learning and recitation in their own context.
// A shared format (e.g. YouTube) or the broad "skills" tag alone is not a match.
const learningComparisonGroups=[
 ['yanfaa','edraak-learning','rwaq','almentor','misk-skills','dff-academy','bibf-learning','edlal-learning','tadarab-learning','gomycode-learning','cnfepd-learning'],
 ['alef-learning','kezakoo-learning','telmidtice-learning','newton-learning','kamkalima-learning'],
 ['zamerican','droosonline'],['elzero','hsoub-youtube','hsoub-library'],
 ['qoyod-academy','daftra-hub'],['khamsat-blog','hsoub-library'],
 ['makram','gomycode-learning','almentor','tadarab-learning'],
 ['abdulbasit-official','hussary-official','mostafa-ismail-official','maher-official','alafasy-official','saad-ghamdi-official']
];
function relatedLearningItems(x){
 const grouped=new Set(learningComparisonGroups.filter(g=>g.includes(x.id)).flat());
 return learning.filter(a=>a.id!==x.id&&grouped.has(a.id))
  .map(a=>({item:a,score:(a.fields||[]).filter(f=>(x.fields||[]).includes(f)&&f!=='skills').length*4+(a.type===x.type?1:0)}))
  .filter(r=>r.score>0)
  .sort((a,b)=>b.score-a.score||a.item.name.localeCompare(b.item.name,'ar'))
  .slice(0,2)
  .map(r=>r.item);
}
function learningDiscoveryMarkup(x){
 const related=relatedLearningItems(x);
 const format={platform:'منصة تعلّم',resource:'مصدر تعليمي',channel:'قناة تعليم ومعرفة',reciter:'قناة تلاوة'};
 return `<details class="detail-task-comparison">
  <summary><span><strong>${related.length?'قارن مصادر لهذا الاهتمام':'هل يوجد مصدر آخر يناسبك؟'}</strong><small>${related.length?'المحتوى، وطريقة التعلّم، وما يحتاج مراجعة':'حدود المقارنة المتاحة'}</small></span></summary>
  <div class="task-comparison-body">
   <p class="task-comparison-intro">${related.length?(x.type==='reciter'?'قنوات تلاوة أخرى؛ اختر التسجيل والرواية اللذين تحتاجهما. العرض ليس ترتيبًا للقراء.':'هذه مصادر مرتبطة باهتمامك، وليست بالضرورة نفس المقرر أو المستوى. حدّد هدفك، ثم راجع الدرس أو المسار نفسه؛ الترتيب لا يعكس تقييمًا للجودة.'):'لا توجد لدينا مقارنة كافية لهذا الاستخدام حاليًا. تصفّح المصادر حسب هدفك؛ وجودها في المجال نفسه لا يثبت أنها تقدم المحتوى نفسه.'}</p>
   ${related.length?`<ul class="task-comparison-list">${[x,...related].map(a=>`<li>
    <div class="task-comparison-heading"><h4>${a.id===x.id?`<bdi>${a.name}</bdi>`:`<button type="button" class="task-comparison-link" onclick="showLearningNote('${a.id}')"><bdi>${a.name}</bdi></button>`}</h4>${a.id===x.id?'<span class="task-comparison-current">تقرأ عنه الآن</span>':''}</div>
    <p class="task-comparison-task">${a.focus}</p><p>${format[a.type]} · ${a.teacher}</p>
    <p class="task-comparison-check"><b>قبل الاختيار:</b> ${a.type==='resource'?a.reference:learningDecisionNoteFor(a).alert}</p>
    <div class="task-comparison-evidence">${a.type==='resource'?'':a.reference+' · '}<a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.type==='reciter'?'القناة الرسمية':'المصدر'}</a></div>
   </li>`).join('')}</ul>`:''}
  <button type="button" class="detail-collection" onclick="closeModal();showAllLearning()">عرض كل مصادر التعلّم</button>
  </div>
 </details>`;
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
   ${learningDecisionPanelMarkup(x)}
   <div class="detail-facts">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}
   ${discoveryPairs[x.id]?`<details class="paired-resource-details"><summary>معلومات المنصة والتجربة العملية</summary>${directoryDetailMarkup(items.find(item=>item.id===discoveryPairs[x.id])).replace(/<h1 class="quick-title"/,'<h3 class="quick-title"').replace('</h1>','</h3>')}</details>`:''}
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

// Directory exits require a deliberate choice; reuse existing evidence/comparisons.
function openExternal(id){
 const x=items.find(a=>a.id===id);if(!x||!x.url||x.url==='#'){alert('لا يتوفر لهذا العنصر رابط رسمي موثق حاليًا.');return}
 const trigger=document.activeElement;
 const r=resolveCommercialLink(id,x.url);
 const hasComparison=relatedDirectoryItems(x).length>0||!!canvaTaskComparisonMarkup(x);
 window.badilakOutbound.open({name:x.name,domain:x.domain,url:r.url,affiliate:r.affiliate,
  reviewLabel:hasComparison?'راجع البدائل ونقاط قوتها أولًا':'راجع التفاصيل والقيود أولًا',
  onContinue:()=>document.dispatchEvent(new CustomEvent('badilak:outbound',{detail:{id,kind:r.affiliate?'affiliate':'official'}})),
  onReview:()=>{
   if(trigger?.isConnected)trigger.focus({preventScroll:true});
   openDetail(id);
   if(hasComparison){
    const comparison=document.querySelector('#modalBody .detail-task-comparison:not(.practical-trial)');
    if(comparison){comparison.open=true;comparison.querySelector('summary')?.focus();comparison.scrollIntoView({block:'start',behavior:'instant'});}
   }
  }
 });
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
 const returningDetail=activeDetail;
 // Comparisons can open a resource absent from the underlying results. Return to
 // the card that opened the dialog, even when history recreates its DOM element.
 const returningCard=detailReturnFocus?.closest('[data-item-id],[data-learning-id]');
 const returningItemId=returningCard?.dataset.itemId||returningCard?.dataset.learningId||returningDetail?.id;
 const returningAttribute=returningCard?.hasAttribute('data-learning-id')?'data-learning-id':'data-item-id';
 const returnControl=detailReturnFocus?.matches('.more-btn')?'.more-btn':detailReturnFocus?.matches('.destination-link')?'.destination-link':'.item-identity';
 activeDetail=null;
 modal.close();
 modal.classList.remove('show');
 document.body.classList.remove('lock');
 if(detailReturnFocus?.isConnected)detailReturnFocus.focus({preventScroll:true});
 detailReturnFocus=null;
 if(methodologyReturnFocus?.isConnected)methodologyReturnFocus.focus({preventScroll:true});
 methodologyReturnFocus=null;
 if(options.route!==false&&routedDetail){
  if(routeState&&routeState.badilakDetail&&routeState.returnPath&&history.length>1){
   // The history adapter recreates cards; focus their new element after restoration.
   window.addEventListener('popstate',()=>requestAnimationFrame(()=>{
    document.querySelector(`[${returningAttribute}="${returningItemId}"] ${returnControl}`)?.focus({preventScroll:true});
   }),{once:true});
   history.back();
  }
  else history.replaceState({},'',detailRouteReturnPath||'/');
 }
}
document.getElementById('detailModal').addEventListener('cancel',event=>{event.preventDefault();closeModal();});
document.getElementById('detailModal').addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const controls=[...event.currentTarget.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex="0"]')].filter(el=>el.getClientRects().length&&!el.closest('details:not([open]) > :not(summary)'));
 const first=controls[0],last=controls.at(-1);
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
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
   // Initial route setup precedes guided-discovery; leave its title at the top.
   // Later navigation still uses the journey's ordinary focus/scroll behavior.
   openDirectory(cat,{route:false,scroll:!!window.badilakJourney});
   const requestedSub=new URLSearchParams(location.search).get('sub');
   if((subfilterMap[cat]||[]).some(([id])=>id===requestedSub)){
    subfilter=requestedSub;buildSubfilters();updateDirectoryCrumb();renderCards();
   }
  }
  restoreDiscoveryQuery();
  return;
 }
 if(document.getElementById('detailModal')?.classList.contains('show'))closeModal({route:false});
 if(location.pathname==='/'){
  filter='all';subfilter='all';originFilter=null;countryFilter=null;
  document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
  restoreDiscoveryQuery();
  if(document.body.dataset.journey==='directory'){buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();renderCards();}
 }
}
function restoreDiscoveryQuery(){
 const p=new URLSearchParams(location.search);
 discoveryPath=Object.hasOwn(discoveryPaths,p.get('path'))?p.get('path'):'all';
 discoveryPurpose=['use','learn'].includes(p.get('purpose'))?p.get('purpose'):'all';
 discoveryType=Object.hasOwn(discoveryTypeNames,p.get('type'))?p.get('type'):'all';
 discoveryField=Object.hasOwn(discoveryFieldNames,p.get('field'))?p.get('field'):'all';
 if(discoveryPath!=='all'){filter='all';subfilter='all';}
 if(document.body.dataset.journey==='directory')renderCards();
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
  sourceLabel:'WIPO · GII 2026',
  sourceUrl:'https://www.wipo.int/web-publications/global-innovation-index-2026/en/gii-2026-results.html',
  checked:'15 أكتوبر 2026',
  type:'rank',
  rows:[
   ['ae','الإمارات',25],['sa','السعودية',42],['qa','قطر',47],['ma','المغرب',54],['jo','الأردن',60],['kw','الكويت',62],
   ['bh','البحرين',64],['om','عُمان',69],['tn','تونس',71],['eg','مصر',83]
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
 innovation:{icon:'account_tree',badge:'GII 2026',summary:'كلما كانت منظومة الابتكار أقوى، كانت الدولة أقدر على تحويل المعرفة والاستثمار إلى حلول ومنتجات جديدة.',points:[['01','تعليم وبحث قوي','مواهب ومعرفة تدفع الابتكار'],['02','بيئة أعمال نشطة','تمويل وشركات وفرص لتجربة الأفكار'],['03','مخرجات ملموسة','معرفة وتقنيات ومنتجات إبداعية']]},
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
 return discoveryIndex.filter(e=>discoveryCountryMatches(e,code)).length;
}
function openCountryDirectory(code,country){
 window.badilakJourney?.remember();
 if(!directoryCountryCount(code))return;
 resetDiscoveryFilters();
 countryFilter=code;
 filter='all';subfilter='all';originFilter=null;
 const search=document.getElementById('searchInput');if(search)search.value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
 buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();closeDirectoryRefiners();renderCards();goDirectoryResults();
}
// Homepage: two different datasets with explicitly different meanings.
// Counts use the same combined discovery entries as the destination; observatory values come
// from WIPO GII 2026, never from a homemade cross-metric average.
function renderHomeCountryOverview(){
 const summary=document.getElementById('homeInventorySummary');
 const top=document.getElementById('homeCountryTop3');
 const observer=document.getElementById('homeObserverMini');
 if(!summary||!top||!observer)return;
 const arabCodes=new Set(['eg','sa','ae','jo','bh','qa','ma','om','kw','tn','dz','iq','lb','sy']);
 const totalArab=discoveryIndex.filter(e=>[...arabCodes].some(code=>discoveryCountryMatches(e,code))).length;
 const priority=['eg','sa','ae','jo','bh','qa','ma','om','kw','tn','dz','iq','lb','sy'];
 const topRows=priority.map((code,i)=>({
  code,name:arabProgressCountryNames[code],
  count:directoryCountryCount(code),priority:i
 })).filter(item=>item.count>0).sort((a,b)=>b.count-a.count||a.priority-b.priority).slice(0,6);
 summary.innerHTML=`<span><b>${discoveryIndex.length}</b> بطاقة لأدوات ومصادر تعلّم</span><span><b>${totalArab}</b> منها مرتبطة بدول عربية بحسب بياناتنا</span>`;
 top.innerHTML=topRows.map(({code,name,count})=>`
  <button class="home-country-entry" type="button" onclick="openCountryDirectory('${code}','${name}')" aria-label="اعرض ${count} بطاقة مرتبطة بـ${name} في اكتشف">
   <span class="home-country-identity"><img src="/images/flags/${code}.png" width="28" height="19" alt=""><strong>${name}</strong></span>
   <span class="home-country-count">${count} <small>بطاقة</small></span>
   <span class="home-country-go" aria-hidden="true">↖</span>
  </button>`).join('');
 const ten=[...arabProgressData.innovation.rows].sort((a,b)=>a[2]-b[2]).slice(0,10);
 observer.innerHTML=ten.map(([code,name,rank],i)=>`
  <li class="home-observer-country">
   <span class="home-observer-ordinal" aria-label="الترتيب في الدول المختارة ${i+1}">${i+1}</span>
   <button type="button" class="home-flag-link" onclick="openCountryDirectory('${code}','${name}')" aria-label="اعرض عناصر ${name} في الدليل" title="عناصر ${name} في الدليل"><img src="/images/flags/${code}.png" width="25" height="17" alt=""></button>
   <a href="#competitionIndex" onclick="renderArabProgress('innovation');go('competitionIndex');return false" class="home-observer-country-link" title="افتح مرصد الابتكار"><b>${name}</b><span>${rank} <small>عالميًا</small></span></a>
  </li>`).join('');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderHomeCountryOverview,{once:true});
else renderHomeCountryOverview();

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
  return ''; // ITU tiers are categories, not synthetic percentages.
 }
 if(d.type==='group'){
  return ''; // GTMI groups are categories, not synthetic percentages.
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
function arabProgressCountryControl(code,country,value,visual,first=false,categorical=false){
 const count=directoryCountryCount(code);
 const cls='arab-progress-row'+(first?' is-first':'')+(count?' has-directory':'')+(categorical?' is-categorical':'');
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
  arabProgressCountryControl(code,country,arabMetricValue(d,value),arabMetricVisual(d,value),i===0,d.type==='tier'||d.type==='group')
 ).join('');
 const remaining=d.rows.length-visibleRows.length;
 const add=Math.min(3,remaining);

 const meta=arabProgressMeta[metric]||arabProgressMeta.innovation;
 root.innerHTML=`
  <div class="arab-metric-head">
   <div class="arab-metric-copy">
    <div class="arab-metric-title-wrap"><span class="arab-metric-medallion" aria-hidden="true"><span class="material-symbols-outlined">${meta.icon}</span></span><strong>${d.title}</strong><span class="arab-metric-badge">${meta.badge}</span></div>
    <small class="arab-metric-why">${d.why||''}</small>
   </div>
   <span class="arab-metric-scale">ماذا يقيس؟ · ${d.note}</span>
  </div>
  ${rows}
  ${remaining>0?`<div class="arab-country-more-wrap"><button type="button" class="arab-country-more" onclick="showMoreArabCountries()">+ ${add} دول <small>${remaining} متبقية</small></button></div>`:''}`;

 source.innerHTML=`<span>المصدر:</span><a href="${d.sourceUrl}" target="_blank" rel="noopener noreferrer">${d.sourceLabel} ↗</a><span>· آخر تحقق موثق: ${d.checked||'22 سبتمبر 2026'}</span><span>· اضغط دولة لها عناصر لعرضها في الدليل</span>`;
 const insight=document.getElementById('arabProgressInsight');
 if(insight){
  insight.innerHTML=`
   <div class="arab-insight-head"><span class="arab-insight-emblem" aria-hidden="true"><span class="material-symbols-outlined">${meta.icon}</span></span><h3>لماذا يهم؟</h3></div>
   <p class="arab-insight-summary">${meta.summary}</p>
   <div class="arab-insight-list">${meta.points.map(([n,t,s])=>`<div class="arab-insight-point"><span>${n}</span><div><b>${t}</b><small>${s}</small></div></div>`).join('')}</div>
   <div class="arab-insight-quote">هذا المؤشر لا يحكي القصة كاملة وحده؛ لكنه يوضح نوعًا محددًا من التقدم يمكن مقارنته بين الدول بمصدر واحد.</div>`;
 }
}
// The index renders when its panel is first opened.


// Fixed task positions; refresh only at a qualified return or a spaced page load.
const homeOriginGroups=[
 {slots:[0],ids:['chatgpt','claude','gemini','kimi','deepseek']},
 {slots:[1],ids:['canva','adobeexpress']},
 {slots:[2],ids:['drive']},
 {slots:[3,9],ids:['coursera','udemy','wikipedia','scholar','jstor']},
 {slots:[4],ids:['fiverr','upwork']},
 {slots:[5],ids:['shopify','wix']},
 {slots:[6],ids:['acrobat','smallpdf']},
 {slots:[7],ids:['teams']},
 {slots:[8],ids:['spotify','netflix','kindle','youtube']},
 {slots:[10,11],ids:['amazon','jumia','ebay']}
];
const homeOriginExtras={
 adobeexpress:['www.adobe.com','أدوات التصميم'],wix:['www.wix.com','موقع أو متجر'],smallpdf:['smallpdf.com','مستندات PDF'],upwork:['www.upwork.com','مشاريع ومستقلون'],ebay:['www.ebay.com','بيع وشراء'],
 claude:['claude.ai','خيارات المحادثة'],gemini:['gemini.google.com','خيارات المحادثة'],
 kimi:['www.kimi.com','خيارات المحادثة'],deepseek:['www.deepseek.com','خيارات المحادثة'],
 wikipedia:['www.wikipedia.org','موسوعات ومعرفة'],scholar:['scholar.google.com','بحث ومصادر'],jstor:['www.jstor.org','بحث ومصادر'],
 netflix:['www.netflix.com','أفلام ودراما'],kindle:['www.amazon.com','كتب وقراءة'],youtube:['www.youtube.com','محتوى عربي للأطفال']
};
const homeOriginRefreshMs=30*60*1000;
const homeOriginBrowseMs=2*60*1000;
function homeOriginBaseline(){
 const selected=[];
 for(const group of homeOriginGroups)group.slots.forEach((slot,i)=>selected[slot]=group.ids[i]);
 return selected;
}
function advanceHomeOrigins(state){
 const selected=state.selected.slice();let cursor=state.cursor,changed=0;
 // At most three positions, with a fair round-robin across eligible tasks.
 for(let checked=0;checked<12&&changed<3;checked++){
  const slot=cursor;cursor=(cursor+1)%12;
  const ids=homeOriginGroups.find(g=>g.slots.includes(slot)).ids;
  const start=ids.indexOf(selected[slot]);
  for(let offset=1;offset<ids.length;offset++){
   const candidate=ids[(start+offset)%ids.length];
   if(!selected.includes(candidate)){selected[slot]=candidate;changed++;break;}
  }
 }
 return {...state,selected,cursor};
}
function nextHomeOriginState(saved,now){
 const valid=saved&&saved.version===2&&Array.isArray(saved.selected)&&saved.selected.length===12&&
  new Set(saved.selected).size===12&&Number.isInteger(saved.cursor)&&saved.cursor>=0&&saved.cursor<12&&
  Number.isFinite(saved.updatedAt)&&saved.updatedAt>=0&&saved.updatedAt<=now&&
  saved.selected.every((id,slot)=>homeOriginGroups.find(g=>g.slots.includes(slot)).ids.includes(id));
 if(!valid)return {version:2,selected:homeOriginBaseline(),cursor:0,updatedAt:now};
 if(now-saved.updatedAt<homeOriginRefreshMs)return saved;
 // A long absence still changes only three positions.
 return {...advanceHomeOrigins(saved),updatedAt:now};
}
// Only visible time outside home counts; no timer or persistent browsing history.
function createHomeOriginVisitClock(){
 let view='home',visible=true,started=null,elapsed=0;
 return function visit(next,isVisible,now){
  if(started!==null)elapsed+=Math.max(0,now-started);
  const returning=view!=='home'&&next==='home';
  const refresh=returning&&elapsed>=homeOriginBrowseMs;
  if(refresh)elapsed=0;
  view=next;visible=isVisible;
  started=view!=='home'&&visible?now:null;
  return refresh;
 };
}
(()=>{
 const root=document.querySelector('.origin-options');if(!root)return;
 const templates=new Map([...root.querySelectorAll('[data-origin]')].map(button=>[button.dataset.origin,button.cloneNode(true)]));
 for(const [id,[domain,intent]] of Object.entries(homeOriginExtras)){
  const button=templates.get('chatgpt').cloneNode(true);
  button.dataset.origin=id;button.querySelector('.origin-name').textContent=originName(id);
  button.querySelector('.origin-intent').textContent=intent;
  button.querySelector('img').src='https://www.google.com/s2/favicons?sz=64&domain_url=https://'+domain;
  templates.set(id,button);
 }
 let state=nextHomeOriginState(null,Date.now());
 try{
  state=nextHomeOriginState(JSON.parse(localStorage.getItem('badilak_home_origins_v2')),Date.now());
  localStorage.setItem('badilak_home_origins_v2',JSON.stringify(state));
  sessionStorage.removeItem('badilak_home_origins_v1');localStorage.removeItem('badilak_home_origins_last_v1');
 }catch{} // Blocked/malformed storage: a stable, usable baseline.
 function render(){
  const buttons=state.selected.map(id=>{
   const button=templates.get(id).cloneNode(true);
   button.setAttribute('onclick','chooseOrigin(this.dataset.origin,this)');
   button.setAttribute('aria-pressed',originFilter===id?'true':'false');
   return button;
  });
  root.replaceChildren(...buttons);
 }
 const visit=createHomeOriginVisitClock();
 let currentView='home';
 function navigate(view){
  currentView=view;
  if(!visit(view,!document.hidden,performance.now()))return;
  state={...advanceHomeOrigins(state),updatedAt:Date.now()};
  try{localStorage.setItem('badilak_home_origins_v2',JSON.stringify(state));}catch{}
  render();
 }
 window.badilakHomeOrigins={navigate};
 document.addEventListener('visibilitychange',()=>visit(currentView,!document.hidden,performance.now()));
 render();
})();
