import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IndustriesPageClient } from "@/components/industries-page-client";
import { type CategoryCard } from "@/components/categories-grid";
import { getIndustriesDb } from "@/lib/industries-data-db";

export default async function IndustriesPage() {
  const industries = await getIndustriesDb();
  const cards: CategoryCard[] = industries.map((industry) => ({
    title: industry.title,
    description: industry.description,
    href: `/industries/${industry.slug}`,
    logo: industry.image ?? "/images/placeholder/imageholder.webp",
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
              <BreadcrumbPage>Industries</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-primary">
          Browse Industries
        </h1>

        <IndustriesPageClient industries={cards} />
      </div>
    </section>
  );
}
