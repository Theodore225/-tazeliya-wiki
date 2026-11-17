// Prepare recolorable masks from the supplied artwork, without tracing or
// redrawing it. Originals remain in public/artwork/originals for provenance.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const entries=await fs.readdir('node_modules/.pnpm');
const sharpEntry=entries.find(name=>name.startsWith('sharp@'));
if(!sharpEntry)throw new Error('Install project dependencies before preparing artwork.');
const sharp=require(path.resolve('node_modules/.pnpm',sharpEntry,'node_modules/sharp'));
const root='public/artwork';
async function alpha(name,white=false){
 const {data,info}=await sharp(`${root}/originals/${name}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const result=Buffer.alloc(info.width*info.height);
 for(let i=0;i<result.length;i++)result[i]=white?Math.min(255,Math.round(Math.max(255-data[i*4],255-data[i*4+1],255-data[i*4+2])/201*255)):data[i*4+3];
 return {data:result,width:info.width,height:info.height};
}
async function save(name,mask){
 const {data,width,height}=mask;
 const rgba=Buffer.alloc(width*height*4,255);
 for(let i=0;i<data.length;i++)rgba[i*4+3]=data[i];
 await sharp(rgba,{raw:{width,height,channels:4}}).png().toFile(`${root}/${name}.png`);
}
for(const [body,ring]of [['star-1','star-1-ring'],['star-2','star-2-ring']]){
 const plain=await alpha(body,true);
 const buffer=await sharp(plain.data,{raw:{width:plain.width,height:plain.height,channels:1}}).resize(1280,1280,{kernel:'lanczos3'}).greyscale().raw().toBuffer();
 if(buffer.length!==1280*1280)throw new Error('Unexpected mask channel count');
 await save(body,{data:buffer,width:1280,height:1280});
 const outer=await alpha(ring,true);
 // There is a clear transparent gap between all star tips and the outer
 // diamonds/dots. Split through that gap, retaining each original pixel.
 for(let y=0;y<outer.height;y++)for(let x=0;x<outer.width;x++)if(Math.hypot(x-640,y-640)<535)outer.data[y*outer.width+x]=0;
 await save(ring,outer);
}
for(const name of ['gnosis','yierda','esir']){
 const source=await alpha(name);
 let left=source.width,top=source.height,right=0,bottom=0;
 for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(source.data[y*source.width+x]>0){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 const w=right-left+1,h=bottom-top+1,scale=1216/Math.max(w,h),width=Math.round(w*scale),height=Math.round(h*scale);
 const resized=await sharp(source.data,{raw:{width:source.width,height:source.height,channels:1}}).extract({left,top,width:w,height:h}).resize(width,height,{kernel:'lanczos3'}).greyscale().raw().toBuffer();
 if(resized.length!==width*height)throw new Error('Unexpected mask channel count');
 const data=Buffer.alloc(1280*1280),dx=Math.floor((1280-width)/2),dy=Math.floor((1280-height)/2);
 for(let y=0;y<height;y++)resized.copy(data,(y+dy)*1280+dx,y*width,(y+1)*width);
 await save(name,{data,width:1280,height:1280});
}
console.log('Prepared seven artwork masks; original silhouettes and transparent details retained.');
