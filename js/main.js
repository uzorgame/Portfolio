/* ═══ Nahreba — Main JS ═══ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme ── */
  const currentTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';

  /* The browser chrome on mobile follows this tag. Left static it can only ever
     be right in one theme, and with no tag at all Safari falls back to sampling
     the page background whenever it feels like it, which is why the bars used
     to disagree with the page. Keep the values in step with --bg. */
  const CHROME = { dark: '#0a0a0a', light: '#ffffff' };

  function setChromeColor(t) {
    let m = document.querySelector('meta[name="theme-color"]');
    if (!m) {
      m = document.createElement('meta');
      m.setAttribute('name', 'theme-color');
      document.head.appendChild(m);
    }
    // Editing the attribute in place, rather than replacing the element, is
    // what Safari picks up reliably.
    m.setAttribute('content', CHROME[t] || CHROME.dark);
  }

  function applyTheme(t) {
    document.documentElement.classList.add('theme-switching');
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    setChromeColor(t);
    document.querySelectorAll('.theme-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === t);
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-switching');
      });
    });
  }

  /* The page in the new theme is painted over the old one and then uncovered
     from the top left corner, so the switch reads as a sheet unrolling across
     the screen. Browsers without view transitions get the instant swap. */
  function setTheme(t) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !document.startViewTransition) { applyTheme(t); return; }
    // Dark falls from the top left, light returns from the bottom right, so the
    // two switches read as one motion and its reverse.
    document.documentElement.dataset.wipe = t === 'dark' ? 'tl' : 'br';
    const vt = document.startViewTransition(() => applyTheme(t));
    // An interrupted transition rejects `ready`, and with nobody listening the
    // browser logs an InvalidStateError on every quick double switch.
    vt.ready.catch(() => {});
    // During the wipe the page is a composited snapshot, so a browser reading
    // the chrome colour mid animation can catch half of the old theme. Setting
    // it again once the transition has settled is what makes it stick.
    vt.finished.then(() => setChromeColor(t)).catch(() => {});
  }

  applyTheme(currentTheme());

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

  /* ── Older work, folded ──
     The state lives on the button's aria-expanded and on one data attribute; the
     CSS reads both, so there is no height to measure here and nothing to keep in
     sync. Labels are two spans in the markup rather than text written from here,
     which keeps the translator in charge of them. */
  const fold = document.getElementById('proj-fold');
  const older = document.getElementById('proj-older');
  if (fold && older) {
    fold.addEventListener('click', () => {
      const open = fold.getAttribute('aria-expanded') === 'true';
      fold.setAttribute('aria-expanded', String(!open));
      if (open) older.removeAttribute('data-open');
      else older.setAttribute('data-open', '');
    });
  }

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

    // Close first. Opening the mobile menu calls lenis.stop(), and a scrollTo
    // issued against a stopped instance is silently dropped — which is why every
    // link in the mobile menu appeared to do nothing. closeMobileMenu() restarts
    // Lenis, so the scroll has to be queued after it.
    closeMobileMenu();

    // getBoundingClientRect survives transformed/positioned ancestors; offsetTop
    // does not, and returns an offset relative to the wrong parent.
    const top = target.getBoundingClientRect().top + window.scrollY - 80;

    requestAnimationFrame(() => {
      if (lenis) {
        // force:true is the part that matters. Lenis drops a scrollTo whenever the
        // instance is stopped, and the mobile menu stops it while open — the exact
        // window in which these links are clicked. Closing first is not enough on
        // its own, because start() does not take effect until the next tick.
        lenis.scrollTo(top, { duration: 1.2, force: true });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
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
  // The four slabs that draw the panel; they carry the background the menu used
  // to have, so they must open and close in step with it.
  const mobileSlats = document.getElementById('mobile-slats');

  /* Long enough for the closing cascade to finish: the first row starts last,
     at 0.36s, and takes 0.5s to go. Only after that may the panel leave. */
  const CLOSE_MS = 900;
  let closeTimer = 0;

  function openMobileMenu() {
    // A dismissal still in flight would otherwise keep holding the panel, fight
    // the delays being applied for the way in, and then strip its classes from
    // under the newly opened menu when its timer came due.
    clearTimeout(closeTimer);
    mobileMenu.classList.remove('closing');

    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    burger.classList.add('open');
    if (mobileSlats) mobileSlats.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function toggleMobileMenu() {
    if (mobileMenu.classList.contains('open')) closeMobileMenu();
    else openMobileMenu();
  }

  /* One dismissal for every way out of the menu. There used to be a second,
     sideways one for when a link was picked, on the theory that navigating is a
     different intent from dismissing. In practice the difference never read,
     and it cost a separate timer, a class swap and a frame with transitions
     muted, which is where its jank came from. */
  function closeMobileMenu() {
    if (!mobileMenu.classList.contains('open')) return;

    // Keeps the panel on screen while the rows leave, so the reverse cascade is
    // actually visible rather than played off canvas.
    mobileMenu.classList.add('closing');
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      mobileMenu.classList.remove('closing');
    }, CLOSE_MS);

    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    burger.classList.remove('open');
    if (mobileSlats) mobileSlats.classList.remove('open');
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
  const modalBack = document.getElementById('modal-back');
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
    // The enlarged state has to go with it. Left set, the next thing opened in this dialog —
    // a privacy policy, say — would inherit a layout meant for one picture.
    modal.classList.remove('modal--zoomed');
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
  /* Each product keeps its screenshots in its own folder under Public, so adding a project
     never means picking apart a shared pile. `shape` decides the grid: posters are tall
     sheets that sit three across, application windows are wide and need the room. */
  const shotSets = {
    poster: {
      title: 'Poster',
      dir: 'Public/poster/shots',
      shape: 'tall',
      shots: [
        { file: 'london', alt: 'A minimalist map poster of London made with Poster' },
        { file: 'new-york', alt: 'A minimalist map poster of New York made with Poster' },
        { file: 'tokyo', alt: 'A minimalist map poster of Tokyo made with Poster' }
      ]
    },
    kora: {
      title: 'Kora Wallet',
      dir: 'Public/kora/shots',
      shape: 'wide',
      shots: [
        { file: 'portfolio', alt: 'Kora Wallet portfolio: total balance, value curve and holdings' },
        { file: 'transactions', alt: 'Kora Wallet transaction history' },
        { file: 'market', alt: 'Kora Market: live prices for twenty coins' },
        { file: 'chart', alt: 'Kora Market: a price chart with market statistics' }
      ]
    },
    // Store listing shots, 1080x1920: taller than a poster sheet, so the ratio is its own.
    calvi: {
      title: 'Calvi',
      dir: 'Public/calvi/shots',
      shape: 'tall',
      ratio: 1080 / 1920,
      small: 640,
      large: 1080,
      shots: [
        { file: '01', alt: 'Calvi: the whole day on one screen, calories, macros and the streak' },
        { file: '02', alt: 'Calvi: a meal logged from a few words in the chat' },
        { file: '03', alt: 'Calvi: Nora asks only what matters, one tap to answer' },
        { file: '04', alt: 'Calvi: every bite with its macros' },
        { file: '05', alt: 'Calvi: a meal recognised from a photo' },
        { file: '06', alt: 'Calvi: the week review' },
        { file: '07', alt: 'Calvi: analytics and the weight curve' }
      ]
    }
  };

  /// The `sizes` the grid uses, remembered so unzooming can put it back. Set on every open.
  let gridSizes = '';

  function openShots(key) {
    const set = shotSets[key];
    if (!set) return;

    // The two widths each set was exported at, and the size each is actually rendered at.
    // Getting `sizes` right is what decides whether a phone downloads the small file or the
    // large one, and the difference on the poster set is half a megabyte per picture.
    const tall = set.shape === 'tall';
    const small = set.small || (tall ? 640 : 760);
    const large = set.large || (tall ? 1400 : 1520);
    // Width over height. Posters are A-series sheets at 1:1.4; the application windows are
    // 1518x924. Both sets are uniform, so one ratio per shape is enough.
    const ratio = set.ratio || (tall ? 640 / 896 : 1518 / 924);
    const sizes = tall
      ? '(max-width: 700px) calc(92vw - 56px), 340px'
      : '(max-width: 700px) calc(92vw - 56px), 560px';
    gridSizes = sizes;

    modalTitle.textContent = set.title;
    modalBody.innerHTML =
      '<div class="shots shots--' + set.shape + '">' +
      set.shots
        .map((s) => {
          const base = set.dir + '/' + s.file;
          return (
            '<figure class="shot">' +
            '<img src="' + base + '.webp" ' +
            'srcset="' + base + '.webp ' + small + 'w, ' + base + '@2x.webp ' + large + 'w" ' +
            'sizes="' + sizes + '" ' +
            // Stated so the grid cell has its height before the picture arrives. Without
            // them a lazily-loaded row is zero-high until it decodes and everything below
            // jumps when it does.
            'width="' + small + '" height="' + Math.round(small / ratio) + '" ' +
            'loading="lazy" decoding="async" ' +
            // No caption. A poster carries its city typeset across the sheet, and an
            // application window carries its own title bar; a label underneath would name
            // each of them twice. The alt text carries it for anyone who cannot see them.
            'alt="' + s.alt + '">' +
            '</figure>'
          );
        })
        .join('') +
      '</div>';

    modalBody.scrollTop = 0;
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  /* ── Enlarging one screenshot ──
     FLIP rather than a CSS size transition. The layout change is drastic — a tile in a grid
     becomes a single full-width figure — and no property on the grid animates that smoothly.
     So the new layout is applied instantly, the difference against the old position is
     measured, and the element is animated from that difference back to nothing. What the eye
     follows is the picture it just clicked, moving to where it is going. */
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  function flip(shots, apply) {
    const first = new Map(shots.map((s) => [s, s.getBoundingClientRect()]));
    apply();
    for (const shot of shots) {
      const a = first.get(shot);
      const b = shot.getBoundingClientRect();
      if (!a.width || !b.width) continue;
      shot.animate(
        [
          {
            transformOrigin: 'top left',
            transform: `translate(${a.x - b.x}px, ${a.y - b.y}px) scale(${a.width / b.width})`,
          },
          { transformOrigin: 'top left', transform: 'none' },
        ],
        { duration: 420, easing: EASE }
      );
    }
  }

  function zoomShot(shot) {
    const shots = [...modalBody.querySelectorAll('.shot')];
    const img = shot.querySelector('img');
    // The picture is about to be shown several times larger, so it is told so before the
    // layout changes and the browser has the chance to pick the bigger file for the frame it
    // lands on rather than the one after.
    if (img) img.sizes = '(max-width: 700px) calc(92vw - 56px), 80vh';
    // Only the one being opened is animated in place. The others are leaving, and following
    // them to a position they will not occupy would be motion that means nothing.
    flip([shot], () => {
      shots.forEach((s) => s.classList.toggle('shot--open', s === shot));
      modalBody.querySelector('.shots').classList.add('shots--zoomed');
      modal.classList.add('modal--zoomed');
    });
    modalBody.scrollTop = 0;
  }

  function unzoomShot() {
    const grid = modalBody.querySelector('.shots');
    if (!grid || !grid.classList.contains('shots--zoomed')) return false;
    const open = modalBody.querySelector('.shot--open');
    const img = open && open.querySelector('img');
    if (img) img.sizes = gridSizes;
    flip(open ? [open] : [], () => {
      grid.classList.remove('shots--zoomed');
      modalBody.querySelectorAll('.shot--open').forEach((s) => s.classList.remove('shot--open'));
      modal.classList.remove('modal--zoomed');
    });
    return true;
  }

  modalBody.addEventListener('click', (e) => {
    const img = e.target.closest('.shot img');
    if (img && !modalBody.querySelector('.shots--zoomed')) {
      zoomShot(img.closest('.shot'));
      return;
    }
    // A click anywhere in the body that is not on the enlarged picture collapses it. The
    // whole surround is the way back, which is what people reach for before they look for a
    // button.
    if (modalBody.querySelector('.shots--zoomed') && !e.target.closest('.shot--open')) {
      unzoomShot();
    }
  });

  if (modalBack) {
    modalBack.addEventListener('click', (e) => {
      e.preventDefault();
      unzoomShot();
    });
  }

  document.querySelectorAll('[data-shots]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openShots(btn.getAttribute('data-shots'));
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', () => {
    // The overlay closes the dialog outright even from the enlarged view: it is outside the
    // dialog altogether, so it means "leave", not "go back one step".
    closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      // One step at a time. Escape from an enlarged screenshot returns to the set; only then
      // does it close the dialog.
      if (unzoomShot()) return;
      if (modal.classList.contains('active')) closeModal();
      closeMobileMenu();
    }
  });

});
