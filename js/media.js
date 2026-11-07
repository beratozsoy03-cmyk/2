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
      // Kapanınca indirmeyi de durdur; yoksa video arka planda inmeye devam eder ve sonraki videoyu bekletir
      const playing = mm.frame.querySelector('video');
      if (playing) { playing.pause(); playing.removeAttribute('src'); playing.load(); }
      mm.frame.replaceChildren();
      root.hidden = true;
      document.body.classList.remove('modal-open');
      if (mm.lastFocus) mm.lastFocus.focus();
      document.dispatchEvent(new CustomEvent('site:media-close'));
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
    document.dispatchEvent(new CustomEvent('site:media-open'));
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

  // --- Örnek Projeler: boşluksuz satır ızgarası (24 sütun) ---
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

    // İlk 6 video görünür; kalanı "Tümünü Gör" ile açılır. Filtre seçiliyken eşleşenlerin tamamı görünür.
    const PREVIEW_COUNT = 6;
    const cells = [...wrap.children];
    let activeFilter = 'hepsi';
    let expanded = false;
    let moreWrap = null;
    let moreBtn = null;

    // Kartları satırlara yerleştirir: dikey kartlar yan yana, yatay kartlar geniş; eksik kalan satır ortalanır.
    // Üç yatay + iki dikey kart yan yana gelince mozaik oluşur (geniş yatay, altında iki yatay, yanında iki dikey).
    const wideMq = window.matchMedia('(min-width: 768px)');
    const desktopMq = window.matchMedia('(min-width: 1025px)');
    const applyLayout = () => {
      const visible = cells.filter((c) => !c.hidden);
      const wide = wideMq.matches;
      const isV = (c) => c.dataset.orient === 'dikey';
      let row = 1;
      let cols = 24;
      const put = (c, start, span, opts = {}) => {
        c.style.gridColumn = `${start} / span ${span}`;
        c.style.gridRow = `${row} / span ${opts.rows || 1}`;
        c.classList.toggle('is-fill', !!opts.fill);
        c.classList.toggle('is-compact', !!opts.compact);
      };
      const putRow = (group, span) => {
        const first = (cols - group.length * span) / 2 + 1;
        group.forEach((c, i) => put(c, first + i * span, span));
        row += 1;
      };
      const putAll = (group, perRow, span) => {
        for (let i = 0; i < group.length; i += perRow) putRow(group.slice(i, i + perRow), span);
      };
      // Filtre seçiliyken kartlar tek tiptir
      wrap.style.gridTemplateColumns = '';
      if (visible.length && visible.every(isV)) {
        const n = visible.length;
        if (!wide) { putAll(visible, 2, 12); return; }
        // Eşit bölünebilen sayıda kart eşit satırlara dizilir; bölünmüyorsa son satır ortalanır
        const even = (desktopMq.matches ? [6, 5, 4] : [3, 5, 4]).find((p) => n % p === 0);
        if (even === 5) { cols = 5; wrap.style.gridTemplateColumns = 'repeat(5, minmax(0, 1fr))'; putAll(visible, 5, 1); }
        else if (even) putAll(visible, even, 24 / even);
        else putAll(visible, 4, 6);
        return;
      }
      if (visible.length && !visible.some(isV)) {
        if (!wide) putAll(visible, 1, 24);
        else if (visible.length % 3 === 0) putAll(visible, 3, 8);
        else putAll(visible, 2, 12);
        return;
      }
      for (let i = 0; i < visible.length;) {
        const r = visible.slice(i);
        if (wide && r.length >= 5 && r.slice(0, 3).every((c) => !isV(c)) && r.slice(3, 5).every(isV)) {
          put(r[0], 1, 12);
          row += 1;
          put(r[1], 1, 6, { compact: true });
          put(r[2], 7, 6, { compact: true });
          row -= 1;
          put(r[3], 13, 6, { rows: 2, fill: true });
          put(r[4], 19, 6, { rows: 2, fill: true });
          row += 2;
          i += 5;
          continue;
        }
        const vertical = isV(r[0]);
        const perRow = vertical ? (wide ? 4 : 2) : (wide ? 2 : 1);
        let n = 1;
        while (n < perRow && n < r.length && isV(r[n]) === vertical) n += 1;
        // Tek kalan yatay kart satırı tek başına doldurur
        putRow(r.slice(0, n), vertical ? (wide ? 6 : 12) : (wide && n > 1 ? 12 : 24));
        i += n;
      }
    };
    wideMq.addEventListener('change', applyLayout);
    desktopMq.addEventListener('change', applyLayout);

    const applyVisibility = () => {
      cells.forEach((c, i) => {
        const matches = activeFilter === 'hepsi' || c.dataset.orient === activeFilter;
        c.hidden = !matches || (activeFilter === 'hepsi' && !expanded && i >= PREVIEW_COUNT);
      });
      if (moreWrap) {
        moreWrap.hidden = activeFilter !== 'hepsi';
        moreBtn.textContent = expanded ? 'Daha Az Göster' : `Tümünü Gör (${cells.length})`;
        moreBtn.setAttribute('aria-expanded', String(expanded));
      }
      applyLayout();
    };
    if (cells.length > PREVIEW_COUNT) {
      moreWrap = el('div', 'project-more');
      moreBtn = el('button', 'btn btn-ghost');
      moreBtn.type = 'button';
      moreBtn.addEventListener('click', () => {
        expanded = !expanded;
        applyVisibility();
        if (!expanded) wrap.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      moreWrap.appendChild(moreBtn);
      wrap.after(moreWrap);
    }

    const filters = document.querySelector('[data-project-filters]');
    const kinds = new Set(cells.map((c) => c.dataset.orient));
    if (filters && kinds.size > 1) {
      filters.hidden = false;
      [['hepsi', 'Tümü'], ['dikey', 'Dikey'], ['yatay', 'Yatay']].forEach(([key, text]) => {
        const f = el('button', 'filter-chip', text);
        f.type = 'button';
        f.setAttribute('aria-pressed', key === 'hepsi' ? 'true' : 'false');
        f.addEventListener('click', () => {
          filters.querySelectorAll('.filter-chip').forEach((c) => c.setAttribute('aria-pressed', c === f ? 'true' : 'false'));
          activeFilter = key;
          applyVisibility();
        });
        filters.appendChild(f);
      });
    }
    applyVisibility();
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
    // Bölüm, gerçek öğrenci videosu eklenene kadar HTML'de gizli durur
    const section = document.getElementById('referanslar');
    if (section) section.hidden = false;
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

  // --- Instagram: tam genişlikte dikey video karuseli (görünen kartların önizlemesi oynar) ---
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
      if (it.poster) { const img = el('img'); img.dataset.src = it.poster; img.alt = ''; a.appendChild(img); }
      if (safeVideoSrc(it.video)) {
        v = el('video'); v.src = it.video; v.muted = true; v.loop = true; v.playsInline = true;
        v.preload = it.poster ? 'none' : 'metadata';
        v.setAttribute('aria-hidden', 'true');
        a.appendChild(v);
      }
      if (it.title) a.appendChild(el('span', 'card-meta', it.title));
      track.appendChild(a);
      return { a, v };
    });
    wrap.appendChild(track);
    if (cards.length > 1) addScrollButtons(wrap, track, () => (cards[0].a.offsetWidth + 10) * 3);
    const arrows = [...wrap.querySelectorAll('.sc-btn')];

    // Önizleme yalnızca bölüm ekrana yaklaşınca iner ve oynar
    let inView = !('IntersectionObserver' in window);
    let raf = 0;
    let postersLoaded = false;
    const update = () => {
      raf = 0;
      // Kapaklar da bölüme yaklaşınca iner: ilk açılış yükü artmaz
      if (inView && !postersLoaded) {
        postersLoaded = true;
        track.querySelectorAll('img[data-src]').forEach((img) => { img.src = img.dataset.src; });
      }
      const mid = track.scrollLeft + track.clientWidth / 2;
      // Aynı anda en fazla 3 önizleme (mobilde 1): ekrandaki, merkeze en yakın videolu kartlar
      const limit = window.innerWidth <= 640 ? 1 : 3;
      const left = track.scrollLeft, right = left + track.clientWidth;
      const active = cards.filter((c) => c.v && c.a.offsetLeft + c.a.offsetWidth > left && c.a.offsetLeft < right)
        .sort((a, b) => Math.abs(a.a.offsetLeft + a.a.offsetWidth / 2 - mid) - Math.abs(b.a.offsetLeft + b.a.offsetWidth / 2 - mid))
        .slice(0, limit);
      cards.forEach((c) => {
        if (!c.v) return;
        if (inView && active.includes(c) && !reduceMotion) tryPlay(c.v); else c.v.pause();
      });
      if (arrows.length === 2) {
        arrows[0].disabled = left <= 1;
        arrows[1].disabled = right >= track.scrollWidth - 1;
      }
    };
    track.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    // ortadaki karttan başla
    const mid = cards[Math.floor(cards.length / 2)].a;
    track.scrollLeft = Math.max(0, mid.offsetLeft - (track.clientWidth - mid.offsetWidth) / 2);
    update();
    if (!inView) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        update();
      }, { rootMargin: '600px 0px' }).observe(track);
    }
  }

  // --- Satın alma düğmesi: yalnızca gerçek bir https bağlantısı girildiyse etkinleşir ---
  function applyPurchaseLink(url) {
    const link = document.querySelector('[data-purchase-link]');
    if (!link || !/^https:\/\/\S+$/.test(url || '')) return;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled');
    link.classList.add('btn-primary');
    link.textContent = 'Eğitime Katıl ';
    link.appendChild(el('span', 'arrow', '→'));
  }

  applyPurchaseLink(MEDIA.purchaseUrl);
  renderProjects(MEDIA.projects);
  renderStudents(MEDIA.students);
  renderInstagram(MEDIA.instagram);
})();
