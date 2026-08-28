"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Globe, ShieldCheck, Zap, MapPin, Star, CheckCircle,
  BookOpen, Brain, FileText, Cpu, Users, Award, Rocket, Code2,
  Bot, PenTool, BarChart3, Briefcase, GraduationCap, Phone, 
  ChevronRight, TrendingUp, Lock, Layers, Database, Cloud, CreditCard, Shield, Search
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
    icon: Code2, color: "bg-blue-50 text-blue-600",
    title: "Final Year Projects",
    description: "Complete, deployable source code for B.Tech, M.Tech, BCA, MCA. Covers AI/ML, IoT, Web3 with full documentation.",
    features: ["Source Code", "Base Paper", "SRS Document"],
    badge: "Most Popular",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: FileText, color: "bg-orange-50 text-orange-600",
    title: "ATS Resume Builder",
    description: "Our intelligent Resume Hub grades your CV against a 17-point ATS scoring rubric to bypass HR filters.",
    features: ["17-Point ATS Scoring", "JD Matching"],
    badge: "Career Tool",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: Brain, color: "bg-violet-50 text-violet-600",
    title: "AI Stealth Humanizer",
    description: "Refine AI-generated text into natural, human-quality academic writing with proper style.",
    features: ["Natural Tone", "Zero Plagiarism"],
    badge: "Exclusive",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600",
    title: "0% Plagiarism Docs",
    description: "Expertly crafted IEEE Research Papers and SRS documents with rigorous originality checks.",
    features: ["IEEE Format", "Originality Verified"],
    badge: "High Demand",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: Rocket, color: "bg-rose-50 text-rose-600",
    title: "Live Hackathons",
    description: "Real-time directory of national and international coding contests and ideathons.",
    features: ["Real-Time Listings", "Team Formation"],
    badge: "Live",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: PenTool, color: "bg-cyan-50 text-cyan-600",
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

// ── ANIMATION VARIANTS ──
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
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
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthRedirect />

      {/* ── LUXURY HERO SECTION ── */}
      <section ref={heroRef} className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-20 bg-slate-50">
        {/* Soft elegant background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <motion.div 
          style={{ opacity: opacityText, y: yBg }}
          className="container mx-auto px-4 relative z-20"
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-semibold shadow-sm"
            >
              <Globe className="h-4 w-4 text-indigo-500" /> India's Premier Academic Success Platform
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.05] text-slate-900"
            >
              Engineer Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Future Today.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              From ready-to-deploy final year projects to AI-powered ATS resumes — GraduateNex is the complete ecosystem helping 2,500+ students graduate with distinction.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
            >
              <Link href="/login" className="w-full sm:w-auto group">
                <div className="px-8 py-4 bg-slate-900 text-white font-semibold text-lg rounded-2xl shadow-[0_8px_30px_rgb(15,23,42,0.12)] hover:shadow-[0_8px_30px_rgb(15,23,42,0.2)] hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  Start Free Today <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link href="#services" className="w-full sm:w-auto">
                <div className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold text-lg rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center">
                  Explore Services
                </div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-12"
            >
              {[
                { icon: CheckCircle, text: "Zero Plagiarism" },
                { icon: Shield, text: "24/7 Expert Support" },
                { icon: MapPin, text: "50+ Cities Served" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <item.icon className="h-4 w-4 text-emerald-500" /> {item.text}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="relative py-16 bg-white border-b border-slate-100 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            {STATS.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">{s.value}</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES (LUXURY BENTO GRID) ── */}
      <section id="services" className="py-32 relative bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-20 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Everything You Need to <span className="text-indigo-600">Succeed.</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium">
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
                className={`group relative p-8 md:p-10 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all overflow-hidden ${svc.colSpan}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl ${svc.color} flex items-center justify-center`}>
                    <svc.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
                    {svc.badge}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{svc.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                  {svc.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {svc.features.map(f => (
                    <span key={f} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
                      {f}
                    </span>
                  ))}
                </div>
                
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group/btn">
                  Explore Feature <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROJECT CATEGORIES ── */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Explore by Domain</h2>
            <p className="text-lg text-slate-600 font-medium">Browse our deep catalogue of ready-made projects across every major engineering domain.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link href="/login" className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{cat.name}</h4>
                    <p className="text-sm font-medium text-slate-500">{cat.count} Projects</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              From Order to Delivery in <span className="text-indigo-600">3 Steps</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium">We've streamlined the entire process so you can focus on your viva.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-slate-200 -z-10" />

            {[
              { step: "1", icon: Search, title: "Browse & Select", desc: "Explore our marketplace. Filter by tech stack. View detailed specs and demo videos." },
              { step: "2", icon: Zap, title: "Checkout & Customize", desc: "Place your order and upload your professor's base paper or specific rubric requirements." },
              { step: "3", icon: Code2, title: "Receive & Deploy", desc: "Get your complete package: source code, SRS, IEEE paper, PPT, and deployment guide." }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-24 h-24 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md mb-8 z-10">
                  <s.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="absolute top-0 right-[calc(50%-3rem)] bg-slate-900 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center z-20 shadow-lg">
                  {s.step}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{s.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-32 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Transparent Pricing</h2>
            <p className="text-xl text-slate-600 font-medium">No hidden fees. No "Contact us for price". Immediate access.</p>
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
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`flex flex-col justify-between p-8 rounded-[2rem] ${plan.featured ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 border-indigo-600' : 'bg-white border-slate-200 text-slate-900 hover:shadow-lg' } border transition-shadow`}
              >
                <div>
                  <h3 className={`text-xl font-bold mb-3 ${plan.featured ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <p className={`text-sm mb-8 font-medium ${plan.featured ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>
                <div>
                  <div className={`text-4xl font-extrabold mb-8 ${plan.featured ? 'text-white' : 'text-slate-900'}`}>{plan.price}</div>
                  <Link href="/services" className={`block w-full py-4 text-center rounded-xl font-semibold transition-colors ${plan.featured ? 'bg-white text-indigo-600 hover:bg-slate-50' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}>
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (MARQUEE) ── */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">Trusted by 2,500+ Students</h2>
        </div>
        
        {/* Infinite Marquee */}
        <div className="relative w-full flex overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            className="flex gap-6 w-max px-4"
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="w-80 md:w-96 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between shrink-0">
                <div>
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-10 bg-slate-900 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle glow inside CTA */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight relative z-10">
              Ready to <span className="text-indigo-400">Graduate?</span>
            </h2>
            <p className="text-xl text-slate-300 font-medium relative z-10">
              Join 2,500+ students who secured top grades and landed their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 relative z-10">
              <Link href="/login" className="px-10 py-5 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg">
                Start For Free
              </Link>
              <a href="tel:+917981994870" className="px-10 py-5 rounded-2xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" /> Call Sales
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
