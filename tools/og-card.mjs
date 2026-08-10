/* The link preview card for uz-or.com itself.
 *
 * Every chat and every feed that shows a link to the site shows this file, so it
 * is the first and often the only thing anyone sees of it. It used to be made by
 * hand, which is why it still said eight products after the ninth had shipped: a
 * number drawn into an image is a number nobody remembers to update.
 *
 * So the three figures are not typed in here. They are read off the page they
 * appear on, and the page is the thing anyone would think to edit. Run it with
 * `npm run og` after changing them.
 *
 * Geometry and colours were measured off the hand-made card this replaces, so
 * the output is the same image with a different figure in it.
 *
 * The three faces are the site's own, vendored beside this file. They are
 * variable fonts and register only their lightest instance, so weight is added
 * by stroking the outline — the same thing a browser does when asked for a bold
 * it has not got. */
import { createCanvas, GlobalFonts } from '@napi-rs/canvas'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')

const font = (file, name) => GlobalFonts.registerFromPath(join(HERE, 'fonts', file), name)
font('SpaceGrotesk.ttf', 'SG')
font('Inter.ttf', 'INTER')
font('JetBrainsMono.ttf', 'JBM')

/* The figures, off the hero of the page itself. */
const page = readFileSync(join(ROOT, 'index.html'), 'utf8')
const STATS = [...page.matchAll(/<span class="stat-num">([^<]+)<\/span>\s*<span class="stat-label">([^<]+)<\/span>/g)].map(
  (m) => [m[1].trim(), m[2].trim().toUpperCase()],
)
if (STATS.length !== 3) throw new Error(`expected three hero stats in index.html, found ${STATS.length}`)

const W = 1200
const H = 630
const M = 72

const BG = '#0A0A0A'
const WHITE = '#FFFFFF'
const SUB = '#8A8A8A'
const LABEL = '#686868'
const KICKER = '#6B6B6B'
const RULE = '#2D2D2D'

const c = createCanvas(W, H)
const g = c.getContext('2d')

const write = (s, x, y, size, fam, weight, colour, align) => {
  g.font = `${size}px ${fam}`
  const w = g.measureText(s).width
  g.fillStyle = colour
  g.strokeStyle = colour
  g.lineWidth = weight
  g.lineJoin = 'round'
  g.fillText(s, align === 'right' ? x - w : x, y)
  if (weight > 0) g.strokeText(s, align === 'right' ? x - w : x, y)
  return w
}

/* Mono small caps are tracked out by hand: the face has no letter-spacing of
   its own, and the card's labels are set wide. */
const tracked = (s, x, y, size, colour, track, align) => {
  g.font = `${size}px JBM`
  const width = [...s].reduce((sum, ch) => sum + g.measureText(ch).width + track, -track)
  let at = align === 'right' ? x - width : x
  g.fillStyle = colour
  for (const ch of s) {
    g.fillText(ch, at, y)
    at += g.measureText(ch).width + track
  }
  return width
}

const line = (x0, y0, x1, y1) => {
  g.strokeStyle = RULE
  g.lineWidth = 1
  g.beginPath()
  g.moveTo(x0, y0 + 0.5)
  g.lineTo(x1, y1 + 0.5)
  g.stroke()
}

g.fillStyle = BG
g.fillRect(0, 0, W, H)

write('nahreba', M, 92, 25, 'SG', 1, WHITE)
tracked('PRODUCT ENGINEER', W - M - 2, 91, 13, KICKER, 2.9, 'right')

write('Design. Develop.', M, 248, 78.5, 'SG', 2.4, WHITE)
write('Ship.', M, 335, 78.5, 'SG', 2.4, WHITE)

write('Mobile apps, games and web products — plus RutaLive, a', M, 420, 22, 'INTER', 0.2, SUB)
write('courier-logistics SaaS.', M, 453, 22, 'INTER', 0.2, SUB)

line(M, 492, W - M, 492)

/* Three columns on a fixed grid, with a hairline between them. */
const COLS = [M, 330, 588]
STATS.forEach(([value, label], i) => {
  if (i) {
    g.strokeStyle = RULE
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(COLS[i] - 67.5, 532)
    g.lineTo(COLS[i] - 67.5, 597)
    g.stroke()
  }
  write(value, COLS[i], 565, 42, 'SG', 1.4, WHITE)
  tracked(label, COLS[i], 592, 11.5, LABEL, 1.8)
})

writeFileSync(join(ROOT, 'og-image.png'), c.toBuffer('image/png'))
console.log(`og-image.png — ${STATS.map(([v, l]) => `${v} ${l.toLowerCase()}`).join(', ')}`)
