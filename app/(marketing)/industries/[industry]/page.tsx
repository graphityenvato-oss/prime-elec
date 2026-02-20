import Link from "next/link";
import Image from "next/image";
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
import { getIndustryBySlugDb } from "@/lib/industries-data-db";

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.industry) {
    notFound();
  }

  const industry = await getIndustryBySlugDb(resolvedParams.industry);
  if (!industry) {
    notFound();
  }

  const cards: CategoryCard[] = industry.categories.map((category) => ({
    title: category.title,
    description: category.title,
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
              <BreadcrumbLink asChild>
                <Link href="/industries">Industries</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{industry.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
          <div className="rounded-3xl border border-border/60 bg-muted/10 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Industry Overview
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {industry.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {cards.length} Categories
              </span>
            </div>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {industry.description}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-muted/30 via-muted/10 to-transparent">
            <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            {industry.image ? (
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-[0_22px_44px_rgba(0,0,0,0.16)]">
                <div className="relative h-[340px] w-full sm:h-[420px]">
                  <Image
                    src={industry.image}
                    alt={`${industry.title} image`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-6 text-sm text-muted-foreground">
                No image available for this industry yet.
              </div>
            )}
          </div>
        </div>

        {cards.length ? (
          <div className="mt-10">
            <CategoriesGrid categories={cards} buttonLabel="View Category" />
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
            No categories assigned to this industry yet.
          </div>
        )}
      </div>
    </section>
  );
}
