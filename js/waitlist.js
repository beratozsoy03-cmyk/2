/* Bekleme listesi formu: doğrulama, bot kontrolü verileri, gönderim ve durum mesajları.
   Yalnızca sunucu (api/waitlist.js) bildirimi gönderip "ok" dönerse başarı gösterilir. */
(() => {
  const ENDPOINT = '/api/waitlist';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const TIMEOUT_MS = 15000;
  const STORE_KEY = 'yb-bekleme-kayit';
  const REMEMBER_MS = 30 * 24 * 60 * 60 * 1000;
  const DUPLICATE_MSG = 'Bu e-posta adresi zaten bekleme listesinde. Satış açıldığında sana haber vereceğiz.';
  const startedAt = performance.now();

  // Aynı tarayıcıdan tekrar kaydı fark etmek için e-postanın kendisi değil, özeti (SHA-256) saklanır
  const digest = async (text) => {
    if (!window.crypto || !crypto.subtle) return '';
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
  };
  const readStore = () => {
    try {
      const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      return Array.isArray(list) ? list.filter((r) => r && Date.now() - r.t < REMEMBER_MS) : [];
    } catch (err) { return []; }
  };
  const remember = (hash) => {
    if (!hash) return;
    try {
      const rest = readStore().filter((r) => r.h !== hash);
      localStorage.setItem(STORE_KEY, JSON.stringify(rest.concat({ h: hash, t: Date.now() }).slice(-10)));
    } catch (err) { /* depolama kapalı */ }
  };

  // Durum öğrenilemezse (bağlantı sorunu) form açık kalır; hata gönderim sırasında gösterilir
  const readiness = fetch(ENDPOINT, { credentials: 'same-origin', cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (d ? d.ready : null))
    .catch(() => null);

  document.querySelectorAll('[data-waitlist]').forEach((form) => {
    const email = form.elements.email;
    const status = form.querySelector('[data-wl-status]');
    const submit = form.querySelector('[data-wl-submit]');
    const submitHTML = submit.innerHTML;
    let busy = false;

    const say = (msg, kind) => {
      status.textContent = msg;
      status.className = 'wl-status' + (kind ? ' is-' + kind : '');
    };
    const setBusy = (on) => {
      busy = on;
      submit.disabled = on;
      submit.innerHTML = on ? 'Gönderiliyor…' : submitHTML;
      form.setAttribute('aria-busy', String(on));
    };

    // SMTP bağlanmadan form pasif kalır; ziyaretçinin adresi hiç gönderilmez
    const deactivate = () => {
      busy = true;
      submit.disabled = true;
      form.querySelectorAll('input').forEach((i) => { i.disabled = true; });
      form.classList.add('is-inactive');
      say('Bekleme listesi çok yakında aktif olacak.', 'info');
    };
    readiness.then((ready) => { if (ready === false) deactivate(); });

    email.addEventListener('input', () => {
      email.removeAttribute('aria-invalid');
      if (status.classList.contains('is-error')) say('');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (busy) return;

      const value = email.value.trim().toLowerCase();
      if (!value || value.length > 254 || !EMAIL_RE.test(value)) {
        email.setAttribute('aria-invalid', 'true');
        say('Geçerli bir e-posta adresi yaz. Örnek: ad@alanadi.com', 'error');
        email.focus();
        return;
      }
      if (!form.elements.kvkk.checked || !form.elements.ticari.checked) {
        say('Devam etmek için iki onay kutusunu da işaretlemelisin.', 'error');
        (form.elements.kvkk.checked ? form.elements.ticari : form.elements.kvkk).focus();
        return;
      }
      setBusy(true);
      say('');
      const hash = await digest(value).catch(() => '');
      if (hash && readStore().some((r) => r.h === hash)) {
        say(DUPLICATE_MSG, 'info');
        setBusy(false);
        return;
      }
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          referrerPolicy: 'same-origin',
          signal: ctrl.signal,
          body: JSON.stringify({
            email: value,
            source: form.dataset.source || 'egitim',
            consentPrivacy: true,
            consentCommercial: true,
            consentVersion: form.dataset.consentVersion || '1',
            website: form.elements.website ? form.elements.website.value : '',
            elapsed: Math.round(performance.now() - startedAt)
          })
        });
        let data = {};
        try { data = await res.json(); } catch (err) { /* gövde yok */ }

        if (res.ok && data && data.ok === true) {
          remember(hash);
          const box = document.createElement('div');
          box.className = 'wl-success';
          box.setAttribute('role', 'status');
          box.tabIndex = -1;
          const title = document.createElement('strong');
          const text = document.createElement('p');
          title.textContent = 'Kaydın alındı ✓';
          text.textContent = (form.dataset.source === 'seminer'
            ? 'Seminer bilgileri netleşince '
            : 'Eğitim satışa açıldığında ') + value + ' adresine haber vereceğiz.';
          box.append(title, text);
          form.replaceChildren(box);
          box.focus();
          return;
        }
        if (res.status === 409 || (data && data.error === 'duplicate')) {
          remember(hash);
          say(DUPLICATE_MSG, 'info');
        } else if (res.status === 429) {
          say('Kısa sürede çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar dene.', 'error');
        } else if (data && data.error === 'invalid_email') {
          email.setAttribute('aria-invalid', 'true');
          say('Bu e-posta adresi geçersiz görünüyor. Lütfen kontrol edip tekrar dene.', 'error');
          email.focus();
        } else if (data && data.error === 'too_fast') {
          say('Form çok hızlı gönderildi. Birkaç saniye bekleyip tekrar dene.', 'error');
        } else if (data && data.error === 'not_configured') {
          say('Bekleme listesi henüz aktif değil, kaydın alınmadı. Lütfen daha sonra tekrar dene.', 'error');
        } else {
          say('Kaydın şu an alınamadı. Lütfen biraz sonra tekrar dene.', 'error');
        }
      } catch (err) {
        say(err && err.name === 'AbortError'
          ? 'Sunucu yanıt vermedi. Lütfen biraz sonra tekrar dene.'
          : 'Bağlantı kurulamadı. İnternet bağlantını kontrol edip tekrar dene.', 'error');
      } finally {
        clearTimeout(timer);
        if (document.contains(form)) {
          setBusy(false);
        }
      }
    });
  });
})();
