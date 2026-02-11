"use client";

import { useMemo, useState } from "react";

import {
  CategoriesGrid,
  type CategoryCard,
} from "@/components/categories-grid";
import { SearchInput } from "@/components/search-input";

type IndustriesPageClientProps = {
  industries: CategoryCard[];
};

export function IndustriesPageClient({
  industries,
}: IndustriesPageClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return industries;
    return industries.filter((industry) => {
      const title = industry.title.toLowerCase();
      const description = industry.description.toLowerCase();
      return title.includes(normalized) || description.includes(normalized);
    });
  }, [industries, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <>
      <div className="mt-4 max-w-md">
        <SearchInput
          placeholder="Search industries"
          value={query}
          onValueChange={setQuery}
        />
      </div>
      {filtered.length ? (
        <CategoriesGrid
          key={query}
          categories={filtered}
          buttonLabel="View Categories"
          imageFillTopHalf
        />
      ) : (
        <div className="mt-10 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {hasQuery
            ? `No industries match "${query.trim()}".`
            : "No industries available yet."}
        </div>
      )}
    </>
  );
}
