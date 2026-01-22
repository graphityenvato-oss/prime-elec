create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  tags text[] not null default '{}',
  featured_image_url text not null default '',
  featured_image_path text not null default '',
  gallery_images jsonb not null default '[]'::jsonb,
  author text not null default '',
  read_time_minutes integer not null default 0,
  status text not null default 'draft',
  published_at timestamptz null,
  scheduled_at timestamptz null,
  body_json jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blogs_slug_idx on public.blogs (slug);
create index if not exists blogs_status_idx on public.blogs (status);
create index if not exists blogs_category_idx on public.blogs (category);
create index if not exists blogs_published_at_idx on public.blogs (published_at desc);

create or replace function public.set_blog_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_blog_updated_at on public.blogs;

create trigger set_blog_updated_at
before update on public.blogs
for each row
execute procedure public.set_blog_updated_at();

  create or replace function public.publish_scheduled_blogs()
  returns void as $$
  begin
    update public.blogs
    set status = 'published',
        published_at = now()
    where status = 'scheduled'
      and scheduled_at is not null
      and scheduled_at <= now();
  end;
  $$ language plpgsql;

  create extension if not exists pg_cron;

  select
    cron.schedule(
      'publish_scheduled_blogs',
      '* * * * *',
      $$select public.publish_scheduled_blogs();$$
    );
