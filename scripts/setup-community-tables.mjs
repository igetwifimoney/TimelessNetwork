/**
 * setup-community-tables.mjs
 * Run once from your project root to create the community_posts and community_replies tables.
 *
 * Usage (from timeless-network/):
 *   node scripts/setup-community-tables.mjs
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// ── Load env vars from .env.local ──────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync('.env.local', 'utf8')
    const env = {}
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
    }
    return env
  } catch {
    console.error('❌  Could not read .env.local — run this script from the timeless-network/ directory')
    process.exit(1)
  }
}

const env = loadEnv()
const SUPABASE_URL        = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY    = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ── SQL statements ─────────────────────────────────────────────────────────
const STEPS = [
  {
    name: 'Create community_posts table',
    sql: `
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
    `,
  },
  {
    name: 'Create community_replies table',
    sql: `
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
    `,
  },
  {
    name: 'Enable RLS on community_posts',
    sql: `alter table community_posts enable row level security;`,
  },
  {
    name: 'Enable RLS on community_replies',
    sql: `alter table community_replies enable row level security;`,
  },
  {
    name: 'Policy: anyone can read posts',
    sql: `
      do $$ begin
        if not exists (
          select 1 from pg_policies where tablename = 'community_posts' and policyname = 'Anyone can read posts'
        ) then
          create policy "Anyone can read posts" on community_posts for select using (true);
        end if;
      end $$;
    `,
  },
  {
    name: 'Policy: anyone can read replies',
    sql: `
      do $$ begin
        if not exists (
          select 1 from pg_policies where tablename = 'community_replies' and policyname = 'Anyone can read replies'
        ) then
          create policy "Anyone can read replies" on community_replies for select using (true);
        end if;
      end $$;
    `,
  },
  {
    name: 'Policy: auth users can post',
    sql: `
      do $$ begin
        if not exists (
          select 1 from pg_policies where tablename = 'community_posts' and policyname = 'Auth users can post'
        ) then
          create policy "Auth users can post" on community_posts for insert with check (auth.uid() = user_id);
        end if;
      end $$;
    `,
  },
  {
    name: 'Policy: auth users can reply',
    sql: `
      do $$ begin
        if not exists (
          select 1 from pg_policies where tablename = 'community_replies' and policyname = 'Auth users can reply'
        ) then
          create policy "Auth users can reply" on community_replies for insert with check (auth.uid() = user_id);
        end if;
      end $$;
    `,
  },
  {
    name: 'Policy: anyone can update post likes',
    sql: `
      do $$ begin
        if not exists (
          select 1 from pg_policies where tablename = 'community_posts' and policyname = 'Anyone can update likes'
        ) then
          create policy "Anyone can update likes" on community_posts for update using (true);
        end if;
      end $$;
    `,
  },
  {
    name: 'Policy: anyone can update reply likes',
    sql: `
      do $$ begin
        if not exists (
          select 1 from pg_policies where tablename = 'community_replies' and policyname = 'Anyone can update reply likes'
        ) then
          create policy "Anyone can update reply likes" on community_replies for update using (true);
        end if;
      end $$;
    `,
  },
]

// ── Run ────────────────────────────────────────────────────────────────────
console.log('\n🚀  Setting up Timeless community tables...\n')

for (const step of STEPS) {
  process.stdout.write(`  ⏳  ${step.name}...`)
  const { error } = await supabase.rpc('exec_sql', { sql: step.sql }).catch(() => ({ error: { message: 'rpc not available' } }))

  // Fallback: try direct REST query endpoint
  if (error) {
    // Try the pg endpoint directly
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        apikey:          SERVICE_ROLE_KEY,
        Authorization:  `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({ query: step.sql }),
    }).catch(() => null)

    if (!res || !res.ok) {
      process.stdout.write(` ⚠️  (needs manual run — see below)\n`)
      continue
    }
  }

  process.stdout.write(` ✅\n`)
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If any steps showed ⚠️, run the SQL manually:
  1. Go to https://supabase.com/dashboard/project/ljrtlcgukerzhliiwijpl/editor
  2. Paste the contents of scripts/community-tables.sql
  3. Click Run
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
