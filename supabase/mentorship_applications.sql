-- Run this in the Supabase SQL editor
-- Dashboard → SQL Editor → New query → paste → Run

create table if not exists public.mentorship_applications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  experience  text not null,
  revenue     text not null,
  challenge   text not null,
  goals       text not null,
  why_mentor  text not null,
  status      text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'waitlisted'))
);

-- Only service role can read/write (no public access)
alter table public.mentorship_applications enable row level security;

-- Index for admin review sorted by newest
create index on public.mentorship_applications (created_at desc);
create index on public.mentorship_applications (status);
