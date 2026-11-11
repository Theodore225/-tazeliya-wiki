import type {Settings} from './manuscript';
export const chineseFonts=[{id:'serif',family:'ArcaneSerif',name:'思源宋体 · 古籍正文',preview:'山川与星河'},{id:'sans',family:'ArcaneSans',name:'思源黑体 · 清晰正文',preview:'山川与星河'},{id:'kai',family:'ArcaneBrush',name:'马善政手书 · 旅人笔迹',preview:'山川与星河'},{id:'xiaowei',family:'ArcaneXiaowei',name:'站酷小薇 · 典雅书卷',preview:'山川与星河'},{id:'wenkai',family:'ArcaneWenkai',name:'霞鹜文楷 · 端正楷书',preview:'山川与星河'},{id:'rounded',family:'ArcaneRounded',name:'庆科黄油 · 圆润标题',preview:'山川与星河'},{id:'cursive',family:'ArcaneCursive',name:'流江毛草 · 自由草书',preview:'山川与星河'}];
export const latinFonts=[{id:'classic',family:'ArcaneRoman',name:'古典装饰体 · Cinzel',preview:'Echoes of Stars'},{id:'script',family:'ArcaneScript',name:'连笔花体 · Great Vibes',preview:'Echoes of Stars'},{id:'gothic',family:'ArcaneGothic',name:'哥特花体 · Blackletter',preview:'Echoes of Stars'},{id:'book',family:'ArcaneBook',name:'古典书籍体 · Cormorant',preview:'Echoes of Stars'},{id:'parisienne',family:'ArcaneParisienne',name:'优雅花体 · Parisienne',preview:'Echoes of Stars'}];
export function fontStack(s:Settings){return `"${(latinFonts.find(f=>f.id===s.latinFont)||latinFonts[0]).family}", "${(chineseFonts.find(f=>f.id===s.font)||chineseFonts[0]).family}", "ArcaneSerif", serif`;}
export function titleFontStack(s:Settings){return fontStack({...s,font:s.titleFont||s.font});}
export async function loadFonts(s:Settings){
 const families=new Set(['ArcaneSerif',(chineseFonts.find(f=>f.id===s.titleFont)||chineseFonts[0]).family,(chineseFonts.find(f=>f.id===s.font)||chineseFonts[0]).family,(latinFonts.find(f=>f.id===s.latinFont)||latinFonts[0]).family]);
 function visit(node:{marks?:{attrs?:Record<string,unknown>}[];content?:unknown[]}){for(const mark of node.marks||[]){const stack=String(mark.attrs?.fontFamily||'');for(const f of [...chineseFonts,...latinFonts])if(stack.includes(f.family))families.add(f.family);}for(const child of node.content||[])visit(child as typeof node);}
 if(s.richText)visit(s.richText);
 const results=await Promise.all([...families].flatMap(family=>[400,700].map(weight=>document.fonts.load(`${weight} 20px "${family}"`,chineseFonts.some(f=>f.family===family)?'群星森林':'Echoes'))));
 if(results.some(fonts=>fonts.length===0))throw Error('Font unavailable');
}
