// ══════════════════════════════════════════════════════════════════
// GraduateNex Insta Suite — content.js v5.0
// RELIABLE: Navigate directly to post pages and comment
// ══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────
// IN-PAGE REPORTER UI
// ─────────────────────────────────────────────────────
function report(type, details) {
  console.log(`[GraduateNex Bot] ${type.toUpperCase()}: ${details.msg}`);
  let r = document.getElementById('gn-bot-reporter');
  if (!r) {
    r = document.createElement('div');
    r.id = 'gn-bot-reporter';
    r.style.cssText = `
      position:fixed; top:20px; right:20px; width:350px;
      background:rgba(17, 17, 17, 0.95); color:#fff; font-family:monospace; font-size:14px;
      padding:20px; border-radius:12px; z-index:9999999;
      box-shadow: 0 8px 32px rgba(0,0,0,0.8); border: 2px solid #6C63FF;
      backdrop-filter: blur(8px);
    `;
    document.body.appendChild(r);
  }
  let icon = 'ℹ️';
  if (type === 'error') icon = '❌';
  if (type === 'done') icon = '🎉';
  if (type === 'navigate') icon = '🚀';
  
  r.innerHTML = `
    <div style="margin-bottom:12px; font-weight:bold; color:#6C63FF; font-size:16px; display:flex; align-items:center; gap:8px;">
      <span style="animation: blink 1s infinite;">🔴</span> GraduateNex Bot Active
    </div>
    <div style="margin-bottom:8px; line-height:1.4;">${icon} ${details.msg}</div>
    <div style="font-size:11px; color:#888; border-top: 1px solid #333; padding-top:8px; margin-top:12px;">${new Date().toLocaleTimeString()}</div>
    <style>@keyframes blink { 0% {opacity:1;} 50% {opacity:0.3;} 100% {opacity:1;} }</style>
  `;
}

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
  let comment = pool[Math.floor(Math.random() * pool.length)];
  
  // Remove existing link to avoid duplication, then append the required tags
  comment = comment.replace(/graduatenex\.online/gi, '').trim();
  return `${comment}\n\n🌐 graduatenex.online\n📸 @graduatenex\n🏷️ #graduatenex`;
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
async function findCommentBox(timeout = 12000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    // Scroll main content area down to reveal comment section
    window.scrollTo(0, document.body.scrollHeight);
    const scrollable = document.querySelector('main, [role="main"], article');
    if (scrollable) scrollable.scrollTop = scrollable.scrollHeight;
    await sleep(400);

    // Priority order of selectors
    const selectors = [
      'textarea[placeholder="Add a comment\u2026"]',
      'textarea[placeholder="Add a comment..."]',
      'textarea[placeholder*="Add a comment"]',
      'textarea[aria-label*="comment"]',
      'div[role="textbox"][aria-label*="comment"]',
      'div[contenteditable="true"][aria-label*="comment"]',
      'div[role="textbox"]',
      'form textarea',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) {
        el.scrollIntoView({ block: 'center' });
        return el;
      }
    }

    // Try clicking the visible placeholder text to reveal the input
    const els = Array.from(document.querySelectorAll('*'));
    const placeholder = els.find(el => {
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
      await sleep(800);
      // Re-check after click
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null) return el;
      }
    }

    // Try the form
    const form = document.querySelector('form[method="post"]');
    if (form) { form.click(); await sleep(400); }

    await sleep(400);
  }
  return null;
}

// ─────────────────────────────────────────────────────
// TYPE COMMENT — Instagram Lexical/React editor safe
// ─────────────────────────────────────────────────────
async function typeComment(box, text) {
  const isTextarea     = box.tagName === 'TEXTAREA';
  const isContentedit  = box.contentEditable === 'true';

  // Step 1: Scroll into view and do a real mouse click with coordinates
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await sleep(400);

  const rect = box.getBoundingClientRect();
  const cx   = rect.left + rect.width / 2;
  const cy   = rect.top  + rect.height / 2;
  ['mouseover','mouseenter','mousedown','mouseup','click'].forEach(type => {
    box.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy }));
  });
  await sleep(300);

  // Step 2: Focus element
  box.focus();
  await sleep(300);

  // Step 3a: For textarea — React native value setter
  if (isTextarea) {
    try {
      const proto  = Object.getPrototypeOf(box);
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set ||
                     Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(box, text);
        box.dispatchEvent(new Event('input',  { bubbles: true }));
        box.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(400);
        if ((box.value || '').trim()) {
          report('info', { reason: 'Text entered via native setter ✅' });
          return true;
        }
      }
    } catch(e) {}
  }

  // Step 3b: For contenteditable (Lexical) — Range API + execCommand
  if (isContentedit) {
    try {
      // Position cursor at end
      const range = document.createRange();
      const sel   = window.getSelection();
      range.selectNodeContents(box);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      await sleep(100);

      // Clear existing and insert
      document.execCommand('selectAll',   false, null);
      document.execCommand('delete',      false, null);
      document.execCommand('insertText',  false, text);
      box.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      await sleep(400);

      // Verify by checking submit button state
      const submitBtn = document.querySelector('button[type="submit"], div[role="button"][tabindex="0"]');
      if (submitBtn && !submitBtn.disabled && submitBtn.textContent.trim() === 'Post') {
        report('info', { reason: 'Text entered via Range+execCommand ✅' });
        return true;
      }
      // Also check if box has content now
      if ((box.textContent || '').replace(/Add a comment[….]+/, '').trim()) return true;
    } catch(e) {}
  }

  // Step 4: execCommand on any element type
  try {
    box.focus();
    document.execCommand('selectAll',  false, null);
    document.execCommand('delete',     false, null);
    document.execCommand('insertText', false, text);
    await sleep(400);
    const v = (box.value || box.textContent || '').replace(/Add a comment[….]+/,'').trim();
    if (v) { report('info', { reason: 'Text via execCommand ✅' }); return true; }
  } catch(e) {}

  // Step 5: ClipboardEvent paste — works for Lexical
  try {
    box.focus();
    const dt = new DataTransfer();
    dt.setData('text/plain', text);
    dt.setData('text/html',  text);
    const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
    box.dispatchEvent(ev);
    await sleep(500);
    // After paste, check submit button
    const btn = document.querySelector('button[type="submit"]');
    if (btn && btn.textContent.trim() === 'Post') { report('info', { reason: 'Text via clipboard paste ✅' }); return true; }
    const v2 = (box.value || box.textContent || '').replace(/Add a comment[….]+/, '').trim();
    if (v2) { report('info', { reason: 'Text via clipboard paste ✅' }); return true; }
  } catch(e) {}

  // Step 6: Simulate keystrokes char by char (last resort)
  try {
    box.focus();
    for (const char of text.slice(0, 150)) {
      box.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true, cancelable: true }));
      document.execCommand('insertText', false, char);
      box.dispatchEvent(new KeyboardEvent('keyup',   { key: char, bubbles: true, cancelable: true }));
      await sleep(12);
    }
    await sleep(400);
    // Check submit enabled
    const btn3 = document.querySelector('button[type="submit"]');
    if (btn3 && btn3.textContent.trim() === 'Post') { report('info', { reason: 'Text via keystrokes ✅' }); return true; }
    const v3 = (box.value || box.textContent || '').replace(/Add a comment[….]+/, '').trim();
    if (v3) return true;
  } catch(e) {}

  // Last check — maybe text was entered but DOM didn't update visibly
  // Try submitting anyway (Instagram will reject empty comments server-side)
  const finalBtn = document.querySelector('button[type="submit"]');
  if (finalBtn && !finalBtn.disabled) return true;

  // ─────────────────────────────────────────────────────
  // 🔥 ALTERNATIVE 2: PRIVATE API FALLBACK 🔥
  // If the UI completely blocks typing, we bypass the UI entirely
  // and send the comment directly to Instagram's backend servers.
  // ─────────────────────────────────────────────────────
  report('info', { reason: 'UI blocked typing. Attempting Private API fallback...' });
  try {
    // 1. Get CSRF Token
    const csrfMatch = document.cookie.match(/csrftoken=([^;]+)/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';
    
    // 2. Get App ID from page source
    let appId = '936619743392459'; // Default IG Web App ID
    const scriptWithAppId = Array.from(document.querySelectorAll('script')).find(s => s.textContent.includes('APP_ID'));
    if (scriptWithAppId) {
      const match = scriptWithAppId.textContent.match(/"APP_ID":"(\d+)"/);
      if (match) appId = match[1];
    }

    // 3. Get Media ID (Post ID)
    let mediaId = null;
    // Try to find it in meta tags (al:ios:url usually has it: instagram://media?id=123456)
    const metaTag = document.querySelector('meta[property="al:ios:url"]');
    if (metaTag && metaTag.content.includes('id=')) {
      mediaId = metaTag.content.split('id=')[1];
    }
    
    if (!mediaId) {
      // Fetch the page JSON data to find the media ID
      const pageJson = await fetch(window.location.href + '?__a=1&__d=dis').then(r => r.json());
      mediaId = pageJson?.items?.[0]?.id || pageJson?.graphql?.shortcode_media?.id;
    }

    if (mediaId && csrfToken) {
      const body = new URLSearchParams();
      body.append('comment_text', text);
      body.append('replied_to_comment_id', '');

      const res = await fetch(`https://www.instagram.com/api/v1/web/comments/${mediaId}/add/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
          'X-IG-App-ID': appId,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });

      const data = await res.json();
      if (data && data.status === 'ok') {
        report('info', { reason: 'Comment posted via Private API successfully! ✅' });
        // Since we posted via API, we don't need to click the UI submit button.
        // We will return a special string so the caller knows to skip clicking submit.
        return 'API_SUCCESS';
      } else {
        report('warn', { reason: `API Fallback failed: ${data.message || 'Unknown error'}` });
      }
    }
  } catch (err) {
    report('warn', { reason: `API Fallback error: ${err.message}` });
  }

  return false;
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

  // If we used the Private API fallback, it's already posted!
  if (typed === 'API_SUCCESS') {
    report('commented', { comment: `${comment} (via API)` });
    return true;
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
  
  const fyData = await chrome.storage.local.get(['gnFyBotState']);
  const fyState = fyData.gnFyBotState;
  
  const data  = await chrome.storage.local.get(['gnCommenterState']);
  const state = data.gnCommenterState;
  
  const url = window.location.href;
  const isPost    = /instagram\.com\/(p|reel)\//.test(url);
  const isExplore = url.includes('/explore/');
  
  if (fyState && fyState.running) {
    await startFyBotFlow(fyState);
    return;
  }

  if (!state || !state.running) return;

  commenterRunning  = true;
  commentedCount    = state.stats?.commentedCount || 0;
  skippedCount      = state.stats?.skippedCount   || 0;

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

  if (request.action === 'START_FY_BOT') {
    sendResponse({ status: 'started' });
    const { hashtags, igId, url } = request;
    
    chrome.storage.local.set({ gnCommenterState: null });
    commenterRunning = false;

    const [first, ...remaining] = hashtags;
    saveFyState({
      running: true,
      pendingHashtags: remaining,
      currentHashtag: first,
      pendingPosts: [],
      pendingProfile: null,
      igId, url
    }).then(() => {
      window.location.href = `https://www.instagram.com/`;
    });
    return true;
  }

  if (request.action === 'STOP_FY_BOT') {
    saveFyState({ running: false }).then(() => sendResponse({ status: 'stopped' }));
    return true;
  }
});

// ══════════════════════════════════════════════════════════════════
// FINAL YEAR PROJECTS BOT LOGIC
// ══════════════════════════════════════════════════════════════════

const FY_MESSAGES = [
  "Looking for last minute final year projects? We are here to help you! PPT, documentation, research paper, source code, deployment & guidance up to submission. 🚀",
  "Final year panic? 😱 We provide complete projects with IEEE papers, SRS, zero plagiarism, and full source code!",
  "Get your B.Tech/MCA final year project done fast with our expert guidance. Full deployment and documentation included! 🎓",
  "Need a solid research paper & project source code for your final year? We provide A-Z guidance up to your final submission. 💡",
  "Don't worry about plagiarism! We offer 100% original final year projects with complete documentation and PPTs. ✅",
  "Stuck on your final year project deployment? Let us handle the source code, research paper, and submission guidance! 🔧",
  "We help engineering students with last-minute final year projects! AI, ML, IoT, Blockchain—complete with documentation! 🤖",
  "Your one-stop solution for final year projects! We provide everything from PPTs to plagiarism removal and deployment. 🎓",
  "Final year viva coming up? Get a fully deployed project with a research paper and complete guidance from us! 🚀",
  "B.Tech & MCA students: Get your major project sorted today. Full source code, zero plagiarism, and final submission support! 💻",
  "Why stress over documentation? We provide final year projects with complete SRS, PPT, and research papers! 📄",
  "Last minute project submission? We deliver ready-to-deploy final year projects with full guidance! ⏳",
  "From idea to deployment—we help students build and submit top-tier final year projects with zero plagiarism. 🏆",
  "Get IEEE standard final year projects with complete documentation, PPT, and deployment assistance! 🌟",
  "Need help with your major project? We provide source code, research papers, and complete submission guidance! 🎯",
  "Engineering students: Get your final year project done right! PPT, documentation, and deployment included. ⚙️",
  "We specialize in last-minute final year projects! Complete with plagiarism removal and full source code. 🔥",
  "Don't fail your final year project! We provide A-Z support, from research papers to successful deployment! 📚",
  "Need an AI/ML or Web Dev project for your final year? We provide source code, documentation, and PPTs! 🧠",
  "Complete your final year project stress-free! We offer full deployment, plagiarism removal, and submission guidance. 🚀"
];

const saveFyState = state => chrome.storage.local.set({ gnFyBotState: state });
async function loadFyState() {
  const d = await chrome.storage.local.get(['gnFyBotState']);
  return d.gnFyBotState || null;
}
async function alreadyFyScraped(url) {
  const d = await chrome.storage.local.get(['gnFyScrapedUrls']);
  return (d.gnFyScrapedUrls || []).includes(url);
}
async function markFyScraped(url) {
  const d = await chrome.storage.local.get(['gnFyScrapedUrls']);
  const arr = d.gnFyScrapedUrls || [];
  if (!arr.includes(url)) {
    arr.push(url);
    await chrome.storage.local.set({ gnFyScrapedUrls: arr.slice(-10000) });
  }
}
async function alreadyVisitedProfile(username) {
  const d = await chrome.storage.local.get(['gnFyVisitedProfiles']);
  return (d.gnFyVisitedProfiles || []).includes(username);
}
async function markProfileVisited(username) {
  const d = await chrome.storage.local.get(['gnFyVisitedProfiles']);
  const arr = d.gnFyVisitedProfiles || [];
  if (!arr.includes(username)) {
    arr.push(username);
    await chrome.storage.local.set({ gnFyVisitedProfiles: arr.slice(-5000) });
  }
}

async function startFyBotFlow(state) {
  if (state.pendingPosts && state.pendingPosts.length > 0) {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/p/') || currentUrl.includes('/reel/')) {
      await handleFyPostPage(state);
      return;
    } else {
      window.location.href = state.pendingPosts[0];
      return;
    }
  }

  if (state.pendingProfile) {
    const currentUrl = window.location.href;
    if (currentUrl.toLowerCase().includes(state.pendingProfile.toLowerCase())) {
      await handleFyProfilePage(state);
      return;
    } else {
      window.location.href = `https://www.instagram.com/${state.pendingProfile}/`;
      return;
    }
  }

  await handleFyCollegeSearchLoop(state);
}

async function handleFyCollegeSearchLoop(state) {
  let currentState = state;
  
  while (currentState.running && currentState.currentHashtag) {
    const college = currentState.currentHashtag;
    report('navigate', { msg: `🔍 Searching IG for: ${college.substring(0, 30)}...` });
    await sleep(800); // FASTER: 1500 -> 800
    
    let foundUsername = null;
    try {
      const csrfMatch = document.cookie.match(/csrftoken=([^;]+)/);
      const csrfToken = csrfMatch ? csrfMatch[1] : '';
      const searchUrl = `https://www.instagram.com/web/search/topsearch/?context=blended&query=${encodeURIComponent(college)}`;
      
      const res = await fetch(searchUrl, {
         headers: {
           'X-CSRFToken': csrfToken,
           'X-Requested-With': 'XMLHttpRequest'
         }
      });
      
      if (res.ok) {
         const text = await res.text();
         try {
           const data = JSON.parse(text);
           const user = data.users && data.users.length > 0 ? data.users[0].user : null;
           if (user && user.username) foundUsername = user.username;
         } catch(e) {
           report('warn', { msg: `IG returned invalid JSON for search` });
         }
      } else {
         report('warn', { msg: `API error ${res.status} for search` });
      }
    } catch (err) {
       report('error', { msg: `Search failed: ${err.message}` });
    }
    
    if (foundUsername) {
       const alreadyVisited = await alreadyVisitedProfile(foundUsername);
       if (alreadyVisited) {
         report('skipped', { msg: `⏭️ Already visited profile @${foundUsername}, skipping...` });
         const pending = currentState.pendingHashtags || [];
         if (pending.length === 0) {
            await chrome.storage.local.set({ gnFyBotState: null });
            report('done', { msg: `🎉 Finished all colleges!` });
            return;
         }
         const [next, ...remaining] = pending;
         currentState.pendingHashtags = remaining;
         currentState.currentHashtag = next;
         await saveFyState(currentState);
         continue; // Move to next iteration immediately
       }

       report('info', { msg: `✅ Found profile: @${foundUsername}` });
       await markProfileVisited(foundUsername);
       currentState.pendingProfile = foundUsername;
       await saveFyState(currentState);
       window.location.href = `https://www.instagram.com/${foundUsername}/`;
       return; 
    } else {
       report('warn', { msg: `❌ No profile found for ${college.substring(0, 20)}` });
       
       const pending = currentState.pendingHashtags || [];
       if (pending.length === 0) {
          await chrome.storage.local.set({ gnFyBotState: null });
          report('done', { msg: `🎉 Finished all colleges!` });
          return;
       }
       const [next, ...remaining] = pending;
       currentState.pendingHashtags = remaining;
       currentState.currentHashtag = next;
       await saveFyState(currentState);
    }
  }
}

async function handleFyProfilePage(state) {
  await sleep(1500); // FASTER: 2500 -> 1500
  report('info', { msg: `Collecting posts from @${state.pendingProfile}...` });

  let posts = await collectPostLinks(3000); // FASTER: 5000 -> 3000
  
  // Filter out already scraped posts BEFORE visiting them
  const scrapedData = await chrome.storage.local.get(['gnFyScrapedUrls']);
  const scrapedUrls = scrapedData.gnFyScrapedUrls || [];
  posts = posts.filter(url => !scrapedUrls.includes(url));

  if (posts.length === 0) {
    report('warn', { msg: `No fresh posts found on profile, skipping` });
    
    const pending = state.pendingHashtags || [];
    if (pending.length === 0) {
       await chrome.storage.local.set({ gnFyBotState: null });
       report('done', { msg: `🎉 Finished all colleges!` });
       return;
    }
    const [next, ...remaining] = pending;
    state.pendingHashtags = remaining;
    state.currentHashtag = next;
    state.pendingProfile = null;
    await saveFyState(state);
    
    await handleFyCollegeSearchLoop(state);
    return;
  }
  
  const maxPer = 2; 
  state.pendingProfile = null;
  state.pendingPosts = posts.slice(0, maxPer);
  await saveFyState(state);
  
  report('navigate', { msg: `Found ${posts.length} posts. Navigating to first post...` });
  await sleep(800);
  window.location.href = state.pendingPosts[0];
}

async function handleFyPostPage(state) {
  const { pendingPosts = [], igId, url } = state;
  const currentUrl = window.location.href.split('?')[0];

  await sleep(1200); // FASTER: 2000 -> 1200
  report('info', { msg: `Preparing to comment on post...` });

  if (!(await alreadyFyScraped(currentUrl))) {
    await markFyScraped(currentUrl);
    
    const box = await findCommentBox(4000); // FASTER: 5000 -> 4000
    if (box) {
      report('info', { msg: `Found comment box, typing AI message...` });
      const msg = FY_MESSAGES[Math.floor(Math.random() * FY_MESSAGES.length)];
      const adBlock = `🚀 We Provide Complete B.Tech/MCA/MBA Projects!
✅ Mini & Major Projects
✅ Research Papers, PPTs & Abstracts
✅ Full Documentation & SRS
✅ End-to-End Support & Deployment
✅ Plagiarism Removal
✅ Resume Building Projects

📞 Call/WhatsApp: 7981994870
📸 DM us at ${igId}
🌐 Visit: ${url}
🏷️ #graduatenex #finalyearprojects #miniprojects`;
      const fullMessage = `${msg}\n\n${adBlock}`;
      
      const typed = await typeComment(box, fullMessage);
      if (typed) {
        if (typed !== 'API_SUCCESS') {
          await sleep(400);
          await submitComment(box);
        }
        report('done', { msg: `✅ Comment posted successfully!` });
        const delay = Math.floor(Math.random() * 2000) + 2000; // FASTER: 4000+4000 -> 2000+2000
        await sleep(delay);
      }
    } else {
      report('warn', { msg: `❌ Could not find comment box.` });
      await sleep(1000);
    }
  } else {
      report('info', { msg: `Already commented on this post.` });
      await sleep(500);
  }

  const remaining = pendingPosts.slice(1);
  if (remaining.length > 0 && state.running) {
    state.pendingPosts = remaining;
    await saveFyState(state);
    report('navigate', { msg: `Moving to next post...` });
    window.location.href = remaining[0];
  } else {
    report('info', { msg: `Done with this college profile.` });
    await sleep(500);
    
    const pending = state.pendingHashtags || [];
    if (pending.length === 0) {
       await chrome.storage.local.set({ gnFyBotState: null });
       report('done', { msg: `🎉 Finished all colleges!` });
       return;
    }
    const [next, ...remainingHashes] = pending;
    state.pendingHashtags = remainingHashes;
    state.currentHashtag = next;
    state.pendingPosts = [];
    state.pendingProfile = null;
    await saveFyState(state);
    
    await handleFyCollegeSearchLoop(state);
  }
}

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
