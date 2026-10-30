'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const base='79d225842d6e802cadfff563bca704182232bd69';
const read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',base+':'+f],{encoding:'utf8'});
const load=reader=>{const c=vm.createContext({window:{},URL});for(const f of ['js/catalog-data.js','js/detail-renderers.js','js/directory-search.js'])vm.runInContext(reader(f),c);return c;};
const before=load(old),now=load(read),get=(code,c=now)=>JSON.parse(vm.runInContext('JSON.stringify('+code+')',c));
for(const f of ['js/discovery-paths.js','js/discovery-index.js','js/news-data.js'])vm.runInContext(read(f),now);
vm.runInContext("let filter='all',subfilter='all',originFilter=null,countryFilter=null;function countryInfoHasCode(info,code){return countryEntries(info).some(v=>v&&v[0]===code);}",now);
const existing=get('items',before),current=get('items');assert.equal(current.length,98);assert.equal(get('learning').length,36);assert.equal(get('discoveryIndex').length,125);
for(const item of existing){const next=current.find(x=>x.id===item.id);if(item.id==='falcon'){assert.equal(next.modules.length,item.modules.length+1);next.modules=next.modules.slice(0,-1);}assert.deepEqual(next,item,item.id+' original source record');}
assert.deepEqual(get('learning'),get('learning',before));
for(const key of ['practicalTrials','trialDecisionComplements'])assert.deepEqual(get(key),get(key,before));
assert.equal(get('items.filter(hasPracticalTrial).length'),52);
const actions=s=>s.match(/const learningActions\s*=\s*({[\s\S]*?\n});/)[1];assert.equal(actions(read('js/app.js')),actions(old('js/app.js')));
assert.equal(get('Object.keys(discoveryPairs).length'),9);
for(const [learningId,id] of Object.entries(get('discoveryPairs'))){assert.equal(get(`discoveryIndex.filter(e=>e.id===${JSON.stringify(id)}).length`),1);assert.equal(get(`discoveryIndex.find(e=>e.id===${JSON.stringify(id)}).learning.id`),learningId);}
for(const entry of [...current,...get('learning')]){const expected=get(`discoveryPairs[${JSON.stringify(entry.id)}]||${JSON.stringify(entry.id)}`);assert(get(`searchDiscoveryEntries(discoveryIndex,${JSON.stringify(entry.name)}).some(e=>e.id===${JSON.stringify(expected)})`),'Search preserves '+entry.id);}
vm.runInContext("discoveryPurpose='learn'",now);assert.equal(get('discoveryIndex.filter(discoveryMatchesContext).length'),36);
const typeMarkup=read('index.html').match(/<select\b[^>]*\bid="discoveryType"[^>]*>([\s\S]*?)<\/select>/)?.[1]||'';
const optionValues=Array.from(typeMarkup.matchAll(/<option\b[^>]*\bvalue="([^"]+)"[^>]*>/g),m=>m[1]);
assert.deepEqual(optionValues,['all','platform','resource','channel','reciter'],'Every learning format must be selectable in the interface');
vm.runInContext("discoveryType='platform'",now);
assert(get('discoveryIndex.filter(discoveryMatchesContext).length')>0,'Learning platforms remain discoverable');
assert(get("discoveryIndex.filter(discoveryMatchesContext).every(e=>e.learning.type==='platform')"));
vm.runInContext("discoveryType='reciter'",now);assert.equal(get('discoveryIndex.filter(discoveryMatchesContext).length'),6);assert(get("discoveryIndex.filter(discoveryMatchesContext).every(e=>e.learning.fields.includes('quran')&&!e.categories.includes('culture'))"));
vm.runInContext("resetDiscoveryFilters();filter='work'",now);assert(get("discoveryIndex.filter(discoveryMatchesContext).some(e=>e.id==='manasatna')"));vm.runInContext("discoveryPurpose='learn'",now);assert(!get("discoveryIndex.filter(discoveryMatchesContext).some(e=>e.id==='manasatna')"));
vm.runInContext("resetDiscoveryFilters();filter='all'",now);
for(const origin of ['canva','chatgpt','youtube','coursera','shopify']){vm.runInContext('originFilter='+JSON.stringify(origin),now);assert.deepEqual(get('discoveryIndex.filter(discoveryMatchesContext).map(e=>e.id)').sort(),get('items.filter(x=>matchesDirectoryOrigin(x,'+JSON.stringify(origin)+')).map(x=>x.id)').sort());}
// Only the reviewed icon transport changed: normalize those exact SVGs back to the
// previous ligature markup, keeping all surrounding card copy, links and actions exact.
const currentSymbols=get('localMaterialSymbols');
function previousIconMarkup(html){
 for(const name of Object.keys(currentSymbols)){
  const svg=now.materialSymbolMarkup(name);
  if(name==='language')html=html.replaceAll('country-badge-neutral">'+svg,'country-badge-neutral"><span class="material-symbols-outlined country-neutral-icon" aria-hidden="true">language</span>');
  html=html.replaceAll(svg,`<span class="material-symbols-outlined">${name}</span>`);
 }
 return html;
}
for(const x of existing){assert.equal(now.practicalTrialMarkup(x),before.practicalTrialMarkup(x));assert.equal(now.directoryDiscoveryMarkup(x),before.directoryDiscoveryMarkup(x));assert.equal(previousIconMarkup(now.directoryCardMarkup(x)),before.directoryCardMarkup(x));}
for(const f of execFileSync('git',['ls-tree','-r','--name-only',base],{encoding:'utf8'}).split('\n').filter(f=>/^(api\/|private\/|studio\/|images\/brand\/|css\/(cosmic-theme|site-polish|reading-hierarchy)|js\/(commercial-links|outbound-choice|feedback|smart-return)|site.config.json|vercel.json|guides\/)/.test(f))){assert.equal(f==='js/smart-return.js'?read(f).replace("x.pathname==='/guides'||x.pathname==='/news'||/^\\/(guides|news)\\/[^/]+$/.test(x.pathname)","x.pathname==='/guides'||/^\\/guides\\/[^/]+$/.test(x.pathname)"):read(f),old(f),f+' protected');}
const beforeHtml=old('index.html'),afterHtml=read('index.html');const ads=s=>[...s.matchAll(/<section class="(?:commercial-demo-wrap|ad-demo-wrap)[\s\S]*?<\/section>/g)].map(x=>x[0].replace(/ data-journey-panel="[^"]*"/g,''));assert.deepEqual(ads(afterHtml),ads(beforeHtml));
for(const n of get('badilakNews')){assert(n.eventDate<n.published);if(n.related)assert(current.some(x=>x.id===n.related));const html=read('dist/news/'+n.id+'.html');assert(html.includes('ما الذي لم نتحقق منه؟'));if(n.related)assert(html.includes('/discover/'+n.related));assert(html.includes('class="news-cover"'));
assert(!html.includes('تطبيق المحاكاة'));}
assert.equal((read('guides/create-online-academy.html').match(/<h1>/g)||[]).length,1);
console.log('PASS: 134 original records → 125 display entries; 9 pairs; all 36 learning records/actions, 6 reciters, 52 trials, name/origin search, 3 reserved ads, 20 old guides and protected identity/settings preserved.');

const internalLine=read('js/smart-return.js').split('\n').find(x=>x.includes('const isInternal='));
const nav=vm.createContext({URL,location:{href:'https://badilak-arabi.vercel.app/#directory',origin:'https://badilak-arabi.vercel.app'}});
vm.runInContext(internalLine,nav);
for(const url of ['/news','/news/jais-3-release','/guides','/guides/create-online-academy','/'])assert(vm.runInContext('isInternal('+JSON.stringify(url)+')',nav));
assert(!vm.runInContext("isInternal('https://example.org/news')",nav));
console.log('PASS: news detours use the existing same-origin navigation memory.');
