"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToQuoteButton } from "@/components/add-to-quote-button";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";

type ProductCardProps = {
  id: string;
  image: string;
  title: string;
  partNumber: string;
  codeNo?: string;
  brand?: string;
  category?: string;
  description: string;
  href?: string;
};

export function ProductCard({
  id,
  image,
  title,
  partNumber,
  codeNo,
  brand,
  category,
  description,
  href,
}: ProductCardProps) {
  const safeImage =
    image && (image.startsWith("/") || image.startsWith("http"))
      ? image
      : "/images/placeholder/imageholder.webp";

  return (
    <GlowCard
      className="h-full p-5 text-foreground dark:text-white"
      contentClassName="flex h-full flex-col"
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="order-2 h-20 w-24 sm:order-1">
          {href ? (
            <Link href={href} aria-label={`${title} details`}>
              <Image
                src={safeImage}
                alt={partNumber}
                width={160}
                height={160}
                className="h-full w-auto object-contain"
              />
            </Link>
          ) : (
            <Image
              src={safeImage}
              alt={partNumber}
              width={160}
              height={160}
              className="h-full w-auto object-contain"
            />
          )}
        </div>
      </div>

      <div className="py-2">
        {href ? (
          <Link
            href={href}
            className="line-clamp-2 text-lg font-semibold transition-colors hover:text-primary"
          >
            {title}
          </Link>
        ) : (
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        )}
        <p className="mt-1 text-xs text-muted-foreground dark:text-white/60">
          Code No.{" "}
          <span className="font-semibold text-foreground dark:text-white">
            {partNumber}
          </span>
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-foreground/70 dark:text-white/70">
          {description}
        </p>
      </div>

      <div className="mt-auto grid gap-1 sm:grid-cols-2">
        <AddToQuoteButton
          product={{
            id,
            name: title,
            partNumber,
            codeNo,
            image: safeImage,
            brand,
            category,
          }}
          className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        />
        {href ? (
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link href={href}>View Details</Link>
          </Button>
        ) : null}
      </div>
    </GlowCard>
  );
}
