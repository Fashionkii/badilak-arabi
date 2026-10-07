/* Shared by the static build and the existing interactive directory. No second catalog. */
((root)=>{
 const brand='بديلك عربي';
 const homeTitle=brand+' — اكتشاف ومقارنة واختيار';
 const homeDescription='اكتشف أدوات وخدمات ومصادر عربية، وافهم فائدتها وحدودها قبل أن تختار أو تدفع.';
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const plain=value=>String(value??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 const categories=()=>Object.keys(categoryNames).filter(id=>id!=='all');
 function route(pathname){
  let path;
  try{path=decodeURIComponent(pathname).replace(/\.html$/,'').replace(/\/$/,'')||'/';}catch{return {kind:'missing',path:pathname};}
  const item=path.match(/^\/discover\/([^/]+)$/);
  if(item){const entry=items.find(x=>x.id===item[1]);return entry?{kind:'item',path,item:entry}:{kind:'missing',path};}
  const category=path.match(/^\/category\/([^/]+)$/);
  if(category){const id=category[1];return categories().includes(id)?{kind:'category',path,category:id}:{kind:'missing',path};}
  return {kind:'home',path:'/'};
 }
 function metadata(pathname,origin){
  const current=route(pathname),url=origin+current.path;
  let title=homeTitle,description=homeDescription,schema;
  if(current.kind==='item'){
   title=current.item.name+' — '+current.item.type+' | '+brand;
   description=plain(current.item.value);
   schema={'@context':'https://schema.org','@graph':[
    {'@type':'WebPage','@id':url+'#page',url,name:title,description,inLanguage:'ar',about:{'@type':'Thing',name:current.item.name,url:current.item.url}},
    {'@type':'BreadcrumbList',itemListElement:[
     {'@type':'ListItem',position:1,name:brand,item:origin+'/'},
     {'@type':'ListItem',position:2,name:categoryNames[current.item.cat],item:origin+'/category/'+current.item.cat},
     {'@type':'ListItem',position:3,name:current.item.name,item:url}
    ]}
   ]};
  }else if(current.kind==='category'){
   title=categoryNames[current.category]+' — '+brand;
   description='اكتشف خيارات '+categoryNames[current.category]+'، وقارن فائدتها وإتاحتها وحدودها ومصادر المعلومات عنها.';
   schema={'@context':'https://schema.org','@type':'CollectionPage',url,name:title,description,inLanguage:'ar',mainEntity:{'@type':'ItemList',itemListElement:items.filter(x=>x.cat===current.category).map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,url:origin+'/discover/'+x.id}))}};
  }else{
   schema={'@context':'https://schema.org','@graph':[
    {'@type':'Organization',name:brand,url:origin+'/',description:'منصة عربية للاكتشاف والمقارنة بين الأدوات والخدمات والمصادر العربية والإقليمية.'},
    {'@type':'WebSite',name:brand,url:origin+'/',inLanguage:'ar',description:homeDescription}
   ]};
  }
  return {...current,title,description,url,schema};
 }
 function categoryIndex(id){
  if(!categories().includes(id))return '';
  return `<details class="route-index"><summary>جميع الاكتشافات في ${escape(categoryNames[id])}</summary><ul>${items.filter(x=>x.cat===id).map(x=>`<li><a href="/discover/${escape(x.id)}" onclick="return badilakOpenItem(event,'${escape(x.id)}')">${escape(x.name)}</a></li>`).join('')}</ul></details>`;
 }
 function staticItem(x){
  const facts=[['نوع الخدمة',x.type],['صلته بالعربية',x.arabRelation],['الجهة / المنشأ',x.creator],['الإتاحة',x.availability],['السعر',x.price],['القيود',x.limit]];
  const guide=relatedGuideMap[x.id];
  return `<div class="detail-overview"><h1 class="quick-title">${escape(x.name)}</h1><p class="quick-purpose">${escape(x.value)}</p><div class="detail-facts">${facts.filter(v=>v[1]).map(([k,v])=>`<div class="detail-fact"><small>${escape(k)}</small><strong>${escape(v)}</strong></div>`).join('')}</div>${(x.modules||[]).map(([k,v])=>`<section class="detail-section"><h4>${escape(k)}</h4><div>${v}</div></section>`).join('')}<div class="detail-source-line"><span>${escape(x.verified)}</span><span>آخر مراجعة: ${escape(x.reviewed)}</span></div>${guide?`<a class="quiet-read-link" href="${escape(guide[0])}">${escape(guide[1])}</a>`:''}<p><a href="${escape(x.url)}" target="_blank" rel="noopener noreferrer">افتح ${escape(x.name)}</a></p><p><a href="/category/${escape(x.cat)}">${escape(categoryNames[x.cat])}</a></p></div>`;
 }
 function staticCards(id){
  return items.filter(x=>x.cat===id).map(x=>`<article class="item" data-item-id="${escape(x.id)}"><a class="item-identity" href="/discover/${escape(x.id)}"><span class="item-name">${escape(x.name)}</span></a><div class="card-summary"><p class="card-purpose">${escape(x.value)}</p></div><a class="more-btn" href="/discover/${escape(x.id)}">كل التفاصيل والمصادر</a></article>`).join('');
 }
 root.badilakSEO={route,metadata,categoryIndex,staticItem,staticCards,categories,escape};
 if(typeof document==='undefined')return;
 const origin=document.querySelector('meta[name="badilak:origin"]')?.content||'https://badilak-arabi.vercel.app';
 function setMeta(selector,attribute,value){const el=document.querySelector(selector);if(el)el.setAttribute(attribute,value);}
 function sync(){
  const page=metadata(location.pathname,origin);
  document.title=page.title;
  setMeta('meta[name="description"]','content',page.description);
  setMeta('link[rel="canonical"]','href',page.url);
  for(const key of ['og:title','twitter:title'])setMeta(`meta[property="${key}"],meta[name="${key}"]`,'content',page.title);
  for(const key of ['og:description','twitter:description'])setMeta(`meta[property="${key}"],meta[name="${key}"]`,'content',page.description);
  setMeta('meta[property="og:url"]','content',page.url);
  const schema=document.querySelector('script[type="application/ld+json"]');
  if(schema)schema.textContent=JSON.stringify(page.schema);
  const index=document.getElementById('routeIndex');
  if(index){index.innerHTML=page.kind==='category'?categoryIndex(page.category):'';index.hidden=page.kind!=='category';}
 }
 function plainClick(event){return event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey;}
 root.badilakOpenItem=(event,id)=>{
  if(!plainClick(event)||typeof openDetail!=='function')return true;
  event.preventDefault();openDetail(id);return false;
 };
 root.badilakOpenCategory=(event,id)=>{
  if(!plainClick(event)||typeof openDirectory!=='function')return true;
  event.preventDefault();openDirectory(id);return false;
 };
 // Keep head metadata consistent when the existing UI changes the URL without reloading.
 for(const method of ['pushState','replaceState']){
  const original=history[method];
  history[method]=function(...args){const result=original.apply(this,args);sync();return result;};
 }
 window.addEventListener('popstate',sync);
 document.addEventListener('DOMContentLoaded',sync,{once:true});
 sync();
})(typeof window==='undefined'?globalThis:window);
