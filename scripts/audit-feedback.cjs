'use strict';
// Check that a failed or malformed acknowledgement never discards the visitor's draft.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const code=fs.readFileSync(require('node:path').join(__dirname,'../js/feedback.js'),'utf8');
async function scenario(result,throws=false){
 let resets=0,calls=0,received;
 const status={textContent:''},submit={disabled:false},kind={value:'تصحيح'};
 const form={reportValidity:()=>true,setAttribute(){},removeAttribute(){},reset(){resets++;}};
 const context=vm.createContext({
  window:{WP:{sapi(project){assert.equal(project,28472);return {async submitForm(name,fields){calls++;received=fields;assert.equal(name,'directory_feedback');if(throws)throw Error('offline');return result;}};}}},
  document:{getElementById:id=>({feedbackStatus:status,feedbackSubmit:submit,feedbackKind:kind})[id]},
  FormData:class{entries(){return Object.entries({kind:'تصحيح',subject:'اختبار',url:'https://example.com/',note:'رسالة للتأكد من التعامل مع الفشل.',website:''});}},
  setTimeout,clearTimeout,Promise,Error
 });
 vm.runInContext(code,context);
 const submitEvent={preventDefault(){},currentTarget:form};
 await Promise.all([context.submitDirectoryFeedback(submitEvent),context.submitDirectoryFeedback(submitEvent)]);
 assert.equal(calls,1,'Prevent duplicate clicks while in flight');
 assert.equal(received.website,'');assert.equal(submit.disabled,false);
 assert.equal(resets,!throws&&result.ok&&result.data?.success===true?1:0);
 if(!resets)assert.match(status.textContent,/لم نتمكن من تأكيد الاستلام/);
 else{assert.match(status.textContent,/تم استلام/);assert.equal(kind.value,'تصحيح');}
}
(async()=>{
 await scenario({ok:true,data:{success:true}});
 await scenario({ok:true,data:{success:false}});
 await scenario({ok:true,data:{}});
 await scenario({ok:false,data:{success:true}});
 await scenario({},true);
 console.log('PASS: confirmed success only, draft retained on failure, duplicate-submit protection, original fields and honeypot.');
})().catch(error=>{console.error(error);process.exitCode=1;});
