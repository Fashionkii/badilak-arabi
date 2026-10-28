'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const native = require(require.resolve('@napi-rs/canvas', { paths: [process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES || process.cwd()] }));
const R = require('../server/studio/client/renderer.js');
const root = path.join(__dirname, '../server/studio');
const data = JSON.parse(fs.readFileSync(path.join(root, 'templates.json'), 'utf8'));
const out = process.env.STUDIO_QA_OUTPUT || path.join(__dirname, '../../studio-qa');
fs.mkdirSync(out, { recursive: true });
for (const weight of [400, 700]) {
  const file = process.env.STUDIO_QA_TTF ? path.join(process.env.STUDIO_QA_TTF, 'font-' + weight + '.ttf') : path.join(root, 'assets/font-' + weight + '.woff2');
  assert.ok(native.GlobalFonts.registerFromPath(file, 'StudioFont'), 'Load the exact project font for rendering.');
}
const resolveAsset = async key => 'data:image/webp;base64,' + fs.readFileSync(path.join(root, 'assets', data.assets[key].file)).toString('base64');
const loadBitmap = src => src.startsWith('data:image/svg+xml;charset=utf-8,') ? native.loadImage(Buffer.from(decodeURIComponent(src.slice(src.indexOf(',') + 1)))) : native.loadImage(src);
(async () => {
  const issues = [], previews = [];
  for (const t of data.templates) for (const lang of ['ar', 'en']) {
    const p = R.defaults(t); p.lang = lang;
    const c = native.createCanvas(R.W, R.H), ctx = c.getContext('2d');
    const report = await R.draw(ctx, t, p, resolveAsset, loadBitmap);
    if (t.kind === 'steps') for (let i = 0; i < 3; i++) {
      const number = report.design.boxes.find(b => b.id === 'number' + i);
      const icon = report.design.images.find(im => im.id === 'icon' + i);
      assert.ok(number.y + number.h < icon.y, 'Step numbers must have their own clear space above icons.');
    }
    if (t.id === 'shopping') assert.equal(report.design.images.find(im => im.id === 'scene').fit, 'contain', 'Show the whole store illustration.');
    if (report.overflow.length) issues.push({ template: t.id, lang, fields: report.overflow.map(x => ({ id: x.id, value: x.value, lines: x.lines })) });
    const png = c.toBuffer('image/png');
    assert.equal(png.readUInt32BE(16), 1080); assert.equal(png.readUInt32BE(20), 1350);
    fs.writeFileSync(path.join(out, t.id + '-' + lang + '.png'), png);
    if (lang === 'ar') previews.push(c);
    const svg = await R.svg(ctx, t, p, resolveAsset, loadBitmap, '', 'Rendering audit');
    assert.ok(!svg.includes('href="http')); assert.ok(svg.includes('<text'));
  }
  const sheet = native.createCanvas(1350, 4 * 562.5), ctx = sheet.getContext('2d'); ctx.fillStyle = '#e8eee4'; ctx.fillRect(0, 0, sheet.width, sheet.height);
  previews.forEach((c, i) => ctx.drawImage(c, (i % 3) * 450, Math.floor(i / 3) * 562.5, 450, 562.5));
  fs.writeFileSync(path.join(out, 'contact-sheet.png'), sheet.toBuffer('image/png'));
  fs.writeFileSync(path.join(out, 'audit.json'), JSON.stringify({ templates: data.templates.length, languages: 2, issues }, null, 2));
  console.log(JSON.stringify({ templates: data.templates.length, renders: data.templates.length * 2, issues, output: out }));
  if (issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
