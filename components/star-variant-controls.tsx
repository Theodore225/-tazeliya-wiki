"use client";
import {ColorField} from './color-field';
export function StarVariantControls({label,visible,color,bodyColor,onVisible,onColor}:{label:string;visible:boolean;color?:string;bodyColor:string;onVisible:(value:boolean)=>void;onColor:(value:string)=>void}){
 return <div className="star-variant-controls">
  <label className="toggle-row"><span>{label}外围菱形</span><input type="checkbox" checked={visible} onChange={e=>onVisible(e.target.checked)}/><span className="switch"/></label>
  {visible&&<><ColorField label={`${label}菱形颜色`} value={color||bodyColor} onChange={onColor}/><button onClick={()=>onColor('')}>菱形颜色跟随本体</button></>}
  <p className="micro-note">外围菱形默认显示，保持原图形状与实心效果；关闭后本体大小、位置不变。</p>
 </div>;
}
