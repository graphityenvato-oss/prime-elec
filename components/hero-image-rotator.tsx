"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type HeroImageRotatorProps = {
  images: { src: string; alt: string }[];
  intervalMs?: number;
};

export function HeroImageRotator({
  images,
  intervalMs = 5000,
}: HeroImageRotatorProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  const current = images[index];

  return (
    <div className="relative h-full w-full bg-[#0b1118]">
      <AnimatePresence mode="sync">
        <motion.div
          key={current.src}
          className="absolute inset-0 bg-[#0b1118]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            className="object-contain object-center"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
