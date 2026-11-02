'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const base='eea149be3b02e9543ed57006caecc699ad790beb';
const read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',base+':'+f],{encoding:'utf8'});
function load(reader){
 const c=vm.createContext({window:{},URL});
 for(const f of ['js/catalog-data.js','js/detail-renderers.js','js/directory-search.js','js/discovery-paths.js','js/discovery-index.js'])vm.runInContext(reader(f),c);
 const app=reader('js/app.js');
 vm.runInContext(app.slice(app.indexOf('function learningDecisionNoteFor'),app.indexOf('function learningDecisionCardMarkup')),c);
 return c;
}
const now=load(read),before=load(old),get=(s,c=now)=>JSON.parse(vm.runInContext('JSON.stringify('+s+')',c));
const results=q=>get(`searchDiscoveryEntries(discoveryIndex,${JSON.stringify(q)}).map(e=>e.id)`);
assert.deepEqual(results('Canva').sort(),['arabicdesign','dhawwi','taqreer']);
assert.deepEqual(results('cAnVa'),results('Canva'));
assert.deepEqual(results('  Canva  '),results('Canva'));
assert.deepEqual(results('Canva عروض'),['taqreer']);
assert.deepEqual(results('a-service-that-does-not-exist'),[]);
for(const id of get('Object.keys(originRouteMap)')){
 const expected=get(`items.filter(x=>matchesDirectoryOrigin(x,${JSON.stringify(id)})).map(x=>x.id)`);
 const actual=results(now.originName(id));
 for(const item of expected)assert(actual.includes(item),id+' -> '+item);
}
for(const e of get('discoveryIndex')){
 const name=e.directory?.name||e.learning.name;
 assert(results(name).includes(e.id),'Name still searchable: '+name);
}
for(const x of get('learning')){
 const note=now.learningDecisionNoteFor(x);
 if(x.type==='resource'){
  assert(!note.alert.includes('القناة'),'Resource must not be described as a channel');
  assert(!note.action.includes('قائمة تشغيل'),'Resource task must not assume a playlist');
 }else assert.deepEqual(JSON.parse(JSON.stringify(note)),JSON.parse(JSON.stringify(before.learningDecisionNoteFor(x))),x.id+' existing caution');
}
const actions=s=>s.match(/const learningActions\s*=\s*({[\s\S]*?\n});/)[1];
assert.equal(actions(read('js/app.js')),actions(old('js/app.js')),'36 specific learning actions preserved');
const withoutStyles=s=>s.replace(/st\.textContent=`[\s\S]*?`;/,'st.textContent="[presentation]";');
assert.equal(withoutStyles(read('js/smart-return.js')),withoutStyles(old('js/smart-return.js')),'Return/history logic preserved');
for(const f of ['index.html','js/catalog-data.js','js/detail-renderers.js','js/discovery-memory.js','js/discovery-index.js','js/outbound-choice.js','js/feedback-config.js','site.config.json','vercel.json','data/privacy.json','data/disclosure.json'])assert.equal(read(f),old(f),f+' protected');
console.log('PASS: Canva 3 matches, familiar-service task links, mixed query, all 125 resource names; source-specific learning cautions, 36 actions and navigation logic preserved.');
