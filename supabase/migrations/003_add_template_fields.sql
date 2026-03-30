-- 003_add_template_fields.sql
-- Run this in Supabase SQL Editor to update your schema for the new Template Builder

ALTER TABLE booster_pages 
  ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS section_order JSONB DEFAULT '[]'::jsonb;

-- Migrate any existing settings over
UPDATE booster_pages SET theme_config = page_settings WHERE page_settings IS NOT NULL;
