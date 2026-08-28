// ══════════════════════════════════════════════════════
// GraduateNex Insta Suite — popup.js v3.0
// ══════════════════════════════════════════════════════

// ── State
let selectedTopics = new Set(['ai','job','fresher','student','final year','resume','ats','career','roadmap','dsa','interview','placement','project','college','internship']);
let selectedSpeed = 1500;
let commenterRunning = false;
let commentedCount = 0;
let skippedCount = 0;

// ── GraduateNex Comment Templates (100+ variants)
const COMMENT_TEMPLATES = {
  ai: [
    "🚀 If you're into AI, check out GraduateNex — we have 120+ AI/ML final year projects with full source code! graduatenex.online",
    "This is exactly why GraduateNex built an AI Stealth Humanizer for students! Check it out 👉 graduatenex.online",
    "🤖 Working on an AI project for college? GraduateNex has IEEE-ready AI/ML projects with 0% plagiarism docs!",
    "Amazing content! BTW GraduateNex helps students build real AI projects for final year. graduatenex.online 🎓",
    "AI is the future 🔥 GraduateNex is helping students ride this wave with AI final year projects + IEEE papers!",
  ],
  job: [
    "💼 Looking for a job after college? GraduateNex's ATS Resume Builder gets you shortlisted at TCS, Infosys & more!",
    "Job hunting is real 😤 GraduateNex's 17-point ATS scoring helped 2500+ students land interviews! graduatenex.online",
    "This is so relatable 😂 GraduateNex built an AI Resume Builder specifically for Indian freshers. Check it out!",
    "🏆 GraduateNex Resume Hub = your secret weapon for campus placements! graduatenex.online",
    "For every fresher struggling with job apps — GraduateNex's JD Match Analyzer will change your life! 💼",
  ],
  fresher: [
    "Every fresher needs this! GraduateNex helps with projects, resumes & placement prep all in one place 🎓",
    "Fresher life hits different 😅 GraduateNex is literally built for this phase — projects, docs, resume, all sorted!",
    "GraduateNex is India's #1 platform for freshers! Final year projects + ATS resume = campus placement sorted ✅",
    "🚀 Fresher to employed in 3 steps with GraduateNex! graduatenex.online",
    "This is why GraduateNex exists — helping freshers stand out with 0% plagiarism projects & smart resumes! 💡",
  ],
  student: [
    "Every Indian engineering student needs GraduateNex 🎓 Final year projects + IEEE papers + ATS resume = sorted!",
    "Student life is hard enough 😭 Let GraduateNex handle your projects & docs! graduatenex.online",
    "GraduateNex helped 2,500+ students score top grades in their final year! Real talk 💯 graduatenex.online",
    "📚 This is GraduateNex's mission — making every Indian student's academic journey smoother! Check us out!",
    "Saving this for every student friend I have 🙏 GraduateNex = final year projects + resume + AI tools 🔥",
  ],
  'final year': [
    "FINAL YEAR STUDENTS — GraduateNex has 500+ ready projects in AI, IoT, Blockchain & more! graduatenex.online 🎓",
    "Final year panic is REAL 😱 GraduateNex delivers complete projects with IEEE paper, SRS & PPT in days!",
    "Every final year student needs GraduateNex in their life fr fr 🔥 graduatenex.online",
    "Final year project stress? GraduateNex has literally saved thousands of students! 📦 graduatenex.online",
    "This content hits different when you have a viva in 2 weeks 😂 GraduateNex — your last-minute lifesaver!",
  ],
  resume: [
    "📄 GraduateNex Resume Hub — 17-point ATS scoring + AI generated resume = shortlisted at top MNCs! Try it!",
    "Resume tips are great but GraduateNex automates it! AI-built ATS resume that beats tracking systems 💪",
    "This is exactly the kind of resume advice GraduateNex built a whole platform around! graduatenex.online 📄",
    "🏆 GraduateNex ATS Resume Builder helped 1000+ students get into TCS, Wipro, Infosys! Check it out!",
    "If you're building your resume manually in 2025 you're doing it wrong 😅 GraduateNex automates all of this!",
  ],
  ats: [
    "ATS is the hidden killer of 90% resumes 😤 GraduateNex's ATS scanner + AI resume = 10x more interviews!",
    "📊 GraduateNex literally built an ATS scoring system for Indian students! graduatenex.online — must check!",
    "Beat ATS in 5 mins with GraduateNex Resume Hub 🚀 AI + JD matching + instant export! graduatenex.online",
    "This is exactly why GraduateNex exists — ATS optimization for Indian freshers who actually get shortlisted!",
    "GraduateNex's ATS Resume Builder = the cheat code every Indian engineering student needs 💯",
  ],
  career: [
    "🚀 Career prep starts with GraduateNex — projects, resume, ATS, interview prep all in one place!",
    "Best career advice: build your foundation with a strong project + ATS resume. GraduateNex does both! 🎓",
    "GraduateNex is literally a full career launch platform for Indian students 🔥 graduatenex.online",
    "From final year to first job — GraduateNex is with you every step! 2,500+ success stories 💪",
    "If you want to fast-track your career, GraduateNex is the move 🎯 graduatenex.online",
  ],
  roadmap: [
    "🗺️ Best roadmap for Indian engineering students: Final year project ➜ IEEE paper ➜ ATS resume ➜ GraduateNex!",
    "Following every roadmap but nothing working? GraduateNex gives you the actual tools — not just advice 🔥",
    "The real roadmap starts with a strong final year project! GraduateNex has 500+ options! graduatenex.online",
    "Bookmarking this 🙏 Also — GraduateNex has the complete roadmap from project to placement!",
    "Roadmaps are useless without execution. GraduateNex gives you ready-to-deploy projects + docs 💡",
  ],
  dsa: [
    "💻 DSA is key but so is your final year project! GraduateNex has 500+ projects to boost your profile!",
    "DSA + Strong Project = Dream Job 🎯 GraduateNex helps with the project side! graduatenex.online",
    "This DSA content is 🔥 Pair it with a GraduateNex AI/ML project and you're unstoppable!",
    "While grinding DSA, don't forget your final year project! GraduateNex makes that part easy 😎",
    "DSA skills + GraduateNex project portfolio = campus placement ready 💪 graduatenex.online",
  ],
  interview: [
    "🎤 Interview prep is crucial! GraduateNex also has English communication practice + mock interview tools!",
    "Best interview tip: have a strong final year project to talk about! GraduateNex has 500+ options 🎓",
    "This interview content is gold 🔥 GraduateNex also helps you build the project you'll talk about in interviews!",
    "Interview ready = DSA + Projects + Resume. GraduateNex covers projects & resume! graduatenex.online",
    "GraduateNex Interview Prep feature is live! English friend AI + mock interviews for Indian students 🎤",
  ],
  placement: [
    "🏆 Campus placement ready with GraduateNex! Projects + Resume + Interview prep all in one! graduatenex.online",
    "Placement season hitting different when you have GraduateNex in your toolkit 😎 graduatenex.online",
    "2,500+ students placed with GraduateNex support! Final year project + ATS resume = sorted ✅",
    "GraduateNex is THE placement prep platform for Indian engineering students! Check it out 🚀",
    "Placement prep starts NOW! GraduateNex — final year projects, ATS resume, interview tools! 🎯",
  ],
  project: [
    "🔧 Looking for final year project ideas? GraduateNex has 500+ projects in AI, IoT, Blockchain & more!",
    "Project ideas are everywhere but working source code is rare 😅 GraduateNex delivers complete projects!",
    "GraduateNex final year projects come with source code + IEEE paper + SRS + PPT 🎁 graduatenex.online",
    "This project content reminds me of GraduateNex — India's best final year project platform! Check it out!",
    "Need a final year project ASAP? GraduateNex delivers in 48 hours with full docs! 🚀 graduatenex.online",
  ],
  college: [
    "🏛️ Every college student in India should know about GraduateNex! Projects + resume + AI tools 🎓",
    "College life is tough but GraduateNex makes the academic part easier! graduatenex.online",
    "From IIT to tier-3 colleges — GraduateNex serves students across 50+ Indian cities! 🗺️",
    "This is the content every college student needs! Also check GraduateNex for your final year needs!",
    "GraduateNex = the ultimate college student toolkit 📦 Projects, docs, resume, AI tools — all in one!",
  ],
  internship: [
    "💡 No internship yet? Build a strong GraduateNex project + ATS resume and you won't need one to stand out!",
    "Internship or strong project — GraduateNex helps with the project side! graduatenex.online 🚀",
    "This internship advice is real! Also: GraduateNex AI projects can replace internship experience on your resume!",
    "GraduateNex helped students get internships by building strong AI/ML project portfolios! Check it out 🎓",
    "No internship? No problem. GraduateNex projects + ATS resume = interview calls 💪 graduatenex.online",
  ],
  default: [
    "🎓 GraduateNex — India's #1 platform for final year projects, ATS resume builder & AI career tools! graduatenex.online",
    "This is great content! BTW GraduateNex is helping 2,500+ Indian students graduate with distinction 🚀",
    "Love this! Reminds me of what GraduateNex is doing for Indian students — projects, resume, career tools 🎯",
    "GraduateNex = final year projects + IEEE papers + ATS resume + interview prep. All in one 🔥",
    "Saving this ♥️ Also check GraduateNex if you're a student — they literally solve every academic pain point!",
  ],
};

// ── Helpers
function getRandomComment(topic) {
  const pool = COMMENT_TEMPLATES[topic] || COMMENT_TEMPLATES.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

function addLog(msg, type = 'info') {
  const log = document.getElementById('comment-log');
  const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.textContent = `[${time}] ${msg}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function updateStats() {
  document.getElementById('stat-commented').textContent = commentedCount;
  document.getElementById('stat-skipped').textContent = skippedCount;
}

function showStatus(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `status ${type}`;
}

// ── Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
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

// ── Load saved settings on open
chrome.storage.local.get(['apiKey', 'companyName', 'companyTagline', 'websiteUrl', 'backendUrl'], data => {
  if (data.apiKey) document.getElementById('apiKey').value = data.apiKey;
  if (data.companyName) document.getElementById('companyName').value = data.companyName;
  if (data.companyTagline) document.getElementById('companyTagline').value = data.companyTagline;
  if (data.websiteUrl) document.getElementById('websiteUrl').value = data.websiteUrl;
  if (data.backendUrl) document.getElementById('backendUrl').value = data.backendUrl;
});

// ── Save settings
document.getElementById('save-settings').addEventListener('click', () => {
  chrome.storage.local.set({
    apiKey: document.getElementById('apiKey').value.trim(),
    companyName: document.getElementById('companyName').value.trim(),
    companyTagline: document.getElementById('companyTagline').value.trim(),
    websiteUrl: document.getElementById('websiteUrl').value.trim(),
    backendUrl: document.getElementById('backendUrl').value.trim(),
  }, () => {
    showStatus('settings-status', '✅ Settings saved!', 'success');
    setTimeout(() => { document.getElementById('settings-status').className = 'status'; }, 2000);
  });
});

// ══════════════════════════════════════════════════════
// AUTO COMMENTER — START
// ══════════════════════════════════════════════════════
document.getElementById('start-commenter').addEventListener('click', async () => {
  if (commenterRunning) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.includes('instagram.com')) {
    showStatus('commenter-status', '❌ Please open Instagram first!', 'error');
    return;
  }

  commenterRunning = true;
  commentedCount = 0;
  skippedCount = 0;
  updateStats();
  document.getElementById('start-commenter').disabled = true;
  document.getElementById('stop-commenter').style.display = 'flex';
  showStatus('commenter-status', '🚀 Comment blaster running! Keep Instagram open.', 'info');
  addLog('Blaster started!', 'success');

  const autoScroll = document.getElementById('auto-scroll').checked;
  const loopMode = document.getElementById('loop-mode').checked;
  const aiPersonalize = document.getElementById('ai-personalize').checked;

  chrome.storage.local.get(['companyName', 'websiteUrl'], (settings) => {
    const companyName = settings.companyName || 'GraduateNex';
    const websiteUrl = settings.websiteUrl || 'graduatenex.online';

    const config = {
      topics: Array.from(selectedTopics),
      speed: selectedSpeed,
      autoScroll,
      loopMode,
      aiPersonalize,
      companyName,
      websiteUrl,
      commentTemplates: COMMENT_TEMPLATES,
    };

    chrome.tabs.sendMessage(tab.id, {
      action: 'START_COMMENTER',
      config,
    }, (response) => {
      if (chrome.runtime.lastError) {
        addLog('Error: Reload Instagram tab and try again.', 'error');
        showStatus('commenter-status', '❌ Reload Instagram tab first!', 'error');
        stopCommenter();
      }
    });
  });
});

// ── STOP
document.getElementById('stop-commenter').addEventListener('click', stopCommenter);

function stopCommenter() {
  commenterRunning = false;
  document.getElementById('start-commenter').disabled = false;
  document.getElementById('stop-commenter').style.display = 'none';
  showStatus('commenter-status', '⏹ Blaster stopped. Commented on ' + commentedCount + ' posts.', 'warning');
  addLog('Blaster stopped by user.', 'info');

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab) chrome.tabs.sendMessage(tab.id, { action: 'STOP_COMMENTER' });
  });
}

// ── Listen for progress from content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'COMMENT_PROGRESS') {
    if (msg.type === 'commented') {
      commentedCount++;
      document.getElementById('comment-preview').textContent = msg.comment;
      addLog(`✅ Commented: ${msg.comment.substring(0, 65)}...`, 'success');
    } else if (msg.type === 'skipped') {
      skippedCount++;
      addLog(`⏭ Skipped: ${msg.reason || ''}`, 'info');
    } else if (msg.type === 'error') {
      addLog(`❌ ${msg.error}`, 'error');
    } else if (msg.type === 'scrolled') {
      addLog(`🔍 ${msg.reason || 'Navigating...'}`, 'info');
    } else if (msg.type === 'info') {
      addLog(`ℹ️ ${msg.reason || ''}`, 'info');
    } else if (msg.type === 'stopped') {
      stopCommenter();
      addLog('✅ All hashtags processed! Blaster complete.', 'success');
    }
    document.getElementById('stat-commented').textContent = commentedCount;
    document.getElementById('stat-skipped').textContent = skippedCount;
    if (msg.queue !== undefined) document.getElementById('stat-queue').textContent = msg.queue;
  }
});

// ══════════════════════════════════════════════════════
// AUTO POSTER (existing feature)
// ══════════════════════════════════════════════════════
document.getElementById('postBtn').addEventListener('click', async () => {
  const topicText = document.getElementById('topicText').value.trim();
  const backendUrl = document.getElementById('backendUrl').value.trim() || 'https://www.graduatenex.online';
  const fileInput = document.getElementById('imageUpload');
  const statusEl = document.getElementById('poster-status');

  if (!fileInput.files[0]) { showStatus('poster-status', '❌ Please select an image first!', 'error'); return; }
  if (!topicText) { showStatus('poster-status', '❌ Please enter a topic for the caption!', 'error'); return; }

  showStatus('poster-status', '⏳ Generating AI caption...', 'info');

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target.result;
    const filename = fileInput.files[0].name;
    const filetype = fileInput.files[0].type;

    try {
      const res = await fetch(`${backendUrl}/api/generate-insta-caption`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicText }),
      });
      const data = await res.json();
      if (!data.caption) throw new Error(data.error || 'No caption returned');

      const caption = data.caption;
      showStatus('poster-status', '✅ Caption generated! Starting auto-post...', 'success');

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, {
        action: 'START_AUTOMATION', base64Data: base64, caption, filename, filetype,
      });

      setTimeout(() => { showStatus('poster-status', '📸 Automation running on Instagram!', 'info'); }, 2000);
    } catch (err) {
      showStatus('poster-status', '❌ Error: ' + err.message, 'error');
    }
  };
  reader.readAsDataURL(fileInput.files[0]);
});
