// ══════════════════════════════════════════════════════════════════
// 🌍 GraduateNex — Global Bot — content_global.js v4.0
// Target Strategy: Community/Student Pages (never official pages)
// Official pages disable comments. "Memes", "Students", "Confessions" do not!
// ══════════════════════════════════════════════════════════════════

const _sleep = ms => new Promise(r => setTimeout(r, ms));
const _rand  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// ── Comment pools
const GLOBAL_COMMENTS = {
  soft: [
    "Hey! Just saw this 🙌 If you're an international student applying for jobs, did you know 75% of resumes get rejected by ATS? GraduateNex checks your ATS score & matches it to the JD! → graduatenex.online 🎓",
    "This is amazing! 😊 Quick tip for students — GraduateNex gives you mock interviews, AI ATS resume builders, and capstone project help all in one place globally! → graduatenex.online",
    "Love this community 💙 Students needing career guidance, plagiarism checkers, or thesis support — GraduateNex has it all at graduatenex.online 🚀",
    "Really inspiring! 🙌 If anyone here is struggling to land interviews, check your resume's ATS score and get JD matching at GraduateNex → graduatenex.online",
    "Great page! 🎉 Students — AI-powered career & academic platform built for you globally → graduatenex.online 🎓 Mock interviews, ATS resumes, capstones covered!",
    "Amazing! 👏 Students struggling with project docs or job hunting — GraduateNex offers AI resume builders and plagiarism tools globally → graduatenex.online",
    "Love this 🔥 International university student? GraduateNex helps with career guidance, JD resume building & academic support globally 🌍 graduatenex.online",
  ],
  bold: [
    "🚨 STUDENTS: GraduateNex = #1 AI platform for ATS Resumes + Mock Interviews + Career Guidance → graduatenex.online 2,500+ students GLOBALLY! 🌍",
    "UNIVERSITY STUDENTS 🎓 GraduateNex delivers: ATS score checker + JD matching + Plagiarism tools! → graduatenex.online 🚀",
    "🔥 Job applications getting ignored? Check your ATS resume score against any Job Description at GraduateNex! → graduatenex.online",
    "⚡ Struggling with interviews or thesis? GraduateNex AI mock interviews & academic tools fix that → graduatenex.online FREE to explore!",
    "🏆 2,500+ students globally used GraduateNex for their capstone projects & landing jobs via ATS-friendly resumes → graduatenex.online 🎓",
    "📣 INTERNATIONAL STUDENTS: GraduateNex serves students globally with AI ATS Builders, Career Guidance & Plagiarism tools → graduatenex.online 🌍",
  ],
  question: [
    "Quick question 🤔 — do you know your resume's ATS score? Most get auto-rejected! Check it against your target JD at GraduateNex → graduatenex.online 🎓",
    "Have you seen what AI does for job hunting? 😮 GraduateNex gives you mock interviews & builds ATS-perfect resumes → graduatenex.online",
    "Need help landing interviews? 🤔 GraduateNex provides career guidance and ATS/JD matching tools for international students → graduatenex.online",
    "How is everyone checking their work for plagiarism? 😅 GraduateNex has advanced AI plagiarism tools & thesis support → graduatenex.online 🚀",
    "Graduating soon? 🎓 Got your ATS resume ready? GraduateNex helps international students get hired worldwide → graduatenex.online 🌍",
    "Heard of GraduateNex? 🤔 AI-powered platform for international students — ATS resume builder + mock interviews + capstone projects → graduatenex.online",
  ],
};

function getGlobalComment(style) {
  const pool = GLOBAL_COMMENTS[style] || GLOBAL_COMMENTS.soft;
  return pool[Math.floor(Math.random() * pool.length)];
}

function globReport(type, data) {
  try { chrome.runtime.sendMessage(Object.assign({ action: 'GLOBAL_BOT_PROGRESS', type }, data || {})); } catch(e) {}
}

function globOverlay(msg) {
  let r = document.getElementById('gn-glob-reporter');
  if (!r) {
    r = document.createElement('div');
    r.id = 'gn-glob-reporter';
    r.style.cssText = 'position:fixed;bottom:20px;right:20px;width:340px;background:rgba(5,10,20,0.96);color:#fff;font-family:monospace;font-size:12px;padding:14px;border-radius:12px;z-index:9999998;box-shadow:0 8px 32px rgba(0,0,0,0.9);border:2px solid #6366f1;';
    document.body.appendChild(r);
  }
  r.innerHTML = '<div style="color:#6366f1;font-weight:bold;margin-bottom:6px;font-size:14px;">🎓 GraduateNex Global Bot v4</div>' +
    '<div style="line-height:1.5;">' + msg + '</div>' +
    '<div style="font-size:10px;color:#94a3b8;margin-top:6px;">' + new Date().toLocaleTimeString() + '</div>';
}

const saveGlobState = s => chrome.storage.local.set({ gnGlobalBotState: s });

async function alreadyGlobVisited(u) {
  const d = await chrome.storage.local.get(['gnGlobVisitedProfiles']);
  return (d.gnGlobVisitedProfiles || []).includes(u.toLowerCase());
}
async function markGlobVisited(u) {
  const d = await chrome.storage.local.get(['gnGlobVisitedProfiles']);
  const arr = d.gnGlobVisitedProfiles || [];
  const ul = u.toLowerCase();
  if (!arr.includes(ul)) { arr.push(ul); await chrome.storage.local.set({ gnGlobVisitedProfiles: arr.slice(-10000) }); }
}
async function alreadyGlobScraped(url) {
  const d = await chrome.storage.local.get(['gnGlobScrapedUrls']);
  return (d.gnGlobScrapedUrls || []).includes(url);
}
async function markGlobScraped(url) {
  const d = await chrome.storage.local.get(['gnGlobScrapedUrls']);
  const arr = d.gnGlobScrapedUrls || [];
  if (!arr.includes(url)) { arr.push(url); await chrome.storage.local.set({ gnGlobScrapedUrls: arr.slice(-20000) }); }
}

function getCSRF() {
  const m = document.cookie.match(/csrftoken=([^;]+)/);
  return m ? m[1] : '';
}

// ── Search for a Community/Student page instead of Official Page
async function searchGlobProfile(universityName, retryType = 0) {
  try {
    let cleanName = universityName.trim();
    
    // If it's a direct IG handle provided by user (starts with @ or has no spaces), use it directly!
    if (cleanName.startsWith('@') || (!cleanName.includes(' ') && !cleanName.toLowerCase().includes('university'))) {
      if (cleanName.startsWith('@')) cleanName = cleanName.substring(1);
      // Remove any URL parts
      if (cleanName.includes('instagram.com/')) {
         cleanName = cleanName.split('instagram.com/')[1].split('/')[0];
      }
      return cleanName;
    }

    const csrf = getCSRF();
    
    // Clean university name (e.g. "Harvard University" -> "Harvard")
    cleanName = cleanName.replace(/ University| College| Institute/gi, '').trim();
    
    // Try different search queries to find community pages
    let query = cleanName;
    if (retryType === 0) query = cleanName + " students";
    if (retryType === 1) query = cleanName + " memes";
    if (retryType === 2) query = cleanName + " confessions";
    if (retryType === 3) query = cleanName + " alumni";

    const res  = await fetch('https://www.instagram.com/web/search/topsearch/?context=blended&query=' + encodeURIComponent(query), {
      headers: { 'X-CSRFToken': csrf, 'X-Requested-With': 'XMLHttpRequest' }
    });
    
    if (!res.ok) return null;
    const data = JSON.parse(await res.text());
    
    // Filter out verified pages (official pages usually have comments disabled)
    // and find the best match
    if (data.users && data.users.length > 0) {
      for (const u of data.users) {
        if (u.user && !u.user.is_verified) {
          return u.user.username; // Return first non-verified community page
        }
      }
      // Fallback to first user if all are verified
      return data.users[0].user.username;
    }
    return null;
  } catch(e) { return null; }
}

async function collectGlobPostLinks(timeout) {
  timeout = timeout || 4000;
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const seen = new Set(), links = [];
    document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(a => {
      if (a.href && !seen.has(a.href)) { seen.add(a.href); links.push(a.href); }
    });
    if (links.length >= 1) return links;
    await _sleep(200);
  }
  return [];
}

async function globPostViaAPI(text) {
  try {
    const csrf  = getCSRF();
    let appId   = '936619743392459';
    const appSc = Array.from(document.querySelectorAll('script')).find(s => s.textContent.includes('APP_ID'));
    if (appSc) { const m = appSc.textContent.match(/"APP_ID":"(\d+)"/); if (m) appId = m[1]; }

    let mediaId = null;
    const scMatch = window.location.href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
    if (scMatch) {
      const shortcode = scMatch[2];
      const alphabet  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      let n = BigInt(0);
      for (const c of shortcode) { n = n * BigInt(64) + BigInt(alphabet.indexOf(c)); }
      mediaId = n.toString();
    }
    if (!mediaId) {
      const meta = document.querySelector('meta[property="al:ios:url"]');
      if (meta && meta.content.includes('id=')) mediaId = meta.content.split('id=')[1];
    }
    if (!mediaId || !csrf) return false;

    const body = new URLSearchParams({ comment_text: text, replied_to_comment_id: '' });
    const res  = await fetch('https://www.instagram.com/api/v1/web/comments/' + mediaId + '/add/', {
      method:  'POST',
      headers: { 'X-CSRFToken': csrf, 'X-IG-App-ID': appId, 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    });
    const data = await res.json();
    return data && data.status === 'ok' ? 'API_SUCCESS' : false;
  } catch(e) { return false; }
}

async function globFindCommentBox(timeout) {
  timeout = timeout || 3000;
  const start = Date.now();
  const SELS  = [
    'textarea[placeholder*="comment" i]',
    'textarea[aria-label*="comment" i]',
    'div[role="textbox"][aria-label*="comment" i]',
    'div[contenteditable="true"][aria-label*="comment" i]',
    'div[role="textbox"]',
    'form textarea',
  ];
  while (Date.now() - start < timeout) {
    window.scrollTo(0, document.body.scrollHeight);
    await _sleep(200);
    for (const sel of SELS) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) { el.scrollIntoView({ block: 'center' }); return el; }
    }
    const all = Array.from(document.querySelectorAll('*'));
    const ph  = all.find(el => {
      const t = (el.textContent || '').trim();
      return (t === 'Add a comment…' || t === 'Add a comment...' || t === 'Add a comment')
        && el.children.length === 0 && el.offsetParent !== null;
    });
    if (ph) { ph.click(); await _sleep(400); }
  }
  return null;
}

async function globTypeComment(box, text) {
  box.scrollIntoView({ block: 'center' });
  await _sleep(150);
  const rect = box.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  ['mousedown','mouseup','click'].forEach(t => box.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy })));
  await _sleep(150);
  box.focus();
  await _sleep(150);

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

  try {
    const range = document.createRange(), sel = window.getSelection();
    range.selectNodeContents(box); range.collapse(false);
    sel.removeAllRanges(); sel.addRange(range);
    document.execCommand('selectAll', false, null);
    document.execCommand('delete',    false, null);
    document.execCommand('insertText', false, text);
    box.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    await _sleep(200);
    if ((box.textContent || '').replace(/Add a comment[….]*/g,'').trim()) return true;
  } catch(e) {}

  try {
    box.focus();
    const dt = new DataTransfer(); dt.setData('text/plain', text); dt.setData('text/html', text);
    box.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    await _sleep(300);
    const v = (box.value || box.textContent || '').replace(/Add a comment[….]*/g,'').trim();
    if (v) return true;
  } catch(e) {}

  return false;
}

async function globSubmitComment(box) {
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn && !submitBtn.disabled && submitBtn.offsetHeight > 0) { submitBtn.click(); await _sleep(500); return; }
  const postBtn = Array.from(document.querySelectorAll('button, div[role="button"]')).find(b => b.textContent.trim() === 'Post' && b.offsetHeight > 0);
  if (postBtn) { postBtn.click(); await _sleep(500); return; }
  box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
  await _sleep(400);
}

// ══════════════════════════════════════════════
// MAIN BOT STATE MACHINE
// ══════════════════════════════════════════════

let globBotRunning = false;

// Step 1: Search universities, navigate to community profile
async function runGlobalBotSearchLoop(state) {
  let s = state;
  while (globBotRunning && s.running && s.pendingUniversities && s.pendingUniversities.length > 0) {
    const university = s.pendingUniversities[0];
    const remaining  = s.pendingUniversities.slice(1);

    globReport('navigate', { reason: '🔍 ' + university.substring(0, 40) + '...', remaining: remaining.length });
    globOverlay('🔍 Searching for Community Page:<br>🎓 ' + university.substring(0, 45));
    await _sleep(300);

    let username = null;
    // Try multiple search strategies to find a good community page
    for (let retry = 0; retry < 4; retry++) {
      username = await searchGlobProfile(university, retry);
      if (username) {
        if (!(await alreadyGlobVisited(username))) {
          break; // Found a fresh one!
        }
      }
      await _sleep(200);
    }

    if (!username || (await alreadyGlobVisited(username))) {
      globReport('skipped', { reason: 'No fresh community profile found for ' + university.substring(0, 20) });
      globOverlay('⚠️ Could not find open community page. Skipping...');
      s.pendingUniversities = remaining;
      await saveGlobState(s);
      await _sleep(200);
      continue;
    }

    globReport('info', { reason: '✅ @' + username + ' → visiting...' });
    globOverlay('✅ Found @' + username + '! Navigating...');
    await markGlobVisited(username);

    s.pendingUniversities = remaining;
    s.pendingProfile      = username;
    s.currentProfile      = username;
    s.currentUniName      = university;
    await saveGlobState(s);
    window.location.href  = 'https://www.instagram.com/' + username + '/';
    return; 
  }

  // All done
  await chrome.storage.local.set({ gnGlobalBotState: null });
  const total = (s.stats && s.stats.commented) || 0;
  globReport('done', { reason: '🎉 Done! ' + total + ' comments posted globally.' });
  globOverlay('🎉 All universities done! ' + total + ' comments posted.');
}

// Step 2: On profile page — collect posts
async function handleGlobProfilePage(state) {
  await _sleep(1000); 
  globReport('info', { reason: 'Collecting posts from @' + state.pendingProfile });
  globOverlay('📸 Collecting posts from<br>@' + state.pendingProfile);

  let posts = await collectGlobPostLinks(4000); 
  const scrapedData = await chrome.storage.local.get(['gnGlobScrapedUrls']);
  posts = posts.filter(url => !(scrapedData.gnGlobScrapedUrls || []).includes(url));

  if (posts.length === 0) {
    globReport('skipped', { reason: 'No fresh posts on @' + state.pendingProfile });
    const ns = Object.assign({}, state, { pendingProfile: null, pendingPosts: [] });
    await saveGlobState(ns);
    globOverlay('⏭ No posts found. Moving to next...');
    await _sleep(200);
    await runGlobalBotSearchLoop(ns);
    return;
  }

  const ns = Object.assign({}, state, { pendingProfile: null, pendingPosts: posts.slice(0, 3) });
  await saveGlobState(ns);
  globReport('navigate', { reason: 'Found ' + posts.length + ' posts. Going to first...', remaining: (state.pendingUniversities || []).length });
  globOverlay('📄 ' + posts.length + ' posts found.<br>Going to first post...');
  await _sleep(400); 
  window.location.href = ns.pendingPosts[0];
}

// Step 3: On post page — comment
async function handleGlobPostPage(state) {
  const pendingPosts = state.pendingPosts || [];
  const config       = state.config || {};
  const currentUrl   = window.location.href.split('?')[0];

  await _sleep(800); 

  if (!(await alreadyGlobScraped(currentUrl))) {
    await markGlobScraped(currentUrl);
    
    // Blacklist check for Pakistan
    const pageText = document.body.innerText.toLowerCase();
    const blacklist = ['pakistan', 'lahore', 'karachi', 'islamabad', 'pk'];
    if (blacklist.some(kw => pageText.includes(kw) || state.currentUniName.toLowerCase().includes(kw))) {
      globReport('skipped', { reason: 'Blacklist keyword found. Skipping...' });
      globOverlay('⏭ Blocked by keyword filter. Skipping...');
      await _sleep(200);
    } else {
      const comment = getGlobalComment(config.style || 'soft');
      const footer  = '\n\n🌐 ' + (config.websiteUrl || 'graduatenex.online') +
                      '\n📸 @graduatenex\n#graduatenex #internationalstudents #capstoneproject';
      const fullMsg = comment + footer;

      globOverlay('🚀 Trying Private API comment...');
      globReport('info', { reason: 'Attempting Private API...' });

      let typed = await globPostViaAPI(fullMsg);

      if (!typed) {
        globOverlay('💬 API failed. Finding UI box...');
        const box = await globFindCommentBox(2500);
        if (box) {
          typed = await globTypeComment(box, fullMsg);
          if (typed) {
            await _sleep(200);
            await globSubmitComment(box);
          }
        }
      }

      if (typed) {
        globReport('commented', { profile: state.currentProfile || state.currentUniName || 'uni', comment });
        if (!state.stats) state.stats = { commented: 0, skipped: 0 };
        state.stats.commented++;
        globOverlay('✅ Comment posted! Total: ' + state.stats.commented + '<br>@' + (state.currentProfile || ''));
        const delay = config.speed || 900;
        await _sleep(delay);
      } else {
        globReport('skipped', { reason: 'Comment failed on this post — moving on' });
        globOverlay('⚠️ Comment failed (likely disabled). Moving to next...');
        await _sleep(200);
      }
    }
  } else {
    globReport('info', { reason: 'Already commented on this post' });
    globOverlay('⏭ Already done. Skipping...');
    await _sleep(100);
  }

  // Move to next post or next university
  const remaining = pendingPosts.slice(1);
  if (remaining.length > 0 && globBotRunning && state.running) {
    const ns = Object.assign({}, state, { pendingPosts: remaining });
    await saveGlobState(ns);
    globOverlay('➡️ Next post (' + remaining.length + ' left)...');
    window.location.href = remaining[0];
  } else {
    const ns = Object.assign({}, state, { pendingPosts: [] });
    await saveGlobState(ns);
    globReport('navigate', { reason: 'Done with @' + (state.currentProfile || 'uni') + '. Next...', remaining: (state.pendingUniversities || []).length });
    globOverlay('🔄 Done with this uni! Searching next...');
    await _sleep(200);
    await runGlobalBotSearchLoop(ns);
  }
}

// ── Auto-resume
(async function globBotOnLoad() {
  await _sleep(600); 
  const d     = await chrome.storage.local.get(['gnGlobalBotState']);
  const state = d.gnGlobalBotState;
  if (!state || !state.running) return;

  globBotRunning = true;
  const url    = window.location.href;
  const isPost = /instagram\.com\/.*?(p|reel)\//.test(url);

  globOverlay('🔄 Resuming Global Bot...<br>' + (state.currentProfile ? '@' + state.currentProfile : ''));

  if (isPost && state.pendingPosts && state.pendingPosts.length > 0) {
    await handleGlobPostPage(state);
  } else if (state.pendingProfile && url.toLowerCase().includes(state.pendingProfile.toLowerCase())) {
    await handleGlobProfilePage(state);
  } else if (state.pendingProfile) {
    if (state.lastRedirect === state.pendingProfile) {
      // Instagram rejected/redirected us (e.g. login wall). Skip this profile to prevent infinite loop.
      globOverlay('⚠️ Redirect detected. Skipping @' + state.pendingProfile);
      const ns = Object.assign({}, state, { pendingProfile: null });
      await saveGlobState(ns);
      await runGlobalBotSearchLoop(ns);
    } else {
      globOverlay('🔄 Navigating to @' + state.pendingProfile + '...');
      const ns = Object.assign({}, state, { lastRedirect: state.pendingProfile });
      await saveGlobState(ns);
      window.location.href = 'https://www.instagram.com/' + state.pendingProfile + '/';
    }
  } else if (state.pendingPosts && state.pendingPosts.length > 0) {
    if (state.lastRedirect === state.pendingPosts[0]) {
      globOverlay('⚠️ Post redirect loop detected. Skipping post...');
      const ns = Object.assign({}, state, { pendingPosts: state.pendingPosts.slice(1) });
      await saveGlobState(ns);
      if (ns.pendingPosts.length > 0) {
        const ns2 = Object.assign({}, ns, { lastRedirect: ns.pendingPosts[0] });
        await saveGlobState(ns2);
        window.location.href = ns2.pendingPosts[0];
      } else {
        await runGlobalBotSearchLoop(ns);
      }
    } else {
      const ns = Object.assign({}, state, { lastRedirect: state.pendingPosts[0] });
      await saveGlobState(ns);
      window.location.href = state.pendingPosts[0];
    }
  } else {
    await runGlobalBotSearchLoop(state);
  }
})();

// ── Message listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'START_GLOBAL_BOT') {
    sendResponse({ status: 'started' });
    globBotRunning = true;

    const config = request.config;
    const state  = {
      running:             true,
      pendingUniversities: config.universities || [],
      pendingPosts:        [],
      pendingProfile:      null,
      currentProfile:      null,
      currentUniName:      null,
      stats:               { commented: 0, skipped: 0 },
      config,
    };
    chrome.storage.local.set({ gnGlobalBotState: state }, function() {
      globReport('navigate', {
        reason:    '🌍 Global Bot v4 started! ' + config.universities.length + ' universities',
        remaining: config.universities.length,
      });
      globOverlay('🌍 Global Bot v4 ACTIVE!<br>' + config.universities.length + ' unis queued. Targeting community pages 🚀');
      runGlobalBotSearchLoop(state);
    });
    return true;
  }

  if (request.action === 'STOP_GLOBAL_BOT') {
    globBotRunning = false;
    chrome.storage.local.get(['gnGlobalBotState'], (d) => {
      if (d.gnGlobalBotState) {
        d.gnGlobalBotState.running = false;
        chrome.storage.local.set({ gnGlobalBotState: d.gnGlobalBotState });
      }
    });
    const ov = document.getElementById('gn-glob-reporter');
    if (ov) ov.remove();
    sendResponse({ status: 'stopped' });
    return true;
  }
});
