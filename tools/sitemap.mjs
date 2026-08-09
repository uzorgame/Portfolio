/* One sitemap for the whole domain.
 *
 * uz-or.com serves the portfolio at the root and three apps in folders under
 * it, and search engines want one file per host, not one per project. The app
 * generates its own list as part of its build; this reads that list, rewrites
 * nothing, and prepends the pages the portfolio owns.
 *
 * It exists because the merge used to be done by hand, and a hand-merged
 * sitemap goes stale the first time a page is added or removed — which is
 * exactly what happened: the QuirePDF case study was never in it. */
import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const ROOT = 'C:/Work/Active/Portfolio';
const APP = 'C:/Work/Active/QuirePDF/sitemap.xml';
const stamp = new Date().toISOString().slice(0, 10);

/* Pages the portfolio itself serves. The apps in folders are listed by their
   own builds; only their entry point belongs here. */
const OWN = [
  ['', 1.0, 'weekly'],
  ['cv.html', 0.8, 'monthly'],
  ['rutalive-case-study.html', 0.7, 'monthly'],
  ['whisper-case-study.html', 0.7, 'monthly'],
  ['poster-case-study.html', 0.7, 'monthly'],
  ['quirepdf-case-study.html', 0.7, 'monthly'],
  ['Poster/', 0.8, 'monthly'],
  ['Whisper/', 0.8, 'monthly'],
];

const app = [...readFileSync(APP, 'utf8').matchAll(/<url>[\s\S]*?<\/url>/g)].map(m => m[0]);
if (!app.length) throw new Error('the app sitemap is empty — run its build first');

const own = OWN.map(([path, priority, freq]) =>
  `  <url><loc>https://uz-or.com/${path}</loc><lastmod>${stamp}</lastmod>` +
  `<changefreq>${freq}</changefreq><priority>${priority.toFixed(1)}</priority></url>`);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...own,
  ...app.map(u => '  ' + u.trim()),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml — ${own.length + app.length} URLs (${own.length} portfolio, ${app.length} QuirePDF)`);
