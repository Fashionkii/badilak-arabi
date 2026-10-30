/* Source announcements, separate from resource review dates. No quality ranking. */
const badilakNews=[
 {id:'jais-3-release',imageArticle:'arabic-ai',title:'إعلان جيس 3: نماذج لغوية عربية مع إصدار مستقل للتعرف على الكلام',eventDate:'2026-10-15',eventLabel:'15 أكتوبر 2026',published:'2026-10-29',reviewed:'2026-10-29',reviewLabel:'29 أكتوبر 2026',related:'jais-3',
 change:'أعلنت جهات التطوير عن عائلة Jais 3، مع Jais Speech للتعرف على الكلام العربي.',
 audience:'قد يهم المطوّر أو الباحث الذي يريد اختبار نموذج عربي أو بناء تطبيق، وفق موارد تشغيله.',
 limits:'الخصائص ونتائج التقييم معلنة من جهات التطوير. الأوزان المتاحة لا تعني استضافة مجانية، ولم نختبر تطبيق المحادثة أو API.',
 action:'راجع مصدر الإصدار، ثم حدد طريقة الوصول والتكلفة والتجربة التي تناسب حاجتك.',
 source:'https://mbzuai.ac.ae/news-events/news/mbzuais-institute-foundation-models-inception42-launch-jais-3-arabic-native-ai'},
 {id:'falcon-arabic-models',imageArticle:'munsit-otter',title:'Falcon يعلن نماذج منفصلة للهجة الإماراتية والصوت والمستندات',eventDate:'2026-10-06',eventLabel:'6 أكتوبر 2026',published:'2026-10-29',reviewed:'2026-10-29',reviewLabel:'29 أكتوبر 2026',related:'falcon',
 change:'أعلن TII عن Falcon-Emirati وFalcon-ASR وFalcon-OCR-Arabic، بوظائف مختلفة داخل العائلة.',
 audience:'قد يهم المطوّر أو الباحث الذي يقارن معالجة اللهجات أو التسجيلات أو المستندات العربية.',
 limits:'هذا إعلان من المطور. لم ننفذ اختبار جودة مستقل، ولا يعني ظهور إصدارات أخرى أن نموذج Falcon Arabic القديم حصل على قدراتها.',
 action:'حدّد المهمة ثم راجع الإصدار وطريقة الوصول والترخيص قبل التجربة.',
 source:'https://www.tii.ae/news/tii-launches-falcon-emirati-alongside-new-arabic-ai-models-speech-and-visual-text'},
 {id:'arabicai-saudi-azure',imageArticle:'mostaql-upwork',title:'Arabic.AI تعلن شراكة لإتاحة حلولها عبر منطقة Azure السعودية',eventDate:'2026-10-07',eventLabel:'7 أكتوبر 2026',published:'2026-10-30',reviewed:'2026-10-30',reviewLabel:'30 أكتوبر 2026',related:'arabicai',
 change:'أعلنت Arabic.AI شراكتها مع مايكروسوفت لإتاحة حلولها عبر منطقة Azure السعودية، مع استضافة البيانات داخل المملكة وفق إعلان الشركة.',
 audience:'قد يهم المؤسسات والمطورين الذين يقارنون خيارات تشغيل الحلول العربية ومتطلبات موقع البيانات.',
 limits:'تحدث الإعلان عن إتاحة المنطقة للعملاء في نوفمبر 2026. لم نتحقق مستقلًا من الإتاحة أو التكلفة أو شروط كل خدمة.',
 action:'راجع متطلبات موقع البيانات والعقد والتكلفة وتاريخ الإتاحة قبل اتخاذ قرار.',
 source:'https://arabic.ai/arabic-ai-joins-microsofts-saudi-arabia-east-datacenter-region-as-a-strategic-ai-partner/'},
 {id:'karnak-chat-pilot',imageArticle:'khamsat-fiverr',title:'إطلاق تجريبي لكرنك شات: مساعد مصري للفصحى واللهجة المصرية',eventDate:'2026-08-23',eventLabel:'23 أغسطس 2026',published:'2026-10-30',reviewed:'2026-10-30',reviewLabel:'30 أكتوبر 2026',related:'karnak',
 change:'أعلن مركز الابتكار التطبيقي إطلاقًا تجريبيًا لكرنك شات، المبني على نموذج لغوي مصري.',
 audience:'قد يهم من يريد تجربة مساعد يدعم العربية واللهجة المصرية أو تطوير تطبيق عربي.',
 limits:'الإطلاق تجريبي، والقدرات الموصوفة من الجهة المطورة؛ لم نختبر دقته أو خصوصيته بشكل مستقل.',
 action:'جرّب مهمة محددة وقارن النتيجة، وراجع سياسة الخصوصية قبل إدخال بيانات حساسة.',
 source:'https://www.aic.gov.eg/news/43/'},
 {id:'belmasry-pilot',imageArticle:'arabic-voice-ai',title:'بالمصري: إطلاق تجريبي للتفريغ والترجمة وتحويل النص إلى صوت',eventDate:'2026-08-19',eventLabel:'19 أغسطس 2026',published:'2026-10-30',reviewed:'2026-10-30',reviewLabel:'30 أكتوبر 2026',path:'ai',
 change:'أعلن مركز الابتكار التطبيقي منصة تجريبية لمعالجة الصوت والترجمة بالفصحى والعامية المصرية.',
 audience:'قد تفيد من يتعامل مع التسجيلات العربية أو يحتاج إلى تحويل النص إلى كلام.',
 limits:'الإمكانات وشروط الإتاحة وفق إعلان الجهة؛ لم نختبر جودة التفريغ أو الترجمة أو تفاصيل الاستخدام المستمر.',
 action:'اختبر عينة غير حساسة، وراجع شروط الاستخدام والخصوصية قبل رفع التسجيلات.',
 source:'https://www.aic.gov.eg/news/44/'},
 {id:'loghat-pilot',imageArticle:'learning-platform',category:'learn',title:'لغات: تطبيق تجريبي لتعلّم الإنجليزية موجّه للمتعلمين في مصر',eventDate:'2026-08-19',eventLabel:'19 أغسطس 2026',published:'2026-10-30',reviewed:'2026-10-30',reviewLabel:'30 أكتوبر 2026',path:'languages',
 change:'أعلن مركز الابتكار التطبيقي إطلاقًا تجريبيًا لتطبيق لغات، لتعلّم الإنجليزية باستخدام الذكاء الاصطناعي.',
 audience:'قد يهم المتعلم الذي يبحث عن ممارسة الإنجليزية بما يناسب السياق المصري.',
 limits:'الوصف مستند إلى إعلان المركز، ولم نختبر المنهج أو فاعلية التعلم أو شروط إتاحة التطبيق.',
 action:'تحقق من إتاحة التطبيق وشروطه، ثم جرّب درسًا وقارن ملاءمته لمستواك.',
 source:'https://www.aic.gov.eg/news/'}
];
function relatedNewsMarkup(id){
 const rows=badilakNews.filter(n=>n.related===id);if(!rows.length)return '';
 return '<section class="discovery-related"><h2>تغيير مرتبط بهذا المورد</h2>'+rows.map(n=>`<p><a href="/news/${n.id}">${discoveryEscape(n.title)}</a><small class="news-date">الحدث: ${n.eventLabel} · مراجعة المصدر: ${n.reviewLabel}</small></p>`).join('')+'</section>';
}
