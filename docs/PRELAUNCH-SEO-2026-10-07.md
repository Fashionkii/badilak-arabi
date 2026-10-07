# Prelaunch SEO and hosting preparation — 2026-10-07

## Confirmed boundary
The user approved implementing the SEO/hosting recommendations while explicitly keeping the site out of search until preparations and domain purchase are complete. No domain purchase, paid plan, DNS change or indexing launch is included.

The baseline is main commit `0eecd3dc1c879c9122868e3006268e4316976a9c`, with 82 directory items, 36 learning entries and 20 articles. The first separate guard commit `ba542d9bdf3cf039c45c5ef32233d86feec67fa4` adds a sitewide Vercel `X-Robots-Tag: noindex, follow` header. This supersedes earlier notes that only lab was noindex. Public accessibility is different from permission to index.

## Implementation
- Dependency-free build: `node scripts/build-site.cjs`, output `dist`.
- Static HTML for 82 existing discovery routes and six category routes, with route-specific titles, descriptions, canonical/social URLs and appropriate WebPage/BreadcrumbList or CollectionPage data. The same catalog supplies the browser and build.
- Existing modal/filter journeys remain; category portals and item identities now have real links. A collapsed category index exposes every item without changing the existing result limit.
- Browser history updates also update the page metadata.
- All generated HTML includes noindex. Vercel headers and Cloudflare `_headers` provide the same instruction. `robots.txt` allows crawlers to read noindex; the prelaunch sitemap intentionally contains no URLs and is not advertised or submitted.
- Unknown routes return 404 instead of a generic homepage rewrite.
- `site.config.json` centralizes the canonical origin; current origin remains the existing Vercel public host. Only prelaunch builds are accepted: changing an environment variable cannot enable indexing.
- Article body copy, catalog/learning evidence, images, commercial configuration, three reserved ad placements and established first-screen choices are protected.

## Reproduce verification
Run `node scripts/build-site.cjs`, `node scripts/audit-prelaunch.cjs ba542d9bdf3cf039c45c5ef32233d86feec67fa4`, and `node scripts/audit-taxonomy.cjs`. Deployment checks must additionally verify HTTP statuses/headers, route restoration, history, article return and visual layout.

Verified on the isolated Vercel preview for `c1983126921221a0a208d3e440ec46c4a58acc2e`:
- All 111 generated HTML files passed the local audit; 20 article bodies and the protected data/behavior assets were unchanged.
- The home screen matched the existing production layout; all six domain controls kept the same computed font, grid display and 50px height at the tested desktop viewport.
- Category-to-item navigation, direct item loading, modal close/back and metadata restoration worked. Canva → Arabic design article → “ارجع لمكانك” restored the same three filtered results.
- Actual preview responses returned 200 for item/category/robots/sitemap and 404 for invalid item/category routes, with `X-Robots-Tag: noindex, follow`. A legacy reading URL resolved to the correct article.
- No horizontal overflow was observed in the inspected desktop detail view. This pass does not claim fresh mobile screenshots or performance scores. Observed console errors belonged to the browser extension, not the site's scripts.

The follow-up portable-build correction retains every legacy redirect, including deleted `.html` aliases. Cloudflare reference: https://developers.cloudflare.com/pages/configuration/redirects/ . This changes only generated Cloudflare configuration; the tested Vercel HTML, CSS and browser scripts remain identical.

## Economical hosting trial — prepared, not deployed
Cloudflare Pages can build this same Git repository with framework preset None, build command `node scripts/build-site.cjs`, output directory `dist`, and Node 22 or later. Keep the existing Vercel site while testing a separate Pages project. `_headers`, `_redirects` and a real `404.html` are emitted. No Cloudflare account connection is available in this session, so an actual Pages deployment is not claimed.

The feedback/correction form still posts to the existing WebsitePublisher project endpoint in `js/app.js`. Its configuration and behavior were preserved. Before leaving that service, decide who receives submissions and replace or verify this dependency; do not retire it simply because static hosting works. No real submission was sent during testing.

## Continuing through ChatGPT
The Git repository is the durable source of the site; the domain is its address. A connected coding session can edit an isolated branch, run checks, publish a preview and then promote reviewed changes. This does not require an OpenAI API inside the public website. Account access remains necessary in each working environment; purchasing a domain does not itself grant ChatGPT hosting access.

## Remaining launch work
1. Connect the selected hosting account and test the portable output there, including clean routes, legacy redirects, 404s, forms and headers.
2. Choose/buy the actual domain separately. Change canonical origin only when that domain is working; choose one www/non-www destination and verify HTTPS and permanent redirects. Keep preview environments noindex.
3. Confirm form ownership, privacy/contact/editorial disclosures and any activated commercial programs. No affiliate account or analytics ID is invented.
4. Measure mobile performance and accessibility on the final host; no Lighthouse score or real-user Core Web Vitals is claimed here.
5. Verify Search Console ownership, then at explicit launch enable indexing only on the final domain, generate a sitemap with eligible canonical URLs and submit it. Recheck rendered and response-header robots directives together.
6. Improve editorial evidence and comparisons as a separate content task. Technical readiness is not a ranking guarantee or a 100% overall SEO score.

No domain, hosting subscription or paid SEO service was purchased by this change. Current provider pricing must be rechecked at purchase time.

## First-paint cleanup — 7 October 2026
The source review covered the current decisions and the relevant product, language/change and design records supplied in this thread. The two preceding changes (noindex guard and portable SEO routes) preserved catalog evidence, articles and reserved ads. The SEO routes did introduce a separate simplified initial presentation, and the existing home view still relied on deferred JavaScript to apply its current layout. These were initial-render gaps, not authorization to change copy, data, ad examples or indexing policy.

- Apply the current guided layout and panel identity in the initial HTML; choose hash routes before page content is parsed. During preview verification, legacy ID-based display rules still exposed three other sections; the initial selectors now take precedence.
- Share the existing card/detail presentation between static build and browser, including sources, flags, decision caveats and related links. The existing 23 moved presentation helpers were compared byte-for-byte with the baseline.
- Initialize directory, learning and observatory DOM when needed; preserve subsequent filters, navigation and restoration. This defers DOM work, not all script downloads.
- Remove five proven superseded CSS declarations/rules only. No claim of a complete stylesheet cleanup.
- Exclude 20 original article photos (2,077,506 bytes) from deployment output, retaining them and attribution metadata in the repository for regeneration. Covers and social images remain shipped. This is deployment-size reduction, not per-visit transfer or a measured speed gain.

Preview `a21de8e238dba5da517955cad81d754105348b34` was exercised in the browser: desktop first render; a 390px-wide iframe; learning with reserved Salla ad; category cards and Fanar detail text before/after deferred scripts; Canva → article → “ارجع لمكانك” restoring the same three results; and observatory initialization. No site-script errors or framework overlay were observed; extension messages and the earlier Vercel login warning were unrelated. Initial-state fixtures deliberately suppressed deferred external scripts; this is not a measured slow-network or physical-phone test. Temporary fixtures and their build hook were removed before main promotion.

The final build/audits compare against `7518c8c10ae65d1433d20d7ed689eb3133edab62`. Existing article copy, 82 directory records, 36 learning records, commercial configuration, navigation memory and all three reserved ad examples remain protected. Noindex, empty sitemap, hosting/domain choices and launch requirements remain unchanged. No newer main commit or relevant newer source decision was found when this task resumed; other project chats were not directly searchable in this session.
