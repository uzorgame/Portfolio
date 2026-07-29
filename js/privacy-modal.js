/* --- PRIVACY MODAL --- */

const privacyModal = document.getElementById('privacy-modal');
const privacyModalOverlay = document.getElementById('privacy-modal-overlay');
const privacyModalClose = document.getElementById('privacy-modal-close');
const privacyModalContent = document.getElementById('privacy-modal-content');
const privacyModalTitle = document.getElementById('privacy-modal-title');

const privacyPolicies = {
  'converter': 'privacy-policy-converter.md',
  'sudoku': 'privacy-policy-sudoku.md',
  'retro-arcade': 'privacy-policy-retro-arcade.md',
  '3D-Solar-System': 'privacy-policy-3D-Solar-System.md',
  'rutalive': 'privacy-policy-rutalive.md',
  'kora': 'privacy-policy-kora.md'
};

function markdownToHTML(markdown) {
  let html = markdown;
  // Headers
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr>');
  // Process lists - wrap consecutive list items
  const lines = html.split('\n');
  let inList = false;
  let listItems = [];
  let processedLines = [];
  
  lines.forEach((line, index) => {
    const isListItem = /^[\-\*] (.+)$/.test(line.trim()) || /^\d+\. (.+)$/.test(line.trim());
    
    if (isListItem) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      const content = line.replace(/^[\-\*] /, '').replace(/^\d+\. /, '');
      listItems.push('<li>' + content + '</li>');
    } else {
      if (inList) {
        processedLines.push('<ul>' + listItems.join('') + '</ul>');
        listItems = [];
        inList = false;
      }
      // Зберігаємо ВСІ рядки (в т.ч. порожні), щоб split('\n\n') нижче коректно
      // ділив текст на окремі абзаци <p> (інакше все зливалось в один блок).
      processedLines.push(line);
    }
  });
  
  if (inList && listItems.length > 0) {
    processedLines.push('<ul>' + listItems.join('') + '</ul>');
  }
  
  html = processedLines.join('\n');
  
  // Process paragraphs
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (!para) return '';
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<hr')) {
      return para;
    }
    return '<p>' + para + '</p>';
  }).join('\n');
  
  // Clean up
  html = html.replace(/<p><h/gim, '<h');
  html = html.replace(/<\/h([1-6])><\/p>/gim, '</h$1>');
  html = html.replace(/<p><ul>/gim, '<ul>');
  html = html.replace(/<\/ul><\/p>/gim, '</ul>');
  html = html.replace(/<p><hr><\/p>/gim, '<hr>');
  html = html.replace(/<p><\/p>/gim, '');
  return html;
}

// Кеш готових політик: тип → Promise<{html, title}>. Завдяки кешу повторне
// відкриття миттєве, а префетч нижче робить миттєвим і перше.
const policyCache = {};

function fetchPolicy(type) {
  const fileName = privacyPolicies[type];
  if (!fileName) return Promise.reject(new Error('Unknown policy'));
  if (policyCache[type]) return policyCache[type];

  policyCache[type] = fetch(fileName)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load');
      return response.text();
    })
    .then((markdown) => {
      const titleMatch = markdown.match(/^# (.+)$/m);
      return { html: markdownToHTML(markdown), title: titleMatch ? titleMatch[1] : null };
    })
    .catch((err) => {
      delete policyCache[type]; // невдалий фетч не кешуємо — наступний клік спробує знову
      throw err;
    });

  return policyCache[type];
}

// Префетч усіх політик у фоні після завантаження сторінки — на момент кліку
// текст уже в памʼяті, модалка відкривається без затримки мережі.
window.addEventListener('load', () => {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  idle(() => { Object.keys(privacyPolicies).forEach((type) => fetchPolicy(type).catch(() => {})); });
});

async function openPrivacyModal(type) {
  // Запамʼятовуємо позицію скролу й «замикаємо» сторінку через position:fixed —
  // це залишає її рівно на місці, поки відкрита модалка (модалка ж бо оверлей).
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  document.body.setAttribute('data-scroll-y', String(scrollY));

  // Компенсуємо ширину скролбара, щоб контент не «стрибнув» вбік при його зникненні.
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) document.body.style.paddingRight = scrollbarWidth + 'px';
  window.lenis && window.lenis.stop(); // пауза інерційного скролу, поки модалка відкрита

  // Вікно показуємо ОДРАЗУ (зі спінером, якщо текст ще не в кеші) — клік
  // мусить давати миттєву реакцію. Завдяки префетчу кеш майже завжди теплий,
  // тож стрибка висоти на практиці немає.
  privacyModalTitle.textContent = 'Privacy Policy';
  privacyModal.classList.add('active');
  privacyModalOverlay.classList.add('active');
  privacyModal.setAttribute('aria-hidden', 'false');

  const cached = policyCache[type];
  if (!cached) privacyModalContent.innerHTML = '<div class="modal-loading">Loading</div>';

  try {
    const { html, title } = await fetchPolicy(type);
    // якщо користувач устиг закрити модалку — не чіпаємо DOM даремно
    privacyModalContent.innerHTML = html;
    if (title) privacyModalTitle.textContent = title;
  } catch (error) {
    privacyModalContent.innerHTML = '<p>Error loading privacy policy. Please try again later.</p>';
  }
  privacyModalContent.scrollTop = 0; // завжди відкриваємо згори тексту
}

function closePrivacyModal() {
  privacyModal.classList.remove('active');
  privacyModalOverlay.classList.remove('active');
  privacyModal.setAttribute('aria-hidden', 'true');
  window.lenis && window.lenis.start();

  const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0', 10);

  // Глушимо глобальний html{scroll-behavior:smooth} на час відновлення — інакше
  // повернення позиції анімувалось би («сповзало»). Знімаємо фіксацію й тим самим
  // синхронним кадром вертаємо ТУ САМУ позицію, тож сторінка лишається де була.
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

document.querySelectorAll('[data-privacy]').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const type = button.getAttribute('data-privacy');
    openPrivacyModal(type);
  });
});

if (privacyModalClose) {
  privacyModalClose.addEventListener('click', closePrivacyModal);
}
if (privacyModalOverlay) {
  privacyModalOverlay.addEventListener('click', closePrivacyModal);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && privacyModal && privacyModal.classList.contains('active')) {
    closePrivacyModal();
  }
});

// Розмір вікна більше не потребує JS-переміщення модалки: висоту й центрування
// тримає CSS (max-height + transform), а довгий текст скролиться всередині.

// Make functions globally available
window.openPrivacyModal = openPrivacyModal;
window.closePrivacyModal = closePrivacyModal;

