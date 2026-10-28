# Navera at Mayfield Village

SEO-focused, responsive project website for **https://naveraatmayfieldvillage.com**, operated by Team Arora. Built from the supplied [DiGreen reference](https://digreenhomes.com/navera--lp) and checked October 28, 2026.

The visual system uses the actual Navera identity and project imagery with DiGreen forest green and leaf green, a navy hero, muted gold, warm ivory, serif display type and restrained interactions. Project content is delivered as complete static HTML; JavaScript adds mobile navigation, gallery enlargement and enquiry handling.

## Preview and build

Node.js 22 or newer. There are no third-party runtime or build dependencies.

```sh
npm run dev
```

Preview at **http://localhost:4321**. Content changes in `src/` or `public/` require rebuilding (`npm run build`) and refreshing. The local server watches its own server code.

```sh
npm run build
npm test
npm run check
npm start
```

Build output is `dist/`, excluded from Git. `npm run check` validates each generated page's H1, canonical, social metadata, structured data and local links, plus sitemap and robots configuration.

## Pages and search intent

| Route | Purpose |
| --- | --- |
| `/` | Navera at Mayfield Village, DiGreen, Brampton detached homes |
| `/pricing/` | Advertised starting price, quote questions, deposit-information availability |
| `/floor-plans/` | 38 & 41 Series, current plan-package requests, comparison checklist |
| `/location/` | Countryside Drive & Torbram Road, community context and area research |
| `/gallery/` | Original project imagery, captions and full-size image viewing |
| `/contact/` | Team Arora enquiry, collection preference and direct contact options |
| `/privacy/` | Operator identity, enquiry delivery and information use |

A custom noindex 404 page is included. Page-specific canonicals, Open Graph/Twitter metadata, Organization/WebSite/WebPage/breadcrumb JSON-LD, image sitemap entries and robots.txt are generated centrally. Vercel configuration includes a `www` to apex redirect when both domains are connected. Canonicals and sitemap use the user's selected domain. No search ranking or indexing outcome has been measured.

## Content and source boundaries

The builder currently identifies 38 & 41 Series detached homes in Brampton at Countryside Drive & Torbram Road and advertises an entry price of $999,999. The source does not establish individual model names, areas, bedroom counts, model prices, a complete deposit schedule, closing dates, tenure or tax/rebate treatment. These are not fabricated in this build.

`research/project-brief.json`, `research/fact-ledger.csv`, `research/keyword-map.csv` and `research/asset-manifest.json` retain the project evidence and qualitative page mapping. Keyword volume and Search Console data were not available. Local source originals are preserved in ignored `research/originals/`. Promotional imagery is attributed and labelled; source availability is not a separate licensing grant.

## Enquiry delivery

Without gateway configuration, the form **prepares an email draft** addressed to `parveen@teamarora.com`. The visitor reviews and sends it from their own email application. The website does not claim that preparing a draft delivered a lead.

The shared Team Arora gateway integration is included server-side and covered by tests. To activate it, register the existing Navera project (`navera-mayfield-village`) and this domain with the shared gateway, then supply:

- `LEAD_API_URL`
- `LEAD_API_TOKEN` — Navera's own token
- `LEAD_IP_SALT`

Use a local ignored `.env.local` for development, or environment variables in the hosting project. An empty `.env.example` is supplied. No token is exposed in public assets. `/api/status` returns only a boolean indicating whether all three values are configured; the browser then enables secure submission. Success requires a 201 response from the gateway. No real test lead was sent. Database persistence remains unverified and inactive in this checkout.

The production host must support `/api/register` and `/api/status` for online delivery. A purely static host retains the email-draft fallback. Do not replace it with a fake success state.

## Hosting

`vercel.json` builds to `dist/` and exposes Node.js functions from `api/`. The local preview uses the same shared registration validator. Any other static host can serve `dist/`; requests for unknown routes should use `404.html` with HTTP 404.

This task prepares the repository and local preview. No Vercel project, Cloudflare DNS, domain registration, live deployment or Search Console configuration was changed.

## Verification

See `research/verification-2026-10-28.md` for build, API and browser evidence. Review screenshots are saved locally under ignored `artifacts/`. Source code is in `src/`, static styles/behavior in `public/`, server adapters in `api/`, and shared lead validation in `lib/`.
