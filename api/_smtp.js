/* Tek bir düz metin e-posta gönderen küçük SMTP istemcisi (yalnızca Node'un kendi modülleri).
   Dosya adı "_" ile başladığı için Vercel bunu ayrı bir uç nokta olarak yayınlamaz.
   Kimlik bilgisi yalnızca şifreli bağlantı üzerinden gönderilir (465: TLS, diğerleri: zorunlu STARTTLS). */
const net = require('node:net');
const tls = require('node:tls');
const crypto = require('node:crypto');

class SmtpError extends Error {
  constructor(stage, code) {
    super('smtp ' + stage + (code ? ' ' + code : ''));
    this.stage = stage;
    this.code = code || 0;
  }
}

const b64 = (text) => Buffer.from(text, 'utf8').toString('base64');
const wrap = (text) => text.replace(/.{1,76}/g, '$&\r\n');
// Başlık ve komutlara satır sonu sızdırılamaz
const safe = (value) => {
  if (/[\r\n\0<>]/.test(value)) throw new SmtpError('address');
  return value;
};
const encodeHeader = (text) => (/^[\x20-\x7e]*$/.test(text) ? text : '=?UTF-8?B?' + b64(text) + '?=');

function buildMessage({ from, fromName, to, subject, text }) {
  const domain = from.split('@')[1];
  return [
    'Date: ' + new Date().toUTCString().replace('GMT', '+0000'),
    'From: ' + (fromName ? encodeHeader(safe(fromName)) + ' ' : '') + '<' + safe(from) + '>',
    'To: ' + to.map((a) => '<' + safe(a) + '>').join(', '),
    'Subject: ' + encodeHeader(subject.replace(/[\r\n]+/g, ' ')),
    'Message-ID: <' + crypto.randomUUID() + '@' + domain + '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    'Auto-Submitted: auto-generated',
    '',
    wrap(b64(text))
  ].join('\r\n');
}

// Sunucu yanıtlarını (çok satırlı olabilir) sırayla okur
function reader(socket) {
  let buffer = '';
  let lines = [];
  const replies = [];
  let waiting = null;
  let failure = null;

  const flush = () => {
    if (!waiting) return;
    if (replies.length) { const w = waiting; waiting = null; w.resolve(replies.shift()); }
    else if (failure) { const w = waiting; waiting = null; w.reject(failure); }
  };
  const onData = (chunk) => {
    buffer += chunk.toString('utf8');
    if (buffer.length > 65536) { failure = new SmtpError('overflow'); socket.destroy(); }
    let at;
    while ((at = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, at).replace(/\r$/, '');
      buffer = buffer.slice(at + 1);
      lines.push(line);
      if (/^\d{3}( |$)/.test(line)) {
        replies.push({ code: Number(line.slice(0, 3)), lines });
        lines = [];
      }
    }
    flush();
  };
  const onEnd = () => { failure = failure || new SmtpError('closed'); flush(); };
  socket.on('data', onData);
  socket.on('error', onEnd);
  socket.on('close', onEnd);

  return {
    next: () => new Promise((resolve, reject) => { waiting = { resolve, reject }; flush(); }),
    detach: () => socket.removeListener('data', onData)
  };
}

function open(factory, event) {
  return new Promise((resolve, reject) => {
    const socket = factory();
    const onError = () => reject(new SmtpError('connect'));
    socket.once('error', onError);
    socket.once(event, () => { socket.removeListener('error', onError); resolve(socket); });
  });
}

async function sendMail(config, mail, timeoutMs = 10000) {
  const { host, port, secure, user, pass } = config;
  const servername = net.isIP(host) ? undefined : host;
  let socket = null;
  let raw = null;
  let timer = null;

  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new SmtpError('timeout')), timeoutMs);
  });

  const talk = async () => {
    socket = secure
      ? await open(() => tls.connect({ host, port, servername }), 'secureConnect')
      : await open(() => net.connect({ host, port }), 'connect');
    let io = reader(socket);

    const expect = async (stage, codes) => {
      const reply = await io.next();
      if (!codes.includes(reply.code)) throw new SmtpError(stage, reply.code);
      return reply;
    };
    const cmd = (line, stage, codes) => { socket.write(line + '\r\n'); return expect(stage, codes); };
    const hello = () => cmd('EHLO ' + mail.from.split('@')[1], 'ehlo', [250]);

    await expect('greeting', [220]);
    let ehlo = await hello();

    if (!secure) {
      if (!ehlo.lines.some((l) => /STARTTLS/i.test(l))) throw new SmtpError('starttls-missing');
      await cmd('STARTTLS', 'starttls', [220]);
      io.detach();
      raw = socket;
      socket = await open(() => tls.connect({ socket: raw, host, servername }), 'secureConnect');
      io = reader(socket);
      ehlo = await hello();
    }

    const methods = (ehlo.lines.find((l) => /^\d{3}[ -]AUTH[ =]/i.test(l)) || '').toUpperCase();
    if (/\bPLAIN\b/.test(methods) || !/\bLOGIN\b/.test(methods)) {
      await cmd('AUTH PLAIN ' + b64('\0' + user + '\0' + pass), 'auth', [235]);
    } else {
      await cmd('AUTH LOGIN', 'auth', [334]);
      await cmd(b64(user), 'auth', [334]);
      await cmd(b64(pass), 'auth', [235]);
    }

    await cmd('MAIL FROM:<' + safe(mail.from) + '>', 'from', [250]);
    for (const rcpt of mail.to) await cmd('RCPT TO:<' + safe(rcpt) + '>', 'rcpt', [250, 251]);
    await cmd('DATA', 'data', [354]);
    // Gövde base64 olduğu için hiçbir satır "." ile başlamaz
    await cmd(buildMessage(mail) + '\r\n.', 'send', [250]);
    socket.write('QUIT\r\n'); // ileti kabul edildi; QUIT yanıtı beklenmez
  };

  try {
    await Promise.race([talk(), deadline]);
  } finally {
    clearTimeout(timer);
    if (socket) { socket.end(); socket.destroySoon && socket.destroySoon(); }
    if (raw && raw !== socket) raw.end();
  }
}

module.exports = { sendMail, buildMessage, SmtpError };
