"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Slide {
  src: string;
  alt: string;
}

// COVER leads the sequence per the brief.
const SLIDES: Slide[] = [
  { src: "/PYMag/COVER.jpg", alt: "PYM MAG cover" },
  { src: "/PYMag/LT2.jpg", alt: "Luke Topacio editorial" },
  { src: "/PYMag/GURLNITELA.jpeg", alt: "Girls Night LA" },
  { src: "/PYMag/FENCE.JPG", alt: "Fence editorial" },
];

const COVER_OVERLAY_FONT_SIZE = "clamp(18px, 3.1vw, 38px)";

const NAV_BUTTON_STYLE: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#ffffff",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: "clamp(2.25rem, 6vw, 3.5rem)",
        height: "clamp(2.25rem, 6vw, 3.5rem)",
        display: "block",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
        transform: direction === "left" ? "scaleX(-1)" : undefined,
      }}
    >
      <path
        d="M9 5l7 7-7 7"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MagLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const open = useCallback(() => {
    setIndex(0);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % SLIDES.length),
    [],
  );

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, next, prev]);

  const current = SLIDES[index];

  return (
    <>
      {/* clickable overlay trigger sitting on top of the gurlnite cover */}
      <button
        type="button"
        onClick={open}
        aria-label="Open Girls Night slideshow"
        className="absolute inset-0 flex items-center justify-center"
        style={{
          padding: "clamp(0.75rem, 2vw, 1.25rem)",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0))",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: COVER_OVERLAY_FONT_SIZE,
            lineHeight: 0.96,
            textAlign: "right",
            textShadow: "0 2px 10px rgba(0,0,0,0.55)",
          }}
        >
          girlsnight
          <br />
          mixes
          <br />
          pleasure
          <br />
          &
          <br />
          business
        </span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Girls Night slideshow"
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close slideshow"
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
              alt="Close slideshow"
              width={512}
              height={512}
              className="h-auto w-[clamp(4.5rem,12vw,7rem)] select-none"
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            style={{ ...NAV_BUTTON_STYLE, left: "clamp(0.5rem, 2vw, 1.5rem)" }}
          >
            <ChevronIcon direction="left" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "88vw",
              height: "84vh",
            }}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="88vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            style={{ ...NAV_BUTTON_STYLE, right: "clamp(0.5rem, 2vw, 1.5rem)" }}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </>
  );
}
