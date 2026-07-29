-- Run this SQL in your Supabase SQL Editor to create the hackathons_v2 table

CREATE TABLE IF NOT EXISTS public.hackathons_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Organizer Details
    org_name TEXT NOT NULL,
    org_type TEXT DEFAULT 'Company',
    contact_person TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    website TEXT,
    linkedin TEXT,
    
    -- Event Details
    title TEXT NOT NULL,
    theme TEXT,
    description TEXT NOT NULL,
    eligibility TEXT,
    team_size_min INTEGER DEFAULT 1,
    team_size_max INTEGER DEFAULT 4,
    reg_start_date DATE,
    reg_end_date DATE,
    event_date DATE,
    mode TEXT DEFAULT 'Online',
    city TEXT,
    state TEXT,
    venue TEXT,
    
    -- Prizes & Rewards
    total_prize_pool TEXT,
    first_prize TEXT,
    second_prize TEXT,
    third_prize TEXT,
    has_certificates BOOLEAN DEFAULT false,
    has_internship BOOLEAN DEFAULT false,
    has_ppo BOOLEAN DEFAULT false,
    has_goodies BOOLEAN DEFAULT false,
    
    -- Other
    reg_fee NUMERIC DEFAULT 0,
    max_participants INTEGER,
    pricing_plan TEXT DEFAULT 'Free Listing',
    
    -- Moderation
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    payment_status TEXT DEFAULT 'unpaid' -- unpaid, paid
);

-- Allow public read access (if needed)
ALTER TABLE public.hackathons_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to approved hackathons" 
ON public.hackathons_v2 FOR SELECT 
USING (status = 'approved');

-- Allow anyone to insert (since they are pending approval anyway)
CREATE POLICY "Allow public insert" 
ON public.hackathons_v2 FOR INSERT 
WITH CHECK (true);
