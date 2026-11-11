export type World = { id:string; name:string; note:string; color:string; ink:string; accent:string; pattern:string; crest:string; elements:string[]; theme:string; ornament?:string };
// Visual interpretations of the supplied setting, not canonical national flags or coats of arms.
export const worldSource = "https://shimo.im/docs/Wr3DpgG5NEhEx23J";
export const worlds:World[] = [
 {id:"none",name:"无国籍 · 自由旅人",note:"不归属于任何国家，自由搭配纸页与纹样。",color:"#f1e5cb",ink:"#453c2b",accent:"#947541",pattern:"plain",crest:"moon",elements:[],theme:"antique"},
 {id:"lyanvia",name:"莱恩维亚王国",note:"大陆中央的古老王国，森林、河流与皇家骑士。",color:"#eef0dd",ink:"#344535",accent:"#8c7748",pattern:"royal-forest",crest:"crown",elements:["vines", "sword"],ornament:"botanical",theme:"antique"},
 {id:"ordreik",name:"奥德雷克帝国",note:"西方山地与峡谷，严整军制及魔法科技。",color:"#28323c",ink:"#e7e4db",accent:"#c5aa77",pattern:"arcane-engine",crest:"gear",elements:["gear", "crystal"],ornament:"geometric",theme:"astral"},
 {id:"valentis",name:"瓦伦蒂斯王国",note:"东南群岛、珍珠宝石与繁盛的海上贸易。",color:"#dcecea",ink:"#304d51",accent:"#a68451",pattern:"pearl-tide",crest:"compass",elements:["compass", "crystal"],ornament:"cameo",theme:"antique"},
 {id:"esir",name:"埃斯尔教国",note:"东方的神圣教国，山谷、森林、湖泊与信仰。",color:"#f6f1e4",ink:"#66513d",accent:"#b18b48",pattern:"sacred-sun",crest:"sun",elements:["sun", "wing"],ornament:"cathedral",theme:"royal"},
 {id:"isterfin",name:"伊斯特芬王国",note:"北境雪山与冰原，背靠巨龙峡谷的寂静国度。",color:"#e6edf4",ink:"#3a4d68",accent:"#849cb6",pattern:"dragon-ridge",crest:"dragon",elements:["dragon", "stars"],ornament:"geometric",theme:"antique"},
 {id:"gnosis",name:"格诺希斯魔法学校",note:"位于莱恩维亚与埃斯尔之间，在各国设有分校。",color:"#26243c",ink:"#ece4d8",accent:"#c1a778",pattern:"scholar-orbit",crest:"book",elements:["book", "stars"],ornament:"cameo",theme:"astral"},
 {id:"yierda",name:"耶尔达孤儿院",note:"塔泽里亚大陆的儿童收容与照护组织。",color:"#f3eadb",ink:"#55453d",accent:"#a67869",pattern:"shelter-garden",crest:"home",elements:["home", "vines"],ornament:"botanical",theme:"antique"},
 {id:"elven",name:"精灵之森",note:"生命树的根系遍布森林，生命从此诞生，亦回归于此。",color:"#e8edda",ink:"#384c3b",accent:"#8f9b66",pattern:"life-roots",crest:"tree",elements:["tree", "vines"],ornament:"botanical",theme:"antique"},
 {id:"white",name:"白域",note:"唯有白昼的天使之域，人造太阳的光晕笼罩此地。",color:"#faf6e9",ink:"#807057",accent:"#bca469",pattern:"angel-dawn",crest:"wing",elements:["wing", "sun"],ornament:"cathedral",theme:"royal"},
 {id:"forsaken",name:"神弃之地",note:"大陆最西侧的封印之地，荒芜之中重现微弱生机。",color:"#343438",ink:"#ded8ca",accent:"#aaa17f",pattern:"sealed-ruins",crest:"seal",elements:["seal", "crystal"],ornament:"postage",theme:"astral"},
 {id:"mist",name:"幽雾森林",note:"黑雾笼罩的禁区，位于神弃之地与奥德雷克之间。",color:"#2c3737",ink:"#d9e1d6",accent:"#91aaa0",pattern:"mist-watch",crest:"eye",elements:["eye", "vines"],ornament:"botanical",theme:"astral"}
];
export const patterns = [{id:"plain",name:"素面"},{id:"astral",name:"星月天幕"},{id:"forest",name:"月桂叶影"},{id:"ocean",name:"潮汐海图"},{id:"cathedral",name:"圣堂拱窗"},{id:"mountains",name:"北境雪峰"},{id:"rose-garden",name:"蔷薇手札"},{id:"striped",name:"斜纹绶带"},{id:"royal-forest",name:"王国 · 桂叶剑冠"},{id:"arcane-engine",name:"帝国 · 魔导齿轮"},{id:"pearl-tide",name:"群岛 · 潮汐航图"},{id:"sacred-sun",name:"教国 · 圣日拱窗"},{id:"dragon-ridge",name:"北境 · 龙脊雪峰"},{id:"scholar-orbit",name:"学园 · 魔书星环"},{id:"shelter-garden",name:"孤儿院 · 守护花园"},{id:"life-roots",name:"精灵 · 生命树根"},{id:"angel-dawn",name:"白域 · 天使昼光"},{id:"sealed-ruins",name:"神弃 · 封印残垣"},{id:"mist-watch",name:"幽雾 · 藤蔓之眼"}];
export {motifOptions as elements} from './motifs';
import {motifOptions,motifId} from './motifs';
export const crests=[{id:'none',name:'无'},...motifOptions];
export function normalizeDecorations<T extends {ornament:string;pattern:string;crest:string;elements:string[]}>(s:T):T{
 const borders:Record<string,string>={gothic:'cathedral',celestial:'cameo',roses:'botanical',filigree:'botanical',celtic:'geometric',dragon:'cameo'};
 const backgrounds:Record<string,string>={arcane:'astral',halo:'astral',ruins:'cathedral',mist:'forest','moon-garden':'astral',illumination:'forest',astrolabe:'astral'};
 return {...s,ornament:borders[s.ornament]||s.ornament,pattern:backgrounds[s.pattern]||s.pattern,crest:motifId(s.crest),elements:[...new Set(s.elements.map(motifId))].filter(id=>motifOptions.some(m=>m.id===id))};
}

// Upgrade former country presets while retaining hand-placed and recolored user elements.
import type {Settings} from './manuscript';
import {legacyDecorations} from './decorations';
export function upgradeWorldArtwork(s:Settings):Settings{
 if((s.worldArtVersion||0)>=2)return s;
 const old:Record<string,[string,string,string[]]>={lyanvia:['forest','crown',['vines','sword']],ordreik:['astral','crystal',['crystal','crystal']],valentis:['ocean','compass',['compass','crystal']],esir:['cathedral','stars',['butterfly','stars']],isterfin:['mountains','stars',['stars','sword']],gnosis:['astral','compass',['compass','stars']],elven:['forest','vines',['vines','stars']],white:['astral','stars',['butterfly','compass']],forsaken:['cathedral','crystal',['compass','vines']],mist:['forest','moon',['vines','stars']]};
 const w=worlds.find(w=>w.id===s.country),previous=old[s.country];if(!w||!previous)return {...s,worldArtVersion:2};
 const untouched=s.decorations?.every((e,i)=>e.id===`legacy-${i}`&&e.motif===previous[2][i]&&e.x===(i%2?91:9)&&e.y===23+Math.floor(i/2)*15&&e.size===54&&!e.solid&&(e.opacity??1)===1&&e.color===(s.motifColor||s.accentColor||w.accent));
 return {...s,worldArtVersion:2,pattern:s.pattern===previous[0]?w.pattern:s.pattern,crest:s.crest===previous[1]?w.crest:s.crest,decorations:untouched&&s.decorations?.length===previous[2].length?legacyDecorations(w.elements,w.accent).map(e=>({...e,opacity:.35})):s.decorations};
}
