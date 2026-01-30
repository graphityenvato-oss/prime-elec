"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type HoverCardProps = {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export function HoverCard({
  className,
  contentClassName,
  children,
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={cn("brand-glow-card brand-glow-card--static", className)}
    >
      <div className={cn("brand-glow-card__content", contentClassName)}>
        {children}
      </div>
    </motion.div>
  );
}
