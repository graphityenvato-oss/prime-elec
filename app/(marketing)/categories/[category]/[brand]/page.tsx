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
import { SubcategoryPageClient } from "@/components/subcategory-page-client";
import { getBrandCategoryDb } from "@/lib/catalog-data-db";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.category || !resolvedParams?.brand) {
    notFound();
  }

  const result = await getBrandCategoryDb(
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
          {brand.name} <span className="text-primary">&bull;</span>{" "}
          {category.title}
        </h1>

        <SubcategoryPageClient items={items} />
      </div>
    </section>
  );
}
