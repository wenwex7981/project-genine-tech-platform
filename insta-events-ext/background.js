// ══════════════════════════════════════════════════════════════════
// GraduateNex Events Scout — background.js v3.1
// Handles ALL fetch requests. Retries on failure. Never skips events.
// ══════════════════════════════════════════════════════════════════

const DEFAULT_API = 'https://graduatenex.online/api/insta-events';
const FALLBACK_API = 'http://localhost:3000/api/insta-events';

// ── Retry helper — tries up to maxRetries times with delay
async function fetchWithRetry(url, options, maxRetries = 3, delayMs = 2000) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);

      // Check Content-Type — if server returns HTML it means wrong URL / not deployed
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text();
        // If it's a 404/HTML page, this URL doesn't exist — don't retry
        if (res.status === 404 || text.trim().startsWith('<!DOCTYPE')) {
          return {
            ok: false,
            error: `API endpoint not found (${res.status}). Deploy the Next.js app to production first, or check the API URL in Settings.`,
            notFound: true,
          };
        }
        return { ok: false, error: `Non-JSON response (${res.status}): ${text.slice(0, 100)}` };
      }

      const json = await res.json();

      if (!res.ok) {
        lastError = `Server error ${res.status}: ${json.error || JSON.stringify(json)}`;
        // Don't retry 4xx client errors
        if (res.status >= 400 && res.status < 500) {
          return { ok: false, error: lastError };
        }
      } else {
        return { ok: true, inserted: json.inserted ?? 0, data: json };
      }
    } catch (err) {
      lastError = err.message;
      console.warn(`[Scout BG] Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
    }

    if (attempt < maxRetries) {
      await new Promise(r => setTimeout(r, delayMs * attempt));
    }
  }
  return { ok: false, error: lastError || 'All retries failed' };
}

// ── Main message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // ── PUSH_EVENT: push single scraped event to API
  if (request.action === 'PUSH_EVENT') {
    const { event, apiUrl, apiKey } = request;
    const primaryUrl  = apiUrl || DEFAULT_API;

    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'X-Scout-Key': apiKey } : {}),
    };
    const body = JSON.stringify({ events: [event] });

    // Try primary URL first, then fallback to localhost
    fetchWithRetry(primaryUrl, { method: 'POST', headers, body })
      .then(async result => {
        if (!result.ok && !result.notFound) {
          // Try localhost fallback
          console.log('[Scout BG] Primary failed, trying localhost fallback...');
          const fallback = await fetchWithRetry(FALLBACK_API, { method: 'POST', headers, body }, 2, 1000);
          sendResponse(fallback);
        } else {
          sendResponse(result);
        }
      })
      .catch(err => sendResponse({ ok: false, error: err.message }));

    return true; // async
  }

  // ── GET_SETTINGS
  if (request.action === 'GET_SETTINGS') {
    chrome.storage.local.get(['gnEventsSettings'], d => {
      sendResponse({ settings: d.gnEventsSettings || {} });
    });
    return true;
  }

  // ── RELAY progress from content script → popup
  if (request.action === 'SCOUT_PROGRESS') {
    chrome.runtime.sendMessage(request).catch(() => {});
    return false;
  }
});

// ── Badge: show push count on extension icon
chrome.storage.onChanged.addListener(changes => {
  if (changes.gnPushCount) {
    const n = changes.gnPushCount.newValue || 0;
    chrome.action.setBadgeText({ text: n > 0 ? String(n) : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
  }
  if (changes.gnEventsState) {
    const running = changes.gnEventsState.newValue?.running;
    chrome.action.setBadgeBackgroundColor({ color: running ? '#7c3aed' : '#10b981' });
  }
});

console.log('[Scout BG] v3.1 ready — fetch proxy active.');
