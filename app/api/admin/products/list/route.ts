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
    .from("stock_products")
    .select(
      "id,slug,brand,category,category_image_url,category_image_urls,subcategory,subcategory_image_url,order_no,code,title,description,details,created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: "Failed to load stock products.", details: error.message },
      { status: 500 },
    );
  }

  const rows = data ?? [];
  const brands = new Set(rows.map((row) => row.brand).filter(Boolean));
  const categories = new Set(rows.map((row) => row.category).filter(Boolean));
  const subcategories = new Set(
    rows.map((row) => row.subcategory).filter(Boolean),
  );

  return NextResponse.json({
    rows,
    summary: {
      products: rows.length,
      brands: brands.size,
      categories: categories.size,
      subcategories: subcategories.size,
    },
  });
}
