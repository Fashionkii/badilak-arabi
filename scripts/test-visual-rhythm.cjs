'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const read=f=>fs.readFileSync(f,'utf8');
const base='a6f0d06fee10df6e1964cf887766ebbbeca45d57';
const old=f=>execFileSync('git',['show',base+':'+f],{encoding:'utf8'});
const protectedChanges=execFileSync('git',['diff','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(f=>f!=='data/editorial-card-titles.json'&&/^(guides\/|images\/|api\/|server\/|private\/|studio\/|data\/|js\/(catalog-data|detail-renderers|discovery-index|discovery-memory|guided-discovery|smart-return|news-data|commercial-links)|site.config.json|vercel.json)/.test(f));
assert.deepEqual(protectedChanges,[],'original sources including binary artwork preserved');
const media=s=>s.match(/<!-- article-media:start -->[\s\S]*?<!-- article-media:end -->/)[0];
for(const f of fs.readdirSync('guides').filter(f=>f.endsWith('.html'))){
 const source=read('guides/'+f),html=read('dist/guides/'+f);
 assert.equal(media(html),media(source),f+' exact image and attribution');
 assert(html.indexOf('class="quick-answer"')<html.indexOf('class="article-cover"'),f+' summary before image');
 assert(html.indexOf('class="jumpbar"')<html.indexOf('class="article-cover"'),f+' outline before image');
 const h1=s=>s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1];assert.equal(h1(html),h1(source),f+' full headline');
 for(const m of html.matchAll(/href="#([^"]+)"/g))assert(html.includes(`id="${m[1]}"`),f+' anchor '+m[1]);
}
const index=require('./editorial-index.cjs');
const vm=require('node:vm'),c=vm.createContext({});vm.runInContext(read('js/news-data.js'),c);
const rows=index(process.cwd(),vm.runInContext('badilakNews',c)).rows;
assert.equal(rows.length,30);
const hub=read('dist/guides.html');
const escape=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
for(const row of rows){
 assert(row.cardTitle.length<=row.title.length,row.id+' concise title');
 assert(hub.includes('<h3>'+escape(row.cardTitle)+'</h3>'),row.id+' display title');
 assert(hub.includes('aria-label="'+escape(row.title)+'"'),row.id+' full accessible headline');
 assert(hub.includes('href="'+row.url+'"'),row.id+' same destination');
}
const handlers=s=>[...s.matchAll(/(?:onclick|onchange|oninput)="[^"]*"/g)].map(m=>m[0]).sort();
assert.deepEqual(handlers(read('index.html')),handlers(old('index.html')),'all original controls retain their handlers');
console.log('PASS: all original article/resource/news/media/settings sources preserved; 21 summaries before their credited cover; 30 concise display titles retain full headlines and destinations; discovery handlers intact.');
