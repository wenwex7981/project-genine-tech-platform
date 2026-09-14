// ══════════════════════════════════════════════════════
// GraduateNex Insta Suite — popup.js v4.1 (TS & AP Filtered)
// ══════════════════════════════════════════════════════

const telanganaColleges = `1 | JNTH | JNTUH University College of Engineering, Hyderabad
2 | OUCE | University College of Engineering, Osmania University
3 | CBIT | Chaitanya Bharathi Institute of Technology
4 | VASV | Vasavi College of Engineering
5 | VJEC | VNR Vignana Jyothi Institute of Engineering and Technology
6 | GNTW | G. Narayanamma Institute of Technology and Science
7 | KMIT | Keshav Memorial Institute of Technology
8 | MECS | Matrusri Engineering College
9 | MGIT | Mahatma Gandhi Institute of Technology
10 | CVRH | CVR College of Engineering
11 | GRRR | Gokaraju Rangaraju Institute of Engineering and Technology
12 | IARE | Institute of Aeronautical Engineering
13 | SNIS | Sreenidhi Institute of Science and Technology
14 | VBIT | Vignana Bharathi Institute of Technology
15 | VGNT | Vardhaman College of Engineering
16 | BVRI | B.V. Raju Institute of Technology
17 | BVRW | BVRIT Hyderabad College of Engineering for Women
18 | CMRK | CMR College of Engineering and Technology
19 | CMRN | CMR Engineering College
20 | CMRM | CMR Institute of Technology
21 | CMRG | CMR Technical Campus
22 | KMEC | Kommuri Pratap Reddy Institute of Technology
23 | D4 | Sri Indu College of Engineering and Technology
24 | K8 | St. Martin's Engineering College
25 | BK | St. Peter's Engineering College
26 | K9 | TKR College of Engineering & Technology
27 | 64 | Vaagdevi College of Engineering
28 | 91 | Vidya Jyothi Institute of Technology
29 | 8P | AAR Mahaveer Engineering College
30 | EK | Abdul Kalam Institute of Technological Sciences
31 | T8 | Annamacharya Institute of Technology & Sciences
32 | PP | AnuBose Institute of Technology
33 | PQ | Anurag College of Engineering
34 | W8 | Arjun College of Technology & Sciences
35 | 5T | Ashoka Institute of Engineering & Technology
36 | U7 | Aurora's Technological Institute
37 | 9K | Aurora's Technological & Management Academy
38 | 62 | Aurora's Engineering College
39 | M9 | Aurora's Scientific and Technological Institute
40 | D9 | Aurora's Scientific, Technological and Research Academy
41 | 84 | Aurora's Technological and Research Institute
42 | Q6 | Avanthi Institute of Engineering & Technology
43 | PT | Avanthi's Scientific Technological & Research Academy
44 | 5U | AVN Institute of Engineering and Technology
45 | Q8 | Azad College of Engineering and Technology
46 | C3 | Balaji Institute of Technology & Science
47 | M1 | Bandari Srinivas Institute of Technology
48 | J2 | Joginpally B.R. Engineering College
49 | QK | Jyothishmathi Institute of Technological Sciences
50 | 5D | Kasireddy Narayan Reddy College of Engineering & Research
51 | QN | KBR Engineering College
52 | QM | KG Reddy College of Engineering & Technology
53 | J3 | Khader Memorial College of Engineering & Technology
54 | QP | Khammam Institute of Technology & Sciences
55 | QT | KLR College of Engineering & Technology
56 | QU | Kodada Institute of Technology & Science for Women
57 | 6B | Kakatiya Institute of Technology and Science for Women
58 | 28 | Kamala Institute of Technology & Science
59 | B4 | Kshatriya College of Engineering
60 | M2 | Lords Institute of Engineering and Technology
61 | RG | Malla Reddy College of Engineering for Women
62 | RJ | Malla Reddy Institute of Technology
63 | 7Y | Marri Laxman Reddy Institute of Technology and Management
64 | J6 | Medak College of Engineering and Technology
65 | RP | Megha Institute of Engineering & Technology for Women
66 | C6 | Mother Teresa Institute of Science & Technology
67 | G7 | Madhira Institute of Technology & Sciences
68 | E3 | Mahaveer Institute of Science & Technology
69 | Q9 | Malla Reddy College of Engineering
70 | UJ | Malla Reddy Engineering College and Management Sciences
71 | RH | Malla Reddy Engineering College for Women
72 | S1 | Malla Reddy Institute of Technology & Science
73 | W9 | Malla Reddy Institute of Engineering and Technology
74 | 86 | Mother Theressa College of Engineering and Technology
75 | TD | Nigama Engineering College
76 | B6 | Nalla Malla Reddy Engineering College
77 | 7Z | Nalla Narasimha Reddy Education Society's Group of Institutions
78 | X0 | Narsimha Reddy Engineering College
79 | RT | Nawab Shah Alam Khan College of Engineering and Technology
80 | 6F | Pallavi Engineering College
81 | 6M | Princeton Institute of Engineering and Technology for Women
82 | 6C | Priyadarshini Institute of Science & Technology for Women
83 | U1 | Samskruti College of Engineering & Technology
84 | M8 | Sana Engineering College
85 | C0 | Scient Institute of Technology
86 | 08 | Shadan College of Engineering and Technology
87 | N8 | Sphoorthy Engineering College
88 | N0 | Sree Chaitanya College of Engineering
89 | TR | Sree Chaitanya Institute of Technological Sciences
90 | C8 | Sreekavitha Engineering College
91 | VE | Sreyas Institute of Engineering and Technology
92 | D2 | Sri Devi College of Engineering
93 | TK | SVS Group of Institutions
94 | M6 | Swarna Bharathi Institute of Science and Technology
95 | C5 | Sai Spurthi Institute of Technology
96 | L5 | Shadan Women's College of Engineering & Technology
97 | TP | Siddhartha Institute of Engineering & Technology
98 | TQ | Siddhartha Institute of Technology & Sciences
99 | E4 | Sree Dattha Institute of Engineering and Science
100 | 57 | Sree Visvesvaraya Institute of Technology & Science
101 | 8A | Sri Chaitanya Technical Campus
102 | X3 | Sri Indu Institute of Engineering & Technology
103 | 8B | Sri Sai Educational Society's Group of Institutions
104 | 63 | Sri Venkateswara Engineering College
105 | BH | St. Mary's Engineering College
106 | D0 | St. Mary's Group of Institutions Hyderabad
107 | 7W | St. Mary's Integrated Campus Hyderabad
108 | 6Y | Sumathi Reddy Institute of Technology for Women
109 | 14 | Swami Ramananda Tirtha Institute of Science & Technology
110 | P7 | Swami Vivekananda Institute of Technology
111 | R9 | Teegala Krishna Reddy Engineering College
112 | C2 | Thirumala Engineering College
113 | UE | Trinity College of Engineering & Technology, Karimnagar
114 | UD | Trinity College of Engineering and Technology, Peddapalli
115 | UC | Talla Padmavathi College of Engineering
116 | UK | Vaagdevi Engineering College
117 | S4 | Vaageswari College of Engineering
118 | 89 | Vignan Institute of Technology & Science
119 | P8 | Vignana Bharathi Engineering College
120 | UP | Vignan's Institute of Management and Technology for Women
121 | BR | Vijaya Engineering College
122 | BT | Visvesvaraya College of Engineering & Technology
123 | 29 | Vijay Rural Engineering College
124 | N6 | Vivekananda Institute of Technology & Science
125 | UG | Tudi Ram Reddy Institute of Technology & Sciences
126 | ACEG | A C E Engineering College
127 | ANRK | Anurag Engineering College
128 | ANUG | Anurag University
129 | BOSE | Anu Bose Institute of Technology for Women
130 | BREW | Bhoj Reddy Engineering College for Women
131 | BRIG | Brilliant Grammar School Educational Society Group of Institutions
132 | BRIL | Brilliant Institute of Engineering and Technology
133 | DRKI | D R K Institute of Science and Technology
134 | ELEN | Ellenki College of Engineering and Technology
135 | ESUT | Earth Sciences University of Telangana
136 | GATE | GATE Institute of Technology and Sciences
137 | GCTC | Geetanjali College of Engineering and Technology
138 | GLOB | Global Institute of Engineering and Technology
139 | GLWC | Gokaraju Lailavathi Engineering College
140 | GNIT | Gurunanak Institute of Technology
141 | GURU | Guru Nanak Institutions Technical Campus
142 | IITT | Indur Institute of Engineering and Technology
143 | JAYA | Jayamukhi Institute of Technology and Sciences
144 | JBIT | J B Institute of Engineering and Technology
145 | JMTS | Jyothishmathi Institute of Technology and Science
146 | JNTR | JNTUH University College of Engineering, Rajanna Sircilla
147 | JNTS | JNTUH University College of Engineering, Sultanpur
148 | JNTHMT | JNTUH University College of Engineering, Manthani
149 | KITS | Kakatiya Institute of Technology and Science
150 | KMCE | Keshav Memorial College of Engineering
151 | MREC | Malla Reddy Engineering College
152 | NGIT | Neil Gogte Institute of Technology
153 | PRTW | Princeton Institute of Engineering and Technology
154 | RCEE | Rishi MS Institute of Engineering and Technology for Women
155 | WITS | WITS College of Engineering`;

const andhraPradeshColleges = `1 | AUCE | Andhra University College of Engineering, Visakhapatnam
2 | JNUK | JNTUK University College of Engineering, Kakinada
3 | JNUA | JNTUA College of Engineering, Anantapur
4 | JNUP | JNTUA College of Engineering, Pulivendula
5 | JNLK | JNTUA College of Engineering, Kalikiri
6 | JNUN | JNTUK College of Engineering, Narasaraopeta
7 | JNVZ | JNTUK College of Engineering, Vizianagaram
8 | SVUC | Sri Venkateswara University College of Engineering, Tirupati
9 | KLEF | KL University, Vaddeswaram
10 | VITP | VIT-AP University, Amaravati
11 | SRMA | SRM University AP, Amaravati
12 | GVPW | Gayatri Vidya Parishad College of Engineering, Visakhapatnam
13 | GVPE | Gayatri Vidya Parishad College of Engineering for Women
14 | VRSE | Velagapudi Ramakrishna Siddhartha Engineering College
15 | PVPS | Prasad V. Potluri Siddhartha Institute of Technology
16 | RVRJ | R.V.R. & J.C. College of Engineering, Guntur
17 | GMRT | GMR Institute of Technology, Rajam
18 | GPRC | G. Pulla Reddy Engineering College, Kurnool
19 | GPET | G. Pullaiah College of Engineering and Technology, Kurnool
20 | SVEC | Sree Vidyanikethan Engineering College / Mohan Babu University
21 | MITS | Madanapalle Institute of Technology and Science
22 | MVGR | Maharaj Vijayaram Gajapathi Raj College of Engineering
23 | ANIT | Anil Neerukonda Institute of Technology and Sciences
24 | BPEC | Bapatla Engineering College
25 | LBRC | Lakireddy Bali Reddy College of Engineering, Mylavaram
26 | SRGE | Seshadri Rao Gudlavalleru Engineering College
27 | VVIT | Vasireddy Venkatadri Institute of Technology, Guntur
28 | ADTP | Aditya Engineering College, Surampalem
29 | ACET | Aditya College of Engineering and Technology
30 | ADCE | Aditya College of Engineering
31 | AITM | Aditya Institute of Technology and Management, Tekkali
32 | ADRS | Adarsh College of Engineering, Chebrolu
33 | AKSR | Akshara Institute of Technology and Management
34 | AMRN | Amrita Sai Institute of Science and Technology
35 | AITS | Annamacharya Institute of Technology and Sciences, Rajampet
36 | ANUC | Anu College of Engineering, Guntur
37 | ALIE | Andhra Loyola Institute of Engineering and Technology
38 | AVIT | Avanthi Institute of Engineering and Technology, Vizag
39 | BVCE | Bonam Venkata Chalamayya Engineering College
40 | BVCI | BVC Institute of Technology and Science, Amalapuram
41 | CHAI | Chaitanya Engineering College, Visakhapatnam
42 | CIST | Chaitanya Institute of Technology and Science
43 | DNRE | DNR College of Engineering and Technology, Bhimavaram
44 | DIET | Dhanekula Institute of Engineering and Technology
45 | KITE | Kakinada Institute of Technology and Science, Divili
46 | NRSO | Narasaraopeta Engineering College
47 | NBKR | NBKR Institute of Science and Technology, Vidyanagar
48 | NREN | Narayana Engineering College, Nellore
49 | NREG | Narayana Engineering College, Gudur
50 | RGUK | Rajiv Gandhi University of Knowledge Technologies, RK Valley / Nuzvid
51 | RGMC | Rajeev Gandhi Memorial College of Engineering and Technology, Nandyal
52 | RSRE | RSR Engineering College, Kadanuthala
53 | SVCT | Sri Venkateswara College of Engineering and Technology, Chittoor
54 | VEMU | Vemu Institute of Technology, Palamaner
55 | CIET | Chalapathi Institute of Engineering and Technology, Guntur
56 | CIPT | Chalapathi Institute of Technology, Mothadaka
57 | CHIR | Chirala Engineering College
58 | CRET | Chiranjeevi Reddy Institute of Engineering and Technology
59 | AGRI | College of Agricultural Engineering, Bapatla
60 | FOOD | College of Food Science and Technology, Bapatla
61 | DMSS | D.M.S.S.V.H. College of Engineering, Machilipatnam
62 | DADI | Dadi Institute of Engineering and Technology, Anakapalle
63 | DBST | Damisetty Bala Suresh Institute of Technology
64 | BLAY | Dr. L. Bullayya College of Engineering, Visakhapatnam
65 | PAUL | Dr. Paul Raj's Engineering College
66 | DSGM | Dr. Samuel George Institute of Engineering and Technology
67 | KVSR | Dr. K.V. Subba Reddy Institute of Technology, Kurnool
68 | YSRA | Dr. YSR Architecture and Fine Arts University, Kadapa
69 | MICH | DVR & Dr. H.S. MIC College of Technology, Kanchikacherla
70 | ELUR | Eluru College of Engineering and Technology
71 | ESWR | Eswar College of Engineering, Narasaraopet
72 | GPRR | G P R Engineering College
73 | GVPD | G.V.P. College for Degree and PG Courses, Visakhapatnam
74 | GVRS | G.V.R. & S. College of Engineering and Technology, Guntur
75 | GDMM | G.D.M.M. College of Engineering and Technology, Nandigama
76 | GATE | GATES Institute of Technology, Gooty
77 | GIST | Geethanjali Institute of Science and Technology, Nellore
78 | GGUN | Godavari Global University / GIET Engineering College
79 | GIET | Godavari Institute of Engineering and Technology, Rajahmundry
80 | GOKL | Gokul Group of Institutions, Bobbili
81 | GKCS | Gokula Krishna College of Engineering, Sullurpeta
82 | GVIC | Golden Valley Integrated Campus, Madanapalle
83 | GIIT | Gonna Institute of Information Technology Sciences, Vizag
84 | GOUT | Gouthami Institute of Technology and Management for Women
85 | GNTR | Guntur Engineering College
86 | HELA | Helapuri Institute of Technology and Science, Eluru
87 | HIND | Hindu College of Engineering and Technology, Guntur
88 | IDEL | Ideal Institute of Technology, Kakinada
89 | INDR | Indira Institute of Technology Sciences, Markapur
90 | ISTS | International School of Technology and Science for Women
91 | KSRM | K S R M College of Engineering, Kadapa
92 | KIET | Kakinada Institute of Engineering and Technology
93 | KIEW | Kakinada Institute of Engineering and Technology for Women
94 | KITS | Kakinada Institute of Technology Sciences
95 | KHIT | Kallam Haranadh Reddy Institute of Technology, Guntur
96 | KLMW | Kandula Lakshumma Memorial College of Engineering for Women
97 | KORM | Kandula Obul Reddy Memorial College of Engineering
98 | KMMT | KMM Institute of Technology and Science, Tirupati
99 | KCIT | Krishna Chaitanya Institute of Technology and Sciences, Markapur
100 | KVEW | Krishnaveni Engineering College for Women, Narasaraopet
101 | KUPM | Kuppam Engineering College
102 | LEND | Lendi Institute of Engineering and Technology, Vizianagaram
103 | LENR | Lenora College of Engineering, Rampachodavaram
104 | LIMT | Lingayas Institute of Management and Technology, Madhira
105 | LITM | Loyola Institute of Technology and Management, Guntur
106 | MVRT | M.V.R. College of Engineering and Technology, Paritala
107 | MLEW | Malineni Lakshmaiah Women's Engineering College, Guntur
108 | MLSE | Malineni Suseelamma Women's Engineering College
109 | MAMW | M A M Women's Engineering College, Narasaraopet
110 | MIET | Mandava Institute of Engineering and Technology
111 | MIRC | Miracle Educational Society Group of Institutions, Vizianagaram
112 | MJRC | MJR College of Engineering and Technology, Pileru
113 | MTEC | Mother Theresa Institute of Engineering and Technology, Palamaner
114 | NSRJ | N S Raju Institute of Engineering and Technology, Vizag
115 | NVRT | N.V.R. College of Engineering Technology, Tenali
116 | NSRT | Nadimpalli Satyanarayana Raju Institute of Technology
117 | NIST | Narayanadri Institute of Science and Technology, Rajampet
118 | NEWT | Newton Institute of Engineering, Macherla
119 | NMRA | Nimra College of Engineering and Technology, Ibrahimpatnam
120 | NRIT | NRI Institute of Technology, Agiripalli
121 | PBRV | P.B.R. Visvodaya Institute of Technology and Science, Kavali
122 | PVKK | P.V.K.K. Institute of Technology, Anantapur
123 | PACE | PACE Institute of Technology and Sciences, Ongole
124 | PPDC | Paladugu Parvathi Devi College of Engineering and Technology
125 | PSCM | Potti Sriramulu Chalavadi Mallikarjuna Rao College of Engineering and Technology
126 | PRAG | Pragati Engineering College, Surampalem
127 | PRAK | Prakasam Engineering College, Kandukur
128 | PRYT | Priyadarshini College of Engineering and Technology, Nellore
129 | PITM | Priyadarshini Institute of Technology and Management, Guntur
130 | PYDI | Pydah College of Engineering, Kakinada
131 | QISC | QIS College of Engineering and Technology, Ongole
132 | QUBA | QUBA College of Engineering and Technology, Nellore
133 | RVIT | R V Institute of Technology, Guntur
134 | RKCE | R.K. College of Engineering, Vijayawada
135 | RCEL | Ramachandra College of Engineering, Eluru
136 | RAGU | Raghu Engineering College, Visakhapatnam
137 | RJMT | Rajamahendri Institute of Engineering and Technology
138 | RSRM | Ramireddy Subba Ramireddy Engineering College
139 | RCEW | Ravindra College of Engineering for Women, Kurnool
140 | RSKG | RISE Krishna Sai Gandhi Group of Institutions, Ongole
141 | RSKP | RISE Krishna Sai Prakasam Group of Institutions, Ongole
142 | SRKT | S.R.K. Institute of Technology, Vijayawada
143 | SRKR | S.R.K.R. Engineering College, Bhimavaram
144 | SGEC | Sai Ganapathi Engineering College, Vizag
145 | SRIT | Sai Rajeshwari Institute of Technology, Proddatur
146 | STRN | Sai Tirumala N.V.R. Engineering College, Narasaraopet
147 | SVPE | Sankethika Vidya Parishad Engineering College, Vizag
148 | SSSE | Sanskrithi School of Engineering, Puttaparthi
149 | SNTN | Santhiram Engineering College, Nandyal
150 | SASI | Sasi Institute of Technology and Engineering, Tadepalligudem
151 | SATY | Satya Institute of Technology and Management, Vizianagaram
152 | SVEC | Shri Vishnu Engineering College for Women, Bhimavaram
153 | SIDA | Siddartha Educational Academy Group of Institutions, Tirupati
154 | SIDT | Siddharth Institute of Engineering and Technology, Puttur
155 | SIST | Siddhartha Institute of Science and Technology, Puttur
156 | SIMH | Simhadri Educational Society Group of Institutions, Anakapalle
157 | SCRR | Sir C R R College of Engineering, Eluru
158 | SCVR | Sir C.V. Raman Institute of Technology and Sciences, Tadipatri
159 | SREM | Sree Rama Engineering College, Tirupati
160 | SVAH | Sree Vahini Institute of Science and Technology, Tiruvuru
161 | SVCE | Sree Venkateswara College of Engineering, Nellore
162 | SMPL | Sri Mittapalli College of Engineering, Guntur
163 | SMPW | Sri Mittapalli Institute of Technology for Women, Guntur
164 | SIVA | Sri Sivani College of Engineering, Srikakulam
165 | SVAS | Sri Vasavi Engineering College, Tadepalligudem
166 | SVIT | Sri Venkateswara Institute of Technology, Anantapur
167 | SRIN | Srinivasa Institute of Engineering and Technology, Cheyyeru
168 | SITM | Srinivasa Institute of Technology and Management Studies, Chittoor
169 | SRIT | Srinivasa Ramanujan Institute of Technology, Anantapur
170 | STAN | St. Ann's College of Engineering and Technology, Chirala
171 | STJN | St. Johns College of Engineering and Technology, Yemmiganur
172 | SVCT | S.V. College of Engineering, Tirupati`;

const allSouthIndiaColleges = telanganaColleges + '\n' + andhraPradeshColleges;
const defaultColleges = telanganaColleges;

// ─────────────────────────────────────────────────────
// GLOBAL STATE VARIABLES
// ─────────────────────────────────────────────────────
let selectedTopics = new Set([
  'ai','job','fresher','student','final year','resume',
  'ats','career','roadmap','dsa','interview','placement',
  'project','college','internship'
]);
let selectedSpeed = 1500;
let commenterRunning = false;
let commentedCount = 0;
let skippedCount = 0;

let selectedTvSpeed = 2500;

// GLOBAL BOT CONFIG
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

// REDDIT BOT CONFIG
let redditRunning = false;
let redditCommented = 0;
let redditSkipped = 0;
let redditSelectedSpeed = 800;
let redditSelectedStyle = 'soft';

// ─────────────────────────────────────────────────────
// COLLEGE TARGET URL RESOLVER (Maps 327+ TS & AP Colleges)
// ─────────────────────────────────────────────────────
function getCollegeTargetUrl(collegeName) {
  let clean = (collegeName || '').trim();
  if (!clean) return 'https://www.instagram.com/explore/';

  if (clean.startsWith('@')) {
    const handle = clean.substring(1).trim();
    return `https://www.instagram.com/${handle}/`;
  }
  if (clean.startsWith('#')) {
    const tag = clean.substring(1).trim();
    return `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;
  }

  // Parse piped format e.g. "1 | JNTH | JNTUH University College of Engineering..."
  let extractedCode = '';
  if (clean.includes('|')) {
    const parts = clean.split('|').map(p => p.trim());
    if (parts.length >= 3) {
      extractedCode = parts[1].toLowerCase();
      clean = parts[2];
    } else if (parts.length === 2) {
      extractedCode = parts[0].toLowerCase();
      clean = parts[1];
    }
  }

  const lower = clean.toLowerCase();

  // TS EAMCET & AP EAMCET Code Direct Hashtag Map (327+ Colleges)
  const CODE_TAG_MAP = {
    // Telangana Codes
    'jnth': 'jntuh', 'ouce': 'osmaniauniversity', 'cbit': 'cbithyderabad', 'vasv': 'vasavicollegeofengineering',
    'vjec': 'vnrvjiet', '07': 'vnrvjiet', 'gntw': 'gnits', 'kmit': 'kmit', 'bd': 'kmit', 'mecs': 'matrusri',
    'mgit': 'mgithyderabad', '26': 'mgithyderabad', 'cvrh': 'cvrce', 'cvsr': 'cvrce', 'grrr': 'griet',
    'iare': 'iare', 'snis': 'snist', '31': 'snist', 'vbit': 'vbit', 'p6': 'vbit', 'vgnt': 'vardhaman',
    'vmeg': 'vardhaman', '88': 'vardhaman', 'bvri': 'bvrit', 'bvrw': 'bvrithyderabad', 'cmrk': 'cmrce',
    'cmrn': 'cmrec', 'cmrm': 'cmrithyderabad', 'cmrg': 'cmrtc', 'jbit': 'jbiet', 'j2': 'jbrec', 'qk': 'jyothishmathi',
    '5d': 'knrcer', 'qn': 'kbrce', 'qm': 'kgreddy', 'j3': 'khadermemorial', 'qp': 'kitskhammam', 'qt': 'klrce',
    'qu': 'kitsw', '6b': 'kitsw', '28': 'kitskarimnagar', 'ra': 'kprit', 'kmec': 'kprit', 'b4': 'kce',
    'm2': 'lordsinstitute', 'rg': 'mrcew', 'mrgw': 'mrcew', 'rj': 'mrit', 'mrit': 'mrit', '7y': 'mlritm',
    'mrce': 'mlritm', 'j6': 'mcetmedak', 'rp': 'meghainstitute', 'mgha': 'meghainstitute', 'c6': 'mist',
    'g7': 'mitskodad', 'e3': 'mist', 'q9': 'mrce', 'mall': 'mrce', 'uj': 'mrem', 'mrem': 'mrem', 'rh': 'mrecw',
    's1': 'mrits', 'w9': 'mriet', 'mrec': 'mrec', '80': 'mothertheressa', 'td': 'nigama', 'b6': 'nmrec',
    'nred': 'nmrec', '7z': 'nnrg', 'ngitw': 'nnrg', 'x0': 'nrec', 'rt': 'nsakcet', '6f': 'pallaviengineeringcollege',
    '6m': 'princetoncollege', 'prtw': 'princetoncollege', '6c': 'priyadarshinicollege', 'prin': 'priyadarshinicollege',
    'u1': 'samskruti', 'm8': 'sanaengineeringcollege', 'c0': 'scient', 'scit': 'scient', '08': 'shadan',
    'n8': 'sphoorthy', 'srit': 'sphoorthy', 'n0': 'sreechaitanya', 'chtn': 'sreechaitanya', 'tr': 'sreechaitanyainstitute',
    'chts': 'sreechaitanyainstitute', 'c8': 'sreekavitha', 've': 'sreyas', 'srhp': 'sreyas', 'd2': 'sridevicollege',
    'tk': 'svsgroup', 'm6': 'sbit', 'sbit': 'sbit', 'c5': 'saispurthi', 'l5': 'shadanwomens', 'tp': 'siddharthainstitute',
    'tq': 'sitssiddhartha', 'e4': 'sreedattha', '57': 'svits', '8a': 'srichaitanyacampus', 'x3': 'sriindu',
    'indi': 'sriindu', 'srkt': 'sriindu', 'd4': 'sriinducollege', '8b': 'srisai', '63': 'srivenkateswara',
    'sves': 'srivenkateswara', 'k8': 'smec', 'stlw': 'smec', 'bh': 'stmarys', 'd0': 'stmarysgroup',
    '7w': 'stmaryscampus', 'bk': 'stpeters', '6y': 'sritw', '14': 'srtist', 'p7': 'svit', 'r9': 'tkrec',
    'c2': 'thirumala', 'k9': 'tkrce', 'tkrk': 'tkrce', 'ue': 'trinitykarimnagar', 'ud': 'trinitypeddapalli',
    'trce': 'trinitypeddapalli', 'uc': 'tallapadmavathi', 'uk': 'vaagdevi', '64': 'vaagdevi', 's4': 'vaageswari',
    '89': 'vignanits', 'p8': 'vbec', 'up': 'vmtw', 'vgw': 'vmtw', 'vmtw': 'vmtw', 'br': 'vijayaengineeringcollege',
    'bt': 'vcet', '29': 'vrec', 'vrec': 'vrec', 'n6': 'vits', 'ug': 'tudiramreddy', 'tudi': 'tudiramreddy',
    'aarm': 'aarmahaveer', '8p': 'aarmahaveer', 'aceg': 'aceec', 'aith': 'aits', 't8': 'aits', 'akit': 'akit',
    'ek': 'akit', 'anrk': 'anuragcollege', 'anug': 'anuraguniversity', 'wlcw': 'anuraguniversity', 'arjn': 'arjuncollege',
    'w8': 'arjuncollege', 'asra': 'avanthi', 'pt': 'avanthi', 'aurc': 'aurora', 'd9': 'aurora', 'aurg': 'aurora',
    'm9': 'aurora', 'aurh': 'ramappa', 'aurk': 'aurora', '9k': 'aurora', 'avih': 'avanthi', 'q6': 'avanthi',
    'avni': 'avn', '5u': 'avn', 'biet': 'biet', 'bitn': 'bits', 'c3': 'bits', 'boma': 'bomma', 'bose': 'anubose',
    'pp': 'anubose', 'pq': 'anuragcollege', 'brew': 'bhojreddy', 'brig': 'brilliant', 'bril': 'brilliant',
    'drki': 'drk', 'elen': 'ellenki', 'esut': 'kuce', 'gate': 'gate', 'gctc': 'gcet', 'glob': 'global',
    'glwc': 'lailavathi', 'gnit': 'gnit', 'guru': 'gnitc', 'iitt': 'indur', 'jaya': 'jayamukhi', 'jmts': 'jyothishmathi',
    'jntr': 'jntuhsircilla', 'jnts': 'jntuhsultanpur', 'jnthmt': 'jntuhmanthani', 'kits': 'kitswarangal',
    'kmce': 'kmce', 'kprt': 'kprit', 'meth': 'methodist', 'mvsr': 'mvsr', 'ngit': 'ngit', 'rcee': 'rishi',
    'wits': 'wits', '91': 'vjit', '5t': 'ashoka', 'u7': 'aurora', '62': 'aurora', '84': 'aurora', 'q8': 'azadcollege',
    'm1': 'bsit',

    // Andhra Pradesh Codes
    'auce': 'aucoeg', 'jnuk': 'jntuk', 'jnua': 'jntua', 'jnup': 'jntuapulivendula', 'jnlk': 'jntuakalikiri',
    'jnun': 'jntuknarasaraopet', 'jnvz': 'jntukvizianagaram', 'svuc': 'svuce', 'klef': 'kluniversity',
    'vitp': 'vitap', 'srma': 'srmap', 'gvpw': 'gvpce', 'gvpe': 'gvpcew', 'vrse': 'vrsec', 'pvps': 'pvpsiddhartha',
    'rvrj': 'rvrjc', 'gmrt': 'gmrit', 'gprc': 'gprec', 'gpet': 'gpcet', 'svec': 'sreevidyanikethan',
    'mits': 'mits', 'mvgr': 'mvgrce', 'anit': 'anits', 'bpec': 'bec', 'lbrc': 'lbrce', 'srge': 'gec',
    'vvit': 'vvit', 'adtp': 'adityaengineeringcollege', 'acet': 'acet', 'adce': 'aditya', 'aitm': 'aitam',
    'adrs': 'adarshcollege', 'aksr': 'akshara', 'amrn': 'amritasai', 'aits': 'aitsrajampet', 'anuc': 'anucoe',
    'alie': 'andhraloyola', 'avit': 'avanthivizag', 'bvce': 'bvceodalarevu', 'bvci': 'bvcits', 'chai': 'chaitanyaengg',
    'cist': 'cist', 'dnre': 'dnrce', 'diet': 'diet', 'kite': 'kitsdivili', 'nrso': 'nec', 'nbkr': 'nbkrist',
    'nren': 'narayanaengineering', 'nreg': 'narayanagudur', 'rguk': 'rgukt', 'rgmc': 'rgmcet', 'rsre': 'rsrec',
    'svct': 'svcet', 'vemu': 'vemu', 'ciet': 'cietguntur', 'cipt': 'cipt', 'chir': 'chiralacollege',
    'dadi': 'dadiinstitute', 'blay': 'drbullayya', 'kvr': 'kvsr', 'mich': 'mictech', 'elur': 'eluruengg',
    'eswr': 'eswarcollege', 'gist': 'gistnellore', 'giet': 'giet', 'gokl': 'gokulinstitute', 'gkcs': 'gokulakrishna',
    'gntr': 'gunturengg', 'idel': 'idealengg', 'ksrm': 'ksrmce', 'kiet': 'kietkakinada', 'kiew': 'kietwomen',
    'khit': 'khitguntur', 'kmmt': 'kmmits', 'kcit': 'kcit', 'kvew': 'krishnaveniwomen', 'kupm': 'kuppamcollege',
    'lend': 'lendi', 'lenr': 'lenora', 'limt': 'lingayas', 'litm': 'loyolaguntur', 'mvrt': 'mvrce',
    'mlew': 'malineniwomen', 'mamw': 'mamwomen', 'mirc': 'miracleengg', 'mjrc': 'mjrce', 'mtec': 'mothertheresa',
    'nsrt': 'nsrit', 'nist': 'narayanadri', 'newt': 'newtonengg', 'nmra': 'nimra', 'nrit': 'nrit',
    'pbrv': 'pbrvisvodaya', 'pvkk': 'pvkk', 'pace': 'paceinstitute', 'pscm': 'pscmr', 'prag': 'pragatiengg',
    'prak': 'prakasamengg', 'pydi': 'pydah', 'qisc': 'qis', 'quba': 'quba', 'rvit': 'rvit', 'rkce': 'rkce',
    'rcel': 'ramachandra', 'ragu': 'raghuengg', 'rjmt': 'rajamahendri', 'rcew': 'ravindrawomen',
    'srkt': 'srktech', 'srkr': 'srkr', 'sasi': 'sasiengg', 'saty': 'satya', 'sist': 'sistputtur',
    'scrr': 'crrcollege', 'svas': 'vasaviap', 'srin': 'srinivasa', 'sitm': 'sitms', 'stan': 'stannschirala'
  };

  if (extractedCode && CODE_TAG_MAP[extractedCode]) {
    return `https://www.instagram.com/explore/tags/${encodeURIComponent(CODE_TAG_MAP[extractedCode])}/`;
  }

  const COLLEGE_TAG_MAP = {
    'jntuh': 'jntuh',
    'osmania': 'osmaniauniversity',
    'chaitanya bharathi': 'cbithyderabad',
    'cbit': 'cbithyderabad',
    'vasavi': 'vasavicollegeofengineering',
    'vnr': 'vnrvjiet',
    'gokaraju': 'griet',
    'griet': 'griet',
    'sreenidhi': 'snist',
    'snist': 'snist',
    'cvr': 'cvrce',
    'bvrit': 'bvrit',
    'mahatma gandhi': 'mgithyderabad',
    'mgit': 'mgithyderabad',
    'narayanamma': 'gnits',
    'gnits': 'gnits',
    'cmr': 'cmrce',
    'vardhaman': 'vardhaman',
    'anurag': 'anuraguniversity',
    'muffakham': 'mjcet',
    'mvsr': 'mvsr',
    'kakatiya': 'kitswarangal',
    'kits warangal': 'kitswarangal',
    'tkr': 'tkrce',
    'mlrit': 'mlrit',
    'iare': 'iare',
    'vjit': 'vjit',
    'malla reddy': 'mrcet',
    'martin': 'smec',
    'smec': 'smec',
    'geethanjali': 'gcet',
    'jbiet': 'jbiet',
    'guru nanak': 'gnitc',
    'bharat': 'biet',
    'sreyas': 'sreyas',
    'kg reddy': 'kgreddy',
    'ace': 'aceec',
    'vbit': 'vbit',
    'stanley': 'stanley',
    'bhoj reddy': 'bhojreddy',
    'vignan': 'vignan',
    'avanthi': 'avanthi',
    'andhra university': 'aucoeg',
    'jntuk': 'jntuk',
    'jntua': 'jntua',
    'svu': 'svuce',
    'gvp': 'gvpce',
    'srm': 'srmap',
    'vit': 'vitap',
    'kl university': 'kluniversity',
    'gitam': 'gitam',
    'vrsiddhartha': 'vrsec',
    'rvr': 'rvrjc',
    'pvp': 'pvpsiddhartha',
    'pulla reddy': 'gprec',
    'pullaiah': 'gpcet',
    'vidyanikethan': 'sreevidyanikethan',
    'mohan babu': 'mohanbabuuniversity',
    'lbrce': 'lbrce',
    'anits': 'anits',
    'mits': 'mits',
    'mvgr': 'mvgrce',
    'aditya': 'adityaengineeringcollege',
    'gmrit': 'gmrit',
    'raghu': 'raghuengg',
    'bec': 'bec',
    'dhanekula': 'diet',
    'gudlavalleru': 'gec',
    'iit hyderabad': 'iithyderabad',
    'nit warangal': 'nitwarangal',
    'iiit hyderabad': 'iiithyderabad',
    'bits pilani': 'bitshyderabad',
    'university of hyderabad': 'uoh',
    'anna university': 'annauniversity',
    'psg': 'psgtech',
    'rv college': 'rvce',
    'bms': 'bmsce',
    'pes university': 'pesuniversity',
    'ramaiah': 'msrit',
    'coep': 'coep',
    'vjti': 'vjtimumbai',
    'vvit': 'vvit',
    'chalapathi': 'cietguntur',
    'chirala': 'chiralacollege',
    'bullayya': 'drbullayya',
    'mic college': 'mictech',
    'eluru': 'eluruengg',
    'eswar': 'eswarcollege',
    'giet': 'giet',
    'ksrm': 'ksrmce',
    'kiet': 'kietkakinada',
    'lendi': 'lendi',
    'loyola': 'andhraloyola',
    'mvr': 'mvrce',
    'narasaraopeta': 'nec',
    'nbkr': 'nbkrist',
    'narayana': 'narayanaengineering',
    'rgukt': 'rgukt',
    'rgm': 'rgmcet',
    'pace': 'paceinstitute',
    'pragati': 'pragatiengg',
    'prakasam': 'prakasamengg',
    'qis': 'qis',
    'srkr': 'srkr',
    'sasi': 'sasiengg',
    'shri vishnu': 'svcw',
    'siddharth': 'siddharthcollege',
    'vasavi': 'vasavi'
  };

  for (const [key, tag] of Object.entries(COLLEGE_TAG_MAP)) {
    if (lower.includes(key)) {
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;
    }
  }

  const words = clean.split(/\s+/).filter(w => !['of','and','for','the','in','&'].includes(w.toLowerCase()));
  if (words.length >= 2) {
    const acronym = words.map(w => w[0]).join('').toLowerCase();
    if (acronym.length >= 3) {
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(acronym)}/`;
    }
  }

  const fallbackTag = clean.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `https://www.instagram.com/explore/tags/${encodeURIComponent(fallbackTag)}/`;
}

// ─────────────────────────────────────────────────────
// UI HELPERS
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
  el.style.display = 'block';
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

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && tab.url.includes('instagram.com')) {
        chrome.tabs.sendMessage(tab.id, { action: 'STOP_COMMENTER' }, () => {
          if (chrome.runtime.lastError) {}
        });
      }
    });
  });
  chrome.storage.local.set({ gnCommenterState: null });
}

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
  el.style.display = 'block';
}

function stopGlobalBot() {
  globRunning = false;
  const startBtn = document.getElementById('btn-start-global');
  const stopBtn  = document.getElementById('btn-stop-global');
  if (startBtn) startBtn.disabled = false;
  if (stopBtn)  stopBtn.style.display = 'none';
  showGlobStatus(`⏹ Stopped. ${globCommented} global comments posted.`, 'warning');
  addGlobLog('Global bot stopped.', 'info');
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && tab.url.includes('instagram.com')) {
        chrome.tabs.sendMessage(tab.id, { action: 'STOP_GLOBAL_BOT' }, () => {
          if (chrome.runtime.lastError) {}
        });
      }
    });
  });
  chrome.storage.local.get(['gnGlobalBotState'], (d) => {
    if (d.gnGlobalBotState) {
      d.gnGlobalBotState.running = false;
      chrome.storage.local.set({ gnGlobalBotState: d.gnGlobalBotState });
    }
  });
}

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
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && tab.url.includes('reddit.com')) {
        chrome.tabs.sendMessage(tab.id, { action: 'STOP_REDDIT_BOT' }, () => {
          if (chrome.runtime.lastError) {}
        });
      }
    });
  });
  chrome.storage.local.get(['gnRedditBotState'], (d) => {
    if (d.gnRedditBotState) {
      d.gnRedditBotState.running = false;
      chrome.storage.local.set({ gnRedditBotState: d.gnRedditBotState });
    }
  });
}

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

// ─────────────────────────────────────────────────────
// MAIN INITIALIZATION
// ─────────────────────────────────────────────────────
function initPopup() {

  // ── 1. TAB SWITCHING
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetName = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panelEl = document.getElementById('tab-' + targetName);
      if (panelEl) panelEl.classList.add('active');
    });
  });

  // ── 2. STATE / REGION FILTERS FOR FINAL YEAR TAB
  const btnLoadTs = document.getElementById('btn-load-ts');
  const btnLoadAp = document.getElementById('btn-load-ap');
  const btnLoadAll = document.getElementById('btn-load-all');
  const fyHashtagsEl = document.getElementById('fy-hashtags');

  function setFyFilterActive(activeBtn) {
    [btnLoadTs, btnLoadAp, btnLoadAll].forEach(b => {
      if (b) b.classList.remove('selected');
    });
    if (activeBtn) activeBtn.classList.add('selected');
  }

  if (btnLoadTs) {
    btnLoadTs.addEventListener('click', () => {
      setFyFilterActive(btnLoadTs);
      if (fyHashtagsEl) fyHashtagsEl.value = telanganaColleges;
      showStatus('fy-status', '🏛️ Loaded 155 Telangana Colleges!', 'info');
      chrome.storage.local.set({ gnFyActiveRegion: 'ts', gnFyLastList: telanganaColleges });
    });
  }

  if (btnLoadAp) {
    btnLoadAp.addEventListener('click', () => {
      setFyFilterActive(btnLoadAp);
      if (fyHashtagsEl) fyHashtagsEl.value = andhraPradeshColleges;
      showStatus('fy-status', '🌴 Loaded 172 Andhra Pradesh Colleges!', 'info');
      chrome.storage.local.set({ gnFyActiveRegion: 'ap', gnFyLastList: andhraPradeshColleges });
    });
  }

  if (btnLoadAll) {
    btnLoadAll.addEventListener('click', () => {
      setFyFilterActive(btnLoadAll);
      if (fyHashtagsEl) fyHashtagsEl.value = allSouthIndiaColleges;
      showStatus('fy-status', '⚡ Loaded 327 South India Colleges (TS + AP)!', 'info');
      chrome.storage.local.set({ gnFyActiveRegion: 'all', gnFyLastList: allSouthIndiaColleges });
    });
  }

  // ── 3. STATE / REGION FILTERS FOR SOUTH INDIA DATABASE TAB
  const siBtnTs = document.getElementById('si-btn-ts');
  const siBtnAp = document.getElementById('si-btn-ap');
  const siBtnAll = document.getElementById('si-btn-all');
  const siTextArea = document.getElementById('si-colleges-list');

  function setSiFilterActive(activeBtn) {
    [siBtnTs, siBtnAp, siBtnAll].forEach(b => {
      if (b) b.classList.remove('selected');
    });
    if (activeBtn) activeBtn.classList.add('selected');
  }

  if (siBtnTs) {
    siBtnTs.addEventListener('click', () => {
      setSiFilterActive(siBtnTs);
      if (siTextArea) siTextArea.value = telanganaColleges;
    });
  }

  if (siBtnAp) {
    siBtnAp.addEventListener('click', () => {
      setSiFilterActive(siBtnAp);
      if (siTextArea) siTextArea.value = andhraPradeshColleges;
    });
  }

  if (siBtnAll) {
    siBtnAll.addEventListener('click', () => {
      setSiFilterActive(siBtnAll);
      if (siTextArea) siTextArea.value = allSouthIndiaColleges;
    });
  }

  // Populate default lists if empty
  if (siTextArea && !siTextArea.value) {
    siTextArea.value = telanganaColleges;
  }
  if (fyHashtagsEl && (!fyHashtagsEl.value || fyHashtagsEl.value.trim().length === 0)) {
    fyHashtagsEl.value = telanganaColleges;
  }

  // ── Commenter Topic chips
  document.querySelectorAll('#tab-commenter .topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.dataset.topic;
      if (!topic) return;
      if (selectedTopics.has(topic)) {
        selectedTopics.delete(topic);
        chip.classList.remove('selected');
      } else {
        selectedTopics.add(topic);
        chip.classList.add('selected');
      }
    });
  });

  // ── Commenter Speed buttons
  document.querySelectorAll('#tab-commenter .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tab-commenter .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (btn.dataset.speed) {
        selectedSpeed = parseInt(btn.dataset.speed, 10);
      }
    });
  });

  // ── TakeVolet City chips
  document.querySelectorAll('#tv-city-grid .topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // ── TakeVolet Speed buttons
  document.querySelectorAll('#tv-speed-control .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tv-speed-control .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (btn.dataset.tvspeed) {
        selectedTvSpeed = parseInt(btn.dataset.tvspeed, 10);
      }
    });
  });

  // ── Global Country chips
  document.querySelectorAll('#country-chips .topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const country = chip.dataset.country;
      if (!country) return;
      if (globSelectedCountries.has(country)) {
        globSelectedCountries.delete(country);
        chip.classList.remove('selected');
      } else {
        globSelectedCountries.add(country);
        chip.classList.add('selected');
      }
      refreshGlobUniList();
    });
  });

  // ── Global Style buttons
  document.querySelectorAll('#glob-style-btns .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#glob-style-btns .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      globSelectedStyle = btn.dataset.style;
    });
  });

  // ── Global Speed buttons
  document.querySelectorAll('#glob-speed-btns .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#glob-speed-btns .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (btn.dataset.gspeed) {
        globSelectedSpeed = parseInt(btn.dataset.gspeed, 10);
      }
    });
  });

  // ── Reddit Style buttons
  document.querySelectorAll('#reddit-style-btns .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#reddit-style-btns .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      redditSelectedStyle = btn.dataset.style;
    });
  });

  // ── Reddit Speed buttons
  document.querySelectorAll('#reddit-speed-btns .speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#reddit-speed-btns .speed-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (btn.dataset.speed) {
        redditSelectedSpeed = parseInt(btn.dataset.speed, 10);
      }
    });
  });

  // ── Load saved settings & bot states
  chrome.storage.local.get([
    'apiKey','companyName','companyTagline','websiteUrl','backendUrl',
    'gnFySettings', 'gnFyBotState', 'gnFyActiveRegion', 'takevoletBotState', 'gnGlobalBotState', 'gnRedditBotState', 'userStartedBot'
  ], data => {
    if (data.apiKey)        { const el = document.getElementById('apiKey');        if(el) el.value = data.apiKey; }
    if (data.companyName)   { const el = document.getElementById('companyName');   if(el) el.value = data.companyName; }
    if (data.companyTagline){ const el = document.getElementById('companyTagline');if(el) el.value = data.companyTagline; }
    if (data.websiteUrl)    { const el = document.getElementById('websiteUrl');    if(el) el.value = data.websiteUrl; }
    if (data.backendUrl)    { const el = document.getElementById('backendUrl');    if(el) el.value = data.backendUrl; }
    if (data.contactPhone)  {
      const el1 = document.getElementById('contactPhone'); if (el1) el1.value = data.contactPhone;
      const el2 = document.getElementById('fy-phone');     if (el2) el2.value = data.contactPhone;
    }
    
    // Final Year state restore
    if (data.gnFySettings) {
      if (document.getElementById('fy-ig-id')) document.getElementById('fy-ig-id').value = data.gnFySettings.igId || '@graduatenex';
      if (document.getElementById('fy-url')) document.getElementById('fy-url').value = data.gnFySettings.url || 'https://graduatenex.online';
      if (document.getElementById('fy-phone')) document.getElementById('fy-phone').value = data.gnFySettings.phone || data.contactPhone || '7981994870';
      
      let savedHashtags = data.gnFySettings.hashtags;
      if (!savedHashtags || savedHashtags.trim().length === 0) {
        savedHashtags = telanganaColleges;
      } else if (savedHashtags.includes(',') && !savedHashtags.includes('\n')) {
        savedHashtags = savedHashtags.split(',').map(s => s.trim()).filter(Boolean).join('\n');
      }
      if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = savedHashtags;
    } else {
      if (document.getElementById('fy-ig-id')) document.getElementById('fy-ig-id').value = '@graduatenex';
      if (document.getElementById('fy-url')) document.getElementById('fy-url').value = 'https://graduatenex.online';
      if (document.getElementById('fy-phone')) document.getElementById('fy-phone').value = data.contactPhone || '7981994870';
      if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = telanganaColleges;
    }

    if (data.gnFyActiveRegion === 'ap') {
      setFyFilterActive(btnLoadAp);
    } else if (data.gnFyActiveRegion === 'all') {
      setFyFilterActive(btnLoadAll);
    } else {
      setFyFilterActive(btnLoadTs);
    }

    if (data.gnFyBotState && data.gnFyBotState.pendingHashtags && data.gnFyBotState.pendingHashtags.length > 0) {
      if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = data.gnFyBotState.pendingHashtags.join('\n');
    }
    if (data.userStartedBot && data.gnFyBotState && data.gnFyBotState.running) {
      const fyStartBtn = document.getElementById('btn-start-fy');
      const fyStopBtn = document.getElementById('btn-stop-fy');
      if (fyStartBtn) fyStartBtn.style.display = 'none';
      if (fyStopBtn) fyStopBtn.style.display = 'flex';
      showStatus('fy-status', `🚀 Final Year Bot active... (${data.gnFyBotState.pendingHashtags?.length || 0} colleges remaining)`, 'info');
    }

    // TakeVolet state restore
    if (data.takevoletBotState) {
      const tvState = data.takevoletBotState;
      if (tvState.stats) {
        const c = document.getElementById('tv-stat-commented');
        const s = document.getElementById('tv-stat-skipped');
        if (c) c.textContent = tvState.stats.commentedCount || 0;
        if (s) s.textContent = tvState.stats.skippedCount || 0;
      }
      if (tvState.pendingHashtags) {
        const q = document.getElementById('tv-stat-queue');
        if (q) q.textContent = tvState.pendingHashtags.length;
      }
      if (data.userStartedBot && tvState.running) {
        const btnStartTv = document.getElementById('btn-start-tv');
        const btnStopTv = document.getElementById('btn-stop-tv');
        if (btnStartTv) btnStartTv.disabled = true;
        if (btnStopTv) btnStopTv.style.display = 'flex';
        showStatus('tv-status', '🚀 TakeVolet Commenter Running!', 'info');
      }
    }

    // Global Universities state restore
    const globState = data.gnGlobalBotState;
    if (globState && globState.pendingUniversities && globState.pendingUniversities.length > 0) {
      const textarea = document.getElementById('glob-uni-list');
      if (textarea) textarea.value = globState.pendingUniversities.join('\n');
      const queueEl = document.getElementById('glob-stat-queue');
      if (queueEl) queueEl.textContent = globState.pendingUniversities.length;
    } else {
      refreshGlobUniList();
    }
    if (data.userStartedBot && globState && globState.running) {
      globRunning = true;
      const globStartBtn = document.getElementById('btn-start-global');
      const globStopBtn  = document.getElementById('btn-stop-global');
      if (globStartBtn) globStartBtn.disabled = true;
      if (globStopBtn) globStopBtn.style.display = 'flex';
      showGlobStatus(`🌍 Global blast active!`, 'info');
    }

    // Reddit state restore
    const rState = data.gnRedditBotState;
    if (rState && rState.pendingSubreddits && rState.pendingSubreddits.length > 0) {
      const textarea = document.getElementById('reddit-subreddits');
      if (textarea) textarea.value = rState.pendingSubreddits.join(', ');
      const queueEl = document.getElementById('reddit-stat-queue');
      if (queueEl) queueEl.textContent = rState.pendingSubreddits.length;
    }
    if (data.userStartedBot && rState && rState.running) {
      redditRunning = true;
      const startBtn = document.getElementById('btn-start-reddit');
      const stopBtn  = document.getElementById('btn-stop-reddit');
      if (startBtn) startBtn.disabled = true;
      if (stopBtn) stopBtn.style.display = 'flex';
      showRedditStatus(`🔥 Reddit blast active!`, 'info');
    }
  });

  // ── Save settings
  const saveBtn = document.getElementById('save-settings');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const contactPhone = document.getElementById('contactPhone')?.value.trim() || document.getElementById('fy-phone')?.value.trim() || '7981994870';
      chrome.storage.local.set({
        apiKey:        document.getElementById('apiKey')?.value.trim() || '',
        companyName:   document.getElementById('companyName')?.value.trim() || 'GraduateNex',
        companyTagline:document.getElementById('companyTagline')?.value.trim() || '',
        websiteUrl:    document.getElementById('websiteUrl')?.value.trim() || 'graduatenex.online',
        backendUrl:    document.getElementById('backendUrl')?.value.trim() || 'https://www.graduatenex.online',
        contactPhone:  contactPhone
      }, () => {
        showStatus('settings-status', '✅ Settings saved!', 'success');
        setTimeout(() => {
          const el = document.getElementById('settings-status');
          if (el) el.className = 'status';
        }, 2000);
      });
    });
  }

  // ── TAKEVOLET RENTALS START & STOP
  const btnStartTv = document.getElementById('btn-start-tv');
  const btnStopTv  = document.getElementById('btn-stop-tv');

  if (btnStartTv) {
    btnStartTv.addEventListener('click', async () => {
      const template = document.getElementById('tv-promo-copy')?.value || '';
      const selectedCityChips = Array.from(document.querySelectorAll('#tv-city-grid .topic-chip.selected')).map(c => c.dataset.city);
      if (selectedCityChips.length === 0) {
        showStatus('tv-status', '❌ Select at least one city!', 'error');
        return;
      }
      const CITY_MAP = {
        hyderabad: ['pghyderabad', 'hyderabadpg', 'hostelhyderabad', 'hyderabadhostel', 'hyderabadrentals', 'flatsinhyderabad', 'colivinghyderabad', 'daywisestayhyderabad', 'roomforrenthyderabad'],
        mumbai: ['pgmumbai', 'mumbaipg', 'hostelmumbai', 'mumbaihostel', 'mumbairentals', 'flatsinmumbai', 'colivingmumbai', 'daywisestaymumbai', 'roomforrentmumbai'],
        pune: ['pgpune', 'punepg', 'hostelpune', 'punehostel', 'punerentals', 'flatsinpune', 'colivingpune', 'daywisestaypune', 'roomforrentpune'],
        delhi: ['pgdelhi', 'delhipg', 'hosteldelhi', 'delhihostel', 'delhirentals', 'flatsindelhi', 'colivingdelhi', 'daywisestaydelhi', 'roomforrentdelhi'],
        noida: ['pgnoida', 'noidapg', 'hostelnoida', 'noidahostel', 'noidarentals', 'flatsinnoida', 'colivingnoida', 'daywisestaynoida', 'roomforrentnoida'],
        chennai: ['pgchennai', 'chennaipg', 'hostelchennai', 'chennaihostel', 'chennairentals', 'flatsinchennai', 'colivingchennai', 'daywisestaychennai', 'roomforrentchennai']
      };
      const hashtagsList = [];
      selectedCityChips.forEach(city => {
        (CITY_MAP[city] || []).forEach(h => hashtagsList.push({ hashtag: h, city }));
      });
      hashtagsList.sort(() => Math.random() - 0.5);

      btnStartTv.disabled = true;
      if (btnStopTv) btnStopTv.style.display = 'flex';
      showStatus('tv-status', '🚀 TakeVolet Commenter Running!', 'info');

      const first = hashtagsList[0];
      const remaining = hashtagsList.slice(1);
      const targetUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(first.hashtag)}/`;

      await chrome.storage.local.set({
        userStartedBot: true,
        takevoletBotState: {
          running: true,
          pendingHashtags: remaining,
          pendingPosts: [],
          currentHashtag: first.hashtag,
          currentCity: first.city,
          config: { template, speed: selectedTvSpeed, hashtagsList },
          stats: { commentedCount: 0, skippedCount: 0 }
        },
        gnFyBotState: { running: false },
        gnGlobalBotState: { running: false },
        gnRedditBotState: { running: false }
      });

      chrome.tabs.query({}, (tabs) => {
        const tab = tabs.find(t => t.active && t.url && t.url.includes('instagram.com')) ||
                    tabs.find(t => t.url && t.url.includes('instagram.com'));
        if (tab) {
          chrome.tabs.update(tab.id, { url: targetUrl, active: true }, () => {
            chrome.tabs.sendMessage(tab.id, {
              action: 'START_TAKEVOLET_COMMENTER',
              config: { template, speed: selectedTvSpeed, hashtagsList }
            }, () => { if (chrome.runtime.lastError) {} });
          });
        } else {
          chrome.tabs.create({ url: targetUrl, active: true });
        }
      });
    });
  }

  if (btnStopTv) {
    btnStopTv.addEventListener('click', () => {
      btnStartTv.disabled = false;
      btnStopTv.style.display = 'none';
      showStatus('tv-status', '⏹ TakeVolet Commenter stopped.', 'warning');
      chrome.storage.local.set({ userStartedBot: false, takevoletBotState: { running: false } });
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && tab.url.includes('instagram.com')) {
            chrome.tabs.sendMessage(tab.id, { action: 'STOP_TAKEVOLET_COMMENTER' }, () => { if (chrome.runtime.lastError) {} });
          }
        });
      });
    });
  }

  // ── EMERGENCY STOP ALL BOTS
  const btnEmergencyStop = document.getElementById('btn-emergency-stop');
  if (btnEmergencyStop) {
    btnEmergencyStop.addEventListener('click', async () => {
      await chrome.storage.local.set({
        userStartedBot: false,
        gnFyBotState: { running: false },
        takevoletBotState: { running: false },
        gnGlobalBotState: { running: false },
        gnRedditBotState: { running: false },
        gnCommenterState: null
      });

      try {
        const tabs = await chrome.tabs.query({});
        tabs.forEach(t => {
          chrome.tabs.sendMessage(t.id, { action: 'STOP_FY_BOT' }, () => { if (chrome.runtime.lastError) {} });
          chrome.tabs.sendMessage(t.id, { action: 'STOP_TAKEVOLET_COMMENTER' }, () => { if (chrome.runtime.lastError) {} });
          chrome.tabs.sendMessage(t.id, { action: 'STOP_GLOBAL_BOT' }, () => { if (chrome.runtime.lastError) {} });
          chrome.tabs.sendMessage(t.id, { action: 'STOP_REDDIT_BOT' }, () => { if (chrome.runtime.lastError) {} });
          chrome.tabs.sendMessage(t.id, { action: 'STOP_COMMENTER' }, () => { if (chrome.runtime.lastError) {} });
        });
      } catch (e) {}

      const fyStartBtn = document.getElementById('btn-start-fy');
      const fyStopBtn  = document.getElementById('btn-stop-fy');
      if (fyStartBtn) { fyStartBtn.style.display = 'flex'; fyStartBtn.disabled = false; }
      if (fyStopBtn)  fyStopBtn.style.display = 'none';

      const btnStartTv = document.getElementById('btn-start-tv');
      const btnStopTv  = document.getElementById('btn-stop-tv');
      if (btnStartTv) btnStartTv.disabled = false;
      if (btnStopTv)  btnStopTv.style.display = 'none';

      const startCommenterBtn = document.getElementById('start-commenter');
      const stopCommenterBtn = document.getElementById('stop-commenter');
      if (startCommenterBtn) startCommenterBtn.disabled = false;
      if (stopCommenterBtn) stopCommenterBtn.style.display = 'none';

      const globStartBtn = document.getElementById('btn-start-global');
      const globStopBtn  = document.getElementById('btn-stop-global');
      if (globStartBtn) globStartBtn.disabled = false;
      if (globStopBtn)  globStopBtn.style.display = 'none';

      const redditStartBtn = document.getElementById('btn-start-reddit');
      const redditStopBtn  = document.getElementById('btn-stop-reddit');
      if (redditStartBtn) redditStartBtn.disabled = false;
      if (redditStopBtn)  redditStopBtn.style.display = 'none';

      showStatus('fy-status', '🛑 ALL BOTS STOPPED AND RESET.', 'warning');
      showStatus('tv-status', '🛑 ALL BOTS STOPPED AND RESET.', 'warning');
      showStatus('commenter-status', '🛑 ALL BOTS STOPPED AND RESET.', 'warning');
      showGlobStatus('🛑 ALL BOTS STOPPED AND RESET.', 'warning');
      showRedditStatus('🛑 ALL BOTS STOPPED AND RESET.', 'warning');
    });
  }

  // ── FINAL YEAR PROJECTS AUTO-COMMENT
  const fyStartBtn = document.getElementById('btn-start-fy');
  const fyStopBtn = document.getElementById('btn-stop-fy');

  if (fyStartBtn) {
    fyStartBtn.addEventListener('click', async () => {
      let hashtagsRaw = document.getElementById('fy-hashtags')?.value.trim() || '';
      if (!hashtagsRaw) {
        hashtagsRaw = telanganaColleges;
        if (document.getElementById('fy-hashtags')) document.getElementById('fy-hashtags').value = telanganaColleges;
      }

      const hashtags = hashtagsRaw.split(/[\n,]+/).map(h => h.trim()).filter(Boolean);
      if (hashtags.length === 0) {
        showStatus('fy-status', '❌ Please enter at least one college!', 'error');
        return;
      }

      const igId = document.getElementById('fy-ig-id')?.value.trim() || '@graduatenex';
      const url = document.getElementById('fy-url')?.value.trim() || 'https://graduatenex.online';
      const phone = document.getElementById('fy-phone')?.value.trim() || document.getElementById('contactPhone')?.value.trim() || '7981994870';

      // Clear any other running bots in storage first
      await chrome.storage.local.set({
        userStartedBot: true,
        takevoletBotState: { running: false },
        gnGlobalBotState: { running: false },
        gnRedditBotState: { running: false }
      });

      fyStartBtn.style.display = 'none';
      if (fyStopBtn) fyStopBtn.style.display = 'flex';
      showStatus('fy-status', `🚀 Started commenting on ${hashtags.length} colleges!`, 'info');

      const firstCollege = hashtags[0];
      const remainingColleges = hashtags.slice(1);
      const targetUrl = getCollegeTargetUrl(firstCollege);

      const initialState = {
        running: true,
        pendingHashtags: remainingColleges,
        currentHashtag: firstCollege,
        pendingPosts: [],
        igId,
        url,
        phone,
        stats: { commentedCount: 0, skippedCount: 0 }
      };

      await chrome.storage.local.set({
        userStartedBot: true,
        gnFyBotState: initialState,
        gnFySettings: { igId, url, phone, hashtags: hashtagsRaw }
      });

      chrome.tabs.query({}, (tabs) => {
        const tab = tabs.find(t => t.active && t.url && t.url.includes('instagram.com')) ||
                    tabs.find(t => t.url && t.url.includes('instagram.com'));
        if (tab) {
          chrome.tabs.update(tab.id, { url: targetUrl, active: true }, () => {
            chrome.tabs.sendMessage(tab.id, { action: 'START_FY_BOT', hashtags, igId, url, phone }, () => {
              if (chrome.runtime.lastError) {}
            });
          });
        } else {
          chrome.tabs.create({ url: targetUrl, active: true });
        }
      });
    });
  }

  if (fyStopBtn) {
    fyStopBtn.addEventListener('click', async () => {
      fyStartBtn.style.display = 'flex';
      fyStopBtn.style.display = 'none';
      showStatus('fy-status', '⏹ Stopped Final Year Bot.', 'warning');
      await chrome.storage.local.set({ userStartedBot: false, gnFyBotState: { running: false } });
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(t => {
          if (t.url && t.url.includes('instagram.com')) {
            chrome.tabs.sendMessage(t.id, { action: 'STOP_FY_BOT' }, () => {
              if (chrome.runtime.lastError) {}
            });
          }
        });
      });
    });
  }

  // ── AUTO COMMENTER TAB START & STOP
  const startCommenterBtn = document.getElementById('start-commenter');
  if (startCommenterBtn) {
    startCommenterBtn.addEventListener('click', async () => {
      const hashtagsRaw = document.getElementById('fy-hashtags')?.value || document.getElementById('si-colleges-list')?.value || telanganaColleges;
      const hashtags = hashtagsRaw.split(/[\n,]+/).map(h => h.trim()).filter(Boolean);
      const igId = document.getElementById('fy-ig-id')?.value || '@graduatenex';
      const url = document.getElementById('fy-url')?.value || 'https://graduatenex.online';
      const phone = document.getElementById('fy-phone')?.value.trim() || document.getElementById('contactPhone')?.value.trim() || '7981994870';

      commenterRunning = true;
      startCommenterBtn.disabled = true;
      const stopBtn = document.getElementById('stop-commenter');
      if (stopBtn) stopBtn.style.display = 'flex';
      showStatus('commenter-status', '🚀 Auto Commenter Active!', 'info');

      await chrome.storage.local.set({
        userStartedBot: true,
        gnFyBotState: {
          running: true,
          pendingHashtags: hashtags.slice(1),
          currentHashtag: hashtags[0],
          pendingPosts: [],
          igId,
          url,
          phone,
          stats: { commentedCount: 0, skippedCount: 0 }
        }
      });

      const targetUrl = getCollegeTargetUrl(hashtags[0]);

      chrome.tabs.query({}, (tabs) => {
        const tab = tabs.find(t => t.active && t.url && t.url.includes('instagram.com')) ||
                    tabs.find(t => t.url && t.url.includes('instagram.com'));
        if (tab) {
          chrome.tabs.update(tab.id, { url: targetUrl, active: true }, () => {
            chrome.tabs.sendMessage(tab.id, { action: 'START_FY_BOT', hashtags, igId, url, phone }, () => {
              if (chrome.runtime.lastError) {}
            });
          });
        } else {
          chrome.tabs.create({ url: targetUrl, active: true });
        }
      });
    });
  }

  const stopCommenterBtn = document.getElementById('stop-commenter');
  if (stopCommenterBtn) {
    stopCommenterBtn.addEventListener('click', () => {
      stopCommenter();
    });
  }

  // ── AUTO POSTER TAB
  const postBtn = document.getElementById('postBtn');
  if (postBtn) {
    postBtn.addEventListener('click', async () => {
      const topic = document.getElementById('topicText')?.value.trim() || 'GraduateNex Final Year Projects';
      const backendUrl = document.getElementById('backendUrl')?.value.trim() || 'https://www.graduatenex.online';

      showStatus('poster-status', '🚀 Processing auto post request...', 'info');

      chrome.tabs.query({}, (tabs) => {
        const tab = tabs.find(t => t.active && t.url && t.url.includes('instagram.com')) ||
                    tabs.find(t => t.url && t.url.includes('instagram.com'));
        if (tab) {
          chrome.tabs.update(tab.id, { active: true });
          chrome.tabs.sendMessage(tab.id, { action: 'START_AUTO_POST', topic, backendUrl }, () => {
            if (chrome.runtime.lastError) {
              showStatus('poster-status', 'ℹ️ Reload Instagram tab, then click Post!', 'info');
            } else {
              showStatus('poster-status', '✅ Auto Post request sent!', 'success');
            }
          });
        } else {
          showStatus('poster-status', '❌ Opening Instagram tab...', 'info');
          chrome.tabs.create({ url: 'https://www.instagram.com/' });
        }
      });
    });
  }

  // ── GLOBAL BOT START & STOP
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

      globRunning  = true;
      globCommented = 0;
      globSkipped   = 0;
      updateGlobStats();

      globStartBtn.disabled = true;
      if (globStopBtn) globStopBtn.style.display = 'flex';
      showGlobStatus(`🌍 Global blast started! Targeting ${universities.length} universities.`, 'info');
      addGlobLog(`Starting global bot on ${universities.length} universities...`, 'success');

      chrome.storage.local.get(['websiteUrl'], async settings => {
        const config = {
          universities,
          style:      globSelectedStyle,
          speed:      globSelectedSpeed,
          websiteUrl: settings.websiteUrl || 'graduatenex.online',
          countries:  Array.from(globSelectedCountries),
        };

        await chrome.storage.local.set({
          userStartedBot: true,
          gnGlobalBotState: {
            running: true,
            pendingUniversities: universities,
            currentUniversity: universities[0],
            config,
            stats: { commentedCount: 0, skippedCount: 0 }
          },
          gnFyBotState: { running: false },
          takevoletBotState: { running: false },
          gnRedditBotState: { running: false }
        });

        chrome.tabs.query({}, (tabs) => {
          const tab = tabs.find(t => t.active && t.url && t.url.includes('instagram.com')) ||
                      tabs.find(t => t.url && t.url.includes('instagram.com'));
          if (tab) {
            chrome.tabs.update(tab.id, { active: true });
            chrome.tabs.sendMessage(tab.id, { action: 'START_GLOBAL_BOT', config }, () => {
              if (chrome.runtime.lastError) {
                addGlobLog('Instagram tab updated ✅ Ready for global bot.', 'info');
              } else {
                addGlobLog('Global bot acknowledged ✅ Searching university profiles...', 'success');
              }
            });
          } else {
            chrome.tabs.create({ url: 'https://www.instagram.com/', active: true });
          }
        });
      });
    });
  }

  if (globStopBtn) {
    globStopBtn.addEventListener('click', stopGlobalBot);
  }

  // ── REDDIT BOT START & STOP
  const redditStartBtn = document.getElementById('btn-start-reddit');
  const redditStopBtn  = document.getElementById('btn-stop-reddit');

  if (redditStartBtn) {
    redditStartBtn.addEventListener('click', async () => {
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

      redditRunning  = true;
      redditCommented = 0;
      redditSkipped   = 0;
      updateRedditStats();

      redditStartBtn.disabled = true;
      if (redditStopBtn) redditStopBtn.style.display = 'flex';
      showRedditStatus(`🔥 Reddit blast started! Targeting ${subreddits.length} subreddits.`, 'info');
      addRedditLog(`Starting reddit bot on ${subreddits.length} subreddits...`, 'success');

      chrome.storage.local.get(['websiteUrl'], async settings => {
        const config = {
          subreddits,
          style:      redditSelectedStyle,
          speed:      redditSelectedSpeed,
          websiteUrl: settings.websiteUrl || 'graduatenex.online'
        };

        const firstSubreddit = subreddits[0];
        const targetUrl = `https://www.reddit.com/r/${encodeURIComponent(firstSubreddit)}/new/`;

        await chrome.storage.local.set({
          userStartedBot: true,
          gnRedditBotState: {
            running: true,
            pendingSubreddits: subreddits,
            currentSubreddit: firstSubreddit,
            config,
            stats: { commentedCount: 0, skippedCount: 0 }
          },
          gnFyBotState: { running: false },
          takevoletBotState: { running: false },
          gnGlobalBotState: { running: false }
        });

        chrome.tabs.query({}, (tabs) => {
          const tab = tabs.find(t => t.active && t.url && t.url.includes('reddit.com')) ||
                      tabs.find(t => t.url && t.url.includes('reddit.com'));
          if (tab) {
            chrome.tabs.update(tab.id, { url: targetUrl, active: true }, () => {
              chrome.tabs.sendMessage(tab.id, { action: 'START_REDDIT_BOT', config }, () => {
                if (chrome.runtime.lastError) {}
              });
            });
          } else {
            chrome.tabs.create({ url: targetUrl, active: true });
          }
        });
      });
    });
  }

  if (redditStopBtn) {
    redditStopBtn.addEventListener('click', stopRedditBot);
  }

  addLog('GraduateNex Insta Suite ready ✅', 'success');
}

// ─────────────────────────────────────────────────────
// MESSAGE PROGRESS LISTENERS (Handles all content scripts)
// ─────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'GLOBAL_BOT_PROGRESS') {
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
  }

  if (msg.action === 'REDDIT_BOT_PROGRESS') {
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
  }

  if (msg.action === 'TAKEVOLET_PROGRESS') {
    const c = document.getElementById('tv-stat-commented');
    const s = document.getElementById('tv-stat-skipped');
    const q = document.getElementById('tv-stat-queue');
    if (msg.type === 'commented') {
      if (c) c.textContent = (parseInt(c.textContent, 10) || 0) + 1;
    } else if (msg.type === 'skipped') {
      if (s) s.textContent = (parseInt(s.textContent, 10) || 0) + 1;
    }
    if (msg.remaining !== undefined && q) {
      q.textContent = msg.remaining;
    }
  }

  if (msg.action === 'COMMENT_PROGRESS') {
    if (msg.type === 'commented') {
      commentedCount++;
      const prevEl = document.getElementById('comment-preview');
      if (prevEl && msg.comment) prevEl.textContent = msg.comment;
      addLog(`✅ Commented: ${(msg.comment || '').substring(0, 50)}...`, 'success');
    } else if (msg.type === 'skipped') {
      skippedCount++;
      addLog(`⏭ Skipped: ${msg.reason || ''}`, 'info');
    }
    updateStats();
  }
});

// ─────────────────────────────────────────────────────
// EXECUTE INITIALIZATION (Robust for any document state)
// ─────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopup);
} else {
  initPopup();
}
