#!/usr/bin/env node
'use strict';
/* Live technical SEO audit for GrapeCrux. Node.js 22+, no third-party dependencies. */
const BASE = new URL((process.env.SITE_URL || 'https://grapecrux.com').replace(/\/+$/, '') + '/');
const TIMEOUT = Number(process.env.TIMEOUT_MS || 20000);
const WORKERS = Number(process.env.CONCURRENCY || 6);
const MAX_REDIRECTS = 8;
const MAX_LINKS = Number(process.env.MAX_LINK_CHECKS || 500);
const ERRORS = [];
const WARNINGS = [];
const TITLES = new Map();
const CANONICALS = new Map();

function fail(message) { ERRORS.push(message); console.error('ERROR: ' + message); }
function warn(message) { WARNINGS.push(message); console.warn('WARN: ' + message); }
function decode(value) {
  return String(value || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
function extract(source, regex) {
  const match = source.match(regex);
  return match ? decode(match[1]).trim() : '';
}
async function request(url, method) {
  let current = new URL(url);
  const hops = [];
  for (let i = 0; i <= MAX_REDIRECTS; i += 1) {
    const response = await fetch(current, {
      method: method || 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { 'user-agent': 'GrapeCruxTechnicalSEOAudit/1.0', accept: 'text/html,application/xml,text/plain,*/*' }
    });
    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      hops.push({ from: current.href, status: response.status });
      if (response.body) await response.body.cancel().catch(() => {});
      current = new URL(response.headers.get('location'), current);
      continue;
    }
    return { response, finalUrl: current, hops };
  }
  throw new Error('Redirect limit exceeded for ' + url);
}
async function parallel(items, limit, fn) {
  let next = 0;
  const results = new Array(items.length);
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try { results[i] = await fn(items[i]); }
      catch (e) { fail('Request failed for ' + items[i] + ': ' + (e.message || String(e))); results[i] = null; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
function disallowed(pathname, text) {
  const lines = text.split(/\r?\n/);
  let active = false;
  const rules = [];
  for (const raw of lines) {
    const line = raw.replace(/#.*$/, '').trim();
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const name = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (name === 'user-agent') active = value === '*';
    else if (active && name === 'disallow' && value) rules.push(value);
  }
  return rules.some(rule => rule !== '' && pathname.startsWith(rule.split('*')[0]));
}
function report() {
  console.log('Sitemap pages checked: ' + PAGE_URLS.length);
  console.log('Unique internal link targets checked: ' + LINK_URLS.length);
  console.log('Unique page titles checked: ' + TITLES.size);
  console.log('Errors: ' + ERRORS.length + '; warnings: ' + WARNINGS.length);
  if (ERRORS.length) process.exitCode = 1;
}
let PAGE_URLS = [];
let LINK_URLS = [];

async function main() {
  console.log('GrapeCrux live technical SEO audit: ' + BASE.href);
  const robotsResult = await request(new URL('/robots.txt', BASE));
  if (robotsResult.response.status !== 200) fail('robots.txt returned HTTP ' + robotsResult.response.status);
  const robots = await robotsResult.response.text();
  if (!/Sitemap:\s*https:\/\/grapecrux\.com\/sitemap\.xml/i.test(robots)) fail('robots.txt has no canonical sitemap declaration');

  const sitemapResult = await request(new URL('/sitemap.xml', BASE));
  if (sitemapResult.response.status !== 200) {
    fail('sitemap.xml returned HTTP ' + sitemapResult.response.status);
    return report();
  }
  const sitemap = await sitemapResult.response.text();
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m => decode(m[1].trim()));
  if (!urls.length) fail('sitemap has no URLs');
  if (new Set(urls).size !== urls.length) fail('sitemap has duplicate URLs');
  PAGE_URLS = urls.filter(raw => {
    try {
      const u = new URL(raw);
      if (u.origin !== BASE.origin) { fail('Sitemap URL has a non-canonical host: ' + raw); return false; }
      if (u.search || u.hash) fail('Sitemap URL contains query/hash: ' + raw);
      if (disallowed(u.pathname, robots)) fail('Sitemap URL blocked by robots.txt: ' + raw);
      return true;
    } catch {
      fail('Invalid sitemap URL: ' + raw);
      return false;
    }
  });

  const linkTargets = new Set();
  await parallel(PAGE_URLS, WORKERS, async url => {
    const result = await request(url);
    const res = result.response;
    if (res.status !== 200) {
      fail(url + ' returned HTTP ' + res.status);
      if (res.body) await res.body.cancel().catch(() => {});
      return;
    }
    if (result.hops.length > 1) fail(url + ' has a redirect chain of ' + result.hops.length + ' hops');
    if (result.hops.length === 1) fail('Sitemap URL redirects; replace with the final URL: ' + url);
    const type = res.headers.get('content-type') || '';
    if (!/text\/html/i.test(type)) fail(url + ' is not served as HTML (' + type + ')');
    if (/\bnoindex\b/i.test(res.headers.get('x-robots-tag') || '')) fail(url + ' has X-Robots-Tag noindex');

    const html = await res.text();
    const title = extract(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const descTag = (html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i) || [,''])[1];
    const description = extract(descTag, /content=["']([^"']*)["']/i);
    const canonTag = (html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) || [,''])[1];
    const canonical = extract(canonTag, /href=["']([^"']+)["']/i);
    const robotsTag = (html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i) || [,''])[1];
    const robotsMeta = extract(robotsTag, /content=["']([^"']*)["']/i);
    const mainHtml = (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [,''])[1];
    const h1s = [...mainHtml.matchAll(/<h1\b[^>]*>/gi)];

    if (!title) fail(url + ' is missing a title');
    if (!description) fail(url + ' is missing a meta description');
    if (!canonical) fail(url + ' is missing a canonical URL');
    if (/\bnoindex\b/i.test(robotsMeta)) fail(url + ' has meta robots noindex');
    if (h1s.length !== 1) fail(url + ' has ' + h1s.length + ' H1 tags in initial main HTML');
    if (mainHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length < 80) fail(url + ' has insufficient initial HTML main content');

    if (title) {
      const key = title.toLowerCase();
      if (TITLES.has(key)) fail('Duplicate title "' + title + '" on ' + TITLES.get(key) + ' and ' + url);
      else TITLES.set(key, url);
    }
    if (canonical) {
      let canonicalUrl = '';
      try { canonicalUrl = new URL(canonical, result.finalUrl).href; }
      catch { fail(url + ' has malformed canonical ' + canonical); }
      if (canonicalUrl && canonicalUrl !== result.finalUrl.href) fail(url + ' canonical points to ' + canonicalUrl);
      if (canonicalUrl && CANONICALS.has(canonicalUrl)) fail('Canonical collision at ' + canonicalUrl);
      else if (canonicalUrl) CANONICALS.set(canonicalUrl, url);
    }

    for (const anchor of html.matchAll(/<a\b([^>]*)>/gi)) {
      const href = extract(anchor[1], /href=["']([^"']*)["']/i);
      if (!href || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
      try {
        const target = new URL(href, result.finalUrl);
        if (target.origin === BASE.origin) {
          target.hash = '';
          target.search = '';
          linkTargets.add(target.href);
        }
      } catch { fail(url + ' has malformed anchor href: ' + href); }
    }
  });

  LINK_URLS = [...linkTargets].slice(0, MAX_LINKS);
  if (linkTargets.size > MAX_LINKS) warn('Checked only ' + MAX_LINKS + ' of ' + linkTargets.size + ' internal link targets');
  await parallel(LINK_URLS, WORKERS, async url => {
    let result = await request(url, 'HEAD');
    if ([405, 501].includes(result.response.status)) {
      if (result.response.body) await result.response.body.cancel().catch(() => {});
      result = await request(url, 'GET');
      if (result.response.body) await result.response.body.cancel().catch(() => {});
    }
    if (result.response.status >= 400) fail('Broken internal link ' + url + ' returned HTTP ' + result.response.status);
    if (result.hops.length > 1) fail('Internal link has a redirect chain: ' + url);
  });

  const probeUrl = new URL('/__grapecrux_missing_' + Date.now() + '__/', BASE);
  const probe = await request(probeUrl);
  const probeHtml = await probe.response.text();
  if (probe.response.status !== 404) {
    const title = extract(probeHtml, /<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const h1 = extract(probeHtml, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    if (probe.response.status === 200 && /not found|404/i.test(title + ' ' + h1)) {
      fail('Soft 404: unknown URL returned HTTP 200 with not-found content');
    } else fail('Unknown URL should return HTTP 404, got ' + probe.response.status);
  }
  report();
}

main().catch(err => {
  fail(err.stack || err.message || String(err));
  report();
});
