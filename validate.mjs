// Перевірка реєстру мов, мовних пакетів і даних уроків: структура вправ, дублікати, дужки [[ ]], відповіді, генератори,
// мій словник. Мовні еталони (числа словами, правопис) — у src/langs/<код>/tests.mjs.
// node validate.mjs                          — усі мови
// node validate.mjs en                       — лише англійська
// node validate.mjs en data/lessons-a2a.js   — з уроків англійської лише цей файл (поки інші файли ще пишуться)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const root = dirname(fileURLToPath(import.meta.url)), src = join(root, 'src');
const [onlyLang, onlyArg] = process.argv.slice(2);
const only = onlyArg ? onlyArg.replace(/\\/g, '/').replace(/^(\.\/)?(src\/langs\/[a-z]+\/)?/, '') : null;

// Сховище — словник у пам'яті: core.js читає й пише прогрес, а браузера тут немає
const store = new Map();
const ctx = {
  addEventListener() {}, navigator: {}, document: {}, console, setTimeout, clearTimeout,
  localStorage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) }
};
ctx.window = ctx;
vm.createContext(ctx);
const run = (rel) => {
  const code = readFileSync(join(src, rel), 'utf8');
  if (/<\/script/i.test(code)) throw new Error(rel + ': містить «</script» — збирання впаде');
  vm.runInContext(code, ctx, { filename: rel });
};
for (const f of ['core/langs.js', 'core/core.js', 'core/dict.js']) run(f);
const PG = ctx.PG;

const errs = [], warns = [], notes = [];
const err = (m) => errs.push(m), warn = (m) => warns.push(m);
// Текст мовою навчання не може містити цих літер (pack.foreign): для латинських мов — кирилицю, для кириличних — латиницю
// й літери, яких немає в мові (болгарська: і, ї, є, ґ, ы, э). Так ловиться український текст у [[ ]] і відповідях
const CYR = /[а-яіїєґё]/i;
// RegExp з контексту vm — інший клас, ніж RegExp цього файлу, тож instanceof тут не працює
const isRe = (x) => Object.prototype.toString.call(x) === '[object RegExp]';
const UI_KEYS = ['hello', 'praise', 'missionDone', 'weekend', 'weekendRow', 'near', 'strict', 'refSearch', 'voiceHello', 'voiceTest', 'voiceHelp',
  'dictPromo', 'dictIntro', 'dictWordPh', 'dictUkPh', 'dictNotePh', 'dictExPh', 'dictImportPh'];
const NAME_KEYS = ['nom', 'ins', 'gen', 'acc', 'adj', 'adjGen'];
const DEFAULT_LIMITS = [12, 25, 10, 18];

const codes = new Set();
for (const l of PG.LANGS) {
  const w = 'реєстр ' + l.code;
  if (!/^[a-z]{2,3}$/.test(l.code || '')) err(w + ': код має бути 2–3 малі латинські літери');
  if (codes.has(l.code)) err(w + ': дубль коду');
  codes.add(l.code);
  for (const k of ['name', 'native', 'levels', 'about']) if (!l[k]) err(w + ': немає поля ' + k);
  if (!l.flags || !Object.keys(l.flags).length) err(w + ': немає прапора (flags)');
  for (const [k, svg] of Object.entries(l.flags || {})) if (!/^<svg[^>]*viewBox="[^"]+"[\s\S]*<\/svg>$/.test(svg)) err(w + ': прапор ' + k + ' — не SVG з viewBox');
  if (!l.theme || !/^#[0-9a-f]{6}$/i.test(l.theme.light || '') || !/^#[0-9a-f]{6}$/i.test(l.theme.dark || '')) err(w + ': theme має бути { light: \'#rrggbb\', dark: \'#rrggbb\' }');
  if (!Array.isArray(l.files) || l.files[0] !== 'pack.js') err(w + ': files має починатися з pack.js');
  for (const f of l.files || []) if (!existsSync(join(src, 'langs', l.code, f))) err(w + ': немає файлу src/langs/' + l.code + '/' + f);
}
if (onlyLang && !codes.has(onlyLang)) { console.log('Мови «' + onlyLang + '» немає в src/core/langs.js'); process.exit(1); }
if (errs.length) { console.log('ПОМИЛКИ:\n' + errs.join('\n')); process.exit(1); }

const summary = [];
for (const info of PG.LANGS) {
  if (onlyLang && info.code !== onlyLang) continue;
  const code = info.code;
  if (only && !info.files.includes(only)) { console.log('Файл ' + only + ' не підключено в src/core/langs.js (мова ' + code + ')'); process.exit(1); }
  for (const f of info.files) {
    if (only && /^data\/lessons-/.test(f) && f !== only) continue;
    try { run('langs/' + code + '/' + f); } catch (e) { err(code + '/' + f + ': ' + e.message); }
  }
  if (errs.length) break;
  store.clear();
  PG.useLang(code);
  const L = PG.L, pre = '[' + code + '] ';
  const E = (m) => err(pre + m), W = (m) => warn(pre + m);

  for (const k of NAME_KEYS) if (!L.names || !L.names[k]) E('pack.js: немає names.' + k);
  if (!L.htmlLang) E('pack.js: немає htmlLang');
  if (!L.tts || !isRe(L.tts.voices) || !L.tts.lang || !L.tts.online) E('pack.js: tts має бути { voices: /^xx/i, lang, online }');
  if (typeof L.check !== 'function') E('pack.js: немає check(input, answers, exact)');
  for (const k of UI_KEYS) if (L.ui && L.ui[k] == null) E('pack.js: немає ui.' + k);
  if (!L.gen || typeof L.gen.make !== 'function') W('немає gen.js (генератора вправ) — вправи t: \'g\' і тренажер чисел недоступні');
  for (const d of L.drills || []) if (d[2] && !(L.gen && L.gen.list[d[2].g])) E('drills: режим ' + d[0] + ' — невідомий генератор ' + d[2].g);
  if (L.drills && L.drills.length && (!L.ui.drillTitle || !L.ui.drillCard)) E('pack.js: для drills потрібні ui.drillTitle і ui.drillCard');
  if (!L.program || !Array.isArray(L.program.stages)) { E('немає program.js (етапи)'); continue; }
  for (const k of ['intro', 'estimate', 'daily', 'weekA0']) if (!L.program[k]) E('program.js: немає ' + k);
  if (!Array.isArray(L.program.week) || !Array.isArray(L.program.principles)) E('program.js: немає week або principles');
  if (L.keyboard && (!Array.isArray(L.keyboard) || L.keyboard.some((c) => typeof c !== 'string' || c.length !== 1))) E('pack.js: keyboard — масив окремих літер');
  const variants = (L.variants || []).map((v) => v.id);
  for (const v of L.variants || []) for (const k of ['id', 'tag', 'name', 'acc', 'label', 'online', 'sample']) if (!v[k]) E('варіант ' + (v.id || '?') + ': немає ' + k);
  for (const v of L.variants || []) if (!isRe(v.voice)) E('варіант ' + v.id + ': voice має бути RegExp мови голосу');
  if (variants.length && !variants.every((v) => Object.keys(info.flags).includes(v))) W('не для кожного варіанта є прапор у реєстрі — покажеться перший');
  const VS = variants.length ? variants : [null];
  const tagV = (v) => (v ? ' [' + v.toUpperCase() + ']' : '');
  const brackets = (s, where) => {
    const open = (String(s).match(/\[\[/g) || []).length, close = (String(s).match(/\]\]/g) || []).length;
    if (open !== close) E(where + ': [[ ]] не збалансовано (' + open + '/' + close + ')');
    for (const m of String(s).matchAll(/\[\[([^\]]*)\]\]/g)) if (FOREIGN.test(m[1].split('|').pop())) E(where + ': у [[' + m[1] + ']] текст не мовою навчання — голос мови його не прочитає');
    if (!variants.length && /\{\{/.test(String(s))) E(where + ': розмітка {{…|…}} у мові без варіантів');
  };
  const FOREIGN = isRe(L.foreign) ? L.foreign : CYR;
  const LIMITS = L.limits || {};
  const ids = new Set(), words = new Map(), dups = [], review = [];
  let exCount = 0, vocabCount = 0;
  for (const l of L.lessons) {
    const w = 'урок ' + l.id;
    if (ids.has(l.id)) E(w + ': дубль id');
    if (!L.program.stages.some((s) => s.id === l.stage)) E(w + ': невідомий stage ' + l.stage);
    if (!String(l.id).startsWith(l.stage + '-')) E(w + ': id має починатися з «' + l.stage + '-»');
    ids.add(l.id);
    for (const k of ['id', 'stage', 'num', 'title', 'dur', 'goals', 'theory', 'vocab', 'ex', 'say', 'speak', 'mission']) if (l[k] == null) E(w + ': немає поля ' + k);
    if (!Array.isArray(l.vocab) || !Array.isArray(l.ex) || !Array.isArray(l.say) || !Array.isArray(l.speak)) continue;
    for (const x of VS) {
      try {
        brackets(PG.v(l.theory, x), w + ' теорія' + tagV(x));
        brackets(PG.v(l.mission, x), w + ' місія' + tagV(x));
        l.say.forEach((p) => PG.v(p[0], x)); l.speak.forEach((p) => PG.v(p, x)); PG.v(l.title, x); PG.v(l.goals.join(' '), x);
      } catch (e) { E(w + ': ' + e.message); }
    }
    const [vMin, vMax, eMin, eMax, lMin = 2] = LIMITS[l.stage] || DEFAULT_LIMITS;
    if (l.vocab.length < vMin || l.vocab.length > vMax) W(w + ': слів ' + l.vocab.length + ' (рекомендовано ' + vMin + '–' + vMax + ')');
    if (l.ex.length < eMin || l.ex.length > eMax) W(w + ': вправ ' + l.ex.length + ' (рекомендовано ' + eMin + '–' + eMax + ')');
    // Генеровані вправи «на слух» (numListen тощо) — теж диктанти
    if (l.ex.filter((e) => e.t === 'l' || (e.t === 'g' && /Listen$/.test(e.g))).length < lMin) W(w + ': диктантів менше ' + lMin);
    const seen = new Set();
    for (const v of l.vocab) {
      vocabCount++;
      if (!Array.isArray(v) || v.length < 2 || !v[0] || !v[1]) { E(w + ': погане слово ' + JSON.stringify(v)); continue; }
      if (FOREIGN.test(v[0])) E(w + ': слово не мовою навчання (чужі літери) ' + v[0]);
      if (seen.has(v[0])) E(w + ': дубль слова ' + v[0]);
      if (v[3] != null && (!variants.length || typeof v[3] !== 'object' || !variants.every((x) => v[3][x]) || FOREIGN.test(Object.values(v[3]).join(' ')))) E(w + ': слово ' + v[0] + ' — четвертий елемент має бути { ' + variants.join(', ') + ' } мовою навчання');
      try { for (const x of VS) PG.vWord(v, x); } catch (e) { E(w + ': слово ' + v[0] + ': ' + e.message); }
      seen.add(v[0]);
      const key = v[0].toLowerCase();
      if (words.has(key)) dups.push(v[0] + ' (' + words.get(key) + ' → ' + l.id + ')');
      else words.set(key, l.id);
    }
    // Вправу перевіряємо в кожному варіанті мови: правопис і розмітка {{…|…}} змінюють текст варіантів і відповідей
    const LABEL = /брит|британ|амер|американ|\bUK\b|\bUS\b/i;
    l.ex.forEach((e0, i) => {
      exCount++;
      const we0 = w + ' вправа ' + (i + 1);
      if (!['c', 'i', 'o', 'l', 'g'].includes(e0.t)) { E(we0 + ': невідомий тип ' + e0.t); return; }
      if (e0.t === 'g') { if (!L.gen || !L.gen.list[e0.g]) E(we0 + ': невідомий генератор ' + e0.g); return; }
      const byV = {};
      for (const v of VS) {
        let e;
        try { e = PG.vSpec(e0, v); } catch (er) { E(we0 + ': ' + er.message); return; }
        byV[v] = e;
        const we = we0 + tagV(v);
        if (e.t === 'c') {
          if (!e.q) E(we0 + ': немає питання');
          if (!Array.isArray(e.o) || e.o.length < 2) E(we0 + ': мало варіантів');
          else {
            if (new Set(e.o).size !== e.o.length) E(we + ': однакові варіанти' + (variants.length ? ' (якщо вправа саме про різницю варіантів — додайте nv: true)' : ''));
            // Варіант, що після нормалізації (регістр, скорочення, правопис) збігається з правильним, учень вважатиме теж правильним.
            // Якщо різниця навмисна (Yes, she is / Yes, she's), вправа позначається exact: true
            if (!e.exact) e.o.slice(1).forEach((x) => { if (PG.norm(x) && PG.check(x, e.o[0]) === 'ok') E(we + ': варіант «' + x + '» рівнозначний правильному «' + e.o[0] + '» (якщо різниця навмисна — додайте exact: true)'); });
          }
        } else {
          const a = Array.isArray(e.a) ? e.a : [e.a];
          if (!a.length || a.some((x) => !x || typeof x !== 'string')) { E(we0 + ': немає відповіді'); return; }
          if (a.some((x) => FOREIGN.test(x))) E(we0 + ': відповідь має бути мовою навчання: ' + a.join(' | '));
          if ((e.t === 'i' || e.t === 'o') && !e.q) E(we0 + ': немає питання');
          if (e.t === 'l' && !e.tr && v === VS[0]) W(we0 + ': у диктанті немає перекладу tr');
          if (e.t === 'o' && a[0].split(' ').length < 2) E(we0 + ': замало слів для порядку');
          if (e.t === 'o') {
            const sortTok = (s) => s.split(' ').map((t) => t.toLowerCase().replace(/[.,!?]/g, '')).sort().join('|');
            a.slice(1).forEach((alt) => { if (sortTok(alt) !== sortTok(a[0])) E(we + ': альтернатива має інші слова: ' + alt); });
          }
          if (e.t === 'i' && /_{2,}/.test(e.q) && a.some((x) => /_{2,}/.test(x))) E(we0 + ': пропуск ___ у відповіді');
          a.forEach((x) => { if (PG.check(x, e.a, e.exact) !== 'ok') E(we + ': відповідь «' + x + '» не проходить власну перевірку'); });
        }
        if (e.e) brackets(e.e, we + ' пояснення');
      }
      // Вправа «про конкретний варіант», у якій правопис усе ж змінився б під іншим вибором, найімовірніше
      // потребує nv: true — інакше питання й відповідь розійдуться
      if (variants.length > 1 && !e0.nv && LABEL.test(e0.q || '') && JSON.stringify([byV[VS[0]].o, byV[VS[0]].a]) !== JSON.stringify([byV[VS[1]].o, byV[VS[1]].a])) review.push(we0 + ': ' + String(e0.q).replace(/<[^>]+>/g, '').slice(0, 70));
    });
    l.say.forEach((p, i) => {
      if (!Array.isArray(p) || p.length !== 2) E(w + ': say[' + i + '] має бути [фраза, переклад]');
      else if (FOREIGN.test(p[0])) E(w + ': say[' + i + '] — фраза має бути мовою навчання');
    });
  }
  for (const r of PG.ref) for (const x of VS) { try { brackets(PG.v(r.html, x, { nv: r.nv }), 'довідник ' + r.id + tagV(x)); } catch (e) { E('довідник ' + r.id + ': ' + e.message); } }
  for (const s of L.program.stages) (s.modules || []).forEach((m) => {
    for (const k of ['id', 'title', 'weeks', 'grammar', 'vocab', 'speak', 'listen', 'read', 'write', 'mission']) if (!m[k]) E('модуль ' + m.id + ': немає ' + k);
    if (m.lesson && !only) {
      const l = L.lessons.find((x) => x.id === m.lesson);
      if (!l) E('модуль ' + m.id + ': lesson «' + m.lesson + '» не знайдено (файл підключено в src/core/langs.js?)');
      else if (l.stage !== s.id) E('модуль ' + m.id + ': урок ' + l.id + ' має stage ' + l.stage + ', а модуль — у ' + s.id);
    }
  });
  if (L.infoCards) { try { L.infoCards().forEach((c, i) => { if (!c.title) E('infoCards[' + i + ']: немає title'); }); } catch (e) { E('infoCards: ' + e.message); } }

  // Кожна згенерована вправа приймає власну відповідь і має що озвучити
  if (L.gen) for (const name of Object.keys(L.gen.list)) {
    for (let k = 0; k < 300; k++) {
      let it;
      try { it = L.gen.make({ g: name }); } catch (e) { E('генератор ' + name + ': ' + e.message); break; }
      if (!['l', 'i'].includes(it.t) || !it.a) { E('генератор ' + name + ': погана вправа'); break; }
      const answers = Array.isArray(it.a) ? it.a : [it.a];
      if (it.check && answers.some((x) => it.check(x) !== 'ok')) { E('генератор ' + name + ': не приймає власну відповідь ' + answers.join(' | ')); break; }
      if (!it.check && answers.some((x) => PG.check(x, it.a) !== 'ok')) { E('генератор ' + name + ': відповідь не проходить перевірку мови ' + answers.join(' | ')); break; }
      if (it.t === 'l' && (!it.say || /\d/.test(it.say) || FOREIGN.test(it.say))) { E('генератор ' + name + ': дивний текст для озвучення «' + it.say + '»'); break; }
    }
  }

  dictTests(E);
  const testFile = join(src, 'langs', code, 'tests.mjs');
  if (existsSync(testFile)) {
    const mod = await import(pathToFileURL(testFile).href);
    try { await mod.default({ PG, L, err: E, warn: W }); } catch (e) { E('tests.mjs: ' + (e && e.stack || e)); }
    store.clear();
    PG.useLang(code);
  } else W('немає src/langs/' + code + '/tests.mjs — мовних еталонів (числа словами, перевірка відповідей) не перевірено');

  summary.push(info.name + (only ? ' (' + only + ')' : '') + ': уроків ' + L.lessons.length + ', вправ ' + exCount + ', слів ' + vocabCount + ', розділів довідника ' + PG.ref.length);
  if (review.length) notes.push(pre + 'перевірте вручну — вправи про конкретний варіант, текст яких змінюється з вибором варіанта (' + review.length + '):\n  ' + review.join('\n  '));
  // Повтор слова в іншому уроці — не помилка: у повторенні це одна картка (core.js → firstLesson), але новому уроку краще дати нові слова
  if (dups.length) notes.push(pre + 'слова, що повторюються в кількох уроках (' + dups.length + '; у повторенні — одна картка): ' + dups.join(', '));
}

// Мій словник: розбір імпорту, злиття, скасування й експорт — на поточній мові, без браузера
function dictTests(E0) {
  const D = PG.Dict, E = (msg) => E0('словник: ' + msg), S = PG.S;
  S.dict = []; S.cards = {};
  const t = D.parse('1. apple — яблуко\nreschedule - перенести (зустріч), відкласти\nqueue; черга\nflat = квартира\n\nнічого тут\n# коментар\nlook up\tшукати');
  if (t.kind !== 'text' || t.rows.length !== 5 || t.bad.length !== 1) E('текст: ' + t.rows.length + ' слів, ' + t.bad.length + ' помилок (очікувалось 5 і 1)');
  if (!t.rows[1] || t.rows[1].word !== 'reschedule' || t.rows[1].uk !== 'перенести (зустріч), відкласти') E('текст: погано розібрано рядок з « - » і комою в перекладі');
  const c = D.parse('word,ukrainian,note\n"look forward to","чекати з нетерпінням, радіти",phrasal\napple,"яблуко ""червоне"""\n', 'my.csv');
  if (c.kind !== 'csv' || c.rows.length !== 2 || c.rows[0].note !== 'phrasal' || c.rows[1].uk !== 'яблуко "червоне"') E('CSV з лапками й заголовком: ' + JSON.stringify(c.rows));
  const sc = D.parse('слово;переклад\nbook;книжка\n', 'x.csv');
  if (sc.rows.length !== 1 || sc.rows[0].word !== 'book') E('CSV з «;» і українським заголовком');
  S.dict = [{ word: 'apple', uk: 'яблуко' }, { word: 'Queue', uk: 'черга в магазині' }];
  const p = D.plan(t);
  if (p.fresh.length !== 3 || p.same.length !== 1 || p.conflict.length !== 1) E('план: нових ' + p.fresh.length + ', однакових ' + p.same.length + ', конфліктів ' + p.conflict.length);
  const r = D.apply(p, { conflict: 'merge' });
  if (r.added !== 3 || PG.S.dict.length !== 5 || D.get('queue').uk !== 'черга в магазині; черга') E('злиття: ' + JSON.stringify(PG.S.dict));
  D.undo(r.snapshot);
  if (PG.S.dict.length !== 2 || D.get('queue').uk !== 'черга в магазині') E('скасування імпорту не відновило словник');
  D.add({ word: 'colleague', uk: 'колега', ipa: '/ˈkɒliːɡ/' });
  PG.S.cards['my|colleague'] = { due: 20000, int: 4, ease: 2.6, reps: 2, lapses: 0 };
  const json = D.toJson(true), back = D.parse(json);
  if (JSON.parse(json).lang !== PG.code) E('у файлі експорту немає коду мови');
  if (back.kind !== 'json' || back.lang !== PG.code || back.rows.length !== 3 || !back.rows[2].card || back.rows[2].card.reps !== 2 || back.rows[2].ipa !== '/ˈkɒliːɡ/') E('JSON туди й назад: ' + JSON.stringify(back.rows));
  PG.S.dict = []; PG.S.cards = {};
  D.apply(D.plan(back), { progress: true });
  if (PG.S.dict.length !== 3 || !PG.S.cards['my|colleague'] || PG.S.cards['my|colleague'].reps !== 2) E('імпорт JSON з прогресом');
  const csv = D.parse(D.toCsv(), 'x.csv'), tsv = D.parse(D.toTsv());
  if (csv.rows.length !== 3 || tsv.rows.length !== 3 || tsv.kind !== 'tsv') E('CSV/TSV туди й назад: ' + csv.rows.length + ' / ' + tsv.rows.length);
  const evil = D.parse(JSON.stringify({ words: [{ word: 'x<img src=x onerror=alert(1)>', uk: 'y', au: { us: 'https://evil.example/a.mp3' }, card: { due: 'NaN' } }] }));
  if (evil.rows.length !== 1 || evil.rows[0].au || evil.rows[0].card) E('шкідливий запис імпорту не знешкоджено: ' + JSON.stringify(evil.rows));
  const arr = D.parse('[["cat","кіт"],{"term":"dog","translation":"пес"}]');
  if (arr.rows.length !== 2 || arr.rows[1].word !== 'dog') E('JSON-масив з іншими назвами полів');
  if (D.update('colleague', { word: 'co-worker' }).ok !== true || !PG.S.cards['my|co-worker'] || PG.S.cards['my|colleague']) E('перейменування не перенесло прогрес');
  const ans = D.answers('book (a table) / reserve');
  if (!['book', 'book (a table)', 'reserve'].every((x) => ans.includes(x))) E('варіанти відповідей словника: ' + ans.join(' | '));
  const specs = D.practiceSpecs(10);
  if (specs.length !== 3 || specs.some((s) => !['c', 'i', 'l'].includes(s.t))) E('тренування словника: ' + JSON.stringify(specs.map((s) => s.t)));
  PG.S.dict = []; PG.S.cards = {};
}

// Порядок мов у реєстрі = порядок на екрані вибору; для людей зручніше за абеткою
const names = PG.LANGS.map((l) => l.name);
if (names.join('|') !== names.slice().sort((a, b) => a.localeCompare(b, 'uk')).join('|')) warn('мови в src/core/langs.js не за абеткою: ' + names.join(', '));

console.log(summary.join('\n'));
if (warns.length) console.log('Зауваження (' + warns.length + '):\n  ' + warns.join('\n  '));
if (notes.length) console.log(notes.join('\n'));
if (errs.length) { console.log('ПОМИЛКИ:\n' + Array.from(new Set(errs)).join('\n')); process.exit(1); }
console.log('Дані в порядку ✓');
