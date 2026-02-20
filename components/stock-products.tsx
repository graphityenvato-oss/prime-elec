"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import type { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNumbers,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type StockProduct = Pick<
  Product,
  | "id"
  | "image"
  | "title"
  | "partNumber"
  | "codeNo"
  | "brand"
  | "category"
  | "description"
>;

type StockProductsProps = {
  products: StockProduct[];
  perPage?: number;
};

export function StockProducts({ products, perPage = 12 }: StockProductsProps) {
  const [page, setPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState(1);
  const [mode, setMode] = useState<"pagination" | "load-more">("pagination");
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const safeLoadedPages = Math.min(Math.max(loadedPages, 1), totalPages);
  const safeMode = mode;
  const currentPage = safeMode === "load-more" ? safeLoadedPages : safePage;

  const visible = useMemo(() => {
    if (safeMode === "load-more") {
      return products.slice(0, safeLoadedPages * perPage);
    }
    const start = (safePage - 1) * perPage;
    return products.slice(start, start + perPage);
  }, [perPage, products, safeLoadedPages, safeMode, safePage]);

  const goToPage = (next: number) => {
    setMode("pagination");
    setPage(Math.min(Math.max(next, 1), totalPages));
  };

  const loadMore = () => {
    setMode("load-more");
    setLoadedPages((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <>
      <div className="grid grid-cols-2 items-stretch gap-2 lg:grid-cols-3">
        {visible.map((product, index) => (
          <Reveal
            key={product.partNumber}
            delay={
              mode === "load-more" ? (index % perPage) * 0.02 : index * 0.06
            }
          >
            <ProductCard
              id={product.id}
              href={`/products/${product.id}`}
              image={product.image}
              title={product.title}
              partNumber={product.partNumber}
              codeNo={product.codeNo}
              brand={product.brand}
              category={product.category}
              description={product.description}
              showBrandTopRight
            />
          </Reveal>
        ))}
      </div>

      {totalPages > 1 ? (
        <>
          {currentPage < totalPages ? (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={loadMore}
              >
                Load More
              </Button>
            </div>
          ) : null}
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#top"
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-40" : ""
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    goToPage(currentPage - 1);
                  }}
                />
              </PaginationItem>

              <PaginationNumbers
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={goToPage}
              />

              <PaginationItem>
                <PaginationNext
                  href="#top"
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40"
                      : ""
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    goToPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : null}
    </>
  );
}
