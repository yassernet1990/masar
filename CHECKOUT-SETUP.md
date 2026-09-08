# MASAR brand checkout

Implementation is on `feat/brand-packages-checkout`. The existing Next.js theme, header and footer are retained. Service 04 links to `#brand-packages`.

## Required Hostinger environment settings

Set these in the hosting control panel, not in source control or chat:

- `STRIPE_RESTRICTED_KEY`: restricted server key for the MASAR Stripe account. Checkout Sessions write/read, Products/Prices read and supporting invoice/customer/payment-intent creation permissions must be sufficient for Checkout invoice creation.
- `STRIPE_WEBHOOK_SECRET`: signing secret of the endpoint `https://masarps.com/api/stripe/webhook`.
- `MASAR_SITE_URL=https://masarps.com` (must match the actual canonical origin).
- `MASAR_DATA_DIR`: persistent writable storage directory, outside the public web root. Orders contain personal information; retain with owner-only access and back up appropriately. This matches the existing application's filesystem storage model; use shared storage before scaling to multiple instances.
- `MASAR_REFUND_FEE_EN` and `MASAR_REFUND_FEE_AR`: owner-approved exact fee amount/formula and transfer-fee explanation. Intentionally unset; checkout fails closed until both are supplied. The 72-hour request window is implemented in both languages.

## Stripe products

Live account: MASAR PROCUREMENT & SOLUTIONS LTD, `acct_1U68xhGyixZjsRl7`.
Deterministic product IDs: `masar_<catalog id with underscores>_202609`.
SAR base package amounts: 2250 / 3250 / 5900 / 7250 / 10900.
Six requested add-ons use the previously proposed USD prices converted at 3.75 SAR/USD.
Checkout uses server-priced line items attached to these products. USD/GBP quotes use ExchangeRate-API SAR rates, cached hourly; stale/unavailable FX disables foreign currencies. No client-supplied amounts are trusted. The exact quote is revalidated before checkout; a changed quote requires refresh.

Subscribe webhook to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Signature verification is mandatory; only paid sessions tagged with the MASAR catalog are persisted. Webhook retries are safe. No service is automatically delivered merely because the customer returns to the site.

Create the same catalog in a Stripe sandbox and use sandbox credentials to complete a test payment, verify order persistence, repeat webhook delivery, and test cancellation and a signed failed/unpaid event before live activation. Only the live Stripe account was available in this session; no payment has been taken or simulated in it.

One-time payment is mandatory. Monthly support is offered by separate arrangement; recurring subscriptions are not implemented in this checkout. No tax automation has been enabled without a confirmed registration.

## Deployment

Deploy this branch using the existing Hostinger Git/Node deployment process after supplying the settings and passing sandbox payment tests. Do not migrate the domain to Sites. The existing main branch has not been replaced.
