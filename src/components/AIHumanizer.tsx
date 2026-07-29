"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ShieldAlert, Sparkles, Wand2, Upload, Printer, Lock, Zap, X, CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAILS = ["projectgenie16@gmail.com", "proejctgenie16@gmail.com", "nithinpatel2025@gmail.com"];
const USAGE_KEY = "ai_humanizer_used";
const PRO_PRICE = 230;

export default function AIHumanizer() {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ originalAiScore: number, newAiScore: number, humanizedText: string } | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email || null);
      setIsCheckingSession(false);
    });
  }, []);

  const isAdmin = ADMIN_EMAILS.includes(userEmail || "");
  const hasUsedFree = typeof window !== "undefined" && localStorage.getItem(USAGE_KEY) === "true";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setText(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleHumanize = async () => {
    if (!text) return;

    // Check free usage limit (skip for admins)
    if (!isAdmin && hasUsedFree) {
      setShowUpgradeModal(true);
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to process text');
      }

      const data = await response.json();
      setResult(data);

      // Mark free usage used (only for non-admins)
      if (!isAdmin) {
        localStorage.setItem(USAGE_KEY, "true");
      }
    } catch (error: any) {
      console.error('Error humanizing text:', error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgradePayment = async () => {
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: PRO_PRICE }),
      });
      if (!res.ok) throw new Error("Could not create order");
      const order = await res.json();

      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "GraduateNex",
        description: "AI Humanizer Pro - Unlimited Access",
        order_id: order.id,
        modal: {
          ondismiss: () => { document.body.style.overflow = ""; }
        },
        handler: function () {
          document.body.style.overflow = "";
          localStorage.removeItem(USAGE_KEY);
          setShowUpgradeModal(false);
          alert("🎉 Pro unlocked! You now have unlimited AI Humanizer access.");
        },
        prefill: { email: userEmail || "" },
        theme: { color: "#4f46e5" }
      });
      rzp.open();
    } catch (err) {
      document.body.style.overflow = "";
      alert("Could not initiate payment. Please try again.");
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-green-500 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900";
    if (score < 70) return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900";
    return "text-red-500 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900";
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Wand2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Plagiarism Checker & Humanizer</h2>
            <p className="text-muted-foreground text-sm">Rewrite AI text with natural, human-like flow and academic tone.</p>
          </div>
          {!isAdmin && (
            <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${hasUsedFree ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {hasUsedFree ? "Free used · Upgrade for more" : "1 Free use remaining"}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 no-print">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="ai-text" className="block text-sm font-semibold">Paste your AI-generated text here</label>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.md" className="hidden" />
            </div>
            <textarea
              id="ai-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your essay, report, or abstract here..."
              className="w-full min-h-[200px] p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>

          <Button
            onClick={handleHumanize}
            disabled={!text || isProcessing || isCheckingSession}
            size="lg"
            className="w-full h-12 text-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isProcessing ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing & Humanizing...</>
            ) : !isAdmin && hasUsedFree ? (
              <><Lock className="mr-2 h-5 w-5" />Upgrade to Pro — ₹{PRO_PRICE}</>
            ) : (
              <><ShieldCheck className="mr-2 h-5 w-5" />Analyze & Humanize Text</>
            )}
          </Button>
        </div>

        {result && (
          <div id="printable-report" className="mt-8 pt-8 border-t animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-zinc-900 rounded-xl relative">
            <div className="hidden print:block mb-8 pb-4 border-b-2 border-red-600">
              <h1 className="text-3xl font-extrabold text-red-600 uppercase tracking-widest">Plagiarism Analysis Report</h1>
              <p className="text-gray-500 mt-2 text-sm">Generated by AI Detection Engine</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col gap-4">
                <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(result.originalAiScore)}`}>
                  {result.originalAiScore > 70 ? <ShieldAlert className="h-8 w-8 mb-2" /> : <ShieldCheck className="h-8 w-8 mb-2" />}
                  <span className="text-3xl font-extrabold mb-1">{result.originalAiScore}%</span>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Original AI Probability</span>
                </div>
                <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(result.newAiScore)}`}>
                  <ShieldCheck className="h-8 w-8 mb-2" />
                  <span className="text-3xl font-extrabold mb-1">{result.newAiScore}%</span>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-80">New AI Probability</span>
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Humanized Result
                </h3>
                <div className="flex-grow p-5 rounded-xl bg-muted/30 border border-border whitespace-pre-wrap leading-relaxed text-sm">
                  {result.humanizedText}
                </div>
                <div className="mt-4 flex justify-end gap-2 no-print">
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(result.humanizedText)}>Copy Text</Button>
                  <Button variant="default" onClick={() => window.print()} className="bg-red-600 hover:bg-red-700 text-white">
                    <Printer className="mr-2 h-4 w-4" />Download PDF Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full shadow-2xl border overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white text-center relative">
              <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-300" />
              </div>
              <h2 className="text-2xl font-black mb-2">Upgrade to Pro</h2>
              <p className="text-indigo-200 text-sm">You've used your 1 free AI humanizer check. Upgrade for unlimited access.</p>
            </div>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-indigo-600">₹{PRO_PRICE}</div>
                <div className="text-muted-foreground text-sm mt-1">One-time payment · Lifetime access</div>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited AI plagiarism checks", "Unlimited humanizer usage", "Priority processing", "Download PDF reports"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium">
                    <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button onClick={handleUpgradePayment} className="w-full h-14 text-lg font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl">
                <CreditCard className="mr-2 w-5 h-5" />
                Pay ₹{PRO_PRICE} & Unlock Pro
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4">Secured by Razorpay · One-time payment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
