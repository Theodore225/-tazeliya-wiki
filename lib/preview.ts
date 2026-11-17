import {layoutManuscript,renderTile,type Settings,type Manuscript} from './manuscript';
// Style-only edits do not change wrapping. Keep one layout and up to three
// current-version page canvases; never encode PNG during preview.
export function layoutKey(s:Settings){return JSON.stringify([s.title,s.subtitle,s.author,s.text,s.richText,s.font,s.titleFont,s.latinFont,s.size,s.leading,s.indent,s.crest==='none',s.contentMode]);}
export class PagePreview{
 manuscript:Manuscript|null=null;
 private key='';private revision=-1;private pages=new Map<number,HTMLCanvasElement>();
 update(s:Settings,fontRevision:number){const key=layoutKey(s);if(key!==this.key||fontRevision!==this.revision||!this.manuscript){this.manuscript=layoutManuscript(s);this.key=key;this.revision=fontRevision;}else this.manuscript={...this.manuscript,s};this.clearPages();return this.manuscript;}
 page(index:number){if(!this.manuscript)return null;const sheet=this.manuscript.sheets[index];if(!sheet)return null;const cached=this.pages.get(index);if(cached)return cached;const canvas=renderTile(this.manuscript,sheet,0,sheet.height,1);if(this.pages.size>=3){const first=this.pages.keys().next().value!;const old=this.pages.get(first)!;old.width=old.height=0;this.pages.delete(first);}this.pages.set(index,canvas);return canvas;}
 clearPages(){for(const page of this.pages.values())page.width=page.height=0;this.pages.clear();}
}
