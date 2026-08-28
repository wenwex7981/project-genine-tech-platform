// GraduateNex Job Crawler — background.js v2.0
// Scrapes: Remotive API + Arbeitnow API + LinkedIn + Naukri + Internshala + Indeed + Dev.to + HN

// ── Role categorizer
function categorizeRole(title = '') {
  const t = title.toLowerCase();
  if (/frontend|front-end|react|vue|angular|ui developer|css|html/.test(t))           return 'frontend';
  if (/backend|back-end|node\.?js|django|flask|spring|ruby|php|golang|java dev/.test(t)) return 'backend';
  if (/fullstack|full.?stack/.test(t))                                                return 'fullstack';
  if (/\bai\b|machine learning|deep learning|\bnlp\b|\bllm\b|data science|tensorflow|pytorch/.test(t)) return 'ai-ml';
  if (/android|ios|flutter|react native|mobile/.test(t))                              return 'mobile';
  if (/devops|cloud|aws|azure|gcp|kubernetes|docker|sre|platform|infra/.test(t))     return 'devops';
  if (/data engineer|data analyst|\bsql\b|power bi|tableau|bi developer/.test(t))    return 'data';
  if (/design|figma|\bux\b|ui\/ux|product designer/.test(t))                         return 'design';
  return 'software';
}

function classifyType(text = '') {
  const t = text.toLowerCase();
  if (/intern/.test(t))    return 'internship';
  if (/contract/.test(t))  return 'contract';
  if (/freelance/.test(t)) return 'freelance';
  return 'full-time';
}

function isRecent(dateStr, hours = 72) {
  if (!dateStr) return true;
  const posted = new Date(dateStr).getTime();
  return posted >= Date.now() - hours * 3600 * 1000;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ════════════════════════════════════════════════════════
// FREE API SOURCES (no key needed)
// ════════════════════════════════════════════════════════

async function fetchRemotive() {
  try {
    const res  = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=50', { cache: 'no-store' });
    const data = await res.json();
    return (data.jobs || []).filter(j => isRecent(j.publication_date)).map(j => ({
      title:         j.title,
      company:       j.company_name,
      location:      j.candidate_required_location || 'Remote',
      job_type:      classifyType(j.job_type || ''),
      role_category: categorizeRole(j.title),
      description:   (j.description || '').replace(/<[^>]+>/g, '').slice(0, 500),
      url:           j.url,
      salary:        j.salary || '',
      source:        'remotive',
      posted_at:     j.publication_date,
    }));
  } catch(e) { console.error('Remotive:', e.message); return []; }
}

async function fetchArbeitnow() {
  try {
    const res  = await fetch('https://www.arbeitnow.com/api/job-board-api?page=1', { cache: 'no-store' });
    const data = await res.json();
    return (data.data || []).filter(j => isRecent(j.created_at)).map(j => ({
      title:         j.title,
      company:       j.company_name,
      location:      j.location || 'Remote',
      job_type:      classifyType((j.tags || []).join(' ')),
      role_category: categorizeRole(j.title),
      description:   (j.description || '').replace(/<[^>]+>/g, '').slice(0, 500),
      url:           j.url,
      salary:        '',
      source:        'arbeitnow',
      posted_at:     j.created_at,
    }));
  } catch(e) { console.error('Arbeitnow:', e.message); return []; }
}

async function fetchDevTo() {
  try {
    const tags = ['ai','machinelearning','artificialintelligence'];
    let articles = [];
    for (const tag of tags) {
      const res  = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=15&top=1`, { cache: 'no-store' });
      const data = await res.json();
      articles = articles.concat(data || []);
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
  } catch(e) { console.error('DevTo:', e.message); return []; }
}

async function fetchHackerNews() {
  try {
    const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { cache: 'no-store' });
    const ids    = await idsRes.json();
    const stories = await Promise.all(
      ids.slice(0, 25).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()).catch(() => null)
      )
    );
    const kws = ['ai','llm','openai','claude','gemini','gpt','machine learning','neural','career','hiring','jobs','software','developer','engineer','startup'];
    return stories
      .filter(s => s?.url && s.title && isRecent(s.time ? new Date(s.time * 1000).toISOString() : null))
      .filter(s => kws.some(k => s.title.toLowerCase().includes(k)))
      .map(s => ({
        title:        s.title,
        summary:      '',
        url:          s.url,
        source:       'hackernews',
        author:       s.by || '',
        published_at: s.time ? new Date(s.time * 1000).toISOString() : new Date().toISOString(),
        tags:         ['tech','news'],
        reactions:    s.score || 0,
      }));
  } catch(e) { console.error('HN:', e.message); return []; }
}

// ════════════════════════════════════════════════════════
// TAB-BASED SCRAPERS — opens real browser tab, extracts DOM
// ════════════════════════════════════════════════════════

async function scrapeTabUrl(url, extractFn, waitMs = 4000) {
  return new Promise(resolve => {
    chrome.tabs.create({ url, active: false }, tab => {
      const tabId = tab.id;
      let done = false;

      const onUpdated = (id, info) => {
        if (id !== tabId || info.status !== 'complete' || done) return;
        done = true;
        chrome.tabs.onUpdated.removeListener(onUpdated);

        setTimeout(() => {
          chrome.scripting.executeScript(
            { target: { tabId }, func: extractFn },
            results => {
              chrome.tabs.remove(tabId).catch(() => {});
              const data = results?.[0]?.result;
              resolve(Array.isArray(data) ? data : []);
            }
          );
        }, waitMs);
      };

      chrome.tabs.onUpdated.addListener(onUpdated);

      // Timeout safety
      setTimeout(() => {
        if (done) return;
        done = true;
        chrome.tabs.onUpdated.removeListener(onUpdated);
        chrome.tabs.remove(tabId).catch(() => {});
        resolve([]);
      }, 20000);
    });
  });
}

// ── LinkedIn Jobs (public search, India freshers)
async function fetchLinkedIn() {
  const urls = [
    'https://www.linkedin.com/jobs/search/?keywords=software+engineer+fresher&location=India&f_TPR=r86400&f_E=1%2C2',
    'https://www.linkedin.com/jobs/search/?keywords=software+developer&location=India&f_TPR=r86400',
  ];
  let all = [];
  for (const url of urls) {
    try {
      const jobs = await scrapeTabUrl(url, function() {
        const results = [];
        const cards = document.querySelectorAll('.jobs-search__results-list > li, .base-card, [data-entity-urn]');
        cards.forEach(card => {
          const titleEl   = card.querySelector('.base-search-card__title, h3.base-search-card__title, a.base-card__full-link');
          const companyEl = card.querySelector('.base-search-card__subtitle, h4.base-search-card__subtitle');
          const locationEl= card.querySelector('.job-search-card__location, .base-search-card__metadata span');
          const linkEl    = card.querySelector('a[href*="/jobs/view/"], a.base-card__full-link');
          const metaEl    = card.querySelector('.base-search-card__metadata time, time');

          const title   = titleEl?.textContent?.trim();
          const company = companyEl?.textContent?.trim();
          const url     = linkEl?.href?.split('?')[0];

          if (title && url) {
            results.push({
              title,
              company:   company || '',
              location:  locationEl?.textContent?.trim() || 'India',
              url,
              posted_at: metaEl?.getAttribute('datetime') || new Date().toISOString(),
              source:    'linkedin',
            });
          }
        });
        return results.slice(0, 25);
      }, 5000);
      all = all.concat(jobs);
    } catch(e) { console.error('LinkedIn scrape error:', e.message); }
    await sleep(2000);
  }
  return all.map(j => ({
    ...j,
    job_type:      classifyType(j.title),
    role_category: categorizeRole(j.title),
    description:   '',
    salary:        '',
  }));
}

// ── Naukri.com — freshers software jobs
async function fetchNaukri() {
  const urls = [
    'https://www.naukri.com/fresher-software-developer-jobs',
    'https://www.naukri.com/software-engineer-jobs-in-india-2',
  ];
  let all = [];
  for (const url of urls) {
    try {
      const jobs = await scrapeTabUrl(url, function() {
        const results = [];
        const cards = document.querySelectorAll('.jobTuple, .job-tuple, article.jobTupleHeader, [class*="jobTuple"]');
        cards.forEach(card => {
          const titleEl   = card.querySelector('a.title, .title a, h2 a, .jobTitle a');
          const companyEl = card.querySelector('.companyInfo a, .company-name, [class*="companyName"]');
          const locationEl= card.querySelector('.location, [class*="location"] span, .ellipsis.fleft');
          const salaryEl  = card.querySelector('.salary, [class*="salary"]');

          const title = titleEl?.textContent?.trim();
          const url   = titleEl?.href;

          if (title && url && !url.includes('login')) {
            results.push({
              title,
              company:   companyEl?.textContent?.trim() || '',
              location:  locationEl?.textContent?.trim() || 'India',
              url:       url.split('?')[0],
              salary:    salaryEl?.textContent?.trim() || '',
              source:    'naukri',
              posted_at: new Date().toISOString(),
            });
          }
        });
        return results.slice(0, 25);
      }, 5000);
      all = all.concat(jobs);
    } catch(e) { console.error('Naukri scrape error:', e.message); }
    await sleep(2000);
  }
  return all.map(j => ({
    ...j,
    job_type:      classifyType(j.title),
    role_category: categorizeRole(j.title),
    description:   '',
  }));
}

// ── Internshala — internships
async function fetchInternshala() {
  const urls = [
    'https://internshala.com/internships/computer-science-engineering-internship/',
    'https://internshala.com/internships/web-development-internship/',
    'https://internshala.com/internships/machine-learning-internship/',
  ];
  let all = [];
  for (const url of urls) {
    try {
      const jobs = await scrapeTabUrl(url, function() {
        const results = [];
        const cards = document.querySelectorAll('.internship_meta, .individual_internship, [id^="internship_"]');
        cards.forEach(card => {
          const titleEl   = card.querySelector('.heading_4_5 a, .profile a, h3 a');
          const companyEl = card.querySelector('.company_name a, .link_display_like_text');
          const locationEl= card.querySelector('.location_link, .location span, [class*="location"]');
          const stipendEl = card.querySelector('.stipend, [class*="stipend"]');

          const title = titleEl?.textContent?.trim();
          const href  = titleEl?.href || titleEl?.getAttribute('href');

          if (title && href) {
            const fullUrl = href.startsWith('http') ? href : 'https://internshala.com' + href;
            results.push({
              title,
              company:   companyEl?.textContent?.trim() || '',
              location:  locationEl?.textContent?.trim() || 'India',
              url:       fullUrl.split('?')[0],
              salary:    stipendEl?.textContent?.trim() || '',
              source:    'internshala',
              posted_at: new Date().toISOString(),
              job_type:  'internship',
            });
          }
        });
        return results.slice(0, 20);
      }, 5000);
      all = all.concat(jobs);
    } catch(e) { console.error('Internshala scrape error:', e.message); }
    await sleep(1500);
  }
  return all.map(j => ({
    ...j,
    job_type:      'internship',
    role_category: categorizeRole(j.title),
    description:   '',
  }));
}

// ── Indeed India — fresh software jobs
async function fetchIndeed() {
  const urls = [
    'https://in.indeed.com/jobs?q=software+engineer+fresher&l=India&fromage=1&sort=date',
    'https://in.indeed.com/jobs?q=software+developer&l=India&fromage=1',
  ];
  let all = [];
  for (const url of urls) {
    try {
      const jobs = await scrapeTabUrl(url, function() {
        const results = [];
        const cards = document.querySelectorAll('.job_seen_beacon, .resultContent, [class*="jobCard"], [data-jk]');
        cards.forEach(card => {
          const titleEl   = card.querySelector('h2 a span[title], h2 a, .jcs-JobTitle span');
          const companyEl = card.querySelector('[data-testid="company-name"], .companyName');
          const locationEl= card.querySelector('[data-testid="text-location"], .companyLocation');
          const linkEl    = card.querySelector('h2 a');

          const title = titleEl?.getAttribute('title') || titleEl?.textContent?.trim();
          const href  = linkEl?.href;

          if (title && href && !href.includes('pagead')) {
            results.push({
              title,
              company:   companyEl?.textContent?.trim() || '',
              location:  locationEl?.textContent?.trim() || 'India',
              url:       href.split('?')[0],
              source:    'indeed',
              posted_at: new Date().toISOString(),
            });
          }
        });
        return results.slice(0, 20);
      }, 5000);
      all = all.concat(jobs);
    } catch(e) { console.error('Indeed scrape error:', e.message); }
    await sleep(2000);
  }
  return all.map(j => ({
    ...j,
    job_type:      classifyType(j.title),
    role_category: categorizeRole(j.title),
    description:   '',
    salary:        '',
  }));
}

// ════════════════════════════════════════════════════════
// PUSH TO GRADUATENEX API
// ════════════════════════════════════════════════════════
async function pushToSite(backendUrl, secret, jobs, news) {
  const res = await fetch(`${backendUrl}/api/jobs-feed`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-crawler-secret': secret || '' },
    body:    JSON.stringify({ jobs, news }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return await res.json();
}

// ════════════════════════════════════════════════════════
// MAIN CRAWL
// ════════════════════════════════════════════════════════
async function doCrawl(backendUrl, secret, sources) {
  const log = (text, type = 'info') =>
    chrome.runtime.sendMessage({ action: 'CRAWL_LOG', text, type }).catch(() => {});

  await log('🚀 Starting crawl: ' + sources.join(', '));

  let jobs = [], news = [];

  // ── Free API sources
  if (sources.includes('remotive')) {
    await log('Fetching Remotive (remote jobs API)...');
    const r = await fetchRemotive();
    jobs = jobs.concat(r);
    await log(`✅ Remotive: ${r.length} jobs`, 'success');
  }
  if (sources.includes('arbeitnow')) {
    await log('Fetching Arbeitnow (remote jobs API)...');
    const r = await fetchArbeitnow();
    jobs = jobs.concat(r);
    await log(`✅ Arbeitnow: ${r.length} jobs`, 'success');
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
    await log(`✅ HackerNews: ${r.length} stories`, 'success');
  }

  // ── Browser-based scrapers (open real tabs)
  if (sources.includes('linkedin')) {
    await log('🌐 Opening LinkedIn jobs (browser scrape)...');
    const r = await fetchLinkedIn();
    jobs = jobs.concat(r);
    await log(`✅ LinkedIn: ${r.length} jobs`, 'success');
  }
  if (sources.includes('naukri')) {
    await log('🌐 Opening Naukri.com (browser scrape)...');
    const r = await fetchNaukri();
    jobs = jobs.concat(r);
    await log(`✅ Naukri: ${r.length} jobs`, 'success');
  }
  if (sources.includes('internshala')) {
    await log('🌐 Opening Internshala (browser scrape)...');
    const r = await fetchInternshala();
    jobs = jobs.concat(r);
    await log(`✅ Internshala: ${r.length} internships`, 'success');
  }
  if (sources.includes('indeed')) {
    await log('🌐 Opening Indeed India (browser scrape)...');
    const r = await fetchIndeed();
    jobs = jobs.concat(r);
    await log(`✅ Indeed: ${r.length} jobs`, 'success');
  }

  // Deduplicate by URL
  const seenUrls = new Set();
  jobs = jobs.filter(j => j.url && !seenUrls.has(j.url) && seenUrls.add(j.url));
  news = news.filter(n => n.url && !seenUrls.has(n.url) && seenUrls.add(n.url));

  await log(`📦 Total: ${jobs.length} jobs + ${news.length} news. Pushing to GraduateNex...`);

  const result = await pushToSite(backendUrl, secret, jobs, news);
  await log(`🎉 Pushed! ${result.inserted || '?'} new entries saved.`, 'success');

  const stats = {
    jobs:        jobs.filter(j => j.job_type !== 'internship').length,
    internships: jobs.filter(j => j.job_type === 'internship').length,
    news:        news.length,
  };
  await chrome.storage.local.set({ lastCrawl: new Date().toISOString(), crawlStats: stats });
  return { success: true, total: jobs.length + news.length, ...stats };
}

// ════════════════════════════════════════════════════════
// MESSAGE LISTENER
// ════════════════════════════════════════════════════════
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'SETUP_ALARM') {
    chrome.alarms.create('hourly-crawl', { periodInMinutes: 60 });
    sendResponse({ ok: true });
    return true;
  }
  if (msg.action === 'CRAWL_NOW') {
    const { backendUrl, crawlerSecret, sources } = msg;
    doCrawl(backendUrl, crawlerSecret, sources || ['remotive','arbeitnow','devto','hn'])
      .then(r  => sendResponse(r))
      .catch(e => sendResponse({ success: false, error: e.message }));
    return true;
  }
});

// ════════════════════════════════════════════════════════
// HOURLY ALARM
// ════════════════════════════════════════════════════════
chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== 'hourly-crawl') return;
  const data = await chrome.storage.local.get(['backendUrl','crawlerSecret','selectedSources']);
  try {
    await doCrawl(
      data.backendUrl     || 'https://www.graduatenex.online',
      data.crawlerSecret  || '',
      data.selectedSources || ['remotive','arbeitnow','devto','hn','linkedin','naukri','internshala','indeed']
    );
  } catch(e) { console.error('[GN Crawler] hourly failed:', e.message); }
});
