"use client";

import { useMemo, useState } from "react";
import DomeGallery from "./DomeGallery";
import LightboxCarousel, { LightboxImage } from "./LightboxCarousel";

// ⬇️ Extend your item type to optionally include a per-tile gallery
export type Project = {
  title: string;
  description: string | React.ReactNode;
  images: { src: string; alt?: string; gallery?: { src: string; alt?: string }[] }[];
};

type Props = {
  project: Project;
  grayscale?: boolean;
};

export default function ProjectGallery({ project, grayscale = false }: Props) {
  // Thumbs shown on the dome (unchanged behavior)
  const thumbs: LightboxImage[] = useMemo(
    () => project.images.map(({ src, alt }) => ({ src, alt })),
    [project.images]
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // NEW: current album is the clicked tile's gallery, falling back to the tile itself
  const album: LightboxImage[] = useMemo(() => {
    const item = project.images[index];
    if (!item) return [];
    return (item.gallery && item.gallery.length ? item.gallery : [{ src: item.src, alt: item.alt }]) as LightboxImage[];
  }, [index, project.images]);

  return (
    <div className="relative w-full h-[78vh] md:h-[85vh] overflow-visible">
      <DomeGallery
        images={thumbs}
        grayscale={grayscale}
        fit={0.48}
        segments={35}
        padFactor={0.22}
        imageBorderRadius="18px"
        openedImageBorderRadius="18px"
        onOpen={({ index: i }) => {   // ← use the tile index to pick the album
          setIndex(i);
          setOpen(true);
        }}
      />

      <LightboxCarousel
        isOpen={open}
        images={album}                 // ← per-tile gallery here
        index={0}                      // always start at first image of that album
        description={project.description}
        onClose={() => setOpen(false)}
        onIndexChange={() => { /* lightbox handles its own index, but we keep 0 */ }}
      />
    </div>
  );
}
