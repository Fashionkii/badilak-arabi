/* Presentation index only. The two source collections remain authoritative.
   Reviewed pairs share a destination; a shared domain alone is never a merge rule. */
const discoveryPairs={
 'edraak-learning':'edraak','hsoub-library':'hsoub','alef-learning':'alef',
 'kezakoo-learning':'kezakoo','telmidtice-learning':'telmidtice','bibf-learning':'bibf',
 'edlal-learning':'edlal','tadarab-learning':'tadarab','gomycode-learning':'gomycode'
};
const discoveryRelations={salla:['salla-academy'],qoyod:['qoyod-academy'],daftra:['daftra-hub'],khamsat:['khamsat-blog'],hsoub:['hsoub-youtube'],thmanyah:['thmanyah-youtube'],qdl:['qdl-youtube']};
const discoveryFieldCategories={languages:['learn'],tech:['learn','tech'],design:['learn','create'],business:['learn','work'],skills:['learn'],knowledge:['learn'],quran:['learn']};
const discoveryFieldNames={languages:'إنجليزي ولغات',tech:'برمجة وتقنية',design:'تصميم ومونتاج',business:'إدارة وتسويق',skills:'مهارات متنوعة',knowledge:'معرفة وعلوم',quran:'قرآن وتلاوة'};
const discoveryTypeNames={platform:'منصة كورسات',resource:'دروس ومقالات عملية',channel:'قناة تعليمية',reciter:'قناة تلاوة'};
const discoveryEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function buildDiscoveryIndex(){
 const map=new Map(items.map(x=>[x.id,{id:x.id,directory:x,learning:null,categories:[x.cat],use:!(x.cat==='learn'&&x.sub==='courses'),learn:x.cat==='learn'&&x.sub==='courses'}]));
 for(const x of learning){
  const id=discoveryPairs[x.id]||x.id;
  if(discoveryPairs[x.id]&&!map.has(id))throw new Error('Missing paired resource: '+id);
  let e=map.get(id);
  if(!e){e={id,directory:null,learning:null,categories:[],use:false,learn:true};map.set(id,e);}
  e.learning=x;e.learn=true;
  e.categories=[...new Set([...e.categories,...x.fields.flatMap(f=>discoveryFieldCategories[f]||['learn'])])];
 }
 const directory=[...map.values()].filter(e=>e.directory),extra=[...map.values()].filter(e=>!e.directory),balanced=[];
 // Mix formats in broad discovery without describing this order as a quality rank.
 while(directory.length||extra.length){balanced.push(...directory.splice(0,2),...extra.splice(0,1));}
 return balanced;
}
const discoveryIndex=buildDiscoveryIndex();
let discoveryPurpose='all',discoveryType='all',discoveryField='all';
function discoveryMatchesContext(e){
 if(filter!=='all'&&!e.categories.includes(filter))return false;
 if(subfilter!=='all'&&e.directory?.sub!==subfilter&&!(filter==='learn'&&subfilter==='courses'&&e.learning?.type==='platform'))return false;
 if(originFilter&&(!e.directory||!matchesDirectoryOrigin(e.directory,originFilter)))return false;
 if(countryFilter&&!((e.directory&&countryInfoHasCode(itemCountryMap[e.directory.id],countryFilter))||(e.learning&&countryInfoHasCode(learningCountryMap[e.learning.id],countryFilter))))return false;
 if(discoveryPurpose==='use'&&!e.use||discoveryPurpose==='learn'&&!e.learn)return false;
 if(discoveryType!=='all'&&e.learning?.type!==discoveryType)return false;
 return discoveryField==='all'||e.learning?.fields.includes(discoveryField);
}
function learningSearchScore(x,query){
 const q=normalizeDirectorySearch(query);if(!q)return 1;
 const name=normalizeDirectorySearch(x.name),text=normalizeDirectorySearch([x.name,x.focus,x.teacher,discoveryTypeNames[x.type],...x.fields.map(f=>discoveryFieldNames[f]),...countryEntries(learningCountryMap[x.id]).map(c=>c[1])].join(' '));
 const words=text.split(' ');
 if(!q.split(' ').every(word=>name.includes(word)||words.some(candidate=>candidate.startsWith(word))))return 0;
 return name===q?100:name.includes(q)?80:text.includes(q)?40:20;
}
function searchDiscoveryEntries(list,query){
 if(!normalizeDirectorySearch(query))return list;
 return list.map((entry,index)=>({entry,index,score:Math.max(entry.directory?directorySearchScore(entry.directory,query):0,entry.learning?learningSearchScore(entry.learning,query):0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.entry);
}
function resetDiscoveryFilters(){discoveryPurpose='all';discoveryType='all';discoveryField='all';}
function syncDiscoveryControls(){
 if(window.badilakJourney?.view==='directory')document.querySelectorAll('.navigation > a[href="#directory"],.navigation > a[href="#learning"]').forEach(a=>{
  const current=a.hash===(discoveryPurpose==='learn'?'#learning':'#directory');
  if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 });
 document.querySelectorAll('[data-discovery-purpose]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.discoveryPurpose===discoveryPurpose)));
 document.getElementById('discoveryType').value=discoveryType;
 document.getElementById('discoveryField').value=discoveryField;
 document.getElementById('learningRefinements').hidden=discoveryPurpose!=='learn';
}
function setDiscoveryFilter(key,value){
 const allowed={purpose:['all','use','learn'],type:['all',...Object.keys(discoveryTypeNames)],field:['all',...Object.keys(discoveryFieldNames)]};
 if(!allowed[key]?.includes(value))return;
 window.badilakJourney?.remember();
 if(key==='purpose'){discoveryPurpose=value;if(value!=='learn'){discoveryType='all';discoveryField='all';}}
 if(key==='type')discoveryType=value;
 if(key==='field')discoveryField=value;
 resetDirectoryLimit();renderCards();rememberDirectorySelection();
}
function enterUnifiedLearning(){
 filter='all';subfilter='all';originFilter=null;countryFilter=null;
 discoveryPurpose='learn';discoveryType=learningType;discoveryField=document.getElementById('learningField').value||'all';
 document.getElementById('searchInput').value=document.getElementById('learningSearch').value;
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 buildSubfilters();resetDirectoryLimit();updateDirectoryCrumb();updateDirectoryActionLabel();renderCards();
}
function learningEntryLink(x,standalone=false){
 return `<a class="more-btn" href="/?learn=${x.id}#learning"${standalone?'':` onclick="event.preventDefault();showLearningNote('${x.id}')"`}>${discoveryEscape(x.name)} — المحتوى وخطوة التطبيق</a>`;
}
function contextualLearningMarkup(id,standalone=false){
 const paired=learning.filter(x=>discoveryPairs[x.id]===id),related=(discoveryRelations[id]||[]).map(key=>learning.find(x=>x.id===key)).filter(Boolean);
 if(!paired.length&&!related.length)return '';
 return `<section class="discovery-related"><h2>${paired.length?'تعلّم وطبّق':'تعلّم ما يساعدك على الاستخدام'}</h2><div class="discovery-related-links">${[...paired,...related].map(x=>learningEntryLink(x,standalone)).join('')}</div></section>`;
}
function discoveryCardMarkup(e){
 if(e.directory){
  const card=directoryCardMarkup(e.directory,originFilter),label=e.learning?discoveryTypeNames[e.learning.type]:e.directory.type;
  return card.replace('<div class="card-summary">',`<span class="discovery-kind">${discoveryEscape(label)}</span><div class="card-summary">`);
 }
 const x=e.learning,summary=learningDisplaySummaries[x.id]||x.focus;
 return `<article class="item discovery-learning-card" data-learning-id="${x.id}">
  <button type="button" class="item-identity" aria-haspopup="dialog" aria-controls="detailModal" onclick="showLearningNote('${x.id}')">${logoMarkup(x.logo,'item-logo',x.name)}<span class="item-name">${discoveryEscape(x.name)}</span></button>
  ${countryBadgeMarkup(x,learningCountryMap)}<span class="discovery-kind">${discoveryTypeNames[x.type]}</span>
  <div class="card-summary"><p class="card-purpose">${discoveryEscape(summary)}</p></div>
  <div class="card-primary-actions"><div class="card-info-actions ${learningGuideMap[x.id]?'':'is-single'}"><button class="more-btn" type="button" aria-haspopup="dialog" aria-controls="detailModal" onclick="showLearningNote('${x.id}')">معلومات وخطوة تطبيق</button>${learningGuideLinkMarkup(x.id)}</div>
  <button type="button" class="destination-link" onclick="openLearningExternal('${x.id}')"><span class="destination-label"><bdi>${x.type==='reciter'?'افتح قناة التلاوة':x.type==='channel'?'افتح القناة':'افتح المصدر'}</bdi><small>${discoveryEscape(new URL(x.url).hostname)}</small></span><span class="outbound-key">↗</span></button></div></article>`;
}
