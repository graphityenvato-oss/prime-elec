"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import type { Product } from "@/lib/products";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type StockProduct = Pick<
  Product,
  "id" | "image" | "title" | "partNumber" | "description" | "inStock"
>;

type StockProductsProps = {
  products: StockProduct[];
  perPage?: number;
};

export function StockProducts({ products, perPage = 12 }: StockProductsProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));

  const visible = useMemo(() => {
    const start = (page - 1) * perPage;
    return products.slice(start, start + perPage);
  }, [page, perPage, products]);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(next, 1), totalPages));
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((product, index) => (
          <Reveal key={product.partNumber} delay={index * 0.06}>
            <ProductCard
              href={`/products/${product.id}`}
              image={product.image}
              title={product.title}
              partNumber={product.partNumber}
              description={product.description}
              inStock={product.inStock}
            />
          </Reveal>
        ))}
      </div>

      {totalPages > 1 ? (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className={page === 1 ? "pointer-events-none opacity-40" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(page - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                className={page === totalPages ? "pointer-events-none opacity-40" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </>
  );
}
