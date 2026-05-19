const navConfig = [
  {
    title: 'ABOUT', href: 'about.html', key: 'about', children: [
      { title: 'About', href: 'about.html', key: 'about' },
      { title: 'Management', href: 'management.html', key: 'management' },
      { title: 'Agents', href: 'agents.html', key: 'agents' },
      { title: 'Agents Login', href: 'https://agentsso.pinnaclerealty.ca', key: 'agents-login' },
    ]
  },
  {
    title: 'SELLERS', href: 'sellers.html', key: 'sellers', children: [
      { title: 'Sellers', href: 'sellers.html', key: 'sellers' },
      { title: 'Services For Sellers', href: 'services-sellers.html', key: 'services-sellers' },
      { title: 'Property Evaluation', href: 'property-evaluation.html', key: 'property-evaluation' },
    ]
  },
  {
    title: 'BUYERS', href: 'buyers.html', key: 'buyers', children: [
      { title: 'Buyers', href: 'buyers.html', key: 'buyers' },
      { title: 'Services For Buyers', href: 'services-buyers.html', key: 'services-buyers' },
      { title: 'Mortgage Guide', href: 'mortgage-guide.html', key: 'mortgage-guide' },
      { title: 'Get Listing Alerts', href: 'listing-alerts.html', key: 'listing-alerts' },
    ]
  },
  {
    title: 'MEDIA', href: 'media.html', key: 'media', children: [
      { title: 'Articles', href: 'media.html', key: 'media' },
      { title: 'Blogs', href: 'https://blogs.pinnaclerealty.ca', key: 'blogs' },
    ]
  },
  { title: 'LISTINGS', href: 'listings.html', key: 'listings' },
  { title: 'NEW CONSTRUCTION', href: 'new-construction.html', key: 'new-construction' },
  { title: 'CONTACT', href: 'contact.html', key: 'contact' },
];

const footerColumns = [
  {
    heading: 'ABOUT',
    links: [
      ['About', 'about.html'],
      ['Management', 'management.html'],
      ['Agents', 'agents.html'],
      ['Agents Login', 'https://agentsso.pinnaclerealty.ca'],
    ]
  },
  {
    heading: 'SELLERS',
    links: [
      ['Sellers', 'sellers.html'],
      ['Services for Sellers', 'services-sellers.html'],
      ['Property Evaluation', 'property-evaluation.html'],
    ]
  },
  {
    heading: 'BUYERS',
    links: [
      ['Buyers', 'buyers.html'],
      ['Services for Buyers', 'services-buyers.html'],
      ['Mortgage Guide', 'mortgage-guide.html'],
      ['Get Listing Alerts', 'listing-alerts.html'],
    ]
  },
  {
    heading: 'EXPLORE',
    links: [
      ['Listings', 'listings.html'],
      ['New Construction', 'new-construction.html'],
      ['Contact', 'contact.html'],
      ['Join Us', 'https://join.pinnaclerealty.ca'],
    ]
  },
  {
    heading: 'MEDIA',
    links: [
      ['Articles', 'media.html'],
      ['Blogs', 'https://blogs.pinnaclerealty.ca'],
    ]
  },
];

const pageKey = document.body.dataset.page || '';
const pageTitle = document.body.dataset.title || 'Pinnacle Realty';

function itemIsActive(item) {
  if (item.key === pageKey) return true;
  return item.children?.some((child) => child.key === pageKey);
}

function createNav() {
  const mount = document.getElementById('site-header');
  if (!mount) return;

  const navHtml = navConfig.map((item) => {
    const active = itemIsActive(item) ? 'active' : '';
    if (!item.children) {
      return `<div class="nav-item"><a class="nav-link ${active}" href="${item.href}">${item.title}</a></div>`;
    }

    const submenu = item.children.map((child) => {
      const childActive = child.key === pageKey ? 'active' : '';
      return `<a class="submenu-link ${childActive}" href="${child.href}"${child.href.startsWith('https://') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${child.title}</a>`;
    }).join('');

    return `
      <div class="nav-item has-children ${active}">
        <a class="nav-link" href="${item.href}">${item.title} <span class="nav-caret">▼</span></a>
        <button class="mobile-subtoggle" type="button" aria-label="Open ${item.title} menu">${item.title} <span class="nav-caret">▼</span></button>
        <div class="submenu">${submenu}</div>
      </div>`;
  }).join('');

  mount.innerHTML = `
    <header class="site-header">
      <div class="nav-backdrop"></div>
      <nav class="navbar" id="navbar">
        <div class="container navbar-inner">
          <a href="index.html" class="navbar-logo brand" aria-label="Pinnacle Realty home">
            <img src="assets/images/pinnacle-logo.png" alt="Pinnacle Realty" class="navbar-logo-img" />
          </a>

          <div class="nav-links" id="navLinks">
            ${navHtml}
            <a class="nav-cta join-btn" href="https://join.pinnaclerealty.ca" target="_blank" rel="noopener noreferrer">JOIN US</a>
          </div>

          <button class="hamburger nav-toggle" id="hamburger" type="button" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>

        <div class="mobile-menu">
          ${navHtml}
          <a class="nav-cta join-btn" href="https://join.pinnaclerealty.ca" target="_blank" rel="noopener noreferrer">JOIN US</a>
        </div>
      </nav>
    </header>`;

  const nav = mount.querySelector('.navbar');
  const toggle = mount.querySelector('.nav-toggle');
  const hamburger = mount.querySelector('.hamburger');

  const mobileMenu = mount.querySelector('.mobile-menu');

  const syncMobileMenu = () => {
    const isDesktop = window.innerWidth > 980;
    const isOpen = mobileMenu?.classList.contains('open');

    if (!mobileMenu) return;

    if (isDesktop) {
      mobileMenu.style.display = 'none';
      mobileMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      return;
    }

    mobileMenu.style.display = isOpen ? 'flex' : 'none';
    hamburger?.classList.toggle('open', !!isOpen);
    toggle?.setAttribute('aria-expanded', String(!!isOpen));
    document.body.classList.toggle('menu-open', !!isOpen);
  };

  const setDesktopSubmenuState = (item, isOpen) => {
    const submenu = item?.querySelector('.submenu');
    if (!submenu) return;
    submenu.style.opacity = isOpen ? '1' : '0';
    submenu.style.visibility = isOpen ? 'visible' : 'hidden';
    submenu.style.transform = isOpen ? 'translateY(0)' : 'translateY(10px)';
    item.classList.toggle('open', isOpen);
  };

  const closeAllDesktopSubmenus = () => {
    mount.querySelectorAll('.nav-links .has-children').forEach((item) => {
      setDesktopSubmenuState(item, false);
    });
  };

  toggle?.addEventListener('click', () => {
    if (!mobileMenu || window.innerWidth > 980) return;
    mobileMenu.classList.toggle('open');
    syncMobileMenu();
  });

  mount.querySelectorAll('.mobile-subtoggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (window.innerWidth > 980) return;
      e.preventDefault();
      const item = btn.closest('.has-children');
      const isOpen = item.classList.contains('open');
      mount.querySelectorAll('.mobile-menu .has-children').forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  mount.querySelectorAll('.nav-links .has-children').forEach((item) => {
    const trigger = item.querySelector('.nav-link');

    item.addEventListener('mouseenter', () => {
      if (window.innerWidth <= 980) return;
      closeAllDesktopSubmenus();
      setDesktopSubmenuState(item, true);
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth <= 980) return;
      setDesktopSubmenuState(item, false);
    });

    trigger?.addEventListener('click', (e) => {
      if (window.innerWidth <= 980) return;
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      closeAllDesktopSubmenus();
      setDesktopSubmenuState(item, !isOpen);
    });
  });

  document.addEventListener('click', (e) => {
    if (!mount.contains(e.target)) {
      mobileMenu?.classList.remove('open');
      syncMobileMenu();
      mount.querySelectorAll('.mobile-menu .has-children').forEach((i) => i.classList.remove('open'));
      closeAllDesktopSubmenus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      mobileMenu?.classList.remove('open');
      mount.querySelectorAll('.mobile-menu .has-children').forEach((i) => i.classList.remove('open'));
      closeAllDesktopSubmenus();
    }
    if (window.innerWidth <= 980) {
      closeAllDesktopSubmenus();
    }
    syncMobileMenu();
  });

  syncMobileMenu();
}

function createFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  const columnsHtml = footerColumns.map((col) => `
    <div class="footer-column">
      <h3>${col.heading}</h3>
      ${col.links.map(([label, href]) => `<a href="${href}"${href.startsWith('https://') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`).join('')}
    </div>
  `).join('');

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-shell">
        <div class="footer-main">
          ${columnsHtml}
          <div class="footer-brand-area">
            <div class="footer-logo">
              <img src="assets/images/pinnacle-logo.png" alt="Pinnacle Realty" class="footer-logo-img" />
            </div>
            <p class="footer-copy">Modern presentation. Elevated service.</p>
          </div>
        </div>
        <div class="footer-social">
          <a href="https://www.instagram.com/pinnaclerealty.ca?igsh=M216Z2g4ZnFwZjNl" class="social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/instagram-logo.jpg" alt="Instagram" class="social-icon-img" />
          </a>
          <a href="https://www.linkedin.com/company/pinnaclerealtyca/" class="social-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/linkedin-logo.jpg" alt="LinkedIn" class="social-icon-img" />
          </a>
          <a href="https://x.com/Pinnacle905_AI" class="social-icon" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/twitter-logo.jpg" alt="Twitter" class="social-icon-img" />
          </a>
          <a href="https://www.youtube.com/@PinnacleRealty905" class="social-icon" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/youtube-logo.jpg" alt="YouTube" class="social-icon-img" />
          </a>
          <a href="https://www.facebook.com/people/Pinnacle-Realty/61576469951373/?rdid=SvUUdr3EQLLckm6e&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DBBLDs4hj%2F" class="social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <img src="assets/images/facebook-logo.jpg" alt="Facebook" class="social-icon-img" />
          </a>
        </div>
        <div class="footer-bottom">
          <strong>PINNACLE REALTY</strong>
          <span>Copyright © <span id="year"></span> All Rights Reserved</span>
          <button type="button" class="footer-legal-trigger" data-legal="privacy">Privacy Policy</button>
          <button type="button" class="footer-legal-trigger" data-legal="terms">Terms of Service</button>
        </div>
      </div>
    </footer>
      <div class="legal-modal" id="legalModal" aria-hidden="true">
        <div class="legal-modal-backdrop" data-legal-close></div>
        <div class="legal-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="legalModalTitle">
          <button type="button" class="legal-modal-close" id="legalModalClose" aria-label="Close legal popup">×</button>
          <div class="legal-modal-content" id="legalModalContent"></div>
        </div>
      </div>
  `;

  const year = mount.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const legalCopy = {
    privacy: {
      title: 'Privacy Policy',
      html: `
        <h2 id="legalModalTitle">Privacy Policy</h2>
        <p>At Pinnacle Realty, your privacy matters. This website may collect personal information you choose to submit, such as your name, email address, phone number, property preferences, and any details you provide through forms or direct inquiries.</p>
        <p>We use this information to respond to requests, provide real estate guidance, share relevant updates, and improve the overall experience of the website. We may also use limited website analytics to understand how visitors interact with our pages and to improve performance, navigation, and content.</p>
        <p>Your information is not sold to third parties. Information may be shared only with trusted service providers or licensed team members when necessary to support communication, scheduling, listings-related services, or legal and regulatory obligations connected to real estate operations.</p>
        <p>While we take reasonable steps to protect submitted information, no method of internet transmission or storage can be guaranteed to be completely secure. By using this website, you understand and accept that standard online communication carries some level of risk.</p>
        <p>This website may contain links, future integrations, or embedded services from third parties. Those services may operate under their own privacy practices. We encourage visitors to review third-party terms and privacy notices when using those features.</p>
        <p>If you would like to request an update, correction, or deletion of information you have submitted through this website, please contact Pinnacle Realty directly using the website contact page.</p>
      `
    },
    terms: {
      title: 'Terms of Service',
      html: `
        <h2 id="legalModalTitle">Terms of Service</h2>
        <p>By accessing and using the Pinnacle Realty website, you agree to use the site only for lawful purposes related to learning about services, browsing information, making inquiries, or contacting the brokerage.</p>
        <p>All website content, including branding, design elements, text, visuals, page structure, and presentation, is provided for general informational purposes only and may be updated, modified, or removed at any time without notice.</p>
        <p>Real estate information shown on this website, including future listing tools, property descriptions, market-related content, and service details, may change over time and should not be considered guaranteed, final, or legally binding unless confirmed directly through a licensed representative.</p>
        <p>You agree not to misuse the website, attempt unauthorized access, interfere with performance, copy protected content for commercial use, or use automated tools in a way that disrupts the normal operation of the site.</p>
        <p>Pinnacle Realty is not responsible for losses or damages arising from reliance on website content alone, service interruptions, technical errors, third-party tools, or external links. Visitors should confirm material details directly before making real estate decisions.</p>
        <p>Continued use of this website means you accept these terms. If you do not agree with them, you should discontinue use of the website.</p>
      `
    }
  };

  const legalModal = mount.querySelector('#legalModal');
  const legalModalContent = mount.querySelector('#legalModalContent');
  const legalModalClose = mount.querySelector('#legalModalClose');
  const legalTriggers = mount.querySelectorAll('.footer-legal-trigger');

  const openLegalModal = (type) => {
    const copy = legalCopy[type];
    if (!copy || !legalModal || !legalModalContent) return;

    legalModalContent.innerHTML = copy.html;

    if (window.innerWidth <= 640) {
      legalModalContent.style.overflowY = 'auto';
      legalModalContent.style.webkitOverflowScrolling = 'touch';
      legalModalContent.style.maxHeight = '78vh';
    } else {
      legalModalContent.style.overflowY = '';
      legalModalContent.style.webkitOverflowScrolling = '';
      legalModalContent.style.maxHeight = '';
    }

    legalModal.classList.add('open');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('legal-modal-open');
    legalModalClose?.focus();
  };

  const closeLegalModal = () => {
    if (!legalModal || !legalModalContent) return;
    legalModal.classList.remove('open');
    legalModal.setAttribute('aria-hidden', 'true');
    legalModalContent.innerHTML = '';
    legalModalContent.style.overflowY = '';
    legalModalContent.style.webkitOverflowScrolling = '';
    legalModalContent.style.maxHeight = '';
    document.body.classList.remove('legal-modal-open');
  };

  legalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openLegalModal(trigger.dataset.legal);
    });
  });

  legalModalClose?.addEventListener('click', closeLegalModal);

  legalModal?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute('data-legal-close')) {
      closeLegalModal();
    }
  });

  window.addEventListener('resize', () => {
    if (!legalModal?.classList.contains('open') || !legalModalContent) return;

    if (window.innerWidth <= 640) {
      legalModalContent.style.overflowY = 'auto';
      legalModalContent.style.webkitOverflowScrolling = 'touch';
      legalModalContent.style.maxHeight = '78vh';
    } else {
      legalModalContent.style.overflowY = '';
      legalModalContent.style.webkitOverflowScrolling = '';
      legalModalContent.style.maxHeight = '';
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && legalModal?.classList.contains('open')) {
      closeLegalModal();
    }
  });
}

function optimizePagePerformance() {
  document.documentElement.classList.add('js-ready');

  const images = Array.from(document.querySelectorAll('img'));
  const firstVisibleImage = images.find((image) => {
    const rect = image.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  });

  images.forEach((image) => {
    image.setAttribute('decoding', image.getAttribute('decoding') || 'async');

    if (image === firstVisibleImage || image.classList.contains('navbar-logo-img')) {
      image.setAttribute('fetchpriority', image.getAttribute('fetchpriority') || 'high');
      return;
    }

    if (!image.hasAttribute('loading')) {
      image.setAttribute('loading', 'lazy');
    }
  });

  const smoothAnchorLinks = document.querySelectorAll('a[href^="#"]');

  smoothAnchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const revealItems = document.querySelectorAll('.reveal-on-scroll, .fade-in, .scroll-reveal');

  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible', 'visible', 'is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
  }, { once: true });
}



function createQuickSignupPopup() {
  const path = window.location.pathname || '';
  const isHomePage = path === '/' || path.endsWith('/index.html') || path.endsWith('index.html') || path === '';

  if (document.querySelector('.quick-signup-panel')) return;

  const panel = document.createElement('aside');
  panel.className = 'quick-signup-panel';
  panel.setAttribute('aria-label', 'Quick signup inquiry form');
  panel.setAttribute('aria-hidden', 'true');

  panel.innerHTML = `
    <button class="quick-signup-toggle" type="button" aria-label="Open quick signup form" aria-expanded="false">
      <span class="quick-signup-arrow" aria-hidden="true"></span>
      <span class="quick-signup-close" aria-hidden="true">×</span>
    </button>

    <div class="quick-signup-card">
      <p class="quick-signup-kicker">Quick Sign Up</p>
      <h2 class="quick-signup-title">Start your inquiry.</h2>
      <p class="quick-signup-copy">Leave your name and email, and Pinnacle Realty will follow up with you shortly.</p>

      <form class="quick-signup-form" id="quickSignupForm">
        <label class="quick-signup-field" for="quickSignupName">
          <span>Name</span>
          <input id="quickSignupName" name="name" type="text" autocomplete="name" required />
        </label>

        <label class="quick-signup-field" for="quickSignupEmail">
          <span>Email</span>
          <input id="quickSignupEmail" name="email" type="email" autocomplete="email" required />
        </label>

        <label class="quick-signup-field" for="quickSignupPhone">
          <span>Phone</span>
          <input id="quickSignupPhone" name="phone" type="tel" autocomplete="tel" required />
        </label>

        <button class="quick-signup-submit" type="submit">Submit Inquiry →</button>
      </form>

      <div class="quick-signup-success" id="quickSignupSuccess" aria-live="polite">
        Thank you. Your inquiry has been received.
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  const toggle = panel.querySelector('.quick-signup-toggle');
  const form = panel.querySelector('#quickSignupForm');
  const success = panel.querySelector('#quickSignupSuccess');

  const openPanel = () => {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.setAttribute('aria-label', 'Close quick signup form');
  };

  const closePanel = () => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open quick signup form');
  };

  toggle?.addEventListener('click', () => {
    if (panel.classList.contains('open')) {
      closePanel();
      return;
    }

    openPanel();
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submission = {
      name: panel.querySelector('#quickSignupName')?.value.trim() || '',
      email: panel.querySelector('#quickSignupEmail')?.value.trim() || '',
      phone: panel.querySelector('#quickSignupPhone')?.value.trim() || '',
      source_site: window.location.hostname || 'pinnaclerealty.ca',
      lead_source: 'Pinnacle Realty Homepage Quick Sign Up',
      type: 'homepage_quick_signup',
      status: 'new',
      submitted_at: new Date().toISOString()
    };

    if (!submission.name || !submission.email || !submission.phone) return;

    const submitButton = form.querySelector('.quick-signup-submit');

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/27658537/4om81g5/', {
        method: 'POST',
        body: new URLSearchParams(submission)
      });

      console.log('Quick signup Zapier payload sent:', submission);
      console.log('Quick signup Zapier webhook response:', zapierResponse.status);

      form.reset();
      success?.classList.add('is-visible');
    } catch (zapierError) {
      console.error('Quick signup Zapier webhook error:', zapierError);
      alert('Something went wrong. Please try again.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Inquiry →';
      }
    }
  });

  if (isHomePage) {
    window.setTimeout(openPanel, 3000);
  }
}

function createZapierChatbot() {
  if (document.querySelector('zapier-interfaces-chatbot-embed')) return;

  if (!document.querySelector('script[src="https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js"]')) {
    const zapierScript = document.createElement('script');
    zapierScript.async = true;
    zapierScript.type = 'module';
    zapierScript.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
    document.body.appendChild(zapierScript);
  }

  const chatbot = document.createElement('zapier-interfaces-chatbot-embed');
  chatbot.setAttribute('is-popup', 'true');
  chatbot.setAttribute('chatbot-id', 'cmpd2aie9007nvaf2gco8orac');

  document.body.appendChild(chatbot);
}

createNav();
createFooter();
createQuickSignupPopup();
createZapierChatbot();
optimizePagePerformance();

// Logo sizing fix
const style = document.createElement('style');
style.innerHTML = `
  html:not(.js-ready) body {
    opacity: 1;
  }

  img {
    content-visibility: auto;
  }

  .navbar-logo-img {
    height: 46px;
    width: auto;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    .navbar-logo-img {
      height: 28px;
    }
  }

  .footer-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }

  .footer-logo-img {
    height: 40px;
    width: auto;
    object-fit: contain;
    opacity: 0.9;
    filter: brightness(0.95) saturate(0.9);
    display: block;
    margin: 0 auto;
  }

  .footer-brand-area {
    text-align: left;
  }

  @media (min-width: 1100px) {
    .footer-main {
      display: grid;
      grid-template-columns: repeat(5, minmax(130px, 1fr)) minmax(280px, 0.9fr);
      gap: 26px;
      align-items: start;
    }

    .footer-column {
      min-width: 0;
    }

    .footer-brand-area {
      justify-self: end;
      max-width: 310px;
      text-align: center;
      padding-top: 0;
    }

    .footer-logo {
      justify-content: center;
      margin-top: 0;
      margin-bottom: 10px;
    }

    .footer-logo-img {
      height: 44px;
    }
  }
`;
document.head.appendChild(style);