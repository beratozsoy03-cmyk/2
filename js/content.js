/* ============================================================
   İÇERİK EKLEME NOKTASI
   Videolar / paylaşımlar geldiğinde yalnızca bu dosya (ve dosyaların
   kendisi) güncellenir; HTML veya CSS'e dokunmak gerekmez.
   Boş bırakılan listeler için sitede "yakında" alanı gösterilir,
   sahte içerik gösterilmez.
   ============================================================ */
window.SITE_MEDIA = {

  // Hero ve seminer videosu: dosyayı aşağıdaki yola yüklemek yeterli.
  // Dosya yoksa poster görseli görünür. (srcMobile isteğe bağlıdır.)
  heroVideo:    { src: 'assets/video/hero.mp4',    srcMobile: 'assets/video/hero-mobil.mp4' },
  seminarVideo: { src: 'assets/video/seminer.mp4', srcMobile: 'assets/video/seminer-mobil.mp4' },

  // Örnek Projeler — oran: '9:16' (dikey), '16:9' (yatay), '1:1', '4:5' ...
  // { title: 'Proje adı', category: 'Reklam Filmi', ratio: '9:16',
  //   video: 'assets/video/projeler/ornek.mp4',   // veya  youtube: 'VIDEO_ID'
  //   poster: 'assets/img/projeler/ornek.jpg' }
  projects: [],

  // Öğrenciler Ne Diyor? (yalnızca yayın izni alınmış gerçek videolar)
  // { name: 'Öğrenci adı', ratio: '9:16', video: 'assets/video/ogrenciler/ad.mp4',
  //   poster: 'assets/img/ogrenciler/ad.jpg' }   // veya  youtube: 'VIDEO_ID'
  students: [],

  // Instagram çalışmaları — url gerçek bir Instagram gönderi/reel adresi olmalı
  // { url: 'https://www.instagram.com/reel/XXXXXXXX/', title: 'Kısa başlık',
  //   poster: 'assets/img/instagram/ornek.jpg',
  //   video: 'assets/video/instagram/ornek.mp4' }   // video isteğe bağlı (sessiz önizleme)
  instagram: []
};
