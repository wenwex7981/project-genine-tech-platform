"use client";

import Link from "next/link";
import { useCountry } from '@/context/CountryContext';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ArrowRight, Globe, ShieldCheck, Zap, MapPin, Star, CheckCircle,
  BookOpen, Brain, FileText, Cpu, Users, Award, Rocket, Code2,
  Bot, PenTool, BarChart3, Briefcase, GraduationCap, Phone, Mail,
  ChevronRight, TrendingUp, Lock, Layers, Database, Cloud, CreditCard, Shield
} from "lucide-react";
import AuthRedirect from "@/components/AuthRedirect";

const STATS = [
  { value: "2,500+", label: "Active Global Users" },
  { value: "98%", label: "Client Success Rate" },
  { value: "15+", label: "Countries Worldwide" },
  { value: "0%", label: "Plagiarism Guarantee" },
];

const SERVICES = [
  {
    icon: <Code2 className="h-8 w-8" />,
    color: "blue",
    title: "Capstone & Portfolio Projects",
    description: "Complete, deployable source code for computer science, engineering, and MBA capstones. Master AI/ML, IoT, Blockchain, and Full-Stack development.",
    features: ["Production-Ready Code", "Base Research Paper", "System Architecture", "Pitch Deck Presentation"],
    badge: "Most Popular",
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    color: "emerald",
    title: "Technical Documentation",
    description: "Our expert team crafts completely original IEEE-format research papers, whitepapers, and system design documents with rigorous originality checks.",
    features: ["IEEE Format Papers", "Whitepapers & System Docs", "Originality Verified", "Peer-Review Ready"],
    badge: "High Demand",
  },
  {
    icon: <Brain className="h-8 w-8" />,
    color: "violet",
    title: "AI Stealth Humanizer",
    description: "Advanced AI content enhancement tool that refines and paraphrases AI-generated text into natural, human-quality academic writing with proper tone.",
    features: ["Natural Language Refinement", "Semantic Preservation", "Academic Tone Maintained", "Bulk Text Processing"],
    badge: "Exclusive",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    color: "orange",
    title: "ATS Resume Builder",
    description: "Our intelligent Resume Hub grades your CV against a 17-point ATS scoring rubric and generates tailored resumes that beat tracking systems at top global firms.",
    features: ["17-Point ATS Scoring", "Job Description Matching", "Cover Letter Generator", "Multiple Export Formats"],
    badge: "Career Tool",
  },
  {
    icon: <Rocket className="h-8 w-8" />,
    color: "rose",
    title: "Global Hackathon Directory",
    description: "Stay ahead with our curated, real-time directory of national and international hackathons, coding contests, and ideathons worldwide.",
    features: ["Real-Time Global Listings", "Filter by Domain & Date", "Team Formation Hub", "Submission Guides"],
    badge: "Live",
  },
  {
    icon: <PenTool className="h-8 w-8" />,
    color: "cyan",
    title: "Custom Software Solutions",
    description: "Have a unique technical challenge? Upload your requirements and our team will architect and code the entire software solution from scratch.",
    features: ["Requirement Analysis", "Custom Architecture", "End-to-End Development", "Deployment Support"],
    badge: "Premium",
  },
];

const CATEGORIES = [
  { icon: <Cpu className="h-6 w-6" />, name: "Artificial Intelligence & ML", count: "120+ Solutions" },
  { icon: <Globe className="h-6 w-6" />, name: "Internet of Things (IoT)", count: "85+ Solutions" },
  { icon: <Database className="h-6 w-6" />, name: "Blockchain & Web3", count: "60+ Solutions" },
  { icon: <Cloud className="h-6 w-6" />, name: "Cloud Computing", count: "45+ Solutions" },
  { icon: <Bot className="h-6 w-6" />, name: "Deep Learning & NLP", count: "95+ Solutions" },
  { icon: <Layers className="h-6 w-6" />, name: "Full Stack Web & Mobile", count: "150+ Solutions" },
  { icon: <Lock className="h-6 w-6" />, name: "Cybersecurity", count: "40+ Solutions" },
  { icon: <BarChart3 className="h-6 w-6" />, name: "Data Science & Analytics", count: "75+ Solutions" },
];

const LOCATIONS = [
  "San Francisco", "London", "Dubai", "Singapore", "New York",
  "Bengaluru", "Berlin", "Toronto", "Sydney", "Paris",
];

const TESTIMONIALS = [
  {
    name: "James Carter",
    college: "University College London",
    branch: "Computer Science, 2024",
    text: "GraduateNex delivered a complete ML-based predictive system with a flawless research paper. The quality of the architecture and code was truly enterprise-grade.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    college: "VIT, Vellore",
    branch: "M.Tech AI, 2024",
    text: "The AI Writing Enhancer refined my entire thesis into natural, polished academic language. The tone was perfectly preserved and it reads beautifully now.",
    rating: 5,
  },
  {
    name: "Sarah Lin",
    college: "National University of Singapore",
    branch: "Information Systems, 2023",
    text: "Their ATS Resume Builder got me shortlisted at multiple top-tier tech firms. The job description matching feature is insanely accurate.",
    rating: 5,
  },
  {
    name: "Michael Davies",
    college: "University of Toronto",
    branch: "Software Engineering, 2024",
    text: "Ordered a custom Blockchain solution for my capstone. The team analysed the exact rubric and built a decentralized app from scratch. Incredible support.",
    rating: 5,
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  emerald: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  violet: "bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/20",
  orange: "bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20",
  rose: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  cyan: "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20",
};

const badgeColorMap: Record<string, string> = {
  "Most Popular": "bg-blue-600/90 backdrop-blur text-white shadow-lg shadow-blue-900/20 border border-blue-500/30",
  "High Demand": "bg-emerald-600/90 backdrop-blur text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/30",
  "Exclusive": "bg-violet-600/90 backdrop-blur text-white shadow-lg shadow-violet-900/20 border border-violet-500/30",
  "Career Tool": "bg-orange-600/90 backdrop-blur text-white shadow-lg shadow-orange-900/20 border border-orange-500/30",
  "Live": "bg-rose-600/90 backdrop-blur text-white shadow-lg shadow-rose-900/20 border border-rose-500/30",
  "Premium": "bg-cyan-600/90 backdrop-blur text-white shadow-lg shadow-cyan-900/20 border border-cyan-500/30",
};

export default function Home() {
  const { formatPrice, convertPrice, isIndia } = useCountry();
  
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
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuthRedirect />
      {/* ── HERO SECTION ── */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-center bg-zinc-950 overflow-hidden text-white">
        <Image src="/images/hero-bg-global.jpg" alt="Hero Background" fill priority className="object-cover object-center opacity-40 z-0" sizes="100vw" />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-[2px] z-0"></div>
        
        {/* Background gradient orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 py-10 md:py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs md:text-sm font-bold tracking-wide">
              <Globe className="h-4 w-4" /> {isIndia ? "India's #1 Academic Project Platform" : "World's Premier AI Career & Academic Platform"}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] md:leading-[1.05]">
              Accelerate Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400">
                Career & Academics
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto font-medium">
              The ultimate AI-powered ecosystem for students and professionals worldwide. Master your capstone projects, build ATS-beating resumes, and land top-tier jobs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all">
                  Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#services" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 text-lg font-bold rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-md">
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Countries Marquee inside Hero */}
            <div className="pt-10 w-full overflow-hidden max-w-5xl mx-auto opacity-80 hover:opacity-100 transition-opacity">
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4 text-center">Available & Trusted by Students in 50+ Countries</p>
              <div className="relative flex overflow-x-hidden group pb-4">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-4 group-hover:pause">
                  {/* Loop 3 times for continuous scroll effect */}
                  {[1, 2, 3].map((loop) => (
                    <div key={loop} className="flex items-center gap-4 px-2">
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-white shadow-sm">
                        <img src="https://flagcdn.com/w40/us.png" srcSet="https://flagcdn.com/w80/us.png 2x" alt="US" className="w-6 h-auto rounded-sm" /> US
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-white shadow-sm">
                        <img src="https://flagcdn.com/w40/in.png" srcSet="https://flagcdn.com/w80/in.png 2x" alt="India" className="w-6 h-auto rounded-sm" /> India
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-white shadow-sm">
                        <img src="https://flagcdn.com/w40/gb.png" srcSet="https://flagcdn.com/w80/gb.png 2x" alt="UK" className="w-6 h-auto rounded-sm" /> UK
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-white shadow-sm">
                        <img src="https://flagcdn.com/w40/ca.png" srcSet="https://flagcdn.com/w80/ca.png 2x" alt="Canada" className="w-6 h-auto rounded-sm" /> Canada
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-white shadow-sm">
                        <img src="https://flagcdn.com/w40/au.png" srcSet="https://flagcdn.com/w80/au.png 2x" alt="Australia" className="w-6 h-auto rounded-sm" /> Australia
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-white shadow-sm">
                        <img src="https://flagcdn.com/w40/ae.png" srcSet="https://flagcdn.com/w80/ae.png 2x" alt="UAE" className="w-6 h-auto rounded-sm" /> UAE
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-white shadow-sm">
                        <img src="https://flagcdn.com/w40/sg.png" srcSet="https://flagcdn.com/w80/sg.png 2x" alt="Singapore" className="w-6 h-auto rounded-sm" /> Singapore
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-white shadow-sm">
                        <img src="https://flagcdn.com/w40/de.png" srcSet="https://flagcdn.com/w80/de.png 2x" alt="Germany" className="w-6 h-auto rounded-sm" /> Germany
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* ── STATS TICKER ── */}
      <section className="bg-primary py-5 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {STATS.map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="text-3xl md:text-4xl font-black">{s.value}</p>
                <p className="text-sm font-medium text-primary-foreground/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="w-full py-12 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-20 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
              <Layers className="h-4 w-4" /> Our Complete Product Suite
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Everything You Need to<br /><span className="text-primary">Graduate with Excellence</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are not just a project shop. We are a full-stack academic success platform covering projects, documentation, AI tools, and career launch — all under one roof.
            </p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-8 max-w-7xl mx-auto pb-6 md:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {SERVICES.map((svc) => (
              <Link href="/login" key={svc.title} className="min-w-[85vw] snap-center md:min-w-0 group relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-2xl transition-all duration-500 rounded-3xl p-6 md:p-8 flex flex-col overflow-hidden">
                <div className="absolute top-5 right-5">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeColorMap[svc.badge]}`}>{svc.badge}</span>
                </div>
                <div className={`w-16 h-16 rounded-2xl ${colorMap[svc.color]} flex items-center justify-center mb-6`}>
                  {svc.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{svc.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">{svc.description}</p>
                <ul className="space-y-2 mb-6">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <div className="w-full gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Get Started <ChevronRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT CATEGORIES ── */}
      <section className="w-full py-12 md:py-24 bg-muted/30 border-y">
        <div className="container mx-auto pl-4 pr-0 md:px-6">
          <div className="text-center mb-10 md:mb-16 space-y-4 pr-4 md:pr-0">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Explore by Domain</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our deep catalogue of ready-made projects across every major engineering and management domain.
            </p>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid sm:grid-cols-2 lg:grid-cols-4 md:gap-5 max-w-6xl mx-auto pb-6 pr-4 md:pr-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {CATEGORIES.map((cat) => (
              <Link href="/login" key={cat.name} className="min-w-[75vw] snap-center md:min-w-0">
                <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 md:p-6 hover:border-primary/40 hover:bg-white dark:hover:bg-zinc-900 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer flex items-center md:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-bold leading-tight">{cat.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{cat.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-full py-12 md:py-28 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-20 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              From Order to Delivery in <span className="text-primary">3 Simple Steps</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We have streamlined the entire process so you can focus on what matters — your viva and your career.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { step: "01", icon: <BookOpen className="h-10 w-10" />, title: "Browse & Select", desc: "Explore our marketplace. Filter by domain, tech stack, or college level. Every listing includes detailed specs, images, and a demo video." },
              { step: "02", icon: <Briefcase className="h-10 w-10" />, title: "Place Your Order", desc: "Add to cart, complete checkout, and share your specific college requirements via our custom request form. Upload your professor's base paper if needed." },
              { step: "03", icon: <TrendingUp className="h-10 w-10" />, title: "Receive & Deploy", desc: "Get your complete project package — source code, SRS, IEEE paper, PPT — with a step-by-step deployment guide. Our team is on call for viva prep." },
            ].map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center space-y-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-sm font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPARENT PRICING ── */}
      <section className="w-full py-12 md:py-24 bg-zinc-50 border-y dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Transparent & Upfront <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              No hidden fees. No "Contact us for price". Get immediate access to what you need.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "ATS Resume Builder", price: formatPrice(convertPrice(199)), desc: "AI-generated ATS-friendly resume." },
              { name: "JD Match Analyzer", price: formatPrice(convertPrice(299)), desc: "Match your resume to specific job roles." },
              { name: "Project Documentation", price: formatPrice(convertPrice(149)), desc: "Instant IEEE/SRS documentation templates." },
              { name: "Final Year Projects", price: `From ${formatPrice(convertPrice(6000))}`, desc: "Complete source code, setup, and support." },
            ].map((plan) => (
              <Link href="/services" key={plan.name} className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between text-center hover:border-primary/50 transition-colors shadow-sm hover:shadow-xl">
                <div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6 h-10">{plan.desc}</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-6">{plan.price}</div>
                  <div className="w-full gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-primary hover:text-white h-12 px-4 py-2">
                    View Details
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="w-full py-12 md:py-24 bg-zinc-950 text-white">
        <div className="container mx-auto pl-4 pr-0 md:px-6">
          <div className="text-center mb-10 md:mb-16 space-y-4 pr-4 md:pr-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs md:text-sm font-bold">
              <Star className="h-4 w-4 fill-primary" /> Trusted by Users Worldwide
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Real Results from Global Users</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Professionals and students across the globe use GraduateNex to master their academics and land top-tier tech jobs.
            </p>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 md:grid md:grid-cols-2 max-w-6xl mx-auto pb-6 pr-4 md:pr-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="min-w-[85vw] snap-center md:min-w-0 bg-white/5 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-2xl hover:border-primary/30 rounded-3xl p-6 md:p-8 space-y-4 transition-all duration-500">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 leading-relaxed text-lg">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm text-zinc-500">{t.branch} · {t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATIONS / GLOBAL REACH ── */}
      <section className="w-full py-12 md:py-24 bg-background border-y overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-10 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold">
              <Globe className="h-4 w-4" /> Global Reach
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Empowering Students in <span className="text-primary">50+ Countries</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isIndia 
                ? "From Tier-1 metros in India to global tech hubs, our digital-first platform provides premium career and academic support worldwide."
                : "Whether you are in North America, Europe, or Asia, our digital-first AI platform delivers premium career and academic tools worldwide."}
            </p>
          </div>
          
          {/* Countries Marquee - Row 1 */}
          <div className="relative flex overflow-x-hidden group pb-4">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-4 group-hover:pause">
              {/* Loop 3 times for continuous scroll effect */}
              {[1, 2, 3].map((loop) => (
                <div key={loop} className="flex items-center gap-4 px-2">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇺🇸</span> United States
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇮🇳</span> India
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇬🇧</span> United Kingdom
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇨🇦</span> Canada
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇦🇺</span> Australia
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇦🇪</span> UAE
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇸🇬</span> Singapore
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇩🇪</span> Germany
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇫🇷</span> France
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm text-base font-bold">
                    <span className="text-xl">🇸🇦</span> Saudi Arabia
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-muted-foreground mt-8 text-base">
            Delivering <strong>100% digitally</strong> — instant access to AI tools, resumes, and resources. No geographic barriers.
          </p>
        </div>
        
        {/* Gradient fades for marquee */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-20"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-20"></div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="w-full py-12 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white dark:bg-zinc-900 p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] border shadow-2xl">
            <div className="w-40 h-40 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-primary via-orange-400 to-yellow-300 p-1.5 flex-shrink-0 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-white dark:border-zinc-900">
                <Image src="/founder_nithin.jpg" alt="Appala Nithin" fill className="object-cover object-top" />
              </div>
            </div>
            <div className="text-center md:text-left space-y-4 md:space-y-5">
              <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold uppercase tracking-widest">
                Founder & CEO
              </div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight">Appala Nithin</h3>
              <div className="space-y-3 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Appala Nithin</strong> is the visionary founder behind <strong className="text-primary">GraduateNex</strong> — a platform built from the ground up to solve the real academic struggles that millions of Indian students face every year.
                </p>
                <p>
                  Having seen firsthand how talented students were failing not because of intelligence, but because of a broken system of plagiarism-check barriers, outdated project repositories, and zero career support, Nithin built GraduateNex to be the definitive solution — combining a production-quality project marketplace, AI-powered document tools, and an intelligent career launch engine.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1.5 rounded-full border"><GraduationCap className="h-4 w-4 text-primary" /> EdTech Visionary</span>
                <span className="flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1.5 rounded-full border"><Award className="h-4 w-4 text-primary" /> 2,500+ Students Helped</span>
                <span className="flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1.5 rounded-full border"><Users className="h-4 w-4 text-primary" /> 50+ Cities Served</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground">Quick answers to common queries about our services.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { q: "What is GraduateNex?", a: "GraduateNex is an academic success platform providing production-ready final year project source code, AI-powered resume tools, documentation generators, and research paper assistance for students across India." },
              { q: "Are the projects plagiarism-free?", a: "Yes. Every project and document we deliver is crafted to be original. We use internal plagiarism screening tools to ensure the content meets academic integrity standards." },
              { q: "How are digital products delivered?", a: "All digital products are delivered instantly after payment via secure download links on the order confirmation page and through your registered email address." },
              { q: "What payment methods do you accept?", a: "We accept UPI, Debit/Credit Cards, Net Banking, and Wallets through Razorpay — a PCI-DSS compliant, bank-grade secure payment gateway." },
              { q: "Can I get a refund?", a: "Digital products are generally non-refundable once delivered. However, refunds are issued for technical payment failures, undelivered products, and custom projects that don't meet agreed specifications. See our Refund Policy for full details." },
              { q: "Do you offer support after purchase?", a: "Absolutely. We provide post-purchase technical support for setup, deployment, and viva preparation. Our team is available Monday–Friday, 9AM–6PM IST." },
            ].map((faq) => (
              <div key={faq.q} className="bg-muted/30 border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ── */}
      <section className="w-full py-10 md:py-16 bg-zinc-950 border-y border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-start md:items-center gap-6 md:gap-16 max-w-xl mx-auto md:max-w-none pl-6 md:pl-0">
            <div className="flex items-center gap-4 md:gap-3 text-zinc-400">
              <Shield className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-white">Secure Payments</p>
                <p className="text-xs text-zinc-500">256-bit SSL Encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <CreditCard className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm font-bold text-white">Powered by Razorpay</p>
                <p className="text-xs text-zinc-500">PCI-DSS Compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-bold text-white">2,500+ Orders</p>
                <p className="text-xs text-zinc-500">Delivered Successfully</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Phone className="h-8 w-8 text-violet-400" />
              <div>
                <p className="text-sm font-bold text-white">Dedicated Support</p>
                <p className="text-xs text-zinc-500">Mon–Fri, 9AM–6PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary via-orange-500 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10 space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white">
            Your Final Year Project is<br className="hidden md:block"/> One Click Away.
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Join 2,500+ students who have already secured top grades, submitted original documentation, and advanced their careers using GraduateNex.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="h-16 px-12 text-xl font-black rounded-xl bg-white text-primary hover:bg-zinc-50 shadow-2xl hover:scale-105 transition-all">
                Get Started — It&apos;s Free <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <a href="tel:+917981994870">
              <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-xl bg-white/20 border-2 border-white text-white hover:bg-white/30 transition-all">
                <Phone className="mr-2 h-5 w-5" /> Call Us Now
              </Button>
            </a>
          </div>
          <p className="text-white/60 text-sm">
            📞 +91 79819 94870 &nbsp;|&nbsp; ✉️ support@graduatenex.online &nbsp;|&nbsp; 📍 T Hub, Hitech City, Hyderabad
          </p>
        </div>
      </section>

      {/* FAQPage Schema for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is GraduateNex?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'GraduateNex is an academic success platform providing production-ready final year project source code, AI-powered resume tools, documentation generators, and research paper assistance for students across India.'
                }
              },
              {
                '@type': 'Question',
                name: 'Are the projects plagiarism-free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Every project and document we deliver is crafted to be original. We use internal plagiarism screening tools to ensure the content meets academic integrity standards.'
                }
              },
              {
                '@type': 'Question',
                name: 'How are digital products delivered?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'All digital products are delivered instantly after payment via secure download links on the order confirmation page and through your registered email address.'
                }
              },
              {
                '@type': 'Question',
                name: 'What payment methods do you accept?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We accept UPI, Debit/Credit Cards, Net Banking, and Wallets through Razorpay — a PCI-DSS compliant, bank-grade secure payment gateway.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I get a refund?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Digital products are generally non-refundable once delivered. However, refunds are issued for technical payment failures, undelivered products, and custom projects that don't meet agreed specifications."
                }
              },
              {
                '@type': 'Question',
                name: 'Do you offer support after purchase?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Absolutely. We provide post-purchase technical support for setup, deployment, and viva preparation. Our team is available Monday–Friday, 9AM–6PM IST.'
                }
              }
            ]
          })
        }}
      />

    </div>
  );
}
