/* Isolated preview QA. Never included in the production output. */
const frame=document.querySelector('iframe'),stage=document.querySelector('.frame-wrap'),output=document.getElementById('reviewResults');
const settle=async()=>{await frame.contentDocument.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));};
function values(el){const r=el.getBoundingClientRect();return {top:r.top,height:r.height,left:r.left,right:r.right};}
function viewCheck(){
 const d=frame.contentDocument,w=frame.contentWindow,visible=e=>!!e.getClientRects().length;
 const cards=[...d.querySelectorAll('.unified-resource-card')].filter(visible),home=[...d.querySelectorAll('.home-editorial .editorial-card')].filter(visible);
 const rows=[];for(const card of cards){const r=values(card);let row=rows.find(x=>Math.abs(x.top-r.top)<1);if(!row){row={top:r.top,cards:[]};rows.push(row);}row.cards.push(card);}
 const alignment=rows.filter(r=>r.cards.length>1).map(r=>({ids:r.cards.map(c=>c.dataset.itemId),deltas:Object.fromEntries(['.resource-context','.card-summary','.card-primary-actions'].map(s=>{const y=r.cards.map(c=>{const el=c.querySelector(s);return el?values(el).top:null;});return [s,y.every(v=>v!==null)&&y.length?Math.max(...y)-Math.min(...y):null];}))}));
 const oversized=[...d.querySelectorAll('.unified-resource-card *, .home-editorial *, .discovery-primary-controls *, .discovery-refinements *, #directory .local-nav *')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>w.innerWidth+1||r.left< -1);}).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.trim().slice(0,45)})).slice(0,20);
 const button=d.querySelector('#directoryMore .load-more-btn'),small=button?.querySelector('small'),cs=small&&w.getComputedStyle(small);
 return {documentState:{url:d.URL,title:d.title,hash:w.location.hash,bodyClass:d.body?.className||'',directoryPresent:!!d.querySelector('#directory'),directoryVisible:!!d.querySelector('#directory')&&visible(d.querySelector('#directory')),rawCards:d.querySelectorAll('.unified-resource-card').length,visibleCards:cards.length,headings:[...d.querySelectorAll('h1,h2')].slice(0,5).map(e=>e.textContent.trim().slice(0,70))},width:w.innerWidth,pageOverflow:Math.max(0,d.documentElement.scrollWidth-d.documentElement.clientWidth),oversized,cards:cards.length,groups:[...d.querySelectorAll('.catalog-group')].filter(visible).map(g=>({name:g.querySelector('h3').textContent,ids:[...g.querySelectorAll('[data-item-id]')].map(e=>e.dataset.itemId)})),alignment,home:home.map(c=>({height:values(c).height,image:!!c.querySelector('img'),rows:w.getComputedStyle(c).gridRow,actionGap:values(c.querySelector('.editorial-action')).top-values(c.querySelector('.editorial-date')).top-values(c.querySelector('.editorial-date')).height})),firstResult:d.querySelector('.catalog-group')?values(d.querySelector('.catalog-group')).top+w.scrollY:null,more:small?{font:cs.fontSize,color:cs.color,background:w.getComputedStyle(button).backgroundColor}:null};
}
async function measure(){await settle();output.textContent=JSON.stringify(viewCheck(),null,2);}
document.getElementById('reviewMeasure').addEventListener('click',measure);
document.getElementById('reviewMatrix').addEventListener('click',async()=>{const result=[];for(const width of [320,390,768,1366,1920]){stage.style.width=width+'px';await settle();result.push(viewCheck());}output.textContent=JSON.stringify(result,null,2);});
document.getElementById('reviewText').addEventListener('click',async()=>{const d=frame.contentDocument,w=frame.contentWindow;const sizes=[...d.querySelectorAll('body *')].map(e=>[e,w.getComputedStyle(e).fontSize,w.getComputedStyle(e).lineHeight]);for(const [e,size,line]of sizes){e.style.fontSize=parseFloat(size)*2+'px';if(line!=='normal')e.style.lineHeight=parseFloat(line)/parseFloat(size);}await measure();});
document.getElementById('reviewFallback').addEventListener('click',async()=>{const style=frame.contentDocument.createElement('style');style.textContent='body.cosmic-theme.guided-discovery.motion-lab #directory :is(.catalog-group-items,#catalogGrid)>.unified-resource-card{display:flex!important;grid-row:auto!important}';frame.contentDocument.head.append(style);await measure();});
document.getElementById('reviewFonts').addEventListener('click',async()=>{const d=frame.contentDocument,style=d.createElement('style');style.textContent='.material-symbols-outlined{font-family:MissingTestFont,serif!important}';d.head.append(style);output.textContent=JSON.stringify({localSymbols:d.querySelectorAll('.item-logo svg,.detail-logo svg').length,ligaturesInLogos:[...d.querySelectorAll('.item-logo .material-symbols-outlined,.detail-logo .material-symbols-outlined,.country-badge .material-symbols-outlined')].map(e=>e.textContent),logos:[...d.querySelectorAll('.item-logo,.detail-logo')].map(e=>({text:e.textContent,width:values(e).right-values(e).left}))},null,2);});
document.getElementById('reviewImages').addEventListener('click',async()=>{const d=frame.contentDocument;for(const e of d.querySelectorAll('.item-logo img,.detail-logo img'))e.src='/missing-qa-logo.png';await measure();});

/* Directory-only QA: do not misreport empty measurements as a passed layout test. */
async function reviewDirectoryMatrix(){
 const doc=frame.contentDocument,win=frame.contentWindow;
 if(!doc||!doc.getElementById('directory')){
  output.textContent=JSON.stringify({test:'directory',status:'BLOCKED_NO_DIRECTORY_DOCUMENT',documentUrl:doc?.URL||null,documentTitle:doc?.title||null},null,2);
  return;
 }
 try{win.badilakJourney?.show?.('directory');}catch(error){
  output.textContent=JSON.stringify({test:'directory',status:'NAVIGATION_ERROR',error:String(error)},null,2);return;
 }
 for(let attempt=0;attempt<30;attempt++){
  await settle();
  if([...doc.querySelectorAll('.unified-resource-card')].some(card=>!!card.getClientRects().length))break;
  await new Promise(resolve=>setTimeout(resolve,200));
 }
 const results=[];
 for(const width of [320,390,768,1366,1920]){
  stage.style.width=width+'px';await settle();
  const sample=viewCheck();
  const hasAllSelectors=sample.alignment.every(row=>Object.values(row.deltas).every(v=>v!==null));
  const status=sample.cards===0?'FAIL_NO_VISIBLE_CARDS':!hasAllSelectors?'FAIL_MISSING_ALIGNMENT_TARGETS':sample.pageOverflow||sample.oversized.length?'FAIL_OVERFLOW':'MEASURED';
  results.push({...sample,status});
 }
 output.textContent=JSON.stringify({test:'directory',status:results.every(r=>r.status==='MEASURED')?'MEASURED_ALL_WIDTHS':'INCOMPLETE_OR_FAILED',results},null,2);
}
document.getElementById('reviewDirectoryMatrix')?.addEventListener('click',reviewDirectoryMatrix);

/* One-click load-more QA, measured from the actual rendered DOM. */
async function reviewDirectoryMore(){
 const doc=frame.contentDocument,win=frame.contentWindow;
 if(!doc?.querySelector('#directory')){output.textContent=JSON.stringify({test:'loadMore',status:'BLOCKED_NO_DIRECTORY'},null,2);return;}
 win.badilakJourney?.show?.('directory');
 await settle();
 const snapshot=()=>{
  const cards=[...doc.querySelectorAll('.unified-resource-card')].filter(e=>!!e.getClientRects().length);
  const ids=cards.map(e=>e.getAttribute('data-item-id')).filter(Boolean);
  const more=doc.querySelector('#directoryMore .load-more-btn');
  return {cards:cards.length,uniqueIds:new Set(ids).size,idsMissing:cards.length-ids.length,groups:[...doc.querySelectorAll('.catalog-group')].filter(e=>!!e.getClientRects().length).length,stateLine:doc.getElementById('stateLine')?.textContent?.trim()||null,moreLabel:more?.textContent?.trim()||null};
 };
 const before=snapshot(),button=doc.querySelector('#directoryMore .load-more-btn');
 if(!button){output.textContent=JSON.stringify({test:'loadMore',status:'BLOCKED_NO_BUTTON',before},null,2);return;}
 button.click();await settle();
 const after=snapshot();
 output.textContent=JSON.stringify({test:'loadMore',status:after.cards>before.cards&&after.uniqueIds===after.cards&&after.idsMissing===0?'MEASURED_INCREASE_NO_DUPLICATES':'FAILED_CHECK',before,after,added:after.cards-before.cards},null,2);
}
document.getElementById('reviewDirectoryMore')?.addEventListener('click',reviewDirectoryMore);


/* Real cross-document return test: follow an actual directory guide link. */
async function reviewSmartReturn(){
 const report={test:'smartReturn',status:'STARTING'};
 const write=()=>output.textContent=JSON.stringify(report,null,2);
 const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const nextLoad=action=>new Promise((resolve,reject)=>{
  let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(t);frame.removeEventListener('load',finish);resolve();};
  const t=setTimeout(()=>{if(done)return;done=true;frame.removeEventListener('load',finish);reject(new Error('Frame navigation timed out'));},12000);
  frame.addEventListener('load',finish);action();
 });
 try{
  let d=frame.contentDocument,w=frame.contentWindow;
  if(!d.querySelector('#directory'))throw Error('Directory not present');
  w.badilakJourney?.show?.('directory');
  await settle();
  const input=d.getElementById('searchInput');
  if(!input)throw Error('Search input missing');
  input.value='دفترة';input.dispatchEvent(new w.Event('input',{bubbles:true}));await settle();
  const visible=()=>[...d.querySelectorAll('.unified-resource-card')].filter(e=>!!e.getClientRects().length);
  report.before={path:w.location.pathname,hash:w.location.hash,search:input.value,cards:visible().length,stateLine:d.getElementById('stateLine')?.textContent?.trim()};
  const link=d.querySelector('.unified-resource-card[data-item-id="daftra"] a.card-read-link[href^="/guides/"]')||d.querySelector('.unified-resource-card a.card-read-link[href^="/guides/"]');
  if(!link)throw Error('No internal guide link inside a directory resource card');
  report.articleLink=link.getAttribute('href');
  await nextLoad(()=>link.click());await pause(450);
  d=frame.contentDocument;w=frame.contentWindow;
  const back=d.querySelector('#badilakNavMemory .badilak-smart-back');
  let stackLength=null,mostRecentSearch=null;
  try{const stack=JSON.parse(w.sessionStorage.getItem('badilak_nav_stack_v1')||'[]');stackLength=stack.length;mostRecentSearch=stack[stack.length-1]?.discovery?.search||null;}catch{}
  report.article={path:w.location.pathname,smartBackVisible:!!back,stackLength,mostRecentSearch};
  if(!back){report.status='FAIL_NO_SMART_BACK';write();return;}
  await nextLoad(()=>back.click());await pause(450);
  d=frame.contentDocument;w=frame.contentWindow;await settle();
  const search=d.getElementById('searchInput')?.value||'';
  const cards=[...d.querySelectorAll('.unified-resource-card')].filter(e=>!!e.getClientRects().length);
  report.restored={path:w.location.pathname,hash:w.location.hash,search,cards:cards.length,stateLine:d.getElementById('stateLine')?.textContent?.trim()||null};
  report.status=search==='دفترة'&&cards.length===report.before.cards?'PASS_SEARCH_RESTORED':'FAIL_SEARCH_NOT_RESTORED';
 }catch(error){report.status='TEST_ERROR';report.error=String(error);}
 write();
}
document.getElementById('reviewSmartReturn')?.addEventListener('click',reviewSmartReturn);
