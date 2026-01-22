"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type CategoryCard = {
  title: string;
  description: string;
  href: string;
  logo: string;
};

type CategoriesGridProps = {
  categories: CategoryCard[];
};

const ITEMS_PER_PAGE = 9;

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(categories.length / ITEMS_PER_PAGE));

  const visible = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return categories.slice(start, start + ITEMS_PER_PAGE);
  }, [categories, page]);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(next, 1), totalPages));
  };

  return (
    <div className="mt-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((category) => (
          <motion.div
            key={`${category.title}-${category.logo}`}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="brand-glow-card brand-glow-card--static h-50 p-6 text-foreground dark:text-white"
          >
            <div className="brand-glow-card__content flex h-full flex-col justify-between">
              <div className="h-10 w-32">
                <Image
                  src={category.logo}
                  alt={`${category.title} logo`}
                  width={140}
                  height={40}
                  className="h-full w-auto object-contain"
                />
              </div>
              <p className="text-base leading-snug text-foreground/90 dark:text-white/85">
                {category.description}
              </p>
              <Link
                href={category.href}
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10"
              >
                <span>View Categories</span>
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
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
                className={
                  page === totalPages ? "pointer-events-none opacity-40" : ""
                }
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
