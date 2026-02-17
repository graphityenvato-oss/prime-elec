"use client";

import { useMemo, useState } from "react";

import { StockProducts } from "@/components/stock-products";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchInput } from "@/components/search-input";
import type { Product } from "@/lib/products";

type StockSubcategoryProductsClientProps = {
  products: Product[];
};

type DetailFacet = {
  label: string;
  values: Array<{ value: string; count: number }>;
};

export function StockSubcategoryProductsClient({
  products,
}: StockSubcategoryProductsClientProps) {
  const [query, setQuery] = useState("");
  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.brand)
            .filter((brand) => Boolean(brand?.trim())),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [products],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<
    Record<string, string[]>
  >({});

  const detailFacets = useMemo<DetailFacet[]>(() => {
    const labelToValueCount = new Map<string, Map<string, number>>();

    products.forEach((product) => {
      product.specs.forEach((spec) => {
        const label = spec.label.trim();
        const value = spec.value.trim();
        if (!label || !value) return;

        if (!labelToValueCount.has(label)) {
          labelToValueCount.set(label, new Map<string, number>());
        }
        const valueCount = labelToValueCount.get(label)!;
        valueCount.set(value, (valueCount.get(value) ?? 0) + 1);
      });
    });

    return Array.from(labelToValueCount.entries())
      .filter(([, valuesMap]) => valuesMap.size > 1)
      .map(([label, valuesMap]) => ({
        label,
        values: Array.from(valuesMap.entries())
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => a.value.localeCompare(b.value)),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [products]);

  const toggleBrand = (brand: string, checked: boolean | "indeterminate") => {
    if (checked !== true) {
      setSelectedBrands((current) => current.filter((item) => item !== brand));
      return;
    }
    setSelectedBrands((current) =>
      current.includes(brand) ? current : [...current, brand],
    );
  };

  const toggleDetailValue = (
    label: string,
    value: string,
    checked: boolean | "indeterminate",
  ) => {
    setSelectedDetails((current) => {
      const existing = current[label] ?? [];
      if (checked !== true) {
        const nextValues = existing.filter((item) => item !== value);
        if (!nextValues.length) {
          const rest = { ...current };
          delete rest[label];
          return rest;
        }
        return { ...current, [label]: nextValues };
      }

      if (existing.includes(value)) {
        return current;
      }
      return { ...current, [label]: [...existing, value] };
    });
  };

  const filteredProducts = useMemo(() => {
    const brandFiltered = selectedBrands.length
      ? products.filter((product) => selectedBrands.includes(product.brand))
      : products;

    const detailEntries = Object.entries(selectedDetails).filter(
      ([, values]) => values.length > 0,
    );
    const detailsFiltered = detailEntries.length
      ? brandFiltered.filter((product) =>
          detailEntries.every(([label, values]) =>
            product.specs.some(
              (spec) =>
                spec.label.trim() === label &&
                values.includes(spec.value.trim()),
            ),
          ),
        )
      : brandFiltered;

    const queryTokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!queryTokens.length) {
      return detailsFiltered;
    }

    return detailsFiltered.filter((product) => {
      const haystack = [
        product.title,
        product.codeNo ?? "",
        product.partNumber,
        product.description,
        product.brand,
      ]
        .join(" ")
        .toLowerCase();
      return queryTokens.every((token) => haystack.includes(token));
    });
  }, [products, query, selectedBrands, selectedDetails]);

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    Object.keys(selectedDetails).length > 0 ||
    query.trim().length > 0;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl border border-border/60 bg-background p-5 shadow-[0_18px_40px_rgba(12,28,60,0.08)]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              setSelectedBrands([]);
              setSelectedDetails({});
              setQuery("");
            }}
            disabled={!hasActiveFilters}
          >
            Clear
          </Button>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="text-sm font-semibold text-primary">Brand</h3>
          <div className="mt-3 space-y-3">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => toggleBrand(brand, checked)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {detailFacets.length ? <Separator className="my-4" /> : null}

        {detailFacets.map((facet) => (
          <div key={facet.label} className="mt-4 first:mt-0">
            <h3 className="text-sm font-semibold text-primary">
              {facet.label}
            </h3>
            <div className="mt-3 space-y-3">
              {facet.values.map((item) => (
                <label
                  key={`${facet.label}-${item.value}`}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Checkbox
                      checked={(selectedDetails[facet.label] ?? []).includes(
                        item.value,
                      )}
                      onCheckedChange={(checked) =>
                        toggleDetailValue(facet.label, item.value, checked)
                      }
                    />
                    <span>{item.value}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.count}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </aside>

      <div>
        <div className="mb-4">
          <SearchInput
            placeholder="Search products"
            value={query}
            onValueChange={setQuery}
          />
        </div>
        {filteredProducts.length ? (
          <StockProducts products={filteredProducts} perPage={12} />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
            {query.trim().length
              ? `No products match "${query.trim()}".`
              : "No products match the selected filters."}
          </div>
        )}
      </div>
    </div>
  );
}
