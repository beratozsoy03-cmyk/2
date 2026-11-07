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
    { title: 'Burger Inn Reklam Filmi', category: 'Reklam Filmi', ratio: '9:16',
      video: 'assets/video/projeler/burger-inn-reklam-filmi.mp4', poster: 'assets/img/projeler/burger-inn-reklam-filmi.jpg' },
    { title: 'Uzaydan Konut Projesine', category: 'Gayrimenkul', ratio: '9:16',
      video: 'assets/video/projeler/uzaydan-konut-projesi.mp4', poster: 'assets/img/projeler/uzaydan-konut-projesi.jpg' },
    { title: 'Yontu Ahşap Blok Reklamı', category: 'Ürün Reklamı', ratio: '9:16',
      video: 'assets/video/projeler/ahsap-urun-reklami.mp4', poster: 'assets/img/projeler/ahsap-urun-reklami.jpg' },
    { title: 'Solinved Tanıtım Filmi', category: 'Enerji', ratio: '16:9',
      video: 'assets/video/projeler/solinved-tanitim-filmi.mp4', poster: 'assets/img/projeler/solinved-tanitim-filmi.jpg' },
    { title: 'Çizo Süpermarket Reklamı', category: 'Reklam Filmi', ratio: '16:9',
      video: 'assets/video/projeler/cizo-supermarket-tanitim.mp4', poster: 'assets/img/projeler/cizo-supermarket-tanitim.jpg' },
    { title: 'Pickleball Dünya Şampiyonası Filmi', category: 'Spor', ratio: '16:9',
      video: 'assets/video/projeler/pickleball-dunya-sampiyonasi.mp4', poster: 'assets/img/projeler/pickleball-dunya-sampiyonasi.jpg' },
    { title: 'Çaycuma Süt Labne Reklamı', category: 'Ürün Reklamı', ratio: '9:16',
      video: 'assets/video/projeler/caycuma-labne-reklami.mp4', poster: 'assets/img/projeler/caycuma-labne-reklami.jpg' },
    { title: 'Elektrik Panosu Montaj Animasyonu', category: 'Endüstriyel', ratio: '9:16',
      video: 'assets/video/projeler/elektrik-panosu-montaj.mp4', poster: 'assets/img/projeler/elektrik-panosu-montaj.jpg' },
    { title: 'Çimenden Yükselen Villa', category: 'Gayrimenkul', ratio: '9:16',
      video: 'assets/video/projeler/cimenden-yukselen-villa.mp4', poster: 'assets/img/projeler/cimenden-yukselen-villa.jpg' },
    { title: 'Solinved VEGA 630W Panel Tanıtımı', category: 'Enerji', ratio: '9:16',
      video: 'assets/video/projeler/solinved-vega-630w.mp4', poster: 'assets/img/projeler/solinved-vega-630w.jpg' },
    { title: 'Beypazarı Fest Tanıtımı', category: 'Etkinlik', ratio: '9:16',
      video: 'assets/video/projeler/beypazari-fest-tanitim.mp4', poster: 'assets/img/projeler/beypazari-fest-tanitim.jpg' },
    { title: 'Toros Kesit Animasyonu', category: 'Otomotiv', ratio: '9:16',
      video: 'assets/video/projeler/toros-kesit-animasyonu.mp4', poster: 'assets/img/projeler/toros-kesit-animasyonu.jpg' },
    { title: 'ONYX Metro Tanıtım Filmi', category: 'Gayrimenkul', ratio: '16:9',
      video: 'assets/video/projeler/onyx-metro-tanitim.mp4', poster: 'assets/img/projeler/onyx-metro-tanitim.jpg' }
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
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DTYfOfkiDq5/', title: 'Buzun İçinde Donmuş Spor Araba', poster: 'assets/img/promptlar/buz-porsche-01.jpg', video: 'assets/video/promptlar/buz-porsche-01-kart.mp4' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DV560w1CKCU/', title: 'Arsa Sınırı ve m² Efekti', poster: 'assets/img/promptlar/arsa-m2-01.jpg', video: 'assets/video/promptlar/arsa-m2-01-kart.mp4' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DYPtme2I2cY/', title: 'Ürün Etrafında Hologram Efekti', poster: 'assets/img/promptlar/hologram-kamera-01.jpg', video: 'assets/video/promptlar/hologram-kamera-01-kart.mp4' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DPrEu_SiHaL/', title: 'Drone Görüntüsünde Dönüşüm', poster: 'assets/img/promptlar/sehir-morph-01.jpg', video: 'assets/video/promptlar/sehir-morph-01-kart.mp4' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DYHdnhTo7z1/', title: 'Yatay Çekimi Dikeye Genişletme', poster: 'assets/img/promptlar/venedik-dikey-01.jpg', video: 'assets/video/promptlar/venedik-dikey-01-kart.mp4' },
    { url: 'https://www.instagram.com/p/Davbi64obp-/', title: 'ONYX Metro: AI Tanıtım Filmi',
      poster: 'assets/img/instagram/onyx-metro.jpg' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DVHCs2ECG_D/', title: 'Yankı Evler: Örtü Açılışının Yapımı',
      poster: 'assets/img/instagram/yanki-evler-helikopter.jpg',
      video: 'assets/video/instagram/yanki-evler-helikopter.mp4' },
    { url: 'https://www.instagram.com/p/DcYzmNToIAV/', title: 'Toros: Araba Efekti Nasıl Yapılır?',
      poster: 'assets/img/instagram/toros-araba-efekti.jpg' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DTqRdmMCLtr/', title: 'Bulutlardan Düşen Porsche 911', poster: 'assets/img/promptlar/porsche-bulut-01.jpg', video: 'assets/video/promptlar/porsche-bulut-01-kart.mp4' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DewsPm6ovKn/', title: 'Boş Arsadan Yükselen Bina', poster: 'assets/img/promptlar/arsa-insaat-01.jpg', video: 'assets/video/promptlar/arsa-insaat-01-kart.mp4' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DeUjMUKo4Ny/', title: 'Boş Araziden Yükselen Kuleler', poster: 'assets/img/promptlar/yukselen-kuleler-01.jpg', video: 'assets/video/promptlar/yukselen-kuleler-01-kart.mp4' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DZScZPYo5cm/', title: 'Tekerlekten Porscheye Montaj', poster: 'assets/img/promptlar/transform-porsche-01.jpg', video: 'assets/video/promptlar/transform-porsche-01-kart.mp4' },
    { url: 'https://www.instagram.com/togetheryazibasi/reel/DZKlSKXIdeb/', title: 'Boş Daireyi Döşenmiş Hâle Getirme', poster: 'assets/img/promptlar/bos-daire-01.jpg', video: 'assets/video/promptlar/bos-daire-01-kart.mp4' }
  ]
};
