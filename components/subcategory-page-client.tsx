"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { HoverCard } from "@/components/hover-card";
import { Reveal } from "@/components/reveal";
import { SearchInput } from "@/components/search-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addExternalItemToQuoteCart } from "@/lib/quote-cart";

type SubcategoryItem = {
  title: string;
  image?: string | null;
  pageUrl?: string | null;
};

type SubcategoryPageClientProps = {
  items: SubcategoryItem[];
};

export function SubcategoryPageClient({ items }: SubcategoryPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quoteValue, setQuoteValue] = useState("");
  const [quoteItems, setQuoteItems] = useState<string[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null,
  );
  const [promptOnReturn, setPromptOnReturn] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(normalized),
    );
  }, [items, query]);
  const hasQuery = query.trim().length > 0;

  const parseEntries = (value: string) =>
    value
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean);

  const handleExternalOpen = (title: string) => {
    setActiveSubcategory(title);
    setPromptOnReturn(true);
  };

  useEffect(() => {
    if (!promptOnReturn) return;

    const handleFocus = () => {
      setIsDialogOpen(true);
      setPromptOnReturn(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      setIsDialogOpen(true);
      setPromptOnReturn(false);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [promptOnReturn]);

  const handleAddQuoteItem = () => {
    const entries = parseEntries(quoteValue);
    if (!entries.length) return;
    setQuoteItems((itemsList) => [...itemsList, ...entries]);
    setQuoteValue("");
  };

  const handleRemoveQuoteItem = (index: number) => {
    setQuoteItems((itemsList) => itemsList.filter((_, idx) => idx !== index));
  };

  const handleSubmitQuote = () => {
    const directEntries = parseEntries(quoteValue);
    const allEntries = [...quoteItems, ...directEntries];
    if (!allEntries.length) return;

    allEntries.forEach((entry) => addExternalItemToQuoteCart(entry));
    toast.success(
      allEntries.length === 1
        ? "Item added to quote cart."
        : `${allEntries.length} items added to quote cart.`,
    );

    setIsDialogOpen(false);
    setQuoteItems([]);
    setQuoteValue("");
    router.push("/cart");
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter") return;
    const input = event.currentTarget.querySelector("input");
    if (document.activeElement === input) {
      event.preventDefault();
      handleAddQuoteItem();
      return;
    }
    event.preventDefault();
    handleSubmitQuote();
  };

  return (
    <>
      <div className="mt-4 max-w-md">
        <SearchInput
          placeholder="Search subcategories"
          value={query}
          onValueChange={setQuery}
        />
      </div>

      {filtered.length ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <HoverCard
                className="h-55 p-4 text-foreground dark:text-white sm:h-50 sm:p-6"
                contentClassName="flex h-full flex-col justify-between"
              >
                <div className="h-14 w-32 sm:h-16 sm:w-36">
                  <Image
                    src={item.image ?? "/images/placeholder/imageholder.webp"}
                    alt={`${item.title} product`}
                    width={180}
                    height={120}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div>
                  {item.pageUrl ? (
                    <Link
                      href={item.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleExternalOpen(item.title)}
                      className="text-lg font-semibold text-foreground transition-colors hover:text-primary dark:text-white"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                  )}
                </div>
                {item.pageUrl ? (
                  <Link
                    href={item.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalOpen(item.title)}
                    className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10"
                  >
                    View Products
                  </Link>
                ) : null}
              </HoverCard>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {hasQuery
            ? `No subcategories match "${query.trim()}".`
            : "No subcategories available for this brand and category yet."}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onKeyDown={handleDialogKeyDown}>
          <DialogHeader>
            <DialogTitle>Did you find what you needed?</DialogTitle>
            <DialogDescription>
              Paste the {activeSubcategory ?? "subcategory"} link or Part Number
              here to get your price.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Paste link or part number (comma/new line supported)"
            value={quoteValue}
            onChange={(event) => setQuoteValue(event.target.value)}
          />
          {quoteItems.length > 0 ? (
            <div className="rounded-md border border-border/60 p-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Items to add
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
                      aria-label="Remove item"
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
