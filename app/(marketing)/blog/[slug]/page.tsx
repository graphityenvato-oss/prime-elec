import Image from "next/image";
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
  BlogCategoryCard,
  BlogRelatedCard,
  BlogSocialCard,
  BlogTagCloudCard,
} from "@/components/blog-social-card";
import { BlogBody } from "@/components/blog-body";
import { supabaseServer } from "@/lib/supabase/server";
import { Calendar, Clock, MessageCircle, User } from "lucide-react";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }
  const { data: post } = await supabaseServer
    .from("blogs")
    .select(
      "id,title,slug,category,tags,featured_image_url,gallery_images,author,read_time_minutes,published_at,created_at,body_json",
    )
    .eq("slug", resolvedParams.slug)
    .single();

  if (!post) {
    notFound();
  }

  const publishedAt = post.published_at ?? post.created_at ?? null;
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

  const galleryImages = Array.isArray(post.gallery_images)
    ? post.gallery_images
    : [];
  const galleryUrls = galleryImages
    .map((item: { url?: string } | null) => item?.url)
    .filter(Boolean);
  const relatedImages = [post.featured_image_url, ...galleryUrls].filter(
    Boolean,
  );

  const relatedQuery = supabaseServer
    .from("blogs")
    .select("title,slug,featured_image_url,published_at,created_at,category")
    .eq("category", post.category ?? "")
    .neq("id", post.id);

  const relatedTags =
    Array.isArray(post.tags) && post.tags.length ? post.tags : null;

  const { data: relatedPosts } = await (relatedTags
    ? relatedQuery.overlaps("tags", relatedTags)
    : relatedQuery
  )
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(3);

  const relatedItems =
    relatedPosts?.map((item) => {
      const relatedDate = item.published_at ?? item.created_at ?? null;
      return {
        title: item.title,
        date: relatedDate
          ? new Date(relatedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "—",
        image:
          item.featured_image_url || "/images/placeholder/imageholder.webp",
        href: `/blog/${item.slug}`,
      };
    }) ?? [];

  let bodyState = post.body_json ?? null;
  if (typeof bodyState === "string") {
    try {
      bodyState = JSON.parse(bodyState);
    } catch {
      bodyState = null;
    }
  }

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
              <Link href="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
        <article className="rounded-2xl border border-border/60 bg-background p-6">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {post.category ?? "Blog"}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                <span>
                  By{" "}
                  <span className="font-semibold text-foreground">
                    {post.author ?? "PrimeElec Editorial"}
                  </span>
                </span>
              </div>
              <span className="h-4 w-px bg-border/80" />
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span>{formattedDate}</span>
              </div>
              <span className="h-4 w-px bg-border/80" />
              <div className="flex items-center gap-2">
                <MessageCircle className="size-4 text-primary" />
                <span>0 Comments</span>
              </div>
              <span className="h-4 w-px bg-border/80" />
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>{post.read_time_minutes ?? 0} min read</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border/60 bg-background">
              <div className="relative h-80 w-full sm:h-95 lg:h-110">
                <Image
                  src={
                    post.featured_image_url ||
                    "/images/placeholder/imageholder.webp"
                  }
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <BlogBody serializedState={bodyState} />

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-background">
                <div className="relative h-65 w-full sm:h-80 lg:h-90">
                  <Image
                    src={
                      relatedImages[0] ?? "/images/placeholder/imageholder.webp"
                    }
                    alt={`${post.title} featured`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-3xl border border-border/60 bg-background">
                  <div className="relative h-35 w-full sm:h-37.5 lg:h-42.5">
                    <Image
                      src={
                        relatedImages[1] ??
                        "/images/placeholder/imageholder.webp"
                      }
                      alt={`${post.title} supporting 1`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl border border-border/60 bg-background">
                  <div className="relative h-35 w-full sm:h-37.5 lg:h-42.5">
                    <Image
                      src={
                        relatedImages[2] ??
                        "/images/placeholder/imageholder.webp"
                      }
                      alt={`${post.title} supporting 2`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <BlogSocialCard shareTitle={post.title} />
          <BlogCategoryCard />
          <BlogRelatedCard items={relatedItems} />
          <BlogTagCloudCard />
        </aside>
      </div>
    </section>
  );
}
