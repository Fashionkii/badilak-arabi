'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(f,'utf8'),c=vm.createContext({window:{},URL,Intl,Date});
for(const f of ['js/catalog-data.js','js/detail-renderers.js','js/directory-search.js','js/discovery-paths.js','js/discovery-index.js','js/news-data.js','dist/js/editorial-index.js','js/editorial-ui.js'])vm.runInContext(read(f),c);
vm.runInContext("let filter='all',subfilter='all',originFilter=null,countryFilter=null;function countryInfoHasCode(info,code){return countryEntries(info).some(v=>v&&v[0]===code);}",c);
const get=code=>JSON.parse(vm.runInContext('JSON.stringify('+code+')',c));
for(const [id,p] of Object.entries(get('discoveryPaths'))){
 for(const item of p.items)assert(get(`items.some(x=>x.id===${JSON.stringify(item)})`),id+' missing directory resource');
 for(const item of p.learning)assert(get(`learning.some(x=>x.id===${JSON.stringify(item)})`),id+' missing learning resource');
 for(const guide of p.guides)assert(fs.existsSync('guides/'+guide+'.html'),id+' missing article');
}
vm.runInContext("discoveryPath='store'",c);
assert.deepEqual(get('discoveryIndex.filter(discoveryMatchesContext).map(e=>e.id)').sort(),['salla','zid','wuilt','expandcart','salla-academy'].sort());
vm.runInContext("discoveryPath='quran'",c);assert.equal(get('discoveryIndex.filter(discoveryMatchesContext).length'),6);
assert(get("discoveryIndex.filter(discoveryMatchesContext).every(e=>e.learning.type==='reciter')"));
vm.runInContext("resetDiscoveryFilters();discoveryPurpose='learn';discoveryType='platform'",c);assert.equal(get('discoveryIndex.filter(discoveryMatchesContext).length'),16);
vm.runInContext("resetDiscoveryFilters();filter='work';subfilter='commerce'",c);assert(get("discoveryIndex.filter(discoveryMatchesContext).some(e=>e.id==='salla-academy')"));
vm.runInContext("resetDiscoveryFilters();filter='all';subfilter='all';countryFilter='eg'",c);
assert.equal(get('discoveryIndex.filter(discoveryMatchesContext).length'),get("discoveryIndex.filter(e=>discoveryCountryMatches(e,'eg')).length"));
assert.equal(get('discoveryIndex.filter(discoveryMatchesContext).length'),29);
const app=read('js/app.js');vm.runInContext(app.slice(app.indexOf('const discoveryCategoryOrder='),app.indexOf('function beginDirectoryDiscoveryVisit')),c);
assert.deepEqual(get("orderDirectoryDiscoveryCards(discoveryIndex,'').map(e=>e.id)"),get("orderDirectoryDiscoveryCards(discoveryIndex.slice().reverse(),'').map(e=>e.id)"),'Stable independent of incoming order');
vm.runInContext(app.slice(app.indexOf('function visibleDiscoveryGroups'),app.indexOf('function resetDirectoryLimit')),c);
assert.deepEqual(get("visibleDiscoveryGroups(['work','learn','tech','create','culture','shopping'].map(id=>({id,entries:discoveryIndex.filter(e=>discoveryPrimaryCategory(e)===id)})),18).map(g=>g.shown.length)"),[3,3,3,3,3,3],'Three visible entries per broad category');
vm.runInContext(app.match(/const learningDisplaySummaries=\{[\s\S]*?\n\};/)[0]+"function learningGuideLinkMarkup(id,detail=false){return guideLinkMarkup(learningGuideMap[id],detail)}",c);
vm.runInContext("resetDiscoveryFilters();discoveryPurpose='learn'",c);
const edraak=vm.runInContext("discoveryCardMarkup(discoveryIndex.find(e=>e.id==='edraak'))",c);
assert.match(edraak,/onclick="showLearningNote\('edraak-learning'\)"/);assert(!edraak.includes("onclick=\"openDetail('edraak')"));
const rows=get('badilakEditorial.rows');assert.equal(rows.length,27);assert.equal(rows.filter(r=>r.type==='article').length,21);
for(const row of rows){for(const id of row.resources)assert(get(`discoveryIndex.some(e=>e.id===${JSON.stringify(id)}||e.learning?.id===${JSON.stringify(id)})`),'Orphan editorial relation: '+id);}
for(const file of fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html')&&f!=='404.html')){
 const html=read('dist/'+file);
 const nav=html.match(/<nav class="(?:navigation|toplinks)"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
 if(!nav)continue;
 const primary=nav.split('<details')[0];
 const labels=[...primary.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m=>m[1]);
 assert.deepEqual(labels,['الرئيسية','اكتشف','اقرأ','المرصد'],file+' primary navigation');
 if(file.startsWith('guides')||file.startsWith('news'))assert.match(primary,/<a href="\/guides" aria-current="page">اقرأ<\/a>/,file+' active reading');
}
const home=read('dist/index.html').split('id="directory"')[0];
assert.equal((home.match(/class="editorial-card(?: editorial-card--feature)?"/g)||[]).length,3);
assert.match(home,/data-editorial-type="news"[\s\S]*?<img class="editorial-cover"/);assert.match(home,/data-editorial-type="article"/);
for(const id of get('badilakEditorial.home'))assert(home.includes(rows.find(r=>r.id===id).url));
for(const id of ['midaad','taqreer','aamenn']){const date=get(`items.find(x=>x.id==='${id}').reviewed`);assert(read('dist/index.html').includes(`data-review-resource="${id}">آخر مراجعة للمورد: ${date}`));}
for(const row of rows.filter(r=>r.type==='news')){const html=read('dist'+row.url+'.html');assert(html.includes(`datetime="${row.eventDate}"`));assert(html.includes(`datetime="${row.published}"`));assert(html.includes('href="/guides?type=news"'));assert(html.includes('class="news-cover"'));assert(row.image&&row.imageAlt);}
console.log('PASS: one navigation across published pages; 21 articles + 6 news; 3 home previews; store and recitation journeys; direct paired learning; platform and country counts; stable order; source-derived review dates.');
