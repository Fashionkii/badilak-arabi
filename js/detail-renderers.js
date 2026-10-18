/* Shared pure presentation: the initial HTML and interactive details use identical content. */
function logoInitials(label=''){
 const parts=String(label).replace(/[^\p{L}\p{N}\s]/gu,' ').trim().split(/\s+/).filter(Boolean);
 return (parts.slice(0,2).map(x=>x[0]).join('')||'•').toUpperCase();
}

function logoMarkup(url, cls='item-logo', label=''){
 const raw=String(url||'');
 if(raw.startsWith('material:'))return `<span class="${cls} editorial-vector" aria-hidden="true"><span class="material-symbols-outlined">${raw.slice(9)}</span></span>`;
 const fallback=logoInitials(label);
 const special=(raw.includes('fanar-logo.png')||raw.includes('Fanar-12.png'))?' logo-fanar':(raw.includes('gravity-error.jpg')||raw.includes('makram-editing.jpg'))?' logo-photo':'';
 if(!raw) return `<span class="${cls} logo-fallback" data-fallback="${fallback}"></span>`;
 return `<span class="${cls}${special}" data-fallback="${fallback}"><img src="${raw}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none';this.parentElement.classList.add('logo-broken')"></span>`;
}

function countryEntries(info){
 if(!info)return [];
 return Array.isArray(info[0])?info:[info];
}

function countryBadgeMarkup(x,map=itemCountryMap){
 const entries=countryEntries(map[x.id]);
 if(entries.length){
  return `<div class="country-badge-slot">${entries.map(info=>`<span class="country-badge"><img src="${flagAssetBase+info[0]+'.png'}" alt=""><bdi>${x.id==='taqreer'?'تسجيل أمريكي':String(info[1]||'').split('·')[0].trim()}</bdi></span>`).join('')}</div>`;
 }
 const text=[x.creator||'',x.arabRelation||'',x.reference||''].join(' ');
 let label='المنشأ قيد التحقق';
 if(/عالمي|global|OurResearch|Digital Scholar|Khan Academy/i.test(text))label='مصدر عالمي';
 else if(/إقليمي|جهة عربية|منصة عربية|مشروع المعرفة/i.test(text))label='عربي / إقليمي';
 return `<div class="country-badge-slot"><span class="country-badge country-badge-neutral"><span class="material-symbols-outlined country-neutral-icon" aria-hidden="true">language</span><bdi>${label}</bdi></span></div>`;
}

function norm(s=''){return s.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ة/g,'ه').replace(/[ً-ٰٟ]/g,'').trim()}

function subcategoryLabel(cat,sub){
 if(sub==='all') return '';
 const pair=(subfilterMap[cat]||[]).find(x=>x[0]===sub);
 return pair ? pair[1] : sub;
}

function guideLinkMarkup(guide,detail=false){
 // Only specific guides belong on cards; the general hub remains in the details.
 if(!guide&&!detail)return '';
 const href=guide?guide[0]:'/guides';
 const content=detail
  ? `<span>اقرأ</span><strong>${guide?guide[1]:'اقرأ حسب حاجتك'}</strong>`
  : '<strong>مقال له صلة</strong>';
 const readingLabel=detail?'':` aria-label="مقال له صلة: ${String(guide?guide[1]:'مركز القراءة').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}"`;
 return `<a class="editorial-guide-link ${detail?'is-detail':'card-read-link'}" href="${href}"${readingLabel} onclick="event.stopPropagation()">${content}<b aria-hidden="true">←</b></a>`;
}

function editorialGuideLinkMarkup(id,detail=false){return guideLinkMarkup(relatedGuideMap[id],detail)}

function detailFact(label,value){
 if(!value)return '';
 return `<div class="detail-fact"><small>${label}</small><strong>${value}</strong></div>`;
}

function specialDetails(x){
 if(x.id==='gravity') return {
  facts:[
   ['النوع','ألغاز ومنصات ثنائية الأبعاد'],
   ['المنصات','Windows · macOS · PlayStation 4'],
   ['اللغات','يدعم العربية ضمن 9 لغات على Steam'],
   ['نمط اللعب','لاعب واحد'],
   ['مساحة PC','400 MB مساحة متاحة'],
   ['الإصدار','PC: أغسطس 2015 · PS4: يناير 2020']
  ],
  sections:[
   ['طريقة اللعب','تغيير اتجاه الجاذبية في أربعة اتجاهات وحل المراحل بأكثر من طريقة.'],
   ['متطلبات PC الدنيا','معالج ثنائي النواة 2.0 GHz · ذاكرة 1 GB RAM · رسوميات مدمجة بذاكرة 512 MB · مساحة 400 MB.'],
   ['المصادر','<a href="https://store.steampowered.com/app/379760/Gravity_Error/" target="_blank" rel="noopener noreferrer">Steam</a> · <a href="https://store.playstation.com/en-us/product/UP2091-CUSA17835_00-GRAVITYERROR4028" target="_blank" rel="noopener noreferrer">PlayStation</a> · <a href="https://www.semaphorelab.com/gravity-error" target="_blank" rel="noopener noreferrer">المطور</a>']
  ]
 };
 if(x.id==='abjjad') return {
  facts:[
   ['المحتوى','كتب إلكترونية + كتب صوتية'],
   ['الاستخدام بدون إنترنت','نعم بعد التحميل داخل التطبيق'],
   ['الأجهزة','مزامنة على حتى 3 أجهزة بحسب صفحة الاشتراك'],
   ['الوصول','تطبيقات iOS وAndroid وAppGallery'],
   ['التكلفة',x.price],
   ['الجهة',x.creator]
  ],
  sections:[
   ['القراءة والاستماع','يمكن القراءة الإلكترونية أو الاستماع للكتب الصوتية، مع التحكم في الخط والخلفية وسرعة الصوت. التحميل المقصود للاستخدام داخل التطبيق دون إنترنت، وليس تنزيل ملف كتاب مفتوح.'],
   ['المصادر','<a href="https://www.abjjad.com/" target="_blank" rel="noopener noreferrer">أبجد</a> · <a href="https://www.abjjad.com/audio-books" target="_blank" rel="noopener noreferrer">الكتب الصوتية</a> · <a href="https://www.abjjad.com/faq" target="_blank" rel="noopener noreferrer">الأسئلة الشائعة</a>']
  ]
 };
 if(x.id==='fanar') return {
  facts:[
   ['النوع','منصة ذكاء اصطناعي توليدي عربية'],
   ['القدرات','محادثة · صور · صوت · فهم صور وفيديو · مهام متعددة الخطوات'],
   ['العربية','فصحى ولهجات عربية في صلب المنصة'],
   ['التكلفة','مجاني بالكامل بحسب الأسئلة الشائعة الرسمية'],
   ['للمطورين','API ونماذج مختارة على Hugging Face'],
   ['المطور',x.creator]
  ],
  sections:[
   ['ما يميزه','المنصة موجهة للعربية والثقافة العربية، وتضم نماذج متخصصة للصوت والترجمة والصور والإجابات الإسلامية الموثقة بالمصادر.'],
   ['المصادر','<a href="https://www.fanar.qa/" target="_blank" rel="noopener noreferrer">الموقع الرسمي</a> · <a href="https://www.fanar.qa/en/2-0-release-notes" target="_blank" rel="noopener noreferrer">Fanar 2.0</a>']
  ]
 };
 return null;
}

function genericFacts(x){
 if(x.cat==='culture'&&x.sub==='games') return [['النوع',x.type],['المطور',x.creator],['المنصات والإتاحة',x.availability],['السعر',x.price],['العربية',x.arabRelation],['آخر مراجعة',x.reviewed]];
 if(x.cat==='culture'&&x.sub==='books') return [['نوع المحتوى',x.type],['طريقة الوصول',x.availability],['التكلفة',x.price],['الجهة',x.creator],['العربية',x.arabRelation],['آخر مراجعة',x.reviewed]];
 if(x.cat==='culture'&&x.sub==='podcasts') return [['نوع المحتوى',x.type],['الاستماع',x.availability],['التكلفة',x.price],['الجهة',x.creator],['العربية',x.arabRelation],['آخر مراجعة',x.reviewed]];
 if(x.cat==='tech'&&x.sub==='ai') return [['نوع الخدمة',x.type],['الاستخدام الأساسي',x.value],['العربية',x.arabRelation],['المطور',x.creator],['الإتاحة',x.availability],['التكلفة',x.price]];
 if(x.cat==='tech') return [['نوع التقنية',x.type],['الاستخدام',x.value],['الجهة',x.creator],['الإتاحة',x.availability],['التكلفة',x.price],['آخر مراجعة',x.reviewed]];
 if(x.cat==='learn'&&x.sub==='research') return [['نوع المصدر',x.type],['نطاق البحث',x.value],['الإتاحة',x.availability],['التكلفة',x.price],['الجهة',x.creator],['آخر مراجعة',x.reviewed]];
 if(x.cat==='learn') return [['نوع التعلّم',x.type],['ماذا يقدم',x.value],['لغة التعلّم',x.arabRelation],['الإتاحة',x.availability],['التكلفة',x.price],['الجهة',x.creator]];
 if(x.cat==='work'&&x.sub==='services') return [['نوع الخدمة',x.type],['ما الذي تشتريه',x.value],['الإتاحة',x.availability],['التكلفة',x.price],['الجهة',x.creator],['العربية',x.arabRelation]];
 if(x.cat==='work') return [['نوع الأداة',x.type],['الاستخدام الأساسي',x.value],['السوق/الجهة',x.creator],['الإتاحة',x.availability],['التكلفة',x.price],['العربية',x.arabRelation]];
 if(x.cat==='create'&&x.sub==='audio') return [['نوع الأداة',x.type],['المخرجات',x.value],['العربية والصوت',x.arabRelation],['الإتاحة',x.availability],['التكلفة',x.price],['الجهة',x.creator]];
 if(x.cat==='create') return [['نوع الأداة',x.type],['ما الذي تنتجه',x.value],['العربية',x.arabRelation],['الإتاحة',x.availability],['التكلفة',x.price],['الجهة',x.creator]];
 return [['ما هو؟',x.type],['ماذا يقدم؟',x.value],['الجهة',x.creator],['الإتاحة',x.availability],['التكلفة',x.price],['آخر مراجعة',x.reviewed]];
}

function renderSections(x,extra=[]){
 const normal=(x.modules||[]).map(([t,p])=>[t,p]);
 const merged=[...extra,...normal];
 return merged.map(([t,p])=>`<section class="detail-section"><h4>${t}</h4><div>${p}</div></section>`).join('');
}

function decisionTypeFrom(text=''){
 const s=norm(text);
 if(/بنك المعرفه|اشتراك|حساب|دخول|موسس|مؤسس|اتاح|صلاح|بلد|منطقه|شبكه/.test(s))return 'الوصول';
 if(/سعر|تكلف|باقه|مدفوع|مجاني/.test(s))return 'التكلفة';
 if(/نص كامل|مستخلص|مرجع|مصدر|اقتباس|توثيق|بحث/.test(s))return 'المصدر';
 if(/ترخيص|حقوق|تصدير/.test(s))return 'الحقوق';
 if(/اختبر|دقه|جوده|benchmark|نموذج/.test(s))return 'الاعتماد';
 return 'خد بالك';
}

function genericDecisionAction(x){
 if(x.cat==='learn'&&x.sub==='encyclopedias') return 'ابدأ بالموسوعة للاكتشاف، ثم افتح المراجع الأصلية قبل الاعتماد في معلومة متغيرة أو حساسة.';
 if(x.cat==='learn'&&x.sub==='islamic') return 'اقرأ منهج المصدر والمراجع، ولا تختزل المسائل الخلافية أو النوازل في نتيجة بحث واحدة؛ ارجع لأهل الاختصاص عند الحاجة.';
 if(x.cat==='learn'&&x.sub==='language') return 'اختبر المعنى داخل السياق والمجال، وراجع أكثر من معجم أو مصدر متخصص قبل اعتماد المصطلح.';
 if(x.cat==='culture'&&x.sub==='kids') return 'ابدأ من القناة الرسمية وراجع ملاءمة الحلقة لعمر الطفل، ومع YouTube استخدم أدوات الإشراف أو YouTube Kids عند الحاجة.';
 if(x.cat==='culture'&&x.sub==='drama') return 'راجع بلد الإتاحة، نوع الاشتراك، والمكتبة الحالية قبل الدفع؛ حقوق العرض تتغير بين الأسواق.';
 if(x.cat==='learn'&&x.sub==='research') return 'استخدم المنصة للاكتشاف أولًا، ثم تحقق من النص الكامل والمصدر الأصلي قبل الاقتباس. لو الوصول مقفول، جرّب الوصول المؤسسي من جامعتك أو مكتبتك، أو ابحث عن نسخة مفتوحة موثوقة.';
 if(x.cat==='learn') return 'راجع متطلبات التسجيل، وهل المسار الكامل أو الشهادة مدفوعان، قبل ما تستثمر وقتًا طويلًا.';
 if(x.cat==='tech'&&x.sub==='ai') return 'اختبر بعينة حقيقية غير حساسة، وقارن النتيجة بمصدر مستقل قبل الاعتماد عليها في قرار مهم.';
 if(x.cat==='tech') return 'راجع التوافق، الإتاحة الحالية، والقيود التقنية من المصدر الرسمي قبل الاعتماد.';
 if(x.cat==='work') return 'راجع بلد الخدمة، الرسوم، الباقة، والتكاملات التي تحتاجها قبل الدفع أو نقل عملك إليها.';
 if(x.cat==='shopping') return 'قارن بلد الإتاحة، البائع، رسوم الشحن، سياسة الإرجاع، وضمان المنتج قبل الشراء.';
 if(x.cat==='create') return 'جرّب عينة فعلية أولًا، وتحقق من شروط التصدير والترخيص وحدود الخطة المجانية إن وجدت.';
 if(x.cat==='culture') return 'راجع بلد الإتاحة، نوع الوصول، وهل المحتوى كامل أم جزء منه قبل الاشتراك أو التحميل.';
 return 'راجع المصدر الرسمي الحالي قبل الاعتماد، وإذا كان القيد يمنعك فابحث عن خيار آخر داخل نفس التصنيف.';
}

function decisionNoteFor(x){
 if(!x)return null;
 if(x.id==='karnak') return {
   type:'حالة المنتج',
   alert:'الإطلاق ما زال في مرحلة تجريبية بحسب المصدر الرسمي.',
   action:'جرّبه أولًا على مهمة غير حساسة، ثم احكم على ملاءمته لسياقك قبل الاعتماد عليه في عمل مهم.',
   source:'<a href="https://www.aic.gov.eg/news/43/" target="_blank" rel="noopener noreferrer">المصدر الرسمي لحالة الإطلاق</a>'
 };
 if(x.id==='mandumah') return {
   type:'قيد وصول',
   alert:'الوصول الكامل لبعض مواد دار المنظومة قد يعتمد على بنك المعرفة المصري أو اشتراك مؤسسي، ووجود المستخلص لا يعني أن النص الكامل متاح.',
   action:'إذا كنت في مصر، ابدأ من حساب بنك المعرفة المصري. وإذا لم تتوفر الصلاحية، استخدم المستخلص للاكتشاف ثم ابحث عن المصدر الأصلي أو نسخة مفتوحة موثوقة.',
   source:'<a href="https://www.mandumah.com/ekb/" target="_blank" rel="noopener noreferrer">اتفاق دار المنظومة مع بنك المعرفة</a> · <a href="https://www.ekb.eg/" target="_blank" rel="noopener noreferrer">بنك المعرفة المصري</a>'
 };
 const alert=(x.limit||'').trim();
 if(!alert)return null;
 return {type:decisionTypeFrom(alert),alert,action:genericDecisionAction(x),source:''};
}

function decisionPanelMarkup(x){
 const n=decisionNoteFor(x);if(!n)return '';
 return `<section class="decision-panel">
  <div class="decision-panel-head"><strong>مهم قبل الاختيار</strong><em>${n.type||'معلومة قرار'}</em></div>
  <p class="decision-alert-text">${n.alert}</p>
  <div class="decision-action"><b>ما الذي يمكنك فعله؟</b><span>${n.action}</span></div>
  ${n.source?`<div class="decision-source">${n.source}</div>`:''}
 </section>`;
}

// Navigation groups describe a shared task, not equal capabilities or a quality rank.
// Use existing known-service associations too; a broad category alone is not enough.
const directoryComparisonGroups=[
 ['daftra','qoyod','expensya'],['qriib','vconnct'],['salla','wuilt','lymonah'],
 ['paymob','myfatoorah','thawani'],['khamsat','forlanso'],
 ['edraak','hsoub','edlal','tadarab','gomycode','bibf'],['alef','kezakoo','telmidtice'],
 ['shamaa','mandumah','openalex','qdl'],['dorar','tafsircenter','shamela'],
 ['noon','miswag'],['opensooq','ouedkniss','dabchy'],['snoonu','yassir','lezzoo'],
 ['abjjad','hindawi'],['anghami','sowt','thmanyah'],['spacetoonyt','majidkids'],
 ['shahid','watchit','dubaiplus'],['marefa','arabency','mawdoo3']
];
function relatedDirectoryItems(x){
 const grouped=new Set(directoryComparisonGroups.filter(g=>g.includes(x.id)).flat());
 return items.filter(a=>a.id!==x.id&&(grouped.has(a.id)||(a.origin||[]).some(o=>(x.origin||[]).includes(o))))
  .map(a=>({item:a,score:(grouped.has(a.id)?4:0)+((a.origin||[]).some(o=>(x.origin||[]).includes(o))?2:0)+(a.type===x.type?1:0)}))
  .sort((a,b)=>b.score-a.score||a.item.name.localeCompare(b.item.name,'ar'))
  .slice(0,2).map(r=>r.item);
}

// Keep the task-specific Canva review alongside the shared comparison presentation.
function canvaTaskComparisonMarkup(x,standalone=false){
 if(!['dhawwi','taqreer','arabicdesign'].includes(x.id))return '';
 // Summaries of /guides/arabic-design, reviewed 12 October 2026.
 // Keep these task distinctions separate from the general similarity ranking.
 const notes={
  dhawwi:{task:'تصميم بالقوالب والنصوص العربية',fit:'جرّبه إذا أردت إعداد تصميم داخل محرر عربي.',check:'اختبر التصدير والترخيص؛ لم نتحقق من نقل قوالب Canva أو إعدادات فريقك إليه.'},
  taqreer:{task:'عروض وتقارير عربية',fit:'لإعداد شرائح؛ يعلن الموقع تصدير PowerPoint قابلًا للتعديل.',check:'راجع العربية والخطوط بعد التصدير، وحدود الخطة المجانية قبل الاعتماد عليها.'},
  arabicdesign:{task:'عبارات وتكوينات بالخط العربي',fit:'جرّبه كعنصر تضيفه إلى تصميمك الحالي، دون تغيير محرر التصميم.',check:'راجع الحروف والترخيص وإمكان تعديل الناتج، وحدود التجربة المجانية.'}
 };
 const choices=[x,...Object.keys(notes).filter(id=>id!==x.id).map(id=>items.find(a=>a.id===id))].filter(Boolean);
 return `<details class="detail-task-comparison">
  <summary><span><strong>قارن الخيارات لهذه المهمة</strong><small>تصميم كامل، أم عروض، أم خط عربي؟</small></span></summary>
  <div class="task-comparison-body">
   <p class="task-comparison-intro">هذه الأدوات تخدم مهام مختلفة. ابدأ بما تحتاجه؛ قد يناسبك بديل لمهمة واحدة، أو أداة مكمّلة، أو البقاء مع أداتك الحالية.</p>
   <ul class="task-comparison-list">${choices.map(a=>{const note=notes[a.id];return `<li>
    <div class="task-comparison-heading"><h4>${a.id===x.id?`<bdi>${a.name}</bdi>`:`<a href="/discover/${a.id}"${standalone?'':` onclick="return badilakOpenItem(event,'${a.id}')"`}><bdi>${a.name}</bdi></a>`}</h4>${hasPracticalTrial(a)?'<span class="trial-available">تجربة عملية</span>':''}${a.id===x.id?'<span class="task-comparison-current">تقرأ عنه الآن</span>':''}</div>
    <p class="task-comparison-task">${note.task}</p><p>${note.fit}</p><p class="task-comparison-check"><b>قبل الاعتماد:</b> ${note.check}</p>
   </li>`}).join('')}</ul>
   <p class="task-comparison-evidence">مبني على مراجعة 12 أكتوبر 2026؛ ليس اختبار أداء مستقلًا. <a href="/guides/arabic-design#decision">الشرح والمصادر</a></p>
   ${standalone?'<a class="detail-collection" href="/category/create?sub=design">عرض كل تصميم</a>':'<button type="button" class="detail-collection" onclick="openDiscoveryGroup(\'create\',\'design\')">عرض كل تصميم</button>'}
  </div>
 </details>`;
}
// End of the optional Canva comparison.

// Task distinctions reviewed against official sources on 16 October 2026.
// This is editorial guidance, not a comparative performance test.
function chatgptTaskComparisonMarkup(x,standalone=false){
 const notes={
  karnak:{task:'محادثة بالفصحى والمصرية',fit:'مرشح لتجربة الصياغة والسياق المصري؛ يقدمه مركز الابتكار التطبيقي كمساعد محادثة تجريبي.',check:'قارن إجابة على مهمة تعرف نتيجتها، ولا تعتبر جودة اللغة دليلًا على صحة المعلومات.',source:'https://www.aic.gov.eg/news/43/',label:'إعلان مركز الابتكار التطبيقي'},
  fanar:{task:'محادثة ومهام عربية متعددة الوسائط',fit:'يعرض الموقع محادثة وقدرات للنص والصوت والصورة؛ ابدأ بالميزة التي تحتاجها فعلًا.',check:'تحقق من إتاحة الميزة داخل حسابك ونتيجتها؛ أداء نموذج تفريغ الصوت لا يقيّم المحادثة كلها.',source:'https://fanar.qa/en',label:'فنار — القدرات المعلنة'},
  falcon:{task:'نموذج عربي وتجربة محادثة',fit:'يعرض المطور Falcon Arabic ورابطًا لتجربة المحادثة. بناء تطبيق بالنموذج مسار مختلف عن استخدام مساعد جاهز.',check:'تحقق من النموذج المستخدم في التجربة. وللتطوير، راجع الترخيص والاستضافة والتكامل قبل تقدير التكلفة.',source:'https://falconllm.tii.ae/falcon-arabic.html',label:'Falcon Arabic — صفحة المطور'},
  arabicai:{task:'حلول عربية للوثائق والعمل المؤسسي',fit:'ابدأ بمنتج محدد، مثل ترجمة المستندات، بدل مقارنة المنظومة كلها بمساعد محادثة واحد.',check:'اختبر مستندًا غير حساس؛ راجع التنسيق والتكلفة وشروط معالجة البيانات قبل دمجه في عمل المؤسسة.',source:'https://arabic.ai/ar/translate/',label:'Arabic.AI — ترجمة المستندات'}
 };
 if(!notes[x.id])return '';
 const choices=[x,...Object.keys(notes).filter(id=>id!==x.id).map(id=>items.find(a=>a.id===id))].filter(Boolean);
 return `<details class="detail-task-comparison">
  <summary><span><strong>قارن الخيارات لهذه المهمة</strong><small>محادثة، أم تطوير تطبيق، أم احتياج مؤسسي؟</small></span></summary>
  <div class="task-comparison-body">
   <p class="task-comparison-intro">ابدأ بما تريد إنجازه، لا باسم البديل. قد يناسبك البقاء مع أداتك الحالية، أو إضافة أداة عربية لمهمة محددة. العرض يوضح اختلاف الاستخدام، وليس ترتيبًا للجودة أو ضمانًا لاستبدال ChatGPT.</p>
   <ul class="task-comparison-list">${choices.map(a=>{const note=notes[a.id];return `<li>
    <div class="task-comparison-heading"><h4>${a.id===x.id?`<bdi>${a.name}</bdi>`:`<a href="/discover/${a.id}"${standalone?'':` onclick="return badilakOpenItem(event,'${a.id}')"`}><bdi>${a.name}</bdi></a>`}</h4>${hasPracticalTrial(a)?'<span class="trial-available">تجربة عملية</span>':''}${a.id===x.id?'<span class="task-comparison-current">تقرأ عنه الآن</span>':''}</div>
    <p class="task-comparison-task">${note.task}</p><p>${note.fit}</p>
    <p class="task-comparison-check"><b>قبل الاعتماد:</b> ${note.check}</p>
    <div class="task-comparison-evidence"><a href="${note.source}" target="_blank" rel="noopener noreferrer">${note.label}</a></div>
   </li>`}).join('')}</ul>
   <p class="task-comparison-check"><b>جرّب قبل الانتقال:</b> نفّذ مهمة واحدة بمدخلات غير حساسة تعرف كيف تراجعها. قارن صحة النتيجة والوقت اللازم لتصحيحها، ثم تحقق من نقل ملفاتك وسير عملك والتكلفة الفعلية. إذا لم يتحقق احتياجك، فلا داعي للانتقال.</p>
   <p class="task-comparison-evidence">مراجعة المصادر الرسمية: 16 أكتوبر 2026. القدرات منسوبة إلى مطوريها؛ لم نجر اختبار أداء مستقلًا أو نقل حسابات وملفات بين الخدمات.</p>
   ${standalone?'<a class="detail-collection" href="/category/tech?sub=ai">عرض خيارات الذكاء الاصطناعي</a>':'<button type="button" class="detail-collection" onclick="openDiscoveryGroup(\'tech\',\'ai\')">عرض خيارات الذكاء الاصطناعي</button>'}
  </div>
 </details>`;
}

function directoryDiscoveryMarkup(x,standalone=false){
 const taskComparison=chatgptTaskComparisonMarkup(x,standalone);
 if(taskComparison)return taskComparison;
 const comparison=canvaTaskComparisonMarkup(x,standalone);
 if(comparison)return comparison;
 const related=relatedDirectoryItems(x);
 const collectionLabel=x.sub&&x.sub!=='all'?subcategoryLabel(x.cat,x.sub):categoryLabel(x.cat);
 const choices=related.length?[x,...related]:[];
 return `<details class="detail-task-comparison">
  <summary><span><strong>${related.length?'قارن الخيارات لهذه المهمة':'هل يوجد خيار آخر يناسبك؟'}</strong><small>${related.length?'الفائدة، والتكلفة أو الإتاحة، وما يحتاج مراجعة':'ما نعرفه وحدود المقارنة المتاحة'}</small></span></summary>
  <div class="task-comparison-body">
   <p class="task-comparison-intro">${related.length?'هذه اختيارات مرتبطة باحتياجك، وليست بدائل متطابقة أو ترتيبًا للأفضل. قارن ما يقدمه كل خيار وما يتطلبه استخدامه؛ قد يناسبك استكمال أداتك الحالية بدل تغييرها.':'لا تتوفر لدينا مقارنة موثقة كافية لهذا الاستخدام حاليًا. لا يعني ذلك عدم وجود بدائل؛ يمكنك مراجعة المجال، مع التحقق من ملاءمة كل خيار لمهمتك.'}</p>
   ${choices.length?`<ul class="task-comparison-list">${choices.map(a=>{
    const note=decisionNoteFor(a);
    const evidence=(a.modules||[]).find(m=>m[0]==='مصادر التحقق المحفوظة');
    return `<li>
     <div class="task-comparison-heading"><h4>${a.id===x.id?`<bdi>${a.name}</bdi>`:`<a href="/discover/${a.id}"${standalone?'':` onclick="return badilakOpenItem(event,'${a.id}')"`}><bdi>${a.name}</bdi></a>`}</h4>${hasPracticalTrial(a)?'<span class="trial-available">تجربة عملية</span>':''}${a.id===x.id?'<span class="task-comparison-current">تقرأ عنه الآن</span>':''}</div>
     <p class="task-comparison-task">${a.value}</p>
     ${a.price?`<p><b>التكلفة:</b> ${a.price}</p>`:''}${a.availability?`<p><b>الإتاحة:</b> ${a.availability}</p>`:''}
     ${note?`<p class="task-comparison-check"><b>قبل الاختيار:</b> ${note.alert}</p>`:''}
     <div class="task-comparison-evidence">${a.reviewed?'آخر مراجعة محفوظة: '+a.reviewed+' · ':''}${evidence?evidence[1]:`<a href="${a.url}" target="_blank" rel="noopener noreferrer">المصدر الرسمي</a>`}</div>
    </li>`;
   }).join('')}</ul>`:''}
   ${related.length?'<p class="task-comparison-evidence">المعلومات من مراجعات الدليل المحفوظة، وليست اختبار أداء مستقلًا. راجع المصدر الحالي قبل الدفع أو نقل عملك.</p>':''}
  ${standalone?`<a class="detail-collection" href="/category/${x.cat}${x.sub&&x.sub!=='all'?'?sub='+encodeURIComponent(x.sub):''}">عرض كل ${collectionLabel}</a>`:`<button type="button" class="detail-collection" onclick="openDiscoveryGroup('${x.cat}','${x.sub||'all'}')">عرض كل ${collectionLabel}</button>`}
  </div>
 </details>`;
}

function geoContextMarkup(id){
 const note=geoContextNotes[id];
 return note?'<section class="detail-section geo-context"><h4>المنشأ والتسجيل</h4><div>'+note+'</div></section>':'';
}

function resolveCommercialLink(id,fallbackUrl){
 if(window.badilakCommercialResolve)return window.badilakCommercialResolve(id,fallbackUrl);
 return {url:fallbackUrl||'',affiliate:false,programUrl:'',status:'none'};
}

function commercialDisclosureMarkup(id){
 const x=items.find(a=>a.id===id);
 const r=resolveCommercialLink(id,x?.url||'');
 if(!r.affiliate)return '';
 return window.badilakCommercialDisclosureHTML
  ? window.badilakCommercialDisclosureHTML()
  : '<div class="commercial-disclosure"><strong>إفصاح تجاري</strong><span>قد نحصل على عمولة من رابط الإحالة، دون تأثير على الترتيب أو التقييم.</span></div>';
}

const flagAssetBase='/images/flags/';

const geoContextNotes={
 khamsat:'<b>لماذا علم بريطانيا؟</b> خمسات منتج عربي موجه للعالم العربي، لكن صفحته الرسمية تذكر أنه تابع لحسوب وأن Hsoub Limited مسجلة في المملكة المتحدة. العلم هنا يصف التسجيل القانوني للجهة المالكة، لا هوية المنتج أو جمهوره. <a href="https://khamsat.com/about" target="_blank" rel="noopener noreferrer">المصدر الرسمي</a>',
 hsoub:'<b>لماذا علم بريطانيا؟</b> حسوب تقول رسميًا إنها تأسست في المملكة المتحدة عام 2011، وفي الوقت نفسه تعرف مهمتها بأنها تطوير العالم العربي وبناء فرص العمل والتعليم والتواصل في المنطقة. لذلك نفصل بين بلد التأسيس والهوية السوقية العربية. <a href="https://www.hsoub.com/en/" target="_blank" rel="noopener noreferrer">عن حسوب</a>',
 'hsoub-youtube':'<b>لماذا علم بريطانيا؟</b> القناة التعليمية عربية المحتوى وتتبع أكاديمية حسوب؛ علم بريطانيا يعود إلى تسجيل/تأسيس الشركة الأم، وليس إلى لغة القناة أو جمهورها. <a href="https://www.hsoub.com/en/" target="_blank" rel="noopener noreferrer">عن حسوب</a>',
 'hsoub-library':'<b>لماذا علم بريطانيا؟</b> أكاديمية حسوب عربية المحتوى والجمهور، بينما حسوب تقول إنها تأسست في المملكة المتحدة عام 2011. العلم يصف تأسيس الشركة الأم، لا هوية المادة التعليمية. <a href="https://www.hsoub.com/en/" target="_blank" rel="noopener noreferrer">عن حسوب</a>',
 'khamsat-blog':'<b>لماذا علم بريطانيا؟</b> مدونة خمسات تخاطب سوق العمل الحر العربي، بينما خمسات تتبع حسوب المسجلة في المملكة المتحدة. العلم هنا قانوني/مؤسسي لا توصيفًا لهوية المحتوى. <a href="https://khamsat.com/about" target="_blank" rel="noopener noreferrer">عن خمسات</a>',
 'daftra-hub':'<b>لماذا علمان؟</b> مركز دفترة التعليمي يتبع منتج دفترة العربي، ولدينا حضور معلن للجهة في مصر والولايات المتحدة؛ لذلك نظهر الصلتين بدل اختزال الجهة في بلد واحد.',
 hindawi:'<b>لماذا يظهر علمان؟</b> مؤسسة هنداوي مسجلة كجهة خيرية في إنجلترا وويلز، ولها مقرّان رئيسيان في وندسور والقاهرة. وتذكر المؤسسة أنها بدأت أصلًا لمعالجة نقص مواد القراءة عالية الجودة بالعربية. <a href="https://www.hindawi.org/ar/about" target="_blank" rel="noopener noreferrer">عن المؤسسة</a>',
 taqreer:'<b>العلم يخص الجهة المشغلة.</b> شروط taqreer.ai تذكر أن الخدمة تشغلها PIXEL WOLVES LLC في وايومنغ بالولايات المتحدة، بينما المنتج نفسه مصمم للعروض بالعربية والإنجليزية ويدعم RTL. <a href="https://taqreer.ai/ar/terms" target="_blank" rel="noopener noreferrer">الشروط الرسمية</a>',
 arabicdesign:'<b>الإمارات هنا تسجيل ومقر.</b> سياسة الخصوصية الرسمية تنص على أن Arabic Design LLC مسجلة في الإمارات، بينما المنتج مخصص للخط والتصميم العربي. <a href="https://arabicdesign.ai/en/privacy-policy" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a>',
 midaad:'<b>هذا ليس إثباتًا لبلد التأسيس.</b> الموقع الرسمي يسعّر بالريال السعودي ويصف بعض المخرجات بأنها بذوق سعودي رسمي؛ لذلك نعرض صلة السعودية بالسوق والتصميم فقط، ونبقي بلد تسجيل الكيان قيد التحقق. <a href="https://midaadapp.com/" target="_blank" rel="noopener noreferrer">الموقع الرسمي</a>',
 marefa:'<b>المؤسسة أمريكية والمشروع عربي.</b> المعرفة موسوعة عربية أطلقها نايل الشافعي عام 2007. سجلات المؤسسة والعروض التعريفية المنشورة تضع Marefa Foundation في الولايات المتحدة؛ لذلك العلم يصف الجهة المؤسسية لا لغة الموسوعة أو هويتها. <a href="https://projects.propublica.org/nonprofits/organizations/270586032" target="_blank" rel="noopener noreferrer">سجلات المؤسسة</a>',
 shamela:'<b>العلم يخص مطوّر التطبيق الرسمي.</b> صفحة Google Play الرسمية للمكتبة الشاملة تعرض المطور بعنوان في مصر. لا نستخدم ذلك كدليل قاطع على بلد نشأة مشروع الشاملة كله. <a href="https://play.google.com/store/apps/details?id=com.arabdt.shamla" target="_blank" rel="noopener noreferrer">Google Play</a>',
 aamenn:'<b>مصر هنا صلة بالفريق والإطلاق.</b> المعلومات المتاحة تربط الفريق المؤسس بمصر، لكن بلد التسجيل القانوني للكيان لم يُحسم في مراجعتنا؛ لذلك لا نصفه قانونيًا بأنه شركة مصرية حتى يثبت ذلك.',
 daftra:'<b>لماذا علمان؟</b> دفترة منتج بهوية عربية طورته Izam Web Solutions، ولدينا حضور معلن للجهة في مصر والولايات المتحدة؛ لذلك نعرض الصلتين بدل اختزالها في بلد واحد.'
};

// Proposed learning exercises, not completed product tests. Use official sources and existing curated descriptions; availability is conditional.
const practicalTrials={
 "dhawwi": [
  "صمّم إعلانًا عربيًا قابلًا للتعديل",
  "اختر قالب منشور واكتب: «ورشة كتابة — السبت — من ٤ إلى ٦ مساءً». استخدم صورة تملك حق استخدامها.",
  "غيّر العنوان ولونًا واحدًا، ثم جرّب تنزيل التصميم بالصيغة المتاحة في حسابك.",
  "راجع اتصال الحروف والنقاط ووضوح الموعد على الهاتف. أعد المهمة نفسها في Canva وقارن وقت التعديل وجودة الملف.",
  "إذا نجح التصميم والتصدير، جرّبه لمهمة أخرى؛ هذا لا يثبت إمكان نقل قوالبك أو فريقك.",
  "https://www.dhawwi.com/"
 ],
 "taqreer": [
  "حوّل فكرة إلى ثلاث شرائح",
  "جهّز نصًا افتراضيًا: «ورشة كتابة؛ الهدف تحسين العناوين؛ نشاطها إعادة كتابة خبر؛ موعدها السبت ساعتين».",
  "اطلب ثلاث شرائح: الهدف، النشاط، الموعد. صحح النص ثم جرّب التصدير إذا أتاحته خطتك.",
  "هل أضاف أرقامًا أو وعودًا لم تكتبها؟ افتح الملف الناتج وراجع العربية والخطوط وإمكان تعديل عنوان.",
  "يناسبك إذا قلّ وقت تجهيز العرض دون فقد التحكم. لا تفترض أن التصدير متاح مجانًا.",
  "https://taqreer.ai/ar/ai-presentations"
 ],
 "arabicdesign": [
  "اختبر عبارة بخط عربي داخل تصميمك",
  "استخدم عبارة قصيرة من تأليفك مثل «مساحة للفكرة»، واختر النمط الذي يناسب منشورًا بسيطًا.",
  "أنشئ تكوينًا، وافحص حروفه قبل تنزيله؛ إن كانت الصيغة متاحة، أضفه إلى محرر التصميم الذي تستخدمه.",
  "هل ظهرت كل الحروف والنقاط؟ هل الخلفية والصيغة مناسبة؟ وهل يظل واضحًا بحجم صغير؟",
  "اعتبره عنصرًا مكمّلًا إذا نجح، لا بديلًا لمحرر كامل. راجع الرصيد وترخيص الاستخدام قبل النشر.",
  "https://arabicdesign.ai/ar"
 ],
 "midaad": [
  "اختبر ملف PDF من صفحتين",
  "أنشئ ملفًا تجريبيًا بنص عربي ورقم ١٢٣ وجدول صغير، دون أسماء أو بيانات حقيقية.",
  "اختر عملية PDF متاحة تحتاجها، مثل الدمج أو التحويل، ثم احتفظ بالأصل وافتح الناتج.",
  "قارن ترتيب الصفحات واتجاه العربية والأرقام والجدول. إذا جرّبت استخراج النص من صورة، قارن الكلمات بالأصل.",
  "استخدمه للعملية التي نجحت فقط؛ راجع حدود الرفع والتكلفة وسياسة الملفات قبل استخدام وثائق عمل.",
  "https://midaadapp.com/"
 ],
 "fanar": [
  "اختبر المعنى عند تغيير اللهجة",
  "اكتب: «الورشة يوم السبت الساعة الرابعة. التسجيل مطلوب، وعدد المقاعد غير مذكور».",
  "اطلب صياغة بالمصرية ثم بالفصحى، دون إضافة حقائق. اسأله بعدها عن عدد المقاعد.",
  "هل حافظ على الموعد وشرط التسجيل؟ هل اعترف بالمعلومة الناقصة؟ قارن النتيجة بمساعدك الحالي.",
  "اختَر حسب صحة المعنى ووقت التصحيح، وليس طلاقة الأسلوب وحدها. لا تستخدم معلومات خاصة.",
  "https://fanar.qa/en"
 ],
 "munsit": [
  "فرّغ دقيقة صوت تستطيع مراجعتها",
  "سجّل بصوتك دقيقة عن يوم عمل افتراضي، تتضمن اسمًا تخيليًا ورقمًا وموعدًا. احتفظ بالنص الصحيح للمقارنة.",
  "جرّب تفريغ التسجيل في الواجهة المتاحة لك، بعد التأكد من شروط الحساب وحدود الاستخدام.",
  "علّم الكلمات الخاطئة والأرقام المفقودة، واحسب وقت التصحيح. أعد المقارنة بالتسجيل نفسه في أداتك الحالية.",
  "إذا وفّر وقتًا مع لهجتك، وسّع العينة لاحقًا. لا ترفع تسجيلات أشخاص دون إذن أو محادثات عمل سرية.",
  "https://www.munsit.com/"
 ],
 "faseeh": [
  "حوّل جملة إلى صوت واضح",
  "اكتب نصًا من تأليفك: «تبدأ ورشة الكتابة يوم السبت في الرابعة مساءً، وتستمر ساعتين».",
  "جرّب تحويله إلى كلام بالصوت المتاح. استمع مرة دون النظر للنص، ثم راجع الكلمات واحدة واحدة.",
  "هل الوقت مفهوم؟ هل الوقفات طبيعية؟ جرّب ضبط علامات الترقيم وقارن الحاجة إلى إعادة التوليد.",
  "يناسبك إذا كانت القراءة واضحة للمهمة؛ راجع حقوق الصوت والتكلفة قبل النشر، ولا تستنسخ صوت شخص دون إذنه.",
  "https://www.munsit.com/text-to-speech-model"
 ],
 "wuilt": [
  "جهّز صفحة خدمة دون نشرها",
  "اكتب عنوان خدمة افتراضية ووصفًا وصورة تملكها وطريقة تواصل تجريبية.",
  "إن أتيح لك المحرر، أنشئ صفحة مسودة وعاينها على الهاتف دون ربط دومين أو تفعيل دفع.",
  "هل تستطيع تعديل النص والصورة بنفسك؟ هل زر التواصل واضح؟ دوّن ما يحتاج اشتراكًا وما يمكن نقله لاحقًا.",
  "اتخذ قرارك بعد اختبار التعديل والتكلفة الفعلية؛ لا تعتمد على مدة تجربة أو سعر ثابت في هذا التمرين.",
  "https://wuilt.com/"
 ],
 "salla": [
  "جهّز منتجًا تجريبيًا قبل تشغيل متجر",
  "اختر منتجًا افتراضيًا بصورتك ووصف قصير وسعر تدريبي، وحدد أين ستبيع.",
  "راجع شروط الإتاحة لبلدك؛ إن أتيح حساب تجربة، جهّز المنتج كمسودة وعاين صفحته دون نشر أو تفعيل دفع.",
  "راجع وضوح السعر والخيارات على الهاتف، ثم اكتب متطلبات الدفع والشحن والرسوم التي ستحتاجها فعليًا.",
  "لا يكفي جمال صفحة المنتج؛ أكمل فقط إذا كانت متطلبات بلدك وتكلفة التشغيل مناسبة.",
  "https://salla.com/"
 ],
 "khamsat": [
  "قارن خدمتين قبل الشراء",
  "حدّد مخرجًا واحدًا: تصميم منشور عربي واحد، مع ملف قابل للتعديل وموعد تسليم يناسبك.",
  "افتح خدمتين مناسبتين، واقرأ ما يشمله السعر والتعديلات ومعرض الأعمال؛ لا تشترِ أثناء التمرين.",
  "اكتب لكل خدمة: الملف المستلم، عدد التعديلات، الموعد، والتكلفة مع الإضافات. هل بقي شرط غير واضح؟",
  "اختَر بناءً على المخرج الكامل؛ إذا احتجت مشروعًا متعدد المراحل فقد يناسبك نموذج مختلف.",
  "https://support.khamsat.com/page/started-as-buyers"
 ],
 "mostaql": [
  "اكتب مشروعًا يمكن تسعيره بوضوح",
  "اكتب محليًا مسودة مشروع: خمس منشورات عربية لحملة افتراضية، مع الملفات المطلوبة وموعد واضح.",
  "راجع مشاريع مشابهة وأعمال مستقلين لفهم نطاق التنفيذ، دون نشر مشروع وهمي أو طلب عمل مجاني.",
  "هل تحدد المسودة ما سيُسلّم وكيف تقبله؟ افصل كتابة المحتوى عن التصميم إذا لم تكن المهمة واضحة.",
  "إذا استطعت تحديد المخرجات والميزانية، تكون المقارنة بين العروض أعدل؛ التمرين لا يثبت جودة مستقل بعينه.",
  "https://support.mostaql.com/page/how-to-get-started-as-employer"
 ],
 "edraak": [
  "حوّل درسًا إلى نتيجة صغيرة",
  "اختر مهارة محددة تحتاجها هذا الأسبوع، وراجع وصف دورة مناسبة ومستواها ومتطلباتها.",
  "إذا أتيح لك درس مناسب، شاهده ثم أغلقه وطبّق فكرة واحدة في مثال من عندك.",
  "هل خرجت بنتيجة تستطيع شرحها؟ سجّل النقطة التي لم تفهمها، وارجع للشرح بحثًا عن حلها.",
  "استمر إذا كان المستوى والوقت مناسبين؛ إكمال المشاهدة أو الحصول على شهادة لا يثبت إتقان المهارة.",
  "https://www.edraak.org/"
 ],
 "hsoub": [
  "عدّل مثالًا برمجيًا بدل نسخه فقط",
  "اختر درسًا تمهيديًا متاحًا يناسب مستواك، مثل صفحة HTML بسيطة؛ لا تبدأ بمشروع كبير.",
  "نفّذ المثال محليًا، ثم غيّر العنوان وأضف فقرة من عندك دون نسخ الحل.",
  "هل تستطيع تفسير ما تغيّر؟ إذا ظهر خطأ، هل يساعدك الشرح على تحديد سببه وإصلاحه؟",
  "الدرس مناسب إذا ساعدك على التطبيق والفهم. راجع متطلبات أي دورة مدفوعة قبل الاشتراك.",
  "https://academy.hsoub.com/learn-programming/"
 ],
 "hindawi": [
  "اختر كتابًا من تجربة قراءة قصيرة",
  "اختر موضوعًا يهمك، وافتح كتابًا مناسبًا ثم اقرأ الفهرس وبداية فصل.",
  "اقرأ نحو عشر دقائق، ثم اكتب فكرة واحدة وسؤالًا واحدًا دون الرجوع للنص.",
  "هل الأسلوب مناسب لك؟ هل تتذكر الفكرة وتعرف أين تستكمل؟ جرّب صيغة قراءة متاحة تناسب جهازك.",
  "استمر في الكتاب إذا وجدت قيمة فعلية؛ راجع بيانات الطبعة والترجمة وحقوق إعادة الاستخدام عند الاقتباس.",
  "https://www.hindawi.org/ar"
 ],
 "zotero": [
  "نظّم ثلاثة مراجع تستطيع استعادتها",
  "اختر ثلاثة مصادر عامة تستخدمها، مع عناوينها ومؤلفيها وروابطها؛ لا تبدأ بمكتبتك كلها.",
  "أضفها إلى مجموعة في Zotero بالطريقة المتاحة، واكتب ملاحظة عن فائدة كل مصدر ثم أنشئ قائمة مراجع.",
  "قارن المؤلف والتاريخ والعنوان بالمصدر الأصلي؛ هل تستطيع العثور على المرجع وملاحظتك بسرعة؟",
  "اعتمد سير العمل إذا سهّل الاسترجاع والتوثيق. البيانات المستوردة تحتاج مراجعة، ومزامنة الملفات لها حدود منفصلة.",
  "https://www.zotero.org/support/quick_start_guide"
 ],
 "sowt": [
  "اختبر حلقة تستحق وقت الاستماع",
  "اختر حلقة في موضوع يهمك، واقرأ وصفها ومدتها قبل تشغيلها.",
  "استمع لعشر دقائق، وسجّل فكرة أساسية وما إذا كانت الحلقة تشرح مصدرها أو تعرض تجربة شخصية.",
  "هل استطعت تلخيص الفكرة؟ هل تريد استكمال الحلقة للمعرفة أم للأسلوب فقط؟ كلاهما مقبول إذا وافق هدفك.",
  "احتفظ باسم الحلقة ورابطها للاستكمال؛ الرأي أو الشهادة الشخصية لا يصبح حقيقة مؤكدة بمجرد وروده في بودكاست.",
  "https://www.sowt.com/"
 ],
 "opensooq": [
  "قارن إعلانين دون التزام بالشراء",
  "اختر سلعة محددة تعرف مواصفاتها، وحدد مدينتك وميزانية تقديرية.",
  "قارن إعلانين من الفئة نفسها: الحالة والمواصفات والسعر ومكان المعاينة، دون إرسال بياناتك أو دفع عربون.",
  "اكتب المعلومات الناقصة والأسئلة المطلوبة. لا تعتبر السعر الأقل أفضل إذا كانت الحالة أو هوية البائع غير واضحة.",
  "هذه تجربة لفهم البحث والمقارنة فقط، وليست توصية ببائع أو إثباتًا لحماية شراء؛ تحقّق قبل أي تعامل.",
  "https://eg.opensooq.com/ar"
 ],
 "qdl": [
  "حوّل وثيقة تاريخية إلى ملاحظة موثقة",
  "ابحث عن مكان أو موضوع تاريخي تعرفه، واختر مادة لها وصف وتاريخ ومصدر واضح.",
  "اقرأ الوصف وافتح صورة المادة إن أتيحت، ثم سجّل التاريخ والجهة المنشئة ورابط السجل.",
  "افصل ما تقوله الوثيقة عمّا تستنتجه أنت؛ هل توجد معلومة ناقصة أو منظور يحتاج مصدرًا ثانيًا؟",
  "تصلح المادة للاستشهاد بعد فهم سياقها ومراجعة حقوق استخدامها؛ وجودها في الأرشيف لا يجعل كل ما فيها محايدًا.",
  "https://qdl.qa/العربية/"
 ],
 "abjjad": [
  "اختبر كتابًا قبل الاشتراك",
  "اختر عنوانًا تريد قراءته فعلًا، وراجع توفره وصيغته في بلدك.",
  "اقرأ الوصف وأي عينة متاحة؛ جرّب القراءة أو الاستماع إن كان حسابك يسمح.",
  "هل الحجم والصوت وطريقة القراءة مريحون؟ هل توجد كتب أخرى تحتاجها ضمن الخطة؟",
  "لا تشترك لمجرد كبر المكتبة؛ قارن احتياجك الفعلي والسعر والتجديد.",
  "https://www.abjjad.com/"
 ],
 "marefa": [
  "تتبّع مصدر معلومة موسوعية",
  "اختر موضوعًا غير حساس تعرف عنه قليلًا، واكتب سؤالًا واحدًا.",
  "اقرأ المقال وابحث عن مرجع يدعم الجواب، ثم افتح المرجع إن توفر.",
  "هل المرجع يقول المعنى نفسه؟ فرّق بين المعلومة المسندة والعبارة التي لا مصدر لها.",
  "استعمل الموسوعة كبداية بحث؛ لا تنقل ادعاءً مهمًا دون الرجوع لأصله.",
  "https://www.marefa.org/"
 ],
 "arabency": [
  "استخدم مدخلًا موسوعيًا لفهم مصطلح",
  "اختر مصطلحًا علميًا أو تاريخيًا، واكتب فهمك الأول له.",
  "ابحث عن المدخل واقرأ تعريفه وسياقه وبياناته التحريرية المتاحة.",
  "اشرح المصطلح في جملتين ثم راجع ما أخطأت فيه؛ دوّن ما يحتاج مصدرًا أحدث.",
  "يناسبك المرجع إذا وضّح المفهوم، ولا يغني عن مصدر حديث للمعلومات المتغيرة.",
  "https://arab-ency.com.sy/"
 ],
 "dorar": [
  "تتبّع تخريج حديث دون اختزال الحكم",
  "اختر حديثًا قصيرًا تريد معرفة مصدره وانسخ جزءًا مميزًا من نصه.",
  "ابحث في الموسوعة الحديثية واقرأ النص والراوي والمصدر وحكم المحدّث كما ورد.",
  "هل تطابق اللفظ؟ هل توجد روايات أو أحكام مختلفة؟ سجّلها مع نسبتها لأصحابها.",
  "لا تستخرج حكمًا فقهيًا من نتيجة بحث منفردة؛ ارجع لأهل الاختصاص فيما يحتاج فهمًا أو ترجيحًا.",
  "https://dorar.net/"
 ],
 "shamela": [
  "استخرج اقتباسًا بسياقه",
  "اختر كتابًا تعرف عنوانه وعبارة قصيرة تريد توثيقها.",
  "ابحث عن العبارة ثم اقرأ الفقرة قبلها وبعدها وسجّل الكتاب والجزء والصفحة وبيانات الطبعة المتاحة.",
  "هل العبارة للمؤلف أم نقل عن شخص آخر؟ هل تحتاج مراجعة صورة الطبعة؟",
  "النتيجة مفيدة إذا أمكن توثيقها؛ لا تعتبر تطابق البحث تصحيحًا للنص أو اعتمادًا لمضمونه.",
  "https://shamela.ws/"
 ],
 "shamaa": [
  "كوّن قائمة صغيرة لبحث تربوي",
  "حوّل اهتمامك إلى سؤال محدد، مثل استخدام القراءة الجماعية في مرحلة تعليمية.",
  "ابحث بكلمتين أو ثلاث، واقرأ ملخصي دراستين وبيانات النشر المتاحة.",
  "قارن الفئة والعينة والمنهج، لا العنوان وحده. هل الدراسة تجيب سؤالك بالفعل؟",
  "احتفظ بما يلائم السؤال؛ وجود سجل لا يعني إتاحة النص الكامل أو قوة الدليل.",
  "https://search.shamaa.org/"
 ],
 "mandumah": [
  "تحقق من ملاءمة رسالة قبل طلبها",
  "حدد موضوعًا تربويًا أو اجتماعيًا وسنة تقريبية تناسب بحثك.",
  "ابحث عن رسالة واقرأ بياناتها والملخص المتاح وشروط الوصول عبر جهتك.",
  "هل تتوافق الجامعة والتاريخ والمنهج مع احتياجك؟ هل النص متاح أم يحتاج اشتراك مؤسسة؟",
  "لا تدفع قبل التأكد من الإتاحة؛ فهرسة الرسالة لا تعني إمكان تنزيلها.",
  "https://www.mandumah.com/service/dissertation/"
 ],
 "openalex": [
  "اعثر على بحث ثم ارجع للناشر",
  "اكتب سؤالًا بحثيًا واختر كلمات مفتاحية واضحة.",
  "ابحث عن عمل مناسب، وسجّل العنوان والمؤلف والسنة ثم تتبّع رابط المصدر أو المعرّف المتاح.",
  "طابق البيانات مع صفحة الناشر؛ هل النسخة منشورة أم أولية؟ وهل الملخص مرتبط بسؤالك؟",
  "استعمل الفهرس للاكتشاف، لا للحكم على الجودة بعدد الاستشهادات وحده.",
  "https://openalex.org/"
 ],
 "thmanyah": [
  "ميّز تفسيرًا مفيدًا من رأي جذاب",
  "اختر مادة أو حلقة تتناول سؤالًا يهمك، واقرأ وصفها أولًا.",
  "شاهد أو استمع إلى مقطع متاح وسجّل ادعاءً واحدًا يستحق التحقق.",
  "هل ذُكر مصدر أم تجربة شخصية؟ هل تستطيع شرح حجة المتحدث وحدودها؟",
  "استكمل ما يفيد سؤالك؛ جودة الحوار وحدها لا تثبت صحة كل ادعاء.",
  "https://thmanyah.com/"
 ],
 "ithra": [
  "اختر نشاطًا يناسب هدفك ووقتك",
  "حدد هل تريد تعلم مهارة أم زيارة معرض أم حضور فعالية، وحدد المدينة والموعد.",
  "راجع نشاطًا في البرامج المعلنة واقرأ الفئة العمرية واللغة والمكان ومتطلبات التسجيل.",
  "هل النشاط متاح في موعدك؟ هل تحتاج حضورًا أو حجزًا أو رسومًا؟",
  "احتفظ برابط النشاط وتحقق من مواعيده قبل التحرك؛ هذا تمرين اختيار وليس حجزًا.",
  "https://www.ithra.com/ar"
 ],
 "edlal": [
  "اختبر شرحًا بمهمة من عملك",
  "اختر موضوعًا تدريبيًا تحتاجه، واكتب نتيجة صغيرة تريد الوصول إليها.",
  "راجع وصف المادة؛ إن أتيح درس، طبّق فكرة واحدة على مثال غير حساس.",
  "هل ساعدك الشرح على التنفيذ دون تقليد أعمى؟ ما الخطوة التي ظلت غامضة؟",
  "استمر إذا وجدت تطبيقًا يناسب مستواك؛ راجع الإتاحة الحالية قبل التسجيل.",
  "https://www.edlal.org/"
 ],
 "tadarab": [
  "قيّم دورة قبل الالتزام بها",
  "اكتب مهارة واحدة ومستواك الحالي والوقت المتاح أسبوعيًا.",
  "قارن وصف دورتين والمنهج وخبرة المدرب وأي معاينة متاحة، دون شراء.",
  "هل توجد تطبيقات تناسب هدفك؟ هل المتطلبات والمدة وسياسة الوصول واضحة؟",
  "اختَر الملاءمة العملية قبل الشهادة أو الخصم؛ لا تفترض إتاحة معاينة لكل دورة.",
  "https://www.tadarab.com/"
 ],
 "gomycode": [
  "قارن مسار تعلم بوقتك المتاح",
  "حدد هدفًا مثل بناء صفحة بسيطة، وخبرتك الحالية ومواعيدك.",
  "راجع منهج مسار مناسب في بلدك وطريقة الحضور والمشروع المطلوب.",
  "هل تستطيع تنفيذ المتطلبات والتفرغ؟ هل توجد تفاصيل كافية عن التدريب والدعم والتكلفة؟",
  "قبل التسجيل اطلب توضيح النواقص؛ هذا فحص للملاءمة وليس ضمانًا للتوظيف.",
  "https://gomycode.com/tn/"
 ],
 "mawdoo3": [
  "راجع مقالًا مع مصدره",
  "اختر موضوعًا عامًا غير طبي أو قانوني، واكتب السؤال الذي تريد إجابته.",
  "اقرأ فقرة تجيب السؤال ثم راجع تاريخ المقال وكاتبه ومراجعه المتاحة.",
  "هل يدعم المرجع الادعاء؟ اكتب الإجابة بأسلوبك مع رابط الأصل.",
  "استفد من الشرح كبداية، وتحقق مستقلًا من المعلومات الحساسة أو المتغيرة.",
  "https://mawdoo3.com/"
 ],
 "wuzzuf": [
  "حوّل إعلان وظيفة إلى خطة تجهيز",
  "حدد مسمى وظيفيًا ومدينة ومستوى خبرة مناسبًا لك.",
  "افتح إعلانين واقرأ المهارات المطلوبة والمهام وطريقة التقديم، دون إرسال سيرتك أثناء التمرين.",
  "قسّم الشروط إلى ما تتقنه وما تستطيع تعلمه وما لا يناسبك؛ دوّن مثالًا يثبت كل مهارة لديك.",
  "قدّم فقط بعد التحقق من الجهة وملاءمة الدور؛ لا تدفع مقابل وعد بوظيفة.",
  "https://wuzzuf.net/about-us"
 ],
 "bayt": [
  "اختبر البحث عن دور مناسب",
  "اكتب مسمى وظيفيًا وبلدًا ونوع عمل تحتاجه.",
  "قارن إعلانين بالمهام والخبرة المطلوبة، لا بالمسمى وحده.",
  "هل الإعلان حديث والجهة واضحة؟ هل تستطيع تقديم أمثلة حقيقية على المهارات المطلوبة؟",
  "احتفظ بالإعلان الأنسب وراجع الجهة قبل إرسال بياناتك؛ لا تضف مهارات لا تملكها.",
  "https://www.bayt.com/ar/"
 ],
 "nafezly": [
  "جهّز نطاق مشروع دون نشره",
  "اكتب وصفًا افتراضيًا لمهمة مثل تحرير فيديو قصير، مع طول الناتج والملفات المطلوبة.",
  "راجع مشاريع أو أعمالًا مشابهة لمعرفة التفاصيل التي تساعد المستقل على التسعير.",
  "هل حددت المدة والتعديلات وحقوق المواد وطريقة قبول النتيجة؟",
  "انشر فقط مشروعًا حقيقيًا بميزانية واضحة؛ لا تطلب نماذج مجانية مخصصة لإتمام التمرين.",
  "https://nafezly.com/"
 ],
 "qoyod": [
  "اختبر مسودة فاتورة بأرقام تدريبية",
  "جهّز عميلًا ومنتجين افتراضيين وأسعارًا يمكنك حسابها يدويًا.",
  "راجع نموذج الفاتورة في العرض المتاح؛ إن أتيح حساب تجربة، استخدم مسودة فقط دون إرسالها أو ربطها بجهة ضريبية.",
  "طابق الكميات والمجموع وطريقة تعديل الخطأ وإمكان تصدير البيانات.",
  "التجربة تقيس سهولة الاستخدام فقط؛ إعداد الضرائب والفواتير الحقيقية يحتاج مراجعة محاسب ومتطلبات بلدك.",
  "https://www.qoyod.com/"
 ],
 "daftra": [
  "تابع عملية بيع افتراضية من البداية",
  "جهّز منتجًا تدريبيًا وكمية وسعرًا واسم عميل وهميًا لا يخص شخصًا حقيقيًا.",
  "في بيئة تجربة إن توفرت، أنشئ مسودة عرض سعر وافحص بيانات المنتج دون إرسال أو تفعيل ربط حكومي.",
  "هل تستطيع مراجعة الإجمالي وتعديل الكمية والعثور على العملية لاحقًا؟",
  "لا تنقل حسابات العمل اعتمادًا على مثال واحد؛ افحص التصدير والصلاحيات مع المسؤول المالي أولًا.",
  "https://www.daftra.com/"
 ],
 "zid": [
  "راجع رحلة منتج قبل إطلاق متجر",
  "جهّز صورة تملكها ووصفًا لمنتج افتراضي وحدد بلد نشاطك.",
  "استكشف خطوات إنشاء المنتج أو العرض التجريبي، وراجع خيارات الدفع والشحن المطلوبة دون تفعيلها.",
  "هل تستطيع تقدير تكلفة التشغيل والوقت اللازم لإدارة طلب؟ ما الشروط التي لم تتضح؟",
  "لا تنشر متجرًا أو تربط دفعًا لهذا التمرين؛ اختر بعد تحقق ملاءمة بلدك ونشاطك.",
  "https://zid.sa/ar/"
 ],
 "expandcart": [
  "اختبر صفحة منتج بالعربية",
  "حضّر عنوان منتج افتراضي ووصفًا وصورة وميزة واحدة تريد إبرازها.",
  "إن أتيحت معاينة أو تجربة، جهّز مسودة وراجعها على الهاتف دون نشر.",
  "هل تظهر العربية والخيارات والسعر بوضوح؟ ما الميزات التي تحتاج باقة أو تطبيقًا إضافيًا؟",
  "قارن التكلفة الكاملة وسهولة التعديل قبل نقل متجرك أو ربط نطاقه.",
  "https://expandcart.com/ar/"
 ],
 "bosta": [
  "خطط لشحنة دون إنشاء طلب",
  "جهّز وزنًا وأبعادًا ومدينة إرسال واستلام افتراضية دون عنوان منزل حقيقي.",
  "راجع نطاق التغطية ومتطلبات الخدمة والتحصيل والمرتجعات من الموقع أو العرض المتاح.",
  "هل تستطيع تحديد الرسوم المحتملة ووقت التحصيل ومسؤولية المرتجع؟ سجّل ما يحتاج سؤالًا مباشرًا.",
  "لا تنشئ شحنة تجريبية فعلية؛ اتخذ القرار بعد عرض تكلفة وشروط واضحين.",
  "https://bosta.co/ar-eg/"
 ],
 "podeo": [
  "جهّز بداية حلقة قابلة للنشر لاحقًا",
  "سجّل دقيقة بصوتك عن موضوع تعرفه، واكتب عنوانًا ووصفًا دون مواد محمية للغير.",
  "استكشف أدوات الإنشاء والتوزيع المتاحة لك، واستخدم مسودة إن أمكن دون نشر الحلقة.",
  "هل تستطيع التحكم في الملف والعنوان والوجهات؟ هل تتضح حقوق المحتوى وشروط التوزيع؟",
  "اختَر سير العمل الذي يحفظ تحكمك؛ لا تعتبر وجود أدوات ربح ضمانًا للدخل.",
  "https://podeo.co/"
 ],
 "arabiaweather": [
  "حوّل توقع الطقس إلى خطة يومية",
  "اختر مدينتك وموعد نشاط عادي مثل المشي، دون الاعتماد عليه لقرار سلامة حساس.",
  "راجع التوقع بالساعة إن أتيح، وقارن الحرارة واحتمال المطر وتوقيت التحديث.",
  "هل التوقع للمدينة والوقت الصحيحين؟ راجع ما تغير عند اقتراب الموعد.",
  "التوقع احتمالي ويتغير؛ اتبع التحذيرات الرسمية في الظروف الخطرة.",
  "https://www.arabiaweather.com/ar"
 ],
 "noon": [
  "قارن منتجًا مطابقًا لا صورتين",
  "اختر رقم موديل محددًا لمنتج تعرفه وحدد بلد التسليم.",
  "قارن عرضين بالرقم نفسه، واقرأ اسم البائع والضمان والشحن والإرجاع دون إتمام شراء.",
  "هل السعر النهائي والمواصفات والحالة متطابقة؟ هل اختلاف البائع يغير الضمان؟",
  "هذه مقارنة عروض فقط؛ تحقق من البائع وشروطه قبل الدفع، ولا تعتمد على التقييم وحده.",
  "https://www.noon.com/egypt-ar/"
 ],
 "mumzworld": [
  "ابحث بمتطلبات الاستخدام قبل العلامة",
  "اختر منتجًا منزليًا بسيطًا للطفل وحدد العمر والمقاس المطلوبين.",
  "قارن صفحتين بالمقاس والخامة وتعليمات الاستخدام والإرجاع والتسليم.",
  "هل المعلومات كافية لمعرفة الملاءمة؟ ما الذي يحتاج الرجوع إلى الشركة المصنّعة؟",
  "لا تجعل وصف المتجر بديلًا عن تعليمات السلامة؛ التمرين لا يتطلب شراءً.",
  "https://www.mumzworld.com/en/"
 ],
 "fresh": [
  "قارن جهازين على احتياج منزلك",
  "حدّد نوع الجهاز والمساحة المتاحة والمواصفات التي تحتاجها، دون تسجيل عنوانك.",
  "قارن موديلين من الموقع الرسمي في الأبعاد والسعة والضمان وخدمة ما بعد البيع.",
  "هل رقم الموديل واضح؟ هل الجهاز يناسب المساحة؟ ما تكلفة التركيب أو المتطلبات غير المذكورة؟",
  "اطلب توضيح النواقص قبل الشراء؛ لا تختَر السعة الأكبر أو الخصم وحدهما.",
  "https://fresh.com.eg/"
 ],
 "bayut": [
  "حوّل بحث العقار إلى قائمة أسئلة",
  "حدد منطقة ونوع وحدة وميزانية تقريبية دون مشاركة بيانات شخصية.",
  "قارن إعلانين بالمساحة والموقع والرسوم والمرافق وبيانات المعلن.",
  "ما المعلومات الناقصة أو غير القابلة للتحقق من الصور؟ اكتب أسئلة المعاينة.",
  "لا تدفع أو تعتمد ملكية أو ترخيصًا من إعلان؛ هذه تجربة بحث فقط ويجب التحقق قبل أي التزام.",
  "https://www.bayut.com/ar/"
 ],
 "dabchy": [
  "قارن قطعة مستعملة بوضوح",
  "حدد نوع قطعة ومقاسًا وحالة مقبولة وميزانية تقديرية.",
  "راجع إعلانين مع الصور والوصف وسياسة التسليم والإرجاع المتاحة دون شراء.",
  "هل العيوب والمقاسات واضحة؟ هل السعر النهائي يشمل التسليم؟",
  "لا تعتبر الصورة إثباتًا للحالة؛ استكمل التحقق عبر آليات المنصة قبل التعامل.",
  "https://www.dabchy.com/"
 ]
};
function hasPracticalTrial(x){return x.id==='karnak'||!!practicalTrials[x.id];}
function practicalTrialMarkup(x){
 if(x.id!=='karnak'){
  const trial=practicalTrials[x.id];if(!trial)return '';
  const [title,prepare,run,check,decision,source]=trial;
  return `<details class="detail-task-comparison practical-trial" open>
   <summary><span><strong>جرّبه على مهمتك</strong><small>${title}</small></span></summary>
   <div class="task-comparison-body">
    <p class="task-comparison-intro">تمرين مقترح لتقييم الملاءمة بنفسك؛ ليس نتيجة اختبار أجريناه. راجع الإتاحة والتكلفة قبل البدء، ولا تحتاج إلى شراء شيء لإتمام مرحلة المقارنة.</p>
    <ol class="practical-trial-steps"><li><b>جهّز:</b> ${prepare}</li><li><b>جرّب:</b> ${run}</li><li><b>راجع النتيجة:</b> ${check}</li></ol>
    <p class="task-comparison-check"><b>قرارك بعد التجربة:</b> ${decision}</p>
    <p class="task-comparison-evidence"><a href="${source}" target="_blank" rel="noopener noreferrer">المصدر الرسمي</a> · إعداد التمرين: 18 أكتوبر 2026. خطوات التمرين من إعداد بديلك عربي؛ الإتاحة قد تختلف حسب الحساب والبلد.</p>
   </div>
  </details>`;
 }
 return `<details class="detail-task-comparison practical-trial" open>
  <summary><span><strong>جرّبه على مهمتك</strong><small>تمرين قصير: تلخيص وصياغة بالمصرية</small></span></summary>
  <div class="task-comparison-body">
   <p class="task-comparison-intro">هذا تمرين مقترح، وليس نتيجة اختبار أجريناه لكرنك. وصف المساعد لنفسه لا يثبت قدراته أو يحصره في التاريخ المصري.</p>
   <p><b>١. انسخ هذا الطلب في محادثة جديدة:</b></p>
   <blockquote class="practical-trial-prompt">لخّص الإعلان التالي في جملة واحدة، ثم أعد صياغته بالمصرية في جملتين. حافظ على الحقائق ولا تضف معلومات. إذا سُئلت عن معلومة غير مذكورة، قل إنها غير مذكورة.<br><br>إعلان افتراضي للتدريب: ينظّم فريق «مساحة» ورشة مجانية لكتابة المحتوى يوم السبت، من الرابعة إلى السادسة مساءً. الورشة عبر الإنترنت، والتسجيل مطلوب. لم يُحدد عدد المقاعد.</blockquote>
   <p><b>٢. اسأله بعدها:</b> كم عدد المقاعد المتاحة؟</p>
   <p><b>٣. راجع بنفسك:</b> هل بقي الموعد والمدة والمجانية والتسجيل صحيحين؟ هل كانت المصرية طبيعية لك؟ وهل قال إن عدد المقاعد غير مذكور بدل اختراع رقم؟</p>
   <p class="task-comparison-check">جرّب الطلب نفسه في أداتك الحالية. قارن صحة النتيجة والوقت الذي احتجته لتصحيحها. نجاح هذا المثال لا يثبت جودة الأداة في كل المهام؛ قبل الاعتماد، كرره على عينة من عملك دون بيانات حساسة.</p>
  </div>
 </details>`;
}

function directoryDetailMarkup(x,standalone=false){
 const special=specialDetails(x);
 // Keep every distinct fact; do not repeat the overview verbatim under a second label.
 const normalized=value=>String(value||'').replace(/\s+/g,' ').trim();
 const facts=(special?.facts||genericFacts(x)).filter(([,value])=>normalized(value)!==normalized(x.value));
 const sections=special?.sections||[];
 const destination=resolveCommercialLink(x.id,x.url);
 let markup=`
  <div class="detail-overview">
   <div class="detail-identity">${logoMarkup(x.logo,'detail-logo',x.name)}<h1 class="quick-title">${x.name}</h1>${countryBadgeMarkup(x)}</div>
   <p class="quick-purpose">${x.value}</p>
   ${practicalTrialMarkup(x)}
   ${decisionPanelMarkup(x)}
   <div class="detail-facts">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}
   ${editorialGuideLinkMarkup(x.id,true)}
   ${renderSections(x,sections)}
   <div class="detail-source-line"><span>${x.verified||''}</span><span>${x.reviewed?'آخر مراجعة: '+x.reviewed:''}</span></div>
   ${commercialDisclosureMarkup(x.id)}
   ${standalone?`<a class="destination-link" href="${destination.url}" target="_blank" rel="${destination.affiliate?'sponsored ':''}noopener noreferrer">`:`<button type="button" class="destination-link" aria-haspopup="dialog" aria-controls="outboundDialog" onclick="openExternal('${x.id}')">`}<span class="destination-label"><bdi>افتح ${x.name}</bdi><small>${x.domain}</small></span><span class="outbound-key">↗</span>${standalone?'</a>':'</button>'}
   ${directoryDiscoveryMarkup(x,standalone)}
  </div>`;
 // A service title is h1; the sections below it are h2, with their existing visual size.
 markup=markup.replace(/<(\/?)h4\b/g,'<$1h2');
 return standalone?markup.replace(/ onclick="[^"]*"/g,''):markup;
}


function originName(id){return ({adobeexpress:'Adobe Express',wix:'Wix',smallpdf:'Smallpdf',upwork:'Upwork',ebay:'eBay',chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini',kimi:'Kimi',deepseek:'DeepSeek',canva:'Canva',drive:'Google Drive',coursera:'Coursera',fiverr:'Fiverr',shopify:'Shopify',acrobat:'Acrobat',teams:'Teams',spotify:'Spotify',udemy:'Udemy',amazon:'Amazon',jumia:'Jumia',wikipedia:'Wikipedia',youtube:'YouTube',netflix:'Netflix',kindle:'Kindle',scholar:'Google Scholar',jstor:'JSTOR',quickbooks:'QuickBooks',elevenlabs:'ElevenLabs',otter:'Otter.ai',stripe:'Stripe',linkedin:'LinkedIn',googlemaps:'Google Maps',steam:'Steam'})[id]||id}

// One-line card previews only; complete descriptions remain unchanged in details.
function compactCardLine(value,max=44){
 const source=String(value||'').replace(/\s+/g,' ').trim();
 if(!source)return '';
 const sentence=(source.match(/^.*?[.!؟](?:\s|$)/)||[])[0]?.trim()||source;
 const characters=Array.from(sentence);
 if(characters.length<=max)return sentence;
 const head=characters.slice(0,max).join('');
 const lastSpace=head.lastIndexOf(' ');
 const short=lastSpace>=Math.floor(max*.6)?head.slice(0,lastSpace):head;
 return short.replace(/[،؛:.\s]+$/,'').trim()+'…';
}
// Card-only summaries based on the existing records. Full descriptions stay unchanged.
const cardDisplaySummaries={
  "zid":"إنشاء المتاجر وإدارة الطلبات والمنتجات.",
  "foodics":"نقاط بيع وإدارة الطلبات ومخزون المطاعم.",
  "expandcart":"إنشاء متجر إلكتروني وإدارته بالعربية.",
  "bosta":"شحن وتخزين طلبات التجارة الإلكترونية.",
  "mostaql":"توظيف مستقلين لتنفيذ مشاريعك عن بُعد.",
  "nafezly":"طرح مشاريعك واختيار مستقل لتنفيذها.",
  "bayt":"البحث عن وظائف حسب المهنة والبلد.",
  "floward":"طلب الزهور والهدايا وتوصيلها.",
  "jahez":"طلب الطعام ومتابعة التوصيل.",
  "arabiaweather":"توقعات ونشرات الطقس في الدول العربية.",
  "vezeeta":"البحث عن الأطباء وحجز المواعيد.",
  "fawry":"سداد الفواتير وقبول المدفوعات في مصر.",

  "karnak":"مساعد محادثة بالفصحى والمصرية.",
  "dhawwi":"محرر تصميم عربي للنصوص والخطوط.",
  "midaad":"تحرير مستندات PDF وتحويلها بالعربية.",
  "taqreer":"إنشاء عروض وتقارير بالعربية والإنجليزية.",
  "daftra":"إدارة الفواتير والمحاسبة والمخزون.",
  "gravity":"لعبة منصات من استوديو سعودي.",
  "shamaa":"قاعدة للأبحاث التربوية العربية.",
  "faseeh":"توليد تعليق صوتي عربي من النصوص.",
  "arabicdesign":"تصميم عبارات وخطوط عربية.",
  "qriib":"أدوات تعاون واجتماعات وذكاء اصطناعي.",
  "vconnct":"منظومة اتصال وتعاون للمؤسسات.",
  "paymob":"حلول لقبول المدفوعات الرقمية.",
  "wuzzuf":"منصة للبحث عن الوظائف في مصر.",
  "fanar":"ذكاء اصطناعي للنص والصوت والصورة.",
  "falcon":"نموذج لغوي عربي للمطورين والباحثين.",
  "arabicai":"أدوات مؤسسية للنص والوثائق والصوت.",
  "salla":"إنشاء المتاجر وإدارتها للسوق المحلي.",
  "edraak":"مساقات تعليمية باللغة العربية.",
  "mandumah":"قاعدة للدوريات والبحوث العربية.",
  "openalex":"أداة عالمية لاستكشاف البحوث العلمية.",
  "zotero":"أداة عالمية لتنظيم المراجع البحثية.",
  "fresh":"أجهزة منزلية من علامة مصرية.",
  "aamenn":"تخزين الملفات ومشاركتها.",
  "munsit":"تفريغ التسجيلات العربية إلى نص.",
  "anghami":"موسيقى ومحتوى صوتي عبر منصة عربية.",
  "hudhud":"خرائط وملاحة للعناوين المحلية.",
  "arabybot":"محادثات العملاء وأتمتة التواصل.",
  "khamsat":"شراء وبيع خدمات المستقلين.",
  "hsoub":"دروس عربية في البرمجة والتقنية.",
  "abjjad":"قراءة واستماع إلى كتب عربية.",
  "sowt":"بودكاست وقصص صوتية عربية.",
  "noon":"متجر إلكتروني لمنتجات متنوعة.",
  "opensooq":"إعلانات مبوبة للبيع والشراء المباشر.",
  "mumzworld":"تسوق منتجات الأم والطفل.",
  "spacetoonyt":"برامج ورسوم متحركة عربية للأطفال.",
  "majidkids":"برامج ورسوم متحركة للأطفال.",
  "marefa":"موسوعة عربية قابلة للمساهمة.",
  "arabency":"مرجع موسوعي عربي في العلوم والآداب.",
  "dorar":"بحث في الحديث والعلوم الشرعية.",
  "tafsircenter":"محتوى في التفسير وعلوم القرآن.",
  "shamela":"البحث في كتب التراث الإسلامي.",
  "hindawi":"كتب وأعمال عربية ومترجمة مجانًا.",
  "shahid":"أفلام ومسلسلات وبرامج عربية.",
  "watchit":"دراما وبرامج وأعمال مصرية.",
  "dubaiplus":"أفلام ومسلسلات وقنوات مباشرة.",
  "almaany":"معاجم عربية وترجمات ومصطلحات.",
  "unifonic":"تواصل العملاء عبر الرسائل والصوت.",
  "ithra":"مكتبة ومتاحف وبرامج ثقافية.",
  "thmanyah":"بودكاست ووثائقيات وبرامج عربية.",
  "alef":"منصة تعلم مدرسي بالذكاء الاصطناعي.",
  "bayut":"إعلانات عقارية للبيع والإيجار.",
  "dubaifuture":"تقارير استشراف وتقنيات ناشئة.",
  "qdl":"أرشيف رقمي لتاريخ الخليج والمنطقة.",
  "snoonu":"توصيل الطعام والتسوق والخدمات.",
  "kezakoo":"دروس وتمارين للثانوي المغربي.",
  "telmidtice":"دروس وتمارين للمدارس المغربية.",
  "chari":"محفظة ومدفوعات وخدمات مالية.",
  "benefit":"بنية مدفوعات وخدمات مالية بحرينية.",
  "tarabut":"بنية مصرفية مفتوحة للمؤسسات.",
  "bibf":"برامج مهنية في التمويل والإدارة.",
  "thawani":"حلول دفع إلكتروني للأفراد والتجار.",
  "emushrif":"تتبع الحافلات وإدارة النقل المدرسي.",
  "edlal":"دورات إلكترونية لتعلم مهارات متنوعة.",
  "tadarab":"دورات عربية مسجلة في مجالات متنوعة.",
  "myfatoorah":"روابط دفع وتكاملات للشركات.",
  "boutiqaat":"تسوق منتجات الجمال والموضة.",
  "gomycode":"مسارات لتعلم البرمجة والتقنية.",
  "expensya":"إدارة مصروفات الشركات وتقاريرها.",
  "dabchy":"بيع وشراء المستعمل بين الأفراد.",
  "yassir":"تنقل وتوصيل وخدمات يومية.",
  "ouedkniss":"إعلانات مبوبة للبيع والشراء.",
  "baridimob":"خدمات بريد الجزائر من الهاتف.",
  "miswag":"تسوق وتوصيل منتجات داخل العراق.",
  "lezzoo":"توصيل الطعام والبقالة وخدمات يومية.",
  "superqi":"تحويلات ومدفوعات وخدمات مالية.",
  "podeo":"إنشاء البودكاست وتوزيعه.",
  "mawdoo3":"مقالات عربية في موضوعات معرفية.",
  "qoyod":"محاسبة سحابية وفواتير ومخزون.",
  "wuilt":"إنشاء المواقع والمتاجر دون برمجة.",
  "lymonah":"بيع الدورات والمنتجات الرقمية.",
  "aafia":"إدارة العيادات والسجلات والمواعيد.",
  "forlanso":"إدارة خدمات المستقلين والعقود."
};
function compactCardPurpose(x){
 const manual={
  gravity:'لعبة منصات من استوديو سعودي.',
  dhawwi:'محرر تصميم عربي للنص والخطوط والقوالب.',
  fanar:'منصة ذكاء توليدي قطرية للنص والصوت والصورة.',
  daftra:'إدارة أعمال وفواتير ومحاسبة ومخزون في مكان واحد.',
  abjjad:'كتب عربية رقمية وصوتية للقراءة والاستماع.',
  sowt:'بودكاست وقصص صوتية عربية.'
 };
 return cardDisplaySummaries[x.id]||compactCardLine(manual[x.id]||x.value,44);
}

// Concise decision context, derived from each record's scope and existing limits.
// These describe the relationship; they are not ratings or claims of full equivalence.
const comparisonGuidance={
 karnak:['مساعد محادثة تجريبي','إطلاق تجريبي؛ الدقة لم تُختبر مستقلًا.'],
 fanar:['مساعد عربي متعدد الوسائط','التغطية اللغوية لا تعني دقة كل مهمة.'],
 falcon:['نموذج للمطورين والباحثين','يتطلب تشغيلًا تقنيًا؛ ليس واجهة محادثة جاهزة.'],
 arabicai:['حلول ذكاء اصطناعي للمؤسسات','قارن الخدمة المحددة داخل المنظومة.'],
 dhawwi:['محرر للتصميم بالعربية',''],
 taqreer:['متخصص في العروض العربية','المجاني يصمم أول 5 شرائح؛ راجع بقية حدود الخطة.'],
 arabicdesign:['متخصص في الخط والعبارات العربية','التجربة المجانية 7 أيام وبرصيد محدود.'],
 aamenn:['تخزين ومشاركة ملفات','التشفير معلن من المطور؛ لم نختبر الأمان مستقلًا.'],
 midaad:['أدوات للمستندات وملفات PDF','المجاني يضيف ختمًا خفيفًا للتصدير.'],
 qriib:['اجتماعات وتعاون عن بُعد','لم ننفذ تجربة استخدام مستقلة.'],
 vconnct:['اتصال وتعاون للمؤسسات','راجع متطلبات مؤسستك وخيارات التشغيل.'],
 salla:['إنشاء متجر وإدارة البيع','الباقات والتكاملات تختلف حسب السوق.'],
 wuilt:['إنشاء موقع أو متجر','الموقع التعريفي والمتجر لهما باقات مختلفة.'],
 khamsat:['سوق للخدمات المصغرة','راجع الأعمال السابقة وحدد طلبك بوضوح.'],
 forlanso:['إدارة خدمات المستقلين','عرض خدماتك لا يضمن وصول عملاء إليك.'],
 edraak:['مساقات للتعلم بالعربية','شروط الشهادة والإتاحة تختلف حسب الدورة.'],
 hsoub:['تعلم البرمجة بالعربية','قارن المسار المجاني والمدفوع حسب هدفك.'],
 edlal:['دورات مهارية بالعربية','راجع الدورات النشطة وشروطها الحالية.'],
 tadarab:['دورات عربية مسجلة','شهادة الإتمام لا تعني اعتمادًا أكاديميًا.'],
 gomycode:['تدريب تقني بمسارات محددة','البرامج والأسعار تختلف حسب المسار والبلد.'],
 anghami:['منصة لبث الموسيقى والصوت',''],
 sowt:['بودكاست وقصص صوتية عربية','شبكة محتوى صوتي؛ ليست مكتبة موسيقى عامة.'],
 thmanyah:['محتوى وبودكاست عربي','شبكة محتوى؛ تختلف وظائفها عن منصة بث عامة.'],
 noon:['سوق إلكتروني عام','الشحن والإرجاع يختلفان حسب البلد والبائع.'],
 opensooq:['إعلانات للبيع والشراء المباشر','تتعامل مع البائع؛ ليست تجربة متجر مركزي.'],
 mumzworld:['متجر متخصص للأم والطفل','قارن توفر الشحن والسعر لبلدك.'],
 miswag:['تسوق وتوصيل داخل العراق','راجع تغطية التوصيل وشروط المنتج.']
};
function directoryComparison(x,activeOrigin){
 const selected=typeof activeOrigin==='string'&&matchesDirectoryOrigin(x,activeOrigin);
 const reference=selected?activeOrigin:x.origin[0];
 const [fit,caution]=comparisonGuidance[x.id]||[x.type||'', ''];
 // Extra decision notes belong to the familiar-service journey; leave general browsing compact.
 return {reference,fit:selected?fit:'',caution:selected?caution:''};
}
const cardCautionOverrides={
 karnak:'إطلاق تجريبي؛ الدقة لم تُختبر مستقلًا.',
 dhawwi:'أرقام الاستخدام معلنة من الجهة نفسها.',
 midaad:'المجاني يضيف ختمًا خفيفًا للتصدير.',
 taqreer:'المجاني يصمم أول 5 شرائح؛ راجع بقية حدود الخطة.',
 daftra:'التقييمات المستقلة المتاحة محدودة.',
 gravity:'لم نجمع بعد مراجعات لاعبين مستقلة.',
 shamaa:'توفر النص الكامل يختلف حسب حقوق النشر.',
 faseeh:'جودة اللهجات لم تُختبر بما يكفي.',
 arabicdesign:'التجربة المجانية 7 أيام وبرصيد محدود.',
 qriib:'لم ننفذ تجربة استخدام مستقلة.',
 vconnct:'البيانات المستقلة المتاحة محدودة.',
 mandumah:'الوصول الكامل قد يحتاج اشتراكًا مؤسسيًا.',
 zotero:'راجع بيانات المصدر قبل اعتماد التوثيق.',
 salla:'الباقات والتكاملات تختلف حسب السوق.',
 edraak:'إتاحة الشهادة وشروطها تختلف حسب الدورة.',
 openalex:'استخدمه للاكتشاف، وراجع المصدر الأصلي.',
 paymob:'الرسوم ووسائل الدفع تختلف حسب السوق.',
 munsit:'القياس المنشور لا يقيّم الخدمة الحالية.',
 arabybot:'الأتمتة والتكاملات لم تُختبر مستقلًا.',
 arabicai:'الأداء يختلف بين منتجات المنظومة.',
 wuzzuf:'لم ننفذ تجربة استخدام مستقلة.',
 falcon:'لم ننفذ تجربة استخدام مستقلة.',
 anghami:'لم نراجع كل المحتوى وإصدارات التطبيق.',
 hudhud:'نطاق الإتاحة الجغرافي مهم عند المقارنة.',
 khamsat:'راجع الأعمال السابقة وحدد طلبك بوضوح.',
 fanar:'التغطية اللغوية لا تعني دقة كل مهمة.',
 hsoub:'قارن المجاني والمدفوع حسب هدفك ووقتك.',
 noon:'الشحن والسعر يختلفان حسب البلد والمنتج.',
 opensooq:'تحقق من البائع والدفع قبل إتمام الصفقة.',
 mumzworld:'متجر متخصص للأم والطفل، لا سوق عام.',
 spacetoonyt:'راجع ملاءمة الحلقة لعمر الطفل.',
 majidkids:'راجع ملاءمة الحلقة لعمر الطفل.',
 marefa:'راجع المراجع الأصلية قبل الاعتماد.',
 arabency:'حداثة المواد تختلف حسب الموضوع.',
 dorar:'لا تختزل المسألة في نتيجة بحث واحدة.',
 tafsircenter:'مصدر قرآني متخصص، لا يغطي كل العلوم الشرعية.',
 shamela:'وجود الكتاب لا يعني اعتماد كل محتواه.',
 hindawi:'التوافر يتغير حسب حقوق النشر.',
 shahid:'المكتبة والإتاحة تختلف حسب البلد.',
 watchit:'الأسعار والمكتبة قد تتغير.',
 dubaiplus:'الإتاحة تتغير مع حقوق العرض.',
 almaany:'المعنى الصحيح يعتمد على السياق.'
};
function directoryCardMarkup(x,activeOrigin=null){
 const {reference,fit}=directoryComparison(x,activeOrigin);
 return `
  <article class="item" data-item-id="${x.id}">
   <a class="item-identity" href="/discover/${x.id}" onclick="return badilakOpenItem(event,'${x.id}')">
    ${logoMarkup(x.logo,'item-logo',x.name)}
    <span class="item-name">${x.name}</span>
   </a>
   ${countryBadgeMarkup(x)}
   <div class="comparison-strip ${reference?'':'is-empty'}">${reference?`<span>إذا كنت تستخدم</span><bdi class="origin-mini">${originName(reference)}</bdi>`:''}</div>
   ${fit?`<p class="card-fit">${fit}</p>`:''}
   <div class="card-summary">
    <p class="card-purpose">${compactCardPurpose(x)}</p>
   </div>
   <div class="card-primary-actions">
    <div class="card-info-actions ${relatedGuideMap[x.id]?'':'is-single'}">
     <button class="more-btn" type="button" aria-haspopup="dialog" aria-controls="detailModal" onclick="openDetail('${x.id}')" aria-label="${hasPracticalTrial(x)?'معلومات وتجربة عملية عن':'معلومات عن'} ${x.name}">${hasPracticalTrial(x)?'معلومات وتجربة':'معلومات'}</button>
     ${relatedGuideMap[x.id]?`<div class="card-guide-slot">${editorialGuideLinkMarkup(x.id)}</div>`:''}
    </div>
    <button type="button" class="destination-link" aria-haspopup="dialog" aria-controls="outboundDialog" onclick="openExternal('${x.id}')"><span class="destination-label"><bdi>${x.name}</bdi><small>${x.domain}</small></span><span class="outbound-key">↗</span></button>
   </div>
  </article>`;}
