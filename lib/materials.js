import { readFile } from 'node:fs/promises';
import { hasMaterialAccess } from './material-access.js';

export async function materials(request, env) {
  const headers = { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' };
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
  if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
  const unlocked = hasMaterialAccess(request.headers.get('cookie'), env);
  const resource = new URL(request.url).searchParams.get('resource');
  if (!resource) return json({ unlocked });
  if (!unlocked) return json({ error: 'Please register to view the full community image.' }, 403);
  if (resource !== 'community-aerial') return json({ error: 'Material not found.' }, 404);
  const content = await readFile(new URL('../private/aerial.webp', import.meta.url));
  return new Response(request.method === 'HEAD' ? null : content, { headers: { ...headers, 'Content-Type': 'image/webp' } });
}
