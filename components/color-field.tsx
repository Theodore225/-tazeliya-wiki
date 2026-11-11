"use client";
import {useEffect,useState} from 'react';
export function ColorField({label,value,onChange,disabled=false}:{label:string;value:string;onChange:(value:string)=>void;disabled?:boolean}){
 const colorLabel=label.endsWith('色')?label:label+'颜色';
 const [draft,setDraft]=useState(value.toUpperCase());
 useEffect(()=>{setDraft(value.toUpperCase())},[value]);
 function commit(){const normalized=/^#[0-9a-f]{6}$/i.test(draft)?draft.toLowerCase():/^#[0-9a-f]{3}$/i.test(draft)?'#'+draft.slice(1).split('').map(c=>c+c).join('').toLowerCase():null;if(!normalized){setDraft(value.toUpperCase());return;}if(normalized!==value.toLowerCase())onChange(normalized);setDraft(normalized.toUpperCase());}
 return <label className="color-field"><span>{label}</span><input type="color" disabled={disabled} aria-label={colorLabel} value={value} onInput={e=>onChange(e.currentTarget.value)} onChange={e=>onChange(e.currentTarget.value)}/><input type="text" disabled={disabled} className="hex-input" aria-label={`${colorLabel}十六进制`} value={draft} maxLength={7} spellCheck={false} autoComplete="off" onChange={e=>{setDraft(e.target.value);if(/^#[0-9a-f]{6}$/i.test(e.target.value))onChange(e.target.value.toLowerCase())}} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur()}}/></label>;
}
