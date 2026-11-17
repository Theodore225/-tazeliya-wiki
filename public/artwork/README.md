# User-supplied artwork

Imported for the two eight-point-star elements and three regional backgrounds.
These are supplied designs, not generated or redrawn approximations.

| Reference | Original | Display layer |
| --- | --- | --- |
| Image 1 | originals/star-1.png | star-1.png (outline only) |
| Image 2 | originals/star-1-ring.png | star-1-ring.png (outer diamonds/dots only) |
| Image 3 | originals/star-2.png | star-2.png (solid body with transparent internal lines) |
| Image 4 | originals/star-2-ring.png | star-2-ring.png (outer diamonds/dots only) |
| Image 5 | originals/gnosis.png | gnosis.png — 格诺希斯魔法学校 |
| Image 6 | originals/yierda.png | yierda.png — 耶尔达孤儿院 |
| Image 7 | originals/esir.png | esir.png — 埃斯尔教国 |

Originals are preserved byte for byte. `node scripts/import-world-art.mjs`
recreates the alpha masks with the project's installed Sharp package. The four
white star references use their ink coverage as alpha; the three transparent
regional references use their original alpha. Display masks are 1280px square.
Only transparent margins are normalized for the regional images. The star and
ring layers share a fixed canvas, so toggling a ring never shifts the body.
Lanczos resampling and high-quality canvas smoothing soften scaling artifacts;
paths, internal holes, proportions and silhouettes are not redrawn or filled.

At runtime `source-in` tinting recolors existing pixels only. Region masks ignore
generic solid/hollow controls. Star 1 is permanently hollow, Star 2 permanently
solid; neither offers a fill-mode switch. Rings default to visible, retain the
supplied solid diamonds, and may use an independent color.
