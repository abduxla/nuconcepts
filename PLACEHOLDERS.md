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
