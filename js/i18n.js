/* --- INTERNATIONALIZATION --- */

// TRANSLATIONS
const translations = {
  en: {
    "nav.home": "Home", "nav.apps": "Apps", "nav.games": "Games", "nav.other": "Other", "nav.about": "About", "nav.donate": "Donate", "nav.feedback": "Feedback",
    "theme.light": "Light", "theme.dark": "Dark",
    "hero.title": "Code with purpose.<br>Design with soul.",
    "hero.subtitle": "Uzor — I work alone for a bowl of rice",
    "tags.works": "If it works — don't touch",
    "tags.crashes": "If it crashes — say it's a feature",
    "tags.flutter": "My back hurts",
    "apps.title": "Utility", "apps.subtitle": "Tools for everyday efficiency.",
    "apps.currency.title": "Currency Converter+", "apps.currency.tag": "Available", "apps.currency.desc": "Offline-first currency converter. No ads, no tracking, just exchange rates updated daily. Pure utility.",
    "games.title": "Games", "games.subtitle": "Digital zen for your brain.",
    "games.sudoku.title": "Sudoku", "games.sudoku.tag": "Available", "games.sudoku.desc": "A minimalist Sudoku experience. Smart pencil marks and absolutely zero distractions.",
    "games.retro.title": "Retro Arcade", "games.retro.tag": "In Dev", "games.retro.desc": "A retro collection of classic arcade-style mini games in one clean app. No coins, no waiting.",
    "other.title": "Other", "other.subtitle": "Interactive web experiences.",
    "other.solar.title": "3D Solar System", "other.solar.tag": "Available", "other.solar.desc": "Interactive 3D visualization of our solar system. Explore all planets, dwarf planets, moons, asteroids, and comets in real-time. Adjust speed, follow celestial bodies, and discover the cosmos at your own pace.",
    "about.title": "About", "about.bio": "Hi, I'm Uzor. I do what I like and what interests me. These apps and this work are a hobby for me, but if you want to offer me a job - I'll gladly accept XD",
    "tab.philosophy": "About Me", "tab.roadmap": "Roadmap",
    "roadmap.title": "Roadmap",
    "roadmap.sudoku.title": "Sudoku — Released", "roadmap.sudoku.desc": "Legendary Sudoku game",
    "roadmap.solar.title": "3D Solar System — Released", "roadmap.solar.desc": "Interactive web experience available",
    "roadmap.currency.title": "Currency Converter+ — Released", "roadmap.currency.desc": "Easy and fast currency conversion",
    "roadmap.retro.title": "Retro Arcade — Planned", "roadmap.retro.desc": "Classic arcade games collection",
    "donate.title": "Donate", "donate.note": "Independent development is fueled by coffee and crypto. Tap to copy.", "common.googlePlay": "Google Play", "common.open": "Open",
    "common.privacyPolicy": "Privacy", "common.website": "Website", "footer.text": "© 2025 Uzor. Built with enthusiasm."
  },
  uk: {
    "nav.home": "Головна", "nav.apps": "Софт", "nav.games": "Ігри", "nav.other": "Інше", "nav.about": "Інфо", "nav.donate": "Донат", "nav.feedback": "Зв'язок",
    "theme.light": "Світла", "theme.dark": "Темна",
    "hero.title": "Код зі змістом.<br>Дизайн з душею.",
    "hero.subtitle": "Uzor — я тут працюю один за миску рису",
    "tags.works": "Якщо працює — не чіпай",
    "tags.crashes": "Якщо зламалося — скажи, що це фіча",
    "tags.flutter": "Болить спина",
    "apps.title": "Утиліти", "apps.subtitle": "Інструменти для ефективності.",
    "apps.currency.title": "Currency Converter+", "apps.currency.tag": "Доступно", "apps.currency.desc": "Офлайн конвертер валют. Жодної реклами, трекерів. Тільки актуальні курси.",
    "games.title": "Ігри", "games.subtitle": "Цифровий дзен.",
    "games.sudoku.title": "Sudoku", "games.sudoku.tag": "Доступно", "games.sudoku.desc": "Мінімалістичне судоку. Розумні нотатки і жодних відволікаючих факторів.",
    "games.retro.title": "Retro Arcade", "games.retro.tag": "В розробці", "games.retro.desc": "Ретро-збірка класичних аркадних ігор. Без монет, без очікування, просто гра.",
    "other.title": "Інше", "other.subtitle": "Інтерактивні веб-досвіди.",
    "other.solar.title": "3D Сонячна Система", "other.solar.tag": "Доступно", "other.solar.desc": "Інтерактивна 3D візуалізація нашої сонячної системи. Досліджуйте всі планети, карликові планети, супутники, астероїди та комети в реальному часі. Налаштуйте швидкість, слідуйте за небесними тілами та відкривайте космос у своєму темпі.",
    "about.title": "Про нас", "about.bio": "Привіт, я Uzor. Я роблю те, що мені подобається і те, що мені цікаво. Ці додатки і ця робота для мене хобі, але якщо ти хочеш запропонувати мені роботу - я з радістю погоджусь XD",
    "tab.philosophy": "Про мене", "tab.roadmap": "План розробки",
    "roadmap.title": "План розробки",
    "roadmap.sudoku.title": "Sudoku — Випущено", "roadmap.sudoku.desc": "Легендарна гра Sudoku",
    "roadmap.solar.title": "3D Сонячна Система — Випущено", "roadmap.solar.desc": "Інтерактивний веб-досвід доступний",
    "roadmap.currency.title": "Currency Converter+ — Випущено", "roadmap.currency.desc": "Легка та швидка конвертація вашої валюти",
    "roadmap.retro.title": "Retro Arcade — Заплановано", "roadmap.retro.desc": "Колекція класичних аркадних ігор",
    "donate.title": "Підтримка", "donate.note": "Інді-розробка працює на каві та крипті. Натисни, щоб скопіювати.", "common.googlePlay": "Google Play", "common.open": "Відкрити",
    "common.privacyPolicy": "Приватність", "common.website": "Сайт", "footer.text": "© 2025 Uzor. Зроблено з точністю."
  }
};

// LOCALIZATION with localStorage and browser detection
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  if(browserLang.startsWith('uk') || browserLang.startsWith('ru')) {
    return 'uk';
  }
  return 'en';
}

const langButtons = document.querySelectorAll(".lang-btn, .mobile-lang-btn");

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if(translations[lang] && translations[lang][key]) {
      if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });
  
  // Update theme buttons aria-label and title (desktop and mobile)
  const lightText = translations[lang]?.["theme.light"] || "Light";
  const darkText = translations[lang]?.["theme.dark"] || "Dark";
  
  // Update all light/dark buttons
  document.querySelectorAll('.theme-btn[data-theme="light"], .mobile-theme-btn[data-theme="light"]').forEach(btn => {
    btn.setAttribute('aria-label', `${lightText} theme`);
    btn.setAttribute('title', `${lightText} theme`);
  });
  document.querySelectorAll('.theme-btn[data-theme="dark"], .mobile-theme-btn[data-theme="dark"]').forEach(btn => {
    btn.setAttribute('aria-label', `${darkText} theme`);
    btn.setAttribute('title', `${darkText} theme`);
  });
  
  // Update HTML lang attribute
  document.documentElement.setAttribute('lang', lang === 'uk' ? 'uk' : 'en');
  
  // Update active button (desktop and mobile)
  langButtons.forEach(b => b.classList.remove("active"));
  document.querySelectorAll(`.lang-btn[data-lang="${lang}"], .mobile-lang-btn[data-lang="${lang}"]`).forEach(btn => btn.classList.add("active"));
  
  // Save to localStorage
  localStorage.setItem('language', lang);
}

// Initialize language
const savedLang = localStorage.getItem('language') || detectBrowserLanguage();
applyLanguage(savedLang);

langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    applyLanguage(lang);
  });
});

// Make translations and applyLanguage globally available
window.translations = translations;
window.applyLanguage = applyLanguage;

