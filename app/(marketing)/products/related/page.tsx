import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RelatedProductsResultsClient } from "@/components/related-products-results-client";
import {
  getProductById as getFallbackProductById,
  products as fallbackProducts,
} from "@/lib/products";
import {
  getStockProductByIdDb,
  getStockProductsDb,
} from "@/lib/stock-products-db";

type RelatedProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    exclude?: string;
  }>;
};

export default async function RelatedProductsPage({
  searchParams,
}: RelatedProductsPageProps) {
  const resolved = await searchParams;
  const category = resolved.category?.trim() ?? "";
  const subcategory = resolved.subcategory?.trim() ?? "";
  const exclude = resolved.exclude?.trim() ?? "";

  let heading = "Related products";

  if (exclude) {
    const current =
      (await getStockProductByIdDb(exclude)) ?? getFallbackProductById(exclude);
    if (current?.title) {
      heading = `Related products for ${current.title}`;
    }
  }

  const dbProducts = await getStockProductsDb();
  const products = dbProducts.length ? dbProducts : fallbackProducts;

  const filtered = products.filter((item) => {
    if (exclude && item.id === exclude) return false;
    if (category && item.category !== category) return false;
    if (subcategory && item.subcategory !== subcategory) return false;
    return true;
  });

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
            <BreadcrumbPage>Related products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {heading}
        </h1>
        {category ? (
          <p className="text-sm text-muted-foreground">
            {category}
            {subcategory ? ` / ${subcategory}` : ""}
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <RelatedProductsResultsClient products={filtered} />
      </div>
    </section>
  );
}
