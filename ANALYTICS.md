# Website analytics

gmode.ca uses a small first-party event endpoint and a dashboard protected by the existing administrator session.

## Data collected

- Public page views and browser-tab sessions.
- Views of a product section.
- Product, official-download, contact, and public-GitHub clicks.
- The public path, product name, section name, and referring hostname such as `google.com` or `Direct`.

The collector does not store IP addresses, names, email addresses, full referring URLs, device fingerprints,
form content, or persistent visitor identifiers. A session is counted once per browser-tab session using a
boolean value in `sessionStorage`; no session identifier is transmitted or saved.

## Storage and access

Anonymous events are stored in the gmode.ca Vercel Blob store under
`analytics/events/YYYY-MM-DD/`. Event URLs are not returned by the website and the records contain no personal
information. The collector ignores common bot and preview user agents and rejects cross-site submissions.

`GET /api/analytics?days=30` accepts 7, 30, or 90 days and requires a valid signed administrator cookie.
Responses use `Cache-Control: private, no-store`. Reports read at most 7,500 events; migrate to an aggregate
store if that limit becomes active.

## Dashboard

Sign in at `https://gmode.ca/admin` with the configured administrator email and password. The dashboard shows
page views, sessions, product views, download clicks, daily traffic, top pages, and action totals.

Required Vercel environment variables:

- `GMODE_ADMIN_PASSWORD`
- `GMODE_SESSION_SECRET`
- `BLOB_READ_WRITE_TOKEN`
