/* A1, частина 1: уроки A1.1–A1.6 */
(function (DE) {
DE.lessons = DE.lessons || [];
DE.lessons.push(
{
  id: 'a1-1', stage: 'a1', num: 'A1.1', title: 'Ich bin… — дієслово sein і знайомство', dur: '1 тиждень',
  goals: ['відмінювати sein і знати особові займенники', 'розповісти, хто ви, звідки й де живете', 'запитати про це співрозмовника на «ти» і на «Ви»'],
  theory: `
<h3>Особові займенники</h3>
<p>[[ich]] — я, [[du]] — ти, [[er]] — він, [[sie]] — вона, [[es]] — воно, [[wir]] — ми, [[ihr]] — ви (кілька людей на «ти»), [[sie]] — вони, [[Sie]] — Ви (ввічливо).</p>
<div class="note"><b>Займенник не пропускають.</b> Українською можна сказати «Живу в Берліні», німецькою — тільки [[Ich wohne in Berlin.]] Навіть погода має підмет: [[Es regnet.]] — Іде дощ.</div>
<h3>sein — бути</h3>
<div class="tblwrap"><table><tr><th>однина</th><th></th><th>множина</th><th></th></tr>
<tr><td>ich</td><td>[[bin]]</td><td>wir</td><td>[[sind]]</td></tr>
<tr><td>du</td><td>[[bist]]</td><td>ihr</td><td>[[seid]]</td></tr>
<tr><td>er / sie / es</td><td>[[ist]]</td><td>sie / Sie</td><td>[[sind]]</td></tr></table></div>
<div class="note"><b>В українській «є» зазвичай випадає, у німецькій — ніколи.</b> «Я — студентка» = [[Ich bin Studentin.]] «Це Анна» = [[Das ist Anna.]] Перед професією й національністю артикля немає: [[Ich bin Lehrer.]], а не «ein Lehrer».</div>
<h3>Професії й національності: чоловік / жінка</h3>
<p>Жіночу форму зазвичай утворює <b>-in</b>: [[der Lehrer]] / [[die Lehrerin]], [[der Arzt]] / [[die Ärztin]], [[der Student]] / [[die Studentin]], [[der Verkäufer]] / [[die Verkäuferin]] — продавець / продавчиня.</p>
<p>[[Ich bin Ukrainer.]] / [[Ich bin Ukrainerin.]] [[Er ist Österreicher.]] / [[Sie ist Schweizerin.]] Особливе слово — німець: [[Er ist Deutscher.]] / [[Sie ist Deutsche.]]</p>
<h3>Звідки ви? Де живете?</h3>
<p>[[Woher kommen Sie?]] — [[Ich komme aus der Ukraine.]] [[Ich komme aus Lwiw.]] [[Wo wohnen Sie?]] — [[Ich wohne jetzt in Köln.]]</p>
<div class="note"><b>Країни з артиклем.</b> Більшість країн — без артикля: [[aus Deutschland]], [[in Österreich]]. Але Україна й Швейцарія мають артикль <b>die</b>: [[aus der Ukraine]], [[in der Ukraine]], [[aus der Schweiz]], [[in der Schweiz]]. Київ німецькою традиційно — Kiew, дедалі частіше пишуть і Kyjiw.</div>
<p>Мови: [[Ich spreche Ukrainisch, Englisch und ein bisschen Deutsch.]] — дієслово sprechen змінює корінь: [[du sprichst]], [[er spricht]].</p>
<h3>Заперечення й питання</h3>
<p>Найпростіше заперечення — [[nicht]]: [[Ich bin nicht müde.]] [[Wir sind nicht aus Polen.]]</p>
<p>Питання «так / ні»: дієслово стоїть <b>першим</b>: [[Sind Sie Frau Bauer?]] — [[Ja.]] / [[Nein, ich bin Frau Weber.]] Питання з питальним словом: [[Wer ist das?]] — Хто це? [[Woher kommst du?]] [[Wo wohnst du?]]</p>
<div class="tip">Щоб представити когось: [[Das ist mein Kollege, Herr Wagner.]] — Це мій колега, пан Ваґнер.</div>`,
  vocab: [['sein', 'бути', 'ich bin, du bist, er ist, wir sind, ihr seid, sie sind'], ['er / sie / es', 'він / вона / воно'], ['wir', 'ми'], ['ihr', 'ви (кілька людей, на «ти»)'],
    ['sie', 'вони', 'з великої — Sie: Ви'], ['kommen', 'приходити; бути родом (aus — з)'], ['woher?', 'звідки?'], ['aus', 'з (звідки)'], ['wohnen', 'жити, мешкати'], ['wo?', 'де?'],
    ['wer?', 'хто?'], ['die Ukraine', 'Україна', 'з артиклем: aus der Ukraine'], ['Deutschland', 'Німеччина'], ['Österreich', 'Австрія'], ['die Schweiz', 'Швейцарія', 'з артиклем: in der Schweiz'],
    ['der Ukrainer / die Ukrainerin', 'українець / українка'], ['der Deutsche / die Deutsche', 'німець / німкеня', 'але: ein Deutscher; Ich bin Deutscher.'],
    ['der Lehrer / die Lehrerin', 'вчитель / вчителька'], ['der Arzt / die Ärztin', 'лікар / лікарка', 'die Ärzte / die Ärztinnen'], ['der Student / die Studentin', 'студент / студентка'],
    ['sprechen', 'говорити', 'du sprichst, er spricht'], ['Deutsch', 'німецька мова'], ['Ukrainisch', 'українська мова'], ['ein bisschen', 'трохи'], ['nicht', 'не']],
  ex: [
    { t: 'i', q: 'sein: Ich ___ Olena.', a: 'bin' },
    { t: 'i', q: 'sein: Du ___ aus Kyjiw, oder?', a: 'bist' },
    { t: 'i', q: 'sein: Er ___ Arzt.', a: 'ist' },
    { t: 'i', q: 'sein: Wir ___ aus der Ukraine.', a: 'sind' },
    { t: 'i', q: 'sein: Ihr ___ heute müde.', a: 'seid' },
    { t: 'i', q: 'sein: Frau Weber, ___ Sie aus Wien?', a: 'sind' },
    { t: 'c', q: '«Я — вчителька»', o: ['Ich bin Lehrerin.', 'Ich Lehrerin.', 'Ich bin eine Lehrer.'], e: 'Дієслово sein обов\'язкове, а перед професією артикля немає.' },
    { t: 'c', q: '«Я з України»', o: ['Ich komme aus der Ukraine.', 'Ich komme aus Ukraine.', 'Ich komme von der Ukraine.'], e: 'die Ukraine — з артиклем: [[aus der Ukraine]].' },
    { t: 'c', q: 'Ввічливо: «Звідки ви?»', o: ['Woher kommen Sie?', 'Woher kommst du?', 'Wo kommen Sie?'] },
    { t: 'c', q: 'Жінка з Німеччини — це…', o: ['eine Deutsche', 'eine Deutscherin', 'ein Deutscher'] },
    { t: 'c', q: '«Ми живемо у Швейцарії»', o: ['Wir wohnen in der Schweiz.', 'Wir wohnen in Schweiz.', 'Wir sind wohnen in der Schweiz.'] },
    { t: 'o', q: 'Де ви живете?', a: 'Wo wohnen Sie?' },
    { t: 'o', q: 'Я трохи говорю німецькою.', a: 'Ich spreche ein bisschen Deutsch.' },
    { t: 'o', q: 'Анна тепер живе у Відні.', a: ['Anna wohnt jetzt in Wien.', 'Jetzt wohnt Anna in Wien.'] },
    { t: 'l', a: 'Woher kommen Sie?', tr: 'Звідки ви?' },
    { t: 'l', a: 'Ich komme aus der Ukraine, aus Lwiw.', tr: 'Я з України, зі Львова.' }
  ],
  say: [['Ich heiße Olena. Ich komme aus der Ukraine.', 'Мене звати Олена. Я з України.'], ['Ich wohne jetzt in München.', 'Тепер я живу в Мюнхені.'],
    ['Woher kommen Sie?', 'Звідки ви?'], ['Ich spreche Ukrainisch und ein bisschen Deutsch.', 'Я говорю українською і трохи німецькою.'],
    ['Das ist mein Kollege, Herr Wagner.', 'Це мій колега, пан Ваґнер.']],
  speak: ['Представтеся в 5–6 реченнях: ім\'я, звідки ви, де живете, ким працюєте чи працювали, якими мовами говорите.',
    'Дайте відповідь уголос: Wie heißen Sie? Woher kommen Sie? Wo wohnen Sie? Sprechen Sie Englisch?'],
  mission: 'Представтеся німецькою новій людині — сусідові, одногрупникові на курсі, колезі: «Hallo, ich bin …, ich komme aus der Ukraine und wohne jetzt in …»'
},
{
  id: 'a1-2', stage: 'a1', num: 'A1.2', title: 'der, die, das — рід і артиклі', dur: '1 тиждень',
  goals: ['вчити іменник разом з артиклем', 'вживати der / die / das і ein / eine', 'вгадувати рід за закінченням і замінювати іменник на er / sie / es'],
  theory: `
<p>Родів три, як в українській: чоловічий (<b>der</b>), жіночий (<b>die</b>), середній (<b>das</b>). Але рід німецького слова часто <b>не збігається</b> з українським:</p>
<div class="tblwrap"><table><tr><th>Німецькою</th><th>Українською</th></tr>
<tr><td>[[die Sonne]] — ж. р.</td><td>сонце — с. р.</td></tr>
<tr><td>[[das Mädchen]] — с. р.</td><td>дівчина — ж. р.</td></tr>
<tr><td>[[der Löffel]] — ч. р.</td><td>ложка — ж. р.</td></tr>
<tr><td>[[das Messer]] — с. р.</td><td>ніж — ч. р.</td></tr>
<tr><td>[[der Schrank]] — ч. р.</td><td>шафа — ж. р.</td></tr>
<tr><td>[[die Milch]] — ж. р.</td><td>молоко — с. р.</td></tr>
<tr><td>[[die Tür]] — однина, ж. р.</td><td>двері — лише множина</td></tr>
</table></div>
<p>Буває і збіг: [[der Tisch]] — стіл, [[die Lampe]] — лампа, [[das Fenster]] — вікно, [[der Mond]] — місяць. Але покладатися на українську не можна.</p>
<div class="note"><b>Правило №1: іменник — тільки з артиклем.</b> Вчіть не «Tisch», а [[der Tisch]], не «Lampe», а [[die Lampe]]. Допомагають кольори: der — синім, die — червоним, das — зеленим.</div>
<h3>Означений і неозначений артикль</h3>
<div class="tblwrap"><table><tr><th></th><th>ч. р.</th><th>ж. р.</th><th>с. р.</th><th>множина</th></tr>
<tr><td>означений (той самий, відомий)</td><td>[[der Tisch]]</td><td>[[die Lampe]]</td><td>[[das Bett]]</td><td>[[die Tische]]</td></tr>
<tr><td>неозначений (якийсь, один)</td><td>[[ein Tisch]]</td><td>[[eine Lampe]]</td><td>[[ein Bett]]</td><td>[[Tische]] (без артикля)</td></tr>
</table></div>
<p>Уперше згадуємо — <b>ein / eine</b>, далі — <b>der / die / das</b>: [[Das ist ein Stuhl. Der Stuhl ist neu.]] У множині означений артикль завжди [[die]].</p>
<div class="good">В українській артиклів немає, тож це нова звичка. Зате відмінки вам знайомі — і саме артикль у німецькій показуватиме відмінок (уроки A1.5 і A1.10).</div>
<h3>Підказки за закінченням</h3>
<div class="tblwrap"><table><tr><th>Рід</th><th>Закінчення чи група</th><th>Приклади</th></tr>
<tr><td><b>die</b></td><td>-ung, -heit, -keit, -schaft, -ion, -tät, -ie; більшість слів на -e</td><td>[[die Wohnung]], [[die Freiheit]], [[die Information]], [[die Universität]], [[die Küche]]</td></tr>
<tr><td><b>das</b></td><td>-chen, -lein (зменшувальні), здебільшого -ment, -um</td><td>[[das Mädchen]], [[das Brötchen]], [[das Dokument]], [[das Zentrum]]</td></tr>
<tr><td><b>der</b></td><td>дні тижня, місяці, пори року; -ismus, -ling; особи на -er</td><td>[[der Montag]], [[der Mai]], [[der Sommer]], [[der Lehrer]]</td></tr>
</table></div>
<p class="small muted">Винятки є: [[der Name]], [[der Käse]] закінчуються на -e, але чоловічого роду.</p>
<p><b>Складне слово</b> має рід останньої частини: [[der Kühlschrank]] (der Schrank), [[das Schlafzimmer]] (das Zimmer), [[die Haustür]] (die Tür).</p>
<h3>er, sie, es замість іменника</h3>
<p>Займенник вибирають за <b>граматичним родом</b>: [[Der Tisch ist neu. Er ist schön.]] [[Wo ist die Lampe? — Sie ist hier.]] [[Das Messer? Es ist in der Küche.]] Тобто про двері кажуть «вона»: [[Die Tür ist offen. Sie ist offen.]]</p>`,
  vocab: [['der Tisch', 'стіл', 'die Tische'], ['der Stuhl', 'стілець', 'die Stühle'], ['der Schrank', 'шафа', 'die Schränke; чоловічий рід!'], ['der Kühlschrank', 'холодильник', 'die Kühlschränke'],
    ['der Löffel', 'ложка', 'die Löffel; чоловічий рід!'], ['die Gabel', 'виделка', 'die Gabeln'], ['das Messer', 'ніж', 'die Messer; середній рід!'], ['die Lampe', 'лампа', 'die Lampen'],
    ['das Bett', 'ліжко', 'die Betten'], ['das Fenster', 'вікно', 'die Fenster'], ['die Wohnung', 'квартира', 'die Wohnungen'], ['das Zimmer', 'кімната', 'die Zimmer'],
    ['das Schlafzimmer', 'спальня', 'die Schlafzimmer'], ['die Küche', 'кухня', 'die Küchen'], ['das Bad', 'ванна кімната; купання', 'die Bäder; англ. bad = schlecht'],
    ['der Mond', 'місяць (на небі)', 'die Monde'], ['das Auto', 'автомобіль', 'die Autos'], ['die Tasche', 'сумка', 'die Taschen'], ['das Handy', 'мобільний телефон', 'die Handys'],
    ['der Schlüssel', 'ключ', 'die Schlüssel'], ['die Brille', 'окуляри', 'однина! die Brillen — кілька пар'], ['das Bild', 'картина; фото', 'die Bilder']],
  ex: [
    { t: 'c', q: 'Який рід у слова «Mädchen»?', o: ['das (середній)', 'die (жіночий)', 'der (чоловічий)'], e: 'Усі слова на -chen — das.' },
    { t: 'c', q: '«Löffel» (ложка): який артикль?', o: ['der', 'die', 'das'] },
    { t: 'c', q: '«Messer» (ніж): який артикль?', o: ['das', 'der', 'die'] },
    { t: 'c', q: '«Wohnung»: який артикль?', o: ['die', 'der', 'das'], e: 'Слова на -ung — завжди die.' },
    { t: 'c', q: '«Schlafzimmer»: який артикль?', o: ['das', 'der', 'die'], e: 'Рід складного слова — за останньою частиною: [[das Zimmer]].' },
    { t: 'i', q: '___ Lampe (der / die / das)', a: 'die' },
    { t: 'i', q: '___ Tisch (der / die / das)', a: 'der' },
    { t: 'i', q: '___ Bett (der / die / das)', a: 'das' },
    { t: 'i', q: 'Неозначений артикль: Das ist ___ Tasche.', a: 'eine' },
    { t: 'i', q: 'Неозначений артикль: Das ist ___ Schlüssel.', a: 'ein' },
    { t: 'i', q: 'Займенник: Wo ist der Schlüssel? — ___ ist hier.', a: 'er' },
    { t: 'i', q: 'Займенник: Die Tür ist offen. — Ja, ___ ist offen.', a: 'sie' },
    { t: 'i', q: 'Напишіть з артиклем: <b>кухня</b>', a: 'die Küche' },
    { t: 'c', q: 'Множина від «das Fenster» з артиклем:', o: ['die Fenster', 'das Fenster', 'die Fensters'] },
    { t: 'o', q: 'Це стілець. Стілець новий.', a: 'Das ist ein Stuhl. Der Stuhl ist neu.' },
    { t: 'l', a: 'Der Kühlschrank ist in der Küche.', tr: 'Холодильник стоїть на кухні.' },
    { t: 'l', a: 'Die Wohnung hat ein Bad und zwei Zimmer.', tr: 'У квартирі є ванна і дві кімнати.' }
  ],
  say: [['der Tisch, die Lampe, das Bett', 'стіл, лампа, ліжко'], ['Das ist ein Stuhl. Der Stuhl ist neu.', 'Це стілець. Стілець новий.'],
    ['Wo ist der Schlüssel? — Er ist hier.', 'Де ключ? — Він тут.'], ['die Sonne und der Mond', 'сонце і місяць'], ['Das Mädchen ist hier.', 'Дівчинка тут.']],
  speak: ['Пройдіться квартирою і назвіть уголос 15 речей з артиклем: der Tisch, die Lampe, das Fenster… Якщо не знаєте слова, знайдіть його в словнику — з артиклем.',
    'Опишіть свою кімнату: «Das ist mein Zimmer. Hier ist ein Bett, da ist ein Schrank…»'],
  mission: 'Наклейте на 10 речей у квартирі папірці з назвою та артиклем (der Kühlschrank, die Tür, das Fenster) — трьома кольорами для der, die, das. Тиждень читайте їх уголос, коли проходите повз.'
},
{
  id: 'a1-3', stage: 'a1', num: 'A1.3', title: 'Дієслова в теперішньому часі, порядок слів і питання', dur: '1 тиждень',
  goals: ['відмінювати правильні дієслова й ті, що змінюють корінь (fahren → er fährt)', 'ставити дієслово на друге місце', 'ставити W-питання і питання «так / ні»'],
  theory: `
<h3>Закінчення дієслів</h3>
<div class="tblwrap"><table><tr><th></th><th>wohnen</th><th>arbeiten</th><th>heißen</th></tr>
<tr><td>ich</td><td>[[wohne]]</td><td>[[arbeite]]</td><td>[[heiße]]</td></tr>
<tr><td>du</td><td>[[wohnst]]</td><td>[[arbeitest]]</td><td>[[heißt]]</td></tr>
<tr><td>er / sie / es</td><td>[[wohnt]]</td><td>[[arbeitet]]</td><td>[[heißt]]</td></tr>
<tr><td>wir</td><td>[[wohnen]]</td><td>[[arbeiten]]</td><td>[[heißen]]</td></tr>
<tr><td>ihr</td><td>[[wohnt]]</td><td>[[arbeitet]]</td><td>[[heißt]]</td></tr>
<tr><td>sie / Sie</td><td>[[wohnen]]</td><td>[[arbeiten]]</td><td>[[heißen]]</td></tr></table></div>
<p class="small muted">Після t і d додають -e-, щоб легше вимовити: du arbeitest, er arbeitet. Після s, ß, z у формі du лише -t: du heißt, du tanzt.</p>
<h3>Дієслова, що змінюють корінь (лише du і er / sie / es)</h3>
<div class="tblwrap"><table><tr><th>Зміна</th><th>Приклади</th></tr>
<tr><td>a → ä</td><td>[[fahren]] — [[du fährst]], [[er fährt]]; [[schlafen]] — [[er schläft]]</td></tr>
<tr><td>e → i</td><td>[[sprechen]] — [[er spricht]]; [[essen]] — [[er isst]]; [[helfen]] — [[er hilft]]; [[nehmen]] — [[du nimmst]], [[er nimmt]]</td></tr>
<tr><td>e → ie</td><td>[[lesen]] — [[er liest]]; [[sehen]] — [[er sieht]]</td></tr>
</table></div>
<h3>Дієслово — на другому місці</h3>
<p>У розповідному реченні дієслово стоїть <b>другим</b>. На першому місці може бути що завгодно — тоді підмет переходить <b>за</b> дієслово:</p>
<div class="tblwrap"><table><tr><th>1</th><th>2 — дієслово</th><th>далі</th></tr>
<tr><td>Ich</td><td><b>arbeite</b></td><td>heute in Berlin.</td></tr>
<tr><td>Heute</td><td><b>arbeite</b></td><td>ich in Berlin.</td></tr>
<tr><td>In Berlin</td><td><b>arbeite</b></td><td>ich heute.</td></tr></table></div>
<p>[[Ich arbeite heute in Berlin.]] [[Heute arbeite ich in Berlin.]] [[In Berlin arbeite ich heute.]]</p>
<div class="note"><b>В українській порядок слів вільний, у німецькій — ні.</b> «Сьогодні я працюю» — тільки [[Heute arbeite ich.]], а «Heute ich arbeite» — помилка.</div>
<h3>Питання</h3>
<p><b>W-питання:</b> питальне слово, потім дієслово: [[Was machst du?]] [[Wo arbeiten Sie?]] [[Wann kommt der Bus?]] [[Warum lernst du Deutsch?]] [[Wie lange lernst du Deutsch?]]</p>
<div class="tblwrap"><table><tr><td>[[wer]] — хто</td><td>[[was]] — що</td><td>[[wo]] — де</td><td>[[woher]] — звідки</td><td>[[wohin]] — куди</td></tr>
<tr><td>[[wann]] — коли</td><td>[[wie]] — як</td><td>[[warum]] — чому</td><td>[[wie viel]] — скільки</td><td>[[wie lange]] — як довго</td></tr></table></div>
<p><b>Питання «так / ні»:</b> дієслово — на <b>першому</b> місці: [[Arbeitest du heute?]] — [[Ja, ich arbeite heute.]] / [[Nein, heute nicht.]] [[Wohnen Sie in Wien?]]</p>
<div class="note">Українською питання можна поставити самою інтонацією: «Ти сьогодні працюєш?». Німецькою потрібен порядок слів: дієслово першим.</div>
<div class="tip"><b>doch</b> — «так» у відповідь на заперечне питання: [[Arbeitest du heute nicht?]] — [[Doch!]] (= ні, працюю!).</div>
<h3>Теперішній час — і для майбутнього</h3>
<p>[[Morgen fahre ich nach Hamburg.]] — Завтра я їду до Гамбурга. Окремої форми «я зараз читаю» немає: [[Ich lese.]] — і «читаю», і «зараз читаю».</p>`,
  vocab: [['machen', 'робити'], ['arbeiten', 'працювати', 'du arbeitest, er arbeitet'], ['lernen', 'вчити, вчитися'], ['spielen', 'грати'], ['kochen', 'готувати (їжу)'],
    ['kaufen', 'купувати'], ['trinken', 'пити'], ['fahren', 'їхати (транспортом)', 'du fährst, er fährt'], ['schlafen', 'спати', 'du schläfst, er schläft'],
    ['lesen', 'читати', 'du liest, er liest'], ['sehen', 'бачити', 'du siehst, er sieht'], ['nehmen', 'брати', 'du nimmst, er nimmt'], ['helfen', 'допомагати', 'du hilfst, er hilft'],
    ['verstehen', 'розуміти'], ['was?', 'що?'], ['wann?', 'коли?'], ['wie?', 'як?'], ['warum?', 'чому?'], ['wohin?', 'куди?'], ['morgen', 'завтра', 'der Morgen — ранок'],
    ['jetzt', 'зараз, тепер'], ['oft', 'часто'], ['doch', 'так (у відповідь на заперечне питання); ж, адже']],
  ex: [
    { t: 'i', q: 'wohnen → du ___', a: 'wohnst' },
    { t: 'i', q: 'arbeiten → er ___', a: 'arbeitet' },
    { t: 'i', q: 'heißen → du ___', a: 'heißt' },
    { t: 'i', q: 'fahren → er ___', a: 'fährt' },
    { t: 'i', q: 'lesen → sie (вона) ___', a: 'liest' },
    { t: 'i', q: 'nehmen → du ___', a: 'nimmst' },
    { t: 'i', q: 'schlafen → das Kind ___', a: 'schläft' },
    { t: 'c', q: 'Яке речення правильне?', o: ['Heute arbeite ich nicht.', 'Heute ich arbeite nicht.', 'Heute ich nicht arbeite.'] },
    { t: 'c', q: '«Ти сьогодні працюєш?»', o: ['Arbeitest du heute?', 'Du heute arbeitest?', 'Arbeitest heute du?'] },
    { t: 'c', q: '«Arbeitest du heute nicht?» — «Та ні, працюю!»', o: ['Doch!', 'Ja!', 'Nein!'], e: 'На заперечне питання «так» — це [[Doch!]]' },
    { t: 'c', q: '«коли?» німецькою —', o: ['wann', 'wo', 'wie'] },
    { t: 'c', q: '«Чому ти вчиш німецьку?»', o: ['Warum lernst du Deutsch?', 'Warum du lernst Deutsch?', 'Wo lernst du Deutsch?'] },
    { t: 'o', q: 'Що ти робиш?', a: 'Was machst du?' },
    { t: 'o', q: 'Анна сьогодні готує.', a: ['Anna kocht heute.', 'Heute kocht Anna.'] },
    { t: 'o', q: 'Завтра Тарас їде до Відня.', a: ['Taras fährt morgen nach Wien.', 'Morgen fährt Taras nach Wien.', 'Nach Wien fährt Taras morgen.'] },
    { t: 'o', q: 'Ви це розумієте? (ввічливо)', a: 'Verstehen Sie das?' },
    { t: 'l', a: 'Wann kommt der Bus?', tr: 'Коли приїде автобус?' },
    { t: 'l', a: 'Er liest jeden Tag die Zeitung.', tr: 'Він щодня читає газету.' }
  ],
  say: [['Was machst du heute?', 'Що ти робиш сьогодні?'], ['Heute arbeite ich nicht.', 'Сьогодні я не працюю.'], ['Wo arbeiten Sie?', 'Де ви працюєте?'],
    ['Arbeitest du heute nicht? — Doch!', 'Ти сьогодні не працюєш? — Та ні, працюю!'], ['Er fährt morgen nach Hamburg.', 'Він завтра їде до Гамбурга.'],
    ['Ich verstehe das nicht.', 'Я цього не розумію.']],
  speak: ['Розкажіть про свій звичайний день у 6–8 реченнях і щоразу починайте з іншого слова: «Heute arbeite ich… Am Abend koche ich… Dann lese ich…» — дієслово завжди друге.',
    'Поставте співрозмовникові (або собі) 5 W-питань і 3 питання «так / ні»: Wo wohnst du? Arbeitest du? Lernst du Deutsch?'],
  mission: 'Поставте сьогодні справжнє питання німецькою: у транспорті («Fährt dieser Bus zum Bahnhof?»), у магазині («Wo finde ich Milch?») чи колезі («Was machst du am Wochenende?»).'
},
{
  id: 'a1-4', stage: 'a1', num: 'A1.4', title: 'haben, множина, сім\'я; mein, dein, sein, ihr', dur: '1 тиждень',
  goals: ['відмінювати haben', 'утворювати множину іменників', 'розповісти про сім\'ю з mein / dein / sein / ihr'],
  theory: `
<h3>haben — мати</h3>
<div class="tblwrap"><table><tr><td>ich</td><td>[[habe]]</td><td>wir</td><td>[[haben]]</td></tr>
<tr><td>du</td><td>[[hast]]</td><td>ihr</td><td>[[habt]]</td></tr>
<tr><td>er / sie / es</td><td>[[hat]]</td><td>sie / Sie</td><td>[[haben]]</td></tr></table></div>
<p>[[Ich habe Zeit.]] [[Hast du Kinder?]] [[Sie hat ein Auto.]] Іменник чоловічого роду після haben отримує <b>einen</b>: [[Ich habe einen Sohn.]] — чому так, пояснює урок A1.5.</p>
<div class="note"><b>Не «у мене є», а «я маю»:</b> [[Ich habe ein Auto.]] Голод і спрагу теж «мають»: [[Ich habe Hunger.]] — я голодний, [[Ich habe Durst.]] — я хочу пити. А <b>вік — через sein</b>: [[Ich bin 35 Jahre alt.]], а не «Ich habe 35 Jahre».</div>
<h3>Множина</h3>
<p>Множину треба вчити разом зі словом: у словнику вона виглядає так — <i>der Tag, -e</i>; <i>das Buch, ¨-er</i>. Артикль множини — завжди <b>die</b>.</p>
<div class="tblwrap"><table><tr><th>Тип</th><th>Приклади</th></tr>
<tr><td><b>-e</b> (часто з умлаутом)</td><td>[[der Tag]] → [[die Tage]], [[der Stuhl]] → [[die Stühle]]</td></tr>
<tr><td><b>-(e)n</b> (більшість жіночого роду)</td><td>[[die Frau]] → [[die Frauen]], [[die Lampe]] → [[die Lampen]], [[die Wohnung]] → [[die Wohnungen]]</td></tr>
<tr><td><b>-er</b> (з умлаутом, де можна)</td><td>[[das Kind]] → [[die Kinder]], [[das Haus]] → [[die Häuser]], [[das Buch]] → [[die Bücher]]</td></tr>
<tr><td><b>без закінчення</b> (часто -er, -el, -en, -chen)</td><td>[[der Lehrer]] → [[die Lehrer]], [[das Mädchen]] → [[die Mädchen]], [[die Mutter]] → [[die Mütter]], [[der Bruder]] → [[die Brüder]]</td></tr>
<tr><td><b>-s</b> (запозичення, слова на голосний)</td><td>[[das Auto]] → [[die Autos]], [[das Handy]] → [[die Handys]], [[die Oma]] → [[die Omas]]</td></tr>
</table></div>
<h3>Сім'я</h3>
<p>[[die Familie]] — сім'я, [[die Eltern]] — батьки (лише множина), [[der Vater]], [[die Mutter]], [[der Sohn]], [[die Tochter]], [[der Bruder]], [[die Schwester]], [[die Geschwister]] — брати й сестри, [[der Mann]] — чоловік, [[die Frau]] — дружина, [[die Oma]] / [[der Opa]] — бабуся / дідусь (офіційно [[die Großmutter]] / [[der Großvater]]).</p>
<p>[[Ich bin verheiratet.]] — одружений / заміжня. [[Ich bin ledig.]] — неодружений / незаміжня. [[Ich bin geschieden.]] — розлучений.</p>
<h3>Присвійні займенники</h3>
<div class="tblwrap"><table><tr><th>хто</th><th>ч. і с. р.</th><th>ж. р. і множина</th></tr>
<tr><td>ich</td><td>[[mein Bruder]]</td><td>[[meine Schwester]], [[meine Eltern]]</td></tr>
<tr><td>du</td><td>[[dein Sohn]]</td><td>[[deine Tochter]]</td></tr>
<tr><td>er, es</td><td>[[sein Vater]]</td><td>[[seine Mutter]]</td></tr>
<tr><td>sie (вона)</td><td>[[ihr Mann]]</td><td>[[ihre Kinder]]</td></tr>
<tr><td>wir</td><td>[[unser Haus]]</td><td>[[unsere Wohnung]]</td></tr>
<tr><td>ihr</td><td>[[euer Auto]]</td><td>[[eure Familie]]</td></tr>
<tr><td>sie (вони)</td><td>[[ihr Sohn]]</td><td>[[ihre Tochter]]</td></tr>
<tr><td>Sie (Ви)</td><td>[[Ihr Name]]</td><td>[[Ihre Adresse]]</td></tr>
</table></div>
<div class="note"><b>Слова «свій» у німецькій немає.</b> Вибір залежить від того, <b>чиє</b>: Тарас і його сестра — [[Taras und seine Schwester]]; Олена і її брат — [[Olena und ihr Bruder]]. Закінчення -e з'являється, коли сам іменник жіночого роду чи в множині.</div>
<p>[[Hast du Geschwister?]] — [[Ja, ich habe zwei Brüder und eine Schwester.]] [[Bist du verheiratet?]] — [[Ja, mein Mann heißt Andrij.]]</p>`,
  vocab: [['haben', 'мати', 'ich habe, du hast, er hat'], ['die Familie', 'сім\'я', 'die Familien'], ['die Eltern', 'батьки', 'лише множина'], ['die Mutter', 'мати', 'die Mütter'],
    ['der Sohn', 'син', 'die Söhne'], ['die Tochter', 'донька', 'die Töchter'], ['der Bruder', 'брат', 'die Brüder'], ['die Schwester', 'сестра', 'die Schwestern'],
    ['die Geschwister', 'брати й сестри', 'лише множина'], ['der Mann', 'чоловік (і в шлюбі)', 'die Männer'], ['die Oma / der Opa', 'бабуся / дідусь', 'die Omas / die Opas'],
    ['das Kind', 'дитина', 'die Kinder'], ['der Partner / die Partnerin', 'партнер / партнерка'], ['verheiratet', 'одружений, заміжня'], ['ledig', 'неодружений, незаміжня'],
    ['geschieden', 'розлучений, розлучена'], ['mein / meine', 'мій / моя'], ['dein / deine', 'твій / твоя'], ['sein / seine', 'його'], ['ihr / ihre', 'її; їхній', 'з великої — Ihr / Ihre: Ваш'],
    ['unser / unsere', 'наш / наша'], ['der Hunger', 'голод', 'Ich habe Hunger.'], ['der Durst', 'спрага', 'Ich habe Durst.'], ['alt', 'старий; (скільки) років', 'Wie alt bist du?']],
  ex: [
    { t: 'i', q: 'haben: Ich ___ zwei Kinder.', a: 'habe' },
    { t: 'i', q: 'haben: ___ du heute Zeit?', a: 'Hast' },
    { t: 'i', q: 'haben: Er ___ Hunger.', a: 'hat' },
    { t: 'i', q: 'haben: Wir ___ eine Tochter.', a: 'haben' },
    { t: 'i', q: 'haben: Ihr ___ eine schöne Wohnung.', a: 'habt' },
    { t: 'c', q: '«Мені 20 років»', o: ['Ich bin zwanzig Jahre alt.', 'Ich habe zwanzig Jahre.', 'Mir ist zwanzig Jahre.'], e: 'Вік — через sein: [[Ich bin zwanzig.]]' },
    { t: 'i', q: 'Множина з артиклем: das Kind →', a: 'die Kinder' },
    { t: 'i', q: 'Множина з артиклем: die Schwester →', a: 'die Schwestern' },
    { t: 'i', q: 'Множина з артиклем: der Bruder →', a: 'die Brüder' },
    { t: 'i', q: 'Множина з артиклем: das Auto →', a: 'die Autos' },
    { t: 'c', q: 'Множина від «die Tochter»:', o: ['die Töchter', 'die Tochtern', 'die Tochters'] },
    { t: 'i', q: 'Olena und ___ Bruder (її брат)', a: 'ihr' },
    { t: 'i', q: 'Taras und ___ Schwester (його сестра)', a: 'seine' },
    { t: 'i', q: 'Das sind ___ Eltern. (мої)', a: 'meine' },
    { t: 'c', q: 'Ввічливо: «Як ваше ім\'я?»', o: ['Wie ist Ihr Name?', 'Wie ist dein Name?', 'Wie ist ihr Name?'], e: 'Ввічливе [[Ihr]] — з великої літери, як і [[Sie]].' },
    { t: 'o', q: 'У мене є брат і дві сестри.', a: 'Ich habe einen Bruder und zwei Schwestern.' },
    { t: 'o', q: 'Марія та її чоловік живуть у Граці.', a: ['Maria und ihr Mann wohnen in Graz.', 'In Graz wohnen Maria und ihr Mann.'] },
    { t: 'l', a: 'Hast du Geschwister?', tr: 'У тебе є брати чи сестри?' },
    { t: 'l', a: 'Meine Eltern wohnen in der Ukraine.', tr: 'Мої батьки живуть в Україні.' }
  ],
  say: [['Ich habe zwei Kinder, einen Sohn und eine Tochter.', 'У мене двоє дітей, син і донька.'], ['Hast du Geschwister?', 'У тебе є брати чи сестри?'],
    ['Meine Eltern wohnen in Dnipro.', 'Мої батьки живуть у Дніпрі.'], ['Ich bin verheiratet. Mein Mann heißt Andrij.', 'Я заміжня. Мого чоловіка звати Андрій.'],
    ['Ich habe Hunger!', 'Я голодний / голодна!']],
  speak: ['Розкажіть про свою сім\'ю в 6–8 реченнях: хто в ній є, як їх звати, скільки їм років, де вони живуть. Можна взяти фото: «Das ist meine Schwester. Sie heißt …»',
    'Поставте 4 питання про сім\'ю: Bist du verheiratet? Hast du Kinder? Wie alt sind sie? Wo wohnen deine Eltern?'],
  mission: 'Розкажіть комусь німецькою про свою сім\'ю — на інтеграційному курсі, колезі чи в мовному тандемі. Покажіть фото: «Das sind meine Eltern…»'
},
{
  id: 'a1-5', stage: 'a1', num: 'A1.5', title: 'Akkusativ: einen, keinen, den; nicht чи kein', dur: '1 тиждень',
  goals: ['ставити іменник у знахідний відмінок (Akkusativ)', 'вибирати nicht чи kein', 'вживати mich, dich, ihn і «es gibt»'],
  theory: `
<p>У німецькій 4 відмінки: <b>Nominativ</b> (хто? що?), <b>Akkusativ</b> (кого? що?), <b>Dativ</b> (кому? де?) і <b>Genitiv</b> (чий?).</p>
<div class="good">Відмінки вам знайомі: «бачу брат<b>а</b>, п'ю кав<b>у</b>». Різниця в тому, що в німецькій змінюється здебільшого <b>артикль</b>, а не закінчення іменника.</div>
<h3>Akkusativ: змінюється лише чоловічий рід</h3>
<div class="tblwrap"><table><tr><th></th><th>ч. р.</th><th>ж. р.</th><th>с. р.</th><th>множина</th></tr>
<tr><td>Nominativ</td><td>der / ein / kein / mein</td><td>die / eine / keine / meine</td><td>das / ein / kein / mein</td><td>die / — / keine / meine</td></tr>
<tr><td>Akkusativ</td><td><b>den / einen / keinen / meinen</b></td><td>die / eine / keine / meine</td><td>das / ein / kein / mein</td><td>die / — / keine / meine</td></tr>
</table></div>
<p>[[Der Kaffee ist heiß.]] → [[Ich trinke den Kaffee.]] [[Ich habe einen Bruder.]] Жіночий, середній рід і множина не змінюються: [[Ich sehe die Frau.]] [[Ich kaufe das Brot.]] [[Ich brauche eine Tasche.]]</p>
<p>Akkusativ потрібен після дієслів <b>haben, brauchen, kaufen, sehen, nehmen, suchen, finden, möchten</b> і після <b>es gibt</b> — «є, існує»: [[Hier gibt es einen Park.]] — Тут є парк.</p>
<h3>Займенники в Akkusativ</h3>
<div class="tblwrap"><table><tr><th>Nom</th><td>ich</td><td>du</td><td>er</td><td>sie</td><td>es</td><td>wir</td><td>ihr</td><td>sie / Sie</td></tr>
<tr><th>Akk</th><td>[[mich]]</td><td>[[dich]]</td><td>[[ihn]]</td><td>[[sie]]</td><td>[[es]]</td><td>[[uns]]</td><td>[[euch]]</td><td>[[sie]] / [[Sie]]</td></tr></table></div>
<p>[[Ich sehe ihn.]] — Я його бачу. [[Liebst du mich?]] [[Entschuldigung, ich verstehe Sie nicht.]]</p>
<h3>nicht чи kein?</h3>
<div class="tblwrap"><table><tr><th>kein / keine</th><th>nicht</th></tr>
<tr><td>перед іменником з ein або без артикля</td><td>дієслово, прикметник, прислівник; іменник з der / die / das чи mein</td></tr>
<tr><td>[[Ich habe kein Auto.]]<br>[[Ich habe keine Zeit.]]<br>[[Ich trinke keinen Kaffee.]]</td><td>[[Ich arbeite nicht.]]<br>[[Das ist nicht teuer.]]<br>[[Ich finde den Schlüssel nicht.]]<br>[[Das ist nicht mein Handy.]]</td></tr></table></div>
<div class="note"><b>Подвійного заперечення немає.</b> «Я не маю часу» — [[Ich habe keine Zeit.]] (а не «nicht Zeit»). «Я нічого не маю» — [[Ich habe nichts.]] Одне заперечне слово на речення.</div>
<p><b>Де стоїть nicht:</b> якщо заперечуємо дію загалом — у кінці: [[Ich verstehe das nicht.]]; перед прикметником чи прийменником — перед ним: [[nicht gut]], [[nicht in Berlin]].</p>
<p>[[Hast du ein Auto? — Nein, ich habe kein Auto.]]</p>`,
  vocab: [['brauchen', 'потребувати; бути потрібним', 'Ich brauche … — Мені потрібен …'], ['suchen', 'шукати'], ['finden', 'знаходити; вважати', 'Ich finde das gut.'], ['lieben', 'кохати, любити'],
    ['es gibt', 'є, існує (+ Akkusativ)'], ['kein / keine', 'жоден; не (перед іменником)'], ['der Kaffee', 'кава', 'чоловічий рід!'], ['das Brot', 'хліб', 'die Brote'],
    ['das Geld', 'гроші', 'однина!'], ['der Park', 'парк', 'die Parks'], ['der Ausweis', 'посвідчення особи', 'die Ausweise; der Personalausweis'], ['der Pass', 'паспорт', 'die Pässe'],
    ['der Hund', 'собака', 'die Hunde'], ['die Katze', 'кішка', 'die Katzen'], ['der Führerschein', 'посвідчення водія', 'die Führerscheine'], ['das Fahrrad', 'велосипед', 'die Fahrräder'],
    ['mich / dich', 'мене / тебе'], ['ihn', 'його (Akkusativ від er)'], ['uns / euch', 'нас / вас'], ['teuer', 'дорогий'], ['billig', 'дешевий', 'нейтральніше — günstig'], ['der Koffer', 'валіза', 'die Koffer']],
  ex: [
    { t: 'i', q: 'Akkusativ: Ich habe ___ Bruder. (ein)', a: 'einen' },
    { t: 'i', q: 'Akkusativ: Ich trinke ___ Kaffee. (der)', a: 'den' },
    { t: 'i', q: 'Akkusativ: Ich suche ___ Ausweis. (mein)', a: 'meinen', e: '«Шукаю свій паспорт» — [[Ich suche meinen Ausweis.]]: «свій» тут — mein.' },
    { t: 'i', q: 'Akkusativ: Wir brauchen ___ Wohnung. (eine)', a: 'eine' },
    { t: 'i', q: 'Akkusativ: Siehst du ___ Hund? (der)', a: 'den' },
    { t: 'i', q: 'Akkusativ: Hier gibt es ___ Park. (ein)', a: 'einen' },
    { t: 'c', q: 'Ich habe ___ Auto. (заперечення)', o: ['kein', 'nicht', 'keinen'] },
    { t: 'c', q: 'Ich habe ___ Zeit. (заперечення)', o: ['keine', 'nicht', 'kein'] },
    { t: 'c', q: 'Ich verstehe das ___.', o: ['nicht', 'kein', 'keine'] },
    { t: 'c', q: 'Das ist ___ mein Handy.', o: ['nicht', 'kein', 'keine'], e: 'Перед mein, dein, der… — nicht.' },
    { t: 'i', q: 'Заперечення: Ich trinke ___ Kaffee.', a: 'keinen' },
    { t: 'i', q: 'Siehst du den Bus? — Ja, ich sehe ___.', a: 'ihn' },
    { t: 'i', q: 'Ich liebe ___. (тебе)', a: 'dich' },
    { t: 'c', q: '«Ви мене розумієте?»', o: ['Verstehen Sie mich?', 'Verstehen Sie ich?', 'Verstehen Sie mir?'] },
    { t: 'o', q: 'У мене немає машини.', a: 'Ich habe kein Auto.' },
    { t: 'o', q: 'Сім\'я Мельник шукає квартиру в Мюнхені.', a: ['Familie Melnyk sucht eine Wohnung in München.', 'In München sucht Familie Melnyk eine Wohnung.'] },
    { t: 'l', a: 'Ich finde meinen Schlüssel nicht.', tr: 'Я не можу знайти свій ключ.' },
    { t: 'l', a: 'Hier gibt es keinen Supermarkt.', tr: 'Тут немає супермаркету.' }
  ],
  say: [['Ich habe keine Zeit.', 'У мене немає часу.'], ['Ich finde meinen Schlüssel nicht.', 'Я не можу знайти свій ключ.'],
    ['Hast du ein Auto? — Nein, ich habe kein Auto.', 'У тебе є машина? — Ні, у мене немає машини.'], ['Ich brauche einen Kaffee!', 'Мені потрібна кава!'],
    ['Gibt es hier einen Supermarkt?', 'Тут є супермаркет?']],
  speak: ['Розкажіть, що у вас є і чого немає (6–8 речень): «Ich habe einen Hund, aber keine Katze. Ich habe kein Auto, ich habe ein Fahrrad…»',
    'Опишіть свій район: що там є і чого немає. «Hier gibt es einen Park und eine Apotheke, aber keinen Bahnhof…»'],
  mission: 'Запитайте на вулиці чи в магазині, де щось знайти: «Entschuldigung, gibt es hier eine Apotheke?» або «Ich suche den Bahnhof.» Запам\'ятайте відповідь.'
},
{
  id: 'a1-6', stage: 'a1', num: 'A1.6', title: 'У кафе й магазині: ich möchte, Was kostet…?, gern', dur: '1 тиждень',
  goals: ['замовити в кафе й пекарні', 'запитати ціну й заплатити', 'сказати, що ви любите: gern, lieber, am liebsten'],
  theory: `
<h3>Ввічливе «хотів би»: möchten</h3>
<div class="tblwrap"><table><tr><td>ich</td><td>[[möchte]]</td><td>wir</td><td>[[möchten]]</td></tr>
<tr><td>du</td><td>[[möchtest]]</td><td>ihr</td><td>[[möchtet]]</td></tr>
<tr><td>er / sie / es</td><td>[[möchte]]</td><td>sie / Sie</td><td>[[möchten]]</td></tr></table></div>
<p>[[Ich möchte einen Kaffee, bitte.]] [[Ich möchte zahlen.]] Біля прилавка ще частіше кажуть [[Ich hätte gern ein Stück Kuchen.]] — «Я б хотів шматок пирога» — або коротко: [[Ich nehme…]], [[Für mich einen Tee, bitte.]] Розмовно: [[Ich bekomme einen Tee.]] — «Мені чай».</p>
<div class="note"><b>«Ich will…»</b> звучить як «хочу!» — грубувато. У кафе, магазині й установі кажіть <b>ich möchte</b> або <b>ich hätte gern</b>. І ще: [[bekommen]] означає «отримувати», а не англійське become.</div>
<h3>У кафе й пекарні</h3>
<p>[[Was möchten Sie trinken?]] — [[Einen Cappuccino, bitte.]]<br>
[[Was darf es sein?]] — Що бажаєте? (біля прилавка)<br>
[[Für hier oder zum Mitnehmen?]] — Тут чи на винос? — [[Zum Mitnehmen, bitte.]]<br>
[[Sonst noch etwas?]] — Щось іще? — [[Nein, danke. Das ist alles.]]</p>
<p>Рахунок: [[Die Rechnung, bitte!]] або [[Zahlen, bitte!]] Офіціант спитає: [[Zusammen oder getrennt?]] — платите разом чи окремо? Чайові (Trinkgeld) зазвичай близько 5–10 %: суму округлюють і кажуть [[Stimmt so.]] — решти не треба.</p>
<div class="tip"><b>Карткою?</b> [[Kann ich mit Karte zahlen?]] У Німеччині досі трапляється [[Nur bar.]] — лише готівкою. Тож корисно мати при собі трохи готівки.</div>
<h3>Ціни</h3>
<p>[[Was kostet das?]] / [[Wie viel kostet der Kuchen?]] — [[Das kostet drei Euro fünfzig.]] (3,50 €). У множині: [[Was kosten die Brötchen?]] Разом: [[Das macht zwölf Euro.]] Ціни пишуть з комою: 3,50 €.</p>
<h3>gern, lieber, am liebsten</h3>
<p>«Люблю щось робити» — це дієслово + <b>gern</b>: [[Ich trinke gern Tee.]] — я люблю чай. [[Ich trinke lieber Kaffee.]] — я більше люблю каву. [[Am liebsten trinke ich Kakao.]] — найбільше люблю какао. [[Ich esse nicht gern Fisch.]] — я не люблю рибу.</p>
<p>[[mögen]] — любити, подобатися: [[ich mag]], [[du magst]], [[er mag]]: [[Ich mag Käse.]] А [[lieben]] — сильне почуття: кохання чи захоплення: [[Ich liebe Pizza!]]</p>
<div class="note">«Я люблю готувати» — [[Ich koche gern.]], а не «Ich liebe kochen».</div>
<h3>Австрія і Швейцарія</h3>
<p>Булочка — [[das Brötchen]] у Німеччині, [[die Semmel]] в Австрії та Баварії, [[das Weggli]] у Швейцарії; круасан у Швейцарії — [[das Gipfeli]]. В Австрії помідори — [[Paradeiser]], картопля — [[Erdäpfel]], кисломолочний сир — [[der Topfen]], вершки — [[das Obers]].</p>`,
  vocab: [['möchten', 'хотіти б', 'ich möchte, du möchtest'], ['Ich hätte gern …', 'Я хотів би … (у кафе, в магазині)'], ['kosten', 'коштувати'], ['Was kostet …?', 'Скільки коштує …?'],
    ['der Euro', 'євро', 'з числом без -s: zwei Euro'], ['der Cent', 'цент', 'fünfzig Cent'], ['bar', 'готівкою'], ['mit Karte', 'карткою'], ['die Rechnung', 'рахунок', 'die Rechnungen'],
    ['zusammen / getrennt', 'разом / окремо'], ['zum Mitnehmen', 'на винос'], ['das Brötchen', 'булочка', 'Австрія, Баварія: die Semmel'], ['der Kuchen', 'пиріг, торт', 'die Kuchen'],
    ['das Stück', 'шматок; штука', 'die Stücke'], ['der Saft', 'сік', 'die Säfte'], ['das Glas', 'склянка, келих; скло', 'die Gläser'], ['die Tasse', 'чашка', 'die Tassen'],
    ['das Ei', 'яйце', 'die Eier'], ['das Fleisch', 'м\'ясо'], ['der Fisch', 'риба', 'die Fische'], ['gern', 'охоче; люблю (+ дієслово)'], ['lieber', 'краще, більше люблю'],
    ['mögen', 'любити, подобатися', 'ich mag, du magst'], ['bekommen', 'отримувати', 'англ. become = werden'], ['Sonst noch etwas?', 'Щось іще?'], ['Das ist alles.', 'Це все.']],
  ex: [
    { t: 'i', q: 'möchten: Ich ___ einen Tee.', a: 'möchte' },
    { t: 'i', q: 'möchten: Was ___ Sie trinken?', a: 'möchten' },
    { t: 'i', q: 'möchten: ___ du auch einen Kaffee?', a: 'Möchtest' },
    { t: 'c', q: 'Як ввічливо замовити каву?', o: ['Ich hätte gern einen Kaffee.', 'Ich will Kaffee!', 'Gib mir Kaffee!'] },
    { t: 'c', q: 'Офіціант питає «Zusammen oder getrennt?». Це про…', o: ['оплату: разом чи окремо', 'столик: разом чи окремо', 'каву: з молоком чи без'] },
    { t: 'c', q: '«Zum Mitnehmen» означає…', o: ['на винос', 'з молоком', 'з собою в рахунок'] },
    { t: 'c', q: 'Як сказати «решти не треба»?', o: ['Stimmt so.', 'Das ist alles.', 'Getrennt, bitte.'] },
    { t: 'c', q: '«Я люблю готувати»', o: ['Ich koche gern.', 'Ich gern koche.', 'Ich habe gern kochen.'] },
    { t: 'c', q: 'Як в Австрії називають булочку?', o: ['die Semmel', 'die Brezel', 'der Kuchen'] },
    { t: 'c', q: '«bekommen» означає…', o: ['отримувати', 'ставати', 'приходити'] },
    { t: 'i', q: 'Ціна 2,20 € словами: zwei Euro ___', a: 'zwanzig' },
    { t: 'i', q: 'mögen: Er ___ keinen Fisch.', a: 'mag' },
    { t: 'o', q: 'Скільки коштує пиріг?', a: 'Was kostet der Kuchen?' },
    { t: 'o', q: 'Рахунок, будь ласка!', a: 'Die Rechnung, bitte!' },
    { t: 'o', q: 'Можна заплатити карткою?', a: 'Kann ich mit Karte zahlen?' },
    { t: 'o', q: 'Олена найбільше любить чай.', a: ['Olena trinkt am liebsten Tee.', 'Am liebsten trinkt Olena Tee.'] },
    { t: 'g', g: 'priceListen', min: 1, max: 20 },
    { t: 'l', a: 'Ich hätte gern zwei Brötchen, bitte.', tr: 'Дайте, будь ласка, дві булочки.' },
    { t: 'l', a: 'Für hier oder zum Mitnehmen?', tr: 'Тут чи на винос?' }
  ],
  say: [['Ich hätte gern einen Cappuccino, bitte.', 'Мені капучино, будь ласка.'], ['Was kostet das?', 'Скільки це коштує?'], ['Kann ich mit Karte zahlen?', 'Можна заплатити карткою?'],
    ['Zusammen oder getrennt? — Getrennt, bitte.', 'Разом чи окремо? — Окремо, будь ласка.'], ['Stimmt so. Schönen Tag noch!', 'Решти не треба. Гарного дня!'],
    ['Ich trinke gern Tee, aber lieber Kaffee.', 'Я люблю чай, але каву більше.']],
  speak: ['Розіграйте вголос діалог у кафе за обох — офіціанта й гостя: привітання, замовлення двох позицій, рахунок, оплата карткою, чайові.',
    'Розкажіть, що ви любите їсти й пити, а що ні: gern, lieber, am liebsten, nicht gern.'],
  mission: 'Купіть щось у пекарні (Bäckerei) чи кав\'ярні лише німецькою: «Ich hätte gern … zum Mitnehmen.» Запитайте «Kann ich mit Karte zahlen?» і попрощайтеся.'
}
);
})(PG.pack('de'));
