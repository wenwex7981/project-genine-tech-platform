// ══════════════════════════════════════════════════════
// GraduateNex Insta Suite — popup.js v3.1 FIXED
// ══════════════════════════════════════════════════════
// NOTE: COMMENT_TEMPLATES live in content.js — do NOT duplicate here
// Sending large objects via chrome.tabs.sendMessage crashes the popup

let selectedTopics = new Set([
  'ai','job','fresher','student','final year','resume',
  'ats','career','roadmap','dsa','interview','placement',
  'project','college','internship'
]);
let selectedSpeed = 1500;
let commenterRunning = false;
let commentedCount = 0;
let skippedCount = 0;

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────
function addLog(msg, type = 'info') {
  const log = document.getElementById('comment-log');
  if (!log) return;
  const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.textContent = `[${time}] ${msg}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function showStatus(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `status ${type}`;
}

function updateStats() {
  const c = document.getElementById('stat-commented');
  const s = document.getElementById('stat-skipped');
  if (c) c.textContent = commentedCount;
  if (s) s.textContent = skippedCount;
}

function stopCommenter() {
  commenterRunning = false;
  const startBtn = document.getElementById('start-commenter');
  const stopBtn  = document.getElementById('stop-commenter');
  if (startBtn) startBtn.disabled = false;
  if (stopBtn)  stopBtn.style.display = 'none';
  showStatus('commenter-status', `⏹ Stopped. ${commentedCount} comments posted.`, 'warning');
  addLog('Blaster stopped.', 'info');

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab) chrome.tabs.sendMessage(tab.id, { action: 'STOP_COMMENTER' }, () => {
      if (chrome.runtime.lastError) {} // ignore
    });
  });
  chrome.storage.local.set({ gnCommenterState: null });
}

// ─────────────────────────────────────────────────────
// DOM READY
// ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ── Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panelEl = document.getElementById('tab-' + tab.dataset.tab);
      if (panelEl) panelEl.classList.add('active');
    });
  });

  // ── Topic chips
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.dataset.topic;
      if (selectedTopics.has(topic)) {
        selectedTopics.delete(topic);
        chip.classList.remove('selected');
      } else {
        selectedTopics.add(topic);
        chip.classList.add('selected');
      }
    });
  });

  // ── Speed buttons
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSpeed = parseInt(btn.dataset.speed);
    });
  });

  // ── Load saved settings
  chrome.storage.local.get(['apiKey','companyName','companyTagline','websiteUrl','backendUrl'], data => {
    if (data.apiKey)        { const el = document.getElementById('apiKey');        if(el) el.value = data.apiKey; }
    if (data.companyName)   { const el = document.getElementById('companyName');   if(el) el.value = data.companyName; }
    if (data.companyTagline){ const el = document.getElementById('companyTagline');if(el) el.value = data.companyTagline; }
    if (data.websiteUrl)    { const el = document.getElementById('websiteUrl');    if(el) el.value = data.websiteUrl; }
    if (data.backendUrl)    { const el = document.getElementById('backendUrl');    if(el) el.value = data.backendUrl; }
  });

  // ── Save settings
  const saveBtn = document.getElementById('save-settings');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      chrome.storage.local.set({
        apiKey:        document.getElementById('apiKey')?.value.trim() || '',
        companyName:   document.getElementById('companyName')?.value.trim() || 'GraduateNex',
        companyTagline:document.getElementById('companyTagline')?.value.trim() || '',
        websiteUrl:    document.getElementById('websiteUrl')?.value.trim() || 'graduatenex.online',
        backendUrl:    document.getElementById('backendUrl')?.value.trim() || 'https://www.graduatenex.online',
      }, () => {
        showStatus('settings-status', '✅ Settings saved!', 'success');
        setTimeout(() => {
          const el = document.getElementById('settings-status');
          if (el) el.className = 'status';
        }, 2000);
      });
    });
  }

  // ── START COMMENTER
  const startBtn = document.getElementById('start-commenter');
  if (startBtn) {
    startBtn.addEventListener('click', async () => {
      if (commenterRunning) return;

      let tab;
      try {
        [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      } catch(e) {
        addLog('Error getting tab: ' + e.message, 'error');
        return;
      }

      if (!tab || !tab.url) {
        showStatus('commenter-status', '❌ No active tab found!', 'error');
        return;
      }

      if (!tab.url.includes('instagram.com')) {
        showStatus('commenter-status', '❌ Please open Instagram first!', 'error');
        addLog('Open instagram.com then click Start', 'error');
        return;
      }

      commenterRunning = true;
      commentedCount = 0;
      skippedCount = 0;
      updateStats();

      startBtn.disabled = true;
      const stopBtn = document.getElementById('stop-commenter');
      if (stopBtn) stopBtn.style.display = 'flex';
      showStatus('commenter-status', '🚀 Blaster running! Keep Instagram open.', 'info');
      addLog('Blaster started! Searching hashtags...', 'success');

      const autoScroll   = document.getElementById('auto-scroll')?.checked ?? true;
      const loopMode     = document.getElementById('loop-mode')?.checked ?? true;
      const aiPersonalize= document.getElementById('ai-personalize')?.checked ?? true;

      chrome.storage.local.get(['companyName','websiteUrl'], settings => {
        // ⚠️ CRITICAL: Do NOT include COMMENT_TEMPLATES here — they're already in content.js
        // Sending large objects through chrome.tabs.sendMessage crashes the popup
        const config = {
          topics:       Array.from(selectedTopics),
          speed:        selectedSpeed,
          autoScroll,
          loopMode,
          aiPersonalize,
          companyName:  settings.companyName || 'GraduateNex',
          websiteUrl:   settings.websiteUrl  || 'graduatenex.online',
        };

        chrome.tabs.sendMessage(tab.id, { action: 'START_COMMENTER', config }, response => {
          if (chrome.runtime.lastError) {
            addLog('Error: ' + chrome.runtime.lastError.message, 'error');
            showStatus('commenter-status', '❌ Reload Instagram tab, then try again!', 'error');
            stopCommenter();
          } else {
            addLog('Content script acknowledged. Navigating to hashtag pages...', 'success');
          }
        });
      });
    });
  }

  // ── STOP COMMENTER
  const stopBtn = document.getElementById('stop-commenter');
  if (stopBtn) stopBtn.addEventListener('click', stopCommenter);

  // ── AUTO POSTER
  const postBtn = document.getElementById('postBtn');
  if (postBtn) {
    postBtn.addEventListener('click', async () => {
      const topicText   = document.getElementById('topicText')?.value.trim() || '';
      const backendUrl  = document.getElementById('backendUrl')?.value.trim() || 'https://www.graduatenex.online';
      const fileInput   = document.getElementById('imageUpload');

      if (!fileInput?.files[0]) { showStatus('poster-status','❌ Select an image first!','error'); return; }
      if (!topicText)           { showStatus('poster-status','❌ Enter a topic for the caption!','error'); return; }

      showStatus('poster-status','⏳ Generating AI caption...','info');

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64   = e.target.result;
        const filename = fileInput.files[0].name;
        const filetype = fileInput.files[0].type;
        try {
          const res  = await fetch(`${backendUrl}/api/generate-insta-caption`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topicText }),
          });
          const data = await res.json();
          if (!data.caption) throw new Error(data.error || 'No caption returned');

          showStatus('poster-status','✅ Caption ready! Starting auto-post...','success');

          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          chrome.tabs.sendMessage(tab.id, {
            action: 'START_AUTOMATION', base64Data: base64,
            caption: data.caption, filename, filetype,
          }, () => { if (chrome.runtime.lastError) {} });

          setTimeout(() => showStatus('poster-status','📸 Automation running on Instagram!','info'), 2000);
        } catch(err) {
          showStatus('poster-status','❌ Error: ' + err.message,'error');
        }
      };
      reader.readAsDataURL(fileInput.files[0]);
    });
  }

  addLog('GraduateNex Insta Suite v3.1 ready ✅', 'success');
});

// ─────────────────────────────────────────────────────
// LISTEN FOR PROGRESS FROM CONTENT SCRIPT
// ─────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== 'COMMENT_PROGRESS') return;

  if (msg.type === 'commented') {
    commentedCount++;
    const preview = document.getElementById('comment-preview');
    if (preview) preview.textContent = msg.comment || '';
    addLog(`✅ Commented: ${(msg.comment || '').substring(0, 65)}`, 'success');
  } else if (msg.type === 'skipped') {
    skippedCount++;
    addLog(`⏭ Skipped: ${msg.reason || ''}`, 'info');
  } else if (msg.type === 'error') {
    addLog(`❌ ${msg.error || 'Unknown error'}`, 'error');
  } else if (msg.type === 'scrolled') {
    addLog(`🔍 ${msg.reason || 'Navigating...'}`, 'info');
  } else if (msg.type === 'info') {
    addLog(`ℹ️ ${msg.reason || ''}`, 'info');
  } else if (msg.type === 'stopped') {
    if (commenterRunning) stopCommenter();
    addLog('✅ All hashtags done!', 'success');
  }

  updateStats();
  const queueEl = document.getElementById('stat-queue');
  if (queueEl && msg.queue !== undefined) queueEl.textContent = msg.queue;
});
