// Збирає src/ у docs/ — сайт для GitHub Pages: index.html (рушій, CSS і реєстр мов вбудовано), по одному файлу на мову
// (langs/<код>.<відбиток>.js), manifest, service worker, іконки. docs/ генерується повністю: правте src/, а не docs/.
// Мовний пакет — окремий файл, а не частина index.html: учень завантажує рушій і лише ту мову, яку вчить,
// а нова мова не робить сторінку важчою для решти.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { makeIcons } from './tools/icons.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src'), out = join(root, 'docs');
const read = (p) => readFileSync(join(src, p), 'utf8');
const hash = (...parts) => { const h = createHash('sha256'); parts.forEach((p) => h.update(p)); return h.digest('hex'); };

let html = read('index.html');
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, p) => '<style>\n' + read(p) + '\n</style>');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, p) => {
  const js = read(p);
  if (/<\/script/i.test(js)) throw new Error(p + ' містить "</script" — зберіть інакше');
  return '<script>\n' + js + '\n</script>';
});
const logo = html.match(/<span id="app-logo"[^>]*>(<svg[\s\S]*?<\/svg>)/);
if (!logo) throw new Error('src/index.html: не знайдено логотип <span id="app-logo"><svg>…</svg>');

// Реєстр мов читаємо так само, як браузер: виконуємо core/langs.js
const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(read('core/langs.js'), ctx, { filename: 'core/langs.js' });
const langs = ctx.PG.LANGS.filter((l) => !l.draft);
const bundles = {}, packFiles = {};
for (const l of langs) {
  const code = l.files.map((f) => '/* ---- ' + l.code + '/' + f + ' ---- */\n' + read('langs/' + l.code + '/' + f).replace(/\s*$/, '\n')).join('');
  const name = 'langs/' + l.code + '.' + hash(code).slice(0, 10) + '.js';
  bundles[l.code] = name;
  packFiles[name] = code;
}

const assets = { 'manifest.webmanifest': read('manifest.webmanifest'), ...makeIcons(logo[1]) };
JSON.parse(assets['manifest.webmanifest']);
const swTemplate = read('sw.js');

// Відбиток усього, що віддає сайт: змінився хоч байт → новий sw.js → браузер оновить кеш на телефоні
const h = createHash('sha256').update(html).update(swTemplate);
for (const [name, body] of Object.entries({ ...assets, ...packFiles })) h.update(name).update(body);
const version = h.digest('hex').slice(0, 10);

const boot = '<script>window.PG = window.PG || {}; PG.BUILD = ' + JSON.stringify(version) + '; PG.BUNDLES = ' + JSON.stringify(bundles) + ';</script>\n</head>';
const files = {
  'index.html': html.replace('</head>', boot),
  // Пакети всіх мов кешуються одразу: перемкнути мову можна й без інтернету
  'sw.js': swTemplate.replace("'__VERSION__'", JSON.stringify(version)).replace('__ASSETS__', JSON.stringify(['./', ...Object.keys(assets), ...Object.keys(packFiles)])),
  // Без цього файлу GitHub Pages пропускає сайт через Jekyll, а той може змінити чи сховати файли
  '.nojekyll': '',
  ...assets,
  ...packFiles
};
// Старі пакети з іншим відбитком інакше лишалися б у docs/ і в репозиторії назавжди
rmSync(join(out, 'langs'), { recursive: true, force: true });
for (const [name, body] of Object.entries(files)) {
  mkdirSync(dirname(join(out, name)), { recursive: true });
  writeFileSync(join(out, name), body);
}
const kb = (s) => Math.round(Buffer.byteLength(s) / 1024) + ' KB';
console.log('OK: docs/ — index.html ' + kb(files['index.html']) + ', ' + Object.entries(packFiles).map(([n, b]) => n + ' ' + kb(b)).join(', ') + '; ' + Object.keys(files).length + ' файлів, версія ' + version);
