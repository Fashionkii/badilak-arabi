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
const rows=get('badilakEditorial.rows');assert.equal(rows.length,31);assert.equal(rows.filter(r=>r.type==='article').length,22);
const newsRows=rows.filter(r=>r.type==='news');
assert.equal(newsRows.length,9);
assert.equal(new Set(rows.map(row=>row.image)).size,rows.length,'Each editorial topic has a distinct thumbnail URL');
for(const n of get('badilakNews').filter(n=>n.related)){
 const label=n.eventKind||'الحدث';
 const expected=`${label}: ${n.eventLabel}${get(`conciseResource(${JSON.stringify(n.related)})`)?'':` · مراجعة المصدر: ${n.reviewLabel}`}`;
 const dynamic=vm.runInContext(`relatedNewsMarkup(${JSON.stringify(n.related)})`,c);
 const detail=read('dist/discover/'+n.related+'.html');
 for(const [surface,html] of [['dynamic',dynamic],['static',detail]])assert(html.includes(expected),`${surface} resource detail keeps the date meaning for ${n.id}`);
}
assert.deepEqual(newsRows.map(r=>r.eventDate),newsRows.map(r=>r.eventDate).sort().reverse(),'News ordered by event/source-update date');
for(const row of newsRows){
 const html=read('dist'+row.url+'.html');
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema['@type'],'NewsArticle');assert(schema.image[0].endsWith('-cover.webp'));
 const coverUrl=row.image.replace(/-thumb\.webp$/,'-cover.webp');
 assert.equal(new URL(schema.image[0]).pathname,coverUrl);
 assert(html.includes(`class="news-cover"><img src="${coverUrl}"`));
 assert(fs.existsSync('dist'+row.image),'Missing thumbnail: '+row.image);
 assert(html.indexOf('class="news-date"')<html.indexOf('class="news-cover"'),'Dates visible before cover');
 if(row.eventKind==='تحديث التوثيق')assert(html.includes('تحديث التوثيق:'));
 for(const id of row.paths)assert(get(`Boolean(discoveryPaths[${JSON.stringify(id)}])`),'Unknown news path');
}
c.document={getElementById:()=>({value:''})};
vm.runInContext("filter='all';countryFilter=null;originFilter=null;discoveryPath='languages'",c);
const languageContext=vm.runInContext('discoveryEditorialMarkup([])',c);
assert(languageContext.includes('/news/loghat-pilot'));assert(languageContext.includes('class="editorial-cover"'));
const relatedArticles=[...languageContext.matchAll(/<article[^>]*data-editorial-type="article"[^>]*>[\s\S]*?<\/article>/g)];
assert(relatedArticles.length,'Language path should include a related article');
for(const [card] of relatedArticles){
 const row=rows.find(entry=>card.includes(`href="${entry.url}"`));
 assert(row&&card.includes(`class="editorial-cover" src="${row.image}"`),'Related articles use their existing thumbnails');
}
vm.runInContext("discoveryPath='reading'",c);assert(vm.runInContext('discoveryEditorialMarkup([])',c).includes('/news/thmanyah-radio-guide'));

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
{const ids=get('badilakEditorial.home'),section=home.slice(home.indexOf('class="home-editorial"'));
assert.equal(ids.length,3,'Three homepage reading cards');assert(!/class="home-editorial"[\s\S]*?class="editorial-date"[\s\S]*?<\/section>/.test(section.split('</section>')[0]+'</section>'),'Homepage reading cards carry no date');assert(!home.includes('home-route-grid'),'No section cards repeating the main navigation');
const day=864e5,now=Date.parse('2026-11-18T12:00:00Z'),d=n=>new Date(now-n*day).toISOString().slice(0,10);
const sample=[{id:'a1',type:'article',updated:d(3)},{id:'a2',type:'article',updated:d(40)},{id:'a3',type:'article',updated:d(400)},{id:'a4',type:'article',updated:d(900)},{id:'n1',type:'news',eventDate:d(20)},{id:'n2',type:'news',eventDate:d(30)},{id:'n3',type:'news',eventDate:d(61)}];
c.sample=sample;c.now=now;
const pick=k=>get(`homeReadingSelection(sample,now,${k}).rows.map(r=>r.id)`);
const seen=new Set();for(let k=0;k<20;k++){const ids=pick(k);assert.equal(ids.length,3);assert.equal(ids[0],'a1','Newest within 14 days keeps the first card');assert(ids.filter(x=>x.startsWith('n')).length<=1,'At most one news card');assert(!ids.includes('n3'),'News older than 60 days stays off the homepage');ids.forEach(x=>seen.add(x));}
for(const id of ['a2','a3','a4','n1','n2'])assert(seen.has(id),'Rotation reaches '+id);
c.later=now+20*day;assert.notEqual(get('homeReadingSelection(sample,later,0).rows[0].id'),'skip');assert.equal(get('homeReadingPlan(sample,later).pinned'),null,'No pinned card after 14 days');}
for(const id of ['midaad','taqreer','aamenn']){const date=get(`items.find(x=>x.id==='${id}').reviewed`);assert(read('dist/index.html').includes(`data-review-resource="${id}">آخر مراجعة للمورد: ${date}`));}
for(const row of rows.filter(r=>r.type==='news')){const html=read('dist'+row.url+'.html');assert(html.includes(`datetime="${row.eventDate}"`));assert(html.includes(`\"datePublished\":\"${row.published}\"`));assert(html.includes('href="/guides?type=news"'));assert(html.includes('class="news-cover"'));assert(row.image&&row.imageAlt);}
console.log('PASS: one navigation across published pages; 21 articles + 9 news; 3 home previews; store and recitation journeys; direct paired learning; platform and country counts; stable order; source-derived review dates.');
