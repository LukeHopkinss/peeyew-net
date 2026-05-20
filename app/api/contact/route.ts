import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Submission = {
  email?: unknown;
  message?: unknown;
};

function asTrimmedString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Submission;

  try {
    body = (await request.json()) as Submission;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = asTrimmedString(body.email, 200);
  const message = asTrimmedString(body.message, 4000);

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "Email looks invalid" }, { status: 400 });
  }

  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[/api/contact] SHEETS_WEBHOOK_URL is not set — logging submission and returning success. " +
        "See docs/contact-form-setup.md to wire the Google Sheet.",
    );
    console.log("[/api/contact] submission:", { email, message });
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error("[/api/contact] upstream rejected", upstream.status, text);
      return NextResponse.json(
        { error: "Could not submit right now. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact] upstream error", err);
    return NextResponse.json(
      { error: "Could not submit right now. Please try again later." },
      { status: 502 },
    );
  }
}