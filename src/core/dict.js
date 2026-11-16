/* Мій словник: додавання, редагування, транскрипція й записи носіїв (якщо пакет мови їх уміє шукати), експорт та імпорт.
 * Розбір і злиття імпорту — без DOM, тому validate.mjs перевіряє їх у Node. Екрани — у dictview.js */
window.PG = window.PG || {};
(function (PG) {
  'use strict';
  const FORMAT = 'polyglot-dictionary';
  const FORMAT_VERSION = 1;
  const key = (w) => PG.dictKey(w);
  const cid = (w) => PG.cardId('my', w);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  // Ліміт захищає localStorage (~5 МБ на сайт, спільні для всіх мов) від випадково вставленого величезного файлу
  const MAX_WORDS = 20000;
  const L = () => PG.L.dict || {};

  const Dict = {
    FORMAT, MAX_WORDS,
    list() { return PG.S.dict; },
    index(word) { const k = key(word); return PG.S.dict.findIndex((w) => key(w.word) === k); },
    get(word) { return PG.S.dict[this.index(word)] || null; },
    canLookup() { return typeof L().lookup === 'function'; },

    // Повертає { ok, word } або { ok: false, reason: 'empty' | 'dup' | 'full', word? }
    add(fields) {
      const w = PG.cleanWord(Object.assign({}, fields, { added: PG.isoDay(PG.today()) }));
      if (!w) return { ok: false, reason: 'empty' };
      const old = this.get(w.word);
      if (old) return { ok: false, reason: 'dup', word: old };
      if (PG.S.dict.length >= MAX_WORDS) return { ok: false, reason: 'full' };
      PG.S.dict.push(w);
      PG.save();
      return { ok: true, word: w };
    },
    // Нове написання переносить і прогрес повторення: id картки містить саме слово
    update(oldWord, fields) {
      const i = this.index(oldWord);
      if (i < 0) return { ok: false, reason: 'missing' };
      const cur = PG.S.dict[i];
      const w = PG.cleanWord(Object.assign({}, cur, fields));
      if (!w) return { ok: false, reason: 'empty' };
      const j = this.index(w.word);
      if (j >= 0 && j !== i) return { ok: false, reason: 'dup', word: PG.S.dict[j] };
      if (w.word !== cur.word) {
        if (key(w.word) !== key(cur.word)) { delete w.ipa; delete w.au; }
        const card = PG.S.cards[cid(cur.word)];
        delete PG.S.cards[cid(cur.word)];
        if (card) PG.S.cards[cid(w.word)] = card;
      }
      PG.S.dict[i] = w;
      PG.save();
      return { ok: true, word: w };
    },
    remove(word) {
      const i = this.index(word);
      if (i < 0) return false;
      const w = PG.S.dict.splice(i, 1)[0];
      delete PG.S.cards[cid(w.word)];
      PG.save();
      return true;
    },
    clear() {
      for (const w of PG.S.dict) delete PG.S.cards[cid(w.word)];
      PG.S.dict = [];
      PG.save();
    },
    card(word) { return PG.S.cards[cid(word)] || null; },

    // undefined — сервіс не відповів; null — слова в базі немає (або мова не вміє шукати)
    async lookup(word) { return this.canLookup() ? L().lookup(word) : null; },
    // Слова без транскрипції чи запису (наприклад, після імпорту) доповнюються по черзі: у сервісу ліміт запитів
    missing() { return this.canLookup() ? PG.S.dict.filter((w) => !w.ipa).map((w) => w.word) : []; },
    async enrichAll(onStep, stop) {
      const list = this.missing();
      let fails = 0, found = 0;
      for (let i = 0; i < list.length && !(stop && stop()); i++) {
        const r = await this.enrich(list[i]);
        if (r === undefined) { if (++fails >= 3) break; } else { fails = 0; if (r) found++; }
        if (onStep) onStep(i + 1, list.length, found);
        await new Promise((ok) => setTimeout(ok, 250));
      }
      return { found, total: list.length, offline: fails >= 3 };
    },
    // Дописує транскрипцію (якщо її немає) і записи носіїв до слова зі словника
    async enrich(word) {
      const r = await this.lookup(word);
      if (!r) return r;
      const i = this.index(word);
      if (i < 0) return r;
      const w = PG.S.dict[i];
      const next = Object.assign({}, w, { ipa: w.ipa || r.ipa, au: r.au || w.au });
      PG.S.dict[i] = PG.cleanWord(next) || w;
      PG.save();
      return r;
    },
    // Запис носія потрібного варіанта, а якщо його немає — будь-який (австралійський теж краще за синтез)
    nativeUrl(w, variant) {
      const au = w && w.au;
      if (!au) return null;
      return (variant && au[variant]) || au[Object.keys(au)[0]] || null;
    },

    toJson(withProgress) {
      const words = PG.S.dict.map((w) => {
        const out = clone(w);
        const c = withProgress && this.card(w.word);
        if (c) out.card = clone(c);
        return out;
      });
      return JSON.stringify({ format: FORMAT, version: FORMAT_VERSION, app: 'Polyglot', lang: PG.code, exported: new Date().toISOString(), count: words.length, words }, null, 1);
    },
    toCsv() {
      const q = (s) => (/[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
      const rows = [[L().csvHeader || PG.code, 'ukrainian', 'note', 'example', 'ipa']].concat(PG.S.dict.map((w) => [w.word, w.uk, w.note || '', w.ex || '', w.ipa || '']));
      return rows.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n';
    },
    // Табуляція — роздільник, який Excel і Google Таблиці розпізнають у будь-якій мовній локалі
    toTsv() {
      const t = (s) => String(s || '').replace(/[\t\r\n]+/g, ' ');
      return [PG.cap(PG.L.names.ins) + '\tУкраїнською\tПримітка\tПриклад\tТранскрипція'].concat(PG.S.dict.map((w) => [w.word, w.uk, w.note, w.ex, w.ipa].map(t).join('\t'))).join('\n');
    },
    fileName(ext) { return 'polyglot-' + PG.code + '-dictionary-' + PG.isoDay(PG.today()) + '.' + ext; },

    // Розбір імпорту → { kind, lang?, rows: [{word, uk, note?, ex?, ipa?, au?, added?, card?}], bad: [{line, text}] }
    parse(text, filename) {
      text = String(text || '').replace(/^﻿/, '');
      const t = text.trim();
      if (!t) return { kind: 'empty', rows: [], bad: [] };
      if (/^[[{]/.test(t)) {
        try { return Dict.parseJson(JSON.parse(t)); } catch (e) { return { kind: 'json', rows: [], bad: [{ line: 0, text: 'Файл схожий на JSON, але не читається: ' + e.message }] }; }
      }
      const ext = String(filename || '').toLowerCase().split('.').pop();
      const first = t.split(/\r?\n/)[0];
      if (first.includes('\t') || ext === 'tsv') return Dict.parseTable(t, '\t');
      if (ext === 'csv') return Dict.parseTable(t, (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',');
      return Dict.parseText(t);
    },
    // Приймає й словники з інших програм: поле слова — word / term / front / target чи назва мови (headers пакета)
    parseJson(data) {
      const list = Array.isArray(data) ? data : data && (Array.isArray(data.words) ? data.words : Array.isArray(data.dict) ? data.dict : null);
      if (!list) return { kind: 'json', rows: [], bad: [{ line: 0, text: 'У файлі немає списку слів (очікувалося поле words)' }] };
      const pickKey = (o, names) => { for (const n of Object.keys(o)) if (names.includes(n.toLowerCase())) return o[n]; return undefined; };
      const rows = [], bad = [], W = wordNames();
      list.forEach((item, i) => {
        let w = null;
        if (Array.isArray(item)) w = { word: item[0], uk: item[1], note: item[2], ex: item[3], ipa: item[4] };
        else if (item && typeof item === 'object') {
          w = { word: pickKey(item, W), uk: pickKey(item, UK_NAMES), note: pickKey(item, NOTE_NAMES), ex: pickKey(item, EX_NAMES), ipa: pickKey(item, IPA_NAMES), au: item.au, added: item.added };
          const card = PG.cleanCard(item.card);
          if (card) w.card = card;
        }
        const c = w && PG.cleanWord(w);
        if (c) { if (w.card) c.card = w.card; rows.push(c); } else bad.push({ line: i + 1, text: JSON.stringify(item).slice(0, 80) });
      });
      const lang = data && !Array.isArray(data) && typeof data.lang === 'string' ? data.lang : null;
      return { kind: 'json', lang, rows, bad };
    },
    // CSV за RFC 4180: лапки, подвоєні лапки й переноси рядків усередині лапок
    splitCsv(text, d) {
      const rows = [];
      let row = [], cell = '', q = false;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (q) {
          if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch;
        } else if (ch === '"' && cell === '') q = true;
        else if (ch === d) { row.push(cell); cell = ''; }
        else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
        else cell += ch;
      }
      if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
      return rows;
    },
    parseTable(text, d) {
      const table = Dict.splitCsv(text, d).filter((r) => r.some((c) => c.trim()));
      const W = wordNames();
      let cols = { word: 0, uk: 1, note: 2, ex: 3, ipa: 4 }, start = 0;
      const head = (table[0] || []).map((c) => c.trim().toLowerCase());
      if (head.length && (W.includes(head[0]) || head.some((h) => UK_NAMES.includes(h)))) {
        const find = (names, def) => { const i = head.findIndex((h) => names.includes(h)); return i >= 0 ? i : def; };
        cols = { word: find(W, 0), uk: find(UK_NAMES, 1), note: find(NOTE_NAMES, -1), ex: find(EX_NAMES, -1), ipa: find(IPA_NAMES, -1) };
        start = 1;
      }
      const rows = [], bad = [];
      for (let i = start; i < table.length; i++) {
        const r = table[i], get = (k) => (cols[k] >= 0 ? r[cols[k]] : '');
        const w = PG.cleanWord({ word: get('word'), uk: get('uk'), note: get('note'), ex: get('ex'), ipa: get('ipa') });
        if (w) rows.push(w); else bad.push({ line: i + 1, text: r.join(d === '\t' ? ' ⇥ ' : d).slice(0, 80) });
      }
      return { kind: d === '\t' ? 'tsv' : 'csv', rows, bad };
    },
    // Вільний текст: по слову на рядок, роздільник — перший знайдений з SEPARATORS
    parseText(text) {
      const rows = [], bad = [];
      text.split(/\r?\n/).forEach((raw, i) => {
        const line = raw.replace(/^\s*(?:\d+[.)]|[-•*–])\s+/, '').trim();
        if (!line || line.startsWith('#')) return;
        let w = null;
        for (const sep of SEPARATORS) {
          const at = line.indexOf(sep);
          if (at > 0) { w = PG.cleanWord({ word: line.slice(0, at), uk: line.slice(at + sep.length) }); break; }
        }
        if (w) rows.push(w); else bad.push({ line: i + 1, text: line.slice(0, 80) });
      });
      return { kind: 'text', rows, bad };
    },

    // План злиття: що нове, що вже є з тим самим перекладом, що з іншим, що повторюється в самому файлі
    plan(parsed) {
      const fresh = [], same = [], conflict = [], seen = new Set();
      let dup = 0;
      for (const row of parsed.rows) {
        const k = key(row.word);
        if (seen.has(k)) { dup++; continue; }
        seen.add(k);
        const cur = this.get(row.word);
        if (!cur) fresh.push(row);
        else if (PG.norm(cur.uk) === PG.norm(row.uk)) same.push({ row, cur });
        else conflict.push({ row, cur });
      }
      return { fresh, same, conflict, dup, bad: parsed.bad, kind: parsed.kind, lang: parsed.lang || null, withCards: parsed.rows.some((r) => r.card) };
    },
    // conflict: 'keep' | 'replace' | 'merge'; progress — брати прогрес повторення з файлу. Повертає підсумок і знімок для скасування
    apply(plan, opts) {
      opts = Object.assign({ conflict: 'keep', progress: true }, opts);
      const snapshot = { dict: clone(PG.S.dict), cards: {} };
      for (const k of Object.keys(PG.S.cards)) if (k.startsWith('my|')) snapshot.cards[k] = clone(PG.S.cards[k]);
      let added = 0, updated = 0, filled = 0;
      const room = Math.max(0, MAX_WORDS - PG.S.dict.length);
      const takeCard = (row, word) => {
        if (!opts.progress || !row.card) return;
        const old = PG.S.cards[cid(word)];
        if (!old || (!old.reps && row.card.reps)) PG.S.cards[cid(word)] = clone(row.card);
      };
      // Порожні поля мого слова заповнюються з файлу; заповнені — не чіпаємо
      const fill = (cur, row) => {
        let n = 0;
        for (const f of ['note', 'ex', 'ipa']) if (!cur[f] && row[f]) { cur[f] = row[f]; n++; }
        if (!cur.au && row.au) { cur.au = row.au; n++; }
        return n;
      };
      for (const row of plan.fresh.slice(0, room)) {
        const w = Object.assign({}, row);
        delete w.card;
        if (!w.added) w.added = PG.isoDay(PG.today());
        PG.S.dict.push(w);
        takeCard(row, w.word);
        added++;
      }
      for (const { row } of plan.same) {
        const cur = this.get(row.word);
        if (fill(cur, row)) filled++;
        takeCard(row, cur.word);
      }
      for (const { row } of plan.conflict) {
        const cur = this.get(row.word);
        if (opts.conflict === 'replace') { cur.uk = row.uk; updated++; } else if (opts.conflict === 'merge') {
          const parts = cur.uk.split(/\s*;\s*/);
          if (!parts.some((p) => PG.norm(p) === PG.norm(row.uk))) { cur.uk = (cur.uk + '; ' + row.uk).slice(0, 300); updated++; }
        }
        if (fill(cur, row)) filled++;
        takeCard(row, cur.word);
      }
      PG.save();
      return { added, updated, filled, skipped: plan.fresh.length - Math.min(plan.fresh.length, room), snapshot };
    },
    undo(snapshot) {
      for (const k of Object.keys(PG.S.cards)) if (k.startsWith('my|')) delete PG.S.cards[k];
      Object.assign(PG.S.cards, snapshot.cards);
      PG.S.dict = snapshot.dict;
      PG.save();
    },

    // Тренування: диктант (почути й написати), переклад українська → мова навчання, вибір перекладу
    practiceSpecs(n) {
      const all = PG.S.dict;
      if (!all.length) return [];
      const t = PG.today(), ins = PG.L.names.ins;
      // Спершу слова, які пора повторити, і нові: їх тренувати найкорисніше
      const rank = (w) => { const c = this.card(w.word); return !c ? 1 : c.due <= t ? 0 : 2; };
      const pool = PG.shuffle(all).sort((a, b) => rank(a) - rank(b)).slice(0, n || 10);
      return pool.map((w) => {
        const answers = Dict.answers(w.word);
        const types = ['i'];
        if (!/\s\/\s/.test(w.word)) types.push('l');
        const others = PG.shuffle(all.filter((x) => PG.norm(x.uk) !== PG.norm(w.uk))).map((x) => x.uk).filter((u, i, a) => a.indexOf(u) === i).slice(0, 2);
        if (others.length === 2) types.push('c');
        const type = types[Math.floor(Math.random() * types.length)];
        const note = w.note ? ' <span class="small muted">(' + PG.esc(w.note) + ')</span>' : '';
        const e = PG.sayHtml(w.word, PG.sayText(w.word)) + (w.ipa ? ' <span class="ipa">' + PG.esc(w.ipa) + '</span>' : '') + ' — ' + PG.esc(w.uk);
        // nv: слова учня показуються так, як він їх записав, без заміни правопису під варіант мови
        if (type === 'c') return { t: 'c', q: 'Що означає ' + PG.sayHtml(w.word, PG.sayText(w.word)) + '?', o: [w.uk].concat(others), e, nv: true };
        if (type === 'l') return { t: 'l', a: answers, say: PG.sayText(w.word), tr: w.uk, h: 'Прослухайте й напишіть ' + ins, nv: true };
        return { t: 'i', q: 'Як ' + ins + ': <b>' + PG.esc(w.uk) + '</b>?' + note, a: answers, e, nv: true };
      });
    },
    // Прийнятні відповіді для слова: варіанти через « / », без приміток у дужках, плюс форми від пакета («book» для «to book»)
    answers(word) {
      const out = new Set(), forms = L().answerForms;
      for (const part of String(word).split(/\s\/\s/)) {
        const p = part.trim(), plain = p.replace(/\s*\([^)]*\)/g, '').trim();
        [p, plain].forEach((x) => { if (!x) return; out.add(x); if (forms) forms(x).forEach((f) => out.add(f)); });
      }
      out.add(word);
      return Array.from(out);
    }
  };
  // Колонка зі словом мови впізнається і за спільними назвами, і за назвами мови з пакета (english, slovak, словацькою…)
  const wordNames = () => ['word', 'term', 'front', 'target', 'слово'].concat(L().headers || []);
  const UK_NAMES = ['ukrainian', 'uk', 'ua', 'translation', 'back', 'definition', 'meaning', 'переклад', 'українською', 'українська', 'укр'];
  const NOTE_NAMES = ['note', 'notes', 'comment', 'примітка', 'примітки', 'коментар'];
  const EX_NAMES = ['example', 'examples', 'sentence', 'context', 'ex', 'приклад', 'речення'];
  const IPA_NAMES = ['ipa', 'transcription', 'pronunciation', 'phonetic', 'транскрипція', 'вимова'];
  // Порядок важливий: « — » і « - » раніше за «;» і «,», бо переклад часто містить коми («квартира, житло»)
  const SEPARATORS = [' — ', ' – ', ' - ', '\t', ' ; ', ';', ' = ', '=', ' : ', ','];

  // Завантаження файлу, «Поділитися» і буфер обміну потребують браузера; у Node (validate.mjs) їх не викликають
  Dict.download = function (name, text, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  Dict.canShareFiles = function () {
    try { return !!(navigator.canShare && navigator.canShare({ files: [new File(['{}'], 'x.json', { type: 'application/json' })] })); } catch (e) { return false; }
  };
  Dict.share = function (name, text, mime) {
    return navigator.share({ files: [new File([text], name, { type: mime })], title: 'Polyglot — мій словник (' + PG.L.names.nom + ')' });
  };
  Dict.copy = async function (text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
      return ok;
    }
  };

  PG.Dict = Dict;
})(window.PG);
