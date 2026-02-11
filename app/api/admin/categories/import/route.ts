import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type ImportRow = {
  category_name: string;
  brand_name: string;
  subcategory_name: string;
  page_url: string;
  image_url: string;
  main_image_url: string;
  industries: string;
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
  const categoryMeta = new Map<
    string,
    { mainImageUrl: string | null; industries: Set<string> }
  >();
  const cleaned = body.rows
    .map((row, index) => {
      const rowNumber = index + 2;
      const categoryName = String(row.category_name ?? "").trim();
      const brandName = String(row.brand_name ?? "").trim();
      const subcategoryName = String(row.subcategory_name ?? "").trim();
      const pageUrl = String(row.page_url ?? "").trim();
      const imageUrl = String(row.image_url ?? "").trim();
      const mainImageUrl = String(row.main_image_url ?? "").trim();
      const industriesRaw = String(row.industries ?? "").trim();
      const industries = industriesRaw
        .split("/")
        .map((value) => value.trim())
        .filter(Boolean);

      if (!categoryName) {
        issues.push({
          row: rowNumber,
          field: "category_name",
          message: "Category name is required.",
        });
      }
      if (!brandName) {
        issues.push({
          row: rowNumber,
          field: "brand_name",
          message: "Brand name is required.",
        });
      }
      if (!subcategoryName) {
        issues.push({
          row: rowNumber,
          field: "subcategory_name",
          message: "Subcategory name is required.",
        });
      }
      if (!pageUrl) {
        issues.push({
          row: rowNumber,
          field: "page_url",
          message: "Page URL is required.",
        });
      } else if (!/^https?:\/\//i.test(pageUrl)) {
        issues.push({
          row: rowNumber,
          field: "page_url",
          message: "Page URL must start with http or https.",
        });
      }
      if (!imageUrl) {
        issues.push({
          row: rowNumber,
          field: "image_url",
          message: "Image URL is required.",
        });
      } else if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(imageUrl)) {
        issues.push({
          row: rowNumber,
          field: "image_url",
          message:
            "Image URL must include a valid extension (.jpg, .jpeg, .png, .webp, .gif).",
        });
      }
      if (!mainImageUrl) {
        issues.push({
          row: rowNumber,
          field: "main_image_url",
          message: "Main image URL is required.",
        });
      } else if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(mainImageUrl)) {
        issues.push({
          row: rowNumber,
          field: "main_image_url",
          message:
            "Main image URL must include a valid extension (.jpg, .jpeg, .png, .webp, .gif).",
        });
      }
      if (!industries.length) {
        issues.push({
          row: rowNumber,
          field: "industries",
          message: "Industries is required.",
        });
      }

      if (categoryName) {
        const meta = categoryMeta.get(categoryName) ?? {
          mainImageUrl: null,
          industries: new Set<string>(),
        };
        if (mainImageUrl) {
          if (meta.mainImageUrl && meta.mainImageUrl !== mainImageUrl) {
            issues.push({
              row: rowNumber,
              field: "main_image_url",
              message: "Main image URL must be the same for this category.",
            });
          } else {
            meta.mainImageUrl = mainImageUrl;
          }
        }
        industries.forEach((item) => meta.industries.add(item));
        categoryMeta.set(categoryName, meta);
      }

      return {
        rowNumber,
        categoryName,
        brandName,
        subcategoryName,
        pageUrl,
        imageUrl,
        mainImageUrl,
        industries,
      };
    })
    .filter(
      (row) =>
        row.categoryName ||
        row.brandName ||
        row.subcategoryName ||
        row.pageUrl ||
        row.imageUrl ||
        row.mainImageUrl ||
        row.industries.length,
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

  const uniqueCategories = Array.from(
    new Set(cleaned.map((row) => row.categoryName)),
  );
  const uniqueBrands = Array.from(new Set(cleaned.map((row) => row.brandName)));

  const categoryPayload = uniqueCategories.map((name) => {
    const meta = categoryMeta.get(name);
    return {
      name,
      slug: slugify(name),
      main_image_url: meta?.mainImageUrl ?? null,
      industries: meta ? Array.from(meta.industries) : [],
    };
  });
  const brandPayload = uniqueBrands.map((name) => ({
    name,
    slug: slugify(name),
  }));

  const { error: categoryError } = await supabaseAdmin
    .from("categories")
    .upsert(categoryPayload, { onConflict: "name" });
  if (categoryError) {
    return NextResponse.json(
      {
        message: "Failed to upsert categories.",
        details: categoryError.message,
      },
      { status: 500 },
    );
  }

  const { error: brandError } = await supabaseAdmin
    .from("brands")
    .upsert(brandPayload, { onConflict: "name" });
  if (brandError) {
    return NextResponse.json(
      { message: "Failed to upsert brands.", details: brandError.message },
      { status: 500 },
    );
  }

  const { data: categoryRows, error: categoryFetchError } = await supabaseAdmin
    .from("categories")
    .select("id, name")
    .in("name", uniqueCategories);
  if (categoryFetchError || !categoryRows) {
    return NextResponse.json(
      { message: "Failed to load categories." },
      { status: 500 },
    );
  }

  const { data: brandRows, error: brandFetchError } = await supabaseAdmin
    .from("brands")
    .select("id, name")
    .in("name", uniqueBrands);
  if (brandFetchError || !brandRows) {
    return NextResponse.json(
      { message: "Failed to load brands." },
      { status: 500 },
    );
  }

  const categoryMap = new Map(categoryRows.map((row) => [row.name, row.id]));
  const brandMap = new Map(brandRows.map((row) => [row.name, row.id]));

  const subcategoryPayload = cleaned.map((row) => ({
    category_id: categoryMap.get(row.categoryName),
    brand_id: brandMap.get(row.brandName),
    name: row.subcategoryName,
    slug: slugify(row.subcategoryName),
    page_url: row.pageUrl,
    image_url: row.imageUrl,
  }));

  if (subcategoryPayload.some((row) => !row.category_id || !row.brand_id)) {
    return NextResponse.json(
      { message: "Failed to map categories or brands." },
      { status: 500 },
    );
  }

  const { error: subcategoryError } = await supabaseAdmin
    .from("subcategories")
    .upsert(subcategoryPayload, {
      onConflict: "category_id,brand_id,slug",
    });

  if (subcategoryError) {
    return NextResponse.json(
      {
        message: "Failed to upsert subcategories.",
        details: subcategoryError.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: `Imported ${subcategoryPayload.length} subcategories.`,
    imported: subcategoryPayload.length,
    skipped: 0,
  });
}
