// ══════════════════════════════════════════════════════════════════
// GraduateNex Insta Suite — content.js v5.0
// RELIABLE: Navigate directly to post pages and comment
// ══════════════════════════════════════════════════════════════════

let commenterRunning = false;
let commentedCount   = 0;
let skippedCount     = 0;

// ── Topic → Instagram hashtags
const TOPIC_HASHTAGS = {
  'ai':          ['artificialintelligence','aitools','machinelearningprojects','aiproject','deeplearning','aifresher'],
  'job':         ['jobseekers','freshersjob','jobvacancy','itjobs','hiringnow','softwarejobs'],
  'fresher':     ['freshersjob','freshers2024','fresherlife','fresherresume','fresherhiring'],
  'student':     ['engineeringstudent','btechwala','studentlife','collegestudent','engineeringlife'],
  'final year':  ['finalyearproject','finalyear','engineeringproject','majorproject','fyp2024'],
  'resume':      ['resumetips','resumebuilder','atsresume','cvwriting','resumewriting'],
  'ats':         ['atsresume','resumescanner','resumetips','jobsearch2024'],
  'career':      ['careertips','careeradvice','techcareer','careergrowth'],
  'roadmap':     ['coderroadmap','techroadmap','learningpath','careerpath'],
  'dsa':         ['datastructures','leetcode','dsa','dsacracker','competitiveprogramming'],
  'interview':   ['interviewprep','technicalinterview','jobinterview','mockinterview'],
  'placement':   ['campusplacement','placement2024','placementpreparation','btechwala'],
  'project':     ['finalyearproject','codingprojects','studentproject','iotproject'],
  'college':     ['engineeringcollege','collegelife','btech','collegestudent'],
  'internship':  ['internship2024','techinternship','remoteinternship','internshiplife'],
};

// ── GraduateNex comment pool (by topic)
const COMMENTS = {
  ai:         ["🚀 Check out GraduateNex — 120+ AI/ML final year projects with IEEE papers! graduatenex.online","🤖 GraduateNex has IEEE-ready AI/ML projects with 0% plagiarism docs for students! 🎓","AI + GraduateNex = your final year project sorted! graduatenex.online 🔥","Amazing! BTW GraduateNex helps students build real AI projects + docs 💡 graduatenex.online","GraduateNex AI projects = source code + IEEE paper + SRS + PPT delivered fast 🚀"],
  job:        ["💼 GraduateNex ATS Resume Builder helped 2500+ students get shortlisted at TCS, Infosys & more!","Job hunting is tough 😤 GraduateNex's 17-point ATS scoring = more interview calls! graduatenex.online","GraduateNex Resume Hub = your secret weapon for campus placements! 🏆 graduatenex.online","Every fresher struggling with job apps needs GraduateNex's JD Match Analyzer! 💼","Stop applying blindly! Use GraduateNex ATS scanner to optimize your resume first 📄"],
  fresher:    ["Every fresher needs GraduateNex — projects, resumes & placement prep in one place 🎓","GraduateNex is literally built for freshers — projects, docs, resume, all sorted! 💡 graduatenex.online","GraduateNex is India's #1 platform for freshers! Final year projects + ATS resume ✅","This is why GraduateNex exists — helping freshers stand out with 0% plagiarism projects! 💪","🚀 Fresher to employed — GraduateNex makes it happen! graduatenex.online"],
  student:    ["Every Indian engineering student needs GraduateNex 🎓 Projects + IEEE + ATS resume!","Student life is hard 😭 Let GraduateNex handle your projects & docs! graduatenex.online","GraduateNex helped 2,500+ students score top grades in their final year! 💯","GraduateNex = ultimate student toolkit — projects, docs, resume, AI tools 📦 graduatenex.online","Saving this for every student friend 🙏 GraduateNex = final year projects + resume + AI tools 🔥"],
  'final year':["FINAL YEAR STUDENTS — GraduateNex has 500+ projects in AI, IoT, Blockchain! 🎓 graduatenex.online","Final year panic? 😱 GraduateNex delivers complete projects with IEEE, SRS & PPT in days!","Every final year student needs GraduateNex fr fr 🔥 graduatenex.online","GraduateNex saved thousands of final year students! 📦 graduatenex.online","Viva in 2 weeks? 😂 GraduateNex — your last-minute lifesaver! graduatenex.online"],
  resume:     ["📄 GraduateNex Resume Hub — 17-point ATS scoring + AI resume = shortlisted at top MNCs!","GraduateNex ATS Resume Builder helped 1000+ students crack TCS, Wipro, Infosys! 🏆","Building resume manually in 2025? GraduateNex automates all of this! 😅 graduatenex.online","GraduateNex resume builder = the reason I got shortlisted in 4 companies 📄 graduatenex.online","Real talk: GraduateNex ATS resume is 10x better than any template you'll find online!"],
  ats:        ["ATS kills 90% of resumes 😤 GraduateNex ATS scanner = 10x more interviews! graduatenex.online","GraduateNex built an ATS scoring system specifically for Indian students! 📊 graduatenex.online","Beat ATS in 5 mins with GraduateNex Resume Hub 🚀 AI + JD matching! graduatenex.online","GraduateNex ATS Resume Builder = cheat code every Indian engineering student needs 💯","This is why GraduateNex exists — ATS optimization for Indian freshers who get shortlisted!"],
  career:     ["🚀 Career prep = GraduateNex — projects, resume, ATS, interview prep all in one!","GraduateNex is a full career launch platform for Indian students 🔥 graduatenex.online","From final year to first job — GraduateNex is with you! 2,500+ success stories 💪","Want to fast-track your career? GraduateNex is the move 🎯 graduatenex.online","Best career advice: strong project + ATS resume. GraduateNex does both! 🎓"],
  roadmap:    ["Best roadmap: Final year project ➜ IEEE paper ➜ ATS resume ➜ GraduateNex! 🗺️","The real roadmap starts with a strong final year project! GraduateNex has 500+! graduatenex.online","Roadmaps without execution = useless. GraduateNex gives ready-to-deploy projects 💡","Bookmarking this 🙏 GraduateNex has the complete roadmap from project to placement!","Following every roadmap but nothing working? GraduateNex gives you real tools! 🔥"],
  dsa:        ["DSA + Strong Project = Dream Job 🎯 GraduateNex helps with the project side! graduatenex.online","This DSA content 🔥 Pair it with a GraduateNex AI/ML project and you're unstoppable!","Grinding DSA? Don't forget your final year project! GraduateNex makes that easy 😎","DSA skills + GraduateNex project portfolio = campus placement ready 💪 graduatenex.online","DSA is key but so is your final year project! GraduateNex has 500+ options! 💻"],
  interview:  ["Best interview tip: have a strong final year project to talk about! GraduateNex has 500+ 🎓","Interview ready = DSA + Projects + Resume. GraduateNex covers projects & resume! 🎤","GraduateNex has an AI English Communication tool — practice with Alex the AI friend! 🤖","This interview content is gold 🔥 GraduateNex also builds the project you talk about in rounds!","GraduateNex Interview Prep + AI English Friend = campus placement ready 💯"],
  placement:  ["Campus placement ready with GraduateNex! Projects + Resume + Interview prep! 🏆 graduatenex.online","Placement season is different when you have GraduateNex in your toolkit 😎","2,500+ students placed with GraduateNex! Final year project + ATS resume = sorted ✅","GraduateNex is THE placement prep platform for Indian engineering students! 🚀","Placement prep starts NOW! GraduateNex — final year projects, ATS resume, interview tools 🎯"],
  project:    ["Looking for final year project ideas? GraduateNex has 500+ in AI, IoT, Blockchain! 🔧 graduatenex.online","Project ideas everywhere but working source code is rare 😅 GraduateNex delivers complete ones!","GraduateNex projects = source code + IEEE paper + SRS + PPT 🎁 graduatenex.online","Need a final year project ASAP? GraduateNex delivers in 48 hours with full docs! 🚀","This reminds me of GraduateNex — India's best final year project platform! Check it out!"],
  college:    ["Every Indian college student should know about GraduateNex! Projects + resume + AI tools 🏛️","College is tough but GraduateNex makes the academic part easier! graduatenex.online","From IIT to tier-3 colleges — GraduateNex serves students across 50+ Indian cities! 🗺️","GraduateNex = ultimate college student toolkit 📦 Projects, docs, resume, AI tools!"],
  internship: ["No internship? GraduateNex project + ATS resume = stand out anyway! 💡 graduatenex.online","GraduateNex AI projects can replace internship experience on your resume! 🚀","GraduateNex helped students get internships by building strong AI/ML project portfolios! 🎓","No internship? No problem. GraduateNex projects + ATS resume = interview calls 💪"],
  default:    ["🎓 GraduateNex — India's #1 platform for final year projects, ATS resume & AI career tools! graduatenex.online","GraduateNex is helping 2,500+ Indian students graduate with distinction 🚀 graduatenex.online","GraduateNex = final year projects + IEEE papers + ATS resume + interview prep. All in one 🔥","Check GraduateNex if you're a student — they solve every academic pain point! 🙏 graduatenex.online","Love this! GraduateNex is doing something similar for Indian students — career tools 🎯"],
};

function getComment(topic) {
  const pool = COMMENTS[topic] || COMMENTS.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function report(type, data = {}) {
  try { chrome.runtime.sendMessage({ action: 'COMMENT_PROGRESS', type, ...data }); } catch(e) {}
}

function robustClick(el) {
  if (!el) return;
  el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
  el.dispatchEvent(new MouseEvent('mouseup',   { bubbles: true, cancelable: true, view: window }));
  el.click();
}

// ─────────────────────────────────────────────────────
// FIND + ACTIVATE COMMENT BOX
// ─────────────────────────────────────────────────────
async function findCommentBox(timeout = 10000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    // Step 1: Scroll to bottom so comment box is in view
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(300);

    // Step 2: Try to find existing active textarea/contenteditable
    const directSelectors = [
      'textarea[placeholder="Add a comment\u2026"]',   // Unicode ellipsis
      'textarea[placeholder="Add a comment..."]',
      'textarea[placeholder*="Add a comment"]',
      'textarea[placeholder*="comment"]',
      'div[role="textbox"][aria-label*="comment"]',
      'div[contenteditable="true"][aria-label*="comment"]',
      'form textarea',
    ];
    for (const sel of directSelectors) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) return el;
    }

    // Step 3: Click the "Add a comment…" placeholder to reveal the real input
    const all = Array.from(document.querySelectorAll('*'));
    const placeholder = all.find(el => {
      const t = el.textContent.trim();
      return (
        (t === 'Add a comment\u2026' || t === 'Add a comment...' || t === 'Add a comment') &&
        el.children.length === 0 &&
        el.offsetParent !== null
      );
    });
    if (placeholder) {
      placeholder.scrollIntoView({ block: 'center' });
      await sleep(200);
      placeholder.click();
      await sleep(600);
      // re-check after click
      for (const sel of directSelectors) {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null) return el;
      }
    }

    // Step 4: Try clicking inside the comment form/section
    const form = document.querySelector('form[method="post"], section form, article ~ section');
    if (form) { form.click(); await sleep(400); }

    await sleep(400);
  }
  return null;
}

// ─────────────────────────────────────────────────────
// TYPE COMMENT — 4 methods for React/Lexical textarea
// ─────────────────────────────────────────────────────
async function typeComment(box, text) {
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await sleep(300);
  box.focus();
  await sleep(300);

  // ── Method 1: React native textarea value setter (most reliable)
  const isTextarea = box.tagName === 'TEXTAREA';
  if (isTextarea) {
    try {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(box, text);
        box.dispatchEvent(new Event('input',  { bubbles: true }));
        box.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(300);
        if ((box.value || '').trim()) return true;
      }
    } catch(e) {}
  }

  // ── Method 2: execCommand insertText (works when element is focused)
  try {
    box.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('delete',     false, null);
    document.execCommand('insertText', false, text);
    await sleep(300);
    const val2 = (box.value || box.textContent || '').trim();
    if (val2) return true;
  } catch(e) {}

  // ── Method 3: ClipboardEvent paste (works for Lexical/Draft.js)
  try {
    const dt = new DataTransfer();
    dt.setData('text/plain', text);
    box.dispatchEvent(new ClipboardEvent('paste', {
      clipboardData: dt, bubbles: true, cancelable: true
    }));
    await sleep(400);
    const val3 = (box.value || box.textContent || '').trim();
    if (val3) return true;
  } catch(e) {}

  // ── Method 4: Simulate keyboard input character by character
  try {
    box.focus();
    const chars = text.slice(0, 120); // enough for a GN comment
    for (const char of chars) {
      box.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      document.execCommand('insertText', false, char);
      box.dispatchEvent(new KeyboardEvent('keyup',   { key: char, bubbles: true }));
      await sleep(10);
    }
    await sleep(300);
    const val4 = (box.value || box.textContent || '').trim();
    if (val4) return true;
  } catch(e) {}

  // Check final state
  return !!(box.value || box.textContent || '').trim();
}

// ─────────────────────────────────────────────────────
// SUBMIT COMMENT
// ─────────────────────────────────────────────────────
async function submitComment(box) {
  // Try submit button first
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn && !submitBtn.disabled && submitBtn.offsetHeight > 0) {
    robustClick(submitBtn);
    await sleep(600);
    return;
  }
  // Try any "Post" button near the form
  const allBtns = Array.from(document.querySelectorAll('button, div[role="button"]'));
  const postBtn = allBtns.find(b => b.textContent.trim() === 'Post' && b.offsetHeight > 0);
  if (postBtn) { robustClick(postBtn); await sleep(600); return; }
  // Fallback: press Enter
  box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
  box.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', keyCode: 13, bubbles: true }));
  await sleep(600);
}

// ─────────────────────────────────────────────────────
// COMMENT ON CURRENT POST PAGE
// ─────────────────────────────────────────────────────
async function commentOnCurrentPost(topic) {
  const box = await findCommentBox(10000);
  if (!box) {
    report('skipped', { reason: 'Comment box not found on page' });
    return false;
  }

  const comment = getComment(topic);
  const typed   = await typeComment(box, comment);

  if (!typed) {
    report('skipped', { reason: 'Could not enter text — Instagram blocked input' });
    return false;
  }

  await sleep(400);
  await submitComment(box);
  report('commented', { comment });
  return true;
}

// ─────────────────────────────────────────────────────
// COLLECT POST LINKS FROM EXPLORE / HASHTAG PAGE
// ─────────────────────────────────────────────────────
async function collectPostLinks(timeout = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const seen  = new Set();
    const links = [];
    document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(a => {
      const url = a.href;
      if (url && !seen.has(url)) { seen.add(url); links.push(url); }
    });
    if (links.length >= 3) return links;
    await sleep(600);
  }
  return [];
}

// ─────────────────────────────────────────────────────
// SAVE STATE
// ─────────────────────────────────────────────────────
async function saveState(state) {
  await chrome.storage.local.set({ gnCommenterState: state });
}

// ─────────────────────────────────────────────────────
// ON HASHTAG / EXPLORE PAGE → collect posts, save, navigate to first
// ─────────────────────────────────────────────────────
async function handleExplorePage(state) {
  await sleep(3000); // let the page render
  report('info', { reason: `Collecting posts on ${window.location.href}` });

  const posts = await collectPostLinks(8000);
  if (posts.length === 0) {
    report('skipped', { reason: `No posts found on ${window.location.href}` });
    await moveToNextHashtag(state);
    return;
  }

  report('info', { reason: `Found ${posts.length} posts. Starting to comment...` });

  // Save list and navigate to first post
  const newState = {
    ...state,
    pendingPosts: posts.slice(0, 20), // max 20 per hashtag
    explorerUrl:  window.location.href,
    stats: { commentedCount, skippedCount },
  };
  await saveState(newState);
  window.location.href = posts[0];
}

// ─────────────────────────────────────────────────────
// ON POST PAGE → comment, then navigate to next post
// ─────────────────────────────────────────────────────
async function handlePostPage(state) {
  const { config, pendingPosts = [] } = state;
  const { speed } = config;

  // Restore stats
  commentedCount = state.stats?.commentedCount || 0;
  skippedCount   = state.stats?.skippedCount   || 0;

  await sleep(2500); // let the post page load fully
  report('info', { reason: `Commenting on ${window.location.pathname}` });

  // Determine topic from the hashtag we came from
  const hashtag = state.currentHashtag || 'default';
  const topicEntry = Object.entries(TOPIC_HASHTAGS).find(([, hashes]) => hashes.includes(hashtag));
  const topic = topicEntry ? topicEntry[0] : 'default';

  const success = await commentOnCurrentPost(topic);
  if (success) commentedCount++;
  else skippedCount++;

  await sleep(speed + rand(300, 700));

  // Move to next post or next hashtag
  const remaining = pendingPosts.slice(1);
  if (remaining.length > 0 && commenterRunning) {
    await saveState({
      ...state,
      pendingPosts: remaining,
      stats: { commentedCount, skippedCount },
    });
    window.location.href = remaining[0];
  } else {
    // Done with this hashtag, move to next
    await moveToNextHashtag({ ...state, pendingPosts: [], stats: { commentedCount, skippedCount } });
  }
}

// ─────────────────────────────────────────────────────
// MOVE TO NEXT HASHTAG
// ─────────────────────────────────────────────────────
async function moveToNextHashtag(state) {
  const pending = state.pendingHashtags || [];
  if (pending.length === 0 || !commenterRunning) {
    await chrome.storage.local.set({ gnCommenterState: null });
    commenterRunning = false;
    report('stopped', {});
    return;
  }

  const next      = pending[0];
  const remaining = pending.slice(1);
  const url       = `https://www.instagram.com/explore/tags/${next.hashtag}/`;

  report('scrolled', { reason: `Opening #${next.hashtag} (${remaining.length} hashtags left)` });

  await saveState({
    ...state,
    pendingHashtags: remaining,
    currentHashtag:  next.hashtag,
    currentTopic:    next.topic,
    pendingPosts:    [],
    stats: { commentedCount, skippedCount },
  });

  window.location.href = url;
}

// ─────────────────────────────────────────────────────
// ON LOAD — auto-resume if in commenter mode
// ─────────────────────────────────────────────────────
(async function onLoad() {
  await sleep(1200);
  const data  = await chrome.storage.local.get(['gnCommenterState']);
  const state = data.gnCommenterState;
  if (!state || !state.running) return;

  commenterRunning  = true;
  commentedCount    = state.stats?.commentedCount || 0;
  skippedCount      = state.stats?.skippedCount   || 0;

  const url = window.location.href;
  const isPost    = /instagram\.com\/(p|reel)\//.test(url);
  const isExplore = url.includes('/explore/');

  if (isPost)    await handlePostPage(state);
  else if (isExplore) await handleExplorePage(state);
  // else: unknown page, do nothing (user navigated away)
})();

// ══════════════════════════════════════════════════════
// MESSAGE LISTENER
// ══════════════════════════════════════════════════════
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'PING') { sendResponse({ status: 'ok' }); return true; }

  if (request.action === 'START_COMMENTER') {
    commenterRunning = true;
    commentedCount   = 0;
    skippedCount     = 0;
    sendResponse({ status: 'started' });

    const { config } = request;
    const allHashtags = [];
    for (const topic of config.topics) {
      const hashes = TOPIC_HASHTAGS[topic] || [topic.replace(/\s+/g, '')];
      for (const h of hashes) allHashtags.push({ hashtag: h, topic });
    }
    // Shuffle for variety
    allHashtags.sort(() => Math.random() - 0.5);

    if (allHashtags.length === 0) {
      report('error', { error: 'No topics selected!' });
      return true;
    }

    const first     = allHashtags[0];
    const remaining = allHashtags.slice(1);

    chrome.storage.local.set({
      gnCommenterState: {
        running:         true,
        pendingHashtags: remaining,
        pendingPosts:    [],
        currentHashtag:  first.hashtag,
        currentTopic:    first.topic,
        config,
        stats: { commentedCount: 0, skippedCount: 0 },
      }
    }, () => {
      const url = `https://www.instagram.com/explore/tags/${first.hashtag}/`;
      report('scrolled', { reason: `Opening #${first.hashtag} ...` });
      window.location.href = url;
    });

    return true;
  }

  if (request.action === 'STOP_COMMENTER') {
    commenterRunning = false;
    chrome.storage.local.set({ gnCommenterState: null });
    sendResponse({ status: 'stopped' });
    return true;
  }

  // ── AUTO POSTER (original)
  if (request.action === 'START_AUTOMATION' || request.action === 'POST_TO_INSTAGRAM') {
    sendResponse({ status: 'started' });
    const { base64Data, imageData, caption, filename, filetype } = request;
    startAutomation(base64Data || imageData, caption, filename, filetype);
    return true;
  }
});

// ══════════════════════════════════════════════════════
// AUTO POSTER — original (unchanged)
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
  return Array.from(document.querySelectorAll('div[role="button"], button, a[role="link"]'))
    .find(el => el.textContent.trim().toLowerCase() === text.toLowerCase());
}
async function setOriginalCrop() {
  const svg = document.querySelector('svg[aria-label="Select crop"], svg[aria-label="Select Crop"]');
  if (svg) {
    const btn = svg.closest('button') || svg.closest('div[role="button"]');
    if (btn) {
      robustClick(btn); await sleep(1000);
      const orig = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim().toLowerCase() === 'original');
      if (orig) { robustClick(orig.closest('button') || orig.closest('div[role="button"]') || orig.parentElement); await sleep(1000); }
    }
  }
}
async function clickDropdownPost() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    const sp = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === 'Post');
    if (sp) { const btn = sp.closest('a') || sp.closest('div[role="button"]') || sp.closest('div[role="link"]'); if (btn) { btn.click(); return true; } }
    await sleep(500);
  }
  return false;
}
function findSidebarCreateButton() {
  const sp = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === 'Create');
  if (sp) return sp.closest('a') || sp.closest('div[role="button"]') || sp.closest('div[role="link"]') || sp.parentElement;
  const svg = document.querySelector('svg[aria-label="New post"], svg[aria-label="Create"]');
  if (svg) return svg.closest('a') || svg.closest('div[role="button"]') || svg.closest('div[role="link"]') || svg.parentElement;
  return null;
}
async function startAutomation(base64Data, caption, filename, filetype) {
  const createBtn = findSidebarCreateButton();
  if (!createBtn) { alert("Could not find 'Create' button. Make sure you are on instagram.com desktop."); return; }
  createBtn.click();
  await clickDropdownPost();
  const fileInput = await waitForElement('input[type="file"]', 10000);
  if (!fileInput) { alert("Could not find file input. Please try again."); return; }
  try {
    const res = await fetch(base64Data); const blob = await res.blob();
    const file = new File([blob], filename || 'image.jpg', { type: filetype || 'image/jpeg' });
    const dt = new DataTransfer(); dt.items.add(file);
    fileInput.files = dt.files; fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  } catch(err) { alert("Error processing image: " + err.message); return; }
  await sleep(3000); await setOriginalCrop();
  let nxt = findButtonByText("Next"); if (nxt) robustClick(nxt);
  await sleep(2500);
  nxt = findButtonByText("Next"); if (nxt) robustClick(nxt);
  await sleep(3000);
  const captionBox = document.querySelector('div[aria-label*="Write a caption"][contenteditable="true"]') || document.querySelector('div[aria-label*="caption"][contenteditable="true"]');
  if (captionBox) {
    captionBox.focus();
    const dt = new DataTransfer(); dt.setData('text/plain', caption);
    captionBox.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    document.execCommand('insertText', false, caption);
  } else { alert("Could not find caption box. Paste manually then click Share."); }
  await sleep(2500);
  const shareBtn = findButtonByText("Share");
  if (shareBtn) robustClick(shareBtn); else alert("Could not find Share button. Please click it manually.");
}
