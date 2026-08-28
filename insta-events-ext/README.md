# 🔍 GraduateNex Events Scout — Instagram Scraper Extension

A Chrome extension that **automatically crawls Instagram** for events and hackathons, then pushes discovered listings directly to the GraduateNex `/hackathons` page via Supabase.

---

## 📁 Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension config & permissions |
| `content.js` | Instagram DOM scraper + hashtag crawler |
| `popup.html` | Premium dark-mode extension UI |
| `popup.js` | Popup controller logic |
| `icon*.png` | Extension icons |

---

## 🚀 Installation (Chrome)

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load Unpacked**
4. Select this folder: `insta-events-ext/`
5. The 🔍 icon should appear in your Chrome toolbar

---

## ⚙️ One-Time Setup

1. Click the extension icon → go to **⚙ Settings** tab
2. Set **API URL**:
   - Local dev: `http://localhost:3000/api/insta-events`
   - Production: `https://graduatenex.online/api/insta-events`
3. Click **💾 Save Settings**

---

## 🕷 How to Use

### Step 1 — Run the Scraper
1. Click **▶ Start Scraping**
2. The extension will open Instagram and automatically visit hashtag pages:
   - `#hackathon`, `#hackathon2025`, `#technicalfest`, `#HackIndia`, etc.
3. For each hashtag, it scans up to 12 posts and extracts:
   - Title, description, date, location, prize pool
   - Registration link (Devfolio, Unstop, HackerEarth, etc.)
   - Instagram image thumbnail
4. Watch the **Activity Log** for real-time progress
5. Click **■ Stop** anytime

### Step 2 — Review Events
- Click **📋 Events** tab to preview scraped events before pushing

### Step 3 — Push to DB
1. Click **🚀 Push to GraduateNex DB**
2. Events are sent to `/api/insta-events` and upserted into Supabase
3. New events are added with `status = 'pending'` (require admin approval)
4. Duplicates are automatically skipped

---

## 🛡️ Admin Review

All scraped events go in with **`status = 'pending'`**.  
Go to `/admin` → Hackathons → Approve/Reject scraped events before they appear publicly.

---

## 📊 Database

The events are stored in the `hackathons_v2` Supabase table with:
- `source = 'instagram'`
- `instagram_url` (unique — prevents duplicate imports)
- `banner_url` — Instagram post image
- `status = 'pending'` — requires admin approval

### Required DB Migration

Run `insta_events_migration.sql` in Supabase SQL Editor once before first use.

---

## 🔒 Limitations

- Instagram may detect automation and show CAPTCHAs
- Only public posts are scraped (no private accounts)
- Caption parsing is heuristic — some dates/locations may be imprecise
- Rate: ~12 posts per hashtag at ~2-3s per post
