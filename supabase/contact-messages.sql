-- Contact messages table

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  message text,
  read_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'contact_messages'
      and column_name = 'details'
  ) then
    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'contact_messages'
        and column_name = 'message'
    ) then
      execute 'alter table public.contact_messages rename column details to message';
    else
      execute 'update public.contact_messages set message = coalesce(message, details)';
      execute 'alter table public.contact_messages drop column details';
    end if;
  end if;
end $$;

alter table public.contact_messages drop column if exists part_number;
alter table public.contact_messages drop column if exists quantity;

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
