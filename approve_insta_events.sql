-- Fix: Approve all Instagram-scraped events so they show on the hackathons page
-- (RLS policy only SELECTs where status = 'approved')

UPDATE public.hackathons_v2
SET status = 'approved'
WHERE source = 'instagram'
  AND status = 'pending';

-- Verify
SELECT id, title, status, source, created_at
FROM public.hackathons_v2
WHERE source = 'instagram'
ORDER BY created_at DESC;
