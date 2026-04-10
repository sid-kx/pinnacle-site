const navConfig = [
  {
    title: 'ABOUT', href: 'about.html', key: 'about', children: [
      { title: 'About', href: 'about.html', key: 'about' },
      { title: 'Management', href: 'management.html', key: 'management' },
      { title: 'Agents', href: 'agents.html', key: 'agents' },
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
  { title: 'LISTINGS', href: 'listing-alerts.html', key: 'listing-alerts' },
  { title: 'NEW CONSTRUCTION', href: 'new-construction.html', key: 'new-construction' },
  { title: 'MEDIA', href: 'media.html', key: 'media' },
  { title: 'CONTACT', href: 'contact.html', key: 'contact' },
];

const footerColumns = [
  {
    heading: 'ABOUT',
    links: [
      ['About', 'about.html'],
      ['Management', 'management.html'],
      ['Agents', 'agents.html'],
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
      ['Listings', 'listing-alerts.html'],
      ['New Construction', 'new-construction.html'],
      ['Media', 'media.html'],
      ['Contact', 'contact.html'],
      ['Join Us', 'https://join.pinnaclerealty.ca'],
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
      return `<a class="submenu-link ${childActive}" href="${child.href}">${child.title}</a>`;
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
          <a href="index.html" class="navbar-logo brand" aria-label="Pinnacle Realty home">PINN<span class="logo-lambda">Λ</span>CLE</a>

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
            <div class="footer-logo">PINNACLE</div>
            <p class="footer-copy">Modern presentation. Elevated service.</p>
          </div>
        </div>
        <div class="footer-bottom">
          <strong>PINNACLE REALTY</strong>
          <span>Copyright © <span id="year"></span> All Rights Reserved</span>
          <a href="contact.html">Privacy Policy</a>
          <a href="contact.html">Terms of Service</a>
        </div>
      </div>
    </footer>`;

  const year = mount.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
}

createNav();
createFooter();
