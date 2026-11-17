import {artworkManifest,artworkThumbnails} from './artwork-manifest';
export const artworkAsset=(name:string)=>'./optimized/'+artworkManifest[name];
export const thumbnailAsset=(src:string)=>artworkThumbnails[src.split('/').pop()||'']||src;
// Share pending requests as well as decoded images. A failed or timed-out
// request is evicted so the same Retry button can recover it on slow networks.
const requests=new Map<string,Promise<HTMLImageElement>>();
export function loadArtwork(src:string,timeoutMs=15000):Promise<HTMLImageElement>{
 const cached=requests.get(src);if(cached)return cached;
 const pending=new Promise<HTMLImageElement>((resolve,reject)=>{
  const image=new Image();let settled=false;
  const finish=(error?:Error)=>{if(settled)return;settled=true;clearTimeout(timer);image.onload=null;image.onerror=null;error?reject(error):resolve(image);};
  const timer=setTimeout(()=>finish(new Error('纹样载入超时，可重试')),timeoutMs);
  image.decoding='async';image.onload=()=>finish();image.onerror=()=>finish(new Error('纹样未能载入，可重试'));
  image.src=src;
  if(image.decode)void image.decode().then(()=>finish(),()=>finish(new Error('纹样未能载入，可重试')));
 });
 requests.set(src,pending);void pending.catch(()=>{if(requests.get(src)===pending)requests.delete(src);});return pending;
}
