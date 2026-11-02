/* GrapeCrux client configuration.
 * Keep the assistant API URL empty to use the built-in curated assistant.
 * Never place private API keys or SMTP credentials in this public file.
 */
window.GRAPECRUX_CHAT_API_URL = '';

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

    if (action.matches('.apply-career-role[data-kind][data-role]')) {
      track('careers_apply_click', {
        application_type: action.dataset.kind || 'unspecified',
        role_name: action.dataset.role || 'unspecified',
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
    if (path.startsWith('/contact/') || (targetUrl && targetUrl.protocol === 'mailto:')) {
      if (section === 'chatbot') {
        track('chat_contact_click', { cta_location: section, cta_label: label });
      } else {
        const startsProject = /start a project|tell us about your project|discuss a project/i.test(label);
        track(startsProject ? 'start_project_click' : 'contact_cta_click', {
          cta_location: section,
          cta_label: label
        });
      }
    }
  }, true);

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === 'project-form') {
      const service = form.querySelector('[name="service"]')?.value || 'unspecified';
      track('project_enquiry_email_draft_requested', {
        service_name: service,
        submission_method: 'mailto_draft'
      });
    }

    if (form.id === 'gc-careers-application-form') {
      const type = form.querySelector('[name="application_type"]')?.value || 'unspecified';
      const role = form.querySelector('[name="role"]')?.value || 'unspecified';
      track('careers_application_email_draft_requested', {
        application_type: type,
        role_name: role,
        submission_method: 'mailto_draft'
      });
    }
  }, true);
})();
