/* Матричний дощ для картки-плейсхолдера «Next».
 *
 * Свідомо монохромний. Канонічний неоново-зелений Matrix тут би побився з
 * усією рештою сторінки: сайт тримається на волосяних лініях і відтінках
 * сірого, і один кислотний прямокутник посеред списку зруйнував би це.
 * Тому дощ малюється тим самим --text, що й решта тексту, просто прозоріший.
 *
 * Три речі, без яких таке краще не вішати на сторінку:
 *   1. Пауза, коли картка поза екраном. Інакше вкладка гріє процесор фоном.
 *   2. Реакція на зміну теми — кольори читаються з CSS-змінних, а не зашиті.
 *   3. prefers-reduced-motion: один статичний кадр замість анімації.
 */
(() => {
  const canvas = document.querySelector('.nx-rain')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')

  const CELL = 15 // крок сітки по горизонталі й вертикалі, px

  let cols = []
  let w = 0
  let h = 0
  let fg = '#f0f0f0'
  let bg = '#0a0a0a'
  let raf = 0
  let running = false

  const digit = () => String((Math.random() * 10) | 0)

  const readColors = () => {
    const s = getComputedStyle(document.documentElement)
    fg = s.getPropertyValue('--text').trim() || fg
    bg = s.getPropertyValue('--bg').trim() || bg
  }

  const seed = () => {
    const n = Math.ceil(w / CELL)
    cols = Array.from({ length: n }, (_, i) => ({
      x: i * CELL + 3,
      y: Math.random() * -h,
      v: 0.8 + Math.random() * 2.2, // px за кадр
      gap: 2 + ((Math.random() * 4) | 0), // розрідженість хвоста
    }))
  }

  const resize = () => {
    const r = canvas.getBoundingClientRect()
    if (!r.width || !r.height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = Math.round(r.width)
    h = Math.round(r.height)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = `500 11px "JetBrains Mono", "Fira Code", monospace`
    ctx.textBaseline = 'top'
    seed()
    wipe()
    if (reduce.matches) still()
  }

  const wipe = () => {
    ctx.globalAlpha = 1
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)
  }

  /** Один нерухомий кадр для reduced-motion. */
  const still = () => {
    wipe()
    ctx.fillStyle = fg
    for (const c of cols) {
      for (let k = 0; k < 5; k++) {
        ctx.globalAlpha = 0.16 - k * 0.03
        ctx.fillText(digit(), c.x, ((c.x * 7 + k * 40) % h | 0) + k * CELL)
      }
    }
    ctx.globalAlpha = 1
  }

  const frame = () => {
    // Слід: напівпрозора заливка фоном замість очищення. Саме вона дає хвіст.
    ctx.globalAlpha = 0.11
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = fg
    for (const c of cols) {
      ctx.globalAlpha = 0.62
      ctx.fillText(digit(), c.x, c.y)

      ctx.globalAlpha = 0.14
      ctx.fillText(digit(), c.x, c.y - CELL * c.gap)

      c.y += c.v
      if (c.y > h + CELL) {
        c.y = -CELL * (1 + Math.random() * 8)
        c.v = 0.8 + Math.random() * 2.2
      }
    }
    ctx.globalAlpha = 1
    raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running || reduce.matches) return
    running = true
    raf = requestAnimationFrame(frame)
  }

  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  readColors()
  resize()

  // Крутиться тільки поки картка на екрані.
  new IntersectionObserver(
    ([e]) => (e.isIntersecting ? start() : stop()),
    { threshold: 0.05 },
  ).observe(canvas)

  // Перемикання теми міняє --bg і --text; перечитуємо і перемальовуємо тло.
  new MutationObserver(() => {
    readColors()
    wipe()
    if (reduce.matches) still()
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  addEventListener('resize', resize, { passive: true })
  reduce.addEventListener('change', () => (reduce.matches ? (stop(), still()) : start()))
  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : start(),
  )
})()
