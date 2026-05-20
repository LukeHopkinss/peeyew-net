"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Dark-blue band with the chrome "Pee-Yew" wordmark.
 *
 * If /public/landing/peeyew-3d.png exists, it'll be used; otherwise we render
 * a styled SVG fallback so the page is never broken.
 *
 * Client component because the <img> uses an onError fallback handler that
 * triggers a state update.
 *
 * Banner band and PNG are sized independently:
 *
 *   - bannerHeight: CSS length controlling the dark-blue band's height.
 *   - imageHeight: CSS length controlling the PNG's height.
 *   - imageWidth: CSS length controlling the PNG's width.
 *
 * The PNG is centered inside the band. Clicking the wordmark routes home.
 */
type Props = {
  bannerHeight?: string;
  imageHeight?: string;
  imageWidth?: string;
  href?: string;
};

const DEFAULT_BANNER_HEIGHT = "clamp(100px, 20vw, 260px)";
const DEFAULT_IMAGE_HEIGHT = "clamp(100px, 50vw, 720px)";
const DEFAULT_IMAGE_WIDTH = "auto";

export default function PeeyewBanner({
  bannerHeight = DEFAULT_BANNER_HEIGHT,
  imageHeight = DEFAULT_IMAGE_HEIGHT,
  imageWidth = DEFAULT_IMAGE_WIDTH,
  href = "/",
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const imgStyle = { height: imageHeight, width: imageWidth };

  return (
    <div
      className="flex w-full items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "var(--color-pyDarkBlue)",
        height: bannerHeight,
      }}
    >
      <Link
        href={href}
        aria-label="Go to the Pee-Yew landing page"
        className="inline-flex items-center justify-center"
      >
        {imgFailed ? (
          <svg
            viewBox="0 0 600 120"
            style={imgStyle}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Pee-Yew"
          >
            <defs>
              <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8ecff" />
                <stop offset="50%" stopColor="#7c8fd6" />
                <stop offset="100%" stopColor="#dfe5ff" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="62%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="78"
              fontWeight={700}
              letterSpacing="6"
              fill="url(#chrome)"
              stroke="#1a1a1a"
              strokeWidth="1.2"
            >
              Pee-Yew
            </text>
          </svg>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/landing/peeyew-3d.png"
            alt="Pee-Yew"
            className="select-none"
            style={imgStyle}
            onError={() => setImgFailed(true)}
          />
        )}
      </Link>
    </div>
  );
}