"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { X, Sparkles, GraduationCap } from "lucide-react";
import Link from "next/link";

interface SignupNudgeProps {
  immediate?: boolean;
  headline?: string;
  subtext?: string;
}

export default function SignupNudge({
  immediate = false,
  headline = "Save your progress — free account",
  subtext = "Sign up in 5 seconds with Google. No password needed.",
}: SignupNudgeProps) {
  const [show, setShow] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const maybeShow = useCallback(() => {
    if (sessionStorage.getItem("nudge_dismissed")) return;
    if (!loggedIn) setShow(true);
  }, [loggedIn]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setLoggedIn(true); return; }

      if (immediate) {
        const t = setTimeout(maybeShow, 1200);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(maybeShow, 45000);
        return () => clearTimeout(t);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) { setLoggedIn(true); setShow(false); }
    });

    return () => subscription.unsubscribe();
  }, [immediate, maybeShow]);

  const handleDismiss = () => {
    sessionStorage.setItem("nudge_dismissed", "1");
    setShow(false);
  };

  if (!show || loggedIn) return null;

  return (
    // Mobile: sits ABOVE bottom nav (bottom-[7.5rem]) + above WhatsApp btn
    // Desktop: standard bottom-right corner (bottom-6 right-6)
    <div className="fixed bottom-[7.5rem] left-3 right-3 md:left-auto md:right-6 md:bottom-6 md:w-[360px] z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/40 p-4 md:p-5 relative">
        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon + label */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">GraduateNex</span>
        </div>

        <h3 className="text-white font-bold text-sm md:text-base mb-1 pr-6">{headline}</h3>
        <p className="text-zinc-400 text-xs md:text-sm mb-3">{subtext}</p>

        {/* Benefits — hidden on very small screens to keep popup compact */}
        <ul className="hidden sm:block space-y-1.5 mb-3">
          {["Save reports & track progress", "Access premium project previews", "Personalized interview prep"].map(b => (
            <li key={b} className="flex items-center gap-2 text-xs text-zinc-300">
              <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>

        {/* CTA — large tap target for mobile */}
        <Link
          href="/login"
          className="block w-full text-center bg-primary hover:bg-primary/90 text-white font-bold text-sm py-3 rounded-xl transition-colors active:scale-95"
        >
          Sign up free with Google →
        </Link>

        <button
          onClick={handleDismiss}
          className="block w-full text-center text-zinc-500 text-xs mt-2 hover:text-zinc-400 transition-colors py-1"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
