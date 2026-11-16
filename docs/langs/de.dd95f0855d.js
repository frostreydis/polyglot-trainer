/* ---- de/pack.js ---- */
/* Мовний пакет «Німецька»: перевірка відповідей (умлаути й ß, велика літера іменників), клавіатура ä ö ü ß, голос,
 * тексти інтерфейсу, тренажер чисел, цін, часу («halb drei») і дат, довідка про іспити й документи */
(function (DE) {
  'use strict';

  DE.names = { nom: 'німецька', ins: 'німецькою', gen: 'німецької', acc: 'німецьку', adj: 'німецький', adjGen: 'німецького' };
  DE.htmlLang = 'de';
  // Австрійська й швейцарська норми в A0–A1 відрізняються словами, а не правилами, — про них розповідають уроки,
  // окремого вибору варіанта (як US / UK) не потрібно
  DE.variants = null;
  DE.tts = { voices: /^de([-_]|$)/i, lang: 'de-DE', online: 'de' };
  // [слів від, до, вправ від, до, диктантів від]. A1.13 — урок-повторення без нових слів
  DE.limits = { a0: [10, 25, 10, 16, 2], a1: [0, 30, 10, 20, 1] };
  // Без німецької розкладки умлаути й ß інакше не набрати
  DE.keyboard = ['ä', 'ö', 'ü', 'ß'];

  const base = (s) => String(s).replace(/[’‘`´]/g, "'").replace(/[.,!?;:"„“”«»‚()…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
  const low = (s) => base(s).toLowerCase();
  // Перше слово речення пишуть з великої завжди, тож регістр першої літери не порівнюємо
  const caseKey = (s) => { const b = base(s); return b.charAt(0).toLowerCase() + b.slice(1); };
  // Без німецької розкладки пишуть ae / oe / ue і ss (так дозволяє й сама орфографія) або просто a / o / u — слово впізнається.
  // Обидва боки згортаються однаково, тож справжні ue (Feuer) не ламаються
  const fold = (s) => s.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
  // Мала літера в іменнику (das haus) чи в ввічливому Sie — «майже»: значення зрозуміле, але на письмі це помилка
  DE.check = function (input, answers) {
    const list = Array.isArray(answers) ? answers : [answers];
    const n = low(input);
    if (!n) return 'bad';
    const same = list.filter((a) => low(a) === n);
    if (same.length) return same.some((a) => caseKey(a) === caseKey(input)) ? 'ok' : 'near';
    if (list.some((a) => fold(low(a)) === fold(n) || PG.nearTypo(low(a), n))) return 'near';
    return 'bad';
  };

  DE.ui = {
    hello: 'Hallo! 👋',
    praise: 'Super!',
    missionDone: 'Super! 🎉',
    weekend: 'Вихідний 🙂 Навчання за бажанням: німецький серіал, подкаст чи «Tagesschau in 100 Sekunden».',
    weekendRow: 'Вільно. За бажанням — серіал, подкаст, новини.',
    near: '🟡 Майже — перевірте умлаути (ä ö ü), ß і велику літеру (іменники, Sie).',
    strict: 'Суворо перевіряти написання (ae замість ä, ss замість ß, іменник з малої літери, описка — не зараховується)',
    speakTip: '',
    speakHint: 'Забули слово — опишіть його: «Das ist ein Ding für…», «Das ist eine Person, die…»',
    refSearch: 'Пошук у таблицях: напр. «haben», «Akkusativ», «der»…',
    voiceHello: 'Guten Tag, wie geht es Ihnen?',
    voiceTest: 'Guten Tag! Ich heiße Anna. Wir lernen Deutsch.',
    voiceNote: 'Ненімецьким голосом тренажер нічого не читає.',
    voiceHelp: '<li><b>Microsoft Edge</b> на Windows: зазвичай уже має голоси «Microsoft Katja / Conrad Online (Natural) — German» (потрібен інтернет).</li>' +
      '<li><b>Windows</b>: Параметри → Час і мова → Мовлення → Додати голоси → Deutsch (Deutschland).</li>' +
      '<li><b>Android</b>: Налаштування → Спеціальні можливості → Синтез мовлення → Google → встановіть німецьку.</li>' +
      '<li><b>Mac / iPhone / iPad</b>: Параметри → Універсальний доступ → Усний вміст → Голоси → Німецька → <b>Anna</b> → завантажити. Потім перезапустіть браузер.</li>',
    dictPromo: 'Почули нове слово на роботі, в Jobcenter чи в магазині? Додайте його в словник — воно потрапить у повторення, а словник можна експортувати й перенести на інший пристрій.',
    dictIntro: 'Слова, почуті в житті: на роботі, в установах, у магазині. Іменник записуйте з артиклем: der / die / das.',
    dictWordPh: 'напр. der Kassenbon',
    dictUkPh: 'напр. чек',
    dictNotePh: 'Примітка: множина (die Kassenbons), розмовне…',
    dictExPh: 'Приклад: Brauchen Sie den Kassenbon?',
    dictImportPh: 'der Kassenbon — чек\ndie Aufenthaltserlaubnis - дозвіл на проживання\nder Einkaufswagen; візок у магазині\n(можна вставити клітинки з Excel чи Google Таблиць: німецьке слово і переклад у сусідніх колонках)',
    drillTitle: '🔢 Тренажер чисел, цін, часу й дат',
    drillIntro: 'Вправи щоразу нові, по 10 за підхід. На слух — записуєте цифрами, «словами» — пишете німецькою (числа пишуть разом, пробіли не важливі). Почніть із «Числа 0–20», далі «20–100»: einundzwanzig — одиниці перед десятками!',
    drillBack: ['#/lesson/a1-7', '← Урок A1.7'],
    drillCard: ['Тренажер чисел, цін, часу й дат', 'нескінченні диктанти на слух і письмо словами — einundzwanzig, halb drei, am dritten Mai']
  };

  DE.drills = [
    ['n20', '🎧 Числа 0–20 на слух', { g: 'numListen', min: 0, max: 20 }],
    ['n100', '🎧 Числа 20–100 на слух', { g: 'numListen', min: 20, max: 100 }],
    ['n999', '🎧 Числа 100–9999 на слух', { g: 'numListen', min: 100, max: 9999 }],
    ['year', '🎧 Роки на слух (neunzehnhundert…)', { g: 'yearListen' }],
    ['price', '🎧 Ціни на слух', { g: 'priceListen', min: 1, max: 99 }],
    ['time', '🎧 Час офіційно («vierzehn Uhr dreißig»)', { g: 'timeListen' }],
    ['clock', '🎧 Час розмовно («halb drei»)', { g: 'clockListen' }],
    ['date', '🎧 Дати на слух', { g: 'dateListen' }],
    ['nw', '✍️ Число → словами', { g: 'numWords', min: 0, max: 999 }],
    ['cw', '✍️ Час → розмовно словами', { g: 'clockWords' }],
    ['dw', '✍️ Дата → словами', { g: 'dateWords' }],
    ['mix', '🎲 Мікс усього', null]
  ];

  // DE.docs і DE.exam задає data/resources.js (там і дата перевірки); значення таблиці документів містять розмітку
  DE.infoCards = () => [
    DE.docs && Object.assign({ title: '🪪 Мова, проживання й громадянство', html: true }, DE.docs),
    DE.exam && { title: '🎓 Іспити: Goethe, telc, ÖSD', text: DE.exam.text, links: DE.exam.links }
  ].filter(Boolean);

  DE.dict = {
    headers: ['german', 'deutsch', 'de', 'німецька', 'німецькою', 'нім'],
    csvHeader: 'german',
    // Словники шукають слово без артикля й без множини в дужках: «der Kassenbon (-s)» → Kassenbon
    links: (w) => {
      const q = encodeURIComponent(PG.sayText(w).split(',')[0].trim().replace(/^(der|die|das)\s+/i, ''));
      return [
        ['📖 Duden', 'https://www.duden.de/suchen/dudenonline/' + q, 'Правопис, рід, множина, значення'],
        ['📚 DWDS', 'https://www.dwds.de/wb/' + q, 'Значення, приклади, вимова'],
        ['🔊 Forvo', 'https://forvo.com/word/' + q + '/#de', 'Вимова носіями мови']
      ];
    }
  };
})(PG.pack('de'));
/* ---- de/gen.js ---- */
/* Генератор вправ на числа, ціни, роки, час і дати (без DOM — його також використовує validate.mjs).
 * У даних уроку: { t: 'g', g: '<назва>', min?, max? } — під час запуску перетворюється на звичайну вправу 'l' або 'i'. */
(function (DE) {
  'use strict';
  const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn',
    'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
  const TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
  const MONTH = ['', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const MONTH_DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // 1–99; у складених «eins» втрачає -s: einundzwanzig, einhundert
  function under100(n) {
    if (n < 20) return ONES[n];
    const o = n % 10;
    return o ? (o === 1 ? 'ein' : ONES[o]) + 'und' + TENS[Math.floor(n / 10)] : TENS[Math.floor(n / 10)];
  }
  /** Число 0–9999 словами, одним словом, одиниці перед десятками: zweitausendsechsundzwanzig */
  function words(n) {
    if (n === 0) return 'null';
    const th = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), r = n % 100;
    return (th ? (th === 1 ? 'ein' : under100(th)) + 'tausend' : '') + (h ? (h === 1 ? 'ein' : ONES[h]) + 'hundert' : '') + (r ? under100(r) : '');
  }
  // «einhundert» і «hundert», «eintausend» і «tausend» — обидва правильні
  const allWords = (n) => { const w = words(n); return Array.from(new Set([w, w.replace(/^ein(hundert|tausend)/, '$1')])); };
  // Роки 1100–1999 читають сотнями: neunzehnhundertneunundneunzig; з 2000 — як число
  const year = (y) => (y >= 1100 && y < 2000 ? under100(Math.floor(y / 100)) + 'hundert' + (y % 100 ? under100(y % 100) : '') : words(y));
  // Година перед «Uhr» — «ein», а не «eins»: um ein Uhr
  const hourUhr = (h) => (h === 1 ? 'ein' : words(h));
  // Розмовний час — 12-годинний: «halb drei» = 2:30 або 14:30; година без «Uhr» — «eins»
  const H12 = (h) => ONES[((h - 1) % 12) + 1];
  /** Розмовний час (дванадцятигодинний): 2:30 → «halb drei», 3:15 → «Viertel nach drei», 3:45 → «Viertel vor vier» */
  function clock(h, m) {
    const n = H12(h), next = H12(h + 1);
    return {
      0: (n === 'eins' ? 'ein' : n) + ' Uhr', 5: 'fünf nach ' + n, 10: 'zehn nach ' + n, 15: 'Viertel nach ' + n, 20: 'zwanzig nach ' + n, 25: 'fünf vor halb ' + next,
      30: 'halb ' + next, 35: 'fünf nach halb ' + next, 40: 'zwanzig vor ' + next, 45: 'Viertel vor ' + next, 50: 'zehn vor ' + next, 55: 'fünf vor ' + next
    }[m];
  }
  // Порядковий числівник: основа + -en у давальному («am dritten Mai») і -e в називному («der dritte Mai»)
  const ORD_STEM = ['', 'erst', 'zweit', 'dritt', 'viert', 'fünft', 'sechst', 'siebt', 'acht', 'neunt', 'zehnt', 'elft', 'zwölft'];
  const ordStem = (d) => ORD_STEM[d] || (d < 20 ? ONES[d] + 't' : under100(d) + 'st');
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const digits = (s) => String(s).replace(/[^\d]/g, '');
  // Розмовний час 12-годинний, тож 2:30 і 14:30 — обидва правильні; кома — бо на телефоні цифрова клавіатура
  // (inputmode="decimal") в українській і німецькій локалі має кому, а не двокрапку
  const timeCheck = (h, m) => (v) => {
    const p = String(v).trim().match(/^(\d{1,2})(?:\s*[:.,\s]\s*(\d{2}))?$/);
    if (!p) return 'bad';
    const hh = +p[1], mm = p[2] ? +p[2] : 0;
    return mm === m && hh % 12 === h % 12 ? 'ok' : 'bad';
  };

  const G = {
    // 🎧 число → цифрами
    numListen(sp) {
      const n = rnd(sp.min ?? 0, sp.max ?? 100);
      return { t: 'l', h: 'Прослухайте й запишіть цифрами', say: words(n), a: String(n), nodia: true, ph: 'цифрами, напр. 47',
        check: (v) => (digits(v) !== '' && Number(digits(v)) === n ? 'ok' : 'bad'), e: 'Словами: ' + words(n) };
    },
    // 🎧 рік → цифрами
    yearListen(sp) {
      const y = rnd(sp.min ?? 1900, sp.max ?? 2035);
      return { t: 'l', h: 'Прослухайте рік і запишіть цифрами', say: year(y), a: String(y), nodia: true, ph: 'напр. 1989',
        check: (v) => (digits(v) !== '' && Number(digits(v)) === y ? 'ok' : 'bad'), e: 'Словами: ' + year(y) };
    },
    // 🎧 ціна → цифрами
    priceListen(sp) {
      const e = rnd(sp.min ?? 1, sp.max ?? 49);
      const c = Math.random() < 0.25 ? 0 : rnd(10, 99);
      const say = (e === 1 ? 'ein' : words(e)) + ' Euro' + (c ? ' ' + words(c) : '');
      const shown = e + ',' + String(c).padStart(2, '0') + ' €';
      return { t: 'l', h: 'Прослухайте ціну й запишіть цифрами', say, a: shown, nodia: true, ph: 'напр. 3,49',
        check: (v) => {
          const m = String(v).replace(/€|euro?/gi, '').replace(/\s+/g, '').replace(',-', '').replace(',', '.');
          return m !== '' && !isNaN(+m) && Math.round(+m * 100) === e * 100 + c ? 'ok' : 'bad';
        }, e: 'Словами: ' + say + ' — центи після «Euro» називають без слова «Cent»' };
    },
    // 🎧 офіційний час (вокзал, радіо, запис до лікаря) → цифрами
    timeListen() {
      const h = rnd(0, 23), m = Math.random() < 0.4 ? 0 : rnd(1, 59);
      const say = 'um ' + hourUhr(h) + ' Uhr' + (m ? ' ' + words(m) : '');
      return { t: 'l', h: 'Прослухайте час і запишіть цифрами', say, a: h + ':' + String(m).padStart(2, '0'), nodia: true, ph: 'напр. 14:30',
        check: (v) => {
          const p = String(v).trim().match(/^(\d{1,2})(?:\s*[:.,\s]\s*(\d{2}))?$/);
          return p && +p[1] === h && (p[2] ? +p[2] : 0) === m ? 'ok' : 'bad';
        }, e: 'Словами: ' + say + ' — офіційний час 24-годинний' };
    },
    // 🎧 розмовний час → цифрами
    clockListen() {
      const h = rnd(1, 12), m = rnd(0, 11) * 5;
      const say = 'Es ist ' + clock(h, m);
      return { t: 'l', h: 'Прослухайте, котра година, і запишіть цифрами', say, a: h + ':' + String(m).padStart(2, '0'), nodia: true, ph: 'напр. 2:30',
        check: timeCheck(h, m), e: 'Словами: ' + say + (m >= 25 ? ' — «halb drei» = половина третьої, тобто 2:30' : '') };
    },
    // 🎧 дата → цифрами
    dateListen() {
      const mo = rnd(1, 12), d = rnd(1, MONTH_DAYS[mo]);
      const say = 'am ' + ordStem(d) + 'en ' + MONTH[mo];
      return { t: 'l', h: 'Прослухайте дату й запишіть цифрами (день. місяць.)', say, a: d + '. ' + mo + '.', nodia: true, ph: 'напр. 24. 8.',
        check: (v) => { const p = String(v).match(/(\d{1,2})\D+(\d{1,2})/); return p && +p[1] === d && +p[2] === mo ? 'ok' : 'bad'; },
        e: 'Словами: ' + say };
    },
    // ✍️ число → словами
    numWords(sp) {
      const n = rnd(sp.min ?? 0, sp.max ?? 100), a = allWords(n);
      return { t: 'i', q: 'Напишіть словами число <b>' + n + '</b>', a, nospace: true, say: words(n),
        e: 'Числа до мільйона пишуть одним словом, одиниці — перед десятками: [[' + words(n) + ']]' };
    },
    // ✍️ час → розмовно словами
    clockWords() {
      const h = rnd(1, 12), m = [0, 10, 15, 20, 30, 40, 45, 50][rnd(0, 7)];
      const c = clock(h, m), a = [c, 'es ist ' + c];
      if (m === 0) a.push('punkt ' + H12(h), 'es ist punkt ' + H12(h));
      return { t: 'i', q: 'Котра година? Напишіть розмовно, словами: <b>' + h + ':' + String(m).padStart(2, '0') + '</b>', a, e: '[[Es ist ' + c + '.]]' +
        (m === 30 ? ' «halb» — половина <b>наступної</b> години.' : m === 45 ? ' «Viertel vor» — за чверть наступна година.' : '') };
    },
    // ✍️ дата → словами
    dateWords() {
      const mo = rnd(1, 12), d = rnd(1, MONTH_DAYS[mo]);
      const ans = 'am ' + ordStem(d) + 'en ' + MONTH[mo];
      return { t: 'i', q: 'Коли? Напишіть словами: <b>am ' + d + '. ' + MONTH[mo] + '</b>', a: [ans, ans.slice(3)],
        e: '[[' + ans + ']] — після «am» порядковий числівник із закінченням -en' };
    }
  };

  DE.gen = {
    words, allWords, year, clock, ordStem, MONTH, list: G,
    make(spec) {
      const f = G[spec.g];
      if (!f) throw new Error('Невідомий генератор вправ: ' + spec.g);
      return f(spec);
    }
  };
})(PG.pack('de'));
/* ---- de/data/lessons-a0.js ---- */
/* Етап 0: уроки 0.1–0.4 */
(function (DE) {
DE.lessons = DE.lessons || [];
DE.lessons.push(
{
  id: 'a0-1', stage: 'a0', num: '0.1', title: 'Алфавіт і вимова: ei, ie, sch, ch, z', dur: '2 дні',
  goals: ['читати німецькі слова латиницею', 'не плутати ei / ie та eu / au', 'правильно читати sch, st, ch, z, s, v, w, j'],
  theory: `
<p>Німецька пише латиницею: 26 літер і ще <b>ä, ö, ü, ß</b> (про них — урок 0.2). Здебільшого слово читається так, як написане, але кілька сполучень звучать зовсім не так, як очікує українець, а надто той, хто знає англійську.</p>
<div class="tblwrap"><table><tr><th>Пишемо</th><th>Звучить</th><th>Приклад</th></tr>
<tr><td><b>ei</b> (ey, ai)</td><td>«ай»</td><td>[[Wein]] — вино, [[drei]] — три, [[Ei]] — яйце</td></tr>
<tr><td><b>ie</b></td><td>довге «і:»</td><td>[[Bier]] — пиво, [[Liebe]] — любов, [[vier]] — чотири</td></tr>
<tr><td><b>eu</b>, <b>äu</b></td><td>«ой»</td><td>[[neu]] — новий, [[heute]] — сьогодні, [[Euro]], [[Häuser]] — будинки</td></tr>
<tr><td><b>au</b></td><td>«ау»</td><td>[[Haus]] — будинок, [[Frau]] — жінка</td></tr>
<tr><td><b>sch</b></td><td>«ш»</td><td>[[Schule]] — школа, [[Tisch]] — стіл</td></tr>
<tr><td><b>st</b>, <b>sp</b> на початку слова чи кореня</td><td>«шт», «шп»</td><td>[[Stadt]] — місто, [[Straße]] — вулиця, [[Sport]], [[verstehen]] — розуміти</td></tr>
<tr><td><b>ch</b> після a, o, u, au</td><td>«х» (глибоке, як у «хата»)</td><td>[[Buch]] — книжка, [[Nacht]] — ніч, [[acht]] — вісім</td></tr>
<tr><td><b>ch</b> після e, i, ä, ö, ü, ei, eu, l, n, r</td><td>м'яке «хь», ніби тихе «хі»</td><td>[[ich]] — я, [[nicht]] — не, [[Milch]] — молоко</td></tr>
<tr><td><b>chs</b></td><td>«кс»</td><td>[[sechs]] — шість</td></tr>
<tr><td><b>z</b>, <b>tz</b></td><td>«ц»</td><td>[[Zeit]] — час, [[zehn]] — десять, [[Platz]] — місце, площа</td></tr>
<tr><td><b>s</b> перед голосним</td><td>«з»</td><td>[[Sonne]] — сонце, [[sehr]] — дуже</td></tr>
<tr><td><b>s</b> у кінці й перед приголосним</td><td>«с»</td><td>[[Haus]], [[Bus]], [[ist]]</td></tr>
<tr><td><b>v</b></td><td>зазвичай «ф»; у запозиченнях «в»</td><td>[[Vater]] — батько, [[viel]] — багато; але [[Video]], [[November]]</td></tr>
<tr><td><b>w</b></td><td>«в»</td><td>[[Wasser]] — вода, [[wie]] — як, [[wo]] — де</td></tr>
<tr><td><b>j</b></td><td>«й»</td><td>[[ja]] — так, [[Jahr]] — рік, [[Juli]] — липень</td></tr>
<tr><td><b>h</b> після голосного</td><td>не читається, лише подовжує голосний</td><td>[[Bahn]] — залізниця, [[Uhr]] — годинник, [[sehen]] — бачити</td></tr>
<tr><td><b>h</b> на початку</td><td>легкий видих, тихіше за наше «г»</td><td>[[Hallo]], [[heute]]</td></tr>
<tr><td><b>qu</b></td><td>«кв»</td><td>[[Quark]] — кисломолочний сир</td></tr>
</table></div>
<div class="note"><b>Головна пастка: ei ≠ ie.</b> Читайте за <b>другою</b> літерою: ei — «ай», ie — «і:». [[Wein]] — вино, а [[Wien]] — Відень; [[Bein]] — нога, а [[Biene]] — бджола.</div>
<div class="note"><b>Якщо знаєте англійську:</b> w — це «в», v зазвичай «ф», z — «ц», j — «й». Англійське «джей» і «вʼю» тут не працюють: [[Wasser]], [[Vater]], [[Zoo]], [[Januar]].</div>
<h3>R і закінчення -er</h3>
<p>Німецьке <b>r</b> зазвичай вимовляють горлом (схоже на французьке). Після голосного в кінці складу воно майже зникає й звучить як коротке «а»: [[Bier]] ≈ «бі:а», [[Vater]] ≈ «фа:та», [[Lehrer]] ≈ «ле:ра» — вчитель. У Баварії, Австрії та Швейцарії часто чути й розкотисте r, як в українській, — так теж правильно.</p>
<h3>Оглушення в кінці слова — не як в українській</h3>
<p>Ми кажемо «дуб» дзвінко. Німці в кінці слова оглушують b, d, g: [[Tag]] → «та:к» (день), [[Kind]] → «кінт» (дитина), [[gelb]] → «гельп» (жовтий).</p>
<p class="small muted">Закінчення <b>-ig</b> у стандартній вимові звучить як «-іхь»: [[zwanzig]]. На півдні Німеччини, в Австрії та Швейцарії кажуть «-ік» — вас зрозуміють в обох випадках.</p>
<div class="good"><b>Велика літера — підказка.</b> Усі іменники пишуть з великої: [[das Haus]], [[die Stadt]], [[der Tag]]. Якщо в реченні слово з великої літери не на початку, це майже напевно іменник (або ввічливе [[Sie]]). Слова <b>der, die, das</b> перед іменником — артиклі; про них ітиметься в уроці A1.2, а поки просто вчіть іменник разом з артиклем.</div>
<p class="small muted">Натискайте на виділені слова, щоб послухати. Якщо звуку немає, відкрийте «Налаштування» і виберіть німецький голос.</p>`,
  vocab: [['der Wein', 'вино', 'die Weine'], ['Wien', 'Відень', 'не плутайте: Wein — вино'], ['das Bier', 'пиво', 'die Biere'], ['neu', 'новий'], ['heute', 'сьогодні'],
    ['das Haus', 'будинок, дім', 'die Häuser'], ['die Frau', 'жінка; пані (Frau Müller)', 'die Frauen'], ['die Schule', 'школа', 'die Schulen'], ['die Stadt', 'місто', 'die Städte'],
    ['das Buch', 'книжка', 'die Bücher'], ['die Nacht', 'ніч', 'die Nächte'], ['ich', 'я'], ['die Milch', 'молоко', 'жіночий рід!'], ['die Zeit', 'час'],
    ['die Sonne', 'сонце', 'жіночий рід: die Sonne, але der Mond'], ['der Vater', 'батько', 'die Väter'], ['das Wasser', 'вода', 'середній рід!'], ['ja', 'так'],
    ['das Jahr', 'рік', 'die Jahre'], ['der Tag', 'день', 'die Tage']],
  ex: [
    { t: 'c', q: 'Як читається <b>ei</b> у слові «Wein»?', o: ['«ай»', '«ей»', '«і»'] },
    { t: 'c', q: 'Як читається <b>ie</b> у слові «Bier»?', o: ['довге «і»', '«іє»', '«ай»'] },
    { t: 'c', q: '<b>eu</b> у слові «heute» звучить як…', o: ['«ой»', '«еу»', '«ю»'] },
    { t: 'c', q: '<b>sch</b> у слові «Schule» звучить як…', o: ['«ш»', '«сх»', '«ск»'] },
    { t: 'c', q: '<b>z</b> у слові «Zeit» звучить як…', o: ['«ц»', '«з»', '«с»'] },
    { t: 'c', q: '<b>v</b> у слові «Vater» звучить як…', o: ['«ф»', '«в»', '«у»'] },
    { t: 'c', q: '<b>w</b> у слові «Wasser» звучить як…', o: ['«в»', '«у», як англійське w', '«ф»'] },
    { t: 'c', q: '<b>st</b> на початку слова «Stadt» читається…', o: ['«шт»', '«ст»', '«сц»'] },
    { t: 'c', q: 'Що означає «Wien»?', o: ['Відень', 'вино', 'ми'], e: 'ie — «і:»: [[Wien]]. А «вино» — [[Wein]] (ei — «ай»).' },
    { t: 'c', q: 'Як звучить кінець слова «Tag»?', o: ['«к»: «та:к»', '«г»: «таг»', '«х»: «тах»'], e: 'У кінці слова b, d, g оглушуються: [[Tag]], [[Kind]], [[gelb]].' },
    { t: 'i', q: 'Напишіть німецькою: <b>сьогодні</b>', a: 'heute' },
    { t: 'i', q: 'Напишіть німецькою з артиклем, як у словнику: <b>книжка</b>', a: 'das Buch', e: 'Іменник — з великої літери: [[das Buch]].' },
    { t: 'i', q: 'Напишіть німецькою з артиклем: <b>молоко</b>', a: 'die Milch' },
    { t: 'l', a: 'Wien ist eine Stadt.', tr: 'Відень — місто.' },
    { t: 'l', a: 'Das Buch ist neu.', tr: 'Книжка нова.' }
  ],
  say: [['Wein — Wien', 'вино — Відень'], ['Heute ist ein neuer Tag.', 'Сьогодні новий день.'], ['die Schule, die Stadt, die Straße', 'школа, місто, вулиця'],
    ['ich, nicht, Milch', 'я, не, молоко'], ['acht, Nacht, Buch', 'вісім, ніч, книжка'], ['Der Vater trinkt Wasser.', 'Батько п\'є воду.']],
  speak: ['Прочитайте вголос пари й відчуйте різницю: Wein — Wien, Bein — Biene, heute — Haus, ich — acht. Запишіть себе й порівняйте з озвученням.'],
  mission: 'На вулиці, у супермаркеті чи на вокзалі прочитайте вголос 10 написів (Straße, Bahnhof, Eingang, Ausgang, Bäckerei…). Шукайте в них ei, ie, eu, sch, ch і z.'
},
{
  id: 'a0-2', stage: 'a0', num: '0.2', title: 'Умлаути ä, ö, ü, літера ß, довгі й короткі голосні, наголос', dur: '2 дні',
  goals: ['вимовляти ä, ö, ü', 'знати, коли пишуть ß, а коли ss', 'чути довгі й короткі голосні та ставити наголос'],
  theory: `
<h3>Умлаути: ä, ö, ü</h3>
<p>Дві крапки над голосним (<b>Umlaut</b>) змінюють звук. Це окремі звуки, а не прикраса: без них слово стає іншим.</p>
<div class="tblwrap"><table><tr><th>Літера</th><th>Як вимовити</th><th>Приклад</th></tr>
<tr><td><b>ä</b></td><td>як українське «е»</td><td>[[Käse]] — сир, [[Mädchen]] — дівчина, [[Äpfel]] — яблука</td></tr>
<tr><td><b>ö</b></td><td>губи округлені, як для «о», а язик — як для «е»</td><td>[[schön]] — гарний, [[Öl]] — олія, [[hören]] — слухати, [[zwölf]] — дванадцять</td></tr>
<tr><td><b>ü</b></td><td>губи витягнуті, як для «у», а язик — як для «і»</td><td>[[über]] — над, про, [[Tür]] — двері, [[müde]] — втомлений, [[fünf]] — п'ять</td></tr>
</table></div>
<p>Умлаут змінює значення: [[schon]] (вже) — [[schön]] (гарний); [[zahlen]] (платити) — [[zählen]] (рахувати); [[Bruder]] (брат) — [[Brüder]] (брати); [[Mutter]] (мати) — [[Mütter]] (матері).</p>
<div class="tip"><b>Без німецької клавіатури</b> замість ä, ö, ü пишуть <b>ae, oe, ue</b> — так роблять в адресах e-mail і на квитках: Mueller = Müller. У тренажері внизу є кнопки ä ö ü ß; написання через ae тренажер зарахує як «майже».</div>
<h3>ß і ss</h3>
<p><b>ß</b> («ес-цет») звучить як звичайне «с». Її пишуть <b>після довгого голосного чи дифтонга</b>: [[Straße]] — вулиця, [[groß]] — великий, [[heißen]] — називатися, [[Fuß]] — стопа. Після <b>короткого</b> голосного пишуть <b>ss</b>: [[Wasser]] — вода, [[essen]] — їсти, [[Fluss]] — річка.</p>
<p>Порівняйте: [[Fuß]] (довге «у:») — [[Fluss]] (коротке «у»).</p>
<div class="note"><b>Швейцарія ß не вживає:</b> там завжди пишуть ss — Strasse, gross. Великими літерами в Німеччині теж часто пишуть SS: STRASSE.</div>
<h3>Довгі й короткі голосні</h3>
<p>В українській довжина голосного значення не змінює, у німецькій — змінює. Голосний <b>довгий</b>, якщо він подвоєний ([[Tee]] — чай, [[Boot]] — човен), стоїть перед h ([[Bahn]], [[Uhr]], [[Sohn]] — син), пишеться як ie ([[Liebe]]) або стоїть у кінці відкритого складу ([[Name]] — ім'я). <b>Короткий</b> — перед подвоєною приголосною чи ck ([[Bett]] — ліжко, [[kommen]] — приходити, [[Zucker]] — цукор) або перед двома приголосними ([[Hand]] — рука, [[Kind]] — дитина).</p>
<div class="tblwrap"><table><tr><th>Довгий</th><th>Короткий</th></tr>
<tr><td>[[Miete]] — орендна плата</td><td>[[Mitte]] — середина</td></tr>
<tr><td>[[Staat]] — держава</td><td>[[Stadt]] — місто</td></tr>
<tr><td>[[Ofen]] — піч</td><td>[[offen]] — відчинений</td></tr>
</table></div>
<h3>Наголос</h3>
<p>Здебільшого наголос падає на <b>перший склад кореня</b>: [[Vater]], [[Mutter]], [[arbeiten]] — працювати. Префікси <b>be-, ge-, er-, ver-, zer-, ent-, emp-</b> ненаголошені: [[bezahlen]] — be-<b>ZAH</b>-len, [[verstehen]] — ver-<b>STE</b>-hen, [[Geschenk]] — ge-<b>SCHENK</b> (подарунок).</p>
<p>У запозиченнях наголос часто на останньому складі: [[Student]], [[Büro]], [[Restaurant]], [[Universität]], [[Information]].</p>
<div class="good">Як і в українській, наголос вільний і його треба запам'ятовувати разом зі словом. Але правило «перший склад кореня» спрацьовує в більшості слів.</div>`,
  vocab: [['der Käse', 'сир (твердий)'], ['das Mädchen', 'дівчина, дівчинка', 'середній рід! die Mädchen'], ['der Apfel', 'яблуко', 'die Äpfel'], ['schön', 'гарний; чудово'],
    ['schon', 'вже'], ['das Öl', 'олія; нафта'], ['hören', 'слухати; чути'], ['die Tür', 'двері', 'однина! die Türen — кілька дверей'], ['müde', 'втомлений'],
    ['groß', 'великий; високий (про людину)'], ['die Straße', 'вулиця', 'die Straßen; у Швейцарії — Strasse'], ['heißen', 'називатися', 'Ich heiße … — Мене звати …'],
    ['der Fuß', 'стопа, нога', 'die Füße; zu Fuß — пішки'], ['essen', 'їсти'], ['der Tee', 'чай'], ['die Uhr', 'годинник; о … годині (um 8 Uhr)', 'година як проміжок часу — die Stunde'],
    ['die Miete', 'орендна плата'], ['zahlen', 'платити'], ['zählen', 'рахувати'], ['der Zucker', 'цукор']],
  ex: [
    { t: 'c', q: 'Як вимовити <b>ö</b> у слові «schön»?', o: ['губи як для «о», язик як для «е»', 'як українське «о»', 'як «йо»'] },
    { t: 'c', q: 'Як вимовити <b>ü</b> у слові «Tür»?', o: ['губи як для «у», язик як для «і»', 'як українське «у»', 'як «уі» двома звуками'] },
    { t: 'c', q: '«Місто гарне»: Die Stadt ist ___.', o: ['schön', 'schon'], e: '[[schön]] — гарний, [[schon]] — вже.' },
    { t: 'c', q: 'Як правильно пишуть «вулиця» в Німеччині?', o: ['Straße', 'Strase', 'Strasze'] },
    { t: 'c', q: 'Коли пишуть <b>ß</b>?', o: ['після довгого голосного чи дифтонга: Fuß, heißen', 'після короткого голосного: Wasser', 'на початку слова'] },
    { t: 'c', q: 'У якому слові голосний <b>довгий</b>?', o: ['Miete', 'Mitte', 'Bett'] },
    { t: 'c', q: 'Що означає «die Miete»?', o: ['орендна плата', 'середина', 'м\'ята'] },
    { t: 'c', q: 'Де наголос у слові «Student»?', o: ['stu-DENT', 'STU-dent'] },
    { t: 'c', q: 'Де наголос у слові «bezahlen»?', o: ['be-ZAH-len', 'BE-zah-len', 'be-zah-LEN'], e: 'Префікс be- ніколи не наголошений.' },
    { t: 'c', q: 'Як написати <b>ä</b> без німецької клавіатури?', o: ['ae', 'a:', 'ea'] },
    { t: 'i', q: 'Напишіть німецькою: <b>вже</b>', a: 'schon' },
    { t: 'i', q: 'Напишіть німецькою: <b>їсти</b>', a: 'essen' },
    { t: 'i', q: 'Напишіть з артиклем: <b>сир</b>', a: 'der Käse' },
    { t: 'i', q: 'Напишіть з артиклем: <b>дівчина</b>', a: 'das Mädchen', e: 'Середній рід, бо всі слова на -chen — das: [[das Mädchen]].' },
    { t: 'l', a: 'Die Tür ist schon offen.', tr: 'Двері вже відчинені.' },
    { t: 'l', a: 'Wie heißt die Straße?', tr: 'Як називається вулиця?' }
  ],
  say: [['schon — schön', 'вже — гарний'], ['Miete — Mitte', 'орендна плата — середина'], ['Fuß — Fluss', 'стопа — річка'], ['Die Straße ist groß.', 'Вулиця велика.'],
    ['Ich bin müde.', 'Я втомився / втомилася.'], ['zwölf, fünf, Käse', 'дванадцять, п\'ять, сир']],
  speak: ['Вимовте пари, перебільшуючи різницю: schon — schön, zahlen — zählen, Miete — Mitte, Staat — Stadt, Fuß — Fluss. Запишіть себе й порівняйте з озвученням.'],
  mission: 'У супермаркеті знайдіть 5 продуктів з ä, ö, ü або ß на етикетці (Käse, Brötchen, Müsli, Süßigkeiten, Öl) і прочитайте назви вголос.'
},
{
  id: 'a0-3', stage: 'a0', num: '0.3', title: 'Hallo! Вітання, du і Sie, ввічливість', dur: '2 дні',
  goals: ['вітатися й прощатися в різних ситуаціях і регіонах', 'вибирати du чи Sie', 'дякувати, просити, вибачатися і перепитувати'],
  theory: `
<h3>Вітання і прощання</h3>
<div class="tblwrap"><table><tr><th>Ситуація</th><th>Що сказати</th></tr>
<tr><td>Удень, офіційно (установа, лікар)</td><td>[[Guten Tag!]]</td></tr>
<tr><td>Нейтрально, будь-коли (магазин, сусіди, колеги)</td><td>[[Hallo!]]</td></tr>
<tr><td>Уранці / увечері</td><td>[[Guten Morgen!]] / [[Guten Abend!]]</td></tr>
<tr><td>Перед сном</td><td>[[Gute Nacht!]] — тільки коли йдуть спати</td></tr>
<tr><td>До побачення: офіційно / невимушено</td><td>[[Auf Wiedersehen!]] / [[Tschüss!]]</td></tr>
<tr><td>По телефону</td><td>[[Auf Wiederhören!]]</td></tr>
<tr><td>До зустрічі</td><td>[[Bis morgen!]] — до завтра, [[Bis später!]] — до зустрічі, [[Bis bald!]] — до скорого</td></tr>
<tr><td>Побажання наостанок</td><td>[[Schönen Tag noch!]] — гарного дня!</td></tr>
</table></div>
<div class="tip"><b>Регіони.</b> У Баварії й Австрії офіційно вітаються [[Grüß Gott!]], а друзі кажуть [[Servus!]] («привіт» і «бувай»); прощаються [[Auf Wiederschauen!]] У Швейцарії — [[Grüezi!]], серед своїх — [[Hoi!]] або [[Sali!]] На півночі Німеччини будь-коли кажуть [[Moin!]] Відповідайте так само, як привіталися з вами.</div>
<h3>Як справи?</h3>
<p>[[Wie geht es Ihnen?]] — Як ваші справи? [[Wie geht's?]] — Як справи? (на «ти»). Відповіді: [[Gut, danke. Und Ihnen?]] / [[Danke, gut. Und dir?]] [[Es geht.]] — так собі. [[Nicht so gut.]] — не дуже.</p>
<h3>du, ihr і Sie</h3>
<div class="tblwrap"><table><tr><th>Форма</th><th>Кому</th><th>Приклад</th></tr>
<tr><td><b>du</b> — ти</td><td>друзі, родина, діти, часто колеги й молодь</td><td>[[Wie heißt du?]]</td></tr>
<tr><td><b>ihr</b> — ви</td><td>кілька людей, з якими ви на «ти»</td><td>[[Wie heißt ihr?]]</td></tr>
<tr><td><b>Sie</b> — Ви</td><td>незнайомі, установи, лікар, магазин, начальство — і одна людина, і кілька</td><td>[[Wie heißen Sie?]]</td></tr>
</table></div>
<div class="note"><b>Sie завжди пишуть з великої літери.</b> З малої [[sie]] означає «вона» або «вони». Ввічливе Sie граматично — це «вони»: дієслово стоїть у множині. Не переходьте на du першими; вам запропонують самі: [[Wir können uns duzen.]] або [[Sollen wir uns duzen?]] — «Можемо на ти».</div>
<p>Звертання: [[Herr Müller]] — пане Мюллер, [[Frau Schmidt]] — пані Шмідт. <b>Frau</b> кажуть будь-якій дорослій жінці, незалежно від віку й шлюбу; слово «Fräulein» застаріле і може образити.</p>
<h3>Ввічливість</h3>
<p>[[bitte]] — будь ласка; так само кажуть, коли щось подають («прошу»). [[Danke!]] [[Danke schön!]] [[Vielen Dank!]] — дякую, щиро дякую. Відповідь: [[Bitte!]] [[Bitte schön!]] [[Gern geschehen!]] [[Gerne!]] — нема за що.</p>
<p>[[Entschuldigung!]] — вибачте (щоб звернутися до когось або перепросити). [[Entschuldigen Sie, …]] — вибачте, … [[Tut mir leid.]] — мені шкода. [[Kein Problem.]] — без проблем.</p>
<h3>Рятувальні фрази</h3>
<p>[[Wie bitte?]] — Перепрошую? (не почули). [[Ich verstehe nicht.]] — Я не розумію. [[Noch einmal, bitte.]] — Ще раз, будь ласка. [[Langsamer, bitte.]] — Повільніше, будь ласка. [[Was bedeutet das?]] — Що це означає? [[Ich spreche nur ein bisschen Deutsch.]] — Я говорю німецькою зовсім трохи. [[Sprechen Sie Englisch?]]</p>
<div class="note">Почувши акцент, німці часто переходять на англійську. Якщо хочете практики, попросіть: [[Können wir Deutsch sprechen? Ich lerne Deutsch.]]</div>`,
  vocab: [['Hallo!', 'Привіт! Добрий день! (нейтрально)'], ['Guten Tag!', 'Добрий день!'], ['Guten Morgen!', 'Доброго ранку!'], ['Guten Abend!', 'Добрий вечір!'],
    ['Gute Nacht!', 'На добраніч!'], ['Grüß Gott!', 'Добрий день! (Австрія, Баварія)'], ['Grüezi!', 'Добрий день! (Швейцарія)'], ['Servus!', 'Привіт! Бувай! (Австрія, Баварія)'],
    ['Auf Wiedersehen!', 'До побачення!'], ['Tschüss!', 'Бувай! До побачення! (невимушено)'], ['Bis morgen!', 'До завтра!'], ['Wie geht es Ihnen?', 'Як ваші справи?'],
    ['Wie geht\'s?', 'Як справи? (на «ти»)'], ['gut', 'добре; добрий'], ['bitte', 'будь ласка; прошу'], ['danke', 'дякую'], ['Vielen Dank!', 'Щиро дякую!'],
    ['Gern geschehen!', 'Нема за що!'], ['Entschuldigung!', 'Вибачте! Перепрошую!'], ['Wie bitte?', 'Перепрошую? (не почули)'], ['Ich verstehe nicht.', 'Я не розумію.'],
    ['Herr / Frau', 'пан / пані'], ['du / Sie', 'ти / Ви (ввічливо)']],
  ex: [
    { t: 'c', q: 'Ви заходите в Bürgeramt о 10:00. Як привітатися?', o: ['Guten Tag!', 'Gute Nacht!', 'Tschüss!'] },
    { t: 'c', q: 'Ви у Відні в аптеці. Як там зазвичай вітаються?', o: ['Grüß Gott!', 'Grüezi!', 'Moin!'] },
    { t: 'c', q: '«Grüezi!» ви почуєте насамперед…', o: ['у Швейцарії', 'в Австрії', 'у Гамбурзі'] },
    { t: 'c', q: 'Пізно ввечері ви йдете спати. Що кажуть рідним?', o: ['Gute Nacht!', 'Guten Abend!', 'Guten Tag!'] },
    { t: 'c', q: 'Незнайомий чоловік на вулиці. Як запитати, як його звати?', o: ['Wie heißen Sie?', 'Wie heißt du?', 'Wie heißt ihr?'] },
    { t: 'c', q: 'Вам сказали «Danke!». Що відповісти?', o: ['Gern geschehen!', 'Wie bitte?', 'Gute Nacht!'] },
    { t: 'c', q: 'Ви не почули, що сказала касирка. Що сказати?', o: ['Wie bitte?', 'Bitte schön!', 'Gern geschehen!'] },
    { t: 'c', q: '«Sie» з великої літери означає…', o: ['Ви (ввічливо)', 'вона', 'вони'] },
    { t: 'c', q: 'Як ввічливо звернутися до жінки на прізвище Weber (будь-якого віку)?', o: ['Frau Weber', 'Fräulein Weber', 'Madame Weber'] },
    { t: 'o', q: 'Як ваші справи?', a: 'Wie geht es Ihnen?' },
    { t: 'o', q: 'Я не розумію.', a: 'Ich verstehe nicht.' },
    { t: 'o', q: 'Ще раз, будь ласка.', a: 'Noch einmal, bitte.' },
    { t: 'i', q: 'Напишіть німецькою: <b>дякую</b>', a: 'danke' },
    { t: 'i', q: 'Напишіть німецькою: <b>Вибачте!</b>', a: ['Entschuldigung!', 'Entschuldigen Sie!'] },
    { t: 'l', a: 'Guten Tag! Wie geht es Ihnen?', tr: 'Добрий день! Як ваші справи?' },
    { t: 'l', a: 'Danke, gut. Und dir?', tr: 'Дякую, добре. А в тебе?' }
  ],
  say: [['Guten Tag! Wie geht es Ihnen?', 'Добрий день! Як ваші справи?'], ['Danke, gut. Und Ihnen?', 'Дякую, добре. А у вас?'],
    ['Entschuldigung, ich verstehe nicht.', 'Вибачте, я не розумію.'], ['Noch einmal, bitte. Langsamer, bitte.', 'Ще раз, будь ласка. Повільніше, будь ласка.'],
    ['Vielen Dank! — Gern geschehen!', 'Щиро дякую! — Нема за що!'], ['Auf Wiedersehen! Schönen Tag noch!', 'До побачення! Гарного дня!']],
  speak: ['Розіграйте вголос два діалоги: із сусідом-ровесником (du: «Hallo, wie geht\'s?») і з працівником Bürgeramt (Sie: «Guten Tag, wie geht es Ihnen?»). Запишіть себе.',
    'Скажіть 5 рятувальних фраз без підглядання: Wie bitte? Ich verstehe nicht. Noch einmal, bitte. Langsamer, bitte. Was bedeutet das?'],
  mission: 'Сьогодні в магазині, пекарні (Bäckerei) чи на касі привітайтеся так, як кажуть у вашому місті (Hallo / Guten Tag / Grüß Gott / Grüezi / Moin), подякуйте («Danke!») і попрощайтеся («Tschüss! Schönen Tag noch!»). Зверніть увагу, як вітаються місцеві.'
},
{
  id: 'a0-4', stage: 'a0', num: '0.4', title: 'Числа 0–20, «Wie heißt du?», ім\'я по літерах', dur: '2 дні',
  goals: ['рахувати від 0 до 20', 'назвати своє ім\'я й запитати чуже', 'продиктувати ім\'я по літерах (buchstabieren)'],
  theory: `
<h3>Числа 0–20</h3>
<div class="tblwrap"><table><tr><td>0 [[null]]</td><td>1 [[eins]]</td><td>2 [[zwei]]</td><td>3 [[drei]]</td><td>4 [[vier]]</td></tr>
<tr><td>5 [[fünf]]</td><td>6 [[sechs]]</td><td>7 [[sieben]]</td><td>8 [[acht]]</td><td>9 [[neun]]</td></tr>
<tr><td>10 [[zehn]]</td><td>11 [[elf]]</td><td>12 [[zwölf]]</td><td>13 [[dreizehn]]</td><td>14 [[vierzehn]]</td></tr>
<tr><td>15 [[fünfzehn]]</td><td>16 [[sechzehn]]</td><td>17 [[siebzehn]]</td><td>18 [[achtzehn]]</td><td>19 [[neunzehn]]</td></tr>
<tr><td>20 [[zwanzig]]</td><td colspan="4" class="small muted">13–19: одиниці + zehn, як наше «три-над-цять»</td></tr></table></div>
<div class="note"><b>Пастки:</b> 16 — [[sechzehn]] (без s), 17 — [[siebzehn]] (без -en). Коли рахують, кажуть [[eins]], а перед іменником — [[ein]]: [[ein Euro]].</div>
<div class="tip">По телефону, щоб не сплутати zwei і drei, часто кажуть [[zwo]] замість zwei.</div>
<h3>Як вас звати?</h3>
<p>[[Wie heißt du?]] — [[Ich heiße Olena.]] / [[Wie heißen Sie?]] — [[Mein Name ist Taras Kowalenko.]] Офіційно: [[Wie ist Ihr Name?]] [[Wie ist Ihr Vorname?]] — ім'я. [[Wie ist Ihr Nachname?]] — прізвище (також [[Familienname]]). [[Freut mich!]] — Приємно познайомитися!</p>
<p>Номер телефону диктують цифрами: [[Meine Telefonnummer ist null eins sieben sechs …]]</p>
<h3>Назви літер</h3>
<div class="tblwrap"><table>
<tr><td>[[A]] «а»</td><td>[[B]] «бе»</td><td>[[C]] «це»</td><td>[[D]] «де»</td><td>[[E]] «е»</td><td>[[F]] «еф»</td></tr>
<tr><td>[[G]] «ґе»</td><td>[[H]] «ха»</td><td>[[I]] «і»</td><td>[[J]] «йот»</td><td>[[K]] «ка»</td><td>[[L]] «ель»</td></tr>
<tr><td>[[M]] «ем»</td><td>[[N]] «ен»</td><td>[[O]] «о»</td><td>[[P]] «пе»</td><td>[[Q]] «ку»</td><td>[[R]] «ер»</td></tr>
<tr><td>[[S]] «ес»</td><td>[[T]] «те»</td><td>[[U]] «у»</td><td>[[V]] «фау»</td><td>[[W]] «ве»</td><td>[[X]] «ікс»</td></tr>
<tr><td>[[Y|Ypsilon]] «юпсілон»</td><td>[[Z]] «цет»</td><td>[[Ä]] «е:»</td><td>[[Ö]] «ö»</td><td>[[Ü]] «ü»</td><td>[[ß|Eszett]] «ес-цет»</td></tr>
</table></div>
<div class="note"><b>Не плутайте з англійською:</b> E — «е», I — «і», H — «ха», J — «йот», V — «фау», W — «ве», Z — «цет». В Австрії J часто називають «є», а Q — «кве».</div>
<h3>buchstabieren — сказати по літерах</h3>
<p>[[Wie schreibt man das?]] — Як це пишеться? [[Können Sie das bitte buchstabieren?]] — Чи можете ви сказати це по літерах? Відповідь: [[K – O – W – A – L – E – N – K – O]]. Дві однакові літери: [[Doppel-L]] або [[zwei L]].</p>
<p>По телефону літеру уточнюють словом: традиційно [[A wie Anton]], [[O wie Otto]], [[W wie Wilhelm]]; за новим стандартом — містами: [[A wie Aachen]], [[B wie Berlin]], [[K wie Köln]]. Підійде будь-яке відоме слово.</p>
<div class="tip"><b>Навіщо це вам.</b> У закордонному паспорті ім'я записано латиницею за українськими правилами: Yurii, Oleksandr, Zhanna. Німці можуть прочитати це по-своєму (Y — як «ю», Zh — як «цх»). Тому вміти продиктувати ім'я й прізвище по літерах потрібно в Bürgeramt, у лікаря, на пошті й по телефону.</div>`,
  vocab: [['null', 'нуль'], ['eins', 'один'], ['zwei', 'два', 'по телефону — zwo'], ['drei', 'три'], ['vier', 'чотири'], ['fünf', 'п\'ять'], ['sechs', 'шість'],
    ['sieben', 'сім'], ['acht', 'вісім'], ['neun', 'дев\'ять'], ['zehn', 'десять'], ['elf', 'одинадцять'], ['zwölf', 'дванадцять'], ['sechzehn', 'шістнадцять', 'без s: sechzehn'],
    ['siebzehn', 'сімнадцять', 'без -en: siebzehn'], ['zwanzig', 'двадцять'], ['der Name', 'ім\'я; назва', 'die Namen'], ['der Vorname', 'ім\'я', 'die Vornamen'],
    ['der Nachname', 'прізвище', 'die Nachnamen; також der Familienname'], ['Wie heißt du?', 'Як тебе звати?'], ['Ich heiße …', 'Мене звати …'], ['Freut mich!', 'Приємно познайомитися!'],
    ['buchstabieren', 'казати по літерах'], ['die Telefonnummer', 'номер телефону', 'die Telefonnummern']],
  ex: [
    { t: 'g', g: 'numListen', min: 0, max: 20 },
    { t: 'g', g: 'numListen', min: 0, max: 20 },
    { t: 'g', g: 'numWords', min: 0, max: 20 },
    { t: 'c', q: '17 — як правильно?', o: ['siebzehn', 'siebenzehn', 'sibzehn'] },
    { t: 'c', q: '16 — як правильно?', o: ['sechzehn', 'sechszehn', 'sechzig'] },
    { t: 'c', q: 'Як німці називають літеру <b>V</b>?', o: ['«фау»', '«ве»', '«ві»'] },
    { t: 'c', q: 'Як німці називають літеру <b>W</b>?', o: ['«ве»', '«дабл-ю»', '«ву»'] },
    { t: 'c', q: 'Як німці називають літеру <b>J</b>?', o: ['«йот»', '«джей»', '«жи»'] },
    { t: 'c', q: 'Як попросити продиктувати слово по літерах?', o: ['Können Sie das bitte buchstabieren?', 'Können Sie das bitte zählen?', 'Können Sie das bitte hören?'] },
    { t: 'c', q: '«Nachname» — це…', o: ['прізвище', 'ім\'я', 'по батькові'] },
    { t: 'o', q: 'Мене звати Олена.', a: 'Ich heiße Olena.' },
    { t: 'o', q: 'Як вас звати? (ввічливо)', a: 'Wie heißen Sie?' },
    { t: 'i', q: 'Як по телефону часто кажуть замість «zwei»?', a: 'zwo' },
    { t: 'l', a: 'Mein Name ist Anna Schmidt.', tr: 'Мене звати Анна Шмідт.' },
    { t: 'l', a: 'Wie schreibt man das?', tr: 'Як це пишеться?' }
  ],
  say: [['Ich heiße … Mein Nachname ist …', 'Мене звати … Моє прізвище …'], ['Wie schreibt man das?', 'Як це пишеться?'], ['Können Sie das bitte buchstabieren?', 'Чи можете ви сказати це по літерах?'],
    ['K wie Köln, O wie Otto', 'K як Köln, O як Otto'], ['Freut mich!', 'Приємно познайомитися!'], ['eins, zwei, drei … zwanzig', 'один, два, три … двадцять']],
  speak: ['Продиктуйте по літерах своє ім\'я, прізвище й назву вулиці — так, як вони записані в документах. Потім ще раз зі словами: «K wie Köln, O wie Otto…»',
    'Порахуйте вголос від 0 до 20 і назад, а потім назвіть свій номер телефону цифра за цифрою.'],
  mission: 'Наступного разу, коли записуєтеся до лікаря, в установу чи отримуєте посилку, продиктуйте своє прізвище по літерах німецькою. А сьогодні вдома увімкніть диктофон і продиктуйте ім\'я, прізвище, адресу й номер телефону.'
}
);
})(PG.pack('de'));
/* ---- de/data/lessons-a1a.js ---- */
/* A1, частина 1: уроки A1.1–A1.6 */
(function (DE) {
DE.lessons = DE.lessons || [];
DE.lessons.push(
{
  id: 'a1-1', stage: 'a1', num: 'A1.1', title: 'Ich bin… — дієслово sein і знайомство', dur: '1 тиждень',
  goals: ['відмінювати sein і знати особові займенники', 'розповісти, хто ви, звідки й де живете', 'запитати про це співрозмовника на «ти» і на «Ви»'],
  theory: `
<h3>Особові займенники</h3>
<p>[[ich]] — я, [[du]] — ти, [[er]] — він, [[sie]] — вона, [[es]] — воно, [[wir]] — ми, [[ihr]] — ви (кілька людей на «ти»), [[sie]] — вони, [[Sie]] — Ви (ввічливо).</p>
<div class="note"><b>Займенник не пропускають.</b> Українською можна сказати «Живу в Берліні», німецькою — тільки [[Ich wohne in Berlin.]] Навіть погода має підмет: [[Es regnet.]] — Іде дощ.</div>
<h3>sein — бути</h3>
<div class="tblwrap"><table><tr><th>однина</th><th></th><th>множина</th><th></th></tr>
<tr><td>ich</td><td>[[bin]]</td><td>wir</td><td>[[sind]]</td></tr>
<tr><td>du</td><td>[[bist]]</td><td>ihr</td><td>[[seid]]</td></tr>
<tr><td>er / sie / es</td><td>[[ist]]</td><td>sie / Sie</td><td>[[sind]]</td></tr></table></div>
<div class="note"><b>В українській «є» зазвичай випадає, у німецькій — ніколи.</b> «Я — студентка» = [[Ich bin Studentin.]] «Це Анна» = [[Das ist Anna.]] Перед професією й національністю артикля немає: [[Ich bin Lehrer.]], а не «ein Lehrer».</div>
<h3>Професії й національності: чоловік / жінка</h3>
<p>Жіночу форму зазвичай утворює <b>-in</b>: [[der Lehrer]] / [[die Lehrerin]], [[der Arzt]] / [[die Ärztin]], [[der Student]] / [[die Studentin]], [[der Verkäufer]] / [[die Verkäuferin]] — продавець / продавчиня.</p>
<p>[[Ich bin Ukrainer.]] / [[Ich bin Ukrainerin.]] [[Er ist Österreicher.]] / [[Sie ist Schweizerin.]] Особливе слово — німець: [[Er ist Deutscher.]] / [[Sie ist Deutsche.]]</p>
<h3>Звідки ви? Де живете?</h3>
<p>[[Woher kommen Sie?]] — [[Ich komme aus der Ukraine.]] [[Ich komme aus Lwiw.]] [[Wo wohnen Sie?]] — [[Ich wohne jetzt in Köln.]]</p>
<div class="note"><b>Країни з артиклем.</b> Більшість країн — без артикля: [[aus Deutschland]], [[in Österreich]]. Але Україна й Швейцарія мають артикль <b>die</b>: [[aus der Ukraine]], [[in der Ukraine]], [[aus der Schweiz]], [[in der Schweiz]]. Київ німецькою традиційно — Kiew, дедалі частіше пишуть і Kyjiw.</div>
<p>Мови: [[Ich spreche Ukrainisch, Englisch und ein bisschen Deutsch.]] — дієслово sprechen змінює корінь: [[du sprichst]], [[er spricht]].</p>
<h3>Заперечення й питання</h3>
<p>Найпростіше заперечення — [[nicht]]: [[Ich bin nicht müde.]] [[Wir sind nicht aus Polen.]]</p>
<p>Питання «так / ні»: дієслово стоїть <b>першим</b>: [[Sind Sie Frau Bauer?]] — [[Ja.]] / [[Nein, ich bin Frau Weber.]] Питання з питальним словом: [[Wer ist das?]] — Хто це? [[Woher kommst du?]] [[Wo wohnst du?]]</p>
<div class="tip">Щоб представити когось: [[Das ist mein Kollege, Herr Wagner.]] — Це мій колега, пан Ваґнер.</div>`,
  vocab: [['sein', 'бути', 'ich bin, du bist, er ist, wir sind, ihr seid, sie sind'], ['er / sie / es', 'він / вона / воно'], ['wir', 'ми'], ['ihr', 'ви (кілька людей, на «ти»)'],
    ['sie', 'вони', 'з великої — Sie: Ви'], ['kommen', 'приходити; бути родом (aus — з)'], ['woher?', 'звідки?'], ['aus', 'з (звідки)'], ['wohnen', 'жити, мешкати'], ['wo?', 'де?'],
    ['wer?', 'хто?'], ['die Ukraine', 'Україна', 'з артиклем: aus der Ukraine'], ['Deutschland', 'Німеччина'], ['Österreich', 'Австрія'], ['die Schweiz', 'Швейцарія', 'з артиклем: in der Schweiz'],
    ['der Ukrainer / die Ukrainerin', 'українець / українка'], ['der Deutsche / die Deutsche', 'німець / німкеня', 'але: ein Deutscher; Ich bin Deutscher.'],
    ['der Lehrer / die Lehrerin', 'вчитель / вчителька'], ['der Arzt / die Ärztin', 'лікар / лікарка', 'die Ärzte / die Ärztinnen'], ['der Student / die Studentin', 'студент / студентка'],
    ['sprechen', 'говорити', 'du sprichst, er spricht'], ['Deutsch', 'німецька мова'], ['Ukrainisch', 'українська мова'], ['ein bisschen', 'трохи'], ['nicht', 'не']],
  ex: [
    { t: 'i', q: 'sein: Ich ___ Olena.', a: 'bin' },
    { t: 'i', q: 'sein: Du ___ aus Kyjiw, oder?', a: 'bist' },
    { t: 'i', q: 'sein: Er ___ Arzt.', a: 'ist' },
    { t: 'i', q: 'sein: Wir ___ aus der Ukraine.', a: 'sind' },
    { t: 'i', q: 'sein: Ihr ___ heute müde.', a: 'seid' },
    { t: 'i', q: 'sein: Frau Weber, ___ Sie aus Wien?', a: 'sind' },
    { t: 'c', q: '«Я — вчителька»', o: ['Ich bin Lehrerin.', 'Ich Lehrerin.', 'Ich bin eine Lehrer.'], e: 'Дієслово sein обов\'язкове, а перед професією артикля немає.' },
    { t: 'c', q: '«Я з України»', o: ['Ich komme aus der Ukraine.', 'Ich komme aus Ukraine.', 'Ich komme von der Ukraine.'], e: 'die Ukraine — з артиклем: [[aus der Ukraine]].' },
    { t: 'c', q: 'Ввічливо: «Звідки ви?»', o: ['Woher kommen Sie?', 'Woher kommst du?', 'Wo kommen Sie?'] },
    { t: 'c', q: 'Жінка з Німеччини — це…', o: ['eine Deutsche', 'eine Deutscherin', 'ein Deutscher'] },
    { t: 'c', q: '«Ми живемо у Швейцарії»', o: ['Wir wohnen in der Schweiz.', 'Wir wohnen in Schweiz.', 'Wir sind wohnen in der Schweiz.'] },
    { t: 'o', q: 'Де ви живете?', a: 'Wo wohnen Sie?' },
    { t: 'o', q: 'Я трохи говорю німецькою.', a: 'Ich spreche ein bisschen Deutsch.' },
    { t: 'o', q: 'Анна тепер живе у Відні.', a: ['Anna wohnt jetzt in Wien.', 'Jetzt wohnt Anna in Wien.'] },
    { t: 'l', a: 'Woher kommen Sie?', tr: 'Звідки ви?' },
    { t: 'l', a: 'Ich komme aus der Ukraine, aus Lwiw.', tr: 'Я з України, зі Львова.' }
  ],
  say: [['Ich heiße Olena. Ich komme aus der Ukraine.', 'Мене звати Олена. Я з України.'], ['Ich wohne jetzt in München.', 'Тепер я живу в Мюнхені.'],
    ['Woher kommen Sie?', 'Звідки ви?'], ['Ich spreche Ukrainisch und ein bisschen Deutsch.', 'Я говорю українською і трохи німецькою.'],
    ['Das ist mein Kollege, Herr Wagner.', 'Це мій колега, пан Ваґнер.']],
  speak: ['Представтеся в 5–6 реченнях: ім\'я, звідки ви, де живете, ким працюєте чи працювали, якими мовами говорите.',
    'Дайте відповідь уголос: Wie heißen Sie? Woher kommen Sie? Wo wohnen Sie? Sprechen Sie Englisch?'],
  mission: 'Представтеся німецькою новій людині — сусідові, одногрупникові на курсі, колезі: «Hallo, ich bin …, ich komme aus der Ukraine und wohne jetzt in …»'
},
{
  id: 'a1-2', stage: 'a1', num: 'A1.2', title: 'der, die, das — рід і артиклі', dur: '1 тиждень',
  goals: ['вчити іменник разом з артиклем', 'вживати der / die / das і ein / eine', 'вгадувати рід за закінченням і замінювати іменник на er / sie / es'],
  theory: `
<p>Родів три, як в українській: чоловічий (<b>der</b>), жіночий (<b>die</b>), середній (<b>das</b>). Але рід німецького слова часто <b>не збігається</b> з українським:</p>
<div class="tblwrap"><table><tr><th>Німецькою</th><th>Українською</th></tr>
<tr><td>[[die Sonne]] — ж. р.</td><td>сонце — с. р.</td></tr>
<tr><td>[[das Mädchen]] — с. р.</td><td>дівчина — ж. р.</td></tr>
<tr><td>[[der Löffel]] — ч. р.</td><td>ложка — ж. р.</td></tr>
<tr><td>[[das Messer]] — с. р.</td><td>ніж — ч. р.</td></tr>
<tr><td>[[der Schrank]] — ч. р.</td><td>шафа — ж. р.</td></tr>
<tr><td>[[die Milch]] — ж. р.</td><td>молоко — с. р.</td></tr>
<tr><td>[[die Tür]] — однина, ж. р.</td><td>двері — лише множина</td></tr>
</table></div>
<p>Буває і збіг: [[der Tisch]] — стіл, [[die Lampe]] — лампа, [[das Fenster]] — вікно, [[der Mond]] — місяць. Але покладатися на українську не можна.</p>
<div class="note"><b>Правило №1: іменник — тільки з артиклем.</b> Вчіть не «Tisch», а [[der Tisch]], не «Lampe», а [[die Lampe]]. Допомагають кольори: der — синім, die — червоним, das — зеленим.</div>
<h3>Означений і неозначений артикль</h3>
<div class="tblwrap"><table><tr><th></th><th>ч. р.</th><th>ж. р.</th><th>с. р.</th><th>множина</th></tr>
<tr><td>означений (той самий, відомий)</td><td>[[der Tisch]]</td><td>[[die Lampe]]</td><td>[[das Bett]]</td><td>[[die Tische]]</td></tr>
<tr><td>неозначений (якийсь, один)</td><td>[[ein Tisch]]</td><td>[[eine Lampe]]</td><td>[[ein Bett]]</td><td>[[Tische]] (без артикля)</td></tr>
</table></div>
<p>Уперше згадуємо — <b>ein / eine</b>, далі — <b>der / die / das</b>: [[Das ist ein Stuhl. Der Stuhl ist neu.]] У множині означений артикль завжди [[die]].</p>
<div class="good">В українській артиклів немає, тож це нова звичка. Зате відмінки вам знайомі — і саме артикль у німецькій показуватиме відмінок (уроки A1.5 і A1.10).</div>
<h3>Підказки за закінченням</h3>
<div class="tblwrap"><table><tr><th>Рід</th><th>Закінчення чи група</th><th>Приклади</th></tr>
<tr><td><b>die</b></td><td>-ung, -heit, -keit, -schaft, -ion, -tät, -ie; більшість слів на -e</td><td>[[die Wohnung]], [[die Freiheit]], [[die Information]], [[die Universität]], [[die Küche]]</td></tr>
<tr><td><b>das</b></td><td>-chen, -lein (зменшувальні), здебільшого -ment, -um</td><td>[[das Mädchen]], [[das Brötchen]], [[das Dokument]], [[das Zentrum]]</td></tr>
<tr><td><b>der</b></td><td>дні тижня, місяці, пори року; -ismus, -ling; особи на -er</td><td>[[der Montag]], [[der Mai]], [[der Sommer]], [[der Lehrer]]</td></tr>
</table></div>
<p class="small muted">Винятки є: [[der Name]], [[der Käse]] закінчуються на -e, але чоловічого роду.</p>
<p><b>Складне слово</b> має рід останньої частини: [[der Kühlschrank]] (der Schrank), [[das Schlafzimmer]] (das Zimmer), [[die Haustür]] (die Tür).</p>
<h3>er, sie, es замість іменника</h3>
<p>Займенник вибирають за <b>граматичним родом</b>: [[Der Tisch ist neu. Er ist schön.]] [[Wo ist die Lampe? — Sie ist hier.]] [[Das Messer? Es ist in der Küche.]] Тобто про двері кажуть «вона»: [[Die Tür ist offen. Sie ist offen.]]</p>`,
  vocab: [['der Tisch', 'стіл', 'die Tische'], ['der Stuhl', 'стілець', 'die Stühle'], ['der Schrank', 'шафа', 'die Schränke; чоловічий рід!'], ['der Kühlschrank', 'холодильник', 'die Kühlschränke'],
    ['der Löffel', 'ложка', 'die Löffel; чоловічий рід!'], ['die Gabel', 'виделка', 'die Gabeln'], ['das Messer', 'ніж', 'die Messer; середній рід!'], ['die Lampe', 'лампа', 'die Lampen'],
    ['das Bett', 'ліжко', 'die Betten'], ['das Fenster', 'вікно', 'die Fenster'], ['die Wohnung', 'квартира', 'die Wohnungen'], ['das Zimmer', 'кімната', 'die Zimmer'],
    ['das Schlafzimmer', 'спальня', 'die Schlafzimmer'], ['die Küche', 'кухня', 'die Küchen'], ['das Bad', 'ванна кімната; купання', 'die Bäder; англ. bad = schlecht'],
    ['der Mond', 'місяць (на небі)', 'die Monde'], ['das Auto', 'автомобіль', 'die Autos'], ['die Tasche', 'сумка', 'die Taschen'], ['das Handy', 'мобільний телефон', 'die Handys'],
    ['der Schlüssel', 'ключ', 'die Schlüssel'], ['die Brille', 'окуляри', 'однина! die Brillen — кілька пар'], ['das Bild', 'картина; фото', 'die Bilder']],
  ex: [
    { t: 'c', q: 'Який рід у слова «Mädchen»?', o: ['das (середній)', 'die (жіночий)', 'der (чоловічий)'], e: 'Усі слова на -chen — das.' },
    { t: 'c', q: '«Löffel» (ложка): який артикль?', o: ['der', 'die', 'das'] },
    { t: 'c', q: '«Messer» (ніж): який артикль?', o: ['das', 'der', 'die'] },
    { t: 'c', q: '«Wohnung»: який артикль?', o: ['die', 'der', 'das'], e: 'Слова на -ung — завжди die.' },
    { t: 'c', q: '«Schlafzimmer»: який артикль?', o: ['das', 'der', 'die'], e: 'Рід складного слова — за останньою частиною: [[das Zimmer]].' },
    { t: 'i', q: '___ Lampe (der / die / das)', a: 'die' },
    { t: 'i', q: '___ Tisch (der / die / das)', a: 'der' },
    { t: 'i', q: '___ Bett (der / die / das)', a: 'das' },
    { t: 'i', q: 'Неозначений артикль: Das ist ___ Tasche.', a: 'eine' },
    { t: 'i', q: 'Неозначений артикль: Das ist ___ Schlüssel.', a: 'ein' },
    { t: 'i', q: 'Займенник: Wo ist der Schlüssel? — ___ ist hier.', a: 'er' },
    { t: 'i', q: 'Займенник: Die Tür ist offen. — Ja, ___ ist offen.', a: 'sie' },
    { t: 'i', q: 'Напишіть з артиклем: <b>кухня</b>', a: 'die Küche' },
    { t: 'c', q: 'Множина від «das Fenster» з артиклем:', o: ['die Fenster', 'das Fenster', 'die Fensters'] },
    { t: 'o', q: 'Це стілець. Стілець новий.', a: 'Das ist ein Stuhl. Der Stuhl ist neu.' },
    { t: 'l', a: 'Der Kühlschrank ist in der Küche.', tr: 'Холодильник стоїть на кухні.' },
    { t: 'l', a: 'Die Wohnung hat ein Bad und zwei Zimmer.', tr: 'У квартирі є ванна і дві кімнати.' }
  ],
  say: [['der Tisch, die Lampe, das Bett', 'стіл, лампа, ліжко'], ['Das ist ein Stuhl. Der Stuhl ist neu.', 'Це стілець. Стілець новий.'],
    ['Wo ist der Schlüssel? — Er ist hier.', 'Де ключ? — Він тут.'], ['die Sonne und der Mond', 'сонце і місяць'], ['Das Mädchen ist hier.', 'Дівчинка тут.']],
  speak: ['Пройдіться квартирою і назвіть уголос 15 речей з артиклем: der Tisch, die Lampe, das Fenster… Якщо не знаєте слова, знайдіть його в словнику — з артиклем.',
    'Опишіть свою кімнату: «Das ist mein Zimmer. Hier ist ein Bett, da ist ein Schrank…»'],
  mission: 'Наклейте на 10 речей у квартирі папірці з назвою та артиклем (der Kühlschrank, die Tür, das Fenster) — трьома кольорами для der, die, das. Тиждень читайте їх уголос, коли проходите повз.'
},
{
  id: 'a1-3', stage: 'a1', num: 'A1.3', title: 'Дієслова в теперішньому часі, порядок слів і питання', dur: '1 тиждень',
  goals: ['відмінювати правильні дієслова й ті, що змінюють корінь (fahren → er fährt)', 'ставити дієслово на друге місце', 'ставити W-питання і питання «так / ні»'],
  theory: `
<h3>Закінчення дієслів</h3>
<div class="tblwrap"><table><tr><th></th><th>wohnen</th><th>arbeiten</th><th>heißen</th></tr>
<tr><td>ich</td><td>[[wohne]]</td><td>[[arbeite]]</td><td>[[heiße]]</td></tr>
<tr><td>du</td><td>[[wohnst]]</td><td>[[arbeitest]]</td><td>[[heißt]]</td></tr>
<tr><td>er / sie / es</td><td>[[wohnt]]</td><td>[[arbeitet]]</td><td>[[heißt]]</td></tr>
<tr><td>wir</td><td>[[wohnen]]</td><td>[[arbeiten]]</td><td>[[heißen]]</td></tr>
<tr><td>ihr</td><td>[[wohnt]]</td><td>[[arbeitet]]</td><td>[[heißt]]</td></tr>
<tr><td>sie / Sie</td><td>[[wohnen]]</td><td>[[arbeiten]]</td><td>[[heißen]]</td></tr></table></div>
<p class="small muted">Після t і d додають -e-, щоб легше вимовити: du arbeitest, er arbeitet. Після s, ß, z у формі du лише -t: du heißt, du tanzt.</p>
<h3>Дієслова, що змінюють корінь (лише du і er / sie / es)</h3>
<div class="tblwrap"><table><tr><th>Зміна</th><th>Приклади</th></tr>
<tr><td>a → ä</td><td>[[fahren]] — [[du fährst]], [[er fährt]]; [[schlafen]] — [[er schläft]]</td></tr>
<tr><td>e → i</td><td>[[sprechen]] — [[er spricht]]; [[essen]] — [[er isst]]; [[helfen]] — [[er hilft]]; [[nehmen]] — [[du nimmst]], [[er nimmt]]</td></tr>
<tr><td>e → ie</td><td>[[lesen]] — [[er liest]]; [[sehen]] — [[er sieht]]</td></tr>
</table></div>
<h3>Дієслово — на другому місці</h3>
<p>У розповідному реченні дієслово стоїть <b>другим</b>. На першому місці може бути що завгодно — тоді підмет переходить <b>за</b> дієслово:</p>
<div class="tblwrap"><table><tr><th>1</th><th>2 — дієслово</th><th>далі</th></tr>
<tr><td>Ich</td><td><b>arbeite</b></td><td>heute in Berlin.</td></tr>
<tr><td>Heute</td><td><b>arbeite</b></td><td>ich in Berlin.</td></tr>
<tr><td>In Berlin</td><td><b>arbeite</b></td><td>ich heute.</td></tr></table></div>
<p>[[Ich arbeite heute in Berlin.]] [[Heute arbeite ich in Berlin.]] [[In Berlin arbeite ich heute.]]</p>
<div class="note"><b>В українській порядок слів вільний, у німецькій — ні.</b> «Сьогодні я працюю» — тільки [[Heute arbeite ich.]], а «Heute ich arbeite» — помилка.</div>
<h3>Питання</h3>
<p><b>W-питання:</b> питальне слово, потім дієслово: [[Was machst du?]] [[Wo arbeiten Sie?]] [[Wann kommt der Bus?]] [[Warum lernst du Deutsch?]] [[Wie lange lernst du Deutsch?]]</p>
<div class="tblwrap"><table><tr><td>[[wer]] — хто</td><td>[[was]] — що</td><td>[[wo]] — де</td><td>[[woher]] — звідки</td><td>[[wohin]] — куди</td></tr>
<tr><td>[[wann]] — коли</td><td>[[wie]] — як</td><td>[[warum]] — чому</td><td>[[wie viel]] — скільки</td><td>[[wie lange]] — як довго</td></tr></table></div>
<p><b>Питання «так / ні»:</b> дієслово — на <b>першому</b> місці: [[Arbeitest du heute?]] — [[Ja, ich arbeite heute.]] / [[Nein, heute nicht.]] [[Wohnen Sie in Wien?]]</p>
<div class="note">Українською питання можна поставити самою інтонацією: «Ти сьогодні працюєш?». Німецькою потрібен порядок слів: дієслово першим.</div>
<div class="tip"><b>doch</b> — «так» у відповідь на заперечне питання: [[Arbeitest du heute nicht?]] — [[Doch!]] (= ні, працюю!).</div>
<h3>Теперішній час — і для майбутнього</h3>
<p>[[Morgen fahre ich nach Hamburg.]] — Завтра я їду до Гамбурга. Окремої форми «я зараз читаю» немає: [[Ich lese.]] — і «читаю», і «зараз читаю».</p>`,
  vocab: [['machen', 'робити'], ['arbeiten', 'працювати', 'du arbeitest, er arbeitet'], ['lernen', 'вчити, вчитися'], ['spielen', 'грати'], ['kochen', 'готувати (їжу)'],
    ['kaufen', 'купувати'], ['trinken', 'пити'], ['fahren', 'їхати (транспортом)', 'du fährst, er fährt'], ['schlafen', 'спати', 'du schläfst, er schläft'],
    ['lesen', 'читати', 'du liest, er liest'], ['sehen', 'бачити', 'du siehst, er sieht'], ['nehmen', 'брати', 'du nimmst, er nimmt'], ['helfen', 'допомагати', 'du hilfst, er hilft'],
    ['verstehen', 'розуміти'], ['was?', 'що?'], ['wann?', 'коли?'], ['wie?', 'як?'], ['warum?', 'чому?'], ['wohin?', 'куди?'], ['morgen', 'завтра', 'der Morgen — ранок'],
    ['jetzt', 'зараз, тепер'], ['oft', 'часто'], ['doch', 'так (у відповідь на заперечне питання); ж, адже']],
  ex: [
    { t: 'i', q: 'wohnen → du ___', a: 'wohnst' },
    { t: 'i', q: 'arbeiten → er ___', a: 'arbeitet' },
    { t: 'i', q: 'heißen → du ___', a: 'heißt' },
    { t: 'i', q: 'fahren → er ___', a: 'fährt' },
    { t: 'i', q: 'lesen → sie (вона) ___', a: 'liest' },
    { t: 'i', q: 'nehmen → du ___', a: 'nimmst' },
    { t: 'i', q: 'schlafen → das Kind ___', a: 'schläft' },
    { t: 'c', q: 'Яке речення правильне?', o: ['Heute arbeite ich nicht.', 'Heute ich arbeite nicht.', 'Heute ich nicht arbeite.'] },
    { t: 'c', q: '«Ти сьогодні працюєш?»', o: ['Arbeitest du heute?', 'Du heute arbeitest?', 'Arbeitest heute du?'] },
    { t: 'c', q: '«Arbeitest du heute nicht?» — «Та ні, працюю!»', o: ['Doch!', 'Ja!', 'Nein!'], e: 'На заперечне питання «так» — це [[Doch!]]' },
    { t: 'c', q: '«коли?» німецькою —', o: ['wann', 'wo', 'wie'] },
    { t: 'c', q: '«Чому ти вчиш німецьку?»', o: ['Warum lernst du Deutsch?', 'Warum du lernst Deutsch?', 'Wo lernst du Deutsch?'] },
    { t: 'o', q: 'Що ти робиш?', a: 'Was machst du?' },
    { t: 'o', q: 'Анна сьогодні готує.', a: ['Anna kocht heute.', 'Heute kocht Anna.'] },
    { t: 'o', q: 'Завтра Тарас їде до Відня.', a: ['Taras fährt morgen nach Wien.', 'Morgen fährt Taras nach Wien.', 'Nach Wien fährt Taras morgen.'] },
    { t: 'o', q: 'Ви це розумієте? (ввічливо)', a: 'Verstehen Sie das?' },
    { t: 'l', a: 'Wann kommt der Bus?', tr: 'Коли приїде автобус?' },
    { t: 'l', a: 'Er liest jeden Tag die Zeitung.', tr: 'Він щодня читає газету.' }
  ],
  say: [['Was machst du heute?', 'Що ти робиш сьогодні?'], ['Heute arbeite ich nicht.', 'Сьогодні я не працюю.'], ['Wo arbeiten Sie?', 'Де ви працюєте?'],
    ['Arbeitest du heute nicht? — Doch!', 'Ти сьогодні не працюєш? — Та ні, працюю!'], ['Er fährt morgen nach Hamburg.', 'Він завтра їде до Гамбурга.'],
    ['Ich verstehe das nicht.', 'Я цього не розумію.']],
  speak: ['Розкажіть про свій звичайний день у 6–8 реченнях і щоразу починайте з іншого слова: «Heute arbeite ich… Am Abend koche ich… Dann lese ich…» — дієслово завжди друге.',
    'Поставте співрозмовникові (або собі) 5 W-питань і 3 питання «так / ні»: Wo wohnst du? Arbeitest du? Lernst du Deutsch?'],
  mission: 'Поставте сьогодні справжнє питання німецькою: у транспорті («Fährt dieser Bus zum Bahnhof?»), у магазині («Wo finde ich Milch?») чи колезі («Was machst du am Wochenende?»).'
},
{
  id: 'a1-4', stage: 'a1', num: 'A1.4', title: 'haben, множина, сім\'я; mein, dein, sein, ihr', dur: '1 тиждень',
  goals: ['відмінювати haben', 'утворювати множину іменників', 'розповісти про сім\'ю з mein / dein / sein / ihr'],
  theory: `
<h3>haben — мати</h3>
<div class="tblwrap"><table><tr><td>ich</td><td>[[habe]]</td><td>wir</td><td>[[haben]]</td></tr>
<tr><td>du</td><td>[[hast]]</td><td>ihr</td><td>[[habt]]</td></tr>
<tr><td>er / sie / es</td><td>[[hat]]</td><td>sie / Sie</td><td>[[haben]]</td></tr></table></div>
<p>[[Ich habe Zeit.]] [[Hast du Kinder?]] [[Sie hat ein Auto.]] Іменник чоловічого роду після haben отримує <b>einen</b>: [[Ich habe einen Sohn.]] — чому так, пояснює урок A1.5.</p>
<div class="note"><b>Не «у мене є», а «я маю»:</b> [[Ich habe ein Auto.]] Голод і спрагу теж «мають»: [[Ich habe Hunger.]] — я голодний, [[Ich habe Durst.]] — я хочу пити. А <b>вік — через sein</b>: [[Ich bin 35 Jahre alt.]], а не «Ich habe 35 Jahre».</div>
<h3>Множина</h3>
<p>Множину треба вчити разом зі словом: у словнику вона виглядає так — <i>der Tag, -e</i>; <i>das Buch, ¨-er</i>. Артикль множини — завжди <b>die</b>.</p>
<div class="tblwrap"><table><tr><th>Тип</th><th>Приклади</th></tr>
<tr><td><b>-e</b> (часто з умлаутом)</td><td>[[der Tag]] → [[die Tage]], [[der Stuhl]] → [[die Stühle]]</td></tr>
<tr><td><b>-(e)n</b> (більшість жіночого роду)</td><td>[[die Frau]] → [[die Frauen]], [[die Lampe]] → [[die Lampen]], [[die Wohnung]] → [[die Wohnungen]]</td></tr>
<tr><td><b>-er</b> (з умлаутом, де можна)</td><td>[[das Kind]] → [[die Kinder]], [[das Haus]] → [[die Häuser]], [[das Buch]] → [[die Bücher]]</td></tr>
<tr><td><b>без закінчення</b> (часто -er, -el, -en, -chen)</td><td>[[der Lehrer]] → [[die Lehrer]], [[das Mädchen]] → [[die Mädchen]], [[die Mutter]] → [[die Mütter]], [[der Bruder]] → [[die Brüder]]</td></tr>
<tr><td><b>-s</b> (запозичення, слова на голосний)</td><td>[[das Auto]] → [[die Autos]], [[das Handy]] → [[die Handys]], [[die Oma]] → [[die Omas]]</td></tr>
</table></div>
<h3>Сім'я</h3>
<p>[[die Familie]] — сім'я, [[die Eltern]] — батьки (лише множина), [[der Vater]], [[die Mutter]], [[der Sohn]], [[die Tochter]], [[der Bruder]], [[die Schwester]], [[die Geschwister]] — брати й сестри, [[der Mann]] — чоловік, [[die Frau]] — дружина, [[die Oma]] / [[der Opa]] — бабуся / дідусь (офіційно [[die Großmutter]] / [[der Großvater]]).</p>
<p>[[Ich bin verheiratet.]] — одружений / заміжня. [[Ich bin ledig.]] — неодружений / незаміжня. [[Ich bin geschieden.]] — розлучений.</p>
<h3>Присвійні займенники</h3>
<div class="tblwrap"><table><tr><th>хто</th><th>ч. і с. р.</th><th>ж. р. і множина</th></tr>
<tr><td>ich</td><td>[[mein Bruder]]</td><td>[[meine Schwester]], [[meine Eltern]]</td></tr>
<tr><td>du</td><td>[[dein Sohn]]</td><td>[[deine Tochter]]</td></tr>
<tr><td>er, es</td><td>[[sein Vater]]</td><td>[[seine Mutter]]</td></tr>
<tr><td>sie (вона)</td><td>[[ihr Mann]]</td><td>[[ihre Kinder]]</td></tr>
<tr><td>wir</td><td>[[unser Haus]]</td><td>[[unsere Wohnung]]</td></tr>
<tr><td>ihr</td><td>[[euer Auto]]</td><td>[[eure Familie]]</td></tr>
<tr><td>sie (вони)</td><td>[[ihr Sohn]]</td><td>[[ihre Tochter]]</td></tr>
<tr><td>Sie (Ви)</td><td>[[Ihr Name]]</td><td>[[Ihre Adresse]]</td></tr>
</table></div>
<div class="note"><b>Слова «свій» у німецькій немає.</b> Вибір залежить від того, <b>чиє</b>: Тарас і його сестра — [[Taras und seine Schwester]]; Олена і її брат — [[Olena und ihr Bruder]]. Закінчення -e з'являється, коли сам іменник жіночого роду чи в множині.</div>
<p>[[Hast du Geschwister?]] — [[Ja, ich habe zwei Brüder und eine Schwester.]] [[Bist du verheiratet?]] — [[Ja, mein Mann heißt Andrij.]]</p>`,
  vocab: [['haben', 'мати', 'ich habe, du hast, er hat'], ['die Familie', 'сім\'я', 'die Familien'], ['die Eltern', 'батьки', 'лише множина'], ['die Mutter', 'мати', 'die Mütter'],
    ['der Sohn', 'син', 'die Söhne'], ['die Tochter', 'донька', 'die Töchter'], ['der Bruder', 'брат', 'die Brüder'], ['die Schwester', 'сестра', 'die Schwestern'],
    ['die Geschwister', 'брати й сестри', 'лише множина'], ['der Mann', 'чоловік (і в шлюбі)', 'die Männer'], ['die Oma / der Opa', 'бабуся / дідусь', 'die Omas / die Opas'],
    ['das Kind', 'дитина', 'die Kinder'], ['der Partner / die Partnerin', 'партнер / партнерка'], ['verheiratet', 'одружений, заміжня'], ['ledig', 'неодружений, незаміжня'],
    ['geschieden', 'розлучений, розлучена'], ['mein / meine', 'мій / моя'], ['dein / deine', 'твій / твоя'], ['sein / seine', 'його'], ['ihr / ihre', 'її; їхній', 'з великої — Ihr / Ihre: Ваш'],
    ['unser / unsere', 'наш / наша'], ['der Hunger', 'голод', 'Ich habe Hunger.'], ['der Durst', 'спрага', 'Ich habe Durst.'], ['alt', 'старий; (скільки) років', 'Wie alt bist du?']],
  ex: [
    { t: 'i', q: 'haben: Ich ___ zwei Kinder.', a: 'habe' },
    { t: 'i', q: 'haben: ___ du heute Zeit?', a: 'Hast' },
    { t: 'i', q: 'haben: Er ___ Hunger.', a: 'hat' },
    { t: 'i', q: 'haben: Wir ___ eine Tochter.', a: 'haben' },
    { t: 'i', q: 'haben: Ihr ___ eine schöne Wohnung.', a: 'habt' },
    { t: 'c', q: '«Мені 20 років»', o: ['Ich bin zwanzig Jahre alt.', 'Ich habe zwanzig Jahre.', 'Mir ist zwanzig Jahre.'], e: 'Вік — через sein: [[Ich bin zwanzig.]]' },
    { t: 'i', q: 'Множина з артиклем: das Kind →', a: 'die Kinder' },
    { t: 'i', q: 'Множина з артиклем: die Schwester →', a: 'die Schwestern' },
    { t: 'i', q: 'Множина з артиклем: der Bruder →', a: 'die Brüder' },
    { t: 'i', q: 'Множина з артиклем: das Auto →', a: 'die Autos' },
    { t: 'c', q: 'Множина від «die Tochter»:', o: ['die Töchter', 'die Tochtern', 'die Tochters'] },
    { t: 'i', q: 'Olena und ___ Bruder (її брат)', a: 'ihr' },
    { t: 'i', q: 'Taras und ___ Schwester (його сестра)', a: 'seine' },
    { t: 'i', q: 'Das sind ___ Eltern. (мої)', a: 'meine' },
    { t: 'c', q: 'Ввічливо: «Як ваше ім\'я?»', o: ['Wie ist Ihr Name?', 'Wie ist dein Name?', 'Wie ist ihr Name?'], e: 'Ввічливе [[Ihr]] — з великої літери, як і [[Sie]].' },
    { t: 'o', q: 'У мене є брат і дві сестри.', a: 'Ich habe einen Bruder und zwei Schwestern.' },
    { t: 'o', q: 'Марія та її чоловік живуть у Граці.', a: ['Maria und ihr Mann wohnen in Graz.', 'In Graz wohnen Maria und ihr Mann.'] },
    { t: 'l', a: 'Hast du Geschwister?', tr: 'У тебе є брати чи сестри?' },
    { t: 'l', a: 'Meine Eltern wohnen in der Ukraine.', tr: 'Мої батьки живуть в Україні.' }
  ],
  say: [['Ich habe zwei Kinder, einen Sohn und eine Tochter.', 'У мене двоє дітей, син і донька.'], ['Hast du Geschwister?', 'У тебе є брати чи сестри?'],
    ['Meine Eltern wohnen in Dnipro.', 'Мої батьки живуть у Дніпрі.'], ['Ich bin verheiratet. Mein Mann heißt Andrij.', 'Я заміжня. Мого чоловіка звати Андрій.'],
    ['Ich habe Hunger!', 'Я голодний / голодна!']],
  speak: ['Розкажіть про свою сім\'ю в 6–8 реченнях: хто в ній є, як їх звати, скільки їм років, де вони живуть. Можна взяти фото: «Das ist meine Schwester. Sie heißt …»',
    'Поставте 4 питання про сім\'ю: Bist du verheiratet? Hast du Kinder? Wie alt sind sie? Wo wohnen deine Eltern?'],
  mission: 'Розкажіть комусь німецькою про свою сім\'ю — на інтеграційному курсі, колезі чи в мовному тандемі. Покажіть фото: «Das sind meine Eltern…»'
},
{
  id: 'a1-5', stage: 'a1', num: 'A1.5', title: 'Akkusativ: einen, keinen, den; nicht чи kein', dur: '1 тиждень',
  goals: ['ставити іменник у знахідний відмінок (Akkusativ)', 'вибирати nicht чи kein', 'вживати mich, dich, ihn і «es gibt»'],
  theory: `
<p>У німецькій 4 відмінки: <b>Nominativ</b> (хто? що?), <b>Akkusativ</b> (кого? що?), <b>Dativ</b> (кому? де?) і <b>Genitiv</b> (чий?).</p>
<div class="good">Відмінки вам знайомі: «бачу брат<b>а</b>, п'ю кав<b>у</b>». Різниця в тому, що в німецькій змінюється здебільшого <b>артикль</b>, а не закінчення іменника.</div>
<h3>Akkusativ: змінюється лише чоловічий рід</h3>
<div class="tblwrap"><table><tr><th></th><th>ч. р.</th><th>ж. р.</th><th>с. р.</th><th>множина</th></tr>
<tr><td>Nominativ</td><td>der / ein / kein / mein</td><td>die / eine / keine / meine</td><td>das / ein / kein / mein</td><td>die / — / keine / meine</td></tr>
<tr><td>Akkusativ</td><td><b>den / einen / keinen / meinen</b></td><td>die / eine / keine / meine</td><td>das / ein / kein / mein</td><td>die / — / keine / meine</td></tr>
</table></div>
<p>[[Der Kaffee ist heiß.]] → [[Ich trinke den Kaffee.]] [[Ich habe einen Bruder.]] Жіночий, середній рід і множина не змінюються: [[Ich sehe die Frau.]] [[Ich kaufe das Brot.]] [[Ich brauche eine Tasche.]]</p>
<p>Akkusativ потрібен після дієслів <b>haben, brauchen, kaufen, sehen, nehmen, suchen, finden, möchten</b> і після <b>es gibt</b> — «є, існує»: [[Hier gibt es einen Park.]] — Тут є парк.</p>
<h3>Займенники в Akkusativ</h3>
<div class="tblwrap"><table><tr><th>Nom</th><td>ich</td><td>du</td><td>er</td><td>sie</td><td>es</td><td>wir</td><td>ihr</td><td>sie / Sie</td></tr>
<tr><th>Akk</th><td>[[mich]]</td><td>[[dich]]</td><td>[[ihn]]</td><td>[[sie]]</td><td>[[es]]</td><td>[[uns]]</td><td>[[euch]]</td><td>[[sie]] / [[Sie]]</td></tr></table></div>
<p>[[Ich sehe ihn.]] — Я його бачу. [[Liebst du mich?]] [[Entschuldigung, ich verstehe Sie nicht.]]</p>
<h3>nicht чи kein?</h3>
<div class="tblwrap"><table><tr><th>kein / keine</th><th>nicht</th></tr>
<tr><td>перед іменником з ein або без артикля</td><td>дієслово, прикметник, прислівник; іменник з der / die / das чи mein</td></tr>
<tr><td>[[Ich habe kein Auto.]]<br>[[Ich habe keine Zeit.]]<br>[[Ich trinke keinen Kaffee.]]</td><td>[[Ich arbeite nicht.]]<br>[[Das ist nicht teuer.]]<br>[[Ich finde den Schlüssel nicht.]]<br>[[Das ist nicht mein Handy.]]</td></tr></table></div>
<div class="note"><b>Подвійного заперечення немає.</b> «Я не маю часу» — [[Ich habe keine Zeit.]] (а не «nicht Zeit»). «Я нічого не маю» — [[Ich habe nichts.]] Одне заперечне слово на речення.</div>
<p><b>Де стоїть nicht:</b> якщо заперечуємо дію загалом — у кінці: [[Ich verstehe das nicht.]]; перед прикметником чи прийменником — перед ним: [[nicht gut]], [[nicht in Berlin]].</p>
<p>[[Hast du ein Auto? — Nein, ich habe kein Auto.]]</p>`,
  vocab: [['brauchen', 'потребувати; бути потрібним', 'Ich brauche … — Мені потрібен …'], ['suchen', 'шукати'], ['finden', 'знаходити; вважати', 'Ich finde das gut.'], ['lieben', 'кохати, любити'],
    ['es gibt', 'є, існує (+ Akkusativ)'], ['kein / keine', 'жоден; не (перед іменником)'], ['der Kaffee', 'кава', 'чоловічий рід!'], ['das Brot', 'хліб', 'die Brote'],
    ['das Geld', 'гроші', 'однина!'], ['der Park', 'парк', 'die Parks'], ['der Ausweis', 'посвідчення особи', 'die Ausweise; der Personalausweis'], ['der Pass', 'паспорт', 'die Pässe'],
    ['der Hund', 'собака', 'die Hunde'], ['die Katze', 'кішка', 'die Katzen'], ['der Führerschein', 'посвідчення водія', 'die Führerscheine'], ['das Fahrrad', 'велосипед', 'die Fahrräder'],
    ['mich / dich', 'мене / тебе'], ['ihn', 'його (Akkusativ від er)'], ['uns / euch', 'нас / вас'], ['teuer', 'дорогий'], ['billig', 'дешевий', 'нейтральніше — günstig'], ['der Koffer', 'валіза', 'die Koffer']],
  ex: [
    { t: 'i', q: 'Akkusativ: Ich habe ___ Bruder. (ein)', a: 'einen' },
    { t: 'i', q: 'Akkusativ: Ich trinke ___ Kaffee. (der)', a: 'den' },
    { t: 'i', q: 'Akkusativ: Ich suche ___ Ausweis. (mein)', a: 'meinen', e: '«Шукаю свій паспорт» — [[Ich suche meinen Ausweis.]]: «свій» тут — mein.' },
    { t: 'i', q: 'Akkusativ: Wir brauchen ___ Wohnung. (eine)', a: 'eine' },
    { t: 'i', q: 'Akkusativ: Siehst du ___ Hund? (der)', a: 'den' },
    { t: 'i', q: 'Akkusativ: Hier gibt es ___ Park. (ein)', a: 'einen' },
    { t: 'c', q: 'Ich habe ___ Auto. (заперечення)', o: ['kein', 'nicht', 'keinen'] },
    { t: 'c', q: 'Ich habe ___ Zeit. (заперечення)', o: ['keine', 'nicht', 'kein'] },
    { t: 'c', q: 'Ich verstehe das ___.', o: ['nicht', 'kein', 'keine'] },
    { t: 'c', q: 'Das ist ___ mein Handy.', o: ['nicht', 'kein', 'keine'], e: 'Перед mein, dein, der… — nicht.' },
    { t: 'i', q: 'Заперечення: Ich trinke ___ Kaffee.', a: 'keinen' },
    { t: 'i', q: 'Siehst du den Bus? — Ja, ich sehe ___.', a: 'ihn' },
    { t: 'i', q: 'Ich liebe ___. (тебе)', a: 'dich' },
    { t: 'c', q: '«Ви мене розумієте?»', o: ['Verstehen Sie mich?', 'Verstehen Sie ich?', 'Verstehen Sie mir?'] },
    { t: 'o', q: 'У мене немає машини.', a: 'Ich habe kein Auto.' },
    { t: 'o', q: 'Сім\'я Мельник шукає квартиру в Мюнхені.', a: ['Familie Melnyk sucht eine Wohnung in München.', 'In München sucht Familie Melnyk eine Wohnung.'] },
    { t: 'l', a: 'Ich finde meinen Schlüssel nicht.', tr: 'Я не можу знайти свій ключ.' },
    { t: 'l', a: 'Hier gibt es keinen Supermarkt.', tr: 'Тут немає супермаркету.' }
  ],
  say: [['Ich habe keine Zeit.', 'У мене немає часу.'], ['Ich finde meinen Schlüssel nicht.', 'Я не можу знайти свій ключ.'],
    ['Hast du ein Auto? — Nein, ich habe kein Auto.', 'У тебе є машина? — Ні, у мене немає машини.'], ['Ich brauche einen Kaffee!', 'Мені потрібна кава!'],
    ['Gibt es hier einen Supermarkt?', 'Тут є супермаркет?']],
  speak: ['Розкажіть, що у вас є і чого немає (6–8 речень): «Ich habe einen Hund, aber keine Katze. Ich habe kein Auto, ich habe ein Fahrrad…»',
    'Опишіть свій район: що там є і чого немає. «Hier gibt es einen Park und eine Apotheke, aber keinen Bahnhof…»'],
  mission: 'Запитайте на вулиці чи в магазині, де щось знайти: «Entschuldigung, gibt es hier eine Apotheke?» або «Ich suche den Bahnhof.» Запам\'ятайте відповідь.'
},
{
  id: 'a1-6', stage: 'a1', num: 'A1.6', title: 'У кафе й магазині: ich möchte, Was kostet…?, gern', dur: '1 тиждень',
  goals: ['замовити в кафе й пекарні', 'запитати ціну й заплатити', 'сказати, що ви любите: gern, lieber, am liebsten'],
  theory: `
<h3>Ввічливе «хотів би»: möchten</h3>
<div class="tblwrap"><table><tr><td>ich</td><td>[[möchte]]</td><td>wir</td><td>[[möchten]]</td></tr>
<tr><td>du</td><td>[[möchtest]]</td><td>ihr</td><td>[[möchtet]]</td></tr>
<tr><td>er / sie / es</td><td>[[möchte]]</td><td>sie / Sie</td><td>[[möchten]]</td></tr></table></div>
<p>[[Ich möchte einen Kaffee, bitte.]] [[Ich möchte zahlen.]] Біля прилавка ще частіше кажуть [[Ich hätte gern ein Stück Kuchen.]] — «Я б хотів шматок пирога» — або коротко: [[Ich nehme…]], [[Für mich einen Tee, bitte.]] Розмовно: [[Ich bekomme einen Tee.]] — «Мені чай».</p>
<div class="note"><b>«Ich will…»</b> звучить як «хочу!» — грубувато. У кафе, магазині й установі кажіть <b>ich möchte</b> або <b>ich hätte gern</b>. І ще: [[bekommen]] означає «отримувати», а не англійське become.</div>
<h3>У кафе й пекарні</h3>
<p>[[Was möchten Sie trinken?]] — [[Einen Cappuccino, bitte.]]<br>
[[Was darf es sein?]] — Що бажаєте? (біля прилавка)<br>
[[Für hier oder zum Mitnehmen?]] — Тут чи на винос? — [[Zum Mitnehmen, bitte.]]<br>
[[Sonst noch etwas?]] — Щось іще? — [[Nein, danke. Das ist alles.]]</p>
<p>Рахунок: [[Die Rechnung, bitte!]] або [[Zahlen, bitte!]] Офіціант спитає: [[Zusammen oder getrennt?]] — платите разом чи окремо? Чайові (Trinkgeld) зазвичай близько 5–10 %: суму округлюють і кажуть [[Stimmt so.]] — решти не треба.</p>
<div class="tip"><b>Карткою?</b> [[Kann ich mit Karte zahlen?]] У Німеччині досі трапляється [[Nur bar.]] — лише готівкою. Тож корисно мати при собі трохи готівки.</div>
<h3>Ціни</h3>
<p>[[Was kostet das?]] / [[Wie viel kostet der Kuchen?]] — [[Das kostet drei Euro fünfzig.]] (3,50 €). У множині: [[Was kosten die Brötchen?]] Разом: [[Das macht zwölf Euro.]] Ціни пишуть з комою: 3,50 €.</p>
<h3>gern, lieber, am liebsten</h3>
<p>«Люблю щось робити» — це дієслово + <b>gern</b>: [[Ich trinke gern Tee.]] — я люблю чай. [[Ich trinke lieber Kaffee.]] — я більше люблю каву. [[Am liebsten trinke ich Kakao.]] — найбільше люблю какао. [[Ich esse nicht gern Fisch.]] — я не люблю рибу.</p>
<p>[[mögen]] — любити, подобатися: [[ich mag]], [[du magst]], [[er mag]]: [[Ich mag Käse.]] А [[lieben]] — сильне почуття: кохання чи захоплення: [[Ich liebe Pizza!]]</p>
<div class="note">«Я люблю готувати» — [[Ich koche gern.]], а не «Ich liebe kochen».</div>
<h3>Австрія і Швейцарія</h3>
<p>Булочка — [[das Brötchen]] у Німеччині, [[die Semmel]] в Австрії та Баварії, [[das Weggli]] у Швейцарії; круасан у Швейцарії — [[das Gipfeli]]. В Австрії помідори — [[Paradeiser]], картопля — [[Erdäpfel]], кисломолочний сир — [[der Topfen]], вершки — [[das Obers]].</p>`,
  vocab: [['möchten', 'хотіти б', 'ich möchte, du möchtest'], ['Ich hätte gern …', 'Я хотів би … (у кафе, в магазині)'], ['kosten', 'коштувати'], ['Was kostet …?', 'Скільки коштує …?'],
    ['der Euro', 'євро', 'з числом без -s: zwei Euro'], ['der Cent', 'цент', 'fünfzig Cent'], ['bar', 'готівкою'], ['mit Karte', 'карткою'], ['die Rechnung', 'рахунок', 'die Rechnungen'],
    ['zusammen / getrennt', 'разом / окремо'], ['zum Mitnehmen', 'на винос'], ['das Brötchen', 'булочка', 'Австрія, Баварія: die Semmel'], ['der Kuchen', 'пиріг, торт', 'die Kuchen'],
    ['das Stück', 'шматок; штука', 'die Stücke'], ['der Saft', 'сік', 'die Säfte'], ['das Glas', 'склянка, келих; скло', 'die Gläser'], ['die Tasse', 'чашка', 'die Tassen'],
    ['das Ei', 'яйце', 'die Eier'], ['das Fleisch', 'м\'ясо'], ['der Fisch', 'риба', 'die Fische'], ['gern', 'охоче; люблю (+ дієслово)'], ['lieber', 'краще, більше люблю'],
    ['mögen', 'любити, подобатися', 'ich mag, du magst'], ['bekommen', 'отримувати', 'англ. become = werden'], ['Sonst noch etwas?', 'Щось іще?'], ['Das ist alles.', 'Це все.']],
  ex: [
    { t: 'i', q: 'möchten: Ich ___ einen Tee.', a: 'möchte' },
    { t: 'i', q: 'möchten: Was ___ Sie trinken?', a: 'möchten' },
    { t: 'i', q: 'möchten: ___ du auch einen Kaffee?', a: 'Möchtest' },
    { t: 'c', q: 'Як ввічливо замовити каву?', o: ['Ich hätte gern einen Kaffee.', 'Ich will Kaffee!', 'Gib mir Kaffee!'] },
    { t: 'c', q: 'Офіціант питає «Zusammen oder getrennt?». Це про…', o: ['оплату: разом чи окремо', 'столик: разом чи окремо', 'каву: з молоком чи без'] },
    { t: 'c', q: '«Zum Mitnehmen» означає…', o: ['на винос', 'з молоком', 'з собою в рахунок'] },
    { t: 'c', q: 'Як сказати «решти не треба»?', o: ['Stimmt so.', 'Das ist alles.', 'Getrennt, bitte.'] },
    { t: 'c', q: '«Я люблю готувати»', o: ['Ich koche gern.', 'Ich gern koche.', 'Ich habe gern kochen.'] },
    { t: 'c', q: 'Як в Австрії називають булочку?', o: ['die Semmel', 'die Brezel', 'der Kuchen'] },
    { t: 'c', q: '«bekommen» означає…', o: ['отримувати', 'ставати', 'приходити'] },
    { t: 'i', q: 'Ціна 2,20 € словами: zwei Euro ___', a: 'zwanzig' },
    { t: 'i', q: 'mögen: Er ___ keinen Fisch.', a: 'mag' },
    { t: 'o', q: 'Скільки коштує пиріг?', a: 'Was kostet der Kuchen?' },
    { t: 'o', q: 'Рахунок, будь ласка!', a: 'Die Rechnung, bitte!' },
    { t: 'o', q: 'Можна заплатити карткою?', a: 'Kann ich mit Karte zahlen?' },
    { t: 'o', q: 'Олена найбільше любить чай.', a: ['Olena trinkt am liebsten Tee.', 'Am liebsten trinkt Olena Tee.'] },
    { t: 'g', g: 'priceListen', min: 1, max: 20 },
    { t: 'l', a: 'Ich hätte gern zwei Brötchen, bitte.', tr: 'Дайте, будь ласка, дві булочки.' },
    { t: 'l', a: 'Für hier oder zum Mitnehmen?', tr: 'Тут чи на винос?' }
  ],
  say: [['Ich hätte gern einen Cappuccino, bitte.', 'Мені капучино, будь ласка.'], ['Was kostet das?', 'Скільки це коштує?'], ['Kann ich mit Karte zahlen?', 'Можна заплатити карткою?'],
    ['Zusammen oder getrennt? — Getrennt, bitte.', 'Разом чи окремо? — Окремо, будь ласка.'], ['Stimmt so. Schönen Tag noch!', 'Решти не треба. Гарного дня!'],
    ['Ich trinke gern Tee, aber lieber Kaffee.', 'Я люблю чай, але каву більше.']],
  speak: ['Розіграйте вголос діалог у кафе за обох — офіціанта й гостя: привітання, замовлення двох позицій, рахунок, оплата карткою, чайові.',
    'Розкажіть, що ви любите їсти й пити, а що ні: gern, lieber, am liebsten, nicht gern.'],
  mission: 'Купіть щось у пекарні (Bäckerei) чи кав\'ярні лише німецькою: «Ich hätte gern … zum Mitnehmen.» Запитайте «Kann ich mit Karte zahlen?» і попрощайтеся.'
}
);
})(PG.pack('de'));
/* ---- de/data/lessons-a1b.js ---- */
/* A1, частина 2: уроки A1.7–A1.13 */
(function (DE) {
DE.lessons = DE.lessons || [];
DE.lessons.push(
{
  id: 'a1-7', stage: 'a1', num: 'A1.7', title: 'Числа до 1000 і далі, ціни, роки', dur: '1 тиждень',
  goals: ['рахувати до 1000 і далі', 'розуміти ціни на слух і питати про них', 'називати роки: 1991, 2026'],
  theory: `
<div class="tip"><b>🔢 Головна практика цього уроку — тренажер чисел.</b> Голос називає випадкове число, ціну, рік чи час, а ви записуєте цифрами; або навпаки — бачите цифри й пишете словами. Вправи щоразу нові.<br><a class="btn primary small" href="#/drill" style="margin-top:6px">Відкрити тренажер чисел, цін, часу й дат</a></div>
<h3>21–99: спочатку одиниці</h3>
<p>Одиниці називають <b>перед</b> десятками, через «und», і пишуть усе разом: 21 [[einundzwanzig]] («один-і-двадцять»), 35 [[fünfunddreißig]], 47 [[siebenundvierzig]], 99 [[neunundneunzig]].</p>
<div class="note"><b>Найчастіша помилка на слух.</b> Чуєте «achtundvierzig» — спершу звучить 8, а записати треба 48. Порада: коли диктують число, записуйте спершу другу цифру, потім першу.</div>
<h3>Десятки, сотні, тисячі</h3>
<div class="tblwrap"><table>
<tr><td>20 [[zwanzig]]</td><td>30 [[dreißig]]</td><td>40 [[vierzig]]</td><td>50 [[fünfzig]]</td></tr>
<tr><td>60 [[sechzig]]</td><td>70 [[siebzig]]</td><td>80 [[achtzig]]</td><td>90 [[neunzig]]</td></tr>
<tr><td>100 [[hundert]]</td><td>101 [[hunderteins]]</td><td>200 [[zweihundert]]</td><td>345 [[dreihundertfünfundvierzig]]</td></tr>
<tr><td>1000 [[tausend]]</td><td>2026 [[zweitausendsechsundzwanzig]]</td><td>10 000 [[zehntausend]]</td><td>1 000 000 [[eine Million]]</td></tr>
</table></div>
<p class="small muted">30 — dreißig (з ß, без -zig); 60 — sechzig (без s); 70 — siebzig (без -en). Можна казати й [[einhundert]], [[eintausend]]. Числа до мільйона пишуть одним словом.</p>
<p>Тисячі відділяють крапкою або пробілом (1.000), а дробову частину — <b>комою</b>: 2,5 = [[zwei Komma fünf]].</p>
<h3>Роки</h3>
<p>До 2000 року — сотнями: 1989 [[neunzehnhundertneunundachtzig]], 1991 [[neunzehnhunderteinundneunzig]]. З 2000 — як звичайне число: 2014 [[zweitausendvierzehn]], 2022 [[zweitausendzweiundzwanzig]].</p>
<div class="note">Рік кажуть <b>без прийменника</b> або «im Jahr»: [[Ich bin 1990 geboren.]] [[Im Jahr 2022 bin ich nach Deutschland gekommen.]] Англійське «in 2022» — помилка.</div>
<h3>Ціни</h3>
<div class="tblwrap"><table><tr><th>Пишуть</th><th>Кажуть</th></tr>
<tr><td>3,99 €</td><td>[[drei Euro neunundneunzig]]</td></tr>
<tr><td>12,50 €</td><td>[[zwölf Euro fünfzig]]</td></tr>
<tr><td>1,00 €</td><td>[[ein Euro]]</td></tr>
<tr><td>0,80 €</td><td>[[achtzig Cent]]</td></tr>
<tr><td>1,29 € (розмовно)</td><td>[[eins neunundzwanzig]]</td></tr></table></div>
<p>«Euro» з числом не має множини: [[zwanzig Euro]]. У Швейцарії платять франками: [[vier Franken fünfzig]] (1 франк = 100 [[Rappen]]).</p>
<h3>Номер телефону</h3>
<p>Номер часто диктують парами: 0176 48 25 … — [[null eins sieben sechs, achtundvierzig, fünfundzwanzig]]. Якщо не впевнені, попросіть: [[Können Sie die Ziffern bitte einzeln sagen?]] — по одній цифрі.</p>
<h3>У супермаркеті</h3>
<p>[[Das ist zu teuer.]] — Це надто дорого. [[Ist das im Angebot?]] — Це за акцією? [[die Kasse]] — каса, [[der Kassenbon]] — чек: [[Brauchen Sie den Kassenbon?]]</p>
<div class="tip"><b>Pfand.</b> У Німеччині за більшість пляшок і бляшанок платять заставу (Pfand): 0,25 € за одноразові, 0,08–0,15 € за багаторазові. Порожню тару здають в автомат (Pfandautomat), отримують чек (Pfandbon) і показують його на касі.</div>
<div class="note"><b>Фальшивий друг:</b> [[die Dose]] — бляшанка, банка, а не «доза» (доза — die Dosis).</div>`,
  vocab: [['dreißig', 'тридцять', 'з ß, без -zig'], ['vierzig', 'сорок'], ['fünfzig', 'п\'ятдесят'], ['sechzig', 'шістдесят', 'без s: sechzig'], ['siebzig', 'сімдесят', 'без -en: siebzig'],
    ['achtzig', 'вісімдесят'], ['neunzig', 'дев\'яносто'], ['hundert', 'сто'], ['tausend', 'тисяча'], ['die Million', 'мільйон', 'die Millionen'], ['das Komma', 'кома', '2,5 — zwei Komma fünf'],
    ['der Preis', 'ціна', 'die Preise'], ['das Angebot', 'акція; пропозиція', 'die Angebote; im Angebot — за акцією'], ['die Kasse', 'каса', 'die Kassen'],
    ['der Kassenbon', 'чек', 'die Kassenbons'], ['das Pfand', 'застава (за пляшку, бляшанку)'], ['die Flasche', 'пляшка', 'die Flaschen'], ['die Dose', 'бляшанка, банка', 'die Dosen; не «доза»!'],
    ['das Kilo', 'кілограм', 'zwei Kilo'], ['das Gramm', 'грам', 'zweihundert Gramm'], ['die Packung', 'упаковка, пачка', 'die Packungen'], ['zu teuer', 'надто дорого'],
    ['der Franken', 'франк (Швейцарія)', 'zwei Franken'], ['geboren', 'народжений', 'Ich bin 1990 geboren.']],
  ex: [
    { t: 'g', g: 'numListen', min: 20, max: 99 },
    { t: 'g', g: 'numListen', min: 100, max: 999 },
    { t: 'g', g: 'numListen', min: 1000, max: 9999 },
    { t: 'g', g: 'yearListen', min: 1950, max: 2030 },
    { t: 'g', g: 'priceListen', min: 1, max: 99 },
    { t: 'g', g: 'numWords', min: 20, max: 99 },
    { t: 'g', g: 'numWords', min: 100, max: 999 },
    { t: 'c', q: '47 — як правильно?', o: ['siebenundvierzig', 'vierzigsieben', 'vierundsiebzig'] },
    { t: 'c', q: 'Як називають рік 1989?', o: ['neunzehnhundertneunundachtzig', 'eintausendneunhundertneunundachtzig', 'neunzehnachtzig'] },
    { t: 'c', q: '«у 2022 році»', o: ['im Jahr 2022', 'in 2022', 'am 2022'] },
    { t: 'c', q: '0,80 € — як кажуть?', o: ['achtzig Cent', 'achtzig Euro', 'null Euro acht'] },
    { t: 'c', q: '«die Dose» — це…', o: ['бляшанка, банка', 'доза', 'дошка'] },
    { t: 'i', q: 'Напишіть словами: <b>30</b>', a: 'dreißig' },
    { t: 'i', q: 'Напишіть словами: <b>70</b>', a: 'siebzig' },
    { t: 'o', q: 'Скільки коштують яблука?', a: 'Was kosten die Äpfel?' },
    { t: 'l', a: 'Das macht dreiundzwanzig Euro vierzig.', tr: 'Разом 23,40 €.' },
    { t: 'l', a: 'Brauchen Sie den Kassenbon?', tr: 'Вам потрібен чек?' }
  ],
  say: [['Was kostet das? — Drei Euro neunundneunzig.', 'Скільки це коштує? — 3,99 €.'], ['Das ist zu teuer.', 'Це надто дорого.'],
    ['Ich bin neunzehnhundertneunzig geboren.', 'Я народився / народилася 1990 року.'],
    ['Meine Nummer ist null eins sieben sechs, achtundvierzig, fünfundzwanzig.', 'Мій номер: 0176 48 25.'], ['Brauchen Sie den Kassenbon? — Nein, danke.', 'Вам потрібен чек? — Ні, дякую.']],
  speak: ['Візьміть чек або рекламний проспект (Prospekt) супермаркету й назвіть уголос 10 цін: «Milch — eins neunundzwanzig…»',
    'Скажіть уголос рік свого народження й народження рідних, рік переїзду і свій номер телефону парами цифр.'],
  mission: 'У супермаркеті здайте пляшки в Pfandautomat і візьміть Pfandbon. На касі слухайте, яку суму називає касир, і порівняйте з табло. Якщо пляшок немає — прочитайте вголос 10 цін із проспекту.'
},
{
  id: 'a1-8', stage: 'a1', num: 'A1.8', title: 'Котра година? Дні тижня, розпорядок дня, aufstehen', dur: '1 тиждень',
  goals: ['казати й розуміти час офіційно (14:30) і розмовно (halb drei)', 'називати дні тижня й частини дня', 'вживати дієслова з відокремлюваним префіксом: Ich stehe um sieben auf'],
  theory: `
<h3>Котра година?</h3>
<p>[[Wie spät ist es?]] / [[Wie viel Uhr ist es?]] — Котра година? [[Um wie viel Uhr?]] / [[Wann?]] — О котрій? — [[Um acht Uhr.]]</p>
<p><b>Офіційно</b> (вокзал, радіо, запис до лікаря) — 24 години: 14:30 [[vierzehn Uhr dreißig]], 8:05 [[acht Uhr fünf]], 20:15 [[zwanzig Uhr fünfzehn]].</p>
<p><b>Розмовно</b> — 12 годин:</p>
<div class="tblwrap"><table><tr><th>Час</th><th>Кажуть</th><th>Час</th><th>Кажуть</th></tr>
<tr><td>3:00</td><td>[[drei Uhr]]</td><td>3:30</td><td>[[halb vier]]</td></tr>
<tr><td>3:05</td><td>[[fünf nach drei]]</td><td>3:35</td><td>[[fünf nach halb vier]]</td></tr>
<tr><td>3:15</td><td>[[Viertel nach drei]]</td><td>3:40</td><td>[[zwanzig vor vier]]</td></tr>
<tr><td>3:20</td><td>[[zwanzig nach drei]]</td><td>3:45</td><td>[[Viertel vor vier]]</td></tr>
<tr><td>3:25</td><td>[[fünf vor halb vier]]</td><td>3:50</td><td>[[zehn vor vier]]</td></tr></table></div>
<div class="good"><b>halb vier = 3:30</b> — так само, як українське «пів на четверту». Не 4:30!</div>
<div class="note">На сході Німеччини, у Баварії та Австрії також кажуть [[Viertel vier]] (3:15) і [[drei viertel vier]] (3:45) — як «чверть на четверту» і «за чверть четверта».</div>
<h3>Частини дня</h3>
<p>[[der Morgen]] — ранок, [[der Vormittag]] — до обіду, [[der Mittag]] — полудень, [[der Nachmittag]] — після обіду, [[der Abend]] — вечір, [[die Nacht]] — ніч. Регулярно: [[morgens]], [[vormittags]], [[mittags]], [[nachmittags]], [[abends]], [[nachts]]. Сьогодні ввечері — [[heute Abend]], завтра вранці — [[morgen früh]].</p>
<div class="note">[[morgen]] з малої — «завтра», [[der Morgen]] з великої — «ранок».</div>
<h3>Дні тижня</h3>
<p>[[der Montag]], [[der Dienstag]], [[der Mittwoch]], [[der Donnerstag]], [[der Freitag]], [[der Samstag]] (на півночі й сході Німеччини також [[der Sonnabend]]), [[der Sonntag]] — усі чоловічого роду. Коли? [[am Montag]] — у понеділок, [[montags]] — щопонеділка, [[am Wochenende]] — на вихідних.</p>
<h3>Дієслова з відокремлюваним префіксом</h3>
<p>У дієсловах [[aufstehen]], [[einkaufen]], [[anfangen]], [[anrufen]] префікс у реченні <b>відривається й іде в кінець</b>, а дієслово стоїть на другому місці:</p>
<div class="tblwrap"><table><tr><th>1</th><th>2 — дієслово</th><th>середина</th><th>кінець — префікс</th></tr>
<tr><td>Ich</td><td><b>stehe</b></td><td>um sieben Uhr</td><td><b>auf</b>.</td></tr>
<tr><td>Am Samstag</td><td><b>kaufe</b></td><td>ich</td><td><b>ein</b>.</td></tr>
<tr><td>Der Kurs</td><td><b>fängt</b></td><td>um neun Uhr</td><td><b>an</b>.</td></tr></table></div>
<p>[[Ich stehe um sieben Uhr auf.]] [[Am Samstag kaufe ich ein.]] [[Der Kurs fängt um neun Uhr an.]] [[Ich rufe dich an.]] [[Kommst du mit?]] [[Abends sehe ich fern.]] Ще: [[aufhören]] — закінчувати, [[aufräumen]] — прибирати.</p>
<p>Наголос — на префіксі: <b>AUF</b>stehen, <b>EIN</b>kaufen. А префікси be-, ver-, ent-, er-, ge-, zer-, emp- не відокремлюються: [[Ich verstehe.]] [[Ich bezahle.]]</p>
<h3>Мій день</h3>
<p>[[Ich stehe um halb sieben auf. Ich frühstücke und fahre zur Arbeit. Mittags esse ich in der Kantine. Um fünf Uhr kaufe ich ein. Abends koche ich und sehe fern.]]</p>`,
  vocab: [['Wie spät ist es?', 'Котра година?'], ['halb', 'пів', 'halb drei — 2:30'], ['das Viertel', 'чверть', 'Viertel nach / vor'], ['nach / vor', 'після / до (про час)', 'fünf nach drei, zehn vor vier'],
    ['der Montag', 'понеділок'], ['der Dienstag', 'вівторок'], ['der Mittwoch', 'середа', 'чоловічий рід!'], ['der Donnerstag', 'четвер'], ['der Freitag', 'п\'ятниця'],
    ['der Samstag', 'субота', 'на півночі й сході Німеччини також der Sonnabend'], ['der Sonntag', 'неділя'], ['das Wochenende', 'вихідні', 'am Wochenende — на вихідних'],
    ['der Morgen', 'ранок', 'morgens — вранці'], ['der Abend', 'вечір', 'abends — увечері'], ['aufstehen', 'вставати', 'ich stehe auf'], ['einkaufen', 'робити покупки', 'ich kaufe ein'],
    ['anfangen', 'починати(ся)', 'er fängt an'], ['anrufen', 'дзвонити (комусь)', 'ich rufe dich an'], ['mitkommen', 'іти разом', 'Kommst du mit?'], ['fernsehen', 'дивитися телевізор', 'er sieht fern'],
    ['frühstücken', 'снідати'], ['das Mittagessen', 'обід', 'die Mittagessen'], ['das Abendessen', 'вечеря'], ['früh / spät', 'рано / пізно']],
  ex: [
    { t: 'g', g: 'clockListen' },
    { t: 'g', g: 'clockListen' },
    { t: 'g', g: 'timeListen' },
    { t: 'g', g: 'clockWords' },
    { t: 'c', q: '«halb drei» — це…', o: ['2:30', '3:30', '2:15'], e: '«halb» — половина <b>наступної</b> години, як «пів на третю».' },
    { t: 'c', q: '7:45 розмовно:', o: ['Viertel vor acht', 'Viertel nach acht', 'drei viertel sieben'] },
    { t: 'c', q: '14:30 на вокзалі (офіційно):', o: ['vierzehn Uhr dreißig', 'halb vierzehn', 'dreißig nach vierzehn'] },
    { t: 'c', q: '«у середу»', o: ['am Mittwoch', 'im Mittwoch', 'um Mittwoch'] },
    { t: 'c', q: 'Де правильно стоїть «auf»?', o: ['Ich stehe um sieben Uhr auf.', 'Ich aufstehe um sieben Uhr.', 'Ich stehe auf um sieben Uhr.'] },
    { t: 'i', q: 'anrufen: Ich ___ dich heute Abend an.', a: 'rufe' },
    { t: 'i', q: 'aufstehen: Wann ___ du auf?', a: 'stehst' },
    { t: 'i', q: 'anfangen: Der Kurs ___ um neun Uhr an.', a: 'fängt' },
    { t: 'o', q: 'Марія робить покупки в суботу.', a: ['Maria kauft am Samstag ein.', 'Am Samstag kauft Maria ein.'] },
    { t: 'o', q: 'Ти підеш з нами?', a: 'Kommst du mit?' },
    { t: 'o', q: 'Пан Бауер увечері дивиться телевізор.', a: ['Herr Bauer sieht abends fern.', 'Abends sieht Herr Bauer fern.'] },
    { t: 'l', a: 'Der Supermarkt ist von acht bis zwanzig Uhr geöffnet.', tr: 'Супермаркет працює з 8:00 до 20:00.' },
    { t: 'l', a: 'Ich stehe jeden Tag um sechs Uhr auf.', tr: 'Я щодня встаю о шостій.' }
  ],
  say: [['Wie spät ist es? — Es ist halb drei.', 'Котра година? — Пів на третю.'], ['Um wie viel Uhr fängt der Kurs an?', 'О котрій починається курс?'],
    ['Ich stehe um sieben Uhr auf.', 'Я встаю о сьомій.'], ['Am Samstag kaufe ich ein.', 'У суботу я роблю покупки.'], ['Hast du am Freitag Zeit?', 'У тебе є час у п\'ятницю?']],
  speak: ['Опишіть свій звичайний день від ранку до вечора з часом: «Ich stehe um halb sieben auf. Um sieben frühstücke ich…» — щонайменше 4 дієслова з префіксом.',
    'Кілька разів за день скажіть уголос, котра година, двома способами: офіційно й розмовно.'],
  mission: 'Знайдіть години роботи (Öffnungszeiten) пекарні, аптеки чи Bürgeramt поруч і прочитайте їх уголос. Домовтеся з кимось про зустріч: «Hast du am Freitag um halb fünf Zeit?»'
},
{
  id: 'a1-9', stage: 'a1', num: 'A1.9', title: 'Модальні дієслова: können, müssen, wollen, dürfen, möchten', dur: '1 тиждень',
  goals: ['відмінювати модальні дієслова', 'будувати рамку: модальне дієслово другим, інфінітив у кінці', 'просити дозволу, говорити про вміння й обов\'язки'],
  theory: `
<div class="tblwrap"><table><tr><th></th><th>können<br><span class="small muted">могти, вміти</span></th><th>müssen<br><span class="small muted">мусити</span></th><th>wollen<br><span class="small muted">хотіти</span></th><th>dürfen<br><span class="small muted">мати дозвіл</span></th><th>möchten<br><span class="small muted">хотіти б</span></th></tr>
<tr><td>ich</td><td>[[kann]]</td><td>[[muss]]</td><td>[[will]]</td><td>[[darf]]</td><td>[[möchte]]</td></tr>
<tr><td>du</td><td>[[kannst]]</td><td>[[musst]]</td><td>[[willst]]</td><td>[[darfst]]</td><td>[[möchtest]]</td></tr>
<tr><td>er / sie / es</td><td>[[kann]]</td><td>[[muss]]</td><td>[[will]]</td><td>[[darf]]</td><td>[[möchte]]</td></tr>
<tr><td>wir</td><td>[[können]]</td><td>[[müssen]]</td><td>[[wollen]]</td><td>[[dürfen]]</td><td>[[möchten]]</td></tr>
<tr><td>ihr</td><td>[[könnt]]</td><td>[[müsst]]</td><td>[[wollt]]</td><td>[[dürft]]</td><td>[[möchtet]]</td></tr>
<tr><td>sie / Sie</td><td>[[können]]</td><td>[[müssen]]</td><td>[[wollen]]</td><td>[[dürfen]]</td><td>[[möchten]]</td></tr></table></div>
<p class="small muted">Форми ich і er однакові й без -t: ich kann, er kann.</p>
<h3>Рамка речення</h3>
<p>Модальне дієслово стоїть <b>другим</b>, а інфінітив — <b>у самому кінці</b>: [[Ich kann gut kochen.]] [[Heute muss ich lange arbeiten.]] [[Kannst du mir helfen?]] [[Wann müssen wir da sein?]]</p>
<h3>Що яке дієслово означає</h3>
<div class="tblwrap"><table><tr><th>Дієслово</th><th>Значення</th><th>Приклади</th></tr>
<tr><td>können</td><td>уміння, можливість</td><td>[[Ich kann schwimmen.]] [[Kann ich hier parken?]] Мова — без інфінітива: [[Ich kann Deutsch.]] — я знаю німецьку.</td></tr>
<tr><td>müssen</td><td>обов'язок, необхідність</td><td>[[Ich muss heute arbeiten.]] [[Ich muss zum Arzt.]] — мені треба до лікаря.</td></tr>
<tr><td>dürfen</td><td>дозвіл, заборона</td><td>[[Darf ich hier rauchen?]] — [[Nein, hier darf man nicht rauchen.]]</td></tr>
<tr><td>wollen</td><td>тверде бажання, план</td><td>[[Ich will Deutsch lernen.]] [[Wir wollen im Sommer nach Wien fahren.]]</td></tr>
<tr><td>möchten</td><td>ввічливе бажання</td><td>[[Ich möchte einen Termin machen.]]</td></tr></table></div>
<div class="note"><b>Головна пастка: nicht müssen ≠ «не можна».</b> [[Sie müssen nicht warten.]] — вам <b>не треба</b> чекати. «Не можна» — це <b>nicht dürfen</b>: [[Hier dürfen Sie nicht parken.]] — тут паркуватися заборонено.</div>
<p><b>man</b> — «люди загалом»: [[Hier darf man nicht parken.]] — тут не можна паркуватися. [[Wie sagt man das auf Deutsch?]] — Як це сказати німецькою?</p>
<h3>Ввічливі прохання</h3>
<p>[[Können Sie mir bitte helfen?]] — Чи можете ви мені допомогти? Ще ввічливіше: [[Könnten Sie das bitte wiederholen?]] (цю форму докладно вчитимемо на A2). [[Darf ich?]] — Можна? [[Darf ich kurz stören?]] — Можна вас на хвилинку?</p>
<div class="tip"><b>sollen</b> — «маю, слід» за чиїмось словом: [[Der Arzt sagt, ich soll viel trinken.]] — Лікар каже, що мені слід багато пити.</div>`,
  vocab: [['können', 'могти, вміти', 'ich kann, du kannst'], ['müssen', 'мусити, треба', 'ich muss, du musst'], ['wollen', 'хотіти', 'ich will, du willst'], ['dürfen', 'мати дозвіл; можна', 'ich darf, du darfst'],
    ['sollen', 'бути повинним (за чиїмось словом)', 'ich soll, du sollst'], ['man', 'безособове «люди»: man darf — можна'], ['schwimmen', 'плавати'], ['parken', 'паркувати(ся)'],
    ['rauchen', 'курити'], ['warten', 'чекати', 'du wartest, er wartet'], ['bezahlen', 'оплачувати, платити'], ['ausfüllen', 'заповнювати (формуляр)', 'ich fülle aus'],
    ['unterschreiben', 'підписувати'], ['das Formular', 'бланк, формуляр', 'die Formulare'], ['erlaubt', 'дозволено'], ['verboten', 'заборонено'], ['leider', 'на жаль'],
    ['natürlich', 'звичайно'], ['vielleicht', 'можливо'], ['die Hausaufgabe', 'домашнє завдання', 'die Hausaufgaben'], ['die Pause', 'перерва', 'die Pausen'], ['wiederholen', 'повторювати']],
  ex: [
    { t: 'i', q: 'können: ___ du schwimmen?', a: 'Kannst' },
    { t: 'i', q: 'müssen: Ich ___ heute arbeiten.', a: 'muss' },
    { t: 'i', q: 'dürfen: Hier ___ man nicht rauchen.', a: 'darf' },
    { t: 'i', q: 'wollen: Wir ___ nach Wien fahren.', a: 'wollen' },
    { t: 'i', q: 'können: Er ___ gut kochen.', a: 'kann' },
    { t: 'i', q: 'müssen: Ihr ___ das Formular ausfüllen.', a: 'müsst' },
    { t: 'c', q: '«Вам не треба чекати»', o: ['Sie müssen nicht warten.', 'Sie dürfen nicht warten.', 'Sie wollen nicht warten.'] },
    { t: 'c', q: '«Тут не можна паркуватися»', o: ['Hier darf man nicht parken.', 'Hier muss man nicht parken.', 'Hier will man nicht parken.'], e: '«Не можна» — nicht dürfen; nicht müssen — «не треба».' },
    { t: 'c', q: 'Ввічливе прохання в установі:', o: ['Können Sie mir bitte helfen?', 'Sie müssen mir helfen!', 'Ich will Hilfe!'] },
    { t: 'c', q: 'Яке речення правильне?', o: ['Ich muss heute lange arbeiten.', 'Ich muss arbeiten heute lange.', 'Ich heute muss lange arbeiten.'] },
    { t: 'c', q: '«Ich kann Deutsch» означає…', o: ['я знаю німецьку', 'мені дозволено німецьку', 'я мушу вчити німецьку'] },
    { t: 'o', q: 'Можна мені тут припаркуватися?', a: 'Darf ich hier parken?' },
    { t: 'o', q: 'Чи можете ви це повторити, будь ласка?', a: 'Können Sie das bitte wiederholen?' },
    { t: 'o', q: 'Олег сьогодні мусить заповнити формуляр.', a: ['Oleh muss heute das Formular ausfüllen.', 'Heute muss Oleh das Formular ausfüllen.'] },
    { t: 'i', q: '«Як це сказати німецькою?» — Wie sagt ___ das auf Deutsch?', a: 'man' },
    { t: 'l', a: 'Können Sie bitte langsamer sprechen?', tr: 'Чи можете ви говорити повільніше?' },
    { t: 'l', a: 'Ich muss leider schon gehen.', tr: 'На жаль, мені вже треба йти.' }
  ],
  say: [['Können Sie mir bitte helfen?', 'Чи можете ви мені допомогти?'], ['Darf ich hier parken?', 'Можна мені тут припаркуватися?'], ['Ich muss heute lange arbeiten.', 'Сьогодні мені доведеться довго працювати.'],
    ['Sie müssen nicht warten.', 'Вам не треба чекати.'], ['Ich will im Sommer in die Ukraine fahren.', 'Улітку я хочу поїхати в Україну.'], ['Wie sagt man das auf Deutsch?', 'Як це сказати німецькою?']],
  speak: ['Розкажіть, що ви вмієте (kann), що мусите зробити цього тижня (muss) і чого хочете (will / möchte) — по 3 речення.',
    'Попросіть дозволу трьома способами: Darf ich…? Kann ich…? Können Sie…?'],
  mission: 'В установі, у лікаря чи на курсі поставте ввічливе питання з модальним дієсловом: «Können Sie das bitte wiederholen?», «Muss ich das Formular ausfüllen?» або «Darf ich hier warten?»'
},
{
  id: 'a1-10', stage: 'a1', num: 'A1.10', title: 'Місто й дорога: Dativ, wo? і wohin?', dur: '1 тиждень',
  goals: ['вживати Dativ після mit, zu, bei, von, aus, nach, seit', 'розрізняти wo? (Dativ) і wohin? (Akkusativ) з in, an, auf', 'питати дорогу й пояснювати її'],
  theory: `
<h3>Dativ: кому? де? з чим?</h3>
<div class="tblwrap"><table><tr><th></th><th>ч. р.</th><th>ж. р.</th><th>с. р.</th><th>множина</th></tr>
<tr><td>Nominativ</td><td>der / ein</td><td>die / eine</td><td>das / ein</td><td>die / —</td></tr>
<tr><td>Dativ</td><td><b>dem / einem</b></td><td><b>der / einer</b></td><td><b>dem / einem</b></td><td><b>den</b> + -n</td></tr></table></div>
<p>Так само змінюються kein і mein: [[mit meinem Bruder]], [[bei meiner Schwester]], [[mit den Kindern]].</p>
<p>Злиття прийменника з артиклем: [[zum]] = zu dem, [[zur]] = zu der, [[beim]] = bei dem, [[vom]] = von dem, [[im]] = in dem, [[am]] = an dem.</p>
<h3>Завжди з Dativ: aus, bei, mit, nach, seit, von, zu</h3>
<div class="tblwrap"><table><tr><th>Прийменник</th><th>Приклади</th></tr>
<tr><td><b>mit</b> — з, транспортом</td><td>[[mit dem Bus]], [[mit der U-Bahn]], [[mit dem Fahrrad]]; але пішки — [[zu Fuß]]</td></tr>
<tr><td><b>zu</b> — до (людини, установи)</td><td>[[zum Arzt]], [[zur Arbeit]], [[zum Bahnhof]], [[zur Post]]</td></tr>
<tr><td><b>bei</b> — у когось, на (роботі)</td><td>[[beim Arzt]], [[bei der Arbeit]], [[bei meiner Schwester]]</td></tr>
<tr><td><b>von</b> — від; <b>aus</b> — з (зсередини)</td><td>[[vom Bahnhof]], [[aus dem Haus]]</td></tr>
<tr><td><b>nach</b> — до міста й країни без артикля</td><td>[[nach Berlin]], [[nach Österreich]]; але [[in die Schweiz]], [[in die Ukraine]]</td></tr></table></div>
<div class="note"><b>Додому чи вдома?</b> [[nach Hause]] — додому (куди?), [[zu Hause]] — вдома (де?). [[Ich gehe nach Hause.]] [[Ich bin zu Hause.]]</div>
<h3>wo? чи wohin?</h3>
<p>Прийменники <b>in, an, auf</b> (а також unter, über, vor, hinter, neben, zwischen) вимагають Dativ на питання <b>wo?</b> (де?) і Akkusativ на питання <b>wohin?</b> (куди?):</p>
<div class="tblwrap"><table><tr><th>wo? — Dativ</th><th>wohin? — Akkusativ</th></tr>
<tr><td>[[Ich bin im Park.]]</td><td>[[Ich gehe in den Park.]]</td></tr>
<tr><td>[[Ich wohne in der Stadt.]]</td><td>[[Ich fahre in die Stadt.]]</td></tr>
<tr><td>[[Das Buch liegt auf dem Tisch.]]</td><td>[[Ich lege das Buch auf den Tisch.]]</td></tr></table></div>
<div class="good">Логіка та сама, що в українській: «у парк<b>у</b>» (де?) — «у парк» (куди?). Німецька лише показує це артиклем: im Park — in den Park.</div>
<h3>Як пройти?</h3>
<p>[[Entschuldigung, wie komme ich zum Bahnhof?]] — [[Gehen Sie geradeaus.]] [[Dann links.]] / [[Dann rechts.]] [[An der Ampel gehen Sie rechts.]] [[Nehmen Sie die zweite Straße links.]] [[Ist das weit?]] — [[Nein, nur fünf Minuten zu Fuß.]]</p>
<p>У транспорті: [[Wo ist die Haltestelle?]] [[Fährt dieser Bus zum Hauptbahnhof?]] [[Wo muss ich aussteigen?]] [[Wo muss ich umsteigen?]]</p>
<div class="tip"><b>Транспорт:</b> [[die U-Bahn]] — метро, [[die S-Bahn]] — міська електричка, [[die Straßenbahn]] — трамвай (у Швейцарії [[das Tram]], у Відні розмовно [[die Bim]]), [[der Zug]] — потяг. Квиток — [[die Fahrkarte]] (в Австрії [[der Fahrschein]], у Швейцарії [[das Billett]]). У Німеччині є [[das Deutschlandticket]] — місячний проїзний на весь місцевий і регіональний транспорт країни.</div>`,
  vocab: [['mit', 'з; транспортом (+ Dativ)', 'mit dem Bus'], ['zu', 'до (+ Dativ)', 'zum Arzt, zur Post'], ['bei', 'у когось; на (+ Dativ)', 'beim Arzt, bei der Arbeit'], ['von', 'від; з (+ Dativ)', 'vom Bahnhof'],
    ['nach Hause', 'додому'], ['zu Hause', 'вдома'], ['der Bahnhof', 'вокзал', 'die Bahnhöfe; der Hauptbahnhof — головний вокзал'], ['die Haltestelle', 'зупинка', 'die Haltestellen'],
    ['die U-Bahn', 'метро'], ['die S-Bahn', 'міська електричка'], ['die Straßenbahn', 'трамвай', 'Швейцарія: das Tram; Відень: die Bim'], ['der Zug', 'потяг', 'die Züge'],
    ['die Fahrkarte', 'квиток', 'Австрія: der Fahrschein; Швейцарія: das Billett'], ['umsteigen', 'робити пересадку', 'ich steige um'], ['aussteigen', 'виходити (з транспорту)', 'ich steige aus'],
    ['geradeaus', 'прямо'], ['links', 'ліворуч'], ['rechts', 'праворуч'], ['die Ampel', 'світлофор', 'die Ampeln'], ['die Kreuzung', 'перехрестя', 'die Kreuzungen'], ['weit', 'далеко'],
    ['in der Nähe', 'поблизу'], ['die Post', 'пошта'], ['die Apotheke', 'аптека', 'die Apotheken'], ['gehen', 'іти (пішки)']],
  ex: [
    { t: 'i', q: 'Dativ: Ich fahre mit ___ Bus. (der)', a: 'dem' },
    { t: 'i', q: 'Dativ: Ich fahre mit ___ U-Bahn. (die)', a: 'der' },
    { t: 'i', q: 'zu + dem: Wir gehen ___ Arzt.', a: 'zum' },
    { t: 'i', q: 'zu + der: Sie geht ___ Arbeit.', a: 'zur' },
    { t: 'i', q: 'bei + dem: Ich bin ___ Arzt.', a: 'beim' },
    { t: 'c', q: '«вдома»', o: ['zu Hause', 'nach Hause', 'zum Hause'] },
    { t: 'c', q: '«Я йду додому»', o: ['Ich gehe nach Hause.', 'Ich gehe zu Hause.', 'Ich gehe in Hause.'] },
    { t: 'c', q: 'Wo? «Я в парку»', o: ['Ich bin im Park.', 'Ich bin in den Park.', 'Ich bin in dem Parks.'] },
    { t: 'c', q: 'Wohin? «Я йду в парк»', o: ['Ich gehe in den Park.', 'Ich gehe in der Park.', 'Ich gehe zu Park.'] },
    { t: 'c', q: 'Wohin? Ich lege das Handy auf ___ Tisch.', o: ['den', 'dem', 'der'] },
    { t: 'c', q: 'Wo? Das Handy liegt auf ___ Tisch.', o: ['dem', 'den', 'der'] },
    { t: 'c', q: '«Їдьте прямо, потім ліворуч»', o: ['Fahren Sie geradeaus, dann links.', 'Fahren Sie rechts, dann geradeaus.', 'Fahren Sie links, dann rechts.'] },
    { t: 'o', q: 'Як мені дістатися до вокзалу?', a: 'Wie komme ich zum Bahnhof?' },
    { t: 'o', q: 'Де мені виходити?', a: 'Wo muss ich aussteigen?' },
    { t: 'o', q: 'Ірина їде на роботу трамваєм.', a: ['Iryna fährt mit der Straßenbahn zur Arbeit.', 'Mit der Straßenbahn fährt Iryna zur Arbeit.'] },
    { t: 'l', a: 'Die Apotheke ist gleich hier in der Nähe.', tr: 'Аптека зовсім поруч.' },
    { t: 'l', a: 'An der Ampel gehen Sie rechts.', tr: 'На світлофорі поверніть праворуч.' }
  ],
  say: [['Entschuldigung, wie komme ich zum Bahnhof?', 'Перепрошую, як дістатися до вокзалу?'], ['Gehen Sie geradeaus und dann die zweite Straße links.', 'Ідіть прямо, а потім друга вулиця ліворуч.'],
    ['Ich fahre mit der U-Bahn zur Arbeit.', 'Я їжджу на роботу метро.'], ['Wo muss ich umsteigen?', 'Де мені робити пересадку?'], ['Ich bin zu Hause. — Ich gehe nach Hause.', 'Я вдома. — Я йду додому.']],
  speak: ['Опишіть свій шлях від дому до роботи чи курсу: «Ich gehe zu Fuß zur Haltestelle, dann fahre ich mit der U-Bahn…»',
    'Поясніть уявному туристові, як дійти від вашого дому до найближчої аптеки чи супермаркету.'],
  mission: 'Запитайте дорогу німецькою в місті чи на вокзалі («Entschuldigung, wo ist die Haltestelle …?», «Wo muss ich umsteigen?»), навіть якщо маєте навігатор. Або купіть квиток в автоматі, вибравши німецьку мову меню.'
},
{
  id: 'a1-11', stage: 'a1', num: 'A1.11', title: 'Perfekt: ich habe gemacht, ich bin gefahren', dur: '1 тиждень',
  goals: ['утворювати Perfekt: haben / sein + Partizip II', 'вибирати haben чи sein', 'розповідати, що ви робили вчора й на вихідних'],
  theory: `
<p><b>Perfekt</b> — головний минулий час у розмові. Допоміжне дієслово (haben або sein) стоїть <b>другим</b>, а Partizip II — <b>у кінці</b>: [[Ich habe gestern gearbeitet.]] [[Ich bin nach Berlin gefahren.]]</p>
<div class="good">В українській теж один минулий час. А виду (робив / зробив) у німецькій немає: «я читав» і «я прочитав» — однаково [[Ich habe gelesen.]]</div>
<h3>Partizip II</h3>
<div class="tblwrap"><table><tr><th>Тип</th><th>Як утворюється</th><th>Приклади</th></tr>
<tr><td>слабкі (правильні)</td><td><b>ge-</b> + основа + <b>-t</b></td><td>[[machen]] → [[gemacht]], [[kaufen]] → [[gekauft]], [[wohnen]] → [[gewohnt]], [[arbeiten]] → [[gearbeitet]]</td></tr>
<tr><td>сильні</td><td><b>ge-</b> + основа (часто змінена) + <b>-en</b></td><td>[[fahren]] → [[gefahren]], [[sehen]] → [[gesehen]], [[essen]] → [[gegessen]], [[trinken]] → [[getrunken]], [[schreiben]] → [[geschrieben]], [[gehen]] → [[gegangen]]</td></tr>
<tr><td>відокремлюваний префікс</td><td>ge- <b>всередині</b></td><td>[[einkaufen]] → [[eingekauft]], [[aufstehen]] → [[aufgestanden]], [[anrufen]] → [[angerufen]], [[fernsehen]] → [[ferngesehen]]</td></tr>
<tr><td>be-, ver-, er-, ent-… і -ieren</td><td><b>без ge-</b></td><td>[[bezahlen]] → [[bezahlt]], [[verstehen]] → [[verstanden]], [[besuchen]] → [[besucht]], [[telefonieren]] → [[telefoniert]]</td></tr></table></div>
<p>Сильні дієслова вчіть разом з Partizip II: [[nehmen — genommen]], [[sprechen — gesprochen]], [[schlafen — geschlafen]], [[kommen — gekommen]], [[finden — gefunden]], [[helfen — geholfen]], [[bleiben — geblieben]], [[lesen — gelesen]].</p>
<h3>haben чи sein?</h3>
<p>Більшість дієслів — з <b>haben</b>. З <b>sein</b> — дієслова руху з місця на місце (gehen, fahren, kommen, fliegen, laufen, umziehen), зміни стану (aufstehen) і ще sein, bleiben, passieren:</p>
<p>[[Ich bin gestern früh aufgestanden.]] [[Wir sind zu Hause geblieben.]] [[Was ist passiert?]] [[Ich habe Pizza gegessen.]] [[Wir haben einen Film gesehen.]]</p>
<h3>war і hatte</h3>
<p>Про минуле з sein і haben у розмові частіше кажуть коротко: [[Ich war gestern beim Arzt.]] — Учора я був у лікаря. [[Ich hatte keine Zeit.]] — У мене не було часу. Форми: ich war, du warst, er war, wir waren; ich hatte, du hattest, er hatte, wir hatten.</p>
<p class="small muted">У південній Німеччині, Австрії та Швейцарії й тут часто вживають Perfekt: «ich bin gewesen», «ich habe gehabt».</p>
<h3>Коли?</h3>
<p>[[gestern]] — учора, [[vorgestern]] — позавчора, [[letzte Woche]] — минулого тижня, [[letztes Jahr]] — минулого року, [[vor zwei Jahren]] — два роки тому.</p>
<div class="note"><b>seit + теперішній час.</b> «Я живу в Німеччині з 2022 року» (і досі живу) — [[Ich wohne seit 2022 in Deutschland.]] Тут Perfekt не потрібен.</div>
<p>[[Am Samstag bin ich um neun aufgestanden. Ich habe gefrühstückt und eingekauft. Am Nachmittag habe ich meine Freundin getroffen. Wir sind spazieren gegangen. Am Abend habe ich ferngesehen.]]</p>`,
  vocab: [['gestern', 'учора'], ['vorgestern', 'позавчора'], ['letzte Woche', 'минулого тижня'], ['letztes Jahr', 'минулого року'], ['vor zwei Jahren', 'два роки тому'],
    ['seit', 'з (якогось часу і досі)', 'seit 2022, seit drei Jahren'], ['schreiben', 'писати', 'hat geschrieben'], ['bleiben', 'залишатися', 'ist geblieben'], ['besuchen', 'відвідувати', 'hat besucht'],
    ['fliegen', 'летіти', 'ist geflogen'], ['laufen', 'бігти; іти пішки', 'du läufst; ist gelaufen'], ['passieren', 'траплятися', 'ist passiert'], ['umziehen', 'переїжджати', 'ist umgezogen'],
    ['treffen', 'зустрічати(ся)', 'du triffst; hat getroffen'], ['war', 'був, була (від sein)', 'ich war, wir waren'], ['hatte', 'мав, мала (від haben)', 'ich hatte, wir hatten'],
    ['der Urlaub', 'відпустка', 'die Urlaube'], ['die Reise', 'подорож', 'die Reisen'], ['der Ausflug', 'поїздка на день, екскурсія', 'die Ausflüge'], ['das Wetter', 'погода'],
    ['der Film', 'фільм', 'die Filme'], ['der Freund / die Freundin', 'друг / подруга; хлопець / дівчина'], ['spazieren gehen', 'гуляти', 'ist spazieren gegangen'],
    ['telefonieren', 'розмовляти по телефону', 'hat telefoniert']],
  ex: [
    { t: 'i', q: 'Partizip II: machen → hat ___', a: 'gemacht' },
    { t: 'i', q: 'Partizip II: arbeiten → hat ___', a: 'gearbeitet' },
    { t: 'i', q: 'Partizip II: fahren → ist ___', a: 'gefahren' },
    { t: 'i', q: 'Partizip II: einkaufen → hat ___', a: 'eingekauft' },
    { t: 'i', q: 'Partizip II: verstehen → hat ___', a: 'verstanden' },
    { t: 'i', q: 'Partizip II: telefonieren → hat ___', a: 'telefoniert' },
    { t: 'i', q: 'haben чи sein? Wir ___ nach Wien gefahren.', a: 'sind' },
    { t: 'i', q: 'haben чи sein? Ich ___ einen Film gesehen.', a: 'habe' },
    { t: 'i', q: 'haben чи sein? Er ___ gestern um sechs aufgestanden.', a: 'ist' },
    { t: 'c', q: '«Учора я був у лікаря»', o: ['Gestern war ich beim Arzt.', 'Gestern ich war beim Arzt.', 'Gestern habe ich beim Arzt gewesen.'] },
    { t: 'c', q: '«Я живу в Німеччині з 2022 року»', o: ['Ich wohne seit 2022 in Deutschland.', 'Ich wohne vor 2022 in Deutschland.', 'Ich bin seit 2022 in Deutschland gewohnt.'] },
    { t: 'c', q: 'Яке речення правильне?', o: ['Ich habe am Samstag eine Freundin getroffen.', 'Ich habe getroffen am Samstag eine Freundin.', 'Ich getroffen habe am Samstag eine Freundin.'] },
    { t: 'o', q: 'Що ти робив на вихідних?', a: 'Was hast du am Wochenende gemacht?' },
    { t: 'o', q: 'Учора Марко купив хліб.', a: ['Marko hat gestern Brot gekauft.', 'Gestern hat Marko Brot gekauft.'] },
    { t: 'o', q: 'Ми залишилися вдома.', a: 'Wir sind zu Hause geblieben.' },
    { t: 'l', a: 'Letzte Woche bin ich nach Hamburg gefahren.', tr: 'Минулого тижня я їздив до Гамбурга.' },
    { t: 'l', a: 'Was ist passiert?', tr: 'Що сталося?' }
  ],
  say: [['Was hast du am Wochenende gemacht?', 'Що ти робив на вихідних?'], ['Ich habe eingekauft und gekocht.', 'Я зробив покупки й приготував їсти.'],
    ['Am Sonntag sind wir spazieren gegangen.', 'У неділю ми гуляли.'], ['Ich war gestern beim Arzt.', 'Учора я був у лікаря.'], ['Ich wohne seit drei Jahren in Deutschland.', 'Я живу в Німеччині вже три роки.']],
  speak: ['Розкажіть, що ви робили вчора, у 6–8 реченнях Perfekt — від ранку до вечора: «Ich bin um sieben aufgestanden…»',
    'Розкажіть про свій переїзд: коли приїхали, де жили спочатку, що зробили першим: «Ich bin 2022 nach Deutschland gekommen…»'],
  mission: 'У понеділок на курсі, на роботі чи в розмові із сусідом дайте відповідь на «Wie war dein Wochenende?» 3–4 реченнями в Perfekt. Підготуйте відповідь заздалегідь.'
},
{
  id: 'a1-12', stage: 'a1', num: 'A1.12', title: 'Дати й місяці, Termin: у лікаря й в установі', dur: '1 тиждень',
  goals: ['називати дату: am dritten Mai', 'домовлятися про Termin, переносити й скасовувати його', 'розуміти головні слова в Arztpraxis і Bürgeramt'],
  theory: `
<h3>Місяці й пори року</h3>
<p>[[der Januar]] (в Австрії [[der Jänner]]), [[der Februar]], [[der März]], [[der April]], [[der Mai]], [[der Juni]], [[der Juli]], [[der August]], [[der September]], [[der Oktober]], [[der November]], [[der Dezember]] — усі чоловічого роду. У травні — [[im Mai]].</p>
<p class="small muted">Juni й Juli легко сплутати, тому по телефону часто кажуть [[Juno]] і [[Julei]].</p>
<p>[[der Frühling]] — весна, [[der Sommer]] — літо, [[der Herbst]] — осінь, [[der Winter]] — зима. Улітку — [[im Sommer]].</p>
<h3>Порядкові числівники й дата</h3>
<div class="tblwrap"><table><tr><td>1. [[erste]]</td><td>2. [[zweite]]</td><td>3. [[dritte]]</td><td>4. [[vierte]]</td><td>5. [[fünfte]]</td></tr>
<tr><td>6. [[sechste]]</td><td>7. [[siebte]]</td><td>8. [[achte]]</td><td>19. [[neunzehnte]]</td><td>20. [[zwanzigste]]</td></tr>
<tr><td>21. [[einundzwanzigste]]</td><td>30. [[dreißigste]]</td><td>31. [[einunddreißigste]]</td><td colspan="2" class="small muted">до 19 + -te, з 20 + -ste</td></tr></table></div>
<p>[[Der Wievielte ist heute?]] / [[Welches Datum ist heute?]] — [[Heute ist der dritte Mai.]] Коли? — <b>am</b> + закінчення <b>-en</b>: [[am dritten Mai]], [[am ersten Juli]], [[am vierundzwanzigsten August]]. З — по: [[vom ersten bis zum fünften Juni]].</p>
<p>Пишуть число з крапкою, день — першим: 3.5. або 03.05.2026. [[Ich bin am zwölften März neunzehnhundertneunzig geboren.]]</p>
<h3>Termin</h3>
<div class="note"><b>Фальшивий друг:</b> [[der Termin]] — це запис, призначена зустріч (до лікаря, в установі, з майстром), а не «термін». Строк, дедлайн — [[die Frist]].</div>
<p>[[Ich möchte einen Termin vereinbaren.]] — Я хотів би записатися. [[Haben Sie am Montag einen Termin frei?]] [[Geht es am Dienstag um zehn Uhr?]] — [[Ja, das passt.]] / [[Nein, das passt mir leider nicht.]] [[Ich muss meinen Termin absagen.]] — скасувати. [[Ich möchte meinen Termin verschieben.]] — перенести. [[Ich komme etwas später.]] — Я трохи запізнюся.</p>
<h3>У лікаря (in der Arztpraxis)</h3>
<p>Спершу зазвичай ідуть до сімейного лікаря — [[der Hausarzt]] / [[die Hausärztin]]. На реєстратурі ([[die Anmeldung]]) просять картку медичного страхування: [[Bitte geben Sie mir Ihre Versichertenkarte.]] (в Австрії — [[die e-card]]). Далі — [[das Wartezimmer]], приймальня.</p>
<p>[[Was fehlt Ihnen?]] — Що вас турбує? [[Ich habe Kopfschmerzen.]] [[Ich habe Fieber.]] [[Ich habe Halsschmerzen.]] [[Ich habe seit drei Tagen Husten.]] Лікар може виписати [[ein Rezept]] — рецепт — і лікарняний для роботи: [[die Krankmeldung]].</p>
<h3>В установі</h3>
<p>Після переїзду в Німеччині треба протягом двох тижнів зареєструвати адресу — [[die Anmeldung]] у [[das Bürgeramt]] (в інших містах — Bürgerbüro чи Einwohnermeldeamt). Потрібне підтвердження від орендодавця — [[die Wohnungsgeberbestätigung]]. В Австрії реєструються протягом трьох днів і отримують [[der Meldezettel]].</p>
<p>Корисні слова: [[der Antrag]] — заява, [[einen Antrag stellen]] — подати заяву, [[die Unterlagen]] — документи, [[die Wartenummer]] — номер у черзі, [[Sie sind dran.]] — ваша черга, [[Unterschreiben Sie bitte hier.]]</p>
<p>У формулярах: [[das Geburtsdatum]] — дата народження, [[der Geburtsort]] — місце народження, [[die Staatsangehörigkeit]] — громадянство, [[die Adresse]] — адреса, [[der Familienstand]] — сімейний стан.</p>`,
  vocab: [['der Januar', 'січень', 'Австрія: der Jänner'], ['der Februar', 'лютий'], ['der März', 'березень'], ['der April', 'квітень'], ['der Mai', 'травень'],
    ['der Juni', 'червень', 'по телефону: Juno'], ['der Juli', 'липень', 'по телефону: Julei'], ['der August', 'серпень'], ['der September', 'вересень'], ['der Oktober', 'жовтень'],
    ['der November', 'листопад'], ['der Dezember', 'грудень'], ['das Datum', 'дата', 'die Daten'], ['der Termin', 'запис, призначена зустріч', 'не «термін»! Строк — die Frist'],
    ['vereinbaren', 'домовлятися', 'einen Termin vereinbaren'], ['absagen', 'скасовувати', 'ich sage ab'], ['verschieben', 'переносити (на інший час)'], ['passen', 'підходити, влаштовувати', 'Das passt.'],
    ['die Arztpraxis', 'кабінет лікаря, практика', 'die Arztpraxen'], ['der Hausarzt / die Hausärztin', 'сімейний лікар / лікарка'], ['die Krankenkasse', 'лікарняна каса (медичне страхування)'],
    ['die Versichertenkarte', 'картка медичного страхування', 'Австрія: die e-card'], ['das Rezept', 'рецепт (на ліки і страви)'], ['die Anmeldung', 'реєстрація місця проживання; реєстратура'],
    ['das Bürgeramt', 'громадська служба (реєстрація, документи)'], ['der Antrag', 'заява', 'die Anträge'], ['die Unterlagen', 'документи', 'лише множина'], ['das Geburtsdatum', 'дата народження']],
  ex: [
    { t: 'g', g: 'dateListen' },
    { t: 'g', g: 'dateWords' },
    { t: 'c', q: '«der Termin» — це…', o: ['запис, призначена зустріч', 'кінцева зупинка, термінал', 'термін, поняття'] },
    { t: 'c', q: 'Що означає австрійське «Jänner»?', o: ['січень', 'червень', 'липень'] },
    { t: 'c', q: '«3 травня» (коли?)', o: ['am dritten Mai', 'am drei Mai', 'im dritten Mai'] },
    { t: 'c', q: 'Heute ist der ___ Juni. (1-ше)', o: ['erste', 'einste', 'eins'] },
    { t: 'i', q: 'Порядковий числівник: am ___ Juli (7.)', a: 'siebten' },
    { t: 'i', q: 'Порядковий числівник: am ___ Mai (20.)', a: 'zwanzigsten' },
    { t: 'i', q: 'Wann sind Sie geboren? — Am ___ Mai. (1.)', a: 'ersten' },
    { t: 'c', q: 'Ви хочете перенести запис на інший день:', o: ['Ich möchte meinen Termin verschieben.', 'Ich möchte meinen Termin vereinbaren.', 'Ich möchte meinen Termin bezahlen.'] },
    { t: 'c', q: 'Лікар питає «Was fehlt Ihnen?». Це…', o: ['Що вас турбує?', 'Що ви загубили?', 'Кого сьогодні немає?'] },
    { t: 'c', q: '«die Anmeldung» у лікаря — це…', o: ['реєстратура', 'рецепт', 'лікарняний'] },
    { t: 'o', q: 'Я хотів би записатися на прийом.', a: 'Ich möchte einen Termin vereinbaren.' },
    { t: 'o', q: 'Можна у вівторок о десятій?', a: 'Geht es am Dienstag um zehn Uhr?' },
    { t: 'o', q: 'Пані Коваль народилася 12 березня.', a: ['Frau Kowal ist am zwölften März geboren.', 'Am zwölften März ist Frau Kowal geboren.'] },
    { t: 'l', a: 'Bitte bringen Sie Ihre Versichertenkarte mit.', tr: 'Будь ласка, візьміть із собою картку медичного страхування.' },
    { t: 'l', a: 'Ich habe am Montag einen Termin beim Hausarzt.', tr: 'У понеділок я записаний до сімейного лікаря.' }
  ],
  say: [['Guten Tag, ich möchte einen Termin vereinbaren.', 'Добрий день, я хотів би записатися на прийом.'], ['Geht es am Donnerstag um halb neun?', 'Можна в четвер о пів на дев\'яту?'],
    ['Ich muss meinen Termin leider absagen.', 'На жаль, мені доведеться скасувати запис.'], ['Heute ist der vierundzwanzigste August.', 'Сьогодні двадцять четверте серпня.'],
    ['Ich habe seit drei Tagen Fieber.', 'У мене вже три дні температура.'], ['Ich möchte mich anmelden. Hier sind meine Unterlagen.', 'Я хочу зареєструватися. Ось мої документи.']],
  speak: ['Розіграйте телефонну розмову з Arztpraxis: привітання, прізвище по літерах, причина, домовленість про день і час, подяка. Запишіть себе.',
    'Назвіть уголос дні народження 5 рідних і друзів: «Meine Mutter hat am … Geburtstag.»'],
  mission: 'Зателефонуйте чи напишіть у практику лікаря або в установу й домовтеся про Termin німецькою: «Guten Tag, mein Name ist … Ich möchte einen Termin vereinbaren.» Якщо записуєтеся онлайн, заповніть форму німецькою, не перемикаючи мову.'
},
{
  id: 'a1-13', stage: 'a1', num: 'A1.13', title: 'Повторення і підсумковий тест A1', dur: '1 тиждень',
  goals: ['повторити все з рівня A1', 'скласти підсумковий тест на ≥ 80%', 'провести 3–5-хвилинну розмову німецькою'],
  theory: `
<p>Цей тиждень — для повторення. Ось план:</p>
<ol><li><b>Пн–Вт:</b> ще раз пройдіть вправи уроків, де найнижчий бал (див. «Уроки»), і 2–3 підходи в тренажері чисел.</li>
<li><b>Ср:</b> «Розмова» → 5 випадкових завдань із таймером, кожне з записом себе.</li>
<li><b>Чт:</b> підсумковий тест — вправи цього уроку, зібрані з усього A1.</li>
<li><b>Пт:</b> «живий тест» — 3–5 хвилин розмови німецькою: знайомство, сім'я, робота, ваш день, минулі вихідні, плани.</li></ol>
<h3>Як виглядає іспит A1</h3>
<p>Іспит рівня A1 для дорослих — <b>Goethe-Zertifikat A1: Start Deutsch 1</b> (також telc чи ÖSD). Він складається з чотирьох частин: <b>Hören</b> (слухання коротких оголошень і діалогів), <b>Lesen</b> (оголошення, короткі листи), <b>Schreiben</b> (заповнити формуляр і написати коротке повідомлення) і <b>Sprechen</b> — в групі: представитися, запитувати й відповідати на побутові теми, сформулювати прохання.</p>
<div class="tip">Вправи цього тренажера тренують ті самі навички: диктанти — слухання, порядок слів і введення — письмо, shadowing і завдання «Розмова» — усну частину.</div>
<h3>Самооцінка: я вмію…</h3>
<ul class="check"><li>привітатися, представитися, сказати, звідки я і де живу</li><li>продиктувати ім'я по літерах і номер телефону</li><li>розповісти про сім'ю, роботу і свій день</li>
<li>замовити в кафе, купити продукти, запитати ціну, заплатити</li><li>запитати дорогу і поїхати громадським транспортом</li><li>сказати, котра година, і домовитися про Termin</li>
<li>розповісти, що робив учора і на вихідних</li><li>попросити повторити або говорити повільніше</li></ul>
<div class="good">Якщо більшість пунктів — «так», переходьте до A2 у вкладці «Програма».</div>`,
  vocab: [],
  ex: [
    { t: 'i', q: 'sein: Wir ___ aus der Ukraine.', a: 'sind' },
    { t: 'c', q: 'Який артикль у слова «Mädchen»?', o: ['das', 'die', 'der'] },
    { t: 'i', q: 'fahren: Er ___ mit dem Zug.', a: 'fährt' },
    { t: 'c', q: 'Яке речення правильне?', o: ['Heute habe ich keine Zeit.', 'Heute ich habe keine Zeit.', 'Heute habe ich nicht Zeit.'] },
    { t: 'i', q: 'Множина з артиклем: die Frau →', a: 'die Frauen' },
    { t: 'i', q: 'Akkusativ: Ich habe ___ Bruder. (ein)', a: 'einen' },
    { t: 'c', q: '«Я не п\'ю кави»', o: ['Ich trinke keinen Kaffee.', 'Ich trinke nicht Kaffee.', 'Ich trinke kein Kaffee.'] },
    { t: 'c', q: 'Як ввічливо замовити воду?', o: ['Ich hätte gern ein Wasser.', 'Ich will ein Wasser.', 'Gib mir ein Wasser.'] },
    { t: 'g', g: 'numListen', min: 20, max: 999 },
    { t: 'g', g: 'clockListen' },
    { t: 'i', q: 'einkaufen: Wann ___ du ein?', a: 'kaufst' },
    { t: 'c', q: '«Тут не можна курити»', o: ['Hier darf man nicht rauchen.', 'Hier muss man nicht rauchen.', 'Hier kann nicht man rauchen.'] },
    { t: 'i', q: 'Dativ: Ich fahre mit ___ U-Bahn.', a: 'der' },
    { t: 'c', q: 'Wohin? «Я йду в місто»', o: ['Ich gehe in die Stadt.', 'Ich gehe im Stadt.', 'Ich gehe in den Stadt.'] },
    { t: 'i', q: 'Perfekt: Wir ___ nach Wien gefahren.', a: 'sind' },
    { t: 'i', q: 'Partizip II: kaufen → hat ___', a: 'gekauft' },
    { t: 'o', q: 'Котра година?', a: 'Wie spät ist es?' },
    { t: 'o', q: 'Учора Оксана зустріла подругу.', a: ['Oksana hat gestern eine Freundin getroffen.', 'Gestern hat Oksana eine Freundin getroffen.'] },
    { t: 'l', a: 'Ich wohne seit zwei Jahren in Deutschland.', tr: 'Я живу в Німеччині вже два роки.' },
    { t: 'l', a: 'Entschuldigung, wo ist hier die Toilette?', tr: 'Перепрошую, де тут туалет?' }
  ],
  say: [['Ich heiße …, ich komme aus der Ukraine und wohne seit … in …', 'Мене звати …, я з України й живу в … від …'],
    ['Ich habe zwei Kinder und arbeite als …', 'У мене двоє дітей, я працюю …'], ['Am Wochenende habe ich meine Freunde getroffen.', 'На вихідних я зустрівся з друзями.'],
    ['Können Sie das bitte noch einmal sagen?', 'Чи можете ви сказати це ще раз?']],
  speak: ['3–5 хвилин без пауз, як в усній частині Start Deutsch 1: представтеся (ім\'я, вік, країна, місто, мови, професія, хобі), розкажіть про сім\'ю, свій день і минулі вихідні. Запишіть себе й послухайте.',
    'Попросіть про щось трьома способами (Können Sie…? Ich hätte gern… Darf ich…?) і дайте відповідь на кожне прохання.'],
  mission: '«Живий тест»: проведіть 3–5-хвилинну розмову німецькою з реальною людиною — на курсі, у Sprachcafé, мовному тандемі чи із сусідом. Якщо вам потрібен сертифікат A1, подивіться дати іспиту Start Deutsch 1 у Goethe-Institut, telc-центрі чи ÖSD у вашому місті.'
}
);
})(PG.pack('de'));
/* ---- de/data/reference.js ---- */
(function (DE) {
  const tbl = (head, rows) => '<div class="tblwrap"><table>' + (head ? '<tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr>' : '') +
    rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table></div>';
  const say = (s) => '[[' + s + ']]';
  const sayList = (s) => s.split(', ').map(say).join(', ');
  // Українська примітка в дужках лишається поза [[ ]]: голос мови її не прочитає
  const sayNote = (s) => s.replace(/^(.*?)( \(.*\))?$/, (m, w, n) => say(w) + (n || ''));
  const sayCell = (s) => s.split(', ').map((x) => x.split(' / ').map(sayNote).join(' / ')).join(', ');

  const sounds = [
    ['a, aa, ah', 'а (коротке; довге)', 'Mann, Haar, Bahn'], ['ä', 'е', 'Käse, Äpfel'], ['e, ee, eh', 'е; ненаголошене в кінці ледь чутне', 'Bett, Tee, sehen, bitte'],
    ['i, ie, ih', 'і (коротке; довге)', 'Kind, Bier, ihr'], ['o, oo, oh', 'о', 'kommen, Boot, Sohn'], ['ö', 'губи як для «о», язик як для «е»', 'schön, Öl, zwölf'],
    ['u, uh', 'у', 'Mutter, Uhr'], ['ü, y', 'губи як для «у», язик як для «і»', 'Tür, fünf, Typ'], ['ei, ai', 'ай', 'mein, Mai'], ['eu, äu', 'ой', 'neu, Häuser'],
    ['au', 'ау', 'Haus, Frau'], ['b, d, g у кінці слова', 'п, т, к', 'gelb, Kind, Tag'], ['ch після a, o, u, au', 'х', 'Buch, Nacht'], ['ch після інших звуків', 'м\'яке «хь»', 'ich, Milch'],
    ['chs', 'кс', 'sechs'], ['-ig у кінці', 'іхь (на півдні — ік)', 'zwanzig'], ['h після голосного', 'не читається', 'Uhr, sehen'], ['j', 'й', 'ja, Jahr'],
    ['ng', 'носове «н», без «г»', 'lang, Zeitung'], ['pf', 'пф', 'Apfel'], ['qu', 'кв', 'Quark'], ['r після голосного', 'майже «а»', 'Bier, Vater'],
    ['s перед голосним', 'з', 'Sonne, Rose'], ['sch', 'ш', 'Schule'], ['sp, st на початку кореня', 'шп, шт', 'Sport, Stadt, verstehen'], ['ß, ss', 'с', 'Straße, Wasser'],
    ['tsch', 'ч', 'Deutsch, tschüss'], ['v', 'ф; у запозиченнях — в', 'Vater, Video'], ['w', 'в', 'Wasser, wie'], ['z, tz', 'ц', 'Zeit, Platz']
  ];

  const plural = [
    ['-e (часто з умлаутом)', 'багато слів чоловічого роду, частина середнього', 'der Tag — die Tage, der Stuhl — die Stühle'],
    ['-(e)n', 'майже всі слова жіночого роду', 'die Frau — die Frauen, die Lampe — die Lampen'],
    ['-er (з умлаутом)', 'багато односкладових слів середнього роду', 'das Kind — die Kinder, das Buch — die Bücher'],
    ['без закінчення (іноді умлаут)', 'чоловічий і середній рід на -er, -el, -en, -chen', 'der Lehrer — die Lehrer, das Mädchen — die Mädchen, der Vater — die Väter'],
    ['-s', 'запозичення, слова на голосний', 'das Auto — die Autos, das Handy — die Handys']
  ];

  const irregular = [
    ['fahren', 'er fährt', 'ist gefahren'], ['gehen', 'er geht', 'ist gegangen'], ['kommen', 'er kommt', 'ist gekommen'], ['bleiben', 'er bleibt', 'ist geblieben'],
    ['fliegen', 'er fliegt', 'ist geflogen'], ['laufen', 'er läuft', 'ist gelaufen'], ['werden', 'er wird', 'ist geworden'], ['sein', 'er ist', 'ist gewesen (war)'],
    ['haben', 'er hat', 'hat gehabt (hatte)'], ['essen', 'er isst', 'hat gegessen'], ['trinken', 'er trinkt', 'hat getrunken'], ['sehen', 'er sieht', 'hat gesehen'],
    ['lesen', 'er liest', 'hat gelesen'], ['sprechen', 'er spricht', 'hat gesprochen'], ['nehmen', 'er nimmt', 'hat genommen'], ['geben', 'er gibt', 'hat gegeben'],
    ['helfen', 'er hilft', 'hat geholfen'], ['schlafen', 'er schläft', 'hat geschlafen'], ['treffen', 'er trifft', 'hat getroffen'], ['schreiben', 'er schreibt', 'hat geschrieben'],
    ['finden', 'er findet', 'hat gefunden'], ['bringen', 'er bringt', 'hat gebracht'], ['denken', 'er denkt', 'hat gedacht'], ['wissen', 'er weiß', 'hat gewusst'],
    ['verstehen', 'er versteht', 'hat verstanden'], ['anrufen', 'er ruft an', 'hat angerufen'], ['aufstehen', 'er steht auf', 'ist aufgestanden']
  ];

  const ff = [
    ['das Magazin', 'журнал; склад', 'магазин — das Geschäft, der Laden'], ['der Termin', 'запис, призначена зустріч', 'термін, строк — die Frist'],
    ['der Konkurs', 'банкрутство', 'конкурс — der Wettbewerb'], ['der Artist', 'цирковий артист, акробат', 'актор — der Schauspieler; митець — der Künstler'],
    ['die Dose', 'бляшанка, банка', 'доза — die Dosis'], ['das Kompott', 'варені фрукти — десерт, який їдять ложкою', 'напій «компот» у німецькій кухні не поширений'],
    ['der Akkord', 'акорд; відрядна робота (im Akkord arbeiten)', 'збігається лише музичне значення'], ['das Bad', 'ванна кімната; купання; курорт (Bad Ems)', 'англ. bad — schlecht'],
    ['die Pension', 'пансіон, гостьовий дім; пенсія державних службовців (в Австрії — будь-яка пенсія)', 'пенсія в Німеччині — die Rente'],
    ['das Kabinett', 'уряд, кабінет міністрів', 'кабінет (кімната) — das Büro, das Arbeitszimmer; у лікаря — das Sprechzimmer'],
    ['der Prospekt', 'рекламний буклет, проспект магазину', 'проспект (вулиця) — die Allee, der Boulevard'], ['der Kran', 'підйомний кран', 'кран з водою — der Wasserhahn'],
    ['der Dom', 'собор', 'дім — das Haus'], ['der Rock', 'спідниця', 'рок-музика — die Rockmusik'], ['das Kostüm', 'жіночий костюм (жакет і спідниця); карнавальний костюм', 'чоловічий костюм — der Anzug'],
    ['die Billion', 'трильйон (10¹²)', 'мільярд — die Milliarde'], ['der erste Stock', 'другий поверх', 'перший поверх — das Erdgeschoss'],
    ['die Spedition', 'компанія вантажоперевезень', 'експедиція — die Expedition'], ['das Lokal', 'кафе, ресторан, заклад', 'прикметник «локальний» — lokal, örtlich'],
    ['der Chef', 'начальник, керівник', 'шеф-кухар — der Küchenchef'], ['das Handy', 'мобільний телефон', 'англ. handy — praktisch'],
    ['bekommen', 'отримувати', 'англ. become — werden'], ['also', 'отже, тож', 'англ. also — auch']
  ];

  const regional = [
    ['Guten Tag!', 'Grüß Gott!', 'Grüezi!', 'добрий день'], ['Tschüss!', 'Servus! / Baba!', 'Ade! / Tschüss!', 'бувай'], ['der Januar', 'der Jänner', 'der Januar', 'січень'],
    ['das Brötchen', 'die Semmel', 'das Weggli, das Brötli', 'булочка'], ['die Tomate', 'der Paradeiser', 'die Tomate', 'помідор'], ['die Kartoffel', 'der Erdapfel', 'die Kartoffel', 'картопля'],
    ['der Quark', 'der Topfen', 'der Quark', 'кисломолочний сир'], ['die Sahne', 'das Obers', 'der Rahm', 'вершки'], ['die Aprikose', 'die Marille', 'die Aprikose', 'абрикос'],
    ['die Straßenbahn', 'die Straßenbahn, die Bim (Відень)', 'das Tram', 'трамвай'], ['die Fahrkarte', 'der Fahrschein', 'das Billett', 'квиток'],
    ['das Fahrrad', 'das Fahrrad', 'das Velo', 'велосипед'], ['parken', 'parken', 'parkieren', 'паркувати'], ['der Bürgersteig', 'der Gehsteig', 'das Trottoir', 'тротуар'],
    ['das Abitur', 'die Matura', 'die Matura', 'атестат зрілості'], ['der Euro', 'der Euro', 'der Franken, der Rappen', 'гроші'], ['die Straße', 'die Straße', 'die Strasse', 'правопис: у Швейцарії немає ß']
  ];

  DE.ref = [
    { id: 'pron', title: 'Вимова й читання', html: tbl(['Пишемо', 'Звучить', 'Приклад'], sounds.map((r) => ['<b>' + r[0] + '</b>', r[1], sayList(r[2])])) +
      '<ul><li>Наголос здебільшого на першому складі кореня; префікси be-, ge-, er-, ver-, zer-, ent-, emp- ненаголошені (be<b>ZAH</b>len). Запозичення часто наголошені в кінці (Stu<b>DENT</b>).</li>' +
      '<li>Довгий голосний: подвоєний (Tee), перед h (Uhr), ie (Liebe), у відкритому складі (Name). Короткий: перед подвоєною приголосною чи ck (Bett, Zucker).</li>' +
      '<li>b, d, g у кінці слова оглушуються: Tag — «та:к».</li><li>Усі іменники й ввічливе Sie пишуть з великої літери.</li>' +
      '<li>Без німецької клавіатури: ä = ae, ö = oe, ü = ue, ß = ss.</li></ul>' },
    { id: 'articles', title: 'Артиклі й відмінки', html: '<p>Відмінок показує насамперед <b>артикль</b>. Питання: <b>Nominativ</b> — wer? was?; <b>Akkusativ</b> — wen? was?; <b>Dativ</b> — wem? wo?; <b>Genitiv</b> (B1) — wessen?</p>' +
      '<h3>Означений артикль</h3>' + tbl(['', 'ч. р.', 'ж. р.', 'с. р.', 'множина'], [
        ['Nominativ', say('der Mann'), say('die Frau'), say('das Kind'), say('die Kinder')],
        ['Akkusativ', '<b>' + say('den Mann') + '</b>', say('die Frau'), say('das Kind'), say('die Kinder')],
        ['Dativ', '<b>' + say('dem Mann') + '</b>', '<b>' + say('der Frau') + '</b>', '<b>' + say('dem Kind') + '</b>', '<b>' + say('den Kindern') + '</b>'],
        ['Genitiv (B1)', say('des Mannes'), say('der Frau'), say('des Kindes'), say('der Kinder')]]) +
      '<h3>Неозначений артикль і kein</h3>' + tbl(['', 'ч. р.', 'ж. р.', 'с. р.', 'множина'], [
        ['Nominativ', 'ein / kein', 'eine / keine', 'ein / kein', '— / keine'],
        ['Akkusativ', '<b>einen / keinen</b>', 'eine / keine', 'ein / kein', '— / keine'],
        ['Dativ', '<b>einem / keinem</b>', '<b>einer / keiner</b>', '<b>einem / keinem</b>', '— / <b>keinen</b> + -n'],
        ['Genitiv (B1)', 'eines / keines', 'einer / keiner', 'eines / keines', '— / keiner']]) +
      '<p>Присвійні займенники (mein, dein, sein, ihr, unser, euer, Ihr) мають ті самі закінчення, що й kein: ' + say('Ich suche meinen Schlüssel.') + ' ' + say('Ich wohne bei meiner Schwester.') + '</p>' +
      '<p class="small muted">У Dativ множини іменник отримує -n: die Kinder — den Kindern (крім слів на -s і -n: den Autos, den Frauen).</p>' },
    { id: 'plural', title: 'Множина іменників', html: tbl(['Тип', 'Кого стосується', 'Приклади'], plural.map((r) => ['<b>' + r[0] + '</b>', r[1], r[2].split(', ').map((p) => p.split(' — ').map(say).join(' — ')).join('<br>')])) +
      '<p>Артикль множини — завжди <b>die</b>. Множину вчіть разом зі словом: у словнику вона записана як <i>der Tag, -e</i> чи <i>das Buch, ¨-er</i>. Лише в множині: ' + say('die Eltern') + ', ' + say('die Geschwister') + ', ' + say('die Leute') + ', ' + say('die Unterlagen') + '.</p>' },
    { id: 'pronouns', title: 'Займенники: особові й присвійні', html: tbl(['', 'я', 'ти', 'він', 'вона', 'воно', 'ми', 'ви', 'вони', 'Ви'], [
        ['Nominativ', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie', 'Sie'],
        ['Akkusativ', 'mich', 'dich', 'ihn', 'sie', 'es', 'uns', 'euch', 'sie', 'Sie'],
        ['Dativ', 'mir', 'dir', 'ihm', 'ihr', 'ihm', 'uns', 'euch', 'ihnen', 'Ihnen'],
        ['зворотний (A2)', 'mich / mir', 'dich / dir', 'sich', 'sich', 'sich', 'uns', 'euch', 'sich', 'sich'],
        ['присвійний', 'mein', 'dein', 'sein', 'ihr', 'sein', 'unser', 'euer', 'ihr', 'Ihr']]) +
      '<p>' + say('Ich sehe ihn.') + ' ' + say('Kannst du mir helfen?') + ' ' + say('Wie geht es Ihnen?') + ' ' + say('Das ist ihr Bruder und seine Schwester.') + '</p>' +
      '<p class="small muted">Слова «свій» немає: вибір залежить від того, чиє (Taras und seine Schwester, Olena und ihr Bruder). Перед іменником жіночого роду й множини — закінчення -e: meine, seine; euer → eure.</p>' },
    { id: 'verbs', title: 'Дієслова: теперішній час і Perfekt', html: tbl(['', 'sein', 'haben', 'werden', 'wohnen', 'arbeiten'], [
        ['ich', 'bin', 'habe', 'werde', 'wohne', 'arbeite'], ['du', 'bist', 'hast', 'wirst', 'wohnst', 'arbeitest'], ['er / sie / es', 'ist', 'hat', 'wird', 'wohnt', 'arbeitet'],
        ['wir', 'sind', 'haben', 'werden', 'wohnen', 'arbeiten'], ['ihr', 'seid', 'habt', 'werdet', 'wohnt', 'arbeitet'], ['sie / Sie', 'sind', 'haben', 'werden', 'wohnen', 'arbeiten']]) +
      '<p><b>Зміна кореня</b> (лише du і er / sie / es): a → ä (' + say('fahren — er fährt') + '), e → i (' + say('sprechen — er spricht') + '), e → ie (' + say('sehen — er sieht') + ').</p>' +
      '<p><b>Perfekt</b> = haben / sein (на 2-му місці) + Partizip II (у кінці). Правильні: ge- … -t (' + say('gemacht') + '); з відокремлюваним префіксом ge- всередині (' + say('eingekauft') + '); на -ieren і з be-, ver-, er-, ent- — без ge- (' + say('telefoniert') + ', ' + say('verstanden') + '). <b>sein</b> — з дієсловами руху й зміни стану, а також sein, bleiben, passieren.</p>' +
      '<h3>Часті неправильні дієслова</h3>' + tbl(['Інфінітив', 'Теперішній (er)', 'Perfekt'], irregular.map((r) => [say(r[0]), say(r[1]), sayNote(r[2])])) },
    { id: 'modal', title: 'Модальні дієслова', html: tbl(['', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'], [
        ['значення', 'могти, вміти', 'мусити', 'хотіти', 'мати дозвіл', 'бути повинним (за чиїмось словом)', 'хотіти б'],
        ['ich', 'kann', 'muss', 'will', 'darf', 'soll', 'möchte'], ['du', 'kannst', 'musst', 'willst', 'darfst', 'sollst', 'möchtest'],
        ['er / sie / es', 'kann', 'muss', 'will', 'darf', 'soll', 'möchte'], ['wir', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
        ['ihr', 'könnt', 'müsst', 'wollt', 'dürft', 'sollt', 'möchtet'], ['sie / Sie', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
        ['Präteritum (A2)', 'konnte', 'musste', 'wollte', 'durfte', 'sollte', 'wollte']]) +
      '<p>Модальне дієслово — друге, інфінітив — у кінці: ' + say('Ich kann heute nicht kommen.') + '</p>' +
      '<p><b>nicht müssen</b> — не треба (' + say('Sie müssen nicht warten.') + '); <b>nicht dürfen</b> — не можна (' + say('Hier darf man nicht rauchen.') + ').</p>' },
    { id: 'prefix', title: 'Префікси: відокремлювані й ні', html: tbl(['', 'Префікси', 'Приклади'], [
        ['відокремлювані (наголошені)', 'ab-, an-, auf-, aus-, ein-, fern-, mit-, nach-, vor-, weg-, zu-, zurück-', sayList('abholen, anrufen, aufstehen, ausfüllen, einkaufen, mitkommen, zurückkommen')],
        ['невідокремлювані (ненаголошені)', 'be-, emp-, ent-, er-, ge-, miss-, ver-, zer-', sayList('bezahlen, empfehlen, entschuldigen, erklären, gehören, verstehen')]]) +
      tbl(['Ситуація', 'Приклад'], [
        ['звичайне речення: префікс у кінці', say('Ich stehe um sieben Uhr auf.')], ['з модальним дієсловом: разом у кінці', say('Ich muss früh aufstehen.')],
        ['Perfekt: ge- всередині', say('Ich bin früh aufgestanden.')], ['підрядне речення: разом у кінці', say('…, weil ich früh aufstehe.')]]) },
    { id: 'order', title: 'Порядок слів', html: tbl(['Тип речення', 'Де дієслово', 'Приклад'], [
        ['розповідне', '2-ге місце', say('Heute arbeite ich zu Hause.')], ['W-питання', 'після питального слова', say('Wann kommst du?')],
        ['питання «так / ні»', '1-ше місце', say('Kommst du heute?')], ['наказ (Sie)', '1-ше місце', say('Kommen Sie bitte herein!')],
        ['модальне дієслово', '2-ге + інфінітив у кінці', say('Ich muss heute lange arbeiten.')], ['Perfekt', 'haben / sein 2-ге + Partizip у кінці', say('Ich habe lange gearbeitet.')],
        ['відокремлюваний префікс', '2-ге + префікс у кінці', say('Der Zug fährt um acht ab.')], ['підрядне (weil, dass, wenn, ob)', 'у самому кінці', say('Ich lerne Deutsch, weil ich hier arbeite.')]]) +
      '<p><b>Підмет</b> стоїть або на 1-му місці, або одразу після дієслова: ' + say('Morgen fahre ich nach Wien.') + '</p>' +
      '<p><b>Середина речення:</b> зазвичай час — причина — спосіб — місце: ' + say('Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin.') + '</p>' +
      '<p><b>nicht</b>: у кінці, якщо заперечуєте всю дію (' + say('Ich verstehe das nicht.') + '); перед словом, яке заперечуєте (' + say('Das ist nicht teuer.') + ', ' + say('Ich wohne nicht in Berlin.') + ').</p>' },
    { id: 'prep', title: 'Прийменники й відмінки', html: tbl(['Відмінок', 'Прийменники', 'Приклади'], [
        ['Akkusativ', 'bis, durch, für, gegen, ohne, um', sayList('für dich, ohne Zucker, durch den Park, um acht Uhr')],
        ['Dativ', 'aus, bei, mit, nach, seit, von, zu, gegenüber', sayList('aus der Ukraine, beim Arzt, mit dem Bus, nach Hause, seit 2022, vom Bahnhof, zur Arbeit')],
        ['wo? — Dativ / wohin? — Akkusativ', 'an, auf, hinter, in, neben, über, unter, vor, zwischen', say('Ich bin im Park.') + ' / ' + say('Ich gehe in den Park.')],
        ['Genitiv (B1; у розмові часто Dativ)', 'wegen, trotz, während, statt', sayList('wegen des Wetters, während der Arbeit')]]) +
      '<p><b>Злиття:</b> am = an dem, im = in dem, ans = an das, ins = in das, beim = bei dem, vom = von dem, zum = zu dem, zur = zu der.</p>' +
      tbl(['Коли?', 'Прийменник', 'Приклад'], [
        ['година', 'um', say('um acht Uhr')], ['день, дата, частина дня', 'am', say('am Montag') + ', ' + say('am dritten Mai') + ', ' + say('am Abend')],
        ['місяць, пора року, рік', 'im', say('im Mai') + ', ' + say('im Sommer') + ', ' + say('im Jahr 2022')], ['з … до', 'von … bis', say('von neun bis fünf')],
        ['тому', 'vor + Dativ', say('vor zwei Jahren')], ['з (і досі)', 'seit + Dativ', say('seit drei Monaten')]]) },
    { id: 'nums', title: 'Числа, час, дати', html: tbl(null, [
        ['0–12', sayList('null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf')],
        ['13–19', sayList('dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn')],
        ['десятки', sayList('zwanzig, dreißig, vierzig, fünfzig, sechzig, siebzig, achtzig, neunzig')],
        ['21–99', say('einundzwanzig') + ' — одиниці перед десятками, разом'], ['сотні, тисячі', sayList('hundert, zweihundert, tausend, zehntausend, eine Million')],
        ['роки', say('neunzehnhundertneunzig') + ' (1990), ' + say('zweitausendsechsundzwanzig') + ' (2026)'],
        ['порядкові', sayList('erste, zweite, dritte, vierte, fünfte, sechste, siebte, achte, neunte, zehnte, zwanzigste')],
        ['дата', say('Heute ist der dritte Mai.') + ' · коли? ' + say('am dritten Mai')],
        ['місяці', sayList('Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember')],
        ['дні', sayList('Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag')]]) +
      tbl(['Час', 'Офіційно', 'Розмовно'], [
        ['8:15', say('acht Uhr fünfzehn'), say('Viertel nach acht')], ['8:30', say('acht Uhr dreißig'), say('halb neun')],
        ['8:45', say('acht Uhr fünfundvierzig'), say('Viertel vor neun')], ['14:50', say('vierzehn Uhr fünfzig'), say('zehn vor drei')]]) +
      '<p>Ціни: 3,99 € — ' + say('drei Euro neunundneunzig') + '; дробові числа — з комою: 2,5 — ' + say('zwei Komma fünf') + '. Дата пишеться з крапками, день першим: 03.05.2026.</p>' },
    { id: 'ff', title: 'Фальшиві друзі', html: tbl(['Німецьке слово', 'Означає', 'А те, що «схоже», — це…'], ff.map((r) => [say(r[0]), r[1], r[2]])) },
    { id: 'regional', title: 'Німеччина, Австрія, Швейцарія', html: '<p>Стандартну німецьку розуміють усюди, але в побуті слова різняться. Швейцарці між собою говорять діалектом (Schweizerdeutsch), а з іноземцями зазвичай переходять на стандартну мову.</p>' +
      tbl(['Німеччина', 'Австрія', 'Швейцарія', 'Значення'], regional.map((r) => [sayCell(r[0]), sayCell(r[1]), sayCell(r[2]), r[3]])) }
  ];
})(PG.pack('de'));
/* ---- de/data/program.js ---- */
(function (DE) {
DE.program = {
  intro: 'Програма для україномовних, які живуть у Німеччині, Австрії чи Швейцарії: з нуля до B2 · 15–30 хв у робочі дні · самостійно або паралельно з інтеграційним курсом. Пріоритети: розмова → слухання → читання → письмо.',
  estimate: 'Орієнтовно 100 тижнів, тобто близько 23 місяців у вашому темпі. Інтеграційний курс чи робота німецькою можуть суттєво пришвидшити темп — тоді просто рухайтеся далі, щойно контрольна точка складена.',
  principles: [
    ['Розмова — щодня', 'Щодня хоча б 3–5 хвилин говоріть уголос: повторюйте за диктором (shadowing), коментуйте свої дії, записуйте себе. Розмова — ваш пріоритет №1.'],
    ['Іменник — тільки з артиклем', 'Учіть «der Tisch, die Tische», а не «Tisch». Рід не вгадати з української: die Sonne, das Mädchen, der Löffel.'],
    ['Дієслово — на другому місці', 'Порядок слів — найбільша відмінність від української. У кожному реченні перевіряйте: де дієслово, а де інфінітив, префікс чи Partizip у кінці.'],
    ['Місто — ваш підручник', 'Щотижня виконуйте «місію» в реальному житті: пекарня, Bürgeramt, лікар, Deutsche Bahn, сусіди. У вас є середовище — це головна перевага.'],
    ['Слова — інтервальним повторенням', '5 хвилин щодня у вкладці «Слова». Почуте в Jobcenter, на роботі чи в магазині додавайте в «Мої слова» — з артиклем і множиною.'],
    ['Учіть фразами', 'Запам\'ятовуйте фрази цілком: «Ich hätte gern…», «Ich möchte einen Termin vereinbaren». Так граматика засвоюється сама.'],
    ['Просіть німецьку', 'Почувши акцент, багато хто переходить на англійську. Кажіть: «Ich lerne Deutsch — können wir Deutsch sprechen?»'],
    ['Знайте свій регіон', 'В Австрії та Швейцарії є свої слова (Jänner, Semmel, Grüezi), а швейцарці в побуті говорять діалектом. Стандартну німецьку, яку ви вчите, розуміють усюди.'],
    ['Вихідні вільні', 'Навчання тільки в робочі дні. На вихідних за бажанням — серіал, подкаст, «Tagesschau in 100 Sekunden», прогулянка з читанням вивісок.']
  ],
  week: [
    { d: 1, name: 'Понеділок', full: 'Новий урок: теорія з озвученням + перші вправи', min: 'Теорія (послухайте всі приклади)' },
    { d: 2, name: 'Вівторок', full: 'Вправи уроку + диктанти (слухання) + слова уроку', min: 'Половина вправ' },
    { d: 3, name: 'Середа', full: 'Розмова: shadowing фраз уроку, запис себе, 1–2 завдання з таймером', min: 'Shadowing 5 фраз із записом' },
    { d: 4, name: 'Четвер', full: 'Решта вправ (≥ 80%) + 10 хв справжньої німецької (подкаст, Easy German, новини)', min: 'Решта вправ' },
    { d: 5, name: 'П\'ятниця', full: 'Місія тижня в реальному житті + 3–5 речень письмово про тиждень', min: 'Місія тижня' }
  ],
  weekA0: 'На етапі 0 один урок займає 2 дні. День 1 — теорія і вимова (з записом себе). День 2 — вправи, диктант і місія.',
  daily: 'Щодня перед заняттям: 5 хвилин «Слова».',
  stages: [
    { id: 'a0', level: 'Етап 0', title: 'Старт: вимова, читання, перші фрази', weeks: '1–2', built: true,
      cando: ['читаю будь-яке німецьке слово: ei, ie, sch, ä, ö, ü, ß', 'вітаюся й прощаюся, вибираю du чи Sie', 'рахую до 20 і диктую своє ім\'я по літерах'] },
    { id: 'a1', level: 'A1', title: 'Виживання: базові ситуації', weeks: '3–15', built: true,
      cando: ['розповідаю про себе, сім\'ю, роботу', 'замовляю в кафе, купую, питаю ціну, плачу', 'питаю дорогу і їжджу транспортом', 'кажу, котра година, і домовляюся про Termin', 'розповідаю в Perfekt, що робив учора', 'розумію на слух ціни, час і дати'],
      checkpoint: 'Підсумковий тест A1.13 (≥ 80%) і 3–5 хвилин живої розмови. Офіційний іспит цього рівня — Goethe-Zertifikat A1: Start Deutsch 1 (або A1 від telc чи ÖSD): слухання, читання, письмо (формуляр і коротке повідомлення) й усна частина в групі. Такий сертифікат, зокрема, потрібен для візи на возз\'єднання з чоловіком чи дружиною в Німеччині.' },
    { id: 'a2', level: 'A2', title: 'Побут без перекладача', weeks: '16–39',
      cando: ['справляюся в лікаря, банку, з орендодавцем і в Jobcenter', 'розумію повільне чітке мовлення на побутові теми', 'читаю оголошення, короткі листи, інструкції', 'пишу коротке повідомлення або e-mail'],
      checkpoint: 'Модельний тест A2 (Goethe-Zertifikat A2 чи telc Deutsch A2) і 10-хвилинна розмова на побутові теми. DTZ в інтеграційному курсі оцінює на рівні A2 або B1 — мета курсу B1.',
      modules: [
        { id: 'a2-1', title: 'Dativ повністю: кому? з ким?', weeks: '16–18', grammar: 'Dativ артиклів і займенників (mir, dir, ihm, ihr, Ihnen); дієслова з Dativ: helfen, gefallen, gehören, danken, schmecken; Dativ і Akkusativ разом: Ich gebe dir das Buch.', vocab: 'Подарунки, свята, одяг.', speak: 'Розкажіть, що кому подаруєте на свята і чому.', listen: 'DW «Nicos Weg» (A2): епізоди про покупки й свята.', read: 'Листівки, запрошення, оголошення про свята в місті.', write: 'Привітання з днем народження (40–60 слів).', mission: 'Купіть подарунок і попросіть продавця порадити: «Was können Sie mir empfehlen?»' },
        { id: 'a2-2', title: 'Präteritum: war, hatte, konnte, musste', weeks: '19–20', grammar: 'Präteritum sein, haben і модальних дієслів; Perfekt неправильних дієслів (повторення); als, früher.', vocab: 'Біографія, школа, освіта, професія в Україні.', speak: 'Розкажіть, ким ви працювали в Україні і що могли чи мусили робити.', listen: 'Easy German: вуличні інтерв\'ю про дитинство й школу.', read: 'Короткі біографії, приклади Lebenslauf.', write: 'Табличне резюме (Lebenslauf) і 5 речень про себе.', mission: 'Розкажіть консультантові в Jobcenter чи Arbeitsagentur про свою освіту й досвід німецькою.' },
        { id: 'a2-3', title: 'Підрядні речення: weil, dass, wenn, ob', weeks: '21–23', grammar: 'Дієслово в кінці підрядного речення; weil і denn; dass; wenn (умова й час); ob (непряме питання).', vocab: 'Робота, пошук роботи, графік.', speak: 'Поясніть, чому ви вчите німецьку і чому живете саме тут.', listen: 'DW Learn German, подкасти для A2.', read: 'Оголошення про вакансії.', write: 'Короткий лист-відгук на вакансію (60–80 слів).', mission: 'Зателефонуйте за оголошенням про роботу чи квартиру і запитайте: «Ich möchte fragen, ob …»' },
        { id: 'a2-4', title: 'Зворотні дієслова і здоров\'я', weeks: '24–25', grammar: 'sich waschen, sich anziehen, sich fühlen, sich freuen auf / über, sich interessieren für; mich / mir.', vocab: 'Тіло, симптоми, аптека, ліки.', speak: 'Опишіть лікареві самопочуття й симптоми.', listen: 'Діалоги в лікаря (VHS-Lernportal, DW).', read: 'Інструкція до ліків (Beipackzettel) — головне.', write: 'Повідомлення на роботу про хворобу.', mission: 'В аптеці поясніть, що вас турбує, і запитайте, як приймати ліки.' },
        { id: 'a2-5', title: 'Відмінювання прикметників', weeks: '26–28', grammar: 'Прикметник після der, ein і без артикля: der neue Job, ein neuer Job, neuer Job — у Nominativ, Akkusativ, Dativ.', vocab: 'Одяг, кольори, зовнішність, характер.', speak: 'Опишіть людину: зовнішність, одяг, характер.', listen: 'Easy German, відеоогляди покупок.', read: 'Каталоги, оголошення Kleinanzeigen.', write: 'Оголошення про продаж речі (40–60 слів).', mission: 'Купіть чи продайте щось на Kleinanzeigen або блошиному ринку (Flohmarkt), домовляючись німецькою.' },
        { id: 'a2-6', title: 'Порівняння: Komparativ і Superlativ', weeks: '29–30', grammar: 'schneller, am schnellsten; gut — besser — am besten; viel — mehr; gern — lieber; als і wie.', vocab: 'Житло, кімнати, меблі, оренда.', speak: 'Порівняйте житло в Україні й тут.', listen: 'Діалоги про пошук квартири.', read: 'Оголошення про оренду: Kaltmiete, Warmmiete, Nebenkosten, Kaution.', write: 'Лист орендодавцю з питаннями про квартиру.', mission: 'Подзвоніть чи напишіть щодо квартири або повідомте Hausverwaltung про несправність.' },
        { id: 'a2-7', title: 'Konjunktiv II у проханнях', weeks: '31–32', grammar: 'würde, hätte, wäre, könnte: Könnten Sie …? Ich hätte gern …; Ich würde gern …', vocab: 'Установи, банк, пошта, договори.', speak: 'Ввічливі прохання в установі й по телефону.', listen: 'Телефонні діалоги (DW, VHS-Lernportal).', read: 'Офіційні листи: головне (Frist, Unterlagen, Termin).', write: 'Ввічливий e-mail з проханням (60–80 слів).', mission: 'Вирішіть справу в банку чи на пошті лише німецькою.' },
        { id: 'a2-8', title: 'Дієслова з прийменниками і плани', weeks: '33–34', grammar: 'warten auf, denken an, sich kümmern um, Angst haben vor; darauf / worauf; werden для планів і прогнозів.', vocab: 'Дозвілля, хобі, спорт, Verein.', speak: 'Розкажіть про хобі й плани на рік.', listen: 'Подкаст «Slow German».', read: 'Програма місцевого Verein чи курсів Volkshochschule.', write: 'Запис на курс чи в клуб: формуляр і коротке повідомлення.', mission: 'Запишіться в спортивний клуб, хор чи курс Volkshochschule і розпитайте про умови.' },
        { id: 'a2-9', title: 'Наказовий спосіб, zu + Infinitiv, um … zu', weeks: '35–36', grammar: 'Komm! Kommen Sie! Kommt!; Ich habe keine Zeit, … zu …; um … zu (мета).', vocab: 'Правила й інструкції: Hausordnung, сортування сміття, техніка безпеки.', speak: 'Поясніть комусь, як щось зробити: рецепт чи побутовий прилад.', listen: 'Інструкції, кулінарні відео.', read: 'Hausordnung будинку, правила сортування сміття.', write: 'Інструкція з 6–8 кроків.', mission: 'Прочитайте Hausordnung свого будинку і поясніть новому сусідові головні правила: сміття, тиша, пральня.' },
        { id: 'a2-10', title: 'Повторення і контрольна точка A2', weeks: '37–39', grammar: 'Огляд: відмінки, Perfekt і Präteritum, підрядні речення, прикметники.', vocab: 'Повторення.', speak: '10 хвилин розмови на побутові теми.', listen: 'Модельний тест A2 — слухання.', read: 'Модельний тест A2 — читання.', write: 'Повідомлення чи e-mail 60–80 слів.', mission: 'Живий тест: 10 хвилин розмови з носієм мови.' }
      ] },
    { id: 'b1', level: 'B1', title: 'Самостійність: життя й робота німецькою', weeks: '40–69',
      cando: ['розповідаю історії, пояснюю причини, висловлюю думку', 'розумію головне в новинах і радіо на знайомі теми', 'читаю статті й офіційні листи (головне)', 'пишу зв\'язний текст, неформальні й прості формальні листи'],
      checkpoint: 'Модельний тест B1 — DTZ (інтеграційний курс), Goethe-Zertifikat B1 чи telc Deutsch B1 — і 15 хвилин розмови з висловленням думки. B1 зазвичай потрібен для Niederlassungserlaubnis і громадянства (див. «Мова, проживання й громадянство»).',
      modules: [
        { id: 'b1-1', title: 'Відносні речення (Relativsätze)', weeks: '40–42', grammar: 'der, die, das, den, dem, deren у Nominativ, Akkusativ, Dativ; з прийменником: mit dem, in der.', vocab: 'Робота: професії, обов\'язки, колектив.', speak: 'Опишіть роботу й колег: «Das ist die Kollegin, die …»', listen: 'Відео й подкасти про роботу (DW, Easy German).', read: 'Вакансії, описи посад.', write: 'Короткий мотиваційний лист (Anschreiben, 120 слів).', mission: 'Пройдіть співбесіду чи розмову з роботодавцем німецькою — або пробну з другом.' },
        { id: 'b1-2', title: 'Passiv', weeks: '43–45', grammar: 'Passiv Präsens і Präteritum: wird gemacht, wurde gebaut; з модальними: muss gemacht werden; man як альтернатива.', vocab: 'Процеси, сервіс, ремонт, виробництво.', speak: 'Поясніть, як щось робиться: як оформлюють Anmeldung, як готують борщ.', listen: 'Пояснювальні ролики («Die Sendung mit der Maus»), документальні відео.', read: 'Описи процедур на сайтах установ.', write: 'Опис процесу (100–120 слів).', mission: 'Дізнайтеся телефоном чи в установі, як подати заяву, і перекажіть процес своїми словами.' },
        { id: 'b1-3', title: 'Präteritum і Plusquamperfekt', weeks: '46–48', grammar: 'Präteritum частих дієслів (ging, kam, sah, gab); Plusquamperfekt: hatte gemacht, war gefahren; nachdem, als, bevor.', vocab: 'Біографія, історія, спогади.', speak: 'Розкажіть історію свого переїзду в часовій послідовності.', listen: 'Аудіокниги й адаптовані історії рівня B1.', read: 'Адаптовані книжки (Lektüre B1).', write: 'Розповідь «Мій шлях до …» (150 слів).', mission: 'Розкажіть свою історію в мовному клубі чи Sprachcafé.' },
        { id: 'b1-4', title: 'Konjunktiv II: поради й нереальні умови', weeks: '49–51', grammar: 'würde + Infinitiv, hätte, wäre, könnte, müsste, sollte; Wenn ich Zeit hätte, …; An deiner Stelle würde ich …', vocab: 'Здоров\'я, спосіб життя, спорт.', speak: 'Дайте пораду другові в складній ситуації.', listen: 'Подкасти-поради, радіо.', read: 'Статті-поради, форуми.', write: 'Лист із порадою (120 слів).', mission: 'Попросіть поради в колеги чи сусіда й дайте свою у відповідь.' },
        { id: 'b1-5', title: 'Genitiv і n-Deklination', weeks: '52–54', grammar: 'des Mannes, der Frau; wegen, trotz, während; n-Deklination: der Kollege — den Kollegen, der Herr — Herrn, der Name — des Namens.', vocab: 'Офіційна мова: листи, документи, договори.', speak: 'Перекажіть своїми словами зміст офіційного листа.', listen: 'Інформаційні відео установ (BAMF, Krankenkasse).', read: 'Листи від Jobcenter, Krankenkasse, Finanzamt — головне.', write: 'Відповідь на офіційний лист (120 слів).', mission: 'Зателефонуйте в Krankenkasse чи Jobcenter і з\'ясуйте питання з листа.' },
        { id: 'b1-6', title: 'Сполучники й інфінітивні конструкції', weeks: '55–57', grammar: 'um … zu і damit; ohne … zu, statt … zu; obwohl і trotzdem; deshalb, deswegen; sowohl … als auch, weder … noch, entweder … oder.', vocab: 'Освіта, курси, визнання дипломів (Anerkennung).', speak: 'Поясніть свої професійні плани і що для них потрібно.', listen: 'Інтерв\'ю, радіо (Deutschlandfunk).', read: 'Портал «Anerkennung in Deutschland» про визнання кваліфікації.', write: 'Текст «Мої цілі на 2 роки» (150 слів).', mission: 'Запишіться на консультацію щодо визнання диплома чи професійного курсу.' },
        { id: 'b1-7', title: 'Розмовна німецька', weeks: '58–60', grammar: 'Частки doch, mal, ja, halt, eben; розмовні скорочення (hab, gibt\'s); непряма мова з dass і ob.', vocab: 'Розмовні вирази, регіональні слова (Австрія, Швейцарія, Баварія).', speak: '15 хвилин вільної розмови в мовному клубі.', listen: 'Німецькі серіали з субтитрами (ARD, ZDF Mediathek).', read: 'Коментарі, чати, соцмережі.', write: 'Неформальний лист другові (120 слів).', mission: 'Сходіть у Sprachcafé чи на Stammtisch і поговоріть 15 хвилин.' },
        { id: 'b1-8', title: 'Суспільство: «Leben in Deutschland»', weeks: '61–63', grammar: 'Повторення Passiv і підрядних речень на суспільних темах.', vocab: 'Держава, права й обов\'язки, вибори, федеральні землі, історія.', speak: 'Поясніть, як влаштована держава і що для вас важливо в суспільстві.', listen: '«Tagesschau in 100 Sekunden», «logo!» (новини для дітей).', read: 'Питання тесту «Leben in Deutschland» і тесту на громадянство.', write: 'Думка на суспільну тему (120 слів).', mission: 'Пройдіть пробний тест «Leben in Deutschland» в Online-Testcenter BAMF.' },
        { id: 'b1-9', title: 'Підготовка до іспиту B1 (DTZ, Goethe, telc)', weeks: '64–66', grammar: 'Огляд B1.', vocab: 'Типові теми іспиту: робота, житло, здоров\'я, дозвілля, установи.', speak: 'Пробна усна частина: представлення, розповідь на тему, спільне планування (gemeinsam etwas planen).', listen: 'Модельні тести слухання.', read: 'Модельні тести читання.', write: 'Формальний і неформальний лист (по 80–100 слів).', mission: 'Зареєструйтеся на іспит, якщо вам потрібен сертифікат: через школу інтеграційного курсу, Goethe-Institut чи telc-центр.' },
        { id: 'b1-10', title: 'Повторення і контрольна точка B1', weeks: '67–69', grammar: 'Огляд усього B1.', vocab: 'Повторення.', speak: '15 хвилин розмови з висловленням думки.', listen: 'Пробний тест B1.', read: 'Пробний тест B1.', write: 'Лист і короткий текст-думка.', mission: 'Живий тест: 15 хвилин обговорення теми з носієм мови.' }
      ] },
    { id: 'b2', level: 'B2', title: 'Вільне спілкування', weeks: '70–100',
      cando: ['спонтанно й вільно говорю з носіями', 'розумію новини, ток-шоу, більшість фільмів', 'читаю статті й аналітику', 'пишу аргументований текст і формальні листи'],
      checkpoint: 'Модельний іспит B2 (Goethe-Zertifikat B2 чи telc Deutsch B2) і 20 хвилин дискусії.',
      modules: [
        { id: 'b2-1', title: 'Аргументація і зв\'язки в тексті', weeks: '70–72', grammar: 'zwar … aber, einerseits … andererseits, je … desto, außerdem, dennoch, folglich; номіналізація (eine Entscheidung treffen).', vocab: 'Суспільні теми: міграція, робота, житло, освіта.', speak: 'Дискусія «за і проти» (3–5 хв).', listen: 'Ток-шоу й дебати (ARD, ZDF), Deutschlandfunk.', read: 'Аналітичні статті.', write: 'Аргументований текст на 200 слів (формат іспиту).', mission: 'Висловте й обґрунтуйте свою думку на нараді чи зборах (батьківські збори, збори мешканців).' },
        { id: 'b2-2', title: 'Konjunktiv II минулого і als ob', weeks: '73–75', grammar: 'hätte gemacht, wäre gefahren; Wenn ich das gewusst hätte, …; als ob + Konjunktiv II; hätte machen müssen.', vocab: 'Рішення, жаль, альтернативи.', speak: 'Розкажіть, що зробили б інакше.', listen: 'Інтерв\'ю, біографічні подкасти.', read: 'Біографії, мемуари.', write: 'Текст «Якби я тоді…» (150 слів).', mission: 'Обговоріть з другом чи колегою важливе рішення з минулого.' },
        { id: 'b2-3', title: 'Офіційний стиль і Nominalstil', weeks: '76–79', grammar: 'Віддієслівні іменники; сталі сполуки (in Anspruch nehmen, zur Verfügung stellen); заміни пасиву: lässt sich, ist zu machen.', vocab: 'Офіційна комунікація, право, договори.', speak: 'Офіційний телефонний дзвінок і скарга.', listen: 'Офіційні оголошення, пресконференції.', read: 'Договори, листи й рішення (Bescheid) установ.', write: 'Формальний лист-скарга (150 слів).', mission: 'Самостійно напишіть офіційний лист німецькою — запит чи скаргу.' },
        { id: 'b2-4', title: 'Професійна німецька', weeks: '80–83', grammar: 'Формули ввічливості, Konjunktiv II у переговорах, непряма мова в протоколах.', vocab: 'Наради, презентації, e-mail, телефонні переговори.', speak: 'Презентація на 5 хвилин про свою професію чи проєкт.', listen: 'Подкасти й відео про роботу, вебінари.', read: 'Робочі e-mail, протоколи.', write: 'Діловий e-mail і короткий протокол.', mission: 'Проведіть частину робочої наради чи презентацію німецькою.' },
        { id: 'b2-5', title: 'Дієприкметники й Konjunktiv I', weeks: '84–86', grammar: 'Partizip I і II як означення (die steigenden Preise, das gekaufte Auto); розширене означення; Konjunktiv I у новинах (er sagte, er sei …).', vocab: 'Наука, медіа, економіка.', speak: 'Перекажіть новину зі своїм коментарем.', listen: 'Tagesschau, heute-journal.', read: 'Новини, науково-популярні статті.', write: 'Резюме статті (150 слів).', mission: 'Перекажіть колезі чи другові новину тижня й обговоріть її.' },
        { id: 'b2-6', title: 'Фразеологія та ідіоми', weeks: '87–89', grammar: 'Найчастіші ідіоми: Daumen drücken, ins Fettnäpfchen treten, Tomaten auf den Augen haben.', vocab: 'Ідіоми, прислів\'я, розмовні вирази.', speak: 'Розкажіть історію з 5 ідіомами.', listen: 'Комедійні шоу, подкасти.', read: 'Колонки, блоги.', write: 'Неформальна розповідь з ідіомами.', mission: 'Запитайте знайомих про улюблені вирази їхнього регіону.' },
        { id: 'b2-7', title: 'Варіанти: Австрія, Швейцарія, діалекти', weeks: '90–92', grammar: 'Австрійська й швейцарська норма (Jänner, Paradeiser, parkieren, grillieren); Perfekt на півдні; розуміння діалектів на слух.', vocab: 'Культура, історія, регіони.', speak: 'Презентація про свій регіон (5 хв).', listen: 'ORF, SRF, регіональне радіо.', read: 'Регіональна преса.', write: 'Есе про культуру (200 слів).', mission: 'Проведіть друзям «екскурсію» своїм містом німецькою.' },
        { id: 'b2-8', title: 'Медіа без адаптації', weeks: '93–96', grammar: 'Складні теми на матеріалі медіа: модальні частки, порядок слів у публіцистиці.', vocab: 'Політика, економіка (на рівні розуміння).', speak: 'Обговоріть новину тижня 10 хвилин.', listen: 'Фільми й серіали без субтитрів, подкасти.', read: 'Книжка німецькомовного автора.', write: 'Рецензія на фільм чи книжку (200 слів).', mission: 'Подивіться німецький фільм без субтитрів і перекажіть його.' },
        { id: 'b2-9', title: 'Підготовка до іспиту B2', weeks: '97–100', grammar: 'Тренування за форматом Goethe-Zertifikat B2 чи telc Deutsch B2: читання, слухання, письмо, усна частина.', vocab: 'Повторення.', speak: 'Пробні усні відповіді: презентація й дискусія.', listen: 'Модельні тести слухання.', read: 'Модельні тести читання.', write: 'Пробне письмо: допис-думка і формальний лист.', mission: 'Зареєструйтеся на іспит у Goethe-Institut чи telc-центрі, якщо сертифікат вам потрібен.' }
      ] }
  ]
};
})(PG.pack('de'));
/* ---- de/data/resources.js ---- */
/* DE.docs перевіряйте частіше, ніж раз на рік: правила щодо § 24 та інтеграційних курсів у 2026 році змінювалися кілька разів */
(function (DE) {
DE.docs = {
  checked: '16.11.2026',
  items: [
    ['Тимчасовий захист (§ 24 AufenthG)', 'Для самого дозволу <b>знання мови не вимагають</b>. Дозволи, чинні на 1.02.2026, автоматично діють <b>до 4.03.2027</b> без окремої заяви. ЄС продовжив тимчасовий захист <b>до 4.03.2028</b> (рішення 2026/1912); як це оформить Німеччина, повідомляють Ausländerbehörde і BAMF.'],
    ['Інтеграційний курс (Integrationskurs)', 'Мовна частина — <b>600 занять</b> по 45 хв, орієнтаційна — 100. Наприкінці — <b>DTZ (Deutsch-Test für Zuwanderer)</b> з результатом A2 або B1 і тест <b>«Leben in Deutschland»</b>. Для тих, хто отримує виплати Jobcenter, курс безкоштовний. У 2026 році BAMF через бюджет кілька разів змінював правила допуску добровільних учасників, зокрема з України, — запитайте в Jobcenter, Ausländerbehörde чи мовній школі, чи вас зараз приймають.'],
    ['Возз\'єднання з чоловіком чи дружиною', 'Зазвичай потрібна <b>A1 ще до в\'їзду</b> (Start Deutsch 1 від Goethe-Institut чи telc або ÖSD A1). Є винятки — уточнюйте в посольстві.'],
    ['Постійний дозвіл (Niederlassungserlaubnis)', 'Зазвичай потрібні <b>B1</b> і знання основ правового й суспільного устрою (тест «Leben in Deutschland»). Найпростіший доказ — успішно завершений інтеграційний курс із DTZ на рівні B1.'],
    ['Громадянство (Einbürgerung)', '<b>B1</b> і тест на громадянство (Einbürgerungstest: 33 питання, щонайменше 17 правильних). Звичайний строк — <b>5 років</b> легального проживання; прискорену натуралізацію за 3 роки скасовано в жовтні 2025 року. Подвійне громадянство з 2024 року дозволене.'],
    ['Австрія', 'Integrationsvereinbarung: <b>модуль 1 (A2)</b> — протягом 2 років для багатьох дозволів, <b>модуль 2 (B1)</b> — для «Daueraufenthalt – EU». Іспити проводить ÖIF (Integrationsprüfung). Для громадянства потрібен B1.'],
    ['Швейцарія', 'Дозвіл C: усно <b>A2</b>, письмово <b>A1</b> (достроковий після 5 років — усно B1). Натуралізація: усно <b>B1</b>, письмово <b>A2</b>. Возз\'єднання сім\'ї: усно A1. Доказ — тест fide або визнаний сертифікат.']
  ],
  note: 'Це не юридична консультація. Правила змінюються, особливо щодо § 24 та інтеграційних курсів; перед поданням документів перевірте вимоги на bamf.de, в Ausländerbehörde або в безкоштовній консультації для мігрантів (Migrationsberatung).',
  links: [['BAMF: інтеграційні курси', 'https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Integrationskurse/integrationskurse-node.html'],
    ['Handbook Germany українською', 'https://handbookgermany.de/uk'],
    ['Рішення ЄС 2026/1912 (тимчасовий захист до 2028)', 'https://eur-lex.europa.eu/eli/dec_impl/2026/1912/oj'],
    ['Австрія: Integrationsvereinbarung', 'https://www.migration.gv.at/de/leben-und-arbeiten-in-oesterreich/rahmenbedingungen-der-integration/integrationsvereinbarung/'],
    ['Швейцарія: тест fide', 'https://fide-service.ch/de/sprachnachweise/fide-test']]
};
DE.exam = {
  text: 'Головні іспити з німецької — Goethe-Zertifikat (Goethe-Institut), telc Deutsch і ÖSD (австрійський). Рівень A1 — Start Deutsch 1: слухання, читання, письмо й усна частина в групі; до цього формату веде підсумковий урок A1.13. В інтеграційному курсі складають DTZ (Deutsch-Test für Zuwanderer, результат A2 або B1) і тест «Leben in Deutschland». Для Niederlassungserlaubnis і громадянства зазвичай потрібен B1: DTZ на рівні B1, Goethe-Zertifikat B1 чи telc Deutsch B1. У Швейцарії мовний рівень для дозволів підтверджують тестом fide. Дати й ціни — на сайтах центрів у вашому місті.',
  links: [['Goethe-Zertifikat A1: Start Deutsch 1', 'https://www.goethe.de/ins/de/de/prf/gzsd1.cfm'], ['Goethe-Zertifikat B1', 'https://www.goethe.de/ins/de/en/prf/prf/gzb1.html'],
    ['telc', 'https://www.telc.net/'], ['ÖSD', 'https://osd.at/'],
    ['BAMF: підсумковий іспит інтеграційного курсу (DTZ, LiD)', 'https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Integrationskurse/Abschlusspruefung/abschlusspruefung-node.html'],
    ['BAMF Online-Testcenter: тест «Leben in Deutschland» і тест на громадянство', 'https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/OnlineTestcenter/online-testcenter-node.html']]
};
DE.resources = [
  { cat: 'Курси', items: [
    ['DW «Nicos Weg»', 'https://learngerman.dw.com/de/nicos-weg/c-36519789', 'Безкоштовний відеокурс Deutsche Welle A1–B1 з вправами: серіал про хлопця, який переїхав до Німеччини.', 'A1–B1'],
    ['DW Learn German українською', 'https://learngerman.dw.com/uk/overview', 'Усі курси Deutsche Welle з інтерфейсом українською: від перших слів до B2, тести на рівень.', 'A1–B2'],
    ['vhs-Lernportal', 'https://www.vhs-lernportal.de/', 'Безкоштовні онлайн-курси німецької від народних університетів (Volkshochschule), близькі до програми інтеграційного курсу. Потрібна безкоштовна реєстрація.', 'A1–B1'],
    ['Goethe-Institut «Deutsch für dich»', 'https://goethe.de/dfd', 'Безкоштовні вправи A1–C2 і підготовка до іспитів (спільноту закрито, вправи доступні).', 'A1–C2'],
    ['deutsch.info', 'https://deutsch.info/', 'Безкоштовний курс A1–B2 з граматикою й порадами для життя в Німеччині та Австрії; частково є українська.', 'A1–B2'],
    ['Sprachportal ÖIF (Австрія)', 'https://sprachportal.at/', 'Безкоштовні вправи, модельні тести й матеріали Австрійського інтеграційного фонду.', 'A1–B1']
  ] },
  { cat: 'Слухання', items: [
    ['Easy German', 'https://www.youtube.com/@EasyGerman', 'Вуличні інтерв\'ю й розмови з двомовними субтитрами — справжня жива мова.', 'A2–B2'],
    ['Tagesschau in 100 Sekunden', 'https://www.tagesschau.de/multimedia/sendung/tagesschau_in_100_sekunden', 'Головні новини дня за 100 секунд. Слухайте щодня, спершу з текстом.', 'B1–B2'],
    ['nachrichtenleicht.de', 'https://www.nachrichtenleicht.de/', 'Новини Deutschlandfunk простою мовою, з аудіо.', 'A2–B1'],
    ['Slow German', 'https://slowgerman.com/', 'Подкаст, де повільно розповідають про життя й культуру Німеччини.', 'A2–B1'],
    ['Coffee Break German', 'https://coffeebreaklanguages.com/coffeebreakgerman/', 'Подкаст-уроки з поясненнями англійською.', 'A1–B1']
  ] },
  { cat: 'Граматика й вправи', items: [
    ['Schubert Verlag: онлайн-вправи', 'https://www.schubert-verlag.de/aufgaben/', 'Безкоштовні інтерактивні вправи з граматики й лексики за рівнями.', 'A1–C1'],
    ['Lingolia Deutsch', 'https://deutsch.lingolia.com/', 'Короткі пояснення граматики з таблицями й вправами.', 'A1–B2']
  ] },
  { cat: 'Словники', items: [
    ['Duden', 'https://www.duden.de/', 'Правопис, рід, множина, значення — головний словник німецької.', 'усі'],
    ['DWDS', 'https://www.dwds.de/', 'Значення, приклади вживання, вимова.', 'A2–B2'],
    ['Verbformen', 'https://www.verbformen.de/', 'Відмінювання будь-якого дієслова й іменника: таблиці часів, Partizip II, допоміжне дієслово.', 'усі'],
    ['DeepL', 'https://www.deepl.com/translator', 'Перекладач з українською. Використовуйте для перевірки, а не замість власного тексту.', 'усі']
  ] },
  { cat: 'Життя в Німеччині', items: [
    ['Handbook Germany українською', 'https://handbookgermany.de/uk', 'Інформація українською про документи, роботу, житло, здоров\'я й навчання.', 'усі'],
    ['BAMF: інтеграційні курси', 'https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Integrationskurse/integrationskurse-node.html', 'Офіційна інформація про інтеграційні курси.', 'усі'],
    ['Make it in Germany: інтеграційні курси', 'https://www.make-it-in-germany.com/de/leben-in-deutschland/deutsch-lernen/integrationskurse', 'Державний портал для фахівців: як побудований курс і як записатися.', 'усі']
  ] },
  { cat: 'Розмовна практика', items: [
    ['Tandem', 'https://tandem.net/en', 'Мовний обмін із носіями: текст, голосові, відеодзвінки.', 'A2–B2'],
    ['HelloTalk', 'https://www.hellotalk.com/en/learn/german', 'Мовний обмін із виправленнями ваших повідомлень.', 'A2–B2']
  ] }
];
})(PG.pack('de'));
