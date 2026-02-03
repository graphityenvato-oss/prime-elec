import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { PrimeCard } from "@/components/ui/prime-card";
import { supabaseServer } from "@/lib/supabase/server";

export async function EvcsNews() {
  const { data } = await supabaseServer
    .from("home_news")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const content = data
    ? {
        title: data.title,
        buttonLabel: data.button_label,
        buttonHref: data.button_href || "/blog",
      }
    : {
        title: "Prime News",
        buttonLabel: "All Blog Posts",
        buttonHref: "/blog",
      };

  const { data: blogPosts } = await supabaseServer
    .from("blogs")
    .select(
      "title,slug,featured_image_url,category,tags,published_at,created_at,read_time_minutes",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(3);

  const posts = (blogPosts ?? []).map((post) => {
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
    };
  });

  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-linear-to-br from-muted/40 via-background to-background px-6 py-10 text-foreground shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-primary">
            {content.title}
          </h2>
        </Reveal>
        <Button
          className="w-fit rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <a href={content.buttonHref}>{content.buttonLabel}</a>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.08} className="h-full">
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
              <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug">
                {post.title}
              </h3>
              {post.tags.length ? (
                <div className="mt-2 flex flex-wrap gap-2 pb-4">
                  {post.tags.slice(0, 2).map((tag) => (
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
                variant="outline"
                className="mt-auto rounded-full px-4 text-xs"
                asChild
              >
                <a href={`/blog/${post.slug}`}>Read More</a>
              </Button>
            </PrimeCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
