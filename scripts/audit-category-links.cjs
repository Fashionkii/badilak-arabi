'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root,'js/catalog-data.js'),'utf8'),context);
context.window=context;
context.document={querySelector:()=>null,getElementById:()=>null,addEventListener(){}};
context.location={pathname:'/'};
context.history={pushState(){},replaceState(){}};
context.addEventListener=()=>{};
vm.runInContext(fs.readFileSync(path.join(root,'js/route-seo.js'),'utf8'),context);
const categories=context.badilakSEO.categories();
const {items}=vm.runInContext('({items})',context);
const home=fs.readFileSync(path.join(out,'index.html'),'utf8');
const reached=new Set();
for(const category of categories){
 const href='/category/'+category;
 assert.ok(home.includes('href="'+href+'"'),'Category missing from initial home HTML: '+category);
 const html=fs.readFileSync(path.join(out,'category',category+'.html'),'utf8');
 for(const item of items.filter(x=>x.cat===category)){
  assert.ok(html.includes('href="/discover/'+item.id+'"'),'Missing resource link: '+item.id);
  assert.ok(fs.existsSync(path.join(out,'discover',item.id+'.html')),'Missing resource page: '+item.id);
  reached.add(item.id);
 }
}
assert.equal(reached.size,items.length,'Every resource must be reachable through category HTML links');

// Ordinary activation keeps the existing filter function and control reference.
// Modified/middle clicks and a missing application runtime must allow native navigation.
const calls=[],control={dataset:{filter:'tech'}};
context.setFilter=(...args)=>calls.push(args);
function check(modifiers,handled){
 let prevented=false;
 const before=calls.length;
 const event={button:0,metaKey:false,ctrlKey:false,shiftKey:false,altKey:false,...modifiers,preventDefault(){prevented=true;}};
 assert.equal(context.badilakFilterCategory(event,'tech',control),!handled);
 assert.equal(prevented,handled);
 assert.equal(calls.length-before,Number(handled));
 if(handled){assert.equal(calls.at(-1)[0],'tech');assert.equal(calls.at(-1)[1],control);}
}
check({},true);
for(const modifiers of [{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{button:1},{button:2}])check(modifiers,false);
delete context.setFilter;
check({},false);
console.log(`PASS: ${categories.length} crawlable home category links reach ${reached.size} resource pages; ordinary, modified, middle-click and missing-runtime behavior preserved.`);
