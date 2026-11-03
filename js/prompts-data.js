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
   poster    : 'assets/img/promptlar/<id>.jpg'    (yoksa null)
   instagram : gönderinin gerçek adresi (yoksa null)
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
    { id: 'kamera',   name: 'Kamera Hareketleri' },
    { id: 'sinematik', name: 'Sinematik Sahneler' },
    { id: 'urun',     name: 'Ürün & Reklam' },
    { id: 'karakter', name: 'Karakter & İnsan' },
    { id: 'mekan',    name: 'Araç & Mekân' },
    { id: 'gorsel',   name: 'Görselden Videoya' },
    { id: 'efekt',    name: 'Efekt & Geçişler' }
  ],

  prompts: [
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
      category: 'mekan',
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
      category: 'mekan',
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
      category: 'efekt',
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
