// GraduateNex Job Crawler — background.js (Service Worker)
// Runs every hour, scrapes free job APIs, pushes to GraduateNex

// ── Role categorizer
function categorizeRole(title = '') {
  const t = title.toLowerCase();
  if (/frontend|front-end|react|vue|angular|ui|css|html/.test(t))       return 'frontend';
  if (/backend|back-end|node|django|flask|spring|ruby|php|golang/.test(t)) return 'backend';
  if (/fullstack|full-stack|full stack/.test(t))                          return 'fullstack';
  if (/ai|ml|machine learning|deep learning|nlp|llm|data science|python/.test(t)) return 'ai-ml';
  if (/android|ios|flutter|react native|mobile/.test(t))                  return 'mobile';
  if (/devops|cloud|aws|azure|gcp|kubernetes|docker|sre|infra/.test(t))  return 'devops';
  if (/data engineer|data analyst|sql|power bi|tableau/.test(t))          return 'data';
  if (/design|figma|ux|ui\/ux/.test(t))                                   return 'design';
  return 'software';
}

// ── Type classifier
function classifyType(tags = [], title = '') {
  const all = (tags.join(' ') + ' ' + title).toLowerCase();
  if (/intern/.test(all))    return 'internship';
  if (/contract/.test(all))  return 'contract';
  if (/freelance/.test(all)) return 'freelance';
  return 'full-time';
}

// ── Parse relative dates from strings like "3 days ago"
function parsePostedDate(str = '') {
  if (!str) return new Date().toISOString();
  const now = Date.now();
  const m = str.match(/(\d+)\s*(hour|day|week|month)/i);
  if (!m) return new Date().toISOString();
  const n = parseInt(m[1]);
  const unit = m[2].toLowerCase();
  const ms = { hour: 36e5, day: 864e5, week: 6048e5, month: 2592e6 };
  return new Date(now - n * (ms[unit] || 864e5)).toISOString();
}

// ── Is within last 48 hours?
function isRecent(dateStr) {
  if (!dateStr) return true;
  const posted = new Date(dateStr).getTime();
  const cutoff = Date.now() - 48 * 3600 * 1000;
  return posted >= cutoff;
}

// ─────────────────────────────────────────────────────
// FETCH REMOTIVE JOBS (free, no key)
// ─────────────────────────────────────────────────────
async function fetchRemotive() {
  try {
    const res  = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=50', { cache: 'no-store' });
    const data = await res.json();
    return (data.jobs || []).filter(j => isRecent(j.publication_date)).map(j => ({
      title:         j.title,
      company:       j.company_name,
      location:      j.candidate_required_location || 'Remote',
      job_type:      classifyType(j.job_type ? [j.job_type] : [], j.title),
      role_category: categorizeRole(j.title),
      description:   (j.description || '').replace(/<[^>]+>/g, '').slice(0, 500),
      url:           j.url,
      salary:        j.salary || '',
      source:        'remotive',
      posted_at:     j.publication_date,
    }));
  } catch(e) {
    console.error('Remotive fetch failed:', e.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────
// FETCH ARBEITNOW JOBS (free, no key)
// ─────────────────────────────────────────────────────
async function fetchArbeitnow() {
  try {
    const res  = await fetch('https://www.arbeitnow.com/api/job-board-api?page=1', { cache: 'no-store' });
    const data = await res.json();
    return (data.data || []).filter(j => isRecent(j.created_at)).map(j => ({
      title:         j.title,
      company:       j.company_name,
      location:      j.location || 'Remote',
      job_type:      classifyType(j.tags || [], j.title),
      role_category: categorizeRole(j.title),
      description:   (j.description || '').replace(/<[^>]+>/g, '').slice(0, 500),
      url:           j.url,
      salary:        '',
      source:        'arbeitnow',
      posted_at:     j.created_at,
    }));
  } catch(e) {
    console.error('Arbeitnow fetch failed:', e.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────
// FETCH DEV.TO AI ARTICLES (free, no key)
// ─────────────────────────────────────────────────────
async function fetchDevTo() {
  try {
    const tags = ['ai', 'machinelearning', 'artificialintelligence', 'llm', 'openai'];
    let articles = [];
    for (const tag of tags.slice(0, 3)) {
      const res  = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=15&top=1`, { cache: 'no-store' });
      const data = await res.json();
      articles   = articles.concat(data || []);
    }
    const seen = new Set();
    return articles
      .filter(a => isRecent(a.published_at) && !seen.has(a.id) && seen.add(a.id))
      .map(a => ({
        title:        a.title,
        summary:      a.description || '',
        url:          a.url,
        source:       'dev.to',
        author:       a.user?.name || '',
        published_at: a.published_at,
        tags:         (a.tag_list || []).slice(0, 5),
        cover_image:  a.cover_image || '',
        reactions:    a.positive_reactions_count || 0,
      }));
  } catch(e) {
    console.error('Dev.to fetch failed:', e.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────
// FETCH HACKER NEWS — Top tech stories
// ─────────────────────────────────────────────────────
async function fetchHackerNews() {
  try {
    const idsRes  = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { cache: 'no-store' });
    const ids     = await idsRes.json();
    const top20   = ids.slice(0, 20);
    const stories = await Promise.all(
      top20.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()).catch(() => null)
      )
    );
    const aiKeywords = ['ai', 'llm', 'openai', 'claude', 'gemini', 'gpt', 'machine learning', 'neural', 'deepmind', 'career', 'hiring', 'jobs', 'software', 'developer', 'engineer'];
    return stories
      .filter(s => s && s.url && s.title && isRecent(s.time ? new Date(s.time * 1000).toISOString() : null))
      .filter(s => aiKeywords.some(kw => s.title.toLowerCase().includes(kw)))
      .map(s => ({
        title:        s.title,
        summary:      '',
        url:          s.url,
        source:       'hackernews',
        author:       s.by || '',
        published_at: s.time ? new Date(s.time * 1000).toISOString() : new Date().toISOString(),
        tags:         ['tech', 'news'],
        reactions:    s.score || 0,
      }));
  } catch(e) {
    console.error('HN fetch failed:', e.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────
// PUSH TO GRADUATENEX API
// ─────────────────────────────────────────────────────
async function pushToSite(backendUrl, secret, jobs, news) {
  const url = `${backendUrl}/api/jobs-feed`;
  const res = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-crawler-secret': secret || '' },
    body:    JSON.stringify({ jobs, news }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API error ${res.status}: ${txt}`);
  }
  return await res.json();
}

// ─────────────────────────────────────────────────────
// MAIN CRAWL FUNCTION
// ─────────────────────────────────────────────────────
async function doCrawl(backendUrl, secret, sources) {
  const log = (text, type = 'info') =>
    chrome.runtime.sendMessage({ action: 'CRAWL_LOG', text, type }).catch(() => {});

  await log('🔍 Starting crawl from: ' + sources.join(', '));

  let jobs = [], news = [];

  if (sources.includes('remotive')) {
    await log('Fetching Remotive jobs...');
    const r = await fetchRemotive();
    jobs = jobs.concat(r);
    await log(`✅ Remotive: ${r.length} fresh jobs`, 'success');
  }
  if (sources.includes('arbeitnow')) {
    await log('Fetching Arbeitnow jobs...');
    const r = await fetchArbeitnow();
    jobs = jobs.concat(r);
    await log(`✅ Arbeitnow: ${r.length} fresh jobs`, 'success');
  }
  if (sources.includes('devto')) {
    await log('Fetching Dev.to AI articles...');
    const r = await fetchDevTo();
    news = news.concat(r);
    await log(`✅ Dev.to: ${r.length} articles`, 'success');
  }
  if (sources.includes('hn')) {
    await log('Fetching Hacker News top stories...');
    const r = await fetchHackerNews();
    news = news.concat(r);
    await log(`✅ Hacker News: ${r.length} stories`, 'success');
  }

  await log(`Total: ${jobs.length} jobs + ${news.length} news items. Pushing to site...`);

  const result = await pushToSite(backendUrl, secret, jobs, news);
  await log(`🚀 Pushed! DB now has ${result.inserted || '?'} new entries.`, 'success');

  const stats = {
    jobs:        jobs.filter(j => j.job_type !== 'internship').length,
    internships: jobs.filter(j => j.job_type === 'internship').length,
    news:        news.length,
  };

  // Save stats + timestamp
  await chrome.storage.local.set({ lastCrawl: new Date().toISOString(), crawlStats: stats });

  return { success: true, total: jobs.length + news.length, ...stats };
}

// ─────────────────────────────────────────────────────
// MESSAGE LISTENER
// ─────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'SETUP_ALARM') {
    chrome.alarms.create('hourly-crawl', { periodInMinutes: 60 });
    sendResponse({ ok: true });
    return true;
  }

  if (msg.action === 'CRAWL_NOW') {
    const { backendUrl, crawlerSecret, sources } = msg;
    doCrawl(backendUrl, crawlerSecret, sources || ['remotive','arbeitnow','devto','hn'])
      .then(result => sendResponse(result))
      .catch(err  => sendResponse({ success: false, error: err.message }));
    return true; // keep channel open for async
  }
});

// ─────────────────────────────────────────────────────
// HOURLY ALARM TRIGGER
// ─────────────────────────────────────────────────────
chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== 'hourly-crawl') return;
  const data = await chrome.storage.local.get(['backendUrl','crawlerSecret','selectedSources']);
  const backendUrl = data.backendUrl || 'https://www.graduatenex.online';
  const secret     = data.crawlerSecret || '';
  const sources    = data.selectedSources || ['remotive','arbeitnow','devto','hn'];
  try {
    await doCrawl(backendUrl, secret, sources);
    console.log('[GN Crawler] Hourly crawl done');
  } catch(e) {
    console.error('[GN Crawler] Hourly crawl failed:', e.message);
  }
});
