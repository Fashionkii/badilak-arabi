'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(f,'utf8'),c=vm.createContext({window:{},URL,Intl,Date});
for(const f of ['js/catalog-data.js','js/detail-renderers.js','js/directory-search.js','js/discovery-paths.js','js/discovery-index.js'])vm.runInContext(read(f),c);
const app=read('js/app.js');
vm.runInContext("let filter='all',subfilter='all',originFilter=null,countryFilter=null;"+app.slice(app.indexOf('const discoveryCategoryOrder='),app.indexOf('function beginDirectoryDiscoveryVisit')),c);
const get=s=>JSON.parse(vm.runInContext('JSON.stringify('+s+')',c));
const preview=get('discoveryPreviewIds'),entries=get('discoveryIndex'),symbols=get('localMaterialSymbols');
for(const [category,ids]of Object.entries(preview)){
 assert.equal(ids.length,3);assert.equal(new Set(ids).size,3);
 for(const id of ids){const entry=entries.find(e=>e.id===id);assert(entry,'Missing preview '+id);assert.equal(get(`discoveryPrimaryCategory(discoveryIndex.find(e=>e.id==='${id}'))`),category,'Preview matches existing category');}
 assert.deepEqual(get(`orderDirectoryDiscoveryCards(discoveryIndex,'').filter(e=>discoveryPrimaryCategory(e)==='${category}').slice(0,3).map(e=>e.id)`),ids);
}
vm.runInContext("filter='work'",c);
assert.deepEqual(get("orderDirectoryDiscoveryCards(discoveryIndex.filter(e=>e.categories.includes('work')),'').map(e=>e.id)"),get("discoveryIndex.filter(e=>e.categories.includes('work')).sort((a,b)=>(a.directory?.name||a.learning.name).localeCompare(b.directory?.name||b.learning.name,'ar')||a.id.localeCompare(b.id)).map(e=>e.id)"),'Category view stays alphabetical');
assert.deepEqual(get("orderDirectoryDiscoveryCards(searchDiscoveryEntries(discoveryIndex,'دفترة'),'دفترة').map(e=>e.id)"),get("searchDiscoveryEntries(discoveryIndex,'دفترة').map(e=>e.id)"),'Search relevance precedes preview');
const all=get('[...items,...learning]');
for(const row of all.filter(x=>x.logo?.startsWith('material:'))){
 const name=row.logo.slice(9);assert(symbols[name],row.id+' has local artwork');
 const html=c.logoMarkup(row.logo,'item-logo',row.name);assert(html.includes('<svg '));assert(!html.includes('material-symbols-outlined'));assert(!html.includes('http')||html.includes('http://www.w3.org/2000/svg'));
 assert(!html.includes('>'+name+'<'),'No visible ligature name');
}
const unknown=c.logoMarkup('material:future_unknown','item-logo','خدمة اختبار');
assert(unknown.includes('logo-fallback'));assert(!unknown.includes('future_unknown'));
for(const id of ['jais-3','zenhr'])assert(read('dist/discover/'+id+'.html').includes('local-material-symbol'),'Static detail symbol '+id);
const home=read('dist/index.html').split('id="directory"')[0];
assert.equal((home.match(/class="editorial-cover"/g)||[]).length,3);
assert(!home.includes('editorial-card--feature'));
assert(read('index.html').includes('<details class="discovery-refinements"'));
assert.equal((read('index.html').match(/id="discoveryType"/g)||[]).length,1);
assert.equal((read('index.html').match(/id="discoveryField"/g)||[]).length,1);
vm.runInContext(app.match(/function cardCountNoun\(count\)\{[^\n]+/)[0],c);
for(const n of [3,4,8,10])assert.equal(c.cardCountNoun(n),'بطاقات');
for(const n of [11,29,125])assert.equal(c.cardCountNoun(n),'بطاقة');
console.log('PASS: 18 curated examples remain in their original categories; search/category behavior preserved; local SVGs cover every catalog symbol and unknown fallback; three home images; intact refinements; Arabic plurals.');
