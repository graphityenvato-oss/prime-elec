"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { motion } from "framer-motion";

import { PrimeCard } from "@/components/ui/prime-card";

type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

type TestimonialsClientProps = {
  title: string;
  items: TestimonialItem[];
};

export function TestimonialsClient({ title, items }: TestimonialsClientProps) {
  const [index, setIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(280);
  const gap = 20;

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
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  const step = cardWidth + gap;

  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-linear-to-br from-muted/40 via-background to-background px-6 py-10 text-foreground shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <h2 className="text-center text-3xl font-extrabold tracking-tight">
        {title}
      </h2>

      <div ref={containerRef} className="mt-8 overflow-hidden">
        <motion.div
          className="flex w-max flex-nowrap"
          style={{ gap }}
          animate={{
            x: -(index * step),
          }}
          transition={
            isResetting ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }
          }
        >
          {loopItems.map((item, itemIndex) => (
            <PrimeCard
              key={`${item.name}-${itemIndex}`}
              className="flex flex-none rounded-3xl p-6 shadow-none"
              style={{ width: cardWidth }}
            >
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &quot;{item.quote}&quot;
                </p>

                <div className="mt-6">
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.role}
                  </div>
                  <div className="mt-2 text-xs text-amber-500">
                    {"★".repeat(item.rating)}
                  </div>
                </div>
              </div>
            </PrimeCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


