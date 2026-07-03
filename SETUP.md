# Timeless Network — Setup Guide

## Prerequisites

- Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- A Supabase account ([supabase.com](https://supabase.com))
- A Stripe account ([stripe.com](https://stripe.com)) — can skip for now

---

## Step 1 — Install dependencies

```bash
cd timeless-network
npm install
```

---

## Step 2 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **SQL Editor** → **New Query**
3. Paste the entire contents of `supabase/schema.sql` and click **Run**
4. Go to **Settings** → **API** and copy:
   - `Project URL`
   - `anon public` key

---

## Step 3 — Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can leave the Stripe variables empty for now — those will be needed when you wire up payments.

---

## Step 4 — Enable Google Auth (optional)

In Supabase:
1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Follow the OAuth setup instructions

---

## Step 5 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page.

---

## Project Structure

```
timeless-network/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page
│   │   ├── auth/login/page.tsx   ← Login
│   │   ├── auth/signup/page.tsx  ← Sign up
│   │   ├── dashboard/page.tsx    ← Main dashboard
│   │   ├── courses/page.tsx      ← Courses
│   │   ├── community/page.tsx    ← Community
│   │   ├── mentorship/page.tsx   ← Mentorship
│   │   ├── profile/page.tsx      ← User profile
│   │   └── admin/page.tsx        ← Admin dashboard
│   ├── components/
│   │   └── Sidebar.tsx           ← Shared nav sidebar
│   ├── lib/
│   │   ├── supabase.ts           ← Browser Supabase client
│   │   └── supabase-server.ts    ← Server Supabase client
│   └── middleware.ts             ← Auth route protection
├── supabase/
│   └── schema.sql               ← Full database schema
└── .env.local.example           ← Environment variable template
```

---

## What's Built (Phase 1)

- Landing page with hero, features, community preview, testimonials, and pricing
- Sign up + login with Supabase auth (email/password + Google OAuth)
- Protected routes — unauthenticated users are redirected to login
- Dashboard with daily missions, streak, XP, stats, and community wins
- Courses page with module progress tracking
- Community page with channels and post feed
- Mentorship marketplace
- User profile with badges, XP level, and settings
- Admin dashboard with member table and revenue overview
- Full Supabase database schema (users, courses, community, mentorship, XP, subscriptions)

---

## What's Next (Phase 2 — Gamification)

When you're ready, tell Claude to build:
- XP system wired to real actions
- Daily streak logic
- Leaderboards
- Achievement badges
- Progress tracking across courses

## Phase 3 — AI Features

- AI business coach
- TikTok content analyzer
- Script writer
- Offer generator

## Phase 4 — Stripe Payments

- Subscribe button wired to Stripe Checkout
- Webhook to update `subscriptions` table on payment events
- Plan-gated content
