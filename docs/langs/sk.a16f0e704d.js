/* ---- sk/pack.js ---- */
/* Мовний пакет «Словацька»: перевірка відповідей з діакритикою, клавіатура á ä č…, голос, тексти інтерфейсу,
 * тренажер чисел, цін, часу й дат, мовні вимоги для ВНЖ */
(function (SK) {
  'use strict';

  SK.names = { nom: 'словацька', ins: 'словацькою', gen: 'словацької', acc: 'словацьку', adj: 'словацький', adjGen: 'словацького' };
  SK.htmlLang = 'sk';
  SK.variants = null;
  SK.tts = { voices: /^sk([-_]|$)/i, lang: 'sk-SK', online: 'sk' };
  // [слів від, до, вправ від, до, диктантів від]. A1.13 — урок-повторення без нових слів, A1.8b — великий урок про числа й дати;
  // диктантів в A1 по одному, бо на слух словацьку тренує ще й тренажер чисел
  SK.limits = { a0: [12, 25, 10, 16, 2], a1: [0, 36, 10, 21, 1] };
  // Екранна клавіатура: на телефоні й комп'ютері без словацької розкладки інакше не набрати гачки й риски
  SK.keyboard = ['á', 'ä', 'č', 'ď', 'é', 'í', 'ĺ', 'ľ', 'ň', 'ó', 'ô', 'ŕ', 'š', 'ť', 'ú', 'ý', 'ž'];

  const norm = (s) => String(s).toLowerCase().replace(/[.,!?;:"„“”'’«»()…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
  const stripDia = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  // Без діакритики — «майже»: слово впізнається, а гачок учень міг не набрати без словацької розкладки.
  // exact не впливає: у словацьких вправах немає скорочень, які треба розрізняти
  SK.check = function (input, answers) {
    const list = Array.isArray(answers) ? answers : [answers];
    const n = norm(input);
    if (!n) return 'bad';
    if (list.some((a) => norm(a) === n)) return 'ok';
    if (list.some((a) => stripDia(norm(a)) === stripDia(n))) return 'near';
    return 'bad';
  };

  SK.ui = {
    hello: 'Ahoj! 👋',
    praise: 'Výborne!',
    missionDone: 'Výborne! 🎉',
    weekend: 'Вихідний 🙂 Навчання за бажанням: словацьке радіо фоном, серіал, прогулянка з читанням вивісок.',
    weekendRow: 'Вільно. За бажанням — пасивне занурення: радіо, серіал, вивіски.',
    near: '🟡 Майже — перевірте діакритику.',
    strict: 'Суворо перевіряти діакритику (без гачків і рисок відповідь не зараховується)',
    speakTip: '',
    speakHint: 'Забули слово — опишіть його іншими словами.',
    refSearch: 'Пошук у таблицях: напр. «ovocie», «родовий», «môcť»…',
    voiceHello: 'Dobrý deň, ako sa máte?',
    voiceTest: 'Dobrý deň! Volám sa Lukáš. Učíme sa po slovensky.',
    voiceNote: 'Несловацьким голосом тренажер нічого не читає.',
    voiceHelp: '<li><b>Mac</b>: Системні параметри → Доступність → Вміст мовлення (Spoken Content) → Системний голос → «Керувати голосами…» (Manage Voices) → Slovak → <b>Laura</b> → завантажити. Потім перезапустіть браузер.</li>' +
      '<li><b>Microsoft Edge</b> на Windows: зазвичай уже має голоси «Microsoft Lukas / Viktoria Online (Natural) — Slovak» (потрібен інтернет).</li>' +
      '<li><b>Windows</b>: Параметри → Час і мова → Мовлення → Додати голоси → Slovenčina.</li>' +
      '<li><b>Android</b>: Налаштування → Спеціальні можливості → Синтез мовлення → Google → встановіть словацьку.</li>' +
      '<li><b>iPhone / iPad</b>: Параметри → Універсальний доступ → Усний вміст → Голоси → Словацька → Laura.</li>',
    dictPromo: 'Почули нове слово на роботі, в магазині чи по радіо? Додайте його в словник — воно потрапить у повторення, а словник можна експортувати й перенести на інший пристрій.',
    dictIntro: 'Слова, почуті в житті: на роботі, в магазині, по радіо.',
    dictWordPh: 'напр. bloček',
    dictUkPh: 'напр. чек',
    dictNotePh: 'Примітка: рід (m / ž / s), розмовне…',
    dictExPh: 'Приклад: Môžem dostať bloček?',
    dictImportPh: 'bloček — чек\nobčiansky preukaz - посвідчення особи\nnákupný vozík; візок у магазині\n(можна вставити клітинки з Excel чи Google Таблиць: словацьке слово і переклад у сусідніх колонках)',
    drillTitle: '🔢 Тренажер чисел, цін, часу й дат',
    drillIntro: 'Вправи щоразу нові, по 10 за підхід. На слух — записуєте цифрами, «словами» — пишете словацькою (пробіли не важливі). Почніть із «Числа 0–20» і «Ціни».',
    drillBack: ['#/lesson/a1-8b', '← Урок A1.8b'],
    drillCard: ['Тренажер чисел, цін, часу й дат', 'нескінченні диктанти на слух і письмо словами — для каси, транспорту, лікаря']
  };

  SK.drills = [
    ['n20', '🎧 Числа 0–20 на слух', { g: 'numListen', min: 0, max: 20 }],
    ['n100', '🎧 Числа 20–100 на слух', { g: 'numListen', min: 20, max: 100 }],
    ['n999', '🎧 Числа 100–999 на слух', { g: 'numListen', min: 100, max: 999 }],
    ['year', '🎧 Роки й тисячі на слух', { g: 'numListen', min: 1000, max: 2100 }],
    ['price', '🎧 Ціни на слух', { g: 'priceListen', min: 1, max: 99 }],
    ['time', '🎧 Час на слух («о котрій»)', { g: 'timeListen' }],
    ['date', '🎧 Дати на слух', { g: 'dateListen' }],
    ['nw', '✍️ Число → словами', { g: 'numWords', min: 0, max: 999 }],
    ['tw', '✍️ Час → словами', { g: 'timeWords' }],
    ['dw', '✍️ Дата → словами', { g: 'dateWords' }],
    ['mix', '🎲 Мікс усього', null]
  ];

  // Значення в таблиці ВНЖ містять розмітку (<b>), тож html: true; іспит — звичайний текст із посиланнями
  SK.infoCards = () => [
    Object.assign({ title: '🪪 Мова і ВНЖ', html: true }, SK.residence),
    { title: '🎓 Іспит і сертифікат', text: SK.exam.text, links: SK.exam.links }
  ];

  SK.dict = {
    headers: ['slovak', 'sk', 'slovensky', 'slovenčina', 'словацькою', 'словацька', 'слов'],
    csvHeader: 'slovak',
    links: (w) => [
      ['📖 JÚĽŠ SAV', 'https://slovnik.juls.savba.sk/?w=' + encodeURIComponent(PG.sayText(w)), 'Офіційні словники: значення й норма'],
      ['🔊 Forvo', 'https://forvo.com/word/' + encodeURIComponent(PG.sayText(w).toLowerCase()) + '/#sk', 'Вимова носіями мови']
    ]
  };
})(PG.pack('sk'));
/* ---- sk/gen.js ---- */
/* Генератор вправ на числа, ціни, час і дати (без DOM — його також використовує validate.mjs).
 * У даних уроку: { t: 'g', g: '<назва>', min?, max? } — під час запуску перетворюється на звичайну вправу 'l' або 'i'. */
(function (SK) {
(function (SK) {
  'use strict';
  const ONES = ['nula', 'jeden', 'dva', 'tri', 'štyri', 'päť', 'šesť', 'sedem', 'osem', 'deväť', 'desať', 'jedenásť', 'dvanásť', 'trinásť',
    'štrnásť', 'pätnásť', 'šestnásť', 'sedemnásť', 'osemnásť', 'devätnásť'];
  const TENS = ['', '', 'dvadsať', 'tridsať', 'štyridsať', 'päťdesiat', 'šesťdesiat', 'sedemdesiat', 'osemdesiat', 'deväťdesiat'];
  const HUND = ['', 'sto', 'dvesto', 'tristo', 'štyristo', 'päťsto', 'šesťsto', 'sedemsto', 'osemsto', 'deväťsto'];
  const THOU = ['', 'tisíc', 'dvetisíc', 'tritisíc', 'štyritisíc', 'päťtisíc', 'šesťtisíc', 'sedemtisíc', 'osemtisíc', 'deväťtisíc'];
  // «О котрій?» — порядкове числівник ж. р. у місцевому відмінку
  const HOUR_LOC = ['', 'jednej', 'druhej', 'tretej', 'štvrtej', 'piatej', 'šiestej', 'siedmej', 'ôsmej', 'deviatej', 'desiatej', 'jedenástej',
    'dvanástej', 'trinástej', 'štrnástej', 'pätnástej', 'šestnástej', 'sedemnástej', 'osemnástej', 'devätnástej', 'dvadsiatej',
    'dvadsiatej prvej', 'dvadsiatej druhej', 'dvadsiatej tretej'];
  // Дата: порядковий числівник у родовому відмінку
  const ORD_GEN = ['', 'prvého', 'druhého', 'tretieho', 'štvrtého', 'piateho', 'šiesteho', 'siedmeho', 'ôsmeho', 'deviateho', 'desiateho',
    'jedenásteho', 'dvanásteho', 'trinásteho', 'štrnásteho', 'pätnásteho', 'šestnásteho', 'sedemnásteho', 'osemnásteho', 'devätnásteho', 'dvadsiateho'];
  for (let d = 21; d <= 29; d++) ORD_GEN[d] = 'dvadsiateho ' + ORD_GEN[d - 20];
  ORD_GEN[30] = 'tridsiateho'; ORD_GEN[31] = 'tridsiateho prvého';
  const MONTH_GEN = ['', 'januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
  const MONTH_DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  /** Число 0–9999 словами, складені — разом (dvadsaťpäť, stotridsaťštyri). g: 'm' (jeden, dva) | 'f' (jedna, dve) | 'n' (jedno, dve) */
  function words(n, g) {
    if (n === 0) return 'nula';
    if (n === 1) return g === 'f' ? 'jedna' : g === 'n' ? 'jedno' : 'jeden';
    if (n === 2) return g === 'f' || g === 'n' ? 'dve' : 'dva';
    const th = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), r = n % 100;
    let s = THOU[th] + HUND[h];
    if (r) s += r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? ONES[r % 10] : '');
    return s;
  }
  // Ціна: 1 euro / 2–4 eurá / 5+ eur (після складених чисел, написаних разом, — теж eur)
  function euros(e) {
    if (e === 1) return 'jedno euro';
    if (e >= 2 && e <= 4) return words(e, 'n') + ' eurá';
    return words(e) + ' eur';
  }
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const digits = (s) => String(s).replace(/[^\d]/g, '');

  const G = {
    // 🎧 число → цифрами
    numListen(sp) {
      const n = rnd(sp.min ?? 0, sp.max ?? 100);
      return { t: 'l', h: 'Прослухайте й запишіть цифрами', say: words(n), a: String(n), nodia: true, ph: 'цифрами, напр. 47',
        check: (v) => (digits(v) !== '' && Number(digits(v)) === n ? 'ok' : 'bad'), e: 'Словами: ' + words(n) };
    },
    // 🎧 ціна → цифрами
    priceListen(sp) {
      const e = rnd(sp.min ?? 1, sp.max ?? 49);
      const c = Math.random() < 0.25 ? 0 : rnd(10, 99);
      const say = euros(e) + (c ? ' ' + words(c) : '');
      const shown = e + ',' + String(c).padStart(2, '0') + ' €';
      return { t: 'l', h: 'Прослухайте ціну й запишіть цифрами', say, a: shown, nodia: true, ph: 'напр. 3,49',
        check: (v) => {
          const m = String(v).replace(/€|eur[aá]?/gi, '').replace(/\s+/g, '').replace(',-', '').replace(',', '.');
          return m !== '' && !isNaN(+m) && Math.round(+m * 100) === e * 100 + c ? 'ok' : 'bad';
        }, e: 'Словами: ' + say };
    },
    // 🎧 «о котрій» → цифрами
    timeListen() {
      const h = rnd(1, 23), m = Math.random() < 0.4 ? 0 : rnd(10, 59);
      const say = 'o ' + HOUR_LOC[h] + (m ? ' ' + words(m) : '');
      const shown = h + ':' + String(m).padStart(2, '0');
      return { t: 'l', h: 'Прослухайте час і запишіть цифрами', say, a: shown, nodia: true, ph: 'напр. 14:30',
        check: (v) => {
          // Кома — бо на телефоні цифрова клавіатура (inputmode="decimal") у словацькій і українській локалі має кому, а не двокрапку
          const p = String(v).trim().match(/^(\d{1,2})(?:\s*[:.,\s]\s*(\d{2}))?$/);
          if (!p) return 'bad';
          const hh = +p[1], mm = p[2] ? +p[2] : 0;
          return mm === m && (hh === h || (h <= 12 && hh === h + 12) || (h > 12 && hh === h - 12)) ? 'ok' : 'bad';
        }, e: 'Словами: ' + say + (h <= 12 ? ' (можна і ' + (h + 12) + ':' + String(m).padStart(2, '0') + ')' : '') };
    },
    // 🎧 дата → цифрами
    dateListen() {
      const mo = rnd(1, 12), d = rnd(1, MONTH_DAYS[mo]);
      const say = ORD_GEN[d] + ' ' + MONTH_GEN[mo];
      return { t: 'l', h: 'Прослухайте дату й запишіть цифрами (день. місяць.)', say, a: d + '. ' + mo + '.', nodia: true, ph: 'напр. 24. 8.',
        check: (v) => { const p = String(v).match(/(\d{1,2})\D+(\d{1,2})/); return p && +p[1] === d && +p[2] === mo ? 'ok' : 'bad'; },
        e: 'Словами: ' + say };
    },
    // ✍️ число → словами
    numWords(sp) {
      const n = rnd(sp.min ?? 0, sp.max ?? 100);
      const a = [words(n)];
      if (n === 1) a.push('jedna', 'jedno');
      if (n === 2) a.push('dve');
      return { t: 'i', q: 'Напишіть словами число <b>' + n + '</b>', a, nospace: true, say: words(n), e: 'Складені числа пишуть разом: [[' + words(n) + ']]' };
    },
    // ✍️ час → словами
    timeWords() {
      const h = rnd(1, 23), m = Math.random() < 0.6 ? 0 : [15, 20, 30, 45][rnd(0, 3)];
      const ans = 'o ' + HOUR_LOC[h] + (m ? ' ' + words(m) : '');
      return { t: 'i', q: 'О котрій? Напишіть словами: <b>' + h + ':' + String(m).padStart(2, '0') + '</b>', a: [ans, ans.slice(2)], nospace: true, e: '[[' + ans + ']]' };
    },
    // ✍️ дата → словами
    dateWords() {
      const mo = rnd(1, 12), d = rnd(1, MONTH_DAYS[mo]);
      const ans = ORD_GEN[d] + ' ' + MONTH_GEN[mo];
      return { t: 'i', q: 'Напишіть дату словами: <b>' + d + '. ' + mo + '.</b>', a: ans, nospace: true, e: '[[' + ans + ']] — день у родовому відмінку + місяць у родовому' };
    }
  };

  SK.gen = {
    words, euros, HOUR_LOC, ORD_GEN, MONTH_GEN, list: G,
    make(spec) {
      const f = G[spec.g];
      if (!f) throw new Error('Невідомий генератор вправ: ' + spec.g);
      return f(spec);
    }
  };
})(SK);
})(PG.pack("sk"));
/* ---- sk/data/lessons-a0.js ---- */
/* Етап 0 — письмо, читання, вимова. Формат: c — o[0] правильний; i/l — a: рядок або масив; o — a: речення */
(function (SK) {
SK.lessons = SK.lessons || [];
SK.lessons.push(
{
  id: 'a0-1', stage: 'a0', num: '0.1', title: 'Абетка: знайомі звуки і наголос', dur: '2 дні',
  goals: ['читати прості слова латиницею', 'знати, як звучать c, ch, h, g, j, y', 'ставити наголос на перший склад'],
  theory: `
<p>Словацька пише латиницею. В абетці <b>46 літер</b> — разом із <b>ch, dz, dž</b> і літерами з позначками. Майже завжди <b>одна літера = один звук</b>, тому читати легко.</p>
<div class="tblwrap"><table><tr><th>Літера</th><th>Звук</th><th>Приклад</th></tr>
<tr><td><b>c</b></td><td>ц</td><td>[[cukor]] — цукор, [[ulica]] — вулиця</td></tr>
<tr><td><b>ch</b></td><td>х</td><td>[[chlieb]] — хліб, [[chyba]] — помилка</td></tr>
<tr><td><b>h</b></td><td>г (як в українській!)</td><td>[[hora]] — гора, [[hlava]] — голова</td></tr>
<tr><td><b>g</b></td><td>ґ</td><td>[[guma]] — гума, [[gombík]] — ґудзик</td></tr>
<tr><td><b>j</b></td><td>й</td><td>[[jablko]] — яблуко, [[moja]] — моя</td></tr>
<tr><td><b>i</b> та <b>y</b></td><td>обидві = «і»</td><td>[[syn]] — син, [[ryba]] — риба, [[byt]] — квартира</td></tr>
<tr><td><b>dz</b> / <b>dž</b></td><td>дз / дж</td><td>[[medzi]] — між, [[džús]] — сік</td></tr>
</table></div>
<div class="tip"><b>y ≠ українське «и».</b> Словацькі <b>i</b> та <b>y</b> звучать однаково — як «і». Різниця лише в написанні: її вчать для письма (рівень B1–B2).</div>
<h3>Наголос — завжди на першому складі</h3>
<p>Це найпростіше правило мови: [[Slovensko]] — <b>СЛО</b>-вен-ско, [[Bratislava]] — <b>БРА</b>-ти-сла-ва, [[Ukrajina]] — <b>У</b>-кра-ї-на. Односкладовий прийменник забирає наголос на себе: [[do práce]] — <b>ДО</b>-пра-це, [[na stole]] — <b>НА</b>-сто-ле.</p>
<div class="good">Як і в українській, голосні не «акають»: [[voda]] звучить «вода», не «вада». А <b>h</b> — те саме м'яке українське «г».</div>
<p class="small muted">Натискайте на сині слова, щоб послухати. Якщо звуку немає, відкрийте «Налаштування» і виберіть словацький голос.</p>`,
  vocab: [['cukor', 'цукор'], ['ulica', 'вулиця'], ['chlieb', 'хліб'], ['chyba', 'помилка'], ['hora', 'гора; також «ліс»'], ['hlava', 'голова'],
    ['jablko', 'яблуко'], ['byt', 'квартира', 'не «побут»!'], ['syn', 'син'], ['ryba', 'риба'], ['voda', 'вода'], ['mlieko', 'молоко'],
    ['káva', 'кава'], ['mama', 'мама'], ['otec', 'батько'], ['dom', 'дім'], ['Slovensko', 'Словаччина'], ['Ukrajina', 'Україна']],
  ex: [
    { t: 'c', q: 'Як читається <b>c</b> у слові «ulica»?', o: ['ц', 'к', 'с'] },
    { t: 'c', q: '<b>ch</b> у слові «chlieb» звучить як…', o: ['х', 'ч', 'ш'] },
    { t: 'c', q: '<b>h</b> у слові «hora» звучить як…', o: ['українське «г» (гора)', '«ґ» (ґанок)', '«х» (хата)'] },
    { t: 'c', q: '<b>g</b> у слові «guma» звучить як…', o: ['ґ', 'г', 'дж'] },
    { t: 'c', q: 'Де наголос у слові «Bratislava»?', o: ['BRA-tislava', 'Bra-TI-slava', 'Brati-SLA-va'] },
    { t: 'c', q: 'Чи різняться у вимові <b>i</b> та <b>y</b>?', o: ['Ні, обидві звучать як «і»', 'y звучить як українське «и»', 'y звучить як «ий»'] },
    { t: 'c', q: 'Що означає «byt»?', o: ['квартира', 'бути', 'побут'], e: 'Перший «фальшивий друг». «Бути» — [[byť]].' },
    { t: 'i', q: 'Напишіть словацькою: <b>вода</b>', a: 'voda' },
    { t: 'i', q: 'Напишіть словацькою: <b>хліб</b>', a: 'chlieb' },
    { t: 'i', q: 'Напишіть словацькою: <b>голова</b>', a: 'hlava' },
    { t: 'l', a: 'mlieko', tr: 'молоко' },
    { t: 'l', a: 'Slovensko', tr: 'Словаччина' }
  ],
  say: [['Slovensko', 'Словаччина'], ['Bratislava', 'Братислава'], ['Ukrajina', 'Україна'], ['ulica', 'вулиця'], ['chlieb a cukor', 'хліб і цукор'], ['jablko', 'яблуко']],
  speak: ['Прочитайте вголос з наголосом на першому складі: Slovensko, Bratislava, Ukrajina, ulica, chlieb, jablko. Запишіть себе й порівняйте з озвученням.'],
  mission: 'У супермаркеті або на вулиці прочитайте вголос (можна пошепки) 10 написів чи назв продуктів. Наголос — на перший склад.'
},
{
  id: 'a0-2', stage: 'a0', num: '0.2', title: 'Гачки (mäkčeň) і м\'які звуки', dur: '2 дні',
  goals: ['читати č, š, ž, ď, ť, ň, ľ', 'знати правило de-te-ne-le', 'бачити винятки (telefón)'],
  theory: `
<p>Гачок <b>ˇ</b> називається <b>mäkčeň</b> («пом'якшувач»). Він робить звук шиплячим або м'яким:</p>
<div class="tblwrap"><table><tr><th>Літера</th><th>Звук</th><th>Приклад</th></tr>
<tr><td><b>č</b></td><td>ч</td><td>[[čaj]] — чай, [[večer]] — вечір</td></tr>
<tr><td><b>š</b></td><td>ш</td><td>[[škola]] — школа, [[taška]] — сумка</td></tr>
<tr><td><b>ž</b></td><td>ж</td><td>[[žena]] — жінка, дружина</td></tr>
<tr><td><b>ď</b></td><td>дь</td><td>[[ďakujem]] — дякую, [[ďaleko]] — далеко</td></tr>
<tr><td><b>ť</b></td><td>ть</td><td>[[ťažký]] — важкий</td></tr>
<tr><td><b>ň</b></td><td>нь</td><td>[[deň]] — день</td></tr>
<tr><td><b>ľ</b></td><td>ль</td><td>[[soľ]] — сіль, [[ľavý]] — лівий</td></tr>
</table></div>
<p class="small muted">У малих ď, ť, ľ гачок схожий на апостроф — це той самий mäkčeň.</p>
<h3>Правило de-te-ne-le</h3>
<p>Перед <b>e, i, í, ie</b> приголосні <b>d, t, n, l</b> звучать <b>м'яко</b>, хоча гачка немає:</p>
<p>[[deti]] ≈ «дєті» (діти), [[teplo]] ≈ «тєпло», [[leto]] ≈ «лєто» (літо), [[ticho]] ≈ «тіхо» (тихо), [[nič]] — нічого, [[dedina]] ≈ «дєдіна» (село).</p>
<div class="note"><b>Винятки (тверда вимова):</b> запозичення — [[telefón]], [[televízor]], [[politika]]; кілька власних слів — [[ten]], [[tento]], [[jeden]], [[teraz]], [[kedy]], [[vtedy]]; закінчення прикметників — [[dobré]], [[mladé]]. Поки що просто впізнавайте їх.</div>`,
  vocab: [['čaj', 'чай'], ['večer', 'вечір; ввечері'], ['škola', 'школа'], ['taška', 'сумка; пакет'], ['žena', 'жінка; дружина'], ['ďakujem', 'дякую'],
    ['ďaleko', 'далеко'], ['ťažký', 'важкий'], ['deň', 'день'], ['soľ', 'сіль'], ['ľavý', 'лівий'], ['pravý', 'правий'], ['deti', 'діти'],
    ['teplo', 'тепло'], ['leto', 'літо'], ['ticho', 'тихо; тиша'], ['nič', 'нічого'], ['často', 'часто']],
  ex: [
    { t: 'c', q: 'Як читається <b>č</b>?', o: ['ч', 'ц', 'к'] },
    { t: 'c', q: 'Як читається <b>ň</b> у слові «deň»?', o: ['нь', 'н', 'ньо'] },
    { t: 'c', q: 'У слові «deti» літера <b>d</b> читається…', o: ['м\'яко (дь)', 'твердо (д)'] },
    { t: 'c', q: 'У слові «telefón» літера <b>t</b> читається…', o: ['твердо', 'м\'яко'], e: 'Це запозичення, тому вимова тверда.' },
    { t: 'c', q: 'Що означає «žena»?', o: ['жінка, дружина', 'жовтий', 'жнива'] },
    { t: 'i', q: 'Додайте гачок: «dakujem» → ?', a: 'ďakujem' },
    { t: 'i', q: 'Напишіть словацькою: <b>день</b>', a: 'deň' },
    { t: 'i', q: 'Напишіть словацькою: <b>сіль</b>', a: 'soľ' },
    { t: 'i', q: 'Напишіть словацькою: <b>школа</b>', a: 'škola' },
    { t: 'l', a: 'ďakujem', tr: 'дякую' },
    { t: 'l', a: 'teplo', tr: 'тепло' }
  ],
  say: [['ďakujem', 'дякую'], ['deti', 'діти'], ['teplo', 'тепло'], ['leto', 'літо'], ['telefón', 'телефон'], ['večer', 'вечір']],
  speak: ['Прочитайте парами й відчуйте різницю: deti (м\'яко) — telefón (твердо); leto — televízor. Запишіть себе.'],
  mission: 'Знайдіть у місті 5 написів із č, š, ž, ď, ť, ň, ľ (вивіски, етикетки, таблички вулиць) і прочитайте їх уголос.'
},
{
  id: 'a0-3', stage: 'a0', num: '0.3', title: 'Довгі голосні, ô, ä і дифтонги', dur: '2 дні',
  goals: ['тягнути довгі голосні, не переносячи наголос', 'читати ô, ä, ia, ie, iu', 'впізнавати ритмічний закон'],
  theory: `
<p>Риска <b>´</b> (dĺžeň) означає, що голосний вимовляють <b>удвічі довше</b>: á, é, í, ý, ó, ú, а також ĺ, ŕ.</p>
<div class="note"><b>Головна пастка для українців: довгота — не наголос!</b> Наголос лишається на першому складі. [[robí]] = <b>РО</b>-бі: (наголос на «ro», а «í» просто тягнеться). [[prosím]] = <b>ПРО</b>-сі:м.</div>
<p>Довгота змінює значення: [[sud]] (бочка) — [[súd]] (суд); [[rad]] (ряд) — [[rád]] (радий, охоче).</p>
<h3>Дифтонги та особливі літери — один склад</h3>
<div class="tblwrap"><table><tr><th>Пишемо</th><th>Звучить</th><th>Приклад</th></tr>
<tr><td><b>ô</b></td><td>«уо»</td><td>[[kôň]] — кінь, [[stôl]] — стіл, [[môj]] — мій</td></tr>
<tr><td><b>ie</b></td><td>«іє»</td><td>[[chlieb]] — хліб, [[biely]] — білий, [[mlieko]] — молоко</td></tr>
<tr><td><b>ia</b></td><td>«я»</td><td>[[piatok]] — п'ятниця</td></tr>
<tr><td><b>iu</b></td><td>«ю»</td><td>[[tretiu]] — третю</td></tr>
<tr><td><b>ä</b></td><td>у літературній мові — «е»</td><td>[[mäso]] — м'ясо, [[päť]] — п'ять</td></tr>
</table></div>
<div class="good"><b>Підказка через українську:</b> ô часто відповідає нашому «і» (kôň — кінь, stôl — стіл, môj — мій); ie теж буває «і» (chlieb — хліб, biely — білий, rieka — ріка); ä/ia часто відповідають «я» (mäso — м'ясо, päť — п'ять, piatok — п'ятниця).</div>
<h3>Ритмічний закон</h3>
<p>Два довгі склади поспіль зазвичай не стоять — другий стає коротким: [[pekný]] (короткий + довгий), але [[krásny]] (довгий + короткий); [[biely]], а не «bielý». Є винятки — поки що просто впізнавайте.</p>`,
  vocab: [['súd', 'суд'], ['rád / rada', 'радий / рада; охоче'], ['piatok', 'п\'ятниця'], ['mlieko', 'молоко'], ['biely', 'білий'], ['rieka', 'річка'],
    ['miesto', 'місце'], ['kôň', 'кінь'], ['stôl', 'стіл'], ['môj', 'мій'], ['dôležitý', 'важливий'], ['mäso', 'м\'ясо'], ['päť', 'п\'ять'],
    ['pekný', 'гарний'], ['krásny', 'прекрасний'], ['prosím', 'будь ласка; прошу'], ['áno', 'так'], ['nie', 'ні; не']],
  ex: [
    { t: 'c', q: 'Де наголос у слові «robí»?', o: ['на «ro»', 'на «bí»'], e: 'Довге «í» тягнеться, але наголос завжди на першому складі.' },
    { t: 'c', q: 'Що позначає риска над голосним (á, í, ú…)?', o: ['довготу', 'наголос', 'м\'якість'] },
    { t: 'c', q: '<b>ô</b> читається як…', o: ['«уо» одним складом', '«о»', '«ов»'] },
    { t: 'c', q: '<b>ä</b> у літературній вимові звучить як…', o: ['«е»', '«а»', '«я»'] },
    { t: 'c', q: 'Яке слово написане правильно (ритмічний закон)?', o: ['krásny', 'krásný'] },
    { t: 'c', q: 'Українським «кінь, стіл, мій» у словацькій часто відповідає…', o: ['ô', 'ie', 'ä'] },
    { t: 'c', q: 'Що означає «súd»?', o: ['суд', 'посуд', 'сусід'] },
    { t: 'i', q: 'Напишіть словацькою (з довгим голосним): <b>будь ласка</b>', a: 'prosím' },
    { t: 'i', q: 'Напишіть словацькою: <b>стіл</b> (підказка: ô)', a: 'stôl' },
    { t: 'i', q: 'Напишіть словацькою: <b>м\'ясо</b> (підказка: ä)', a: 'mäso' },
    { t: 'l', a: 'piatok', tr: 'п\'ятниця' },
    { t: 'l', a: 'Áno, prosím.', tr: 'Так, будь ласка.' }
  ],
  say: [['sud — súd', 'бочка — суд'], ['rad — rád', 'ряд — радий'], ['kôň, stôl, môj', 'кінь, стіл, мій'], ['mlieko a chlieb', 'молоко і хліб'], ['krásny a pekný', 'прекрасний і гарний'], ['mäso', 'м\'ясо']],
  speak: ['Вимовте пари, тримаючи наголос на першому складі: sud/súd, rad/rád. Потім: krásny, pekný, biely, dôležitý. Запишіть себе.'],
  mission: 'Знайдіть на етикетках у магазині 5 слів з ô, ä або ie (наприклад, mlieko, mäso) і прочитайте їх із правильною довготою.'
},
{
  id: 'a0-4', stage: 'a0', num: '0.4', title: '«Хитрі» слова: r і l без голосних, оглушення', dur: '2 дні',
  goals: ['читати vlk, prst, štvrtok', 'оглушувати приголосні в кінці слова', 'вимовляти v як «ў» в кінці складу'],
  theory: `
<h3>Слова без голосних</h3>
<p><b>r</b> і <b>l</b> можуть утворювати склад самі: [[vlk]] (вовк), [[krk]] (шия), [[prst]] (палець), [[slnko]] (сонце), [[štvrtok]] (четвер), [[krv]] (кров), [[vŕba]] (верба). Скоромовка: [[Strč prst cez krk.]] («Просунь палець крізь шию»).</p>
<h3>Оглушення в кінці слова — не як в українській!</h3>
<p>Ми кажемо «дуб» дзвінко. Словаки, як і росіяни, оглушують: [[dub]] → «дуп», [[hrad]] → «грат», [[muž]] → «муш», [[sneh]] → «снєх».</p>
<p>Сусідні приголосні уподібнюються: [[kde]] → «ґдє», [[ľahký]] → «ляхкі».</p>
<h3>v наприкінці складу</h3>
<p>Тут усе як в українській (вовк = «воўк»): [[domov]] → «домоў», [[ostrov]] → «остроў», [[pravda]] → «праўда».</p>`,
  vocab: [['vlk', 'вовк'], ['krk', 'шия', 'не «крик»'], ['prst', 'палець'], ['slnko', 'сонце'], ['štvrtok', 'четвер'], ['krv', 'кров'],
    ['dub', 'дуб'], ['hrad', 'замок, фортеця', 'не «град»: град — krupobitie'], ['muž', 'чоловік'], ['sneh', 'сніг'], ['domov', 'додому'],
    ['pravda', 'правда'], ['kde', 'де'], ['ľahký', 'легкий'], ['vŕba', 'верба']],
  ex: [
    { t: 'c', q: 'Скільки складів у слові «vlk»?', o: ['один', 'нуль', 'два'] },
    { t: 'c', q: 'Як звучить «dub»?', o: ['«дуп»', '«дуб» (дзвінко)', '«дув»'] },
    { t: 'c', q: 'Як читається «kde»?', o: ['«ґдє»', '«кде»', '«ке»'] },
    { t: 'c', q: 'Що означає «hrad»?', o: ['замок (фортеця)', 'град (опади)', 'місто'] },
    { t: 'c', q: 'Що означає «krk»?', o: ['шия', 'крик', 'крок'] },
    { t: 'c', q: 'Як вимовити «domov»?', o: ['«домоў» (як «вовк»)', '«домоф»', '«домов» з чітким «в»'] },
    { t: 'i', q: 'Напишіть словацькою: <b>сонце</b>', a: 'slnko' },
    { t: 'i', q: 'Напишіть словацькою: <b>четвер</b>', a: 'štvrtok' },
    { t: 'i', q: 'Напишіть словацькою: <b>вовк</b>', a: 'vlk' },
    { t: 'l', a: 'Strč prst cez krk.', tr: 'Просунь палець крізь шию.' },
    { t: 'l', a: 'slnko', tr: 'сонце' }
  ],
  say: [['Strč prst cez krk.', 'Просунь палець крізь шию.'], ['vlk, prst, slnko', 'вовк, палець, сонце'], ['štvrtok', 'четвер'], ['dub, hrad, muž', 'дуб, замок, чоловік'], ['Kde je to?', 'Де це?']],
  speak: ['Скажіть скоромовку «Strč prst cez krk» 5 разів, щоразу швидше. Запишіть останню спробу.'],
  mission: 'Вивчіть, як правильно вимовляти назву вашої вулиці й зупинки, а тоді перевірте себе за оголошеннями в транспорті.'
},
{
  id: 'a0-5', stage: 'a0', num: '0.5', title: 'Перші фрази й числа 0–20', dur: '2 дні',
  goals: ['привітатися й попрощатися (Ty / Vy)', 'представитися і сказати, що не розумієте', 'рахувати до 20'],
  theory: `
<h3>Вітання та прощання</h3>
<p>[[Dobrý deň]] — універсальне «добрий день» (у магазині, в установі). [[Dobré ráno]] — добрий ранок, [[Dobrý večer]] — добрий вечір, [[Dobrú noc]] — на добраніч.
[[Ahoj]] — «привіт» і «бувай» для друзів. [[Dovidenia]] — до побачення. [[Maj sa]] / [[Majte sa]] — бувай / бувайте.</p>
<h3>Ввічливість</h3>
<p>[[Ďakujem]] — дякую. [[Prosím]] — будь ласка; а також «Що, перепрошую?», коли не почули. [[Nech sa páči]] — «прошу», коли щось подаєте. [[Prepáčte]] — вибачте. [[Nie je za čo]] — нема за що. [[Áno]] / [[Nie]] — так / ні (у розмові часто [[hej]] = так).</p>
<h3>Знайомство і «рятувальні» фрази</h3>
<p>[[Volám sa Anna.]] — Мене звати Анна. [[Ako sa voláte?]] / [[Ako sa voláš?]] — Як вас / тебе звати? [[Som z Ukrajiny.]] — Я з України. [[Teší ma.]] — Приємно познайомитися.
[[Nerozumiem.]] — Не розумію. [[Ešte raz, prosím.]] — Ще раз, будь ласка. [[Hovorte pomaly, prosím.]] — Говоріть повільно, будь ласка. [[Hovoríte po anglicky?]]</p>
<div class="tip"><b>Ty чи Vy?</b> До незнайомих, старших, у магазині й установі кажіть <b>Vy</b>: [[Ako sa máte?]] — Як справи? Друзям: [[Ako sa máš?]] Відповідь: [[Dobre, ďakujem. A vy?]]</div>
<div class="note">Словаки, почувши акцент, часто переходять на англійську чи російську. Попросіть: [[Hovorte so mnou po slovensky, prosím.]] — «Говоріть зі мною словацькою, будь ласка».</div>
<h3>Числа 0–20</h3>
<div class="tblwrap"><table><tr><td>0 [[nula]]</td><td>1 [[jeden]] / [[jedna]] / [[jedno]]</td><td>2 [[dva]] / [[dve]]</td><td>3 [[tri]]</td><td>4 [[štyri]]</td></tr>
<tr><td>5 [[päť]]</td><td>6 [[šesť]]</td><td>7 [[sedem]]</td><td>8 [[osem]]</td><td>9 [[deväť]]</td></tr>
<tr><td>10 [[desať]]</td><td>11 [[jedenásť]]</td><td>12 [[dvanásť]]</td><td>13 [[trinásť]]</td><td>14 [[štrnásť]]</td></tr>
<tr><td>15 [[pätnásť]]</td><td>16 [[šestnásť]]</td><td>17 [[sedemnásť]]</td><td>18 [[osemnásť]]</td><td>19 [[devätnásť]]</td></tr><tr><td>20 [[dvadsať]]</td><td colspan="4" class="small muted">jeden (ч.) / jedna (ж.) / jedno (с.); dva (ч.) / dve (ж., с.)</td></tr></table></div>`,
  vocab: [['Dobrý deň', 'Добрий день'], ['Dobré ráno', 'Добрий ранок'], ['Dobrý večer', 'Добрий вечір'], ['Ahoj', 'Привіт / Бувай'], ['Dovidenia', 'До побачення'],
    ['Dobrú noc', 'На добраніч'], ['Ďakujem', 'Дякую'], ['Prosím', 'Будь ласка'], ['Nech sa páči', 'Прошу (коли подаєте)'], ['Prepáčte', 'Вибачте'],
    ['Teší ma', 'Приємно познайомитися'], ['Nerozumiem', 'Не розумію'], ['Ešte raz, prosím', 'Ще раз, будь ласка'], ['jeden', 'один'], ['dva', 'два'],
    ['tri', 'три'], ['štyri', 'чотири'], ['päť', 'п\'ять'], ['šesť', 'шість'], ['sedem', 'сім'], ['osem', 'вісім'], ['deväť', 'дев\'ять'], ['desať', 'десять'], ['dvadsať', 'двадцять']],
  ex: [
    { t: 'c', q: 'Як привітатися з продавцем удень?', o: ['Dobrý deň', 'Ahoj', 'Dobrú noc'] },
    { t: 'c', q: 'Як попрощатися в установі?', o: ['Dovidenia', 'Ahoj', 'Maj sa'] },
    { t: 'c', q: 'Ви подаєте комусь річ: «Прошу»', o: ['Nech sa páči', 'Prepáčte', 'Nerozumiem'] },
    { t: 'c', q: '«Teší ma» означає…', o: ['Приємно познайомитися', 'Мене тішить погода', 'Мені тісно'] },
    { t: 'c', q: 'Як сказати «Я не розумію»?', o: ['Nerozumiem.', 'Neviem.', 'Nemám.'] },
    { t: 'o', q: 'Мене звати Анна.', a: 'Volám sa Anna.' },
    { t: 'o', q: 'Я з України.', a: ['Som z Ukrajiny.', 'Z Ukrajiny som.'] },
    { t: 'o', q: 'Говоріть повільно, будь ласка.', a: ['Hovorte pomaly, prosím.', 'Prosím, hovorte pomaly.', 'Hovorte, prosím, pomaly.'] },
    { t: 'i', q: 'Напишіть словами число <b>5</b>', a: 'päť' },
    { t: 'i', q: 'Напишіть словами число <b>12</b>', a: 'dvanásť' },
    { t: 'l', a: 'Dobrý deň, ako sa máte?', tr: 'Добрий день, як справи?' },
    { t: 'l', a: 'sedemnásť', tr: '17' }
  ],
  say: [['Dobrý deň!', 'Добрий день!'], ['Volám sa …, som z Ukrajiny.', 'Мене звати …, я з України.'], ['Teší ma.', 'Приємно познайомитися.'], ['Prepáčte, nerozumiem.', 'Вибачте, не розумію.'], ['Hovorte pomaly, prosím.', 'Говоріть повільно, будь ласка.'], ['Hovorte so mnou po slovensky, prosím.', 'Говоріть зі мною словацькою, будь ласка.']],
  speak: ['Представтеся вголос: «Dobrý deň, volám sa …, som z Ukrajiny. Teší ma.»', 'Порахуйте вголос від 1 до 20 і назад.'],
  mission: 'Сьогодні в магазині чи кав\'ярні привітайтеся (Dobrý deň), подякуйте (Ďakujem) і попрощайтеся (Dovidenia). Якщо не зрозуміли: «Prepáčte, nerozumiem. Ešte raz, prosím.»'
}
);
})(PG.pack("sk"));
/* ---- sk/data/lessons-a1a.js ---- */
/* A1, частина 1: уроки A1.1–A1.6 */
(function (SK) {
SK.lessons = SK.lessons || [];
SK.lessons.push(
{
  id: 'a1-1', stage: 'a1', num: 'A1.1', title: 'Som, si, je — дієслово byť і знайомство', dur: '1 тиждень',
  goals: ['відмінювати byť', 'сказати, хто ви і звідки', 'будувати заперечення й питання'],
  theory: `
<h3>Особові займенники</h3>
<p>[[ja]] — я, [[ty]] — ти, [[on]] — він, [[ona]] — вона, [[ono]] — воно, [[my]] — ми, [[vy]] — ви, [[oni]] — вони (чоловіки або змішана група), [[ony]] — вони (жінки, предмети).</p>
<p>Займенник зазвичай <b>пропускають</b>, бо закінчення дієслова і так показує особу: [[Som z Ukrajiny.]] Кажіть «Ja som…», лише коли хочете наголосити.</p>
<h3>byť — бути. В українській воно випадає, у словацькій — ні!</h3>
<div class="tblwrap"><table><tr><th>однина</th><th></th><th>множина</th><th></th></tr>
<tr><td>ja</td><td>[[som]]</td><td>my</td><td>[[sme]]</td></tr>
<tr><td>ty</td><td>[[si]]</td><td>vy</td><td>[[ste]]</td></tr>
<tr><td>on / ona / ono</td><td>[[je]]</td><td>oni / ony</td><td>[[sú]]</td></tr></table></div>
<p>[[Som Ukrajinec.]] / [[Som Ukrajinka.]] — Я українець / українка. [[Si doma?]] — Ти вдома? [[Je to drahé.]] — Це дорого. [[Sme v Bratislave.]] [[Ste zo Slovenska?]] [[Sú doma.]]</p>
<h3>Заперечення й питання</h3>
<p>З byť заперечення пишеться <b>окремо</b>: [[nie som]], [[nie si]], [[nie je]], [[nie sme]], [[nie ste]], [[nie sú]]. Усі інші дієслова — разом: [[nerozumiem]].</p>
<p>Питання без питального слова ставлять інтонацією: [[Ste Slovák?]] З питальним словом: [[Kto je to?]] — Хто це? [[Čo je to?]] — Що це? [[Odkiaľ ste?]] — Звідки ви?</p>
<h3>Національності та мови</h3>
<p>[[Slovák]] / [[Slovenka]], [[Ukrajinec]] / [[Ukrajinka]], [[Čech]] / [[Češka]], [[Poliak]] / [[Poľka]]. Мовою: [[po slovensky]], [[po ukrajinsky]], [[po anglicky]]. [[Hovorím po ukrajinsky a trochu po slovensky.]]</p>
<p>Звідки: [[z Ukrajiny]], [[z Kyjeva]], [[zo Slovenska]] («zo» ставлять перед s, z, š, ž та деякими групами приголосних). Поки що вчіть це як готові фрази.</p>
<div class="tip"><b>Vykanie.</b> Одній людині ввічливо кажуть <b>vy + множина</b>: [[Vy ste pán Novák?]]</div>`,
  vocab: [['ja', 'я'], ['ty', 'ти'], ['on / ona / ono', 'він / вона / воно'], ['my', 'ми'], ['vy', 'ви'], ['oni / ony', 'вони'], ['byť', 'бути'],
    ['Slovák / Slovenka', 'словак / словачка'], ['Ukrajinec / Ukrajinka', 'українець / українка'], ['Odkiaľ ste?', 'Звідки ви?'], ['doma', 'вдома'],
    ['kto', 'хто'], ['čo', 'що'], ['kde', 'де'], ['ako', 'як'], ['trochu', 'трохи'], ['hovoriť', 'говорити'], ['po slovensky', 'словацькою'],
    ['a', 'і; а'], ['ale', 'але'], ['tu', 'тут'], ['tam', 'там']],
  ex: [
    { t: 'i', q: 'Вставте byť: Ja ___ z Ukrajiny.', a: 'som' },
    { t: 'i', q: 'Вставте byť: Ty ___ doma?', a: 'si' },
    { t: 'i', q: 'Вставте byť: My ___ v Bratislave.', a: 'sme' },
    { t: 'i', q: 'Вставте byť: Oni ___ zo Slovenska.', a: 'sú' },
    { t: 'i', q: 'Вставте byť: Vy ___ Slovák?', a: 'ste' },
    { t: 'c', q: '«Я не словак»', o: ['Nie som Slovák.', 'Nesom Slovák.', 'Som nie Slovák.'], e: 'З byť заперечення пишеться окремо: nie som.' },
    { t: 'c', q: 'Незнайомій людині: «Звідки ви?»', o: ['Odkiaľ ste?', 'Odkiaľ si?', 'Odkiaľ sú?'] },
    { t: 'c', q: 'Жінка з України каже:', o: ['Som Ukrajinka.', 'Som Ukrajinec.', 'Je Ukrajinka.'] },
    { t: 'c', q: '«Вони (жінки) вдома»', o: ['Ony sú doma.', 'Oni je doma.', 'Ony sme doma.'] },
    { t: 'o', q: 'Він не вдома.', a: ['On nie je doma.', 'On doma nie je.'] },
    { t: 'o', q: 'Ми зі Словаччини.', a: ['Sme zo Slovenska.', 'Zo Slovenska sme.'] },
    { t: 'l', a: 'Odkiaľ ste?', tr: 'Звідки ви?' },
    { t: 'l', a: 'Som z Ukrajiny.', tr: 'Я з України.' }
  ],
  say: [['Som z Ukrajiny.', 'Я з України.'], ['Odkiaľ ste?', 'Звідки ви?'], ['Nie som Slovák, som Ukrajinec.', 'Я не словак, я українець.'], ['Hovorím trochu po slovensky.', 'Я трохи говорю словацькою.'], ['Kto je to?', 'Хто це?']],
  speak: ['Представтеся в 4–5 реченнях: ім\'я, національність, звідки ви, якими мовами говорите.', 'Дайте відповідь уголос: Odkiaľ ste? Hovoríte po slovensky? Ste Slovák / Slovenka?'],
  mission: 'Представтеся словацькою комусь новому — сусідові, колезі, баристі: «Dobrý deň, som …, som z Ukrajiny.»'
},
{
  id: 'a1-2', stage: 'a1', num: 'A1.2', title: 'Ten, tá, to — рід і прикметники', dur: '1 тиждень',
  goals: ['визначати рід за закінченням', 'вживати ten / tá / to', 'узгоджувати прикметники'],
  theory: `
<p>Родів три, як в українській. Рід визначають за закінченням (називний відмінок однини):</p>
<div class="tblwrap"><table><tr><th>Рід</th><th>Закінчення</th><th>Приклади</th></tr>
<tr><td>чоловічий</td><td>приголосний (живі істоти — також -a)</td><td>[[dom]], [[obchod]] (магазин), [[muž]], [[kolega]]</td></tr>
<tr><td>жіночий</td><td>-a, -ia; -osť; деякі на приголосний</td><td>[[žena]], [[káva]], [[ulica]], [[radosť]], [[noc]], [[soľ]]</td></tr>
<tr><td>середній</td><td>-o, -e, -ie; -a/-ä у назвах малят</td><td>[[mesto]], [[auto]], [[more]], [[námestie]] (площа), [[dievča]], [[dieťa]]</td></tr></table></div>
<div class="note"><b>Рід не такий, як в українській:</b> [[byt]] — ч. р. (квартира — ж. р.), [[dievča]] і [[dieťa]] — с. р. (дівчина, дитина — ж. р.), [[stolička]] — ж. р. (стілець — ч. р.), [[posteľ]] — ж. р. (ліжко — с. р.).</div>
<h3>ten — tá — to</h3>
<p>[[ten obchod]], [[tá káva]], [[to mesto]]. Для будь-якого роду: [[To je…]] — «Це…»: [[To je môj byt.]]</p>
<h3>Прикметники</h3>
<p>Твердий тип: <b>-ý / -á / -é</b>: [[pekný byt]], [[pekná ulica]], [[pekné mesto]]. Після довгого складу закінчення коротке (ритмічний закон): [[krásny]], [[krásna]], [[krásne]].</p>
<p>М'який тип: <b>-í / -ia / -ie</b>: [[cudzí]] (чужий, іноземний), [[cudzia]], [[cudzie]].</p>
<p>Питання: [[Aký?]] [[Aká?]] [[Aké?]] — який / яка / яке. [[Aký je ten byt?]] — [[Je veľký a pekný.]]</p>`,
  vocab: [['obchod', 'магазин', 'не «обхід»'], ['mesto', 'місто'], ['auto', 'авто'], ['byt (m)', 'квартира'], ['izba', 'кімната'], ['dievča (s)', 'дівчина'],
    ['dieťa (s)', 'дитина'], ['stolička (ž)', 'стілець', 'не «столиця»'], ['posteľ (ž)', 'ліжко'], ['veľký', 'великий'], ['malý', 'малий'], ['nový', 'новий'],
    ['starý', 'старий'], ['drahý', 'дорогий'], ['lacný', 'дешевий'], ['dobrý', 'добрий, хороший'], ['zlý', 'поганий, злий'], ['pekný', 'гарний'],
    ['studený', 'холодний'], ['teplý', 'теплий'], ['aký / aká / aké', 'який / яка / яке']],
  ex: [
    { t: 'c', q: 'Який рід у слова «byt»?', o: ['чоловічий', 'жіночий', 'середній'] },
    { t: 'c', q: 'Який рід у слова «dievča»?', o: ['середній', 'жіночий', 'чоловічий'] },
    { t: 'c', q: 'Який рід у слова «posteľ»?', o: ['жіночий', 'середній', 'чоловічий'] },
    { t: 'i', q: '___ mesto (ten / tá / to)', a: 'to' },
    { t: 'i', q: '___ káva (ten / tá / to)', a: 'tá' },
    { t: 'i', q: '___ obchod (ten / tá / to)', a: 'ten' },
    { t: 'i', q: 'Узгодьте: pekný + ulica → ___ ulica', a: 'pekná' },
    { t: 'i', q: 'Узгодьте: nový + auto → ___ auto', a: 'nové' },
    { t: 'i', q: 'Узгодьте: krásny + mesto → ___ mesto', a: 'krásne', e: 'Ритмічний закон: після довгого «krá» закінчення коротке.' },
    { t: 'c', q: '«велика квартира»', o: ['veľký byt', 'veľká byt', 'veľké byt'] },
    { t: 'o', q: 'Це гарне місто.', a: ['To je pekné mesto.', 'Je to pekné mesto.'] },
    { t: 'o', q: 'Ця кава холодна.', a: 'Tá káva je studená.' },
    { t: 'l', a: 'Ten byt je veľký a pekný.', tr: 'Ця квартира велика й гарна.' }
  ],
  say: [['To je pekné mesto.', 'Це гарне місто.'], ['Aký je ten byt?', 'Яка ця квартира?'], ['Je malý, ale pekný.', 'Вона мала, але гарна.'], ['Tá káva je studená.', 'Ця кава холодна.']],
  speak: ['Опишіть свою квартиру або місто 3–5 прикметниками: «Môj byt je malý, ale pekný…»', 'Назвіть 10 предметів навколо себе з ten / tá / to і прикметником.'],
  mission: 'У супермаркеті назвіть подумки чи вголос 10 речей із ten / tá / to і прикметником: ten veľký melón, tá lacná káva…'
},
{
  id: 'a1-3', stage: 'a1', num: 'A1.3', title: 'Mám, nemám — mať і знахідний відмінок', dur: '1 тиждень',
  goals: ['відмінювати mať', 'ставити іменники в знахідний відмінок', 'розповідати про сім\'ю'],
  theory: `
<h3>mať — мати</h3>
<p>[[mám]], [[máš]], [[má]], [[máme]], [[máte]], [[majú]]. Заперечення: [[nemám]], [[nemáš]]… [[Mám brata.]] [[Nemám čas.]] [[Máte otázku?]]</p>
<h3>Знахідний відмінок (akuzatív): кого? що?</h3>
<div class="tblwrap"><table><tr><th>Тип</th><th>Зміна</th><th>Приклад</th></tr>
<tr><td>ж. р. на -a</td><td>-a → <b>-u</b></td><td>[[káva]] → [[Mám kávu.]] [[sestra]] → [[Mám sestru.]]</td></tr>
<tr><td>ж. р. на приголосний</td><td>без змін</td><td>[[posteľ]] → [[posteľ]]</td></tr>
<tr><td>с. р.</td><td>без змін</td><td>[[Mám auto.]] [[Mám dieťa.]]</td></tr>
<tr><td>ч. р. неживі</td><td>без змін</td><td>[[Mám byt.]] [[Mám telefón.]]</td></tr>
<tr><td>ч. р. живі</td><td><b>-a</b> (як «брата»); на -a → -u</td><td>[[Mám brata.]] [[syna]], [[pes]] → [[psa]] (е випадає), [[kolega]] → [[kolegu]]</td></tr></table></div>
<p>Прикметники в знахідному: ж. р. <b>-ú</b> — [[Mám novú prácu.]]; ч. р. живі <b>-ého</b> — [[Mám dobrého kamaráta.]] Решта — без змін.</p>
<h3>Сім'я</h3>
<p>[[rodina]] — сім'я, [[mama]], [[otec]], [[rodičia]] — батьки, [[brat]], [[sestra]], [[syn]], [[dcéra]], [[manžel]] — чоловік, [[manželka]] — дружина, [[dieťa]] → [[deti]], [[babka]], [[dedko]].</p>
<p>Вік: [[Koľko máte rokov?]] — Скільки вам років? [[Mám tridsať rokov.]] Як в українській, число змінює форму: 1 [[rok]], 2–4 [[roky]], 5+ [[rokov]].</p>`,
  vocab: [['mať', 'мати'], ['rodina', 'сім\'я'], ['mama', 'мама'], ['otec', 'батько'], ['rodičia', 'батьки'], ['brat', 'брат'], ['sestra', 'сестра'],
    ['syn', 'син'], ['dcéra', 'донька'], ['manžel', 'чоловік (у шлюбі)'], ['manželka', 'дружина'], ['dieťa / deti', 'дитина / діти'], ['babka', 'бабуся'],
    ['dedko', 'дідусь'], ['pes', 'собака, пес'], ['mačka', 'кішка'], ['práca', 'робота'], ['čas', 'час'], ['rok', 'рік'],
    ['kamarát / kamarátka', 'приятель / приятелька'], ['otázka', 'питання']],
  ex: [
    { t: 'i', q: 'Ja ___ (mať) brata.', a: 'mám' },
    { t: 'i', q: 'Oni ___ (mať) dve deti.', a: 'majú' },
    { t: 'i', q: 'My ___ (mať) čas.', a: 'máme' },
    { t: 'i', q: 'Ty ___ (mať) psa?', a: 'máš' },
    { t: 'i', q: 'Mám (sestra) → Mám ___.', a: 'sestru' },
    { t: 'i', q: 'Mám (brat) → Mám ___.', a: 'brata' },
    { t: 'i', q: 'Mám (auto) → Mám ___.', a: 'auto' },
    { t: 'i', q: 'Mám (pes) → Mám ___.', a: 'psa', e: 'pes → psa: «е» випадає.' },
    { t: 'c', q: '«Я не маю часу»', o: ['Nemám čas.', 'Nie mám čas.', 'Mám nie čas.'] },
    { t: 'c', q: 'Чому в реченні «Mám novú prácu» стоїть «novú»?', o: ['прикметник ж. р. у знахідному: -á → -ú', 'це помилка', 'це множина'] },
    { t: 'o', q: 'У мене є брат і сестра.', a: 'Mám brata a sestru.' },
    { t: 'o', q: 'Скільки вам років?', a: ['Koľko máte rokov?', 'Koľko rokov máte?'] },
    { t: 'l', a: 'Mám manželku a dve deti.', tr: 'У мене є дружина і двоє дітей.' }
  ],
  say: [['Mám brata a sestru.', 'У мене є брат і сестра.'], ['Nemám čas.', 'Я не маю часу.'], ['Koľko máte rokov?', 'Скільки вам років?'], ['Mám novú prácu.', 'У мене нова робота.']],
  speak: ['Розкажіть про свою сім\'ю в 5 реченнях: «Mám…, Nemám…, Môj brat je…»'],
  mission: 'Розкажіть комусь 2–3 речення про свою сім\'ю — колезі, сусідові чи в мовному клубі. Або надиктуйте собі голосове повідомлення.'
},
{
  id: 'a1-4', stage: 'a1', num: 'A1.4', title: 'Čo robíš? — теперішній час', dur: '1 тиждень',
  goals: ['відмінювати дієслова трьох основних типів', 'розповідати про свій день', 'запитати, де людина живе й працює'],
  theory: `
<div class="good"><b>Добра новина:</b> у 1-й особі однини дієслово <b>завжди закінчується на -m</b>: robím, volám, píšem, pracujem, idem.</div>
<div class="tblwrap"><table><tr><th></th><th>-ám: volať (дзвонити, кликати)</th><th>-ím: robiť (робити)</th><th>-em: písať (писати)</th><th>-ujem: pracovať</th></tr>
<tr><td>ja</td><td>volám</td><td>robím</td><td>píšem</td><td>pracujem</td></tr>
<tr><td>ty</td><td>voláš</td><td>robíš</td><td>píšeš</td><td>pracuješ</td></tr>
<tr><td>on/ona</td><td>volá</td><td>robí</td><td>píše</td><td>pracuje</td></tr>
<tr><td>my</td><td>voláme</td><td>robíme</td><td>píšeme</td><td>pracujeme</td></tr>
<tr><td>vy</td><td>voláte</td><td>robíte</td><td>píšete</td><td>pracujete</td></tr>
<tr><td>oni</td><td>volajú</td><td>robia</td><td>píšu</td><td>pracujú</td></tr></table></div>
<p>Усі дієслова на <b>-ovať</b> мають форму <b>-ujem</b>: [[pracovať]] → [[pracujem]], [[kupovať]] → [[kupujem]], [[potrebovať]] → [[potrebujem]] (мені потрібно).</p>
<p>Тип <b>-iem</b>: [[rozumieť]] → [[rozumiem]], [[rozumieš]], [[rozumie]], [[rozumieme]], [[rozumiete]], [[rozumejú]].</p>
<p>Ритмічний закон: після довгого складу закінчення коротке — [[čítam]] (а не «čítám»), [[vrátim]].</p>
<p>Заперечення пишемо разом: [[nerobím]], [[nepracujem]], [[nerozumiem]].</p>
<div class="note"><b>Неправильне дієслово:</b> jesť (їсти) — [[jem]], [[ješ]], [[je]], [[jeme]], [[jete]], [[jedia]].</div>
<p>[[Kde bývate?]] — Де ви живете? [[Bývam v Bratislave.]] [[Kde pracujete?]] — [[Pracujem v obchode.]] [[Čo robíš večer?]]</p>`,
  vocab: [['robiť', 'робити'], ['hovoriť', 'говорити'], ['rozumieť', 'розуміти'], ['bývať', 'жити, мешкати'], ['pracovať', 'працювати'],
    ['potrebovať', 'потребувати'], ['čítať', 'читати'], ['písať', 'писати'], ['volať', 'дзвонити; кликати'], ['hľadať', 'шукати', 'не «дивитися»!'],
    ['počúvať', 'слухати'], ['pozerať', 'дивитися'], ['variť', 'варити, готувати'], ['platiť', 'платити'], ['vidieť', 'бачити'], ['kupovať', 'купувати'],
    ['piť', 'пити (pijem)'], ['jesť', 'їсти (jem)']],
  ex: [
    { t: 'i', q: 'robiť → ja ___', a: 'robím' },
    { t: 'i', q: 'volať → oni ___', a: 'volajú' },
    { t: 'i', q: 'písať → ty ___', a: 'píšeš' },
    { t: 'i', q: 'pracovať → my ___', a: 'pracujeme' },
    { t: 'i', q: 'rozumieť, заперечення → ja ___', a: 'nerozumiem' },
    { t: 'i', q: 'bývať → vy ___', a: 'bývate' },
    { t: 'i', q: 'čítať → ja ___ (обережно з ритмічним законом)', a: 'čítam' },
    { t: 'i', q: 'hovoriť → oni ___', a: 'hovoria' },
    { t: 'c', q: 'Що означає «hľadať»?', o: ['шукати', 'дивитися', 'гладити'] },
    { t: 'c', q: '«Kde bývate?» означає…', o: ['Де ви живете?', 'Де ви буваєте?', 'Де ви працюєте?'] },
    { t: 'o', q: 'Я живу в Братиславі і працюю в магазині.', a: 'Bývam v Bratislave a pracujem v obchode.' },
    { t: 'o', q: 'Мені потрібна допомога.', a: 'Potrebujem pomoc.' },
    { t: 'l', a: 'Čo robíš večer?', tr: 'Що ти робиш увечері?' },
    { t: 'l', a: 'Nerozumiem, hovorte pomaly.', tr: 'Не розумію, говоріть повільно.' }
  ],
  say: [['Kde bývate?', 'Де ви живете?'], ['Bývam v Bratislave.', 'Я живу в Братиславі.'], ['Kde pracujete?', 'Де ви працюєте?'], ['Potrebujem pomoc.', 'Мені потрібна допомога.'], ['Ráno pijem kávu.', 'Вранці я п\'ю каву.']],
  speak: ['Розкажіть про свій звичайний день, використавши 5–6 дієслів: «Ráno pijem kávu, potom pracujem…»', 'Дайте відповідь уголос: Kde bývate? Kde pracujete? Čo robíte večer?'],
  mission: 'В аптеці чи магазині скажіть, що вам потрібно: «Potrebujem…» + слово (знайдіть його заздалегідь).'
},
{
  id: 'a1-5', stage: 'a1', num: 'A1.5', title: 'Kde? — v / na + місцевий відмінок', dur: '1 тиждень',
  goals: ['сказати, де щось знаходиться', 'утворювати місцевий відмінок однини', 'зрозуміти пояснення дороги'],
  theory: `
<p><b>Kde?</b> → <b>v / na + місцевий відмінок (lokál)</b>, як в українській.</p>
<p><b>v</b> — всередині (будівля, місто, країна): [[v obchode]], [[v Bratislave]]. <b>na</b> — на поверхні, а також з частиною установ і заходів: [[na pošte]], [[na úrade]], [[na stanici]], [[na ulici]], [[na koncerte]].</p>
<div class="note"><b>Не як в українській:</b> «на роботі» → [[v práci]]; «у Словаччині» → [[na Slovensku]]; «в Україні» → традиційно [[na Ukrajine]].</div>
<h3>Закінчення місцевого відмінка однини</h3>
<div class="tblwrap"><table><tr><th>Тип</th><th>Закінчення</th><th>Приклади</th></tr>
<tr><td>ч. р. неживі</td><td>-e; після k, g, h, ch — -u; м'які — -i</td><td>[[v obchode]], [[na stole]], [[v parku]], [[na trhu]], [[v hoteli]]</td></tr>
<tr><td>ж. р. на -a</td><td>-e; м'які (-ca, -ia, -ňa) — -i</td><td>[[v škole]], [[na pošte]], [[v práci]], [[na ulici]], [[v kuchyni]]</td></tr>
<tr><td>с. р.</td><td>-e (після k, g, h, ch — -u); -ie → -í</td><td>[[v meste]], [[v aute]], [[na námestí]]</td></tr></table></div>
<p>Без прийменника: [[doma]] — вдома.</p>
<h3>Як знайти дорогу</h3>
<p>[[Kde je pošta?]] — [[Pošta je na námestí.]] [[Je to ďaleko?]] — [[Nie, je to blízko.]]
[[vľavo]] — ліворуч, [[vpravo]] — праворуч, [[rovno]] — прямо, [[za rohom]] — за рогом.</p>`,
  vocab: [['pošta', 'пошта'], ['lekáreň', 'аптека'], ['potraviny', 'продуктовий магазин'], ['stanica', 'станція, вокзал'], ['zastávka', 'зупинка'],
    ['námestie', 'площа'], ['úrad', 'установа, відомство'], ['nemocnica', 'лікарня'], ['banka', 'банк'], ['trh', 'ринок'], ['vľavo', 'ліворуч'],
    ['vpravo', 'праворуч'], ['rovno', 'прямо'], ['blízko', 'близько'], ['ďaleko', 'далеко'], ['v práci', 'на роботі'], ['na Slovensku', 'у Словаччині']],
  ex: [
    { t: 'i', q: 'v (obchod) → v ___', a: 'obchode' },
    { t: 'i', q: 'na (pošta) → na ___', a: 'pošte' },
    { t: 'i', q: 'v (práca) → v ___', a: 'práci' },
    { t: 'i', q: 'v (mesto) → v ___', a: 'meste' },
    { t: 'i', q: 'na (ulica) → na ___', a: 'ulici' },
    { t: 'i', q: 'v (park) → v ___', a: 'parku', e: 'Після k, g, h, ch закінчення -u.' },
    { t: 'c', q: '«Я на роботі»', o: ['Som v práci.', 'Som na práci.', 'Som na prácu.'] },
    { t: 'c', q: '«Я живу в Словаччині»', o: ['Bývam na Slovensku.', 'Bývam v Slovensku.', 'Bývam v Slovensko.'] },
    { t: 'c', q: 'Що означає «zastávka»?', o: ['зупинка', 'застава', 'затримка'] },
    { t: 'o', q: 'Де тут аптека?', a: ['Kde je tu lekáreň?', 'Kde tu je lekáreň?'] },
    { t: 'o', q: 'Пошта на площі, ліворуч.', a: 'Pošta je na námestí, vľavo.' },
    { t: 'l', a: 'Je to ďaleko? Nie, je to blízko.', tr: 'Це далеко? Ні, це близько.' }
  ],
  say: [['Prepáčte, kde je tu lekáreň?', 'Вибачте, де тут аптека?'], ['Je to ďaleko?', 'Це далеко?'], ['Choďte rovno a potom vľavo.', 'Ідіть прямо, а потім ліворуч.'], ['Som v práci.', 'Я на роботі.'], ['Bývam na Slovensku.', 'Я живу в Словаччині.']],
  speak: ['Опишіть свій район: «Obchod je blízko, pošta je na námestí…»', 'Поясніть, як дійти від дому до найближчої зупинки (vľavo, vpravo, rovno).'],
  mission: 'Запитайте на вулиці дорогу, навіть якщо знаєте її: «Prepáčte, kde je tu pošta / lekáreň?» — і зрозумійте відповідь.'
},
{
  id: 'a1-6', stage: 'a1', num: 'A1.6', title: 'Kam? — ísť, do / na, транспорт', dur: '1 тиждень',
  goals: ['відмінювати ísť', 'сказати, куди йдете (do + родовий, na + знахідний)', 'їздити громадським транспортом'],
  theory: `
<h3>ísť — іти або їхати (один раз, зараз)</h3>
<p>[[idem]], [[ideš]], [[ide]], [[ideme]], [[idete]], [[idú]]. [[Idem domov.]] [[Kam ideš?]] Регулярно — [[chodiť]]: [[Každý deň chodím do práce.]]</p>
<h3>Kam? Логіка проста: де «v» → куди «do»; де «na» → куди «na»</h3>
<div class="tblwrap"><table><tr><th>Kde? (місцевий)</th><th>Kam?</th></tr>
<tr><td>v obchode, v práci, v škole, v meste</td><td><b>do + родовий</b>: [[do obchodu]], [[do práce]], [[do školy]], [[do mesta]], [[do Bratislavy]]</td></tr>
<tr><td>na pošte, na stanici, na úrade, na Slovensku</td><td><b>na + знахідний</b>: [[na poštu]], [[na stanicu]], [[na úrad]], [[na Slovensko]]</td></tr>
<tr><td>doma</td><td>[[domov]] (без прийменника)</td></tr></table></div>
<p>Родовий однини: ж. р. -a → <b>-y</b> (škola → školy), м'які -ca → <b>-e</b> (práca → práce); с. р. -o → <b>-a</b> (mesto → mesta); ч. р. неживі — переважно <b>-u</b> (obchod → obchodu).</p>
<h3>Транспорт (MHD)</h3>
<p>Транспортом — орудний відмінок, а дієслово те саме: [[ísť autobusom]], [[električkou]] (трамваєм), [[vlakom]], [[autom]]; пішки — [[pešo]].</p>
<p>[[lístok]] — квиток, [[nastúpiť]] — сісти, [[vystúpiť]] — вийти, [[prestúpiť]] — пересісти. [[Ide tento autobus na stanicu?]] [[Kde mám vystúpiť?]] [[Jeden lístok, prosím.]] [[Ďalšia zastávka…]] — наступна зупинка…</p>`,
  vocab: [['ísť', 'іти, їхати'], ['kam', 'куди'], ['domov', 'додому'], ['chodiť', 'ходити (регулярно)'], ['autobus', 'автобус'], ['električka', 'трамвай'],
    ['vlak', 'поїзд'], ['lístok', 'квиток'], ['nastúpiť', 'сісти (в транспорт)'], ['vystúpiť', 'вийти (з транспорту)'], ['prestúpiť', 'пересісти'],
    ['pešo', 'пішки'], ['rýchlo', 'швидко'], ['pomaly', 'повільно'], ['teraz', 'зараз'], ['každý deň', 'щодня'], ['cesta', 'дорога; подорож']],
  ex: [
    { t: 'i', q: 'ísť → my ___', a: 'ideme' },
    { t: 'i', q: 'ísť → oni ___', a: 'idú' },
    { t: 'i', q: 'Kam? do (obchod) → do ___', a: 'obchodu' },
    { t: 'i', q: 'Kam? do (škola) → do ___', a: 'školy' },
    { t: 'i', q: 'Kam? do (mesto) → do ___', a: 'mesta' },
    { t: 'i', q: 'Kam? na (pošta) → na ___', a: 'poštu' },
    { t: 'c', q: '«Я йду на роботу»', o: ['Idem do práce.', 'Idem na prácu.', 'Idem v práci.'] },
    { t: 'c', q: '«Їду трамваєм»', o: ['Idem električkou.', 'Idem na električke.', 'Idem s električka.'] },
    { t: 'c', q: '«Я йду додому»', o: ['Idem domov.', 'Idem doma.'] },
    { t: 'o', q: 'Де мені вийти?', a: 'Kde mám vystúpiť?' },
    { t: 'o', q: 'Один квиток, будь ласка.', a: ['Jeden lístok, prosím.', 'Prosím, jeden lístok.'] },
    { t: 'l', a: 'Ide tento autobus na stanicu?', tr: 'Цей автобус їде на вокзал?' }
  ],
  say: [['Ide tento autobus na stanicu?', 'Цей автобус їде на вокзал?'], ['Kde mám vystúpiť?', 'Де мені вийти?'], ['Idem do práce električkou.', 'Я їду на роботу трамваєм.'], ['Jeden lístok, prosím.', 'Один квиток, будь ласка.']],
  speak: ['Розкажіть, як ви добираєтеся на роботу або до магазину: «Ráno idem autobusom do práce…»'],
  mission: 'На зупинці чи в транспорті запитайте: «Ide tento autobus / táto električka na …?» Або купіть квиток словацькою.'
}
);
})(PG.pack("sk"));
/* ---- sk/data/lessons-a1b.js ---- */
/* A1, частина 2: уроки A1.7–A1.13 */
(function (SK) {
SK.lessons = SK.lessons || [];
SK.lessons.push(
{
  id: 'a1-7', stage: 'a1', num: 'A1.7', title: 'Koľko to stojí? — числа, ціни, магазин', dur: '1 тиждень',
  goals: ['числа до 1000', 'ціни: euro / eurá / eur', 'купувати на прилавку й платити'],
  theory: `
<h3>Числа 20–1000</h3>
<p>20 [[dvadsať]], 30 [[tridsať]], 40 [[štyridsať]], 50 [[päťdesiat]], 60 [[šesťdesiat]], 70 [[sedemdesiat]], 80 [[osemdesiat]], 90 [[deväťdesiat]], 100 [[sto]], 200 [[dvesto]], 300 [[tristo]], 500 [[päťsto]], 1000 [[tisíc]].</p>
<p>Складені числа пишуть разом: 25 [[dvadsaťpäť]], 134 [[stotridsaťštyri]].</p>
<h3>1 / 2–4 / 5+ — як в українській</h3>
<div class="tblwrap"><table><tr><th>1</th><th>2–4</th><th>5 і більше</th></tr>
<tr><td>[[jedno euro]]</td><td>[[dve eurá]]</td><td>[[päť eur]]</td></tr>
<tr><td>[[jeden cent]]</td><td>[[tri centy]]</td><td>[[desať centov]]</td></tr>
<tr><td>[[jedna káva]]</td><td>[[dve kávy]]</td><td>[[päť káv]]</td></tr></table></div>
<p>[[Koľko to stojí?]] — Скільки це коштує? [[Stojí to päť eur.]] Ціну 2,50 € кажуть так: [[dve eurá päťdesiat]].</p>
<h3>У магазині</h3>
<p>[[Prosím si…]] — «Дайте, будь ласка…» (найчастіше на прилавку). [[Chcel by som…]] / [[Chcela by som…]] — Я хотів би / хотіла б…
[[Máte…?]] — У вас є…? [[Ešte niečo?]] — Щось іще? [[To je všetko.]] — Це все. [[Môžem platiť kartou?]] — Можна заплатити карткою? [[v hotovosti]] — готівкою. [[Potrebujete tašku?]] — Потрібен пакет?</p>
<div class="tip"><b>Вага по-словацьки:</b> [[deka]] = 10 грамів. [[Prosím si dvadsať deka šunky.]] = 200 г шинки. Також [[pol kila]] — пів кіло, [[kus]] — штука.</div>
<div class="note"><b>Пастки:</b> [[ovocie]] — фрукти (овочі — [[zelenina]]); [[paradajka]] — помідор; [[syr]] — твердий сир, а кисломолочний — [[tvaroh]]; [[smotana]] — вершки (сметана — [[kyslá smotana]]).</div>`,
  vocab: [['koľko', 'скільки'], ['stáť (stojí)', 'коштувати'], ['euro / eurá / eur', 'євро'], ['pokladnica', 'каса'], ['kartou', 'карткою'],
    ['v hotovosti', 'готівкою'], ['rožok', 'булочка (рогалик)'], ['maslo', 'масло'], ['syr', 'сир (твердий)'], ['tvaroh', 'кисломолочний сир'],
    ['šunka', 'шинка'], ['vajce', 'яйце'], ['zelenina', 'овочі'], ['ovocie', 'фрукти', 'не «овочі»!'], ['paradajka', 'помідор'], ['uhorka', 'огірок'],
    ['zemiaky', 'картопля'], ['deka', '10 грамів'], ['sto', 'сто'], ['tisíc', 'тисяча']],
  ex: [
    { t: 'i', q: 'Напишіть словами: <b>30</b>', a: 'tridsať' },
    { t: 'i', q: 'Напишіть словами: <b>50</b>', a: 'päťdesiat' },
    { t: 'i', q: 'Напишіть словами: <b>100</b>', a: 'sto' },
    { t: 'i', q: '2 € → dve ___', a: 'eurá' },
    { t: 'i', q: '5 € → päť ___', a: 'eur' },
    { t: 'c', q: '«Ovocie» — це…', o: ['фрукти', 'овочі', 'вівці'] },
    { t: 'c', q: '«Paradajka» — це…', o: ['помідор', 'паради', 'перець'] },
    { t: 'c', q: 'Як попросити на прилавку «Дайте, будь ласка, хліб»?', o: ['Prosím si chlieb.', 'Daj chlieb.', 'Chcem chleba.'] },
    { t: 'c', q: '«10 deka» — це…', o: ['100 грамів', '10 грамів', '1 кілограм'] },
    { t: 'o', q: 'Скільки це коштує?', a: 'Koľko to stojí?' },
    { t: 'o', q: 'Можна заплатити карткою?', a: 'Môžem platiť kartou?' },
    { t: 'l', a: 'To je všetko, ďakujem.', tr: 'Це все, дякую.' },
    { t: 'l', a: 'Stojí to sedem eur.', tr: 'Це коштує сім євро.' }
  ],
  say: [['Prosím si dvadsať deka šunky.', 'Дайте, будь ласка, 200 грамів шинки.'], ['Koľko to stojí?', 'Скільки це коштує?'], ['Môžem platiť kartou?', 'Можна заплатити карткою?'], ['To je všetko, ďakujem.', 'Це все, дякую.'], ['Chcela by som dva rožky.', 'Я хотіла б дві булочки.']],
  speak: ['Розіграйте сценку в магазині: попросіть 3 продукти з кількістю, запитайте ціну і як можна заплатити.'],
  mission: 'Купіть щось на прилавку словацькою: «Dobrý deň, prosím si dvadsať deka šunky.» І запитайте: «Môžem platiť kartou?»'
},
{
  id: 'a1-8', stage: 'a1', num: 'A1.8', title: 'Koľko je hodín? — час, дні, місяці', dur: '1 тиждень',
  goals: ['дні тижня і місяці', 'котра година, о котрій', 'читати години роботи'],
  theory: `
<h3>Дні тижня. Коли? → v + знахідний</h3>
<p>[[pondelok]], [[utorok]], [[streda]], [[štvrtok]], [[piatok]], [[sobota]], [[nedeľa]].
Коли: [[v pondelok]], [[v utorok]], [[v stredu]], [[vo štvrtok]], [[v piatok]], [[v sobotu]], [[v nedeľu]]; на вихідних — [[cez víkend]].</p>
<p>[[dnes]] — сьогодні, [[zajtra]] — завтра, [[včera]] — вчора. [[ráno]] — вранці, [[dopoludnia]] — до обіду, [[popoludní]] — після обіду, [[večer]] — увечері, [[v noci]] — вночі.</p>
<h3>Котра година?</h3>
<p>[[Koľko je hodín?]] — [[Je jedna hodina.]] [[Sú dve hodiny.]] [[Sú tri hodiny.]] [[Je päť hodín.]] (знову 1 / 2–4 / 5+).</p>
<p>О котрій? [[O koľkej?]] — [[o jednej]], [[o druhej]], [[o tretej]], [[o štvrtej]], [[o piatej]], [[o šiestej]], [[o siedmej]], [[o ôsmej]], [[o deviatej]], [[o desiatej]], [[o jedenástej]], [[o dvanástej]].</p>
<div class="good">Як в українській: [[o pol tretej]] = о пів на третю (2:30).</div>
<h3>Місяці. У якому місяці?</h3>
<p>[[január]], [[február]], [[marec]], [[apríl]], [[máj]], [[jún]], [[júl]], [[august]], [[september]], [[október]], [[november]], [[december]].
[[v januári]], [[vo februári]], [[v marci]], [[v máji]], [[v júni]], [[v auguste]], [[v decembri]].</p>
<h3>Години роботи</h3>
<p>[[otvorené]] — відчинено, [[zatvorené]] — зачинено, [[otváracie hodiny]] — години роботи. Скорочення днів: Po, Ut, St, Št, Pi, So, Ne.</p>`,
  vocab: [['pondelok', 'понеділок'], ['utorok', 'вівторок'], ['streda', 'середа'], ['štvrtok', 'четвер'], ['piatok', 'п\'ятниця'], ['sobota', 'субота'],
    ['nedeľa', 'неділя'], ['víkend', 'вихідні'], ['dnes', 'сьогодні'], ['zajtra', 'завтра'], ['včera', 'вчора'], ['ráno', 'ранок; вранці'],
    ['hodina', 'година; урок'], ['minúta', 'хвилина'], ['týždeň', 'тиждень'], ['mesiac', 'місяць'], ['otvorené', 'відчинено'], ['zatvorené', 'зачинено'],
    ['O koľkej?', 'О котрій?']],
  ex: [
    { t: 'c', q: 'Коли? «у середу»', o: ['v stredu', 'v streda', 'v strede'] },
    { t: 'c', q: 'Коли? «у четвер»', o: ['vo štvrtok', 'v štvrtok', 'na štvrtok'] },
    { t: 'i', q: 'Напишіть словацькою: <b>субота</b>', a: 'sobota' },
    { t: 'i', q: 'Напишіть словацькою: <b>завтра</b>', a: 'zajtra' },
    { t: 'c', q: '«Котра година?»', o: ['Koľko je hodín?', 'Koľko hodina?', 'Aká je hodina?'] },
    { t: 'c', q: '3:00 — як правильно?', o: ['Sú tri hodiny.', 'Je tri hodín.', 'Sú tri hodín.'] },
    { t: 'i', q: 'О котрій? О 5:00 → o ___', a: 'piatej' },
    { t: 'i', q: 'О котрій? О 8:00 → o ___', a: 'ôsmej' },
    { t: 'c', q: '«o pol tretej» — це…', o: ['2:30', '3:30', '3:15'] },
    { t: 'o', q: 'У неділю магазин зачинений.', a: ['V nedeľu je obchod zatvorený.', 'Obchod je v nedeľu zatvorený.'] },
    { t: 'l', a: 'Zajtra o siedmej večer.', tr: 'Завтра о сьомій вечора.' }
  ],
  say: [['Koľko je hodín?', 'Котра година?'], ['O koľkej?', 'О котрій?'], ['V pondelok o deviatej.', 'У понеділок о дев\'ятій.'], ['Cez víkend je zatvorené.', 'На вихідних зачинено.']],
  speak: ['Опишіть свій тиждень: «V pondelok pracujem, v sobotu idem na trh…»', 'Кілька разів за день назвіть уголос, котра година.'],
  mission: 'Знайдіть години роботи пошти чи магазину поруч і прочитайте їх уголос. Або домовтеся словацькою про час зустрічі.'
},
{
  id: 'a1-8b', stage: 'a1', num: 'A1.8b', title: 'Числа, дати, пори року й кольори', dur: '1 тиждень',
  goals: ['впевнено розуміти на слух ціни, числа й час', 'називати місяці й дати, казати про день народження', 'пори року й кольори'],
  theory: `
<div class="tip"><b>🔢 Головна практика цього уроку — тренажер чисел.</b> Голос називає випадкове число, ціну, час або дату, а ви записуєте цифрами. І навпаки: бачите цифри й пишете словами. Вправи щоразу нові.<br><a class="btn primary small" href="#/drill" style="margin-top:6px">Відкрити тренажер чисел, цін, часу й дат</a></div>
<h3>Числа до 9999</h3>
<div class="tblwrap"><table><tr><th>одиниці</th><th>десятки</th><th>сотні</th><th>тисячі</th></tr>
<tr><td>11 [[jedenásť]]</td><td>20 [[dvadsať]]</td><td>100 [[sto]]</td><td>1000 [[tisíc]]</td></tr>
<tr><td>12 [[dvanásť]]</td><td>30 [[tridsať]]</td><td>200 [[dvesto]]</td><td>2000 [[dvetisíc]]</td></tr>
<tr><td>13 [[trinásť]]</td><td>40 [[štyridsať]]</td><td>300 [[tristo]]</td><td>3000 [[tritisíc]]</td></tr>
<tr><td>14 [[štrnásť]]</td><td>50 [[päťdesiat]]</td><td>400 [[štyristo]]</td><td>5000 [[päťtisíc]]</td></tr>
<tr><td>15 [[pätnásť]]</td><td>60 [[šesťdesiat]]</td><td>500 [[päťsto]]</td><td></td></tr>
<tr><td>16 [[šestnásť]]</td><td>70 [[sedemdesiat]]</td><td>600 [[šesťsto]]</td><td></td></tr>
<tr><td>17 [[sedemnásť]]</td><td>80 [[osemdesiat]]</td><td>700 [[sedemsto]]</td><td></td></tr>
<tr><td>18 [[osemnásť]]</td><td>90 [[deväťdesiat]]</td><td>800 [[osemsto]]</td><td></td></tr>
<tr><td>19 [[devätnásť]]</td><td></td><td>900 [[deväťsto]]</td><td></td></tr></table></div>
<p>Складені числа пишуть <b>разом</b>: 25 [[dvadsaťpäť]], 134 [[stotridsaťštyri]], 2026 [[dvetisícdvadsaťšesť]].</p>
<div class="note"><b>Пастки:</b> «-desiat» є тільки в 50–90 (päťdesiat), а 20, 30, 40 закінчуються на «-dsať» (dvadsať, tridsať, štyridsať). 200 і 2000 — через «dve»: [[dvesto]], [[dvetisíc]].</div>
<p>Іменник після числа — як в українській: 1 / 2–4 / 5+ ([[jedno euro]], [[dve eurá]], [[päť eur]]). Після складених чисел, написаних разом (21, 22, 23…), іменник стоїть як після 5+: [[dvadsaťjeden eur]], [[tridsaťdva rokov]].</p>
<p>Ціни: 3,49 € — [[tri eurá štyridsaťdeväť]]; 12,90 € — [[dvanásť eur deväťdesiat]].</p>
<h3>Порядкові числа і поверхи</h3>
<p>[[prvý]], [[druhý]], [[tretí]], [[štvrtý]], [[piaty]], [[šiesty]], [[siedmy]], [[ôsmy]], [[deviaty]], [[desiaty]]… 20. [[dvadsiaty]], 21. [[dvadsiaty prvý]] (складені порядкові пишуть <b>окремо</b>).</p>
<div class="note"><b>Поверхи рахують інакше!</b> Наш перший поверх — [[prízemie]] ([[na prízemí]]). Словацьке [[prvé poschodie]] — це наш <b>другий</b> поверх. «Живу на 4-му поверсі» (за українським рахунком) = [[Bývam na treťom poschodí.]]</div>
<h3>Місяці</h3>
<p>Назви місяців латинські, як в англійській, а не «січень / лютий».</p>
<div class="tblwrap"><table><tr><th>Місяць</th><th>У якому? (v + місцевий)</th><th>Дата (родовий)</th></tr>
<tr><td>[[január]] — січень</td><td>[[v januári]]</td><td>[[januára]]</td></tr>
<tr><td>[[február]] — лютий</td><td>[[vo februári]]</td><td>[[februára]]</td></tr>
<tr><td>[[marec]] — березень</td><td>[[v marci]]</td><td>[[marca]]</td></tr>
<tr><td>[[apríl]] — квітень</td><td>[[v apríli]]</td><td>[[apríla]]</td></tr>
<tr><td>[[máj]] — травень</td><td>[[v máji]]</td><td>[[mája]]</td></tr>
<tr><td>[[jún]] — червень</td><td>[[v júni]]</td><td>[[júna]]</td></tr>
<tr><td>[[júl]] — липень</td><td>[[v júli]]</td><td>[[júla]]</td></tr>
<tr><td>[[august]] — серпень</td><td>[[v auguste]]</td><td>[[augusta]]</td></tr>
<tr><td>[[september]] — вересень</td><td>[[v septembri]]</td><td>[[septembra]]</td></tr>
<tr><td>[[október]] — жовтень</td><td>[[v októbri]]</td><td>[[októbra]]</td></tr>
<tr><td>[[november]] — листопад</td><td>[[v novembri]]</td><td>[[novembra]]</td></tr>
<tr><td>[[december]] — грудень</td><td>[[v decembri]]</td><td>[[decembra]]</td></tr></table></div>
<h3>Дати й дні народження</h3>
<p>Дату пишуть так: <b>24. 8. 2026</b>. Читають порядковим числом і місяцем — обидва в родовому відмінку: [[dvadsiateho štvrtého augusta]], [[prvého mája]], [[tridsiateho prvého decembra]].</p>
<p>[[Koľkého je dnes?]] — Котре сьогодні число? [[Dnes je dvadsiateho štvrtého augusta.]]<br>
[[Kedy máš narodeniny?]] — Коли в тебе день народження? [[Mám narodeniny pätnásteho marca.]]<br>
Рік: [[Narodil som sa v roku tisícdeväťstodeväťdesiat.]] / [[Narodila som sa…]]</p>
<h3>Пори року</h3>
<p>[[jar]] (ж. р.) — весна, [[leto]] — літо, [[jeseň]] (ж. р.) — осінь, [[zima]] — зима.<br>
Коли: [[na jar]] — навесні, [[v lete]] — влітку, [[na jeseň]] — восени, [[v zime]] — взимку.</p>
<h3>Кольори</h3>
<p>[[biely]] білий, [[čierny]] чорний, [[sivý]] сірий, [[červený]] червоний, [[modrý]] синій / блакитний, [[zelený]] зелений, [[žltý]] жовтий, [[oranžový]] помаранчевий, [[ružový]] рожевий, [[fialový]] фіолетовий, [[hnedý]] коричневий.<br>
Відтінки пишуть разом: [[svetlomodrý]] — світло-синій, [[tmavozelený]] — темно-зелений.</p>
<p>Кольори — це прикметники типу pekný: [[červený autobus]], [[červená taška]], [[červené auto]]. [[Akej farby je tvoje auto?]] — Якого кольору твоя машина? (<b>farba</b> = колір.)</p>`,
  vocab: [['tridsať', 'тридцять'], ['štyridsať', 'сорок'], ['päťdesiat', 'п\'ятдесят'], ['šesťdesiat', 'шістдесят'], ['sedemdesiat', 'сімдесят'],
    ['osemdesiat', 'вісімдесят'], ['deväťdesiat', 'дев\'яносто'], ['január', 'січень'], ['február', 'лютий'], ['marec', 'березень'], ['apríl', 'квітень'],
    ['máj', 'травень'], ['jún', 'червень'], ['júl', 'липень'], ['august', 'серпень'], ['september', 'вересень'], ['október', 'жовтень'],
    ['november', 'листопад'], ['december', 'грудень'], ['jar (ž)', 'весна'], ['leto', 'літо'], ['jeseň (ž)', 'осінь'], ['zima', 'зима'],
    ['biely', 'білий'], ['čierny', 'чорний'], ['sivý', 'сірий'], ['červený', 'червоний'], ['modrý', 'синій, блакитний'], ['zelený', 'зелений'],
    ['žltý', 'жовтий'], ['hnedý', 'коричневий'], ['ružový', 'рожевий'], ['farba', 'колір; фарба'], ['narodeniny', 'день народження'],
    ['prízemie', 'перший поверх (наш)'], ['poschodie', 'поверх (рахують від другого)']],
  ex: [
    { t: 'c', q: '«березень» словацькою', o: ['marec', 'máj', 'apríl'] },
    { t: 'c', q: '«у лютому»', o: ['vo februári', 'v februári', 'na februári'] },
    { t: 'i', q: 'У якому місяці? липень → v ___', a: 'júli' },
    { t: 'i', q: 'Дата: 1. 5. → prvého ___', a: 'mája' },
    { t: 'i', q: 'Напишіть словами: <b>40</b>', a: 'štyridsať' },
    { t: 'i', q: 'Напишіть словами: <b>200</b>', a: 'dvesto' },
    { t: 'c', q: 'Ви живете на 2-му поверсі (за українським рахунком). Словацькою:', o: ['na prvom poschodí', 'na druhom poschodí', 'na prízemí'], e: 'Перший поверх — prízemie, тож наш 2-й поверх = [[prvé poschodie]].' },
    { t: 'i', q: '«влітку» → ___', a: 'v lete' },
    { t: 'c', q: 'Що означає «jar»?', o: ['весна', 'яр (балка)', 'жар'] },
    { t: 'i', q: 'Узгодьте колір: červený + auto → ___ auto', a: 'červené' },
    { t: 'i', q: 'Узгодьте колір: modrý + taška → ___ taška', a: 'modrá' },
    { t: 'c', q: '«Akej farby je to auto?» означає…', o: ['Якого кольору ця машина?', 'Чия це машина?', 'Скільки коштує ця машина?'] },
    { t: 'o', q: 'Котре сьогодні число?', a: 'Koľkého je dnes?' },
    { t: 'o', q: 'У мене день народження п\'ятнадцятого березня.', a: ['Mám narodeniny pätnásteho marca.', 'Narodeniny mám pätnásteho marca.', 'Pätnásteho marca mám narodeniny.'] },
    { t: 'g', g: 'numListen', min: 20, max: 99 },
    { t: 'g', g: 'numListen', min: 100, max: 999 },
    { t: 'g', g: 'priceListen' },
    { t: 'g', g: 'timeListen' },
    { t: 'g', g: 'dateListen' },
    { t: 'g', g: 'numWords', min: 20, max: 99 },
    { t: 'g', g: 'dateWords' }
  ],
  say: [['Koľkého je dnes?', 'Котре сьогодні число?'], ['Dnes je dvadsiateho štvrtého augusta.', 'Сьогодні двадцять четверте серпня.'], ['Mám narodeniny pätnásteho marca.', 'У мене день народження п\'ятнадцятого березня.'],
    ['Stojí to tri eurá štyridsaťdeväť.', 'Це коштує 3,49 €.'], ['Bývam na treťom poschodí.', 'Я живу на 3-му поверсі (за нашим рахунком — на 4-му).'], ['Na jar a v lete je tu krásne.', 'Навесні й улітку тут чудово.']],
  speak: ['Назвіть уголос сьогоднішню дату, дату свого народження і дати народження двох близьких людей.', 'Опишіть кольори 5 речей навколо себе: «Moja taška je čierna…»', 'Відкрийте тренажер чисел і 5 хвилин читайте ціни вголос.'],
  mission: 'У магазині прочитайте вголос (можна пошепки) 10 цінників: [[dve eurá deväťdesiatdeväť]]… А на касі спробуйте зрозуміти суму на слух, не дивлячись на екран.'
},
{
  id: 'a1-9', stage: 'a1', num: 'A1.9', title: 'Chcem, môžem, musím, viem + rád', dur: '1 тиждень',
  goals: ['модальні дієслова + інфінітив', 'різниця vedieť / poznať / môcť', 'сказати, що любите: rád robím, páči sa mi'],
  theory: `
<div class="tblwrap"><table><tr><th></th><th>chcieť (хотіти)</th><th>môcť (могти)</th><th>musieť (мусити)</th><th>vedieť (знати, вміти)</th></tr>
<tr><td>ja</td><td>chcem</td><td>môžem</td><td>musím</td><td>viem</td></tr>
<tr><td>ty</td><td>chceš</td><td>môžeš</td><td>musíš</td><td>vieš</td></tr>
<tr><td>on/ona</td><td>chce</td><td>môže</td><td>musí</td><td>vie</td></tr>
<tr><td>my</td><td>chceme</td><td>môžeme</td><td>musíme</td><td>vieme</td></tr>
<tr><td>vy</td><td>chcete</td><td>môžete</td><td>musíte</td><td>viete</td></tr>
<tr><td>oni</td><td>chcú</td><td>môžu</td><td>musia</td><td>vedia</td></tr></table></div>
<p>[[Musím ísť.]] [[Môžem sa opýtať?]] — Можна запитати? [[Neviem.]] — Не знаю. Ввічливіше, ніж «chcem»: [[Chcel by som…]] / [[Chcela by som…]]</p>
<div class="tip"><b>vedieť</b> — знати факт або вміти: [[Viem plávať.]] — Я вмію плавати. <b>poznať</b> — знати когось чи місце: [[Poznáš Petra?]] <b>môcť</b> — мати змогу або дозвіл.</div>
<h3>rád / rada — «люблю (робити)». Цього в українській немає!</h3>
<p><b>rád</b> (чоловік) / <b>rada</b> (жінка) / <b>radi</b> (множина: чоловіки або змішана група) / <b>rady</b> (множина: жінки) + дієслово: [[Rád čítam.]] / [[Rada čítam.]] — Я люблю читати. [[Radi cestujeme.]] Заперечення: [[Nerád varím.]] / [[Nerada varím.]]</p>
<p><b>mať rád / rada</b> + знахідний — любити щось чи когось: [[Mám rád kávu.]] [[Mám rada leto.]]</p>
<h3>páčiť sa — подобатися</h3>
<p>Як в українській «мені подобається»: [[Páči sa mi to.]] [[Bratislava sa mi páči.]] [[Páčia sa mi hory.]] mi — мені, ti — тобі, vám — вам.</p>
<p>[[treba]] — треба: [[Treba platiť.]] [[Netreba.]]</p>`,
  vocab: [['chcieť', 'хотіти'], ['môcť', 'могти'], ['musieť', 'мусити'], ['vedieť', 'знати, вміти'], ['poznať', 'знати (когось, щось)'],
    ['rád / rada', 'охоче; «люблю…»'], ['mať rád', 'любити (щось)'], ['páčiť sa', 'подобатися'], ['treba', 'треба'], ['plávať', 'плавати'],
    ['cestovať', 'подорожувати'], ['tancovať', 'танцювати'], ['spievať', 'співати'], ['hudba', 'музика'], ['kniha', 'книжка'], ['voľný čas', 'вільний час']],
  ex: [
    { t: 'i', q: 'chcieť → ja ___', a: 'chcem' },
    { t: 'i', q: 'môcť → oni ___', a: 'môžu' },
    { t: 'i', q: 'musieť → ty ___', a: 'musíš' },
    { t: 'i', q: 'vedieť, заперечення → ja ___', a: 'neviem' },
    { t: 'i', q: 'vedieť → oni ___', a: 'vedia' },
    { t: 'c', q: 'Жінка каже: «Я люблю готувати»', o: ['Rada varím.', 'Rád varím.', 'Mám rada variť.'] },
    { t: 'c', q: 'Чоловік каже: «Я люблю каву»', o: ['Mám rád kávu.', 'Som rád kávu.', 'Mám radi kávu.'] },
    { t: 'c', q: '«Мені подобається Братислава»', o: ['Bratislava sa mi páči.', 'Ja páčim Bratislavu.', 'Bratislava mi páči sa.'] },
    { t: 'c', q: '«Я вмію плавати»', o: ['Viem plávať.', 'Poznám plávať.', 'Mám plávať.'] },
    { t: 'o', q: 'Можна запитати?', a: 'Môžem sa opýtať?' },
    { t: 'o', q: 'Я мушу йти додому.', a: 'Musím ísť domov.' },
    { t: 'l', a: 'Čo rád robíš vo voľnom čase?', tr: 'Що ти любиш робити у вільний час?' }
  ],
  say: [['Môžem sa opýtať?', 'Можна запитати?'], ['Rád / Rada čítam.', 'Я люблю читати.'], ['Bratislava sa mi páči.', 'Мені подобається Братислава.'], ['Neviem, prepáčte.', 'Не знаю, вибачте.'], ['Čo rád robíš vo voľnom čase?', 'Що ти любиш робити у вільний час?']],
  speak: ['Скажіть 5 речень про те, що ви любите і не любите, з rád / rada, mám rád / rada і páči sa mi.'],
  mission: 'Запитайте колегу чи знайомого: «Čo rád / rada robíš vo voľnom čase?» — і розкажіть про себе.'
},
{
  id: 'a1-10', stage: 'a1', num: 'A1.10', title: 'Robil som — минулий час', dur: '1 тиждень',
  goals: ['утворювати минулий час', 'ставити som / si / sme / ste на друге місце', 'розповідати про вчорашній день і вихідні'],
  theory: `
<h3>Утворення: -l / -la / -lo / -li + som, si, sme, ste</h3>
<div class="tblwrap"><table><tr><th></th><th>чоловік</th><th>жінка</th></tr>
<tr><td>ja</td><td>robil som</td><td>robila som</td></tr>
<tr><td>ty</td><td>robil si</td><td>robila si</td></tr>
<tr><td>on / ona / ono</td><td>robil</td><td>robila / robilo</td></tr>
<tr><td>my / vy / oni</td><td colspan="2">robili sme / robili ste / robili</td></tr></table></div>
<p>У 3-й особі допоміжного дієслова немає: [[On pracoval.]] [[Ona bola doma.]] [[Oni boli v Košiciach.]]</p>
<p>byť: [[bol som]], [[bola som]], [[bolo]], [[boli sme]]… [[Bol som v práci.]] [[Kde si bola včera?]]</p>
<div class="note"><b>Неправильні форми:</b> ísť → [[išiel som]] / [[šiel som]], [[išla som]]; jesť → [[jedol som]]; môcť → [[mohol som]]; chcieť → [[chcel som]]; vedieť → [[vedel som]]; mať → [[mal som]]. Дієслова на -núť часто мають -ol: [[stretnúť]] → [[stretol]], [[zabudnúť]] → [[zabudol]].</div>
<h3>Порядок слів — головне правило уроку</h3>
<p><b>som / si / sme / ste</b> — клітики: вони стоять <b>на другому місці</b> в реченні.</p>
<p>[[Včera som pracoval.]] (а не «Včera pracoval som»). [[Kde si bol?]] [[V sobotu sme boli na trhu.]] [[Ja som bol doma.]]</p>
<p>Заперечення: [[Nebol som tam.]] Як в українській, заперечень може бути кілька: [[Nerobila som nič.]] — Я нічого не робила. Так само з [[nikto]] і [[nikdy]].</p>`,
  vocab: [['včera', 'вчора'], ['minulý týždeň', 'минулого тижня'], ['predtým', 'раніше'], ['potom', 'потім'], ['nič', 'нічого'], ['nikto', 'ніхто'],
    ['nikdy', 'ніколи'], ['už', 'вже'], ['ešte', 'ще'], ['ešte nie', 'ще ні'], ['dovolenka', 'відпустка'], ['stretnúť', 'зустріти'], ['zabudnúť', 'забути'],
    ['kúpiť', 'купити'], ['zavolať', 'подзвонити'], ['urobiť', 'зробити']],
  ex: [
    { t: 'i', q: 'robiť → (ja, чоловік) ___ som', a: 'robil' },
    { t: 'i', q: 'byť → (ona) ___ doma', a: 'bola' },
    { t: 'i', q: 'pracovať → (my) ___ sme', a: 'pracovali' },
    { t: 'i', q: 'mať → (ty, жінка) ___ si', a: 'mala' },
    { t: 'i', q: 'ísť → (ja, чоловік) ___ som (одна з двох форм)', a: ['išiel', 'šiel'] },
    { t: 'i', q: 'môcť → (on) ___', a: 'mohol' },
    { t: 'c', q: 'Який порядок слів правильний?', o: ['Včera som pracoval.', 'Včera pracoval som.', 'Som včera pracoval.'] },
    { t: 'c', q: '«Вона була вдома»', o: ['Ona bola doma.', 'Ona je bola doma.', 'Ona bola je doma.'] },
    { t: 'c', q: '«Я нічого не робив»', o: ['Nerobil som nič.', 'Robil som nič.', 'Nerobil som niečo.'] },
    { t: 'o', q: 'Де ти був учора?', a: ['Kde si bol včera?', 'Kde si včera bol?'] },
    { t: 'o', q: 'У суботу ми були на ринку.', a: ['V sobotu sme boli na trhu.', 'Boli sme v sobotu na trhu.', 'Na trhu sme boli v sobotu.'] },
    { t: 'l', a: 'Minulý týždeň som bol v Košiciach.', tr: 'Минулого тижня я був у Кошицях.' }
  ],
  say: [['Včera som pracoval / pracovala.', 'Вчора я працював / працювала.'], ['Kde si bol včera?', 'Де ти був учора?'], ['Cez víkend sme boli na výlete.', 'На вихідних ми їздили на екскурсію.'], ['Zabudol som.', 'Я забув.']],
  speak: ['Розкажіть у 6 реченнях, що ви робили вчора або на вихідних.'],
  mission: 'У понеділок розкажіть колезі чи знайомому 2–3 речення про вихідні: «Cez víkend som bol / bola…»'
},
{
  id: 'a1-11', stage: 'a1', num: 'A1.11', title: 'Sa і si — зворотні дієслова, кав\'ярня', dur: '1 тиждень',
  goals: ['вживати sa / si', 'знати порядок клітик', 'замовити в кав\'ярні'],
  theory: `
<p><b>sa</b> = «-ся», але це окреме слово: [[volám sa]] (мене звати), [[učím sa]] (вчуся), [[mám sa dobre]] (у мене все добре), [[bojím sa]] (боюся), [[smejem sa]] (сміюся), [[vrátim sa]] (повернуся), [[stretneme sa]] (зустрінемося).</p>
<p><b>si</b> = «собі»: [[dám si kávu]] (я візьму каву), [[kúpim si…]] (куплю собі), [[sadnite si]] (сідайте), [[myslím si]] (я думаю, вважаю), [[pamätám si]] (пам'ятаю).</p>
<div class="note">Часом зворотність не збігається з українською: [[pozerať sa]] — дивитися, [[myslieť si]] — вважати, [[pamätať si]] — пам'ятати.</div>
<h3>Порядок клітик (друга позиція в реченні)</h3>
<p><b>by → som/si/sme/ste → sa/si → mi/ti/mu… → ma/ťa/ho…</b></p>
<p>[[Včera som sa učil.]] (а не «Včera sa som učil»). [[Kúpil som si nový telefón.]] [[Chcel by som sa opýtať…]] — Я хотів би запитати…</p>
<h3>У кав'ярні й ресторані</h3>
<p>[[Čo si dáte?]] — Що будете? [[Dám si kávu s mliekom.]] [[Dáte si ešte niečo?]] [[Dobrú chuť!]] — Смачного! [[Na zdravie!]] — Будьмо!
[[Zaplatím, prosím.]] — Рахунок, будь ласка. [[Spolu alebo zvlášť?]] — Разом чи окремо?</p>`,
  vocab: [['učiť sa', 'вчитися'], ['báť sa (bojím sa)', 'боятися'], ['smiať sa (smejem sa)', 'сміятися'], ['vrátiť sa', 'повернутися'],
    ['stretnúť sa', 'зустрітися'], ['dať si', 'взяти (замовити) собі'], ['kúpiť si', 'купити собі'], ['myslieť si', 'думати, вважати'],
    ['pamätať si', 'пам\'ятати'], ['sadnúť si', 'сісти'], ['pozerať sa', 'дивитися'], ['Dobrú chuť!', 'Смачного!'], ['Na zdravie!', 'Будьмо! На здоров\'я!'],
    ['spolu', 'разом'], ['zvlášť', 'окремо'], ['s mliekom', 'з молоком']],
  ex: [
    { t: 'c', q: '«Вчора я вчився»', o: ['Včera som sa učil.', 'Včera sa som učil.', 'Včera učil som sa.'] },
    { t: 'c', q: 'У кафе: «Я візьму каву»', o: ['Dám si kávu.', 'Dám sa kávu.', 'Dám kávu si.'] },
    { t: 'i', q: 'sa чи si? Ako ___ voláte?', a: 'sa' },
    { t: 'i', q: 'sa чи si? Myslím ___, že je to dobré.', a: 'si' },
    { t: 'i', q: 'sa чи si? Učím ___ po slovensky.', a: 'sa' },
    { t: 'i', q: 'sa чи si? Kúpil som ___ nový telefón.', a: 'si' },
    { t: 'c', q: '«Рахунок, будь ласка»', o: ['Zaplatím, prosím.', 'Platím si sa.', 'Dám si platiť.'] },
    { t: 'c', q: '«Смачного!»', o: ['Dobrú chuť!', 'Na zdravie!', 'Dobrý deň!'] },
    { t: 'o', q: 'Я хотів би запитати.', a: 'Chcel by som sa opýtať.' },
    { t: 'o', q: 'Ми зустрінемося завтра.', a: ['Stretneme sa zajtra.', 'Zajtra sa stretneme.'] },
    { t: 'l', a: 'Čo si dáte? Dám si čaj s citrónom.', tr: 'Що будете? Я візьму чай із лимоном.' }
  ],
  say: [['Dám si kávu s mliekom.', 'Я візьму каву з молоком.'], ['Zaplatím, prosím.', 'Рахунок, будь ласка.'], ['Chcel / Chcela by som sa opýtať…', 'Я хотів / хотіла б запитати…'], ['Učím sa po slovensky.', 'Я вчу словацьку.']],
  speak: ['Розіграйте сценку в кафе: замовте напій і щось поїсти, а тоді попросіть рахунок.'],
  mission: 'Замовте в кав\'ярні словацькою — «Dám si…» — а наприкінці скажіть «Zaplatím, prosím.»'
},
{
  id: 'a1-12', stage: 'a1', num: 'A1.12', title: 'Budem і urobím — майбутній час і вид', dur: '1 тиждень',
  goals: ['розрізняти доконаний і недоконаний вид', 'утворювати майбутній час', 'розповідати про плани'],
  theory: `
<p>Вид дієслова — як в українській: <b>недоконаний</b> (процес, повтор): robiť, písať, kupovať; <b>доконаний</b> (результат): urobiť, napísať, kúpiť.</p>
<h3>Майбутній час</h3>
<p><b>Недоконаний:</b> budem / budeš / bude / budeme / budete / budú + інфінітив: [[Zajtra budem pracovať.]]</p>
<p><b>Доконаний:</b> форма теперішнього часу вже означає майбутнє, як в українській «зроблю»: [[Urobím to zajtra.]] [[Zavolám ti.]] [[Kúpim chlieb.]]</p>
<p>byť: [[budem]], [[budeš]], [[bude]]… [[Budem doma.]] ísť → [[pôjdem]] (піду, поїду): [[Pôjdeme na výlet.]]</p>
<div class="note"><b>Помилка:</b> «budem urobiť» — budem з доконаним видом не вживають, так само як в українській не кажуть «буду зробити».</div>
<h3>Вчіть парами</h3>
<div class="tblwrap"><table><tr><th>недоконаний</th><th>доконаний</th><th>значення</th></tr>
<tr><td>robiť</td><td>urobiť</td><td>робити / зробити</td></tr><tr><td>písať</td><td>napísať</td><td>писати / написати</td></tr>
<tr><td>čítať</td><td>prečítať</td><td>читати / прочитати</td></tr><tr><td>kupovať</td><td>kúpiť</td><td>купувати / купити</td></tr>
<tr><td>volať</td><td>zavolať</td><td>дзвонити / подзвонити</td></tr><tr><td>piť</td><td>vypiť</td><td>пити / випити</td></tr>
<tr><td>jesť</td><td>zjesť</td><td>їсти / з'їсти</td></tr><tr><td>platiť</td><td>zaplatiť</td><td>платити / заплатити</td></tr>
<tr><td>variť</td><td>uvariť</td><td>готувати / приготувати</td></tr><tr><td>učiť sa</td><td>naučiť sa</td><td>вчити / вивчити</td></tr>
<tr><td>pozerať (sa)</td><td>pozrieť (sa)</td><td>дивитися / подивитися</td></tr><tr><td>dávať</td><td>dať</td><td>давати / дати</td></tr>
<tr><td>brať</td><td>zobrať</td><td>брати / взяти</td></tr></table></div>
<p>[[Čo budeš robiť cez víkend?]] — [[V sobotu pôjdem na nákup a v nedeľu budem odpočívať.]]</p>`,
  vocab: [['urobiť', 'зробити'], ['napísať', 'написати'], ['prečítať', 'прочитати'], ['kúpiť', 'купити'], ['zavolať', 'подзвонити'], ['vypiť', 'випити'],
    ['zjesť', 'з\'їсти'], ['zaplatiť', 'заплатити'], ['uvariť', 'приготувати'], ['naučiť sa', 'вивчити'], ['pozrieť sa', 'подивитися'], ['dať', 'дати'],
    ['zobrať', 'взяти'], ['odpočívať', 'відпочивати'], ['výlet', 'поїздка, екскурсія', 'не «виліт» (виліт — odlet)'], ['nákup', 'покупки']],
  ex: [
    { t: 'i', q: 'byť (майбутній) → ja ___', a: 'budem' },
    { t: 'i', q: 'ísť (майбутній) → my ___', a: 'pôjdeme' },
    { t: 'i', q: 'Видова пара: robiť → ___', a: 'urobiť' },
    { t: 'i', q: 'Видова пара: písať → ___', a: 'napísať' },
    { t: 'i', q: 'Видова пара: kupovať → ___', a: 'kúpiť' },
    { t: 'c', q: '«Я зроблю це завтра»', o: ['Urobím to zajtra.', 'Budem urobiť to zajtra.', 'Robím to zajtra urobiť.'] },
    { t: 'c', q: '«Завтра я працюватиму»', o: ['Zajtra budem pracovať.', 'Zajtra pracujem bude.', 'Zajtra budem pracoval.'] },
    { t: 'c', q: 'Котрий варіант — помилка?', o: ['Budem zavolať.', 'Budem volať.', 'Zavolám.'], e: 'budem + доконаний вид не вживають.' },
    { t: 'i', q: 'zavolať → ja ___ ti zajtra', a: 'zavolám' },
    { t: 'o', q: 'Що ти робитимеш на вихідних?', a: ['Čo budeš robiť cez víkend?', 'Čo budeš cez víkend robiť?'] },
    { t: 'o', q: 'Я подзвоню тобі ввечері.', a: ['Zavolám ti večer.', 'Večer ti zavolám.'] },
    { t: 'l', a: 'V sobotu pôjdeme na výlet.', tr: 'У суботу ми поїдемо на екскурсію.' }
  ],
  say: [['Čo budeš robiť cez víkend?', 'Що робитимеш на вихідних?'], ['Zajtra budem pracovať.', 'Завтра я працюватиму.'], ['Zavolám vám zajtra.', 'Я подзвоню вам завтра.'], ['Pôjdem domov.', 'Я піду додому.']],
  speak: ['Розкажіть у 6 реченнях про плани на вихідні й наступний тиждень, чергуючи budem + інфінітив і доконаний вид.'],
  mission: 'Домовтеся про щось на майбутнє словацькою — в розмові чи повідомленні колезі або сусідові: «Zavolám vám zajtra», «Prídem v piatok».'
},
{
  id: 'a1-13', stage: 'a1', num: 'A1.13', title: 'Повторення і контрольна точка A1', dur: '1 тиждень',
  goals: ['повторити все з рівня A1', 'скласти підсумковий тест на ≥ 80%', 'провести 3-хвилинну розмову словацькою'],
  theory: `
<p>Цей тиждень — для повторення. Ось план:</p>
<ol><li><b>Пн–Вт:</b> пройдіть ще раз вправи уроків, де найнижчий бал (див. «Уроки»).</li>
<li><b>Ср:</b> «Розмова» → 5 випадкових завдань із таймером, кожне з записом себе.</li>
<li><b>Чт:</b> підсумковий тест — це вправи цього уроку, зібрані з усього A1.</li>
<li><b>Пт:</b> «живий тест» — 3 хвилини розмови словацькою: знайомство, сім'я, робота, вчорашній день, плани.</li></ol>
<h3>Самооцінка: я вмію…</h3>
<ul class="check"><li>привітатися, представитися, сказати, звідки я</li><li>розповісти про сім'ю, роботу і свій день</li><li>купити продукти, запитати ціну, заплатити</li>
<li>запитати дорогу і поїхати громадським транспортом</li><li>сказати, котра година, і домовитися про час</li><li>замовити в кафе</li>
<li>розповісти, що робив учора і що робитиму завтра</li><li>попросити повторити або говорити повільніше</li></ul>
<div class="good">Якщо більшість пунктів — «так», переходьте до A2 у вкладці «Програма».</div>`,
  vocab: [],
  ex: [
    { t: 'i', q: 'Вставте byť: Oni ___ doma.', a: 'sú' },
    { t: 'c', q: '«Я не словак»', o: ['Nie som Slovák.', 'Nesom Slovák.', 'Som nie Slovák.'] },
    { t: 'i', q: 'Узгодьте: krásny + ulica → ___ ulica', a: 'krásna' },
    { t: 'i', q: 'Mám (sestra) → Mám ___.', a: 'sestru' },
    { t: 'i', q: 'pracovať → oni ___', a: 'pracujú' },
    { t: 'c', q: '«Я на роботі»', o: ['Som v práci.', 'Som na práci.', 'Som na prácu.'] },
    { t: 'i', q: 'Kam? do (mesto) → do ___', a: 'mesta' },
    { t: 'i', q: '5 € → päť ___', a: 'eur' },
    { t: 'c', q: '«у середу»', o: ['v stredu', 'v streda', 'v strede'] },
    { t: 'c', q: 'Жінка каже: «Я люблю читати»', o: ['Rada čítam.', 'Rád čítam.', 'Mám rada čítať.'] },
    { t: 'c', q: 'Який порядок слів правильний?', o: ['Včera som sa učil.', 'Včera sa som učil.', 'Včera učil som sa.'] },
    { t: 'c', q: '«Я зроблю це завтра»', o: ['Urobím to zajtra.', 'Budem urobiť to zajtra.', 'Robím to zajtra urobiť.'] },
    { t: 'c', q: '«Ovocie» — це…', o: ['фрукти', 'овочі', 'вівці'] },
    { t: 'c', q: 'Що означає «hľadať»?', o: ['шукати', 'дивитися', 'гладити'] },
    { t: 'o', q: 'Де мені вийти?', a: 'Kde mám vystúpiť?' },
    { t: 'o', q: 'Можна заплатити карткою?', a: 'Môžem platiť kartou?' },
    { t: 'o', q: 'Де ти була вчора?', a: ['Kde si bola včera?', 'Kde si včera bola?'] },
    { t: 'i', q: 'О котрій? О 7:00 → o ___', a: 'siedmej' },
    { t: 'l', a: 'Hovorte pomaly, prosím.', tr: 'Говоріть повільно, будь ласка.' },
    { t: 'l', a: 'Čo budeš robiť cez víkend?', tr: 'Що робитимеш на вихідних?' }
  ],
  say: [],
  speak: ['3 хвилини без пауз: представтеся, розкажіть про сім\'ю, роботу, вчорашній день і плани на вихідні. Запишіть себе й послухайте.'],
  mission: '«Живий тест»: проведіть 3–5-хвилинну розмову словацькою з реальною людиною — колегою, сусідом, у мовному клубі чи через HelloTalk.'
}
);
})(PG.pack("sk"));
/* ---- sk/data/reference.js ---- */
/* Довідник: вимова, фальшиві друзі, відмінки, зразки відмінювання, займенники, дієслова */
(function (SK) {
(function (SK) {
  const tbl = (head, rows) => '<div class="tblwrap"><table><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr>' +
    rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table></div>';
  const say = (s) => '[[' + s + ']]';

  const ff = [
    ['ovocie', 'фрукти', 'овочі = zelenina'], ['život', 'життя', 'живіт = brucho'], ['chytrý', 'розумний, кмітливий', 'хитрий = prefíkaný'],
    ['úžasný', 'чудовий, дивовижний', 'жахливий = hrozný (рос. «ужасный»)'], ['čudný', 'дивний', 'чудовий = úžasný, skvelý'],
    ['zápach', 'сморід', 'запах = vôňa (приємний), pach'], ['vôňa', 'аромат, приємний запах', 'рос. «вонь» = zápach'],
    ['páchnuť', 'смердіти', 'пахнути (приємно) = voňať'], ['jahoda', 'полуниця', 'ягода = bobuľa'], ['kúriť', 'опалювати', 'курити = fajčiť'],
    ['byt', 'квартира', 'бути = byť'], ['hľadať', 'шукати', 'дивитися = pozerať (sa)'], ['hrad', 'замок, фортеця', 'град = krupobitie'],
    ['čerstvý', 'свіжий', 'черствий = tvrdý, starý'], ['pozor', 'увага!', 'ганьба = hanba'], ['dôvod', 'причина', 'довід = argument'],
    ['stolička', 'стілець', 'столиця = hlavné mesto'], ['topánky', 'черевики, взуття', 'тапки = papuče'], ['noviny', 'газета', 'новини = správy'],
    ['smotana', 'вершки', 'сметана = kyslá smotana'], ['syr', 'твердий сир', 'кисломолочний сир = tvaroh'], ['úrok', 'відсоток (у банку)', 'урок = hodina, lekcia'],
    ['hodina', 'година; урок', ''], ['starosť', 'турбота, клопіт', 'старість = staroba'], ['pokoj', 'спокій', 'кімната = izba'],
    ['farba', 'колір; фарба', 'Akú farbu? = Якого кольору?'], ['výlet', 'поїздка, екскурсія', 'виліт = odlet'], ['skúška', 'іспит, проба', 'рос. «скучно» = nudno'],
    ['plat', 'зарплата', 'плата = platba, poplatok'], ['pivnica', 'підвал, льох', 'пивна = krčma, piváreň'], ['hora', 'гора; також ліс', ''],
    ['obchod', 'магазин', 'обхід = obchádzka'], ['ľúbiť', 'кохати', 'любити щось = mať rád'], ['rád / rada', 'охоче; «люблю (робити)»', 'Rád čítam = Я люблю читати'],
    ['krk', 'шия', 'крик = krik'], ['čas', 'час', 'рос. «час» (година) = hodina'], ['časopis', 'журнал', 'газета = noviny'], ['pitný režim', 'достатньо пити воду', '']
  ];

  const alphabet = [
    ['a / á', 'а / а:', 'mama, máj'], ['ä', 'е', 'mäso, päť'], ['b', 'б (у кінці — п)', 'brat, dub'], ['c', 'ц', 'cukor'], ['č', 'ч', 'čaj'],
    ['d / ď', 'д / дь', 'dom, ďakujem'], ['dz / dž', 'дз / дж', 'medzi, džús'], ['e / é', 'е / е:', 'pero, pekné'], ['f', 'ф', 'film'],
    ['g', 'ґ', 'guma'], ['h', 'г (українське)', 'hora'], ['ch', 'х', 'chlieb'], ['i / í', 'і / і:', 'iný, prosím'], ['j', 'й', 'jablko'],
    ['k', 'к', 'kniha'], ['l / ĺ / ľ', 'л / л: / ль', 'lampa, vĺča, soľ'], ['m', 'м', 'mesto'], ['n / ň', 'н / нь', 'noc, deň'],
    ['o / ó / ô', 'о / о: / уо', 'voda, móda, stôl'], ['p', 'п', 'pivo'], ['r / ŕ', 'р / р:', 'ruka, vŕba'], ['s / š', 'с / ш', 'syn, škola'],
    ['t / ť', 'т / ть', 'tam, ťažký'], ['u / ú', 'у / у:', 'ulica, súd'], ['v', 'в; у кінці складу — ў', 'voda, domov'], ['x', 'кс', 'taxík'],
    ['y / ý', 'і / і:', 'syn, pekný'], ['z / ž', 'з / ж', 'zima, žena']
  ];

  const cases = [
    ['1. nominatív (N)', 'kto? čo?', '—', 'To je <b>žena</b>.'],
    ['2. genitív (G)', 'koho? čoho?', 'bez, do, od, u, z, okrem, počas, vedľa', 'Idem <b>do školy</b>. Som <b>z Kyjeva</b>.'],
    ['3. datív (D)', 'komu? čomu?', 'k, proti, vďaka, kvôli', 'Idem <b>k lekárovi</b>. Volám <b>mame</b>.'],
    ['4. akuzatív (A)', 'koho? čo?', 'cez, pre, na (kam?), za (за — заміна, час), o (на скільки)', 'Mám <b>sestru</b>. Idem <b>na poštu</b>.'],
    ['6. lokál (L)', 'o kom? o čom? kde?', 'v, na (kde?), o (про), po, pri', 'Som <b>v práci</b>. Hovoríme <b>o filme</b>.'],
    ['7. inštrumentál (I)', 's kým? s čím?', 's, pred, za (де?), nad, pod, medzi', 'Idem <b>s kamarátom</b>. Idem <b>autobusom</b>.']
  ];

  const vzory = {
    m: [['', 'chlap (живі)', 'hrdina (живі на -a)', 'dub (неживі, тверді)', 'stroj (неживі, м\'які)'],
      ['N', 'chlap', 'hrdina', 'dub', 'stroj'], ['G', 'chlapa', 'hrdinu', 'duba', 'stroja'], ['D', 'chlapovi', 'hrdinovi', 'dubu', 'stroju'],
      ['A', 'chlapa', 'hrdinu', 'dub', 'stroj'], ['L', '(o) chlapovi', '(o) hrdinovi', '(o) dube', '(o) stroji'], ['I', '(s) chlapom', '(s) hrdinom', '(s) dubom', '(so) strojom'],
      ['N мн.', 'chlapi', 'hrdinovia', 'duby', 'stroje'], ['G мн.', 'chlapov', 'hrdinov', 'dubov', 'strojov'], ['D мн.', 'chlapom', 'hrdinom', 'dubom', 'strojom'],
      ['A мн.', 'chlapov', 'hrdinov', 'duby', 'stroje'], ['L мн.', '(o) chlapoch', '(o) hrdinoch', '(o) duboch', '(o) strojoch'], ['I мн.', 'chlapmi', 'hrdinami', 'dubmi', 'strojmi']],
    f: [['', 'žena', 'ulica (м\'які на -a)', 'dlaň (на м\'який приголосний)', 'kosť (на -sť, -c…)'],
      ['N', 'žena', 'ulica', 'dlaň', 'kosť'], ['G', 'ženy', 'ulice', 'dlane', 'kosti'], ['D', 'žene', 'ulici', 'dlani', 'kosti'],
      ['A', 'ženu', 'ulicu', 'dlaň', 'kosť'], ['L', '(o) žene', '(o) ulici', '(o) dlani', '(o) kosti'], ['I', 'ženou', 'ulicou', 'dlaňou', 'kosťou'],
      ['N мн.', 'ženy', 'ulice', 'dlane', 'kosti'], ['G мн.', 'žien', 'ulíc', 'dlaní', 'kostí'], ['D мн.', 'ženám', 'uliciam', 'dlaniam', 'kostiam'],
      ['A мн.', 'ženy', 'ulice', 'dlane', 'kosti'], ['L мн.', '(o) ženách', '(o) uliciach', '(o) dlaniach', '(o) kostiach'], ['I мн.', 'ženami', 'ulicami', 'dlaňami', 'kosťami']],
    n: [['', 'mesto', 'srdce', 'vysvedčenie', 'dievča (малята)'],
      ['N', 'mesto', 'srdce', 'vysvedčenie', 'dievča'], ['G', 'mesta', 'srdca', 'vysvedčenia', 'dievčaťa'], ['D', 'mestu', 'srdcu', 'vysvedčeniu', 'dievčaťu'],
      ['A', 'mesto', 'srdce', 'vysvedčenie', 'dievča'], ['L', '(o) meste', '(o) srdci', '(o) vysvedčení', '(o) dievčati'], ['I', 'mestom', 'srdcom', 'vysvedčením', 'dievčaťom'],
      ['N мн.', 'mestá', 'srdcia', 'vysvedčenia', 'dievčatá'], ['G мн.', 'miest', 'sŕdc', 'vysvedčení', 'dievčat'], ['D мн.', 'mestám', 'srdciam', 'vysvedčeniam', 'dievčatám'],
      ['A мн.', 'mestá', 'srdcia', 'vysvedčenia', 'dievčatá'], ['L мн.', '(o) mestách', '(o) srdciach', '(o) vysvedčeniach', '(o) dievčatách'], ['I мн.', 'mestami', 'srdcami', 'vysvedčeniami', 'dievčatami']]
  };
  const vz = (rows) => tbl(rows[0], rows.slice(1).map((r) => ['<b>' + r[0] + '</b>'].concat(r.slice(1))));

  const adj = [['', 'ч. р.', 'ж. р.', 'с. р.', 'мн.'],
    ['N', 'pekný / cudzí', 'pekná / cudzia', 'pekné / cudzie', 'pekní* / pekné; cudzí* / cudzie'],
    ['G', 'pekného / cudzieho', 'peknej / cudzej', 'pekného / cudzieho', 'pekných / cudzích'],
    ['D', 'peknému / cudziemu', 'peknej / cudzej', 'peknému / cudziemu', 'pekným / cudzím'],
    ['A', 'pekného* / pekný; cudzieho* / cudzí', 'peknú / cudziu', 'pekné / cudzie', 'pekných* / pekné; cudzích* / cudzie'],
    ['L', '(o) peknom / cudzom', '(o) peknej / cudzej', '(o) peknom / cudzom', '(o) pekných / cudzích'],
    ['I', 'pekným / cudzím', 'peknou / cudzou', 'pekným / cudzím', 'peknými / cudzími']];

  const pron = [['', 'ja', 'ty', 'on / ono', 'ona', 'my', 'vy', 'oni / ony', 'sa (себе)'],
    ['G', 'mňa, ma', 'teba, ťa', 'jeho, ho, neho', 'jej, nej', 'nás', 'vás', 'ich, nich', 'seba'],
    ['D', 'mne, mi', 'tebe, ti', 'jemu, mu, nemu', 'jej, nej', 'nám', 'vám', 'im, nim', 'sebe, si'],
    ['A', 'mňa, ma', 'teba, ťa', 'jeho, ho, neho', 'ju, ňu', 'nás', 'vás', 'ich, nich / ne', 'seba, sa'],
    ['L', '(o) mne', '(o) tebe', '(o) ňom', '(o) nej', '(o) nás', '(o) vás', '(o) nich', '(o) sebe'],
    ['I', 'mnou', 'tebou', 'ním', 'ňou', 'nami', 'vami', 'nimi', 'sebou']];

  const verbs = [['', 'ja', 'ty', 'on/ona', 'my', 'vy', 'oni', 'мин. (ч.)'],
    ['byť', 'som', 'si', 'je', 'sme', 'ste', 'sú', 'bol'], ['mať', 'mám', 'máš', 'má', 'máme', 'máte', 'majú', 'mal'],
    ['ísť', 'idem', 'ideš', 'ide', 'ideme', 'idete', 'idú', 'išiel / šiel'], ['chcieť', 'chcem', 'chceš', 'chce', 'chceme', 'chcete', 'chcú', 'chcel'],
    ['môcť', 'môžem', 'môžeš', 'môže', 'môžeme', 'môžete', 'môžu', 'mohol'], ['vedieť', 'viem', 'vieš', 'vie', 'vieme', 'viete', 'vedia', 'vedel'],
    ['jesť', 'jem', 'ješ', 'je', 'jeme', 'jete', 'jedia', 'jedol'], ['piť', 'pijem', 'piješ', 'pije', 'pijeme', 'pijete', 'pijú', 'pil'],
    ['spať', 'spím', 'spíš', 'spí', 'spíme', 'spíte', 'spia', 'spal'], ['brať', 'beriem', 'berieš', 'berie', 'berieme', 'beriete', 'berú', 'bral'],
    ['povedať', 'poviem', 'povieš', 'povie', 'povieme', 'poviete', 'povedia', 'povedal'], ['dať', 'dám', 'dáš', 'dá', 'dáme', 'dáte', 'dajú', 'dal'],
    ['stáť', 'stojím', 'stojíš', 'stojí', 'stojíme', 'stojíte', 'stoja', 'stál'], ['vidieť', 'vidím', 'vidíš', 'vidí', 'vidíme', 'vidíte', 'vidia', 'videl'],
    ['prísť', 'prídem', 'prídeš', 'príde', 'prídeme', 'prídete', 'prídu', 'prišiel']];

  const types = [['Тип (1-а ос.)', 'Зразок', 'ja … oni', 'Ще дієслова'],
    ['-ám', 'volať', 'volám, voláš, volá, voláme, voláte, volajú', 'čítať, hľadať, bývať, počúvať, mať'],
    ['-ím', 'robiť', 'robím, robíš, robí, robíme, robíte, robia', 'hovoriť, variť, platiť, vidieť, musieť'],
    ['-iem', 'rozumieť', 'rozumiem, rozumieš, rozumie, rozumieme, rozumiete, rozumejú', 'vedieť (viem…vedia), niesť (nesiem…nesú)'],
    ['-ujem', 'pracovať', 'pracujem, pracuješ, pracuje, pracujeme, pracujete, pracujú', 'усі на -ovať: kupovať, potrebovať, študovať'],
    ['-em', 'písať', 'píšem, píšeš, píše, píšeme, píšete, píšu', 'česať (češem), plakať (plačem)']];

  const nums = [['1–10', 'jeden/jedna/jedno, dva/dve, tri, štyri, päť, šesť, sedem, osem, deväť, desať'],
    ['11–19', 'jedenásť, dvanásť, trinásť, štrnásť, pätnásť, šestnásť, sedemnásť, osemnásť, devätnásť'],
    ['десятки', 'dvadsať, tridsať, štyridsať, päťdesiat, šesťdesiat, sedemdesiat, osemdesiat, deväťdesiat'],
    ['сотні', 'sto, dvesto, tristo, štyristo, päťsto … tisíc, milión'],
    ['порядкові', 'prvý, druhý, tretí, štvrtý, piaty, šiesty, siedmy, ôsmy, deviaty, desiaty'],
    ['чоловіки (живі)', 'dvaja, traja, štyria muži — але päť mužov']];

  SK.ref = [
    { id: 'pron', title: 'Абетка і вимова', html: tbl(['Літера', 'Звук', 'Приклад'], alphabet.map((r) => ['<b>' + r[0] + '</b>', r[1], r[2].split(', ').map(say).join(', ')])) +
      '<ul><li>Наголос — <b>завжди на першому складі</b>; односкладовий прийменник забирає його на себе (DO-práce).</li><li>Довгота (´) — це не наголос.</li>' +
      '<li>de, te, ne, le, di, ti, ni, li звучать м\'яко (крім запозичень і слів ten, teraz, kedy…).</li><li>Дзвінкі в кінці слова оглушуються: dub → «дуп».</li>' +
      '<li>Ритмічний закон: два довгі склади поспіль зазвичай не стоять (krásny, а не krásný).</li></ul>' },
    { id: 'ff', title: 'Фальшиві друзі', html: tbl(['Словацьке слово', 'Означає', 'А «схоже» українське (рос.) — це…'], ff.map((r) => [say(r[0]), r[1], r[2]])) },
    { id: 'cases', title: 'Відмінки та прийменники', html: tbl(['Відмінок', 'Питання', 'Прийменники', 'Приклад'], cases) +
      '<p class="small muted">У сучасній словацькій 6 відмінків; кличний (5-й) лишився хіба в окремих формах (pane, bože, chlapče).</p>' },
    { id: 'vzory-m', title: 'Іменники: чоловічий рід', html: vz(vzory.m) + '<p class="small muted">Живі на -a (hrdina, kolega, turista) відмінюються за «hrdina».</p>' },
    { id: 'vzory-f', title: 'Іменники: жіночий рід', html: vz(vzory.f) },
    { id: 'vzory-n', title: 'Іменники: середній рід', html: vz(vzory.n) },
    { id: 'adj', title: 'Прикметники (pekný / cudzí)', html: vz(adj) + '<p class="small muted">* — форма для чоловічого роду, живих (pekní muži, vidím pekného psa). Після довгого складу закінчення коротке: krásny, krásna.</p>' },
    { id: 'pronouns', title: 'Особові займенники у відмінках', html: vz(pron) + '<p class="small muted">Короткі форми (ma, ťa, mi, ti, ho, mu, sa, si) — клітики, ставляться на другу позицію. Довгі (mňa, teba, jeho…) — для наголосу та після прийменників (pre mňa, k nemu, o ňom).</p>' },
    { id: 'verbs', title: 'Дієслова: типи відмінювання', html: tbl(types[0], types.slice(1)) +
      '<p><b>Минулий час:</b> -l / -la / -lo / -li + som, si, sme, ste (у 3-й особі без них). <b>Майбутній:</b> budem + недоконаний інфінітив, або доконане дієслово в теперішній формі. <b>Умовний:</b> -l + by + som…: robil by som.</p>' },
    { id: 'irreg', title: 'Найважливіші неправильні дієслова', html: vz(verbs) },
    { id: 'nums', title: 'Числа', html: tbl(['', ''], nums.map((r) => ['<b>' + r[0] + '</b>', r[1]])) + '<p>1 euro · 2–4 eurá · 5+ eur. 1 rok · 2–4 roky · 5+ rokov.</p>' }
  ];
})(SK);
})(PG.pack("sk"));
/* ---- sk/data/program.js ---- */
/* Програма до B2: принципи, тижневий ритм, етапи й модулі */
(function (SK) {
SK.program = {
  intro: 'Програма для україномовних, які живуть у Словаччині: з нуля до B2 · 15–30 хв у робочі дні · самостійно. Пріоритети: розмова → слухання → читання → письмо.',
  estimate: 'Орієнтовно 96 тижнів, тобто близько 22 місяців у вашому темпі. Щоденне життя в Словаччині може суттєво пришвидшити темп — тоді просто рухайтеся далі, коли контрольна точка складена.',
  principles: [
    ['Розмова — щодня', 'Щодня хоча б 3–5 хвилин говоріть уголос: повторюйте за диктором (shadowing), коментуйте свої дії, записуйте себе. Розмова — ваш пріоритет №1.'],
    ['Місто — ваш підручник', 'Щотижня виконуйте «місію» в реальному житті: магазин, транспорт, аптека, сусіди. У вас є середовище — це головна перевага.'],
    ['Не довіряйте схожості', 'Найбільше помилок у тих місцях, де словацька «майже як українська»: фальшиві друзі, наголос, довгота, rád robím, v práci, клітики. Учіть відмінності свідомо.'],
    ['Слова — інтервальним повторенням', '5 хвилин щодня у вкладці «Слова». Слова, які почули в житті, додавайте у «Мої слова».'],
    ['Учіть фразами', 'Запам\'ятовуйте фрази цілком: «Prosím si…», «Kde mám vystúpiť?». Окремі слова вчити менш ефективно.'],
    ['Не плутайте з чеською', 'В інтернеті багато чеських матеріалів. Перевіряйте, що вони саме словацькі.'],
    ['Просіть словацьку', 'Словаки часто переходять на англійську чи російську. Кажіть: «Hovorte so mnou po slovensky, prosím.»'],
    ['Вихідні вільні', 'Навчання тільки в робочі дні. На вихідних за бажанням — словацьке радіо фоном, серіал, прогулянка з читанням вивісок.']
  ],
  week: [
    { d: 1, name: 'Понеділок', full: 'Новий урок: теорія з озвученням + перші вправи', min: 'Теорія (послухайте всі приклади)' },
    { d: 2, name: 'Вівторок', full: 'Вправи уроку + диктанти (слухання) + слова уроку', min: 'Половина вправ' },
    { d: 3, name: 'Середа', full: 'Розмова: shadowing фраз уроку, запис себе, 1–2 завдання з таймером', min: 'Shadowing 5 фраз із записом' },
    { d: 4, name: 'Четвер', full: 'Решта вправ (≥ 80%) + 10 хв справжнього словацького (радіо, подкаст, новини)', min: 'Решта вправ' },
    { d: 5, name: 'П\'ятниця', full: 'Місія тижня в реальному житті + 3–5 речень письмово про тиждень', min: 'Місія тижня' }
  ],
  weekA0: 'На етапі 0 один урок займає 2 дні. День 1 — теорія і вимова (з записом себе). День 2 — вправи, диктант і місія.',
  daily: 'Щодня перед заняттям: 5 хвилин «Слова».',
  stages: [
    { id: 'a0', level: 'Етап 0', title: 'Старт: письмо, читання, вимова', weeks: '1–2', built: true,
      cando: ['читаю будь-яке словацьке слово', 'правильно ставлю наголос і тягну довгі голосні', 'вітаюся, дякую, представляюся'] },
    { id: 'a1', level: 'A1', title: 'Виживання: базові ситуації', weeks: '3–16', built: true,
      cando: ['розповідаю про себе, сім\'ю, роботу', 'купую, питаю ціну, плачу', 'їжджу транспортом і питаю дорогу', 'розповідаю про вчора і завтра', 'розумію на слух ціни, час і дати, називаю місяці й кольори'],
      checkpoint: 'Підсумковий тест A1.13 (≥ 80%) і 3–5 хвилин живої розмови.' },
    { id: 'a2', level: 'A2', title: 'Побут без перекладача', weeks: '17–38',
      cando: ['справляюся в лікаря, на пошті, в банку, з орендодавцем', 'розумію повільне чітке мовлення на побутові теми', 'читаю оголошення, короткі листи, інструкції', 'пишу коротке повідомлення або email'],
      checkpoint: 'Пробний тест рівня A2 і 10-хвилинна розмова на побутові теми. A2 також потрібен для довгострокового (EU) проживання — див. «Мова і ВНЖ».',
      modules: [
        { id: 'a2-1', title: 'Відмінки однини: чоловічий рід', weeks: '17–18', grammar: 'Зразки chlap, hrdina, dub, stroj — усі 6 відмінків однини; давальний -ovi / -u.', vocab: 'Люди та професії; у лікаря (основи).', speak: 'Опишіть людей навколо: кому що даєте, з ким говорите.', listen: 'slovake.eu A2: діалоги; Learn Slovak and More Podcast.', read: 'Короткі оголошення, вивіски.', write: '5 речень про колег чи сусідів.', mission: 'Запишіться до лікаря телефоном або на рецепції: «Chcel(a) by som sa objednať k lekárovi.»' },
        { id: 'a2-2', title: 'Відмінки однини: жіночий і середній рід', weeks: '19–20', grammar: 'žena, ulica, dlaň, kosť; mesto, srdce, vysvedčenie, dievča.', vocab: 'Житло: квартира, оренда, побутова техніка, ремонт.', speak: 'Опишіть свою квартиру і що в ній треба полагодити.', listen: 'Діалоги про житло (slovake.eu).', read: 'Оголошення про оренду.', write: 'Повідомлення орендодавцю про несправність.', mission: 'Поясніть словацькою проблему в квартирі (орендодавцю, управителю будинку чи майстру).' },
        { id: 'a2-3', title: 'Прикметники й займенники у відмінках', weeks: '21–22', grammar: 'pekný / cudzí в усіх відмінках однини; môj, tvoj, náš, váš, jeho, jej, ich; ten, tento.', vocab: 'Одяг, кольори (farba!), розміри.', speak: 'Опишіть, у що ви вдягнені і що хочете купити.', listen: 'Відео-огляди покупок.', read: 'Каталоги, акційні листівки (leták).', write: 'Опис людини (зовнішність, одяг).', mission: 'Поверніть або обміняйте товар у магазині: «Chcel(a) by som to vrátiť / vymeniť.»' },
        { id: 'a2-4', title: 'Прийменники + відмінки', weeks: '23–24', grammar: 'do, z, od, u, bez + G; k + D; pre, cez, na, za + A; v, na, o, po, pri + L; s, pred, za, nad, pod, medzi + I.', vocab: 'Місто, орієнтація, напрямки.', speak: 'Опишіть маршрут від дому до роботи з прийменниками.', listen: 'Оголошення в транспорті, на вокзалі.', read: 'Мапи, розклади (cp.sk).', write: 'Інструкція для гостя, як до вас доїхати.', mission: 'Купіть квиток на потяг або міжміський автобус у касі словацькою.' },
        { id: 'a2-5', title: 'Вид дієслова і дієслова руху', weeks: '25–26', grammar: 'ísť / chodiť, pôjsť; prísť, odísť, vojsť, vyjsť, prejsť; видові пари з префіксами.', vocab: 'Транспорт, подорожі, екскурсії.', speak: 'Розкажіть про поїздку: куди поїхали, як, що бачили.', listen: 'Подорожні відео словацькою.', read: 'Туристичні сайти міст і замків.', write: 'Листівка або повідомлення з поїздки (60–80 слів).', mission: 'Поїдьте в сусіднє місто або до замку (hrad) і спілкуйтеся тільки словацькою.' },
        { id: 'a2-6', title: 'Наказовий спосіб і в лікаря', weeks: '27–28', grammar: 'rob! robte! poď! poďme! nerob!; вид у наказовому.', vocab: 'Тіло, симптоми, аптека, ліки.', speak: 'Поясніть симптоми: «Bolí ma hlava, mám teplotu…»', listen: 'Діалоги в лікаря.', read: 'Інструкція до ліків (príbalový leták).', write: 'Повідомлення на роботу, що ви хворієте.', mission: 'Поясніть фармацевту, що вас турбує, і запитайте, як приймати ліки.' },
        { id: 'a2-7', title: 'Множина: називний відмінок і минулий час', weeks: '29–30', grammar: 'muži / stroje, ženy, mestá; oni / ony; robili; pekní muži / pekné ženy.', vocab: 'Їжа, ресторан, рецепти.', speak: 'Розкажіть рецепт улюбленої страви.', listen: 'Кулінарні відео словацькою.', read: 'Меню, рецепти.', write: 'Рецепт (8–10 речень).', mission: 'Замовте в ресторані повну страву і запитайте, що в ній є (alergény).' },
        { id: 'a2-8', title: 'Займенники і клітики', weeks: '31–32', grammar: 'mňa/ma, mne/mi, jeho/ho/neho…; порядок клітик у довгих реченнях.', vocab: 'Стосунки, почуття, запрошення.', speak: 'Запросіть когось кудись і домовтеся про деталі.', listen: 'Розмовні подкасти для початківців.', read: 'Короткі листи й повідомлення.', write: 'Запрошення і відповідь на нього.', mission: 'Запросіть колегу чи сусіда на каву і домовтеся словацькою.' },
        { id: 'a2-9', title: 'Порівняння', weeks: '33–34', grammar: 'lepší, väčší, menší, najlepší; viac / menej; ako, než.', vocab: 'Погода, природа, пори року.', speak: 'Порівняйте Словаччину і Україну: клімат, міста, їжу.', listen: 'Прогноз погоди на Rádio Slovensko.', read: 'Прогнози, короткі новини.', write: 'Порівняння двох міст (80–100 слів).', mission: 'Поговоріть із кимось про погоду — класична тема small talk.' },
        { id: 'a2-10', title: 'Умовний спосіб і ввічливі прохання', weeks: '35–36', grammar: 'robil by som, mohli by ste…, chcel by som; keby…', vocab: 'Пошта, банк, установи (базові слова).', speak: 'Ввічливі прохання: «Mohli by ste mi pomôcť?»', listen: 'Телефонні розмови (slovake.eu).', read: 'Офіційні листи (лише розуміти основне).', write: 'Ввічливий email із проханням.', mission: 'Вирішіть справу на пошті чи в банку тільки словацькою.' },
        { id: 'a2-11', title: 'Повторення і контрольна точка A2', weeks: '37–38', grammar: 'Огляд усіх відмінків однини, часів і виду.', vocab: 'Повторення.', speak: '10-хвилинна розмова на побутові теми.', listen: 'Діалоги рівня A2.', read: 'Тексти рівня A2.', write: 'Email 80–100 слів.', mission: 'Живий тест: 10 хвилин розмови з носієм мови.' }
      ] },
    { id: 'b1', level: 'B1', title: 'Самостійність: життя й робота словацькою', weeks: '39–66',
      cando: ['розповідаю історії, пояснюю причини, висловлюю думку', 'розумію головне в новинах і радіо на знайомі теми', 'читаю статті на побутові й суспільні теми', 'пишу зв\'язний текст і неформальні та прості формальні листи'],
      checkpoint: 'Пробний тест B1 (Krížom-krážom B1 — тестові завдання) і 15 хвилин розмови з висловленням думки.',
      modules: [
        { id: 'b1-1', title: 'Множина в усіх відмінках', weeks: '39–41', grammar: 'Родовий множини (žien, miest, mužov), -om/-ám, -och/-ách, -mi/-ami.', vocab: 'Робота: колектив, обов\'язки, графік.', speak: 'Розкажіть про свою роботу і колег.', listen: 'Подкасти про роботу і кар\'єру.', read: 'Оголошення про вакансії (profesia.sk).', write: 'Опис своєї роботи (120 слів).', mission: 'Візьміть участь у робочій нараді чи small talk словацькою.' },
        { id: 'b1-2', title: 'Числівники та іменники; дати', weeks: '42–43', grammar: 'dvaja muži / päť mužov, dve ženy; prvého mája; o pol tretej, štvrť na…', vocab: 'Гроші, рахунки, комунальні послуги.', speak: 'Поясніть свої щомісячні витрати.', listen: 'Новини про ціни й економіку (простіші).', read: 'Рахунки, договори (розуміти головне).', write: 'Скарга на неправильний рахунок.', mission: 'З\'ясуйте словацькою питання з рахунком (енергія, оператор зв\'язку).' },
        { id: 'b1-3', title: 'Складні речення', weeks: '44–46', grammar: 'že, aby (aby som!), keď, ak, pretože, lebo, kým, hoci; ktorý / ktorá / ktoré у відмінках.', vocab: 'Освіта, курси, навчання.', speak: 'Поясніть, чому ви вчите словацьку і чого хочете досягти.', listen: 'Інтерв\'ю на Rádio Slovensko.', read: 'Статті на spravy.stvr.sk.', write: 'Текст «Мій шлях у Словаччині» (150 слів).', mission: 'Зателефонуйте в установу чи на курси й запитайте подробиці.' },
        { id: 'b1-4', title: 'Умовні речення і поради', weeks: '47–49', grammar: 'keby som mal čas…, keby som bol vedel…; mal by si…', vocab: 'Здоров\'я, спорт, спосіб життя.', speak: 'Дайте пораду другу в складній ситуації.', listen: 'Подкасти про здоров\'я.', read: 'Статті-поради.', write: 'Лист із порадою (150 слів).', mission: 'Запишіться в спортзал чи клуб і розпитайте про умови.' },
        { id: 'b1-5', title: 'Пасив і безособові конструкції', weeks: '50–52', grammar: 'je zatvorené, bolo urobené, predáva sa, hovorí sa, treba, dá sa.', vocab: 'Новини, суспільство, події.', speak: 'Перекажіть новину дня.', listen: 'Щоденні новини STVR.', read: 'teraz.sk, spravy.stvr.sk.', write: 'Короткий переказ новини (100 слів).', mission: 'Обговоріть новину з колегою чи знайомим.' },
        { id: 'b1-6', title: 'Словотвір', weeks: '53–55', grammar: 'čítanie, pitie; -teľ, -ník, -ka; префікси дієслів (pre-, vy-, za-, od-, po-).', vocab: 'Технології, побутові сервіси.', speak: 'Поясніть, як щось працює.', listen: 'Технологічні відео словацькою.', read: 'Інструкції, FAQ сервісів.', write: 'Інструкція (кроки) для чогось знайомого.', mission: 'Вирішіть проблему зі службою підтримки словацькою (чат або телефон).' },
        { id: 'b1-7', title: 'Дієслова руху з префіксами', weeks: '56–58', grammar: 'ísť / chodiť, niesť / nosiť, viesť / vodiť, viezť / voziť + pri-, od-, vy-, pre-, z-, ob-.', vocab: 'Переїзд, логістика, доставка.', speak: 'Розкажіть про свій переїзд у Словаччину.', listen: 'Подкасти-історії.', read: 'Оповідання, адаптовані книжки.', write: 'Розповідь про переїзд (180 слів).', mission: 'Організуйте доставку чи переїзд, спілкуючись словацькою.' },
        { id: 'b1-8', title: 'Розмовна словацька', weeks: '59–61', grammar: 'Частки veď, však, predsa, asi, vraj, hádam, no; слова-заповнювачі; розмовні скорочення.', vocab: 'Сленг і розмовні вирази; регіональні відмінності.', speak: '15 хвилин вільної розмови в мовному клубі.', listen: 'Словацькі серіали з субтитрами.', read: 'Коментарі, форуми, соцмережі.', write: 'Неформальний лист другу (150 слів).', mission: 'Сходіть на розмовний клуб або зустріньтеся з мовним партнером.' },
        { id: 'b1-9', title: 'Вибрані слова (i / y) і правопис', weeks: '62–63', grammar: 'Vybrané slová після b, m, p, r, s, v, z; правопис після твердих і м\'яких приголосних.', vocab: 'Повторення частих слів.', speak: 'Читання вголос, 2 хв без зупинок.', listen: 'Диктанти з озвученням.', read: 'Будь-які тексти — звертайте увагу на i / y.', write: 'Диктант або переписування тексту.', mission: 'Напишіть словацькою пост чи відгук (Google Maps, сервіс).' },
        { id: 'b1-10', title: 'Повторення і контрольна точка B1', weeks: '64–66', grammar: 'Огляд B1.', vocab: 'Повторення.', speak: '15 хвилин розмови з висловленням думки.', listen: 'Пробний тест B1.', read: 'Пробний тест B1.', write: 'Email і короткий текст-думка.', mission: 'Живий тест: обговорення теми з носієм мови 15 хвилин.' }
      ] },
    { id: 'b2', level: 'B2', title: 'Вільне спілкування', weeks: '67–96',
      cando: ['спонтанно й вільно говорю з носіями', 'розумію новини, ток-шоу, більшість фільмів', 'читаю статті й аналітику', 'пишу аргументований текст і формальні листи'],
      checkpoint: 'Пробний іспит B2 (формат SAS: читання + граматика, слухання, письмо) і 20 хвилин дискусії.',
      modules: [
        { id: 'b2-1', title: 'Аргументація і зв\'язки в тексті', weeks: '67–70', grammar: 'avšak, preto, napriek tomu, na jednej strane… na druhej strane, okrem toho, teda, čiže.', vocab: 'Суспільні теми: житло, робота, міграція.', speak: 'Дискусія «за і проти» (3–5 хв).', listen: 'Ток-шоу, дебати на STVR.', read: 'Аналітичні статті.', write: 'Аргументований текст 200–220 слів (формат іспиту).', mission: 'Висловте й обґрунтуйте свою думку в розмові з колегами.' },
        { id: 'b2-2', title: 'Стилі: розмовний і офіційний', weeks: '71–74', grammar: 'Формули ввічливості, офіційні листи, канцелярські звороти (розпізнавати).', vocab: 'Офіційна комунікація.', speak: 'Офіційний телефонний дзвінок.', listen: 'Офіційні оголошення, пресконференції.', read: 'Офіційні листи, повідомлення установ.', write: 'Формальний email 100–120 слів (формат іспиту).', mission: 'Напишіть офіційний лист чи запит до установи словацькою.' },
        { id: 'b2-3', title: 'Дієприкметники та книжні конструкції', weeks: '75–78', grammar: 'robiaci, píšuci, urobený; дієприслівники (robiac); віддієслівні іменники.', vocab: 'Наука, освіта, медіа.', speak: 'Перекажіть статтю зі своїми коментарями.', listen: 'Науково-популярні передачі (Rádio Devín / Slovensko).', read: 'Науково-популярні статті.', write: 'Резюме статті (150 слів).', mission: 'Сходіть на лекцію чи екскурсію словацькою і перекажіть її.' },
        { id: 'b2-4', title: 'Фразеологія та ідіоми', weeks: '79–82', grammar: '100 найчастіших ідіом і прислів\'їв.', vocab: 'Ідіоми, порівняння, прислів\'я.', speak: 'Розкажіть історію, вживши 5 ідіом.', listen: 'Комедійні шоу, подкасти.', read: 'Колонки, фейлетони.', write: 'Неформальна розповідь з ідіомами.', mission: 'Запитайте знайомих словаків про їхні улюблені вирази.' },
        { id: 'b2-5', title: 'Тонкощі граматики', weeks: '83–86', grammar: 'Вид у наказовому і в запереченні; порядок слів і логічний наголос; клітики в складних реченнях.', vocab: 'Культура, історія, регіони Словаччини.', speak: 'Презентація про регіон Словаччини (5 хв).', listen: 'Документальні фільми.', read: 'Історичні та культурні статті.', write: 'Есе про культуру (200 слів).', mission: 'Проведіть друзям «екскурсію» своїм містом словацькою.' },
        { id: 'b2-6', title: 'Медіа без адаптації', weeks: '87–90', grammar: 'Огляд складних тем на матеріалі медіа.', vocab: 'Політика, економіка (на рівні розуміння).', speak: 'Обговоріть новину тижня 10 хв.', listen: 'Фільми й серіали без субтитрів.', read: 'Книга словацького автора.', write: 'Рецензія на фільм чи книгу (200 слів).', mission: 'Подивіться словацький фільм без субтитрів і перекажіть його.' },
        { id: 'b2-7', title: 'Підготовка до іспиту B2', weeks: '91–96', grammar: 'Тренування за форматом SAS: читання + граматика (60 хв), слухання (40 хв), письмо (80 хв).', vocab: 'Повторення.', speak: 'Пробні усні відповіді.', listen: 'Пробні тести слухання.', read: 'Пробні тести читання.', write: 'Пробне письмо: аргументація 200–220 слів + email 100–120 слів.', mission: 'Зареєструйтеся на іспит через slovak-language.sk — якщо сертифікат вам потрібен.' }
      ] }
  ]
};
})(PG.pack("sk"));
/* ---- sk/data/resources.js ---- */
/* Ресурси та довідка про мовні вимоги (перевірено 30.10.2026) */
(function (SK) {
SK.residence = {
  checked: '30.10.2026',
  items: [
    ['Тимчасове проживання (prechodný pobyt)', 'Мовних вимог немає. Співбесіду можна проходити з перекладачем.'],
    ['Постійне проживання на 5 років і безстрокове (trvalý pobyt)', 'Мовного іспиту немає. Поліція може враховувати «ступінь інтеграції» на власний розсуд, тож знання мови допомагає.'],
    ['Довгострокове проживання резидента ЄС (dlhodobý pobyt)', '<b>Потрібна словацька рівня A2</b>, підтверджена іспитом у мовній школі або державному університеті (діє з 15.07.2025). Для цього статусу потрібно 5 років безперервного легального перебування. Люди з тимчасовим захистом подаватися на нього не можуть.'],
    ['Громадянство', 'Співбесіда словацькою, читання вголос газетної статті (≥ 500 слів) і письмовий переказ за 30 хвилин. Рівень CEFR не вказано, на практиці це близько B1–B2.'],
    ['Тимчасовий захист (dočasné útočisko)', 'Очікується, що діятиме до березня 2027 року. Передбачено перехідний рік, щоб подати документи на звичайний дозвіл на проживання. Стежте за офіційними джерелами.']
  ],
  note: 'Це не юридична консультація. Перед поданням документів перевірте актуальні вимоги на mic.iom.sk або в cudzineckej polícii.',
  links: [['IOM Migration Information Centre', 'https://www.mic.iom.sk/en/'], ['Закон 404/2011 (актуальна редакція)', 'https://www.zakonypreludi.sk/zz/2011-404']]
};
SK.exam = {
  text: 'Офіційний іспит — «Štandardizované testovanie jazykových úrovní A2–C1», який проводить Studia Academica Slovaca (Філософський факультет Університету Коменського). Пробний тест B2 складається з трьох частин: читання + граматика (60 хв), слухання (40 хв), письмо (80 хв: аргументований текст 200–220 слів і email 100–120 слів). Дати й реєстрація — на порталі slovak-language.sk.',
  links: [['Про іспит (SAS)', 'https://fphil.uniba.sk/katedry-a-odborne-pracoviska/sas/testovanie-slovenciny-ako-cudzieho-jazyka/standardizovane-testovanie-jazykovych-urovni-a2-c1/'],
    ['Пробний тест B2 (PDF)', 'https://slovak-language.sk/public_files/bae94dff91c25706f87c7923b980e7d6.pdf'], ['Реєстрація на іспит', 'https://slovak-language.sk/sk/home/register-to-exam']]
};
SK.resources = [
  { cat: 'Курси та підручники', items: [
    ['slovake.eu', 'https://slovake.eu/', 'Безкоштовний курс A1–B2 з аудіо; є український і російський інтерфейс. Головне доповнення до тренажера.', 'A1–B2'],
    ['Основи словацької мови для українських студентів (Пряшівський університет, 2026)', 'https://www.unipo.sk/sites/default/files/content/86055/zaklady-sk-jazyka-pre-uk-studentov-skripta.pdf', 'Безкоштовний PDF, пояснення українською, рівень A1.', 'A1'],
    ['Krížom-krážom (Studia Academica Slovaca)', 'https://fphil.uniba.sk/katedry-a-odborne-pracoviska/sas/krizom-krazom/', 'Класичні підручники A1–B2 з аудіо, а також тестові завдання B1/B2. Платні.', 'A1–B2'],
    ['Відкриті курси словацької IOM', 'https://www.mic.iom.sk/en/social-issues/education/494-open-courses-of-slovak-language.html', 'Безкоштовні онлайн-курси A1–B2. Набір відкривається періодично — стежте за сторінкою.', 'A1–B2']
  ] },
  { cat: 'Слухання', items: [
    ['Learn Slovak and More Podcast', 'https://podcastrepublic.net/podcast/1576777507', 'Щотижневий подкаст для тих, хто вчить словацьку.', 'A2–B1'],
    ['FluentFiction — Slovak', 'https://podcastaddict.com/podcast/4765686', 'Короткі історії словацькою з поясненнями.', 'A2–B2'],
    ['Rádio Slovensko (STVR)', 'https://slovensko.stvr.sk/player', 'Новини, інтерв\'ю, прогноз погоди. Слухайте фоном від A2.', 'A2–B2'],
    ['Rádio_FM (STVR)', 'https://fm.stvr.sk/player', 'Музика й молодіжні програми, розмовна мова.', 'B1–B2'],
    ['Архів STVR', 'https://www.stvr.sk/radio/archiv', 'Передачі в записі — можна слухати повільно й повторювати.', 'B1–B2']
  ] },
  { cat: 'Читання', items: [
    ['Správy STVR', 'https://spravy.stvr.sk', 'Новини суспільного мовника, чітка стандартна мова.', 'B1–B2'],
    ['TASR (teraz.sk)', 'https://www.teraz.sk', 'Короткі агентські новини, зручні для переказу.', 'B1–B2']
  ] },
  { cat: 'Словники та перекладачі', items: [
    ['Lingea: українсько-словацький словник', 'https://slovniky.lingea.sk/ukrajinsko-slovensky/', 'Безкоштовний словник (є платна версія).', 'усі'],
    ['Словники JÚĽŠ SAV', 'https://slovnik.juls.savba.sk', 'Офіційні тлумачні словники та норма — перевіряйте, як правильно.', 'B1–B2'],
    ['DeepL', 'https://www.deepl.com/translator', 'Підтримує словацьку й українську. Використовуйте для перевірки, а не замість власного тексту.', 'усі']
  ] },
  { cat: 'Розмовна практика', items: [
    ['HelloTalk', 'https://www.hellotalk.com/en/learn/slovak', 'Мовний обмін із носіями: текст, голосові, виправлення.', 'A2–B2'],
    ['Mareena — мовні курси й розмовні групи', 'https://mareena.sk/kurzy', 'Братислава, Кошиці, онлайн; окремі групи для носіїв слов\'янських мов. Платно (приблизно 130 € за триместр).', 'A1–B2']
  ] }
];
})(PG.pack("sk"));
