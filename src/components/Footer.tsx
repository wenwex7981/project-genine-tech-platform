"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Globe, CreditCard } from "lucide-react";
import { seoLocations } from "@/lib/seo-data";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const countries = seoLocations.filter(loc => loc.type === 'country');
  const states = seoLocations.filter(loc => loc.type === 'state');
  const cities = seoLocations.filter(loc => loc.type === 'city');
  const universities = seoLocations.filter(loc => loc.type === 'university');

  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubStatus("loading");
    try {
      const { error } = await supabase.from("newsletter_subscribers").upsert(
        { email, subscribed_at: new Date().toISOString() },
        { onConflict: "email" }
      );
      if (error) throw error;
      setSubStatus("success");
      setEmail("");
    } catch {
      setSubStatus("error");
    }
  };

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 py-16 mt-auto border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white p-1">
                <Image src="/logo.png" alt="Logo" fill className="object-cover rounded-lg" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">GraduateNex</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              The world&apos;s premier academic success platform — empowering students in 50+ countries with production-ready projects, AI-powered career tools, thesis help, and zero-plagiarism documentation.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <p className="text-sm flex items-center gap-2"><Mail className="h-4 w-4" /> support@graduatenex.online</p>
              <p className="text-sm flex items-center gap-2"><Phone className="h-4 w-4" /> +91 79819 94870</p>
              <p className="text-sm flex items-center gap-2"><Globe className="h-4 w-4" /> Serving 50+ countries worldwide</p>
            </div>
            {/* Payment Badges */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-300">
                <CreditCard className="h-3.5 w-3.5" /> Visa
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-300">
                <CreditCard className="h-3.5 w-3.5" /> Mastercard
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-300">
                <CreditCard className="h-3.5 w-3.5" /> Amex
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 lg:ml-12">
            <h3 className="text-lg font-bold text-white">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm hover:text-primary transition-colors">Who Are We</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/projects" className="text-sm hover:text-primary transition-colors">Browse Projects</Link></li>
              <li><Link href="/resume" className="text-sm hover:text-primary transition-colors">Resume Hub</Link></li>
              <li><Link href="/hackathons" className="text-sm hover:text-primary transition-colors">Hackathons</Link></li>
              <li><Link href="/ai-services" className="text-sm hover:text-primary transition-colors">AI Tools</Link></li>
              <li><Link href="/blog" className="text-sm hover:text-primary transition-colors">Blog & Guides</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-sm hover:text-primary transition-colors">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="text-sm hover:text-primary transition-colors">Refund & Cancellation Policy</Link></li>
              <li><Link href="/delivery" className="text-sm hover:text-primary transition-colors">Delivery Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Stay Updated</h3>
            <p className="text-sm text-zinc-400">Subscribe for the latest projects, hackathon alerts, and career resources.</p>
            {subStatus === "success" ? (
              <div className="bg-emerald-900/30 border border-emerald-700 rounded-lg px-4 py-3 text-emerald-400 text-sm font-semibold">
                ✅ You&apos;re subscribed! We&apos;ll keep you updated.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-zinc-900 border border-zinc-800 text-sm px-4 py-2 rounded-lg w-full outline-none focus:border-primary transition-colors text-white placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={subStatus === "loading"}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
                >
                  {subStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
            )}
            {subStatus === "error" && (
              <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>
            )}
          </div>

        </div>

        {/* Countries We Serve */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-4">🌍 Countries We Serve</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-600">
            {countries.map((country) => (
              <Link key={country.slug} href={`/locations/${country.slug}`} className="hover:text-primary hover:underline transition-colors">
                {country.name}
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Locations & Universities */}
        <div className="mt-8 pt-6 border-t border-zinc-800/50">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Indian States</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-600">
            {states.map((state) => (
              <Link key={state.slug} href={`/locations/${state.slug}`} className="hover:text-primary hover:underline transition-colors">
                {state.name}
              </Link>
            ))}
          </div>
          
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-6 mb-4">Major Cities</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-600">
            {cities.map((city) => (
              <Link key={city.slug} href={`/locations/${city.slug}`} className="hover:text-primary hover:underline transition-colors">
                {city.name}
              </Link>
            ))}
          </div>

          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-6 mb-4">Top Universities & Institutions We Support</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-600">
            {universities.map((uni) => (
              <Link key={uni.slug} href={`/locations/${uni.slug}`} className="hover:text-primary hover:underline transition-colors">
                {uni.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} GraduateNex. All rights reserved. Serving students in 50+ countries.
          </p>
          <div className="flex items-center gap-3">
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/graduatenex" target="_blank" rel="noopener noreferrer" aria-label="GraduateNex on LinkedIn"
              className="h-9 w-9 rounded-full bg-zinc-800 hover:bg-[#0077B5] transition-colors flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-300" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="https://twitter.com/graduatenex" target="_blank" rel="noopener noreferrer" aria-label="GraduateNex on Twitter/X"
              className="h-9 w-9 rounded-full bg-zinc-800 hover:bg-zinc-600 transition-colors flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-300" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/graduatenex" target="_blank" rel="noopener noreferrer" aria-label="GraduateNex on Instagram"
              className="h-9 w-9 rounded-full bg-zinc-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-colors flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-zinc-300" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
