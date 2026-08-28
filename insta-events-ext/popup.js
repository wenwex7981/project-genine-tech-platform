// ══════════════════════════════════════════════════════════════════
// GraduateNex Events Scout — popup.js
// ══════════════════════════════════════════════════════════════════

const DEFAULT_HASHTAGS = [
  'hackathon', 'hackathon2025', 'hackathon2026', 'collegehackathon',
  'technicalfest', 'techfest', 'techconference', 'startupweekend',
  'codingcompetition', 'datathon', 'ideathon', 'bootcamp2025',
  'devfest', 'hackathonIndia', 'HackIndia', 'SmartIndiaHackathon',
  'sih2025', 'indiahackathon', 'mlhackathon', 'studenthackathon',
];

let selectedHashtags = [...DEFAULT_HASHTAGS];
let logEntries = [];
let statsFound = 0;
let statsScanned = 0;
let statsPushed = 0;
let isRunning = false;

// ── DOM refs
const elLog        = document.getElementById('log');
const elFound      = document.getElementById('stat-found');
const elScanned    = document.getElementById('stat-scanned');
const elPushed     = document.getElementById('stat-pushed');
const elBadge      = document.getElementById('total-badge');
const elStatus     = document.getElementById('status-pill');
const elStatusDot  = document.getElementById('status-dot');
const elStatusText = document.getElementById('status-text');
const elCurrentHT  = document.getElementById('current-hashtag');
const elBtnStart   = document.getElementById('btn-start');
const elBtnStop    = document.getElementById('btn-stop');
const elBtnPush    = document.getElementById('btn-push');
const elBtnClear   = document.getElementById('btn-clear');
const elEventsList = document.getElementById('events-list');
const elHashtags   = document.getElementById('hashtag-tags');
const elApiUrl     = document.getElementById('api-url');
const elApiKey     = document.getElementById('api-key');
const elMaxPosts   = document.getElementById('max-posts');
const elSettingsMsg= document.getElementById('settings-msg');

// ── TABS
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const id = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + id).classList.add('active');
    if (id === 'events') loadEventsPreview();
  });
});

// ── HASHTAG TAGS
function renderHashtags() {
  elHashtags.innerHTML = '';
  DEFAULT_HASHTAGS.forEach(ht => {
    const tag = document.createElement('div');
    tag.className = 'hashtag-tag' + (selectedHashtags.includes(ht) ? ' active' : '');
    tag.textContent = '#' + ht;
    tag.addEventListener('click', () => {
      if (selectedHashtags.includes(ht)) {
        selectedHashtags = selectedHashtags.filter(h => h !== ht);
        tag.classList.remove('active');
      } else {
        selectedHashtags.push(ht);
        tag.classList.add('active');
      }
    });
    elHashtags.appendChild(tag);
  });
}

// ── LOG
function addLog(type, msg) {
  logEntries.push({ type, msg });
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `
    <span class="log-dot ${type}"></span>
    <span class="log-text">${escapeHtml(msg)}</span>
  `;
  elLog.appendChild(entry);
  elLog.scrollTop = elLog.scrollHeight;
  // keep max 80 entries
  while (elLog.children.length > 80) elLog.removeChild(elLog.firstChild);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ── STATUS
function setStatus(state) {
  elStatus.className = 'status-pill ' + state;
  elStatusDot.className = 'status-dot ' + state;
  const labels = { idle: 'Idle', running: 'Scanning...', done: 'Done' };
  elStatusText.textContent = labels[state] || state;
  isRunning = state === 'running';
  elBtnStart.style.display = isRunning ? 'none' : 'flex';
  elBtnStop.style.display  = isRunning ? 'flex' : 'none';
}

// ── STATS
function updateStats() {
  elFound.textContent   = statsFound;
  elScanned.textContent = statsScanned;
  elPushed.textContent  = statsPushed;
  elBadge.textContent   = statsFound + ' found';
  elBtnPush.disabled    = statsFound === 0 || isRunning;
}

// ── EVENTS PREVIEW
async function loadEventsPreview() {
  const data = await chrome.storage.local.get(['gnScrapedEvents']);
  const events = data.gnScrapedEvents || [];
  statsFound = events.length;
  updateStats();

  if (events.length === 0) {
    elEventsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">🔍</div>
        <div>No events scraped yet.<br>Run the scraper first.</div>
      </div>`;
    return;
  }

  elEventsList.innerHTML = '';
  events.slice(0, 30).forEach(evt => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      ${evt.image_url ? `<img class="event-img" src="${escapeHtml(evt.image_url)}" onerror="this.style.display='none'" />` : '<div class="event-img" style="display:flex;align-items:center;justify-content:center;font-size:20px;">🏆</div>'}
      <div class="event-info">
        <div class="event-title">${escapeHtml(evt.title || 'Untitled Event')}</div>
        <div class="event-meta">${escapeHtml(evt.date || 'Date TBD')} · ${escapeHtml(evt.location || 'Online')}</div>
        <a class="event-link" href="${escapeHtml(evt.instagram_url)}" target="_blank">View on Instagram ↗</a>
      </div>
      <div class="event-badge">Event</div>
    `;
    elEventsList.appendChild(card);
  });
}

// ── START SCRAPING
elBtnStart.addEventListener('click', async () => {
  if (selectedHashtags.length === 0) {
    addLog('error', 'Please select at least one hashtag!');
    return;
  }

  // Load settings
  const settings = await chrome.storage.local.get(['gnEventsSettings']);
  const maxPosts = parseInt(settings.gnEventsSettings?.maxPosts || '10', 10);

  // Find Instagram tab or open one
  const tabs = await chrome.tabs.query({ url: '*://*.instagram.com/*' });
  let tab;

  if (tabs.length > 0) {
    tab = tabs[0];
    await chrome.tabs.update(tab.id, { active: true });
  } else {
    tab = await chrome.tabs.create({ url: 'https://www.instagram.com/' });
    await new Promise(r => setTimeout(r, 3000)); // wait for tab to load
  }

  // Clear old data
  await chrome.storage.local.set({ gnScrapedEvents: [] });
  statsFound = 0;
  statsScanned = 0;
  updateStats();
  addLog('info', `Starting scout with ${selectedHashtags.length} hashtags...`);
  setStatus('running');

  // Send message to content script
  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: 'START_SCOUT',
      hashtags: selectedHashtags,
      maxPosts,
    });
  } catch (err) {
    // Content script not yet loaded — wait and retry
    await new Promise(r => setTimeout(r, 2000));
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
      });
      await new Promise(r => setTimeout(r, 1000));
      await chrome.tabs.sendMessage(tab.id, {
        action: 'START_SCOUT',
        hashtags: selectedHashtags,
        maxPosts,
      });
    } catch (err2) {
      addLog('error', 'Could not inject into Instagram tab. Make sure instagram.com is open.');
      setStatus('idle');
    }
  }
});

// ── STOP SCRAPING
elBtnStop.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ url: '*://*.instagram.com/*' });
  if (tabs.length > 0) {
    try {
      await chrome.tabs.sendMessage(tabs[0].id, { action: 'STOP_SCOUT' });
    } catch (e) {}
  }
  await chrome.storage.local.set({ gnEventsState: { running: false } });
  setStatus('idle');
  addLog('warn', 'Scraping stopped by user.');
});

// ── PUSH TO DB
elBtnPush.addEventListener('click', async () => {
  const settingsData = await chrome.storage.local.get(['gnEventsSettings']);
  const settings     = settingsData.gnEventsSettings || {};
  const apiUrl = settings.apiUrl || document.getElementById('api-url').value || 'http://localhost:3000/api/insta-events';
  const apiKey = settings.apiKey || document.getElementById('api-key').value || '';

  const data = await chrome.storage.local.get(['gnScrapedEvents']);
  const events = data.gnScrapedEvents || [];

  if (events.length === 0) {
    addLog('warn', 'No events to push. Run the scraper first.');
    return;
  }

  addLog('info', `Pushing ${events.length} events to GraduateNex...`);
  elBtnPush.disabled = true;
  elBtnPush.textContent = '⏳ Pushing...';

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-Scout-Key': apiKey } : {}),
      },
      body: JSON.stringify({ events }),
    });

    const json = await res.json();
    if (res.ok && json.success) {
      statsPushed = json.inserted || events.length;
      updateStats();
      addLog('push', `✅ Pushed! ${json.inserted} new events added to GraduateNex.`);
      elBtnPush.textContent = '✅ Pushed!';
      setTimeout(() => {
        elBtnPush.textContent = '🚀 Push to GraduateNex DB';
        elBtnPush.disabled = false;
      }, 3000);
    } else {
      throw new Error(json.error || json.message || 'Push failed');
    }
  } catch (err) {
    addLog('error', `Push failed: ${err.message}`);
    elBtnPush.textContent = '🚀 Push to GraduateNex DB';
    elBtnPush.disabled = false;
  }
});

// ── CLEAR DATA
elBtnClear.addEventListener('click', async () => {
  await chrome.storage.local.set({ gnScrapedEvents: [] });
  statsFound = 0;
  statsScanned = 0;
  statsPushed = 0;
  updateStats();
  addLog('warn', 'Cleared all scraped event data.');
  loadEventsPreview();
});

// ── SAVE SETTINGS
document.getElementById('btn-save-settings').addEventListener('click', async () => {
  const settings = {
    apiUrl: elApiUrl.value,
    apiKey: elApiKey.value,
    maxPosts: parseInt(elMaxPosts.value || '10', 10),
  };
  await chrome.storage.local.set({ gnEventsSettings: settings });
  elSettingsMsg.textContent = '✅ Settings saved!';
  setTimeout(() => elSettingsMsg.textContent = '', 2000);
});

// ── LISTEN TO CONTENT SCRIPT MESSAGES
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== 'SCOUT_PROGRESS') return;

  const { type, msg: text, total, event: evt } = msg;

  addLog(type, text || '');

  if (type === 'found') {
    statsFound = total || statsFound + 1;
    statsScanned++;
    updateStats();
    loadEventsPreview();
  }
  if (type === 'skip') {
    statsScanned++;
    updateStats();
  }
  if (type === 'done') {
    setStatus('done');
    updateStats();
    loadEventsPreview();
    addLog('done', `Scraping complete. Found ${statsFound} events.`);
  }
  if (type === 'navigate') {
    const htMatch = text?.match(/#(\w+)/);
    if (htMatch) elCurrentHT.textContent = '#' + htMatch[1];
  }
});

// ── INIT
async function init() {
  renderHashtags();

  // Load settings
  const settingsData = await chrome.storage.local.get(['gnEventsSettings']);
  if (settingsData.gnEventsSettings) {
    const s = settingsData.gnEventsSettings;
    if (s.apiUrl)   elApiUrl.value   = s.apiUrl;
    if (s.apiKey)   elApiKey.value   = s.apiKey;
    if (s.maxPosts) elMaxPosts.value = s.maxPosts;
  }

  // Load existing scraped events
  const data = await chrome.storage.local.get(['gnScrapedEvents', 'gnEventsState']);
  const events = data.gnScrapedEvents || [];
  const state  = data.gnEventsState || {};

  statsFound = events.length;
  updateStats();

  if (state.running) {
    setStatus('running');
    elCurrentHT.textContent = state.currentHashtag ? '#' + state.currentHashtag : '';
    addLog('info', 'Scout is currently running...');
  } else if (events.length > 0) {
    setStatus('done');
    addLog('done', `${events.length} events ready to push.`);
  } else {
    setStatus('idle');
    addLog('info', 'Ready. Select hashtags and click Start Scraping.');
  }
}

init();
