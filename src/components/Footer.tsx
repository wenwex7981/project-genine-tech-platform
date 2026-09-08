import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Globe, CreditCard } from "lucide-react";
import { seoLocations } from "@/lib/seo-data";

export default function Footer() {
  const countries = seoLocations.filter(loc => loc.type === 'country');
  const states = seoLocations.filter(loc => loc.type === 'state');
  const cities = seoLocations.filter(loc => loc.type === 'city');
  const universities = seoLocations.filter(loc => loc.type === 'university');

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
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-zinc-900 border border-zinc-800 text-sm px-4 py-2 rounded-lg w-full outline-none focus:border-primary transition-colors" />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Subscribe
              </button>
            </div>
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
          <div className="flex items-center gap-4">
            {/* Social Icons Mock */}
            <div className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-primary transition-colors cursor-pointer"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
