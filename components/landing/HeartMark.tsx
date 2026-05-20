"use client";

import { useState } from "react";

/**
 * Heart-i mark used at the bottom of the landing.
 * Tries /public/landing/heart-i.png first, falls back to inline SVG.
 *
 * Client component because the <img> uses an onError fallback handler that
 * triggers a state update.
 */
export default function HeartMark() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex flex-col items-center select-none pointer-events-none w-full">
      {imgFailed ? (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="pee-yew"
        >
          {/* heart silhouette in red */}
          <path
            d="M100 170 C 30 120, 10 80, 40 50 C 60 30, 90 40, 100 65 C 110 40, 140 30, 160 50 C 190 80, 170 120, 100 170 Z"
            fill="#a50000"
          />
          {/* black ring + i */}
          <circle cx="100" cy="100" r="32" fill="none" stroke="#0a0a0a" strokeWidth="6" />
          <circle cx="100" cy="84" r="5" fill="#0a0a0a" />
          <rect x="96" y="94" width="8" height="22" fill="#0a0a0a" />
          {/* subtitle */}
          <text
            x="100"
            y="195"
            textAnchor="middle"
            fontSize="14"
            fontStyle="italic"
            fill="#0a0a0a"
          >
            pee-yew
          </text>
        </svg>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/landing/heart-i.png"
          alt="pee-yew"
          className="w-full h-auto"
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  );
}
