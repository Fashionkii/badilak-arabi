(function () {
  'use strict';
  const $ = id => document.getElementById(id), R = window.StudioRenderer;
  const offline = JSON.parse(document.getElementById('offlineData')?.textContent || 'null');
  const ENDPOINT = '/admin/studio';
  let bootstrap, project, selected, busy = false, sequence = 0, selectionSequence = 0, lastReport;
  let history = [], future = [], saveTimer, toastTimer, lastSnapshot;
  const assetCache = new Map(), bitmapCache = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  const template = () => bootstrap.templates.find(t => t.id === selected);
  const jsonEscape = value => JSON.stringify(value).replace(/</g, '\\u003c');
  function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 4200); }
  function download(blob, name) { const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000); }
  function dataUri(blob) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('تعذّر قراءة الملف.')); reader.readAsDataURL(blob); }); }
  async function fetchText(asset) { const r = await fetch(ENDPOINT + '?asset=' + encodeURIComponent(asset), { credentials: 'same-origin' }); if (!r.ok) throw new Error('تعذّر تحميل موارد القالب.'); return r.text(); }
  async function resolveAsset(key) {
    if (assetCache.has(key)) return assetCache.get(key);
    const task = (async () => {
      if (offline?.assetData[key]) return offline.assetData[key];
      const meta = bootstrap.assets[key]; if (!meta) throw new Error('الصورة غير موجودة في القالب.');
      const r = await fetch(ENDPOINT + '?asset=' + encodeURIComponent(meta.file), { credentials: 'same-origin' });
      if (r.status === 401) { location.assign(ENDPOINT); throw new Error('انتهت جلسة الإدارة.'); }
      if (!r.ok) throw new Error('تعذّر تحميل إحدى صور القالب.');
      return dataUri(await r.blob());
    })();
    assetCache.set(key, task);
    try { return await task; } catch (error) { assetCache.delete(key); throw error; }
  }
  function bitmap(src) {
    if (!bitmapCache.has(src)) {
      const task = new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error('تعذّر فتح الصورة.')); image.src = src; });
      bitmapCache.set(src, task); if (bitmapCache.size > 45) bitmapCache.delete(bitmapCache.keys().next().value);
    }
    return bitmapCache.get(src);
  }
  const db = new Promise(resolve => {
    try {
      const request = indexedDB.open('badilak_design_studio_v1', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('drafts');
      request.onsuccess = () => resolve(request.result); request.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
  async function draft(action, key, value) {
    const store = await db; if (!store) return null;
    return new Promise(resolve => {
      try {
        const tx = store.transaction('drafts', action === 'get' ? 'readonly' : 'readwrite'), table = tx.objectStore('drafts');
        const request = action === 'get' ? table.get(key) : action === 'put' ? table.put(value, key) : table.delete(key);
        request.onsuccess = () => resolve(action === 'get' ? request.result : true); request.onerror = () => resolve(null);
      } catch { resolve(null); }
    });
  }
  async function saveNow(snapshot = clone(project)) {
    clearTimeout(saveTimer);
    const saved = await draft('put', snapshot.template, snapshot);
    $('draftState').textContent = saved ? 'تم الحفظ في هذا المتصفح' : 'استخدم حفظ ملف المشروع للاحتفاظ بعملك';
  }
  function changed() {
    history.push(lastSnapshot); if (history.length > 35) history.shift(); future = [];
    lastSnapshot = clone(project); $('undo').disabled = history.length === 0; $('redo').disabled = true;
    clearTimeout(saveTimer); const snapshot = clone(project); saveTimer = setTimeout(() => saveNow(snapshot), 650);
    $('draftState').textContent = 'جارٍ حفظ المسودة…'; render();
  }
  async function render() {
    const current = ++sequence, snapshot = clone(project), t = template();
    try {
      await document.fonts.ready;
      const temporary = document.createElement('canvas'); temporary.width = R.W; temporary.height = R.H;
      const report = await R.draw(temporary.getContext('2d'), t, snapshot, resolveAsset, bitmap);
      if (current !== sequence) return;
      $('preview').getContext('2d').drawImage(temporary, 0, 0);
      $('preview').setAttribute('aria-label', snapshot.copy[snapshot.lang].title);
      lastReport = report;
      const names = { title: 'العنوان', subtitle: 'السطر المساند', footer: 'السطر السفلي', cta: 'الدعوة' };
      $('fitMessage').textContent = report.overflow.length ? 'اختصر النص أو اضبط حجمه قبل التصدير: ' + report.overflow.map(x => names[x.id] || (x.id.startsWith('name') ? 'اسم إحدى البطاقات' : 'وصف إحدى البطاقات')).join('، ') : '';
      for (const id of ['exportPng', 'exportSvg', 'exportHtml']) $(id).disabled = busy || report.overflow.length > 0;
    } catch (error) { if (current === sequence) { $('fitMessage').textContent = error.message; for (const id of ['exportPng', 'exportSvg', 'exportHtml']) $(id).disabled = true; } }
  }
  function field(parent, label, value, max, apply, rows = 1) {
    const wrap = document.createElement('label'); wrap.className = 'field';
    const name = document.createElement('span'); name.textContent = label;
    const input = document.createElement(rows > 1 ? 'textarea' : 'input'); input.value = value; input.maxLength = max; input.dir = project.lang === 'ar' ? 'rtl' : 'ltr';
    if (rows > 1) input.rows = rows;
    input.addEventListener('input', () => { apply(input.value); changed(); }); wrap.append(name, input); parent.append(wrap);
  }
  function fields() {
    const c = project.copy[project.lang]; $('textFields').replaceChildren();
    field($('textFields'), 'العنوان الرئيسي', c.title, 120, value => c.title = value, 2);
    field($('textFields'), 'السطر المساند', c.subtitle, 190, value => c.subtitle = value, 2);
    c.cards.forEach((card, i) => { const group = document.createElement('fieldset'); group.className = 'card-fields'; const legend = document.createElement('legend'); legend.textContent = 'البطاقة ' + (i + 1); group.append(legend); field(group, 'الاسم أو الخطوة', card[0], 80, value => card[0] = value); field(group, 'الوصف القصير', card[1], 150, value => card[1] = value, 2); $('textFields').append(group); });
    field($('textFields'), 'السطر أسفل البطاقات', c.footer, 150, value => c.footer = value);
    field($('textFields'), 'الدعوة إلى الزيارة', c.cta, 80, value => c.cta = value);
    $('langAr').setAttribute('aria-pressed', String(project.lang === 'ar')); $('langEn').setAttribute('aria-pressed', String(project.lang === 'en'));
    $('templateSelect').value = selected; $('templateDescription').textContent = template().description;
    $('scaleFields').replaceChildren();
    for (const [key, label] of [['title', 'حجم العنوان'], ['names', 'أسماء البطاقات'], ['descriptions', 'الأوصاف']]) {
      const wrap = document.createElement('label'); wrap.className = 'scale-control';
      const line = document.createElement('span'), name = document.createElement('span'), output = document.createElement('output'); name.textContent = label; output.textContent = Math.round(project.scales[key] * 100) + '%'; line.append(name, output);
      const slider = document.createElement('input'); slider.type = 'range'; slider.min = '.9'; slider.max = '1.08'; slider.step = '.01'; slider.value = project.scales[key];
      slider.addEventListener('input', () => { project.scales[key] = Number(slider.value); output.textContent = Math.round(project.scales[key] * 100) + '%'; changed(); }); wrap.append(line, slider); $('scaleFields').append(wrap);
    }
    for (const key of ['x', 'y', 'zoom']) $('focus' + (key === 'zoom' ? 'Zoom' : key.toUpperCase())).value = project.focus[key];
    $('undo').disabled = history.length === 0; $('redo').disabled = future.length === 0;
  }
  async function select(id) {
    const currentSelection = ++selectionSequence;
    ++sequence;
    for (const id of ['exportPng', 'exportSvg', 'exportHtml']) $(id).disabled = true;
    if (project) await saveNow();
    const stored = await draft('get', id);
    if (currentSelection !== selectionSequence) return;
    selected = id;
    try { project = offline?.project?.template === id ? R.normalize(offline.project, bootstrap.templates) : stored ? R.normalize(stored, bootstrap.templates) : R.defaults(template()); }
    catch { project = R.defaults(template()); }
    history = []; future = []; lastSnapshot = clone(project); fields();
    await draft('put', '__selected__', id);
    $('draftState').textContent = stored ? 'تم استرجاع المسودة المحلية' : 'قالب جديد — جاهز للتعديل'; render();
  }
  async function imageInput(file, key) {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 6 * 1024 * 1024) throw new Error('اختر PNG أو JPG أو WebP لا تتجاوز 6 ميغابايت.');
    const src = await dataUri(file), im = await bitmap(src);
    if (im.naturalWidth * im.naturalHeight > 24 * 1024 * 1024 || im.naturalWidth < 50 || im.naturalHeight < 50) throw new Error('أبعاد الصورة غير مناسبة.');
    project.images[key] = src; if (key === 'scene') project.focus = { x: 50, y: 50, zoom: 1 }; fields(); changed();
  }
  async function importProject(raw) {
    const value = JSON.parse(raw), candidate = R.normalize(value.project || value, bootstrap.templates);
    for (const src of Object.values(candidate.images)) { const im = await bitmap(src); if (im.naturalWidth * im.naturalHeight > 24 * 1024 * 1024) throw new Error('صورة داخل الملف كبيرة جدًا.'); }
    project = candidate; selected = project.template;
    history = []; future = []; lastSnapshot = clone(project); fields(); await saveNow(); render(); toast('تم فتح المشروع.');
  }
  function copyExample() {
    const c = project.copy[project.lang];
    return { template: selected, lang: project.lang, copy: { title: c.title, subtitle: c.subtitle, footer: c.footer, cta: c.cta }, cards: c.cards.map(([name, description]) => ({ name, description })) };
  }
  function applyCopy(raw) {
    const value = JSON.parse(raw); if (value.template !== selected || !['ar', 'en'].includes(value.lang) || !Array.isArray(value.cards) || value.cards.length !== 3) throw new Error('اختر القالب المطابق وتأكد من وجود ثلاث بطاقات.');
    const next = clone(project); next.lang = value.lang;
    next.copy[value.lang] = { ...value.copy, cards: value.cards.map(c => [c.name, c.description]) };
    project = R.normalize(next, bootstrap.templates); fields(); changed(); toast('تم تطبيق النصوص. راجع الأسماء والادعاءات.');
  }
  async function withExport(button, work) {
    if (busy || !lastReport || lastReport.overflow.length) return;
    busy = true; const label = button.textContent; button.textContent = 'جارٍ التجهيز…';
    for (const id of ['exportPng', 'exportSvg', 'exportHtml']) $(id).disabled = true;
    try { await work(clone(project), template()); } catch (error) { toast(error.message || 'تعذّر التصدير.'); }
    finally { busy = false; button.textContent = label; render(); }
  }
  let embeddedFonts;
  async function fonts() {
    if (embeddedFonts) return embeddedFonts;
    embeddedFonts = (async () => {
      if (offline?.fontCss) return { css: offline.fontCss, license: offline.fontLicense };
      const fontData = async name => { const r = await fetch(ENDPOINT + '?asset=' + name); if (!r.ok) throw new Error('تعذّر تحميل ملف الخط.'); return dataUri(await r.blob()); };
      const values = await Promise.all([fontData('font-400.woff2'), fontData('font-700.woff2'), fetchText('OFL.txt')]);
      return { css: `@font-face{font-family:StudioFont;src:url("${values[0]}");font-weight:400}@font-face{font-family:StudioFont;src:url("${values[1]}");font-weight:700}`, license: values[2] };
    })();
    try { return await embeddedFonts; } catch (error) { embeddedFonts = null; throw error; }
  }
  async function offlineHtml(snapshot, t) {
    const used = new Set(['logo', t.scene, ...t.icons]), assetData = {};
    for (const key of used) assetData[key] = await resolveAsset(key);
    const f = await fonts();
    const source = offline?.sources || { html: await fetchText('shell.txt'), css: await fetchText('app.css'), renderer: await fetchText('renderer.js'), app: await fetchText('app.js') };
    const saved = { ...bootstrap, templates: [t], project: snapshot, assetData, fontCss: f.css, fontLicense: f.license, sources: source, session: null };
    const safeScript = value => value.replace(/<\/script/gi, '<\\/script');
    let html = source.html.replace('<link rel="stylesheet" href="/admin/studio?asset=app.css">', '<style>' + f.css + '\n' + source.css.replace(/@font-face\{[^}]+\}/g, '') + '</style>');
    html = html.replace('<script src="/admin/studio?asset=renderer.js" defer></script>', '').replace('<script src="/admin/studio?asset=app.js" defer></script>', '');
    html = html.replaceAll('src="/admin/studio?asset=logo.webp"', 'src="' + assetData.logo + '"');
    html = html.replace('</body>', '<script id="offlineData" type="application/json">' + jsonEscape(saved) + '</scr' + 'ipt><script>' + safeScript(source.renderer) + '</scr' + 'ipt><script>' + safeScript(source.app) + '</scr' + 'ipt></body>');
    return html;
  }
  async function init() {
    try {
      if (offline) bootstrap = offline;
      else { const r = await fetch(ENDPOINT + '?action=bootstrap', { credentials: 'same-origin' }); if (r.status === 401) { location.assign(ENDPOINT); return; } if (!r.ok) throw new Error('تعذّر تحميل الاستوديو.'); bootstrap = await r.json(); }
      await Promise.all([document.fonts.load('400 30px StudioFont'), document.fonts.load('700 59px StudioFont')]);
      $('accountLabel').textContent = offline ? 'قالب محلي قابل للتعديل' : 'للإدارة فقط · ' + bootstrap.session.username;
      for (const t of bootstrap.templates) { const option = document.createElement('option'); option.value = t.id; option.textContent = t.section + ' — ' + t.label; $('templateSelect').append(option); }
      $('templateSelect').disabled = false; $('templateSelect').addEventListener('change', e => select(e.target.value));
      for (const [id, lang] of [['langAr', 'ar'], ['langEn', 'en']]) $(id).addEventListener('click', () => { if (project.lang === lang) return; project.lang = lang; fields(); changed(); });
      const tabs = Array.from(document.querySelectorAll('[data-tab]'));
      function activate(tab) { tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; $('panel-' + item.dataset.tab).hidden = !active; }); }
      tabs.forEach((tab, index) => { tab.addEventListener('click', () => activate(tab)); tab.addEventListener('keydown', e => { if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return; e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (index + (e.key === 'ArrowLeft' ? 1 : -1) + tabs.length) % tabs.length; activate(tabs[next]); tabs[next].focus(); }); });
      $('sceneUpload').addEventListener('change', e => imageInput(e.target.files[0], 'scene').catch(x => toast(x.message)));
      for (let i = 0; i < 3; i++) { const label = document.createElement('label'); label.className = 'upload-box'; label.textContent = 'أيقونة البطاقة ' + (i + 1); const file = document.createElement('input'); file.type = 'file'; file.accept = 'image/png,image/jpeg,image/webp'; file.addEventListener('change', e => imageInput(e.target.files[0], 'icon' + i).catch(x => toast(x.message))); label.append(file); $('iconUploads').append(label); }
      for (const [id, key] of [['focusX', 'x'], ['focusY', 'y'], ['focusZoom', 'zoom']]) $(id).addEventListener('input', e => { project.focus[key] = Number(e.target.value); changed(); });
      $('restoreImages').onclick = () => { project.images = {}; project.focus = { x: 50, y: 50, zoom: 1 }; fields(); changed(); };
      $('restoreTemplate').onclick = () => { project = R.defaults(template()); fields(); changed(); toast('تمت الاستعادة. يمكنك التراجع.'); };
      $('newDraft').onclick = () => { project = R.defaults(template()); fields(); changed(); toast('بدأت مسودة جديدة. يمكنك التراجع.'); };
      $('deleteDraft').onclick = async () => { clearTimeout(saveTimer); await draft('delete', selected); project = R.defaults(template()); fields(); changed(); toast('حُذفت المسودة السابقة من هذا المتصفح.'); };
      $('undo').onclick = () => { if (!history.length) return; future.push(clone(project)); project = history.pop(); lastSnapshot = clone(project); fields(); saveNow(); render(); };
      $('redo').onclick = () => { if (!future.length) return; history.push(clone(project)); project = future.pop(); lastSnapshot = clone(project); fields(); saveNow(); render(); };
      $('saveProject').onclick = () => download(new Blob([JSON.stringify({ schema: 'badilak-studio/v1', project }, null, 2)], { type: 'application/json' }), 'badilak-' + selected + '.json');
      $('openProject').onclick = () => $('projectInput').click();
      $('projectInput').onchange = async e => { try { const f = e.target.files[0]; if (!f) return; if (f.size > 30 * 1024 * 1024) throw new Error('ملف المشروع أكبر من 30 ميغابايت.'); await importProject(await f.text()); } catch (x) { toast(x.message); } finally { e.target.value = ''; } };
      $('copySchema').onclick = async () => { const value = JSON.stringify(copyExample(), null, 2); $('jsonInput').value = value; try { await navigator.clipboard.writeText(value); toast('تم نسخ نموذج النصوص.'); } catch { toast('النموذج ظاهر في حقل النصوص للنسخ.'); } };
      $('importCopy').onclick = () => $('copyInput').click();
      $('copyInput').onchange = async e => { try { const f = e.target.files[0]; if (!f) return; if (f.size > 100 * 1024) throw new Error('ملف النصوص كبير جدًا.'); $('jsonInput').value = await f.text(); applyCopy($('jsonInput').value); } catch (x) { toast(x.message); } finally { e.target.value = ''; } };
      $('applyJson').onclick = () => { try { applyCopy($('jsonInput').value); } catch (x) { toast(x.message); } };
      $('exportPng').onclick = () => withExport($('exportPng'), async (snapshot, t) => { const scale = Number($('exportScale').value), canvas = document.createElement('canvas'); canvas.width = R.W * scale; canvas.height = R.H * scale; const ctx = canvas.getContext('2d'); ctx.scale(scale, scale); const report = await R.draw(ctx, t, snapshot, resolveAsset, bitmap); if (report.overflow.length) throw new Error('راجع النصوص التي تجاوزت مساحتها.'); const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')); if (!blob) throw new Error('تعذّر تجهيز PNG.'); download(blob, `badilak-${selected}-${snapshot.lang}.png`); });
      $('exportSvg').onclick = () => withExport($('exportSvg'), async (snapshot, t) => { const f = await fonts(), ctx = $('preview').getContext('2d'); const output = await R.svg(ctx, t, snapshot, resolveAsset, bitmap, f.css, f.license); download(new Blob([output], { type: 'image/svg+xml;charset=utf-8' }), `badilak-${selected}-${snapshot.lang}.svg`); });
      $('exportHtml').onclick = () => withExport($('exportHtml'), async (snapshot, t) => download(new Blob([await offlineHtml(snapshot, t)], { type: 'text/html;charset=utf-8' }), `badilak-${selected}-editable.html`));
      $('logout').onclick = async () => { if (offline) return; await saveNow(); try { const r = await fetch(ENDPOINT + '?action=logout', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Studio-CSRF': bootstrap.session.csrf }, body: '{}' }); if (!r.ok) throw new Error(); location.assign(ENDPOINT); } catch { toast('تعذّر تسجيل الخروج. أعد المحاولة.'); } };
      if (offline) { $('logout').hidden = true; document.querySelectorAll('a[href="/"]').forEach(a => { a.href = 'https://badilak-arabi.vercel.app/'; a.target = '_blank'; a.rel = 'noopener noreferrer'; }); }
      else document.addEventListener('visibilitychange', async () => { if (document.hidden) return; try { const r = await fetch(ENDPOINT + '?action=session', { credentials: 'same-origin' }); if (r.status === 401) location.assign(ENDPOINT); } catch {} });
      const previous = await draft('get', '__selected__');
      await select(offline?.project?.template || (bootstrap.templates.some(t => t.id === previous) ? previous : bootstrap.templates[0].id));
      $('studio').setAttribute('aria-busy', 'false');
    } catch (error) { $('fitMessage').textContent = error.message || 'تعذّر فتح الاستوديو.'; }
  }
  init();
})();
