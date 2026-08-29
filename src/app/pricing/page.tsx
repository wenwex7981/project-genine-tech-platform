"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Sparkles, FileText, Medal, ArrowRight, Loader2, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isCheckoutLoaded, setIsCheckoutLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email || null);
    });

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsCheckoutLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handlePurchase = async (planId: string, planName: string, amount: number, isLifetime: boolean = false) => {
    if (!userEmail) {
      alert("Please sign in to purchase a plan.");
      router.push("/login");
      return;
    }
    if (!isCheckoutLoaded) return alert("Payment system is loading, please wait.");

    setIsProcessing(true);
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      if (!res.ok) throw new Error("Could not create order");
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "GraduateNex",
        description: planName,
        order_id: order.id,
        prefill: { email: userEmail },
        notes: { plan_id: planId, plan_name: planName, is_lifetime: isLifetime.toString() },
        modal: {
          ondismiss: () => {
            document.body.style.overflow = "";
            setIsProcessing(false);
          }
        },
        handler: async function (response: any) {
          document.body.style.overflow = "";
          try {
            // Verify and save subscription
            const verifyRes = await fetch('/api/verify-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: planId,
                plan_name: planName,
                user_email: userEmail,
                is_lifetime: isLifetime
              })
            });

            if (verifyRes.ok) {
              alert(`🎉 Success! You now have access to ${planName}.`);
              router.push("/dashboard");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            alert("Error verifying payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        theme: { color: "#4f46e5" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => {
        document.body.style.overflow = "";
        alert("Payment Failed");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-20 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Unlock the Full Power of <span className="text-purple-300">GraduateNex</span>
          </h1>
          <p className="text-xl text-indigo-100 leading-relaxed">
            Choose the premium tools you need to accelerate your career, studies, and resume building.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-7xl space-y-24">

        {/* ⭐ ALL ACCESS PASS — HERO BUNDLE */}
        <section>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 rounded-[2rem] opacity-80" style={{ backgroundSize: '200% 100%' }} />
            
            <div className="relative bg-zinc-950 rounded-[2rem] p-8 md:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/15 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-200/20 to-yellow-200/20 border border-amber-500/30 text-amber-300 text-sm font-bold">
                    <span className="text-lg">👑</span> BEST VALUE — SAVE 47%
                  </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-center text-white tracking-tight mb-3">
                  All Access Pass
                </h2>
                <p className="text-center text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
                  One plan. Every tool. Unlimited usage. Get everything GraduateNex offers for one low price.
                </p>

                <div className="max-w-md mx-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-8 space-y-3">
                  {[
                    { name: "Premium AI Helper", price: "₹200" },
                    { name: "AI Tools Pro (Plagiarism + Humanizer)", price: "₹300" },
                    { name: "Resume Hub Pro (ATS + JD Match)", price: "₹500" },
                    { name: "Hackathon Pro Badge", price: "₹500" },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-center text-sm text-zinc-300">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {item.name}
                      </span>
                      <span className="text-zinc-500 line-through">{item.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-zinc-700 pt-3 mt-3 flex justify-between items-center">
                    <span className="text-sm text-zinc-400 font-semibold">Total Value</span>
                    <span className="text-zinc-500 line-through font-bold">₹1,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-white font-black">YOUR PRICE</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">₹799</span>
                      <span className="text-sm text-zinc-500 font-medium">/30 days</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Button
                    onClick={() => handlePurchase('all_access_pass', 'All Access Pass (30 Days)', 799)}
                    disabled={isProcessing}
                    className="flex-1 h-14 text-lg font-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black shadow-xl shadow-amber-500/25 rounded-xl border-0"
                  >
                    {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : "Get All Access Pass"}
                  </Button>
                  <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                    <p className="text-xs text-zinc-500 font-medium">Also available:</p>
                    <Button
                      onClick={() => handlePurchase('all_access_semester', 'All Access Semester (6 Months)', 1999)}
                      disabled={isProcessing}
                      variant="ghost"
                      className="text-sm font-bold text-violet-400 hover:text-violet-300 hover:bg-violet-950/30 p-0 h-auto justify-start"
                    >
                      Semester Pass — ₹1,999 / 6 months →
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 text-xs text-zinc-500 font-medium">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Secure Payment</span>
                  <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-400" /> Instant Activation</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Or pick individual tools</p>
        </div>

        {/* 1. AI Helper Suite */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-sm mb-4">
              <Sparkles className="w-4 h-4" /> Pillar 1
            </div>
            <h2 className="text-3xl font-bold">AI Helper Suite</h2>
            <p className="text-muted-foreground mt-2">Supercharge your assignments and projects.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border shadow-sm flex flex-col">
              <h3 className="text-xl font-bold mb-2">Basic Tools</h3>
              <div className="text-4xl font-black mb-6">Free</div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> PPT Generator (Free)</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> Text Generator (Free)</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> 1 Free Abstract Generation</li>
              </ul>
              <Button variant="outline" className="w-full h-12 font-bold" onClick={() => router.push('/ai-services')}>Use Free Tools</Button>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border shadow-sm flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">Pay Per Use</div>
              <h3 className="text-xl font-bold mb-2">Pay As You Go</h3>
              <div className="text-4xl font-black mb-6">₹20<span className="text-lg text-muted-foreground font-normal">/use</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> Abstract Generator: ₹20 / use</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> UML Diagrams: ₹50 / use</li>
              </ul>
              <Button variant="secondary" className="w-full h-12 font-bold" onClick={() => router.push('/ai-abstracts')}>Go to Tools</Button>
            </div>
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white p-8 rounded-3xl shadow-xl flex flex-col relative transform scale-105 z-10">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-300 to-blue-300"></div>
              <h3 className="text-xl font-bold mb-2">Premium AI Helper</h3>
              <div className="text-4xl font-black mb-6">₹200<span className="text-lg text-blue-200 font-normal">/30 days</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-cyan-300" /> Unlimited Abstract Generations</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-cyan-300" /> Unlimited UML Diagrams</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-cyan-300" /> Priority Processing</li>
              </ul>
              <Button
                onClick={() => handlePurchase('ai_premium', 'Premium AI Helper (30 Days)', 200)}
                disabled={isProcessing}
                className="w-full h-12 font-bold bg-white text-blue-700 hover:bg-blue-50"
              >
                {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Unlock Premium AI"}
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Plagiarism Tool */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-sm mb-4">
              <ShieldCheck className="w-4 h-4" /> Pillar 2
            </div>
            <h2 className="text-3xl font-bold">AI Plagiarism & Humanizer</h2>
            <p className="text-muted-foreground mt-2">Bypass AI detectors and humanize your text effortlessly.</p>
          </div>
          <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r">
              <h3 className="text-xl font-bold mb-2">Free Trial</h3>
              <div className="text-4xl font-black mb-6">Free</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> 1 Free Check & Humanize</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="w-5 h-5" /> Basic Analysis</li>
              </ul>
              <Button variant="outline" className="w-full h-12 font-bold" onClick={() => router.push('/ai-services')}>Try for Free</Button>
            </div>
            <div className="p-8 md:w-1/2 bg-gray-50 dark:bg-zinc-800/50 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">AI Tools Pro <Zap className="w-5 h-5 text-yellow-500" /></h3>
                <div className="text-4xl font-black mb-6">₹300<span className="text-lg text-muted-foreground font-normal">/30 days</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="w-5 h-5 text-green-500" /> Unlimited Plagiarism Checks</li>
                  <li className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="w-5 h-5 text-green-500" /> Unlimited Humanizer Usage</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> Access to full "AI Tools Tab"</li>
                </ul>
              </div>
              <Button
                onClick={() => handlePurchase('plagiarism_pro', 'AI Tools Pro (30 Days)', 300)}
                disabled={isProcessing}
                className="w-full h-12 font-bold bg-zinc-900 text-white hover:bg-zinc-800"
              >
                {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Unlock AI Tools Pro"}
              </Button>
            </div>
          </div>
        </section>

        {/* 3. Resume Hub */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm mb-4">
              <FileText className="w-4 h-4" /> Pillar 3
            </div>
            <h2 className="text-3xl font-bold">Resume & Career Hub</h2>
            <p className="text-muted-foreground mt-2">Get detailed ATS scores, JD matching, and premium templates.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Basic ATS</h3>
              <div className="text-4xl font-black mb-6">Free</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> Base ATS Score number</li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">No detailed breakdown</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border shadow-sm">
              <div className="absolute top-4 right-4 text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">Pay Per Use</div>
              <h3 className="text-xl font-bold mb-2">A La Carte</h3>
              <div className="text-4xl font-black mb-6">₹50<span className="text-lg text-muted-foreground font-normal">/check</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> Detailed ATS Breakdown: ₹50</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-green-500" /> JD Based Matching: ₹100</li>
              </ul>
              <Button variant="secondary" className="w-full h-12 font-bold" onClick={() => router.push('/resume')}>Go to Resume Hub</Button>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 rounded-3xl shadow-lg flex flex-col">
              <h3 className="text-xl font-bold mb-2">Resume Hub Monthly</h3>
              <div className="text-4xl font-black mb-6">₹500<span className="text-lg text-emerald-200 font-normal">/30 days</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-emerald-200" /> Unlimited ATS Breakdowns</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-emerald-200" /> Unlimited JD Matching</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-emerald-200" /> Access to Premium Templates</li>
              </ul>
              <Button
                onClick={() => handlePurchase('resume_hub_pro', 'Resume Hub Monthly', 500)}
                disabled={isProcessing}
                className="w-full h-12 font-bold bg-white text-emerald-700 hover:bg-emerald-50"
              >
                {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Unlock Resume Pro"}
              </Button>
            </div>
          </div>
        </section>

        {/* 4. Hackathon Badges */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold text-sm mb-4">
              <Medal className="w-4 h-4" /> Pillar 4
            </div>
            <h2 className="text-3xl font-bold">Hackathon & Events Badges</h2>
            <p className="text-muted-foreground mt-2">Get the Access Card required to join exclusive events.</p>
          </div>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border-2 border-indigo-100 hover:border-indigo-300 transition-colors shadow-sm relative">
              <h3 className="text-xl font-bold mb-2">Pro Badge</h3>
              <div className="text-4xl font-black mb-6">₹500<span className="text-lg text-muted-foreground font-normal">/lifetime</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Access Card for 15 Hackathons</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> "Pro Hacker" Profile Badge</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Priority Registration</li>
              </ul>
              <Button
                onClick={() => handlePurchase('hackathon_badge_15', 'Hackathon Pro Badge (15 Events)', 500, true)}
                disabled={isProcessing}
                className="w-full h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Get Pro Badge"}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-8 rounded-3xl shadow-xl relative overflow-hidden transform scale-105">
              <div className="absolute -right-10 -top-10 opacity-10">
                <Medal className="w-48 h-48" />
              </div>
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-200 to-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Best Value
              </div>
              <h3 className="text-xl font-bold mb-2">Unlimited Badge</h3>
              <div className="text-4xl font-black mb-6">₹1000<span className="text-lg text-indigo-300 font-normal">/lifetime</span></div>
              <ul className="space-y-4 mb-8 relative z-10">
                <li className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="w-5 h-5 text-amber-400" /> Join UNLIMITED Hackathons</li>
                <li className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="w-5 h-5 text-amber-400" /> Join UNLIMITED Events</li>
                <li className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="w-5 h-5 text-amber-400" /> Gold "Elite Hacker" Badge</li>
              </ul>
              <Button
                onClick={() => handlePurchase('hackathon_badge_unlimited', 'Hackathon Unlimited Badge', 1000, true)}
                disabled={isProcessing}
                className="w-full h-12 font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 border-none shadow-lg"
              >
                {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Get Unlimited Badge"}
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
