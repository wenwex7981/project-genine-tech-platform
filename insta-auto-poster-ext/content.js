// TakeVolet Insta Auto Commenter — content.js v4.0
// FULL VISUAL AUTOMATION: Reel Highlight + Live Typing Visual Preview + DOM Typing + Direct API Fallback

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

let isRunning = false;
let commentedCount = 0;
let skippedCount = 0;

// ── 15 VARIED TAKE-VOLET PROMOTIONAL COMMENT TEMPLATES
const TAKEVOLET_TEMPLATES = [
  "Hey guys! I'm the founder of TakeVolet 🏠 Serving across India in major cities like {city}, Hyderabad, Mumbai, Pune, Delhi, Noida & Chennai! Book PGs, co-living hostels, rental flats, sharing rooms & day-wise stays with ZERO brokerage. Please support our startup 🙏\n📲 Play Store App: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Website: takevolet.online | IG: @take_volet #takevolet",

  "Tired of paying 1 month rent as broker fee? 🚫 TakeVolet is serving across India in major cities including {city}! Book verified PGs, hostels, 1BHK/2BHK rental flats, room sharing & short-term day-wise stays with 0 brokerage.\n📲 Download on Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Visit: takevolet.online | Follow @take_volet #takevolet",

  "Calling all bachelors & students across India! 🎒 Find budget co-living PGs, student hostels, flat rentals & room sharing with 0 brokerage in {city}, Hyderabad, Mumbai, Pune, Delhi & Noida! Just sit & book online on TakeVolet.\n📲 Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Website: takevolet.online | IG @take_volet #takevolet",

  "Need a room for just 2 days or 2 months? 🛌 TakeVolet is available across major cities in India! Book instant day-wise stays, co-living PGs, hostels, rental flats & shared rooms in {city} with 0% broker commission.\n📲 Download App on Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 takevolet.online | Follow @take_volet #takevolet",

  "Flat-hunting in India made super easy! 🔑 Now serving major cities across India like {city}, Mumbai, Hyderabad, Pune, Delhi, Noida & Chennai. Find verified PGs, hostels, rental flats, sharing rooms & day-wise stays with 0 brokerage.\n📲 Get TakeVolet on Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Visit takevolet.online | Instagram @take_volet #takevolet",

  "Looking for shared flats or co-living PGs in {city}? 🛋️ TakeVolet is expanding fast across major Indian cities! Connect directly with verified owners & roommates with 0 Brokerage on PGs, hostels, rental flats & day-wise stays.\n📲 Download Play Store App: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Website: takevolet.online | @take_volet #takevolet",

  "Relocating to {city} for job or college? 🧳 Don't waste money on greedy brokers! TakeVolet serves major cities across India with verified PGs, co-living hostels, rental flats, room sharing & day-wise stays at 0 broker fee.\n📲 Play Store App: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Website: takevolet.online | Follow @take_volet #takevolet",

  "Hi everyone! As an Indian founder, I launched TakeVolet to eliminate broker fees across India 🚀 Serving major cities like {city}, Hyderabad, Mumbai, Pune, Delhi, Noida & Chennai! Book PGs, hostels, rental flats & day-wise stays directly from owners.\n📲 Download on Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 takevolet.online | IG @take_volet #takevolet",

  "Save big on your next room anywhere in India! 💰 Serving {city} & major metro cities nationwide. Rent PGs, co-living hostels, sharing rooms, full rental flats & day-wise stays with 0% broker commission on TakeVolet.\n📲 Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Visit: takevolet.online | @take_volet #takevolet",

  "Why visit 10 different brokers in {city}? 📱 TakeVolet serves top major cities across India! Just sit & book PGs, hostels, 1BHK/2BHK rental flats, room sharing & day-wise stays directly on the app with 0 brokerage.\n📲 Download App on Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 takevolet.online | @take_volet #takevolet",

  "Searching for luxury co-living PGs, hostels or rental flats in {city}? 🏙️ TakeVolet operates across major Indian cities providing 100% verified rooms, sharing flats & day-wise stays with zero broker commission!\n📲 Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Website: takevolet.online | Follow @take_volet #takevolet",

  "Whether you need a day-wise stay for a weekend or a monthly PG / rental flat in {city}, TakeVolet is serving across India in major cities with 0% broker fees! 🌟 Direct owner contact guaranteed.\n📲 Download on Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 takevolet.online | @take_volet #takevolet",

  "No brokers, no hidden charges across major cities in India! 🏠 Serving {city}, Hyderabad, Mumbai, Pune, Delhi, Noida & Chennai. Book PGs, co-living hostels, 1BHK/2BHK rental flats, room sharing & day-wise stays on TakeVolet.\n📲 Get App on Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 takevolet.online | @take_volet #takevolet",

  "Find affordable room sharing, co-living PGs, student hostels & rental flats across major Indian cities including {city}! 🎒 Plus instant day-wise stays with 0 brokerage on TakeVolet app.\n📲 Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 Website: takevolet.online | Follow @take_volet #takevolet",

  "Our mission at TakeVolet: Zero brokerage housing across India! 🇮🇳 Serving major cities like {city}, Hyderabad, Mumbai, Pune, Delhi, Noida & Chennai. PGs, hostels, flat rentals & day-wise stays all in one easy app. Try it today!\n📲 Download on Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 takevolet.online | @take_volet #takevolet"
];

function getFormattedComment(customTemplate, city) {
  const cityName = city ? (city.charAt(0).toUpperCase() + city.slice(1)) : 'your city';
  let raw = customTemplate;
  if (!raw || raw.trim() === '' || raw.includes('AUTOMATIC_ROTATE')) {
    raw = TAKEVOLET_TEMPLATES[Math.floor(Math.random() * TAKEVOLET_TEMPLATES.length)];
  } else {
    if (Math.random() < 0.6) {
      raw = TAKEVOLET_TEMPLATES[Math.floor(Math.random() * TAKEVOLET_TEMPLATES.length)];
    }
  }
  let text = raw.replace(/\{city\}/gi, cityName);
  if (!text.includes('play.google.com')) {
    text += `\n\n📲 Play Store: https://play.google.com/store/apps/details?id=com.takevolet.app\n🌐 takevolet.online | @take_volet #takevolet`;
  }
  return text;
}

function shortcodeToMediaId(shortcode) {
  if (!shortcode) return null;
  try {
    let id = BigInt(0);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    for (let i = 0; i < shortcode.length; i++) {
      const char = shortcode[i];
      const index = alphabet.indexOf(char);
      if (index === -1) continue;
      id = id * BigInt(64) + BigInt(index);
    }
    return id.toString();
  } catch (e) {
    return null;
  }
}

// ── In-Page Status Overlay Badge with LIVE Comment Preview
function showBadge(type, msgText, currentComment = '') {
  if (!msgText) return;
  const botTitle = window.gnFyBotActive ? 'GraduateNex Final Year Bot' : 'TakeVolet Reel Commenter';
  const botApp = window.gnFyBotActive ? 'GraduateNex' : 'TakeVolet';

  console.log(`[${botApp} Bot] ${type.toUpperCase()}: ${msgText}`);
  let el = document.getElementById('takevolet-bot-badge');
  if (!el) {
    el = document.createElement('div');
    el.id = 'takevolet-bot-badge';
    document.body.appendChild(el);
  }
  el.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; top: auto; left: auto; width: 420px; max-width: 90vw;
    background: rgba(13, 10, 26, 0.95); color: #fff; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px;
    padding: 16px; border-radius: 16px; z-index: 9999999;
    box-shadow: 0 10px 40px rgba(139, 92, 246, 0.5); border: 2px solid #8b5cf6;
    backdrop-filter: blur(12px); transition: all 0.3s ease;
  `;
  let icon = 'ℹ️';
  if (type === 'error') icon = '❌';
  if (type === 'commented') icon = '🎉';
  if (type === 'typing') icon = '✍️';
  if (type === 'navigate') icon = '🚀';

  let commentBlock = '';
  if (currentComment) {
    commentBlock = `
      <div style="margin-top: 10px; padding: 10px; background: rgba(255, 255, 255, 0.08); border-left: 3px solid #a855f7; border-radius: 8px; font-size: 12px; max-height: 110px; overflow-y: auto; color: #e9d5ff; white-space: pre-wrap; word-break: break-word; font-family: monospace;">
        <strong style="color:#d8b4fe;">📝 Typing / Current Comment:</strong><br>${currentComment}
      </div>
    `;
  }

  el.innerHTML = `
    <div style="margin-bottom:8px; font-weight:bold; color:#c084fc; font-size:15px; display:flex; align-items:center; justify-content:space-between;">
      <span style="display:flex; align-items:center; gap:8px;">
        <span style="display:inline-block; width:10px; height:10px; background:#a855f7; border-radius:50%; box-shadow:0 0 10px #a855f7; animation: pulse 1s infinite;"></span>
        ${botTitle}
      </span>
      <span style="font-size:11px; background:rgba(168,85,247,0.25); padding:2px 8px; border-radius:12px; color:#e9d5ff; font-weight:600;">ACTIVE</span>
    </div>
    <div style="margin-bottom:6px; line-height:1.4; font-weight:500; color:#f3e8ff;">${icon} ${msgText}</div>
    ${commentBlock}
    <div style="font-size:10px; color:#94a3b8; border-top: 1px solid rgba(255,255,255,0.1); padding-top:6px; margin-top:8px; display:flex; justify-content:space-between;">
      <span>Time: ${new Date().toLocaleTimeString()}</span>
      <span>Target App: ${botApp}</span>
    </div>
    <style>@keyframes pulse { 0% {transform: scale(0.95); opacity:0.8;} 50% {transform: scale(1.1); opacity:1;} 100% {transform: scale(0.95); opacity:0.8;} }</style>
  `;
}

async function safeNavigate(url) {
  const check = await chrome.storage.local.get(['userStartedBot', 'gnFyBotState', 'takevoletBotState']);
  const fyRunning = check.gnFyBotState && check.gnFyBotState.running;
  const tvRunning = check.takevoletBotState && check.takevoletBotState.running;

  if (!isRunning || !check.userStartedBot || (!fyRunning && !tvRunning)) {
    console.log('[SafeNavigate] Bot stopped by user. Navigation blocked to:', url);
    const badge = document.getElementById('takevolet-bot-badge');
    if (badge) badge.remove();
    return false;
  }
  window.location.href = url;
  return true;
}

function report(type, data = {}) {
  try {
    chrome.runtime.sendMessage({ action: 'TAKEVOLET_PROGRESS', type, ...data });
  } catch (e) {}
  const msg = data.msg || data.reason || data.error || (data.comment ? 'Comment posted!' : '');
  if (msg) showBadge(type, msg, data.commentText || '');
}

function robustClick(el) {
  if (!el) return;
  el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
  el.dispatchEvent(new MouseEvent('mouseup',   { bubbles: true, cancelable: true, view: window }));
  el.click();
}

// ── Find Comment Input Box in DOM
async function findCommentBox(timeout = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    window.scrollTo(0, document.body.scrollHeight);
    const scrollable = document.querySelector('main, [role="main"], article');
    if (scrollable) scrollable.scrollTop = scrollable.scrollHeight;
    await sleep(400);

    const selectors = [
      'textarea[placeholder*="Add a comment"]',
      'textarea[aria-label*="comment"]',
      'div[role="textbox"][aria-label*="comment"]',
      'div[contenteditable="true"][aria-label*="comment"]',
      'div[role="textbox"]',
      'form textarea',
      'textarea'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return el;
      }
    }

    const commentIcon = document.querySelector('svg[aria-label="Comment"], svg[aria-label="Comments"]');
    if (commentIcon) {
      const btn = commentIcon.closest('button, div[role="button"]');
      if (btn) {
        btn.click();
        await sleep(500);
      }
    }

    const els = Array.from(document.querySelectorAll('*'));
    const placeholder = els.find(el => {
      const t = el.textContent.trim();
      return (t.startsWith('Add a comment') && el.children.length === 0 && el.offsetParent !== null);
    });
    if (placeholder) {
      placeholder.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(200);
      placeholder.click();
      await sleep(600);
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null) return el;
      }
    }
    await sleep(400);
  }
  return null;
}

// ── Real DOM Full Text Insertion & Verification Simulation
async function typeAndSubmitDom(box, text) {
  try {
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleep(400);

    // Visual highlight ring around comment input
    const originalBorder = box.style.border;
    const originalBoxShadow = box.style.boxShadow;
    box.style.border = '3px solid #a855f7';
    box.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.95)';
    box.style.transition = 'all 0.3s ease';

    box.focus();
    await sleep(400);

    const isTextarea = box.tagName === 'TEXTAREA';

    // Clear existing content
    if (isTextarea) {
      box.value = '';
    } else {
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
    }

    showBadge('typing', 'Writing full promotional comment into Instagram editor...', text);

    if (isTextarea) {
      const proto = Object.getPrototypeOf(box);
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set ||
                     Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(box, text);
      } else {
        box.value = text;
      }
      box.dispatchEvent(new Event('focus', { bubbles: true }));
      box.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertText', data: text }));
      box.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      box.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      box.focus();
      document.execCommand('insertText', false, text);

      const currentContent = box.textContent || box.innerText || '';
      if (currentContent.length < 10) {
        try {
          const dt = new DataTransfer();
          dt.setData('text/plain', text);
          box.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
        } catch (e) {}

        if ((box.textContent || '').length < 10) {
          box.innerText = text;
        }
      }

      box.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertText', data: text }));
      box.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      box.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Animate visual progress in UI overlay badge
    for (let p = 25; p <= 100; p += 25) {
      showBadge('typing', `Visual Typing in DOM (${p}%)...`, text);
      await sleep(150);
    }

    await sleep(600);

    // VERIFICATION: Ensure DOM element has full text before submitting!
    const insertedLen = isTextarea ? (box.value || '').length : (box.textContent || box.innerText || '').length;
    console.log(`[TakeVolet Bot] DOM box length: ${insertedLen} / target: ${text.length}`);

    if (insertedLen < Math.min(20, text.length / 2)) {
      console.warn('[TakeVolet Bot] DOM typing truncated by IG editor. Falling back to Direct API...');
      box.style.border = originalBorder;
      box.style.boxShadow = originalBoxShadow;
      return false; // Return false so handlePostPage uses Direct API for 100% full comment
    }

    showBadge('info', 'Comment verified! Locating "Post" button...', text);
    await sleep(600);

    let submitBtn = document.querySelector('button[type="submit"]');
    if (!submitBtn) {
      const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
      submitBtn = btns.find(b => {
        const txt = b.textContent.trim().toLowerCase();
        return txt === 'post' || txt === 'publish';
      });
    }

    if (submitBtn) {
      submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      submitBtn.style.border = '2px solid #22c55e';
      submitBtn.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.95)';
      await sleep(600);

      showBadge('info', 'Clicking "Post" button visually...', text);
      robustClick(submitBtn);
      await sleep(2000);

      box.style.border = originalBorder;
      box.style.boxShadow = originalBoxShadow;
      return true;
    }
  } catch (e) {
    console.error('[TakeVolet Bot] DOM typing error:', e);
  }
  return false;
}

// ── Private API Direct Commenting Engine Fallback
async function postCommentViaApi(mediaId, commentText) {
  try {
    const csrfMatch = document.cookie.match(/csrftoken=([^;]+)/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';
    if (!csrfToken) return false;

    let appId = '936619743392459';
    const scriptWithAppId = Array.from(document.querySelectorAll('script')).find(s => s.textContent.includes('APP_ID'));
    if (scriptWithAppId) {
      const match = scriptWithAppId.textContent.match(/"APP_ID":"(\d+)"/);
      if (match) appId = match[1];
    }

    const body = new URLSearchParams();
    body.append('comment_text', commentText);

    const res = await fetch(`https://www.instagram.com/api/v1/web/comments/${mediaId}/add/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
        'X-IG-App-ID': appId,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: body.toString()
    });

    const data = await res.json();
    return data && data.status === 'ok';
  } catch (err) {
    return false;
  }
}

// ── Persistent Comment History Tracking
async function getCommentedHistory() {
  const data = await chrome.storage.local.get(['takevoletCommentedHistory']);
  return data.takevoletCommentedHistory || {};
}

async function markPostAsCommented(shortcode) {
  if (!shortcode) return;
  const history = await getCommentedHistory();
  history[shortcode] = Date.now();
  await chrome.storage.local.set({ takevoletCommentedHistory: history });
}

// ── Collect Links from Hashtag Grid (Filters out already commented Reels)
async function collectPostLinks(timeout = 8000) {
  const history = await getCommentedHistory();
  const start = Date.now();
  while (Date.now() - start < timeout) {
    window.scrollTo(0, 500);
    await sleep(400);

    const links = [];
    const seen = new Set();
    const anchors = Array.from(document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"], a[href*="/reels/"]'));

    for (const a of anchors) {
      const href = a.getAttribute('href') || a.href || '';
      const match = href.match(/\/(p|reel|reels)\/([A-Za-z0-9_-]+)/);
      if (match) {
        const shortcode = match[2];
        if (!seen.has(shortcode) && !history[shortcode]) {
          seen.add(shortcode);
          links.push(`https://www.instagram.com/p/${shortcode}/`);
        }
      }
    }

    if (links.length >= 3) return links;
    await sleep(500);
  }
  return [];
}

async function saveState(state) {
  await chrome.storage.local.set({ takevoletBotState: state });
}

// ── Handle Hashtag Grid Page: Visually highlight target Reel before opening
async function handleExplorePage(state) {
  await sleep(2000);
  showBadge('info', `Scanning Reel & Post links on #${state.currentHashtag}...`);

  const posts = await collectPostLinks(8000);
  if (posts.length === 0) {
    showBadge('error', `No unvisited Reels found on #${state.currentHashtag}. Moving to next hashtag...`);
    await sleep(1500);
    await moveToNextHashtag(state);
    return;
  }

  // Visually highlight first reel thumbnail before opening!
  const match = posts[0].match(/\/p\/([A-Za-z0-9_-]+)/);
  if (match) {
    const code = match[1];
    const targetAnchor = Array.from(document.querySelectorAll('a')).find(a => (a.href || '').includes(code));
    if (targetAnchor) {
      targetAnchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetAnchor.style.outline = '4px solid #a855f7';
      targetAnchor.style.boxShadow = '0 0 25px rgba(168, 85, 247, 1)';
      await sleep(1200);
    }
  }

  showBadge('navigate', `Found ${posts.length} new Reels! Opening Reel #1 on #${state.currentHashtag}...`);

  const newState = {
    ...state,
    pendingPosts: posts.slice(0, 15),
    stats: { commentedCount, skippedCount }
  };
  await saveState(newState);
  await sleep(800);
  await safeNavigate(posts[0]);
}

// ── Handle Individual Reel Page (Visual Reel Opening + History Check + Human Typing + Post Inspection)
async function handlePostPage(state) {
  const { config, pendingPosts = [] } = state;
  const speed = config?.speed || 3000;

  commentedCount = state.stats?.commentedCount || 0;
  skippedCount = state.stats?.skippedCount || 0;

  const match = window.location.pathname.match(/\/(p|reel|reels)\/([A-Za-z0-9_-]+)/);
  const shortcode = match ? match[2] : null;

  // Check if Reel was already commented on in previous sessions
  if (shortcode) {
    const history = await getCommentedHistory();
    if (history[shortcode]) {
      skippedCount++;
      showBadge('error', `⏩ Reel already commented previously! Skipping to next...`);
      await sleep(1500);

      const remaining = pendingPosts.slice(1);
      if (remaining.length > 0 && isRunning) {
        await saveState({
          ...state,
          pendingPosts: remaining,
          stats: { commentedCount, skippedCount }
        });
        await safeNavigate(remaining[0]);
      } else {
        await moveToNextHashtag({
          ...state,
          pendingPosts: [],
          stats: { commentedCount, skippedCount }
        });
      }
      return;
    }
  }

  showBadge('info', `Opened Reel page! Waiting for video player & comments... (${pendingPosts.length} Reels remaining in #${state.currentHashtag})`);
  await sleep(2500);

  const commentToSend = getFormattedComment(config.template, state.currentCity);
  showBadge('info', 'Searching for comment box on Reel...', commentToSend);

  let success = false;
  const box = await findCommentBox(7000);
  if (box) {
    showBadge('info', 'Found comment box! Starting visual character typing simulation...', commentToSend);
    success = await typeAndSubmitDom(box, commentToSend);
  }

  // Fallback to Direct API if DOM input was restricted by Instagram layout
  if (!success) {
    showBadge('info', 'DOM input locked. Posting comment via Direct Instagram API...', commentToSend);
    const mediaId = shortcode ? shortcodeToMediaId(shortcode) : null;
    if (mediaId) {
      success = await postCommentViaApi(mediaId, commentToSend);
    }
  }

  if (success) {
    if (shortcode) await markPostAsCommented(shortcode);
    commentedCount++;
    showBadge('commented', `🎉 SUCCESS! Comment published on Reel! (${commentedCount} posted total)`, commentToSend);
  } else {
    skippedCount++;
    showBadge('error', '⚠️ Could not publish comment on this Reel. Moving to next...', commentToSend);
  }

  // Pause so user can visually see the published comment on screen before navigating to next Reel!
  const delaySec = Math.max(3, Math.round(speed / 1000));
  for (let s = delaySec; s > 0; s--) {
    if (!isRunning) break;
    showBadge(success ? 'commented' : 'info', `Waiting ${s}s before opening next Reel...`, commentToSend);
    await sleep(1000);
  }

  const remaining = pendingPosts.slice(1);
  if (remaining.length > 0 && isRunning) {
    await saveState({
      ...state,
      pendingPosts: remaining,
      stats: { commentedCount, skippedCount }
    });
    showBadge('navigate', `🚀 Opening next Reel... (${remaining.length} left in #${state.currentHashtag})`);
    await sleep(800);
    await safeNavigate(remaining[0]);
  } else {
    showBadge('navigate', `Completed current Reel batch! Moving to next city hashtag...`);
    await sleep(1000);
    await moveToNextHashtag({
      ...state,
      pendingPosts: [],
      stats: { commentedCount, skippedCount }
    });
  }
}

// ── Move to Next City Hashtag
async function moveToNextHashtag(state) {
  let pending = state.pendingHashtags || [];

  if (pending.length === 0 && isRunning) {
    showBadge('info', 'Loop complete! Restarting city hashtags queue...');
    pending = [...(state.config?.hashtagsList || [])];
    pending.sort(() => Math.random() - 0.5);
  }

  if (pending.length === 0 || !isRunning) {
    await chrome.storage.local.set({ takevoletBotState: null });
    isRunning = false;
    showBadge('info', 'TakeVolet Commenter session finished.');
    return;
  }

  const next = pending[0];
  const remaining = pending.slice(1);
  const url = `https://www.instagram.com/explore/tags/${next.hashtag}/`;

  showBadge('navigate', `Opening hashtag #${next.hashtag} (${next.city.toUpperCase()}) — ${remaining.length} city hashtags remaining...`);

  await saveState({
    ...state,
    pendingHashtags: remaining,
    currentHashtag: next.hashtag,
    currentCity: next.city,
    pendingPosts: [],
    stats: { commentedCount, skippedCount }
  });

  await sleep(1000);
  await safeNavigate(url);
}

// ══════════════════════════════════════════════════════
// 🎓 FINAL YEAR PROJECTS AUTO-COMMENTER ENGINE (200+ COLLEGES)
// ══════════════════════════════════════════════════════

const FY_PROJECT_TEMPLATES = [
  "🚨 Final Year B.Tech / BE / MCA Students! 🎓 Need approved IEEE 2025/2026 Project Titles, Abstracts & full Source Code? We provide 100% Plagiarism-Free Documentation, PPT, IEEE Research Papers & live Project Deployment on your PC! Get complete Project Submission Help until Project Acceptance with 1-on-1 Viva Coaching. Available for Mini Projects, Major Projects, Hackathons Projects & high-impact Resume Projects! 📞 Contact: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Final Year CSE / ECE / IT / AI / DS Students! 💻 Get verified IEEE Project Titles, Abstracts & 100% working Source Code! Includes Plagiarism-Free Report Documentation, PPT, IEEE Research Papers & live Project Deployment on your laptop. We offer end-to-end Project Submission Help until Project Acceptance + 1-on-1 Viva Prep for all Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📞 Call/WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Don't stress over Final Year Project Submission! ⚡ Get approved Project Titles, Abstracts, Full Source Code + 0% Plagiarism Documentation & PPT slides. We deliver complete IEEE Research Papers, live Project Deployment, and hands-on Project Submission Help until Project Acceptance! Expert guidance for Mini Projects, Major Projects, Hackathons Projects & career-boosting Resume Projects. 📲 WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Zero coding knowledge? We handle everything! 🎓 Get IEEE 2025/2026 Project Titles, Abstracts & tested Source Code with 100% Plagiarism-Free Documentation + PPT. Includes IEEE Research Papers publishing guide, live AnyDesk Project Deployment & full Project Submission Help until Project Acceptance! Covering Mini Projects, Major Projects, Hackathons Projects & Resume Projects. 📞 Contact: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Attention 2026 Batch Engineering Students! 🚨 Need custom or ready-made IEEE Project Titles, Abstracts & GitHub Source Code? We deliver Plagiarism-Free Documentation, PPT, IEEE Research Papers & live Cloud/Local Project Deployment. Guaranteed Project Submission Help until Project Acceptance for your Mini Projects, Major Projects, Hackathons Projects & Resume Projects with viva Q&A! 📲 WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Need IEEE Research Papers & Base Projects for final semester? 📄 Get domain-approved Project Titles, Abstracts, Source Code + 100% Plagiarism-Free Documentation & PPT! We provide live Project Deployment on your system and end-to-end Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & top Resume Projects. 📞 Call/WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Final Year Engineering & MCA Projects made simple! 💡 AI/ML, Full Stack, IoT, Cloud & Cyber Security Project Titles, Abstracts & full Source Code. Includes 0% Plagiarism Documentation, PPT, IEEE Research Papers & live Project Deployment. Full Project Submission Help until Project Acceptance + 1-on-1 Viva support for Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📲 WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "B.Tech / M.Tech / MCA / BCA Final Year Projects available! 🚀 Get IEEE 2025/2026 standard Project Titles, Abstracts, working Source Code + Plagiarism-Free Documentation & PPT. We handle IEEE Research Papers publication, live Project Deployment & complete Project Submission Help until Project Acceptance across Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📞 Contact: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Looking for best IEEE Projects at student-friendly prices? 💰 Get trending Project Titles, Abstracts, complete Source Code, Plagiarism-Free Report Documentation & PPT! We include IEEE Research Papers, live Project Deployment on your laptop & full Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & Resume Projects. 📲 Call/WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Project Submission Deadline near? ⏳ Don't panic! Get same-day delivery of approved Project Titles, Abstracts, Full Source Code + 100% Plagiarism-Free Documentation & PPT. Includes IEEE Research Papers, instant Project Deployment & dedicated Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📞 WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "IEEE Projects for CSE, IT, ECE, AI & Data Science! 🤖 High quality Project Titles, Abstracts & tested Source Code + 0% Plagiarism Documentation & PPT slides. We provide IEEE Research Papers, step-by-step Project Deployment on your PC & complete Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📲 Contact: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Want a top grade in your Final Year Viva? 💯 Get verified Project Titles, Abstracts, fully functional Source Code + Plagiarism-Free Documentation, PPT & viva coaching! Includes IEEE Research Papers, live Project Deployment & guaranteed Project Submission Help until Project Acceptance across Mini Projects, Major Projects, Hackathons Projects & Resume Projects. 📞 Call/WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "IEEE 2025-2026 Capstone & Final Year Projects! 🏆 Complete web apps, mobile apps, AI models & IoT Project Titles, Abstracts and Source Code. Includes 100% Plagiarism-Free Documentation, PPT, IEEE Research Papers & live Project Deployment. We give complete Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📲 WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Final Year Project Guidance & Development! 🛠️ Custom & readymade Project Titles, Abstracts, Source Code + Plagiarism-Free Report Documentation & PPT. Receive IEEE Research Papers, live screen-share Project Deployment & continuous Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📞 Contact: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Worried about College Project Viva & Guide Approval? 📑 Get approved Project Titles, Abstracts, 100% tested Source Code + 0% Plagiarism Documentation & PPT! We provide IEEE Research Papers, live Project Deployment on your machine & complete Project Submission Help until Project Acceptance for all Mini Projects, Major Projects, Hackathons Projects & Resume Projects. 📲 Call/WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "100% Plagiarism-Free Project Documentation & Source Code! 🎓 Approved for JNTU, AU, SVU, OU, VTU, Anna Univ & all engineering colleges! Get IEEE Project Titles, Abstracts, PPT, IEEE Research Papers & live Project Deployment. End-to-end Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📞 Contact: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Struggling to run your project code? 🐞 We do full live Project Deployment on your laptop via AnyDesk! Get verified IEEE Project Titles, Abstracts, working Source Code + Plagiarism-Free Documentation & PPT. Includes IEEE Research Papers & full Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & Resume Projects. 📲 WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Complete Final Year Project Package: Code + Plagiarism-Free Documentation + PPT + IEEE Research Papers + Viva Coaching! 🎯 Get approved Project Titles, Abstracts & live Project Deployment with guaranteed Project Submission Help until Project Acceptance. Available for Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📞 Call/WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Make your Project Submission 100% hassle-free! 🚀 Get cutting-edge AI/ML, MERN, Cloud, IoT Project Titles, Abstracts & full Source Code with 0% Plagiarism Documentation & PPT. We provide IEEE Research Papers, live Project Deployment & complete Project Submission Help until Project Acceptance for Mini Projects, Major Projects, Hackathons Projects & Resume Projects! 📲 Contact: {phone} | 🌐 {url} | DM {igId} #graduatenex",

  "Need Urgent Project Delivery & Guide Acceptance? ⚡ Same-day IEEE Project Titles, Abstracts, Source Code + 100% Plagiarism-Free Documentation & PPT! Includes IEEE Research Papers drafting, live Project Deployment and dedicated Project Submission Help until Project Acceptance across Mini Projects, Major Projects, Hackathons Projects & Resume Projects. 📞 WhatsApp: {phone} | 🌐 {url} | DM {igId} #graduatenex"
];

function getFyFormattedComment(igId, url, phone) {
  const contactNum = phone || '7981994870';
  const targetIg = igId || '@graduatenex';
  const targetUrl = url || 'https://www.graduatenex.online/';
  const template = FY_PROJECT_TEMPLATES[Math.floor(Math.random() * FY_PROJECT_TEMPLATES.length)];
  let res = template
    .replace(/\{igId\}/g, targetIg)
    .replace(/\{url\}/g, targetUrl)
    .replace(/\{phone\}/g, contactNum);
  if (!res.includes(contactNum)) {
    res += `\n📞 Contact/WhatsApp: ${contactNum}`;
  }
  if (!res.includes('#graduatenex')) {
    res += ` #graduatenex`;
  }
  return res;
}

async function getFyVisitedPosts() {
  const data = await chrome.storage.local.get(['gnFyVisitedPosts']);
  return data.gnFyVisitedPosts || {};
}

async function markFyPostVisited(shortcode) {
  if (!shortcode) return;
  const history = await getFyVisitedPosts();
  history[shortcode] = Date.now();
  await chrome.storage.local.set({ gnFyVisitedPosts: history });
}

function getCollegeTargetUrl(collegeName) {
  let clean = (collegeName || '').trim();
  if (!clean) return 'https://www.instagram.com/explore/';

  if (clean.startsWith('@')) {
    const handle = clean.substring(1).trim();
    return `https://www.instagram.com/${handle}/`;
  }
  if (clean.startsWith('#')) {
    const tag = clean.substring(1).trim();
    return `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;
  }

  // Parse piped format e.g. "1 | JNTH | JNTUH University College of Engineering..." or "55 | QM | KG Reddy..."
  let extractedCode = '';
  if (clean.includes('|')) {
    const parts = clean.split('|').map(p => p.trim());
    if (parts.length >= 3) {
      extractedCode = parts[1].toLowerCase();
      clean = parts[2];
    } else if (parts.length === 2) {
      extractedCode = parts[0].toLowerCase();
      clean = parts[1];
    }
  }

  const lower = clean.toLowerCase();

  // TS EAMCET & AP EAMCET Code Direct Hashtag Map (327+ Colleges)
  const CODE_TAG_MAP = {
    // Telangana Codes
    'jnth': 'jntuh', 'ouce': 'osmaniauniversity', 'cbit': 'cbithyderabad', 'vasv': 'vasavicollegeofengineering',
    'vjec': 'vnrvjiet', '07': 'vnrvjiet', 'gntw': 'gnits', 'kmit': 'kmit', 'bd': 'kmit', 'mecs': 'matrusri',
    'mgit': 'mgithyderabad', '26': 'mgithyderabad', 'cvrh': 'cvrce', 'cvsr': 'cvrce', 'grrr': 'griet',
    'iare': 'iare', 'snis': 'snist', '31': 'snist', 'vbit': 'vbit', 'p6': 'vbit', 'vgnt': 'vardhaman',
    'vmeg': 'vardhaman', '88': 'vardhaman', 'bvri': 'bvrit', 'bvrw': 'bvrithyderabad', 'cmrk': 'cmrce',
    'cmrn': 'cmrec', 'cmrm': 'cmrithyderabad', 'cmrg': 'cmrtc', 'jbit': 'jbiet', 'j2': 'jbrec', 'qk': 'jyothishmathi',
    '5d': 'knrcer', 'qn': 'kbrce', 'qm': 'kgreddy', 'j3': 'khadermemorial', 'qp': 'kitskhammam', 'qt': 'klrce',
    'qu': 'kitsw', '6b': 'kitsw', '28': 'kitskarimnagar', 'ra': 'kprit', 'kmec': 'kprit', 'b4': 'kce',
    'm2': 'lordsinstitute', 'rg': 'mrcew', 'mrgw': 'mrcew', 'rj': 'mrit', 'mrit': 'mrit', '7y': 'mlritm',
    'mrce': 'mlritm', 'j6': 'mcetmedak', 'rp': 'meghainstitute', 'mgha': 'meghainstitute', 'c6': 'mist',
    'g7': 'mitskodad', 'e3': 'mist', 'q9': 'mrce', 'mall': 'mrce', 'uj': 'mrem', 'mrem': 'mrem', 'rh': 'mrecw',
    's1': 'mrits', 'w9': 'mriet', 'mrec': 'mrec', '80': 'mothertheressa', 'td': 'nigama', 'b6': 'nmrec',
    'nred': 'nmrec', '7z': 'nnrg', 'ngitw': 'nnrg', 'x0': 'nrec', 'rt': 'nsakcet', '6f': 'pallaviengineeringcollege',
    '6m': 'princetoncollege', 'prtw': 'princetoncollege', '6c': 'priyadarshinicollege', 'prin': 'priyadarshinicollege',
    'u1': 'samskruti', 'm8': 'sanaengineeringcollege', 'c0': 'scient', 'scit': 'scient', '08': 'shadan',
    'n8': 'sphoorthy', 'srit': 'sphoorthy', 'n0': 'sreechaitanya', 'chtn': 'sreechaitanya', 'tr': 'sreechaitanyainstitute',
    'chts': 'sreechaitanyainstitute', 'c8': 'sreekavitha', 've': 'sreyas', 'srhp': 'sreyas', 'd2': 'sridevicollege',
    'tk': 'svsgroup', 'm6': 'sbit', 'sbit': 'sbit', 'c5': 'saispurthi', 'l5': 'shadanwomens', 'tp': 'siddharthainstitute',
    'tq': 'sitssiddhartha', 'e4': 'sreedattha', '57': 'svits', '8a': 'srichaitanyacampus', 'x3': 'sriindu',
    'indi': 'sriindu', 'srkt': 'sriindu', 'd4': 'sriinducollege', '8b': 'srisai', '63': 'srivenkateswara',
    'sves': 'srivenkateswara', 'k8': 'smec', 'stlw': 'smec', 'bh': 'stmarys', 'd0': 'stmarysgroup',
    '7w': 'stmaryscampus', 'bk': 'stpeters', '6y': 'sritw', '14': 'srtist', 'p7': 'svit', 'r9': 'tkrec',
    'c2': 'thirumala', 'k9': 'tkrce', 'tkrk': 'tkrce', 'ue': 'trinitykarimnagar', 'ud': 'trinitypeddapalli',
    'trce': 'trinitypeddapalli', 'uc': 'tallapadmavathi', 'uk': 'vaagdevi', '64': 'vaagdevi', 's4': 'vaageswari',
    '89': 'vignanits', 'p8': 'vbec', 'up': 'vmtw', 'vgw': 'vmtw', 'vmtw': 'vmtw', 'br': 'vijayaengineeringcollege',
    'bt': 'vcet', '29': 'vrec', 'vrec': 'vrec', 'n6': 'vits', 'ug': 'tudiramreddy', 'tudi': 'tudiramreddy',
    'aarm': 'aarmahaveer', '8p': 'aarmahaveer', 'aceg': 'aceec', 'aith': 'aits', 't8': 'aits', 'akit': 'akit',
    'ek': 'akit', 'anrk': 'anuragcollege', 'anug': 'anuraguniversity', 'wlcw': 'anuraguniversity', 'arjn': 'arjuncollege',
    'w8': 'arjuncollege', 'asra': 'avanthi', 'pt': 'avanthi', 'aurc': 'aurora', 'd9': 'aurora', 'aurg': 'aurora',
    'm9': 'aurora', 'aurh': 'ramappa', 'aurk': 'aurora', '9k': 'aurora', 'avih': 'avanthi', 'q6': 'avanthi',
    'avni': 'avn', '5u': 'avn', 'biet': 'biet', 'bitn': 'bits', 'c3': 'bits', 'boma': 'bomma', 'bose': 'anubose',
    'pp': 'anubose', 'pq': 'anuragcollege', 'brew': 'bhojreddy', 'brig': 'brilliant', 'bril': 'brilliant',
    'drki': 'drk', 'elen': 'ellenki', 'esut': 'kuce', 'gate': 'gate', 'gctc': 'gcet', 'glob': 'global',
    'glwc': 'lailavathi', 'gnit': 'gnit', 'guru': 'gnitc', 'iitt': 'indur', 'jaya': 'jayamukhi', 'jmts': 'jyothishmathi',
    'jntr': 'jntuhsircilla', 'jnts': 'jntuhsultanpur', 'jnthmt': 'jntuhmanthani', 'kits': 'kitswarangal',
    'kmce': 'kmce', 'kprt': 'kprit', 'meth': 'methodist', 'mvsr': 'mvsr', 'ngit': 'ngit', 'rcee': 'rishi',
    'wits': 'wits', '91': 'vjit', '5t': 'ashoka', 'u7': 'aurora', '62': 'aurora', '84': 'aurora', 'q8': 'azadcollege',
    'm1': 'bsit',

    // Andhra Pradesh Codes
    'auce': 'aucoeg', 'jnuk': 'jntuk', 'jnua': 'jntua', 'jnup': 'jntuapulivendula', 'jnlk': 'jntuakalikiri',
    'jnun': 'jntuknarasaraopet', 'jnvz': 'jntukvizianagaram', 'svuc': 'svuce', 'klef': 'kluniversity',
    'vitp': 'vitap', 'srma': 'srmap', 'gvpw': 'gvpce', 'gvpe': 'gvpcew', 'vrse': 'vrsec', 'pvps': 'pvpsiddhartha',
    'rvrj': 'rvrjc', 'gmrt': 'gmrit', 'gprc': 'gprec', 'gpet': 'gpcet', 'svec': 'sreevidyanikethan',
    'mits': 'mits', 'mvgr': 'mvgrce', 'anit': 'anits', 'bpec': 'bec', 'lbrc': 'lbrce', 'srge': 'gec',
    'vvit': 'vvit', 'adtp': 'adityaengineeringcollege', 'acet': 'acet', 'adce': 'aditya', 'aitm': 'aitam',
    'adrs': 'adarshcollege', 'aksr': 'akshara', 'amrn': 'amritasai', 'aits': 'aitsrajampet', 'anuc': 'anucoe',
    'alie': 'andhraloyola', 'avit': 'avanthivizag', 'bvce': 'bvceodalarevu', 'bvci': 'bvcits', 'chai': 'chaitanyaengg',
    'cist': 'cist', 'dnre': 'dnrce', 'diet': 'diet', 'kite': 'kitsdivili', 'nrso': 'nec', 'nbkr': 'nbkrist',
    'nren': 'narayanaengineering', 'nreg': 'narayanagudur', 'rguk': 'rgukt', 'rgmc': 'rgmcet', 'rsre': 'rsrec',
    'svct': 'svcet', 'vemu': 'vemu', 'ciet': 'cietguntur', 'cipt': 'cipt', 'chir': 'chiralacollege',
    'dadi': 'dadiinstitute', 'blay': 'drbullayya', 'kvr': 'kvsr', 'mich': 'mictech', 'elur': 'eluruengg',
    'eswr': 'eswarcollege', 'gist': 'gistnellore', 'giet': 'giet', 'gokl': 'gokulinstitute', 'gkcs': 'gokulakrishna',
    'gntr': 'gunturengg', 'idel': 'idealengg', 'ksrm': 'ksrmce', 'kiet': 'kietkakinada', 'kiew': 'kietwomen',
    'khit': 'khitguntur', 'kmmt': 'kmmits', 'kcit': 'kcit', 'kvew': 'krishnaveniwomen', 'kupm': 'kuppamcollege',
    'lend': 'lendi', 'lenr': 'lenora', 'limt': 'lingayas', 'litm': 'loyolaguntur', 'mvrt': 'mvrce',
    'mlew': 'malineniwomen', 'mamw': 'mamwomen', 'mirc': 'miracleengg', 'mjrc': 'mjrce', 'mtec': 'mothertheresa',
    'nsrt': 'nsrit', 'nist': 'narayanadri', 'newt': 'newtonengg', 'nmra': 'nimra', 'nrit': 'nrit',
    'pbrv': 'pbrvisvodaya', 'pvkk': 'pvkk', 'pace': 'paceinstitute', 'pscm': 'pscmr', 'prag': 'pragatiengg',
    'prak': 'prakasamengg', 'pydi': 'pydah', 'qisc': 'qis', 'quba': 'quba', 'rvit': 'rvit', 'rkce': 'rkce',
    'rcel': 'ramachandra', 'ragu': 'raghuengg', 'rjmt': 'rajamahendri', 'rcew': 'ravindrawomen',
    'srkt': 'srktech', 'srkr': 'srkr', 'sasi': 'sasiengg', 'saty': 'satya', 'sist': 'sistputtur',
    'scrr': 'crrcollege', 'svas': 'vasaviap', 'srin': 'srinivasa', 'sitm': 'sitms', 'stan': 'stannschirala'
  };

  if (extractedCode && CODE_TAG_MAP[extractedCode]) {
    return `https://www.instagram.com/explore/tags/${encodeURIComponent(CODE_TAG_MAP[extractedCode])}/`;
  }

  const COLLEGE_TAG_MAP = {
    'jntuh': 'jntuh',
    'osmania': 'osmaniauniversity',
    'chaitanya bharathi': 'cbithyderabad',
    'cbit': 'cbithyderabad',
    'vasavi': 'vasavicollegeofengineering',
    'vnr': 'vnrvjiet',
    'gokaraju': 'griet',
    'griet': 'griet',
    'sreenidhi': 'snist',
    'snist': 'snist',
    'cvr': 'cvrce',
    'bvrit': 'bvrit',
    'mahatma gandhi': 'mgithyderabad',
    'mgit': 'mgithyderabad',
    'narayanamma': 'gnits',
    'gnits': 'gnits',
    'cmr': 'cmrce',
    'vardhaman': 'vardhaman',
    'anurag': 'anuraguniversity',
    'muffakham': 'mjcet',
    'mvsr': 'mvsr',
    'kakatiya': 'kitswarangal',
    'kits warangal': 'kitswarangal',
    'tkr': 'tkrce',
    'mlrit': 'mlrit',
    'iare': 'iare',
    'vjit': 'vjit',
    'malla reddy': 'mrcet',
    'martin': 'smec',
    'smec': 'smec',
    'geethanjali': 'gcet',
    'jbiet': 'jbiet',
    'guru nanak': 'gnitc',
    'bharat': 'biet',
    'sreyas': 'sreyas',
    'kg reddy': 'kgreddy',
    'ace': 'aceec',
    'vbit': 'vbit',
    'stanley': 'stanley',
    'bhoj reddy': 'bhojreddy',
    'vignan': 'vignan',
    'avanthi': 'avanthi',
    'andhra university': 'aucoeg',
    'jntuk': 'jntuk',
    'jntua': 'jntua',
    'svu': 'svuce',
    'gvp': 'gvpce',
    'srm': 'srmap',
    'vit': 'vitap',
    'kl university': 'kluniversity',
    'gitam': 'gitam',
    'vrsiddhartha': 'vrsec',
    'rvr': 'rvrjc',
    'pvp': 'pvpsiddhartha',
    'pulla reddy': 'gprec',
    'pullaiah': 'gpcet',
    'vidyanikethan': 'sreevidyanikethan',
    'mohan babu': 'mohanbabuuniversity',
    'lbrce': 'lbrce',
    'anits': 'anits',
    'mits': 'mits',
    'mvgr': 'mvgrce',
    'aditya': 'adityaengineeringcollege',
    'gmrit': 'gmrit',
    'raghu': 'raghuengg',
    'bec': 'bec',
    'dhanekula': 'diet',
    'gudlavalleru': 'gec',
    'iit hyderabad': 'iithyderabad',
    'nit warangal': 'nitwarangal',
    'iiit hyderabad': 'iiithyderabad',
    'bits pilani': 'bitshyderabad',
    'university of hyderabad': 'uoh',
    'anna university': 'annauniversity',
    'psg': 'psgtech',
    'rv college': 'rvce',
    'bms': 'bmsce',
    'pes university': 'pesuniversity',
    'ramaiah': 'msrit',
    'coep': 'coep',
    'vjti': 'vjtimumbai',
    'vvit': 'vvit',
    'chalapathi': 'cietguntur',
    'chirala': 'chiralacollege',
    'bullayya': 'drbullayya',
    'mic college': 'mictech',
    'eluru': 'eluruengg',
    'eswar': 'eswarcollege',
    'giet': 'giet',
    'ksrm': 'ksrmce',
    'kiet': 'kietkakinada',
    'lendi': 'lendi',
    'loyola': 'andhraloyola',
    'mvr': 'mvrce',
    'narasaraopeta': 'nec',
    'nbkr': 'nbkrist',
    'narayana': 'narayanaengineering',
    'rgukt': 'rgukt',
    'rgm': 'rgmcet',
    'pace': 'paceinstitute',
    'pragati': 'pragatiengg',
    'prakasam': 'prakasamengg',
    'qis': 'qis',
    'srkr': 'srkr',
    'sasi': 'sasiengg',
    'shri vishnu': 'svcw',
    'siddharth': 'siddharthcollege',
    'vasavi': 'vasavi'
  };

  for (const [key, tag] of Object.entries(COLLEGE_TAG_MAP)) {
    if (lower.includes(key)) {
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;
    }
  }

  const words = clean.split(/\s+/).filter(w => !['of','and','for','the','in','&'].includes(w.toLowerCase()));
  if (words.length >= 2) {
    const acronym = words.map(w => w[0]).join('').toLowerCase();
    if (acronym.length >= 3) {
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(acronym)}/`;
    }
  }

  const fallbackTag = clean.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `https://www.instagram.com/explore/tags/${encodeURIComponent(fallbackTag)}/`;
}

async function moveToNextFyCollege(state) {
  let pending = state.pendingHashtags || [];

  if (pending.length === 0) {
    await chrome.storage.local.set({ gnFyBotState: null, userStartedBot: false });
    isRunning = false;
    showBadge('info', '🎓 Final Year Projects Bot: All provided colleges completed!');
    try {
      chrome.runtime.sendMessage({ action: 'COMMENT_PROGRESS', type: 'stopped' });
    } catch(e) {}
    return;
  }

  const currentCollege = pending[0];
  const remaining = pending.slice(1);
  const targetUrl = getCollegeTargetUrl(currentCollege);

  showBadge('navigate', `🎓 Moving to College (${remaining.length + 1} remaining): ${currentCollege}`);

  const newState = {
    ...state,
    running: true,
    pendingHashtags: remaining,
    currentHashtag: currentCollege,
    pendingPosts: [],
    stats: state.stats || { commentedCount: 0, skippedCount: 0 }
  };

  await chrome.storage.local.set({ gnFyBotState: newState });
  await sleep(1000);
  await safeNavigate(targetUrl);
}

async function collectFyPostLinks(timeout = 8000) {
  const history = await getFyVisitedPosts();
  const start = Date.now();
  const posts = [];
  const seen = new Set();

  while (Date.now() - start < timeout) {
    window.scrollTo(0, 400);
    const main = document.querySelector('main, [role="main"], article');
    if (main) main.scrollTop += 500;

    await sleep(600);

    const root = main || document.body;
    const anchors = Array.from(root.querySelectorAll('a[href*="/p/"], a[href*="/reel/"], a[href*="/reels/"]'));

    for (const a of anchors) {
      // Exclude navigation bars, search modals, and recommended/suggested sidebars
      if (a.closest('nav, header, [role="navigation"], aside, footer')) continue;
      if (a.closest('div[role="dialog"]')) continue;

      const href = a.getAttribute('href') || a.href || '';
      const match = href.match(/\/(p|reel|reels)\/([A-Za-z0-9_-]+)/);
      if (match) {
        const shortcode = match[2];
        if (!seen.has(shortcode) && !history[shortcode]) {
          seen.add(shortcode);
          posts.push(`https://www.instagram.com/p/${shortcode}/`);
        }
      }
    }

    if (posts.length >= 3) return posts;
    await sleep(500);
  }
  return posts;
}

async function handleFyExploreOrProfilePage(state) {
  await sleep(1500);

  // STRICT CHECK: If redirected to generic explore (/explore/) or homepage, skip immediately
  const path = window.location.pathname;
  const isGenericExplore = path === '/explore/' || path === '/explore' || path === '/';
  if (isGenericExplore) {
    showBadge('error', `⚠️ Generic Explore detected (no active tag for ${state.currentHashtag}). Skipping to next college...`);
    await sleep(1200);
    await moveToNextFyCollege(state);
    return;
  }

  // Check if page has error / unavailable message
  const bodyText = document.body ? document.body.innerText : '';
  if (bodyText.includes("Sorry, this page isn't available") || bodyText.includes('No posts yet') || bodyText.includes('No results found')) {
    showBadge('error', `⚠️ Page unavailable or no posts for ${state.currentHashtag}. Skipping to next college...`);
    await sleep(1200);
    await moveToNextFyCollege(state);
    return;
  }

  showBadge('info', `Scanning College Posts on page: ${state.currentHashtag}...`);

  const posts = await collectFyPostLinks(8000);

  if (posts.length === 0) {
    showBadge('error', `No unvisited posts found for ${state.currentHashtag}. Moving to next college...`);
    await sleep(1200);
    await moveToNextFyCollege(state);
    return;
  }

  showBadge('navigate', `Found ${posts.length} posts for ${state.currentHashtag}! Opening post #1...`);

  const newState = {
    ...state,
    pendingPosts: posts.slice(0, 3)
  };
  await chrome.storage.local.set({ gnFyBotState: newState });
  await sleep(800);
  await safeNavigate(posts[0]);
}

async function handleFyPostPage(state) {
  const pendingPosts = state.pendingPosts || [];
  const match = window.location.pathname.match(/\/(p|reel|reels)\/([A-Za-z0-9_-]+)/);
  const shortcode = match ? match[2] : null;

  if (shortcode) {
    const history = await getFyVisitedPosts();
    if (history[shortcode]) {
      showBadge('error', '⏩ Post already commented previously! Skipping...');
      await sleep(1200);
      const remaining = pendingPosts.slice(1);
      if (remaining.length > 0) {
        state.pendingPosts = remaining;
        await chrome.storage.local.set({ gnFyBotState: state });
        await safeNavigate(remaining[0]);
      } else {
        await moveToNextFyCollege(state);
      }
      return;
    }
  }

  showBadge('info', `Opened college post! Preparing Final Year comment... (${pendingPosts.length} posts left in batch)`);
  await sleep(2000);

  const commentToSend = getFyFormattedComment(state.igId, state.url, state.phone || '7981994870');
  showBadge('info', 'Searching for comment box...', commentToSend);

  let success = false;
  const box = await findCommentBox(7000);
  if (box) {
    showBadge('info', 'Found comment box! Typing comment...', commentToSend);
    success = await typeAndSubmitDom(box, commentToSend);
  }

  if (!success && shortcode) {
    showBadge('info', 'DOM typing locked. Posting via Direct Instagram API...', commentToSend);
    const mediaId = shortcodeToMediaId(shortcode);
    if (mediaId) {
      success = await postCommentViaApi(mediaId, commentToSend);
    }
  }

  if (success) {
    if (shortcode) await markFyPostVisited(shortcode);
    if (!state.stats) state.stats = { commentedCount: 0, skippedCount: 0 };
    state.stats.commentedCount++;
    showBadge('commented', `🎉 SUCCESS! College marketing comment posted! Total: ${state.stats.commentedCount}`, commentToSend);
    try {
      chrome.runtime.sendMessage({
        action: 'COMMENT_PROGRESS',
        type: 'commented',
        comment: commentToSend,
        queue: (state.pendingHashtags || []).length
      });
    } catch(e) {}
  } else {
    showBadge('error', '⚠️ Could not publish comment on this post. Moving on...', commentToSend);
  }

  await sleep(2500);

  const remaining = pendingPosts.slice(1);
  if (remaining.length > 0) {
    state.pendingPosts = remaining;
    await chrome.storage.local.set({ gnFyBotState: state });
    showBadge('navigate', `🚀 Opening next post for this college (${remaining.length} left)...`);
    await sleep(800);
    await safeNavigate(remaining[0]);
  } else {
    showBadge('navigate', 'Batch complete for this college! Moving to next college...');
    await sleep(1000);
    await moveToNextFyCollege(state);
  }
}

// ── Auto-Resume on Page Load
(async function onLoad() {
  await sleep(1200);

  const check = await chrome.storage.local.get(['userStartedBot', 'gnFyBotState', 'takevoletBotState']);

  // CRITICAL GUARD: If user did NOT explicitly click Start, NEVER run or navigate automatically!
  if (!check.userStartedBot) {
    console.log('[Bot Guard] userStartedBot is false. Automatic commenting & navigation blocked.');
    const badge = document.getElementById('takevolet-bot-badge');
    if (badge) badge.remove();
    return;
  }

  // 1. Check Final Year Bot state
  const fyState = check.gnFyBotState;
  if (fyState && fyState.running) {
    window.gnFyBotActive = true;
    isRunning = true;
    const url = window.location.href;
    const isPost = /\/(p|reel|reels)\//.test(url);

    if (isPost && fyState.pendingPosts && fyState.pendingPosts.length > 0) {
      await handleFyPostPage(fyState);
    } else if (!isPost) {
      await handleFyExploreOrProfilePage(fyState);
    } else {
      await moveToNextFyCollege(fyState);
    }
    return;
  }

  // 2. Check TakeVolet Bot state
  const state = check.takevoletBotState;
  if (state && state.running) {
    window.gnFyBotActive = false;
    isRunning = true;
    commentedCount = state.stats?.commentedCount || 0;
    skippedCount = state.stats?.skippedCount || 0;

    const url = window.location.href;
    const isPost = /\/(p|reel|reels)\//.test(url);
    const isExplore = url.includes('/explore/') || url.includes('/tags/') || url.includes('/search/');

    if (isPost) await handlePostPage(state);
    else if (isExplore) await handleExplorePage(state);
    else {
      await moveToNextHashtag(state);
    }
  }
})();

// ── Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_FY_BOT') {
    window.gnFyBotActive = true;
    isRunning = true;
    sendResponse({ status: 'started' });
    const { hashtags, igId, url, phone } = request;
    const initialState = {
      running: true,
      pendingHashtags: hashtags || [],
      currentHashtag: hashtags ? hashtags[0] : '',
      pendingPosts: [],
      igId: igId || '@graduatenex',
      url: url || 'https://graduatenex.online',
      phone: phone || '7981994870',
      stats: { commentedCount: 0, skippedCount: 0 }
    };
    chrome.storage.local.set({
      userStartedBot: true,
      gnFyBotState: initialState,
      takevoletBotState: { running: false }
    }, () => {
      showBadge('navigate', `🎓 Starting Final Year Projects Marketing Bot for ${initialState.pendingHashtags.length} colleges!`);
      moveToNextFyCollege(initialState);
    });
    return true;
  }

  if (request.action === 'STOP_FY_BOT' || request.action === 'STOP_TAKEVOLET_COMMENTER') {
    isRunning = false;
    const badge = document.getElementById('takevolet-bot-badge');
    if (badge) badge.remove();
    chrome.storage.local.set({
      userStartedBot: false,
      gnFyBotState: { running: false },
      takevoletBotState: { running: false }
    });
    sendResponse({ status: 'stopped' });
    return true;
  }

  if (request.action === 'START_TAKEVOLET_COMMENTER') {
    window.gnFyBotActive = false;
    isRunning = true;
    sendResponse({ status: 'started' });

    const { config, resume } = request;

    chrome.storage.local.get(['takevoletBotState'], (d) => {
      const existingState = d.takevoletBotState;
      if (resume && existingState && existingState.pendingHashtags && existingState.pendingHashtags.length > 0) {
        const updatedState = {
          ...existingState,
          running: true,
          config: config || existingState.config
        };
        chrome.storage.local.set({ userStartedBot: true, takevoletBotState: updatedState }, () => {
          showBadge('navigate', `Resuming TakeVolet session from #${updatedState.currentHashtag}...`);
          if (updatedState.pendingPosts && updatedState.pendingPosts.length > 0) {
            window.location.href = updatedState.pendingPosts[0];
          } else {
            window.location.href = `https://www.instagram.com/explore/tags/${updatedState.currentHashtag}/`;
          }
        });
      } else {
        const hashtagsList = config?.hashtagsList || [];
        if (hashtagsList.length === 0) {
          showBadge('error', 'No hashtags provided!');
          return;
        }
        const first = hashtagsList[0];
        const remaining = hashtagsList.slice(1);

        chrome.storage.local.set({
          userStartedBot: true,
          takevoletBotState: {
            running: true,
            pendingHashtags: remaining,
            pendingPosts: [],
            currentHashtag: first.hashtag,
            currentCity: first.city,
            config,
            stats: { commentedCount: 0, skippedCount: 0 }
          }
        }, () => {
          showBadge('navigate', `Starting TakeVolet Bot! Opening #${first.hashtag} (${first.city.toUpperCase()})...`);
          window.location.href = `https://www.instagram.com/explore/tags/${first.hashtag}/`;
        });
      }
    });

    return true;
  }
});
