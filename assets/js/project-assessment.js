(() => {
  'use strict';
  const form = document.getElementById('project-assessment-form');
  const result = document.getElementById('assessment-result');
  if (!form || !result) return;

  const routes = {
    'new-software': [
      ['Custom Software Development', '/services/custom-software-development/'],
      ['Product Engineering & SaaS', '/services/product-engineering/']
    ],
    website: [
      ['Web & App Development', '/services/web-development/'],
      ['Digital Growth & SEO', '/services/digital-growth/']
    ],
    mobile: [
      ['Mobile Application Development', '/services/mobile-application-development/'],
      ['Product Design & UX', '/services/product-design/']
    ],
    ai: [
      ['AI Integration & Development', '/services/ai-integration-development/'],
      ['AI & Automation', '/services/ai-automation/']
    ],
    automation: [
      ['Business Process Automation', '/services/business-process-automation/'],
      ['AI & Automation', '/services/ai-automation/']
    ],
    integration: [
      ['CRM & ERP Solutions', '/services/crm-erp-solutions/'],
      ['Data & System Integration', '/services/data-integration/']
    ],
    data: [
      ['Data Engineering & Analytics', '/services/data-engineering/'],
      ['Data & System Integration', '/services/data-integration/']
    ],
    quality: [
      ['Software Testing & Quality Engineering', '/services/software-testing/'],
      ['Quality Assurance & Consulting', '/services/quality-assurance/']
    ],
    cloud: [
      ['Cloud & DevOps', '/services/cloud-devops/'],
      ['Managed Support & Maintenance', '/services/managed-support/']
    ]
  };

  const descriptions = {
    'new-software': 'Start with requirements, user roles, scope, architecture and a phased delivery plan.',
    website: 'Review the site structure, user journeys, content, performance and the enquiry path.',
    mobile: 'Clarify supported devices, offline expectations, authentication, API needs and release testing.',
    ai: 'Define the task, approved knowledge sources, permissions, evaluation and human oversight.',
    automation: 'Map the current workflow, exceptions, approvals, source systems and measurable baseline.',
    integration: 'Identify data owners, source-of-truth rules, API access, retries and reconciliation.',
    data: 'Assess source data, quality, freshness, pipeline needs and the decisions reporting should support.',
    quality: 'Select critical user journeys, risk areas, acceptance criteria and the needed test coverage.',
    cloud: 'Review architecture, dependencies, deployment, monitoring, backup and operating costs.'
  };

  const makeLink = (label, href) => {
    const a = document.createElement('a');
    a.className = 'text-link';
    a.href = href;
    a.textContent = label + ' ↗';
    return a;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const goal = String(data.get('goal') || '');
    const choices = routes[goal] || [['Project enquiry', '/contact/']];
    const section = document.createElement('section');
    section.className = 'assessment-result-content';

    const badge = document.createElement('span');
    badge.className = 'section-kicker';
    badge.textContent = 'Suggested starting point';
    section.appendChild(badge);

    const heading = document.createElement('h2');
    heading.textContent = 'These service areas look relevant.';
    section.appendChild(heading);

    const intro = document.createElement('p');
    intro.textContent = descriptions[goal] || 'Share the requirement so the team can identify the right next step.';
    section.appendChild(intro);

    const list = document.createElement('div');
    list.className = 'assessment-recommendations';
    choices.forEach(([name, href], index) => {
      const card = document.createElement('article');
      card.className = 'assessment-recommendation';
      const h3 = document.createElement('h3');
      h3.textContent = (index === 0 ? 'Primary route: ' : 'Also consider: ') + name;
      const p = document.createElement('p');
      p.textContent = index === 0
        ? 'Review this capability first. The final scope depends on your current environment and requirements.'
        : 'This capability may complement the primary service depending on integrations and delivery scope.';
      card.append(h3, p, makeLink('Explore ' + name, href));
      list.appendChild(card);
    });
    section.appendChild(list);

    const summary = [
      'GrapeCrux project assessment',
      'Primary need: ' + goal,
      'Desired outcome: ' + (data.get('outcome') || ''),
      'Current systems: ' + (data.get('systems') || 'Not specified'),
      'Project stage: ' + (data.get('stage') || ''),
      'Additional context: ' + (data.get('context') || 'Not provided'),
      'Suggested services: ' + choices.map(x => x[0]).join('; ')
    ].join('\n');

    const summaryLabel = document.createElement('label');
    summaryLabel.className = 'assessment-summary-label';
    summaryLabel.textContent = 'Your project summary';
    const summaryArea = document.createElement('textarea');
    summaryArea.readOnly = true;
    summaryArea.rows = 8;
    summaryArea.value = summary;
    summaryArea.id = 'assessment-summary';
    summaryLabel.htmlFor = summaryArea.id;
    section.append(summaryLabel, summaryArea);

    const actions = document.createElement('div');
    actions.className = 'assessment-actions';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'btn btn-secondary';
    copy.textContent = 'Copy project summary';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summary);
        copy.textContent = 'Copied';
      } catch (_error) {
        summaryArea.focus();
        summaryArea.select();
        copy.textContent = 'Select and copy the summary';
      }
    });
    const contact = document.createElement('a');
    contact.className = 'btn btn-primary';
    contact.href = '/contact/?service=' + encodeURIComponent(choices[0][0]);
    contact.textContent = 'Continue to project enquiry ↗';
    actions.append(copy, contact);
    section.appendChild(actions);

    result.replaceChildren(section);
    if (window.GrapeCruxAnalytics?.track) {
      window.GrapeCruxAnalytics.track('project_assessment_complete', {
        primary_need: goal,
        recommended_service: choices[0][0],
        project_stage: String(data.get('stage') || 'unspecified')
      });
    }
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
