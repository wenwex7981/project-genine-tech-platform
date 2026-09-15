// Direct Google Batch Indexing + IndexNow + Sitemap Ping
// Run: node scripts/fire-indexing.js
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const BASE_URL = 'https://www.graduatenex.online';

const LOCATION_SLUGS = [
  'united-states','united-kingdom','canada','australia','uae','singapore',
  'germany','saudi-arabia','france','india','malaysia','nigeria','south-africa',
  'new-zealand','ireland','netherlands','sweden','switzerland','italy','japan',
  'south-korea','philippines','pakistan','bangladesh','sri-lanka','ghana',
  'kenya','qatar','kuwait','bahrain','oman',
  'andhra-pradesh','telangana','maharashtra','karnataka','tamil-nadu',
  'delhi-ncr','uttar-pradesh','gujarat','west-bengal','rajasthan','kerala',
  'madhya-pradesh','punjab','haryana','bihar','odisha','assam','jharkhand',
  'chhattisgarh','uttarakhand','himachal-pradesh','goa',
  'hyderabad','bangalore','mumbai','pune','chennai','delhi','noida','gurugram',
  'ahmedabad','kolkata','jaipur','lucknow','bhopal','indore','nagpur',
  'coimbatore','kochi','visakhapatnam','vijayawada','warangal','bhubaneswar',
  'surat','chandigarh','new-york','san-francisco','los-angeles','chicago',
  'boston','seattle','london','manchester','toronto','vancouver','sydney',
  'melbourne','dubai','abu-dhabi','berlin','munich','singapore-city',
  'kuala-lumpur','riyadh','doha','amsterdam','paris','zurich','tokyo',
  'seoul','lagos','nairobi','johannesburg','manila',
  'iit','nit','iiit','bits-pilani','jntuh','jntuk','jntua','anna-university',
  'vtu','delhi-university','mumbai-university','sppu','osmania-university',
  'srm','vit','manipal','amity','lpu','chandigarh-university','aktu','gtu',
  'rgpv','ktu','makaut','bput','andhra-university','svu','klu','gitam',
  'kiit','pes-university','christ-university','iit-hyderabad','iit-bombay',
  'iit-delhi','iit-madras','iit-kharagpur','iit-kanpur','iit-roorkee',
  'nit-warangal','nit-trichy','nit-surathkal','nit-calicut','griet','cbit',
  'rgukt','coep','vjti','thapar','mit','stanford','harvard','georgia-tech',
  'uc-berkeley','carnegie-mellon','columbia-university','nyu','cornell-university',
  'northeastern-university','asu','oxford','cambridge','imperial-college','ucl',
  'university-of-edinburgh','kings-college','university-of-manchester',
  'university-of-toronto','ubc','mcgill','university-of-waterloo',
  'university-of-melbourne','unsw','anu','university-of-sydney','monash-university',
  'rmit','uts','nus','ntu-singapore','smu','khalifa-university','tu-munich',
  'rwth-aachen','kaust','utm','um',
];
const ROLE_SLUGS = [
  'software-engineer','data-scientist','frontend-developer','backend-developer',
  'full-stack-developer','machine-learning-engineer','data-analyst',
  'devops-engineer','cybersecurity-analyst','cloud-engineer','product-manager',
  'ux-designer','blockchain-developer','ai-engineer','mobile-developer',
  'nlp-engineer','computer-vision-engineer','site-reliability-engineer',
  'database-administrator','network-engineer','business-analyst','solution-architect',
];
const COMPANY_SLUGS = [
  'tcs','infosys','wipro','cognizant','tech-mahindra','zoho','hcl','mphasis',
  'flipkart','swiggy','zomato','paytm','phonepe','razorpay','freshworks',
  'google','amazon','microsoft','meta','apple','netflix','nvidia','salesforce',
  'ibm','oracle','adobe','uber','airbnb','stripe','openai','anthropic','tesla',
  'accenture','capgemini','deloitte','mckinsey','goldman-sachs','jpmorgan','bcg','pwc',
];

const STATIC_URLS = [
  '/', '/projects', '/resume', '/study', '/hackathons', '/blog',
  '/pricing', '/ai-services', '/ai-abstracts', '/about', '/contact',
  '/custom-requirements', '/jobs-updates', '/login',
  '/projects/source-code', '/projects/documentation',
  '/projects/research-paper', '/projects/plagiarism-removal',
  '/study/interview-prep', '/study/career-guidance',
  '/study/interview-prep/communication-builder',
  '/study/interview-prep/english-course',
  '/privacy', '/terms', '/refunds', '/delivery',
].map(p => `${BASE_URL}${p}`);

const ALL_URLS = [
  ...STATIC_URLS,
  ...LOCATION_SLUGS.map(s => `${BASE_URL}/locations/${s}`),
  ...ROLE_SLUGS.map(s => `${BASE_URL}/resume/role/${s}`),
  ...COMPANY_SLUGS.map(s => `${BASE_URL}/study/interview/${s}`),
];

console.log(`\n🚀 GraduateNex SEO Nuclear Launch`);
console.log(`📍 Total URLs: ${ALL_URLS.length}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

// ── Generic fetch helper ─────────────────────────────────────────────────────
function rawRequest(urlStr, method, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const isHttps = u.protocol === 'https:';
    const lib = isHttps ? https : require('http');
    const bodyBuf = body ? Buffer.isBuffer(body) ? body : Buffer.from(body) : null;
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      headers: { ...headers, ...(bodyBuf ? { 'Content-Length': bodyBuf.length } : {}) },
    };
    const req = lib.request(opts, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

// ── 1. IndexNow ──────────────────────────────────────────────────────────────
async function fireIndexNow() {
  const key = 'bc65958d392d4cd99a3480b0ac545dad';
  const host = 'www.graduatenex.online';
  const keyLocation = `https://${host}/${key}.txt`;
  const payload = JSON.stringify({ host, key, keyLocation, urlList: ALL_URLS });

  console.log(`🟠 IndexNow → ${ALL_URLS.length} URLs to Bing + Yandex...`);
  const headers = { 'Content-Type': 'application/json; charset=utf-8' };

  const [bing, yandex] = await Promise.allSettled([
    rawRequest('https://www.bing.com/indexnow', 'POST', headers, payload),
    rawRequest('https://yandex.com/indexnow', 'POST', headers, payload),
  ]);

  const bs = bing.status === 'fulfilled' ? bing.value.status : 'ERR';
  const ys = yandex.status === 'fulfilled' ? yandex.value.status : 'ERR';
  console.log(`   Bing: ${bs} | Yandex: ${ys}`);

  // 200/202 = accepted, 422 = key not verified (register at Bing Webmaster Tools first)
  if (bs === 200 || bs === 202) console.log(`   🎉 Bing ACCEPTED — pages index within minutes!`);
  if (bs === 403 || bs === 422) console.log(`   ⚠️  Bing: Register your key at https://www.bing.com/webmasters → IndexNow`);
  if (ys === 200 || ys === 202) console.log(`   🎉 Yandex ACCEPTED!`);
  return { bing: bs, yandex: ys };
}

// ── 2. Sitemap Pings ─────────────────────────────────────────────────────────
async function fireSitemaps() {
  console.log(`\n🗺️  Pinging sitemaps...`);
  const sitemap = `${BASE_URL}/sitemap.xml`;
  // Google's current ping endpoint
  const gUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
  const bUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`;

  const [g, b] = await Promise.allSettled([
    rawRequest(gUrl, 'GET', {}, null),
    rawRequest(bUrl, 'GET', {}, null),
  ]);
  const gs = g.status === 'fulfilled' ? g.value.status : 'ERR';
  const bs = b.status === 'fulfilled' ? b.value.status : 'ERR';
  console.log(`   Google: ${gs} | Bing: ${bs}`);
  // 200 = OK, 404 = Google retired this endpoint (use Search Console instead)
  if (gs === 404) console.log(`   ℹ️  Google retired /ping — use Google Search Console to submit sitemap manually`);
  return { google: gs, bing: bs };
}

// ── 3. Google Indexing API (batch) ───────────────────────────────────────────
async function fireGoogle() {
  const credsRaw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credsRaw) { console.log(`\n🔵 Google: ⚠️  Credentials not found`); return; }

  console.log(`\n🔵 Google Indexing API...`);
  const creds = JSON.parse(credsRaw);

  // Build JWT manually (no external deps)
  const { createSign } = require('crypto');

  function base64url(buf) {
    return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));

  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${claim}`);
  const sig = base64url(sign.sign(creds.private_key));
  const jwt = `${header}.${claim}.${sig}`;

  // Exchange JWT for access token
  const tokenBody = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const tokenRes = await rawRequest(
    'https://oauth2.googleapis.com/token', 'POST',
    { 'Content-Type': 'application/x-www-form-urlencoded' },
    tokenBody
  );

  if (tokenRes.status !== 200) {
    console.log(`   ❌ Token error: ${tokenRes.status} ${tokenRes.body}`);
    return;
  }

  const { access_token } = JSON.parse(tokenRes.body);
  console.log(`   ✅ Authenticated as: ${creds.client_email}`);
  console.log(`   📦 Batching ${ALL_URLS.length} URLs (100/batch, 200 limit/day)...`);

  const SKIP_FIRST = 200; // Already indexed yesterday — skip these
  const urlsToSubmit = ALL_URLS.slice(SKIP_FIRST);
  console.log(`   Skipping first ${SKIP_FIRST} (already indexed). Submitting ${urlsToSubmit.length} remaining...`);

  const CHUNK = 100;
  let totalOk = 0, totalFail = 0;

  for (let i = 0; i < urlsToSubmit.length; i += CHUNK) {
    const chunk = urlsToSubmit.slice(i, i + CHUNK);
    const boundary = `gnx_batch_${i}`;

    // Build multipart body as Buffer (NOT JSON.stringify)
    const parts = chunk.map((url, idx) => [
      `--${boundary}`,
      `Content-Type: application/http`,
      `Content-ID: <item${i + idx}>`,
      ``,
      `POST /v3/urlNotifications:publish HTTP/1.1`,
      `Content-Type: application/json`,
      ``,
      JSON.stringify({ url, type: 'URL_UPDATED' }),
    ].join('\r\n'));

    const batchBody = parts.join('\r\n') + `\r\n--${boundary}--`;

    const res = await rawRequest(
      'https://indexing.googleapis.com/batch', 'POST',
      {
        'Content-Type': `multipart/mixed; boundary=${boundary}`,
        'Authorization': `Bearer ${access_token}`,
      },
      batchBody
    );

    const ok = (res.body.match(/HTTP\/1\.1 200/g) || []).length;
    const fail = chunk.length - ok;
    totalOk += ok;
    totalFail += fail;
    const batchNum = Math.floor(i / CHUNK) + 1;
    console.log(`   📤 Batch ${batchNum}: ${ok}/${chunk.length} indexed ✅  ${fail > 0 ? `(${fail} failed)` : ''}`);

    if (i + CHUNK < ALL_URLS.length) await new Promise(r => setTimeout(r, 500));
  }

  if (ALL_URLS.length > 200) {
    console.log(`   ℹ️  Google limit: 200 URLs/day. Run again tomorrow for remaining ${ALL_URLS.length - 200} URLs.`);
  }

  console.log(`\n   🎉 Google: ${totalOk} indexed, ${totalFail} failed`);
  return { success: totalOk, failed: totalFail };
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const r1 = await fireIndexNow();
  const r2 = await fireSitemaps();
  const r3 = await fireGoogle();

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🏁 DONE`);
  console.log(`   Total URLs: ${ALL_URLS.length}`);
  console.log(`   IndexNow:   Bing=${r1?.bing} Yandex=${r1?.yandex}`);
  console.log(`   Sitemap:    Google=${r2?.google} Bing=${r2?.bing}`);
  console.log(`   Google API: ${r3 ? `${r3.success} indexed` : 'skipped'}`);
  console.log(`\n📌 Next Steps:`);
  console.log(`   1. Go to https://www.bing.com/webmasters → IndexNow → add key: graduatenex2026indexnow`);
  console.log(`   2. Go to Google Search Console → Sitemaps → submit: ${BASE_URL}/sitemap.xml`);
  console.log(`   3. Run this script again tomorrow for remaining URLs (Google 200/day limit)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
