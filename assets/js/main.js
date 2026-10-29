/* GrapeCrux front-end behaviour. The assistant is a local, rule-based guide; no API key or data backend is included. */
(() => {
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

  const navItems = [
    ['Services','/services/'], ['Work','/work/'], ['About','/about/'], ['Insights','/insights/']
  ];
  const active = (path) => normalPath === path || (path !== '/' && normalPath.startsWith(path));
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `<div class="site-header"><div class="container nav-wrap"><a class="brand" href="/" aria-label="GrapeCrux home"><img src="${withBase('/assets/images/grapecrux-brand.svg')}" alt="GrapeCrux" width="320" height="66"></a><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span></button><nav class="nav-links" id="primary-navigation" aria-label="Main navigation">${navItems.map(([name,path])=>`<a href="${withBase(path)}"${active(path)?' aria-current="page"':''}>${name}</a>`).join('')}<a class="btn btn-primary" href="${withBase('/contact/')}?service=Project%20enquiry">Start a project <span class="arrow" aria-hidden="true">↗</span></a></nav></div></div>`;
    const toggle = header.querySelector('.menu-toggle');
    const nav = header.querySelector('.nav-links');
    toggle?.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav?.classList.toggle('open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle?.setAttribute('aria-expanded','false'); nav.classList.remove('open'); document.body.classList.remove('menu-open');
    }));
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><a class="brand" href="${withBase('/')}" aria-label="GrapeCrux home"><img class="footer-logo" src="${withBase('/assets/images/grapecrux-brand.svg')}" alt="GrapeCrux" width="320" height="66"></a><p>Thoughtful design. Modern engineering. Practical digital solutions for businesses ready to move forward.</p><p class="small"><strong>Business enquiries</strong><br><a href="mailto:service@grapecrux.com">service@grapecrux.com</a></p></div><div class="footer-col"><h3>Explore</h3><ul><li><a href="${withBase('/about/')}">About GrapeCrux</a></li><li><a href="${withBase('/services/')}">Services</a></li><li><a href="${withBase('/work/')}">Work & concepts</a></li><li><a href="${withBase('/insights/')}">Insights</a></li></ul></div><div class="footer-col"><h3>Capabilities</h3><ul><li><a href="${withBase('/services/web-development/')}">Web & app development</a></li><li><a href="${withBase('/services/ai-automation/')}">AI & automation</a></li><li><a href="${withBase('/services/product-design/')}">Product design</a></li><li><a href="${withBase('/services/digital-growth/')}">Digital growth</a></li></ul></div><div class="footer-col"><h3>Let's talk</h3><ul><li><a href="${withBase('/contact/')}">Start a project</a></li><li><a href="mailto:service@grapecrux.com">Email the team</a></li><li><a href="${withBase('/services/cloud-devops/')}">Cloud & DevOps</a></li><li><a href="${withBase('/services/quality-assurance/')}">QA & consulting</a></li></ul></div></div><div class="footer-bottom"><p>© ${new Date().getFullYear()} GrapeCrux. Operated under Infinite Resource Creators Private Limited.</p><div class="legal-links"><a href="${withBase('/privacy/')}">Privacy notice</a><a href="${withBase('/terms/')}">Terms</a></div><p>Built with clarity and care.</p></div></div></footer>`;
  }

  // Rebase any authored root links for the GitHub Pages project URL; custom domain remains root-based.
  if (base) {
    document.querySelectorAll('a[href^="/"]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('//') && !href.startsWith('/GrapeCrux/')) a.setAttribute('href', withBase(href));
    });
    // The project site lives below /GrapeCrux/ on github.io, unlike the custom domain.
    document.querySelectorAll('img[src^="/"], video[poster^="/"], source[srcset^="/"]').forEach(el => {
      const attr = el.tagName === 'VIDEO' ? 'poster' : (el.tagName === 'SOURCE' ? 'srcset' : 'src');
      const value = el.getAttribute(attr);
      if (value && !value.startsWith('//') && !value.startsWith('/GrapeCrux/')) el.setAttribute(attr, withBase(value));
    });
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
      `Preferred timeline: ${data.get('timeline') || 'Not specified'}`,
      '', 'Project details:', data.get('message') || '', '',
      'Submitted via the GrapeCrux website.'
    ].join('\n');
    const mailto = `mailto:service@grapecrux.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = document.getElementById('form-status');
    if (status) { status.textContent = 'Your email app should open with the enquiry prepared. Review the message and send it to contact the GrapeCrux team.'; status.classList.add('show'); }
    window.location.href = mailto;
  });

  // Accessible client-side service assistant. It never pretends to provide confirmed pricing or human support.
  const chatbot = document.getElementById('gc-chatbot');
  if (chatbot) {
    chatbot.innerHTML = `<button class="chat-launcher" type="button" aria-expanded="false" aria-controls="gc-chat-panel"><span class="chat-bubble-icon" aria-hidden="true">✳</span><span>Ask GrapeCrux</span></button><section class="chat-panel" id="gc-chat-panel" aria-label="GrapeCrux service assistant" aria-hidden="true"><div class="chat-head"><span class="chat-avatar" aria-hidden="true">G</span><div><strong>GrapeCrux Assistant</strong><small>Service guidance · Replies instantly</small></div><button class="chat-close" type="button" aria-label="Close assistant">×</button></div><div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions text"><div class="chat-msg bot">Hello! I can help you explore GrapeCrux services, understand next steps or prepare a project enquiry. What are you looking to build?</div></div><div class="chat-quick"><button type="button" data-chat="Explore services">Explore services</button><button type="button" data-chat="I need a website">Build a website</button><button type="button" data-chat="Tell me about AI automation">AI automation</button><button type="button" data-chat="I want to start a project">Start a project</button></div><form class="chat-form"><label class="sr-only" for="gc-chat-input">Your message</label><input id="gc-chat-input" name="message" autocomplete="off" placeholder="Tell us what you need…" maxlength="500" required><button type="submit" aria-label="Send message">↑</button></form><div class="chat-footnote">Guided assistant · No pricing or project commitments are confirmed here.</div></section>`;
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
    const addMessage = (text, who='bot', allowHtml=false) => { const div=document.createElement('div'); div.className=`chat-msg ${who}`; if(allowHtml) div.innerHTML=text; else div.textContent=text; messages.appendChild(div); messages.scrollTop=messages.scrollHeight; };
    const answerFor = (raw) => {
      const m = raw.toLowerCase();
      if (/price|pricing|cost|budget|quote|how much/.test(m)) return 'Project cost depends on scope, integrations, content, design complexity and delivery timeline. I can’t confirm a price here. Share a short brief through the project enquiry form and the team can review it.';
      if (/website|web development|e-commerce|ecommerce|portal|app|application/.test(m)) return 'Our Web & App Development service can cover responsive corporate websites, product interfaces, business portals, e-commerce experiences and API integrations. The next step is to define your audience, must-have features and success criteria.';
      if (/ai|chatbot|automation|agent|llm|workflow/.test(m)) return 'AI & Automation can include service assistants, internal knowledge tools, document workflows and integrations with business systems. A production AI assistant needs a secure backend, a reviewed knowledge source and privacy controls; each project should be scoped to its use case.';
      if (/design|ux|ui|prototype|wireframe|experience/.test(m)) return 'Product Design covers discovery, user journeys, wireframes, clickable prototypes, design systems and interface handoff. We start by clarifying the user, the task they need to complete and the business outcome.';
      if (/brand|logo|identity|visual/.test(m)) return 'Brand Strategy & Visual Identity can include positioning, visual direction, logo systems, brand guidelines and digital collateral. The first step is understanding your market, audience and how you want the brand to be perceived.';
      if (/seo|marketing|growth|traffic|search/.test(m)) return 'Digital Growth can include technical SEO, content planning, analytics and conversion optimisation. Rankings or traffic increases can’t be guaranteed; the work starts with an audit, a baseline and realistic priorities.';
      if (/cloud|devops|deploy|hosting|infrastructure|pipeline/.test(m)) return 'Cloud & DevOps can cover deployment automation, CI/CD, monitoring, infrastructure planning and reliability improvements. The right scope depends on your current stack, hosting and availability requirements.';
      if (/test|qa|quality|bug|audit/.test(m)) return 'Quality Assurance & Technical Consulting can cover functional testing, responsive checks, accessibility review, performance checks and release readiness. We can help define the highest-risk user journeys first.';
      if (/integration|api|data|dashboard|database/.test(m)) return 'Data & Integration work can include API connections, database-backed features, data processing and business dashboards. It helps to list the systems involved and which information must move between them.';
      if (/process|how do you work|steps|timeline/.test(m)) return 'A typical engagement follows six steps: discover the need, agree on scope, design the approach, build the solution, validate and launch, then improve under an agreed support plan. Timelines depend on the final scope.';
      if (/contact|email|talk|human|team|project|start/.test(m)) return 'You can start an enquiry through the contact form. It collects a short project brief and prepares an email to service@grapecrux.com; your email app will need to send it. No enquiry is stored by this static page.';
      if (/service|offer|help|capabilit/.test(m)) return 'GrapeCrux presents services across web & app development, AI & automation, product design, branding, digital growth & SEO, cloud & DevOps, data integrations, and quality assurance. Tell me which challenge you’re working on and I’ll point you to a relevant service.';
      if (/hello|hi|hey|good morning|good afternoon/.test(m)) return 'Hello! Tell me a little about your business challenge, or choose a quick option below. I can help you explore services and prepare an enquiry.';
      return 'I can help with service selection and general project guidance, but I don’t have verified details about every company-specific question. Try asking about web development, AI automation, product design, branding, SEO, cloud, QA or project enquiries.';
    };
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

  // Mark decorative reveals for browsers that support reduced-motion-aware CSS.
  document.querySelectorAll('.service-card,.benefit,.process-card,.concept-card,.article-card').forEach((el,i)=>{el.classList.add('reveal');if(i%4===1)el.classList.add('delay-1');if(i%4===2)el.classList.add('delay-2');if(i%4===3)el.classList.add('delay-3');});
})();
