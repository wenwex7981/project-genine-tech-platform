"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PRODUCT_CATALOG } from "@/lib/i18n/pricing";
import { formatPrice } from "@/lib/i18n/countries";
import { Globe, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InternationalPricingAdmin() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'countries' | 'pricing'>('countries');
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [pricingData, setPricingData] = useState<Record<string, { price: number; currency: string }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('adminAuth') === 'true';
    if (!isAdmin) {
      window.location.href = '/admin/login';
      return;
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (activeTab === 'pricing') {
      fetchPricing(selectedCountry);
    }
  }, [selectedCountry, activeTab]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (data && !error) {
        setCountries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricing = async (countryCode: string) => {
    try {
      const { data, error } = await supabase
        .from('country_pricing')
        .select('*')
        .eq('country_code', countryCode);
      
      const newPricing: Record<string, { price: number; currency: string }> = {};
      if (data && !error) {
        data.forEach((row) => {
          newPricing[row.product_id] = { price: row.price, currency: row.currency_code };
        });
      }
      setPricingData(newPricing);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCountryToggle = async (id: string, field: 'is_active' | 'is_priority', currentValue: boolean) => {
    try {
      await supabase
        .from('countries')
        .update({ [field]: !currentValue })
        .eq('id', id);
      fetchCountries();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriceChange = (productId: string, value: string) => {
    setPricingData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        price: Number(value) || 0,
        // Set default currency if missing based on selected country
        currency: prev[productId]?.currency || countries.find(c => c.code === selectedCountry)?.currency_code || 'USD'
      }
    }));
  };

  const handleSavePricing = async () => {
    try {
      setSaving(true);
      const country = countries.find(c => c.code === selectedCountry);
      if (!country) return;

      const upserts = Object.keys(PRODUCT_CATALOG).map((productId) => {
        const pd = pricingData[productId];
        return {
          product_id: productId,
          country_code: selectedCountry,
          price: pd?.price || 0,
          currency_code: pd?.currency || country.currency_code,
          is_active: true
        };
      });

      await supabase.from('country_pricing').upsert(upserts, { onConflict: 'product_id,country_code' });
      alert('Pricing saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save pricing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading international settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">International Pricing Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('countries')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'countries' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Countries
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'pricing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Pricing
        </button>
      </div>

      {activeTab === 'countries' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold">Code</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Currency</th>
                  <th className="p-4 font-semibold text-center">Active</th>
                  <th className="p-4 font-semibold text-center">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {countries.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{c.code}</td>
                    <td className="p-4">{c.name}</td>
                    <td className="p-4">{c.currency_code}</td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={c.is_active}
                        onChange={() => handleCountryToggle(c.id, 'is_active', c.is_active)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={c.is_priority}
                        onChange={() => handleCountryToggle(c.id, 'is_priority', c.is_priority)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">Select Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.filter(c => c.is_active).map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.currency_code})</option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleSavePricing}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Pricing
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold">Product ID</th>
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">Default Price (INR)</th>
                  <th className="p-4 font-semibold">Local Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(PRODUCT_CATALOG).map(([id, product]) => (
                  <tr key={id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 text-xs font-mono">{id}</td>
                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                    <td className="p-4 text-gray-500">{formatPrice(product.defaultPriceINR, 'INR')}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium w-8">
                          {countries.find(c => c.code === selectedCountry)?.currency_code}
                        </span>
                        <input
                          type="number"
                          value={pricingData[id]?.price ?? ''}
                          onChange={(e) => handlePriceChange(id, e.target.value)}
                          className="bg-white border border-gray-300 rounded px-3 py-1.5 w-32 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
