import {roseAssets} from './rose-art';
import {lifeTreeAssets} from './life-tree';
import {suppliedArtAssets,regionArt,starLayers} from './supplied-art';
export type AssetSelection={crest:string;pattern:string;ornament:string;elements:string[];decorations?:{motif:string;solid:boolean;treeOuterStars?:boolean;starOuterDiamonds?:boolean;opacity?:number}[];crestFill?:boolean;crestOpacity?:number;treeOuterStars?:boolean;crestStarOuterDiamonds?:boolean;patternStarOuterDiamonds?:boolean;motifFill:boolean;patternOpacity?:number;borderOpacity?:number};
export function motifRequirements(s?:AssetSelection){
 const plan={roses:new Set<string>(),trees:new Set<string>(),supplied:new Set<string>(),laurel:false,dragon:false};
 const add=(id:string,solid=false,outerStars=true,diamonds=true)=>{
  if(id==='dragon')plan.dragon=true;
  if(id==='vines'||id==='laurel')plan.laurel=true;
  if(roseAssets[id])plan.roses.add(id);
  if(id==='tree'){plan.trees.add(outerStars?lifeTreeAssets.stars:lifeTreeAssets.plain);if(solid)plan.trees.add(lifeTreeAssets.holes);}
  if(['stars','stars2','snow','constellation'].includes(id)){const layers=starLayers(id);plan.supplied.add(layers.body);if(diamonds)plan.supplied.add(layers.ring);}
 };
 if(!s){Object.keys(roseAssets).forEach(id=>add(id));Object.values(lifeTreeAssets).forEach(src=>plan.trees.add(src));Object.values(suppliedArtAssets).forEach(src=>plan.supplied.add(src));plan.laurel=plan.dragon=true;return plan;}
 if((s.crestOpacity??1)>0)add(s.crest,s.crestFill??s.motifFill,s.treeOuterStars,s.crestStarOuterDiamonds);
 const decorations:NonNullable<AssetSelection['decorations']>=s.decorations||s.elements.map(motif=>({motif,solid:s.motifFill}));
 for(const e of decorations)if((e.opacity??1)>0)add(e.motif,e.solid,e.treeOuterStars,e.starOuterDiamonds);
 const patterns:Record<string,string[]>={astral:['stars'],forest:['vines'],'rose-garden':['roses'],cathedral:['stars'],'royal-forest':['vines'],'dragon-ridge':['dragon'],'life-roots':['tree','vines'],'mist-watch':['vines']};
 const aliases:Record<string,string>={arcane:'astral',halo:'astral',ruins:'cathedral',mist:'forest','moon-garden':'astral',illumination:'forest',astrolabe:'astral'};
 const pattern=aliases[s.pattern]||s.pattern;
 if((s.patternOpacity??.08)>0){if(regionArt[pattern])plan.supplied.add(regionArt[pattern]);for(const id of patterns[pattern]||[])add(id,s.motifFill,s.treeOuterStars,s.patternStarOuterDiamonds);}
 if((s.borderOpacity??1)>0){if(s.ornament==='botanical')add('vines');if(s.ornament==='geometric')add('stars');}
 return plan;
}
