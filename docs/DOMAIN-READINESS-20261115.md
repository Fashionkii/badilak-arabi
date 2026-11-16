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

Built output is byte-identical to the base commit except that one line of `js/route-seo.js` and the
share-image correction below.

## Share-image address label (owner-approved follow-up, same day)

The owner approved correcting the address drawn on article share images, including the broken one.

- `scripts/build-article-media.py`: new `--label-only [--only SLUG ...]` mode. It repaints only the
  address label area of existing `*-social.jpg` files and refreshes the `?v=` value of the three
  share-image tags in that guide's head. Covers, headlines, thumbnails, figures and article copy are
  not regenerated. The label text now comes from `site.config.json` (also in the full build), so
  the drawn address follows the same single setting as every page URL.
- `images/articles/create-online-academy-social.jpg`: first the row of empty glyph boxes was
  replaced by the readable current address. Then, with the owner's approval, the whole image was
  redrawn from its stored photo and `socialTitle` in the same typeface as the other 20 (it had
  been produced with a heavier one). The headline text is unchanged; it now breaks after
  «اختبر» instead of after the colon, as the shared layout rule decides.
- `scripts/build-article-media.py`: `--social-only --only SLUG [...]` redraws whole share images
  for named articles only. The drawing code moved into `render_social()` unchanged: a full build
  with the previous script and with this one gives byte-identical files, and a fresh render here
  reproduces the other 20 committed share images byte for byte.
- `guides/create-online-academy.html`: `?v=` on `og:image`, `og:image:secure_url`, `twitter:image`
  only (3 lines). Body unchanged.

The other 20 images were not touched: they already show the current address correctly and change
only at the domain switch. In `--label-only` mode a file is re-saved with its own JPEG tables;
in the rehearsal on one image the largest per-pixel difference outside the label area was 7 of 255,
on under 0.5% of pixels.

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

Serve the public site on the new domain with a valid TLS certificate before changing the public
origin. Keep the Vercel project online for the studio, while it still handles the studio's sessions
and assets.

1. In the studio on the old host, export any drafts with "save project". Drafts live in that
   host's browser storage (`badilak_design_studio_v1`) and do not follow the redirect.
2. `site.config.json`: set `canonicalOrigin` to the new public origin (one HTTPS origin, no trailing
   slash). Retain `studioOrigin` on the Vercel host while the studio runs there, and keep `"phase": "prelaunch"`.
3. Scope Vercel's old-host redirects to the public page routes with verified equivalents on the new
   domain. Preserve `/admin`, `/admin/studio`, `/api/studio` and the resources the studio requests
   on Vercel. Test the redirect set and the studio on a Vercel preview before making redirects permanent.
4. `server/studio/client/app.js` (offline export home link): replace the literal old origin.
5. `python3 scripts/build-article-media.py --label-only` (Pillow with RAQM, DejaVu Sans): redraws
   the address on all 21 share images from the new setting and refreshes 63 `?v=` values. Look at
   two or three results before committing. Do not run the script without `--label-only`.
6. Update the hosting sentence in `data/privacy.json` to match the final public and studio hosts.
   Build, run `audit-prelaunch`, and deploy. Check the home page, an article, a discover page, a news
   item and link previews on the public host. Test the footer studio link, the login and access to a
   saved draft on the Vercel host, and verify a public legacy URL redirects to its counterpart.

Step 5 was rehearsed in a throwaway copy with a new `.com`: 21 images relabelled, 63 head lines
changed, build and `audit-prelaunch` pass.

## Public domain — 16 November 2026

Cloudflare Workers serves `https://badilakarabi.com`. Always Use HTTPS sends HTTP requests
to the same path and query over HTTPS. The canonical origin, structured data, share URLs and
21 article image address labels use the new domain. The public footer links to the Vercel studio.

Old-host forwarding, added later on 16 November: the first rule in `vercel.json` sends every request
for `badilak-arabi.vercel.app` to the same path on `badilakarabi.com`, except paths that begin with
`/admin` or `/api/`, which the studio uses. The rule is host-conditional, so Vercel preview hosts keep
serving the build, and the Cloudflare `_redirects` writer skips it. It is temporary (`permanent: false`)
until the owner has confirmed the studio login and a saved draft on the Vercel host; make it permanent
after that check. Not verified from the development environment: the live redirect and the studio.

The entry page embedded the site stylesheet between 16 November PR #10 and PR #11. It links
`/css/site-bundle.css` again: the HTML response is about 52 KB instead of 445 KB, the stylesheet is
cached and shared with the standalone pages, and the sharing metadata head stays about 4 KB, inside
WhatsApp's documented first 300 KB. A throttled local comparison (three runs each, Chrome, HTTP/1.1)
gave a first paint of about 1.3 s embedded and 1.0 to 1.6 s linked on a first visit, the same on a
repeat visit, and 1.0 s embedded against 0.5 s linked when arriving from another page of the site.
The live network was not measured.

## Opening indexing — prepared, owner decision

`site.config.json` accepts `"phase": "launch"`. In that phase the build writes `index, follow` on
every page except the not-found page, lists the 139 canonical addresses in `sitemap.xml`, names the
sitemap in `robots.txt`, and stops writing the Cloudflare `X-Robots-Tag: noindex` header file.
`audit-prelaunch` checks whichever phase is set. With `"phase": "prelaunch"` the output is
byte-identical to the build before this change. Vercel keeps its own `noindex` header for the old
host and the studio. Changing the phase is the owner's decision; nothing else opens indexing.

## Known leftovers, owner decision

- Opening indexing, enabling feedback, adding analytics or a pixel, and any paid plan remain
  separate decisions.
