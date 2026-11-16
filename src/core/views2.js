/* Екрани «Слова», «Тренажер чисел», «Розмова», «Довідник», «Налаштування»; вибір мови й варіанта, маршрутизація та запуск */
(function (PG) {
  'use strict';
  const esc = PG.esc, $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const view = () => document.getElementById('view');
  const N = () => PG.L.names;
  const otherTag = () => (PG.variantInfo(PG.otherVariant()) || {}).tag || '';

  // only: 'my' — повторювати лише слова мого словника (#/words/review/my)
  function renderWords(sub, only) {
    sub = sub || 'review';
    only = only === 'my' ? 'my' : '';
    const c = PG.srsCounts(only);
    view().innerHTML = PG.views.voiceBanner() + '<div class="card"><h1>🃏 Слова' + (only ? ': мій словник' : '') + '</h1><div class="row small"><span class="pill">' + c.due + ' на повторення</span><span class="pill green">' + c.known + ' у пам\'яті</span><span class="pill gray">' + c.unseen + ' нових чекають</span></div>' +
      '<div class="subtabs"><button data-s="review" class="' + (sub === 'review' && !only ? 'active' : '') + '">Повторення</button><button data-s="review/my" class="' + (sub === 'review' && only ? 'active' : '') + '">Лише мій словник</button><button data-s="list" class="' + (sub === 'list' ? 'active' : '') + '">Усі слова</button><button data-go="dict">📒 Мій словник →</button></div></div><div id="w-body"></div>';
    $$('[data-s]').forEach((b) => b.onclick = () => { location.hash = '#/words/' + b.dataset.s; });
    $('[data-go]').onclick = () => { location.hash = '#/dict'; };
    const body = $('#w-body');
    if (sub === 'list') wordList(body);
    else review(body, only);
  }
  function review(body, only) {
    const q = PG.srsQueue(only);
    const queue = q.due.concat(q.fresh);
    if (!queue.length) {
      const any = PG.srsCounts(only).all;
      body.innerHTML = '<div class="card center"><h2>🎉 На сьогодні все!</h2><p class="muted">' + (any ? 'Повертайтеся завтра. Нові слова з\'являються, коли ви відкриваєте нові уроки або додаєте слова в словник.'
        : only ? 'У словнику ще немає слів.' : 'Відкрийте перший урок або додайте слова в «📒 Мій словник».') + '</p>' +
        (only ? '<a class="btn primary" href="#/dict">📒 До словника</a>' : '<a class="btn primary" href="#/lesson/' + PG.currentLesson().id + '">До уроку</a>') + '</div>';
      return;
    }
    let i = 0;
    const again = [];
    const show = () => {
      const w = queue[i] || again.shift();
      if (!w) return review(body, only);
      const dirSet = PG.S.settings.dir;
      const toTl = dirSet === 'uk' ? true : dirSet === 'tl' ? false : Math.random() < 0.5;
      const isNew = !PG.S.cards[w.id];
      const said = PG.sayText(w.word);
      body.innerHTML = '<div class="card ex-box"><div class="row small muted"><span>' + (isNew ? '<span class="pill amber">нове</span>' : '') + (w.lesson === 'my' ? ' <span class="pill">📒</span>' : '') + ' ' + (toTl ? 'Як це ' + esc(N().ins) + '?' : 'Що це означає?') + '</span><span class="spacer"></span>залишилось: ' + (queue.length - i + again.length) + '</div>' +
        '<div class="flash"><div class="front">' + (toTl ? esc(w.uk) : esc(w.word)) + '</div>' + (!toTl && w.ipa ? '<div class="ipa">' + esc(w.ipa) + '</div>' : '') +
        '<div class="back" style="display:none"><div class="big-phrase">' + esc(w.word) + '</div>' + (w.alt ? '<div class="vv">' + esc(otherTag()) + ' ' + esc(w.alt) + '</div>' : '') +
        (toTl && w.ipa ? '<div class="ipa">' + esc(w.ipa) + '</div>' : '') + (toTl ? '' : '<div>' + esc(w.uk) + '</div>') +
        // Примітки слів уроку — розмітка уроку (транскрипції US / UK), примітки мого словника — текст учня, його лише екрануємо
        (w.note ? '<div class="small muted">' + (w.lesson === 'my' ? esc(w.note) : PG.rich(w.note)) + '</div>' : '') + (w.ex ? '<div class="small">' + PG.sayHtml(w.ex) + '</div>' : '') + '</div></div>' +
        '<div class="row" style="justify-content:center"><button class="btn" id="fl-say">🔊</button><button class="btn primary" id="fl-show">Показати відповідь<span class="kbd"> (пробіл)</span></button></div>' +
        '<div class="srs-btns" style="display:none">' + [[1, 'Знову'], [2, 'Важко'], [3, 'Добре'], [4, 'Легко']].map((g) => '<button class="btn" data-g="' + g[0] + '">' + g[1] + '<small>' + PG.nextIntervalLabel(w, g[0]) + '<span class="kbd"> · ' + g[0] + '</span></small></button>').join('') + '</div></div>';
      const reveal = () => { $('.back', body).style.display = ''; $('#fl-show').style.display = 'none'; $('.srs-btns', body).style.display = ''; PG.TTS.say(said); };
      $('#fl-say').onclick = () => PG.TTS.say(said);
      if (!toTl) PG.TTS.say(said);
      $('#fl-show').onclick = reveal;
      $$('[data-g]', body).forEach((b) => b.onclick = () => grade(+b.dataset.g));
      const grade = (g) => { PG.srsGrade(w, g); if (g === 1) again.push(w); if (queue[i] === w) i++; show(); };
      body._key = (e) => {
        if (e.code === 'Space' && $('#fl-show') && $('#fl-show').style.display !== 'none') { e.preventDefault(); reveal(); }
        else if (/^[1-4]$/.test(e.key) && $('.srs-btns', body).style.display !== 'none') grade(+e.key);
      };
    };
    document.onkeydown = (e) => { if (body._key && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) body._key(e); };
    show();
  }
  function wordList(body) {
    const words = PG.allWords();
    body.innerHTML = '<div class="card"><input type="text" id="w-q" placeholder="Пошук ' + esc(N().ins) + ' чи українською…"><div class="tblwrap" style="margin-top:10px"><table id="w-t"><tr><th>' + esc(PG.cap(N().ins)) + '</th><th>Українською</th><th>Наступне повторення</th></tr>' +
      words.map((w) => { const c = PG.S.cards[w.id]; const d = c ? c.due - PG.today() : null;
        return '<tr><td>' + PG.sayHtml(w.word, PG.sayText(w.word)) + (w.alt ? ' <span class="vv">' + esc(otherTag()) + ' ' + esc(w.alt) + '</span>' : '') + (w.lesson === 'my' ? ' <span class="small">📒</span>' : '') + '</td><td>' + esc(w.uk) + '</td><td class="small muted">' + (c ? (d <= 0 ? 'сьогодні' : 'через ' + d + ' дн.') : 'нове') + '</td></tr>'; }).join('') +
      '</table></div>' + (words.length ? '' : '<p class="muted">Поки порожньо — відкрийте урок або додайте слова в словник.</p>') + '</div>';
    $('#w-q').oninput = (e) => { const v = PG.fold(e.target.value); $$('#w-t tr').slice(1).forEach((tr) => { tr.style.display = PG.fold(tr.textContent).includes(v) ? '' : 'none'; }); };
  }

  function renderDrill(mode) {
    const U = PG.L.ui, drills = PG.L.drills || [], back = U.drillBack || ['#/lessons', '← Уроки'];
    view().innerHTML = PG.views.voiceBanner() + '<div class="card"><div class="row small muted"><a href="' + esc(back[0]) + '">' + esc(back[1]) + '</a></div><h1>' + esc(U.drillTitle || '🔢 Тренажер чисел') + '</h1>' +
      '<p class="muted">' + esc(U.drillIntro || '') + '</p>' +
      '<div class="row">' + drills.map((d) => '<a class="btn small' + (d[0] === mode ? ' primary' : '') + '" href="#/drill/' + d[0] + '">' + esc(d[1]) + '</a>').join('') + '</div></div><div id="dr-body"></div>';
    const d = drills.find((x) => x[0] === mode);
    if (!d) { $('#dr-body').innerHTML = '<div class="card center muted">' + (drills.length ? 'Виберіть режим угорі.' : 'Для цієї мови тренажера чисел ще немає.') + '</div>'; return; }
    const pool = drills.filter((x) => x[2]).map((x) => x[2]);
    const specs = Array.from({ length: 10 }, () => Object.assign({ t: 'g' }, d[2] || pool[Math.floor(Math.random() * pool.length)]));
    PG.runExercises($('#dr-body'), specs, { drill: true });
  }

  function renderSpeak() {
    const opened = PG.lessons.filter((l) => PG.S.lessons[l.id] && PG.S.lessons[l.id].opened);
    const pool = (opened.length ? opened : PG.lessons.slice(0, 1));
    const phrases = pool.flatMap((l) => l.say.map((p) => ({ tl: PG.v(p[0]), uk: p[1], l: l.num })));
    const prompts = pool.flatMap((l) => l.speak.map((s) => ({ s, l: l.num })));
    if (!phrases.length || !prompts.length) { view().innerHTML = '<div class="card"><h1>🎙️ Розмова</h1><p class="muted">Відкрийте перший урок — тут з\'являться фрази для практики.</p></div>'; return; }
    const U = PG.L.ui;
    view().innerHTML = PG.views.voiceBanner() + '<div class="card"><h1>🎙️ Розмова</h1><p class="muted">Розмова — ваш пріоритет №1. Тут фрази з уроків, які ви вже відкрили. Слухайте, повторюйте, записуйте себе й порівнюйте з диктором.</p></div>' +
      '<div class="card"><h3>🔁 Shadowing</h3><div class="center"><div class="big-phrase" id="sh-en"></div><div class="muted" id="sh-uk"></div><div class="small muted" id="sh-l"></div></div>' +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="sh-play">🔊 Слухати</button><button class="btn" id="sh-slow">🐢 Повільно</button><span id="sh-rec"></span><button class="btn primary" id="sh-next">Наступна →</button></div>' +
      '<p class="small muted center">Схема: послухайте 2 рази → скажіть разом із диктором → скажіть самі → запишіть → порівняйте.' + (U.speakTip ? ' ' + esc(U.speakTip) : '') + '</p></div>' +
      '<div class="card"><h3>🗣️ Говоріть 1 хвилину</h3><p id="pr-text" style="font-size:1.1rem"></p><div class="row"><span class="timer" id="pr-t">1:00</span><button class="btn primary" id="pr-go">▶ Старт</button><button class="btn" id="pr-next">Інше завдання</button><span id="pr-rec"></span></div>' +
      '<p class="small muted">Не зупиняйтеся, навіть якщо помиляєтеся. ' + esc(U.speakHint || '') + '</p></div>' +
      '<div class="card"><h3>🎯 Мої місії</h3>' + PG.lessons.map((l) => '<div class="lesson-item"><span class="num">' + esc(l.num) + '</span><span class="small">' + PG.rich(PG.v(l.mission)) + '</span><span class="spacer"></span>' + (PG.S.lessons[l.id] && PG.S.lessons[l.id].mission ? '<span class="done-mark">✓</span>' : '<a class="btn small" href="#/lesson/' + l.id + '/mission">→</a>') + '</div>').join('') + '</div>';
    let k = 0; const order = PG.shuffle(phrases);
    const cur = () => order[k % order.length];
    const drawPh = () => { $('#sh-en').textContent = cur().tl; $('#sh-uk').textContent = cur().uk; $('#sh-l').textContent = 'урок ' + cur().l; };
    drawPh();
    $('#sh-play').onclick = () => PG.TTS.say(cur().tl);
    $('#sh-slow').onclick = () => PG.TTS.say(cur().tl, 0.6);
    $('#sh-next').onclick = () => { k++; drawPh(); PG.TTS.say(cur().tl); };
    PG.recorderWidget($('#sh-rec'));
    PG.recorderWidget($('#pr-rec'));
    let pk = Math.floor(Math.random() * prompts.length), pInt = null;
    const drawPr = () => { $('#pr-text').innerHTML = PG.rich(PG.v(prompts[pk % prompts.length].s)); };
    drawPr();
    $('#pr-next').onclick = () => { pk++; drawPr(); };
    $('#pr-go').onclick = () => {
      clearInterval(pInt); const end = Date.now() + 60000, el = $('#pr-t');
      // Рахуємо від часу старту: на телефоні з вимкненим екраном тики setInterval зупиняються
      pInt = setInterval(() => {
        const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        el.textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
        if (left <= 0) { clearInterval(pInt); PG.toast('Хвилина минула! 👏'); PG.logActivity('speak'); }
      }, 250);
    };
  }

  function renderRef() {
    if (!PG.ref.length) { view().innerHTML = '<div class="card"><h1>📚 Довідник</h1><p class="muted">Довідник ще порожній.</p></div>'; return; }
    view().innerHTML = '<div class="card"><h1>📚 Довідник</h1><input type="text" id="r-q" placeholder="' + esc(PG.L.ui.refSearch || 'Пошук у таблицях…') + '">' +
      '<div class="row small" style="margin-top:8px">' + PG.ref.map((r) => '<a href="#/ref" data-jump="' + esc(r.id) + '">' + esc(r.title) + '</a>').join(' · ') + '</div></div>' +
      PG.ref.map((r) => '<div class="card" id="ref-' + esc(r.id) + '"><h2>' + esc(r.title) + '</h2>' + PG.rich(PG.v(r.html, null, { nv: r.nv })) + '</div>').join('');
    $$('[data-jump]').forEach((a) => a.onclick = (e) => { e.preventDefault(); document.getElementById('ref-' + a.dataset.jump).scrollIntoView({ behavior: 'smooth' }); });
    $('#r-q').oninput = (e) => {
      const v = PG.fold(e.target.value.trim());
      $$('#view table tr').forEach((tr) => { if (tr.querySelector('th')) return; tr.style.display = !v || PG.fold(tr.textContent).includes(v) ? '' : 'none'; });
    };
  }

  function renderSettings() {
    const s = PG.S.settings, L = PG.L, U = L.ui, info = PG.langInfo(PG.code);
    const T = PG.TTS, voices = T.voices, ONLINE = T.ONLINE, v = PG.variant(), vi = PG.variantInfo(v);
    const known = s.voice === ONLINE || voices.some((x) => x.name === s.voice);
    const opt = (val, label, sel) => '<option value="' + esc(val) + '"' + (sel ? ' selected' : '') + '>' + esc(label) + '</option>';
    const vopt = (x) => opt(x.name, x.name + (x.localService === false && !/online/i.test(x.name) ? ' (онлайн)' : ''), known && x.name === s.voice);
    const group = (acc, title) => { const list = voices.filter((x) => T.accentOf(x) === acc); return list.length ? '<optgroup label="' + esc(title) + '">' + list.map(vopt).join('') + '</optgroup>' : ''; };
    const hasVoice = vi ? voices.some((x) => T.accentOf(x) === v) : voices.length > 0;
    view().innerHTML = '<div class="card"><h1>⚙️ Налаштування</h1>' +
      '<h3>🌍 Мова навчання</h3><div class="row">' + PG.flagHtml(PG.code, v) + ' <b>' + esc(info.name) + '</b><span class="small muted">· ' + esc(info.native) + '</span><span class="spacer"></span><a class="btn small" href="#/languages">Змінити мову</a></div>' +
      '<p class="small muted" style="margin:6px 0 10px">Налаштування нижче — для цієї мови. Прогрес кожної мови зберігається окремо.</p>' +
      (vi ? '<h3>' + esc(U.variantTitle || 'Варіант мови') + '</h3>' + PG.variantPicker() + '<p class="small muted" style="margin:6px 0 10px">' + esc(U.variantSettings || '') + '</p>' : '') +
      '<h3>🔊 Голос</h3><select id="st-voice">' +
        opt('', 'Автоматично: ' + (hasVoice ? 'найкращий голос системи' : 'онлайн-голос Google'), !known) +
        (vi ? group(v, PG.cap(vi.name) + ' (' + vi.tag + ')') + group('other', 'Інші (' + N().nom + ')') : voices.map(vopt).join('')) +
        opt(ONLINE, 'Google — онлайн (' + (vi ? vi.name : N().nom) + ')', s.voice === ONLINE) + '</select>' +
      '<p class="small muted" style="margin:6px 0 0">Зараз говорить: <b>' + esc(T.label()) + '</b>. ' +
        (hasVoice ? '' : 'Голосу цієї мови' + (vi ? ' (' + vi.tag + ')' : '') + ' в системі немає, тому говорить онлайн-голос Google — потрібен інтернет. ') +
        esc(U.voiceNote || '') + ' Онлайн-голосу надсилається лише текст ' + esc(N().gen) + ', який треба озвучити.</p>' +
      '<details class="small" style="margin-top:6px"' + (voices.length ? '' : ' open') + '><summary>Як додати ' + esc(N().adj) + ' голос, що працює без інтернету</summary><ul>' + (U.voiceHelp || '') + '</ul></details>' +
      '<div class="row" style="margin-top:8px"><label>Швидкість: <b id="st-rate-v">' + esc(s.rate) + '</b></label><input type="range" id="st-rate" min="0.5" max="1.2" step="0.05" value="' + esc(s.rate) + '" style="flex:1"><button class="btn small" id="st-test">Перевірити</button></div>' +
      '<h3>✍️ Вправи</h3><label class="row"><input type="checkbox" id="st-strict"' + (s.strict ? ' checked' : '') + '> ' + esc(U.strict) + '</label>' +
      '<h3>🃏 Слова</h3><div class="row"><label>Нових слів на день:</label><input type="number" id="st-new" min="0" max="50" value="' + esc(s.newPerDay) + '" style="width:90px"></div>' +
      '<div class="row" style="margin-top:8px"><label>Напрям карток:</label><select id="st-dir" style="width:auto"><option value="mix">мікс</option><option value="tl">' + esc(N().nom) + ' → українська</option><option value="uk">українська → ' + esc(N().nom) + '</option></select></div>' +
      (PG.Dict.canLookup() ? '<h3>📒 Мій словник</h3><label class="row"><input type="checkbox" id="st-ipa"' + (s.autoIpa ? ' checked' : '') + '> Автоматично шукати транскрипцію й записи носіїв для нових слів (' + esc(L.dict.lookupNote || '') + ')</label>' : '') +
      '</div><div class="card"><h3>💾 Збереження прогресу</h3><p class="small muted">Прогрес зберігається в браузері на цьому пристрої (у сховищі цього сайту), для кожної мови окремо. На іншому пристрої чи в іншому браузері прогрес окремий; мій словник можна перенести через <a href="#/dict/io">⇅ Імпорт / експорт</a>.</p>' +
      storageStatus() +
      progressSummary() +
      '<h3>↺ Почати наново</h3><p class="small muted">Скидання стосується лише цієї мови й не скасовується. Кожна кнопка просить підтвердження (друге натискання). Мій словник ці кнопки не видаляють.</p>' +
      '<div class="row"><button class="btn" id="st-rl" title="Уроки, вправи, місії, пропуски">Скинути уроки</button><button class="btn" id="st-rw" title="Інтервали повторення; самі слова й словник лишаються">Скинути повторення слів</button>' +
      '<span class="spacer"></span><button class="btn danger" id="st-reset" title="Усе в цій мові, крім налаштувань і мого словника">Почати ' + esc(N().acc) + ' з нуля</button></div></div>' +
      '<div class="card"><h3>📲 Встановити як додаток</h3>' + (PG.isInstalled() ? '<p class="small"><span class="done-mark">✓</span> Тренажер відкрито як встановлений додаток.</p>' : installHelp()) +
      '<p class="small muted" style="margin:8px 0 0">Версія тренажера: ' + esc(PG.BUILD || 'розробка (src/)') + '</p></div>';
    $('#st-dir').value = s.dir;
    if (vi) PG.bindVariantPicker(view(), () => renderSettings());
    $('#st-voice').onchange = (e) => { s.voice = e.target.value; PG.save(); renderSettings(); PG.TTS.say(U.voiceHello); };
    $('#st-rate').oninput = (e) => { s.rate = +e.target.value; $('#st-rate-v').textContent = s.rate; PG.save(); };
    $('#st-test').onclick = () => PG.TTS.say(U.voiceTest);
    $('#st-strict').onchange = (e) => { s.strict = e.target.checked; PG.save(); };
    const ipa = $('#st-ipa'); if (ipa) ipa.onchange = (e) => { s.autoIpa = e.target.checked; PG.save(); };
    $('#st-new').onchange = (e) => { s.newPerDay = Math.max(0, Math.min(50, +e.target.value || 0)); PG.save(); };
    $('#st-dir').onchange = (e) => { s.dir = e.target.value; PG.save(); };
    bindInstall(view());
    const per = $('#st-persist');
    if (per) per.onclick = () => PG.Storage.check(true).then((p) => { PG.toast(p ? 'Постійне сховище увімкнено ✓' : 'Браузер поки не дозволив. Встановіть тренажер як додаток — це найнадійніше.', 5000); renderSettings(); });
    PG.confirmClick($('#st-rl'), 'Точно скинути уроки?', () => { PG.resetLessons(); PG.toast('Прогрес уроків скинуто'); renderSettings(); });
    PG.confirmClick($('#st-rw'), 'Точно скинути повторення?', () => { PG.resetWords(); PG.toast('Повторення слів скинуто'); renderSettings(); });
    PG.confirmClick($('#st-reset'), 'Точно почати з нуля?', () => {
      const keep = { settings: PG.S.settings, dict: PG.S.dict };
      PG.resetState(); Object.assign(PG.S, keep); PG.save();
      PG.toast('Прогрес скинуто — починаємо спочатку! Словник збережено.'); location.hash = '#/today';
    });
  }
  function storageStatus() {
    const p = PG.Storage.persisted, st = PG.store;
    const row = (k, v) => '<tr><td>' + k + '</td><td>' + v + '</td></tr>';
    const ok = '<span class="done-mark">✓</span> ';
    return '<div class="tblwrap"><table>' +
      row('Постійне сховище', p === true ? ok + 'увімкнено: браузер не видалить прогрес сам'
        : p === false ? '⚠️ ні: браузер може видалити дані сайту, коли на пристрої забракне місця. Найнадійніше — встановити тренажер як додаток (див. нижче). <button class="btn small" id="st-persist">Спробувати ввімкнути</button>'
          : 'невідомо: браузер про це не повідомляє') +
      row('Запис', st.newer ? '⚠️ прогрес записала новіша версія тренажера. Оновіть сторінку з інтернетом; доти зміни тут не зберігаються.'
        : st.failed ? '⚠️ останнє збереження не вдалося (' + esc(st.failed.name || st.failed) + '). Перевірте, чи не заблоковано для сайту файли cookie й дані сайтів і чи є місце на пристрої.'
          : st.broken ? '⚠️ збережений прогрес не вдалося прочитати (' + esc(st.broken.name || st.broken.message || st.broken) + '). Якщо він був, його копія лежить у сховищі сайту під ключем <code>' + esc(st.key) + '-broken</code>.'
            : ok + 'працює') +
      '</table></div><p class="small muted">Прогрес зникне, якщо в браузері очистити «Файли cookie та інші дані сайтів» для цього сайту. Тому час від часу зберігайте файл словника.</p>';
  }
  function installHelp() {
    return '<p class="small">Встановлений тренажер відкривається з головного екрана чи меню «Пуск» в окремому вікні й працює без інтернету (крім онлайн-голосу й пошуку транскрипції), а браузер надійніше зберігає його прогрес.</p>' +
      (PG.Install.prompt ? '<button class="btn primary install-btn">📲 Встановити</button>' : '') +
      '<ul class="small"><li><b>Android (Chrome)</b>: меню ⋮ → «Додати на головний екран» → «Установити».</li>' +
      '<li><b>Комп\'ютер (Chrome / Edge)</b>: значок «Установити» праворуч в адресному рядку (або в меню ⋮).</li>' +
      '<li><b>iPhone / iPad</b>: кнопка «Поділитися» → «На екран „Додому“».</li></ul>';
  }
  function bindInstall(root) {
    $$('.install-btn', root).forEach((b) => { b.onclick = () => PG.Install.run(); });
  }
  // persisted === null означає «ще не відповів або не підтримує» — тоді порада була б зайвим нагадуванням
  PG.fillInstallTip = function () {
    const el = document.getElementById('install-tip'); if (!el) return;
    const show = PG.A.ui.installTip && !PG.isInstalled() && PG.Storage.persisted === false;
    el.innerHTML = show ? '<div class="tip" style="margin:0 0 14px"><div class="row"><b>📲 Встановіть тренажер як додаток</b><span class="spacer"></span><button class="btn small" id="it-hide" title="Більше не показувати">✕</button></div>' +
      '<p class="small" style="margin:6px 0">Так браузер не видалить ваш прогрес і словники, коли на пристрої забракне місця, а тренажер відкриватиметься з головного екрана й без інтернету.</p>' +
      (PG.Install.prompt ? '<button class="btn primary small install-btn">📲 Встановити</button>'
        : '<p class="small muted" style="margin:0">Chrome: меню ⋮ → «Додати на головний екран» (телефон) або значок «Установити» в адресному рядку (комп\'ютер). Докладніше — у ⚙️ «Налаштування».</p>') + '</div>' : '';
    if (!show) return;
    bindInstall(el);
    $('#it-hide', el).onclick = () => { PG.A.ui.installTip = false; PG.saveApp(); el.innerHTML = ''; };
  };

  function progressSummary() {
    const L = PG.lessons;
    const cur = PG.currentLesson();
    const done = L.filter((l) => PG.lessonDone(l.id)).length, skipped = L.filter((l) => PG.lessonSkipped(l.id)).length;
    const runs = L.filter((l) => PG.S.lessons[l.id] && PG.S.lessons[l.id].run).length;
    const c = PG.srsCounts();
    const days = Object.keys(PG.S.days).length;
    const mods = Object.values(PG.S.modules).filter(Boolean).length;
    return '<div class="tblwrap" style="margin-top:10px"><table><tr><th colspan="2">Що збережено зараз (' + esc(N().nom) + ')</th></tr>' +
      '<tr><td>Уроки</td><td>пройдено ' + done + ', пропущено ' + skipped + ' з ' + L.length + (runs ? '; незавершених підходів до вправ: ' + runs : '') + '</td></tr>' +
      (cur ? '<tr><td>Поточний урок</td><td>' + esc(cur.num + ' · ' + PG.v(cur.title)) + '</td></tr>' : '') +
      '<tr><td>Слова</td><td>у повторенні ' + c.known + ', на сьогодні ' + c.due + ', нових чекають ' + c.unseen + '</td></tr>' +
      '<tr><td>Мій словник</td><td>' + PG.S.dict.length + ' слів</td></tr>' +
      (mods ? '<tr><td>Модулі</td><td>позначено ' + mods + '</td></tr>' : '') +
      '<tr><td>Активність</td><td>днів із заняттями: ' + days + ', серія: ' + PG.streak() + '</td></tr></table></div>';
  }

  PG.setVariant = function (v) {
    const s = PG.S.settings, T = PG.TTS;
    if (!PG.variantInfo(v)) return;
    s.variant = v;
    // Вибраний голос іншого варіанта читав би британське слово з американською вимовою — повертаємо автовибір
    const chosen = T.voices.find((x) => x.name === s.voice);
    if (chosen && T.accentOf(chosen) !== v && T.accentOf(chosen) !== 'other') s.voice = '';
    PG.S.ui.variantAsked = true;
    PG.save();
    applyFlag();
  };
  PG.variantPicker = function (big) {
    const v = PG.variant();
    return '<div class="row variant-pick">' + PG.variants().map((x) => '<button class="btn' + (big ? ' big' : '') + (x.id === v && (PG.S.ui.variantAsked || !big) ? ' primary' : '') + '" data-variant="' + x.id + '">' + PG.flagHtml(PG.code, x.id) + ' ' + esc(x.label) + '</button>').join('') + '</div>';
  };
  PG.bindVariantPicker = function (root, after) {
    $$('[data-variant]', root).forEach((b) => b.onclick = () => {
      PG.setVariant(b.dataset.variant);
      const vi = PG.variantInfo(PG.variant());
      PG.toast('Тепер: ' + vi.name + ' ' + N().nom + ' ' + vi.tag);
      after();
      PG.TTS.say(vi.sample);
    });
  };

  // Іконка вкладки — прапор мови й варіанта учня; PNG-іконки встановленого додатка одні для всіх мов (логотип)
  function applyFlag() {
    const el = $('#lang-flag'), icon = document.querySelector('link[rel="icon"]');
    if (el) el.classList.toggle('square', !PG.code);
    if (!PG.code) {
      if (el) { el.innerHTML = PG.LOGO; el.title = 'Polyglot'; }
      if (icon && PG.LOGO) icon.href = 'data:image/svg+xml,' + encodeURIComponent(PG.LOGO);
      return;
    }
    const svg = PG.flagSvg(PG.code, PG.variant()), vi = PG.variantInfo(PG.variant());
    if (el) { el.innerHTML = svg; el.title = 'Ви вчите ' + (vi ? vi.acc + ' ' : '') + N().acc + ' — змінити мову'; }
    if (icon) icon.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  }
  // Колір кнопок і посилань — з реєстру мови: так видно, яку мову зараз відкрито
  function applyTheme() {
    const info = PG.langInfo(PG.code), th = info && info.theme;
    let el = document.getElementById('lang-theme');
    if (!el) { el = document.createElement('style'); el.id = 'lang-theme'; document.head.appendChild(el); }
    el.textContent = th ? ':root{--blue:' + th.light + '}@media (prefers-color-scheme:dark){:root{--blue:' + th.dark + '}}' : '';
  }
  function applyLang() {
    document.documentElement.dataset.lang = PG.code || '';
    const name = $('#lang-name');
    if (name) name.textContent = PG.code ? PG.langInfo(PG.code).name : '';
    applyFlag();
    applyTheme();
    document.body.classList.toggle('no-lang', !PG.code);
    if (PG.code) PG.TTS.load();
  }
  PG.applyLang = applyLang;
  PG.switchLang = async function (code) {
    try {
      PG.TTS.stop();
      await PG.activate(code);
    } catch (e) {
      console.error(e);
      PG.toast('⚠️ ' + (e && e.message || e), 6000);
      route();
      return;
    }
    applyLang();
    PG.toast(PG.L.ui.hello.replace(/\s*👋/, '') + ' Тепер ви вчите ' + N().acc + '.');
    if (location.hash === '#/today') route(); else location.hash = '#/today';
  };

  function route(keepScroll) {
    const y = window.scrollY;
    document.onkeydown = null;
    if (PG.Rec.active()) PG.Rec.stop();
    const parts = (location.hash || '#/today').replace(/^#\//, '').split('/');
    let page = parts[0] || 'today';
    // Поки мову не вибрано, будь-яка адреса веде на вибір мови: без пакета іншим екранам нічого показати
    if (!PG.L) page = 'languages';
    const owner = { lesson: 'lessons', drill: 'lessons' }[page] || page;
    $$('nav.tabs a').forEach((a) => a.classList.toggle('active', a.dataset.page === owner));
    const V = PG.views;
    try {
      if (page === 'languages') V.renderLanguages();
      else if (page === 'program') V.renderProgram();
      else if (page === 'lessons') V.renderLessons();
      else if (page === 'lesson') V.renderLesson(parts[1], parts[2]);
      else if (page === 'words') renderWords(parts[1], parts[2]);
      else if (page === 'dict') PG.renderDict(parts[1]);
      else if (page === 'speak') renderSpeak();
      else if (page === 'drill') renderDrill(parts[1]);
      else if (page === 'ref') renderRef();
      else if (page === 'settings') renderSettings();
      else V.renderToday();
    } catch (e) {
      console.error(e);
      view().innerHTML = '<div class="card"><h2>Щось пішло не так</h2><pre class="small">' + esc(e && e.stack || e) + '</pre></div>';
    }
    window.scrollTo(0, keepScroll ? y : 0);
  }
  PG.route = route;
  const currentPage = () => (location.hash || '').replace(/^#\//, '').split('/')[0];
  // Учень, що саме набирає слово у формі словника чи імпорту, не має втратити текст через перемальовування
  const typing = () => { const a = document.activeElement; return !!(a && /^(INPUT|TEXTAREA)$/.test(a.tagName) && a.value); };

  // Нова версія вже керує сторінкою (sw.js робить skipWaiting), але відкритий екран ще зі старим кодом
  function showUpdateBar() {
    if (document.querySelector('.update-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'update-bar';
    bar.innerHTML = '🔄 Вийшла нова версія тренажера <button class="btn small primary">Оновити</button>';
    bar.querySelector('button').onclick = () => location.reload();
    document.body.appendChild(bar);
  }
  // У src/ (розробка) PG.BUILD немає: там service worker закешував би окремі файли й ховав би свіжі правки
  function registerWorker() {
    if (!PG.BUILD || !('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'activated' && e.data.version !== PG.BUILD) showUpdateBar();
    });
    navigator.serviceWorker.register('sw.js').then((reg) => {
      // Встановлений додаток на телефоні може жити днями без перезавантаження — перевіряємо оновлення при кожному поверненні
      document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
    }).catch((e) => console.warn('Service worker не зареєстровано', e));
  }

  async function init() {
    const logo = document.getElementById('app-logo');
    PG.LOGO = logo ? logo.innerHTML : '';
    const nav = document.getElementById('nav'), header = document.querySelector('header.top');
    nav.innerHTML = PG.views.NAV.map((n) => '<a href="#/' + n[0] + '" data-page="' + n[0] + '" title="' + n[2] + '"' + (n[4] ? ' class="wide-only"' : '') + '><span>' + n[1] + '</span> <span class="lbl">' + n[2] + '</span><span class="lbl-s">' + n[3] + '</span></a>').join('');
    // Ширина підписів залежить від шрифту й емодзі системи, тож місце не вгадується брейкпоінтом, а вимірюється
    const fitNav = () => {
      header.classList.remove('nav-compact', 'nav-tight');
      if (matchMedia('(max-width:700px)').matches) return;
      for (const c of ['nav-compact', 'nav-tight']) { if (nav.scrollWidth <= nav.clientWidth + 1) break; header.classList.add(c); }
    };
    let fitting = 0;
    window.addEventListener('resize', () => { cancelAnimationFrame(fitting); fitting = requestAnimationFrame(fitNav); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
    document.addEventListener('click', (e) => {
      const el = e.target.closest('.say');
      if (el) PG.TTS.say(el.dataset.say);
    });
    // Список голосів і інтернет з'являються/зникають після рендеру. Повний перерендер — лише в налаштуваннях:
    // на інших екранах він збив би таймер або вправу, тож там лише додаємо чи прибираємо банер
    let lastState = null;
    PG.TTS.listeners.push(() => {
      if (!PG.L) return;
      const state = PG.code + ':' + PG.TTS.voices.length + ':' + (PG.TTS.settled ? 1 : 0) + ':' + navigator.onLine;
      if (lastState === null) { lastState = state; return; }
      if (state === lastState) return;
      lastState = state;
      if (currentPage() === 'settings') { route(true); return; }
      const b = document.querySelector('.voice-banner'), show = PG.TTS.silent();
      if (show && !b) view().insertAdjacentHTML('afterbegin', PG.views.voiceBanner());
      else if (!show && b) b.remove();
    });
    // Відповідь браузера про сховище й можливість встановлення приходять уже після першого рендеру
    const envChanged = () => { if (!PG.L) return; if (currentPage() === 'settings') route(true); else PG.fillInstallTip(); };
    PG.Storage.listeners.push(envChanged);
    PG.Install.listeners.push(envChanged);
    // Прогрес змінився в іншій вкладці. Прихована вкладка перемальовується, лише коли до неї повернуться:
    // інакше вона, наприклад, почала б озвучувати картку слова у фоні
    let stale = false;
    PG.onExternalChange = () => { if (document.hidden || typing()) stale = true; else route(true); };
    document.addEventListener('visibilitychange', () => { if (!document.hidden && stale) { stale = false; route(true); } });
    window.addEventListener('hashchange', () => route());
    applyLang();
    fitNav();
    let failed = false;
    if (PG.A.lang) {
      try { await PG.activate(PG.A.lang); } catch (e) {
        // Без інтернету й без кешу пакет не завантажиться: учень має бачити причину, а не порожній вибір мови
        failed = true;
        console.error(e);
        view().innerHTML = '<div class="card"><h2>Не вдалося відкрити мову</h2><p>' + esc(e && e.message || e) + '</p><div class="row"><button class="btn primary" onclick="location.reload()">Спробувати ще раз</button><a class="btn" href="#/languages">Інша мова</a></div></div>';
      }
    }
    applyLang();
    PG.TTS.init();
    if (PG.S && !PG.S.start) { PG.S.start = PG.today(); PG.save(); }
    if (!failed) route();
    fitNav();
    PG.Storage.check(true);
    registerWorker();
  }
  document.addEventListener('DOMContentLoaded', init);
})(window.PG);
