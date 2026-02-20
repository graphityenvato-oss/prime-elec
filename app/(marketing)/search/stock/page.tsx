import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StockSearchResultsClient } from "@/components/stock-search-results-client";
import { performSearch } from "@/lib/search-engine";

type SearchQuery = {
  q?: string;
};

export default async function StockSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchQuery>;
}) {
  const resolved = await searchParams;
  const query = resolved?.q?.trim() ?? "";
  const results = query
    ? await performSearch(query, {
        limitProducts: 1000,
        limitCategories: 0,
        limitSubcategories: 0,
        limitExternal: 0,
      })
    : null;

  const products =
    results?.stockProducts.map((item) => ({
      id: item.id,
      image: item.image,
      title: item.title,
      partNumber: item.partNumber,
      codeNo: item.codeNo,
      brand: item.brand,
      category: item.category,
      description: item.description,
    })) ?? [];

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
              <Link href="/search">Search</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>In Stock Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        In Stock Products
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {query
          ? `${results?.totals.stockProducts ?? products.length} results for "${query}".`
          : "Type in search to view stock products."}
      </p>

      {query && products.length ? (
        <StockSearchResultsClient products={products} />
      ) : (
        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {query
            ? `No in-stock products found for "${query}".`
            : "No search query provided."}
        </div>
      )}
    </section>
  );
}
