/* Progressive enhancement: all entries remain readable without JavaScript. */
(()=>{
 const root=document.getElementById('readingHub');if(!root)return;
 const cards=[...root.querySelectorAll('[data-editorial-type]')],groups=[...root.querySelectorAll('[data-reading-group]')];
 const topic=root.querySelector('#readingTopic'),status=root.querySelector('#readingStatus');
 function render(){
  const params=new URLSearchParams(location.search),requested=params.get('type')||(location.pathname==='/news'?'news':'all');
  const type=['all','article','news'].includes(requested)?requested:'all';
  const category=[...topic.options].some(o=>o.value===params.get('topic'))?params.get('topic'):'all';
  topic.value=category;
  root.querySelectorAll('[data-reading-type]').forEach(a=>{
   const selected=a.dataset.readingType===type;
   if(selected)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
   const p=new URLSearchParams();if(a.dataset.readingType!=='all')p.set('type',a.dataset.readingType);if(category!=='all')p.set('topic',category);
   a.href='/guides'+(p.size?'?'+p.toString():'');
  });
  for(const card of cards)card.hidden=!(type==='all'||card.dataset.editorialType===type)||!(category==='all'||card.dataset.editorialCategory===category);
  for(const group of groups)group.hidden=![...group.querySelectorAll('[data-editorial-type]')].some(card=>!card.hidden);
  const visible=cards.filter(card=>!card.hidden),articles=visible.filter(card=>card.dataset.editorialType==='article').length;
  status.textContent=visible.length?`${articles} مقالًا · ${visible.length-articles} خبرًا`:'لا توجد مواد في هذه التصفية. اختر موضوعًا آخر أو اعرض الكل.';
 }
 function navigate(url){history.pushState({},'',url);render();}
 root.addEventListener('click',event=>{
  const a=event.target.closest('[data-reading-type]');
  if(!a||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
  event.preventDefault();navigate(a.href);
 });
 topic.addEventListener('change',()=>{
  const p=new URLSearchParams(location.search);if(location.pathname==='/news')p.set('type','news');
  if(topic.value==='all')p.delete('topic');else p.set('topic',topic.value);
  navigate('/guides'+(p.size?'?'+p.toString():''));
 });
 window.addEventListener('popstate',render);render();
})();
