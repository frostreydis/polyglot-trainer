/* Мовний пакет «Англійська»: варіанти US / UK і правопис, перевірка відповідей, голос, тексти інтерфейсу,
 * тренажер чисел, мій словник (транскрипція й записи носіїв) */
(function (EN) {
  'use strict';

  EN.names = { nom: 'англійська', ins: 'англійською', gen: 'англійської', acc: 'англійську', adj: 'англійський', adjGen: 'англійського' };
  EN.htmlLang = 'en';
  // Порядок варіантів = порядок у розмітці {{US|UK}} в уроках
  EN.variants = [
    { id: 'us', tag: 'US', name: 'американська', acc: 'американську', label: 'Американська (US)', voice: /^en[-_]us/i, online: 'en-US', sample: 'Hello! My favorite color is gray.' },
    { id: 'gb', tag: 'UK', name: 'британська', acc: 'британську', label: 'Британська (UK)', voice: /^en[-_](gb|uk)/i, online: 'en-GB', sample: 'Hello! My favourite colour is grey.' }
  ];
  EN.tts = { voices: /^en([-_]|$)/i, lang: 'en-US', online: 'en-US' };
  EN.settings = {
    defaults: { variant: 'us', autoIpa: true },
    tidy(st) { st.autoIpa = st.autoIpa !== false; }
  };
  // variantAsked — учень уже відповів «яку англійську вчимо»: до того питання стоїть першим на «Сьогодні»
  EN.uiDefaults = { variantAsked: false };
  // [слів від, до, вправ від, до] за етапом: уроки A2–B2 тривають 2–3 тижні, тож вправ у них більше, ніж в A1
  EN.limits = { a0: [12, 25, 10, 16], a1: [15, 25, 12, 16], a2: [15, 25, 12, 18], b1: [15, 25, 12, 18], b2: [15, 25, 12, 18] };

  // Пари правопису [британське, американське, напрям]: 2 — в обидва боки; 1 — лише UK → US, бо американська форма
  // в британській англійській теж буває правильною (practice — іменник, program — комп'ютерна програма, check — перевірка)
  const SPELL_PAIRS = (() => {
    const p = [], add = (uk, us, dir) => p.push([uk, us, dir || 2]);
    const sfx = (stems, ukEnd, usEnd, ends) => stems.forEach((st) => ends.forEach((e) => add(st + ukEnd + e, st + usEnd + e)));
    sfx(['colo', 'favo', 'flavo', 'hono', 'labo', 'neighbo', 'behavio', 'harbo', 'rumo', 'savo', 'armo', 'odo', 'endeavo', 'parlo', 'tumo', 'vigo', 'humo'],
      'ur', 'r', ['', 's', 'ed', 'ing', 'ite', 'ites', 'able', 'ably', 'ful', 'less', 'hood', 'hoods', 'y', 'er', 'ers']);
    sfx(['real', 'organ', 'recogn', 'apolog', 'memor', 'modern', 'critic', 'emphas', 'priorit', 'summar', 'special', 'minim', 'maxim', 'final', 'custom',
      'categor', 'standard', 'social', 'sympath', 'visual', 'util', 'author', 'character', 'optim', 'energ', 'familiar', 'general', 'legal', 'mobil',
      'neutral', 'normal', 'personal', 'popular', 'public', 'stabil', 'symbol', 'central', 'civil', 'colon', 'dramat', 'econom', 'hospital', 'ideal',
      'immun', 'item', 'jeopard', 'local', 'marginal', 'monopol', 'patron', 'penal', 'polar', 'privat', 'rational', 'revolution', 'scrutin', 'steril',
      'terror', 'theor', 'trivial', 'vandal', 'agon', 'fertil', 'harmon', 'human', 'magnet', 'nation', 'natural', 'random', 'sanit', 'sensit',
      'synchron', 'digit', 'computer', 'capital', 'commercial', 'glob', 'global', 'western', 'urban', 'motor', 'pressur', 'tranquil', 'equal', 'formal'],
      'is', 'iz', ['e', 'es', 'ed', 'ing', 'er', 'ers', 'ation', 'ations', 'able']);
    sfx(['anal', 'paral', 'catal'], 'ys', 'yz', ['e', 'es', 'ed', 'ing', 'er']);
    sfx(['travel', 'cancel', 'label', 'model', 'fuel', 'level', 'signal', 'quarrel', 'counsel', 'dial', 'equal', 'total', 'marvel', 'pedal', 'tunnel', 'channel', 'jewel', 'rival', 'shovel'],
      'l', '', ['ed', 'ing', 'er', 'ers', 'or', 'ors']);
    [['centre', 'center'], ['centres', 'centers'], ['centred', 'centered'], ['theatre', 'theater'], ['theatres', 'theaters'], ['kilometre', 'kilometer'],
      ['kilometres', 'kilometers'], ['centimetre', 'centimeter'], ['centimetres', 'centimeters'], ['millimetre', 'millimeter'], ['millimetres', 'millimeters'],
      ['litre', 'liter'], ['litres', 'liters'], ['fibre', 'fiber'], ['fibres', 'fibers'], ['calibre', 'caliber'], ['sombre', 'somber'], ['spectre', 'specter'],
      ['lustre', 'luster'], ['meagre', 'meager'], ['sabre', 'saber'], ['manoeuvre', 'maneuver'], ['manoeuvres', 'maneuvers'], ['marvellous', 'marvelous'],
      ['jewellery', 'jewelry'], ['woollen', 'woolen'], ['grey', 'gray'], ['greyish', 'grayish'], ['mum', 'mom'], ['mums', 'moms'], ['mummy', 'mommy'],
      ['maths', 'math'], ['practised', 'practiced'], ['practising', 'practicing'], ['defence', 'defense'], ['offence', 'offense'], ['offences', 'offenses'],
      ['pretence', 'pretense'], ['catalogue', 'catalog'], ['catalogues', 'catalogs'], ['aluminium', 'aluminum'], ['pyjamas', 'pajamas'], ['plough', 'plow'],
      ['sceptical', 'skeptical'], ['sceptic', 'skeptic'], ['cosy', 'cozy'], ['mould', 'mold'], ['fulfil', 'fulfill'], ['fulfilment', 'fulfillment'],
      ['enrol', 'enroll'], ['enrolment', 'enrollment'], ['instalment', 'installment'], ['skilful', 'skillful'], ['wilful', 'willful'], ['moustache', 'mustache'],
      ['paediatrician', 'pediatrician'], ['anaemia', 'anemia'], ['diarrhoea', 'diarrhea'], ['encyclopaedia', 'encyclopedia'], ['foetus', 'fetus'],
      ['at the weekend', 'on the weekend'], ['at weekends', 'on weekends']].forEach(([a, b]) => add(a, b));
    [['metre', 'meter'], ['metres', 'meters'], ['programme', 'program'], ['programmes', 'programs'], ['practise', 'practice'], ['practises', 'practices'],
      ['licence', 'license'], ['licences', 'licenses'], ['cheque', 'check'], ['cheques', 'checks'], ['tyre', 'tire'], ['tyres', 'tires'], ['dialogue', 'dialog'],
      ['dialogues', 'dialogs'], ['analogue', 'analog'], ['ageing', 'aging'], ['judgement', 'judgment'], ['enquire', 'inquire'], ['enquires', 'inquires'],
      ['enquired', 'inquired'], ['enquiring', 'inquiring'], ['enquiry', 'inquiry'], ['enquiries', 'inquiries'], ['learnt', 'learned'], ['spelt', 'spelled'],
      ['dreamt', 'dreamed'], ['burnt', 'burned'], ['spoilt', 'spoiled'], ['spilt', 'spilled'], ['storey', 'story'], ['storeys', 'stories'], ['kerb', 'curb'],
      ['draught', 'draft'], ['axe', 'ax']].forEach(([a, b]) => add(a, b, 1));
    return p;
  })();
  const SPELL = { us: new Map(), gb: new Map() };
  SPELL_PAIRS.forEach(([uk, us, dir], g) => {
    SPELL.us.set(uk, { to: us, g });
    if (dir === 2) SPELL.gb.set(us, { to: uk, g });
  });
  const SPELL_RE = new RegExp('\\b(' + SPELL_PAIRS.flatMap(([a, b]) => [a, b]).sort((a, b) => b.length - a.length).map((w) => w.replace(/ /g, '\\s+')).join('|') + ')\\b', 'gi');
  const wordIn = (low, w) => new RegExp('\\b' + w.replace(/ /g, '\\s+') + '\\b').test(low);
  const LABEL_AFTER = /^(\|[^\]]*)?(\]\])?[\s,;]*\(?\s*(UK\b|US\b|брит|амер|британ|америк)/i;
  const LABEL_BEFORE = /(\bUK|\bUS|брит\.?|амер\.?|британською|американською|британці|американці)\s*[:—–-]?\s*(\[\[)?\s*$/i;
  // Клітинки таблиці не ділять блок: у таблицях порівняння британське й американське слово стоять у сусідніх клітинках рядка
  const BLOCK = /(<\/?(?:p|li|tr|div|h[1-6]|br|ul|ol|table|summary|details)\b[^>]*>)/i;
  const keepCase = (src, to) => (src === src.toUpperCase() && src.length > 1 ? to.toUpperCase() : src[0] === src[0].toUpperCase() ? to[0].toUpperCase() + to.slice(1) : to);
  // Блок (абзац, рядок таблиці, пункт), де трапляються обидві форми пари, — це навмисне порівняння
  // («colour (UK) / color (US)»), тому його не чіпаємо. <span class="nv">…</span> теж не чіпаємо
  EN.spell = function (html, v) {
    const map = SPELL[v], keep = [];
    html = html.replace(/<span class="nv">[\s\S]*?<\/span>/g, (m) => '\u0001' + (keep.push(m) - 1) + '\u0002');
    const out = html.split(BLOCK).map((seg) => {
      if (/^</.test(seg) && BLOCK.test(seg)) return seg;
      const low = seg.replace(/<[^>]+>/g, ' ').toLowerCase().replace(/\s+/g, ' ');
      return seg.split(/(<[^>]+>)/).map((part) => (part[0] === '<' ? part : part.replace(SPELL_RE, (m, g, at, str) => {
        const e = map.get(m.toLowerCase().replace(/\s+/g, ' '));
        if (!e) return m;
        // Слово з позначкою варіанта поруч («[[at the weekend]] (UK)», «UK [[crisps]]») показує саме цей варіант
        if (LABEL_AFTER.test(str.slice(at + m.length, at + m.length + 24)) || LABEL_BEFORE.test(str.slice(Math.max(0, at - 24), at))) return m;
        const [a, b] = SPELL_PAIRS[e.g];
        if (wordIn(low, a) && wordIn(low, b)) return m;
        return keepCase(m, e.to);
      }))).join('');
    }).join('');
    return out.replace(/\u0001(\d+)\u0002/g, (m, k) => keep[+k]);
  };

  const norm = (s) => String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.,!?;:"„“”«»()…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
  // Британський і американський правопис зараховуються однаково (colour = color, organise = organize).
  // Заміни роблять з обох боків, тому «promise» → «promize» нічого не ламає. -our лише за списком: інакше four = for
  function spelling(s) {
    return s
      .replace(/\bpractise(s|d)?\b/g, 'practice$1').replace(/\blicence(s?)\b/g, 'license$1')
      .replace(/\bdefence(s?)\b/g, 'defense$1').replace(/\boffence(s?)\b/g, 'offense$1')
      .replace(/\b(colo|favo|flavo|hono|humo|labo|neighbo|behavio|harbo|rumo|savo|vapo|armo|odo|endeavo|parlo|tumo|vigo)ur/g, '$1r')
      .replace(/\b(cent|theat|met|lit|fib|kilomet|centimet|millimet|calib|somb|spect|lust|meag)re(s|d)?\b/g, '$1er$2')
      .replace(/\b(\w{2,})is(e|es|ed|er|ers|ing|ation|ations)\b/g, '$1iz$2')
      .replace(/\b(\w{2,})ys(e|es|ed|ing)\b/g, '$1yz$2')
      .replace(/\b(travel|cancel|label|model|fuel|level|signal|marvel|quarrel|counsel|dial|equal|total|jewel)l(ed|ing|er|ers|ous)\b/g, '$1$2')
      .replace(/\bjewellery\b/g, 'jewelry').replace(/\bgrey\b/g, 'gray').replace(/\bprogramme(s?)\b/g, 'program$1')
      .replace(/\bmum(s?)\b/g, 'mom$1').replace(/\bmaths\b/g, 'math').replace(/\bcatalogue\b/g, 'catalog');
  }
  // Скорочення розгортаються (I'm = I am, don't = do not). Неоднозначні 's і 'd дають варіанти (is / has, would / had).
  // 's розгортаємо лише після займенників: у «John's car» це присвійний відмінок
  const S_WORDS = 'he|she|it|that|there|here|what|where|who|how|when|why|this|everything|nothing|something|everyone|someone|nobody|everybody|somebody';
  function forkAll(list, re, a, b) {
    const out = [];
    for (const x of list) {
      let res = [''];
      let last = 0;
      for (const m of x.matchAll(re)) {
        const head = x.slice(last, m.index) + m[1] + ' ';
        res = res.flatMap((r) => [r + head + a, r + head + b]).slice(0, 8);
        last = m.index + m[0].length;
      }
      res.forEach((r) => out.push(r + x.slice(last)));
    }
    return out.slice(0, 16);
  }
  function variants(s) {
    s = s.replace(/\bwon't\b/g, 'will not').replace(/\bcan't\b/g, 'cannot').replace(/\bshan't\b/g, 'shall not').replace(/\bcan not\b/g, 'cannot')
      .replace(/n't\b/g, ' not').replace(/'m\b/g, ' am').replace(/'re\b/g, ' are').replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will')
      .replace(/\blet's\b/g, 'let us');
    // У пропуск після займенника учень вписує й саме скорочення: «I ___ been waiting» → «'d been waiting»
    let out = /^'s\b/.test(s) ? [s.replace(/^'s/, 'is'), s.replace(/^'s/, 'has')] : /^'d\b/.test(s) ? [s.replace(/^'d/, 'would'), s.replace(/^'d/, 'had')] : [s];
    out = forkAll(out, new RegExp("\\b(" + S_WORDS + ")'s\\b", 'g'), 'is', 'has');
    out = forkAll(out, /\b(i|you|he|she|it|we|they|there|that)'d\b/g, 'would', 'had');
    return out.map((x) => x.replace(/'/g, '').replace(/\s+/g, ' ').trim());
  }
  function canon(s, exact) {
    const n = spelling(norm(s));
    return exact ? [n] : variants(n);
  }
  // exact — для вправ на правопис і скорочення: без розгортання скорочень і без допуску на описку
  EN.check = function (input, answers, exact) {
    const list = Array.isArray(answers) ? answers : [answers];
    if (!norm(input)) return 'bad';
    const inp = canon(input, exact);
    const ans = list.flatMap((a) => canon(a, exact));
    if (inp.some((x) => ans.includes(x))) return 'ok';
    if (!exact && inp.some((x) => ans.some((y) => PG.nearTypo(x, y)))) return 'near';
    return 'bad';
  };

  EN.ui = {
    hello: 'Hello! 👋',
    praise: 'Well done!',
    missionDone: 'Great job! 🎉',
    weekend: 'Вихідний 🙂 Навчання за бажанням: серіал чи подкаст англійською, пісні, гра з англійським інтерфейсом.',
    weekendRow: 'Вільно. За бажанням — серіал, подкаст чи гра англійською.',
    near: '🟡 Майже — перевірте написання.',
    strict: 'Суворо перевіряти написання (відповідь з однією опискою не зараховується)',
    speakTip: 'Слідкуйте за наголосом та інтонацією, а не лише за звуками.',
    speakHint: 'Забули слово — опишіть його іншими словами: «It\'s a thing that…».',
    refSearch: 'Пошук у таблицях: напр. «bought», «magazine», «in / on / at»…',
    voiceHello: 'Hello! How are you today?',
    voiceTest: 'Hello! My name is Alex. I\'m learning English, and it\'s going really well.',
    voiceNote: 'Найприродніше звучать голоси з позначкою «Natural» (Edge) і «Google» (Chrome).',
    voiceHelp: '<li><b>Windows</b>: Параметри → Час і мова → Мовлення → Додати голоси → English (United States) / English (United Kingdom). Потім перезапустіть браузер.</li>' +
      '<li><b>Microsoft Edge</b>: уже має природні голоси «Microsoft Aria / Jenny / Guy / Sonia / Ryan Online (Natural)» (потрібен інтернет).</li>' +
      '<li><b>Mac</b>: Системні параметри → Доступність → Вміст мовлення → Системний голос → «Керувати голосами…» → English → завантажте голоси з позначкою Premium чи Enhanced.</li>' +
      '<li><b>Android</b>: Налаштування → Спеціальні можливості → Синтез мовлення → Google → Мова → English (US / UK).</li>' +
      '<li><b>iPhone / iPad</b>: Параметри → Універсальний доступ → Усний вміст → Голоси → English → завантажте «Enhanced».</li>',
    variantQuestion: 'Яку англійську вчимо?',
    variantIntro: 'Американська й британська англійська різняться написанням (<b>color</b> / <b>colour</b>), деякими словами (<b>apartment</b> / <b>flat</b>, <b>vacation</b> / <b>holiday</b>) і вимовою. ' +
      'Виберіть основну: так будуть написані уроки, слова й транскрипція, і так говоритиме голос. Інший варіант усе одно показуватиметься поруч дрібною позначкою «UK» чи «US». Змінити можна будь-коли в ⚙️ «Налаштування».',
    variantSettings: 'Від вибору залежать написання (color / colour), слова в парах (apartment / flat, vacation / holiday), транскрипція і голос — в уроках, словах, вправах і довіднику. Інший варіант показується поруч дрібною позначкою «UK» чи «US», а відповіді у вправах зараховуються в обох варіантах. У словнику будь-яке слово можна послухати й з іншим акцентом.',
    variantTitle: 'Яку англійську ви вчите',
    dictPromo: 'Почули нове слово на роботі, в серіалі чи пісні? Додайте його в словник — там його можна послухати з американською й британською вимовою, він потрапить у повторення, а словник можна експортувати й перенести на інший пристрій.',
    dictIntro: 'Слова з роботи, серіалів, пісень.',
    dictWordPh: 'напр. reschedule',
    dictUkPh: 'напр. перенести (зустріч)',
    dictNotePh: 'Примітка: дієслово, сленг, US…',
    dictExPh: 'Приклад: Can we reschedule the call?',
    dictImportPh: 'apple — яблуко\nto reschedule - перенести (зустріч)\nqueue; черга\n(можна вставити клітинки з Excel чи Google Таблиць: англійське слово і переклад у сусідніх колонках)',
    drillTitle: '🔢 Тренажер чисел, цін, часу, дат і spelling',
    drillIntro: 'Вправи щоразу нові, по 10 за підхід. На слух — записуєте цифрами (чи слово, яке продиктували по буквах); «словами» — пишете англійською (дефіси й «and» не важливі). Почніть із «Числа 0–20», «-teen чи -ty» і «Ціни».',
    drillCard: ['Тренажер чисел, цін, часу, дат і spelling', 'нескінченні диктанти на слух і письмо словами — для магазину, телефону, дзвінків і бронювань']
  };

  EN.drills = [
    ['n20', '🎧 Числа 0–20', { g: 'numListen', min: 0, max: 20 }],
    ['teen', '🎧 -teen чи -ty (13 / 30)', { g: 'teenListen' }],
    ['n100', '🎧 Числа 20–100', { g: 'numListen', min: 20, max: 100 }],
    ['n999', '🎧 Числа 100–999', { g: 'numListen', min: 100, max: 999 }],
    ['big', '🎧 Тисячі й мільйони', { g: 'numListen', min: 1000, max: 2000000 }],
    ['price', '🎧 Ціни (£, $, €)', { g: 'priceListen', min: 1, max: 99 }],
    ['time', '🎧 Час', { g: 'timeListen' }],
    ['date', '🎧 Дати', { g: 'dateListen' }],
    ['year', '🎧 Роки', { g: 'yearListen' }],
    ['phone', '🎧 Номери телефонів', { g: 'phoneListen' }],
    ['spell', '🎧 Слова по буквах (spelling)', { g: 'spellListen' }],
    ['nw', '✍️ Число → словами', { g: 'numWords', min: 0, max: 999 }],
    ['tw', '✍️ Час → словами', { g: 'timeWords' }],
    ['dw', '✍️ Дата → словами', { g: 'dateWords' }],
    ['mix', '🎲 Мікс усього', null]
  ];

  EN.infoCards = () => [Object.assign({ title: '🎓 Іспити й сертифікати' }, EN.exam)];

  const bare = (w) => PG.sayText(w).replace(/^to\s+/i, '').trim();
  EN.dict = {
    // Назви колонок у файлах імпорту, за якими впізнається колонка з англійським словом
    headers: ['english', 'en', 'англійською', 'англійська', 'англ', 'english word'],
    csvHeader: 'english',
    // Дієслово «to book» зараховується й без «to»
    answerForms: (x) => (/^to\s/i.test(x) ? [x.replace(/^to\s+/i, '')] : []),
    links: (w) => [
      ['📖 Cambridge', 'https://dictionary.cambridge.org/dictionary/english/' + encodeURIComponent(bare(w).toLowerCase().replace(/\s+/g, '-')), 'Значення, вимова й приклади'],
      ['▶ YouGlish', 'https://youglish.com/pronounce/' + encodeURIComponent(bare(w)) + '/english/' + (PG.variant() === 'gb' ? 'uk' : 'us'), 'Слово у відео з реальними людьми']
    ],
    lookupNote: 'сервіс dictionaryapi.dev отримує лише англійське слово',
    // Транскрипція й записи живих людей з dictionaryapi.dev (дані Wiktionary). Відповіді кешуються на час сесії,
    // бо в сервісу обмеження на кількість запитів, а учень часто натискає те саме слово кілька разів
    cache: new Map(),
    async lookup(word) {
      const q = bare(word).toLowerCase();
      if (!q || q.length > 60) return null;
      if (this.cache.has(q)) return this.cache.get(q);
      const once = async () => {
        const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
        const timer = setTimeout(() => ctrl && ctrl.abort(), 8000);
        try {
          const r = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(q), { signal: ctrl && ctrl.signal, referrerPolicy: 'no-referrer' });
          if (r.ok) return this.parseLookup(await r.json());
          if (r.status === 404) return null;
          throw new Error('HTTP ' + r.status);
        } finally { clearTimeout(timer); }
      };
      let res;
      try { res = await once(); } catch (e) {
        // Перший запит до сервісу інколи падає з «Failed to fetch» (холодне з'єднання), а повтор за мить проходить
        await new Promise((ok) => setTimeout(ok, 1200));
        try { res = await once(); } catch (e2) {
          console.warn('Словниковий сервіс недоступний', e2);
          return undefined;   // undefined — сервіс не відповів (не кешуємо); null — слова в базі немає
        }
      }
      this.cache.set(q, res);
      return res;
    },
    parseLookup(data) {
      if (!Array.isArray(data)) return null;
      const au = {}, texts = { us: '', gb: '', au: '' };
      let any = '';
      for (const entry of data) {
        if (!any && entry && typeof entry.phonetic === 'string') any = entry.phonetic;
        for (const p of (entry && entry.phonetics) || []) {
          let url = typeof p.audio === 'string' ? p.audio.trim() : '';
          if (url.startsWith('//')) url = 'https:' + url;
          const acc = /-us\.mp3$|_us_/i.test(url) ? 'us' : /-uk\.mp3$|_gb_/i.test(url) ? 'gb' : /-au\.mp3$/i.test(url) ? 'au' : null;
          if (acc && !au[acc]) au[acc] = url;
          if (p.text) { if (!any) any = p.text; if (acc && !texts[acc]) texts[acc] = p.text; }
        }
      }
      const want = PG.variant() || 'us';
      let ipa = texts[want] || texts.us || texts.gb || any || '';
      if (ipa && !/^[/[]/.test(ipa)) ipa = '/' + ipa + '/';
      const clean = PG.cleanWord({ word: 'x', uk: 'x', ipa, au });
      return { ipa: clean.ipa || '', au: clean.au || null };
    }
  };
})(PG.pack('en'));
