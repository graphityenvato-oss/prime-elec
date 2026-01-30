"use client";

import type { ReactNode } from "react";
import { motion, type Transition } from "framer-motion";

import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  hover?: { y?: number; scale?: number };
  transition?: Transition;
};

export function GlowCard({
  children,
  className,
  contentClassName,
  hover = { y: -4 },
  transition = { type: "spring", stiffness: 240, damping: 18 },
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={hover}
      transition={transition}
      className={cn("brand-glow-card brand-glow-card--static", className)}
    >
      <div className={cn("brand-glow-card__content", contentClassName)}>
        {children}
      </div>
    </motion.div>
  );
}
