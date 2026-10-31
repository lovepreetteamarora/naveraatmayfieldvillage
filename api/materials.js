import { materials } from '../lib/materials.js';

export default async function handler(req, res) {
  const request = new Request(`https://naveraatmayfieldvillage.com${req.url}`, { method: req.method, headers: { cookie: req.headers.cookie || '' } });
  const result = await materials(request, process.env);
  res.statusCode = result.status;
  result.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await result.arrayBuffer()));
}
