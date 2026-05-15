-- PROJECTS AND LIKES SCHEMA

-- Drop existing tables if they exist
drop table if exists public.project_likes cascade;
drop table if exists public.projects cascade;

-- Create projects table
create table public.projects (
  id serial primary key,
  title text not null,
  description text,
  technologies text[] default array[]::text[],
  image text,
  link text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

comment on table public.projects is 'Portfolio projects';

-- Create project_likes table
create table public.project_likes (
  id uuid default gen_random_uuid() not null primary key,
  project_id integer not null references public.projects on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  created_at timestamp with time zone default now() not null,
  unique(project_id, user_id)
);

comment on table public.project_likes is 'Likes on portfolio projects';

-- Create indexes
create index projects_created_at_idx on public.projects (created_at desc);
create index project_likes_project_id_idx on public.project_likes (project_id);
create index project_likes_user_id_idx on public.project_likes (user_id);
create index project_likes_created_at_idx on public.project_likes (created_at desc);

-- Create update timestamp trigger for projects
create trigger projects_updated_at before update on public.projects
for each row execute procedure public.update_updated_at();
