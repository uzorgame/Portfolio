/* ═══ Nahreba — Main JS ═══ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme ── */
  const currentTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';

  function setTheme(t) {
    document.documentElement.classList.add('theme-switching');
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    document.querySelectorAll('.theme-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === t);
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-switching');
      });
    });
  }

  setTheme(currentTheme());

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  /* ── Lenis Smooth Scroll ── */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      prevent: (node) => node.closest('.modal-body') !== null,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ── Reveal on Scroll ── */
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ── Nav Active State ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let activeId = null;

  function updateActiveNav() {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewTarget = scrollY + window.innerHeight * 0.35;
    let best = null;
    let bestDist = Infinity;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const top = scrollY + rect.top;
      const center = top + rect.height / 2;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const dist = Math.abs(center - viewTarget);
        if (dist < bestDist) { bestDist = dist; best = sec; }
      }
    });

    if (best && best.id !== activeId) {
      activeId = best.id;
      navLinks.forEach(link => {
        const isMatch = link.getAttribute('href') === '#' + activeId;
        link.classList.toggle('active', isMatch);
      });
    }
  }

  window.addEventListener('scroll', () => requestAnimationFrame(updateActiveNav), { passive: true });
  updateActiveNav();

  /* ── Nav Link Smooth Scroll ── */
  function scrollToSection(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    const top = target.offsetTop - 80;
    if (lenis) {
      lenis.scrollTo(top, { duration: 1.2 });
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }

    closeMobileMenu();
  }

  document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    if (link.getAttribute('href')?.startsWith('#')) {
      link.addEventListener('click', scrollToSection);
    }
  });

  /* ── Mobile Menu ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    burger.classList.toggle('open');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    if (lenis) isOpen ? lenis.start() : lenis.stop();
  }

  function closeMobileMenu() {
    if (!mobileMenu.classList.contains('open')) return;
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    burger.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  if (burger) burger.addEventListener('click', toggleMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  /* ── Privacy Modal ── */
  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');

  const policyFiles = {
    'converter': 'privacy-policy-converter.md',
    'sudoku': 'privacy-policy-sudoku.md',
    'retro-arcade': 'privacy-policy-retro-arcade.md',
    'rutalive': 'privacy-policy-rutalive.md',
    'kora': 'privacy-policy-kora.md'
  };

  function mdToHtml(md) {
    let html = md;
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    html = html.replace(/^---$/gim, '<hr>');

    const lines = html.split('\n');
    let inList = false;
    const items = [];
    const out = [];

    lines.forEach(line => {
      const isBullet = /^[\-*] (.+)$/.test(line.trim()) || /^\d+\. (.+)$/.test(line.trim());
      if (isBullet) {
        if (!inList) { inList = true; items.length = 0; }
        items.push('<li>' + line.replace(/^[\-*] /, '').replace(/^\d+\. /, '') + '</li>');
      } else {
        if (inList) { out.push('<ul>' + items.join('') + '</ul>'); items.length = 0; inList = false; }
        out.push(line);
      }
    });
    if (inList) out.push('<ul>' + items.join('') + '</ul>');

    html = out.join('\n');
    html = html.split('\n\n').map(p => {
      p = p.trim();
      if (!p || /^<[hul]/.test(p) || p.startsWith('<hr')) return p;
      return '<p>' + p + '</p>';
    }).join('\n');

    html = html.replace(/<p><(h|ul|hr)/g, '<$1');
    html = html.replace(/<\/(h[1-6]|ul)><\/p>/g, '</$1>');
    html = html.replace(/<p><\/p>/g, '');
    return html;
  }

  async function openModal(type) {
    const file = policyFiles[type];
    if (!file) return;

    modalBody.innerHTML = '<p>Loading&hellip;</p>';

    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error();
      const md = await res.text();
      modalBody.innerHTML = mdToHtml(md);
      const titleMatch = md.match(/^# (.+)$/m);
      if (titleMatch) modalTitle.textContent = titleMatch[1];
    } catch {
      modalBody.innerHTML = '<p>Error loading privacy policy.</p>';
    }

    modalBody.scrollTop = 0;
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeModal() {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  document.querySelectorAll('[data-privacy]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal(btn.getAttribute('data-privacy'));
    });
  });

  /* ── Screenshots ──
     The same modal as the privacy policies. Escape, the overlay click, the scroll lock and
     the Lenis pause are already wired to it, and a second dialog system would have to
     reimplement all four and then keep them in step. */
  const shotSets = {
    poster: {
      title: 'Poster',
      shots: [
        { file: 'london', place: 'London' },
        { file: 'new-york', place: 'New York' },
        { file: 'tokyo', place: 'Tokyo' }
      ]
    }
  };

  function openShots(key) {
    const set = shotSets[key];
    if (!set) return;

    modalTitle.textContent = set.title;
    // Loaded lazily and at the small size by default; the browser only fetches the 1400px
    // version on a screen that can use it. Three posters at full width would be four
    // megabytes for something first seen at 320 pixels across.
    modalBody.innerHTML =
      '<div class="shots">' +
      set.shots
        .map(
          (s) =>
            '<figure class="shot">' +
            '<img src="Public/poster/' + s.file + '.webp" ' +
            'srcset="Public/poster/' + s.file + '.webp 640w, Public/poster/' + s.file + '@2x.webp 1400w" ' +
            // The real rendered width, not an approximation. The modal is 92vw with 28px of
            // padding on each side, so a phone renders these at ~289px. Declaring 90vw
            // instead put the browser just over the 640px file's reach and it fetched the
            // 1400px one — half a megabyte per poster, on the connection least able to
            // afford it.
            'sizes="(max-width: 700px) calc(92vw - 56px), 300px" ' +
            'width="640" height="896" loading="lazy" decoding="async" ' +
            // No caption: every poster has its city typeset across the bottom of the sheet,
            // so a label underneath would name it twice. The alt text carries it for anyone
            // who cannot see the print.
            'alt="A minimalist map poster of ' + s.place + ' made with Poster">' +
            '</figure>'
        )
        .join('') +
      '</div>';

    modalBody.scrollTop = 0;
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  document.querySelectorAll('[data-shots]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openShots(btn.getAttribute('data-shots'));
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('active')) closeModal();
      closeMobileMenu();
    }
  });

});
