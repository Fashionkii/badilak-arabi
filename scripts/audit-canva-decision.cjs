'use strict';
// Protect the narrowly scoped Canva decision review and its continuation links.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline='775c5ae95b03b6db6410851dc8e4ce48f26275b5';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const before=file=>execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8'});
for(const file of ['index.html','guides.html','js/catalog-data.js','js/detail-renderers.js','js/guided-discovery.js','js/discovery-memory.js','js/smart-return.js','js/commercial-links.js','js/feedback.js','site.config.json','vercel.json','data/privacy.json','data/disclosure.json'])assert.equal(read(file),before(file),'Protected '+file);
for(const file of fs.readdirSync(path.join(root,'guides')).filter(x=>x.endsWith('.html')&&x!=='arabic-design.html'))assert.equal(read('guides/'+file),before('guides/'+file),'Other article '+file);
const app=read('js/app.js');
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
for(const file of fs.readdirSync(path.join(root,'dist'),{recursive:true}).filter(x=>x.endsWith('.html')))assert.match(read('dist/'+file),/name="robots" content="noindex/,'Indexing guard '+file);
console.log('PASS: Canva-specific note; existing navigation/catalog/cards/19 other articles preserved; three decisions, six sources and valid detail/category links; article layout/share metadata and noindex preserved.');
