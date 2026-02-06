"use client";

import { useMemo, useState } from "react";

import { CategoriesGrid, type CategoryCard } from "@/components/categories-grid";
import { SearchInput } from "@/components/search-input";

type CategoryBrandsPageClientProps = {
  brands: CategoryCard[];
};

export function CategoryBrandsPageClient({
  brands,
}: CategoryBrandsPageClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return brands;
    return brands.filter((brand) => {
      const title = brand.title.toLowerCase();
      const description = brand.description.toLowerCase();
      return (
        title.includes(normalized) || description.includes(normalized)
      );
    });
  }, [brands, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <>
      <div className="mt-4 max-w-md">
        <SearchInput
          placeholder="Search brands"
          value={query}
          onValueChange={setQuery}
        />
      </div>
      {filtered.length ? (
        <CategoriesGrid
          key={query}
          categories={filtered}
          buttonLabel="View Subcategories"
        />
      ) : (
        <div className="mt-10 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {hasQuery
            ? `No brands match "${query.trim()}".`
            : "No brands available for this category yet."}
        </div>
      )}
    </>
  );
}
