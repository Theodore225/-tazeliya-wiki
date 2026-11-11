import {drawMotif} from './motifs';
export function frameBandPath(style:string,w:number,h:number){
 const rect=(n:number)=>`M${n} ${n} H${w-n} V${h-n} H${n} Z`;
 const rounded=(n:number,r:number)=>`M${n+r} ${n} H${w-n-r} A${r} ${r} 0 0 1 ${w-n} ${n+r} V${h-n-r} A${r} ${r} 0 0 1 ${w-n-r} ${h-n} H${n+r} A${r} ${r} 0 0 1 ${n} ${h-n-r} V${n+r} A${r} ${r} 0 0 1 ${n+r} ${n} Z`;
 const arch=(n:number,y:number,top:number,control:number)=>`M${n} ${h-n} V${y} C${n} ${control} ${w*.26} ${top+9} ${w/2} ${top} C${w*.74} ${top+9} ${w-n} ${control} ${w-n} ${y} V${h-n} Z`;
 if(style==='cathedral')return arch(34,150,24,67)+' '+arch(43,154,34,77);
 if(style==='cameo')return rounded(31,40)+' '+rounded(42,31);
 if(style==='ribbon')return rect(30)+' '+rect(45);
 if(style==='postage'){
  const pts:number[][]=[];const side=(x:number,y:number,dx:number,dy:number,length:number)=>{const steps=Math.floor(length/18),unit=length/steps;for(let i=0;i<steps;i++)pts.push([x+dx*i*unit,y+dy*i*unit],[x+dx*(i+.3)*unit,y+dy*(i+.3)*unit],[x+dx*(i+.5)*unit-dy*4,y+dy*(i+.5)*unit+dx*4],[x+dx*(i+.7)*unit,y+dy*(i+.7)*unit]);};
  side(30,30,1,0,w-60);side(w-30,30,0,1,h-60);side(w-30,h-30,-1,0,w-60);side(30,h-30,0,-1,h-60);
  return pts.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')+' Z '+rect(43);
 }
 return rect(32)+' '+rect(42);
}
export function paperFrame(c:CanvasRenderingContext2D,style:string,w:number,h:number,color:string,solid=false,bandSolid=false){
 const aliases:Record<string,string>={gothic:'cathedral',celestial:'cameo',roses:'botanical',filigree:'botanical',celtic:'geometric',dragon:'cameo'};style=aliases[style]||style;
 if(style==='none')return;c.save();c.strokeStyle=color;c.fillStyle=color;c.lineWidth=1.1;c.lineJoin='round';
 if(bandSolid)c.fill(new Path2D(frameBandPath(style,w,h)),'evenodd');
 const closed=(points:number[][])=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(solid)c.fill();c.stroke();};
 if(style==='ribbon'){
  c.strokeRect(30,30,w-60,h-60);c.strokeRect(45,45,w-90,h-90);
  for(let x=47;x<w-55;x+=24)for(const y of [32,h-43])closed([[x,y],[x+8,y],[x+17,y+11],[x+9,y+11]]);
  for(let y=47;y<h-55;y+=24)for(const x of [32,w-43])closed([[x,y],[x+11,y+9],[x+11,y+17],[x,y+8]]);
 }else if(style==='postage'){
  const pts:number[][]=[];const side=(x:number,y:number,dx:number,dy:number,length:number)=>{const steps=Math.floor(length/18),unit=length/steps;for(let i=0;i<steps;i++){pts.push([x+dx*i*unit,y+dy*i*unit],[x+dx*(i+.3)*unit,y+dy*(i+.3)*unit],[x+dx*(i+.5)*unit-dy*4,y+dy*(i+.5)*unit+dx*4],[x+dx*(i+.7)*unit,y+dy*(i+.7)*unit]);}};
  side(30,30,1,0,w-60);side(w-30,30,0,1,h-60);side(w-30,h-30,-1,0,w-60);side(30,h-30,0,-1,h-60);
  c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.stroke();c.strokeRect(43,43,w-86,h-86);
  for(const [x,y]of [[56,56],[w-56,56],[56,h-56],[w-56,h-56]])drawMotif(c,'stars',x,y,9,solid);
 }else if(style==='cathedral'){
  c.beginPath();c.moveTo(34,h-34);c.lineTo(34,150);c.bezierCurveTo(34,67,w*.26,33,w/2,24);c.bezierCurveTo(w*.74,33,w-34,67,w-34,150);c.lineTo(w-34,h-34);c.closePath();c.stroke();
  c.beginPath();c.moveTo(43,h-43);c.lineTo(43,154);c.bezierCurveTo(43,77,w*.26,43,w/2,34);c.bezierCurveTo(w*.74,43,w-43,77,w-43,154);c.lineTo(w-43,h-43);c.closePath();c.stroke();
  for(const x of [58,w-58])for(const y of [135,h-65])drawMotif(c,'crystal',x,y,13,solid);
 }else if(style==='cameo'){
  c.beginPath();c.roundRect(31,31,w-62,h-62,40);c.stroke();c.beginPath();c.roundRect(42,42,w-84,h-84,31);c.stroke();
  for(const [x,y]of [[58,58],[w-58,58],[58,h-58],[w-58,h-58]]){c.beginPath();c.arc(x,y,18,0,Math.PI*2);if(solid)c.fill();c.stroke();if(!solid)drawMotif(c,'moon',x,y,12);}
 }else{
  c.strokeRect(32,32,w-64,h-64);c.strokeRect(42,42,w-84,h-84);
  for(const [x,y,fx,fy]of [[51,51,1,1],[w-51,51,-1,1],[51,h-51,1,-1],[w-51,h-51,-1,-1]]){
   c.save();c.translate(x,y);c.scale(fx,fy);
   if(style==='botanical'){
    for(let i=0;i<4;i++){c.save();c.translate(6+i*11,49-i*11);c.rotate(-.7);drawMotif(c,'vines',0,0,10,solid);c.restore();}
    c.beginPath();c.moveTo(0,68);c.quadraticCurveTo(10,10,68,0);c.stroke();
   }else{closed([[0,0],[30,0],[42,12],[30,24],[18,12],[0,30]]);closed([[0,38],[9,47],[0,56],[-9,47]]);closed([[38,0],[47,9],[56,0],[47,-9]]);}
   c.restore();
  }
 }
 c.restore();
}
