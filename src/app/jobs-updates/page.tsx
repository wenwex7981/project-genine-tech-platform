'use client';
import { useState, useEffect, useCallback } from 'react';

// ── Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  role_category: string;
  description: string;
  url: string;
  salary: string;
  source: string;
  posted_at: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  author: string;
  published_at: string;
  tags: string[];
  cover_image: string;
  reactions: number;
}

// ── Constants
const ROLE_FILTERS = [
  { key: 'all',       label: 'All Roles',     icon: '💼' },
  { key: 'ai-ml',     label: 'AI / ML',       icon: '🤖' },
  { key: 'fullstack', label: 'Full Stack',    icon: '⚡' },
  { key: 'frontend',  label: 'Frontend',      icon: '🎨' },
  { key: 'backend',   label: 'Backend',       icon: '🔧' },
  { key: 'mobile',    label: 'Mobile',        icon: '📱' },
  { key: 'devops',    label: 'DevOps / Cloud',icon: '☁️' },
  { key: 'data',      label: 'Data Science',  icon: '📊' },
  { key: 'design',    label: 'Design',        icon: '✏️' },
  { key: 'software',  label: 'Software Eng',  icon: '💻' },
];

const TYPE_FILTERS = [
  { key: 'all',        label: 'All Types'   },
  { key: 'full-time',  label: 'Full-Time'   },
  { key: 'internship', label: 'Internship'  },
  { key: 'contract',   label: 'Contract'    },
];

const SOURCE_ICONS: Record<string, string> = {
  remotive:    '🌐',
  arbeitnow:   '🌍',
  linkedin:    '💼',
  naukri:      '🇮🇳',
  'dev.to':    '📰',
  hackernews:  '🔶',
  devto:       '📰',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function roleBadgeColor(role: string) {
  const map: Record<string, string> = {
    'ai-ml':     '#7C3AED',
    'frontend':  '#2563EB',
    'backend':   '#059669',
    'fullstack': '#D97706',
    'mobile':    '#DB2777',
    'devops':    '#0891B2',
    'data':      '#7C3AED',
    'design':    '#EC4899',
    'software':  '#4B5563',
  };
  return map[role] || '#4B5563';
}

function CompanyAvatar({ company }: { company: string }) {
  const letter = (company || 'C')[0].toUpperCase();
  const colors = ['#6C63FF','#10B981','#F59E0B','#EF4444','#3B82F6','#8B5CF6','#EC4899','#06B6D4'];
  const color  = colors[letter.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 12, background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 900, fontSize: 18, color: 'white', flexShrink: 0,
    }}>
      {letter}
    </div>
  );
}

// ── Job Card
function JobCard({ job }: { job: Job }) {
  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: 'white', borderRadius: 16, padding: '16px 18px',
        border: '1.5px solid #f0f0f5', display: 'flex', gap: 14,
        alignItems: 'flex-start', transition: 'all 0.2s', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#6C63FF';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(108,99,255,0.12)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#f0f0f5';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }}
      >
        <CompanyAvatar company={job.company} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', lineHeight: 1.3 }}>{job.title}</div>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
              background: roleBadgeColor(job.role_category) + '15',
              color: roleBadgeColor(job.role_category), whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {ROLE_FILTERS.find(r => r.key === job.role_category)?.icon} {job.role_category.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: 500 }}>{job.company}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 3 }}>
              📍 {job.location}
            </span>
            {job.salary && (
              <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>💰 {job.salary}</span>
            )}
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
              background: job.job_type === 'internship' ? '#FEF3C7' : '#EDE9FE',
              color: job.job_type === 'internship' ? '#92400E' : '#4C1D95',
            }}>
              {job.job_type}
            </span>
            <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 'auto' }}>
              {SOURCE_ICONS[job.source] || '🔗'} {timeAgo(job.posted_at)}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ── News Card
function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', borderRadius: 16, overflow: 'hidden',
        border: '1.5px solid #f0f0f5', transition: 'all 0.2s', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#6C63FF';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(108,99,255,0.12)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#f0f0f5';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        }}
      >
        {item.cover_image && (
          <img src={item.cover_image} alt={item.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
        )}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.4, marginBottom: 6 }}>
            {item.title}
          </div>
          {item.summary && (
            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, marginBottom: 8,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.summary}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(item.tags || []).slice(0, 3).map(tag => (
                <span key={tag} style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 20,
                  background: '#EDE9FE', color: '#4C1D95', fontWeight: 600,
                }}>#{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {item.reactions > 0 && (
                <span style={{ fontSize: 11, color: '#EF4444' }}>❤️ {item.reactions}</span>
              )}
              <span style={{ fontSize: 10, color: '#9ca3af' }}>
                {SOURCE_ICONS[item.source] || '🔗'} {timeAgo(item.published_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

// ── MAIN PAGE
export default function JobsUpdatesPage() {
  const [activeTab, setActiveTab]       = useState<'jobs' | 'internships' | 'news'>('jobs');
  const [roleFilter, setRoleFilter]     = useState('all');
  const [jobs, setJobs]                 = useState<Job[]>([]);
  const [news, setNews]                 = useState<NewsItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [lastUpdated, setLastUpdated]   = useState<Date | null>(null);
  const [totalCount, setTotalCount]     = useState(0);
  const [page, setPage]                 = useState(1);
  const [searchQuery, setSearchQuery]   = useState('');

  const fetchData = useCallback(async (tab: string, role: string, pg: number) => {
    setLoading(true);
    try {
      if (tab === 'news') {
        const res  = await fetch(`/api/jobs-feed?type=news&page=${pg}&limit=24`);
        const data = await res.json();
        setNews(data.data || []);
        setTotalCount(data.count || 0);
      } else {
        const jobType = tab === 'internships' ? 'internship' : 'all';
        const params  = new URLSearchParams({ type: 'jobs', job_type: jobType, page: String(pg), limit: '30' });
        if (role !== 'all') params.set('role', role);
        const res  = await fetch(`/api/jobs-feed?${params}`);
        const data = await res.json();
        setJobs(data.data || []);
        setTotalCount(data.count || 0);
      }
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchData(activeTab, roleFilter, 1);
  }, [activeTab, roleFilter, fetchData]);

  useEffect(() => {
    if (page > 1) fetchData(activeTab, roleFilter, page);
  }, [page, activeTab, roleFilter, fetchData]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const iv = setInterval(() => fetchData(activeTab, roleFilter, page), 10 * 60 * 1000);
    return () => clearInterval(iv);
  }, [activeTab, roleFilter, page, fetchData]);

  const displayedJobs = jobs.filter(j => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
  });

  const displayedNews = news.filter(n => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || (n.summary || '').toLowerCase().includes(q);
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf4ff 100%)', paddingTop: 80 }}>

      {/* ── HERO HEADER */}
      <div style={{ textAlign: 'center', padding: '40px 24px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
          background: 'white', borderRadius: 100, border: '1.5px solid #e5e7eb',
          fontSize: 12, fontWeight: 700, color: '#6C63FF', marginBottom: 16,
          boxShadow: '0 2px 8px rgba(108,99,255,0.08)',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite', display: 'inline-block' }} />
          Live — Updated every hour automatically
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#1a1a2e', lineHeight: 1.15, marginBottom: 12 }}>
          🔥 Fresh Jobs, Internships &<br />
          <span style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Updates Daily
          </span>
        </h1>
        <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Curated from 10+ sources. Only posts from the last 48 hours. No spam, no old listings — ever.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          {[
            { icon: '💼', label: 'Fresh Jobs',      color: '#6C63FF' },
            { icon: '🎓', label: 'Internships',     color: '#10B981' },
            { icon: '🤖', label: 'AI Updates',      color: '#F59E0B' },
            { icon: '🔄', label: 'Updated Hourly',  color: '#EF4444' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>{s.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* Search + Tabs row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 500 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              type="text"
              placeholder="Search roles, companies, skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px 12px 40px',
                border: '1.5px solid #e5e7eb', borderRadius: 12, fontSize: 14,
                outline: 'none', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onFocus={e => (e.target.style.borderColor = '#6C63FF')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, background: 'white', borderRadius: 12, padding: 4, border: '1.5px solid #e5e7eb' }}>
              {[
                { key: 'jobs',        label: '💼 Jobs'        },
                { key: 'internships', label: '🎓 Internships' },
                { key: 'news',        label: '🤖 AI Updates'  },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                    background: activeTab === tab.key ? 'linear-gradient(135deg, #6C63FF, #8B5CF6)' : 'transparent',
                    color:      activeTab === tab.key ? 'white' : '#6b7280',
                    boxShadow:  activeTab === tab.key ? '0 4px 12px rgba(108,99,255,0.3)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Last updated + refresh */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {lastUpdated && (
                <span style={{ fontSize: 12, color: '#9ca3af' }}>
                  🔄 {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button
                onClick={() => fetchData(activeTab, roleFilter, page)}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                  background: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#6C63FF',
                }}
              >
                ↻ Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Role filter chips — only for Jobs/Internships */}
        {activeTab !== 'news' && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {ROLE_FILTERS.map(r => (
              <button
                key={r.key}
                onClick={() => setRoleFilter(r.key)}
                style={{
                  padding: '7px 14px', borderRadius: 100, border: '1.5px solid',
                  borderColor:  roleFilter === r.key ? '#6C63FF' : '#e5e7eb',
                  background:   roleFilter === r.key ? '#EDE9FE' : 'white',
                  color:        roleFilter === r.key ? '#4C1D95' : '#374151',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        )}

        {/* Count badge */}
        <div style={{ marginBottom: 16, fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
          {loading
            ? '⏳ Loading fresh data...'
            : `Showing ${activeTab === 'news' ? displayedNews.length : displayedJobs.length} results ${totalCount > 0 ? `of ${totalCount}` : ''} — Last 48 hours only`
          }
        </div>

        {/* ── LOADING STATE */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 16, padding: 18, height: 100,
                border: '1.5px solid #f0f0f5', animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        )}

        {/* ── EMPTY STATE */}
        {!loading && (activeTab === 'news' ? displayedNews.length : displayedJobs.length) === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>No fresh data yet</div>
            <div style={{ fontSize: 14, color: '#6b7280', maxWidth: 400, margin: '0 auto' }}>
              Install the GraduateNex Job Crawler Chrome Extension and click "Crawl Now" to fetch the latest jobs and news.
            </div>
          </div>
        )}

        {/* ── JOBS GRID */}
        {!loading && activeTab !== 'news' && displayedJobs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {displayedJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}

        {/* ── NEWS GRID */}
        {!loading && activeTab === 'news' && displayedNews.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {displayedNews.map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        )}

        {/* ── PAGINATION */}
        {!loading && totalCount > 30 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 32 }}>
            {page > 1 && (
              <button onClick={() => setPage(p => p - 1)} style={{
                padding: '10px 24px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#374151',
              }}>← Prev</button>
            )}
            <span style={{ padding: '10px 18px', background: 'white', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
              Page {page}
            </span>
            {displayedJobs.length === 30 || displayedNews.length === 24 ? (
              <button onClick={() => setPage(p => p + 1)} style={{
                padding: '10px 24px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', color: 'white',
                cursor: 'pointer', fontWeight: 700, fontSize: 13,
              }}>Next →</button>
            ) : null}
          </div>
        )}

        {/* ── CTA Banner */}
        <div style={{
          marginTop: 60, borderRadius: 24, padding: '40px 32px', textAlign: 'center',
          background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)',
          boxShadow: '0 20px 60px rgba(108,99,255,0.25)',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 10 }}>
            Ready to Apply? Build a Winning Resume First!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 24, fontSize: 15 }}>
            GraduateNex ATS Resume Builder — 17-point scoring, JD match analyzer, instant export.
            Used by 2,500+ students to crack TCS, Infosys, Wipro & more.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/resume" style={{
              padding: '12px 28px', borderRadius: 12, background: 'white',
              color: '#6C63FF', fontWeight: 800, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}>
              Build My ATS Resume →
            </a>
            <a href="/projects" style={{
              padding: '12px 28px', borderRadius: 12,
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              color: 'white', fontWeight: 800, fontSize: 14, textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.3)',
            }}>
              Browse Final Year Projects
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer {
          0%   { background: #f9fafb; }
          50%  { background: #f3f4f6; }
          100% { background: #f9fafb; }
        }
      `}</style>
    </div>
  );
}
