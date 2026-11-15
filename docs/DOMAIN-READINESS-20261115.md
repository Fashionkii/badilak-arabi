# Custom-domain readiness — 15 November 2026

## Scope

Preparation only. No domain has been bought or attached, `site.config.json` still names
`https://badilak-arabi.vercel.app`, and the site stays in `prelaunch` (noindex, empty sitemap,
feedback disabled). No content, data, dates, sources, ad placements, design or visitor behaviour
changed. Base commit: `91c581febc17878635aef1c66dc923948520bdce`.

## What changed

- `scripts/build-site.cjs`: host-conditional `vercel.json` redirects are no longer copied into the
  portable `_redirects` file. Without its `has` condition, a future "old host → new domain" rule
  would redirect every host, including the new one.
- `scripts/audit-prelaunch.cjs`: the matching exemption, plus a guard that every page's
  `badilak:origin`, canonical, `og:url`, `og:image`, `og:image:secure_url` and `twitter:image`
  sit on `site.config.json`'s `canonicalOrigin`. The preview-only `lab/` review page is exempt.
- `js/route-seo.js`: the unused fallback origin is `location.origin` instead of a literal host. All
  140 pages carry the `badilak:origin` meta, so the fallback does not run.

Built output is byte-identical to the base commit except that one line of `js/route-seo.js`.

## Verified

- Build, `audit-prelaunch`, `test-coherent-navigation`, `test-directory-group-rotation`,
  `test-review-fixes`, `test-screenshot-corrections`, `audit-category-links`, `audit-feedback`,
  `node --test scripts/test-studio.cjs`, `git diff --check`: pass.
- Throwaway copy with `canonicalOrigin` set to a new `.com` and the host redirect added: 0 text
  occurrences of the old host in `dist/`, 1,456 of the new origin, `_redirects` unchanged at 43
  rules, `audit-prelaunch` passes, noindex and empty sitemap intact.
- Guard check: restoring one old canonical in that copy makes `audit-prelaunch` fail.

Not verified here: any live HTTP behaviour, Vercel's handling of the host redirect, browser or
mobile rendering (no visual change was made), Meta link previews.

## Switch steps once the domain serves HTTPS on this project

Do these in order; do not do step 2 before the domain shows a valid certificate, or every
canonical and share image URL would point at a dead host.

1. In the studio on the old host, export any drafts with "save project". Drafts live in that
   host's browser storage (`badilak_design_studio_v1`) and do not follow the redirect.
2. `site.config.json`: set `canonicalOrigin` to the new origin (one HTTPS origin, no trailing
   slash). Keep `"phase": "prelaunch"`.
3. `vercel.json`: add as the first entry of `redirects`, with the real domain:
   `{ "source": "/:path*", "has": [{ "type": "host", "value": "badilak-arabi.vercel.app" }], "destination": "https://NEW-DOMAIN/:path*", "permanent": true }`
4. `server/studio/client/app.js` (offline export home link): replace the literal old origin.
5. Build, run `audit-prelaunch`, deploy, then check on the public domain: home, one article, one
   discover page, one news item, `/admin/studio` login (a fresh login is needed per host).

## Known leftovers, owner decision

- 20 of the 21 article share images (`images/articles/*-social.jpg`) have the text
  `badilak-arabi.vercel.app` drawn into the picture by `scripts/build-article-media.py`. The 21st,
  `create-online-academy-social.jpg`, shows empty glyph boxes in that position. Re-running that
  script also re-encodes covers and rewrites guide heads, so changing the label needs its own
  narrow, reviewed task. This is a visual change and was not made here.
- Opening indexing, enabling feedback, adding analytics or a pixel, and any paid plan remain
  separate decisions.
