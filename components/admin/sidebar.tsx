"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const groups = [
  {
    label: "Dashboard",
    defaultOpen: true,
    links: [{ label: "Overview", href: "/admin/dashboard" }],
  },
  {
    label: "Catalog",
    defaultOpen: true,
    links: [
      { label: "Brands", href: "/admin/brandspage" },
      { label: "Blog", href: "/admin/blog" },
      { label: "Projects", href: "/admin/projects" },
      { label: "Industries", href: "/admin/industries" },
      { label: "Products", href: "/admin/products" },
      { label: "Categories", href: "/admin/categories" },
    ],
  },
  {
    label: "Pages",
    defaultOpen: false,
    links: [
      { label: "Home Page", href: "/admin/homepage" },
      { label: "Stock Page", href: "/admin/stockpage" },
      { label: "Brands Page", href: "/admin/brandspage" },
      { label: "Industries Page", href: "/admin/industriespage" },
      { label: "Projects Page", href: "/admin/projectspage" },
      { label: "Contact Page", href: "/admin/contactpage" },
    ],
  },
  {
    label: "Layout",
    defaultOpen: false,
    links: [
      { label: "Header", href: "/admin/header" },
      { label: "Footer", href: "/admin/footer" },
    ],
  },
  {
    label: "Settings",
    defaultOpen: false,
    links: [
      { label: "Site Theme", href: "/admin/sitetheme" },
      { label: "Site Settings", href: "/admin/sitesettings" },
    ],
  },
];

export function AdminSidebar() {
  const [now, setNow] = useState<Date>(() => new Date());
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="flex w-full flex-col border-border/60 bg-linear-to-br from-background/80 via-background/60 to-muted/30 px-4 py-6 text-sm text-muted-foreground shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur lg:min-h-[calc(100vh-3rem)] lg:w-72 lg:rounded-2xl lg:border">
      <div className="flex items-center justify-between gap-3">
        <Image
          src="/images/logo/prime-elec-logo.png"
          alt="Prime Elec"
          width={140}
          height={36}
          className="h-8 w-auto"
          priority
        />
        <div className="text-right text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
          <div>{now.toLocaleDateString("en-GB")}</div>
          <div>
            {now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
      <nav className="mt-5 grid gap-4">
        {groups.map((group) => (
          <Collapsible
            key={group.label}
            defaultOpen={group.defaultOpen}
            className="space-y-2"
          >
            <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-200 hover:bg-muted/40 hover:text-foreground">
              {group.label}
              <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="grid gap-1 overflow-hidden pl-2 transition-all duration-300 data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-96 data-[state=open]:opacity-100">
              {group.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-muted/40 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </CollapsibleContent>
            <div className="h-px bg-border/60" />
          </Collapsible>
        ))}
      </nav>
      <div className="mt-auto border-t border-border/60 pt-4">
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted/40 hover:text-foreground"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            router.replace("/ns-admin");
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
