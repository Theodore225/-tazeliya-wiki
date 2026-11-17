const textures=new Map<string,HTMLCanvasElement>();
export function paintPaperTexture(c:CanvasRenderingContext2D,paper:string,w:number,top:number,height:number){
 if(!c.createPattern)return false;
 let tile=textures.get(paper);
 if(!tile){tile=document.createElement('canvas');tile.width=760;tile.height=512;const ctx=tile.getContext('2d')!;let seed=71;
  for(let i=0;i<512*14;i++){seed=seed*16807%2147483647;const x=seed%760;seed=seed*16807%2147483647;const y=seed%512;ctx.fillStyle=i%2?'#64503409':'#ffffff12';ctx.fillRect(x,y,paper==='linen'?2:1,paper==='linen'?.5:1);}
  if(paper==='linen'){ctx.strokeStyle='#ffffff09';ctx.lineWidth=.5;ctx.beginPath();for(let x=0;x<760;x+=4){ctx.moveTo(x,0);ctx.lineTo(x,512);}for(let y=0;y<512;y+=4){ctx.moveTo(0,y);ctx.lineTo(760,y);}ctx.stroke();}
  textures.set(paper,tile);
 }
 const pattern=c.createPattern(tile,'repeat');if(!pattern)return false;c.fillStyle=pattern;c.fillRect(0,top,w,height);return true;
}
