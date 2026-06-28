import EasyPostClient from "@easypost/api";

/**
 * EasyPost integration: turns a paid Stripe order into a shipment in your
 * EasyPost account so you can buy + print the label later from the EasyPost
 * dashboard (in bulk, when the issue actually ships).
 *
 * The whole module is inert until EASYPOST_API_KEY is set — mirroring how
 * /api/checkout stays dormant without STRIPE_SECRET_KEY. That lets the webhook
 * be deployed before an EasyPost account even exists.
 *
 * We intentionally do NOT buy the label here. Creating the shipment is enough
 * to later buy the cheapest USPS rate from the dashboard, and it avoids paying
 * postage months before an order ships.
 */

// Address the labels ship FROM. Pulled from env so no real address is baked
// into source. Defaults are empty on purpose: a misconfigured deploy then fails
// loudly in EasyPost rather than silently mailing from a wrong address.
type ShipFromAddress = {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
};

function shipFromAddress(): ShipFromAddress {
  return {
    name: process.env.SHIP_FROM_NAME ?? "peeyewMAGAZINE",
    street1: process.env.SHIP_FROM_STREET1 ?? "",
    street2: process.env.SHIP_FROM_STREET2 || undefined,
    city: process.env.SHIP_FROM_CITY ?? "",
    state: process.env.SHIP_FROM_STATE ?? "",
    zip: process.env.SHIP_FROM_ZIP ?? "",
    country: process.env.SHIP_FROM_COUNTRY ?? "US",
    phone: process.env.SHIP_FROM_PHONE || undefined,
  };
}

// Parcel for a single Issue 01, inches + ounces. Tune to the real magazine +
// mailer once you can put it on a scale; these are conservative placeholders.
function magazineParcel() {
  return {
    length: Number(process.env.PARCEL_LENGTH_IN ?? "12"),
    width: Number(process.env.PARCEL_WIDTH_IN ?? "9"),
    height: Number(process.env.PARCEL_HEIGHT_IN ?? "0.5"),
    weight: Number(process.env.PARCEL_WEIGHT_OZ ?? "8"),
  };
}

// Customs paperwork is required by EasyPost for any international shipment
// (e.g. US -> Canada). Returns undefined for domestic shipments, where attaching
// customs info is unnecessary. `eel_pfc` "NOEEI 30.37(a)" is the standard filing
// exemption for shipments under $2,500.
function customsInfoFor(
  destinationCountry: string,
  originCountry: string,
  parcelWeightOz: number,
) {
  if (destinationCountry.toUpperCase() === originCountry.toUpperCase()) {
    return undefined;
  }

  return {
    eel_pfc: "NOEEI 30.37(a)",
    contents_type: "merchandise",
    customs_certify: true,
    customs_signer: process.env.CUSTOMS_SIGNER ?? shipFromAddress().name,
    non_delivery_option: "return" as const,
    restriction_type: "none" as const,
    customs_items: [
      {
        description: process.env.CUSTOMS_ITEM_DESCRIPTION ?? "Magazine (periodical)",
        quantity: 1,
        // Declared goods value (not the order total, which bundles shipping).
        value: Number(process.env.CUSTOMS_ITEM_VALUE_USD ?? "40"),
        weight: parcelWeightOz,
        origin_country: originCountry,
        // HS heading 4902 = newspapers, journals & periodicals. Override per the
        // destination's full tariff schedule if a customer flags an issue.
        hs_tariff_number: process.env.CUSTOMS_HS_TARIFF ?? "4902.90",
      },
    ],
  };
}

export function isEasyPostConfigured(): boolean {
  return Boolean(process.env.EASYPOST_API_KEY);
}

export type OrderShippingAddress = {
  name: string;
  email?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type EasyPostRate = {
  carrier: string;
  service: string;
  rate: string;
  currency: string;
};

function cheapestUspsRate(
  rates: readonly EasyPostRate[],
): EasyPostRate | undefined {
  return rates
    .filter((rate) => rate.carrier?.toUpperCase() === "USPS")
    .sort((a, b) => Number(a.rate) - Number(b.rate))[0];
}

export type CreatedShipment = {
  id: string;
  cheapestUspsRate?: EasyPostRate;
};

/**
 * Create (but do not purchase) an EasyPost shipment for a paid order.
 * Returns null when EasyPost is not configured. Throws on EasyPost API errors —
 * the caller is expected to catch and acknowledge so Stripe does not retry a
 * permanently-bad address.
 */
export async function createShipmentForOrder(args: {
  to: OrderShippingAddress;
  reference: string;
}): Promise<CreatedShipment | null> {
  const apiKey = process.env.EASYPOST_API_KEY;
  if (!apiKey) {
    console.warn(
      "[easypost] EASYPOST_API_KEY not set — skipping shipment for order",
      args.reference,
    );
    return null;
  }

  const client = new EasyPostClient(apiKey);
  const from = shipFromAddress();
  const parcel = magazineParcel();

  const shipment = await client.Shipment.create({
    // Trace each shipment back to its Stripe order; also makes Stripe's event
    // redeliveries visible as duplicate references in the EasyPost dashboard.
    reference: args.reference,
    to_address: {
      name: args.to.name,
      email: args.to.email ?? undefined,
      street1: args.to.line1,
      street2: args.to.line2 ?? undefined,
      city: args.to.city,
      state: args.to.state,
      zip: args.to.postalCode,
      country: args.to.country,
    },
    from_address: {
      name: from.name,
      street1: from.street1,
      street2: from.street2,
      city: from.city,
      state: from.state,
      zip: from.zip,
      country: from.country,
      phone: from.phone,
    },
    parcel,
    // Only present for international destinations (e.g. Canada); undefined for
    // domestic shipments.
    customs_info: customsInfoFor(args.to.country, from.country, parcel.weight),
  });

  return {
    id: shipment.id,
    cheapestUspsRate: cheapestUspsRate(shipment.rates ?? []),
  };
}
