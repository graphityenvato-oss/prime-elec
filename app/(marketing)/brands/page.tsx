"use client";
import { useState } from "react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    name: "Degson",
    logo: "/images/partners/degson-logo.png",
    href: "https://www.degson.com/?lang=en",
  },
  {
    name: "Deltabox",
    logo: "/images/partners/Deltabox.png",
    href: "https://www.delta-box.com/en/",
  },
  {
    name: "Eaton",
    logo: "/images/partners/Eaton-logo.png",
    href: "https://www.eaton.com/ae/en-gb.html",
  },
  {
    name: "FEC Heliports equipment",
    logo: "/images/partners/FEC Heliports equipment.png",
    href: "https://www.heliportsequipment.com/",
  },
  {
    name: "Indelec",
    logo: "/images/partners/Indelec-logo.png",
    href: "https://indelec.com/",
  },
  {
    name: "Relpol",
    logo: "/images/partners/Logo-Relpol.png",
    href: "https://www.relpol.pl/en",
  },
  {
    name: "OBO",
    logo: "/images/partners/obo-logo.png",
    href: "https://www.obo.global/",
    secondaryHref: "https://www.oboindia.com/en-in",
    secondaryLabel: "OBO India",
  },
  {
    name: "Solway",
    logo: "/images/partners/Solway.png",
    href: "https://www.ledsolway.com/",
  },
  {
    name: "Teknoware",
    logo: "/images/partners/teknoware-logo.png",
    href: "https://www.teknoware.com/",
  },
  { name: "Tem", logo: "/images/partners/Tem-logo.png", href: "https://www.tem-si.com/" },
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
      <section className="mt-12 rounded-[28px] border border-border/60 bg-muted/10 px-6 py-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Found a product?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Copy the URL or Part ID and paste it in your Quote List to get
              pricing fast.
            </p>
          </div>
          <Link href="/cart">
            <Button variant="outline" className="rounded-full px-6">
              Start Quote List
            </Button>
          </Link>
        </div>
      </section>
      <section className="mt-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, index) => (
            <GlowCard
              key={brand.name}
              className="h-55 p-6 text-foreground dark:text-white"
              contentClassName="h-full"
              hover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Reveal
                delay={index * 0.06}
                className="flex h-full flex-col justify-between"
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
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full border-primary/30 px-4 text-xs text-primary hover:border-primary hover:bg-primary/10 dark:border-white/30 dark:text-white dark:hover:border-white dark:hover:bg-white/10"
                    onClick={() => handleCatalogClick(brand.href, brand.name)}
                  >
                    Visit Official Website
                  </Button>
                  {brand.secondaryHref ? (
                    <Button
                      variant="outline"
                      className="rounded-full border-primary/30 px-4 text-xs text-primary hover:border-primary hover:bg-primary/10 dark:border-white/30 dark:text-white dark:hover:border-white dark:hover:bg-white/10"
                      onClick={() =>
                        handleCatalogClick(brand.secondaryHref, brand.name)
                      }
                    >
                      {brand.secondaryLabel ?? "Visit Website"}
                    </Button>
                  ) : null}
                </div>
              </Reveal>
            </GlowCard>
          ))}
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
