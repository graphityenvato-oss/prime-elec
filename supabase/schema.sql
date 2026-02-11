-- Categories/Brands/Subcategories schema for Excel import
-- Generated for PrimeElec admin import flow.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  main_image_url text,
  industries text[] not null default '{}'::text[],
  created_at timestamp with time zone not null default now()
);

create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null,
  image_url text not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  slug text not null,
  page_url text not null,
  image_url text not null,
  created_at timestamp with time zone not null default now(),
  unique (category_id, brand_id, slug)
);

create index if not exists subcategories_category_id_idx
  on public.subcategories (category_id);
create index if not exists subcategories_brand_id_idx
  on public.subcategories (brand_id);
