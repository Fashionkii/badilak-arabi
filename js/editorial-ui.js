/* Shared card renderer for the reading hub, home previews and contextual reading. */
const editorialCategories={work:'شغلك ومشروعك',tech:'تقنية وذكاء اصطناعي',learn:'تعلّم وبحث',create:'تصميم ومحتوى',culture:'قراءة واستماع',shopping:'التسوّق',observer:'المرصد'};
function editorialDate(value){return value?new Intl.DateTimeFormat('ar-EG',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')):'';}
function editorialCardMarkup(row,{feature=false,image=false,grouped=false,date=true}={}){
 const e=discoveryEscape,news=row.type==='news',concise=conciseEditorial(row.id,row.type);
 return `<article class="editorial-card${feature?' editorial-card--feature':''}" data-editorial-type="${row.type}" data-editorial-category="${row.category}"><a href="${row.url}" class="editorial-card-link" aria-label="${e(row.title)}">
 ${image&&row.image?`<img class="editorial-cover" src="${e(row.image)}" alt="${e(row.imageAlt)}" width="640" height="360" loading="lazy" decoding="async">`:''}
 <div class="editorial-card-body"><p class="editorial-eyebrow"><span>${news?'خبر':'مقال'}</span>${grouped?'':`<span>${editorialCategories[row.category]}</span>`}</p>
 <h3>${e(row.cardTitle||row.title)}</h3><p class="editorial-summary">${e(row.summary)}</p>
 ${!date?'':concise?news?`<p class="editorial-date">${e(row.eventKind||'الحدث')}: <time datetime="${row.eventDate}">${editorialDate(row.eventDate)}</time></p>`:'':`<p class="editorial-date">${news?e(row.eventKind||'الحدث'):'تحديث المقال'}: <time datetime="${news?row.eventDate:row.updated}">${editorialDate(news?row.eventDate:row.updated)}</time>${news?`<span>مراجعة المصدر: <time datetime="${row.updated}">${editorialDate(row.updated)}</time></span>`:''}</p>`}
 <span class="editorial-action">${news?'اقرأ ما تغيّر':'اقرأ المقال'} <span aria-hidden="true">←</span></span></div></a></article>`;
}
function discoveryEditorialMarkup(entries){
 if(typeof badilakEditorial==='undefined')return '';
 const ids=new Set(entries.flatMap(e=>[e.id,e.learning?.id].filter(Boolean)));
 const path=typeof discoveryPath==='string'?discoveryPaths[discoveryPath]:null;
 const q=document.getElementById('searchInput')?.value.trim();
 if(!path&&!q&&filter==='all'&&!originFilter&&!countryFilter)return '';
 const matches=badilakEditorial.rows.filter(row=>path?.guides.includes(row.id)||row.paths?.includes(discoveryPath)||row.resources.some(id=>ids.has(id)));
 const articles=matches.filter(row=>row.type==='article');
 if(path)articles.sort((a,b)=>(path.guides.includes(a.id)?path.guides.indexOf(a.id):Infinity)-(path.guides.includes(b.id)?path.guides.indexOf(b.id):Infinity));
 const news=matches.filter(row=>row.type==='news');
 const selected=[...articles.slice(0,news.length?2:3),...news.slice(0,Math.max(0,3-Math.min(articles.length,2)))].slice(0,3);
 return selected.length?`<div class="editorial-section-head"><div><h2>اقرأ في نفس الموضوع</h2><p>فهم القرار، ومتابعة التغييرات المرتبطة به.</p></div><a href="/guides">كل المقالات والأخبار ←</a></div><div class="editorial-context-grid">${selected.map(row=>editorialCardMarkup(row,{image:true})).join('')}</div>`:'';
}

// Homepage reading: three cards. The newest publication keeps the first card for 14 days.
// The rest rotate in turn through every article and through news no older than 60 days,
// with at most one news card at a time. Dates are hidden on these cards, which is why old news stays out.
const homeReadingPinDays=14,homeReadingNewsDays=60,homeReadingCards=3;
function homeReadingDate(row){return row.type==='news'?row.eventDate:row.updated||'';}
function homeReadingAgeDays(row,now){const d=homeReadingDate(row);return d?(now-Date.parse(d+'T00:00:00Z'))/864e5:Infinity;}
function homeReadingPlan(rows,now){
 const byDate=(a,b)=>homeReadingDate(b).localeCompare(homeReadingDate(a))||a.id.localeCompare(b.id);
 const eligible=rows.filter(r=>r.type==='article'||(r.type==='news'&&homeReadingAgeDays(r,now)<=homeReadingNewsDays)).sort(byDate);
 const pinned=eligible.length&&homeReadingAgeDays(eligible[0],now)<=homeReadingPinDays?eligible[0]:null;
 return {pinned,pool:eligible.filter(r=>r!==pinned)};
}
function homeReadingSelection(rows,now,cursor){
 const {pinned,pool}=homeReadingPlan(rows,now),picked=pinned?[pinned]:[];
 const slots=homeReadingCards-picked.length;
 for(let i=0;i<pool.length&&picked.length<homeReadingCards;i++){
  const row=pool[((cursor%pool.length)+pool.length+i)%pool.length];
  if(row.type==='news'&&picked.some(r=>r.type==='news'))continue;
  if(!picked.includes(row))picked.push(row);
 }
 return {rows:picked,step:slots};
}
