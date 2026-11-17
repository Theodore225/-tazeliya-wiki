"use client";
import {useEffect,useRef,useState} from 'react';
import {drawLaurel,prepareLaurel} from '../lib/laurel-art';
import {roseAssets,isRose} from '../lib/rose-art';
import {lifeTreeAssets} from '../lib/life-tree';
import {motifId,motifPaths,rasterMotifAssets} from '../lib/motifs';
import {thumbnailAsset} from '../lib/asset-loader';
import {isEightPointStar,starLayers} from '../lib/supplied-art';
function MotifSwatchContent({id,solid=false,color,fillColor='#f1e5cb',treeOuterStars=true,starOuterDiamonds=true,starDiamondColor}:{id:string;solid?:boolean;color?:string;fillColor?:string;treeOuterStars?:boolean;starOuterDiamonds?:boolean;starDiamondColor?:string}){const normalized=motifId(id);if(isEightPointStar(normalized)){const layers=starLayers(normalized);return <span className="life-tree-swatch" aria-hidden="true" style={{color:color||'currentColor'}}><span style={{backgroundColor:'currentColor',WebkitMaskImage:`url(${thumbnailAsset(layers.body)})`,maskImage:`url(${thumbnailAsset(layers.body)})`}}/>{starOuterDiamonds&&<span style={{backgroundColor:starDiamondColor||'currentColor',WebkitMaskImage:`url(${thumbnailAsset(layers.ring)})`,maskImage:`url(${thumbnailAsset(layers.ring)})`}}/>}</span>;}if(normalized==='vines')return <LaurelSwatch solid={solid} color={color} fillColor={fillColor}/>;if(isRose(normalized))return <span className="life-tree-swatch" aria-hidden="true" style={{color:color||'currentColor'}}><span style={{backgroundColor:'currentColor',WebkitMaskImage:`url(${thumbnailAsset(roseAssets[normalized])})`,maskImage:`url(${thumbnailAsset(roseAssets[normalized])})`}}/></span>;if(normalized==='tree')return <span className="life-tree-swatch" aria-hidden="true" style={{color:color||'currentColor'}}>{solid&&<span style={{backgroundColor:fillColor,WebkitMaskImage:`url(${thumbnailAsset(lifeTreeAssets.holes)})`,maskImage:`url(${thumbnailAsset(lifeTreeAssets.holes)})`}}/>}<span style={{backgroundColor:'currentColor',WebkitMaskImage:`url(${thumbnailAsset(treeOuterStars?lifeTreeAssets.stars:lifeTreeAssets.plain)})`,maskImage:`url(${thumbnailAsset(treeOuterStars?lifeTreeAssets.stars:lifeTreeAssets.plain)})`}}/></span>;if(normalized==='dragon')return <span className="dragon-swatch" aria-hidden="true" style={{color:color||'currentColor'}}><span className="dragon-swatch-ink" style={{WebkitMaskImage:`url(${thumbnailAsset(rasterMotifAssets.dragonInk)})`,maskImage:`url(${thumbnailAsset(rasterMotifAssets.dragonInk)})`}}/><img src={thumbnailAsset(rasterMotifAssets.dragonHighlight)} alt=""/></span>;return <svg style={{color}} viewBox="-38 -38 76 76" width="30" height="30" aria-hidden="true"><path d={(motifPaths[normalized]||[]).join(' ')} fill={solid?'currentColor':'none'} fillRule="evenodd" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/></svg>}

function LaurelSwatch({solid,color,fillColor}:{solid:boolean;color?:string;fillColor:string}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{let cancelled=false;prepareLaurel().then(()=>{const canvas=ref.current;if(cancelled||!canvas)return;const c=canvas.getContext('2d');if(!c)return;c.clearRect(0,0,96,96);c.strokeStyle=color||getComputedStyle(canvas).color;c.fillStyle=fillColor;drawLaurel(c,48,48,46,solid);}).catch(()=>{});return()=>{cancelled=true;};},[solid,color,fillColor]);
 return <canvas ref={ref} className="life-tree-swatch" width={96} height={96} style={{color:color||'currentColor'}} aria-hidden="true"/>;
}

export function MotifSwatch(props:Parameters<typeof MotifSwatchContent>[0]){
 const ref=useRef<HTMLSpanElement>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{if(!ref.current)return;if(typeof IntersectionObserver==='undefined'){setVisible(true);return;}const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect();}},{rootMargin:'100px'});observer.observe(ref.current);return()=>observer.disconnect();},[]);
 return <span ref={ref} className="motif-swatch-lazy" aria-hidden="true">{visible&&<MotifSwatchContent {...props}/>}</span>;
}
