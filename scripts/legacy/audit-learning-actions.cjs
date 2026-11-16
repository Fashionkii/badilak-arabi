'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{execFileSync}=require('child_process');
const base='d51cf5483ae4221047cde7d9f5670ce1bec26233';
const read=p=>fs.readFileSync(p,'utf8'),old=p=>execFileSync('git',['show',base+':'+p],{encoding:'utf8'});
function load(reader){const c=vm.createContext({window:{}}),app=reader('js/app.js');vm.runInContext(reader('js/catalog-data.js')+'\n'+reader('js/detail-renderers.js')+'\n'+app.slice(app.indexOf('function learningDecisionNoteFor'),app.indexOf('function openDiscoveryGroup')),c);return c;}
const now=load(read),before=load(old),learning=vm.runInContext('learning',now),items=vm.runInContext('items',now);
assert.equal(learning.length,36);assert.equal(vm.runInContext('Object.keys(learningActions).length',now),36);
for(const x of learning){const panel=now.learningDecisionPanelMarkup(x),prior=before.learningDecisionPanelMarkup(x);assert.ok(panel.includes(vm.runInContext('learningActions',now)[x.id]));assert.equal(JSON.stringify(now.learningDecisionNoteFor(x)),JSON.stringify(before.learningDecisionNoteFor(x)));assert.equal(panel.replace(/<span>.*?<\/span>/s,''),prior.replace(/<span>.*?<\/span>/s,''));}
assert.equal(items.filter(x=>now.hasPracticalTrial(x)).length,52);
const added=['almaany','dubaifuture','kezakoo','telmidtice'];
for(const x of items){if(!added.includes(x.id)){assert.equal(now.practicalTrialMarkup(x),before.practicalTrialMarkup(x));continue;}assert.equal(before.practicalTrialMarkup(x),'');for(const standalone of [true,false])assert.equal((now.directoryDetailMarkup(x,standalone).match(/class="detail-task-comparison practical-trial"/g)||[]).length,1);assert.ok(read('dist/discover/'+x.id+'.html').includes('جرّبه على مهمتك'));}
const app=read('js/app.js').replace(/\/\/ Editorial starting steps[^]*?(?=function learningDecisionPanelMarkup)/,'').replace('${learningActions[x.id]||n.action}','${n.action}');assert.equal(app,old('js/app.js'));
for(const f of ['js/catalog-data.js','index.html','site.config.json','js/outbound-choice.js','css/cosmic-theme.css'])assert.equal(read(f),old(f),f+' protected');
console.log('PASS: 36 specific learning actions; old alerts, comparison logic, links and UI preserved; 48 old trials unchanged; 4 new trials in interactive and static details.');
