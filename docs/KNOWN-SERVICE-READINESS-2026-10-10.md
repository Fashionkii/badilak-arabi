# Familiar-service journey and remaining readiness — 10 October 2026

## Resume point and protected baseline

This is the bounded round requested after the selective visual integration: improve «ابدأ بما تعرفه», resolve the feedback receiver where possible, and review remaining performance/accessibility. It is not a launch, host migration, advertising activation or a redesign.

Four uncommitted journey files survived the interruption on `readiness-journey-20261010`. The earlier in-flight audit results did not survive; no result was inferred. Current main advanced from `b6d9fe6` to `02ff5a758052600710959008aa80c96cf3fd23ba` while paused. Its only product-data change adds a bounded Almieyar reference to Fanar and calls it published research rather than an independent assessment. That update and its research-triage document were fast-forwarded intact before resuming. Their presence is not evidence of blanket user approval or a new task in this round.

## Implementation

- A result's comparison strip follows the active service (e.g. Jumia), rather than always using the first stored relationship (e.g. Amazon). Neither relationships nor result ordering changed.
- Familiar-service results show a brief scope description and a decisive caveat when useful. General category browsing retains its compact cards. These descriptions are editorial summaries of existing scope/limits, not scores or claims of equivalence.
- A short note explains partial overlap and that ordering is not a quality ranking. Product-card reading links now say «دليل الاختيار»; destinations and learning-card labels remain unchanged.
- Taqreer's existing US registration fact is labelled «تسجيل أمريكي» in the country badge; underlying country data and detailed identity explanation are preserved.
- Aamenn's destination now reaches `https://www.aamenn.com/`, verified in the public browser. Its public Arabic page advertises 4 GB free, links the product login and its GitHub repositories, and warns that losing both password and recovery phrase prevents data recovery. The earlier LinkedIn source remains available, correctly labelled as the team page. No account, upload, encryption/security audit, uptime or recovery test was performed. Legal-registration uncertainty is retained.
- Taqreer's public page now explicitly describes the first five slides as free and the rest as requiring a subscription. The old PNG-only/watermark statement was not substantiated by the current page, so it was replaced with the verified limit; the price is described as free with limits/paid plans, without asserting an unverified current monthly billing price. Existing product/source links remain, plus the checked current page.
- Generated standalone service/policy pages combine the same three external stylesheets into one file in exactly the original order. No rules are removed or minified. An initial trial also bundled home/category styles, but did not demonstrate a consistent gain there; that part was reverted in `27812dd`. Home/categories retain their established loading profile. The homepage now preloads its existing wordmark image because the earlier header request for that same image lacked the intended LCP priority. Original art, dimensions, fonts and layouts are unchanged. Article markup/assets remain unchanged.

Sources for the two product updates: https://www.aamenn.com/ ; https://github.com/aamenn-org/aamenn-frontend ; https://taqreer.ai/ar . Review date describes this bounded public-page check, not a complete product evaluation.

## Feedback receiver: unresolved owner setup

The existing WebsitePublisher receiver rejects the actual Vercel origin (documented HTTP 403 `Origin not allowed`). Rechecking project 28472 on 10 October returned Free, 25 pages used / 5 allowed and 41 assets / 25 allowed. Hosting a new intake page there is therefore not a valid free-plan solution. No old pages were overwritten or deleted, no plan was upgraded, and no origin restriction was bypassed. The form remains honestly disabled; its privacy description remains accurate.

Recommended concrete next receiver for this prelaunch stage: an owner-controlled Formspree form. Its official free plan currently allows 50 submissions/month, a 30-day dashboard archive and AJAX submissions. This is enough for testing and early low-volume intake, not a promise of free operation at arbitrary volume. Owner inbox storage is separate from the dashboard archive.

Owner step: create/verify the owner's account at https://formspree.io/register, create one form for «بديلك عربي», and provide only its public `https://formspree.io/f/FORM_ID` endpoint. Do not share passwords, private keys or mailbox credentials. Account activation and receipt verification are not completed in this round.

After the endpoint is supplied: replace the disabled WebsitePublisher client with a small same-form AJAX adapter, keep the existing kind/subject/source-URL/note fields, restrict the receiver to the real site, retain drafts on errors/timeouts/quota responses, block duplicate submits, and show confirmation only for an accepted submission. Update privacy with the actual processor/retention/contact route. Verify one clearly labelled synthetic submission in the owner's inbox/dashboard before enabling public intake; an HTTP acknowledgement alone does not prove receipt. The existing mock audit does not establish delivery.

Official plan and integration references checked this round: https://formspree.io/plans ; https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/ . No Formspree account or submission was created.

## Verification at this checkpoint

`build-site.cjs`, `audit-prelaunch.cjs`, `audit-taxonomy.cjs`, `audit-feedback.cjs` and the new `audit-known-service-journey.cjs` pass. The new audit covers 47 active relationships across the 18 routes, the Jumia/Amazon regression, protected general browsing, catalog identity/order, all 36 learning records/maps, later Fanar evidence, 20 unchanged articles, all three reserved ads, navigation memory, noindex/config and the exact CSS concatenation. Only the documented fields in Aamenn and Taqreer may differ from baseline.

Four warning-free public Lighthouse mobile baseline samples at main `02ff5a7` are saved in `evidence/journey-baseline-2026-10-10.json`: performance home 90, work category 88, Aamenn 85, design article 94; automated accessibility 100 for all four. LCP respectively 3.589 / 3.728 / 3.745 / 3.008 seconds, CLS 0 / 0.06784 / 0 / 0.00087. These are individual lab observations, not field Core Web Vitals or real-user INP. The reports identified blocking stylesheets, delayed/font resource work and oversized existing images; only the small loading changes described above are included.

## Completed browser and production verification

- Isolated preview `46d1607`: Jumia renders its two original results, both labelled Jumia rather than Amazon. Canva retains three results with distinct scopes, current caveats and the clarified reading link. Google Drive retains one result and reaches the corrected Aamenn destination.
- Taqreer shelf → full details: new limits and original sources are present; initial focus enters the close control, Shift+Tab wraps to the final action, Tab returns to close, and Escape returns to the originating product with the same three results. The guide link → article → «ارجع لمكانك» also restores Canva and all three results. No horizontal overflow was observed in the checked desktop views.
- A mobile screenshot of direct Aamenn showed readable RTL content. The new storage unit was then written as «جيجابايت» to avoid mixed-direction ambiguity. A physical-phone interaction study and a real screen-reader test were not performed; keyboard/AX observations and automated accessibility checks do not substitute for them.
- Feedback remains disabled, its fields and submit button cannot send, and opening the dialog does not load the old external SAPI script. No real message was sent and no receipt was claimed.
- The journey changes were promoted from the isolated branch to main. Final implementation `27812dde0dd15826151950b76e4a1b38b7ea2106` reached READY as production deployment `dpl_7NazTgyDeTtGPpW2EUPKQsUwoJuo`. The earlier public nine-route/assets check and the final four-route check matched local output exactly and retained noindex. See both HTTP evidence files. `known-service-canva-20261010.jpg` records the published journey; the later loading-only rollback preserves those CSS rules and that visible content.

## Performance experiment and final interpretation

All measurements below used the same Lighthouse 13.4 mobile settings and the public URL, without preview/login redirects or run warnings. They were taken at different times and are individual lab samples, not controlled field evidence. The first post-change jobs were interrupted without durable results and were rerun; only saved results are reported.

| Page | Baseline `02ff5a7` | All-template bundle trial `2bd760f` | Final loading profile |
|---|---|---|---|
| Home | 90; LCP 3.589 s; CLS 0 | 89; LCP 3.676 s; CLS 0 | Previous stylesheet loading restored; image priority fix retained; no new final-home score asserted |
| Work category | 88; LCP 3.728 s; CLS 0.06784 | 81 then 85; LCP 4.837 then 3.987 s; CLS 0.06784 | 89; LCP 3.716 s; CLS 0 after restoring previous loading |
| Direct Aamenn | 85; LCP 3.745 s; CLS 0 | 95; LCP 2.771 s; CLS 0.00057 | Same standalone bundle retained; final HTML/CSS checked byte-for-byte |
| Arabic-design article | 94; LCP 3.008 s; CLS 0.00087 | Not retested because article markup/assets were unchanged | Unchanged |

Automated accessibility was 100 on all four baseline pages, all three trial pages and the final work-category check. Home's LCP-discovery audit now confirms high fetch priority for the unchanged wordmark. The bundle's exact CSS cascade is covered by the regression audit. No broad CSS deletion, image replacement, font-family redesign, package dependency or host change was introduced to chase a score.

The category samples did not justify extending the bundle across home/category templates, so that part was removed rather than presented as an improvement. The better service-page observation does not by itself isolate causation; the product copy also changed in this round. LCP still exceeds the 2.5-second good threshold in these sampled templates, despite low CLS. Remaining opportunities are the weight/scheduling of existing fonts and images; their optimization and final-host validation remain prelaunch work. No real-user INP, Google acceptance or complete SEO/readiness percentage is claimed.

## What is still open

1. Owner-controlled receiver account/endpoint, a verified received test message, and the corresponding real privacy/contact update. Existing privacy text remains accurate while intake is disabled. Formspree is a concrete recommendation, not an activated service or a user-approved paid subscription.
2. Further bounded loading work for the remaining LCP issues, and accessibility/usability verification on real assistive technology/devices before launch. This round completed the requested review and limited loading experiment; it did not certify all performance/accessibility requirements.
3. Domain/hosting migration, indexing, analytics/ads, extension and additional research-product scoring remain outside this round.
