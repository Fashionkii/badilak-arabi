# Sharing preview — 2026-10-12

Scope: improve delivery of the existing brand share image only. No logo redesign or content-workflow implementation.

Observed before: production returns HTTP 200 for homepage and image; robots permits crawling while noindex remains; OG/Twitter already specify 1200x630 and large Twitter summary. Existing PNG is 385064 bytes. This does not prove why a specific WhatsApp/Facebook client displayed a small/absent image; no client screenshot or authenticated debugger result is available.

Change: encode the same artwork to JPEG (quality 82, mozjpeg, 4:4:4), 1200x630, 116945 bytes (about 70% less). Use a new filename, badilak-share-20261012.jpg, in index.html and guides.html; add og:image:type=image/jpeg. Generated discovery/category/shared-information pages inherit this shared metadata; article-specific images remain unchanged. Old image remains available for cached consumers. No dependency added to production.

Verification: build succeeds; exact source comparison permits only the two image URLs and MIME tag; generated article pages, CSS and JS hashes unchanged; all HTML remains noindex. New image visually inspected. Platform cache refresh and final card layout cannot be forced by these tags; final appearance inside WhatsApp/Facebook requires a new share/client or debugger check. Do not report that as already tested.

Reproduce image encoding using the already available sharp dependency:

```js
await require('sharp')('images/social/badilak-social-base.png').jpeg({quality:82,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile('images/social/badilak-share-20261012.jpg');
```
