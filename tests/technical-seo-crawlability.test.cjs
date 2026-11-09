/* GrapeCrux technical SEO static regression checks. Node.js 22+, no dependencies. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://grapecrux.com';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '__pycache__'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out);
    else if (entry.isFile()) out.push(file);
  }
  return out;
}
function valueOfTag(source, tagPattern, attribute) {
  const tag = source.match(tagPattern);
  if (!tag) return '';
  const match = tag[0].match(new RegExp(attribute + '="([^"]*)"', 'i'));
  return match ? match[1].replace(/&amp;/g, '&').trim() : '';
}
function routeFor(file) {
  const relative = path.relative(ROOT, file).split(path.sep).join('/');
  return relative === 'index.html' ? '/' : '/' + relative.replace(/\/index\.html$/i, '/');
}
function localFile(href, fromRoute) {
  const url = new URL(href, BASE + fromRoute);
  if (url.origin !== BASE) return null;
  let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if (!relative) relative = 'index.html';
  let target = path.resolve(ROOT, relative);
  if (!path.extname(target)) {
    if (fs.existsSync(path.join(target, 'index.html'))) target = path.join(target, 'index.html');
    else if (fs.existsSync(target + '.html')) target += '.html';
  }
  if (!target.startsWith(ROOT + path.sep) && target !== path.join(ROOT, 'index.html')) return null;
  return fs.existsSync(target) && fs.statSync(target).isFile() ? target : null;
}

const files = walk(ROOT);
const htmlPages = files.filter(file => file.toLowerCase().endsWith('.html'));
const contentPages = htmlPages.filter(file => {
  const source = fs.readFileSync(file, 'utf8');
  return path.basename(file).toLowerCase() !== '404.html' &&
    source.includes('id="site-header"') && source.includes('id="site-footer"');
});
assert.ok(contentPages.length > 0, 'No clean content pages found');

const routeMap = new Map();
const titles = new Map();
const canonicals = new Map();

for (const file of contentPages) {
  const source = fs.readFileSync(file, 'utf8');
  const route = routeFor(file);
  const title = (source.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1].replace(/&amp;/g, '&').trim();
  const description = valueOfTag(source, /<meta[^>]*name="description"[^>]*>/i, 'content');
  const canonical = valueOfTag(source, /<link[^>]*rel="canonical"[^>]*>/i, 'href');
  const main = (source.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [,''])[1];
  const h1s = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const robots = valueOfTag(source, /<meta[^>]*name="robots"[^>]*>/i, 'content').toLowerCase();

  assert.ok(title, file + ': missing title');
  assert.ok(description, file + ': missing meta description');
  assert.ok(canonical, file + ': missing canonical');
  assert.equal(h1s.length, 1, file + ': expected one H1 in original HTML main content');
  assert.ok(main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length > 80,
    file + ': important page content is not present in initial HTML');
  assert.ok(!/\bnoindex\b/.test(robots), file + ': public page is marked noindex');
  assert.equal(new URL(canonical).href, BASE + route, file + ': canonical must self-reference clean route');

  const titleKey = title.toLowerCase().replace(/\s+/g, ' ').trim();
  assert.ok(!titles.has(titleKey), file + ': duplicate title also used by ' + titles.get(titleKey));
  titles.set(titleKey, file);
  assert.ok(!canonicals.has(canonical), file + ': duplicate canonical also used by ' + canonicals.get(canonical));
  canonicals.set(canonical, file);
  routeMap.set(route, file);

  const ids = [...source.matchAll(/(?:^|\s)id="([^"]+)"/gi)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, file + ': duplicate HTML id');
  for (const image of source.matchAll(/<img\b([^>]*)>/gi)) {
    assert.match(image[1], /\balt\s*=/i, file + ': image missing alt attribute');
  }
  for (const anchor of source.matchAll(/<a\b([^>]*)>/gi)) {
    const href = (anchor[1].match(/\bhref="([^"]*)"/i) || [,''])[1];
    if (!href || /^(?:#|mailto:|tel:|javascript:|data:|https?:|\/\/)/i.test(href)) continue;
    assert.ok(localFile(href, route), file + ': broken local anchor href="' + href + '"');
  }
}

// Shared header/footer fragments are fetched on the client, so validate their hrefs separately.
for (const include of ['includes/header.html', 'includes/footer.html']) {
  const file = path.join(ROOT, include);
  assert.ok(fs.existsSync(file), 'Missing shared include: ' + include);
  const source = fs.readFileSync(file, 'utf8');
  for (const anchor of source.matchAll(/<a\b([^>]*)>/gi)) {
    const href = (anchor[1].match(/\bhref="([^"]*)"/i) || [,''])[1];
    if (!href || /^(?:#|mailto:|tel:|javascript:|data:|https?:|\/\/)/i.test(href)) continue;
    assert.ok(localFile(href, '/'), include + ': broken local href="' + href + '"');
  }
}

const robotsFile = path.join(ROOT, 'robots.txt');
assert.ok(fs.existsSync(robotsFile), 'robots.txt missing');
const robots = fs.readFileSync(robotsFile, 'utf8');
assert.match(robots, /Sitemap:\s*https:\/\/grapecrux\.com\/sitemap\.xml/i);
const disallowed = [...robots.matchAll(/^\s*Disallow:\s*(\S+)/gim)].map(match => match[1]);
for (const route of ['/blogs/', '/services/', '/careers/', '/about/', '/contact/']) {
  assert.ok(!disallowed.some(rule => rule === '/' || (rule && route.startsWith(rule))),
    'robots.txt blocks public route ' + route);
}

const sitemapFile = path.join(ROOT, 'sitemap.xml');
assert.ok(fs.existsSync(sitemapFile), 'sitemap.xml missing');
const sitemap = fs.readFileSync(sitemapFile, 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(match => match[1].trim());
assert.ok(sitemapUrls.length > 0, 'sitemap.xml is empty');
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, 'sitemap.xml contains duplicate URLs');
const sitemapSet = new Set(sitemapUrls.map(url => new URL(url).href));

for (const route of routeMap.keys()) {
  assert.ok(sitemapSet.has(BASE + route), route + ' missing from sitemap.xml');
}
for (const url of sitemapUrls) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, BASE, 'Sitemap must use canonical host: ' + url);
  assert.equal(parsed.search, '', 'Sitemap URL must not contain query parameters: ' + url);
  assert.ok(routeMap.has(parsed.pathname), 'Sitemap URL has no matching clean content page: ' + url);
}

// Legacy .html aliases are compatibility destinations only; they must stay noindex and outside the sitemap.
for (const alias of ['about.html','contact.html','services.html','industries.html','work.html','insights.html','privacy.html','terms.html']) {
  const file = path.join(ROOT, alias);
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  assert.match(source, /noindex/i, alias + ' should be noindex');
  assert.ok(!sitemapSet.has(BASE + '/' + alias), alias + ' must not be listed in the sitemap');
}

console.log('Technical SEO static checks passed.');
console.log('Content pages: ' + contentPages.length + '; sitemap URLs: ' + sitemapUrls.length + '; unique titles: ' + titles.size);
