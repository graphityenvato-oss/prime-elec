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
import { BrandsNavDropdown } from "@/components/brands-nav-dropdown";
import { CategoriesNavDropdown } from "@/components/categories-nav-dropdown";

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

  return (
    <Link href={href} className={linkClassName} onClick={onClick}>
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
                 <div className="absolute inset-y-0 left-0 right-0 
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
                  <NavLink href="/" isActive={isActiveLink("/")}>Home</NavLink>
                  <NavLink href="/about" isActive={isActiveLink("/about")}>About Us</NavLink>
                  <NavLink href="/stock" isActive={isActiveLink("/stock")}>Stock</NavLink>
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
                  <NavLink href="#" isActive={false}>Industries</NavLink>
                </div>

                {/* Desktop Actions (Hidden on Mobile) */}
                <div className="hidden items-center gap-3 md:flex lg:gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    aria-label="Search"
                  >
                    <Search className="size-5" />
                  </Button>
                  <Link href="/cart" aria-label="Cart">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    >
                      <ShoppingCart className="size-5" />
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
                  >
                    <Search className="size-5" />
                  </Button>

                  {/* Mobile Cart */}
                  <Link href="/cart" aria-label="Cart">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    >
                      <ShoppingCart className="size-5" />
                    </Button>
                  </Link>

                  {/* Mobile Menu Burger */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setIsMenuOpen((open) => !open)}
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
          {isMenuOpen ? (
            <motion.div
              className="absolute left-0 top-20 z-10 w-full overflow-hidden border-t border-white/20 bg-primary text-primary-foreground shadow-xl md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex flex-col p-6 space-y-4">
                <Link href="/" onClick={closeMenu} className="text-lg font-medium hover:text-white/80">Home</Link>
                <Link href="/about" onClick={closeMenu} className="text-lg font-medium hover:text-white/80">About Us</Link>
                <Link href="/stock" onClick={closeMenu} className="text-lg font-medium hover:text-white/80">Stock</Link>
                <Link href="/categories" onClick={closeMenu} className="text-lg font-medium hover:text-white/80">Categories</Link>
                <Link href="/brands" onClick={closeMenu} className="text-lg font-medium hover:text-white/80">Brands</Link>
                
                <div className="my-4 h-px w-full bg-white/20" />
                
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <div onClick={toggleTheme} className="flex items-center gap-2 cursor-pointer">
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
