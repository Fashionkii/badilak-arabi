'use strict';
// One-time encoding of the generated artwork; no image library runs in production.
const sharp=require('sharp');
const fs=require('node:fs'),path=require('node:path');
const [sharing,icon]=process.argv.slice(2);
if(!sharing||!icon)throw new Error('Usage: node scripts/build-brand-sharing.cjs SHARING.png ICON.png');
const root=path.resolve(__dirname,'..');
(async()=>{
 await sharp(sharing).resize(1200,630,{fit:'fill'}).png({palette:true,colours:256,effort:10}).toFile(path.join(root,'images/social/badilak-social-base.png'));
 const icons=[];
 for(const size of [16,32,48])icons.push({size,data:await sharp(icon).resize(size,size).png().toBuffer()});
 const header=Buffer.alloc(6+16*icons.length);
 header.writeUInt16LE(1,2);header.writeUInt16LE(icons.length,4);
 let offset=header.length;
 icons.forEach(({size,data},i)=>{
  const at=6+16*i;header[at]=size;header[at+1]=size;
  header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);
  header.writeUInt32LE(data.length,at+8);header.writeUInt32LE(offset,at+12);offset+=data.length;
 });
 fs.writeFileSync(path.join(root,'favicon.ico'),Buffer.concat([header,...icons.map(x=>x.data)]));
 fs.writeFileSync(path.join(root,'images/brand/favicon-32.png'),icons[1].data);
 await sharp(icon).resize(180,180).png().toFile(path.join(root,'images/brand/apple-touch-icon.png'));
 for(const file of ['images/social/badilak-social-base.png','favicon.ico','images/brand/favicon-32.png','images/brand/apple-touch-icon.png'])console.log(file,fs.statSync(path.join(root,file)).size);
})().catch(error=>{console.error(error);process.exitCode=1;});
