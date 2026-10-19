'use strict';
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const code=fs.readFileSync(require('node:path').join(__dirname,'../js/feedback.js'),'utf8');
async function scenario({ok=true,data={ok:true},throws=false,enabled=true,endpoint='https://formspree.io/f/testOnly',honeypot=''}={}){
 let resets=0,calls=0,received;
 const status={textContent:''},submit={disabled:false},kind={value:'تصحيح'};
 const form={reportValidity:()=>true,setAttribute(){},removeAttribute(){},reset(){resets++;}};
 const context=vm.createContext({window:{badilakFeedbackConfig:{enabled,endpoint}},URL,AbortController,
  document:{getElementById:id=>({feedbackStatus:status,feedbackSubmit:submit,feedbackKind:kind})[id]},
  FormData:class{entries(){return Object.entries({kind:'تصحيح',subject:'اختبار',url:'https://example.com/',note:'بيانات افتراضية للاختبار',website:honeypot});}},
  fetch:async(url,options)=>{calls++;received={url,options,payload:JSON.parse(options.body)};if(throws)throw Error('offline');return {ok,json:async()=>data};},setTimeout,clearTimeout
 });
 vm.runInContext(code,context);const event={preventDefault(){},currentTarget:form};
 await Promise.all([context.submitDirectoryFeedback(event),context.submitDirectoryFeedback(event)]);
 const blocked=!enabled||!/^https:\/\/formspree.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)||!!honeypot;
 if(blocked){assert.equal(calls,0);assert.equal(resets,0);return;}
 assert.equal(calls,1,'One request despite duplicate submit');assert.equal(received.options.credentials,'omit');assert.equal(received.options.referrerPolicy,'no-referrer');
 assert.deepEqual(Object.keys(received.payload),['kind','subject','url','note','_gotcha']);
 assert.equal(submit.disabled,false);assert.equal(resets,ok&&!throws&&data.ok===true?1:0);
 assert.match(status.textContent,resets?/تم قبول/:/لم نتمكن من تأكيد الاستلام/);
 if(resets)assert.equal(kind.value,'تصحيح');
}
(async()=>{for(const s of [{},{ok:false},{data:{ok:false}},{data:{}},{throws:true},{enabled:false},{endpoint:'https://example.com/f/stolen'},{endpoint:'https://formspree.io/f/test?tracking=1'},{honeypot:'bot'}])await scenario(s);console.log('PASS: disabled/unapproved receiver sends nothing; accepted response only; drafts retained on failure; duplicate submits blocked; no credentials or referrer; original visible fields preserved.');})().catch(e=>{console.error(e);process.exitCode=1;});
