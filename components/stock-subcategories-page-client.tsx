"use client";

import { useMemo, useState } from "react";

import {
  CategoriesGrid,
  type CategoryCard,
} from "@/components/categories-grid";
import { SearchInput } from "@/components/search-input";

type StockSubcategoriesPageClientProps = {
  cards: CategoryCard[];
};

export function StockSubcategoriesPageClient({
  cards,
}: StockSubcategoriesPageClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return cards;
    return cards.filter((card) => {
      const title = card.title.toLowerCase();
      const description = card.description.toLowerCase();
      return title.includes(normalized) || description.includes(normalized);
    });
  }, [cards, query]);

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
        <CategoriesGrid
          categories={filtered}
          buttonLabel="View Products"
          imageFillTopHalf
          topImageHeightClass="h-44"
          gridClassName="lg:grid-cols-4"
          itemsPerPage={12}
        />
      ) : (
        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {hasQuery
            ? `No subcategories match "${query.trim()}".`
            : "No subcategories available."}
        </div>
      )}
    </>
  );
}
