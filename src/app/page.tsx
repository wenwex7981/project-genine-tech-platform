"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Globe, ShieldCheck, Zap, MapPin, Star, CheckCircle,
  BookOpen, Brain, FileText, Cpu, Users, Award, Rocket, Code2,
  Bot, PenTool, BarChart3, Briefcase, GraduationCap, Phone, 
  ChevronRight, TrendingUp, Lock, Layers, Database, Cloud, CreditCard, Shield
} from "lucide-react";
import AuthRedirect from "@/components/AuthRedirect";

// ── DATA CONSTANTS ──
const STATS = [
  { value: "2,500+", label: "Projects Delivered" },
  { value: "98%", label: "Student Satisfaction" },
  { value: "50+", label: "Cities Across India" },
  { value: "0%", label: "Plagiarism Score" },
];

const SERVICES = [
  {
    icon: Code2, color: "from-blue-500 to-indigo-500",
    title: "Final Year Projects",
    description: "Complete, deployable source code for B.Tech, M.Tech, BCA, MCA. Covers AI/ML, IoT, Web3 with full documentation.",
    features: ["Source Code", "Base Paper", "SRS Document"],
    badge: "Most Popular",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: FileText, color: "from-orange-400 to-rose-500",
    title: "ATS Resume Builder",
    description: "Our intelligent Resume Hub grades your CV against a 17-point ATS scoring rubric to bypass HR filters.",
    features: ["17-Point ATS Scoring", "JD Matching"],
    badge: "Career Tool",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: Brain, color: "from-violet-500 to-fuchsia-500",
    title: "AI Stealth Humanizer",
    description: "Refine AI-generated text into natural, human-quality academic writing with proper style.",
    features: ["Natural Tone", "Zero Plagiarism"],
    badge: "Exclusive",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: ShieldCheck, color: "from-emerald-400 to-teal-500",
    title: "0% Plagiarism Docs",
    description: "Expertly crafted IEEE Research Papers and SRS documents with rigorous originality checks.",
    features: ["IEEE Format", "Originality Verified"],
    badge: "High Demand",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: Rocket, color: "from-rose-500 to-pink-600",
    title: "Live Hackathons",
    description: "Real-time directory of national and international coding contests and ideathons.",
    features: ["Real-Time Listings", "Team Formation"],
    badge: "Live",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: PenTool, color: "from-cyan-400 to-blue-500",
    title: "Custom Projects",
    description: "Have a unique base paper? We will architect and code the entire project from scratch.",
    features: ["End-to-End Dev", "Viva Prep"],
    badge: "Premium",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
];

const CATEGORIES = [
  { icon: Cpu, name: "AI & Machine Learning", count: "120+" },
  { icon: Globe, name: "Internet of Things", count: "85+" },
  { icon: Database, name: "Blockchain & Web3", count: "60+" },
  { icon: Cloud, name: "Cloud Computing", count: "45+" },
  { icon: Bot, name: "Deep Learning & NLP", count: "95+" },
  { icon: Layers, name: "Full Stack Web & Mobile", count: "150+" },
  { icon: Lock, name: "Cybersecurity", count: "40+" },
  { icon: BarChart3, name: "Data Science", count: "75+" },
];

const TESTIMONIALS = [
  { name: "Sai Kiran Reddy", college: "JNTUH, Hyderabad", text: "Ordered a crop prediction system 2 months before submission. Got 98/100 from my guide. Absolutely life-saving!" },
  { name: "Priya Sharma", college: "VIT, Vellore", text: "The AI Writing Enhancer refined my 40-page thesis perfectly. The tone reads beautifully. Essential tool." },
  { name: "Rahul Nair", college: "Anna University", text: "Their ATS Resume Builder got me shortlisted at 4 MNCs. The JD matching is insanely accurate. Landed Infosys!" },
  { name: "Ananya Gupta", college: "Amity University", text: "Ordered a custom Blockchain project. They built a decentralized voting system from scratch. Got an A grade." },
  { name: "Vikram Singh", college: "SRM Institute", text: "The Zero Plagiarism IEEE paper they wrote for me was accepted in a major conference. Flawless work." },
  { name: "Megha Jain", college: "Delhi University", text: "Saved me months of coding. The documentation was thorough, and the viva prep guide helped me answer confidently." },
];

const LOCATIONS = [
  "Hyderabad", "Bengaluru", "Chennai", "Mumbai", "Delhi NCR",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"
];

// ── ANIMATION VARIANTS ──
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "url": "https://www.graduatenex.online/",
        "name": "GraduateNex",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.graduatenex.online/projects?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "GraduateNex",
        "url": "https://www.graduatenex.online/",
        "logo": "https://www.graduatenex.online/logo.png"
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-indigo-500/30 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthRedirect />

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative w-full min-h-[95vh] flex flex-col justify-center items-center overflow-hidden pt-20">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-zinc-950 z-10 opacity-60 mix-blend-multiply" />
          <motion.div style={{ y: yBg }} className="absolute inset-0">
            <Image src="/images/hero-bg.png" alt="Hero" fill priority className="object-cover object-center opacity-40" />
          </motion.div>
          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <motion.div 
          style={{ opacity: opacityText }}
          className="container mx-auto px-4 relative z-20"
        >
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm font-bold backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              India's #1 Academic Success Platform
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]"
            >
              Engineer Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                Future Today.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              From ready-to-deploy final year projects to AI-powered ATS resumes — GraduateNex is the complete ecosystem helping 2,500+ students graduate with distinction.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link href="/login" className="w-full sm:w-auto group">
                <div className="relative px-8 py-4 bg-white text-zinc-950 font-black text-lg rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-all transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    Start Free Today <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
              <Link href="#services" className="w-full sm:w-auto">
                <div className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg rounded-2xl backdrop-blur-md transition-all">
                  Explore Services
                </div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-12"
            >
              {[
                { icon: CheckCircle, text: "Zero Plagiarism" },
                { icon: Shield, text: "24/7 Expert Support" },
                { icon: MapPin, text: "50+ Cities Served" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-400 font-semibold">
                  <item.icon className="h-4 w-4 text-emerald-400" /> {item.text}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="relative py-12 border-y border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {STATS.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{s.value}</div>
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES (BENTO GRID) ── */}
      <section id="services" className="py-24 relative overflow-hidden bg-zinc-950">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold">
              <Layers className="h-4 w-4" /> Our Product Suite
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              Everything You Need to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Succeed.</span>
            </h2>
            <p className="text-xl text-zinc-400 font-medium">
              We're a full-stack academic success platform covering projects, documentation, AI tools, and career launch.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {SERVICES.map((svc, i) => (
              <motion.div 
                key={i} variants={fadeUp}
                className={`group relative p-8 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all overflow-hidden ${svc.colSpan}`}
              >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${svc.color} opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-500`} />
                
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center shadow-lg`}>
                    <svc.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    {svc.badge}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-white mb-4">{svc.title}</h3>
                <p className="text-zinc-400 font-medium leading-relaxed mb-8">
                  {svc.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {svc.features.map(f => (
                    <span key={f} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                      {f}
                    </span>
                  ))}
                </div>
                
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-white group/btn">
                  Explore Feature <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROJECT CATEGORIES ── */}
      <section className="py-24 bg-zinc-900 border-y border-zinc-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Explore by Domain</h2>
            <p className="text-xl text-zinc-400">Browse our deep catalogue of ready-made projects across every major engineering domain.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link href="/login" className="group flex items-center gap-4 p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{cat.name}</h4>
                    <p className="text-sm font-medium text-zinc-500">{cat.count} Projects</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              From Order to Delivery in <span className="text-emerald-400">3 Steps</span>
            </h2>
            <p className="text-xl text-zinc-400">We've streamlined the entire process so you can focus on your viva.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-zinc-800 via-emerald-500/50 to-zinc-800 -z-10" />

            {[
              { step: "01", icon: Search, title: "Browse & Select", desc: "Explore our marketplace. Filter by tech stack. View detailed specs and demo videos." },
              { step: "02", icon: Zap, title: "Checkout & Customize", desc: "Place your order and upload your professor's base paper or specific rubric requirements." },
              { step: "03", icon: Code2, title: "Receive & Deploy", desc: "Get your complete package: source code, SRS, IEEE paper, PPT, and deployment guide." }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] mb-6 z-10">
                  <s.icon className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="absolute top-0 right-[calc(50%-3rem)] bg-white text-zinc-950 text-sm font-black w-8 h-8 rounded-full flex items-center justify-center z-20">
                  {s.step}
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{s.title}</h3>
                <p className="text-zinc-400 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 bg-zinc-900 border-y border-zinc-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Transparent Pricing</h2>
            <p className="text-xl text-zinc-400">No hidden fees. No "Contact us for price". Immediate access.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "ATS Resume Builder", price: "₹99", desc: "AI-generated ATS-friendly resume." },
              { name: "JD Match Analyzer", price: "₹149", desc: "Match your resume to specific job roles." },
              { name: "Project Documentation", price: "₹299", desc: "Instant IEEE/SRS documentation templates." },
              { name: "Final Year Projects", price: "From ₹6k", desc: "Complete source code & support.", featured: true },
            ].map((plan, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`flex flex-col justify-between p-8 rounded-3xl ${plan.featured ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20' : 'bg-zinc-950 border-zinc-800' } border transition-transform hover:-translate-y-2`}
              >
                <div>
                  <h3 className={`text-xl font-bold mb-3 ${plan.featured ? 'text-white' : 'text-zinc-100'}`}>{plan.name}</h3>
                  <p className={`text-sm mb-8 font-medium ${plan.featured ? 'text-indigo-100' : 'text-zinc-400'}`}>{plan.desc}</p>
                </div>
                <div>
                  <div className={`text-4xl font-black mb-8 ${plan.featured ? 'text-white' : 'text-emerald-400'}`}>{plan.price}</div>
                  <Link href="/services" className={`block w-full py-4 text-center rounded-xl font-bold transition-colors ${plan.featured ? 'bg-white text-indigo-600 hover:bg-zinc-50' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (MARQUEE) ── */}
      <section className="py-24 bg-zinc-950 overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white">Trusted by 2,500+ Students</h2>
        </div>
        
        {/* Infinite Marquee */}
        <div className="relative w-full flex overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            className="flex gap-6 w-max px-4"
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="w-80 md:w-96 p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between shrink-0">
                <div>
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-zinc-300 font-medium leading-relaxed mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-zinc-500 font-medium">{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOUNDER SECTION ── */}
      <section className="py-24 bg-zinc-900 border-y border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 bg-zinc-950 p-8 md:p-16 rounded-[3rem] border border-zinc-800 shadow-2xl">
            <div className="w-48 h-48 md:w-72 md:h-72 shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-2 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
              <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-zinc-950">
                <Image src="/founder_nithin.jpg" alt="Appala Nithin" fill className="object-cover object-top" />
              </div>
            </div>
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                Founder & CEO
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white">Appala Nithin</h3>
              <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
                "I built GraduateNex because I saw brilliant students failing not due to a lack of intelligence, but because of a broken system. We provide the tools, the code, and the documents so you can focus on building your career, not fighting red tape."
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <span className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-300">EdTech Visionary</span>
                <span className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-300">2,500+ Students Helped</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-32 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Graduate?</span>
            </h2>
            <p className="text-xl text-zinc-400 font-medium">
              Join 2,500+ students who secured top grades and landed their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/login" className="px-10 py-5 rounded-2xl bg-white text-zinc-950 font-black text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Start For Free
              </Link>
              <a href="tel:+917981994870" className="px-10 py-5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white font-bold text-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" /> Call Sales
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
