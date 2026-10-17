'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const base='60e81f9d0f320bd74b5cb409623b8a141556432b',read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',base+':'+f],{encoding:'utf8'});
function load(reader){const c=vm.createContext({window:{}});vm.runInContext(reader('js/catalog-data.js')+'\n'+reader('js/detail-renderers.js'),c);return c;}
const now=load(read),before=load(old),items=vm.runInContext('items',now);
assert.equal(JSON.stringify(items),JSON.stringify(vm.runInContext('items',before)));
for(const x of items){for(const origin of [null,...x.origin,'claude','gemini'])assert.equal(now.directoryCardMarkup(x,origin),before.directoryCardMarkup(x,origin));for(const direct of [true,false])assert.equal(now.directoryDetailMarkup(x,direct),before.directoryDetailMarkup(x,direct));}
for(const f of ['js/discovery-memory.js','js/commercial-links.js','js/feedback.js','site.config.json',...fs.readdirSync('guides').filter(f=>f.endsWith('.html')).map(f=>'guides/'+f)])assert.equal(read(f),old(f),f);
const app=read('js/app.js'),start=app.indexOf('const homeOriginGroups='),end=app.indexOf('(()=>{',start);
vm.runInContext(app.slice(start,end),now);
const seen=new Set(),day=86400000,startTime=1800000000000;
let state=now.nextHomeOriginState(null,startTime);
const initial=JSON.stringify(state);
for(let n=0;n<24;n++)assert.equal(JSON.stringify(now.nextHomeOriginState(state,startTime+n*3600000)),initial,'same-day page loads stable');
assert.equal(JSON.stringify(now.nextHomeOriginState(state,startTime+day-1)),initial,'cooldown boundary');
for(let n=1;n<=100;n++){
 const previous=state;state=now.nextHomeOriginState(state,startTime+n*day);
 assert.equal(state.selected.length,12);assert.equal(new Set(state.selected).size,12);
 assert.equal(state.selected.filter((id,i)=>id!==previous.selected[i]).length,2,'exactly two changed slots');
 for(const id of state.selected){seen.add(id);const route=vm.runInContext('originRouteMap',now)[id];assert.ok(route,id);assert.ok(items.some(x=>now.matchesDirectoryOrigin(x,id)&&(route.cat==='all'||route.cat===x.cat)&&(route.sub==='all'||route.sub===x.sub)),id+' nonempty route');}
 assert.equal(JSON.stringify(now.nextHomeOriginState(state,startTime+n*day+1)),JSON.stringify(state),'repeat stable');
}
for(const id of ['adobeexpress','wix','smallpdf','upwork','ebay','chatgpt','claude','gemini','kimi','deepseek','wikipedia','kindle'])assert.ok(seen.has(id),id+' eventually exposed');
const longGap=now.nextHomeOriginState(state,startTime+500*day);assert.equal(longGap.selected.filter((id,i)=>id!==state.selected[i]).length,2,'no catch-up after long absence');
for(const invalid of [{},{...state,selected:['bogus']},{...state,updatedAt:startTime+9999*day}])assert.equal(JSON.stringify(now.nextHomeOriginState(invalid,startTime)),initial,'invalid state reset');
assert.doesNotMatch(read('index.html'),/conversationExampleChoice|مثال المحادثة/);
assert.doesNotMatch(app,/setConversationExample|initializeConversationExample|badilakHomeOrigins/);
assert.equal(read('js/guided-discovery.js'),old('js/guided-discovery.js').replace("  if(view==='home'&&previous!==view&&options.history!==false)window.badilakHomeOrigins?.enter();\n",''),'only eager home refresh hook removed');
console.log('PASS: 100 daily cycles, 12 unique choices, all routes populated, max two changes including long absences; 24-hour boundary and invalid state; navigation refresh removed; all existing catalog/cards/details/articles preserved.');
