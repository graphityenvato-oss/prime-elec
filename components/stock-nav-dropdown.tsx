"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StockNavDropdownProps = {
  renderTrigger: (children: React.ReactNode) => React.ReactNode;
};

type StockCategoryItem = {
  slug: string;
  title: string;
  image: string;
  products: number;
};

export function StockNavDropdown({ renderTrigger }: StockNavDropdownProps) {
  const pathname = usePathname();
  const isStockPage = pathname?.startsWith("/stock");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const [items, setItems] = useState<StockCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/stock/categories");
        const data = (await response.json().catch(() => null)) as {
          categories?: StockCategoryItem[];
        } | null;
        if (active && Array.isArray(data?.categories)) {
          setItems(data.categories);
        }
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const visibleItems = items.slice(0, 8);

  const openMenu = () => {
    if (isStockPage) return;
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
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        if (isStockPage) return;
        setOpen(next);
      }}
      modal={false}
    >
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
              <span className="inline-flex items-center">Stock</span>,
            )}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          sideOffset={14}
          className="w-[680px] rounded-2xl border border-border/60 bg-white p-6 text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-[#0b1118] dark:text-white"
          onMouseEnter={openMenu}
          onMouseMove={openMenu}
          onMouseLeave={scheduleClose}
          onPointerEnter={openMenu}
          onPointerLeave={scheduleClose}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Stock
              </p>
              <p className="text-sm font-semibold">Browse stock categories</p>
            </div>
            <Link
              href="/stock"
              className="text-xs font-semibold text-primary hover:text-primary/80"
              onClick={() => setOpen(false)}
            >
              All Stock
            </Link>
          </div>
          {isLoading ? (
            <div className="py-6 text-sm text-muted-foreground">
              Loading stock categories...
            </div>
          ) : items.length ? (
            <div className="grid grid-cols-2 gap-3">
              {visibleItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/stock/${item.slug}`}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground transition hover:bg-primary/5 dark:text-white/90 dark:hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted/10">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium group-hover:text-primary dark:group-hover:text-white">
                      {item.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.products} products
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-primary/70 transition group-hover:text-primary dark:text-white/60 dark:group-hover:text-white" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-6 text-sm text-muted-foreground">
              No stock categories available.
            </div>
          )}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
