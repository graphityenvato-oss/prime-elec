"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileUpload03 from "@/components/file-upload-03";
import { Menu, Moon, Search, ShoppingCart, Sun, X } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { BrandsNavDropdown } from "@/components/brands-nav-dropdown";
import { CategoriesNavDropdown } from "@/components/categories-nav-dropdown";
import { IndustriesNavDropdown } from "@/components/industries-nav-dropdown";
import { StockNavDropdown } from "@/components/stock-nav-dropdown";
import { getQuoteCartCount, QUOTE_CART_UPDATED_EVENT } from "@/lib/quote-cart";
import { Input } from "@/components/ui/input";

const THEME_KEY = "theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light" as const;
  }
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  return systemPrefersDark ? "dark" : "light";
};

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
};

function NavLink({
  href,
  children,
  className,
  onClick,
  isActive = false,
}: NavLinkProps) {
  const linkClassName = isActive
    ? "text-primary-foreground font-semibold"
    : "text-primary-foreground/80 hover:text-primary-foreground transition-colors";
  const combinedClassName = className
    ? `${linkClassName} ${className}`
    : linkClassName;

  return (
    <Link href={href} className={combinedClassName} onClick={onClick}>
      <motion.span
        className="relative inline-flex flex-col items-center"
        whileHover="hover"
        initial="rest"
        animate={isActive ? "active" : "rest"}
      >
        <span>{children}</span>
        <motion.span
          className="absolute -bottom-1 h-0.5 w-full origin-center rounded-full bg-white"
          variants={{
            rest: { scaleX: 0, opacity: 0 },
            hover: { scaleX: 1, opacity: 1 },
            active: { scaleX: 1, opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.span>
    </Link>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    stockProducts: Array<{
      id: string;
      title: string;
      brand: string;
      category: string;
      image: string;
      href: string;
    }>;
    stockCategories: Array<{ title: string; image: string; href: string }>;
    stockSubcategories: Array<{
      title: string;
      category: string;
      image: string;
      href: string;
    }>;
    external: Array<{ title: string; brand: string; pageUrl: string }>;
    totals: {
      stockProducts: number;
      stockCategories: number;
      stockSubcategories: number;
      external: number;
    };
  }>({
    stockProducts: [],
    stockCategories: [],
    stockSubcategories: [],
    external: [],
    totals: {
      stockProducts: 0,
      stockCategories: 0,
      stockSubcategories: 0,
      external: 0,
    },
  });
  const searchPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const syncCartCount = () => {
      setCartCount(getQuoteCartCount());
    };

    syncCartCount();
    window.addEventListener(QUOTE_CART_UPDATED_EVENT, syncCartCount);
    window.addEventListener("storage", syncCartCount);
    return () => {
      window.removeEventListener(QUOTE_CART_UPDATED_EVENT, syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults({
        stockProducts: [],
        stockCategories: [],
        stockSubcategories: [],
        external: [],
        totals: {
          stockProducts: 0,
          stockCategories: 0,
          stockSubcategories: 0,
          external: 0,
        },
      });
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=5`,
          { cache: "no-store", signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("Failed to search.");
        }
        const data = (await response.json()) as {
          stockProducts?: Array<{
            id: string;
            title: string;
            brand: string;
            category: string;
            image: string;
            href: string;
          }>;
          stockCategories?: Array<{
            title: string;
            image: string;
            href: string;
          }>;
          stockSubcategories?: Array<{
            title: string;
            category: string;
            image: string;
            href: string;
          }>;
          external?: Array<{ title: string; brand: string; pageUrl: string }>;
          totals?: {
            stockProducts: number;
            stockCategories: number;
            stockSubcategories: number;
            external: number;
          };
        };
        setSearchResults({
          stockProducts: data.stockProducts ?? [],
          stockCategories: data.stockCategories ?? [],
          stockSubcategories: data.stockSubcategories ?? [],
          external: data.external ?? [],
          totals: {
            stockProducts:
              data.totals?.stockProducts ?? data.stockProducts?.length ?? 0,
            stockCategories:
              data.totals?.stockCategories ?? data.stockCategories?.length ?? 0,
            stockSubcategories:
              data.totals?.stockSubcategories ??
              data.stockSubcategories?.length ??
              0,
            external: data.totals?.external ?? data.external?.length ?? 0,
          },
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setSearchResults({
          stockProducts: [],
          stockCategories: [],
          stockSubcategories: [],
          external: [],
          totals: {
            stockProducts: 0,
            stockCategories: 0,
            stockSubcategories: 0,
            external: 0,
          },
        });
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [isSearchOpen, searchQuery]);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const isToggle = (target as Element).closest?.(
        '[data-search-toggle="true"]',
      );
      if (isToggle) return;

      if (searchPanelRef.current?.contains(target)) return;
      setIsSearchOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isSearchOpen]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const isActiveLink = (href: string) => {
    if (!href || href === "#") return false;
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* FIXED CONTAINER */}
      <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-lg">
        {/* NAVBAR VISUAL WRAPPER */}
        <div className="relative z-20 h-20 w-full overflow-hidden bg-white">
          <nav className="mx-auto flex h-full w-full max-w-7xl items-stretch">
            {/* LEFT SIDE: Logo Area */}
            {/* z-10 ensures logo stays above the background shadow */}
            <div className="relative z-10 flex shrink-0 items-center px-4 lg:pl-8">
              <Link href="/" aria-label="Prime Elec home">
                <Image
                  src="/images/logo/logo-original.svg"
                  alt="Prime Elec"
                  width={240}
                  height={80}
                  className="h-16 w-auto object-contain md:h-20"
                  priority
                />
              </Link>
            </div>

            {/* RIGHT SIDE: Navigation Area */}
            <div className="relative ml-2 flex flex-1 items-center justify-end md:ml-12">
              {/* --- UPDATED BACKGROUND LAYER --- */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Curve Shape:
                    - Removed borders
                    - Adjusted shadow to cast heavily to the LEFT (-15px x-offset)
                 */}
                <div
                  className="absolute inset-y-0 left-0 right-0 
                      rounded-tl-[60px] md:rounded-tl-[80px] 
                      bg-primary 
                      shadow-[-15px_0_30px_-5px_rgba(0,0,0,0.25)]"
                />

                {/* Extension to right screen edge */}
                <div className="absolute left-full top-0 h-full w-screen bg-primary" />
              </div>
              {/* -------------------------------- */}

              {/* CONTENT LAYER */}
              <div className="relative z-10 flex h-full w-full items-center justify-between pl-8 pr-2 lg:pl-12 lg:pr-8">
                {/* Desktop Links */}
                <div className="hidden flex-1 items-center justify-center gap-6 lg:gap-8 md:flex">
                  <NavLink href="/" isActive={isActiveLink("/")}>
                    Home
                  </NavLink>
                  <NavLink href="/about" isActive={isActiveLink("/about")}>
                    About Us
                  </NavLink>
                  <StockNavDropdown
                    renderTrigger={(children) => (
                      <NavLink href="/stock" isActive={isActiveLink("/stock")}>
                        {children}
                      </NavLink>
                    )}
                  />
                  <CategoriesNavDropdown
                    renderTrigger={(children) => (
                      <NavLink
                        href="/categories"
                        isActive={isActiveLink("/categories")}
                      >
                        {children}
                      </NavLink>
                    )}
                  />
                  <BrandsNavDropdown
                    renderTrigger={(children) => (
                      <NavLink
                        href="/brands"
                        isActive={isActiveLink("/brands")}
                      >
                        {children}
                      </NavLink>
                    )}
                  />
                  <IndustriesNavDropdown
                    renderTrigger={(children) => (
                      <NavLink
                        href="/industries"
                        isActive={isActiveLink("/industries")}
                      >
                        {children}
                      </NavLink>
                    )}
                  />
                </div>

                {/* Desktop Actions (Hidden on Mobile) */}
                <div className="hidden items-center gap-3 md:flex lg:gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    aria-label="Search"
                    data-search-toggle="true"
                    onClick={() => setIsSearchOpen((open) => !open)}
                  >
                    <Search className="size-5" />
                  </Button>
                  <Link href="/cart" aria-label="Cart">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    >
                      <ShoppingCart className="size-5" />
                      {cartCount > 0 ? (
                        <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-primary">
                          {cartCount > 99 ? "99+" : cartCount}
                        </span>
                      ) : null}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    aria-label="Toggle theme"
                    onClick={toggleTheme}
                  >
                    <Sun className="size-5 hidden dark:block" />
                    <Moon className="size-5 dark:hidden" />
                  </Button>

                  <Button
                    className="ml-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-primary hover:bg-gray-100 shadow-sm"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    Upload BOQ
                  </Button>
                </div>

                {/* Mobile Actions (Visible ONLY on Mobile) */}
                <div className="flex w-full items-center justify-end gap-1 md:hidden">
                  {/* Mobile Search */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    aria-label="Search"
                    data-search-toggle="true"
                    onClick={() => setIsSearchOpen((open) => !open)}
                  >
                    <Search className="size-5" />
                  </Button>

                  {/* Mobile Cart */}
                  <Link href="/cart" aria-label="Cart">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    >
                      <ShoppingCart className="size-5" />
                      {cartCount > 0 ? (
                        <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-primary">
                          {cartCount > 99 ? "99+" : cartCount}
                        </span>
                      ) : null}
                    </Button>
                  </Link>

                  {/* Mobile Menu Burger */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    onClick={() =>
                      setIsMenuOpen((open) => {
                        const next = !open;
                        if (next) setIsSearchOpen(false);
                        return next;
                      })
                    }
                  >
                    {isMenuOpen ? (
                      <X className="size-6" />
                    ) : (
                      <Menu className="size-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isSearchOpen ? (
            <motion.div
              ref={searchPanelRef}
              className="absolute left-0 top-20 z-0 w-full border-t border-border/60 bg-background py-4 shadow-xl"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-6">
                <Input
                  placeholder="Search products, categories, brands..."
                  className="h-10"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitSearch();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Close search"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="mx-auto mt-3 w-full max-w-7xl px-6">
                {searchQuery.trim().length < 2 ? (
                  <p className="text-xs text-muted-foreground">
                    Type at least 2 characters to search.
                  </p>
                ) : searchLoading ? (
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <span>Searching</span>
                    <span
                      className="inline-flex items-end gap-1"
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                    </span>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-border/60 bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        In Stock Products
                      </p>
                      <div className="mt-2 space-y-2">
                        {searchResults.stockProducts.length ? (
                          searchResults.stockProducts.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              className="flex items-center gap-2 text-sm hover:text-primary"
                            >
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-md object-cover"
                              />
                              <span>
                                <span className="block font-medium">
                                  {item.title}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {item.brand} • {item.category}
                                </span>
                              </span>
                            </Link>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No matches.
                          </p>
                        )}
                        {searchResults.totals.stockProducts >
                        searchResults.stockProducts.length ? (
                          <Link
                            href={`/search/stock?q=${encodeURIComponent(searchQuery.trim())}`}
                            className="mt-3 inline-flex items-center rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary hover:border-primary hover:bg-primary/10"
                            onClick={() => setIsSearchOpen(false)}
                          >
                            View More
                          </Link>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Stock Categories
                      </p>
                      <div className="mt-2 space-y-2">
                        {searchResults.stockCategories.length ? (
                          searchResults.stockCategories.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-2 text-sm hover:text-primary"
                            >
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-md object-cover"
                              />
                              <span>{item.title}</span>
                            </Link>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No matches.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        Stock Subcategories
                      </p>
                      <div className="mt-2 space-y-2">
                        {searchResults.stockSubcategories.length ? (
                          searchResults.stockSubcategories.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-2 text-sm hover:text-primary"
                            >
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-md object-cover"
                              />
                              <span>
                                <span className="block font-medium">
                                  {item.title}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {item.category}
                                </span>
                              </span>
                            </Link>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No matches.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        External Catalog
                      </p>
                      <div className="mt-2 space-y-2">
                        {searchResults.external.length ? (
                          searchResults.external.map((item, index) => (
                            <a
                              key={`${item.pageUrl}-${index}`}
                              href={item.pageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm hover:text-primary"
                            >
                              <span className="font-medium">{item.title}</span>
                              <span className="block text-xs text-muted-foreground">
                                {item.brand}
                              </span>
                            </a>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No matches.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              className="absolute left-0 top-20 z-10 w-full overflow-hidden border-t border-white/20 bg-primary text-primary-foreground shadow-xl md:hidden will-change-transform"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="flex flex-col p-6 space-y-4">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="text-lg font-medium hover:text-white/80"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="text-lg font-medium hover:text-white/80"
                >
                  About Us
                </Link>
                <Link
                  href="/stock"
                  onClick={closeMenu}
                  className="text-lg font-medium hover:text-white/80"
                >
                  Stock
                </Link>
                <Link
                  href="/categories"
                  onClick={closeMenu}
                  className="text-lg font-medium hover:text-white/80"
                >
                  Categories
                </Link>
                <Link
                  href="/brands"
                  onClick={closeMenu}
                  className="text-lg font-medium hover:text-white/80"
                >
                  Brands
                </Link>
                <Link
                  href="/industries"
                  onClick={closeMenu}
                  className="text-lg font-medium hover:text-white/80"
                >
                  Industries
                </Link>

                <div className="my-4 h-px w-full bg-white/20" />

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div
                      onClick={toggleTheme}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-sm font-medium">Theme</span>
                      <Sun className="size-5 hidden dark:block" />
                      <Moon className="size-5 dark:hidden" />
                    </div>
                  </div>
                  <Button
                    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary"
                    onClick={() => {
                      setIsUploadOpen(true);
                      closeMenu();
                    }}
                  >
                    Upload BOQ
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="h-20" />

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="left-4 right-4 w-auto max-w-none translate-x-0 p-0 sm:left-[50%] sm:right-auto sm:w-full sm:max-w-3xl sm:translate-x-[-50%]">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Upload BOQ</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto px-6 pb-6">
            <FileUpload03 className="px-0 pb-0" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
