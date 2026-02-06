"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { HoverCard } from "@/components/hover-card";
import { Reveal } from "@/components/reveal";
import { SearchInput } from "@/components/search-input";

type SubcategoryItem = {
  title: string;
  image?: string | null;
  pageUrl?: string | null;
};

type SubcategoryPageClientProps = {
  items: SubcategoryItem[];
};

export function SubcategoryPageClient({ items }: SubcategoryPageClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(normalized),
    );
  }, [items, query]);
  const hasQuery = query.trim().length > 0;

  return (
    <>
      <div className="mt-4 max-w-md">
        <SearchInput
          placeholder="Search subcategories"
          value={query}
          onValueChange={setQuery}
        />
      </div>

      {filtered.length ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <HoverCard
                className="h-55 p-4 text-foreground dark:text-white sm:h-50 sm:p-6"
                contentClassName="flex h-full flex-col justify-between"
              >
                <div className="h-14 w-32 sm:h-16 sm:w-36">
                  <Image
                    src={item.image ?? "/images/placeholder/imageholder.webp"}
                    alt={`${item.title} product`}
                    width={180}
                    height={120}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div>
                  {item.pageUrl ? (
                    <Link
                      href={item.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-foreground transition-colors hover:text-primary dark:text-white"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                  )}
                </div>
                {item.pageUrl ? (
                  <Link
                    href={item.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10"
                  >
                    View Products
                  </Link>
                ) : null}
              </HoverCard>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {hasQuery
            ? `No subcategories match "${query.trim()}".`
            : "No subcategories available for this brand and category yet."}
        </div>
      )}
    </>
  );
}
