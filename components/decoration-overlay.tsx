"use client";
import {useRef} from 'react';
import {clamp,type Decoration} from '../lib/decorations';
import {motifOptions} from '../lib/motifs';
export function DecorationOverlay({items,selectedId,onSelect,onMove}:{items:Decoration[];selectedId:string|null;onSelect:(id:string)=>void;onMove:(id:string,x:number,y:number)=>void}){
 const root=useRef<HTMLDivElement>(null);const drag=useRef<{id:string;pointer:number;startX:number;startY:number;x:number;y:number}|null>(null);
 return <div ref={root} className="decoration-overlay" aria-label="纸页元素位置编辑">{items.map((e,i)=><button key={e.id} className={e.id===selectedId?'selected':''} aria-label={`移动${motifOptions.find(m=>m.id===e.motif)?.name} ${i+1}`} aria-pressed={e.id===selectedId} style={{left:`${e.x}%`,top:`${e.y}%`,width:`${e.size/760*100}%`}}
 onPointerDown={ev=>{ev.preventDefault();onSelect(e.id);ev.currentTarget.focus({preventScroll:true});ev.currentTarget.setPointerCapture(ev.pointerId);drag.current={id:e.id,pointer:ev.pointerId,startX:ev.clientX,startY:ev.clientY,x:e.x,y:e.y};}}
 onPointerMove={ev=>{const d=drag.current,r=root.current?.getBoundingClientRect();if(!d||!r||d.pointer!==ev.pointerId)return;onMove(e.id,clamp(d.x+(ev.clientX-d.startX)/r.width*100,0,100),clamp(d.y+(ev.clientY-d.startY)/r.height*100,0,100));}}
 onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}}
 onKeyDown={ev=>{const step=ev.shiftKey?5:1;const dx=ev.key==='ArrowLeft'?-step:ev.key==='ArrowRight'?step:0,dy=ev.key==='ArrowUp'?-step:ev.key==='ArrowDown'?step:0;if(dx||dy){ev.preventDefault();onSelect(e.id);onMove(e.id,clamp(e.x+dx,0,100),clamp(e.y+dy,0,100));}}} onClick={()=>onSelect(e.id)}><span>{i+1}</span></button>)}</div>;
}
