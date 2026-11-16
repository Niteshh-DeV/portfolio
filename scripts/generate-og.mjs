// Draws the share cards and icons by screenshotting small HTML pages in headless Chrome:
//   public/og-image.png            the site card
//   public/og/<slug>.jpg           one card per poem
//   public/favicon*.{png,ico}, public/apple-touch-icon.png
//
// Run after adding or renaming a poem:  npm run og
// Needs Google Chrome; set CHROME_PATH if it is not in the default macOS location.
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9337;

const INK = '#0c0b0a';
const BONE = '#ece6da';
const MUTE = '#958d80';
const VERMILION = '#e05a2b';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Poem data and its helpers are TypeScript with asset imports, so load them through Vite
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { poems } = await vite.ssrLoadModule('/src/data/poems.ts');
const { poemSlug, poemHeading, poemLines } = await vite.ssrLoadModule('/src/utils/poems.ts');
await vite.close();

const font = (file) => pathToFileURL(path.join(publicDir, 'fonts', file)).href;
const base = `
  @font-face { font-family: Bodoni; font-style: normal; font-weight: 400 700; src: url("${font('bodoni-moda-normal-latin.woff2')}"); }
  @font-face { font-family: Bodoni; font-style: italic; font-weight: 400 700; src: url("${font('bodoni-moda-italic-latin.woff2')}"); }
  @font-face { font-family: Mono; src: url("${font('jetbrains-mono-normal-latin.woff2')}"); }
  @font-face { font-family: Deva; src: url("${font('tiro-devanagari-hindi-normal-devanagari.woff2')}"); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 100%; height: 100%; background: ${INK}; color: ${BONE}; overflow: hidden; }
  body { font-family: Bodoni, serif; -webkit-font-smoothing: antialiased; }
  .label { font-family: Mono, monospace; font-size: 17px; letter-spacing: 0.16em; text-transform: uppercase; color: ${MUTE}; }
  .card { position: relative; width: 1200px; height: 630px; padding: 56px 64px; display: flex; flex-direction: column; justify-content: space-between; }
  .row { display: flex; justify-content: space-between; align-items: baseline; }
  .rule { height: 2px; background: ${VERMILION}; margin-bottom: 22px; }
  em { font-style: italic; color: ${VERMILION}; }
`;

const page = (body, extraCss = '') => `<!doctype html><html><head><meta charset="utf-8"><style>${base}${extraCss}</style></head><body>${body}</body></html>`;

const siteCard = page(
  `<div class="card">
    <div class="row"><span class="label">Portfolio — Vol. MMXXVI</span><span class="deva">नितेश जोशी</span></div>
    <h1>Nitesh <em>Joshi</em></h1>
    <div><div class="rule"></div><div class="row"><span class="label">Engineer &amp; Poet</span><span class="label">niteshjoshi.me</span></div></div>
  </div>`,
  `h1 { font-weight: 400; font-size: 212px; line-height: 0.85; letter-spacing: -0.045em; white-space: nowrap; }
   .deva { font-family: Deva, serif; font-size: 26px; color: ${VERMILION}; }`
);

function poemCard(poem) {
  const { heading } = poemHeading(poem);
  const lines = poemLines(poem);
  // untitled poems take their first line as the heading, so the excerpt starts after it
  const excerpt = (heading === poem.title ? lines : lines.slice(1)).slice(0, 3);
  const size = heading.length > 34 ? 68 : heading.length > 20 ? 92 : 132;

  return page(
    `<div class="card">
      <span class="mark">“</span>
      <div class="row"><span class="label">A poem by Nitesh Joshi</span><span class="label">${escapeHtml(poem.date.replace(/\s*\(.*\)/, ''))}</span></div>
      <div>
        <h1 style="font-size:${size}px" class="${heading === poem.title ? '' : 'first-line'}">${escapeHtml(heading)}</h1>
        <p>${excerpt.length ? excerpt.map(escapeHtml).join('<br>') : 'A handwritten manuscript'}</p>
      </div>
      <div><div class="rule"></div><div class="row"><span class="label">Poems</span><span class="label">niteshjoshi.me/poetry</span></div></div>
    </div>`,
    `h1 { font-weight: 400; line-height: 0.95; letter-spacing: -0.03em; max-width: 1000px; }
     h1.first-line { font-style: italic; }
     p { margin-top: 28px; font-style: italic; font-size: 30px; line-height: 1.4; color: ${MUTE}; max-width: 900px; }
     .mark { position: absolute; top: -70px; right: 48px; font-style: italic; font-size: 560px; line-height: 1; color: ${BONE}; opacity: 0.06; }`
  );
}

const icon = page(
  `<div class="icon"><span>N</span><i></i></div>`,
  `.icon { position: relative; width: 100vw; height: 100vw; display: grid; place-items: center; }
   .icon span { font-size: 78vw; font-weight: 700; line-height: 1; margin-top: -4vw; }
   .icon i { position: absolute; right: 13vw; bottom: 15vw; width: 15vw; height: 15vw; border-radius: 50%; background: ${VERMILION}; }`
);

// --- drive Chrome over the DevTools protocol ---------------------------------

const workDir = await mkdtemp(path.join(tmpdir(), 'og-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--hide-scrollbars', '--no-first-run', `--user-data-dir=${path.join(workDir, 'profile')}`, 'about:blank'], { stdio: 'ignore' });

let target;
for (let attempt = 0; attempt < 40 && !target; attempt += 1) {
  try {
    const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
    target = targets.find((entry) => entry.type === 'page');
  } catch {
    // Chrome is still starting
  }
  if (!target) await sleep(250);
}
if (!target) {
  chrome.kill();
  throw new Error(`Could not start Chrome at ${CHROME}`);
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) => (socket.onopen = resolve));
let nextId = 0;
const pending = new Map();
socket.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.id && pending.has(data.id)) {
    pending.get(data.id)(data.result);
    pending.delete(data.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    nextId += 1;
    pending.set(nextId, resolve);
    socket.send(JSON.stringify({ id: nextId, method, params }));
  });

async function shoot(html, width, height, format = 'png') {
  const file = path.join(workDir, 'page.html');
  await writeFile(file, html);
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: pathToFileURL(file).href });
  await sleep(250);
  await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
  await sleep(120);
  const { data } = await send('Page.captureScreenshot', format === 'jpeg' ? { format, quality: 88 } : { format });
  return Buffer.from(data, 'base64');
}

// An .ico file may simply wrap a PNG: a 6-byte header, one 16-byte directory entry, then the image
function toIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // offset of the image data
  return Buffer.concat([header, png]);
}

try {
  await send('Page.enable');
  await mkdir(path.join(publicDir, 'og'), { recursive: true });

  await writeFile(path.join(publicDir, 'og-image.png'), await shoot(siteCard, 1200, 630));

  for (const poem of poems) {
    await writeFile(path.join(publicDir, 'og', `${poemSlug(poem)}.jpg`), await shoot(poemCard(poem), 1200, 630, 'jpeg'));
  }

  const icon48 = await shoot(icon, 48, 48);
  await writeFile(path.join(publicDir, 'favicon-48.png'), icon48);
  await writeFile(path.join(publicDir, 'favicon.ico'), toIco(icon48, 48));
  await writeFile(path.join(publicDir, 'favicon-48.ico'), toIco(icon48, 48));
  await writeFile(path.join(publicDir, 'apple-touch-icon.png'), await shoot(icon, 180, 180));

  console.log(`Wrote the site card, ${poems.length} poem cards and the icons.`);
} finally {
  socket.close();
  // Chrome keeps writing to its profile until it has exited
  const exited = new Promise((resolve) => chrome.once('exit', resolve));
  chrome.kill();
  await exited;
  await rm(workDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
