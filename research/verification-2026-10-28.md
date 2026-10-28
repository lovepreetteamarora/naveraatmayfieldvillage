# Navera local verification — October 28, 2026

User story: a buyer discovers Navera's factual, crawlable project pages, compares collection and pricing information, views imagery, and prepares an enquiry to Team Arora. If the optional gateway is configured later, server confirmation requires successful persistence.

## Verified

- `npm run build`: eight complete HTML pages including custom noindex 404.
- `npm test`: fourteen passing checks covering project/domain attribution, consent, saved-message payload, hashed IP, rejected origins, failed backend/network requests, missing configuration, oversized inputs, honeypot, Vercel JSON adapter and method/content-type rejection. All external delivery in these tests is mocked.
- `npm run check`: one H1 per page, preferred canonical, descriptions/social metadata, parseable JSON-LD, sitemap/robots configuration, and 226 local references.
- HTTP 200 on the seven public routes, sitemap.xml, robots.txt and the status endpoint. An unknown route returns a branded page with HTTP 404.
- Browser tested at 320, 390, 768 and 1440 CSS pixels: all seven public pages, no document-wide horizontal overflow. Loaded production CSS gives one collection column at narrow widths and two at tablet/desktop widths.
- Homepage and gallery visible source images decode. The hidden lightbox image intentionally receives its source only when opened.
- Mobile menu opens, closes with Escape, and reports its expanded state. Gallery opens the full image in a native modal, Escape closes it, and focus returns to its triggering link.
- Collection query preference survives navigation to the form. Local preview inputs prepare a draft to the verified Team Arora email with an explicit unsent state. The email link was not activated; no message was sent.
- Homepage/gallery browser error and unhandled-rejection collection returned no errors during the check.
- Pricing copy, navigation and primary contact links are visible with JavaScript disabled.
- Screenshots saved locally in `artifacts/`. The preview remains available at http://localhost:4321.

## Current limits

The lead gateway is configured and browser-to-database persistence is verified from the local preview. Production runtime settings have not been installed. No production deployment or DNS changes were made. No Search Console indexation, rankings, field Core Web Vitals or measured traffic/conversion outcome is claimed. Builder pricing and other project details must be rechecked as releases change.

## Design direction

DiGreen forest green #1e2715 for navigation, enquiry band and footer; leaf green #679940 for primary buttons; navy #102b3d for the hero; gold #c7a65a for accents; warm ivory #f8f6f0 and sage supporting surfaces. Georgia display type with a system sans-serif. Maximum content width 1280px, 20px mobile gutters, square buttons and cards, large collection numerals and an uncropped illustrative aerial. Family hero imagery is deliberately cropped; dimensioned drawings are not invented. Motion is limited to short state transitions and respects reduced-motion preferences.

## Approved palette refinement

Applied the user-approved forest/leaf green palette while preserving the navy hero, gold accents, imagery, typography and layout. Updated navigation, mobile navigation/contact actions, footer, primary buttons and browser theme colour. The header logo uses a white CSS treatment for readability without modifying the source asset. Dark forest text on leaf green measures 4.58:1 contrast. Production build and all 220-reference SEO checks pass. Desktop and 390px mobile browser checks confirmed the loaded colours, readable menu/footer, working menu open/Escape close, green form action and no horizontal overflow. Updated screenshots are saved as `artifacts/green-*.png`.

## Hero enquiry form and gateway activation

Added a compact hero form with full name, email, phone, required unselected REALTOR® Yes/No controls and contact consent. Contact-page REALTOR status is also explicit and separate from the question about working with an agent. Shared form rendering and scoped client handlers keep both forms consistent. Home-page enquiry actions scroll to the hero form.

Registered Navera in the existing Supabase project registry with its own SHA-256 token hash. A private 0600 `.env.local` supplies the server token and salt; it is ignored by Git. Existing project registrations and gateway code were not changed.

A clearly labelled browser submission reached `/api/register`, received a saved confirmation and was independently found in `public.leads` with the Navera domain, `details.formName=hero`, `details.consent=true` and generated `is_realtor=yes`. The synthetic row was removed after verification. No email or SMS was sent. Unit tests cover both REALTOR answers, blank/invalid answers, single-name normalization, consent and no preselected answer. Fourteen tests pass. All generated pages, metadata and 226 local references validate.

Checked hero layout at 320, 390, 768, 1024 and 1440 CSS pixels with no horizontal overflow. Narrow screens stack the card inside the hero. Updated review images: `artifacts/hero-form-desktop.png` and `artifacts/hero-form-mobile.png`. Direct submissions are active in the local preview. Production secrets, hosting and DNS deployment remain separate pending work.
