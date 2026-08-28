// GraduateNex Job Crawler — popup.js

let selectedSources = new Set(['remotive','arbeitnow','devto','hn']);

function addLog(msg, type = 'info') {
  const log = document.getElementById('crawl-log');
  if (!log) return;
  const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.textContent = `[${time}] ${msg}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function setStatus(msg, type) {
  const el = document.getElementById('main-status');
  if (el) { el.textContent = msg; el.className = `status ${type}`; }
}

document.addEventListener('DOMContentLoaded', () => {
  // Load saved config
  chrome.storage.local.get(['backendUrl','crawlerSecret','lastCrawl','crawlStats'], data => {
    if (data.backendUrl)     document.getElementById('backendUrl').value = data.backendUrl;
    if (data.crawlerSecret)  document.getElementById('crawlerSecret').value = data.crawlerSecret;
    if (data.lastCrawl) {
      const d = new Date(data.lastCrawl);
      document.getElementById('last-run-time').textContent = `Last crawl: ${d.toLocaleString('en-IN')}`;
    }
    if (data.crawlStats) {
      document.getElementById('stat-jobs').textContent   = data.crawlStats.jobs || 0;
      document.getElementById('stat-intern').textContent = data.crawlStats.internships || 0;
      document.getElementById('stat-news').textContent   = data.crawlStats.news || 0;
    }
  });

  // Source chips
  document.querySelectorAll('.source-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const s = chip.dataset.source;
      if (selectedSources.has(s)) { selectedSources.delete(s); chip.classList.remove('selected'); }
      else                         { selectedSources.add(s);    chip.classList.add('selected'); }
    });
  });

  // Save config + enable hourly alarm
  document.getElementById('save-config').addEventListener('click', () => {
    const backendUrl    = document.getElementById('backendUrl').value.trim();
    const crawlerSecret = document.getElementById('crawlerSecret').value.trim();
    chrome.storage.local.set({ backendUrl, crawlerSecret, selectedSources: Array.from(selectedSources) }, () => {
      // Set hourly alarm
      chrome.runtime.sendMessage({ action: 'SETUP_ALARM' });
      setStatus('✅ Saved! Auto-crawl runs every hour.', 'success');
      addLog('Config saved. Hourly auto-crawl enabled.', 'success');
    });
  });

  // Manual crawl now
  document.getElementById('crawl-now').addEventListener('click', async () => {
    const backendUrl    = document.getElementById('backendUrl').value.trim() || 'https://www.graduatenex.online';
    const crawlerSecret = document.getElementById('crawlerSecret').value.trim();

    document.getElementById('crawl-now').disabled = true;
    setStatus('⏳ Crawling fresh jobs & news...', 'info');
    addLog('Starting crawl from all sources...', 'info');

    chrome.runtime.sendMessage({
      action: 'CRAWL_NOW',
      backendUrl,
      crawlerSecret,
      sources: Array.from(selectedSources),
    }, response => {
      document.getElementById('crawl-now').disabled = false;
      if (chrome.runtime.lastError || !response) {
        setStatus('❌ Crawl failed. Check console.', 'error');
        addLog('Error: ' + (chrome.runtime.lastError?.message || 'No response'), 'error');
        return;
      }
      if (response.success) {
        setStatus(`✅ Pushed ${response.total} items to GraduateNex!`, 'success');
        addLog(`Jobs: ${response.jobs} | Internships: ${response.internships} | News: ${response.news}`, 'success');
        document.getElementById('stat-jobs').textContent   = response.jobs || 0;
        document.getElementById('stat-intern').textContent = response.internships || 0;
        document.getElementById('stat-news').textContent   = response.news || 0;
        document.getElementById('last-run-time').textContent = `Last crawl: ${new Date().toLocaleString('en-IN')}`;
      } else {
        setStatus('❌ ' + (response.error || 'Unknown error'), 'error');
        addLog('Error: ' + (response.error || ''), 'error');
      }
    });
  });
});

// Receive log updates from background
chrome.runtime.onMessage.addListener(msg => {
  if (msg.action === 'CRAWL_LOG') addLog(msg.text, msg.type || 'info');
});
