import type { Metadata } from "next";
import "./globals.css";
import { fontHelveticaNeueBlack, fontCoolvetica } from "./fonts";

export const metadata: Metadata = {
  title: "peeyew-unLimited",
  description: "Discover your wildest dreams, pure and digital. Only at peeyew.net",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        fontHelveticaNeueBlack.className applies font-family: 'HelveticaNeueBlack'
        to <body>, so every descendant inherits it unless explicitly overridden.
        fontCoolvetica.variable defines --font-coolvetica on <body> so it can be
        opted into via style={{ fontFamily: "var(--font-coolvetica)" }} (currently
        used by the slide-in side nav).
      */}
      <body
        className={`min-h-screen ${fontHelveticaNeueBlack.className} ${fontCoolvetica.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
