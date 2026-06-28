// Single source of truth for preorder pricing, imported by BOTH the checkout
// API route (what we charge) and the shop page (what we display) so the two can
// never drift apart. All amounts are USD cents.

export const BASE_PRICE_CENTS = 4000; // $40.00 — Issue 01 preorder, US shipping included.
export const US_SHIPPING_CENTS = 0; // US shipping is baked into the base price.
export const CA_SHIPPING_SURCHARGE_CENTS = 1000; // +$10.00 shipping to Canada.

export type ShipCountry = "US" | "CA";

export interface ShippingRate {
  /** ISO country this rate applies to. */
  country: ShipCountry;
  /** Label shown in the shop's "Ship to" dropdown, e.g. "Canada". */
  optionLabel: string;
  /** Label shown on the Stripe Checkout page for the shipping line. */
  label: string;
  /** Surcharge added on top of the base price, in cents. */
  amountCents: number;
}

// The buyer chooses one of these in the shop modal; the server then locks the
// Stripe session to that single country + rate, so the cheaper rate can't be
// picked for the wrong destination. US is first so it's the default.
export const SHIPPING_RATES: ShippingRate[] = [
  {
    country: "US",
    optionLabel: "United States",
    label: "US Shipping",
    amountCents: US_SHIPPING_CENTS,
  },
  {
    country: "CA",
    optionLabel: "Canada",
    label: "Canada Shipping",
    amountCents: CA_SHIPPING_SURCHARGE_CENTS,
  },
];

/** Anything that isn't an explicit "CA" is treated as US (the default). */
export function normalizeCountry(value: unknown): ShipCountry {
  return value === "CA" ? "CA" : "US";
}

/** The shipping rate for a country (falls back to the first/US rate). */
export function shippingRateFor(country: ShipCountry): ShippingRate {
  return SHIPPING_RATES.find((rate) => rate.country === country) ?? SHIPPING_RATES[0];
}

/** Shipping surcharge for a country, in cents. */
export function shippingSurchargeCents(country: ShipCountry): number {
  return shippingRateFor(country).amountCents;
}

/** Grand total the buyer pays (product + shipping), in cents. */
export function totalCents(country: ShipCountry): number {
  return BASE_PRICE_CENTS + shippingSurchargeCents(country);
}

/** Format a cent amount as a USD string, e.g. 3000 -> "$30.00". */
export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
