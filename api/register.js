import { Readable } from 'node:stream';
import { register } from '../lib/registration.js';

export default async function handler(req,res) {
  const headers = new Headers();
  for (const [key,value] of Object.entries(req.headers)) if (value) headers.set(key,Array.isArray(value)?value.join(','):value);
  const forwarded = headers.get('x-vercel-forwarded-for') || headers.get('x-forwarded-for') || '';
  headers.set('cf-connecting-ip',forwarded.split(',')[0].trim());
  const origin = `https://${process.env.VERCEL_URL || 'naveraatmayfieldvillage.com'}`;
  // Vercel parses JSON by default. Recreate the Web Request for shared validation.
  const body = req.body === undefined ? Readable.toWeb(req) : typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const request = new Request(origin+'/api/register',{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body,duplex:'half'}:{})});
  const result = await register(request,process.env);
  res.statusCode = result.status;
  result.headers.forEach((value,key)=>res.setHeader(key,value));
  res.end(Buffer.from(await result.arrayBuffer()));
}
