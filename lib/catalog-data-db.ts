import { supabaseServer } from "@/lib/supabase/server";

export type DbSubcategory = {
  id: string;
  title: string;
  slug: string;
  pageUrl: string;
  image?: string;
};

export type DbBrand = {
  id: string;
  key: string;
  name: string;
  logo: string;
};

export type DbMainCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  industries: string[];
  brands: DbBrand[];
};

const placeholderLogo = "/images/placeholder/imageholder.webp";

const brandLogoMap: Record<string, string> = {
  degson: "/images/partners/degson-logo.png",
  deltabox: "/images/partners/Deltabox.png",
  eaton: "/images/partners/Eaton-logo.png",
  fecheliportsequipment: "/images/partners/FEC-Heliports-Equipment-logo.png",
  indelec: "/images/partners/Indelec-logo.png",
  relpol: "/images/partners/Logo-Relpol.png",
  obo: "/images/partners/obo-logo.png",
  obobetterman: "/images/partners/obo-logo.png",
  obobettermann: "/images/partners/obo-logo.png",
  solway: "/images/partners/Solway.png",
  teknoware: "/images/partners/teknoware-logo.png",
  tem: "/images/partners/Tem-logo.png",
};

const normalizeBrandKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

export const resolveBrandLogo = (name: string) => {
  const key = normalizeBrandKey(name);
  if (brandLogoMap[key]) return brandLogoMap[key];
  if (key.includes("obo")) return brandLogoMap.obo;
  return placeholderLogo;
};

const normalizeImageUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("images/")) return `/${trimmed}`;
  return undefined;
};

const buildDescription = (title: string, industries?: string[]) => {
  if (industries && industries.length) {
    return industries.join(" • ");
  }
  return title;
};

export const getMainCategoriesDb = async (): Promise<DbMainCategory[]> => {
  const { data, error } = await supabaseServer
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      main_image_url,
      industries,
      subcategories (
        image_url,
        brand:brands ( id, name, slug )
      )
    `,
    )
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Failed to load categories.");
  }

  return (data ?? []).map((category) => {
    const brandsMap = new Map<string, DbBrand>();
    let image: string | undefined;
    const industries = Array.isArray(category.industries)
      ? category.industries.filter((item) => typeof item === "string")
      : [];

    image = normalizeImageUrl(category.main_image_url);

    (category.subcategories ?? []).forEach((item) => {
      if (!image && item.image_url) {
        image = normalizeImageUrl(item.image_url);
      }
      const brand = Array.isArray(item.brand) ? item.brand[0] : item.brand;
      if (brand?.id && !brandsMap.has(brand.id)) {
        brandsMap.set(brand.id, {
          id: brand.id,
          key: brand.slug,
          name: brand.name,
          logo: resolveBrandLogo(brand.name),
        });
      }
    });

    return {
      id: category.id,
      slug: category.slug,
      title: category.name,
      description: buildDescription(category.name, industries),
      image: image ?? undefined,
      industries,
      brands: Array.from(brandsMap.values()),
    };
  });
};

export const getMainCategoryBySlugDb = async (slug: string) => {
  const { data, error } = await supabaseServer
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      main_image_url,
      industries,
      subcategories (
        image_url,
        brand:brands ( id, name, slug )
      )
    `,
    )
    .eq("slug", slug)
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  const brandsMap = new Map<string, DbBrand>();
  let image: string | undefined;
  const industries = Array.isArray(data.industries)
    ? data.industries.filter((item) => typeof item === "string")
    : [];

  image = normalizeImageUrl(data.main_image_url);

  (data.subcategories ?? []).forEach((item) => {
    if (!image && item.image_url) {
      image = normalizeImageUrl(item.image_url);
    }
    const brand = Array.isArray(item.brand) ? item.brand[0] : item.brand;
    if (brand?.id && !brandsMap.has(brand.id)) {
      brandsMap.set(brand.id, {
        id: brand.id,
        key: brand.slug,
        name: brand.name,
        logo: resolveBrandLogo(brand.name),
      });
    }
  });

  return {
    id: data.id,
    slug: data.slug,
    title: data.name,
    description: buildDescription(data.name, industries),
    image: image ?? undefined,
    industries,
    brands: Array.from(brandsMap.values()),
  } satisfies DbMainCategory;
};

export const getBrandCategoryDb = async (
  brandSlug: string,
  categorySlug: string,
) => {
  const { data: category, error: categoryError } = await supabaseServer
    .from("categories")
    .select("id, name, slug, main_image_url, industries")
    .eq("slug", categorySlug)
    .limit(1)
    .single();

  if (categoryError || !category) {
    return null;
  }

  const { data: brand, error: brandError } = await supabaseServer
    .from("brands")
    .select("id, name, slug")
    .eq("slug", brandSlug)
    .limit(1)
    .single();

  if (brandError || !brand) {
    return null;
  }

  const { data: items, error: itemsError } = await supabaseServer
    .from("subcategories")
    .select("id, name, slug, page_url, image_url")
    .eq("category_id", category.id)
    .eq("brand_id", brand.id)
    .order("name", { ascending: true });

  if (itemsError) {
    return null;
  }

  return {
    brand: {
      id: brand.id,
      key: brand.slug,
      name: brand.name,
      logo: resolveBrandLogo(brand.name),
    },
    category: {
      id: category.id,
      slug: category.slug,
      title: category.name,
      description: buildDescription(
        category.name,
        Array.isArray(category.industries)
          ? category.industries.filter((item) => typeof item === "string")
          : [],
      ),
      image: normalizeImageUrl(category.main_image_url),
      industries: Array.isArray(category.industries)
        ? category.industries.filter((item) => typeof item === "string")
        : [],
      brands: [],
      subcategories: (items ?? []).map((item) => ({
        id: item.id,
        title: item.name,
        slug: item.slug,
        pageUrl: item.page_url,
        image: normalizeImageUrl(item.image_url),
      })),
    },
  };
};
