import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { materialCookie, hasMaterialAccess } from '../lib/material-access.js';
import { materials } from '../lib/materials.js';
import { register } from '../lib/registration.js';

const env = { LEAD_API_URL: 'https://example.com/lead', LEAD_API_TOKEN: 'test', LEAD_IP_SALT: 'materials-test' };
const enquiry = { fullName: 'TEST Materials', email: 'materials@example.com', phone: '4165550123', isRealtor: 'no', workingWithRealtor: 'Not provided', interest: '41 Series', heardAbout: 'Navera material registration', formName: 'materials', requestedMaterial: 'floor-plans', consent: true };
const request = body => new Request('https://naveraatmayfieldvillage.com/api/register', { method: 'POST', headers: { origin: 'https://naveraatmayfieldvillage.com', 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.234' }, body: JSON.stringify(body) });

test('material access is signed, expires and contains no contact details', () => {
  const now = 1793473200000;
  const cookie = materialCookie(env, { now });
  assert.equal(hasMaterialAccess(cookie, env, now), true);
  assert.equal(hasMaterialAccess(cookie, env, now + 30 * 86400000), false);
  assert.equal(hasMaterialAccess(cookie, { LEAD_IP_SALT: 'wrong-key' }, now), false);
  assert.equal(hasMaterialAccess(cookie.replace(/.$/, 'x').split(';')[0] + 'x', env, now), false);
  for (const value of ['', 'navera_materials=abc.bad', 'navera_materials=x.' + 'é'.repeat(43)]) assert.equal(hasMaterialAccess(value, env, now), false);
  assert.match(cookie, /HttpOnly; SameSite=Lax; Max-Age=2592000; Secure$/);
  assert.doesNotMatch(cookie, /example\.com|TEST|4165550123/);
});

test('a saved material enquiry retains collection and requested document before access is issued', async () => {
  let row;
  const response = await register(request(enquiry), env, async (_url, options) => { row = JSON.parse(options.body); return new Response(null, { status: 201 }); });
  assert.equal((await response.json()).leadAccepted, true);
  assert.equal(row.details.formName, 'materials');
  assert.equal(row.details.requestedMaterial, 'floor-plans');
  assert.equal(row.details.interest, '41 Series');
  assert.match(row.message, /Floor plans \(41 Series\)/);
  assert.equal(hasMaterialAccess(response.headers.get('set-cookie'), env), true);
});

test('invalid, honeypot and failed saves never issue material access', async () => {
  for (const [body, status] of [[{ ...enquiry, consent: false }, 201], [{ ...enquiry, website: 'spam' }, 201], [enquiry, 503]]) {
    const response = await register(request(body), env, async () => new Response(null, { status }));
    assert.equal(response.headers.get('set-cookie'), null);
    assert.notEqual((await response.json()).leadAccepted, true);
  }
});

test('legacy material endpoint still requires signed access and never caches publicly', async () => {
  const url = 'https://naveraatmayfieldvillage.com/api/materials?resource=community-aerial';
  assert.equal((await materials(new Request(url), env)).status, 403);
  const response = await materials(new Request(url, { headers: { cookie: materialCookie(env) } }), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/webp');
  assert.match(response.headers.get('cache-control'), /private, no-store/);
  assert.equal(response.headers.get('vary'), 'Cookie');
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.ok((await response.arrayBuffer()).byteLength > 200000);
  const unknown = await materials(new Request(url.replace('community-aerial', '../private/aerial.webp'), { headers: { cookie: materialCookie(env) } }), env);
  assert.equal(unknown.status, 404);
  await access(new URL('../public/assets/aerial.webp', import.meta.url));
});
