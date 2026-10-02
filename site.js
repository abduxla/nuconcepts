/* ==========================================================================
   NuConcepts — site.js  (v3)
   No dependencies. Every module is optional: if its markup is absent on the
   current page, the module quietly does nothing.
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Missing photography
     Real photos replace these later. Until a file exists the <img> 404s, so
     the designed .media--empty panel stands in rather than a broken icon.

     The error event is the only trustworthy signal: a
     `complete && naturalWidth === 0` sweep also matches lazy images Chrome
     has merely deferred, which hid good photographs on a cold load. Errors
     fired before this script ran were flagged by the inline snippet in
     <head>; everything after is caught live here.
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
  const applyFlagged = () => $$('img[data-img-error]').forEach(markEmpty);
  document.addEventListener('DOMContentLoaded', applyFlagged);
  window.addEventListener('load', applyFlagged);

  /* ----------------------------------------------------------------------
     Header — condensed state, hide on scroll down, progress, back to top
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
        header.classList.toggle('is-hidden',
          y > 420 && y > last && !document.body.classList.contains('nav-open'));
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

    if (toTop) toTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
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
    toggle.addEventListener('click', () =>
      setOpen(!document.body.classList.contains('nav-open')));
    $$('a', overlay).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setOpen(false);
    });
    setOpen(false);
  };

  /* ----------------------------------------------------------------------
     Reveal on scroll
     -------------------------------------------------------------------- */
  const initReveal = () => {
    const targets = $$('[data-reveal]');
    if (!targets.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    targets.forEach((el) => io.observe(el));

    // Anything already on screen shows on the next frame rather than waiting
    // on the observer, so the first viewport is never left blank.
    requestAnimationFrame(() => targets.forEach((el) => {
      if (el.classList.contains('is-in')) return;
      const box = el.getBoundingClientRect();
      if (box.top < innerHeight * 0.95 && box.bottom > 0) {
        el.classList.add('is-in');
        io.unobserve(el);
      }
    }));
  };

  /* ----------------------------------------------------------------------
     Hero video
     The still is the base layer. The video is swapped in only once the file
     is confirmed playable, so a missing asset, a blocked autoplay or a data
     saver simply leaves the photograph showing.
     -------------------------------------------------------------------- */
  const initHeroVideo = () => {
    const video = $('.hero-video');
    if (!video || reduced) return;
    const src = video.dataset.heroVideo;
    if (!src) return;

    video.muted = true;                 // autoplay is only allowed when muted
    video.addEventListener('canplay', () => {
      const bg = video.closest('.hero-bg');
      const hero = video.closest('.hero');
      const playing = video.play();
      if (playing && playing.catch) playing.catch(() => {});
      if (bg) bg.classList.add('video-on');
      if (hero) hero.classList.add('video-on');   // switches off the CSS lighting
    }, { once: true });
    video.addEventListener('error', () => {}, { once: true });

    // Several candidates: the browser picks the first it can decode, and if it
    // can decode none, canplay never fires and the still simply stays.
    const TYPES = { webm: 'video/webm', mp4: 'video/mp4', ogv: 'video/ogg' };
    src.split(',').map((u) => u.trim()).filter(Boolean).forEach((u) => {
      const source = document.createElement('source');
      source.src = u;
      const ext = u.split('.').pop().toLowerCase();
      if (TYPES[ext]) source.type = TYPES[ext];
      video.appendChild(source);
    });
    video.load();
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
        el.style.transform = `translate3d(0, ${y * (parseFloat(el.dataset.parallax) || 0.15)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  };

  /* ----------------------------------------------------------------------
     Horizontal rails — arrows, and a progress bar that tracks the scroll
     -------------------------------------------------------------------- */
  const initRails = () => {
    $$('[data-rail]').forEach((rail) => {
      const track = $('.rail-track', rail);
      if (!track) return;
      const prev = $('[data-rail-prev]', rail);
      const next = $('[data-rail-next]', rail);
      const bar = $('.rail-bar i', rail);
      const step = () => Math.max(240, track.clientWidth * 0.8);

      const sync = () => {
        const max = track.scrollWidth - track.clientWidth;
        const ratio = max > 0 ? track.scrollLeft / max : 0;
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= max - 2;
        if (bar) {
          // the thumb is 30% wide, so it travels the remaining 70%
          bar.style.transform = `translateX(${(ratio * 70 / 30) * 100}%)`;
        }
      };
      const nudge = (dir) => track.scrollBy({
        left: dir * step(),
        behavior: reduced ? 'auto' : 'smooth',
      });

      if (prev) prev.onclick = () => nudge(-1);
      if (next) next.onclick = () => nudge(1);
      track.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      sync();
    });
  };

  /* ----------------------------------------------------------------------
     Rail tiles that name a portfolio category drive the filter below them,
     so the rail is a way into the work rather than a second control.
     -------------------------------------------------------------------- */
  const initRailFilters = () => {
    $$('[data-go-filter]').forEach((link) => {
      link.addEventListener('click', () => {
        const btn = $('.filter[data-filter="' + link.getAttribute('data-go-filter') + '"]');
        if (btn) btn.click();
      });
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
        if (exclusive) rows.forEach((other) => {
          other.classList.remove('is-open');
          const b = $(btnSel, other);
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        row.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
      });
    });
  };

  /* ----------------------------------------------------------------------
     Work filters
     -------------------------------------------------------------------- */
  const initFilters = () => {
    const buttons = $$('.filter');
    const cards = $$('.work-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => btn.addEventListener('click', () => {
      const want = btn.dataset.filter;
      buttons.forEach((b) => {
        b.classList.toggle('is-on', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      cards.forEach((card) => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        card.classList.toggle('is-filtered', want !== 'all' && !tags.includes(want));
      });
    }));
  };

  /* ----------------------------------------------------------------------
     Enquiry form
     There is no backend on a static site, so a validated submission opens
     the visitor's mail client with the brief already composed.
     -------------------------------------------------------------------- */
  const initForm = () => {
    // The homepage enquiry form and the Create With Us brief share behaviour;
    // the brief simply carries more fields and a file picker.
    $$('.form, .start-form').forEach((form) => {
      const status = $('.form-status', form);
      const mailTo = form.dataset.mailto || 'sales@nuconceptstore.com';
      const files = $('input[type="file"]', form);

      const fail = (field, message) => {
        const box = field && field.closest('.field');
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

      // Show what was picked, so nobody assumes the files were transmitted.
      if (files) {
        const note = $('[data-file-note]', form);
        const base = note ? note.textContent.trim() : '';
        files.addEventListener('change', () => {
          if (!note) return;
          const names = Array.from(files.files).map((f) => f.name);
          note.textContent = names.length
            ? 'Ready to attach: ' + names.join(', ') + '. ' + base
            : base;
        });
      }

      const LABELS = {
        name: 'Name', email: 'Email', phone: 'Phone / WhatsApp',
        location: 'Project location', project: 'Project type', type: 'Project type',
        timeline: 'Expected timeline',
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        $$('.field', form).forEach((f) => f.classList.remove('has-error'));

        const data = new FormData(form);
        const get = (k) => (data.get(k) || '').toString().trim();
        const name = get('name'), email = get('email'), message = get('message');

        let ok = true;
        if (!name) { fail(form.elements.name, 'Please tell us your name.'); ok = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          fail(form.elements.email, 'Please enter a valid email address.'); ok = false;
        }
        if (message.length < 10) {
          fail(form.elements.message, 'A sentence or two about the space, please.'); ok = false;
        }
        if (!ok) {
          const first = $('.field.has-error input, .field.has-error textarea, .field.has-error select', form);
          if (first) first.focus();
          return;
        }

        const lines = [];
        Object.keys(LABELS).forEach((key) => {
          const v = get(key);
          if (v) lines.push(LABELS[key] + ': ' + v);
        });
        const picked = files ? Array.from(files.files).map((f) => f.name) : [];
        if (picked.length) lines.push('Files to attach: ' + picked.join(', '));
        lines.push('', message);

        window.location.href = 'mailto:' + mailTo
          + '?subject=' + encodeURIComponent('Interior project enquiry — ' + name)
          + '&body=' + encodeURIComponent(lines.join('\n'));

        if (status) {
          status.textContent = 'Thanks ' + name + ' — your email client is opening with the brief ready to send.'
            + (picked.length ? ' Please attach ' + picked.length + ' file' + (picked.length > 1 ? 's' : '') + ' before sending.' : '')
            + ' If nothing happens, write to ' + mailTo + ' directly.';
          status.classList.add('is-on');
        }
      });
    });
  };

  /* ----------------------------------------------------------------------
     Footer sign-up — also mail-based, for the same reason
     -------------------------------------------------------------------- */
  const initSubscribe = () => {
    const valid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    $$('[data-subscribe]').forEach((form) => {
      const status = $('.form-status', form);
      const say = (msg) => { if (status) { status.textContent = msg; status.classList.add('is-on'); } };

      const flag = (input, message) => {
        const box = input.closest('.field');
        if (box) {
          box.classList.add('has-error');
          const err = $('.err', box);
          if (err) err.textContent = message;
        } else {
          input.setAttribute('aria-invalid', 'true');   // footer box has no .field wrapper
        }
        input.focus();
      };

      form.addEventListener('input', (e) => {
        const box = e.target.closest('.field');
        if (box) box.classList.remove('has-error');
        e.target.removeAttribute('aria-invalid');
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameEl = form.elements.name;
        const mailEl = form.elements.email;
        const name = nameEl ? nameEl.value.trim() : '';
        const email = mailEl ? mailEl.value.trim() : '';

        if (nameEl && !name) { flag(nameEl, 'Please add your first name.'); return; }
        if (!valid(email)) { flag(mailEl, 'Please enter a valid email address.'); return; }

        // A real list provider, when one is configured.
        const endpoint = form.getAttribute('data-endpoint');
        if (endpoint) {
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { Accept: 'application/json' },
              body: new FormData(form),
            });
            if (!res.ok) throw new Error(res.status);
            form.reset();
            say('Thanks' + (name ? ' ' + name : '') + ' — you are on the list.');
          } catch (err) {
            say('That did not go through. Please email ' + form.getAttribute('data-subscribe') + ' instead.');
          }
          return;
        }

        // Fallback with no backend: compose the email for the visitor to send.
        window.location.href = 'mailto:' + form.getAttribute('data-subscribe')
          + '?subject=' + encodeURIComponent('Project notes sign-up')
          + '&body=' + encodeURIComponent(
              ['Please add me to your project notes list.', '',
               'Name: ' + (name || '-'), 'Email: ' + email].join('\n'));
        form.reset();
        say('Your email app is opening with the request ready to send.');
      });
    });
  };

  /* ----------------------------------------------------------------------
     Gallery lightbox (project pages)
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
        stand.className = 'media media--empty';
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
     Film
     The band ships a still and a button; the clip itself is only attached
     once someone actually asks to watch, and playback is paused on close so
     nothing keeps running behind the page.
     -------------------------------------------------------------------- */
  const initFilm = () => {
    const triggers = $$('[data-film]');
    const box = $('.film-box');
    const video = $('.film-video');
    if (!triggers.length || !box || !video) return;

    // Sources are attached on first open, so the clip is never fetched for a
    // visitor who does not press play.
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      (video.dataset.filmSrc || '').split(',').map((u) => u.trim()).filter(Boolean)
        .forEach((u) => {
          const src = document.createElement('source');
          src.src = u;
          src.type = u.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'video/webm';
          video.appendChild(src);
        });
      video.load();
    };

    const open = () => {
      arm();
      box.classList.add('is-on');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      const go = video.play();
      if (go && go.catch) go.catch(() => {});   // controls are there either way
    };
    const close = () => {
      video.pause();
      box.classList.remove('is-on');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    };

    triggers.forEach((t) => t.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    $$('.film-close', box).forEach((b) => b.addEventListener('click', close));
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && box.classList.contains('is-on')) close();
    });
  };

  /* ----------------------------------------------------------------------
     Search
     Small site, so the index is built from what is actually on the page —
     section headings, project cards and service rows — rather than shipping
     a separate data file that could drift out of date.
     -------------------------------------------------------------------- */
  const initSearch = () => {
    const openBtn = $('#searchOpen');
    const panel = $('#searchPanel');
    const input = $('#searchInput');
    const list = $('#searchResults');
    if (!openBtn || !panel || !input || !list) return;

    const base = location.pathname.includes('/projects/') ? '../' : '';
    const index = [];
    const add = (kind, label, href) => {
      if (label && href && !index.some((r) => r.label === label)) index.push({ kind, label, href });
    };

    $$('section[id]').forEach((sec) => {
      const h = $('h2', sec);
      if (h) add('Section', h.textContent.trim(), base + 'index.html#' + sec.id);
    });
    $$('.work-card').forEach((card) => {
      const h = $('h3', card);
      if (h) add('Project', h.textContent.trim(), card.getAttribute('href'));
    });
    $$('.svc-head h3').forEach((h) => add('Service', h.textContent.trim(), base + 'index.html#services'));
    $$('.note h3').forEach((h) => add('Guide', h.textContent.trim(), base + 'index.html#notes'));

    const render = (q) => {
      const term = q.trim().toLowerCase();
      if (!term) { list.innerHTML = ''; return; }
      const hits = index.filter((r) => r.label.toLowerCase().includes(term)).slice(0, 8);
      list.innerHTML = hits.length
        ? hits.map((r) => `<li><a href="${r.href}"><span class="kind">${r.kind}</span>${r.label}</a></li>`).join('')
        : '<li class="empty">Nothing matched that. Try “hotel”, “villa”, “timber” or “workshop”.</li>';
    };

    const setOpen = (open) => {
      document.body.classList.toggle('search-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      openBtn.setAttribute('aria-expanded', String(open));
      // the panel is still visibility:hidden for one frame while it animates
      // in, and focus() is ignored on a hidden element
      if (open) requestAnimationFrame(() => setTimeout(() => input.focus(), 30));
      else { input.value = ''; list.innerHTML = ''; }
    };

    openBtn.addEventListener('click', () =>
      setOpen(!document.body.classList.contains('search-open')));
    const closeBtn = $('#searchClose');
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    input.addEventListener('input', () => render(input.value));
    list.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('search-open')) setOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (!document.body.classList.contains('search-open')) return;
      if (!panel.contains(e.target) && !openBtn.contains(e.target)) setOpen(false);
    });
    setOpen(false);
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
        if (link && entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, section) => io.observe(section));
  };

  /* ----------------------------------------------------------------------
     Boot
     -------------------------------------------------------------------- */
  const boot = () => {
    const year = $('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    initHeader();
    initNav();
    initHeroVideo();
    initParallax();
    initRails();
    initRailFilters();
    initAccordion('.svc-row', '.svc-head', '.svc-body', true);
    initAccordion('.faq-item', '.faq-q', '.faq-a', false);
    initFilters();
    initForm();
    initSubscribe();
    initLightbox();
    initFilm();
    initSearch();
    initSpy();
    initReveal();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
