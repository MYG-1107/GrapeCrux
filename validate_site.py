#!/usr/bin/env python3
"""GrapeCrux static QA validator: metadata, clean routes, shared layout, GA4 and accessibility basics."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
from xml.etree import ElementTree as ET
from collections import Counter
import re, sys

ROOT = Path(__file__).resolve().parent
GA_ID = 'G-QXMRMGJEP2'

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.links = []
        self.ids = []
        self.labels_for = set()
        self.fields = []
        self.in_head = False
        self.h1_count = 0
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'head':
            self.in_head = True
        self.tags.append((tag, d, self.in_head))
        if 'id' in d:
            self.ids.append(d['id'])
        if tag == 'h1':
            self.h1_count += 1
        if tag == 'label' and d.get('for'):
            self.labels_for.add(d['for'])
        if tag in ('input', 'select', 'textarea') and d.get('type') != 'hidden':
            self.fields.append((tag, d))
        if tag in ('a', 'script', 'img', 'link'):
            v = d.get('href') if tag in ('a', 'link') else d.get('src')
            if v:
                self.links.append((tag, v))
    def handle_endtag(self, tag):
        if tag == 'head':
            self.in_head = False

errors, warnings = [], []
html_docs = 0
content_pages = 0
indexable_pages = 0
canonical_seen = {}
sitemap_locs = []

for f in sorted(ROOT.rglob('*.html')):
    raw = f.read_text(encoding='utf-8', errors='replace')
    if '<html' not in raw.lower():
        continue
    html_docs += 1
    p = PageParser(); p.feed(raw)
    tags = p.tags
    title_tags = [d for t, d, _ in tags if t == 'title']
    descriptions = [d for t, d, _ in tags if t == 'meta' and d.get('name', '').lower() == 'description']
    canonicals = [d for t, d, _ in tags if t == 'link' and d.get('rel', '').lower() == 'canonical']
    noindex = bool(re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'][^"\']*noindex', raw, re.I))
    is_redirect = 'http-equiv="refresh"' in raw.lower()
    is_404 = f.name == '404.html'
    is_content = 'id="site-header"' in raw and 'id="site-footer"' in raw

    if not title_tags:
        errors.append(f'{f}: missing <title>')
    elif len(title_tags) != 1:
        errors.append(f'{f}: expected one <title>, found {len(title_tags)}')

    if not descriptions and not (is_redirect or is_404):
        errors.append(f'{f}: missing meta description')
    elif len(descriptions) > 1:
        errors.append(f'{f}: duplicate meta descriptions')

    if not canonicals and not (is_redirect or is_404):
        errors.append(f'{f}: missing canonical URL')
    elif len(canonicals) > 1:
        errors.append(f'{f}: duplicate canonical URLs')

    if is_content:
        content_pages += 1
        if p.h1_count != 1 and not is_404:
            errors.append(f'{f}: expected one h1, found {p.h1_count}')
        if 'assets/js/main.js' not in raw:
            errors.append(f'{f}: shared layout placeholders without main.js')
        if 'assets/js/assistant-knowledge.js' not in raw:
            errors.append(f'{f}: missing assistant knowledge module')
        # Google tag is a head-level script and must be present once per full content page.
        config_count = raw.count(f"gtag('config', '{GA_ID}'")
        if config_count != 1:
            errors.append(f'{f}: expected one GA4 config command, found {config_count}')
        tag_scripts = [(d, in_head) for t, d, in_head in tags if t == 'script' and GA_ID in d.get('src', '')]
        if len(tag_scripts) != 1 or not tag_scripts[0][1] or 'async' not in (tag_scripts[0][0].get('async') or ''):
            # HTMLParser stores a boolean async attribute as None, so check presence in raw instead.
            if len(tag_scripts) != 1 or not tag_scripts[0][1] or not re.search(r'<script[^>]+async[^>]+googletagmanager\.com/gtag/js\?id='+GA_ID, raw, re.I):
                errors.append(f'{f}: expected one async GA4 loader in <head>')
        if 'src="src=' in raw:
            errors.append(f'{f}: malformed nested script src attribute')

    if not is_redirect and not is_404 and not noindex:
        indexable_pages += 1
        if canonicals:
            canonical = canonicals[0].get('href', '')
            if canonical in canonical_seen:
                errors.append(f'{f}: duplicate canonical shared with {canonical_seen[canonical]}')
            else:
                canonical_seen[canonical] = f

    # Baseline accessibility and markup checks.
    duplicates = [i for i, n in Counter(p.ids).items() if n > 1]
    if duplicates:
        errors.append(f'{f}: duplicate id attributes: {duplicates[:5]}')
    for img in [d for t, d, _ in tags if t == 'img']:
        if 'alt' not in img:
            errors.append(f'{f}: image missing alt attribute: {img.get("src", "(unknown)")}')
    for tag, field in p.fields:
        fid = field.get('id')
        if fid and fid not in p.labels_for and not field.get('aria-label') and not field.get('aria-labelledby'):
            errors.append(f'{f}: {tag}#{fid} lacks an associated label')
    for t, d, _ in tags:
        if t == 'a' and d.get('target') == '_blank':
            rel = set((d.get('rel') or '').lower().split())
            if not {'noopener', 'noreferrer'}.issubset(rel):
                warnings.append(f'{f}: external blank-target link lacks noopener/noreferrer')

    # Verify local files and clean internal routes.
    for tag, value in p.links:
        if value.startswith(('http://', 'https://', 'mailto:', 'tel:', 'data:', '#', '//')):
            continue
        path = urlparse(value).path
        if not path:
            continue
        if path.startswith('/'):
            path = path.removeprefix('/GrapeCrux')
            target = ROOT / path.lstrip('/')
        else:
            target = (f.parent / path).resolve()
        if target.is_dir():
            target = target / 'index.html'
        if not target.exists():
            errors.append(f'{f}: broken local {tag} target {value}')

# Sitemap validation.
sitemap = ROOT / 'sitemap.xml'
try:
    tree = ET.parse(sitemap)
    sitemap_locs = [x.text for x in tree.getroot().iter() if x.tag.endswith('loc') and x.text]
    if len(sitemap_locs) != len(set(sitemap_locs)):
        errors.append('sitemap.xml: duplicate URL entries')
    for u in sitemap_locs:
        path = urlparse(u).path
        target = ROOT / path.lstrip('/')
        if target.is_dir():
            target = target / 'index.html'
        if not target.exists():
            errors.append(f'sitemap URL has no page: {u}')
        if target.exists():
            page_text = target.read_text(encoding='utf-8', errors='replace')
            if 'name="robots" content="noindex' in page_text.lower():
                errors.append(f'sitemap includes noindex page: {u}')
except Exception as e:
    errors.append(f'sitemap parse failed: {e}')

# Shared includes must not duplicate analytics tags or contain page-specific full documents.
for name in ('header.html', 'footer.html'):
    inc = ROOT / 'includes' / name
    if not inc.exists():
        errors.append(f'missing shared include: includes/{name}')
    elif GA_ID in inc.read_text(encoding='utf-8'):
        errors.append(f'{inc}: Google tag must remain in each page <head>, not in a body include')

robots = (ROOT / 'robots.txt').read_text(encoding='utf-8', errors='replace') if (ROOT / 'robots.txt').exists() else ''
if 'https://grapecrux.com/sitemap.xml' not in robots:
    errors.append('robots.txt: sitemap declaration missing')

print(f'HTML documents: {html_docs}; content pages with shared layout: {content_pages}; indexable pages: {indexable_pages}; sitemap URLs: {len(sitemap_locs)}')
print(f'Errors: {len(errors)}; warnings: {len(warnings)}')
for x in errors: print('ERROR:', x)
for x in warnings: print('WARN:', x)
sys.exit(1 if errors else 0)
