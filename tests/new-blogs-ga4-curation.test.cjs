const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sitemap = read('sitemap.xml');
const hub = read('blogs/index.html');
const slugs = [
  'agentic-ai-in-production-governance-evaluations-and-human-oversight',
  'small-language-models-vs-large-models-cost-latency-and-privacy',
  'graphrag-knowledge-graphs-enterprise-ai-retrieval',
  'ai-ready-data-quality-lineage-and-governance-checklist',
  'data-contracts-schema-evolution-and-reliable-data-products',
  'cloud-finops-for-ai-workloads-cost-observability-and-capacity',
  'confidential-computing-protecting-data-during-processing',
  'securing-ai-agents-prompt-injection-tool-permissions-and-secrets',
  'ransomware-resilience-immutable-backups-identity-and-recovery-drills',
  'real-time-streaming-data-architecture-event-time-late-events-and-quality'
];
assert.equal((hub.match(/class="article-card"/g) || []).length, 8, 'Blog hub should show only eight curated article cards');
for (const slug of slugs) {
  const url = 'https://grapecrux.com/blogs/' + slug + '/';
  const page = read('blogs/' + slug + '/index.html');
  assert.ok(!hub.includes('/blogs/' + slug + '/'), slug + ' should remain unfeatured on the blog hub');
  assert.ok(sitemap.includes('<loc>' + url + '</loc>'), slug + ' must remain in sitemap for discovery');
  assert.ok(page.includes('rel="canonical"') && page.includes(url), slug + ' must have the correct canonical');
  assert.ok(page.includes('name="description"') && page.includes('name="keywords"'), slug + ' must have SEO metadata');
  assert.ok(page.includes('application/ld+json') && page.includes('"@type":"BlogPosting"'), slug + ' must have BlogPosting schema');
  assert.ok(page.includes("gtag('config','G-QXMRMGJEP2'"), slug + ' must include the existing GA4 measurement ID');
  assert.ok(page.includes('googletagmanager.com/gtag/js?id=G-QXMRMGJEP2'), slug + ' must load the Google tag');
  assert.ok(page.includes('id="site-header"') && page.includes('id="site-footer"'), slug + ' must include shared header/footer mount points');
  assert.ok(page.includes('src="../../assets/js/main.js"'), slug + ' must load the shared header/footer behaviour');
  assert.ok(!/name=["']robots["'][^>]+noindex/i.test(page), slug + ' must remain indexable');
}
console.log('New blog QA passed: 10 standalone articles, curated hub remains at 8 cards, sitemap + SEO/schema + GA4 + shared header/footer verified.');
