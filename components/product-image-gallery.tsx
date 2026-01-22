"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
};

export function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/60 bg-background p-6 sm:p-8">
        <div className="flex items-center justify-center rounded-2xl bg-muted/10 p-8 sm:p-10">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >
            <Image
              src={activeImage}
              alt={title}
              width={520}
              height={520}
              className="h-auto w-full max-w-md object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => {
          const isActive = index === activeIndex;
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
