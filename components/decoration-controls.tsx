"use client";
import {useEffect,useState} from 'react';
import {Plus,Trash2,Move} from 'lucide-react';
import {motifOptions} from '../lib/motifs';
import {normalizeDecoration,type Decoration} from '../lib/decorations';
import {MotifSwatch} from './motif-swatch';
import {OpacityControl} from './opacity-control';
import {ColorField} from './color-field';
export function DecorationControls({items,selectedId,color,onSelect,onChange}:{items:Decoration[];selectedId:string|null;color:string;onSelect:(id:string|null)=>void;onChange:(items:Decoration[])=>void}){
 const selected=items.find(e=>e.id===selectedId);
 function patch(p:Partial<Decoration>){onChange(items.map(e=>e.id===selectedId?normalizeDecoration({...e,...p}):e));}
 function add(motif:string){const id=crypto.randomUUID();onChange([...items,{id,motif,x:50,y:50,size:80,color,solid:false,opacity:1}]);onSelect(id);}
 return <div className="element-workbench"><div className="section-label"><span>自由搭配元素</span><small>ORNAMENTS</small></div><p className="setting-intro">点击图案添加，可重复添加同一种元素。</p><div className="motif-options element-library">{motifOptions.map(e=><button key={e.id} aria-label={`添加${e.name}`} onClick={()=>add(e.id)}><MotifSwatch id={e.id} color={color}/><span>{e.name}</span><Plus size={12} className="add-mark"/></button>)}</div>
 {items.length>0?<><div className="element-list" aria-label="已添加元素">{items.map((e,i)=><button key={e.id} aria-pressed={e.id===selectedId} onClick={()=>onSelect(e.id)}><MotifSwatch id={e.motif} solid={e.solid} color={e.color}/><span>{motifOptions.find(m=>m.id===e.motif)?.name} {i+1}</span></button>)}</div>{selected?<div className="selected-decoration"><div className="selected-decoration-title"><span><Move size={14}/>调整所选元素</span><button aria-label="删除所选元素" onClick={()=>{onChange(items.filter(e=>e.id!==selectedId));onSelect(null)}}><Trash2 size={14}/>删除</button></div>
 <ColorField label="元素颜色" value={selected.color} onChange={color=>patch({color})}/>
 {([{key:'size',label:'元素大小',unit:'px',min:16,max:240},{key:'x',label:'水平位置',unit:'%',min:0,max:100},{key:'y',label:'垂直位置',unit:'%',min:0,max:100}] as const).map(({key,...props})=><ElementRange key={`${selected.id}-${key}`} id={key} {...props} value={selected[key]} onChange={value=>patch({[key]:value})}/>)}
 <OpacityControl label="元素透明度" value={selected.opacity??1} onChange={opacity=>patch({opacity})}/>
 {selected.motif!=='dragon'&&<label className="toggle-row"><span>所选元素填色 · 实心</span><input type="checkbox" checked={selected.solid} onChange={e=>patch({solid:e.target.checked})}/><span className="switch"/></label>}<p className="micro-note">{selected.motif==='dragon'?'龙首保留原图线条与白色角纹；主体颜色、大小、位置和透明度均可调整，不使用闭合填色。':'可在预览中拖动元素。位置按纸页百分比计算，长图按完整纸页定位。'}</p></div>:<p className="element-empty">选择上方已添加的元素，即可调整。</p>}</>:<div className="element-empty"><Move size={18}/><p>为纸页放入第一枚纹样</p><span>大小、位置与颜色均可独立设置</span></div>}
 </div>;
}

function ElementRange({id,label,unit,min,max,value,onChange}:{id:string;label:string;unit:string;min:number;max:number;value:number;onChange:(value:number)=>void}){
 const [draft,setDraft]=useState(String(Math.round(value)));useEffect(()=>setDraft(String(Math.round(value))),[value]);
 function commit(){const next=draft.trim()===''?value:Math.max(min,Math.min(max,Number(draft)));if(Number.isFinite(next)){onChange(next);setDraft(String(Math.round(next)));}else setDraft(String(Math.round(value)));}
 return <div className="element-range"><div><label htmlFor={`decoration-${id}`}>{label}</label><span><input aria-label={`${label}数值`} type="number" min={min} max={max} value={draft} onChange={e=>{const text=e.target.value;setDraft(text);const n=Number(text);if(text.trim()!==''&&Number.isFinite(n)&&n>=min&&n<=max)onChange(n);}} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur()}}/>{unit}</span></div><input id={`decoration-${id}`} type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/></div>;
}
