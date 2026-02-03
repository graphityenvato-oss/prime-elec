import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SearchInput } from "@/components/search-input";
import { HoverCard } from "@/components/hover-card";
import { getBrandCategory } from "@/lib/catalog-data";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.category || !resolvedParams?.brand) {
    notFound();
  }

  const result = getBrandCategory(
    resolvedParams.brand.toLowerCase(),
    resolvedParams.category.toLowerCase(),
  );
  if (!result) {
    notFound();
  }

  const { brand, category } = result;
  const items = category.subcategories ?? [];

  return (
    <section className="relative left-1/2 right-1/2 w-screen -mx-[50vw] bg-white py-14 text-foreground dark:bg-[#0b1118] dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Breadcrumb className="text-foreground/70 dark:text-white/70">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/categories">Categories</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/categories/${resolvedParams.category}`}>
                  {category.title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{brand.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {brand.name} <span className="text-primary">&bull;</span> {category.title}
        </h1>

        <div className="mt-4 max-w-md">
          <SearchInput placeholder="Search subcategories" />
        </div>

        {items.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <HoverCard
                key={item.title}
                className="h-55 p-4 text-foreground dark:text-white sm:h-50 sm:p-6"
                contentClassName="flex h-full flex-col justify-between"
              >
                <div className="h-14 w-32 sm:h-16 sm:w-36">
                  <Image
                    src={item.image ?? "/images/placeholder/imageholder.webp"}
                    alt={`${item.title} product`}
                    width={180}
                    height={120}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  {item.subtitle ? (
                    <p className="mt-2 text-sm text-foreground/70 dark:text-white/70">
                      {item.subtitle}
                    </p>
                  ) : null}
                </div>
              </HoverCard>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
            No subcategories available for this brand and category yet.
          </div>
        )}
      </div>
    </section>
  );
}


