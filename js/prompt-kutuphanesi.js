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
    const badges = `<span class="media-badges">${p.demo ? '<span class="m-badge m-badge-demo">Örnek içerik</span>' : ''}${!p.demo && p.instagram ? '<span class="m-badge m-badge-real">Instagram</span>' : ''}<span class="m-badge">${esc(p.ratio)} · ${esc(p.duration)} sn</span></span>`;
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
      <div><dt>Format</dt><dd>${esc(p.ratio)} · ${esc(p.duration)} sn</dd></div>
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
      gercek: '✓ Bu videonun üretiminde kullanılan prompt',
      aciklama: 'Prompt, videonun Instagram açıklamasında paylaşılan sahne tarifinden alındı.',
      ornek: 'Örnek prompt — videoya benzer bir sonuç için hazırlandı; videonun orijinal promptu değildir.'
    };
    const type = p.promptType || 'ornek';
    if (type === 'ornek' && !p.video && !p.poster) return '';
    return `<p class="prompt-origin ${type === 'gercek' ? 'is-real' : ''} ${type === 'aciklama' ? 'is-caption' : ''}">${esc(p.promptNote || defaults[type] || defaults.ornek)}</p>`;
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
        <pre class="prompt-box is-clamped" tabindex="0">${esc(p.prompt)}</pre>
        <button class="btn btn-primary btn-block btn-copy btn-copy-lg" type="button" data-copy="${esc(p.id)}">${COPY_IC}<span class="label">Promptu Kopyala</span></button>
      </div>
      <div class="detail-actions">
        <button class="btn btn-ghost btn-sm" type="button" data-share="${esc(p.id)}"><span class="label">Bağlantıyı paylaş</span></button>
        <button class="btn btn-ghost btn-sm" type="button" data-edit="${esc(p.id)}">Oluşturucuda düzenle</button>
        <button class="btn btn-ghost btn-sm btn-save ${saved ? 'is-saved' : ''}" type="button" data-save="${esc(p.id)}" aria-pressed="${saved}">${saved ? '★ Kaydedildi' : '☆ Kaydet'}</button>
      </div>
      ${p.steps && p.steps.length ? `<details class="howto" ${isMobile() ? '' : 'open'}>
        <summary>Bu video nasıl yapıldı?</summary>
        <ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      </details>` : ''}
      ${p.instagram ? `<a class="link-arrow ig-link" href="${esc(p.instagram)}" target="_blank" rel="noopener noreferrer">Instagram'da izle <span class="arrow">→</span></a>` : ''}`;
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

  function filtered() {
    const q = norm(state.q.trim());
    const terms = q.split(/\s+/).filter(Boolean);
    let list = prompts.filter((p) => {
      if (state.cat && p.category !== state.cat) return false;
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
    const counts = {};
    prompts.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    const items = [{ id: '', name: 'Tümü', n: prompts.length }, ...LIB.categories.map((c) => ({ ...c, n: counts[c.id] || 0 }))];
    $('#categoryChips').innerHTML = items.map((c) => `<button type="button" class="chip ${state.cat === c.id ? 'is-active' : ''}" data-cat="${c.id}" aria-pressed="${state.cat === c.id}" ${c.n ? '' : 'disabled'}>${esc(c.name)} <span class="chip-n">${c.n}</span></button>`).join('');
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
    if (real.length === 0 && demos.length > 0) demoWrap.open = true; // yalnız konsept içeren filtrede bölümü aç
    const active = state.q || state.cat || state.tool;
    const totalReal = prompts.filter((p) => !p.demo).length;
    $('#resultCount').textContent = active ? `${real.length} video · ${demos.length} konsept` : `${totalReal} gerçek video · ${prompts.length - totalReal} konsept`;
  }

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
    searchTimer = setTimeout(() => { state.q = searchInput.value; renderGrid(); }, 120);
  });
  $('#searchClear').addEventListener('click', () => {
    searchInput.value = ''; state.q = ''; $('#searchClear').hidden = true; renderGrid(); searchInput.focus();
  });
  $('#categoryChips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    renderLibrary();
  });
  $('#toolSelect').addEventListener('change', (e) => { state.tool = e.target.value; renderGrid(); });
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
      const box = ex.closest('.prompt-panel').querySelector('.prompt-box');
      const clamped = box.classList.toggle('is-clamped');
      ex.textContent = clamped ? 'Tamamını göster' : 'Daralt';
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
    subject: '', location: '', action: '', refImage: false, imageContext: '', extra: '', avoid: []
  };
  const bs = { ...DEFAULTS, avoid: [] };
  const view = { lang: 'en', format: 'sections', moveGroup: '', moveQuery: '' };

  // --- kontrolleri oluştur ---
  $('#presetChips').innerHTML = PB.presets.map((p) => `<button type="button" class="chip" data-preset="${p.id}">${esc(p.label)}</button>`).join('');

  $('#moveGroupChips').innerHTML = [{ id: '', name: 'Tümü' }, ...PB.movementGroups]
    .map((g) => `<button type="button" class="chip ${g.id === '' ? 'is-active' : ''}" data-move-group="${g.id}" aria-pressed="${g.id === ''}">${esc(g.name)}</button>`).join('');

  function renderMoves() {
    const q = norm(view.moveQuery.trim());
    const list = PB.movements.filter((m) => (!view.moveGroup || m.group === view.moveGroup)
      && (!q || norm(`${m.tr.name} ${m.en.name}`).includes(q)));
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
    $('#imageContextField').hidden = !bs.refImage;
    renderMoves();
  }

  // --- metin üretimi ---
  // Büyük harf kuralı metnin kendi diline göre: "it" → "It", "ışık" → "Işık", "ilk ışık" → "İlk ışık"
  const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/;
  const cap = (s) => (s ? (TR_CHARS.test(s) ? s.charAt(0).toLocaleUpperCase('tr') : s.charAt(0).toUpperCase()) + s.slice(1) : s);
  const sentence = (s) => { const t = String(s || '').trim(); if (!t) return ''; return /[.!?…]$/.test(t) ? cap(t) : cap(t) + '.'; };

  const LBL = {
    en: { camera: 'Camera movement', shot: 'Shot', ref: 'Reference image', scene: 'Scene', look: 'Look', notes: 'Additional notes', avoid: 'Avoid',
      speed: 'Speed', light: 'Lighting', mood: 'Mood', style: 'Style', subject: 'Subject', location: 'Location', action: 'Action' },
    tr: { camera: 'Kamera hareketi', shot: 'Kadraj', ref: 'Referans görsel', scene: 'Sahne', look: 'Görünüm', notes: 'Ek notlar', avoid: 'Kaçınılacaklar',
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

    if (s.refImage) {
      const ctx = s.imageContext.trim();
      sections.push({ key: 'ref', title: T.ref, body: L === 'en'
        ? `Use the uploaded image${ctx ? ` (${ctx})` : ''} as the first frame. Preserve the subject, framing, lighting, colors and lens feel from the image; apply only the camera movement and the described action.`
        : `Yüklenen görseli${ctx ? ` (${ctx})` : ''} ilk kare olarak kullan. Görseldeki konu, kadraj, ışık, renkler ve lens hissi korunsun; yalnızca kamera hareketi ve tarif edilen aksiyon uygulansın.` });
    }

    const subject = s.subject.trim(), location = s.location.trim(), action = s.action.trim();
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
    const typedTr = ['subject', 'location', 'action', 'imageContext', 'extra'].some((k) => TR_CHARS.test(bs[k] || ''));
    const note = $('#outputNote');
    if (view.lang === 'tr') {
      note.textContent = 'Türkçe çıktı, promptu anlamak ve düzenlemek için. Video aracına İngilizce (EN) sürümünü yapıştırman önerilir.';
      note.classList.remove('is-warn');
    } else if (typedTr) {
      note.textContent = 'Sahne alanlarına Türkçe yazdın; bu kısımlar İngilizce çıktıda Türkçe kalır. Çoğu araç anlar, ama İngilizce yazmak daha tutarlı sonuç verir.';
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
    $('#olusturucu').scrollIntoView({ behavior: 'smooth' });
    toast(`“${p.title}” oluşturucuya yüklendi. Şimdi değiştirebilirsin.`);
  }

  // --- olaylar ---
  $('#builderForm').addEventListener('click', (e) => {
    const t = e.target;
    const mv = t.closest('[data-move]');
    if (mv) { bs.movement = mv.dataset.move; updateBuilder(); return; }
    const mg = t.closest('[data-move-group]');
    if (mg) {
      view.moveGroup = mg.dataset.moveGroup;
      $$('[data-move-group]').forEach((b) => { const on = b === mg; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); });
      renderMoves(); return;
    }
    const g = t.closest('[data-group]');
    if (g) { const k = g.dataset.group; bs[k] = bs[k] === g.dataset.val ? '' : g.dataset.val; updateBuilder(); return; }
    const a = t.closest('[data-avoid]');
    if (a) { const id = a.dataset.avoid; bs.avoid = bs.avoid.includes(id) ? bs.avoid.filter((x) => x !== id) : [...bs.avoid, id]; updateBuilder(); return; }
    const pr = t.closest('[data-preset]');
    if (pr) { applyValues(PB.presets.find((p) => p.id === pr.dataset.preset).values); toast(`“${pr.textContent}” ayarları yüklendi.`); }
  });
  $('#builderForm').addEventListener('input', (e) => {
    const el = e.target.closest('[data-field]');
    if (!el) return;
    bs[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.field === 'refImage') $('#imageContextField').hidden = !el.checked;
    renderOutput();
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
  $('#resetBuilder').addEventListener('click', () => { applyValues({}); toast('Seçimler sıfırlandı.'); });
  $('#saveOutput').addEventListener('click', () => {
    if (!demoUser) { openAuth('login', 'Oluşturduğun promptları kaydetmek için giriş yapman gerekecek. (Prototip)'); return; }
    const m = moveById[bs.movement];
    savedBuilt.push({ title: `${m.tr.name}${bs.subject ? ' — ' + bs.subject : ''}`, text: buildPrompt() });
    renderSaved();
    toast('Kaydedildi (demo — sayfa yenilenince silinir).');
  });

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
      else if (inView($('.builder-form'), 200) && !inView($('#copyOutput')) && !inView(outText)) mode = 'builder';
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
