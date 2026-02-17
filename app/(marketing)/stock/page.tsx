import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type CategoryCard } from "@/components/categories-grid";
import { StockCategoriesPageClient } from "@/components/stock-categories-page-client";
import { products as fallbackProducts } from "@/lib/products";
import {
  getCategoryPreviewImage,
  getStockBrowseRowsDb,
  toStockSegment,
} from "@/lib/stock-products-db";

export default async function StockPage() {
  const rows = await getStockBrowseRowsDb();

  const categoryMap = new Map<
    string,
    {
      name: string;
      image: string;
      productsCount: number;
      subcategories: Set<string>;
    }
  >();

  if (rows.length) {
    rows.forEach((row) => {
      const key = row.category.trim().toLowerCase();
      const existing = categoryMap.get(key);
      if (existing) {
        existing.productsCount += 1;
        existing.subcategories.add(row.subcategory);
        return;
      }
      categoryMap.set(key, {
        name: row.category,
        image: getCategoryPreviewImage(row),
        productsCount: 1,
        subcategories: new Set([row.subcategory]),
      });
    });
  } else {
    fallbackProducts.forEach((product) => {
      const key = product.category.trim().toLowerCase();
      const existing = categoryMap.get(key);
      if (existing) {
        existing.productsCount += 1;
        existing.subcategories.add("General");
        return;
      }
      categoryMap.set(key, {
        name: product.category,
        image: product.image,
        productsCount: 1,
        subcategories: new Set(["General"]),
      });
    });
  }

  const categories: CategoryCard[] = Array.from(categoryMap.values()).map(
    (category) => ({
      title: category.name,
      description: `${category.subcategories.size} subcategories · ${category.productsCount} products`,
      href: `/stock/${toStockSegment(category.name)}`,
      logo: category.image,
    }),
  );

  return (
    <section id="top" className="py-10 sm:py-14">
      <Breadcrumb className="text-foreground/70">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Stock</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        Stock Categories
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Browse stock by category, then subcategory, then product.
      </p>

      {categories.length ? (
        <StockCategoriesPageClient categories={categories} />
      ) : (
        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          No stock categories found.
        </div>
      )}
    </section>
  );
}
