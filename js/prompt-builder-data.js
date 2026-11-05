/* ============================================================
   PROMPT OLUŞTURUCU — SEÇENEK VERİLERİ
   Her seçenek hem Türkçe (arayüz + Türkçe çıktı) hem İngilizce
   (video modelleri için önerilen çıktı) metin içerir.
   Yeni seçenek eklemek için ilgili listeye bir satır eklemek yeterlidir.
   ============================================================ */
window.PROMPT_BUILDER = {

  // ---------- KAMERA HAREKETLERİ ----------
  // speed: hareketin varsayılan hızı (aşağıdaki "speed" listesindeki id)
  movementGroups: [
    { id: 'sabit',   name: 'Sabit & Pan/Tilt' },
    { id: 'zoom',    name: 'Zoom & Lens' },
    { id: 'dolly',   name: 'Dolly & Takip' },
    { id: 'yorunge', name: 'Yörünge' },
    { id: 'vinc',    name: 'Vinç & Drone' },
    { id: 'insan',   name: 'İnsan Kamerası' },
    { id: 'ozel',    name: 'Özel Efektler' }
  ],

  movements: [
    // Sabit & Pan/Tilt
    { id: 'static', group: 'sabit', speed: 'very-slow',
      tr: { name: 'Sabit plan', desc: 'Kamera tüm klip boyunca aynı konumda, aynı açı ve kadrajla sabit kalır; hareketi yalnızca sahne yapar.' },
      en: { name: 'locked-off static shot', desc: 'The camera stays in one fixed position for the whole clip with the same angle, height and framing; only the scene moves.' } },
    { id: 'pan-right', group: 'sabit', speed: 'medium',
      tr: { name: 'Sağa pan', desc: 'Kamera yerinde durarak yatay olarak soldan sağa döner; ufuk düz kalır ve yeni alan sağdan kadraja girer.' },
      en: { name: 'pan right', desc: 'The camera rotates horizontally from left to right on a fixed point, keeping the horizon level as new space enters from the right.' } },
    { id: 'pan-left', group: 'sabit', speed: 'medium',
      tr: { name: 'Sola pan', desc: 'Kamera yerinde durarak yatay olarak sağdan sola döner; ufuk düz kalır ve yeni alan soldan kadraja girer.' },
      en: { name: 'pan left', desc: 'The camera rotates horizontally from right to left on a fixed point, keeping the horizon level as new space enters from the left.' } },
    { id: 'whip-right', group: 'sabit', speed: 'snap',
      tr: { name: 'Sağa whip pan', desc: 'Kamera sağa çok hızlı savrulur, dönüş sırasında belirgin hareket bulanıklığı oluşur ve yeni bir hedefe net biçimde oturur.' },
      en: { name: 'whip pan right', desc: 'The camera snaps quickly to the right with strong motion blur during the turn, then lands sharply on a new target.' } },
    { id: 'whip-left', group: 'sabit', speed: 'snap',
      tr: { name: 'Sola whip pan', desc: 'Kamera sola çok hızlı savrulur, dönüş sırasında belirgin hareket bulanıklığı oluşur ve yeni bir hedefe net biçimde oturur.' },
      en: { name: 'whip pan left', desc: 'The camera snaps quickly to the left with strong motion blur during the turn, then lands sharply on a new target.' } },
    { id: 'tilt-up', group: 'sabit', speed: 'medium',
      tr: { name: 'Yukarı tilt', desc: 'Kamera sabit bir noktadan yukarı doğru eğilir; dikey konuyu ortada tutarak üst noktada durur.' },
      en: { name: 'tilt up', desc: 'The camera tilts upward from a fixed point, keeping the vertical subject centered, and stops on the upper target.' } },
    { id: 'tilt-down', group: 'sabit', speed: 'medium',
      tr: { name: 'Aşağı tilt', desc: 'Kamera sabit bir noktadan aşağı doğru eğilir ve alttaki hedefte durur.' },
      en: { name: 'tilt down', desc: 'The camera tilts downward from a fixed point and stops on the lower target.' } },

    // Zoom & Lens
    { id: 'zoom-in', group: 'zoom', speed: 'slow',
      tr: { name: 'Yavaş zoom in', desc: 'Kamera yerinden kıpırdamadan objektifle konuya yaklaşır; perspektif değişmez.' },
      en: { name: 'slow zoom in', desc: 'The lens zooms in toward the subject while the camera body stays in place, so perspective does not change.' } },
    { id: 'zoom-out', group: 'zoom', speed: 'slow',
      tr: { name: 'Yavaş zoom out', desc: 'Kamera yerinden kıpırdamadan objektifle uzaklaşır ve çevre kadraja girer.' },
      en: { name: 'slow zoom out', desc: 'The lens zooms out while the camera body stays in place, revealing more of the surroundings.' } },
    { id: 'crash-zoom-in', group: 'zoom', speed: 'snap',
      tr: { name: 'Crash zoom in', desc: 'Objektif ani ve sert biçimde konuya zoom yapar; vurgu ve şaşkınlık anları için.' },
      en: { name: 'crash zoom in', desc: 'A sudden, aggressive zoom in onto the subject for emphasis.' } },
    { id: 'dolly-zoom', group: 'zoom', speed: 'slow',
      tr: { name: 'Dolly zoom (Vertigo)', desc: 'Kamera geriye giderken objektif zoom yapar; konu aynı boyutta kalır, arka plan esniyormuş gibi görünür.' },
      en: { name: 'dolly zoom (vertigo effect)', desc: 'The camera moves backward while the lens zooms in, so the subject keeps the same size while the background appears to stretch.' } },
    { id: 'rack-focus', group: 'zoom', speed: 'slow',
      tr: { name: 'Odak kaydırma', desc: 'Kamera sabit kalır; netlik ön plandaki nesneden arka plandaki konuya kayar.' },
      en: { name: 'rack focus', desc: 'The camera stays still while focus shifts smoothly from the foreground object to the subject in the background.' } },

    { id: 'fast-zoom-in', group: 'zoom', speed: 'fast',
      tr: { name: 'Hızlı zoom in', desc: 'Objektif hızlı ama kontrollü biçimde konuya yaklaşır; kamera yerinde kalır.' },
      en: { name: 'fast zoom in', desc: 'The lens quickly closes on the subject while the camera body stays in place.' } },
    { id: 'fast-zoom-out', group: 'zoom', speed: 'fast',
      tr: { name: 'Hızlı zoom out', desc: 'Objektif hızlıca geniş açıya açılır ve çevre kadraja girer; kamera yerinde kalır.' },
      en: { name: 'fast zoom out', desc: 'The lens quickly widens to reveal the surroundings while the camera body stays in place.' } },
    { id: 'crash-zoom-out', group: 'zoom', speed: 'snap',
      tr: { name: 'Crash zoom out', desc: 'Objektif ani ve sert biçimde konudan uzaklaşır; şaşırtıcı bir açılış verir.' },
      en: { name: 'crash zoom out', desc: 'A sudden, aggressive zoom away from the subject.' } },

    // Dolly & Takip
    { id: 'push-in', group: 'dolly', speed: 'very-slow',
      tr: { name: 'Yavaş yaklaşma (push in)', desc: 'Kamera konuya doğru çok yumuşak biçimde ileri kayar; kompozisyon korunur.' },
      en: { name: 'slow push in', desc: 'The camera glides gently forward toward the subject while keeping the composition.' } },
    { id: 'dolly-in', group: 'dolly', speed: 'slow',
      tr: { name: 'Dolly in', desc: 'Kamera fiziksel olarak düz bir çizgide konuya doğru ilerler; yükseklik ve lens yönü sabit kalır.' },
      en: { name: 'dolly in', desc: 'The camera physically moves forward in a straight line toward the subject, keeping height and lens direction constant.' } },
    { id: 'dolly-out', group: 'dolly', speed: 'slow',
      tr: { name: 'Dolly out', desc: 'Kamera fiziksel olarak düz bir çizgide geri çekilir; daha fazla çevre kadraja girer.' },
      en: { name: 'dolly out', desc: 'The camera physically moves backward in a straight line, revealing more of the environment.' } },
    { id: 'truck-right', group: 'dolly', speed: 'medium',
      tr: { name: 'Sağa kayma (truck)', desc: 'Kamera yönünü değiştirmeden yana, sağa doğru kayar; ön ve arka plan arasında paralaks oluşur.' },
      en: { name: 'truck right', desc: 'The camera slides sideways to the right without changing direction, creating parallax between foreground and background.' } },
    { id: 'truck-left', group: 'dolly', speed: 'medium',
      tr: { name: 'Sola kayma (truck)', desc: 'Kamera yönünü değiştirmeden yana, sola doğru kayar; ön ve arka plan arasında paralaks oluşur.' },
      en: { name: 'truck left', desc: 'The camera slides sideways to the left without changing direction, creating parallax between foreground and background.' } },
    { id: 'follow-behind', group: 'dolly', speed: 'medium',
      tr: { name: 'Arkadan takip', desc: 'Kamera konunun arkasında omuz hizasında, onun hızıyla ilerler; önündeki yol okunur kalır.' },
      en: { name: 'follow shot from behind', desc: 'The camera travels behind the subject at shoulder height, matching their pace, with the path ahead staying readable.' } },
    { id: 'lead-front', group: 'dolly', speed: 'medium',
      tr: { name: 'Önden geri geri takip', desc: 'Kamera konunun önünde, ona bakarak geriye doğru ilerler; konu hep aynı mesafede kalır.' },
      en: { name: 'reverse tracking shot', desc: 'The camera moves backward in front of the subject, facing them, keeping a constant distance as they walk toward it.' } },
    { id: 'side-tracking', group: 'dolly', speed: 'medium',
      tr: { name: 'Yandan takip', desc: 'Kamera konuya paralel, aynı hızda yandan ilerler; arka plan akıp gider.' },
      en: { name: 'side tracking shot', desc: 'The camera moves parallel to the subject at the same speed, with the background flowing past.' } },
    { id: 'vehicle-tracking', group: 'dolly', speed: 'fast',
      tr: { name: 'Araç takibi', desc: 'Kamera ilerleyen araçla aynı hızda, yanından paralel gider; araç kadrajın ortasında kalır.' },
      en: { name: 'vehicle tracking shot', desc: 'The camera moves parallel to the moving vehicle at the same speed, keeping it centered while the background streaks past.' } },
    { id: 'low-tracking', group: 'dolly', speed: 'medium',
      tr: { name: 'Yere yakın takip', desc: 'Kamera zemine çok yakın, alçaktan konuyu takip eder; ayak ve zemin dokusu ön plandadır.' },
      en: { name: 'low tracking shot', desc: 'The camera tracks the subject from just above the ground, with the ground texture in the foreground.' } },

    { id: 'slider-right', group: 'dolly', speed: 'slow',
      tr: { name: 'Sağa slider', desc: 'Kamera kısa bir ray üzerinde sağa, küçük ve hassas biçimde kayar; hafif paralaks oluşur.' },
      en: { name: 'short slider move right', desc: 'A small, precise lateral glide to the right with subtle parallax.' } },
    { id: 'slider-left', group: 'dolly', speed: 'slow',
      tr: { name: 'Sola slider', desc: 'Kamera kısa bir ray üzerinde sola, küçük ve hassas biçimde kayar; hafif paralaks oluşur.' },
      en: { name: 'short slider move left', desc: 'A small, precise lateral glide to the left with subtle parallax.' } },
    { id: 'pass-by', group: 'dolly', speed: 'medium',
      tr: { name: 'Yanından geçiş', desc: 'Kamera konunun hemen yanından geçer ve yoluna devam eder.' },
      en: { name: 'pass-by shot', desc: 'The camera moves past the subject in close proximity and continues forward.' } },
    { id: 'chase', group: 'dolly', speed: 'fast',
      tr: { name: 'Kovalama', desc: 'Kamera hareket eden konuyu yüksek hızda, gergin bir enerjiyle kovalar.' },
      en: { name: 'chase shot', desc: 'The camera pursues the moving subject at high speed with urgent energy.' } },
    { id: 'foreground-reveal', group: 'dolly', speed: 'slow',
      tr: { name: 'Ön plandan açılış', desc: 'Kamera ön plandaki bir nesnenin arkasından çıkarak sahneyi ortaya çıkarır.' },
      en: { name: 'foreground reveal', desc: 'The camera moves out from behind a foreground object to unveil the scene.' } },

    // Yörünge
    { id: 'arc-right', group: 'yorunge', speed: 'slow',
      tr: { name: 'Sağa yay (arc)', desc: 'Kamera konunun etrafında sağa doğru yarım bir yay çizer; konu kadrajın ortasında kalır.' },
      en: { name: 'arc right', desc: 'The camera moves along a partial arc to the right around the subject, keeping it centered.' } },
    { id: 'arc-left', group: 'yorunge', speed: 'slow',
      tr: { name: 'Sola yay (arc)', desc: 'Kamera konunun etrafında sola doğru yarım bir yay çizer; konu kadrajın ortasında kalır.' },
      en: { name: 'arc left', desc: 'The camera moves along a partial arc to the left around the subject, keeping it centered.' } },
    { id: 'orbit-cw', group: 'yorunge', speed: 'slow',
      tr: { name: 'Saat yönünde yörünge', desc: 'Kamera konunun etrafında sabit yarıçaplı bir çember üzerinde saat yönünde döner; konu ortada kilitli kalır.' },
      en: { name: 'orbit clockwise', desc: 'The camera circles the subject clockwise on a constant radius, keeping it locked in the center of frame.' } },
    { id: 'orbit-ccw', group: 'yorunge', speed: 'slow',
      tr: { name: 'Saat yönü tersine yörünge', desc: 'Kamera konunun etrafında sabit yarıçaplı bir çember üzerinde saat yönünün tersine döner.' },
      en: { name: 'orbit counterclockwise', desc: 'The camera circles the subject counterclockwise on a constant radius, keeping it centered.' } },

    { id: 'ascending-orbit', group: 'yorunge', speed: 'medium',
      tr: { name: 'Spiral yükseliş', desc: 'Kamera konunun etrafında dönerek spiral biçimde yükselir.' },
      en: { name: 'ascending orbit', desc: 'The camera spirals upward around the subject.' } },

    // Vinç & Drone
    { id: 'pedestal-up', group: 'vinc', speed: 'slow',
      tr: { name: 'Dikey yükselme (pedestal)', desc: 'Kamera açısını değiştirmeden dikey olarak yükselir.' },
      en: { name: 'pedestal up', desc: 'The camera rises straight up without changing its angle.' } },
    { id: 'crane-up', group: 'vinc', speed: 'slow',
      tr: { name: 'Vinç yükselişi', desc: 'Kamera yerden yükselir, tırmandıkça manzaranın daha büyük kısmını açar.' },
      en: { name: 'crane up', desc: 'The camera rises from ground level, revealing more of the landscape as it climbs.' } },
    { id: 'crane-down', group: 'vinc', speed: 'slow',
      tr: { name: 'Vinç inişi', desc: 'Kamera yüksekten konuya doğru alçalır ve göz hizasına iner.' },
      en: { name: 'crane down', desc: 'The camera descends from high above toward the subject and settles at eye level.' } },
    { id: 'drone-push', group: 'vinc', speed: 'slow',
      tr: { name: 'Drone ile yaklaşma', desc: 'Hava kamerası hedefe doğru ileri ve hafifçe aşağı süzülür; ufuk düz kalır.' },
      en: { name: 'drone push in', desc: 'The aerial camera glides forward and slightly down toward the target, keeping the horizon level.' } },
    { id: 'drone-pull', group: 'vinc', speed: 'slow',
      tr: { name: 'Drone ile uzaklaşma', desc: 'Hava kamerası geriye ve yukarı çekilerek konuyu geniş çevresi içinde gösterir.' },
      en: { name: 'drone pull back', desc: 'The aerial camera pulls back and up, revealing the subject within its wider surroundings.' } },
    { id: 'flyover', group: 'vinc', speed: 'medium',
      tr: { name: 'Üzerinden uçuş', desc: 'Hava kamerası konunun üzerinden geçerek ilerler; yüksek ve geniş bir bakış sunar.' },
      en: { name: 'aerial flyover', desc: 'The aerial camera flies over the subject, giving a high, wide view as it passes.' } },

    { id: 'pedestal-down', group: 'vinc', speed: 'slow',
      tr: { name: 'Dikey alçalma (pedestal)', desc: 'Kamera açısını değiştirmeden dikey olarak alçalır.' },
      en: { name: 'pedestal down', desc: 'The camera lowers straight down without changing its angle.' } },
    { id: 'helicopter', group: 'vinc', speed: 'medium',
      tr: { name: 'Helikopter çekimi', desc: 'Kamera yüksek irtifadan, sabit ve geniş bir havadan hareket yapar.' },
      en: { name: 'helicopter shot', desc: 'A stable, high-altitude aerial move over a wide landscape.' } },
    { id: 'aerial-orbit', group: 'vinc', speed: 'slow',
      tr: { name: 'Havadan yörünge', desc: 'Drone yapının etrafında sabit yükseklik ve yarıçapta döner.' },
      en: { name: 'aerial orbit', desc: 'The drone circles the structure at a constant altitude and radius.' } },
    { id: 'top-down-drift', group: 'vinc', speed: 'slow',
      tr: { name: 'Tepeden süzülme', desc: 'Kamera tam tepeden bakarken yana doğru yavaşça kayar.' },
      en: { name: 'top-down drift', desc: 'A slow lateral move from directly overhead.' } },

    // İnsan kamerası
    { id: 'handheld', group: 'insan', speed: 'medium',
      tr: { name: 'Elde kamera', desc: 'Kamera bir operatör tarafından taşınır; doğal, hafif salınımlar olur ama konu kadrajda kalır.' },
      en: { name: 'handheld shot', desc: 'The camera is carried by an operator, with small natural sway and micro-adjustments while staying on the subject.' } },
    { id: 'snorricam', group: 'insan', speed: 'medium',
      tr: { name: 'Vücuda bağlı kamera', desc: 'Kamera karaktere bağlıdır; yüz kadrajda sabit kalırken arka plan sallanır ve akar.' },
      en: { name: 'body-mounted camera (snorricam)', desc: 'The camera is rigged to the character, so their face stays fixed in frame while the background sways and moves.' } },
    { id: 'pov', group: 'insan', speed: 'medium',
      tr: { name: 'Birinci şahıs (POV)', desc: 'Kamera karakterin gözünden bakar; ellerin ve yürüyüşün doğal hareketi hissedilir.' },
      en: { name: 'first-person POV', desc: 'The camera sees through the character\'s eyes, with natural hand and walking motion.' } },
    { id: 'fpv', group: 'insan', speed: 'fast',
      tr: { name: 'FPV drone', desc: 'Kamera nesnelerin arasından hızlı ve yakın uçar, dönüşlerde yumuşakça yatar ve dalış yapar.' },
      en: { name: 'FPV drone flight', desc: 'The camera flies fast and close between objects, banking smoothly through turns and diving.' } },

    { id: 'steadicam', group: 'insan', speed: 'slow',
      tr: { name: 'Steadicam yürüyüş', desc: 'Kamera göz hizasında mekânın içinden akıcı biçimde süzülerek ilerler.' },
      en: { name: 'steadicam walkthrough', desc: 'A smooth gliding walk through the space at eye level.' } },

    // Özel efektler
    { id: 'pass-through', group: 'ozel', speed: 'medium',
      tr: { name: 'Nesnenin içinden geçiş', desc: 'Kamera bir pencere, kapı ya da boşluğun içinden geçerek yeni alana süzülür.' },
      en: { name: 'pass-through shot', desc: 'The camera flies through a window, doorway or gap into the next space.' } },
    { id: 'infinite-zoom', group: 'ozel', speed: 'medium',
      tr: { name: 'Sonsuz zoom', desc: 'Kamera merkezdeki hedefe kesintisiz yaklaşır ve içinden yeni bir dünya açılır.' },
      en: { name: 'infinite zoom', desc: 'The camera zooms continuously into the center target until a new world opens inside it.' } },
    { id: 'earth-zoom-out', group: 'ozel', speed: 'fast',
      tr: { name: 'Dünyadan uzaya zoom out', desc: 'Konudan başlayıp şehir, ülke ve atmosferin dışına kadar kesintisiz uzaklaşır.' },
      en: { name: 'earth zoom out', desc: 'Start on the subject from above and pull back continuously through the city, the country and the atmosphere until the planet is visible.' } },
    { id: 'timelapse', group: 'ozel', speed: 'medium',
      tr: { name: 'Time-lapse', desc: 'Kamera sabit kalır; zaman hızlanır, ışık, bulutlar ve kalabalık hızla değişir.' },
      en: { name: 'time-lapse', desc: 'The camera stays fixed while time speeds up; light, clouds and crowds change rapidly.' } },
    { id: 'tilt-shift', group: 'ozel', speed: 'slow',
      tr: { name: 'Tilt-shift (minyatür)', desc: 'Yüksekten bakan kamera, dar netlik alanıyla sahneyi minyatür maket gibi gösterir.' },
      en: { name: 'tilt-shift miniature look', desc: 'A high viewpoint with a narrow band of focus makes the scene look like a miniature model.' } },
    { id: 'barrel-roll', group: 'ozel', speed: 'medium',
      tr: { name: 'Kamera döndürme', desc: 'Kamera ilerlerken kendi lens ekseni etrafında döner.' },
      en: { name: 'barrel roll', desc: 'The camera rotates around its lens axis while moving forward.' } },
    { id: 'bullet-time', group: 'ozel', speed: 'slow',
      tr: { name: 'Zaman dondurma', desc: 'Aksiyon donarken kamera konunun etrafında yay çizer.' },
      en: { name: 'bullet time', desc: 'The action freezes while the camera arcs around the subject.' } },
    { id: 'macro-sweep', group: 'ozel', speed: 'very-slow',
      tr: { name: 'Makro gezinme', desc: 'Kamera yüzey detaylarının üzerinde çok sığ alan derinliğiyle yavaşça süzülür.' },
      en: { name: 'macro sweep', desc: 'A slow glide across surface details with very shallow depth of field.' } }
  ],

  // Aramada Türkçe/İngilizce eş anlamlılar ve "Popüler" filtresi
  moveAliases: {
    'static': 'sabit tripod locked', 'dolly-zoom': 'vertigo hitchcock', 'orbit-cw': 'yörünge dönme etrafında 360', 'orbit-ccw': 'yörünge dönme etrafında 360',
    'follow-behind': 'omuz üstü over the shoulder ots takip', 'lead-front': 'walk and talk yürüyüş', 'side-tracking': 'tracking takip', 'vehicle-tracking': 'araba otomobil tracking',
    'fpv': 'drone dalış', 'pov': 'first person gözünden', 'crane-up': 'jib', 'crane-down': 'jib', 'flyover': 'havadan', 'rack-focus': 'netlik odak', 'timelapse': 'hızlandırılmış zaman',
    'chase': 'kovalamaca takip araba', 'pass-by': 'push past', 'helicopter': 'havadan aerial', 'aerial-orbit': 'drone yörünge', 'ascending-orbit': 'spiral dönerek yükselme',
    'top-down-drift': 'kuş bakışı overhead', 'bullet-time': 'matrix dondurma', 'barrel-roll': 'dönüş roll', 'macro-sweep': 'ürün detay yakın', 'steadicam': 'gimbal iç mekan yürüyerek gezinti',
    'slider-right': 'ray kayma', 'slider-left': 'ray kayma', 'foreground-reveal': 'açılış reveal perde'
  },
  popularMoves: ['push-in', 'dolly-in', 'orbit-cw', 'drone-push', 'fpv', 'crane-up', 'whip-right', 'handheld', 'dolly-zoom', 'ascending-orbit', 'side-tracking', 'static'],

  // ---------- TÜRKÇE HAZIR SAHNE SEÇENEKLERİ ----------
  // Kullanıcı Türkçesini seçer; İngilizce çıktıda "en" karşılığı yazılır.
  phrases: {
    subject: [
      { tr: 'Kırmızı paltolu bir kadın', en: 'A woman in a red coat' },
      { tr: 'Takım elbiseli bir adam', en: 'A man in a tailored suit' },
      { tr: 'Genç bir kadın', en: 'A young woman' },
      { tr: 'Yaşlı bir adam', en: 'An elderly man' },
      { tr: 'Küçük bir çocuk', en: 'A small child' },
      { tr: 'Lüks bir spor araba', en: 'A luxury sports car' },
      { tr: 'Klasik bir araba', en: 'A classic car' },
      { tr: 'Modern bir konut binası', en: 'A modern residential building' },
      { tr: 'Lüks bir villa', en: 'A luxury villa' },
      { tr: 'Parfüm şişesi', en: 'A glass perfume bottle' },
      { tr: 'Cilt bakım serumu', en: 'A skincare serum bottle' },
      { tr: 'Bir fincan kahve', en: 'A cup of coffee' },
      { tr: 'Spor ayakkabı', en: 'A pair of sneakers' },
      { tr: 'Akıllı telefon', en: 'A smartphone' }
    ],
    location: [
      { tr: 'Aydınlık bir otel lobisi', en: 'a bright hotel lobby' },
      { tr: 'Gece vakti yağmurlu bir şehir sokağı', en: 'a rainy city street at night' },
      { tr: 'Boş bir inşaat arsası', en: 'an empty construction plot' },
      { tr: 'Şehir manzaralı bir çatı katı', en: 'a rooftop overlooking the city' },
      { tr: 'Modern bir daire', en: 'a modern apartment' },
      { tr: 'Minimal siyah bir stüdyo', en: 'a minimal black studio' },
      { tr: 'Beyaz bir fotoğraf stüdyosu', en: 'a white photo studio' },
      { tr: 'Sisli bir çam ormanı', en: 'a misty pine forest' },
      { tr: 'Gün batımında bir sahil', en: 'a beach at sunset' },
      { tr: 'Virajlı bir dağ yolu', en: 'a winding mountain road' },
      { tr: 'Tarihî bir sokak', en: 'a historic old-town street' },
      { tr: 'Sıcak bir kafe', en: 'a cozy café' },
      { tr: 'Lüks bir restoran', en: 'an upscale restaurant' },
      { tr: 'Büyük bir fabrika', en: 'a large industrial factory' }
    ],
    action: [
      { tr: 'Kameraya doğru yürüyor', en: 'the subject walks slowly toward the camera' },
      { tr: 'Yavaşça başını çevirip kameraya bakıyor', en: 'the subject slowly turns and looks into the camera' },
      { tr: 'Sessizce bekliyor ve etrafına bakıyor', en: 'the subject waits silently and looks around' },
      { tr: 'Gülümsüyor', en: 'the subject smiles naturally' },
      { tr: 'Ürünü kameraya gösteriyor', en: 'the subject presents the product to the camera' },
      { tr: 'Ürün yavaşça kendi etrafında dönüyor', en: 'the product rotates slowly on its axis' },
      { tr: 'Üzerinde ışık yavaşça geziniyor', en: 'soft light sweeps slowly across the surface' },
      { tr: 'Araba yüksek hızla ilerliyor', en: 'the car speeds forward along the road' },
      { tr: 'Bina kat kat yükseliyor', en: 'the building rises floor by floor' },
      { tr: 'Işıklar tek tek yanıyor', en: 'the lights turn on one by one' },
      { tr: 'Rüzgâr saçlarını ve kıyafetini dalgalandırıyor', en: 'the wind gently moves the hair and clothing' },
      { tr: 'İnsanlar arka planda akıp gidiyor', en: 'people flow past in the background' }
    ]
  },

  // ---------- DİĞER PARAMETRELER ----------
  // Her grup: id, label (arayüz), hint (yardım metni), options [{ id, tr, en }]
  groups: [
    { id: 'shot', label: 'Çekim ölçeği', hint: 'Konunun kadrajda ne kadar yer kapladığı',
      options: [
        { id: 'extreme-wide', tr: 'çok geniş plan', en: 'extreme wide shot' },
        { id: 'wide', tr: 'geniş plan', en: 'wide shot' },
        { id: 'medium-wide', tr: 'orta-geniş plan', en: 'medium wide shot' },
        { id: 'medium', tr: 'orta plan', en: 'medium shot' },
        { id: 'medium-close', tr: 'yakın-orta plan', en: 'medium close-up' },
        { id: 'close-up', tr: 'yakın plan', en: 'close-up' },
        { id: 'extreme-close', tr: 'çok yakın / makro plan', en: 'extreme close-up' }
      ] },
    { id: 'angle', label: 'Kamera açısı', hint: 'Kameranın konuya hangi yükseklikten baktığı',
      options: [
        { id: 'eye', tr: 'göz hizası', en: 'eye-level angle' },
        { id: 'low', tr: 'alt açı', en: 'low angle' },
        { id: 'high', tr: 'üst açı', en: 'high angle' },
        { id: 'top', tr: 'tam tepeden (kuş bakışı)', en: 'top-down bird\'s-eye view' },
        { id: 'worm', tr: 'yerden (solucan bakışı)', en: 'worm\'s-eye view' },
        { id: 'dutch', tr: 'yatık (dutch) açı', en: 'dutch angle' },
        { id: 'ots', tr: 'omuz üstü', en: 'over-the-shoulder angle' }
      ] },
    { id: 'lens', label: 'Lens', hint: 'Perspektif ve alan derinliği hissi',
      options: [
        { id: '14', tr: '14mm ultra geniş açı', en: '14mm ultra-wide lens look' },
        { id: '24', tr: '24mm geniş açı', en: '24mm wide lens look' },
        { id: '35', tr: '35mm', en: '35mm lens look' },
        { id: '50', tr: '50mm', en: '50mm lens look' },
        { id: '85', tr: '85mm, sığ alan derinliği', en: '85mm lens look with shallow depth of field' },
        { id: '135', tr: '135mm tele', en: '135mm telephoto lens look with compressed background' },
        { id: 'macro', tr: 'makro lens', en: 'macro lens look with very shallow depth of field' },
        { id: 'anamorphic', tr: 'anamorfik, yatay flare', en: 'anamorphic lens look with horizontal flares' }
      ] },
    { id: 'light', label: 'Işıklandırma', hint: 'Sahnenin ışık kaynağı ve karakteri',
      options: [
        { id: 'golden', tr: 'gün batımı (altın saat)', en: 'golden hour sunlight' },
        { id: 'blue-hour', tr: 'mavi saat', en: 'soft blue-hour light' },
        { id: 'daylight', tr: 'açık gün ışığı', en: 'clear natural daylight' },
        { id: 'overcast', tr: 'bulutlu, yumuşak ışık', en: 'soft overcast light' },
        { id: 'window', tr: 'pencereden gelen yumuşak ışık', en: 'soft window light' },
        { id: 'neon', tr: 'neon ışıklar', en: 'magenta and cyan neon light with soft haze' },
        { id: 'rim', tr: 'arka kontur ışığı (rim)', en: 'hard rim lights with crisp reflections' },
        { id: 'practical', tr: 'mekândaki lambalar', en: 'warm practical lamps' },
        { id: 'low-key', tr: 'karanlık, yüksek kontrast', en: 'low-key, high-contrast lighting' },
        { id: 'high-key', tr: 'aydınlık stüdyo', en: 'bright high-key studio lighting' },
        { id: 'candle', tr: 'mum ışığı', en: 'flickering candlelight' }
      ] },
    { id: 'mood', label: 'Atmosfer', hint: 'Videonun vermesi gereken duygu',
      options: [
        { id: 'peaceful', tr: 'huzurlu', en: 'peaceful' },
        { id: 'cozy', tr: 'sıcak, samimi', en: 'cozy and warm' },
        { id: 'luxurious', tr: 'lüks, sakin', en: 'luxurious and calm' },
        { id: 'energetic', tr: 'enerjik', en: 'energetic' },
        { id: 'epic', tr: 'epik', en: 'epic' },
        { id: 'tense', tr: 'gerilimli', en: 'tense' },
        { id: 'mysterious', tr: 'gizemli', en: 'mysterious' },
        { id: 'nostalgic', tr: 'nostaljik', en: 'nostalgic' },
        { id: 'romantic', tr: 'romantik', en: 'romantic' },
        { id: 'melancholic', tr: 'melankolik', en: 'melancholic' },
        { id: 'playful', tr: 'eğlenceli', en: 'playful' }
      ] },
    { id: 'style', label: 'Görsel stil', hint: 'Genel görüntü dili',
      options: [
        { id: 'cinematic', tr: 'sinematik, gerçekçi', en: 'cinematic, photoreal' },
        { id: 'commercial', tr: 'reklam filmi', en: 'high-end commercial, photoreal' },
        { id: 'documentary', tr: 'belgesel', en: 'documentary, natural colors' },
        { id: 'film', tr: '35mm film greni', en: 'cinematic with 35mm film grain' },
        { id: 'vintage', tr: 'eski fotoğraf / vintage', en: 'vintage film photograph look' },
        { id: 'music-video', tr: 'müzik klibi', en: 'music video' },
        { id: 'noir', tr: 'kara film (siyah-beyaz)', en: 'black-and-white film noir' },
        { id: '3d', tr: 'stilize 3D animasyon', en: 'stylized 3D animation' },
        { id: 'anime', tr: 'anime', en: 'anime style' }
      ] },
    { id: 'speed', label: 'Hareket hızı', hint: 'Boş bırakılırsa hareketin doğal hızı kullanılır',
      options: [
        { id: 'very-slow', tr: 'çok yavaş ve yumuşak', en: 'very slow and gentle' },
        { id: 'slow', tr: 'yavaş ve akıcı', en: 'slow and smooth' },
        { id: 'medium', tr: 'dengeli, sabit tempo', en: 'steady, medium pace' },
        { id: 'fast', tr: 'hızlı ve dinamik', en: 'fast and dynamic' },
        { id: 'snap', tr: 'çok hızlı, ani', en: 'very fast snap' }
      ] },
    { id: 'ratio', label: 'Video formatı', hint: 'Instagram Reels / TikTok için 9:16',
      options: [
        { id: '9:16', tr: 'dikey 9:16', en: 'vertical 9:16' },
        { id: '16:9', tr: 'yatay 16:9', en: 'horizontal 16:9' },
        { id: '1:1', tr: 'kare 1:1', en: 'square 1:1' },
        { id: '4:5', tr: 'dikey 4:5', en: 'vertical 4:5' },
        { id: '21:9', tr: 'sinemaskop 21:9', en: 'cinemascope 21:9' }
      ] },
    { id: 'duration', label: 'Süre', hint: 'Araçların çoğu 5 veya 10 saniye üretir',
      options: [
        { id: '5', tr: '5 saniye', en: '5 seconds' },
        { id: '8', tr: '8 saniye', en: '8 seconds' },
        { id: '10', tr: '10 saniye', en: '10 seconds' }
      ] }
  ],

  // ---------- KAÇINILACAKLAR (negatif talimatlar) ----------
  avoid: [
    { id: 'text',   tr: 'yazı, logo ve filigran', en: 'text, logos, watermarks' },
    { id: 'morph',  tr: 'yüz ve nesne bozulmaları', en: 'face or object morphing' },
    { id: 'limbs',  tr: 'fazladan uzuv / parmak', en: 'extra limbs or fingers' },
    { id: 'flicker', tr: 'titreme ve ani kesmeler', en: 'flickering and sudden cuts' },
    { id: 'people', tr: 'kadraja giren yeni kişiler', en: 'new people entering the frame' }
  ],

  // ---------- HAZIR BAŞLANGIÇLAR ----------
  presets: [
    { id: 'reels-urun', label: 'Ürün reklamı',
      values: { movement: 'orbit-cw', shot: 'close-up', angle: 'eye', lens: '85', light: 'rim', mood: 'luxurious', style: 'commercial', speed: 'slow', ratio: '9:16', duration: '5',
        subject: 'A sleek product on a pedestal', location: 'a dark minimal studio', action: 'soft light sweeps across its surface', avoid: ['text', 'morph'] } },
    { id: 'emlak', label: 'Gayrimenkul turu',
      values: { movement: 'drone-push', shot: 'extreme-wide', angle: 'high', lens: '24', light: 'golden', mood: 'peaceful', style: 'commercial', speed: 'slow', ratio: '16:9', duration: '8',
        subject: 'A modern house with large windows', location: 'a green hillside', action: 'interior lights turn on as the sun sets', avoid: ['flicker'] } },
    { id: 'araba', label: 'Araba takibi',
      values: { movement: 'vehicle-tracking', shot: 'medium-wide', angle: 'low', lens: '50', light: 'golden', mood: 'energetic', style: 'commercial', speed: 'fast', ratio: '16:9', duration: '5',
        subject: 'A sports car', location: 'a winding mountain road', action: 'it accelerates through the curve', avoid: ['text', 'morph'] } },
    { id: 'portre', label: 'Sinematik portre',
      values: { movement: 'push-in', shot: 'medium-close', angle: 'eye', lens: '85', light: 'window', mood: 'melancholic', style: 'film', speed: 'very-slow', ratio: '9:16', duration: '5',
        subject: 'A young man', location: 'a quiet apartment by the window', action: 'he slowly looks up toward the camera', avoid: ['morph', 'limbs'] } }
  ]
};
