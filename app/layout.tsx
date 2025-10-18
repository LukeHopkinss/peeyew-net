import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Girls Night NYC — interactive",
  description: "Landing → paint canvas → gallery. Inspired by peeyew.net",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

