'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{execFileSync}=require('child_process');
const base='e8a8ddc',read=p=>fs.readFileSync(p,'utf8'),old=p=>execFileSync('git',['show',base+':'+p],{encoding:'utf8'});
function load(reader){const c=vm.createContext({window:{}});vm.runInContext(reader('js/catalog-data.js')+'\n'+reader('js/detail-renderers.js'),c);return c;}
const now=load(read),before=load(old),items=vm.runInContext('items',now),covered=items.filter(x=>now.hasPracticalTrial(x));
assert.equal(covered.length,48);
const text=html=>html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
assert.equal(text(now.practicalTrialMarkup(items.find(x=>x.id==='karnak'))),text(before.practicalTrialMarkup(items.find(x=>x.id==='karnak'))));
for(const x of items){
 const trial=now.practicalTrialMarkup(x);
 for(const standalone of [true,false]){
 const next=now.directoryDetailMarkup(x,standalone),prev=before.directoryDetailMarkup(x,standalone);
 if(!trial){assert.equal(text(next.replace(/<span class="trial-available">تجربة عملية<\/span>/g,'')),text(prev),x.id+' unchanged detail');continue;}
 assert.equal((next.match(/class="detail-task-comparison practical-trial"/g)||[]).length,1,x.id+' trial once');
 assert.ok(next.indexOf('practical-trial')<next.indexOf('detail-facts'),x.id+' above facts');
 assert.match(next,/<details class="detail-task-comparison practical-trial" open>/);
 assert.match(now.directoryCardMarkup(x),/معلومات وتجربة/);
 assert.ok(fs.readFileSync('dist/discover/'+x.id+'.html','utf8').includes('جرّبه على مهمتك'));
 }
 if(!trial)assert.equal(now.directoryCardMarkup(x),before.directoryCardMarkup(x));
}
for(const f of ['index.html','js/app.js','js/catalog-data.js','js/guided-discovery.js','css/cosmic-theme.css','site.config.json',...fs.readdirSync('guides').filter(f=>f.endsWith('.html')).map(f=>'guides/'+f)])assert.equal(read(f),old(f),f+' protected');
console.log('PASS: 48 trials in interactive/static details; Karnak text preserved; non-trial cards/details protected; home, rotation, catalog and articles unchanged.');
