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
