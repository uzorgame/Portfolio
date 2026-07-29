/* --- ПЛАВНИЙ СКРОЛ (Lenis) ---
   Інерційний momentum-скрол на десктопі (як у топових портфоліо).
   На тач-пристроях лишаємо нативний скрол — він там і так плавний.
   Поважаємо prefers-reduced-motion: не вмикаємо інерцію взагалі. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    lerp: 0.1,          // плавне «наздоганяння» — м'який глайд
    smoothWheel: true,  // згладжуємо колесо миші / тачпад
    wheelMultiplier: 1,
    // smoothTouch за замовчуванням false → на телефонах нативний скрол
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Доступний глобально: nav використовує lenis.scrollTo, модалки — stop/start.
  window.lenis = lenis;
})();
