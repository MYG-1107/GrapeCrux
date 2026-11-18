(() => {
  'use strict';
  const form = document.getElementById('vce-internship-application');
  if (!form) return;

  const role = document.getElementById('vce-role');
  const email = document.getElementById('vce-email');
  const resume = document.getElementById('vce-resume');
  const subject = document.getElementById('vce-form-subject');
  const replyTo = document.getElementById('vce-form-replyto');
  const status = document.getElementById('vce-form-status');
  const submit = document.getElementById('vce-submit');

  document.querySelectorAll('[data-select-role]').forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.getAttribute('data-select-role') || '';
      if (role) role.value = selected;
      document.getElementById('application')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => role?.focus({ preventScroll: true }), 350);
    });
  });

  form.addEventListener('submit', event => {
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }
    const file = resume?.files?.[0];
    if (file) {
      const supported = /\.(pdf|doc|docx)$/i.test(file.name);
      const sizeOk = file.size <= 10 * 1024 * 1024;
      if (!supported || !sizeOk) {
        event.preventDefault();
        if (status) {
          status.textContent = supported
            ? 'The resume must be 10 MB or smaller.'
            : 'Please attach a PDF, DOC or DOCX resume.';
          status.classList.add('show');
        }
        resume?.focus();
        return;
      }
    }

    const selectedRole = role?.value || 'Internship application';
    if (subject) subject.value = '[GrapeCrux Vaagdevi Internship] ' + selectedRole;
    if (replyTo) replyTo.value = email?.value.trim() || '';

    if (status) {
      status.textContent = 'Submitting your application… Please wait.';
      status.classList.add('show');
    }
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Submitting application…';
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'form_submit', {
        form_name: 'vaagdevi_internship_application',
        internship_role: selectedRole,
        programme: 'Vaagdevi College of Engineering'
      });
    }
  });
})();
