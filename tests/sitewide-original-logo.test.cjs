const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return walk(full);
  return full.endsWith('.html') ? [full] : [];
});

const pngPath = path.join(root, 'grapecrux_brand_logo.png');
const png = fs.readFileSync(pngPath);
assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'Repository logo must be a valid PNG');

const header = read('includes/header.html');
const footer = read('includes/footer.html');
for (const [label, html] of [['header', header], ['footer', footer]]) {
  assert.ok(html.includes('src="/grapecrux_brand_logo.png?v=20261102-original-png"'), label + ' must use the original repository PNG');
  assert.ok(html.includes('alt="Original GrapeCrux logo"'), label + ' must include descriptive alt text');
  assert.ok(html.includes('brand-wordmark') && html.includes('<span>Grape</span>') && html.includes('>Crux</span>'), label + ' must preserve the GrapeCrux wordmark');
  assert.ok(html.includes('background:transparent;border:0;box-shadow:none;border-radius:0'), label + ' must keep the PNG on a transparent, card-free background');
  assert.ok(html.includes('width:clamp(52px,4vw,58px)'), label + ' must use a responsive logo size');
}

const mainJs = read('assets/js/main.js');
assert.ok(mainJs.includes("withBase('/grapecrux_brand_logo.png?v=20261102-original-png')"), 'Chat assistant avatar should use the same original logo');

const home = read('index.html');
assert.ok(home.includes('href="/grapecrux_brand_logo.png?v=20261102-original-png"'), 'Homepage favicon must use original PNG');
assert.ok(home.includes('"url":"https://grapecrux.com/grapecrux_brand_logo.png"'), 'Organization schema logo must use original PNG');
const careers = read('careers/index.html');
assert.ok(careers.includes('href="/grapecrux_brand_logo.png?v=20261102-original-png"'), 'Careers favicon must use original PNG');
const notFound = read('404.html');
assert.ok(notFound.includes('href="/grapecrux_brand_logo.png?v=20261102-original-png"'), '404 favicon must use original PNG');

const htmlFiles = walk(root).filter(file => !file.split(path.sep).includes('includes'));
const iconPages = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const iconTags = [...html.matchAll(/<link[^>]*rel=["']icon["'][^>]*>/gi)].map(match => match[0]);
  if (!iconTags.length) continue;
  iconPages.push(file);
  for (const tag of iconTags) {
    assert.ok(tag.includes('grapecrux_brand_logo.png'), path.relative(root, file) + ' must use the original PNG as its browser icon');
    assert.ok(!tag.includes('favicon.svg') && !tag.includes('grapecrux-mark.svg'), path.relative(root, file) + ' must not use the substitute SVG mark');
  }
}
assert.ok(iconPages.length >= 70, 'Expected the original favicon to be present on all current indexable/redirect pages');
console.log('Original GrapeCrux PNG branding QA passed: shared header/footer, homepage schema, chatbot avatar and ' + iconPages.length + ' page favicons.');
