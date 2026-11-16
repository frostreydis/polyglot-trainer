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
