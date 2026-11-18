/* Regression checks for the Vaagdevi College of Engineering internship landing page. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT,file),'utf8');

const route = 'careers/internships/special-call-vaagdevi-college-of-engineering/';
const pagePath = route + 'index.html';
const confirmationPath = route + 'application-received/index.html';
const page = read(pagePath);
const confirmation = read(confirmationPath);
const css = read('assets/css/vaagdevi-internship.css');
const js = read('assets/js/vaagdevi-internship.js');
const sitemap = read('sitemap.xml');
const careers = read('careers/index.html');
const assistant = read('assets/js/assistant-knowledge.js');

assert.equal((page.match(/<h1\b/gi)||[]).length,1,'Landing page must have exactly one H1');
assert.match(page,/<title>Internship Opportunities for Vaagdevi College Students \| GrapeCrux<\/title>/);
assert.match(page,/<meta name="description"/);
assert.match(page,/<meta name="keywords"/);
assert.match(page,/<meta name="robots" content="index,follow/);
assert.match(page,/<link rel="canonical" href="https:\/\/grapecrux\.com\/careers\/internships\/special-call-vaagdevi-college-of-engineering\/">/);
assert.match(page,/property="og:title"/);
assert.match(page,/name="twitter:title"/);
assert.match(page,/"@type":"WebPage"/);
assert.match(page,/G-QXMRMGJEP2/);
assert.match(page,/id="site-header"/);
assert.match(page,/id="site-footer"/);
assert.match(page,/id="gc-chatbot"/);

const expectedRoles = [
  'Software Developer Intern',
  'Data Analytics Intern',
  'AI Intern',
  'Forward Deployment Intern',
  'QA Testing Intern'
];
for (const role of expectedRoles) {
  assert.ok(page.includes(role),'Missing internship role: '+role);
  assert.ok(page.includes('data-select-role="'+role+'"'),'Role card should preselect '+role);
  assert.ok(page.includes('<option>'+role+'</option>'),'Dropdown should include '+role);
}
const roleOptions = [...page.matchAll(/<option>([^<]+)<\/option>/g)].map(match=>match[1]).filter(x=>expectedRoles.includes(x));
assert.deepEqual(roleOptions,expectedRoles,'The role dropdown must contain the five requested roles in order');

assert.match(page,/There is no stipend or salary/);
assert.match(page,/No application, registration, training, security-deposit or participation fee/);
assert.match(page,/unpaid internship/i);
assert.match(page,/Vaagdevi College of Engineering/);
assert.match(page,/not be interpreted as a statement of formal college endorsement or partnership/);

const formMatch = page.match(/<form\b[\s\S]*?<\/form>/i);
assert.ok(formMatch,'Application form must be present');
const form = formMatch[0];
assert.match(form,/action="https:\/\/formsubmit\.co\/yaswanth@grapecrux\.com"/);
assert.match(form,/method="POST"/i);
assert.match(form,/enctype="multipart\/form-data"/i);
for (const field of ['Full name','Email address','Mobile number','College','Branch / Department','Current year of study','Preferred internship role','Skills and technologies','Reason for applying','Privacy acknowledgement']) {
  assert.ok(form.includes('name="'+field+'"'),'Missing application field: '+field);
}
assert.match(form,/name="attachment"/);
assert.match(form,/name="_next"/);
assert.match(form,/name="_honey"/);
assert.match(form,/required/);

const visibleText = page
  .replace(/<script\b[\s\S]*?<\/script>/gi,' ')
  .replace(/<form\b[\s\S]*?<\/form>/gi,' ')
  .replace(/<[^>]+>/g,' ')
  .replace(/&amp;/g,'&')
  .replace(/\s+/g,' ');
assert.doesNotMatch(visibleText,/yaswanth@grapecrux\.com/i,'Receiving email must not appear in visible page copy');

assert.match(js,/10 \* 1024 \* 1024/,'Resume must have a 10 MB maximum');
assert.match(js,/pdf\|doc\|docx/i,'Resume must support PDF, DOC and DOCX');
assert.match(js,/data-select-role/,'Role cards must select the dropdown role');
assert.match(js,/form_submit/,'Application form attempt should be tracked without personal information');
assert.doesNotMatch(js,/yaswanth@grapecrux\.com/i,'Recipient address should not be present in the client-side form script');

assert.match(css,/\.vce-hero-grid/);
assert.match(css,/\.vce-track-grid/);
assert.match(css,/\.vce-application-form/);
assert.match(css,/@media\(max-width:560px\)/);
assert.match(css,/focus-visible/);

assert.match(confirmation,/name="robots" content="noindex,follow"/);
assert.match(confirmation,/application-received/);
assert.match(confirmation,/does not mean that you have been shortlisted or selected/);
assert.ok(!sitemap.includes('application-received'),'Confirmation page must not be in sitemap');
assert.ok(sitemap.includes('https://grapecrux.com/'+route),'Landing page must be in sitemap');
assert.ok(careers.includes('/'+route),'Careers hub must link to the campus internship page');
assert.ok(assistant.toLowerCase().includes('vaagdevi internship'),'Assistant knowledge must include this campus opportunity');

console.log('Vaagdevi internship page QA passed: five roles, no-fee terms, hidden recipient, application flow, SEO and responsive styles.');
