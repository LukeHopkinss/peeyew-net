// Local font files live in ./fonts/. Wired through next/font/local so they
// get bundled, hashed, and served with proper caching headers.
//
// Helvetica Neue Black is the page-wide default font. We use `.className` on
// <body> in layout.tsx so every descendant inherits it without per-component
// font-family declarations.
//
// Coolvetica is exposed as a CSS variable `--font-coolvetica` so individual
// elements can opt in via `style={{ fontFamily: "var(--font-coolvetica)" }}`.
// Currently used by the slide-in side nav.

import localFont from "next/font/local";

export const fontHelveticaNeueBlack = localFont({
  src: "./fonts/HelveticaNeueBlack.otf",
  display: "swap",
});

export const fontCoolvetica = localFont({
  src: "./fonts/CoolveticaHvComp.otf",
  variable: "--font-coolvetica",
  display: "swap",
});
