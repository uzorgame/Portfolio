/* --- SCREENSHOTS MODAL --- */

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

function loadScreenshots(type) {
  const screenshots = screenshotsData[type];
  if (!screenshots) return;
  
  currentScreenshotIndex = 0;
  
  screenshotsModalContent.innerHTML = `
    <div style="display: flex; gap: 24px; height: 100%; align-items: stretch;">
      <!-- Left Thumbnails -->
      <div id="screenshots-left" style="display: flex; flex-direction: column; gap: 10px; overflow-y: auto; max-height: 75vh; padding: 4px; flex-shrink: 0; width: 140px; scrollbar-width: thin;">
      </div>
      
      <!-- Center Preview -->
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-width: 0; gap: 0;">
        <!-- Preview Image Container -->
        <div style="position: relative; width: 100%; flex: 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%); border-radius: 16px; overflow: hidden; box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);">
          <img id="screenshot-preview" src="${screenshots[0].src}" alt="${screenshots[0].alt}" style="max-width: 90%; max-height: 68vh; width: auto; height: auto; display: block; object-fit: contain; clip-path: inset(5px); border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
        </div>
        
        <!-- Navigation Controls -->
        <div style="display: flex; gap: 16px; align-items: center; padding: 16px 0; justify-content: center;">
          <button id="screenshot-prev" style="padding: 12px 24px; background: linear-gradient(135deg, var(--card-bg) 0%, var(--bg) 100%); border: 1px solid var(--card-border); border-radius: 10px; cursor: pointer; color: var(--text-main); font-weight: 600; font-size: 15px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Prev
          </button>
          <span id="screenshot-counter" style="color: var(--text-main); font-size: 16px; font-weight: 600; min-width: 60px; text-align: center; background: var(--card-bg); padding: 8px 16px; border-radius: 8px; border: 1px solid var(--card-border);">1 / ${screenshots.length}</span>
          <button id="screenshot-next" style="padding: 12px 24px; background: linear-gradient(135deg, var(--card-bg) 0%, var(--bg) 100%); border: 1px solid var(--card-border); border-radius: 10px; cursor: pointer; color: var(--text-main); font-weight: 600; font-size: 15px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-left: 6px;">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Right Thumbnails -->
      <div id="screenshots-right" style="display: flex; flex-direction: column; gap: 10px; overflow-y: auto; max-height: 75vh; padding: 4px; flex-shrink: 0; width: 140px; scrollbar-width: thin;">
      </div>
    </div>
  `;
  
  const leftContainer = document.getElementById('screenshots-left');
  const rightContainer = document.getElementById('screenshots-right');
  const preview = document.getElementById('screenshot-preview');
  const counter = document.getElementById('screenshot-counter');
  const prevBtn = document.getElementById('screenshot-prev');
  const nextBtn = document.getElementById('screenshot-next');
  
  // Split thumbnails between left and right
  const midpoint = Math.ceil(screenshots.length / 2);
  
  screenshots.forEach((img, index) => {
    const thumbnail = document.createElement('div');
    thumbnail.style.cssText = 'border-radius: 10px; overflow: hidden; border: 3px solid transparent; cursor: pointer; transition: all 0.3s ease; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
    thumbnail.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="width: 100%; height: auto; display: block; object-fit: cover; clip-path: inset(5px); transition: transform 0.3s ease;">`;
    thumbnail.onclick = () => selectScreenshot(index);
    
    thumbnail.onmouseenter = () => {
      if (currentScreenshotIndex !== index) {
        thumbnail.style.borderColor = 'var(--text-muted)';
        thumbnail.style.transform = 'scale(1.05)';
      }
    };
    
    thumbnail.onmouseleave = () => {
      if (currentScreenshotIndex !== index) {
        thumbnail.style.borderColor = 'transparent';
        thumbnail.style.transform = 'scale(1)';
      }
    };
    
    if (index < midpoint) {
      leftContainer.appendChild(thumbnail);
    } else {
      rightContainer.appendChild(thumbnail);
    }
    
    if (index === 0) {
      thumbnail.style.borderColor = 'var(--accent)';
      thumbnail.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    }
  });
  
  function selectScreenshot(index) {
    currentScreenshotIndex = index;
    preview.src = screenshots[index].src;
    preview.alt = screenshots[index].alt;
    counter.textContent = `${index + 1} / ${screenshots.length}`;
    
    // Update thumbnail borders and shadows
    const allThumbnails = [...leftContainer.children, ...rightContainer.children];
    allThumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.style.borderColor = 'var(--accent)';
        thumb.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        thumb.style.transform = 'scale(1)';
      } else {
        thumb.style.borderColor = 'transparent';
        thumb.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        thumb.style.transform = 'scale(1)';
      }
    });
  }
  
  // Button hover effects
  prevBtn.onmouseenter = () => {
    prevBtn.style.transform = 'translateY(-2px)';
    prevBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  };
  prevBtn.onmouseleave = () => {
    prevBtn.style.transform = 'translateY(0)';
    prevBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  };
  
  nextBtn.onmouseenter = () => {
    nextBtn.style.transform = 'translateY(-2px)';
    nextBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  };
  nextBtn.onmouseleave = () => {
    nextBtn.style.transform = 'translateY(0)';
    nextBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  };
  
  prevBtn.onclick = () => {
    const newIndex = (currentScreenshotIndex - 1 + screenshots.length) % screenshots.length;
    selectScreenshot(newIndex);
  };
  
  nextBtn.onclick = () => {
    const newIndex = (currentScreenshotIndex + 1) % screenshots.length;
    selectScreenshot(newIndex);
  };
  
  // Keyboard navigation
  document.addEventListener('keydown', function screenshotKeyNav(e) {
    if (!screenshotsModal.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn.click();
    }
  });
}

function openScreenshotsModal(type) {
  // Save current scroll position
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  
  // Prevent body scroll without shifting content
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = scrollbarWidth + 'px';
  
  // Prevent iOS bounce scroll and preserve scroll position
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  
  // Store scroll position for restoration
  document.body.setAttribute('data-scroll-y', scrollY);
  
  loadScreenshots(type);
  
  screenshotsModal.classList.add('active');
  screenshotsModalOverlay.classList.add('active');
  screenshotsModal.setAttribute('aria-hidden', 'false');
}

function closeScreenshotsModal() {
  screenshotsModal.classList.remove('active');
  screenshotsModalOverlay.classList.remove('active');
  screenshotsModal.setAttribute('aria-hidden', 'true');

  const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0', 10);

  // Той самий безстрибковий підхід, що й у privacy-modal: глушимо глобальний
  // scroll-behavior:smooth і одним синхронним кадром вертаємо точну позицію.
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
}

document.querySelectorAll('[data-screenshots]').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const type = button.getAttribute('data-screenshots');
    openScreenshotsModal(type);
  });
});

if (screenshotsModalClose) {
  screenshotsModalClose.addEventListener('click', closeScreenshotsModal);
}
if (screenshotsModalOverlay) {
  screenshotsModalOverlay.addEventListener('click', closeScreenshotsModal);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && screenshotsModal && screenshotsModal.classList.contains('active')) {
    closeScreenshotsModal();
  }
});

// Make functions globally available
window.openScreenshotsModal = openScreenshotsModal;
window.closeScreenshotsModal = closeScreenshotsModal;
