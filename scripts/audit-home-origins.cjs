'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const base='3cb5997cfa0d0d5518c916a526d85ddc2c170290',read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',base+':'+f],{encoding:'utf8'});
function load(reader){const c=vm.createContext({window:{}});vm.runInContext(reader('js/catalog-data.js')+'\n'+reader('js/detail-renderers.js'),c);return c;}
const now=load(read),before=load(old),items=vm.runInContext('items',now);
assert.equal(JSON.stringify(items),JSON.stringify(vm.runInContext('items',before)));
for(const x of items){for(const origin of [null,...x.origin,'claude','gemini'])assert.equal(now.directoryCardMarkup(x,origin),before.directoryCardMarkup(x,origin));for(const direct of [true,false])assert.equal(now.directoryDetailMarkup(x,direct),before.directoryDetailMarkup(x,direct));}
for(const f of ['js/discovery-memory.js','js/commercial-links.js','js/feedback.js','site.config.json',...fs.readdirSync('guides').filter(f=>f.endsWith('.html')).map(f=>'guides/'+f)])assert.equal(read(f),old(f),f);
const app=read('js/app.js'),start=app.indexOf('const homeOriginGroups='),end=app.indexOf('(()=>{',start);
vm.runInContext(app.slice(start,end),now);
const seen=new Set();
for(let n=0;n<60;n++){
 const selected=now.homeOriginSelection(n);assert.equal(selected.length,12);assert.equal(new Set(selected).size,12);
 for(const id of selected){seen.add(id);const route=vm.runInContext('originRouteMap',now)[id];assert.ok(route,id);assert.ok(items.some(x=>now.matchesDirectoryOrigin(x,id)&&(route.cat==='all'||route.cat===x.cat)&&(route.sub==='all'||route.sub===x.sub)),id+' nonempty route');}
 assert.deepEqual(Array.from(selected),Array.from(now.homeOriginSelection(n)),'stable within visit');
 assert.notDeepEqual(Array.from(selected),Array.from(now.homeOriginSelection(n+1)),'renewed next visit');
}
for(const id of ['chatgpt','claude','gemini','kimi','deepseek','wikipedia','kindle'])assert.ok(seen.has(id),id);
assert.doesNotMatch(read('index.html'),/conversationExampleChoice|مثال المحادثة/);
assert.doesNotMatch(app,/setConversationExample|initializeConversationExample/);
assert.equal(read('js/guided-discovery.js').replace("  if(view==='home'&&previous!==view&&options.history!==false)window.badilakHomeOrigins?.enter();\n",''),old('js/guided-discovery.js'),'only deliberate home visit hook');
console.log('PASS: 12 unique home icons across 60 visits; all task routes populated, five AI examples reachable; 94 service records/card/detail renderings and 20 articles preserved; rejected selector removed; history restoration excluded from renewal.');
