import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── CORS — allow Chrome extensions and any origin
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Scout-Key',
};

// ── Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// ── Supabase admin client — bypasses RLS completely
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Clean up raw Instagram caption to extract a title
function parseTitle(raw: string | null): string {
  if (!raw) return 'Untitled Event';
  const cleaned = raw
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '') // strip emojis
    .replace(/#\w+/g, '')                    // strip hashtags
    .replace(/@\w+/g, '')                    // strip mentions
    .trim();
  const firstLine = cleaned.split('\n')[0].trim();
  return (firstLine || 'Untitled Event').slice(0, 120);
}

function detectMode(location: string | null, caption: string | null): string {
  const text = ((location || '') + ' ' + (caption || '')).toLowerCase();
  if (text.includes('offline') || text.includes('on-site') || text.includes('in-person')) return 'Offline';
  return 'Online';
}

function extractCity(location: string | null): string | null {
  if (!location || ['online', 'virtual', 'remote'].includes(location.toLowerCase())) return null;
  return location.replace(/venue:|location:|at\s+/gi, '').trim().slice(0, 100) || null;
}

function parseDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {}
  return null;
}

function extractPrize(caption: string | null): string | null {
  if (!caption) return null;
  const patterns = [
    /prize\s*pool[:\s]+([₹$]?[\d,]+[k\s]?(?:lakh|crore)?)/i,
    /cash\s*prize[:\s]+([₹$]?[\d,]+)/i,
    /worth\s+([₹$]?[\d,]+)/i,
    /([₹$]\s*[\d,]+)/,
  ];
  for (const pat of patterns) {
    const m = caption.match(pat);
    if (m) return m[1].trim().slice(0, 50);
  }
  return null;
}

function extractRegLink(url: string | null, caption: string | null): string | null {
  const platforms = [
    'devfolio.co', 'unstop.com', 'hackerearth.com', 'hackerrank.com',
    'dare2compete.com', 'townscript.com', 'insider.in', 'eventbrite.com',
    'forms.gle', 'bit.ly', 'linktree.com', 'typeform.com',
  ];
  if (url && platforms.some(p => url.includes(p))) return url;
  if (caption) {
    const urls: string[] = caption.match(/(https?:\/\/[^\s\u200B-\u200D\uFEFF]+)/g) ?? [];
    const platform = urls.find(u => platforms.some(p => u.includes(p)));
    if (platform) return platform;
    if (urls.length > 0) return (urls[0] as string) ?? null;
  }
  return url ?? null;
}

interface ScrapedEvent {
  instagram_url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  registration_link: string | null;
  date: string | null;
  location: string | null;
  tags: string[];
  source: string;
  scraped_at: string;
}

// ══════════════════════════════════════════════════════════════════
// POST /api/insta-events
// ══════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { events } = body as { events: ScrapedEvent[] };

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 });
    }

    // ── Only keep events that have at least a title
    const valid = events.filter(e => e.title && e.title.trim().length > 3);

    if (valid.length === 0) {
      return NextResponse.json({ success: true, inserted: 0, skipped: events.length });
    }

    // ── Map ONLY to columns that are GUARANTEED to exist in hackathons_v2 original schema
    // (no migration needed — these are original NOT NULL + nullable fields)
    const rows = valid.map(evt => {
      const regLink = extractRegLink(evt.registration_link, evt.description);
      return {
        // Required NOT NULL fields
        org_name: 'Instagram Scout',
        org_type: 'Community',
        contact_person: 'Auto Scout',
        contact_email: 'scout@graduatenex.online',

        // Core event fields
        title: parseTitle(evt.title),
        description: ((evt.description || 'Discovered from Instagram').slice(0, 1000)),
        mode: detectMode(evt.location, evt.description),
        city: extractCity(evt.location),
        venue: evt.location && !['online','virtual','remote'].includes(evt.location.toLowerCase())
          ? evt.location.slice(0, 200)
          : null,
        event_date: parseDate(evt.date),
        total_prize_pool: extractPrize(evt.description),
        website: (regLink ?? evt.instagram_url ?? null),

        // ✅ APPROVED so it shows on the page (RLS allows status='approved')
        status: 'approved',
        payment_status: 'unpaid',
      };
    });

    // ── Insert all rows in one shot — use service role key to bypass RLS
    const { data: inserted, error } = await supabaseAdmin
      .from('hackathons_v2')
      .insert(rows)
      .select('id, title');

    if (error) {
      console.error('[insta-events] Insert error:', error);
      return NextResponse.json({ error: error.message, detail: error.details }, { status: 500, headers: CORS });
    }

    return NextResponse.json({
      success: true,
      inserted: inserted?.length ?? rows.length,
      skipped: events.length - valid.length,
      total_received: events.length,
    }, { headers: CORS });

  } catch (err: any) {
    console.error('[insta-events] Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500, headers: CORS });
  }
}

// ══════════════════════════════════════════════════════════════════
// GET /api/insta-events — fetch all hackathons for the page
// Uses service role → bypasses RLS → returns ALL approved events
// ══════════════════════════════════════════════════════════════════
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('hackathons_v2')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data ?? [], count: data?.length ?? 0 }, { headers: CORS });
}
