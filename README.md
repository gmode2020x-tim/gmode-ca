# gmode.ca

Public company website for **GMODE**, an independent software company building focused tools for navigation,
telemetry, automation, and connected systems. Advertised products currently include **GMODE Trip Recorder**
and **Jarvis Local LLM Assistant**.

## Current products

GMODE Trip Recorder is maintained in its own public repository:

- Repository: `https://github.com/gmode2020x-tim/gmode-trip-recorder`
- Current release: `https://github.com/gmode2020x-tim/gmode-trip-recorder/releases/tag/v2.0.0`
- Android source: `gmode-trip-recorder/app/`
- Approved product copy: `gmode-trip-recorder/docs/PLAY_STORE_LISTING.md`
- User-visible behaviour: `gmode-trip-recorder/docs/USER_GUIDE.md`

Product screenshots copied for the website live in `public/app/`. Refresh those assets from the standalone
product repository when the Android release artwork changes.

Jarvis Local LLM Assistant is maintained in its own public repository:

- Repository: `https://github.com/gmode2020x-tim/jarvis-local-llm`
- Installation guide: `https://github.com/gmode2020x-tim/jarvis-local-llm#quick-start`
- Authoritative architecture artwork: `jarvis-local-llm/docs/assets/architecture.svg`

The Jarvis architecture artwork copied for the website lives in `public/jarvis/`. Refresh it from the Jarvis
repository whenever the product architecture changes.

## Site structure

- `/` - GMODE company landing page and product catalog.
- `/admin` - administrator sign in and private site analytics.
- `/api/login`, `/api/me`, `/api/logout` - signed administrator session.
- `/api/analytics` - anonymous event collector and authenticated aggregate reports.

New products should be added as additional entries in the Products section. Keep each product's source,
download destination, claims, and artwork tied to its own authoritative repository.

## Local development

Requirements: Node.js 20 or newer and npm.

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`. The Vite server renders the public and admin interfaces, but serverless API
routes require `vercel dev` for end-to-end authentication and analytics testing.

```powershell
npx vercel dev
```

Do not commit `.env` or `.env.local`.

## Environment variables

Configure these variables in the Vercel project and in `.env.local` for serverless local development:

- `GMODE_ADMIN_PASSWORD` - administrator password.
- `GMODE_SESSION_SECRET` - long random HMAC secret used to sign the HTTP-only session cookie.
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token for first-party analytics events.

The accepted administrator email is `tim@gmode.ca`. Login failures intentionally use a generic message.

## Analytics and privacy

The public site records coarse, anonymous first-party events. It does not store IP addresses, personal details,
form content, device fingerprints, or persistent visitor identifiers. A browser-tab session is counted without
transmitting a session ID. See [ANALYTICS.md](ANALYTICS.md) for the event schema, storage model, and dashboard.

## Build and verification

```powershell
npm test
npm run build
npm audit --omit=dev
```

Before deployment, verify:

1. The first viewport presents GMODE as the company and previews the Products section.
2. The Trip Recorder screenshot and Jarvis architecture remain fully contained at desktop and mobile widths.
3. Product, source, installation, official-download, GitHub, contact, and sign-in links work.
4. `/admin` accepts the configured email and password, rejects invalid credentials, and loads 7/30/90-day reports.
5. Empty, loading, storage-error, and signed-out analytics states remain usable.
6. Desktop and mobile layouts have no clipping, overlap, or horizontal scrolling.

## Deployment

The site is linked to the Vercel project `gmode-ca` and routed to `https://gmode.ca`.

```powershell
npm run deploy
```

`www.gmode.ca` redirects to the apex domain through `vercel.json`. After production deployment, verify the
apex and `www` redirect, `/admin`, API cache headers, security headers, public assets, and GitHub links.

## Design references

- `docs/concepts/gmode-company-landing-concept.png`
- `docs/concepts/gmode-admin-analytics-concept.png`
- `docs/concepts/gmode-industrial-hero-concept.png`
- `docs/concepts/gmode-industrial-products-concept.png`

The production UI is code-native React/CSS. Generated raster assets used by the implementation live in
`public/brand/`. The current public hero uses `public/brand/gmode-reference-workstation-hero-v2.png`, derived
from the supplied GMODE industrial reference while preserving code-native website text and controls for
accessibility and responsive layout.
