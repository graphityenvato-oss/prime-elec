"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addStockProductToQuoteCart } from "@/lib/quote-cart";

type AddToQuoteButtonProps = {
  product: {
    id: string;
    name: string;
    partNumber: string;
    codeNo?: string;
    image: string;
    brand?: string;
    category?: string;
  };
  className?: string;
  variant?: "default" | "outline" | "ghost";
  label?: string;
};

export function AddToQuoteButton({
  product,
  className,
  variant = "default",
  label = "Add to Quote",
}: AddToQuoteButtonProps) {
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        addStockProductToQuoteCart(product);
        toast.success(`Added "${product.name}" to quote list.`);
      }}
    >
      {label}
    </Button>
  );
}
