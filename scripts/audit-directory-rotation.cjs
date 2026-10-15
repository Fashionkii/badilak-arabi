'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const app=fs.readFileSync(__dirname+'/../js/app.js','utf8');
const source=app.slice(app.indexOf('const directoryRotationKey='),app.indexOf('function resetDirectoryLimit'));
const catalog=vm.runInNewContext(fs.readFileSync(__dirname+'/../js/catalog-data.js','utf8')+';items');
const list=JSON.parse(JSON.stringify(catalog)),original=JSON.stringify(list);
const ids=a=>Array.from(a,x=>x.id);
function visit({mobile=false,seed=42,saved,blocked=false}={}){
 const state=saved||new Map([['badilak_directory_rotation_v2',JSON.stringify({seed,wide:!mobile})]]);
 const viewport={mobile};
 const ctx=vm.createContext({window:{matchMedia:()=>({matches:viewport.mobile})},sessionStorage:{getItem:k=>{if(blocked)throw Error('blocked');return state.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');state.set(k,v)}},Math,document:{getElementById:()=>({value:''})},items:list,initializedJourneyPanels:new Set(),filter:'all',subfilter:'all',originFilter:null,countryFilter:null});
 vm.runInContext(source,ctx);
 return {ctx,state,viewport,order:(rows=list,q='')=>ctx.orderDirectoryDiscoveryCards(rows,q)};
}
const desktop=visit(),a=ids(desktop.order());
assert.deepEqual(a.slice(0,4),ids(list.slice(0,4)),'desktop anchors');
assert.deepEqual(a.slice().sort(),ids(list).sort(),'complete catalog, exactly once');
assert.deepEqual(a,ids(desktop.order()),'repeated rendering is stable');
assert.deepEqual(a.slice(0,6),ids(desktop.order()).slice(0,12).slice(0,6),'more preserves prefix');
desktop.viewport.mobile=true;
assert.deepEqual(a,ids(desktop.order()),'resize cannot reshuffle seen cards');
assert.deepEqual(a,ids(visit({mobile:true,saved:desktop.state}).order()),'reload after resize is stable');
assert.deepEqual(JSON.stringify(list),original,'source data not mutated');
const mobile=visit({mobile:true}),m=ids(mobile.order());
assert.deepEqual(m.slice(0,2),ids(list.slice(0,2)),'mobile anchors');
assert.notEqual(m[2],list[2].id,'one initial mobile card rotates');
mobile.viewport.mobile=false;
assert.deepEqual(m,ids(mobile.order()),'mobile-to-wide resize is stable');
assert.deepEqual(ids(desktop.order(list,'فنار')),ids(list),'search untouched');
for(const [key,value] of [['subfilter','ai'],['originFilter','canva'],['countryFilter','eg']]){
 desktop.ctx[key]=value;
 assert.deepEqual(ids(desktop.order()),ids(list),key+' untouched');
 desktop.ctx[key]=key==='subfilter'?'all':null;
}
for(const cat of new Set(list.map(x=>x.cat))){
 desktop.ctx.filter=cat;
 const rows=list.filter(x=>x.cat===cat),ordered=ids(desktop.order(rows));
 assert.deepEqual(ordered.slice(0,2),ids(rows.slice(0,2)),cat+' anchors');
 assert.deepEqual(ordered.slice().sort(),ids(rows).sort(),cat+' membership');
 assert.deepEqual(ordered,ids(desktop.order(rows)),cat+' stable return');
}
assert.deepEqual(ids(visit({blocked:true}).order()),ids(list),'blocked storage degrades to normal order');
const malformed=new Map([['badilak_directory_rotation_v2','{invalid']]);
assert.deepEqual(ids(visit({saved:malformed}).order()),ids(list),'malformed storage degrades safely');
assert.deepEqual(ids(visit().order(list.slice(0,3))),ids(list.slice(0,3)),'small result set untouched');
const exposed=new Set();
for(let seed=0;seed<256;seed++)for(const id of ids(visit({seed}).order()).slice(4,6))exposed.add(id);
assert.ok(ids(list.slice(18)).some(id=>exposed.has(id)),'deep catalog can be discovered');
assert.ok(exposed.size>50,'candidate pool is not silently capped');
assert.notDeepEqual(a,ids(visit({seed:739}).order()),'different visits may differ');
const entered=visit({seed:42});
const previous=ids(entered.order());
const visitInfo=entered.ctx.window.badilakDirectoryRotation;
assert.ok(visitInfo&&typeof visitInfo.enter==='function','rotation public API');
const captured=visitInfo.capture();
visitInfo.enter();
const fresh=ids(entered.order());
assert.notDeepEqual(fresh.slice(0,6),previous.slice(0,6),'new entry rotates initial desktop discovery slots');
assert.deepEqual(fresh.slice(0,4),previous.slice(0,4),'desktop anchor slots unchanged');
assert.deepEqual(fresh,ids(entered.order()),'rendering in a visit never reshuffles');
visitInfo.restore(captured);
assert.deepEqual(ids(entered.order()),previous,'history restores exact original card order');
entered.ctx.filter='create';
const catList=list.filter(x=>x.cat==='create');
const oldCategory=ids(entered.order(catList));
visitInfo.enter();
const newCategory=ids(entered.order(catList));
if(catList.length>=6)assert.notDeepEqual(newCategory.slice(0,6),oldCategory.slice(0,6),'category re-entry refreshes desktop slots');
assert.deepEqual(newCategory.slice(0,4),oldCategory.slice(0,4),'desktop category anchors unchanged');
const six=visit({seed:42});
six.ctx.filter='create';
const creation=list.filter(x=>x.cat==='create');
if(creation.length===6){
 const beforeSix=ids(six.order(creation));six.ctx.window.badilakDirectoryRotation.enter();
 const afterSix=ids(six.order(creation));
 assert.notDeepEqual(beforeSix.slice(4,6),afterSix.slice(4,6),'six-item category swaps its two discovery slots');
 assert.deepEqual(beforeSix.slice(0,4),afterSix.slice(0,4),'six-item category preserves anchors');
}
const guarded=ids(entered.order(catList));
entered.ctx.subfilter='design';
visitInfo.enter();
entered.ctx.subfilter='all';
assert.deepEqual(ids(entered.order(catList)),guarded,'specific filter entry does not reshuffle');
const enteredMobile=visit({mobile:true,seed:42});
const oldMobile=ids(enteredMobile.order());
enteredMobile.ctx.window.badilakDirectoryRotation.enter();
const newMobile=ids(enteredMobile.order());
assert.notEqual(newMobile[2],oldMobile[2],'mobile re-entry rotates one visible slot');
assert.deepEqual(newMobile.slice(0,2),oldMobile.slice(0,2),'mobile first two remain stable');

console.log(`PASS: stable visit/resize/reload, two desktop or one mobile discovery slots, complete catalog and category membership, untouched precise filters, safe storage fallback; ${exposed.size} later items sampled across 256 seeds.`);
