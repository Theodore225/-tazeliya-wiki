# Setting-based visual presets

Source provided by the user: https://shimo.im/docs/NJkbnL7d2vhWK1kR/
Regional descriptions read at: https://shimo.im/docs/Wr3DpgG5NEhEx23J

The palettes and drawn motifs are original interpretations, not canonical flags or national emblems.

- 莱恩维亚王国: central old kingdom; plains, woods, rivers, royal knights. Sage paper, antique gold, crown, vines and sword.
- 奥德雷克帝国: western mountains/canyons, centralized military rule and magical technology. Iron blue, brass, gears and crystals.
- 瓦伦蒂斯王国: southeastern islands, precious stones and maritime commerce. Seafoam, gold, compass and wave charts.
- 埃斯尔教国: eastern theocracy, valleys/forests/lakes. Ivory, gold, solar crest and cathedral arches.
- 伊斯特芬王国: snowy northern kingdom, adjacent to 巨龙峡谷. Ice blue, snow crystals, mountain outlines and dragon motif.
- 格诺希斯魔法学校: between 莱恩维亚 and 埃斯尔, branches across nations. Violet blue, diagrams and constellations.
- 精灵之森: the life tree is the origin and return of elves. Leaf green, branching roots and vines.
- 白域: constant daytime under an artificial sun, inhabited by angels. Pale gold, solar halos and wings.
- 神弃之地: western sealed wasteland, faint returning life. Ash charcoal, seal diagrams and vines.
- 幽雾森林: black-mist forbidden forest between 神弃之地 and 奥德雷克. Deep grey green and ghostly branches.
- 无国籍: independent, freely customizable paper with no national attribution.

## Export

A4 layout and continuous long layout share text wrapping and drawing primitives. Long PNGs use streamed zlib scanlines in 512 logical-pixel tiles, so no full-height canvas is allocated. This avoids mobile canvas area limits while preserving every line. The export dialog uses a first-strip thumbnail instead of decoding a potentially huge full image. PNG download and the native Share API use explicit user gestures.

## Editable typography and profiles (version III)

Body content uses a structured rich-text document. Inline bold, italic, underline, opaque hex colors and embedded font-family selections are preserved in browser drafts and both export layouts. A shared layout measures each styled run before wrapping it, so formatting does not disappear at line/page boundaries. CSS and canvas use the same families and sRGB hex colors; the streamed PNG includes an sRGB chunk and text is painted at full opacity.

The two user-supplied templates have identical sets of 16 fields and distinct literal headers. Imported labels are normal editable text with an initial bold mark. New values typed immediately after a label use a non-inclusive bold boundary, so the value stays normal. Switching templates changes the header and retains field values, inline marks and deleted entries. Switching back to content mode never deletes the profile or story. The explicit "再插入一份" action is available for another blank record.

Regression checks: `node --test tests/rich-text.test.cjs` covers exact field sets, deletions and values during mode changes, rich style retention across long and paginated layouts, and explicit color priority over quote styles.
