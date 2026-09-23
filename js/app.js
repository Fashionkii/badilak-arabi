/* main-runtime */
function officialFavicon(domain){
 return `https://www.google.com/s2/favicons?sz=256&domain_url=${encodeURIComponent('https://'+domain)}`;
}
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

const itemCountryMap={
 karnak:['eg','مصر'],qriib:['eg','مصر'],vconnct:['eg','مصر'],paymob:['eg','مصر'],wuzzuf:['eg','مصر'],fresh:['eg','مصر'],arabybot:['eg','مصر'],watchit:['eg','مصر'],aamenn:['eg','مصر · فريق/إطلاق'],
 daftra:[['eg','مصر'],['us','الولايات المتحدة']],
 gravity:['sa','السعودية'],dhawwi:['sa','السعودية'],midaad:['sa','السعودية · السوق/التسعير'],salla:['sa','السعودية'],mandumah:['sa','السعودية'],hudhud:['sa','السعودية'],tafsircenter:['sa','السعودية'],dorar:['sa','السعودية'],shahid:['sa','السعودية'],unifonic:['sa','السعودية'],ithra:['sa','السعودية'],thmanyah:['sa','السعودية'],shamela:['eg','مصر · مطوّر التطبيق الرسمي'],
 faseeh:['ae','الإمارات'],munsit:['ae','الإمارات'],falcon:['ae','الإمارات'],arabicdesign:['ae','الإمارات · تسجيل ومقر'],noon:['ae','الإمارات'],mumzworld:['ae','الإمارات'],spacetoonyt:['ae','الإمارات'],majidkids:['ae','الإمارات'],dubaiplus:['ae','الإمارات'],alef:['ae','الإمارات'],bayut:['ae','الإمارات'],dubaifuture:['ae','الإمارات'],marefa:['us','الولايات المتحدة · المؤسسة'],
 edraak:['jo','الأردن'],arabicai:['jo','الأردن'],opensooq:['jo','الأردن'],abjjad:['jo','الأردن'],sowt:['jo','الأردن'],almaany:['jo','الأردن'],mawdoo3:['jo','الأردن'],
 shamaa:['lb','لبنان'],anghami:['lb','لبنان'],podeo:['lb','لبنان · تأسيس وحضور'],
 fanar:['qa','قطر'],qdl:['qa','قطر'],snoonu:['qa','قطر'],
 kezakoo:['ma','المغرب'],telmidtice:['ma','المغرب'],chari:['ma','المغرب'],
 benefit:['bh','البحرين'],tarabut:['bh','البحرين'],bibf:['bh','البحرين'],
 thawani:['om','عُمان'],emushrif:['om','عُمان'],edlal:['om','عُمان'],
 tadarab:['kw','الكويت'],myfatoorah:['kw','الكويت'],boutiqaat:['kw','الكويت'],
 gomycode:['tn','تونس'],expensya:['tn','تونس · تأسيس'],dabchy:['tn','تونس'],
 yassir:['dz','الجزائر'],ouedkniss:['dz','الجزائر'],baridimob:['dz','الجزائر'],
 miswag:['iq','العراق'],lezzoo:['iq','العراق'],superqi:['iq','العراق'],
 arabency:['sy','سوريا'],
 taqreer:['us','الولايات المتحدة · تسجيل المشغّل'],openalex:['us','الولايات المتحدة'],zotero:['us','الولايات المتحدة'],
 khamsat:['gb','بريطانيا · تسجيل حسوب'],hsoub:['gb','بريطانيا · تأسيس/تسجيل'],
 hindawi:[['gb','بريطانيا · تسجيل المؤسسة'],['eg','مصر · مقر القاهرة']]
};
const learningCountryMap={
 yanfaa:['eg','مصر'],'edraak-learning':['jo','الأردن'],rwaq:['sa','السعودية'],almentor:['ae','الإمارات'],
 'salla-academy':['sa','السعودية'],'qoyod-academy':['sa','السعودية'],'daftra-hub':[['eg','مصر'],['us','الولايات المتحدة']],
 'khamsat-blog':['gb','بريطانيا · تسجيل حسوب'],'hsoub-library':['gb','بريطانيا · تسجيل حسوب'],
 zamerican:['eg','مصر'],droosonline:['eg','مصر'],elzero:['eg','مصر'],makram:['eg','مصر'],
 'hsoub-youtube':['gb','بريطانيا · تسجيل حسوب'],'akhdar-youtube':['eg','مصر'],'khan-arabi':['us','الولايات المتحدة'],
 'abdulbasit-official':['eg','مصر'],'hussary-official':['eg','مصر'],'mostafa-ismail-official':['eg','مصر'],
 'maher-official':['sa','السعودية'],'saad-ghamdi-official':['sa','السعودية'],'alafasy-official':['kw','الكويت'],
 'misk-skills':['sa','السعودية'],'thmanyah-youtube':['sa','السعودية'],
 'alef-learning':['ae','الإمارات'],'dff-academy':['ae','الإمارات'],
 'qdl-youtube':['qa','قطر'],
 'kezakoo-learning':['ma','المغرب'],'telmidtice-learning':['ma','المغرب'],
 'bibf-learning':['bh','البحرين'],'edlal-learning':['om','عُمان'],
 'tadarab-learning':['kw','الكويت'],'gomycode-learning':['tn','تونس'],
 'cnfepd-learning':['dz','الجزائر'],'newton-learning':['iq','العراق'],
 'kamkalima-learning':['lb','لبنان · انطلاقة/فريق']
};
const flagAssetBase='/images/flags/';
function countryEntries(info){
 if(!info)return [];
 return Array.isArray(info[0])?info:[info];
}
function countryInfoHasCode(info,code){
 return countryEntries(info).some(v=>v&&v[0]===code);
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
const originRouteMap={
  chatgpt:{cat:'tech',sub:'ai'},
  canva:{cat:'create',sub:'design'},
  drive:{cat:'tech',sub:'infra'},
  coursera:{cat:'learn',sub:'courses'},
  fiverr:{cat:'work',sub:'services'},
  shopify:{cat:'work',sub:'commerce'},
  acrobat:{cat:'work',sub:'management'},
  teams:{cat:'work',sub:'management'},
  spotify:{cat:'culture',sub:'podcasts'},
  udemy:{cat:'learn',sub:'courses'},
  amazon:{cat:'shopping',sub:'marketplaces'},
  jumia:{cat:'shopping',sub:'marketplaces'},
  wikipedia:{cat:'learn',sub:'encyclopedias'},
  youtube:{cat:'culture',sub:'kids'},
  netflix:{cat:'culture',sub:'drama'},
  kindle:{cat:'culture',sub:'books'},
  scholar:{cat:'learn',sub:'research'},
  jstor:{cat:'learn',sub:'research'}
};
const categoryNames={all:'كل الاكتشافات',work:'العمل والمشاريع',shopping:'التسوّق والأسواق',learn:'التعلّم والبحث',create:'المحتوى والإبداع',culture:'الثقافة والترفيه',tech:'تقنيات وابتكارات'};
const subfilterMap={
 work:[['all','الكل'],['management','إدارة وتشغيل'],['services','خدمات وعمل حر'],['commerce','تجارة وبيع']],
 shopping:[['all','الكل'],['marketplaces','أسواق عامة'],['classifieds','بيع وشراء مباشر'],['specialized','متاجر متخصصة']],
 learn:[['all','الكل'],['courses','تعلم ومهارات'],['research','بحث ومصادر'],['encyclopedias','موسوعات'],['islamic','مصادر إسلامية'],['language','لغة ومعاجم']],
 create:[['all','الكل'],['writing','كتابة'],['design','تصميم'],['audio','صوت']],
 culture:[['all','الكل'],['books','كتب'],['drama','دراما ومشاهدة'],['kids','أطفال'],['games','ألعاب'],['podcasts','بودكاست']],
 tech:[['all','الكل'],['ai','ذكاء اصطناعي'],['infra','بنية رقمية'],['software','برمجيات']]
};

const items=[
{id:"karnak",name:"كرنك",logo:officialFavicon("karnak.aic.gov.eg"),type:"إطلاق تجريبي",cat:"tech",sub:"ai",origin:["chatgpt"],value:"مساعد محادثة مصري بُني للفصحى والمصرية. يستحق تجربة مباشرة إذا كان السياق المحلي والعربي جزءا من شغلك.",arabRelation:"العربية والمصرية في صلب الفكرة",creator:"مركز الابتكار التطبيقي : وزارة الاتصالات المصرية",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"طور بالاستفادة من نماذج مفتوحة. لم تختبر دقة إجاباته، ولا يثبت المصدر أن إصدار النموذج المنشور هو نفسه إصدار كل جلسة محادثة.",url:"https://karnak.aic.gov.eg/",domain:"karnak.aic.gov.eg",modules:[["الواجهة والمخرجات","لم تفحص واجهة الحساب · فصحى ومصرية بحسب إعلان المطور"],["الدليل المتاح","إطلاق تجريبي رسمي من مركز الابتكار التطبيقي · لا توجد بعد عينة عامة مستقلة كافية للحكم على الجودة"],["مصادر التحقق المحفوظة","<a href=\"https://www.aic.gov.eg/news/43/\" target=\"_blank\" rel=\"noopener noreferrer\">إعلان الإطلاق التجريبي</a> · <a href=\"https://huggingface.co/Applied-Innovation-Center/Karnak-40B-v1.0\" target=\"_blank\" rel=\"noopener noreferrer\">بطاقة إصدار النموذج</a>"]]},
{id:"dhawwi",name:"ضوّي",logo:officialFavicon("dhawwi.com"),type:"تصميم عربي",cat:"create",sub:"design",origin:["canva"],value:"محرر تصميم عربي أونلاين يضع النص والخطوط والقوالب العربية في الواجهة، بدل إصلاح العربية بعد انتهاء التصميم.",arabRelation:"واجهة وتجربة تصميم عربية من البداية",creator:"بدأ ضوّي من الرياض في 2026، ويعمل فريقه بين الرياض والقاهرة ودبي.",availability:"راجع الخطة الحالية وشروط التصدير في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 17 سبتمبر 2026",reviewed:"17 سبتمبر 2026",limit:"يعرض الموقع 400+ قالب و32 خطا عربيا و7 أدوات ذكاء و12 ألف مصمم نشط. هذه أرقام منشورة من الجهة نفسها، وليست تدقيقا مستقلا.",url:"https://www.dhawwi.com/",domain:"dhawwi.com",modules:[["الواجهة والمخرجات","عربية · تصاميم وصور ونصوص عربية"],["الدليل المتاح","400+ قالب و32 خطا عربيا بحسب الموقع · لم نجد عينة مستقلة كبيرة تكفي لتقييم الجودة"],["مصادر التحقق المحفوظة","<a href=\"https://www.dhawwi.com/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي والخصائص المعلنة</a>"]]},
{id:"midaad",name:"مِداد",logo:officialFavicon("midaadapp.com"),type:"مستندات عربية",cat:"work",sub:"management",origin:["acrobat"],value:"مساحة عمل عربية للمستندات: تحرير PDF، تحويل إلى Word، OCR وتلخيص وترجمة، كلها من واجهة تبدأ من العربية.",arabRelation:"مستندات وOCR بالعربية من صلب المنتج",creator:"منصة عربية تعرض تسعيرها بالريال وتصف مخرجاتها بذوق سعودي؛ بلد تسجيل الكيان لم يُحسم بعد.",availability:"الباقة المجانية: 3 ملفات يوميًا حتى 25 MB، مع رصيد محدود للذكاء وOCR.",price:"مجاني بحدود / احترافي 29 ر.س شهريًا",verified:"مصدر رسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"الباقة المجانية تضيف ختمًا خفيفًا في تذييل التصدير، وتسمح بـ3 ملفات يوميًا حتى 25 MB مع رصيد محدود للذكاء وOCR. التصدير بلا ختم في الباقة الاحترافية.",url:"https://midaadapp.com/",domain:"midaadapp.com",modules:[["الواجهة والمخرجات","عربية · PDF وWord ونصوص وملخصات عربية"],["الدليل المتاح","قدرات معلنة رسميا · لا توجد عينة مستقلة كافية لدينا لجودة التحويل"],["مصادر التحقق المحفوظة","<a href=\"https://midaadapp.com/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"taqreer",name:"taqreer.ai",logo:officialFavicon("taqreer.ai"),type:"عروض عربية",cat:"create",sub:"design",origin:["canva"],value:"مولد عروض وتقارير بالعربية والإنجليزية، مناسب لمن يريد شرائح تحترم RTL والهوية بدل إعادة ترتيب كل شريحة يدويا.",arabRelation:"إنشاء عروض بالعربية مع RTL وتعديل الهوية",creator:"تشغّلها PIXEL WOLVES LLC المسجلة في وايومنغ بالولايات المتحدة؛ المنتج نفسه عربي أولًا ويدعم الإنجليزية.",availability:"المجاني حتى 5 شرائح لكل عرض، وتصدير PNG فقط.",price:"مجاني بعلامة مائية / Plus من 9$ شهريًا",verified:"مصدر رسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"في الخطة المجانية: حتى 5 شرائح لكل عرض، وتصدير PNG فقط بعلامة مائية. إزالة العلامة وباقي صيغ التصدير ضمن الخطط المدفوعة.",url:"https://taqreer.ai/ar/ai-presentations",domain:"taqreer.ai",modules:[["الواجهة والمخرجات","عربية وإنجليزية · عروض وتقارير قابلة للتعديل"],["الدليل المتاح","الخصائص معلنة في الموقع الرسمي · لا نملك بعد مراجعات مستقلة كافية للحكم على جودة التصميم"],["مصادر التحقق المحفوظة","<a href=\"https://taqreer.ai/ar/ai-presentations\" target=\"_blank\" rel=\"noopener noreferrer\">صفحة العروض الرسمية</a> · <a href=\"https://taqreer.ai/en\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"daftra",name:"دفترة",logo:officialFavicon("daftra.com"),type:"خدمة/منتج رقمي",cat:"work",sub:"management",origin:["quickbooks"],value:"نظام إدارة أعمال بهوية عربية: فواتير ومحاسبة ومخزون وعملاء في مكان واحد، مع دعم متطلبات محلية في عدة أسواق عربية.",arabRelation:"إدارة أعمال صممت للسوق العربي ومتطلباته",creator:"طورته Izam Web Solutions مع وجود معلن في مصر والولايات المتحدة.",availability:"تجربة 14 يوما بحسب الموقع، دون بطاقة ائتمان.",price:"مدفوع + تجربة",verified:"مصدر رسمي — مراجعة 17 سبتمبر 2026",reviewed:"17 سبتمبر 2026",limit:"App Store مصر يعرض 4.2/5 من 49 تقييما وقت المراجعة. Capterra يعرض 3.0/5 لكن من مراجعة واحدة فقط، لذلك لا يصح تقديمه كحكم عام.",url:"https://www.daftra.com/",domain:"daftra.com",modules:[["الواجهة والمخرجات","عربية وإنجليزية · فواتير وتقارير وإدارة أعمال"],["الدليل المتاح","خصائص رسمية + إشارات جمهور عامة · 4.2/5 على App Store مصر من 49 تقييما؛ عينة Capterra غير كافية"],["مصادر التحقق المحفوظة","<a href=\"https://www.daftra.com/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a> · <a href=\"https://www.daftra.com/en/about-daftra-en/\" target=\"_blank\" rel=\"noopener noreferrer\">عن الشركة</a> · <a href=\"https://apps.apple.com/eg/app/accounting-software-daftra/id1347814396\" target=\"_blank\" rel=\"noopener noreferrer\">App Store مصر</a> · <a href=\"https://www.capterra.com/p/244865/Daftra/\" target=\"_blank\" rel=\"noopener noreferrer\">Capterra</a>"]]},
{id:"gravity",name:"Gravity Error",logo:"material:sports_esports",type:"لعبة ألغاز",cat:"culture",sub:"games",origin:["steam"],value:"لعبة منصات من استوديو سعودي، مثال صغير على أن الألعاب العربية ليست مجرد تعريب لمنتج أجنبي.",arabRelation:"إنتاج سعودي مستقل",creator:"Semaphore : استوديو تطوير سعودي",availability:"يشير المطور إلى إصدار PlayStation 4؛ راجع الإتاحة في متجر بلدك.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"لم تختبر اللعبة ولم تجمع مراجعات لاعبين ضمن هذه المراجعة. وصف النوع لا يعد تصنيفا عمريا.",url:"https://www.semaphorelab.com/gravity-error",domain:"semaphorelab.com",modules:[["الواجهة والمخرجات","إنجليزية · لغة اللعبة تحتاج مراجعة نسخة المتجر"],["الدليل المتاح","صفحة المطور الرسمية · لم نجمع بعد عينة مراجعات لاعبين مستقلة"],["مصادر التحقق المحفوظة","<a href=\"https://www.semaphorelab.com/gravity-error\" target=\"_blank\" rel=\"noopener noreferrer\">صفحة اللعبة لدى المطور</a> · <a href=\"https://www.semaphorelab.com/\" target=\"_blank\" rel=\"noopener noreferrer\">التعريف بالاستوديو</a>"]]},
{id:"shamaa",name:"شمعة",logo:officialFavicon("search.shamaa.org"),type:"قاعدة بحثية",cat:"learn",sub:"research",origin:["scholar","jstor"],value:"لو تبحث عن دراسة تربوية عربية قبل أن تذهب إلى قواعد أجنبية أوسع، شمعة نقطة بداية متخصصة في الإنتاج التربوي العربي.",arabRelation:"تركيز عربي متخصص في التربية",creator:"شبكة المعلومات العربية التربوية",availability:"إتاحة النص الكامل تختلف حسب السجل وحقوق الناشر.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"إدراج الرسالة يسهل العثور عليها؛ تقييم منهجها ونتائجها يظل مهمة بحثية مستقلة.",url:"https://search.shamaa.org/",domain:"search.shamaa.org",modules:[["الواجهة والمخرجات","عربية وإنجليزية · دراسات بالعربية والإنجليزية والفرنسية"],["الدليل المتاح","شبكة بحثية عربية ومصادرها الرسمية · لا يقاس المنتج بتقييم نجوم؛ القيمة في التغطية والفهرسة"],["مصادر التحقق المحفوظة","<a href=\"https://shamaa.org/ara/submit-to-shamaa/\" target=\"_blank\" rel=\"noopener noreferrer\">نطاق الدراسات ومعايير القبول</a> · <a href=\"https://search.shamaa.org/\" target=\"_blank\" rel=\"noopener noreferrer\">البحث في شمعة</a>"]]},
{id:"faseeh",name:"فصيح Faseeh",logo:"material:mic",type:"تعليق صوتي",cat:"create",sub:"audio",origin:["elevenlabs"],value:"للتعليق الصوتي العربي، هذه تجربة تستحق الاختبار قبل اللجوء لصوت أجنبي معرّب. ركّز على النطق والوقفات واللهجة المطلوبة.",arabRelation:"توليد صوت عربي من البداية",creator:"CNTXT AI : مقرها الإمارات",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"لم يظهر في المصادر التي تمت مراجعتها تقييم مستقل كاف لجودة هذا الإصدار في المصرية أو الخليجية. نتائج Munsit للتفريغ الصوتي لا تقيس جودة فصيح.",url:"https://munsit.com/text-to-speech-model",domain:"munsit.com",modules:[["الواجهة والمخرجات","عربية وإنجليزية · توليد صوت عربي بحسب المطور"],["الدليل المتاح","الوظائف معلنة رسميا لدى Munsit · لا توجد عينة مستقلة كافية حاليا لجودة اللهجات"],["مصادر التحقق المحفوظة","<a href=\"https://munsit.com/text-to-speech-model\" target=\"_blank\" rel=\"noopener noreferrer\">وظائف توليد الصوت</a> · <a href=\"https://munsit.com/about-us\" target=\"_blank\" rel=\"noopener noreferrer\">الجهة المطورة</a>"]]},
{id:"arabicdesign",name:"ArabicDesign.ai",logo:officialFavicon("arabicdesign.ai"),type:"أداة تصميم",cat:"create",sub:"design",origin:["canva"],value:"إذا كان النص العربي داخل التصميم هو نقطة الضعف، فهذه أداة بُنيت حول الحروف والنقاط والتشكيل لا حول صورة جميلة فقط.",arabRelation:"النص العربي هو قلب المنتج",creator:"Arabic Design LLC؛ شركة مسجلة في الإمارات ومقرها دبي، ومنتجها ArabicDesign.ai مخصص للتصميم والخط العربي.",availability:"10 نقاط مجانية لمدة 7 أيام بعد تفعيل الحساب.",price:"10 نقاط/7 أيام مجانًا؛ باقات من 15$",verified:"مصدر رسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"التجربة المجانية 10 نقاط لمدة 7 أيام. الإنشاء وإعادة التوليد وبعض العمليات مثل القوالب والتحويل إلى Vector تستهلك نقاطًا؛ الباقات المدفوعة تبدأ من 15$.",url:"https://arabicdesign.ai/ar",domain:"arabicdesign.ai",modules:[["الواجهة والمخرجات","عربية وإنجليزية · تصميم عبارات وخطوط عربية"],["الدليل المتاح","المطور يعلن حفظ النص حتى 95% مع بقاء احتمال الخطأ · لم نجد عينة مراجعات مستقلة كبيرة بما يكفي"],["مصادر التحقق المحفوظة","<a href=\"https://arabicdesign.ai/ar\" target=\"_blank\" rel=\"noopener noreferrer\">صفحة الأداة بالعربية</a> · <a href=\"https://arabicdesign.ai/en\" target=\"_blank\" rel=\"noopener noreferrer\">صفحة الأداة بالإنجليزية</a> · <a href=\"https://arabic.design/about-arabic-design/\" target=\"_blank\" rel=\"noopener noreferrer\">صفحة الجهة</a>"]]},
{id:"qriib",name:"Qriib",logo:officialFavicon("qriib.com"),type:"منظومة عمل",cat:"work",sub:"management",origin:["teams"],value:"حزمة عمل واتصال وذكاء اصطناعي بهوية عربية أولا. مناسبة للفضولي الذي يريد رؤية بديل إقليمي لمنظومات العمل المعتادة.",arabRelation:"عربي أولا بحسب الجهة",creator:"عنوان معلن في مصر؛ توصف المنظومة بأنها عربية أولا.",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"التعريف مبني على المصادر المتاحة؛ لم تجر تجربة استخدام مستقلة.",url:"https://qriib.com/en/home",domain:"qriib.com",modules:[["الواجهة والمخرجات","إنجليزية؛ تعلن العربية أولا · الدعم العربي بحسب المنتج"],["الدليل المتاح","الموقع الرسمي · لم تنفذ تجربة مستقلة كاملة للحزمة"],["مصادر التحقق المحفوظة","<a href=\"https://qriib.com/en/home\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"vconnct",name:"V.connct SPACE",logo:officialFavicon("vconnct.me"),type:"حل للمؤسسات",cat:"work",sub:"management",origin:["teams"],value:"منظومة تعاون واتصال مصرية للمؤسسات. تستحق المراجعة عندما يكون الاستضافة المحلية والعمل المؤسسي أهم من اسم الأداة الأشهر.",arabRelation:"منشأ مصري وحضور مؤسسي",creator:"🇪🇬 منشأ مصري",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"احتفظ بهذا النموذج من المرجع الأصلي. الصفحة لم توفر نصا كافيا في المراجعة الحالية؛ لا نعتمد عدد التطبيقات أو اكتمال التعريب دون تحقق إضافي.",url:"https://vconnct.me/en/products/v-space",domain:"vconnct.me",modules:[["الواجهة والمخرجات","لم يكتمل التحقق الحالي · تحتاج مراجعة الحزمة المطلوبة"],["الدليل المتاح","الموقع الرسمي · لم تكتمل مراجعة الواجهة والحزم"],["مصادر التحقق المحفوظة","<a href=\"https://vconnct.me/en/products/v-space\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"paymob",name:"Paymob",logo:officialFavicon("paymob.sa"),type:"مدفوعات للأعمال",cat:"work",sub:"commerce",origin:["stripe"],value:"لو تقبل مدفوعات في المنطقة، Paymob ليس مجرد اسم محلي: هو جزء من البنية التي تربط التجارة بطرق دفع يفهمها السوق.",arabRelation:"مبني لمدفوعات وأسواق المنطقة",creator:"تأسس المشروع في القاهرة؛ يعمل في أسواق متعددة.",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"تختلف الوسائل والرسوم وشروط القبول بحسب السوق؛ لا يفترض تطابق الخدمة في كل بلد.",url:"https://www.paymob.sa/en/about-us",domain:"paymob.sa",modules:[["الواجهة والمخرجات","عربية وإنجليزية · لا ينطبق عليها تقييم جودة توليد العربية"],["الدليل المتاح","مصادر الشركة والمنتج · الجودة تعتمد على السوق والعقد والدعم؛ تحتاج مقارنة حسب بلدك"],["مصادر التحقق المحفوظة","<a href=\"https://www.paymob.sa/en/about-us\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"wuzzuf",name:"WUZZUF",logo:officialFavicon("wuzzuf.net"),type:"توظيف",cat:"work",sub:"services",origin:["linkedin"],value:"منصة توظيف مصرية تربطك بسوق عمل محلي لا يظهر بنفس العمق في منصات التوظيف العالمية.",arabRelation:"سوق وظائف محلي فعلي",creator:"BasharSoft؛ انطلقت المنصة في مصر.",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"التعريف مبني على المصادر المتاحة؛ لم تجر تجربة استخدام مستقلة.",url:"https://wuzzuf.net/about-us",domain:"wuzzuf.net",modules:[["الواجهة والمخرجات","إنجليزية في الصفحات المفحوصة · لغة إعلان الوظيفة يحددها ناشره"],["الدليل المتاح","الموقع الرسمي · قيمة التجربة ترتبط بتخصصك وعدد الوظائف المتاحة وقت البحث"],["مصادر التحقق المحفوظة","<a href=\"https://wuzzuf.net/about-us\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"fanar",name:"فنار Fanar",logo:"/images/fanar-logo.png",type:"تعرف إليه",cat:"tech",sub:"ai",origin:["chatgpt"],value:"منصة ذكاء توليدي قطرية تستهدف العربية عبر النص والصوت والصورة. مرشح مهم عندما تريد مقارنة تجربة عربية مع الأدوات العالمية.",arabRelation:"تركيز عربي متعدد الوسائط",creator:"معهد قطر لبحوث الحوسبة : جامعة حمد بن خليفة",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"التغطية اللغوية المعلنة لا تكفي للحكم على دقة كل مهمة. راجع إصدار الخدمة ونتيجة الاستخدام.",url:"https://fanar.qa/en",domain:"fanar.qa",modules:[["الواجهة والمخرجات","صفحة مفحوصة بالإنجليزية · العربية ولهجاتها بحسب المطور"],["الدليل المتاح","الموقع الرسمي ووصف المنتج · نحتاج اختبارا مستقلا قبل الحكم على الجودة"],["مصادر التحقق المحفوظة","<a href=\"https://fanar.qa/en\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"falcon",name:"Falcon Arabic",logo:officialFavicon("falconllm.tii.ae"),type:"نموذج تقني",cat:"tech",sub:"ai",origin:["chatgpt"],value:"نموذج لغوي عربي من الإمارات للمطورين والباحثين. قيمته الأساسية أنه يضع العربية في صلب النموذج لا كطلب ترجمة لاحق.",arabRelation:"نموذج موجه للعربية",creator:"معهد الابتكار التكنولوجي : TII",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"التعريف مبني على المصادر المتاحة؛ لم تجر تجربة استخدام مستقلة.",url:"https://falconllm.tii.ae/falcon-arabic.html",domain:"falconllm.tii.ae",modules:[["الواجهة والمخرجات","إنجليزية · فصحى ولهجات بحسب بطاقة المطور"],["الدليل المتاح","بطاقات وإعلانات رسمية · التقييم الحقيقي يحتاج benchmark واستخداما محددا"],["مصادر التحقق المحفوظة","<a href=\"https://falconllm.tii.ae/falcon-arabic.html\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"arabicai",name:"Arabic.AI",logo:officialFavicon("arabic.ai"),type:"خدمات للمؤسسات",cat:"tech",sub:"ai",origin:["chatgpt"],value:"منظومة مؤسسية للنص والوثائق والصوت بالعربية. تستحق المتابعة خصوصا للفرق التي تحتاج OCR أو ترجمة أو صوتا عربيا على نطاق كبير.",arabRelation:"Arabic-first للمؤسسات",creator:"انطلقت المنظومة من عمّان عام 2008 باسم Tarjama قبل تطورها إلى Arabic.AI.",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"يراجع كل منتج على حدة؛ لا نمنح المنظومة كلها درجة واحدة لأداء العربية.",url:"https://arabic.ai/ar/",domain:"arabic.ai",modules:[["الواجهة والمخرجات","عربية وإنجليزية · العربية بحسب الخدمة"],["الدليل المتاح","الموقع ينشر قدرات ونتائج benchmark خاصة به · النتائج المنشورة تحتاج قراءة منهجية قبل اعتبارها مقارنة مستقلة"],["مصادر التحقق المحفوظة","<a href=\"https://arabic.ai/ar/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"salla",name:"سلة",logo:officialFavicon("salla.com"),type:"تجارة إلكترونية",cat:"work",sub:"commerce",origin:["shopify"],value:"بدل تركيب متجر عالمي ثم تكييفه مع السوق الخليجي، سلة تبدأ من التجارة المحلية والدفع والشحن في المنطقة.",arabRelation:"تجارة إلكترونية مبنية للسوق السعودي والخليجي",creator:"🇸🇦 السعودية",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"قارن الباقة والتكاملات وبلدان الخدمة قبل الانتقال؛ لم تختبر إدارة متجر كامل ضمن هذه المراجعة.",url:"https://salla.com/",domain:"salla.com",modules:[["الواجهة والمخرجات","عربية؛ صفحة إنجليزية متاحة · محتوى المتجر يحرره صاحبه"],["الدليل المتاح","الموقع الرسمي · الملاءمة تعتمد على بلد التشغيل وحجم المتجر والتكاملات"],["مصادر التحقق المحفوظة","<a href=\"https://salla.com/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"edraak",name:"إدراك",logo:officialFavicon("edraak.org"),type:"منصة تعلم",cat:"learn",sub:"courses",origin:["coursera","udemy"],value:"منصة عربية للتعلم المجاني، وتقريرها الأخير يذكر أكثر من 300 مساق و26.5 مليون تسجيل في المساقات.",arabRelation:"تعلم عربي مجاني على نطاق واسع",creator:"🇯🇴 الأردن",availability:"راجع شروط الإتاحة في الموقع.",price:"مجاني/حسب المسار",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"راجع متطلبات الدورة وإتاحة الشهادة في صفحتها؛ لا نعادل الشهادة تلقائيا بمؤهل أكاديمي.",url:"https://www.edraak.org/",domain:"edraak.org",modules:[["الواجهة والمخرجات","عربية · دورات تعليمية بالعربية"],["الدليل المتاح","تقرير أثر رسمي 2026 · Google Play يعرض نحو 3.9/5 من أكثر من 9 آلاف مراجعة"],["مصادر التحقق المحفوظة","<a href=\"https://www.edraak.org/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"mandumah",name:"دار المنظومة",logo:officialFavicon("mandumah.com"),type:"قاعدة معرفة",cat:"learn",sub:"research",origin:["scholar","jstor"],value:"قاعدة معرفية سعودية تجعل الرسائل والدوريات العربية أقرب للباحث الذي لا يريد أن يبدأ كل مرة من قاعدة أجنبية.",arabRelation:"محتوى أكاديمي عربي متخصص",creator:"🇸🇦 السعودية",availability:"نصوص كاملة أو مستخلصات وإتاحة جزئية؛ الوصول قد يعتمد على اشتراك المؤسسة.",price:"بحسب الوصول",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"وجود المستخلص لا يعني توافر الرسالة كاملة. ارجع إلى المصدر قبل الاقتباس والتوثيق.",url:"https://www.mandumah.com/service/dissertation/",domain:"mandumah.com",modules:[["الواجهة والمخرجات","عربية وإنجليزية · رسائل ودراسات؛ اللغة حسب السجل"],["الدليل المتاح","الموقع الرسمي · القيمة في التغطية والإتاحة أكثر من تقييم النجوم"],["مصادر التحقق المحفوظة","<a href=\"https://www.mandumah.com/service/dissertation/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"openalex",name:"OpenAlex",logo:officialFavicon("openalex.org"),type:"اكتشاف الأبحاث",cat:"learn",sub:"research",origin:["scholar"],value:"أداة عالمية مساعدة، وليست بديلا عربيا. نحتفظ بها لأنها توسع البحث عندما تحتاج أن تربط الإنتاج العربي بالمشهد العلمي العالمي.",arabRelation:"مصدر عالمي مساعد — ليس عربيًا",creator:"OurResearch : مشروع عالمي لفهرسة المعرفة العلمية",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر عالمي مساعد — ليس بديلاً عربيًا",reviewed:"14 سبتمبر 2026",limit:"مصدر مساعد للاكتشاف؛ راجع الورقة الأصلية وبياناتها قبل إدراجها في قائمة المراجع.",url:"https://openalex.org/",domain:"openalex.org",modules:[["الواجهة والمخرجات","التوثيق بالإنجليزية · فهرسة متعددة اللغات؛ تحقق من كل سجل"],["الدليل المتاح","مشروع عالمي مفتوح · تظهر كأداة مساندة لا كواجهة للهوية"],["مصادر التحقق المحفوظة","<a href=\"https://openalex.org/\" target=\"_blank\" rel=\"noopener noreferrer\">فتح محرك البحث</a> · <a href=\"https://help.openalex.org/\" target=\"_blank\" rel=\"noopener noreferrer\">التعريف والتوثيق</a>"]]},
{id:"zotero",name:"Zotero",logo:officialFavicon("zotero.org"),type:"إدارة المراجع",cat:"learn",sub:"research",origin:[],value:"أداة عالمية مساعدة لتنظيم المراجع. موجودة هنا لأنها تخدم الباحث العربي، لا لأنها جزء من البدائل العربية.",arabRelation:"مصدر عالمي مساعد — ليس عربيًا",creator:"Digital Scholar ومجتمع تطوير عالمي",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر عالمي مساعد — ليس بديلاً عربيًا",reviewed:"14 سبتمبر 2026",limit:"راجع أسماء المؤلفين والعناوين ونمط التوثيق المطلوب من جامعتك؛ الأداة تنظم البيانات ولا تصحح المصدر تلقائيا.",url:"https://www.zotero.org/",domain:"zotero.org",modules:[["الواجهة والمخرجات","الموقع بالإنجليزية؛ التطبيق متعدد اللغات · يدعم حفظ المراجع بلغات متعددة ومنها العربية"],["الدليل المتاح","مشروع مفتوح ومعروف · نضعها في طبقة الأدوات المساعدة لا في الواجهة"],["مصادر التحقق المحفوظة","<a href=\"https://www.zotero.org/\" target=\"_blank\" rel=\"noopener noreferrer\">الأداة الرسمية</a> · <a href=\"https://www.zotero.org/support/supported_languages\" target=\"_blank\" rel=\"noopener noreferrer\">دعم اللغات والتوثيق</a>"]]},
{id:"fresh",name:"فريش",logo:officialFavicon("fresh.com.eg"),type:"منتجات وصناعة",cat:"tech",sub:"all",origin:[],value:"منتج مصري مادي داخل الدليل يذكّر بأن البديل العربي لا يقتصر على التطبيقات. المقارنة هنا تبدأ بالمواصفات وخدمة ما بعد البيع.",arabRelation:"صناعة مصرية",creator:"شركة فريش المصرية للأجهزة المنزلية",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"بلد منشأ العلامة لا يثبت بلد تصنيع كل طراز أو مكون. لا تتضمن هذه البطاقة توصية شراء لطراز محدد.",url:"https://fresh.com.eg/",domain:"fresh.com.eg",modules:[["الواجهة والمخرجات","عربية وإنجليزية · معلومات المنتجات بالعربية"],["الدليل المتاح","الموقع الرسمي ومواصفات الطراز · يحتاج التقييم إلى مراجعات لكل طراز على حدة"],["مصادر التحقق المحفوظة","<a href=\"https://fresh.com.eg/ar/about\" target=\"_blank\" rel=\"noopener noreferrer\">عن الشركة</a> · <a href=\"https://fresh.com.eg/\" target=\"_blank\" rel=\"noopener noreferrer\">كتالوج المنتجات</a>"]]},
{id:"aamenn",name:"آمن Aamenn",logo:"material:shield",type:"مرشح للتجربة",cat:"tech",sub:"infra",origin:["drive"],value:"مشروع لمشاركة وتخزين الملفات بصلات مصرية قيد التحقق. نبرزه كمرشح، لا كمنتج موثوق نهائيا.",arabRelation:"مرشح محلي يحتاج استكمال التحقق",creator:"فريق مؤسس يعمل من مصر؛ لم يكتمل التحقق من بلد التسجيل القانوني للكيان.",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مرشح قديم — التحقق غير مكتمل",reviewed:"14 سبتمبر 2026",limit:"الرابط لصفحة الشركة، وليس لمنتج اختبرناه. التشفير والسعر والاسترجاع لم تخضع للتحقق هنا.",url:"https://www.linkedin.com/company/aamenn",domain:"linkedin.com",modules:[["الواجهة والمخرجات","لم تفحص واجهة الخدمة · لم يختبر دعم العربية"],["الدليل المتاح","مصادر أولية محدودة · لا يوجد أساس كاف لتقييم جودة أو ثقة بعد"],["مصادر التحقق المحفوظة","<a href=\"https://www.linkedin.com/company/aamenn\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"munsit",name:"منصت Munsit",logo:officialFavicon("munsit.com"),type:"تقنية صوت",cat:"create",sub:"audio",origin:["otter"],value:"لو ساعاتك تضيع في تفريغ الاجتماعات أو التسجيلات العربية، منصت يضع اللهجات العربية في قلب الاستخدام.",arabRelation:"تفريغ صوت عربي ولهجات",creator:"CNTXT AI : مقرها الإمارات",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"القياس يخص نظام Munsit المشارك في مسابقة 2025، وليس اختبارا منا للخدمة الحالية. معدل خطأ الكلمات ليس نسبة رضا أو جودة التعليق الصوتي.",url:"https://munsit.com/",domain:"munsit.com",modules:[["الواجهة والمخرجات","عربية وإنجليزية · تفريغ صوت عربي ولهجات متعددة"],["الدليل المتاح","الموقع الرسمي · جودة التفريغ تختلف حسب اللهجة والصوت وتحتاج اختبارا بعينتك"],["مصادر التحقق المحفوظة","<a href=\"https://munsit.com/\" target=\"_blank\" rel=\"noopener noreferrer\">منصة منصت</a> · <a href=\"https://munsit.com/about-us\" target=\"_blank\" rel=\"noopener noreferrer\">الجهة المطورة</a> · <a href=\"https://arxiv.org/html/2509.02038v1#S4.T4\" target=\"_blank\" rel=\"noopener noreferrer\">نتائج منظمي NADI 2025 : جدول 4</a>"]]},
{id:"anghami",name:"أنغامي",logo:officialFavicon("anghami.com"),type:"بث صوتي",cat:"culture",sub:"all",origin:["spotify"],value:"منصة موسيقى خرجت من المنطقة قبل أن يصبح البث عادة يومية. خيار عربي راسخ يستحق أن يبقى ضمن المقارنة مع المنصات العالمية.",arabRelation:"منشأ لبناني وحضور عربي واسع",creator:"منشأ لبناني / مقر إقليمي",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"لم تراجع كل إصدارات المحتوى أو لغات التطبيق ضمن هذه المراجعة.",url:"https://www.anghami.com/about",domain:"anghami.com",modules:[["الواجهة والمخرجات","إنجليزية في الصفحة المفحوصة · المحتوى العربي حسب المكتبة"],["الدليل المتاح","الموقع الرسمي ومصادر الشركة · المكتبة والأسعار تختلف حسب البلد"],["مصادر التحقق المحفوظة","<a href=\"https://www.anghami.com/about\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"hudhud",name:"هدهد Hudhud Maps",logo:officialFavicon("hudhud.sa"),type:"خرائط محلية",cat:"tech",sub:"software",origin:["googlemaps"],value:"خرائط وملاحة سعودية تركز على الأماكن والعناوين المحلية. مثال واضح على قيمة المنتج حين يعرف تفاصيل المكان أكثر من الاسم العالمي.",arabRelation:"ملاحة محلية للسوق السعودي",creator:"🇸🇦 السعودية",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"نطاقه الجغرافي مهم عند المقارنة؛ لم يختبر مسار ملاحة فعليا.",url:"https://hudhud.sa/en",domain:"hudhud.sa",modules:[["الواجهة والمخرجات","إنجليزية في الصفحة المفحوصة · العناوين العربية بحسب الخدمة"],["الدليل المتاح","الموقع الرسمي · الاختبار الميداني هو الفيصل في الدقة والتغطية"],["مصادر التحقق المحفوظة","<a href=\"https://hudhud.sa/en\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"arabybot",name:"ArabyBot",logo:officialFavicon("arabybot.com"),type:"محادثات أعمال",cat:"work",sub:"management",origin:[],value:"منصة مصرية لمحادثات العملاء والأتمتة. مفيدة للفرق التي تريد خدمة عربية أقرب لأسلوب العميل المحلي.",arabRelation:"محادثات وأتمتة موجهة للأعمال العربية",creator:"🇪🇬 مصر",availability:"راجع شروط الإتاحة في الموقع.",price:"راجع السعر الحالي في الموقع",verified:"مصدر رسمي — مراجعة 14 سبتمبر 2026",reviewed:"14 سبتمبر 2026",limit:"راجع القنوات والتكاملات والاشتراك؛ لم تختبر الأتمتة أو عملية ربط الحساب.",url:"https://arabybot.com/about",domain:"arabybot.com",modules:[["الواجهة والمخرجات","عربية في الصفحة المفحوصة · دعم العربية بحسب الجهة"],["الدليل المتاح","الموقع الرسمي · يحتاج الحكم إلى تجربة قنوات فعلية وحجم رسائل حقيقي"],["مصادر التحقق المحفوظة","<a href=\"https://arabybot.com/about\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"khamsat",name:"خمسات",logo:officialFavicon("khamsat.com"),type:"منصة خدمات",cat:"work",sub:"services",origin:["fiverr"],value:"شراء خدمات رقمية من مستقلين عرب لمهام واضحة.",arabRelation:"منصة عربية",creator:"خمسات سوق عربي تابع لحسوب؛ Hsoub Limited مسجلة في المملكة المتحدة، بينما المنتج والسوق والجمهور عربيون.",availability:"متاح عبر الويب",price:"حسب الخدمة",verified:"مصدر رسمي",reviewed:"لم تُسجل مراجعة حديثة بعد",limit:"وضوح الطلب ومراجعة الأعمال السابقة جزء أساسي من القرار.",url:"https://khamsat.com/",domain:"khamsat.com",modules:[["كيف تبدأ؟","اكتب المطلوب وحدد التسليم والموعد قبل مقارنة مقدمي الخدمة."]]},
{id:"hsoub",name:"أكاديمية حسوب",logo:officialFavicon("academy.hsoub.com"),type:"مصدر تعلم",cat:"learn",sub:"courses",origin:["coursera","udemy"],value:"مصادر ودورات عربية في البرمجة وتطوير الويب والتقنية.",arabRelation:"تعلّم بالعربية",creator:"حسوب تأسست في المملكة المتحدة عام 2011، لكنها تبني منتجات وفرص عمل وتعليم موجهة للعالم العربي، والأكاديمية محتواها عربي.",availability:"الويب",price:"مجاني + مدفوع",verified:"مصادر رسمية",reviewed:"لم تُسجل مراجعة حديثة بعد",limit:"المحتوى المجاني والمدفوع يحتاجان مقارنة بالهدف والوقت.",url:"https://academy.hsoub.com/",domain:"academy.hsoub.com",modules:[["طريقة الاستخدام","ابدأ من المجال الذي تحتاجه ثم انتقل من الشرح المجاني إلى المسار المدفوع فقط إذا احتجت تنظيمًا أو متابعة إضافية."]]},
{id:"abjjad",name:"أبجد",logo:officialFavicon("abjjad.com"),type:"منصة كتب",cat:"culture",sub:"books",origin:["kindle"],value:"كتب عربية رقمية وصوتية ضمن تجربة قراءة واكتشاف.",arabRelation:"منصة/محتوى عربي",creator:"جهة عربية",availability:"بحسب الكتالوج والسوق",price:"حسب الخطة",verified:"مصدر رسمي — يراجع الكتالوج",reviewed:"لم تُسجل مراجعة حديثة بعد",limit:"توافر الكتب والحقوق والأسعار يتغير مع الوقت.",url:"https://www.abjjad.com/",domain:"abjjad.com",modules:[["تفاصيل ثقافية","للكتاب الواحد نهتم بالمؤلف والطبعة والناشر ونوع النسخة وطريقة الوصول: قراءة أو استماع أو استخدام دون إنترنت."]]},
{id:"sowt",name:"صوت",logo:officialFavicon("sowt.com"),type:"شبكة/محتوى صوتي",cat:"culture",sub:"podcasts",origin:["spotify"],value:"بودكاست وقصص صوتية عربية تُكتشف لقيمتها نفسها.",arabRelation:"إبداع عربي أصيل",creator:"جهة عربية",availability:"منصات متعددة",price:"بحسب المحتوى",verified:"كل برنامج يراجع بذاته",reviewed:"لم تُسجل مراجعة حديثة بعد",limit:"لا نختزل شبكة كاملة في تقييم واحد.",url:"https://www.sowt.com/",domain:"sowt.com",modules:[["المحتوى","لكل سلسلة أو برنامج نهتم بالمقدم والموضوع والمواسم أو الحلقات ومنصات الاستماع المتاحة."]]},
{id:"noon",name:"نون",logo:officialFavicon("noon.com"),type:"سوق إلكتروني",cat:"shopping",sub:"marketplaces",origin:["amazon","jumia"],value:"منصة تسوق إقليمية عامة تضم ملايين المنتجات، وتعمل حاليًا في مصر والسعودية والإمارات.",arabRelation:"منصة إقليمية بواجهة ودعم عربي",creator:"Noon AD Holdings؛ منصة إقليمية تعمل في مصر والسعودية والإمارات.",availability:"متاحة حاليًا في مصر والسعودية والإمارات بحسب مركز مساعدة نون.",price:"التصفح مجاني / السعر حسب المنتج",verified:"مصادر رسمية — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"الأسعار والشحن والإرجاع تختلف حسب البلد والمنتج والبائع؛ راجع صفحة المنتج وشروط السوق قبل الشراء.",url:"https://www.noon.com/egypt-ar/",domain:"noon.com",modules:[["نطاق التسوق","إلكترونيات، أزياء، منزل، أطفال، جمال، بقالة وغيرها بحسب السوق."],["الإتاحة","نون تذكر أن أسواقها الحالية هي السعودية والإمارات ومصر."],["مصادر التحقق المحفوظة","<a href=\"https://help.noon.com/portal/en/kb/articles/about-noon-7-3-2024\" target=\"_blank\" rel=\"noopener noreferrer\">عن نون</a> · <a href=\"https://help.noon.com/portal/en/kb/articles/seller-onboarding-faq\" target=\"_blank\" rel=\"noopener noreferrer\">الأسواق الحالية</a>"]]},
{id:"opensooq",name:"السوق المفتوح",logo:officialFavicon("opensooq.com"),type:"إعلانات مبوبة",cat:"shopping",sub:"classifieds",origin:["jumia"],value:"منصة إقليمية للبيع والشراء المباشر والإعلانات المبوبة، من السيارات والعقارات إلى الإلكترونيات والخدمات.",arabRelation:"منصة موجّهة للشرق الأوسط وشمال إفريقيا",creator:"OpenSooq؛ لها شركة تطوير مسجلة في الأردن ومكاتب إقليمية.",availability:"متاح في 20 بلدًا بحسب الجهة.",price:"بحسب القسم ونوع الإعلان",verified:"مصادر رسمية — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"ليس متجرًا مركزيًا مثل Amazon أو Jumia؛ كثير من الصفقات تتم بين المستخدمين، لذلك تحقق من البائع وطريقة الدفع والتسليم.",url:"https://eg.opensooq.com/ar",domain:"eg.opensooq.com",modules:[["طريقة الاستخدام","إعلانات مبوبة تربط الأفراد والشركات للبيع والشراء والتأجير والوظائف والخدمات."],["الحجم المعلن","أكثر من 800 مليون زيارة سنويًا و120 مليون مستخدم فريد بحسب الجهة نفسها."],["مصادر التحقق المحفوظة","<a href=\"https://eg.opensooq.com/ar/site/about-us\" target=\"_blank\" rel=\"noopener noreferrer\">عن السوق المفتوح</a> · <a href=\"https://jo.opensooq.com/en/termOfUse?view=termOfUse\" target=\"_blank\" rel=\"noopener noreferrer\">الشروط والكيانات القانونية</a>"]]},
{id:"mumzworld",name:"Mumzworld",logo:officialFavicon("mumzworld.com"),type:"متجر متخصص",cat:"shopping",sub:"specialized",origin:["amazon"],value:"منصة تسوق متخصصة للأم والطفل، تأسست في المنطقة وتجمع منتجات وعلامات متعددة مع تجربة ثنائية اللغة.",arabRelation:"منصة إقليمية ثنائية اللغة للأم والطفل",creator:"Mumzworld؛ أسستها Mona Ataya وLeena Khalil في 2011.",availability:"تخدم أسواقًا في المنطقة؛ راجع بلد الشحن الحالي قبل الطلب.",price:"حسب المنتج والشحن",verified:"مصادر رسمية — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"متجر متخصص وليس بديلًا عامًا لـAmazon أو Jumia؛ قارن السعر والشحن والإرجاع للمنتج نفسه.",url:"https://www.mumzworld.com/en/",domain:"mumzworld.com",modules:[["التخصص","منتجات للأم والطفل والعائلة من علامات محلية وعالمية."],["عن المنصة","تأسست في 2011، وتصف نفسها كمنصة إقليمية متخصصة للأم والطفل."],["مصادر التحقق المحفوظة","<a href=\"https://www.mumzworld.com/en/about-our-products\" target=\"_blank\" rel=\"noopener noreferrer\">عن المنتجات والمنصة</a> · <a href=\"https://blog.mumzworld.com/en/mumzworld-a-journey-of-entrepreneurship-and-motherhood\" target=\"_blank\" rel=\"noopener noreferrer\">قصة التأسيس</a>"]]},

{id:"spacetoonyt",name:"سبيستون",logo:officialFavicon("youtube.com"),type:"قناة أطفال",cat:"culture",sub:"kids",origin:["youtube"],value:"قناة رسمية عربية على YouTube للكرتون والأنمي والأغاني والبرامج الموجهة للأطفال والعائلة.",arabRelation:"دبلجة ومحتوى عربي للأطفال",creator:"Spacetoon",availability:"متاحة مجانًا عبر القناة الرسمية على YouTube.",price:"مجاني عبر YouTube",verified:"قناة موثقة على YouTube — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"المحتوى يتغير باستمرار؛ راجع ملاءمة الحلقة لعمر الطفل واستخدم أدوات الإشراف المناسبة.",url:"https://www.youtube.com/@spacetoonyoutube",domain:"youtube.com",modules:[["المحتوى","حلقات كرتون وأنمي وأغانٍ وبرامج أطفال باللغة العربية من القناة الرسمية."],["مصادر التحقق المحفوظة","<a href=\"https://www.youtube.com/@spacetoonyoutube\" target=\"_blank\" rel=\"noopener noreferrer\">القناة الرسمية</a>"]]},
{id:"majidkids",name:"ماجد للأطفال",logo:officialFavicon("youtube.com"),type:"قناة أطفال",cat:"culture",sub:"kids",origin:["youtube"],value:"قناة عربية إماراتية متخصصة في برامج الأطفال والرسوم المتحركة، تجمع شخصيات محلية ومحتوى ترفيهي وتعليمي.",arabRelation:"محتوى عربي وهوية إماراتية للأطفال",creator:"عالم ماجد / أبوظبي للإعلام",availability:"متاحة عبر القناة الرسمية على YouTube.",price:"مجاني عبر YouTube",verified:"قناة موثقة على YouTube — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"اختيار القناة لا يغني عن مراجعة المحتوى المناسب لعمر الطفل وإعدادات الإشراف.",url:"https://www.youtube.com/@majidkids",domain:"youtube.com",modules:[["المحتوى","رسوم متحركة وبرامج أطفال عربية تجمع التسلية والفائدة."],["مصادر التحقق المحفوظة","<a href=\"https://www.youtube.com/@majidkids\" target=\"_blank\" rel=\"noopener noreferrer\">القناة الرسمية</a>"]]},
{id:"marefa",name:"المعرفة",logo:officialFavicon("marefa.org"),type:"موسوعة عربية مفتوحة",cat:"learn",sub:"encyclopedias",origin:["wikipedia"],value:"موسوعة عربية مفتوحة تجمع وتنتج محتوى عربيًا متنوعًا، ويمكن للمجتمع المساهمة في تحريرها.",arabRelation:"المحتوى العربي هو أساس المشروع",creator:"مشروع عربي أطلقه نايل الشافعي عام 2007؛ مؤسسة Marefa Foundation تظهر كجهة أمريكية غير ربحية، بينما هوية الموسوعة ومحتواها عربيان.",availability:"مفتوحة عبر الويب.",price:"مجاني",verified:"الموقع الرسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"لأنها موسوعة مفتوحة قابلة للتحرير، راجع المراجع الأصلية خصوصًا في الموضوعات الحساسة أو المتغيرة.",url:"https://www.marefa.org/",domain:"marefa.org",modules:[["طريقة الاستخدام","ابدأ بالمقال للاكتشاف، ثم راجع المراجع والمصادر المرتبطة قبل الاعتماد الأكاديمي أو المهني."],["مصادر التحقق المحفوظة","<a href=\"https://www.marefa.org/Main_Page\" target=\"_blank\" rel=\"noopener noreferrer\">الرئيسية والتعريف بالمشروع</a>"]]},
{id:"arabency",name:"الموسوعة العربية",logo:officialFavicon("arab-ency.com.sy"),type:"موسوعة علمية عربية",cat:"learn",sub:"encyclopedias",origin:["wikipedia"],value:"مرجع موسوعي عربي تحريري يغطي العلوم والآداب والحضارة والمصطلحات، تصدره هيئة علمية ثقافية رسمية في دمشق.",arabRelation:"مرجع عربي مؤسسي شامل",creator:"هيئة الموسوعة العربية — وزارة الثقافة السورية",availability:"المواد متاحة للتصفح عبر الموقع.",price:"مجاني للتصفح",verified:"مصدر رسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"حداثة المواد وتواتر تحديثها يختلفان حسب الموضوع؛ في المعلومات السريعة التغير راجع مصدرًا أحدث أيضًا.",url:"https://arab-ency.com.sy/",domain:"arab-ency.com.sy",modules:[["نطاق المعرفة","علوم بحتة وتطبيقية، قانون واقتصاد، تاريخ، حضارة عربية، لغة وأدب وفنون."],["مصادر التحقق المحفوظة","<a href=\"https://www.arab-ency.com.sy/about-ency/\" target=\"_blank\" rel=\"noopener noreferrer\">عن الموسوعة</a>"]]},
{id:"dorar",name:"الدرر السنية",logo:officialFavicon("dorar.net"),type:"موسوعات إسلامية",cat:"learn",sub:"islamic",origin:[],value:"منصة بحث عربية في الحديث وشروحه وعلوم شرعية متعددة، مع صفحات توضّح المنهج والمراجع في الموسوعات.",arabRelation:"بحث وموسوعات شرعية بالعربية",creator:"الدرر السنية",availability:"متاحة عبر الويب.",price:"مجاني",verified:"مصدر رسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"نتيجة البحث المختصرة لا تغني عن سياق الحديث أو المسألة ولا عن الرجوع لأهل الاختصاص في النوازل والخلاف.",url:"https://dorar.net/",domain:"dorar.net",modules:[["ما يفيدك","بحث في الأحاديث ودرجاتها والشروح، مع مراجع ومنهج عمل منشور داخل الموسوعات."],["مصادر التحقق المحفوظة","<a href=\"https://dorar.net/hadith\" target=\"_blank\" rel=\"noopener noreferrer\">الموسوعة الحديثية</a>"]]},
{id:"tafsircenter",name:"مركز تفسير",logo:officialFavicon("tafsir.net"),type:"مصادر قرآنية",cat:"learn",sub:"islamic",origin:[],value:"مركز عربي متخصص في الدراسات القرآنية يقدم موسوعات وتطبيقات ومحتوى بحثيًا لخدمة التفسير وعلوم القرآن.",arabRelation:"مشروع عربي متخصص في القرآن وعلومه",creator:"مركز تفسير للدراسات القرآنية — الرياض",availability:"الويب وتطبيقات قرآنية رسمية.",price:"بحسب الخدمة؛ كثير من المحتوى متاح مباشرة",verified:"مصدر رسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"مصدر متخصص في الدراسات القرآنية، وليس بديلًا واحدًا يغطي كل فروع العلوم الشرعية.",url:"https://www.tafsir.net/",domain:"tafsir.net",modules:[["أبرز ما يقدمه","تطبيقات وموسوعات قرآنية، منها موسوعة التفسير الموضوعي التي تجمع 365 موضوعًا قرآنيًا."],["مصادر التحقق المحفوظة","<a href=\"https://www.tafsir.net/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a> · <a href=\"https://tafsir.net/applications/12859\" target=\"_blank\" rel=\"noopener noreferrer\">موسوعة التفسير الموضوعي</a>"]]},
{id:"shamela",name:"المكتبة الشاملة",logo:officialFavicon("shamela.ws"),type:"مكتبة إسلامية رقمية",cat:"learn",sub:"islamic",origin:[],value:"مكتبة رقمية عربية ضخمة للبحث والقراءة في كتب التراث والعلوم الإسلامية واللغة والتاريخ.",arabRelation:"محتوى عربي وتراثي في صلب المشروع",creator:"مشروع عربي؛ متجر Google Play الرسمي يعرّف مطوّر التطبيق الرسمي بعنوان في مصر، ولا نعتبر ذلك وحده إثباتًا لبلد نشأة المشروع كله.",availability:"بحث وقراءة عبر الويب، مع تنزيل المشروع من الموقع الرسمي.",price:"مجاني للاستخدام الأساسي",verified:"الموقع الرسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"وجود الكتاب في المكتبة لا يعني اعتماد كل ما فيه؛ راجع المؤلف والطبعة والتحقيق ومكانة المصدر.",url:"https://shamela.ws/",domain:"shamela.ws",modules:[["الحجم المعلن","الموقع الرسمي يذكر نحو 7 ملايين صفحة و8 آلاف كتاب و3 آلاف مؤلف."],["مصادر التحقق المحفوظة","<a href=\"https://shamela.ws/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"hindawi",name:"هنداوي",logo:officialFavicon("hindawi.org"),type:"كتب عربية مجانية",cat:"culture",sub:"books",origin:["kindle"],value:"مؤسسة تتيح مؤلفات وأعمالًا أدبية عربية ومترجمة مجانًا، مع مبادرات قراءة للكبار والأطفال.",arabRelation:"إتاحة المعرفة والقراءة باللغة العربية",creator:"مؤسسة خيرية مسجلة في إنجلترا وويلز، ولها مقرّان رئيسيان في وندسور والقاهرة؛ تأسست رسالتها أصلًا لمعالجة نقص مواد القراءة العربية.",availability:"قراءة وتحميل مجانيان للأعمال المتاحة؛ الكتب الحالية مرتبطة أيضًا بمبادرة صفحات.",price:"مجاني",verified:"مصدر رسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"توافر كل عنوان يتوقف على حقوق النشر والإتاحة؛ لا تفترض أن كل كتاب مطبوع موجود رقميًا.",url:"https://www.hindawi.org/ar",domain:"hindawi.org",modules:[["ما يميزها","إتاحة مجانية قانونية للأعمال التي تملك المؤسسة حقوق نشرها أو إعادة نشرها، مع مبادرات مثل صفحات وبوك تايم."],["مصادر التحقق المحفوظة","<a href=\"https://www.hindawi.org/ar/about\" target=\"_blank\" rel=\"noopener noreferrer\">عن هنداوي</a>"]]},
{id:"shahid",name:"شاهد",logo:officialFavicon("shahid.mbc.net"),type:"منصة مشاهدة",cat:"culture",sub:"drama",origin:["netflix"],value:"منصة مشاهدة عربية وإقليمية للمسلسلات والأفلام والقنوات المباشرة وأعمال شاهد الأصلية.",arabRelation:"محتوى عربي أصلي ومكتبة إقليمية",creator:"MBC Group",availability:"مجاني جزئيًا + اشتراك VIP بحسب المحتوى والبلد.",price:"مجاني جزئيًا / VIP مدفوع",verified:"مصدر رسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"المكتبة والإتاحة والأسعار تختلف حسب البلد وحقوق العرض؛ راجع صفحة العمل قبل الاشتراك.",url:"https://shahid.mbc.net/ar",domain:"shahid.mbc.net",modules:[["المحتوى","مسلسلات وأفلام وقنوات مباشرة وأعمال أصلية عربية."],["مصادر التحقق المحفوظة","<a href=\"https://shahid.mbc.net/ar/shahidoriginals\" target=\"_blank\" rel=\"noopener noreferrer\">أعمال شاهد الأصلية</a>"]]},
{id:"watchit",name:"WATCH IT",logo:officialFavicon("watchit.com"),type:"منصة مشاهدة مصرية",cat:"culture",sub:"drama",origin:["netflix"],value:"منصة رقمية تركز على الدراما والبرامج والأعمال المصرية، مع مكتبة حالية وإنتاجات تعرض حصريًا.",arabRelation:"تركيز قوي على المحتوى المصري والعربي",creator:"WATCH IT",availability:"اشتراك عبر الويب والتطبيقات؛ وسائل دفع محلية منها فوري داخل مصر.",price:"داخل مصر وقت المراجعة: 19.99 ج.م أساسية بإعلانات / 99.99 ج.م بريميم شهريًا",verified:"مركز الدعم الرسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"الأسعار والمكتبة تختلف حسب البلد وقد تتغير؛ تحقق من صفحة الاشتراك الحالية قبل الدفع.",url:"https://www.watchit.com/",domain:"watchit.com",modules:[["الدفع في مصر","مركز الدعم يذكر الاشتراك بالبطاقات والتطبيقات وفوري داخل مصر."],["مصادر التحقق المحفوظة","<a href=\"https://support.watchit.com/hc/ar/articles/5118489729437\" target=\"_blank\" rel=\"noopener noreferrer\">الاشتراك والأسعار</a>"]]},
{id:"dubaiplus",name:"Dubai+",logo:officialFavicon("dubaiplus.net"),type:"مشاهدة مجانية",cat:"culture",sub:"drama",origin:["netflix"],value:"منصة مشاهدة عند الطلب تجمع مسلسلات عربية وخليجية ومصرية وأفلامًا وبرامج وقنوات مباشرة، وتعرض محتوى أطفال أيضًا.",arabRelation:"محتوى عربي وإقليمي وقنوات من دبي",creator:"Dubai+",availability:"مشاهدة عبر الويب والتطبيق بحسب الخدمة.",price:"مجاني بحسب الموقع",verified:"الموقع الرسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"الإتاحة تختلف حسب حقوق العرض والمنطقة، وبعض العناوين قد تتغير مع الوقت.",url:"https://www.dubaiplus.net/web/",domain:"dubaiplus.net",modules:[["المحتوى","دراما مصرية وخليجية وسورية، أفلام، قنوات مباشرة، أطفال ووثائقيات وبرامج."],["مصادر التحقق المحفوظة","<a href=\"https://www.dubaiplus.net/web/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]},
{id:"almaany",name:"المعاني",logo:officialFavicon("almaany.com"),type:"معاجم وقواميس",cat:"learn",sub:"language",origin:[],value:"محرك معاجم عربي يضم عربي-عربي وترجمات ومصطلحات متخصصة في مجالات متعددة.",arabRelation:"اللغة العربية هي محور الخدمة",creator:"موقع المعاني",availability:"متاح عبر الويب.",price:"مجاني للاستخدام الأساسي عبر الموقع",verified:"الموقع الرسمي — مراجعة 21 سبتمبر 2026",reviewed:"21 سبتمبر 2026",limit:"المعنى أو الترجمة الصحيحة يعتمد على السياق والمجال؛ لا تعتمد أول نتيجة آليًا في النصوص المتخصصة.",url:"https://www.almaany.com/",domain:"almaany.com",modules:[["المحتوى","معاجم عربية وترجمات ثنائية ومصطلحات في مجالات قانونية وطبية وتقنية وعلمية وغيرها."],["مصادر التحقق المحفوظة","<a href=\"https://www.almaany.com/\" target=\"_blank\" rel=\"noopener noreferrer\">الموقع الرسمي</a>"]]}
,
{id:"unifonic",name:"Unifonic",logo:officialFavicon("unifonic.com"),type:"اتصالات وتجربة عملاء",cat:"tech",sub:"software",origin:[],value:"منصة مؤسسات بدأت في السعودية لبناء تجارب تواصل مع العملاء عبر الرسائل والصوت والقنوات الرقمية، مع اهتمام معلن باللهجات العربية.",arabRelation:"لهجات وسياقات عربية ضمن المنتج",creator:"بدأت الشركة في السعودية عام 2006 بحسب صفحتها الرسمية.",availability:"خدمة موجهة أساسًا للمؤسسات؛ التفعيل والتسعير حسب الاحتياج.",price:"تواصل وتسعير حسب الاستخدام",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"القدرات والأرقام الواردة على صفحة الشركة بيانات رسمية؛ لم نختبر الأداء أو جودة فهم اللهجات بصورة مستقلة.",url:"https://www.unifonic.com/ar/",domain:"unifonic.com",modules:[["ماذا تقدم؟","قنوات تواصل وتجربة عملاء وطبقة ذكاء للمؤسسات."],["مصادر التحقق المحفوظة","<a href='https://www.unifonic.com/ar/about' target='_blank' rel='noopener noreferrer'>عن Unifonic</a>"]]},

{id:"ithra",name:"إثراء",logo:officialFavicon("ithra.com"),type:"معرفة وثقافة",cat:"culture",sub:"books",origin:[],value:"مركز معرفي وثقافي في الظهران يجمع مكتبة كبيرة ومتحفًا ومسرحًا ومختبر أفكار وأكاديمية وبرامج تعلم واكتشاف.",arabRelation:"إنتاج معرفي وثقافي سعودي بامتداد عربي وعالمي",creator:"مركز الملك عبدالعزيز الثقافي العالمي «إثراء» — الظهران، السعودية.",availability:"جزء كبير من المعرفة والبرامج متاح رقميًا؛ الدخول والفعاليات تختلف حسب البرنامج.",price:"مجاني ومدفوع بحسب الخدمة أو الفعالية",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"إثراء ليس منصة كتب رقمية فقط؛ بعض الموارد والفعاليات تتطلب عضوية أو حضورًا أو حجزًا.",url:"https://www.ithra.com/ar",domain:"ithra.com",modules:[["المكتبة","الموقع الرسمي يذكر 389 ألف+ كتاب مطبوع و74 ألف+ كتاب إلكتروني ومسموع."],["مصادر التحقق المحفوظة","<a href='https://www.ithra.com/ar/about-ithra' target='_blank' rel='noopener noreferrer'>عن إثراء</a> · <a href='https://www.ithra.com/ar/visit-ithra/attractions/library' target='_blank' rel='noopener noreferrer'>المكتبة</a>"]]},

{id:"thmanyah",name:"ثمانية",logo:officialFavicon("thmanyah.com"),type:"شبكة محتوى عربية",cat:"culture",sub:"podcasts",origin:["spotify"],value:"شبكة سعودية للمحتوى العربي تجمع البودكاست والوثائقيات والنشرات والبرامج والتطبيقات في منظومة واحدة.",arabRelation:"صناعة محتوى عربي أصلي من الرياض",creator:"بدأت ثمانية في الرياض في سبتمبر 2016، ومقرها في السعودية.",availability:"معظم المحتوى متاح مجانًا، مع مزايا ومواد ضمن اشتراكات مدفوعة.",price:"مجاني غالبًا + اشتراكات لبعض المزايا",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"ليست بديلًا مباشرًا لـSpotify في كل الوظائف؛ المقارنة هنا في الاستماع واكتشاف المحتوى الصوتي العربي.",url:"https://thmanyah.com/",domain:"thmanyah.com",modules:[["المحتوى","بودكاست ووثائقيات ومقالات ونشرات وترفيه وتطبيقات صوتية ومرئية."],["مصادر التحقق المحفوظة","<a href='https://company.thmanyah.com/about' target='_blank' rel='noopener noreferrer'>عن الشركة</a> · <a href='https://company.thmanyah.com/social' target='_blank' rel='noopener noreferrer'>الحسابات الرسمية</a>"]]},

{id:"alef",name:"ألف للتعليم",logo:officialFavicon("alefeducation.com"),type:"تقنية تعليم",cat:"learn",sub:"courses",origin:[],value:"منصة تعليم مدعومة بالذكاء الاصطناعي للمراحل المدرسية، بدأت من أبوظبي وتعمل مع أنظمة تعليمية ومدارس في عدة أسواق.",arabRelation:"حل تعليمي انطلق لتلبية احتياجات مدارس الإمارات ويدعم تعليم العربية",creator:"تأسست في أبوظبي عام 2016.",availability:"الوصول غالبًا عبر المدارس والجهات التعليمية والعقود المؤسسية.",price:"مؤسسي؛ راجع الجهة أو المدرسة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"ليست منصة كورسات مفتوحة شبيهة بـUdemy؛ الاستخدام الأساسي مؤسسي ومدرسي.",url:"https://www.alefeducation.com/ar/",domain:"alefeducation.com",modules:[["النطاق","تعلم مخصص وبيانات وتقييمات للمرحلة K-12."],["مصادر التحقق المحفوظة","<a href='https://www.alefeducation.com/ar/our-story' target='_blank' rel='noopener noreferrer'>قصة ألف للتعليم</a>"]]},

{id:"bayut",name:"بيوت",logo:officialFavicon("bayut.com"),type:"بوابة عقارية",cat:"shopping",sub:"specialized",origin:[],value:"بوابة عقارية إماراتية للشراء والإيجار والبيع، مع أدوات للتحقق من الوسطاء والإعلانات وبيانات للسوق العقاري.",arabRelation:"خدمة محلية مبنية حول سوق الإمارات وبواجهة عربية",creator:"جزء من Dubizzle Group؛ انطلقت بيوت في 2008 وتخدم الإمارات.",availability:"متاحة عبر الويب والتطبيق؛ الصفقات نفسها تتم مع المعلن أو الوسيط وفق الحالة.",price:"التصفح مجاني؛ تكاليف العقار والخدمات منفصلة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"ظهور إعلان على المنصة لا يغني عن فحص العقار والوسيط والعقد والجهة التنظيمية قبل أي دفع.",url:"https://www.bayut.com/ar/",domain:"bayut.com",modules:[["ما الذي يميزها؟","إعلانات عقارية في الإمارات وأدوات مثل TruBroker وTruCheck وبيانات معاملات دبي."],["مصادر التحقق المحفوظة","<a href='https://www.bayut.com/ar/about/' target='_blank' rel='noopener noreferrer'>عن بيوت</a>"]]},

{id:"dubaifuture",name:"مؤسسة دبي للمستقبل",logo:officialFavicon("dubaifuture.ae"),type:"أبحاث واستشراف",cat:"learn",sub:"research",origin:[],value:"مصدر إماراتي لتقارير الاستشراف والتقنيات الناشئة، ومعه أكاديمية تقدم فرص تعلم ودورات افتراضية في مهارات المستقبل.",arabRelation:"معرفة واستشراف من المنطقة وبالعربية والإنجليزية",creator:"مؤسسة دبي للمستقبل — تأسست في 2016.",availability:"التقارير متاحة على الموقع، وبعض دورات الأكاديمية مجانية وعن بعد.",price:"تقارير مجانية + برامج تختلف شروطها",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"تقارير الاستشراف ليست بديلًا عن الأبحاث الأكاديمية المحكمة؛ استخدمها لفهم الاتجاهات والسيناريوهات.",url:"https://www.dubaifuture.ae/research/",domain:"dubaifuture.ae",modules:[["المحتوى","تقارير مستقبلية وتحليلات للتقنيات والاقتصاد والمجتمع، إلى جانب أكاديمية مستقبل."],["مصادر التحقق المحفوظة","<a href='https://www.dubaifuture.ae/research/' target='_blank' rel='noopener noreferrer'>البحوث والتقارير</a> · <a href='https://www.dubaifuture.ae/initiatives/capacity-building/dubai-future-academy/' target='_blank' rel='noopener noreferrer'>أكاديمية دبي للمستقبل</a>"]]},

{id:"qdl",name:"مكتبة قطر الرقمية",logo:officialFavicon("qdl.qa"),type:"أرشيف رقمي",cat:"learn",sub:"research",origin:["scholar","jstor"],value:"أرشيف رقمي مجاني ضخم لتاريخ الخليج والشرق الأوسط، يضم خرائط ومخطوطات ووثائق وصورًا وتسجيلات مع شروح بالعربية والإنجليزية.",arabRelation:"مصادر أولية عن تاريخ الخليج والتراث العربي والإسلامي",creator:"شراكة بين مكتبة قطر الوطنية ومؤسسة قطر والمكتبة البريطانية.",availability:"وصول مجاني عبر الويب.",price:"مجاني",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"قوتها في المصادر التاريخية والأرشيفية؛ ليست محركًا عامًا لكل التخصصات العلمية.",url:"https://qdl.qa/ar",domain:"qdl.qa",modules:[["المحتوى","أرشيفات وخرائط ومخطوطات وتسجيلات وفنون بصرية ومقالات تفسيرية."],["مصادر التحقق المحفوظة","<a href='https://qdl.qa/en/about' target='_blank' rel='noopener noreferrer'>عن مكتبة قطر الرقمية</a>"]]},

{id:"snoonu",name:"سنونو",logo:officialFavicon("snoonu.com"),type:"تطبيق فائق",cat:"shopping",sub:"marketplaces",origin:[],value:"تطبيق قطري يجمع توصيل الطعام والبقالة والإلكترونيات والملابس وغيرها، ويعمل كبوابة محلية للتجار والخدمات.",arabRelation:"بُني للسوق القطري وشبكة التجار المحلية",creator:"سنونو — قطر.",availability:"الخدمات والإتاحة تختلف حسب المنطقة داخل قطر ونوع المتجر.",price:"التطبيق مجاني؛ رسوم الطلب والتوصيل تختلف",verified:"مصدر رسمي للشركاء — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"وصف «التطبيق الفائق الرائد في قطر» صادر عن الجهة نفسها؛ لا نقدمه كتقييم مستقل للسوق.",url:"https://snoonu.com/",domain:"snoonu.com",modules:[["ما الذي يقدمه؟","طعام وبقالة وإلكترونيات وملابس وخدمات أخرى عبر شبكة تجار."],["مصادر التحقق المحفوظة","<a href='https://partner.snoonu.com/' target='_blank' rel='noopener noreferrer'>بوابة سنونو الرسمية للشركاء</a>"]]},

{id:"kezakoo",name:"Kezakoo",logo:officialFavicon("kezakoo.com"),type:"تعليم مدرسي",cat:"learn",sub:"courses",origin:[],value:"منصة تعليمية مغربية لطلاب الثانوي، تجمع الفيديو والملخصات والتمارين والاختبارات والامتحانات المصححة وفق البرنامج المحلي.",arabRelation:"منصة وُلدت في المغرب لخدمة التلميذ المغربي",creator:"Kezakoo — منصة تعليم مغربية بدأت في 2013.",availability:"متاحة عبر الويب والتطبيق؛ يوجد محتوى وتجربة مجانية وخطط مدفوعة.",price:"مجاني جزئيًا + اشتراك",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"المحتوى مرتبط أساسًا بالمناهج المغربية؛ لا تفترض مطابقته لمناهج بلد آخر.",url:"https://www.kezakoo.com/ar/",domain:"kezakoo.com",modules:[["النطاق","محتوى للثانوي المغربي مع فيديوهات وملخصات وتمارين واختبارات."],["مصادر التحقق المحفوظة","<a href='https://orientation.kezakoo.com/qui-sommes-nous' target='_blank' rel='noopener noreferrer'>قصة Kezakoo</a> · <a href='https://www.kezakoo.com/ar/' target='_blank' rel='noopener noreferrer'>المنصة</a>"]]},

{id:"telmidtice",name:"TelmidTICE",logo:officialFavicon("telmidtice.men.gov.ma"),type:"تعليم رسمي",cat:"learn",sub:"courses",origin:[],value:"منصة مغربية رسمية للدروس والملخصات والتمارين والفروض والامتحانات لمستويات ومواد دراسية متعددة.",arabRelation:"محتوى مدرسي رسمي مرتبط بالنظام التعليمي المغربي",creator:"وزارة التربية الوطنية والتعليم الأولي والرياضة في المغرب.",availability:"متاحة عبر الويب.",price:"مجاني بحسب المنصة الرسمية",verified:"مصدر حكومي رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"المحتوى مخصص أساسًا للمقرر المغربي؛ استخدمه خارج المغرب كمصدر شرح لا كبديل عن منهج بلدك.",url:"https://telmidtice.men.gov.ma/",domain:"telmidtice.men.gov.ma",modules:[["المحتوى","دروس وتمارين وفروض وامتحانات للمراحل المدرسية."],["مصادر التحقق المحفوظة","<a href='https://telmidtice.men.gov.ma/' target='_blank' rel='noopener noreferrer'>المنصة الرسمية</a>"]]},

{id:"chari",name:"Chari",logo:officialFavicon("chari.com"),type:"خدمات مالية رقمية",cat:"tech",sub:"infra",origin:[],value:"تطبيق مالي مغربي يجمع محفظة إلكترونية وحسابًا بمعرّف مغربي وبطاقات وتحويلات وشحنًا ودفع فواتير.",arabRelation:"خدمة مالية مبنية للسوق المغربي وتدعم العربية والدارجة",creator:"Chari — فريق مغربي؛ كيان الدفع مرخّص من بنك المغرب.",availability:"موجه للأفراد والتجار الصغار في المغرب وفق شروط الأهلية والتحقق.",price:"تختلف الرسوم حسب الخدمة وتظهر قبل العمليات بحسب الموقع",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"خدمة مالية منظمة؛ راجع الشروط والرسوم وحدود الحساب مباشرة قبل أي تحويل أو إيداع.",url:"https://www.chari.com/",domain:"chari.com",modules:[["التنظيم","تقول Chari إن كيان الدفع مرخص من Bank Al-Maghrib."],["مصادر التحقق المحفوظة","<a href='https://www.chari.com/en/a-propos' target='_blank' rel='noopener noreferrer'>عن Chari</a>"]]},

{id:"benefit",name:"BENEFIT",logo:officialFavicon("benefit.bh"),type:"بنية مدفوعات",cat:"tech",sub:"infra",origin:[],value:"بنية بحرينية للمدفوعات والخدمات المالية الرقمية تقف خلف خدمات وطنية مثل الشبكة المشتركة وحلول الدفع والتحقق.",arabRelation:"بنية مالية محلية للسوق البحريني",creator:"تأسست في البحرين عام 1997 بمبادرة من 17 بنكًا تجاريًا.",availability:"الخدمات تختلف بين أفراد ومؤسسات وبنوك، وبعضها يعمل عبر تطبيقات ومنظومات محلية.",price:"تختلف حسب الخدمة والجهة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"ليست «محفظة واحدة» فقط؛ هي شركة بنية مالية وخدمات متعددة، لذلك راجع المنتج المحدد الذي تحتاجه.",url:"https://benefit.bh/AR/",domain:"benefit.bh",modules:[["البداية","الشركة الرسمية تذكر تأسيسها كالشبكة الوطنية لأجهزة الصراف ونقاط البيع."],["مصادر التحقق المحفوظة","<a href='https://benefit.bh/AR/about-us/' target='_blank' rel='noopener noreferrer'>عن بنفت</a>"]]},

{id:"tarabut",name:"Tarabut",logo:officialFavicon("tarabut.com"),type:"مصرفية مفتوحة",cat:"tech",sub:"infra",origin:[],value:"منصة بنية مالية بدأت في البحرين للـOpen Banking والتمويل المضمّن، وتربط المؤسسات المالية وخدمات البيانات والمدفوعات.",arabRelation:"بنية مالية انطلقت من البحرين وتوسعت إقليميًا",creator:"بدأت Tarabut في البحرين عام 2018.",availability:"خدمة B2B للمؤسسات والمطورين وليست تطبيقًا مصرفيًا استهلاكيًا عامًا.",price:"مؤسسي؛ تواصل مع الجهة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"لا تعرضها كبديل لبنك أو محفظة للمستخدم الفردي؛ قيمتها في البنية والتكاملات المالية.",url:"https://tarabut.com/sa/company",domain:"tarabut.com",modules:[["التنظيم","تذكر الشركة أنها منظمة في البحرين كمقدم معلومات حسابات وبدء مدفوعات."],["مصادر التحقق المحفوظة","<a href='https://tarabut.com/sa/company' target='_blank' rel='noopener noreferrer'>عن Tarabut</a>"]]},

{id:"bibf",name:"BIBF",logo:officialFavicon("bibf.com"),type:"تعليم مهني",cat:"learn",sub:"courses",origin:[],value:"معهد بحريني يقدم برامج ودورات مهنية في البنوك والتمويل والتمويل الإسلامي والإدارة والتحول الرقمي ومجالات الأعمال.",arabRelation:"خبرة مهنية وتعليم مالي من البحرين للمنطقة",creator:"Bahrain Institute of Banking and Finance — البحرين.",availability:"حضوري وافتراضي وهجين بحسب البرنامج؛ تتوفر أحيانًا دورات إلكترونية مجانية.",price:"مجاني لبعض المبادرات + برامج مدفوعة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"الاعتماد والسعر وطريقة الحضور تختلف من برنامج لآخر؛ راجع صفحة الدورة نفسها.",url:"https://www.bibf.com/find-course/",domain:"bibf.com",modules:[["المجالات","بنوك وتمويل وتمويل إسلامي وإدارة وتحول رقمي وتأمين وغيرها."],["مصادر التحقق المحفوظة","<a href='https://www.bibf.com/find-course/' target='_blank' rel='noopener noreferrer'>دليل الدورات</a>"]]},

{id:"thawani",name:"ثواني باي",logo:officialFavicon("thawani.om"),type:"مدفوعات رقمية",cat:"tech",sub:"infra",origin:[],value:"منصة عُمانية للمدفوعات والمحفظة الرقمية والتحويلات والبطاقات وخدمات الأفراد والتجار عبر تطبيق واحد.",arabRelation:"تقنية مالية محلية منظمة في سلطنة عُمان",creator:"ثواني للتقنيات — عُمان؛ مرخصة من البنك المركزي العُماني.",availability:"الخدمات موجهة للسوق العُماني وتخضع لشروط الحساب والتحقق.",price:"تختلف الرسوم حسب الخدمة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"خدمة مالية؛ راجع الرسوم والحدود والشروط الحالية مباشرة قبل الاستخدام أو التحويل.",url:"https://thawani.om/ar/",domain:"thawani.om",modules:[["التنظيم","الموقع يذكر ترخيص ثواني من البنك المركزي العُماني."],["مصادر التحقق المحفوظة","<a href='https://thawani.om/ar/about-us' target='_blank' rel='noopener noreferrer'>عن ثواني</a>"]]},

{id:"emushrif",name:"eMushrif",logo:officialFavicon("emushrif.com"),type:"تقنية نقل مدرسي",cat:"tech",sub:"software",origin:[],value:"منظومة رقمية للنقل المدرسي تربط الأسر والحافلات وفرق التشغيل بالتتبع والإشعارات وأدوات السلامة وإدارة المسارات.",arabRelation:"منتج إقليمي بحضور تشغيلي واضح في عُمان",creator:"eMushrif؛ للموقع مكتب معلن في مسقط إلى جانب أسواق أخرى.",availability:"مؤسسي للمدارس ومشغلي النقل؛ الإتاحة بحسب العقود والسوق.",price:"مؤسسي؛ تواصل مع الجهة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"المصدر الرسمي الحالي يثبت الحضور والخدمة في عُمان؛ لا ننسب كل عمليات الشركة لبلد واحد خارج ما يعلنه الموقع.",url:"https://www.emushrif.com/ar/home",domain:"emushrif.com",modules:[["الوظائف","تتبع مباشر وإشعارات وتقنيات أمان وإدارة تشغيل النقل المدرسي."],["مصادر التحقق المحفوظة","<a href='https://www.emushrif.com/ar/home' target='_blank' rel='noopener noreferrer'>الموقع الرسمي</a>"]]},

{id:"edlal",name:"إدلال",logo:officialFavicon("edlal.org"),type:"تعلم إلكتروني",cat:"learn",sub:"courses",origin:["coursera"],value:"منصة عُمانية للتعلم الإلكتروني المفتوح، صُممت لتبادل المعرفة والمهارات بين الخبراء والشباب وإثراء المحتوى العربي.",arabRelation:"تعلم ومهارات عربية من عُمان",creator:"أطلقتها عمانتل في 2017 بالشراكة مع Entrepreneurs in Point.",availability:"منصة تعلم عبر الإنترنت؛ راجع الموقع للدورات النشطة حاليًا.",price:"يختلف حسب الدورة؛ توجد مواد ومبادرات مفتوحة",verified:"مصدر رسمي من عمانتل — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"بعض أرقام الانتشار المنشورة تخص أثر المبادرة ككل؛ لا نفترض أن كل دورة متاحة دائمًا أو مجانية.",url:"https://www.edlal.org/",domain:"edlal.org",modules:[["الدليل الرسمي","عمانتل تصف إدلال بأنها أول منصة تعلم إلكتروني مفتوحة من نوعها في عُمان."],["مصادر التحقق المحفوظة","<a href='https://www.omantel.om/ar/csr/key-initiatives/edlal-platform' target='_blank' rel='noopener noreferrer'>عمانتل عن إدلال</a>"]]},

{id:"tadarab",name:"تدرب",logo:officialFavicon("tadarab.com"),type:"منصة دورات",cat:"learn",sub:"courses",origin:["udemy"],value:"منصة دورات عربية من الكويت في المهارات والأعمال والإبداع ومجالات حياتية متعددة، مع محتوى مسجل من مدربين عرب.",arabRelation:"محتوى تدريبي عربي موجه للمنطقة",creator:"منصة تدرب — الكويت.",availability:"تعلم عبر الإنترنت؛ الوصول حسب شراء الدورة أو الباقة الحالية.",price:"مدفوع غالبًا مع عروض ومحتوى يختلف حسب الدورة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"شهادة إتمام الدورة لا تعني تلقائيًا اعتمادًا أكاديميًا أو مهنيًا؛ افحص جهة الشهادة لكل مسار.",url:"https://www.tadarab.com/",domain:"tadarab.com",modules:[["النطاق","الموقع يذكر 1000+ دورة و300 ألف+ متعلم في الوطن العربي."],["مصادر التحقق المحفوظة","<a href='https://www.tadarab.com/about-tadarab' target='_blank' rel='noopener noreferrer'>عن تدرب</a>"]]},

{id:"myfatoorah",name:"MyFatoorah",logo:officialFavicon("myfatoorah.com"),type:"بوابة دفع",cat:"tech",sub:"infra",origin:["stripe"],value:"حل دفع إلكتروني كويتي للشركات يوفر روابط ومدفوعات وتكاملات، وتوسع من الكويت إلى عدة أسواق في المنطقة.",arabRelation:"تقنية مالية خليجية بانتشار إقليمي",creator:"تأسست في الكويت عام 2016.",availability:"للشركات والتجار؛ التفعيل والوسائل المتاحة تختلف حسب البلد.",price:"رسوم تجارية تختلف حسب السوق والخدمة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"لا تنقل تسعير سوق إلى سوق آخر؛ الرسوم وطرق الدفع والتسوية والتنظيم تختلف حسب الدولة.",url:"https://www.myfatoorah.com/",domain:"myfatoorah.com",modules:[["الانتشار","تقول الشركة إن لها مكاتب وخدمات في عدة دول بالمنطقة."],["مصادر التحقق المحفوظة","<a href='https://www.myfatoorah.com/من-نحن/' target='_blank' rel='noopener noreferrer'>عن ماي فاتورة</a>"]]},

{id:"boutiqaat",name:"بوتيكات",logo:officialFavicon("boutiqaat.com"),type:"تسوّق متخصص",cat:"shopping",sub:"specialized",origin:[],value:"منصة تجارة إلكترونية كويتية تركز على الجمال والعطور والموضة ومنتجات مختارة، وتعمل في أسواق خليجية وعربية متعددة.",arabRelation:"تجربة تجارة إلكترونية تأسست في الكويت للسوق الإقليمي",creator:"تأسست في 2015 على يد رواد أعمال كويتيين.",availability:"الشحن والتشكيلة والإرجاع تختلف حسب البلد والمنتج.",price:"الأسعار حسب المنتج والسوق",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"قبل الشراء راجع بلد البائع/الشحن وسياسة الإرجاع والضمان للمنتج المحدد؛ لا نعمم سياسة واحدة على كل الأسواق.",url:"https://www.boutiqaat.com/",domain:"boutiqaat.com",modules:[["التخصص","جمال وعطور وموضة وتسوق إلكتروني مع حضور خليجي وإقليمي."],["مصادر التحقق المحفوظة","<a href='https://blog.boutiqaat.com/ar/about-us' target='_blank' rel='noopener noreferrer'>قصة بوتيكات</a>"]]},

{id:"gomycode",name:"GOMYCODE",logo:officialFavicon("gomycode.com"),type:"تعليم تقني",cat:"learn",sub:"courses",origin:["coursera"],value:"مدرسة تقنية انطلقت من تونس وتقدم مسارات في البرمجة والذكاء الاصطناعي والبيانات والتسويق والتصميم، حضوريًا أو عبر الإنترنت.",arabRelation:"مشروع تعليمي تقني نشأ في تونس وتوسع عبر أفريقيا والمنطقة",creator:"GOMYCODE — مقر Hackerspace معلن في تونس وتوسع إلى عدة دول.",availability:"حضوري أو أونلاين حسب المسار والبلد.",price:"برامج مدفوعة؛ تختلف حسب البلد والمسار",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"البرامج والأسعار ونتائج التوظيف تختلف حسب المسار والبلد؛ لا نعمم أي نسبة نجاح على كل طالب.",url:"https://gomycode.com/tn/",domain:"gomycode.com",modules:[["المجالات","AI وبرمجة وبيانات وتسويق وتصميم ومهارات مهنية."],["مصادر التحقق المحفوظة","<a href='https://gomycode.com/tn/about/' target='_blank' rel='noopener noreferrer'>عن GOMYCODE تونس</a>"]]},

{id:"expensya",name:"Expensya",logo:officialFavicon("expensya.com"),type:"إدارة مصروفات",cat:"work",sub:"management",origin:[],value:"منصة لإدارة مصروفات الشركات وأتمتة تقارير النفقات والبطاقات والسياسات والتكاملات المحاسبية، تأسست في تونس ثم توسعت عالميًا.",arabRelation:"شركة تقنية تأسست في تونس ووصل منتجها لأسواق عالمية",creator:"تأسست في تونس عام 2014؛ أصبحت جزءًا من Medius.",availability:"حل B2B للشركات؛ يتطلب إعدادًا مؤسسيًا.",price:"مؤسسي؛ اطلب عرضًا",verified:"مصدر رسمي للشركة/الاستحواذ — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"الشركة أصبحت ضمن Medius؛ راجع الاسم التجاري والباقة والتكاملات الحالية قبل قرار الشراء.",url:"https://www.expensya.com/en/",domain:"expensya.com",modules:[["النطاق","إدارة المصروفات والبطاقات والسياسات والتكامل مع أنظمة الشركات."],["مصادر التحقق المحفوظة","<a href='https://www.expensya.com/en/news/medius-announces-intent-to-acquire-expensya/' target='_blank' rel='noopener noreferrer'>تأسيس Expensya والاستحواذ</a>"]]},

{id:"dabchy",name:"Dabchy",logo:officialFavicon("dabchy.com"),type:"سوق مستعمل",cat:"shopping",sub:"classifieds",origin:[],value:"سوق تونسي بين الأفراد لبيع وشراء الملابس والإكسسوارات والديكور والرياضة والكتب والألعاب المستعملة.",arabRelation:"Marketplace محلي من تونس",creator:"Dabchy — تونس.",availability:"متاح بحسب المناطق والخدمات التي تدعمها المنصة.",price:"التصفح مجاني؛ الأسعار يحددها البائعون والخدمات",verified:"الموقع الرسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"المعاملات بين الأفراد تحتاج مراجعة حالة المنتج والبائع وشروط الحماية والدفع قبل الشراء.",url:"https://www.dabchy.com/",domain:"dabchy.com",modules:[["النطاق","منصة C2C للمنتجات المستعملة في فئات أسلوب الحياة."],["مصادر التحقق المحفوظة","<a href='https://www.dabchy.com/' target='_blank' rel='noopener noreferrer'>الموقع الرسمي</a>"]]},

{id:"yassir",name:"يسير",logo:officialFavicon("yassir.com"),type:"تطبيق فائق",cat:"tech",sub:"software",origin:[],value:"منصة انطلقت لتسهيل التنقل للجزائريين ثم توسعت إلى التوصيل والتجارة وخدمات أخرى في عدة مدن وأسواق.",arabRelation:"حل تقني بدأ من احتياج محلي جزائري ثم توسع إقليميًا",creator:"ظهرت فكرة يسير في 2017 لخدمة التنقل في الجزائر.",availability:"الخدمات تختلف حسب البلد والمدينة.",price:"تختلف حسب الخدمة والموقع",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"لا تفترض توافر كل خدمات السوبر آب في كل مدينة؛ تحقق من التطبيق في موقعك.",url:"https://yassir.com/ar/algeria",domain:"yassir.com",modules:[["الخدمات","تنقل وتوصيل وطعام وبقالة وخدمات رقمية أخرى بحسب السوق."],["مصادر التحقق المحفوظة","<a href='https://yassir.com/ar/about-us' target='_blank' rel='noopener noreferrer'>قصة يسير</a>"]]},

{id:"ouedkniss",name:"واد كنيس",logo:officialFavicon("ouedkniss.com"),type:"إعلانات مبوبة",cat:"shopping",sub:"classifieds",origin:[],value:"منصة جزائرية للإعلانات المبوبة والبيع والشراء والخدمات بين المستخدمين في فئات واسعة.",arabRelation:"شركة ومنصة مسجلة في الجزائر وموجهة للسوق المحلي",creator:"SARL OUEDKNISS — شركة جزائرية مسجلة رسميًا بحسب شروط الاستخدام.",availability:"متاحة عبر الويب والتطبيق.",price:"التصفح والنشر لهما حدود وخدمات ترويج مدفوعة",verified:"الشروط الرسمية — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"المنصة تستضيف إعلانات المستخدمين ولا تتدخل في كل معاملة؛ تحقق من البائع والمنتج والدفع قبل إتمام الصفقة.",url:"https://www.ouedkniss.com/",domain:"ouedkniss.com",modules:[["طبيعة السوق","إعلانات ينشرها المستخدمون؛ مسؤولية التحقق من الطرف والسلعة مهمة."],["مصادر التحقق المحفوظة","<a href='https://www.ouedkniss.com/terms' target='_blank' rel='noopener noreferrer'>شروط الاستخدام</a>"]]},

{id:"baridimob",name:"BaridiMob",logo:officialFavicon("poste.dz"),type:"خدمات مالية بريدية",cat:"tech",sub:"infra",origin:[],value:"تطبيق رسمي لبريد الجزائر لإدارة حساب CCP وبطاقة الذهبية والتحويلات وبعض الخدمات المالية البريدية من الهاتف.",arabRelation:"خدمة مالية رقمية وطنية في الجزائر",creator:"بريد الجزائر.",availability:"لعملاء بريد الجزائر وحاملي بطاقة EDAHABIA وفق شروط الاشتراك.",price:"بعض العمليات تخضع لرسوم وحدود رسمية",verified:"مصدر حكومي/رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"استخدم التطبيقين الرسميين فقط كما يحذر بريد الجزائر، وراجع حدود ورسوم التحويل الحالية.",url:"https://www.poste.dz/services/professional/baridimobweb",domain:"poste.dz",modules:[["الوظائف","رصيد CCP وإدارة البطاقة والتحويلات وتحديد الصرافات وسجل العمليات."],["مصادر التحقق المحفوظة","<a href='https://www.poste.dz/services/professional/baridimobweb' target='_blank' rel='noopener noreferrer'>BaridiMob لدى بريد الجزائر</a>"]]},

{id:"miswag",name:"مسواگ",logo:officialFavicon("miswag.com"),type:"تجارة إلكترونية",cat:"shopping",sub:"marketplaces",origin:["amazon"],value:"منصة تجارة إلكترونية عراقية تأسست في بغداد وتبيع منتجات من تجار وعلامات محلية وعالمية مع تشغيل وتوصيل داخل العراق.",arabRelation:"شركة عراقية مبنية للسوق العراقي",creator:"تأسست في العراق عام 2014 وبناها فريق عراقي.",availability:"التغطية والتوصيل بحسب المنطقة والمنتج.",price:"الأسعار حسب المنتج والشحن",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"قبل الشراء راجع التوصيل والإرجاع والضمان للمنتج المحدد؛ الأرقام التاريخية على صفحة «من نحن» ليست وصفًا لحجمها الحالي بالضرورة.",url:"https://miswag.com/",domain:"miswag.com",modules:[["الهوية","تصف نفسها بأنها أول موقع تجارة إلكترونية في العراق وشركة مسجلة عراقيًا."],["مصادر التحقق المحفوظة","<a href='https://miswag.com/en/more/about' target='_blank' rel='noopener noreferrer'>عن مسواگ</a>"]]},

{id:"lezzoo",name:"Lezzoo",logo:officialFavicon("lezzoo.com"),type:"تطبيق فائق",cat:"tech",sub:"software",origin:[],value:"سوبر آب من أربيل يجمع الطعام والبقالة والصيدليات والمدفوعات والألعاب وخصائص اجتماعية وخدمات يومية داخل العراق.",arabRelation:"بُني من أربيل للعراق وكردستان",creator:"تأسس في أربيل عام 2018.",availability:"الخدمات والتوصيل متاحة في مدن عراقية محددة وتتوسع تدريجيًا.",price:"التطبيق مجاني؛ رسوم الخدمات تختلف",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"أرقام العملاء والتجار والمبيعات على الموقع معلنة من الشركة نفسها؛ لا نقدمها كتدقيق مستقل.",url:"https://www.lezzoo.com/ar",domain:"lezzoo.com",modules:[["النطاق","طعام وبقالة وصيدلية ومدفوعات وألعاب وتواصل وخصائص رقمية."],["مصادر التحقق المحفوظة","<a href='https://www.lezzoo.com/ar/story' target='_blank' rel='noopener noreferrer'>قصة Lezzoo</a>"]]},

{id:"superqi",name:"SuperQi",logo:officialFavicon("qi.iq"),type:"مدفوعات رقمية",cat:"tech",sub:"infra",origin:[],value:"تطبيق من Qi للمستخدمين العراقيين يجمع التحويلات والمدفوعات وإدارة الإنفاق وخدمات رقمية في واجهة عربية وإنجليزية.",arabRelation:"منتج مالي رقمي موجه للسوق العراقي",creator:"Qi Card — العراق.",availability:"متاح لمستخدمي الخدمة وفق شروط الحساب والبطاقات.",price:"الرسوم والحدود حسب الخدمة",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"خدمة مالية؛ راجع الرسوم والأهلية والحدود وشروط البطاقة الحالية مباشرة قبل الاستخدام.",url:"https://www.qi.iq/ar/individuals/superqi",domain:"qi.iq",modules:[["الوظائف","تحويلات ومدفوعات للتجار وتتبع للمصاريف وميزات تطبيقات مصغرة."],["مصادر التحقق المحفوظة","<a href='https://www.qi.iq/ar/individuals/superqi' target='_blank' rel='noopener noreferrer'>SuperQi الرسمي</a>"]]},

{id:"podeo",name:"Podeo",logo:officialFavicon("podeo.co"),type:"صناعة وتوزيع صوتي",cat:"create",sub:"audio",origin:[],value:"بنية لصناع الصوت والبودكاست تساعد على التسجيل والتوزيع عبر المنصات وتحويل المحتوى إلى صيغ متعددة وإدارة الوصول والعائد.",arabRelation:"بدأت من سوق الصوت العربي ولها كيان وحضور في بيروت",creator:"تأسست في 2020؛ للمجموعة كيان Podeo SAL في بيروت إلى جانب كيانات دولية.",availability:"للأفراد والشبكات والناشرين؛ المزايا تختلف حسب الخطة.",price:"تختلف حسب الخطة والخدمات",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"هي بنية لصناع المحتوى وليست تطبيق استماع مطابقًا لـSpotify؛ بعض أرقام الانتشار معلنة من الشركة.",url:"https://podeo.co/",domain:"podeo.co",modules:[["ما الذي تقدمه؟","إنشاء وتوزيع وتحويل وربح المحتوى الصوتي عبر قنوات متعددة."],["مصادر التحقق المحفوظة","<a href='https://podeo.co/about-us' target='_blank' rel='noopener noreferrer'>عن Podeo</a>"]]},

{id:"mawdoo3",name:"موضوع",logo:officialFavicon("mawdoo3.com"),type:"محتوى ومعرفة",cat:"learn",sub:"encyclopedias",origin:["wikipedia"],value:"موقع محتوى عربي واسع يشرح موضوعات يومية ومعرفية متعددة، مع سياسة تحرير معلنة ومحتوى يراجعه محررون ومتخصصون بحسب الفئة.",arabRelation:"إثراء المحتوى العربي هو جوهر المشروع منذ البداية",creator:"بدأ في 2010 على يد رامي القواسمي ومحمد جبر، وهما أردنيان.",availability:"متاح عبر الويب.",price:"مجاني مع إعلانات وخدمات أخرى",verified:"مصدر رسمي — مراجعة 23 سبتمبر 2026",reviewed:"23 سبتمبر 2026",limit:"مفيد كبداية للفهم العام، لكنه لا يحل محل المصدر الأولي أو المرجع الأكاديمي/الطبي المتخصص عند اتخاذ قرار حساس.",url:"https://mawdoo3.com/",domain:"mawdoo3.com",modules:[["المنهج","صفحة «عن موضوع» تصف مراحل بحث وكتابة وتدقيق ومراجعة، لكن جودة كل مادة تُقيّم بذاتها."],["مصادر التحقق المحفوظة","<a href='https://mawdoo3.com/About_Us' target='_blank' rel='noopener noreferrer'>عن موضوع وسياسة العمل</a>"]]}


];

const learning=[
{id:'yanfaa',type:'platform',name:'ينفع',logo:officialFavicon('yanfaa.com'),teacher:'منصة تعليم',focus:'كورسات عربية في مهارات ومجالات متعددة.',fields:['skills','business'],reference:'مصدر عربي للتعلّم',url:'https://yanfaa.com/'},
{id:'edraak-learning',type:'platform',name:'إدراك',logo:officialFavicon('edraak.org'),teacher:'منصة تعليم',focus:'مقررات عربية في مجالات متنوعة.',fields:['skills','business','tech'],reference:'منصة كورسات',url:'https://www.edraak.org/'},
{id:'rwaq',type:'platform',name:'رواق',logo:officialFavicon('rwaq.org'),teacher:'منصة تعليم',focus:'مواد أكاديمية ومهارية باللغة العربية.',fields:['skills','tech','business'],reference:'منصة عربية',url:'https://rwaq.org/'},
{id:'almentor',type:'platform',name:'المنتور',logo:officialFavicon('almentor.net'),teacher:'منصة تعليم',focus:'محتوى مهني ومهاري عربي باشتراك.',fields:['skills','business','design'],reference:'اشتراك مدفوع',url:'https://www.almentor.net/'},

{id:'salla-academy',type:'resource',name:'أكاديمية سلة',logo:officialFavicon('salla.com'),teacher:'سلة',focus:'دورات عملية في التجارة الإلكترونية والتسويق وتصميم المتجر وإدارة الطلبات.',fields:['business','skills','design'],reference:'محتوى تعليمي رسمي من سلة؛ مفيد للتعلم لكنه ليس مراجعة مستقلة للمنصة.',url:'https://academy.salla.com/courses',commercialId:'salla',commercialContentKey:'academy',vendorContent:true},
{id:'qoyod-academy',type:'resource',name:'أكاديمية قيود',logo:officialFavicon('qoyod.com'),teacher:'قيود',focus:'مسارات ودورات عربية مجانية في استخدام النظام والمفاهيم المحاسبية، مع ندوات وشهادة إتمام.',fields:['business','skills'],reference:'محتوى تعليمي رسمي من قيود؛ لا نعامله كتقييم مستقل للمنتج.',url:'https://academy.qoyod.com/',commercialId:'qoyod',commercialContentKey:'academy',vendorContent:true},
{id:'daftra-hub',type:'resource',name:'مركز دفترة التعليمي',logo:officialFavicon('daftra.com'),teacher:'دفترة',focus:'مقالات ودروس في المحاسبة وإدارة الأعمال والمبيعات والمخزون والموارد البشرية.',fields:['business','skills'],reference:'مركز تعليمي رسمي من دفترة؛ المعلومة التعليمية منفصلة عن تقييم المنتج نفسه.',url:'https://www.daftra.com/hub/',commercialId:'daftra',commercialContentKey:'learningHub',vendorContent:true},
{id:'khamsat-blog',type:'resource',name:'مدونة خمسات',logo:officialFavicon('khamsat.com'),teacher:'خمسات',focus:'مقالات عملية عن العمل الحر، بيع الخدمات، التسويق للمستقل وبناء حضور مهني.',fields:['business','skills'],reference:'محتوى رسمي من خمسات؛ نستخدمه كمصدر تعلم لا كمراجعة مستقلة لخمسات.',url:'https://blog.khamsat.com/category/freelancing/',commercialId:'khamsat',commercialContentKey:'freelancingBlog',vendorContent:true},
{id:'hsoub-library',type:'resource',name:'أكاديمية حسوب — مقالات ودروس',logo:officialFavicon('academy.hsoub.com'),teacher:'أكاديمية حسوب',focus:'مقالات وكتب ودروس عربية مجانية في البرمجة والتطوير والتقنية وسوق العمل.',fields:['tech','business','skills'],reference:'محتوى رسمي من أكاديمية حسوب؛ يظهر هنا لقيمته التعليمية، لا بسبب أي علاقة تجارية.',url:'https://academy.hsoub.com/',commercialId:'hsoub',commercialContentKey:'learning',vendorContent:true},

{id:'zamerican',type:'channel',name:'zAmericanEnglish',logo:'material:language',teacher:'إبراهيم عادل',focus:'تعلّم الإنجليزية بشرح عربي منظم.',fields:['languages'],reference:'قناة يوتيوب',url:'https://www.youtube.com/@ZAmericanEnglish'},
{id:'droosonline',type:'channel',name:'دروس أونلاين',logo:'material:school',teacher:'أحمد أبو زيد',focus:'تعلم ومهارات عملية ومحتوى تعليمي متنوع.',fields:['skills','languages'],reference:'قناة يوتيوب',url:'https://www.youtube.com/@DroosOnline4u'},
{id:'elzero',type:'channel',name:'Elzero Web School',logo:'material:code',teacher:'أسامة الزيرو',focus:'برمجة وتطوير ويب بالعربية من مسارات عملية.',fields:['tech'],reference:'قناة يوتيوب',url:'https://www.youtube.com/@ElzeroWebSchool'},
{id:'makram',type:'channel',name:'mostafa makram TV',logo:'material:movie',teacher:'مصطفى مكرم',focus:'تصميم ومونتاج وبرامج إبداعية بشرح عربي.',fields:['design','skills'],reference:'قناة يوتيوب',url:'https://www.youtube.com/@mostafamakram'},

{id:'hsoub-youtube',type:'channel',name:'أكاديمية حسوب',logo:'material:code',teacher:'أكاديمية حسوب',focus:'برمجة وتقنية وسوق عمل بالعربية، مع دروس ومسارات تطبيقية.',fields:['tech','business'],reference:'قناة YouTube موثقة لأكاديمية حسوب',url:'https://www.youtube.com/@HsoubAcademy'},
{id:'akhdar-youtube',type:'channel',name:'أخضر',logo:'material:menu_book',teacher:'أخضر',focus:'تبسيط كتب ومعرفة ومهارات عملية للشباب العربي.',fields:['knowledge','skills'],reference:'القناة المرتبطة رسميًا بمنصة أخضر',url:'https://www.youtube.com/@a5drcom'},
{id:'khan-arabi',type:'channel',name:'KhanAcademyArabi',logo:'material:school',teacher:'Khan Academy',focus:'أرشيف عربي رسمي في الرياضيات والعلوم والاقتصاد ومواد أكاديمية متنوعة.',fields:['knowledge','tech'],reference:'القناة العربية الرسمية لأكاديمية خان',url:'https://www.youtube.com/@KhanAcademyArabi'},
{id:'abdulbasit-official',type:'reciter',name:'عبد الباسط عبد الصمد',logo:'material:mic',teacher:'الشيخ عبد الباسط عبد الصمد',focus:'تلاوات مرتلة ومجودة من التسجيلات الأصلية التي أنتجتها صوت القاهرة.',fields:['quran'],reference:'قناة رسمية — تسجيلات صوت القاهرة',url:'https://www.youtube.com/@AbdulbasitOfficial'},
{id:'hussary-official',type:'reciter',name:'محمود خليل الحصري',logo:'material:mic',teacher:'الشيخ محمود خليل الحصري',focus:'أرشيف رسمي واسع للتلاوات المرتلة والمجودة للشيخ الحصري.',fields:['quran'],reference:'القناة الرسمية للشيخ الحصري',url:'https://www.youtube.com/@hosariofficial'},
{id:'mostafa-ismail-official',type:'reciter',name:'مصطفى إسماعيل',logo:'material:mic',teacher:'الشيخ مصطفى إسماعيل',focus:'تسجيلات رسمية من تراث أحد أعلام المدرسة المصرية في التلاوة.',fields:['quran'],reference:'قناة رسمية يربط إليها موقع صوت القاهرة',url:'https://www.youtube.com/user/ShMostafaIsmail'},
{id:'maher-official',type:'reciter',name:'ماهر المعيقلي',logo:'material:mic',teacher:'الشيخ ماهر المعيقلي',focus:'تلاوات حديثة ومصحف كامل من القناة الرسمية للقارئ.',fields:['quran'],reference:'قناة رسمية / Official Artist Channel',url:'https://www.youtube.com/@maheralmuaiqly'},
{id:'alafasy-official',type:'reciter',name:'مشاري راشد العفاسي',logo:'material:mic',teacher:'الشيخ مشاري راشد العفاسي',focus:'تلاوات قرآنية وإصدارات صوتية عبر القناة الرسمية الموثقة.',fields:['quran'],reference:'قناة رسمية موثقة',url:'https://www.youtube.com/@Alafasy'},
{id:'saad-ghamdi-official',type:'reciter',name:'سعد الغامدي',logo:'material:mic',teacher:'الشيخ سعد الغامدي',focus:'تلاوات ومصحف مرتل عبر القناة الرسمية للقارئ.',fields:['quran'],reference:'قناة رسمية',url:'https://www.youtube.com/@SheikhSaadAlGhamdi'}
,
{id:'misk-skills',type:'platform',name:'مسك المهارات',logo:officialFavicon('hub.misk.org.sa'),teacher:'مؤسسة محمد بن سلمان «مسك»',focus:'برامج مهارات واستعداد مهني وفرص تعلم ذاتي وتفاعلي للشباب، ومنها مسارات عربية أونلاين.',fields:['skills','business','tech'],reference:'منصة رسمية سعودية؛ شروط كل برنامج مستقلة',url:'https://hub.misk.org.sa/ar/misk-skills/'},
{id:'thmanyah-youtube',type:'channel',name:'ثمانية',logo:'material:movie',teacher:'شركة ثمانية',focus:'وثائقيات وبرامج وبودكاست وقصص عربية بإنتاج تحريري أصلي من السعودية.',fields:['knowledge','skills'],reference:'قناة رسمية مدرجة في صفحة حسابات ثمانية',url:'https://www.youtube.com/@thmanyah'},
{id:'alef-learning',type:'platform',name:'ألف للتعليم',logo:officialFavicon('alefeducation.com'),teacher:'ألف للتعليم',focus:'تعلم رقمي مدعوم بالذكاء الاصطناعي للمراحل K-12؛ الوصول غالبًا عبر المدرسة أو الجهة التعليمية.',fields:['knowledge','tech'],reference:'منصة إماراتية مؤسسية؛ ليست كورسات عامة مفتوحة',url:'https://www.alefeducation.com/ar/'},
{id:'dff-academy',type:'platform',name:'أكاديمية دبي للمستقبل',logo:officialFavicon('dubaifuture.ae'),teacher:'مؤسسة دبي للمستقبل',focus:'مهارات مستقبل وتطوير مهني، مع دليل لدورات افتراضية مجانية ذاتية وبالعربية والإنجليزية.',fields:['skills','business','tech','knowledge'],reference:'مبادرة رسمية من مؤسسة دبي للمستقبل',url:'https://www.dubaifuture.ae/initiatives/capacity-building/dubai-future-academy/'},
{id:'qdl-youtube',type:'channel',name:'مكتبة قطر الرقمية',logo:'material:menu_book',teacher:'Qatar Digital Library',focus:'فيديوهات مرتبطة بأرشيف تاريخ الخليج والمخطوطات والخرائط والمصادر الأولية الرقمية.',fields:['knowledge'],reference:'قناة للمشروع الرقمي المشترك بين مكتبة قطر الوطنية ومؤسسة قطر والمكتبة البريطانية',url:'https://www.youtube.com/@qatardigitallibrary9578'},
{id:'kezakoo-learning',type:'platform',name:'Kezakoo',logo:officialFavicon('kezakoo.com'),teacher:'Kezakoo',focus:'دروس واختبارات وتمارين وملخصات للثانوي المغربي وفق البرنامج الرسمي.',fields:['knowledge','skills'],reference:'منصة تعليمية وُلدت في المغرب',url:'https://www.kezakoo.com/ar/'},
{id:'telmidtice-learning',type:'platform',name:'TelmidTICE',logo:officialFavicon('telmidtice.men.gov.ma'),teacher:'وزارة التربية الوطنية المغربية',focus:'دروس وملخصات وتمارين وفروض وامتحانات لمراحل ومواد المدرسة المغربية.',fields:['knowledge'],reference:'منصة حكومية رسمية',url:'https://telmidtice.men.gov.ma/'},
{id:'bibf-learning',type:'platform',name:'BIBF',logo:officialFavicon('bibf.com'),teacher:'Bahrain Institute of Banking and Finance',focus:'تعلم مهني في البنوك والتمويل والتمويل الإسلامي والإدارة والتحول الرقمي، حضوريًا وافتراضيًا.',fields:['business','skills'],reference:'معهد بحريني؛ الاعتماد والتكلفة حسب البرنامج',url:'https://www.bibf.com/find-course/'},
{id:'edlal-learning',type:'platform',name:'إدلال',logo:officialFavicon('edlal.org'),teacher:'إدلال',focus:'تعلم إلكتروني عربي في المعرفة والمهارات وسوق العمل؛ أطلقتها عمانتل مع شريك محلي.',fields:['skills','business','tech'],reference:'منصة عُمانية؛ تحقق من الدورات النشطة حاليًا',url:'https://www.edlal.org/'},
{id:'tadarab-learning',type:'platform',name:'تدرب',logo:officialFavicon('tadarab.com'),teacher:'منصة تدرب',focus:'مكتبة دورات عربية في المهارات والأعمال والإبداع ومجالات متعددة.',fields:['skills','business','design','knowledge'],reference:'منصة كويتية؛ شهادة الإتمام ليست اعتمادًا أكاديميًا تلقائيًا',url:'https://www.tadarab.com/'},
{id:'gomycode-learning',type:'platform',name:'GOMYCODE',logo:officialFavicon('gomycode.com'),teacher:'GOMYCODE',focus:'تعلم تقني في الذكاء الاصطناعي والبرمجة والبيانات والتسويق والتصميم، أونلاين أو حضوريًا.',fields:['tech','design','business'],reference:'مدرسة تقنية انطلقت من تونس وتوسعت إقليميًا',url:'https://gomycode.com/tn/'},
{id:'cnfepd-learning',type:'platform',name:'CNFEPD',logo:officialFavicon('cnepd.edu.dz'),teacher:'وزارة التكوين والتعليم المهنيين — الجزائر',focus:'تكوين مهني عن بعد في عشرات التخصصات، مع مسارات تؤدي لشهادات دولة وفق شروط المركز.',fields:['skills','business','tech'],reference:'مؤسسة عمومية جزائرية رسمية؛ نوع الشهادة والمدة حسب التخصص',url:'https://www.cnepd.edu.dz/'},
{id:'newton-learning',type:'platform',name:'منصة نيوتن',logo:officialFavicon('newton.iq'),teacher:'منصة نيوتن',focus:'تعليم مدرسي عن بعد في العراق يضم محاضرات وكتبًا وتمارين ومواد دراسية متعددة.',fields:['knowledge','tech'],reference:'منصة عراقية؛ الأرقام المعروضة للمحاضرات والطلاب منشورة على الموقع نفسه',url:'https://newton.iq/explore'},
{id:'kamkalima-learning',type:'platform',name:'كم كلمة',logo:officialFavicon('kamkalima.com'),teacher:'Kamkalima',focus:'منصة رقمية لتعليم العربية في المدارس، بأدوات للقراءة والكتابة والتقييم والمعلمين.',fields:['languages','knowledge'],reference:'انطلقت من بيئة الشركات الناشئة اللبنانية؛ الكيان التشغيلي الحالي مسجل في ADGM بالإمارات',url:'https://www.kamkalima.com/ar/home'}


];

let filter='all',subfilter='all',originFilter=null,countryFilter=null,learningType='all';
let directoryVisible=window.matchMedia('(max-width:760px)').matches?3:6;
let learningVisible={platform:4,channel:4,reciter:4};
const learningSectionOpen={channel:false,reciter:false};
const learningCarouselIndex={platform:0,resource:0,channel:0,reciter:0};

function directoryBatchSize(){
 const mobile=window.matchMedia('(max-width:760px)').matches;
 const q=(document.getElementById('searchInput')?.value||'').trim();
 const focused=filter!=='all'||subfilter!=='all'||!!originFilter||!!countryFilter||!!q;
 return mobile||focused ? 3 : 6;
}
function resetDirectoryLimit(){directoryVisible=directoryBatchSize()}
function showMoreDirectory(){directoryVisible+=directoryBatchSize();renderCards()}
function resetLearningLimit(){learningVisible={platform:4,resource:4,channel:4,reciter:4}}
function showMoreLearning(type){enableLearningCarousel(type)}

function norm(s=''){return s.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ة/g,'ه').replace(/[ً-ٰٟ]/g,'').trim()}
function go(id){document.getElementById(id).scrollIntoView({behavior:'smooth'})}
function categoryLabel(v){return categoryNames[v]||v}
function subcategoryLabel(cat,sub){
 if(sub==='all') return '';
 const pair=(subfilterMap[cat]||[]).find(x=>x[0]===sub);
 return pair ? pair[1] : sub;
}

function closeDirectoryRefiners(){
 document.querySelectorAll('.directory-refine-panel').forEach(p=>p.setAttribute('hidden',''));
 document.querySelectorAll('[data-refine-trigger]').forEach(b=>b.setAttribute('aria-expanded','false'));
}
function toggleDirectoryRefine(kind,btn){
 const map={search:'directoryRefineSearch',category:'directoryRefineCategory',sub:'directoryRefineSub'};
 const panel=document.getElementById(map[kind]);if(!panel)return;
 const opening=panel.hasAttribute('hidden');
 closeDirectoryRefiners();
 if(opening){
  panel.removeAttribute('hidden');
  if(btn)btn.setAttribute('aria-expanded','true');
  if(kind==='search')setTimeout(()=>document.getElementById('searchInput')?.focus(),30);
 }
}
function updateDirectoryRefineUI(){
 const root=document.getElementById('directoryActiveFilters');if(!root)return;
 const bits=[];
 if(countryFilter){
  const label=arabProgressCountryNames[countryFilter]||countryFilter;
  bits.push(`<span class="active-filter-pill has-flag"><img src="${flagAssetBase+countryFilter+'.png'}" alt=""><bdi>${label}</bdi></span>`);
 }
 if(originFilter)bits.push(`<span class="active-filter-pill"><bdi>من ${originContextLabel(originFilter)}</bdi></span>`);
 if(filter!=='all')bits.push(`<span class="active-filter-pill"><bdi>${categoryLabel(filter)}</bdi></span>`);
 if(subfilter!=='all')bits.push(`<span class="active-filter-pill"><bdi>${subcategoryLabel(filter,subfilter)}</bdi></span>`);
 const q=document.getElementById('searchInput')?.value.trim()||'';
 if(q)bits.push(`<span class="active-filter-pill search-pill"><bdi>بحث: ${q.replace(/[<>&"]/g,'')}</bdi></span>`);
 root.innerHTML=bits.length?bits.join(''):'<span class="active-filter-pill is-muted">كل الاكتشافات</span>';

 const subBtn=document.getElementById('subfilterTrigger');
 if(subBtn){
  const hasSub=filter!=='all'&&Array.isArray(subfilterMap[filter])&&subfilterMap[filter].length>1;
  subBtn.hidden=!hasSub;
  if(!hasSub){
   const panel=document.getElementById('directoryRefineSub');if(panel)panel.setAttribute('hidden','');
   subBtn.setAttribute('aria-expanded','false');
  }
 }
}
function goDirectoryResults(){
 const el=document.getElementById('directoryResultsStart')||document.getElementById('catalogGrid')||document.getElementById('directory');
 if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
}

function openDirectory(cat){
 setDirectoryFilter(cat);
 closeDirectoryRefiners();
 goDirectoryResults();
}
function setDirectoryFilter(v){
 filter=v;
 subfilter='all';
 originFilter=null;
 countryFilter=null;
 resetDirectoryLimit();
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===v));
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
}
function setFilter(v,el){
 filter=v;
 subfilter='all';
 if(originFilter){
  const route=originRouteMap[originFilter]||{cat:'all',sub:'all'};
  if(v!=='all'&&route.cat!==v){
   originFilter=null;
   document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
  }
 }
 resetDirectoryLimit();
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===v));
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
}
function setSubfilter(v,el){
 subfilter=v;
 if(originFilter){
  const route=originRouteMap[originFilter]||{cat:'all',sub:'all'};
  if(v!=='all'&&route.sub!==v){
   originFilter=null;
   document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
  }
 }
 resetDirectoryLimit();
 document.querySelectorAll('[data-subfilter]').forEach(b=>b.classList.remove('active'));
 if(el)el.classList.add('active');
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
}
function buildSubfilters(){
 const row=document.getElementById('subfilterRow'),root=document.getElementById('subfilters');
 if(filter==='all'||!subfilterMap[filter]){row.style.display='none';root.innerHTML='';return}
 row.style.display='flex';
 root.innerHTML=subfilterMap[filter].map(([id,label])=>
   `<button class="subfilter ${id===subfilter?'active':''}" data-subfilter="${id}" onclick="setSubfilter('${id}',this)">${label}</button>`
 ).join('');
}
function updateDirectoryCrumb(){
 const wrap=document.getElementById('directoryCrumbWrap'),el=document.getElementById('directoryCrumb');
 if(filter==='all'&&subfilter==='all'&&!originFilter&&!countryFilter){
  wrap.style.display='none';
  updateDirectoryRefineUI();
  return;
 }
 const parts=[];
 if(filter!=='all') parts.push(categoryLabel(filter));
 if(subfilter!=='all') parts.push(subcategoryLabel(filter,subfilter));
 if(originFilter) parts.push(originContextLabel(originFilter));
 if(countryFilter) parts.push(arabProgressCountryNames[countryFilter]||countryFilter);
 el.textContent=parts.join(' / ');
 wrap.style.display=parts.length?'inline':'none';
 updateDirectoryRefineUI();
}
function resetAllAndHome(){
 // Directory state
 filter='all';
 subfilter='all';
 originFilter=null;
 countryFilter=null;
 const searchInput=document.getElementById('searchInput');
 if(searchInput) searchInput.value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(
   b=>b.classList.toggle('active',b.dataset.filter==='all')
 );
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 resetDirectoryLimit();
 renderCards();

 // Learning state
 learningType='all';
 const learningSearch=document.getElementById('learningSearch');
 const learningField=document.getElementById('learningField');
 if(learningSearch) learningSearch.value='';
 if(learningField) learningField.value='all';
 document.querySelectorAll('[data-learning-type]').forEach(
   b=>b.classList.toggle('active',b.dataset.learningType==='all')
 );
 updateLearningCrumb();
 updateLearningActionLabel();
 resetLearningLimit();
 renderLearning();

 // Close any open detail layer, then return to the real homepage.
 const modal=document.getElementById('detailModal');
 if(modal) modal.classList.remove('show');
 document.body.classList.remove('lock');
 go('top');
}

function resetDirectory(){
 filter='all';subfilter='all';originFilter=null;countryFilter=null;
 document.getElementById('searchInput').value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
 buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();closeDirectoryRefiners();renderCards();go('directory')
}
function showAllDirectory(){
 // Keep only the current TOP-LEVEL section.
 // Clear internal subsection, familiar-tool filter, and text search.
 originFilter=null;
 countryFilter=null;
 subfilter='all';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.getElementById('searchInput').value='';
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 resetDirectoryLimit();
 closeDirectoryRefiners();
 renderCards();
 goDirectoryResults();
}
function updateDirectoryActionLabel(){
 const btn=document.getElementById('directoryContextBtn');
 if(!btn)return;
 const q=document.getElementById('searchInput')?.value.trim()||'';

 if(countryFilter){
   btn.textContent='كل الدليل';
   btn.title='إلغاء فلتر الدولة وإظهار كل الدليل';
 }else if(filter!=='all'){
   btn.textContent='كل '+categoryLabel(filter);
   btn.title='إلغاء الفلاتر الداخلية وإظهار كل '+categoryLabel(filter);
 }else if(q){
   btn.textContent='مسح البحث';
   btn.title='مسح عبارة البحث وإظهار كل الدليل';
 }else{
   btn.textContent='عرض الكل';
   btn.title='إظهار كل عناصر الدليل';
 }
}
function toggleOriginOptions(btn){
 const root=document.querySelector('.origin-options');if(!root)return;
 const open=root.classList.toggle('is-expanded');
 btn.setAttribute('aria-expanded',open?'true':'false');
 btn.textContent=open?'عرض أقل −':'6 اختيارات أخرى +';
}
function chooseOrigin(v,el){
 countryFilter=null;
 const same=originFilter===v;
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));

 if(same){
   originFilter=null;
 }else{
   const route=originRouteMap[v] || {cat:'all',sub:'all'};
   originFilter=v;
   filter=route.cat;
   subfilter=route.sub;
   el.setAttribute('aria-pressed','true');
   document.getElementById('searchInput').value='';
 }

 resetDirectoryLimit();
 document.querySelectorAll('[data-filter]').forEach(
   b=>b.classList.toggle('active',b.dataset.filter===filter)
 );
 buildSubfilters();
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
 goDirectoryResults();
}
function originContextLabel(id){return id==='youtube'?'محتوى عربي على YouTube':'خيارات في مجال '+originName(id)}
function originName(id){return ({chatgpt:'ChatGPT',canva:'Canva',drive:'Google Drive',coursera:'Coursera',fiverr:'Fiverr',shopify:'Shopify',acrobat:'Acrobat',teams:'Teams',spotify:'Spotify',udemy:'Udemy',amazon:'Amazon',jumia:'Jumia',wikipedia:'Wikipedia',youtube:'YouTube',netflix:'Netflix',kindle:'Kindle',scholar:'Google Scholar',jstor:'JSTOR',quickbooks:'QuickBooks',elevenlabs:'ElevenLabs',otter:'Otter.ai',stripe:'Stripe',linkedin:'LinkedIn',googlemaps:'Google Maps',steam:'Steam'})[id]||id}


function setLearningPath(type='all',field='all'){
 learningType=type;if(type==='channel'||type==='reciter')learningSectionOpen[type]=true;
 const search=document.getElementById('learningSearch'),select=document.getElementById('learningField');
 if(search)search.value='';
 if(select)select.value=field;
 document.querySelectorAll('[data-learning-type]').forEach(b=>b.classList.toggle('active',b.dataset.learningType===type));
 updateLearningCrumb();updateLearningActionLabel();resetLearningLimit();renderLearning();go('learning');
}
function sectionContinueMarkup(title,subtitle,actions=[]){
 if(!actions.length)return '';
 return `<div class="section-continue-copy"><strong>${title}</strong><span>${subtitle}</span></div><div class="section-continue-actions">${actions.map((a,i)=>`<button type="button" class="${i===0?'accent':''}" onclick="${a[1]}">${a[0]}</button>`).join('')}</div>`;
}
function updateDirectoryContinue(){
 const root=document.getElementById('directoryContinue');if(!root)return;
 let actions=[];
 const q=document.getElementById('searchInput')?.value.trim()||'';
 if(originFilter){
   actions.push([`كل ${subcategoryLabel(filter,subfilter)||categoryLabel(filter)}`,`openDiscoveryGroup('${filter}','${subfilter}')`]);
   actions.push([`كل ${categoryLabel(filter)}`,`openDiscoveryGroup('${filter}','all')`]);
 }else if(subfilter!=='all'){
   actions.push([`كل ${categoryLabel(filter)}`,`openDiscoveryGroup('${filter}','all')`]);
   actions.push(['أحدث ما راجعناه',"go('updates')"]);
 }else if(filter!=='all'){
   const subs=(subfilterMap[filter]||[]).filter(([id])=>id!=='all').slice(0,2);
   actions=subs.map(([id,label])=>[label,`openDiscoveryGroup('${filter}','${id}')`]);
   actions.push(['آخر المراجعات',"go('updates')"]);
 }else if(q){
   actions=[['كل الدليل',"resetDirectory()"],['آخر المراجعات',"go('updates')"],['مصادر التعلّم',"go('learning')"]];
 }else{
   actions=[['تقنيات وابتكارات',"openDiscoveryGroup('tech','all')"],['العمل والمشاريع',"openDiscoveryGroup('work','all')"],['التعلّم والبحث',"openDiscoveryGroup('learn','all')"]];
 }
 root.innerHTML=sectionContinueMarkup('استكشف مسارًا قريبًا','مسارات قريبة بدل نهاية تصفّح مغلقة.',actions.slice(0,3));
}
function updateLearningContinue(){
 const root=document.getElementById('learningContinue');if(!root)return;
 const field=document.getElementById('learningField')?.value||'all';
 let actions=[];
 if(field==='quran'){
   actions=[['قنوات القراء الرسمية',"setLearningPath('reciter','quran')"],['قنوات يوتيوب',"setLearningPath('channel','all')"],['كل مصادر التعلّم',"setLearningPath('all','all')"]];
 }else if(field!=='all'){
   actions=[['منصات هذا المجال',`setLearningPath('platform','${field}')`],['قنوات هذا المجال',`setLearningPath('channel','${field}')`],['قبل ما تدفع',"go('guides')"]];
 }else if(learningType==='platform'){
   actions=[['قنوات يوتيوب',"setLearningPath('channel','all')"],['كل مصادر التعلّم',"setLearningPath('all','all')"],['قبل ما تدفع',"go('guides')"]];
 }else if(learningType==='channel'){
   actions=[['قنوات القراء الرسمية',"setLearningPath('reciter','quran')"],['منصات الكورسات',"setLearningPath('platform','all')"],['كل مصادر التعلّم',"setLearningPath('all','all')"]];
 }else if(learningType==='reciter'){
   actions=[['قنوات يوتيوب',"setLearningPath('channel','all')"],['كل مصادر التعلّم',"setLearningPath('all','all')"],['مصادر إسلامية',"openDiscoveryGroup('learn','islamic')"]];
 }else{
   actions=[['منصات الكورسات',"setLearningPath('platform','all')"],['قنوات يوتيوب',"setLearningPath('channel','all')"],['قنوات القراء الرسمية',"setLearningPath('reciter','quran')"]];
 }
 root.innerHTML=sectionContinueMarkup('استكشف مسارًا قريبًا','لو لسه بتقارن، انتقل لمسار قريب من نفس نيتك.',actions);
}

const relatedGuideMap={
 khamsat:['/guides/khamsat-fiverr','خمسات أم Fiverr؟'],
 wuzzuf:['/guides/wuzzuf-linkedin','WUZZUF أم LinkedIn؟'],
 faseeh:['/guides/arabic-voice-ai','فصيح أم ElevenLabs؟'],
 munsit:['/guides/munsit-otter','منصت أم Otter؟'],
 anghami:['/guides/anghami-spotify','أنغامي أم Spotify؟'],
 hudhud:['/guides/hudhud-googlemaps','هدهد أم Google Maps؟'],
 almaany:['/guides/almaany-translate','المعاني أم Google Translate؟'],
 dorar:['/guides/islamic-sources','أين تتحقق من الحديث؟'],
 tafsircenter:['/guides/islamic-sources','كيف تتحقق من مصدر التفسير؟'],
 shamela:['/guides/islamic-sources','كيف ترجع إلى النص والمصدر؟'],
 fanar:['/guides/arabic-ai','متى تختار مساعدًا عربيًا؟'],
 karnak:['/guides/arabic-ai','كيف تختبر مساعدًا عربيًا؟'],
 arabicai:['/guides/arabic-ai','كيف تقارن أدوات الذكاء العربي؟'],
 midaad:['/guides/arabic-pdf','كيف تختبر OCR العربي قبل الاشتراك؟'],
 dhawwi:['/guides/arabic-design','أداة تصميم عربية أم Canva؟'],
 arabicdesign:['/guides/arabic-design','كيف تختبر أداة تصميم عربية؟'],
 taqreer:['/guides/arabic-design','ما الذي تختبره في التصميم العربي؟'],
 shamaa:['/guides/arabic-research','من أين تبدأ البحث الأكاديمي العربي؟'],
 mandumah:['/guides/arabic-research','قاعدة عربية أم بحث عالمي؟'],
 qdl:['/guides/arabic-research','كيف تستخدم المصادر العربية والأولية؟'],
 openalex:['/guides/arabic-research','وسّع البحث ثم ارجع للمصدر الأصلي'],
 zotero:['/guides/arabic-research','مسار بحث عربي أكثر تنظيمًا'],
 salla:['/guides/ecommerce-platform','سلة أم Shopify؟'],
 paymob:['/guides/payment-gateway','كيف تختار بوابة الدفع؟'],
 myfatoorah:['/guides/payment-gateway','ماذا تفحص قبل ربط بوابة الدفع؟'],
 thawani:['/guides/payment-gateway','بوابة الدفع: الرسوم والتسوية والربط'],
 benefit:['/guides/payment-gateway','كيف تقرأ بنية المدفوعات المحلية؟'],
 daftra:['/guides/business-software','دفترة أم QuickBooks؟'],
 abjjad:['/guides/reading','أبجد أم Kindle؟'],
 noon:['/guides/shopping','نون أم Amazon؟ قارن العرض نفسه']
};
const learningGuideMap={
 yanfaa:['/guides/learning-platform','كيف تختار منصة تعلم عربية؟'],
 'edraak-learning':['/guides/learning-platform','متى يكفي المجاني ومتى تدفع؟'],
 rwaq:['/guides/learning-platform','اختر النتيجة لا عدد الدورات'],
 almentor:['/guides/learning-platform','هل الاشتراك التعليمي يستحق؟'],
 'tadarab-learning':['/guides/learning-platform','كيف تقيّم المنصة قبل الاشتراك؟'],
 'gomycode-learning':['/guides/learning-platform','مسار تقني أم مكتبة دورات؟']
};
function editorialGuideLinkMarkup(id,detail=false){
 const g=relatedGuideMap[id];
 const href=g?g[0]:'/guides';
 if(detail){
  return `<a class="editorial-guide-link is-detail" href="${href}" onclick="event.stopPropagation()"><span>اقرأ</span><strong>${g?g[1]:'اقرأ حسب حاجتك'}</strong><b aria-hidden="true">←</b></a>`;
 }
 return `<a class="editorial-guide-link card-read-link" href="${href}" onclick="event.stopPropagation()"><strong>${g?'اقرأ قبل الاختيار':'مركز القراءة'}</strong><b aria-hidden="true">←</b></a>`;
}
function learningGuideLinkMarkup(id,detail=false){
 const g=learningGuideMap[id];
 const href=g?g[0]:'/guides';
 if(detail){
  return `<a class="editorial-guide-link is-detail" href="${href}" onclick="event.stopPropagation()"><span>اقرأ</span><strong>${g?g[1]:'اقرأ حسب حاجتك'}</strong><b aria-hidden="true">←</b></a>`;
 }
 return `<a class="editorial-guide-link card-read-link" href="${href}" onclick="event.stopPropagation()"><strong>${g?'اقرأ قبل الاختيار':'مركز القراءة'}</strong><b aria-hidden="true">←</b></a>`;
}

function renderCards(){
 closeCardShelf();
 updateDirectoryRefineUI();
 const q=norm(document.getElementById('searchInput').value);
 const list=items.filter(x=>
   (filter==='all'||x.cat===filter) &&
   (subfilter==='all'||x.sub===subfilter) &&
   (!originFilter||x.origin.includes(originFilter)) &&
   (!countryFilter&&true||countryInfoHasCode(itemCountryMap[x.id],countryFilter)) &&
   (!q||norm([x.name,x.value,x.creator,x.availability,x.arabRelation,x.type].join(' ')).includes(q))
 );
 let context=[];
 if(filter!=='all') context.push(categoryLabel(filter));
 if(subfilter!=='all') context.push(subcategoryLabel(filter,subfilter));
 if(originFilter) context.push(originContextLabel(originFilter));
 if(countryFilter) context.push(arabProgressCountryNames[countryFilter]||countryFilter);
 const shown=list.slice(0,directoryVisible);
 document.getElementById('stateLine').textContent=`${list.length} نتيجة${context.length?' · '+context.join(' · '):' · كل الدليل'} · ظاهر ${Math.min(shown.length,list.length)}`;
 const root=document.getElementById('catalogGrid');
 const more=document.getElementById('directoryMore');
 if(!list.length){
   root.innerHTML='<div class="empty">لا توجد نتائج موثقة مطابقة الآن. <button class="more-btn" onclick="showAllDirectory()">عرض الكل</button></div>';
   if(more)more.innerHTML='';
   updateDirectoryContinue();
   return;
 }
 root.innerHTML=shown.map(x=>`
  <article class="item">
   <button class="item-identity" onclick="openDetail('${x.id}')">
    ${logoMarkup(x.logo,'item-logo',x.name)}
    <span class="item-name">${x.name}</span>
   </button>
   ${countryBadgeMarkup(x)}
   <div class="comparison-strip ${x.origin[0]?'':'is-empty'}">${x.origin[0]?`<span>إذا كنت تستخدم</span><span class="origin-mini">${originName(x.origin[0])}</span>`:''}</div>
   <p class="card-purpose">${x.value}</p>
   <div class="core-preview">
    <div class="meta"><small>صلته بالعربية</small><strong>${x.arabRelation}</strong></div>
    <div class="meta"><small>نموذج السعر</small><strong>${x.price}</strong></div>
   </div>
   <div class="card-guide-slot">${editorialGuideLinkMarkup(x.id)}</div>
   <div class="item-spacer"></div>
   <button class="more-btn" aria-expanded="false" onclick="openCardShelf('${x.id}',this)">تفاصيل +</button>
   <button class="destination-link" onclick="openExternal('${x.id}')"><span class="destination-label"><bdi>${x.name}</bdi><small>${x.domain}</small></span><span class="outbound-key">↗</span></button>
  </article>`).join('');
 if(more){
   const remaining=list.length-shown.length;
   const moreLabel=originFilter ? 'بدائل أكثر لهذا الاختيار +' : subfilter!=='all' ? 'المزيد من '+subcategoryLabel(filter,subfilter)+' +' : filter!=='all' ? 'المزيد من '+categoryLabel(filter)+' +' : 'اكتشافات أكثر +';
   more.innerHTML=remaining>0 ? `<button class="load-more-btn" onclick="showMoreDirectory()">${moreLabel} <small>${remaining} متبقية</small></button>` : '';
 }
 updateDirectoryContinue();
}

function setLearningType(v,el){
 learningType=v;if(v==='channel'||v==='reciter')learningSectionOpen[v]=true;resetLearningLimit();document.querySelectorAll('[data-learning-type]').forEach(b=>b.classList.remove('active'));el.classList.add('active');updateLearningCrumb();updateLearningActionLabel();renderLearning()
}
function resetLearning(){
 learningType='all';learningSectionOpen.channel=false;learningSectionOpen.reciter=false;
 document.getElementById('learningSearch').value='';
 document.getElementById('learningField').value='all';
 document.querySelectorAll('[data-learning-type]').forEach(b=>b.classList.toggle('active',b.dataset.learningType==='all'));
 updateLearningCrumb();updateLearningActionLabel();resetLearningLimit();renderLearning();go('learning')
}
function showAllLearning(){
 // Show ALL learning sources, regardless of platform/channel or field.
 learningType='all';learningSectionOpen.channel=false;learningSectionOpen.reciter=false;
 document.getElementById('learningField').value='all';
 document.getElementById('learningSearch').value='';
 document.querySelectorAll('[data-learning-type]').forEach(
   b=>b.classList.toggle('active',b.dataset.learningType==='all')
 );
 updateLearningCrumb();
 updateLearningActionLabel();
 resetLearningLimit();
 renderLearning();
 go('learning');
}
function updateLearningActionLabel(){
 const btn=document.getElementById('learningContextBtn');
 if(!btn)return;
 const hasAnyFilter =
   learningType!=='all' ||
   (document.getElementById('learningField')?.value||'all')!=='all' ||
   (document.getElementById('learningSearch')?.value.trim()||'')!=='';

 btn.textContent='كل مصادر التعلّم';
 btn.title=hasAnyFilter
   ? 'إلغاء الفلاتر الداخلية وإظهار كل مصادر التعلّم'
   : 'إظهار كل مصادر التعلّم';
}
function updateLearningCrumb(){
 const typeLabel=learningType==='platform'?'منصات الكورسات':learningType==='resource'?'مصادر عملية من المنصات':learningType==='channel'?'قنوات يوتيوب':learningType==='reciter'?'قنوات القراء الرسمية':'';
 const field=document.getElementById('learningField')?.value||'all';
 const fieldLabel=field==='all'?'':document.getElementById('learningField').options[document.getElementById('learningField').selectedIndex].text;
 const bits=[typeLabel,fieldLabel].filter(Boolean);
 const wrap=document.getElementById('learningCrumbWrap'),el=document.getElementById('learningCrumb');
 if(!bits.length){wrap.style.display='none'}else{el.textContent=bits.join(' / ');wrap.style.display='inline'}
}
function toggleLearningSection(type){
 if(type!=='channel'&&type!=='reciter')return;
 learningSectionOpen[type]=!learningSectionOpen[type];
 learningCarouselIndex[type]=0;
 renderLearning();
}
function enableLearningCarousel(type,btn){
 const group=document.getElementById('learning-group-'+type);
 if(!group)return;
 group.classList.add('is-browsing');
 if(btn&&btn.parentElement)btn.parentElement.hidden=true;
 scrollLearningCarousel(type,1);
}
function scrollLearningCarousel(type,dir){
 const group=document.getElementById('learning-group-'+type);if(!group)return;
 const track=group.querySelector('.learning-carousel-track');if(!track)return;
 const cards=[...track.querySelectorAll('.learning-card')];if(!cards.length)return;
 const perView=window.matchMedia('(max-width:760px)').matches?1:4;
 const maxStart=Math.max(0,cards.length-perView);
 let current=Number.isFinite(learningCarouselIndex[type])?learningCarouselIndex[type]:0;
 current=Math.max(0,Math.min(maxStart,current+(dir>0?perView:-perView)));
 learningCarouselIndex[type]=current;
 cards[current].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
}
function renderLearning(){
 updateLearningCrumb();updateLearningActionLabel();
 const q=norm(document.getElementById('learningSearch').value),field=document.getElementById('learningField').value;
 const list=learning.filter(x=>(learningType==='all'||x.type===learningType)&&(field==='all'||x.fields.includes(field))&&(!q||norm([x.name,x.teacher,x.focus].join(' ')).includes(q)));
 const groups=[['platform','منصات الكورسات'],['resource','مصادر عملية من المنصات'],['channel','قنوات يوتيوب مفيدة'],['reciter','قنوات رسمية لقراء القرآن']];
 document.getElementById('learningGroups').innerHTML=groups.map(([type,label])=>{
  const g=list.filter(x=>x.type===type);if(!g.length)return '';
  const foldable=type==='channel'||type==='reciter';
  if(foldable&&!learningSectionOpen[type]){
   return `<section class="learning-group learning-folded" id="learning-group-${type}">
    <div class="learning-folded-head"><div><h3 class="learning-group-title">${label}</h3><small>${g.length} مصدرًا متاحًا</small></div><button class="section-fold-toggle compact" type="button" aria-expanded="false" onclick="toggleLearningSection('${type}')"><span aria-hidden="true">+</span><span class="sr-only">فتح ${label}</span></button></div>
   </section>`;
  }
  const moreLabel=type==='platform'?'منصات كورسات أكثر +':type==='resource'?'مصادر عملية أكثر +':type==='channel'?'قنوات يوتيوب أكثر +':'قراء رسميون أكثر +';
  const titleMarkup=foldable
   ? `<div class="learning-group-title-row"><h3 class="learning-group-title">${label}</h3><button class="section-fold-toggle compact" type="button" aria-expanded="true" onclick="toggleLearningSection('${type}')"><span aria-hidden="true">−</span><span class="sr-only">طي ${label}</span></button></div>`
   : `<h3 class="learning-group-title">${label}</h3>`;
  return `<section class="learning-group learning-carousel-group" id="learning-group-${type}">${titleMarkup}
   <div class="learning-carousel-shell">
    <button class="learning-carousel-arrow learning-carousel-prev" type="button" aria-label="السابق" onclick="scrollLearningCarousel('${type}',-1)">›</button>
    <div class="learning-carousel-viewport"><div class="learning-grid learning-carousel-track">${g.map(x=>`
     <article class="learning-card">
      ${logoMarkup(x.logo,'learning-logo',x.name)}
      <h3>${x.name}</h3>
      ${countryBadgeMarkup(x,learningCountryMap)}
      ${x.vendorContent?'<div class="learning-vendor-note">محتوى من الجهة نفسها</div>':''}
      <p class="learning-focus">${x.focus}</p>
      <div class="learning-card-guide-slot">${learningGuideLinkMarkup(x.id)}</div>
      <div class="learning-spacer"></div>
      <div class="learning-actions"><button type="button" onclick="showLearningNote('${x.id}');return false;">التفاصيل والمصادر</button></div>
     </article>`).join('')}</div></div>
    <button class="learning-carousel-arrow learning-carousel-next" type="button" aria-label="التالي" onclick="scrollLearningCarousel('${type}',1)">‹</button>
   </div>
   ${g.length>4?`<div class="load-more-wrap learning-carousel-more-wrap"><button class="load-more-btn" onclick="enableLearningCarousel('${type}',this)">${moreLabel} <small>${g.length-4} أخرى</small></button></div>`:''}
  </section>`;
 }).join('') || '<div class="empty">لا توجد مصادر مطابقة. <button class="more-btn" onclick="resetLearning()">كل المصادر</button></div>';
 updateLearningContinue();
}

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
 if(x.cat==='work') return 'راجع بلد الخدمة، الرسوم، الباقة، والتكاملات التي تحتاجها قبل الدفع أو نقل شغلك إليها.';
 if(x.cat==='shopping') return 'قارن بلد الإتاحة، البائع، رسوم الشحن، سياسة الإرجاع، وضمان المنتج قبل الشراء.';
 if(x.cat==='create') return 'جرّب عينة فعلية أولًا، وتحقق من شروط التصدير والترخيص وحدود الخطة المجانية إن وجدت.';
 if(x.cat==='culture') return 'راجع بلد الإتاحة، نوع الوصول، وهل المحتوى كامل أم جزء منه قبل الاشتراك أو التحميل.';
 return 'راجع المصدر الرسمي الحالي قبل الاعتماد، ولو القيد يمنعك ابحث عن بديل داخل نفس التصنيف.';
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
   action:'لو أنت في مصر، ابدأ من حساب بنك المعرفة المصري. ولو لم تتوفر الصلاحية، استخدم المستخلص للاكتشاف ثم ابحث عن المصدر الأصلي أو نسخة مفتوحة موثوقة.',
   source:'<a href="https://www.mandumah.com/ekb/" target="_blank" rel="noopener noreferrer">اتفاق دار المنظومة مع بنك المعرفة</a> · <a href="https://www.ekb.eg/" target="_blank" rel="noopener noreferrer">بنك المعرفة المصري</a>'
 };
 const alert=(x.limit||'').trim();
 if(!alert)return null;
 return {type:decisionTypeFrom(alert),alert,action:genericDecisionAction(x),source:''};
}
function shortDecisionText(text='',max=112){
 const t=String(text).replace(/<[^>]+>/g,'').trim();
 return t.length>max?t.slice(0,max-1).trim()+'…':t;
}
const cardCautionOverrides={
 karnak:'إطلاق تجريبي؛ الدقة لم تُختبر مستقلًا.',
 dhawwi:'أرقام الاستخدام معلنة من الجهة نفسها.',
 midaad:'المجاني يضيف ختمًا خفيفًا للتصدير.',
 taqreer:'المجاني: 5 شرائح وتصدير PNG بعلامة مائية.',
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
function cardCautionText(x,n){
 if(cardCautionOverrides[x.id])return cardCautionOverrides[x.id];
 const first=String(n?.alert||x?.limit||'').split(/[.!؟]/)[0].trim();
 return shortDecisionText(first||n?.alert||'',74);
}
function decisionCardMarkup(x){
 const n=decisionNoteFor(x);
 const note=n?cardCautionText(x,n):'';
 return `<div class="decision-slot ${note?'has-note':'is-empty'}">${note?`<div class="card-decision-note"><b>${note}</b></div>`:''}</div>`;
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
function learningDecisionNoteFor(x){
 if(!x)return null;
 if(x.type==='reciter')return {
   alert:'قد تضم القناة تلاوات مختارة ولا تمثل مصحفًا كاملًا؛ راجع وصف التسجيل والجهة الناشرة.',
   action:'اختر السورة أو قائمة التلاوة التي تريدها، وراجع الرواية ونوع التسجيل إن كانا مذكورين.'
 };
 if(x.type==='platform')return {
   alert:'بعض المسارات أو الشهادات قد تكون مدفوعة حتى لو كانت المنصة نفسها مجانية.',
   action:'راجع صفحة المسار نفسه: التكلفة، شروط التسجيل، وهل الشهادة مشمولة قبل ما تبدأ.'
 };
 return {
   alert:'المحتوى الجيد لا يعني بالضرورة أن القناة مرتبة كمسار من البداية للنهاية.',
   action:'ابدأ بقائمة تشغيل مناسبة لمستواك وحدد هدفًا تطبيقيًا واضحًا بدل التنقل بين فيديوهات متفرقة.'
 };
}
function learningDecisionCardMarkup(x){
 const n=learningDecisionNoteFor(x);
 return `<div class="decision-slot ${n?'has-note':'is-empty'}">${n?`<div class="card-decision-note"><b>${shortDecisionText(n.alert,96)}</b></div>`:''}</div>`;
}
function learningDecisionPanelMarkup(x){
 const n=learningDecisionNoteFor(x);if(!n)return '';
 return `<section class="decision-panel">
  <p class="decision-alert-text">${n.alert}</p>
  <div class="decision-action"><b>ما الذي يمكنك فعله؟</b><span>${n.action}</span></div>
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
function openDiscoveryGroup(cat,sub='all'){
 closeModal();
 countryFilter=null;
 filter=cat;
 subfilter=(sub&&sub!=='all')?sub:'all';
 originFilter=null;
 document.getElementById('searchInput').value='';
 resetDirectoryLimit();
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===cat));
 buildSubfilters();
 document.querySelectorAll('[data-subfilter]').forEach(b=>b.classList.toggle('active',b.dataset.subfilter===subfilter));
 updateDirectoryCrumb();
 updateDirectoryActionLabel();
 closeDirectoryRefiners();
 renderCards();
 goDirectoryResults();
}
function directoryDiscoveryMarkup(x){
 const related=relatedDirectoryItems(x);
 const collectionLabel=x.sub&&x.sub!=='all'?subcategoryLabel(x.cat,x.sub):categoryLabel(x.cat);
 if(!related.length)return '';
 return `<section class="detail-discovery">
  <div class="detail-discovery-head"><h4>خيارات قريبة</h4><p>مسارات قريبة داخل بديلك عربي إذا أردت المقارنة قبل المغادرة.</p></div>
  <div class="detail-related-grid">${related.map(a=>`<button type="button" class="detail-related" onclick="openDetail('${a.id}')"><strong>${a.name}</strong><small>${a.value}</small></button>`).join('')}</div>
  <button type="button" class="detail-collection" onclick="openDiscoveryGroup('${x.cat}','${x.sub||'all'}')">عرض كل ${collectionLabel}</button>
 </section>`;
}
function relatedLearningItems(x){
 return learning
  .filter(a=>a.id!==x.id)
  .map(a=>{
   let score=a.type===x.type?3:0;
   score+=(a.fields||[]).filter(f=>(x.fields||[]).includes(f)).length*4;
   return {item:a,score};
  })
  .filter(r=>r.score>0)
  .sort((a,b)=>b.score-a.score||a.item.name.localeCompare(b.item.name,'ar'))
  .slice(0,2)
  .map(r=>r.item);
}
function learningDiscoveryMarkup(x){
 const related=relatedLearningItems(x);
 if(!related.length)return '';
 return `<section class="detail-discovery">
  <div class="detail-discovery-head"><h4>خيارات قريبة</h4><p>${x.type==='reciter'?'قنوات تلاوة أخرى للاكتشاف.':'مصادر تعلم قريبة من نفس الاهتمام.'}</p></div>
  <div class="detail-related-grid">${related.map(a=>`<button type="button" class="detail-related" onclick="showLearningNote('${a.id}')"><strong>${a.name}</strong><small>${a.focus}</small></button>`).join('')}</div>
  <button type="button" class="detail-collection" onclick="closeModal();showAllLearning()">عرض كل مصادر التعلّم</button>
 </section>`;
}

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
function geoContextMarkup(id){
 const note=geoContextNotes[id];
 return note?'<section class="detail-section geo-context"><h4>المنشأ والتسجيل</h4><div>'+note+'</div></section>':'';
}
function openDetail(id){
 const x=items.find(a=>a.id===id);if(!x)return;
 const special=specialDetails(x);
 const facts=special?.facts||genericFacts(x);
 const sections=special?.sections||[];
 document.getElementById('modalBody').innerHTML=`
  <div class="detail-overview">
   <div class="detail-identity">${logoMarkup(x.logo,'detail-logo',x.name)}<h3 class="quick-title">${x.name}</h3>${countryBadgeMarkup(x)}</div>
   <p class="quick-purpose">${x.value}</p>
   <div class="detail-facts">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}    ${decisionPanelMarkup(x)}
   ${editorialGuideLinkMarkup(x.id,true)}
   ${renderSections(x,sections)}
   <div class="detail-source-line"><span>${x.verified||''}</span><span>${x.reviewed?'آخر مراجعة: '+x.reviewed:''}</span></div>
   ${commercialDisclosureMarkup(x.id)}
   <button class="destination-link" onclick="openExternal('${x.id}')"><span class="destination-label"><bdi>افتح ${x.name}</bdi><small>${x.domain}</small></span><span class="outbound-key">↗</span></button>
   ${directoryDiscoveryMarkup(x)}
  </div>`;
 document.getElementById('detailModal').classList.add('show');document.body.classList.add('lock')
}
const fieldNames={
 languages:'إنجليزي ولغات',
 tech:'برمجة وتقنية',
 design:'تصميم ومونتاج',
 business:'إدارة وتسويق',
 skills:'مهارات متنوعة',
 knowledge:'معرفة وعلوم',
 quran:'قرآن وتلاوة'
};
function showLearningNote(id){
 const x=learning.find(a=>a.id===id);if(!x)return;
 const fields=x.fields.map(f=>fieldNames[f]||f).join(' · ');
 const isChannel=x.type==='channel'||x.type==='reciter';
 const isReciter=x.type==='reciter';
 const facts=isReciter
  ? [['القارئ',x.teacher],['المجال',fields],['التوثيق',x.reference],['المشاهدة','عبر القناة الرسمية على YouTube']]
  : isChannel
  ? [['المقدم/الجهة',x.teacher],['المجال',fields],['نوع المحتوى',x.focus],['التوثيق',x.reference]]
  : x.type==='resource'
  ? [['الجهة',x.teacher],['المجالات',fields],['نوع المصدر','محتوى تعليمي من الجهة نفسها'],['الملاحظة التحريرية',x.reference]]
  : [['الجهة',x.teacher],['المجالات',fields],['نوع المنصة',x.reference],['ماذا تقدم',x.focus]];
 document.getElementById('modalBody').innerHTML=`
  <div class="detail-overview">
   <div class="detail-identity">${logoMarkup(x.logo,'detail-logo',x.name)}<h3 class="quick-title">${x.name}</h3>${countryBadgeMarkup(x,learningCountryMap)}</div>
   <p class="quick-purpose">${x.focus}</p>
   <div class="detail-facts">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}    ${learningDecisionPanelMarkup(x)}
   ${learningGuideLinkMarkup(x.id,true)}
   ${learningCommercialDisclosureMarkup(x)}
   <button class="destination-link" onclick="openLearningExternal('${x.id}')"><span class="destination-label"><bdi>${isReciter?'افتح القناة الرسمية':isChannel?'افتح القناة والدروس':x.type==='resource'?'افتح المصدر التعليمي':'اذهب إلى المنصة'}</bdi><small>${x.url.replace('https://','')}</small></span><span class="outbound-key">↗</span></button>
   ${learningDiscoveryMarkup(x)}
  </div>`;
 document.getElementById('detailModal').classList.add('show');document.body.classList.add('lock')
}
// Central commercial-link model lives in /js/commercial-links.js.
// Activate a program only by updating that one asset.
const commercialLinks=window.BADILAK_COMMERCIAL_LINKS||{};
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
function resolveLearningCommercialLink(x){
 if(!x)return {url:'',affiliate:false,status:'none'};
 if(x.commercialId&&x.commercialContentKey&&window.badilakCommercialResolveContent){
  return window.badilakCommercialResolveContent(x.commercialId,x.commercialContentKey,x.url||'');
 }
 return {url:x.url||'',affiliate:false,status:'none'};
}
function learningCommercialDisclosureMarkup(x){
 const r=resolveLearningCommercialLink(x);
 if(!r.affiliate)return '';
 return window.badilakCommercialDisclosureHTML
  ? window.badilakCommercialDisclosureHTML()
  : '<div class="commercial-disclosure"><strong>إفصاح تجاري</strong><span>قد نحصل على عمولة إذا أدى هذا الرابط إلى عملية مؤهلة لاحقًا، دون تكلفة إضافية عليك أو تأثير على ترتيب المصدر.</span></div>';
}
function openLearningExternal(id){
 const x=learning.find(a=>a.id===id);if(!x||!x.url)return;
 const r=resolveLearningCommercialLink(x);
 const a=document.createElement('a');
 a.href=r.url||x.url;
 a.target='_blank';
 a.rel=r.affiliate?'sponsored noopener noreferrer':'noopener noreferrer';
 a.dataset.linkKind=r.affiliate?'affiliate-content':'official-content';
 a.dataset.learningId=id;
 if(x.commercialId)a.dataset.commercialId=x.commercialId;
 document.body.appendChild(a);a.click();a.remove();
 document.dispatchEvent(new CustomEvent('badilak:outbound',{detail:{id,kind:r.affiliate?'affiliate-content':'official-content'}}));
}

function openExternal(id){
 const x=items.find(a=>a.id===id);if(!x||!x.url||x.url==='#'){alert('لا يتوفر لهذا العنصر رابط رسمي موثق حاليًا.');return}
 const r=resolveCommercialLink(id,x.url);
 const a=document.createElement('a');
 a.href=r.url;
 a.target='_blank';
 a.rel=r.affiliate?'sponsored noopener noreferrer':'noopener noreferrer';
 a.dataset.linkKind=r.affiliate?'affiliate':'official';
 a.dataset.itemId=id;
 document.body.appendChild(a);
 a.click();
 a.remove();
 document.dispatchEvent(new CustomEvent('badilak:outbound',{detail:{id,kind:r.affiliate?'affiliate':'official'}}));
}
let methodologyReturnFocus=null;
function openMethodology(){
 methodologyReturnFocus=document.activeElement;
 document.getElementById('modalBody').innerHTML=`
  <div class="detail-overview">
   <h3 class="quick-title" id="methodology">منهج الاختيار</h3>
   <p class="quick-purpose">نبحث عن خيارات عربية تستحق وقتك، ونربط كل خيار بالحاجة التي يخدمها وما يلزم معرفته قبل استخدامه.</p>
   <section class="detail-section"><h4>ابدأ بحاجتك</h4><div>الأداة والدورة والكتاب وقناة التلاوة لا تُقاس بالمعيار نفسه. تبدأ المقارنة بالمهمة، ثم الفائدة والتكلفة وحدود الإتاحة.</div></section>
   <section class="detail-section"><h4>افهم نوع الاختيار</h4><div>بعض الخيارات بدائل تؤدي مهمة مشابهة، وبعضها مصادر أو محتوى عربي داخل منصة تستخدمها بالفعل؛ قناة عربية على YouTube ليست بديلًا تقنيًا عن YouTube.</div></section>    <section class="detail-section"><h4>ماذا يعني علم الدولة؟</h4><div>العلم لا يعني تلقائيًا أن هوية المنتج أو محتواه من تلك الدولة. نكتب بجواره نوع الصلة كلما لزم: تأسيس، تسجيل قانوني، مقر، مطوّر رسمي، أو سوق موجّه. ولا نستنتج البلد من الدومين أو لغة الموقع وحدهما.</div></section>
   <section class="detail-section"><h4>المصدر يوضح حدود المعلومة</h4><div>بيان الشركة يوضح ما تعلنه عن منتجها، ولا يثبت وحده جودة الأداء. وجود رابط رسمي لا يعني أننا اختبرنا كل ميزة؛ راجع مصدر المعلومة وتاريخ مراجعتها حيث يظهران.</div></section>
   <section class="detail-section"><h4>قبل التسجيل أو الدفع</h4><div>افحص خطة بلدك، وحدود المجاني، والتجديد والإلغاء، وحقوق الاستخدام. قد تتغير الأسعار والشروط بعد تاريخ المراجعة، والقرار النهائي يعود لصفحة الخدمة الحالية.</div></section>
   <section class="detail-section"><h4>قرار تحريري معلن</h4><div>معيار الترشيح هو فائدته للقارئ وحدوده المعلنة. أي تعاون تجاري يحتاج إفصاحًا واضحًا بجواره، ولا يكفي وحده سببًا للترشيح أو الأفضلية.</div></section>
  </div>`;
 document.getElementById('detailModal').classList.add('show');
 document.body.classList.add('lock');
 document.querySelector('#detailModal .modal-card').scrollTop=0;
 document.querySelector('#detailModal .close').focus();
}
let activeCardShelfId=null;
let activeCardShelfBtn=null;

function closeCardShelf(){
 const shelf=document.getElementById('cardDetailShelf');
 if(shelf)shelf.remove();
 if(activeCardShelfBtn){
  activeCardShelfBtn.setAttribute('aria-expanded','false');
  activeCardShelfBtn.textContent='تفاصيل +';
 }
 activeCardShelfId=null;
 activeCardShelfBtn=null;
}

function openCardShelf(id,btn){
 const grid=document.getElementById('catalogGrid');
 const card=btn?.closest('.item');
 const x=items.find(a=>a.id===id);
 if(!grid||!card||!x)return;

 if(activeCardShelfId===id){
  closeCardShelf();
  return;
 }
 closeCardShelf();

 const cards=[...grid.querySelectorAll(':scope > .item')];
 const index=cards.indexOf(card);
 const cols=Math.max(1,getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length);
 const rowEndIndex=Math.min(cards.length-1,Math.ceil((index+1)/cols)*cols-1);
 const anchor=cards[rowEndIndex]||card;
 const note=decisionNoteFor(x);

 const shelf=document.createElement('section');
 shelf.id='cardDetailShelf';
 shelf.className='card-detail-shelf';
 shelf.setAttribute('aria-label','تفاصيل سريعة عن '+x.name);
 shelf.innerHTML=`
  <div class="card-shelf-pointer" aria-hidden="true"></div>
  <div class="card-shelf-head">
   <div><small>تفاصيل سريعة</small><strong>${x.name}</strong></div>
   <button type="button" aria-label="إغلاق التفاصيل" onclick="closeCardShelf()">×</button>
  </div>
  ${note?`<div class="card-shelf-caution"><small>قبل الاختيار</small><strong>${cardCautionText(x,note)}</strong></div>`:''}
  <div class="card-shelf-facts">
   <div><small>الجهة / المنشأ</small><strong>${x.creator||'—'}</strong></div>
   <div><small>الإتاحة</small><strong>${x.availability||'—'}</strong></div>
   <div><small>آخر مراجعة</small><strong>${x.reviewed||'—'}</strong></div>
  </div>
  <div class="card-shelf-actions">
   <button type="button" onclick="closeCardShelf();openDetail('${x.id}')">التفاصيل والمصادر</button>
  </div>`;

 anchor.insertAdjacentElement('afterend',shelf);
 activeCardShelfId=id;
 activeCardShelfBtn=btn;
 btn.setAttribute('aria-expanded','true');
 btn.textContent='أقل −';

 requestAnimationFrame(()=>{
  const sr=shelf.getBoundingClientRect();
  const cr=card.getBoundingClientRect();
  const center=Math.max(24,Math.min(sr.width-24,(cr.left+cr.width/2)-sr.left));
  shelf.style.setProperty('--shelf-pointer',center+'px');
  shelf.scrollIntoView({behavior:'smooth',block:'nearest'});
 });
}

function openCardPeek(id,btn){
 const x=items.find(a=>a.id===id);if(!x)return;
 const layer=document.getElementById('quickPeekLayer');
 const panel=document.getElementById('quickPeekPanel');
 const body=document.getElementById('quickPeekBody');
 const note=decisionNoteFor(x);
 body.innerHTML=`
  <div class="quick-peek-kicker">نظرة سريعة</div>
  <div class="quick-peek-head">${logoMarkup(x.logo,'quick-peek-logo',x.name)}<div><h3>${x.name}</h3>${countryBadgeMarkup(x)}</div></div>
  ${note?`<div class="quick-peek-caution"><small>قبل الاختيار</small><strong>${cardCautionText(x,note)}</strong></div>`:''}
  <div class="quick-peek-facts">
   <div><small>الجهة / المنشأ</small><strong>${x.creator||'—'}</strong></div>
   <div><small>الإتاحة</small><strong>${x.availability||'—'}</strong></div>
   <div><small>آخر مراجعة</small><strong>${x.reviewed||'—'}</strong></div>
  </div>
  <div class="quick-peek-actions">
   <button type="button" class="peek-primary" onclick="closeCardPeek();openDetail('${x.id}')">التفاصيل والمصادر</button>
   <button type="button" class="peek-secondary" onclick="openExternal('${x.id}')">افتح ${x.name} ↗</button>
  </div>`;
 layer.hidden=false;
 layer.classList.add('show');
 requestAnimationFrame(()=>{
  panel.style.removeProperty('top');panel.style.removeProperty('left');panel.style.removeProperty('right');panel.style.removeProperty('bottom');panel.style.removeProperty('width');
  if(window.matchMedia('(max-width:760px)').matches)return;
  const card=btn.closest('.item');if(!card)return;
  const r=card.getBoundingClientRect();
  const w=Math.min(430,window.innerWidth-32);
  panel.style.width=w+'px';
  panel.style.visibility='hidden';
  requestAnimationFrame(()=>{
   const h=panel.offsetHeight;
   let top=Math.max(16,Math.min(r.top+24,window.innerHeight-h-16));
   let left=r.right+12;
   if(left+w>window.innerWidth-16)left=r.left-w-12;
   if(left<16)left=Math.max(16,Math.min(r.left,window.innerWidth-w-16));
   panel.style.top=top+'px';panel.style.left=left+'px';panel.style.visibility='visible';
  });
 });
}
function closeCardPeek(){
 const layer=document.getElementById('quickPeekLayer');if(!layer)return;
 layer.classList.remove('show');layer.hidden=true;
}
function toggleCardMore(id,btn){
 const panel=document.getElementById('card-more-'+id);if(!panel)return;
 const open=panel.hasAttribute('hidden');
 if(open)panel.removeAttribute('hidden');else panel.setAttribute('hidden','');
 btn.setAttribute('aria-expanded',open?'true':'false');
 btn.textContent=open?'أقل −':'تفاصيل +';
}
function toggleLearningMore(id,btn){
 const panel=document.getElementById('learning-more-'+id);if(!panel)return;
 const open=panel.hasAttribute('hidden');
 if(open)panel.removeAttribute('hidden');else panel.setAttribute('hidden','');
 btn.setAttribute('aria-expanded',open?'true':'false');
 btn.textContent=open?'أقل −':'تفاصيل +';
}
function toggleStaticDisclosure(bodyId,btn,kind){
 const body=document.getElementById(bodyId);if(!body)return;
 const opening=body.hasAttribute('hidden');
 if(opening)body.removeAttribute('hidden');else body.setAttribute('hidden','');
 const section=btn.closest('.fold-card');if(section)section.classList.toggle('is-open',opening);
 btn.setAttribute('aria-expanded',opening?'true':'false');
 const mark=btn.querySelector('[aria-hidden="true"]');if(mark)mark.textContent=opening?'−':'+';
 if(opening&&kind==='competition'&&!body.dataset.loaded){
  body.dataset.loaded='1';
  setCompetitionStory('shopping',document.querySelector('.competition-tab[data-story="shopping"]'));
 }
}

function closeModal(){
 document.getElementById('detailModal').classList.remove('show');
 document.body.classList.remove('lock');
 if(methodologyReturnFocus){methodologyReturnFocus.focus({preventScroll:true});methodologyReturnFocus=null}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCardPeek();closeModal();const d=document.getElementById('feedbackDialog');if(d&&d.open)d.close()}})

function openFeedback(kind){
 const d=document.getElementById('feedbackDialog');
 const k=document.getElementById('feedbackKind');
 const t=document.getElementById('feedbackTitle');
 const s=document.getElementById('feedbackStatus');
 if(!d||!k||!t)return;
 k.value=kind||'ترشيح';
 t.textContent=k.value==='تصحيح'?'صحّح معلومة':'رشّح اكتشافًا';
 if(s)s.textContent='';
 d.showModal();
 setTimeout(()=>d.querySelector('input[name="subject"]')?.focus(),30);
}
async function submitDirectoryFeedback(e){
 e.preventDefault();
 const form=e.currentTarget, status=document.getElementById('feedbackStatus'), submit=document.getElementById('feedbackSubmit');
 const fields=Object.fromEntries(new FormData(form).entries());
 submit.disabled=true;status.textContent='جارٍ الإرسال…';
 try{
  const res=await fetch('https://api.websitepublisher.ai/sapi/project/28472/form/submit',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({form_name:'directory_feedback',fields})
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok||data.success===false)throw new Error(data.message||'تعذر الإرسال');
  status.textContent='وصلت للمراجعة. شكرًا لمساعدتك في تحسين الدليل.';
  form.reset();document.getElementById('feedbackKind').value=fields.kind||'ترشيح';
  setTimeout(()=>document.getElementById('feedbackDialog')?.close(),1300);
 }catch(err){
  status.textContent='تعذر الإرسال الآن. حاول مرة أخرى بعد قليل.';
 }finally{submit.disabled=false}
}
buildSubfilters();renderCards();renderLearning();updateDirectoryCrumb();updateLearningCrumb();updateDirectoryActionLabel();updateLearningActionLabel();
const backToTop=document.getElementById('backToTop');if(backToTop){const syncBackTop=()=>backToTop.classList.toggle('show',window.scrollY>700);window.addEventListener('scroll',syncBackTop,{passive:true});syncBackTop();}

;

/* badilak-signal-chart-v101 */
const competitionStories={
 shopping:{
  field:'تسوّق',mode:'numeric',metricLabel:'تنزيلات Google Play',
  regional:{
   name:'نون',domain:'noon.com',tag:'سوق إقليمي',desc:'متجر إلكتروني متعدد الفئات',
   reasons:['واجهة عربية','توصيل محلي','خيارات دفع للمنطقة'],
   signal:{value:50000000,display:'50M+'},
   rating:{score:4.6,reviews:'1.16M مراجعة'}
  },
  global:{
   name:'Amazon',domain:'amazon.com',tag:'مرجع عالمي',desc:'سوق إلكتروني عالمي',
   reasons:['تشكيلة ضخمة','متاجر حسب البلد','خيارات شراء واسعة'],
   signal:{value:1000000000,display:'1B+'},
   rating:{score:4.4,reviews:'4.69M مراجعة'}
  },
  difference:'نون أقرب لأسواق المنطقة؛ Amazon أوسع نطاقًا.',
  sources:[['Google Play · نون','https://play.google.com/store/apps/details?id=com.noon.buyerapp'],['Google Play · Amazon','https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping']]
 },
 academic:{
  field:'بحث أكاديمي',mode:'qualitative',metricLabel:'ما يميزه للباحث',
  regional:{
   name:'دار المنظومة',domain:'mandumah.com',tag:'قاعدة عربية متخصصة',desc:'قاعدة بيانات أكاديمية عربية',
   reasons:['رسائل عربية','دوريات عربية','تخصصات عربية'],
   signal:{display:'200K+ عنوان رسالة · 800+ جامعة'}
  },
  global:{
   name:'Google Scholar',domain:'scholar.google.com',tag:'اكتشاف أكاديمي واسع',desc:'محرك بحث أكاديمي',
   reasons:['بحث عالمي','تتبع الاستشهادات','مصادر أكاديمية متعددة'],
   signal:{display:'مقالات · رسائل · كتب · استشهادات'}
  },
  difference:'دار المنظومة للعمق العربي؛ Scholar للاكتشاف والاستشهادات.',
  sources:[['دار المنظومة','https://www.mandumah.com/databases/'],['Google Scholar','https://scholar.google.com/intl/en/scholar/about.html']]
 },
 ai:{
  field:'ذكاء اصطناعي',mode:'numeric',metricLabel:'تنزيلات Google Play',
  regional:{
   name:'فَنار',domain:'fanar.qa',tag:'ذكاء اصطناعي عربي أولًا',desc:'مساعد ذكاء اصطناعي عربي',
   reasons:['العربية واللهجات','صوت وصورة','مهام متعددة'],
   signal:{value:5000,display:'5K+'},
   rating:null
  },
  global:{
   name:'ChatGPT',domain:'chatgpt.com',tag:'مساعد عالمي',desc:'مساعد ذكاء اصطناعي عام',
   reasons:['كتابة وبحث','ملفات وصور','أدوات عامة كثيرة'],
   signal:{value:1000000000,display:'1B+'},
   rating:null
  },
  difference:'فَنار يركز على التجربة العربية؛ ChatGPT أوسع انتشارًا واستخدامًا عامًا.',
  sources:[['Google Play · فَنار','https://play.google.com/store/apps/details?id=com.fanarmobile'],['Google Play · ChatGPT','https://play.google.com/store/apps/details?id=com.openai.chatgpt']]
 },
 design:{
  field:'تصميم ومحتوى',mode:'numeric',metricLabel:'القوالب المتاحة',
  regional:{
   name:'ضوّي',domain:'dhawwi.com',tag:'محرر تصميم عربي',desc:'منصة تصميم عربية',
   reasons:['قوالب عربية','خطوط عربية','مناسبات محلية'],
   signal:{value:400,display:'400+ قالب عربي'},
   rating:null
  },
  global:{
   name:'Canva',domain:'canva.com',tag:'منصة تصميم عالمية',desc:'منصة تصميم مرئي',
   reasons:['قوالب ضخمة','فيديو وعروض','فرق وتعاون'],
   signal:{value:3600000,display:'3.6M+ قالب'},
   rating:null
  },
  difference:'ضوّي أقرب للمحتوى العربي؛ Canva أوسع في الأدوات والتعاون.',
  sources:[['ضوّي','https://www.dhawwi.com/'],['Canva · القوالب','https://www.canva.com/pricing/'],['Canva · المستخدمون','https://www.canva.com/newsroom/news/canva-2025-wrap/']]
 },
 documents:{
  field:'مستندات',mode:'qualitative',metricLabel:'ما يميزه في PDF',
  regional:{
   name:'مِداد',domain:'midaadapp.com',tag:'أداة عربية متخصصة',desc:'أداة PDF عربية',
   reasons:['OCR عربي','تحويل PDF','تحرير عربي'],
   signal:{display:'OCR عربي · تحرير PDF عربي'},
   rating:null
  },
  global:{
   name:'Acrobat',domain:'adobe.com',tag:'منظومة PDF واسعة',desc:'منصة PDF متكاملة',
   reasons:['تحرير وتوقيع','تحويل وOCR','أدوات PDF واسعة'],
   signal:{display:'تحرير · توقيع · تحويل · OCR · AI'},
   rating:null
  },
  difference:'مِداد يتخصص في العربية؛ Acrobat أوسع في دورة عمل PDF.',
  sources:[['مِداد','https://midaadapp.com/'],['Adobe Acrobat','https://play.google.com/store/apps/details?id=com.adobe.reader']]
 },
 reading:{
  field:'قراءة',mode:'numeric',metricLabel:'تنزيلات Google Play',
  regional:{
   name:'أبجد',domain:'abjjad.com',tag:'قراءة واستماع عربي',desc:'مكتبة قراءة واستماع عربية',
   reasons:['كتب عربية','صوتي وإلكتروني','اشتراك واحد'],
   signal:{value:1000000,display:'1M+'},
   rating:{score:4.5,reviews:'27.4K مراجعة'}
  },
  global:{
   name:'Kindle',domain:'amazon.com',tag:'منصة قراءة عالمية',desc:'منصة كتب إلكترونية',
   reasons:['مكتبة عالمية','أجهزة وتطبيقات','شراء وقراءة'],
   signal:{value:100000000,display:'100M+'},
   rating:{score:4.8,reviews:'4.8M مراجعة'}
  },
  difference:'أبجد يركز على العربية والاشتراك؛ Kindle أوسع عالميًا.',
  sources:[['Google Play · أبجد','https://play.google.com/store/apps/details?id=com.abjjad.app'],['Google Play · Kindle','https://play.google.com/store/apps/details?id=com.amazon.kindle']]
 }
};

function competitionLogo(domain){
 return 'https://www.google.com/s2/favicons?sz=128&domain_url='+encodeURIComponent('https://'+domain);
}
function resetCompetition(){
 const btn=document.querySelector('.competition-tab[data-story="shopping"]');
 setCompetitionStory('shopping',btn);
 const wrap=document.getElementById('competitionCrumbWrap');if(wrap)wrap.style.display='none';
 go('competitionIndex');
}
function updateCompetitionCrumb(id){
 const wrap=document.getElementById('competitionCrumbWrap'),el=document.getElementById('competitionCrumb');
 if(!wrap||!el)return;
 if(id==='shopping'){wrap.style.display='none';return}
 const btn=document.querySelector('.competition-tab[data-story="'+id+'"]');
 el.textContent=btn?btn.textContent.replace(/\s+/g,' ').trim():id;
 wrap.style.display='inline';
}
function pairPct(value,max){
 if(value==null||max==null||!isFinite(value)||!isFinite(max)||max<=0)return 0;
 return Math.max(0,Math.min(100,(value/max)*100));
}
function ratingPct(score){
 if(score==null||!isFinite(score))return 0;
 return Math.max(0,Math.min(100,(score/5)*100));
}
function metricBlock(item,story,kind,maxValue){
 if(story.mode!=='numeric'){
  return '<div class="signal-qualitative"><small>'+story.metricLabel+'</small><strong>'+item.signal.display+'</strong></div>';
 }
 const pct=pairPct(item.signal.value,maxValue);
 return '<div class="signal-metric">'+
  '<div class="signal-metric-head"><span>'+story.metricLabel+'</span><strong>'+item.signal.display+'</strong></div>'+
  '<div class="signal-track"><i class="'+kind+'" style="width:'+pct+'%"></i></div>'+
 '</div>';
}
function ratingBlock(item,kind,showRatings){
 if(!showRatings)return '';
 return '<div class="signal-rating">'+
  '<div class="signal-metric-head"><span>تقييم Google Play</span><strong>'+item.rating.score+'/5</strong></div>'+
  '<div class="signal-track rating-track"><i class="'+kind+'" style="width:'+ratingPct(item.rating.score)+'%"></i></div>'+
  '<small>'+item.rating.reviews+'</small>'+
 '</div>';
}
function reasonBlock(item){
 return '<div class="signal-reasons"><small>لماذا قد تختاره؟</small><div>'+
  item.reasons.map(x=>'<span>'+x+'</span>').join('')+
 '</div></div>';
}
function signalCard(item,story,kind,maxValue,showRatings){
 return '<article class="signal-card '+kind+'">'+
  '<div class="signal-brand-head"><span class="signal-logo"><img src="'+competitionLogo(item.domain)+'" alt=""></span>'+
   '<div><small>'+item.tag+'</small><h4>'+item.name+'</h4><p class="signal-desc">'+item.desc+'</p></div></div>'+
  metricBlock(item,story,kind,maxValue)+ratingBlock(item,kind,showRatings)+reasonBlock(item)+
 '</article>';
}
function setCompetitionStory(id,btn){
 const story=competitionStories[id]||competitionStories.shopping;
 updateCompetitionCrumb(id);
 document.querySelectorAll('.competition-tab').forEach(b=>{
  const active=b.dataset.story===id;
  b.classList.toggle('active',active);
  b.setAttribute('aria-selected',active?'true':'false');
 });
 const root=document.getElementById('competitionStory');if(!root)return;
 const maxValue=story.mode==='numeric'?Math.max(story.regional.signal.value||0,story.global.signal.value||0):0;
 const showRatings=!!(story.regional.rating&&story.global.rating);
 root.innerHTML=
  '<div class="signal-pair '+(story.mode==='numeric'?'has-bars':'no-bars')+'">'+
   signalCard(story.regional,story,'regional',maxValue,showRatings)+
   '<div class="signal-center" aria-hidden="true"><span>↔</span></div>'+
   signalCard(story.global,story,'global',maxValue,showRatings)+
  '</div>'+
  '<div class="signal-conclusion"><b>الفرق باختصار</b><span>'+story.difference+'</span></div>'+
  '<div class="signal-source-row">'+story.sources.map(s=>'<a href="'+s[1]+'" target="_blank" rel="noopener noreferrer">'+s[0]+' ↗</a>').join('')+'</div>'+
  '<p class="signal-scale-note">'+(story.mode==='numeric'?'الشريط يقيس الانتشار أو الحجم فقط؛ نقاط «لماذا قد تختاره؟» تشرح القيمة العملية ولا تدخل في طول الشريط.':'لا يوجد مقياس رقمي متكافئ هنا، لذلك نعرض نقاط القوة دون شريط يوحي بمقارنة رقمية غير عادلة.')+'</p>';
}
// Competition renders lazily when its folded section is opened.

;

/* badilak-arab-progress-data-v123 */
const arabProgressData={
 innovation:{
  title:'مؤشر الابتكار العالمي',
  why:'يعكس قدرة البلد على تحويل التعليم والبحث والاستثمار إلى أفكار وتقنيات ومنتجات جديدة',
  note:'المركز العالمي — الرقم الأقل أفضل',
  sourceLabel:'WIPO · GII 2025',
  sourceUrl:'https://www.wipo.int/web-publications/global-innovation-index-2025/en/gii-2025-results.html',
  type:'rank',
  rows:[
   ['ae','الإمارات',30],['sa','السعودية',46],['qa','قطر',48],['ma','المغرب',57],['bh','البحرين',62],['jo','الأردن',65],
   ['om','عُمان',69],['kw','الكويت',73],['tn','تونس',76],['eg','مصر',86]
  ]
 },
 patents:{
  title:'طلبات البراءات حسب بلد مقدم الطلب',
  why:'يبين كم ابتكارًا وصل إلى مرحلة طلب الحماية القانونية، لا مجرد فكرة لم تُسجّل بعد',
  note:'طلبات 2024 — مقيم + طلبات بالخارج',
  sourceLabel:'WIPO · IP Statistics 2024',
  sourceUrl:'https://www.wipo.int/en/web/ip-statistics/country-profiles',
  type:'count',
  rows:[
   ['sa','السعودية',6071],['ae','الإمارات',1184],['dz','الجزائر',1117],['eg','مصر',756],['ma','المغرب',421],['tn','تونس',265],
   ['om','عُمان',147],['qa','قطر',129],['jo','الأردن',92],['kw','الكويت',88]
  ]
 },
 research:{
  title:'الإنتاج العلمي المسجل',
  why:'يبين حجم البحث العلمي المنشور دوليًا؛ أي نشاط المعرفة والبحث، لا جودة كل بحث على حدة',
  note:'Output في SCImago ARAB — أحدث نسخة متاحة',
  sourceLabel:'SCImago ARAB · Countries',
  sourceUrl:'https://www.scimagoarab.com/countries.php',
  type:'count',
  rows:[
   ['sa','السعودية',278290],['eg','مصر',201905],['iq','العراق',113213],['ae','الإمارات',84300],['ma','المغرب',67954],['dz','الجزائر',54169],
   ['jo','الأردن',50934],['tn','تونس',50232],['qa','قطر',32041],['lb','لبنان',27977]
  ]
 },
 ai:{
  title:'جاهزية الذكاء الاصطناعي',
  why:'يبين مدى استعداد البلد لاستخدام الذكاء الاصطناعي والاستفادة منه، لا عدد النماذج التي اخترعها',
  note:'IMF AIPI 2023 — من 0 إلى 1، الأعلى أفضل',
  sourceLabel:'IMF · AI Preparedness Index',
  sourceUrl:'https://www.imf.org/external/datamapper/datasets/AIPI',
  type:'score',
  rows:[
   ['ae','الإمارات',0.63],['sa','السعودية',0.58],['qa','قطر',0.53],['om','عُمان',0.53],['jo','الأردن',0.48],['kw','الكويت',0.46],
   ['ma','المغرب',0.43],['eg','مصر',0.39],['iq','العراق',0.27]
  ]
 },
 digital:{
  title:'التطور الرقمي والاتصال',
  why:'يبين مدى سهولة وجودة الوصول للإنترنت واستخدامه فعليًا؛ أساس أي اقتصاد وخدمة رقمية',
  note:'ITU IDI 2026 — من 0 إلى 100، الأعلى أفضل',
  sourceLabel:'ITU · ICT Development Index 2026',
  sourceUrl:'https://www.itu.int/dms_pub/itu-d/opb/ind/D-IND-ICT_MDD-2026-PDF-E.pdf',
  type:'score100',
  rows:[
   ['sa','السعودية',99.8],['ae','الإمارات',98.8],['kw','الكويت',98.4],['qa','قطر',98.4],['bh','البحرين',98.0],['om','عُمان',91.6],
   ['ma','المغرب',89.2],['dz','الجزائر',87.8],['jo','الأردن',87.0],['tn','تونس',80.1],['eg','مصر',79.6]
  ]
 },
 services:{
  title:'الخدمات الإلكترونية الحكومية',
  why:'يبين إلى أي مدى يستطيع الناس إنجاز خدماتهم الحكومية إلكترونيًا بدل الإجراءات التقليدية',
  note:'UN Online Service Index 2024 — من 0 إلى 1، الأعلى أفضل',
  sourceLabel:'UN DESA · E-Government Survey 2024',
  sourceUrl:'https://desapublications.un.org/publications/un-e-government-survey-2024',
  type:'score',
  rows:[
   ['sa','السعودية',0.9899],['ae','الإمارات',0.9163],['bh','البحرين',0.9030],['om','عُمان',0.8077],['qa','قطر',0.7655],
   ['jo','الأردن',0.7591],['eg','مصر',0.7002],['kw','الكويت',0.6365],['ma','المغرب',0.5618],['dz','الجزائر',0.3320]
  ]
 },
 cyber:{
  title:'النضج في الأمن السيبراني',
  why:'يبين جاهزية البلد لحماية فضائه الرقمي بالقوانين والتقنية والمؤسسات والمهارات والتعاون',
  note:'ITU GCI 2024 — فئات أداء، وليست ترتيبًا داخل الفئة',
  sourceLabel:'ITU · Global Cybersecurity Index 2024',
  sourceUrl:'https://www.itu.int/pub/D-HDB-GCI.01-2024',
  type:'tier',
  rows:[
   ['sa','السعودية',1],['ae','الإمارات',1],['eg','مصر',1],['jo','الأردن',1],['ma','المغرب',1],['om','عُمان',1],
   ['qa','قطر',1],['bh','البحرين',1],['dz','الجزائر',3],['kw','الكويت',3],['tn','تونس',3]
  ]
 },
 govtech:{
  title:'نضج الحكومة الرقمية GovTech',
  why:'يبين مدى تحول الحكومة نفسها إلى أنظمة وخدمات رقمية مترابطة تخدم الناس بكفاءة أكبر',
  note:'World Bank GTMI 2025 — مجموعات A إلى D، بلا ترتيب داخل المجموعة',
  sourceLabel:'World Bank · GTMI 2025',
  sourceUrl:'https://www.worldbank.org/en/programs/govtech/gtmi-2025-update',
  type:'group',
  rows:[
   ['sa','السعودية','A'],['ae','الإمارات','A'],['qa','قطر','A'],['bh','البحرين','A'],['om','عُمان','A'],['eg','مصر','A'],['jo','الأردن','A'],
   ['kw','الكويت','B'],['dz','الجزائر','B'],['tn','تونس','B'],['ma','المغرب','B'],['iq','العراق','C'],['lb','لبنان','C']
  ]
 }
};

const arabProgressFlagBase='/images/flags/';
const arabProgressCountryNames={ae:'الإمارات',sa:'السعودية',qa:'قطر',ma:'المغرب',bh:'البحرين',jo:'الأردن',om:'عُمان',kw:'الكويت',tn:'تونس',eg:'مصر',dz:'الجزائر',iq:'العراق',lb:'لبنان',sy:'سوريا',us:'الولايات المتحدة',gb:'بريطانيا'};
const arabProgressMeta={
 innovation:{icon:'account_tree',badge:'GII 2025',summary:'كلما كانت منظومة الابتكار أقوى، كانت الدولة أقدر على تحويل المعرفة والاستثمار إلى حلول ومنتجات جديدة.',points:[['01','تعليم وبحث قوي','مواهب ومعرفة تدفع الابتكار'],['02','بيئة أعمال نشطة','تمويل وشركات وفرص لتجربة الأفكار'],['03','مخرجات ملموسة','معرفة وتقنيات ومنتجات إبداعية']]},
 patents:{icon:'description',badge:'WIPO 2024',summary:'طلبات البراءات تكشف جانبًا من النشاط الابتكاري الذي وصل إلى مرحلة الحماية القانونية.',points:[['01','ابتكار قابل للحماية','الفكرة وصلت إلى طلب قانوني رسمي'],['02','نشاط تقني','إشارة إلى حركة تطوير واختراع'],['03','ملكية فكرية','أصل يمكن البناء عليه تجاريًا وتقنيًا']]},
 research:{icon:'school',badge:'SCImago',summary:'الإنتاج العلمي المنشور يوضح حجم حضور الباحثين والمؤسسات في صناعة المعرفة القابلة للتداول عالميًا.',points:[['01','معرفة منشورة','أبحاث وصلت إلى قنوات علمية دولية'],['02','باحثون ومؤسسات','حضور الجامعات والمراكز البحثية'],['03','قاعدة للمستقبل','معرفة يمكن أن تغذي التقنية والابتكار']]},
 ai:{icon:'code',badge:'IMF 2023',summary:'الجاهزية للذكاء الاصطناعي تعني امتلاك بنية ومهارات ومؤسسات تساعد على تبنيه والاستفادة منه.',points:[['01','بنية رقمية','اتصال وأنظمة قادرة على دعم الاستخدام'],['02','مهارات بشرية','تعليم ومواهب قادرة على العمل بالتقنية'],['03','بيئة تنظيمية','مؤسسات وقواعد تساعد على التبني الآمن']]},
 digital:{icon:'language',badge:'ITU 2026',summary:'الاتصال الرقمي القوي هو البنية الأساسية لأي خدمة إلكترونية أو اقتصاد رقمي يعمل على نطاق واسع.',points:[['01','وصول أوسع','ناس أكثر قادرون على الاتصال'],['02','استخدام فعلي','اتصال يتحول إلى نشاط وخدمات'],['03','جودة وتكلفة','تجربة رقمية أفضل وأكثر قابلية للاستخدام']]},
 services:{icon:'account_tree',badge:'UN 2024',summary:'الخدمات الإلكترونية تقيس مدى قدرة المواطن على إنجاز معاملاته والوصول للمعلومة والخدمة رقميًا.',points:[['01','خدمة أسهل','إجراءات أقل اعتمادًا على الحضور التقليدي'],['02','بوابات أنضج','محتوى وخدمات رقمية أكثر تكاملًا'],['03','مشاركة أفضل','قنوات أوسع للتفاعل والوصول للمعلومة']]},
 cyber:{icon:'shield',badge:'ITU 2024',summary:'النضج السيبراني يوضح مدى استعداد الدولة لحماية بنيتها الرقمية بالقانون والتقنية والمهارات والتعاون.',points:[['01','قوانين ومؤسسات','إطار واضح للمساءلة والاستجابة'],['02','قدرات تقنية','أدوات وفرق لحماية الأنظمة'],['03','مهارات وتعاون','رفع الجاهزية وتقليل أثر التهديدات']]},
 govtech:{icon:'account_tree',badge:'WB 2025',summary:'GovTech يقيس مدى نضج استخدام الحكومة نفسها للتقنية في الأنظمة والخدمات والتفاعل مع المواطنين.',points:[['01','أنظمة مترابطة','إدارة حكومية أكثر رقمية'],['02','خدمات عامة','تقديم خدمات أكثر كفاءة عبر التقنية'],['03','مشاركة وممكنات','بيانات ومؤسسات وقدرات تدعم التحول']]}
};
let currentArabMetric='innovation';
let arabCountryVisible=3;

function directoryCountryCount(code){
 return Object.values(itemCountryMap).filter(v=>countryInfoHasCode(v,code)).length;
}
function openCountryDirectory(code,country){
 if(!directoryCountryCount(code))return;
 countryFilter=code;
 filter='all';subfilter='all';originFilter=null;
 const search=document.getElementById('searchInput');if(search)search.value='';
 document.querySelectorAll('[data-origin]').forEach(b=>b.setAttribute('aria-pressed','false'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
 buildSubfilters();updateDirectoryCrumb();updateDirectoryActionLabel();resetDirectoryLimit();closeDirectoryRefiners();renderCards();goDirectoryResults();
}
function toggleArabExtraMetrics(btn){
 const panel=document.getElementById('arabExtraMetrics');if(!panel)return;
 const opening=panel.hasAttribute('hidden');
 if(opening)panel.removeAttribute('hidden');else panel.setAttribute('hidden','');
 btn.setAttribute('aria-expanded',opening?'true':'false');
 btn.textContent=opening?'− المزيد':'+ المزيد';
}
function closeArabExtraMetrics(){
 const panel=document.getElementById('arabExtraMetrics');
 const btn=document.getElementById('arabMoreMetricsBtn');
 if(panel&&!panel.hasAttribute('hidden'))panel.setAttribute('hidden','');
 if(btn){btn.setAttribute('aria-expanded','false');btn.textContent='+ المزيد'}
}
function selectArabMetric(metric,btn=null){
 currentArabMetric=metric;
 arabCountryVisible=3;
 renderArabProgress(metric,btn);
}
function showMoreArabCountries(){
 const d=arabProgressData[currentArabMetric]||arabProgressData.innovation;
 arabCountryVisible=Math.min(d.rows.length,arabCountryVisible+3);
 renderArabProgress(currentArabMetric,null);
}
function arabMetricVisual(d,value){
 if(d.type==='rank'){
  return `<div class="arab-rank-track" aria-hidden="true"><span style="--pos:${Math.min(99,Math.max(1,((value-1)/99)*100))}%"></span></div>`;
 }
 if(d.type==='tier'){
  const strength=(6-Number(value))/5*100;
  return `<div class="arab-progress-bar" aria-hidden="true"><span style="--w:${strength.toFixed(1)}%"></span></div>`;
 }
 if(d.type==='group'){
  const score=({A:4,B:3,C:2,D:1})[value]||1;
  return `<div class="arab-progress-bar" aria-hidden="true"><span style="--w:${(score/4*100).toFixed(1)}%"></span></div>`;
 }
 const max=d.type==='count'?Math.max(...d.rows.map(r=>Number(r[2])||0)):d.type==='score'?1:100;
 const pct=Math.max(7,(Number(value)/max)*100);
 return `<div class="arab-progress-bar" aria-hidden="true"><span style="--w:${pct.toFixed(1)}%"></span></div>`;
}
function arabMetricValue(d,value){
 if(d.type==='rank')return `#${value} عالميًا`;
 if(d.type==='score')return Number(value).toFixed(4).replace(/0+$/,'').replace(/\.$/,'');
 if(d.type==='score100')return Number(value).toFixed(1);
 if(d.type==='tier')return `الفئة T${value}`;
 if(d.type==='group')return `المجموعة ${value}`;
 return new Intl.NumberFormat('ar-EG').format(value);
}
function arabProgressCountryControl(code,country,value,visual,first=false){
 const count=directoryCountryCount(code);
 const cls='arab-progress-row'+(first?' is-first':'')+(count?' has-directory':'');
 const inner=`<div class="arab-progress-country"><img src="${arabProgressFlagBase+code+'.png'}" alt=""><b>${country}</b></div>${visual}<div class="arab-progress-value">${value}</div>`;
 return count
  ? `<button type="button" class="${cls}" onclick="openCountryDirectory('${code}','${country}')" title="اعرض ${count} عنصرًا من ${country} في الدليل">${inner}</button>`
  : `<div class="${cls}">${inner}</div>`;
}
function renderArabProgress(metric=currentArabMetric,btn=null){
 const d=arabProgressData[metric]||arabProgressData.innovation;
 currentArabMetric=metric;
 document.querySelectorAll('[data-arab-metric]').forEach(b=>b.classList.toggle('active',b.dataset.arabMetric===metric));
 const root=document.getElementById('arabProgressChart');
 const source=document.getElementById('arabProgressSource');
 if(!root||!source)return;

 const visibleRows=d.rows.slice(0,arabCountryVisible);
 const rows=visibleRows.map(([code,country,value],i)=>
  arabProgressCountryControl(code,country,arabMetricValue(d,value),arabMetricVisual(d,value),i===0)
 ).join('');
 const remaining=d.rows.length-visibleRows.length;
 const add=Math.min(3,remaining);

 const meta=arabProgressMeta[metric]||arabProgressMeta.innovation;
 root.innerHTML=`
  <div class="arab-metric-head">
   <div class="arab-metric-copy">
    <div class="arab-metric-title-wrap"><span class="arab-metric-medallion"><span class="material-symbols-outlined">${meta.icon}</span></span><strong>${d.title}</strong><span class="arab-metric-badge">${meta.badge}</span></div>
    <small class="arab-metric-why">${d.why||''}</small>
   </div>
   <span class="arab-metric-scale">ماذا يقيس؟ · ${d.note}</span>
  </div>
  ${rows}
  ${remaining>0?`<div class="arab-country-more-wrap"><button type="button" class="arab-country-more" onclick="showMoreArabCountries()">+ ${add} دول <small>${remaining} متبقية</small></button></div>`:''}`;

 source.innerHTML=`<span>المصدر:</span><a href="${d.sourceUrl}" target="_blank" rel="noopener noreferrer">${d.sourceLabel} ↗</a><span>· آخر تحقق: 22 سبتمبر 2026</span><span>· اضغط دولة لها عناصر لعرضها في الدليل</span>`;
 const insight=document.getElementById('arabProgressInsight');
 if(insight){
  insight.innerHTML=`
   <div class="arab-insight-head"><span class="arab-insight-emblem"><span class="material-symbols-outlined">${meta.icon}</span></span><h3>لماذا يهم؟</h3></div>
   <p class="arab-insight-summary">${meta.summary}</p>
   <div class="arab-insight-list">${meta.points.map(([n,t,s])=>`<div class="arab-insight-point"><span>${n}</span><div><b>${t}</b><small>${s}</small></div></div>`).join('')}</div>
   <div class="arab-insight-quote">هذا المؤشر لا يحكي القصة كاملة وحده؛ لكنه يوضح نوعًا محددًا من التقدم يمكن مقارنته بين الدول بمصدر واحد.</div>`;
 }
}
renderArabProgress('innovation');
