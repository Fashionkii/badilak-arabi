(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.StudioRenderer = factory();
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const W = 1080, H = 1350;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
  const validData = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
  function defaults(template) {
    return { version: 1, template: template.id, lang: 'ar', copy: JSON.parse(JSON.stringify(template.copy)), scales: { title: 1, names: 1, descriptions: 1 }, images: {}, focus: { x: 50, y: 50, zoom: 1 } };
  }
  function normalize(input, templates) {
    if (!input || typeof input !== 'object') throw new Error('ملف المشروع غير صالح.');
    const template = templates.find(t => t.id === input.template);
    if (!template) throw new Error('القالب غير موجود في هذه النسخة.');
    const out = defaults(template);
    out.lang = input.lang === 'en' ? 'en' : 'ar';
    for (const lang of ['ar', 'en']) {
      const c = input.copy?.[lang];
      if (!c || typeof c !== 'object') continue;
      for (const [key, max] of Object.entries({ title: 120, subtitle: 190, footer: 150, cta: 80 })) {
        if (c[key] !== undefined) {
          if (typeof c[key] !== 'string' || c[key].length > max) throw new Error('نص أطول من الحد المسموح: ' + key);
          out.copy[lang][key] = c[key];
        }
      }
      if (c.cards !== undefined) {
        if (!Array.isArray(c.cards) || c.cards.length !== 3) throw new Error('يجب أن يضم القالب ثلاث بطاقات.');
        out.copy[lang].cards = c.cards.map(card => {
          if (!Array.isArray(card) || typeof card[0] !== 'string' || typeof card[1] !== 'string' || card[0].length > 80 || card[1].length > 150) throw new Error('بيانات إحدى البطاقات غير صالحة.');
          return [card[0], card[1]];
        });
      }
    }
    for (const key of Object.keys(out.scales)) {
      const n = Number(input.scales?.[key]);
      if (Number.isFinite(n)) out.scales[key] = Math.max(.9, Math.min(1.08, n));
    }
    for (const key of ['scene', 'icon0', 'icon1', 'icon2']) {
      const v = input.images?.[key];
      if (v !== undefined && v !== null) {
        if (!validData(v) || v.length > 9 * 1024 * 1024) throw new Error('صورة غير صالحة أو كبيرة جدًا.');
        out.images[key] = v;
      }
    }
    for (const key of ['x', 'y']) { const n = Number(input.focus?.[key]); if (Number.isFinite(n)) out.focus[key] = Math.max(0, Math.min(100, n)); }
    const zoom = Number(input.focus?.zoom); if (Number.isFinite(zoom)) out.focus.zoom = Math.max(1, Math.min(2, zoom));
    return out;
  }
  function design(template, project) {
    const c = project.copy[project.lang], ar = project.lang === 'ar';
    const images = [], boxes = [], frames = [];
    const forest = '#194B3E', ink = '#193F35';
    let background = `<defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#FFFDF7"/><stop offset="1" stop-color="#F3F6EE"/></linearGradient><filter id="soft" x="-15%" y="-15%" width="130%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#194B3E" flood-opacity=".085"/></filter></defs><rect width="1080" height="1350" fill="url(#paper)"/><path d="M0 170Q540 210 1080 170V0H0Z" fill="#FFF"/><path d="M0 228Q84 238 123 376Q33 340 0 290Z" fill="#EAF1E9" opacity=".75"/><path d="M1080 195Q996 223 958 346Q1051 304 1080 261Z" fill="#E6EEDF" opacity=".75"/><path d="M0 1165Q94 1210 151 1350H0Z" fill="#E4EDDF" opacity=".65"/><path d="M1080 1165Q986 1205 926 1350H1080Z" fill="#E4EDDF" opacity=".65"/><path d="M20 205Q98 343 187 347M1070 1130Q1001 1151 947 1200" fill="none" stroke="#D8B775" stroke-width="1.3" opacity=".75"/>`;
    function frame(x, y, w, h, r = 24, fill = '#FFFEF9') {
      frames.push({ x, y, w, h, r });
      background += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="#D5E1D6" stroke-width="1.3" filter="url(#soft)"/>`;
    }
    function box(id, value, x, y, w, h, size, weight = 400, color = ink, maxLines = 2, align = 'center') {
      boxes.push({ id, value, x, y, w, h, size, weight, color, maxLines, align, ar });
    }
    function picture(id, asset, x, y, w, h, r = 0, fit = 'contain', focus) {
      images.push({ id, asset, custom: project.images[id], x, y, w, h, r, fit, focus });
    }
    picture('logo', 'logo', 401, 20, 278, 151, 0);
    box('title', c.title, 70, 195, 940, 148, 59 * project.scales.title, 700, ink, 2);
    box('subtitle', c.subtitle, 78, 339, 924, 74, 30 * project.scales.descriptions, 400, ink, 2);
    const horizontal = template.layout === 'wide';
    if (!horizontal) {
      const sceneLeft = template.layout === 'scene-left';
      const sceneX = sceneLeft ? 52 : 594, cardX = sceneLeft ? 516 : 52;
      frame(sceneX, 430, 434, 660);
      picture('scene', template.scene, sceneX + 2, 432, 430, 656, 23, 'cover', project.focus);
      c.cards.forEach((card, i) => {
        const y = 430 + i * 225;
        frame(cardX, y, 512, 210, 23, template.kind === 'steps' && i === 2 ? '#FCF5E8' : '#FFFEF9');
        if (template.kind === 'steps') {
          // A dedicated row keeps each number clear of the raster icon.
          background += `<circle cx="${cardX + 103}" cy="${y + 24}" r="16" fill="${i === 2 ? '#D8B775' : '#EAF1E9'}"/>`;
          box('number' + i, ar ? ['١', '٢', '٣'][i] : String(i + 1), cardX + 88, y + 7, 30, 34, 23, 700);
          picture('icon' + i, template.icons[i], cardX + 18, y + 48, 170, 145, 12);
        } else picture('icon' + i, template.icons[i], cardX + 16, y + 26, 174, 157, 12);
        box('name' + i, card[0], cardX + 204, y + 18, 281, 114, (template.kind === 'steps' ? (ar ? 37 : 33) : (ar ? 48 : 42)) * project.scales.names, 700, ink, 2, ar ? 'right' : 'left');
        box('description' + i, card[1], cardX + 204, y + 133, 281, 74, 30 * project.scales.descriptions, 400, ink, 2, ar ? 'right' : 'left');
      });
    } else {
      frame(52, 430, 976, 345);
      picture('scene', template.scene, 54, 432, 972, 341, 23, template.sceneFit || 'cover', project.focus);
      c.cards.forEach((card, i) => {
        const x = 52 + (2 - i) * 332;
        frame(x, 798, 312, 292, 23);
        picture('icon' + i, template.icons[i], x + 71, 816, 170, 132, 12);
        box('name' + i, card[0], x + 18, 954, 276, 68, 36 * project.scales.names, 700, ink, 2);
        box('description' + i, card[1], x + 18, 1018, 276, 68, 26 * project.scales.descriptions, 400, ink, 2);
      });
    }
    box('footer', c.footer, 66, 1110, 948, 62, 24, 400, '#345E4F', 2);
    background += `<rect x="148" y="1193" width="784" height="94" rx="31" fill="${forest}" filter="url(#soft)"/><circle cx="873" cy="1240" r="28" fill="#D8B775"/><path d="M866 1229L878 1240L866 1251" fill="none" stroke="${forest}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    box('cta', c.cta, 178, 1206, 635, 64, 36, 700, '#FFFDF7', 1);
    return { background, images, boxes, frames };
  }
  function wrap(ctx, box) {
    ctx.font = `${box.weight} ${box.size}px StudioFont`;
    const result = [];
    for (const paragraph of String(box.value).split('\n')) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      let line = '';
      for (const word of words) {
        const proposed = line ? line + ' ' + word : word;
        if (line && ctx.measureText(proposed).width > box.w) { result.push(line); line = word; } else line = proposed;
      }
      result.push(line);
    }
    const lineHeight = box.size * (box.id.startsWith('name') ? 1.16 : 1.22);
    const overflow = result.length > box.maxLines || result.length * lineHeight > box.h + 3 || result.some(line => ctx.measureText(line).width > box.w + 1);
    const top = box.y + Math.max(0, (box.h - result.length * lineHeight) / 2);
    return { lines: result, lineHeight, baseline: top + box.size * .91, overflow };
  }
  function textLayout(ctx, d) {
    return d.boxes.map(box => ({ ...box, ...wrap(ctx, box) }));
  }
  function sourceRect(im, bitmap) {
    const sw = bitmap.width || bitmap.naturalWidth, sh = bitmap.height || bitmap.naturalHeight;
    if (im.fit !== 'cover') return { sx: 0, sy: 0, sw, sh, dx: im.x + (im.w - Math.min(im.w / sw, im.h / sh) * sw) / 2, dy: im.y + (im.h - Math.min(im.w / sw, im.h / sh) * sh) / 2, dw: Math.min(im.w / sw, im.h / sh) * sw, dh: Math.min(im.w / sw, im.h / sh) * sh };
    const zoom = im.focus?.zoom || 1, scale = Math.max(im.w / sw, im.h / sh) * zoom;
    const cw = im.w / scale, ch = im.h / scale;
    return { sx: Math.max(0, sw - cw) * (im.focus?.x ?? 50) / 100, sy: Math.max(0, sh - ch) * (im.focus?.y ?? 50) / 100, sw: cw, sh: ch, dx: im.x, dy: im.y, dw: im.w, dh: im.h };
  }
  async function draw(ctx, template, project, resolveAsset, loadBitmap) {
    const d = design(template, project);
    const bg = await loadBitmap('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350">${d.background}</svg>`));
    ctx.clearRect(0, 0, W, H); ctx.drawImage(bg, 0, 0, W, H);
    for (const im of d.images) {
      const bitmap = await loadBitmap(im.custom || await resolveAsset(im.asset));
      const r = sourceRect(im, bitmap);
      ctx.save(); ctx.beginPath(); ctx.roundRect(im.x, im.y, im.w, im.h, im.r); ctx.clip();
      ctx.drawImage(bitmap, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh); ctx.restore();
    }
    const text = textLayout(ctx, d);
    for (const box of text) {
      ctx.font = `${box.weight} ${box.size}px StudioFont`; ctx.fillStyle = box.color;
      ctx.direction = box.ar ? 'rtl' : 'ltr'; ctx.textAlign = box.align; ctx.textBaseline = 'alphabetic';
      const x = box.align === 'right' ? box.x + box.w : box.align === 'left' ? box.x : box.x + box.w / 2;
      box.lines.forEach((line, i) => ctx.fillText(line, x, box.baseline + i * box.lineHeight));
    }
    return { design: d, text, overflow: text.filter(x => x.overflow) };
  }
  async function svg(ctx, template, project, resolveAsset, loadBitmap, fontCss, license) {
    const d = design(template, project), text = textLayout(ctx, d);
    let output = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350"><title>${escape(project.copy[project.lang].title)}</title><metadata>${escape(license || '')}</metadata><defs><style>${fontCss}</style></defs>${d.background}`;
    for (let i = 0; i < d.images.length; i++) {
      const im = d.images[i], src = im.custom || await resolveAsset(im.asset), bitmap = await loadBitmap(src), r = sourceRect(im, bitmap);
      const scale = r.dw / r.sw, width = (bitmap.width || bitmap.naturalWidth) * scale, height = (bitmap.height || bitmap.naturalHeight) * scale;
      const x = r.dx - r.sx * scale, y = r.dy - r.sy * scale;
      output += `<defs><clipPath id="clip${i}"><rect x="${im.x}" y="${im.y}" width="${im.w}" height="${im.h}" rx="${im.r}"/></clipPath></defs><g clip-path="url(#clip${i})"><image data-layer="${im.id}" x="${x}" y="${y}" width="${width}" height="${height}" xlink:href="${escape(src)}"/></g>`;
    }
    for (const box of text) {
      const x = box.align === 'right' ? box.x + box.w : box.align === 'left' ? box.x : box.x + box.w / 2;
      const anchor = box.align === 'center' ? 'middle' : box.ar ? (box.align === 'right' ? 'start' : 'end') : (box.align === 'right' ? 'end' : 'start');
      box.lines.forEach((line, i) => { output += `<text data-layer="${box.id}" x="${x}" y="${box.baseline + i * box.lineHeight}" text-anchor="${anchor}" font-family="StudioFont" font-weight="${box.weight}" font-size="${box.size}" fill="${box.color}" direction="${box.ar ? 'rtl' : 'ltr'}" unicode-bidi="plaintext">${escape(line)}</text>`; });
    }
    return output + '</svg>';
  }
  return { W, H, escape, defaults, normalize, design, wrap, textLayout, draw, svg, validData };
});
