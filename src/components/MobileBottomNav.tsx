"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, FolderOpen, Sparkles, Rocket, Brain, Briefcase,
  BarChart3, BookOpen, FileText, PenTool, Menu, X, UserCircle,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * MobileBottomNav — Enhanced with:
 * 1. Horizontal scrollable quick-links bar ABOVE the main nav tabs
 *    (shows all secondary pages the old nav hid behind "Menu")
 * 2. Pulsing dot indicators on high-value tabs
 * 3. Better icon+label accessibility
 */

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showQuickBar, setShowQuickBar] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Hide quick bar when scrolling down, show when scrolling up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setShowQuickBar(false);
      } else {
        setShowQuickBar(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FolderOpen, label: "Projects", href: "/projects", dot: true },
    { icon: Sparkles, label: "Resume", href: "/resume" },
    { icon: Brain, label: "AI Tools", href: "/ai-services", badge: "New" },
    { icon: Briefcase, label: "Jobs", href: "/jobs-updates", dot: true },
  ];

  const quickBarLinks = [
    { label: "🏆 Hackathons", href: "/hackathons" },
    { label: "📚 Study Hub", href: "/study" },
    { label: "💰 Pricing", href: "/pricing" },
    { label: "📝 Blog", href: "/blog" },
    { label: "🎯 Custom Work", href: "/custom-requirements" },
    { label: "ℹ️ About", href: "/about" },
    { label: "📞 Contact", href: "/contact" },
  ];

  const allMenuLinks = [
    { label: "Hackathons", href: "/hackathons", icon: Rocket, emoji: "🏆" },
    { label: "Study Hub", href: "/study", icon: BookOpen, emoji: "📚" },
    { label: "Pricing", href: "/pricing", icon: BarChart3, emoji: "💰" },
    { label: "Blog", href: "/blog", icon: FileText, emoji: "📝" },
    { label: "Custom Requirements", href: "/custom-requirements", icon: PenTool, emoji: "🎯" },
    { label: "About Us", href: "/about", icon: UserCircle, emoji: "ℹ️" },
    { label: "Contact", href: "/contact", icon: Briefcase, emoji: "📞" },
  ];

  return (
    <>
      {/* Full-screen slide-up menu for the "Menu" button */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden flex flex-col pt-20 pb-24 px-6 overflow-y-auto animate-in slide-in-from-bottom-full duration-300">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold">All Pages</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-muted rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-2">
            {allMenuLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold border border-primary/20"
                      : "bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    isActive ? "bg-primary/20" : "bg-muted"
                  }`}>
                    {link.emoji}
                  </div>
                  <span className="text-lg font-semibold flex-1">{link.label}</span>
                  <ChevronRight className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t flex flex-col gap-4">
            {user ? (
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-primary bg-primary/10 p-4 rounded-2xl">
                <UserCircle className="w-6 h-6" />
                My Dashboard
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 bg-primary text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Quick Bar — sits above the main bottom nav */}
      <div
        className={`lg:hidden fixed left-0 w-full z-50 transition-all duration-300 ${
          showQuickBar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        style={{ bottom: "64px" }}
      >
        <div className="bg-background/95 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 px-2 py-2">
          <div className="flex overflow-x-auto gap-2 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {quickBarLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "bg-zinc-100 dark:bg-zinc-800 text-foreground/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar — Main 5 tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-xl border-t z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="flex justify-around items-center h-16 px-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform relative"
              >
                <div className={`p-1.5 rounded-2xl transition-all relative ${isActive ? 'bg-primary/15 text-primary scale-110' : 'text-muted-foreground'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
                  {/* Pulsing dot for high-value tabs */}
                  {item.dot && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                  {/* Badge for new items */}
                  {item.badge && !isActive && (
                    <span className="absolute -top-1.5 -right-3 text-[8px] font-black bg-violet-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform"
          >
            <div className={`p-1.5 rounded-2xl transition-all ${isMenuOpen ? 'bg-primary/15 text-primary scale-110' : 'text-muted-foreground'}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-semibold tracking-wide ${isMenuOpen ? 'text-primary' : 'text-muted-foreground'}`}>
              More
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
