# Contact form → Google Sheets setup

The landing-page contact form posts to `/api/contact`, which forwards the
submission to a Google Apps Script web app that appends a row to a sheet
you control. No third-party service, no extra npm dependencies, no client
credentials in the bundle.

## What you'll wire up

```
[user fills form] → POST /api/contact (Next.js API route)
                  → POST <Apps Script web app URL>
                  → appendRow on your Google Sheet
```

The Apps Script URL lives in the `SHEETS_WEBHOOK_URL` env var (server-side
only — not `NEXT_PUBLIC_*`, so it never ships to the client bundle).

## Setup steps

### 1. Create the Google Sheet

1. Open Google Sheets and create a new sheet (any name — e.g. `peeyew
   contacts`).
2. In row 1, add these column headers:

   | A         | B    | C     | D       |
   | --------- | ---- | ----- | ------- |
   | Timestamp | Name | Email | Message |

### 2. Add the Apps Script

1. With the sheet open: `Extensions → Apps Script`.
2. Replace the boilerplate `function myFunction() {}` with this:

   ```js
   function doPost(e) {
     try {
       const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       const data = JSON.parse(e.postData.contents);
       sheet.appendRow([
         new Date(),
         data.name || "",
         data.email || "",
         data.message || ""
       ]);
       return ContentService
         .createTextOutput(JSON.stringify({ ok: true }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (err) {
       return ContentService
         .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

3. Save (disk icon or `Ctrl+S`). Name the project anything.

### 3. Deploy as a web app

1. Click `Deploy → New deployment`.
2. Click the gear ⚙ next to "Select type" → `Web app`.
3. Configure:
   - **Description**: anything (e.g. "peeyew contact intake")
   - **Execute as**: `Me`  *(your Google account writes the row)*
   - **Who has access**: `Anyone`  *(required — the request comes from your
     server with no Google credentials)*
4. Click `Deploy`. Authorize when prompted (the script needs sheet write
   access).
5. Copy the **Web app URL** that appears. It looks like:
   `https://script.google.com/macros/s/AKfycb…/exec`

> **Whenever you change the script**, you must `Deploy → Manage deployments
> → Edit → New version → Deploy`. Editing the script alone doesn't update
> the live endpoint.

### 4. Wire the URL into the project

**Local development:**

Create `.env.local` at the repo root (this file is gitignored — never
commit it). Paste:

```
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

Restart `npm run dev` so Next picks up the new env var.

**Vercel production:**

1. Vercel dashboard → project → `Settings → Environment Variables`.
2. Add `SHEETS_WEBHOOK_URL` with the same value. Apply it to `Production`
   (and `Preview` if you want previews to write to the sheet too — usually
   you don't, to keep your sheet clean).
3. Redeploy (or push a commit to trigger a new build).

## Testing

- **Without `SHEETS_WEBHOOK_URL` set:** the API route logs the submission to
  the server console and returns `{ ok: true, dev: true }`. The form shows
  "sent!" so you can iterate on the UI before the sheet is wired.
- **With the URL set:** submit the form. A new row should appear in the
  sheet within a couple of seconds.
- **Curl the route directly** to test without the UI:

  ```bash
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"test","email":"t@example.com","message":"hello"}'
  ```

## Troubleshooting

- **Form shows "Could not submit right now"** → check the Next.js server
  console. The error is logged with the upstream status code. Most common
  cause: the Apps Script deployment is set to "Only myself" instead of
  "Anyone". Fix that and redeploy a new version.
- **Submission succeeds but no row appears** → confirm `doPost` is writing
  to the *correct* sheet (Apps Script defaults to the active sheet). If
  you have multiple tabs, replace `getActiveSheet()` with
  `getSheetByName("YourTabName")`.
- **Apps Script times out** → the route caps the upstream call at 15s.
  Apps Script cold-starts can be slow; first submission of the day may
  fail, but the second usually succeeds. If this is persistent, consider
  pre-warming the script.

## Hardening (optional)

Things you can add later if spam becomes an issue:

- **Honeypot field** — an invisible input that real users never fill in;
  reject submissions where it's non-empty.
- **Server-side rate limiting** — Vercel's KV or Upstash Redis for IP-based
  throttling.
- **Cloudflare Turnstile** (CAPTCHA-style) — invisible challenge with a
  free tier. Integrates via a few lines in the route handler.

None of these are wired up by default; the current setup trades some spam
risk for simplicity.
