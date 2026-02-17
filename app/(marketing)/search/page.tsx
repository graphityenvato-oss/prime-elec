import Link from "next/link";
import Image from "next/image";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { performSearch } from "@/lib/search-engine";

type SearchQuery = {
  q?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchQuery>;
}) {
  const resolved = await searchParams;
  const query = resolved?.q?.trim() ?? "";
  const results = query
    ? await performSearch(query, {
        limitProducts: 60,
        limitCategories: 30,
        limitSubcategories: 30,
        limitExternal: 60,
      })
    : null;

  const hasAnyResults = Boolean(
    results &&
    (results.stockProducts.length ||
      results.stockCategories.length ||
      results.stockSubcategories.length ||
      results.external.length),
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
            <BreadcrumbPage>Search</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        Search
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {query
          ? `Showing results for "${query}".`
          : "Type in the header search box to find products, categories, subcategories, and external catalog links."}
      </p>

      {query && !hasAnyResults ? (
        <div className="mt-8 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
          {`No results found for "${query}".`}
        </div>
      ) : null}

      {results?.stockProducts.length ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">In Stock Products</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.stockProducts.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4 hover:border-primary/40"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.brand} • {item.category} • {item.subcategory}
                  </p>
                  <p className="mt-1 text-xs text-primary">
                    Code No. {item.partNumber}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {results?.stockCategories.length ? (
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Stock Categories</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.stockCategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4 hover:border-primary/40"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {results?.stockSubcategories.length ? (
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Stock Subcategories</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.stockSubcategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4 hover:border-primary/40"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {results?.external.length ? (
        <div className="mt-10">
          <h2 className="text-xl font-semibold">External Catalog Matches</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.external.map((item, index) => (
              <a
                key={`${item.pageUrl}-${index}`}
                href={item.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border/60 bg-background p-4 hover:border-primary/40"
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.brand} • {item.category}
                </p>
                <p className="mt-1 text-xs text-primary">Open external page</p>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
