"use client";

import { motion } from "framer-motion";

export function HeroArrows() {
  return (
    <motion.div
      className="pointer-events-none absolute left-3 top-[-20] z-20 sm:left-10 sm:top-16 md:left-1/6 md:top-6"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 120 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      <svg width="90" height="90" viewBox="0 0 120 120" fill="none" aria-hidden>
        <motion.path
          d="M24 24L60 60L96 24"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M24 52L60 88L96 52"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary/80"
          animate={{ y: [0, 4, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.15,
          }}
        />
        <motion.path
          d="M24 80L60 116L96 80"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary/60"
          animate={{ y: [0, 4, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
      </svg>
    </motion.div>
  );
}
