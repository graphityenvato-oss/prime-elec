import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

const getAdminUser = async (request: Request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return { ok: false, status: 401 };
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(token);

  if (userError || !userData.user) {
    return { ok: false, status: 401 };
  }

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", userData.user.id)
    .limit(1);

  if (error) {
    return { ok: false, status: 500 };
  }

  return { ok: (data?.length ?? 0) > 0, status: 200 };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Missing id." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        categoryName?: string;
        brandName?: string;
        subcategoryName?: string;
        pageUrl?: string;
        imageUrl?: string;
      }
    | null;

  if (!body) {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  const categoryName = (body.categoryName ?? "").trim();
  const brandName = (body.brandName ?? "").trim();
  const subcategoryName = (body.subcategoryName ?? "").trim();
  const pageUrl = (body.pageUrl ?? "").trim();
  const imageUrl = (body.imageUrl ?? "").trim();

  if (!categoryName || !brandName || !subcategoryName || !pageUrl) {
    return NextResponse.json(
      { message: "Category, brand, subcategory, and page URL are required." },
      { status: 400 },
    );
  }

  const { error: categoryError } = await supabaseAdmin
    .from("categories")
    .upsert({ name: categoryName, slug: slugify(categoryName) }, { onConflict: "name" });
  if (categoryError) {
    return NextResponse.json(
      { message: "Failed to update category." },
      { status: 500 },
    );
  }

  const { error: brandError } = await supabaseAdmin
    .from("brands")
    .upsert({ name: brandName, slug: slugify(brandName) }, { onConflict: "name" });
  if (brandError) {
    return NextResponse.json(
      { message: "Failed to update brand." },
      { status: 500 },
    );
  }

  const { data: category, error: categoryFetchError } = await supabaseAdmin
    .from("categories")
    .select("id, name, slug")
    .eq("name", categoryName)
    .limit(1)
    .single();
  if (categoryFetchError || !category) {
    return NextResponse.json(
      { message: "Failed to load category." },
      { status: 500 },
    );
  }

  const { data: brand, error: brandFetchError } = await supabaseAdmin
    .from("brands")
    .select("id, name, slug")
    .eq("name", brandName)
    .limit(1)
    .single();
  if (brandFetchError || !brand) {
    return NextResponse.json(
      { message: "Failed to load brand." },
      { status: 500 },
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("subcategories")
    .update({
      category_id: category.id,
      brand_id: brand.id,
      name: subcategoryName,
      slug: slugify(subcategoryName),
      page_url: pageUrl,
      image_url: imageUrl,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { message: "Failed to update subcategory." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    category,
    brand,
    subcategory: {
      id,
      name: subcategoryName,
      slug: slugify(subcategoryName),
      page_url: pageUrl,
      image_url: imageUrl,
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Missing id." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("subcategories")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Failed to delete category." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
