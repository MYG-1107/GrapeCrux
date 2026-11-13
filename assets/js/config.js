/* GrapeCrux static-site configuration. No private API or mail credentials belong in this file. */
/* Optional GTM support is intentionally disabled until the real container ID is supplied.
   Do not add a GA4 tag in GTM while direct GA4 is active, or page/event data may duplicate. */
window.GRAPECRUX_GTM_ID = '';

/* Load extra page components as a shared stylesheet on the custom domain and GitHub Pages. */
(() => {
  const prefix = location.hostname === 'myg-1107.github.io' ? '/GrapeCrux' : '';
  if (!document.querySelector('link[href*="business-platform.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = prefix + '/assets/css/business-platform.css';
    link.dataset.gcBusinessPlatform = 'true';
    document.head.appendChild(link);
  }
})();

/* Consent-aware GA4 intent tracking.
 * The site currently opens email drafts for enquiries/applications; it cannot
 * verify that a visitor actually sent the email. Event names deliberately say
 * "draft_requested" and must not be presented as confirmed submissions.
 */
(() => {
  'use strict';

  const CONSENT_KEY = 'gc-analytics-consent-v1';
  const GA_ID = 'G-QXMRMGJEP2';

  // Some legacy content pages do not contain an inline GA4 snippet.
  // Bootstrap tracking here through the shared deferred script instead.
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  const gaScriptUrl = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  const hasGaLoader = Array.from(document.scripts).some((script) => script.src === gaScriptUrl);
  if (!hasGaLoader) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = gaScriptUrl;
    document.head.appendChild(gaScript);
  }
  const hasAnalyticsConsent = () => {
    try { return window.localStorage.getItem(CONSENT_KEY) === 'granted'; }
    catch (_error) { return false; }
  };

  const track = (eventName, parameters = {}) => {
    if (!hasAnalyticsConsent() || typeof window.gtag !== 'function') return false;
    window.gtag('event', eventName, {
      page_path: window.location.pathname,
      ...parameters
    });
    return true;
  };

  window.GrapeCruxAnalytics = Object.freeze({ track });

  const closestAction = (target) => {
    if (target instanceof Element) return target.closest('a, button');
    return null;
  };

  const pageSection = (element) => {
    if (element.closest('#gc-chatbot')) return 'chatbot';
    if (element.closest('header')) return 'header';
    if (element.closest('footer')) return 'footer';
    if (element.closest('.hero, .page-hero')) return 'hero';
    return 'page_content';
  };

  document.addEventListener('click', (event) => {
    const action = closestAction(event.target);
    if (!action) return;

    if (action.matches('.chat-launcher')) {
      track('chat_open', { cta_location: 'floating_launcher' });
      return;
    }

    const href = action.getAttribute('href') || '';
    let targetUrl = null;
    try { targetUrl = new URL(href, window.location.href); } catch (_error) {}
    const path = targetUrl?.pathname || '';
    const section = pageSection(action);
    const label = (action.getAttribute('aria-label') || action.textContent || 'unnamed action')
      .replace(/\s+/g, ' ').trim().slice(0, 80);

    if (action.matches('.job-detail-link[data-job-id]')) {
      track('career_job_detail_click',{job_id:action.dataset.jobId || 'unspecified',role_name:action.dataset.role || 'unspecified',cta_location:section});
      return;
    }
    if (action.matches('.job-apply-cta[data-job-id]')) {
      track('career_apply_cta_click',{job_id:action.dataset.jobId || 'unspecified',role_name:action.dataset.role || 'unspecified',cta_location:section});
      return;
    }

    if (action.matches('.apply-career-role[data-kind][data-role]')) {
      track('careers_apply_click', {
        application_type: action.dataset.kind || 'unspecified',
        role_name: action.dataset.role || 'unspecified',
        cta_location: section,
        cta_label: label
      });
      return;
    }

    const fileNameRaw = path.split('/').filter(Boolean).pop() || 'resource';
    let fileName = fileNameRaw;
    try { fileName = decodeURIComponent(fileNameRaw); } catch (_error) {}
    const fileExtension = (fileName.includes('.') ? fileName.split('.').pop() : '').toLowerCase();
    const downloadExtensions = new Set(['pdf', 'zip', 'csv', 'xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'ics']);
    if (targetUrl && (action.hasAttribute('download') || downloadExtensions.has(fileExtension))) {
      track('file_download', {
        file_name: fileName.slice(0, 100),
        file_extension: fileExtension || 'unknown',
        link_domain: targetUrl.hostname.slice(0, 100),
        cta_location: section,
        cta_label: label
      });
      return;
    }

    if (targetUrl && /^https?:$/.test(targetUrl.protocol) && targetUrl.origin !== window.location.origin) {
      track('outbound_link_click', {
        link_domain: targetUrl.hostname.slice(0, 100),
        cta_location: section,
        cta_label: label
      });
      return;
    }

    if (path === '/services/' || path === '/services') {
      track('explore_services_click', { cta_location: section, cta_label: label });
      return;
    }
    if (path.startsWith('/careers/')) {
      track('careers_page_click', { cta_location: section, cta_label: label });
      return;
    }
    if (path.startsWith('/services/')) {
      track('service_page_click', {
        service_slug: path.split('/').filter(Boolean).pop() || 'services',
        cta_location: section,
        cta_label: label
      });
      return;
    }
    if (path.startsWith('/blogs/') && path !== '/blogs/') {
      track('blog_article_click', {
        article_slug: path.split('/').filter(Boolean).pop() || 'article',
        cta_location: section,
        cta_label: label
      });
      return;
    }
    if (targetUrl && targetUrl.protocol === 'mailto:') {
      track('email_click', { cta_location: section, cta_label: label });
      if (section === 'chatbot') track('chat_contact_click', { cta_location: section, cta_label: label });
    }
    if (targetUrl && targetUrl.protocol === 'tel:') {
      track('phone_click', { cta_location: section, cta_label: label });
    }
    if (targetUrl && /(^|\.)wa\.me$/i.test(targetUrl.hostname)) {
      track('whatsapp_click', { cta_location: section, cta_label: label });
    }
    if (path.startsWith('/contact/')) {
      const startsProject = /start a project|tell us about your project|discuss a project/i.test(label);
      track(startsProject ? 'start_project_click' : 'contact_cta_click', {
        cta_location: section,
        cta_label: label
      });
    }
    if (action.matches('.btn, [data-track-cta]')) {
      track('cta_click', { cta_location: section, cta_label: label, destination_path: path || 'none' });
    }
  }, true);

  let enquiryFormStarted = false;
  document.addEventListener('focusin', (event) => {
    if (enquiryFormStarted) return;
    if (event.target instanceof Element && event.target.closest('#project-form')) {
      enquiryFormStarted = true;
      track('form_start', { form_name: 'project_enquiry' });
    }
  }, true);

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === 'project-form') {
      const service = form.querySelector('[name="service"]')?.value || 'unspecified';
      track('form_submit', {
        form_name: 'project_enquiry',
        service_name: service,
        submission_method: 'hosted_email_form'
      });
    }

    if (form.id === 'gc-careers-application-form') {
      const type = form.querySelector('[name="application_type"]')?.value || 'unspecified';
      const role = form.querySelector('[name="role"]')?.value || 'unspecified';
      const jobId = form.querySelector('[name="job_id"]')?.value || 'unspecified';
      track('careers_application_submit_attempt', {
        application_type: type,
        role_name: role,
        job_id: jobId,
        submission_method: 'hosted_email_form'
      });
    }
  }, true);

  const pagePath = window.location.pathname.replace(/\/+$/, '/') || '/';
  if (pagePath === '/contact/') track('contact_view');
  if (pagePath.startsWith('/services/')) track('service_view', { service_slug: pagePath.split('/').filter(Boolean).pop() || 'services' });
  if (pagePath.startsWith('/blogs/') && pagePath !== '/blogs/') track('blog_view', { article_slug: pagePath.split('/').filter(Boolean).pop() });
  if (pagePath.startsWith('/case-studies/')) track('case_study_view');
})();
