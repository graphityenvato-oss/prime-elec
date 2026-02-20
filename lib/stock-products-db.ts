import { supabaseServer } from "@/lib/supabase/server";
import type { Product } from "@/lib/products";

const PLACEHOLDER_IMAGE = "/images/placeholder/imageholder.webp";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
const STOCK_FOLDER = "stock";
const IMAGE_FILENAME_EXT = /\.(jpg|jpeg|png|webp|gif)$/i;

const buildSupabaseStockImageUrl = (value: string) => {
  if (!SUPABASE_URL) return null;
  const filename = value.replace(/\\/g, "/").split("/").pop()?.trim();
  if (!filename || !IMAGE_FILENAME_EXT.test(filename)) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(STORAGE_BUCKET)}/${encodeURIComponent(STOCK_FOLDER)}/${encodeURIComponent(filename)}`;
};

const normalizeImageUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("images/")) {
    return buildSupabaseStockImageUrl(trimmed) ?? `/${trimmed}`;
  }
  if (trimmed.startsWith("/images/")) {
    return buildSupabaseStockImageUrl(trimmed) ?? trimmed;
  }
  if (IMAGE_FILENAME_EXT.test(trimmed)) {
    return buildSupabaseStockImageUrl(trimmed) ?? PLACEHOLDER_IMAGE;
  }
  return PLACEHOLDER_IMAGE;
};

const detailsToSpecs = (
  details: unknown,
): { label: string; value: string }[] => {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return [];
  }
  return Object.entries(details as Record<string, unknown>)
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([label, value]) => ({
      label,
      value: String(value),
    }));
};

const mapRowToProduct = (row: {
  slug: string;
  title: string;
  code?: string;
  order_no: string;
  description: string;
  subcategory_image_url: string;
  brand: string;
  category: string;
  subcategory: string;
  details: unknown;
}): Product => {
  const image = normalizeImageUrl(row.subcategory_image_url);
  const specs = detailsToSpecs(row.details);
  return {
    id: row.slug,
    title: row.title,
    codeNo: row.code,
    partNumber: row.order_no,
    description: row.description,
    longDescription: row.description,
    image,
    images: [image],
    inStock: true,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory,
    specs,
  };
};

export type StockBrowseRow = {
  slug: string;
  title: string;
  order_no: string;
  description: string;
  brand: string;
  category: string;
  category_image_url: string;
  category_image_urls: string[] | null;
  subcategory: string;
  subcategory_image_url: string;
  details: unknown;
};

const normalizeSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const toStockSegment = (value: string) => normalizeSegment(value);

export const resolveRowImage = (value?: string | null) =>
  normalizeImageUrl(value);

export const getCategoryPreviewImage = (
  row: Pick<StockBrowseRow, "category_image_urls" | "category_image_url">,
) => {
  const first = row.category_image_urls?.find((image) => image?.trim());
  return resolveRowImage(first ?? row.category_image_url);
};

export const mapRowsToProducts = (rows: StockBrowseRow[]): Product[] =>
  rows.map((row) => mapRowToProduct(row));

export const getStockProductsDb = async (): Promise<Product[]> => {
  const { data, error } = await supabaseServer
    .from("stock_products")
    .select(
      "slug,title,code,order_no,description,subcategory_image_url,brand,category,subcategory,details",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []).map(mapRowToProduct);
};

export const getStockBrowseRowsDb = async (): Promise<StockBrowseRow[]> => {
  const { data, error } = await supabaseServer
    .from("stock_products")
    .select(
      "slug,title,order_no,description,brand,category,category_image_url,category_image_urls,subcategory,subcategory_image_url,details",
    )
    .order("category", { ascending: true })
    .order("subcategory", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as StockBrowseRow[];
};

export const getStockProductByIdDb = async (
  id: string,
): Promise<Product | null> => {
  const { data, error } = await supabaseServer
    .from("stock_products")
    .select(
      "slug,title,code,order_no,description,subcategory_image_url,brand,category,subcategory,details",
    )
    .eq("slug", id)
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return mapRowToProduct(data);
};
