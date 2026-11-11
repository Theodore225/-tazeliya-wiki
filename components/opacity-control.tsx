"use client";
export function OpacityControl({label,value,onChange}:{label:string;value:number;onChange:(value:number)=>void}){
 const opacity=Number.isFinite(value)?Math.max(0,Math.min(1,value)):1;
 return <div className="opacity-control"><div className="range-heading"><label>{label}</label><output>{Math.round((1-opacity)*100)}%</output></div><input aria-label={label} type="range" min="0" max="100" step="1" value={Math.round((1-opacity)*100)} onChange={e=>onChange(1-Number(e.target.value)/100)}/><div className="opacity-endpoints"><span>不透明</span><span>全透明</span></div></div>;
}
