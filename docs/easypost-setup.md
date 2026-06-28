# EasyPost shipping setup

When someone pays for a magazine order through Stripe Checkout, Stripe sends
a `checkout.session.completed` event to **`/api/stripe/webhook`**. That route
verifies the event, reads the buyer's shipping address, and creates a
**shipment in your EasyPost account** — it does **not** buy the label. You buy
and print labels later (in bulk, when the issue ships) from the EasyPost
dashboard, choosing the cheapest USPS rate.

Everything stays dormant until the env vars below are set, so the code can ship
to production before you have an EasyPost account.

```
Stripe Checkout (paid)
        │  checkout.session.completed
        ▼
/api/stripe/webhook   ──reads shipping address──►  EasyPost.Shipment.create()
        │                                                  │
   verify signature                               shipment appears in
   gate on payment_status === "paid"              EasyPost dashboard,
   reference = Stripe session id                  ready to buy a label
```

## 1. Create an EasyPost account

1. Sign up at https://www.easypost.com/.
2. In the EasyPost dashboard go to **Account Settings → API Keys**.
3. Copy your **Test** key (starts `EZTK…`) for local dev and your **Production**
   key (starts `EZAK…`) for the live site.
4. Under **Carriers**, enable **USPS** (EasyPost provides USPS out of the box;
   no separate USPS account needed).

## 2. Set environment variables

Fill these in `.env.local` for local dev, and in **Vercel → Project → Settings →
Environment Variables** for production (use the production keys there):

| Variable | What it is |
| --- | --- |
| `EASYPOST_API_KEY` | EasyPost API key (`EZTK…` test / `EZAK…` live) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the webhook endpoint (below) |
| `SHIP_FROM_NAME` … `SHIP_FROM_PHONE` | The address labels ship **from** |
| `PARCEL_LENGTH_IN` / `WIDTH` / `HEIGHT` / `WEIGHT_OZ` | One magazine + mailer |

If `EASYPOST_API_KEY` is missing, paid orders are still logged but no shipment
is created — nothing errors.

## 3. Register the Stripe webhook

### Production / staging

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://peeyew.net/api/stripe/webhook`
   (use your real deployed domain).
3. Select event: **`checkout.session.completed`**.
4. After creating it, copy the **Signing secret** (`whsec_…`) into
   `STRIPE_WEBHOOK_SECRET`.

### Local testing with the Stripe CLI

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# copy the whsec_… it prints into STRIPE_WEBHOOK_SECRET, then in another shell:
stripe trigger checkout.session.completed
```

> Note: `stripe trigger` sends a synthetic session that usually has no shipping
> address, so it exercises signature verification but will log "no shipping
> address". For an end-to-end test, complete a real **test-mode** checkout with
> a [test card](https://docs.stripe.com/testing) (e.g. `4242 4242 4242 4242`).

## 4. Fulfilling orders

1. New paid orders appear under **Shipments** in the EasyPost dashboard, each
   tagged with its Stripe session id as the `reference`.
2. When the issue is ready, open a shipment, pick the cheapest USPS rate, and
   buy + print the label.
3. The webhook logs the cheapest USPS rate it saw at order time, so you have a
   rough cost expectation in your server logs.

## Design notes / trade-offs

- **No label is bought automatically.** Orders ship months out; auto-buying
  would spend postage early and print labels you can't use yet. To switch to
  auto-buy later, call `shipment.buy(shipment.lowestRate(["USPS"]))` inside
  `createShipmentForOrder` (`lib/easypost.ts`).
- **No database.** EasyPost itself is the record of shipments. Stripe may
  redeliver an event; each shipment carries the Stripe session id as its
  `reference`, so duplicates are visible (and can be de-duped) in the dashboard.
- **EasyPost errors never fail the webhook.** If shipment creation throws, the
  endpoint logs it but still returns `200` — otherwise Stripe would retry a
  permanently-bad address for days. Watch server logs for
  `EasyPost shipment failed`.
- **International (US + Canada):** checkout allows `US` and `CA`. For Canadian
  orders the webhook automatically attaches `customs_info` (EasyPost rejects
  international shipments without it) using the `CUSTOMS_*` env vars. Domestic
  US orders skip customs entirely. To add more countries, also add them to
  `ALLOWED_COUNTRIES` in `app/api/checkout/route.ts`.
- **Pricing for Canada:** the $40 base price is US-shipping-inclusive. Canadian
  orders add a **$10 shipping surcharge** as a separate Stripe Checkout line
  (total $50). The buyer picks their region on the shop page; the session is
  locked to that country so the surcharge can't be dodged. Amounts live in
  `lib/pricing.ts` (shared by the checkout route and the shop page) — change the
  surcharge there.
