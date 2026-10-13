'use strict';
// Protect the narrowly scoped Canva decision review and its continuation links.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {withoutReadingHierarchyApp,withoutReadingHierarchyRenderer,withoutCanvaTaskComparisonRenderer,withPreviousDiscoveryMarkup}=require('./audit-helpers.cjs');
const root=path.resolve(__dirname,'..'),baseline='775c5ae95b03b6db6410851dc8e4ce48f26275b5';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const before=file=>execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8'});
for(const file of ['index.html','guides.html','js/catalog-data.js','js/detail-renderers.js','js/guided-discovery.js','js/discovery-memory.js','js/smart-return.js','js/commercial-links.js','js/feedback.js','site.config.json','vercel.json','data/privacy.json','data/disclosure.json'])assert.equal(file==='js/detail-renderers.js'?withoutReadingHierarchyRenderer(read(file)):read(file),before(file),'Protected '+file);
for(const file of fs.readdirSync(path.join(root,'guides')).filter(x=>x.endsWith('.html')&&x!=='arabic-design.html'))assert.equal(read('guides/'+file),before('guides/'+file),'Other article '+file);
const app=withoutReadingHierarchyApp(read('js/app.js'));
const noteFunction=app.slice(app.indexOf('function originFitNoteText('),app.indexOf('function renderCards(){'));
const context=vm.createContext({});vm.runInContext(noteFunction,context);
const generic='خيارات تؤدي المهمة نفسها أو جزءًا منها؛ ترتيب العرض ليس تقييمًا للأفضل.';
for(const origin of [null,'chatgpt','drive','shopify'])assert.equal(context.originFitNoteText(origin),generic);
assert.match(context.originFitNoteText('canva'),/أداة مكمّلة/);
assert.equal(app.replace(noteFunction,'').replace(' if(fitNote){fitNote.hidden=!originFilter;fitNote.textContent=originFitNoteText(originFilter);}',' if(fitNote)fitNote.hidden=!originFilter;'),before('js/app.js'),'Other application behavior changed');

const file='guides/arabic-design.html',guide=read(file),old=before(file),built=read('dist/'+file);
assert.deepEqual(guide.match(/<style>[\s\S]*?<\/style>/g),old.match(/<style>[\s\S]*?<\/style>/g),'Article layout styles');
assert.equal(guide.match(/<head>[\s\S]*?<\/head>/)[0].replace('"dateModified":"2026-10-12"','"dateModified":"2026-09-23"'),old.match(/<head>[\s\S]*?<\/head>/)[0],'Only editorial date may change in article metadata');
const hrefs=html=>[...html.matchAll(/href="([^"]+)"/g)].map(x=>x[1]);
for(const href of new Set(hrefs(old)))assert.ok(hrefs(guide).includes(href),'Existing link lost: '+href);
for(const label of ['ابقَ مع Canva','استخدم أداة مكمّلة','جرّب بديلًا لمهمة واحدة'])assert.ok(built.includes(label),'Missing decision '+label);
const ids=[...guide.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate anchors');
for(const href of hrefs(guide).filter(x=>x.startsWith('#')))assert.ok(ids.includes(href.slice(1)),'Broken local anchor '+href);
for(const id of ['dhawwi','taqreer','arabicdesign']){
 assert.ok(built.includes(`href="/discover/${id}"`),'Missing internal detail link '+id);
 assert.ok(fs.existsSync(path.join(root,'dist/discover/'+id+'.html')),'Missing target '+id);
}
assert.match(built,/href="\/category\/create\?sub=design"><span>قارن خيارات التصميم/);
assert.equal((guide.match(/class="source-card"/g)||[]).length,6);
assert.ok(guide.includes('6 مصادر موثقة'));
for(const href of ['https://taqreer.ai/ar','https://arabicdesign.ai/ar','https://www.canva.com/help/download-file-types/'])assert.ok(hrefs(guide).includes(href),'New evidence source missing');

// 13 October: comparison is opt-in and task-specific; never intercept an outbound visit.
const loadRenderer=renderer=>{const c=vm.createContext({window:{}});vm.runInContext(read('js/catalog-data.js')+'\n'+renderer,c);return c;};
const renderer=read('js/detail-renderers.js'),current=loadRenderer(renderer),previous=loadRenderer(withoutCanvaTaskComparisonRenderer(renderer));
const comparisonIds=['dhawwi','taqreer','arabicdesign'];
for(const item of vm.runInContext('items',current)){
 for(const origin of [null,...item.origin])assert.equal(current.directoryCardMarkup(item,origin),previous.directoryCardMarkup(item,origin),'No card action added: '+item.id);
 for(const standalone of [false,true]){
  const html=current.directoryDetailMarkup(item,standalone),oldHtml=previous.directoryDetailMarkup(item,standalone);
  if(!comparisonIds.includes(item.id)){assert.equal(html,oldHtml,'Unrelated detail unchanged: '+item.id);continue;}
  const comparison=current.directoryDiscoveryMarkup(item,standalone);
  assert.match(comparison,/^<details class="detail-task-comparison">/,'Comparison starts closed');
  assert.doesNotMatch(comparison,/\sopen(?:[\s=>])|role="dialog"|openExternal\(/,'No auto-open, modal or outbound interception');
  assert.equal((comparison.match(/<li>/g)||[]).length,3,'Only the three reviewed task choices');
  assert.equal((comparison.match(/class="task-comparison-current"/g)||[]).length,1,'Identify current choice');
  for(const id of comparisonIds.filter(id=>id!==item.id))assert.ok(comparison.includes('href="/discover/'+id+'"'),'Keep other detail link '+id);
  assert.ok(comparison.includes('href="/guides/arabic-design#decision"'),'Comparison evidence route');
  assert.ok(comparison.includes('عرض كل تصميم'),'Keep collection access');
  assert.ok(html.indexOf('class="destination-link"')<html.indexOf('class="detail-task-comparison"'),'Direct visit stays available first');
  assert.equal(withPreviousDiscoveryMarkup(html,oldHtml),oldHtml,'All existing detail copy, sources and direct visit preserved: '+item.id);
  if(standalone){assert.doesNotMatch(comparison,/onclick=/,'Standalone comparison works without app handlers');assert.ok(read('dist/discover/'+item.id+'.html').includes(html),'Built detail parity '+item.id);}
 }
}
for(const file of fs.readdirSync(path.join(root,'dist'),{recursive:true}).filter(x=>x.endsWith('.html')))assert.match(read('dist/'+file),/name="robots" content="noindex/,'Indexing guard '+file);
console.log('PASS: Canva journey and six sources preserved; optional closed comparison on exactly three tools; 82 cards and 79 other details unchanged; direct visits, original detail copy, sources, article layout/share metadata and noindex preserved.');
