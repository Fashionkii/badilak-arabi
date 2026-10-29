/* Explicit relationships between existing resources. No provider/affiliate ranking.
   Different services from one company remain separate unless discoveryPairs says otherwise. */
const discoveryPaths={
 store:{name:'إنشاء متجر',description:'خيارات لبناء المتجر، ودروس تساعدك على تشغيله.',category:'work',items:['salla','zid','wuilt','expandcart'],learning:['salla-academy'],guides:['ecommerce-platform','payment-gateway']},
 business:{name:'إدارة عملك',description:'أدوات إدارة ومحاسبة مع مصادر لتعلّم استخدامها.',category:'work',items:['daftra','qoyod','expensya','zenhr'],learning:['daftra-hub','qoyod-academy'],guides:['business-software']},
 freelance:{name:'خدمة أو مستقل',description:'حدّد نتيجة المشروع، ثم قارن المنصات وتعلّم كيف تكتب طلبك.',category:'work',items:['khamsat','mostaql','nafezly','forlanso'],learning:['khamsat-blog'],guides:['khamsat-fiverr','mostaql-upwork']},
 ai:{name:'استخدام الذكاء الاصطناعي',description:'قارن حسب المهمة والعربية وطريقة الوصول، واقرأ ما تغيّر.',category:'tech',items:['karnak','fanar','falcon','arabicai','chat-egypt','jais-3'],learning:[],guides:['arabic-ai']},
 design:{name:'تصميم محتوى عربي',description:'أدوات تصميم ومصادر لتعلّم المهارة، مع مراجعة الخطوط والتصدير.',category:'create',items:['dhawwi','taqreer','arabicdesign'],learning:['makram'],guides:['arabic-design']},
 programming:{name:'تعلّم البرمجة',description:'دروس ومسارات تقنية؛ راجع المستوى وطبّق خطوة صغيرة.',category:'learn',items:['hsoub','gomycode'],learning:['hsoub-library','hsoub-youtube','elzero','gomycode-learning'],guides:['learning-platform']},
 languages:{name:'تعلّم لغة',description:'شرح عربي للغة ومعاجم تساعدك على الفهم والممارسة.',category:'learn',items:['almaany'],learning:['zamerican','droosonline'],guides:['almaany-translate','learning-platform']},
 school:{name:'التعلّم المدرسي',description:'اختر ما يناسب بلدك ومنهجك ومرحلتك؛ ليست المناهج متطابقة.',category:'learn',items:['alef','kezakoo','telmidtice'],learning:['alef-learning','kezakoo-learning','telmidtice-learning','newton-learning','kamkalima-learning'],guides:[]},
 quran:{name:'القرآن والتلاوة',description:'قنوات القراء الرسمية وخطوة للاستماع والمراجعة؛ العرض ليس ترتيبًا للقراء.',category:'learn',items:[],learning:['abdulbasit-official','hussary-official','mostafa-ismail-official','maher-official','alafasy-official','saad-ghamdi-official'],guides:['islamic-sources']},
 research:{name:'البحث والمعرفة',description:'مصادر ومكتبات تساعدك على الوصول إلى الدليل وتوثيقه.',category:'learn',items:['shamaa','mandumah','openalex','zotero','qdl'],learning:['qdl-youtube'],guides:['arabic-research']},
 reading:{name:'القراءة والاستماع',description:'كتب ومحتوى صوتي عربي، اختر طريقة الوصول التي تناسبك.',category:'culture',items:['abjjad','hindawi','ithra','sowt','thmanyah','anghami'],learning:['akhdar-youtube','thmanyah-youtube'],guides:['reading','anghami-spotify']}
};
// Supplemental sources are assigned to a relevant subcategory, not every field tag.
const learningDiscoveryContexts={
 'salla-academy':[['work','commerce']], 'qoyod-academy':[['work','management']],
 'daftra-hub':[['work','management']], 'khamsat-blog':[['work','services']],
 'hsoub-library':[['learn','courses'],['tech','software']], 'hsoub-youtube':[['learn','courses'],['tech','software']],
 'elzero':[['learn','courses'],['tech','software']], 'makram':[['create','design']],
 'zamerican':[['learn','language']], 'droosonline':[['learn','language']],
 'akhdar-youtube':[['culture','books']], 'thmanyah-youtube':[['culture','podcasts']],
 'qdl-youtube':[['learn','research']], 'khan-arabi':[['learn','courses']]
};
