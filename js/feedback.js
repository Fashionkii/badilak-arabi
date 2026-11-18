/* No external SDK, cookies or message storage. Disabled until delivery is verified. */
function feedbackEndpoint(){
 const config=window.badilakFeedbackConfig;
 if(!config?.enabled)return '';
 try{const url=new URL(config.endpoint);return url.origin==='https://formspree.io'&&/^\/f\/[a-zA-Z0-9]+$/.test(url.pathname)&&!url.search&&!url.hash?url.href:'';}catch{return '';}
}
function feedbackMailLink(email,kind){
 const correction=kind==='تصحيح';
 const subject=(correction?'تصحيح معلومة':'ترشيح اكتشاف')+' — بديلك عربي';
 const body=correction?'رابط الصفحة:\n\nالمعلومة المقصودة:\n\nالمصدر الذي يثبت الصواب:\n':'اسم الأداة أو المصدر:\n\nالرابط الرسمي:\n\nلماذا يستحق الإضافة؟\n';
 return 'mailto:'+email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}
// For visitors whose device has no mail app set up: copy the address instead of opening a draft.
function copyContactEmail(button){
 const email=window.badilakFeedbackConfig?.contactEmail||'contact@badilakarabi.com';
 const label=button.dataset.label||(button.dataset.label=button.textContent);
 const done=ok=>{button.textContent=ok?'تم نسخ البريد':label;clearTimeout(button._copyTimer);if(ok)button._copyTimer=setTimeout(()=>{button.textContent=label},2500);};
 if(navigator.clipboard?.writeText){navigator.clipboard.writeText(email).then(()=>done(true),()=>{window.prompt('انسخ البريد الإلكتروني:',email);done(false);});}
 else{window.prompt('انسخ البريد الإلكتروني:',email);done(false);}
}
function openFeedback(kind){
 const dialog=document.getElementById('feedbackDialog'),field=document.getElementById('feedbackKind');
 field.value=kind||'ترشيح';document.getElementById('feedbackTitle').textContent=field.value==='تصحيح'?'صحّح معلومة':'رشّح اكتشافًا';
 const enabled=!!feedbackEndpoint();
 // While the form is off, a form that looks ready and accepts nothing misleads; open a mail draft instead.
 const email=window.badilakFeedbackConfig?.contactEmail;
 if(!enabled&&email){location.href=feedbackMailLink(email,field.value);return;}
 dialog.querySelectorAll('input,textarea').forEach(input=>input.disabled=!enabled);
 document.getElementById('feedbackSubmit').disabled=!enabled;
 document.getElementById('feedbackStatus').textContent=enabled?'':'الإرسال من هذا النموذج متوقف مؤقتًا، ولا تُرسل منه أي بيانات. راسلنا مباشرة على contact@badilakarabi.com';
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
