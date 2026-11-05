// Tanıtım videosu: gerçek YouTube video kimliği
const PROMO_VIDEO_ID = 'C6dOsbQGEVw';

// Video kapağı (gerçek YouTube thumbnail, fade-in ile) — yalnızca eğitim sayfasında var
const cover = document.querySelector('[data-video-cover]');
if (cover) {
  cover.addEventListener('load', () => { cover.classList.add('is-loaded'); });
  cover.addEventListener('error', () => {
    if (!cover.src.includes('hqdefault')) cover.src = `https://i.ytimg.com/vi/${PROMO_VIDEO_ID}/hqdefault.jpg`;
  });
  cover.src = `https://i.ytimg.com/vi/${PROMO_VIDEO_ID}/maxresdefault.jpg`;
}

// Tanıtım videosu alanı: görünür olunca sessiz ve döngülü oynar, ses kullanıcı isteğiyle açılır.
// Hareket azaltma veya veri tasarrufu açıksa ya da oynatma başlamazsa kapak ve oynat düğmesi kalır.
const promoPlayer = { pause() {}, resume() {} };
const promoBox = document.querySelector('[data-promo-video]');
if (promoBox && 'IntersectionObserver' in window
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && !(navigator.connection && navigator.connection.saveData)) {
  const YT_ORIGIN = 'https://www.youtube-nocookie.com';
  const pauseBtn = promoBox.querySelector('[data-promo-pause]');
  const soundBtn = promoBox.querySelector('[data-promo-sound]');
  let frame = null;
  let inView = false;
  let userPaused = false;
  let modalOpen = false;
  let muted = true;
  let heard = false;

  const post = (msg) => { if (frame && frame.contentWindow) frame.contentWindow.postMessage(JSON.stringify(msg), YT_ORIGIN); };
  const command = (func, args = []) => post({ event: 'command', func, args });
  const shouldPlay = () => inView && !userPaused && !modalOpen;
  const sync = () => command(shouldPlay() ? 'playVideo' : 'pauseVideo');
  const showMuted = (value) => {
    muted = value;
    soundBtn.textContent = muted ? '🔇 Sesi Aç' : '🔊 Sesi Kapat';
  };

  const load = () => {
    frame = document.createElement('iframe');
    frame.className = 'promo-live';
    frame.title = 'Tanıtım videosu';
    frame.tabIndex = -1;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = `${YT_ORIGIN}/embed/${PROMO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${PROMO_VIDEO_ID}&controls=0&rel=0&playsinline=1&disablekb=1&fs=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
    // Oynatıcı hazır olana dek durum bildirimlerine abone olmayı dener
    frame.addEventListener('load', () => {
      let tries = 0;
      const subscribe = setInterval(() => {
        if (heard || ++tries > 30) { clearInterval(subscribe); return; }
        post({ event: 'listening', id: 'promo', channel: 'widget' });
      }, 500);
    });
    promoBox.prepend(frame);
  };

  window.addEventListener('message', (e) => {
    if (e.origin !== YT_ORIGIN || !frame || e.source !== frame.contentWindow) return;
    let data;
    try { data = JSON.parse(e.data); } catch (err) { return; }
    heard = true;
    const info = data && data.info;
    if (!info || typeof info !== 'object') return;
    if (info.playerState === 1) {
      promoBox.classList.add('is-started', 'is-playing');
      pauseBtn.hidden = false;
      soundBtn.hidden = false;
      if (!shouldPlay()) sync();
    } else if (info.playerState === 2) {
      promoBox.classList.remove('is-playing');
    }
    if (typeof info.muted === 'boolean') showMuted(info.muted);
  });

  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.textContent = userPaused ? '▶' : '❚❚';
    pauseBtn.setAttribute('aria-label', userPaused ? 'Videoyu oynat' : 'Videoyu duraklat');
    sync();
  });
  soundBtn.addEventListener('click', () => {
    if (muted) { command('unMute'); command('setVolume', [100]); } else { command('mute'); }
    showMuted(!muted);
  });

  // Başka bir video açılınca durur ve sesi kapanır; kapatılınca kendiliğinden sesli başlamaz
  promoPlayer.pause = () => {
    modalOpen = true;
    if (!muted) { command('mute'); showMuted(true); }
    sync();
  };
  promoPlayer.resume = () => { modalOpen = false; sync(); };

  // Ağır oynatıcıyı sayfa yüklendikten sonra ve alana yaklaşınca yükler; ekrandan çıkınca duraklatır
  const start = () => {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !frame) load(); else sync();
    }, { rootMargin: '200px 0px' }).observe(promoBox);
  };
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
}

// Proje ve öğrenci videoları (js/media.js) açılıp kapanırken tanıtım videosu da durur / devam eder
document.addEventListener('site:media-open', () => promoPlayer.pause());
document.addEventListener('site:media-close', () => promoPlayer.resume());

// Video modalı — yalnızca eğitim sayfasında var
const modal = document.getElementById('video-modal');
if (modal) {
  const frame = modal.querySelector('.video-modal-frame');
  let lastFocus = null;

  const openVideo = () => {
    promoPlayer.pause();
    lastFocus = document.activeElement;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${PROMO_VIDEO_ID}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = 'Tanıtım videosu';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
    modal.hidden = false;
    document.body.classList.add('modal-open');
    modal.querySelector('.video-modal-close').focus();
  };

  const closeVideo = () => {
    frame.replaceChildren();
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
    promoPlayer.resume();
  };

  document.querySelectorAll('[data-video-open]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openVideo();
    });
  });
  modal.querySelectorAll('[data-video-close]').forEach((el) => el.addEventListener('click', closeVideo));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeVideo();
  });
}

// SSS accordion — her iki sayfada da var
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const ans = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      if (openItem !== item) { openItem.classList.remove('open'); openItem.querySelector('.faq-a').style.maxHeight = null; }
    });
    item.classList.toggle('open', !isOpen);
    ans.style.maxHeight = !isOpen ? ans.scrollHeight + 'px' : null;
  });
});

// Seminer kayıt formu (demo) — yalnızca seminer sayfasında var
const demoForm = document.getElementById('demoForm');
if (demoForm) {
  demoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('formSuccess').classList.add('show');
    this.reset();
  });
}

// Müfredat bağlantıyla gelindiğinde kapalı kalmasın
const curriculum = document.querySelector('[data-curriculum]');
const openCurriculum = (id) => { if (curriculum && (id === 'mufredat' || id === 'egitim-icerigi')) curriculum.open = true; };
openCurriculum(location.hash.slice(1));

// Ana sayfa dar ekran menüsü
const menuToggle = document.querySelector('.page-home .menu-toggle');
if (menuToggle) {
  const mainNav = document.getElementById('mainNav');
  const setMenu = (open) => {
    mainNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  };
  menuToggle.addEventListener('click', () => setMenu(!mainNav.classList.contains('is-open')));
  mainNav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.site-header')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) { setMenu(false); menuToggle.focus(); }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', () => setMenu(false));
}

// Sayfa içi (#) linkler için yumuşak kaydırma — video açan linkler hariç
document.querySelectorAll('a[href^="#"]:not([data-video-open])').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    openCurriculum(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
