# Approved wordmark integration — 2026-10-16

## Scope and authority
The user approved applying the supplied new logo after the logo discussion. This is an identity-only change, not approval of every lab change or a new redesign. Baseline: c36b2e2554c1f2c5f0255e95cfd44dbf6818eabf.

Runtime commits:
- ec80d22ee19d68516bdb905b178f80ff8d2c99b3: responsive wordmarks, icons and shared social card.
- f251c734674a23c6ec31a5ffe5ab5e6925099a62: desktop hero wordmark width 350 → 340px, matching image/preload sizes, removing approximately 5px of vertical overflow at the tested viewport.

## Assets and preparation
Sources: user-supplied 01_main_corrected_4k(1).psd, 02_compact_horizontal_4k(1).psd, 03_app_green_4k(1).psd; white and charcoal icon alternatives were inspected. Original PSD files remain unchanged.

Image generation prepared light ivory/gold variants for the dark site: stacked name with the original tagline, horizontal name without tagline, and the short ب icon. First transparent outputs had edge artifacts and were rejected. Clean opaque navy/green outputs were used instead. These are adapted variants, not pixel-identical recolorings. The offline scripts/build-wordmark-assets.cjs exports WebP/PNG/ICO and a 1200×630 JPEG sharing card; it adds no browser dependency.

Clean generation identifiers: exec-e695c381-6fec-45df-aa9d-410871f9467b (main), exec-9f0b1d8f-2d24-4646-99c2-aaf2481123b1 (header), exec-32226ebf-ddb3-4a85-ba88-d72adf15021f (icon). Prompts requested faithful Arabic letter/dot placement, ivory #FFFAF0 and gold #DEAD4B, navy #071922, clean opaque fills, no glow/texture; icon used green #006854 and simplified small details. Final images were visually inspected.

## Preserved
Background, card templates, article copy, service data, links, journeys, advertising previews and prelaunch noindex remain unchanged. Existing article-specific sharing images remain; only the generic brand sharing image was replaced. The homepage promise was preserved. Historical unreferenced assets are excluded by the existing build pruning, not deleted from history.

## Verification
- Build and audit-prelaunch.cjs c36b2e2 passed: 125 HTML pages, 94 discovery pages, six category pages, 20 unchanged article bodies, noindex, canonicals, JSON-LD, local links and protected data.
- git diff --check passed. Semantic comparison for the initial identity commit preserved all JavaScript app files, config, guide source bodies and non-identity homepage content. Follow-up changed only three matching 350px logo sizing values to 340px.
- Vercel reported READY for f251c734674a23c6ec31a5ffe5ab5e6925099a62.
- Live desktop home: 1363×936 viewport, document 1363×936 after sizing correction; header logo 180×39.94, hero 340×198.72, both loaded. No horizontal or vertical overflow at this viewport.
- Live /guides/arabic-design: new horizontal header logo clean and uncropped; existing article presentation retained.
- Full-page mobile homepage screenshot reviewed before the desktop-only correction: main wordmark and tagline readable, no apparent clipping or collisions. Existing mobile navigation presentation retained. This was visual inspection, not a complete mobile interaction audit.
- Screenshot: evidence/wordmark-home-20261016.jpg (final live desktop).

## Limits
Actual WhatsApp/Facebook preview caches were not inspected. Updated share metadata/image is not proof that either platform has refreshed its cached preview. No claim of universal viewport fit, new Core Web Vitals measurement, comprehensive accessibility audit, or SEO/AdSense approval.
