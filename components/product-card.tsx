"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

type ProductCardProps = {
  image: string;
  title: string;
  partNumber: string;
  description: string;
  inStock: boolean;
  href?: string;
};

export function ProductCard({
  image,
  title,
  partNumber,
  description,
  inStock,
  href,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="brand-glow-card brand-glow-card--static h-65 p-5 text-foreground dark:text-white"
    >
      <div className="brand-glow-card__content flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="h-20 w-24">
            {href ? (
              <Link href={href} aria-label={`${title} details`}>
                <Image
                  src={image}
                  alt={partNumber}
                  width={160}
                  height={160}
                  className="h-full w-auto object-contain"
                />
              </Link>
            ) : (
              <Image
                src={image}
                alt={partNumber}
                width={160}
                height={160}
                className="h-full w-auto object-contain"
              />
            )}
          </div>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
              inStock
                ? "badge-radar bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div>
          {href ? (
            <Link href={href} className="text-lg font-semibold">
              {title}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold">{title}</h3>
          )}
          <p className="mt-1 text-xs text-muted-foreground dark:text-white/60">
            Part No.{" "}
            <span className="font-semibold text-foreground dark:text-white">
              {partNumber}
            </span>
          </p>
          <p className="mt-2 text-sm text-foreground/70 dark:text-white/70">
            {description}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Add to Quote
          </Button>
          {href ? (
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href={href}>View Details</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
