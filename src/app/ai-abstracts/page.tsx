"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import UpgradeWall from "@/components/UpgradeWall";

export default function AIGeneratorPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasPremium, setHasPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isCheckoutLoaded, setIsCheckoutLoaded] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsCheckoutLoaded(true);
    document.body.appendChild(script);

    // Get usage from localStorage for fast client check
    const savedUsage = localStorage.getItem("abstract_generator_usage");
    if (savedUsage) setUsageCount(parseInt(savedUsage));

    // Check auth and premium status
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const email = session?.user?.email;
      if (email) {
        setUserEmail(email);

        // Admins bypass
        if (email === 'projectgenie16@gmail.com' || email === 'nithinpatel2025@gmail.com') {
          setHasPremium(true);
          return;
        }

        const { data } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_email', email)
          .eq('plan_id', 'ai_premium')
          .eq('status', 'active')
          .single();

        if (data) {
          // Check expiration
          if (!data.expires_at || new Date(data.expires_at) > new Date()) {
            setHasPremium(true);
          }
        }
      }
    });
  }, []);

  const handleGenerate = async () => {
    if (!topic) return;

    // Check Limits
    if (!hasPremium && usageCount >= 1) {
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-abstract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate abstract');

      setResult(data.result);

      // Increment usage
      if (!hasPremium) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem("abstract_generator_usage", newCount.toString());
      }
    } catch (error: any) {
      console.error('Error generating abstract:', error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePayPerUse = async () => {
    if (!userEmail) return router.push("/login");
    if (!isCheckoutLoaded) return alert("Payment loading...");

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 20 })
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "GraduateNex",
        description: "Abstract Generator (1 Use)",
        order_id: order.id,
        prefill: { email: userEmail },
        handler: function () {
          setShowPaywall(false);
          // Give them 1 more free use locally
          localStorage.setItem("abstract_generator_usage", "0");
          setUsageCount(0);
          alert("Payment successful! You can now generate your abstract.");
        },
        theme: { color: "#4f46e5" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl relative">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <Sparkles className="h-4 w-4" /> Powered by AI
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Abstract <span className="text-primary">Generator</span></h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Enter your project topic or keywords, and our AI will generate a professional title and abstract instantly.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg p-6 md:p-8">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-semibold mb-2">Project Topic or Keywords</label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., E-commerce website for local farmers using React and Node.js..."
              className="w-full min-h-[100px] p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            size="lg"
            className="w-full md:w-auto md:self-end h-12 px-8 text-lg"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" /> Generate Abstract</>
            )}
          </Button>
        </div>

        {result && (
          <div className="mt-8 pt-8 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Generated Result
            </h3>
            <div className="p-6 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(result)}>Copy to Clipboard</Button>
            </div>
          </div>
        )}
      </div>

      {/* Premium UpgradeWall */}
      <UpgradeWall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        toolName="Abstract Generator"
        lockedFeatures={[
          "Unlimited abstract generations",
          "Priority AI processing speed",
          "Multiple format exports (IEEE, APA)",
          "Academic tone refinement",
        ]}
        payPerUsePrice={20}
        payPerUseLabel="for 1 Generation"
        onPayPerUse={handlePayPerUse}
        originalPrice={200}
        discountPrice={99}
        discountPlanName="Premium AI Helper"
      />
    </div>
  );
}
