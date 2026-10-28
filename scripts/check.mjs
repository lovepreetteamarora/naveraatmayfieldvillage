import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { pages } from '../src/pages.mjs';
import { project } from '../src/project.mjs';
const root = new URL('../dist/',import.meta.url);
let internalLinks = 0;
for (const page of pages) {
  const html = await readFile(new URL(page.path.slice(1)+'index.html',root),'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`One H1: ${page.path}`);
  assert.ok(html.includes(`<link rel="canonical" href="${project.origin}${page.path}">`));
  assert.ok(html.includes('name="description"'));
  assert.ok(html.includes('property="og:image"'));
  assert.ok(html.includes('name="twitter:image"'));
  for (const json of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(json[1]);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const path = match[1];
    const target = path.endsWith('/') ? path+'index.html' : path;
    await stat(new URL(target.slice(1),root)).catch(()=>assert.fail(`Broken link: ${page.path} -> ${path}`));
    internalLinks++;
  }
  assert.ok(!html.includes('google-site-verification'));
  assert.ok(!html.includes('LEAD_API_TOKEN'));
}
const sitemap = await readFile(new URL('sitemap.xml',root),'utf8');
assert.ok(sitemap.includes(project.origin));
assert.ok(!sitemap.includes('/404/'));
const robots = await readFile(new URL('robots.txt',root),'utf8');
assert.ok(robots.includes(`${project.origin}/sitemap.xml`));
console.log(`Passed: ${pages.length} HTML pages, one H1 each, canonical/social metadata, JSON-LD, sitemap, robots, and ${internalLinks} internal references.`);
