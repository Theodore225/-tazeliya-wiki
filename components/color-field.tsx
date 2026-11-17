"use client";
import {useEffect,useRef,useState} from 'react';
import {normalizeHex,hexToHsl,hslToHex,colorPresets,type HSL} from '../lib/color';
export function ColorField({label,value,onChange,disabled=false}:{label:string;value:string;onChange:(value:string)=>void;disabled?:boolean}){
 const colorLabel=label.endsWith('色')?label:label+'颜色';
 const [draft,setDraft]=useState(value.toUpperCase()),[expanded,setExpanded]=useState(false),[hsl,setHsl]=useState(()=>hexToHsl(value));
 const editing=useRef(false),current=useRef(hsl);
 useEffect(()=>{setDraft(value.toUpperCase());if(!editing.current){const next=hexToHsl(value);setHsl(next);current.current=next;}},[value]);
 function select(color:string){editing.current=false;const next=hexToHsl(color);current.current=next;setHsl(next);setDraft(color.toUpperCase());if(color!==value.toLowerCase())onChange(color);}
 function commitHex(){const normalized=normalizeHex(draft);if(normalized)select(normalized);else setDraft(value.toUpperCase());}
 function changeHsl(key:keyof HSL,value:number){if(!Number.isFinite(value))return;editing.current=true;const next={...current.current,[key]:Math.max(0,Math.min(key==='h'?360:100,value))};current.current=next;setHsl(next);}
 function commitHsl(){if(!editing.current)return;editing.current=false;const color=hslToHex(current.current);setDraft(color.toUpperCase());if(color!==value.toLowerCase())onChange(color);}
 const live=hslToHex(hsl);
 return <div className="color-field"><span>{label}</span><input type="color" disabled={disabled} aria-label={colorLabel} value={normalizeHex(value)||'#000000'} onChange={e=>select(e.currentTarget.value)}/><input type="text" disabled={disabled} className="hex-input" aria-label={`${colorLabel}十六进制`} value={draft} maxLength={7} spellCheck={false} autoComplete="off" onChange={e=>setDraft(e.target.value)} onBlur={commitHex} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur()}}/>
 <button type="button" className="color-expand" disabled={disabled} aria-label={`${colorLabel}更多调色`} aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>{expanded?'收起调色':'更多调色 · 色相 / 饱和度 / 明度'}<span aria-hidden="true">{expanded?'−':'+'}</span></button>
 {expanded&&<div className="color-studio" role="group" aria-label={`${colorLabel}调色面板`}>
  <div className="color-live"><span style={{background:live}}/><code>{live.toUpperCase()}</code><small>松开滑杆应用颜色</small></div>
  {([{key:'h',name:'色相',max:360,unit:'°',background:'linear-gradient(90deg,red,#ff0,#0f0,#0ff,#00f,#f0f,red)'},{key:'s',name:'饱和度',max:100,unit:'%',background:`linear-gradient(90deg,hsl(${hsl.h} 0% ${hsl.l}%),hsl(${hsl.h} 100% ${hsl.l}%))`},{key:'l',name:'明度',max:100,unit:'%',background:`linear-gradient(90deg,#000,hsl(${hsl.h} ${hsl.s}% 50%),#fff)`}] as const).map(item=><div className="color-channel" key={item.key}>
   <label>{item.name}<input type="number" aria-label={`${colorLabel}${item.name}数值`} min={0} max={item.max} value={Math.round(hsl[item.key])} onChange={e=>changeHsl(item.key,e.currentTarget.valueAsNumber)} onBlur={commitHsl} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur()}}/><span>{item.unit}</span></label>
   <input type="range" aria-label={`${colorLabel}${item.name}`} min={0} max={item.max} value={Math.round(hsl[item.key])} style={{background:item.background}} onChange={e=>changeHsl(item.key,Number(e.currentTarget.value))} onPointerUp={commitHsl} onPointerCancel={commitHsl} onKeyUp={commitHsl} onBlur={commitHsl}/>
  </div>)}
  <p className="color-preset-heading">常用色 · 点击应用</p><div className="color-presets">{colorPresets.map(p=><button type="button" key={p.hex} title={`${p.name} ${p.hex.toUpperCase()}`} aria-label={`${colorLabel}使用${p.name}`} aria-pressed={value.toLowerCase()===p.hex} onClick={()=>select(p.hex)}><i style={{background:p.hex}}/><span>{p.name}</span></button>)}</div>
 </div>}
 </div>;
}
