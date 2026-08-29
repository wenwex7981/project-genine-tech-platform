"use client";

import { useState, useEffect } from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PromoBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("promo_bar_dismissed");
    if (dismissed) return;

    const showTimer = setTimeout(() => setIsVisible(true), 2000);

    const calcTimeLeft = () => {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const nowIST = new Date(now.getTime() + istOffset);
      const tomorrowIST = new Date(nowIST);
      tomorrowIST.setHours(24, 0, 0, 0);
      const diff = tomorrowIST.getTime() - nowIST.getTime();

      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calcTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("promo_bar_dismissed", "true");
  };

  if (!isVisible) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="fixed top-0 left-0 right-0 z-[90] overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 py-2.5 text-sm relative">
            <Zap className="h-4 w-4 text-yellow-300 fill-yellow-300 flex-shrink-0 hidden sm:block" />

            <span className="font-bold hidden md:inline">🔥 TODAY ONLY:</span>
            <span className="font-bold md:hidden">🔥</span>

            <span className="font-semibold">
              <span className="hidden sm:inline">All Access Pass </span>
              <strong className="text-yellow-200">₹799</strong>
              <span className="line-through opacity-70 ml-1 text-xs">₹1,499</span>
            </span>

            <span className="hidden md:inline text-white/80">—</span>

            {/* Timer */}
            <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full font-mono text-xs font-black tracking-wider">
              <span>{pad(timeLeft.hours)}</span>
              <span className="animate-pulse">:</span>
              <span>{pad(timeLeft.minutes)}</span>
              <span className="animate-pulse">:</span>
              <span>{pad(timeLeft.seconds)}</span>
            </div>

            <Link
              href="/pricing"
              className="hidden sm:inline-flex items-center gap-1 bg-white text-violet-700 px-3 py-1 rounded-full text-xs font-black hover:bg-yellow-100 transition-colors shadow-sm"
            >
              Claim Now <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/pricing"
              className="sm:hidden inline-flex items-center gap-1 bg-white text-violet-700 px-2.5 py-1 rounded-full text-xs font-black"
            >
              Go <ArrowRight className="h-3 w-3" />
            </Link>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="absolute right-2 md:right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Dismiss promotion"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
