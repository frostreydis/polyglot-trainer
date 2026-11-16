// Мовні еталони англійської для validate.mjs: числа словами, перевірка відповідей, правопис US / UK,
// словниковий сервіс. У браузер цей файл не потрапляє.
export default function ({ PG, L, err }) {
  const g = L.gen;
  [[0, 'zero'], [13, 'thirteen'], [21, 'twenty-one'], [40, 'forty'], [99, 'ninety-nine'], [100, 'one hundred'], [105, 'one hundred and five'],
    [134, 'one hundred and thirty-four'], [1000, 'one thousand'], [2026, 'two thousand and twenty-six'], [15000, 'fifteen thousand'],
    [250300, 'two hundred and fifty thousand three hundred'], [1000000, 'one million']]
    .forEach(([n, s]) => { if (g.words(n) !== s) err('gen.words(' + n + ') = ' + g.words(n) + ', очікувалось ' + s); });
  if (g.words(134, false) !== 'one hundred thirty-four') err('gen.words(134, false) = ' + g.words(134, false));
  [[1, 'first'], [2, 'second'], [3, 'third'], [5, 'fifth'], [8, 'eighth'], [9, 'ninth'], [12, 'twelfth'], [20, 'twentieth'], [21, 'twenty-first'], [30, 'thirtieth'], [31, 'thirty-first']]
    .forEach(([n, s]) => { if (g.ordinal(n) !== s) err('gen.ordinal(' + n + ') = ' + g.ordinal(n)); });
  [[1990, 'nineteen ninety'], [1905, 'nineteen oh five'], [1900, 'nineteen hundred'], [2000, 'two thousand'], [2006, 'two thousand and six'], [2026, 'twenty twenty-six']]
    .forEach(([n, s]) => { if (g.yearWords(n) !== s) err('gen.yearWords(' + n + ') = ' + g.yearWords(n)); });
  if (!g.timeVariants(3, 15).includes('quarter past three') || !g.timeVariants(5, 40).includes('twenty to six') || !g.timeVariants(7, 5).includes('seven oh five'))
    err('gen.timeVariants: немає очікуваних форм');
  for (const name of Object.keys(g.list)) for (let k = 0; k < 100; k++) {
    const it = g.make({ g: name });
    if (it.t === 'l' && !/^[a-z ,'-]+$/i.test(it.say)) { err('генератор ' + name + ': дивний текст для озвучення «' + it.say + '»'); break; }
  }

  // Скорочення, британський правопис, описки
  [['I\'m from Ukraine', 'I am from Ukraine', 'ok'], ['He doesn\'t work', 'He does not work', 'ok'], ['She\'s got a car', 'She has got a car', 'ok'],
    ['It\'s cold', 'It is cold', 'ok'], ['colour', 'color', 'ok'], ['organise', 'organize', 'ok'], ['travelling', 'traveling', 'ok'],
    ['beatiful', 'beautiful', 'near'], ['work', 'works', 'bad'], ['studies', 'studied', 'bad'], ['four', 'for', 'bad'], ['I am', 'I\'m', 'bad', true],
    ['can not', 'can\'t', 'ok'], ['Let\'s go', 'Let us go', 'ok'], ['John\'s car', 'Johns car', 'ok']]
    .forEach(([a, b, want, exact]) => { const got = PG.check(a, b, exact); if (got !== want) err('check(«' + a + '», «' + b + '»' + (exact ? ', exact' : '') + ') = ' + got + ', очікувалось ' + want); });

  // Варіант англійської: правопис і розмітка {{US|UK}} без зачеплення навмисних порівнянь
  [['<p>I realised my favourite colour is grey.</p>', 'us', '<p>I realized my favorite color is gray.</p>'],
    ['<p>I realized my favorite color is gray. Mom.</p>', 'gb', '<p>I realised my favourite colour is grey. Mum.</p>'],
    ['<tr><td>colour</td><td>color</td></tr>', 'us', '<tr><td>colour</td><td>color</td></tr>'],
    ['[[at the weekend]] (UK)', 'us', '[[at the weekend]] (UK)'], ['UK [[mum]]', 'us', 'UK [[mum]]'],
    ['[[We travelled at the weekend.]]', 'us', '[[We traveled on the weekend.]]'],
    ['honorary humorous laboratory minimum four', 'gb', 'honorary humorous laboratory minimum four'],
    ['I practice. The program. I learned it.', 'gb', 'I practice. The program. I learned it.'],
    ['{{[[apartment]]|[[flat]]}}', 'gb', '[[flat]]'], ['{{[[read|red]]|[[read|rid]]}}', 'us', '[[read|red]]'],
    ['<span class="nv">colour</span> colour', 'us', '<span class="nv">colour</span> color']]
    .forEach(([s, v, want]) => { const got = PG.v(s, v); if (got !== want) err('PG.v(«' + s + '», ' + v + ') = «' + got + '», очікувалось «' + want + '»'); });
  const vw = PG.vWord(['flat / apartment', 'квартира', '{{/ˈæp/|/əˈpɑː/}}', { us: 'apartment', gb: 'flat' }], 'gb');
  if (vw.mine !== 'flat' || vw.other !== 'apartment' || !/UK|US/.test(vw.note)) err('PG.vWord: ' + JSON.stringify(vw));

  // Словниковий сервіс: транскрипція під варіант учня і записи носіїв лише з дозволених адрес
  const lk = L.dict.parseLookup([{ phonetic: '/ˈskedʒuːl/', phonetics: [{ text: '/ˈʃɛdjuːl/', audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/schedule-uk.mp3' }, { text: '/ˈskɛdʒul/', audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/schedule-us.mp3' }] }]);
  if (!lk || !lk.au || !lk.au.us || !lk.au.gb || lk.ipa !== '/ˈskɛdʒul/') err('розбір відповіді словникового сервісу: ' + JSON.stringify(lk));
  const ans = PG.Dict.answers('to book (a table) / to reserve');
  if (!['book', 'to book', 'reserve', 'to reserve'].every((x) => PG.check(x, ans) === 'ok')) err('варіанти відповідей словника: ' + ans.join(' | '));
}
