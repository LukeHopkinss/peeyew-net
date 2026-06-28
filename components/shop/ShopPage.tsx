"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import MenuOverlay from "../landing/MenuOverlay";
import PeeyewBanner from "../landing/PeeyewBanner";
import {
  CA_SHIPPING_SURCHARGE_CENTS,
  formatUsd,
  SHIPPING_RATES,
  totalCents,
  type ShipCountry,
} from "../../lib/pricing";

const BANNER_HEIGHT = "clamp(100px, 20vw, 260px)";
const BANNER_IMAGE_HEIGHT = "clamp(100px, 50vw, 720px)";

const COVER_SRC = "/PYMag/COVER.jpg";
const COVER_WIDTH = 2625;
const COVER_HEIGHT = 3375;

const BG = "var(--color-yellowBrand)";
const TEXT = "var(--color-pyTextBlue)";
const BUTTON_BG = "var(--color-pyDarkBlue)";
const BUTTON_TEXT = "var(--color-yellowBrand)";

type OrderStatus = "success" | "cancelled";

interface ShopPageProps {
  initialStatus?: OrderStatus;
}

export default function ShopPage({ initialStatus }: ShopPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<ShipCountry>("US");

  const priceLabel = formatUsd(totalCents(country));

  const open = useCallback(() => {
    setError(null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  const handleBuy = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout.");
      }

      // Hand off to Stripe-hosted Checkout. No need to reset loading — the
      // browser navigates away.
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }, [country]);

  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: BG, color: TEXT }}
    >
      <MenuOverlay />

      <div aria-hidden="true" style={{ height: "clamp(2.5rem, 6vw, 5rem)" }} />

      <PeeyewBanner
        bannerHeight={BANNER_HEIGHT}
        imageHeight={BANNER_IMAGE_HEIGHT}
      />

      {initialStatus && (
        <div
          role="status"
          className="mx-auto text-center uppercase"
          style={{
            maxWidth: "min(92vw, 900px)",
            marginTop: "clamp(1rem, 3vw, 2rem)",
            padding: "clamp(0.6rem, 1.8vw, 1rem)",
            fontSize: "clamp(14px, 2.2vw, 22px)",
            lineHeight: 1.1,
            backgroundColor:
              initialStatus === "success" ? BUTTON_BG : "transparent",
            color: initialStatus === "success" ? BUTTON_TEXT : TEXT,
            border:
              initialStatus === "cancelled" ? `2px solid ${TEXT}` : "none",
          }}
        >
          {initialStatus === "success"
            ? "thank you for your preorder! a receipt is on its way to your email."
            : "checkout cancelled — your card was not charged."}
        </div>
      )}

      <section
        className="mx-auto flex w-full flex-col items-center text-center uppercase"
        style={{
          maxWidth: "min(92vw, 1200px)",
          paddingLeft: "clamp(0.75rem, 3vw, 2rem)",
          paddingRight: "clamp(0.75rem, 3vw, 2rem)",
          paddingTop: "clamp(1.5rem, 5vw, 4rem)",
          paddingBottom: "clamp(2.5rem, 7vw, 6rem)",
        }}
      >
        <p
          style={{
            fontSize: "clamp(16px, 2.6vw, 30px)",
            letterSpacing: "0.04em",
            marginBottom: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          preorder issue 01 &mdash; &lsquo;PILOT&rsquo;
        </p>

        {/* waving cover — click to enlarge & buy */}
        <motion.button
          type="button"
          onClick={open}
          aria-label="Enlarge cover and preorder"
          className="cursor-pointer"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            width: "clamp(220px, 42vw, 440px)",
            transformOrigin: "center top",
            filter: "drop-shadow(0 14px 30px rgba(0,0,0,0.28))",
          }}
          animate={{ rotate: [-4, 4] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.03 }}
        >
          <Image
            src={COVER_SRC}
            alt="PYM MAG Issue 01 PILOT cover"
            width={COVER_WIDTH}
            height={COVER_HEIGHT}
            priority
            className="h-auto w-full select-none"
          />
        </motion.button>

        <p
          style={{
            fontSize: "clamp(13px, 2vw, 22px)",
            letterSpacing: "0.06em",
            marginTop: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          tap the cover to preorder :)
        </p>
      </section>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Preorder PYM MAG"
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(0,0,0,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(1rem, 3vw, 2rem)",
            padding: "clamp(1rem, 4vw, 3rem)",
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "clamp(0.75rem, 2vw, 1.5rem)",
              right: "clamp(0.75rem, 2vw, 1.5rem)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              lineHeight: 0,
            }}
          >
            <Image
              src="/landing/CLOSEmenu.png"
              alt="Close"
              width={512}
              height={512}
              className="h-auto w-[clamp(3.75rem,9vw,5.5rem)] select-none"
            />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center text-center"
            style={{ gap: "clamp(0.75rem, 2.5vw, 1.5rem)" }}
          >
            <div style={{ width: "min(70vw, 42vh)", maxWidth: "420px" }}>
              <Image
                src={COVER_SRC}
                alt="PYM MAG Issue 01 PILOT cover"
                width={COVER_WIDTH}
                height={COVER_HEIGHT}
                className="h-auto w-full select-none"
                style={{ boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }}
              />
            </div>

            <p
              className="uppercase"
              style={{
                color: "#ffffff",
                fontSize: "clamp(18px, 3vw, 34px)",
                lineHeight: 1,
                letterSpacing: "0.03em",
              }}
            >
              PYM MAG &mdash; {priceLabel}
            </p>

            {/* ship-to country — locks the shipping rate on Stripe */}
            <label
              className="flex items-center uppercase"
              style={{
                color: "#ffffff",
                fontSize: "clamp(12px, 1.8vw, 17px)",
                letterSpacing: "0.04em",
                gap: "clamp(0.4rem, 1.2vw, 0.7rem)",
              }}
            >
              <span>Ship to</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as ShipCountry)}
                className="uppercase"
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: `2px solid ${BUTTON_TEXT}`,
                  cursor: "pointer",
                  fontSize: "clamp(12px, 1.8vw, 17px)",
                  letterSpacing: "0.04em",
                  paddingLeft: "clamp(0.6rem, 1.6vw, 1rem)",
                  paddingRight: "clamp(0.6rem, 1.6vw, 1rem)",
                  paddingTop: "clamp(0.3rem, 0.9vw, 0.5rem)",
                  paddingBottom: "clamp(0.3rem, 0.9vw, 0.5rem)",
                }}
              >
                {SHIPPING_RATES.map(({ country: code, optionLabel }) => (
                  <option key={code} value={code} style={{ color: "#000000" }}>
                    {optionLabel}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={handleBuy}
              disabled={loading}
              className="uppercase"
              style={{
                backgroundColor: BUTTON_BG,
                color: BUTTON_TEXT,
                border: "none",
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontSize: "clamp(16px, 2.6vw, 28px)",
                letterSpacing: "0.05em",
                paddingLeft: "clamp(1.5rem, 4vw, 3rem)",
                paddingRight: "clamp(1.5rem, 4vw, 3rem)",
                paddingTop: "clamp(0.6rem, 1.6vw, 1rem)",
                paddingBottom: "clamp(0.6rem, 1.6vw, 1rem)",
              }}
            >
              {loading ? "redirecting…" : `preorder · ${priceLabel}`}
            </button>

            {error && (
              <p
                role="alert"
                style={{
                  color: "#ffb4b4",
                  fontSize: "clamp(13px, 2vw, 18px)",
                  maxWidth: "32ch",
                }}
              >
                {error}
              </p>
            )}

            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "clamp(11px, 1.6vw, 15px)",
                letterSpacing: "0.04em",
              }}
            >
              {country === "CA"
                ? `includes magazine + ${formatUsd(
                    CA_SHIPPING_SURCHARGE_CENTS,
                  )} shipping to Canada · secure checkout via stripe`
                : "price includes US shipping · secure checkout via stripe"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
