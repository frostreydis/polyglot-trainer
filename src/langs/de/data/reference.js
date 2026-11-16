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
