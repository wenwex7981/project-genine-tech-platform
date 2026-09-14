import { google } from 'googleapis';

const BASE_URL = 'https://www.graduatenex.online';

// ── ALL site URLs to index ──────────────────────────────────────────────────
export function getAllSiteURLs(): string[] {
  // Core pages
  const core = [
    '/', '/projects', '/resume', '/study', '/hackathons', '/blog',
    '/pricing', '/ai-services', '/ai-abstracts', '/about', '/contact',
    '/custom-requirements', '/jobs-updates', '/login',
    '/projects/source-code', '/projects/documentation',
    '/projects/research-paper', '/projects/plagiarism-removal',
    '/study/interview-prep', '/study/career-guidance',
    '/study/interview-prep/communication-builder',
    '/study/interview-prep/english-course',
    '/privacy', '/terms', '/refunds', '/delivery',
  ].map(p => `${BASE_URL}${p}`);

  // Location pages
  const { seoLocations } = require('./seo-data');
  const locations = seoLocations
    .filter((l: any) => ['state', 'city', 'university', 'country'].includes(l.type))
    .map((l: any) => `${BASE_URL}/locations/${l.slug}`);

  // Resume role pages
  const roles = seoLocations
    .filter((l: any) => l.type === 'role')
    .map((l: any) => `${BASE_URL}/resume/role/${l.slug}`);

  // Company interview pages
  const companies = seoLocations
    .filter((l: any) => l.type === 'company')
    .map((l: any) => `${BASE_URL}/study/interview/${l.slug}`);

  return [...core, ...locations, ...roles, ...companies];
}

// ── Google Indexing API (single URL) ────────────────────────────────────────
export async function pingGoogleIndexingAPI(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
) {
  try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      console.warn('Indexing API skipped: GOOGLE_APPLICATION_CREDENTIALS_JSON not set.');
      return { success: false, error: 'Credentials not configured' };
    }

    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    const jwtClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    await jwtClient.authorize();
    const indexing = google.indexing({ version: 'v3', auth: jwtClient });

    const response = await indexing.urlNotifications.publish({
      requestBody: { url, type },
    });

    console.log(`✅ Google Indexed: ${url}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`❌ Google Index Failed: ${url} — ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ── Google Batch Indexing (up to 100 URLs per batch) ────────────────────────
export async function batchPingGoogle(urls: string[], type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  const results: { url: string; success: boolean; error?: string }[] = [];

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return { success: false, error: 'Credentials not configured', results };
  }

  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  const jwtClient = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  await jwtClient.authorize();
  const token = await jwtClient.getAccessToken();
  const accessToken = token.token;

  // Google allows 200 requests/day, batch in chunks of 100
  const CHUNK = 100;
  for (let i = 0; i < urls.length; i += CHUNK) {
    const chunk = urls.slice(i, i + CHUNK);

    // Build multipart batch request
    const boundary = 'batch_graduatenex_indexing';
    const bodyParts = chunk.map((url, idx) =>
      `--${boundary}\r\nContent-Type: application/http\r\nContent-ID: <item${idx + i}>\r\n\r\nPOST /v3/urlNotifications:publish HTTP/1.1\r\nContent-Type: application/json\r\n\r\n${JSON.stringify({ url, type })}`
    );
    const batchBody = bodyParts.join('\r\n') + `\r\n--${boundary}--`;

    try {
      const response = await fetch('https://indexing.googleapis.com/batch', {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/mixed; boundary=${boundary}`,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: batchBody,
      });

      const text = await response.text();
      // Count successes by checking for 200 OK in response parts
      const successCount = (text.match(/HTTP\/1\.1 200/g) || []).length;
      const failCount = chunk.length - successCount;

      chunk.forEach(url => results.push({ url, success: true }));
      console.log(`✅ Batch ${i / CHUNK + 1}: ${successCount} indexed, ${failCount} failed`);
    } catch (err: any) {
      chunk.forEach(url => results.push({ url, success: false, error: err.message }));
      console.error(`❌ Batch ${i / CHUNK + 1} failed:`, err.message);
    }

    // Wait 1s between batches to avoid rate limiting
    if (i + CHUNK < urls.length) await new Promise(r => setTimeout(r, 1000));
  }

  return { success: true, results, total: urls.length, indexed: results.filter(r => r.success).length };
}

// ── IndexNow (instant Bing, Yandex, DuckDuckGo) ─────────────────────────────
export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.warn('IndexNow skipped: INDEXNOW_KEY not set');
    return { success: false, error: 'INDEXNOW_KEY not configured' };
  }

  const host = 'www.graduatenex.online';
  const keyLocation = `https://${host}/${key}.txt`;

  const results = await Promise.allSettled([
    // Bing (covers DuckDuckGo, Yahoo, Ecosia)
    fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key, keyLocation, urlList: urls.slice(0, 10000) }),
    }),
    // Yandex
    fetch('https://yandex.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key, keyLocation, urlList: urls.slice(0, 10000) }),
    }),
  ]);

  const successes = results.filter(r => r.status === 'fulfilled').length;
  console.log(`✅ IndexNow: Pinged ${successes}/2 search engines with ${urls.length} URLs`);
  return { success: true, engines: successes, urls: urls.length };
}

// ── Sitemap Ping (Google + Bing) ─────────────────────────────────────────────
export async function pingSitemaps() {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);

  const pings = await Promise.allSettled([
    fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`),
    fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`),
  ]);

  const successes = pings.filter(p => p.status === 'fulfilled').length;
  console.log(`✅ Sitemap pinged: ${successes}/2 engines`);
  return { success: true, engines: successes };
}
