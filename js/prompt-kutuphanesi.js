/* ============================================================
   PROMPT KÜTÜPHANESİ + OLUŞTURUCU
   Veri: js/prompts-data.js, js/prompt-builder-data.js
   Sunucu, veritabanı veya harici servis kullanılmaz.
   ============================================================ */
(() => {
  const LIB = window.PROMPT_LIBRARY;
  // Modal açıp kapatırken (geri tuşu) tarayıcının kaydırma konumunu geri yüklemesini engelle
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const PB = window.PROMPT_BUILDER;

  // ---------- yardımcılar ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TR_MAP = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
  const norm = (s) => String(s ?? '').toLocaleLowerCase('tr').replace(/[çğıöşüâîû]|i̇/g, (c) => TR_MAP[c] || c);
  const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const isMobile = () => window.matchMedia('(max-width: 820px)').matches;

  // Prototipsiz sözlükler: URL veya veri üzerinden gelen "__proto__", "constructor" gibi
  // anahtarlar Object.prototype özelliklerine çözülmesin
  const dict = (entries) => Object.assign(Object.create(null), Object.fromEntries(entries));
  const catName = dict(LIB.categories.map((c) => [c.id, c.name]));
  const prompts = [...LIB.prompts].sort((a, b) => b.date.localeCompare(a.date));
  // Müşterinin göndereceği konsept videoları: js/prompts-data.js > conceptMedia içinde id ile eşlenir.
  // Eşlenmeyen kartlar temsilî önizlemeyle ve tüm prompt işlevleriyle çalışmaya devam eder.
  const conceptMedia = LIB.conceptMedia || {};
  prompts.forEach((p) => {
    const m = p.demo && Object.prototype.hasOwnProperty.call(conceptMedia, p.id) ? conceptMedia[p.id] : null;
    if (m && m.video) Object.assign(p, m);
  });
  // Kayıtlar salt okunur: gerçek prompt metinleri sayfa içinde yanlışlıkla değişemez
  prompts.forEach((p) => Object.freeze(p));
  const byId = dict(prompts.map((p) => [p.id, p]));
  // Öne çıkan alan: en yeni gerçek video (yoksa en yeni kayıt)
  const latest = prompts.find((p) => !p.demo) || prompts[0];

  const toolFamily = (t) => String(t || "").split(" ")[0];
  const pageUrl = () => location.origin + location.pathname;
  const shareUrl = (id) => `${pageUrl()}?prompt=${encodeURIComponent(id)}`;

  // ---------- toast ----------
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    void toastEl.offsetWidth; // geçiş efektinin başlaması için yeniden yerleşim
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => { toastEl.hidden = true; }, 250);
    }, 2200);
  }

  // ---------- kopyalama ----------
  // Eski tarayıcılar, uygulama içi tarayıcılar (Instagram vb.) ve izin verilmeyen durumlar için yedek yöntem
  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px';
    document.body.appendChild(ta);
    const prevFocus = document.activeElement;
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true });
    return ok;
  }

  async function copyText(text) {
    // Önce kullanıcının tıklamasıyla aynı anda çalışan klasik yöntem; Instagram'ın
    // uygulama içi tarayıcısında Clipboard API bazen yanıt vermiyor.
    if (legacyCopy(text)) return true;
    if (!navigator.clipboard || !window.isSecureContext) return false;
    try {
      // API bazı durumlarda (sekme odakta değilken) hiç yanıt vermiyor: zaman aşımı ekle
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
      ]);
      return true;
    } catch {
      return false;
    }
  }

  function flashCopied(btn, doneLabel = 'Kopyalandı') {
    if (!btn) return;
    const label = btn.querySelector('.label');
    const orig = label ? label.textContent : null;
    btn.classList.add('is-copied');
    if (label) label.textContent = doneLabel;
    clearTimeout(btn._t);
    btn._t = setTimeout(() => {
      btn.classList.remove('is-copied');
      if (label) label.textContent = orig;
    }, 1800);
  }

  async function copyPrompt(id, btn) {
    const p = byId[id];
    if (!p) return;
    const ok = await copyText(p.prompt);
    if (ok) { flashCopied(btn); toast('Prompt kopyalandı. Video aracına yapıştırabilirsin.'); }
    else toast('Kopyalanamadı. Metni seçip elle kopyalayabilirsin.');
  }

  async function sharePrompt(id, btn) {
    const p = byId[id];
    const url = shareUrl(id);
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try { await navigator.share({ title: `${p.title} — Prompt`, url }); return; } catch { /* kullanıcı vazgeçti */ }
    }
    if (await copyText(url)) { flashCopied(btn, 'Bağlantı kopyalandı'); toast('Paylaşım bağlantısı kopyalandı.'); }
  }

  // ---------- önizleme (video / kapak / demo sahnesi) ----------
  const isWide = (p) => ['16:9', '21:9'].includes(p.ratio);
  const ratioClass = (r) => 'r-' + String(r || '9:16').replace(':', 'x');

  function mediaHTML(p, { fit = 'native' } = {}) {
    const cls = `media ${fit === 'native' ? ratioClass(p.ratio) : 'r-card'}`;
    let inner;
    if (p.video) {
      // Video dosyası ancak kart ekrana girince yüklenir (data-src); kapak görseli de ekrana
      // yaklaşınca atanır (data-poster). Mobilde büyük alanlar da küçük sürümü kullanır.
      const small = p.videoSmall && (fit !== 'native' || isMobile());
      const src = small ? p.videoSmall : p.video;
      inner = `<video class="media-el" data-src="${esc(src)}" ${p.poster ? `data-poster="${esc(p.poster)}"` : ''} muted loop playsinline disablepictureinpicture preload="none" aria-label="${esc(p.title)} video önizlemesi"></video>`;
    } else if (p.poster) {
      inner = `<img class="media-el" src="${esc(p.poster)}" alt="${esc(p.title)} kapak görseli" loading="lazy">`;
    } else {
      const pv = p.preview || { scene: 'studio', motion: 'push-in' };
      inner = `<div class="pv pv-${esc(pv.scene)} mv-${esc(pv.motion)}" aria-hidden="true">
        <div class="pv-world"><span class="pv-sky"></span><span class="pv-far"></span><span class="pv-subject"></span><span class="pv-near"></span></div>
        <span class="pv-vignette"></span>
      </div>`;
    }
    const badges = `<span class="media-badges">${p.demo ? '<span class="m-badge m-badge-demo">Örnek içerik</span>' : ''}${!p.demo && p.instagram ? '<span class="m-badge m-badge-real">Instagram</span>' : ''}<span class="m-badge">${p.outputFormat ? 'Önizleme' : esc(p.ratio)} · ${esc(p.duration)} sn</span></span>`;
    const demoNote = !p.video && !p.poster ? '<span class="media-note">Demo önizleme · gerçek video eklenecek</span>' : '';
    return `<div class="${cls}">${inner}${badges}${demoNote}</div>`;
  }

  // Video oynatma kuralları (mobil performans):
  // - dosya yalnızca kart ekrana girince indirilir, ekrandan çıkınca durdurulur
  // - "Veri tasarrufu" açıksa veya kullanıcı hareketi azaltmayı seçtiyse otomatik oynatılmaz; kapak görünür
  const noAutoplay = (navigator.connection && navigator.connection.saveData)
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function playVideo(v) {
    setPoster(v);
    if (!v.getAttribute('src')) { v.src = v.dataset.src; v.preload = 'auto'; }
    if (noAutoplay) return;
    const pr = v.play();
    if (pr) pr.catch(() => v.closest('.media')?.classList.add('needs-tap'));
  }

  const mediaObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      e.target.classList.toggle('is-visible', e.isIntersecting);
      const v = e.target.querySelector('video');
      if (!v) return;
      if (e.isIntersecting) playVideo(v); else v.pause();
    });
  }, { threshold: 0.25, rootMargin: '120px 0px' }) : null;
  // Kapak görselleri ekrana yaklaşırken (yaklaşık bir ekran önce) yüklenir
  const setPoster = (v) => { if (v.dataset.poster && !v.getAttribute('poster')) v.poster = v.dataset.poster; };
  const posterObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { setPoster(e.target); obs.unobserve(e.target); } });
  }, { rootMargin: '600px 0px' }) : null;
  const observeMedia = (root) => $$('.media', root).forEach((m) => {
    const v = m.querySelector('video');
    if (v) {
      v.addEventListener('playing', () => m.classList.add('is-playing'), { once: true });
      if (posterObserver) posterObserver.observe(v); else setPoster(v);
    }
    if (mediaObserver) mediaObserver.observe(m);
    else { m.classList.add('is-visible'); if (v) playVideo(v); }
  });
  // Otomatik oynatmanın engellendiği tarayıcılarda dokununca oynat
  document.addEventListener('click', (e) => {
    const m = e.target.closest('.media.needs-tap');
    if (!m) return;
    const v = m.querySelector('video');
    if (v) { v.play().catch(() => {}); m.classList.remove('needs-tap'); }
  }, true);

  // ---------- ortak detay içeriği (öne çıkan + modal) ----------
  const COPY_IC = '<span class="copy-ic" aria-hidden="true"></span>';

  function metaHTML(p) {
    return `<dl class="meta-list">
      <div><dt>Video aracı</dt><dd>${esc(p.tool)}</dd></div>
      ${p.imageTool ? `<div><dt>Görsel aracı</dt><dd>${esc(p.imageTool)}</dd></div>` : ''}
      ${p.outputFormat
        ? `<div><dt>Promptun hedefi</dt><dd>${esc(p.outputFormat)}</dd></div><div><dt>Buradaki önizleme</dt><dd>Kısa kesit, ${esc(p.duration)} sn</dd></div>`
        : `<div><dt>Format</dt><dd>${esc(p.ratio)} · ${esc(p.duration)} sn</dd></div>`}
      <div><dt>Eklendi</dt><dd>${fmtDate(p.date)}</dd></div>
    </dl>`;
  }

  function relatedHTML(p, n = 3) {
    const same = prompts.filter((x) => x.id !== p.id && x.category === p.category);
    const rest = prompts.filter((x) => x.id !== p.id && x.category !== p.category);
    const realFirst = (a, b) => (a.demo === b.demo ? 0 : a.demo ? 1 : -1);
    const list = [...same.sort(realFirst), ...rest.sort(realFirst)].slice(0, n);
    return `<div class="related">
      <p class="group-label">Benzer promptlar</p>
      <div class="related-list">
        ${list.map((r) => `<button type="button" class="related-item" data-open="${esc(r.id)}">
          ${mediaHTML(r, { fit: 'card' })}
          <span class="related-text"><span class="related-cat">${esc(catName[r.category])}</span><strong>${esc(r.title)}</strong></span>
        </button>`).join('')}
      </div>
    </div>`;
  }

  // Videonun gerçekten bu promptla üretilip üretilmediğini açıkça belirt
  function promptOriginHTML(p) {
    const defaults = {
      gercek: '✓ Gerçek üretim promptu: bu video bu metinle üretildi.',
      aciklama: 'Prompt, videonun Instagram açıklamasında paylaşılan sahne tarifinden alındı.',
      ornek: 'Örnek prompt — videoya benzer bir sonuç için hazırlandı; videonun orijinal promptu değildir.'
    };
    const type = p.promptType || 'ornek';
    if (type === 'ornek' && !p.video && !p.poster) return '';
    return `<p class="prompt-origin ${type === 'gercek' ? 'is-real' : ''} ${type === 'aciklama' ? 'is-caption' : ''}">${esc(p.promptNote || defaults[type] || defaults.ornek)}</p>`;
  }

  // Promptun metinde andığı referans görseller (görseller bu sayfada sunulmaz)
  function referenceBoxHTML(p) {
    if (!p.referenceImages || !p.referenceImages.length) return '';
    return `<div class="ref-required">
      <p class="ref-required-title">Bu prompt ${p.referenceImages.length} referans görsel ister</p>
      <ul>${p.referenceImages.map((r) => `<li><strong>${esc(r.id)}</strong> <span>${esc(r.role)}: ${esc(r.desc)}</span></li>`).join('')}</ul>
      <p class="ref-required-note">Görseller burada verilmez. Kendi projenin görsellerini hazırlayıp video aracına bu sırayla yüklemelisin.</p>
    </div>`;
  }

  function detailBodyHTML(p, { headingTag = 'h2', headingId = '', label = '' } = {}) {
    const saved = savedIds.has(p.id);
    return `
      <div class="detail-tags">
        ${label ? `<span class="tag tag-accent">${label}</span>` : ''}
        <span class="tag">${esc(catName[p.category])}</span>
        ${p.demo ? '<span class="draft-badge">Örnek içerik</span>' : ''}
      </div>
      <${headingTag} class="detail-title" ${headingId ? `id="${headingId}"` : ''}>${esc(p.title)}</${headingTag}>
      <p class="detail-summary">${esc(p.summary)}</p>
      ${metaHTML(p)}
      <div class="prompt-panel">
        <div class="prompt-panel-head">
          <span class="group-label">Prompt <span class="lang-pill">EN</span></span>
          <button type="button" class="link-btn" data-expand>Tamamını göster</button>
        </div>
        ${promptOriginHTML(p)}
        ${referenceBoxHTML(p)}
        <pre class="prompt-box is-clamped" tabindex="0">${esc(p.prompt)}</pre>
        <button type="button" class="prompt-more" data-expand aria-expanded="false">Promptun devamını göster</button>
        <button class="btn btn-primary btn-block btn-copy btn-copy-lg" type="button" data-copy="${esc(p.id)}">${COPY_IC}<span class="label">Promptu Kopyala</span></button>
      </div>
      <div class="detail-actions">
        <button class="btn btn-ghost btn-sm" type="button" data-share="${esc(p.id)}"><span class="label">Bağlantıyı paylaş</span></button>
        ${p.builder ? `<button class="btn btn-ghost btn-sm" type="button" data-edit="${esc(p.id)}">Oluşturucuda düzenle</button>` : ''}
        <button class="btn btn-ghost btn-sm btn-save ${saved ? 'is-saved' : ''}" type="button" data-save="${esc(p.id)}" aria-pressed="${saved}">${saved ? '★ Kaydedildi' : '☆ Kaydet'}</button>
      </div>
      ${p.steps && p.steps.length ? `<details class="howto" ${isMobile() ? '' : 'open'}>
        <summary>Bu video nasıl yapıldı?</summary>
        <ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      </details>` : ''}
      ${p.instagram ? `<a class="link-arrow ig-link" href="${esc(p.instagram)}" target="_blank" rel="noopener noreferrer">Instagram'da izle <span class="arrow">→</span></a>` : ''}`;
  }

  // Kısa promptlarda "devamını göster" düğmeleri gereksizdir; uzun promptta metnin sürdüğü açıkça görünür
  function syncClamps(root) {
    $$('.prompt-panel', root).forEach((panel) => {
      const box = $('.prompt-box', panel);
      const fits = box.scrollHeight <= box.clientHeight + 4;
      if (fits) box.classList.remove('is-clamped');
      $$('[data-expand]', panel).forEach((b) => { b.hidden = fits; });
    });
  }
  function setPromptExpanded(panel, open) {
    const box = $('.prompt-box', panel);
    box.classList.toggle('is-clamped', !open);
    $$('[data-expand]', panel).forEach((b) => {
      b.setAttribute('aria-expanded', String(open));
      b.textContent = b.classList.contains('prompt-more')
        ? (open ? 'Promptu daralt' : 'Promptun devamını göster')
        : (open ? 'Daralt' : 'Tamamını göster');
    });
  }

  // ---------- ÖNE ÇIKAN ----------
  const featuredEl = $('#featured');
  let featuredId = null;

  function renderFeatured(p, { shared = false } = {}) {
    featuredId = p.id;
    featuredEl.classList.toggle('is-wide', isWide(p));
    const label = shared ? 'Paylaşılan prompt' : 'En yeni prompt';
    featuredEl.innerHTML = `
      <div class="feature-media">${mediaHTML(p)}</div>
      <div class="feature-body">
        ${detailBodyHTML(p, { label })}
        ${shared && p.id !== latest.id ? `<button type="button" class="latest-link" data-open="${esc(latest.id)}"><span>En yeni prompt</span><strong>${esc(latest.title)}</strong><span class="arrow">→</span></button>` : ''}
        ${relatedHTML(p)}
      </div>`;
    observeMedia(featuredEl);
    syncClamps(featuredEl);
    $('#stickyCopyText').textContent = p.title;
  }

  // ---------- KÜTÜPHANE ----------
  const grid = $('#promptGrid');
  const state = { q: '', cat: '', tool: '', sort: 'new' };

  function cardHTML(p) {
    const saved = savedIds.has(p.id);
    return `<article class="card">
      <button type="button" class="card-media" data-open="${esc(p.id)}" aria-label="${esc(p.title)} promptunu aç">${mediaHTML(p, { fit: 'card' })}</button>
      <div class="card-body">
        <p class="pc-meta"><span>${esc(catName[p.category])}</span><span class="dot">•</span><span>${esc(p.tool)}</span></p>
        <h3 class="card-title"><button type="button" data-open="${esc(p.id)}">${esc(p.title)}</button></h3>
        <div class="card-actions">
          <button class="btn btn-primary btn-sm btn-copy" type="button" data-copy="${esc(p.id)}">${COPY_IC}<span class="label">Kopyala</span></button>
          <button class="btn btn-ghost btn-sm" type="button" data-open="${esc(p.id)}">Detay</button>
          <button class="icon-btn btn-save ${saved ? 'is-saved' : ''}" type="button" data-save="${esc(p.id)}" aria-pressed="${saved}" aria-label="Kaydet">${saved ? '★' : '☆'}</button>
        </div>
      </div>
    </article>`;
  }

  // Kategori dışındaki filtreler (arama + araç) her iki yerde aynı kurala göre uygulanır:
  // çip sayaçları ile listelenen kartlar bu sayede birbirini tutar.
  function filtered({ ignoreCat = false } = {}) {
    const q = norm(state.q.trim());
    const terms = q.split(/\s+/).filter(Boolean);
    let list = prompts.filter((p) => {
      if (!ignoreCat && state.cat && p.category !== state.cat) return false;
      if (state.tool && toolFamily(p.tool) !== state.tool) return false;
      if (!terms.length) return true;
      const hay = norm([p.title, p.summary, p.tool, p.imageTool, catName[p.category], (p.tags || []).join(' '), p.prompt].join(' '));
      return terms.every((t) => hay.includes(t));
    });
    if (state.sort === 'old') list = [...list].reverse();
    if (state.sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'tr'));
    return list;
  }

  function renderChips() {
    // Sayaç: aktif arama ve araç filtresiyle bu kategoride görülebilecek toplam içerik (video + konsept)
    const pool = filtered({ ignoreCat: true });
    const tally = (list) => ({ n: list.length, video: list.filter((p) => !p.demo).length });
    const items = [{ id: '', name: 'Tümü', ...tally(pool) },
      ...LIB.categories.map((c) => ({ ...c, ...tally(pool.filter((p) => p.category === c.id)) }))];
    $('#categoryChips').innerHTML = items.map((c) => {
      const on = state.cat === c.id;
      const detail = `${c.video} video, ${c.n - c.video} konsept`;
      return `<button type="button" class="chip ${on ? 'is-active' : ''}" data-cat="${c.id}" aria-pressed="${on}" title="${detail}" aria-label="${esc(c.name)}: ${detail}" ${c.n || on ? '' : 'disabled'}>${esc(c.name)} <span class="chip-n">${c.n}</span></button>`;
    }).join('');
  }

  // Ana ızgarada gerçek videolu içerikler; videosu olmayan konsept (demo) kartlar
  // aynı filtrelerle alttaki ayrı bölümde listelenir.
  function renderGrid() {
    const list = filtered();
    const real = list.filter((p) => !p.demo);
    const demos = list.filter((p) => p.demo);
    grid.innerHTML = real.map(cardHTML).join('');
    observeMedia(grid);
    const demoWrap = $('#demoSection');
    demoWrap.hidden = demos.length === 0;
    $('#demoGrid').innerHTML = demos.map(cardHTML).join('');
    $('#demoCount').textContent = demos.length;
    observeMedia($('#demoGrid'));
    $('#emptyState').hidden = list.length > 0;
    $('#realEmpty').hidden = !(real.length === 0 && demos.length > 0);
    const active = state.q || state.cat || state.tool;
    // Filtre etkinken sayaçtaki içeriğin tamamı görünsün: konsept kartları kapalı bölümde kalmaz.
    // Filtre kalkınca bölüm, kullanıcının filtreden önceki durumuna döner.
    if (active && demos.length > 0) {
      if (demoOpenBeforeFilter === null) demoOpenBeforeFilter = demoWrap.open;
      demoWrap.open = true;
    } else if (!active && demoOpenBeforeFilter !== null) {
      demoWrap.open = demoOpenBeforeFilter;
      demoOpenBeforeFilter = null;
    }
    const totalReal = prompts.filter((p) => !p.demo).length;
    $('#resultCount').textContent = active ? `${real.length} video · ${demos.length} konsept` : `${totalReal} gerçek video · ${prompts.length - totalReal} konsept`;
  }
  let demoOpenBeforeFilter = null;

  function renderLibrary() { renderChips(); renderGrid(); }

  // araç filtresi
  // Araç filtresi aileye göre gruplanır: "Kling 2.5 Turbo", "Kling O1 Edit" → "Kling"
  const tools = [...new Set(prompts.map((p) => toolFamily(p.tool)))].sort((a, b) => (a === "Belirtilmedi") - (b === "Belirtilmedi") || a.localeCompare(b, "tr"));
  $('#toolSelect').insertAdjacentHTML('beforeend', tools.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join(''));

  const searchInput = $('#searchInput');
  let searchTimer;
  searchInput.addEventListener('input', () => {
    $('#searchClear').hidden = !searchInput.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = searchInput.value; renderLibrary(); }, 120);
  });
  $('#searchClear').addEventListener('click', () => {
    searchInput.value = ''; state.q = ''; $('#searchClear').hidden = true; renderLibrary(); searchInput.focus();
  });
  $('#categoryChips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    renderLibrary();
  });
  $('#toolSelect').addEventListener('change', (e) => { state.tool = e.target.value; renderLibrary(); });
  $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; renderGrid(); });
  $('#resetFilters').addEventListener('click', () => {
    Object.assign(state, { q: '', cat: '', tool: '' });
    searchInput.value = ''; $('#searchClear').hidden = true; $('#toolSelect').value = '';
    renderLibrary();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); searchInput.focus(); }
  });

  // ---------- DETAY MODALI + URL ----------
  const modal = $('#promptModal');
  const modalBody = $('#modalBody');
  let modalPushed = false;
  let lastFocus = null;

  function lockScroll(on) { document.body.classList.toggle('modal-open', on); }

  function openPromptModal(id, { push = true } = {}) {
    const p = byId[id];
    if (!p) return;
    if (modal.hidden) lastFocus = document.activeElement;
    modalBody.innerHTML = `<div class="detail ${isWide(p) ? 'is-wide' : ''}">
      <div class="detail-media">${mediaHTML(p)}</div>
      <div class="detail-body">${detailBodyHTML(p, { headingId: 'modalTitle' })}${relatedHTML(p)}</div>
    </div>`;
    modalBody.scrollTop = 0;
    modal.hidden = false;
    lockScroll(true);
    observeMedia(modalBody);
    syncClamps(modalBody);
    if (push) {
      const url = `?prompt=${encodeURIComponent(id)}`;
      if (modalPushed) history.replaceState({ prompt: id }, '', url);
      else { history.pushState({ prompt: id }, '', url); modalPushed = true; }
    }
    $('.sheet-close', modal).focus();
  }

  function closePromptModal({ fromPop = false } = {}) {
    if (modal.hidden) return;
    modal.hidden = true;
    modalBody.innerHTML = '';
    if ($('#authModal').hidden) lockScroll(false);
    if (!fromPop && modalPushed) { modalPushed = false; history.back(); }
    modalPushed = false;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  window.addEventListener('popstate', () => {
    const id = new URLSearchParams(location.search).get('prompt');
    if (id && byId[id] && id !== featuredId) openPromptModal(id, { push: false });
    else closePromptModal({ fromPop: true });
  });

  // ---------- ortak tıklama yönetimi ----------
  document.addEventListener('click', (e) => {
    const t = e.target;
    const open = t.closest('[data-open]');
    if (open) {
      e.preventDefault();
      const id = open.dataset.open;
      if (id === featuredId && modal.hidden) { $('#one-cikan').scrollIntoView({ behavior: 'smooth' }); return; }
      openPromptModal(id);
      return;
    }
    const cp = t.closest('[data-copy]');
    if (cp) { copyPrompt(cp.dataset.copy, cp); return; }
    const sh = t.closest('[data-share]');
    if (sh) { sharePrompt(sh.dataset.share, sh); return; }
    const ed = t.closest('[data-edit]');
    if (ed) { loadIntoBuilder(ed.dataset.edit); return; }
    const sv = t.closest('[data-save]');
    if (sv) { toggleSave(sv.dataset.save); return; }
    const ex = t.closest('[data-expand]');
    if (ex) {
      const panel = ex.closest('.prompt-panel');
      const open = $('.prompt-box', panel).classList.contains('is-clamped');
      setPromptExpanded(panel, open);
      return;
    }
    if (t.closest('[data-close]')) {
      const sheet = t.closest('.sheet');
      if (sheet === modal) closePromptModal(); else closeAuth();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#authModal').hidden) closeAuth();
    else if (!modal.hidden) closePromptModal();
    else if (!$('#mobileMenu').hidden) toggleMenu(false);
    else if (!$('#userMenu').hidden) toggleUserMenu(false);
  });

  // ---------- KAYDETME (yalnızca demo görünümde, bellekte) ----------
  const savedIds = new Set();
  const savedBuilt = [];
  let demoUser = false;

  function toggleSave(id) {
    if (!demoUser) { openAuth('login', 'Promptları kaydetmek için giriş yapman gerekecek. (Prototip)'); return; }
    if (savedIds.has(id)) savedIds.delete(id); else savedIds.add(id);
    $$(`[data-save="${CSS.escape(id)}"]`).forEach((b) => {
      const on = savedIds.has(id);
      b.classList.toggle('is-saved', on);
      b.setAttribute('aria-pressed', on);
      b.textContent = b.classList.contains('icon-btn') ? (on ? '★' : '☆') : (on ? '★ Kaydedildi' : '☆ Kaydet');
    });
    renderSaved();
    toast(savedIds.has(id) ? 'Kaydedildi (demo — sayfa yenilenince silinir).' : 'Kayıtlardan çıkarıldı.');
  }

  function renderSaved() {
    const el = $('#savedList');
    const items = [...savedIds].map((id) => byId[id]).filter(Boolean);
    if (!items.length && !savedBuilt.length) {
      el.innerHTML = '<p class="saved-empty">Henüz kayıt yok. Kartlardaki ☆ simgesiyle ya da oluşturucudaki “Bu promptu kaydet” ile ekleyebilirsin.</p>';
      return;
    }
    el.innerHTML = items.map((p) => `<div class="saved-item"><span class="saved-kind">Kütüphane</span><strong>${esc(p.title)}</strong>
        <span class="saved-actions"><button class="link-btn" type="button" data-open="${esc(p.id)}">Aç</button><button class="link-btn" type="button" data-copy="${esc(p.id)}"><span class="label">Kopyala</span></button></span></div>`).join('')
      + savedBuilt.map((b, i) => `<div class="saved-item"><span class="saved-kind">Oluşturduğum</span><strong>${esc(b.title)}</strong>
        <span class="saved-actions"><button class="link-btn" type="button" data-copy-built="${i}"><span class="label">Kopyala</span></button></span></div>`).join('');
  }
  $('#savedList').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy-built]');
    if (!b) return;
    if (await copyText(savedBuilt[+b.dataset.copyBuilt].text)) { flashCopied(b); toast('Prompt kopyalandı.'); }
  });

  // ---------- GİRİŞ / KAYIT PROTOTİPİ ----------
  const authModal = $('#authModal');
  let authNote = null;

  function openAuth(view = 'login', note = '') {
    toggleMenu(false);
    if (authModal.hidden) lastFocus = document.activeElement;
    goAuth(view);
    authNote?.remove();
    authNote = null;
    if (note) {
      authNote = document.createElement('p');
      authNote.className = 'auth-note';
      authNote.textContent = note;
      $('.auth-brand', authModal).after(authNote);
    }
    authModal.hidden = false;
    lockScroll(true);
    $('.sheet-close', authModal).focus();
  }
  function goAuth(view) { $$('.auth-view', authModal).forEach((v) => { v.hidden = v.dataset.view !== view; }); }
  function closeAuth() {
    if (authModal.hidden) return;
    authModal.hidden = true;
    if (modal.hidden) lockScroll(false);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function setDemoUser(on) {
    demoUser = on;
    $$('[data-auth-guest]').forEach((el) => { el.hidden = on; });
    $$('[data-auth-user]').forEach((el) => { el.hidden = !on; });
    $('#hesabim').hidden = !on;
    if (!on) { savedIds.clear(); savedBuilt.length = 0; renderLibrary(); if (featuredId) renderFeatured(byId[featuredId], { shared: featuredShared }); }
    renderSaved();
  }

  $$('[data-auth-open]').forEach((b) => b.addEventListener('click', () => openAuth(b.dataset.authOpen)));
  $$('[data-auth-go]').forEach((b) => b.addEventListener('click', () => goAuth(b.dataset.authGo)));
  $$('[data-proto-form]').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));
  $('[data-auth-demo]').addEventListener('click', () => {
    setDemoUser(true);
    closeAuth();
    toast('Demo görünümü açıldı. Gerçek bir oturum açılmadı.');
  });
  $('[data-auth-logout]').addEventListener('click', () => { toggleUserMenu(false); setDemoUser(false); toast('Demo görünümünden çıkıldı.'); });

  const userBtn = $('#userMenuBtn');
  function toggleUserMenu(force) {
    const open = force ?? $('#userMenu').hidden;
    $('#userMenu').hidden = !open;
    userBtn.setAttribute('aria-expanded', open);
  }
  userBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleUserMenu(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.user-chip')) toggleUserMenu(false); });
  $('#userMenu').addEventListener('click', (e) => { if (e.target.closest('a')) toggleUserMenu(false); });

  // ---------- MOBİL MENÜ ----------
  const menuBtn = $('.menu-toggle');
  const mobileMenu = $('#mobileMenu');
  function toggleMenu(force) {
    const open = force ?? mobileMenu.hidden;
    mobileMenu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    document.body.classList.toggle('menu-open', open);
  }
  menuBtn.addEventListener('click', () => toggleMenu());
  mobileMenu.addEventListener('click', (e) => { if (e.target.closest('a')) toggleMenu(false); });

  // ============================================================
  //  PROMPT OLUŞTURUCU
  // ============================================================
  const moveById = dict(PB.movements.map((m) => [m.id, m]));
  const groupById = dict(PB.groups.map((g) => [g.id, g]));
  const opt = (groupId, id) => groupById[groupId]?.options.find((o) => o.id === id);

  const DEFAULTS = {
    movement: 'push-in', shot: '', angle: '', lens: '', light: '', mood: '', style: '', speed: '', ratio: '9:16', duration: '5',
    subject: '', location: '', action: '', refMode: 'none', imageContext: '', imageContext2: '', extra: '', avoid: []
  };
  const bs = { ...DEFAULTS, avoid: [] };
  const view = { lang: 'en', format: 'sections', moveGroup: '', moveQuery: '' };

  // --- kontrolleri oluştur ---
  $('#presetChips').innerHTML = PB.presets.map((p) => `<button type="button" class="chip" data-preset="${p.id}">${esc(p.label)}</button>`).join('');

  const moveCountOf = (gid) => PB.movements.filter((m) => m.group === gid).length;
  $('#moveGroupChips').innerHTML = [
    { id: '', name: 'Tümü', n: PB.movements.length },
    { id: '__pop', name: 'Popüler', n: PB.popularMoves.length },
    ...PB.movementGroups.map((g) => ({ ...g, n: moveCountOf(g.id) }))
  ].map((g) => `<button type="button" class="chip ${g.id === '' ? 'is-active' : ''}" data-move-group="${g.id}" aria-pressed="${g.id === ''}">${esc(g.name)} <span class="chip-n">${g.n}</span></button>`).join('');

  function renderMoves() {
    const q = norm(view.moveQuery.trim());
    const inGroup = (m) => !view.moveGroup || (view.moveGroup === '__pop' ? PB.popularMoves.includes(m.id) : m.group === view.moveGroup);
    const list = PB.movements.filter((m) => inGroup(m)
      && (!q || norm(`${m.tr.name} ${m.en.name} ${PB.moveAliases[m.id] || ''}`).includes(q)));
    $('#moveCount').textContent = `${list.length} kamera hareketi`;
    $('#moveGrid').innerHTML = list.length ? list.map((m) => `<button type="button" class="move ${bs.movement === m.id ? 'is-active' : ''}" role="radio" aria-checked="${bs.movement === m.id}" data-move="${m.id}">
        <span class="move-tr">${esc(m.tr.name)}</span><span class="move-en">${esc(m.en.name)}</span></button>`).join('')
      : '<p class="saved-empty">Bu aramayla eşleşen hareket yok.</p>';
    const cur = moveById[bs.movement];
    $('#moveDesc').innerHTML = cur ? `<strong>${esc(cur.tr.name)}:</strong> ${esc(cur.tr.desc)}` : '';
  }

  $$('[data-groups]').forEach((wrap) => {
    wrap.innerHTML = wrap.dataset.groups.split(',').map((gid) => {
      const g = groupById[gid];
      return `<div class="opt-group">
        <p class="group-label" id="lbl-${gid}">${esc(g.label)} <span class="hint">${esc(g.hint)}</span></p>
        <div class="chips chips-sm" role="radiogroup" aria-labelledby="lbl-${gid}">
          ${g.options.map((o) => `<button type="button" class="chip" role="radio" data-group="${gid}" data-val="${esc(o.id)}">${esc(o.tr)}</button>`).join('')}
        </div>
      </div>`;
    }).join('');
  });

  $('#avoidChips').innerHTML = PB.avoid.map((a) => `<button type="button" class="chip chip-check" data-avoid="${a.id}" aria-pressed="false">${esc(a.tr)}</button>`).join('');

  // --- Türkçe hazır sahne seçenekleri ---
  $$('[data-phrase]').forEach((sel) => {
    sel.innerHTML = '<option value="">Hazır seçenekten seç…</option>'
      + PB.phrases[sel.dataset.phrase].map((p) => `<option value="${esc(p.tr)}">${esc(p.tr)}</option>`).join('');
  });
  // Yazılan metin hazır bir ifadeyle birebir eşleşiyorsa karşılığı bulunur; serbest metin çevrilmez
  const phraseFor = (field, value) => {
    const q = norm(String(value || '').trim());
    return q ? PB.phrases[field].find((p) => norm(p.tr) === q) : undefined;
  };
  const localized = (field, value, L) => { const p = phraseFor(field, value); return (p ? p[L] : String(value || '')).trim(); };

  // --- Referans görsel yuvaları: dosya yalnızca tarayıcıda önizlenir, hiçbir yere gönderilmez ---
  const REF_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const REF_EXT = /\.(jpe?g|png|webp)$/i;
  const REF_MAX = 20 * 1024 * 1024;
  const refFiles = { 1: null, 2: null };
  $('#refSlots').innerHTML = [
    { n: 1, title: 'IMAGE 1', role: 'İlk kare', field: 'imageContext', inputId: 'fImageContext', ph: 'ör. boş bir arsanın havadan görünümü' },
    { n: 2, title: 'IMAGE 2', role: 'Son kare', field: 'imageContext2', inputId: 'fImageContext2', ph: 'ör. aynı yerde bitmiş bina' }
  ].map((s) => `<div class="ref-slot" data-slot="${s.n}">
      <p class="ref-slot-title"><strong>${s.title}</strong> ${s.role}</p>
      <input class="sr-only ref-input" type="file" id="refFile${s.n}" data-ref-input="${s.n}" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp">
      <label class="ref-drop" for="refFile${s.n}">
        <span class="ref-drop-title">Görsel seç veya buraya sürükle</span>
        <span class="ref-drop-sub">JPG, PNG veya WebP · en fazla 20 MB</span>
      </label>
      <div class="ref-preview" hidden>
        <img alt="${s.role} önizlemesi">
        <div class="ref-info">
          <span class="ref-name"></span>
          <span class="ref-actions">
            <label class="link-btn" for="refFile${s.n}">Değiştir</label>
            <button type="button" class="link-btn ref-remove" data-ref-remove="${s.n}">Kaldır</button>
          </span>
        </div>
      </div>
      <p class="ref-error" role="alert" hidden></p>
      <div class="field">
        <label for="${s.inputId}">Görselde ne var? <small>(isteğe bağlı)</small></label>
        <input id="${s.inputId}" data-field="${s.field}" type="text" placeholder="${s.ph}">
      </div>
    </div>`).join('');

  const refSlot = (n) => $(`.ref-slot[data-slot="${n}"]`);
  function refError(n, msg) {
    const el = $('.ref-error', refSlot(n));
    el.textContent = msg || '';
    el.hidden = !msg;
  }
  function renderRefSlot(n) {
    const slot = refSlot(n), f = refFiles[n];
    $('.ref-drop', slot).hidden = !!f;
    $('.ref-preview', slot).hidden = !f;
    if (f) {
      $('.ref-preview img', slot).src = f.url;
      const size = f.size < 1048576 ? `${Math.max(1, Math.round(f.size / 1024))} KB` : `${(f.size / 1048576).toFixed(1)} MB`;
      $('.ref-name', slot).textContent = `${f.name} · ${size}`;
    } else {
      $('.ref-preview img', slot).removeAttribute('src');
    }
  }
  function clearRefFile(n) {
    if (refFiles[n]) URL.revokeObjectURL(refFiles[n].url);
    refFiles[n] = null;
    refError(n, '');
    renderRefSlot(n);
  }
  function setRefFile(n, file) {
    refError(n, '');
    const okType = REF_TYPES.includes(file.type) || (!file.type && REF_EXT.test(file.name));
    if (!okType) { refError(n, 'Bu dosya türü desteklenmiyor. JPG, PNG veya WebP seç.'); return; }
    if (file.size > REF_MAX) { refError(n, 'Dosya çok büyük. En fazla 20 MB olabilir.'); return; }
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      if (refFiles[n]) URL.revokeObjectURL(refFiles[n].url);
      refFiles[n] = { url, name: file.name, size: file.size };
      renderRefSlot(n);
    };
    probe.onerror = () => { URL.revokeObjectURL(url); refError(n, 'Bu görsel açılamadı. Başka bir dosya dene.'); };
    probe.src = url;
  }
  const slots = $('#refSlots');
  slots.addEventListener('change', (e) => {
    const input = e.target.closest('[data-ref-input]');
    if (!input) return;
    if (input.files[0]) setRefFile(+input.dataset.refInput, input.files[0]);
    input.value = ''; // aynı dosya yeniden seçilebilsin
  });
  ['dragenter', 'dragover'].forEach((type) => slots.addEventListener(type, (e) => {
    const slot = e.target.closest('.ref-slot');
    if (slot) { e.preventDefault(); slot.classList.add('is-drag'); }
  }));
  slots.addEventListener('dragleave', (e) => {
    const slot = e.target.closest('.ref-slot');
    if (slot && !slot.contains(e.relatedTarget)) slot.classList.remove('is-drag');
  });
  slots.addEventListener('drop', (e) => {
    const slot = e.target.closest('.ref-slot');
    if (!slot) return;
    e.preventDefault();
    slot.classList.remove('is-drag');
    const file = e.dataTransfer && e.dataTransfer.files[0];
    if (file) setRefFile(+slot.dataset.slot, file);
  });
  [1, 2].forEach(renderRefSlot);

  function syncControls() {
    $$('[data-group]').forEach((b) => {
      const on = bs[b.dataset.group] === b.dataset.val;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', on);
    });
    $$('[data-avoid]').forEach((b) => {
      const on = bs.avoid.includes(b.dataset.avoid);
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });
    $$('[data-field]').forEach((el) => {
      const k = el.dataset.field;
      if (el.type === 'checkbox') el.checked = !!bs[k]; else el.value = bs[k] || '';
    });
    $$('[data-ref-mode]').forEach((b) => {
      const on = b.dataset.refMode === bs.refMode;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });
    $('#refSlots').hidden = bs.refMode === 'none';
    $('#refNote').hidden = bs.refMode === 'none';
    refSlot(2).hidden = bs.refMode !== 'both';
    renderMoves();
  }

  // --- metin üretimi ---
  // Büyük harf kuralı metnin kendi diline göre: "it" → "It", "ışık" → "Işık", "ilk ışık" → "İlk ışık"
  const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/;
  const cap = (s) => (s ? (TR_CHARS.test(s) ? s.charAt(0).toLocaleUpperCase('tr') : s.charAt(0).toUpperCase()) + s.slice(1) : s);
  const sentence = (s) => { const t = String(s || '').trim(); if (!t) return ''; return /[.!?…]$/.test(t) ? cap(t) : cap(t) + '.'; };

  const LBL = {
    en: { camera: 'Camera movement', shot: 'Shot', ref: 'Reference image', refs: 'Reference images', scene: 'Scene', look: 'Look', notes: 'Additional notes', avoid: 'Avoid',
      speed: 'Speed', light: 'Lighting', mood: 'Mood', style: 'Style', subject: 'Subject', location: 'Location', action: 'Action' },
    tr: { camera: 'Kamera hareketi', shot: 'Kadraj', ref: 'Referans görsel', refs: 'Referans görseller', scene: 'Sahne', look: 'Görünüm', notes: 'Ek notlar', avoid: 'Kaçınılacaklar',
      speed: 'Hız', light: 'Işık', mood: 'Atmosfer', style: 'Stil', subject: 'Konu', location: 'Mekân', action: 'Aksiyon' }
  };

  function buildSections(s, L) {
    const T = LBL[L];
    const m = moveById[s.movement];
    const sections = [];
    const speed = opt('speed', s.speed || m.speed)?.[L];
    sections.push({ key: 'camera', title: T.camera, body: `${cap(m[L].name)}. ${m[L].desc} ${T.speed}: ${speed}.` });

    const shotParts = ['shot', 'angle', 'lens'].map((g) => opt(g, s[g])?.[L]).filter(Boolean);
    const fmt = [opt('ratio', s.ratio)?.[L], opt('duration', s.duration)?.[L]].filter(Boolean).join(', ');
    const shotBody = [shotParts.length ? sentence(shotParts.join(', ')) : '', sentence(fmt)].filter(Boolean).join(' ');
    if (shotBody) sections.push({ key: 'shot', title: T.shot, body: shotBody });

    if (s.refMode !== 'none') {
      const ctx = s.imageContext.trim(), ctx2 = s.imageContext2.trim();
      const both = s.refMode === 'both';
      const lines = L === 'en'
        ? [`IMAGE 1 = exact START FRAME${ctx ? ` (${ctx})` : ''}.`,
           both && `IMAGE 2 = exact END FRAME${ctx2 ? ` (${ctx2})` : ''}.`,
           both
             ? 'Start exactly from IMAGE 1 and move smoothly to IMAGE 2. Preserve the location, framing, lighting and colors of the reference images. FINAL FRAME MUST MATCH IMAGE 2.'
             : 'Preserve the subject, framing, lighting, colors and lens feel from IMAGE 1; apply only the camera movement and the described action.']
        : [`IMAGE 1 = tam BAŞLANGIÇ KARESİ${ctx ? ` (${ctx})` : ''}.`,
           both && `IMAGE 2 = tam BİTİŞ KARESİ${ctx2 ? ` (${ctx2})` : ''}.`,
           both
             ? 'Tam olarak IMAGE 1 ile başla ve akıcı biçimde IMAGE 2\'ye geç. Referans görsellerdeki mekân, kadraj, ışık ve renkler korunsun. SON KARE IMAGE 2 İLE EŞLEŞMELİ.'
             : 'IMAGE 1\'deki konu, kadraj, ışık, renkler ve lens hissi korunsun; yalnızca kamera hareketi ve tarif edilen aksiyon uygulansın.'];
      sections.push({ key: 'ref', title: both ? T.refs : T.ref, body: lines.filter(Boolean).join('\n') });
    }

    const subject = localized('subject', s.subject, L), location = localized('location', s.location, L), action = localized('action', s.action, L);
    let scene = '';
    if (L === 'en') {
      if (subject && location) scene = sentence(`${subject} in ${location}`);
      else if (subject) scene = sentence(subject);
      else if (location) scene = sentence(`the scene takes place in ${location}`);
      if (action) scene += (scene ? ' ' : '') + sentence(action);
    } else {
      scene = [subject && `${T.subject}: ${sentence(subject)}`, location && `${T.location}: ${sentence(location)}`, action && `${T.action}: ${sentence(action)}`].filter(Boolean).join('\n');
    }
    if (scene) sections.push({ key: 'scene', title: T.scene, body: scene });

    const look = [['light', T.light], ['mood', T.mood], ['style', T.style]]
      .map(([g, lbl]) => { const o = opt(g, s[g]); return o ? `${lbl}: ${o[L]}.` : ''; }).filter(Boolean).join(' ');
    if (look) sections.push({ key: 'look', title: T.look, body: look });

    if (s.extra.trim()) sections.push({ key: 'notes', title: T.notes, body: sentence(s.extra) });

    const avoid = PB.avoid.filter((a) => s.avoid.includes(a.id)).map((a) => a[L]);
    if (avoid.length) sections.push({ key: 'avoid', title: T.avoid, body: cap(avoid.join(', ')) + '.' });
    return sections;
  }

  function buildPrompt(s = bs, L = view.lang, format = view.format) {
    const sections = buildSections(s, L);
    if (format === 'paragraph') {
      return sections.map((x) => {
        const body = x.body.replace(/\n/g, ' ');
        if (x.key === 'camera') return cap(body);
        if (x.key === 'avoid' || x.key === 'ref') return `${x.title}: ${body}`;
        return body;
      }).join(' ');
    }
    return sections.map((x) => `${x.title}:\n${x.body}`).join('\n\n');
  }

  const outText = $('#outputText');

  function renderOutput() {
    const text = buildPrompt();
    outText.textContent = text;
    const words = text.split(/\s+/).filter(Boolean).length;
    $('#outputMeta').textContent = `${words} kelime · ${text.length} karakter`;

    // Hazır ifadelerin karşılığını göster; serbest metnin çevrildiği izlenimini verme
    $$('[data-phrase]').forEach((sel) => {
      const field = sel.dataset.phrase, value = String(bs[field] || '').trim(), p = phraseFor(field, value);
      sel.value = p ? p.tr : '';
      const hint = $(`[data-phrase-hint="${field}"]`);
      hint.hidden = !value;
      hint.classList.toggle('is-match', !!p);
      hint.textContent = p ? `İngilizce çıktı: ${p.en}` : 'Serbest metin: otomatik çevrilmez, prompta olduğu gibi yazılır.';
    });
    const freeTexts = [
      ...['subject', 'location', 'action'].filter((k) => !phraseFor(k, bs[k])).map((k) => bs[k]),
      bs.refMode !== 'none' ? bs.imageContext : '', bs.refMode === 'both' ? bs.imageContext2 : '', bs.extra
    ].map((v) => String(v || '').trim()).filter(Boolean);
    $('#copyTranslate').hidden = !freeTexts.length || view.lang !== 'en';
    const typedTr = freeTexts.some((v) => TR_CHARS.test(v));

    const note = $('#outputNote');
    if (view.lang === 'tr') {
      note.textContent = 'Türkçe çıktı, promptu anlamak ve düzenlemek için. Video aracına İngilizce (EN) sürümünü yapıştırman önerilir.';
      note.classList.remove('is-warn');
    } else if (typedTr) {
      note.textContent = 'Serbest yazdığın Türkçe metin çevrilmedi, İngilizce çıktıda Türkçe kaldı. Hazır seçenekleri kullanabilir veya "AI ile çevirmek için kopyala" ile kendi AI aracında çevirebilirsin.';
      note.classList.add('is-warn');
    } else {
      note.textContent = 'İngilizce çıktı Kling, Runway, Higgsfield, Luma gibi araçlarda daha tutarlı sonuç verir.';
      note.classList.remove('is-warn');
    }
  }

  function updateBuilder() { syncControls(); renderOutput(); }

  function applyValues(values) {
    Object.assign(bs, { ...DEFAULTS, avoid: [] }, values, { avoid: [...(values.avoid || [])] });
    if (!moveById[bs.movement]) bs.movement = DEFAULTS.movement;
    view.moveGroup = ''; view.moveQuery = ''; $('#moveSearch').value = '';
    $$('[data-move-group]').forEach((b) => { const on = b.dataset.moveGroup === ''; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); });
    updateBuilder();
    // Seçili hareketi kaydırılabilir listede görünür yap (sayfayı kaydırmadan)
    const grid = $('#moveGrid'), active = $('.move.is-active', grid);
    if (active) grid.scrollTop = active.getBoundingClientRect().top - grid.getBoundingClientRect().top + grid.scrollTop - 8;
  }

  function loadIntoBuilder(id) {
    const p = byId[id];
    if (!p || !p.builder) return;
    applyValues(p.builder);
    if (!modal.hidden) closePromptModal();
    if (stepper.active) stepper.finish({ scroll: false });
    $('#olusturucu').scrollIntoView({ behavior: smoothOrAuto() });
    toast(`“${p.title}” oluşturucuya yüklendi. Şimdi değiştirebilirsin.`);
  }

  // --- olaylar ---
  $('#builderForm').addEventListener('click', (e) => {
    const t = e.target;
    const mv = t.closest('[data-move]');
    if (mv) { bs.movement = mv.dataset.move; updateBuilder(); stepper.afterMove(); return; }
    const mg = t.closest('[data-move-group]');
    if (mg) {
      view.moveGroup = mg.dataset.moveGroup;
      $$('[data-move-group]').forEach((b) => { const on = b === mg; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); });
      renderMoves(); return;
    }
    const g = t.closest('[data-group]');
    if (g) { const k = g.dataset.group; bs[k] = bs[k] === g.dataset.val ? '' : g.dataset.val; updateBuilder(); stepper.afterGroup(k); return; }
    const rm = t.closest('[data-ref-mode]');
    if (rm) { bs.refMode = rm.dataset.refMode; updateBuilder(); return; }
    const rr = t.closest('[data-ref-remove]');
    if (rr) { clearRefFile(+rr.dataset.refRemove); return; }
    const a = t.closest('[data-avoid]');
    if (a) { const id = a.dataset.avoid; bs.avoid = bs.avoid.includes(id) ? bs.avoid.filter((x) => x !== id) : [...bs.avoid, id]; updateBuilder(); return; }
    const pr = t.closest('[data-preset]');
    if (pr) { applyValues(PB.presets.find((p) => p.id === pr.dataset.preset).values); toast(`“${pr.textContent}” ayarları yüklendi.`); if (stepper.active) stepper.finish(); }
  });
  $('#builderForm').addEventListener('input', (e) => {
    const el = e.target.closest('[data-field]');
    if (!el) return;
    bs[el.dataset.field] = el.value;
    renderOutput();
  });
  $('#builderForm').addEventListener('change', (e) => {
    const sel = e.target.closest('[data-phrase]');
    if (!sel || !sel.value) return;
    bs[sel.dataset.phrase] = sel.value;
    updateBuilder();
  });
  $('#builderForm').addEventListener('submit', (e) => e.preventDefault());
  $('#moveSearch').addEventListener('input', (e) => { view.moveQuery = e.target.value; renderMoves(); });

  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    view.lang = b.dataset.lang;
    $$('[data-lang]').forEach((x) => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on); });
    renderOutput();
  }));
  $$('[data-format]').forEach((b) => b.addEventListener('click', () => {
    view.format = b.dataset.format;
    $$('[data-format]').forEach((x) => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on); });
    renderOutput();
  }));

  async function copyOutput(btn) {
    if (await copyText(buildPrompt())) { flashCopied(btn); toast('Prompt kopyalandı. Video aracına yapıştırabilirsin.'); }
    else toast('Kopyalanamadı. Metni seçip elle kopyalayabilirsin.');
  }
  $('#copyOutput').addEventListener('click', (e) => copyOutput(e.currentTarget));
  $('#resetBuilder').addEventListener('click', () => { [1, 2].forEach(clearRefFile); applyValues({}); toast('Seçimler sıfırlandı.'); stepper.restart(); });
  // Çeviri yapmaz: yalnızca kullanıcının kendi AI aracına yapıştıracağı talimatı panoya kopyalar
  $('#copyTranslate').addEventListener('click', async (e) => {
    const text = 'Aşağıdaki yapay zekâ video promptundaki Türkçe kısımları doğal İngilizceye çevir. '
      + 'Bölüm başlıklarını, IMAGE 1 / IMAGE 2 ifadelerini, teknik kamera terimlerini ve İngilizce kısımları aynen koru. '
      + 'Yeni bilgi ekleme, hiçbir şeyi çıkarma. Yalnızca sonucu yaz.\n\n---\n\n' + buildPrompt(bs, 'en', view.format);
    if (await copyText(text)) { flashCopied(e.currentTarget); toast('Çeviri talimatı kopyalandı. ChatGPT, Gemini veya Claude\'a yapıştırabilirsin.'); }
    else toast('Kopyalanamadı. Lütfen tekrar dene.');
  });
  $('#saveOutput').addEventListener('click', () => {
    if (!demoUser) { openAuth('login', 'Oluşturduğun promptları kaydetmek için giriş yapman gerekecek. (Prototip)'); return; }
    const m = moveById[bs.movement];
    savedBuilt.push({ title: `${m.tr.name}${bs.subject ? ' — ' + bs.subject : ''}`, text: buildPrompt() });
    renderSaved();
    toast('Kaydedildi (demo — sayfa yenilenince silinir).');
  });

  // ---------- MOBİL ADIM ADIM OLUŞTURUCU ----------
  // Masaüstünde form olduğu gibi kalır. Adımlar yalnızca mevcut alanları gösterip gizler:
  // seçimler ve prompt üretimi aynı "bs" durumundan gelir, adım değişince hiçbir seçim kaybolmaz.
  function smoothOrAuto() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }
  const stepper = (() => {
    const STEPS = [
      { id: 'camera', title: 'Kamera hareketi', hint: 'Bir hareket seç; sonraki adıma otomatik geçilir.' },
      { id: 'framing', title: 'Kadraj', hint: 'Her başlıktan en fazla bir seçim. Hepsi isteğe bağlı.', groups: ['shot', 'angle', 'lens'] },
      { id: 'look', title: 'Işık ve stil', hint: 'Her başlıktan en fazla bir seçim. Hepsi isteğe bağlı.', groups: ['light', 'mood', 'style'] },
      { id: 'format', title: 'Hız ve format', hint: 'Oran ve süre hazır seçili; istersen değiştir.', groups: ['speed', 'ratio', 'duration'] },
      { id: 'scene', title: 'Sahne ve görsel', hint: 'İsteğe bağlı. Bitince Devam düğmesine dokun.' },
      { id: 'extra', title: 'Ek talimatlar', hint: 'İsteğe bağlı. Birden fazla seçim yapabilirsin.' },
      { id: 'output', title: 'Promptun hazır', hint: 'Kopyala veya önceki adımlara dönüp değiştir.' }
    ];
    const LAST = STEPS.length - 1;
    const AUTO_DELAY = 280;
    const mq = window.matchMedia('(max-width: 820px)');
    const root = $('.builder');
    const head = $('#stepperHead');
    const nav = $('#stepperNav');
    const panels = dict(STEPS.map((s) => [s.id, s.id === 'output' ? $('#builderOutput') : $(`#builderForm [data-step="${s.id}"]`)]));
    const presets = $('#builderForm .presets');
    const done = new Set();
    let current = 0;
    let reached = 0;
    let timer = 0;

    $('#stepperDots').innerHTML = STEPS.map((s, i) => `<li><button type="button" class="stepper-dot" data-step-go="${i}" aria-label="Adım ${i + 1}: ${esc(s.title)}">${i + 1}</button></li>`).join('');

    function scrollToTarget(el) {
      const headerH = $('.site-header').offsetHeight;
      const stickyH = el === root ? 0 : head.offsetHeight;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerH - stickyH - 8, behavior: smoothOrAuto() });
    }

    // Sabit başlık, menünün gerçek yüksekliğinin hemen altında durur
    function pinHead() { head.style.top = `${$('.site-header').offsetHeight}px`; }

    function render({ scroll = true, focus = true } = {}) {
      const s = STEPS[current];
      STEPS.forEach((x) => panels[x.id].classList.toggle('is-current', x.id === s.id));
      root.classList.toggle('is-final', current === LAST);
      presets.hidden = current !== 0;
      $('#stepperCount').textContent = `${current + 1}/${STEPS.length}`;
      $('#stepperCount').setAttribute('aria-label', `Adım ${current + 1} / ${STEPS.length}`);
      $('#stepperTitle').textContent = s.title;
      $('#stepperHint').textContent = s.hint;
      $('#stepperJump').hidden = current === LAST;
      $('#stepperBar').style.width = `${(current / LAST) * 100}%`;
      $$('[data-step-go]').forEach((b, i) => {
        const isDone = done.has(i) && i !== current;
        b.classList.toggle('is-current', i === current);
        b.classList.toggle('is-done', isDone);
        b.textContent = isDone ? '✓' : String(i + 1);
        b.disabled = i > reached;
        if (i === current) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      $('#stepperBack').disabled = current === 0;
      const next = $('#stepperNext');
      next.hidden = current === LAST;
      next.textContent = current === LAST - 1 ? 'Promptu Oluştur' : 'Devam';
      nav.classList.toggle('is-last', current === LAST);
      if (scroll) scrollToTarget(root);
      if (focus) $('#stepperTitle').focus({ preventScroll: true });
    }

    function go(i, opts) {
      clearTimeout(timer);
      if (i > current) for (let k = current; k < i; k += 1) done.add(k);
      current = Math.max(0, Math.min(LAST, i));
      reached = Math.max(reached, current);
      render(opts);
    }

    const api = {
      active: false,
      afterMove() {
        if (!api.active || STEPS[current].id !== 'camera') return;
        clearTimeout(timer);
        timer = setTimeout(() => go(current + 1), AUTO_DELAY);
      },
      afterGroup(key) {
        if (!api.active) return;
        const { groups } = STEPS[current];
        clearTimeout(timer);
        // Seçim kaldırıldıysa kullanıcıyı başka yere götürme
        if (!groups || !groups.includes(key) || !bs[key]) return;
        const nextEmpty = [...groups.slice(groups.indexOf(key) + 1), ...groups.slice(0, groups.indexOf(key))].find((g) => !bs[g]);
        if (!nextEmpty) { timer = setTimeout(() => go(current + 1), AUTO_DELAY); return; }
        const target = $(`#lbl-${nextEmpty}`).closest('.opt-group');
        timer = setTimeout(() => scrollToTarget(target), AUTO_DELAY);
      },
      finish(opts) { reached = LAST; go(LAST, opts); },
      restart() {
        if (!api.active) return;
        done.clear(); reached = 0; go(0);
      },
      sync() {
        clearTimeout(timer);
        api.active = mq.matches;
        root.classList.toggle('is-stepper', api.active);
        head.hidden = !api.active;
        nav.hidden = !api.active;
        $('#stepperHint').hidden = !api.active;
        if (api.active) { pinHead(); render({ scroll: false, focus: false }); }
        else {
          STEPS.forEach((x) => panels[x.id].classList.remove('is-current'));
          root.classList.remove('is-final');
          presets.hidden = false;
        }
      }
    };

    $('#stepperNext').addEventListener('click', () => go(current + 1));
    $('#stepperBack').addEventListener('click', () => go(current - 1));
    $('#stepperJump').addEventListener('click', () => api.finish());
    $('#stepperDots').addEventListener('click', (e) => {
      const b = e.target.closest('[data-step-go]');
      if (b && !b.disabled) go(+b.dataset.stepGo);
    });
    mq.addEventListener('change', () => { api.sync(); });
    window.addEventListener('resize', () => { if (api.active) pinHead(); });
    return api;
  })();
  stepper.sync();

  // ---------- MOBİL HIZLI KOPYALAMA ÇUBUĞU ----------
  const sticky = $('#stickyCopy');
  const stickyBtn = $('#stickyCopyBtn');
  let stickyMode = null;
  const inView = (el, margin = 0) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.bottom > margin && r.top < innerHeight - margin; };

  function updateSticky() {
    let mode = null;
    if (isMobile() && modal.hidden && authModal.hidden && mobileMenu.hidden) {
      const featCopy = $('#featured [data-copy]');
      if (inView($('#one-cikan'), 120) && !inView(featCopy)) mode = 'featured';
      // Adım adım akışta kopyalama son adımdadır; alttaki Geri/Devam çubuğuyla çakışmasın
      else if (!stepper.active && inView($('.builder-form'), 200) && !inView($('#copyOutput')) && !inView(outText)) mode = 'builder';
    }
    if (mode !== stickyMode) {
      stickyMode = mode;
      sticky.hidden = !mode;
      document.body.classList.toggle('has-sticky', !!mode);
      if (mode === 'featured') $('#stickyCopyText').textContent = byId[featuredId].title;
      if (mode === 'builder') $('#stickyCopyText').textContent = 'Oluşturduğun prompt hazır';
    }
  }
  // Hafif bir kontrol (birkaç getBoundingClientRect); kaydırma başına en fazla ~10 kez çalışır
  let lastRun = 0, trailing;
  const onScroll = () => {
    const now = Date.now();
    clearTimeout(trailing);
    if (now - lastRun > 100) { lastRun = now; updateSticky(); }
    trailing = setTimeout(updateSticky, 120);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  stickyBtn.addEventListener('click', () => { if (stickyMode === 'featured') copyPrompt(featuredId, stickyBtn); else copyOutput(stickyBtn); });

  // ---------- BAŞLANGIÇ ----------
  const params = new URLSearchParams(location.search);
  const wanted = params.get('prompt') || params.get('p');
  let featuredShared = false;
  if (wanted && byId[wanted]) {
    featuredShared = true;
    document.body.classList.add('is-shared');
    renderFeatured(byId[wanted], { shared: true });
  } else {
    renderFeatured(latest);
    if (wanted) {
      const n = $('#notFoundNotice');
      n.textContent = 'Aradığın prompt bulunamadı ya da kaldırılmış olabilir. En yeni prompt aşağıda; diğerlerini kütüphanede bulabilirsin.';
      n.hidden = false;
      history.replaceState(null, '', location.pathname);
    }
  }
  renderLibrary();
  renderSaved();
  updateBuilder();
  updateSticky();
})();
