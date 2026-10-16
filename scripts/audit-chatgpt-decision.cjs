'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const baseline='16fda046968a21da1b4fef44becef28a6319d8ef';
const read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',baseline+':'+f],{encoding:'utf8'});
function load(renderer){const c=vm.createContext({window:{}});vm.runInContext(read('js/catalog-data.js')+'\n'+renderer,c);return c;}
const now=load(read('js/detail-renderers.js')),before=load(old('js/detail-renderers.js'));
const all=vm.runInContext('items',now),target=new Set(['karnak','fanar','falcon','arabicai']);
for(const x of all){
 for(const origin of [null,...x.origin])assert.equal(now.directoryCardMarkup(x,origin),before.directoryCardMarkup(x,origin),'Card unchanged: '+x.id);
 for(const standalone of [false,true]){
  const a=now.directoryDetailMarkup(x,standalone),b=before.directoryDetailMarkup(x,standalone);
  if(!target.has(x.id)){assert.equal(a,b,'Other details unchanged: '+x.id);continue;}
  const fragment=c=>{let s=c.directoryDiscoveryMarkup(x,standalone).replace(/<(\/?)h4\b/g,'<$1h2');return standalone?s.replace(/ onclick="[^"]*"/g,''):s;};
  assert.ok(a.includes(fragment(now)));assert.ok(b.includes(fragment(before)));
  assert.equal(a.replace(fragment(now),''),b.replace(fragment(before),''),'Original details preserved: '+x.id);
  for(const id of target)if(id!==x.id)assert.ok(a.includes('/discover/'+id),'Other path reachable');
  assert.ok(a.includes('لم نجر اختبار أداء مستقلًا'));
  if(standalone){assert.doesNotMatch(a,/onclick=/);assert.ok(read('dist/discover/'+x.id+'.html').includes(a));}
 }
}
const app=read('js/app.js'),previous=old('js/app.js');const added=app.split('\n').filter(l=>l.startsWith(" if(origin==='chatgpt')return "));assert.equal(added.length,1);assert.equal(app.replace(added[0]+'\n',''),previous,'No other application behavior changed');
for(const f of ['js/catalog-data.js','index.html','js/commercial-links.js','js/feedback.js','site.config.json','vercel.json',...fs.readdirSync('guides').filter(f=>f.endsWith('.html')).map(f=>'guides/'+f)])assert.equal(read(f),old(f),'Protected: '+f);
console.log('PASS: 94 card templates preserved; 90 non-target details identical; four targeted comparisons only; all article sources and other app behavior unchanged.');
