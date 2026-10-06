# Placeholder image prompts

The site's project photography is AI-generated placeholder imagery — see
PLACEHOLDERS.md. These are the prompts for the three cards that still have no
image of their own, written to match the look of the existing set: warm
natural light, teak and rattan, off-white lime plaster, linen, open to the sea
or the garden, shot like an interiors magazine rather than a hotel listing.

Model used for the original 37: Higgsfield, `z_image`. Keep to that model so
the new three sit with the rest.

Output: **portrait 4:5** (the card ratio), about 1600x2000, saved as

- `assets/images/projects/otherlands-hero.jpg`
- `assets/images/projects/adarya-villas-hero.jpg`
- `assets/images/projects/uyana-hero.jpg`

Then in `index.html` swap each pending card over to a normal `work-card`:
drop `media--pending` and its `data-label`, point the `<img>` at the new file,
and give the card an `href` once a detail page exists.

## Done 2026-10-06 — how these were actually run

All three were generated on `z_image` via the Higgsfield MCP server and are in
place; the `index.html` swap above is done. The cards are plain `work-card`
`<div>`s with no `href`, because none of the three has a detail page yet.

Two things to know before regenerating:

- **`z_image` does not offer 4:5.** Its aspect ratios are 1:1, 4:3, 3:4, 16:9,
  9:16. These were generated at **3:4** (1536x2048) and cropped to 1536x1920 —
  exact 4:5, 1920 on the long edge, no upscaling — taking the 128px off the
  **bottom**, which drops surplus floor and keeps the ceiling detail:

      ffmpeg -i in.png -vf "crop=1536:1920:0:0" -q:v 3 out.jpg

- **Submit them one at a time.** A parallel batch of three tripped a 429
  `rate_limit_reached` on the free plan and only one of the three survived.

Cost was 0.15 credits per image, 0.45 for the set.

---

## Shared style suffix

Append to each prompt:

> Shot on a 35mm lens at f/4, soft diffused tropical daylight, no artificial
> lighting, natural colour, muted warm palette of teak brown, sand, off-white
> and sage, matte lime-plaster walls, interiors magazine photography, calm and
> unstyled, no people, no text, no logos, no signage.

---

## 1. Otherlands — Hospitality, Galle

> Interior of a small boutique hotel lounge in a restored Dutch-colonial
> building in Galle Fort, Sri Lanka. Thick whitewashed walls, tall shuttered
> windows with weathered timber frames, polished red terracotta floor tiles.
> A low solid-teak daybed with cream linen cushions, a pair of rattan lounge
> chairs, a dark timber side table with a ceramic vessel. A slow ceiling fan
> overhead, a planter of monstera in the corner. Late-afternoon light falling
> through the shutters in long bars across the floor.

## 2. Adarya Villas — Hospitality, Ahangama

> Open-sided living pavilion of a small beachfront villa hotel in Ahangama,
> Sri Lanka. Polished concrete floor, exposed timber rafters under a tiled
> roof, no glass on the seaward side — just teak columns framing palms and
> the ocean beyond. A long low teak sofa with off-white linen upholstery, a
> solid-timber coffee table, two woven rattan pendant lights hanging low.
> Bright midday sea light, strong shadows from the roof structure.

## 3. Uyana — Hospitality, Ahangama

> Garden-facing dining room of a small hospitality property in Ahangama,
> Sri Lanka. A long solid-teak dining table with ten spindle-back timber
> chairs, a woven jute rug beneath. Off-white lime-plaster walls, a run of
> folding timber doors opened onto a green tropical garden. A row of three
> rattan pendants above the table, a low teak sideboard against the far wall
> with ceramic bowls. Soft early-morning light, green reflections from the
> garden.
