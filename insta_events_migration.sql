-- ══════════════════════════════════════════════════════════════════
-- Migration: Add Instagram Scout columns to hackathons_v2
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- Add instagram_url for deduplication
ALTER TABLE public.hackathons_v2
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS registration_link TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create unique index on instagram_url to prevent duplicate imports
CREATE UNIQUE INDEX IF NOT EXISTS idx_hackathons_v2_instagram_url
  ON public.hackathons_v2(instagram_url)
  WHERE instagram_url IS NOT NULL;

-- Index for source filtering
CREATE INDEX IF NOT EXISTS idx_hackathons_v2_source
  ON public.hackathons_v2(source);

-- Show current structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'hackathons_v2'
ORDER BY ordinal_position;
