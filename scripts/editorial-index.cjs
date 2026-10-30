'use strict';
const fs=require('node:fs'),path=require('node:path');
const plain=s=>s.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
// Titles, summaries and dates come from the article itself; images keep their source metadata.
module.exports=function(root,news){
 const relations=JSON.parse(fs.readFileSync(path.join(root,'data/editorial-relations.json'),'utf8'));
 const media=JSON.parse(fs.readFileSync(path.join(root,'data/article-media.json'),'utf8'));
 const rows=Object.entries(relations.guides).map(([id,relation])=>{
  const html=fs.readFileSync(path.join(root,'guides',id+'.html'),'utf8');
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const img=media.articles[id];
  return {id,type:'article',url:'/guides/'+id,title:plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]),summary:plain(schema.description),updated:schema.dateModified||null,image:'/images/articles/'+id+'-thumb.webp',imageAlt:img?.alt||'',...relation};
 });
 for(const n of news)rows.push({id:n.id,type:'news',url:'/news/'+n.id,title:n.title,summary:n.change,category:n.category||'tech',resources:n.related?[n.related]:[],image:'/images/articles/'+n.imageArticle+'-thumb.webp',imageAlt:media.articles[n.imageArticle].alt,eventDate:n.eventDate,published:n.published,updated:n.reviewed});
 return {rows,home:relations.home};
};
