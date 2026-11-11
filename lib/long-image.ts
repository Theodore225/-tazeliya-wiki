import {Zlib} from 'fflate';
import {prepareImages} from './images';
import {fromPlainText} from './rich-text';
import {loadFonts} from './fonts';
import {layoutManuscript,renderTile,type Settings} from './manuscript';
const crcTable=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;crcTable[n]=c>>>0;}
function chunk(type:string,data:Uint8Array){const bytes=new Uint8Array(data.length+12);const view=new DataView(bytes.buffer);view.setUint32(0,data.length);for(let i=0;i<4;i++)bytes[4+i]=type.charCodeAt(i);bytes.set(data,8);let crc=0xffffffff;for(let i=4;i<data.length+8;i++)crc=crcTable[(crc^bytes[i])&255]^(crc>>>8);view.setUint32(data.length+8,(crc^0xffffffff)>>>0);return bytes;}
// Encode PNG progressively in safe-size canvas tiles. No full-height canvas or A4 seams.
export async function exportLongImage(s:Settings,onProgress?:(n:number)=>void,scale=2){
 await loadFonts(s);await prepareImages(s.richText||fromPlainText(s.text));
 const m=layoutManuscript(s,'long'),sheet=m.sheets[0];const width=m.width*scale,height=sheet.height*scale;
 const header=new Uint8Array(13),view=new DataView(header.buffer);view.setUint32(0,width);view.setUint32(4,height);header.set([8,6,0,0,0],8);
 const parts:BlobPart[]=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('sRGB',new Uint8Array([0]))];
 const compressor=new Zlib({level:3},data=>{if(data.length)parts.push(chunk('IDAT',data).buffer as ArrayBuffer)});
 const tileHeight=512;let preview="";
 for(let top=0;top<sheet.height;top+=tileHeight){
 const logicalHeight=Math.min(tileHeight,sheet.height-top);const tile=renderTile(m,sheet,top,logicalHeight,scale);const context=tile.getContext('2d',{willReadFrequently:true})!;
 const rgba=context.getImageData(0,0,tile.width,tile.height).data;const rowBytes=width*4;const filtered=new Uint8Array((rowBytes+1)*tile.height);
 for(let y=0;y<tile.height;y++){const row=y*(rowBytes+1);filtered[row]=0;filtered.set(rgba.subarray(y*rowBytes,(y+1)*rowBytes),row+1);}
 if(top===0)preview=tile.toDataURL("image/png");tile.width=0;compressor.push(filtered,false);onProgress?.(Math.min(99,Math.round((top+logicalHeight)/sheet.height*100)));await new Promise<void>(resolve=>setTimeout(resolve,0));
 }
 compressor.push(new Uint8Array(0),true);parts.push(chunk('IEND',new Uint8Array(0)));onProgress?.(100);
 return {blob:new Blob(parts,{type:'image/png'}),width,height,preview};
}
