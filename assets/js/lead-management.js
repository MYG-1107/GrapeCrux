(() => {
  'use strict';
  const connectForm = document.getElementById('lead-admin-connect');
  const workspace = document.getElementById('lead-admin-workspace');
  const list = document.getElementById('lead-admin-list');
  const status = document.getElementById('lead-admin-status');
  if (!connectForm || !workspace || !list) return;

  let apiBase = '';
  let adminToken = '';
  const $ = (selector) => document.querySelector(selector);

  function message(text, isError = false) {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('is-error', isError);
    status.classList.add('show');
  }

  async function api(path, options = {}) {
    const response = await fetch(apiBase + path, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        'Authorization': 'Bearer ' + adminToken,
        ...(options.headers || {})
      },
      credentials: 'omit'
    });
    const payload = response.status === 204 ? {} : await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.detail || 'The request could not be completed (' + response.status + ').');
    return payload;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function field(labelText, input) {
    const wrapper = element('label', 'lead-admin-field');
    wrapper.append(element('span', '', labelText), input);
    return wrapper;
  }

  async function refresh() {
    const selected = $('#lead-filter-status')?.value || '';
    const query = new URLSearchParams({ limit: '100', offset: '0' });
    if (selected) query.set('status', selected);
    const [summary, result] = await Promise.all([
      api('/api/admin/summary'),
      api('/api/admin/enquiries?' + query.toString())
    ]);
    const summaryHost = $('#lead-admin-summary');
    if (summaryHost) {
      summaryHost.replaceChildren();
      const entries = [['All enquiries', summary.total], ...Object.entries(summary.by_status || {})];
      entries.forEach(([name, value]) => {
        const tile = element('div','lead-admin-stat');
        tile.append(element('span','small',name),element('strong','',String(value)));
        summaryHost.appendChild(tile);
      });
    }
    list.replaceChildren();
    $('#lead-admin-count').textContent = result.total + ' enquiry record(s).';
    if (!result.items?.length) {
      list.append(element('p', 'empty-state', 'No enquiries match this filter.'));
      return;
    }
    for (const item of result.items) renderRecord(item);
  }

  function renderRecord(item) {
    const card = element('article', 'lead-record');
    const top = element('div', 'lead-record-top');
    const ref = element('div', 'lead-record-reference');
    ref.append(element('strong', '', item.reference || 'Enquiry'), element('span', 'small', new Date(item.created_at).toLocaleString()));
    const heading = element('h3', '', item.name + ' · ' + item.service);
    const email = element('p', '', item.email + (item.phone ? ' · ' + item.phone : ''));
    const company = element('p', 'small', [item.company, item.country, item.project_type].filter(Boolean).join(' · '));
    const delivery = element('p','small',
      'Company notification: ' + (item.notification_email_status || 'unknown') +
      ' · Customer acknowledgement: ' + (item.acknowledgement_email_status || 'unknown'));
    top.append(ref, heading, email, company, delivery);
    card.appendChild(top);

    const details = element('details', 'lead-record-details');
    const summary = element('summary', '', 'Project details and follow-up');
    const body = element('div', 'lead-record-body');
    body.append(element('p', '', item.message || 'No project description supplied.'));
    if (item.existing_website) body.append(element('p', 'small', 'Website: ' + item.existing_website));
    if (item.landing_page) body.append(element('p', 'small', 'Landing page: ' + item.landing_page));
    if (item.utm_source || item.utm_campaign) body.append(element('p', 'small', 'Campaign: ' + [item.utm_source,item.utm_medium,item.utm_campaign].filter(Boolean).join(' / ')));

    const statusSelect = document.createElement('select');
    statusSelect.setAttribute('aria-label', 'Enquiry status');
    ['New','Under Review','Qualified','Proposal Sent','Discussion','Won','Lost','Spam'].forEach(value => {
      const option = document.createElement('option'); option.value = value; option.textContent = value;
      statusSelect.appendChild(option);
    });
    statusSelect.value = item.status || 'New';

    const owner = document.createElement('input');
    owner.maxLength = 120; owner.value = item.assigned_to || ''; owner.placeholder = 'Assigned team member';
    const followUp = document.createElement('input');
    followUp.type = 'date'; followUp.value = item.follow_up_date || '';
    const notes = document.createElement('textarea');
    notes.rows = 3; notes.maxLength = 4000; notes.value = item.internal_notes || ''; notes.placeholder = 'Internal notes (never send to the visitor)';
    const save = document.createElement('button');
    save.type = 'button'; save.className = 'btn btn-primary'; save.textContent = 'Save updates';
    const feedback = element('p','small','');
    save.addEventListener('click', async () => {
      save.disabled = true; feedback.textContent = 'Saving…';
      try {
        await api('/api/admin/enquiries/' + encodeURIComponent(item.reference), {
          method: 'PATCH',
          body: JSON.stringify({
            status: statusSelect.value,
            assigned_to: owner.value.trim(),
            follow_up_date: followUp.value || null,
            internal_notes: notes.value
          })
        });
        feedback.textContent = 'Saved.';
      } catch (error) {
        feedback.textContent = error.message;
      } finally { save.disabled = false; }
    });
    const statusRow = element('div','lead-admin-edit-grid');
    statusRow.append(field('Status', statusSelect),field('Assigned to',owner),field('Follow-up date',followUp));
    body.append(statusRow,field('Internal notes',notes),save,feedback);
    details.append(summary,body);
    card.appendChild(details);
    list.appendChild(card);
  }

  connectForm.addEventListener('submit', async event => {
    event.preventDefault();
    apiBase = ($('#lead-api-url').value.trim() || window.GRAPECRUX_API_BASE_URL || '').replace(/\/+$/,'');
    adminToken = $('#lead-api-token').value;
    if (!apiBase || !adminToken) { message('Enter the deployed API URL and admin token.', true); return; }
    const submit = connectForm.querySelector('button[type="submit"]');
    submit.disabled = true; message('Checking access…');
    try {
      const summary = await api('/api/admin/summary');
      workspace.hidden = false;
      message('Connected. ' + summary.total + ' enquiry record(s) are stored.');
      await refresh();
    } catch (error) {
      adminToken = '';
      workspace.hidden = true;
      message(error.message, true);
    } finally { submit.disabled = false; }
  });

  $('#lead-refresh')?.addEventListener('click', () => refresh().catch(e => message(e.message,true)));
  $('#lead-filter-status')?.addEventListener('change', () => refresh().catch(e => message(e.message,true)));
  $('#lead-disconnect')?.addEventListener('click', () => {
    adminToken = ''; apiBase = ''; $('#lead-api-token').value = '';
    workspace.hidden = true; list.replaceChildren(); message('Disconnected. The admin token was cleared from this page.');
  });
  $('#lead-export')?.addEventListener('click', async () => {
    try {
      const response = await fetch(apiBase + '/api/admin/enquiries/export.csv', {
        headers: { 'Authorization': 'Bearer ' + adminToken }, credentials: 'omit'
      });
      if (!response.ok) throw new Error('CSV export failed (' + response.status + ').');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = objectUrl; a.download = 'grapecrux-enquiries.csv';
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(objectUrl);
    } catch (error) { message(error.message,true); }
  });
})();
