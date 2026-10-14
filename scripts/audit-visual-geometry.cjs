'use strict';
// Scope guard for the 2026-10-14 visual repair, independent of older design baselines.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),baseline='9f330250b81b4941ae4b9133b6a54894b5385318';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const before=file=>execFileSync('git',['show',baseline+':'+file],{cwd:root,encoding:'utf8'});
const protectedFiles=execFileSync('git',['ls-tree','-r','--name-only',baseline],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(file=>/^(js\/|data\/|guides\/)/.test(file)||['site.config.json','vercel.json','favicon.ico'].includes(file));
for(const file of protectedFiles){
 const now=fs.readFileSync(path.join(root,file));
 const old=execFileSync('git',['show',baseline+':'+file],{cwd:root});
 assert.ok(now.equals(old),'Protected content/data/behavior changed: '+file);
}
const oldIcon='<img src="https://www.google.com/s2/favicons?sz=256&domain_url=https://wuilt.com" alt="">';
const fallback='<span class="commercial-demo-initial" aria-hidden="true">و</span>';
assert.equal(read('index.html'),before('index.html').replaceAll(oldIcon,fallback),'Homepage changed outside two decorative image fallbacks');
const body=html=>html.split('</head>')[1];
const normalThumbs=html=>html.replace(/(<img class="guide-cover"[^>]*>)/g,tag=>tag.replace(/-(?:cover|thumb)\.webp/g,'-cover.webp').replace(/width="\d+"/,'width="1200"').replace(/height="\d+"/,'height="675"').replace(/loading="(?:eager|lazy)"/,'loading="lazy"'));
assert.equal(normalThumbs(body(read('guides.html'))),body(before('guides.html')),'Reading hub copy, order, links or semantics changed');
const hub=read('dist/guides.html');
const schema=JSON.parse(hub.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
const cards=[...hub.matchAll(/<a class="card" href="([^"]+)">[\s\S]*?<h3>([^<]+)<\/h3>/g)];
assert.equal(cards.length,20);assert.equal(schema.mainEntity.numberOfItems,20);
assert.deepEqual(schema.mainEntity.itemListElement.map(item=>[new URL(item.url).pathname,item.name]),cards.map(card=>[card[1],card[2]]),'Structured reading list differs from visible list');
assert.equal([...hub.matchAll(/class="guide-cover"[^>]*loading="eager"/g)].length,3,'Only first row should load eagerly');
for(const file of fs.readdirSync(path.join(root,'dist/category'))){
 assert.match(read('dist/category/'+file),/<h1 id="journeyResultTitle">[^<]+<\/h1>/,'Direct category needs a visible main heading');
}
const outputText=fs.readdirSync(path.join(root,'dist'),{recursive:true}).filter(file=>/\.(html|css|js)$/.test(file)).map(file=>read('dist/'+file)).join('\n');
for(const match of outputText.matchAll(/(?:\/images\/(?:brand|social)\/)[a-zA-Z0-9._-]+/g))assert.ok(fs.existsSync(path.join(root,'dist',match[0])),'Retired a referenced asset: '+match[0]);
console.log(`PASS: ${protectedFiles.length} protected files byte-identical; homepage limited to two image fallbacks; all 20 reading cards/copy/links/order intact; schema matches visible list; category headings and shared artwork paths valid.`);
