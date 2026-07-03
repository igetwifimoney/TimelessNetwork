-- ============================================================
-- Timeless Network — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with app-specific data
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  tiktok_handle TEXT,
  niche         TEXT,
  bio           TEXT,
  xp            INTEGER DEFAULT 0,
  streak        INTEGER DEFAULT 0,
  last_active   DATE DEFAULT CURRENT_DATE,
  plan          TEXT DEFAULT 'free' CHECK (plan IN ('free', 'monthly', 'annual')),
  is_admin      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SUBSCRIPTIONS
-- Tracks Stripe subscription state
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id   TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan                 TEXT CHECK (plan IN ('monthly', 'annual')),
  status               TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COURSES & LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  thumbnail   TEXT,
  position    INTEGER DEFAULT 0,
  published   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  video_url   TEXT,
  duration    INTEGER, -- in seconds
  position    INTEGER DEFAULT 0,
  published   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks which lessons a user has completed
CREATE TABLE IF NOT EXISTS lesson_completions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id   UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

-- ============================================================
-- COMMUNITY POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS community_posts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel    TEXT DEFAULT 'general',
  content    TEXT NOT NULL,
  is_win     BOOLEAN DEFAULT FALSE,
  likes      INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MENTORSHIP
-- ============================================================
CREATE TABLE IF NOT EXISTS mentors (
  id          UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialty   TEXT,
  bio         TEXT,
  price       INTEGER, -- USD per session
  available   BOOLEAN DEFAULT TRUE,
  revenue     TEXT,    -- display string e.g. "$50k/mo"
  rating      DECIMAL(3,2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  tags        TEXT[]
);

CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id    UUID REFERENCES profiles(id),
  mentee_id    UUID REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ,
  duration     INTEGER DEFAULT 45, -- minutes
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'canceled')),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DAILY MISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_missions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  xp          INTEGER DEFAULT 25,
  active      BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS mission_completions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id   UUID REFERENCES daily_missions(id) ON DELETE CASCADE,
  completed_at DATE DEFAULT CURRENT_DATE,
  UNIQUE (user_id, mission_id, completed_at)
);

-- ============================================================
-- XP & STREAKS
-- ============================================================
CREATE TABLE IF NOT EXISTS xp_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount     INTEGER NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to add XP and update profile total
CREATE OR REPLACE FUNCTION add_xp(p_user_id UUID, p_amount INTEGER, p_reason TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  INSERT INTO xp_events (user_id, amount, reason) VALUES (p_user_id, p_amount, p_reason);
  UPDATE profiles SET xp = xp + p_amount WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, only edit their own
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Subscriptions: users only see their own
CREATE POLICY "Users see own subscription" ON subscriptions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Lesson completions
CREATE POLICY "Users see own lesson completions" ON lesson_completions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own lesson completions" ON lesson_completions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Community posts: all authenticated can read, own can modify
CREATE POLICY "Posts visible to authenticated" ON community_posts
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users insert own posts" ON community_posts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own posts" ON community_posts
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Post likes
CREATE POLICY "Likes visible to authenticated" ON post_likes
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users manage own likes" ON post_likes
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- Comments
CREATE POLICY "Comments visible to authenticated" ON post_comments
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users insert own comments" ON post_comments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Mission completions
CREATE POLICY "Users see own missions" ON mission_completions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own missions" ON mission_completions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- XP events
CREATE POLICY "Users see own XP" ON xp_events
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Mentorship sessions
CREATE POLICY "Users see own sessions" ON mentorship_sessions
  FOR SELECT TO authenticated
  USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

-- ============================================================
-- SEED: Default daily missions
-- ============================================================
INSERT INTO daily_missions (title, xp) VALUES
  ('Post 1 TikTok product video', 50),
  ('Engage with 5 community posts', 25),
  ('Complete 1 course lesson', 100),
  ('Log today''s revenue', 20),
  ('Run AI content analyzer on a post', 40)
ON CONFLICT DO NOTHING;
