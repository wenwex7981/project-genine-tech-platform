"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Gift, ArrowRight, X, Tag, Clock } from "lucide-react";
import Link from "next/link";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 5 && !hasShown) {
        const alreadyShown = sessionStorage.getItem("exit_intent_shown");
        if (alreadyShown) return;

        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    },
    [hasShown]
  );

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsVisible(false)} />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <Gift className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            Wait! Here&apos;s a Gift 🎁
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            We don&apos;t want you to leave empty-handed. Here&apos;s an exclusive discount just for you.
          </p>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-2xl p-5 mb-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3 w-3" /> Exclusive Offer
            </div>
            <div className="mt-2">
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
                Use code at checkout:
              </p>
              <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl px-6 py-3 inline-flex items-center gap-3">
                <span className="text-2xl font-black tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                  STAY50
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("STAY50");
                    alert("Coupon code STAY50 copied!");
                  }}
                  className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Clock className="h-3.5 w-3.5" />
                Valid for today only
              </div>
            </div>
          </div>

          <Link href="/pricing">
            <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl">
              Claim ₹50 Off Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            No thanks, I&apos;ll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
