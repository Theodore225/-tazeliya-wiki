import {loadArtwork,artworkAsset} from './asset-loader';
export const roseAssets:Record<string,string>={roses:artworkAsset('rose-1.png'),roses2:artworkAsset('rose-2.png')};
export const isRose=(id:string)=>id==='roses'||id==='roses2';
const images=new Map<string,HTMLImageElement>();
const tinted=new Map<string,HTMLCanvasElement>();
export function prepareRoses(ids=Object.keys(roseAssets)){
 if(typeof Image==='undefined')return Promise.resolve();
 return Promise.all(ids.map(async id=>{images.set(id,await loadArtwork(roseAssets[id]));})).then(()=>{});
}
export function drawRose(c:CanvasRenderingContext2D,id:string,x:number,y:number,size:number){
 const source=images.get(id);if(!source)return;
 const color=String(c.strokeStyle),key=id+color;let ink=tinted.get(key);
 if(!ink){ink=document.createElement('canvas');ink.width=ink.height=1024;const ctx=ink.getContext('2d')!;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(source,0,0,1024,1024);ctx.globalCompositeOperation='source-in';ctx.fillStyle=color;ctx.fillRect(0,0,1024,1024);if(tinted.size>=6){const oldest=tinted.keys().next().value;if(oldest){const old=tinted.get(oldest)!;old.width=old.height=0;tinted.delete(oldest);}}tinted.set(key,ink);}
 // Recolor only existing artwork pixels: no extra outline, no filling holes.
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(ink,x-size,y-size,size*2,size*2);c.restore();
}
