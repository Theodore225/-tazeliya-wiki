export type RichMark={type:string;attrs?:Record<string,unknown>};
export type RichNode={type:string;attrs?:Record<string,unknown>;content?:RichNode[];text?:string;marks?:RichMark[]};
export type LocalStyle={bold?:boolean;italic?:boolean;underline?:boolean;highlight?:string;color?:string;fontFamily?:string};
export type StyledText={text:string;style:LocalStyle};
export type BodyBlock={kind:'paragraph'|'heading'|'quote'|'divider'|'image';level?:number;image?:Record<string,unknown>;spans:StyledText[]};
export type ContentMode='content'|'profile'|'full-profile';
export const profileFields=['姓名：','性别：','年龄/表龄：','身高：','种族：','外貌：','职位：','身份：','国籍：','等级：','专长：','加成：','总点数：','武器：','背景：','备注：'];
export const profileTitles={profile:'———人设表———','full-profile':'——完整人设表——'};
export function opaqueColor(value:unknown):string|undefined{
 if(typeof value!=='string')return;const v=value.trim();
 if(/^#[0-9a-f]{6}$/i.test(v))return v.toLowerCase();
 if(/^#[0-9a-f]{3}$/i.test(v))return '#'+v.slice(1).split('').map(c=>c+c).join('').toLowerCase();
 const rgb=v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i);if(rgb)return '#'+rgb.slice(1,4).map(n=>Math.min(255,+n).toString(16).padStart(2,'0')).join('');
}
export function safeFont(value:unknown){if(typeof value!=='string')return;const fonts=value.split(',').map(v=>v.trim().replace(/["']/g,'')).filter(v=>/^Arcane[A-Za-z]+$/.test(v)).map(v=>`"${v}"`).join(', ');return fonts?fonts+', "ArcaneSerif", serif':undefined;}
export function fromPlainText(text:string):RichNode{
 const content:RichNode[]=text.replace(/\r\n?/g,'\n').split('\n').map(line=>{
 const heading=line.match(/^(#{1,3})\s+(.+)$/);const quote=line.match(/^>(.*)$/);
 if(/^(\*\*\*|---|___|✦)$/.test(line.trim()))return{type:'horizontalRule'};
 const value=heading?heading[2]:quote?quote[1]:line;const inline=value?[{type:'text',text:value}]:[];
 if(heading)return{type:'heading',attrs:{level:Math.max(2,heading[1].length)},content:inline};
 if(quote)return{type:'blockquote',content:[{type:'paragraph',content:inline}]};
 return {type:'paragraph',content:inline};
 });return {type:'doc',content};
}
export function plainNode(node:RichNode):string{if(node.type==='image')return `[图片：${String(node.attrs?.alt||'正文图片')}]`;if(node.type==='text')return node.text||'';if(node.type==='hardBreak')return '\n';return(node.content||[]).map(plainNode).join('');}
export function toPlainText(doc:RichNode):string{return(doc.content||[]).map(n=>n.type==='horizontalRule'?'***':n.type==='heading'?'#'.repeat(Number(n.attrs?.level)||2)+' '+plainNode(n):n.type==='blockquote'? '>'+plainNode(n):plainNode(n)).join('\n');}
export function needsQuoteIndent(text:string){return !/^[\s\u00a0\u3000]/u.test(text)}
export function styleFromMarks(marks:RichMark[]=[]):LocalStyle{const style:LocalStyle={};for(const mark of marks){if(mark.type==='bold')style.bold=true;if(mark.type==='italic')style.italic=true;if(mark.type==='underline')style.underline=true;if(mark.type==='highlight')style.highlight=opaqueColor(mark.attrs?.color)||'#ffff00';if(mark.type==='textStyle'){style.color=opaqueColor(mark.attrs?.color);style.fontFamily=safeFont(mark.attrs?.fontFamily)}}return style;}
export function styledInline(node:RichNode,inherited:LocalStyle={}):StyledText[]{
 if(node.type==='text')return[{text:node.text||'',style:{...inherited,...styleFromMarks(node.marks)}}];
 if(node.type==='hardBreak')return[{text:'\n',style:inherited}];
 return(node.content||[]).flatMap(n=>styledInline(n,inherited));
}
export function bodyBlocks(doc:RichNode):BodyBlock[]{const out:BodyBlock[]=[];for(const n of doc.content||[]){if(n.type==='image')out.push({kind:'image',image:n.attrs,spans:[]});else if(n.type==='horizontalRule')out.push({kind:'divider',spans:[]});else if(n.type==='blockquote'){for(const p of n.content||[])out.push({kind:'quote',spans:styledInline(p)});}else if(n.type==='heading')out.push({kind:'heading',level:Number(n.attrs?.level)||2,spans:styledInline(n)});else if(n.type==='paragraph')out.push({kind:'paragraph',spans:styledInline(n)});else if(n.content)out.push(...bodyBlocks({type:'doc',content:n.content}));}return out;}
export function profileTemplate(mode:'profile'|'full-profile'):RichNode{
 const label=(text:string):RichNode=>({type:'paragraph',content:[{type:'text',text,marks:[{type:'bold'}]}]});
 return{type:'doc',content:[label(profileTitles[mode]),...profileFields.map(text=>({type:'paragraph',content:[{type:'text',text,marks:[{type:'bold'}]},{type:'text',text:' '}]})),label('——————————'),{type:'paragraph'}]};
}
export function isProfileField(text:string){return profileFields.some(label=>text.startsWith(label));}
