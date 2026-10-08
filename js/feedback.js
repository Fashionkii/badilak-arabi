/* Load the official form client only when the visitor opens the form. */
let feedbackClientPromise;
function getFeedbackClient(){
 if(feedbackClientPromise)return feedbackClientPromise;
 feedbackClientPromise=new Promise((resolve,reject)=>{
  if(window.WP?.sapi){resolve(window.WP.sapi(28472));return;}
  const script=document.createElement('script');
  script.src='https://cdn.websitepublisher.ai/js/sapi-client.js';
  script.async=true;
  const fail=()=>{clearTimeout(timer);script.remove();reject(new Error('Form client unavailable'));};
  const timer=setTimeout(fail,15000);
  script.onerror=fail;
  script.onload=()=>{
   clearTimeout(timer);
   if(window.WP?.sapi)resolve(window.WP.sapi(28472));else fail();
  };
  document.head.appendChild(script);
 }).catch(error=>{feedbackClientPromise=null;throw error;});
 return feedbackClientPromise;
}
function openFeedback(kind){
 const dialog=document.getElementById('feedbackDialog');
 const field=document.getElementById('feedbackKind');
 const title=document.getElementById('feedbackTitle');
 field.value=kind||'ترشيح';
 title.textContent=field.value==='تصحيح'?'صحّح معلومة':'رشّح اكتشافًا';
 document.getElementById('feedbackStatus').textContent='';
 dialog.showModal();
 dialog.querySelector('input[name="subject"]').focus();
 getFeedbackClient().catch(()=>{}); // Submission displays any connection failure without losing the draft.
}
async function submitDirectoryFeedback(event){
 event.preventDefault();
 const form=event.currentTarget;
 const status=document.getElementById('feedbackStatus');
 const submit=document.getElementById('feedbackSubmit');
 if(submit.disabled||!form.reportValidity())return;
 const fields=Object.fromEntries(new FormData(form).entries());
 submit.disabled=true;
 form.setAttribute('aria-busy','true');
 status.textContent='جارٍ الإرسال…';
 try{
  const client=await getFeedbackClient();
  const result=await client.submitForm('directory_feedback',fields);
  if(!result.ok||result.data?.success!==true)throw new Error('Submission not confirmed');
  status.textContent='تم استلام رسالتك للمراجعة. شكرًا لمساعدتك في تحسين الدليل.';
  form.reset();
  document.getElementById('feedbackKind').value=fields.kind||'ترشيح';
 }catch{
  status.textContent='لم نتمكن من تأكيد الاستلام. احتفظنا بما كتبته؛ تحقّق من الاتصال وحاول مرة أخرى.';
 }finally{
  submit.disabled=false;
  form.removeAttribute('aria-busy');
 }
}
