"""Extract exact supplied pixels; do not trace, redraw, or reshape the tree."""
from pathlib import Path
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

root = Path(__file__).resolve().parents[1]
plain = Image.open(sys.argv[1]).convert('RGBA')
starred = Image.open(sys.argv[2]).convert('RGBA')
assert plain.size == starred.size == (3000, 3000)
a, b = np.array(plain), np.array(starred)
assert not np.any((a[:, :, 3] > 128) & (b[:, :, 3] < 128)), 'Different tree outlines'
labels, count = ndimage.label(a[:, :, 3] < 128)
holes = np.zeros(labels.shape, dtype=bool)
found = 0
for number, box in enumerate(ndimage.find_objects(labels), 1):
    if box[0].start == 0 or box[1].start == 0 or box[0].stop == 3000 or box[1].stop == 3000:
        continue
    if np.count_nonzero(labels[box] == number) < 10:
        continue
    holes |= labels == number
    found += 1
assert found == 4, f'Expected four inner stars, found {found}'
# Cover the antialiased fringe behind the original ink without changing its edge.
holes = ndimage.binary_dilation(holes, iterations=2)
fill = np.zeros_like(a)
fill[:, :, :3] = 255
fill[:, :, 3] = np.where(holes, 255, 0)
crop = (285, 410, 2773, 2898)
out = root / 'public'
for name, im in [('life-tree', plain), ('life-tree-stars', starred), ('life-tree-holes', Image.fromarray(fill))]:
    im.crop(crop).save(out / (name + '.png'), optimize=True)
print('Preserved exact tree pixels; extracted four holes; outer stars remain in the ink layer.')
