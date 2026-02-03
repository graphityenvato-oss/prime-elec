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
import {
  CategoriesGrid,
  type CategoryCard,
} from "@/components/categories-grid";
import { SearchInput } from "@/components/search-input";
import { getMainCategoryBySlug } from "@/lib/catalog-data";

export default async function CategoryBrandsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.category) {
    notFound();
  }

  const category = getMainCategoryBySlug(resolvedParams.category);
  if (!category) {
    notFound();
  }

  const cards: CategoryCard[] = category.brands.map((brand) => ({
    title: brand.name,
    description: `${brand.name} offerings in ${category.title}.`,
    href: `/categories/${category.slug}/${brand.key}`,
    logo: brand.logo,
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

        <div className="mt-4 max-w-md">
          <SearchInput placeholder="Search brands" />
        </div>

        <CategoriesGrid categories={cards} buttonLabel="View Subcategories" />
      </div>
    </section>
  );
}
