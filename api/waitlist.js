/* Bekleme listesi uç noktası (Vercel Function): GET (hazır mı?) ve POST /api/waitlist
   Ziyaretçinin e-postasını doğrular ve site sahibine SMTP ile bildirim gönderir.
   Veritabanı yoktur. Posta sunucusu iletiyi kabul etmeden "ok" dönmez.

   Ortam değişkenleri (Vercel > Project > Settings > Environment Variables; depoya YAZILMAZ):
     SMTP_HOST, SMTP_PORT (465 veya 587), SMTP_USER, SMTP_PASS
     NOTIFY_TO        Bildirimin gideceği adres (birden fazlaysa virgülle)
     MAIL_FROM        (isteğe bağlı) Gönderen adres; boşsa SMTP_USER
     SMTP_SECURE      (isteğe bağlı) "true"/"false"; boşsa port 465 ise true
     ALLOWED_ORIGINS  (isteğe bağlı) Sitenin kendi adresi dışında izinli adresler */
const { sendMail } = require('./_smtp');

const SOURCES = { egitim: 'Ana sayfa (eğitim)', seminer: 'Seminer sayfası', kutuphane: 'Prompt Kütüphanesi' };

// Formdaki onay metinleri. Sayfadaki metin değişirse yeni bir sürüm numarası ekleyin.
const CONSENTS = {
  1: {
    egitim: [
      'Aydınlatma Metni\'ni okudum; e-posta adresimin bekleme listesi amacıyla işlenmesini anladım.',
      'Eğitimin satışa açılması ve eğitimle ilgili duyurular için e-posta ile ticari elektronik ileti almayı kabul ediyorum. Dilediğim zaman vazgeçebilirim.'
    ],
    seminer: [
      'Aydınlatma Metni\'ni okudum; e-posta adresimin bu amaçla işlenmesini anladım.',
      'Seminer ve eğitimle ilgili duyurular için e-posta ile ticari elektronik ileti almayı kabul ediyorum. Dilediğim zaman vazgeçebilirim.'
    ]
  }
};
CONSENTS[1].kutuphane = CONSENTS[1].egitim;

const MAX_BODY = 2048;
const MIN_FILL_MS = 2500;

/* Bellek içi sınırlar: yalnızca aynı sunucu örneği yaşadığı sürece geçerlidir (en iyi çaba).
   Kalıcı hız sınırı için Vercel Firewall kuralı kullanılır. */
const IP_WINDOW = 10 * 60 * 1000;
const IP_LIMIT = 5;
const GLOBAL_WINDOW = 60 * 60 * 1000;
const GLOBAL_LIMIT = 60;
const DUPLICATE_WINDOW = 24 * 60 * 60 * 1000;
const ipHits = new Map();
let globalHits = [];
const recentEmails = new Map();
const inFlight = new Set();

function overIpLimit(ip, now) {
  const list = (ipHits.get(ip) || []).filter((t) => now - t < IP_WINDOW);
  list.push(now);
  if (ipHits.size > 2000) ipHits.clear();
  ipHits.set(ip, list);
  return list.length > IP_LIMIT;
}

function isValidEmail(email) {
  if (email.length < 6 || email.length > 254) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64 || /^\.|\.$|\.\./.test(local)) return false;
  if (!/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+$/.test(local)) return false;
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/.test(domain);
}

// Yalnızca sitenin kendi sayfalarından gelen istekler kabul edilir
function originAllowed(req) {
  const origin = String(req.headers.origin || '');
  if (!origin) return false;
  const extra = String(process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (extra.includes(origin)) return true;
  try { return new URL(origin).host === req.headers.host; } catch (err) { return false; }
}

async function readBody(req) {
  if (Number(req.headers['content-length'] || 0) > MAX_BODY) return null;
  let body = req.body; // Vercel gövdeyi hazır verir; bozuk JSON'da bu satır hata fırlatır
  if (body === undefined) {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > MAX_BODY) return null;
    }
    body = raw;
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') body = JSON.parse(body);
  return body && typeof body === 'object' && !Array.isArray(body) ? body : null;
}

function mailConfig() {
  const env = process.env;
  const port = Number(env.SMTP_PORT || 465);
  const to = String(env.NOTIFY_TO || '').split(',').map((s) => s.trim()).filter(Boolean);
  const from = String(env.MAIL_FROM || env.SMTP_USER || '').trim();
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !to.length || !from.includes('@') || !port) return null;
  return {
    smtp: {
      host: env.SMTP_HOST.trim(),
      port,
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    },
    from,
    to
  };
}

function reply(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  // Form bu yanıta bakarak açılır; yalnızca ayarın var olup olmadığı bildirilir, değerler asla
  if (req.method === 'GET') return reply(res, 200, { ok: true, ready: Boolean(mailConfig()) });
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return reply(res, 405, { ok: false, error: 'method' });
  }
  if (!originAllowed(req)) return reply(res, 403, { ok: false, error: 'origin' });
  if (!/^application\/json\b/i.test(String(req.headers['content-type'] || ''))) {
    return reply(res, 415, { ok: false, error: 'bad_request' });
  }

  const now = Date.now();
  // Vercel bu başlığı kendisi yazar; ziyaretçi sahtesini gönderemez
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '').split(',')[0].trim();
  if (overIpLimit(ip, now)) return reply(res, 429, { ok: false, error: 'rate_limited' });

  let body = null;
  try { body = await readBody(req); } catch (err) { /* geçersiz JSON */ }
  if (!body) return reply(res, 400, { ok: false, error: 'bad_request' });

  // Bot kontrolleri: gizli alan doluysa veya form insan için fazla hızlı doldurulduysa
  if (body.website) return reply(res, 400, { ok: false, error: 'spam' });
  if (typeof body.elapsed !== 'number' || !(body.elapsed >= MIN_FILL_MS)) {
    return reply(res, 400, { ok: false, error: 'too_fast' });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!isValidEmail(email)) return reply(res, 400, { ok: false, error: 'invalid_email' });
  if (body.consentPrivacy !== true || body.consentCommercial !== true) return reply(res, 400, { ok: false, error: 'consent' });

  const source = Object.prototype.hasOwnProperty.call(SOURCES, body.source) ? body.source : 'egitim';
  const version = String(body.consentVersion);
  if (!Object.prototype.hasOwnProperty.call(CONSENTS, version)) return reply(res, 400, { ok: false, error: 'consent' });

  const config = mailConfig();
  if (!config) {
    console.error('waitlist: SMTP ortam degiskenleri eksik');
    return reply(res, 503, { ok: false, error: 'not_configured' });
  }

  for (const [key, time] of recentEmails) if (now - time > DUPLICATE_WINDOW) recentEmails.delete(key);
  if (recentEmails.has(email)) return reply(res, 409, { ok: false, error: 'duplicate' });
  if (inFlight.has(email)) return reply(res, 429, { ok: false, error: 'rate_limited' });

  globalHits = globalHits.filter((t) => now - t < GLOBAL_WINDOW);
  if (globalHits.length >= GLOBAL_LIMIT) return reply(res, 429, { ok: false, error: 'rate_limited' });
  globalHits.push(now);

  const date = new Date(now);
  const local = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'medium', timeZone: 'Europe/Istanbul' }).format(date);
  const text = [
    'Bekleme listesine yeni bir kayıt geldi.',
    '',
    'E-posta      : ' + email,
    'Kayıt tarihi : ' + local + ' (Türkiye saati)',
    'UTC          : ' + date.toISOString(),
    'Form         : ' + SOURCES[source],
    '',
    'Ziyaretçinin işaretlediği onaylar (metin sürümü ' + version + '):',
    ...CONSENTS[version][source].map((line) => '  [x] ' + line),
    '',
    'Not: Adresin sahibine ait olduğu ayrıca doğrulanmamıştır.',
    'Bu iletiyi onay kaydı olarak saklayın. Kişi listeden çıkmak veya silinmek isterse kaydını kaldırın.'
  ].join('\n');

  inFlight.add(email);
  try {
    await sendMail(config.smtp, {
      from: config.from,
      fromName: 'Together Yazıbaşı Web',
      to: config.to,
      subject: 'Yeni bekleme listesi kaydı: ' + email,
      text
    });
  } catch (err) {
    // E-posta adresi ve kimlik bilgisi günlüğe yazılmaz
    console.error('waitlist: gonderim hatasi', err.stage || 'unknown', err.code || '');
    return reply(res, 502, { ok: false, error: 'server' });
  } finally {
    inFlight.delete(email);
  }

  if (recentEmails.size > 5000) recentEmails.clear();
  recentEmails.set(email, now);
  return reply(res, 200, { ok: true, status: 'received' });
};
