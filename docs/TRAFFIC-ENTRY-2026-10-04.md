# Traffic entry and shareability pass — 2026-10-04

## Goal
Make the existing Badilak Arabi journey easier to enter from articles and shared links without redesigning the stable homepage, card data, editorial copy, commercial ordering, or existing discovery behavior.

## Decision boundary
- Changed: Technical routing, social-preview metadata, shareability.
- Protected: Product meaning, homepage 12 familiar-service entries, six main domains, card copy/data/sources, learning data, commercial disclosures, visual identity, article body copy, lab noindex policy.
- This is an isolated branch: `lab-content-traffic-ux-2026-10-04`.

## Research method used
The reusable method was transferred from the Naql Khibraat design studies, not its visual design:
1. project decisions and live code;
2. behavioral evidence;
3. real product patterns;
4. market/audience evidence when available;
5. smallest coherent implementation;
6. Code Diff + Semantic Diff.

Consensus supplied contextual evidence for progressive disclosure and choice overload. Lazyweb patterns were used as product-pattern evidence only. Waldo was checked but had zero available credits, so no social-listening result is claimed.

## Why the visible design was not rebuilt
Badilak Arabi is a discovery/decision platform, not the problem-first community product studied in Naql Khibraat. The current entry structure already expresses Badilak's job: start from a familiar service or a domain, then discover and compare. Previous project decisions also protect the 12 familiar entries and main domain paths.

The visible simplification is deliberately narrow: the stable 12 familiar-service entries remain the primary boxed entry, while the six stable domain entries are rendered as a lighter secondary strip. Nothing is hidden, renamed, reordered, or removed. This follows the project's earlier rejection of hiding those entries behind tabs while reducing competing visual containers.

The simplification therefore happens in the journey:
- articles stay the acquisition layer;
- the directory stays the discovery/conversion layer;
- important directory states receive direct URLs;
- details opened in the current UI update the address bar to `/discover/<id>`;
- main domain entry updates it to `/category/<cat>`;
- direct URLs restore the same state after a fresh load.

## Social preview pass
- Homepage and guide hub receive Open Graph/Twitter metadata.
- All 20 guide pages now carry per-page title/description/url metadata.
- A 1200×630 Badilak-branded base social image is stored at `/images/social/badilak-social-base.png`.
- This base image is intentionally separate from paid-ad creative. Per-article custom ad creatives remain a content-production task, not a reason to mutate article copy.
- During branch review, canonical/OG URLs point to the branch's stable Vercel alias so preview crawlers can fetch the image. Swap that host only when this branch is promoted to `lab` or production.

## Lab protection
`X-Robots-Tag: noindex` remains untouched. This branch does not create a production sitemap, remove noindex, or install Meta/GA IDs that are not available.

## Remaining production gates
Before real paid traffic: production domain/canonical switch, measurement IDs and events, final social preview checks, mobile landing-page check, and then a small campaign.
