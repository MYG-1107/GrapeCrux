/* Small dependency-free HTML metadata reader for the live SEO audit. */
function decodeHtmlAttribute(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * Read an HTML attribute without assuming its position in the tag.
 * Supports double-quoted, single-quoted and unquoted attribute values.
 */
export function readHtmlAttribute(tag, attributeName) {
  if (typeof tag !== 'string' || !tag) return '';
  const safeName = String(attributeName).replace(/[^a-z0-9_-]/gi, '');
  const pattern = new RegExp(
    '(?:^|\\s)' + safeName + '\\s*=\\s*(?:"([^"]*)"|\\'([^\\']*)\\'|([^\\s>]+))',
    'i'
  );
  const match = tag.match(pattern);
  if (!match) return '';
  return decodeHtmlAttribute(match[1] ?? match[2] ?? match[3] ?? '').trim();
}

/** Return a meta content value by name, independent of attribute order. */
export function findMetaContent(html, metaName) {
  if (typeof html !== 'string' || !html) return '';
  const expected = String(metaName || '').toLowerCase();
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (readHtmlAttribute(tag, 'name').toLowerCase() === expected) {
      return readHtmlAttribute(tag, 'content');
    }
  }
  return '';
}

/** Return the href of a canonical link, regardless of rel/href order. */
export function findCanonicalHref(html) {
  if (typeof html !== 'string' || !html) return '';
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const relTokens = readHtmlAttribute(tag, 'rel').toLowerCase().split(/\s+/).filter(Boolean);
    if (relTokens.includes('canonical')) {
      return readHtmlAttribute(tag, 'href');
    }
  }
  return '';
}
