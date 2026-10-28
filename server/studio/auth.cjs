'use strict';
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(crypto.scrypt);
const SESSION_SECONDS = 8 * 60 * 60;
const attempts = new Map();

function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function settings(env = process.env) {
  let users = [];
  try { users = JSON.parse(env.STUDIO_ADMIN_USERS || '[]'); } catch {}
  users = Array.isArray(users) ? users.filter(u => u && /^[a-zA-Z0-9_.-]{1,64}$/.test(u.username) && /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(u.passwordHash) && u.role === 'admin') : [];
  const secret = env.STUDIO_SESSION_SECRET || '';
  return { users, secret, ready: users.length > 0 && secret.length >= 43 };
}
function mac(value, secret) { return crypto.createHmac('sha256', secret).update(value).digest('base64url'); }
function fingerprint(user) { return crypto.createHash('sha256').update(user.passwordHash).digest('hex').slice(0, 24); }
function isSecure(req) { return process.env.VERCEL === '1' || req.headers['x-forwarded-proto'] === 'https' || !!req.socket?.encrypted; }
function cookieName(req) { return isSecure(req) ? '__Host-badilak_studio' : 'badilak_studio_dev'; }
function createSession(user, config, now = Date.now()) {
  const payload = { sub: user.username, role: 'admin', exp: Math.floor(now / 1000) + SESSION_SECONDS, v: fingerprint(user), csrf: crypto.randomBytes(24).toString('base64url') };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return { token: encoded + '.' + mac(encoded, config.secret), payload };
}
function verifySession(req, config = settings(), now = Date.now()) {
  if (!config.ready) return null;
  const cookies = String(req.headers.cookie || '').split(';').map(x => x.trim());
  const prefix = cookieName(req) + '=';
  const value = cookies.find(x => x.startsWith(prefix))?.slice(prefix.length);
  if (!value || value.length > 2048) return null;
  const [encoded, signature, extra] = value.split('.');
  if (!encoded || !signature || extra || !safeEqual(signature, mac(encoded, config.secret))) return null;
  try {
    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    const user = config.users.find(x => x.username === data.sub);
    if (!user || data.role !== 'admin' || data.v !== fingerprint(user) || !Number.isInteger(data.exp) || data.exp <= Math.floor(now / 1000) || data.exp > Math.floor(now / 1000) + SESSION_SECONDS + 60 || !/^[a-zA-Z0-9_-]{32}$/.test(data.csrf)) return null;
    return data;
  } catch { return null; }
}
function automationAllowed(req) {
  const key = process.env.STUDIO_AUTOMATION_TOKEN || '';
  return key.length >= 43 && safeEqual(req.headers.authorization || '', 'Bearer ' + key);
}
function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const protocol = isSecure(req) ? 'https:' : 'http:';
  try { return new URL(origin).origin === protocol + '//' + req.headers.host && req.headers['sec-fetch-site'] !== 'cross-site'; } catch { return false; }
}
function sessionCookie(req, token, clear = false) {
  return `${cookieName(req)}=${clear ? '' : token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${clear ? 0 : SESSION_SECONDS}${isSecure(req) ? '; Secure' : ''}`;
}
async function passwordMatches(password, hash) {
  const parts = String(hash).split(':');
  const salt = /^[a-f0-9]{32}$/.test(parts[1] || '') ? parts[1] : '00000000000000000000000000000000';
  const expected = /^[a-f0-9]{128}$/.test(parts[2] || '') ? parts[2] : '0'.repeat(128);
  const result = await scrypt(String(password), salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return safeEqual(result.toString('hex'), expected);
}
function throttle(req, success = false, now = Date.now()) {
  const key = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim().slice(0, 100);
  const old = attempts.get(key);
  if (success) { attempts.delete(key); return false; }
  if (old && old.until > now && old.count >= 6) return true;
  if (attempts.size >= 2000 && !attempts.has(key)) {
    for (const [id, row] of attempts) if (row.until <= now) attempts.delete(id);
    if (attempts.size >= 2000) attempts.delete(attempts.keys().next().value);
  }
  attempts.set(key, old && old.until > now ? { count: old.count + 1, until: old.until } : { count: 1, until: now + 5 * 60 * 1000 });
  return false;
}
module.exports = { SESSION_SECONDS, settings, safeEqual, createSession, verifySession, passwordMatches, sessionCookie, originAllowed, automationAllowed, throttle };
