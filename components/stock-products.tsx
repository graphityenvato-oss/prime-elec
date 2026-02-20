"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsedPage = Number(searchParams.get("sp_page") ?? "1");
  const parsedLoadedPages = Number(searchParams.get("sp_loaded") ?? "1");
  const parsedMode =
    searchParams.get("sp_mode") === "load-more" ? "load-more" : "pagination";

  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const safePage = Math.min(
    Math.max(Number.isFinite(parsedPage) ? parsedPage : 1, 1),
    totalPages,
  );
  const safeLoadedPages = Math.min(
    Math.max(Number.isFinite(parsedLoadedPages) ? parsedLoadedPages : 1, 1),
    totalPages,
  );
  const safeMode = parsedMode;
  const currentPage = safeMode === "load-more" ? safeLoadedPages : safePage;

  const updateState = (
    nextMode: "pagination" | "load-more",
    nextPage: number,
    nextLoadedPages: number,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const clampedPage = Math.min(Math.max(nextPage, 1), totalPages);
    const clampedLoaded = Math.min(Math.max(nextLoadedPages, 1), totalPages);

    if (nextMode === "load-more") params.set("sp_mode", "load-more");
    else params.delete("sp_mode");

    if (clampedPage > 1) params.set("sp_page", String(clampedPage));
    else params.delete("sp_page");

    if (clampedLoaded > 1) params.set("sp_loaded", String(clampedLoaded));
    else params.delete("sp_loaded");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const visible = useMemo(() => {
    if (safeMode === "load-more") {
      return products.slice(0, safeLoadedPages * perPage);
    }
    const start = (safePage - 1) * perPage;
    return products.slice(start, start + perPage);
  }, [perPage, products, safeLoadedPages, safeMode, safePage]);

  const goToPage = (next: number) => {
    updateState("pagination", next, 1);
  };

  const loadMore = () => {
    const base = Math.max(safeLoadedPages, safePage);
    updateState("load-more", safePage, base + 1);
  };

  return (
    <>
      <div className="grid grid-cols-2 items-stretch gap-2 lg:grid-cols-3">
        {visible.map((product, index) => (
          <Reveal
            key={product.partNumber}
            delay={
              safeMode === "load-more" ? (index % perPage) * 0.02 : index * 0.06
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
