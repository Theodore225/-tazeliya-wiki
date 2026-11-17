# Background controls and loading improvements

- Background size (20–200%) and horizontal/vertical position (0–100%) use the same drawing code for pages, continuous PNG exports and printing. Defaults retain the existing composition; position applies to the repeating group. Values persist with the local draft and participate in style undo/redo.
- Removed the house motif from the library, presets and migration of old drafts. The orphanage title crest defaults to none.
- Only artwork used by the active crest, background, border or visible decorations is decoded. Concurrent requests share one promise; failures/timeouts are evicted so retry works.
- Preview text/vectors appear before slow font/artwork requests finish. Export waits for the selected fonts and required artwork, preserving complete output. Failure has an explicit retry control.
- The 15 runtime masks now total 1,265,806 bytes instead of 3,057,869 bytes (59% smaller). Indexed PNG preserves every alpha value; the build script verifies this pixel by pixel. Original files remain untouched. Hashed filenames allow safe long-term caching.
- Tiny inline thumbnails appear only near the visible part of the style panel and do not download full-size artwork. Regular embedded fonts are reused for synthesized bold, avoiding the extra 7 MB sans and 9.6 MB serif bold downloads. Font promises are shared between renders.

Validation: 37 automated tests, TypeScript, Worker build and GitHub Pages build. These optimizations reduce transfer/decode/render work; mainland carrier routing still requires testing on the users' actual networks.
