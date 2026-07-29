"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Package, User, Building2, GraduationCap, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({
    full_name: "",
    phone_number: "",
    university: "",
    graduation_year: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);

      // Fetch Orders
      const { data: userOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', session.user.email)
        .order('created_at', { ascending: false });
      
      if (userOrders) setOrders(userOrders);

      // Fetch Profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        setProfile(prev => ({ ...prev, full_name: session.user.user_metadata?.full_name || "" }));
      }
      
      setIsLoading(false);
    };

    checkUserAndFetchData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', user.email)
        .single();

      if (existing) {
        await supabase
          .from('user_profiles')
          .update({
            full_name: profile.full_name,
            phone_number: profile.phone_number,
            university: profile.university,
            graduation_year: profile.graduation_year
          })
          .eq('email', user.email);
      } else {
        await supabase
          .from('user_profiles')
          .insert([{
            email: user.email,
            full_name: profile.full_name,
            phone_number: profile.phone_number,
            university: profile.university,
            graduation_year: profile.graduation_year
          }]);
      }
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        <Button variant="outline" onClick={() => { supabase.auth.signOut(); window.location.href="/"; }}>Sign Out</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Profile Settings Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-muted/30 border rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="text-primary"/> Profile Settings</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className="w-full pl-10 p-2.5 rounded-xl border bg-background" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input type="tel" value={profile.phone_number} onChange={e => setProfile({...profile, phone_number: e.target.value})} className="w-full pl-10 p-2.5 rounded-xl border bg-background" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">University / College</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="w-full pl-10 p-2.5 rounded-xl border bg-background" placeholder="IIT Bombay" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Graduation Year</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={profile.graduation_year} onChange={e => setProfile({...profile, graduation_year: e.target.value})} className="w-full pl-10 p-2.5 rounded-xl border bg-background" placeholder="2026" />
                </div>
              </div>
              <Button type="submit" disabled={isSaving} className="w-full font-bold h-12 rounded-xl mt-4">
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </div>
        </div>

        {/* Purchase History Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-2"><Package className="text-primary"/> Purchase History</h2>
          
          {orders.length === 0 ? (
            <div className="bg-muted/20 border rounded-3xl p-10 text-center flex flex-col items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-6">You haven't bought any projects or services yet.</p>
              <Link href="/projects">
                <Button className="font-bold">Browse Projects</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div key={index} className="bg-background border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4 border-b pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground font-mono">Order #{order.razorpay_order_id?.substring(0, 12)}...</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {order.items && Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden relative flex-shrink-0 border">
                          <Image src={item.image_url || "/feature_resume.png"} alt="Project" fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm line-clamp-1">{item.title}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-sm text-emerald-600">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="font-bold text-lg">Total: <span className="text-emerald-600">₹{order.total_amount}</span></p>
                    <a href={`mailto:support@graduatenex.online?subject=Support for Order ${order.razorpay_order_id}`} className="text-sm text-primary hover:underline font-semibold flex items-center gap-1">
                      Get Support <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
