// ══════════════════════════════════════════════════════════════════
// GraduateNex Events & Hackathon Scout — content.js v1.0
// Scrapes Instagram hashtag/explore pages for events & hackathons
// ══════════════════════════════════════════════════════════════════

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Hashtags to crawl for events & hackathons
const EVENT_HASHTAGS = [
  'hackathon',
  'hackathon2025',
  'hackathon2026',
  'collegehackathon',
  'technicalfest',
  'techfest',
  'techconference',
  'startupweekend',
  'codingcompetition',
  'coding challenge',
  'datathon',
  'ideathon',
  'bootcamp2025',
  'devfest',
  'hackathonIndia',
  'HackIndia',
  'SmartIndiaHackathon',
  'sih2025',
  'indiahackathon',
  'techwomen',
  'mlhackathon',
  'aithon',
  'blockchainathon',
  'iotcontest',
  'openinnovation',
  'techevents',
  'studenthackathon',
  'engineeringfest',
  'startupindia',
];

// ── AI/LLM keywords to detect events in captions
const EVENT_KEYWORDS = [
  'register', 'registration', 'registrations open', 'apply now',
  'hackathon', 'fest', 'competition', 'contest', 'event',
  'deadline', 'last date', 'submit', 'participate', 'prize',
  'winner', 'coding', 'challenge', 'bootcamp', 'workshop',
  'conference', 'summit', 'ideathon', 'datathon', 'sprint',
];

// ── Scraped events collector
let scrapedEvents = [];

// ─────────────────────────────────────────────────────
// EXTRACT EVENT DATA FROM A POST PAGE
// ─────────────────────────────────────────────────────
async function extractEventFromPostPage() {
  await sleep(2000);

  const event = {
    instagram_url: window.location.href,
    source: 'instagram',
    scraped_at: new Date().toISOString(),
    title: null,
    description: null,
    image_url: null,
    registration_link: null,
    date: null,
    location: 'Online',
    tags: [],
  };

  try {
    // ── Get post image (OG meta tag is most reliable)
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) event.image_url = ogImage.content;
    
    // Fallback: first img in article
    if (!event.image_url) {
      const img = document.querySelector('article img[src*="instagram"]');
      if (img) event.image_url = img.src;
    }

    // ── Get caption text
    let captionText = '';
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) captionText = ogDesc.content;

    if (!captionText) {
      // Try to get caption from the DOM
      const captionSelectors = [
        'span[class*="_ap3a"]',
        'div[class*="C4VMK"] span',
        'h1 ~ span',
        'article span',
        'div[data-lexical-editor] span',
      ];
      for (const sel of captionSelectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent.length > 20) {
          captionText = el.textContent;
          break;
        }
      }
    }

    event.description = captionText.slice(0, 800);

    // ── Parse title from caption (first meaningful line)
    if (captionText) {
      const lines = captionText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
      // Remove emoji-only lines
      const titleLine = lines.find(l => l.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim().length > 5);
      if (titleLine) {
        event.title = titleLine.slice(0, 120);
      }
    }

    // ── Extract OG title as fallback title
    if (!event.title) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) event.title = ogTitle.content.slice(0, 120);
    }

    // ── Parse date from caption
    const datePatterns = [
      /(\d{1,2}[\s\-\/]\w+[\s\-\/]\d{2,4})/i,
      /(\w+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})/i,
      /(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4})/i,
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:-\d{1,2})?,?\s*\d{4}/i,
      /deadline[:\s]+(.+)/i,
      /last date[:\s]+(.+)/i,
    ];
    for (const pat of datePatterns) {
      const m = captionText.match(pat);
      if (m) { event.date = m[1] || m[0]; break; }
    }

    // ── Parse location from caption
    const locationPatterns = [
      /venue[:\s]+([^\n]+)/i,
      /location[:\s]+([^\n]+)/i,
      /at\s+([A-Z][^\n,]+(?:college|university|institute|iit|nit|campus))/i,
      /(online|virtual|remote)/i,
    ];
    for (const pat of locationPatterns) {
      const m = captionText.match(pat);
      if (m) { event.location = (m[1] || m[0]).trim().slice(0, 100); break; }
    }

    // ── Extract hashtags as tags
    const hashMatches = captionText.match(/#\w+/g) || [];
    event.tags = hashMatches.slice(0, 10).map(h => h.replace('#', '').toLowerCase());

    // ── Extract registration links from caption
    const urlPattern = /(https?:\/\/[^\s\u200B-\u200D\uFEFF]+)/g;
    const urls = captionText.match(urlPattern) || [];
    // Filter for likely registration links
    const regLink = urls.find(u =>
      u.includes('register') || u.includes('devfolio') || u.includes('unstop') ||
      u.includes('hackerearth') || u.includes('hackerrank') || u.includes('form') ||
      u.includes('bit.ly') || u.includes('forms') || u.includes('apply') ||
      u.includes('linktree') || u.includes('typeform')
    );
    if (regLink) event.registration_link = regLink;

    // Fallback: grab any URL from caption
    if (!event.registration_link && urls.length > 0) {
      event.registration_link = urls[0];
    }

    // ── Check if this is actually an event post
    const isEvent = EVENT_KEYWORDS.some(kw =>
      captionText.toLowerCase().includes(kw)
    );

    if (!isEvent) return null; // Not an event post

    return event;
  } catch (err) {
    console.error('[Events Scout] Error extracting post data:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────
// COLLECT POST LINKS FROM HASHTAG/EXPLORE PAGE
// ─────────────────────────────────────────────────────
async function collectPostLinks(timeout = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const seen = new Set();
    const links = [];
    document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(a => {
      const url = a.href.split('?')[0]; // strip query params
      if (url && !seen.has(url)) {
        seen.add(url);
        links.push(url);
      }
    });
    if (links.length >= 5) return links;
    // Scroll down to load more
    window.scrollBy(0, 600);
    await sleep(700);
  }
  return [];
}

// ─────────────────────────────────────────────────────
// SAVE / LOAD STATE
// ─────────────────────────────────────────────────────
async function saveState(state) {
  await chrome.storage.local.set({ gnEventsState: state });
}
async function loadState() {
  const data = await chrome.storage.local.get(['gnEventsState']);
  return data.gnEventsState || null;
}
async function saveScrapedEvent(evt) {
  const data = await chrome.storage.local.get(['gnScrapedEvents']);
  const events = data.gnScrapedEvents || [];
  // Deduplicate by instagram_url
  const exists = events.some(e => e.instagram_url === evt.instagram_url);
  if (!exists && evt.title) {
    events.push(evt);
    await chrome.storage.local.set({ gnScrapedEvents: events });
  }
  return events.length;
}

function report(type, data = {}) {
  try {
    chrome.runtime.sendMessage({ action: 'SCOUT_PROGRESS', type, ...data });
  } catch (e) {}
}

// ─────────────────────────────────────────────────────
// HANDLE HASHTAG PAGE — collect post links
// ─────────────────────────────────────────────────────
async function handleHashtagPage(state) {
  await sleep(3000);
  report('info', { msg: `Scanning hashtag page: ${window.location.href}` });

  const posts = await collectPostLinks(8000);
  if (posts.length === 0) {
    report('warn', { msg: 'No posts found on this hashtag page. Moving on.' });
    await moveToNextHashtag(state);
    return;
  }

  report('info', { msg: `Found ${posts.length} posts. Starting to scan...` });

  const newState = {
    ...state,
    pendingPosts: posts.slice(0, 12), // max 12 per hashtag
    explorerUrl: window.location.href,
  };
  await saveState(newState);
  window.location.href = posts[0];
}

// ─────────────────────────────────────────────────────
// HANDLE POST PAGE — extract event data
// ─────────────────────────────────────────────────────
async function handlePostPage(state) {
  const { pendingPosts = [] } = state;

  await sleep(2500);
  report('info', { msg: `Analyzing post: ${window.location.pathname}` });

  const evt = await extractEventFromPostPage();

  if (evt) {
    const count = await saveScrapedEvent(evt);
    report('found', {
      msg: `✅ Event found: "${evt.title?.slice(0, 50)}"`,
      total: count,
      event: evt,
    });
  } else {
    report('skip', { msg: `⏭ Not an event post: ${window.location.pathname}` });
  }

  await sleep(1500);

  // Move to next post or next hashtag
  const remaining = pendingPosts.slice(1);
  if (remaining.length > 0) {
    await saveState({ ...state, pendingPosts: remaining });
    window.location.href = remaining[0];
  } else {
    await moveToNextHashtag({ ...state, pendingPosts: [] });
  }
}

// ─────────────────────────────────────────────────────
// MOVE TO NEXT HASHTAG
// ─────────────────────────────────────────────────────
async function moveToNextHashtag(state) {
  const pending = state.pendingHashtags || [];
  if (pending.length === 0) {
    await saveState({ ...state, running: false, pendingHashtags: [], pendingPosts: [] });
    report('done', { msg: '🎉 All hashtags scanned! Ready to push events.' });
    return;
  }

  const next = pending[0];
  const remaining = pending.slice(1);
  const url = `https://www.instagram.com/explore/tags/${next}/`;

  report('navigate', { msg: `Opening #${next} (${remaining.length} left)` });

  await saveState({
    ...state,
    pendingHashtags: remaining,
    currentHashtag: next,
    pendingPosts: [],
  });

  window.location.href = url;
}

// ─────────────────────────────────────────────────────
// ON LOAD — auto-resume if in scraper mode
// ─────────────────────────────────────────────────────
(async function onLoad() {
  await sleep(1500);

  const state = await loadState();
  if (!state || !state.running) return;

  const url = window.location.href;
  const isPost = /instagram\.com\/(p|reel)\//.test(url);
  const isExplore = url.includes('/explore/');

  if (isPost) await handlePostPage(state);
  else if (isExplore) await handleHashtagPage(state);
})();

// ══════════════════════════════════════════════════════
// MESSAGE LISTENER
// ══════════════════════════════════════════════════════
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'PING') {
    sendResponse({ status: 'ok' });
    return true;
  }

  if (request.action === 'START_SCOUT') {
    sendResponse({ status: 'started' });

    const hashtags = request.hashtags || EVENT_HASHTAGS;
    const first = hashtags[0];
    const remaining = hashtags.slice(1);

    chrome.storage.local.set({ gnScrapedEvents: [] }, async () => {
      await saveState({
        running: true,
        pendingHashtags: remaining,
        currentHashtag: first,
        pendingPosts: [],
      });
      report('navigate', { msg: `Starting with #${first}` });
      window.location.href = `https://www.instagram.com/explore/tags/${first}/`;
    });

    return true;
  }

  if (request.action === 'STOP_SCOUT') {
    saveState({ running: false }).then(() => {
      sendResponse({ status: 'stopped' });
    });
    return true;
  }

  if (request.action === 'GET_EVENTS') {
    chrome.storage.local.get(['gnScrapedEvents'], (data) => {
      sendResponse({ events: data.gnScrapedEvents || [] });
    });
    return true;
  }
});
