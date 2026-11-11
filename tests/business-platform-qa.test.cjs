/* Static QA for the GrapeCrux business-visibility and enquiry release. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT,p),'utf8');
const exists = p => fs.existsSync(path.join(ROOT,p));

const requiredPages = [
  'services/custom-software-development/index.html',
  'services/business-process-automation/index.html',
  'services/ai-integration-development/index.html',
  'services/mobile-application-development/index.html',
  'services/data-engineering/index.html',
  'how-we-work/index.html','technologies/index.html','case-studies/index.html',
  'resources/index.html',
  'resources/ai-implementation-readiness/index.html',
  'resources/website-visibility-checklist/index.html',
  'resources/crm-integration-checklist/index.html',
  'resources/software-qa-checklist/index.html',
  'resources/cloud-migration-checklist/index.html',
  'resources/business-automation-opportunity-checklist/index.html',
  'project-assessment/index.html','lead-management/index.html'
];
for(const page of requiredPages) assert.ok(exists(page),'Missing page: '+page);

const homepage = read('index.html');
assert.match(homepage, /Software development, AI automation and digital solutions/i);
assert.match(homepage, /Who we help/i);
assert.match(homepage, /Business challenges we help solve/i);
assert.match(homepage, /Why work with GrapeCrux/i);
assert.equal((homepage.match(/<h1\b/gi)||[]).length,1,'Homepage must have exactly one H1');
assert.match(homepage,/#organization/);
assert.match(homepage,/#brand/);

const contact = read('contact/index.html');
for(const field of ['name','email','company','country','phone','service','project_type','budget_range','budget_currency','expected_start_date','existing_website','preferred_contact_method','message','privacy_consent','website','utm_source','landing_page']) {
  assert.match(contact,new RegExp('name="'+field+'"'),'Contact form missing '+field);
}
for(const service of ['Custom Software Development','Web &amp; App Development','Mobile Application Development','AI &amp; Automation','AI Integration &amp; Development','Business Process Automation','CRM &amp; ERP Solutions','Data Engineering &amp; Analytics','Data &amp; System Integration','Cloud &amp; DevOps','Software Testing','Quality Assurance &amp; Consulting','Product Engineering &amp; SaaS Development','Managed Support &amp; Maintenance']) {
  assert.ok(contact.includes(service),'Contact form service missing: '+service);
}
assert.match(contact,/privacy-consent/);
assert.match(contact,/<div class="honeypot" aria-hidden="true">/);
const businessCss = read('assets/css/business-platform.css');
assert.match(businessCss, /\.honeypot\s*\{/);
assert.match(businessCss, /clip-path:\s*inset\(50%\)/);
assert.match(businessCss, /pointer-events:\s*none/);
assert.doesNotMatch(contact,/email-draft-only|prepares an email draft/i);

const mainJs = read('assets/js/main.js');
assert.match(mainJs,/\/api\/enquiries/);
assert.match(mainJs,/generate_lead/);
assert.match(mainJs,/result\.received/);
assert.match(mainJs,/result\.reference/);
assert.match(mainJs,/Open email to service@grapecrux\.com/);
const config = read('assets/js/config.js');
assert.match(config,/GRAPECRUX_API_BASE_URL/);
assert.match(config,/form_start/);
assert.match(config,/email_click/);
assert.match(config,/phone_click/);
assert.match(config,/whatsapp_click/);

const blog = read('blogs/index.html');
const blogCount = (blog.match(/class="article-card blog-archive-item"/g)||[]).length;
assert.equal(blogCount,70,'Blog archive must contain all 70 static article cards');
assert.match(blog,/id="blog-search"/);
assert.match(blog,/id="blog-category"/);
assert.match(blog,/id="blog-pagination"/);
assert.ok(blog.includes('blog-archive.js'),'Blog archive script missing');
assert.ok(exists('assets/js/blog-archive.js'));

const services = read('services/index.html');
for(const route of ['custom-software-development','business-process-automation','ai-integration-development','mobile-application-development','data-engineering']) {
  assert.ok(services.includes('/services/'+route+'/'),'Services hub missing '+route);
}
const assessment = read('project-assessment/index.html');
assert.ok(assessment.includes('project-assessment.js'),'Project assessment script not included');
assert.ok(exists('assets/js/project-assessment.js'));
const admin = read('lead-management/index.html');
assert.match(admin,/name="robots" content="noindex,follow"/);
assert.ok(admin.includes('lead-management.js'),'Lead dashboard script not included');
assert.ok(exists('assets/js/lead-management.js'));
assert.ok(!read('sitemap.xml').includes('https://grapecrux.com/lead-management/'));
assert.ok(!read('robots.txt').includes('Disallow: /lead-management/'),'Noindex page must remain crawlable');

const footer = read('includes/footer.html');
for(const route of ['/how-we-work/','/technologies/','/case-studies/','/resources/','/project-assessment/']) {
  assert.ok(footer.includes('href="'+route+'"'),'Footer missing '+route);
}
const assistant = read('assets/js/assistant-knowledge.js');
for(const route of ['/project-assessment/','/how-we-work/','/technologies/','/case-studies/','/resources/','/services/business-process-automation/','/services/data-engineering/']) {
  assert.ok(assistant.includes(route),'Assistant knowledge missing '+route);
}

const backend = read('backend/main.py');
const serviceBlock = backend.match(/SERVICES = \\{([\\s\\S]*?)\\n\\}/);
assert.ok(serviceBlock, 'Backend service allowlist missing');
const allowedServices = [...serviceBlock[1].matchAll(/"([^"]+)"/g)].map(match => match[1]);
const formServices = [...contact.matchAll(/<option(?:\\s+value="[^"]*")?>([\\s\\S]*?)<\\/option>/gi)]
  .map(match => match[1].replace(/&amp;/g, '&').trim())
  .filter(value => value && value !== 'Choose a service');
for (const service of formServices) {
  assert.ok(allowedServices.includes(service), 'Contact option is rejected by backend: ' + service);
}

for(const item of ['@app.post("/api/enquiries"','idempotency_key','privacy_consent','notification_email_status','acknowledgement_email_status','@app.get("/api/admin/enquiries"','@app.patch("/api/admin/enquiries/{reference}"','@app.get("/api/admin/enquiries/export.csv"','hmac.compare_digest','TURNSTILE_SECRET_KEY','@app.get("/health")']) {
  assert.ok(backend.includes(item),'Backend feature missing: '+item);
}
assert.ok(exists('backend/.env.example'));
assert.ok(exists('backend/maintenance.py'));
assert.ok(exists('backend/tests/test_enquiries.py'));
assert.ok(read('backend/.env.example').includes('SMTP_PASSWORD='));
assert.ok(!/SMTP_PASSWORD=.{4,}/.test(read('backend/.env.example')),'Example environment must not contain a real password');

const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,134,'Expected 134 public sitemap URLs after this release');
assert.equal(urls.length,new Set(urls).size,'Sitemap URLs must be unique');
for(const url of urls) {
  const route = new URL(url).pathname.replace(/^\/|\/$/g,'');
  const target = path.join(ROOT,route,'index.html');
  assert.ok(exists(target),'Sitemap URL has no page file: '+url);
}
console.log('Business platform QA passed.');
console.log('New pages: '+requiredPages.length+'; blog cards: '+blogCount+'; sitemap URLs: '+urls.length+'.');
