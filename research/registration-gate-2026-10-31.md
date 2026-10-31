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

## Staged release attempt

CLI deployment `dpl_Fub4mQD1z6p4pwqWU8JebrHMgeMG` for source `a4546a9` was blocked before build with `TEAM_ACCESS_REQUIRED`: the commit author was not verified for CLI project deployments. No public domain was promoted. The existing GitHub integration is the next release path; no author identity, team membership or protection settings were changed.

## Public release verification

The existing GitHub integration accepted commit `2138eac535fd8cdbb05f5035d7b6b974dbefec65` and built production deployment `dpl_FQwRnKyQUdsHqgBPESbXtFTk4KB5`. State was READY, and apex/www aliases were assigned. The CLI author verification issue did not affect the normal Git integration.

- All seven public pages returned HTTP 200 with correct canonicals and one H1. The www floor-plan route returned 308 to the apex.
- Live browser cards and registration dialogs worked on desktop and 390px mobile, with the correct requested material and Register & unlock button. The mobile dialog measured 352px without horizontal overflow.
- `/api/status` returned `onlineDelivery: true`.
- Anonymous access status was `unlocked: false`; full-image access returned 403. The previous public `/assets/aerial.webp` returned 404.
- A temporary signed access-cookie fixture loaded the production full image: HTTP 200, image/webp, 217876 bytes, Cache-Control private/no-store. This proves function bundling and access verification, not a production lead save.
- Live honeypot submission returned `leadAccepted: false` and no cookie. An incomplete submission returned 400 and no cookie. Neither path wrote a production lead.
- Local 768px and 1024px homepage checks also had no horizontal overflow.

Production screenshots are in ignored `artifacts/materials-live-*.png`. No successful synthetic enquiry was submitted to the production gateway. Production row persistence, Sheets, Zapier and Follow Up Boss delivery were not retested. The current production lead gateway was retained.

## User correction: public community aerial

The user rejected the large blurred aerial and requested that this image have no lock. This supersedes the earlier decision to gate the main community imagery.

- Restored the clear public aerial on the homepage, location page and gallery, including ordinary full-image viewing.
- Capped the homepage/location figure at 960px rather than the previous 1280px-wide gated preview. The local desktop image measured 960 by 530px; mobile measured 350px wide with document width 390px. Computed image filter was none, and the main image section contained zero material/lock controls.
- Registration remains in the smaller resource cards and collection-plan request buttons. Text now describes requests for current floor plans/site plans rather than unlocking the public aerial.
- Retained the current lead gateway and legacy signed material endpoint for existing links. Restored the public image to the image sitemap and versioned CSS/JS URLs to update returning browsers.
- Build, 18 automated tests, the eight-page structural check and diff whitespace checks passed. Screenshots are in ignored artifacts/clear-aerial-*.png. No production enquiry was submitted.
