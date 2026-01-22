export type BlogPost = {
  slug: string;
  title: string;
  tag: string;
  image: string;
  author: string;
  date: string;
  comments: number;
  readMinutes: number;
  excerpt: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [];

export const getBlogBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
