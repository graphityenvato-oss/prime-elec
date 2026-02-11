"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const brands = [
  {
    key: "degson",
    name: "Degson",
    logo: "/images/partners/degson-logo.png",
    href: "https://www.degson.com/?lang=en",
  },
  {
    key: "deltabox",
    name: "Deltabox",
    logo: "/images/partners/Deltabox.png",
    href: "https://www.delta-box.com/en/",
  },
  {
    key: "eaton",
    name: "Eaton",
    logo: "/images/partners/Eaton-logo.png",
    href: "https://www.eaton.com/ae/en-gb.html",
  },
  {
    key: "fec",
    name: "FEC Heliports equipment",
    logo: "/images/partners/FEC-Heliports-Equipment-logo.png",
    href: "https://www.heliportsequipment.com/",
  },
  {
    key: "indelec",
    name: "Indelec",
    logo: "/images/partners/Indelec-logo.png",
    href: "https://indelec.com/",
  },
  {
    key: "relpol",
    name: "Relpol",
    logo: "/images/partners/Logo-Relpol.png",
    href: "https://www.relpol.pl/en",
  },
  {
    key: "obo",
    name: "OBO",
    logo: "/images/partners/obo-logo.png",
    href: "https://www.obo.global/",
  },
  {
    key: "solway",
    name: "Solway",
    logo: "/images/partners/Solway.png",
    href: "https://www.ledsolway.com/",
  },
  {
    key: "teknoware",
    name: "Teknoware",
    logo: "/images/partners/teknoware-logo.png",
    href: "https://www.teknoware.com/",
  },
  {
    key: "tem",
    name: "Tem",
    logo: "/images/partners/Tem-logo.png",
    href: "https://www.tem-si.com/",
  },
];

type BrandsNavDropdownProps = {
  renderTrigger: (children: React.ReactNode) => React.ReactNode;
};

export function BrandsNavDropdown({ renderTrigger }: BrandsNavDropdownProps) {
  const pathname = usePathname();
  const isBrandsPage = pathname?.startsWith("/brands");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const openMenu = () => {
    if (isBrandsPage) return;
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
    }, 120);
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        if (isBrandsPage) return;
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
              <span className="inline-flex items-center">Brands</span>,
            )}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={14}
          className="w-[520px] rounded-2xl border border-border/60 bg-white p-5 text-foreground shadow-[0_24px_70px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-[#0b1118] dark:text-white"
          onMouseEnter={openMenu}
          onMouseMove={openMenu}
          onMouseLeave={scheduleClose}
          onPointerEnter={openMenu}
          onPointerLeave={scheduleClose}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Brands
              </p>
              <p className="text-sm font-semibold">Browse trusted partners</p>
            </div>
            <Link
              href="/brands"
              className="text-xs font-semibold text-primary hover:text-primary/80"
              onClick={() => setOpen(false)}
            >
              All Brands
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.key}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-muted/10 p-3 transition hover:border-primary/40 hover:bg-primary/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/30 dark:hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                <div className="h-12 w-24">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={96}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-center text-xs font-medium leading-snug text-foreground transition-colors group-hover:text-primary dark:text-white/90 dark:group-hover:text-white">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
