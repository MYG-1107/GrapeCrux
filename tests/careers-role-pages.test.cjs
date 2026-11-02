const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const careers=read('careers/index.html');
const js=read('assets/js/careers.js');
const sitemap=read('sitemap.xml');
const header=read('includes/header.html');
const footer=read('includes/footer.html');
const mark=read('assets/images/grapecrux-mark.svg');
assert.ok(header.includes('/assets/images/grapecrux-mark.svg?v=20261102') && header.includes('brand-wordmark'), 'Shared header must use current transparent GrapeCrux mark and wordmark');
assert.ok(footer.includes('/assets/images/grapecrux-mark.svg?v=20261102') && footer.includes('brand-wordmark'), 'Shared footer must use the same GrapeCrux mark and wordmark');
assert.ok(mark.includes('viewBox="0 0 64 64"') && !mark.includes('<rect'), 'Brand mark must have a transparent background');
assert.ok(!header.includes('grapecrux_brand_logo.png') && !footer.includes('grapecrux_brand_logo.png'), 'Legacy logo must not remain in shared includes');
const jobs=[
['GC-FT-001','full-time/senior-full-stack-developer','Senior Full-stack Developer','full-time'],
['GC-FT-002','full-time/ai-engineer','AI Engineer','full-time'],
['GC-FT-003','full-time/forward-deployment-engineer','Forward Deployment Engineer','full-time'],
['GC-FT-004','full-time/quality-assurance-tester','Quality Assurance Tester','full-time'],
['GC-FT-005','full-time/devops-engineer','DevOps Engineer','full-time'],
['GC-FT-006','full-time/big-data-engineer','Big Data Engineer','full-time'],
['GC-IN-001','internships/software-developer-intern','Software Developer Intern','internship'],
['GC-IN-002','internships/prompt-engineer-intern','Prompt Engineer Intern','internship'],
['GC-IN-003','internships/ai-engineer-intern','AI Engineer Intern','internship'],
['GC-IN-004','internships/python-developer-intern','Python Developer Intern','internship'],
['GC-IN-005','internships/dotnet-developer-intern','.NET Developer Intern','internship'],
['GC-IN-006','internships/machine-learning-engineer-intern','Machine Learning Engineer Intern','internship'],
['GC-IN-007','internships/data-analytics-intern','Data Analytics Intern','internship']
];
assert.equal(jobs.length,13);
for(const [id,slug,title,kind] of jobs){
 const rel='careers/'+slug+'/index.html';
 assert.ok(fs.existsSync(path.join(root,rel)),'Missing '+rel);
 const page=read(rel);
 assert.ok(page.includes('<h1>'+title+'</h1'),id+' H1 mismatch');
 assert.ok(page.includes(id),id+' is not visible');
 assert.ok(page.includes('name="job_id" value="'+id+'"'),id+' missing form reference');
 assert.ok(page.includes('data-job-id="'+id+'"'),id+' missing Apply reference');
 assert.ok(page.includes('data-application-type="'+kind+'"'),id+' wrong application type');
 assert.ok(page.includes('name="twitter:title"')&&page.includes('property="og:title"'),id+' social tags missing');
 assert.ok(page.includes('name="description"')&&page.includes('rel="canonical"'),id+' SEO tags missing');
 assert.ok(page.includes('"@type":"WebPage"')&&page.includes('application/ld+json'),id+' page schema missing');
 assert.ok(!page.includes('"@type":"JobPosting"'),id+' has unsupported job schema');
 assert.ok(page.includes('G-QXMRMGJEP2')&&page.includes('googletagmanager.com/gtag/js'),id+' GA4 head snippet missing');
 assert.ok(page.includes('id="site-header"')&&page.includes('id="site-footer"')&&page.includes('id="gc-chatbot"'),id+' shared layout missing');
 assert.ok(page.includes('id="gc-careers-application-form"'),id+' application form missing');
 assert.ok(page.includes('name="role_interest"')&&page.includes('name="role_skills"')&&page.includes('name="role_specific_response"'),id+' role-specific questions missing');
 assert.equal((page.match(/id="career-job-id"/g)||[]).length,1,id+' must contain exactly one Job ID field');
 assert.ok(page.includes('Job ID:</span><strong>'+id+'</strong>'),id+' Job ID label must be spaced from the value');
 const activeId=kind==='full-time'?'fulltime-fields':'internship-fields';
 const activeFieldset=page.match(new RegExp('<fieldset class="career-fieldset" id="'+activeId+'"([^>]*)>'));
 assert.ok(activeFieldset&&!/disabled|hidden/.test(activeFieldset[1]),id+' selected form fields must be visible without JavaScript');
 assert.ok(page.includes('href="/assets/css/careers.css?v=20261102-careers"'),id+' Careers stylesheet must use a root-absolute URL');
 assert.ok(page.includes('src="/assets/js/careers.js"'),id+' Careers script must use a root-absolute URL');
 assert.ok(sitemap.includes('https://grapecrux.com/careers/'+slug+'/'),id+' sitemap entry missing');
 assert.ok(careers.includes('href="/careers/'+slug+'/" data-job-id="'+id+'"')&&careers.includes('target="_blank" rel="noopener noreferrer"'),id+' new-tab Careers link missing');
}
assert.ok(js.includes("['Job ID',jobId]"),'Email body must contain Job ID');
assert.ok(js.includes('[GrapeCrux application][${jobId}]'),'Email subject must contain Job ID');
assert.ok(js.includes("form.dataset.jobDetail === 'true'"),'Shared JS must support preselected detail page mode');
assert.ok(js.includes('roleQuestions')&&js.includes('updateRoleQuestion'),'Shared JS must load the selected role-specific question');
assert.ok(js.includes("data.get('role_interest')")&&js.includes("data.get('role_skills')")&&js.includes("data.get('role_specific_response')"),'Application email must include role-specific answers');
assert.ok(careers.includes('id="career-job-id" name="job_id"'),'Careers hub form must carry Job ID');
assert.ok(careers.includes('name="role_interest"')&&careers.includes('name="role_skills"')&&careers.includes('name="role_specific_response"'),'Careers hub must ask role-specific questions');
assert.ok(careers.includes('name="weekly_availability"')&&careers.includes('name="internship_start_availability"'),'Careers hub must ask internship schedule availability');
assert.ok(careers.includes('/assets/css/careers.css?v=20261102-careers'),'Careers hub must use root-absolute styling');
console.log('Careers role detail QA passed: 6 full-time pages + 7 internship pages, IDs, SEO, GA4, sitemap and preselected applications.');
