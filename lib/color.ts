export type HSL={h:number;s:number;l:number};
const clamp=(v:number,max:number)=>Math.max(0,Math.min(max,Number.isFinite(v)?v:0));
export function normalizeHex(value:string){const v=value.trim();return /^#[0-9a-f]{6}$/i.test(v)?v.toLowerCase():/^#[0-9a-f]{3}$/i.test(v)?'#'+v.slice(1).split('').map(c=>c+c).join('').toLowerCase():null;}
export function hexToHsl(hex:string):HSL{
 const v=normalizeHex(hex)||'#000000';const [r,g,b]=[1,3,5].map(i=>parseInt(v.slice(i,i+2),16)/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;
 const h=d===0?0:((max===r?(g-b)/d+(g<b?6:0):max===g?(b-r)/d+2:(r-g)/d+4)*60);
 return {h,s:d===0?0:d/(1-Math.abs(2*l-1))*100,l:l*100};
}
export function hslToHex({h,s,l}:HSL){
 h=((Number.isFinite(h)?h:0)%360+360)%360;s=clamp(s,100)/100;l=clamp(l,100)/100;
 const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs(h/60%2-1)),m=l-c/2;
 const rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
 return '#'+rgb.map(n=>Math.round((n+m)*255).toString(16).padStart(2,'0')).join('');
}
export const colorPresets=[
 {name:'克莱因蓝',hex:'#002fa7'},{name:'电光蓝',hex:'#2962ff'},{name:'湖水蓝',hex:'#39b8db'},
 {name:'孔雀绿',hex:'#007f78'},{name:'翡翠绿',hex:'#00a884'},{name:'鼠尾草绿',hex:'#a8b79b'},
 {name:'紫罗兰',hex:'#7f3fbf'},{name:'薰衣草紫',hex:'#b7a0d6'},{name:'莓果红',hex:'#a52053'},
 {name:'朱红',hex:'#ef4035'},{name:'珊瑚粉',hex:'#f17f85'},{name:'玫瑰灰',hex:'#bb8f98'},
 {name:'亮金',hex:'#e8b94f'},{name:'琥珀橙',hex:'#e99524'},{name:'香槟金',hex:'#d6be89'},
 {name:'月光银',hex:'#c7d1dc'},{name:'象牙白',hex:'#f8f1df'},{name:'墨黑',hex:'#20242d'}
] as const;
