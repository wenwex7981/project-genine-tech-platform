"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Star, CheckCircle, Code2, FileText, Brain, ShieldCheck,
  Rocket, PenTool, Cpu, Globe, Database, Cloud, Bot, Layers, Lock, BarChart3,
  Phone, MapPin, Award, TrendingUp, Users
} from "lucide-react";
import AuthRedirect from "@/components/AuthRedirect";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { name: "Sai Kiran Reddy", college: "JNTUH, Hyderabad", grade: "98/100",
    text: "Ordered a crop prediction system 2 months before submission. My guide was genuinely impressed. This service is absolutely essential." },
  { name: "Priya Sharma", college: "VIT, Vellore", grade: "A Grade",
    text: "The AI Writing Enhancer refined my 40-page thesis into something I was genuinely proud to submit. The tone was perfect — no AI smell at all." },
  { name: "Rahul Nair", college: "Anna University", grade: "4 MNC Offers",
    text: "Their ATS Resume Builder got me shortlisted at Infosys, TCS, Wipro, and Cognizant. The JD matching is frighteningly accurate." },
  { name: "Ananya Gupta", college: "Amity University", grade: "First Class",
    text: "They built a decentralized voting system from scratch based on my professor's paper. Source code, documentation, everything. Got an A." },
  { name: "Vikram Singh", college: "SRM Institute", grade: "Conference Accepted",
    text: "The Zero Plagiarism IEEE paper was accepted in a major conference. I couldn't believe the quality. Will come back every semester." },
  { name: "Megha Jain", college: "Delhi University", grade: "9.2 CGPA",
    text: "Saved me months of sleepless nights. The viva prep guide alone was worth the price. I knew every answer my examiner asked." },
];

const SERVICES = [
  {
    id: "projects",
    tag: "Most Popular",
    title: "Final Year Projects",
    headline: "Deployable. Documented. Defended.",
    body: "End-to-end project delivery for B.Tech, M.Tech, BCA & MCA students. Source code, SRS, IEEE base paper, PPT, and viva preparation — delivered together.",
    metrics: ["500+ projects", "AI / ML / IoT / Web3", "0% Plagiarism"],
    href: "/projects",
    accent: "#2563EB",
    bg: "#EFF6FF",
    Icon: Code2,
    large: true,
  },
  {
    id: "resume",
    tag: "Career",
    title: "ATS Resume Builder",
    headline: "Built to beat the bots.",
    body: "17-point ATS scoring rubric. JD match analysis. Keyword gap reports. Your resume, optimised for the role you want.",
    metrics: ["₹99 flat", "Instant download", "4 MNC offers avg."],
    href: "/resume",
    accent: "#D97706",
    bg: "#FFFBEB",
    Icon: FileText,
    large: false,
  },
  {
    id: "humanizer",
    tag: "Exclusive",
    title: "AI Humanizer",
    headline: "Sounds like you wrote it.",
    body: "Refine AI-generated academic text into natural, plagiarism-free writing. No detectable AI tone, no generic phrasing.",
    metrics: ["Academic tone", "0% AI detection", "Any discipline"],
    href: "/ai-services",
    accent: "#7C3AED",
    bg: "#F5F3FF",
    Icon: Brain,
    large: false,
  },
  {
    id: "docs",
    tag: "High Demand",
    title: "IEEE Research Papers",
    headline: "Conference-ready writing.",
    body: "Expertly crafted IEEE research papers and SRS documents. Verified originality, proper citations, correct format — ready to submit.",
    metrics: ["IEEE format", "Originality verified", "Multiple domains"],
    href: "/projects/research-paper",
    accent: "#059669",
    bg: "#ECFDF5",
    Icon: ShieldCheck,
    large: false,
  },
  {
    id: "hackathons",
    tag: "Live",
    title: "Hackathon Directory",
    headline: "Never miss an opportunity.",
    body: "Real-time listings of national and international coding contests, ideathons, and smart India hackathons — filtered for your skill level.",
    metrics: ["Updated daily", "Team formation", "National & global"],
    href: "/hackathons",
    accent: "#DC2626",
    bg: "#FEF2F2",
    Icon: Rocket,
    large: false,
  },
  {
    id: "custom",
    tag: "Premium",
    title: "Custom Development",
    headline: "Your paper. Our code.",
    body: "Have a specific base paper or unique idea? We architect and build it from scratch with full documentation and deployment walkthrough.",
    metrics: ["From ₹6,000", "End-to-end delivery", "Viva prep included"],
    href: "/custom-requirements",
    accent: "#0891B2",
    bg: "#ECFEFF",
    Icon: PenTool,
    large: true,
  },
];

const DOMAINS = [
  { Icon: Cpu, name: "AI & Machine Learning", count: "120+" },
  { Icon: Globe, name: "Internet of Things", count: "85+" },
  { Icon: Database, name: "Blockchain & Web3", count: "60+" },
  { Icon: Cloud, name: "Cloud Computing", count: "45+" },
  { Icon: Bot, name: "Deep Learning & NLP", count: "95+" },
  { Icon: Layers, name: "Full Stack Web & Mobile", count: "150+" },
  { Icon: Lock, name: "Cybersecurity", count: "40+" },
  { Icon: BarChart3, name: "Data Science", count: "75+" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "url": "https://www.graduatenex.online/", "name": "GraduateNex",
        "potentialAction": { "@type": "SearchAction", "target": "https://www.graduatenex.online/projects?q={search_term_string}", "query-input": "required name=search_term_string" }
      },
      { "@type": "Organization", "name": "GraduateNex", "url": "https://www.graduatenex.online/", "logo": "https://www.graduatenex.online/logo.png" }
    ]
  };

  return (
    <div className="bg-white text-stone-900 overflow-x-hidden" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthRedirect />

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#FAFAF8]">
        {/* Very subtle warm texture — not pattern, just a gradient wash */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-50/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-orange-50/40 via-transparent to-transparent" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-10"
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500">
                <span className="w-8 h-px bg-stone-400 inline-block" />
                India's Academic Career Platform
              </span>
            </motion.div>

            {/* Headline — editorial, left-aligned, human weight */}
            <div className="max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[1.0] tracking-[-0.03em] text-stone-900"
              >
                Graduate with<br />
                <span className="text-[clamp(2.8rem,7vw,5.5rem)] font-black" style={{ color: "#2563EB" }}>confidence.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-8 text-lg md:text-xl text-stone-500 leading-[1.7] max-w-xl font-normal"
              >
                Final year projects, ATS resumes, research papers, and interview prep — built by engineers, for students who want to actually succeed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link href="/login" id="hero-cta-primary">
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "#2563EB", boxShadow: "0 4px 20px rgba(37,99,235,0.30)" }}>
                    Get started free <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link href="#services" id="hero-cta-secondary">
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-stone-700 text-sm font-semibold border border-stone-200 bg-white hover:bg-stone-50 transition-all">
                    See what we build
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Social proof strip — horizontal, editorial */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-20 pt-10 border-t border-stone-200 flex flex-wrap items-center gap-x-12 gap-y-6"
            >
              {[
                { n: "2,500+", l: "Projects delivered" },
                { n: "98%", l: "Student satisfaction" },
                { n: "50+", l: "Cities across India" },
                { n: "0%", l: "Average plagiarism" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-stone-900 tracking-tight">{s.n}</div>
                  <div className="text-xs text-stone-400 font-medium mt-0.5">{s.l}</div>
                </div>
              ))}
              <div className="ml-auto flex items-center gap-2 text-sm text-stone-400 font-medium">
                <MapPin className="w-4 h-4" /> Hyderabad, India
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────── SERVICES ─────────────────────── */}
      <section id="services" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Section label */}
          <RevealBlock>
            <div className="flex items-center gap-4 mb-16">
              <span className="text-xs font-semibold tracking-widest uppercase text-stone-400">What we do</span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>
          </RevealBlock>

          {/* Asymmetric service grid — NOT uniform cards */}
          <div className="space-y-6">

            {/* Row 1: large left + two right */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <ServiceCard svc={SERVICES[0]} className="lg:col-span-3" />
              <ServiceCard svc={SERVICES[1]} className="lg:col-span-2" />
            </div>

            {/* Row 2: three equal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceCard svc={SERVICES[2]} className="" />
              <ServiceCard svc={SERVICES[3]} className="" />
              <ServiceCard svc={SERVICES[4]} className="" />
            </div>

            {/* Row 3: full-width custom */}
            <ServiceCard svc={SERVICES[5]} className="w-full" wide />
          </div>
        </div>
      </section>

      {/* ─────────────────────────── DOMAINS ──────────────────────── */}
      <section className="py-24 bg-[#FAFAF8] border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealBlock>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">Domains</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900">Browse by Technology</h2>
              </div>
              <Link href="/projects" className="text-sm font-semibold text-blue-600 hover:underline underline-offset-4">
                View full catalogue →
              </Link>
            </div>
          </RevealBlock>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DOMAINS.map((d, i) => (
              <RevealBlock key={i} delay={i * 0.05}>
                <Link href="/login" id={`domain-${d.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="group p-5 rounded-2xl border border-stone-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                    <d.Icon className="w-5 h-5 text-stone-400 group-hover:text-blue-500 transition-colors mb-4" />
                    <p className="font-semibold text-stone-900 text-sm leading-tight mb-1">{d.name}</p>
                    <p className="text-xs text-stone-400">{d.count} projects</p>
                  </div>
                </Link>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── HOW IT WORKS ─────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealBlock>
            <div className="mb-20">
              <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">Process</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-900 max-w-lg">
                Order to delivery in three steps.
              </h2>
            </div>
          </RevealBlock>

          {/* Horizontal editorial steps */}
          <div className="grid md:grid-cols-3 gap-0 relative">
            {[
              {
                n: "01",
                title: "Browse & select",
                body: "Explore 500+ ready-made projects. Filter by domain, tech stack, and budget. View complete spec sheets before you commit.",
              },
              {
                n: "02",
                title: "Checkout & brief us",
                body: "Place your order and share your professor's base paper, rubric, or any specific requirements. We read everything.",
              },
              {
                n: "03",
                title: "Receive your package",
                body: "Source code, SRS document, IEEE paper, PPT, and a viva preparation guide — delivered on time, every time.",
              },
            ].map((step, i) => (
              <RevealBlock key={i} delay={i * 0.12}>
                <div className={`relative p-8 md:p-10 ${i < 2 ? "md:border-r border-stone-100" : ""}`}>
                  <span className="block text-[5rem] font-black leading-none text-stone-100 mb-6 select-none">{step.n}</span>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{step.body}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── PRICING ──────────────────────── */}
      <section className="py-28 bg-[#FAFAF8] border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealBlock>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">Pricing</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900">No hidden fees. Ever.</h2>
                <p className="text-stone-500 mt-2 text-sm">You see the price. You pay the price. That's it.</p>
              </div>
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "ATS Resume Builder", price: "₹99", tag: "Career", desc: "Complete ATS optimisation with JD matching and keyword analysis.", href: "/resume" },
              { name: "JD Match Analyzer", price: "₹149", tag: "Career", desc: "Deep analysis of your resume against any job description.", href: "/resume" },
              { name: "Project Documentation", price: "₹299", tag: "Academic", desc: "IEEE paper, SRS document, and PPT — formatted and verified.", href: "/projects/documentation" },
              { name: "Final Year Projects", price: "From ₹6,000", tag: "Best Value", desc: "Source code, docs, base paper, and viva prep. Everything.", href: "/projects", featured: true },
            ].map((p, i) => (
              <RevealBlock key={i} delay={i * 0.08}>
                <Link href={p.href} id={`pricing-${p.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className={`group h-full flex flex-col p-6 rounded-2xl border transition-all cursor-pointer
                    ${p.featured
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-200 hover:border-stone-300 hover:shadow-md text-stone-900"}`}>
                    <div className="flex items-center justify-between mb-8">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full
                        ${p.featured ? "bg-white/10 text-white/70" : "bg-stone-100 text-stone-500"}`}>
                        {p.tag}
                      </span>
                      {p.featured && <Award className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <h3 className={`font-bold text-base mb-2 ${p.featured ? "text-white" : "text-stone-900"}`}>{p.name}</h3>
                    <p className={`text-xs leading-relaxed mb-8 flex-1 ${p.featured ? "text-stone-400" : "text-stone-400"}`}>{p.desc}</p>
                    <div>
                      <div className={`text-3xl font-black tracking-tight mb-4 ${p.featured ? "text-white" : "text-stone-900"}`}>{p.price}</div>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all
                        ${p.featured ? "text-blue-400" : "text-blue-600"}`}>
                        Get started <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── TESTIMONIALS ─────────────────── */}
      <section className="py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealBlock>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">Students</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900">
                  2,500+ students<br />can't be wrong.
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                <span className="ml-2 text-sm font-semibold text-stone-500">4.9 / 5.0</span>
              </div>
            </div>
          </RevealBlock>

          {/* Two-row masonry feel — staggered grid, not uniform */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {TESTIMONIALS.map((t, i) => (
              <RevealBlock key={i} delay={i * 0.06}>
                <div className="break-inside-avoid p-6 rounded-2xl border border-stone-100 bg-[#FAFAF8] hover:border-stone-200 transition-all mb-5">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                      {t.grade}
                    </span>
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed mb-6 font-normal">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-bold">
                      {t.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">{t.name}</p>
                      <p className="text-[10px] text-stone-400">{t.college}</p>
                    </div>
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── FOUNDER ──────────────────────── */}
      <section className="py-24 bg-[#FAFAF8] border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealBlock>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-8">From the Founder</p>
              <blockquote className="text-2xl md:text-3xl font-semibold text-stone-900 leading-[1.4] mb-10">
                "I built GraduateNex because I saw brilliant students failing — not due to a lack of intelligence, but because of a broken system. We give you the tools, the code, and the documents so you can focus on building your career, not fighting red tape."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <p className="font-bold text-stone-900">Appala Nithin</p>
                  <p className="text-sm text-stone-400">Founder & CEO, GraduateNex</p>
                </div>
                <div className="ml-8 flex items-center gap-6 text-xs text-stone-400">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 2,500+ Helped</span>
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> 50+ Cities</span>
                </div>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ─────────────────────────── FINAL CTA ────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealBlock>
            <div className="rounded-3xl p-10 md:p-16 border border-stone-200 bg-[#FAFAF8] flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-4">Get started</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 max-w-sm">
                  Ready to graduate with a distinction?
                </h2>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-stone-500">
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Zero plagiarism</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Expert support</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> On-time delivery</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/login" id="footer-cta-primary">
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: "#2563EB", boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}>
                    Start free <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <a href="tel:+917981994870" id="footer-cta-call">
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-stone-700 text-sm font-semibold border border-stone-200 bg-white hover:bg-stone-50 transition-all">
                    <Phone className="w-4 h-4" /> Call us
                  </span>
                </a>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

function ServiceCard({ svc, className = "", wide = false }: { svc: typeof SERVICES[0]; className?: string; wide?: boolean }) {
  return (
    <RevealBlock>
      <Link href={svc.href} id={`service-${svc.id}`} className={className}>
        <div
          className={`group relative overflow-hidden rounded-2xl border border-stone-100 hover:shadow-lg transition-all cursor-pointer h-full
            ${wide ? "flex flex-col md:flex-row items-start gap-8 p-8 md:p-10" : "flex flex-col p-7"}`}
          style={{ background: svc.bg }}
        >
          {/* Icon */}
          <div
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mb-6 md:mb-0"
            style={{ background: `${svc.accent}15` }}
          >
            <svc.Icon className="w-5 h-5" style={{ color: svc.accent }} />
          </div>

          <div className="flex-1">
            {/* Tag */}
            <span className="text-[10px] font-bold tracking-widest uppercase mb-3 block" style={{ color: svc.accent }}>
              {svc.tag}
            </span>

            <h3 className="text-xl font-black text-stone-900 mb-1 tracking-tight">{svc.title}</h3>
            <p className="text-sm font-semibold text-stone-600 mb-3">{svc.headline}</p>
            <p className="text-sm text-stone-500 leading-relaxed mb-6">{svc.body}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {svc.metrics.map((m) => (
                <span key={m} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/70 border border-stone-100 text-stone-600">
                  {m}
                </span>
              ))}
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold group-hover:gap-2.5 transition-all" style={{ color: svc.accent }}>
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </RevealBlock>
  );
}
