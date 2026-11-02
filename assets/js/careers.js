/* GrapeCrux Careers: shared role-aware application and Job ID handling.
 * Applications open an email draft; this static website does not receive or store applicant data.
 */
(() => {
  const form = document.getElementById('gc-careers-application-form');
  if (!form) return;

  const recipient = 'yaswanth@grapecrux.com';
  const typeSelect = document.getElementById('career-application-type');
  const roleSelect = document.getElementById('career-track');
  const jobIdField = document.getElementById('career-job-id');
  const fulltimeFields = document.getElementById('fulltime-fields');
  const internshipFields = document.getElementById('internship-fields');
  const status = document.getElementById('gc-careers-status');

  const roles = {
    'full-time': ['Senior Full-stack Developer','AI Engineer','Forward Deployment Engineer','Quality Assurance Tester','DevOps Engineer','Big Data Engineer'],
    internship: ['Software Developer Intern','Prompt Engineer Intern','AI Engineer Intern','Python Developer Intern','.NET Developer Intern','Machine Learning Engineer Intern','Data Analytics Intern']
  };
  const jobIds = {
    'Senior Full-stack Developer':'GC-FT-001','AI Engineer':'GC-FT-002','Forward Deployment Engineer':'GC-FT-003',
    'Quality Assurance Tester':'GC-FT-004','DevOps Engineer':'GC-FT-005','Big Data Engineer':'GC-FT-006',
    'Software Developer Intern':'GC-IN-001','Prompt Engineer Intern':'GC-IN-002','AI Engineer Intern':'GC-IN-003',
    'Python Developer Intern':'GC-IN-004','.NET Developer Intern':'GC-IN-005','Machine Learning Engineer Intern':'GC-IN-006','Data Analytics Intern':'GC-IN-007'
  };

  const setFieldGroup = (kind) => {
    const fulltime = kind === 'full-time';
    if (fulltimeFields) { fulltimeFields.hidden = !fulltime; fulltimeFields.disabled = !fulltime; }
    if (internshipFields) { internshipFields.hidden = fulltime || kind !== 'internship'; internshipFields.disabled = fulltime || kind !== 'internship'; }
  };
  const updateJobId = () => { if (jobIdField && roleSelect) jobIdField.value = jobIds[roleSelect.value] || ''; };
  const populateRoles = (kind, selectedRole = '') => {
    if (!(roleSelect instanceof HTMLSelectElement)) return;
    roleSelect.replaceChildren(new Option('Choose a role',''));
    (roles[kind] || []).forEach(role => roleSelect.add(new Option(role,role)));
    roleSelect.disabled = !roles[kind];
    roleSelect.value = selectedRole && (roles[kind] || []).includes(selectedRole) ? selectedRole : '';
    updateJobId();
  };

  const detailMode = form.dataset.jobDetail === 'true';
  if (detailMode) {
    const kind = form.dataset.applicationType || '';
    const role = form.dataset.role || '';
    const suppliedId = form.dataset.jobId || '';
    if (!roles[kind] || !roles[kind].includes(role) || jobIds[role] !== suppliedId) {
      if (status) { status.textContent = 'This job reference could not be verified. Please return to the Careers page and open the role again.'; status.classList.add('show'); }
      return;
    }
    typeSelect.value = kind;
    roleSelect.value = role;
    if (jobIdField) jobIdField.value = suppliedId;
    setFieldGroup(kind);
  } else {
    if (typeSelect instanceof HTMLSelectElement) typeSelect.addEventListener('change',() => { setFieldGroup(typeSelect.value); populateRoles(typeSelect.value); });
    if (roleSelect instanceof HTMLSelectElement) roleSelect.addEventListener('change',updateJobId);
    setFieldGroup('');
    populateRoles('');
  }

  form.addEventListener('submit',(event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const kind = String(data.get('application_type') || '');
    const role = String(data.get('role') || '');
    const jobId = jobIds[role] || '';
    const submittedId = String(data.get('job_id') || '');
    if (!roles[kind] || !roles[kind].includes(role)) {
      if (roleSelect instanceof HTMLSelectElement) { roleSelect.setCustomValidity('Choose a role from the selected opportunity type.'); roleSelect.reportValidity(); roleSelect.setCustomValidity(''); }
      else if (status) { status.textContent = 'The selected job could not be verified. Please reopen the role from Careers.'; status.classList.add('show'); }
      return;
    }
    if (!jobId || (submittedId && submittedId !== jobId)) {
      if (status) { status.textContent = 'The Job ID does not match the selected role. Please reload this job page and try again.'; status.classList.add('show'); }
      return;
    }

    const common = [
      ['Applicant name',data.get('name')],['Email address',data.get('email')],['Phone number',data.get('phone')],
      ['Opportunity type',kind === 'full-time' ? 'Full-time position' : 'Internship'],['Preferred role',role],['Job ID',jobId],
      ['Education / qualification',data.get('education')],['Current status',data.get('current_status')]
    ];
    const roleSpecific = kind === 'full-time'
      ? [['Total relevant experience',data.get('experience_years')],['Current / most recent organisation',data.get('current_employer')],['Designation',data.get('designation')],['Time worked in that role',data.get('employment_duration')],['Availability / notice period',data.get('notice_period')],['Relevant experience and responsibilities',data.get('experience_summary')],['Previous work impact',data.get('past_impact')],['Potential impact at GrapeCrux',data.get('future_impact')]]
      : [['Expected / completed graduation year',data.get('graduation_year')],['Projects, coursework or practical experience',data.get('project_summary')],['Project learning or outcome',data.get('past_impact')],['Potential contribution and learning goals',data.get('future_impact')]];
    const links = [['GitHub profile',data.get('github')],['Portfolio',data.get('portfolio')],['LinkedIn profile',data.get('linkedin')]];
    const lines = [
      'GrapeCrux Careers Application','--------------------------------',
      ...common.map(([label,value]) => `${label}: ${String(value || 'Not provided').trim()}`),
      '', 'Role-specific details:',
      ...roleSpecific.map(([label,value]) => `${label}: ${String(value || 'Not provided').trim()}`),
      '', 'Professional links:',
      ...links.map(([label,value]) => `${label}: ${String(value || 'Not provided').trim()}`),
      '', 'I have attached my resume / CV to this email.','Submitted using the GrapeCrux Careers page.'
    ];
    const subject = `[GrapeCrux application][${jobId}] ${role}`;
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    if (status) {
      status.textContent = 'Your email application is ready. Your email app should open a draft addressed to ' + recipient + ' with Job ID ' + jobId + '. Attach your resume, review the details and press Send. This website does not send or store the application.';
      status.classList.add('show');
      const retry = document.createElement('a'); retry.href = mailto; retry.textContent = 'Open the application email again'; retry.className = 'text-link'; retry.style.display = 'inline-flex'; retry.style.marginTop = '8px';
      status.append(document.createElement('br'),retry);
    }
    window.location.href = mailto;
  });
})();
