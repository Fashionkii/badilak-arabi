'use strict';
const fs = require('node:fs');
const path = require('node:path');
const auth = require('../server/studio/auth.cjs');
const ROOT = path.join(__dirname, '../server/studio');
const TYPES = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const PUBLIC_ASSETS = new Set(['login.js', 'app.css', 'font-400.woff2', 'font-700.woff2', 'logo.webp']);
const CSP = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'";
function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.statusCode = status; res.setHeader('Content-Type', type);
  res.end(typeof body === 'object' && !Buffer.isBuffer(body) ? JSON.stringify(body) : body);
}
async function body(req, max = 100 * 1024) {
  if (Number(req.headers['content-length'] || 0) > max) throw new Error('SIZE');
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) throw new Error('TYPE');
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(raw) > max) throw new Error('SIZE');
    return JSON.parse(raw);
  }
  let raw = ''; for await (const part of req) { raw += part; if (Buffer.byteLength(raw) > max) throw new Error('SIZE'); }
  return JSON.parse(raw);
}
function normalizeCopy(data) {
  if (!data || typeof data !== 'object' || !['ar', 'en'].includes(data.lang) || typeof data.template !== 'string') throw new Error('SCHEMA');
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'templates.json'), 'utf8'));
  if (!manifest.templates.some(t => t.id === data.template)) throw new Error('SCHEMA');
  const limits = { title: 120, subtitle: 190, footer: 150, cta: 80 };
  const out = { template: data.template, lang: data.lang, copy: {}, cards: [] };
  for (const [key, max] of Object.entries(limits)) {
    const value = data.copy?.[key];
    if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)) throw new Error('SCHEMA');
    out.copy[key] = value;
  }
  if (!Array.isArray(data.cards) || data.cards.length !== 3) throw new Error('SCHEMA');
  for (const card of data.cards) {
    if (typeof card.name !== 'string' || card.name.length > 80 || typeof card.description !== 'string' || card.description.length > 150) throw new Error('SCHEMA');
    out.cards.push({ name: card.name, description: card.description });
  }
  return out;
}
async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  const url = new URL(req.url, 'http://localhost');
  const action = url.searchParams.get('action');
  const asset = url.searchParams.get('asset');
  const config = auth.settings();
  const session = auth.verifySession(req, config);
  const automated = auth.automationAllowed(req);
  const authorized = !!session || automated;
  try {
    if (asset) {
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method' });
      if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]{0,90}$/.test(asset) || !TYPES[path.extname(asset)]) return send(res, 404, { error: 'not_found' });
      if (!PUBLIC_ASSETS.has(asset) && !authorized) return send(res, 401, { error: 'unauthorized' });
      const file = path.join(ROOT, 'client', asset);
      const art = path.join(ROOT, 'assets', asset);
      const chosen = asset === 'shell.txt' ? path.join(ROOT, 'client/index.html') : fs.existsSync(file) ? file : art;
      if (!fs.existsSync(chosen)) return send(res, 404, { error: 'not_found' });
      res.statusCode = 200; res.setHeader('Content-Type', TYPES[path.extname(asset)]);
      return res.end(req.method === 'HEAD' ? '' : fs.readFileSync(chosen));
    }
    if (action === 'login') {
      if (req.method !== 'POST') return send(res, 405, { error: 'method' });
      if (!auth.originAllowed(req)) return send(res, 403, { error: 'origin' });
      if (!config.ready) return send(res, 503, { error: 'setup', message: 'دخول الإدارة لم يُجهّز بعد.' });
      if (auth.throttle(req)) { res.setHeader('Retry-After', '300'); return send(res, 429, { error: 'rate_limit', message: 'محاولات كثيرة. أعد المحاولة بعد خمس دقائق.' }); }
      const input = await body(req, 4096);
      const user = config.users.find(x => x.username === input.username);
      const valid = await auth.passwordMatches(String(input.password || '').slice(0, 512), user?.passwordHash || '');
      if (!user || !valid) return send(res, 401, { error: 'credentials', message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
      auth.throttle(req, true);
      const next = auth.createSession(user, config);
      res.setHeader('Set-Cookie', auth.sessionCookie(req, next.token));
      return send(res, 200, { ok: true });
    }
    if (!authorized) {
      if (action) return send(res, 401, { error: 'unauthorized' });
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method' });
      return send(res, 200, req.method === 'HEAD' ? '' : fs.readFileSync(path.join(ROOT, 'client/login.html')), 'text/html; charset=utf-8');
    }
    if (action === 'logout' || action === 'validate') {
      if (req.method !== 'POST') return send(res, 405, { error: 'method' });
      if (!automated && (!auth.originAllowed(req) || !auth.safeEqual(req.headers['x-studio-csrf'] || '', session.csrf))) return send(res, 403, { error: 'csrf' });
      if (action === 'logout') { res.setHeader('Set-Cookie', auth.sessionCookie(req, '', true)); return send(res, 200, { ok: true }); }
      return send(res, 200, { ok: true, design: normalizeCopy(await body(req)) });
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method' });
    if (action === 'bootstrap') {
      const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'templates.json'), 'utf8'));
      return send(res, 200, { ...data, session: { username: session?.sub || 'automation', csrf: session?.csrf || null, expires: session?.exp || null }, aiConnected: false });
    }
    if (action === 'schema') return send(res, 200, { version: 1, templates: JSON.parse(fs.readFileSync(path.join(ROOT, 'templates.json'), 'utf8')).templates.map(t => ({ id: t.id, label: t.label, section: t.section, lockedLayout: t.layout })), copy: { title: 'string <=120', subtitle: 'string <=190', footer: 'string <=150', cta: 'string <=80' }, cards: 'exactly 3: { name:string <=80, description:string <=150 }', languages: ['ar', 'en'], note: 'Text proposal only. Review claims and typography before exporting. No AI provider is connected.' });
    if (action === 'session') return send(res, 200, { ok: true, username: session?.sub || 'automation' });
    if (action) return send(res, 404, { error: 'not_found' });
    return send(res, 200, req.method === 'HEAD' ? '' : fs.readFileSync(path.join(ROOT, 'client/index.html')), 'text/html; charset=utf-8');
  } catch (error) {
    const known = ['SIZE', 'TYPE', 'SCHEMA'].includes(error.message) || error instanceof SyntaxError;
    return send(res, known ? 400 : 500, { error: known ? 'invalid_input' : 'server_error', message: known ? 'راجع صيغة البيانات وحجم الملف.' : 'تعذّر إكمال الطلب.' });
  }
}
module.exports = handler;
module.exports.normalizeCopy = normalizeCopy;
