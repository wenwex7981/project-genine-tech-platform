"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import Link from "next/link";

export default function SignupBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("signup_banner_dismissed")) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setShow(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setShow(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("signup_banner_dismissed", "1");
    setDismissed(true);
    setShow(false);
  };

  if (!show || dismissed) return null;

  return (
    <div className="relative z-50 w-full bg-gradient-to-r from-primary via-orange-500 to-primary text-white px-4 py-2">
      <div className="flex items-center justify-center gap-2 flex-wrap text-center">
        {/* Short text on mobile, full text on md+ */}
        <span className="text-xs md:text-sm font-medium">
          <span className="md:hidden">🎓 Free account — save reports & more</span>
          <span className="hidden md:inline">🎓 Join <strong>2,500+ students</strong> — Free account unlocks saved reports, downloads & more</span>
        </span>
        <Link
          href="/login"
          className="inline-block bg-white text-primary font-bold text-xs px-3 py-1 rounded-full hover:bg-orange-50 transition-colors flex-shrink-0 active:scale-95"
        >
          Sign up free →
        </Link>
      </div>
      {/* Dismiss — accessible tap target */}
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
