"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Star, CheckCircle, Code2, FileText, Brain, ShieldCheck, Rocket, PenTool, Phone } from "lucide-react";
import AuthRedirect from "@/components/AuthRedirect";

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Sai Kiran Reddy",   college: "JNTUH, Hyderabad",  grade: "98/100",            text: "Got 98/100 from my guide. My professor asked if I had a research background. I don't. GraduateNex built the entire ML pipeline." },
  { name: "Priya Sharma",      college: "VIT, Vellore",      grade: "First Class",        text: "The AI Humanizer turned my thesis into something I was actually proud of. No AI smell whatsoever. My guide complimented the writing." },
  { name: "Rahul Nair",        college: "Anna University",   grade: "4 Offers",           text: "Shortlisted at Infosys, TCS, Wipro, and Cognizant in one week. The JD matching in their ATS tool is frightening accurate." },
  { name: "Ananya Gupta",      college: "Amity University",  grade: "A Grade",            text: "They built a decentralised voting system from my professor's base paper. Source code, SRS, PPT. Delivered in 5 days. Got an A." },
  { name: "Vikram Singh",      college: "SRM Institute",     grade: "Conference Paper",   text: "My IEEE paper was accepted in a major national conference. Zero plagiarism. Properly formatted citations. I've referred 6 friends already." },
  { name: "Megha Jain",        college: "Delhi University",  grade: "9.2 CGPA",           text: "The viva prep guide alone was worth three times the price. I knew every answer my examiner could have possibly asked." },
  { name: "Harshit Kumar",     college: "NIT Warangal",      grade: "Distinction",        text: "Absolutely professional. Delivered exactly what was promised — documented, commented code with a full deployment guide." },
  { name: "Divya Reddy",       college: "Osmania University", grade: "Top of Batch",     text: "I was panicking 3 weeks before submission. GraduateNex delivered a complete project in 10 days. I presented with confidence." },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Code2,       title: "Final Year Projects",   price: "From ₹6,000",  tag: "Most Popular",   href: "/projects",            body: "Complete, deployment-ready projects for B.Tech, M.Tech, BCA & MCA. Includes full source code, SRS document, IEEE base paper, PPT and viva prep. AI/ML, IoT, Blockchain, Web3." },
  { icon: FileText,    title: "ATS Resume Builder",    price: "₹99",          tag: "Career",         href: "/resume",              body: "17-point ATS scoring rubric. Keyword gap analysis. JD match report. Your resume tuned for the specific role you want, not just a generic document." },
  { icon: Brain,       title: "AI Humanizer",          price: "₹149",         tag: "Exclusive",      href: "/ai-services",         body: "Transform AI-generated academic text into natural, plagiarism-free writing that passes every detector. Retains your argument, changes everything else." },
  { icon: ShieldCheck, title: "IEEE Research Papers",  price: "₹499+",        tag: "High Demand",    href: "/projects/research-paper", body: "Conference-ready research papers written from your base paper or topic. Verified originality, correct IEEE format, complete bibliography." },
  { icon: Rocket,      title: "Hackathon Directory",   price: "Free",         tag: "Live",           href: "/hackathons",          body: "Real-time listings of national and global hackathons, ideathons, and Smart India competitions. Updated daily. Filter by domain." },
  { icon: PenTool,     title: "Custom Projects",       price: "₹6,000+",      tag: "Premium",        href: "/custom-requirements", body: "Your professor's paper. Your rubric. Our architects. We design and build the entire project from scratch with full delivery and support." },
];

// ─── STATS ────────────────────────────────────────────────────────────────────
const STATS = [
  { n: "2,500+", label: "Projects delivered" },
  { n: "98%",   label: "Student satisfaction" },
  { n: "50+",   label: "Cities across India" },
  { n: "0%",    label: "Average plagiarism" },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Home() {
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
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#fff", color: "#0a0a0a", fontFamily: "'Inter', var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthRedirect />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#fff", minHeight: "100vh" }}>

        {/* Stripe-style animated mesh background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `
              radial-gradient(at 20% 15%, rgba(99,91,255,0.10) 0px, transparent 55%),
              radial-gradient(at 85% 5%,  rgba(0,169,224,0.08) 0px, transparent 50%),
              radial-gradient(at 0%  70%, rgba(255,143,107,0.08) 0px, transparent 55%),
              radial-gradient(at 95% 85%, rgba(99,91,255,0.07) 0px, transparent 50%)
            `
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-24">
          <div className="max-w-5xl">

            {/* Live ticker — Stripe style */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-12"
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#425466", letterSpacing: "0.02em" }}>
                2,500+ students. 50+ cities. India's academic career platform.
              </span>
            </motion.div>

            {/* ── THE HEADLINE — Stripe uses bold italic serif for impact ── */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
              style={{
                fontSize: "clamp(2.8rem, 7.5vw, 6rem)",
                fontWeight: 900,
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: "#0a0a0a",
                marginBottom: "2rem",
              }}
            >
              Graduate with<br />
              <span style={{
                background: "linear-gradient(135deg, #635bff 0%, #0aa5e1 50%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                a distinction.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
              style={{ fontSize: 19, lineHeight: 1.65, color: "#425466", maxWidth: 520, marginBottom: "2.5rem", fontWeight: 400 }}
            >
              Final year projects, ATS-tuned resumes, research papers, and interview prep — built by engineers, for students who refuse to settle.
            </motion.p>

            {/* CTAs — Stripe-style: primary filled + ghost */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap items-center gap-3 mb-16"
            >
              <Link href="/login" id="hero-cta-start">
                <span
                  className="arrow-link inline-flex items-center gap-2 font-semibold"
                  style={{
                    padding: "14px 28px", borderRadius: 10,
                    background: "#635bff", color: "#fff", fontSize: 15,
                    boxShadow: "0 4px 24px rgba(99,91,255,0.30)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#5a52e8"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 30px rgba(99,91,255,0.40)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#635bff"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(99,91,255,0.30)"; }}
                >
                  Get started free <ArrowRight className="arrow-icon" size={16} />
                </span>
              </Link>
              <Link href="#services" id="hero-cta-services">
                <span
                  className="inline-flex items-center gap-2 font-semibold"
                  style={{
                    padding: "14px 28px", borderRadius: 10,
                    background: "#fff", color: "#425466", fontSize: 15,
                    border: "1.5px solid #e6ebf1",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c7d0dd"; (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e6ebf1"; (e.currentTarget as HTMLElement).style.color = "#425466"; }}
                >
                  See our services
                </span>
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-5"
            >
              {[
                "✓ Zero plagiarism guarantee",
                "✓ On-time delivery, always",
                "✓ 24/7 expert support",
                "✓ 50+ cities across India",
              ].map(t => (
                <span key={t} style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{t}</span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stripe-style bottom divider */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #e6ebf1 20%, #e6ebf1 80%, transparent)" }} />
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e6ebf1" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ textAlign: "center" }}
              >
                <div style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section id="services" style={{ background: "#f6f9fc", padding: "96px 0" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">

          {/* Section header */}
          <Reveal>
            <div style={{ marginBottom: 64 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#635bff", marginBottom: 12 }}>
                What we do
              </p>
              <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1.15, maxWidth: 560 }}>
                Everything a student needs to graduate with confidence.
              </h2>
            </div>
          </Reveal>

          {/* Service grid — intentional asymmetry */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <Link href={svc.href} id={`service-${svc.title.toLowerCase().replace(/\s+/g, '-')}`} className="block h-full">
                  <div
                    className="group h-full"
                    style={{
                      background: "#fff",
                      border: "1.5px solid #e6ebf1",
                      borderRadius: 16,
                      padding: "32px",
                      transition: "all 0.25s ease",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "#635bff";
                      el.style.boxShadow = "0 12px 40px rgba(99,91,255,0.12)";
                      el.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "#e6ebf1";
                      el.style.boxShadow = "none";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Subtle top accent line on hover */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #635bff, #0aa5e1)", opacity: 0, transition: "opacity 0.25s ease" }}
                      className="group-hover:opacity-100" />

                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: "linear-gradient(135deg, #f0eeff 0%, #e8f4ff 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svc.icon size={20} style={{ color: "#635bff" }} />
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", color: "#635bff",
                        background: "#f0eeff", padding: "4px 10px", borderRadius: 20,
                      }}>
                        {svc.tag}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0a0a0a", marginBottom: 8, letterSpacing: "-0.01em" }}>{svc.title}</h3>
                    <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>{svc.body}</p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.02em" }}>{svc.price}</span>
                      <span className="arrow-link" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#635bff" }}>
                        Learn more <ArrowRight className="arrow-icon" size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "96px 0", borderTop: "1px solid #e6ebf1" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">

          {/* Two-column: left = heading, right = steps */}
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#635bff", marginBottom: 12 }}>Process</p>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1.15, marginBottom: 20 }}>
                  Order to delivery in three steps.
                </h2>
                <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.65 }}>
                  We've built the fastest, most transparent academic delivery process in India. No back-and-forth, no surprises.
                </p>
                <Link href="/login" id="process-cta" className="inline-flex items-center gap-2 arrow-link" style={{ marginTop: 28, fontSize: 14, fontWeight: 600, color: "#635bff" }}>
                  Start your order <ArrowRight className="arrow-icon" size={14} />
                </Link>
              </div>
            </Reveal>

            <div className="space-y-0">
              {[
                { n: "01", title: "Browse & choose", body: "Explore 500+ projects by domain and tech stack. View full spec sheets and demo previews before you commit." },
                { n: "02", title: "Brief us on your needs", body: "Share your professor's base paper, rubric, or any specific university format. We read everything and follow it exactly." },
                { n: "03", title: "Receive your full package", body: "Source code, SRS, IEEE paper, PPT, and a viva prep guide — delivered on time, documented and ready to present." },
              ].map((step, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div style={{
                    display: "flex", gap: 24, padding: "28px 0",
                    borderBottom: i < 2 ? "1px solid #e6ebf1" : "none",
                  }}>
                    <div style={{
                      fontSize: 12, fontWeight: 800, color: "#635bff",
                      letterSpacing: "0.06em", minWidth: 28, paddingTop: 3,
                    }}>
                      {step.n}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a", marginBottom: 6 }}>{step.title}</h3>
                      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (AUTO-SCROLL) ────────────────────────────── */}
      <section style={{ background: "#f6f9fc", padding: "96px 0", borderTop: "1px solid #e6ebf1", overflow: "hidden" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-14">
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#635bff", marginBottom: 12 }}>Results</p>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1.15 }}>
                  2,500+ students.<br />Real results.
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a" }}>4.9</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>/ 5.0 average</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Infinite scroll marquee */}
        <div style={{ position: "relative" }}>
          {/* Fade edges */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(90deg, #f6f9fc, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(270deg, #f6f9fc, transparent)", zIndex: 2, pointerEvents: "none" }} />

          <div className="marquee-track" style={{ display: "flex", gap: 20, width: "max-content", paddingLeft: 24 }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} style={{
                width: 340,
                background: "#fff",
                border: "1.5px solid #e6ebf1",
                borderRadius: 16,
                padding: "28px",
                flexShrink: 0,
              }}>
                {/* Rating + grade */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                    background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0",
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    {t.grade}
                  </span>
                </div>

                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, marginBottom: 20 }}>"{t.text}"</p>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #635bff, #0aa5e1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                  }}>
                    {t.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0a0a0a" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.college}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "96px 0", borderTop: "1px solid #e6ebf1" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <Reveal>
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#635bff", marginBottom: 12 }}>Pricing</p>
              <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1.15, marginBottom: 12 }}>
                No hidden fees. No surprises.
              </h2>
              <p style={{ fontSize: 16, color: "#64748b" }}>The price you see is the price you pay. Always.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "ATS Resume Builder",   price: "₹99",        desc: "AI-powered ATS scoring, JD matching, keyword gap analysis.",     href: "/resume",                  accent: false },
              { name: "JD Match Analyzer",    price: "₹149",       desc: "Deep resume-to-job match report with actionable edits.",         href: "/resume",                  accent: false },
              { name: "Project Documentation",price: "₹299",       desc: "IEEE paper, SRS document, and PPT — verified and formatted.",    href: "/projects/documentation",  accent: false },
              { name: "Final Year Projects",  price: "From ₹6,000", desc: "Full project: code, docs, base paper, viva prep. Everything.",  href: "/projects",                accent: true  },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Link href={p.href} id={`pricing-${p.name.toLowerCase().replace(/\s+/g,'-')}`} className="block h-full">
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 16, padding: "28px",
                      border: p.accent ? "2px solid #635bff" : "1.5px solid #e6ebf1",
                      background: p.accent ? "#f7f6ff" : "#fff",
                      display: "flex", flexDirection: "column",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = p.accent ? "0 8px 32px rgba(99,91,255,0.2)" : "0 4px 20px rgba(0,0,0,0.06)"; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                  >
                    {p.accent && (
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#635bff", background: "#ebe8ff", padding: "4px 10px", borderRadius: 20, alignSelf: "flex-start", marginBottom: 16 }}>
                        Best Value
                      </span>
                    )}
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0a0a0a", marginBottom: 8 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 24, flex: 1 }}>{p.desc}</div>
                    <div style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.03em", marginBottom: 16 }}>{p.price}</div>
                    <span className="arrow-link" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#635bff" }}>
                      Get started <ArrowRight className="arrow-icon" size={13} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER STATEMENT ─────────────────────────────────────── */}
      <section style={{ background: "#f6f9fc", padding: "96px 0", borderTop: "1px solid #e6ebf1" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <Reveal>
            <div className="max-w-3xl">
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#635bff", marginBottom: 28 }}>
                From the founder
              </p>
              <blockquote style={{
                fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                fontWeight: 500, lineHeight: 1.55,
                color: "#0a0a0a", marginBottom: 32,
                fontStyle: "italic",
              }}>
                "I built GraduateNex because I watched brilliant students fail — not from lack of intelligence, but because of a broken system. We give you the tools, the code, and the documents. You focus on your career."
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, #635bff, #0aa5e1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 18,
                }}>
                  A
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0a0a0a" }}>Appala Nithin</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>Founder & CEO, GraduateNex</div>
                </div>
                <div style={{ marginLeft: 24, display: "flex", gap: 20 }}>
                  <div style={{ fontSize: 13, color: "#64748b" }}><span style={{ fontWeight: 700, color: "#0a0a0a" }}>2,500+</span> students helped</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}><span style={{ fontWeight: 700, color: "#0a0a0a" }}>50+</span> cities</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "96px 0", borderTop: "1px solid #e6ebf1" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <Reveal>
            <div style={{
              borderRadius: 24, padding: "60px 56px",
              border: "1.5px solid #e6ebf1",
              background: "linear-gradient(135deg, #fafcff 0%, #f8f6ff 50%, #fafcff 100%)",
              display: "flex", flexDirection: "column", gap: 32,
            }}
              className="md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1.2, marginBottom: 12 }}>
                  Ready to graduate with a distinction?
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
                  {["Zero plagiarism", "On-time delivery", "24/7 support"].map(t => (
                    <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                      <CheckCircle size={14} color="#22c55e" /> {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, flexShrink: 0 }}>
                <Link href="/login" id="footer-cta-primary">
                  <span
                    className="arrow-link inline-flex items-center gap-2 font-semibold"
                    style={{
                      padding: "14px 28px", borderRadius: 10,
                      background: "#635bff", color: "#fff", fontSize: 15,
                      boxShadow: "0 4px 24px rgba(99,91,255,0.28)",
                      transition: "all 0.2s ease", whiteSpace: "nowrap",
                    }}
                  >
                    Start free today <ArrowRight className="arrow-icon" size={15} />
                  </span>
                </Link>
                <a href="tel:+917981994870" id="footer-cta-call">
                  <span
                    className="inline-flex items-center gap-2 font-semibold"
                    style={{
                      padding: "14px 28px", borderRadius: 10,
                      background: "#fff", color: "#425466", fontSize: 15,
                      border: "1.5px solid #e6ebf1", whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Phone size={15} /> Call us
                  </span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ─── REVEAL ANIMATION WRAPPER ─────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "-40px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s` }}>
      {children}
    </div>
  );
}
