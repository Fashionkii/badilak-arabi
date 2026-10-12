'use strict';
// The approved presentation changes must not silently rewrite catalog information.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {markupMeaning,withoutModalRestoreHandoff,withTextSectionHeadings,withoutDirectoryControlPresentation,withPreviousSharedBrandImage}=require('./audit-helpers.cjs');
const root=path.resolve(__dirname,'..'),baseline=process.argv[2]||'82edb20896b1c08e901ee478ea1a605c5f0fb174';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const before=file=>execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8'});
const context=readFile=>{
 const c=vm.createContext({window:{}});
 vm.runInContext(readFile('js/catalog-data.js')+'\n'+readFile('js/detail-renderers.js'),c);
 return c;
};
const old=context(before),now=context(read),items=vm.runInContext('items',now);
const normalized=value=>String(value||'').replace(/\s+/g,' ').trim();
let duplicateFacts=0;
for(const item of items){
 const oldCard=old.directoryCardMarkup(item);
 let expectedCard=oldCard.replace(`<button class="more-btn" aria-expanded="false" onclick="openCardShelf('${item.id}',this)">تفاصيل +</button>`,`<button class="more-btn" type="button" aria-haspopup="dialog" aria-controls="detailModal" onclick="openDetail('${item.id}')">تفاصيل</button>`);
 const slot=expectedCard.match(/   <div class="card-guide-slot">.*?<\/div>\n/)[0];
 expectedCard=expectedCard.replace(slot,'').replace(`onclick="openDetail('${item.id}')">تفاصيل</button>\n`,`onclick="openDetail('${item.id}')">تفاصيل</button>\n `+slot).replace(/<strong>(?:دليل الاختيار|مركز القراءة)<\/strong>/,'<strong>اقرأ</strong>');
 const currentCard=now.directoryCardMarkup(item);
 assert.equal(currentCard.replace(/ aria-label="اقرأ: [^"]*"/,'').replace(/<p class="card-key-limit card-key-limit--general">[\s\S]*?<\/p>/,''),expectedCard,item.id+' card copy/links/order');
 assert.match(currentCard,/class="card-read-link|editorial-guide-link card-read-link/);
 assert.match(currentCard,/aria-label="اقرأ: [^"]+"/);

 const duplicates=(old.specialDetails(item)?.facts||old.genericFacts(item)).filter(([,value])=>normalized(value)===normalized(item.value));
 duplicateFacts+=duplicates.length;
 for(const standalone of [false,true]){
  let expected=old.directoryDetailMarkup(item,standalone);
  for(const [label,value] of duplicates)expected=expected.replace(old.detailFact(label,value),'');
  assert.deepEqual(markupMeaning(now.directoryDetailMarkup(item,standalone)),markupMeaning(expected),item.id+' distinct details/sources');
 }
}
for(const file of ['js/catalog-data.js','js/commercial-links.js','js/guided-discovery.js','js/feedback.js','js/route-seo.js','data/privacy.json','data/disclosure.json','site.config.json','vercel.json'])assert.equal(read(file),before(file),'Protected '+file);
assert.equal(withoutModalRestoreHandoff(read('js/smart-return.js')),withoutModalRestoreHandoff(before('js/smart-return.js')),'Other smart-return behavior');
// Saved modal detours restore through the full directory, while ordinary service visits stay static.
const returnSource=read('js/smart-return.js');
const restoreFunction=returnSource.slice(returnSource.indexOf(' function restoreVisit('),returnSource.indexOf('\n function pushUnique('));
const writes=[],visits=[];
const returnContext=vm.createContext({URL,RESTORE:'restore',write:(...args)=>writes.push(args),location:{href:'https://badilak-arabi.vercel.app/guides/arabic-design',origin:'https://badilak-arabi.vercel.app',assign:url=>visits.push(['assign',url]),replace:url=>visits.push(['replace',url])}});
vm.runInContext(restoreFunction,returnContext);
const saved={url:'https://badilak-arabi.vercel.app/discover/dhawwi',discovery:{originFilter:'canva',detail:{kind:'directory',id:'dhawwi'}},y:200,ts:1};
returnContext.restoreVisit(saved);
assert.equal(visits.at(-1)[1],'https://badilak-arabi.vercel.app/#directory');
assert.deepEqual(writes.at(-1)[1].discovery,saved.discovery);assert.equal(writes.at(-1)[1].y,200);
returnContext.restoreVisit({...saved,discovery:undefined});assert.equal(visits.at(-1)[1],saved.url);
returnContext.restoreVisit({...saved,url:'https://badilak-arabi.vercel.app/category/create'});assert.equal(visits.at(-1)[1],'https://badilak-arabi.vercel.app/category/create');
returnContext.restoreVisit(saved,true);assert.equal(visits.at(-1)[0],'replace');
const normalizeOG=html=>withPreviousSharedBrandImage(html).replace(/badilak-social-base\.png(?:\?v=[\d-]+)?/g,'badilak-social-base.png');
for(const file of ['index.html','guides.html'])assert.equal(withoutDirectoryControlPresentation(withTextSectionHeadings(normalizeOG(read(file)))),withoutDirectoryControlPresentation(withTextSectionHeadings(normalizeOG(before(file)))),'Homepage/hub semantics');
// Initial categories must not scroll past their heading before the journey adapter exists.
const source=read('js/app.js');
const routeFunction=source.slice(source.indexOf('function applyShareableRoute(){'),source.indexOf('\napplyShareableRoute();'));
const calls=[];
const routeContext=vm.createContext({window:{},document:{getElementById:()=>null},location:{pathname:'/category/tech',search:''},categoryNames:{tech:'تقنية وذكاء اصطناعي'},subfilterMap:{tech:[]},URLSearchParams,openDirectory:(...args)=>calls.push(args)});
vm.runInContext(routeFunction,routeContext);routeContext.applyShareableRoute();
assert.equal(calls[0][0],'tech');assert.equal(calls[0][1].route,false);assert.equal(calls[0][1].scroll,false);
routeContext.window.badilakJourney={restoreHistory:()=>false};routeContext.applyShareableRoute();
assert.equal(calls[1][1].scroll,true,'In-page category navigation still focuses the journey');
routeContext.window.badilakJourney.restoreHistory=()=>true;routeContext.applyShareableRoute();
assert.equal(calls.length,2,'Saved history takes precedence over a fresh category reset');
for(const file of ['js/app.js','js/detail-renderers.js','js/discovery-memory.js','css/app.css'])assert.doesNotMatch(read(file),/CardShelf|card-shelf|card-detail-shelf|headings-sprite|toggleCardMore|toggleLearningMore/,'Retired code: '+file);
assert.ok(!fs.existsSync(path.join(root,'dist/images/headings-sprite.webp')));
assert.equal((read('index.html').match(/class="section-title"/g)||[]).length,6);
assert.doesNotMatch(read('index.html'),/images\/titles\//);
const pages=fs.readdirSync(path.join(root,'dist'),{recursive:true}).filter(x=>x.endsWith('.html'));
for(const file of pages){
 const html=read('dist/'+file);
 assert.match(html,/rel="icon" href="\/favicon.ico\?v=20261011-1"/,file);
 assert.match(html,/class="[^"]*cosmic-theme/,file);
 if(file.startsWith('guides/')){
  const img=s=>s.match(/<meta property="og:image"[^>]+>/)[0];
  assert.equal(img(html),img(read(file)),'Article sharing image: '+file);
 }
}
const missing=read('dist/404.html');
assert.match(missing,/site-bundle\.css/);assert.match(missing,/الصفحة غير موجودة/);assert.ok(!missing.includes('/js/app.js'));
console.log(`PASS: ${items.length} cards preserve copy/links; ${duplicateFacts} exact duplicate facts removed with every distinct detail/source intact; initial category and history routing; ${pages.length} themed pages/icons; article sharing preserved; retired shelf/sprite absent.`);
