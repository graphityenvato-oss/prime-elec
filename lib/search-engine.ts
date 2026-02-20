import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

const PLACEHOLDER_IMAGE = "/images/placeholder/imageholder.webp";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
const STOCK_FOLDER = "stock";
const IMAGE_FILENAME_EXT = /\.(jpg|jpeg|png|webp|gif)$/i;

const buildSupabaseImageUrl = (value: string, folder = STOCK_FOLDER) => {
  if (!SUPABASE_URL) return null;
  const filename = value.replace(/\\/g, "/").split("/").pop()?.trim();
  if (!filename || !IMAGE_FILENAME_EXT.test(filename)) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(STORAGE_BUCKET)}/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokenize = (query: string) =>
  normalizeText(query)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

const slugify = (value: string) =>
  normalizeText(value)
    .replace(/\s+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeImageUrl = (value?: string | null, folder = STOCK_FOLDER) => {
  const trimmed = value?.trim();
  if (!trimmed) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/images/")) {
    return buildSupabaseImageUrl(trimmed, folder) ?? trimmed;
  }
  if (trimmed.startsWith("images/")) {
    return buildSupabaseImageUrl(trimmed, folder) ?? `/${trimmed}`;
  }
  if (trimmed.startsWith("/")) return trimmed;
  if (IMAGE_FILENAME_EXT.test(trimmed)) {
    return buildSupabaseImageUrl(trimmed, folder) ?? PLACEHOLDER_IMAGE;
  }
  return PLACEHOLDER_IMAGE;
};

const computeScore = (
  value: string,
  tokens: string[],
  weights: {
    exact: number;
    startsWith: number;
    includes: number;
  },
) => {
  const normalized = normalizeText(value);
  if (!normalized) return 0;

  let score = 0;
  const joined = tokens.join(" ");
  if (normalized === joined) score += weights.exact;
  if (normalized.startsWith(joined)) score += weights.startsWith;

  tokens.forEach((token) => {
    if (normalized === token) score += weights.exact;
    else if (normalized.startsWith(token)) score += weights.startsWith;
    else if (normalized.includes(token)) score += weights.includes;
  });

  return score;
};

type SearchStockProduct = {
  type: "stock-product";
  id: string;
  title: string;
  codeNo: string;
  partNumber: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  href: string;
  score: number;
};

type SearchStockCategory = {
  type: "stock-category";
  title: string;
  description: string;
  image: string;
  href: string;
  score: number;
};

type SearchStockSubcategory = {
  type: "stock-subcategory";
  title: string;
  category: string;
  image: string;
  href: string;
  score: number;
};

type SearchExternal = {
  type: "external";
  title: string;
  brand: string;
  category: string;
  image: string;
  pageUrl: string;
  score: number;
};

export type SearchResponse = {
  query: string;
  stockProducts: SearchStockProduct[];
  stockCategories: SearchStockCategory[];
  stockSubcategories: SearchStockSubcategory[];
  external: SearchExternal[];
  totals: {
    stockProducts: number;
    stockCategories: number;
    stockSubcategories: number;
    external: number;
  };
};

export const performSearch = async (
  rawQuery: string,
  options?: {
    limitProducts?: number;
    limitCategories?: number;
    limitSubcategories?: number;
    limitExternal?: number;
  },
): Promise<SearchResponse> => {
  const query = rawQuery.trim();
  const tokens = tokenize(query);
  if (!tokens.length) {
    return {
      query,
      stockProducts: [],
      stockCategories: [],
      stockSubcategories: [],
      external: [],
      totals: {
        stockProducts: 0,
        stockCategories: 0,
        stockSubcategories: 0,
        external: 0,
      },
    };
  }

  const { data: stockRows, error: stockError } = await supabaseAdmin
    .from("stock_products")
    .select(
      "slug,title,code,order_no,description,brand,category,subcategory,subcategory_image_url,category_image_url,category_image_urls,details",
    );

  if (stockError) {
    throw new Error("Failed to load stock products for search.");
  }

  const { data: externalRows, error: externalError } = await supabaseAdmin
    .from("subcategories")
    .select(
      "name,page_url,image_url,brand:brands(name,slug),category:categories(name,slug)",
    )
    .not("page_url", "is", null);

  if (externalError) {
    throw new Error("Failed to load external catalog links for search.");
  }

  const products: SearchStockProduct[] = (stockRows ?? [])
    .map((row) => {
      const detailsText =
        row.details && typeof row.details === "object"
          ? Object.entries(row.details as Record<string, unknown>)
              .map(([key, value]) => `${key} ${String(value ?? "")}`)
              .join(" ")
          : "";

      const score =
        computeScore(row.code ?? "", tokens, {
          exact: 220,
          startsWith: 170,
          includes: 130,
        }) +
        computeScore(row.order_no ?? "", tokens, {
          exact: 210,
          startsWith: 160,
          includes: 120,
        }) +
        computeScore(row.title ?? "", tokens, {
          exact: 180,
          startsWith: 130,
          includes: 90,
        }) +
        computeScore(row.brand ?? "", tokens, {
          exact: 100,
          startsWith: 70,
          includes: 50,
        }) +
        computeScore(row.category ?? "", tokens, {
          exact: 90,
          startsWith: 65,
          includes: 45,
        }) +
        computeScore(row.subcategory ?? "", tokens, {
          exact: 100,
          startsWith: 70,
          includes: 50,
        }) +
        computeScore(row.description ?? "", tokens, {
          exact: 30,
          startsWith: 20,
          includes: 15,
        }) +
        computeScore(detailsText, tokens, {
          exact: 20,
          startsWith: 15,
          includes: 12,
        });

      return {
        type: "stock-product" as const,
        id: row.slug,
        title: row.title,
        codeNo: row.code,
        partNumber: row.order_no,
        brand: row.brand,
        category: row.category,
        subcategory: row.subcategory,
        description: row.description,
        image: normalizeImageUrl(row.subcategory_image_url),
        href: `/products/${row.slug}`,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const categoryMap = new Map<
    string,
    {
      title: string;
      image: string;
      products: number;
      subcategories: Set<string>;
    }
  >();
  (stockRows ?? []).forEach((row) => {
    const key = normalizeText(row.category);
    const existing = categoryMap.get(key);
    const preview =
      Array.isArray(row.category_image_urls) && row.category_image_urls.length
        ? normalizeImageUrl(row.category_image_urls[0])
        : normalizeImageUrl(row.category_image_url);
    if (existing) {
      existing.products += 1;
      existing.subcategories.add(row.subcategory);
      return;
    }
    categoryMap.set(key, {
      title: row.category,
      image: preview,
      products: 1,
      subcategories: new Set([row.subcategory]),
    });
  });

  const stockCategories: SearchStockCategory[] = Array.from(
    categoryMap.values(),
  )
    .map((item) => {
      const score = computeScore(item.title, tokens, {
        exact: 140,
        startsWith: 100,
        includes: 70,
      });
      return {
        type: "stock-category" as const,
        title: item.title,
        description: `${item.subcategories.size} subcategories · ${item.products} products`,
        image: item.image,
        href: `/stock/${slugify(item.title)}`,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const subcategoryMap = new Map<
    string,
    { title: string; category: string; image: string }
  >();
  (stockRows ?? []).forEach((row) => {
    const key = `${normalizeText(row.category)}::${normalizeText(row.subcategory)}`;
    if (subcategoryMap.has(key)) return;
    subcategoryMap.set(key, {
      title: row.subcategory,
      category: row.category,
      image: normalizeImageUrl(row.subcategory_image_url),
    });
  });

  const stockSubcategories: SearchStockSubcategory[] = Array.from(
    subcategoryMap.values(),
  )
    .map((item) => {
      const score =
        computeScore(item.title, tokens, {
          exact: 130,
          startsWith: 95,
          includes: 65,
        }) +
        computeScore(item.category, tokens, {
          exact: 40,
          startsWith: 30,
          includes: 20,
        });
      return {
        type: "stock-subcategory" as const,
        title: item.title,
        category: item.category,
        image: item.image,
        href: `/stock/${slugify(item.category)}/${slugify(item.title)}`,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const external: SearchExternal[] = (externalRows ?? [])
    .map((row) => {
      const brand = Array.isArray(row.brand) ? row.brand[0] : row.brand;
      const category = Array.isArray(row.category)
        ? row.category[0]
        : row.category;
      const score =
        computeScore(row.name ?? "", tokens, {
          exact: 120,
          startsWith: 90,
          includes: 60,
        }) +
        computeScore(brand?.name ?? "", tokens, {
          exact: 70,
          startsWith: 50,
          includes: 35,
        }) +
        computeScore(category?.name ?? "", tokens, {
          exact: 65,
          startsWith: 45,
          includes: 30,
        }) +
        computeScore(row.page_url ?? "", tokens, {
          exact: 25,
          startsWith: 15,
          includes: 10,
        });

      return {
        type: "external" as const,
        title: row.name,
        brand: brand?.name ?? "Brand",
        category: category?.name ?? "Category",
        image: normalizeImageUrl(row.image_url, "catalog"),
        pageUrl: row.page_url,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const limitedProducts = products.slice(0, options?.limitProducts ?? 12);
  const limitedCategories = stockCategories.slice(
    0,
    options?.limitCategories ?? 8,
  );
  const limitedSubcategories = stockSubcategories.slice(
    0,
    options?.limitSubcategories ?? 8,
  );
  const limitedExternal = external.slice(0, options?.limitExternal ?? 12);

  return {
    query,
    stockProducts: limitedProducts,
    stockCategories: limitedCategories,
    stockSubcategories: limitedSubcategories,
    external: limitedExternal,
    totals: {
      stockProducts: products.length,
      stockCategories: stockCategories.length,
      stockSubcategories: stockSubcategories.length,
      external: external.length,
    },
  };
};
