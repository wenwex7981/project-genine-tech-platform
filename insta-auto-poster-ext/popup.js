// ══════════════════════════════════════════════════════
// GraduateNex Insta Suite — popup.js v3.1 FIXED
// ══════════════════════════════════════════════════════
// NOTE: COMMENT_TEMPLATES live in content.js — do NOT duplicate here
// Sending large objects via chrome.tabs.sendMessage crashes the popup

const defaultColleges = `JNTUH College of Engineering Hyderabad
Osmania University College of Engineering
Chaitanya Bharathi Institute of Technology
VNR Vignana Jyothi Institute of Engineering and Technology
Vasavi College of Engineering
Gokaraju Rangaraju Institute of Engineering and Technology
Sreenidhi Institute of Science and Technology
CVR College of Engineering
BVRIT Hyderabad College of Engineering for Women
Padmasri Dr. B.V. Raju Institute of Technology
Mahatma Gandhi Institute of Technology
G. Narayanamma Institute of Technology and Science
CMR College of Engineering and Technology
CMR Institute of Technology
Vardhaman College of Engineering
Anurag University
Muffakham Jah College of Engineering and Technology
M.V.S.R. Engineering College
Kakatiya Institute of Technology and Science
KITS Warangal
JNTUH College of Engineering Jagtial
JNTUH College of Engineering Manthani
Deccan College of Engineering and Technology
Methodist College of Engineering and Technology
TKR College of Engineering and Technology
Marri Laxman Reddy Institute of Technology and Management
Institute of Aeronautical Engineering
Vidya Jyothi Institute of Technology
Malla Reddy College of Engineering and Technology
St. Martin's Engineering College
Geethanjali College of Engineering and Technology
JB Institute of Engineering and Technology
Guru Nanak Institutions Technical Campus
Bharat Institute of Engineering and Technology
Sreyas Institute of Engineering and Technology
K.G. Reddy College of Engineering and Technology
ACE Engineering College
Nalla Malla Reddy Engineering College
Vignana Bharathi Institute of Technology
Holy Mary Institute of Technology and Science
Stanley College of Engineering and Technology for Women
Bhoj Reddy Engineering College for Women
Vignan's Institute of Management and Technology for Women
Avanthi Institute of Engineering and Technology
Nishitha Degree College
Bhavan's Vivekananda College
Loyola Academy Degree and PG College
St. Ann's College for Women
St. Francis College for Women
Andhra University College of Engineering
JNTUK College of Engineering Kakinada
JNTUA College of Engineering Anantapur
Sri Venkateswara University College of Engineering
GVP College of Engineering Visakhapatnam
SRM University AP
VIT-AP University
KL University
GITAM University Visakhapatnam
Velagapudi Ramakrishna Siddhartha Engineering College
RVR & JC College of Engineering
Prasad V. Potluri Siddhartha Institute of Technology
G. Pulla Reddy Engineering College
Sree Vidyanikethan Engineering College
Lakireddy Bali Reddy College of Engineering
Anil Neerukonda Institute of Technology and Sciences
Gayatri Vidya Parishad College of Engineering
Vignan's Foundation for Science, Technology and Research
Madanapalle Institute of Technology and Science
Aditya Engineering College
GMR Institute of Technology
Raghu Engineering College
Bapatla Engineering College
Dhanekula Institute of Engineering and Technology
Gudlavalleru Engineering College
Andhra Loyola College
PB Siddhartha College of Arts and Science
Maris Stella College
Indian Institute of Technology Hyderabad
National Institute of Technology Warangal
National Institute of Technology Andhra Pradesh
Indian Institute of Information Technology Sri City
IIIT Hyderabad
BITS Pilani Hyderabad Campus
University of Hyderabad
Vellore Institute of Technology
SRM Institute of Science and Technology
Anna University
PSG College of Technology
RV College of Engineering
BMS College of Engineering
PES University
Ramaiah Institute of Technology
College of Engineering Pune
VJTI Mumbai
Delhi Technological University
Netaji Subhas University of Technology
Jadavpur University
Manipal Institute of Technology
Thapar Institute of Engineering and Technology
KIIT University
SOA University
Amity University
Lovely Professional University
Chandigarh University
Nirma University
DA-IICT
Haldia Institute of Technology
Heritage Institute of Technology
Techno India University
Banasthali Vidyapith
BIT Mesra
Graphic Era University
UPES Dehradun
Galgotias University
Sharda University
Shiv Nadar University
M.S. Ramaiah University of Applied Sciences
Dayananda Sagar College of Engineering
New Horizon College of Engineering
Nitte Meenakshi Institute of Technology
Sir M. Visvesvaraya Institute of Technology
Siddaganga Institute of Technology
BNM Institute of Technology
CMR Institute of Technology Bangalore
Reva University
Christ University
St. Joseph's Engineering College
Sahyadri College of Engineering and Management
NMAM Institute of Technology
KLE Technological University
SDM College of Engineering and Technology
BVB College of Engineering and Technology
Gogte Institute of Technology
Sanjeevan Engineering and Technology Institute
DKTE Society's Textile and Engineering Institute
Rajarambapu Institute of Technology
Walchand College of Engineering
K. E. Society's Rajarambapu Institute of Technology
Tatyasaheb Kore Institute of Engineering and Technology
Sanjivani College of Engineering
Pravara Rural Engineering College
Amrutvahini College of Engineering
KK Wagh Institute of Engineering Education and Research
NDMVP Samaj's Karmaveer Adv. Baburao Ganpatrao Thakare College of Engineering
MET's Institute of Engineering
Sinhgad College of Engineering
Maharashtra Institute of Technology
Pune Institute of Computer Technology
Vishwakarma Institute of Technology
Cummins College of Engineering for Women
Pimpri Chinchwad College of Engineering
D.Y. Patil College of Engineering
Rajarshi Shahu College of Engineering
JSPM's Rajarshi Shahu College of Engineering
Indira College of Engineering and Management
AISSMS College of Engineering
Modern Education Society's College of Engineering
Genba Sopanrao Moze College of Engineering
Zeal College of Engineering and Research
Trinity College of Engineering and Research
K.J. Somaiya College of Engineering
Dwarkadas J. Sanghvi College of Engineering
Thadomal Shahani Engineering College
Fr. Conceicao Rodrigues College of Engineering
Vidyalankar Institute of Technology
Xavier Institute of Engineering
Don Bosco Institute of Technology
Rajiv Gandhi Institute of Technology
St. Francis Institute of Technology
Thakur College of Engineering and Technology
Atharva College of Engineering
Terna Engineering College
Ramrao Adik Institute of Technology
SIES Graduate School of Technology
Pillai College of Engineering
Datta Meghe College of Engineering
Lokmanya Tilak College of Engineering
A.C. Patil College of Engineering
Shivajirao S. Jondhale College of Engineering
Saraswati College of Engineering
G.V. Acharya Institute of Engineering and Technology
B.R. Harne College of Engineering and Technology
Ideal Institute of Technology
TSSM's Bhivarabai Sawant College of Engineering and Research
Marathwada Mitra Mandal's College of Engineering
Smt. Kashibai Navale College of Engineering
NBN Sinhgad Technical Institutes Campus
SKN Sinhgad Institute of Technology and Science
Siddhant College of Engineering
Alard College of Engineering and Management
D.Y. Patil Institute of Engineering and Technology
Dr. D.Y. Patil Institute of Technology
Dr. D.Y. Patil School of Engineering
International Institute of Information Technology Pune
Anantrao Pawar College of Engineering and Research
Keystone School of Engineering
Trinity Academy of Engineering
KJ's Educational Institutes
Suman Ramesh Tulsiani Technical Campus
Nutan Maharashtra Institute of Engineering and Technology
P.K. Technical Campus
Dr. D.Y. Patil College of Engineering and Innovation
Siddhivinayak Technical Campus
Vidyavardhini's College of Engineering and Technology
Universal College of Engineering
Theem College of Engineering
Viva Institute of Technology
St. John College of Engineering and Management
Vighnaharata Trust's Shivajirao S. Jondhale College of Engineering and Technology
Vishwaniketan's Institute of Management Entrepreneurship and Engineering Technology
G.M. Vedak Institute of Technology
Yadavrao Tasgaonkar College of Engineering and Management
Konkan Gyanpeeth College of Engineering
Saraswati Education Society's Group of Institutions
Dilkap Research Institute of Engineering and Management Studies
G.R. Patil College of Engineering
ARMIET
S.S.P.M.'s College of Engineering
Bharat College of Engineering
Sahyadri Valley College of Engineering and Technology
Alamuri Ratnamala Institute of Engineering and Technology
V.R.S. and Y.R.N. College of Engineering and Technology
Sri Vasavi Engineering College
Swarnandhra College of Engineering and Technology
Gudlavalleru Engineering College
Usha Rama College of Engineering and Technology
NRI Institute of Technology
MIC College of Technology
Nova College of Engineering and Technology
Amrita Sai Institute of Science and Technology
Lendi Institute of Engineering and Technology
Vignan's Institute of Information Technology
Avanthi Institute of Engineering and Technology
Sanketika Vidya Parishad Engineering College
Chaitanya Engineering College
Nadimpalli Satyanarayana Raju Institute of Technology
Pydah College of Engineering
Simhadri Educational Society Group of Institutions
Viswanadha Institute of Technology and Management
Gokul Institute of Technology and Sciences
Aditya Institute of Technology and Management
Sri Sivani College of Engineering
Srinivasa Institute of Engineering and Technology
Ideal Institute of Technology
Kakinada Institute of Engineering and Technology
Pragati Engineering College
Godavari Institute of Engineering and Technology
Lenora College of Engineering
B V C Engineering College
Swarnandhra Institute of Engineering and Technology
Sasi Institute of Technology and Engineering
Sri Venkateswara College of Engineering
Sree Venkateswara College of Engineering
Rajeev Gandhi Memorial College of Engineering and Technology
Santhiram Engineering College
Brindavan Institute of Technology and Science
Audisankara College of Engineering and Technology
Narayana Engineering College
Geethanjali Institute of Science and Technology
PBR Visvodaya Institute of Technology and Science
NBKR Institute of Science and Technology
Sri Venkatesa Perumal College of Engineering and Technology
Siddharth Institute of Engineering and Technology
Annamacharya Institute of Technology and Sciences
Sri Vidyanikethan Engineering College
Sree Rama Engineering College
Kuppam Engineering College
Madanapalle Institute of Technology and Science
Sri Venkateswara College of Engineering and Technology
Vemu Institute of Technology
YSR Engineering College of Yogi Vemana University
JNTUA College of Engineering Pulivendula
G. Pulla Reddy Engineering College
Ravindra College of Engineering for Women
G. Pullaiah College of Engineering and Technology
KSRM College of Engineering
Annamacharya Institute of Technology and Sciences
Srinivasa Ramanujan Institute of Technology
Gates Institute of Technology
Sri Krishnadevaraya Engineering College
Bheema Institute of Technology and Science
Chirala Engineering College
St. Ann's College of Engineering and Technology
Prakasam Engineering College
QIS College of Engineering and Technology
PACE Institute of Technology and Sciences
Malineni Lakshmaiah Engineering College
Bapatla Engineering College
RVR & JC College of Engineering
Chebrolu Engineering College
Kallam Haranadhareddy Institute of Technology
KKR & KSR Institute of Technology and Sciences
Narasaraopeta Engineering College
Tirumala Engineering College
Vignan's Nirula Institute of Technology and Science for Women
Sri Mittapalli College of Engineering
Eswar College of Engineering
Universal College of Engineering and Technology
Vasireddy Venkatadri Institute of Technology
NRI Institute of Technology
Amrita Sai Institute of Science and Technology
Usha Rama College of Engineering and Technology
Gudlavalleru Engineering College
Dhanekula Institute of Engineering and Technology
SRK Institute of Technology
RK College of Engineering
Vikas College of Engineering and Technology
Nova College of Engineering and Technology
Potti Sriramulu Chalavadi Mallikarjuna Rao College of Engineering and Technology
Andhra Loyola Institute of Engineering and Technology
Vijaya Institute of Technology for Women
Lakkireddy Bali Reddy College of Engineering
Amrita Vishwa Vidyapeetham
Rajagiri School of Engineering & Technology
Federal Institute of Science & Technology
Model Engineering College
Delhi Technological University
Netaji Subhas University of Technology
Indraprastha Institute of Information Technology Delhi
Maharaja Surajmal Institute of Technology
Amity University
KIET Group of Institutions
Galgotias University
Sharda University
Jaypee Institute of Information Technology
ABES Engineering College
Manav Rachna International Institute of Research & Studies
Amity University Haryana
Maharshi Dayanand University
Deenbandhu Chhotu Ram University of Science & Technology
Manipal University Jaipur
JECRC University
Poornima University
Jaipur Engineering College & Research Centre
Nirma University
Ahmedabad University
Pandit Deendayal Energy University
DA-IICT
Jadavpur University
Heritage Institute of Technology
Techno India University
KIIT University
SOA University
NIT Rourkela
VIT Bhopal University
MANIT Bhopal
Lovely Professional University
Chitkara University
Amity University Patna
Birla Institute of Technology, Mesra`;
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
  chrome.storage.local.get(['apiKey','companyName','companyTagline','websiteUrl','backendUrl', 'gnFySettings'], data => {
    if (data.apiKey)        { const el = document.getElementById('apiKey');        if(el) el.value = data.apiKey; }
    if (data.companyName)   { const el = document.getElementById('companyName');   if(el) el.value = data.companyName; }
    if (data.companyTagline){ const el = document.getElementById('companyTagline');if(el) el.value = data.companyTagline; }
    if (data.websiteUrl)    { const el = document.getElementById('websiteUrl');    if(el) el.value = data.websiteUrl; }
    if (data.backendUrl)    { const el = document.getElementById('backendUrl');    if(el) el.value = data.backendUrl; }
    
    if (data.gnFySettings) {
      if (document.getElementById('fy-ig-id')) document.getElementById('fy-ig-id').value = data.gnFySettings.igId || '';
      if (document.getElementById('fy-url')) document.getElementById('fy-url').value = data.gnFySettings.url || '';
      if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = data.gnFySettings.hashtags || defaultColleges;
    } else {
      if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = defaultColleges;
    }
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
  // ── FINAL YEAR PROJECTS AUTO-COMMENT
  const fyStartBtn = document.getElementById('btn-start-fy');
  const fyStopBtn = document.getElementById('btn-stop-fy');
  
  if (fyStartBtn) {
    fyStartBtn.addEventListener('click', async () => {
      const hashtagsRaw = document.getElementById('fy-hashtags').value.trim();
      if (!hashtagsRaw) { showStatus('fy-status', '❌ Enter at least one college!', 'error'); return; }
      
      const hashtags = hashtagsRaw.split('\n').map(h => h.trim()).filter(Boolean);
      const igId = document.getElementById('fy-ig-id').value.trim();
      const url = document.getElementById('fy-url').value.trim();

      if (!igId || !url) { showStatus('fy-status', '❌ Instagram ID and Website URL required!', 'error'); return; }

      // Save settings
      await chrome.storage.local.set({ gnFySettings: { igId, url, hashtags: hashtagsRaw } });

      let tab;
      try {
        [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      } catch(e) {}
      if (!tab || !tab.url.includes('instagram.com')) {
        showStatus('fy-status', '❌ Please open Instagram first!', 'error');
        return;
      }

      fyStartBtn.style.display = 'none';
      if (fyStopBtn) fyStopBtn.style.display = 'flex';
      showStatus('fy-status', `🚀 Started commenting on ${hashtags.length} colleges!`, 'info');

      chrome.tabs.sendMessage(tab.id, { action:'START_FY_BOT', hashtags, igId, url }, () => {
          if (chrome.runtime.lastError) {
             showStatus('fy-status', '❌ Reload Instagram tab, then try again!', 'error');
             fyStartBtn.style.display = 'flex';
             if(fyStopBtn) fyStopBtn.style.display = 'none';
          }
      });
    });
  }

  if (fyStopBtn) {
    fyStopBtn.addEventListener('click', () => {
      fyStartBtn.style.display = 'flex';
      fyStopBtn.style.display = 'none';
      showStatus('fy-status', '⏹ Stopped Final Year Bot.', 'warning');
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab) chrome.tabs.sendMessage(tab.id, { action: 'STOP_FY_BOT' }, () => {
             if (chrome.runtime.lastError) {}
        });
      });
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
