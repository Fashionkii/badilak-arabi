/* Source announcements, separate from resource review dates. No quality ranking. */
const badilakNews=[
 {id:'jais-3-release',title:'إعلان جيس 3: نماذج لغوية عربية مع إصدار مستقل للتعرف على الكلام',eventDate:'2026-10-15',eventLabel:'15 أكتوبر 2026',published:'2026-10-29',reviewed:'2026-10-29',reviewLabel:'29 أكتوبر 2026',related:'jais-3',
 change:'أعلنت جهات التطوير عن عائلة Jais 3، مع Jais Speech للتعرف على الكلام العربي.',
 audience:'قد يهم المطوّر أو الباحث الذي يريد اختبار نموذج عربي أو بناء تطبيق، وفق موارد تشغيله.',
 limits:'الخصائص ونتائج التقييم معلنة من جهات التطوير. الأوزان المتاحة لا تعني استضافة مجانية، ولم نختبر تطبيق المحادثة أو API.',
 action:'راجع مصدر الإصدار، ثم حدد طريقة الوصول والتكلفة والتجربة التي تناسب حاجتك.',
 source:'https://mbzuai.ac.ae/news-events/news/mbzuais-institute-foundation-models-inception42-launch-jais-3-arabic-native-ai'},
 {id:'falcon-arabic-models',title:'Falcon يعلن نماذج منفصلة للهجة الإماراتية والصوت والمستندات',eventDate:'2026-10-06',eventLabel:'6 أكتوبر 2026',published:'2026-10-29',reviewed:'2026-10-29',reviewLabel:'29 أكتوبر 2026',related:'falcon',
 change:'أعلن TII عن Falcon-Emirati وFalcon-ASR وFalcon-OCR-Arabic، بوظائف مختلفة داخل العائلة.',
 audience:'قد يهم المطوّر أو الباحث الذي يقارن معالجة اللهجات أو التسجيلات أو المستندات العربية.',
 limits:'هذا إعلان من المطور. لم ننفذ اختبار جودة مستقل، ولا يعني ظهور إصدارات أخرى أن نموذج Falcon Arabic القديم حصل على قدراتها.',
 action:'حدّد المهمة ثم راجع الإصدار وطريقة الوصول والترخيص قبل التجربة.',
 source:'https://www.tii.ae/news/tii-launches-falcon-emirati-alongside-new-arabic-ai-models-speech-and-visual-text'}
];
function relatedNewsMarkup(id){
 const rows=badilakNews.filter(n=>n.related===id);if(!rows.length)return '';
 return '<section class="discovery-related"><h2>تغيير مرتبط بهذا المورد</h2>'+rows.map(n=>`<p><a href="/news/${n.id}">${discoveryEscape(n.title)}</a><small class="news-date">الحدث: ${n.eventLabel} · مراجعة المصدر: ${n.reviewLabel}</small></p>`).join('')+'</section>';
}
