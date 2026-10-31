/* GrapeCrux assistant knowledge base.
   Deterministic, curated FAQ content. This is not a generative AI model or a human agent. */
(() => {
  const answers = [

    [/\b(postgresql|postgres|query plan|explain analyze|slow sql|database performance)\b/i,
      'Our PostgreSQL guide explains how to investigate slow queries with EXPLAIN, choose indexes for real workloads, maintain statistics and monitor connections. Read https://grapecrux.com/blogs/postgresql-query-performance-explained/ or explore Data & System Integration at https://grapecrux.com/services/data-integration/.'],
    [/\b(wcag|accessibility|accessible website|screen reader|keyboard navigation)\b/i,
      'Our accessibility guide covers WCAG 2.2, keyboard access, semantic structure, accessible forms, contrast, touch targets and human testing. Read https://grapecrux.com/blogs/wcag-22-accessible-business-websites/ or explore Software Testing at https://grapecrux.com/services/software-testing/.'],
    [/\b(owasp|top 10 2025|web application security|secure web application|application security)\b/i,
      'Our OWASP Top 10:2025 guide covers access control, supply-chain risk, identity, data handling, injection, logging and security testing. Read https://grapecrux.com/blogs/owasp-top-10-2025-web-application-security/ or discuss an authorised QA/security scope at https://grapecrux.com/services/software-testing/.'],
    [/\b(ai evaluation|llm evaluation|evaluate ai|evaluate an ai|evaluate an ai product|model evaluation|ai accuracy|ai quality|latency and cost)\b/i,
      'Our AI evaluation guide explains test datasets, task success, groundedness, safety, latency, cost per successful task and human review. Read https://grapecrux.com/blogs/evaluating-ai-products-quality-latency-and-cost/ or explore AI & Automation at https://grapecrux.com/services/ai-automation/.'],
    [/\b(ci.?cd|deployment pipeline|github actions|devsecops|release pipeline|software release)\b/i,
      'Our CI/CD guide covers least-privilege workflows, secure secrets, trusted dependencies, build provenance, release checks and rollback planning. Read https://grapecrux.com/blogs/secure-cicd-pipelines-for-reliable-releases/ or explore Cloud & DevOps at https://grapecrux.com/services/cloud-devops/.'],
    [/\b(what is grapecrux|who are you|about grapecrux|what does grapecrux do)\b/i,
      'GrapeCrux is a creative initiative of Infinite Resource Creators Private Limited, an Indian private limited company incorporated in Pune on 27 November 2019. GrapeCrux brings creativity, technology, strategic thinking and purposeful execution together to explore practical digital solutions.'],
    [/\b(where are you|where is grapecrux|location|office|based|registered office)\b/i,
      'The registered office of Infinite Resource Creators Private Limited, the company behind GrapeCrux, is in Chinchwad MIDC, Pune, Maharashtra, India. The website does not list additional offices. See the About page for the registered-office address.'],
    [/\b(cin|incorporat|legal entity|registered company|parent company|company registration)\b/i,
      'The legal entity is Infinite Resource Creators Private Limited. The CIN displayed on the company profile is U74999PN2019PTC188068, and the stated incorporation date is 27 November 2019. GrapeCrux is its creative initiative, not a separate incorporated company.'],
    [/\b(job|jobs|full[- ]time|career|careers|internship|intern|vacanc|recruit|hiring|opening|position|opportunit)\b/i,
      'GrapeCrux lists six full-time roles: Senior Full-stack Developer, AI Engineer, Forward Deployment Engineer, Quality Assurance Tester, DevOps Engineer and Big Data Engineer. It also lists seven internship tracks: Software Developer, Prompt Engineer, AI Engineer, Python Developer, .NET Developer, Machine Learning Engineer and Data Analytics. Full-time roles are ongoing, with no pre-set end date stated on the Careers page. View roles and apply at https://grapecrux.com/careers/. Applications are addressed to yaswanth@grapecrux.com. To apply, choose a role and complete the matching form. Full-time applicants provide employment history and experience; internship applicants provide education, current status and project details. Attach your resume, review the email draft and press Send. The website does not upload or store applications.'],
    [/\b(resume|cv|how do i apply|application form|apply now|send my application|application email)\b/i,
      'Open https://grapecrux.com/careers/, choose a full-time role or internship track and complete the matching fields. Full-time applicants provide employment history and experience; internship applicants provide education, current status and project details. The form prepares an email for yaswanth@grapecrux.com. Attach your resume, review the draft and press Send in your email app. The website does not upload or store applications.'],
    [/\b(salary|stipend|pay|compensation|income|how much do you pay)\b/i,
      'Role-specific employment and internship terms are discussed with shortlisted applicants during the interview process. Please use the Careers page to review the available roles and submit an application: https://grapecrux.com/careers/.'],
    [/\b(how long|duration|fixed term|end date|permanent|ongoing employment)\b/i,
      'The full-time roles on the Careers page are ongoing opportunities and do not have a pre-set end date. Role expectations and applicable employment terms are discussed during recruitment and provided in the written terms. Internship arrangements are explained to shortlisted applicants.'],
    [/\b(blog|blogs|article|articles|resources|read more)\b/i,
      'The GrapeCrux Blogs page features a curated reading list on AI evaluation, agentic automation, RAG, PHP, PostgreSQL, accessibility, application security and reliable software delivery. Other published article pages remain available at their own URLs and in the XML sitemap, even when they are not featured on the Blogs page. Start at https://grapecrux.com/blogs/ or ask me about a specific topic.'],
    [/\b(php|pipe operator|uri extension|php 8\.5|php 8\.6)\b/i,
      'Our PHP article explains PHP 8.5 features such as the URI extension, pipe operator (|>), clone() property updates and the #[\NoDiscard] attribute. It also discusses patch updates and why beta versions should not be used in production. Read: https://grapecrux.com/blogs/php-85-practical-upgrade-guide/.'],
    [/\b(projects|portfolio|case studies|work examples|what have you built|show me your work|client work)\b/i,
      'The Work page currently presents illustrative concept directions for business websites, guided assistants and operational dashboards. These examples explain possible solution approaches; they are not represented as completed client engagements or verified case studies. Explore https://grapecrux.com/work/ or contact the team to discuss a project.'],
    [/\b(testimonial|testimonials|client review|reviews|customer feedback|client names)\b/i,
      'The public website does not currently publish verified client testimonials or named client endorsements. We do not invent reviews. The Work page labels its current examples as illustrative concepts rather than completed client projects.'],
    [/\b(industry|industries|sectors|who do you work with)\b/i,
      'GrapeCrux describes potential use cases across technology and SaaS, professional services, commerce and retail, education, operations and growing organisations. These are possible contexts for applying the published services, not claims of past clients in every industry.'],
    [/\b(how do you work|process|how do you execute|delivery steps|methodology|project phases)\b/i,
      'A typical engagement starts by understanding the business challenge and users, agreeing on outcomes and scope, shaping the experience and technical approach, building the solution, testing key journeys and then discussing launch and support. Deliverables, milestones and fees are agreed in writing for each project.'],
    [/\b(crm|customer relationship management|erp|salesforce|zoho|business systems)\b/i,
      'GrapeCrux can discuss CRM and ERP workflow discovery, configuration or custom development, integrations, data migration planning, permissions, user acceptance testing and handover. We focus on how your team captures leads, manages customer records, handles approvals and uses operational information. Explore https://grapecrux.com/services/crm-erp-solutions/ or contact service@grapecrux.com.'],
    [/\b(product engineering|product development|mvp|saas|multi[- ]tenant|build a product)\b/i,
      'GrapeCrux can support product discovery, MVP planning, UX, web application and SaaS engineering, API integration, testing and launch preparation. Multi-tenant access boundaries and data isolation should be part of the architecture and test plan. Explore https://grapecrux.com/services/product-engineering/.'],
    [/\b(software testing|manual testing|test automation|playwright|regression testing|api testing|performance testing|accessibility testing|test our software|test a product)\b/i,
      'GrapeCrux can support manual and exploratory QA, browser automation, API and integration testing, regression checks, performance assessment, accessibility reviews and release readiness. Security testing requires an explicitly authorised scope. Explore https://grapecrux.com/services/software-testing/.'],
    [/\b(managed support|maintenance|application support|website maintenance|incident support|monitoring support)\b/i,
      'GrapeCrux can discuss application maintenance, dependency updates, monitoring, backup and restore checks, incident triage, release support and documentation. Support hours, response expectations and coverage are defined in a written scope; 24/7 coverage is not assumed. Explore https://grapecrux.com/services/managed-support/.'],
    [/\b(cloud cost|cloud costs|finops|observability|opentelemetry|cost optimisation|cost optimization)\b/i,
      'GrapeCrux can review cloud service ownership, telemetry, alerting, deployment workflows, backup readiness and cost visibility. Optimisation should be based on workload evidence and agreed reliability requirements. Read our cloud observability guide: https://grapecrux.com/blogs/cloud-observability-and-cost-control-for-growing-products/.'],
    [/\b(secure api|api security|webhook|oauth|idempotency|api integration)\b/i,
      'A secure integration plan should cover least-privilege credentials, server-side authorisation, input validation, webhook verification, idempotent processing, bounded retries, monitoring and failure reconciliation. Read: https://grapecrux.com/blogs/secure-api-integrations-for-business-systems/ or discuss an integration at https://grapecrux.com/services/data-integration/.'],
    [/\b(crm implementation|crm adoption|crm migration)\b/i,
      'Our CRM guide covers workflow discovery, field design, migration rehearsals, role permissions, integrations and user adoption. Read: https://grapecrux.com/blogs/crm-implementation-that-teams-actually-use/.'],
    [/\b(saas mvp|multi tenant architecture|multi-tenant architecture|saas product)\b/i,
      'Our SaaS MVP article explains how to keep product scope focused while planning tenant isolation, identity, onboarding, billing, operations and testing. Read: https://grapecrux.com/blogs/engineering-a-saas-mvp-with-multi-tenant-safety/.'],
    [/\b(quality plan|testing strategy|qa strategy|test plan for web)\b/i,
      'Our product QA guide covers risk-based manual testing, browser automation, API checks, accessibility, performance and release gates. Read: https://grapecrux.com/blogs/a-practical-quality-plan-for-web-products/.'],
    [/\b(services|what services|what do you offer|capabilities|service list)\b/i,
      'GrapeCrux services include Web & App Development, AI & Automation, Product Design & UX, Brand Strategy, Digital Growth & SEO, Cloud & DevOps, Data & System Integration, Quality Assurance, CRM & ERP Solutions, Product Engineering and SaaS Development, Software Testing, and Managed Application Support. Explore https://grapecrux.com/services/.'],
    [/\b(guarantee|first place|number one|#1|rank first|top ranking|top of google|google ranking|ranking guarantee)\b/i,
      'No agency can responsibly guarantee a first-place Google ranking. Search visibility depends on competition, relevance, technical quality, site reputation, content and other changing factors. GrapeCrux can help with technical SEO, content structure and measurement, but results are not guaranteed.'],
    [/\b(price|pricing|cost|budget|quote|how much does a website cost|fee)\b/i,
      'Project pricing depends on scope, integrations, content, complexity, dependencies and delivery expectations. I cannot confirm a quote in chat. Share your requirements through https://grapecrux.com/contact/ so the team can review them.'],
    [/\b(website|web development|e-commerce|ecommerce|portal|app|application)\b/i,
      'Web & App Development can include responsive corporate websites, business portals, web applications, e-commerce experiences and API integrations. A useful brief identifies the audience, key tasks, required content or features, existing systems and success criteria.'],
    [/\b(ai|chatbot|automation|agent|llm|workflow|machine learning|rag)\b/i,
      'AI & Automation can include guided service assistants, retrieval-based knowledge tools, document workflows and integrations with business systems. A responsible project starts with a defined user task, approved source information, evaluation, clear fallbacks and privacy/security controls. The GrapeCrux website assistant itself uses curated FAQ answers unless an optional hosted model is configured.'],
    [/\b(design|ux|ui|prototype|wireframe|experience)\b/i,
      'Product Design & UX can cover discovery, user journeys, wireframes, clickable prototypes, interface systems and implementation handoff. The work starts by clarifying the audience, their most important tasks and the business outcome.'],
    [/\b(brand|logo|identity|visual)\b/i,
      'Brand Strategy & Visual Identity can include positioning, visual direction, logo systems, brand guidelines and digital collateral. The scope should reflect the audience, market, business differentiators and approved brand requirements.'],
    [/\b(seo|marketing|growth|traffic|search)\b/i,
      'Digital Growth & SEO can include technical SEO reviews, content planning, search-intent mapping, analytics and conversion improvements. No ranking position is guaranteed. Work should be measured against a baseline and reviewed over time.'],
    [/\b(cloud|devops|deploy|hosting|infrastructure|pipeline)\b/i,
      'Cloud & DevOps can cover deployment automation, CI/CD planning, monitoring, infrastructure reviews, backups and reliability improvements. The right scope depends on the existing technology stack, security needs and operating requirements.'],
    [/\b(test|qa|quality|bug|audit|testing)\b/i,
      'Quality Assurance & Technical Consulting can cover functional testing, responsive checks, accessibility reviews, performance checks and release readiness. A good QA plan records reproducible steps, expected results, risk and retest status.'],
    [/\b(integration|api|data|dashboard|database)\b/i,
      'Data & System Integration can include API connections, data processing, validation rules, database-backed features and operational dashboards. The first step is mapping systems, data owners, permissions and the decisions the information must support.'],
    [/\b(contact|email|talk|human|team|project enquiry|start a project|speak to|sales|book a call|meeting)\b/i,
      'For business and project enquiries, email service@grapecrux.com or use https://grapecrux.com/contact/. For careers applications, use https://grapecrux.com/careers/; the application draft is addressed to yaswanth@grapecrux.com.'],
    [/\b(certification|certified|iso|soc 2|accreditation|credentials)\b/i,
      'The public website does not currently list independently verified ISO, SOC 2 or other formal certifications. I cannot confirm credentials that are not published. Please contact service@grapecrux.com for current company documentation.'],
    [/\b(hello|hi|hey|good morning|good afternoon)\b/i,
      'Hello! I can help explain GrapeCrux, services, project enquiries, work examples, blogs and current careers opportunities. What would you like to explore?']
  ];

  const fallbacks = [
    'I do not have a verified answer for that detail yet. I can still help with services (https://grapecrux.com/services/), work examples (https://grapecrux.com/work/), blogs (https://grapecrux.com/blogs/), careers (https://grapecrux.com/careers/) or a project enquiry (https://grapecrux.com/contact/). For a company-specific answer, email service@grapecrux.com.',
    'That is outside the information I can confirm. Try asking about GrapeCrux services, current full-time roles, internship tracks, blog topics or how to start a project. You can also reach the team at service@grapecrux.com.',
    'I do not want to guess. The website has dedicated pages for Services, Work, Blogs, Careers and Contact. Tell me which area you mean, or email service@grapecrux.com for a confirmed response.'
  ];
  let fallbackIndex = 0;

  window.GrapeCruxKnowledge = {
    answerFor(message) {
      const text = String(message || '').trim();
      if (!text) return 'Please type a question about GrapeCrux, our services, projects, blogs or careers opportunities.';
      for (const [pattern, answer] of answers) if (pattern.test(text)) return answer;
      const answer = fallbacks[fallbackIndex % fallbacks.length];
      fallbackIndex += 1;
      return answer;
    }
  };
})();
