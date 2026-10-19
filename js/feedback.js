/* No external SDK, cookies or message storage. Disabled until delivery is verified. */
function feedbackEndpoint(){
 const config=window.badilakFeedbackConfig;
 if(!config?.enabled)return '';
 try{const url=new URL(config.endpoint);return url.origin==='https://formspree.io'&&/^\/f\/[a-zA-Z0-9]+$/.test(url.pathname)&&!url.search&&!url.hash?url.href:'';}catch{return '';}
}
function openFeedback(kind){
 const dialog=document.getElementById('feedbackDialog'),field=document.getElementById('feedbackKind');
 field.value=kind||'ترشيح';document.getElementById('feedbackTitle').textContent=field.value==='تصحيح'?'صحّح معلومة':'رشّح اكتشافًا';
 const enabled=!!feedbackEndpoint();
 dialog.querySelectorAll('input,textarea').forEach(input=>input.disabled=!enabled);
 document.getElementById('feedbackSubmit').disabled=!enabled;
 document.getElementById('feedbackStatus').textContent=enabled?'':'الإرسال متوقف مؤقتًا لحين استكمال إعداد خدمة الاستقبال. لا تُرسل أي بيانات من هذا النموذج حاليًا.';
 dialog.showModal();(enabled?dialog.querySelector('input[name="subject"]'):dialog.querySelector('.feedback-close')).focus();
}
async function submitDirectoryFeedback(event){
 event.preventDefault();const endpoint=feedbackEndpoint(),form=event.currentTarget;
 const status=document.getElementById('feedbackStatus'),submit=document.getElementById('feedbackSubmit');
 if(!endpoint||submit.disabled||!form.reportValidity())return;
 const fields=Object.fromEntries(new FormData(form).entries());
 if(fields.website)return;
 const payload={kind:fields.kind,subject:fields.subject,url:fields.url,note:fields.note,_gotcha:fields.website};
 submit.disabled=true;form.setAttribute('aria-busy','true');status.textContent='جارٍ الإرسال…';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{
  const response=await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
  const result=await response.json();if(!response.ok||result.ok!==true)throw Error('Submission not confirmed');
  status.textContent='تم قبول رسالتك للمراجعة. شكرًا لمساعدتك في تحسين الدليل.';form.reset();document.getElementById('feedbackKind').value=fields.kind||'ترشيح';
 }catch{
  status.textContent='لم نتمكن من تأكيد الاستلام. احتفظنا بما كتبته؛ تحقّق من الاتصال وحاول مرة أخرى.';
 }finally{clearTimeout(timer);submit.disabled=false;form.removeAttribute('aria-busy');}
}
