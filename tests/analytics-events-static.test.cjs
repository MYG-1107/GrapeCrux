const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/config.js'), 'utf8');

for (const eventName of [
  'chat_open',
  'explore_services_click',
  'start_project_click',
  'outbound_link_click',
  'file_download',
  'chat_contact_click',
  'contact_cta_click',
  'service_page_click',
  'blog_article_click',
  'careers_page_click',
  'career_job_detail_click',
  'career_apply_cta_click',
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
assert.ok(source.includes("form.querySelector('[name=\"job_id\"]')"), 'Careers application events must include the job reference');
assert.ok(source.includes('new URL(href, window.location.href)'), 'Relative and absolute links must be resolved safely');
assert.ok(source.includes('targetUrl.origin !== window.location.origin'), 'Outbound links must be attributed separately');
assert.ok(source.includes('action.hasAttribute(\'download\')'), 'Download links must be tracked as file downloads');
assert.ok(!source.includes('link_url:'), 'Do not send arbitrary outbound URLs or query strings to analytics');
assert.ok(!/data\\.get\\(['"](?:name|email|phone|message|past_impact|future_impact)['"]\\)/.test(source), 'Do not send applicant PII or free text to analytics');
console.log('GrapeCrux GA4 event tests passed.');
