  const queueEl = document.getElementById('stat-queue');
  if (queueEl && msg.queue !== undefined) queueEl.textContent = msg.queue;
});

// ══════════════════════════════════════════════════════
// GLOBAL UNIVERSITY BOT — popup.js additions (v4.0)
// ══════════════════════════════════════════════════════

const GLOBAL_UNIVERSITIES = {
  usa: [
    'Harvard University','Stanford University','MIT','Yale University',
    'New York University','University of Michigan','UCLA','Princeton University',
    'Columbia University','Ohio State University','Texas A&M University',
    'UC Berkeley','Cornell University','Penn State',
    'University of Southern California','University of Washington',
    'Carnegie Mellon University','Georgia Tech','Purdue University',
    'Northeastern University','Arizona State University',
    'University of Texas at Austin','University of Illinois Urbana-Champaign',
    'University of California San Diego','University of Florida',
    'University of Maryland','University of Minnesota',
    'University of Colorado Boulder','University of Miami',
    'University of Pittsburgh'
  ],
  uk: [
    'University of Oxford','University of Cambridge','Imperial College London',
    'UCL','LSE','King\'s College London','University of Edinburgh',
    'University of Manchester','University of Warwick','University of Bristol',
    'University of Glasgow','University of Birmingham','University of Leeds',
    'University of Nottingham','University of Southampton',
    'University of Sheffield','University of Exeter','University of Liverpool',
    'University of Bath','Newcastle University','Durham University',
    'University of York','Queen Mary University of London',
    'University of Surrey','University of Strathclyde','Loughborough University',
    'University of Leicester','University of Sussex','University of Kent',
    'Aston University'
  ],
  canada: [
    'University of Toronto','University of British Columbia','McGill University',
    'Western University','University of Alberta','McMaster University',
    'University of Ottawa','University of Waterloo','York University',
    'Queen\'s University','University of Guelph','University of Victoria',
    'Toronto Metropolitan University','University of Manitoba',
    'University of Calgary','Concordia University','Simon Fraser University',
    'Dalhousie University','University of Saskatchewan','University of Windsor',
    'Carleton University','Memorial University','University of Regina',
    'University of New Brunswick'
  ],
  australia: [
    'University of Melbourne','University of Sydney','Monash University',
    'UNSW Sydney','University of Queensland','Deakin University',
    'RMIT University','Macquarie University','Curtin University',
    'University of Adelaide','University of Western Australia',
    'Griffith University','University of Wollongong','Western Sydney University',
    'La Trobe University','Australian National University','QUT',
    'University of Tasmania','Swinburne University','Flinders University',
    'Victoria University','Edith Cowan University',
    'University of Technology Sydney','University of Canberra',
    'James Cook University','Torrens University','Charles Sturt University',
    'Southern Cross University','Charles Darwin University',
    'University of Southern Queensland'
  ]
};

let globSelectedCountries = new Set(['usa','uk','canada','australia']);
let globSelectedStyle     = 'soft';
let globSelectedSpeed     = 2000;
let globRunning           = false;
let globCommented         = 0;
let globSkipped           = 0;

function addGlobLog(msg, type = 'info') {
  const log = document.getElementById('glob-log');
  if (!log) return;
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const div  = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.textContent = `[${time}] ${msg}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
function updateGlobStats() {
  const c = document.getElementById('glob-stat-commented');
  const s = document.getElementById('glob-stat-skipped');
  if (c) c.textContent = globCommented;
  if (s) s.textContent = globSkipped;
}
function showGlobStatus(msg, type) {
  const el = document.getElementById('global-status');
  if (!el) return;
  el.textContent = msg;
  el.className   = `status ${type}`;
}
function stopGlobalBot() {
  globRunning = false;
  const startBtn = document.getElementById('btn-start-global');
  const stopBtn  = document.getElementById('btn-stop-global');
  if (startBtn) startBtn.disabled = false;
  if (stopBtn)  stopBtn.style.display = 'none';
  showGlobStatus(`⏹ Stopped. ${globCommented} global comments posted.`, 'warning');
  addGlobLog('Global bot stopped.', 'info');
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab) chrome.tabs.sendMessage(tab.id, { action: 'STOP_GLOBAL_BOT' }, () => {
      if (chrome.runtime.lastError) {}
    });
  });
  chrome.storage.local.get(['gnGlobalBotState'], (d) => {
    if (d.gnGlobalBotState) {
      d.gnGlobalBotState.running = false;
      chrome.storage.local.set({ gnGlobalBotState: d.gnGlobalBotState });
    }
  });
}

// ── Wire up Global tab UI after DOM ready
document.addEventListener('DOMContentLoaded', () => {

  // Country chips toggle
  document.querySelectorAll('#country-chips .topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const country = chip.dataset.country;
      if (globSelectedCountries.has(country)) {
        globSelectedCountries.delete(country);
        chip.classList.remove('selected');
      } else {
        globSelectedCountries.add(country);
        chip.classList.add('selected');
      }
    });
  });

  // Comment style buttons
  document.querySelectorAll('#glob-style-btns .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#glob-style-btns .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      globSelectedStyle = btn.dataset.style;
    });
  });

  // Speed buttons
  document.querySelectorAll('#glob-speed-btns .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#glob-speed-btns .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      globSelectedSpeed = parseInt(btn.dataset.gspeed);
    });
  });

  // Pre-fill university textarea with all selected countries
  function refreshGlobUniList() {
    const textarea = document.getElementById('glob-uni-list');
    if (!textarea) return;
    const unis = [];
    for (const country of ['usa','uk','canada','australia']) {
      if (globSelectedCountries.has(country)) {
        unis.push(...GLOBAL_UNIVERSITIES[country]);
      }
    }
    textarea.value = unis.join('\n');
    const queueEl = document.getElementById('glob-stat-queue');
    if (queueEl) queueEl.textContent = unis.length;
  }
  
  chrome.storage.local.get(['gnGlobalBotState'], (d) => {
    const state = d.gnGlobalBotState;
    if (state && state.pendingUniversities && state.pendingUniversities.length > 0) {
      const textarea = document.getElementById('glob-uni-list');
      if (textarea) textarea.value = state.pendingUniversities.join('\n');
      const queueEl = document.getElementById('glob-stat-queue');
      if (queueEl) queueEl.textContent = state.pendingUniversities.length;
    } else {
      refreshGlobUniList();
    }
  });

  // Re-populate list when country chips toggled
  document.querySelectorAll('#country-chips .topic-chip').forEach(chip => {
    chip.addEventListener('click', refreshGlobUniList);
  });

  // START GLOBAL BOT
  const globStartBtn = document.getElementById('btn-start-global');
  const globStopBtn  = document.getElementById('btn-stop-global');

  if (globStartBtn) {
    globStartBtn.addEventListener('click', async () => {
      if (globRunning) return;

      const rawList = document.getElementById('glob-uni-list')?.value.trim() || '';
      if (!rawList) {
        showGlobStatus('❌ No universities listed!', 'error');
        return;
      }

      const universities = rawList.split('\n').map(u => u.trim()).filter(Boolean);
      if (universities.length === 0) {
        showGlobStatus('❌ Enter at least one university!', 'error');
        return;
      }

      let tab;
      try { [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); } catch(e) {}
      if (!tab || !tab.url?.includes('instagram.com')) {
        showGlobStatus('❌ Please open Instagram first!', 'error');
        addGlobLog('Open instagram.com then click Start Global', 'error');
        return;
      }

      globRunning  = true;
      globCommented = 0;
      globSkipped   = 0;
      updateGlobStats();

      globStartBtn.disabled = true;
      if (globStopBtn) globStopBtn.style.display = 'flex';
      showGlobStatus(`🌍 Global blast started! Targeting ${universities.length} universities.`, 'info');
      addGlobLog(`Starting global bot on ${universities.length} universities...`, 'success');

      chrome.storage.local.get(['websiteUrl'], settings => {
        const config = {
          universities,
          style:      globSelectedStyle,
          speed:      globSelectedSpeed,
          websiteUrl: settings.websiteUrl || 'graduatenex.online',
          countries:  Array.from(globSelectedCountries),
        };
        chrome.tabs.sendMessage(tab.id, { action: 'START_GLOBAL_BOT', config }, response => {
          if (chrome.runtime.lastError) {
            addGlobLog('Error: ' + chrome.runtime.lastError.message, 'error');
            showGlobStatus('❌ Reload Instagram tab, then try again!', 'error');
            stopGlobalBot();
          } else {
            addGlobLog('Global bot acknowledged ✅ Searching university profiles...', 'success');
          }
        });
      });
    });
  }

  if (globStopBtn) {
    globStopBtn.addEventListener('click', stopGlobalBot);
  }
});

// Listen for progress from Global Bot content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== 'GLOBAL_BOT_PROGRESS') return;

  if (msg.type === 'commented') {
    globCommented++;
    addGlobLog(`✅ Commented on @${msg.profile || 'unknown'}: ${(msg.comment||'').substring(0,55)}`, 'success');
  } else if (msg.type === 'skipped') {
    globSkipped++;
    addGlobLog(`⏭ Skipped: ${msg.reason || ''}`, 'info');
  } else if (msg.type === 'navigate') {
    addGlobLog(`🔍 ${msg.reason || 'Navigating...'}`, 'info');
    const queueEl = document.getElementById('glob-stat-queue');
    if (queueEl && msg.remaining !== undefined) queueEl.textContent = msg.remaining;
  } else if (msg.type === 'info') {
    addGlobLog(`ℹ️ ${msg.reason || ''}`, 'info');
  } else if (msg.type === 'done') {
    addGlobLog(`🎉 ${msg.reason || 'All universities done!'}`, 'success');
    stopGlobalBot();
  } else if (msg.type === 'error') {
    addGlobLog(`❌ ${msg.reason || 'Error'}`, 'error');
  }

  updateGlobStats();
});


// ══════════════════════════════════════════════
// REDDIT GLOBAL BOT (NEW)
// ══════════════════════════════════════════════
let redditRunning = false;
let redditCommented = 0;
let redditSkipped = 0;

function updateRedditStats() {
  const c = document.getElementById('reddit-stat-commented');
  const s = document.getElementById('reddit-stat-skipped');
  if (c) c.textContent = redditCommented;
  if (s) s.textContent = redditSkipped;
}

function showRedditStatus(msg, type = 'info') {
  const s = document.getElementById('reddit-status');
  if (s) {
    s.textContent = msg;
    s.className = 'status ' + type;
    s.style.display = 'block';
  }
}

function addRedditLog(msg, type = 'info') {
  const box = document.getElementById('reddit-log');
  if (!box) return;
  const d = document.createElement('div');
  d.className = 'log-entry ' + type;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function stopRedditBot() {
  redditRunning = false;
  const startBtn = document.getElementById('btn-start-reddit');
  const stopBtn  = document.getElementById('btn-stop-reddit');
  if (startBtn) startBtn.disabled = false;
  if (stopBtn)  stopBtn.style.display = 'none';
  showRedditStatus(`⏹ Stopped. ${redditCommented} reddit comments posted.`, 'warning');
  addRedditLog('Reddit bot stopped.', 'info');
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab) chrome.tabs.sendMessage(tab.id, { action: 'STOP_REDDIT_BOT' }, () => {
      if (chrome.runtime.lastError) {}
    });
  });
  chrome.storage.local.get(['gnRedditBotState'], (d) => {
    if (d.gnRedditBotState) {
      d.gnRedditBotState.running = false;
      chrome.storage.local.set({ gnRedditBotState: d.gnRedditBotState });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let redditSelectedSpeed = 8000;
  let redditSelectedStyle = 'soft';

  // UI interaction for Style
  document.querySelectorAll('#reddit-style-btns .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#reddit-style-btns .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      redditSelectedStyle = btn.dataset.style;
    });
  });

  // UI interaction for Speed
  document.querySelectorAll('#reddit-speed-btns .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#reddit-speed-btns .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      redditSelectedSpeed = parseInt(btn.dataset.speed, 10);
    });
  });

  chrome.storage.local.get(['gnRedditBotState'], (d) => {
    const state = d.gnRedditBotState;
    if (state && state.pendingSubreddits && state.pendingSubreddits.length > 0) {
      const textarea = document.getElementById('reddit-subreddits');
      if (textarea) textarea.value = state.pendingSubreddits.join(', ');
      const queueEl = document.getElementById('reddit-stat-queue');
      if (queueEl) queueEl.textContent = state.pendingSubreddits.length;
    }
  });

  const startBtn = document.getElementById('btn-start-reddit');
  const stopBtn  = document.getElementById('btn-stop-reddit');

  if (startBtn) {
    startBtn.addEventListener('click', async () => {
      if (redditRunning) return;

      const rawList = document.getElementById('reddit-subreddits')?.value.trim() || '';
      if (!rawList) {
        showRedditStatus('❌ No subreddits listed!', 'error');
        return;
      }

      const subreddits = rawList.split(',').map(s => s.trim()).filter(Boolean);
      if (subreddits.length === 0) {
        showRedditStatus('❌ Enter at least one subreddit!', 'error');
        return;
      }

      let tab;
      try { [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); } catch(e) {}
      if (!tab || !tab.url?.includes('reddit.com')) {
        showRedditStatus('❌ Please open Reddit first!', 'error');
        addRedditLog('Open reddit.com then click Start', 'error');
        return;
      }

      redditRunning  = true;
      redditCommented = 0;
      redditSkipped   = 0;
      updateRedditStats();

      startBtn.disabled = true;
      if (stopBtn) stopBtn.style.display = 'flex';
      showRedditStatus(`🔥 Reddit blast started! Targeting ${subreddits.length} subreddits.`, 'info');
      addRedditLog(`Starting reddit bot on ${subreddits.length} subreddits...`, 'success');

      chrome.storage.local.get(['websiteUrl'], settings => {
        const config = {
          subreddits,
          style:      redditSelectedStyle,
          speed:      redditSelectedSpeed,
          websiteUrl: settings.websiteUrl || 'graduatenex.online'
        };
        chrome.tabs.sendMessage(tab.id, { action: 'START_REDDIT_BOT', config }, response => {
          if (chrome.runtime.lastError) {
            addRedditLog('Error: ' + chrome.runtime.lastError.message, 'error');
            showRedditStatus('❌ Reload Reddit tab, then try again!', 'error');
            stopRedditBot();
          } else {
            addRedditLog('Reddit bot acknowledged ✅ Navigating to first subreddit...', 'success');
          }
        });
      });
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', stopRedditBot);
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== 'REDDIT_BOT_PROGRESS') return;

  if (msg.type === 'commented') {
    redditCommented++;
    addRedditLog(`✅ Commented on r/${msg.subreddit || 'unknown'}: ${(msg.comment||'').substring(0,55)}`, 'success');
  } else if (msg.type === 'skipped') {
    redditSkipped++;
    addRedditLog(`⏭ Skipped: ${msg.reason || ''}`, 'info');
  } else if (msg.type === 'navigate') {
    addRedditLog(`🔍 ${msg.reason || 'Navigating...'}`, 'info');
    const queueEl = document.getElementById('reddit-stat-queue');
    if (queueEl && msg.remaining !== undefined) queueEl.textContent = msg.remaining;
  } else if (msg.type === 'info') {
    addRedditLog(`ℹ️ ${msg.reason || ''}`, 'info');
  } else if (msg.type === 'done') {
    addRedditLog(`🎉 ${msg.reason || 'All subreddits done!'}`, 'success');
    stopRedditBot();
  } else if (msg.type === 'error') {
    addRedditLog(`❌ ${msg.reason || 'Error'}`, 'error');
  }

  updateRedditStats();
});
