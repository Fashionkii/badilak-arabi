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
const seen=new Set(),day=1800000,startTime=1800000000000;
let state=now.nextHomeOriginState(null,startTime);
const initial=JSON.stringify(state);
for(let n=0;n<30;n++)assert.equal(JSON.stringify(now.nextHomeOriginState(state,startTime+n*60000)),initial,'loads within 30 minutes stable');
assert.equal(JSON.stringify(now.nextHomeOriginState(state,startTime+day-1)),initial,'cooldown boundary');
for(let n=1;n<=100;n++){
 const previous=state;state=now.nextHomeOriginState(state,startTime+n*day);
 assert.equal(state.selected.length,12);assert.equal(new Set(state.selected).size,12);
 assert.equal(state.selected.filter((id,i)=>id!==previous.selected[i]).length,3,'exactly three changed slots');
 for(const id of state.selected){seen.add(id);const route=vm.runInContext('originRouteMap',now)[id];assert.ok(route,id);assert.ok(items.some(x=>now.matchesDirectoryOrigin(x,id)&&(route.cat==='all'||route.cat===x.cat)&&(route.sub==='all'||route.sub===x.sub)),id+' nonempty route');}
 assert.equal(JSON.stringify(now.nextHomeOriginState(state,startTime+n*day+1)),JSON.stringify(state),'repeat stable');
}
for(const id of ['adobeexpress','wix','smallpdf','upwork','ebay','chatgpt','claude','gemini','kimi','deepseek','wikipedia','kindle'])assert.ok(seen.has(id),id+' eventually exposed');
const longGap=now.nextHomeOriginState(state,startTime+500*day);assert.equal(longGap.selected.filter((id,i)=>id!==state.selected[i]).length,3,'no catch-up after long absence');
for(const invalid of [{},{...state,selected:['bogus']},{...state,updatedAt:startTime+9999*day}])assert.equal(JSON.stringify(now.nextHomeOriginState(invalid,startTime)),initial,'invalid state reset');
assert.doesNotMatch(read('index.html'),/conversationExampleChoice|مثال المحادثة/);
assert.doesNotMatch(app,/setConversationExample|initializeConversationExample/);
assert.equal(read('js/guided-discovery.js'),old('js/guided-discovery.js').replace("  if(view==='home'&&previous!==view&&options.history!==false)window.badilakHomeOrigins?.enter();\n",'').replace('  ensureJourneyPanel(view);','  window.badilakHomeOrigins?.navigate(view);\n  ensureJourneyPanel(view);'),'only eager home refresh hook removed');
const clock=now.createHomeOriginVisitClock();
assert.equal(clock('directory',true,0),false);
assert.equal(clock('home',true,1000),false,'quick return stable');
assert.equal(clock('directory',true,2000),false);
assert.equal(clock('directory',false,3000),false);
assert.equal(clock('directory',true,3600000),false);
assert.equal(clock('home',true,3601000),false,'hidden tab does not count');
assert.equal(clock('learning',true,3602000),false);
assert.equal(clock('guides',true,3662000),false,'never change outside home');
assert.equal(clock('home',true,3722000),true,'visible browsing then return refreshes');
assert.equal(clock('home',true,3900000),false,'home idle never refreshes');
assert.equal(clock('directory',true,3901000),false);
assert.equal(clock('home',true,3902000),false,'reset after refresh');
console.log('PASS: two-minute visible browsing, quick returns, hidden tabs, section transitions, reset; 30-minute reload boundary; 100 cycles; preserved catalog/cards/details/articles.');
