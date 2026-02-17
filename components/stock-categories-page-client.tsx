"use client";

import { useMemo, useState } from "react";

import {
  CategoriesGrid,
  type CategoryCard,
} from "@/components/categories-grid";
import { SearchInput } from "@/components/search-input";

type StockCategoriesPageClientProps = {
  categories: CategoryCard[];
};

export function StockCategoriesPageClient({
  categories,
}: StockCategoriesPageClientProps) {
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
          placeholder="Search stock categories"
          value={query}
          onValueChange={setQuery}
        />
      </div>

      {filtered.length ? (
        <CategoriesGrid
          categories={filtered}
          buttonLabel="View Subcategories"
          imageFillTopHalf
        />
      ) : (
        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {hasQuery
            ? `No stock categories match "${query.trim()}".`
            : "No stock categories found."}
        </div>
      )}
    </>
  );
}
