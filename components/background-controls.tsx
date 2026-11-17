"use client";
import {backgroundTransform} from '../lib/world-art';
export function BackgroundControls({scale=100,x=50,y=50,onChange}:{scale?:number;x?:number;y?:number;onChange:(patch:{patternScale?:number;patternX?:number;patternY?:number})=>void}){
 const value=backgroundTransform({scale,x,y});
 return <div className="background-controls"><p className="field-label ornament-label">背景纹样大小与位置</p>
  {([{key:'patternScale',label:'背景纹样大小',value:Math.round(value.scale*100),min:20,max:200},{key:'patternX',label:'背景水平位置',value:value.x,min:0,max:100},{key:'patternY',label:'背景垂直位置',value:value.y,min:0,max:100}] as const).map(item=><div className="element-range" key={item.key}><div><label htmlFor={item.key}>{item.label}</label><span><input type="number" aria-label={`${item.label}数值`} min={item.min} max={item.max} value={item.value} onChange={e=>{const n=e.currentTarget.valueAsNumber;if(Number.isFinite(n))onChange({[item.key]:Math.max(item.min,Math.min(item.max,n))});}}/>%</span></div><input id={item.key} type="range" min={item.min} max={item.max} value={item.value} onChange={e=>onChange({[item.key]:Number(e.currentTarget.value)})}/></div>)}
  <button className="palette-reset" onClick={()=>onChange({patternScale:100,patternX:50,patternY:50})}>恢复背景大小与位置</button><p className="micro-note">50% 为默认位置。调整作用于整组背景纹样，长图会沿纵向重复；预览和导出保持一致。</p>
 </div>;
}
