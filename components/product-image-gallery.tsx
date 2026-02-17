"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const PLACEHOLDER_IMAGE = "/images/placeholder/imageholder.webp";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
};

export function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const normalized = images.filter((image) => Boolean(image?.trim()));
  const realImages = normalized.filter((image) => image !== PLACEHOLDER_IMAGE);
  const displayImages = realImages.length ? realImages : [PLACEHOLDER_IMAGE];
  const safeIndex = Math.min(activeIndex, displayImages.length - 1);
  const activeImage = displayImages[safeIndex];

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/60 bg-background p-6 sm:p-8">
        <motion.div
          key={activeImage}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full"
        >
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-muted/10 p-8 sm:p-10"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={activeImage}
              alt={title}
              width={520}
              height={520}
              className="h-auto w-full max-w-md object-contain transition-transform duration-150 ease-out"
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isZooming ? "scale(1.9)" : "scale(1)",
              }}
              priority
            />
            {isZooming ? (
              <div
                className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/70 bg-primary/10 backdrop-blur-[1px]"
                style={{
                  left: `${zoomPosition.x}%`,
                  top: `${zoomPosition.y}%`,
                }}
              />
            ) : null}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {displayImages.map((image, index) => {
          const isActive = index === safeIndex;
          return (
            <button
              key={`${title}-thumb-${index}`}
              type="button"
              className={`flex items-center justify-center rounded-2xl border bg-background p-3 transition-colors ${
                isActive
                  ? "border-primary"
                  : "border-border/60 hover:border-primary/50"
              }`}
              onClick={() => setActiveIndex(index)}
              aria-pressed={isActive}
            >
              <Image
                src={image}
                alt={`${title} preview ${index + 1}`}
                width={160}
                height={160}
                className="h-16 w-full object-contain"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
