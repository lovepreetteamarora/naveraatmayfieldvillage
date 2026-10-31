# Navera material registration gate — October 31, 2026

Requested scope: add lead registration gates for floor plans and site-plan material, with blurred cards and lock icons matching the supplied screenshot, while retaining Navera’s existing site design and navigation.

## Content and capture

- Added two cards on the homepage and floor-plan page. Collection-specific requests retain 38 or 41 Series.
- Reused the current gateway and existing form validation, contact consent, honeypot, rate limit and email fallback.
- Material enquiries retain `formName: materials`, `requestedMaterial`, collection, explicit REALTOR answer, contact fields, consent and current-page/campaign context. Requested materials are also included in the readable enquiry message.
- No floor-plan PDFs or lot-specific site plan are stored in this checkout. The interface promises follow-up for these documents. The existing community aerial is explicitly an artist concept.
- Moved the full aerial outside the public build. Only a 64px preview is public. Full image requests require a signed HttpOnly cookie issued after gateway acceptance, lasting 30 days. Error and honeypot paths issue no cookie. Original imagery is not listed in the image sitemap or public metadata.

## Local evidence

- `npm run build`, `npm test` (18 tests), `npm run check` (8 pages, 260 internal references) and `git diff --check` passed.
- Browser failure test: gateway 503 retained entered details, showed retry/email options, and left the full image locked.
- Browser success test against an isolated local sink: exactly one test row, correct project/domain, requested floor plans, Both collections, REALTOR No and consent true. Access status then returned unlocked and full image returned image/webp with HTTP 200.
- Anonymous image access returned 403. Expired/tampered signatures and invalid origin/validation are covered by tests.
- Return visit to the location page restored image access. Escape closed the modal and returned focus to the original link.
- At 390px, homepage, floor-plan, location, gallery and contact pages all had scrollWidth 390 and one H1. Mobile dialog was 352px wide with no horizontal overflow and focused the name input.
- Screenshots are retained in ignored `artifacts/materials-*.png`.

No test enquiry was submitted to the production lead gateway during local QA. Production row persistence, Sheets, Zapier and Follow Up Boss are not established by these tests.

## Release target

Existing project `prj_GzHl29NHfBpceEczWJ62jy44YKo7`, team `team_DhGHz0cbsGPFaSbNpkPQJDvS`, public domain https://naveraatmayfieldvillage.com. Previous production deployment `dpl_BWhJwixmSzsUAQMQ1Ta8a3yj5hsV` at source `595711b`.
