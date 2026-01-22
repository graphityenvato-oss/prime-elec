"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { Reveal } from "@/components/reveal";
import { PrimeCard } from "@/components/ui/prime-card";

export type FeaturedStockCategory = {
  title: string;
  description: string;
  image: string;
};

type FeaturedStockClientProps = {
  categories: FeaturedStockCategory[];
};

export function FeaturedStockClient({ categories }: FeaturedStockClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(260);
  const [slots, setSlots] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);
  const gap = 16;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const width = container.clientWidth;
      const nextSlots =
        window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
      const nextWidth = Math.max(
        0,
        Math.floor((width - gap * (nextSlots - 1)) / nextSlots),
      );
      setSlots(nextSlots);
      setCardWidth(nextWidth);
      setIsMobile(nextSlots === 1);
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const maxIndex = Math.max(0, categories.length - slots);
  const step = cardWidth + gap;
  const goPrev = () => setIndex((prev) => Math.max(0, prev - 1));
  const goNext = () => setIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <div className="relative mt-8">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={goPrev}
        disabled={index === 0}
        className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/60 bg-primary p-2 text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary/90 disabled:opacity-40 md:flex"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={goNext}
        disabled={index >= maxIndex}
        className="absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/60 bg-primary p-2 text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary/90 disabled:opacity-40 md:flex"
      >
        <ChevronRight className="size-5" />
      </button>

      <div
        ref={containerRef}
        className={
          isMobile
            ? "hide-scrollbar overflow-x-auto pb-2 pt-1"
            : "overflow-hidden pb-2 pt-1"
        }
      >
        {isMobile ? (
          <div className="flex snap-x snap-mandatory gap-4">
            {categories.map((category, itemIndex) => (
              <Reveal key={category.title} delay={itemIndex * 0.08}>
                <PrimeCard
                  data-card
                  className="flex-none snap-start bg-muted/20 p-5 shadow-none"
                  style={{ width: cardWidth }}
                >
                  <div
                    className="h-36 w-full rounded-xl border border-border/60 bg-cover bg-center"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <h3 className="mt-4 text-lg font-semibold">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <button className="mt-4 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/30">
                    Explore category
                  </button>
                </PrimeCard>
              </Reveal>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex"
            style={{ gap }}
            animate={{ x: -(index * step) }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            {categories.map((category, itemIndex) => (
              <Reveal key={category.title} delay={itemIndex * 0.08}>
                <PrimeCard
                  data-card
                  className="flex-none bg-muted/20 p-5 shadow-none"
                  style={{ width: cardWidth }}
                >
                  <div
                    className="h-36 w-full rounded-xl border border-border/60 bg-cover bg-center"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <h3 className="mt-4 text-lg font-semibold">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <button className="mt-4 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/30">
                    Explore category
                  </button>
                </PrimeCard>
              </Reveal>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
