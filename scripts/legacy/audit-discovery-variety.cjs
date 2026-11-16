'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const base='f500d21c51492b75564a77d3a3d1a51ed3c0f764';
const read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',base+':'+f],{encoding:'utf8'});
function renderer(previous=false){const c=vm.createContext({window:{}});vm.runInContext((previous?old:read)('js/catalog-data.js')+'\n'+(previous?old:read)('js/detail-renderers.js'),c);return c;}
const now=renderer(),before=renderer(true),items=vm.runInContext('items',now);
assert.equal(JSON.stringify(items),JSON.stringify(vm.runInContext('items',before)),'Catalog data preserved');
for(const x of items){
 for(const origin of [null,...x.origin])assert.equal(now.directoryCardMarkup(x,origin),before.directoryCardMarkup(x,origin),'Card '+x.id);
 for(const standalone of [false,true]){
  const actual=now.directoryDetailMarkup(x,standalone),previous=before.directoryDetailMarkup(x,standalone);
  if(x.id==='karnak')assert.equal(actual.replace(now.practicalTrialMarkup(x),''),previous,'Only exercise added');
  else assert.equal(actual,previous,'Untouched details '+x.id);
 }
}
for(const file of ['js/discovery-memory.js','js/commercial-links.js','js/feedback.js','js/guided-discovery.js','site.config.json','vercel.json',...fs.readdirSync('guides').filter(f=>f.endsWith('.html')).map(f=>'guides/'+f)])assert.equal(read(file),old(file),'Protected '+file);
const app=read('js/app.js'),source=app.slice(app.indexOf('const directoryRotationKey='),app.indexOf('function resetDirectoryLimit'));
function visit(mobile=false,blocked=false){
 const store=new Map([['badilak_directory_rotation_v2',JSON.stringify({seed:42,wide:!mobile})]]),field={value:''};
 const c=vm.createContext({window:{matchMedia:()=>({matches:mobile})},sessionStorage:{getItem:k=>{if(blocked)throw Error('blocked');return store.get(k)},setItem:(k,v)=>store.set(k,v)},document:{getElementById:()=>field},Math,initializedJourneyPanels:new Set(),filter:'all',subfilter:'all',originFilter:null,countryFilter:null});
 vm.runInContext(read('js/catalog-data.js')+'\n'+source,c);
 return {c,field,ids:()=>Array.from(c.orderDirectoryDiscoveryCards(items.filter(c.directoryMatchesContext),field.value),x=>x.id)};
}
for(const mobile of [false,true])for(const scope of [{},{filter:'tech',subfilter:'ai'},{filter:'create',subfilter:'design'},{filter:'tech',subfilter:'ai',originFilter:'chatgpt'},{filter:'tech',subfilter:'ai',originFilter:'claude'},{filter:'tech',subfilter:'ai',originFilter:'gemini'}]){
 const v=visit(mobile);Object.assign(v.c,scope);
 const a=v.ids(),state=v.c.window.badilakDirectoryRotation.capture();
 assert.deepEqual(a,v.ids(),'repeat stable');assert.equal(new Set(a).size,a.length,'no duplicates');
 assert.deepEqual(a.slice(0,3),v.ids().slice(0,6).slice(0,3),'more prefix');
 v.c.window.badilakDirectoryRotation.enter();const b=v.ids();
 assert.deepEqual([...a].sort(),[...b].sort(),'membership');if(a.length>1)assert.notDeepEqual(a,b,'fresh visit');
 v.c.window.badilakDirectoryRotation.restore(state);assert.deepEqual(a,v.ids(),'exact history restore');
 v.field.value='test';const searched=v.ids();v.c.window.badilakDirectoryRotation.enter();assert.deepEqual(searched,v.ids(),'search not reshuffled');
}
const blocked=visit(false,true);assert.deepEqual(blocked.ids(),Array.from(items,x=>x.id),'storage fallback');
for(const origin of ['claude','gemini']){
 const v=visit();Object.assign(v.c,{filter:'tech',subfilter:'ai',originFilter:origin});
 assert.deepEqual(v.ids().sort(),['arabicai','falcon','fanar','karnak']);
 for(const id of v.ids())assert.ok(now.directoryCardMarkup(items.find(x=>x.id===id),origin).includes(origin==='claude'?'Claude':'Gemini'));
}
assert.ok(read('dist/discover/karnak.html').includes('جرّبه على مهمتك'));
assert.ok(!read('dist/discover/fanar.html').includes('جرّبه على مهمتك'));
console.log('PASS: catalog and 94 existing card renderings preserved; only Karnak exercise added; 20 article files and protected behavior unchanged; desktop/mobile rotation, search guards, exact history restoration, shared task routes and safe storage fallback.');
// The home example changes name, icon and route together, and keeps the user's choice on reload.
const homeSource=app.slice(app.indexOf('const conversationExamples='));
const local=new Map(),session=new Map();
function home(blocked=false){
 const name={textContent:''},image={hidden:false,src:'',parentElement:{classList:{remove(){}}}},choice={value:''};
 const button={dataset:{},setAttribute(){},querySelector:s=>s==='img'?image:name};
 const storage=map=>({getItem:k=>{if(blocked)throw Error('blocked');return map.get(k)},setItem:(k,v)=>{if(blocked)throw Error('blocked');map.set(k,v)}});
 const c=vm.createContext({originFilter:null,sessionStorage:storage(session),localStorage:storage(local),document:{getElementById:id=>id==='conversationExample'?button:choice}});
 vm.runInContext(homeSource,c);return {c,name,image,button,choice};
}
let h=home();assert.equal(h.name.textContent,'ChatGPT');
h.c.setConversationExample('gemini');h=home();assert.equal(h.name.textContent,'Gemini');assert.equal(h.button.dataset.origin,'gemini');assert.ok(h.image.src.endsWith('gemini.google.com'));
h.c.setConversationExample('invalid');assert.equal(h.name.textContent,'Gemini');
session.clear();h=home();assert.equal(h.name.textContent,'Claude');session.clear();assert.equal(home().name.textContent,'Gemini');
assert.equal(home(true).name.textContent,'ChatGPT');
console.log('PASS: home example name/icon/route consistency, explicit choice, session restoration, next-visit cycling and blocked-storage fallback.');
