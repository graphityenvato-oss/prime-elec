"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToQuoteButton } from "@/components/add-to-quote-button";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";

const brandLogoMap: Record<string, string> = {
  degson: "/images/partners/degson-logo.png",
  deltabox: "/images/partners/Deltabox.png",
  eaton: "/images/partners/Eaton-logo.png",
  fecheliportsequipment: "/images/partners/FEC-Heliports-Equipment-logo.png",
  indelec: "/images/partners/Indelec-logo.png",
  relpol: "/images/partners/Logo-Relpol.png",
  obo: "/images/partners/obo-logo.png",
  obobetterman: "/images/partners/obo-logo.png",
  obobettermann: "/images/partners/obo-logo.png",
  solway: "/images/partners/Solway.png",
  teknoware: "/images/partners/teknoware-logo.png",
  tem: "/images/partners/Tem-logo.png",
};

const normalizeBrandKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

const resolveBrandLogo = (name?: string) => {
  if (!name) return null;
  const key = normalizeBrandKey(name);
  return brandLogoMap[key] ?? (key.includes("obo") ? brandLogoMap.obo : null);
};

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
  showBrandTopRight?: boolean;
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
  showBrandTopRight = false,
}: ProductCardProps) {
  const safeImage =
    image && (image.startsWith("/") || image.startsWith("http"))
      ? image
      : "/images/placeholder/imageholder.webp";
  const brandLogo = resolveBrandLogo(brand);

  return (
    <GlowCard
      className="h-full p-5 text-foreground dark:text-white"
      contentClassName="flex h-full flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-20 w-24">
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
        {showBrandTopRight && brand ? (
          brandLogo ? (
            <div className="flex h-10 w-28 items-center justify-end">
              <Image
                src={brandLogo}
                alt={`${brand} logo`}
                width={112}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
          ) : (
            <p className="max-w-[60%] text-right text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              {brand}
            </p>
          )
        ) : null}
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
          Order#{" "}
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
