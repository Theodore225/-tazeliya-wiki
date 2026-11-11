export const motifOptions=[{id:'stars',name:'八芒星'},{id:'moon',name:'弦月'},{id:'vines',name:'月桂叶'},{id:'roses',name:'蔷薇印'},{id:'crystal',name:'棱晶'},{id:'sword',name:'骑士剑'},{id:'butterfly',name:'蝶翼'},{id:'compass',name:'航海罗盘'},{id:'crown',name:'王冠'},{id:'gear',name:'魔导齿轮'},{id:'sun',name:'圣日'},{id:'wing',name:'天使羽翼'},{id:'dragon',name:'龙首'},{id:'book',name:'魔法书'},{id:'tree',name:'生命树'},{id:'home',name:'守护之屋'},{id:'seal',name:'封印'},{id:'eye',name:'幽雾之眼'}];
export const borderOptions=[{id:'none',name:'无边框'},{id:'botanical',name:'月桂卷叶'},{id:'geometric',name:'菱格双线'},{id:'cathedral',name:'尖拱书窗'},{id:'ribbon',name:'斜纹织带'},{id:'cameo',name:'徽章圆角'},{id:'postage',name:'邮票齿边'}];
export const rasterMotifAssets:Record<string,string>={dragon:'./dragon-head-original.png',dragonInk:'./dragon-head-ink.png',dragonHighlight:'./dragon-head-highlight.png'};
let dragonInkImage:HTMLImageElement|undefined,dragonHighlightImage:HTMLImageElement|undefined;
const tintedDragonCache=new Map<string,HTMLCanvasElement>();
export async function prepareMotifAssets(){
 if(typeof Image==='undefined')return;
 const load=async(image:HTMLImageElement|undefined,src:string)=>{const next=image||new Image();if(next.complete&&next.naturalWidth)return next;next.src=src;if(next.decode)await next.decode();else await new Promise<void>((resolve,reject)=>{next.onload=()=>resolve();next.onerror=()=>reject(new Error('龙首图案载入失败'));});return next;};
 [dragonInkImage,dragonHighlightImage]=await Promise.all([load(dragonInkImage,rasterMotifAssets.dragonInk),load(dragonHighlightImage,rasterMotifAssets.dragonHighlight)]);
}
const aliases:Record<string,string>={snow:'stars',constellation:'stars',circle:'compass',astrolabe:'compass',phases:'moon',wings:'wing',gears:'gear',laurel:'vines',key:'sword',hourglass:'crystal'};
export function motifId(id:string){return aliases[id]||id;}
export const motifPaths:Record<string,string[]>={
 stars:['M0 -29 L6 -11 L21 -21 L11 -6 L29 0 L11 6 L21 21 L6 11 L0 29 L-6 11 L-21 21 L-11 6 L-29 0 L-11 -6 L-21 -21 L-6 -11 Z','M0 -5 L5 0 L0 5 L-5 0 Z'],
 moon:['M13 -27 C-30 -32 -38 19 -5 29 C6 32 16 28 22 21 C-8 25 -22 -10 13 -27 Z'],
 vines:['M0 30 C-27 13 -27 -13 0 -30 C27 -13 27 13 0 30 Z','M0 24 L-1 -21 L1 -21 Z','M0 4 L-14 -9 L-12 -10 L0 1 Z','M0 15 L14 2 L12 1 L0 12 Z'],
 roses:['M0 -25 C7 -34 17 -26 17 -17 C30 -21 35 -8 25 0 C35 8 30 21 17 17 C17 30 5 34 0 25 C-7 34 -17 26 -17 17 C-30 21 -35 8 -25 0 C-35 -8 -30 -21 -17 -17 C-17 -30 -5 -34 0 -25 Z','M0 -12 C16 -12 16 12 0 12 C-16 12 -16 -12 0 -12 Z','M0 -5 L5 0 L0 5 L-5 0 Z'],
 crystal:['M0 -31 L20 -14 L15 19 L0 31 L-15 19 L-20 -14 Z','M0 -31 L8 -14 L5 19 L0 31 L-5 19 L-8 -14 Z','M-20 -14 L20 -14 L15 -12 L-15 -12 Z'],
 sword:['M0 -32 L5 -24 L4 9 L-4 9 L-5 -24 Z','M-17 8 L-12 3 L-8 6 L8 6 L12 3 L17 8 L14 12 L8 10 L-8 10 L-14 12 Z','M-3 12 L3 12 L3 26 L-3 26 Z','M0 26 L5 30 L0 34 L-5 30 Z'],
 butterfly:['M-2 -3 C-35 -39 -38 -6 -14 3 C-34 12 -21 35 -3 10 Z','M2 -3 C35 -39 38 -6 14 3 C34 12 21 35 3 10 Z','M-2 -10 Q0 -14 2 -10 L2 17 L-2 17 Z','M-1 -10 L-8 -20 L-6 -21 L0 -12 Z','M1 -10 L8 -20 L6 -21 L0 -12 Z'],
 compass:['M0 -29 A29 29 0 1 1 0 29 A29 29 0 1 1 0 -29 Z','M0 -25 L6 -6 L25 0 L6 6 L0 25 L-6 6 L-25 0 L-6 -6 Z','M0 -5 L5 0 L0 5 L-5 0 Z'],
 crown:['M-29 -15 L-19 2 L-13 -22 L0 -7 L13 -22 L19 2 L29 -15 L24 23 L-24 23 Z','M-19 13 L19 13 L18 18 L-18 18 Z'],
 gear:[Array.from({length:48},(_,i)=>{const r=[31,31,25,25][i%4],a=(i/48*2*Math.PI)-Math.PI/2;return `${i?'L':'M'}${Math.cos(a)*r} ${Math.sin(a)*r}`}).join(' ')+' Z','M0 -11 A11 11 0 1 1 0 11 A11 11 0 1 1 0 -11 Z'],
 sun:[Array.from({length:32},(_,i)=>{const r=i%2?21:32,a=i/32*2*Math.PI-Math.PI/2;return `${i?'L':'M'}${Math.cos(a)*r} ${Math.sin(a)*r}`}).join(' ')+' Z','M0 -12 A12 12 0 1 1 0 12 A12 12 0 1 1 0 -12 Z'],
 wing:['M-29 25 C-34 8 -27 -13 -8 -25 C4 -33 18 -35 31 -33 C25 -25 16 -18 6 -13 C17 -16 26 -15 31 -12 C24 -4 15 1 5 3 C15 2 23 4 28 7 C20 14 10 17 0 17 C7 19 12 22 15 26 C2 32 -15 33 -29 25 Z'],
 dragon:[],
 book:['M0 -20 C-10 -28 -23 -27 -30 -22 L-30 23 C-18 17 -9 21 0 28 C9 21 18 17 30 23 L30 -22 C23 -27 10 -28 0 -20 Z','M-24 -17 C-16 -20 -8 -18 -4 -14 L-4 17 C-12 12 -18 11 -24 13 Z','M24 -17 C16 -20 8 -18 4 -14 L4 17 C12 12 18 11 24 13 Z'],
 tree:['M-29 -18 C-24 -23 -18 -21 -16 -16 C-20 -11 -26 -12 -29 -18 Z','M-10 -28 C-5 -34 1 -32 2 -26 C-2 -22 -7 -23 -10 -28 Z','M8 -30 C14 -35 20 -31 18 -25 C13 -22 9 -24 8 -30 Z','M25 -25 C32 -28 35 -22 31 -17 C26 -16 23 -20 25 -25 Z','M22 -9 C29 -12 34 -7 31 -1 C26 1 22 -3 22 -9 Z'],
 home:['M-31 -7 L0 -31 L31 -7 L25 -7 L25 29 L-25 29 L-25 -7 Z','M-7 29 L-7 7 C-7 -2 7 -2 7 7 L7 29 Z','M-19 1 L-10 1 L-10 11 L-19 11 Z','M10 1 L19 1 L19 11 L10 11 Z'],
 seal:['M0 -31 A31 31 0 1 1 0 31 A31 31 0 1 1 0 -31 Z','M0 -25 A25 25 0 1 1 0 25 A25 25 0 1 1 0 -25 Z','M0 -21 L12 17 L-20 -6 L20 -6 L-12 17 Z'],
 eye:['M-32 0 Q0 -28 32 0 Q0 28 -32 0 Z','M0 -12 A12 12 0 1 1 0 12 A12 12 0 1 1 0 -12 Z','M0 -5 A5 5 0 1 1 0 5 A5 5 0 1 1 0 -5 Z']
};
export const motifStrokes:Record<string,string[]>={
 wing:['M-27 24 C-20 10 -8 -5 10 -19','M-22 26 C-14 13 -2 2 16 -8','M-14 29 C-6 19 5 12 20 8','M-5 29 C2 24 8 22 15 26'],
 dragon:[],
 tree:['M0 31 C-2 20 2 9 0 -2 C-1 -13 2 -23 0 -32','M0 12 C-7 4 -14 -3 -23 -8 C-27 -10 -29 -14 -30 -18','M-10 3 C-14 -8 -13 -18 -8 -27','M0 1 C8 -5 16 -12 26 -17 C30 -19 31 -24 31 -28','M7 -7 C13 -16 13 -23 11 -31','M-2 26 C-10 23 -17 25 -26 31','M2 26 C11 23 18 25 27 31'],
 home:['M-18 -7 L-18 -17 L-9 -17 L-9 -14','M-31 -7 L31 -7','M-2 17 L2 17','M0 -25 L0 -16','M-5 -20 L5 -20'],
};
export function drawMotif(c:CanvasRenderingContext2D,id:string,x:number,y:number,size:number,solid=false){
 const normalized=motifId(id);
 // The dragon keeps the supplied artwork's exact silhouette. Its dark pixels
 // inherit the active motif color while the original white horn marks remain white.
 // It intentionally ignores the generic closed-fill switch.
 if(normalized==='dragon'){if(dragonInkImage?.complete&&dragonInkImage.naturalWidth&&dragonHighlightImage?.complete&&dragonHighlightImage.naturalWidth){const color=String(c.strokeStyle||c.fillStyle||'#373f64');let tinted=tintedDragonCache.get(color);if(!tinted){tinted=document.createElement('canvas');tinted.width=dragonInkImage.naturalWidth;tinted.height=dragonInkImage.naturalHeight;const ink=tinted.getContext('2d')!;ink.drawImage(dragonInkImage,0,0);ink.globalCompositeOperation='source-in';ink.fillStyle=color;ink.fillRect(0,0,tinted.width,tinted.height);if(tintedDragonCache.size>24)tintedDragonCache.clear();tintedDragonCache.set(color,tinted);}c.drawImage(tinted,x-size,y-size,size*2,size*2);c.drawImage(dragonHighlightImage,x-size,y-size,size*2,size*2);}return;}
 const paths=motifPaths[normalized],details=motifStrokes[normalized]||[];if(!paths)return;c.save();c.translate(x,y);c.scale(size/34,size/34);c.lineWidth=1.65;c.lineJoin='round';c.lineCap='round';
 // Filled silhouettes and open anatomical/botanical details are kept separate for legibility.
 if(solid){const compound=new Path2D(paths.join(' '));c.fill(compound,'evenodd');}
 for(const d of paths)c.stroke(new Path2D(d));c.lineWidth=1.35;for(const d of details)c.stroke(new Path2D(d));c.restore();
}
