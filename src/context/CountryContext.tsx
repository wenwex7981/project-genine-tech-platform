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
  /** Get the Razorpay-compatible currency (falls back to INR) */
  razorpayCurrency: string;
  /** Get the currency multiplier for Razorpay (100 for most, 1 for JPY etc.) */
  currencyMultiplier: number;
  /** Country info object */
  countryInfo: Country | undefined;
  /** Whether the country has been detected/loaded */
  isReady: boolean;
}

const CountryContext = createContext<CountryContextType>({
  country: 'IN',
  currency: 'INR',
  isIndia: true,
  setCountry: () => {},
  formatPrice: (amount) => `₹${amount}`,
  razorpayCurrency: 'INR',
  currencyMultiplier: 100,
  countryInfo: PRIORITY_COUNTRIES[0],
  isReady: false,
});

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState('IN');
  const [isReady, setIsReady] = useState(false);

  // Detect country on mount
  useEffect(() => {
    const detected = detectUserCountry();
    setCountryState(detected);
    setIsReady(true);

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

  return (
    <CountryContext.Provider value={{
      country,
      currency,
      isIndia,
      setCountry,
      formatPrice,
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
