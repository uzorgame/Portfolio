/* A static server for looking at the site before pushing it.
 *
 * The site has no build, so there was nothing to run it with locally and changes
 * were checked by pushing them. This serves the folder the way the host does —
 * a file, or <path>/index.html, or a real 404 — so the apps in subfolders behave
 * here exactly as they will live, including their per-route pages.
 *
 * Dev only. Nothing about the deployed site depends on it.
 *
 * `npm run serve`, then http://localhost:5200
 */
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname, extname, normalize } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = Number(process.env.PORT) || 5200

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.exe': 'application/octet-stream',
}

createServer((req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0].split('#')[0])

  /* Not one step above the folder, whatever the request says. */
  const target = normalize(join(ROOT, path))
  if (!target.startsWith(ROOT)) {
    res.writeHead(403)
    return res.end('403')
  }

  let file = target
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')

  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end('<h1>404</h1>')
  }

  res.writeHead(200, {
    'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  createReadStream(file).pipe(res)
}).listen(PORT, () => console.log(`uz-or.com on http://localhost:${PORT}`))
