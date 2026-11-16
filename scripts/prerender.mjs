// Runs after `vite build`. The site is a single-page app, so every URL would
// otherwise serve the same <head>; link previews and search engines read that
// head without running the app. This writes a copy of index.html for each poem
// and case study with its own title, description and share image, and rebuilds
// the sitemap from the same lists.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.resolve(root, process.argv[2] ?? 'build');
const SITE = 'https://niteshjoshi.me';

// Poem and project data are TypeScript with asset imports, so load them through Vite
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { poems } = await vite.ssrLoadModule('/src/data/poems.ts');
const { poemSlug, poemHeading, poemLines } = await vite.ssrLoadModule('/src/utils/poems.ts');
const { projects } = await vite.ssrLoadModule('/src/data/projects.ts');
await vite.close();

const template = await readFile(path.join(outDir, 'index.html'), 'utf8');

const escapeAttr = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Returns index.html with its head rewritten for one page. */
function withHead({ title, description, url, image, type = 'article' }) {
  const set = (html, pattern, value) => {
    if (!pattern.test(html)) throw new Error(`index.html no longer has a tag matching ${pattern}`);
    return html.replace(pattern, (_, before, after) => `${before}${escapeAttr(value)}${after}`);
  };

  let html = template;
  html = set(html, /(<title>)[^<]*(<\/title>)/, title);
  html = set(html, /(<meta name="description" content=")[^"]*(")/, description);
  html = set(html, /(<meta property="og:title" content=")[^"]*(")/, title);
  html = set(html, /(<meta property="og:description" content=")[^"]*(")/, description);
  html = set(html, /(<meta property="og:url" content=")[^"]*(")/, url);
  html = set(html, /(<meta property="og:type" content=")[^"]*(")/, type);
  html = set(html, /(<meta name="twitter:title" content=")[^"]*(")/, title);
  html = set(html, /(<meta name="twitter:description" content=")[^"]*(")/, description);
  html = set(html, /(<link rel="canonical" href=")[^"]*(")/, url);
  if (image) {
    html = set(html, /(<meta property="og:image" content=")[^"]*(")/, image);
    html = set(html, /(<meta name="twitter:image" content=")[^"]*(")/, image);
  }
  return html;
}

async function writePage(route, head) {
  const dir = path.join(outDir, route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), withHead({ ...head, url: `${SITE}/${route}` }));
}

const routes = [
  { path: '', priority: '1.0' },
  { path: 'poetry', priority: '0.9' },
];

await writePage('poetry', {
  title: 'Poetry | Nitesh Joshi',
  description: "Explore Nitesh Joshi's collection of heartfelt poems and verses. Discover poetry about love, life, and personal reflections.",
});

for (const poem of poems) {
  const slug = poemSlug(poem);
  await writePage(`poetry/${slug}`, {
    title: `${poemHeading(poem).heading} — a poem by Nitesh Joshi`,
    description: poemLines(poem).slice(0, 3).join(' / ') || `A handwritten poem by Nitesh Joshi, ${poem.date}.`,
    image: `${SITE}/og/${slug}.jpg`,
  });
  routes.push({ path: `poetry/${slug}`, priority: '0.7' });
}

const studies = projects.filter((project) => project.caseStudy);
for (const project of studies) {
  await writePage(`work/${project.slug}`, {
    title: `${project.title} — Case study | Nitesh Joshi`,
    description: project.caseStudy.lede,
  });
  routes.push({ path: `work/${project.slug}`, priority: '0.8' });
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE}${route.path ? `/${route.path}` : ''}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
await writeFile(path.join(outDir, 'sitemap.xml'), sitemap);

console.log(`Prerendered ${poems.length} poems and ${studies.length} case studies; sitemap lists ${routes.length} URLs.`);
