# Navera local verification — October 28, 2026

User story: a buyer discovers Navera's factual, crawlable project pages, compares collection and pricing information, views imagery, and prepares an enquiry to Team Arora. If the optional gateway is configured later, server confirmation requires successful persistence.

## Verified

- `npm run build`: eight complete HTML pages including custom noindex 404.
- `npm test`: ten passing checks covering project/domain attribution, consent, saved-message payload, hashed IP, rejected origins, failed backend/network requests, missing configuration, oversized inputs, honeypot, Vercel JSON adapter and method/content-type rejection. All external delivery in these tests is mocked.
- `npm run check`: one H1 per page, preferred canonical, descriptions/social metadata, parseable JSON-LD, sitemap/robots configuration, and 220 local references.
- HTTP 200 on the seven public routes, sitemap.xml, robots.txt and the status endpoint. An unknown route returns a branded page with HTTP 404.
- Browser tested at 320, 390, 768 and 1440 CSS pixels: all seven public pages, no document-wide horizontal overflow. Loaded production CSS gives one collection column at narrow widths and two at tablet/desktop widths.
- Homepage and gallery visible source images decode. The hidden lightbox image intentionally receives its source only when opened.
- Mobile menu opens, closes with Escape, and reports its expanded state. Gallery opens the full image in a native modal, Escape closes it, and focus returns to its triggering link.
- Collection query preference survives navigation to the form. Local preview inputs prepare a draft to the verified Team Arora email with an explicit unsent state. The email link was not activated; no message was sent.
- Homepage/gallery browser error and unhandled-rejection collection returned no errors during the check.
- Pricing copy, navigation and primary contact links are visible with JavaScript disabled.
- Screenshots saved locally in `artifacts/`. The preview remains available at http://localhost:4321.

## Current limits

The lead gateway is not configured. Real database persistence has not been tested. No production deployment or DNS changes were made. No Search Console indexation, rankings, field Core Web Vitals or measured traffic/conversion outcome is claimed. Builder pricing and other project details must be rechecked as releases change.

## Design direction

Navy #102b3d, gold #c7a65a, warm ivory #f8f6f0 and a sage supporting surface. Georgia display type with a system sans-serif. Maximum content width 1280px, 20px mobile gutters, square buttons and cards, large collection numerals and an uncropped illustrative aerial. Family hero imagery is deliberately cropped; dimensioned drawings are not invented. Motion is limited to short state transitions and respects reduced-motion preferences.
