const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const slugs=["ai-agent-identity-access-control-for-enterprise-workflows","ai-coding-agents-in-software-delivery-reviewable-development","evaluating-rag-applications-groundedness-retrieval-and-coverage","data-observability-freshness-schema-lineage-and-volume","data-warehouse-vs-lakehouse-choosing-analytics-architecture","platform-engineering-internal-developer-platforms","site-reliability-engineering-error-budgets-and-incident-learning","api-versioning-compatibility-and-safe-integration-evolution","software-supply-chain-security-sbom-provenance-and-dependency-hygiene","zero-trust-network-segmentation-for-modern-businesses","network-observability-dns-tls-latency-and-packet-loss","cloud-disaster-recovery-backup-retention-rto-rpo","healthcare-interoperability-hl7-fhir-practical-architecture","healthcare-data-quality-patient-identity-and-safe-exchange","cybersecurity-for-digital-health-platforms","clinical-ai-decision-support-validation-and-human-oversight","medical-device-software-lifecycle-cybersecurity-and-change-control","remote-patient-monitoring-integration-alerts-and-operational-reliability","secure-open-banking-apis-oauth-fapi-and-consent","payment-integration-security-pci-scope-tokenization-and-logging","financial-workflow-automation-reconciliation-auditability","business-system-modernization-crm-erp-integration-and-adoption","choose-software-development-partner-project-brief-and-evaluation","legacy-software-modernization-strangler-pattern-migration"];
const sitemap=read('sitemap.xml');
const blogHub=read('blogs/index.html');
const insights=read('insights/index.html');
const footer=read('includes/footer.html');
const home=read('index.html');
const services=read('services/index.html');
const contact=read('contact/index.html');
const mainJs=read('assets/js/main.js');
const work=read('work/index.html');
assert.equal(slugs.length,24,'Expected at least 20, specifically 24, new technical articles');
assert.equal((blogHub.match(/class="article-card"/g)||[]).length,8,'The curated Blogs page must keep its eight selected cards');
for(const slug of slugs){
 const url='https://grapecrux.com/blogs/'+slug+'/';
 const page=read('blogs/'+slug+'/index.html');
 assert.ok(!blogHub.includes('/blogs/'+slug+'/'),slug+' must not be added as a card to the curated Blogs hub');
 assert.ok(sitemap.includes('<loc>'+url+'</loc>'),slug+' must be discoverable through the sitemap');
 assert.ok(page.includes('rel="canonical" href="'+url+'"'),slug+' canonical URL mismatch');
 assert.ok(page.includes('name="description"')&&page.includes('name="keywords"'),slug+' metadata missing');
 assert.ok(page.includes('name="robots" content="index,follow'),slug+' must remain indexable');
 assert.ok(page.includes('"@type":"BlogPosting"'),slug+' BlogPosting schema missing');
 assert.ok(page.includes('gtag(\'config\',\'G-QXMRMGJEP2\''),slug+' GA4 config missing');
 assert.ok(page.includes('googletagmanager.com/gtag/js?id=G-QXMRMGJEP2'),slug+' GA4 loader missing');
 assert.ok(page.includes('id="site-header"')&&page.includes('id="site-footer"'),slug+' shared header/footer mounts missing');
 assert.ok(page.includes('src="../../assets/js/config.js"')&&page.includes('src="../../assets/js/main.js"'),slug+' shared scripts missing');
 assert.ok(page.includes('property="og:title"')&&page.includes('name="twitter:card"'),slug+' social metadata missing');
 assert.ok(page.includes('rel="noopener noreferrer"'),slug+' external references need safe target attributes');
 assert.ok((page.match(/<h2>/g)||[]).length>=7,slug+' should have structured section headings');
 assert.ok((page.match(/<p>/g)||[]).length>=8,slug+' should include substantial explanatory paragraphs');
}
const topics=['software-engineering','networking-infrastructure','healthcare-technology','financial-technology','business-technology'];
for(const slug of topics){
 const route='/insights/topics/'+slug+'/';
 const url='https://grapecrux.com'+route;
 const page=read('insights/topics/'+slug+'/index.html');
 assert.ok(insights.includes('href="'+route+'"'),slug+' must be linked from Insights');
 assert.ok(sitemap.includes('<loc>'+url+'</loc>'),slug+' topic hub must be in sitemap');
 assert.ok(page.includes('rel="canonical" href="'+url+'"'),slug+' canonical missing');
 assert.ok(page.includes('"@type":"CollectionPage"')&&page.includes('"@type":"ItemList"'),slug+' collection schema missing');
 assert.ok(page.includes('gtag(\'config\',\'G-QXMRMGJEP2\''),slug+' GA4 config missing');
 assert.ok(page.includes('googletagmanager.com/gtag/js?id=G-QXMRMGJEP2'),slug+' GA4 loader missing');
 assert.ok(page.includes('id="site-header"')&&page.includes('id="site-footer"'),slug+' shared layout missing');
 assert.ok((page.match(/class="article-card"/g)||[]).length>=6,slug+' should link at least six specialist guides');
}
for(const slug of ['ai-automation','data-engineering','cloud-devops','cybersecurity']){
 assert.ok(insights.includes('/insights/topics/'+slug+'/'),'Existing topic hub '+slug+' must remain linked');
 assert.ok(fs.existsSync(path.join(root,'insights/topics',slug,'index.html')),'Existing topic hub '+slug+' must remain on disk');
}
for(const original of ['/insights/website-project-planning/','/insights/ai-assistant-readiness/','/insights/website-launch-qa/']){
 assert.ok(insights.includes(original),'Original Insights guide must remain linked: '+original);
}
assert.ok(footer.includes('href="/insights/"'),'Footer Insights navigation must remain');
assert.ok(home.includes('id="client-deliverables-title"'),'Homepage client deliverables section missing');
assert.ok(home.includes('written project brief')&&home.includes('defined scope'),'Homepage must explain client outputs');
assert.ok(services.includes('id="scope-clarity-title"'),'Services scope transparency section missing');
assert.ok(services.includes('third-party licences'),'Services page must explain third-party costs');
for(const field of ['project_stage','project_outcome','existing_website','existing_systems']){
 assert.ok(contact.includes('name="'+field+'"'),'Contact form missing '+field);
 assert.ok(mainJs.includes("data.get('"+field+"')"),'Enquiry email must include '+field);
}
assert.ok(contact.includes('"@type":"ContactPage"'),'ContactPage schema missing');
assert.ok(contact.includes('action="https://formsubmit.co/service@grapecrux.com"'),'Contact form must forward enquiries to the business inbox');
assert.ok(contact.includes('The GrapeCrux website does not maintain a separate enquiry database'),'Contact form privacy disclosure must describe email-only handling');
assert.ok(work.includes('not completed client engagements'),'Portfolio must remain transparent about illustrative concepts');
const urls=sitemap.split('<loc>').slice(1).map(part=>part.split('</loc>')[0]);
assert.equal(urls.length,new Set(urls).size,'Sitemap must contain no duplicate URLs');
assert.equal(urls.length,118,'Sitemap should include the existing 89 URLs plus 24 articles and five topic hubs');
console.log('Client conversion and content expansion QA passed: 24 articles, 5 specialist hubs, 8-card blog curation, 4 existing hubs preserved, sitemap uniqueness and contact flow.');
