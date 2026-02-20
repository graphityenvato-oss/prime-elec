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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
const IMAGE_FILENAME_EXT = /\.(jpg|jpeg|png|webp|gif)$/i;

const buildSupabaseImageUrl = (value: string, folder: string) => {
  if (!SUPABASE_URL) return null;
  const filename = value.replace(/\\/g, "/").split("/").pop()?.trim();
  if (!filename || !IMAGE_FILENAME_EXT.test(filename)) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(STORAGE_BUCKET)}/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
};

const normalizeImageUrl = (value?: string | null, folder = "industries") => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/images/")) {
    return buildSupabaseImageUrl(trimmed, folder) ?? trimmed;
  }
  if (trimmed.startsWith("images/")) {
    return buildSupabaseImageUrl(trimmed, folder) ?? `/${trimmed}`;
  }
  if (trimmed.startsWith("/")) return trimmed;
  if (IMAGE_FILENAME_EXT.test(trimmed)) {
    return buildSupabaseImageUrl(trimmed, folder) ?? undefined;
  }
  return undefined;
};

const normalizeIndustryKey = (value?: string | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

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
    .order("name", { ascending: true });

  if (categoriesError) {
    return null;
  }

  const targetIndustry = normalizeIndustryKey(data.name);
  const filteredCategories = (categories ?? []).filter((category) => {
    if (!Array.isArray(category.industries)) return false;
    return category.industries.some(
      (industry) => normalizeIndustryKey(industry) === targetIndustry,
    );
  });

  return {
    id: data.id,
    slug: data.slug,
    title: data.name,
    description: data.description,
    image: normalizeImageUrl(data.image_url, "industries"),
    categories: filteredCategories.map((category) => ({
      id: category.id,
      slug: category.slug,
      title: category.name,
      image: normalizeImageUrl(category.main_image_url, "catalog"),
    })),
  };
};
