import { mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/pages.mjs';
import { layout } from '../src/components.mjs';
import { project } from '../src/project.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = `${root}dist`;
await rm(out, { recursive:true, force:true });
await mkdir(out, { recursive:true });
await cp(`${root}public`, out, { recursive:true });
for (const page of pages) {
  const directory = out + (page.path === '/' ? '' : page.path);
  await mkdir(directory, { recursive:true });
  await writeFile(`${directory}/index.html`, layout(page));
  if (page.path === '/404/') await writeFile(`${out}/404.html`, layout(page));
}
const xmlEscape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${pages.filter(page=>!page.noindex).map(page=>`\n  <url><loc>${project.origin}${page.path}</loc><lastmod>${project.checkedOn}</lastmod>${(page.path==='/gallery/'?['aerial','family','family-life','park','neighbourhood','community','trails']:page.path==='/'?['family','aerial']:[]).map(name=>`<image:image><image:loc>${xmlEscape(project.origin+'/assets/'+name+'.webp')}</image:loc></image:image>`).join('')}</url>`).join('')}\n</urlset>\n`;
await writeFile(`${out}/sitemap.xml`, sitemap);
await writeFile(`${out}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${project.origin}/sitemap.xml\n`);
console.log(`Built ${pages.length} complete HTML pages into dist/ for ${project.origin}`);
