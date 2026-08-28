import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── GET: fetch jobs + news for the page
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type     = searchParams.get('type') || 'jobs';   // jobs | news
  const role     = searchParams.get('role') || 'all';
  const jobType  = searchParams.get('job_type') || 'all';
  const page     = parseInt(searchParams.get('page') || '1');
  const limit    = parseInt(searchParams.get('limit') || '30');
  const offset   = (page - 1) * limit;

  // Only show last 48 hours
  const cutoff = new Date(Date.now() - 48 * 3600 * 1000).toISOString();

  if (type === 'news') {
    let q = supabase
      .from('ai_updates')
      .select('*', { count: 'exact' })
      .gte('published_at', cutoff)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, count, page, limit });
  }

  // Jobs query
  let q = supabase
    .from('jobs_feed')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .gte('posted_at', cutoff)
    .order('posted_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (role && role !== 'all')    q = q.eq('role_category', role);
  if (jobType && jobType !== 'all') q = q.eq('job_type', jobType);

  const { data, error, count } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, count, page, limit });
}

// ── POST: receive crawled data from extension
export async function POST(req: NextRequest) {
  // Verify secret
  const secret = req.headers.get('x-crawler-secret') || '';
  const validSecret = process.env.CRAWLER_SECRET || '';
  if (validSecret && secret !== validSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { jobs = [], news = [] } = await req.json();
    let insertedJobs = 0, insertedNews = 0;

    // Upsert jobs (skip duplicates by URL)
    if (jobs.length > 0) {
      const { error } = await supabase
        .from('jobs_feed')
        .upsert(
          jobs.map((j: any) => ({
            title:         j.title?.slice(0, 200) || 'Untitled',
            company:       j.company?.slice(0, 100) || '',
            location:      j.location?.slice(0, 100) || 'Remote',
            job_type:      j.job_type || 'full-time',
            role_category: j.role_category || 'software',
            description:   j.description?.slice(0, 1000) || '',
            url:           j.url,
            salary:        j.salary?.slice(0, 100) || '',
            source:        j.source || 'unknown',
            posted_at:     j.posted_at || new Date().toISOString(),
            is_active:     true,
          })),
          { onConflict: 'url', ignoreDuplicates: true }
        );
      if (!error) insertedJobs = jobs.length;
      else console.error('Jobs upsert error:', error.message);
    }

    // Upsert news (skip duplicates by URL)
    if (news.length > 0) {
      const { error } = await supabase
        .from('ai_updates')
        .upsert(
          news.map((n: any) => ({
            title:        n.title?.slice(0, 300) || 'Untitled',
            summary:      n.summary?.slice(0, 500) || '',
            url:          n.url,
            source:       n.source || 'unknown',
            author:       n.author?.slice(0, 100) || '',
            published_at: n.published_at || new Date().toISOString(),
            tags:         n.tags || [],
            cover_image:  n.cover_image || '',
            reactions:    n.reactions || 0,
          })),
          { onConflict: 'url', ignoreDuplicates: true }
        );
      if (!error) insertedNews = news.length;
      else console.error('News upsert error:', error.message);
    }

    return NextResponse.json({
      ok: true,
      inserted: insertedJobs + insertedNews,
      jobs_inserted: insertedJobs,
      news_inserted: insertedNews,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
