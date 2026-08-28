// GraduateNex Job Crawler — popup.js v1.1
'use strict';

// ── DOM helpers
const $ = id => document.getElementById(id);
const log = (msg, type = 'info') => {
  const box  = $('log-box');
  if (!box) return;
  const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
  const line = document.createElement('div');
  line.className = 'log-line ' + type;
  line.textContent = `[${time}] ${msg}`;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
};

const setStatus = (msg, type = 'info') => {
  const el = $('main-status');
  if (!el) return;
  el.innerHTML = msg;
  el.className = 'status-bar ' + type;
};

// ── Source checkboxes toggle styling
function initSourceCheckboxes() {
  ['remotive','arbeitnow','devto','hn'].forEach(src => {
    const cb  = $('src-' + src);
    const lbl = $('lbl-' + src);
    if (!cb || !lbl) return;
    cb.addEventListener('change', () => {
      lbl.classList.toggle('checked', cb.checked);
    });
  });
}

function getSelectedSources() {
  return ['remotive','arbeitnow','devto','hn'].filter(s => {
    const el = $('src-' + s);
    return el && el.checked;
  });
}

// ── On load
document.addEventListener('DOMContentLoaded', () => {
  initSourceCheckboxes();

  // Restore saved settings
  chrome.storage.local.get(['backendUrl','crawlerSecret','lastCrawl','crawlStats','selectedSources'], data => {
    if (data.backendUrl)    $('backendUrl').value    = data.backendUrl;
    if (data.crawlerSecret) $('crawlerSecret').value = data.crawlerSecret;

    if (data.lastCrawl) {
      const d = new Date(data.lastCrawl);
      $('last-run').textContent = 'Last crawl: ' + d.toLocaleString('en-IN');
    }
    if (data.crawlStats) {
      $('stat-jobs').textContent   = data.crawlStats.jobs        || 0;
      $('stat-intern').textContent = data.crawlStats.internships  || 0;
      $('stat-news').textContent   = data.crawlStats.news         || 0;
    }
    if (data.selectedSources && Array.isArray(data.selectedSources)) {
      ['remotive','arbeitnow','devto','hn'].forEach(src => {
        const cb  = $('src-' + src);
        const lbl = $('lbl-' + src);
        if (!cb || !lbl) return;
        cb.checked = data.selectedSources.includes(src);
        lbl.classList.toggle('checked', cb.checked);
      });
    }
  });

  // ── SAVE CONFIG
  $('btn-save').addEventListener('click', () => {
    const backendUrl    = $('backendUrl').value.trim()    || 'https://www.graduatenex.online';
    const crawlerSecret = $('crawlerSecret').value.trim() || '';
    const selectedSources = getSelectedSources();

    chrome.storage.local.set({ backendUrl, crawlerSecret, selectedSources }, () => {
      // Ask background to setup hourly alarm
      chrome.runtime.sendMessage({ action: 'SETUP_ALARM' }, () => {
        if (chrome.runtime.lastError) { /* ignore */ }
      });
      setStatus('✅ Saved! Auto-crawl runs every hour automatically.', 'success');
      log('Config saved. Hourly auto-crawl enabled ✅', 'success');
    });
  });

  // ── CRAWL NOW
  $('btn-crawl').addEventListener('click', () => {
    const backendUrl    = $('backendUrl').value.trim()    || 'https://www.graduatenex.online';
    const crawlerSecret = $('crawlerSecret').value.trim() || '';
    const sources       = getSelectedSources();

    if (sources.length === 0) {
      setStatus('❌ Please select at least one source!', 'error');
      return;
    }

    $('btn-crawl').disabled = true;
    $('btn-crawl').textContent = '⏳ Crawling…';
    setStatus('⏳ Crawling all sources… please wait', 'warning');
    log('Starting crawl: ' + sources.join(', '), 'info');

    chrome.runtime.sendMessage({ action: 'CRAWL_NOW', backendUrl, crawlerSecret, sources }, response => {
      $('btn-crawl').disabled  = false;
      $('btn-crawl').innerHTML = '🚀 Crawl Now &amp; Push to Site';

      if (chrome.runtime.lastError) {
        const err = chrome.runtime.lastError.message || 'Unknown error';
        setStatus('❌ Error: ' + err, 'error');
        log('Error: ' + err, 'error');
        return;
      }
      if (!response) {
        setStatus('❌ No response from background. Reload extension.', 'error');
        log('No response from background script.', 'error');
        return;
      }
      if (response.success) {
        setStatus(`✅ Done! Pushed ${response.total || 0} items to GraduateNex!`, 'success');
        log(`Jobs: ${response.jobs || 0} | Internships: ${response.internships || 0} | News: ${response.news || 0}`, 'success');
        $('stat-jobs').textContent   = response.jobs        || 0;
        $('stat-intern').textContent = response.internships  || 0;
        $('stat-news').textContent   = response.news         || 0;
        $('last-run').textContent    = 'Last crawl: ' + new Date().toLocaleString('en-IN');
      } else {
        setStatus('❌ ' + (response.error || 'Crawl failed'), 'error');
        log('Error: ' + (response.error || 'Unknown'), 'error');
      }
    });
  });
});

// ── Receive live log lines from background
chrome.runtime.onMessage.addListener(msg => {
  if (msg.action === 'CRAWL_LOG') {
    log(msg.text || '', msg.type || 'info');
  }
});
