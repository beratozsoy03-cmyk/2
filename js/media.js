// ============================================================
// VİDEO / MEDYA ALTYAPISI (içerik: js/content.js)
// Hero & seminer arka plan videosu, proje masonry, öğrenci videoları,
// Instagram galerisi ve oran korumalı video lightbox.
// ============================================================
(() => {
  const MEDIA = window.SITE_MEDIA || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };
  const parseRatio = (r) => {
    const m = /^(\d{1,3}):(\d{1,3})$/.exec(r || '') || ['', '16', '9'];
    return { css: `${m[1]} / ${m[2]}`, num: (m[1] / m[2]).toFixed(4), vertical: +m[1] < +m[2] };
  };
  const safeVideoSrc = (s) => typeof s === 'string' && /^(assets\/|https:\/\/)/.test(s);
  const tryPlay = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };

  // --- Hero / seminer: dosya varsa sessiz, döngülü arka plan videosu ---
  function initStage(stage, cfg) {
    if (!stage || !cfg || !cfg.src) return;
    if (reduceMotion || (navigator.connection && navigator.connection.saveData)) return;
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const candidates = [isMobile && cfg.srcMobile, cfg.src].filter(Boolean);

    (async () => {
      for (const src of candidates) {
        try {
          const res = await fetch(src, { method: 'HEAD' });
          if (res.ok && (res.headers.get('content-type') || '').startsWith('video')) return src;
        } catch (e) { /* dosya yok: poster kalır */ }
      }
      return null;
    })().then((src) => {
      if (!src) return;
      const media = stage.querySelector('.stage-media');
      const toggle = stage.querySelector('.stage-toggle');
      const v = el('video', 'stage-video');
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
      v.tabIndex = -1;
      v.src = src;
      let userPaused = false;
      v.addEventListener('playing', () => {
        v.classList.add('is-ready');
        stage.classList.add('is-playing');
        if (toggle) toggle.hidden = false;
      }, { once: true });
      v.addEventListener('error', () => v.remove());
      media.appendChild(v);

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => {
          if (e.isIntersecting) { if (!userPaused) tryPlay(v); } else v.pause();
        }, { threshold: 0.15 }).observe(stage);
      }
      if (toggle) {
        toggle.addEventListener('click', () => {
          userPaused = !v.paused;
          if (userPaused) v.pause(); else tryPlay(v);
          toggle.textContent = userPaused ? '▶' : '❚❚';
          toggle.setAttribute('aria-label', userPaused ? 'Videoyu oynat' : 'Videoyu duraklat');
        });
      }
    });
  }
  initStage(document.querySelector('[data-stage="hero"]'), MEDIA.heroVideo);
  initStage(document.querySelector('[data-stage="seminar"]'), MEDIA.seminarVideo);

  // --- Oran korumalı video lightbox (proje + öğrenci videoları) ---
  let mm = null;
  function ensureMediaModal() {
    if (mm) return mm;
    const root = el('div', 'video-modal media-modal');
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Video oynatıcı');
    root.hidden = true;
    const backdrop = el('div', 'video-modal-backdrop');
    const dialog = el('div', 'video-modal-dialog mm-dialog');
    const close = el('button', 'video-modal-close', '✕');
    close.type = 'button';
    close.setAttribute('aria-label', 'Videoyu kapat');
    const frame = el('div', 'mm-frame');
    dialog.append(close, frame);
    root.append(backdrop, dialog);
    document.body.appendChild(root);
    mm = { root, frame, close, lastFocus: null };
    const shut = () => {
      mm.frame.replaceChildren();
      root.hidden = true;
      document.body.classList.remove('modal-open');
      if (mm.lastFocus) mm.lastFocus.focus();
    };
    close.addEventListener('click', shut);
    backdrop.addEventListener('click', shut);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !root.hidden) shut(); });
    return mm;
  }
  function openMedia(item, opener) {
    const m = ensureMediaModal();
    const r = parseRatio(item.ratio);
    m.frame.style.setProperty('--ar', r.css);
    m.frame.style.setProperty('--rn', r.num);
    let node = null;
    if (item.youtube && /^[\w-]{11}$/.test(item.youtube)) {
      node = document.createElement('iframe');
      node.src = `https://www.youtube-nocookie.com/embed/${item.youtube}?autoplay=1&rel=0&playsinline=1`;
      node.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      node.referrerPolicy = 'strict-origin-when-cross-origin';
      node.allowFullscreen = true;
      node.title = item.title || item.name || 'Video';
    } else if (safeVideoSrc(item.video)) {
      node = document.createElement('video');
      node.src = item.video;
      node.controls = true; node.autoplay = true; node.playsInline = true;
      node.setAttribute('playsinline', '');
      if (item.poster) node.poster = item.poster;
    }
    if (!node) return;
    m.frame.replaceChildren(node);
    m.lastFocus = opener || document.activeElement;
    m.root.hidden = false;
    document.body.classList.add('modal-open');
    m.close.focus();
  }

  // Ortak: poster (veya ilk kare) + oynat düğmesi taşıyan kart
  function buildCard(item, cls) {
    const r = parseRatio(item.ratio);
    const label = item.title || item.name || '';
    const b = el('button', cls);
    b.type = 'button';
    b.style.setProperty('--ar', r.css);
    b.setAttribute('aria-label', 'Videoyu oynat' + (label ? ': ' + label : ''));
    if (item.poster) {
      const img = el('img');
      img.src = item.poster; img.alt = ''; img.loading = 'lazy';
      b.appendChild(img);
    } else if (safeVideoSrc(item.video)) {
      const v = el('video');
      v.src = item.video + '#t=0.5'; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
      v.setAttribute('aria-hidden', 'true');
      b.appendChild(v);
      if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
        b.addEventListener('mouseenter', () => tryPlay(v));
        b.addEventListener('mouseleave', () => v.pause());
      }
    }
    b.appendChild(el('span', 'card-play', '▶'));
    if (item.title || item.category) {
      const meta = el('span', 'card-meta');
      if (item.category) meta.appendChild(el('i', null, item.category));
      if (item.title) meta.appendChild(el('b', null, item.title));
      b.appendChild(meta);
    }
    b.addEventListener('click', () => openMedia(item, b));
    return b;
  }

  const playable = (i) => i && (i.youtube || safeVideoSrc(i.video)) && (i.poster || safeVideoSrc(i.video));

  // --- Örnek Projeler: asimetrik masonry ---
  function renderProjects(items) {
    const wrap = document.querySelector('[data-projects]');
    const list = (items || []).filter(playable);
    if (!wrap || !list.length) return;
    wrap.replaceChildren();
    wrap.classList.add('has-items');
    list.forEach((it) => {
      const cell = el('div', 'm-item');
      cell.dataset.orient = parseRatio(it.ratio).vertical ? 'dikey' : 'yatay';
      cell.appendChild(buildCard(it, 'm-card'));
      wrap.appendChild(cell);
    });
    const badge = document.querySelector('#ornek-projeler [data-empty-badge]');
    if (badge) badge.remove();

    const filters = document.querySelector('[data-project-filters]');
    const kinds = new Set([...wrap.children].map((c) => c.dataset.orient));
    if (filters && kinds.size > 1) {
      filters.hidden = false;
      [['hepsi', 'Tümü'], ['dikey', 'Dikey'], ['yatay', 'Yatay']].forEach(([key, text]) => {
        const f = el('button', 'filter-chip', text);
        f.type = 'button';
        f.setAttribute('aria-pressed', key === 'hepsi' ? 'true' : 'false');
        f.addEventListener('click', () => {
          filters.querySelectorAll('.filter-chip').forEach((c) => c.setAttribute('aria-pressed', c === f ? 'true' : 'false'));
          wrap.querySelectorAll('.m-item').forEach((c) => { c.hidden = key !== 'hepsi' && c.dataset.orient !== key; });
        });
        filters.appendChild(f);
      });
    }
  }

  // Yatay kaydırmalı alanlar için ok düğmeleri
  function addScrollButtons(host, track, step) {
    const mk = (dir, text, label) => {
      const b = el('button', 'sc-btn sc-' + dir, text);
      b.type = 'button';
      b.setAttribute('aria-label', label);
      b.addEventListener('click', () => track.scrollBy({ left: (dir === 'next' ? 1 : -1) * step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
      return b;
    };
    const controls = el('div', 'sc-controls');
    controls.append(mk('prev', '←', 'Önceki'), mk('next', '→', 'Sonraki'));
    host.appendChild(controls);
  }

  // --- Öğrenciler: video galerisi (kaydırmalı) ---
  function renderStudents(items) {
    const wrap = document.querySelector('[data-students]');
    const list = (items || []).filter(playable);
    if (!wrap || !list.length) return;
    wrap.replaceChildren();
    wrap.classList.add('has-items');
    const track = el('div', 'sc-track');
    list.forEach((it) => {
      const item = Object.assign({ ratio: '9:16' }, it);
      const cell = el('div', 's-item' + (parseRatio(item.ratio).vertical ? ' is-vertical' : ' is-horizontal'));
      cell.appendChild(buildCard(item, 's-card'));
      if (item.name) cell.appendChild(el('p', 's-name', item.name));
      track.appendChild(cell);
    });
    wrap.appendChild(track);
    addScrollButtons(wrap, track, () => track.clientWidth * 0.8);
    const badge = document.querySelector('#referanslar [data-empty-badge]');
    if (badge) badge.remove();
    const note = document.querySelector('#referanslar [data-empty-note]');
    if (note) note.remove();
  }

  // --- Instagram: kaydırmalı, kenarları eğimli galeri ---
  function renderInstagram(items) {
    const wrap = document.querySelector('[data-instagram]');
    const list = (items || []).filter((i) => i && /^https:\/\/www\.instagram\.com\//.test(i.url || '') && (i.poster || safeVideoSrc(i.video)));
    if (!wrap || !list.length) return;
    wrap.replaceChildren();
    wrap.classList.add('has-items');
    const track = el('div', 'ig-track');
    const cards = list.map((it) => {
      const a = el('a', 'ig-card');
      a.href = it.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', "Instagram'da aç" + (it.title ? ': ' + it.title : ''));
      let v = null;
      if (it.poster) { const img = el('img'); img.src = it.poster; img.alt = ''; img.loading = 'lazy'; a.appendChild(img); }
      if (safeVideoSrc(it.video)) {
        v = el('video'); v.src = it.video; v.muted = true; v.loop = true; v.playsInline = true;
        v.preload = it.poster ? 'none' : 'metadata';
        v.setAttribute('aria-hidden', 'true');
        a.appendChild(v);
      }
      a.appendChild(el('span', 'ig-badge', 'Instagram'));
      if (it.title) a.appendChild(el('span', 'card-meta', it.title));
      track.appendChild(a);
      return { a, v };
    });
    wrap.appendChild(track);
    addScrollButtons(wrap, track, () => (cards[0].a.offsetWidth + 16) * 2);

    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let nearest = null, best = Infinity;
      cards.forEach((c) => {
        const d = (c.a.offsetLeft + c.a.offsetWidth / 2 - mid) / c.a.offsetWidth;
        const abs = Math.abs(d);
        if (abs < best) { best = abs; nearest = c; }
        if (!reduceMotion) {
          c.a.style.transform = `perspective(900px) rotateY(${Math.max(-1, Math.min(1, d)) * -16}deg) scale(${1 - Math.min(abs, 2.5) * 0.06})`;
          c.a.style.opacity = String(1 - Math.min(abs, 2.5) * 0.14);
        }
      });
      cards.forEach((c) => {
        if (!c.v) return;
        if (c === nearest && !reduceMotion) tryPlay(c.v); else c.v.pause();
      });
    };
    track.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    // ortadaki karttan başla
    const mid = cards[Math.floor(cards.length / 2)].a;
    track.scrollLeft = Math.max(0, mid.offsetLeft - (track.clientWidth - mid.offsetWidth) / 2);
    update();
  }

  renderProjects(MEDIA.projects);
  renderStudents(MEDIA.students);
  renderInstagram(MEDIA.instagram);
})();
