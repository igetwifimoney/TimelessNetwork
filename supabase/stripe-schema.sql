-- ============================================================
-- Stripe integration schema for Timeless
-- Run in Supabase SQL Editor after your base schema
-- ============================================================

-- Maps Supabase users to Stripe customer IDs
create table if not exists stripe_customers (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  customer_id text unique not null,
  created_at  timestamptz default now()
);

-- Subscription records — synced from Stripe webhooks
create table if not exists subscriptions (
  id                   text primary key,           -- Stripe subscription ID
  user_id              uuid not null references auth.users(id) on delete cascade,
  status               text not null,              -- active | canceled | past_due | trialing | incomplete | ...
  stripe_price_id      text not null,
  stripe_product_id    text not null,
  product_key          text not null,              -- matches key in PRODUCT_CATALOG (e.g. TIMELESS_MONTHLY)
  current_period_start timestamptz,
  current_period_end   timestamptz,
  cancel_at_period_end boolean default false,
  canceled_at          timestamptz,
  trial_end            timestamptz,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- One-time purchase records — synced from Stripe webhooks
create table if not exists purchases (
  id                text primary key,              -- Stripe checkout session ID
  user_id           uuid not null references auth.users(id) on delete cascade,
  stripe_price_id   text not null,
  stripe_product_id text not null,
  product_key       text not null,
  amount_total      integer,                       -- in cents
  currency          text default 'usd',
  status            text not null,                 -- complete | expired
  created_at        timestamptz default now()
);

-- ── Row Level Security ──────────────────────────────────────

alter table stripe_customers enable row level security;
alter table subscriptions    enable row level security;
alter table purchases        enable row level security;

-- Users can read their own records
create policy "Users read own customer record" on stripe_customers
  for select using (auth.uid() = user_id);

create policy "Users read own subscriptions" on subscriptions
  for select using (auth.uid() = user_id);

create policy "Users read own purchases" on purchases
  for select using (auth.uid() = user_id);

-- Service role has full access (used by webhook handler)
create policy "Service role full access — customers" on stripe_customers
  for all using (auth.role() = 'service_role');

create policy "Service role full access — subscriptions" on subscriptions
  for all using (auth.role() = 'service_role');

create policy "Service role full access — purchases" on purchases
  for all using (auth.role() = 'service_role');

-- ── Indexes ─────────────────────────────────────────────────

create index if not exists subscriptions_user_id_idx    on subscriptions(user_id);
create index if not exists subscriptions_status_idx     on subscriptions(status);
create index if not exists purchases_user_id_idx        on purchases(user_id);
create index if not exists stripe_customers_cust_id_idx on stripe_customers(customer_id);

-- ── Helper: get active product keys for a user ───────────────
-- Optional — useful for server-side access checks without hitting JS
create or replace function get_user_product_keys(p_user_id uuid)
returns setof text
language sql
security definer
as $$
  select product_key from subscriptions
  where user_id = p_user_id
    and status in ('active', 'trialing', 'past_due')
  union
  select product_key from purchases
  where user_id = p_user_id
    and status = 'complete';
$$;
