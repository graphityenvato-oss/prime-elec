import { supabaseServer } from "@/lib/supabase/server";

export type DbIndustry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
};

export type DbIndustryDetail = DbIndustry & {
  categories: Array<{
    id: string;
    slug: string;
    title: string;
    image?: string;
  }>;
};

const normalizeImageUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("images/")) return `/${trimmed}`;
  return undefined;
};

export const getIndustriesDb = async (): Promise<DbIndustry[]> => {
  const { data, error } = await supabaseServer
    .from("industries")
    .select("id, name, slug, description, image_url")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Failed to load industries.");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.name,
    description: row.description,
    image: normalizeImageUrl(row.image_url),
  }));
};

export const getIndustryBySlugDb = async (
  slug: string,
): Promise<DbIndustryDetail | null> => {
  const { data, error } = await supabaseServer
    .from("industries")
    .select("id, name, slug, description, image_url")
    .eq("slug", slug)
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  const { data: categories, error: categoriesError } = await supabaseServer
    .from("categories")
    .select("id, name, slug, main_image_url, industries")
    .contains("industries", [data.name])
    .order("name", { ascending: true });

  if (categoriesError) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.name,
    description: data.description,
    image: normalizeImageUrl(data.image_url),
    categories: (categories ?? []).map((category) => ({
      id: category.id,
      slug: category.slug,
      title: category.name,
      image: normalizeImageUrl(category.main_image_url),
    })),
  };
};
