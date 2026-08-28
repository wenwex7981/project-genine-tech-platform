-- ══════════════════════════════════════════════
-- GraduateNex Jobs & Updates — Supabase Schema
-- Run this in Supabase SQL Editor
-- ══════════════════════════════════════════════

-- Jobs table
create table if not exists jobs_feed (
  id             uuid default gen_random_uuid() primary key,
  title          text not null,
  company        text,
  location       text default 'Remote',
  job_type       text default 'full-time',  -- full-time | internship | contract | freelance
  role_category  text default 'software',   -- frontend | backend | fullstack | ai-ml | mobile | devops | data | design | software
  description    text,
  url            text unique not null,
  salary         text,
  source         text,                       -- remotive | arbeitnow | linkedin | naukri
  posted_at      timestamptz default now(),
  scraped_at     timestamptz default now(),
  is_active      boolean default true
);

-- AI Updates / News table
create table if not exists ai_updates (
  id           uuid default gen_random_uuid() primary key,
  title        text not null,
  summary      text,
  url          text unique not null,
  source       text,                         -- dev.to | hackernews | techcrunch
  author       text,
  published_at timestamptz default now(),
  tags         text[] default '{}',
  cover_image  text,
  reactions    integer default 0,
  scraped_at   timestamptz default now()
);

-- Indexes for fast filtering
create index if not exists jobs_feed_role_idx      on jobs_feed(role_category);
create index if not exists jobs_feed_type_idx      on jobs_feed(job_type);
create index if not exists jobs_feed_posted_idx    on jobs_feed(posted_at desc);
create index if not exists jobs_feed_active_idx    on jobs_feed(is_active);
create index if not exists ai_updates_pub_idx      on ai_updates(published_at desc);

-- Enable Row Level Security
alter table jobs_feed   enable row level security;
alter table ai_updates  enable row level security;

-- Public read access
create policy "Public read jobs"    on jobs_feed   for select using (true);
create policy "Public read updates" on ai_updates  for select using (true);

-- Service role can write (extension uses service role via API)
create policy "Service insert jobs"    on jobs_feed   for insert with check (true);
create policy "Service upsert jobs"    on jobs_feed   for update using (true);
create policy "Service insert updates" on ai_updates  for insert with check (true);
create policy "Service upsert updates" on ai_updates  for update using (true);

-- Auto-expire old jobs (run this as a cron or just let API filter by date)
-- Optional: delete jobs older than 7 days to keep DB clean
-- delete from jobs_feed  where posted_at < now() - interval '7 days';
-- delete from ai_updates where published_at < now() - interval '7 days';
