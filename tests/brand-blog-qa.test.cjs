const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const header = read('includes/header.html');
const footer = read('includes/footer.html');
const blog = read('blogs/index.html');
const sitemap = read('sitemap.xml');
const assistant = read('assets/js/assistant-knowledge.js');

for (const [name, html] of [['header', header], ['footer', footer]]) {
  assert.match(html, /brand-mark-wrap/, `${name} must include the brand symbol wrapper`);
  assert.match(html, /brand-wordmark/, `${name} must include the wordmark`);
  assert.match(html, /<span>Grape<\/span>/, `${name} must show Grape`);
  assert.match(html, /brand-wordmark-accent[^>]*>Crux<\/span>/, `${name} must show Crux in the accent colour`);
  assert.match(html, /clamp\(44px,3\.6vw,50px\)/, `${name} logo mark must stay medium and responsive`);
  assert.match(html, /aria-label="GrapeCrux home"/, `${name} lockup must be accessible`);
}

const featured = [...blog.matchAll(/href="\/blogs\/([a-z0-9-]+)\/"/g)].map(m => m[1]);
const featuredUnique = [...new Set(featured)];
assert.equal(featuredUnique.length, 8, 'Blogs hub should feature exactly eight curated articles');
assert.match(blog, /Selected reading/, 'Curated page should be identified as selected reading');
assert.match(blog, /every published article remains available at its own URL/i, 'Hub should explain that other published guides still exist');

const blogUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).filter(url => url.includes('/blogs/') && !url.endsWith('/blogs/'));
const locations = blogUrls.map(url => url.split('/').filter(Boolean).at(-1));
const uniqueLocations = [...new Set(locations)];
assert.equal(locations.length, uniqueLocations.length, 'Sitemap blog URLs must be unique');
assert.equal(uniqueLocations.length, 21, 'All 21 article detail URLs should remain in the sitemap');
assert.equal(uniqueLocations.filter(slug => !featuredUnique.includes(slug)).length, 13, 'Thirteen unfeatured articles should remain discoverable but not listed on the hub');
const requiredSlugs = [
  'postgresql-query-performance-explained',
  'wcag-22-accessible-business-websites',
  'owasp-top-10-2025-web-application-security',
  'evaluating-ai-products-quality-latency-and-cost',
  'secure-cicd-pipelines-for-reliable-releases'
];
for (const slug of requiredSlugs) {
  assert.ok(uniqueLocations.includes(slug), `Sitemap must include ${slug}`);
  assert.ok(fs.existsSync(path.join(root, 'blogs', slug, 'index.html')), `Article page must exist: ${slug}`);
  const page = read(`blogs/${slug}/index.html`);
  assert.match(page, /name="robots" content="index,follow/, `${slug} must remain indexable`);
  assert.match(page, /rel="canonical"/, `${slug} must have a canonical URL`);
  assert.match(page, /application\/ld\+json/, `${slug} must include BlogPosting structured data`);
  assert.match(page, /name="description"/, `${slug} must include a meta description`);
  assert.ok((page.match(/<p>/g) || []).length >= 8, `${slug} should contain substantial article copy`);
}
for (const topic of ['postgresql','wcag','owasp','ai evaluation','ci.?cd']) {
  assert.ok(new RegExp(topic, 'i').test(assistant), `Chatbot knowledge must cover ${topic}`);
}
console.log(`Brand, blog curation, article indexing and chatbot QA passed: ${2 + 8 + requiredSlugs.length * 6 + 5} checks`);
