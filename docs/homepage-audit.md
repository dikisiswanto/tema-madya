# Homepage Screenshot Audit — v0.3.0-rc.2

Reference: `homepage.png` at 1920px viewport.

## Applied

- Homepage content canvas aligned to the wide screenshot composition (`90vw`, capped at 1728px).
- Header/topbar proportions, white institutional header, navy utility bar, gold SPMB CTA.
- Newsreader for editorial display and Instrument Sans for interface/body.
- Hero composition: copy + photography + navy announcement panel.
- Quick services as a six-item horizontal rail on desktop and two-column grid on mobile.
- Navy statistics strip with semantic Lucide icons.
- Principal/profile editorial split.
- Program cards + extracurricular photography rail.
- Teacher portraits + achievement photography cards.
- Featured news + agenda split.
- Gallery + testimonials split.
- Documents + SPMB split CTA.
- Contact strip immediately above the footer.
- Homepage footer uses the five-column composition visible in the reference; the standalone newsletter strip is hidden on homepage.
- Text arrows were replaced by semantic Lucide arrow/chevron icons where the UI calls for an icon.
- Broken Lucide brand-icon references (`facebook`, `instagram`, `youtube`) were removed; social brand marks are inline SVGs because Lucide does not provide those brand logos.

## CMS constraint

Sekolahku CMS 3.1.2 exposes `site_logo_text` and `site_logo_icon`, not an image-logo URL. The theme therefore supports an optional `site_logo_url` when a host integration supplies it, while retaining a safe icon fallback. Exact school-specific crest reproduction cannot be guaranteed from the unchanged CMS contract.

## Verification

- PHP syntax checks: passed for homepage, navigation, footer.
- Node syntax checks: passed for homepage renderer and icon registry.
- Theme contract validation: passed.
- Browser screenshot verification could not be completed in this environment because the local npm dependency installation did not finish and the standalone Chromium capture could not complete reliably. Final visual sign-off should therefore be done in a real browser at 1920×4047 and then at 1440/1280/768/390 widths.
