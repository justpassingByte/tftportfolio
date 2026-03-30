-- 004_add_blocks_en.sql
-- Add the English blocks column for bilingual profiles

ALTER TABLE booster_pages 
  ADD COLUMN IF NOT EXISTS blocks_en JSONB DEFAULT '[]'::jsonb;
