'use strict';
module.exports=out=>{
 const fs=require('node:fs'),path=require('node:path');
 const folder=path.join(out,'__first-paint');fs.mkdirSync(folder,{recursive:true});
 for(const [name,file] of [['home','index.html'],['category-tech','category/tech.html'],['fanar','discover/fanar.html']]){
  let html=fs.readFileSync(path.join(out,file),'utf8').replace(/<script src="[^"]+" defer><\/script>/g,'');
  // Keep the inline early route choice; suppress only the deferred application scripts.
  fs.writeFileSync(path.join(folder,name+'.html'),html);
 }
 for(const [name,src] of [['mobile-home','/__first-paint/home'],['mobile-live','/'],['mobile-learning','/#learning']]){
  fs.writeFileSync(path.join(folder,name+'.html'),`<!doctype html><html><head><meta name="robots" content="noindex"><title>Temporary viewport check</title></head><body style="margin:0"><iframe title="390px viewport" src="${src}" style="border:0;width:390px;height:844px"></iframe></body></html>`);
 }
};
