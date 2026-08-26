-- Supabase Setup Script for Community Resumes and Hackathons

-- 1. Community Resumes Table
CREATE TABLE IF NOT EXISTS public.community_resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact_number TEXT,
    shortlisted_by TEXT,
    domain TEXT NOT NULL,
    experience_level TEXT NOT NULL, -- 'Fresher' or 'Experienced'
    document_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Hackathons Table
CREATE TABLE IF NOT EXISTS public.hackathons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    banner_url TEXT,
    registration_link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.community_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on community_resumes" 
ON public.community_resumes FOR SELECT USING (true);

CREATE POLICY "Allow public read access on hackathons" 
ON public.hackathons FOR SELECT USING (true);

CREATE POLICY "Allow public insert on community_resumes" 
ON public.community_resumes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on hackathons" 
ON public.hackathons FOR INSERT WITH CHECK (true);

-- 4. Projects Migration (Adding images array)
-- Note: If you already have a projects table, run:
-- ALTER TABLE public.projects ADD COLUMN images TEXT[] DEFAULT '{}';

-- 5. Project Custom Requirements (Abstract / Base Paper Uploads)
CREATE TABLE IF NOT EXISTS public.project_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID, -- References projects(id) but loosely coupled for flexibility
    project_title TEXT NOT NULL,
    document_url TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on project_requests" 
ON public.project_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on project_requests" 
ON public.project_requests FOR SELECT USING (true);

-- 6. Project Marketing Campaigns (Automated Bulk Engine)
CREATE TABLE IF NOT EXISTS public.project_marketing_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    campaign_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.project_marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on project_marketing_campaigns" 
ON public.project_marketing_campaigns FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on project_marketing_campaigns" 
ON public.project_marketing_campaigns FOR SELECT USING (true);
