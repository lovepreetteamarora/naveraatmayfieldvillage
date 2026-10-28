import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { register } from '../lib/registration.js';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4321);
const origin = `http://localhost:${port}`;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server = createServer(async (req,res) => {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  try {
    const url = new URL(req.url, origin);
    if (url.pathname.replace(/\/$/,'') === '/api/status') {
      res.setHeader('Content-Type','application/json');
      res.setHeader('Cache-Control','no-store');
      res.end(JSON.stringify({onlineDelivery:Boolean(process.env.LEAD_API_URL && process.env.LEAD_API_TOKEN && process.env.LEAD_IP_SALT)}));
      return;
    }
    if (url.pathname.replace(/\/$/,'') === '/api/register') {
      const headers = new Headers();
      for (const [key,value] of Object.entries(req.headers)) if (value) headers.set(key,Array.isArray(value)?value.join(','):value);
      headers.set('cf-connecting-ip', req.socket.remoteAddress || '');
      const request = new Request(url, { method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{}) });
      const response = await register(request,{...process.env,NODE_ENV:'development',LOCAL_ORIGIN:origin});
      res.writeHead(response.status,Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end('Method not allowed');return;}
    const path = decodeURIComponent(url.pathname);
    let file = resolve(root, '.' + path);
    if (file !== resolve(root) && !file.startsWith(resolve(root)+sep)) {res.writeHead(403);res.end();return;}
    let status = 200;
    try {
      const info = await stat(file);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith('/')) {res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}
        file = resolve(file,'index.html');
      }
      await stat(file);
    } catch {status=404;file=resolve(root,'404.html');}
    const content = await readFile(file);
    res.writeHead(status,{'Content-Type':types[extname(file)]||'application/octet-stream'});
    res.end(req.method==='HEAD'?undefined:content);
  } catch {
    res.writeHead(500,{'Content-Type':'text/plain'});
    res.end('Unable to process this request.');
  }
});
server.listen(port,'127.0.0.1',()=>console.log(`Navera preview: ${origin}`));
