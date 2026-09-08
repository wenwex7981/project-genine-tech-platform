// ── Country & Currency Configuration ──
// Centralized country detection, currency mapping, and price formatting

export interface Country {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  flagEmoji: string;
  isPriority: boolean;
}

// ── Static fallback country data (used when DB is unreachable) ──
export const PRIORITY_COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', currencyCode: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', isPriority: true },
  { code: 'US', name: 'United States', currencyCode: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', isPriority: true },
  { code: 'CA', name: 'Canada', currencyCode: 'CAD', currencySymbol: 'CA$', flagEmoji: '🇨🇦', isPriority: true },
  { code: 'GB', name: 'United Kingdom', currencyCode: 'GBP', currencySymbol: '£', flagEmoji: '🇬🇧', isPriority: true },
  { code: 'AU', name: 'Australia', currencyCode: 'AUD', currencySymbol: 'A$', flagEmoji: '🇦🇺', isPriority: true },
  { code: 'AE', name: 'United Arab Emirates', currencyCode: 'AED', currencySymbol: 'AED', flagEmoji: '🇦🇪', isPriority: true },
  { code: 'SG', name: 'Singapore', currencyCode: 'SGD', currencySymbol: 'S$', flagEmoji: '🇸🇬', isPriority: true },
  { code: 'DE', name: 'Germany', currencyCode: 'EUR', currencySymbol: '€', flagEmoji: '🇩🇪', isPriority: true },
  { code: 'FR', name: 'France', currencyCode: 'EUR', currencySymbol: '€', flagEmoji: '🇫🇷', isPriority: true },
  { code: 'IT', name: 'Italy', currencyCode: 'EUR', currencySymbol: '€', flagEmoji: '🇮🇹', isPriority: true },
  { code: 'SA', name: 'Saudi Arabia', currencyCode: 'SAR', currencySymbol: 'SAR', flagEmoji: '🇸🇦', isPriority: true },
];

// ── Timezone → Country mapping (for auto-detection) ──
const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
  'America/Phoenix': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA',
  'Europe/London': 'GB',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU', 'Australia/Perth': 'AU',
  'Asia/Dubai': 'AE',
  'Asia/Singapore': 'SG',
  'Europe/Berlin': 'DE', 'Europe/Munich': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Rome': 'IT',
  'Asia/Riyadh': 'SA',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'America/Sao_Paulo': 'BR',
  'Asia/Shanghai': 'CN',
  'Asia/Hong_Kong': 'HK',
  'Europe/Amsterdam': 'NL',
  'Europe/Stockholm': 'SE',
  'Europe/Zurich': 'CH',
  'Asia/Karachi': 'PK',
  'Asia/Dhaka': 'BD',
  'Asia/Colombo': 'LK',
  'Asia/Kathmandu': 'NP',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Jakarta': 'ID',
  'Asia/Bangkok': 'TH',
  'Asia/Manila': 'PH',
  'Pacific/Auckland': 'NZ',
  'Europe/Dublin': 'IE',
  'Europe/Madrid': 'ES',
  'Europe/Lisbon': 'PT',
  'Europe/Warsaw': 'PL',
  'Asia/Qatar': 'QA',
  'Asia/Kuwait': 'KW',
  'Asia/Bahrain': 'BH',
  'Asia/Muscat': 'OM',
  'Asia/Jerusalem': 'IL',
  'Europe/Istanbul': 'TR',
  'Africa/Lagos': 'NG',
  'Africa/Nairobi': 'KE',
  'Africa/Cairo': 'EG',
  'Africa/Johannesburg': 'ZA',
};

// ── Browser locale → Country mapping ──
const LOCALE_COUNTRY_MAP: Record<string, string> = {
  'en-IN': 'IN', 'hi': 'IN', 'te': 'IN', 'ta': 'IN', 'kn': 'IN', 'ml': 'IN', 'mr': 'IN', 'bn-IN': 'IN', 'gu': 'IN', 'pa': 'IN',
  'en-US': 'US',
  'en-CA': 'CA', 'fr-CA': 'CA',
  'en-GB': 'GB',
  'en-AU': 'AU',
  'ar-AE': 'AE',
  'en-SG': 'SG', 'zh-SG': 'SG',
  'de-DE': 'DE', 'de': 'DE',
  'fr-FR': 'FR', 'fr': 'FR',
  'it-IT': 'IT', 'it': 'IT',
  'ar-SA': 'SA',
  'ja': 'JP', 'ja-JP': 'JP',
  'ko': 'KR', 'ko-KR': 'KR',
  'pt-BR': 'BR',
  'zh-CN': 'CN', 'zh': 'CN',
  'zh-HK': 'HK',
  'nl-NL': 'NL', 'nl': 'NL',
  'es': 'ES', 'es-ES': 'ES',
  'pt-PT': 'PT', 'pt': 'PT',
  'pl-PL': 'PL', 'pl': 'PL',
  'tr-TR': 'TR', 'tr': 'TR',
  'ur-PK': 'PK', 'ur': 'PK',
  'bn-BD': 'BD', 'bn': 'BD',
};

// ── Razorpay-supported currencies ──
// Only these currencies can be used with Razorpay international payments
export const RAZORPAY_SUPPORTED_CURRENCIES = new Set([
  'INR', 'USD', 'EUR', 'GBP', 'SGD', 'AED', 'AUD', 'CAD', 'CNY', 'SEK',
  'NZD', 'MXN', 'HKD', 'NOK', 'DKK', 'ZAR', 'MYR', 'PLN', 'SAR', 'QAR',
  'KWD', 'BHD', 'OMR', 'JPY', 'KRW', 'THB', 'PHP', 'IDR', 'BRL', 'LKR',
  'NPR', 'PKR', 'BDT', 'EGP', 'KES', 'NGN', 'GHS', 'TRY', 'ILS', 'CHF',
]);

// ── Currency → Locale mapping for Intl.NumberFormat ──
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  'INR': 'en-IN',
  'USD': 'en-US',
  'GBP': 'en-GB',
  'EUR': 'de-DE',
  'CAD': 'en-CA',
  'AUD': 'en-AU',
  'AED': 'ar-AE',
  'SGD': 'en-SG',
  'SAR': 'ar-SA',
  'JPY': 'ja-JP',
};

/**
 * Detect user's country from browser signals.
 * Priority: localStorage → timezone → browser locale → default India
 */
export function detectUserCountry(): string {
  if (typeof window === 'undefined') return 'IN';

  // 1. Check saved preference
  const saved = localStorage.getItem('gn_country');
  if (saved && saved.length === 2) return saved;

  // 2. Check timezone (more accurate than locale which is often en-US)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzCountry = TIMEZONE_COUNTRY_MAP[tz];
    if (tzCountry) return tzCountry;
  } catch { /* ignore */ }

  // 3. Check browser locale as fallback
  const locale = navigator.language || (navigator as any).userLanguage || '';
  const localeCountry = LOCALE_COUNTRY_MAP[locale] || LOCALE_COUNTRY_MAP[locale.split('-')[0]];
  if (localeCountry) return localeCountry;

  // 4. Default to India
  return 'IN';
}

/**
 * Get currency code for a country. Falls back to USD for unknown countries.
 */
export function getCurrencyForCountry(countryCode: string): string {
  const country = PRIORITY_COUNTRIES.find(c => c.code === countryCode);
  if (country) return country.currencyCode;

  // Check timezone map for non-priority countries
  // For now, default unknown countries to USD
  return 'USD';
}

/**
 * Get currency symbol for a currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const country = PRIORITY_COUNTRIES.find(c => c.currencyCode === currencyCode);
  return country?.currencySymbol || currencyCode;
}

/**
 * Format a price with proper locale-aware formatting.
 * Examples: formatPrice(199, 'INR') → "₹199", formatPrice(4.99, 'USD') → "$4.99"
 */
export function formatPrice(amount: number, currencyCode: string = 'INR'): string {
  const locale = CURRENCY_LOCALE_MAP[currencyCode] || 'en-US';

  try {
    // Use 0 decimal places for whole numbers, 2 for decimals
    const hasDecimals = amount % 1 !== 0;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback for unsupported currencies
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Check if a currency is supported by Razorpay
 */
export function isRazorpayCurrency(currencyCode: string): boolean {
  return RAZORPAY_SUPPORTED_CURRENCIES.has(currencyCode);
}

/**
 * Get the smallest currency unit multiplier (e.g., 100 for INR/USD paise/cents)
 * Some currencies like JPY, KRW have no subunit
 */
export function getCurrencyMultiplier(currencyCode: string): number {
  const zeroDecimalCurrencies = new Set(['JPY', 'KRW', 'VND', 'CLP']);
  const threeDecimalCurrencies = new Set(['BHD', 'KWD', 'OMR']);

  if (zeroDecimalCurrencies.has(currencyCode)) return 1;
  if (threeDecimalCurrencies.has(currencyCode)) return 1000;
  return 100;
}

/**
 * Check if the given country is India
 */
export function isIndiaCountry(countryCode: string): boolean {
  return countryCode === 'IN';
}
