import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

class FormError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

const imageTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function validateImage(value: FormDataEntryValue | null, label: string): File {
  if (!(value instanceof File) || !value.size) {
    throw new FormError(`${label} is required.`);
  }
  const extension = value.name
    .toLowerCase()
    .match(/\.(jpg|jpeg|png|webp|gif)$/)?.[1];
  if (!extension || value.type !== imageTypes[extension]) {
    throw new FormError(`${label} must be a JPG, PNG, WEBP, or GIF image.`);
  }
  if (value.size > 3 * 1024 * 1024) {
    throw new FormError(`${label} must be 3 MB or smaller.`);
  }
  return value;
}

export async function POST(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { data: user, error: userError } =
    await supabaseAdmin.auth.getUser(token);
  if (userError || !user.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { data: admins, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", user.user.id)
    .limit(1);
  if (adminError || !admins?.length) {
    return NextResponse.json(
      {
        message: adminError ? "Failed to verify admin access." : "Unauthorized",
      },
      { status: adminError ? 500 : 403 },
    );
  }

  const storage = supabaseAdmin.storage.from(
    process.env.SUPABASE_STORAGE_BUCKET || "uploads",
  );
  const uploadedPaths: string[] = [];
  try {
    const form = await request.formData().catch(() => null);
    if (!form) throw new FormError("Invalid form submission.");
    const text = (key: string) => {
      const value = form.get(key);
      return typeof value === "string" ? value.trim() : "";
    };
    const brand = text("brand");
    const category = text("category");
    const subcategory = text("subcategory");
    const orderNo = text("orderNo");
    const code = text("code");
    const description = text("description");
    if (
      ![brand, category, subcategory, orderNo, code, description].every(Boolean)
    ) {
      throw new FormError(
        "Brand, category, subcategory, order number, code, and description are required.",
      );
    }
    if (
      ![brand, category, subcategory, orderNo, code].every((value) =>
        slugify(value),
      )
    ) {
      throw new FormError("Names and codes must contain letters or numbers.");
    }
    const { data: optionRows, error: optionsError } = await supabaseAdmin
      .from("stock_products")
      .select("brand, category, subcategory")
      .eq("brand", brand)
      .eq("category", category)
      .eq("subcategory", subcategory);
    if (optionsError)
      throw new FormError("Failed to verify product selections.", 500);
    if (!optionRows?.length) {
      throw new FormError(
        "Choose an existing brand, category, and subcategory combination from the dropdowns.",
      );
    }
    const slug = slugify(
      `${brand}-${category}-${subcategory}-${orderNo}-${code}`,
    );
    const categoryFiles = form.getAll("categoryImages");
    if (!categoryFiles.length || categoryFiles.length > 10) {
      throw new FormError("Choose between 1 and 10 category images.");
    }
    const categoryImages = categoryFiles.map((file) =>
      validateImage(file, "Category image"),
    );
    const productImage = validateImage(
      form.get("productImage"),
      "Product / subcategory image",
    );

    let rawTags: unknown;
    try {
      rawTags = JSON.parse(text("tags") || "[]");
    } catch {
      throw new FormError("Invalid specification tags.");
    }
    if (!Array.isArray(rawTags) || rawTags.length > 100) {
      throw new FormError("Provide up to 100 specification tags.");
    }
    const labels = new Set<string>();
    const pairs: Array<[string, string]> = [];
    for (const tag of rawTags) {
      if (
        !tag ||
        typeof tag !== "object" ||
        typeof tag.label !== "string" ||
        typeof tag.value !== "string"
      ) {
        throw new FormError("Each specification tag needs a name and value.");
      }
      const label = tag.label.trim();
      const value = tag.value.trim();
      if (!label && !value) continue;
      if (!label || !value)
        throw new FormError(
          "Fill both the name and value for each specification tag.",
        );
      if (labels.has(label.toLowerCase()))
        throw new FormError(`Specification tag "${label}" is repeated.`);
      labels.add(label.toLowerCase());
      pairs.push([label, value]);
    }

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("stock_products")
      .select("id")
      .eq("slug", slug)
      .limit(1);
    if (lookupError)
      throw new FormError("Failed to check existing products.", 500);
    if (existing?.length)
      throw new FormError(
        "A product with these names and codes already exists.",
        409,
      );

    const upload = async (file: File) => {
      const extension = file.name.toLowerCase().split(".").pop();
      const path = `stock/${randomUUID()}.${extension}`;
      const { error } = await storage.upload(
        path,
        new Uint8Array(await file.arrayBuffer()),
        {
          contentType: file.type,
          upsert: false,
        },
      );
      if (error)
        throw new FormError("Failed to upload image. Please try again.", 500);
      uploadedPaths.push(path);
      return storage.getPublicUrl(path).data.publicUrl;
    };
    const categoryImageUrls: string[] = [];
    for (const file of categoryImages)
      categoryImageUrls.push(await upload(file));
    const productImageUrl = await upload(productImage);
    const { error } = await supabaseAdmin.from("stock_products").insert({
      slug,
      brand,
      category,
      category_image_url: categoryImageUrls[0],
      category_image_urls: categoryImageUrls,
      subcategory,
      subcategory_image_url: productImageUrl,
      order_no: orderNo,
      code,
      title: code,
      description,
      details: Object.fromEntries(pairs),
    });
    if (error) {
      throw new FormError(
        error.code === "23505"
          ? "A product with these names and codes already exists."
          : "Failed to save product. Please try again.",
        error.code === "23505" ? 409 : 500,
      );
    }
    return NextResponse.json(
      { message: "Product added successfully." },
      { status: 201 },
    );
  } catch (error) {
    if (uploadedPaths.length) await storage.remove(uploadedPaths);
    return NextResponse.json(
      {
        message:
          error instanceof FormError
            ? error.message
            : "Failed to save product.",
      },
      { status: error instanceof FormError ? error.status : 500 },
    );
  }
}
