'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  detectUserCountry, 
  getCurrencyForCountry, 
  formatPrice as formatPriceUtil,
  isIndiaCountry,
  isRazorpayCurrency,
  getCurrencyMultiplier,
  type Country,
  PRIORITY_COUNTRIES,
} from '@/lib/i18n/countries';
import { supabase } from '@/lib/supabase';
import { getAllPricesForCountry, PRODUCT_CATALOG } from '@/lib/i18n/pricing';

interface CountryContextType {
  /** Current country code (ISO 3166-1 alpha-2) */
  country: string;
  /** Current currency code (ISO 4217) */
  currency: string;
  /** Whether the current country is India */
  isIndia: boolean;
  /** Set the user's country (persists to localStorage + profile) */
  setCountry: (code: string) => void;
  /** Format a price in the current country's currency */
  formatPrice: (amount: number, overrideCurrency?: string) => string;
  /** Get the raw numerical localized price for a specific product */
  getPrice: (productId: string) => number;
  /** Convert a raw INR amount to the current localized currency using fixed fallback rates */
  convertPrice: (amountInINR: number) => number;
  /** Get the Razorpay-compatible currency (falls back to INR) */
  razorpayCurrency: string;
  /** Get the currency multiplier for Razorpay (100 for most, 1 for JPY etc.) */
  currencyMultiplier: number;
  /** Country info object */
  countryInfo: Country | undefined;
  /** Whether the country and pricing have been loaded */
  isReady: boolean;
}

const CountryContext = createContext<CountryContextType>({
  country: 'IN',
  currency: 'INR',
  isIndia: true,
  setCountry: () => {},
  formatPrice: (amount) => `₹${amount}`,
  getPrice: (id) => PRODUCT_CATALOG[id]?.defaultPriceINR || 0,
  convertPrice: (amount) => amount,
  razorpayCurrency: 'INR',
  currencyMultiplier: 100,
  countryInfo: PRIORITY_COUNTRIES[0],
  isReady: false,
});

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState('IN');
  const [prices, setPrices] = useState<Record<string, {price: number, currencyCode: string}>>({});
  const [isReady, setIsReady] = useState(false);

  // Detect country on mount
  useEffect(() => {
    const detected = detectUserCountry();
    setCountryState(detected);

    // Also check if authenticated user has a saved preference
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const { data } = await supabase
            .from('user_profiles')
            .select('country_code')
            .eq('email', session.user.email)
            .single();
          
          if (data?.country_code) {
            setCountryState(data.country_code);
            localStorage.setItem('gn_country', data.country_code);
          }
        }
      } catch {
        // Profile fetch failed — use detected country
      }
    })();
  }, []);

  // Fetch prices whenever country changes
  useEffect(() => {
    let mounted = true;
    setIsReady(false);
    getAllPricesForCountry(country).then(data => {
      if (mounted) {
        setPrices(data);
        setIsReady(true);
      }
    });
    return () => { mounted = false; };
  }, [country]);

  const setCountry = useCallback((code: string) => {
    setCountryState(code);
    localStorage.setItem('gn_country', code);

    // Sync to user profile if authenticated
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          await supabase
            .from('user_profiles')
            .update({ country_code: code })
            .eq('email', session.user.email);
        }
      } catch {
        // Profile update failed — preference still saved locally
      }
    })();
  }, []);

  const currency = getCurrencyForCountry(country);
  const isIndia = isIndiaCountry(country);
  const razorpayCurrency = isRazorpayCurrency(currency) ? currency : 'INR';
  const currencyMultiplier = getCurrencyMultiplier(razorpayCurrency);
  const countryInfo = PRIORITY_COUNTRIES.find(c => c.code === country);

  const formatPrice = useCallback((amount: number, overrideCurrency?: string) => {
    return formatPriceUtil(amount, overrideCurrency || currency);
  }, [currency]);

  const getPrice = useCallback((productId: string) => {
    return prices[productId]?.price || PRODUCT_CATALOG[productId]?.defaultPriceINR || 0;
  }, [prices]);

  const convertPrice = useCallback((amountInINR: number) => {
    if (currency === 'INR') return amountInINR;
    
    // Fallback conversion rates (approximate)
    const rates: Record<string, number> = {
      'USD': 0.012, // 1 INR = 0.012 USD (~83 INR/USD)
      'GBP': 0.0094, // ~106 INR/GBP
      'EUR': 0.011, // ~90 INR/EUR
      'CAD': 0.016, // ~61 INR/CAD
      'AUD': 0.018, // ~55 INR/AUD
      'AED': 0.044, // ~22 INR/AED
      'SGD': 0.016, // ~61 INR/SGD
      'SAR': 0.045, // ~22 INR/SAR
    };

    const rate = rates[currency] || 0.012; // Fallback to USD rate for unknown currencies
    const converted = amountInINR * rate;
    
    // Round to 99 cents/pence if greater than 1, otherwise 2 decimal places
    if (converted > 1) {
      return Math.floor(converted) + 0.99;
    }
    return Number(converted.toFixed(2));
  }, [currency]);

  return (
    <CountryContext.Provider value={{
      country,
      currency,
      isIndia,
      setCountry,
      formatPrice,
      getPrice,
      convertPrice,
      razorpayCurrency,
      currencyMultiplier,
      countryInfo,
      isReady,
    }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}

export default CountryContext;
