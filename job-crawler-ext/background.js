// GraduateNex Job Crawler — background.js v3.0
// Sources: LinkedIn · Naukri · Internshala · Indeed · Remotive · Arbeitnow · Dev.to · HN

// ── Role categorizer
function categorizeRole(title = '') {
  const t = title.toLowerCase();
  if (/frontend|front-end|react|vue|angular|ui dev|css|html/.test(t))           return 'frontend';
  if (/backend|back-end|node\.?js|django|flask|spring|java dev|express/.test(t)) return 'backend';
  if (/fullstack|full.?stack|full stack/.test(t))                                return 'fullstack';
  if (/\bai\b|machine learning|deep learn|\bnlp\b|\bllm\b|data scien|tensorflow|pytorch/.test(t)) return 'ai-ml';
  if (/android|ios|flutter|react native|mobile dev/.test(t))                    return 'mobile';
  if (/devops|cloud|aws|azure|gcp|kubernetes|docker|sre|platform eng|infra/.test(t)) return 'devops';
  if (/data eng|data anal|\bsql\b|power bi|tableau|bi dev/.test(t))            return 'data';
  if (/design|figma|\bux\b|ui\/ux|product design/.test(t))                     return 'design';
  return 'software';
}
function classifyType(text = '') {
  const t = text.toLowerCase();
  if (/intern/.test(t)) return 'internship';
  if (/contract/.test(t)) return 'contract';
  return 'full-time';
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ════════════════════════════════════════════════════════
// FREE API SOURCES (no browser tab needed)
// ════════════════════════════════════════════════════════
async function fetchRemotive() {
  try {
    const r = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=50');
    const d = await r.json();
    return (d.jobs || []).map(j => ({
      title: j.title, company: j.company_name,
      location: j.candidate_required_location || 'Remote',
      job_type: classifyType(j.job_type || ''),
      role_category: categorizeRole(j.title),
      description: (j.description||'').replace(/<[^>]+>/g,'').slice(0,400),
      url: j.url, salary: j.salary||'', source:'remotive',
      posted_at: j.publication_date,
    }));
  } catch(e) { return []; }
}

async function fetchArbeitnow() {
  try {
    const r = await fetch('https://www.arbeitnow.com/api/job-board-api?page=1');
    const d = await r.json();
    return (d.data||[]).map(j => ({
      title: j.title, company: j.company_name,
      location: j.location||'Remote',
      job_type: classifyType((j.tags||[]).join(' ')),
      role_category: categorizeRole(j.title),
      description: (j.description||'').replace(/<[^>]+>/g,'').slice(0,400),
      url: j.url, salary:'', source:'arbeitnow',
      posted_at: j.created_at,
    }));
  } catch(e) { return []; }
}

async function fetchDevTo() {
  try {
    let articles = [];
    for (const tag of ['ai','machinelearning','career','jobs','programming']) {
      const r = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=10&top=1`);
      articles = articles.concat(await r.json());
    }
    const seen = new Set();
    return articles.filter(a => !seen.has(a.id) && seen.add(a.id)).map(a => ({
      title: a.title, summary: a.description||'',
      url: a.url, source:'dev.to', author: a.user?.name||'',
      published_at: a.published_at,
      tags: (a.tag_list||[]).slice(0,5),
      cover_image: a.cover_image||'', reactions: a.positive_reactions_count||0,
    }));
  } catch(e) { return []; }
}

async function fetchHackerNews() {
  try {
    const ids = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(r=>r.json());
    const stories = await Promise.all(
      ids.slice(0,30).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r=>r.json()).catch(()=>null)
      )
    );
    const kws = ['ai','llm','openai','claude','gemini','gpt','machine learning','neural','hiring','job','software','developer','startup','career'];
    return stories.filter(s => s?.url && s.title && kws.some(k => s.title.toLowerCase().includes(k))).map(s => ({
      title: s.title, summary:'', url: s.url, source:'hackernews',
      author: s.by||'',
      published_at: s.time ? new Date(s.time*1000).toISOString() : new Date().toISOString(),
      tags:['tech','news'], reactions: s.score||0,
    }));
  } catch(e) { return []; }
}

// ════════════════════════════════════════════════════════
// TAB-BASED SCRAPER — open real tab, inject extractor
// ════════════════════════════════════════════════════════
async function scrapeTab(url, extractFn, waitMs = 5000) {
  return new Promise(resolve => {
    chrome.tabs.create({ url, active: false }, tab => {
      let done = false;
      const timeout = setTimeout(() => {
        if (done) return; done = true;
        chrome.tabs.onUpdated.removeListener(onUpd);
        chrome.tabs.remove(tab.id).catch(()=>{});
        resolve([]);
      }, 25000);

      const onUpd = (id, info) => {
        if (id !== tab.id || info.status !== 'complete' || done) return;
        done = true;
        clearTimeout(timeout);
        chrome.tabs.onUpdated.removeListener(onUpd);

        // Extra wait for JS rendering
        setTimeout(() => {
          chrome.scripting.executeScript(
            { target: { tabId: tab.id }, func: extractFn },
            results => {
              chrome.tabs.remove(tab.id).catch(()=>{});
              const data = results?.[0]?.result;
              resolve(Array.isArray(data) ? data : []);
            }
          );
        }, waitMs);
      };
      chrome.tabs.onUpdated.addListener(onUpd);
    });
  });
}

// ════════════════════════════════════════════════════════
// EXTRACTOR FUNCTIONS — run inside the target tab
// ════════════════════════════════════════════════════════

// ── LinkedIn jobs (works logged in + public)
function extractLinkedIn() {
  const results = [];
  // Try all possible card containers
  const cardSels = [
    '.jobs-search-results__list-item',   // logged in
    '.base-search-card',                  // public
    '.job-search-card',
    'li[class*="result"]',
    '[data-entity-urn*="jobPosting"]',
  ];
  let cards = [];
  for (const s of cardSels) {
    const found = document.querySelectorAll(s);
    if (found.length) { cards = Array.from(found); break; }
  }

  cards.forEach(card => {
    const titleEl = 
      card.querySelector('.base-search-card__title') ||
      card.querySelector('.job-card-list__title--link') ||
      card.querySelector('a[href*="/jobs/view/"]') ||
      card.querySelector('h3 a');

    const companyEl =
      card.querySelector('.base-search-card__subtitle') ||
      card.querySelector('.job-card-container__company-name') ||
      card.querySelector('h4');

    const locEl =
      card.querySelector('.job-search-card__location') ||
      card.querySelector('.job-card-container__metadata-item') ||
      card.querySelector('.base-search-card__metadata span');

    const linkEl =
      card.querySelector('a[href*="/jobs/view/"]') ||
      card.querySelector('a.base-card__full-link') ||
      card.querySelector('a[href*="linkedin.com/jobs"]');

    const title = titleEl?.textContent?.trim() || titleEl?.getAttribute('title');
    const url   = (linkEl || titleEl)?.href;

    if (title && url && url.includes('linkedin.com/jobs')) {
      results.push({
        title,
        company:  companyEl?.textContent?.trim() || '',
        location: locEl?.textContent?.trim()     || 'India',
        url:      url.split('?')[0],
        source:   'linkedin',
        posted_at: new Date().toISOString(),
      });
    }
  });
  return results.slice(0, 30);
}

// ── Naukri jobs
function extractNaukri() {
  const results = [];
  // Naukri uses either old or new design
  const cardSels = [
    '.cust-job-tuple',
    '.jobTuple',
    '[class*="jobTuple"]',
    'article[class*="job"]',
    '.srp-jobtuple-wrapper',
    '.job-post',
  ];
  let cards = [];
  for (const s of cardSels) {
    const found = document.querySelectorAll(s);
    if (found.length) { cards = Array.from(found); break; }
  }

  // Fallback: try generic job link detection
  if (!cards.length) {
    const allLinks = Array.from(document.querySelectorAll('a[href*="naukri.com/job-listings"]'));
    allLinks.forEach(a => {
      const title = a.textContent.trim();
      if (title && a.href) {
        results.push({
          title, company: '', location: 'India',
          url: a.href.split('?')[0], source: 'naukri',
          posted_at: new Date().toISOString(),
        });
      }
    });
    return results.slice(0, 25);
  }

  cards.forEach(card => {
    const titleEl =
      card.querySelector('a.title, [class*="title"] a, h2 a, h3 a') ||
      card.querySelector('a[href*="naukri.com"]');

    const compEl =
      card.querySelector('.companyInfo a, [class*="companyName"] a, [class*="company"] a') ||
      card.querySelector('[class*="companyName"]');

    const locEl =
      card.querySelector('[class*="location"] li, [class*="loc"] span, .location') ||
      card.querySelector('li.fleft');

    const salEl = card.querySelector('[class*="salary"], [class*="sal"]');

    const title = titleEl?.textContent?.trim();
    const url   = titleEl?.href;
    if (title && url && url.includes('naukri.com')) {
      results.push({
        title, company: compEl?.textContent?.trim()||'',
        location: locEl?.textContent?.trim()||'India',
        url: url.split('?')[0], salary: salEl?.textContent?.trim()||'',
        source: 'naukri', posted_at: new Date().toISOString(),
      });
    }
  });
  return results.slice(0, 25);
}

// ── Internshala
function extractInternshala() {
  const results = [];
  const cardSels = [
    '.internship_meta',
    '.individual_internship',
    '[id^="internship_"]',
    '.job-internship-card',
    '.internship-card',
  ];
  let cards = [];
  for (const s of cardSels) {
    const found = document.querySelectorAll(s);
    if (found.length) { cards = Array.from(found); break; }
  }

  // Fallback: grab all internshala job links
  if (!cards.length) {
    document.querySelectorAll('a[href*="internshala.com/internship/detail"], a[href*="internshala.com/jobs/detail"]').forEach(a => {
      const title = a.textContent.trim();
      if (title) results.push({
        title, company:'', location:'India',
        url: a.href.split('?')[0], source:'internshala', job_type:'internship',
        posted_at: new Date().toISOString(),
      });
    });
    return results.slice(0, 25);
  }

  cards.forEach(card => {
    const titleEl =
      card.querySelector('.heading_4_5 a, .profile a, h3 a, .job-title-href') ||
      card.querySelector('a[href*="/internship/detail"], a[href*="/job/detail"]');
    const compEl  = card.querySelector('.company_name a, .link_display_like_text, [class*="company"]');
    const locEl   = card.querySelector('.location_link, .location span, [class*="location"]');
    const stipEl  = card.querySelector('.stipend, [class*="stipend"]');

    const title = titleEl?.textContent?.trim();
    const href  = titleEl?.href || titleEl?.getAttribute('href');
    if (title && href) {
      const url = href.startsWith('http') ? href : 'https://internshala.com' + href;
      results.push({
        title, company: compEl?.textContent?.trim()||'',
        location: locEl?.textContent?.trim()||'India',
        url: url.split('?')[0], salary: stipEl?.textContent?.trim()||'',
        source: 'internshala', job_type: 'internship',
        posted_at: new Date().toISOString(),
      });
    }
  });
  return results.slice(0, 25);
}

// ── Indeed India
function extractIndeed() {
  const results = [];
  const cardSels = [
    '[data-jk]',
    '.job_seen_beacon',
    '.tapItem',
    '.resultContent',
    '.jobsearch-SerpJobCard',
  ];
  let cards = [];
  for (const s of cardSels) {
    const found = document.querySelectorAll(s);
    if (found.length) { cards = Array.from(found); break; }
  }

  cards.forEach(card => {
    const titleEl =
      card.querySelector('[data-testid="jobTitle"] a') ||
      card.querySelector('h2.jobTitle a, .jobTitle a') ||
      card.querySelector('[id^="jobTitle"] a') ||
      card.querySelector('a[href*="/rc/clk"], a[href*="/viewjob"]');

    const compEl  = card.querySelector('[data-testid="company-name"], .companyName, [class*="company"]');
    const locEl   = card.querySelector('[data-testid="text-location"], .companyLocation');
    const salEl   = card.querySelector('[data-testid="attribute_snippet_testid"], .salary-snippet-container');

    const title = titleEl?.textContent?.trim();
    const jk    = card.getAttribute('data-jk');
    const url   = titleEl?.href || (jk ? `https://in.indeed.com/viewjob?jk=${jk}` : '');

    if (title && url) {
      results.push({
        title, company: compEl?.textContent?.trim()||'',
        location: locEl?.textContent?.trim()||'India',
        url: url.split('&')[0], salary: salEl?.textContent?.trim()||'',
        source: 'indeed', posted_at: new Date().toISOString(),
      });
    }
  });
  return results.slice(0, 25);
}

// ════════════════════════════════════════════════════════
// SITE SCRAPERS — pick right URLs + extractor
// ════════════════════════════════════════════════════════
async function scrapeLinkedIn(log) {
  const queries = [
    'software+engineer+fresher+india',
    'software+developer+fresher',
    'python+developer+fresher',
    'frontend+developer+fresher',
  ];
  let all = [];
  for (const q of queries.slice(0, 2)) {
    const url = `https://www.linkedin.com/jobs/search/?keywords=${q}&location=India&f_TPR=r86400&f_E=1%2C2`;
    await log(`Opening LinkedIn: ${q}...`);
    const jobs = await scrapeTab(url, extractLinkedIn, 5000);
    await log(`LinkedIn (${q}): ${jobs.length} jobs`, jobs.length ? 'success' : 'warn');
    all = all.concat(jobs);
    await sleep(1500);
  }
  return all;
}

async function scrapeNaukri(log) {
  const urls = [
    'https://www.naukri.com/fresher-software-developer-jobs',
    'https://www.naukri.com/software-engineer-jobs-in-india',
    'https://www.naukri.com/python-developer-jobs-in-india',
  ];
  let all = [];
  for (const url of urls.slice(0, 2)) {
    await log(`Opening Naukri: ${url.split('/').pop()}...`);
    const jobs = await scrapeTab(url, extractNaukri, 6000);
    await log(`Naukri: ${jobs.length} jobs`, jobs.length ? 'success' : 'warn');
    all = all.concat(jobs);
    await sleep(1500);
  }
  return all;
}

async function scrapeInternshala(log) {
  const urls = [
    'https://internshala.com/internships/computer-science-engineering-internship/',
    'https://internshala.com/internships/machine-learning-internship/',
    'https://internshala.com/internships/web-development-internship/',
  ];
  let all = [];
  for (const url of urls.slice(0, 2)) {
    await log(`Opening Internshala: ${url.split('/').filter(Boolean).pop()}...`);
    const jobs = await scrapeTab(url, extractInternshala, 5000);
    await log(`Internshala: ${jobs.length} internships`, jobs.length ? 'success' : 'warn');
    all = all.concat(jobs);
    await sleep(1200);
  }
  return all;
}

async function scrapeIndeed(log) {
  const urls = [
    'https://in.indeed.com/jobs?q=software+engineer+fresher&l=India&fromage=3&sort=date',
    'https://in.indeed.com/jobs?q=software+developer+0-1+years&l=India&fromage=3',
  ];
  let all = [];
  for (const url of urls.slice(0, 2)) {
    await log(`Opening Indeed India...`);
    const jobs = await scrapeTab(url, extractIndeed, 6000);
    await log(`Indeed: ${jobs.length} jobs`, jobs.length ? 'success' : 'warn');
    all = all.concat(jobs);
    await sleep(1500);
  }
  return all;
}

// ════════════════════════════════════════════════════════
// PUSH TO SITE
// ════════════════════════════════════════════════════════
async function pushToSite(backendUrl, secret, jobs, news) {
  const res = await fetch(`${backendUrl.replace(/\/$/,'')}/api/jobs-feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-crawler-secret': secret || '' },
    body: JSON.stringify({ jobs, news }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return await res.json();
}

// ════════════════════════════════════════════════════════
// MAIN CRAWL
// ════════════════════════════════════════════════════════
async function doCrawl(backendUrl, secret, sources) {
  const log = (text, type = 'info') =>
    chrome.runtime.sendMessage({ action: 'CRAWL_LOG', text, type }).catch(()=>{});

  await log(`🚀 Crawl started: [${sources.join(', ')}]`);

  let jobs = [], news = [];

  // Free API sources
  if (sources.includes('remotive')) {
    await log('Fetching Remotive API...');
    const r = await fetchRemotive();
    jobs = jobs.concat(r);
    await log(`✅ Remotive: ${r.length} jobs`, 'success');
  }
  if (sources.includes('arbeitnow')) {
    await log('Fetching Arbeitnow API...');
    const r = await fetchArbeitnow();
    jobs = jobs.concat(r);
    await log(`✅ Arbeitnow: ${r.length} jobs`, 'success');
  }
  if (sources.includes('devto')) {
    await log('Fetching Dev.to articles...');
    const r = await fetchDevTo();
    news = news.concat(r);
    await log(`✅ Dev.to: ${r.length} articles`, 'success');
  }
  if (sources.includes('hn')) {
    await log('Fetching Hacker News...');
    const r = await fetchHackerNews();
    news = news.concat(r);
    await log(`✅ HN: ${r.length} stories`, 'success');
  }

  // Browser tab scrapers
  if (sources.includes('linkedin')) {
    const r = await scrapeLinkedIn(log);
    jobs = jobs.concat(r.map(j => ({
      ...j, job_type: classifyType(j.title), role_category: categorizeRole(j.title), description:'', salary:''
    })));
    await log(`✅ LinkedIn total: ${r.length} jobs`, r.length ? 'success' : 'warn');
  }
  if (sources.includes('naukri')) {
    const r = await scrapeNaukri(log);
    jobs = jobs.concat(r.map(j => ({
      ...j, job_type: classifyType(j.title), role_category: categorizeRole(j.title), description:''
    })));
    await log(`✅ Naukri total: ${r.length} jobs`, r.length ? 'success' : 'warn');
  }
  if (sources.includes('internshala')) {
    const r = await scrapeInternshala(log);
    jobs = jobs.concat(r.map(j => ({
      ...j, job_type: 'internship', role_category: categorizeRole(j.title), description:''
    })));
    await log(`✅ Internshala total: ${r.length} internships`, r.length ? 'success' : 'warn');
  }
  if (sources.includes('indeed')) {
    const r = await scrapeIndeed(log);
    jobs = jobs.concat(r.map(j => ({
      ...j, job_type: classifyType(j.title), role_category: categorizeRole(j.title), description:''
    })));
    await log(`✅ Indeed total: ${r.length} jobs`, r.length ? 'success' : 'warn');
  }

  // Dedupe by URL
  const seen = new Set();
  jobs = jobs.filter(j => j.url && !seen.has(j.url) && seen.add(j.url));
  news = news.filter(n => n.url && !seen.has(n.url) && seen.add(n.url));

  await log(`📦 Pushing ${jobs.length} jobs + ${news.length} news to GraduateNex...`);

  try {
    const result = await pushToSite(backendUrl, secret, jobs, news);
    await log(`🎉 Done! ${result.inserted || (jobs.length + news.length)} items saved.`, 'success');
  } catch(e) {
    await log(`⚠️ Push error: ${e.message} — data still collected locally`, 'warn');
  }

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
    doCrawl(
      msg.backendUrl    || 'https://www.graduatenex.online',
      msg.crawlerSecret || '',
      msg.sources       || ['remotive','arbeitnow','devto','hn']
    ).then(r  => sendResponse(r))
     .catch(e => sendResponse({ success:false, error: e.message }));
    return true;
  }
});

// ════════════════════════════════════════════════════════
// HOURLY ALARM
// ════════════════════════════════════════════════════════
chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== 'hourly-crawl') return;
  const d = await chrome.storage.local.get(['backendUrl','crawlerSecret','selectedSources']);
  try {
    await doCrawl(
      d.backendUrl    || 'https://www.graduatenex.online',
      d.crawlerSecret || '',
      d.selectedSources || ['remotive','arbeitnow','devto','hn','linkedin','naukri','internshala','indeed']
    );
  } catch(e) { console.error('[GN Crawler] hourly failed:', e.message); }
});
