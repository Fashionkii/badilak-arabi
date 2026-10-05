# Guided discovery experiment — 4 October 2026

## Authority and base
- Current direct request: continue a lighter offered-choice experience without requiring typing and without losing content quality/quantity.
- User rejected the offered-choice preview after seeing it. Its visual solution is not an approved reference.
- Git evidence: rejected branch `5d15cfa` descends from `78997a4`; it only added CSS and a stylesheet reference. An older code base is not established by available evidence.
- Base here: `78997a4`, which contains lab `9641403`, the taxonomy repair and the October traffic/deep-link/social metadata work. These are implementation facts, not blanket user approval.
- Separate branch: `lab-guided-discovery-2026-10-04`. No changes to `lab` or `main`.

## Decision and scope
Change presentation and navigation together: a homepage offering the existing 12 services and six domains, then a focused result surface with existing progressive details. Other sections remain reachable through navigation; secondary sections are under More. All original sections and copy remain in the document. The homepage no longer automatically presents every section in sequence.

Keep the Arab identity/artwork and palette, reduce geometric decoration and competing containers, retain all choices in their existing logical order. Use local SVGs for six decorative category icons, and a fallback when familiar-service logos cannot load.

Deliberate behavior changes: panels replace long-page scrolling; ordinary fragment links reveal the corresponding panel; changing an entry restores homepage choices; browser history and reading memory retain the selected panel and filters. Detail dismissal restores the prior filtered surface. Advertising previews remain in secondary directory/learning surfaces with their original disclosures and destinations.

## Protected
No changes to catalog data (77 discoveries, 36 learning sources), sources, guide content (20 articles), commercial link configuration, noindex, routing config, legacy styles, or smart-return implementation. Original service/domain labels and order are retained. No original text or links removed; six icon-font glyph names replaced by decorative SVGs. No new analytics or external services.

## Validation completed locally
- Taxonomy audit: 77 discoveries, 12 visible choices, all 18 comparison routes reachable.
- All 12 choices and six domain controls produce corresponding results.
- Inline detail shelf and full detail open; dismissal retains selected results.
- Article -> smart return retains choice, panel and result list.
- Browser Back restores the discovery panel; fresh category/detail deep links work.
- Learning, observatory, knowledge, before-payment, updates and nomination surfaces remain reachable.
- Chromium at 360, 390, 768, 1440 CSS px: home and result interactions pass, no horizontal overflow.
- No JavaScript runtime errors in exercised flows. Code diff and semantic comparison pass.
- Public original font/logo assets cached only in temporary test files for local screenshot fidelity; catalog asset availability and source facts were not re-audited.
- Real physical mobile device not tested. Visual proposal remains pending user preview.

## Publication status
Local commits only. Automatic approval review rejected the GitHub push because it considered external publication insufficiently explicit. Do not route around that rejection through another publishing tool. Ask for authorization to push this branch to `Fashionkii/badilak-arabi` and let Vercel create its isolated preview. Verify the resulting deployment and journeys after authorization.
