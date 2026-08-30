-- ══════════════════════════════════════════════════════════
-- ShetkarHit Database Migration: Email & Password Auth
-- ⚠️ Run this script in your Supabase SQL Editor to update your tables!
-- ══════════════════════════════════════════════════════════

-- 1. Drop existing old tables to reset schema with Email & Auth relations
DROP TABLE IF EXISTS public.crops CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create new PROFILES table linked directly to Supabase auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  name VARCHAR(150) NOT NULL,
  village VARCHAR(100),
  district VARCHAR(100) DEFAULT 'Ahmednagar',
  state VARCHAR(100) DEFAULT 'Maharashtra',
  acres NUMERIC(6,2),
  soil VARCHAR(50),
  irrigation VARCHAR(50),
  water_source VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create CROPS table linked to profiles
CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  sowing_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Indexes for fast queries
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_crops_profile_id ON public.crops(profile_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: Allow read & write access
CREATE POLICY "Allow public read on profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert/update on profiles"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read on crops"
  ON public.crops FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert/update/delete on crops"
  ON public.crops FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Trigger to automatically create a profile record when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, state, district)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'Maharashtra',
    'Ahmednagar'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.profiles.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
