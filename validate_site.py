#!/usr/bin/env python3
"""Offline structural QA for the GrapeCrux static website package."""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.in_title = False
        self.metas: dict[str, str] = {}
        self.links: list[str] = []
        self.assets: list[tuple[str, str]] = []
        self.ids: set[str] = set()
        self.fragment_links: list[tuple[str, str]] = []
        self.h1_count = 0

    def handle_starttag(self, tag: str, attrs) -> None:
        a = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "meta" and a.get("name"):
            self.metas[a["name"].lower()] = a.get("content", "")
        if tag == "h1":
            self.h1_count += 1
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "a" and a.get("href"):
            href = a["href"]
            self.links.append(href)
            if href.startswith("#") and len(href) > 1:
                self.fragment_links.append((href[1:], href))
        if tag in ("img", "script", "link"):
            attr = "src" if tag in ("img", "script") else "href"
            value = a.get(attr, "")
            if value:
                role = "image" if tag == "img" else ("script" if tag == "script" else "link")
                self.assets.append((role, value))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title += data


def is_external(value: str) -> bool:
    return value.startswith(("http://", "https://", "//", "data:", "mailto:", "tel:", "javascript:"))


def local_path(page: Path, value: str) -> Path | None:
    parsed = urlparse(value)
    path = parsed.path
    if not path or is_external(value):
        return None
    if path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = page.parent / path
    target = target.resolve()
    return target


def route_target(url_path: str) -> Path:
    path = url_path.lstrip("/")
    if not path:
        return ROOT / "index.html"
    target = ROOT / path
    if target.is_dir():
        target = target / "index.html"
    elif not target.exists() and not Path(path).suffix:
        target = target / "index.html"
    return target


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    # The shared header/footer are HTML fragments, not standalone page documents.
    pages = sorted(path for path in ROOT.rglob("*.html") if "includes" not in path.relative_to(ROOT).parts)
    canonical_seen: dict[str, Path] = {}
    indexable = 0
    noindex = 0
    parsed_pages: dict[Path, PageParser] = {}

    for page in pages:
        try:
            source = page.read_text(encoding="utf-8")
            parser = PageParser()
            parser.feed(source)
            parser.close()
            parsed_pages[page] = parser
        except Exception as exc:
            errors.append(f"{page.relative_to(ROOT)}: could not parse HTML: {exc}")
            continue

        # Every complete page must contain the GA4 tag exactly once inside <head>.
        loader = "https://www.googletagmanager.com/gtag/js?id=G-QXMRMGJEP2"
        config = "gtag('config', 'G-QXMRMGJEP2')"
        head_match = re.search(r"<head\b[^>]*>([\s\S]*?)</head>", source, re.I)
        if source.count(loader) != 1 or source.count(config) != 1:
            errors.append(f"{page.relative_to(ROOT)}: Google tag loader/config must appear exactly once")
        if not head_match or loader not in head_match.group(1) or config not in head_match.group(1):
            errors.append(f"{page.relative_to(ROOT)}: Google tag must be installed inside <head>")

        is_noindex = "noindex" in parser.metas.get("robots", "").lower()
        if not is_noindex or page.name == "404.html":
            if 'id="site-header"' not in source or 'id="site-footer"' not in source:
                errors.append(f"{page.relative_to(ROOT)}: shared header/footer placeholders are required")
            if "assets/js/main.js" not in source:
                errors.append(f"{page.relative_to(ROOT)}: shared include loader script is missing")

        if is_noindex:
            noindex += 1
        else:
            indexable += 1
            if not parser.title.strip():
                errors.append(f"{page.relative_to(ROOT)}: missing title")
            if not parser.metas.get("description", "").strip():
                errors.append(f"{page.relative_to(ROOT)}: missing meta description")
            match = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', source, re.I)
            if not match:
                errors.append(f"{page.relative_to(ROOT)}: missing canonical URL")
            else:
                canonical = match.group(1)
                if canonical in canonical_seen:
                    errors.append(f"{page.relative_to(ROOT)}: duplicate canonical also used by {canonical_seen[canonical].relative_to(ROOT)}")
                canonical_seen[canonical] = page
            if parser.h1_count != 1:
                warnings.append(f"{page.relative_to(ROOT)}: expected one H1, found {parser.h1_count}")

        for role, asset in parser.assets:
            if role == "link":
                # Check only stylesheets, icons and canonical assets which carry a local path.
                pass
            if is_external(asset) or asset.startswith("#"):
                continue
            target = local_path(page, asset)
            if target is not None and not target.exists():
                # The logo is intentionally retained from the current repository instead of
                # duplicated in this overlay ZIP. Users must keep grapecrux_brand_logo.png.
                if urlparse(asset).path.lstrip("/") == "grapecrux_brand_logo.png":
                    warnings.append(f"{page.relative_to(ROOT)}: keep existing repository asset {asset} when uploading this overlay")
                else:
                    errors.append(f"{page.relative_to(ROOT)}: missing local {role} target {asset}")

        for href in parser.links:
            if href.startswith("/") and not href.startswith("//"):
                path = urlparse(href).path
                target = route_target(path)
                if not target.exists():
                    errors.append(f"{page.relative_to(ROOT)}: broken internal route {href}")
            if re.search(r"\.html(?:$|[?#])", href, re.I):
                # The explicit legacy redirects themselves are allowed; normal site links should be clean.
                if not is_noindex:
                    warnings.append(f"{page.relative_to(ROOT)}: internal link exposes .html: {href}")

    # Check same-document fragment links after every page has been parsed.
    for page, parser in parsed_pages.items():
        for fragment, original in parser.fragment_links:
            if fragment not in parser.ids:
                warnings.append(f"{page.relative_to(ROOT)}: missing fragment target {original}")

    for include_name in ("header.html", "footer.html"):
        include_path = ROOT / "includes" / include_name
        if not include_path.exists():
            errors.append(f"missing shared include: includes/{include_name}")

    # The existing brand PNG is kept in the user's current repository and is not duplicated
    # in this overlay archive. Flag it clearly if this package is tested in isolation.
    if not (ROOT / "grapecrux_brand_logo.png").exists():
        warnings.append("grapecrux_brand_logo.png is retained from the current repository; preserve it when uploading this overlay")

    sitemap_urls: list[str] = []
    sitemap = ROOT / "sitemap.xml"
    try:
        xml_root = ET.parse(sitemap).getroot()
        sitemap_urls = [element.text.strip() for element in xml_root.iter() if element.tag.endswith("loc") and element.text]
        for url in sitemap_urls:
            target = route_target(urlparse(url).path)
            if not target.exists():
                errors.append(f"sitemap URL has no page: {url}")
        if len(sitemap_urls) != len(set(sitemap_urls)):
            errors.append("sitemap.xml contains duplicate URLs")
    except Exception as exc:
        errors.append(f"sitemap.xml is invalid: {exc}")

    cname = ROOT / "CNAME"
    if not cname.exists() or cname.read_text(encoding="utf-8").strip() != "grapecrux.com":
        errors.append("CNAME missing or not set to grapecrux.com")
    robots = ROOT / "robots.txt"
    if not robots.exists() or "sitemap.xml" not in robots.read_text(encoding="utf-8").lower():
        warnings.append("robots.txt does not reference sitemap.xml")

    print(f"Checked {len(pages)} HTML files")
    print(f"Indexable pages: {indexable} | noindex pages: {noindex} | sitemap URLs: {len(sitemap_urls)}")
    print(f"Errors: {len(errors)} | Warnings: {len(warnings)}")
    for item in errors:
        print("ERROR:", item)
    for item in warnings:
        print("WARNING:", item)
    if errors:
        return 1
    print("Static structural checks passed. Live browser, hosting, email delivery, and SEO indexing still require post-deployment verification.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
