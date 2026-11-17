export const lifeTreeAssets={plain:'./life-tree.png',stars:'./life-tree-stars.png',holes:'./life-tree-holes.png'};
const images=new Map<string,HTMLImageElement>();
const tinted=new Map<string,HTMLCanvasElement>();
let loading:Promise<void>|undefined;
export function prepareLifeTree(){
 if(typeof Image==='undefined')return Promise.resolve();
 if(!loading)loading=Promise.all(Object.values(lifeTreeAssets).map(async src=>{const image=new Image();image.src=src;await image.decode();images.set(src,image);})).then(()=>{}).catch(error=>{loading=undefined;throw error;});
 return loading;
}
function mask(src:string,color:string){
 const source=images.get(src);if(!source)return;
 const key=src+color;let result=tinted.get(key);if(result)return result;
 // A bounded high-resolution cache keeps antialiased edges soft at small sizes
 // without changing any branches, silhouette, or proportions.
 result=document.createElement('canvas');result.width=result.height=1024;
 const c=result.getContext('2d')!;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 c.drawImage(source,0,0,1024,1024);c.globalCompositeOperation='source-in';c.fillStyle=color;c.fillRect(0,0,1024,1024);
 if(tinted.size>=6){const oldest=tinted.keys().next().value;if(oldest){const old=tinted.get(oldest)!;old.width=old.height=0;tinted.delete(oldest);}}
 tinted.set(key,result);return result;
}
export function drawLifeTree(c:CanvasRenderingContext2D,x:number,y:number,size:number,solid=false,outerStars=true){
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 // Only the four enclosed stars are filled. The tree and outer stars always
 // inherit strokeStyle, independent of the selected hollow-area fill color.
 if(solid){const fill=mask(lifeTreeAssets.holes,String(c.fillStyle));if(fill)c.drawImage(fill,x-size,y-size,size*2,size*2);}
 const ink=mask(outerStars?lifeTreeAssets.stars:lifeTreeAssets.plain,String(c.strokeStyle));
 if(ink)c.drawImage(ink,x-size,y-size,size*2,size*2);c.restore();
}
