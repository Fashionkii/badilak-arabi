(()=>{
 const links={
  hsoub:{
   officialUrl:'https://academy.hsoub.com/',
   programUrl:'',
   affiliateUrl:'',
   status:'pending',
   programStatus:'needs_current_terms',
   sourceStatus:'archived_commercial_slot',
   content:{
    learning:{
     officialUrl:'https://academy.hsoub.com/',
     affiliateUrl:'',
     status:'pending',
     deepLinkStatus:'needs_current_terms',
     contentType:'articles_courses'
    }
   }
  },
  khamsat:{
   officialUrl:'https://khamsat.com/',
   programUrl:'https://khamsat.com/affiliates',
   affiliateUrl:'',
   status:'pending',
   programStatus:'needs_current_terms',
   sourceStatus:'archived_model',
   content:{
    freelancingBlog:{
     officialUrl:'https://blog.khamsat.com/category/freelancing/',
     affiliateUrl:'',
     status:'pending',
     deepLinkStatus:'needs_current_terms',
     contentType:'articles'
    }
   }
  },
  daftra:{
   officialUrl:'https://www.daftra.com/',
   programUrl:'https://www.daftra.com/agencies_program/',
   affiliateUrl:'',
   status:'pending',
   programStatus:'official_program_page_saved',
   sourceStatus:'archived_model',
   content:{
    learningHub:{
     officialUrl:'https://www.daftra.com/hub/',
     affiliateUrl:'',
     status:'pending',
     deepLinkStatus:'needs_current_terms',
     contentType:'articles_guides'
    }
   }
  },
  salla:{
   officialUrl:'https://salla.com/',
   programUrl:'https://partners.salla.com/affiliate',
   affiliateUrl:'',
   status:'pending',
   programStatus:'needs_current_terms',
   sourceStatus:'archived_affiliate_research',
   content:{
    academy:{
     officialUrl:'https://academy.salla.com/courses',
     affiliateUrl:'',
     status:'pending',
     deepLinkStatus:'needs_current_terms',
     contentType:'courses'
    }
   }
  },

  // محفوظة من بحث المشروع القديم، ولا تضيف عناصر إلى الدليل الحالي.
  qoyod:{
   officialUrl:'https://www.qoyod.com/',
   programUrl:'https://www.qoyod.com/partnerships/affiliate-program/',
   affiliateUrl:'',
   status:'pending',
   programStatus:'needs_current_terms',
   dormant:true,
   sourceStatus:'archived_affiliate_research',
   content:{
    academy:{
     officialUrl:'https://academy.qoyod.com/',
     affiliateUrl:'',
     status:'pending',
     deepLinkStatus:'needs_current_terms',
     contentType:'courses_webinars'
    }
   }
  },
  wuilt:{
   officialUrl:'https://wuilt.com/',
   programUrl:'https://wuilt.com/affiliate/wuilt-affiliate-ar',
   affiliateUrl:'',
   status:'pending',
   programStatus:'needs_current_terms',
   dormant:true,
   sourceStatus:'archived_affiliate_research',
   content:{
    storeGuide:{
     officialUrl:'https://wuilt.com/blog/ar/%D9%83%D9%8A%D9%81-%D8%AA%D9%86%D8%B4%D8%A6-%D9%85%D8%AA%D8%AC%D8%B1-%D8%A7%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A-%D8%A8%D8%AE%D8%B7%D9%88%D8%A7%D8%AA-%D8%B3%D9%87%D9%84%D8%A9-%D8%B9%D9%84%D9%89/',
     affiliateUrl:'',
     status:'pending',
     deepLinkStatus:'needs_current_terms',
     contentType:'article'
    }
   }
  },
  lymonah:{
   officialUrl:'https://lymonah.com/',
   programUrl:'https://lymonah.com/partners',
   affiliateUrl:'',
   status:'pending',
   programStatus:'needs_current_terms',
   dormant:true,
   sourceStatus:'archived_affiliate_research'
  },
  aafia:{
   officialUrl:'https://aafiaemr.com/',
   programUrl:'https://aafiaemr.com/ar/Affiliate',
   affiliateUrl:'',
   status:'pending',
   programStatus:'needs_current_terms',
   dormant:true,
   sourceStatus:'archived_affiliate_research'
  },
  forlanso:{
   officialUrl:'https://www.forlanso.com/',
   programUrl:'https://www.forlanso.com/en/affiliate',
   affiliateUrl:'',
   status:'pending',
   programStatus:'needs_current_terms',
   dormant:true,
   sourceStatus:'archived_affiliate_research'
  }
 };

 function safeAffiliate(url){
  try{
   const u=new URL(url,location.href);
   return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';
  }catch{return ''}
 }

 function resolve(id,fallbackUrl=''){
  const cfg=links[id];
  const official=fallbackUrl||cfg?.officialUrl||'';
  if(!cfg)return {url:official,affiliate:false,status:'none',programUrl:''};
  const affiliate=cfg.status==='active'?safeAffiliate(cfg.affiliateUrl):'';
  if(affiliate)return {url:affiliate,affiliate:true,status:'active',programUrl:cfg.programUrl||'',officialUrl:cfg.officialUrl||official};
  return {url:official||cfg.officialUrl||'',affiliate:false,status:cfg.status||'pending',programUrl:cfg.programUrl||'',officialUrl:cfg.officialUrl||official};
 }

 function resolveContent(id,key,fallbackUrl=''){
  const cfg=links[id]?.content?.[key];
  const official=fallbackUrl||cfg?.officialUrl||'';
  if(!cfg)return {url:official,affiliate:false,status:'none',deepLinkStatus:'none'};
  const affiliate=cfg.status==='active'?safeAffiliate(cfg.affiliateUrl):'';
  if(affiliate)return {url:affiliate,affiliate:true,status:'active',deepLinkStatus:cfg.deepLinkStatus||'confirmed',officialUrl:cfg.officialUrl||official};
  return {url:official||cfg.officialUrl||'',affiliate:false,status:cfg.status||'pending',deepLinkStatus:cfg.deepLinkStatus||'needs_current_terms',officialUrl:cfg.officialUrl||official};
 }

 function disclosureHtml(){
  return '<div class="commercial-disclosure" data-commercial-disclosure><strong>إفصاح تجاري</strong><span>هذا رابط إحالة؛ قد نحصل على عمولة إذا أجريت عملية مؤهلة. لا يؤثر ذلك على ترتيبنا أو تقييمنا، والسعر والشروط النهائية لدى الجهة.</span></div>';
 }

 function apply(root=document){
  root.querySelectorAll('[data-commercial-id]').forEach(el=>{
   const id=el.dataset.commercialId;
   const fallback=el.dataset.officialUrl||el.getAttribute('href')||'';
   const r=resolve(id,fallback);
   if(!r.url)return;
   if(el.tagName==='A'){
    el.href=r.url;
    el.rel=r.affiliate?'sponsored noopener noreferrer':'noopener noreferrer';
    el.dataset.linkKind=r.affiliate?'affiliate':'official';
   }
   if(r.affiliate){
    const wrap=el.closest('[data-commercial-wrap]')||el.parentElement;
    if(wrap&&!wrap.querySelector('[data-commercial-disclosure]'))wrap.insertAdjacentHTML('afterbegin',disclosureHtml());
   }
  });
 }

 window.BADILAK_COMMERCIAL_LINKS=links;
 window.badilakCommercialResolve=resolve;
 window.badilakCommercialResolveContent=resolveContent;
 window.badilakCommercialDisclosureHTML=disclosureHtml;
 window.badilakApplyCommercialLinks=apply;

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply(),{once:true});
 else apply();
})();