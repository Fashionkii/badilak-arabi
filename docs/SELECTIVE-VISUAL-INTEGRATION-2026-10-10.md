# Selective visual integration — 10 October 2026, Cairo

## Task and verified resume point

The current request was to retain the successful main site and bring over only useful new additions from the design lab. It was not permission to replace main with the lab, redesign the information architecture, refresh product evidence, migrate hosting, enable tracking or launch indexing.

Main was `bc15048b87af80e4bc3f66782f91541c36940ee1`. The design lab was `47fa98a2878983e165235aa096a211d3bc166255`, from the older common ancestor `7dd19bca938ec585c727d7bb0cdf31b07c08642c`. A complete lab merge would have lost later readiness work. Its age does not establish that the original copy operation failed.

Before the final resumption, isolated branch `selective-visual-integration-20261008` already contained implementation `1f3b787daad81e3e1f3c926486a89321f1e85c4e`. The remaining local edit was one CSS rule fixing two low-contrast article labels. On resumption, both remote heads were checked: main had not changed, and the isolated branch still matched the saved implementation. The fix was committed as `fd616252971aa92db44c94eb0cf93b7eabbfbe58`, tested in a separate preview and then fast-forwarded to main without force.

## Selected additions and protected layers

- Retained the main layout, six category icons, twelve familiar-service descriptors and all existing navigation/interaction code.
- Rebuilt the lab's cleaner green/bronze/light palette and quieter card surfaces as a small shared stylesheet. The existing warm learning section and its illustrated heading remain; this is not a wholesale replacement of all previous colors.
- Added locally served Almarai 400/700/800 with source/license records and template-specific preloads. Existing Cairo, IBM Plex Sans Arabic and Marhey files remain available. Long article paragraphs keep IBM Plex Sans Arabic. Existing external Material Symbols glyph loading remains; the site is not claimed to have zero third-party requests.
- Added the lab's existing lantern SVG to the left of the main site's retained calligraphic wordmark in the hero and desktop header. This combination is the assistant's selective implementation judgment under the current request, not evidence of prior user approval of a complete new brand system. No favicon change was made.
- Did not copy the full experimental lab stylesheet, remote font import, removal of service descriptors, alternate plain-text wordmark, experimental category assets or nested decorative frames.
- Application JavaScript, catalog/learning data, commercial links, article copy/sources, policy text and hosting configuration were not changed. All three reserved ad examples remain. Noindex, the empty prelaunch sitemap, direct static service pages, native dialogs/focus behavior and truthful disabled feedback remain protected.

## Later supplied material and its actual effect

The latest `Pasted text(1).txt` contains weekly research summaries, a report about connecting/testing TinyFish, and a diagnostic review of the familiar-service journey. The review explicitly states that it changed no files or data and published nothing. It contains recommendations, not a new approved implementation or user reaction to this visual preview.

Consequently no product labels, links, ranking logic, pricing or research figures were silently changed during integration. TinyFish was not rerun merely because it was mentioned. PostHog was not installed or enabled. No reminder or automation was created/changed.

The supplied review identifies a separate useful follow-up: verify Aamenn's direct product URL and current evidence; make the reference-service label reflect the active choice; distinguish a direct/partial/specialized/developer-oriented relationship; expose decisive limits and clarify reading-link labels. Those suggestions remain a bounded editorial/behavior task, not completed work in this branch. Reported findings are not treated as newly reverified product facts.

The weekly studies can inform future evidence fields (dialect, task, tested model/version, source and limits) and distinctions between product origin, hosting and portability. Their nine summaries were not all independently verified or inserted into the catalog. One prior targeted check found that DialectSentEval's 3,000 examples describe sentiment classification; its sentiment-swapping task uses a separate 9,647-pair dataset. No generic product quality score was inferred from it.

## Verification and limits

- Build and prelaunch audit pass: 113 generated HTML pages, 82 discovery pages, six category pages, twenty articles, noindex, unique canonicals, valid JSON-LD/local links, empty sitemap, static details and protected baseline data. Taxonomy and feedback audits pass. The feedback audit verifies the disabled guard and prepared client states, not actual message receipt.
- Baseline semantic comparison performed before the pause found unchanged visible text and link targets for home, the reading hub and all twenty articles. Article bodies and the three ad examples remain unchanged. The final extra code edit affects text color only.
- Desktop preview checks covered the familiar-service journey, three Canva results, detail opening, keyboard focus wrapping/Escape restoration, article layout, learning content/ads and direct Dhawwi entry. Direct entry contains the service content without the homepage app runtime or modal. No horizontal overflow appeared in the checked views. A new mobile screenshot confirmed the left-hand lantern, retained wordmark and all twelve service descriptors.
- On the earlier isolated implementation, mobile Lighthouse observations were: home performance 96, accessibility 100, LCP 2.547 s, CLS 0; work category performance 92, accessibility 100, LCP 3.228 s, CLS 0.06784; Arabic-design article performance 91, accessibility 95, LCP 3.411 s, CLS 0.000873. These samples had protected-preview redirect warnings. They are not a controlled before/after comparison or production field measurements; the article/category LCP observations are above the 2.5 s good threshold. Original full reports from the earlier session were not retained; these values are the preserved tool observations.
- Two article labels failed contrast at approximately 3.56:1 and 3.57:1. The final one-line rule changes only `.human-question > span` and normal `.lens > small` to the darker bronze. A targeted mobile accessibility recheck on the fixed preview returned 100/100, color-contrast pass and no failed automated audits. See `evidence/visual-integration-accessibility-2026-10-10.json`. This does not certify every accessibility requirement or replace a screen-reader/user study.
- Production deployment `dpl_A2noPh2bb6kArpQkuoQKDNqNGR1c` reached READY with commit `fd616252971aa92db44c94eb0cf93b7eabbfbe58`, target `production`, and alias `badilak-arabi.vercel.app`. The public homepage displayed the new stylesheet, loaded lanterns and Almarai while retaining noindex and no horizontal overflow. Public response/build comparisons are recorded in `evidence/visual-integration-http-2026-10-10.json`; the desktop screenshot is `evidence/visual-integration-home-20261010.jpg`.

No whole-site SEO percentage, Google acceptance, real-user INP or launch-readiness guarantee follows from these checks. No further performance optimization was bundled into the visual transfer.

## Hosting recommendation, not a migration

Main and the lab are on the same Vercel project. This work has not changed the host, account plan, domain or billing. The existing static codebase does not require a new site builder and can remain under Git-based maintenance.

Before commercial launch, the low-cost candidate is Cloudflare Workers Static Assets. Current Cloudflare documentation recommends it for new projects rather than Pages; static asset requests are free and unlimited, with no additional asset storage charge, while Worker execution has separate pricing/limits. This updates the earlier Pages recommendation; it does not mean that migration/routing/forms have been tested there. Domain registration and any feedback/other dynamic service remain separate costs.

Vercel Hobby is restricted to personal non-commercial use. Vercel Pro starts with a $20/month platform fee including one deploying seat and $20 usage credit; additional usage, seats and applicable taxes can change the total. No paid upgrade was performed. The final host/domain should be tested separately before indexing or ads are enabled.

Official references checked 9–10 October 2026:
- https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://vercel.com/docs/plans/hobby
- https://vercel.com/docs/plans/pro-plan

## Remaining work

The selective visual transfer is complete. The pre-existing feedback receiver remains unverified/disabled, as documented in `PRELAUNCH-READINESS-2026-10-08.md`. The supplied journey-review fixes, final-host performance checks and any domain/indexing/advertising activation remain separate future work. Nothing in this integration authorizes a broader redesign or validates every proposed lab asset.
