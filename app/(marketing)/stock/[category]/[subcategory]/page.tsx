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
import { StockSubcategoryProductsClient } from "@/components/stock-subcategory-products-client";
import { products as fallbackProducts } from "@/lib/products";
import {
  getStockBrowseRowsDb,
  mapRowsToProducts,
  toStockSegment,
} from "@/lib/stock-products-db";

export default async function StockSubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const resolvedParams = await params;
  const categorySegment = resolvedParams?.category;
  const subcategorySegment = resolvedParams?.subcategory;
  if (!categorySegment || !subcategorySegment) {
    notFound();
  }

  const rows = await getStockBrowseRowsDb();
  const hasDbRows = rows.length > 0;

  if (!hasDbRows) {
    const categoryName = fallbackProducts.find(
      (item) => toStockSegment(item.category) === categorySegment,
    )?.category;
    if (!categoryName) {
      notFound();
    }
    if (subcategorySegment !== "general") {
      notFound();
    }

    const products = fallbackProducts.filter(
      (item) => item.category === categoryName,
    );
    if (!products.length) {
      notFound();
    }

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
              <BreadcrumbLink asChild>
                <Link href="/stock">Stock</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/stock/${categorySegment}`}>{categoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>General</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {categoryName} Products
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {products.length} products in this subcategory.
        </p>

        <StockSubcategoryProductsClient products={products} />
      </section>
    );
  }

  const filteredRows = rows.filter(
    (row) =>
      toStockSegment(row.category) === categorySegment &&
      toStockSegment(row.subcategory) === subcategorySegment,
  );

  if (!filteredRows.length) {
    notFound();
  }

  const categoryName = filteredRows[0]?.category ?? "Category";
  const subcategoryName = filteredRows[0]?.subcategory ?? "Subcategory";
  const products = mapRowsToProducts(filteredRows);

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
            <BreadcrumbLink asChild>
              <Link href="/stock">Stock</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/stock/${categorySegment}`}>{categoryName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{subcategoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        {subcategoryName} Products
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {products.length} products in this subcategory.
      </p>

      <StockSubcategoryProductsClient products={products} />
    </section>
  );
}
