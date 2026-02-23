"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  QUOTE_CART_UPDATED_EVENT,
  addExternalItemToQuoteCart,
  readQuoteCart,
  removeQuoteCartItem,
  type QuoteCartItem,
  updateQuoteCartItemQuantity,
  clearQuoteCart,
} from "@/lib/quote-cart";

export default function CartPage() {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [externalInput, setExternalInput] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectNotes, setProjectNotes] = useState("");
  const [needsConsultation, setNeedsConsultation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [honeypotWebsite, setHoneypotWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    const sync = () => {
      setItems(readQuoteCart());
    };

    sync();
    window.addEventListener(QUOTE_CART_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(QUOTE_CART_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const item = items.find((row) => row.id === id);
    if (!item) return;
    updateQuoteCartItemQuantity(id, item.quantity + delta);
  };

  const removeItem = (id: string) => {
    removeQuoteCartItem(id);
  };

  const addExternalItem = () => {
    const trimmed = externalInput.trim();
    if (!trimmed) {
      return;
    }
    addExternalItemToQuoteCart(trimmed);
    setExternalInput("");
  };

  const handleSubmitQuote = async () => {
    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    if (!email.trim()) {
      toast.error("Email address is required.");
      return;
    }
    if (!items.length) {
      toast.error("Your quote list is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          company: companyName.trim() || null,
          email: email.trim(),
          phone: phone.trim() || null,
          projectNotes: projectNotes.trim() || null,
          needsConsultation,
          website: honeypotWebsite.trim(),
          startedAt: formStartedAt,
          cartItems: items.map((item) => ({
            id: item.id,
            name: item.name,
            partNumber: item.partNumber,
            codeNo: item.codeNo,
            image: item.image,
            quantity: item.quantity,
            source: item.source,
            brand: item.brand,
            category: item.category,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quotation request.");
      }

      clearQuoteCart();
      setFullName("");
      setCompanyName("");
      setEmail("");
      setPhone("");
      setProjectNotes("");
      setNeedsConsultation(false);
      setHoneypotWebsite("");
      setFormStartedAt(Date.now());
      toast.success("Quotation request sent.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-10 sm:py-14">
      <Breadcrumb className="text-foreground/70">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        Request For <span className="text-primary">Quotation</span>
      </h1>

      <div className="mt-6 grid gap-6 lg:items-start lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <div className="w-full rounded-2xl border border-border/60 bg-background p-6 shadow-[0_18px_40px_rgba(12,28,60,0.08)]">
            <p className="text-sm text-muted-foreground">
              Paste URL or Part Number from External Catalog
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Paste link or part number"
                value={externalInput}
                onChange={(event) => setExternalInput(event.target.value)}
              />
              <Button
                className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                onClick={addExternalItem}
              >
                Add
              </Button>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-semibold">
              Current List ({items.length})
            </h2>
            <div className="mt-4 space-y-4">
              {items.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-5 text-sm text-muted-foreground">
                  Your cart is empty.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background p-5 shadow-[0_12px_30px_rgba(12,28,60,0.08)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="h-16 w-16 rounded-xl bg-muted/30 p-2">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-semibold">
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.source === "external"
                            ? "External Request | "
                            : "Stock | Order#"}
                          <span className="block break-all font-semibold text-foreground">
                            {item.partNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </Button>
                      <Input
                        className="h-9 w-16 text-center"
                        value={item.quantity}
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start h-fit rounded-2xl border border-border/60 bg-background p-6 shadow-[0_18px_40px_rgba(12,28,60,0.08)]">
          <h2 className="text-base font-semibold">Request details</h2>
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <label className="sr-only" htmlFor="company-website">
                Website
              </label>
              <Input
                id="company-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                value={honeypotWebsite}
                onChange={(event) => setHoneypotWebsite(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Full name
              </label>
              <Input
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Company name
              </label>
              <Input
                placeholder="Enter your company"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Email address
              </label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Phone number
              </label>
              <Input
                placeholder="+961 76 345 678"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Project location / notes
              </label>
              <Textarea
                rows={4}
                placeholder="City, project scope, or notes"
                value={projectNotes}
                onChange={(event) => setProjectNotes(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="consultation"
                checked={needsConsultation}
                onCheckedChange={(checked) =>
                  setNeedsConsultation(checked === true)
                }
              />
              <label
                htmlFor="consultation"
                className="text-xs text-muted-foreground"
              >
                I need a consultation for a full project map
              </label>
            </div>
          </div>
          <Button
            className="mt-5 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => void handleSubmitQuote()}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "REQUEST PRICE QUOTATION"}
          </Button>
        </aside>
      </div>
    </section>
  );
}
