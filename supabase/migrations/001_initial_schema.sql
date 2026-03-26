-- ============================================================
-- Landing Page Builder — Full Schema (v2)
-- Includes: block-based builder, auth roles, booster applications
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Booster Profiles
CREATE TABLE IF NOT EXISTS booster_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  contact_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Roles (admin / booster)
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'booster' CHECK (role IN ('admin', 'booster')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Booster Pages (block-based)
CREATE TABLE IF NOT EXISTS booster_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES booster_profiles(user_id) ON DELETE CASCADE,
  blocks JSONB DEFAULT '[]',                    -- array of Block objects
  page_settings JSONB DEFAULT '{"background":{"type":"gradient","value":"from-slate-950 via-purple-950/20 to-slate-950"},"accentColor":"#6d28d9","font":"inter","spacing":"normal"}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Proof Gallery
CREATE TABLE IF NOT EXISTS proof_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES booster_profiles(user_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booster_id UUID NOT NULL REFERENCES booster_profiles(user_id) ON DELETE CASCADE,
  contact_info TEXT NOT NULL,
  current_rank TEXT,
  desired_rank TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booster_id UUID NOT NULL REFERENCES booster_profiles(user_id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  rank_before TEXT,
  rank_after TEXT,
  content TEXT,
  rating INTEGER DEFAULT 5,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Booster Applications (public form → admin approval)
CREATE TABLE IF NOT EXISTS booster_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  discord TEXT,
  game TEXT DEFAULT 'TFT',
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE booster_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE booster_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE booster_applications ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, owner write
CREATE POLICY "Public profiles are viewable by everyone"
  ON booster_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON booster_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile"
  ON booster_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Roles: owner read own, admin read all
CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can read all roles"
  ON user_roles FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admin can manage roles"
  ON user_roles FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Pages: public read (published), owner write
CREATE POLICY "Published pages are viewable"
  ON booster_pages FOR SELECT USING (is_published = true OR auth.uid() = user_id);
CREATE POLICY "Users can update own page"
  ON booster_pages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own page"
  ON booster_pages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Proof gallery: public read, owner write
CREATE POLICY "Proof images are public"
  ON proof_gallery FOR SELECT USING (true);
CREATE POLICY "Users can manage own proof"
  ON proof_gallery FOR ALL USING (auth.uid() = user_id);

-- Leads: booster read own, anyone insert
CREATE POLICY "Boosters see own leads"
  ON leads FOR SELECT USING (auth.uid() = booster_id);
CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Boosters can update own leads"
  ON leads FOR UPDATE USING (auth.uid() = booster_id);

-- Reviews: public read (approved), anyone insert, booster manage
CREATE POLICY "Approved reviews are public"
  ON reviews FOR SELECT USING (is_approved = true OR auth.uid() = booster_id);
CREATE POLICY "Anyone can submit a review"
  ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Boosters can manage own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = booster_id);
CREATE POLICY "Boosters can delete own reviews"
  ON reviews FOR DELETE USING (auth.uid() = booster_id);

-- Applications: anyone insert, admin read/update
CREATE POLICY "Anyone can submit application"
  ON booster_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read applications"
  ON booster_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admin can update applications"
  ON booster_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- Storage Buckets (run separately in Supabase dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('proofs', 'proofs', true);
