"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { GlowCard } from "@/components/ui/glow-card";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNumbers,
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
  buttonLabel?: string;
};

const ITEMS_PER_PAGE = 9;

export function CategoriesGrid({
  categories,
  buttonLabel = "View Categories",
}: CategoriesGridProps) {
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
        {visible.map((category, index) => (
          <Reveal
            key={`${category.title}-${category.logo}`}
            delay={index * 0.06}
          >
            <GlowCard
              className="min-h-[14rem] p-6 text-foreground dark:text-white"
              contentClassName="flex h-full flex-col justify-between pb-2"
            >
              <div className="h-[68px] w-[68px]">
                <Image
                  src={category.logo}
                  alt={`${category.title} logo`}
                  width={68}
                  height={68}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-5 min-h-[3.25rem] text-lg font-semibold leading-snug text-foreground dark:text-white line-clamp-2">
                {category.title}
              </h3>
              <Link
                href={category.href}
                className="mt-3 mb-1 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10"
              >
                <span>{buttonLabel}</span>
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </GlowCard>
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
            <PaginationNumbers
              totalPages={totalPages}
              currentPage={page}
              onPageChange={goToPage}
            />
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
