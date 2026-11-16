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
