/* Polyglot — спільний рушій: стан додатка й мов, мовні пакети, озвучення, запис, перевірка відповідей, інтервальне повторення */
window.PG = window.PG || {};
(function (PG) {
  'use strict';

  // Мова-чернетка (draft: true у реєстрі) видна лише під час розробки в src/: build.mjs її не збирає
  if (PG.BUILD && PG.LANGS) PG.LANGS = PG.LANGS.filter((l) => !l.draft);
  PG.packs = PG.packs || {};
  // Файли пакета (pack.js, gen.js, data/*.js) викликають PG.pack('xx') у довільному порядку, тож об'єкт створює перший
  PG.pack = (code) => PG.packs[code] || (PG.packs[code] = { code, lessons: [] });
  PG.langInfo = (code) => (PG.LANGS || []).find((l) => l.code === code) || null;

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const UNSAFE = new Set(['__proto__', 'constructor', 'prototype']);
  function merge(base, extra) {
    for (const k of Object.keys(extra || {})) {
      if (UNSAFE.has(k)) continue;
      if (extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], extra[k]);
      else base[k] = extra[k];
    }
    return base;
  }
  PG.clone = clone;
  PG.merge = merge;
  const readRaw = (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } };
  const parseObj = (raw) => { const d = JSON.parse(raw); if (!d || typeof d !== 'object' || Array.isArray(d)) throw new Error('не об\'єкт'); return d; };

  // Ключі НЕ змінювати: інакше збережений вибір і прогрес не відкриються. Вони відрізняються від ключів старих
  // тренажерів (sk-trainer-v1, en-trainer-v1), бо сайти GitHub Pages одного акаунта мають спільне сховище.
  const APP_KEY = 'pg-app-v1';
  const APP_VERSION = 1;
  const APP_DEFAULTS = { v: APP_VERSION, lang: null, ui: { installTip: true } };
  function loadApp() {
    const raw = readRaw(APP_KEY);
    if (!raw) return clone(APP_DEFAULTS);
    try {
      const a = merge(clone(APP_DEFAULTS), parseObj(raw));
      if (!PG.langInfo(a.lang)) a.lang = null;
      a.ui.installTip = a.ui.installTip !== false;
      return a;
    } catch (e) { console.warn('Не вдалося прочитати вибір мови', e); return clone(APP_DEFAULTS); }
  }
  PG.saveApp = function () {
    try { localStorage.setItem(APP_KEY, JSON.stringify(PG.A)); } catch (e) { console.warn('Вибір мови не збережено', e); }
  };

  // Прогрес кожної мови — під власним ключем, а не в одному спільному записі: скидання, міграція чи пошкодження
  // прогресу однієї мови не зачіпають інших, а вкладки з різними мовами не затирають одна одну
  const LANG_PREFIX = 'pg-lang-v1:';
  const LANG_VERSION = 1;   // версія схеми стану мови: змінили формат → +1 і крок у MIGRATIONS
  // MIGRATIONS[n](s, pack) переводить стан версії n у версію n + 1 (змінює s на місці)
  const MIGRATIONS = {};
  PG.langKey = (code) => LANG_PREFIX + code;
  function defaults(pack) {
    return {
      v: LANG_VERSION,
      start: null,
      settings: Object.assign({ voice: '', rate: 0.9, strict: false, newPerDay: 10, dir: 'mix' }, clone((pack.settings && pack.settings.defaults) || {})),
      lessons: {},   // id -> {opened, theory, ex:{best,done}, speak, mission, skipped, run}
      modules: {},   // id модуля програми -> true (ручні позначки для етапів без уроків)
      cards: {},     // id картки -> {due,int,ease,reps,lapses}
      dict: [],      // мій словник [{word, uk, note, ex, ipa, au:{<варіант>:url}, added}]
      days: {},      // номер дня -> {ex, cards, speak}
      newDay: { day: 0, count: 0 },
      ui: Object.assign({ dictSort: 'new' }, clone(pack.uiDefaults || {}))
    };
  }
  function migrate(s, pack) {
    s.v = Math.floor(+s.v) || 1;
    while (s.v < LANG_VERSION && MIGRATIONS[s.v]) { MIGRATIONS[s.v](s, pack); s.v++; }
    return s;
  }
  // Записи словника приходять і з файлів імпорту, тож їх приводимо до рядків розумної довжини
  const str = (v, max) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
  // Записи носіїв — лише з відомих адрес: інакше файл імпорту міг би підсунути довільну адресу для <audio>
  const AUDIO_OK = /^https:\/\/(api\.dictionaryapi\.dev\/media\/|ssl\.gstatic\.com\/dictionary\/|upload\.wikimedia\.org\/)[^\s"'<>]+\.(mp3|ogg|wav)$/i;
  PG.cleanWord = function (w) {
    if (!w || typeof w !== 'object') return null;
    const out = { word: str(w.word, 200), uk: str(w.uk, 300) };
    if (!out.word || !out.uk) return null;
    const note = str(w.note, 300), ex = str(w.ex, 500), ipa = str(w.ipa, 100), added = str(w.added, 10);
    if (note) out.note = note;
    if (ex) out.ex = ex;
    if (ipa) out.ipa = ipa;
    if (/^\d{4}-\d{2}-\d{2}$/.test(added)) out.added = added;
    if (w.au && typeof w.au === 'object') {
      const au = {};
      for (const k of Object.keys(w.au)) if (/^[a-z]{2}$/.test(k) && typeof w.au[k] === 'string' && AUDIO_OK.test(w.au[k])) au[k] = w.au[k];
      if (Object.keys(au).length) out.au = au;
    }
    return out;
  };
  PG.cleanCard = function (c) {
    if (!c || typeof c !== 'object') return null;
    const int = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(+v) || 0));
    const due = Math.round(+c.due);
    if (!isFinite(due)) return null;
    return { due, int: int(c.int, 0, 36500), ease: Math.min(5, Math.max(1.3, +c.ease || 2.5)), reps: int(c.reps, 0, 100000), lapses: int(c.lapses, 0, 100000) };
  };
  // Ключ однакового слова: регістр, апострофи й зайві пробіли не роблять його новим словом
  PG.dictKey = (w) => String(w).toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim();
  // Налаштування й словник потрапляють у розмітку, тож вони мають бути саме числами, відомими рядками й чистими записами
  function tidy(s, pack) {
    const st = s.settings;
    st.voice = String(st.voice || '');
    st.rate = Math.min(1.2, Math.max(0.5, +st.rate || 0.9));
    st.strict = !!st.strict;
    st.newPerDay = Math.min(50, Math.max(0, Math.round(+st.newPerDay) || 0));
    if (!['mix', 'tl', 'uk'].includes(st.dir)) st.dir = 'mix';
    if (pack.variants && !pack.variants.some((x) => x.id === st.variant)) st.variant = pack.variants[0].id;
    if (pack.settings && pack.settings.tidy) pack.settings.tidy(st);
    if (!['new', 'az', 'due'].includes(s.ui.dictSort)) s.ui.dictSort = 'new';
    const seen = new Set();
    s.dict = (Array.isArray(s.dict) ? s.dict : []).map(PG.cleanWord).filter((w) => w && !seen.has(PG.dictKey(w.word)) && seen.add(PG.dictKey(w.word)));
    return s;
  }
  PG.tidyLang = (obj, pack) => tidy(merge(defaults(pack), migrate(obj, pack)), pack);

  // newer — прогрес записала новіша версія тренажера: тоді нічого не записуємо, щоб старий код його не зіпсував;
  // broken — збережене не вдалося прочитати; failed — останній запис не вдався
  PG.store = { key: null, newer: false, broken: null, failed: null };
  function loadLang(code) {
    const pack = PG.pack(code), key = PG.langKey(code);
    PG.store = { key, newer: false, broken: null, failed: null };
    let raw = null;
    try { raw = localStorage.getItem(key); } catch (e) { PG.store.broken = e; console.warn('Сховище недоступне', e); return defaults(pack); }
    if (!raw) return defaults(pack);
    try {
      const data = parseObj(raw);
      PG.store.newer = (+data.v || 1) > LANG_VERSION;
      return PG.tidyLang(data, pack);
    } catch (e) {
      // Наступне збереження затерло б пошкоджений запис, тому копія лишається поруч для ручного відновлення
      PG.store.broken = e;
      console.warn('Не вдалося прочитати прогрес; копію збережено під ключем ' + key + '-broken', e);
      try { localStorage.setItem(key + '-broken', raw); } catch (e2) { console.warn(e2); }
      return defaults(pack);
    }
  }

  PG.A = loadApp();
  PG.reloadApp = () => { PG.A = loadApp(); };
  PG.S = null;
  PG.L = null;
  PG.code = null;
  let warnedAt = 0;
  PG.save = function () {
    if (!PG.S || PG.store.newer) return;
    try {
      localStorage.setItem(PG.store.key, JSON.stringify(PG.S));
      PG.store.failed = null;
    } catch (e) {
      PG.store.failed = e;
      console.warn('Прогрес не збережено', e);
      if (Date.now() - warnedAt > 60000 && document.body) {
        warnedAt = Date.now();
        PG.toast('⚠️ Прогрес не зберігся (' + (e && e.name || e) + '). Подробиці — у ⚙️ «Налаштування».', 6000);
      }
    }
  };
  // Зберігається завжди весь стан мови, тож без перечитування наступне збереження тут затерло б те, що записала
  // інша вкладка чи встановлений додаток. Мову цієї вкладки чужий вибір не змінює: його відкриє лише наступний запуск.
  window.addEventListener('storage', (e) => {
    if (e.key === APP_KEY || e.key === null) { const lang = PG.A.lang; PG.A = loadApp(); if (PG.code) PG.A.lang = lang; }
    if (PG.code && (e.key === PG.store.key || e.key === null)) {
      PG.S = loadLang(PG.code);
      if (PG.onExternalChange) PG.onExternalChange();
    }
  });

  // persisted: true — браузер не видалить дані сайту сам, навіть коли забракне місця; false — може; null — невідомо.
  // Chrome вирішує без запитання: зазвичай дозволяє встановленим додаткам, закладкам і сайтам, якими часто користуються.
  PG.Storage = {
    persisted: null, listeners: [],
    async check(ask) {
      const st = navigator.storage;
      if (!st || !st.persisted) return this.persisted;
      try {
        let p = await st.persisted();
        if (!p && ask && st.persist) p = await st.persist();
        this.persisted = !!p;
      } catch (e) { this.persisted = null; }
      this.listeners.forEach((f) => f());
      return this.persisted;
    }
  };
  PG.isInstalled = () => !!(window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  // Chrome віддає подію beforeinstallprompt один раз; зберігаємо її, щоб кнопка «Встановити» спрацювала пізніше
  PG.Install = {
    prompt: null, listeners: [],
    notify() { this.listeners.forEach((f) => f()); },
    async run() {
      const p = this.prompt; if (!p) return;
      this.prompt = null;
      p.prompt();
      try { await p.userChoice; } catch (e) { console.warn(e); }
      this.notify();
    }
  };
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); PG.Install.prompt = e; PG.Install.notify(); });
  window.addEventListener('appinstalled', () => { PG.Install.prompt = null; PG.Storage.check(true); PG.Install.notify(); });
  PG.replaceState = function (obj) { PG.S = PG.tidyLang(clone(obj), PG.L); PG.save(); };
  PG.resetState = function () { PG.S = defaults(PG.L); PG.save(); };
  // Часткові скидання зберігають налаштування і мій словник
  PG.resetLessons = function () { PG.S.lessons = {}; PG.S.modules = {}; PG.save(); };
  PG.resetWords = function () { PG.S.cards = {}; PG.S.newDay = { day: 0, count: 0 }; PG.save(); };

  // Номер дня рахується за місцевим часом: інакше заняття о пів на першу ночі потрапляло б у вчорашній день
  PG.today = function () {
    const d = new Date();
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  };
  PG.dayOfWeek = function (dayNum) { return new Date(dayNum * 86400000).getUTCDay(); }; // 0 = неділя
  PG.isoDay = (dayNum) => new Date(dayNum * 86400000).toISOString().slice(0, 10);
  PG.logActivity = function (kind, n) {
    const t = PG.today();
    const d = PG.S.days[t] || (PG.S.days[t] = { ex: 0, cards: 0, speak: 0 });
    d[kind] = (d[kind] || 0) + (n || 1);
    if (!PG.S.start) PG.S.start = t;
    PG.save();
  };
  // Вихідні не розривають серію: навчання заплановано лише на робочі дні
  PG.streakOf = function (days) {
    const t = PG.today();
    let day = t, count = 0;
    if (!days[t]) day = t - 1;
    for (let i = 0; i < 800; i++, day--) {
      const active = !!days[day];
      const wd = PG.dayOfWeek(day);
      if (active) count++;
      else if (wd === 0 || wd === 6) continue;
      else break;
    }
    return count;
  };
  PG.streak = () => PG.streakOf(PG.S.days);

  PG.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  PG.shuffle = function (a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  // [[текст]] або [[текст|що озвучити]] → клікабельний фрагмент мови навчання. Лише для даних уроків: вони вже є HTML
  PG.rich = function (html) {
    return String(html || '').replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, shown, said) =>
      '<span class="say" data-say="' + PG.esc(String(said || shown).replace(/<[^>]+>/g, '')) + '">' + shown + '</span>');
  };
  // Для тексту, який увів учень (мій словник, імпорт), екрануються і показане, і озвучуване
  PG.sayHtml = (shown, said) => '<span class="say" data-say="' + PG.esc(said == null ? shown : said) + '">' + PG.esc(shown) + '</span>';
  // Примітки в дужках («(m)», «(US)») не озвучуються, а «flat / apartment» звучить як перелік
  PG.sayText = (s) => String(s).replace(/\s\/\s/g, ', ').replace(/\s*\([^)]*\)/g, '').trim();
  PG.toast = function (msg, ms) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), ms || 2200);
  };
  // Телефон чи планшет: там екранна клавіатура закриває пів екрана, а підказки про клавіші не мають сенсу
  PG.touch = () => !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  // Для порівняння перекладів і пошуку, а не відповідей: відповіді перевіряє мовний пакет (PG.check),
  // бо правила різні (скорочення, діакритика)
  PG.norm = (s) => String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.,!?;:"„“”«»()…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
  // Пошук без діакритики: учень без словацької розкладки теж має знайти «môcť», набравши «moct»
  PG.fold = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  // Одна описка (пропущена, зайва, змінена чи переставлена буква) у слові з 6+ літер, коли останні дві літери збігаються:
  // так «beatiful» — майже, а «work» замість «works» чи «studies» замість «studied» — помилка граматики, а не описка.
  // Спільне для пакетів, щоб «майже» в усіх мовах означало те саме
  PG.oneTypo = function (a, b) {
    if (a === b || Math.min(a.length, b.length) < 5 || Math.max(a.length, b.length) < 6 || Math.abs(a.length - b.length) > 1) return false;
    if (a.slice(-2) !== b.slice(-2)) return false;
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    if (a.length === b.length) {
      if (a.slice(i + 1) === b.slice(i + 1)) return true;
      return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
    }
    const [l, s] = a.length > b.length ? [a, b] : [b, a];
    return l.slice(i + 1) === s.slice(i);
  };
  // Лише одне слово з опискою на речення: дві описки — це вже не неуважність, а незнання
  PG.nearTypo = function (x, y) {
    const a = x.split(' '), b = y.split(' ');
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) { if (++diff > 1 || !PG.oneTypo(a[k], b[k])) return false; }
    return diff === 1;
  };
  PG.cap =(s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

  // Варіанти мови (американська / британська англійська тощо) задає пакет; у мови без варіантів список порожній
  PG.variants = () => (PG.L && PG.L.variants) || [];
  PG.variant = function () {
    const vs = PG.variants();
    if (!vs.length) return null;
    const v = PG.S && PG.S.settings.variant;
    return vs.some((x) => x.id === v) ? v : vs[0].id;
  };
  PG.variantInfo = (id) => PG.variants().find((x) => x.id === id) || null;
  PG.otherVariant = (v) => { const o = PG.variants().find((x) => x.id !== (v || PG.variant())); return o ? o.id : null; };
  // {{варіант1|варіант2}} у змісті уроку: показується варіант учня. Розбір знає про [[показати|озвучити]] усередині
  function resolveTokens(s, v, both) {
    if (s.indexOf('{{') < 0) return s;
    const vs = PG.variants(), at0 = Math.max(0, vs.findIndex((x) => x.id === v));
    let out = '', i = 0;
    while (i < s.length) {
      const at = s.indexOf('{{', i);
      if (at < 0) { out += s.slice(i); break; }
      out += s.slice(i, at);
      let depth = 0, j = at + 2;
      const bars = [];
      for (; j < s.length; j++) {
        if (s.startsWith('[[', j)) { depth++; j++; } else if (s.startsWith(']]', j)) { depth--; j++; } else if (s[j] === '|' && !depth) bars.push(j);
        else if (s.startsWith('}}', j) && !depth) break;
      }
      if (j >= s.length || bars.length !== Math.max(1, vs.length - 1)) throw new Error('Погана розмітка {{…|…}}: ' + s.slice(at, at + 60));
      const parts = [], cuts = [at + 1].concat(bars, [j]);
      for (let k = 0; k < cuts.length - 1; k++) parts.push(s.slice(cuts[k] + 1, cuts[k + 1]));
      const mine = parts[at0];
      out += mine;
      if (both) parts.forEach((p, k) => { if (k !== at0 && p && p !== mine) out += ' <span class="vv">' + PG.esc(vs[k].tag) + ' ' + p + '</span>'; });
      i = j + 2;
    }
    return out;
  }
  /**
   * Текст змісту під варіант учня: розмітка {{…|…}} і правопис (pack.spell). opts.nv — без зміни правопису (вправа саме про різницю);
   * opts.both — у розмітці показати й інший варіант дрібно («apartment UK flat») — для слів і приміток
   */
  PG.v = function (text, v, opts) {
    if (text == null || !PG.variants().length) return text;
    v = v || PG.variant();
    opts = opts || {};
    let s = resolveTokens(String(text), v, opts.both);
    if (!opts.nv && PG.L.spell) s = PG.L.spell(s, v);
    return s;
  };
  // Слово уроку: [слово, переклад, примітка, {<варіант>: слово}?] → { mine, other, note } — other лише якщо відрізняється
  PG.vWord = function (w, v) {
    if (!PG.variants().length) return { mine: w[0], other: '', note: w[2] || '' };
    v = v || PG.variant();
    const o = PG.otherVariant(v);
    const pick = (x) => (w[3] && w[3][x]) || PG.v(w[0], x);
    const mine = pick(v), other = o ? pick(o) : mine;
    return { mine, other: other !== mine ? other : '', note: PG.v(w[2] || '', v, { both: true }) };
  };
  // Вправа під варіант учня. Відповіді приймаються в усіх варіантах: учень з американським вибором може знати британське слово
  PG.vSpec = function (spec, v) {
    const it = Object.assign({}, spec);
    if (spec.t === 'g' || !PG.variants().length) return it;
    v = v || PG.variant();
    const opt = { nv: spec.nv };
    for (const k of ['q', 'e', 'h', 'say']) if (it[k]) it[k] = PG.v(it[k], v, opt);
    if (it.t === 'c') it.o = it.o.map((x) => PG.v(x, v, opt));
    else if (it.a != null) {
      const list = Array.isArray(it.a) ? it.a : [it.a], mine = list.map((x) => PG.v(x, v, opt));
      let all = mine;
      if (it.t !== 'o') for (const o of PG.variants()) if (o.id !== v) all = all.concat(list.map((x) => PG.v(x, o.id, opt)));
      all = Array.from(new Set(all));
      it.a = all.length > 1 ? all : all[0];
    }
    return it;
  };

  // 'ok' | 'near' (майже: описка чи діакритика — зараховується, якщо не ввімкнено суворий режим) | 'bad'.
  // Правила в кожної мови свої (скорочення й правопис US/UK, діакритика), тому перевіряє мовний пакет
  PG.check = (input, answers, exact) => PG.L.check(input, answers, exact);

  // Два рушії озвучення: 1) голос системи мови навчання (Web Speech API, працює й офлайн); 2) онлайн-голос Google
  // (потрібен інтернет) — коли голосу цієї мови чи варіанта в системі немає або учень вибрав його сам.
  // Текст ніколи не віддаємо голосу іншої мови: браузер прочитав би словацьке слово з англійською вимовою.
  const ONLINE = '@online';   // значення settings.voice для онлайн-голосу; '' — вибір автоматично
  const ONLINE_URLS = [       // друга адреса — запасна, якщо перша не відповіла
    (q, tl) => 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + tl + '&q=' + encodeURIComponent(q),
    (q, tl) => 'https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=' + tl + '&q=' + encodeURIComponent(q)
  ];
  // Онлайн-сервіс приймає до ~200 символів за запит: ріжемо за реченнями, а задовгі речення — між словами
  PG.ttsChunks = function (text, max) {
    const out = [];
    let cur = '';
    for (const w of String(text).replace(/\s+/g, ' ').trim().split(' ')) {
      if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
      if (/[.!?…]$/.test(cur) && cur.length > max / 2) { out.push(cur); cur = ''; }
    }
    if (cur) out.push(cur);
    return out;
  };
  // Нейронні голоси (Edge «Natural», Google, Apple «Premium / Enhanced») звучать набагато природніше за старі системні
  const quality = (v) => (/natural|neural/i.test(v.name) ? 3 : /google|premium|enhanced|siri/i.test(v.name) ? 2 : v.localService ? 1 : 0);
  // Голос en-AU чи en-IE не належить жодному варіанту ('other'), але для англійської він кращий за онлайн-голос
  const accentOf = (voice) => { const x = PG.variants().find((vr) => vr.voice && vr.voice.test(voice.lang)); return x ? x.id : 'other'; };
  PG.TTS = {
    ONLINE,
    voices: [],
    ready: false, settled: false, listeners: [],
    system: 'speechSynthesis' in window,
    audio: null,
    token: 0,                 // події застарілого озвучення (після нового say) мають ігноруватися
    accentOf,
    init() {
      const notify = () => this.listeners.forEach((f) => f());
      window.addEventListener('online', notify);
      window.addEventListener('offline', notify);
      if (!this.system) { this.ready = this.settled = true; notify(); return; }
      speechSynthesis.onvoiceschanged = () => { this.load(); notify(); };
      this.load();
      notify();
      setTimeout(() => { this.settled = true; this.load(); notify(); }, 1500);
    },
    // Список голосів залежить від мови навчання, тож після зміни мови його перечитують
    load() {
      const re = PG.L && PG.L.tts && PG.L.tts.voices;
      this.voices = !this.system || !re ? [] : speechSynthesis.getVoices().filter((v) => v && v.lang && re.test(v.lang) && v.name && v.name !== 'undefined')
        .sort((a, b) => quality(b) - quality(a));
      this.ready = true;
    },
    // Голос системи для варіанта, яким говоримо зараз, або null — тоді говорить онлайн-голос
    voice(variant) {
      const v = this.voices, want = PG.S.settings.voice, cur = PG.variant();
      variant = variant || cur;
      if (variant === cur) {
        if (want === ONLINE) return null;
        // Вибраний голос іншого варіанта не має «перебивати» варіант: британське слово мусить звучати по-британськи
        const chosen = v.find((x) => x.name === want);
        if (chosen && (!variant || accentOf(chosen) === variant || accentOf(chosen) === 'other')) return chosen;
      }
      return (variant ? v.find((x) => accentOf(x) === variant) : v[0]) || null;
    },
    onlineLang(variant) { const vi = PG.variantInfo(variant || PG.variant()); return (vi && vi.online) || PG.L.tts.online; },
    label(variant) {
      const v = this.voice(variant);
      if (v) return v.name;
      const vi = PG.variantInfo(variant || PG.variant());
      return 'Google — ' + (vi ? vi.name + ' вимова' : PG.L.names.nom) + ', онлайн';
    },
    // true — озвучити нічим: голосу мови в системі немає, а інтернету для онлайн-голосу теж немає
    silent() { return this.settled && !this.voices.length && navigator.onLine === false; },
    stop() {
      this.token++;
      if (this.system) speechSynthesis.cancel();
      if (this.audio) this.audio.pause();
    },
    // variant — щоб послухати слово з іншим акцентом; без нього — з налаштувань
    say(text, rate, variant) {
      if (!text || !PG.L) return;
      this.stop();
      rate = rate || PG.S.settings.rate || 0.9;
      variant = variant || PG.variant();
      const v = this.voice(variant);
      if (v) this.sayLocal(text, rate, v); else this.sayOnline(text, rate, variant);
    },
    sayLocal(text, rate, v) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = v.lang || PG.L.tts.lang;
      u.voice = v;
      u.rate = rate;
      speechSynthesis.speak(u);
    },
    sayOnline(text, rate, variant) {
      const parts = PG.ttsChunks(text, 180), token = this.token, tl = this.onlineLang(variant);
      // Один <audio> на всю сесію: Safari дозволяє вже «розблокованому» елементу грати без нового натискання
      const a = this.audio || (this.audio = new Audio());
      let i = 0, url = 0;
      const play = () => {
        a.src = ONLINE_URLS[url](parts[i], tl);
        a.defaultPlaybackRate = a.playbackRate = rate;   // нове src скидає швидкість, тому лише після нього
        a.play().catch((e) => { if (token === this.token && e && e.name === 'NotAllowedError') PG.toast('Натисніть 🔊, щоб послухати'); });
      };
      a.onended = () => { if (token === this.token && ++i < parts.length) play(); };
      a.onerror = () => {
        if (token !== this.token) return;
        if (++url < ONLINE_URLS.length) { play(); return; }
        const v = this.voices[0];
        if (v) { this.sayLocal(parts.slice(i).join(' '), rate, v); return; }   // без інтернету рятує будь-який голос цієї мови
        PG.toast('🔇 Онлайн-голос недоступний (немає інтернету?), а ' + PG.L.names.adjGen + ' голосу в системі немає. Див. ⚙️ «Налаштування».');
      };
      play();
    },
    // Запис живої людини зі словника — звичайний аудіофайл, без синтезу
    playUrl(url, rate) {
      this.stop();
      const a = this.audio || (this.audio = new Audio()), token = this.token;
      a.onended = null;
      a.onerror = () => { if (token === this.token) PG.toast('Запис носія не завантажився (немає інтернету?)'); };
      a.src = url;
      a.defaultPlaybackRate = a.playbackRate = rate || 1;
      a.play().catch(() => {});
    }
  };

  PG.Rec = {
    mr: null, url: null,
    supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder),
    async start(onStop, onError) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks = [];
        this.mr = new MediaRecorder(stream);
        this.mr.ondataavailable = (e) => chunks.push(e.data);
        this.mr.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          if (this.url) URL.revokeObjectURL(this.url);
          this.url = URL.createObjectURL(new Blob(chunks, { type: this.mr.mimeType || 'audio/webm' }));
          onStop(this.url);
        };
        this.mr.start();
      } catch (e) { onError(e); }
    },
    stop() { if (this.mr && this.mr.state !== 'inactive') this.mr.stop(); },
    active() { return !!(this.mr && this.mr.state === 'recording'); }
  };

  PG.recorderWidget = function (container) {
    if (!PG.Rec.supported) {
      container.innerHTML = '<span class="small muted">Запис голосу недоступний у цьому браузері.</span>';
      return;
    }
    container.innerHTML = '<button class="btn rec-btn">● Записати себе</button> <audio class="rec-audio" controls style="display:none;vertical-align:middle;max-width:260px"></audio>';
    const btn = container.querySelector('.rec-btn');
    const audio = container.querySelector('.rec-audio');
    btn.onclick = () => {
      if (PG.Rec.active()) { PG.Rec.stop(); return; }
      PG.Rec.start((url) => {
        btn.textContent = '● Записати ще раз';
        audio.src = url; audio.style.display = '';
        PG.logActivity('speak');
      }, (e) => {
        btn.textContent = '● Записати себе';
        PG.toast('Немає доступу до мікрофона: ' + (e && e.name ? e.name : e));
      });
      btn.textContent = '■ Зупинити запис';
    };
  };

  // У зібраній версії (docs/) пакет — один файл langs/<код>.<відбиток>.js (PG.BUNDLES від build.mjs): відбиток у назві
  // не дає HTTP-кешу підсунути старий пакет до нового рушія. У src/ (розробка) файли пакета вантажаться по одному.
  const loading = {};
  PG.loadPack = function (code) {
    const info = PG.langInfo(code);
    if (!info) return Promise.reject(new Error('Невідома мова: ' + code));
    if (PG.packs[code] && PG.packs[code].loaded) return Promise.resolve(PG.packs[code]);
    if (loading[code]) return loading[code];
    const urls = PG.BUNDLES ? [PG.BUNDLES[code]] : info.files.map((f) => 'langs/' + code + '/' + f);
    loading[code] = new Promise((resolve, reject) => {
      let left = urls.length, failed = false;
      urls.forEach((src) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = false;   // порядок виконання = порядок файлів у реєстрі, а він же — порядок уроків
        s.onload = () => { if (!failed && --left === 0) { delete loading[code]; PG.pack(code).loaded = true; resolve(PG.pack(code)); } };
        s.onerror = () => {
          if (failed) return;
          failed = true;
          // Частково виконаний пакет мав би половину уроків, а повторна спроба додала б їх удруге
          delete PG.packs[code]; delete loading[code];
          reject(new Error('Не вдалося завантажити ' + src + ' (немає інтернету?)'));
        };
        document.head.appendChild(s);
      });
    });
    return loading[code];
  };
  // Окремо від activate, бо validate.mjs виконує файли пакета в Node сам і завантажувати нічого не треба
  PG.useLang = function (code) {
    const pack = PG.packs[code];
    if (!pack) throw new Error('Пакет «' + code + '» не завантажено');
    PG.L = pack;
    PG.code = code;
    PG.lessons = pack.lessons;
    PG.program = pack.program;
    PG.ref = pack.ref || [];
    PG.resources = pack.resources || [];
    PG.gen = pack.gen;
    firstOf = null;
    PG.S = loadLang(code);
    return pack;
  };
  PG.activate = async function (code) {
    await PG.loadPack(code);
    PG.useLang(code);
    PG.A.lang = code;
    PG.saveApp();
    PG.TTS.load();
  };
  // Екран вибору мови показує підсумок кожної мови, не завантажуючи її пакет: лише зі збереженого запису
  PG.langSummary = function (code) {
    let s = null;
    if (code === PG.code) s = PG.S;
    else { const raw = readRaw(PG.langKey(code)); if (raw) try { s = parseObj(raw); } catch (e) { s = null; } }
    if (!s) return null;
    const ls = Object.values(s.lessons && typeof s.lessons === 'object' ? s.lessons : {});
    const days = s.days && typeof s.days === 'object' ? s.days : {};
    const last = Object.keys(days).map(Number).filter(isFinite).sort((a, b) => b - a)[0];
    return {
      done: ls.filter((x) => x && x.ex && x.ex.done).length,
      skipped: ls.filter((x) => x && x.skipped && !(x.ex && x.ex.done)).length,
      words: Object.values(s.cards || {}).filter((c) => c && c.reps > 0).length,
      dict: Array.isArray(s.dict) ? s.dict.length : 0,
      streak: PG.streakOf(days),
      last: last == null ? null : last
    };
  };

  PG.lessons = [];
  PG.lessonById = (id) => PG.lessons.find((l) => l.id === id);
  PG.lessonState = function (id) { return PG.S.lessons[id] || (PG.S.lessons[id] = {}); };
  // Стан уроку: {opened, theory, ex:{best,done}, speak, mission, skipped, run}
  //   done    — вправи виконано на ≥ 80%;  skipped — учень пропустив урок («вже знаю» / «почати з іншого уроку»);
  //   run     — незавершений підхід до вправ (див. exercises.js), щоб продовжити пізніше
  PG.lessonDone = (id) => !!(PG.S.lessons[id] && PG.S.lessons[id].ex && PG.S.lessons[id].ex.done);
  PG.lessonSkipped = (id) => !!(PG.S.lessons[id] && PG.S.lessons[id].skipped) && !PG.lessonDone(id);
  PG.lessonClosed = (id) => PG.lessonDone(id) || PG.lessonSkipped(id);
  PG.currentLesson = function () { return PG.lessons.find((l) => !PG.lessonClosed(l.id)) || PG.lessons[PG.lessons.length - 1]; };
  PG.skipLesson = function (id, on) { const st = PG.lessonState(id); if (on) st.skipped = true; else delete st.skipped; PG.save(); };
  // «Пройти наново» скидає позначки й вправи, але слова уроку лишаються в повторенні
  PG.resetLesson = function (id) { const st = PG.lessonState(id); ['theory', 'ex', 'speak', 'mission', 'skipped', 'run'].forEach((k) => delete st[k]); PG.save(); };
  PG.startFrom = function (id) {
    for (const l of PG.lessons) { if (l.id === id) break; if (!PG.lessonDone(l.id)) PG.lessonState(l.id).skipped = true; }
    delete PG.lessonState(id).skipped;
    PG.save();
  };

  PG.cardId = (lessonId, word) => lessonId + '|' + word;
  // Слово, що є в кількох уроках, — одна картка з id за першим уроком, де воно з'являється. Так id не залежить від того,
  // який урок учень відкрив першим, і прогрес слова не губиться
  let firstOf = null;
  function firstMap(pack) {
    const m = new Map();
    (pack.lessons || []).forEach((l) => (l.vocab || []).forEach((w) => { const k = w[0].toLowerCase(); if (!m.has(k)) m.set(k, [l.id, w[0]]); }));
    return m;
  }
  const firstLesson = (word) => (firstOf || (firstOf = firstMap(PG.L))).get(word.toLowerCase());
  // Слова з уроків, які учень уже відкривав, + мій словник. only: 'my' — лише мій словник
  PG.allWords = function (only) {
    const out = [], seen = new Set();
    if (only !== 'my') PG.lessons.forEach((l) => {
      if (!(PG.S.lessons[l.id] && PG.S.lessons[l.id].opened)) return;
      (l.vocab || []).forEach((w) => {
        const [lid, word] = firstLesson(w[0]) || [l.id, w[0]], id = PG.cardId(lid, word);
        if (seen.has(id)) return;
        seen.add(id);
        const vw = PG.vWord(w);
        out.push({ id, word: vw.mine, alt: vw.other, uk: w[1], note: vw.note, lesson: l.id });
      });
    });
    PG.S.dict.forEach((w) => out.push({ id: PG.cardId('my', w.word), word: w.word, uk: w.uk, note: w.note || '', ipa: w.ipa || '', ex: w.ex || '', au: w.au, lesson: 'my' }));
    return out;
  };
  PG.srsQueue = function (only) {
    const t = PG.today();
    const words = PG.allWords(only);
    const due = PG.shuffle(words.filter((w) => PG.S.cards[w.id] && PG.S.cards[w.id].due <= t));
    if (PG.S.newDay.day !== t) PG.S.newDay = { day: t, count: 0 };
    const room = Math.max(0, (PG.S.settings.newPerDay || 10) - PG.S.newDay.count);
    const fresh = words.filter((w) => !PG.S.cards[w.id]).slice(0, room);
    return { due, fresh, total: due.length + fresh.length };
  };
  PG.srsCounts = function (only) {
    const t = PG.today();
    const words = PG.allWords(only);
    const due = words.filter((w) => PG.S.cards[w.id] && PG.S.cards[w.id].due <= t).length;
    const known = words.filter((w) => PG.S.cards[w.id] && PG.S.cards[w.id].reps > 0).length;
    const unseen = words.filter((w) => !PG.S.cards[w.id]).length;
    return { due, known, unseen, all: words.length };
  };
  function nextInterval(c, grade) {
    if (c.reps === 0) return grade === 4 ? 3 : 1;
    if (c.reps === 1) return grade === 2 ? 2 : grade === 4 ? 6 : 4;
    return Math.round(c.int * (grade === 2 ? 1.2 : grade === 4 ? c.ease * 1.3 : c.ease));
  }
  // grade: 1 знову, 2 важко, 3 добре, 4 легко
  PG.srsGrade = function (word, grade) {
    const t = PG.today();
    let c = PG.S.cards[word.id];
    if (!c) {
      c = PG.S.cards[word.id] = { due: t, int: 0, ease: 2.5, reps: 0, lapses: 0 };
      if (PG.S.newDay.day !== t) PG.S.newDay = { day: t, count: 0 };
      PG.S.newDay.count++;
    }
    if (grade === 1) {
      c.lapses++; c.reps = 0; c.int = 0; c.ease = Math.max(1.3, c.ease - 0.2); c.due = t;
    } else {
      const next = nextInterval(c, grade);
      if (grade === 2) c.ease = Math.max(1.3, c.ease - 0.15);
      if (grade === 4) c.ease += 0.15;
      c.int = Math.max(1, next); c.reps++; c.due = t + c.int;
    }
    PG.logActivity('cards');
    PG.save();
  };
  PG.nextIntervalLabel = function (word, grade) {
    if (grade === 1) return 'сьогодні';
    const next = Math.max(1, nextInterval(PG.S.cards[word.id] || { int: 0, ease: 2.5, reps: 0 }, grade));
    return next < 30 ? next + ' дн.' : Math.round(next / 30) + ' міс.';
  };
})(window.PG);
