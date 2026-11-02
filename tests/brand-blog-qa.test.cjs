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
  assert.ok(html.includes('brand-mark-img'), `${name} must render the transparent brand mark`);
  assert.ok(html.includes('brand-wordmark'), `${name} must render the brand wordmark`);
  assert.ok(html.includes('<span>Grape</span>'), `${name} must show Grape`);
  assert.ok(html.includes('brand-wordmark-accent') && html.includes('>Crux</span>'), `${name} must show Crux in the accent colour`);
  assert.ok(html.includes('width:clamp(44px,3.6vw,50px)'), `${name} logo must be medium and responsive`);
  assert.ok(html.includes('background:transparent;border:0;box-shadow:none;border-radius:0'), `${name} logo must not have a square background card`);
  assert.ok(html.includes('aria-label="GrapeCrux home"'), `${name} lockup must be accessible`);
}

const featuredStart = blog.indexOf('<div class="article-list">');
const topicsStart = blog.indexOf('<p class="blog-archive-note"', featuredStart);
assert.ok(featuredStart >= 0 && topicsStart > featuredStart, 'Selected-reading section and archive note must exist');
const featuredSection = blog.slice(featuredStart, topicsStart);
const featured = [...featuredSection.matchAll(new RegExp('href="/blogs/([a-z0-9-]+)/"', 'g'))].map(m => m[1]);
const featuredUnique = [...new Set(featured)];
assert.equal(featuredUnique.length, 8, 'Blogs hub should feature exactly eight curated articles');
assert.ok(blog.includes('Selected reading'), 'Curated page should be identified as selected reading');
assert.ok(blog.includes('Other published GrapeCrux articles remain available at their individual URLs and are included in the XML sitemap'), 'Hub should explain where other published guides remain available');
assert.equal((blog.match(/class="blog-topic-section"/g) || []).length, 0, 'Unfeatured topic archives should not appear as hub article lists');

const blogRoot = path.join(root, 'blogs');
const articleSlugs = fs.readdirSync(blogRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(blogRoot, entry.name, 'index.html')))
  .map(entry => entry.name);
const sitemapUrls = [...sitemap.matchAll(new RegExp('<loc>([^<]+)</loc>', 'g'))].map(m => m[1]);
const sitemapSlugs = sitemapUrls.filter(url => url.includes('/blogs/') && !url.endsWith('/blogs/'))
  .map(url => url.split('/').filter(Boolean).at(-1));
assert.equal(sitemapSlugs.length, new Set(sitemapSlugs).size, 'Sitemap blog URLs must be unique');
assert.equal(articleSlugs.length, sitemapSlugs.length, 'Every published article detail page must appear in sitemap');
for (const slug of articleSlugs) {
  assert.ok(sitemapSlugs.includes(slug), `Sitemap must include published article: ${slug}`);
  const page = read(`blogs/${slug}/index.html`);
  assert.ok(page.includes('name="robots" content="index,follow'), `${slug} must remain indexable`);
  assert.ok(page.includes('rel="canonical"'), `${slug} must have a canonical URL`);
  assert.ok(page.includes('application/ld+json'), `${slug} must include structured data`);
  assert.ok(page.includes('name="description"'), `${slug} must include a description`);
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
