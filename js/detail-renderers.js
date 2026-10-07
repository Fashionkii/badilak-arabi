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
  return `<div class="country-badge-slot">${entries.map(info=>`<span class="country-badge"><img src="${flagAssetBase+info[0]+'.png'}" alt=""><bdi>${String(info[1]||'').split('·')[0].trim()}</bdi></span>`).join('')}</div>`;
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
 const href=guide?guide[0]:'/guides';
 const content=detail
  ? `<span>اقرأ</span><strong>${guide?guide[1]:'اقرأ حسب حاجتك'}</strong>`
  : `<strong>${guide?'اقرأ':'مركز القراءة'}</strong>`;
 return `<a class="editorial-guide-link ${detail?'is-detail':'card-read-link'}" href="${href}" onclick="event.stopPropagation()">${content}<b aria-hidden="true">←</b></a>`;
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

function relatedDirectoryItems(x){
 return items
  .filter(a=>a.id!==x.id)
  .map(a=>{
   let score=0;
   if(a.cat===x.cat)score+=4;
   if(a.cat===x.cat&&a.sub===x.sub)score+=7;
   if((a.origin||[]).some(o=>(x.origin||[]).includes(o)))score+=3;
   if(a.type===x.type)score+=1;
   return {item:a,score};
  })
  .filter(r=>r.score>0)
  .sort((a,b)=>b.score-a.score||a.item.name.localeCompare(b.item.name,'ar'))
  .slice(0,2)
  .map(r=>r.item);
}

function directoryDiscoveryMarkup(x){
 const related=relatedDirectoryItems(x);
 const collectionLabel=x.sub&&x.sub!=='all'?subcategoryLabel(x.cat,x.sub):categoryLabel(x.cat);
 if(!related.length)return '';
 return `<section class="detail-discovery">
  <div class="detail-discovery-head"><h4>قبل الانتقال</h4><p>إذا أردت المقارنة، فهذه خيارات قريبة من نفس الاستخدام.</p></div>
  <div class="detail-related-grid">${related.map(a=>`<a class="detail-related" href="/discover/${a.id}" onclick="return badilakOpenItem(event,'${a.id}')"><strong>${a.name}</strong><small>${a.value}</small></a>`).join('')}</div>
  <button type="button" class="detail-collection" onclick="openDiscoveryGroup('${x.cat}','${x.sub||'all'}')">عرض كل ${collectionLabel}</button>
 </section>`;
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

function directoryDetailMarkup(x){
 const special=specialDetails(x);
 const facts=special?.facts||genericFacts(x);
 const sections=special?.sections||[];
 return `
  <div class="detail-overview">
   <div class="detail-identity">${logoMarkup(x.logo,'detail-logo',x.name)}<h1 class="quick-title">${x.name}</h1>${countryBadgeMarkup(x)}</div>
   <p class="quick-purpose">${x.value}</p>
   <div class="detail-facts">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}    ${decisionPanelMarkup(x)}
   ${editorialGuideLinkMarkup(x.id,true)}
   ${renderSections(x,sections)}
   <div class="detail-source-line"><span>${x.verified||''}</span><span>${x.reviewed?'آخر مراجعة: '+x.reviewed:''}</span></div>
   ${commercialDisclosureMarkup(x.id)}
   <button class="destination-link" onclick="openExternal('${x.id}')"><span class="destination-label"><bdi>افتح ${x.name}</bdi><small>${x.domain}</small></span><span class="outbound-key">↗</span></button>
   ${directoryDiscoveryMarkup(x)}
  </div>`;
}


function originName(id){return ({chatgpt:'ChatGPT',canva:'Canva',drive:'Google Drive',coursera:'Coursera',fiverr:'Fiverr',shopify:'Shopify',acrobat:'Acrobat',teams:'Teams',spotify:'Spotify',udemy:'Udemy',amazon:'Amazon',jumia:'Jumia',wikipedia:'Wikipedia',youtube:'YouTube',netflix:'Netflix',kindle:'Kindle',scholar:'Google Scholar',jstor:'JSTOR',quickbooks:'QuickBooks',elevenlabs:'ElevenLabs',otter:'Otter.ai',stripe:'Stripe',linkedin:'LinkedIn',googlemaps:'Google Maps',steam:'Steam'})[id]||id}

function compactCardPurpose(x){
 const manual={
  gravity:'لعبة منصات من استوديو سعودي.',
  dhawwi:'محرر تصميم عربي للنص والخطوط والقوالب.',
  fanar:'منصة ذكاء توليدي قطرية للنص والصوت والصورة.',
  daftra:'إدارة أعمال وفواتير ومحاسبة ومخزون في مكان واحد.',
  abjjad:'كتب عربية رقمية وصوتية للقراءة والاستماع.',
  sowt:'بودكاست وقصص صوتية عربية.'
 };
 if(manual[x.id])return manual[x.id];
 const raw=String(x.value||'').trim();
 if(!raw)return '';
 const sentence=(raw.match(/^.*?[.!؟](?:\s|$)/)||[])[0]?.trim()||raw;
 if([...sentence].length<=105)return sentence;
 const head=sentence.slice(0,105);
 const cuts=[head.lastIndexOf('،'),head.lastIndexOf('؛'),head.lastIndexOf(':')].filter(i=>i>=42);
 const cut=cuts.length?Math.max(...cuts):-1;
 if(cut>0)return sentence.slice(0,cut).replace(/[،؛:]\s*$/,'').trim()+'.';
 return sentence.slice(0,92).replace(/\s+\S*$/,'').trim()+'…';
}

function directoryCardMarkup(x){return `
  <article class="item" data-item-id="${x.id}">
   <a class="item-identity" href="/discover/${x.id}" onclick="return badilakOpenItem(event,'${x.id}')">
    ${logoMarkup(x.logo,'item-logo',x.name)}
    <span class="item-name">${x.name}</span>
   </a>
   ${countryBadgeMarkup(x)}
   <div class="comparison-strip ${x.origin[0]?'':'is-empty'}">${x.origin[0]?`<span>إذا كنت تستخدم</span><span class="origin-mini">${originName(x.origin[0])}</span>`:''}</div>
   <div class="card-summary">
    <p class="card-purpose">${compactCardPurpose(x)}</p>
   </div>
   <div class="card-guide-slot">${editorialGuideLinkMarkup(x.id)}</div>
   <div class="card-primary-actions">
    <button class="more-btn" aria-expanded="false" onclick="openCardShelf('${x.id}',this)">تفاصيل +</button>
    <button class="destination-link" onclick="openExternal('${x.id}')"><span class="destination-label"><bdi>${x.name}</bdi><small>${x.domain}</small></span><span class="outbound-key">↗</span></button>
   </div>
  </article>`;}
