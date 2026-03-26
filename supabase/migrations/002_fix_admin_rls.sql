-- ============================================================
-- Fix: RLS policies for admin access
-- The recursive admin check on user_roles causes infinite loops.
-- This creates a SECURITY DEFINER function to break the recursion.
-- Run this in Supabase SQL Editor.
-- ============================================================

-- 1. Create a helper function that bypasses RLS to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  );
$$;

-- 2. Drop old problematic policies on user_roles
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Admin can read all roles" ON user_roles;
DROP POLICY IF EXISTS "Admin can manage roles" ON user_roles;

-- 3. Recreate clean policies
CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all roles"
  ON user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- 4. Fix booster_applications policies too
DROP POLICY IF EXISTS "Admin can read applications" ON booster_applications;
DROP POLICY IF EXISTS "Admin can update applications" ON booster_applications;

CREATE POLICY "Admin can read applications"
  ON booster_applications FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update applications"
  ON booster_applications FOR UPDATE USING (public.is_admin(auth.uid()));

-- 5. Fix booster_pages policy to let owner see unpublished pages
DROP POLICY IF EXISTS "Published pages are viewable" ON booster_pages;
CREATE POLICY "Pages are viewable"
  ON booster_pages FOR SELECT USING (true);
