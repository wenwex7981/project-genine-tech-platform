-- SQL Schema for Subscriptions and Usage Tracking

-- 1. Table for User Subscriptions / Passes (30-day access or lifetime badges)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    plan_id TEXT NOT NULL,          -- e.g., 'ai_premium', 'resume_hub_pro', 'hackathon_badge_15'
    plan_name TEXT NOT NULL,
    status TEXT DEFAULT 'active',   -- active, expired
    expires_at TIMESTAMP WITH TIME ZONE, -- Null for lifetime passes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table for Pay-Per-Use Tracking (e.g., Abstract Generator uses)
CREATE TABLE IF NOT EXISTS public.user_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    feature_id TEXT NOT NULL,       -- e.g., 'abstract_generator', 'plagiarism_checker'
    usage_count INTEGER DEFAULT 0,
    max_free_limit INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, feature_id)
);

-- Row Level Security (RLS)
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
ON public.user_subscriptions FOR SELECT
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can view their own usage"
ON public.user_usage FOR SELECT
USING (auth.jwt() ->> 'email' = user_email);

-- Allow service role or authenticated users to insert/update their own usage via API
CREATE POLICY "Users can update their own usage"
ON public.user_usage FOR ALL
USING (auth.jwt() ->> 'email' = user_email)
WITH CHECK (auth.jwt() ->> 'email' = user_email);
