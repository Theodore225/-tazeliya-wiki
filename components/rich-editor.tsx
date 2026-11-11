"use client";
import {useEditor,EditorContent,Mark,type JSONContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BoldExtension from '@tiptap/extension-bold';
import ImageExtension from '@tiptap/extension-image';
import {importImage} from '../lib/images';
import {TextStyle,Color,FontFamily} from '@tiptap/extension-text-style';
import {useEffect,useRef,useState} from 'react';
import {Bold,Italic,Underline,Heading2,Quote,Diamond,Undo2,Redo2,RemoveFormatting,TextSelect,ImagePlus,Highlighter,Trash2,AlignLeft,AlignCenter,AlignRight} from 'lucide-react';
import {chineseFonts,latinFonts,fontStack} from '../lib/fonts';
import {toPlainText,opaqueColor,needsQuoteIndent,type RichNode} from '../lib/rich-text';
import {normalizePastedHTML,normalizePastedText} from '../lib/paste';
import {ColorField} from './color-field';
import {getPalette,type Settings} from '../lib/manuscript';
const HighlightMark=Mark.create({
 name:'highlight',inclusive:true,
 addAttributes(){return {color:{default:'#ffff00',parseHTML:element=>opaqueColor(element.getAttribute('data-color')||element.style.backgroundColor)||'#ffff00'}}},
 parseHTML(){return [{tag:'mark'}]},
 renderHTML({HTMLAttributes}){const color=opaqueColor(HTMLAttributes.color)||'#ffff00';return ['mark',{'data-color':color,style:`background-color:${color};color:inherit`},0]}
});
const StoryImage=ImageExtension.extend({
 parseHTML(){return [{tag:'img[src]',getAttrs:element=>/^(blob:|data:image\/(png|jpeg|webp|gif|avif);)/.test((element as HTMLElement).getAttribute('src')||'')?null:false}];},
 addAttributes(){return {...this.parent?.(),assetId:{default:null},width:{default:1},height:{default:1},widthPercent:{default:100},alignment:{default:'center'}};},
 renderHTML({HTMLAttributes}){const width=Math.max(20,Math.min(100,Number(HTMLAttributes.widthPercent)||100));const alignment=HTMLAttributes.alignment;return ['img',{...HTMLAttributes,style:`width:${width}%;height:auto;display:block;margin-left:${alignment==='left'?'0':'auto'};margin-right:${alignment==='right'?'0':'auto'}`,loading:'lazy'}];}
}).configure({allowBase64:true});
export function RichEditor({value,settings,onChange}:{value:RichNode;settings:Settings;onChange:(value:RichNode,text:string)=>void}){
 const callback=useRef(onChange);callback.current=onChange;
 const selection=useRef<{from:number;to:number}|null>(null);
 const [selected,setSelected]=useState(0),[revision,setRevision]=useState(0);
 const fileInput=useRef<HTMLInputElement>(null);const [imageBusy,setImageBusy]=useState(false),[imageError,setImageError]=useState('');const [highlightPick,setHighlightPick]=useState('#ffff00');
 const editor=useEditor({extensions:[StarterKit.configure({bold:false,heading:{levels:[2,3]},codeBlock:false,code:false,link:false,bulletList:false,orderedList:false,listItem:false,strike:false}),BoldExtension,TextStyle,Color,FontFamily,HighlightMark,StoryImage],content:value as JSONContent,immediatelyRender:false,editorProps:{attributes:{role:'textbox','aria-label':'正文','aria-multiline':'true',id:'body-text',spellcheck:'false'},transformPastedHTML:normalizePastedHTML,transformPastedText:normalizePastedText},onUpdate:({editor})=>{const doc=editor.getJSON() as RichNode;callback.current(doc,toPlainText(doc));setRevision(n=>n+1)},onSelectionUpdate:({editor})=>{const {from,to}=editor.state.selection;selection.current={from,to};setSelected(editor.state.doc.textBetween(from,to,'\n').length);setRevision(n=>n+1)},onTransaction:()=>setRevision(n=>n+1)});
 useEffect(()=>{if(!editor)return;if(JSON.stringify(editor.getJSON())!==JSON.stringify(value)){editor.commands.setContent(value as JSONContent,{emitUpdate:false});selection.current=null;setSelected(0)}},[editor,value]);
 if(!editor)return <div className="rich-editor-loading">正在准备书写空间…</div>;
 async function addImage(file:File){
 const insertion=selection.current?.from??editor!.state.selection.from;setImageError('');setImageBusy(true);
 try{const attrs=await importImage(file);if(editor!.isDestroyed)return;editor!.chain().focus().setTextSelection(Math.min(insertion,editor!.state.doc.content.size)).insertContent([{type:'image',attrs},{type:'paragraph'}]).run();selection.current={from:editor!.state.selection.from,to:editor!.state.selection.to};}
 catch(error){setImageError((error as Error).message)}finally{setImageBusy(false);if(fileInput.current)fileInput.current.value='';}
 }
 const imageSelected=editor.isActive('image'),imageAttrs=editor.getAttributes('image');
 const palette=getPalette(settings),attrs=editor.getAttributes('textStyle');
 const currentColor=opaqueColor(attrs.color)||palette.ink;
 const stack=String(attrs.fontFamily||'');const firstFamily=stack.split(',')[0].trim().replace(/["']/g,'');const fontValue=[...chineseFonts,...latinFonts].find(f=>f.family===firstFamily)?.id||'';
 function chain(focus=true){let commands=editor!.chain();const remembered=selection.current,current=editor!.state.selection;if(remembered&&(remembered.from!==current.from||remembered.to!==current.to))commands=commands.setTextSelection(remembered);return focus?commands.focus(undefined,{scrollIntoView:false}):commands;}
 function preserveSelection(e:React.PointerEvent){e.preventDefault();const {from,to}=editor!.state.selection;selection.current={from,to};}
 const currentHighlight=opaqueColor(editor.getAttributes('highlight').color)||highlightPick;
 function highlightColor(value:string){setHighlightPick(value);chain(false).setMark('highlight',{color:value}).run();}
 function color(value:string){if(!selected)return;chain(false).setColor(value).run();}
 function setFont(id:string){if(!selected)return;if(!id){chain(false).unsetFontFamily().run();return;}const cn=chineseFonts.find(f=>f.id===id),en=latinFonts.find(f=>f.id===id);const chosen=(cn||en)!;const fallback=cn?(latinFonts.find(f=>f.id===settings.latinFont)||latinFonts[0]).family:(chineseFonts.find(f=>f.id===settings.font)||chineseFonts[0]).family;const choice=`"${chosen.family}", "${fallback}", "ArcaneSerif", serif`;chain(false).setFontFamily(choice).run();}
 function selectParagraph(){const {$from}=editor!.state.selection;const from=$from.start(),to=$from.end();editor!.chain().focus().setTextSelection({from,to}).run();selection.current={from,to};setSelected(to-from);}
 function toggleQuote(){
  if(editor!.isActive('blockquote')){chain().toggleBlockquote().run();return;}
  chain().command(({state,tr})=>{
   const starts:number[]=[];const {from,to}=state.selection;
   state.doc.nodesBetween(from,to,(node,pos)=>{if(node.isTextblock){if(needsQuoteIndent(node.textContent))starts.push(pos+1);return false}return true});
   if(!starts.length){const {$from}=state.selection;if($from.parent.isTextblock&&needsQuoteIndent($from.parent.textContent))starts.push($from.start());}
   for(let i=starts.length-1;i>=0;i--)tr.insertText('\u3000',starts[i]);
   return true;
  }).toggleBlockquote().run();
 }
 // Keeping the ProseMirror selection lets touch users open font/color controls safely.
 return <div className="rich-editor" data-revision={revision}>
 <div className="rich-toolbar">
 <div className="image-insert-row"><button aria-label="在光标处插入图片" disabled={imageBusy} onPointerDown={preserveSelection} onClick={()=>fileInput.current?.click()}><ImagePlus size={16}/>{imageBusy?'正在保存图片…':'插入图片'}</button><small>插入到光标位置 · 图片保存在本机</small><input aria-label="选择正文图片" ref={fileInput} type="file" hidden accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={e=>{const file=e.target.files?.[0];if(file)void addImage(file)}}/></div>
 {imageError&&<p className="image-error" role="alert">{imageError}</p>}
 {imageSelected&&<div className="image-controls"><label>图片宽度<select aria-label="图片宽度" value={imageAttrs.widthPercent} onChange={e=>editor.chain().focus().updateAttributes('image',{widthPercent:+e.target.value}).run()}>{[25,50,75,100].map(n=><option value={n} key={n}>{n}%</option>)}</select></label>{([['left','图片靠左',AlignLeft],['center','图片居中',AlignCenter],['right','图片靠右',AlignRight]] as const).map(([alignment,label,Icon])=><button key={alignment} aria-label={label} aria-pressed={imageAttrs.alignment===alignment} onPointerDown={preserveSelection} onClick={()=>editor.chain().focus().updateAttributes('image',{alignment}).run()}><Icon size={15}/></button>)}<button aria-label="删除所选图片" onPointerDown={preserveSelection} onClick={()=>editor.chain().focus().deleteSelection().run()}><Trash2 size={15}/></button></div>}

 <div className="rich-tools-main"><button title="加深所选文字" aria-label="加深所选文字" aria-pressed={editor.isActive('bold')} disabled={imageSelected} onPointerDown={preserveSelection} onClick={()=>chain().toggleBold().run()}><Bold size={16}/></button><button title="斜体" aria-label="斜体" aria-pressed={editor.isActive('italic')} disabled={imageSelected} onPointerDown={preserveSelection} onClick={()=>chain().toggleItalic().run()}><Italic size={15}/></button><button title="下划线" aria-label="下划线" aria-pressed={editor.isActive('underline')} disabled={imageSelected} onPointerDown={preserveSelection} onClick={()=>chain().toggleUnderline().run()}><Underline size={15}/></button><i/><button title="选取当前段落" aria-label="选取当前段落" onPointerDown={preserveSelection} onClick={selectParagraph}><TextSelect size={15}/><small>整段</small></button><button title="清除所选格式" aria-label="清除所选格式" disabled={!selected} onPointerDown={preserveSelection} onClick={()=>chain().unsetAllMarks().run()}><RemoveFormatting size={15}/></button><span/><button aria-label="撤销" disabled={!editor.can().undo()} onPointerDown={preserveSelection} onClick={()=>editor.chain().focus().undo().run()}><Undo2 size={14}/></button><button aria-label="重做" disabled={!editor.can().redo()} onPointerDown={preserveSelection} onClick={()=>editor.chain().focus().redo().run()}><Redo2 size={14}/></button></div>
 <div className="rich-format-row"><label className="local-font"><span>选区字体</span><select aria-label="所选文字字体" disabled={!selected} value={fontValue} onChange={e=>setFont(e.target.value)}><option value="">跟随全局</option><optgroup label="中文字体">{chineseFonts.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</optgroup><optgroup label="英文字体">{latinFonts.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</optgroup></select></label><div className="local-color"><ColorField label="选区字色" value={currentColor} onChange={color} disabled={!selected}/></div></div>
 <div className="highlight-row"><button aria-label="文字高亮" aria-pressed={editor.isActive('highlight')} disabled={imageSelected} onPointerDown={preserveSelection} onClick={()=>chain().toggleMark('highlight',{color:currentHighlight}).run()}><Highlighter size={15}/><span>高亮</span></button><ColorField label="高亮颜色" value={currentHighlight} disabled={imageSelected} onChange={highlightColor}/><button aria-label="清除高亮" disabled={imageSelected||(!selected&&!editor.isActive('highlight'))} onPointerDown={preserveSelection} onClick={()=>chain().unsetMark('highlight').run()}><RemoveFormatting size={14}/></button></div>
 <div className="rich-block-tools"><button aria-label="章节标题" onPointerDown={preserveSelection} onClick={()=>chain().toggleHeading({level:2}).run()}><Heading2 size={15}/></button><button title="引文段落（默认缩进可删除）" aria-label="引文段落" aria-pressed={editor.isActive('blockquote')} onPointerDown={preserveSelection} onClick={toggleQuote}><Quote size={13}/></button><button aria-label="插入装饰分隔线" onPointerDown={preserveSelection} onClick={()=>chain().setHorizontalRule().run()}><Diamond size={12}/></button><small>{selected?`已选 ${selected} 字 · 格式仅作用于选区`:'引文缩进可用空格自由调整；B / I / U / 高亮也可先开启再输入'}</small></div>
 </div>
 <EditorContent editor={editor} className="rich-content" style={{'--paragraph-indent':settings.indent?'2em':'0',fontFamily:fontStack(settings),color:palette.ink,background:palette.bg} as React.CSSProperties}/>
 </div>;
}
