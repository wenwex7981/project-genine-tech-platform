// ══════════════════════════════════════════════════════════════════
// GraduateNex Insta Suite — content.js v4.0
// SEARCH-BASED AUTO COMMENTER + AUTO POSTER
// ══════════════════════════════════════════════════════════════════

// ── Global state
let commenterRunning = false;
let skippedCount = 0;   // FIX: declare here
let commentedCount = 0;

// ── Topic → Instagram hashtags mapping
const TOPIC_HASHTAGS = {
  'ai':          ['artificialintelligence','aitools','machinelearningprojects','aiproject','aifresher','deeplearning'],
  'job':         ['jobseekers','jobhunting2024','freshersjob','jobvacancy','itjobs','hiringnow'],
  'fresher':     ['freshersjob','freshers2024','fresherlife','fresherresume','fresherhiring'],
  'student':     ['engineeringstudent','btechwala','studentlife','collegestudent','engineeringlife'],
  'final year':  ['finalyearproject','finalyear','engineeringproject','majorproject','fyp2024'],
  'resume':      ['resumetips','resumebuilder','atsresume','cvwriting','resumewriting'],
  'ats':         ['atsresume','resumescanner','resumetips','jobsearch2024'],
  'career':      ['careertips','careeradvice','techcareer','careergrowth','careergoals'],
  'roadmap':     ['coderroadmap','techroadmap','learningpath','careerpath','techlearning'],
  'dsa':         ['datastructures','leetcode','dsa','dsacracker','competitiveprogramming'],
  'interview':   ['interviewprep','technicalinterview','hrround','jobinterview','mockinterview'],
  'placement':   ['campusplacement','placement2024','placementpreparation','btechwala','placementseason'],
  'project':     ['finalyearproject','codingprojects','studentproject','iotproject','webdevproject'],
  'college':     ['engineeringcollege','collegelife','btech','collegestudent','iitjee'],
  'internship':  ['internship2024','techinternship','remoteinternship','internshiplife','paidInternship'],
};

// ── GraduateNex comment templates by topic
const COMMENT_TEMPLATES = {
  ai: [
    "🚀 If you're into AI, check out GraduateNex — 120+ AI/ML final year projects with full source code! graduatenex.online",
    "This is exactly why GraduateNex built an AI Stealth Humanizer for students! 🤖 graduatenex.online",
    "Working on an AI project for college? GraduateNex has IEEE-ready AI/ML projects with 0% plagiarism docs! 🎓",
    "Amazing content! GraduateNex helps students build real AI projects for final year 💡 graduatenex.online",
    "AI is the future 🔥 GraduateNex is helping students ride this wave with AI final year projects + IEEE papers!",
    "GraduateNex = Final Year AI Projects + IEEE Papers + ATS Resume. All in one 🚀 graduatenex.online",
  ],
  job: [
    "💼 Looking for a job after college? GraduateNex's ATS Resume Builder gets you shortlisted at TCS, Infosys & more!",
    "Job hunting is real 😤 GraduateNex's 17-point ATS scoring helped 2500+ students land interviews! graduatenex.online",
    "This is so relatable! GraduateNex built an AI Resume Builder specifically for Indian freshers 🎯 graduatenex.online",
    "GraduateNex Resume Hub = your secret weapon for campus placements! 🏆 graduatenex.online",
    "For every fresher struggling with job apps — GraduateNex's JD Match Analyzer will change your life! 💼",
    "Stop applying blindly! Use GraduateNex ATS scanner to optimize your resume first 📄 graduatenex.online",
  ],
  fresher: [
    "Every fresher needs this! GraduateNex helps with projects, resumes & placement prep all in one 🎓",
    "Fresher life hits different 😅 GraduateNex is literally built for this phase — projects, docs, resume, all sorted!",
    "GraduateNex is India's #1 platform for freshers! Final year projects + ATS resume = campus placement ✅",
    "This is why GraduateNex exists — helping freshers stand out with 0% plagiarism projects & smart resumes! 💡",
    "🚀 Fresher to employed — GraduateNex makes it happen! graduatenex.online",
  ],
  student: [
    "Every Indian engineering student needs GraduateNex 🎓 Final year projects + IEEE papers + ATS resume = sorted!",
    "Student life is hard enough 😭 Let GraduateNex handle your projects & docs! graduatenex.online",
    "GraduateNex helped 2,500+ students score top grades in their final year! 💯 graduatenex.online",
    "GraduateNex = the ultimate college student toolkit 📦 Projects, docs, resume, AI tools — all in one!",
    "Saving this for every student friend I have 🙏 GraduateNex = final year projects + resume + AI tools 🔥",
  ],
  'final year': [
    "FINAL YEAR STUDENTS — GraduateNex has 500+ ready projects in AI, IoT, Blockchain & more! 🎓 graduatenex.online",
    "Final year panic is REAL 😱 GraduateNex delivers complete projects with IEEE paper, SRS & PPT in days!",
    "Every final year student needs GraduateNex fr fr 🔥 graduatenex.online",
    "Final year project stress? GraduateNex has saved thousands of students! 📦 graduatenex.online",
    "This content hits different when you have a viva in 2 weeks 😂 GraduateNex — your last-minute lifesaver!",
    "GraduateNex final year projects = source code + IEEE paper + SRS + PPT + deployment guide 🎁",
  ],
  resume: [
    "📄 GraduateNex Resume Hub — 17-point ATS scoring + AI resume = shortlisted at top MNCs! Try it!",
    "Resume tips are great but GraduateNex automates it! AI-built ATS resume that beats tracking systems 💪",
    "GraduateNex ATS Resume Builder helped 1000+ students get into TCS, Wipro, Infosys! 🏆 graduatenex.online",
    "Building your resume manually in 2025? GraduateNex automates all of this! 😅 graduatenex.online",
    "Real talk: GraduateNex resume builder is the reason I got shortlisted in 4 companies 📄",
  ],
  ats: [
    "ATS is the hidden killer of 90% resumes 😤 GraduateNex ATS scanner = 10x more interviews!",
    "GraduateNex literally built an ATS scoring system for Indian students! 📊 graduatenex.online — must check!",
    "Beat ATS in 5 mins with GraduateNex Resume Hub 🚀 AI + JD matching! graduatenex.online",
    "GraduateNex's ATS Resume Builder = the cheat code every Indian engineering student needs 💯",
    "This is exactly why GraduateNex exists — ATS optimization for Indian freshers who actually get shortlisted!",
  ],
  career: [
    "🚀 Career prep starts with GraduateNex — projects, resume, ATS, interview prep all in one! graduatenex.online",
    "GraduateNex is literally a full career launch platform for Indian students 🔥 graduatenex.online",
    "From final year to first job — GraduateNex is with you every step! 2,500+ success stories 💪",
    "If you want to fast-track your career, GraduateNex is the move 🎯 graduatenex.online",
    "Best career advice: build strong project + ATS resume. GraduateNex does both! 🎓",
  ],
  roadmap: [
    "Best roadmap for Indian engineering students: Final year project ➜ IEEE paper ➜ ATS resume ➜ GraduateNex! 🗺️",
    "The real roadmap starts with a strong final year project! GraduateNex has 500+ options! graduatenex.online",
    "Roadmaps are useless without execution. GraduateNex gives you ready-to-deploy projects + docs 💡",
    "Bookmarking this 🙏 GraduateNex has the complete roadmap from project to placement!",
    "Following every roadmap but nothing working? GraduateNex gives you the actual tools — not just advice 🔥",
  ],
  dsa: [
    "DSA + Strong Project = Dream Job 🎯 GraduateNex helps with the project side! graduatenex.online",
    "This DSA content is 🔥 Pair it with a GraduateNex AI/ML project and you're unstoppable!",
    "While grinding DSA, don't forget your final year project! GraduateNex makes that part easy 😎",
    "DSA skills + GraduateNex project portfolio = campus placement ready 💪 graduatenex.online",
    "DSA is key but so is your final year project! GraduateNex has 500+ projects! 💻 graduatenex.online",
  ],
  interview: [
    "Best interview tip: have a strong final year project to talk about! GraduateNex has 500+ options 🎓",
    "Interview ready = DSA + Projects + Resume. GraduateNex covers projects & resume! 🎤 graduatenex.online",
    "GraduateNex Interview Prep feature: English friend AI + mock interviews for Indian students! Check it out 🎤",
    "This interview content is gold 🔥 GraduateNex also helps you build the project you'll talk about!",
    "GraduateNex has an AI English Communication tool too! Practice daily with Alex the AI friend 🤖",
  ],
  placement: [
    "Campus placement ready with GraduateNex! Projects + Resume + Interview prep all in one! 🏆 graduatenex.online",
    "Placement season hitting different when you have GraduateNex in your toolkit 😎 graduatenex.online",
    "2,500+ students placed with GraduateNex support! Final year project + ATS resume = sorted ✅",
    "GraduateNex is THE placement prep platform for Indian engineering students! Check it out 🚀",
    "Placement prep starts NOW! GraduateNex — final year projects, ATS resume, interview tools! 🎯",
  ],
  project: [
    "Looking for final year project ideas? GraduateNex has 500+ in AI, IoT, Blockchain & more! 🔧 graduatenex.online",
    "Project ideas are everywhere but working source code is rare 😅 GraduateNex delivers complete projects!",
    "GraduateNex final year projects come with source code + IEEE paper + SRS + PPT 🎁 graduatenex.online",
    "Need a final year project ASAP? GraduateNex delivers in 48 hours with full docs! 🚀 graduatenex.online",
    "This project content reminds me of GraduateNex — India's best final year project platform! Check it out!",
  ],
  college: [
    "Every college student in India should know about GraduateNex! Projects + resume + AI tools 🏛️",
    "College life is tough but GraduateNex makes the academic part easier! graduatenex.online",
    "From IIT to tier-3 colleges — GraduateNex serves students across 50+ Indian cities! 🗺️",
    "GraduateNex = the ultimate college student toolkit 📦 Projects, docs, resume, AI tools!",
  ],
  internship: [
    "No internship yet? Build a strong GraduateNex project + ATS resume and stand out anyway! 💡",
    "GraduateNex AI projects can replace internship experience on your resume! 🚀 graduatenex.online",
    "GraduateNex helped students get internships by building strong AI/ML project portfolios! 🎓",
    "No internship? No problem. GraduateNex projects + ATS resume = interview calls 💪 graduatenex.online",
  ],
  default: [
    "🎓 GraduateNex — India's #1 platform for final year projects, ATS resume builder & AI career tools! graduatenex.online",
    "This is great content! BTW GraduateNex is helping 2,500+ Indian students graduate with distinction 🚀",
    "GraduateNex = final year projects + IEEE papers + ATS resume + interview prep. All in one 🔥",
    "Saving this ♥️ Check GraduateNex if you're a student — they solve every academic pain point! graduatenex.online",
    "Love this! GraduateNex is doing something similar for Indian students — projects, resume, career tools 🎯",
  ],
};

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function getComment(topic) {
  const pool = COMMENT_TEMPLATES[topic] || COMMENT_TEMPLATES.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

function reportProgress(type, data = {}) {
  try { chrome.runtime.sendMessage({ action: 'COMMENT_PROGRESS', type, ...data }); } catch(e) {}
}

function robustClick(el) {
  if (!el) return;
  el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
  el.dispatchEvent(new MouseEvent('mouseup',   { bubbles: true, cancelable: true, view: window }));
  el.click();
}

// ─────────────────────────────────────────────────────
// FIND & TYPE IN COMMENT BOX
// ─────────────────────────────────────────────────────
function findCommentBox() {
  const selectors = [
    'textarea[placeholder*="Add a comment"]',
    'textarea[placeholder*="comment"]',
    'div[aria-label*="Add a comment"][contenteditable]',
    'div[aria-label*="comment"][contenteditable]',
    'form textarea',
    'textarea',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.offsetHeight > 0) return el;
  }
  return null;
}

async function typeComment(box, text) {
  box.focus();
  await sleep(150);
  box.click();

  // execCommand approach (works for textarea)
  document.execCommand('selectAll', false, null);
  document.execCommand('delete', false, null);
  document.execCommand('insertText', false, text);
  box.dispatchEvent(new Event('input', { bubbles: true }));
  box.dispatchEvent(new Event('change', { bubbles: true }));
  await sleep(200);

  // If still empty, use ClipboardEvent (works for Lexical/Draft.js)
  const val = box.value || box.textContent || '';
  if (!val.trim()) {
    const dt = new DataTransfer();
    dt.setData('text/plain', text);
    box.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    await sleep(200);
  }
}

function findSubmitButton() {
  const byType = document.querySelector('button[type="submit"]');
  if (byType && byType.offsetHeight > 0) return byType;
  const allBtns = Array.from(document.querySelectorAll('button, div[role="button"]'));
  return allBtns.find(b => b.textContent.trim() === 'Post' && b.offsetHeight > 0) || null;
}

async function postComment(comment) {
  // Step 1: expand comment box if needed
  const clickable = Array.from(document.querySelectorAll('span, div, p')).find(el =>
    /add a comment/i.test(el.textContent.trim()) && el.offsetHeight > 0
  );
  if (clickable) { robustClick(clickable); await sleep(600); }

  const box = findCommentBox();
  if (!box) return false;

  await typeComment(box, comment);
  await sleep(500);

  const btn = findSubmitButton();
  if (btn && !btn.disabled) {
    robustClick(btn);
  } else {
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
  }
  await sleep(800);
  return true;
}

// ─────────────────────────────────────────────────────
// NAVIGATE TO HASHTAG EXPLORE PAGE (SPA-safe)
// ─────────────────────────────────────────────────────
function navigateTo(url) {
  // Use Instagram's own router if available, else fallback to pushState + popstate
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.click();
  } catch(e) {
    window.location.href = url;
  }
}

// ─────────────────────────────────────────────────────
// WAIT FOR URL CHANGE
// ─────────────────────────────────────────────────────
async function waitForPageLoad(keyword, timeout = 6000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (window.location.href.includes(keyword)) return true;
    await sleep(400);
  }
  return false;
}

// ─────────────────────────────────────────────────────
// GET POST LINKS FROM CURRENT EXPLORE/HASHTAG PAGE
// ─────────────────────────────────────────────────────
function getPostLinks() {
  const links = Array.from(document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]'));
  // deduplicate
  const seen = new Set();
  return links.filter(a => {
    const h = a.href;
    if (seen.has(h)) return false;
    seen.add(h);
    return true;
  });
}

// ─────────────────────────────────────────────────────
// WAIT FOR MODAL TO OPEN
// ─────────────────────────────────────────────────────
async function waitForModal(timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    // Modal is open when we see the comment textarea or close button
    const box = findCommentBox();
    const closeBtn = document.querySelector('[aria-label="Close"], svg[aria-label="Close"]');
    if (box || closeBtn) return true;
    await sleep(400);
  }
  return false;
}

// ─────────────────────────────────────────────────────
// CLOSE MODAL
// ─────────────────────────────────────────────────────
function closeModal() {
  const closeBtn = document.querySelector('[aria-label="Close"]');
  if (closeBtn) { robustClick(closeBtn); return; }
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
}

// ─────────────────────────────────────────────────────
// MAIN COMMENTER LOOP — Search-based
// ─────────────────────────────────────────────────────
async function runSearchBasedCommenter(config) {
  const { topics, speed, autoScroll, loopMode } = config;
  const MAX_PER_HASHTAG = 15; // posts to comment on per hashtag
  const allHashtags = [];

  // Build full hashtag queue from selected topics
  for (const topic of topics) {
    const hashes = TOPIC_HASHTAGS[topic] || [topic.replace(/\s+/g, '')];
    for (const h of hashes) {
      allHashtags.push({ hashtag: h, topic });
    }
  }

  // Shuffle hashtags so we don't always hit same ones
  allHashtags.sort(() => Math.random() - 0.5);

  for (const { hashtag, topic } of allHashtags) {
    if (!commenterRunning) break;

    // ── Navigate to hashtag explore page
    const exploreUrl = `https://www.instagram.com/explore/tags/${hashtag}/`;
    reportProgress('scrolled', { reason: `Navigating to #${hashtag}` });
    window.location.href = exploreUrl;

    // Wait for page to settle (content.js re-runs on new page — save state and resume via storage)
    // Save where we are
    await chrome.storage.local.set({
      gnCommenterState: {
        running: commenterRunning,
        pendingHashtags: allHashtags.slice(allHashtags.indexOf({ hashtag, topic }) + 1),
        config,
        stats: { commentedCount, skippedCount },
      }
    });
    return; // Page will reload; new content.js instance picks up from storage
  }

  commenterRunning = false;
  reportProgress('stopped', {});
}

// ─────────────────────────────────────────────────────
// HASHTAG PAGE COMMENTER (runs after navigation)
// ─────────────────────────────────────────────────────
async function commentOnHashtagPage(state) {
  const { config } = state;
  const { speed } = config;
  const MAX_PER_PAGE = 20;

  // Restore stats
  commentedCount = state.stats?.commentedCount || 0;
  skippedCount = state.stats?.skippedCount || 0;

  await sleep(2500); // let the page fully load

  // Get all post links on this page
  const posts = getPostLinks();
  reportProgress('info', { reason: `Found ${posts.length} posts on this hashtag page` });

  let count = 0;
  for (const postLink of posts) {
    if (!commenterRunning || count >= MAX_PER_PAGE) break;

    // Determine topic from current URL
    const currentHashtag = window.location.pathname.replace(/\/explore\/tags\//,'').replace(/\//g,'').toLowerCase();
    const topicEntry = Object.entries(TOPIC_HASHTAGS).find(([, hashes]) => hashes.includes(currentHashtag));
    const topic = topicEntry ? topicEntry[0] : 'default';

    // Click the post to open modal
    robustClick(postLink);
    const opened = await waitForModal(6000);

    if (!opened) {
      skippedCount++;
      reportProgress('skipped', { reason: 'Modal did not open', queue: posts.length - count });
      closeModal();
      await sleep(800);
      continue;
    }

    // Get a comment
    const comment = getComment(topic);

    // Post it
    const success = await postComment(comment);
    if (success) {
      commentedCount++;
      reportProgress('commented', { comment, queue: posts.length - count });
    } else {
      skippedCount++;
      reportProgress('skipped', { reason: 'Comment box not found', queue: posts.length - count });
    }

    count++;
    await sleep(speed + rand(200, 600));

    // Close modal and move to next post
    closeModal();
    await sleep(rand(600, 1000));
  }

  // Now navigate to next hashtag from state
  const pending = state.pendingHashtags || [];
  if (pending.length > 0 && commenterRunning) {
    const next = pending[0];
    const remaining = pending.slice(1);

    await chrome.storage.local.set({
      gnCommenterState: {
        running: commenterRunning,
        pendingHashtags: remaining,
        config,
        stats: { commentedCount, skippedCount },
      }
    });

    reportProgress('scrolled', { reason: `Moving to #${next.hashtag}` });
    window.location.href = `https://www.instagram.com/explore/tags/${next.hashtag}/`;
  } else {
    // All done
    await chrome.storage.local.set({ gnCommenterState: null });
    commenterRunning = false;
    reportProgress('stopped', {});
  }
}

// ─────────────────────────────────────────────────────
// ON PAGE LOAD — resume commenter if running
// ─────────────────────────────────────────────────────
(async function checkResumeOnLoad() {
  await sleep(1000); // wait for page to render
  const data = await chrome.storage.local.get(['gnCommenterState']);
  const state = data.gnCommenterState;
  if (!state || !state.running) return;

  // We're on a hashtag/explore page
  if (window.location.href.includes('/explore/tags/')) {
    commenterRunning = true;
    await commentOnHashtagPage(state);
  }
})();

// ══════════════════════════════════════════════════════
// MESSAGE LISTENER
// ══════════════════════════════════════════════════════
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'PING') {
    sendResponse({ status: 'ok' });
    return true;
  }

  if (request.action === 'START_COMMENTER') {
    commenterRunning = true;
    commentedCount = 0;
    skippedCount = 0;
    sendResponse({ status: 'started' });

    const config = request.config;
    const topics = config.topics;
    const speed = config.speed;

    // Build hashtag queue
    const allHashtags = [];
    for (const topic of topics) {
      const hashes = TOPIC_HASHTAGS[topic] || [topic.replace(/\s+/g, '')];
      for (const h of hashes) allHashtags.push({ hashtag: h, topic });
    }
    allHashtags.sort(() => Math.random() - 0.5);

    if (allHashtags.length === 0) {
      reportProgress('error', { error: 'No topics selected!' });
      return true;
    }

    const firstEntry = allHashtags[0];
    const remaining = allHashtags.slice(1);

    // Save state then navigate
    chrome.storage.local.set({
      gnCommenterState: {
        running: true,
        pendingHashtags: remaining,
        config,
        stats: { commentedCount: 0, skippedCount: 0 },
      }
    }, () => {
      reportProgress('scrolled', { reason: `Opening #${firstEntry.hashtag} ...` });
      window.location.href = `https://www.instagram.com/explore/tags/${firstEntry.hashtag}/`;
    });

    return true;
  }

  if (request.action === 'STOP_COMMENTER') {
    commenterRunning = false;
    chrome.storage.local.set({ gnCommenterState: null });
    sendResponse({ status: 'stopped' });
    return true;
  }

  // ── AUTO POSTER (existing)
  if (request.action === 'START_AUTOMATION' || request.action === 'POST_TO_INSTAGRAM') {
    sendResponse({ status: 'started' });
    const { base64Data, caption, filename, filetype, imageData } = request;
    startAutomation(base64Data || imageData, caption, filename, filetype);
    return true;
  }
});

// ══════════════════════════════════════════════════════
// AUTO POSTER — original code
// ══════════════════════════════════════════════════════
async function waitForElement(selector, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await sleep(500);
  }
  return null;
}

function findButtonByText(text) {
  const els = Array.from(document.querySelectorAll('div[role="button"], button, a[role="link"]'));
  return els.find(el => el.textContent.trim().toLowerCase() === text.toLowerCase());
}

async function setOriginalCrop() {
  const cropSvg = document.querySelector('svg[aria-label="Select crop"], svg[aria-label="Select Crop"]');
  if (cropSvg) {
    const btn = cropSvg.closest('button') || cropSvg.closest('div[role="button"]');
    if (btn) {
      robustClick(btn); await sleep(1000);
      const origSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim().toLowerCase() === 'original');
      if (origSpan) {
        const origBtn = origSpan.closest('button') || origSpan.closest('div[role="button"]') || origSpan.parentElement;
        robustClick(origBtn); await sleep(1000);
      }
    }
  }
}

async function clickDropdownPost() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    const postSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === 'Post');
    if (postSpan) {
      const btn = postSpan.closest('a') || postSpan.closest('div[role="button"]') || postSpan.closest('div[role="link"]');
      if (btn) { btn.click(); return true; }
    }
    await sleep(500);
  }
  return false;
}

function findSidebarCreateButton() {
  const createSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === 'Create');
  if (createSpan) return createSpan.closest('a') || createSpan.closest('div[role="button"]') || createSpan.closest('div[role="link"]') || createSpan.parentElement;
  const createSvg = document.querySelector('svg[aria-label="New post"], svg[aria-label="Create"]');
  if (createSvg) return createSvg.closest('a') || createSvg.closest('div[role="button"]') || createSvg.closest('div[role="link"]') || createSvg.parentElement;
  return null;
}

async function startAutomation(base64Data, caption, filename, filetype) {
  const createBtn = findSidebarCreateButton();
  if (!createBtn) { alert("Could not find 'Create' button. Make sure you are on instagram.com desktop and logged in."); return; }
  createBtn.click();
  await clickDropdownPost();

  const fileInput = await waitForElement('input[type="file"]', 10000);
  if (!fileInput) { alert("Could not find file input. Please try again."); return; }

  try {
    const res = await fetch(base64Data);
    const blob = await res.blob();
    const file = new File([blob], filename || 'image.jpg', { type: filetype || 'image/jpeg' });
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  } catch (err) { alert("Error processing image: " + err.message); return; }

  await sleep(3000);
  await setOriginalCrop();

  let nextBtn = findButtonByText("Next");
  if (nextBtn) robustClick(nextBtn);
  await sleep(2500);

  nextBtn = findButtonByText("Next");
  if (nextBtn) robustClick(nextBtn);
  await sleep(3000);

  const captionBox = document.querySelector('div[aria-label*="Write a caption"][contenteditable="true"]') || document.querySelector('div[aria-label*="caption"][contenteditable="true"]');
  if (captionBox) {
    captionBox.focus();
    const dt = new DataTransfer();
    dt.setData('text/plain', caption);
    captionBox.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    document.execCommand('insertText', false, caption);
  } else {
    alert("Could not find caption box. Paste manually then click Share.");
  }

  await sleep(2500);
  const shareBtn = findButtonByText("Share");
  if (shareBtn) robustClick(shareBtn);
  else alert("Could not find Share button. Please click it manually.");
}
