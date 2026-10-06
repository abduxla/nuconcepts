# ⚠️ The photography on this site is AI-generated placeholder imagery

**Read this before the site goes live on nuconceptstore.com, and before the
preview link is forwarded to anyone outside NuConcepts.**

All 37 images in `assets/images/` were generated with an AI image model
(Higgsfield, `z_image`) on 2026-09-10. They exist so the layout can be reviewed
and presented as a finished design rather than a grid of empty boxes.

## What that means

- **They are not photographs of the real projects.** Miss Ceylon, Angel Beach,
  Terrene Villas, Abode Ahangama and The Fort Printers are real businesses at
  real addresses. The images filed under their names are *generic tropical
  interiors in the right style* — they do not show those properties, their
  actual rooms, or work NuConcepts actually carried out there.
- **They are not owned by NuConcepts** and carry no photographer credit or
  release.
- **Publishing them as a portfolio would misrepresent the studio's work** to
  its own customers, and would misrepresent five third-party hotels.

So: fine for an internal design review or a pitch where everyone knows the
imagery is indicative. **Not fine on the live site.**

## Otherlands, Adarya Villas and Uyana have no photography

These three projects are listed but no photographs of them have been supplied.
Their cards show `projects/pending-01..03.jpg` — frames taken from the
workshop film, dimmed, captioned PHOTOGRAPHY COMING SOON.

They are deliberately workshop scenes (a chair frame being assembled, a curved
table top being marked out, a chair being worked on) rather than finished
interiors, so that no one reads them as a photograph of the venue itself. None
of the three has a detail page for the same reason.

Replace them with real photographs of each project, then build the three
pages out in tools/build-projects.mjs like the others.

## The film band is REAL footage — not a placeholder

`assets/video/story.mp4` / `story.webm` is NuConcepts' own workshop film:
their team, their workshop, their drawings, with the nu concepts mark in the
frame. The band still (`assets/images/story-band.jpg`) and the player poster
(`assets/images/story-poster.jpg`) are frames taken from it.

It came from `Wood Workshop Corrected.mp4`, a 419 MB 1080x1920 master at
~47 Mbit/s, transcoded for the web: H.264 CRF 24 and VP9 CRF 34, audio at
128k AAC / 96k Opus. SSIM against the master is 0.982, so the 23x size cut is
not visible at the size it plays.

It is hosted on this site rather than YouTube because the YouTube upload is
blocked by a copyright notice, which is why it would not play in a frame.
The footage is NuConcepts' own, so the claim is almost certainly against the
music on the soundtrack. Worth settling, because the same soundtrack is in
the file served here: see the note in README.md.

## The hero clip is also a placeholder

`assets/video/hero.webm` (2.2 MB, VP9) and `assets/video/hero.mp4` (1.0 MB,
H.264, for Safari and iOS) are the same 9-second clip **rendered from the
placeholder hero still** — 1920x1080, a slow push-in with a warm key light
raking across the frame and the shadow travelling the other way. It is real
video, but it is not footage: nothing was filmed, and the room in it is the
same generated image as `hero.jpg`.

1080p is the ceiling here, not a choice: `hero.jpg` is 1920x1080, so there is
no 4K detail to draw on. Rendering the clip larger would only upscale the same
pixels into a heavier file. Genuine 4K needs a 4K source — real footage, or a
4K photograph of the space.

So it carries the same caveat as the photographs. Replace both with a real clip
of NuConcepts' own work before launch, at the same two paths — the hero lists
them in that order and plays the first the browser can decode.

Keep a real clip short, muted and compressed: a few seconds, 1080p, looping,
ideally under about 5 MB. Deleting the file is safe — the still returns, with
the CSS lighting back over it.

## Replacing them

Every image is a plain JPEG at the exact path the HTML expects, so replacing
them is a straight file swap — keep the filename, drop in the real photo, done.
No code changes needed.

| Path | Slot | Shipped aspect |
| --- | --- | --- |
| `assets/images/hero.jpg` | Homepage hero | 16:9 |
| `assets/images/workshop.jpg` | Workshop section | 3:4 |
| `assets/images/projects/<slug>-hero.jpg` | Project card + project page hero | 16:9 |
| `assets/images/projects/<slug>-01.jpg` | Gallery, full width | 16:9 |
| `assets/images/projects/<slug>-02.jpg` | Gallery, half width | 4:3 |
| `assets/images/projects/<slug>-03.jpg` | Gallery, half width | 4:3 |
| `assets/images/projects/<slug>-04.jpg` | Gallery, full width | 16:9 |
| `assets/images/projects/<slug>-05.jpg` | Gallery, half width | 4:3 |
| `assets/images/projects/<slug>-06.jpg` | Gallery, half width | 4:3 |

`<slug>` is one of `miss-ceylon`, `angel-beach`, `terrene-villas`,
`abode-ahangama`, `the-fort-printers`.

Sizing: resize real photos to about **1920px on the long edge**, JPEG quality
~80. That is what the current set uses (~300KB each, ~12MB total). Anything
straight off a camera will make the site slow.

The gallery captions in `tools/build-projects.mjs` describe what each shot is
meant to show — update them to match the real photographs, then re-run
`node tools/build-projects.mjs`.

## If a slot is ever empty

Deleting an image does not break the page. `site.js` detects the missing file,
hides the broken `<img>`, and the CSS falls back to a designed gradient panel
labelled with that image's alt text. So you can delete all 37 of these and ship
real photos gradually.

## Also still to review

See the "Before this goes live" section of `README.md` — the project
descriptions and FAQ answers need NuConcepts to check them too.
