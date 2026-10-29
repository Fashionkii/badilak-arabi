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
  e.learningContexts=(typeof learningDiscoveryContexts!=='undefined'&&learningDiscoveryContexts[x.id])||[['learn',x.type==='reciter'?'islamic':'courses']];
  e.categories=[...new Set([...e.categories,...e.learningContexts.map(([cat])=>cat)])];
 }
 return [...map.values()];
}
const discoveryIndex=buildDiscoveryIndex();
let discoveryPurpose='all',discoveryType='all',discoveryField='all',discoveryPath='all';
function discoveryCountryMatches(e,code){return !!((e.directory&&countryInfoHasCode(itemCountryMap[e.directory.id],code))||(e.learning&&countryInfoHasCode(learningCountryMap[e.learning.id],code)));}
function discoveryMatchesContext(e){
 const path=typeof discoveryPaths!=='undefined'?discoveryPaths[discoveryPath]:null;
 if(path&&!path.items.includes(e.id)&&!path.learning.includes(e.learning?.id))return false;
 if(filter!=='all'&&!e.categories.includes(filter))return false;
 if(subfilter!=='all'&&e.directory?.sub!==subfilter&&!e.learningContexts?.some(([cat,sub])=>cat===filter&&sub===subfilter))return false;
 if(originFilter&&(!e.directory||!matchesDirectoryOrigin(e.directory,originFilter)))return false;
 if(countryFilter&&!discoveryCountryMatches(e,countryFilter))return false;
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
function resetDiscoveryFilters(){discoveryPurpose='all';discoveryType='all';discoveryField='all';discoveryPath='all';}
function syncDiscoveryControls(){
 if(window.badilakJourney?.view==='directory')document.querySelector('.navigation > a[href="#directory"]')?.setAttribute('aria-current','page');
 document.querySelectorAll('[data-discovery-purpose]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.discoveryPurpose===discoveryPurpose)));
 document.getElementById('discoveryType').value=discoveryType;
 document.getElementById('discoveryField').value=discoveryField;
 document.getElementById('learningRefinements').hidden=discoveryPurpose!=='learn';
 const path=discoveryPaths[discoveryPath],select=document.getElementById('discoveryPath'),description=document.getElementById('discoveryPathDescription');
 if(select)select.value=discoveryPath;
 if(description){description.hidden=!path;description.textContent=path?.description||'';}
}
function openDiscoveryPath(id,options={}){
 if(id!=='all'&&!Object.hasOwn(discoveryPaths,id))return;
 window.badilakJourney?.remember();
 resetDiscoveryFilters();discoveryPath=id;filter='all';subfilter='all';originFilter=null;countryFilter=null;
 document.getElementById('searchInput').value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 buildSubfilters();resetDirectoryLimit();updateDirectoryCrumb();updateDirectoryActionLabel();renderCards();
 if(options.navigate!==false){rememberDirectorySelection();goDirectoryResults();}
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
 discoveryPath='all';
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
 const x=e.directory,l=e.learning,learn=!!l&&(discoveryPurpose==='learn'||!e.use),source=learn?l:x||l;
 const name=source.name,logo=source.logo;
 const action=learn||!x?`showLearningNote('${l.id}')`:`openDetail('${x.id}')`;
 const href=learn||!x?`/?learn=${l.id}#learning`:`/discover/${x.id}`;
 const click=learn||!x?`return openDiscoveryLearning(event,'${l.id}')`:`return badilakOpenItem(event,'${x.id}')`;
 const summary=learn||!x?(learningDisplaySummaries[l.id]||l.focus):compactCardPurpose(x);
 const comparison=x?directoryComparison(x,originFilter):{};
 const context=(learn||!x)?(l.type==='resource'?'محتوى تعليمي من الجهة نفسها':l.type==='reciter'?'القناة الرسمية للقارئ':'تعلّم خطوة، ثم طبّقها'):comparison.reference?`إذا كنت تستخدم <bdi>${originName(comparison.reference)}</bdi>`:'';
 const guide=learn||!x?learningGuideLinkMarkup(l.id):editorialGuideLinkMarkup(x.id);
 const info=learn||!x?'معلومات وخطوة تطبيق':hasPracticalTrial(x)?'معلومات وتجربة':'معلومات';
 const destination=learn||!x?`openLearningExternal('${l.id}')`:`openExternal('${x.id}')`;
 const domain=learn||!x?new URL(l.url).hostname:x.domain;
 return `<article class="item unified-resource-card" data-item-id="${e.id}"${l?` data-learning-id="${l.id}"`:''}>
 <div class="resource-head"><a class="item-identity" href="${href}" onclick="${click}">${logoMarkup(logo,'item-logo',name)}<span class="item-name">${discoveryEscape(name)}</span></a>
 <div class="resource-meta">${countryBadgeMarkup(source,learn||!x?learningCountryMap:itemCountryMap)}<span class="discovery-kind">${discoveryEscape(l?discoveryTypeNames[l.type]:x.type)}</span></div></div>
 <div class="resource-context">${context?`<p>${context}</p>`:''}${comparison.fit&&!learn?`<p class="card-fit">${comparison.fit}</p>`:''}</div>
 <div class="card-summary"><p class="card-purpose">${discoveryEscape(summary)}</p></div>
 <div class="card-primary-actions"><div class="card-info-actions${guide?'':' is-single'}"><button class="more-btn" type="button" aria-haspopup="dialog" aria-controls="detailModal" onclick="${action}" aria-label="${info} عن ${discoveryEscape(name)}">${info}</button>${guide?`<div class="card-guide-slot">${guide}</div>`:''}</div>
 <button type="button" class="destination-link" aria-haspopup="dialog" aria-controls="outboundDialog" onclick="${destination}"><span class="destination-label"><bdi>${learn||!x?l.type==='reciter'?'افتح قناة التلاوة':'افتح المصدر':discoveryEscape(name)}</bdi><small>${discoveryEscape(domain)}</small></span><span class="outbound-key">↗</span></button></div></article>`;
}
function openDiscoveryLearning(event,id){if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return true;event.preventDefault();showLearningNote(id);return false;}
