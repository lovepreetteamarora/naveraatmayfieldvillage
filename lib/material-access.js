import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const COOKIE = 'navera_materials';
const MAX_AGE = 30 * 24 * 60 * 60;
const sign = (value, secret) => createHmac('sha256', secret).update(`navera-materials:${value}`).digest('base64url');

export function materialCookie(env, { secure = true, now = Date.now() } = {}) {
  if (!env.LEAD_IP_SALT) throw new Error('Material access is not configured.');
  const value = Buffer.from(JSON.stringify({ v: 1, exp: Math.floor(now / 1000) + MAX_AGE, id: randomUUID() })).toString('base64url');
  return `${COOKIE}=${value}.${sign(value, env.LEAD_IP_SALT)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure ? '; Secure' : ''}`;
}

export function hasMaterialAccess(cookie, env, now = Date.now()) {
  if (!env.LEAD_IP_SALT) return false;
  const token = String(cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token || token.length > 512) return false;
  const [value, signature, extra] = token.split('.');
  if (!value || !/^[A-Za-z0-9_-]+$/.test(value) || !/^[A-Za-z0-9_-]{43}$/.test(signature || '') || extra) return false;
  const expected = sign(value, env.LEAD_IP_SALT);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const data = JSON.parse(Buffer.from(value, 'base64url').toString());
    return data.v === 1 && Number.isInteger(data.exp) && data.exp > Math.floor(now / 1000) && data.exp <= Math.floor(now / 1000) + MAX_AGE;
  } catch { return false; }
}
