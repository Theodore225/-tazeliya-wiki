// Keep source whitespace editable; only position the quote rule visually.
export function quotePrefix(text:string){return text.match(/^[\t \u00a0\u3000]*/u)?.[0]||'';}
export function quoteIndentEm(text:string){return Array.from(quotePrefix(text)).reduce((n,c)=>n+(c==='\u3000'?1:c==='\t'?2:.5),0);}
