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
