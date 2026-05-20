"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

type NavItem = {
  label: string;
  href: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  viewportClassName: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "peeyew magazine",
    href: "/peeyewmag",
    image: "/PYMag/pymMAINLOGO1.png",
    imageWidth: 1355,
    imageHeight: 1355,
    viewportClassName: "h-[clamp(104px,15vh,170px)]",
  },
  {
    label: "peeyew radio",
    href: "/lovedate-radio",
    image: "/PYRadio/pyradio.png",
    imageWidth: 1355,
    imageHeight: 1355,
    viewportClassName: "h-[clamp(82px,11.5vh,135px)]",
  },
];

const TEXT_LINKS = [
  { label: "work", href: "/work" },
  { label: "merch", href: "/merch" },
  { label: "about", href: "/about" },
];

const PANEL_BG = "#d9781c";

const diamondPlateBg: CSSProperties = {
  backgroundColor: PANEL_BG,
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0 2px, transparent 2px 30px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 30px)",
  backgroundSize: "32px 32px",
};

const MENU_TRIGGER_POSITION: CSSProperties = {
  top: "clamp(0.25rem, 1vw, 1rem)",
  right: "clamp(0.5rem, 2vw, 2rem)",
};

export default function MenuOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="landing-side-nav"
        onClick={() => setOpen(true)}
        className="fixed z-30 block p-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        style={MENU_TRIGGER_POSITION}
      >
        <Image
          src="/landing/OPENmenu.png"
          alt="Open menu"
          width={1355}
          height={1355}
          priority
          className="h-10 w-auto select-none pointer-events-none sm:h-12 md:h-14"
        />
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <nav
        id="landing-side-nav"
        aria-label="Site sections"
        className={`fixed top-0 right-0 z-50 flex flex-col overflow-hidden border-2 border-black transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          ...diamondPlateBg,
          width: "min(94vw, clamp(340px, 44vw, 620px))",
          height: "52vh",
          minHeight: "400px",
          maxHeight: "640px",
        }}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute left-2 top-2 z-10 flex h-12 w-12 items-center justify-center border-2 border-black bg-white text-4xl leading-none text-black cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          <span aria-hidden="true">x</span>
        </button>

        <div className="flex h-full flex-col px-4 pb-5 pt-[clamp(5rem,11vh,7rem)]">
          <ul className="flex flex-col gap-[clamp(0.75rem,2vh,1.5rem)]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  onClick={() => setOpen(false)}
                  className={`relative block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${item.viewportClassName}`}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={item.imageWidth}
                    height={item.imageHeight}
                    sizes="(max-width: 640px) 94vw, 620px"
                    className="absolute left-0 top-1/2 h-auto w-[85%] -translate-y-1/2 object-contain object-left select-none"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-auto flex flex-col items-start gap-0 leading-none">
            {TEXT_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-left text-[clamp(24px,4.2vh,44px)] leading-[0.82] tracking-[0.03em] text-black hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}