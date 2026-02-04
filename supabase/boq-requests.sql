-- BOQ requests table

create table if not exists public.boq_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  project_name text,
  notes text,
  file_path text not null,
  file_url text not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create index if not exists boq_requests_created_at_idx
  on public.boq_requests (created_at desc);
