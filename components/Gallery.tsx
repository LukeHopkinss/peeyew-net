// components/Gallery.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DomeGallery from "./DomeGallery";
import LightboxCarousel, { LightboxImage } from "./LightboxCarousel";
import { projects } from "./projects";

// helper: build [cover + gallery...] and dedupe by src
function buildAlbum(p: (typeof projects)[number]): LightboxImage[] {
  const tile = p.images[0];
  const cover: LightboxImage = { src: tile.src, alt: p.title || tile.alt };
  const rest = (tile.gallery ?? []) as LightboxImage[];
  const seen = new Set<string>();
  const out: LightboxImage[] = [];
  [cover, ...rest].forEach(img => {
    if (!img?.src || seen.has(img.src)) return;
    seen.add(img.src);
    out.push({ src: img.src, alt: img.alt });
  });
  return out;
}

export default function Gallery() {
  // albums are stable and can be computed once (no randomness here)
  const albums = useMemo<LightboxImage[][]>(() => {
    return projects.map(buildAlbum);
  }, []);

  // initial thumbs: deterministic covers to avoid hydration mismatch
  const initialThumbs = useMemo<LightboxImage[]>(() => {
    return projects.map((p) => {
      const t = p.images[0];
      return { src: t.src, alt: p.title || t.alt };
    });
  }, []);

  const [thumbs, setThumbs] = useState<LightboxImage[]>(initialThumbs);

  // after mount, switch to random picks (client-only → no hydration issue)
  useEffect(() => {
    setThumbs((prev) =>
      prev.map((_, i) => {
        const album = albums[i] ?? [];
        if (!album.length) return prev[i]; // safety fallback
        const pick = album[Math.floor(Math.random() * album.length)];
        return { src: pick.src, alt: projects[i].title || pick.alt };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const [open, setOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeAlbum = albums[activeProject] ?? [];
  const activeDescription = projects[activeProject]?.description ?? "";

  return (
    <section className="pt-6 pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="relative w-full h-[78vh] md:h-[85vh] overflow-visible">
          <DomeGallery
            images={thumbs}
            grayscale={false}
            fit={0.48}
            segments={35}
            padFactor={0.22}
            imageBorderRadius="18px"
            openedImageBorderRadius="18px"
            onOpen={({ index }) => {
              const projectIndex = index % projects.length;   // ← map slot → project
              setActiveProject(projectIndex);
              setActiveIndex(0);
              setOpen(true);
            }}
          />

          <LightboxCarousel
            isOpen={open}
            images={activeAlbum}
            index={activeIndex}
            description={activeDescription}
            onClose={() => setOpen(false)}
            onIndexChange={setActiveIndex}
          />
        </div>
      </div>
    </section>
  );
}
