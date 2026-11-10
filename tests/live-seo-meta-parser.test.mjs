import test from 'node:test';
import assert from 'node:assert/strict';
import { findMetaContent, findCanonicalHref, readHtmlAttribute } from '../scripts/html_meta_parser.mjs';

test('reads description when name appears before content', () => {
  const html = '<meta name="description" content="GrapeCrux builds useful business software.">';
  assert.equal(findMetaContent(html, 'description'), 'GrapeCrux builds useful business software.');
});

test('reads description when content appears before name', () => {
  const html = '<meta content="AI, software and digital engineering." name="description">';
  assert.equal(findMetaContent(html, 'description'), 'AI, software and digital engineering.');
});

test('supports single quotes, mixed case and HTML entities', () => {
  const html = "<META CONTENT='Research &amp; software engineering' NAME='Description'>";
  assert.equal(findMetaContent(html, 'description'), 'Research & software engineering');
});

test('reads the canonical href when rel appears before href', () => {
  const html = '<link rel="canonical" href="https://grapecrux.com/about/">';
  assert.equal(findCanonicalHref(html), 'https://grapecrux.com/about/');
});

test('reads the canonical href when href appears before rel', () => {
  const html = '<link href="https://grapecrux.com/blogs/" rel="canonical">';
  assert.equal(findCanonicalHref(html), 'https://grapecrux.com/blogs/');
});

test('finds canonical among other rel tokens', () => {
  const html = '<link rel="alternate canonical" href="https://grapecrux.com/">';
  assert.equal(findCanonicalHref(html), 'https://grapecrux.com/');
});

test('supports unquoted attribute values', () => {
  const html = '<meta name=description content=Simple-description>';
  assert.equal(findMetaContent(html, 'description'), 'Simple-description');
});

test('returns empty strings for genuinely missing metadata', () => {
  assert.equal(findMetaContent('<title>Home</title>', 'description'), '');
  assert.equal(findCanonicalHref('<link rel="stylesheet" href="/site.css">'), '');
  assert.equal(readHtmlAttribute(undefined, 'href'), '');
});

test('reads robots metadata independently', () => {
  const html = '<meta content="noindex,follow" name="robots">';
  assert.equal(findMetaContent(html, 'robots'), 'noindex,follow');
});
