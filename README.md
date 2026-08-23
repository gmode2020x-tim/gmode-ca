# gmode.ca

Public launch website for **GMODE Trip Recorder**, an offline-first Android GPS and telemetry cockpit developed in the Jarvis repository.

## Product source of truth

Website claims and product screenshots are based on:

- `Jarvis/android/gmode-trip-recorder/app/` - Android application source
- `Jarvis/android/gmode-trip-recorder/docs/PLAY_STORE_LISTING.md` - approved product description
- `Jarvis/android/gmode-trip-recorder/docs/USER_GUIDE.md` - user-visible behaviour
- `Jarvis/android/gmode-trip-recorder/play-store/` - current Google Play graphics

The copied public assets live in `public/app/`. Refresh them from Jarvis when the app screenshots or Play Store artwork changes.

## Local development

Requirements: Node.js 20 or newer and npm.

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`. The public site is `/`; the owner login is `/admin`.

## Build and test

```powershell
npm run build
npm audit --omit=dev
```

The production build is written to `dist/`. Test desktop and mobile layouts, the cockpit screenshot selector, launch email link, `/admin`, and all files under `/app/` before deployment.

## Admin login

The serverless login uses these Vercel environment variables:

- `GMODE_ADMIN_PASSWORD`
- `GMODE_SESSION_SECRET`

Do not commit `.env` or `.env.local`. The authenticated owner email is `tim@gmode.ca`.

## Deployment

The site is deployed to Vercel and routed to `https://gmode.ca`.

```powershell
npm run deploy
```

The `www.gmode.ca` hostname redirects to the apex domain through `vercel.json`. After deployment, verify `/`, `/admin`, the four cockpit screenshots, the app icon, the feature graphic, and the production response headers.

## Official downloads

Public GitHub releases are the official GMODE Trip Recorder download source:

- Profile: `https://github.com/gmode2020x-tim`
- Repository: `https://github.com/gmode2020x-tim/jarvis-local-llm`
- Current release: `https://github.com/gmode2020x-tim/jarvis-local-llm/releases/tag/v2.0.0`

The website links the primary download action to the recommended v2.0.0 install ZIP. Keep the release page link visible so users can also obtain the standalone APK and verify the published SHA-256 checksums.

## Privacy and accuracy

The public copy follows the app's current privacy model: no advertising, analytics, GMODE account system, or GMODE cloud. Trip data stays on the phone unless the user exports it or configures Home Assistant synchronization. Do not add unimplemented Google Play availability, safety, cloud, social, or subscription claims.
