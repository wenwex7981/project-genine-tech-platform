"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FolderOpen, Sparkles, Brain, Rocket, Briefcase, BarChart3,
  FileText, PenTool, BookOpen, X, ChevronDown
} from "lucide-react";

/**
 * MobileQuickExplore — A floating "Explore More" nudge that appears
 * after 4 seconds of idle on the homepage on mobile devices.
 * Shows a pill CTA that expands into a full quick-link grid.
 * Goal: break the "stuck on homepage" pattern seen in Clarity/GA data.
 */

const EXPLORE_LINKS = [
  { icon: FolderOpen, label: "Projects", href: "/projects", color: "from-blue-500 to-blue-600", badge: "120+" },
  { icon: Sparkles, label: "Resume Hub", href: "/resume", color: "from-orange-500 to-amber-500", badge: "AI" },
  { icon: Brain, label: "AI Tools", href: "/ai-services", color: "from-violet-500 to-purple-600", badge: "New" },
  { icon: Rocket, label: "Hackathons", href: "/hackathons", color: "from-rose-500 to-pink-600", badge: "Live" },
  { icon: Briefcase, label: "Jobs", href: "/jobs-updates", color: "from-emerald-500 to-green-600", badge: "🔴" },
  { icon: BookOpen, label: "Study Hub", href: "/study", color: "from-cyan-500 to-teal-600" },
  { icon: BarChart3, label: "Pricing", href: "/pricing", color: "from-amber-500 to-yellow-600" },
  { icon: FileText, label: "Blog", href: "/blog", color: "from-slate-500 to-gray-600" },
  { icon: PenTool, label: "Custom Work", href: "/custom-requirements", color: "from-indigo-500 to-blue-600", badge: "Pro" },
];

export default function MobileQuickExplore() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPill, setShowPill] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Only show on homepage, only on mobile
  useEffect(() => {
    if (pathname !== "/") return;
    if (window.innerWidth >= 1024) return;

    const alreadySeen = sessionStorage.getItem("explore_pill_seen");
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setShowPill(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (pathname !== "/" || dismissed || (!showPill && !isExpanded)) return null;

  const handleDismiss = () => {
    setDismissed(true);
    setIsExpanded(false);
    sessionStorage.setItem("explore_pill_seen", "true");
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={handleDismiss}
          style={{ animation: "fadeIn 0.2s ease-out" }}
        />
      )}

      {/* Floating pill / Expanded panel */}
      <div className="fixed z-[75] lg:hidden" style={{
        bottom: isExpanded ? "0" : "80px",
        left: isExpanded ? "0" : "50%",
        right: isExpanded ? "0" : "auto",
        transform: isExpanded ? "none" : "translateX(-50%)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}>
        {!isExpanded ? (
          /* Floating Pill CTA */
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white font-bold text-sm shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-transform"
            style={{
              animation: "bounceIn 0.5s ease-out, pulseGlow 2s ease-in-out infinite 1s"
            }}
          >
            <span className="text-lg">🚀</span>
            Explore All Services
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        ) : (
          /* Expanded Panel */
          <div
            className="bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-x border-zinc-200 dark:border-zinc-800 shadow-2xl pb-24 max-h-[70vh] overflow-y-auto"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-zinc-900 z-10 px-5 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg">Explore GraduateNex</h3>
                <p className="text-xs text-muted-foreground">Tap any service to explore</p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-3 gap-3 p-4">
              {EXPLORE_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleDismiss}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-primary/30 hover:bg-primary/5 active:scale-95 transition-all relative"
                  >
                    {link.badge && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                        {link.badge}
                      </span>
                    )}
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-center leading-tight">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom prompt */}
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-primary">🎯 Students explore 3+ services on average</p>
                <p className="text-xs text-muted-foreground mt-1">Discover tools that boost your career & grades</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: translateX(-50%) scale(0.3); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
          100% { transform: translateX(-50%) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 10px 40px -10px rgba(249, 115, 22, 0.4); }
          50% { box-shadow: 0 10px 60px -10px rgba(249, 115, 22, 0.7); }
        }
      `}</style>
    </>
  );
}
