// ══════════════════════════════════════════════════════════════════
// GraduateNex Events Scout — popup.js v3.0 (AUTO-PUSH, no button)
// ══════════════════════════════════════════════════════════════════

const HASHTAGS = {
  hackathon: ['hackathon','hackathon2025','hackathon2026','collegehackathon','HackIndia','SmartIndiaHackathon','sih2025','indiahackathon','mlhackathon','aithon','datathon','ideathon','codingcompetition'],
  fest:      ['technicalfest','techfest','collegefest','engineeringfest','techevents','annualfest','campusfest','devfest','startupweekend','indiafest','bootcamp2025'],
  gaming:    ['gamingcontest','esportsIndia','gamingfest','esportstournament','pubgtournament','bgmitournament','valoIndia','gamingchallenge','onlinegamingevent'],
  cultural:  ['culturalfest','culturalevent','artcontest','photocontest','dancefest','theaterfest','designcontest','musicfest','talentshow','collegecultural'],
  general:   ['studentsummit','youthfest','startupindia','collegeevents','campusevent','indiaevent'],
};

const ALL_HASHTAGS = Object.values(HASHTAGS).flat();
let selectedHashtags = [...ALL_HASHTAGS];
let isRunning = false;
// cache of pushed events for preview
let pushedEvents = [];

const $ = id => document.getElementById(id);

// ── TABS
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const id = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    $('tab-' + id).classList.add('active');
    if (id === 'preview') renderPushedEvents();
  });
});

// ── RENDER HASHTAG TAGS WITH CATEGORY COLORS
function renderHashtags() {
  const wrap = $('hashtag-tags');
  wrap.innerHTML = '';
  for (const [cat, tags] of Object.entries(HASHTAGS)) {
    tags.forEach(ht => {
      const el = document.createElement('div');
      el.className = `htag ${cat} ${selectedHashtags.includes(ht) ? 'active' : ''}`;
      el.textContent = '#' + ht;
      el.title = cat;
      el.addEventListener('click', () => {
        if (isRunning) return;
        if (selectedHashtags.includes(ht)) {
          selectedHashtags = selectedHashtags.filter(h => h !== ht);
          el.classList.remove('active');
        } else {
          selectedHashtags.push(ht);
          el.classList.add('active');
        }
      });
      wrap.appendChild(el);
    });
  }
}

// ── LOG
function log(type, msg) {
  const box = $('log');
  const el = document.createElement('div');
  el.className = 'le';
  el.innerHTML = `<span class="ld ${type}"></span><span class="lt">${esc(msg)}</span>`;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
  while (box.children.length > 120) box.removeChild(box.firstChild);
}

const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ── STATUS
function setStatus(state) {
  const pill = $('status-pill');
  const dot  = $('status-dot');
  const txt  = $('status-text');
  pill.className = 'pill ' + state;
  dot.className  = 'dot '  + state;
  txt.textContent = { idle:'Idle', running:'⚡ Live Auto-Pushing...', done:'✅ Done' }[state] || state;
  isRunning = state === 'running';
  $('btn-start').style.display = isRunning ? 'none' : 'flex';
  $('btn-stop').style.display  = isRunning ? 'flex' : 'none';
}

// ── STATS (pull from storage)
async function refreshStats() {
  const d = await chrome.storage.local.get(['gnFoundCount','gnScannedCount','gnPushCount','gnRetryQueue']);
  const f = d.gnFoundCount   || 0;
  const s = d.gnScannedCount || 0;
  const p = d.gnPushCount    || 0;
  const q = (d.gnRetryQueue  || []).length;
  $('stat-found').textContent   = f;
  $('stat-scanned').textContent = s;
  $('stat-pushed').textContent  = p;
  $('total-badge').textContent  = p + ' pushed';
  const rc = $('retry-count');
  if (rc) rc.textContent = q > 0 ? q : '0';
}

// ── RENDER PUSHED EVENTS WITH IMAGE + LINKS PREVIEW
function renderPushedEvents() {
  const wrap = $('events-list');
  wrap.innerHTML = '';
  if (pushedEvents.length === 0) {
    wrap.innerHTML = '<div class="empty"><div class="empty-emoji">🔍</div><div>No events pushed yet.</div></div>';
    return;
  }
  pushedEvents.slice().reverse().forEach(evt => {
    const card = document.createElement('div');
    card.className = 'ev-card';

    const imgHtml = evt.image_url
      ? `<img class="ev-img" src="${esc(evt.image_url)}" onerror="this.style.display='none'" />`
      : '';

    const regLink = evt.registration_link
      ? `<a class="ev-link reg" href="${esc(evt.registration_link)}" target="_blank">📋 Register</a>`
      : '';

    const igLink = `<a class="ev-link insta" href="${esc(evt.instagram_url)}" target="_blank">📷 Instagram</a>`;

    const cat = evt.category || 'event';

    card.innerHTML = `
      ${imgHtml}
      <div class="ev-body">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <div class="ev-title" style="flex:1">${esc(evt.title || 'Untitled')}</div>
          <span class="ev-cat ${cat}">${cat}</span>
        </div>
        <div class="ev-meta">
          ${evt.date ? `<span>📅 ${esc(evt.date)}</span>` : ''}
          <span>📍 ${esc(evt.location || 'Online')}</span>
        </div>
        <div class="ev-links">${igLink}${regLink}</div>
      </div>
    `;
    wrap.appendChild(card);
  });
}

// ── START
$('btn-start').addEventListener('click', async () => {
  if (selectedHashtags.length === 0) { log('error', 'Select at least one hashtag!'); return; }

  const tabs = await chrome.tabs.query({ url: '*://*.instagram.com/*' });
  let tab;
  if (tabs.length > 0) {
    tab = tabs[0];
    await chrome.tabs.update(tab.id, { active: true });
  } else {
    tab = await chrome.tabs.create({ url: 'https://www.instagram.com/' });
    await new Promise(r => setTimeout(r, 3000));
  }

  pushedEvents = [];
  await chrome.storage.local.set({ gnFoundCount:0, gnScannedCount:0, gnPushCount:0 });
  await refreshStats();
  log('info', `⚡ AUTO-PUSH mode: ${selectedHashtags.length} hashtags`);
  log('info', `Covers: hackathons, fests, gaming, cultural, tech events across India`);
  setStatus('running');

  const settings = await chrome.storage.local.get(['gnEventsSettings']);
  const maxPosts = parseInt(settings.gnEventsSettings?.maxPosts || '12', 10);

  try {
    await chrome.tabs.sendMessage(tab.id, { action:'START_SCOUT', hashtags: selectedHashtags, maxPosts });
  } catch {
    try {
      await chrome.scripting.executeScript({ target:{ tabId: tab.id }, files:['content.js'] });
      await new Promise(r => setTimeout(r, 1500));
      await chrome.tabs.sendMessage(tab.id, { action:'START_SCOUT', hashtags: selectedHashtags, maxPosts });
    } catch (e2) {
      log('error', 'Open instagram.com first, then try again.');
      setStatus('idle');
    }
  }
});

// ── STOP
$('btn-stop').addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ url: '*://*.instagram.com/*' });
  if (tabs.length) try { await chrome.tabs.sendMessage(tabs[0].id, { action:'STOP_SCOUT' }); } catch {}
  await chrome.storage.local.set({ gnEventsState:{ running:false } });
  setStatus('idle');
  log('warn', '⏹ Stopped.');
});

// ── CLEAR
$('btn-clear').addEventListener('click', async () => {
  await chrome.storage.local.set({
    gnFoundCount:0, gnScannedCount:0, gnPushCount:0,
    gnScrapedUrls:[], gnEventsState:{ running:false }, gnRetryQueue:[],
  });
  pushedEvents = [];
  await refreshStats();
  log('warn', '🗑 History cleared.');
});

// ── RETRY QUEUED EVENTS
$('btn-retry').addEventListener('click', async () => {
  const d = await chrome.storage.local.get(['gnEventsSettings', 'gnRetryQueue']);
  const queue = d.gnRetryQueue || [];
  if (queue.length === 0) { log('info', 'No queued events to retry.'); return; }

  const settings = d.gnEventsSettings || {};
  const apiUrl = settings.apiUrl || 'https://graduatenex.online/api/insta-events';
  const apiKey = settings.apiKey || '';

  log('info', `🔄 Retrying ${queue.length} queued events...`);

  const headers = { 'Content-Type': 'application/json', ...(apiKey ? { 'X-Scout-Key': apiKey } : {}) };
  let pushed = 0;
  const stillFailed = [];

  for (const evt of queue) {
    try {
      const res = await fetch(apiUrl, { method:'POST', headers, body: JSON.stringify({ events:[evt] }) });
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const json = await res.json();
        if (json.inserted > 0) {
          pushed++;
          pushedEvents.push(evt);
          log('pushed', `🚀 Retry OK: "${evt.title?.slice(0, 40)}"`);
        } else {
          log('info', `⚡ Already in DB: "${evt.title?.slice(0, 40)}"`);
        }
      } else {
        stillFailed.push(evt);
        log('error', `❌ Still failing (check API URL in Settings)`);
      }
    } catch (e) {
      stillFailed.push(evt);
      log('warn', `⚠ Retry failed: ${e.message?.slice(0, 40)}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  await chrome.storage.local.set({ gnRetryQueue: stillFailed });
  if (pushed > 0) {
    const pd = await chrome.storage.local.get(['gnPushCount']);
    await chrome.storage.local.set({ gnPushCount: (pd.gnPushCount||0) + pushed });
  }
  await refreshStats();
  log('done', `Retry done: ${pushed} pushed, ${stillFailed.length} still pending.`);
});

// ── SAVE SETTINGS
$('btn-save-settings').addEventListener('click', async () => {
  await chrome.storage.local.set({ gnEventsSettings:{
    apiUrl:    $('api-url').value.trim() || 'https://graduatenex.online/api/insta-events',
    apiKey:    $('api-key').value.trim(),
    maxPosts:  parseInt($('max-posts').value || '12', 10),
  }});
  $('settings-msg').textContent = '✅ Saved!';
  setTimeout(() => $('settings-msg').textContent = '', 2000);
});

// ── LISTEN TO PROGRESS FROM BACKGROUND.JS
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== 'SCOUT_PROGRESS') return;
  const { type, msg: text, event: evt } = msg;

  log(type, text || '');

  if (type === 'navigate') {
    const m = text?.match(/[#→](\w+)/);
    if (m) $('current-hashtag').textContent = '#' + m[1];
  }
  if (type === 'pushed' && msg.event) {
    pushedEvents.push(msg.event);
    if (pushedEvents.length > 50) pushedEvents.shift();
  }
  if (type === 'done') { setStatus('done'); $('current-hashtag').textContent = ''; }
  if (['found','pushed','skip','info','error','navigate','done','warn'].includes(type)) refreshStats();
});

// ── Poll every 3s (page navigations can break message channel)
setInterval(async () => {
  await refreshStats();
  const d = await chrome.storage.local.get(['gnEventsState']);
  const running = d.gnEventsState?.running;
  if (running && !isRunning) setStatus('running');
  if (!running && isRunning) setStatus('done');
}, 3000);

// ── INIT
async function init() {
  renderHashtags();

  const s = await chrome.storage.local.get(['gnEventsSettings']);
  if (s.gnEventsSettings) {
    if ($('api-url'))   $('api-url').value   = s.gnEventsSettings.apiUrl  || 'https://graduatenex.online/api/insta-events';
    if ($('api-key'))   $('api-key').value   = s.gnEventsSettings.apiKey  || '';
    if ($('max-posts')) $('max-posts').value = s.gnEventsSettings.maxPosts || 12;
  }

  await refreshStats();

  const d = await chrome.storage.local.get(['gnEventsState']);
  if (d.gnEventsState?.running) {
    setStatus('running');
    $('current-hashtag').textContent = d.gnEventsState.currentHashtag ? '#' + d.gnEventsState.currentHashtag : '';
    log('info', '⚡ Scout running — auto-pushing events...');
  } else {
    setStatus('idle');
    log('info', '▶ Press Start — events push automatically. No button needed!');
  }
}

init();
