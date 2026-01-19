"use client";
import { useState } from "react";

import { motion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { primeCardClassName } from "@/components/ui/prime-card";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Image from "next/image";

const brands = [
  { name: "Degson", logo: "/images/partners/degson-logo.png", href: "#" },
  { name: "Eaton", logo: "/images/partners/Eaton-logo.png", href: "#" },
  { name: "Indelec", logo: "/images/partners/Indelec-logo.png", href: "#" },
  { name: "Relpol", logo: "/images/partners/Logo-Relpol.png", href: "#" },
  { name: "OBO", logo: "/images/partners/obo-logo.png", href: "#" },
  { name: "Teknoware", logo: "/images/partners/teknoware-logo.png", href: "#" },
  { name: "Tem", logo: "/images/partners/Tem-logo.png", href: "#" },
];

export default function BrandsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quoteValue, setQuoteValue] = useState("");
  const [quoteItems, setQuoteItems] = useState<string[]>([]);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const handleCatalogClick = (href: string, brandName: string) => {
    if (href && href !== "#") {
      window.open(href, "_blank", "noopener,noreferrer");
    }
    setActiveBrand(brandName);
    setIsDialogOpen(true);
  };

  const handleAddQuoteItem = () => {
    const trimmed = quoteValue.trim();
    if (!trimmed) return;
    setQuoteItems((items) => [...items, trimmed]);
    setQuoteValue("");
  };

  const handleRemoveQuoteItem = (index: number) => {
    setQuoteItems((items) => items.filter((_, idx) => idx !== index));
  };

  const handleSubmitQuote = () => {
    if (quoteValue.trim()) {
      handleAddQuoteItem();
    }
    setIsDialogOpen(false);
    setQuoteItems([]);
    setQuoteValue("");
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter") return;
    const input = event.currentTarget.querySelector("input");
    if (document.activeElement === input) {
      event.preventDefault();
      handleAddQuoteItem();
    } else {
      event.preventDefault();
      handleSubmitQuote();
    }
  };

  return (
    <>
      <section className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Brands
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Trusted Brands. Fast Sourcing.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            PrimeElec works with certified global manufacturers to deliver
            project-ready electrical solutions. Browse official catalogs and
            request quotes with confidence.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="rounded-full bg-primary px-6">
              Request Quote
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 hover:bg-muted/30 hover:text-foreground"
            >
              How It Works
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="mt-12 rounded-[28px] border border-border/60 bg-muted/10 px-6 py-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Found a product?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Copy the URL or Part ID and paste it in your Quote List to get
              pricing fast.
            </p>
          </div>
          <Button variant="outline" className="rounded-full px-6">
            Start Quote List
          </Button>
        </div>
      </section>

      <section className="mt-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <motion.div
              key={brand.name}
              className={cn(
                primeCardClassName,
                "flex h-full flex-col justify-between p-6",
              )}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="flex h-24 items-center justify-center">
                <Image
                  width={200}
                  height={48}
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 w-auto"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold">{brand.name}</span>
                <Button
                  variant="outline"
                  className="rounded-full px-4 text-xs"
                  onClick={() => handleCatalogClick(brand.href, brand.name)}
                >
                  Visit Official Catalog
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[28px] border border-border/60 bg-linear-to-br from-muted/30 via-background to-background px-6 py-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Need project pricing or bulk sourcing?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team can consolidate multi-brand orders and deliver a single
              project-ready shipment.
            </p>
          </div>
          <Button className="rounded-full bg-primary px-6">
            Talk to Procurement
          </Button>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onKeyDown={handleDialogKeyDown}>
          <DialogHeader>
            <DialogTitle>Did you find what you needed?</DialogTitle>
            <DialogDescription>
              Paste the {activeBrand ?? "brand"} link or Part Number here to get
              your price.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Paste Link Here"
            value={quoteValue}
            onChange={(event) => setQuoteValue(event.target.value)}
          />
          {quoteItems.length > 0 ? (
            <div className="rounded-md border border-border/60 p-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Links to add
              </p>
              <div className="mt-2 space-y-2">
                {quoteItems.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/20 px-2 py-2 text-xs text-foreground"
                  >
                    <span className="truncate">{item}</span>
                    <button
                      type="button"
                      aria-label="Remove link"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveQuoteItem(index)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={handleAddQuoteItem}
            >
              Add Another
            </Button>
            <Button
              className="rounded-full bg-primary px-6"
              onClick={handleSubmitQuote}
            >
              Add to Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
