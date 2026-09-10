/**
 * Generates the project pages under /projects from the data below, so the
 * five pages never drift apart. Re-run after editing PROJECTS:
 *
 *   node tools/build-projects.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://nuconceptstore.com';

const PROJECTS = [
  {
    slug: 'miss-ceylon',
    name: 'Miss Ceylon',
    type: 'Boutique Hotel',
    location: 'Unawatuna',
    year: '2024',
    hero: 'miss-ceylon-hero.jpg',
    lead: 'A boutique hotel a few streets back from Unawatuna bay, furnished throughout in our Colombo workshop.',
    heading: 'A small hotel that reads as a house.',
    body: [
      'Miss Ceylon asked for guestrooms and public areas that felt residential rather than hotel-standard — pieces that look collected rather than specified, in a palette that carries sand and salt light without going washed out.',
      'We took the project from concept through to installation: space planning and material direction first, then the beds, casegoods, seating and joinery made to those drawings in Colombo and installed by our own team.',
      'Because the furniture was cut in the same workshop that detailed it, sizes could be adjusted against the real openings on site rather than the drawing — which matters in a building where no two rooms are quite the same.',
    ],
    services: 'Interior design · Bespoke furniture · Supply &amp; install',
    scope: 'Guestrooms, reception, lounge and outdoor areas',
    captions: [
      'Reception and arrival', 'Guestroom, bed and casegoods', 'Custom timber joinery detail',
      'Lounge seating', 'Outdoor and poolside furniture', 'Finish and material palette',
    ],
  },
  {
    slug: 'angel-beach',
    name: 'Angel Beach',
    type: 'Beach Club &amp; Restaurant',
    location: 'Unawatuna',
    year: '2024',
    hero: 'angel-beach-hero.jpg',
    lead: 'A beach club and restaurant on the sand at Unawatuna — furniture detailed to live outdoors all season.',
    heading: 'Built for salt, sun and a full season.',
    body: [
      'A beach club runs its furniture harder than almost any other interior. Everything here was detailed for direct sun, sea air and daily rearrangement: hardwood frames, finishes chosen for recoating rather than replacement, and cushions built to be stripped and washed.',
      'The brief covered the dining areas, bar and the seating that spills out onto the sand, with a material palette that stays quiet against the water and lets the setting do the work.',
      'We supplied and installed the whole package, then came back through it as a snag list rather than leaving it at delivery.',
    ],
    services: 'Interior design · Bespoke furniture · Outdoor seating · Supply &amp; install',
    scope: 'Restaurant, bar, deck and beach seating',
    captions: [
      'Beachfront dining', 'Bar and back-bar joinery', 'Outdoor seating on the sand',
      'Custom timber tables', 'Shade and deck detail', 'Materials in daylight',
    ],
  },
  {
    slug: 'terrene-villas',
    name: 'Terrene Villas',
    type: 'Private Villas',
    location: 'Weligama &amp; Kabalana',
    year: '2023',
    hero: 'terrene-villas-hero.jpg',
    lead: 'Two private villas on the south coast, furnished as a single coherent scheme across both sites.',
    heading: 'One scheme, two coastlines.',
    body: [
      'Terrene runs villas at Weligama and Kabalana. The work here was to give both a shared identity without making them feel like the same building — a common language of timber, rattan and off-white plaster, resolved differently against each site.',
      'Interiors, bedroom and living furniture, dining and outdoor pieces were designed together and manufactured in one production run, which kept the finishes matched across both properties.',
      'Working on two sites at once also meant one delivery and installation programme, sequenced so neither villa sat half-furnished through a booking window.',
    ],
    services: 'Interior design · Bespoke furniture · Multi-site logistics',
    scope: 'Bedrooms, living and dining, outdoor and pool areas',
    captions: [
      'Living area, Weligama', 'Bedroom and joinery', 'Dining and kitchen',
      'Pool deck furniture', 'Bathroom detail', 'Villa at Kabalana',
    ],
  },
  {
    slug: 'abode-ahangama',
    name: 'Abode Ahangama',
    type: 'Beachfront Hotel',
    location: 'Ahangama',
    year: '2023',
    hero: 'abode-ahangama-hero.jpg',
    lead: 'A beachfront hotel at Ahangama — guestrooms, public spaces and F&amp;B in one fit-out package.',
    heading: 'Beachfront, detailed for the weather.',
    body: [
      'Sitting directly on the beach, Abode needed an interior that could take the monsoon as well as the season: hardwoods and finishes selected for humidity and salt, and joinery detailed with movement in mind.',
      'The package covered guestrooms, the public areas and the F&amp;B spaces, so the same material palette carries from the rooms through to where guests eat.',
      'Design, manufacture, delivery and installation were handled by one team from our Colombo workshop.',
    ],
    services: 'Interior design · Bespoke furniture · Hospitality fit-out',
    scope: 'Guestrooms, public areas and F&amp;B',
    captions: [
      'Beachfront frontage', 'Guestroom', 'Restaurant seating',
      'Reception joinery', 'Timber and rattan detail', 'Terrace furniture',
    ],
  },
  {
    slug: 'the-fort-printers',
    name: 'The Fort Printers',
    type: 'Heritage Hotel',
    location: 'Galle Fort',
    year: '2025',
    hero: 'the-fort-printers-hero.jpg',
    lead: 'A heritage hotel inside Galle Fort, where new work had to sit beside the original building without imitating it.',
    heading: 'New work in an old building.',
    body: [
      'Galle Fort sets the terms. Ceiling heights, existing timber, original floors and conservation constraints all decide what can be done, so the work here was as much matching and restraint as it was design.',
      'We matched existing timber species and profiles where new joinery met old, and kept new pieces recognisably contemporary rather than pastiche — so the building still reads as its own age.',
      'Manufacture ran in Colombo with pieces sized against measured surveys of the actual rooms, then installed inside a live heritage property.',
    ],
    services: 'Interior design · Bespoke joinery · Heritage-sensitive fit-out',
    scope: 'Guestrooms, dining and public areas',
    captions: [
      'Courtyard and colonnade', 'Guestroom in the old building', 'Matched timber joinery',
      'Dining room', 'Stair and original floor', 'Detail against original plaster',
    ],
  },
];

/* -------------------------------------------------------------------------- */

const strip = (s) => s.replace(/&amp;/g, '&');

const head = (p, nextName) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add('js');</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${strip(p.name)} — ${strip(p.type)}, ${strip(p.location)} | NuConcepts</title>
<meta name="description" content="${strip(p.lead)} Interior design and bespoke furniture by NuConcepts, Sri Lanka.">
<meta name="theme-color" content="#34383f">
<link rel="canonical" href="${SITE}/projects/${p.slug}.html">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">

<meta property="og:type" content="article">
<meta property="og:title" content="${strip(p.name)} — ${strip(p.type)}, ${strip(p.location)} | NuConcepts">
<meta property="og:description" content="${strip(p.lead)}">
<meta property="og:url" content="${SITE}/projects/${p.slug}.html">
<meta property="og:image" content="${SITE}/assets/images/projects/${p.hero}">
<meta name="twitter:card" content="summary_large_image">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "${strip(p.name)}",
  "about": "${strip(p.type)} interior project in ${strip(p.location)}, Sri Lanka",
  "dateCreated": "${p.year}",
  "url": "${SITE}/projects/${p.slug}.html",
  "creator": { "@type": "Organization", "name": "NuConcepts", "url": "${SITE}/" }
}
</script>
</head>

<body class="project-page">
<a class="skip-link" href="#main">Skip to content</a>

<div class="progress" aria-hidden="true"></div>
<div class="curtain" aria-hidden="true"></div>
<div class="cursor" aria-hidden="true"></div>
<div class="cursor-ring" aria-hidden="true"><span></span></div>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="site-logo" href="../index.html" aria-label="NuConcepts — home">
      <span class="glyph" aria-hidden="true"></span>
      <span class="wordmark">Nu<em>Concepts</em></span>
    </a>
    <nav class="main-nav" aria-label="Primary">
      <a href="../index.html#about">Studio</a>
      <a href="../index.html#portfolio">Portfolio</a>
      <a href="../index.html#services">Services</a>
      <a href="../index.html#workshop">Workshop</a>
      <a class="nav-cta" href="../index.html#contact">Start a project</a>
    </nav>
    <button class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-overlay">
      <i></i><i></i><i></i>
    </button>
  </div>
</header>

<div class="nav-overlay" id="nav-overlay" aria-hidden="true">
  <a class="big serif" href="../index.html#about">Studio</a>
  <a class="big serif" href="../index.html#portfolio">Portfolio</a>
  <a class="big serif" href="../index.html#services">Services</a>
  <a class="big serif" href="../index.html#workshop">Workshop</a>
  <a class="big serif" href="../index.html#contact">Start a project</a>
  <div class="nav-overlay-foot">
    <a href="mailto:sales@nuconceptstore.com">sales@nuconceptstore.com</a>
    <a href="tel:+94775579572">+94 77 557 9572</a>
    <a href="https://instagram.com/nuconcepts_store" target="_blank" rel="noopener">Instagram</a>
  </div>
</div>
`;

const gallery = (p) => p.captions.map((caption, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `      <figure data-reveal="fade">
        <div class="media" data-cursor="Open">
          <img loading="lazy" src="../assets/images/projects/${p.slug}-${n}.jpg" alt="${strip(p.name)} — ${strip(caption).toLowerCase()}">
        </div>
        <figcaption>${caption}</figcaption>
      </figure>`;
}).join('\n');

const page = (p, next) => `${head(p)}
<main id="main">

<section class="project-hero">
  <div class="hero-bg" data-parallax="0.16">
    <img src="../assets/images/projects/${p.hero}" alt="${strip(p.name)} — ${strip(p.type).toLowerCase()} interior in ${strip(p.location)}, Sri Lanka" fetchpriority="high">
  </div>
  <div class="wrap" data-reveal="fade">
    <p class="eyebrow">${p.type} · ${p.location} · ${p.year}</p>
    <h1><span class="split-line"><i>${p.name}</i></span></h1>
    <div class="project-meta">
      <div><span>Type</span><b>${p.type}</b></div>
      <div><span>Location</span><b>${p.location}</b></div>
      <div><span>Year</span><b>${p.year}</b></div>
      <div><span>Studio</span><b>NuConcepts</b></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="breadcrumbs"><a href="../index.html">Home</a> / <a href="../index.html#portfolio">Portfolio</a> / ${p.name}</p>
    <div class="project-intro">
      <div data-reveal>
        <h2>${p.heading}</h2>
        <div class="spec-list">
          <div><h4>Scope</h4><p>${p.scope}</p></div>
          <div><h4>Services</h4><p>${p.services}</p></div>
          <div><h4>Location</h4><p>${p.location}, Sri Lanka</p></div>
          <div><h4>Completed</h4><p>${p.year}</p></div>
        </div>
      </div>
      <div class="body" data-reveal style="--d:120ms">
${p.body.map((para) => `        <p>${para}</p>`).join('\n')}
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="gallery">
${gallery(p)}
    </div>
  </div>
</section>

<a class="next-project" href="${next.slug}.html" data-cursor="Next">
  <div class="media"><img loading="lazy" src="../assets/images/projects/${next.hero}" alt="${strip(next.name)} interior project"></div>
  <span class="veil" aria-hidden="true"></span>
  <div class="inner wrap">
    <p class="eyebrow">Next project</p>
    <h2>${next.name}</h2>
    <span class="tlink">View project</span>
  </div>
</a>

<section class="cta">
  <div class="wrap cta-grid">
    <div data-reveal="fade">
      <p class="eyebrow">Have a space in mind?</p>
      <h2>
        <span class="split-line"><i>Make it</i></span>
        <span class="split-line"><i>distinctly yours.</i></span>
      </h2>
    </div>
    <div data-reveal style="--d:140ms">
      <p>Tell us about your hotel, villa, restaurant, residence or commercial interior.</p>
      <a class="button button--light" href="../index.html#contact"><span>Start a project</span><span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

</main>

<div class="lightbox" aria-hidden="true" role="dialog" aria-label="${strip(p.name)} gallery">
  <button class="lb-btn lightbox-close" aria-label="Close gallery"><span aria-hidden="true">✕</span></button>
  <div class="lightbox-stage"></div>
  <div class="lightbox-bar wrap">
    <span class="caption"></span>
    <span class="lightbox-nav">
      <button class="lb-btn lb-prev" aria-label="Previous image"><span aria-hidden="true">←</span></button>
      <button class="lb-btn lb-next" aria-label="Next image"><span aria-hidden="true">→</span></button>
    </span>
  </div>
</div>

<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <span class="site-logo">
          <span class="glyph" aria-hidden="true"></span>
          <span class="wordmark">Nu<em>Concepts</em></span>
        </span>
        <p class="tagline">Furniture &amp; Interior Solutions · Sri Lanka · Est. 2018.
           Designed, made and installed on the island.</p>
      </div>
      <div>
        <h4>Studio</h4>
        <ul>
          <li><a href="../index.html#about">About</a></li>
          <li><a href="../index.html#workshop">Workshop</a></li>
          <li><a href="../index.html#services">Services</a></li>
          <li><a href="../index.html#contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Projects</h4>
        <ul>
${PROJECTS.map((o) => `          <li><a href="${o.slug}.html">${o.name}</a></li>`).join('\n')}
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:sales@nuconceptstore.com">sales@nuconceptstore.com</a></li>
          <li><a href="tel:+94775579572">+94 77 557 9572</a></li>
          <li><a href="https://instagram.com/nuconcepts_store" target="_blank" rel="noopener">@nuconcepts_store</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> NuConcepts</span>
      <span>Island made. Designed, made and installed in Sri Lanka.</span>
    </div>
  </div>
</footer>

<button class="to-top" aria-label="Back to top"><span aria-hidden="true">↑</span></button>

<script src="../site.js" defer></script>
</body>
</html>
`;

mkdirSync(resolve(ROOT, 'projects'), { recursive: true });
PROJECTS.forEach((p, i) => {
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const file = resolve(ROOT, 'projects', `${p.slug}.html`);
  writeFileSync(file, page(p, next), 'utf8');
  console.log('wrote projects/' + p.slug + '.html');
});

// sitemap.xml — kept in step with the project list
const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE}/`, ...PROJECTS.map((p) => `${SITE}/projects/${p.slug}.html`)];
writeFileSync(
  resolve(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + urls.map((u, i) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${i === 0 ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')
  + `\n</urlset>\n`,
  'utf8'
);
console.log('wrote sitemap.xml');
