Salveena — reels video folder
==============================

The homepage's "ভিডিওতে দেখুন" section looks for these three files:

  video/salveena-reel-1.mp4
  video/salveena-reel-2.mp4
  video/salveena-reel-3.mp4

Just drop your real Facebook-reels-style clips into this folder using
those exact filenames and they'll appear automatically — no code
changes needed.

Tips:
- Vertical video (9:16), like a normal FB/Instagram reel, fits the
  phone-frame UI best.
- Keep each clip under ~15MB if possible so it loads fast on mobile data.
- Until real files are added, each slot shows a "ভিডিও শীঘ্রই আসছে"
  placeholder automatically — the page won't break.

Want more or fewer than 3 reel slots? Copy/paste one of the
`<div class="phone-frame">...</div>` blocks in index.html (inside the
`#reels` section) and update the file paths.
