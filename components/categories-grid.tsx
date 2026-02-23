"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Reveal } from "@/components/reveal";
import { GlowCard } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";

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
  logoSlides?: string[];
};

type CategoriesGridProps = {
  categories: CategoryCard[];
  buttonLabel?: string;
  imageFillTopHalf?: boolean;
  cardLayout?: "default" | "image-left";
  gridClassName?: string;
  itemsPerPage?: number;
  topImageContain?: boolean;
  topImageHeightClass?: string;
  pagination?: boolean;
  stateKey?: string;
};

const ITEMS_PER_PAGE = 9;

function CardTopImage({
  title,
  logo,
  logoSlides,
  topImageContain,
}: {
  title: string;
  logo: string;
  logoSlides?: string[];
  topImageContain: boolean;
}) {
  const slides = useMemo(
    () =>
      logoSlides && logoSlides.length > 0
        ? Array.from(new Set(logoSlides.filter(Boolean)))
        : [logo],
    [logo, logoSlides],
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const loadedSlidesRef = useRef<Set<number>>(new Set());

  const markLoaded = useCallback((index: number) => {
    loadedSlidesRef.current.add(index);
  }, []);

  useEffect(() => {
    loadedSlidesRef.current = new Set();
    slides.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => markLoaded(index);
      img.onerror = () => markLoaded(index);
      img.src = src;
    });
  }, [markLoaded, slides]);

  // Auto-switch only when multiple images are available.
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => {
        const current = prev % slides.length;
        const next = (current + 1) % slides.length;
        return loadedSlidesRef.current.has(next) ? next : current;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const displayedIndex = slides.length ? activeSlide % slides.length : 0;

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={`${title}-slide-${displayedIndex}`}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.01 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Image
          src={slides[displayedIndex] ?? logo}
          alt={`${title} image ${displayedIndex + 1}`}
          fill
          className={topImageContain ? "object-contain" : "object-cover"}
          onLoadingComplete={() => markLoaded(displayedIndex)}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export function CategoriesGrid({
  categories,
  buttonLabel = "View Categories",
  imageFillTopHalf = false,
  cardLayout = "default",
  gridClassName,
  itemsPerPage = ITEMS_PER_PAGE,
  topImageContain = true,
  topImageHeightClass = "h-32",
  pagination = true,
  stateKey = "cg",
}: CategoriesGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParamKey = `${stateKey}_page`;
  const modeParamKey = `${stateKey}_mode`;
  const loadedParamKey = `${stateKey}_loaded`;

  const parsedPage = Number(searchParams.get(pageParamKey) ?? "1");
  const parsedLoadedPages = Number(searchParams.get(loadedParamKey) ?? "1");
  const parsedMode =
    searchParams.get(modeParamKey) === "load-more" ? "load-more" : "pagination";
  const totalPages = pagination
    ? Math.max(1, Math.ceil(categories.length / itemsPerPage))
    : 1;
  const safePage = Math.min(
    Math.max(Number.isFinite(parsedPage) ? parsedPage : 1, 1),
    totalPages,
  );
  const safeLoadedPages = Math.min(
    Math.max(Number.isFinite(parsedLoadedPages) ? parsedLoadedPages : 1, 1),
    totalPages,
  );
  const safeMode = pagination ? parsedMode : "pagination";
  const currentPage = safeMode === "load-more" ? safeLoadedPages : safePage;

  const updateState = (
    nextMode: "pagination" | "load-more",
    nextPage: number,
    nextLoadedPages: number,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const clampedPage = Math.min(Math.max(nextPage, 1), totalPages);
    const clampedLoaded = Math.min(Math.max(nextLoadedPages, 1), totalPages);

    if (nextMode === "load-more") params.set(modeParamKey, "load-more");
    else params.delete(modeParamKey);

    if (clampedPage > 1) params.set(pageParamKey, String(clampedPage));
    else params.delete(pageParamKey);

    if (clampedLoaded > 1) params.set(loadedParamKey, String(clampedLoaded));
    else params.delete(loadedParamKey);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const visible = useMemo(() => {
    if (!pagination) return categories;
    if (safeMode === "load-more") {
      return categories.slice(0, safeLoadedPages * itemsPerPage);
    }
    const start = (safePage - 1) * itemsPerPage;
    return categories.slice(start, start + itemsPerPage);
  }, [
    categories,
    itemsPerPage,
    pagination,
    safeLoadedPages,
    safeMode,
    safePage,
  ]);

  const goToPage = (next: number) => {
    updateState("pagination", next, 1);
  };

  const loadMore = () => {
    const base = Math.max(safeLoadedPages, safePage);
    updateState("load-more", safePage, base + 1);
  };

  return (
    <div className="mt-10">
      <div
        className={`grid items-stretch gap-6 sm:grid-cols-2 ${gridClassName ?? "lg:grid-cols-3"}`}
      >
        {visible.map((category, index) => (
          <Reveal
            key={`${category.title}-${category.logo}`}
            delay={
              safeMode === "load-more"
                ? (index % itemsPerPage) * 0.02
                : index * 0.06
            }
          >
            <div className="h-full">
              <GlowCard
                className="h-full min-h-[14rem] p-6 text-foreground dark:text-white"
                contentClassName={
                  cardLayout === "image-left"
                    ? "grid h-full grid-cols-1 items-center gap-4 sm:grid-cols-[96px_minmax(0,1fr)]"
                    : "flex h-full flex-col justify-between pb-2"
                }
              >
                {cardLayout === "image-left" ? (
                  <>
                    <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-white sm:mx-0">
                      <CardTopImage
                        title={category.title}
                        logo={category.logo}
                        logoSlides={category.logoSlides}
                        topImageContain={false}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center text-center sm:items-start sm:text-left">
                      <Link
                        href={category.href}
                        className="text-lg font-semibold leading-snug text-foreground transition-colors line-clamp-2 hover:text-primary dark:text-white"
                      >
                        {category.title}
                      </Link>
                      <Link
                        href={category.href}
                        className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 sm:text-xs sm:tracking-[0.2em] dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10"
                      >
                        <span>{buttonLabel}</span>
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {imageFillTopHalf ? (
                      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white">
                        <div
                          className={`relative w-full ${topImageHeightClass}`}
                        >
                          <CardTopImage
                            title={category.title}
                            logo={category.logo}
                            logoSlides={category.logoSlides}
                            topImageContain={topImageContain}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-[68px] w-[68px]">
                        <Image
                          src={category.logo}
                          alt={`${category.title} logo`}
                          width={68}
                          height={68}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <Link
                      href={category.href}
                      className="mt-5 min-h-[3.25rem] text-lg font-semibold leading-snug text-foreground transition-colors line-clamp-2 hover:text-primary dark:text-white"
                    >
                      {category.title}
                    </Link>
                    <Link
                      href={category.href}
                      className="mt-3 mb-1 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 sm:text-xs sm:tracking-[0.2em] dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10"
                    >
                      <span>{buttonLabel}</span>
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </Link>
                  </>
                )}
              </GlowCard>
            </div>
          </Reveal>
        ))}
      </div>

      {pagination && totalPages > 1 ? (
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
                  href="#"
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
                  href="#"
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
    </div>
  );
}
