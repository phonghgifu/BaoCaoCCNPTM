-- UPGRADE SCHEMA PROPOSAL
-- Mục tiêu: hỗ trợ admin/editor/user, thumbnail, tag, search và dashboard thống kê.

alter table public.profiles
  add column if not exists role text not null default 'user';

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'user'));

alter table public.posts
  add column if not exists tags text[] not null default array[]::text[],
  add column if not exists thumbnail_url text,
  add column if not exists search_text tsvector;

create index if not exists posts_tags_gin_idx on public.posts using gin(tags);
create index if not exists posts_search_text_idx on public.posts using gin(search_text);

create or replace function public.posts_search_text_trigger()
returns trigger
language plpgsql
as $$
begin
  new.search_text :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.content, '')), 'C') ||
    setweight(to_tsvector('simple', array_to_string(coalesce(new.tags, array[]::text[]), ' ')), 'D');
  return new;
end;
$$;

drop trigger if exists posts_search_text_on_write on public.posts;

create trigger posts_search_text_on_write
before insert or update on public.posts
for each row execute procedure public.posts_search_text_trigger();

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('avatar', 'thumbnail', 'cover', 'attachment')),
  storage_bucket text not null,
  storage_path text not null,
  public_url text,
  created_at timestamptz not null default now()
);

create index if not exists media_assets_owner_id_idx on public.media_assets(owner_id);

alter table public.media_assets enable row level security;

drop policy if exists "Media assets are viewable by owner" on public.media_assets;
drop policy if exists "Media assets are manageable by owner" on public.media_assets;

create policy "Media assets are viewable by owner"
on public.media_assets for select
using (auth.uid() = owner_id or exists (
  select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
));

create policy "Media assets are manageable by owner"
on public.media_assets for all
using (auth.uid() = owner_id or exists (
  select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
))
with check (auth.uid() = owner_id or exists (
  select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
));
