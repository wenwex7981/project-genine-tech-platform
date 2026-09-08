-- ============================================================
-- GraduateNex Global Expansion Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Countries & Currencies Table
CREATE TABLE IF NOT EXISTS countries (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  currency_symbol TEXT NOT NULL,
  flag_emoji TEXT DEFAULT '',
  is_priority BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Country-specific Product Pricing
CREATE TABLE IF NOT EXISTS country_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  country_code TEXT NOT NULL REFERENCES countries(code),
  price NUMERIC NOT NULL,
  currency_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, country_code)
);

-- 3. Add country columns to existing tables
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'INR';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'IN';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'INR';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'IN';

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_country_pricing_product ON country_pricing(product_id);
CREATE INDEX IF NOT EXISTS idx_country_pricing_country ON country_pricing(country_code);
CREATE INDEX IF NOT EXISTS idx_orders_country ON orders(country_code);

-- 5. RLS Policies
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_pricing ENABLE ROW LEVEL SECURITY;

-- Countries: readable by everyone, writable by service role only
CREATE POLICY "Countries are viewable by everyone" ON countries FOR SELECT USING (true);

-- Country pricing: readable by everyone, writable by service role only
CREATE POLICY "Country pricing is viewable by everyone" ON country_pricing FOR SELECT USING (true);

-- 6. Seed Priority Countries
INSERT INTO countries (code, name, currency_code, currency_symbol, flag_emoji, is_priority) VALUES
  ('IN', 'India', 'INR', '₹', '🇮🇳', true),
  ('US', 'United States', 'USD', '$', '🇺🇸', true),
  ('CA', 'Canada', 'CAD', 'CA$', '🇨🇦', true),
  ('GB', 'United Kingdom', 'GBP', '£', '🇬🇧', true),
  ('AU', 'Australia', 'AUD', 'A$', '🇦🇺', true),
  ('AE', 'United Arab Emirates', 'AED', 'AED ', '🇦🇪', true),
  ('SG', 'Singapore', 'SGD', 'S$', '🇸🇬', true),
  ('DE', 'Germany', 'EUR', '€', '🇩🇪', true),
  ('FR', 'France', 'EUR', '€', '🇫🇷', true),
  ('IT', 'Italy', 'EUR', '€', '🇮🇹', true),
  ('SA', 'Saudi Arabia', 'SAR', 'SAR ', '🇸🇦', true)
ON CONFLICT (code) DO NOTHING;

-- 7. Seed secondary countries (common worldwide)
INSERT INTO countries (code, name, currency_code, currency_symbol, flag_emoji, is_priority) VALUES
  ('JP', 'Japan', 'JPY', '¥', '🇯🇵', false),
  ('KR', 'South Korea', 'KRW', '₩', '🇰🇷', false),
  ('BR', 'Brazil', 'BRL', 'R$', '🇧🇷', false),
  ('MX', 'Mexico', 'MXN', 'MX$', '🇲🇽', false),
  ('ZA', 'South Africa', 'ZAR', 'R', '🇿🇦', false),
  ('NG', 'Nigeria', 'NGN', '₦', '🇳🇬', false),
  ('KE', 'Kenya', 'KES', 'KSh', '🇰🇪', false),
  ('EG', 'Egypt', 'EGP', 'E£', '🇪🇬', false),
  ('PK', 'Pakistan', 'PKR', 'Rs', '🇵🇰', false),
  ('BD', 'Bangladesh', 'BDT', '৳', '🇧🇩', false),
  ('LK', 'Sri Lanka', 'LKR', 'Rs', '🇱🇰', false),
  ('NP', 'Nepal', 'NPR', 'Rs', '🇳🇵', false),
  ('MY', 'Malaysia', 'MYR', 'RM', '🇲🇾', false),
  ('ID', 'Indonesia', 'IDR', 'Rp', '🇮🇩', false),
  ('TH', 'Thailand', 'THB', '฿', '🇹🇭', false),
  ('PH', 'Philippines', 'PHP', '₱', '🇵🇭', false),
  ('VN', 'Vietnam', 'VND', '₫', '🇻🇳', false),
  ('NZ', 'New Zealand', 'NZD', 'NZ$', '🇳🇿', false),
  ('IE', 'Ireland', 'EUR', '€', '🇮🇪', false),
  ('NL', 'Netherlands', 'EUR', '€', '🇳🇱', false),
  ('SE', 'Sweden', 'SEK', 'kr', '🇸🇪', false),
  ('NO', 'Norway', 'NOK', 'kr', '🇳🇴', false),
  ('DK', 'Denmark', 'DKK', 'kr', '🇩🇰', false),
  ('CH', 'Switzerland', 'CHF', 'CHF', '🇨🇭', false),
  ('AT', 'Austria', 'EUR', '€', '🇦🇹', false),
  ('BE', 'Belgium', 'EUR', '€', '🇧🇪', false),
  ('ES', 'Spain', 'EUR', '€', '🇪🇸', false),
  ('PT', 'Portugal', 'EUR', '€', '🇵🇹', false),
  ('PL', 'Poland', 'PLN', 'zł', '🇵🇱', false),
  ('QA', 'Qatar', 'QAR', 'QAR', '🇶🇦', false),
  ('KW', 'Kuwait', 'KWD', 'KD', '🇰🇼', false),
  ('BH', 'Bahrain', 'BHD', 'BD', '🇧🇭', false),
  ('OM', 'Oman', 'OMR', 'OMR', '🇴🇲', false),
  ('IL', 'Israel', 'ILS', '₪', '🇮🇱', false),
  ('TR', 'Turkey', 'TRY', '₺', '🇹🇷', false),
  ('RU', 'Russia', 'RUB', '₽', '🇷🇺', false),
  ('CN', 'China', 'CNY', '¥', '🇨🇳', false),
  ('HK', 'Hong Kong', 'HKD', 'HK$', '🇭🇰', false),
  ('TW', 'Taiwan', 'TWD', 'NT$', '🇹🇼', false),
  ('AR', 'Argentina', 'ARS', 'AR$', '🇦🇷', false),
  ('CL', 'Chile', 'CLP', 'CL$', '🇨🇱', false),
  ('CO', 'Colombia', 'COP', 'CO$', '🇨🇴', false),
  ('PE', 'Peru', 'PEN', 'S/.', '🇵🇪', false),
  ('GH', 'Ghana', 'GHS', 'GH₵', '🇬🇭', false),
  ('ET', 'Ethiopia', 'ETB', 'Br', '🇪🇹', false)
ON CONFLICT (code) DO NOTHING;

-- 8. Seed default international pricing (placeholder prices — admin can change)
-- Product IDs match the pricing page plans
INSERT INTO country_pricing (product_id, country_code, price, currency_code) VALUES
  -- All Access Pass (Monthly) — India ₹799
  ('all_access_pass', 'IN', 799, 'INR'),
  ('all_access_pass', 'US', 9.99, 'USD'),
  ('all_access_pass', 'GB', 7.99, 'GBP'),
  ('all_access_pass', 'CA', 12.99, 'CAD'),
  ('all_access_pass', 'AU', 14.99, 'AUD'),
  ('all_access_pass', 'AE', 36.99, 'AED'),
  ('all_access_pass', 'SG', 13.99, 'SGD'),
  ('all_access_pass', 'DE', 8.99, 'EUR'),
  ('all_access_pass', 'FR', 8.99, 'EUR'),
  ('all_access_pass', 'IT', 8.99, 'EUR'),
  ('all_access_pass', 'SA', 37.99, 'SAR'),

  -- All Access Semester — India ₹1999
  ('all_access_semester', 'IN', 1999, 'INR'),
  ('all_access_semester', 'US', 24.99, 'USD'),
  ('all_access_semester', 'GB', 19.99, 'GBP'),
  ('all_access_semester', 'CA', 32.99, 'CAD'),
  ('all_access_semester', 'AU', 37.99, 'AUD'),
  ('all_access_semester', 'AE', 89.99, 'AED'),
  ('all_access_semester', 'SG', 34.99, 'SGD'),
  ('all_access_semester', 'DE', 22.99, 'EUR'),
  ('all_access_semester', 'FR', 22.99, 'EUR'),
  ('all_access_semester', 'IT', 22.99, 'EUR'),
  ('all_access_semester', 'SA', 94.99, 'SAR'),

  -- AI Premium — India ₹200
  ('ai_premium', 'IN', 200, 'INR'),
  ('ai_premium', 'US', 2.99, 'USD'),
  ('ai_premium', 'GB', 2.49, 'GBP'),
  ('ai_premium', 'AE', 9.99, 'AED'),

  -- Plagiarism Pro — India ₹300
  ('plagiarism_pro', 'IN', 300, 'INR'),
  ('plagiarism_pro', 'US', 3.99, 'USD'),
  ('plagiarism_pro', 'GB', 3.49, 'GBP'),
  ('plagiarism_pro', 'AE', 14.99, 'AED'),

  -- Resume Hub Pro — India ₹500
  ('resume_hub_pro', 'IN', 500, 'INR'),
  ('resume_hub_pro', 'US', 5.99, 'USD'),
  ('resume_hub_pro', 'GB', 4.99, 'GBP'),
  ('resume_hub_pro', 'AE', 21.99, 'AED'),

  -- Hackathon Badge 15 — India ₹500
  ('hackathon_badge_15', 'IN', 500, 'INR'),
  ('hackathon_badge_15', 'US', 5.99, 'USD'),
  ('hackathon_badge_15', 'GB', 4.99, 'GBP'),

  -- Hackathon Badge Unlimited — India ₹1000
  ('hackathon_badge_unlimited', 'IN', 1000, 'INR'),
  ('hackathon_badge_unlimited', 'US', 11.99, 'USD'),
  ('hackathon_badge_unlimited', 'GB', 9.99, 'GBP'),

  -- ATS Scan Pay-per-use — India ₹50
  ('ats_scan', 'IN', 50, 'INR'),
  ('ats_scan', 'US', 0.99, 'USD'),

  -- JD Match Pay-per-use — India ₹100
  ('jd_match', 'IN', 100, 'INR'),
  ('jd_match', 'US', 1.49, 'USD'),

  -- Abstract Generation — India ₹20
  ('abstract_gen', 'IN', 20, 'INR'),
  ('abstract_gen', 'US', 0.49, 'USD'),

  -- Hackathon Featured Listing — India ₹499
  ('hackathon_featured', 'IN', 499, 'INR'),
  ('hackathon_featured', 'US', 5.99, 'USD'),

  -- Hackathon Premium Listing — India ₹999
  ('hackathon_premium', 'IN', 999, 'INR'),
  ('hackathon_premium', 'US', 11.99, 'USD'),

  -- Hackathon Homepage Featured — India ₹1999
  ('hackathon_homepage', 'IN', 1999, 'INR'),
  ('hackathon_homepage', 'US', 24.99, 'USD')
ON CONFLICT (product_id, country_code) DO NOTHING;
