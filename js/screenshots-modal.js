/* --- SCREENSHOTS MODAL (адаптивна галерея: велике прев'ю + стрічка мініатюр) --- */

const screenshotsModal = document.getElementById('screenshots-modal');
const screenshotsModalOverlay = document.getElementById('screenshots-modal-overlay');
const screenshotsModalClose = document.getElementById('screenshots-modal-close');
const screenshotsModalContent = document.getElementById('screenshots-modal-content');

const screenshotsData = {
  'rutalive': [
    { src: 'Public/rutalive/ruta-dashboard.webp', alt: 'RutaLive Operator Dashboard' },
    { src: 'Public/rutalive/ruta-map.png', alt: 'RutaLive Delivery Zones Map' },
    { src: 'Public/rutalive/ruta-app-order.png', alt: 'RutaLive Courier App — Order' },
    { src: 'Public/rutalive/ruta-app-route.png', alt: 'RutaLive Courier App — Route' },
    { src: 'Public/rutalive/ruta-app-delivery.png', alt: 'RutaLive Courier App — Delivery' },
    { src: 'Public/rutalive/ruta-app-select.png', alt: 'RutaLive Courier App — Select' }
  ],
  'kora': [
    { src: 'Public/kora/koraphone1.jpg', alt: 'Kora Wallet Mobile 1' },
    { src: 'Public/kora/koraphone2.jpg', alt: 'Kora Wallet Mobile 2' },
    { src: 'Public/kora/koraphone3.jpg', alt: 'Kora Wallet Mobile 3' },
    { src: 'Public/kora/korawindowswallet1.png', alt: 'Kora Wallet Windows 1' },
    { src: 'Public/kora/korawindowswallet2.png', alt: 'Kora Wallet Windows 2' },
    { src: 'Public/kora/korawindowswallet3.png', alt: 'Kora Wallet Windows 3' },
    { src: 'Public/kora/koramarket1.png', alt: 'Kora Market Widget 1' },
    { src: 'Public/kora/koramarket2.png', alt: 'Kora Market Widget 2' },
    { src: 'Public/kora/koramarket3.png', alt: 'Kora Market Widget 3' }
  ]
};

let currentScreenshotIndex = 0;
let currentShots = [];

function selectScreenshot(index) {
  if (!currentShots.length) return;
  currentScreenshotIndex = index;
  const preview = document.getElementById('screenshot-preview');
  const counter = document.getElementById('screenshot-counter');
  const strip = document.getElementById('screenshots-strip');
  if (!preview) return;
  preview.src = currentShots[index].src;
  preview.alt = currentShots[index].alt;
  if (counter) counter.textContent = `${index + 1} / ${currentShots.length}`;
  if (strip) {
    [...strip.children].forEach((t, i) => t.classList.toggle('active', i === index));
    // тримаємо активну мініатюру у видимій частині стрічки
    if (strip.children[index]) {
      strip.children[index].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }
}

function loadScreenshots(type) {
  const shots = screenshotsData[type];
  if (!shots) return;
  currentShots = shots;
  currentScreenshotIndex = 0;

  screenshotsModalContent.innerHTML = `
    <div class="ss-gallery">
      <div class="ss-stage">
        <button class="ss-arrow ss-prev" id="screenshot-prev" aria-label="Previous">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <img class="ss-img" id="screenshot-preview" src="${shots[0].src}" alt="${shots[0].alt}">
        <button class="ss-arrow ss-next" id="screenshot-next" aria-label="Next">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <div class="ss-counter" id="screenshot-counter">1 / ${shots.length}</div>
      <div class="ss-strip" id="screenshots-strip" data-lenis-prevent></div>
    </div>
  `;

  const strip = document.getElementById('screenshots-strip');
  shots.forEach((img, index) => {
    const thumb = document.createElement('img');
    thumb.className = 'ss-thumb' + (index === 0 ? ' active' : '');
    thumb.src = img.src;
    thumb.alt = img.alt;
    thumb.loading = 'lazy';
    thumb.addEventListener('click', () => selectScreenshot(index));
    strip.appendChild(thumb);
  });

  document.getElementById('screenshot-prev').addEventListener('click', () => {
    selectScreenshot((currentScreenshotIndex - 1 + shots.length) % shots.length);
  });
  document.getElementById('screenshot-next').addEventListener('click', () => {
    selectScreenshot((currentScreenshotIndex + 1) % shots.length);
  });

  // Свайп вліво/вправо по великому зображенню (мобільні пристрої).
  // Вертикаль віддаємо сторінці (touch-action: pan-y у CSS), горизонталь — наша.
  const stage = screenshotsModalContent.querySelector('.ss-stage');
  let touchStartX = 0, touchStartY = 0;
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // поріг 40px відсікає випадкові тапи; беремо жест лише коли він горизонтальний
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      selectScreenshot((currentScreenshotIndex + (dx < 0 ? 1 : -1) + shots.length) % shots.length);
    }
  }, { passive: true });
}

function openScreenshotsModal(type) {
  // Зберігаємо позицію скролу й «замикаємо» сторінку.
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) document.body.style.paddingRight = scrollbarWidth + 'px';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.setAttribute('data-scroll-y', scrollY);
  window.lenis && window.lenis.stop();

  loadScreenshots(type);
  screenshotsModalContent.scrollTop = 0;
  screenshotsModal.classList.add('active');
  screenshotsModalOverlay.classList.add('active');
  screenshotsModal.setAttribute('aria-hidden', 'false');
}

function closeScreenshotsModal() {
  screenshotsModal.classList.remove('active');
  screenshotsModalOverlay.classList.remove('active');
  screenshotsModal.setAttribute('aria-hidden', 'true');

  const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0', 10);

  // Той самий безстрибковий підхід: глушимо smooth і одним кадром вертаємо позицію.
  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.body.removeAttribute('data-scroll-y');

  window.scrollTo(0, scrollY);
  html.style.scrollBehavior = prevBehavior;
  window.lenis && window.lenis.start();
}

document.querySelectorAll('[data-screenshots]').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    openScreenshotsModal(button.getAttribute('data-screenshots'));
  });
});

if (screenshotsModalClose) screenshotsModalClose.addEventListener('click', closeScreenshotsModal);
if (screenshotsModalOverlay) screenshotsModalOverlay.addEventListener('click', closeScreenshotsModal);

// Один глобальний обробник клавіш: Escape + стрілки (без накопичення слухачів).
document.addEventListener('keydown', (e) => {
  if (!screenshotsModal || !screenshotsModal.classList.contains('active')) return;
  if (e.key === 'Escape') {
    closeScreenshotsModal();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const b = document.getElementById('screenshot-prev'); if (b) b.click();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    const b = document.getElementById('screenshot-next'); if (b) b.click();
  }
});

window.openScreenshotsModal = openScreenshotsModal;
window.closeScreenshotsModal = closeScreenshotsModal;
