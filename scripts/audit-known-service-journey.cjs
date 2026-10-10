'use strict';
// Guard the two reviewed data updates and the active-reference regression.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline=process.argv[2]||'02ff5a758052600710959008aa80c96cf3fd23ba';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const before=file=>execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8'});
const plain=x=>JSON.parse(JSON.stringify(x));
const fields='({items,learning,itemCountryMap,learningCountryMap,originRouteMap,categoryNames,subfilterMap,relatedGuideMap,learningGuideMap})';
const prior=plain(vm.runInNewContext(before('js/catalog-data.js')+';'+fields));
const context=vm.createContext({window:{}});
vm.runInContext(read('js/catalog-data.js')+'\n'+read('js/detail-renderers.js'),context);
const current=plain(vm.runInContext(fields,context));
const allowed={aamenn:['type','value','arabRelation','availability','price','verified','reviewed','limit','url','domain','modules'],taqreer:['availability','price','verified','reviewed','limit','modules']};
assert.equal(current.items.length,82);assert.equal(current.learning.length,36);
assert.deepEqual(current.items.map(x=>x.id),prior.items.map(x=>x.id),'Catalog order/identity changed');
for(const [key,value] of Object.entries(prior))if(key!=='items')assert.deepEqual(current[key],value,'Protected map or learning data: '+key);
for(let i=0;i<current.items.length;i++){
 const now=current.items[i],old=prior.items[i];
 for(const key of new Set([...Object.keys(now),...Object.keys(old)])){
  if(!allowed[now.id]?.includes(key))assert.deepEqual(now[key],old[key],now.id+'.'+key);
 }
}
for(const file of ['js/commercial-links.js','js/discovery-memory.js','js/smart-return.js','js/guided-discovery.js','js/feedback.js','data/privacy.json','data/disclosure.json','site.config.json','vercel.json'])assert.equal(read(file),before(file),'Protected file: '+file);
for(const file of fs.readdirSync(path.join(root,'guides')).filter(x=>x.endsWith('.html')))assert.equal(read('guides/'+file),before('guides/'+file),'Article changed: '+file);
const index=read('index.html');
const normalizeBrand=html=>html
 .replace(/(<a href="#top" class="brand-lockup"[^>]*>)[\s\S]*?(<\/a>)/,'$1[approved brand artwork]$2')
 .replace(/(<h1 class="art-title art-title--brand" aria-label="بديلك عربي">)[\s\S]*?(<\/h1>)/,'$1[approved brand artwork]$2');
assert.equal(normalizeBrand(index.replace(/^  <p id="originFitNote".*\n/m,'')),normalizeBrand(before('index.html')),'Unrelated homepage copy, links, ads or markup changed');
const {items}=vm.runInContext('({items})',context);
let relationships=0;
for(const origin of Object.keys(current.originRouteMap)){
 for(const item of items.filter(x=>x.origin.includes(origin))){
  const html=context.directoryCardMarkup(item,origin);
  const strip=html.match(/<div class="comparison-strip[\s\S]*?<\/div>/)[0];
  assert.ok(strip.includes('>'+context.originName(origin)+'</bdi>'),'Wrong active reference: '+origin+'/'+item.id);
  assert.ok(html.includes('class="card-fit"'),'Missing relationship description');relationships++;
 }
}
const noon=items.find(x=>x.id==='noon');
assert.ok(!context.directoryCardMarkup(noon,'jumia').match(/<div class="comparison-strip[\s\S]*?<\/div>/)[0].includes('Amazon'));
for(const html of items.map(context.directoryCardMarkup))assert.ok(!html.includes('class="card-fit"')&&!html.includes('class="card-key-limit"'),'General browsing acquired comparison-only notes');
assert.ok(context.editorialGuideLinkMarkup('dhawwi').includes('دليل الاختيار'));
assert.ok(context.guideLinkMarkup(['/guides/arabic-design','عنوان']).includes('<strong>اقرأ</strong>'),'Learning label changed');
assert.ok(context.countryBadgeMarkup(items.find(x=>x.id==='taqreer')).includes('تسجيل أمريكي'));
assert.equal(items.find(x=>x.id==='aamenn').url,'https://www.aamenn.com/');
assert.match(items.find(x=>x.id==='fanar').modules.at(-1)[1],/2609\.35564/,'Later Fanar research lost');
const bundle=['fonts.css','app.css','visual-refresh.css'].map(file=>read('css/'+file)).join('\n')+'\n'+read('css/cosmic-theme.css');
assert.equal(read('dist/css/site-bundle.css'),bundle,'CSS cascade/rules changed during bundling');
for(const file of ['discover/aamenn.html','privacy.html']){
 const html=read('dist/'+file);assert.ok(html.includes('/css/site-bundle.css'));
 assert.ok(!html.includes('href="/css/app.css"'),'Blocking styles not combined');
}
for(const file of ['index.html','category/work.html']){
 const html=read('dist/'+file);assert.ok(!html.includes('/css/site-bundle.css'));
 for(const css of ['fonts','app','visual-refresh'])assert.ok(html.includes(`href="/css/${css}.css"`),'Preserve established homepage/category loading');
}
assert.match(read('dist/index.html'),/rel="preload" as="image"[^>]+fetchpriority="high"/);
console.log(`PASS: ${relationships} active comparisons, general browsing, 82 identities/order, 36 learning records, two scoped data updates, later Fanar evidence, 20 articles/three ads/navigation/noindex/receiver protected, exact CSS cascade.`);
