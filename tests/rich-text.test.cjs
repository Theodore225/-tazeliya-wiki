const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const {test}=require('node:test');const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
function context(){return {font:'20px serif',fillStyle:'',strokeStyle:'',globalAlpha:1,globalCompositeOperation:'source-over',calls:[],stack:[],save(){this.stack.push({font:this.font,fillStyle:this.fillStyle,strokeStyle:this.strokeStyle,globalAlpha:this.globalAlpha,globalCompositeOperation:this.globalCompositeOperation})},restore(){Object.assign(this,this.stack.pop()||{})},fillRect(){},strokeRect(){},roundRect(){},drawImage(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fill(){},translate(){},rotate(){},scale(){},transform(){},arc(){},ellipse(){},bezierCurveTo(){},quadraticCurveTo(){},closePath(){},measureText(text){const size=+(this.font.match(/([\d.]+)px/)?.[1]||20);return{width:Array.from(text).reduce((sum,c)=>sum+(c.charCodeAt(0)>255?size:size*.55),0)}},fillText(text,x,y){this.calls.push({text,font:this.font,color:this.fillStyle,alpha:this.globalAlpha,x,y})}};}
global.Path2D=class{constructor(d){this.d=d}};
global.document={createElement(){const c={width:0,height:0,getContext(){const ctx=context();ctx.canvas=c;return ctx}};return c}};
const rich=require('../lib/rich-text.ts');const manuscript=require('../lib/manuscript.ts');
test('both user-supplied profiles have the exact 16 editable labels, with labels bold and values normal',()=>{for(const mode of ['profile','full-profile']){const doc=rich.profileTemplate(mode);assert.equal(rich.plainNode(doc.content[0]),rich.profileTitles[mode]);assert.equal(doc.content.length,19);for(let i=0;i<16;i++){const p=doc.content[i+1];assert.equal(p.content[0].text,rich.profileFields[i]);assert.equal(p.content[0].marks[0].type,'bold');assert.equal(p.content[1].marks,undefined);}}});
const drafts=require('../lib/drafts.ts');const images=require('../lib/images.ts');const motifs=require('../lib/motifs.ts');
test('all three modes retain their own body, title, images and deleted fields without appending',()=>{
 let s=drafts.initializeDrafts({...manuscript.defaults});const original=s.text;
 s=drafts.switchDraft(s,'profile');assert(!s.text.includes('暮色'));assert.equal(s.title,'人物档案');
 let richText=structuredClone(s.richText);richText.content=richText.content.filter(n=>!rich.plainNode(n).startsWith('等级：'));
 richText.content[1].content.push({type:'text',text:'卡利戈',marks:[{type:'textStyle',attrs:{color:'#225588'}}]});
 richText.content.push({type:'image',attrs:{src:'blob:sample',assetId:'portrait',width:100,height:200}});
 s={...s,title:'角色甲',richText,text:rich.toPlainText(richText)};
 s=drafts.switchDraft(s,'full-profile');assert(!s.text.includes('卡利戈'));assert(!s.text.includes('暮色'));assert(s.text.includes('等级：'));
 s=drafts.switchDraft(s,'profile');assert.equal(s.title,'角色甲');assert(s.text.includes('卡利戈'));assert(!s.text.includes('等级：'));assert(s.richText.content.some(n=>n.type==='image'));
 s=drafts.switchDraft(s,'content');assert.equal(s.text,original);assert(!s.text.includes('人设表'));
 const saved=images.stripImageUrls(drafts.snapshotDrafts(s));assert(!JSON.stringify(saved).includes('blob:'));assert.equal(saved.documents.profile.richText.content.at(-1).attrs.assetId,'portrait');
});
test('legacy appended profile is separated from its story without losing formatted field values',()=>{
 const form=rich.profileTemplate('profile');form.content[1].content.push({type:'text',text:'旧角色',marks:[{type:'bold'}]});
 const old={...manuscript.defaults,contentMode:'profile',title:'人物档案',richText:{type:'doc',content:[...form.content,...rich.fromPlainText('原有故事').content]}};old.text=rich.toPlainText(old.richText);
 const migrated=drafts.initializeDrafts(old);assert(migrated.text.includes('旧角色'));assert(!migrated.text.includes('原有故事'));
 assert(drafts.switchDraft(migrated,'content').text.includes('原有故事'));assert(!drafts.switchDraft(migrated,'full-profile').text.includes('旧角色'));
});
test('image layout preserves document order, aspect ratio and bounds in pages and continuous long exports',()=>{
 const doc={type:'doc',content:[...rich.fromPlainText('前文'.repeat(1600)).content,{type:'image',attrs:{src:'blob:test',width:600,height:1800,widthPercent:75,alignment:'right'}},...rich.fromPlainText('最后一段').content]};
 for(const mode of ['pages','long']){const m=manuscript.layoutManuscript({...manuscript.defaults,richText:doc},mode);const runs=m.sheets.flatMap(p=>p.runs);const img=runs.find(r=>r.image);assert(img);assert(Math.abs(img.image.height/img.image.width-3)<.0001);assert(Math.abs(img.x+img.image.width-666)<.0001);assert(runs.indexOf(img)<runs.findIndex(r=>r.text==='最后一段'));if(mode==='pages'){const sheet=m.sheets.find(p=>p.runs.includes(img));assert(img.y>=115);assert(img.y+img.image.height<=975);}else{assert(m.sheets[0].height>1075);assert(img.y+img.image.height<m.sheets[0].height-90);}}
});
test('every drawn motif is a deliberate closed vector silhouette while dragon uses recolorable masks from the supplied raster',()=>{assert.equal(new Set(motifs.motifOptions.map(m=>m.id)).size,motifs.motifOptions.length);for(const option of motifs.motifOptions.filter(({id})=>id!=='dragon')){const paths=motifs.motifPaths[option.id];assert(paths.length);for(const d of paths)assert(/Z$/.test(d));}assert.equal(motifs.rasterMotifAssets.dragonInk,'./dragon-head-ink.png');assert.equal(motifs.rasterMotifAssets.dragonHighlight,'./dragon-head-highlight.png');});
test('local bold, color, italic and font survive both pagination and long-image layout',()=>{const fragment=[{type:'text',text:'星辰🌙',marks:[{type:'bold'},{type:'textStyle',attrs:{color:'#C23A53',fontFamily:'"ArcaneBrush", serif'}}]},{type:'text',text:'与森林 Avery',marks:[{type:'italic'}]}];const richText={type:'doc',content:[{type:'paragraph',content:Array.from({length:350},()=>fragment).flat()}]};const text=rich.toPlainText(richText);for(const mode of ['pages','long']){const result=manuscript.layoutManuscript({...manuscript.defaults,title:'TITLE',subtitle:'',text,richText},mode);const runs=result.sheets.flatMap(s=>s.runs).filter(r=>!['TITLE','__separator__'].includes(r.text));assert.equal(runs.map(r=>r.text).join(''),text);assert(runs.some(r=>r.bold&&r.color==='#c23a53'&&r.fontFamily.includes('ArcaneBrush')));assert(runs.some(r=>r.italic));if(mode==='long'){assert.equal(result.sheets.length,1);assert(result.sheets[0].height>1075);}else assert(result.sheets.length>1);for(const sheet of result.sheets)for(const run of sheet.runs)assert(run.y<sheet.height-90);}});
test('explicit selected color wins over quote color and is painted at full opacity',()=>{const richText={type:'doc',content:[{type:'blockquote',content:[{type:'paragraph',content:[{type:'text',text:'红色引文',marks:[{type:'bold'},{type:'textStyle',attrs:{color:'rgb(34, 85, 136)'}}]}]}]}]};const s={...manuscript.defaults,title:'TITLE',subtitle:'',ornament:'none',crest:'none',paper:'white',elements:[],richText};const m=manuscript.layoutManuscript(s);const c=context();manuscript.paintSheet(c,m,m.sheets[0]);const painted=c.calls.find(r=>r.text==='红色引文');assert.equal(painted.color,'#225588');assert.equal(painted.alpha,1);assert(painted.font.startsWith('700 '));assert.equal(rich.opaqueColor('#abc'),'#aabbcc');});
const decorations=require('../lib/decorations.ts');const frame=require('../lib/paper-frame.ts');
test('legacy ornaments migrate once, preserving removal and independent copies, colors, size and positions',()=>{
 const old={elements:['moon','wings'],motifColor:'#536b59',motifFill:true};const first=decorations.migrateDecorations(old,'#947541');assert.equal(first.decorations.length,2);assert.equal(first.decorations[1].motif,'wing');assert.equal(first.decorations[0].color,'#536b59');assert.equal(first.decorations[0].solid,true);
 const edited={...first,decorations:[{...first.decorations[0],id:'one',x:20,y:30,size:80,color:'#af5265'},{...first.decorations[0],id:'two',x:83,y:71,size:120,color:'#225588'}]};
 const restored=decorations.migrateDecorations(JSON.parse(JSON.stringify(edited)),'#ffffff');assert.deepEqual(restored.decorations,edited.decorations);assert.notEqual(restored.decorations[0].id,restored.decorations[1].id);
 assert.equal(decorations.migrateDecorations({...first,decorations:[]},'#ffffff').decorations.length,0);
 const invalid=decorations.normalizeDecoration({...edited.decorations[0],size:300,x:-10,y:105});assert.equal(invalid.size,240);assert.equal(invalid.x,0);assert.equal(invalid.y,100);
 for(const height of [1075,9000])assert.deepEqual(decorations.decorationPosition(edited.decorations[1],760,height),{x:630.8,y:height*.71,size:120});
});
test('double-line band uses an even-odd hole and fills independently of corner ornament settings',()=>{
 for(const {id} of motifs.borderOptions.filter(o=>o.id!=='none')){const d=frame.frameBandPath(id,760,1075);assert.equal((d.match(/M/g)||[]).length,2);assert.equal((d.match(/Z/g)||[]).length,2);const c=context(),fills=[];c.fill=function(path,rule){fills.push({path,rule,color:this.fillStyle})};frame.paperFrame(c,id,760,1075,'#536b59',false,true);assert(fills.some(f=>f.rule==='evenodd'&&f.color==='#536b59'&&f.path.d===d));const empty=context(),hollow=[];empty.fill=(...args)=>hollow.push(args);frame.paperFrame(empty,id,760,1075,'#536b59',false,false);assert.equal(hollow.length,0);}
});
test('free elements paint their exact individual color and size and title typography stays separate from body',()=>{
 const s={...manuscript.defaults,title:'TITLE',titleFont:'xiaowei',paper:'white',ornament:'none',crest:'none',pattern:'plain',elements:[],richText:rich.fromPlainText('正文'),decorations:[{id:'red',motif:'moon',x:20,y:30,size:120,color:'#af5265',solid:true},{id:'blue',motif:'crystal',x:83,y:71,size:80,color:'#225588',solid:true}]};
 for(const mode of ['pages','long']){const m=manuscript.layoutManuscript(s,mode),c=context(),fills=[],moves=[];c.fill=function(path,rule){fills.push({color:this.fillStyle,rule})};c.translate=(x,y)=>moves.push([x,y]);manuscript.paintSheet(c,m,m.sheets[0]);assert(fills.some(f=>f.color==='#af5265'));assert(fills.some(f=>f.color==='#225588'));assert(moves.some(([x,y])=>x===152&&y===m.sheets[0].height*.3));assert(m.sheets[0].runs.find(r=>r.text==='TITLE').fontFamily.includes('ArcaneXiaowei'));assert(!m.sheets[0].runs.find(r=>r.text==='正文').fontFamily);}
});
const worldsModule=require('../lib/worlds.ts');const navigation=require('../lib/navigation.ts');
test('highlights compose with bold, italic, selected fonts and exact text color across line/page wrapping',()=>{
 const marks=[{type:'bold'},{type:'italic'},{type:'textStyle',attrs:{color:'#225588',fontFamily:'"ArcaneWenkai", serif'}},{type:'highlight',attrs:{color:'rgb(255, 255, 0)'}}];
 const doc={type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'高亮文字与森林'.repeat(800),marks}]}]};
 for(const mode of ['pages','long']){const m=manuscript.layoutManuscript({...manuscript.defaults,richText:doc},mode);const runs=m.sheets.flatMap(p=>p.runs).filter(r=>r.highlight);assert(runs.length>20);assert.equal(runs.map(r=>r.text).join(''),'高亮文字与森林'.repeat(800));for(const r of runs){assert.equal(r.highlight,'#ffff00');assert.equal(r.color,'#225588');assert(r.bold&&r.italic);assert(r.fontFamily.includes('ArcaneWenkai'));}}
 const m=manuscript.layoutManuscript({...manuscript.defaults,paper:'white',pattern:'plain',crest:'none',ornament:'none',elements:[],richText:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'高亮',marks}]}]}}),c=context(),rects=[];
 c.fillRect=function(x,y,w,h){rects.push({x,y,w,h,color:this.fillStyle,alpha:this.globalAlpha})};manuscript.paintSheet(c,m,m.sheets[0]);assert(rects.some(r=>r.color==='#ffff00'&&r.w>0&&r.h>0&&r.alpha===1));assert(c.calls.some(r=>r.text==='高亮'&&r.color==='#225588'&&r.font.includes('700 ')));
});
test('border, pattern and every element use independent opacity without fading text/highlights',()=>{
 const s={...manuscript.defaults,paper:'white',pattern:'astral',patternOpacity:.15,ornament:'geometric',borderColor:'#010203',borderBandFill:true,borderOpacity:.25,crest:'none',decorations:[{id:'one',motif:'moon',x:60,y:30,size:80,color:'#445566',solid:true,opacity:.6}],richText:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'正常正文',marks:[{type:'highlight',attrs:{color:'#ffff00'}}]}]}]}};
 const m=manuscript.layoutManuscript(s),c=context(),fills=[],strokes=[],rects=[];
 c.fill=function(path,rule){fills.push({color:this.fillStyle,alpha:this.globalAlpha,rule})};c.stroke=function(path){strokes.push({color:this.strokeStyle,alpha:this.globalAlpha})};c.fillRect=function(x,y,w,h){rects.push({color:this.fillStyle,alpha:this.globalAlpha})};manuscript.paintSheet(c,m,m.sheets[0]);
 assert(fills.some(r=>r.color==='#010203'&&r.alpha===.25&&r.rule==='evenodd'));assert(fills.some(r=>r.color==='#445566'&&r.alpha===.6));assert(strokes.some(r=>r.alpha===.15));assert(c.calls.some(r=>r.text==='正常正文'&&r.alpha===1));assert(rects.some(r=>r.color==='#ffff00'&&r.alpha===1));
 assert.equal(decorations.normalizeDecoration({...s.decorations[0],opacity:2}).opacity,1);assert.equal(decorations.normalizeDecoration({...s.decorations[0],opacity:-1}).opacity,0);assert.equal(decorations.normalizeDecoration({...s.decorations[0],opacity:undefined}).opacity,1);
});
test('both profiles honor first-line indent while their template headers stay centered',()=>{
 for(const contentMode of ['profile','full-profile']){const s={...manuscript.defaults,contentMode,richText:rich.profileTemplate(contentMode)};for(const mode of ['pages','long']){const on=manuscript.layoutManuscript({...s,indent:true},mode),off=manuscript.layoutManuscript({...s,indent:false},mode);const first=m=>m.sheets.flatMap(p=>p.runs).find(r=>r.text==='姓名：');assert.equal(first(on).x-first(off).x,s.size*2);const header=m=>m.sheets[0].runs.find(r=>r.text===rich.profileTitles[contentMode]);assert.equal(header(on).x,header(off).x);}}
});
test('each country/region has a distinct supported pattern and emblem and migration retains customized elements',()=>{
 const regions=worldsModule.worlds.filter(w=>w.id!=='none');assert.equal(new Set(regions.map(w=>w.pattern)).size,regions.length);assert.equal(new Set(regions.map(w=>w.crest)).size,regions.length);
 for(const w of regions){assert(worldsModule.patterns.some(p=>p.id===w.pattern));assert(motifs.motifPaths[w.crest]);assert(w.elements.every(id=>motifs.motifPaths[id]));const s={...manuscript.defaults,...manuscript.worldSettings(w.id)};assert.equal(s.worldArtVersion,2);assert.equal(s.pattern,w.pattern);}
 const custom={...manuscript.defaults,country:'elven',pattern:'forest',crest:'vines',decorations:[{id:'handplaced',motif:'moon',x:52,y:67,size:88,color:'#225588',solid:true,opacity:.4}]};const next=worldsModule.upgradeWorldArtwork(custom);assert.equal(next.pattern,'life-roots');assert.equal(next.crest,'tree');assert.deepEqual(next.decorations,custom.decorations);assert.equal(worldsModule.upgradeWorldArtwork({...next,pattern:'plain'}).pattern,'plain');
});
test('welcome replays on a fresh link visit and stays skipped on reload, tab restoration or history return',()=>{
 assert.equal(navigation.skipWelcome('navigate',true),false);assert.equal(navigation.skipWelcome('navigate',false),false);assert.equal(navigation.skipWelcome('reload',true),true);assert.equal(navigation.skipWelcome('back_forward',true),true);assert.equal(navigation.skipWelcome('reload',false),false);assert.equal(navigation.skipWelcome('navigate',true,true),true);
});
const creatureModule=require('../lib/creatures.ts');
test('bestiary contains four canonical classes and eight original creatures, grouped and alphabetized without changing source copy',()=>{
 assert.equal(creatureModule.creatures.filter(c=>c.kind==='大类生物').length,4);assert.equal(creatureModule.creatures.filter(c=>c.kind==='自创生物').length,8);assert.equal(creatureModule.creatureGroups.length,4);
 for(const group of creatureModule.creatureGroups){const keys=group.creatures.map(c=>c.sortKey);assert.deepEqual(keys,[...keys].sort((a,b)=>a.localeCompare(b,'en')));}
 assert.equal(creatureModule.creatures.find(c=>c.id==='nightfluff').name,'Nigntfluff（夜绒）');assert(creatureModule.creatures.find(c=>c.id==='blood-moon-jellyfish').paragraphs.some(p=>p.text.includes('下弦月时，时完全暴露')));assert.equal(creatureModule.sightingNote,'影像记录：此魔法生物尚未被成功目击');
});
test('wing and life-tree use detailed vectors while dragon uses the exact supplied image without a fill mode',()=>{
 for(const id of ['wing','tree']){assert(motifs.motifPaths[id].length);assert((motifs.motifStrokes[id]||[]).length>=4);}
 assert.equal(motifs.motifPaths.dragon.length,0);assert.equal(motifs.motifStrokes.dragon.length,0);
 assert.equal(motifs.rasterMotifAssets.dragon,'./dragon-head-original.png');assert.equal(motifs.rasterMotifAssets.dragonInk,'./dragon-head-ink.png');
 assert(motifs.motifStrokes.tree.some(path=>!path.trim().endsWith('Z')));assert(motifs.motifOptions.some(m=>m.id==='home'));
});
const paste=require('../lib/paste.ts');
test('multi-paragraph paste removes extra blank rows and inherited spacing without changing copy',()=>{
 assert.equal(paste.normalizePastedText('第一段\r\n\r\n  \r\n第二段  \r\n第三段'),'第一段\n第二段\n第三段');
 assert.equal(paste.normalizePastedText('  开头保留\n\n结尾'),'  开头保留\n结尾');
 const source=fs.readFileSync(path.join(__dirname,'../components/rich-editor.tsx'),'utf8');
 assert(source.includes('transformPastedHTML:normalizePastedHTML'));assert(source.includes('transformPastedText:normalizePastedText'));
});
test('every bestiary habitat category exposes an accessible collapse control',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../components/creature-bestiary.tsx'),'utf8');
 assert(source.includes('aria-expanded={!collapsed.has(group.id)}'));assert(source.includes('aria-controls={`creature-category-${group.id}`}'));
});
const characterModule=require('../lib/characters.ts');const historyModule=require('../lib/history.ts');
test('continental character archive preserves five source records, alphabetical order and an empty stars category',()=>{
 assert.equal(characterModule.characterCategories.length,2);assert.equal(characterModule.chronicleCharacters.length,5);
 const keys=characterModule.chronicleCharacters.map(character=>character.sortKey);assert.deepEqual(keys,[...keys].sort((a,b)=>a.localeCompare(b,'en')));
 assert.deepEqual(characterModule.chronicleCharacters.map(character=>character.name),['纯白之弦','恶雪觉者','决意之金红','霓彩泡影','群星旅者']);
 assert(characterModule.chronicleCharacters.find(character=>character.id==='wicked-snow-awakened').paragraphs.some(paragraph=>paragraph.text.includes('井水清冽，行者不渴。')));
 const source=fs.readFileSync(path.join(__dirname,'../components/character-chronicle.tsx'),'utf8');assert(source.includes('aria-controls={`character-category-${category.id}`}'));assert(source.includes('我们仍追寻着前人的光辉。'));
});
test('continental history exposes four eras, exact quick summaries and only source-backed expandable detail',()=>{
 assert.deepEqual(historyModule.historyEras.map(era=>era.name),['新纪年前','战争之后','魔族讨伐战','近代史']);
 assert.equal(historyModule.historyEras.flatMap(era=>era.events).length,38);
 assert.equal(historyModule.historyEras[0].events.find(event=>event.id==='b410').detail,undefined);
 assert(historyModule.historyEras[0].events.find(event=>event.id==='b420').detail.some(paragraph=>paragraph.includes('无限学习无限提升的能力')));
 assert(historyModule.historyEras[2].events.find(event=>event.id==='d500').detail.some(paragraph=>paragraph.includes('百名拥有圣洁羽翼的神明使徒')));
 assert.equal(historyModule.historyEras[3].events.find(event=>event.id==='m930').summary,'神弃之地封印开始减弱。');
 const source=fs.readFileSync(path.join(__dirname,'../components/history-chronicle.tsx'),'utf8');assert(source.includes('以下记载来自莱恩维亚中心图书馆'));assert(source.includes('className="timeline-line"'));assert(source.includes('disabled={!hasDetail}'));
});
test('mobile passage sub-navigation has a dedicated second row and cannot overlap realm tabs',()=>{
 const css=fs.readFileSync(path.join(__dirname,'../app/globals.css'),'utf8');
 assert(css.includes('.realm-sidebar:has(.realm-subnav){min-height:91px;padding-bottom:50px}'));
 assert(css.includes('.realm-subnav{left:0;right:0;bottom:0;z-index:2'));
});
test('quote indentation is editable whitespace and survives plain-text round trips exactly',()=>{
 const source='>   自由空格后的引用\n>\u3000默认全角缩进\n>顶格引用';
 assert.equal(rich.toPlainText(rich.fromPlainText(source)),source);
 assert.equal(rich.needsQuoteIndent('引用'),true);
 for(const text of [' 引用','\u00a0引用','\u3000引用'])assert.equal(rich.needsQuoteIndent(text),false);
 const editor=fs.readFileSync(path.join(__dirname,'../components/rich-editor.tsx'),'utf8');
 assert(editor.includes("tr.insertText('\\u3000'"));
 assert(editor.includes('onClick={toggleQuote}'));
});
test('consecutive spaces wrap in place instead of moving together to the final visual line',()=>{
 const text='甲'.repeat(26)+' '.repeat(8)+'乙';
 const richText={type:'doc',content:[{type:'paragraph',content:[{type:'text',text}]}]};
 const m=manuscript.layoutManuscript({...manuscript.defaults,title:'TITLE',subtitle:'',crest:'none',richText});
 const body=m.sheets.flatMap(sheet=>sheet.runs).filter(run=>run.text!=='TITLE'&&run.text!=='__separator__');
 assert.equal(body.map(run=>run.text).join(''),text);
 assert(body[0].text.endsWith(' '),'the first fitting space remains on its original line');
 assert(body.some((run,index)=>index>0&&run.text.includes('乙')));
});
