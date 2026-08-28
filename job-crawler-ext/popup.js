// GraduateNex Job Crawler — popup.js v2.0
'use strict';

const ALL_SOURCES = ['linkedin','naukri','internshala','indeed','remotive','arbeitnow','devto','hn'];

const $ = id => document.getElementById(id);

const addLog = (msg, type = 'info') => {
  const box  = $('log-box');
  if (!box) return;
  const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
  const div  = document.createElement('div');
  div.className   = 'log-line ' + type;
  div.textContent = `[${time}] ${msg}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
};

const setStatus = (msg, type = 'info') => {
  const el = $('main-status');
  if (!el) return;
  el.innerHTML  = msg;
  el.className  = 'status-bar ' + type;
};

function initCheckboxes() {
  ALL_SOURCES.forEach(src => {
    const cb  = $('src-' + src);
    const lbl = $('lbl-' + src);
    if (!cb || !lbl) return;
    cb.addEventListener('change', () => lbl.classList.toggle('checked', cb.checked));
  });
}

function getSelected() {
  return ALL_SOURCES.filter(s => { const el = $('src-' + s); return el && el.checked; });
}

document.addEventListener('DOMContentLoaded', () => {
  initCheckboxes();

  chrome.storage.local.get(['backendUrl','crawlerSecret','lastCrawl','crawlStats','selectedSources'], data => {
    if (data.backendUrl)    $('backendUrl').value    = data.backendUrl;
    if (data.crawlerSecret) $('crawlerSecret').value = data.crawlerSecret;
    if (data.lastCrawl) {
      $('last-run').textContent = 'Last crawl: ' + new Date(data.lastCrawl).toLocaleString('en-IN');
    }
    if (data.crawlStats) {
      $('stat-jobs').textContent   = data.crawlStats.jobs        || 0;
      $('stat-intern').textContent = data.crawlStats.internships  || 0;
      $('stat-news').textContent   = data.crawlStats.news         || 0;
    }
    if (Array.isArray(data.selectedSources)) {
      ALL_SOURCES.forEach(src => {
        const cb  = $('src-' + src);
        const lbl = $('lbl-' + src);
        if (!cb || !lbl) return;
        cb.checked = data.selectedSources.includes(src);
        lbl.classList.toggle('checked', cb.checked);
      });
    }
  });

  // ── Save config
  $('btn-save').addEventListener('click', () => {
    const backendUrl      = $('backendUrl').value.trim()    || 'https://www.graduatenex.online';
    const crawlerSecret   = $('crawlerSecret').value.trim() || '';
    const selectedSources = getSelected();
    chrome.storage.local.set({ backendUrl, crawlerSecret, selectedSources }, () => {
      chrome.runtime.sendMessage({ action: 'SETUP_ALARM' }, () => { if (chrome.runtime.lastError) {} });
      setStatus('✅ Saved! Hourly auto-crawl enabled.', 'success');
      addLog('Config saved. Auto-crawl every hour ✅', 'success');
    });
  });

  // ── Crawl now
  $('btn-crawl').addEventListener('click', () => {
    const backendUrl    = $('backendUrl').value.trim()    || 'https://www.graduatenex.online';
    const crawlerSecret = $('crawlerSecret').value.trim() || '';
    const sources       = getSelected();

    if (!sources.length) { setStatus('❌ Select at least one source!', 'error'); return; }

    const liveSources = sources.filter(s => ['linkedin','naukri','internshala','indeed'].includes(s));

    $('btn-crawl').disabled  = true;
    $('btn-crawl').textContent = '⏳ Crawling…';
    setStatus(`⏳ Crawling ${sources.length} sources${liveSources.length ? ` (${liveSources.length} tabs will open briefly)` : ''}…`, 'warning');
    addLog('Starting crawl: ' + sources.join(', '));
    if (liveSources.length) addLog(`ℹ️ Background tabs will open for: ${liveSources.join(', ')}`, 'warn');

    chrome.runtime.sendMessage({ action: 'CRAWL_NOW', backendUrl, crawlerSecret, sources }, response => {
      $('btn-crawl').disabled  = false;
      $('btn-crawl').innerHTML = '🚀 Crawl Now &amp; Push to Site';

      if (chrome.runtime.lastError || !response) {
        const err = chrome.runtime.lastError?.message || 'No response';
        setStatus('❌ ' + err, 'error');
        addLog('Error: ' + err, 'error');
        return;
      }
      if (response.success) {
        setStatus(`✅ Done! ${response.total || 0} items pushed to GraduateNex!`, 'success');
        addLog(`Jobs: ${response.jobs} | Internships: ${response.internships} | News: ${response.news}`, 'success');
        $('stat-jobs').textContent   = response.jobs        || 0;
        $('stat-intern').textContent = response.internships  || 0;
        $('stat-news').textContent   = response.news         || 0;
        $('last-run').textContent    = 'Last crawl: ' + new Date().toLocaleString('en-IN');
      } else {
        setStatus('❌ ' + (response.error || 'Crawl failed'), 'error');
        addLog('Error: ' + (response.error || 'Unknown'), 'error');
      }
    });
  });
});

// Live log from background
chrome.runtime.onMessage.addListener(msg => {
  if (msg.action === 'CRAWL_LOG') addLog(msg.text || '', msg.type || 'info');
});
