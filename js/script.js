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

// Video modalı — yalnızca eğitim sayfasında var
const modal = document.getElementById('video-modal');
if (modal) {
  const frame = modal.querySelector('.video-modal-frame');
  let lastFocus = null;

  const openVideo = () => {
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

// Sayfa içi (#) linkler için yumuşak kaydırma — video açan linkler hariç
document.querySelectorAll('a[href^="#"]:not([data-video-open])').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
