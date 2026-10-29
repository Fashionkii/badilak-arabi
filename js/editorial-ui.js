/* Shared card renderer for the reading hub, home previews and contextual reading. */
const editorialCategories={work:'شغلك ومشروعك',tech:'تقنية وذكاء اصطناعي',learn:'تعلّم وبحث',create:'تصميم ومحتوى',culture:'قراءة واستماع',shopping:'التسوّق',observer:'المرصد'};
function editorialDate(value){return value?new Intl.DateTimeFormat('ar-EG',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')):'';}
function editorialCardMarkup(row,{feature=false,image=false}={}){
 const e=discoveryEscape,news=row.type==='news';
 return `<article class="editorial-card${feature?' editorial-card--feature':''}" data-editorial-type="${row.type}" data-editorial-category="${row.category}"><a href="${row.url}" class="editorial-card-link">
 ${image&&row.image?`<img class="editorial-cover" src="${e(row.image)}" alt="${e(row.imageAlt)}" width="640" height="360" loading="lazy" decoding="async">`:''}
 <div class="editorial-card-body"><p class="editorial-eyebrow"><span>${news?'خبر':'مقال'}</span><span>${editorialCategories[row.category]}</span></p>
 <h3>${e(row.title)}</h3><p class="editorial-summary">${e(row.summary)}</p>
 <p class="editorial-date">${news?'الحدث':'تحديث المقال'}: <time datetime="${news?row.eventDate:row.updated}">${editorialDate(news?row.eventDate:row.updated)}</time>${news?`<span>مراجعة المصدر: <time datetime="${row.updated}">${editorialDate(row.updated)}</time></span>`:''}</p>
 <span class="editorial-action">${news?'اقرأ ما تغيّر':'اقرأ المقال'} <span aria-hidden="true">←</span></span></div></a></article>`;
}
function discoveryEditorialMarkup(entries){
 if(typeof badilakEditorial==='undefined')return '';
 const ids=new Set(entries.flatMap(e=>[e.id,e.learning?.id].filter(Boolean)));
 const path=typeof discoveryPath==='string'?discoveryPaths[discoveryPath]:null;
 const q=document.getElementById('searchInput')?.value.trim();
 if(!path&&!q&&filter==='all'&&!originFilter&&!countryFilter)return '';
 const matches=badilakEditorial.rows.filter(row=>path?.guides.includes(row.id)||row.resources.some(id=>ids.has(id)));
 const selected=[...matches.filter(row=>row.type==='article').slice(0,2),...matches.filter(row=>row.type==='news').slice(0,1)];
 return selected.length?`<div class="editorial-section-head"><div><h2>اقرأ في نفس الموضوع</h2><p>فهم القرار، ومتابعة التغييرات المرتبطة به.</p></div><a href="/guides">كل المقالات والأخبار ←</a></div><div class="editorial-context-grid">${selected.map(row=>editorialCardMarkup(row)).join('')}</div>`:'';
}
