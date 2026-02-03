import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PrimeCard } from "@/components/ui/prime-card";
import { supabaseServer } from "@/lib/supabase/server";

type BlogQuery = {
  category?: string;
  page?: string;
};

const PAGE_SIZE = 9;

const getPageItems = (totalPages: number, currentPage: number) => {
  const items: Array<number | "ellipsis"> = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) items.push(i);
    return items;
  }

  items.push(1);

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) items.push("ellipsis");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);
  return items;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<BlogQuery>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = resolvedSearchParams?.category?.trim() || "";
  const requestedPage = Number(resolvedSearchParams?.page ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  let query = supabaseServer
    .from("blogs")
    .select(
      "title,slug,featured_image_url,category,tags,published_at,created_at,read_time_minutes,author",
      { count: "exact" },
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (categoryFilter) {
    query = query.eq("category", categoryFilter);
  }

  const rangeStart = (currentPage - 1) * PAGE_SIZE;
  const rangeEnd = rangeStart + PAGE_SIZE - 1;
  const { data, count } = await query.range(rangeStart, rangeEnd);
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (categoryFilter) {
      params.set("category", categoryFilter);
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    const queryString = params.toString();
    const base = queryString ? `/blog?${queryString}` : "/blog";
    return `${base}#top`;
  };

  const posts = (data ?? []).map((post) => {
    const dateValue = post.published_at ?? post.created_at ?? null;
    return {
      title: post.title,
      slug: post.slug,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags : [],
      image: post.featured_image_url || "/images/placeholder/imageholder.webp",
      date: dateValue
        ? new Date(dateValue).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "",
      readTimeMinutes: post.read_time_minutes ?? null,
      author: post.author ?? "Prime Elec Editorial",
    };
  });

  return (
    <>
      <section id="top" className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Prime News
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary">
            Insights, launches, and engineering updates.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Stay up to date with product highlights, installation guidance, and
            project stories from the Prime Elec team.
          </p>
        </Reveal>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{posts.length} posts</span>
            {categoryFilter ? (
              <>
                <span className="text-muted-foreground/60">•</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/80">
                  <Tag className="size-3 text-primary" />
                  {categoryFilter}
                </span>
              </>
            ) : null}
          </div>
          {categoryFilter ? (
            <Button variant="outline" className="rounded-full px-4" asChild>
              <Link href="/blog">Clear filter</Link>
            </Button>
          ) : null}
        </div>

        {posts.length ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.06} className="h-full">
                <PrimeCard className="flex h-full flex-col rounded-3xl p-4">
                  <div className="relative h-48 overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                    {post.date ? (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3 text-primary" />
                        {post.date}
                      </span>
                    ) : null}
                    {post.readTimeMinutes ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3 text-primary" />
                        {post.readTimeMinutes} min
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    By {post.author}
                  </p>
                  {post.tags.length ? (
                    <div className="mt-3 flex flex-wrap gap-2 pb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80"
                        >
                          <Tag className="size-3 text-primary" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <Button
                    variant="secondary"
                    className="mt-auto rounded-full px-4 text-xs"
                    asChild
                  >
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </PrimeCard>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border/60 bg-muted/10 p-6 text-sm text-muted-foreground">
            No blog posts available yet.
          </div>
        )}

        {totalPages > 1 ? (
          <Pagination className="mt-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={buildPageHref(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>

              {getPageItems(totalPages, currentPage).map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href={buildPageHref(item)}
                      isActive={item === currentPage}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href={buildPageHref(Math.min(totalPages, currentPage + 1))}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </section>
    </>
  );
}
