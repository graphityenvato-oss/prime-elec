# Resend Setup (Quotation + BOQ Notifications)

## Implemented

- `POST /api/quotations` still saves to Supabase table `quotation_requests` (admin dashboard unchanged).
- After successful DB insert, the route now tries to send an email notification using Resend.
- `POST /api/boq` still uploads file + saves request to `boq_requests` (admin dashboard unchanged).
- After successful BOQ save, the route now tries to send an email notification using Resend (includes BOQ file link).
- If Resend fails, the request is still saved and API still returns success.

## Required Environment Variables

- `RESEND_API_KEY` = your Resend API key
- `RESEND_FROM_EMAIL` = verified sender, e.g. `Prime Elec <notifications@prime-elec.com>`

## Required Package (for quotation PDF attachment)

- `pdf-lib`

Install after pulling changes:

```bash
npm install
```

## Optional Environment Variables

- `QUOTATION_NOTIFY_EMAIL` = receiver email for quotation notifications
- `BOQ_NOTIFY_EMAIL` = receiver email for BOQ notifications
- `NOTIFY_EMAIL_TO` = fallback receiver email (if `QUOTATION_NOTIFY_EMAIL` is not set)

If notification receiver env vars are not set, the code falls back to:

- `info@prime-elec.com`

## Current Email Content

- Customer name, company, email, phone
- Consultation flag
- Project notes
- Item list (Order#, Code, quantity, source/brand/category)
- Totals
- Quotation email includes a generated PDF attachment (same request details + item list)
- BOQ: customer name, phone, project name, notes, and uploaded file link

## Notes

- If PDF generation fails for any reason, the quotation email is still sent without attachment.
- If Resend fails, the request is still saved to the dashboard.
- `/api/quotations` and `/api/boq` now have basic IP-based rate limiting (returns `429` with `Retry-After`).
- `/api/boq` now validates file type allowlist before upload: `PDF`, `XLS`, `XLSX`, `CSV` (plus MIME check).
- Quotation and BOQ submissions now include basic bot protection:
  - hidden honeypot field (`website`)
  - minimum form fill time check (`startedAt`)
  - suspected bot submissions are silently dropped with success response
