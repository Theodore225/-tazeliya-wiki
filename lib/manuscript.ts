import {fontStack,titleFontStack} from './fonts';
import {legacyDecorations,decorationPosition,type Decoration} from './decorations';
import {backgroundArt,mark} from './world-art';
import {worlds} from './worlds';
import {bodyBlocks,fromPlainText,isProfileField,profileTitles,type RichNode,type LocalStyle,type StyledText,type ContentMode} from './rich-text';
import {paperFrame} from './paper-frame';
import {decodedImage} from './images';
import type {Drafts} from './drafts';
export type Settings = { theme:string; font:string; latinFont:string; size:number; leading:number; ornament:string; paper:string; indent:boolean; title:string; subtitle:string; author:string; text:string; country:string; backgroundColor:string; textColor:string; accentColor:string; pattern:string; crest:string; elements:string[]; decorations?:Decoration[]; titleFont:string; borderBandFill:boolean; borderOpacity:number;patternOpacity:number; worldArtVersion?:number; richText?:RichNode; contentMode:ContentMode; templateImported:boolean; documents?:Drafts; borderColor:string; motifColor:string; borderFill:boolean; motifFill:boolean };
export const sample = `## 第一章  沉睡的群星

暮色越过白银山脉的时候，最后一只信鸦落在了窗沿。

少年放下手中的羽毛笔。风从半掩的窗扉间穿过，拂动桌上那些泛黄的书页，也带来远方森林里潮湿的松木气息。

> 「每一颗熄灭的星辰，都会在某个人的梦里重新亮起。」

这是母亲留给他的最后一句话。

***

他翻开那本没有署名的古书。封皮上的银色纹路在月光下缓缓浮现，像一条终于苏醒的河流。

书页的深处，有什么正在轻轻呼唤他的名字。

而属于他的故事，才刚刚开始。`;
export const defaults:Settings={theme:'antique',font:'serif',latinFont:'classic',size:20,leading:1.85,ornament:'botanical',paper:'parchment',indent:true,title:'星辰的余响',subtitle:'THE ECHOES OF STARS',author:'佚名 · 北境纪事',text:sample,country:'none',backgroundColor:'',textColor:'',accentColor:'',pattern:'plain',crest:'moon',elements:[],titleFont:'serif',borderBandFill:false,borderOpacity:1,patternOpacity:.08,contentMode:'content',templateImported:false,borderColor:'',motifColor:'',borderFill:false,motifFill:false};
export const themes=[
 {id:'antique',name:'失落古籍',desc:'旧纸、墨迹与时光',en:'THE ANCIENT ARCHIVE',bg:'#f1e5cb',ink:'#453c2b',accent:'#947541'},
 {id:'astral',name:'星月手札',desc:'深蓝夜幕与银色星轨',en:'THE CELESTIAL GRIMOIRE',bg:'#202c3d',ink:'#e3dfd3',accent:'#b8a77d'},
 {id:'royal',name:'王国公文',desc:'象牙白纸与绯红印记',en:'THE ROYAL CHANCERY',bg:'#f7f3e9',ink:'#403b36',accent:'#894c49'}
];
export function getPalette(s:Settings){const t=themes.find(t=>t.id===s.theme)||themes[0];return{bg:s.backgroundColor|| (s.paper==='white'?(s.theme==='astral'?'#283448':'#fffdf8'):t.bg),ink:s.textColor||t.ink,accent:s.accentColor||t.accent};}
export function worldSettings(id:string):Partial<Settings>{const w=worlds.find(w=>w.id===id)||worlds[0];return {country:w.id,worldArtVersion:2,ornament:w.ornament||defaults.ornament,theme:w.theme,backgroundColor:w.color,textColor:w.ink,accentColor:w.accent,pattern:w.pattern,crest:w.crest,elements:[...w.elements],decorations:legacyDecorations(w.elements,w.accent).map(e=>({...e,opacity:.35}))};}
export type TextRun=LocalStyle&{text:string;x:number;y:number;size:number;bold?:boolean;accent?:boolean;align?:CanvasTextAlign;quote?:boolean;maxWidth?:number;image?:{src:string;alt:string;width:number;height:number}};
export type Sheet={height:number;runs:TextRun[];number:number;first:boolean};
export type Manuscript={s:Settings;mode:'pages'|'long';sheets:Sheet[];width:number};
export function layoutManuscript(s:Settings,mode:'pages'|'long'='pages'):Manuscript{
 const W=760,H=1075,left=94,right=W-94,bottom=H-100;
 const measure=document.createElement('canvas').getContext('2d')!;const family=fontStack(s),titleFamily=titleFontStack(s);
 const sheets:Sheet[]=[{height:H,runs:[],number:1,first:true}];let sheet=sheets[0],y=0;
 function font(size:number,bold=false,face=family){measure.font=`${bold?'700 ':''}${size}px ${face}`;}
 function wrap(text:string,width:number,size:number,bold=false,indent=0,face=family){font(size,bold,face);const result:string[]=[];let row='',isFirst=true;
 const tokens=text.match(/[A-Za-z0-9]+(?:['’\-][A-Za-z0-9]+)*|[^\x00-\x7F]|\s+|./gu)||[];
 function pushToken(token:string){const limit=width-(isFirst?indent:0);if(row&&measure.measureText(row+token).width>limit){if(/^[，。！？；：、）》」』】]/.test(token)){row+=token;result.push(row);row='';}else{result.push(row.trimEnd());row=token.trimStart();}isFirst=false;}else row+=token;}
 for(const token of tokens){if(measure.measureText(token).width>width-indent){for(const ch of Array.from(token))pushToken(ch)}else pushToken(token)}if(row)result.push(row.trimEnd());return result;
 }
 function add(run:TextRun){sheet.runs.push(run)}
 function ensure(height:number){if(mode==='pages'&&y+height>bottom){sheet={height:H,runs:[],number:sheets.length+1,first:false};sheets.push(sheet);y=115;}}
 let titleY=s.crest==='none'?144:190;
 for(const row of wrap(s.title||'无题手稿',W-188,38,true,0,titleFamily)){add({text:row,x:W/2,y:titleY,size:38,bold:true,fontFamily:titleFamily,align:'center'});titleY+=52;}
 const subSize=(s.latinFont==='script'||s.latinFont==='parisienne')?23:s.latinFont==='gothic'?18:12;
 for(const row of wrap(s.subtitle, W-210,subSize)){add({text:row,x:W/2,y:titleY+4,size:subSize,accent:true,align:'center'});titleY+=subSize*1.55;}
 // Separator is stored as a draw run so title height remains exact in long exports.
 add({text:'__separator__',x:W/2,y:titleY+25,size:0,accent:true});y=titleY+82;
 const blocks=bodyBlocks(s.richText||fromPlainText(s.text));
 for(const block of blocks){
 if(block.kind==='image'&&block.image){
 const a=block.image;const percent=Math.max(20,Math.min(100,Number(a.widthPercent)||100));
 let width=(right-left)*percent/100,height=width*(Number(a.height)||1)/(Number(a.width)||1);
 if(mode==='pages'&&height>bottom-115-24){const ratio=(bottom-115-24)/height;width*=ratio;height*=ratio;}
 ensure(height+24);const x=a.alignment==='left'?left:a.alignment==='right'?right-width:(W-width)/2;
 add({text:'__image__',x,y,size:0,image:{src:String(a.src||''),alt:String(a.alt||'正文图片'),width,height}});y+=height+24;continue;
 }
 const text=block.spans.map(span=>span.text).join('');
 if(block.kind==='divider'){ensure(42);add({text:'__separator__',x:W/2,y:y+8,size:0,accent:true});y+=42;continue;}
 if(!text.trim()){y+=s.size*.42;continue;}
 const heading=block.kind==='heading',quote=block.kind==='quote';
 const profileRow=s.contentMode!=='content'&&isProfileField(text);
 const profileHead=Object.values(profileTitles).includes(text)||text==='——————————';
 const size=heading?s.size+(block.level===3?2:5):s.size;
 const indent=!heading&&!quote&&!profileHead&&s.indent?size*2:0;
 const lh=size*(profileRow||profileHead?1.45:heading?1.6:s.leading);
 const available=right-left-(quote?32:0);let row: {text:string;style:LocalStyle;width:number}[]=[],width=0,first=true;
 const rows:{text:string;style:LocalStyle;width:number}[][]=[];
 function fontFor(style:LocalStyle){measure.font=`${style.italic?'italic ':''}${style.bold||heading?'700 ':''}${size}px ${style.fontFamily||family}`;}
 function finishRow(){rows.push(row);row=[];width=0;first=false;}
 function push(text:string,style:LocalStyle){
 if(text==='\n'){finishRow();return;}
 fontFor(style);const tw=measure.measureText(text).width;
 if(tw>available-(first?indent:0)&&Array.from(text).length>1){for(const ch of Array.from(text))push(ch,style);return;}
 const closing=/^[，。！？；：、）》」』】]/.test(text);
 if(row.length&&width+tw>available-(first?indent:0)&&!closing)finishRow();
 const tail=row[row.length-1];if(tail&&JSON.stringify(tail.style)===JSON.stringify(style)){const old=tail.width;tail.text+=text;tail.width=measure.measureText(tail.text).width;width+=tail.width-old;}else{row.push({text,style,width:tw});width+=tw;}
 if(closing&&width>available-(first?indent:0))finishRow();
 }
 // Split whitespace into individual wrapping opportunities. Consecutive spaces
 // stay where the user typed them instead of moving together to the last line.
 for(const span of block.spans)for(const token of span.text.match(/[A-Za-z0-9]+(?:['’\-][A-Za-z0-9]+)*|\n|[^\x00-\x7F]|[^\S\n]|./gu)||[])push(token,span.style);
 if(row.length)rows.push(row);
 if(heading){ensure(lh*2.4);y+=10;}
 for(let i=0;i<rows.length;i++){
 ensure(lh);const rowWidth=rows[i].reduce((sum,piece)=>sum+piece.width,0);
 let x=profileHead?(W-rowWidth)/2:left+(quote?20:0)+(i===0?indent:0);
 for(let j=0;j<rows[i].length;j++){const piece=rows[i][j];add({text:piece.text,x,y,size,accent:quote,quote:quote&&j===0,...piece.style,bold:piece.style.bold||heading});x+=piece.width;}
 y+=lh;
 }
 y+=profileRow||profileHead?3:heading?12:s.size*.5;
 }
 if(mode==='long')sheet.height=Math.max(H,Math.ceil(y+110));
 measure.canvas.width=0;
 return {s:{...s,elements:[...s.elements]},mode,sheets,width:W};
}
function dark(hex:string){const v=hex.replace('#','');return(parseInt(v.slice(0,2),16)*.299+parseInt(v.slice(2,4),16)*.587+parseInt(v.slice(4,6),16)*.114)<110;}
export function paintSheet(c:CanvasRenderingContext2D,m:Manuscript,sheet:Sheet,clipTop=0,clipHeight=sheet.height){
 const s=m.s,{bg,ink,accent}=getPalette(s),W=m.width,H=sheet.height,family=fontStack(s);
 const line=(x:number,y:number,xx:number,yy:number)=>{c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()};
 function divider(y:number){c.save();c.strokeStyle=accent;c.fillStyle=accent;c.lineWidth=.65;line(W/2-78,y,W/2-15,y);line(W/2+15,y,W/2+78,y);for(const [x,r] of [[W/2,3],[W/2-9,1],[W/2+9,1]]){c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillRect(-r,-r,r*2,r*2);c.restore()}c.restore();}
 c.fillStyle=bg;c.fillRect(0,0,W,H);
 if(s.paper!=='white'){
 const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,dark(bg)?'#00000022':'#553c2115');g.addColorStop(.5,'#ffffff08');g.addColorStop(1,dark(bg)?'#00000022':'#553c2115');c.fillStyle=g;c.fillRect(0,0,W,H);
 let seed=71+Math.floor(clipTop)*13;for(let i=0;i<Math.ceil(clipHeight*14);i++){seed=(seed*16807)%2147483647;const x=seed%W;seed=(seed*16807)%2147483647;const yy=clipTop+seed%Math.ceil(clipHeight);c.fillStyle=i%2?'#64503409':'#ffffff12';c.fillRect(x,yy,s.paper==='linen'?2:1,s.paper==='linen'?.5:1);}
 if(s.paper==='linen'){c.strokeStyle='#ffffff09';c.lineWidth=.5;for(let x=0;x<W;x+=4)line(x,clipTop,x,clipTop+clipHeight);for(let yy=Math.floor(clipTop/4)*4;yy<clipTop+clipHeight;yy+=4)line(0,yy,W,yy);}
 }
 backgroundArt(c,s.pattern,[],W,H,s.motifColor||accent,s.patternOpacity??.08,clipTop,clipHeight,s.motifFill);
 for(const e of s.decorations||legacyDecorations(s.elements,s.motifColor||accent,s.motifFill)){const p=decorationPosition(e,W,H);if(p.y+p.size<clipTop||p.y-p.size>clipTop+clipHeight)continue;c.save();c.globalAlpha=e.opacity??1;c.strokeStyle=e.color;c.fillStyle=e.color;mark(c,e.motif,p.x,p.y,p.size/2,e.solid);c.restore();}
 c.strokeStyle=accent;c.fillStyle=accent;
 c.save();c.globalAlpha=s.borderOpacity??1;paperFrame(c,s.ornament,W,H,s.borderColor||accent,s.borderFill,s.borderBandFill);c.restore();
 const world=worlds.find(w=>w.id===s.country);c.font=`10px ${family}`;c.fillStyle=accent;c.textAlign='center';c.fillText(s.country==='none'?(themes.find(t=>t.id===s.theme)||themes[0]).en:`${world?.name||'旅人'} · 典藏手稿`,W/2,69,W-180);
 if(sheet.first&&s.crest!=='none'){c.strokeStyle=s.motifColor||accent;c.fillStyle=s.motifColor||accent;c.lineWidth=.9;mark(c,s.crest,W/2,119,27,s.motifFill);}
 c.globalAlpha=1;c.globalCompositeOperation='source-over';
 for(const run of sheet.runs){
 if(run.image){const im=run.image;if(run.y+im.height<clipTop||run.y>clipTop+clipHeight)continue;const source=decodedImage(im.src);if(source)c.drawImage(source,run.x,run.y,im.width,im.height);else{c.save();c.strokeStyle=accent;c.strokeRect(run.x,run.y,im.width,im.height);c.fillStyle=ink;c.font=`14px ${family}`;c.textAlign='center';c.fillText('图片暂不可用 · 请重新插入',run.x+im.width/2,run.y+Math.min(im.height/2,40));c.restore();}continue;}
 if(run.y<clipTop-80||run.y>clipTop+clipHeight+80)continue;if(run.text==='__separator__'){divider(run.y);continue;}c.font=`${run.italic?'italic ':''}${run.bold?'700 ':''}${run.size}px ${run.fontFamily||family}`;c.fillStyle=run.color||(run.accent?accent:ink);c.textAlign=run.align||'left';c.textBaseline='alphabetic';if(run.highlight){const width=c.measureText(run.text).width;const x=run.align==='center'?run.x-width/2:run.align==='right'?run.x-width:run.x;c.fillStyle=run.highlight;c.fillRect(x,run.y-run.size*.88,width+.5,run.size*1.18);c.fillStyle=run.color||(run.accent?accent:ink);}if(run.quote){c.strokeStyle=accent;c.lineWidth=1.3;line(97,run.y-run.size,97,run.y+run.size*.45)}if(run.maxWidth)c.fillText(run.text,run.x,run.y,run.maxWidth);else c.fillText(run.text,run.x,run.y);if(run.underline){c.strokeStyle=run.color||(run.accent?accent:ink);c.lineWidth=Math.max(.8,run.size/20);line(run.x,run.y+3,run.x+c.measureText(run.text).width,run.y+3);}}
 c.font=`13px ${family}`;c.textAlign='center';c.fillStyle=accent;c.fillText(s.author,W/2,H-67,W-188);if(m.mode==='pages'){c.font=`11px ${family}`;c.fillText(String(sheet.number).padStart(2,'0'),W/2,H-47);}
}
export function renderTile(m:Manuscript,sheet:Sheet,top=0,height=sheet.height,scale=2){
 const c=document.createElement('canvas');c.width=Math.round(m.width*scale);c.height=Math.round(height*scale);const ctx=c.getContext('2d',{colorSpace:'srgb',alpha:false});if(!ctx)throw Error('Canvas unavailable');ctx.scale(scale,scale);ctx.translate(0,-top);paintSheet(ctx,m,sheet,top,height);return c;
}
export function renderManuscript(s:Settings){const m=layoutManuscript(s);return m.sheets.map(sheet=>{const c=renderTile(m,sheet);const image=c.toDataURL('image/png');c.width=0;return image;});}
