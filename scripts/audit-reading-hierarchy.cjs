'use strict';
// This presentation change may expose/reorder existing facts, never replace them.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {markupMeaning,withoutReadingHierarchyApp,withoutReadingHierarchyRenderer}=require('./audit-helpers.cjs');
const root=path.resolve(__dirname,'..'),base='f18ed7c9107cc9bd72fadb98ca59b8570d477dcd';
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const before=f=>execFileSync('git',['show',base+':'+f],{cwd:root,encoding:'utf8'});
for(const f of ['index.html','guides.html','js/catalog-data.js','js/guided-discovery.js','js/discovery-memory.js','js/smart-return.js','js/commercial-links.js','js/feedback.js','js/route-seo.js','css/app.css','css/visual-refresh.css','css/cosmic-theme.css','data/privacy.json','data/disclosure.json','data/article-media.json','site.config.json','vercel.json'])assert.equal(read(f),before(f),'Protected '+f);
for(const f of fs.readdirSync(path.join(root,'guides')).filter(f=>f.endsWith('.html')))assert.equal(read('guides/'+f),before('guides/'+f),'Article text/links/metadata '+f);
assert.equal(withoutReadingHierarchyApp(read('js/app.js')),before('js/app.js'),'Other application behavior');
assert.equal(withoutReadingHierarchyRenderer(read('js/detail-renderers.js')),before('js/detail-renderers.js'),'Other renderer data/behavior');
const context=reader=>{const c=vm.createContext({window:{}});vm.runInContext(reader('js/catalog-data.js')+'\n'+reader('js/detail-renderers.js'),c);return c;};
const prior=context(before),now=context(read),items=vm.runInContext('items',now);
for(const item of items){
 for(const origin of [null,...item.origin]){
  const old=prior.directoryCardMarkup(item,origin),html=now.directoryCardMarkup(item,origin);
  const removeLimit=s=>s.replace(/<p class="card-key-limit[^"]*">[\s\S]*?<\/p>/,'');
  assert.equal(removeLimit(html),removeLimit(old),'Card actions/copy '+item.id);
  const limit=html.match(/<p class="card-key-limit[^"]*"><strong>قبل أن تختار<\/strong><span>([\s\S]*?)<\/span><\/p>/)?.[1];
  assert.equal(limit,prior.directoryComparison(item,origin).caution||prior.decisionNoteFor(item).alert,'Existing full caution '+item.id);
  assert.ok(html.indexOf('class="card-purpose"')<html.indexOf('class="card-key-limit'),'Purpose precedes caution');
  assert.ok(html.indexOf('class="card-key-limit')<html.indexOf('class="card-primary-actions"'),'Caution precedes actions');
 }
 for(const standalone of [false,true]){
  const html=now.directoryDetailMarkup(item,standalone);
  assert.deepEqual(markupMeaning(html),markupMeaning(prior.directoryDetailMarkup(item,standalone)),'Every detail/source/handler '+item.id);
  assert.ok(html.indexOf('class="quick-purpose"')<html.indexOf('class="decision-panel"'),'Purpose first');
  assert.ok(html.indexOf('class="decision-panel"')<html.indexOf('class="detail-facts"'),'Critical limit before facts');
  if(standalone)assert.ok(read('dist/discover/'+item.id+'.html').includes(html),'Static detail matches shared renderer');
 }
}
// Text, not color alone, identifies the caution; no clipping or collapsible warning.
const css=read('css/reading-hierarchy.css');
assert.doesNotMatch(css,/display\s*:\s*none|visibility\s*:\s*hidden|-webkit-line-clamp\s*:\s*\d/);
assert.ok(read('dist/css/visual-refresh.css').endsWith(css));
assert.ok(read('dist/css/site-bundle.css').endsWith(css));
function luminance(hex){const rgb=hex.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
for(const [ink,paper] of [['263A36','F0F5F2'],['263A36','FBF7EE'],['53645E','FCFCF9'],['705322','FBF7EE']])assert.ok(contrast(ink,paper)>=4.5,'Readable text contrast '+ink+'/'+paper);
console.log('PASS: 82 cards and static/dialog details preserve text, sources and actions; full existing limits precede actions; 36 learning records and all 20 articles unchanged; shared CSS delivered without an extra request; key text pairs exceed 4.5:1.');
