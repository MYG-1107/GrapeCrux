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
  const roleQuestions = {
    'Senior Full-stack Developer': 'Describe a web application or feature you helped deliver across frontend and backend. What design decision or trade-off did you make?',
    'AI Engineer': 'Describe an AI or machine-learning feature, workflow or experiment you built or evaluated. How did you measure quality and handle failure cases?',
    'Forward Deployment Engineer': 'Give an example of how you turned an unclear user or business need into a working technical solution. How did you validate it with the people involved?',
    'Quality Assurance Tester': 'Describe a difficult defect or quality risk you found. How did you reproduce it, communicate it and verify the fix?',
    'DevOps Engineer': 'Describe a deployment, infrastructure or reliability problem you helped solve. What did you change and how did you verify the result?',
    'Big Data Engineer': 'Describe a data pipeline or data-quality challenge you worked on. How did you validate correctness and monitor the workflow?',
    'Software Developer Intern': 'Describe a software project or feature you built. What did you personally implement, debug and test?',
    'Prompt Engineer Intern': 'Give an example of a prompt or AI workflow you improved. How did you compare outputs and decide whether the result was better?',
    'AI Engineer Intern': 'Describe an AI experiment or model/API integration you have tried. What did you test, what did you learn and what limitations did you notice?',
    'Python Developer Intern': 'Describe a Python script, API or application you built. How did you structure, debug and test it?',
    '.NET Developer Intern': 'Describe any C# or .NET coursework or project. Which parts did you implement and how did you test them?',
    'Machine Learning Engineer Intern': 'Describe a dataset or machine-learning experiment you completed. How did you prepare or split the data and evaluate the model?',
    'Data Analytics Intern': 'Describe an analysis you completed. Which tools, metrics and data checks helped you reach a reliable conclusion?'
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
  const questionLabel = document.getElementById('career-specific-question-label');
  const questionField = document.getElementById('career-specific-response');
  const updateRoleQuestion = (role) => {
    const question = roleQuestions[role] || 'Select a role above to see a question tailored to that opportunity.';
    if (questionLabel) questionLabel.textContent = question + ' *';
    if (questionField) {
      questionField.placeholder = role
        ? 'Use a specific example. Explain the challenge, your contribution, tools or approach, and the result or lesson.'
        : 'Choose a role above to load its question before answering.';
    }
  };
  const populateRoles = (kind, selectedRole = '') => {
    if (!(roleSelect instanceof HTMLSelectElement)) return;
    roleSelect.replaceChildren(new Option('Choose a role',''));
    (roles[kind] || []).forEach(role => roleSelect.add(new Option(role,role)));
    roleSelect.disabled = !roles[kind];
    roleSelect.value = selectedRole && (roles[kind] || []).includes(selectedRole) ? selectedRole : '';
    updateJobId();
    updateRoleQuestion(roleSelect.value);
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
    updateRoleQuestion(role);
    setFieldGroup(kind);
  } else {
    if (typeSelect instanceof HTMLSelectElement) typeSelect.addEventListener('change',() => { setFieldGroup(typeSelect.value); populateRoles(typeSelect.value); });
    if (roleSelect instanceof HTMLSelectElement) roleSelect.addEventListener('change',() => { updateJobId(); updateRoleQuestion(roleSelect.value); });
    setFieldGroup('');
    populateRoles('');
  }

  form.addEventListener('submit',(event) => {
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }
    const data = new FormData(form);
    const kind = String(data.get('application_type') || '');
    const role = String(data.get('role') || '');
    const jobId = jobIds[role] || '';
    const submittedId = String(data.get('job_id') || '');
    if (!roles[kind] || !roles[kind].includes(role)) {
      event.preventDefault();
      if (roleSelect instanceof HTMLSelectElement) {
        roleSelect.setCustomValidity('Choose a role from the selected opportunity type.');
        roleSelect.reportValidity();
        roleSelect.setCustomValidity('');
      } else if (status) {
        status.textContent = 'The selected job could not be verified. Please reopen the role from Careers.';
        status.classList.add('show');
      }
      return;
    }
    if (!jobId || submittedId !== jobId) {
      event.preventDefault();
      if (status) {
        status.textContent = 'The Job ID does not match the selected role. Please reload this job page and try again.';
        status.classList.add('show');
      }
      return;
    }

    const attachment = form.querySelector('[name="attachment"]');
    const file = attachment?.files?.[0];
    if (file) {
      const isSupported = /\\.(pdf|doc|docx)$/i.test(file.name);
      const withinLimit = file.size <= 10 * 1024 * 1024;
      if (!isSupported || !withinLimit) {
        event.preventDefault();
        if (status) {
          status.textContent = !isSupported
            ? 'Please attach a PDF, DOC or DOCX resume.'
            : 'The resume must be 10 MB or smaller.';
          status.classList.add('show');
        }
        attachment?.focus();
        return;
      }
    }

    const subject = `[GrapeCrux application][${jobId}] ${role}`;
    const subjectField = form.querySelector('[name="_subject"]');
    const replyField = form.querySelector('[name="_replyto"]');
    const nextField = form.querySelector('[name="_next"]');
    if (subjectField) subjectField.value = subject;
    if (replyField) replyField.value = String(data.get('email') || '').trim();
    if (nextField) nextField.value = `https://grapecrux.com/careers/application-received/?job_id=${encodeURIComponent(jobId)}`;

    if (status) {
      status.textContent = 'Submitting your application for email delivery to ' + recipient + '…';
      status.classList.add('show');
      status.classList.remove('is-error');
    }
    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Submitting application…';
    }

  });
})();
