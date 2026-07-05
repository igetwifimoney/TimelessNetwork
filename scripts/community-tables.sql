-- Timeless: Community Tables Migration
-- Run in Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/ljrtlcgukerzhliiwijpl/editor

-- ── Tables ────────────────────────────────────────────────────────────────

create table if not exists community_posts (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users(id),
  avatar      text        not null,
  name        text        not null,
  role        text        default 'Member',
  channel     text        not null,
  content     text        not null,
  is_win      boolean     default false,
  likes       integer     default 0,
  created_at  timestamptz default now()
);

create table if not exists community_replies (
  id          uuid        default gen_random_uuid() primary key,
  post_id     uuid        references community_posts(id) on delete cascade,
  user_id     uuid        references auth.users(id),
  avatar      text        not null,
  name        text        not null,
  content     text        not null,
  likes       integer     default 0,
  created_at  timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────

alter table community_posts   enable row level security;
alter table community_replies enable row level security;

-- ── Policies ──────────────────────────────────────────────────────────────

create policy "Anyone can read posts"
  on community_posts for select using (true);

create policy "Anyone can read replies"
  on community_replies for select using (true);

create policy "Auth users can post"
  on community_posts for insert with check (auth.uid() = user_id);

create policy "Auth users can reply"
  on community_replies for insert with check (auth.uid() = user_id);

create policy "Anyone can update likes"
  on community_posts for update using (true);

create policy "Anyone can update reply likes"
  on community_replies for update using (true);
