'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {markupMeaning}=require('./audit-helpers.cjs');
const base='7b6a03a31755a02184195c8da45dd691a5c79210';
const read=file=>fs.readFileSync(file,'utf8');
const old=file=>execFileSync('git',['show',base+':'+file],{encoding:'utf8'});
function load(reader){
 const context=vm.createContext({window:{}});
 for(const file of ['js/catalog-data.js','js/detail-renderers.js'])vm.runInContext(reader(file),context);
 return context;
}
const current=load(read),previous=load(old);
vm.runInContext(read('js/directory-search.js'),current);
const items=vm.runInContext('items',current),ids=list=>Array.from(list,x=>x.id);
const search=(query,list=items)=>current.searchDirectoryItems(list,query);
assert.equal(items.length,95);
assert.equal(search(''),items,'Empty search preserves the original array/order');
assert.equal(search('   '),items);
for(const item of items)assert.equal(search(item.name)[0]?.id,item.id,'Exact resource: '+item.name);
for(const query of ['كتاب','كِتَاب','الكتاب','كـتـاب','  كتاب  ']){
 for(const id of ['hindawi','abjjad','shamela'])assert.ok(ids(search(query)).includes(id),query+': '+id);
 assert.ok(!ids(search(query)).includes('gravity'),'Books must not retrieve the whole culture category');
}
for(const query of ['طفل','الطفل','أطفال','اطفال']){
 const result=ids(search(query));
 for(const id of ['spacetoonyt','majidkids','hindawi','dubaiplus','mumzworld'])assert.ok(result.includes(id),query+': '+id);
 assert.ok(result.indexOf('spacetoonyt')<result.indexOf('mumzworld'),'Content relevance precedes the shopping context');
}
assert.deepEqual(ids(search('محتوى للأطفال')),ids(search('للأطفال محتوى')));
assert.ok(ids(search('كتاب للاطفال')).includes('hindawi'));
assert.deepEqual(ids(search('PDF')),['midaad']);
assert.ok(ids(search('وظيفة')).includes('wuzzuf'));
assert.ok(ids(search('مصر')).includes('karnak'));
assert.equal(search('zzzzلايوجد').length,0);
assert.equal(search('<script>nosuch</script>').length,0);
const tech=items.filter(x=>x.cat==='tech');
assert.equal(search('كتاب',tech).length,0,'Search must respect category/context filtering');
assert.ok(search('مصر',tech).every(x=>x.cat==='tech'));

const extras=vm.runInContext('trialDecisionComplements',current);
const previousExtras=vm.runInContext('trialDecisionComplements',previous);
const dates=vm.runInContext('practicalTrialPreparedOn',current);
assert.equal(Object.keys(dates).length,51);
assert.equal(Object.values(dates).filter(date=>date==='19 أكتوبر 2026').length,4);
assert.equal(dates.karnak,undefined,'Do not invent an exact historic date');
assert.equal(JSON.stringify(vm.runInContext('practicalTrials',current)),JSON.stringify(vm.runInContext('practicalTrials',previous)));
assert.equal(items.filter(x=>current.hasPracticalTrial(x)).length,52);
const originalHindawi=previousExtras.hindawi;
function normalizeDetail(html,id){
 html=html.replaceAll('آخر مراجعة للمورد:','آخر مراجعة:')
  .replaceAll('تاريخ الإعداد لا يعني إعادة التحقق من المورد. ','');
 if(['almaany','dubaifuture','kezakoo','telmidtice'].includes(id))html=html.replace('إعداد التمرين: 19 أكتوبر 2026.','إعداد التمرين: 18 أكتوبر 2026.');
 if(id==='hindawi')html=html.replace(extras.hindawi,originalHindawi);
 return markupMeaning(html);
}
const links=html=>Array.from(html.matchAll(/(?:href|src|onclick|target|rel)="([^"]*)"/g),m=>m[0]).sort();
for(const item of items){
 assert.equal(current.directoryCardMarkup(item),previous.directoryCardMarkup(item),item.id+' card');
 assert.equal(current.decisionPanelMarkup(item),previous.decisionPanelMarkup(item),item.id+' visible warning and source');
 assert.equal(current.directoryDiscoveryMarkup(item),previous.directoryDiscoveryMarkup(item),item.id+' optional comparisons');
 if(item.id!=='hindawi')assert.equal(extras[item.id],previousExtras[item.id],item.id+' retained merged guidance');
 const trial=current.practicalTrialMarkup(item);
 assert.ok(!trial.includes('practical-trial" open'),item.id+' exercise collapsed initially');
 if(dates[item.id])assert.ok(trial.includes('إعداد التمرين: '+dates[item.id]),item.id+' preparation date');
 for(const standalone of [false,true]){
  const now=current.directoryDetailMarkup(item,standalone),prior=previous.directoryDetailMarkup(item,standalone);
  assert.deepEqual(normalizeDetail(now,item.id),normalizeDetail(prior,item.id),item.id+' complete content inventory');
  assert.deepEqual(links(now),links(prior),item.id+' destinations and actions');
  if(trial){
   assert.ok(now.indexOf('decision-panel')<now.indexOf('practical-trial'),item.id+' warning before exercise');
   assert.ok(now.indexOf('class="destination-link"')<now.indexOf('practical-trial'),item.id+' visit before exercise');
   assert.equal((now.match(/class="detail-task-comparison practical-trial"/g)||[]).length,1);
  }
 }
 const staticHTML=read('dist/discover/'+item.id+'.html');
 assert.ok(staticHTML.includes(current.directoryDetailMarkup(item,true)),item.id+' same standalone renderer');
}
const protectedFiles=['js/catalog-data.js','js/discovery-memory.js','js/guided-discovery.js','js/smart-return.js','js/outbound-choice.js','js/commercial-links.js','js/feedback.js','js/feedback-config.js','js/route-seo.js','site.config.json','vercel.json','css/fonts.css',...fs.readdirSync('guides').filter(x=>x.endsWith('.html')).map(x=>'guides/'+x)];
for(const file of protectedFiles)assert.equal(read(file),old(file),file+' protected');
const app=read('js/app.js'),priorApp=old('js/app.js');
assert.equal(app.slice(app.indexOf('function setLearningType')),priorApp.slice(priorApp.indexOf('function setLearningType')),'Learning, dialogs, return, country data and home rotation unchanged');
const home=html=>html.slice(html.indexOf('<section class="intro wrap"'),html.indexOf('<section class="intro wrap"')+html.slice(html.indexOf('<section class="intro wrap"')).indexOf('</section>')+10);
assert.equal(home(read('index.html')),home(old('index.html')),'All home choices, artwork and routes unchanged');
assert.match(read('index.html'),/<label class="directory-search-label" for="searchInput">/);
assert.ok(!read('index.html').includes('id="directoryRefineSearch" hidden'));
assert.ok(!app.includes('لم نجد نتيجة موثقة مطابقة الآن'));
console.log('PASS: search relevance, normalization, exact 95 names, filters and empty queries; 95 detail content/link inventories, 52 preserved exercises, 51 preparation dates, 36 learning sources, all protected data/return/rotation/articles.');
