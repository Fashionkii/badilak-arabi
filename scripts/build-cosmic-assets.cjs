'use strict';
// Encoding/resizing only: preserve the supplied artwork and its alpha channel.
const sharp=require('sharp');
const fs=require('node:fs'),path=require('node:path');
const [logo,space]=process.argv.slice(2);
if(!logo||!space)throw new Error('Usage: node scripts/build-cosmic-assets.cjs LOGO.png SPACE.png');
const out=path.resolve(__dirname,'../images/brand');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 for(const width of [320,640,1080]){
  await sharp(logo).resize({width,withoutEnlargement:true}).webp({quality:84,alphaQuality:100,effort:6}).toFile(path.join(out,`cosmic-logo-${width}.webp`));
  await sharp(logo).resize({width,withoutEnlargement:true}).avif({quality:50,effort:7}).toFile(path.join(out,`cosmic-logo-${width}.avif`));
 }
 for(const [width,quality] of [[800,48],[1600,56]]){
  await sharp(space).resize({width,withoutEnlargement:true}).webp({quality,effort:6}).toFile(path.join(out,`cosmic-space-${width}.webp`));
 }
 for(const file of fs.readdirSync(out).filter(x=>x.startsWith('cosmic-'))){
  console.log(file,fs.statSync(path.join(out,file)).size);
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
