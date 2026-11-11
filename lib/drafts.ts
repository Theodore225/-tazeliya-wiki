import type {Settings} from './manuscript';
import {fromPlainText,plainNode,profileTemplate,profileTitles,toPlainText,type RichNode,type ContentMode} from './rich-text';
export type Draft={title:string;subtitle:string;author:string;text:string;richText:RichNode};
export type Drafts=Record<ContentMode,Draft>;
export function currentDraft(s:Settings):Draft{return{title:s.title,subtitle:s.subtitle,author:s.author,text:s.text,richText:s.richText||fromPlainText(s.text)}}
export function createDrafts(s:Settings):Drafts{
 if(s.documents)return {...s.documents,[s.contentMode]:currentDraft(s)};
 const form=(mode:'profile'|'full-profile'):Draft=>{const richText=profileTemplate(mode);return{title:mode==='profile'?'人物档案':'完整人物档案',subtitle:'',author:'',richText,text:toPlainText(richText)}};
 const drafts:Drafts={content:currentDraft(s),profile:form('profile'),'full-profile':form('full-profile')};
 const nodes=(s.richText||fromPlainText(s.text)).content||[];
 const start=nodes.findIndex(n=>Object.values(profileTitles).includes(plainNode(n)));
 const end=nodes.findIndex((n,i)=>i>start&&plainNode(n)==='——————————');
 if(start>=0&&end>=start){
  const mode=plainNode(nodes[start])===profileTitles.profile?'profile':'full-profile';
  const richText:RichNode={type:'doc',content:nodes.slice(start,end+1)};
  drafts[mode]={...form(mode),richText,text:toPlainText(richText)};
  const remaining:RichNode={type:'doc',content:[...nodes.slice(0,start),...nodes.slice(end+1)]};
  drafts.content={...currentDraft(s),title:['人物档案','完整人物档案'].includes(s.title)?'我的故事':s.title,richText:remaining,text:toPlainText(remaining)};
 }else if(s.contentMode!=='content'){
  drafts[s.contentMode]=currentDraft(s);
  drafts.content={title:'我的故事',subtitle:'',author:'',text:'',richText:fromPlainText('')};
 }
 return drafts;
}
export function switchDraft(s:Settings,mode:ContentMode):Settings{
 const documents=createDrafts(s);return {...s,...documents[mode],documents,contentMode:mode,templateImported:mode!=='content'};
}
export function initializeDrafts(s:Settings):Settings{
 const documents=createDrafts(s);return {...s,...documents[s.contentMode],documents};
}
export function snapshotDrafts(s:Settings):Settings{return {...s,documents:createDrafts(s)}};
