/*
 * Самоперевірка тренажера в браузері.
 * 1) Відкрийте тренажер: локально — `python -m http.server 8000 -d docs` і http://127.0.0.1:8000/, або сайт на GitHub Pages;
 * 2) F12 → Console; 3) вставте цей файл повністю й натисніть Enter.
 * Для кожної мови з реєстру скрипт перемикається на неї, відкриває всі екрани, проходить УСІ вправи всіх уроків (у кожному
 * варіанті мови) і тренажера чисел правильними відповідями через справжній інтерфейс, перевіряє сценарії прогресу, словника
 * й вибору варіанта, а також екран вибору мови. Поточну вправу бере з PG._exCurrent (його виставляє exercises.js).
 * Прогрес і словники всіх мов зберігаються перед тестом і відновлюються після. Повний прогін займає кілька хвилин.
 */
(async () => {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith('pg-'));
  const backup = Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)]));
  const startLang = PG.code;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const first = (a) => (Array.isArray(a) ? a[0] : a);
  const report = {};
  const ok = (prefix, res) => { for (const [k, v] of Object.entries(res)) report[prefix + k] = v ? 'ok' : 'ПОМИЛКА'; };

  async function answerCurrent(box) {
    const it = PG._exCurrent;
    if (it.t === 'c') [...box.querySelectorAll('.opt')].find((o) => o.dataset.v === it.o[it.a || 0]).click();
    else if (it.t === 'o') {
      for (const w of first(it.a).split(' ')) [...box.querySelectorAll('.pool .tok')].find((t) => t.textContent === w).click();
      box.querySelector('.act').click();
    } else {
      box.querySelector('.ans').value = first(it.a);
      box.querySelector('.act').click();
    }
    return it;
  }
  async function solveAll(label) {
    const bad = []; let fin = '';
    for (let step = 0; step < 300; step++) {
      const box = document.querySelector('.ex-box'); if (!box) { bad.push('немає вправи'); break; }
      if (box.querySelector('.again')) { fin = box.querySelector('.stat').textContent; break; }
      let it;
      try { it = await answerCurrent(box); } catch (e) { it = PG._exCurrent; bad.push(it.t + ' «' + String(it.q || it.say || '').slice(0, 40) + '»: ' + e.message); break; }
      const fb = box.querySelector('.feedback');
      if (!fb || !fb.classList.contains('ok')) bad.push(it.t + ' «' + String(it.q || it.say || '').replace(/<[^>]+>/g, '').slice(0, 40) + '»');
      box.querySelector('.act').click(); await wait(10);
    }
    report[label] = bad.length ? 'ПРОБЛЕМИ: ' + bad.join('; ') : fin;
  }
  // Та сама адреса не викликає hashchange, а екран (наприклад, вправи уроку) треба відкрити наново
  const go = async (h, ms) => { if (location.hash === h) PG.route(); else location.hash = h; await wait(ms || 150); };
  const screenOk = (label) => { const pre = document.querySelector('#view pre'); report[label] = pre ? 'ПОМИЛКА: ' + pre.textContent.slice(0, 150) : 'ok'; };

  // Продовження підходу, пропуск завдання й уроку, «почати з цього уроку», «пройти наново», сховище, інша вкладка
  async function scenarios(code) {
    const res = {};
    const step = async () => { const box = document.querySelector('.ex-box'); await answerCurrent(box); box.querySelector('.act').click(); await wait(20); };
    await go('#/lesson/a1-1/ex'); await step(); await step();
    await go('#/lesson/a1-1/ex');
    const cont = document.querySelector('.ex-box .cont');
    res['продовження: є запит'] = !!cont;
    if (cont) { cont.click(); await wait(50); res['продовження: з 3-го завдання'] = /Завдання 3 з/.test(document.querySelector('.ex-box').textContent); }
    document.querySelector('.ex-box .skip').click(); await wait(20);
    res['пропуск завдання'] = /Пропущено/.test(document.querySelector('.fb').textContent) && !!PG.S.lessons['a1-1'].run.sk[PG._exCurrent._i];
    await go('#/lesson/a0-1');
    document.getElementById('lc-skip').click(); await wait(100);
    res['пропуск уроку'] = PG.lessonSkipped('a0-1') && PG.currentLesson().id !== 'a0-1';
    await go('#/lesson/a1-3');
    const from = document.getElementById('lc-from'); from.click(); from.click(); await wait(100);
    res['почати з уроку'] = PG.currentLesson().id === 'a1-3' && PG.lessons.slice(0, PG.lessons.findIndex((l) => l.id === 'a1-3')).every((l) => PG.lessonClosed(l.id));
    await go('#/lesson/a1-1');
    const rs = document.getElementById('lc-reset'); rs.click(); rs.click(); await wait(100);
    res['пройти наново'] = !PG.S.lessons['a1-1'].run && !PG.S.lessons['a1-1'].skipped && !PG.S.lessons['a1-1'].ex;
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function () { throw new DOMException('самоперевірка', 'QuotaExceededError'); };
    try { PG.save(); } finally { Storage.prototype.setItem = setItem; }
    res['збій запису помічено'] = !!PG.store.failed;
    PG.save();
    res['запис після збою'] = !PG.store.failed;
    const fromTab = (mutate) => {
      const raw = mutate(JSON.parse(localStorage.getItem(PG.store.key)));
      localStorage.setItem(PG.store.key, typeof raw === 'string' ? raw : JSON.stringify(raw));
      window.dispatchEvent(new StorageEvent('storage', { key: PG.store.key }));
    };
    fromTab((s) => { s.dict = [{ word: 'selftest', uk: 'тест' }]; return s; });
    res['зміна з іншої вкладки'] = PG.S.dict.length === 1 && PG.S.dict[0].word === 'selftest';
    fromTab((s) => { s.settings.rate = '<img src=x onerror=alert(1)>'; s.dict = [{ word: '<b>x</b>', uk: 'y', au: { us: 'javascript:alert(1)' } }]; return JSON.stringify(s).replace('{', '{"__proto__":{"polluted":1},'); });
    res['шкідливі дані знешкоджено'] = typeof PG.S.settings.rate === 'number' && ({}).polluted === undefined && !PG.S.dict[0].au;
    ok('[' + code + '] стан: ', res);
    PG.resetState();
  }

  // Словник через інтерфейс: додати, дубль, редагувати з перенесенням прогресу, експорт JSON → очистити → імпорт → скасувати
  async function dictionary(code) {
    const res = {};
    const D = PG.Dict, files = [];
    const download = D.download;
    D.download = (name, text) => files.push({ name, text });
    try {
      await go('#/dict');
      const add = (w, uk) => { document.getElementById('d-en').value = w; document.getElementById('d-uk').value = uk; document.getElementById('d-add-btn').click(); };
      add('reschedule', 'перенести (зустріч)'); await wait(30);
      add('queue', 'черга'); await wait(30);
      add('Queue', 'черга знову'); await wait(30);
      res['додавання і дубль'] = PG.S.dict.length === 2 && document.querySelectorAll('#d-list .dict-row').length === 2;
      const row = [...document.querySelectorAll('#d-list .dict-row')].find((r) => r.dataset.text.startsWith('queue'));
      row.querySelector('[data-act="say"]').click();
      row.querySelector('[data-act="edit"]').click(); await wait(20);
      PG.S.cards['my|queue'] = { due: PG.today() + 3, int: 3, ease: 2.5, reps: 1, lapses: 0 };
      row.querySelector('.e-en').value = 'queue (UK)';
      row.querySelector('.e-uk').value = 'черга';
      row.querySelector('[data-act="save"]').click(); await wait(30);
      res['редагування з прогресом'] = !!D.get('queue (UK)') && !!PG.S.cards['my|queue (UK)'] && !PG.S.cards['my|queue'];
      await go('#/dict/io');
      document.getElementById('x-json').click(); await wait(20);
      const json = files.length && files[files.length - 1].text;
      res['експорт JSON'] = !!json && JSON.parse(json).words.length === 2 && JSON.parse(json).lang === code && !!JSON.parse(json).words.find((w) => w.card);
      D.clear();
      await go('#/dict/io');
      document.getElementById('i-text').value = json;
      document.getElementById('i-parse').click(); await wait(30);
      document.getElementById('i-go').click(); await wait(50);
      res['імпорт JSON з прогресом'] = PG.S.dict.length === 2 && !!PG.S.cards['my|queue (UK)'];
      document.getElementById('i-text').value = 'apple — яблуко\nqueue (UK); черга, лінія\nбез перекладу';
      document.getElementById('i-parse').click(); await wait(30);
      const prev = document.getElementById('i-preview').textContent;
      res['перегляд імпорту'] = /нових: 1/.test(prev) && /з іншим перекладом: 1/.test(prev) && /не розпізнано: 1/.test(prev);
      document.querySelector('input[name="i-conf"][value="merge"]').click();
      document.getElementById('i-go').click(); await wait(50);
      res['злиття перекладів'] = PG.S.dict.length === 3 && D.get('queue (UK)').uk === 'черга; черга, лінія';
      document.getElementById('i-undo').click(); await wait(50);
      res['скасування імпорту'] = PG.S.dict.length === 2 && D.get('queue (UK)').uk === 'черга';
      document.getElementById('x-csv').click(); await wait(20);
      res['експорт CSV'] = files.length >= 2 && files[files.length - 1].text.charCodeAt(0) === 0xFEFF;
      await go('#/dict/practice');
      await solveAll('[' + code + '] словник: тренування');
      await go('#/words/review/my');
      res['повторення лише словника'] = !!document.querySelector('.flash');
    } finally { D.download = download; }
    ok('[' + code + '] словник: ', res);
    PG.resetState();
  }

  // Питання про варіант мови на першому запуску; вибір змінює прапор у шапці
  async function variantPick(code) {
    const vs = PG.variants();
    if (vs.length < 2) return;
    const res = {};
    await go('#/today');
    res['питання на першому запуску'] = !!document.querySelector('.variant-card');
    document.querySelector('.variant-card [data-variant="' + vs[1].id + '"]').click(); await wait(50);
    // Браузер серіалізує SVG інакше, ніж записано в реєстрі (<path/> → <path></path>), тож прапори порівнюються за viewBox
    const flag = () => document.querySelector('#lang-flag svg').getAttribute('viewBox');
    const want = (v) => (PG.flagSvg(code, v).match(/viewBox="([^"]+)"/) || [])[1];
    res['вибір ' + vs[1].tag] = PG.variant() === vs[1].id && PG.S.ui.variantAsked && !document.querySelector('.variant-card') && flag() === want(vs[1].id);
    PG.setVariant(vs[0].id); await go('#/today');
    res['вибір ' + vs[0].tag] = PG.variant() === vs[0].id && flag() === want(vs[0].id);
    ok('[' + code + '] варіант: ', res);
  }

  // Без звуку й мережі: сотні диктантів підряд — це сотні запитів до онлайн-голосу, сервіс може тимчасово заблокувати
  const say = PG.TTS.say, playUrl = PG.TTS.playUrl, lookup = PG.Dict.lookup;
  PG.TTS.say = () => {}; PG.TTS.playUrl = () => {}; PG.Dict.lookup = async () => null;
  try {
    for (const info of PG.LANGS) {
      const code = info.code;
      await PG.switchLang(code); await wait(200);
      report['[' + code + '] перемикання мови'] = PG.code === code && document.documentElement.dataset.lang === code && !!document.querySelector('#lang-flag svg') ? 'ok' : 'ПОМИЛКА';
      PG.resetState(); // тест іде на чистому стані; ваш прогрес повернеться в кінці
      await variantPick(code);
      await scenarios(code);
      await dictionary(code);
      for (const v of PG.variants().length ? PG.variants().map((x) => x.id) : [null]) {
        const tag = v ? ' [' + v + ']' : '';
        if (v) { PG.setVariant(v); }
        for (const p of ['today', 'program', 'lessons', 'words', 'words/list', 'words/review/my', 'dict', 'dict/io', 'dict/practice', 'speak', 'ref', 'settings', 'drill', 'languages']) {
          location.hash = '#/' + p; await wait(120);
          screenOk('[' + code + '] екран ' + p + tag);
        }
        for (const L of PG.lessons) {
          for (const tab of ['theory', 'words', 'speak', 'mission']) {
            location.hash = '#/lesson/' + L.id + '/' + tab; await wait(40);
            if (document.querySelector('#view pre')) report['[' + code + '] ' + L.id + ' ' + tab + tag] = 'ПОМИЛКА екрана';
          }
          await go('#/lesson/' + L.id + '/ex', 120);
          await solveAll('[' + code + '] ' + L.id + ' вправи' + tag);
        }
      }
      for (const d of PG.L.drills || []) {
        await go('#/drill/' + d[0], 120);
        await solveAll('[' + code + '] тренажер ' + d[0]);
      }
    }
  } finally {
    PG.TTS.say = say; PG.TTS.playUrl = playUrl; PG.Dict.lookup = lookup;
    PG.TTS.stop();
    for (const k of Object.keys(localStorage)) if (k.startsWith('pg-')) localStorage.removeItem(k);
    for (const [k, v] of Object.entries(backup)) localStorage.setItem(k, v);
    PG.reloadApp();
    if (startLang) { await PG.activate(startLang); PG.applyLang(); }
    location.hash = startLang ? '#/today' : '#/languages';
    PG.route();
  }
  console.table(report);
  const problems = Object.entries(report).filter(([, v]) => v !== 'ok' && v !== '100%');
  console.log(problems.length ? '❌ Знайдено проблем: ' + problems.length : '✅ Усе гаразд: усі мови відкриваються, усі екрани працюють, усі вправи розв\'язуються, словник працює.');
  return problems;
})();
