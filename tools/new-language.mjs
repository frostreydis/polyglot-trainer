// Заготовка нового мовного пакета: node tools/new-language.mjs <код> <Назва українською> [<Самоназва>]
// напр. node tools/new-language.mjs pl Польська Polski
// Створює src/langs/<код>/ з мінімальним пакетом, який уже проходить validate.mjs, і запис draft: true у src/core/langs.js.
// Чернетку видно лише в src/ (розробка); у зібраний сайт вона потрапить, коли прибрати draft: true.
// Усе, що треба замінити справжнім змістом, позначено «ЗАПОВНІТЬ».
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [code, name, native] = process.argv.slice(2);
if (!/^[a-z]{2,3}$/.test(code || '') || !name) {
  console.log('Використання: node tools/new-language.mjs <код ISO 639-1, напр. pl> <Назва, напр. Польська> [<Самоназва, напр. Polski>]');
  process.exit(1);
}
const dir = join(root, 'src', 'langs', code);
const registry = join(root, 'src', 'core', 'langs.js');
const reg = readFileSync(registry, 'utf8');
if (existsSync(dir) || new RegExp("code: '" + code + "'").test(reg)) { console.log('Мова «' + code + '» уже є'); process.exit(1); }
const NS = code.toUpperCase();
const nom = name.toLowerCase();
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

const files = {
  'pack.js': `/* Мовний пакет «${name}». Контракт пакета — ADDING-A-LANGUAGE.md, розділ 2; зразки — src/langs/en/pack.js і src/langs/sk/pack.js */
(function (${NS}) {
  'use strict';

  // ЗАПОВНІТЬ: назва мови в українських відмінках — нею підписано кнопки, підказки й налаштування
  ${NS}.names = { nom: ${q(nom)}, ins: ${q(nom.replace(/а$/, 'ою'))}, gen: ${q(nom.replace(/а$/, 'ої'))}, acc: ${q(nom.replace(/а$/, 'у'))}, adj: ${q(nom.replace(/а$/, 'ий'))}, adjGen: ${q(nom.replace(/а$/, 'ого'))} };
  ${NS}.htmlLang = ${q(code)};
  // Варіанти мови (як US / UK в англійській) — масив або null
  ${NS}.variants = null;
  // ЗАПОВНІТЬ: мова голосів системи (BCP 47) і код мови онлайн-голосу Google
  ${NS}.tts = { voices: /^${code}([-_]|$)/i, lang: ${q(code + '-' + code.toUpperCase())}, online: ${q(code)} };
  // Літери, яких немає на англійській розкладці (null — клавіатура не потрібна)
  ${NS}.keyboard = null;
  // Мові кирилицею потрібне ${NS}.foreign (див. src/langs/bg/pack.js): інакше validate.mjs прийме її текст за український

  const norm = (s) => String(s).toLowerCase().replace(/[.,!?;:"„“”'’«»()…–—-]/g, ' ').replace(/\\s+/g, ' ').trim();
  const fold = (s) => s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
  // ЗАПОВНІТЬ: правила мови. Зараз — як у словацькій: без діакритики «майже»
  ${NS}.check = function (input, answers) {
    const list = Array.isArray(answers) ? answers : [answers];
    const n = norm(input);
    if (!n) return 'bad';
    if (list.some((a) => norm(a) === n)) return 'ok';
    if (list.some((a) => fold(norm(a)) === fold(n))) return 'near';
    return 'bad';
  };

  // ЗАПОВНІТЬ: тексти інтерфейсу мовою навчання й про мову навчання
  ${NS}.ui = {
    hello: 'Hello! 👋',
    praise: 'Super!',
    missionDone: 'Super! 🎉',
    weekend: 'Вихідний 🙂 Навчання за бажанням: серіал, музика чи подкаст ' + ${NS}.names.ins + '.',
    weekendRow: 'Вільно. За бажанням — серіал, музика чи подкаст.',
    near: '🟡 Майже — перевірте написання.',
    strict: 'Суворо перевіряти написання (відповідь «майже» не зараховується)',
    speakTip: '',
    speakHint: 'Забули слово — опишіть його іншими словами.',
    refSearch: 'Пошук у таблицях…',
    voiceHello: 'Hello!',
    voiceTest: 'Hello! How are you?',
    voiceNote: '',
    voiceHelp: '<li><b>Windows</b>: Параметри → Час і мова → Мовлення → Додати голоси.</li><li><b>Android</b>: Налаштування → Спеціальні можливості → Синтез мовлення → Google.</li>',
    dictPromo: 'Почули нове слово? Додайте його в словник — воно потрапить у повторення.',
    dictIntro: 'Слова, почуті в житті.',
    dictWordPh: 'слово',
    dictUkPh: 'переклад',
    dictNotePh: 'Примітка',
    dictExPh: 'Приклад',
    dictImportPh: 'слово — переклад'
  };
  // Режими тренажера чисел — коли з'явиться gen.js (див. src/langs/en/pack.js → drills)
  ${NS}.drills = null;
  ${NS}.dict = {
    headers: [${q(code)}, ${q(nom)}, ${q(nom.replace(/а$/, 'ою'))}],
    csvHeader: ${q(code)},
    links: () => []
  };
})(PG.pack(${q(code)}));
`,
  'data/lessons-a0.js': `/* Етап 0. Формат уроку — README.md, розділ 5; зразки — src/langs/en/data/lessons-a1a.js (a1-1) */
(function (${NS}) {
${NS}.lessons = ${NS}.lessons || [];
${NS}.lessons.push(
{
  id: 'a0-1', stage: 'a0', num: '0.1', dur: '2 дні',
  title: 'ЗАПОВНІТЬ: назва уроку',
  goals: ['ЗАПОВНІТЬ: після уроку я вмію…'],
  theory: '<h3>ЗАПОВНІТЬ</h3><p>Теорія з озвученими прикладами: [[Hello]].</p>',
  vocab: [['hello', 'привіт']],
  ex: [
    { t: 'c', q: 'ЗАПОВНІТЬ: як сказати «привіт»?', o: ['hello', 'goodbye', 'thanks'] },
    { t: 'i', q: 'ЗАПОВНІТЬ: напишіть «привіт»', a: 'hello' },
    { t: 'o', q: 'ЗАПОВНІТЬ: Привіт, Анно!', a: 'Hello, Anna!' },
    { t: 'l', a: 'Hello', tr: 'Привіт' },
    { t: 'l', a: 'Hello, Anna', tr: 'Привіт, Анно' }
  ],
  say: [['Hello!', 'Привіт!']],
  speak: ['ЗАПОВНІТЬ: завдання для говоріння'],
  mission: 'ЗАПОВНІТЬ: завдання в реальному житті'
}
);
})(PG.pack(${q(code)}));
`,
  'data/reference.js': `/* Довідник: [{ id, title, html, nv? }] — зразок у src/langs/sk/data/reference.js */
(function (${NS}) {
${NS}.ref = [];
})(PG.pack(${q(code)}));
`,
  'data/program.js': `/* Програма до B2 — зразок у src/langs/sk/data/program.js (етапи з уроками й етапи-плани з модулями) */
(function (${NS}) {
${NS}.program = {
  intro: 'ЗАПОВНІТЬ: для кого програма й що вона дає.',
  estimate: 'ЗАПОВНІТЬ: скільки часу до B2 при 15–30 хв у робочі дні.',
  daily: 'ЗАПОВНІТЬ: щоденний мінімум.',
  weekA0: 'На етапі 0 — по уроку за 2 дні.',
  principles: [['ЗАПОВНІТЬ', 'принцип навчання']],
  week: [
    { d: 1, name: 'Пн', full: 'Урок: теорія і слова', min: 'теорія' },
    { d: 2, name: 'Вт', full: 'Вправи', min: 'половина вправ' },
    { d: 3, name: 'Ср', full: 'Розмова і shadowing', min: 'shadowing' },
    { d: 4, name: 'Чт', full: 'Повторення слів', min: 'повторення' },
    { d: 5, name: 'Пт', full: 'Місія', min: 'місія' }
  ],
  stages: [
    { id: 'a0', level: 'Етап 0', title: 'Звуки й читання', weeks: '1–2', built: true, cando: ['ЗАПОВНІТЬ'] }
  ]
};
})(PG.pack(${q(code)}));
`,
  'data/resources.js': `/* Ресурси: [{ cat, items: [[назва, адреса, опис, рівень]] }] */
(function (${NS}) {
${NS}.resources = [];
})(PG.pack(${q(code)}));
`,
  'tests.mjs': `// Мовні еталони «${name}» для validate.mjs — зразки в src/langs/en/tests.mjs і src/langs/sk/tests.mjs
export default function ({ PG, err }) {
  [['Hello!', 'hello', 'ok'], ['bye', 'hello', 'bad']]
    .forEach(([a, b, want]) => { const got = PG.check(a, b); if (got !== want) err('check(«' + a + '», «' + b + '») = ' + got + ', очікувалось ' + want); });
}
`
};
for (const [f, body] of Object.entries(files)) {
  mkdirSync(dirname(join(dir, f)), { recursive: true });
  writeFileSync(join(dir, f), body);
}

// Нейтральний сірий прапор до справжнього: малюнок прапора — у реєстрі, бо екран вибору мови показує його без пакета
const flag = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" aria-hidden="true"><rect width="3" height="2" fill="#9aa4b2"/><rect y="1" width="3" height="1" fill="#c9d1dc"/></svg>';
const entry = `  {
    code: ${q(code)},
    name: ${q(name)}, native: ${q(native || name)},
    levels: 'з нуля до B2',
    about: 'ЗАПОВНІТЬ: для кого й що є (уроки, тренажери, довідник).',
    // ЗАПОВНІТЬ: справжній прапор (SVG з viewBox; лише rect / path / circle / g / clipPath)
    flags: { ${code}: '${flag}' },
    theme: { light: '#1d4ed8', dark: '#8ab4f8' },
    // Мова-чернетка: видно лише в src/; приберіть, коли уроки готові
    draft: true,
    files: ['pack.js', 'data/lessons-a0.js', 'data/reference.js', 'data/program.js', 'data/resources.js']
  }`;
// Мови в реєстрі — за абеткою української назви: так їх показує екран вибору мови
const starts = [...reg.matchAll(/\n  \{\n    code: '[a-z]+',\n    name: '([^']+)'/g)];
const before = starts.find((m) => m[1].localeCompare(name, 'uk') > 0);
const next = before ? reg.slice(0, before.index) + '\n' + entry + ',' + reg.slice(before.index)
  : reg.replace(/\n\];\s*$/, ',\n' + entry + '\n];\n');
writeFileSync(registry, next);

console.log('Створено src/langs/' + code + '/ і чернетку «' + name + '» у src/core/langs.js.\nДалі: ADDING-A-LANGUAGE.md, розділ 3. Перевірка: node validate.mjs ' + code + '; розробка: python -m http.server 8000 -d src');
