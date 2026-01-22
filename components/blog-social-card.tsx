"use client";

import { useMemo } from "react";
import { Calendar, CircleArrowRight } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import Image from "next/image";

const socialLinks = [
  { label: "Instagram", key: "instagram" },
  { label: "Facebook", key: "facebook" },
  { label: "X / Twitter", key: "x" },
  { label: "YouTube", key: "youtube" },
  { label: "Pinterest", key: "pinterest" },
  { label: "LinkedIn", key: "linkedin" },
];

const getShareUrl = (platform: string, url: string, title: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "x":
      return `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "pinterest":
      return `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
    case "instagram":
      return `https://www.instagram.com/?url=${encodedUrl}`;
    case "youtube":
      return `https://www.youtube.com/share?url=${encodedUrl}`;
    default:
      return url;
  }
};

export function BlogSocialCard({ shareTitle }: { shareTitle?: string }) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const pageTitle =
    shareTitle ?? (typeof document !== "undefined" ? document.title : "");

  const shareLinks = useMemo(
    () =>
      socialLinks.map((social) => ({
        label: social.label,
        url: getShareUrl(social.key, shareUrl, pageTitle),
      })),
    [pageTitle, shareUrl],
  );

  return (
    <div className="rounded-2xl border border-border/60 bg-background p-6">
      <h2 className="text-lg font-semibold">Social Network</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {shareLinks.map((social) => (
          <div
            key={social.label}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/10 p-3 text-xs font-semibold text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <SocialIcon
              url={social.url}
              style={{ height: 34, width: 34 }}
              aria-label={social.label}
              className="block"
              target="_blank"
              rel="noreferrer"
            />
            <span>{social.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const categoryLinks = [
  { label: "Power Systems", href: "/blog?category=power-systems" },
  { label: "Automation", href: "/blog?category=automation" },
  { label: "Design", href: "/blog?category=design" },
  { label: "Safety", href: "/blog?category=safety" },
  { label: "Sustainability", href: "/blog?category=sustainability" },
  { label: "Maintenance", href: "/blog?category=maintenance" },
];

export function BlogCategoryCard() {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-6">
      <h2 className="text-lg font-semibold">Category</h2>
      <div className="mt-4 space-y-3 text-sm text-foreground/80">
        {categoryLinks.map((category) => (
          <a
            key={category.label}
            href={category.href}
            className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/10 px-4 py-3 font-semibold transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <span>{category.label}</span>
            <CircleArrowRight className="text-foreground/20" />
          </a>
        ))}
      </div>
    </div>
  );
}

export type RelatedBlog = {
  title: string;
  date: string;
  image: string;
  href: string;
};

const relatedBlogs: RelatedBlog[] = [
  {
    title: "Industrial Power Upgrades That Reduce Downtime",
    date: "Jan 05, 2026",
    image: "/images/placeholder/imageholder.webp",
    href: "/blog/industrial-power-upgrades",
  },
  {
    title: "Smart Switchgear Monitoring for Predictive Maintenance",
    date: "Dec 19, 2025",
    image: "/images/placeholder/imageholder.webp",
    href: "/blog/smart-switchgear-monitoring",
  },
  {
    title: "Panel Design Best Practices for Safer Installations",
    date: "Nov 11, 2025",
    image: "/images/placeholder/imageholder.webp",
    href: "/blog/panel-design-best-practices",
  },
];

export function BlogRelatedCard({ items }: { items?: RelatedBlog[] }) {
  const list = items && items.length ? items : relatedBlogs;
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-6">
      <h2 className="text-lg font-semibold">Related blogs</h2>
      <div className="mt-4 space-y-4">
        {list.map((blog) => (
          <a
            key={blog.title}
            href={blog.href}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/10 p-3 transition-colors hover:border-primary/40"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted/20">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground line-clamp-2">
                {blog.title}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3 text-primary" />
                {blog.date}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

const tagItems = [
  "Power Systems",
  "Automation",
  "Design",
  "Safety",
  "Maintenance",
  "Lighting",
  "Controls",
  "Project Planning",
  "Switchgear",
];

export function BlogTagCloudCard() {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-6">
      <h2 className="text-lg font-semibold">Tag cloud</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {tagItems.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border/60 bg-muted/10 px-3 py-1 text-xs font-semibold text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
