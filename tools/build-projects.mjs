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

const HEAD_SCRIPTS = `<script>document.documentElement.classList.add('js');</script>
<script>
/* Flags broken images before any <img> is parsed, so no error event is missed.
   A "complete && naturalWidth === 0" sweep cannot be used instead: Chrome
   reports exactly that for lazy images it has merely deferred. */
document.addEventListener('error', function (e) {
  var t = e.target;
  if (t && t.tagName === 'IMG') t.setAttribute('data-img-error', '1');
}, true);
</script>
<script>
/* Preview-only noindex, so it never follows the build to nuconceptstore.com. */
if (location.hostname.endsWith('github.io')) {
  document.head.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex,nofollow">');
}
</script>`;

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
  + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
  + '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Figtree:wght@300;400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">';

const chrome = () => `<header class="site-header">
  <div class="wrap header-inner">
    <a class="site-logo" href="../index.html" aria-label="NuConcepts — home">
      <svg class="logo" viewBox="0 0 232 104" role="img" aria-label="nu concepts">
        <text class="logo-a" x="0" y="46">nu</text>
        <circle class="logo-dot" cx="33" cy="12" r="5.2"/>
        <circle class="logo-dot" cx="49" cy="12" r="5.2"/>
        <text class="logo-b" x="0" y="96">concepts</text>
      </svg>
    </a>

    <nav class="main-nav" aria-label="Primary">
      <div class="has-sub">
        <a href="../index.html#services" aria-haspopup="true" aria-expanded="false">Services <i aria-hidden="true">&#9662;</i></a>
        <div class="sub">
          <a href="../index.html#services">Interior Design</a>
          <a href="../index.html#services">Bespoke Manufacturing</a>
          <a href="../index.html#services">Full Supply &amp; Install</a>
          <a href="../index.html#services">Imported Products</a>
          <a href="../index.html#services">Hospitality Fit-Out</a>
        </div>
      </div>
      <a href="../index.html#about">Our Story</a>
      <a href="../index.html#create">Create With Us</a>
      <a href="../index.html#work">Projects</a>
      <a href="../index.html#contact">Contact</a>
    </nav>

    <div class="header-actions">
      <button class="icon-btn" id="searchOpen" aria-label="Search" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
      </button>
      <a class="icon-btn" href="https://instagram.com/nuconcepts_store" target="_blank" rel="noopener" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.1" cy="6.9" r="1" fill="currentColor" stroke="none"/></svg>
      </a>
      <a class="icon-btn" href="tel:+94775579572" aria-label="Call the studio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 3.5h3.2l1.6 4-2 1.4a12 12 0 0 0 5.3 5.3l1.4-2 4 1.6V18a2.5 2.5 0 0 1-2.7 2.5A16.5 16.5 0 0 1 3.5 6.2 2.5 2.5 0 0 1 5 3.5z"/></svg>
      </a>
      <button class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-overlay">
        <i></i><i></i><i></i>
      </button>
    </div>
  </div>
</header>

<div class="search-panel" id="searchPanel" aria-hidden="true" role="dialog" aria-label="Search">
  <div class="wrap search-inner">
    <label class="sr-only" for="searchInput">Search this site</label>
    <input id="searchInput" type="search" placeholder="What can we help you find?" autocomplete="off">
    <button class="icon-btn" id="searchClose" aria-label="Close search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <ul class="search-results" id="searchResults"></ul>
  </div>
</div>

<div class="nav-overlay" id="nav-overlay" aria-hidden="true">
  <a class="big" href="../index.html#services">Services</a>
  <a class="big" href="../index.html#about">Our Story</a>
  <a class="big" href="../index.html#create">Create With Us</a>
  <a class="big" href="../index.html#work">Projects</a>
  <a class="big" href="../index.html#contact">Contact</a>
  <div class="nav-overlay-foot">
    <a href="mailto:sales@nuconceptstore.com">sales@nuconceptstore.com</a>
    <a href="tel:+94775579572">+94 77 557 9572</a>
    <a href="https://instagram.com/nuconcepts_store" target="_blank" rel="noopener">Instagram</a>
  </div>
</div>`;

const footer = () => `<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-about">
        <span class="site-logo site-logo--foot"><svg class="logo" viewBox="0 0 232 104" role="img" aria-label="nu concepts">
        <text class="logo-a" x="0" y="46">nu</text>
        <circle class="logo-dot" cx="33" cy="12" r="5.2"/>
        <circle class="logo-dot" cx="49" cy="12" r="5.2"/>
        <text class="logo-b" x="0" y="96">concepts</text>
      </svg></span>
        <p>Furniture &amp; Interior Solutions &middot; Sri Lanka &middot; Est. 2018.
           Designed, made and installed on the island.</p>
      </div>
      <div>
        <h4>Studio</h4>
        <ul>
          <li><a href="../index.html#about">About</a></li>
          <li><a href="../index.html#film">Workshop</a></li>
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
    <div class="foot-bottom">
      <span>&copy; <span data-year>2026</span> NuConcepts</span>
      <span>Island made. Designed, made and installed in Sri Lanka.</span>
    </div>
  </div>
</footer>`;

const gallery = (p) => p.captions.map((caption, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `      <figure data-reveal="fade">
        <div class="media zoom">
          <img loading="lazy" src="../assets/images/projects/${p.slug}-${n}.jpg" alt="${strip(p.name)} — ${strip(caption).toLowerCase()}">
        </div>
        <figcaption>${caption}</figcaption>
      </figure>`;
}).join('\n');

const page = (p, next) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
${HEAD_SCRIPTS}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${strip(p.name)} — ${strip(p.type)}, ${strip(p.location)} | NuConcepts</title>
<meta name="description" content="${strip(p.lead)} Interior design and bespoke furniture by NuConcepts, Sri Lanka.">
<meta name="theme-color" content="#F8F6F3">
<link rel="canonical" href="${SITE}/projects/${p.slug}.html">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">

<meta property="og:type" content="article">
<meta property="og:title" content="${strip(p.name)} — ${strip(p.type)}, ${strip(p.location)} | NuConcepts">
<meta property="og:description" content="${strip(p.lead)}">
<meta property="og:url" content="${SITE}/projects/${p.slug}.html">
<meta property="og:image" content="${SITE}/assets/images/projects/${p.hero}">
<meta name="twitter:card" content="summary_large_image">

${FONTS}
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

<body class="project-page hero-header">
<a class="skip-link" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"></div>

${chrome()}

<main id="main">

<section class="p-hero">
  <div class="hero-bg" data-parallax="0.12">
    <img src="../assets/images/projects/${p.hero}" alt="${strip(p.name)} — ${strip(p.type).toLowerCase()} interior in ${strip(p.location)}, Sri Lanka" fetchpriority="high">
  </div>
  <div class="wrap" data-reveal="fade">
    <h1>${p.name}</h1>
    <div class="p-meta">
      <div><span>Type</span><b>${p.type}</b></div>
      <div><span>Location</span><b>${p.location}</b></div>
      <div><span>Year</span><b>${p.year}</b></div>
      <div><span>Studio</span><b class="brand">NuConcepts</b></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="crumbs"><a href="../index.html">Home</a> / <a href="../index.html#work">Work</a> / ${p.name}</p>
    <div class="p-intro">
      <div data-reveal>
        <h2>${p.heading}</h2>
        <div class="specs">
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

<a class="next-project" href="${next.slug}.html">
  <div class="media"><img loading="lazy" src="../assets/images/projects/${next.hero}" alt="${strip(next.name)} interior project"></div>
  <div class="inner wrap">
    <p class="kicker" style="color:rgba(255,255,255,.7);font-family:var(--serif);font-style:italic">Next project</p>
    <h2>${next.name}</h2>
    <span class="btn btn--onphoto">View project <span class="btn__ico" aria-hidden="true">&rarr;</span></span>
  </div>
</a>

</main>

<div class="lightbox" aria-hidden="true" role="dialog" aria-label="${strip(p.name)} gallery">
  <button class="lb-btn lightbox-close" aria-label="Close gallery"><span aria-hidden="true">&#10005;</span></button>
  <div class="lightbox-stage"></div>
  <div class="lightbox-bar wrap">
    <span class="caption"></span>
    <span class="lightbox-nav">
      <button class="lb-btn lb-prev" aria-label="Previous image"><span aria-hidden="true">&larr;</span></button>
      <button class="lb-btn lb-next" aria-label="Next image"><span aria-hidden="true">&rarr;</span></button>
    </span>
  </div>
</div>

${footer()}

<button class="to-top" aria-label="Back to top"><span aria-hidden="true">&uarr;</span></button>

<script src="../site.js" defer></script>
</body>
</html>
`;

mkdirSync(resolve(ROOT, 'projects'), { recursive: true });
PROJECTS.forEach((p, i) => {
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  writeFileSync(resolve(ROOT, 'projects', `${p.slug}.html`), page(p, next), 'utf8');
  console.log('wrote projects/' + p.slug + '.html');
});

// sitemap.xml — kept in step with the project list
const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE}/`, `${SITE}/create.html`, ...PROJECTS.map((p) => `${SITE}/projects/${p.slug}.html`)];
writeFileSync(
  resolve(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + urls.map((u, i) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${i === 0 ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')
  + `\n</urlset>\n`,
  'utf8'
);
console.log('wrote sitemap.xml');
