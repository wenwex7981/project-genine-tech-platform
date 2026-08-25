"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Package, User, Building2, GraduationCap, Phone, ExternalLink, Flame, Trophy, Award } from "lucide-react";
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

  // Quiz States
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [currentQuizDomain, setCurrentQuizDomain] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

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
        
        // Gamification Logic: Update Streak on login
        try {
          const today = new Date().toISOString().split('T')[0];
          const lastActivityDate = userProfile.last_activity ? new Date(userProfile.last_activity).toISOString().split('T')[0] : null;
          
          let newStreak = userProfile.current_streak || 0;
          let shouldUpdate = false;
          
          if (!lastActivityDate) {
            newStreak = 1;
            shouldUpdate = true;
          } else if (lastActivityDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (lastActivityDate === yesterdayStr) {
              newStreak += 1; // Maintained streak
            } else {
              newStreak = 1; // Broken streak
            }
            shouldUpdate = true;
          }
          
          if (shouldUpdate) {
            await supabase.from('user_profiles').update({
              current_streak: newStreak,
              last_activity: new Date().toISOString()
            }).eq('email', session.user.email);
            setProfile((prev: any) => ({ ...prev, current_streak: newStreak }));
          }
        } catch (e) {
          console.error("Streak logic error (columns might not exist yet):", e);
        }

      } else {
        setProfile((prev: any) => ({ ...prev, full_name: session.user.user_metadata?.full_name || "" }));
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

  const startQuiz = async (domain: string) => {
    setQuizModalOpen(true);
    setCurrentQuizDomain(domain);
    setQuizLoading(true);
    setQuizQuestions([]);
    setCurrentQuestionIdx(0);
    setQuizScore(0);
    setQuizFinished(false);

    try {
      const res = await fetch("/api/daily-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      setQuizQuestions(data);
    } catch (err) {
      alert("Failed to load quiz.");
      setQuizModalOpen(false);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswer = async (optIdx: number) => {
    const currentQ = quizQuestions[currentQuestionIdx];
    const isCorrect = optIdx === currentQ.correctAnswer;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    
    if(isCorrect) setQuizScore(newScore);
    
    if (currentQuestionIdx + 1 < quizQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Finish
      setQuizFinished(true);
      // Update total score in Supabase (10 pts per correct answer)
      const pointsEarned = newScore * 10;
      if (pointsEarned > 0) {
        const newTotal = (profile.total_score || 0) + pointsEarned;
        try {
          await supabase.from('user_profiles').update({ total_score: newTotal }).eq('email', user.email);
          setProfile({ ...profile, total_score: newTotal });
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        <Button variant="outline" onClick={() => { supabase.auth.signOut(); window.location.href="/"; }}>Sign Out</Button>
      </div>

      {/* Gamification Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-lg flex items-center gap-6 transform hover:scale-105 transition-all">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <Flame className="w-8 h-8 text-yellow-300" />
          </div>
          <div>
            <p className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-1">Current Streak</p>
            <h3 className="text-3xl font-black">{profile?.current_streak || 0} Days</h3>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg flex items-center gap-6 transform hover:scale-105 transition-all">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <Trophy className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <p className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-1">Total Score</p>
            <h3 className="text-3xl font-black">{profile?.total_score || 0} Pts</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg flex items-center gap-6 transform hover:scale-105 transition-all">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <Award className="w-8 h-8 text-emerald-100" />
          </div>
          <div>
            <p className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-1">Badges Earned</p>
            <h3 className="text-3xl font-black">{(profile?.badges || []).length}</h3>
          </div>
        </div>
      </div>

      {/* Daily Domain Quizzes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><GraduationCap className="text-primary"/> Daily Domain Quizzes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Python", "Java", "DSA", "Cyber Security", "Frontend", "SQL"].map((domain) => (
            <button 
              key={domain}
              onClick={() => startQuiz(domain)}
              className="bg-muted/30 hover:bg-primary/10 border border-muted hover:border-primary transition-all p-4 rounded-2xl text-center font-bold shadow-sm"
            >
              {domain}
            </button>
          ))}
        </div>
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

          {/* Hackathon Partner CTA */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">🚀 Join as Hackathon Partner</h2>
            <p className="text-indigo-100 text-sm mb-4">Are you an event organizer or company? Post your hackathon to reach thousands of top developers and engineering students across India.</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/hackathons/post">
                <Button className="bg-white text-indigo-700 hover:bg-gray-100 font-bold px-6">Host a Hackathon</Button>
              </Link>
              <Link href="/hackathons">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold">Browse Events</Button>
              </Link>
            </div>
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
              {orders.map((order, idx) => (
                <div key={idx} className="bg-muted/10 border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{order.item_title || 'Service Purchase'}</h3>
                    <p className="text-sm text-muted-foreground">Order ID: {order.order_id}</p>
                    <p className="text-sm font-semibold mt-1 text-primary">₹{(order.amount / 100).toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {quizModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl p-8 max-w-xl w-full shadow-2xl relative border">
            <button onClick={() => setQuizModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground font-bold">✕</button>
            
            {quizLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold text-lg">Generating {currentQuizDomain} Quiz...</h3>
              </div>
            ) : quizFinished ? (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-black mb-2">Quiz Completed!</h2>
                <p className="text-xl mb-4">You scored {quizScore} out of {quizQuestions.length}</p>
                <p className="text-muted-foreground mb-8 text-sm">+{quizScore * 10} Gamification Points added to your total score!</p>
                <Button onClick={() => setQuizModalOpen(false)} className="w-full font-bold">Awesome!</Button>
              </div>
            ) : quizQuestions.length > 0 && currentQuestionIdx < quizQuestions.length ? (
              <div>
                <div className="flex justify-between text-sm font-bold text-muted-foreground mb-6 uppercase tracking-wider">
                  <span>{currentQuizDomain}</span>
                  <span>Question {currentQuestionIdx + 1} of {quizQuestions.length}</span>
                </div>
                <h3 className="text-xl font-bold mb-6">{quizQuestions[currentQuestionIdx].question}</h3>
                <div className="space-y-3">
                  {quizQuestions[currentQuestionIdx].options.map((opt: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer(i)}
                      className="w-full text-left p-4 rounded-xl border border-muted hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
