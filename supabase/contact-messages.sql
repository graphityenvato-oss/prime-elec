-- Contact messages table

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  part_number text,
  quantity text,
  details text,
  read_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
