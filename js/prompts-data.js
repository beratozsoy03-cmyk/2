/* ============================================================
   PROMPT KÜTÜPHANESİ — İÇERİK DOSYASI
   Yeni prompt eklemek için "prompts" listesine bir nesne eklemek
   yeterlidir; HTML veya CSS'e dokunmak gerekmez.

   En son eklenen prompt "date" alanına göre otomatik belirlenir.
   Paylaşım bağlantısı:  prompt-kutuphanesi.html?prompt=<id>

   Alanlar
   ---------------------------------------------------------------
   id        : benzersiz, küçük harf, Türkçe karaktersiz (URL'de kullanılır)
   title     : kartta ve detayda görünen başlık
   summary   : 1-2 cümlelik kısa açıklama
   category  : aşağıdaki "categories" listesindeki id
   tool      : kullanılan video aracı (ör. 'Kling', 'Higgsfield', 'Runway')
   imageTool : (isteğe bağlı) ilk kareyi üreten araç (ör. 'Midjourney')
   date      : 'YYYY-AA-GG' — sıralama ve "en yeni" bunun üzerinden yapılır
   ratio     : '9:16' | '16:9' | '1:1' | '4:5'
   duration  : saniye (sayı)
   video     : 'assets/video/promptlar/<id>.mp4'  (yoksa null → demo önizleme)
               Kart ekrana girince yüklenir; sessiz, döngülü ve otomatik oynar.
   videoSmall: (isteğe bağlı) kartlar için daha küçük sürüm, ör. '<id>-kart.mp4'
   poster    : 'assets/img/promptlar/<id>.jpg'    (yoksa null) — video yüklenene kadar görünür
   instagram : gönderinin gerçek adresi (yoksa null)
   promptType: 'gercek'   → bu video gerçekten bu promptla üretildi (yeşil etiket)
               'aciklama' → prompt, Instagram açıklamasında paylaşılan tariften alındı (mavi etiket)
               'ornek'    → videoya benzer sonuç için yazılmış örnek prompt (varsayılan)
               Videonun promptu bilinmiyorsa ASLA 'gercek' yazmayın.
   promptNote: (isteğe bağlı) etiket metnini özelleştirir
   prompt    : kopyalanacak prompt metni (video modelleri için İngilizce önerilir)
   steps     : "Nasıl yapıldı?" adımları (Türkçe)
   tags      : arama için ek anahtar kelimeler
   builder   : "Oluşturucuda düzenle" butonunun dolduracağı seçimler
               (anahtarlar js/prompt-builder-data.js içindeki id'lerdir)
   demo      : true → "Örnek içerik" etiketi gösterilir. Gerçek içerikte false.
   preview   : yalnızca demo içerik için CSS önizleme sahnesi { scene, motion }
   ============================================================ */
window.PROMPT_LIBRARY = {

  categories: [
    { id: 'mimari',    name: 'Mimari & Gayrimenkul' },
    { id: 'otomotiv',  name: 'Otomotiv' },
    { id: 'efekt',     name: 'AI Efektleri' },
    { id: 'gorsel',    name: 'Görselden Videoya' },
    { id: 'karakter',  name: 'Karakter & Animasyon' },
    { id: 'urun',      name: 'Ürün & Reklam' },
    { id: 'sinematik', name: 'Sinematik' },
    { id: 'kamera',    name: 'Kamera Hareketleri' },
    { id: 'gecis',     name: 'Geçiş Efektleri' }
  ],

  prompts: [
    /* ---------- @togetheryazibasi Instagram videoları ----------
       Önizlemeler, ilgili Instagram videosundan kesilmiş kısa bölümlerdir
       (medya-hazirla.sh ile optimize edildi). */
    {
      id: 'porsche-bulut-01',
      title: 'Bulutların Arasından Düşen Porsche 911',
      summary: 'Bulutların içinde asılı kalan klasik bir Porsche 911 ve arka planda süzülen hayalet bombardıman uçakları. Az hareket, sabit gökyüzü, saf sinematik gerilim.',
      category: 'otomotiv',
      tool: 'Kling 2.5 Turbo',
      date: '2026-11-03',
      ratio: '9:16',
      duration: 15,
      video: 'assets/video/promptlar/porsche-bulut-01.mp4',
      videoSmall: 'assets/video/promptlar/porsche-bulut-01-kart.mp4',
      poster: 'assets/img/promptlar/porsche-bulut-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DTqRdmMCLtr/',
      promptType: 'aciklama',
      promptNote: 'Prompt, videonun Instagram açıklamasında paylaşılan sahne tarifidir. Sekanstaki üç çekimin (Cloud Fall, Static Hover Zoom, Headlight Flicker Moment) ayrı promptları paylaşılmadı.',
      prompt: 'A vertical cinematic sequence where a Porsche 911 drops through dense clouds — suspended in mid-air, obeying real-world physics, with ultra-slow spinning wheels.\n\nAs the car enters the scene, B-2 Spirit stealth bombers glide silently across the background. Front headlights stay off… then suddenly flicker on for a brief moment, breaking the calm.\n\nMinimal motion.\nStatic sky.\nPure cinematic tension.\n\nNo driver.\nNo characters.\nNo chaos — just controlled motion.',
      steps: [
        'Video, Instagram açıklamasına göre Kling 2.5 Turbo ile üretildi.',
        'Sekans üç ayrı çekimden kuruldu: Cloud Fall, Static Hover Zoom ve Headlight Flicker Moment.',
        'Buradaki önizleme, Instagram videosundan alınmış 8 saniyelik bir kesittir.'
      ],
      tags: ['porsche', 'araba', 'bulut', 'uçan araba', 'kling', 'sinematik', 'gökyüzü'],
      builder: { movement: 'static', shot: 'medium', angle: 'eye', lens: '', light: 'daylight', mood: 'tense', style: 'cinematic', speed: 'very-slow', ratio: '9:16', duration: '5',
        subject: 'A classic Porsche 911 suspended in mid-air with ultra-slow spinning wheels', location: 'dense clouds high in the sky', action: 'stealth bombers glide silently across the background and the headlights briefly flicker on' },
      demo: false
    },
    {
      id: 'arsa-insaat-01',
      title: 'Boş Arsadan Yükselen Bina',
      summary: 'Boş bir arsanın üzerinden FPV kamerayla geçerken temeller, kolonlar ve katlar tek bir kesintisiz çekimde yükselir. Gayrimenkul projeleri için.',
      category: 'mimari',
      tool: 'Seedance 2.5',
      date: '2026-11-02',
      ratio: '4:5',
      duration: 6,
      video: 'assets/video/promptlar/arsa-insaat-01.mp4',
      videoSmall: 'assets/video/promptlar/arsa-insaat-01-kart.mp4',
      poster: 'assets/img/promptlar/arsa-insaat-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DewsPm6ovKn/',
      promptType: 'ornek',
      promptNote: 'Örnek prompt — videoda yalnızca bir kısmı görünen orijinal prompttan yola çıkılarak hazırlandı; videonun tam promptu değildir.',
      prompt: 'Camera movement:\nFPV drone flight. Start low over an empty dirt plot and fly forward in one continuous shot while the building rises around the camera: rebar grids, foundations, concrete columns, then floors and facade. Use smooth orbit-style banking, controlled push-in and pull-out moves and gentle spiral elevation changes. Speed: fast but highly controlled.\n\nReference images:\nUse the empty plot photo as the first frame and the completed building photo as the final frame. End on a cinematic hero view where the completed building matches the reference image exactly.\n\nLook:\nLighting: clear natural daylight. Style: photoreal construction time-lapse feel, natural cinematic motion blur, wide-angle FPV lens with restrained fisheye distortion.\n\nAvoid:\ncamera shaking, random vibration, unstable horizon, chaotic freestyle movement, abrupt left-right corrections, hard cuts.',
      steps: [
        'Videoda gösterildiği gibi iki referans görsel kullanıldı: boş arsa ve tamamlanmış bina.',
        'Prompt bir yapay zekâ sohbet aracıyla yazıldı; video Seedance 2.5 ile üretildi.',
        'Buradaki önizleme, Instagram videosundan alınmış 5,5 saniyelik bir kesittir (altyazı kalmasın diye 4:5 kırpıldı).'
      ],
      tags: ['inşaat', 'gayrimenkul', 'arsa', 'bina', 'fpv', 'drone', 'seedance', 'dönüşüm'],
      builder: { movement: 'fpv', shot: 'wide', angle: 'high', lens: '14', light: 'daylight', mood: 'epic', style: 'documentary', speed: 'fast', ratio: '9:16', duration: '10', refImage: true,
        imageContext: 'an empty plot as the first frame and the finished building as the last frame', subject: 'A residential building', location: 'an empty dirt plot on the edge of a city', action: 'the building rises from foundations to finished facade in one continuous shot', avoid: ['flicker'] },
      demo: false
    },
    {
      id: 'bos-daire-01',
      title: 'Boş Daireyi Döşenmiş Hâle Getirme',
      summary: 'Boş bir dairenin fotoğrafı, kamera hafifçe dönerken mutfak, tabureler ve dekorla döşenmiş hâline dönüşür. Satılık ve kiralık daire ilanları için.',
      category: 'gorsel',
      tool: 'Higgsfield',
      imageTool: 'ChatGPT / Gemini (bitiş görseli)',
      date: '2026-11-01',
      ratio: '9:16',
      duration: 3,
      video: 'assets/video/promptlar/bos-daire-01.mp4',
      videoSmall: 'assets/video/promptlar/bos-daire-01-kart.mp4',
      poster: 'assets/img/promptlar/bos-daire-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DZKlSKXIdeb/',
      promptType: 'ornek',
      promptNote: 'Örnek prompt — videoda Higgsfield Morphskin efekti ve kısa bir hareket talimatı görünüyor; videonun tam promptu değildir.',
      prompt: 'Camera movement:\nSlow arc right around the room, keeping the kitchen island centered. Speed: slow and smooth.\n\nReference images:\nUse the empty apartment photo as the first frame and the furnished version as the last frame. Transform seamlessly from empty to furnished: kitchen cabinets, island, bar stools and small decor appear naturally in place.\n\nLook:\nLighting: soft natural daylight. Style: photoreal real estate interior.\n\nAvoid:\nchanging the room layout, bending walls, warping floor lines, extra doors or windows, don\'t spoil the details.',
      steps: [
        'Boş odanın fotoğrafı ChatGPT veya Gemini ile döşenmiş hâle getirildi (bitiş karesi).',
        'Higgsfield\'da Morphskin efektiyle iki görsel arasında geçiş üretildi.',
        'Buradaki önizleme, Instagram videosundan alınmış 3,3 saniyelik bir kesittir.'
      ],
      tags: ['iç mekan', 'daire', 'gayrimenkul', 'mobilya', 'higgsfield', 'morphskin', 'dönüşüm', 'emlak'],
      builder: { movement: 'arc-right', shot: 'wide', angle: 'eye', lens: '24', light: 'window', mood: 'peaceful', style: 'commercial', speed: 'slow', ratio: '9:16', duration: '5', refImage: true,
        imageContext: 'an empty apartment as the first frame and the furnished version as the last frame', subject: 'An open-plan apartment kitchen', location: 'a bright empty apartment', action: 'furniture, cabinets and bar stools appear naturally in place', avoid: ['morph'] },
      demo: false
    },
    {
      id: 'transform-porsche-01',
      title: 'Tekerlekten Porsche\'ye Mekanik Montaj',
      summary: 'Boş bir avluda tek bir tekerlekten başlayan dönüşüm; şasi, gövde ve detaylar parça parça birleşerek hedef karedeki arabayı oluşturur.',
      category: 'efekt',
      tool: 'Seedance 2.0',
      date: '2026-10-31',
      ratio: '9:16',
      duration: 4,
      video: 'assets/video/promptlar/transform-porsche-01.mp4',
      videoSmall: 'assets/video/promptlar/transform-porsche-01-kart.mp4',
      poster: 'assets/img/promptlar/transform-porsche-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DZScZPYo5cm/',
      promptType: 'ornek',
      promptNote: 'Örnek prompt — videoda yalnızca son kısmı görünen orijinal prompttan yola çıkılarak hazırlandı; videonun tam promptu değildir.',
      prompt: 'Camera movement:\nLocked-off static shot. The camera stays in one fixed position for the whole clip with the same angle, height and framing.\n\nScene:\nA single wheel rolls into the empty courtyard and stops. The chassis, suspension and body panels assemble piece by piece around it until a realistic silver Porsche 911 Turbo S is parked standing still in the exact same position and angle as the target reference frame.\n\nReference images:\nUse the empty courtyard as the first frame and the parked car as the last frame.\n\nAvoid:\nabsolutely no camera motion, no environmental changes, no people, no smoke clouds, no random particles obscuring the scene, no melting effects and no cartoon-like morphing. The end result is a clean, high-end mechanical assembly effect.',
      steps: [
        'Başlangıç ve hedef olmak üzere iki görsel hazırlandı.',
        'Video Seedance 2.0\'da "transform" (mekanik montaj) promptuyla üretildi.',
        'Buradaki önizleme, Instagram videosundan alınmış 4 saniyelik bir kesittir.'
      ],
      tags: ['transform', 'dönüşüm', 'araba', 'porsche', 'montaj', 'seedance', 'efekt'],
      builder: { movement: 'static', shot: 'wide', angle: 'eye', lens: '35', light: 'daylight', mood: 'luxurious', style: 'commercial', speed: 'medium', ratio: '9:16', duration: '5', refImage: true,
        imageContext: 'an empty courtyard as the first frame and the finished car as the last frame', subject: 'A silver sports car', location: 'a minimal white-walled courtyard', action: 'the car assembles piece by piece from a single wheel', avoid: ['people', 'morph'] },
      demo: false
    },
    {
      id: 'yukselen-kuleler-01',
      title: 'Boş Araziden Yükselen Işıklı Kuleler',
      summary: 'Şehir kenarındaki boş bir arazide, altın rengi ışık çizgileriyle iki konut kulesi yükselir. Proje lansmanları ve gayrimenkul reklamları için.',
      category: 'mimari',
      tool: 'Seedance',
      date: '2026-10-30',
      ratio: '4:5',
      duration: 4,
      video: 'assets/video/promptlar/yukselen-kuleler-01.mp4',
      videoSmall: 'assets/video/promptlar/yukselen-kuleler-01-kart.mp4',
      poster: 'assets/img/promptlar/yukselen-kuleler-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DeUjMUKo4Ny/',
      promptType: 'ornek',
      prompt: 'Camera movement:\nslow drone push in. The aerial camera glides forward and slightly down toward the empty plot, keeping the horizon level. Speed: slow and smooth.\n\nReference images:\nUse the empty land photo as the first frame and the finished towers render as the last frame.\n\nScene:\nGlowing golden light lines trace the outline of two residential towers on the empty plot. The wireframe fills in floor by floor until the finished, illuminated buildings stand in place.\n\nLook:\nLighting: clear daylight with warm golden light on the structures. Mood: epic, aspirational. Style: high-end real estate commercial, photoreal.\n\nAvoid:\nchanging the surrounding roads and buildings, flickering, text, logos.',
      steps: [
        'Prompt bir yapay zekâ sohbet aracıyla (ChatGPT, Gemini veya Claude) hazırlandı.',
        'Video Seedance ile boş arazi ve bitmiş proje görseli kullanılarak üretildi.',
        'Buradaki önizleme, Instagram videosundan alınmış 4 saniyelik bir kesittir (altyazı kalmasın diye 4:5 kırpıldı).'
      ],
      tags: ['inşaat', 'gayrimenkul', 'kule', 'lansman', 'drone', 'ışık', 'seedance', 'proje'],
      builder: { movement: 'drone-push', shot: 'extreme-wide', angle: 'high', lens: '24', light: 'golden', mood: 'epic', style: 'commercial', speed: 'slow', ratio: '9:16', duration: '5', refImage: true,
        imageContext: 'an empty plot as the first frame and the finished towers as the last frame', subject: 'Two residential towers', location: 'an empty plot at the edge of the city', action: 'golden light lines trace the towers and they fill in floor by floor', avoid: ['text', 'flicker'] },
      demo: false
    },
    {
      id: 'buz-porsche-01',
      title: 'Buzun İçinde Donmuş Spor Araba',
      summary: 'Devasa buz duvarlarının arasında, buzun içine hapsolmuş bir spor araba. Otomotiv reklamları için soğuk ve dramatik bir açılış.',
      category: 'otomotiv',
      tool: 'Belirtilmedi',
      date: '2026-10-29',
      ratio: '4:5',
      duration: 3,
      video: 'assets/video/promptlar/buz-porsche-01.mp4',
      videoSmall: 'assets/video/promptlar/buz-porsche-01-kart.mp4',
      poster: 'assets/img/promptlar/buz-porsche-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DTYfOfkiDq5/',
      promptType: 'ornek',
      prompt: 'Camera movement:\nslow truck right along the ice wall, keeping the car centered. Speed: slow and smooth.\n\nScene:\nA dark sports car is frozen inside a massive block of clear blue glacier ice. Cracks and air bubbles run through the ice, cold light refracts around the car body.\n\nLook:\nLighting: cold blue light filtering through the ice, soft highlights on the car. Mood: tense, luxurious. Style: high-end automotive commercial, photoreal.\n\nAvoid:\nwarping of the car body, melting, text, people.',
      steps: [
        'Instagram videosu, markalar için araba reklamı kreatifi üretmeyi anlatıyor; kullanılan araç adı açıklamada belirtilmemiş.',
        'Buradaki önizleme, videonun AI bölümünden alınmış 3 saniyelik bir kesittir (altyazı kalmasın diye 4:5 kırpıldı).'
      ],
      tags: ['araba', 'otomotiv', 'buz', 'reklam', 'porsche', 'soğuk', 'kreatif'],
      builder: { movement: 'truck-right', shot: 'wide', angle: 'eye', lens: '35', light: 'low-key', mood: 'tense', style: 'commercial', speed: 'slow', ratio: '9:16', duration: '5',
        subject: 'A dark sports car', location: 'inside a massive block of blue glacier ice', action: 'cold light refracts through cracks in the ice around the car', avoid: ['morph', 'text'] },
      demo: false
    },
    {
      id: 'venedik-dikey-01',
      title: 'Yatay Çekimi Dikey Videoya Genişletme',
      summary: 'Yatay çekilmiş bir Venedik kanalı görüntüsü, yapay zekâyla üstü ve altı tamamlanarak doğal görünen dikey bir videoya dönüşür.',
      category: 'efekt',
      tool: 'Kling O1 Edit',
      date: '2026-10-28',
      ratio: '9:16',
      duration: 2,
      video: 'assets/video/promptlar/venedik-dikey-01.mp4',
      videoSmall: 'assets/video/promptlar/venedik-dikey-01-kart.mp4',
      poster: 'assets/img/promptlar/venedik-dikey-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DYHdnhTo7z1/',
      promptType: 'ornek',
      prompt: 'Expand the uploaded horizontal video into a vertical 9:16 frame. Generate the missing sky above and the canal water below so they blend seamlessly with the original footage.\n\nPreserve the original framing, camera motion, colors, lighting and every architectural detail exactly. Continue the building facades, windows and reflections naturally.\n\nAvoid:\nvisible seams or borders, warped buildings, new objects, changing the original motion.',
      steps: [
        'Kaynak, yatay çekilmiş gerçek bir Venedik kanalı videosu.',
        'Kling O1 Edit ile videonun üstü ve altı yapay zekâyla tamamlanarak dikey formata genişletildi.',
        'Buradaki önizleme, sonuçtan alınmış 2 saniyelik bir kesittir.'
      ],
      tags: ['yatay', 'dikey', 'genişletme', 'outpaint', 'kling', 'venedik', 'reels', 'format'],
      builder: { movement: 'static', shot: 'wide', angle: 'eye', lens: '', light: 'overcast', mood: 'peaceful', style: 'documentary', speed: '', ratio: '9:16', duration: '5', refImage: true,
        imageContext: 'a horizontal video of a Venice canal', subject: '', location: 'a narrow canal in Venice', action: 'the sky and water are extended to fill a vertical frame', avoid: ['morph'] },
      demo: false
    },
    {
      id: 'keloglan-animasyon-01',
      title: 'Keloğlan Tarzı 3D Animasyon Sahnesi',
      summary: 'Masal karakterleriyle, stilize 3D animasyon görünümünde kısa bir sahne. Çocuk içerikleri ve hikâye anlatımı için.',
      category: 'karakter',
      tool: 'Higgsfield Genjutsu',
      date: '2026-10-27',
      ratio: '16:9',
      duration: 5,
      video: 'assets/video/promptlar/keloglan-animasyon-01.mp4',
      videoSmall: 'assets/video/promptlar/keloglan-animasyon-01-kart.mp4',
      poster: 'assets/img/promptlar/keloglan-animasyon-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DeXDuXgoJfP/',
      promptType: 'ornek',
      prompt: 'Camera movement:\nmedium shot, slow push in. Speed: slow and smooth.\n\nScene:\nInside a cozy village house, a young girl in a green dress and a woman with a yellow headscarf watch in surprise as someone waves excitedly at them. Expressive faces, playful body language.\n\nLook:\nLighting: warm interior light. Mood: playful, warm. Style: stylized 3D animated film, soft materials, Turkish folk tale atmosphere.\n\nAvoid:\nextra fingers, face distortion, text.',
      steps: [
        'Karakter ve sahne promptları ChatGPT veya Claude ile detaylandırıldı.',
        'Video Higgsfield\'in Genjutsu özelliğiyle üretildi.',
        'Buradaki önizleme, Instagram videosundan alınmış 4,6 saniyelik bir kesittir.'
      ],
      tags: ['keloğlan', 'animasyon', '3d', 'masal', 'karakter', 'çocuk', 'higgsfield', 'genjutsu'],
      builder: { movement: 'push-in', shot: 'medium', angle: 'eye', lens: '', light: 'practical', mood: 'playful', style: '3d', speed: 'slow', ratio: '16:9', duration: '5',
        subject: 'A young girl in a green dress and a woman in a yellow headscarf', location: 'a cozy village house', action: 'they react with surprise as someone waves excitedly', avoid: ['limbs', 'morph'] },
      demo: false
    },
    {
      id: 'arsa-m2-01',
      title: 'Arsa Sınırı ve m² Efekti',
      summary: 'Drone görüntüsündeki arsanın sınırları parlayan bir çizgiyle çizilir ve üzerinde 3D bir metrekare yazısı belirir. Arsa satış ilanları için.',
      category: 'mimari',
      tool: 'Kling AI',
      imageTool: 'Nano Banana Pro',
      date: '2026-10-26',
      ratio: '9:16',
      duration: 3,
      video: 'assets/video/promptlar/arsa-m2-01.mp4',
      videoSmall: 'assets/video/promptlar/arsa-m2-01-kart.mp4',
      poster: 'assets/img/promptlar/arsa-m2-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DV560w1CKCU/',
      promptType: 'ornek',
      prompt: 'Camera movement:\nslow drone orbit around the plot, keeping it centered. Speed: slow and smooth.\n\nReference image:\nUse the drone photo with the highlighted plot as the first frame. Preserve the surrounding streets, buildings and city skyline exactly.\n\nScene:\nA glowing blue outline traces the boundary of the empty plot. Large extruded 3D blue text "45000 m2" stands on the land, casting soft shadows.\n\nLook:\nLighting: soft overcast daylight. Style: real estate marketing, photoreal with clean graphic overlays.\n\nAvoid:\nmisspelled numbers, moving buildings, flickering outline.',
      steps: [
        'Drone ekran görüntüsü Nano Banana Pro ile işlendi: arsa sınırı ve metrekare yazısı eklendi.',
        'Bu görsel Kling AI ile hareketli videoya dönüştürüldü.',
        'Buradaki önizleme, Instagram videosundan alınmış 2,6 saniyelik bir kesittir.'
      ],
      tags: ['arsa', 'metrekare', 'm2', 'gayrimenkul', 'drone', 'kling', 'nano banana', 'ilan'],
      builder: { movement: 'orbit-cw', shot: 'extreme-wide', angle: 'high', lens: '24', light: 'overcast', mood: 'peaceful', style: 'commercial', speed: 'slow', ratio: '9:16', duration: '5', refImage: true,
        imageContext: 'a drone photo of an empty plot with its boundary highlighted', subject: 'A glowing blue plot boundary and 3D square-meter text', location: 'an empty plot in a city district', action: 'the boundary line glows and the 3D text stands on the land', avoid: ['text', 'flicker'] },
      demo: false
    },
    {
      id: 'sehir-morph-01',
      title: 'Drone Görüntüsünde Morphskin Dönüşümü',
      summary: 'Gerçek bir şehir drone çekiminde, seçilen bölüm yapay zekâyla akıcı biçimde dönüştürülür. Gayrimenkul projelerinde önce/sonra anlatımı için.',
      category: 'efekt',
      tool: 'Higgsfield Morphskin',
      date: '2026-10-25',
      ratio: '4:5',
      duration: 3,
      video: 'assets/video/promptlar/sehir-morph-01.mp4',
      videoSmall: 'assets/video/promptlar/sehir-morph-01-kart.mp4',
      poster: 'assets/img/promptlar/sehir-morph-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DPrEu_SiHaL/',
      promptType: 'ornek',
      prompt: 'Camera movement:\ndrone push in over the city. Speed: slow and smooth.\n\nReference images:\nUse the original drone frame as the first frame and the edited frame (construction area cleaned up and replaced) as the last frame.\n\nScene:\nThe selected construction area morphs seamlessly into its new state while the rest of the city stays exactly the same.\n\nLook:\nLighting: clear daylight. Style: photoreal aerial footage.\n\nAvoid:\nchanging the skyline, warping roads, flicker, hard cuts.',
      steps: [
        'Drone videosundan ekran görüntüsü alındı ve inşaat bölümü görsel düzenleyiciyle temizlendi.',
        'İki görsel Higgsfield\'in Morphskin efektiyle akıcı bir geçişe dönüştürüldü.',
        'Buradaki önizleme, Instagram videosundan alınmış 3,4 saniyelik bir kesittir.'
      ],
      tags: ['morphskin', 'drone', 'şehir', 'dönüşüm', 'higgsfield', 'gayrimenkul', 'önce sonra'],
      builder: { movement: 'drone-push', shot: 'extreme-wide', angle: 'high', lens: '24', light: 'daylight', mood: 'peaceful', style: 'documentary', speed: 'slow', ratio: '9:16', duration: '5', refImage: true,
        imageContext: 'the original drone frame and an edited version of it', subject: 'A construction area in the city', location: 'a city district seen from a drone', action: 'the selected area morphs seamlessly into its new state', avoid: ['flicker', 'morph'] },
      demo: false
    },
    {
      id: 'hologram-kamera-01',
      title: 'Ürün Etrafında Hologram Efekti',
      summary: 'Elde tutulan bir kameranın etrafında, teknik özellikleri gösteren mavi hologram halkaları ve etiketler belirir. Teknoloji ürünü tanıtımları için.',
      category: 'urun',
      tool: 'Kling O1 Edit',
      imageTool: 'Nano Banana Pro',
      date: '2026-10-24',
      ratio: '4:5',
      duration: 4,
      video: 'assets/video/promptlar/hologram-kamera-01.mp4',
      videoSmall: 'assets/video/promptlar/hologram-kamera-01-kart.mp4',
      poster: 'assets/img/promptlar/hologram-kamera-01.jpg',
      instagram: 'https://www.instagram.com/togetheryazibasi/reel/DYPtme2I2cY/',
      promptType: 'ornek',
      prompt: 'Edit the uploaded video: add futuristic blue holographic graphics around the camera held in the hand.\n\nThin glowing rings orbit the lens, and floating spec labels with thin leader lines appear next to the product. The graphics expand out in 3D space, then settle into their final positions and track the product as it moves.\n\nKeep the room, the hand and the product exactly as filmed. Match the lighting and perspective of the original footage.\n\nAvoid:\nflickering graphics, covering the product, changing the hand or the room.',
      steps: [
        'Hologram tasarımı Nano Banana Pro ile bir kare üzerinde oluşturuldu.',
        'Kling O1 Edit ile hologram, elde çekilmiş gerçek videoya uygulandı ve ürünü takip etti.',
        'Buradaki önizleme, Instagram videosundan alınmış 3,6 saniyelik bir kesittir.'
      ],
      tags: ['hologram', 'ürün', 'kamera', 'teknoloji', 'kling', 'efekt', 'reklam', 'vfx'],
      builder: { movement: 'handheld', shot: 'medium-close', angle: 'high', lens: '24', light: 'window', mood: 'energetic', style: 'commercial', speed: 'medium', ratio: '9:16', duration: '5', refImage: true,
        imageContext: 'a handheld video of a camera in a room', subject: 'A camera held in a hand', location: 'a bright empty room', action: 'blue holographic rings and spec labels appear around the camera', avoid: ['flicker'] },
      demo: false
    },

    /* ---------- Örnek (demo) içerikler ---------- */
    {
      id: 'parfum-orbit-01',
      title: 'Parfüm Şişesi Etrafında Yörünge',
      summary: 'Siyah stüdyoda dönen bir parfüm şişesi; tek bir yumuşak yörünge hareketiyle premium reklam hissi.',
      category: 'urun',
      tool: 'Kling',
      imageTool: 'Midjourney',
      date: '2026-10-30',
      ratio: '9:16',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\nslow orbit clockwise around the product. Move on a constant-radius circle around the bottle at product height, keeping it locked in the center of frame. Speed: slow and perfectly smooth. End: settle on the front label.\n\nShot:\nclose-up, eye-level angle, 85mm lens look with shallow depth of field. Vertical 9:16, 5 seconds.\n\nScene:\nA faceted glass perfume bottle with amber liquid on a glossy black acrylic pedestal in a dark studio. Thin wisps of smoke drift slowly behind the bottle.\n\nLook:\nLighting: hard rim lights from both sides and a soft top light, crisp reflections on the glass. Mood: luxurious, calm. Style: high-end commercial, photoreal.\n\nAvoid:\nwarping or melting of the bottle shape, text, logos, watermarks.',
      steps: [
        'Midjourney ile siyah zeminde ürün görseli (ilk kare) üretildi.',
        'Kling\'de "görselden videoya" modunda ilk kare olarak yüklendi.',
        'Prompt\'taki kamera bölümü ayrı tutuldu; 3 deneme içinden en akıcı olanı seçildi.'
      ],
      tags: ['parfüm', 'ürün çekimi', 'orbit', 'stüdyo', 'reklam', 'lüks'],
      builder: { movement: 'orbit-cw', shot: 'close-up', angle: 'eye', lens: '85', light: 'rim', mood: 'luxurious', style: 'commercial', speed: 'slow', ratio: '9:16', duration: '5',
        subject: 'A faceted glass perfume bottle with amber liquid', location: 'a glossy black pedestal in a dark studio', action: 'thin wisps of smoke drift slowly behind the bottle' },
      demo: true,
      preview: { scene: 'studio', motion: 'orbit' }
    },
    {
      id: 'neon-sokak-takip-01',
      title: 'Yağmurlu Neon Sokakta Takip',
      summary: 'Islak asfaltta yürüyen karakteri arkadan takip eden, gece şehri atmosferli sinematik plan.',
      category: 'sinematik',
      tool: 'Higgsfield',
      date: '2026-10-27',
      ratio: '9:16',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\nfollow shot from behind. The camera travels behind the subject at shoulder height, matching their walking pace, with the street ahead staying readable. Speed: steady walking pace. End: keep following as the subject leads the frame.\n\nShot:\nmedium shot, eye-level angle, 35mm lens look. Vertical 9:16, 5 seconds.\n\nScene:\nA man in a long dark coat walks through a narrow city street at night. Light rain falls, neon signs reflect on the wet asphalt.\n\nLook:\nLighting: magenta and cyan neon with soft haze. Mood: mysterious, tense. Style: cinematic, 35mm film grain.\n\nAvoid:\nreadable text on signs, face distortion, extra people walking into frame.',
      steps: [
        'Higgsfield\'de metinden videoya modu kullanıldı.',
        '"Follow shot" hareketi seçilip sahne detayları ayrı bölümlerde yazıldı.'
      ],
      tags: ['neon', 'gece', 'yağmur', 'takip', 'şehir', 'follow shot'],
      builder: { movement: 'follow-behind', shot: 'medium', angle: 'eye', lens: '35', light: 'neon', mood: 'mysterious', style: 'film', speed: 'medium', ratio: '9:16', duration: '5',
        subject: 'A man in a long dark coat', location: 'a narrow city street at night in light rain', action: 'he walks forward as neon signs reflect on the wet asphalt' },
      demo: true,
      preview: { scene: 'neon', motion: 'push-in' }
    },
    {
      id: 'villa-drone-giris-01',
      title: 'Villa Tanıtımı: Drone ile Giriş',
      summary: 'Gayrimenkul videoları için havadan yaklaşan, gün batımında villa açılış planı.',
      category: 'mimari',
      tool: 'Kling',
      imageTool: 'Midjourney',
      date: '2026-10-24',
      ratio: '16:9',
      duration: 8,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\ndrone push in. The aerial camera glides forward and slightly down toward the villa entrance, keeping the horizon level. Speed: slow, floating glide. End: finish on the illuminated entrance and pool.\n\nShot:\nextreme wide shot, high angle, 24mm lens look. Horizontal 16:9, 8 seconds.\n\nScene:\nA modern white villa with a glass facade and an infinity pool on a hillside above the sea.\n\nLook:\nLighting: golden hour with warm interior lights turning on. Mood: peaceful, aspirational. Style: real estate commercial, photoreal.\n\nAvoid:\nchanging architecture, bending walls, flickering windows.',
      steps: [
        'Villa görseli Midjourney\'de 16:9 olarak üretildi.',
        'Kling\'de ilk kare olarak kullanıldı; mimarinin bozulmaması için "Avoid" bölümü eklendi.'
      ],
      tags: ['gayrimenkul', 'drone', 'villa', 'emlak', 'gün batımı', 'havadan'],
      builder: { movement: 'drone-push', shot: 'extreme-wide', angle: 'high', lens: '24', light: 'golden', mood: 'peaceful', style: 'commercial', speed: 'slow', ratio: '16:9', duration: '8',
        subject: 'A modern white villa with a glass facade and an infinity pool', location: 'a hillside above the sea', action: 'warm interior lights turn on one by one' },
      demo: true,
      preview: { scene: 'ocean', motion: 'zoom-in' }
    },
    {
      id: 'araba-yan-takip-01',
      title: 'Spor Araba: Yandan Takip',
      summary: 'Sahil yolunda ilerleyen arabayla aynı hızda, yandan paralel giden dinamik araç planı.',
      category: 'otomotiv',
      tool: 'Runway',
      date: '2026-10-20',
      ratio: '16:9',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\nvehicle tracking shot from the side. The camera moves parallel to the car at the same speed, keeping it centered while the background streaks past. Speed: fast and stable. End: continue alongside the car.\n\nShot:\nmedium wide shot, low angle, 50mm lens look. Horizontal 16:9, 5 seconds.\n\nScene:\nA dark red sports coupe drives along a coastal road with cliffs and sea in the background.\n\nLook:\nLighting: late afternoon sun with long shadows. Mood: energetic. Style: automotive commercial, motion blur on the background only.\n\nAvoid:\nwheels spinning backwards, deformed car body, logos.',
      steps: [
        'Runway\'de metinden videoya üretildi.',
        'Arka plan bulanıklığı istendi, araç gövdesi net tutuldu.'
      ],
      tags: ['araba', 'otomobil', 'tracking', 'sahil yolu', 'hız'],
      builder: { movement: 'vehicle-tracking', shot: 'medium-wide', angle: 'low', lens: '50', light: 'golden', mood: 'energetic', style: 'commercial', speed: 'fast', ratio: '16:9', duration: '5',
        subject: 'A dark red sports coupe', location: 'a coastal road with cliffs and sea', action: 'it drives fast along the road' },
      demo: true,
      preview: { scene: 'car', motion: 'pan-right' }
    },
    {
      id: 'portre-dolly-zoom-01',
      title: 'Portrede Dolly Zoom (Vertigo)',
      summary: 'Karakter sabit kalırken arka planın “esnediği”, gerilim anları için klasik etki.',
      category: 'kamera',
      tool: 'Higgsfield',
      date: '2026-10-16',
      ratio: '9:16',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\ndolly zoom (vertigo effect). The camera physically moves backward while the lens zooms in, so the subject keeps the same size while the background appears to stretch toward the viewer. Speed: slow and controlled. End: hold on the subject with a compressed background.\n\nShot:\nmedium close-up, eye-level angle. Vertical 9:16, 5 seconds.\n\nScene:\nA young woman stands still in a long hotel corridor, staring into the camera with a shocked expression.\n\nLook:\nLighting: warm practical wall lamps, low-key. Mood: tense, unsettling. Style: cinematic thriller.\n\nAvoid:\nchanging facial features, extra doors appearing, jitter.',
      steps: [
        'Higgsfield\'in hazır kamera hareketlerinden dolly zoom kullanıldı.',
        'Karakterin yüzü sabit kalsın diye "Avoid" bölümüne yüz değişimi eklendi.'
      ],
      tags: ['vertigo', 'dolly zoom', 'gerilim', 'portre', 'koridor'],
      builder: { movement: 'dolly-zoom', shot: 'medium-close', angle: 'eye', lens: '', light: 'practical', mood: 'tense', style: 'cinematic', speed: 'slow', ratio: '9:16', duration: '5',
        subject: 'A young woman with a shocked expression', location: 'a long hotel corridor', action: 'she stands still and stares into the camera' },
      demo: true,
      preview: { scene: 'interior', motion: 'dolly-out' }
    },
    {
      id: 'eski-fotograf-canlandirma-01',
      title: 'Eski Fotoğrafı Canlandırma',
      summary: 'Tek bir fotoğrafı ilk kare olarak kullanıp karakterlere küçük, doğal hareketler ekleme.',
      category: 'gorsel',
      tool: 'Kling',
      date: '2026-10-12',
      ratio: '4:5',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\nslow push in. The camera moves gently forward toward the people in the photo. Speed: very slow. End: finish slightly closer with the same composition.\n\nReference image:\nUse the uploaded photo as the first frame. Preserve faces, clothing, framing, grain and colors exactly.\n\nScene:\nThe people in the photo come to life with subtle natural motion: a soft smile, a blink, a slight head turn. Leaves move lightly in the wind.\n\nLook:\nMood: nostalgic, warm. Style: vintage film photograph, keep the original grain.\n\nAvoid:\nchanging faces, adding new people, modern objects, over-animated expressions.',
      steps: [
        'Kendi arşivinden bir fotoğraf seçildi (yalnızca izinli fotoğraflar kullanılmalı).',
        'Kling\'de ilk kare olarak yüklendi, hareketler bilerek küçük tutuldu.'
      ],
      tags: ['fotoğraf', 'canlandırma', 'nostalji', 'image to video', 'aile'],
      builder: { movement: 'push-in', shot: '', angle: '', lens: '', light: '', mood: 'nostalgic', style: 'vintage', speed: 'very-slow', ratio: '4:5', duration: '5', refImage: true,
        imageContext: 'an old family photo', subject: 'The people in the photo', location: '', action: 'they come to life with a soft smile, a blink and a slight head turn' },
      demo: true,
      preview: { scene: 'interior', motion: 'push-in' }
    },
    {
      id: 'orman-crane-01',
      title: 'Sisli Ormanda Vinç Yükselişi',
      summary: 'Yerdeki yürüyüşçüden ağaç tepelerinin üstüne çıkan, ölçeği büyüten açılış planı.',
      category: 'sinematik',
      tool: 'Luma',
      date: '2026-10-08',
      ratio: '16:9',
      duration: 8,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\ncrane up. The camera rises vertically from ground level, revealing more of the landscape as it climbs above the treetops. Speed: slow and graceful. End: finish high above the forest looking out over the valley.\n\nShot:\nwide shot transitioning to extreme wide, eye-level angle at the start. Horizontal 16:9, 8 seconds.\n\nScene:\nA lone hiker with a red backpack stands on a trail in a misty pine forest at dawn.\n\nLook:\nLighting: soft blue-hour light with rays breaking through the fog. Mood: epic, peaceful. Style: nature documentary, photoreal.\n\nAvoid:\ntrees merging into each other, flickering fog.',
      steps: [
        'Luma\'da metinden videoya üretildi.',
        'Açılış planı olarak kurgunun başına yerleştirildi.'
      ],
      tags: ['orman', 'sis', 'crane', 'vinç', 'doğa', 'açılış planı'],
      builder: { movement: 'crane-up', shot: 'wide', angle: 'eye', lens: '', light: 'blue-hour', mood: 'epic', style: 'documentary', speed: 'slow', ratio: '16:9', duration: '8',
        subject: 'A lone hiker with a red backpack', location: 'a misty pine forest at dawn', action: 'the hiker stands still on the trail' },
      demo: true,
      preview: { scene: 'forest', motion: 'crane-up' }
    },
    {
      id: 'kahve-makro-01',
      title: 'Kahve Fincanında Makro Dolly',
      summary: 'Köpüğe doğru yaklaşan makro plan; kafe ve gıda markaları için sosyal medya içeriği.',
      category: 'urun',
      tool: 'Runway',
      date: '2026-10-04',
      ratio: '9:16',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\ndolly in. The camera moves physically forward in a straight line toward the cup. Speed: slow. End: finish on the latte art filling the frame.\n\nShot:\nextreme close-up macro, high angle, macro lens look with very shallow depth of field. Vertical 9:16, 5 seconds.\n\nScene:\nA ceramic cup of latte with heart-shaped latte art on a wooden café table. Gentle steam rises.\n\nLook:\nLighting: soft window light from the left. Mood: cozy, warm. Style: food commercial, photoreal.\n\nAvoid:\nliquid behaving unnaturally, text, hands entering frame.',
      steps: [
        'Runway\'de metinden videoya üretildi.',
        'Makro his için lens ve alan derinliği ayrı belirtildi.'
      ],
      tags: ['kahve', 'makro', 'kafe', 'gıda', 'dolly in', 'ürün'],
      builder: { movement: 'dolly-in', shot: 'extreme-close', angle: 'high', lens: 'macro', light: 'window', mood: 'cozy', style: 'commercial', speed: 'slow', ratio: '9:16', duration: '5',
        subject: 'A ceramic cup of latte with heart-shaped latte art', location: 'a wooden café table', action: 'gentle steam rises from the cup' },
      demo: true,
      preview: { scene: 'studio', motion: 'zoom-in' }
    },
    {
      id: 'dunyadan-uzaya-01',
      title: 'Dünyadan Uzaya Zoom Out',
      summary: 'Bir karakterden başlayıp atmosferin dışına kadar uzaklaşan, hikâyeyi bağlayan geçiş efekti.',
      category: 'efekt',
      tool: 'Higgsfield',
      date: '2026-09-29',
      ratio: '9:16',
      duration: 8,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\nearth zoom out. Start on the subject from above, then pull back continuously through the city, the country and the atmosphere until the whole planet is visible. Speed: accelerating. End: finish on Earth floating in space.\n\nShot:\nstarts as a top-down close-up, ends as an extreme wide shot. Vertical 9:16, 8 seconds.\n\nScene:\nA person lying on the grass in a city park, looking up at the sky.\n\nLook:\nLighting: clear daylight. Mood: epic, reflective. Style: photoreal, satellite imagery look at higher altitudes.\n\nAvoid:\nhard cuts, sudden changes of location.',
      steps: [
        'Higgsfield\'in özel efekt hareketlerinden "earth zoom out" kullanıldı.',
        'Videonun sonu bir sonraki sahneye geçiş için kullanıldı.'
      ],
      tags: ['uzay', 'dünya', 'zoom out', 'geçiş', 'efekt'],
      builder: { movement: 'earth-zoom-out', shot: 'close-up', angle: 'top', lens: '', light: 'daylight', mood: 'epic', style: 'cinematic', speed: 'fast', ratio: '9:16', duration: '8',
        subject: 'A person', location: 'a city park', action: 'they lie on the grass and look up at the sky' },
      demo: true,
      preview: { scene: 'space', motion: 'dolly-out' }
    },
    {
      id: 'sef-handheld-01',
      title: 'Mutfakta Elde Kamera',
      summary: 'Hareketli bir restoran mutfağında belgesel hissi veren, elde taşınan kamera.',
      category: 'karakter',
      tool: 'Kling',
      date: '2026-09-24',
      ratio: '9:16',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\nhandheld shot. The camera is carried by an operator, with small natural sway and micro-adjustments while staying on the subject. Speed: medium. End: keep the subject framed.\n\nShot:\nmedium close-up, eye-level angle, 35mm lens look. Vertical 9:16, 5 seconds.\n\nScene:\nA chef in a white jacket flambés vegetables in a pan in a busy restaurant kitchen. Flames rise briefly.\n\nLook:\nLighting: warm overhead kitchen lights and fire glow. Mood: energetic. Style: documentary, natural colors.\n\nAvoid:\nexcessive shaking, extra hands, deformed utensils.',
      steps: [
        'Kling\'de metinden videoya üretildi.',
        'Sarsıntının abartılmaması için "excessive shaking" yasaklandı.'
      ],
      tags: ['şef', 'mutfak', 'handheld', 'belgesel', 'restoran'],
      builder: { movement: 'handheld', shot: 'medium-close', angle: 'eye', lens: '35', light: 'practical', mood: 'energetic', style: 'documentary', speed: 'medium', ratio: '9:16', duration: '5',
        subject: 'A chef in a white jacket', location: 'a busy restaurant kitchen', action: 'he flambés vegetables in a pan as flames rise briefly' },
      demo: true,
      preview: { scene: 'interior', motion: 'handheld' }
    },
    {
      id: 'whip-pan-gecis-01',
      title: 'Whip Pan ile Sahne Geçişi',
      summary: 'Hızlı savrulan kamerayla iki mekân arasında kesintisiz geçiş hissi.',
      category: 'gecis',
      tool: 'Runway',
      date: '2026-09-18',
      ratio: '9:16',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\nwhip pan right. The camera snaps quickly to the right with strong motion blur during the turn, then lands sharply on a new subject. Speed: very fast snap. End: settle on a clean, sharp final frame.\n\nShot:\nmedium shot, eye-level angle. Vertical 9:16, 5 seconds.\n\nScene:\nStart on a woman laughing at a café table; after the whip pan, land on the same woman walking on a beach at sunset.\n\nLook:\nMood: energetic, playful. Style: music video.\n\nAvoid:\nblurry final frame, face changing between locations.',
      steps: [
        'Runway\'de tek seferde iki mekânlı geçiş denendi.',
        'Kurguda bu klip iki ayrı sahnenin arasına yerleştirildi.'
      ],
      tags: ['whip pan', 'geçiş', 'transition', 'hızlı', 'klip'],
      builder: { movement: 'whip-right', shot: 'medium', angle: 'eye', lens: '', light: '', mood: 'energetic', style: 'music-video', speed: 'snap', ratio: '9:16', duration: '5',
        subject: 'A woman', location: 'a café table, then a beach at sunset', action: 'she laughs, then appears walking on the beach after the pan' },
      demo: true,
      preview: { scene: 'desert', motion: 'whip' }
    },
    {
      id: 'fpv-sehir-01',
      title: 'Şehir Üzerinde FPV Dalış',
      summary: 'Gökdelenlerin arasından süzülen, hız ve enerji katan FPV drone hareketi.',
      category: 'kamera',
      tool: 'Kling',
      date: '2026-09-12',
      ratio: '16:9',
      duration: 5,
      video: null, poster: null, instagram: null,
      prompt: 'Camera movement:\nFPV drone dive. The camera flies fast and close between buildings, banking smoothly through turns and diving toward the street. Speed: fast, fluid. End: level out just above the traffic.\n\nShot:\nwide shot, high angle turning to eye level, 14mm ultra-wide lens look. Horizontal 16:9, 5 seconds.\n\nScene:\nA dense modern city center with glass skyscrapers at dusk, traffic lights streaming below.\n\nLook:\nLighting: blue hour with city lights. Mood: energetic, epic. Style: cinematic, photoreal.\n\nAvoid:\nbuildings bending, collisions, sudden cuts.',
      steps: [
        'Kling\'de metinden videoya üretildi.',
        'Hız hissini artırmak için ultra geniş lens tarif edildi.'
      ],
      tags: ['fpv', 'drone', 'şehir', 'gökdelen', 'hız'],
      builder: { movement: 'fpv', shot: 'wide', angle: 'high', lens: '14', light: 'blue-hour', mood: 'energetic', style: 'cinematic', speed: 'fast', ratio: '16:9', duration: '5',
        subject: '', location: 'a dense modern city center with glass skyscrapers at dusk', action: 'traffic lights stream on the streets below' },
      demo: true,
      preview: { scene: 'neon', motion: 'fpv' }
    }
  ]
};
