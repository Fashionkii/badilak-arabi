/* Portable static output for Vercel or Cloudflare Pages. Node built-ins only. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'dist');
const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8'));
const parsedOrigin=new URL(config.canonicalOrigin);
if(parsedOrigin.protocol!=='https:'||parsedOrigin.origin!==config.canonicalOrigin)throw new Error('canonicalOrigin must be one HTTPS origin without a trailing slash.');
// Launch requires a deliberate reviewed change; an environment variable cannot open indexing.
if(config.phase!=='prelaunch')throw new Error('Only prelaunch builds are enabled. Launch needs an explicit reviewed indexing change.');
const origin=config.canonicalOrigin;
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root,'js/catalog-data.js'),'utf8'),context);
context.window=context;
// Register the existing commercial resolver without running browser DOM enhancement.
context.document={readyState:'loading',addEventListener(){}};
vm.runInContext(fs.readFileSync(path.join(root,'js/commercial-links.js'),'utf8'),context);
delete context.document;
vm.runInContext(fs.readFileSync(path.join(root,'js/detail-renderers.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'js/route-seo.js'),'utf8'),context);
const {items,categoryNames}=vm.runInContext('({items,categoryNames})',context);
const seo=context.badilakSEO;
const ids=new Set();
for(const x of items){
 if(!/^[a-z0-9-]+$/.test(x.id)||ids.has(x.id))throw new Error('Invalid or duplicate item id: '+x.id);
 ids.add(x.id);
 if(!seo.categories().includes(x.cat))throw new Error('Unknown category: '+x.cat);
}
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
// Source photos remain in git for regeneration; visitors need covers/social images only.
const media=JSON.parse(fs.readFileSync(path.join(root,'data/article-media.json'),'utf8'));
const sourcePhotos=new Set(Object.values(media.articles).map(x=>path.join(root,x.photo)));
for(const dir of ['css','js','images','guides'])fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true,filter:source=>!sourcePhotos.has(source)});
for(const file of ['index.html','guides.html','design-lab.html'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.mkdirSync(path.join(out,'docs'),{recursive:true});
for(const file of [
 'DESIGN-LAB-HANDOFF-2026-10-08.md',
 'DESIGN-SYNTHESIS-2026-10-08.md',
 'DESIGN-TOKENS-2026-10-08.md',
 'COMPONENT-SPECS-2026-10-08.md',
 'RESPONSIVE-RTL-INTERACTIONS-2026-10-08.md',
 'ADS-PLACEMENTS-2026-10-08.md',
 'ACCEPTANCE-TESTS-2026-10-08.md',
 'VISUAL-ASSET-SYSTEM-2026-10-08.md'
])fs.copyFileSync(path.join(root,'docs',file),path.join(out,'docs',file));
const escape=seo.escape;
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const oldOrigin='https://badilak-arabi.vercel.app';
function prepare(html){
 html=html.split(oldOrigin).join(origin);
 if(!html.includes('/css/design-lab.css')) html=html.replace('</head>','<link rel="stylesheet" href="/css/design-lab.css">\\n</head>');
 html=html.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi,'');
 html=html.replace(/<head>/i,'<head>\n<meta name="robots" content="noindex,nofollow">\n<meta name="badilak:origin" content="'+escape(origin)+'">');
 // Real organization URL; do not invent authors, publication dates or ratings.
 html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(all,start,body,end)=>{
  const data=JSON.parse(body);
  if(data['@type']==='Article'){
   if(data.author?.['@type']==='Organization'&&data.author.name==='بديلك عربي')data.author.url=origin+'/';
   if(data.publisher?.['@type']==='Organization'&&data.publisher.name==='بديلك عربي')data.publisher.url=origin+'/';
  }
  return start+json(data)+end;
 });
 return html;
}
function setPageHead(html,page){
 if(page.kind==='category'||page.kind==='item')html=html.replace('data-journey="home"','data-journey="directory"');
 if(page.kind==='item')html=html.replace('<body class="guided-discovery"','<body class="guided-discovery lock"');
 html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(page.title)+'</title>');
 html=html.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+escape(page.description)+'">');
 html=html.replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+escape(page.url)+'">');
 for(const key of ['og:title','twitter:title','og:description','twitter:description','og:url']){
  const val=key.endsWith('title')?page.title:key.endsWith('description')?page.description:page.url;
  html=html.replace(new RegExp('(<meta (?:property|name)="'+key+'" content=")[^"]*(">)'),(_,a,b)=>a+escape(val)+b);
 }
 html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,'<script type="application/ld+json">'+json(page.schema)+'</script>');
 return html;
}
function write(file,html){fs.mkdirSync(path.dirname(path.join(out,file)),{recursive:true});fs.writeFileSync(path.join(out,file),html);}
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
write('index.html',setPageHead(prepare(source),seo.metadata('/',origin)));
write('guides.html',prepare(fs.readFileSync(path.join(root,'guides.html'),'utf8')));
const guides=fs.readdirSync(path.join(root,'guides')).filter(x=>x.endsWith('.html'));
for(const file of guides)write('guides/'+file,prepare(fs.readFileSync(path.join(root,'guides',file),'utf8')));
for(const x of items){
 const page=seo.metadata('/discover/'+x.id,origin);
 let html=setPageHead(prepare(source),page);
 html=html.replace('<div class="modal-body" id="modalBody"></div>','<div class="modal-body" id="modalBody">'+seo.staticItem(x)+'</div>');
 html=html.replace('class="modal" id="detailModal"','class="modal show" id="detailModal"');
 html=html.replace('<button class="close" aria-label="إغلاق التفاصيل" onclick="closeModal()">×</button>',`<a class="close" href="/category/${escape(x.cat)}" aria-label="إغلاق التفاصيل" onclick="closeModal();return false">×</a>`);
 html=html.replace('</head>','<style>.modal-head a.close{text-decoration:none;text-align:center}</style></head>');
 write('discover/'+x.id+'.html',html);
}
for(const id of seo.categories()){
 const page=seo.metadata('/category/'+id,origin);
 let html=setPageHead(prepare(source),page);
 html=html.replace('<div id="routeIndex" hidden></div>','<div id="routeIndex">'+seo.categoryIndex(id)+'</div>');
 html=html.replace(/(<div[^>]+id="catalogGrid"[^>]*>)[\s\S]*?<\/div>/,'$1'+seo.staticCards(id)+'</div>');
 html=html.replace('<h2 id="journeyResultTitle">اكتشف حسب حاجتك</h2>','<h2 id="journeyResultTitle">'+escape(categoryNames[id])+'</h2>');
 write('category/'+id+'.html',html);
}
write('404.html',`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, follow"><title>الصفحة غير موجودة — بديلك عربي</title><link rel="stylesheet" href="/css/app.css"></head><body><main class="wrap" style="padding:60px 0"><h1>الصفحة غير موجودة</h1><p>قد يكون الرابط غير صحيح. يمكنك العودة إلى الدليل أو مركز القراءة.</p><a href="/">الرئيسية</a> · <a href="/guides">مركز القراءة</a></main></body></html>`);
// Crawlers must be allowed to read noindex. Disallow:/ would hide that instruction.
write('robots.txt','# Prelaunch: indexing is blocked by X-Robots-Tag and HTML meta tags.\nUser-agent: *\nAllow: /\n');
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
write('_headers','/*\n  X-Robots-Tag: noindex, follow\n');
const vercel=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
// Keep legacy .html aliases too: those deleted files need explicit redirects.
write('_redirects',vercel.redirects.map(x=>`${x.source} ${x.destination} ${x.permanent?301:302}`).join('\n')+'\n');
// A custom 404 disables the SPA fallback on Cloudflare Pages; no wildcard rewrites.
console.log(`Built ${items.length} discovery pages, ${seo.categories().length} category pages, ${guides.length} articles. All are noindex; sitemap intentionally empty.`);
