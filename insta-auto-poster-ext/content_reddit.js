// ══════════════════════════════════════════════════════════════════
// 🌍 GraduateNex — Reddit Global Bot — content_reddit.js v1.0
// Target Strategy: Target subreddits, parse /new, comment on posts
// ══════════════════════════════════════════════════════════════════

const _sleep = ms => new Promise(r => setTimeout(r, ms));
const _rand  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// ── Comment pools for Reddit
const REDDIT_COMMENTS = {
  soft: [
    "Hey! If you're currently applying for roles, just a heads-up that a lot of resumes get auto-rejected by ATS before a human even sees them. You can check your ATS score and get mock interview practice at GraduateNex. Hope it helps! 🎓",
    "This is a common struggle. A quick tip — I found that using an AI ATS resume builder really helps get past the initial screen. GraduateNex has some solid free tools for this and JD matching if you want to check it out.",
    "If you're an international student or just struggling to land interviews, definitely check your resume's ATS score. GraduateNex (graduatenex.online) has tools for mock interviews and plagiarism checks that might be useful here 🚀",
  ],
  bold: [
    "🚨 Friendly reminder: 75% of applications are rejected by ATS bots. Always check your ATS score against the Job Description! GraduateNex does this for free along with AI mock interviews. Don't let a bad format ruin your chances! 🌍",
    "Stop applying blindly! 🎓 Use an ATS Resume Builder to match your resume to the exact JD. GraduateNex gives you ATS checks, mock interviews, and career guidance all in one place.",
    "🔥 If you aren't getting callbacks, your resume is likely failing the ATS check. Run it through GraduateNex's ATS scanner and do a quick AI mock interview to prep.",
  ],
  question: [
    "Quick question 🤔 — have you checked your resume's ATS score for this specific role? Most get auto-rejected! GraduateNex has a tool that matches it directly to the JD.",
    "Have you tried doing any mock interviews to prep for this? 😮 GraduateNex has an AI mock interview tool and ATS resume builder that might really help your situation.",
    "Is your resume ATS-friendly? 🤔 A lot of people don't realize their formatting is getting them auto-rejected. You can check your score on GraduateNex and even practice interviews there.",
  ]
};

function getRedditComment(style) {
  const pool = REDDIT_COMMENTS[style] || REDDIT_COMMENTS.soft;
  return pool[Math.floor(Math.random() * pool.length)];
}

function redditReport(type, data) {
  try { chrome.runtime.sendMessage(Object.assign({ action: 'REDDIT_BOT_PROGRESS', type }, data || {})); } catch(e) {}
}

function redditOverlay(msg) {
  let r = document.getElementById('gn-reddit-reporter');
  if (!r) {
    r = document.createElement('div');
    r.id = 'gn-reddit-reporter';
    r.style.cssText = 'position:fixed;bottom:20px;left:20px;width:340px;background:rgba(5,10,20,0.96);color:#fff;font-family:monospace;font-size:12px;padding:14px;border-radius:12px;z-index:9999998;box-shadow:0 8px 32px rgba(0,0,0,0.9);border:2px solid #ff4500;';
    document.body.appendChild(r);
  }
  r.innerHTML = '<div style="color:#ff4500;font-weight:bold;margin-bottom:6px;font-size:14px;">🔥 GraduateNex Reddit Bot v1</div>' +
    '<div style="line-height:1.5;">' + msg + '</div>' +
    '<div style="font-size:10px;color:#94a3b8;margin-top:6px;">' + new Date().toLocaleTimeString() + '</div>';
}

const saveRedditState = s => chrome.storage.local.set({ gnRedditBotState: s });

async function alreadyRedditScraped(url) {
  const d = await chrome.storage.local.get(['gnRedditScrapedUrls']);
  return (d.gnRedditScrapedUrls || []).includes(url);
}
async function markRedditScraped(url) {
  const d = await chrome.storage.local.get(['gnRedditScrapedUrls']);
  const arr = d.gnRedditScrapedUrls || [];
  if (!arr.includes(url)) { arr.push(url); await chrome.storage.local.set({ gnRedditScrapedUrls: arr.slice(-20000) }); }
}

async function collectRedditPostLinks(timeout) {
  timeout = timeout || 4000;
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const seen = new Set(), links = [];
    
    document.querySelectorAll('a[href*="/comments/"]').forEach(a => {
      let href = a.getAttribute('href');
      if (!href) return;
      let isAd = a.closest('[promoted]') || a.closest('.promotedlink');
      if (isAd) return;
      if (href.match(/\/r\/[^\/]+\/comments\/[a-z0-9]+\//i)) {
        const fullUrl = href.startsWith('http') ? href : 'https://www.reddit.com' + href;
        try {
          const urlObj = new URL(fullUrl);
          const parts = urlObj.pathname.split('/').filter(Boolean);
          if (parts.length >= 4 && parts[2] === 'comments') {
            let canonicalUrl = 'https://www.reddit.com/' + parts.slice(0, 5).join('/') + '/';
            if (!seen.has(canonicalUrl)) { seen.add(canonicalUrl); links.push(canonicalUrl); }
          }
        } catch(e) {}
      }
    });

    if (links.length >= 2) return links;
    await _sleep(200);
    window.scrollBy(0, 500);
  }
  return [];
}

async function redditFindCommentBox(timeout) {
  timeout = timeout || 3000;
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    // Shreddit composer (new UI)
    const composer = document.querySelector('shreddit-composer');
    if (composer) {
      // Attempt to find the internal contenteditable div
      const editor = composer.querySelector('div[contenteditable="true"]') || composer;
      editor.scrollIntoView({ block: 'center' });
      return editor;
    }
    
    // Old UI Draftail editor
    const oldEditor = document.querySelector('.DraftEditor-root div[contenteditable="true"]');
    if (oldEditor) {
      oldEditor.scrollIntoView({ block: 'center' });
      return oldEditor;
    }

    const textArea = document.querySelector('textarea[name="text"]');
    if (textArea) {
       textArea.scrollIntoView({ block: 'center' });
       return textArea;
    }

    await _sleep(200);
  }
  return null;
}

async function redditTypeComment(box, text) {
  box.scrollIntoView({ block: 'center' });
  await _sleep(150);
  
  box.focus();
  await _sleep(150);

  // If it's a contenteditable div (Draft.js or Lexical)
  try {
    const dt = new DataTransfer(); 
    dt.setData('text/plain', text); 
    dt.setData('text/html', text);
    const pasteEvent = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
    box.dispatchEvent(pasteEvent);
    
    // Fallback document.execCommand
    if (!pasteEvent.defaultPrevented) {
      const range = document.createRange(), sel = window.getSelection();
      range.selectNodeContents(box); range.collapse(false);
      sel.removeAllRanges(); sel.addRange(range);
      document.execCommand('insertText', false, text);
    }

    box.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    await _sleep(300);
    return true;
  } catch(e) {}
  
  // If it's a standard textarea
  if (box.tagName === 'TEXTAREA') {
    try {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(box, text);
        box.dispatchEvent(new Event('input',  { bubbles: true }));
        box.dispatchEvent(new Event('change', { bubbles: true }));
        await _sleep(200);
        if ((box.value || '').trim()) return true;
      }
    } catch(e) {}
  }

  return false;
}

async function redditSubmitComment(box) {
  // New UI
  let submitBtn = document.querySelector('shreddit-composer')?.querySelector('button[type="submit"], button[slot="submitButton"]');
  if (submitBtn && !submitBtn.disabled) { submitBtn.click(); await _sleep(500); return true; }
  
  // Old UI
  submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase() === 'comment' || b.textContent.trim().toLowerCase() === 'reply');
  if (submitBtn && !submitBtn.disabled) { submitBtn.click(); await _sleep(500); return true; }

  // Fallback keyboard Enter (Ctrl+Enter is common for submission)
  box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', ctrlKey: true, bubbles: true }));
  await _sleep(400);
  return true;
}

// ══════════════════════════════════════════════
// MAIN BOT STATE MACHINE
// ══════════════════════════════════════════════

let redditBotRunning = false;

// Step 1: Navigate to subreddit
async function runRedditBotSearchLoop(state) {
  let s = state;
  while (redditBotRunning && s.running && s.pendingSubreddits && s.pendingSubreddits.length > 0) {
    const subreddit = s.pendingSubreddits[0];
    const remaining = s.pendingSubreddits.slice(1);

    redditReport('navigate', { reason: '🔍 r/' + subreddit, remaining: remaining.length });
    redditOverlay('🔍 Navigating to subreddit:<br>r/' + subreddit);
    await _sleep(300);

    s.pendingSubreddits = remaining;
    s.currentSubreddit  = subreddit;
    await saveRedditState(s);
    const targetUrl = 'https://www.reddit.com/r/' + subreddit + '/new/';
    if (window.location.href.split('?')[0].toLowerCase() === targetUrl.toLowerCase()) {
      handleRedditSubredditPage(s);
    } else {
      window.location.href = targetUrl;
    }
    return; 
  }

  // All done
  await chrome.storage.local.set({ gnRedditBotState: null });
  const total = (s.stats && s.stats.commented) || 0;
  redditReport('done', { reason: '🎉 Done! ' + total + ' comments posted on Reddit.' });
  redditOverlay('🎉 All subreddits done! ' + total + ' comments posted.');
}

// Step 2: On subreddit page — collect posts
async function handleRedditSubredditPage(state) {
  await _sleep(200); 
  redditReport('info', { reason: 'Collecting posts from r/' + state.currentSubreddit });
  redditOverlay('📸 Collecting posts from<br>r/' + state.currentSubreddit);

  let posts = await collectRedditPostLinks(5000); 
  const scrapedData = await chrome.storage.local.get(['gnRedditScrapedUrls']);
  posts = posts.filter(url => !(scrapedData.gnRedditScrapedUrls || []).includes(url));

  if (posts.length === 0) {
    redditReport('skipped', { reason: 'No fresh posts on r/' + state.currentSubreddit });
    const ns = Object.assign({}, state, { pendingPosts: [] });
    await saveRedditState(ns);
    redditOverlay('⏭ No fresh posts found. Moving to next subreddit...');
    await _sleep(200);
    await runRedditBotSearchLoop(ns);
    return;
  }

  // Take top 5 fresh posts
  const ns = Object.assign({}, state, { pendingPosts: posts.slice(0, 5) });
  await saveRedditState(ns);
  redditReport('navigate', { reason: 'Found ' + posts.length + ' posts. Going to first...', remaining: (state.pendingSubreddits || []).length });
  redditOverlay('📄 ' + posts.length + ' posts found.<br>Going to first post...');
  await _sleep(400); 
  const firstPost = ns.pendingPosts[0];
  if (window.location.href.split('?')[0].toLowerCase() === firstPost.toLowerCase()) {
    handleRedditPostPage(ns);
  } else {
    window.location.href = firstPost;
  }
}

// Step 3: On post page — comment
async function handleRedditPostPage(state) {
  const pendingPosts = state.pendingPosts || [];
  const config       = state.config || {};
  const currentUrl   = window.location.href.split('?')[0];

  await _sleep(300); // Let Reddit load fully

  if (!(await alreadyRedditScraped(currentUrl))) {
    await markRedditScraped(currentUrl);

    const comment = getRedditComment(config.style || 'soft');
    const footer  = '\n\n🌐 ' + (config.websiteUrl || 'graduatenex.online') + ' - AI Career Tools & Project Guidance';
    const fullMsg = comment + footer;

    redditOverlay('💬 Finding comment box...');
    const box = await redditFindCommentBox(4000);
    
    let typed = false;
    if (box) {
      typed = await redditTypeComment(box, fullMsg);
      if (typed) {
        await _sleep(500);
        await redditSubmitComment(box);
      }
    }

    if (typed) {
      redditReport('commented', { subreddit: state.currentSubreddit || 'unknown', comment });
      if (!state.stats) state.stats = { commented: 0, skipped: 0 };
      state.stats.commented++;
      redditOverlay('✅ Comment posted! Total: ' + state.stats.commented + '<br>r/' + (state.currentSubreddit || ''));
      const delay = config.speed || 8000;
      await _sleep(delay);
    } else {
      redditReport('skipped', { reason: 'Could not find or type in comment box — moving on' });
      redditOverlay('⚠️ Comment failed. Moving to next...');
      await _sleep(200);
    }
  } else {
    redditReport('info', { reason: 'Already commented on this post' });
    redditOverlay('⏭ Already done. Skipping...');
    await _sleep(500);
  }

  // Move to next post or next subreddit
  const remaining = pendingPosts.slice(1);
  if (remaining.length > 0 && redditBotRunning && state.running) {
    const ns = Object.assign({}, state, { pendingPosts: remaining });
    await saveRedditState(ns);
    redditOverlay('➡️ Next post (' + remaining.length + ' left)...');
    const nextTarget = remaining[0];
    if (window.location.href.split('?')[0].toLowerCase() === nextTarget.toLowerCase()) {
      handleRedditPostPage(ns);
    } else {
      window.location.href = nextTarget;
    }
  } else if (redditBotRunning && state.running) {
    redditOverlay('✅ Finished posts for r/' + state.currentSubreddit + '. Moving to next subreddit...');
    await _sleep(200);
    await runRedditBotSearchLoop(state);
  }
}

// ══════════════════════════════════════════════
// MESSAGE LISTENER
// ══════════════════════════════════════════════

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'START_REDDIT_BOT') {
    redditBotRunning = true;
    sendResponse({ status: 'ok' });
    
    const state = {
      running: true,
      pendingSubreddits: msg.config.subreddits,
      currentSubreddit: null,
      pendingPosts: [],
      config: msg.config,
      stats: { commented: 0, skipped: 0 }
    };
    saveRedditState(state).then(() => runRedditBotSearchLoop(state));
  } else if (msg.action === 'STOP_REDDIT_BOT') {
    redditBotRunning = false;
    redditOverlay('🛑 Bot stopped by user.');
    chrome.storage.local.get(['gnRedditBotState'], (d) => {
      if (d.gnRedditBotState) {
        d.gnRedditBotState.running = false;
        chrome.storage.local.set({ gnRedditBotState: d.gnRedditBotState });
      }
    });
    sendResponse({ status: 'ok' });
  }
});

// ══════════════════════════════════════════════
// AUTO-RESUME ON PAGE LOAD
// ══════════════════════════════════════════════
window.addEventListener('load', () => {
  chrome.storage.local.get(['gnRedditBotState'], (d) => {
    const s = d.gnRedditBotState;
    if (s && s.running) {
      redditBotRunning = true;
      redditOverlay('🔄 Resuming Reddit bot...');
      setTimeout(() => {
        const url = window.location.href;
        if (url.includes('/comments/')) {
          handleRedditPostPage(s);
        } else if (url.includes('/new')) {
          handleRedditSubredditPage(s);
        } else {
          // Fallback if we ended up somewhere weird
          runRedditBotSearchLoop(s);
        }
      }, 1500);
    }
  });
});
