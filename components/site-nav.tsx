"use client";

import { useEffect, useState } from "react";

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
import { usePathname } from "next/navigation";

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
    ? "text-primary-foreground"
    : className ?? "";

  return (
    <Link href={href} className={linkClassName} onClick={onClick}>
      <motion.span
        className="relative inline-flex"
        whileHover="hover"
        initial="rest"
        animate={isActive ? "active" : "rest"}
      >
        <span>{children}</span>
        <motion.span
          className="absolute left-0 -bottom-1 h-0.5 w-full origin-center rounded-full bg-current"
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
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

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

  return (
    <div className="w-full">
      <div className="fixed inset-x-0 top-0 z-50">
        <nav className="border border-primary bg-primary text-primary-foreground shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
          <div className="mx-auto flex h-18 w-full max-w-7xl items-center px-6">
            <div className="hidden w-72 items-center md:flex">
              <Link href="/" aria-label="Prime Elec home">
                <Image
                  src="/images/logo/logo-original.svg"
                  alt="Prime Elec"
                  width={200}
                  height={80}
                  className="h-16 w-64 object-contain brightness-0 invert"
                  priority
                />
              </Link>
            </div>

            <div className="hidden flex-1 items-center justify-center gap-6 text-md md:flex">
              <NavLink
                className="text-primary-foreground/80 hover:text-primary-foreground"
                href="/"
                isActive={isActiveLink("/")}
              >
                Home
              </NavLink>
              <NavLink
                className="text-primary-foreground/80 hover:text-primary-foreground"
                href="/about"
                isActive={isActiveLink("/about")}
              >
                About Us
              </NavLink>
              <NavLink
                className="text-primary-foreground/80 hover:text-primary-foreground"
                href="/stock"
                isActive={isActiveLink("/stock")}
              >
                Stock
              </NavLink>
              <NavLink
                className="text-primary-foreground/80 hover:text-primary-foreground"
                href="/categories"
                isActive={isActiveLink("/categories")}
              >
                Categories
              </NavLink>
              <NavLink
                className="text-primary-foreground/80 hover:text-primary-foreground"
                href="/brands"
                isActive={isActiveLink("/brands")}
              >
                Brands
              </NavLink>
              <NavLink
                className="text-primary-foreground/80 hover:text-primary-foreground"
                href="#"
              >
                Industries
              </NavLink>
            </div>

            <div className="hidden min-w-60items-center justify-end gap-2 md:flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                aria-label="Search"
              >
                <Search className="size-4" />
              </Button>
              <Link href="/cart" aria-label="Cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <ShoppingCart className="size-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              >
                <Sun className="size-4 hidden dark:block" />
                <Moon className="size-4 dark:hidden" />
              </Button>
              <Button
                className="rounded-full bg-primary-foreground px-5 py-2 text-sm font-semibold text-primary hover:bg-primary-foreground/90"
                onClick={() => setIsUploadOpen(true)}
              >
                Upload BOQ
              </Button>
            </div>

            <div className="flex w-full items-center justify-between md:hidden">
              <div className="flex items-center">
                <Link href="/" aria-label="Prime Elec home" onClick={closeMenu}>
                  <Image
                    src="/images/logo/logo-original.svg"
                    alt="Prime Elec"
                    width={160}
                    height={40}
                    className="h-10 w-44 object-contain brightness-0 invert"
                    priority
                  />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  aria-label="Search"
                >
                  <Search className="size-4" />
                </Button>
                <Link href="/cart" aria-label="Cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <ShoppingCart className="size-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                >
                  <Sun className="size-4 hidden dark:block" />
                  <Moon className="size-4 dark:hidden" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
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
          </div>
        </nav>
        <div className="h-px w-full bg-white/60" />

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              className="mx-3 mt-3 origin-top overflow-hidden rounded-2xl border border-primary bg-primary text-sm text-primary-foreground shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:mx-6 md:hidden"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="p-4">
                <div className="grid gap-2">
                  <NavLink
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                    href="/"
                    onClick={closeMenu}
                    isActive={isActiveLink("/")}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                    href="/about"
                    onClick={closeMenu}
                    isActive={isActiveLink("/about")}
                  >
                    About Us
                  </NavLink>
                  <NavLink
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                    href="/stock"
                    onClick={closeMenu}
                    isActive={isActiveLink("/stock")}
                  >
                    Stock
                  </NavLink>
                  <NavLink
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                    href="/categories"
                    onClick={closeMenu}
                    isActive={isActiveLink("/categories")}
                  >
                    Categories
                  </NavLink>
                  <NavLink
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                    href="/brands"
                    onClick={closeMenu}
                    isActive={isActiveLink("/brands")}
                  >
                    Brands
                  </NavLink>
                  <NavLink
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                    href="#"
                    onClick={closeMenu}
                  >
                    Industries
                  </NavLink>
                </div>
                <div className="mt-4 flex items-center">
                  <Button
                    className="rounded-full bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-foreground/90"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    Upload BOQ
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="h-17" />

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
