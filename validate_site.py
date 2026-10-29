#!/usr/bin/env python3
"""Static validation helper for the GrapeCrux package; run with python validate_site.py."""
from pathlib import Path
import re, sys
root = Path(__file__).resolve().parent
html_files = list(root.rglob('*.html'))
errors, warnings = [], []
for f in html_files:
    text = f.read_text(encoding='utf-8')
    rel = f.relative_to(root)
    if '<title>' not in text: errors.append(f'{rel}: missing title')
    if 'name="description"' not in text and 'name="robots" content="noindex"' not in text and 'http-equiv="refresh"' not in text: warnings.append(f'{rel}: missing description or non-indexable redirect/404')
    if rel.name == 'index.html' and rel.parts and rel.parts[-2:] == ('index.html',): pass
    for attr, url in re.findall(r'\b(href|src)="([^\"]+)"', text):
        if url.startswith(('http://','https://','mailto:','tel:','data:','#','javascript:','//')): continue
        if url.startswith('/'): continue  # runtime path rebasing; route checked manually
        target = (f.parent / url.split('#')[0].split('?')[0]).resolve()
        if not target.exists(): errors.append(f'{rel}: missing local {attr} target {url}')
    title_count = len(re.findall(r'<title>', text))
    if title_count != 1: errors.append(f'{rel}: expected one title, found {title_count}')
    if rel.name not in ('404.html',) and 'http-equiv="refresh"' not in text and 'canonical" href=' not in text: warnings.append(f'{rel}: check canonical URL')
if not (root/'robots.txt').exists(): errors.append('robots.txt missing')
if not (root/'sitemap.xml').exists(): errors.append('sitemap.xml missing')
if not (root/'CNAME').exists(): errors.append('CNAME missing')
print(f'Checked {len(html_files)} HTML files')
print(f'Errors: {len(errors)} | Warnings: {len(warnings)}')
for msg in errors: print('ERROR:', msg)
for msg in warnings: print('WARN:', msg)
if errors: sys.exit(1)
print('Static checks passed. Complete manual/browser checks from AUDIT-AND-RELEASE-NOTES.md before production.')
