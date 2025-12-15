/* --- THEME MANAGEMENT --- */

// THEME MANAGEMENT - світла тема за замовчуванням
function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  
  // Update theme color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if(metaThemeColor) {
    if(theme === 'dark') {
      metaThemeColor.content = '#0F0F0F';
    } else if(theme === 'lion') {
      metaThemeColor.content = '#667eea';
    } else {
      metaThemeColor.content = '#FAFAFA';
    }
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

