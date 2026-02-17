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

create table if not exists public.stock_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  category text not null,
  category_image_url text not null,
  category_image_urls text[] not null default '{}'::text[],
  subcategory text not null,
  subcategory_image_url text not null,
  order_no text not null,
  code text not null,
  title text not null,
  description text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  unique (brand, category, subcategory, order_no, code)
);

create index if not exists stock_products_brand_idx
  on public.stock_products (brand);
create index if not exists stock_products_category_idx
  on public.stock_products (category);
create index if not exists stock_products_subcategory_idx
  on public.stock_products (subcategory);

create table if not exists public.quotation_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  project_notes text,
  needs_consultation boolean not null default false,
  cart_items jsonb not null default '[]'::jsonb,
  total_items integer not null default 0,
  total_quantity integer not null default 0,
  read_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create index if not exists quotation_requests_created_at_idx
  on public.quotation_requests (created_at desc);
