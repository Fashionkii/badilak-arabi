# Prelaunch readiness continuation — 8 October 2026

## Scope and resume point

This continues the work in the supplied discussion file: mobile loading stability, direct discovery pages, verified feedback delivery, and accurate privacy/commercial disclosures. It is not a new design task or an indexing launch.

At resumption, main was `7dd19bca938ec585c727d7bb0cdf31b07c08642c`; the isolated readiness branch already held `04d77e11b34c068460f4bf332173dd697260322d`. Six local files contained unfinished follow-up fixes. Remote heads were checked before continuing and before promotion. No newer main development conflicted with this work.

The four supplied source files were the decision references. The later attached design note described separate prototypes, not approved replacements. No Figma, Canva, MagicPath or Lovable design was imported, and no other conversation was treated as a source of new authorization.

## Implemented behavior

- Direct `/discover/...` URLs are ordinary static pages with the existing detail content, source links and related choices. They no longer load homepage panels/application scripts or open an overlay on entry. Internal directory navigation retains its modal experience.
- Native dialogs isolate the background; explicit keyboard wrapping and restoration return focus to the recreated directory card after browser history restoration. Learning details return focus to their existing trigger.
- The current Cairo, IBM Plex Sans Arabic and Marhey families/weights are served locally, with the original font licenses and source records. Optional font rendering and targeted preloads reduce late layout movement. Brand image dimensions are explicit; the 12 familiar-service favicon requests use 64px images. No identity, palette or layout redesign was introduced.
- `/privacy` and `/disclosure` describe actual current operation. Home, article and reading-hub footers link to them. Article body text and sources are unchanged.
- Feedback now uses a prepared official SAPI client, strict success confirmation, duplicate-submission protection and retained drafts on failure. **Reception is deliberately disabled**, including an independent submit-handler guard; the client script is not loaded while disabled. This is an honest unavailable state, not a claim that delivery has been fixed.

## Confirmed feedback blocker

WebsitePublisher project `28472`, form `directory_feedback`, has a `leads` action and no email action. The official session endpoint returned HTTP 403 with `Origin not allowed` for both the tested Vercel preview origin and `https://badilak-arabi.vercel.app`. Browser submission failed and the project lead count remained zero. Temporary request tracing was stopped after diagnosis.

The available integration tools exposed no allowed-origin setting. Email-domain restrictions for visitor authentication are unrelated. Do not spoof Origin, proxy around the restriction, move DNS to WebsitePublisher or purchase a plan on the assumption that it fixes external-host access.

Before enabling intake, confirm that WebsitePublisher supports this exact external origin and obtain its supported setup, or select a replacement receiver. Then test a real synthetic submission through the public form and verify the received record in the owner's account. Update the privacy page and contact details before activation. No support message was sent and no new subscription/account was created.

Suggested provider question, not sent:

> Project 28472 rejects GET /sapi/project/28472/session from https://badilak-arabi.vercel.app with 403 Origin not allowed. Is external hosting supported, and how can this exact origin be enabled without changing the site's DNS or hosting?

## Verification completed

- Build and prelaunch audit: 113 generated HTML pages, noindex, unique canonicals, valid JSON-LD, local links, static details, empty sitemap, portable headers/redirects and real 404 behavior.
- Protected baseline comparison against `7dd19bc`: 82 catalog records, 36 learning records, commercial-link configuration, navigation memory, 20 article bodies and all three reserved ad examples unchanged. Taxonomy audit covers 12 visible choices and 18 comparison routes.
- Browser on preview `4d7bd8e`: Canva → three results → details → Shift+Tab/Tab wrap → Escape restores the same card and results. Article → “ارجع لمكانك” restores the same three results. Learning retains Salla's reserved ad; its detail dialog returns focus correctly. Wuilt and Multiplex remain in the directory.
- Direct Daftra page → “عرض كل إدارة العمل” opens `/category/work?sub=management` and the correct group. Privacy/disclosure links work and remain noindex. Disabled feedback fields cannot submit; the SAPI script is absent from the DOM.
- Mobile screenshots of home and direct Daftra were inspected. No horizontal overflow appeared in the checked desktop detail/policy/category views. These are browser/lab checks, not a human usability study or every physical phone.
- Public HTTP checks match generated output byte-for-byte for the checked pages/scripts/styles; 200 routes and the invalid-service 404 carry `X-Robots-Tag: noindex, follow`.

## Performance evidence and limits

See `evidence/prelaunch-mobile-2026-10-08.json` for actual Lighthouse mobile run summaries, including intermediate regressions. Baseline measurements came from main `7dd19bc`; original full baseline reports were not retained, but their numeric tool results were preserved. Preview measurements with authentication redirects must not be presented as directly comparable production scores.

The first production pass improved direct Daftra from 55 to 96 and the Arabic-design article from 73 to 99. Accessibility was 100 for all three sampled templates. Home initially recorded lower lab scores. Restoring the retained Google connections alone did not resolve that result. Traces showed a late Cairo punctuation subset and a render-blocking icon stylesheet: the former is now preloaded on homepage-derived templates, while the same existing icon-face definition is in local `fonts.css`. Icon glyphs still load from Google on demand. Observer icons were visually verified after the change. Article transfer size increased, so no claim is made that every page transfers fewer bytes.

The final implementation is `e9b020581fe5786c72d931fdbc632e24897cd4cf`. Home now prioritizes the Cairo and IBM-bold subsets used by its first screen; standalone pages retain their tested body/title preloads. The later warning-free production samples were 97 for Daftra and 98 for the article. The corresponding final standalone font profile is unchanged apart from generated whitespace; the article source is unchanged by this last preload adjustment.

An attempted comparison with the old production URL measured a Vercel login page. That result was rejected. Rebuilding the exact old tree on `qa-home-baseline-2026-10-08` produced a valid old-home score of 82; the new preview scored 87 minutes earlier, both with authentication-redirect warnings. These results show that the earlier isolated 95 was not a stable control. They do not justify promising a fixed score or attributing every variation to the code.

On the final public home, the 18:55 UTC run measured LCP 2.678 s, CLS 0.000189, FCP 1.569 s, accessibility 100 and performance 83. **That run explicitly warned that the test CPU was slower than Lighthouse expects**, with TBT 241.934 ms. Preserve the warning with the score; do not use it as a clean before/after comparison. Reassess performance on the chosen final domain/host before launch rather than continuing to chase scores in this session.

## Final resume verification

The evening resumption found main still at `e9b0205`, with only the report/evidence files uncommitted locally. No newer relevant source decision or main change was found in the available material. This last continuation changed documentation only; it did not repeat or replace the implemented interface work.

All 11 final public HTTP checks passed on this exact implementation, including byte-for-byte output matching, noindex response headers, and the unknown-service 404. Results are in `evidence/prelaunch-http-2026-10-08.json`. The screenshot `evidence/readiness-daftra-20261008.jpg` records the deployed standalone detail view. These evidence files are kept in git and are not copied into the site's deployment output.

The concrete unresolved functional item is feedback reception at the external provider, described above. Keep intake disabled until its real end-to-end receipt is confirmed. Contact details and the receiving service must be settled before enabling it. Domain/indexing activation remains a separate, explicitly deferred launch decision.

Scores are lab observations, not SEO readiness percentages, a ranking guarantee, real-user INP or a field Core Web Vitals pass. Noindex and the empty sitemap remain intentional. Domain purchase, hosting migration, analytics, AdSense, editorial evidence refresh and a content-management interface are outside this change.
