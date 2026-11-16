// Мовні еталони німецької для validate.mjs: числа й роки словами, розмовний час, дати і перевірка відповідей
// (умлаути, ß, велика літера). У браузер цей файл не потрапляє.
export default function ({ PG, L, err }) {
  const W = L.gen.words;
  [[0, 'null'], [1, 'eins'], [7, 'sieben'], [16, 'sechzehn'], [17, 'siebzehn'], [21, 'einundzwanzig'], [30, 'dreißig'], [60, 'sechzig'], [77, 'siebenundsiebzig'],
    [100, 'einhundert'], [101, 'einhunderteins'], [111, 'einhundertelf'], [345, 'dreihundertfünfundvierzig'], [1000, 'eintausend'],
    [2026, 'zweitausendsechsundzwanzig'], [9999, 'neuntausendneunhundertneunundneunzig']]
    .forEach(([n, s]) => { if (W(n) !== s) err('gen.words(' + n + ') = ' + W(n) + ', очікувалось ' + s); });
  if (!L.gen.allWords(100).includes('hundert') || !L.gen.allWords(1500).includes('tausendfünfhundert')) err('gen.allWords: hundert / tausend без «ein»');
  [[1999, 'neunzehnhundertneunundneunzig'], [1900, 'neunzehnhundert'], [1989, 'neunzehnhundertneunundachtzig'], [2000, 'zweitausend'], [2026, 'zweitausendsechsundzwanzig']]
    .forEach(([y, s]) => { if (L.gen.year(y) !== s) err('gen.year(' + y + ') = ' + L.gen.year(y)); });
  [[2, 30, 'halb drei'], [3, 15, 'Viertel nach drei'], [3, 45, 'Viertel vor vier'], [12, 30, 'halb eins'], [12, 45, 'Viertel vor eins'], [1, 15, 'Viertel nach eins'],
    [1, 0, 'ein Uhr'], [6, 25, 'fünf vor halb sieben'], [8, 50, 'zehn vor neun']]
    .forEach(([h, m, s]) => { if (L.gen.clock(h, m) !== s) err('gen.clock(' + h + ':' + m + ') = ' + L.gen.clock(h, m) + ', очікувалось ' + s); });
  [[1, 'erst'], [3, 'dritt'], [7, 'siebt'], [8, 'acht'], [16, 'sechzehnt'], [20, 'zwanzigst'], [21, 'einundzwanzigst'], [31, 'einunddreißigst']]
    .forEach(([d, s]) => { if (L.gen.ordStem(d) !== s) err('gen.ordStem(' + d + ') = ' + L.gen.ordStem(d)); });
  for (const name of Object.keys(L.gen.list)) for (let k = 0; k < 100; k++) {
    const it = L.gen.make({ g: name, min: 0, max: 2100 });
    if (it.t === 'l' && !/^[a-zäöüß ]+$/i.test(it.say)) { err('генератор ' + name + ': дивний текст для озвучення «' + it.say + '»'); break; }
  }

  // Розділові знаки й регістр першої літери не важливі; ae / ss / без умлаута — «майже»; мала літера в іменнику чи в Sie — «майже»
  [['Ich heiße Anna', 'Ich heiße Anna.', 'ok'], ['ich heiße Anna', 'Ich heiße Anna.', 'ok'], ['Maedchen', 'Mädchen', 'near'], ['Madchen', 'Mädchen', 'near'],
    ['Strasse', 'Straße', 'near'], ['Das ist mein haus', 'Das ist mein Haus.', 'near'], ['Wie heißen sie?', 'Wie heißen Sie?', 'near'], ['Feuer', 'Feuer', 'ok'],
    ['Entschuldigung', 'Entschuldigung!', 'ok'], ['Entschuldigng', 'Entschuldigung', 'near'], ['danke', 'bitte', 'bad'], ['der Tisch', 'die Tisch', 'bad']]
    .forEach(([a, b, want]) => { const got = PG.check(a, b); if (got !== want) err('check(«' + a + '», «' + b + '») = ' + got + ', очікувалось ' + want); });
  if (PG.variants().length || PG.v('{{a|b}}') !== '{{a|b}}') err('у німецької немає варіантів, текст не має змінюватися');
}
