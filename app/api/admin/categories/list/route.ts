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

export async function GET(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("subcategories")
    .select(
      `
      id,
      name,
      slug,
      page_url,
      image_url,
      category:categories ( name, slug ),
      brand:brands ( name, slug )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: "Failed to load categories." },
      { status: 500 },
    );
  }

  const categories = new Set<string>();
  const brands = new Set<string>();
  (data ?? []).forEach((row) => {
    const category = Array.isArray(row.category)
      ? row.category[0]
      : row.category;
    const brand = Array.isArray(row.brand) ? row.brand[0] : row.brand;
    if (category?.name) categories.add(category.name);
    if (brand?.name) brands.add(brand.name);
  });

  const { data: categoryRows, error: categoryError } = await supabaseAdmin
    .from("categories")
    .select("id, industries");

  if (categoryError) {
    return NextResponse.json(
      { message: "Failed to load category summary." },
      { status: 500 },
    );
  }

  const industries = new Set<string>();
  (categoryRows ?? []).forEach((row) => {
    if (Array.isArray(row.industries)) {
      row.industries.forEach((item) => {
        if (typeof item === "string" && item.trim()) {
          industries.add(item.trim());
        }
      });
    }
  });

  return NextResponse.json({
    rows: data ?? [],
    summary: {
      categories: categories.size,
      brands: brands.size,
      subcategories: (data ?? []).length,
      industries: industries.size,
    },
  });
}
