"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Menu, Moon, Search, ShoppingCart, Sun, X } from "lucide-react";
import Link from "next/link";

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

export function SiteNav() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <div className="w-full">
      <nav className="relative flex items-center justify-between rounded-full border border-border bg-background/70 px-6 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link className="text-foreground" href="/">
            Home
          </Link>
          <Link className="hover:text-foreground" href="#">
            Stock
          </Link>
          <Link className="hover:text-foreground" href="/brands">
            Brands
          </Link>
          <Link className="hover:text-foreground" href="#">
            Industries
          </Link>
          <Link className="hover:text-foreground" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-foreground" href="/contact">
            Contact
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            aria-label="Cart"
          >
            <ShoppingCart className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )
            ) : (
              <span className="size-4" />
            )}
          </Button>
          <Button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Upload BOQ
          </Button>
        </div>

        <div className="flex w-full items-center justify-between md:hidden">
          <div className="flex items-center">
            <Image
              src="/images/logo/prime-elec-logo.png"
              alt="Prime Elec"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              aria-label="Search"
            >
              <Search className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingCart className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )
              ) : (
                <span className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      <div
        className={`mt-3 overflow-hidden rounded-2xl border border-border bg-background/80 text-sm text-muted-foreground shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur transition-all duration-200 md:hidden ${
          isMenuOpen
            ? "max-h-96 translate-y-0 opacity-100"
            : "max-h-0 -translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4">
          <div className="grid gap-2">
            <Link className="text-foreground" href="/">
              Home
            </Link>
            <Link className="hover:text-foreground" href="#">
              Stock
            </Link>
            <Link className="hover:text-foreground" href="/brands">
              Brands
            </Link>
            <Link className="hover:text-foreground" href="#">
              Industries
            </Link>
            <Link className="hover:text-foreground" href="/projects">
              Projects
            </Link>
            <Link className="hover:text-foreground" href="/contact">
              Contact
            </Link>
          </div>
          <div className="mt-4 flex items-center">
            <Button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Upload BOQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
