"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const [index, setIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(280);
  const gap = 24;

  const loopItems = useMemo(() => {
    if (items.length <= 3) return items;
    return [...items, ...items.slice(0, 3)];
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const width = container.clientWidth;
      const isMobile = window.innerWidth < 768;
      const slots = isMobile ? 1 : 3;
      const next = Math.max(0, Math.floor((width - gap * (slots - 1)) / slots));
      setCardWidth(next);
    };

    updateWidth();
    requestAnimationFrame(updateWidth);

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (items.length <= 3) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= items.length) {
          setIsResetting(true);
          setTimeout(() => setIsResetting(false), 20);
        }
        return next > items.length ? 0 : next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [items.length]);

  const step = cardWidth + gap;

  const renderCard = (item: PartnerCardItem) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative h-48 w-full overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -inset-px bg-linear-to-br from-primary/35 via-white/10 to-primary/25 opacity-100" />
      <div className="pointer-events-none absolute -inset-px bg-linear-to-r from-white/20 via-transparent to-white/10 opacity-80" />
      <div className="relative z-10 flex h-full justify-between p-5">
        <div className="flex flex-1 flex-col justify-between">
          <div className="relative h-8 w-32">
            <Image
              src={item.brandLogo}  
              alt={`${item.brandName} logo`}
              width={120}
              height={40}
              className="h-full w-auto object-contain object-left"
            />
          </div>
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-300/90">
              {item.partName}
            </p>
          </div>
        </div>
        <div className="relative h-full w-36 shrink-0 self-stretch">
          <Image
            src={item.productImage}
            alt={`${item.partName} product`}
            fill
            sizes="200px"
            className="object-contain"
          />
        </div>
      </div>
    </motion.div>
  );

  if (items.length <= 3) {
    return (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, itemIndex) => (
          <Reveal key={`${item.brandName}-${item.partName}`} delay={itemIndex * 0.06}>
            {renderCard(item)}
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10 w-full overflow-hidden" ref={containerRef}>
      <motion.div
        className="flex w-max flex-nowrap"
        style={{ gap }}
        animate={{ x: -(index * step) }}
        transition={
          isResetting ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }
        }
      >
        {loopItems.map((item, itemIndex) => (
          <div
            key={`${item.brandName}-${item.partName}-${itemIndex}`}
            className="flex-none"
            style={{ width: cardWidth }}
          >
            {renderCard(item)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
