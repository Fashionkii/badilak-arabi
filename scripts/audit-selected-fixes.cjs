'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),base=process.argv[2]||'cc6c772';
const old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8'});
for(const p of ['js/catalog-data.js','js/detail-renderers.js','js/commercial-links.js','js/discovery-memory.js','js/guided-discovery.js','js/smart-return.js','site.config.json','vercel.json'])assert.equal(read(p),old(p),'Protected '+p);
for(const file of fs.readdirSync(path.join(root,'guides')))assert.equal(read('guides/'+file),old('guides/'+file),'Protected article '+file);
const home=s=>s.slice(s.indexOf('<body'));
assert.equal(home(read('index.html')),home(old('index.html')),'Homepage content, controls, reserved ads and all form fields');
const ctx=vm.createContext({window:{}});vm.runInContext(read('js/catalog-data.js')+'\n'+read('js/detail-renderers.js'),ctx);
const items=vm.runInContext('items',ctx);assert.equal(items.length,94);assert.equal(items.filter(x=>ctx.hasPracticalTrial(x)).length,48);
for(const x of items){const html=read('dist/discover/'+x.id+'.html');assert.match(html,/\/js\/outbound-choice.js/);assert.ok(!html.includes('/js/app.js'));assert.ok(html.includes(ctx.directoryDetailMarkup(x,true)));}
assert.match(read('dist/index.html'),/href="\/css\/site-bundle.css"/);assert.ok(!read('dist/index.html').includes('href="/css/app.css"'));assert.match(read('data/privacy.json'),/badilak_home_origins_v2/);
assert.doesNotMatch(read('js/feedback.js'),/sapi|websitepublisher/i);assert.match(read('js/feedback-config.js'),/enabled:false/);
// Exercise the shared dialog with a minimal native-dialog harness, without network access.
let last,events={},active={isConnected:true,focus(){this.focused=true;}},reviews=0,continued=0;
function el(){return {textContent:'',rel:'',attrs:{},focus(){active=this;},setAttribute(k,v){this.attrs[k]=v;}};}
const parts=Object.fromEntries(['h2','.outbound-domain','.outbound-continue','.outbound-review','.outbound-dismiss'].map(k=>[k,el()]));
const dialog={...el(),open:false,querySelector:k=>parts[k],addEventListener(k,v){events[k]=v;},showModal(){this.open=true;},close(){this.open=false;events.close?.();}};
const classes=new Set(),doc={activeElement:active,createElement:()=>dialog,body:{appendChild(x){last=x;},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},addEventListener(k,v){events['document-'+k]=v;},dispatchEvent(){}};
const browser=vm.createContext({document:doc,window:{addEventListener(){}},URL,location:{pathname:'/discover/test'},CustomEvent:class{}});
vm.runInContext(read('js/outbound-choice.js'),browser);
browser.window.badilakOutbound.open({name:'اختبار',url:'https://example.com/tool',domain:'example.com',affiliate:true,onReview(){reviews++;},onContinue(){continued++;}});
assert.equal(dialog.open,true);assert.equal(parts['.outbound-continue'].href,'https://example.com/tool');assert.match(parts['.outbound-continue'].rel,/sponsored/);assert.equal(parts['.outbound-continue'].attrs['aria-label'],'الانتقال إلى اختبار — يفتح في علامة تبويب جديدة');
parts['.outbound-review'].onclick();assert.equal(reviews,1);assert.equal(dialog.open,false);assert.equal(classes.has('outbound-open'),false);
browser.window.badilakOutbound.open({name:'ثانٍ',url:'https://example.com/',onContinue(){continued++;}});parts['.outbound-continue'].onclick();assert.equal(continued,1);assert.equal(dialog.open,false);
last=null;browser.window.badilakOutbound.open({name:'unsafe',url:'javascript:alert(1)'});assert.equal(dialog.open,false);
let prevented=false,expanded=false,focused=false;
const summary={hasAttribute:()=>false,setAttribute(){},focus(){focused=true;},scrollIntoView(){}},comparison={querySelector:()=>summary,scrollIntoView(){},set open(v){expanded=v;}};
const article={querySelector:s=>s==='h1'?{textContent:'أداة مباشرة'}:comparison};
const link={href:'https://example.com/direct',rel:'noopener noreferrer',querySelector:()=>({textContent:'example.com'}),closest:()=>article};
events['document-click']({target:{closest:()=>link},button:0,preventDefault(){prevented=true;}});assert.ok(prevented);assert.equal(dialog.open,true);parts['.outbound-review'].onclick();assert.ok(expanded&&focused);
prevented=false;events['document-click']({target:{closest:()=>link},button:0,ctrlKey:true,preventDefault(){prevented=true;}});assert.equal(prevented,false,'Preserve modified link gestures');
console.log('PASS: 94 complete details, 48 trials, all catalog/article/home content protected; shared exit/review/continue/dismiss and direct-page adapter; disabled receiver; homepage CSS bundle.');
