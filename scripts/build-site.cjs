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
vm.runInContext(fs.readFileSync(path.join(root,'js/discovery-paths.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'js/discovery-index.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'js/news-data.js'),'utf8'),context);
context.badilakEditorial=require('./editorial-index.cjs')(root,vm.runInContext('badilakNews',context));
vm.runInContext(fs.readFileSync(path.join(root,'js/editorial-ui.js'),'utf8'),context);
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
for(const dir of ['css','js','images','guides','fonts'])fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true,filter:source=>!sourcePhotos.has(source)});
for(const file of ['index.html'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.writeFileSync(path.join(out,'js/editorial-index.js'),'/* Generated from article metadata and sourced news; edit the original records. */\nconst badilakEditorial='+JSON.stringify(context.badilakEditorial).replace(/</g,'\\u003c')+';\n');
fs.copyFileSync(path.join(root,'favicon.ico'),path.join(out,'favicon.ico'));
const escape=seo.escape;
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const oldOrigin='https://badilak-arabi.vercel.app';
const cosmicStyles=fs.readFileSync(path.join(root,'css/cosmic-theme.css'),'utf8');
const readingStyles=fs.readFileSync(path.join(root,'css/reading-hierarchy.css'),'utf8');
const motionStyles=fs.readFileSync(path.join(root,'css/motion-lab.css'),'utf8');
const sitePolishStyles=fs.readFileSync(path.join(root,'css/site-polish.css'),'utf8')+'\n'+fs.readFileSync(path.join(root,'css/unified-discovery.css'),'utf8');
// Keep the established request/cascade profile; the theme adds no blocking request.
fs.appendFileSync(path.join(out,'css/visual-refresh.css'),'\n'+cosmicStyles+'\n'+readingStyles+'\n'+motionStyles+'\n'+sitePolishStyles);
// Standalone pages keep every rule/order but reduce three blocking requests to one.
const siteStyles=['fonts.css','app.css','visual-refresh.css'];
fs.writeFileSync(path.join(out,'css/site-bundle.css'),siteStyles.map(file=>fs.readFileSync(path.join(root,'css',file),'utf8')).join('\n')+'\n'+cosmicStyles+'\n'+readingStyles+'\n'+motionStyles+'\n'+sitePolishStyles);
const bundleStyles=html=>html.replace(/<link rel="stylesheet" href="\/css\/fonts\.css">\s*<link rel="stylesheet" href="\/css\/app\.css">\s*<link rel="stylesheet" href="\/css\/visual-refresh\.css">/,'<link rel="stylesheet" href="/css/site-bundle.css">');
const readingNav='<a href="/">الرئيسية</a><a href="/#directory">اكتشف</a><a href="/guides" aria-current="page">اقرأ</a><a href="/#competitionIndex">المرصد</a>';
function prepare(html){
 html=html.split(oldOrigin).join(origin);
 // Update shared brand previews only; article-specific covers stay intact.
 if(/\/images\/social\/badilak-share-202610(?:12|14)\.jpg/.test(html))html=html.replace(/\/images\/social\/badilak-share-202610(?:12|14)\.jpg/g,'/images/social/badilak-share-20261016-dots.jpg').replace('<meta property="og:image:height" content="670">','<meta property="og:image:height" content="630">').replace(/(<meta property="og:image:alt" content=")[^"]*(">)/,'$1بديلك عربي — دليلك للبدائل العربية$2');
 html=html.replace('</head>','<link rel="icon" href="/favicon.ico?v=20261016" sizes="16x16 32x32 48x48">\n<link rel="icon" type="image/png" sizes="32x32" href="/images/brand/wordmark-icon-20261016-32.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/images/brand/wordmark-icon-20261016-180.png">\n</head>');
 html=html.replace(/<body([^>]*)>/,(_,attrs)=>'<body'+(/class="/.test(attrs)?attrs.replace(/class="([^"]*)"/,'class="$1 cosmic-theme"'):' class="cosmic-theme"'+attrs)+'>');
 html=html.replace(/<nav class="(?:toplinks|hubnav)"[^>]*>[\s\S]*?<\/nav>/,'<nav class="toplinks" aria-label="التنقل الرئيسي">'+readingNav+'</nav>');
 // Reviewed visual layer: enable in every build without the preview comparison script.
 html=html.replace('<body class="guided-discovery','<body class="guided-discovery motion-lab');
 // Editorial body/copy stay intact; only the shared header gets the supplied identity.
 html=html.replace(/(<a class="brand" href="\/">)بديلك عربي(<\/a>)/g,'$1<picture><img class="cosmic-logo" src="/images/brand/wordmark-header-20261016-dots-320.webp" srcset="/images/brand/wordmark-header-20261016-dots-320.webp 320w, /images/brand/wordmark-header-20261016-dots-640.webp 640w" sizes="(max-width:760px) 132px, 180px" width="1829" height="408" alt="بديلك عربي" decoding="async"></picture>$2');
 html=html.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi,'');
 html=html.replace(/<head>/i,'<head>\n<meta name="robots" content="noindex, follow, max-image-preview:large">\n<meta name="badilak:origin" content="'+escape(origin)+'">');
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
 if(page.kind==='news-article'){
  html=html.replace('<meta property="og:type" content="website">','<meta property="og:type" content="article">');
  for(const tag of ['og:image','twitter:image'])html=html.replace(new RegExp('(<meta (?:property|name)="'+tag+'" content=")[^"]*(">)'),(_,a,b)=>a+escape(page.image)+b);
  html=html.replace(/(<meta property="og:image:alt" content=")[^"]*(">)/,(_,a,b)=>a+escape(page.imageAlt)+b);
 }
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
const editorial=context.badilakEditorial;
const editorialCard=(row,options)=>context.editorialCardMarkup(row,options);
const homeEditorial=`<section class="home-editorial" aria-labelledby="homeReadingTitle"><div class="editorial-section-head"><div><h2 id="homeReadingTitle">اقرأ ما يساعدك على الاختيار</h2><p>مقالات عملية وأخبار موثقة، مرتبطة بما تبحث عنه.</p></div><a href="/guides">كل المقالات والأخبار ←</a></div><div class="home-editorial-grid">${editorial.home.map(id=>{const row=editorial.rows.find(r=>r.id===id);if(!row)throw new Error('Missing home editorial: '+id);return editorialCard(row,{image:true});}).join('')}</div></section>`;
const paths=vm.runInContext('discoveryPaths',context);
const source=fs.readFileSync(path.join(root,'index.html'),'utf8').replace('<!-- HOME_EDITORIAL -->',homeEditorial).replace('<!-- DISCOVERY_PATH_OPTIONS -->',Object.entries(paths).map(([id,p])=>`<option value="${id}">${escape(p.name)}</option>`).join('')).replace(/<time data-review-resource="([^"]+)">[^<]*<\/time>/g,(_,id)=>{const x=items.find(x=>x.id===id);if(!x?.reviewed)throw new Error('Missing review date: '+id);return `<time data-review-resource="${id}">آخر مراجعة للمورد: ${escape(x.reviewed)}</time>`;});
// Standalone routes reuse the site's header, footer, fonts and detail renderer.
// They do not ship the homepage panels or its application runtime.
const standaloneLinks=html=>html.replace(/ onclick="[^"]*"/g,'').replace(/href="#/g,'href="/#');
const standaloneHeader=standaloneLinks(source.match(/<header class="site-header">[\s\S]*?<\/header>/)[0]);
const standaloneFooter=standaloneLinks(source.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0]);
function standalonePage(page,content){
 // Direct reading pages need both body weights; share locally hosted UI fonts with home.
 const fontPreloads=['almarai-400','almarai-700','google-41f1e64ff8db','google-bf43e79904fc'].map(id=>`<link rel="preload" href="/fonts/${id}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n');
 const head=source.match(/<head>[\s\S]*?<\/head>/)[0].replace(/<script src="[^"]+" defer><\/script>\s*/g,'').replace(/<link rel="preload"[^>]+as="font"[^>]*>\s*/g,'').replace('<link rel="stylesheet" href="/css/fonts.css">',fontPreloads+'\n<link rel="stylesheet" href="/css/fonts.css">');
 const active=page.kind==='item'||page.kind==='category'?'/#directory':['news','news-article','reading'].includes(page.kind)?'/guides':null;
 const header=active?standaloneHeader.replace('href="'+active+'"','href="'+active+'" aria-current="page"'):standaloneHeader;
 const scripts=page.kind==='reading'?'<script src="/js/reading-hub.js" defer></script>':'';
 return setPageHead(prepare(bundleStyles('<!doctype html><html lang="ar" dir="rtl">'+head+'<body class="guided-discovery standalone-page'+(page.kind==='reading'?' reading-page':'')+'"><a class="skip" href="#content">انتقل إلى المحتوى</a>'+header+'<main class="standalone-main wrap" id="content">'+content+'</main>'+standaloneFooter+scripts+'<script src="/js/outbound-choice.js" defer></script><script src="/js/smart-return.js" defer></script></body></html>')),page);
}
// Prioritize the hero asset; the header has its own compact wordmark.
const home=bundleStyles(source).replace(/<link rel="preload"[^>]+as="font"[^>]*>\s*/g,'').replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>','<link rel="preload" as="image" type="image/webp" href="/images/brand/wordmark-main-20261016-dots-640.webp" imagesrcset="/images/brand/wordmark-main-20261016-dots-640.webp 640w, /images/brand/wordmark-main-20261016-dots-1080.webp 1080w" imagesizes="(max-width:1023px) 220px, 330px" fetchpriority="high">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
write('index.html',setPageHead(prepare(home),seo.metadata('/',origin)));
// Review controls exist only on isolated preview deployments, never production.
if(process.env.VERCEL_ENV==='preview'){
 write('lab/ui-review.html',fs.readFileSync(path.join(root,'preview/ui-review.html'),'utf8'));
 write('lab/screenshot-checks.js',fs.readFileSync(path.join(root,'preview/screenshot-checks.js'),'utf8'));
}
// One editorial hub. /news is the same hub with the news filter selected.
const editorialNames=vm.runInContext('editorialCategories',context);
function readingHub(newsOnly=false){
 const count=(n,one,two,many)=>n===0?`لا ${many}`:n===1?one:n===2?two:n<=10?`${n} ${many}`:`${n} ${one.replace(' واحد','')}ًا`;
 const rows=newsOnly?editorial.rows.filter(r=>r.type==='news'):editorial.rows;
 const route=newsOnly?'/news':'/guides';
 const title='اقرأ — مقالات وأخبار تساعدك على الاختيار';
 const description='مقالات للمقارنة والفهم، وأخبار موثقة عن تغييرات قد تؤثر في اختيارك.';
 const page={kind:'reading',title:title+' — بديلك عربي',description,url:origin+route,schema:{'@context':'https://schema.org','@type':'CollectionPage',name:title,url:origin+route,inLanguage:'ar',mainEntity:{'@type':'ItemList',numberOfItems:rows.length,itemListElement:rows.map((r,i)=>({'@type':'ListItem',position:i+1,url:origin+r.url,name:r.title}))}}};
 const groups=Object.entries(editorialNames).map(([id,name])=>{
  const entries=editorial.rows.filter(r=>r.category===id);if(!entries.length)return '';
  return `<section class="reading-group" data-reading-group="${id}"${newsOnly&&!entries.some(r=>r.type==='news')?' hidden':''}><h2>${name}</h2><div class="editorial-grid">${entries.map(row=>editorialCard(row,{image:true}).replace('<article ',`<article ${newsOnly&&row.type!=='news'?'hidden ':''}`)).join('')}</div></section>`;
 }).join('');
 const tabs=[['all','الكل'],['article','المقالات'],['news','الأخبار']].map(([id,label])=>`<a href="${id==='news'?'/news':'/guides'+(id==='all'?'':'?type='+id)}" data-reading-type="${id}"${id===(newsOnly?'news':'all')?' aria-current="true"':''}>${label}</a>`).join('');
 const content=fs.readFileSync(path.join(root,'guides.html'),'utf8')
  .replace('{{TYPE_FILTERS}}',tabs).replace('{{TOPIC_OPTIONS}}',Object.entries(editorialNames).map(([id,name])=>`<option value="${id}">${name}</option>`).join(''))
  .replace('{{READING_COUNT}}',newsOnly?count(rows.length,'خبر واحد','خبران','أخبار'):`${count(editorial.rows.filter(r=>r.type==='article').length,'مقال واحد','مقالان','مقالات')} · ${count(editorial.rows.filter(r=>r.type==='news').length,'خبر واحد','خبران','أخبار')}`)
  .replace('{{READING_GROUPS}}',groups);
 return standalonePage(page,content);
}
write('guides.html',readingHub());
write('news.html',readingHub(true));
const guides=fs.readdirSync(path.join(root,'guides')).filter(x=>x.endsWith('.html'));
for(const file of guides){
 const id=file.replace('.html',''),matched=Object.entries(paths).filter(([,p])=>p.guides.includes(id));
 const related=matched.length?`<!-- EDITORIAL_JOURNEY_START --><section class="article-journey" aria-label="خيارات وتعلّم في نفس الموضوع"><h2>استكشف وطبّق</h2><p>تابع إلى الأدوات ومصادر التعلّم المرتبطة بهذا الموضوع.</p><div>${matched.map(([key,p])=>`<a href="/?path=${key}#directory">${escape(p.name)} ←</a>`).join('')}</div></section><!-- EDITORIAL_JOURNEY_END -->`:'';
 write('guides/'+file,prepare(fs.readFileSync(path.join(root,'guides',file),'utf8').replace('</main>',related+'</main>')));
}
for(const x of items){
 const page=seo.metadata('/discover/'+x.id,origin);
 const trail=`<nav class="detail-breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true"> / </span><a href="/category/${escape(x.cat)}">${escape(categoryNames[x.cat])}</a><span aria-hidden="true"> / </span><span aria-current="page">${escape(x.name)}</span></nav>`;
 const html=standalonePage(page,trail+'<article class="standalone-detail">'+seo.staticItem(x)+'</article>');
 write('discover/'+x.id+'.html',html);
}
// News has its own publication/event/review dates, never a replacement for catalog review dates.
const news=vm.runInContext('badilakNews',context);
for(const n of news){
 const resource=items.find(x=>x.id===n.related);
 if(n.related&&!resource)throw new Error('News refers to a missing resource: '+n.id);
 const image=JSON.parse(fs.readFileSync(path.join(root,'data/article-media.json'),'utf8')).articles[n.imageArticle];
 if(!image)throw new Error('News image metadata missing: '+n.id);
 const page={kind:'news-article',title:n.title+' — بديلك عربي',description:n.audience,url:origin+'/news/'+n.id,image:origin+'/images/articles/'+n.imageArticle+'-social.jpg',imageAlt:image.alt,schema:{'@context':'https://schema.org','@type':'NewsArticle',headline:n.title,description:n.audience,image:[origin+'/images/articles/'+n.imageArticle+'-cover.webp'],datePublished:n.published,dateModified:n.reviewed,inLanguage:'ar',url:origin+'/news/'+n.id,citation:n.source,author:{'@type':'Organization',name:'بديلك عربي',url:origin+'/'},publisher:{'@type':'Organization',name:'بديلك عربي',url:origin+'/'}}};
 const trail='<nav class="detail-breadcrumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true"> / </span><a href="/guides">اقرأ</a><span aria-hidden="true"> / </span><a href="/guides?type=news">الأخبار</a></nav>';
 const sections=[['ما الذي تغيّر؟',n.change],['لمن قد يهم؟',n.audience],['ما الذي لم نتحقق منه؟',n.limits],['ما الخطوة المناسبة؟',n.action]];
 const dateLabel=n.eventKind||'الحدث';
 const dates=`<div class="news-date"><span>${escape(dateLabel)}: <time datetime="${n.eventDate}">${context.editorialDate(n.eventDate)}</time></span><br><span>النشر: <time datetime="${n.published}">${context.editorialDate(n.published)}</time> · مراجعة المصدر: <time datetime="${n.reviewed}">${context.editorialDate(n.reviewed)}</time></span></div>`;
 const cover=`<figure class="news-cover"><img src="/images/articles/${escape(n.imageArticle)}-cover.webp" alt="${escape(image.alt)}" width="1200" height="675" decoding="async"><figcaption>صورة تعبيرية: <a href="${escape(image.source)}" target="_blank" rel="noopener noreferrer">${escape(image.credit)}</a> · <a href="${escape(image.licenseUrl)}" target="_blank" rel="noopener noreferrer">ترخيص الصورة</a></figcaption></figure>`;
 const pathsForNews=n.paths||(n.path?[n.path]:['ai']);
 const journeyLinks=pathsForNews.map(id=>{if(!paths[id])throw new Error('Unknown news path: '+id);return `<a href="/?path=${id}#directory">${escape(paths[id].name)} ←</a>`;}).join('');
 write('news/'+n.id+'.html',standalonePage(page,trail+`<article class="news-article"><p class="news-source-kind">${escape(n.sourceKind||'إعلان الجهة')} · مراجعة تحريرية للمصدر</p><h1>${escape(n.title)}</h1><p class="news-lead">${escape(n.change)}</p>${dates}${cover}${sections.filter(([,copy])=>copy!==n.change).map(([title,copy])=>`<section><h2>${title}</h2><p>${escape(copy)}</p></section>`).join('')}<div class="news-actions"><a href="${escape(n.source)}" target="_blank" rel="noopener noreferrer">${escape(n.sourceLabel||'اقرأ إعلان الجهة')} ↗</a>${resource?`<a href="/discover/${n.related}">افتح بطاقة ${escape(resource.name)} ←</a>`:''}${journeyLinks}</div><p class="news-source-kind">الروابط هنا للتوثيق، وليست روابط عمولة. الخبر لا يمثّل تقييمًا مستقلًا لجودة المنتج.</p></article>`));
}

for(const slug of ['privacy','disclosure']){
 const entry=JSON.parse(fs.readFileSync(path.join(root,'data',slug+'.json'),'utf8'));
 const page={kind:'policy',title:entry.title+' — بديلك عربي',description:entry.description,url:origin+'/'+slug,schema:{'@context':'https://schema.org','@type':'WebPage',name:entry.title,url:origin+'/'+slug,inLanguage:'ar'}};
 write(slug+'.html',standalonePage(page,'<article class="policy-page"><h1>'+escape(entry.title)+'</h1><p class="policy-updated">آخر تحديث: '+escape(entry.updated||'8 أكتوبر 2026')+'</p>'+entry.sections.map(x=>'<section><h2>'+escape(x.title)+'</h2>'+x.html+'</section>').join('')+'</article>'));
}
for(const id of seo.categories()){
 const page=seo.metadata('/category/'+id,origin);
 let html=setPageHead(prepare(source),page);
 html=html.replace('<div id="routeIndex" hidden></div>','<div id="routeIndex">'+seo.categoryIndex(id)+'</div>');
 html=html.replace(/(<div[^>]+id="catalogGrid"[^>]*>)[\s\S]*?<\/div>/,'$1'+seo.staticCards(id)+'</div>');
 html=html.replace('<h2 id="journeyResultTitle">أداة تنجز بها، أو مصدر تتعلّم منه</h2>','<h1 id="journeyResultTitle">'+escape(categoryNames[id])+'</h1>');
 write('category/'+id+'.html',html);
}
write('404.html',prepare(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>الصفحة غير موجودة — بديلك عربي</title><link rel="stylesheet" href="/css/site-bundle.css"></head><body class="guided-discovery standalone-page"><a class="skip" href="#content">انتقل إلى المحتوى</a>${standaloneHeader}<main class="standalone-main wrap" id="content"><article class="policy-page not-found"><h1>الصفحة غير موجودة</h1><p>قد يكون الرابط غير صحيح. يمكنك العودة إلى الدليل أو مركز القراءة.</p><nav aria-label="متابعة التصفح"><a href="/">الرئيسية</a><a href="/guides">مركز القراءة</a></nav></article></main>${standaloneFooter}</body></html>`));
// Crawlers must be allowed to read noindex. Disallow:/ would hide that instruction.
write('robots.txt','# Prelaunch: indexing is blocked by X-Robots-Tag and HTML meta tags.\nUser-agent: *\nAllow: /\n');
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
write('_headers','/*\n  X-Robots-Tag: noindex, follow\n');
const vercel=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
// Keep legacy .html aliases too: those deleted files need explicit redirects.
write('_redirects',vercel.redirects.map(x=>`${x.source} ${x.destination} ${x.permanent?301:302}`).join('\n')+'\n');
// A custom 404 disables the SPA fallback on Cloudflare Pages; no wildcard rewrites.
// Keep historic artwork in source control, not in the deployed public asset tree.
// Limit pruning to fixed-name shared brand/social assets; other images can be data-driven.
const publicText=fs.readdirSync(out,{recursive:true}).filter(file=>/\.(html|css|js)$/.test(file)).map(file=>fs.readFileSync(path.join(out,file),'utf8')).join('\n');
let retiredAssetCount=0,retiredAssetBytes=0;
for(const dir of ['images/brand','images/social']){
 for(const file of fs.readdirSync(path.join(out,dir))){
  const publicPath='/'+dir+'/'+file;
  if(!publicText.includes(publicPath)){
   retiredAssetBytes+=fs.statSync(path.join(out,dir,file)).size;
   fs.unlinkSync(path.join(out,dir,file));retiredAssetCount++;
  }
 }
}
console.log(`Excluded ${retiredAssetCount} unreferenced historic brand/social assets (${retiredAssetBytes} bytes) from deployment.`);
console.log(`Built ${items.length} discovery pages, ${seo.categories().length} category pages, ${guides.length} articles. All are noindex; sitemap intentionally empty.`);
