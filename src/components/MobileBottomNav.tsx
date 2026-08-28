"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, Sparkles, Menu, X, Rocket, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: FolderOpen, label: "Projects", href: "/projects" },
    { icon: Sparkles, label: "AI Tools", href: "/ai-services" },
    { icon: Rocket, label: "Services", href: "/services" },
  ];

  const secondaryLinks = [
    { label: "Resume Hub", href: "/resume" },
    { label: "Hackathons", href: "/hackathons" },
    { label: "Study Hub", href: "/study" },
    { label: "Jobs Updates", href: "/jobs-updates" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      {/* Full-screen slide-up menu for the "Menu" button */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background md:hidden flex flex-col pt-20 pb-24 px-6 overflow-y-auto animate-in slide-in-from-bottom-full duration-300">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold">More Options</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-muted rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-5">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-xl font-medium transition-colors flex items-center justify-between ${
                  pathname.startsWith(link.href) ? "text-primary font-bold" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
                {link.href === '/jobs-updates' && (
                  <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Live</span>
                )}
              </Link>
            ))}
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

      {/* Fixed Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-xl border-t z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform"
              >
                <div className={`p-1.5 rounded-2xl transition-all ${isActive ? 'bg-primary/15 text-primary scale-110' : 'text-muted-foreground'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
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
              Menu
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
