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
