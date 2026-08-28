'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Star, MapPin, Phone, ChevronRight, Shield, CreditCard, Users, Award, GraduationCap, Zap, Globe } from 'lucide-react';
import AuthRedirect from '@/components/AuthRedirect';

const STATS = [
  { value: '2,500+', label: 'Projects Delivered', icon: '🎓' },
  { value: '98%', label: 'Student Satisfaction', icon: '⭐' },
  { value: '50+', label: 'Cities Across India', icon: '🗺️' },
  { value: '0%', label: 'Plagiarism Score', icon: '✅' },
];

const SERVICES = [
  { emoji: '💻', title: 'Final Year Projects', desc: 'Complete, deployable source code for B.Tech, M.Tech, BCA, MCA final year projects across AI/ML, IoT, Blockchain, Web & Mobile.', badge: 'Most Popular', color: '#4F46E5' },
  { emoji: '📄', title: '0% Plagiarism Docs', desc: 'Completely original IEEE Research Papers, SRS documents, and project reports with rigorous originality checks and academic citations.', badge: 'High Demand', color: '#059669' },
  { emoji: '🤖', title: 'AI Stealth Humanizer', desc: 'Refines AI-generated text into natural, human-quality academic writing. Semantic preservation with proper style, tone, and academic formatting.', badge: 'Exclusive', color: '#7C3AED' },
  { emoji: '📊', title: 'ATS Resume Builder', desc: 'Intelligent Resume Hub that grades your CV against 17-point ATS scoring and generates tailored resumes that beat tracking systems at TCS, Infosys, Wipro.', badge: 'Career Tool', color: '#D97706' },
  { emoji: '🚀', title: 'Hackathon Directory', desc: 'Real-time directory of national and international hackathons, coding contests, and ideathons. Filter by domain, prize pool, and deadline.', badge: 'Live', color: '#DC2626' },
  { emoji: '🔧', title: 'Custom Development', desc: 'Have a unique base paper? Upload your abstract and our team will architect and code the entire project from scratch to your college rubric.', badge: 'Premium', color: '#0891B2' },
];

const TESTIMONIALS = [
  { name: 'Sai Kiran Reddy', college: 'JNTUH, Hyderabad', branch: 'B.Tech CSE, 2024', text: 'I was panicking two months before submission. GraduateNex delivered a complete ML-based crop prediction system with IEEE paper, SRS, and PPT. Got 98/100 from my guide.', rating: 5, avatar: 'S' },
  { name: 'Priya Sharma', college: 'VIT, Vellore', branch: 'M.Tech AI, 2024', text: 'The AI Writing Enhancer refined my entire 40-page thesis into natural, polished academic language. The tone was perfectly preserved and it reads beautifully now.', rating: 5, avatar: 'P' },
  { name: 'Rahul Nair', college: 'Anna University, Chennai', branch: 'B.Tech IT, 2023', text: 'Their ATS Resume Builder got me shortlisted at 4 MNC companies in my campus drive. The job description matching feature is insanely accurate. Landed at Infosys!', rating: 5, avatar: 'R' },
  { name: 'Ananya Gupta', college: 'Amity University, Noida', branch: 'MCA, 2024', text: 'Ordered a custom Blockchain project. The team analysed my professor\'s exact rubric and built a decentralized voting system. Got an A grade and my guide was impressed.', rating: 5, avatar: 'A' },
];

function TiltCard({ children, className = '', style: extraStyle = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
    el.style.boxShadow = `${-rotY * 3}px ${rotX * 3}px 50px rgba(79,70,229,0.15), 0 30px 60px rgba(0,0,0,0.08)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', transformStyle: 'preserve-3d', willChange: 'transform', ...extraStyle }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', url: 'https://www.graduatenex.online/', name: 'GraduateNex', potentialAction: { '@type': 'SearchAction', target: 'https://www.graduatenex.online/projects?q={search_term_string}', 'query-input': 'required name=search_term_string' } },
      { '@type': 'Organization', name: 'GraduateNex', url: 'https://www.graduatenex.online/', logo: 'https://www.graduatenex.online/logo.png' },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen font-sans" style={{ background: '#FAFAFA' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthRedirect />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-title { animation: slide-up 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .hero-sub { animation: slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .hero-btns { animation: slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .hero-3d { animation: scale-in 1s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .float-1 { animation: float-gentle 7s ease-in-out infinite; }
        .float-2 { animation: float-slow 9s ease-in-out infinite 1s; }
        .float-3 { animation: float-gentle 8s ease-in-out infinite 2s; }
        .float-4 { animation: float-slow 10s ease-in-out infinite 3s; }
        .gradient-text {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 4s ease infinite;
        }
        .mesh-bg {
          background-color: #F8F7FF;
          background-image:
            radial-gradient(at 20% 20%, rgba(79,70,229,0.08) 0, transparent 50%),
            radial-gradient(at 80% 10%, rgba(124,58,237,0.06) 0, transparent 50%),
            radial-gradient(at 60% 80%, rgba(236,72,153,0.04) 0, transparent 50%),
            radial-gradient(at 10% 80%, rgba(16,185,129,0.04) 0, transparent 50%);
        }
        .card-surface {
          background: white;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          border-radius: 20px;
        }
        .service-card:hover .service-emoji { transform: scale(1.2) rotate(-5deg); }
        .service-emoji { transition: transform 0.3s ease; display: inline-block; }
        .stat-num {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .marquee-track { animation: marquee 30s linear infinite; display: flex; gap: 2rem; }
        .section-label {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(79,70,229,0.08);
          color: #4F46E5;
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 100px; border: 1px solid rgba(79,70,229,0.15);
        }
        .glass-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1);
          border-radius: 18px;
        }
        .cta-section {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #6D28D9 100%);
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════ HERO */}
      <section className="mesh-bg relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Soft orbs - NOT neon, very subtle */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', width: '100%' }}>

          {/* LEFT: Text */}
          <div>
            <div className="hero-title">
              <div className="section-label" style={{ marginBottom: '24px' }}>
                <Globe size={12} /> India&apos;s #1 Academic Platform
              </div>
              <h1 style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 900, lineHeight: 1.05, color: '#0F0E1A', letterSpacing: '-0.03em', marginBottom: '24px' }}>
                Your Academic<br />
                <span className="gradient-text">Success Partner</span>
              </h1>
            </div>
            <p className="hero-sub" style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1.7, marginBottom: '36px', fontWeight: 400, maxWidth: '480px' }}>
              From final year projects and IEEE papers to AI career tools — GraduateNex helps <strong style={{ color: '#111827', fontWeight: 700 }}>2,500+ students</strong> graduate with distinction every year.
            </p>

            <div className="hero-btns" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link href="/login">
                <button style={{ height: '52px', padding: '0 28px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 30px rgba(79,70,229,0.35)', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 14px 40px rgba(79,70,229,0.45)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(79,70,229,0.35)'; }}>
                  Start Free Today <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="#services">
                <button style={{ height: '52px', padding: '0 28px', background: 'white', color: '#374151', border: '1.5px solid #E5E7EB', borderRadius: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#4F46E5'; (e.currentTarget as HTMLButtonElement).style.color = '#4F46E5'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; }}>
                  Explore Services
                </button>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {['Original, Plagiarism-Free Work', '24/7 Expert Support', '50+ Cities Served'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
                  <CheckCircle size={15} color="#10B981" strokeWidth={2.5} /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Real 3D floating mockup */}
          <div className="hero-3d" style={{ position: 'relative', height: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Main 3D card — perspective dashboard mockup */}
            <div className="float-1" style={{
              position: 'relative',
              width: '420px',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 40px 100px rgba(79,70,229,0.2), 0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(79,70,229,0.1)',
              overflow: 'hidden',
              transform: `perspective(1000px) rotateY(-6deg) rotateX(3deg) translateX(${mousePos.x * 0.3}px) translateY(${mousePos.y * 0.2}px)`,
              transition: 'transform 0.1s ease',
            }}>
              {/* Mockup top bar */}
              <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                <div style={{ flex: 1, height: '24px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', marginLeft: '8px' }} />
              </div>
              {/* Mockup content */}
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ height: '14px', background: '#F3F4F6', borderRadius: '8px', width: '60%', marginBottom: '8px' }} />
                  <div style={{ height: '10px', background: '#F9FAFB', borderRadius: '6px', width: '85%' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  {['#EEF2FF', '#F0FDF4', '#FFF7ED', '#FDF4FF'].map((bg, i) => (
                    <div key={i} style={{ background: bg, borderRadius: '12px', padding: '12px', height: '60px', border: `1px solid ${['#C7D2FE','#BBF7D0','#FED7AA','#E9D5FF'][i]}` }}>
                      <div style={{ height: '10px', background: ['#4F46E5','#059669','#D97706','#7C3AED'][i], opacity: 0.4, borderRadius: '6px', width: '60%', marginBottom: '6px' }} />
                      <div style={{ height: '14px', background: ['#4F46E5','#059669','#D97706','#7C3AED'][i], borderRadius: '4px', width: '40%', fontWeight: 700 }} />
                    </div>
                  ))}
                </div>
                <div style={{ background: '#F8F7FF', borderRadius: '12px', padding: '14px', border: '1px solid #E0E7FF' }}>
                  <div style={{ height: '10px', background: '#C7D2FE', borderRadius: '6px', width: '70%', marginBottom: '8px' }} />
                  <div style={{ height: '8px', background: '#E0E7FF', borderRadius: '4px', width: '90%', marginBottom: '6px' }} />
                  <div style={{ height: '8px', background: '#E0E7FF', borderRadius: '4px', width: '75%' }} />
                </div>
              </div>
            </div>

            {/* Floating mini cards — glassmorphism, real depth */}
            <div className="glass-card float-2" style={{ position: 'absolute', top: '30px', right: '-20px', padding: '14px 18px', minWidth: '160px', transform: `translateX(${mousePos.x * 0.5}px) translateY(${mousePos.y * 0.3}px)` }}>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, marginBottom: '4px' }}>This Month</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#4F46E5', lineHeight: 1 }}>2,500+</div>
              <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>▲ Projects Delivered</div>
            </div>

            <div className="glass-card float-3" style={{ position: 'absolute', bottom: '60px', right: '-30px', padding: '14px 18px', transform: `translateX(${mousePos.x * 0.4}px) translateY(${mousePos.y * -0.2}px)` }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#111827', lineHeight: 1 }}>98%</div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, marginTop: '3px' }}>Satisfaction Rate</div>
            </div>

            <div className="glass-card float-4" style={{ position: 'absolute', top: '100px', left: '-40px', padding: '14px 18px', transform: `translateX(${mousePos.x * -0.4}px) translateY(${mousePos.y * 0.3}px)` }}>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>🏆</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Rank #1</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Academic Platform</div>
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, rgba(79,70,229,0.4), transparent)', animation: 'float-slow 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ STATS */}
      <section style={{ background: 'white', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '24px', borderRight: i < 3 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>{s.icon}</div>
              <div className="stat-num" style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ SERVICES */}
      <section id="services" className="mesh-bg" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>Our Complete Suite</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, color: '#0F0E1A', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.1 }}>
              Everything You Need to<br /><span className="gradient-text">Graduate with Excellence</span>
            </h2>
            <p style={{ fontSize: '17px', color: '#6B7280', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
              A full-stack academic success platform covering projects, documentation, AI tools, and career launch.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {SERVICES.map((svc, idx) => (
              <TiltCard key={svc.title} className="card-surface service-card" style={{ padding: '32px', cursor: 'pointer', position: 'relative', overflow: 'hidden' } as React.CSSProperties}>
                <Link href="/login" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  {/* Top accent line */}
                  <div style={{ position: 'absolute', top: 0, left: '32px', right: '32px', height: '3px', background: `linear-gradient(90deg, ${svc.color}, transparent)`, borderRadius: '0 0 4px 4px' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div className="service-emoji" style={{ fontSize: '36px', lineHeight: 1 }}>{svc.emoji}</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', background: `${svc.color}15`, color: svc.color, letterSpacing: '0.05em' }}>{svc.badge}</span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', marginBottom: '10px', letterSpacing: '-0.02em' }}>{svc.title}</h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7, marginBottom: '20px' }}>{svc.desc}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700, color: svc.color }}>
                    Get Started <ChevronRight size={14} />
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ HOW IT WORKS */}
      <section style={{ background: 'white', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 900, color: '#0F0E1A', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              From Order to Delivery in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: '52px', left: '20%', right: '20%', height: '2px', background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899)', borderRadius: '2px', zIndex: 0 }} />

            {[
              { step: '01', title: 'Browse & Select', desc: 'Explore our marketplace. Filter by domain, tech stack, or college level. Every listing includes detailed specs, images, and a demo video.', emoji: '🔍' },
              { step: '02', title: 'Place Your Order', desc: 'Add to cart, complete checkout, and share your specific college requirements. Upload your professor\'s base paper if needed.', emoji: '🛒' },
              { step: '03', title: 'Receive & Deploy', desc: 'Get your complete project package — source code, SRS, IEEE paper, PPT — with a step-by-step deployment guide and viva prep.', emoji: '🚀' },
            ].map((s, i) => (
              <TiltCard key={s.step} className="card-surface" style={{ padding: '36px 28px', textAlign: 'center', position: 'relative', zIndex: 1 } as React.CSSProperties}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(79,70,229,0.3)', position: 'relative' }}>
                  <span style={{ fontSize: '22px' }}>{s.emoji}</span>
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', borderRadius: '50%', background: '#0F0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: 'white' }}>{s.step}</div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '10px', letterSpacing: '-0.02em' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>{s.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ PRICING */}
      <section className="mesh-bg" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 900, color: '#0F0E1A', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Transparent & Upfront <span className="gradient-text">Pricing</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280', marginTop: '12px' }}>No hidden fees. No &quot;Contact us for price&quot;.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            {[
              { name: 'ATS Resume Builder', price: '₹199', desc: 'AI-generated ATS-friendly resume', hot: false },
              { name: 'JD Match Analyzer', price: '₹299', desc: 'Match resume to job roles', hot: false },
              { name: 'Project Documentation', price: '₹149', desc: 'Instant IEEE/SRS docs', hot: false },
              { name: 'Final Year Projects', price: 'From ₹6,000', desc: 'Complete source code & support', hot: true },
            ].map((p) => (
              <TiltCard key={p.name} className="card-surface" style={{ padding: '28px 24px', textAlign: 'center', position: 'relative', ...(p.hot ? { borderColor: '#4F46E5', boxShadow: '0 8px 40px rgba(79,70,229,0.2)' } : {}) } as React.CSSProperties}>
                {p.hot && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', whiteSpace: 'nowrap' }}>Most Popular</div>}
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '20px', lineHeight: 1.5 }}>{p.desc}</p>
                <div className="stat-num" style={{ fontSize: '28px', fontWeight: 900, marginBottom: '20px' }}>{p.price}</div>
                <Link href="/services">
                  <button style={{ width: '100%', padding: '10px', borderRadius: '10px', border: p.hot ? 'none' : '1.5px solid #E5E7EB', background: p.hot ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : 'transparent', color: p.hot ? 'white' : '#374151', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    View Details
                  </button>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ TESTIMONIALS */}
      <section style={{ background: 'white', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>
              <Star size={12} fill="#4F46E5" /> Student Reviews
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 900, color: '#0F0E1A', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Real Results from <span className="gradient-text">Real Students</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {TESTIMONIALS.map((t) => (
              <TiltCard key={t.name} className="card-surface" style={{ padding: '32px' } as React.CSSProperties}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.75, marginBottom: '20px', fontStyle: 'italic' }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '16px', flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{t.branch} · {t.college}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ LOCATIONS */}
      <section className="mesh-bg" style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            <MapPin size={12} /> Pan-India Reach
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, color: '#0F0E1A', letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.1 }}>
            Serving <span className="gradient-text">50+ Cities</span> Across India
          </h2>
          <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '40px' }}>100% digital delivery — no location barriers.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {['Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi NCR', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Coimbatore', 'Vizag', 'Nagpur', 'Indore', 'Bhubaneswar', 'Kochi', 'Chandigarh', 'Thiruvananthapuram', 'Bhopal', 'Patna'].map(city => (
              <div key={city} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '100px', background: 'white', border: '1.5px solid #E5E7EB', fontSize: '13px', fontWeight: 600, color: '#374151', transition: 'all 0.2s ease', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#4F46E5'; (e.currentTarget as HTMLDivElement).style.color = '#4F46E5'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLDivElement).style.color = '#374151'; }}>
                <MapPin size={11} color="#4F46E5" /> {city}
              </div>
            ))}
            <div style={{ padding: '8px 16px', borderRadius: '100px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', fontSize: '13px', fontWeight: 700, color: 'white' }}>+ 30 More</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ FOUNDER */}
      <section style={{ background: 'white', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <TiltCard className="card-surface" style={{ padding: '60px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '56px', alignItems: 'center', boxShadow: '0 20px 60px rgba(79,70,229,0.1)' } as React.CSSProperties}>
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', flexShrink: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED, #EC4899)', zIndex: 0 }} />
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '4px solid white', zIndex: 1 }}>
                <Image src="/founder_nithin.jpg" alt="Appala Nithin" fill className="object-cover object-top" />
              </div>
            </div>
            <div>
              <div className="section-label" style={{ marginBottom: '12px', display: 'inline-flex' }}>Founder & CEO</div>
              <h3 style={{ fontSize: '36px', fontWeight: 900, color: '#0F0E1A', letterSpacing: '-0.03em', marginBottom: '16px' }}>Appala Nithin</h3>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.8, marginBottom: '8px' }}>
                <strong style={{ color: '#111827' }}>Appala Nithin</strong> is the visionary founder behind <strong style={{ color: '#4F46E5' }}>GraduateNex</strong> — built from the ground up to solve real academic struggles millions of Indian students face every year.
              </p>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.8, marginBottom: '20px' }}>
                Combining a production-quality project marketplace, AI-powered document tools, and an intelligent career launch engine into one seamless platform.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {[{ icon: '🎓', text: 'EdTech Visionary' }, { icon: '🏆', text: '2,500+ Students Helped' }, { icon: '🗺️', text: '50+ Cities Served' }].map(tag => (
                  <span key={tag.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', background: '#F8F7FF', border: '1.5px solid #E0E7FF', fontSize: '13px', fontWeight: 600, color: '#4F46E5' }}>
                    {tag.icon} {tag.text}
                  </span>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ FAQ */}
      <section className="mesh-bg" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, color: '#0F0E1A', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { q: 'What is GraduateNex?', a: 'An academic success platform providing production-ready final year project source code, AI-powered resume tools, documentation generators, and research paper assistance for students across India.' },
              { q: 'Are the projects plagiarism-free?', a: 'Yes. Every project and document we deliver is crafted to be original. We use internal plagiarism screening tools to ensure the content meets academic integrity standards.' },
              { q: 'How are products delivered?', a: 'All digital products are delivered instantly after payment via secure download links on the order confirmation page and through your registered email address.' },
              { q: 'What payment methods do you accept?', a: 'We accept UPI, Debit/Credit Cards, Net Banking, and Wallets through Razorpay — a PCI-DSS compliant, bank-grade secure payment gateway.' },
              { q: 'Can I get a refund?', a: "Digital products are generally non-refundable once delivered. However, refunds are issued for technical payment failures, undelivered products, and custom projects that don't meet agreed specifications." },
              { q: 'Do you offer support after purchase?', a: 'Yes. We provide post-purchase technical support for setup, deployment, and viva preparation. Our team is available Monday–Friday, 9AM–6PM IST.' },
            ].map(f => (
              <div key={f.q} className="card-surface" style={{ padding: '24px', background: 'white' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>{f.q}</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ TRUST */}
      <section style={{ background: 'white', borderTop: '1px solid #F3F4F6', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>
          {[
            { icon: <Shield size={24} color="#10B981" />, title: 'Secure Payments', sub: '256-bit SSL Encryption' },
            { icon: <CreditCard size={24} color="#3B82F6" />, title: 'Powered by Razorpay', sub: 'PCI-DSS Compliant' },
            { icon: <CheckCircle size={24} color="#4F46E5" />, title: '2,500+ Orders', sub: 'Delivered Successfully' },
            { icon: <Phone size={24} color="#7C3AED" />, title: 'Dedicated Support', sub: 'Mon–Fri, 9AM–6PM IST' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {item.icon}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ CTA */}
      <section className="cta-section" style={{ padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle depth layers */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: 700, padding: '6px 16px', borderRadius: '100px', marginBottom: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Zap size={12} fill="white" /> Join 2,500+ Students
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px' }}>
            Your Final Year Project is<br />One Click Away.
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.8)', marginBottom: '36px', lineHeight: 1.7 }}>
            Join students who have already secured top grades, submitted original documentation, and advanced their careers using GraduateNex.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login">
              <button style={{ height: '56px', padding: '0 32px', background: 'white', color: '#4F46E5', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 14px 40px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}>
                Get Started — It&apos;s Free <ArrowRight size={18} />
              </button>
            </Link>
            <a href="tel:+917981994870">
              <button style={{ height: '56px', padding: '0 28px', background: 'rgba(255,255,255,0.12)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}>
                <Phone size={16} /> Call Us Now
              </button>
            </a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '28px' }}>
            📞 +91 79819 94870 &nbsp;|&nbsp; ✉️ support@graduatenex.online &nbsp;|&nbsp; 📍 T Hub, Hyderabad
          </p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'What is GraduateNex?', acceptedAnswer: { '@type': 'Answer', text: 'GraduateNex is an academic success platform providing production-ready final year project source code, AI-powered resume tools, documentation generators, and research paper assistance for students across India.' } }] }) }} />
    </div>
  );
}
