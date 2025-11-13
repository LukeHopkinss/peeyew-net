/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef } from "react";

export type LightboxImage = { src: string; alt?: string };

type Props = {
  isOpen: boolean;
  images?: LightboxImage[];
  index: number;
  description?: string | React.ReactNode;
  onClose: () => void;
  onIndexChange: (next: number) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function LightboxCarousel({
  isOpen,
  images = [],
  index,
  description,
  onClose,
  onIndexChange,
}: Props) {
  const lastFocus = useRef<HTMLElement | null>(null);

  const safeIndex = useMemo(() => {
    if (!images.length) return 0;
    return clamp(index, 0, images.length - 1);
  }, [index, images.length]);

  useEffect(() => {
    if (!images.length) return;
    if (index !== safeIndex) onIndexChange(safeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, images.length]);

  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = (document.activeElement as HTMLElement) || null;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!images.length) return;
      if (e.key === "ArrowRight") onIndexChange((safeIndex + 1) % images.length);
      if (e.key === "ArrowLeft")
        onIndexChange((safeIndex - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (lastFocus.current) lastFocus.current.focus?.();
    };
  }, [isOpen, images.length, onClose, onIndexChange, safeIndex]);

  if (!isOpen || !images.length) return null;

  const current = images[safeIndex];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/15 backdrop-blur-md"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      {/* transparent container; image area will have its own frosted bg */}
      <div
        className="absolute inset-4 sm:inset-8 lg:inset-12 text-black rounded-2xl overflow-hidden grid grid-rows-[auto_1fr] lg:grid-cols-[1fr_420px] lg:grid-rows-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar (mobile) with subtle glass */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/20 bg-white/60 backdrop-blur-md lg:hidden rounded-t-2xl">
          <span className="text-sm font-medium">
            {safeIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm bg-neutral-900 text-white"
          >
            close
          </button>
        </div>

        {/* IMAGE AREA — frosted, transparent background */}
        <div className="relative flex items-center justify-center bg-black/20 backdrop-blur-lg rounded-2xl lg:rounded-none">
          <button
            onClick={() =>
              onIndexChange((safeIndex - 1 + images.length) % images.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 grid place-items-center"
            aria-label="Previous"
            title="Previous"
          >
            ‹
          </button>

          <div className="max-h-[80vh] lg:max-h-[90vh] w-full grid place-items-center">
            <img
              src={current.src}
              alt={current.alt || ""}
              className="max-h-[80vh] lg:max-h-[90vh] max-w-full object-contain"
            />
          </div>

          <button
            onClick={() => onIndexChange((safeIndex + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 grid place-items-center"
            aria-label="Next"
            title="Next"
          >
            ›
          </button>

          {/* Index badge on desktop */}
          <div className="hidden lg:block absolute left-4 top-4 text-xs font-semibold text-white/80">
            {safeIndex + 1} / {images.length}
          </div>

          {/* Close button desktop */}
          <button
            onClick={onClose}
            className="hidden lg:block absolute right-4 top-4 rounded-md px-3 py-1.5 text-sm bg-white/90 hover:bg-white"
          >
            close
          </button>
        </div>

        {/* DESCRIPTION PANEL — keep solid for readability */}
        <aside className="hidden lg:block border-l bg-white p-6 overflow-auto">
          <h3 className="text-lg font-semibold mb-2">project details</h3>
          <div className="prose prose-sm max-w-none">
            {typeof description === "string" ? <p>{description}</p> : description}
          </div>
        </aside>
      </div>
    </div>
  );
}
