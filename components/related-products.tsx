"use client";

import Image from "next/image";
import Link from "next/link";

import { HoverCard } from "@/components/hover-card";
import type { Product } from "@/lib/products";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Related products</h2>
        <Link
          href="/stock"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground"
        >
          View all
        </Link>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <HoverCard
            key={item.id}
            className="rounded-2xl border border-border/60 bg-background p-4"
          >
            <Link href={`/products/${item.id}`} className="group block">
              <div className="flex items-center justify-center rounded-xl bg-muted/10 p-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={160}
                  height={160}
                  className="h-20 w-full object-contain"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Part No.{" "}
                  <span className="font-semibold text-foreground">
                    {item.partNumber}
                  </span>
                </p>
              </div>
            </Link>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
