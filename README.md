# NuConcepts — website

Static marketing site for **NuConcepts**, an interior design and bespoke furniture studio in
Sri Lanka. No build step, no framework, no dependencies — plain HTML, one stylesheet, one script.

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .          # or: python -m http.server
```

## Structure

```
index.html                  Homepage
404.html                    Not-found page
style.css                   All styling (design tokens at the top)
site.js                     All interaction
robots.txt / sitemap.xml    SEO
assets/favicon.svg          Tab icon
assets/images/              Photography goes here (see below)
projects/*.html             Five project pages — GENERATED, do not edit by hand
tools/build-projects.mjs    Generates projects/*.html and sitemap.xml
```

### Editing a project page

The five project pages share one template, so they are generated rather than hand-written.
Edit the `PROJECTS` array in `tools/build-projects.mjs`, then:

```bash
node tools/build-projects.mjs
```

That rewrites all five pages and regenerates `sitemap.xml`. Editing `projects/*.html` directly
works, but the next build overwrites it.

## Photography — placeholders, must be replaced

> **The 37 images in `assets/images/` are AI-generated placeholders, not photos
> of the real projects. Read [PLACEHOLDERS.md](PLACEHOLDERS.md) before this goes
> live or before the preview link leaves NuConcepts.**

They are there so the design can be reviewed as a finished piece rather than a
grid of empty boxes. Replacing them is a straight file swap — keep the filename,
drop in the real photo, no code changes. The full path table is in
[PLACEHOLDERS.md](PLACEHOLDERS.md).

Naming, in short: `hero.jpg`, `workshop.jpg`, and per project
`projects/<slug>-hero.jpg` plus `projects/<slug>-01.jpg` … `-06.jpg`, where
`<slug>` is `miss-ceylon`, `angel-beach`, `terrene-villas`, `abode-ahangama` or
`the-fort-printers`.

Sizing: about **1920px on the long edge**, JPEG quality ~80 (the current set is
~300KB each, ~12MB total). Gallery images 01 and 04 run full width, so give
those the widest shots.

If an image file is missing the page still works: `site.js` hides the broken
`<img>` and a designed gradient panel labelled with the alt text stands in, so
real photos can be dropped in gradually.

## Before this goes live — please review

Some content was written to fill the pages out and **needs checking by NuConcepts**:

- **Project descriptions** in `tools/build-projects.mjs` describe the scope of each job in
  general terms. They are plausible but not sourced from project records — replace them with
  what actually happened on each site.
- **Gallery captions** are placeholders keyed to typical shots.
- **FAQ answers** in `index.html` are general. Confirm they match how the studio actually
  works, especially anything a client might treat as a commitment.
- **The "Six rules" section** is studio-authored copy, not client testimonials. If you want
  real client quotes there instead, they need to be quotes you have permission to publish.
- The logo is set as a **type wordmark** so it recolours cleanly against dark and light
  headers. To use the real logo file instead, replace the `<span class="site-logo">…</span>`
  block with an `<img>` in `index.html` and in `tools/build-projects.mjs`.

## The enquiry form

There is no backend. A valid submission opens the visitor's mail client with the brief already
composed to `sales@nuconceptstore.com`. To collect enquiries server-side instead, point the
`<form class="form">` at Formspree / Netlify Forms / Basin and delete `initForm` from `site.js`.

## Interaction

All of it is in `site.js`, dependency-free, and each module no-ops if its markup is absent:

preloader · custom cursor with contextual labels · condensing header that hides on scroll down ·
scroll progress bar · scroll-reveal and line-by-line heading animation · hero parallax ·
animated counters · looping marquee · portfolio filters · services and FAQ accordions ·
principles slider · validated enquiry form · gallery lightbox (keyboard + swipe) ·
scrollspy nav · full-screen mobile menu · page-transition curtain · back to top.

`prefers-reduced-motion: reduce` disables every animation, the cursor and the preloader.

## Browser support

Modern evergreen browsers. Uses CSS nesting-free syntax, `clamp()`, `grid`, `:focus-visible`,
`aspect-ratio`, `backdrop-filter`, `100svh` and `IntersectionObserver`.

## Deploying

Static files — host anywhere. GitHub Pages: repository **Settings → Pages → Deploy from a
branch → `main` / root**. For a custom domain, add a `CNAME` file containing
`nuconceptstore.com` and point the DNS at GitHub.

Update the absolute URLs in `sitemap.xml`, `robots.txt` and the `canonical`/`og:` tags if the
site is served from anywhere other than `https://nuconceptstore.com`.

---

Contact: sales@nuconceptstore.com · +94 77 557 9572 · [@nuconcepts_store](https://instagram.com/nuconcepts_store)
