import { NextResponse } from "next/server";
import Stripe from "stripe";

// The Stripe SDK relies on Node APIs and cannot run on the Edge runtime.
export const runtime = "nodejs";

// Preorder pricing is fixed server-side — never trust an amount from the
// client. $40.00, shipping included, US only.
const PRODUCT_NAME = "PYM MAG — Issue 01 'PILOT' (Preorder)";
const PRODUCT_DESCRIPTION =
  "Preorder of peeyewMAGAZINE Issue 01 'PILOT'. Price includes US shipping.";
const UNIT_AMOUNT_CENTS = 4000;
const CURRENCY = "usd";
const ALLOWED_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  ["US"];

function resolveOrigin(request: Request): string {
  return (
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    new URL(request.url).origin
  );
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.warn(
      "[/api/checkout] STRIPE_SECRET_KEY is not set — cannot create a " +
        "Checkout session. Add a test key (sk_test_…) to .env.local.",
    );
    return NextResponse.json(
      { error: "Checkout is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secretKey);
  const origin = resolveOrigin(request);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: UNIT_AMOUNT_CENTS,
            product_data: {
              name: PRODUCT_NAME,
              description: PRODUCT_DESCRIPTION,
              images: [`${origin}/PYMag/COVER.jpg`],
            },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
      submit_type: "pay",
      // Description surfaces on the Stripe-sent receipt email so the buyer sees
      // exactly what they preordered. Enable receipts in the Stripe Dashboard
      // (Settings → Customer emails → "Successful payments") to send them.
      payment_intent_data: {
        description: "PYM MAG — Issue 01 'PILOT' preorder (US shipping included)",
      },
      // Short confirmation note shown on the Checkout page itself.
      custom_text: {
        submit: {
          message:
            "You're preordering PYM MAG Issue 01 'PILOT'. A confirmation receipt will be emailed to you, and we'll send shipping updates before launch.",
        },
      },
      success_url: `${origin}/shop?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?status=cancelled`,
    });

    if (!session.url) {
      throw new Error("Stripe session was created without a redirect URL");
    }

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected checkout error";
    console.error("[/api/checkout] Failed to create session:", message);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
