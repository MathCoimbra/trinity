"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { StoreInfo } from "@/lib/catalog/types";

const SLIDE_INTERVAL_MS = 6000;

export function SetupCarousel({ photos }: { photos: StoreInfo["coverPhotos"] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const interval = setInterval(
      () => setActiveIndex((index) => (index + 1) % photos.length),
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {photos.map((photo, index) => (
        <div
          key={photo.src}
          className={`setup-slide absolute inset-0 ${index === activeIndex ? "setup-slide-active" : ""}`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            preload={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
