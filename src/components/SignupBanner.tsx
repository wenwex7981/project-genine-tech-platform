"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import Link from "next/link";

export default function SignupBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
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
    <div className="relative z-50 w-full bg-gradient-to-r from-primary via-orange-500 to-primary text-white py-2.5 px-4 text-center text-sm font-medium">
      <span className="mr-2">🎓 Join <strong>2,500+ students</strong> — Free account unlocks saved reports, downloads & more</span>
      <Link
        href="/login"
        className="inline-block bg-white text-primary font-bold text-xs px-3 py-1 rounded-full hover:bg-orange-50 transition-colors mr-3"
      >
        Sign up free →
      </Link>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
