const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/config.js'), 'utf8');

for (const eventName of [
  'chat_open',
  'chat_contact_click',
  'contact_cta_click',
  'service_page_click',
  'blog_article_click',
  'careers_page_click',
  'careers_apply_click',
  'project_enquiry_email_draft_requested',
  'careers_application_email_draft_requested'
]) {
  assert.ok(source.includes(eventName), `Missing GA4 event: ${eventName}`);
}
assert.ok(source.includes("gc-analytics-consent-v1"), 'Must reuse the existing consent key');
assert.ok(source.includes("localStorage.getItem(CONSENT_KEY) === 'granted'"), 'Events must require analytics consent');
assert.ok(source.includes("form.id === 'project-form'"), 'Project enquiry form must be tracked');
assert.ok(source.includes("form.id === 'gc-careers-application-form'"), 'Careers form must be tracked');
assert.ok(!/data\.get\(['"](?:name|email|phone|message|past_impact|future_impact)['"]\)/.test(source), 'Do not send applicant PII or free-text content to analytics');
console.log('GrapeCrux GA4 event static checks passed.');
