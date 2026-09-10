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

const southIndiaColleges = `JNTUH University College of Engineering, Hyderabad
University College of Engineering, Osmania University
Chaitanya Bharathi Institute of Technology
Vasavi College of Engineering
VNR Vignana Jyothi Institute of Engineering and Technology
G. Narayanamma Institute of Technology and Science
Keshav Memorial Institute of Technology
Matrusi Engineering College
Mahatma Gandhi Institute of Technology
CVR College of Engineering
Gokaraju Rangaraju Institute of Engineering and Technology
Institute of Aeronautical Engineering
Sreenidhi Institute of Science and Technology
Vignana Bharathi Institute of Technology
Vardhaman College of Engineering
B.V. Raju Institute of Technology
CMR College of Engineering and Technology
CMR Engineering College
CMR Institute of Technology
Joginpally B.R. Engineering College
Jyothishmathi Institute of Technological Sciences
Kasireddy Narayan Reddy College of Engineering & Research
KBR Engineering College
KG Reddy College of Engineering & Technology
Khader Memorial College of Engineering & Technology
Khammam Institute of Technology & Sciences
KLR College of Engineering & Technology
Kodada Institute of Technology & Science for Women
Kakatiya Institute of Technology and Science for Women
Kamala Institute of Technology & Science
Kommuri Pratap Reddy Institute of Technology
Kshatriya College of Engineering
Lords Institute of Engineering and Technology
Malla Reddy College of Engineering for Women
Malla Reddy Institute of Technology
Marri Laxman Reddy Institute of Technology and Management
Medak College of Engineering and Technology
Megha Institute of Engineering & Technology for Women
Mother Teresa Institute of Science & Technology
Madhira Institute of Technology & Sciences
Mahaveer Institute of Science & Technology
Malla Reddy College of Engineering
Malla Reddy Engineering College and Management Sciences
Malla Reddy Engineering College for Women
Malla Reddy Institute of Technology & Science
Malla Reddy Institute of Engineering and Technology
Mother Theressa College of Engineering and Technology
Nigama Engineering College
Nalla Malla Reddy Engineering College
Nalla Narasimha Reddy Education Society's Group of Institutions
Narsimha Reddy Engineering College
Nawab Shah Alam Khan College of Engineering and Technology
Pallavi Engineering College
Princeton Institute of Engineering and Technology for Women
Priyadarshini Institute of Science & Technology for Women
Samskruti College of Engineering & Technology
Sana Engineering College
Scient Institute of Technology
Shadan College of Engineering and Technology
Sphoorthy Engineering College
Sree Chaitanya College of Engineering
Sree Chaitanya Institute of Technological Sciences
Sreekavitha Engineering College
Sreyas Institute of Engineering and Technology
Sri Devi College of Engineering
SVS Group of Institutions
Swarna Bharathi Institute of Science and Technology
Sai Spurthi Institute of Technology
Shadan Women's College of Engineering & Technology
Siddhartha Institute of Engineering & Technology
Siddhartha Institute of Technology & Sciences
Sree Dattha Institute of Engineering and Science
Sree Visvesvaraya Institute of Technology & Science
Sri Chaitanya Technical Campus
Sri Indu Institute of Engineering & Technology
Sri Sai Educational Society's Group of Institutions
Sri Venkateswara Engineering College
St. Martin's Engineering College
St. Mary's Engineering College
St. Mary's Group of Institutions Hyderabad
St. Mary's Integrated Campus Hyderabad
St. Peter's Engineering College
Sumathi Reddy Institute of Technology for Women
Swami Ramananda Tirtha Institute of Science & Technology
Swami Vivekananda Institute of Technology
Teegala Krishna Reddy Engineering College
Thirumala Engineering College
TKR College of Engineering & Technology
Trinity College of Engineering & Technology, Karimnagar
Trinity College of Engineering and Technology, Peddapalli
Talla Padmavathi College of Engineering
Vaagdevi Engineering College
Vaageswari College of Engineering
Vignan Institute of Technology & Science
Vignana Bharathi Engineering College
Vignan's Institute of Management and Technology for Women
Vijaya Engineering College
Visvesvaraya College of Engineering & Technology
Vijay Rural Engineering College
Vivekananda Institute of Technology & Science
Tudi Ram Reddy Institute of Technology & Sciences
AAR Mahaveer Engineering College
A C E Engineering College
Annamacharya Institute of Technology and Science
Abdulkalam Institute of Technology and Science
Anurag Engineering College
Anurag University
Arjun College of Technology and Science
Avanthi Scientific Tech and Research Academy
Aurora Scientific and Technical Research Academy
Auroras Scientific and Technological Institute
Ramappa Engineering College
Aurora's Technological and Management Academy
Avanthi Institute of Engineering and Technology
AVN Institute of Engineering Technology
Bharat Institute of Engineering and Technology
Balaji Institute of Technology and Science
Bomma Institute of Technology and Science
Anu Bose Institute of Technology for Women
Bhoj Reddy Engineering College for Women
Brilliant Grammar School Educational Society Group of Institutions
Brilliant Institute of Engineering and Technology
B V Raju Institute of Technology
BVRIT College of Engineering for Women
Sree Chaitanya College of Engineering
Sree Chaitanya Institute of Technology and Sciences
CMR Technical Campus
C M R College of Engineering and Technology
CMR Institute of Technology
CMR Engineering College
CVR College of Engineering
D R K Institute of Science and Technology
Ellenki College of Engineering and Technology
Earth Sciences University of Telangana
GATE Institute of Technology and Sciences
Geetanjali College of Engineering and Technology
Global Institute of Engineering and Technology
Gokaraju Lailavathi Engineering College
Gurunanak Institute of Technology
G Narayanamma Institute of Technology and Science
Gokaraju Rangaraju Institute of Engineering and Technology
Guru Nanak Institutions Technical Campus
Institute of Aeronautical Engineering
Indur Institute of Engineering and Technology
Sri Indu Institute of Engineering and Technology
Jayamukhi Institute of Technology and Sciences
J B Institute of Engineering and Technology
Jyothishmathi Institute of Technology and Science
JNTUH University College of Engineering, Rajanna Sircilla
JNTUH University College of Engineering, Sultanpur
JNTUH University College of Engineering, Manthani
Kakatiya Institute of Technology and Science
Keshav Memorial College of Engineering
Kommuri Pratap Reddy Institute of Technology
Keshav Memorial Institute of Technology
KPR Institute of Engineering and Technology
Malla Reddy College of Engineering
Malla Reddy Engineering College
Malla Reddy Engineering College and Management Sciences
Malla Reddy College of Engineering for Women
Malla Reddy Institute of Technology
Marri Laxman Reddy Institute of Technology and Management
Matrusri Engineering College
Methodist College of Engineering and Technology
Megha Institute of Engineering and Technology for Women
Mahatma Gandhi Institute of Technology
Muffakham Jah College of Engineering and Technology
Neil Gogte Institute of Technology
Nalla Narasimha Reddy Education Society's Group of Institutions
Nalla Malla Reddy Engineering College
Princeton Institute of Engineering and Technology for Women
Princeton Institute of Engineering and Technology
Rishi MS Institute of Engineering and Technology for Women
Swarna Bharathi Institute of Science and Technology
Scient Institute of Technology
Sreenidhi Institute of Science and Technology
Sreyas Institute of Engineering and Technology
Sphoorthy Engineering College
St. Martin's Engineering College
Sri Venkateswara Engineering College
TKR College of Engineering and Technology
Trinity College of Engineering and Technology
Tudi Ram Reddy Institute of Technology and Sciences
Vignana Bharathi Institute of Technology
Vignan Institute of Technology and Science
Vignan's Institute of Management and Technology for Women
Vijaya Engineering College
Vardhaman College of Engineering
Vignan Institute of Technology and Aeronautical Engineering
Vijay Rural Engineering College
WITS College of Engineering
Anurag University / Anurag College of Engineering
Aditya College of Engineering and Technology
Aditya College of Engineering
Adarsh College of Engineering
Anil Neerukonda Institute of Technology and Sciences
Andhra University College of Engineering
Aditya Engineering College
Aditya Institute of Technology and Management
Akshara Institute of Technology and Management
Amrita Sai Institute of Science and Technology
Annamacharya Institute of Technology and Sciences
Anu College of Engineering
Andhra Loyola Institute of Engineering and Technology
Avanthi Institute of Engineering and Technology
Bapatla Engineering College
Bonam Venkata Chalamayya Engineering College
BVC Institute of Technology and Science
Chaitanya Engineering College
Chaitanya Institute of Technology and Science
DNR College of Engineering and Technology
Dhanekula Institute of Engineering and Technology
GMR Institute of Technology
G Pullaiah College of Engineering and Technology
Gayatri Vidya Parishad College of Engineering
Gayatri Vidya Parishad College of Engineering for Women
JNTUK University College of Engineering, Kakinada
JNTUA College of Engineering, Anantapur
JNTUA College of Engineering, Kalikiri
JNTUA College of Engineering, Pulivendula
K L University
Kakinada Institute of Technology and Science
Lakireddy Bali Reddy College of Engineering
Madanapalle Institute of Technology and Science
Maharaj Vijayaram Gajapathi Raj College of Engineering
Narasaraopeta Engineering College
NBKR Institute of Science and Technology
Narayana Engineering College
R.V.R. & J.C. College of Engineering
Rajiv Gandhi University of Knowledge Technologies
Rajeev Gandhi Memorial College of Engineering and Technology
RSR Engineering College
Sri Venkateswara College of Engineering and Technology
Sree Vidyanikethan Engineering College
Sri Venkateswara University College of Engineering
VIT-AP University
Velagapudi Ramakrishna Siddhartha Engineering College
Vemu Institute of Technology
Chalapathi Institute of Engineering and Technology
Chalapathi Institute of Technology
Chirala Engineering College
Chiranjeevi Reddy Institute of Engineering and Technology
College of Agricultural Engineering
College of Food Science and Technology
D.M.S.S.V.H. College of Engineering
Dadi Institute of Engineering and Technology
Damisetty Bala Suresh Institute of Technology
Dr. L. Bullayya College of Engineering
Dr. Paul Raj's Engineering College
Dr. Samuel George Institute of Engineering and Technology
Dr. K.V. Subba Reddy Institute of Technology
Dr. YSR Architecture and Fine Arts University
DVR & Dr. H.S. MIC College of Technology
Eluru College of Engineering and Technology
Eswar College of Engineering
G P R Engineering College
G.V.P. College for Degree and PG Courses
G.V.R. & S. College of Engineering and Technology
G.D.M.M. College of Engineering and Technology
GATES Institute of Technology
Geethanjali Institute of Science and Technology
Godavari Global University
GIET Engineering College
Godavari Institute of Engineering and Technology
Gokul Group of Institutions
Gokula Krishna College of Engineering
Golden Valley Integrated Campus
Gonna Institute of Information Technology Sciences
Gouthami Institute of Technology and Management for Women
Guntur Engineering College
Helapuri Institute of Technology and Science
Hindu College of Engineering and Technology
Ideal Institute of Technology
Indira Institute of Technology Sciences
International School of Technology and Science for Women
JNTUK College of Engineering, Narsaraopeta
JNTUK College of Engineering, Vizianagaram
K S R M College of Engineering
Kakinada Institute of Engineering and Technology for Women
Kakinada Institute of Engineering and Technology
Kakinada Institute of Technology Sciences
Kallam Haranadh Reddy Institute of Technology
Kandula Lakshumma Memorial College of Engineering for Women
Kandula Obul Reddy Memorial College of Engineering
KITS Akshar Institute of Technology
KKR and KSR Institute of Technology and Science
KMM Institute of Technology and Science
Krishna Chaitanya Institute of Technology and Sciences
Krishnaveni Engineering College for Women
Kuppam Engineering College
Lendi Institute of Engineering and Technology
Lenora College of Engineering
Lingayas Institute of Management and Technology
Loyola Institute of Technology and Management
M V G R College of Engineering
M.V.R. College of Engineering and Technology
Malineni Lakshmaiah Women's Engineering College
Malineni Suseelamma Women's Engineering College
M A M Women's Engineering College
Mandava Institute of Engineering and Technology
Mohan Babu University
Miracle Educational Society Group of Institutions
MJR College of Engineering and Technology
Mother Theresa Institute of Engineering and Technology
N S Raju Institute of Engineering and Technology
N.V.R. College of Engineering Technology
Nadimpalli Satyanarayana Raju Institute of Technology
Narayanadri Institute of Science and Technology
Newton Institute of Engineering
Newton's Institute of Science and Technology
Nimra College of Engineering and Technology
NRI Institute of Technology
P.B.R. Visvodaya Institute of Technology and Science
P.V.K.K. Institute of Technology
PACE Institute of Technology and Sciences
Paladugu Parvathi Devi College of Engineering and Technology
Potti Sriramulu College of Engineering and Technology
Pragati Engineering College
Prakasam Engineering College
Prasad V. Potluri Siddhartha Institute of Technology
Priyadarshini College of Engineering and Technology
Priyadarshini Institute of Technology and Management
Priyadarshini Institute of Technology
Priyadarshini Institute of Technology and Sciences for Women
Pydah College of Engineering
QIS College of Engineering and Technology
QUBA College of Engineering and Technology
R V Institute of Technology
R.K. College of Engineering
Ramachandra College of Engineering
Raghu Engineering College
Rajamahendri Institute of Engineering and Technology
Ramireddy Subba Ramireddy Engineering College
Ravindra College of Engineering for Women
RISE Krishna Sai Gandhi Group of Institutions
RISE Krishna Sai Prakasam Group of Institutions
S.R.K. Institute of Technology
S.R.K.R. Engineering College
SRM University AP
Sai Ganapathi Engineering College
Sai Rajeshwari Institute of Technology
Sai Tirumala N.V.R. Engineering College
Sankethika Vidya Parishad Engineering College
SANSKRITHI SCHOOL OF ENGINEERING
SANTHIRAM ENGINEERING COLLEGE
SASI INSTITUTE OF TECHNOLOGY AND ENGINEERING
SATYA INSTITUTE OF TECHNOLOGY AND MANAGEMENT
SESHADRI RAO GUDLAVALLERU ENGINEERING COLLEGE
SRI HARSHINI COLLEGE OF ENGINEERING AND TECHNOLOGY FOR WOMEN
SHRI VISHNU ENGINEERING COLLEGE FOR WOMEN
SIDDARTHA EDUCATIONAL ACADEMY GROUP OF INSTITUTIONS
SIDDHARTH INSTITUTE OF ENGINEERING AND TECHNOLOGY
SIDDHARTHA INSTITUTE OF SCIENCE AND TECHNOLOGY
SIMHADRI EDUCATIONAL SOCIETY GROUP OF INSTITUTIONS
SIR C R R COLLEGE OF ENGINEERING
SIR C.V. RAMAN INSTITUTE OF TECHNOLOGY AND SCIENCES
SRI NALANDA INSTITUTE OF ENGINEERING AND TECHNOLOGY
S R VENKATESWARA COLLEGE OF ENGINEERING
SREE RAMA ENGINEERING COLLEGE
SREE VAHINI INSTITUTE OF SCIENCE AND TECHNOLOGY
SREE VENKATESWARA COLLEGE OF ENGINEERING
SREE VENKATESWARA COLLEGE OF SCIENCE AND TECHNOLOGY
SREE VENKATESWARA ENGINEERING COLLEGE
SRI ANNAMACHARYA INSTITUTE OF TECHNOLOGY AND SCIENCE
SRI CHAITANYA-DJR COLLEGE OF ENGINEERING AND TECHNOLOGY
SRI MITTAPALLI COLLEGE OF ENGINEERING
SRI MITTAPALLI INSTITUTE OF TECHNOLOGY FOR WOMEN
SRI SAI INSTITUTE OF TECHNOLOGY AND SCIENCE
SRI SARATHI INSTITUTE OF ENGINEERING AND TECHNOLOGY
SRI SIVANI COLLEGE OF ENGINEERING
SRI SUNFLOWER COLLEGE OF ENGINEERING AND TECHNOLOGY
SRI VASAVI ENGINEERING COLLEGE
SRI VASAVI INSTITUTE OF ENGINEERING AND TECHNOLOGY
SRI VENKATESA PERUMAL COLLEGE OF ENGINEERING AND TECHNOLOGY
SRI VENKATESWARA INSTITUTE OF TECHNOLOGY
SRI VENKATESWARA INSTITUTE OF SCIENCE AND TECHNOLOGY
SRINIVASA INSTITUTE OF ENGINEERING AND TECHNOLOGY
SRINIVASA INSTITUTE OF TECHNOLOGY AND SCIENCE
SRINIVASA INSTITUTE OF TECHNOLOGY AND MANAGEMENT STUDIES
SRINIVASA RAMANUJAN INSTITUTE OF TECHNOLOGY
ST. ANNS COLLEGE OF ENGINEERING AND TECHNOLOGY
ST. JOHNS COLLEGE OF ENGINEERING AND TECHNOLOGY
ST. MARY'S GROUP OF INSTITUTIONS GUNTUR FOR WOMEN
ST. MARY'S WOMEN'S ENGINEERING COLLEGE
S.V. COLLEGE OF ENGINEERING`;
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

  // Populate South India colleges textarea
  const siTextArea = document.getElementById('si-colleges-list');
  if (siTextArea && !siTextArea.value) {
    siTextArea.value = southIndiaColleges;
  }

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
  chrome.storage.local.get(['apiKey','companyName','companyTagline','websiteUrl','backendUrl', 'gnFySettings', 'gnFyBotState'], data => {
    if (data.apiKey)        { const el = document.getElementById('apiKey');        if(el) el.value = data.apiKey; }
    if (data.companyName)   { const el = document.getElementById('companyName');   if(el) el.value = data.companyName; }
    if (data.companyTagline){ const el = document.getElementById('companyTagline');if(el) el.value = data.companyTagline; }
    if (data.websiteUrl)    { const el = document.getElementById('websiteUrl');    if(el) el.value = data.websiteUrl; }
    if (data.backendUrl)    { const el = document.getElementById('backendUrl');    if(el) el.value = data.backendUrl; }
    
    if (data.gnFySettings) {
      if (document.getElementById('fy-ig-id')) document.getElementById('fy-ig-id').value = data.gnFySettings.igId || '';
      if (document.getElementById('fy-url')) document.getElementById('fy-url').value = data.gnFySettings.url || '';
      
      let savedHashtags = data.gnFySettings.hashtags || defaultColleges;
      if (savedHashtags && savedHashtags.includes(',') && !savedHashtags.includes('\n')) {
        savedHashtags = savedHashtags.split(',').map(s => s.trim()).filter(Boolean).join('\n');
      }
      if (!savedHashtags.includes("JNTUH University College of Engineering, Hyderabad")) {
        savedHashtags += '\n' + southIndiaColleges;
      }
      if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = savedHashtags;
    } else {
      if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = (defaultColleges + '\n' + southIndiaColleges);
    }
    if (data.gnFyBotState && data.gnFyBotState.pendingHashtags && data.gnFyBotState.pendingHashtags.length > 0) {
      if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = data.gnFyBotState.pendingHashtags.join('\n');
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
      
      const hashtags = hashtagsRaw.split(/[\n,]+/).map(h => h.trim()).filter(Boolean);
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
  let redditSelectedSpeed = 800;
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
