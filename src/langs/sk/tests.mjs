// Мовні еталони словацької для validate.mjs: числа, ціни, перевірка діакритики. У браузер цей файл не потрапляє.
export default function ({ PG, L, err }) {
  const W = L.gen.words, E = L.gen.euros;
  [[0, 'nula'], [2, 'dva'], [19, 'devätnásť'], [25, 'dvadsaťpäť'], [40, 'štyridsať'], [58, 'päťdesiatosem'], [99, 'deväťdesiatdeväť'],
    [100, 'sto'], [134, 'stotridsaťštyri'], [200, 'dvesto'], [1990, 'tisícdeväťstodeväťdesiat'], [2026, 'dvetisícdvadsaťšesť']]
    .forEach(([n, s]) => { if (W(n) !== s) err('gen.words(' + n + ') = ' + W(n) + ', очікувалось ' + s); });
  [[1, 'jedno euro'], [3, 'tri eurá'], [5, 'päť eur'], [22, 'dvadsaťdva eur']].forEach(([n, s]) => { if (E(n) !== s) err('gen.euros(' + n + ') = ' + E(n)); });
  for (const name of Object.keys(L.gen.list)) for (let k = 0; k < 100; k++) {
    const it = L.gen.make({ g: name, min: 0, max: 2100 });
    if (it.t === 'l' && !/^[a-záäčďéíĺľňóôŕšťúýž ]+$/.test(it.say)) { err('генератор ' + name + ': дивний текст для озвучення «' + it.say + '»'); break; }
  }

  // Без діакритики — «майже», з нею — правильно; регістр і розділові знаки не важливі
  [['Dobrý deň!', 'dobrý deň', 'ok'], ['dobry den', 'Dobrý deň', 'near'], ['ďakujem', 'Ďakujem.', 'ok'], ['dakujem', 'Ďakujem', 'near'], ['prosím', 'nie', 'bad']]
    .forEach(([a, b, want]) => { const got = PG.check(a, b); if (got !== want) err('check(«' + a + '», «' + b + '») = ' + got + ', очікувалось ' + want); });
  if (PG.variants().length || PG.v('{{a|b}}') !== '{{a|b}}') err('у словацької немає варіантів, текст не має змінюватися');
}
