// These masks contain the supplied pixels, never an automatically traced path.
// White paper in the four star references is transparent in the masks. Existing
// holes in all seven designs stay transparent, even when other motifs are solid.
export const suppliedArtAssets={
 star1:'./artwork/star-1.png',star1Ring:'./artwork/star-1-ring.png',
 star2:'./artwork/star-2.png',star2Ring:'./artwork/star-2-ring.png',
 gnosis:'./artwork/gnosis.png',yierda:'./artwork/yierda.png',esir:'./artwork/esir.png'
};
export const regionArt:Record<string,string>={
 'scholar-orbit':suppliedArtAssets.gnosis,
 'shelter-garden':suppliedArtAssets.yierda,
 'sacred-sun':suppliedArtAssets.esir
};
export const isEightPointStar=(id:string)=>id==='stars'||id==='stars2';
export const isSuppliedRegion=(pattern:string)=>!!regionArt[pattern];
export function starLayers(id:string){return id==='stars2'
 ?{body:suppliedArtAssets.star2,ring:suppliedArtAssets.star2Ring}
 :{body:suppliedArtAssets.star1,ring:suppliedArtAssets.star1Ring};}
const images=new Map<string,HTMLImageElement>();
const tinted=new Map<string,HTMLCanvasElement>();
let loading:Promise<void>|undefined;
export function prepareSuppliedArt(){
 if(typeof Image==='undefined')return Promise.resolve();
 if(!loading)loading=Promise.all(Object.values(suppliedArtAssets).map(async src=>{
  const image=new Image();image.src=src;await image.decode();images.set(src,image);
 })).then(()=>{}).catch(error=>{loading=undefined;throw error;});
 return loading;
}
function mask(src:string,color:string){
 const key=src+color,existing=tinted.get(key);if(existing)return existing;
 const source=images.get(src);if(!source)return;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1280;
 const c=canvas.getContext('2d')!;c.drawImage(source,0,0,1280,1280);
 c.globalCompositeOperation='source-in';c.fillStyle=color;c.fillRect(0,0,1280,1280);
 if(tinted.size>=8){const oldest=tinted.keys().next().value;if(oldest){const old=tinted.get(oldest)!;old.width=old.height=0;tinted.delete(oldest);}}
 tinted.set(key,canvas);return canvas;
}
function draw(c:CanvasRenderingContext2D,src:string,color:string,x:number,y:number,size:number){
 const ink=mask(src,color);if(ink)c.drawImage(ink,x-size,y-size,size*2,size*2);
}
export function drawEightPointStar(c:CanvasRenderingContext2D,id:string,x:number,y:number,size:number,outerDiamonds=true,diamondColor?:string){
 const layers=starLayers(id),color=String(c.strokeStyle);
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 draw(c,layers.body,color,x,y,size);
 if(outerDiamonds)draw(c,layers.ring,diamondColor||color,x,y,size);
 c.restore();
}
export function drawSuppliedRegion(c:CanvasRenderingContext2D,pattern:string,x:number,y:number,size:number){
 const src=regionArt[pattern];if(!src)return;
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 draw(c,src,String(c.strokeStyle),x,y,size);c.restore();
}
