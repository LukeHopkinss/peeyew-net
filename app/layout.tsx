import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "peeyew-unLimited",
  description: "Discover your wildest dreams, pure and digital. Only at peeyew.net",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

