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
import { type CategoryCard } from "@/components/categories-grid";
import { CategoryBrandsPageClient } from "@/components/category-brands-page-client";
import { getMainCategoryBySlugDb } from "@/lib/catalog-data-db";

export default async function CategoryBrandsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.category) {
    notFound();
  }

  const category = await getMainCategoryBySlugDb(resolvedParams.category);
  if (!category) {
    notFound();
  }

  const cards: CategoryCard[] = category.brands.map((brand) => ({
    title: brand.name,
    description: `${brand.name} offerings in ${category.title}.`,
    href: `/categories/${category.slug}/${brand.key}`,
    logo: brand.logo ?? "/images/placeholder/imageholder.webp",
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
              <BreadcrumbLink asChild>
                <Link href="/categories">Categories</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {category.title} Brands
        </h1>
        {category.image ? (
          <div className="mt-4 flex items-center gap-4">
            <Image
              src={category.image}
              alt={`${category.title} main`}
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl object-contain"
            />
            <div className="text-sm text-muted-foreground">
              {category.description}
            </div>
          </div>
        ) : category.description ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {category.description}
          </p>
        ) : null}

        <CategoryBrandsPageClient brands={cards} />
      </div>
    </section>
  );
}
