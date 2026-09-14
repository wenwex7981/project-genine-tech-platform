import { NextResponse } from 'next/server';
import {
  batchPingGoogle,
  pingIndexNow,
  pingSitemaps,
  getAllSiteURLs,
  pingGoogleIndexingAPI,
} from '@/lib/indexing-api';
import { supabase } from '@/lib/supabase';

// POST /api/seo/bulk-index
// Body: { mode: 'all' | 'single' | 'dynamic', url?: string, type?: string }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode = 'all', url, type = 'URL_UPDATED' } = body;

    // ── Mode: single URL ─────────────────────────────────────────────────────
    if (mode === 'single') {
      if (!url) return NextResponse.json({ error: 'url required for single mode' }, { status: 400 });

      const [google, indexnow] = await Promise.allSettled([
        pingGoogleIndexingAPI(url, type),
        pingIndexNow([url]),
      ]);

      return NextResponse.json({
        success: true,
        url,
        google: google.status === 'fulfilled' ? google.value : { success: false },
        indexNow: indexnow.status === 'fulfilled' ? indexnow.value : { success: false },
      });
    }

    // ── Mode: dynamic (blogs + projects from DB) ──────────────────────────────
    if (mode === 'dynamic') {
      const [{ data: blogs }, { data: projects }, { data: hackathons }] = await Promise.all([
        supabase.from('blogs').select('slug').eq('published', true),
        supabase.from('projects').select('id'),
        supabase.from('hackathons').select('id'),
      ]);

      const dynamicUrls = [
        ...(blogs || []).map(b => `https://www.graduatenex.online/blog/${b.slug}`),
        ...(projects || []).map(p => `https://www.graduatenex.online/projects/${p.id}`),
        ...(hackathons || []).map(h => `https://www.graduatenex.online/hackathons/${h.id}`),
      ];

      const [googleResult, indexNowResult, sitemapResult] = await Promise.allSettled([
        batchPingGoogle(dynamicUrls, 'URL_UPDATED'),
        pingIndexNow(dynamicUrls),
        pingSitemaps(),
      ]);

      return NextResponse.json({
        success: true,
        mode: 'dynamic',
        urls: dynamicUrls.length,
        google: googleResult.status === 'fulfilled' ? googleResult.value : null,
        indexNow: indexNowResult.status === 'fulfilled' ? indexNowResult.value : null,
        sitemap: sitemapResult.status === 'fulfilled' ? sitemapResult.value : null,
      });
    }

    // ── Mode: all (full site blast) ───────────────────────────────────────────
    const allURLs = getAllSiteURLs();

    // Fetch dynamic URLs too
    const [{ data: blogs }, { data: projects }, { data: hackathons }] = await Promise.all([
      supabase.from('blogs').select('slug').eq('published', true),
      supabase.from('projects').select('id'),
      supabase.from('hackathons').select('id'),
    ]);

    const dynamicURLs = [
      ...(blogs || []).map(b => `https://www.graduatenex.online/blog/${b.slug}`),
      ...(projects || []).map(p => `https://www.graduatenex.online/projects/${p.id}`),
      ...(hackathons || []).map(h => `https://www.graduatenex.online/hackathons/${h.id}`),
    ];

    const finalURLs = [...new Set([...allURLs, ...dynamicURLs])];

    // Fire all 3 engines simultaneously
    const [googleResult, indexNowResult, sitemapResult] = await Promise.allSettled([
      batchPingGoogle(finalURLs, 'URL_UPDATED'),
      pingIndexNow(finalURLs),
      pingSitemaps(),
    ]);

    return NextResponse.json({
      success: true,
      mode: 'all',
      totalURLs: finalURLs.length,
      google: googleResult.status === 'fulfilled' ? googleResult.value : { success: false, error: 'failed' },
      indexNow: indexNowResult.status === 'fulfilled' ? indexNowResult.value : { success: false },
      sitemap: sitemapResult.status === 'fulfilled' ? sitemapResult.value : { success: false },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Bulk index error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/seo/bulk-index — returns count of indexable URLs
export async function GET() {
  const urls = getAllSiteURLs();
  return NextResponse.json({
    totalStaticURLs: urls.length,
    message: 'POST to this endpoint with { mode: "all" } to index everything',
    modes: {
      all: 'Index every static + dynamic page across Google, Bing, Yandex',
      dynamic: 'Index only blogs, projects, hackathons from DB',
      single: 'Index one URL: { mode: "single", url: "https://..." }',
    },
  });
}
