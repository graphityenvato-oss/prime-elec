import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function checkAdmin(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return 401;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return 401;
  const { data: admins, error: adminError } = await supabaseAdmin
    .from("admin_users").select("id").eq("user_id", data.user.id).limit(1);
  return adminError ? 500 : admins?.length ? 200 : 403;
}

export async function GET(request: Request) {
  const status = await checkAdmin(request);
  if (status !== 200) return NextResponse.json({ message: "Unable to verify admin access." }, { status });
  const results = await Promise.all([
    supabaseAdmin.from("categories").select("id, name, slug, main_image_url, industries").order("name"),
    supabaseAdmin.from("brands").select("id, name, slug").order("name"),
    supabaseAdmin.from("industries").select("id, name").order("name"),
  ]);
  if (results.some((result) => result.error)) {
    return NextResponse.json({ message: "Failed to load form options." }, { status: 500 });
  }
  return NextResponse.json({ categories: results[0].data, brands: results[1].data, industries: results[2].data });
}

class FormError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

const mimeTypes: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif",
};

function validateImage(value: FormDataEntryValue | null, label: string): File {
  if (!(value instanceof File) || !value.size) throw new FormError(`${label} is required.`);
  const extension = value.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/)?.[1];
  if (!extension || value.type !== mimeTypes[extension]) {
    throw new FormError(`${label} must be a JPG, PNG, WEBP, or GIF image.`);
  }
  if (value.size > 3 * 1024 * 1024) throw new FormError(`${label} must be 3 MB or smaller.`);
  return value;
}

export async function POST(request: Request) {
  const status = await checkAdmin(request);
  if (status !== 200) return NextResponse.json({ message: "Unable to verify admin access." }, { status });
  const storage = supabaseAdmin.storage.from(process.env.SUPABASE_STORAGE_BUCKET || "uploads");
  const pendingImages = new Set<string>();
  try {
    const form = await request.formData().catch(() => null);
    if (!form) throw new FormError("Invalid form submission.");
    const text = (key: string) => {
      const value = form.get(key);
      return typeof value === "string" ? value.trim() : "";
    };
    const categoryName = text("categoryName");
    const brandName = text("brandName");
    const subcategoryName = text("subcategoryName");
    const pageUrl = text("pageUrl");
    if (![categoryName, brandName, subcategoryName].every((name) => name && slugify(name))) {
      throw new FormError("Category, brand, and subcategory names must contain letters or numbers.");
    }
    let destination: URL;
    try { destination = new URL(pageUrl); } catch { throw new FormError("Enter a valid page URL starting with http:// or https://."); }
    if (!["http:", "https:"].includes(destination.protocol)) throw new FormError("Page URL must start with http:// or https://.");

    const image = validateImage(form.get("image"), "Subcategory image");
    const [categoryResult, brandResult] = await Promise.all([
      supabaseAdmin.from("categories").select("id, name, slug, main_image_url, industries").eq("slug", slugify(categoryName)).maybeSingle(),
      supabaseAdmin.from("brands").select("id, name, slug").eq("slug", slugify(brandName)).maybeSingle(),
    ]);
    if (categoryResult.error || brandResult.error) throw new FormError("Failed to load category or brand.", 500);
    let category = categoryResult.data;
    let brand = brandResult.data;
    const subcategorySlug = slugify(subcategoryName);
    if (category && brand) {
      const { data, error } = await supabaseAdmin.from("subcategories").select("id")
        .eq("category_id", category.id).eq("brand_id", brand.id).eq("slug", subcategorySlug).limit(1);
      if (error) throw new FormError("Failed to check existing entries.", 500);
      if (data?.length) throw new FormError("This subcategory already exists for the selected category and brand.", 409);
    }

    let mainImage: File | null = null;
    let industries: string[] = [];
    if (!category) {
      mainImage = validateImage(form.get("mainImage"), "Main category image");
      const industryIds = [...new Set(form.getAll("industryIds").filter((value): value is string => typeof value === "string"))];
      if (!industryIds.length) throw new FormError("Select at least one industry for the new category.");
      const { data, error } = await supabaseAdmin.from("industries").select("id, name").in("id", industryIds);
      if (error || !data || data.length !== industryIds.length) throw new FormError("Selected industries could not be found. Refresh and try again.");
      industries = data.map((row) => row.name);
    }

    const upload = async (file: File) => {
      const extension = file.name.toLowerCase().split(".").pop();
      const path = `catalog/${randomUUID()}.${extension}`;
      const { error } = await storage.upload(path, new Uint8Array(await file.arrayBuffer()), { contentType: file.type, upsert: false });
      if (error) throw new FormError("Failed to upload image. Please try again.", 500);
      pendingImages.add(path);
      return { path, url: storage.getPublicUrl(path).data.publicUrl };
    };
    const subcategoryImage = await upload(image);
    if (!brand) {
      const { data, error } = await supabaseAdmin.from("brands")
        .insert({ name: brandName, slug: slugify(brandName) }).select("id, name, slug").single();
      if (error || !data) throw new FormError("Failed to create brand. Please refresh and try again.", error?.code === "23505" ? 409 : 500);
      brand = data;
    }
    if (!category && mainImage) {
      const uploadedMain = await upload(mainImage);
      const { data, error } = await supabaseAdmin.from("categories")
        .insert({ name: categoryName, slug: slugify(categoryName), main_image_url: uploadedMain.url, industries })
        .select("id, name, slug, main_image_url, industries").single();
      if (error || !data) throw new FormError("Failed to create category. Please refresh and try again.", error?.code === "23505" ? 409 : 500);
      category = data;
      pendingImages.delete(uploadedMain.path);
    }
    if (!category || !brand) throw new FormError("Failed to resolve category or brand.", 500);
    const { data, error } = await supabaseAdmin.from("subcategories")
      .insert({ category_id: category.id, brand_id: brand.id, name: subcategoryName, slug: subcategorySlug, page_url: pageUrl, image_url: subcategoryImage.url })
      .select("id").single();
    if (error || !data) throw new FormError(error?.code === "23505" ? "This subcategory already exists for the selected category and brand." : "Failed to save subcategory. Please try again.", error?.code === "23505" ? 409 : 500);
    pendingImages.delete(subcategoryImage.path);
    return NextResponse.json({ message: "Category item added successfully." }, { status: 201 });
  } catch (error) {
    if (pendingImages.size) await storage.remove([...pendingImages]);
    return NextResponse.json({ message: error instanceof FormError ? error.message : "Failed to save category item." }, { status: error instanceof FormError ? error.status : 500 });
  }
}
