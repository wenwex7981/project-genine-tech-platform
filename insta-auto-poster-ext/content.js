// ══════════════════════════════════════════════════════════════════
// GraduateNex Insta Suite — content.js v3.0
// AUTO COMMENTER + AUTO POSTER
// ══════════════════════════════════════════════════════════════════

let commenterRunning = false;
let commenterConfig = null;

// ─────────────────────────────────────────────────────
// SLEEP
// ─────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────
// RANDOM BETWEEN
// ─────────────────────────────────────────────────────
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─────────────────────────────────────────────────────
// SEND PROGRESS TO POPUP
// ─────────────────────────────────────────────────────
function reportProgress(type, data = {}) {
  chrome.runtime.sendMessage({ action: 'COMMENT_PROGRESS', type, ...data });
}

// ─────────────────────────────────────────────────────
// DETECT TOPICS FROM CURRENT PAGE
// ─────────────────────────────────────────────────────
function detectTopicsOnPage(targetTopics) {
  // Grab all visible text from the page
  const pageText = document.body.innerText.toLowerCase();

  // Also grab audio captions / subtitles if available
  const captionEls = document.querySelectorAll(
    '[class*="caption"], [class*="Caption"], [class*="subtitle"], [aria-label*="caption"],' +
    '[class*="reel"], [class*="Reel"], [class*="video"], span[dir], div[dir="auto"]'
  );
  const captionText = Array.from(captionEls).map(e => e.textContent).join(' ').toLowerCase();

  const fullText = pageText + ' ' + captionText;

  // Keyword mapping (wider net)
  const topicKeywords = {
    'ai': ['artificial intelligence', ' ai ', 'machine learning', 'ml ', ' nlp', 'deep learning', 'chatgpt', 'gemini', 'llm', 'neural', 'automation', 'ai tool', 'ai project'],
    'job': ['job', 'hiring', 'recruit', 'vacancy', 'opening', 'opportunity', 'employment', 'work from home', 'wfh', 'offer letter'],
    'fresher': ['fresher', 'fresh graduate', '0 exp', 'zero experience', 'entry level', 'first job', 'no experience'],
    'student': ['student', 'btech', 'b.tech', 'mtech', 'm.tech', 'mca', 'bca', 'engineering', 'college student', 'university'],
    'final year': ['final year', 'fyp', 'last semester', 'graduation project', 'major project', 'mini project', 'thesis', 'viva', 'ieee'],
    'resume': ['resume', 'cv', 'curriculum vitae', 'portfolio', 'linkedin profile'],
    'ats': ['ats', 'applicant tracking', 'resume score', 'ats score', 'shortlisted', 'ats friendly'],
    'career': ['career', 'growth', 'skill', 'upskill', 'learning', 'goal', 'dream company', 'product based', 'service based'],
    'roadmap': ['roadmap', 'path', 'journey', 'how to become', 'guide', 'step by step', 'learning path'],
    'dsa': ['dsa', 'data structure', 'algorithm', 'leetcode', 'coding', 'competitive programming', 'cp ', 'geeksforgeeks', 'gfg'],
    'interview': ['interview', 'preparation', 'prep', 'hr round', 'technical round', 'mock interview', 'cracking'],
    'placement': ['placement', 'campus', 'on campus', 'off campus', 'package', 'lpa', 'ctc', 'offer', 'mnc'],
    'project': ['project', 'source code', 'github', 'deploy', 'build', 'develop', 'web app', 'mobile app'],
    'college': ['college', 'university', 'institute', 'campus', 'hostel', 'semester', 'exam', 'cgpa', 'gpa'],
    'internship': ['internship', 'intern', 'stipend', 'ppo', 'pre placement', 'remote intern'],
  };

  const detected = [];
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (!targetTopics.includes(topic)) continue;
    if (keywords.some(kw => fullText.includes(kw))) {
      detected.push(topic);
    }
  }
  return detected;
}

// ─────────────────────────────────────────────────────
// GET COMMENT FOR TOPIC
// ─────────────────────────────────────────────────────
function getComment(detectedTopics, templates) {
  // Pick the best topic (first detected, randomised)
  const shuffled = [...detectedTopics].sort(() => Math.random() - 0.5);
  const topic = shuffled[0] || 'default';
  const pool = templates[topic] || templates['default'];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─────────────────────────────────────────────────────
// FIND COMMENT BOX (works on Reels, Posts, Explore)
// ─────────────────────────────────────────────────────
function findCommentBox() {
  const selectors = [
    'textarea[placeholder*="Add a comment"]',
    'textarea[placeholder*="comment"]',
    'div[aria-label*="Add a comment"][contenteditable]',
    'div[aria-label*="comment"][contenteditable]',
    'form[class*="comment"] textarea',
    'form textarea',
    'textarea',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.offsetParent !== null) return el; // must be visible
  }
  return null;
}

// ─────────────────────────────────────────────────────
// FIND POST COMMENT BUTTON (Submit)
// ─────────────────────────────────────────────────────
function findPostCommentButton() {
  // Method 1: button with aria-label Post
  const byAria = document.querySelector('button[type="submit"][aria-label*="Post"], button[aria-label*="Post comment"]');
  if (byAria) return byAria;

  // Method 2: any element with text "Post"
  const allBtns = Array.from(document.querySelectorAll('button, div[role="button"]'));
  return allBtns.find(b => b.textContent.trim() === 'Post') || null;
}

// ─────────────────────────────────────────────────────
// ROBUST CLICK
// ─────────────────────────────────────────────────────
function robustClick(el) {
  if (!el) return;
  el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
  el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
  el.click();
}

// ─────────────────────────────────────────────────────
// TYPE INTO COMMENT BOX (React-safe)
// ─────────────────────────────────────────────────────
async function typeComment(commentBox, text) {
  commentBox.focus();
  await sleep(200);

  // Method 1: execCommand
  commentBox.click();
  document.execCommand('selectAll', false, null);
  document.execCommand('delete', false, null);
  await sleep(100);
  document.execCommand('insertText', false, text);
  await sleep(150);

  // Fire React synthetic events
  commentBox.dispatchEvent(new Event('input', { bubbles: true }));
  commentBox.dispatchEvent(new Event('change', { bubbles: true }));
  await sleep(200);

  // Fallback: If box still empty, use ClipboardEvent paste
  const currentVal = commentBox.value || commentBox.textContent || '';
  if (!currentVal.trim()) {
    const dt = new DataTransfer();
    dt.setData('text/plain', text);
    commentBox.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    await sleep(200);
  }
}

// ─────────────────────────────────────────────────────
// POST ONE COMMENT ON CURRENT PAGE
// ─────────────────────────────────────────────────────
async function postOneComment(comment) {
  // Find comment box
  const commentBox = findCommentBox();
  if (!commentBox) {
    // Try clicking the comment area first to expand it
    const clickTargets = Array.from(document.querySelectorAll('span, div, p')).filter(el =>
      el.textContent.trim().toLowerCase().includes('add a comment') && el.offsetParent !== null
    );
    if (clickTargets.length > 0) {
      robustClick(clickTargets[0]);
      await sleep(800);
    }

    const commentBox2 = findCommentBox();
    if (!commentBox2) return false;
    await typeComment(commentBox2, comment);
    await sleep(600);
    const postBtn = findPostCommentButton();
    if (postBtn) { robustClick(postBtn); return true; }
    // Press Enter as fallback
    commentBox2.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
    commentBox2.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
    return true;
  }

  await typeComment(commentBox, comment);
  await sleep(600);

  const postBtn = findPostCommentButton();
  if (postBtn && !postBtn.disabled) {
    robustClick(postBtn);
    return true;
  }
  // Fallback: press Enter
  commentBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
  return true;
}

// ─────────────────────────────────────────────────────
// SCROLL TO NEXT REEL
// ─────────────────────────────────────────────────────
async function scrollToNext() {
  // Try pressing ArrowDown (works on /reels/)
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true }));
  await sleep(300);
  window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  await sleep(500);
}

// ─────────────────────────────────────────────────────
// COMMENTER MAIN LOOP
// ─────────────────────────────────────────────────────
async function runCommenterLoop(config) {
  const { topics, speed, autoScroll, loopMode, commentTemplates } = config;
  let iteration = 0;
  const MAX_ITERATIONS = loopMode ? 9999 : 50;

  while (commenterRunning && iteration < MAX_ITERATIONS) {
    iteration++;

    // 1. Detect topics on current view
    const detected = detectTopicsOnPage(topics);

    if (detected.length > 0) {
      const comment = getComment(detected, commentTemplates);

      try {
        const success = await postOneComment(comment);
        if (success) {
          reportProgress('commented', { comment, queue: MAX_ITERATIONS - iteration });
          await sleep(speed + randomBetween(0, 500)); // add jitter to avoid bot detection
        } else {
          reportProgress('skipped', { reason: 'Comment box not found', queue: MAX_ITERATIONS - iteration });
          skippedCount++;
        }
      } catch (err) {
        reportProgress('error', { error: err.message });
        await sleep(1000);
      }
    } else {
      reportProgress('skipped', { reason: 'No matching topic on this reel', queue: MAX_ITERATIONS - iteration });
      await sleep(300); // skip fast if no match
    }

    // 2. Scroll to next if enabled
    if (autoScroll && commenterRunning) {
      await sleep(randomBetween(400, 800));
      await scrollToNext();
      reportProgress('scrolled', { queue: MAX_ITERATIONS - iteration });
      await sleep(randomBetween(800, 1500)); // wait for next reel to load
    } else if (commenterRunning) {
      await sleep(speed);
    }
  }

  if (commenterRunning) {
    commenterRunning = false;
    reportProgress('stopped', {});
  }
}

// ═══════════════════════════════════════════════════════
// MESSAGE LISTENER
// ═══════════════════════════════════════════════════════
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // ── PING
  if (request.action === 'PING') {
    sendResponse({ status: 'ok' });
    return true;
  }

  // ── START COMMENTER
  if (request.action === 'START_COMMENTER') {
    commenterRunning = true;
    commenterConfig = request.config;
    sendResponse({ status: 'started' });
    runCommenterLoop(request.config);
    return true;
  }

  // ── STOP COMMENTER
  if (request.action === 'STOP_COMMENTER') {
    commenterRunning = false;
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
// AUTO POSTER (existing code kept intact below)
// ══════════════════════════════════════════════════════

function findButtonByText(text) {
  const elements = Array.from(document.querySelectorAll('div[role="button"], button, a[role="link"]'));
  return elements.find(el => el.textContent.trim().toLowerCase() === text.toLowerCase());
}

async function waitForElement(selector, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await sleep(500);
  }
  return null;
}

async function setOriginalCrop() {
  const cropBtnSvg = document.querySelector('svg[aria-label="Select crop"], svg[aria-label="Select Crop"]');
  if (cropBtnSvg) {
    const cropBtn = cropBtnSvg.closest('button') || cropBtnSvg.closest('div[role="button"]');
    if (cropBtn) {
      robustClick(cropBtn);
      await sleep(1000);
      const spans = Array.from(document.querySelectorAll('span'));
      const originalSpan = spans.find(s => s.textContent.trim().toLowerCase() === 'original');
      if (originalSpan) {
        const origBtn = originalSpan.closest('button') || originalSpan.closest('a') || originalSpan.closest('div[role="button"]') || originalSpan.parentElement;
        robustClick(origBtn);
        await sleep(1000);
      }
    }
  }
}

async function clickDropdownPost() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    const spans = Array.from(document.querySelectorAll('span'));
    const postSpan = spans.find(span => span.textContent.trim() === 'Post');
    if (postSpan) {
      const btn = postSpan.closest('a') || postSpan.closest('div[role="button"]') || postSpan.closest('div[role="link"]');
      if (btn) { btn.click(); return true; }
    }
    await sleep(500);
  }
  return false;
}

function findSidebarCreateButton() {
  const spans = Array.from(document.querySelectorAll('span'));
  const createSpan = spans.find(span => span.textContent.trim() === 'Create');
  if (createSpan) return createSpan.closest('a') || createSpan.closest('div[role="button"]') || createSpan.closest('div[role="link"]') || createSpan.parentElement;
  const createSvg = document.querySelector('svg[aria-label="New post"], svg[aria-label="Create"]');
  if (createSvg) return createSvg.closest('a') || createSvg.closest('div[role="button"]') || createSvg.closest('div[role="link"]') || createSvg.parentElement;
  return null;
}

async function startAutomation(base64Data, caption, filename, filetype) {
  const createBtn = findSidebarCreateButton();
  if (!createBtn) { alert("Could not find the 'Create' button. Make sure you are on instagram.com desktop and logged in."); return; }
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
  } catch (err) {
    alert("Error processing image: " + err.message);
    return;
  }

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
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', caption);
    captionBox.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dataTransfer, bubbles: true, cancelable: true }));
    document.execCommand('insertText', false, caption);
  } else {
    alert("Could not find caption box. Paste manually then click Share.");
  }

  await sleep(2500);

  const shareBtn = findButtonByText("Share");
  if (shareBtn) robustClick(shareBtn);
  else alert("Could not find Share button. Please click it manually.");
}
