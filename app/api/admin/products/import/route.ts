import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type ImportRow = {
  brand: string;
  category: string;
  category_image_urls: string[];
  subcategory: string;
  subcategory_image_url: string;
  order_no: string;
  code: string;
  description: string;
  details: Record<string, string>;
};

type ValidationIssue = {
  row: number;
  field: string;
  message: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

const isImageUrl = (value: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(value);

export async function POST(request: Request) {
  const admin = await getAdminUser(request);
  if (!admin.ok) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: admin.status },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    rows?: ImportRow[];
  } | null;

  if (!body?.rows || !Array.isArray(body.rows)) {
    return NextResponse.json(
      { message: "Invalid payload. Expected rows array." },
      { status: 400 },
    );
  }

  const issues: ValidationIssue[] = [];
  const cleaned = body.rows
    .map((row, index) => {
      const rowNumber = index + 2;
      const brand = String(row.brand ?? "").trim();
      const category = String(row.category ?? "").trim();
      const categoryImageUrls = Array.isArray(row.category_image_urls)
        ? row.category_image_urls
            .map((value) => String(value ?? "").trim())
            .filter(Boolean)
        : [];
      const subcategory = String(row.subcategory ?? "").trim();
      const subcategoryImageUrl = String(
        row.subcategory_image_url ?? "",
      ).trim();
      const orderNo = String(row.order_no ?? "").trim();
      const code = String(row.code ?? "").trim();
      const description = String(row.description ?? "").trim();
      const details = row.details ?? {};

      if (!brand) {
        issues.push({
          row: rowNumber,
          field: "brand",
          message: "Brand is required.",
        });
      }
      if (!category) {
        issues.push({
          row: rowNumber,
          field: "category",
          message: "Category is required.",
        });
      }
      if (!categoryImageUrls.length) {
        issues.push({
          row: rowNumber,
          field: "category_image_urls",
          message: "Category Image is required.",
        });
      } else {
        categoryImageUrls.forEach((image) => {
          if (!isImageUrl(image)) {
            issues.push({
              row: rowNumber,
              field: "category_image_urls",
              message:
                "Each Category Image must include a valid extension (.jpg, .jpeg, .png, .webp, .gif).",
            });
          }
        });
      }
      if (!subcategory) {
        issues.push({
          row: rowNumber,
          field: "subcategory",
          message: "Sub-Category is required.",
        });
      }
      if (!subcategoryImageUrl) {
        issues.push({
          row: rowNumber,
          field: "subcategory_image_url",
          message: "Sub-Category Image is required.",
        });
      } else if (!isImageUrl(subcategoryImageUrl)) {
        issues.push({
          row: rowNumber,
          field: "subcategory_image_url",
          message:
            "Sub-Category Image must include a valid extension (.jpg, .jpeg, .png, .webp, .gif).",
        });
      }
      if (!orderNo) {
        issues.push({
          row: rowNumber,
          field: "order_no",
          message: "Order# is required.",
        });
      }
      if (!code) {
        issues.push({
          row: rowNumber,
          field: "code",
          message: "Code is required.",
        });
      }
      if (!description) {
        issues.push({
          row: rowNumber,
          field: "description",
          message: "Description is required.",
        });
      }

      return {
        rowNumber,
        brand,
        category,
        categoryImageUrls,
        subcategory,
        subcategoryImageUrl,
        orderNo,
        code,
        description,
        details,
      };
    })
    .filter(
      (row) =>
        row.brand ||
        row.category ||
        row.subcategory ||
        row.orderNo ||
        row.code ||
        row.description,
    );

  if (!cleaned.length) {
    return NextResponse.json(
      { message: "No rows to import." },
      { status: 400 },
    );
  }

  if (issues.length) {
    return NextResponse.json(
      {
        message: `Validation failed with ${issues.length} issue${
          issues.length === 1 ? "" : "s"
        }.`,
        issues: issues.slice(0, 50),
      },
      { status: 400 },
    );
  }

  const payload = cleaned.map((row) => ({
    slug: slugify(
      `${row.brand}-${row.category}-${row.subcategory}-${row.orderNo}-${row.code}`,
    ),
    brand: row.brand,
    category: row.category,
    category_image_url: row.categoryImageUrls[0] ?? "",
    category_image_urls: row.categoryImageUrls,
    subcategory: row.subcategory,
    subcategory_image_url: row.subcategoryImageUrl,
    order_no: row.orderNo,
    code: row.code,
    title: row.code,
    description: row.description,
    details: row.details,
  }));

  const { error } = await supabaseAdmin.from("stock_products").upsert(payload, {
    onConflict: "brand,category,subcategory,order_no,code",
  });

  if (error) {
    return NextResponse.json(
      { message: "Failed to upsert stock products.", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: `Imported ${payload.length} stock products.`,
    imported: payload.length,
    skipped: 0,
  });
}
