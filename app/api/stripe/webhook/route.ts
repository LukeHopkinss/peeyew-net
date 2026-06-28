import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createShipmentForOrder,
  isEasyPostConfigured,
} from "../../../../lib/easypost";

// Stripe signature verification needs Node crypto + the raw request body, so
// this route must run on the Node runtime (never Edge).
export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.warn(
      "[/api/stripe/webhook] Missing STRIPE_SECRET_KEY or " +
        "STRIPE_WEBHOOK_SECRET — cannot verify events. See " +
        "docs/easypost-setup.md.",
    );
    return NextResponse.json(
      { error: "Webhook is not configured yet." },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secretKey);

  // CRITICAL: verify against the raw, unparsed body. Calling request.json()
  // first re-serializes the payload and signature verification will always fail.
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(
      "[/api/stripe/webhook] Signature verification failed:",
      message,
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Acknowledge everything we don't act on so Stripe stops retrying it.
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Only fulfil orders that actually paid. (e.g. async payment methods can
  // complete the session before payment settles.)
  if (session.payment_status !== "paid") {
    console.log(
      "[/api/stripe/webhook] Session",
      session.id,
      "completed but payment_status is",
      session.payment_status,
      "— skipping shipment.",
    );
    return NextResponse.json({ received: true });
  }

  // Stripe may not embed `collected_information` inline in the event payload.
  // If the address isn't present, re-fetch the session with it expanded before
  // giving up — so fulfilment works whether or not Stripe inlines it.
  let shipping = session.collected_information?.shipping_details;
  if (!shipping?.address) {
    try {
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["collected_information"],
      });
      shipping = full.collected_information?.shipping_details;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "unknown error";
      console.error(
        "[/api/stripe/webhook] Failed to re-fetch session",
        session.id,
        "for shipping details -",
        message,
      );
    }
  }

  if (!shipping?.address) {
    console.error(
      "[/api/stripe/webhook] Paid session",
      session.id,
      "has no shipping address — cannot create shipment.",
    );
    return NextResponse.json({ received: true });
  }

  const address = shipping.address;

  // An EasyPost failure must never produce a non-2xx: Stripe would then retry a
  // permanently-bad address for days. Log loudly and acknowledge instead.
  try {
    if (!isEasyPostConfigured()) {
      console.warn(
        "[/api/stripe/webhook] Order",
        session.id,
        "paid, but EasyPost is not configured — no shipment created.",
      );
    } else {
      const result = await createShipmentForOrder({
        reference: session.id,
        to: {
          name: shipping.name,
          email: session.customer_details?.email,
          line1: address.line1 ?? "",
          line2: address.line2,
          city: address.city ?? "",
          state: address.state ?? "",
          postalCode: address.postal_code ?? "",
          country: address.country ?? "US",
        },
      });

      if (result) {
        const rate = result.cheapestUspsRate;
        console.log(
          "[/api/stripe/webhook] EasyPost shipment",
          result.id,
          "created for order",
          session.id,
          rate
            ? `(cheapest USPS: ${rate.service} $${rate.rate} ${rate.currency})`
            : "(no USPS rate returned)",
        );
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(
      "[/api/stripe/webhook] EasyPost shipment failed for order",
      session.id,
      "-",
      message,
    );
  }

  return NextResponse.json({ received: true });
}
