"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Loader2, FileText, Upload, Briefcase, CheckCircle, AlertCircle,
  AlertTriangle, Lightbulb, FileDown, Percent, Users,
  Search, Eye, Download, PlusCircle, Building, X, Trophy, FileCheck, Copy, Check, ShoppingCart, Star, Lock, Zap, GraduationCap, Sparkles
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

import { useRouter } from "next/navigation";
import Image from "next/image";
import ResumeEditor from "@/components/ResumeEditor";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { motion, AnimatePresence } from "framer-motion";

const LIVE_NOTIFICATIONS = [
  "Rahul from Hyderabad just tailored a TCS resume 🚀",
  "Priya from Bangalore boosted her ATS score to 92% ✨",
  "Ankit landed an interview after using the JD Analyzer 💼",
  "Sneha just published a top-tier Frontend Engineer template 🔥",
];

export default function ResumeHub() {
  const router = useRouter();
  const [notificationIndex, setNotificationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const [activeTab, setActiveTab] = useState<"ats" | "jd" | "community" | "maker">("community");
  const [preferredModel, setPreferredModel] = useState<AIModel>("deepseek");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasResumePro, setHasResumePro] = useState(false);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [unlockedAts, setUnlockedAts] = useState(false);
  const [unlockedJd, setUnlockedJd] = useState(false);
  const [showPaywall, setShowPaywall] = useState<"ats" | "jd" | null>(null);
  const [isCheckoutLoaded, setIsCheckoutLoaded] = useState(false);

  // --- ANALYZER STATE ---
  const [jd, setJd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- COMMUNITY STATE ---
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [filterExp, setFilterExp] = useState("All");
  const [filterDomain, setFilterDomain] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    shortlistedBy: "",
    domain: "Software Engineering",
    experienceLevel: "Fresher",
  });

  // --- MAKER STATE ---
  const [makerPrompt, setMakerPrompt] = useState("");
  const [makerInfo, setMakerInfo] = useState({
    name: "", email: "", phone: "", linkedin: "", github: "", portfolio: "", title: "",
    college: "", branch: "", course: "", graduationYear: "", location: ""
  });
  const [makerTemplate, setMakerTemplate] = useState<File | null>(null);
  const makerFileRef = useRef<HTMLInputElement>(null);
  const [makerResult, setMakerResult] = useState<any | null>(null);
  const [isMaking, setIsMaking] = useState(false);

  // Reset result when switching analyzer tabs
  useEffect(() => {
    if (activeTab === "community") fetchResumes();
    else setResult(null); // clear result when switching between ATS and JD
  }, [activeTab]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsCheckoutLoaded(true);
    document.body.appendChild(script);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const email = session?.user?.email;
      if (email) {
        setUserEmail(email);
        const { data } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_email', email)
          .eq('plan_id', 'resume_hub_pro')
          .eq('status', 'active')
          .single();
        
        if (data && (!data.expires_at || new Date(data.expires_at) > new Date())) {
          setHasResumePro(true);
        }

        const { data: orders } = await supabase
          .from('orders')
          .select('items')
          .eq('user_email', email);
        
        const ids: string[] = [];
        (orders || []).forEach((order: any) => {
          (order.items || []).forEach((item: any) => {
            ids.push(String(item.id));
          });
        });
        setPurchasedIds(ids);
      }
    });
  }, []);

  const handlePayPerUse = async (type: "ats" | "jd") => {
    if (!userEmail) return router.push("/login");
    if (!isCheckoutLoaded) return alert("Payment loading...");

    const amount = type === "ats" ? 50 : 100;
    const desc = type === "ats" ? "Detailed ATS Breakdown (1 Use)" : "JD Matching Analysis (1 Use)";

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "GraduateNex",
        description: desc,
        order_id: order.id,
        prefill: { email: userEmail },
        handler: function () {
          setShowPaywall(null);
          if (type === "ats") setUnlockedAts(true);
          if (type === "jd") setUnlockedJd(true);
          alert(`Payment successful! You now have access to your ${type.toUpperCase()} report.`);
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

  const fetchResumes = async () => {
    setLoadingCommunity(true);
    // Fetch both community resumes AND admin-published resume templates
    const [communityRes, templatesRes] = await Promise.all([
      supabase.from('community_resumes').select('*').order('created_at', { ascending: false }),
      supabase.from('resume_templates').select('*').order('created_at', { ascending: false })
    ]);

    const communityData = (communityRes.data || []).map((r: any) => ({ ...r, _type: 'community' }));
    const templateData = (templatesRes.data || []).map((r: any) => ({ 
      ...r, 
      _type: 'premium',
      name: r.title,
      domain: r.category || 'Resume Template',
      experience_level: r.level || 'All Levels',
      shortlisted_by: 'GraduateNex Premium',
    }));

    setResumes([...templateData, ...communityData]);
    setLoadingCommunity(false);
  };

  const handlePostResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('community_resumes').insert([{
      name: formData.name,
      contact_number: formData.contactNumber,
      shortlisted_by: formData.shortlistedBy,
      domain: formData.domain,
      experience_level: formData.experienceLevel,
      document_url: 'mock_url'
    }]);
    setIsSubmitting(false);
    if (!error) {
      setShowPostModal(false);
      fetchResumes();
      alert("Published successfully!");
    }
  };

  const filteredResumes = resumes.filter(r => {
    if (filterExp !== "All" && r.experience_level !== filterExp) return false;
    if (filterDomain !== "All" && r.domain !== filterDomain) return false;
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a resume first.");
    if (activeTab === "jd" && !jd) return alert("Please paste the Job Description.");

    setIsProcessing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", activeTab);
    formData.append("preferredModel", preferredModel);
    if (activeTab === "jd") formData.append("jd", jd);

    try {
      const response = await fetch('/api/analyze-resume', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to analyze resume');
      }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const [isTailoring, setIsTailoring] = useState(false);

  const handleTailor = async () => {
    if (!file) return alert("Please upload a previous resume first.");
    if (!jd) return alert("Please paste the Job Description.");

    setIsTailoring(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jd", jd);
    formData.append("preferredModel", preferredModel);

    try {
      const response = await fetch('/api/tailor-resume', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to tailor resume');
      }
      const data = await response.json();
      setMakerResult(data.tailoredResume);
      setActiveTab("maker");
      alert(`🎉 AI Tailoring Complete!\n\nOriginal ATS Match Score: ${data.beforeScore}%\nNew ATS Match Score: ${data.afterScore}%\n\nYour resume has been rewritten to perfectly match the Job Description!`);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsTailoring(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const downloadDocx = async (text: string, filename: string) => {
    if (!text) return;
    const lines = text.split('\n');
    const doc = new Document({
      sections: [{
        properties: {},
        children: lines.map((line: string) => new Paragraph({
          children: [new TextRun({ text: line.replace(/\*\*/g, ''), bold: line.includes('**') })],
        })),
      }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 border-green-400 bg-green-50 dark:bg-green-900/20";
    if (score >= 60) return "text-yellow-600 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
    return "text-red-500 border-red-400 bg-red-50 dark:bg-red-900/20";
  };

  return (
    <div className="w-full min-h-screen bg-muted/10 pb-20">
      {/* Premium Glassmorphic Hero Banner */}
      <div className="relative min-h-[500px] flex items-center text-white py-20 px-4 md:px-8 border-b border-zinc-800/50 mb-12 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-zinc-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <motion.div 
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-emerald-500/20 blur-3xl"
          />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-2xl"
          >
            {/* Live Notification Ticker */}
            <div className="h-8 overflow-hidden inline-flex">
              <AnimatePresence mode="wait">
                <motion.div
                  key={notificationIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold backdrop-blur-xl shadow-2xl"
                >
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span className="text-gray-300">{LIVE_NOTIFICATIONS[notificationIndex]}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-2xl">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Resume Hub</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
              Don't leave your career to chance. Our Silicon Valley-grade AI engine analyzes your resume against 10,000+ real tech interviews and beats ATS systems guaranteed.
            </p>

            <div className="flex items-center gap-4 text-sm font-semibold text-gray-300">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ Freshers in India</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex p-1 bg-gradient-to-b from-white/10 to-transparent rounded-3xl"
          >
            <div className="p-8 bg-zinc-950/80 rounded-[22px] backdrop-blur-2xl shadow-2xl border border-white/5 flex flex-col gap-6">
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <CheckCircle className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">17-Pt ATS Audit</h4>
                  <p className="text-xs text-gray-400">Deep structural analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Search className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">20-Pt JD Match</h4>
                  <p className="text-xs text-gray-400">Hyper-targeted tailoring</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-xl border max-w-fit">
        <button onClick={() => setActiveTab("ats")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "ats" ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-200/50 dark:hover:bg-zinc-700'}`}>
          <CheckCircle className="h-4 w-4" /> 17-Point ATS Checker
        </button>
        <button onClick={() => setActiveTab("jd")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "jd" ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-200/50 dark:hover:bg-zinc-700'}`}>
          <Search className="h-4 w-4" /> 20-Point JD Analyzer
        </button>
        <button onClick={() => setActiveTab("maker")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "maker" ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-200/50 dark:hover:bg-zinc-700'}`}>
          <Zap className="h-4 w-4" /> AI Resume Maker
        </button>
        <button onClick={() => setActiveTab("community")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "community" ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-200/50 dark:hover:bg-zinc-700'}`}>
          <Users className="h-4 w-4" /> Resume Templates
        </button>
      </div>

      <div className="mb-6 flex justify-end">
        {(activeTab === "ats" || activeTab === "jd" || activeTab === "maker") && (
          <ModelSelector value={preferredModel} onChange={setPreferredModel} />
        )}
      </div>

      {/* -------------------- ANALYZER INPUTS -------------------- */}
      {(activeTab === "ats" || activeTab === "jd") && !result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Glowing orb background effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"></div>

            <div className="relative z-10 space-y-10">
              {/* Step 1: Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold">1</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Upload Your Resume</h3>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => fileInputRef.current?.click()} 
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${file ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}
                >
                  <Upload className={`h-10 w-10 mx-auto mb-4 ${file ? 'text-indigo-500' : 'text-gray-400'}`} />
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {file ? file.name : "Drag & Drop or Click to Upload"}
                  </p>
                  <p className="text-sm text-gray-500">Supports PDF & DOCX (Max 5MB)</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx" className="hidden" />
                </motion.div>
              </div>

              {/* Step 2: JD (Only if activeTab === jd) */}
              <AnimatePresence>
                {activeTab === "jd" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mt-8">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 font-bold">2</div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Paste Job Description</h3>
                    </div>
                    <textarea 
                      value={jd} 
                      onChange={(e) => setJd(e.target.value)} 
                      placeholder="Paste the full job description here. Our AI will extract all 20 hidden parameters..." 
                      className="w-full min-h-[220px] p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-zinc-950/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none text-base shadow-inner" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Action Buttons */}
              <div className="pt-4">
                {isProcessing || isTailoring ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full h-16 rounded-2xl bg-zinc-900 flex items-center justify-center gap-4 text-white shadow-xl overflow-hidden relative"
                  >
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                    <span className="font-bold text-lg tracking-wide">
                      {isTailoring ? "AI IS REWRITING YOUR RESUME..." : "DEEP SCANNING RESUME..."}
                    </span>
                  </motion.div>
                ) : (
                  activeTab === "ats" ? (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={handleAnalyze} disabled={!file} className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/20">
                        <CheckCircle className="mr-2 h-6 w-6" /> 
                        Run 17-Point ATS Audit
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button onClick={handleAnalyze} disabled={!file || !jd} variant="outline" className="w-full h-16 text-lg font-bold rounded-2xl border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/20">
                          <Search className="mr-2 h-5 w-5" /> 
                          Check Match Score
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button onClick={handleTailor} disabled={!file || !jd} className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/20">
                          <Sparkles className="mr-2 h-5 w-5" /> 
                          Auto-Tailor Resume
                        </Button>
                      </motion.div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* -------------------- 17-POINT ATS REPORT -------------------- */}
      {activeTab === "ats" && result && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex justify-between items-start border-b pb-8">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3"><FileCheck className="text-indigo-600 h-8 w-8" /> ATS Checker Report</h2>
              <p className="text-gray-500 mt-2">17-Point comprehensive analysis of your resume structure.</p>
            </div>
            <Button variant="outline" onClick={() => setResult(null)}>Analyze Another</Button>
          </div>

          {/* 1. Overall Score */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-2xl border">
            <div className={`shrink-0 h-32 w-32 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(result.overallScore?.score || 0)}`}>
              <span className="text-4xl font-extrabold">{result.overallScore?.score || 0}%</span>
              <span className="text-xs font-bold uppercase">Grade {result.overallScore?.grade || 'N/A'}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">1. Overall ATS Score</h3>
              <p className="text-gray-600 dark:text-gray-400">{result.overallScore?.summary}</p>
            </div>
          </div>

          {!hasResumePro && !unlockedAts ? (
            <div className="relative border rounded-2xl p-8 bg-gray-50 dark:bg-zinc-800/50 text-center overflow-hidden">
              <div className="absolute inset-0 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black mb-2">Detailed Report Locked</h3>
                <p className="text-muted-foreground mb-6 max-w-md">Unlock the full 17-point detailed breakdown, keyword analysis, and exact copy-paste improvements.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button onClick={() => handlePayPerUse("ats")} className="flex-1 h-12 font-bold bg-indigo-600 hover:bg-indigo-700">
                    Pay ₹50 Once
                  </Button>
                  <Button onClick={() => router.push('/pricing')} variant="outline" className="flex-1 h-12 font-bold border-2 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Get Monthly Pro
                  </Button>
                </div>
              </div>
              
              {/* Blurred background mockup */}
              <div className="opacity-30 blur-sm select-none pointer-events-none">
                <div className="grid grid-cols-2 gap-8 text-left mb-8">
                  <div><div className="h-6 w-32 bg-gray-300 rounded mb-4"></div><div className="space-y-2"><div className="h-8 w-full bg-gray-200 rounded"></div><div className="h-8 w-full bg-gray-200 rounded"></div></div></div>
                  <div><div className="h-6 w-32 bg-gray-300 rounded mb-4"></div><div className="space-y-2"><div className="h-8 w-full bg-gray-200 rounded"></div><div className="h-8 w-full bg-gray-200 rounded"></div></div></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                {/* 2. Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">2. Contact Information</h3>
              <ul className="space-y-2 text-sm">
                {Object.entries(result.contactInfo || {}).map(([key, val]) => (
                  <li key={key} className="flex justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded">
                    <span className="capitalize">{key}</span>
                    {val ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 3. Sections */}
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">3. Resume Sections</h3>
              <ul className="space-y-2 text-sm grid grid-cols-2 gap-2">
                {Object.entries(result.sections || {}).map(([key, val]) => (
                  <li key={key} className="flex justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded">
                    <span className="capitalize">{key}</span>
                    {val ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Formatting */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">4. ATS Formatting Checks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.formatting || {}).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-zinc-800 text-sm font-semibold">
                  {val ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5 & 6. Keywords & Skills */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">5. Keyword Analysis (Found: {result.keywordAnalysis?.found || 0})</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-red-600 mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">{result.keywordAnalysis?.missing?.map((k: string) => <span key={k} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md">{k}</span>)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-600 mb-2">Recommended Keywords</h4>
                  <div className="flex flex-wrap gap-2">{result.keywordAnalysis?.recommended?.map((k: string) => <span key={k} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">{k}</span>)}</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">6. Skills Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-green-600 mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">{result.skillsAnalysis?.technical?.map((k: string) => <span key={k} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">{k}</span>)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-purple-600 mb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">{result.skillsAnalysis?.soft?.map((k: string) => <span key={k} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">{k}</span>)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Summary Review */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-100">7. Summary Review (Score: {result.summaryReview?.score || 0}/10)</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">{result.summaryReview?.suggestions}</p>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-blue-200 text-sm">
              <span className="font-bold text-xs uppercase text-blue-500 block mb-1">Example Rewrite:</span>
              {result.summaryReview?.exampleRewrite}
            </div>
          </div>

          {/* 8 & 9. Experience & Projects */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">8. Experience Review</h3>
            {result.experienceReview?.map((exp: any, i: number) => (
              <div key={i} className="p-4 border rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                <h4 className="font-bold mb-3">{exp.company}</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-green-600">Strong Points:</strong>
                    <ul className="list-disc pl-5 mt-1">{exp.strongPoints?.map((p: string, j: number) => <li key={j}>{p}</li>)}</ul>
                  </div>
                  <div>
                    <strong className="text-red-600">Weak Points:</strong>
                    <ul className="list-disc pl-5 mt-1">{exp.weakPoints?.map((p: string, j: number) => <li key={j}>{p}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 11-14. Grammar, Verbs, Quant, Issues */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">12. Action Verbs</h3>
              <p className="text-sm mb-2"><strong className="text-green-600">Detected:</strong> {result.actionVerbs?.detected?.join(', ')}</p>
              <p className="text-sm"><strong className="text-blue-600">Suggested:</strong> {result.actionVerbs?.suggested?.join(', ')}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">13. Quantification</h3>
              <p className="text-sm mb-2">Has Numbers: {result.quantification?.hasNumbers ? '✅ Yes' : '❌ No'}</p>
              <ul className="text-sm list-disc pl-5">{result.quantification?.examplesFound?.map((e: string, i: number) => <li key={i}>{e}</li>)}</ul>
            </div>
          </div>

          {/* 17. Checklist */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-200">
            <h3 className="text-lg font-bold mb-4 text-indigo-900 dark:text-indigo-100 flex items-center gap-2"><CheckCircle className="h-5 w-5" /> 17. Improvement Checklist</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm font-semibold text-indigo-800 dark:text-indigo-200">
              {result.improvementChecklist?.map((item: string, i: number) => (
                <label key={i} className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-3 rounded-lg border">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" />
                  {item}
                </label>
              ))}
            </div>
          </div>
          </>
          )}

        </div>
      )}

      {/* -------------------- 20-POINT JD REPORT -------------------- */}
      {activeTab === "jd" && result && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex justify-between items-start border-b pb-8">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3"><Search className="text-indigo-600 h-8 w-8" /> JD Match Analyzer</h2>
              <p className="text-gray-500 mt-2">20-Point deep analysis against your target Job Description.</p>
            </div>
            <div className="flex gap-2">
              {result.optimizedResume && (
                <Button onClick={() => downloadDocx(result.optimizedResume, "Optimized_Resume.docx")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <FileDown className="mr-2 h-4 w-4" /> Optimized Resume
                </Button>
              )}
              {result.coverLetter && (
                <Button variant="outline" onClick={() => downloadDocx(result.coverLetter, "Cover_Letter.docx")}>
                  <FileDown className="mr-2 h-4 w-4" /> Cover Letter
                </Button>
              )}
              <Button variant="ghost" onClick={() => setResult(null)}><X className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* 1 & 2. Overall Match & Resume vs JD */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-2xl border border-indigo-100">
            <div className={`shrink-0 h-36 w-36 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(result.overallMatch?.score || 0)}`}>
              <span className="text-5xl font-extrabold">{result.overallMatch?.score || 0}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Match Score</span>
            </div>
            <div className="flex-grow space-y-4 w-full">
              <h3 className="text-2xl font-bold">1. {result.overallMatch?.recommendation}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm bg-white dark:bg-zinc-800 p-4 rounded-xl border">
                <div><span className="text-gray-500 block">Your Resume Title</span><strong className="text-lg">{result.resumeVsJd?.resumeTitle}</strong></div>
                <div><span className="text-gray-500 block">Target Job Title</span><strong className="text-lg">{result.resumeVsJd?.jobTitle}</strong></div>
              </div>
            </div>
          </div>

          {!hasResumePro && !unlockedJd ? (
            <div className="relative border rounded-2xl p-8 bg-indigo-50/30 dark:bg-indigo-900/10 text-center overflow-hidden">
              <div className="absolute inset-0 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black mb-2">JD Match Details Locked</h3>
                <p className="text-muted-foreground mb-6 max-w-md">Unlock missing skills, missing keywords, optimized bullet points, and the AI-generated summary rewrite.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button onClick={() => handlePayPerUse("jd")} className="flex-1 h-12 font-bold bg-indigo-600 hover:bg-indigo-700">
                    Pay ₹100 Once
                  </Button>
                  <Button onClick={() => router.push('/pricing')} variant="outline" className="flex-1 h-12 font-bold border-2 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Get Monthly Pro
                  </Button>
                </div>
              </div>
              
              {/* Blurred background mockup */}
              <div className="opacity-30 blur-sm select-none pointer-events-none text-left">
                <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
                <div className="grid grid-cols-6 gap-4 mb-8">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>)}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 16. Match Breakdown */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">16. Match Breakdown</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
              {Object.entries(result.matchBreakdown || {}).map(([key, val]) => (
                <div key={key} className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-xl border">
                  <span className={`text-xl font-bold block ${Number(val) > 75 ? 'text-green-600' : 'text-amber-600'}`}>{String(val)}%</span>
                  <span className="text-xs text-gray-500 uppercase font-semibold capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 & 4. Skills & Keywords */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">3. Skills Match</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-green-600 mb-1">Skills Found</h4>
                  <div className="flex flex-wrap gap-1">{result.skillsMatch?.found?.map((k: string) => <span key={k} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{k}</span>)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-600 mb-1">Missing Skills</h4>
                  <div className="flex flex-wrap gap-1">{result.skillsMatch?.missing?.map((k: string) => <span key={k} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{k}</span>)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-600 mb-1">Nice-to-Have</h4>
                  <div className="flex flex-wrap gap-1">{result.skillsMatch?.niceToHave?.map((k: string) => <span key={k} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{k}</span>)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">4. Keyword Match</h3>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border space-y-2 text-sm">
                <div className="flex justify-between"><span>Total JD Keywords:</span><strong>{result.keywordMatch?.totalJdKeywords}</strong></div>
                <div className="flex justify-between"><span>Keywords Matched:</span><strong className="text-green-600">{result.keywordMatch?.matched}</strong></div>
                <div className="flex justify-between"><span>Keywords Missing:</span><strong className="text-red-600">{result.keywordMatch?.missing?.length || 0}</strong></div>
                <div className="pt-2 mt-2 border-t flex justify-between font-bold"><span>Keyword Score:</span><span>{result.keywordMatch?.matchPercentage}%</span></div>
              </div>
            </div>
          </div>

          {/* 8. Responsibilities */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">8. Responsibilities Match</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {result.responsibilitiesMatch?.map((req: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border">
                  {req.covered ? <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /> : <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
                  <span className={req.covered ? "text-gray-800 dark:text-gray-200" : "text-gray-500"}>{req.responsibility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 14. Bullet Point Suggestions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">14. Bullet Point Suggestions</h3>
            <div className="space-y-4">
              {result.bulletPointSuggestions?.map((bullet: any, i: number) => (
                <div key={i} className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border text-sm">
                  <div>
                    <span className="text-xs font-bold uppercase text-red-500 block mb-1">Original Bullet</span>
                    <p className="line-through opacity-70">{bullet.original}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-green-500 block mb-1">JD-Optimized Bullet</span>
                    <p className="font-medium text-green-800 dark:text-green-200">{bullet.improved}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Generated Summary & Suggestions */}
          <div className="space-y-8 pt-6 border-t">
            {result.summaryRewrite && (
              <div className="bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200">
                <h3 className="text-lg font-bold flex items-center gap-2 text-blue-800 dark:text-blue-300 mb-3">
                  <Lightbulb className="h-5 w-5" /> AI-Generated Summary Rewrite
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your current summary is weak for this JD. Use this AI-optimized summary instead:</p>
                <div className="relative group">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 bg-white dark:bg-zinc-800 p-4 rounded-xl border shadow-sm">
                    {result.summaryRewrite}
                  </p>
                  <button onClick={() => handleCopy(result.summaryRewrite)} className="absolute top-2 right-2 p-2 bg-gray-100 dark:bg-zinc-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedText === result.summaryRewrite ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {result.suggestedAdditions && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><PlusCircle className="text-indigo-600 h-6 w-6" /> Resume Gap Fillers (Suggested by AI)</h3>
                <p className="text-sm text-gray-500">You don't have enough projects or experience for this JD. The AI recommends building or acquiring these exactly:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Suggested Projects */}
                  {result.suggestedAdditions.projects && result.suggestedAdditions.projects.length > 0 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100">
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 border-b border-indigo-200 pb-2">Suggested Projects to Build</h4>
                      <div className="space-y-4">
                        {result.suggestedAdditions.projects.map((proj: any, i: number) => (
                          <div key={i} className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm text-sm border">
                            <strong className="block text-base text-indigo-700 dark:text-indigo-400 mb-1">{proj.title}</strong>
                            <p className="mb-2 text-gray-700 dark:text-gray-300">{proj.description}</p>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Why: {proj.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Experience */}
                  {result.suggestedAdditions.experience && result.suggestedAdditions.experience.length > 0 && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 border-b border-emerald-200 pb-2">Suggested Internships/Roles to Pursue</h4>
                      <div className="space-y-4">
                        {result.suggestedAdditions.experience.map((exp: any, i: number) => (
                          <div key={i} className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm text-sm border">
                            <strong className="block text-base text-emerald-700 dark:text-emerald-400 mb-1">{exp.role}</strong>
                            <p className="mb-2 text-gray-700 dark:text-gray-300">{exp.description}</p>
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Why: {exp.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 21. Direct Copy-Paste Changes */}
          {result.copyableChanges && result.copyableChanges.length > 0 && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Copy className="h-5 w-5" /> Copy & Paste Ready Changes
              </h3>
              <p className="text-sm text-gray-500 mb-4">Directly copy these optimized points into your resume to instantly boost your ATS score.</p>
              
              <div className="grid gap-6">
                {result.copyableChanges.map((change: any, i: number) => (
                  <div key={i} className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 overflow-hidden">
                    <div className="bg-indigo-100/50 dark:bg-indigo-900/30 px-4 py-2 border-b border-indigo-100 font-bold text-sm text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">
                      {change.section} Section
                    </div>
                    <ul className="p-4 space-y-3">
                      {change.points?.map((point: string, j: number) => (
                        <li key={j} className="flex gap-4 items-start group">
                          <div className="flex-grow text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {point}
                          </div>
                          <button 
                            onClick={() => handleCopy(point)}
                            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-indigo-600 bg-white border border-indigo-200 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            {copiedText === point ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                            {copiedText === point ? "Copied!" : "Copy"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 17. Interview Readiness */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 flex items-center gap-6">
            <div className="text-amber-500 flex text-4xl">
              {"★".repeat(result.interviewReadiness?.stars || 0)}{"☆".repeat(5 - (result.interviewReadiness?.stars || 0))}
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">17. Interview Readiness</h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">{result.interviewReadiness?.confidenceLevel}</p>
            </div>
          </div>

          {/* 19. Action Plan */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">19. Action Plan to hit 100%</h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm font-semibold">
              {result.actionPlan?.map((item: string, i: number) => (
                <label key={i} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 p-3 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" />
                  {item}
                </label>
              ))}
            </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* -------------------- AI RESUME MAKER -------------------- */}
      {activeTab === "maker" && !makerResult && (
        <div className="max-w-4xl mx-auto space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100">AI Resume Maker</h2>
            <p className="text-gray-500 mt-2">Generate a perfect ATS resume in seconds using an AI prompt.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" /> 1. Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name" value={makerInfo.name} onChange={(e) => setMakerInfo({...makerInfo, name: e.target.value})} className="col-span-2 w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="text" placeholder="Desired Title (e.g. Frontend Dev)" value={makerInfo.title} onChange={(e) => setMakerInfo({...makerInfo, title: e.target.value})} className="col-span-2 w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="email" placeholder="Email" value={makerInfo.email} onChange={(e) => setMakerInfo({...makerInfo, email: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="tel" placeholder="Phone" value={makerInfo.phone} onChange={(e) => setMakerInfo({...makerInfo, phone: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="text" placeholder="LinkedIn URL" value={makerInfo.linkedin} onChange={(e) => setMakerInfo({...makerInfo, linkedin: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="text" placeholder="GitHub URL" value={makerInfo.github} onChange={(e) => setMakerInfo({...makerInfo, github: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
              </div>
              <h3 className="text-lg font-bold flex items-center gap-2 mt-4">
                <GraduationCap className="h-5 w-5 text-indigo-500" /> Education Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="College/University Name" value={makerInfo.college} onChange={(e) => setMakerInfo({...makerInfo, college: e.target.value})} className="col-span-2 w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="text" placeholder="Course (e.g. B.Tech)" value={makerInfo.course} onChange={(e) => setMakerInfo({...makerInfo, course: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="text" placeholder="Branch (e.g. CSE)" value={makerInfo.branch} onChange={(e) => setMakerInfo({...makerInfo, branch: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="text" placeholder="Location" value={makerInfo.location} onChange={(e) => setMakerInfo({...makerInfo, location: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
                <input type="text" placeholder="Graduation Year" value={makerInfo.graduationYear} onChange={(e) => setMakerInfo({...makerInfo, graduationYear: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border rounded-xl" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-indigo-500" /> 2. AI Prompt
              </h3>
              <textarea 
                placeholder="E.g. Create a highly professional Software Engineering resume. I have 3 years of experience at Amazon working on AWS lambda, and I graduated from Stanford. I want the tone to be impactful..."
                value={makerPrompt}
                onChange={(e) => setMakerPrompt(e.target.value)}
                className="w-full h-32 p-4 bg-gray-50 dark:bg-zinc-800 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500"
              />

              <h3 className="text-lg font-bold flex items-center gap-2 mt-4">
                <Upload className="h-5 w-5 text-indigo-500" /> 3. Sample Template (Optional)
              </h3>
              <div onClick={() => makerFileRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <p className="text-sm font-semibold">{makerTemplate ? makerTemplate.name : "Upload a PDF/DOCX to extract layout"}</p>
                <input type="file" ref={makerFileRef} onChange={(e) => setMakerTemplate(e.target.files?.[0] || null)} accept=".pdf,.docx" className="hidden" />
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-xl shadow-indigo-500/20 rounded-xl mt-8"
            onClick={async () => {
              if (!makerPrompt) return alert("Please enter a prompt.");
              if (!hasResumePro && !unlockedAts) return setShowPaywall("ats"); // Using ATS paywall check for now
              setIsMaking(true);
              try {
                const formData = new FormData();
                formData.append('prompt', makerPrompt);
                formData.append('personalInfo', JSON.stringify(makerInfo));
                formData.append('preferredModel', preferredModel);
                if (makerTemplate) formData.append('file', makerTemplate);

                const res = await fetch('/api/generate-resume', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setMakerResult(data);
              } catch (err: any) {
                alert(err.message || "Failed to generate resume.");
              } finally {
                setIsMaking(false);
              }
            }}
            disabled={isMaking}
          >
            {isMaking ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Your Resume...</>
            ) : (
              <><Zap className="mr-2 h-5 w-5" /> Generate Resume Now</>
            )}
          </Button>
        </div>
      )}

      {activeTab === "maker" && makerResult && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Button variant="outline" onClick={() => setMakerResult(null)} className="mb-4">
            ← Back to Generator
          </Button>
          <ResumeEditor initialData={makerResult} />
        </div>
      )}

      {/* -------------------- COMMUNITY TAB -------------------- */}
      {activeTab === "community" && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Winning Resumes</h2>
            <Button onClick={() => setShowPostModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" /> Publish Yours
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 bg-white dark:bg-zinc-900 p-4 rounded-xl border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">Experience:</span>
              {["All", "Fresher", "Experienced"].map(level => (
                <button 
                  key={level} onClick={() => setFilterExp(level)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterExp === level ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
                >{level}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 border-l pl-4 ml-2">
              <span className="text-sm font-semibold text-gray-500">Domain:</span>
              {["All", "Software Engineering", "Data Science", "Product Management", "Design"].map(domain => (
                <button 
                  key={domain} onClick={() => setFilterDomain(domain)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterDomain === domain ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
                >{domain}</button>
              ))}
            </div>
          </div>

          {loadingCommunity ? (
            <div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-indigo-500" /></div>
          ) : filteredResumes.length === 0 ? (
            <div className="text-center p-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed">
              <h3 className="text-xl font-bold">No resumes found</h3>
              <p className="text-gray-500 mt-2">Be the first to publish a resume in this category!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <div key={resume.id} className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  {resume._type === 'premium' && resume.image_url && (
                    <div className="relative h-44 bg-muted">
                      <img src={resume.image_url} alt={resume.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> Premium
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-900 font-extrabold text-sm px-3 py-1 rounded-full shadow">
                        ₹{resume.price}
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        resume._type === 'premium' 
                          ? 'bg-amber-100 text-amber-700' 
                          : resume.experience_level === 'Fresher' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {resume._type === 'premium' ? '⭐ Premium Template' : resume.experience_level}
                      </span>
                      <div className="flex gap-2">
                        {resume._type === 'premium' && !resume.image_url && (
                          <span className="text-xs font-extrabold text-white bg-gray-900 px-3 py-1 rounded-full shadow-sm">
                            ₹{resume.price}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{resume.domain}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{resume.name}</h3>
                    {resume._type === 'community' && (
                      <div className="flex items-center gap-2 mt-4 text-sm bg-blue-50 p-3 rounded-lg">
                        <Building className="h-5 w-5 text-blue-500" />
                        <div>
                          <span className="block text-xs font-semibold uppercase text-blue-400">Shortlisted By</span>
                          <span className="font-bold text-gray-800">{resume.shortlisted_by}</span>
                        </div>
                      </div>
                    )}
                    {resume._type === 'premium' && resume.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {resume.description.replace(/[#*`_[\]]/g, '')}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 border-t divide-x">
                    {resume._type === 'premium' ? (
                      purchasedIds.includes(String(resume.id)) || hasResumePro ? (
                        <a href={resume.file_url === 'pending' ? `/view/${resume.id}` : (resume.file_url || resume.pdf_url || '#')} target={resume.file_url === 'pending' ? "_self" : "_blank"} rel="noreferrer"
                          className="py-4 flex items-center justify-center gap-2 text-sm font-bold text-green-600 hover:bg-green-50 bg-green-50/30">
                          <CheckCircle className="h-4 w-4" /> Open Resume
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            const price = typeof resume.price === 'string' ? parseFloat(resume.price.replace(/[^\d.]/g, '')) : Number(resume.price);
                            addToCart({ id: resume.id, title: resume.name, price: price || 0, quantity: 1, image_url: resume.image_url, file_url: resume.file_url || resume.pdf_url });
                            alert(`${resume.name} added to cart!`);
                          }}
                          className="py-4 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 bg-indigo-50/30">
                          <Lock className="h-4 w-4" /> Unlock for ₹{resume.price}
                        </button>
                      )
                    ) : (
                      <>
                        <button className="py-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"><Eye className="h-4 w-4" /> Preview</button>
                        <button className="py-4 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"><Download className="h-4 w-4" /> Download</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* POST MODAL */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold flex items-center gap-2"><PlusCircle className="text-indigo-600" /> Publish Resume</h2>
                <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-800"><X className="h-6 w-6" /></button>
              </div>
              <form onSubmit={handlePostResume} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Candidate Name</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Contact Number</label>
                    <input required value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Shortlisted By (Company)</label>
                  <input required value={formData.shortlistedBy} onChange={e => setFormData({...formData, shortlistedBy: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Domain</label>
                    <select value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800">
                      <option>Software Engineering</option>
                      <option>Data Science</option>
                      <option>Product Management</option>
                      <option>Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Experience Level</label>
                    <select value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800">
                      <option>Fresher</option>
                      <option>Experienced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Upload Resume Document</label>
                  <input type="file" accept=".pdf,.docx" required className="w-full p-3 rounded-xl border bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700" />
                </div>
                <div className="pt-4 mt-2 border-t">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Publish to Community"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM PAYWALL MODAL */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-950 rounded-[2rem] w-full max-w-2xl border border-indigo-500/30 relative overflow-hidden my-8 shadow-[0_0_100px_rgba(79,70,229,0.2)]"
            >
              {/* Glowing Background FX */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]"></div>

              <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
                <button onClick={() => setShowPaywall(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-zinc-900 rounded-full p-2 transition-colors">
                  <X className="h-5 w-5" />
                </button>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 border border-white/10">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Dream Career</span>
                </h2>
                
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Your resume has massive potential. Get the exact ATS keywords and structural changes needed to bypass recruiters.
                </p>

                <div className="grid md:grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-6 text-left hover:border-indigo-500/30 transition-colors">
                    <h3 className="text-indigo-400 font-bold mb-1">ATS Scanner</h3>
                    <div className="text-3xl font-black text-white mb-2">₹49</div>
                    <ul className="space-y-2 text-sm text-gray-400 mb-6">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> 17-Point Structure Check</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Action Verb Analysis</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Formatting Audit</li>
                    </ul>
                    <Button onClick={() => handlePayPerUse("ats")} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold h-12">
                      Unlock ATS Audit
                    </Button>
                  </div>
                  
                  <div className="bg-gradient-to-b from-indigo-900/40 to-zinc-900/80 border border-indigo-500/50 rounded-2xl p-6 text-left relative overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.15)]">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">MOST POPULAR</div>
                    <h3 className="text-purple-400 font-bold mb-1">JD Tailor</h3>
                    <div className="text-3xl font-black text-white mb-2">₹99</div>
                    <ul className="space-y-2 text-sm text-gray-300 mb-6">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> 20-Point Keyword Match</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> AI Resume Rewrite</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> 95%+ Interview Chance</li>
                    </ul>
                    <Button onClick={() => handlePayPerUse("jd")} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold h-12 shadow-lg shadow-indigo-500/25">
                      Auto-Tailor Resume
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <Lock className="h-3 w-3" /> Secure Razorpay Checkout • 100% Satisfaction Guarantee
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
