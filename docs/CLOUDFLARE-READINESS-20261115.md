# Cloudflare readiness for the public site — 15 November 2026

## Scope

Preparation only. Nothing was deployed to Cloudflare from this work, no DNS changed, and the Vercel
site is untouched: the built output is byte-identical to `2c801105e1a557aa7cbb76c48bcc4a2cf629647c`.
The site stays in `prelaunch`. The owner asked to prepare a move because Vercel's free plan is
limited to non-commercial use and advertising revenue is planned.

## What changed

- `wrangler.jsonc`: Cloudflare Workers static-assets configuration for the public site. Assets
  directory `./dist`, `html_handling: drop-trailing-slash` (same URL shape as today), and
  `not_found_handling: 404-page`. Vercel ignores this file.
- `.gitignore`: `.wrangler/` (local runtime cache).

Cloudflare build settings for this repository: build command `node scripts/build-site.cjs`,
deploy command `npx wrangler deploy`, production branch `main`.

## Verified on Cloudflare's local runtime (wrangler 4.162.0)

- All 139 built pages return 200 at their clean URLs.
- All 43 portable redirect rules return the status and destination that `vercel.json` defines.
- Unknown paths return 404 with the site's own 404 page; `/guides/reading/` and `.html` forms
  redirect to the clean URL (307 here, 308 on Vercel).
- `X-Robots-Tag: noindex, follow` is sent on pages; `_headers` and `_redirects` are not served.
- `wrangler deploy --dry-run` reads 312 asset files and accepts the configuration.

Not verified: a real Cloudflare deployment, its build environment, custom-domain setup, caching
behaviour, or anything in the owner's Cloudflare account.

## The admin studio does not move with this change

`/admin` and `/admin/studio` return 404 on Cloudflare with this configuration, by design. The
studio's password check uses scrypt (N=16384), measured here at 25–34 ms of CPU per login.
Cloudflare's Workers Free plan allows 10 ms of CPU per request, so the login as built would fail
there. Session checks and file serving are cheap; only the login step is the obstacle.

Until the owner chooses otherwise, the studio keeps working where it is, on the Vercel project.
Options for later, each needing an owner decision because they change cost or the login model:
keep it on Vercel as a private tool, pay for Workers Paid, replace the password with a long random
access key verified by a constant-time comparison, or put Cloudflare Access in front of it.
Weakening the password hash to fit the free limit is not proposed.

## Not done

Custom domain, DNS, host redirect from the Vercel address, `canonicalOrigin`, share-image labels,
privacy-page hosting sentence, indexing, analytics, advertising. See
`docs/DOMAIN-READINESS-20261115.md` for the domain switch steps; they apply to either host.
