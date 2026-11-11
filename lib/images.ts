import type {RichNode} from './rich-text';
const objectUrls=new Map<string,string>();
const decoded=new Map<string,HTMLImageElement>();
let database:Promise<IDBDatabase>|undefined;
function db(){return database??=new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('arcane-scriptorium-images',1);request.onupgradeneeded=()=>request.result.createObjectStore('images');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('浏览器未能保存图片，请检查储存权限。'));});}
async function readBlob(id:string):Promise<Blob|undefined>{const database=await db();return new Promise((resolve,reject)=>{const r=database.transaction('images','readonly').objectStore('images').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function imageUrl(id:string){if(objectUrls.has(id))return objectUrls.get(id)!;const blob=await readBlob(id);if(!blob)return '';const url=URL.createObjectURL(blob);objectUrls.set(id,url);return url;}
export async function importImage(file:File){
 if(!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type))throw new Error('请选择 PNG、JPEG、WebP、GIF 或 AVIF 图片。');
 if(file.size>20*1024*1024)throw new Error('单张原图请小于 20 MB。');
 const url=URL.createObjectURL(file);const image=new Image();image.src=url;
 try{await image.decode();const ratio=Math.min(1,1400/image.naturalWidth,2000/image.naturalHeight);const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));const ctx=canvas.getContext('2d')!;ctx.drawImage(image,0,0,canvas.width,canvas.height);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('图片处理失败。')),'image/webp',.88));
 const assetId=crypto.randomUUID();const database=await db();await new Promise<void>((resolve,reject)=>{const tx=database.transaction('images','readwrite');tx.objectStore('images').put(blob,assetId);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('本机储存空间不足，未插入图片。'));tx.onabort=()=>reject(new Error('未能保存图片，请重试。'));});
 return{assetId,src:await imageUrl(assetId),alt:file.name.replace(/\.[^.]+$/,''),width:canvas.width,height:canvas.height,widthPercent:100,alignment:'center'};
 }finally{URL.revokeObjectURL(url);}
}
// Runtime blob URLs never enter the persistent JSON. Image bytes live in IndexedDB.
export function stripImageUrls<T>(value:T):T{return JSON.parse(JSON.stringify(value,(_key,v)=>v?.type==='image'&&v.attrs?.assetId?{...v,attrs:{...v.attrs,src:''}}:v));}
export async function restoreImageUrls<T>(value:T):Promise<T>{const copy=structuredClone(value);async function visit(v:unknown):Promise<void>{if(!v||typeof v!=='object')return;const o=v as Record<string,unknown>;if(o.type==='image'&&o.attrs){const a=o.attrs as Record<string,unknown>;if(typeof a.assetId==='string')a.src=await imageUrl(a.assetId).catch(()=>'');}await Promise.all(Object.values(o).filter(v=>v&&typeof v==='object').map(visit));}await visit(copy);return copy;}
export async function prepareImages(doc:RichNode){const sources=new Set<string>();function visit(n:RichNode){if(n.type==='image'&&typeof n.attrs?.src==='string'&&n.attrs.src)sources.add(n.attrs.src);n.content?.forEach(visit)}visit(doc);await Promise.all([...sources].map(async src=>{if(decoded.has(src))return;const image=new Image();image.src=src;try{await image.decode();decoded.set(src,image)}catch{throw new Error('正文图片未能载入，请重新插入该图片。')}}));}
export function decodedImage(src:string){return decoded.get(src)}
