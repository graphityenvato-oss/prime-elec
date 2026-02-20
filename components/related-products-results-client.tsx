"use client";

import { useMemo, useState } from "react";

import { SearchInput } from "@/components/search-input";
import { StockProducts } from "@/components/stock-products";
import type { Product } from "@/lib/products";

type RelatedProductsResultsClientProps = {
  products: Product[];
};

export function RelatedProductsResultsClient({
  products,
}: RelatedProductsResultsClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.partNumber.toLowerCase().includes(normalized) ||
        (item.codeNo ?? "").toLowerCase().includes(normalized) ||
        item.brand.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized)
      );
    });
  }, [products, query]);
  const hasQuery = query.trim().length > 0;

  return (
    <>
      <div className="max-w-md">
        <SearchInput
          placeholder="Search related products"
          value={query}
          onValueChange={setQuery}
        />
      </div>

      {filtered.length ? (
        <div className="mt-8">
          <StockProducts products={filtered} perPage={12} />
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {hasQuery
            ? `No products match "${query.trim()}".`
            : "No related products found."}
        </div>
      )}
    </>
  );
}
