'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, Globe, ShieldCheck, Zap, MapPin, Star, CheckCircle,
  BookOpen, Brain, FileText, Cpu, Users, Award, Rocket, Code2,
  Bot, PenTool, BarChart3, Briefcase, GraduationCap, Phone, Mail,
  ChevronRight, TrendingUp, Lock, Layers, Database, Cloud, CreditCard, Shield
} from 'lucide-react';
import AuthRedirect from '@/components/AuthRedirect';

const STATS = [
  { value: '2,500+', label: 'Projects Delivered' },
  { value: '98%', label: 'Student Satisfaction' },
  { value: '50+', label: 'Cities Across India' },
  { value: '0%', label: 'Plagiarism Score' },
];

const SERVICES = [
  {
    icon: <Code2 className="h-8 w-8" />, color: 'blue',
    title: 'Final Year Projects',
    description: 'Complete, deployable source code for B.Tech, M.Tech, BCA, MCA, MBA final year projects. Covers AI/ML, IoT, Blockchain, Web & Mobile development with full documentation.',
    features: ['Source Code + Setup Guide', 'IEEE Base Paper', 'SRS Document', 'Presentation PPT'],
    badge: 'Most Popular', gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />, color: 'emerald',
    title: '0% Plagiarism Documents',
    description: 'Our expert team crafts completely original IEEE Research Papers, SRS documents, and project reports with rigorous originality checks and proper academic citations.',
    features: ['IEEE Format Research Papers', 'SRS & System Design Docs', 'Originality Verified', 'University-Specific Formatting'],
    badge: 'High Demand', gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <Brain className="h-8 w-8" />, color: 'violet',
    title: 'AI Stealth Humanizer',
    description: 'Advanced AI content enhancement tool that refines and paraphrases AI-generated text into natural, human-quality academic writing with proper style and tone.',
    features: ['Natural Language Refinement', 'Semantic Preservation', 'Academic Tone Maintained', 'Bulk Text Processing'],
    badge: 'Exclusive', gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: <FileText className="h-8 w-8" />, color: 'orange',
    title: 'ATS Resume Builder',
    description: 'Our intelligent Resume Hub grades your CV against a 17-point ATS scoring rubric and generates tailored resumes that beat Applicant Tracking Systems at top companies.',
    features: ['17-Point ATS Scoring', 'Job Description Matching', 'Cover Letter Generator', 'Multiple Export Formats'],
    badge: 'Career Tool', gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: <Rocket className="h-8 w-8" />, color: 'rose',
    title: 'Hackathon Directory',
    description: 'Stay ahead with our curated, real-time directory of national and international hackathons, coding contests, and ideathons. Filter by domain, prize pool, and deadline.',
    features: ['Real-Time Hackathon Listings', 'Filter by Domain & Date', 'Team Formation Help', 'Submission Guides'],
    badge: 'Live', gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: <PenTool className="h-8 w-8" />, color: 'cyan',
    title: 'Custom Project Development',
    description: 'Have a unique base paper from your professor? Upload your abstract and our team will architect and code the entire project from scratch, tailored to your college rubric.',
    features: ['Requirement Analysis', 'Custom Architecture Design', 'End-to-End Development', 'Viva Preparation Support'],
    badge: 'Premium', gradient: 'from-cyan-500 to-sky-500',
  },
];

const CATEGORIES = [
  { icon: <Cpu className="h-6 w-6" />, name: 'Artificial Intelligence & ML', count: '120+ Projects' },
  { icon: <Globe className="h-6 w-6" />, name: 'Internet of Things (IoT)', count: '85+ Projects' },
  { icon: <Database className="h-6 w-6" />, name: 'Blockchain & Web3', count: '60+ Projects' },
  { icon: <Cloud className="h-6 w-6" />, name: 'Cloud Computing', count: '45+ Projects' },
  { icon: <Bot className="h-6 w-6" />, name: 'Deep Learning & NLP', count: '95+ Projects' },
  { icon: <Layers className="h-6 w-6" />, name: 'Full Stack Web & Mobile', count: '150+ Projects' },
  { icon: <Lock className="h-6 w-6" />, name: 'Cybersecurity', count: '40+ Projects' },
  { icon: <BarChart3 className="h-6 w-6" />, name: 'Data Science & Analytics', count: '75+ Projects' },
];

const LOCATIONS = [
  'Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi NCR',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Coimbatore', 'Vizag', 'Nagpur', 'Indore', 'Bhubaneswar',
  'Kochi', 'Chandigarh', 'Thiruvananthapuram', 'Bhopal', 'Patna',
];

const TESTIMONIALS = [
  { name: 'Sai Kiran Reddy', college: 'JNTUH, Hyderabad', branch: 'B.Tech CSE, 2024', text: 'I was panicking two months before submission. GraduateNex delivered a complete ML-based crop prediction system with IEEE paper, SRS, and PPT. Got 98/100 from my guide. Absolutely life-saving!', rating: 5 },
  { name: 'Priya Sharma', college: 'VIT, Vellore', branch: 'M.Tech AI, 2024', text: 'The AI Writing Enhancer refined my entire 40-page thesis into natural, polished academic language. The tone was perfectly preserved and it reads beautifully now. Absolutely essential tool.', rating: 5 },
  { name: 'Rahul Nair', college: 'Anna University, Chennai', branch: 'B.Tech IT, 2023', text: 'Their ATS Resume Builder got me shortlisted at 4 MNC companies in my campus drive. The job description matching feature is insanely accurate. Landed a role at Infosys!', rating: 5 },
  { name: 'Ananya Gupta', college: 'Amity University, Noida', branch: 'MCA, 2024', text: 'Ordered a custom Blockchain project. The team analysed my professor\'s exact rubric and built a decentralized voting system from scratch. Got an A grade and my guide was thoroughly impressed.', rating: 5 },
];

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      for (let i = 0; i < 90; i++) {
        particles.push({
          x: Math.random() * (canvas?.width ?? 0),
          y: Math.random() * (canvas?.height ?? 0),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.6 + 0.1,
        });
      }
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,146,60,${p.alpha})`;
        ctx.fill();

        // Draw connection lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(251,146,60,${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', url: 'https://www.graduatenex.online/', name: 'GraduateNex', potentialAction: { '@type': 'SearchAction', target: 'https://www.graduatenex.online/projects?q={search_term_string}', 'query-input': 'required name=search_term_string' } },
      { '@type': 'Organization', name: 'GraduateNex', url: 'https://www.graduatenex.online/', logo: 'https://www.graduatenex.online/logo.png' },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 font-sans selection:bg-orange-400/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthRedirect />

      <style jsx global>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateY(10deg); }
        }
        @keyframes float-down {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(20px) rotateY(-10deg); }
        }
        @keyframes spin-slow {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251,146,60,0.3), 0 0 60px rgba(251,146,60,0.1); }
          50% { box-shadow: 0 0 40px rgba(251,146,60,0.6), 0 0 100px rgba(251,146,60,0.3); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes counter-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(251,146,60,0.5); }
          50% { text-shadow: 0 0 40px rgba(251,146,60,1), 0 0 60px rgba(251,146,60,0.5); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes tilt-card {
          0%, 100% { transform: perspective(800px) rotateX(0deg) rotateY(0deg); }
          25% { transform: perspective(800px) rotateX(3deg) rotateY(3deg); }
          75% { transform: perspective(800px) rotateX(-3deg) rotateY(-3deg); }
        }
        .float-card-1 { animation: float-up 6s ease-in-out infinite; }
        .float-card-2 { animation: float-down 7s ease-in-out infinite; animation-delay: -2s; }
        .float-card-3 { animation: float-up 8s ease-in-out infinite; animation-delay: -4s; }
        .glow-pulse { animation: pulse-glow 3s ease-in-out infinite; }
        .counter-text { animation: counter-glow 2s ease-in-out infinite; }
        .slide-left { animation: slide-in-left 0.8s ease-out both; }
        .slide-right { animation: slide-in-right 0.8s ease-out 0.2s both; }
        .fade-up { animation: fade-up 0.7s ease-out both; }
        .shimmer-text {
          background: linear-gradient(90deg, #f97316, #fb923c, #fdba74, #f97316);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .card-3d {
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease;
          transform-style: preserve-3d;
        }
        .card-3d:hover {
          transform: perspective(800px) rotateX(-4deg) rotateY(4deg) translateY(-8px) scale(1.02);
          box-shadow: 20px 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(251,146,60,0.15);
        }
        .service-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
          pointer-events: none;
        }
        .stat-card {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }
        .stat-card:hover {
          transform: perspective(500px) rotateX(-5deg) translateY(-4px);
        }
        .orbiting-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f97316;
          animation: orbit 4s linear infinite;
        }
        .orbiting-dot-2 {
          animation: orbit 6s linear infinite reverse;
          background: #a78bfa;
          width: 6px;
          height: 6px;
        }
        .hero-title {
          animation: fade-up 1s ease-out both;
        }
        .hero-subtitle {
          animation: fade-up 1s ease-out 0.2s both;
        }
        .hero-buttons {
          animation: fade-up 1s ease-out 0.4s both;
        }
        .hero-badges {
          animation: fade-up 1s ease-out 0.6s both;
        }
      `}</style>

      {/* ── HERO SECTION ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center bg-zinc-950 overflow-hidden text-white">
        {/* Animated particle canvas */}
        <ParticleCanvas />

        {/* Deep space gradient layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
        </div>

        {/* 3D Grid floor */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20" style={{ perspective: '800px' }}>
          <div style={{
            width: '200%', height: '200%', position: 'absolute', bottom: '-50%', left: '-50%',
            backgroundImage: 'linear-gradient(rgba(251,146,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px', transform: 'rotateX(60deg)',
          }} />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-32">

            {/* Left: Text content */}
            <div className="space-y-8">
              <div className="hero-title">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold tracking-wide mb-6">
                  <Globe className="h-4 w-4" /> India&apos;s #1 Academic Project Platform
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-white">
                  Your Academic<br />
                  <span className="shimmer-text">Success Partner</span>
                </h1>
              </div>

              <p className="hero-subtitle text-lg text-zinc-300 leading-relaxed max-w-xl font-medium">
                From final year projects and zero-plagiarism IEEE papers to AI-powered career tools — GraduateNex is the complete ecosystem helping <strong className="text-white">2,500+ students</strong> graduate with distinction every year.
              </p>

              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <button className="glow-pulse h-14 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                    Start Free Today <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link href="#services">
                  <button className="h-14 px-8 text-lg font-bold rounded-xl bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-orange-400/50 transition-all backdrop-blur-md">
                    Explore Services
                  </button>
                </Link>
              </div>

              <div className="hero-badges flex flex-wrap items-center gap-6">
                {['Original, Plagiarism-Free Work', '24/7 Expert Support', '50+ Cities Served'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3D Floating Cards */}
            <div className="relative hidden lg:flex items-center justify-center" style={{ height: '500px', perspective: '1000px' }}>
              {/* Central glowing orb */}
              <div className="absolute w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.4) 0%, rgba(251,146,60,0.05) 60%, transparent 100%)', filter: 'blur(20px)' }} />

              {/* Orbiting dots */}
              <div className="absolute" style={{ width: '280px', height: '280px', position: 'absolute' }}>
                <div className="orbiting-dot" />
                <div className="orbiting-dot orbiting-dot-2" style={{ animationDelay: '-3s' }} />
              </div>

              {/* Float Card 1: Stats */}
              <div className="float-card-1 absolute -top-8 -left-12 bg-zinc-900/90 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-5 w-52 shadow-2xl"
                style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">This Month</span>
                </div>
                <p className="text-3xl font-black text-white">2,500+</p>
                <p className="text-xs text-emerald-400 font-semibold mt-1">▲ Projects Delivered</p>
              </div>

              {/* Float Card 2: Rating */}
              <div className="float-card-2 absolute -top-4 -right-8 bg-zinc-900/90 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-5 w-48 shadow-2xl"
                style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-2xl font-black text-white">98%</p>
                <p className="text-xs text-zinc-400 mt-1">Student Satisfaction</p>
              </div>

              {/* Float Card 3: AI Badge */}
              <div className="float-card-3 absolute -bottom-8 left-0 bg-gradient-to-br from-violet-900/80 to-violet-800/80 backdrop-blur-xl border border-violet-500/40 rounded-2xl p-5 w-56 shadow-2xl"
                style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-violet-300" />
                  <span className="text-xs text-violet-300 font-bold uppercase tracking-wider">AI Powered</span>
                </div>
                <p className="text-sm font-semibold text-white">Stealth Humanizer</p>
                <p className="text-xs text-violet-300 mt-1">0% AI Detection Rate</p>
              </div>

              {/* Float Card 4: Cities */}
              <div className="float-card-1 absolute -bottom-2 -right-4 bg-zinc-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 w-44 shadow-2xl" style={{ animationDelay: '-3s', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                <MapPin className="h-5 w-5 text-emerald-400 mb-2" />
                <p className="text-2xl font-black text-white">50+</p>
                <p className="text-xs text-zinc-400">Cities in India</p>
              </div>

              {/* Central icon */}
              <div className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl" style={{ boxShadow: '0 0 60px rgba(251,146,60,0.5)' }}>
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 z-10">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-orange-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=20 height=20 xmlns=http://www.w3.org/2000/svg%3E%3Ccircle cx=1 cy=1 r=1 fill=rgba(0,0,0,0.1)/%3E%3C/svg%3E')] opacity-30" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white relative z-10">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card space-y-1">
                <p className="text-3xl md:text-4xl font-black">{s.value}</p>
                <p className="text-sm font-medium text-white/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="w-full py-32 bg-zinc-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-500/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-20 space-y-4 max-w-3xl mx-auto fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold">
              <Layers className="h-4 w-4" /> Our Complete Product Suite
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Everything You Need to<br /><span className="shimmer-text">Graduate with Excellence</span>
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              A full-stack academic success platform covering projects, documentation, AI tools, and career launch — all under one roof.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {SERVICES.map((svc, idx) => (
              <Link href="/login" key={svc.title}
                className="card-3d service-card group relative bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-800 hover:border-orange-500/40 p-8 flex flex-col overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}>
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${svc.gradient} pointer-events-none`} style={{ opacity: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.04')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')} />

                <span className="absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {svc.badge}
                </span>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {svc.icon}
                </div>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors">{svc.title}</h3>
                <p className="text-zinc-400 leading-relaxed mb-6 flex-1 text-sm">{svc.description}</p>

                <ul className="space-y-2 mb-6">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center gap-2 text-orange-400 font-bold text-sm group-hover:gap-3 transition-all">
                  Get Started <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT CATEGORIES ── */}
      <section className="w-full py-24 bg-zinc-900/50 border-y border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Explore by <span className="shimmer-text">Domain</span></h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Browse our deep catalogue of ready-made projects across every major engineering and management domain.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {CATEGORIES.map((cat) => (
              <Link href="/login" key={cat.name}>
                <div className="card-3d group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/40 cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all flex-shrink-0">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-bold text-white leading-tight text-sm">{cat.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{cat.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-full py-32 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              From Order to Delivery in <span className="shimmer-text">3 Simple Steps</span>
            </h2>
            <p className="text-lg text-zinc-400">We have streamlined the entire process so you can focus on what matters — your viva and your career.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-16 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-orange-500/50 via-orange-400/50 to-orange-500/50 hidden md:block" />
            {[
              { step: '01', icon: <BookOpen className="h-8 w-8" />, title: 'Browse & Select', desc: 'Explore our marketplace. Filter by domain, tech stack, or college level. Every listing includes detailed specs, images, and a demo video.' },
              { step: '02', icon: <Briefcase className="h-8 w-8" />, title: 'Place Your Order', desc: 'Add to cart, complete checkout, and share your specific college requirements via our custom request form. Upload your professor\'s base paper if needed.' },
              { step: '03', icon: <TrendingUp className="h-8 w-8" />, title: 'Receive & Deploy', desc: 'Get your complete project package — source code, SRS, IEEE paper, PPT — with a step-by-step deployment guide. Our team is on call for viva prep.' },
            ].map((step) => (
              <div key={step.step} className="card-3d flex flex-col items-center text-center space-y-5 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPARENT PRICING ── */}
      <section className="w-full py-24 bg-zinc-900/50 border-y border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Transparent & Upfront <span className="shimmer-text">Pricing</span>
            </h2>
            <p className="text-lg text-zinc-400">No hidden fees. No &quot;Contact us for price&quot;. Get immediate access to what you need.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              { name: 'ATS Resume Builder', price: '₹199', desc: 'AI-generated ATS-friendly resume.' },
              { name: 'JD Match Analyzer', price: '₹299', desc: 'Match your resume to specific job roles.' },
              { name: 'Project Documentation', price: '₹149', desc: 'Instant IEEE/SRS documentation templates.' },
              { name: 'Final Year Projects', price: 'From ₹6,000', desc: 'Complete source code, setup, and support.' },
            ].map((plan) => (
              <Link href="/services" key={plan.name}
                className="card-3d group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between text-center hover:border-orange-500/50">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-white group-hover:text-orange-400 transition-colors">{plan.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6">{plan.desc}</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-orange-400 mb-5">{plan.price}</div>
                  <div className="w-full rounded-xl border border-zinc-700 group-hover:border-orange-500 group-hover:bg-orange-500 py-2.5 text-sm font-bold text-zinc-300 group-hover:text-white transition-all">View Details</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="w-full py-24 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold">
              <Star className="h-4 w-4 fill-orange-400" /> Trusted by Students Nationwide
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Real Results from <span className="shimmer-text">Real Students</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-3d bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 rounded-3xl p-8 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 leading-relaxed">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-4 pt-3 border-t border-zinc-800">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.branch} · {t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section className="w-full py-24 bg-zinc-900/50 border-y border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold">
              <MapPin className="h-4 w-4" /> Pan-India Reach
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Serving Students Across <span className="shimmer-text">50+ Cities in India</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {LOCATIONS.map((city) => (
              <div key={city} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-orange-500/50 hover:bg-zinc-800 transition-all text-sm font-semibold text-zinc-300">
                <MapPin className="h-3.5 w-3.5 text-orange-400" /> {city}
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-bold">
              + 30 More Cities
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="w-full py-24 bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-zinc-900/80 backdrop-blur-sm p-10 md:p-14 rounded-[3rem] border border-zinc-800 shadow-2xl" style={{ boxShadow: '0 0 80px rgba(251,146,60,0.05)' }}>
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-1 flex-shrink-0 shadow-xl" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c, #fbbf24)', boxShadow: '0 0 60px rgba(251,146,60,0.3)' }}>
              <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-zinc-900">
                <Image src="/founder_nithin.jpg" alt="Appala Nithin" fill className="object-cover object-top" />
              </div>
            </div>
            <div className="text-center md:text-left space-y-5">
              <div className="inline-flex px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold uppercase tracking-widest">
                Founder & CEO
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white">Appala Nithin</h3>
              <div className="space-y-3 text-base text-zinc-400 leading-relaxed">
                <p><strong className="text-white">Appala Nithin</strong> is the visionary founder behind <strong className="text-orange-400">GraduateNex</strong> — a platform built from the ground up to solve the real academic struggles that millions of Indian students face every year.</p>
                <p>Having seen firsthand how talented students were failing not because of intelligence, but because of a broken system — he built GraduateNex to be the definitive solution combining a production-quality project marketplace, AI-powered tools, and an intelligent career engine.</p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                {['EdTech Visionary', '2,500+ Students Helped', '50+ Cities Served'].map((tag, i) => {
                  const icons = [<GraduationCap key={0} className="h-4 w-4 text-orange-400" />, <Award key={1} className="h-4 w-4 text-orange-400" />, <Users key={2} className="h-4 w-4 text-orange-400" />];
                  return (
                    <span key={tag} className="flex items-center gap-2 text-sm font-semibold bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300">
                      {icons[i]} {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full py-24 bg-zinc-900/50 border-t border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Frequently Asked <span className="shimmer-text">Questions</span>
            </h2>
            <p className="text-lg text-zinc-400">Quick answers to common queries about our services.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {[
              { q: 'What is GraduateNex?', a: 'GraduateNex is an academic success platform providing production-ready final year project source code, AI-powered resume tools, documentation generators, and research paper assistance for students across India.' },
              { q: 'Are the projects plagiarism-free?', a: 'Yes. Every project and document we deliver is crafted to be original. We use internal plagiarism screening tools to ensure the content meets academic integrity standards.' },
              { q: 'How are digital products delivered?', a: 'All digital products are delivered instantly after payment via secure download links on the order confirmation page and through your registered email address.' },
              { q: 'What payment methods do you accept?', a: 'We accept UPI, Debit/Credit Cards, Net Banking, and Wallets through Razorpay — a PCI-DSS compliant, bank-grade secure payment gateway.' },
              { q: 'Can I get a refund?', a: "Digital products are generally non-refundable once delivered. However, refunds are issued for technical payment failures, undelivered products, and custom projects that don't meet agreed specifications." },
              { q: 'Do you offer support after purchase?', a: 'Absolutely. We provide post-purchase technical support for setup, deployment, and viva preparation. Our team is available Monday–Friday, 9AM–6PM IST.' },
            ].map((faq) => (
              <div key={faq.q} className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 rounded-2xl p-6 transition-colors">
                <h3 className="font-bold text-base mb-2 text-white">{faq.q}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ── */}
      <section className="w-full py-14 bg-zinc-950 border-y border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              { icon: <Shield className="h-8 w-8 text-emerald-400" />, title: 'Secure Payments', sub: '256-bit SSL Encryption' },
              { icon: <CreditCard className="h-8 w-8 text-blue-400" />, title: 'Powered by Razorpay', sub: 'PCI-DSS Compliant' },
              { icon: <CheckCircle className="h-8 w-8 text-orange-400" />, title: '2,500+ Orders', sub: 'Delivered Successfully' },
              { icon: <Phone className="h-8 w-8 text-violet-400" />, title: 'Dedicated Support', sub: 'Mon–Fri, 9AM–6PM IST' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                {item.icon}
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-zinc-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="w-full py-32 relative overflow-hidden bg-zinc-950">
        {/* 3D perspective rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[600px] h-[600px] rounded-full border border-orange-500/10 animate-pulse" />
          <div className="absolute w-[800px] h-[800px] rounded-full border border-orange-500/5" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[60px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold">
            <Zap className="h-4 w-4 fill-orange-400" /> Limited Time — Join 2,500+ Students
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Your Final Year Project is<br /><span className="shimmer-text">One Click Away.</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Join 2,500+ students who have already secured top grades, submitted original documentation, and advanced their careers using GraduateNex.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <button className="glow-pulse h-16 px-12 text-xl font-black rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                Get Started — It&apos;s Free <ArrowRight className="h-6 w-6" />
              </button>
            </Link>
            <a href="tel:+917981994870">
              <button className="h-16 px-10 text-xl font-bold rounded-xl bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-orange-400/50 transition-all flex items-center gap-2">
                <Phone className="h-5 w-5" /> Call Us Now
              </button>
            </a>
          </div>
          <p className="text-zinc-500 text-sm">
            📞 +91 79819 94870 &nbsp;|&nbsp; ✉️ support@graduatenex.online &nbsp;|&nbsp; 📍 T Hub, Hitech City, Hyderabad
          </p>
        </div>
      </section>

      {/* FAQPage Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is GraduateNex?', acceptedAnswer: { '@type': 'Answer', text: 'GraduateNex is an academic success platform providing production-ready final year project source code, AI-powered resume tools, documentation generators, and research paper assistance for students across India.' } },
          { '@type': 'Question', name: 'Are the projects plagiarism-free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every project and document we deliver is crafted to be original. We use internal plagiarism screening tools to ensure the content meets academic integrity standards.' } },
        ],
      }) }} />
    </div>
  );
}
