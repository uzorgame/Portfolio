/* The downloadable CV, printed from the CV page.
 *
 * There were two of these for a while: cv.html, which is the page, and a PDF
 * beside it that had been produced by hand once. They drifted, which is the only
 * thing that was ever going to happen — the PDF still said eight products after
 * the ninth had shipped and did not know MorseWorld existed.
 *
 * So the PDF is no longer a document. It is a rendering of the page, printed by
 * the same engine a reader would use, which means the page is the single source
 * and the file cannot say something the site does not. `@media print` in cv.html
 * is what strips the toolbar and the screen padding; nothing here duplicates
 * that.
 *
 * Run it with `npm run cv` after editing cv.html.
 *
 * Chrome does the printing because it is the only thing on hand that lays out
 * the page's own CSS correctly — LibreOffice's HTML import would re-flow it into
 * something else entirely, and a CV that does not match the site is the problem
 * this replaces.
 */
import {spawnSync} from 'node:child_process'
import {existsSync, mkdtempSync, rmSync, statSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {join, dirname} from 'node:path'
import {tmpdir} from 'node:os'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const PAGE = join(ROOT, 'cv.html')
const OUT = join(ROOT, 'Mykhailo_Nahreba_CV.pdf')

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => p && existsSync(p))

if (!CHROME) {
  throw new Error('No Chrome or Edge found to print with. Install one, or print cv.html to '
    + 'PDF by hand and replace Mykhailo_Nahreba_CV.pdf.')
}
if (!existsSync(PAGE)) throw new Error('cv.html is missing.')

/* Its own profile directory, thrown away afterwards: printing must not touch the
   browser the person at this machine is using, and headless Chrome writes to the
   default profile if it is not given one. */
const profile = mkdtempSync(join(tmpdir(), 'cv-print-'))

try {
  const run = spawnSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-pdf-header-footer',
    `--print-to-pdf=${OUT}`,
    /* A file URL rather than a served one, so this works without a server; the
       page loads no external script and needs none. */
    `file:///${PAGE.replace(/\\/g, '/')}`,
  ], {encoding: 'utf8', timeout: 60_000})

  if (run.error) throw run.error
  if (!existsSync(OUT)) {
    throw new Error(`Chrome exited with ${run.status} and wrote nothing.\n${run.stderr ?? ''}`)
  }
  console.log(`Mykhailo_Nahreba_CV.pdf — ${Math.round(statSync(OUT).size / 1024)} kB, printed from cv.html`)
} finally {
  rmSync(profile, {recursive: true, force: true})
}
