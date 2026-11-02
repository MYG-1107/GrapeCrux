#!/usr/bin/env python3
"""Run from the root of the complete GrapeCrux repository."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
from xml.etree import ElementTree as ET
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
GA_ID = 'G-QXMRMGJEP2'

class Audit(HTMLParser):
    def __init__(self):
        super().__init__(); self.tags=[]; self.ids=[]; self.h1=0; self.in_head=False
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        if tag == 'head': self.in_head=True
        if tag == 'h1': self.h1 += 1
        if 'id' in d: self.ids.append(d['id'])
        self.tags.append((tag,d,self.in_head))
    def handle_endtag(self, tag):
        if tag == 'head': self.in_head=False

errors=[]; warnings=[]; pages=0; canonical_map={}
config_js=(ROOT/'assets/js/config.js').read_text(encoding='utf-8',errors='replace') if (ROOT/'assets/js/config.js').exists() else ''
for file in sorted(ROOT.rglob('*.html')):
    raw=file.read_text(encoding='utf-8',errors='replace')
    if '<html' not in raw.lower(): continue
    p=Audit(); p.feed(raw)
    tags=p.tags
    title=[d for t,d,_ in tags if t=='title']
    desc=[d for t,d,_ in tags if t=='meta' and d.get('name','').lower()=='description']
    canon=[d for t,d,_ in tags if t=='link' and d.get('rel','').lower()=='canonical']
    index_page='id="site-header"' in raw and 'id="site-footer"' in raw
    redirect='http-equiv="refresh"' in raw.lower()
    noindex=bool(re.search(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'][^"\']*noindex',raw,re.I))
    if not title: errors.append(f'{file}: missing title')
    if index_page and file.name != '404.html':
        pages += 1
        if len(title)!=1: errors.append(f'{file}: expected one title')
        if len(desc)!=1: errors.append(f'{file}: expected one description')
        if len(canon)!=1: errors.append(f'{file}: expected one canonical')
        if p.h1 != 1: errors.append(f'{file}: expected exactly one H1, got {p.h1}')
        if not re.search(r'<script[^>]+src=["\'][^"\']*assets/js/config\.js',raw): errors.append(f'{file}: config.js missing')
        if not re.search(r'<script[^>]+src=["\'][^"\']*assets/js/main\.js',raw): errors.append(f'{file}: main.js missing')
        if raw.count("gtag('config', '"+GA_ID+"'") > 1: errors.append(f'{file}: duplicate inline GA config calls')
        if not re.search(r"gtag\(['\"]consent['\"],\s*['\"]default['\"]",raw): errors.append(f'{file}: Consent Mode default missing')
        if canon:
            c=canon[0].get('href','')
            if c in canonical_map: errors.append(f'{file}: duplicate canonical with {canonical_map[c]}')
            canonical_map[c]=file
    if len(p.ids) != len(set(p.ids)):
        errors.append(f'{file}: duplicate HTML ids')
    for tag,d,_ in tags:
        if tag=='img' and 'alt' not in d: errors.append(f'{file}: image missing alt')
        if tag=='a' and d.get('target')=='_blank':
            rel=set((d.get('rel') or '').lower().split())
            if not {'noopener','noreferrer'}.issubset(rel): warnings.append(f'{file}: target=_blank should use noopener noreferrer')

if GA_ID not in config_js or "gtag('consent', 'default'" not in config_js or 'gaScript.async = true' not in config_js:
    errors.append('assets/js/config.js does not initialize GA4 with denied consent before async loading')

try:
    xml=ET.parse(ROOT/'sitemap.xml').getroot()
    ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls=[e.text for e in xml.findall('.//s:loc',ns)]
    if len(urls)!=len(set(urls)): errors.append('sitemap.xml contains duplicate URLs')
    for url in urls:
        path=Path(url.replace('https://grapecrux.com/','').strip('/'))
        target=(ROOT/path/'index.html') if str(path) != '.' else (ROOT/'index.html')
        if not target.exists(): errors.append(f'sitemap URL has no matching file: {url}')
except Exception as exc:
    errors.append(f'sitemap.xml could not be parsed: {exc}')

robots=ROOT/'robots.txt'
if not robots.exists() or 'Sitemap: https://grapecrux.com/sitemap.xml' not in robots.read_text(encoding='utf-8'):
    errors.append('robots.txt missing sitemap directive')

print(f'Clean page documents checked: {pages}')
print(f'Sitemap URLs checked: {len(urls) if "urls" in globals() else 0}')
print(f'Errors: {len(errors)}')
for item in errors: print('ERROR:',item)
print(f'Warnings: {len(warnings)}')
for item in warnings[:20]: print('WARN:',item)
sys.exit(1 if errors else 0)
