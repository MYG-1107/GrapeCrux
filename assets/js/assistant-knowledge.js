/* GrapeCrux assistant knowledge base.
   This is a deterministic, rule-based FAQ assistant, not a generative AI model or human agent.
   Keep answers aligned with published company information; never invent unverified proof. */
(() => {
  const answers = [
    [/\b(what is grapecrux|who are you|about grapecrux|what does grapecrux do)\b/i,
      'GrapeCrux is a creative initiative of Infinite Resource Creators Private Limited, an Indian private limited company incorporated in Pune on 27 November 2019. GrapeCrux is a brand initiative, not a separate legal entity. It brings creativity, technology, strategic thinking and innovation together to explore practical digital solutions and opportunities.'],
    [/\b(where are you|where is grapecrux|location|office|based|registered office)\b/i,
      'The registered office of Infinite Resource Creators Private Limited, the company behind GrapeCrux, is in Chinchwad MIDC, Pune, Maharashtra, India. The website does not list additional offices. Remote or on-site project arrangements, where relevant, are discussed and confirmed for each engagement. See the About page for the registered-office address.'],
    [/\b(cin|incorporat|legal entity|registered company|parent company|company registration)\b/i,
      'The legal entity is Infinite Resource Creators Private Limited. The CIN displayed on the company profile is U74999PN2019PTC188068, and the stated incorporation date is 27 November 2019. GrapeCrux is its creative initiative, not a separate incorporated company. Corporate details are presented as supplied by the company.'],
    [/\b(testimonial|testimonials|client review|reviews|customer feedback|client names)\b/i,
      'The public website does not currently publish verified client testimonials or named client endorsements. We do not invent reviews. The Work page labels its current examples as illustrative concepts rather than completed client projects.'],
    [/\b(projects|portfolio|case studies|work examples|what have you built|show me your work)\b/i,
      'The public Work page currently presents illustrative concept directions for a corporate digital presence, a service-discovery assistant and an operations dashboard. They demonstrate possible solution types; they are not represented as completed client engagements. Verifiable case studies can be added when project details and publication permission are available.'],
    [/\b(industry|industries|sectors|who do you work with)\b/i,
      'The site describes illustrative use cases for technology and SaaS, professional services, commerce and retail, education and knowledge-led teams, operations and internal teams, and growing organisations. These are potential contexts for applying the published services, not claims of past clients in every industry.'],
    [/\b(how do you work|process|how do you execute|delivery steps|methodology|project phases)\b/i,
      'A typical engagement is scoped in stages: understand the business challenge and users; agree on outcomes, scope and responsibilities; shape the experience and technical approach; build the agreed solution; test and validate key journeys; then launch and discuss any ongoing support. Exact deliverables, milestones, fees and timelines are agreed in writing for each project.'],
    [/\b(services|what services|what do you offer|capabilities|service list)\b/i,
      'The published service areas are: Web & App Development; AI & Automation; Product Design & UX; Brand Strategy & Visual Identity; Digital Growth & SEO; Cloud & DevOps; Data & System Integration; and Quality Assurance & Technical Consulting. Each service page explains potential scope and deliverables. Actual project scope is confirmed after discussion.'],
    [/\b(guarantee|first place|number one|#1|rank first|top ranking|top of google|google ranking|ranking guarantee)\b/i,
      'No agency can responsibly guarantee a first-place Google ranking. Search visibility depends on competition, relevance, technical quality, site reputation, content and other factors that change over time. GrapeCrux can help with technical SEO, content structure and measurement, but results are not guaranteed.'],
    [/\b(career|careers|internship|intern|job|vacanc|recruit|hiring|apply for an internship)\b/i,
      'The Careers page describes remote, three-month internship tracks in software development, AI / machine learning, data analytics, quality assurance and test automation, UI / UX design, cloud / DevOps, and business and digital marketing. The page currently shows an indicative stipend range of ₹5,000–₹10,000 per month and an expected commitment of about 20 hours per week; these are proposed terms that must be confirmed in a written offer. Applications are prepared as email drafts and are not stored by the website.'],
    [/\b(resume|cv|attach my|how do i apply|application process)\b/i,
      'Use the Careers page to choose an internship track and complete the short application form. It prepares an email draft to service@grapecrux.com; attach your resume before sending. The website does not upload or store the application. Do not send sensitive identity or banking information with an initial application.'],
    [/\b(stipend|salary|pay|compensation|internship amount)\b/i,
      'The Careers page currently lists an indicative internship stipend of ₹5,000–₹10,000 per month, depending on role and scope, and an expected commitment of about 20 hours per week. These are proposed programme terms, not a guaranteed payment offer. The exact stipend, schedule, dates and responsibilities must be confirmed in the written offer before accepting an internship.'],
    [/\b(blog|blogs|article|articles|resources|read more)\b/i,
      'The Blogs section contains practical articles on trustworthy AI assistants, AI application security, website performance and Core Web Vitals, useful service-page SEO, reliable API integrations, and quality engineering for AI-enabled products. Each article includes links to further technical resources.'],
    [/\b(price|pricing|cost|budget|quote|how much|fee)\b/i,
      'Project pricing depends on the agreed scope, integrations, content, complexity, dependencies and delivery expectations. I cannot confirm a price or quote in chat. Share your requirements through the project enquiry page so the team can review them.'],
    [/\b(website|web development|e-commerce|ecommerce|portal|app|application)\b/i,
      'Web & App Development can include responsive corporate websites, business portals, web applications, e-commerce experiences and API integrations. A useful starting brief identifies the audience, key tasks, required content or features, existing systems and success criteria.'],
    [/\b(is this chatbot ai|are you an ai|are you human|who am i chatting with|is this a real person)\b/i,
      'I am the GrapeCrux website FAQ assistant. This version matches questions to curated company information and is not a human representative or a live generative AI model. For questions requiring an employee or a confirmed business decision, contact service@grapecrux.com.'],
    [/\b(ai|chatbot|automation|agent|llm|workflow|machine learning)\b/i,
      'AI & Automation can include guided service assistants, internal knowledge tools, document workflows and integrations with business systems. A responsible project starts with a defined user task, approved source information, an evaluation plan, clear fallbacks and privacy/security controls. The GrapeCrux website assistant itself is a curated, rule-based FAQ—not a live generative AI service.'],
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
      'You can contact the team at service@grapecrux.com or use the project enquiry page. The current static form prepares an email in your email application; it does not submit the enquiry to or store it on a website server.'],
    [/\b(timeline|how long|when can you deliver|delivery date)\b/i,
      'Delivery timing depends on the project scope, content readiness, integrations, feedback cycles and dependencies. The team should confirm milestones and acceptance criteria in a written proposal rather than estimate from a short chat message.'],
    [/\b(certification|certified|iso|soc 2|accreditation|credentials)\b/i,
      'The public website does not currently list independently verified ISO, SOC 2 or other formal certifications. I cannot confirm credentials that are not published. Please contact service@grapecrux.com for any current company documentation.'],
    [/\b(hello|hi|hey|good morning|good afternoon)\b/i,
      'Hello! I can explain GrapeCrux, its services, process, industries, public work examples, blogs and internship tracks. What would you like to understand first?']
  ];
  window.GrapeCruxKnowledge = {
    answerFor(message) {
      const text = String(message || '').trim();
      if (!text) return 'Please type a question about GrapeCrux or the services you are considering.';
      for (const [pattern, answer] of answers) if (pattern.test(text)) return answer;
      return 'I can help with GrapeCrux company information, Pune registered-office details, services, industries, project examples, testimonials, blogs, internships and enquiry steps. I do not have verified information beyond the published website. Please contact service@grapecrux.com or use the Contact page for company-specific questions.';
    }
  };
})();
