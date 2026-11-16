/* Last build step: save the service logos on this site.

   The pages name each logo by the external icon service address. This step downloads every
   logo once into dist/images/logos, points the built pages and data at the saved copy, and
   lists the saved domains in globalThis.badilakLocalLogos for the logos the scripts build
   at run time (see siteLogo in js/catalog-data.js).

   It never fails the build. A logo that cannot be fetched, or a build machine with no route
   to the icon service, leaves that logo on its external address exactly as before. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const out=path.resolve(__dirname,'..','dist');
const source=process.env.BADILAK_LOGO_SOURCE||'https://www.google.com/s2/favicons';
const size=128;            // Logos are drawn at 56 CSS pixels at most; 128 covers dense screens.
const perRequestMs=8000,totalMs=45000,parallel=10;
const domainPattern='[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?';
// Every spelling the pages and data use for one icon-service address.
const addressPattern=new RegExp('https://www\\.google\\.com/s2/favicons\\?sz=\\d+&(?:amp;)?domain_url=https(?:%3A%2F%2F|://)('+domainPattern+')','gi');

function textFiles(){
 return fs.readdirSync(out,{recursive:true}).map(String)
  .filter(file=>/\.(?:html|js)$/.test(file)).map(file=>path.join(out,file));
}
function collectDomains(files){
 const domains=new Set();
 for(const file of files){
  const text=fs.readFileSync(file,'utf8');
  for(const match of text.matchAll(addressPattern))domains.add(match[1].toLowerCase());
  // Logos the scripts build at run time name only the domain.
  for(const match of text.matchAll(new RegExp('officialFavicon\\([\'"]('+domainPattern+')[\'"]\\)','gi')))domains.add(match[1].toLowerCase());
  if(path.basename(file)==='app.js'){
   for(const match of text.matchAll(new RegExp('\\bdomain:\'('+domainPattern+')\'','gi')))domains.add(match[1].toLowerCase());
   const extras=text.match(/const homeOriginExtras=\{[\s\S]*?\n\};/);
   if(extras)for(const match of extras[0].matchAll(new RegExp('\\[\'('+domainPattern+')\'\\s*,','gi')))domains.add(match[1].toLowerCase());
  }
 }
 return [...domains].filter(domain=>domain.includes('.')).sort();
}
function imageExtension(bytes){
 if(bytes.length>8&&bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47)return 'png';
 if(bytes.length>3&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return 'jpg';
 if(bytes.length>12&&bytes.subarray(0,4).toString('latin1')==='RIFF'&&bytes.subarray(8,12).toString('latin1')==='WEBP')return 'webp';
 return '';
}
async function fetchLogo(domain,deadline){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),Math.max(1,Math.min(perRequestMs,deadline-Date.now())));
 try{
  const response=await fetch(source+'?sz='+size+'&domain_url='+encodeURIComponent('https://'+domain),{signal:controller.signal,redirect:'follow'});
  // The service answers an unknown domain with a generic icon and a not-found status; keep that one external.
  if(!response.ok)return null;
  const bytes=Buffer.from(await response.arrayBuffer());
  const extension=imageExtension(bytes);
  return extension&&bytes.length<=200000?{bytes,extension}:null;
 }catch{return null;}
 finally{clearTimeout(timer);}
}
async function main(){
 if(!fs.existsSync(out)||typeof fetch!=='function')return console.log('Logos: skipped (no build output or no fetch in this Node version).');
 const files=textFiles(),domains=collectDomains(files);
 if(!domains.length)return console.log('Logos: no icon-service addresses found.');
 const deadline=Date.now()+totalMs;
 // One request first: a machine with no route to the service should not wait for a hundred timeouts.
 const saved=new Map(),first=await fetchLogo(domains[0],Date.now()+Math.min(perRequestMs,5000));
 if(!first&&!(await fetchLogo(domains[1]||domains[0],Date.now()+5000)))return console.log(`Logos: icon service not reachable from this build; ${domains.length} logos stay on their external address.`);
 const queue=domains.slice();
 const directory=path.join(out,'images','logos');fs.mkdirSync(directory,{recursive:true});
 const store=(domain,logo)=>{
  const file=domain+'.'+logo.extension;
  fs.writeFileSync(path.join(directory,file),logo.bytes);saved.set(domain,'/images/logos/'+file);
 };
 if(first){store(domains[0],first);queue.shift();}
 await Promise.all(Array.from({length:parallel},async()=>{
  while(queue.length&&Date.now()<deadline){
   const domain=queue.shift(),logo=await fetchLogo(domain,deadline);
   if(logo)store(domain,logo);
  }
 }));
 if(!saved.size)return console.log('Logos: none could be saved; all stay on their external address.');
 let rewritten=0;
 for(const file of files){
  const before=fs.readFileSync(file,'utf8');
  let after=before.replace(addressPattern,(address,domain)=>{const local=saved.get(domain.toLowerCase());if(local)rewritten++;return local||address;});
  // The data file loads before every script that builds a logo address.
  if(path.relative(out,file).split(path.sep).join('/')==='js/catalog-data.js')after='globalThis.badilakLocalLogos='+JSON.stringify(Object.fromEntries([...saved].sort()))+';\n'+after;
  if(after!==before)fs.writeFileSync(file,after);
 }
 const bytes=[...saved.values()].reduce((sum,file)=>sum+fs.statSync(path.join(out,file)).size,0);
 console.log(`Logos: saved ${saved.size} of ${domains.length} on this site (${Math.round(bytes/1024)} KB), ${rewritten} addresses repointed; ${domains.length-saved.size} stay external.`);
}
main().catch(error=>console.log('Logos: step skipped after an error ('+error.message+'); logos stay on their external address.'));
