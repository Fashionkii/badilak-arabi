'use strict';
// Export web-sized versions of the reviewed image edits. This is an offline build step.
const sharp=require('sharp'),fs=require('node:fs'),path=require('node:path');
const [main,header,icon]=process.argv.slice(2);
if(!main||!header||!icon)throw new Error('Usage: node scripts/build-wordmark-assets.cjs MAIN.png HEADER.png ICON.png');
const root=path.resolve(__dirname,'..'),brand=path.join(root,'images/brand');
const bg='#071922',revision='20261016';
(async()=>{
 const manifest={revision,background:bg};
 for(const [key,input,widths] of [['wordmark-main',main,[640,1080]],['wordmark-header',header,[320,640]]]){
  const trimmed=await sharp(input).trim({background:bg,threshold:30}).extend({top:16,bottom:16,left:16,right:16,background:bg}).png().toBuffer();
  const meta=await sharp(trimmed).metadata();
  manifest[key]={width:meta.width,height:meta.height,files:[]};
  for(const width of widths){
   const name=`${key}-${revision}-${width}.webp`;
   await sharp(trimmed).resize({width}).webp({quality:90,effort:6}).toFile(path.join(brand,name));
   manifest[key].files.push(name);
  }
  if(key==='wordmark-main'){
   const logo=await sharp(trimmed).resize({width:940,height:510,fit:'inside'}).png().toBuffer();
   await sharp({create:{width:1200,height:630,channels:3,background:bg}}).composite([{input:logo,gravity:'centre'}]).jpeg({quality:90,mozjpeg:true}).toFile(path.join(root,`images/social/badilak-share-${revision}.jpg`));
  }
 }
 const icons=[];
 for(const size of [16,32,48,180]){
  const data=await sharp(icon).resize(size,size).png().toBuffer();
  if(size===32||size===180)fs.writeFileSync(path.join(brand,`wordmark-icon-${revision}-${size}.png`),data);
  if(size<180)icons.push({size,data});
 }
 const icoHeader=Buffer.alloc(6+16*icons.length);icoHeader.writeUInt16LE(1,2);icoHeader.writeUInt16LE(icons.length,4);
 let offset=icoHeader.length;
 icons.forEach(({size,data},i)=>{const at=6+16*i;icoHeader[at]=size;icoHeader[at+1]=size;icoHeader.writeUInt16LE(1,at+4);icoHeader.writeUInt16LE(32,at+6);icoHeader.writeUInt32LE(data.length,at+8);icoHeader.writeUInt32LE(offset,at+12);offset+=data.length;});
 fs.writeFileSync(path.join(root,'favicon.ico'),Buffer.concat([icoHeader,...icons.map(x=>x.data)]));
 fs.writeFileSync(path.join(brand,`wordmark-${revision}.json`),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify(manifest));
})().catch(error=>{console.error(error);process.exitCode=1;});
