"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Star, CheckCircle, Phone, ArrowUpRight, ExternalLink } from "lucide-react";
import AuthRedirect from "@/components/AuthRedirect";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Sai Kiran Reddy",   college: "JNTUH, Hyderabad",   grade: "98/100",          text: "My professor asked if I had a research background. I don't — GraduateNex built the entire ML pipeline for me." },
  { name: "Priya Sharma",      college: "VIT, Vellore",        grade: "First Class",     text: "No AI smell whatsoever. My guide complimented the writing. The AI Humanizer is genuinely brilliant." },
  { name: "Rahul Nair",        college: "Anna University",     grade: "4 MNC Offers",    text: "Shortlisted at Infosys, TCS, Wipro, and Cognizant in one week. The JD matching is frighteningly accurate." },
  { name: "Ananya Gupta",      college: "Amity University",    grade: "A Grade",         text: "They built a decentralised voting system from my professor's base paper. Delivered in 5 days. Got an A." },
  { name: "Vikram Singh",      college: "SRM Institute",       grade: "Conference Paper",text: "My IEEE paper was accepted nationally. Zero plagiarism. Properly formatted. Referred 6 friends already." },
  { name: "Megha Jain",        college: "Delhi University",    grade: "9.2 CGPA",        text: "The viva prep guide alone was worth three times the price. I knew every answer my examiner asked." },
  { name: "Harshit Kumar",     college: "NIT Warangal",        grade: "Distinction",     text: "Absolutely professional. Documented, commented code with a full deployment guide. Nothing was missing." },
  { name: "Divya Reddy",       college: "Osmania University",  grade: "Top of Batch",    text: "3 weeks before submission and panicking. GraduateNex delivered a complete project in 10 days." },
];

const STATS = [
  { n: "2,500+", label: "Projects delivered" },
  { n: "98%",    label: "Student satisfaction" },
  { n: "50+",    label: "Cities across India" },
  { n: "0%",     label: "Average plagiarism" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "url": "https://www.graduatenex.online/", "name": "GraduateNex",
        "potentialAction": { "@type": "SearchAction", "target": "https://www.graduatenex.online/projects?q={search_term_string}", "query-input": "required name=search_term_string" }
      },
      { "@type": "Organization", "name": "GraduateNex", "url": "https://www.graduatenex.online/" }
    ]
  };

  return (
    <div style={{ background: "#fff", color: "#0a0a0a", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthRedirect />

      {/* ───────────────────── HERO ─────────────────────────── */}
      <section style={{ position: "relative", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        {/* Stripe-style animated mesh */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
          <div style={{
            position: "absolute", width: 800, height: 800, top: -200, right: -200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,91,255,0.06) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", width: 600, height: 600, bottom: -100, left: -150, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,143,107,0.06) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", width: 500, height: 500, top: "30%", left: "40%", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,169,224,0.04) 0%, transparent 70%)",
          }} />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", paddingTop: 140, paddingBottom: 80, position: "relative", zIndex: 1, width: "100%" }}>
          {/* Eyebrow */}
          <FadeIn delay={0}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b", letterSpacing: "0.01em" }}>
                Trusted by 2,500+ students across 50+ cities in India
              </span>
            </div>
          </FadeIn>

          {/* Main headline */}
          <FadeIn delay={0.08}>
            <h1 style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0,
              color: "#0a0a0a", marginBottom: 28, maxWidth: 700,
            }}>
              Graduate with<br />
              <span style={{ background: "linear-gradient(135deg, #635bff 0%, #00a9e0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                a distinction.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p style={{ fontSize: 20, color: "#64748b", maxWidth: 480, lineHeight: 1.65, marginBottom: 40, fontWeight: 400 }}>
              Final year projects, ATS resumes, IEEE papers, and viva prep — built by engineers, delivered on time.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.24}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/login" id="hero-primary-cta">
                <HoverButton
                  base={{ background: "#635bff", color: "#fff", boxShadow: "0 4px 24px rgba(99,91,255,0.32)" }}
                  hover={{ background: "#5a52e8", boxShadow: "0 6px 32px rgba(99,91,255,0.42)" }}
                  style={{ padding: "15px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  Start free today <ArrowRight size={16} />
                </HoverButton>
              </Link>
              <Link href="#products" id="hero-secondary-cta">
                <HoverButton
                  base={{ background: "#fff", color: "#425466", border: "1.5px solid #e6ebf1" }}
                  hover={{ borderColor: "#c7d0dd", color: "#0a0a0a" }}
                  style={{ padding: "15px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600 }}
                >
                  See what we build
                </HoverButton>
              </Link>
            </div>
          </FadeIn>

          {/* Stats row */}
          <FadeIn delay={0.4}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0 48px", marginTop: 72, paddingTop: 40, borderTop: "1px solid #f1f5f9" }}>
              {STATS.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───────────────────── PRODUCT SHOWCASE (Stripe-style) ─── */}
      <section id="products" style={{ background: "#f7f8fb", padding: "96px 0", borderTop: "1px solid #e6ebf1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>

          {/* Section header — Stripe style: bold then faded */}
          <Reveal>
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#635bff", marginBottom: 14 }}>Platform</p>
              <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2, maxWidth: 680 }}>
                <span style={{ color: "#0a0a0a" }}>Flexible tools for every student. </span>
                <span style={{ color: "#94a3b8" }}>From final year projects to career launch — built to work individually or together.</span>
              </h2>
            </div>
          </Reveal>

          {/* ROW 1: Large left + right */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)", gap: 16 }}>
            {/* PROJECT MARKETPLACE CARD */}
            <Reveal>
              <ProductCard
                tag="Most Popular"
                title="Final Year Project Marketplace"
                description="500+ deployable projects for B.Tech, M.Tech, BCA & MCA. Source code, SRS, IEEE paper, PPT and viva prep."
                href="/projects"
                accent="#635bff"
                bgGradient="linear-gradient(135deg, #f0eeff 0%, #e8f4ff 100%)"
              >
                {/* Browser chrome mockup */}
                <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e6ebf1", boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
                  {/* Browser bar */}
                  <div style={{ background: "#f6f9fc", padding: "10px 14px", borderBottom: "1px solid #e6ebf1", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#28ca41" }} />
                    </div>
                    <div style={{ flex: 1, background: "#fff", borderRadius: 6, padding: "3px 12px", fontSize: 10, color: "#94a3b8", border: "1px solid #e6ebf1" }}>
                      graduatenex.online/projects
                    </div>
                  </div>
                  {/* Search bar */}
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ flex: 1, background: "#f6f9fc", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "#94a3b8", border: "1px solid #e6ebf1" }}>
                      🔍  Search by domain, tech stack...
                    </div>
                    <div style={{ background: "#635bff", color: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600 }}>Filter</div>
                  </div>
                  {/* Project rows */}
                  <div style={{ padding: "8px 14px 14px" }}>
                    {[
                      { title: "Crop Yield Prediction using CNN", tags: ["Python", "TensorFlow", "Flask"], price: "₹8,500", badge: "AI/ML", grade: "98/100" },
                      { title: "IoT Smart Home Automation", tags: ["Arduino", "React", "Firebase"], price: "₹7,200", badge: "IoT", grade: "A+" },
                      { title: "Blockchain Voting System", tags: ["Solidity", "Web3.js", "React"], price: "₹9,800", badge: "Web3", grade: "97/100" },
                    ].map((p, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#f0eeff", color: "#635bff" }}>{p.badge}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#0a0a0a" }}>{p.title}</span>
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            {p.tags.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#f6f9fc", color: "#64748b", border: "1px solid #e6ebf1" }}>{t}</span>)}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: 12 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#0a0a0a" }}>{p.price}</div>
                          <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 700 }}>Grade: {p.grade}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Footer */}
                  <div style={{ padding: "10px 14px", background: "#f6f9fc", borderTop: "1px solid #e6ebf1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Showing 3 of <strong style={{ color: "#635bff" }}>500+</strong> projects</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#635bff", cursor: "pointer" }}>View all →</span>
                  </div>
                </div>
              </ProductCard>
            </Reveal>

            {/* ATS RESUME CARD */}
            <Reveal delay={0.06}>
              <ProductCard
                tag="Career Tool"
                title="ATS Resume Builder"
                description="17-point ATS scoring. JD match analysis. Keyword gap reports. ₹99 flat."
                href="/resume"
                accent="#00a9e0"
                bgGradient="linear-gradient(135deg, #e8f7ff 0%, #f0f9ff 100%)"
              >
                <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e6ebf1", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", padding: 20 }}>
                  {/* Score circle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                      <svg width={72} height={72} viewBox="0 0 72 72">
                        <circle cx={36} cy={36} r={30} fill="none" stroke="#e6ebf1" strokeWidth={6} />
                        <circle cx={36} cy={36} r={30} fill="none" stroke="#635bff" strokeWidth={6} strokeDasharray="188.4" strokeDashoffset="30" strokeLinecap="round" transform="rotate(-90 36 36)" />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 18, fontWeight: 900, color: "#0a0a0a", lineHeight: 1 }}>87</span>
                        <span style={{ fontSize: 9, color: "#94a3b8" }}>/100</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0a0a0a", marginBottom: 2 }}>ATS Score</div>
                      <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>● Good — above 80 is ideal</div>
                    </div>
                  </div>
                  {/* Metrics */}
                  {[
                    { label: "JD Match", value: "94%", color: "#22c55e", pct: 94 },
                    { label: "Keywords found", value: "23/27", color: "#f59e0b", pct: 85 },
                    { label: "Format score", value: "18/20", color: "#635bff", pct: 90 },
                  ].map((m, i) => (
                    <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{m.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.value}</span>
                      </div>
                      <div style={{ height: 5, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                  {/* Missing keywords */}
                  <div style={{ marginTop: 16, padding: 12, background: "#fff8f0", borderRadius: 8, border: "1px solid #fed7aa" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#ea580c", marginBottom: 6 }}>⚠ Missing keywords (4)</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {["Docker", "Kubernetes", "CI/CD", "GraphQL"].map(k => (
                        <span key={k} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#fff", border: "1px solid #fed7aa", color: "#9a3412" }}>{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ProductCard>
            </Reveal>
          </div>

          {/* ROW 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,3fr)", gap: 16, marginTop: 16 }}>
            {/* AI HUMANIZER */}
            <Reveal delay={0.04}>
              <ProductCard
                tag="Exclusive"
                title="AI Humanizer"
                description="Refine AI-generated text into natural academic writing. No AI detection."
                href="/ai-services"
                accent="#7c3aed"
                bgGradient="linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)"
              >
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e6ebf1", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  {/* Before */}
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Before</span>
                      <span style={{ fontSize: 10, background: "#fee2e2", color: "#ef4444", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>AI Detected ●</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                      "The utilization of machine learning algorithms facilitates the optimization of predictive accuracy in agricultural yield forecasting..."
                    </p>
                  </div>
                  {/* Arrow */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0", background: "#f6f9fc", gap: 8 }}>
                    <div style={{ flex: 1, height: 1, background: "#e6ebf1", marginLeft: 14 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", flexShrink: 0 }}>✦ HUMANIZING</span>
                    <div style={{ flex: 1, height: 1, background: "#e6ebf1", marginRight: 14 }} />
                  </div>
                  {/* After */}
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.06em" }}>After</span>
                      <span style={{ fontSize: 10, background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>100% Human ✓</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.5, margin: 0 }}>
                      "Using ML models to predict crop yields can meaningfully improve how farmers plan for the season ahead..."
                    </p>
                  </div>
                  {/* Similarity */}
                  <div style={{ padding: "8px 14px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "#64748b" }}>Plagiarism</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#22c55e" }}>0%</span>
                    </div>
                    <div style={{ height: 4, background: "#f1f5f9", borderRadius: 99 }}>
                      <div style={{ width: "2%", height: "100%", background: "#22c55e", borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              </ProductCard>
            </Reveal>

            {/* IEEE RESEARCH PAPERS */}
            <Reveal delay={0.08}>
              <ProductCard
                tag="High Demand"
                title="IEEE Research Papers"
                description="Conference-ready research papers. Verified originality, correct IEEE format, complete bibliography."
                href="/projects/research-paper"
                accent="#059669"
                bgGradient="linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)"
              >
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e6ebf1", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  {/* Paper header */}
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginBottom: 4 }}>IEEE Transactions on Neural Networks</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0a0a0a", lineHeight: 1.4, maxWidth: 280 }}>
                          Deep Learning Approaches for Crop Disease Detection Using Transfer Learning
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 12, flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 20, textAlign: "center" }}>✓ IEEE Format</span>
                        <span style={{ fontSize: 9, fontWeight: 700, background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 20, textAlign: "center" }}>✓ 0% Plagiarism</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 10, color: "#94a3b8" }}>Abstract  •  Introduction  •  Methodology  •  Results  •  References</div>
                  </div>
                  {/* Stats row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #f1f5f9" }}>
                    {[
                      { label: "Pages", value: "8" },
                      { label: "References", value: "24" },
                      { label: "Similarity", value: "0%" },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: "10px 16px", textAlign: "center", borderRight: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "#0a0a0a" }}>{s.value}</div>
                        <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Abstract preview */}
                  <div style={{ padding: "12px 20px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Abstract</div>
                    <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                      This paper proposes a novel transfer learning framework using ResNet-50 and DenseNet architectures for real-time crop disease classification. Our model achieves 97.3% accuracy on the PlantVillage dataset...
                    </p>
                  </div>
                  {/* Deliverables */}
                  <div style={{ padding: "0 20px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Full Paper (PDF)", "LaTeX Source", "Reference List", "Plagiarism Report"].map(d => (
                      <span key={d} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0", fontWeight: 600 }}>✓ {d}</span>
                    ))}
                  </div>
                </div>
              </ProductCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────── HOW IT WORKS ─────────────────── */}
      <section style={{ background: "#fff", padding: "96px 0", borderTop: "1px solid #e6ebf1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <Reveal>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#635bff", marginBottom: 14 }}>Process</p>
                <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15, color: "#0a0a0a", marginBottom: 16 }}>
                  Order to delivery in three steps.
                </h2>
                <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.65, marginBottom: 28 }}>
                  The fastest, most transparent academic delivery process in India. No back-and-forth. No surprises.
                </p>
                <Link href="/login" id="process-cta">
                  <HoverButton
                    base={{ background: "#635bff", color: "#fff", boxShadow: "0 4px 20px rgba(99,91,255,0.28)" }}
                    hover={{ background: "#5a52e8" }}
                    style={{ padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    Start your order <ArrowRight size={15} />
                  </HoverButton>
                </Link>
              </div>
            </Reveal>
            <div>
              {[
                { n: "01", title: "Browse & choose", body: "Explore 500+ projects by domain and tech stack. View full spec sheets and demo previews before you commit." },
                { n: "02", title: "Brief us on your needs", body: "Share your professor's base paper, rubric, or specific university format. We read everything and follow it exactly." },
                { n: "03", title: "Receive your full package", body: "Source code, SRS, IEEE paper, PPT, and a viva prep guide — delivered on time, documented, and ready to present." },
              ].map((step, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div style={{ display: "flex", gap: 20, padding: "24px 0", borderBottom: i < 2 ? "1px solid #e6ebf1" : "none" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#635bff", letterSpacing: "0.06em", minWidth: 24, paddingTop: 2 }}>{step.n}</div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a", marginBottom: 6 }}>{step.title}</h3>
                      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── TESTIMONIALS ─────────────────── */}
      <section style={{ background: "#f7f8fb", padding: "96px 0", borderTop: "1px solid #e6ebf1", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", marginBottom: 48 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#635bff", marginBottom: 14 }}>Students</p>
                <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#0a0a0a", lineHeight: 1.15 }}>
                  2,500+ students.<br />Real results.
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#fbbf24" color="#fbbf24" />)}
                <span style={{ fontSize: 15, fontWeight: 800, color: "#0a0a0a", marginLeft: 4 }}>4.9</span>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>/ 5.0 average</span>
              </div>
            </div>
          </Reveal>
        </div>
        {/* Marquee */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 140, background: "linear-gradient(90deg, #f7f8fb, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 140, background: "linear-gradient(270deg, #f7f8fb, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="marquee-track" style={{ display: "flex", gap: 16, width: "max-content", paddingLeft: 24 }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} style={{ width: 320, background: "#fff", border: "1.5px solid #e6ebf1", borderRadius: 16, padding: 24, flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={11} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 20 }}>{t.grade}</span>
                </div>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 18 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #635bff, #00a9e0)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800 }}>
                    {t.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0a0a0a" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.college}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── PRICING ───────────────────────── */}
      <section style={{ background: "#fff", padding: "96px 0", borderTop: "1px solid #e6ebf1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
          <Reveal>
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#635bff", marginBottom: 14 }}>Pricing</p>
              <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#0a0a0a", lineHeight: 1.15, marginBottom: 10 }}>
                No hidden fees. No surprises.
              </h2>
              <p style={{ fontSize: 16, color: "#94a3b8" }}>The price you see is the price you pay. Always.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { name: "ATS Resume Builder",   price: "₹99",        desc: "ATS scoring, JD match, keyword gap analysis.",        href: "/resume",                  featured: false },
              { name: "JD Match Analyzer",    price: "₹149",       desc: "Deep resume-to-job match with actionable edits.",      href: "/resume",                  featured: false },
              { name: "Project Documentation",price: "₹299",       desc: "IEEE paper, SRS, and PPT — formatted and verified.",   href: "/projects/documentation",  featured: false },
              { name: "Final Year Projects",  price: "From ₹6k",   desc: "Full project: code, docs, IEEE paper, viva prep.",     href: "/projects",                featured: true  },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <Link href={p.href} id={`pricing-${i}`} style={{ display: "block", height: "100%" }}>
                  <div
                    style={{
                      height: "100%", borderRadius: 16, padding: 24,
                      border: p.featured ? "2px solid #635bff" : "1.5px solid #e6ebf1",
                      background: p.featured ? "linear-gradient(160deg, #f7f6ff 0%, #eff0ff 100%)" : "#fff",
                      display: "flex", flexDirection: "column", cursor: "pointer",
                      transition: "box-shadow 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 8px 32px rgba(99,91,255,0.15)"; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                  >
                    {p.featured && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#635bff", background: "#ebe8ff", padding: "4px 10px", borderRadius: 20, alignSelf: "flex-start", marginBottom: 16 }}>Best Value</span>}
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a", marginBottom: 6 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, flex: 1, marginBottom: 20 }}>{p.desc}</div>
                    <div style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.03em", marginBottom: 14 }}>{p.price}</div>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: "#635bff" }}>
                      Get started <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── FOUNDER ───────────────────────── */}
      <section style={{ background: "#f7f8fb", padding: "80px 0", borderTop: "1px solid #e6ebf1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
          <Reveal>
            <div style={{ maxWidth: 760 }}>
              <blockquote style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)", fontWeight: 500, lineHeight: 1.55, color: "#0a0a0a", fontStyle: "italic", marginBottom: 28 }}>
                "I built GraduateNex because I watched brilliant students fail — not from lack of intelligence, but because of a broken system. We give you the tools, the code, and the documents so you can focus on building your career."
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #635bff, #00a9e0)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>A</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a" }}>Appala Nithin</div>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>Founder & CEO, GraduateNex</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── CTA ───────────────────────────── */}
      <section style={{ background: "#fff", padding: "96px 0", borderTop: "1px solid #e6ebf1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
          <Reveal>
            <div style={{ borderRadius: 24, padding: "56px 64px", border: "1.5px solid #e6ebf1", background: "linear-gradient(135deg, #fafbff 0%, #f7f6ff 50%, #fafbff 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
              <div>
                <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#0a0a0a", marginBottom: 12 }}>
                  Ready to graduate with a distinction?
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
                  {["Zero plagiarism", "On-time delivery", "24/7 expert support"].map(t => (
                    <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" }}>
                      <CheckCircle size={13} color="#22c55e" /> {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flexShrink: 0 }}>
                <Link href="/login" id="cta-primary">
                  <HoverButton
                    base={{ background: "#635bff", color: "#fff", boxShadow: "0 4px 20px rgba(99,91,255,0.28)" }}
                    hover={{ background: "#5a52e8" }}
                    style={{ padding: "14px 28px", borderRadius: 11, fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
                  >
                    Start free today <ArrowRight size={15} />
                  </HoverButton>
                </Link>
                <a href="tel:+917981994870" id="cta-call">
                  <HoverButton
                    base={{ background: "#fff", color: "#425466", border: "1.5px solid #e6ebf1" }}
                    hover={{ borderColor: "#c7d0dd", color: "#0a0a0a" }}
                    style={{ padding: "14px 28px", borderRadius: 11, fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
                  >
                    <Phone size={15} /> Call us
                  </HoverButton>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

function ProductCard({ tag, title, description, href, accent, bgGradient, children }: {
  tag: string; title: string; description: string; href: string;
  accent: string; bgGradient: string; children: React.ReactNode;
}) {
  return (
    <Link href={href} id={`product-${title.toLowerCase().replace(/\s+/g,'-')}`} style={{ display: "block", height: "100%" }}>
      <div
        style={{
          height: "100%", borderRadius: 20, border: "1.5px solid #e6ebf1",
          background: "#fff", overflow: "hidden",
          transition: "box-shadow 0.25s ease, transform 0.25s ease",
          cursor: "pointer", display: "flex", flexDirection: "column",
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.09)"; el.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
      >
        {/* Card header */}
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, marginBottom: 6, display: "block" }}>{tag}</span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>{title}</h3>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f6f9fc", border: "1px solid #e6ebf1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 12 }}>
              <ArrowUpRight size={13} color="#94a3b8" />
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55, marginBottom: 20 }}>{description}</p>
        </div>
        {/* Mockup area with gradient bg */}
        <div style={{ flex: 1, margin: "0 20px 20px", borderRadius: 14, padding: 16, background: bgGradient, overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </Link>
  );
}

function HoverButton({ base, hover, style, children }: {
  base: React.CSSProperties; hover: React.CSSProperties;
  style?: React.CSSProperties; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      style={{ ...style, ...base, ...(hovered ? hover : {}), transition: "all 0.2s ease", display: style?.display || "inline-flex", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </span>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay * 1000 + 100); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(18px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { rootMargin: "-40px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s` }}>
      {children}
    </div>
  );
}
