"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle2, Clock, Users, ArrowRight, Loader2, X, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeWallProps {
  isOpen: boolean;
  onClose: () => void;
  /** What the tool is called, e.g. "Abstract Generator" */
  toolName: string;
  /** What the user will lose / miss, shown as bullet points */
  lockedFeatures?: string[];
  /** Pay-per-use price in INR */
  payPerUsePrice?: number;
  /** Pay-per-use label */
  payPerUseLabel?: string;
  /** Callback when pay-per-use is clicked (parent handles Razorpay) */
  onPayPerUse?: () => void;
  /** Plan to push to on "View Plans" */
  planRoute?: string;
  /** Flash discount: original price */
  originalPrice?: number;
  /** Flash discount: discounted price */
  discountPrice?: number;
  /** Flash discount: plan name */
  discountPlanName?: string;
  /** Callback when flash discount is purchased */
  onFlashPurchase?: () => void;
}

const SOCIAL_PROOF_MESSAGES = [
  "847 students upgraded this week",
  "Priya from VIT unlocked Premium today",
  "Rahul scored 95% after upgrading",
  "1,200+ students use Premium daily",
  "Sai from JNTUH went Pro yesterday",
];

export default function UpgradeWall({
  isOpen,
  onClose,
  toolName,
  lockedFeatures = [
    "Unlimited generations",
    "Priority AI processing",
    "No watermarks or limits",
    "Premium templates & exports",
  ],
  payPerUsePrice,
  payPerUseLabel,
  onPayPerUse,
  planRoute = "/pricing",
  originalPrice = 200,
  discountPrice = 99,
  discountPlanName = "Premium Access",
  onFlashPurchase,
}: UpgradeWallProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [socialIndex, setSocialIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Rotate social proof
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSocialIndex((prev) => (prev + 1) % SOCIAL_PROOF_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  if (!isOpen) return null;

  const discountPercent = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Top gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Icon + Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
              Unlock {toolName}
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              You&apos;ve used your free trial. Upgrade now to continue using this tool without limits.
            </p>
          </div>

          {/* Flash deal banner */}
          {timeLeft > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-600 fill-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Flash Deal — {discountPercent}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-sm font-mono font-black text-amber-700 dark:text-amber-400">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-800 dark:text-amber-300">₹{discountPrice}</span>
                  <span className="text-lg text-amber-600/60 line-through">₹{originalPrice}</span>
                </div>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">/ 30 days</span>
              </div>
              <Button
                onClick={() => {
                  if (onFlashPurchase) {
                    setIsProcessing(true);
                    onFlashPurchase();
                    setTimeout(() => setIsProcessing(false), 3000);
                  } else {
                    router.push(planRoute);
                  }
                }}
                disabled={isProcessing}
                className="w-full mt-3 h-12 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 rounded-xl"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Claim Flash Deal
                  </>
                )}
              </Button>
            </div>
          )}

          {/* What you'll unlock */}
          <div className="space-y-2.5 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What you&apos;ll unlock</p>
            {lockedFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Divider with OR */}
          <div className="relative flex items-center py-3">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs font-bold uppercase tracking-widest">
              or choose
            </span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
          </div>

          {/* Action buttons */}
          <div className="space-y-3 mt-3">
            {payPerUsePrice && onPayPerUse && (
              <Button
                onClick={() => {
                  setIsProcessing(true);
                  onPayPerUse();
                  setTimeout(() => setIsProcessing(false), 3000);
                }}
                disabled={isProcessing}
                variant="outline"
                className="w-full h-12 text-base font-bold rounded-xl border-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Pay ₹{payPerUsePrice} {payPerUseLabel || "for 1 Use"}</>
                )}
              </Button>
            )}
            <Button
              onClick={() => router.push(planRoute)}
              variant="ghost"
              className="w-full h-12 text-base font-bold rounded-xl text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/30"
            >
              <Zap className="mr-2 h-4 w-4 fill-violet-500" />
              View All Premium Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Social proof ticker */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span key={socialIndex} className="font-medium">
              {SOCIAL_PROOF_MESSAGES[socialIndex]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
