import {drawMotif} from './motifs';
export const mark=drawMotif;
export function backgroundArt(c:CanvasRenderingContext2D,pattern:string,elements:string[],w:number,h:number,accent:string,opacity:number,clipTop=0,clipHeight=h,solid=false){
 const aliases:Record<string,string>={arcane:'astral',halo:'astral',ruins:'cathedral',mist:'forest','moon-garden':'astral',illumination:'forest',astrolabe:'astral'};pattern=aliases[pattern]||pattern;
 c.save();c.strokeStyle=accent;c.fillStyle=accent;c.lineWidth=.85;
 const lo=Math.max(0,Math.floor((clipTop-400)/680)),hi=Math.ceil((clipTop+clipHeight+400)/680);
 for(let i=lo;i<=hi;i++){const yy=390+i*680;c.globalAlpha=opacity;
  if(pattern==='astral'){drawMotif(c,'moon',w/2,yy,145,solid);for(const [x,y] of [[150,yy-170],[w-160,yy+170],[w-190,yy-90]])drawMotif(c,'stars',x,y,20,solid);}
  if(pattern==='forest'||pattern==='rose-garden'){for(const side of [65,w-65])for(let n=0;n<4;n++){c.save();c.translate(side,yy-210+n*140);c.rotate(side<w/2?-.5:.5);drawMotif(c,pattern==='forest'?'vines':'roses',0,0,28,solid);c.restore();}}
  if(pattern==='ocean'){drawMotif(c,'compass',w/2,yy,130,solid);for(const y of [yy-190,yy+190]){c.beginPath();c.moveTo(120,y);c.bezierCurveTo(250,y-30,w-250,y+30,w-120,y);c.bezierCurveTo(w-250,y+42,250,y-18,120,y+12);c.closePath();if(solid)c.fill();c.stroke();}}
  if(pattern==='cathedral'){c.beginPath();c.moveTo(w/2-170,yy+220);c.lineTo(w/2-170,yy-40);c.quadraticCurveTo(w/2-170,yy-180,w/2,yy-240);c.quadraticCurveTo(w/2+170,yy-180,w/2+170,yy-40);c.lineTo(w/2+170,yy+220);c.closePath();c.stroke();drawMotif(c,'stars',w/2,yy-90,65,solid);}
  if(pattern==='mountains'){for(let n=0;n<2;n++){c.beginPath();c.moveTo(110,yy+160+n*25);c.lineTo(260,yy-80+n*25);c.lineTo(350,yy+50+n*25);c.lineTo(480,yy-170+n*25);c.lineTo(w-110,yy+160+n*25);c.closePath();if(solid)c.fill();c.stroke();}}
  if(pattern==='striped'){for(const y of [yy-230,yy+160]){c.beginPath();c.moveTo(55,y);c.lineTo(w-55,y+75);c.lineTo(w-55,y+89);c.lineTo(55,y+14);c.closePath();if(solid)c.fill();c.stroke();}}
  const polygon=(points:number[][])=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(solid)c.fill();c.stroke();};
  const circle=(x:number,y:number,r:number)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.closePath();c.stroke();};
  if(pattern==='royal-forest'){
   drawMotif(c,'crown',w/2,yy-50,94,solid);
   for(const flip of [-1,1]){c.save();c.translate(w/2+flip*155,yy+15);c.rotate(flip*.55);drawMotif(c,'sword',0,0,94,solid);c.restore();for(let j=0;j<4;j++){c.save();c.translate(w/2+flip*(190-j*18),yy+115-j*68);c.rotate(flip*.55);drawMotif(c,'vines',0,0,22,solid);c.restore();}}
  }
  if(pattern==='arcane-engine'){
   drawMotif(c,'gear',w/2,yy,108,solid);for(const [x,y,r]of [[132,yy-180,48],[w-132,yy+180,48]])drawMotif(c,'gear',x,y,r,solid);
   for(const flip of [-1,1])polygon([[w/2+flip*135,yy-140],[w/2+flip*205,yy-140],[w/2+flip*205,yy-65],[w/2+flip*194,yy-65],[w/2+flip*194,yy-128],[w/2+flip*135,yy-128]]);
  }
  if(pattern==='pearl-tide'){
   drawMotif(c,'compass',w/2,yy-50,105,solid);for(let j=0;j<3;j++){const y=yy+90+j*45;c.beginPath();c.moveTo(100,y);c.bezierCurveTo(240,y-60,w-240,y+60,w-100,y);c.bezierCurveTo(w-240,y+74,240,y-46,100,y+14);c.closePath();if(solid)c.fill();c.stroke();}for(const x of [125,w-125])drawMotif(c,'crystal',x,yy-210,26,solid);
  }
  if(pattern==='sacred-sun'){
   c.beginPath();c.moveTo(w/2-150,yy+210);c.lineTo(w/2-150,yy-70);c.quadraticCurveTo(w/2-150,yy-190,w/2,yy-250);c.quadraticCurveTo(w/2+150,yy-190,w/2+150,yy-70);c.lineTo(w/2+150,yy+210);c.closePath();if(solid)c.fill();c.stroke();drawMotif(c,'sun',w/2,yy-80,84,solid);for(const x of [w/2-75,w/2+75])drawMotif(c,'wing',x,yy+130,40,solid);
  }
  if(pattern==='dragon-ridge'){
   polygon([[85,yy+200],[225,yy-40],[315,yy+80],[470,yy-160],[w-85,yy+200]]);polygon([[185,yy+30],[225,yy-40],[269,yy+35],[225,yy+15]]);polygon([[424,yy-90],[470,yy-160],[515,yy-87],[470,yy-110]]);drawMotif(c,'dragon',w/2-25,yy-100,80,solid);
  }
  if(pattern==='scholar-orbit'){
   c.beginPath();c.ellipse(w/2,yy,205,95,-.35,0,Math.PI*2);c.closePath();c.stroke();circle(w/2,yy,140);drawMotif(c,'book',w/2,yy,91,solid);for(const [x,y]of [[w/2-185,yy+65],[w/2+185,yy-65],[w/2,yy-180]])drawMotif(c,'stars',x,y,20,solid);
  }
  if(pattern==='shelter-garden'){
   drawMotif(c,'home',w/2,yy-35,118,solid);for(const flip of [-1,1]){for(let j=0;j<4;j++){c.save();c.translate(w/2+flip*(125+j*33),yy+30+j*37);c.rotate(flip*(.45+j*.08));drawMotif(c,'vines',0,0,22,solid);c.restore();}drawMotif(c,'stars',w/2+flip*195,yy-170,18,solid);}c.beginPath();c.arc(w/2,yy+118,210,Math.PI*.12,Math.PI*.88);c.stroke();
  }
  if(pattern==='life-roots'){
   drawMotif(c,'tree',w/2,yy-25,145,solid);for(const flip of [-1,1])polygon([[w/2,yy+95],[w/2+flip*80,yy+185],[w/2+flip*210,yy+230],[w/2+flip*105,yy+178],[w/2+flip*30,yy+80]]);for(const [x,y]of [[100,yy-180],[w-100,yy+180]])drawMotif(c,'vines',x,y,42,solid);
  }
  if(pattern==='angel-dawn'){
   circle(w/2,yy-130,55);circle(w/2,yy-130,64);for(const flip of [-1,1]){c.save();c.translate(w/2+flip*100,yy+50);c.scale(flip,1);c.rotate(-.2);drawMotif(c,'wing',0,0,110,solid);c.restore();}drawMotif(c,'sun',w/2,yy+80,31,solid);
  }
  if(pattern==='sealed-ruins'){
   drawMotif(c,'seal',w/2,yy,125,solid);for(const flip of [-1,1])for(let j=0;j<3;j++){const x=w/2+flip*210,y=yy-160+j*125;polygon([[x-20,y],[x+26,y-8],[x+23,y+67],[x-24,y+75]]);}drawMotif(c,'crystal',w/2,yy+225,27,solid);
  }
  if(pattern==='mist-watch'){
   drawMotif(c,'eye',w/2,yy-40,100,solid);for(let j=0;j<4;j++){const y=yy-210+j*130;c.beginPath();c.moveTo(115,y);c.bezierCurveTo(250,y+50,w-250,y-45,w-115,y);c.bezierCurveTo(w-250,y-30,250,y+65,115,y+15);c.closePath();if(solid)c.fill();c.stroke();}for(const x of [65,w-65])drawMotif(c,'vines',x,yy+40,40,solid);
  }
  for(let k=0;k<elements.length;k++){const x=k%2===0?64:w-64;drawMotif(c,elements[k],x,yy-240+Math.floor(k/2)*145,27,solid);}
 }
 c.restore();
}
