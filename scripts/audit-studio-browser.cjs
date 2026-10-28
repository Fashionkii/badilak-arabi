'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(require.resolve('playwright', { paths: [process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES || process.cwd()] }));
const out = process.env.STUDIO_BROWSER_OUTPUT || path.resolve(__dirname, '../../studio-browser-qa');
fs.mkdirSync(out, { recursive: true });
module.exports = (async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.STUDIO_BROWSER_PATH || undefined, args: process.env.STUDIO_BROWSER_ARGS ? JSON.parse(process.env.STUDIO_BROWSER_ARGS) : ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, acceptDownloads: true });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = process.env.STUDIO_TEST_URL || 'http://127.0.0.1:4173';
  const waitReady = () => page.waitForFunction(() => document.querySelector('#exportPng')?.disabled === false, null, { timeout: 30000 });
  async function saveDownload(button, name) { const pending = page.waitForEvent('download', { timeout: 15000 }); await page.locator(button).click(); let download; try { download = await pending; } catch (error) { throw new Error(button + ': ' + await page.locator('#toast').textContent() + ' (' + error.message + ')'); } const file = path.join(out, name); await download.saveAs(file); await waitReady(); return file; }
  try {
    await page.goto(base + '/admin/studio');
    await page.locator('#username').fill(process.env.STUDIO_TEST_USER || 'testadmin');
    await page.locator('#password').fill(process.env.STUDIO_TEST_PASSWORD || 'local-test-password');
    const loginResponse = page.waitForResponse(r => r.url().includes('action=login'));
    await page.locator('#loginButton').click();
    const loginResult = await loginResponse;
    if (loginResult.status() !== 200) throw new Error('Browser login: ' + loginResult.status() + ' ' + await loginResult.text() + '; origin=' + (await loginResult.request().allHeaders()).origin);
    await waitReady();
    assert.equal(await page.locator('#templateSelect option').count(), 10);
    for (const id of ['learning', 'business', 'reading', 'research', 'fit', 'create', 'presentation', 'tech', 'shopping', 'discovery']) {
      await page.locator('#templateSelect').selectOption(id);
      await page.waitForFunction(id => document.querySelector('#templateSelect').value === id && !document.querySelector('#exportPng').disabled, id);
      await page.waitForFunction(() => !document.querySelector('#fitMessage').textContent);
      for (const lang of ['ar', 'en']) {
        await page.locator(lang === 'ar' ? '#langAr' : '#langEn').click(); await waitReady();
        await page.locator('#preview').screenshot({ path: path.join(out, id + '-' + lang + '-preview.png') });
      }
      await page.locator('#langAr').click(); await waitReady();
    }
    const templates = JSON.parse(fs.readFileSync(path.join(__dirname, '../server/studio/templates.json'), 'utf8')).templates;
    const imported = require('../server/studio/client/renderer.js').defaults(templates.find(t => t.id === 'create'));
    imported.copy.ar.title = 'محتوى قابل للتعديل';
    await page.locator('#projectInput').setInputFiles({ name: 'review-project.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ project: imported })) });
    await page.waitForFunction(() => document.querySelector('#templateSelect').value === 'create' && !document.querySelector('#exportPng').disabled);
    await page.reload(); await waitReady();
    assert.equal(await page.locator('#templateSelect').inputValue(), 'create');
    assert.equal(await page.locator('#textFields textarea').first().inputValue(), imported.copy.ar.title);
    await page.locator('#templateSelect').selectOption('learning'); await waitReady();
    const title = page.locator('#textFields textarea').first(), edited = 'تعلّم بالعربية وابدأ من هدفك';
    assert.equal(await page.evaluate(() => {
      const field = document.querySelector('#textFields textarea');
      field.dispatchEvent(new Event('input', { bubbles: true }));
      return ['exportPng', 'exportSvg', 'exportHtml'].every(id => document.getElementById(id).disabled);
    }), true, 'Exports stay blocked until the updated preview has been checked.');
    await waitReady();
    await title.fill(edited); await waitReady();
    await page.waitForFunction(() => document.querySelector('#draftState').textContent.includes('تم الحفظ'));
    await page.reload(); await waitReady(); assert.equal(await page.locator('#templateSelect').inputValue(), 'learning'); assert.equal(await page.locator('#textFields textarea').first().inputValue(), edited);
    await page.locator('#langEn').click(); await waitReady(); assert.equal(await page.locator('#langEn').getAttribute('aria-pressed'), 'true');
    await page.locator('#langAr').click(); await waitReady(); assert.equal(await page.locator('#textFields textarea').first().inputValue(), edited);
    await page.locator('#textFields textarea').first().fill('عنوان طويل للاختبار '.repeat(6).slice(0, 120));
    await page.waitForFunction(() => document.querySelector('#fitMessage').textContent.length > 0); assert.equal(await page.locator('#exportPng').isDisabled(), true);
    await page.locator('#textFields textarea').first().fill(edited); await waitReady();
    await page.locator('#tab-images').click(); assert.equal(await page.locator('#panel-images').isVisible(), true);
    await page.locator('#sceneUpload').setInputFiles(path.join(__dirname, '../server/studio/assets/fit-scene.webp')); await waitReady();
    await page.locator('#restoreImages').click(); await waitReady();
    await page.locator('#tab-settings').click(); await page.locator('#exportScale').selectOption('2');
    const png = fs.readFileSync(await saveDownload('#exportPng', 'export-2x.png')); assert.equal(png.readUInt32BE(16), 2160); assert.equal(png.readUInt32BE(20), 2700);
    const svgFile = await saveDownload('#exportSvg', 'export.svg'), svg = fs.readFileSync(svgFile, 'utf8'); assert.ok(svg.includes('data:font/woff2;base64')); assert.ok(svg.includes(edited));
    assert.equal(await page.evaluate(svg => new DOMParser().parseFromString(svg, 'image/svg+xml').querySelectorAll('parsererror').length, svg), 0);
    const htmlFile = await saveDownload('#exportHtml', 'editable.html');
    await page.locator('#saveProject').click();
    await page.locator('#tab-content').click();
    await page.screenshot({ path: path.join(out, 'studio-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(out, 'studio-mobile.png'), fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    const local = await context.newPage(); local.on('pageerror', e => errors.push('offline: ' + e.message));
    await context.setOffline(true); await local.goto('file://' + htmlFile); await local.waitForFunction(() => document.querySelector('#exportPng')?.disabled === false, null, { timeout: 30000 });
    assert.equal(await local.locator('#templateSelect option').count(), 1); assert.equal(await local.locator('#textFields textarea').first().inputValue(), edited);
    const offDownload = local.waitForEvent('download'); await local.locator('#exportPng').click(); const off = await offDownload; await off.saveAs(path.join(out, 'offline-export.png'));
    await local.close(); await context.setOffline(false);
    await page.locator('#logout').click(); await page.locator('#loginForm').waitFor();
    assert.equal(await page.evaluate(async () => (await fetch('/admin/studio?action=bootstrap')).status), 401);
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(out, 'audit.json'), JSON.stringify({ ok: true, templates: 10, visualPreviews: 20, checks: ['login', 'template selection', 'imported template persists on reload', 'draft restore', 'AR/EN', 'pending preview blocks exports', 'overflow block', 'image upload', 'PNG 2x', 'SVG with fonts', 'editable offline HTML', 'mobile layout', 'logout'], pageErrors: errors }, null, 2));
    console.log(JSON.stringify({ ok: true, output: out, pageErrors: errors }));
  } catch (error) {
    await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: true }).catch(() => {});
    console.error(error); console.error(await page.locator('body').innerText().catch(() => '')); process.exitCode = 1;
  } finally { await browser.close(); }
})();
