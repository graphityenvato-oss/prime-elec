"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { Reveal } from "@/components/reveal";

export type PartnerCardItem = {
  brandName: string;
  brandLogo: string;
  partName: string;
  productImage: string;
};

type PartnerCardsProps = {
  items: PartnerCardItem[];
};

export function PartnerCards({ items }: PartnerCardsProps) {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 4) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % items.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [items.length]);

  const visibleItems = useMemo(() => {
    if (items.length <= 4) return items;
    return Array.from({ length: 4 }, (_, i) => items[(startIndex + i) % items.length]);
  }, [items, startIndex]);

  const renderCard = (item: PartnerCardItem, variant: "featured" | "default") => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={[
        "group relative h-[200px] w-full overflow-hidden rounded-2xl border border-primary bg-white text-foreground shadow-[0_24px_60px_-40px_rgba(15,23,42,0.2)]",
        variant === "featured" ? "" : "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_55%)]" />
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <div className="relative h-8 w-32">
            <Image
              src={item.brandLogo}
              alt={`${item.brandName} logo`}
              width={120}
              height={40}
              className="h-full w-auto object-contain object-left"
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
            Partner
          </span>
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-base font-semibold tracking-tight">
            {item.partName}
          </p>
        </div>
        <div className="relative mt-3 h-20 w-full">
          <Image
            src={item.productImage}
            alt={`${item.partName} product`}
            fill
            sizes="320px"
            className="object-contain object-right-bottom"
          />
        </div>
      </div>
    </motion.div>
  );

  if (!items.length) {
    return null;
  }

  if (items.length === 1) {
    return (
      <div className="mt-10 w-full md:mt-0">
        <Reveal>{renderCard(items[0], "featured")}</Reveal>
      </div>
    );
  }

  const displayItems = visibleItems;

  return (
    <div className="mt-10 w-full md:mt-0">
      <div className="md:hidden">
        <div className="flex w-full justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${items[startIndex]?.brandName}-${items[startIndex]?.partName}-${startIndex}`}
              className="w-full max-w-sm"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {items[startIndex]
                ? renderCard(items[startIndex], "default")
                : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
        {displayItems.map((item, itemIndex) => {
          const isFeatured = itemIndex === 0;
          return (
            <div
              key={`${item.brandName}-${item.partName}-${itemIndex}`}
              className=""
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: itemIndex * 0.04 }}
              >
                <Reveal delay={itemIndex * 0.03}>
                  {renderCard(item, isFeatured ? "featured" : "default")}
                </Reveal>
              </motion.div>
            </div>
          );
        })}
        </AnimatePresence>
      </div>
    </div>
  );
}
