# Review of the simplified production interface — 2026-10-05

## Baselines and scope

This continues the archive and transfer review, rather than starting another redesign.
Production at review start was GitHub `ab2eed4d85f4885e8400ec32f26b193079705f00`.
Its tree matches the local `d0573aa` tree. Remote main was unchanged when work resumed.

The developed lab reference is `8ab0ae0`; the immediate pre-promotion reference is
`78997a4`. Comparing only an older main branch would not establish preservation of
the developed product. The stable `git-lab` alias remains a separate, older preview.

## Verified preservation

- All 77 directory records and 36 learning records from the developed reference
  remain. The later category adjustments were already present before promotion.
- `js/catalog-data.js` and `js/commercial-links.js` are unchanged from `78997a4`.
- The exact `<article>...</article>` bodies of all 20 guides match `8ab0ae0`.
  Subsequent guide changes added sharing metadata, image assets, reading styles,
  navigation support and removed the obsolete lab stamp; they did not rewrite
  these article bodies.
- This patch changes no catalog data, editorial text, source URLs, commercial
  configuration, article media, tracking, forms or publishing infrastructure.

An older lab data snapshot has five directory IDs absent from the developed
reference already: `qoyod`, `wuilt`, `lymonah`, `aafia`, `forlanso`. Their absence
does not originate in the latest promotion. No historical copy or price is
restored without checking the relevant decision and source. A broader claim
that every feature from every historical prototype survives is not supported.

## Changes in this patch

1. Give the directory result heading the existing responsive horizontal inset.
2. Keep three inactive advertising mockups hidden in public journeys, including
   after navigation. Their dormant templates and commercial records are retained.
3. Restore meaningful text initials when directory, learning or detail logos fail.
   Decorative pseudo-element resets previously suppressed that fallback.
4. Hide a failed decorative service icon without hiding the service name; remove
   six downward arrows that imply scrolling although the control changes panels,
   together with their now-unused CSS rules.

## Verification

- Taxonomy audit: 77 records, 12 visible entry choices, 18 mapped routes; every
  comparison route reaches its related records.
- Chromium: 8 public panels at widths 360, 390, 768 and 1440 (32 states); no
  document overflow or JavaScript exceptions. All advertising mockups stay hidden.
- Directory title inset checked at all four widths. Failed external logo requests
  were deliberately simulated; visible initials verified. This simulation does
  not imply that all external logos fail on the live site.
- Canva results → detail → guide → return preserves the selected three results.
  Fresh category and item detail URLs also open and dismiss correctly.
- Screenshots visually inspected for the home, directory and learning journeys.
- `git diff --check` passes; article bodies and protected data compared separately.

## Limits

These are browser checks, not a study with real participants. Existing article
images and metadata are preserved, but this patch does not prove the appearance
of a post inside Meta or WhatsApp, search indexing, advertising approval or revenue.
Image editing remains file-based with a build script; there is no administrative
image-upload interface or automatic editorial approval backend.

The private archive review and source inventory are delivered separately and
are not included in the public repository.

## User correction — 2026-10-06

The user supplied screenshots and explicitly clarified that the three advertising
examples are intentional reserved placements to populate later. This supersedes
the decision above to hide them. Restore the original markup and existing journey
visibility: Salla display example before learning; Wuilt direct-ad example and
the three-card Multiplex example in the directory journey. Keep their original
preview disclosures and dormant configuration. No real advertising is activated.

The referenced developed snapshot (`8ab0ae0`) contains these three sections in
`index.html`; its standalone `guides.html` does not contain them. Do not invent
new placements in that page while restoring the existing ones. Heading spacing,
logo fallbacks, article images, editorial content and catalog data remain intact.

Verification for the correction: all three restored section blocks match the
reference exactly. Home/directory/learning at 390 and 1440 pixels show respectively
zero/two/one reserved placements, without horizontal overflow or JavaScript
errors. Existing article return, detail and deep-link checks also pass.
