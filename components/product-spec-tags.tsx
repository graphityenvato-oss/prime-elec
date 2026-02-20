"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ProductSpec = {
  label: string;
  value: string;
};

type ProductSpecTagsProps = {
  productId: string;
  specs: ProductSpec[];
};

export function ProductSpecTags({ productId, specs }: ProductSpecTagsProps) {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  const groups = useMemo(() => {
    const chunks: ProductSpec[][] = [];
    for (let i = 0; i < specs.length; i += 3) {
      chunks.push(specs.slice(i, i + 3));
    }
    return chunks;
  }, [specs]);

  useEffect(() => {
    if (groups.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveGroupIndex((current) => (current + 1) % groups.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [groups.length]);

  const displayedGroupIndex =
    groups.length > 0 ? activeGroupIndex % groups.length : 0;
  const currentGroup = groups[displayedGroupIndex] ?? [];

  return (
    <div className="mt-5">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${productId}-spec-group-${displayedGroupIndex}`}
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {currentGroup.map((spec, index) => (
            <span
              key={`${productId}-tag-${displayedGroupIndex}-${spec.label}-${index}`}
              className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground/80 dark:border-primary"
            >
              {spec.label}: {spec.value}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
