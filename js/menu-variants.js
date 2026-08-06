/* ═══════════════════════════════════════════════════════════════
   TEMPORARY — lets the four mobile panel entrances be compared on the
   real menu with the real content. Delete this file, menu-variants.css
   and their two tags in index.html once a variant is chosen.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var NAMES = { a: 'A · Slab', b: 'B · Diagonal wipe', c: 'C · Shutter', d: 'D · Edge unfold' };
  var KEY = 'mv-anim';

  var menu = document.getElementById('mobile-menu');
  var burger = document.getElementById('burger');
  if (!menu || !burger) return;

  // Each link needs a clipping parent for the masked stagger. Doing it here
  // rather than in index.html keeps the markup clean for whichever variant wins.
  Array.prototype.forEach.call(menu.querySelectorAll('.mobile-link'), function (link) {
    var row = document.createElement('div');
    row.className = 'mv-row';
    link.parentNode.insertBefore(row, link);
    row.appendChild(link);
  });

  // Variant C paints the panel out of four falling slabs instead of one plane.
  var slats = document.createElement('div');
  slats.className = 'mv-slats';
  slats.innerHTML = '<i></i><i></i><i></i><i></i>';
  document.body.appendChild(slats);

  // main.js toggles .open on the menu; mirror that onto the slats.
  new MutationObserver(function () {
    slats.classList.toggle('open', menu.classList.contains('open'));
  }).observe(menu, { attributes: true, attributeFilter: ['class'] });

  function apply(v) {
    document.documentElement.setAttribute('data-menu-anim', v);
    try { localStorage.setItem(KEY, v); } catch (e) {}
    Array.prototype.forEach.call(dock.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.v === v));
    });
    name.textContent = NAMES[v];
  }

  var dock = document.createElement('div');
  dock.className = 'mv-dock';
  dock.innerHTML = '<em>ANIM</em>';
  var name = document.createElement('span');
  name.className = 'mv-name';

  ['a', 'b', 'c', 'd'].forEach(function (v) {
    var b = document.createElement('button');
    b.textContent = v.toUpperCase();
    b.dataset.v = v;
    b.title = NAMES[v];
    b.onclick = function () {
      apply(v);
      // Replay straight away so the choice is felt, not read.
      if (menu.classList.contains('open')) {
        burger.click();
        setTimeout(function () { burger.click(); }, 320);
      } else {
        burger.click();
      }
    };
    dock.appendChild(b);
  });

  dock.appendChild(name);
  document.body.appendChild(dock);

  var saved = 'a';
  try { saved = localStorage.getItem(KEY) || 'a'; } catch (e) {}
  apply(saved);
})();
