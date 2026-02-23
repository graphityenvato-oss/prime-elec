import { Suspense } from "react";
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
import { CategoriesPageClient } from "@/components/categories-page-client";
import { getMainCategoriesDb } from "@/lib/catalog-data-db";

export default async function CategoriesPage() {
  const categories = await getMainCategoriesDb();
  const cards: CategoryCard[] = categories.map((category) => ({
    title: category.title,
    description: category.description,
    href: `/categories/${category.slug}`,
    logo: category.image ?? "/images/placeholder/imageholder.webp",
  }));

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
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-primary">
          Browse Main Categories
        </h1>

        <Suspense fallback={<div className="mt-10 h-24" />}>
          <CategoriesPageClient categories={cards} />
        </Suspense>
      </div>
    </section>
  );
}
