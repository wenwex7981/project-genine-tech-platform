// ══════════════════════════════════════════════════════════════════
// GraduateNex Events Scout — content.js v3.0
// AUTO-PUSH via Background Service Worker (bypasses Instagram CORS)
// Covers: Hackathons, College Fests, Gaming, Cultural, Tech Events
// ══════════════════════════════════════════════════════════════════

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─────────────────────────────────────────────────────
// EXPANDED HASHTAG LIST — hackathons + fests + gaming + cultural
// ─────────────────────────────────────────────────────
const EVENT_HASHTAGS = [
  // 🏆 Hackathons
  'hackathon', 'hackathon2025', 'hackathon2026', 'collegehackathon',
  'HackIndia', 'SmartIndiaHackathon', 'sih2025', 'indiahackathon',
  'hackathonIndia', 'mlhackathon', 'aithon', 'datathon', 'ideathon',
  'codingcompetition', 'blockchainathon',

  // 🎓 College Fests & Tech Events
  'technicalfest', 'techfest', 'collegefest', 'engineeringfest',
  'techevents', 'collegetechfest', 'annualfest', 'campusfest',
  'devfest', 'startupweekend', 'techconference', 'bootcamp2025',
  'studenthackathon', 'indiafest',

  // 🎮 Gaming & Esports Events
  'gamingcontest', 'esportsIndia', 'gamingfest', 'gamingcompetition',
  'esportstournament', 'pubgtournament', 'bgmitournament', 'valoIndia',
  'lanoparty', 'gamerjunction', 'gamingchallenge', 'onlinegamingevent',

  // 🎭 Cultural & Arts Events
  'culturalfest', 'culturalevent', 'artcontest', 'photocontest',
  'dancefest', 'theaterfest', 'designcontest', 'creativefest',
  'musicfest', 'talentshow', 'collegecultural',

  // 📣 General India Events
  'studentsummit', 'youthfest', 'startupindia', 'openinnovation',
  'indiaevent', 'indiastudents', 'collegeevents', 'campusevent',
];

// ── Keywords that confirm a post is event-related
const EVENT_KEYWORDS = [
  'register', 'registration', 'registrations open', 'apply now',
  'hackathon', 'fest', 'competition', 'contest', 'event', 'tournament',
  'deadline', 'last date', 'submit', 'participate', 'prize', 'winner',
  'coding', 'challenge', 'bootcamp', 'workshop', 'conference', 'summit',
  'ideathon', 'datathon', 'sprint', 'open for', 'join us', 'sign up',
  'season', 'gaming', 'esports', 'cultural', 'talent', 'audition',
  'lan', 'annual', 'national', 'inter college', 'inter-college',
];

// ── Event categories for tagging
const CATEGORY_MAP = {
  gaming: ['gaming','esports','tournament','pubg','bgmi','valorant','lan','gamer'],
  cultural: ['cultural','dance','music','theatre','art','talent','creative'],
  fest: ['fest','festival','annual','campus','college fest'],
  hackathon: ['hackathon','datathon','ideathon','aithon','buildathon'],
  workshop: ['workshop','bootcamp','webinar','masterclass','session'],
  conference: ['conference','summit','symposium','conclave'],
};

function detectCategory(text) {
  const t = text.toLowerCase();
  for (const [cat, kws] of Object.entries(CATEGORY_MAP)) {
    if (kws.some(k => t.includes(k))) return cat;
  }
  return 'event';
}

// ─────────────────────────────────────────────────────
// AUTO-PUSH via Background Service Worker
// NEVER throws — always resolves so scraping continues
// ─────────────────────────────────────────────────────
async function autoPushToBackground(evt) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ action: 'GET_SETTINGS' }, (settingsRes) => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: 'BG not ready: ' + chrome.runtime.lastError.message });
          return;
        }
        const settings = settingsRes?.settings || {};
        const apiUrl = settings.apiUrl || 'https://graduatenex.online/api/insta-events';
        const apiKey = settings.apiKey || '';

        chrome.runtime.sendMessage(
          { action: 'PUSH_EVENT', event: evt, apiUrl, apiKey },
          (res) => {
            if (chrome.runtime.lastError) {
              resolve({ ok: false, error: chrome.runtime.lastError.message });
              return;
            }
            resolve(res || { ok: false, error: 'No response from background' });
          }
        );
      });
    } catch (err) {
      resolve({ ok: false, error: err.message });
    }
  });
}

// Queue a failed event to retry later
async function queueForRetry(evt) {
  const d = await chrome.storage.local.get(['gnRetryQueue']);
  const q = d.gnRetryQueue || [];
  const exists = q.some(e => e.instagram_url === evt.instagram_url);
  if (!exists) {
    q.push(evt);
    await chrome.storage.local.set({ gnRetryQueue: q.slice(-100) });
  }
}

// ─────────────────────────────────────────────────────
// EXTRACT EVENT DATA FROM POST PAGE
// ─────────────────────────────────────────────────────
async function extractEventFromPostPage() {
  await sleep(2000);

  const postUrl = window.location.href.split('?')[0];
  const event = {
    instagram_url: postUrl,
    source: 'instagram',
    scraped_at: new Date().toISOString(),
    title: null,
    description: null,
    image_url: null,
    registration_link: null,
    date: null,
    location: 'Online',
    tags: [],
    category: 'event',
  };

  try {
    // ── Post image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) event.image_url = ogImage.content;
    if (!event.image_url) {
      const img = document.querySelector('article img, img[src*="cdninstagram"], img[src*="fbcdn"]');
      if (img) event.image_url = img.src;
    }

    // ── Caption text (try OG description first — most reliable)
    let captionText = '';
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) captionText = ogDesc.content;

    if (!captionText) {
      const sels = [
        'h1', 'article h1', 'h1 + div span',
        'span[class*="_ap3a"]',
        'div[class*="C4VMK"] span',
        'article span[dir]',
      ];
      for (const sel of sels) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim().length > 20) {
          captionText = el.textContent.trim();
          break;
        }
      }
    }

    event.description = captionText.slice(0, 1000);

    // ── Extract Instagram username from OG description format:
    // Format: "X likes, Y comments - USERNAME on DATE: caption"
    // Also try OG title: "USERNAME on Instagram: \"caption\""
    const usernameFromDesc = captionText.match(/^\d[\d,]*\s+likes?,\s*\d[\d,]*\s+comments?\s*[-–]\s*([\w.]+)\s+on\s+/i);
    const usernameFromTitle = document.querySelector('meta[property="og:title"]')?.content?.match(/^([\w.]+)\s+on\s+Instagram/i);
    const instagramUsername = usernameFromDesc?.[1] || usernameFromTitle?.[1] || null;
    if (instagramUsername) {
      event.instagram_username = instagramUsername;
      event.instagram_profile_url = `https://www.instagram.com/${instagramUsername}/`;
    }

    // ── Title: first meaningful non-emoji line
    if (captionText) {
      const lines = captionText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
      const titleLine = lines.find(l =>
        l.replace(/[\u{1F300}-\u{1FFFF}🔥🚀💡🎯🏆🎓📢📣⚡]/gu, '').trim().length > 5
      );
      if (titleLine) {
        event.title = titleLine
          .replace(/[\u{1F300}-\u{1FFFF}🔥🚀💡🎯🏆🎓📢📣⚡]/gu, '')
          .replace(/#\w+/g, '').replace(/@\w+/g, '').trim()
          .slice(0, 120);
      }
    }
    // Fallback to OG title
    if (!event.title || event.title.length < 5) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        event.title = ogTitle.content
          .replace(/\s*on Instagram.*/, '') // strip "on Instagram: ..."
          .replace(/^[\w.]+\s+/, '')        // strip username prefix
          .trim().slice(0, 120);
      }
    }

    // ── Date
    const datePatterns = [
      /(\d{1,2}[\s\-\/]\w+[\s\-\/]\d{2,4})/i,
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:-\d{1,2})?,?\s*\d{4}/i,
      /deadline[:\s]+([^\n,]+)/i,
      /last date[:\s]+([^\n,]+)/i,
      /(\d{1,2}(?:st|nd|rd|th)\s+\w+\s+\d{4})/i,
    ];
    for (const pat of datePatterns) {
      const m = captionText.match(pat);
      if (m) { event.date = (m[1] || m[0]).trim().slice(0, 80); break; }
    }

    // ── Location
    const locPatterns = [
      /venue[:\s]+([^\n]+)/i,
      /location[:\s]+([^\n]+)/i,
      /held\s+at\s+([^\n,]+)/i,
      /at\s+([A-Z][^\n,]{5,60}(?:college|university|institute|iit|nit|campus|arena|ground|hall|auditorium))/i,
      /(online|virtual|remote)/i,
    ];
    for (const pat of locPatterns) {
      const m = captionText.match(pat);
      if (m) { event.location = (m[1] || m[0]).trim().slice(0, 100); break; }
    }

    // ── Hashtags as tags
    event.tags = (captionText.match(/#\w+/g) || [])
      .slice(0, 12)
      .map(h => h.replace('#', '').toLowerCase());

    // ── Registration link (prioritize known platforms)
    const PLATFORMS = [
      'devfolio.co', 'unstop.com', 'hackerearth.com', 'hackerrank.com',
      'dare2compete.com', 'townscript.com', 'insider.in', 'eventbrite.com',
      'forms.gle', 'bit.ly', 'linktree.com', 'typeform.com', 'lnkd.in',
      'skillenza.com', 'cumulations.com', 'allevents.in',
    ];
    const urls = captionText.match(/(https?:\/\/[^\s\u200B-\u200D\uFEFF\n]+)/g) || [];
    event.registration_link =
      urls.find(u => PLATFORMS.some(p => u.includes(p))) ||
      urls.find(u => ['register','apply','form','join'].some(k => u.toLowerCase().includes(k))) ||
      urls[0] || null;

    // ── Category
    event.category = detectCategory(captionText + ' ' + event.tags.join(' '));

    // ── Reject if clearly not an event
    const isEvent = EVENT_KEYWORDS.some(kw => captionText.toLowerCase().includes(kw));
    if (!isEvent) return null;
    if (!event.title || event.title.length < 5) return null;

    return event;
  } catch (err) {
    console.error('[Scout] Extract error:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────
// COLLECT POST LINKS FROM HASHTAG PAGE
// ─────────────────────────────────────────────────────
async function collectPostLinks(timeout = 9000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const seen = new Set();
    const links = [];
    document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(a => {
      const url = a.href.split('?')[0];
      if (url && !seen.has(url)) { seen.add(url); links.push(url); }
    });
    if (links.length >= 4) return links;
    window.scrollBy(0, 800);
    await sleep(800);
  }
  return [];
}

// ─────────────────────────────────────────────────────
// STATE & DEDUP
// ─────────────────────────────────────────────────────
const saveState = state => chrome.storage.local.set({ gnEventsState: state });

async function loadState() {
  const d = await chrome.storage.local.get(['gnEventsState']);
  return d.gnEventsState || null;
}

async function alreadyScraped(url) {
  const d = await chrome.storage.local.get(['gnScrapedUrls']);
  return (d.gnScrapedUrls || []).includes(url);
}

async function markScraped(url) {
  const d = await chrome.storage.local.get(['gnScrapedUrls']);
  const arr = d.gnScrapedUrls || [];
  if (!arr.includes(url)) {
    arr.push(url);
    await chrome.storage.local.set({ gnScrapedUrls: arr.slice(-1000) });
  }
}

async function incr(key, by = 1) {
  const d = await chrome.storage.local.get([key]);
  await chrome.storage.local.set({ [key]: (d[key] || 0) + by });
}

function report(type, data = {}) {
  try { chrome.runtime.sendMessage({ action: 'SCOUT_PROGRESS', type, ...data }); } catch (e) {}
}

// ─────────────────────────────────────────────────────
// HANDLE HASHTAG PAGE
// ─────────────────────────────────────────────────────
async function handleHashtagPage(state) {
  await sleep(3000);
  report('navigate', { msg: `📡 Scanning #${state.currentHashtag}...` });

  const posts = await collectPostLinks(9000);
  if (posts.length === 0) {
    report('warn', { msg: `No posts for #${state.currentHashtag}, skipping` });
    await moveToNextHashtag(state);
    return;
  }

  const maxPer = state.maxPerHashtag || 12;
  report('info', { msg: `#${state.currentHashtag}: ${posts.length} posts found → scanning ${Math.min(posts.length, maxPer)}` });
  await saveState({ ...state, pendingPosts: posts.slice(0, maxPer) });
  window.location.href = posts[0];
}

// ─────────────────────────────────────────────────────
// HANDLE POST PAGE — EXTRACT + AUTO-PUSH VIA BACKGROUND
// ⚠ NEVER SKIP — always navigates to next post regardless of result
// ─────────────────────────────────────────────────────
async function handlePostPage(state) {
  const { pendingPosts = [] } = state;
  const currentUrl = window.location.href.split('?')[0];

  await sleep(2500);

  // Always try to scrape — even if already scraped, just navigate forward
  if (!(await alreadyScraped(currentUrl))) {
    report('info', { msg: `🔍 Analyzing: ${window.location.pathname}` });
    await incr('gnScannedCount');

    let evt = null;
    try {
      evt = await extractEventFromPostPage();
    } catch (extractErr) {
      report('warn', { msg: `⚠ Extract error: ${extractErr.message}` });
    }

    if (evt && evt.title) {
      await markScraped(currentUrl);
      await incr('gnFoundCount');

      report('found', {
        msg: `✅ [${(evt.category||'event').toUpperCase()}] "${evt.title?.slice(0, 45)}" → pushing...`,
        event: evt,
      });

      // 🚀 AUTO-PUSH — never let this throw or block navigation
      try {
        const result = await autoPushToBackground(evt);

        if (result?.ok && result.inserted > 0) {
          await incr('gnPushCount', result.inserted);
          report('pushed', {
            msg: `🚀 GraduateNex ✓ [${evt.category}] "${evt.title?.slice(0, 40)}"`,
            event: evt,
          });
        } else if (result?.inserted === 0) {
          report('info', { msg: `⚡ Already in DB: "${evt.title?.slice(0, 40)}"` });
        } else {
          // Push failed — queue for retry, but keep scraping
          await queueForRetry(evt);
          if (result?.notFound) {
            report('error', { msg: `❌ API not deployed yet! Using localhost fallback. Check Settings → API URL.` });
          } else {
            report('warn', { msg: `⚠ Push queued for retry: ${result?.error?.slice(0, 60)}` });
          }
        }
      } catch (pushErr) {
        // Push completely failed — queue and keep scraping
        await queueForRetry(evt);
        report('warn', { msg: `⚠ Push error (queued): ${pushErr.message?.slice(0, 60)}` });
      }
    } else {
      report('skip', { msg: `⏭ Not an event: ${window.location.pathname}` });
    }
  }

  // ✅ ALWAYS navigate to next — never get stuck
  await sleep(800);
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
    await saveState({ ...state, running: false });
    report('done', { msg: `🎉 All done! Check GraduateNex Events page.` });
    return;
  }

  const [next, ...remaining] = pending;
  report('navigate', { msg: `→ #${next} (${remaining.length} hashtags left)` });

  await saveState({
    ...state,
    pendingHashtags: remaining,
    currentHashtag: next,
    pendingPosts: [],
  });

  window.location.href = `https://www.instagram.com/explore/tags/${next}/`;
}

// ─────────────────────────────────────────────────────
// ON LOAD — resume session
// ─────────────────────────────────────────────────────
(async function onLoad() {
  await sleep(1500);
  const state = await loadState();
  if (!state?.running) return;

  const url = window.location.href;
  if (/instagram\.com\/(p|reel)\//.test(url)) await handlePostPage(state);
  else if (url.includes('/explore/')) await handleHashtagPage(state);
})();

// ══════════════════════════════════════════════════════
// MESSAGE LISTENER (from popup.js)
// ══════════════════════════════════════════════════════
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'PING') { sendResponse({ status: 'ok' }); return true; }

  if (request.action === 'START_SCOUT') {
    sendResponse({ status: 'started' });
    const hashtags = request.hashtags || EVENT_HASHTAGS;
    const maxPerHashtag = request.maxPosts || 12;

    chrome.storage.local.set({
      gnFoundCount: 0, gnScannedCount: 0, gnPushCount: 0,
    }, async () => {
      const [first, ...remaining] = hashtags;
      await saveState({
        running: true,
        pendingHashtags: remaining,
        currentHashtag: first,
        pendingPosts: [],
        maxPerHashtag,
      });
      report('navigate', { msg: `🚀 Starting scout with ${hashtags.length} hashtags` });
      window.location.href = `https://www.instagram.com/explore/tags/${first}/`;
    });
    return true;
  }

  if (request.action === 'STOP_SCOUT') {
    saveState({ running: false }).then(() => sendResponse({ status: 'stopped' }));
    return true;
  }
});
