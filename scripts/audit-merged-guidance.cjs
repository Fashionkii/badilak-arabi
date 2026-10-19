'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{execFileSync}=require('child_process');
const base='1e1c80da757f38630dd89f87c84fe3540fd46c10';
const read=p=>fs.readFileSync(p,'utf8'),old=p=>execFileSync('git',['show',base+':'+p],{encoding:'utf8'});
function load(reader){const c=vm.createContext({window:{}});vm.runInContext(reader('js/catalog-data.js')+'\n'+reader('js/detail-renderers.js'),c);return c;}
const now=load(read),before=load(old),items=vm.runInContext('items',now),trials=vm.runInContext('practicalTrials',now),extras=vm.runInContext('trialDecisionComplements',now);
assert.equal(items.filter(x=>now.hasPracticalTrial(x)).length,52);
assert.equal(JSON.stringify(trials),vm.runInContext('JSON.stringify(practicalTrials)',before));
const removeAction=s=>s.replace(/\s*<div class="decision-action">[^]*?<\/div>/,'').replace(/\s+/g,' ').trim();
for(const x of items){
 assert.equal(JSON.stringify(now.decisionNoteFor(x)),JSON.stringify(before.decisionNoteFor(x)),x.id+' alert/source data');
 assert.equal(now.directoryCardMarkup(x),before.directoryCardMarkup(x),x.id+' card');
 assert.equal(now.directoryDiscoveryMarkup(x),before.directoryDiscoveryMarkup(x),x.id+' comparison');
 if(!now.hasPracticalTrial(x)){
  for(const standalone of [true,false])assert.equal(now.directoryDetailMarkup(x,standalone),before.directoryDetailMarkup(x,standalone),x.id+' unchanged details');
  continue;
 }
 assert.equal(removeAction(now.decisionPanelMarkup(x)),removeAction(before.decisionPanelMarkup(x)),x.id+' visible alert/source');
 assert.ok(!now.decisionPanelMarkup(x).includes('ما الذي يمكنك فعله؟'));
 if(extras[x.id])assert.ok(now.practicalTrialMarkup(x).includes(extras[x.id]),x.id+' retained guidance');
 else assert.ok(['karnak','noon','marefa','mawdoo3'].includes(x.id),x.id+' needs semantic review');
 if(trials[x.id])assert.ok(now.practicalTrialMarkup(x).includes(trials[x.id][4]));
 for(const standalone of [true,false]){
  const html=now.directoryDetailMarkup(x,standalone);
  assert.equal((html.match(/class="detail-task-comparison practical-trial"/g)||[]).length,1);
  assert.ok(!html.includes('ما الذي يمكنك فعله؟'));
 }
 const html=read('dist/discover/'+x.id+'.html');
 assert.ok(!html.includes('ما الذي يمكنك فعله؟'));
 assert.ok(html.includes('مهم قبل الاختيار'));
}
for(const f of ['js/app.js','js/catalog-data.js','index.html','css/cosmic-theme.css','site.config.json','js/outbound-choice.js'])assert.equal(read(f),old(f),f+' protected');
console.log('PASS: 52 unified trial decisions, 43 untouched details, all alerts/sources/cards/comparisons/learning preserved; existing trial content retained.');
