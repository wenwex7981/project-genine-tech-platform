/**
 * Google Indexing - Ping Google to re-crawl sitemap when new content is published.
 * Uses the simple sitemap ping method (no service account needed).
 */
export async function pingGoogleForIndexing(pageUrl?: string): Promise<void> {
  const sitemapUrl = 'https://www.graduatenex.online/sitemap.xml';
  
  try {
    // Method 1: Ping Google to re-crawl sitemap
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
      method: 'GET',
    });
    console.log(`[Google Indexing] Pinged Google sitemap: ${sitemapUrl}`);

    // Method 2: Ping Bing/IndexNow as well
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
      method: 'GET',
    });
    console.log(`[Google Indexing] Pinged Bing sitemap: ${sitemapUrl}`);
  } catch (error) {
    console.error('[Google Indexing] Ping failed (non-critical):', error);
  }
}
