"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CategoriesNavDropdownProps = {
  renderTrigger: (children: React.ReactNode) => React.ReactNode;
};

const chunkArray = <T,>(items: T[], columns: number) => {
  const result: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, index) => {
    result[index % columns].push(item);
  });
  return result;
};

export function CategoriesNavDropdown({
  renderTrigger,
}: CategoriesNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const [categories, setCategories] = useState<
    { slug: string; title: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/categories/list");
        const data = await response.json();
        if (active && Array.isArray(data?.categories)) {
          setCategories(data.categories);
        }
      } catch {
        if (active) {
          setCategories([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);
  const columns = useMemo(() => chunkArray(categories, 3), [categories]);

  const openMenu = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 140);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <div className="relative">
        <DropdownMenuTrigger asChild>
          <span
            className="inline-flex"
            onMouseEnter={openMenu}
            onMouseMove={openMenu}
            onMouseLeave={scheduleClose}
            onPointerEnter={openMenu}
            onPointerLeave={scheduleClose}
          >
            {renderTrigger(
              <span className="inline-flex items-center">Categories</span>,
            )}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={14}
          className="w-[900px] rounded-2xl border border-border/60 bg-white p-6 text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-[#0b1118] dark:text-white"
          onMouseEnter={openMenu}
          onMouseMove={openMenu}
          onMouseLeave={scheduleClose}
          onPointerEnter={openMenu}
          onPointerLeave={scheduleClose}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Categories
              </p>
              <p className="text-sm font-semibold">Explore by category</p>
            </div>
            <Link
              href="/categories"
              className="text-xs font-semibold text-primary hover:text-primary/80"
              onClick={() => setOpen(false)}
            >
              All Categories
            </Link>
          </div>
          {isLoading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading categories...
            </div>
          ) : categories.length ? (
            <div className="grid grid-cols-3 gap-4">
              {columns.map((column, colIndex) => (
                <div key={`col-${colIndex}`} className="space-y-2">
                  {column.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="group flex items-start gap-2 rounded-lg px-2 py-1 text-sm text-foreground transition hover:bg-primary/5 dark:text-white/90 dark:hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary/70 transition group-hover:text-primary dark:text-white/60 dark:group-hover:text-white" />
                    <span className="font-medium group-hover:text-primary dark:group-hover:text-white">
                      {category.title}
                    </span>
                  </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-sm text-muted-foreground">
              No categories available.
            </div>
          )}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
