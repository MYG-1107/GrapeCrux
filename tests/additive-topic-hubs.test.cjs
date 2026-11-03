const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sitemap = read('sitemap.xml');
const footer = read('includes/footer.html');
const insights = read('insights/index.html');
const topicPages = [
  {slug:'ai-automation', title:'AI & Automation'},
  {slug:'data-engineering', title:'Data Engineering & Big Data'},
  {slug:'cloud-devops', title:'Cloud & DevOps'},
  {slug:'cybersecurity', title:'Cybersecurity & Secure Engineering'}
];
assert.ok(insights.includes('/insights/website-project-planning/'), 'Existing website planning guide must remain');
assert.ok(insights.includes('/insights/ai-assistant-readiness/'), 'Existing AI assistant guide must remain');
assert.ok(insights.includes('/insights/website-launch-qa/'), 'Existing website launch QA guide must remain');
assert.ok(insights.includes('id="topic-guides-title"'), 'Additive topic section should be present');
assert.ok(insights.includes('"@type":"CollectionPage"'), 'Insights collection structured data should be present');
assert.ok(footer.includes('<li><a href="/blogs/">Blogs</a></li>'), 'Existing Blogs footer link must remain');
assert.ok(footer.includes('<li><a href="/insights/">Insights &amp; guides</a></li>'), 'New footer Insights link should be present');
for (const topic of topicPages) {
  const route = '/insights/topics/' + topic.slug + '/';
  const url = 'https://grapecrux.com' + route;
  const file = read('insights/topics/' + topic.slug + '/index.html');
  assert.ok(insights.includes('href="' + route + '"'), topic.slug + ' should be linked from Insights');
  assert.ok(sitemap.includes('<loc>' + url + '</loc>'), topic.slug + ' should be in sitemap');
  assert.ok(file.includes('<title>') && file.includes('name="description"'), topic.slug + ' should have title and description');
  assert.ok(file.includes('rel="canonical" href="' + url + '"'), topic.slug + ' should have exact canonical');
  assert.ok(file.includes('name="robots" content="index,follow'), topic.slug + ' should be indexable');
  assert.ok(file.includes("gtag('config','G-QXMRMGJEP2'"), topic.slug + ' should configure the existing GA4 ID');
  assert.ok(file.includes('googletagmanager.com/gtag/js?id=G-QXMRMGJEP2'), topic.slug + ' should load the Google tag');
  assert.ok(file.includes('id="site-header"') && file.includes('id="site-footer"'), topic.slug + ' should mount shared header and footer');
  assert.ok(file.includes('"@type":"CollectionPage"') && file.includes('"@type":"ItemList"'), topic.slug + ' should have collection structured data');
  assert.ok((file.match(/class="article-card"/g) || []).length === 6, topic.slug + ' should link six existing articles');
}
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(urls.length, new Set(urls).size, 'Sitemap must not have duplicate URLs');
console.log('Additive topic-hub QA passed: existing guides preserved, four topic hubs, 24 internal article links, footer link, schema, GA4 and sitemap verified.');
