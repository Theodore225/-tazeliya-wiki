import {loadArtwork,artworkAsset} from './asset-loader';
// The supplied artwork is kept intact. Only its transparent margins are
// excluded from the display bounds; every leaf, vein and curve stays in place.
export const laurelAsset=artworkAsset('laurel-original.png');
export const laurelBounds={x:510,y:75,width:2261,height:2628};
const resolution=1024;
let masks:{solid:HTMLCanvasElement;outline:HTMLCanvasElement}|undefined;
let loading:Promise<void>|undefined;
const tinted=new Map<string,HTMLCanvasElement>();

// An inner contour leaves the original silhouette and transparent veins intact.
// Two sliding minimum passes erode alpha in linear time, once per asset load.
export function laurelOutlineAlpha(alpha:Uint8ClampedArray,width:number,height:number,radius:number){
 const horizontal=new Uint8ClampedArray(alpha.length),inner=new Uint8ClampedArray(alpha.length);
 const queue=new Int32Array(Math.max(width,height)+radius*2);
 const pass=(length:number,read:(i:number)=>number,write:(i:number,value:number)=>void)=>{
  let head=0,tail=0;
  const value=(i:number)=>i<0||i>=length?0:read(i);
  for(let i=-radius;i<length+radius;i++){
   const v=value(i);while(tail>head&&value(queue[tail-1])>=v)tail--;
   queue[tail++]=i;while(tail>head&&queue[head]<i-radius*2)head++;
   const out=i-radius;if(out>=0&&out<length)write(out,value(queue[head]));
  }
 };
 for(let y=0;y<height;y++)pass(width,x=>alpha[y*width+x],(x,v)=>{horizontal[y*width+x]=v;});
 for(let x=0;x<width;x++)pass(height,y=>horizontal[y*width+x],(y,v)=>{inner[y*width+x]=v;});
 return alpha.map((a,i)=>a-inner[i]);
}
export function prepareLaurel(){
 if(typeof Image==='undefined')return Promise.resolve();
 if(!loading)loading=(async()=>{
  const image=await loadArtwork(laurelAsset);
  const solid=document.createElement('canvas');solid.width=solid.height=resolution;
  const c=solid.getContext('2d')!;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  const b=laurelBounds,scale=(resolution-48)/Math.max(b.width,b.height),w=b.width*scale,h=b.height*scale;
  c.drawImage(image,b.x,b.y,b.width,b.height,(resolution-w)/2,(resolution-h)/2,w,h);
  const pixels=c.getImageData(0,0,resolution,resolution),alpha=new Uint8ClampedArray(resolution*resolution);
  for(let i=0;i<alpha.length;i++)alpha[i]=pixels.data[i*4+3];
  const contour=laurelOutlineAlpha(alpha,resolution,resolution,12);
  for(let i=0;i<contour.length;i++){pixels.data[i*4]=pixels.data[i*4+1]=pixels.data[i*4+2]=255;pixels.data[i*4+3]=contour[i];}
  const outline=document.createElement('canvas');outline.width=outline.height=resolution;outline.getContext('2d')!.putImageData(pixels,0,0);
  masks={solid,outline};
 })().catch(error=>{loading=undefined;throw error;});
 return loading;
}
function mask(kind:'solid'|'outline',color:string){
 if(!masks)return;const key=kind+color;let ink=tinted.get(key);if(ink)return ink;
 ink=document.createElement('canvas');ink.width=ink.height=resolution;const c=ink.getContext('2d')!;
 c.drawImage(masks[kind],0,0);c.globalCompositeOperation='source-in';c.fillStyle=color;c.fillRect(0,0,resolution,resolution);
 if(tinted.size>=6){const oldest=tinted.keys().next().value;if(oldest){const old=tinted.get(oldest)!;old.width=old.height=0;tinted.delete(oldest);}}
 tinted.set(key,ink);return ink;
}
export function drawLaurel(c:CanvasRenderingContext2D,x:number,y:number,size:number,solid=false){
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 if(solid){const fill=mask('solid',String(c.fillStyle));if(fill)c.drawImage(fill,x-size,y-size,size*2,size*2);}
 const ink=mask('outline',String(c.strokeStyle));if(ink)c.drawImage(ink,x-size,y-size,size*2,size*2);
 c.restore();
}
