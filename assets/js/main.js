/* GrapeCrux front-end behaviour. The assistant is a local, rule-based guide; no API key or data backend is included. */
(async () => {
  const isGithubPages = location.hostname === 'myg-1107.github.io';
  const base = isGithubPages ? '/GrapeCrux' : '';
  const withBase = (path) => `${base}${path.startsWith('/') ? path : `/${path}`}`;

  // Canonical clean routes use directory index files. Hide /index.html in the address bar.
  if (/\/index\.html$/i.test(location.pathname)) {
    const cleanPath = location.pathname.replace(/index\.html$/i, '');
    const target = `${cleanPath}${location.search}${location.hash}`;
    if (target !== location.pathname + location.search + location.hash) location.replace(target);
  }

  document.documentElement.classList.add('js-ready');
  const pathDepth = (location.pathname.replace(/^\/+|\/+$/g, '').match(/\//g) || []).length;
  const sitePath = location.pathname.replace(/^\/GrapeCrux(?=\/|$)/, '') || '/';
  const normalPath = sitePath.endsWith('/') ? sitePath : `${sitePath}/`;

  // Load shared HTML fragments. On GitHub Pages the project site has the /GrapeCrux base path;
  // on the custom domain it is served from /. Edit includes/header.html or includes/footer.html once
  // and the change is reflected on every page that contains the corresponding placeholder.
  const rebaseRootPaths = (scope) => {
    if (!base) return;
    scope.querySelectorAll('a[href^="/"], img[src^="/"], link[href^="/"], video[poster^="/"], source[srcset^="/"]').forEach((el) => {
      const attr = el.tagName === 'VIDEO' ? 'poster' : (el.tagName === 'SOURCE' ? 'srcset' : (el.tagName === 'LINK' ? 'href' : (el.tagName === 'IMG' ? 'src' : 'href')));
      const value = el.getAttribute(attr);
      if (value && !value.startsWith('//') && !value.startsWith('/GrapeCrux/')) {
        el.setAttribute(attr, withBase(value));
      }
    });
  };

  const loadSharedInclude = async (placeholderId, filePath) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    try {
      const response = await fetch(withBase(filePath), { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status} loading ${filePath}`);
      placeholder.innerHTML = await response.text();
      rebaseRootPaths(placeholder);
    } catch (error) {
      console.error(`GrapeCrux shared include could not be loaded: ${filePath}`, error);
    }
  };

  await Promise.all([
    loadSharedInclude('site-header', '/includes/header.html'),
    loadSharedInclude('site-footer', '/includes/footer.html')
  ]);

  // The year element is inside the asynchronously loaded shared footer.
  document.querySelectorAll('[data-current-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  // Rebase page-authored root links as well as links inside the shared fragments for GitHub Pages.
  rebaseRootPaths(document);

  // Highlight the current section and initialise the shared mobile navigation.
  const navHeader = document.getElementById('site-header');
  const navPath = location.pathname.replace(/^\/GrapeCrux(?=\/|$)/, '') || '/';
  const normalNavPath = navPath.endsWith('/') ? navPath : `${navPath}/`;
  navHeader?.querySelectorAll('[data-nav]').forEach((link) => {
    const target = link.getAttribute('data-nav');
    if (target && (normalNavPath === target || normalNavPath.startsWith(target))) {
      link.setAttribute('aria-current', 'page');
    }
  });

  const toggleBtn = navHeader?.querySelector('.menu-toggle');
  const navLinks = navHeader?.querySelector('.nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
      toggleBtn.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      navLinks.classList.toggle('open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open navigation');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    }));
  }

  // Turn contact parameters into helpful form defaults.
  const params = new URLSearchParams(location.search);
  const serviceField = document.querySelector('[name="service"]');
  if (serviceField && params.get('service')) {
    const requested = params.get('service');
    const matching = Array.from(serviceField.options || []).find(o => o.value.toLowerCase() === requested.toLowerCase() || o.text.toLowerCase() === requested.toLowerCase());
    if (matching) serviceField.value = matching.value;
    const msg = document.querySelector('[name="message"]');
    if (msg && !msg.value) msg.value = `I'm interested in: ${requested}.\n\nMy project goals are...`;
  }

  // A client-side enquiry form that opens the visitor's email application. No server-side storage.
  const contactForm = document.getElementById('project-form');
  if (contactForm) contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = `[GrapeCrux project enquiry] ${data.get('service') || 'New enquiry'}`;
    const body = [
      `Name: ${data.get('name') || ''}`,
      `Work email: ${data.get('email') || ''}`,
      `Company: ${data.get('company') || 'Not provided'}`,
      `Service: ${data.get('service') || ''}`,
      `Budget range: ${data.get('budget') || 'Not specified'}`,
      `Budget currency: ${data.get('currency') || 'Not specified'}`,
      `Preferred timeline: ${data.get('timeline') || 'Not specified'}`,
      '', 'Project details:', data.get('message') || '', '',
      'Submitted via the GrapeCrux website.'
    ].join('\n');
    const mailto = `mailto:service@grapecrux.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = document.getElementById('form-status');
    if (status) { status.textContent = 'Your email app should open with the enquiry prepared. Review the message and send it to contact the GrapeCrux team.'; status.classList.add('show'); }
    window.location.href = mailto;
  });

  // Internship applications are email-prepared; no CV or personal data is stored by this static site.
  const careersForm = document.getElementById('careers-form');
  if (careersForm) careersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!careersForm.reportValidity()) return;
    const data = new FormData(careersForm);
    const role = data.get('role') || 'Internship application';
    const body = [
      `Applicant: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Phone (optional): ${data.get('phone') || 'Not provided'}`,
      `Role: ${role}`,
      `Education/status: ${data.get('education') || ''}`,
      `Portfolio/GitHub/LinkedIn: ${data.get('links') || 'Not provided'}`,
      '', 'Why this role:', data.get('message') || '', '',
      'I will attach my resume before sending this email.'
    ].join('\n');
    const subject = `[GrapeCrux internship application] ${role}`;
    const status = document.getElementById('careers-form-status');
    if (status) { status.textContent = 'Your email application should open in your email app. Attach your resume, review the details and send it to service@grapecrux.com. This website does not store applications.'; status.classList.add('show'); }
    window.location.href = `mailto:service@grapecrux.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // Role cards pre-select the application form track and move keyboard focus to it.
  document.querySelectorAll('.apply-role[data-role]').forEach((button) => {
    button.addEventListener('click', () => {
      const roleSelect = document.querySelector('#careers-form [name="role"]');
      if (!roleSelect) return;
      const requested = button.getAttribute('data-role') || '';
      const match = Array.from(roleSelect.options).find((option) =>
        option.value.trim().toLowerCase() === requested.trim().toLowerCase() ||
        option.text.trim().toLowerCase() === requested.trim().toLowerCase()
      );
      if (match) {
        roleSelect.value = match.value;
        roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
        roleSelect.focus();
        roleSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Accessible client-side service assistant. It never pretends to provide confirmed pricing or human support.
  const chatbot = document.getElementById('gc-chatbot');
  if (chatbot) {
    chatbot.innerHTML = `<button class="chat-launcher" type="button" aria-expanded="false" aria-controls="gc-chat-panel"><span class="chat-bubble-icon" aria-hidden="true">✳</span><span>Ask GrapeCrux</span></button><section class="chat-panel" id="gc-chat-panel" aria-label="GrapeCrux service assistant" aria-hidden="true"><div class="chat-head"><span class="chat-avatar" aria-hidden="true"><img src="https://raw.githubusercontent.com/MYG-1107/GrapeCrux/main/grapecrux_brand_logo.png" alt="" width="38" height="38" onerror="if(this.dataset.fallback){this.onerror=null;}else{this.dataset.fallback='1';this.src='${withBase('/grapecrux_brand_logo.png')}';}"></span><div><strong>GrapeCrux Assistant</strong><small>Guided service information · Instant replies</small></div><button class="chat-close" type="button" aria-label="Close assistant">×</button></div><div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions text"><div class="chat-msg bot">Hello! I can explain what GrapeCrux does, where the company is based, how projects are approached, and which services or internship tracks are listed. I am a guided FAQ assistant, not a human agent. What would you like to know?</div></div><div class="chat-quick"><button type="button" data-chat="Explore services">Explore services</button><button type="button" data-chat="I need a website">Build a website</button><button type="button" data-chat="Tell me about AI automation">AI automation</button><button type="button" data-chat="I want to start a project">Start a project</button></div><form class="chat-form"><label class="sr-only" for="gc-chat-input">Your message</label><input id="gc-chat-input" name="message" autocomplete="off" placeholder="Tell us what you need…" maxlength="500" required><button type="submit" aria-label="Send message">↑</button></form><div class="chat-footnote">Guided FAQ assistant · Not a human agent. Pricing and scope require team confirmation.</div></section>`;
    const launch = chatbot.querySelector('.chat-launcher');
    const panel = chatbot.querySelector('.chat-panel');
    const messages = chatbot.querySelector('.chat-messages');
    const input = chatbot.querySelector('#gc-chat-input');
    const form = chatbot.querySelector('.chat-form');
    const quick = chatbot.querySelector('.chat-quick');
    const close = chatbot.querySelector('.chat-close');
    const toggleChat = (open) => { panel.classList.toggle('open', open); panel.setAttribute('aria-hidden', String(!open)); launch.setAttribute('aria-expanded', String(open)); if(open) input.focus(); else launch.focus(); };
    launch.addEventListener('click', () => toggleChat(!panel.classList.contains('open')));
    close.addEventListener('click', () => toggleChat(false));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && panel.classList.contains('open')) toggleChat(false); });
    const addMessage = (text, who='bot', allowHtml=false) => { const div=document.createElement('div'); div.className=`chat-msg ${who}`; if(allowHtml) div.innerHTML=text; else div.textContent=text; messages.appendChild(div); messages.scrollTop=messages.scrollHeight; };
    const answerFor = (raw) => window.GrapeCruxKnowledge?.answerFor(raw) || 'I can help with published GrapeCrux services and project enquiries. Please contact service@grapecrux.com for details I cannot verify.';
    const serviceFor = (raw) => { const m=raw.toLowerCase(); if(/ai|chatbot|automation|agent/.test(m)) return 'AI & Automation'; if(/website|web development|e-commerce|app|portal/.test(m)) return 'Web & App Development'; if(/design|ux|ui|prototype/.test(m)) return 'Product Design & UX'; if(/brand|logo|identity/.test(m)) return 'Brand Strategy & Visual Identity'; if(/seo|marketing|growth|search/.test(m)) return 'Digital Growth & SEO'; if(/cloud|devops|hosting|pipeline/.test(m)) return 'Cloud & DevOps'; if(/qa|test|bug|quality/.test(m)) return 'Quality Assurance & Consulting'; if(/api|integration|data|dashboard/.test(m)) return 'Data & System Integration'; return 'Project enquiry'; };
    const chatHistory = [];
    const chatApiUrl = String(window.GRAPECRUX_CHAT_API_URL || '').trim().replace(/\/+$/, '');
    const send = async (text) => {
      const clean = text.trim();
      if (!clean) return;
      addMessage(clean, 'user');
      let reply = '';
      if (chatApiUrl) {
        const thinking = document.createElement('div');
        thinking.className = 'chat-msg bot';
        thinking.textContent = 'Thinking…';
        messages.appendChild(thinking);
        messages.scrollTop = messages.scrollHeight;
        try {
          const response = await fetch(`${chatApiUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'omit',
            body: JSON.stringify({ messages: [...chatHistory.slice(-8), { role: 'user', content: clean }] })
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(`Assistant request failed (${response.status})`);
          reply = String(payload.reply || '').trim();
          if (!reply) throw new Error('Empty assistant response');
        } catch (_error) {
          reply = `${answerFor(clean)}\n\n(The hosted assistant is unavailable right now, so I’m using the built-in guide.)`;
        } finally {
          thinking.remove();
        }
      } else {
        reply = answerFor(clean);
      }
      chatHistory.push({ role: 'user', content: clean }, { role: 'assistant', content: reply });
      if (chatHistory.length > 12) chatHistory.splice(0, chatHistory.length - 12);
      addMessage(reply, 'bot');
    };
    form.addEventListener('submit', e => { e.preventDefault(); const text=input.value.trim(); if(!text) return; input.value=''; send(text); });
    quick.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      const text=button.dataset.chat || button.textContent; send(text);
      if (/start a project|need a website/i.test(text)) {
        const service=serviceFor(text); const link=document.createElement('a'); link.className='btn btn-primary'; link.style.margin='2px 0 5px'; link.href=withBase('/contact/')+`?service=${encodeURIComponent(service)}`; link.textContent='Prepare project enquiry ↗'; link.addEventListener('click',()=>toggleChat(false)); messages.appendChild(link); messages.scrollTop=messages.scrollHeight;
      }
    }));
  }

  // Analytics consent: GA4 is configured with denied defaults in the page head.
  // A page_view is sent only after the visitor opts into analytics measurement.
  const CONSENT_KEY = 'gc-analytics-consent-v1';
  const consentRoot = document.createElement('section');
  consentRoot.className = 'consent-banner';
  consentRoot.id = 'gc-consent-banner';
  consentRoot.setAttribute('aria-label', 'Analytics preferences');
  consentRoot.hidden = true;
  consentRoot.innerHTML = `<div class="consent-copy"><strong>Privacy preferences</strong><p>GrapeCrux uses Google Analytics to understand aggregate website usage and improve the experience. Optional analytics measurement is off unless you allow it. Read our <a href="${withBase('/privacy/')}">privacy notice</a>.</p></div><div class="consent-actions"><button type="button" class="btn btn-secondary consent-reject">Reject optional analytics</button><button type="button" class="btn btn-primary consent-accept">Allow analytics</button></div>`;
  document.body.appendChild(consentRoot);
  const updateAnalyticsConsent = (choice) => {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch (_error) {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: choice === 'granted' ? 'granted' : 'denied',
        ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
      });
      if (choice === 'granted') {
        window.gtag('event', 'page_view', { page_title: document.title, page_location: location.href, page_path: location.pathname });
      }
    }
    consentRoot.hidden = true;
  };
  let storedConsent = null;
  try { storedConsent = localStorage.getItem(CONSENT_KEY); } catch (_error) {}
  if (storedConsent === 'granted' || storedConsent === 'denied') {
    if (storedConsent === 'granted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('event', 'page_view', { page_title: document.title, page_location: location.href, page_path: location.pathname });
    }
  } else {
    consentRoot.hidden = false;
  }
  consentRoot.querySelector('.consent-accept')?.addEventListener('click', () => updateAnalyticsConsent('granted'));
  consentRoot.querySelector('.consent-reject')?.addEventListener('click', () => updateAnalyticsConsent('denied'));
  document.querySelectorAll('[data-open-consent]').forEach(button => button.addEventListener('click', () => { consentRoot.hidden = false; }));

  // Mark decorative reveals for browsers that support reduced-motion-aware CSS.
  document.querySelectorAll('.service-card,.benefit,.process-card,.concept-card,.article-card').forEach((el,i)=>{el.classList.add('reveal');if(i%4===1)el.classList.add('delay-1');if(i%4===2)el.classList.add('delay-2');if(i%4===3)el.classList.add('delay-3');});
})();
