const assert = require('node:assert/strict');
global.window = global;
require('../assets/js/assistant-knowledge.js');
const ask = (q) => global.GrapeCruxKnowledge.answerFor(q);
const cases = [
  ['What is GrapeCrux?', /creative initiative.*Infinite Resource Creators/i],
  ['Where are you based?', /Pune, Maharashtra, India/i],
  ['What is your CIN?', /U74999PN2019PTC188068/i],
  ['What services do you provide?', /Web & App Development.*AI & Automation.*Quality Assurance.*CRM & ERP.*Product Engineering.*Managed Application Support/i],
  ['Tell me about CRM solutions', /CRM and ERP workflow discovery.*crm-erp-solutions/i],
  ['Can you test our software product?', /manual and exploratory QA.*software-testing/i],
  ['Can you help build a SaaS MVP?', /product discovery.*multi-tenant.*product-engineering/i],
  ['Do you provide application maintenance?', /application maintenance.*managed-support/i],
  ['How do you secure API integrations?', /least-privilege credentials.*secure-api-integrations/i],
  ['How can we control cloud costs?', /cloud service ownership.*cloud-observability-and-cost-control/i],
  ['Which jobs are open?', /six full-time roles.*Senior Full-stack Developer.*Forward Deployment Engineer.*Big Data Engineer.*seven internship tracks/i],
  ['Are full-time roles permanent?', /ongoing.*no pre-set end date/i],
  ['What internship tracks are available?', /Prompt Engineer.*Python Developer.*\.NET Developer.*Machine Learning Engineer.*Data Analytics/i],
  ['How do I apply for an internship?', /careers.*yaswanth@grapecrux.com.*Attach your resume/i],
  ['How do I apply for a full-time role?', /full-time applicants provide employment history/i],
  ['What is the salary?', /discussed with shortlisted applicants/i],
  ['What blogs are available?', /curated reading list.*AI evaluation.*PostgreSQL.*sitemap/i],
  ['How do I tune PostgreSQL queries?', /PostgreSQL guide.*EXPLAIN.*indexes/i],
  ['What is WCAG 2.2?', /accessibility guide.*WCAG 2\.2.*keyboard/i],
  ['What is the OWASP Top 10 2025?', /OWASP Top 10:2025.*access control/i],
  ['How should we evaluate an AI product?', /AI evaluation guide.*groundedness.*latency/i],
  ['How do we secure a CI/CD pipeline?', /CI\/CD guide.*least-privilege.*rollback/i],
  ['What changed in PHP 8.5?', /URI extension.*pipe operator/i],
  ['Show me your projects and testimonials', /illustrative concept directions|does not currently publish verified/i],
  ['Do you guarantee first place on Google?', /cannot guarantee|No agency can responsibly guarantee/i],
  ['How do you execute a project?', /understanding the business challenge.*agreeing on outcomes/i],
  ['How much does a website cost?', /cannot confirm a quote/i],
  ['Tell me about AI automation', /defined user task.*approved source information/i],
  ['Are you an AI?', /curated FAQ|GrapeCrux website assistant/i],
  ['Where can I submit my resume?', /careers.*yaswanth@grapecrux.com/i],
  ['How do I contact the team?', /service@grapecrux.com/i],
  ['Do you have ISO certifications?', /does not currently list independently verified/i]
];
for (const [q, pattern] of cases) {
  const answer = ask(q);
  assert.match(answer, pattern, `Unexpected answer for: ${q}\n${answer}`);
}
assert.match(ask(''), /Please type a question/);
const fallbackOne = ask('Can you tell me about an unpublished office event?');
const fallbackTwo = ask('Can you share another unlisted company detail?');
assert.notEqual(fallbackOne, fallbackTwo, 'Fallback replies should vary instead of repeating one generic message');
console.log(`Chatbot knowledge tests passed: ${cases.length + 3}/${cases.length + 3}`);
