"use client";

export const QUOTE_CART_STORAGE_KEY = "quote_cart_v1";
export const QUOTE_CART_UPDATED_EVENT = "quote-cart-updated";

export type QuoteCartItem = {
  id: string;
  name: string;
  partNumber: string;
  codeNo?: string;
  image: string;
  quantity: number;
  source: "stock" | "external";
  brand?: string;
  category?: string;
};

export type AddStockQuoteItemInput = {
  id: string;
  name: string;
  partNumber: string;
  codeNo?: string;
  image: string;
  brand?: string;
  category?: string;
};

const canUseStorage = () => typeof window !== "undefined";

const safeParse = (value: string | null): QuoteCartItem[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const row = item as Partial<QuoteCartItem>;
        const source: QuoteCartItem["source"] =
          row.source === "external" ? "external" : "stock";
        return {
          id: String(row.id ?? ""),
          name: String(row.name ?? ""),
          partNumber: String(row.partNumber ?? ""),
          codeNo: row.codeNo ? String(row.codeNo) : undefined,
          image: String(row.image ?? "/images/placeholder/imageholder.webp"),
          quantity:
            typeof row.quantity === "number" && row.quantity > 0
              ? Math.floor(row.quantity)
              : 1,
          source,
          brand: row.brand ? String(row.brand) : undefined,
          category: row.category ? String(row.category) : undefined,
        };
      })
      .filter((item) => item.id && item.name && item.partNumber);
  } catch {
    return [];
  }
};

const emitCartUpdated = () => {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(QUOTE_CART_UPDATED_EVENT));
};

export const readQuoteCart = (): QuoteCartItem[] => {
  if (!canUseStorage()) return [];
  return safeParse(localStorage.getItem(QUOTE_CART_STORAGE_KEY));
};

export const writeQuoteCart = (items: QuoteCartItem[]) => {
  if (!canUseStorage()) return;
  localStorage.setItem(QUOTE_CART_STORAGE_KEY, JSON.stringify(items));
  emitCartUpdated();
};

export const getQuoteCartCount = () =>
  readQuoteCart().reduce((total, item) => total + item.quantity, 0);

export const addStockProductToQuoteCart = (input: AddStockQuoteItemInput) => {
  const current = readQuoteCart();
  const existing = current.find((item) => item.id === input.id);

  if (existing) {
    writeQuoteCart(
      current.map((item) =>
        item.id === input.id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
    return;
  }

  writeQuoteCart([
    ...current,
    {
      id: input.id,
      name: input.name,
      partNumber: input.partNumber,
      codeNo: input.codeNo,
      image: input.image,
      quantity: 1,
      source: "stock",
      brand: input.brand,
      category: input.category,
    },
  ]);
};

export const addExternalItemToQuoteCart = (partNumberOrUrl: string) => {
  const normalized = partNumberOrUrl.trim();
  if (!normalized) return;

  const id = `external:${normalized.toLowerCase()}`;
  const current = readQuoteCart();
  const existing = current.find((item) => item.id === id);

  if (existing) {
    writeQuoteCart(
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
    return;
  }

  writeQuoteCart([
    ...current,
    {
      id,
      name: "External Request",
      partNumber: normalized,
      image: "/images/placeholder/imageholder.webp",
      quantity: 1,
      source: "external",
    },
  ]);
};

export const updateQuoteCartItemQuantity = (id: string, quantity: number) => {
  const nextQty = Math.max(1, Math.floor(quantity));
  writeQuoteCart(
    readQuoteCart().map((item) =>
      item.id === id ? { ...item, quantity: nextQty } : item,
    ),
  );
};

export const removeQuoteCartItem = (id: string) => {
  writeQuoteCart(readQuoteCart().filter((item) => item.id !== id));
};

export const clearQuoteCart = () => {
  writeQuoteCart([]);
};
