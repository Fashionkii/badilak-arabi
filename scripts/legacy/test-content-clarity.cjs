'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
// This tree is the published f71c729 baseline; it is identical in local and remote Git.
const base='e53ab29387989997f4a4eb9d4b5d46fefd0ae3e5';
const read=f=>fs.readFileSync(f,'utf8'),old=f=>execFileSync('git',['show',base+':'+f],{encoding:'utf8'});
const load=reader=>{
 const c=vm.createContext({window:{},URL,Intl,Date});
 for(const f of ['js/catalog-data.js','js/detail-renderers.js','js/directory-search.js','js/discovery-paths.js','js/discovery-index.js','js/news-data.js'])vm.runInContext(reader(f),c);
 vm.runInContext("let filter='all',subfilter='all',originFilter=null,countryFilter=null;",c);
 const app=reader('js/app.js');
 vm.runInContext(app.match(/const learningDisplaySummaries=\{[\s\S]*?\n\};/)[0]+"function learningGuideLinkMarkup(id,detail=false){return guideLinkMarkup(learningGuideMap[id],detail)}",c);
 return c;
};
const before=load(old),after=load(read),get=(code,c=after)=>JSON.parse(vm.runInContext('JSON.stringify('+code+')',c));
const scope=get('contentClarity');assert.equal(scope.cards.length,74);assert.equal(scope.news.length,5);assert.equal(scope.articles.length,11);
const links=html=>[...new Set([...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]))].sort();
const actions=html=>[...html.matchAll(/onclick="([^"]+)"/g)].map(m=>m[1]);
for(const key of ['items','learning','practicalTrials','trialDecisionComplements','discoveryPairs','discoveryRelations','badilakNews'])assert.deepEqual(get(key),get(key,before),key+' source data');
const entries=get('discoveryIndex');let changed=0;
for(const e of entries){
 const expression=`discoveryCardMarkup(discoveryIndex.find(e=>e.id===${JSON.stringify(e.id)}))`;
 const a=vm.runInContext(expression,before),b=vm.runInContext(expression,after);
 assert.deepEqual(links(b),links(a),e.id+' all card destinations');assert.deepEqual(actions(b),actions(a),e.id+' all card actions');
 if(scope.cards.includes(e.id)){assert.notEqual(b,a,e.id+' actually edited');assert(b.includes('content-concise'));assert(!b.includes('تعلّم خطوة، ثم طبّقها'));changed++;}
 else assert.equal(b,a,e.id+' unselected presentation');
}
assert(changed>=Math.ceil(entries.length/2));
const categories=[...new Set(entries.map(e=>e.directory?.cat||e.learningContexts?.[0]?.[0]||'learn'))];
for(const cat of categories){const rows=entries.filter(e=>(e.directory?.cat||e.learningContexts?.[0]?.[0]||'learn')===cat);assert(rows.filter(e=>scope.cards.includes(e.id)).length>=Math.ceil(rows.length/2),cat+' at least half');}
for(const x of get('items')){
 const a=before.directoryDetailMarkup(x,true),b=after.directoryDetailMarkup(x,true);
 assert.deepEqual(links(b),links(a),x.id+' detail links retained');
 if(!scope.cards.includes(x.id))assert.equal(b,a,x.id+' untouched detail');
 else{
  assert(!b.includes('لا ينطبق عليها تقييم جودة توليد العربية'));
  const note=after.decisionNoteFor(x);if(note)assert(b.includes(note.alert),x.id+' material restriction remains visible');
 }
}
const h1=html=>html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1];
const schema=html=>JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
for(const file of fs.readdirSync('guides').filter(f=>f.endsWith('.html'))){
 const id=file.slice(0,-5),a=old('guides/'+file),b=read('guides/'+file);
 if(!scope.articles.includes(id)){assert.equal(b,a,id+' unselected article');continue;}
 assert.notEqual(b,a,id+' edited article');assert.equal(h1(b),h1(a),id+' meaning of title');assert.deepEqual(schema(b),schema(a),id+' metadata and dates');
 assert.deepEqual(links(b).filter(x=>x.startsWith('http')),links(a).filter(x=>x.startsWith('http')),id+' original sources');
 assert(!b.includes('<section class="human-question"'));assert(!/<div class="decision">/.test(b));
 const attrs=html=>[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);assert.deepEqual(attrs(b),attrs(a),id+' imagery and attribution');
 for(const link of links(b).filter(x=>x.startsWith('#')))assert(b.includes(`id="${link.slice(1)}"`),id+' intact section navigation '+link);
 assert((b.match(/<h[1-6]\b/g)||[]).length<(a.match(/<h[1-6]\b/g)||[]).length,id+' removes redundant headings');
}
for(const n of get('badilakNews')){
 const html=read('dist/news/'+n.id+'.html'),data=schema(html);
 assert.equal(data.datePublished,n.published);assert.equal(data.dateModified,n.reviewed);assert.equal(data.citation,n.source);
 if(scope.news.includes(n.id)){
  assert(html.includes('news-article content-concise'));assert(!/<h2>/.test(html));
  for(const value of [n.change,n.audience,n.limits,n.action])assert(html.includes(vm.runInContext('discoveryEscape('+JSON.stringify(value)+')',after)),n.id+' meaningful information');
  assert.equal((html.match(/<time\b/g)||[]).length,1,n.id+' one visible date');
 }else {assert(!html.includes('news-article content-concise'));assert(html.includes('ما الذي لم نتحقق منه؟'));}
}
for(const f of ['data/article-media.json','data/privacy.json','data/disclosure.json','js/commercial-links.js','js/discovery-memory.js','js/guided-discovery.js','js/smart-return.js','site.config.json','vercel.json'])assert.equal(read(f),old(f),f+' outside editorial scope');
console.log('PASS: 74/125 cards (including every category), 5/9 news, 11/21 guides edited; untouched rows exact; original facts/dates/sources/images/actions and material restrictions preserved.');
