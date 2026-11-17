# Background controls and loading improvements

- Background size (20–200%) and horizontal/vertical position (0–100%) use the same drawing code for pages, continuous PNG exports and printing. Defaults retain the existing composition; each sheet has one composition, anchored to the full sheet coordinates, with no repetition even in long exports. Values persist with the local draft and participate in style undo/redo.
- Removed the house motif from the library, presets and migration of old drafts. The orphanage title crest defaults to none.
- Only artwork used by the active crest, background, border or visible decorations is decoded. Concurrent requests share one promise; failures/timeouts are evicted so retry works.
- Preview text/vectors appear before slow font/artwork requests finish. Export waits for the selected fonts and required artwork, preserving complete output. Failure has an explicit retry control.
- The 15 runtime masks now total 1,265,806 bytes instead of 3,057,869 bytes (59% smaller). Indexed PNG preserves every alpha value; the build script verifies this pixel by pixel. Original files remain untouched. Hashed filenames allow safe long-term caching.
- Tiny inline thumbnails appear only near the visible part of the style panel and do not download full-size artwork. Regular embedded fonts are reused for synthesized bold, avoiding the extra 7 MB sans and 9.6 MB serif bold downloads. Font promises are shared between renders.

Validation: 41 automated tests, TypeScript, Worker build and GitHub Pages build. These optimizations reduce transfer/decode/render work; mainland carrier routing still requires testing on the users' actual networks.


## Version 24: interaction and startup

- HSL controls and 18 named RGB presets (including Klein blue #002FA7) are shared by the paper, body, ornament, fill, element and selected-text color fields. Slider changes preview locally and commit on release/keyboard completion; HEX applies on blur/Enter. All saved colors remain six-digit sRGB HEX values.
- The live preview draws only the active page as a canvas at 760 × 1075. It no longer synchronously PNG-encodes all 1520 × 2150 pages after each edit. Up to three visited canvases are cached. Style-only changes reuse text wrapping; font, typography, body and title changes invalidate it. PNG and print exports still render at 1520 × 2150 per page.
- Paper noise and linen lines reuse a transparent texture. Long-image tiles share the same texture coordinates and a single absolute background anchor.
- Selected font and artwork requirements have separate loading effects, so moving/recoloring a loaded design does not restart loading. Archive sections and the rich editor use independent lazy chunks, and the long-image encoder loads on export.
- Browser QA: 8-page sample, page navigation, HSL + named colors, single background composition, full-resolution PNG and continuous export. Actual mainland carrier latency and mobile-device timings are not inferred from this browser.
