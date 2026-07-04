-- ══════════════════════════════════════════════════════════════
-- Timeless Network — Full Schema
-- Run this in Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- ── User Profiles (XP, streaks, rank) ────────────────────────
create table if not exists public.user_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  avatar_url      text,
  xp              integer not null default 0,
  streak_count    integer not null default 0,
  last_login_date date,
  created_at      timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can view all profiles"
  on public.user_profiles for select using (true);

create policy "Users can update own profile"
  on public.user_profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Course Progress ───────────────────────────────────────────
create table if not exists public.course_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.user_profiles(id) on delete cascade,
  course_slug  text not null,
  lesson_slug  text not null,
  completed_at timestamptz not null default now(),
  xp_awarded   integer not null default 0,
  unique(user_id, course_slug, lesson_slug)
);

alter table public.course_progress enable row level security;

create policy "Users can view own progress"
  on public.course_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.course_progress for insert with check (auth.uid() = user_id);

-- ── Subscriptions (Stripe) ────────────────────────────────────
create table if not exists public.subscriptions (
  id                    text primary key,
  user_id               uuid references public.user_profiles(id) on delete cascade,
  status                text,
  product_key           text,
  current_period_end    timestamptz,
  cancel_at_period_end  boolean default false,
  created_at            timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);

-- ── Purchases (Stripe) ────────────────────────────────────────
create table if not exists public.purchases (
  id           text primary key,
  user_id      uuid references public.user_profiles(id) on delete cascade,
  product_key  text,
  amount_total integer,
  currency     text,
  created_at   timestamptz default now()
);

alter table public.purchases enable row level security;

create policy "Users can view own purchases"
  on public.purchases for select using (auth.uid() = user_id);

-- ── Leaderboard View ──────────────────────────────────────────
create or replace view public.leaderboard as
  select
    id,
    full_name,
    avatar_url,
    xp,
    streak_count,
    rank() over (order by xp desc) as rank
  from public.user_profiles
  order by xp desc
  limit 100;

-- ── Community Posts ───────────────────────────────────────────
create table if not exists public.community_posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.user_profiles(id) on delete cascade,
  content    text not null,
  likes      integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

create policy "Anyone can read posts"
  on public.community_posts for select using (true);

create policy "Users can insert own posts"
  on public.community_posts for insert with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.community_posts for update using (auth.uid() = user_id);

-- ── increment_xp RPC function ─────────────────────────────────
-- Called by /api/progress when a lesson is completed
-- Uses security definer so it can bypass RLS for the atomic update
create or replace function public.increment_xp(user_id_arg uuid, xp_amount integer)
returns void language plpgsql security definer as $$
begin
  update public.user_profiles
  set xp = xp + xp_amount
  where id = user_id_arg;
end;
$$;

