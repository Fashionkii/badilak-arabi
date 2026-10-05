# Traffic entry and shareability pass — 2026-10-04

## Goal
Make the existing Badilak Arabi journey easier to enter from articles and shared links without redesigning the stable homepage, card data, editorial copy, commercial ordering, or existing discovery behavior.

## Decision boundary
- Changed: Technical routing, social-preview metadata, shareability, and visual hierarchy/spacing of the two existing first-screen discovery paths.
- Protected: Product meaning, homepage 12 familiar-service entries, six main domains, their order and labels, card copy/data/sources, learning data, commercial disclosures, visual identity, article body copy, lab noindex policy.
- This is an isolated branch: `lab-content-traffic-ux-2026-10-04`.

## Research method used
The reusable method was transferred from the Naql Khibraat design studies, not its visual design:
1. project decisions and live code;
2. behavioral evidence;
3. real product patterns;
4. market/audience evidence when available;
5. smallest coherent implementation;
6. Code Diff + Semantic Diff.

### Evidence actually available in this pass
- **Consensus:** used as behavioral context, not as a design generator. The useful signals were progressive disclosure / choice overload, and evidence that transparency in the presentation of online-platform information can influence choice.
- **Lazyweb:** used only for real-product pattern evidence. A refined search around software discovery/comparison surfaced patterns such as comparison hubs, central discovery/search, category routes, and direct item access. These are treated as patterns, not proof that copying a layout will improve Badilak.
- **Waldo:** checked again in this pass; available balance was zero, so no social-listening or audience-language result is claimed.
- **Public UX evidence:** Baymard's homepage/category research was used as analogous product-finding evidence: users need clear finding paths, but those paths should not create visual overload. Badilak is not an e-commerce store, so this evidence informs hierarchy rather than dictating layout.

Research references:
- https://consensus.app/papers/progressive-disclosure-options-for-improving-choice-ding-kuo/92c0b21d5341576db3d5c48ba06f019c/
- https://consensus.app/papers/the-impact-of-online-platform-transparency-of-information-veltri-lupiáñez-villanueva/7eab17eca5145d658d7ec6d0412bb0b9/
- https://baymard.com/homepage-and-category-usability/benchmark/page-types/homepage
- https://baymard.com/research-articles/ecommerce-navigation-best-practice

## Why the Naql Khibraat design was not transferred
Naql Khibraat was studied as a problem-first knowledge/community product. Its situation-first hero, experience cards, contribution timing, and specific visual language belong to that product.

Badilak Arabi is a discovery/decision platform. Its stable job is different: help a visitor discover Arabic/regional options, understand what they do and their limits, compare, and choose. Therefore the transferable asset is the **research method**, not Naql Khibraat's interface, copy, information architecture, or visual style.

## Why the visible design was not rebuilt
Badilak's current entry structure already expresses its job: start from a familiar service or a domain, then discover and compare. Previous project decisions protect the 12 familiar entries and main domain paths.

The visible simplification is deliberately narrow:
- the stable 12 familiar-service entries remain the primary entry and remain all visible;
- the six stable domain entries remain visible as the secondary route;
- the primary service cards are made physically lighter and shorter, without changing their 4×3 structure, order, text, or behavior;
- the domain route is rendered as a shorter, lighter strip rather than a second boxed surface;
- nothing is hidden, renamed, reordered, or removed.

This reduces the amount of equal visual weight in the first screen while preserving the user's approved discovery model. It follows the project's earlier rejection of hiding the familiar entries behind tabs.

### Decision strength
- **Strong/project-protected:** keep the 12 familiar services; keep the six main domains; keep the existing product meaning and labels.
- **Medium-strong:** reduce competing visual containers and make the domain route visibly secondary. Supported by project fit + behavioral/UX evidence + real product patterns.
- **Hypothesis pending preview/user reaction:** the exact compact dimensions (card height, logo size, gaps). These are implementation details, not a new stable decision until reviewed.

## Traffic and discovery journey
- articles stay the acquisition layer;
- the directory stays the discovery/conversion layer;
- important directory states receive direct URLs;
- details opened in the current UI update the address bar to `/discover/<id>`;
- main domain entry updates it to `/category/<cat>`;
- direct URLs restore the same state after a fresh load.

## Social preview pass
- Homepage and guide hub receive Open Graph/Twitter metadata.
- All 20 guide pages carry per-page title/description/url metadata.
- A 1200×630 Badilak-branded base social image is stored at `/images/social/badilak-social-base.png`.
- This base image is intentionally separate from paid-ad creative.
- The current base OG image makes previews deterministic, but per-article social images remain a later content-production improvement if stronger organic share differentiation is desired.
- During branch review, canonical/OG URLs point to the branch's stable Vercel alias so preview crawlers can fetch the image. Swap that host only when this branch is promoted to `lab` or production.

## Lab protection
`X-Robots-Tag: noindex` remains untouched. This branch does not create a production sitemap, remove noindex, or install Meta/GA IDs that are not available.

## Semantic protection check
The first-screen simplification must not change:
- number/order of the 12 familiar-service entries;
- number/order/labels of the six domain entries;
- directory data or source evidence;
- article body copy;
- affiliate/direct-ad ordering or disclosures;
- search/filter behavior;
- deep-link routing;
- lab indexing policy.

## Remaining production gates
Before real paid traffic: production domain/canonical switch, measurement IDs and events, final social preview checks, direct mobile landing-page check, and then a small campaign.
