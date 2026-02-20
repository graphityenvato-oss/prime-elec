import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type CategoryCard } from "@/components/categories-grid";
import { StockSubcategoriesPageClient } from "@/components/stock-subcategories-page-client";
import { products as fallbackProducts } from "@/lib/products";
import {
  getStockBrowseRowsDb,
  resolveRowImage,
  toStockSegment,
} from "@/lib/stock-products-db";

export default async function StockCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const segment = resolvedParams?.category;
  if (!segment) {
    notFound();
  }

  const rows = await getStockBrowseRowsDb();
  const hasDbRows = rows.length > 0;

  const matchedRows = hasDbRows
    ? rows.filter((row) => toStockSegment(row.category) === segment)
    : [];

  if (!hasDbRows) {
    const fallbackCategory = fallbackProducts.find(
      (item) => toStockSegment(item.category) === segment,
    )?.category;
    if (!fallbackCategory) {
      notFound();
    }

    const productsCount = fallbackProducts.filter(
      (item) => item.category === fallbackCategory,
    ).length;

    const cards: CategoryCard[] = [
      {
        title: "General",
        description: `${productsCount} products`,
        href: `/stock/${segment}/general`,
        logo:
          fallbackProducts.find((item) => item.category === fallbackCategory)
            ?.image ?? "/images/placeholder/imageholder.webp",
      },
    ];

    return (
      <section className="py-10 sm:py-14">
        <Breadcrumb className="text-foreground/70">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/stock">Stock</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{fallbackCategory}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {fallbackCategory} Subcategories
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a subcategory to view available products.
        </p>

        <StockSubcategoriesPageClient cards={cards} />
      </section>
    );
  }

  if (!matchedRows.length) {
    notFound();
  }

  const categoryName = matchedRows[0]?.category ?? "Category";
  const subcategoryMap = new Map<
    string,
    { name: string; images: string[]; productsCount: number }
  >();

  matchedRows.forEach((row) => {
    const key = row.subcategory.trim().toLowerCase();
    const rowImage = resolveRowImage(row.subcategory_image_url);
    const existing = subcategoryMap.get(key);
    if (existing) {
      existing.productsCount += 1;
      if (!existing.images.includes(rowImage)) {
        existing.images.push(rowImage);
      }
      return;
    }
    subcategoryMap.set(key, {
      name: row.subcategory,
      images: [rowImage],
      productsCount: 1,
    });
  });

  const cards: CategoryCard[] = Array.from(subcategoryMap.values()).map(
    (item) => ({
      title: item.name,
      description: `${item.productsCount} products`,
      href: `/stock/${segment}/${toStockSegment(item.name)}`,
      logo: item.images[0] ?? "/images/placeholder/imageholder.webp",
      logoSlides: item.images,
    }),
  );

  return (
    <section className="py-10 sm:py-14">
      <Breadcrumb className="text-foreground/70">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/stock">Stock</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{categoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        {categoryName} Subcategories
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Select a subcategory to view available products.
      </p>

      <StockSubcategoriesPageClient cards={cards} />
    </section>
  );
}
