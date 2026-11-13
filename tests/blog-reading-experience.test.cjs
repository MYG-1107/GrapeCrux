'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const hub = read('blogs/index.html');
const archive = read('blogs/archive/index.html');
const sitemap = read('sitemap.xml');
const mainJs = read('assets/js/main.js');
const archiveJs = read('assets/js/blog-archive.js');
const css = read('assets/css/style.css');

assert.equal((hub.match(/class="article-card(?:\s|")/g) || []).length, 8, 'The public Blogs page should show eight selected guides');
assert.ok(hub.includes('Selected reading'), 'The hub should identify its curated section');
assert.ok(hub.includes('/blogs/archive/'), 'The hub should link to the full archive');
assert.ok(hub.includes('Other published GrapeCrux articles remain available'), 'The hub should explain that the remaining guides are still available');
assert.ok(hub.includes('id="topics"'), 'The hub should provide a topic directory');
assert.ok(hub.includes('"@type":"CollectionPage"') && hub.includes('"numberOfItems":8'), 'The hub should describe its selected guides in structured data');
assert.match(hub, /name="robots" content="index,follow/i);
assert.match(hub, /<link rel="canonical" href="https:\/\/grapecrux\.com\/blogs\/">/);

assert.ok(archive.includes('id="blog-archive-list"'), 'The full archive must render its article list in the source HTML');
assert.ok(archive.includes('id="blog-search"') && archive.includes('id="blog-category"'), 'The full archive must expose search and category filters');
assert.ok(archive.includes('id="blog-pagination"') && archive.includes('id="blog-next"'), 'The full archive must expose pagination');
assert.ok(archive.includes('id="blog-clear-filters"'), 'The archive must expose a clear-filters control');
assert.ok(!archive.includes('</a></div></article>'), 'Archive cards must not contain extra closing div elements');
assert.equal((archive.match(/class="article-card blog-archive-item"/g) || []).length, 78, 'The archive must contain all 78 article links in the original HTML');
assert.ok(archive.includes('"@type":"CollectionPage"') && archive.includes('"numberOfItems":78'), 'The archive structured data must describe the full library');
assert.match(archive, /name="robots" content="index,follow/i);
assert.match(archive, /<link rel="canonical" href="https:\/\/grapecrux\.com\/blogs\/archive\/">/);
assert.ok(archiveJs.includes('new URLSearchParams(window.location.search)'), 'Topic links must pre-filter the archive');
assert.ok(archiveJs.includes('blog-archive-empty'), 'The archive must display a no-results state');
assert.ok(archiveJs.includes("getElementById('blog-clear-filters')") && archiveJs.includes('cleanUrl.searchParams.delete'), 'The archive must support resetting search and category filters');

const blogRoot = path.join(root, 'blogs');
const articleSlugs = fs.readdirSync(blogRoot, {withFileTypes:true})
  .filter(entry => entry.isDirectory() && entry.name !== 'archive' && fs.existsSync(path.join(blogRoot, entry.name, 'index.html')))
  .map(entry => entry.name);
assert.equal(articleSlugs.length, 78, 'There must be 78 individual indexable article pages');

const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, 'The sitemap must not contain duplicate URLs');
assert.equal(sitemapUrls.length, 143, 'The sitemap should include the archive and four newly published guides');
assert.ok(sitemapUrls.includes('https://grapecrux.com/blogs/archive/'), 'The archive must be in the sitemap');
for (const slug of articleSlugs) {
  const url = 'https://grapecrux.com/blogs/' + slug + '/';
  const page = read('blogs/' + slug + '/index.html');
  assert.ok(sitemapUrls.includes(url), slug + ' must be discoverable in the sitemap');
  assert.match(page, /class="prose blog-prose(?:\\s|")/, slug + ' must use the shared reading layout');
  assert.ok(page.includes('name="keywords"') && page.includes('name="description"'), slug + ' must have SEO metadata');
  assert.ok(page.includes('"@type":"BlogPosting"'), slug + ' must have BlogPosting structured data');
  assert.ok(page.includes('grapecrux_brand_logo.png'), slug + ' must use the original GrapeCrux PNG favicon');
  assert.ok(!/name="robots"[^>]*noindex/i.test(page), slug + ' must remain indexable');
  assert.equal((page.match(/<h1\b/g) || []).length, 1, slug + ' must have one H1');
}

for (const slug of [
  'ai-coding-agents-in-software-delivery-2026',
  'model-context-protocol-mcp-security-enterprise-integrations',
  'post-quantum-cryptography-migration-for-software-teams',
  'software-bill-of-materials-sbom-2026-supply-chain-security'
]) {
  const page = read('blogs/' + slug + '/index.html');
  assert.ok((page.match(/<h2>/g) || []).length >= 7, slug + ' must have clearly divided sections');
  assert.ok((page.match(/<p>/g) || []).length >= 8, slug + ' must have substantial explanatory content');
  assert.ok(page.includes('Further reading'), slug + ' must cite primary sources');
  assert.ok(page.includes('Start a project'), slug + ' must link educational reading to a relevant service conversation');
}
assert.ok(mainJs.includes("className = 'blog-toc'"), 'Article headings must generate a navigable table of contents');
assert.ok(mainJs.includes('blog-reading-progress'), 'Article pages must display reading progress');
assert.ok(css.includes('.blog-prose') && css.includes('.blog-toc') && css.includes('.blog-archive-list'), 'Shared styles must cover articles, TOC and archive cards');
assert.ok(css.includes('.blog-toc-details') && css.includes('.blog-toc a[aria-current="location"]'), 'The article section navigator must be collapsible and identify the active section');
assert.ok(mainJs.includes('IntersectionObserver') && mainJs.includes('aria-current'), 'Article navigation must track the current section accessibly');
for (const slug of ['llm-inference-optimization-production-latency-cost','opentelemetry-genai-observability-tracing-rag-agents','secure-sandboxing-ai-coding-agents-execution','agent-to-agent-interoperability-mcp-a2a-enterprise']) {
  const page = read('blogs/' + slug + '/index.html');
  assert.ok(hub.includes('/blogs/' + slug + '/'), slug + ' must be discoverable from selected reading');
  assert.ok((page.match(/<h2>/g) || []).length >= 7, slug + ' must be divided into clear sections');
  assert.ok((page.match(/<p>/g) || []).length >= 8, slug + ' must have substantial explanatory content');
  assert.ok(page.includes('Further reading') && page.includes('Start a project'), slug + ' must link sources and related services');
}

console.log('Blog reading experience checks passed: curated hub, 78-article archive, 78 indexable articles, sitemap, SEO schema, section navigation and responsive styles.');
