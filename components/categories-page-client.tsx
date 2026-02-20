"use client";

import { useMemo, useState } from "react";

import {
  CategoriesGrid,
  type CategoryCard,
} from "@/components/categories-grid";
import { SearchInput } from "@/components/search-input";

type CategoriesPageClientProps = {
  categories: CategoryCard[];
};

export function CategoriesPageClient({
  categories,
}: CategoriesPageClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;
    return categories.filter((category) => {
      const title = category.title.toLowerCase();
      const description = category.description.toLowerCase();
      return title.includes(normalized) || description.includes(normalized);
    });
  }, [categories, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <>
      <div className="mt-4 max-w-md">
        <SearchInput
          placeholder="Search categories"
          value={query}
          onValueChange={setQuery}
        />
      </div>
      {filtered.length ? (
        <CategoriesGrid
          key={query}
          categories={filtered}
          buttonLabel="View Brands"
          cardLayout="image-left"
        />
      ) : (
        <div className="mt-10 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {hasQuery
            ? `No categories match "${query.trim()}".`
            : "No categories available yet."}
        </div>
      )}
    </>
  );
}
