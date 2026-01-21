"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

type HeroImageParallaxProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function HeroImageParallax({
  src,
  alt,
  width,
  height,
}: HeroImageParallaxProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.2 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.2 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left - bounds.width / 2;
    const offsetY = event.clientY - bounds.top - bounds.height / 2;
    x.set((offsetX / bounds.width) * 24);
    y.set((offsetY / bounds.height) * 24);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="relative z-10 w-full"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="will-change-transform"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full object-cover mix-blend-screen opacity-95"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
