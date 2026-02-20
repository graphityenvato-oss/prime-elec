"use client";

import { useMemo, useState } from "react";

import { StockProducts } from "@/components/stock-products";
import { SearchInput } from "@/components/search-input";

type StockSearchItem = {
  id: string;
  image: string;
  title: string;
  partNumber: string;
  codeNo?: string;
  brand: string;
  category: string;
  description: string;
};

type StockSearchResultsClientProps = {
  products: StockSearchItem[];
};

export function StockSearchResultsClient({
  products,
}: StockSearchResultsClientProps) {
  const [localQuery, setLocalQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    if (!q) return products;

    const tokens = q.split(/\s+/).filter(Boolean);
    return products.filter((product) => {
      const haystack = [
        product.title,
        product.partNumber,
        product.codeNo ?? "",
        product.brand ?? "",
        product.category ?? "",
        product.description,
      ]
        .join(" ")
        .toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }, [localQuery, products]);

  return (
    <div className="mt-8">
      <div className="mb-4 max-w-xl">
        <SearchInput
          value={localQuery}
          onValueChange={setLocalQuery}
          placeholder="Filter these results..."
        />
      </div>

      {filteredProducts.length ? (
        <StockProducts products={filteredProducts} perPage={12} />
      ) : (
        <div className="rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          No products match &quot;{localQuery.trim()}&quot; in current results.
        </div>
      )}
    </div>
  );
}
