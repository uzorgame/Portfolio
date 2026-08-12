/* ═══ Nahreba — Boot: departure board ═══
 *
 * The site is a list of things that shipped, so the opening is the board that
 * announces them. Rows arrive from below, every cell rolls through characters
 * and lands the way a split flap board settles.
 *
 * Nothing here is typed in by hand. The rows are read out of the project cards
 * on the page, in the order the page puts them, and the platforms are derived
 * from the links each card actually carries: a Website link means web, an App
 * Store link means iOS, and so on. The three counters read their targets from
 * the hero. That is deliberate. A board with its own copy of the facts drifts
 * away from the page the first time a project is added, and then it lies.
 *
 * Debug: ?boot=1 forces it, ?boot=0 skips it, ?bootspeed=4 stretches it,
 * ?bootphase=board|sweep freezes a moment so it can be screenshotted.
 * On localhost the BOOT button in the nav replays it without a reload.
 */
(function () {
  const root = document.documentElement;

  /* Which link on a card proves which platform. */
  const PLATFORM_OF = {
    website: 'WEB',
    appStore: 'IOS',
    googlePlay: 'ANDROID',
    android: 'ANDROID',
    windows: 'WIN',
  };
  /* Platforms are listed in the order the card lists its own links, so the one
     a project leads with on the page is the one the board leads with too. */

  /* The page already sorts its projects, through the prefix on each i18n key.
     Reusing that grouping is what keeps the board and the page in agreement;
     inventing a taxonomy here would only be a second opinion. */
  const KIND_OF = { other: 'PRODUCT', apps: 'APP', games: 'GAME' };

  const WIDTHS = [20, 7, 19, 5, 4];
  const HEAD = ['PRODUCT', 'KIND', 'PLATFORMS', 'YEAR', 'STATUS'];

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+';
  const rnd = () => CHARS[(Math.random() * CHARS.length) | 0];

  /* Timing, before the speed factor. A cell settles later the further into the
     grid it sits, so a wave crosses the board instead of a flicker. */
  const ROW_STEP = 95;
  const COL_STEP = 105;
  const CHAR_STEP = 22;
  const FLAP_EVERY = 45;
  const ROW_IN = 380;
  const TAIL = 260;
  const SWEEP_MS = 700;

  /** Reads the board straight off the page, in the page's own order. */
  function readProjects() {
    return Array.from(document.querySelectorAll('.proj')).map((card) => {
      const nameEl = card.querySelector('.proj-name');
      const name = (nameEl || {}).textContent || '';
      const group = nameEl && nameEl.dataset.i18n ? nameEl.dataset.i18n.split('.')[0] : '';
      const kind = KIND_OF[group] || 'PRODUCT';
      const date = (card.querySelector('.proj-date') || {}).textContent || '';
      const tag = (card.querySelector('.proj-tag') || {}).textContent || '';

      const platforms = [];
      card.querySelectorAll('[data-i18n^="common."]').forEach((a) => {
        const p = PLATFORM_OF[a.dataset.i18n.slice(7)];
        if (p && platforms.indexOf(p) === -1) platforms.push(p);
      });

      const year = (date.match(/\d{4}/) || ['—'])[0];
      const status = /beta/i.test(tag) ? 'BETA' : 'LIVE';

      return {
        cells: [name.toUpperCase(), kind, platforms.join(' '), year, status],
        platforms,
      };
    });
  }

  /** The counters belong to the hero, so they are read from it. */
  function readStats() {
    const nums = Array.from(document.querySelectorAll('.hero-stats .stat-num'));
    const labels = Array.from(document.querySelectorAll('.hero-stats .stat-label'));
    return nums.map((n, i) => ({
      target: parseInt(n.textContent, 10) || 0,
      label: (labels[i] ? labels[i].textContent : '').toUpperCase(),
    }));
  }

  function run() {
    const params = new URLSearchParams(location.search);
    const speed = Math.max(0.1, Number(params.get('bootspeed')) || 1);
    const frozen = params.get('bootphase');

    const projects = readProjects();
    const stats = readStats();
    if (!projects.length) { root.classList.remove('booting'); return; }

    const old = document.querySelector('.boot');
    if (old) old.remove();

    const rowDone = [];
    let lastSettle = 0;
    projects.forEach((p, r) => {
      let done = 0;
      p.cells.forEach((text, c) => {
        const at = r * ROW_STEP + c * COL_STEP + (WIDTHS[c] - 1) * CHAR_STEP;
        if (at > done) done = at;
      });
      rowDone.push(done);
      if (done > lastSettle) lastSettle = done;
    });
    const total = lastSettle + TAIL;

    const el = document.createElement('div');
    el.className = 'boot';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', 'Loading');
    el.style.setProperty('--sweep-ms', SWEEP_MS * speed + 'ms');
    el.style.setProperty('--rowin-ms', ROW_IN * speed + 'ms');
    el.style.setProperty('--rowstep-ms', ROW_STEP * speed + 'ms');

    let html = '<div class="boot__inner"><div class="boot__top">';
    html += '<span class="boot__mark">UZ-OR.COM<b>SHIPPED PRODUCTS</b></span>';
    html += '<span class="boot__clock" id="boot-clock">--:--:--</span>';
    html += '</div><div class="boot__board">';

    html += '<div class="boot__row boot__row--head">';
    HEAD.forEach((h) => { html += `<span class="boot__cell">${h}</span>`; });
    html += '</div>';

    projects.forEach((p, r) => {
      html += `<div class="boot__row" style="--r:${r}">`;
      p.cells.forEach((text, c) => {
        const w = WIDTHS[c];
        const padded = String(text).padEnd(w, ' ').slice(0, w);
        let inner = '';
        for (let i = 0; i < w; i++) {
          const settle = r * ROW_STEP + c * COL_STEP + i * CHAR_STEP;
          inner += `<i data-t="${padded[i]}" data-at="${settle}"> </i>`;
        }
        html += `<span class="boot__cell${c === 4 ? ' boot__cell--status' : ''}">${inner}</span>`;
      });
      html += '</div>';
    });

    html += '</div><div class="boot__foot"><div class="boot__counts">';
    stats.forEach((s) => {
      html += `<span class="boot__count"><b>0</b><em>${s.label}</em></span>`;
    });
    html += '</div><span class="boot__skip">CLICK OR PRESS ANY KEY TO SKIP</span></div></div>';
    el.innerHTML = html;
    document.body.appendChild(el);

    const flaps = Array.from(el.querySelectorAll('.boot__board i'));
    const counts = Array.from(el.querySelectorAll('.boot__count b'));
    const clock = el.querySelector('#boot-clock');

    let start = null;
    let done = false;
    let raf = 0;
    let lastFlap = 0;
    let guard = 0;
    let landed = 0;

    function tickClock() {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      clock.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    }
    tickClock();
    const clockTimer = setInterval(tickClock, 1000);

    /* Every counter walks to the number the hero already shows, in step with
       how much of the board has landed, so the two can never disagree. */
    function creditRows(n) {
      landed = n;
      counts.forEach((c, i) => {
        const v = Math.round(stats[i].target * (n / projects.length));
        if (c.textContent === String(v)) return;
        c.textContent = v;
        c.dataset.bump = '1';
        setTimeout(() => delete c.dataset.bump, 260);
      });
    }

    /* Leaving at once, with no sweep: a skip that still makes you wait is not
       a skip. The sweep is the reward for letting it finish. */
    function bail() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      clearTimeout(guard);
      clearInterval(clockTimer);
      root.classList.remove('booting');
      sessionStorage.setItem('booted', '1');
      el.remove();
    }

    function finish() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      clearTimeout(guard);
      clearInterval(clockTimer);
      el.dataset.phase = 'sweep';
      root.classList.remove('booting');
      sessionStorage.setItem('booted', '1');
      setTimeout(() => el.remove(), SWEEP_MS * speed + 40);
    }

    function tick(now) {
      if (start === null) start = now;
      const t = (now - start) / speed;

      if (now - lastFlap > FLAP_EVERY) {
        lastFlap = now;
        for (const f of flaps) {
          if (f.dataset.done) continue;
          if (t >= +f.dataset.at) {
            f.textContent = f.dataset.t;
            f.dataset.done = '1';
            f.dataset.land = '1';
          } else if (f.dataset.t !== ' ') {
            f.textContent = rnd();
          }
        }
      }

      let n = landed;
      while (n < rowDone.length && t >= rowDone[n]) n++;
      if (n !== landed) creditRows(n);

      if (t >= total) { finish(); return; }
      raf = requestAnimationFrame(tick);
    }

    /* A frozen phase is for screenshots, so nothing moves and nothing finishes. */
    if (frozen) {
      flaps.forEach((f) => { f.textContent = f.dataset.t; f.dataset.done = '1'; });
      el.querySelectorAll('.boot__row').forEach((rw) => { rw.dataset.in = '1'; });
      creditRows(projects.length);
      if (frozen === 'sweep') el.dataset.phase = 'sweep';
      return;
    }

    raf = requestAnimationFrame(tick);

    el.addEventListener('click', bail);
    window.addEventListener('keydown', bail, { once: true });
    window.addEventListener('wheel', bail, { once: true, passive: true });

    /* If anything above throws, the page must not stay hidden. */
    guard = setTimeout(bail, 8000 * speed);
  }

  /* Replay on demand, for looking at the sequence without reloading. */
  window.replayBoot = function () {
    sessionStorage.removeItem('booted');
    root.classList.add('booting');
    window.scrollTo(0, 0);
    run();
  };

  if (root.classList.contains('booting')) run();

  const btn = document.getElementById('boot-replay');
  if (btn) btn.addEventListener('click', () => window.replayBoot());
})();
