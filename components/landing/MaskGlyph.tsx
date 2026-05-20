"use client";

import { useState } from "react";

/**
 * The DD-mask glyph used in the landing's middle section.
 * Tries /public/landing/mask.png first, falls back to a styled SVG.
 *
 * Client component because the <img> uses an onError fallback handler that
 * triggers a state update.
 */
export default function MaskGlyph() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex items-center justify-center select-none pointer-events-none w-full">
      {imgFailed ? (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="maskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cccccc" />
              <stop offset="100%" stopColor="#888888" />
            </linearGradient>
          </defs>
          {/* left half */}
          <path
            d="M100 30 L100 175 L60 175 L40 165 L25 100 L40 55 L60 35 Z"
            fill="url(#maskGrad)"
            stroke="#0a0a0a"
            strokeWidth="3"
          />
          <rect x="40" y="70" width="40" height="30" fill="#000000" />
          {/* right half (mirrored) */}
          <path
            d="M100 30 L100 175 L140 175 L160 165 L175 100 L160 55 L140 35 Z"
            fill="url(#maskGrad)"
            stroke="#0a0a0a"
            strokeWidth="3"
          />
          <rect x="120" y="70" width="40" height="30" fill="#000000" />
        </svg>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/landing/mask.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto"
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  );
}
