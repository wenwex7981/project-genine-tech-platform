// ── Product Pricing System ──
// Centralized product catalog with country-aware pricing lookup

import { supabase } from '@/lib/supabase';

// ── Product catalog — all purchasable items on GraduateNex ──
export interface Product {
  id: string;
  name: string;
  defaultPriceINR: number;
  category: 'subscription' | 'pay_per_use' | 'listing' | 'marketplace';
  isLifetime?: boolean;
  durationDays?: number;
}

export const PRODUCT_CATALOG: Record<string, Product> = {
  // Subscription plans
  all_access_pass:        { id: 'all_access_pass',        name: 'All Access Pass (Monthly)', defaultPriceINR: 799,  category: 'subscription', durationDays: 30 },
  all_access_semester:    { id: 'all_access_semester',    name: 'All Access Semester',       defaultPriceINR: 1999, category: 'subscription', durationDays: 180 },
  ai_premium:             { id: 'ai_premium',             name: 'AI Helper Premium',         defaultPriceINR: 200,  category: 'subscription', durationDays: 30 },
  plagiarism_pro:         { id: 'plagiarism_pro',         name: 'AI Plagiarism Pro',         defaultPriceINR: 300,  category: 'subscription', durationDays: 30 },
  resume_hub_pro:         { id: 'resume_hub_pro',         name: 'Resume Hub Pro',            defaultPriceINR: 500,  category: 'subscription', durationDays: 30 },
  hackathon_badge_15:     { id: 'hackathon_badge_15',     name: 'Pro Badge (15 events)',      defaultPriceINR: 500,  category: 'subscription', isLifetime: true },
  hackathon_badge_unlimited: { id: 'hackathon_badge_unlimited', name: 'Unlimited Badge',     defaultPriceINR: 1000, category: 'subscription', isLifetime: true },

  // Pay-per-use
  ats_scan:               { id: 'ats_scan',               name: 'Detailed ATS Breakdown',    defaultPriceINR: 50,   category: 'pay_per_use' },
  jd_match:               { id: 'jd_match',               name: 'JD Matching Analysis',      defaultPriceINR: 100,  category: 'pay_per_use' },
  abstract_gen:           { id: 'abstract_gen',           name: 'AI Abstract Generation',    defaultPriceINR: 20,   category: 'pay_per_use' },

  // Hackathon listings
  hackathon_featured:     { id: 'hackathon_featured',     name: 'Featured Listing',          defaultPriceINR: 499,  category: 'listing' },
  hackathon_premium:      { id: 'hackathon_premium',      name: 'Premium Listing',           defaultPriceINR: 999,  category: 'listing' },
  hackathon_homepage:     { id: 'hackathon_homepage',     name: 'Homepage Featured',         defaultPriceINR: 1999, category: 'listing' },
};

// ── Price cache to avoid repeated DB hits ──
const priceCache = new Map<string, { price: number; currency: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get the price for a product in a specific country.
 * Checks country_pricing table first, falls back to INR default.
 */
export async function getProductPrice(
  productId: string, 
  countryCode: string
): Promise<{ price: number; currencyCode: string }> {
  const product = PRODUCT_CATALOG[productId];
  if (!product) {
    return { price: 0, currencyCode: 'INR' };
  }

  // India always uses the default INR price
  if (countryCode === 'IN') {
    return { price: product.defaultPriceINR, currencyCode: 'INR' };
  }

  // Check cache
  const cacheKey = `${productId}_${countryCode}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { price: cached.price, currencyCode: cached.currency };
  }

  // Fetch from database
  try {
    const { data, error } = await supabase
      .from('country_pricing')
      .select('price, currency_code')
      .eq('product_id', productId)
      .eq('country_code', countryCode)
      .eq('is_active', true)
      .single();

    if (data && !error) {
      priceCache.set(cacheKey, { price: data.price, currency: data.currency_code, timestamp: Date.now() });
      return { price: data.price, currencyCode: data.currency_code };
    }
  } catch {
    // DB fetch failed — fall through to USD fallback
  }

  // Fallback: try USD pricing for non-India countries
  if (countryCode !== 'US') {
    try {
      const { data } = await supabase
        .from('country_pricing')
        .select('price, currency_code')
        .eq('product_id', productId)
        .eq('country_code', 'US')
        .eq('is_active', true)
        .single();

      if (data) {
        priceCache.set(cacheKey, { price: data.price, currency: data.currency_code, timestamp: Date.now() });
        return { price: data.price, currencyCode: data.currency_code };
      }
    } catch { /* ignore */ }
  }

  // Ultimate fallback: INR default
  return { price: product.defaultPriceINR, currencyCode: 'INR' };
}

/**
 * Get all product prices for a country (batch fetch for pricing page)
 */
export async function getAllPricesForCountry(
  countryCode: string
): Promise<Record<string, { price: number; currencyCode: string }>> {
  const result: Record<string, { price: number; currencyCode: string }> = {};

  // India: return all defaults
  if (countryCode === 'IN') {
    for (const [id, product] of Object.entries(PRODUCT_CATALOG)) {
      result[id] = { price: product.defaultPriceINR, currencyCode: 'INR' };
    }
    return result;
  }

  // Fetch all prices for this country
  try {
    const { data } = await supabase
      .from('country_pricing')
      .select('product_id, price, currency_code')
      .eq('country_code', countryCode)
      .eq('is_active', true);

    if (data) {
      for (const row of data) {
        result[row.product_id] = { price: row.price, currencyCode: row.currency_code };
      }
    }
  } catch { /* ignore */ }

  // Fill in missing products with USD fallback, then INR default
  for (const [id, product] of Object.entries(PRODUCT_CATALOG)) {
    if (!result[id]) {
      // Try USD
      try {
        const { data } = await supabase
          .from('country_pricing')
          .select('price, currency_code')
          .eq('product_id', id)
          .eq('country_code', 'US')
          .eq('is_active', true)
          .single();

        if (data) {
          result[id] = { price: data.price, currencyCode: data.currency_code };
          continue;
        }
      } catch { /* ignore */ }

      result[id] = { price: product.defaultPriceINR, currencyCode: 'INR' };
    }
  }

  return result;
}

/**
 * Clear the price cache (useful after admin updates pricing)
 */
export function clearPriceCache() {
  priceCache.clear();
}
