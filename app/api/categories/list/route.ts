import { NextResponse } from "next/server";

import { getMainCategoriesDb } from "@/lib/catalog-data-db";

export async function GET() {
  try {
    const categories = await getMainCategoriesDb();
    return NextResponse.json({
      categories: categories.map((category) => ({
        slug: category.slug,
        title: category.title,
      })),
    });
  } catch {
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
