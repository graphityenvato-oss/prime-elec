import { NextResponse } from "next/server";

import {
  getCategoryPreviewImage,
  getStockBrowseRowsDb,
  toStockSegment,
} from "@/lib/stock-products-db";

export async function GET() {
  try {
    const rows = await getStockBrowseRowsDb();
    const categoryMap = new Map<
      string,
      {
        slug: string;
        title: string;
        image: string;
        products: number;
      }
    >();

    rows.forEach((row) => {
      const key = row.category.trim().toLowerCase();
      const existing = categoryMap.get(key);
      if (existing) {
        existing.products += 1;
        return;
      }
      categoryMap.set(key, {
        slug: toStockSegment(row.category),
        title: row.category,
        image: getCategoryPreviewImage(row),
        products: 1,
      });
    });

    const categories = Array.from(categoryMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );

    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ categories: [] }, { status: 200 });
  }
}
