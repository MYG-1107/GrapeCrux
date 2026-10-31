/* GrapeCrux Careers: role-aware fields and email-draft submission. No application data is stored. */
(() => {
  const form = document.getElementById('gc-careers-application-form');
  if (!form) return;

  const recipient = 'yaswanth@grapecrux.com';
  const typeSelect = document.getElementById('career-application-type');
  const roleSelect = document.getElementById('career-track');
  const fulltimeFields = document.getElementById('fulltime-fields');
  const internshipFields = document.getElementById('internship-fields');
  const status = document.getElementById('gc-careers-status');

  const roles = {
    'full-time': [
      'Senior Full-stack Developer',
      'AI Engineer',
      'Forward Deployment Engineer',
      'Quality Assurance Tester',
      'DevOps Engineer',
      'Big Data Engineer'
    ],
    internship: [
      'Software Developer Intern',
      'Prompt Engineer Intern',
      'AI Engineer Intern',
      'Python Developer Intern',
      '.NET Developer Intern',
      'Machine Learning Engineer Intern',
      'Data Analytics Intern'
    ]
  };

  const setFieldGroup = (kind) => {
    const isFullTime = kind === 'full-time';
    fulltimeFields.hidden = !isFullTime;
    fulltimeFields.disabled = !isFullTime;
    internshipFields.hidden = isFullTime || kind !== 'internship';
    internshipFields.disabled = isFullTime || kind !== 'internship';
  };

  const populateRoles = (kind, selectedRole = '') => {
    roleSelect.replaceChildren(new Option('Choose a role', ''));
    (roles[kind] || []).forEach((role) => roleSelect.add(new Option(role, role)));
    roleSelect.disabled = !roles[kind];
    if (selectedRole && (roles[kind] || []).includes(selectedRole)) roleSelect.value = selectedRole;
    else roleSelect.value = '';
  };

  typeSelect.addEventListener('change', () => {
    const kind = typeSelect.value;
    setFieldGroup(kind);
    populateRoles(kind);
  });

  document.querySelectorAll('.apply-career-role[data-kind][data-role]').forEach((button) => {
    button.addEventListener('click', () => {
      const kind = button.dataset.kind;
      const role = button.dataset.role;
      if (!roles[kind] || !roles[kind].includes(role)) return;
      typeSelect.value = kind;
      setFieldGroup(kind);
      populateRoles(kind, role);
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => roleSelect.focus({ preventScroll: true }), 350);
    });
  });

  // Start with both conditional field groups disabled until an opportunity type is selected.
  setFieldGroup('');
  populateRoles('');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const kind = String(data.get('application_type') || '');
    const role = String(data.get('role') || '');
    if (!roles[kind] || !roles[kind].includes(role)) {
      roleSelect.setCustomValidity('Choose a role from the selected opportunity type.');
      roleSelect.reportValidity();
      roleSelect.setCustomValidity('');
      return;
    }

    const common = [
      ['Applicant name', data.get('name')],
      ['Email address', data.get('email')],
      ['Phone number', data.get('phone')],
      ['Opportunity type', kind === 'full-time' ? 'Full-time position' : 'Internship'],
      ['Preferred role', role],
      ['Education / qualification', data.get('education')],
      ['Current status', data.get('current_status')]
    ];
    const roleSpecific = kind === 'full-time'
      ? [
          ['Total relevant experience', data.get('experience_years')],
          ['Current / most recent organisation', data.get('current_employer')],
          ['Designation', data.get('designation')],
          ['Time worked in that role', data.get('employment_duration')],
          ['Availability / notice period', data.get('notice_period')],
          ['Relevant experience and responsibilities', data.get('experience_summary')],
          ['Previous work impact', data.get('past_impact')],
          ['Potential impact at GrapeCrux', data.get('future_impact')]
        ]
      : [
          ['Expected / completed graduation year', data.get('graduation_year')],
          ['Projects, coursework or practical experience', data.get('project_summary')],
          ['Project learning or outcome', data.get('past_impact')],
          ['Potential contribution and learning goals', data.get('future_impact')]
        ];
    const links = [
      ['GitHub profile', data.get('github')],
      ['Portfolio', data.get('portfolio')],
      ['LinkedIn profile', data.get('linkedin')]
    ];
    const lines = [
      'GrapeCrux Careers Application',
      '--------------------------------',
      ...common.map(([label, value]) => `${label}: ${String(value || 'Not provided').trim()}`),
      '', 'Role-specific details:',
      ...roleSpecific.map(([label, value]) => `${label}: ${String(value || 'Not provided').trim()}`),
      '', 'Professional links:',
      ...links.map(([label, value]) => `${label}: ${String(value || 'Not provided').trim()}`),
      '', 'I have attached my resume / CV to this email.',
      'Submitted using the GrapeCrux careers page.'
    ];
    const subject = `[GrapeCrux ${kind === 'full-time' ? 'full-time application' : 'internship application'}] ${role}`;
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;

    status.textContent = 'Your email application is ready. Your email app should open a draft addressed to ' + recipient + '. Attach your resume, review the details and press Send. This website does not send or store the application.';
    status.classList.add('show');
    const retry = document.createElement('a');
    retry.href = mailto;
    retry.textContent = 'Open the application email again';
    retry.className = 'text-link';
    retry.style.display = 'inline-flex';
    retry.style.marginTop = '8px';
    status.append(document.createElement('br'), retry);
    window.location.href = mailto;
  });
})();
