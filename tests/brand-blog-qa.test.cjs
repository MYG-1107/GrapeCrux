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
  assert.match(html, /brand-mark-img/, `${name} must render the transparent brand mark`);
  assert.match(html, /brand-wordmark/, `${name} must render the brand wordmark`);
  assert.match(html, /<span>Grape<\\/span>/, `${name} must show Grape`);
  assert.match(html, /brand-wordmark-accent[^>]*>Crux<\\/span>/, `${name} must show Crux in the accent colour`);
  assert.match(html, /width:clamp\\(44px,3\\.6vw,50px\\)/, `${name} logo must be medium and responsive`);
  assert.match(html, /background:transparent;border:0;box-shadow:none;border-radius:0/, `${name} logo must not have a square background card`);
  assert.match(html, /aria-label="GrapeCrux home"/, `${name} lockup must be accessible`);
}

const featured = [...blog.matchAll(/href="\\/blogs\\/([a-z0-9-]+)\\/"/g)].map(m => m[1]);
const featuredUnique = [...new Set(featured)];
assert.equal(featuredUnique.length, 8, 'Blogs hub should feature exactly eight curated articles');
assert.match(blog, /Selected reading/, 'Curated page should be identified as selected reading');
assert.match(blog, /every published article remains available at its own URL/i, 'Hub should explain that other published guides still exist');

const blogRoot = path.join(root, 'blogs');
const articleSlugs = fs.readdirSync(blogRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(blogRoot, entry.name, 'index.html')))
  .map(entry => entry.name);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\\/loc>/g)].map(m => m[1]);
const sitemapSlugs = sitemapUrls.filter(url => url.includes('/blogs/') && !url.endsWith('/blogs/'))
  .map(url => url.split('/').filter(Boolean).at(-1));
assert.equal(sitemapSlugs.length, new Set(sitemapSlugs).size, 'Sitemap blog URLs must be unique');
assert.equal(articleSlugs.length, sitemapSlugs.length, 'Every published article detail page must appear in sitemap');
for (const slug of articleSlugs) {
  assert.ok(sitemapSlugs.includes(slug), `Sitemap must include published article: ${slug}`);
  const page = read(`blogs/${slug}/index.html`);
  assert.match(page, /name="robots" content="index,follow/i, `${slug} must remain indexable`);
  assert.match(page, /rel="canonical"/, `${slug} must have a canonical URL`);
  assert.match(page, /application\\/ld\\+json/, `${slug} must include structured data`);
  assert.match(page, /name="description"/, `${slug} must include a description`);
}
const unfeatured = articleSlugs.filter(slug => !featuredUnique.includes(slug));
assert.equal(unfeatured.length + featuredUnique.length, articleSlugs.length, 'Featured and unfeatured sets must account for every article');

const requiredSlugs = [
  'postgresql-query-performance-explained',
  'wcag-22-accessible-business-websites',
  'owasp-top-10-2025-web-application-security',
  'evaluating-ai-products-quality-latency-and-cost',
  'secure-cicd-pipelines-for-reliable-releases'
];
for (const slug of requiredSlugs) {
  assert.ok(articleSlugs.includes(slug), `New article page must exist: ${slug}`);
  assert.ok(sitemapSlugs.includes(slug), `New article must remain in sitemap: ${slug}`);
}
for (const topic of ['postgresql','wcag','owasp','ai evaluation','ci.?cd']) {
  assert.ok(new RegExp(topic, 'i').test(assistant), `Chatbot knowledge must cover ${topic}`);
}
console.log(`Brand, curation and article QA passed: ${articleSlugs.length} indexable article pages, ${featuredUnique.length} curated cards, ${unfeatured.length} unfeatured articles.`);
