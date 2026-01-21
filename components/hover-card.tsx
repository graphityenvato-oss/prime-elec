"use client";

import { motion } from "framer-motion";

type HoverCardProps = {
  className?: string;
  children: React.ReactNode;
};

export function HoverCard({ className, children }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
