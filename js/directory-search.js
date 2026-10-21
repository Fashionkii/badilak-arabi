/* Local directory search. Editorial keywords describe the existing records;
   they do not establish availability, equivalence, verification or quality. */
const directorySearchKeywords={
 hindawi:['كتاب','كتب','طفل','أطفال','قراءة للأطفال'],
 abjjad:['كتاب','كتب','قراءة','كتب صوتية'],
 shamela:['كتاب','كتب','مكتبة تراث'],
 spacetoonyt:['طفل','أطفال','كرتون','محتوى للأطفال'],
 majidkids:['طفل','أطفال','كرتون','محتوى للأطفال'],
 dubaiplus:['طفل','أطفال','محتوى للأطفال'],
 mumzworld:['مستلزمات طفل','منتجات أطفال'],
 edraak:['كورس','كورسات','دورة','دورات'],
 hsoub:['كورس برمجة','كورسات برمجة','دورة برمجة'],
 tadarab:['كورس','كورسات','دورة','دورات'],
 edlal:['كورس','كورسات','دورة','دورات'],
 wuzzuf:['وظيفة','وظائف','توظيف'],
 bayt:['وظيفة','وظائف','توظيف']
};
function normalizeDirectorySearch(value=''){
 return norm(String(value).normalize('NFKC')).replace(/ـ/g,'')
  .replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ')
  .split(' ').map(word=>word.replace(/^ال(?=.{3})/u,'')).join(' ');
}
function directorySearchScore(item,query){
 const q=normalizeDirectorySearch(query);if(!q)return 1;
 const name=normalizeDirectorySearch(item.name);
 const keywords=(directorySearchKeywords[item.id]||[]).map(normalizeDirectorySearch);
 const country=countryEntries(itemCountryMap[item.id]).map(entry=>entry[1]).join(' ');
 const category=normalizeDirectorySearch(categoryNames[item.cat]);
 if(q===category)return 30;
 const text=normalizeDirectorySearch([item.name,item.value,item.creator,item.availability,
  item.arabRelation,item.type,subcategoryLabel(item.cat,item.sub),
  country,...(directorySearchKeywords[item.id]||[])].join(' '));
 const words=text.split(' ');
 if(!q.split(' ').every(word=>name.includes(word)||words.some(candidate=>candidate.startsWith(word))))return 0;
 // Rank relevance only; preserve catalog order for equal scores.
 if(name===q)return 100;
 if(name.includes(q))return 80;
 if(keywords.includes(q))return 60;
 return text.includes(q)?40:20;
}
function searchDirectoryItems(list,query){
 if(!normalizeDirectorySearch(query))return list;
 return list.map((item,index)=>({item,index,score:directorySearchScore(item,query)}))
  .filter(entry=>entry.score>0).sort((a,b)=>b.score-a.score||a.index-b.index)
  .map(entry=>entry.item);
}
