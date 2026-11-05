/* ============================================================
   İÇERİK EKLEME NOKTASI
   Videolar / paylaşımlar geldiğinde yalnızca bu dosya (ve dosyaların
   kendisi) güncellenir; HTML veya CSS'e dokunmak gerekmez.
   Boş bırakılan listeler için sitede "yakında" alanı gösterilir,
   sahte içerik gösterilmez.
   ============================================================ */
window.SITE_MEDIA = {

  // Eğitim satın alma bağlantısı: gerçek https adresi gelince buraya yazılır (ör. https://...).
  // Boş kaldığı sürece fiyat bölümündeki düğme pasif görünür.
  purchaseUrl: '',

  // Hero ve seminer videosu: dosyayı aşağıdaki yola yüklemek yeterli.
  // Dosya yoksa poster görseli görünür. (srcMobile isteğe bağlıdır.)
  heroVideo:    { src: 'assets/video/hero.mp4',    srcMobile: 'assets/video/hero-mobil.mp4' },
  seminarVideo: { src: 'assets/video/seminer.mp4', srcMobile: 'assets/video/seminer-mobil.mp4' },

  // Örnek Projeler — oran: '9:16' (dikey), '16:9' (yatay), '1:1', '4:5' ...
  // { title: 'Proje adı', category: 'Reklam Filmi', ratio: '9:16',
  //   video: 'assets/video/projeler/ornek.mp4',   // veya  youtube: 'VIDEO_ID'
  //   poster: 'assets/img/projeler/ornek.jpg' }
  projects: [
    { title: 'Avenor Güzelyurt Tanıtım Filmi', category: 'Gayrimenkul', ratio: '9:16',
      video: 'assets/video/projeler/avenor-guzelyurt.mp4', poster: 'assets/img/projeler/avenor-guzelyurt.jpg' },
    { title: 'Solinved Tanıtım Filmi', category: 'Enerji', ratio: '16:9',
      video: 'assets/video/projeler/solinved-tanitim-filmi.mp4', poster: 'assets/img/projeler/solinved-tanitim-filmi.jpg' },
    { title: 'Gündüzden Geceye Konut Tanıtımı', category: 'Gayrimenkul', ratio: '9:16',
      video: 'assets/video/projeler/gunduzden-geceye-konut.mp4', poster: 'assets/img/projeler/gunduzden-geceye-konut.jpg' },
    { title: 'Çizo Süpermarket Reklamı', category: 'Reklam Filmi', ratio: '16:9',
      video: 'assets/video/projeler/cizo-supermarket-tanitim.mp4', poster: 'assets/img/projeler/cizo-supermarket-tanitim.jpg' },
    { title: 'Uzaydan Konut Projesine', category: 'Gayrimenkul', ratio: '9:16',
      video: 'assets/video/projeler/uzaydan-konut-projesi.mp4', poster: 'assets/img/projeler/uzaydan-konut-projesi.jpg' },
    { title: 'Yontu Ahşap Blok Reklamı', category: 'Ürün Reklamı', ratio: '9:16',
      video: 'assets/video/projeler/ahsap-urun-reklami.mp4', poster: 'assets/img/projeler/ahsap-urun-reklami.jpg' },
    { title: 'Çaycuma Süt Labne Reklamı', category: 'Ürün Reklamı', ratio: '9:16',
      video: 'assets/video/projeler/caycuma-labne-reklami.mp4', poster: 'assets/img/projeler/caycuma-labne-reklami.jpg' },
    { title: 'Elektrik Panosu Montaj Animasyonu', category: 'Endüstriyel', ratio: '9:16',
      video: 'assets/video/projeler/elektrik-panosu-montaj.mp4', poster: 'assets/img/projeler/elektrik-panosu-montaj.jpg' }
  ],

  // Öğrenciler Ne Diyor? (yalnızca yayın izni alınmış gerçek videolar)
  // { name: 'Öğrenci adı', ratio: '9:16', video: 'assets/video/ogrenciler/ad.mp4',
  //   poster: 'assets/img/ogrenciler/ad.jpg' }   // veya  youtube: 'VIDEO_ID'
  students: [],

  // Instagram çalışmaları — url gerçek bir Instagram gönderi/reel adresi olmalı
  // { url: 'https://www.instagram.com/reel/XXXXXXXX/', title: 'Kısa başlık',
  //   poster: 'assets/img/instagram/ornek.jpg',
  //   video: 'assets/video/instagram/ornek.mp4' }   // video isteğe bağlı (sessiz önizleme)
  instagram: [
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DVHCs2ECG_D/', title: 'Yankı Evler: Örtü Açılışının Yapımı',
      poster: 'assets/img/instagram/yanki-evler-helikopter.jpg',
      video: 'assets/video/instagram/yanki-evler-helikopter.mp4' }
  ]
};
