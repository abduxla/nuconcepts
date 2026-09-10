/* ==========================================================================
   NuConcepts — site.js
   No dependencies. Every module is optional: if its markup is absent on the
   current page, the module quietly does nothing.
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ----------------------------------------------------------------------
     Missing photography
     Real photos are dropped into assets/images/ later. Until a file exists
     the <img> 404s, so we hide it and let the designed .media--empty
     gradient stand in rather than showing a broken-image icon.
     -------------------------------------------------------------------- */
  const markEmpty = (img) => {
    const box = img.closest('.media, .hero-bg');
    if (!box) return;
    box.classList.add('media--empty');
    if (!box.dataset.label) box.dataset.label = img.alt || 'Photography to follow';
  };
  document.addEventListener('error', (e) => {
    if (e.target instanceof HTMLImageElement) markEmpty(e.target);
  }, true);
  const sweepImages = () => $$('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) markEmpty(img);
  });
  document.addEventListener('DOMContentLoaded', sweepImages);
  window.addEventListener('load', sweepImages);

  /* ----------------------------------------------------------------------
     Preloader
     -------------------------------------------------------------------- */
  // Resolves once the curtain is off the screen, so the hero animates for a
  // visitor who can actually see it rather than behind the preloader.
  const initPreloader = () => new Promise((done) => {
    const el = $('.preloader');
    if (!el) { done(); return; }

    const bar = $('.bar i', el);
    const count = $('.count', el);
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      el.classList.add('is-done');
      document.body.classList.remove('is-locked');
      document.body.classList.add('is-ready');
      setTimeout(() => el.remove(), 700);
      done();
    };
    if (reduced) { finish(); return; }

    document.body.classList.add('is-locked');
    let pct = 0;
    const timer = setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 18 + 6);
      if (bar) bar.style.width = pct + '%';
      if (count) count.textContent = Math.round(pct) + '%';
      if (pct >= 100) { clearInterval(timer); setTimeout(finish, 380); }
    }, 130);
    // Never trap the visitor if something stalls.
    setTimeout(() => { clearInterval(timer); finish(); }, 4200);
  });

  /* ----------------------------------------------------------------------
     Custom cursor
     -------------------------------------------------------------------- */
  const initCursor = () => {
    if (!finePointer || reduced) return;
    const dot = $('.cursor');
    const ring = $('.cursor-ring');
    if (!dot || !ring) return;
    const label = $('span', ring);

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    document.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      document.body.classList.add('cursor-ready');
      dot.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });

    (function loop() {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor], a, button, input, textarea, select');
      document.body.classList.remove('cursor-hover', 'cursor-label');
      if (!target) return;
      const text = target.dataset ? target.dataset.cursor : null;
      if (text) {
        if (label) label.textContent = text;
        document.body.classList.add('cursor-label');
      } else {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ready'));
    document.addEventListener('mouseenter', () => document.body.classList.add('cursor-ready'));
  };

  /* ----------------------------------------------------------------------
     Header: condensed state, hide on scroll down, scroll progress
     -------------------------------------------------------------------- */
  const initHeader = () => {
    const header = $('.site-header');
    const progress = $('.progress');
    const toTop = $('.to-top');
    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (header) {
        header.classList.toggle('scrolled', y > 60);
        const hide = y > 420 && y > last && !document.body.classList.contains('nav-open');
        header.classList.toggle('is-hidden', hide);
      }
      if (progress) {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }
      if (toTop) toTop.classList.toggle('is-on', y > innerHeight * 0.9);
      last = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    if (toTop) {
      toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      });
    }
  };

  /* ----------------------------------------------------------------------
     Mobile navigation
     -------------------------------------------------------------------- */
  const initNav = () => {
    const toggle = $('.menu-toggle');
    const overlay = $('.nav-overlay');
    if (!toggle || !overlay) return;

    const setOpen = (open) => {
      document.body.classList.toggle('nav-open', open);
      document.body.classList.toggle('is-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
    };
    toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
    $$('a', overlay).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setOpen(false);
    });
    setOpen(false);
  };

  /* ----------------------------------------------------------------------
     Reveal on scroll (+ counters, which fire when their tile appears)
     -------------------------------------------------------------------- */
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target) || el.dataset.counted) return;
    el.dataset.counted = '1';
    const suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target + suffix; return; }
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const initReveal = () => {
    // A .split-line only un-clips once an ancestor is revealed. If a heading
    // was written without one it would stay invisible forever, so adopt it
    // as its own reveal target.
    $$('.split-line').forEach((line) => {
      const heading = line.parentElement;
      if (heading && !heading.closest('[data-reveal]')) heading.dataset.reveal = 'fade';
    });

    const targets = $$('[data-reveal], .media, .process-step');
    if (!targets.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      $$('[data-count]').forEach(runCounter);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        $$('[data-count]', entry.target).forEach(runCounter);
        if (entry.target.matches('[data-count]')) runCounter(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    targets.forEach((el) => io.observe(el));

    // Anything already on screen is shown on the next frame rather than
    // waiting on the observer, so the first viewport is never left blank.
    requestAnimationFrame(() => {
      targets.forEach((el) => {
        if (el.classList.contains('is-in')) return;
        const box = el.getBoundingClientRect();
        if (box.top < innerHeight * 0.95 && box.bottom > 0) {
          el.classList.add('is-in');
          $$('[data-count]', el).forEach(runCounter);
          if (el.matches('[data-count]')) runCounter(el);
          io.unobserve(el);
        }
      });
    });
  };

  /* ----------------------------------------------------------------------
     Hero parallax
     -------------------------------------------------------------------- */
  const initParallax = () => {
    const layers = $$('[data-parallax]');
    if (!layers.length || reduced) return;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      layers.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  };

  /* ----------------------------------------------------------------------
     Marquee — duplicate the track so the loop has no gap
     -------------------------------------------------------------------- */
  const initMarquee = () => {
    $$('.marquee').forEach((strip) => {
      const track = $('.marquee-track', strip);
      if (!track) return;
      strip.appendChild(track.cloneNode(true));
    });
  };

  /* ----------------------------------------------------------------------
     Accordions — services and FAQ share the behaviour
     -------------------------------------------------------------------- */
  const initAccordion = (rowSel, btnSel, panelSel, exclusive) => {
    const rows = $$(rowSel);
    rows.forEach((row) => {
      const btn = $(btnSel, row);
      const panel = $(panelSel, row);
      if (!btn || !panel) return;
      btn.setAttribute('aria-expanded', String(row.classList.contains('is-open')));
      btn.addEventListener('click', () => {
        const willOpen = !row.classList.contains('is-open');
        if (exclusive) {
          rows.forEach((other) => {
            other.classList.remove('is-open');
            const b = $(btnSel, other);
            if (b) b.setAttribute('aria-expanded', 'false');
          });
        }
        row.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
      });
    });
  };

  /* ----------------------------------------------------------------------
     Portfolio filters
     -------------------------------------------------------------------- */
  const initFilters = () => {
    const buttons = $$('.filter');
    const cards = $$('.project-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const want = btn.dataset.filter;
        buttons.forEach((b) => {
          b.classList.toggle('is-on', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        cards.forEach((card) => {
          const tags = (card.dataset.tags || '').split(/\s+/);
          card.classList.toggle('is-filtered', want !== 'all' && !tags.includes(want));
        });
      });
    });
  };

  /* ----------------------------------------------------------------------
     Testimonial slider
     -------------------------------------------------------------------- */
  const initVoices = () => {
    const wrap = $('.voice-track');
    if (!wrap) return;
    const slides = $$('.voice', wrap);
    const dots = $$('.voice-dot');
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('is-on', n === index));
      dots.forEach((d, n) => d.classList.toggle('is-on', n === index));
    };
    const play = () => { if (!reduced) timer = setInterval(() => show(index + 1), 6500); };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };

    dots.forEach((dot, n) => dot.addEventListener('click', () => { stop(); show(n); play(); }));
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', play);
    show(0);
    play();
  };

  /* ----------------------------------------------------------------------
     Enquiry form
     There is no backend on a static site, so a validated submission opens
     the visitor's mail client with the brief already composed.
     -------------------------------------------------------------------- */
  const initForm = () => {
    const form = $('.form');
    if (!form) return;
    const status = $('.form-status');
    const mailTo = form.dataset.mailto || 'sales@nuconceptstore.com';

    const fail = (field, message) => {
      const box = field.closest('.field');
      if (!box) return;
      box.classList.add('has-error');
      const err = $('.err', box);
      if (err) err.textContent = message;
    };

    form.addEventListener('input', (e) => {
      const box = e.target.closest('.field');
      if (box) box.classList.remove('has-error');
      if (e.target.tagName === 'SELECT') e.target.classList.toggle('has-value', !!e.target.value);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.field', form).forEach((f) => f.classList.remove('has-error'));

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const project = (data.get('project') || '').toString().trim();
      const location = (data.get('location') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      let ok = true;
      if (!name) { fail(form.elements.name, 'Please tell us your name.'); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        fail(form.elements.email, 'Please enter a valid email address.'); ok = false;
      }
      if (message.length < 10) {
        fail(form.elements.message, 'A sentence or two about the space, please.'); ok = false;
      }
      if (!ok) {
        const first = $('.field.has-error input, .field.has-error textarea', form);
        if (first) first.focus();
        return;
      }

      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${project || 'Not specified'}`,
        `Location: ${location || 'Not specified'}`,
        '',
        message,
      ].join('\n');

      window.location.href = `mailto:${mailTo}`
        + `?subject=${encodeURIComponent('Interior project enquiry — ' + name)}`
        + `&body=${encodeURIComponent(body)}`;

      if (status) {
        status.textContent = 'Thanks ' + name + ' — your email client is opening with the brief ready to send. '
          + 'If nothing happens, write to ' + mailTo + ' directly.';
        status.classList.add('is-on');
      }
    });
  };

  /* ----------------------------------------------------------------------
     Gallery lightbox
     -------------------------------------------------------------------- */
  const initLightbox = () => {
    const figures = $$('.gallery figure');
    const box = $('.lightbox');
    if (!figures.length || !box) return;

    const stage = $('.lightbox-stage', box);
    const caption = $('.lightbox-bar .caption', box);
    let index = 0;

    const render = (i) => {
      index = (i + figures.length) % figures.length;
      const source = figures[index];
      const img = $('img', source);
      const media = $('.media', source);
      const text = ($('figcaption', source) || {}).textContent || '';
      stage.innerHTML = '';

      if (media && media.classList.contains('media--empty')) {
        const stand = document.createElement('div');
        stand.className = 'media media--empty is-in';
        stand.dataset.label = media.dataset.label || text;
        stage.appendChild(stand);
      } else if (img) {
        const big = new Image();
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        stage.appendChild(big);
      }
      if (caption) caption.textContent = `${index + 1} / ${figures.length} — ${text}`;
    };

    const open = (i) => {
      render(i);
      box.classList.add('is-on');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
    };
    const close = () => {
      box.classList.remove('is-on');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    };

    figures.forEach((fig, i) => {
      const media = $('.media', fig);
      if (!media) return;
      media.setAttribute('role', 'button');
      media.setAttribute('tabindex', '0');
      media.addEventListener('click', () => open(i));
      media.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    const prev = $('.lb-prev', box);
    const next = $('.lb-next', box);
    if (prev) prev.addEventListener('click', () => render(index - 1));
    if (next) next.addEventListener('click', () => render(index + 1));
    $$('.lightbox-close', box).forEach((b) => b.addEventListener('click', close));
    box.addEventListener('click', (e) => { if (e.target === box) close(); });

    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') render(index + 1);
      if (e.key === 'ArrowLeft') render(index - 1);
    });

    // Swipe on touch devices
    let startX = null;
    box.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 55) render(index + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  };

  /* ----------------------------------------------------------------------
     Scrollspy for the desktop nav
     -------------------------------------------------------------------- */
  const initSpy = () => {
    const links = $$('.main-nav a[href*="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const map = new Map();
    links.forEach((link) => {
      const id = link.getAttribute('href').split('#')[1];
      const section = id && document.getElementById(id);
      if (section) map.set(section, link);
    });
    if (!map.size) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    map.forEach((_, section) => io.observe(section));
  };

  /* ----------------------------------------------------------------------
     Page transition curtain
     -------------------------------------------------------------------- */
  const initTransitions = () => {
    const curtain = $('.curtain');
    if (!curtain || reduced) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      // mailto:, tel: and anything else that is not a page load
      if (!['http:', 'https:', 'file:'].includes(link.protocol)) return;
      if (link.protocol !== 'file:' && link.origin !== location.origin) return;

      e.preventDefault();
      curtain.classList.add('is-out');
      setTimeout(() => { window.location.href = link.href; }, 480);
    });

    // Coming back via the browser cache should not leave the curtain down.
    window.addEventListener('pageshow', () => curtain.classList.remove('is-out'));
  };

  /* ----------------------------------------------------------------------
     Boot
     -------------------------------------------------------------------- */
  const boot = () => {
    const year = $('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    initCursor();
    initHeader();
    initNav();
    initParallax();
    initMarquee();
    initAccordion('.service-row', '.service-head', '.service-body', true);
    initAccordion('.faq-item', '.faq-q', '.faq-a', false);
    initFilters();
    initVoices();
    initForm();
    initLightbox();
    initSpy();
    initTransitions();

    // Reveals wait for the preloader so the first screen animates in view.
    initPreloader().then(initReveal);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
