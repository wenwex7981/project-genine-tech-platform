"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostHackathonPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    org_name: "", org_type: "Company", contact_person: "", contact_email: "", contact_phone: "", website: "", linkedin: "",
    title: "", theme: "", description: "", eligibility: "", team_size_min: 1, team_size_max: 4,
    reg_start_date: "", reg_end_date: "", event_date: "", mode: "Online", city: "", state: "", venue: "",
    total_prize_pool: "", first_prize: "", second_prize: "", third_prize: "", 
    has_certificates: false, has_internship: false, has_ppo: false, has_goodies: false,
    reg_fee: 0, max_participants: "", pricing_plan: "Free Listing"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('hackathons_v2').insert([{
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
      }]);

      if (error) throw error;
      alert("Hackathon published successfully!");
      router.push('/hackathons');
    } catch (err: any) {
      console.error(err);
      alert("Failed to publish hackathon. Make sure the hackathons_v2 table exists.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/hackathons" className="text-primary hover:underline font-semibold mb-6 inline-flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Directory
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Host a Hackathon</h1>
          <p className="text-muted-foreground mt-2">Publish your event to thousands of top developers and students.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-3xl">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 md:p-8 shadow-sm">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
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
                  <label className="block text-sm font-semibold mb-2">Website</label>
                  <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold border-b pb-4">2. Event Details</h2>
              <div>
                <label className="block text-sm font-semibold mb-2">Hackathon Name *</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none" />
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
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
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
              <h2 className="text-2xl font-bold border-b pb-4">4. Plan Selection</h2>
              <div className="grid gap-4">
                {["Free Listing", "Featured Listing (₹499)", "Premium Listing (₹999)", "Homepage Featured (₹1,999)"].map(plan => (
                  <label key={plan} className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${formData.pricing_plan === plan ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="plan" checked={formData.pricing_plan === plan} onChange={() => setFormData({...formData, pricing_plan: plan})} className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-lg">{plan}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
            ) : <div />}
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px] font-bold">
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (step === 4 ? "Publish Hackathon" : "Next Step")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
