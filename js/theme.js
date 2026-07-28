/* --- THEME MANAGEMENT --- */

// THEME MANAGEMENT - світла тема за замовчуванням
function applyTheme(theme) {
  const root = document.documentElement;
  // Глушимо ВСІ CSS-переходи на час зміни теми, щоб старий вигляд елементів
  // (напр. бейдж «Доступно») не «пробігав» анімацією при світла↔темна.
  root.classList.add('theme-switching');
  root.setAttribute('data-theme', theme);
  void root.offsetWidth; // форсуємо застосування нових стилів без переходу
  requestAnimationFrame(() => root.classList.remove('theme-switching'));

  // Update theme color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if(metaThemeColor) {
    metaThemeColor.content = theme === 'dark' ? '#0F0F0F' : '#FAFAFA';
  }
  
  // Update active button (desktop and mobile)
  document.querySelectorAll('.theme-btn, .mobile-theme-btn').forEach(btn => {
    btn.classList.remove('active');
    if(btn.dataset.theme === theme) {
      btn.classList.add('active');
    }
  });
  
  // Save to localStorage
  localStorage.setItem('theme', theme);
}

// Initialize theme - світла за замовчуванням, але перевіряємо localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
// Застосовуємо тему одразу, щоб уникнути мерехтіння
applyTheme(savedTheme);

// Theme switcher buttons (desktop and mobile)
const themeButtons = document.querySelectorAll('.theme-btn, .mobile-theme-btn');
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    applyTheme(theme);
  });
});

// Make applyTheme globally available
window.applyTheme = applyTheme;

