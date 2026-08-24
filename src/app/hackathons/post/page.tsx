"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PLAN_PRICES: Record<string, number> = {
  "Free Listing": 0,
  "Featured Listing": 499,
  "Premium Listing": 999,
  "Homepage Featured": 1999
};

const PLAN_BENEFITS: Record<string, string[]> = {
  "Free Listing": [
    "Listed in hackathons directory",
    "Basic search visibility",
    "Standard event page"
  ],
  "Featured Listing": [
    "Highlighted border & badge",
    "Appears above free listings",
    "Social media shoutout (Twitter)"
  ],
  "Premium Listing": [
    "Everything in Featured",
    "Included in weekly newsletter",
    "Dedicated SEO optimized page"
  ],
  "Homepage Featured": [
    "Pinned to Homepage for 7 days",
    "Maximum visibility (10x views)",
    "Priority support"
  ]
};

export default function PostHackathonPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isCheckoutLoaded, setIsCheckoutLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsCheckoutLoaded(true);
    document.body.appendChild(script);
  }, []);

  const [formData, setFormData] = useState({
    org_name: "", org_type: "Company", contact_person: "", contact_email: "", contact_phone: "", website: "", linkedin: "",
    title: "", theme: "", description: "", eligibility: "", team_size_min: 1, team_size_max: 4,
    reg_start_date: "", reg_end_date: "", event_date: "", mode: "Online", city: "", state: "", venue: "", country: "", district: "", address: "",
    total_prize_pool: "", first_prize: "", second_prize: "", third_prize: "", 
    has_certificates: false, has_internship: false, has_ppo: false, has_goodies: false,
    reg_fee: 0, max_participants: "", pricing_plan: "Free Listing", registrationLink: ""
  });

  const saveHackathonToDB = async (paymentStatus: string = "unpaid") => {
    try {
      const { error } = await supabase.from('hackathons_v2').insert([{
        ...formData,
        registration_link: formData.registrationLink,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        payment_status: paymentStatus
      }]);

      if (error) throw error;
      alert("Event published successfully!");
      router.push('/hackathons');
    } catch (err: any) {
      console.error(err);
      alert("Failed to publish event. Make sure the hackathons_v2 table exists.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    
    const price = PLAN_PRICES[formData.pricing_plan];

    if (price === 0) {
      // Free listing, just save directly
      await saveHackathonToDB("free");
      setIsSubmitting(false);
      return;
    }

    // Paid listing, trigger Razorpay
    if (!isCheckoutLoaded) {
      alert("Payment system loading, please wait...");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price })
      });

      if (!res.ok) throw new Error("Payment setup failed");
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "GraduateNex",
        description: `Hackathon Post - ${formData.pricing_plan}`,
        order_id: order.id,
        prefill: {
          name: formData.contact_person,
          email: formData.contact_email,
          contact: formData.contact_phone || "",
        },
        modal: {
          ondismiss: function () {
            document.body.style.overflow = "";
            setIsSubmitting(false);
          }
        },
        handler: async function (response: any) {
          document.body.style.overflow = "";
          // Payment successful, now save to DB
          await saveHackathonToDB("paid");
          setIsSubmitting(false);
        },
        theme: { color: "#f97316" } // Orange matching hackathons theme
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        document.body.style.overflow = "";
        alert("Payment Failed: " + response.error.description);
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert("Payment initiation failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/hackathons" className="text-primary hover:underline font-semibold mb-6 inline-flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Directory
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Host an Event / Hackathon</h1>
          <p className="text-muted-foreground mt-2">Publish your event to thousands of top developers and students.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-4xl">
        <div className="flex gap-2 mb-8 max-w-3xl mx-auto">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 md:p-8 shadow-sm">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold border-b pb-4">1. Organizer Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Organization Name *</label>
                  <input required value={formData.org_name} onChange={e => setFormData({...formData, org_name: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Organizer Type *</label>
                  <select value={formData.org_type} onChange={e => setFormData({...formData, org_type: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none">
                    <option>Company</option>
                    <option>Startup</option>
                    <option>College</option>
                    <option>NGO</option>
                    <option>Individual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Contact Person *</label>
                  <input required value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input required type="email" value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input type="tel" value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Website</label>
                  <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold border-b pb-4">2. Event Details</h2>
              <div>
                <label className="block text-sm font-semibold mb-2">Event / Hackathon Name *</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Registration Form Link</label>
                <input type="url" value={formData.registrationLink || ''} onChange={e => setFormData({...formData, registrationLink: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" placeholder="https://forms.google.com/... or your registration page URL" />
                <p className="text-xs text-gray-500 mt-1">Participants will be redirected to this link when they click &quot;Join&quot;</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Event Mode</label>
                  <select value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none">
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Event Date</label>
                  <input type="date" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
              </div>
              
              {formData.mode !== 'Online' && (
                <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                  <h3 className="font-semibold text-gray-700">Location Details (Required for Offline/Hybrid)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Country *</label>
                      <input required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-3 rounded-xl border bg-white outline-none" placeholder="e.g. India" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">State *</label>
                      <input required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-3 rounded-xl border bg-white outline-none" placeholder="e.g. Telangana" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">District *</label>
                      <input required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full p-3 rounded-xl border bg-white outline-none" placeholder="e.g. Hyderabad" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">City</label>
                      <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 rounded-xl border bg-white outline-none" placeholder="e.g. Madhapur" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Venue Address *</label>
                    <textarea required rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 rounded-xl border bg-white outline-none" placeholder="Complete street address and venue name" />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold border-b pb-4">3. Prizes & Rewards</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Total Prize Pool</label>
                  <input placeholder="e.g. ₹1,00,000" value={formData.total_prize_pool} onChange={e => setFormData({...formData, total_prize_pool: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">1st Prize</label>
                  <input value={formData.first_prize} onChange={e => setFormData({...formData, first_prize: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2 font-medium cursor-pointer"><input type="checkbox" checked={formData.has_certificates} onChange={e => setFormData({...formData, has_certificates: e.target.checked})} className="w-5 h-5 rounded" /> Certificates</label>
                <label className="flex items-center gap-2 font-medium cursor-pointer"><input type="checkbox" checked={formData.has_internship} onChange={e => setFormData({...formData, has_internship: e.target.checked})} className="w-5 h-5 rounded" /> Internships</label>
                <label className="flex items-center gap-2 font-medium cursor-pointer"><input type="checkbox" checked={formData.has_ppo} onChange={e => setFormData({...formData, has_ppo: e.target.checked})} className="w-5 h-5 rounded" /> PPOs</label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold border-b pb-4 text-center">4. Choose Your Visibility Plan</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.keys(PLAN_PRICES).map(plan => {
                  const price = PLAN_PRICES[plan];
                  const isSelected = formData.pricing_plan === plan;
                  return (
                    <label 
                      key={plan} 
                      className={`relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                        isSelected ? 'bg-primary/5 border-primary shadow-lg scale-105' : 'bg-white border-muted hover:border-primary/50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={isSelected} 
                        onChange={() => setFormData({...formData, pricing_plan: plan})} 
                        className="hidden" 
                      />
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-primary">
                          <CheckCircle2 className="w-6 h-6 fill-current text-white" />
                        </div>
                      )}
                      <h3 className="font-extrabold text-lg mb-2">{plan}</h3>
                      <div className="text-3xl font-black mb-6">
                        {price === 0 ? "Free" : `₹${price}`}
                      </div>
                      <ul className="space-y-3 flex-grow mb-6">
                        {PLAN_BENEFITS[plan].map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`w-full py-2 text-center rounded-lg font-bold text-sm transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {isSelected ? "Selected" : "Select Plan"}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-12 pt-6 border-t max-w-3xl mx-auto">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
            ) : <div />}
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px] font-bold h-12 px-8">
              {isSubmitting ? (
                <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Processing...</>
              ) : (
                step === 4 ? (PLAN_PRICES[formData.pricing_plan] === 0 ? "Publish Free Listing" : `Pay ₹${PLAN_PRICES[formData.pricing_plan]} & Publish`) : "Next Step"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
