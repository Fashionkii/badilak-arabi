#!/usr/bin/env python3
"""Build licensed article covers and social metadata from data/article-media.json.
Run: python scripts/build-article-media.py (requires Pillow with RAQM).
"""
from pathlib import Path
import argparse, hashlib, html, io, json, re
from PIL import Image, ImageDraw, ImageFont, ImageOps, features
ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://badilak-arabi.vercel.app'

def escape(value): return html.escape(str(value), quote=True)
def update_meta(page, key, value, attr='property'):
    tag = f'<meta {attr}="{key}" content="{escape(value)}">'
    pattern = rf'<meta\s+{attr}="{re.escape(key)}"\s+content="[^"]*"\s*/?>'
    return re.sub(pattern, lambda _: tag, page) if re.search(pattern, page) else page.replace('</head>', tag + '\n</head>')

def save_image(image, path, format, **options):
    encoded = io.BytesIO()
    image.save(encoded, format, **options)
    data = encoded.getvalue()
    if not data: raise RuntimeError('Image encoding produced an empty file: '+str(path))
    with Image.open(io.BytesIO(data)) as verify:
        verify.load()
        if verify.size != image.size: raise RuntimeError('Image size changed during encoding')
    temporary = path.with_suffix(path.suffix+'.tmp')
    temporary.write_bytes(data)
    temporary.replace(path)

def text_lines(draw, text, font, width):
    lines, line = [], ''
    for word in text.split():
        proposed = (line + ' ' + word).strip()
        if line and draw.textlength(proposed, font=font, direction='rtl') > width:
            lines.append(line); line = word
        else: line = proposed
    if line: lines.append(line)
    return lines

def build(font_path):
    if not features.check('raqm'): raise RuntimeError('Pillow must support RAQM for Arabic text.')
    manifest = json.loads((ROOT/'data/article-media.json').read_text())
    articles = manifest['articles']
    hub_path = ROOT/'guides.html'; hub = hub_path.read_text()
    for slug, item in articles.items():
        if not re.fullmatch('[a-z0-9-]+', slug): raise ValueError('Invalid article slug')
        path = ROOT/'guides'/f'{slug}.html'
        page = path.read_text()
        title = item['socialTitle'].strip(); alt = item['alt'].strip()
        if not title or not alt or len(title)>100: raise ValueError('Missing/long title or image description: '+slug)
        if item['photo']:
            photo_path = (ROOT/item['photo'].lstrip('/')).resolve()
            if not photo_path.is_relative_to(ROOT/'images'): raise ValueError('Photo must be inside images/')
            photo = Image.open(photo_path).convert('RGB')
        else:
            # An automatic, explicit text fallback when a new article has no photo yet.
            photo = Image.new('RGB', (1200,675), '#e3ece7')
        focal = item.get('focalPoint', [0.5,0.5])
        if len(focal)!=2 or any(not isinstance(v,(int,float)) or not 0<=v<=1 for v in focal): raise ValueError('Invalid focalPoint')
        directory = ROOT/'images/articles'; directory.mkdir(exist_ok=True, parents=True)
        cover = ImageOps.fit(photo, (1200,675), centering=tuple(focal))
        save_image(cover, directory/f'{slug}-cover.webp', 'WEBP', quality=83)
        social = Image.new('RGB', (1200,630), '#fffdf8')
        social.paste(ImageOps.fit(photo, (540,630), centering=tuple(focal)), (0,0))
        draw = ImageDraw.Draw(social)
        draw.rectangle((540,0,556,630), fill='#c79a47')
        draw.rounded_rectangle((1070,66,1136,132), radius=14, fill='#173f3d')
        small = ImageFont.truetype(font_path, 28)
        brand = ImageFont.truetype(font_path, 38)
        draw.text((1103,94), 'ب', anchor='mm', font=brand, fill='#fffdf8', direction='rtl')
        draw.text((1048,85), 'بديلك عربي', font=brand, fill='#173f3d', anchor='ra', direction='rtl')
        size = 54
        while True:
            font = ImageFont.truetype(font_path, size)
            lines = text_lines(draw, title, font, 540)
            if len(lines)<=3 or size<=34: break
            size -= 2
        if len(lines)>3: raise ValueError('Social headline does not fit: '+slug)
        line_height = int(size*1.55); y = 310 - len(lines)*line_height/2
        for line in lines:
            draw.text((1136,y), line, anchor='ra', font=font, fill='#173f3d', direction='rtl'); y+=line_height
        draw.line((636,490,1136,490), fill='#c9d4ce', width=2)
        draw.text((1136,525), 'اقرأ قبل أن تختار', anchor='ra', font=small, fill='#68746f', direction='rtl')
        draw.text((636,580), 'badilak-arabi.vercel.app', font=ImageFont.truetype(font_path,19), fill='#68746f')
        social_path = directory/f'{slug}-social.jpg'; save_image(social, social_path, 'JPEG', quality=89, optimize=True)
        version = hashlib.sha256(social_path.read_bytes()).hexdigest()[:10]
        social_url = f'{BASE}/images/articles/{slug}-social.jpg?v={version}'
        cover_url = f'/images/articles/{slug}-cover.webp'
        for key,value in [('og:title',title),('og:image',social_url),('og:image:secure_url',social_url),('og:image:type','image/jpeg'),('og:image:width','1200'),('og:image:height','630'),('og:image:alt',alt)]:
            page = update_meta(page,key,value)
        for key,value in [('twitter:title',title),('twitter:image',social_url),('twitter:image:alt',alt)]:
            page = update_meta(page,key,value,'name')
        # Preserve the existing headline, review date, publisher and other structured data.
        def schema(match):
            data = json.loads(match.group(1))
            if data.get('@type')=='Article': data['image'] = BASE+cover_url
            return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False,separators=(',',':'))+'</script>'
        page = re.sub(r'<script type="application/ld\+json">(.*?)</script>',schema,page,flags=re.S)
        credits = ''
        if item['photo']:
            for key in ['source','licenseUrl']:
                if not item[key].startswith('https://'): raise ValueError('Credit links must use HTTPS')
            credits = f'<figcaption>الصورة: {escape(item["credit"])} · <a href="{escape(item["source"])}" target="_blank" rel="noopener">المصدر</a> · <a href="{escape(item["licenseUrl"])}" target="_blank" rel="noopener">{escape(item["license"])}</a></figcaption>'
        figure = f'<!-- article-media:start --><figure class="article-cover"><img src="{cover_url}" alt="{escape(alt)}" width="1200" height="675" fetchpriority="high">{credits}</figure><!-- article-media:end -->'
        if '<!-- article-media:start -->' in page:
            page = re.sub(r'<!-- article-media:start -->.*?<!-- article-media:end -->',lambda _:figure,page,flags=re.S)
        else:
            page = page.replace('</section>', '</section>'+figure, 1)
        # Optional public fields are explicit: adding a field does not silently alter article copy.
        fields = ''.join(f'<div><dt>{escape(k)}</dt><dd>{escape(v)}</dd></div>' for k,v in item.get('customFields',{}).items())
        custom = f'<!-- article-fields:start --><dl class="article-fields">{fields}</dl><!-- article-fields:end -->' if fields else ''
        page = re.sub(r'<!-- article-fields:start -->.*?<!-- article-fields:end -->','',page,flags=re.S)
        if custom: page = page.replace('<!-- article-media:end -->','<!-- article-media:end -->'+custom)
        if '/css/article-media.css' not in page: page = page.replace('</head>','<link rel="stylesheet" href="/css/article-media.css">\n</head>')
        # A production article should not retain an obsolete environment label.
        page = re.sub(r'(?m)^[ \t]*<span>نسخة المختبر</span>[ \t]*\n', '', page)
        page = page.replace('<span>نسخة المختبر</span>','')
        page = re.sub(r'(?m)^[ \t]+$', '', page)
        path.write_text(page)
        thumb = f'<img class="guide-cover" src="{cover_url}" alt="{escape(alt)}" width="1200" height="675" loading="lazy" decoding="async">'
        pattern = rf'(<a class="card" href="/guides/{slug}">)(?:<img class="guide-cover"[^>]*>)?'
        hub = re.sub(pattern,lambda m:m.group(1)+thumb,hub)
    if '/css/article-media.css' not in hub: hub = hub.replace('</head>','<link rel="stylesheet" href="/css/article-media.css">\n</head>')
    hub_path.write_text(hub)
    print(f'Built {len(articles)} article covers, social images, and metadata.')

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--font',default='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
    build(parser.parse_args().font)
