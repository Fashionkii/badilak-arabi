'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const files=fs.readdirSync(out,{recursive:true}).filter(x=>x.endsWith('.html'));
const canonical=new Set();
for(const file of files){
 const html=fs.readFileSync(path.join(out,file),'utf8');
 assert.match(html,/<meta name="robots" content="noindex,[^"]*">/,file);
 if(file==='404.html')continue;
 const url=html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
 assert.ok(url&&!canonical.has(url),'Missing/duplicate canonical: '+file);canonical.add(url);
 assert.match(html,/<title>[^<]+<\/title>/,file);
 assert.match(html,/<meta name="description" content="[^"]+">/,file);
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)){
  const url=match[1].split(/[?#]/)[0];if(url==='/')continue;
  const target=path.join(out,url);
  assert.ok(fs.existsSync(target)||fs.existsSync(target+'.html'),'Broken local path: '+file+' -> '+url);
 }
 if(file.startsWith('discover/')){
  assert.match(html,/<article class="standalone-detail">\s*<div class="detail-overview">[\s\S]*?<h1 class="quick-title"/,file);
  assert.ok(!html.includes('id="detailModal"')&&!html.includes('/js/app.js'),'Direct service must be readable without the homepage runtime: '+file);
  assert.ok(!/ onclick=/.test(html),'Standalone links must work without JavaScript: '+file);
  assert.match(html,/<a class="destination-link" href="https:\/\//,file);
 }
}
const articleFiles=fs.readdirSync(path.join(root,'guides')).filter(x=>x.endsWith('.html'));
for(const file of articleFiles){
 const body=s=>s.match(/<body[\s\S]*<\/body>/)[0];
 assert.equal(body(fs.readFileSync(path.join(root,'guides',file),'utf8')),body(fs.readFileSync(path.join(out,'guides',file),'utf8')),'Article changed: '+file);
}
assert.ok(!fs.readFileSync(path.join(out,'sitemap.xml'),'utf8').includes('<loc>'),'Prelaunch sitemap must remain empty');
assert.match(fs.readFileSync(path.join(out,'_headers'),'utf8'),/X-Robots-Tag: noindex, follow/);
assert.ok(!fs.readFileSync(path.join(out,'robots.txt'),'utf8').includes('Disallow: /'));
const redirects=fs.readFileSync(path.join(out,'_redirects'),'utf8');
for(const rule of JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8')).redirects)assert.ok(redirects.includes(`${rule.source} ${rule.destination} ${rule.permanent?301:302}\n`),'Missing portable redirect: '+rule.source);
if(process.argv[2]){
 const ref=process.argv[2];
 for(const file of ['js/catalog-data.js','js/commercial-links.js','js/discovery-memory.js'])assert.equal(fs.readFileSync(path.join(root,file),'utf8'),execFileSync('git',['show',ref+':'+file],{cwd:root,encoding:'utf8'}),'Protected data/behavior changed: '+file);
 const before=execFileSync('git',['show',ref+':index.html'],{cwd:root,encoding:'utf8'}).replace(/ data-journey-panel="[^"]*"/g,''),after=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/ data-journey-panel="[^"]*"/g,'');
 for(const file of articleFiles){
  const article=s=>s.match(/<article\b[^>]*>[\s\S]*?<\/article>/)[0];
  assert.equal(article(fs.readFileSync(path.join(root,'guides',file),'utf8')),article(execFileSync('git',['show',ref+':guides/'+file],{cwd:root,encoding:'utf8'})),'Article copy changed: '+file);
 }
 for(const marker of ['<section class="commercial-demo-wrap','<section class="ad-demo-wrap ad-demo-end']){
  const section=s=>s.slice(s.indexOf(marker),s.indexOf('</section>',s.indexOf(marker))+10);assert.equal(section(before),section(after),marker);
 }
 const ad=s=>s.match(/<a class="ad-demo ad-demo-display"[\s\S]*?<\/a>/)[0];assert.equal(ad(before),ad(after),'Salla reserved ad');
}
console.log(`PASS: ${files.length} HTML files; noindex, unique canonicals, JSON-LD, local links, static details, ${articleFiles.length} unchanged article bodies, prelaunch robots/sitemap and protected baseline data.`);
