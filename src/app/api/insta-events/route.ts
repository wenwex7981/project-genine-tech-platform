import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── Supabase admin client (bypasses RLS for insertion)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Simple AI-based title extraction — clean up raw Instagram caption titles
function parseTitle(raw: string | null): string {
  if (!raw) return 'Untitled Event';
  // Remove hashtags, mentions, emojis from the start
  const cleaned = raw
    .replace(/^[\u{1F300}-\u{1FFFF}\s🔥🚀💡🎯🏆🎓📢📣]+/gu, '')
    .replace(/#\w+/g, '')
    .replace(/@\w+/g, '')
    .trim();
  return cleaned.split('\n')[0].trim().slice(0, 120) || 'Untitled Event';
}

// ── Extract registration link from known platforms
function extractRegistrationLink(url: string | null, caption: string | null): string | null {
  // Known hackathon platforms — prioritize these
  const platforms = [
    'devfolio.co', 'unstop.com', 'hackerearth.com', 'hackerrank.com',
    'dare2compete.com', 'cumulations.com', 'townscript.com',
    'insider.in', 'explara.com', 'eventbrite.com',
  ];

  if (url) {
    const isPlatform = platforms.some(p => url.includes(p));
    if (isPlatform) return url;
  }

  if (caption) {
    const urlMatches = caption.match(/(https?:\/\/[^\s\u200B-\u200D\uFEFF]+)/g) || [];
    const platformLink = urlMatches.find(u => platforms.some(p => u.includes(p)));
    if (platformLink) return platformLink;
    // Return any URL as fallback
    if (urlMatches.length > 0) return urlMatches[0];
  }

  return url || null;
}

// ── Map scraped event to hackathons_v2 schema
function mapEventToSchema(evt: ScrapedEvent) {
  const regLink = extractRegistrationLink(evt.registration_link, evt.description);

  return {
    // Organizer (from Instagram source)
    org_name: 'Instagram Scout (Auto-Import)',
    org_type: 'Community',
    contact_person: 'Scout Bot',
    contact_email: 'scout@graduatenex.online',
    website: regLink ?? evt.instagram_url ?? null,

    // Event Details
    title: parseTitle(evt.title),
    description: (evt.description || '').slice(0, 1000),
    mode: detectMode(evt.location, evt.description),
    city: extractCity(evt.location),
    state: null,
    venue: evt.location !== 'Online' ? evt.location?.slice(0, 200) : null,
    event_date: parseDate(evt.date),
    registration_link: regLink,

    // Prizes (not known from Instagram)
    total_prize_pool: extractPrize(evt.description),

    // Media
    banner_url: evt.image_url,
    instagram_url: evt.instagram_url,
    source: 'instagram',
    tags: evt.tags || [],

    // Status — set to 'pending' for admin review
    status: 'pending',
    payment_status: 'unpaid',
  };
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

// ── Helpers
function detectMode(location: string | null, caption: string | null): string {
  const text = ((location || '') + ' ' + (caption || '')).toLowerCase();
  if (text.includes('online') || text.includes('virtual') || text.includes('remote')) return 'Online';
  if (text.includes('offline') || text.includes('on-site') || text.includes('in-person')) return 'Offline';
  return 'Online';
}

function extractCity(location: string | null): string | null {
  if (!location || location.toLowerCase() === 'online') return null;
  // Remove common words and extract city
  const cleaned = location.replace(/venue:|location:|at\s+/gi, '').trim();
  return cleaned.slice(0, 100) || null;
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
    /prize\s*pool[:\s]+([₹$]?\d[\d,k lakhcrore ]+)/i,
    /total\s*prize[:\s]+([₹$]?\d[\d,k lakhcrore ]+)/i,
    /cash\s*prize[:\s]+([₹$]?\d[\d,k lakhcrore ]+)/i,
    /worth\s+([₹$]?\d[\d,k lakhcrore ]+)/i,
    /([₹$]\s*\d[\d,]+)/,
  ];
  for (const pat of patterns) {
    const m = caption.match(pat);
    if (m) return m[1].trim().slice(0, 50);
  }
  return null;
}

// ══════════════════════════════════════════════════════════════════
// POST /api/insta-events
// Receives scraped events from the Chrome extension and upserts
// them into the hackathons_v2 Supabase table.
// ══════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    // ── (Optional) Validate secret key
    const scoutKey = req.headers.get('x-scout-key');
    const envKey   = process.env.SCOUT_SECRET_KEY;
    if (envKey && scoutKey !== envKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { events } = body as { events: ScrapedEvent[] };

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 });
    }

    // ── Map scraped events to DB schema
    const rows = events
      .filter(e => e.title && e.instagram_url) // require at minimum title + source URL
      .map(mapEventToSchema);

    if (rows.length === 0) {
      return NextResponse.json({ success: true, inserted: 0, skipped: events.length });
    }

    // ── Check existing instagram_urls to avoid duplicates
    const urls = rows.map(r => r.instagram_url).filter(Boolean);
    const { data: existing } = await supabaseAdmin
      .from('hackathons_v2')
      .select('instagram_url')
      .in('instagram_url', urls as string[]);

    const existingUrls = new Set((existing || []).map((r: any) => r.instagram_url));
    const newRows = rows.filter(r => r.instagram_url && !existingUrls.has(r.instagram_url));

    if (newRows.length === 0) {
      return NextResponse.json({
        success: true,
        inserted: 0,
        skipped: rows.length,
        message: 'All events already exist in DB',
      });
    }

    // ── Insert new events
    const { data: inserted, error } = await supabaseAdmin
      .from('hackathons_v2')
      .insert(newRows)
      .select();

    if (error) {
      console.error('[insta-events API] Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      inserted: inserted?.length || newRows.length,
      skipped: rows.length - newRows.length,
      total_received: events.length,
    });

  } catch (err: any) {
    console.error('[insta-events API] Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// GET /api/insta-events — return count of instagram-sourced events
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('hackathons_v2')
    .select('id, title, instagram_url, status, created_at')
    .eq('source', 'instagram')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data, count: data?.length || 0 });
}
