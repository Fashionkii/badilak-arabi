'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync('js/app.js','utf8');
const source=app.slice(app.indexOf('const discoveryCategoryOrder='),app.indexOf('function discoveryResultGroups'));
function runtime(saved=null,blocked=false){
 const storage=new Map(saved?[['badilak_directory_rotation_v2',JSON.stringify(saved)]]:[]),search={value:''};
 const c=vm.createContext({window:{},URL,Intl,Date,document:{getElementById:()=>search},sessionStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v);}}});
 for(const f of ['js/catalog-data.js','js/detail-renderers.js','js/directory-search.js','js/discovery-paths.js','js/discovery-index.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
 vm.runInContext("let filter='all',subfilter='all',originFilter=null,countryFilter=null;const initializedJourneyPanels=new Set();let directoryVisible=18,renders=0;function resetDirectoryLimit(){directoryVisible=18}function renderCards(){renders++}"+source,c);
 const get=s=>JSON.parse(vm.runInContext('JSON.stringify('+s+')',c));
 return {c,search,get,run:s=>vm.runInContext(s,c),ids:()=>get("orderDirectoryDiscoveryCards(discoveryIndex,'').map(e=>e.id)")};
}
const r=runtime(),categories=r.get('discoveryCategoryOrder'),preview=r.get('discoveryPreviewIds');
const all=r.get('discoveryIndex.map(e=>e.id)').sort(),seen=Object.fromEntries(categories.map(cat=>[cat,new Set()]));
for(let seed=0;seed<64;seed++){
 r.c.window.badilakDirectoryRotation.restore({seed});
 const ids=r.ids();assert.deepEqual(ids.slice().sort(),all,'No lost, added or duplicate records');
 assert.deepEqual(ids,r.ids(),'Repeated renders keep the same visit order');
 assert.deepEqual(ids,r.get("orderDirectoryDiscoveryCards(discoveryIndex.slice().reverse(),'').map(e=>e.id)"),'Input order does not affect the visit');
 for(const cat of categories){
  const group=r.get(`orderDirectoryDiscoveryCards(discoveryIndex,'').filter(e=>discoveryPrimaryCategory(e)==='${cat}').map(e=>e.id)`);
  assert.deepEqual(group.slice(0,2),preview[cat].slice(0,2),'Two familiar examples remain');
  seen[cat].add(group[2]);
 }
}
for(const cat of categories){const n=r.get(`discoveryIndex.filter(e=>discoveryPrimaryCategory(e)==='${cat}').length`);assert.equal(seen[cat].size,n-2,'Every other resource can reach the third slot in '+cat);}
r.c.window.badilakDirectoryRotation.restore({seed:8});
const previous=r.ids(),saved=r.c.window.badilakDirectoryRotation.capture();
r.run("initializedJourneyPanels.add('directory');directoryVisible=36");
r.c.window.badilakDirectoryRotation.enter();
assert.notDeepEqual(r.ids(),previous,'New visit refreshes examples');
assert.equal(r.get('directoryVisible'),18,'New visit starts with three per category');
assert.equal(r.get('renders'),1);
r.c.window.badilakDirectoryRotation.restore(saved);
assert.deepEqual(r.ids(),previous,'Restoring history restores exact order');
const cloned=r.c.window.badilakDirectoryRotation.capture();cloned.seed=999;
assert.deepEqual(r.ids(),previous,'Snapshots do not expose mutable state');
assert.deepEqual(runtime(saved).ids(),previous,'Reload resumes the saved order');
for(const state of [null,{}, {seed:-1},{seed:4294967296},{seed:'1'}])r.c.window.badilakDirectoryRotation.restore(state);
assert.deepEqual(r.ids(),previous,'Invalid history state is ignored');
const query='دفترة',matches=r.get(`searchDiscoveryEntries(discoveryIndex,${JSON.stringify(query)})`);
assert.deepEqual(r.get(`orderDirectoryDiscoveryCards(searchDiscoveryEntries(discoveryIndex,${JSON.stringify(query)}),${JSON.stringify(query)})`),matches,'Search relevance is unchanged');
r.search.value=query;r.c.window.badilakDirectoryRotation.enter();
assert.deepEqual(r.c.window.badilakDirectoryRotation.capture(),saved,'Search does not advance rotation');
r.search.value='';r.run("filter='work'");r.c.window.badilakDirectoryRotation.enter();
assert.deepEqual(r.c.window.badilakDirectoryRotation.capture(),saved,'Category browsing does not advance rotation');
const list="discoveryIndex.filter(e=>discoveryPrimaryCategory(e)==='work')";
assert.deepEqual(r.get(`orderDirectoryDiscoveryCards(${list},'').map(e=>e.id)`),r.get(`${list}.sort((a,b)=>(a.directory?.name||a.learning.name).localeCompare(b.directory?.name||b.learning.name,'ar')||a.id.localeCompare(b.id)).map(e=>e.id)`),'Specific category stays alphabetical');
r.run("filter='all';discoveryPath='store'");r.c.window.badilakDirectoryRotation.enter();
assert.deepEqual(r.c.window.badilakDirectoryRotation.capture(),saved,'Need-based journey does not advance rotation');
const fallback=runtime(null,true);fallback.c.window.badilakDirectoryRotation.enter();assert.equal(fallback.c.window.badilakDirectoryRotation.capture().seed,1,'Blocked storage still works in memory');
assert(!app.slice(app.indexOf('function showMoreDirectory'),app.indexOf('function resetLearningLimit')).includes('beginDirectoryDiscoveryVisit'),'More does not start another visit');
console.log('PASS: six groups retain membership and two anchors; one slot cycles; visit/reload/history stable; search/category/path ordering preserved; blocked storage safe.');
