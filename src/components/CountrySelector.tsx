'use client';

import { useState, useRef, useEffect } from 'react';
import { useCountry } from '@/context/CountryContext';
import { PRIORITY_COUNTRIES, type Country } from '@/lib/i18n/countries';
import { supabase } from '@/lib/supabase';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';

// Extended country list fetched from DB, with static fallback
function useCountryList() {
  const [countries, setCountries] = useState<Country[]>(PRIORITY_COUNTRIES);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('countries')
          .select('code, name, currency_code, currency_symbol, flag_emoji, is_priority')
          .eq('is_active', true)
          .order('is_priority', { ascending: false })
          .order('name', { ascending: true });

        if (data && data.length > 0) {
          setCountries(data.map(c => ({
            code: c.code,
            name: c.name,
            currencyCode: c.currency_code,
            currencySymbol: c.currency_symbol,
            flagEmoji: c.flag_emoji || '',
            isPriority: c.is_priority,
          })));
        }
      } catch {
        // Use static fallback
      }
    })();
  }, []);

  return countries;
}

export default function CountrySelector() {
  const { country, setCountry, currency, countryInfo } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const countries = useCountryList();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const priorityCountries = filtered.filter(c => c.isPriority);
  const otherCountries = filtered.filter(c => !c.isPriority);

  const handleSelect = (code: string) => {
    setCountry(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
        aria-label="Select country"
      >
        <span className="text-base leading-none">{countryInfo?.flagEmoji || '🌐'}</span>
        <span className="hidden sm:inline text-xs font-bold">{country}</span>
        <span className="hidden md:inline text-[10px] text-zinc-400 font-medium">{currency}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Select Country</span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search countries..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-72 overflow-y-auto px-2 pb-2">
            {/* Priority Markets */}
            {priorityCountries.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Priority Markets
                </div>
                {priorityCountries.map(c => (
                  <CountryRow key={c.code} country={c} selected={country === c.code} onSelect={handleSelect} />
                ))}
              </>
            )}

            {/* Other Countries */}
            {otherCountries.length > 0 && (
              <>
                <div className="px-2 py-1.5 mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  All Countries
                </div>
                {otherCountries.map(c => (
                  <CountryRow key={c.code} country={c} selected={country === c.code} onSelect={handleSelect} />
                ))}
              </>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-6 text-sm text-zinc-400">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CountryRow({ country, selected, onSelect }: { country: Country; selected: boolean; onSelect: (code: string) => void }) {
  return (
    <button
      onClick={() => onSelect(country.code)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
        selected 
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
      }`}
    >
      <span className="text-lg leading-none w-6 text-center">{country.flagEmoji}</span>
      <span className="flex-1 text-left font-medium truncate">{country.name}</span>
      <span className="text-xs text-zinc-400 font-medium">{country.currencySymbol}</span>
      {selected && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
    </button>
  );
}
