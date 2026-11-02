const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const careers=read('careers/index.html');
const js=read('assets/js/careers.js');
const sitemap=read('sitemap.xml');
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
 assert.ok(sitemap.includes('https://grapecrux.com/'+slug+'/'),id+' sitemap entry missing');
 assert.ok(careers.includes('href="/careers/'+slug+'/" data-job-id="'+id+'"')&&careers.includes('target="_blank" rel="noopener noreferrer"'),id+' new-tab Careers link missing');
}
assert.ok(js.includes("['Job ID',jobId]"),'Email body must contain Job ID');
assert.ok(js.includes('[GrapeCrux application][${jobId}]'),'Email subject must contain Job ID');
assert.ok(js.includes("form.dataset.jobDetail === 'true'"),'Shared JS must support preselected detail page mode');
assert.ok(careers.includes('id="career-job-id" name="job_id"'),'Careers hub form must carry Job ID');
console.log('Careers role detail QA passed: 6 full-time pages + 7 internship pages, IDs, SEO, GA4, sitemap and preselected applications.');
