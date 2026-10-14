'use strict';
// Regression evidence for the 14 October correction, against the actual prior main.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline='df35781d4b0e1e7934972be2894bd1bfd3b82fd2';
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const before=f=>execFileSync('git',['show',baseline+':'+f],{cwd:root,encoding:'utf8'});
for(const file of ['js/catalog-data.js','guides.html','js/guided-discovery.js','js/discovery-memory.js','js/smart-return.js','js/commercial-links.js','js/feedback.js','site.config.json','vercel.json',...fs.readdirSync(path.join(root,'data')).map(f=>'data/'+f),...fs.readdirSync(path.join(root,'guides')).filter(f=>f.endsWith('.html')).map(f=>'guides/'+f)])assert.equal(read(file),before(file),'Protected content/behavior: '+file);
function load(renderer){const c=vm.createContext({window:{}});vm.runInContext(read('js/catalog-data.js')+'\n'+renderer,c);return c;}
const now=load(read('js/detail-renderers.js')),old=load(before('js/detail-renderers.js'));
const catalog=vm.runInContext('items',now),ids=new Set(catalog.map(x=>x.id));
let compared=0,unmatched=0;
for(const x of catalog){
 const related=now.relatedDirectoryItems(x);
 assert.ok(related.length<=2&&new Set(related.map(a=>a.id)).size===related.length,'Bounded distinct choices');
 assert.ok(related.every(a=>a.id!==x.id&&ids.has(a.id)),'Real other resource');
 related.length?compared++:unmatched++;
 for(const origin of [null,...x.origin])assert.equal(now.directoryCardMarkup(x,origin),old.directoryCardMarkup(x,origin),'Card content/actions preserved: '+x.id);
 for(const standalone of [false,true]){
  const html=now.directoryDetailMarkup(x,standalone),prior=old.directoryDetailMarkup(x,standalone);
  const comparison=now.directoryDiscoveryMarkup(x,standalone),priorComparison=old.directoryDiscoveryMarkup(x,standalone);
  const heading=s=>s.replace(/<(\/?)h4\b/g,'<$1h2');
  const stripHandlers=s=>standalone?s.replace(/ onclick="[^"]*"/g,''):s;
  const fragment=stripHandlers(heading(comparison)),oldFragment=stripHandlers(heading(priorComparison));
  assert.ok(html.includes(fragment),'Comparison is in actual detail');
  assert.equal(html.replace(fragment,''),prior.replace(oldFragment,''),'All original detail copy, links, source evidence and direct visit preserved: '+x.id);
  assert.match(comparison,/^<details class="detail-task-comparison">/,'Closed optional disclosure');
  assert.doesNotMatch(comparison,/\sopen(?:[\s=>])|role="dialog"|openExternal\(/,'No forced disclosure or intercepted visit');
  assert.ok(html.indexOf('class="destination-link"')<html.indexOf('class="detail-task-comparison"'),'Visit remains first');
  assert.ok((comparison.match(/<li>/g)||[]).length<=3,'No crowded results list');
  if(standalone){assert.doesNotMatch(comparison,/onclick=/);assert.ok(read('dist/discover/'+x.id+'.html').includes(html),'Static/direct detail parity');}
  if(['dhawwi','taqreer','arabicdesign'].includes(x.id))assert.equal(comparison,priorComparison,'Reviewed Canva distinctions and evidence unchanged');
 }
}
for(const id of ['aamenn','gravity','almaany','emushrif'])assert.equal(now.relatedDirectoryItems(catalog.find(x=>x.id===id)).length,0,'No unrelated fallback for '+id);
assert.ok(now.relatedDirectoryItems(catalog.find(x=>x.id==='daftra')).some(x=>x.id==='qoyod'),'Accounting task match');
assert.ok(now.relatedDirectoryItems(catalog.find(x=>x.id==='paymob')).some(x=>x.id==='myfatoorah'),'Payment match can cross the broad category');

const app=read('js/app.js'),priorApp=before('js/app.js');
const newStart=app.indexOf('// Keep school curricula,'),oldStart=priorApp.indexOf('function relatedLearningItems(');
const withoutFocusCorrection=s=>s.replace(" // Comparisons can open a resource absent from the underlying results. Return to\n // the card that opened the dialog, even when history recreates its DOM element.\n const returningItemId=detailReturnFocus?.closest('[data-item-id]')?.dataset.itemId||returningDetail?.id;\n",'').replace('${returningItemId}','${returningDetail.id}');
assert.equal(withoutFocusCorrection(app.slice(0,newStart)+app.slice(app.indexOf('let activeDetail='))),priorApp.slice(0,oldStart)+priorApp.slice(priorApp.indexOf('let activeDetail=')),'Behavior outside optional comparison and original-card focus correction stays exact');
// Closing after comparing to a resource absent from the grid must focus the
// recreated original card, not try to focus the resource currently in the dialog.
for(const fromDetails of [true,false]){
 let onPopstate,focusedSelector='',wentBack=false;
 const modal={open:true,close(){this.open=false;},classList:{remove(){}}};
 const c=vm.createContext({activeDetail:{kind:'directory',id:'vconnct'},detailReturnFocus:{isConnected:true,matches:()=>fromDetails,closest:()=>({dataset:{itemId:'qriib'}}),focus(){}},methodologyReturnFocus:null,location:{pathname:'/discover/vconnct'},history:{state:{badilakDetail:true,returnPath:'/#directory'},length:2,back(){wentBack=true;onPopstate();}},window:{addEventListener(type,fn){assert.equal(type,'popstate');onPopstate=fn;}},requestAnimationFrame:fn=>fn(),document:{getElementById:()=>modal,body:{classList:{remove(){}}},querySelector(selector){return {focus(){focusedSelector=selector;}}}}});
 vm.runInContext(app.slice(app.indexOf('function closeModal('),app.indexOf("document.getElementById('detailModal').addEventListener('cancel'")),c);
 c.closeModal();
 assert.ok(wentBack&&!modal.open);
 assert.equal(focusedSelector,`[data-item-id="qriib"] ${fromDetails?'.more-btn':'.item-identity'}`,'Restore original trigger after comparison');
}
vm.runInContext(app.slice(app.indexOf('function learningDecisionNoteFor('),app.indexOf('function learningDecisionCardMarkup('))+'\n'+app.slice(newStart,app.indexOf('let activeDetail=')),now);
const learning=vm.runInContext('learning',now);
for(const x of learning){
 const peers=now.relatedLearningItems(x),html=now.learningDiscoveryMarkup(x);
 assert.ok(peers.length<=2&&peers.every(a=>a.id!==x.id),'Bounded learning comparison');
 assert.match(html,/^<details class="detail-task-comparison">/);
 assert.doesNotMatch(html,/\sopen(?:[\s=>])|openLearningExternal\(/);
 for(const a of peers){assert.ok(html.includes(a.focus),'Use existing content description');assert.ok(html.includes(a.url),'Keep real source');}
 if(x.type==='reciter')assert.ok(peers.every(a=>a.type==='reciter'),'Recitation remains separate');
 if(['alef-learning','kezakoo-learning','telmidtice-learning','newton-learning','kamkalima-learning'].includes(x.id))assert.ok(peers.every(a=>!['yanfaa','edraak-learning','gomycode-learning'].includes(a.id)),'School curricula are not generic adult courses');
}
const normalizeHome=s=>s.replace(/(<a href="#top" class="brand-lockup"[^>]*>)[\s\S]*?(<\/a>)/,'$1[identity]$2').replace(/(<h1 class="art-title art-title--brand"[^>]*>)[\s\S]*?(<\/h1>)/,'$1[identity]$2').replaceAll('badilak-share-20261014.jpg','badilak-share-20261012.jpg').replace('og:image:height" content="670"','og:image:height" content="630"');
assert.equal(normalizeHome(read('index.html')),normalizeHome(before('index.html')),'Homepage copy, navigation, ads and hierarchy preserved');
const files=fs.readdirSync(path.join(root,'dist'),{recursive:true}).filter(f=>f.endsWith('.html'));
for(const file of files){
 const html=read('dist/'+file);
 assert.match(html,/name="robots" content="noindex/,'Indexing remains closed');
 assert.match(html,/approved-logo-20261014-320.webp/,'Shared identity in '+file);
 assert.doesNotMatch(html,/cosmic-logo-(320|640|1080)|badilak-arabi-wordmark-20261013/,'No retired wordmark request');
 for(const src of [...html.matchAll(/(?:src|href)="(\/images\/brand\/approved-[^"]+)"/g)].map(m=>m[1]))assert.ok(fs.existsSync(path.join(root,'dist',src)),'Brand asset exists');
}
const home=read('dist/index.html');
assert.match(home,/as="image" type="image\/webp" href="\/images\/brand\/approved-logo-20261014-640.webp"/,'Preload matches actual hero asset');
assert.match(read('dist/css/site-bundle.css'),/approved-sky-20261014-800.webp/);
assert.match(read('dist/css/visual-refresh.css'),/approved-sky-20261014-1600.webp/);
assert.doesNotMatch(read('css/cosmic-theme.css'),/cosmic-space-|badilak-hero-stars/,'Retired sky not requested');
assert.equal((read('index.html').match(/class="(?:ad-demo-wrap|commercial-demo-wrap)[^"]*"/g)||[]).length,3,'Three ad previews preserved');
console.log(`PASS: ${catalog.length} directory cards/details protected; ${compared} with task candidates, ${unmatched} honest gaps; ${learning.length} optional learning comparisons; ${files.length} branded noindex pages; Canva review, sources, direct visits, articles, ads and all other behavior unchanged.`);
