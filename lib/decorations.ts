import {motifId,motifOptions} from './motifs';
export type Decoration={id:string;motif:string;x:number;y:number;size:number;color:string;solid:boolean;opacity?:number};
export const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function legacyDecorations(elements:string[],color:string,solid=false):Decoration[]{
 return elements.map((motif,i)=>({id:`legacy-${i}`,motif:motifId(motif),x:i%2?91:9,y:23+Math.floor(i/2)*15,size:54,color,solid,opacity:1})).filter(e=>motifOptions.some(m=>m.id===e.motif));
}
export function normalizeDecoration(e:Decoration):Decoration{
 const number=(n:number,fallback:number,min:number,max:number)=>clamp(Number.isFinite(Number(n))?Number(n):fallback,min,max);
 return {...e,motif:motifId(e.motif),x:number(e.x,50,0,100),y:number(e.y,50,0,100),size:number(e.size,64,16,240),color:/^#[0-9a-f]{6}$/i.test(e.color)?e.color:'#947541',solid:!!e.solid,opacity:number(e.opacity??1,1,0,1)};
}
export function migrateDecorations<T extends {decorations?:Decoration[];elements:string[];motifColor:string;motifFill:boolean}>(s:T,color:string):T{
 return {...s,decorations:Array.isArray(s.decorations)?s.decorations.map(normalizeDecoration).filter(e=>motifOptions.some(m=>m.id===e.motif)):legacyDecorations(s.elements,s.motifColor||color,s.motifFill)};
}
export function decorationPosition(e:Decoration,w:number,h:number){return {x:w*e.x/100,y:h*e.y/100,size:e.size};}
