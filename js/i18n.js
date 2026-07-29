/* --- INTERNATIONALIZATION --- */

// TRANSLATIONS
const translations = {
  en: {
    "nav.home": "Home", "nav.projects": "Projects", "nav.about": "About", "nav.stack": "Stack", "nav.contact": "Contact", "nav.apps": "Apps", "nav.games": "Games", "nav.other": "Other", "nav.donate": "Donate", "nav.feedback": "Feedback",
    "eyebrow.projects": "01 / Work", "eyebrow.about": "02 / About", "eyebrow.stack": "03 / Stack", "eyebrow.contact": "04 / Contact",
    "projects.title": "Projects", "projects.subtitle": "From the newest work down to the very first.",
    "date.ruta": "Nov 2025 – Present", "date.kora": "Feb 2026", "date.retro": "Oct – Nov 2025", "date.currency": "Oct 2025", "date.sudoku": "Sep – Oct 2025",
    "theme.light": "Light", "theme.dark": "Dark",
    "hero.eyebrow": "Nahreba Mykhailo · Bratislava · Open to work",
    "hero.title": "Design. Develop.<br>Ship.",
    "hero.subtitle": "Product engineer with my own apps, games and web products. Co-founder and active developer of RutaLive — a courier-logistics SaaS competing with major dispatch companies across the US and Canada.",
    "hero.proof": "<b>5</b> products · <b>4</b> platforms · <b>3</b> stores",
    "stack.title": "Tools I build with", "stack.mobile": "Mobile", "stack.web": "Web", "stack.graphics": "Graphics & Maps", "stack.infra": "Infra",
    "cta.title": "Let's work together.", "cta.note": "I reply personally, usually the same day.",
    "about.statement": "Product Engineer",
    "about.looking": "Open to full-time roles and product collaborations.",
    "about.focus": "Cross-platform",
    "journey.d1": "2025", "journey.t1": "First shipped products — Sudoku, Currency Converter+, Retro Arcade.",
    "journey.d2": "2025 → Present", "journey.t2": "RutaLive — co-founder & active builder of a courier-logistics SaaS.",
    "journey.d3": "2026", "journey.t3": "Kora Wallet — non-custodial multi-chain wallet.",
    "tags.works": "Clean code, minimal design",
    "tags.crashes": "Performance-first approach",
    "tags.flutter": "Built with Flutter & modern web technologies",
    "apps.title": "Utility", "apps.subtitle": "Tools for everyday efficiency.",
    "apps.currency.title": "Currency Converter+", "apps.currency.tag": "Available", "apps.currency.desc": "A fast, offline-first currency converter with a calculator-style interface. Live daily exchange rates, interactive historical charts spanning up to five years, and full offline use through smart 24-hour caching. No ads, no tracking — pure utility.",
    "apps.kora.title": "Kora Wallet", "apps.kora.desc": "A non-custodial, multi-chain crypto wallet — your keys, your assets, no middleman. Manage Bitcoin, Ethereum, Solana, Tron, BNB, Litecoin and Dogecoin plus custom tokens in one app: send, receive, QR scan, an address book and PIN lock, with a live market-tracking widget for Windows desktop. Fully open-source, built with Flutter.",
    "games.title": "Games", "games.subtitle": "Digital zen for your brain.",
    "games.sudoku.title": "Sudoku", "games.sudoku.tag": "Available", "games.sudoku.desc": "A minimalist Sudoku with real depth: four modes — classic, daily challenge, head-to-head battle and a ranked championship — across five calibrated difficulty levels. Smart pencil marks, a clean dark theme and zero distractions.",
    "games.retro.title": "Retro Arcade", "games.retro.tag": "Available", "games.retro.desc": "A love letter to the 80s–90s arcade era: a block-stacking puzzle and classic tank combat, faithfully rebuilt with pixel-perfect graphics, original-style sound and haptic feedback. Local leaderboards, fully offline, no ads and no accounts — just play.",
    "other.title": "Other", "other.subtitle": "Interactive web experiences.",
    "other.ruta.title": "RutaLive", "other.ruta.tag": "Available", "other.ruta.desc": "A courier-logistics SaaS built to compete with the big US and Canadian dispatch platforms — Onfleet, Digital Waybill, Track-POD — at a fraction of their price. Operators run their own couriers, clients and orders from one dashboard: live GPS tracking, proof of delivery (photo, signature, QR), delivery zones with custom pricing, auto-dispatch, invoicing with QuickBooks sync, and public tracking links for recipients. Web, iOS, Android and desktop.",
    "about.cv": "View CV",
    "about.title": "About Me", "about.bio": "Product engineer building cross-platform products end to end — from concept to release on the app stores. Five products shipped across mobile, games and the web. Co-founder and active developer of RutaLive, a multi-tenant SaaS for courier logistics.",
    "tab.philosophy": "About Me", "tab.roadmap": "Roadmap",
    "roadmap.title": "Roadmap",
    "roadmap.sudoku.title": "Sudoku — Released", "roadmap.sudoku.desc": "Available on Google Play",
    "roadmap.currency.title": "Currency Converter+ — Released", "roadmap.currency.desc": "Easy and fast currency conversion",
    "roadmap.retro.title": "Retro Arcade — Released", "roadmap.retro.desc": "Available on Google Play",
    "roadmap.ruta.title": "RutaLive — Released", "roadmap.ruta.desc": "Courier delivery platform — web, mobile & desktop",
    "roadmap.kora.title": "Kora Wallet — Released", "roadmap.kora.desc": "Non-custodial multi-chain crypto wallet",
    "donate.title": "Donate", "donate.note": "Independent development is fueled by coffee and crypto. Tap to copy.", "common.googlePlay": "Google Play", "common.appStore": "App Store", "common.open": "Open",
    "common.privacyPolicy": "Privacy", "common.screenshots": "Screenshots", "common.windows": "Windows", "common.android": "Android", "common.website": "Website", "common.story": "How it was built",
    "story.ruta": "A project born from a real need — to replace the software my friend's courier company was using. This is where I first understood what real IT means: websockets, databases, many users working asynchronously at once, clean architecture, Docker containers, React, Node.js and Astro, GPS maps shipping to web, iOS and Android simultaneously. And the genuinely hard fixes — when one line breaks production and you have to test every platform at once.",
    "story.kora": "A wallet I built for myself out of curiosity about how blockchains and crypto wallets work — and after one too many custodial security stories. I've used it daily since day one. The main challenge was encryption and key derivation matching the standards of major wallets, so the same account can be opened in, say, Trust Wallet when needed. Plus choosing APIs that never slow the wallet down. It has never let me down.",
    "story.retro": "A playful project with a serious technical challenge inside: my first work with graphics — external textures, sprites and sound. I wanted to recreate what our parents' generation played — and it genuinely plays well.",
    "story.currency": "An attempt to go beyond an offline project and understand how APIs work. The goal wasn't \"a popular product\" — it was my first app that lives online: real-time data from external servers, rate caching, handling network failures.",
    "story.sudoku": "My first product — I wanted to build, for myself, something I love in everyday life. This is where I first learned that AI tools are useless without your own understanding of what you're building and how it should work. A full cycle from idea to Google Play — and my first real lesson in engineering thinking.",
    "footer.text": "© 2026 Nahreba Mykhailo. Built with precision."
  },
  uk: {
    "nav.home": "Головна", "nav.projects": "Проєкти", "nav.about": "Про мене", "nav.stack": "Стек", "nav.contact": "Контакт", "nav.apps": "Софт", "nav.games": "Ігри", "nav.other": "Інше", "nav.donate": "Донат", "nav.feedback": "Зв'язок",
    "eyebrow.projects": "01 / Роботи", "eyebrow.about": "02 / Про мене", "eyebrow.stack": "03 / Стек", "eyebrow.contact": "04 / Контакт",
    "projects.title": "Проєкти", "projects.subtitle": "Від найновіших робіт до найпершої.",
    "date.ruta": "Листопад 2025 – зараз", "date.kora": "Лютий 2026", "date.retro": "Жовтень – Листопад 2025", "date.currency": "Жовтень 2025", "date.sudoku": "Вересень – Жовтень 2025",
    "theme.light": "Світла", "theme.dark": "Темна",
    "hero.eyebrow": "Nahreba Mykhailo · Братислава · Відкритий до роботи",
    "hero.title": "Проєктую. Розробляю.<br>Випускаю.",
    "hero.subtitle": "Продуктовий інженер із власними застосунками, іграми та вебпродуктами. Співзасновник і активний розробник RutaLive — SaaS для курʼєрської логістики, що конкурує з великими диспетчерськими компаніями США та Канади.",
    "hero.proof": "<b>5</b> продуктів · <b>4</b> платформи · <b>3</b> сторі",
    "stack.title": "Чим я будую", "stack.mobile": "Мобайл", "stack.web": "Веб", "stack.graphics": "Графіка й карти", "stack.infra": "Інфра",
    "cta.title": "Працюймо разом.", "cta.note": "Відповідаю особисто, зазвичай того ж дня.",
    "about.statement": "Продуктовий інженер",
    "about.looking": "Відкритий до фултайму та продуктових колаборацій.",
    "about.focus": "Кросплатформ",
    "journey.d1": "2025", "journey.t1": "Перші релізи — Sudoku, Currency Converter+, Retro Arcade.",
    "journey.d2": "2025 → зараз", "journey.t2": "RutaLive — співзасновник і активний розробник SaaS для курʼєрської логістики.",
    "journey.d3": "2026", "journey.t3": "Kora Wallet — некастодіальний мультиланцюговий гаманець.",
    "tags.works": "Чистий код, мінімалістичний дизайн",
    "tags.crashes": "Підхід з фокусом на продуктивність",
    "tags.flutter": "Створено на Flutter та сучасних веб-технологіях",
    "apps.title": "Утиліти", "apps.subtitle": "Інструменти для ефективності.",
    "apps.currency.title": "Currency Converter+", "apps.currency.tag": "Доступно", "apps.currency.desc": "Швидкий офлайн-конвертер валют із калькулятор-інтерфейсом. Живі щоденні курси, інтерактивні історичні графіки до пʼяти років і повна офлайн-робота через розумне 24-годинне кешування. Без реклами й трекерів — чиста утиліта.",
    "apps.kora.title": "Kora Wallet", "apps.kora.desc": "Некастодіальний мультиланцюговий крипто-гаманець — твої ключі, твої активи, без посередників. Керуй Bitcoin, Ethereum, Solana, Tron, BNB, Litecoin і Dogecoin та власними токенами в одному застосунку: надсилання, отримання, QR-скан, адресна книга й PIN-замок; окремий віджет відстеження ринку для Windows. Повністю відкритий код, Flutter.",
    "games.title": "Ігри", "games.subtitle": "Цифровий дзен.",
    "games.sudoku.title": "Sudoku", "games.sudoku.tag": "Доступно", "games.sudoku.desc": "Мінімалістичне судоку зі справжньою глибиною: чотири режими — класика, щоденний виклик, батл один-на-один і рейтинговий чемпіонат — на пʼяти вивірених рівнях складності. Розумні нотатки, чиста темна тема, нуль відволікань.",
    "games.retro.title": "Retro Arcade", "games.retro.tag": "Доступно", "games.retro.desc": "Освідчення епосі аркад 80–90-х: блоки-головоломка й класичні танкові баталії, дбайливо відтворені з піксель-графікою, ретро-звуком і вібро-відгуком. Локальні рейтинги, повністю офлайн, без реклами й акаунтів — просто грай.",
    "other.title": "Інше", "other.subtitle": "Інтерактивні веб-досвіди.",
    "other.ruta.title": "RutaLive", "other.ruta.tag": "Доступно", "other.ruta.desc": "SaaS для курʼєрської логістики, створена конкурувати з великими диспетчерськими платформами США й Канади — Onfleet, Digital Waybill, Track-POD — за частку їхньої ціни. Оператор веде власних курʼєрів, клієнтів і замовлення з одного дашборду: live-GPS-трекінг, підтвердження доставки (фото, підпис, QR), зони з власним ціноутворенням, авто-диспетчеризація, інвойси з синхронізацією QuickBooks і публічні tracking-лінки для отримувачів. Веб, iOS, Android і десктоп.",
    "about.cv": "Переглянути CV",
    "about.title": "Про мене", "about.bio": "Продуктовий інженер, який будує кросплатформні продукти від концепту до релізу в сторах. Пʼять випущених продуктів — мобільні застосунки, ігри та веб. Співзасновник і активний розробник RutaLive, багатотенантної SaaS для курʼєрської логістики.",
    "tab.philosophy": "Про мене", "tab.roadmap": "План розробки",
    "roadmap.title": "План розробки",
    "roadmap.sudoku.title": "Sudoku — Випущено", "roadmap.sudoku.desc": "Доступно в Google Play",
    "roadmap.currency.title": "Currency Converter+ — Випущено", "roadmap.currency.desc": "Легка та швидка конвертація вашої валюти",
    "roadmap.retro.title": "Retro Arcade — Випущено", "roadmap.retro.desc": "Доступно в Google Play",
    "roadmap.ruta.title": "RutaLive — Випущено", "roadmap.ruta.desc": "Платформа доставки — веб, мобайл і десктоп",
    "roadmap.kora.title": "Kora Wallet — Випущено", "roadmap.kora.desc": "Некастодіальний мультиланцюговий криптогаманець",
    "donate.title": "Підтримка", "donate.note": "Інді-розробка працює на каві та крипті. Натисни, щоб скопіювати.", "common.googlePlay": "Google Play", "common.appStore": "App Store", "common.open": "Відкрити",
    "common.privacyPolicy": "Приватність", "common.screenshots": "Скриншоти", "common.windows": "Windows", "common.android": "Android", "common.website": "Сайт", "common.story": "Як це було",
    "story.ruta": "Проєкт, що народився з реальної потреби — замінити софт, яким користувалась курʼєрська служба мого товариша. Тут я вперше зрозумів, що таке справжній IT: вебсокети, бази даних, асинхронна робота багатьох користувачів, чиста архітектура, Docker-контейнери, React, Node.js та Astro, GPS-карти одразу на вебі, iOS та Android. І справді важкі фікси — коли один рядок ламає прод, а тестувати треба всі платформи одночасно.",
    "story.kora": "Гаманець, який я створив для себе через цікавість, як працюють блокчейни та криптогаманці, та часті проблеми з безпекою custodial-рішень — і яким користуюся щодня від першого дня. Головний виклик — шифрування та деривація ключів за стандартами великих гаманців, щоб свій акаунт за потреби можна було відкрити хоч у Trust Wallet. Плюс вибір API, які не гальмують роботу. Жодного разу мене не підвів.",
    "story.retro": "Жартівливий проєкт із серйозним технічним завданням усередині: перша робота з графікою — зовнішні текстури, спрайти та звук. Хотілося відтворити те, у що грали ще наші батьки, — і воно справді грається.",
    "story.currency": "Спроба зробити щось більше за офлайн-проєкт і зрозуміти, як працюють API. Завдання було не «популярний продукт», а перший застосунок, який живе онлайн: real-time дані із зовнішніх серверів, кешування курсів, обробка збоїв мережі.",
    "story.sudoku": "Мій перший продукт — я захотів створити для себе те, що люблю в повсякденному житті. Саме тут я вперше зрозумів: ШІ-інструменти без власного розуміння, що ти будуєш і як воно має працювати, користі не дадуть. Повний цикл від ідеї до Google Play — і перший справжній урок інженерного мислення.",
    "footer.text": "© 2026 Nahreba Mykhailo. Створено з точністю."
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

