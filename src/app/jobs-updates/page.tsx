'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, GraduationCap, Sparkles, Clock, Search, MapPin, 
  Banknote, Heart, ChevronLeft, ChevronRight,
  TrendingUp, Globe, Code, Database, Palette, Smartphone, Cloud, Bot,
  ArrowUpRight, RefreshCw, SlidersHorizontal, Bookmark, Building2, Zap
} from 'lucide-react';

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
  { key: 'all',       label: 'All Roles',     icon: Briefcase },
  { key: 'ai-ml',     label: 'AI / ML',       icon: Bot },
  { key: 'fullstack', label: 'Full Stack',    icon: Globe },
  { key: 'frontend',  label: 'Frontend',      icon: Palette },
  { key: 'backend',   label: 'Backend',       icon: Code },
  { key: 'mobile',    label: 'Mobile',        icon: Smartphone },
  { key: 'devops',    label: 'DevOps / Cloud',icon: Cloud },
  { key: 'data',      label: 'Data Science',  icon: Database },
  { key: 'software',  label: 'Software Eng',  icon: Code },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Company Logo Component (uses Clearbit/fallback)
function CompanyLogo({ company }: { company: string }) {
  const letter = (company || 'C')[0].toUpperCase();
  const palette = [
    { bg: '#FEF3C7', text: '#92400E' },
    { bg: '#DBEAFE', text: '#1E40AF' },
    { bg: '#FCE7F3', text: '#9D174D' },
    { bg: '#D1FAE5', text: '#065F46' },
    { bg: '#EDE9FE', text: '#5B21B6' },
    { bg: '#FEE2E2', text: '#991B1B' },
    { bg: '#E0E7FF', text: '#3730A3' },
  ];
  const style = palette[letter.charCodeAt(0) % palette.length];
  
  return (
    <div 
      className="w-14 h-14 rounded-[18px] flex items-center justify-center font-black text-xl shrink-0"
      style={{ backgroundColor: style.bg, color: style.text, letterSpacing: '-0.02em' }}
    >
      {letter}
    </div>
  );
}

// ── Job Card
const JobCard = ({ job, index }: { job: Job, index: number }) => (
  <motion.a
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    href={job.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block group"
  >
    <div className="bg-white rounded-2xl px-6 py-5 border border-stone-200/80 hover:border-amber-300 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
      {/* Subtle left accent */}
      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex gap-4 items-start">
        <CompanyLogo company={job.company} />
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="text-[16px] font-bold text-stone-900 leading-snug group-hover:text-amber-800 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 transition-colors shrink-0 mt-0.5" />
          </div>
          
          {/* Company name */}
          <p className="text-sm font-semibold text-stone-500 mb-3">{job.company}</p>
          
          {/* Metadata pills */}
          <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium">
            <span className="flex items-center gap-1.5 text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span className="truncate max-w-[140px]">{job.location}</span>
            </span>
            
            {job.salary && (
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <Banknote className="w-3.5 h-3.5" />
                {job.salary}
              </span>
            )}
            
            <span className={`px-3 py-1.5 rounded-lg font-bold ${
              job.job_type === 'internship' 
                ? 'bg-violet-50 text-violet-700' 
                : 'bg-blue-50 text-blue-700'
            }`}>
              {job.job_type}
            </span>

            <span className="flex items-center gap-1.5 text-stone-400 bg-stone-50 px-3 py-1.5 rounded-lg text-xs">
              <Clock className="w-3 h-3" />
              {timeAgo(job.posted_at)}
            </span>

            {job.role_category && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 uppercase tracking-wider">
                {job.role_category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </motion.a>
);

// ── News Card
const NewsCard = ({ item, index }: { item: NewsItem, index: number }) => (
  <motion.a
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    href={item.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col bg-white rounded-2xl border border-stone-200/80 hover:border-amber-300 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden group"
  >
    {item.cover_image && (
      <div className="relative h-44 w-full overflow-hidden bg-stone-100">
        <img 
          src={item.cover_image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Bookmark className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
        </div>
      </div>
    )}
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-[15px] font-bold text-stone-900 mb-2 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
        {item.title}
      </h3>
      
      {item.summary && (
        <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {item.summary}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
        <div className="flex gap-1.5 flex-wrap">
          {(item.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-stone-50 text-stone-500 rounded-md">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-stone-400">
          {item.reactions > 0 && (
            <span className="flex items-center gap-1 text-rose-400">
              <Heart className="w-3.5 h-3.5 fill-current" />
              {item.reactions}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(item.published_at)}
          </span>
        </div>
      </div>
    </div>
  </motion.a>
);

// ── Skeleton Loader
function SkeletonCard({ isNews }: { isNews: boolean }) {
  return (
    <div className={`animate-pulse bg-white rounded-2xl border border-stone-100 ${isNews ? '' : 'px-6 py-5'}`}>
      {isNews && <div className="h-44 bg-stone-100 rounded-t-2xl" />}
      <div className={isNews ? 'p-5' : ''}>
        <div className="flex gap-4">
          {!isNews && <div className="w-14 h-14 rounded-[18px] bg-stone-100 shrink-0" />}
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-stone-100 rounded-lg w-3/4" />
            <div className="h-3 bg-stone-100 rounded-lg w-1/2" />
            <div className="flex gap-2 pt-1">
              <div className="h-7 w-20 bg-stone-100 rounded-lg" />
              <div className="h-7 w-28 bg-stone-100 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page
export default function JobsUpdatesPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships' | 'news'>('jobs');
  const [roleFilter, setRoleFilter] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async (tab: string, role: string, pg: number) => {
    setLoading(true);
    try {
      if (tab === 'news') {
        const res = await fetch(`/api/jobs-feed?type=news&page=${pg}&limit=24`);
        const data = await res.json();
        setNews(data.data || []);
        setTotalCount(data.count || 0);
      } else {
        const jobType = tab === 'internships' ? 'internship' : 'all';
        const params = new URLSearchParams({ type: 'jobs', job_type: jobType, page: String(pg), limit: '30' });
        if (role !== 'all') params.set('role', role);
        const res = await fetch(`/api/jobs-feed?${params}`);
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

  const tabConfig = [
    { id: 'jobs' as const, label: 'Full-Time Roles', icon: Briefcase, count: activeTab === 'jobs' ? totalCount : null },
    { id: 'internships' as const, label: 'Internships', icon: GraduationCap, count: activeTab === 'internships' ? totalCount : null },
    { id: 'news' as const, label: 'Industry Intel', icon: Zap, count: activeTab === 'news' ? totalCount : null },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── HERO ── */}
      <section className="relative bg-white border-b border-stone-200/70">
        {/* Subtle warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-rose-50/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-16 relative z-10">
          {/* Live badge */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Live — Updated every 10 minutes</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] mb-5"
          >
            Opportunities, <br className="hidden sm:block" />
            <span className="text-amber-600">curated for you.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-stone-500 max-w-xl leading-relaxed mb-10"
          >
            Handpicked roles and internships from 10+ premium sources. 
            Zero noise, only high-quality opportunities from the last 48 hours.
          </motion.p>
          
          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: Building2, text: "500+ Companies", color: "text-amber-600" },
              { icon: TrendingUp, text: "Real-time Feeds", color: "text-emerald-600" },
              { icon: Sparkles, text: "AI-Curated", color: "text-violet-600" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-center">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-sm font-semibold text-stone-600">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* ── Tab Navigation ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8">
          <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-stone-200/80 shadow-sm w-full lg:w-auto">
            {tabConfig.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-stone-900 text-white shadow-md' 
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search roles, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200/80 rounded-xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300 transition-all text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* ── Role Filters ── */}
        <AnimatePresence>
          {activeTab !== 'news' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Filter by role</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {ROLE_FILTERS.map(role => (
                  <button
                    key={role.key}
                    onClick={() => setRoleFilter(role.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-semibold border transition-all duration-200 ${
                      roleFilter === role.key 
                        ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm' 
                        : 'bg-white text-stone-500 border-stone-200/80 hover:bg-stone-50 hover:text-stone-700'
                    }`}
                  >
                    <role.icon className={`w-3.5 h-3.5 ${roleFilter === role.key ? 'text-amber-600' : 'text-stone-400'}`} />
                    {role.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stats Row ── */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="text-sm font-medium text-stone-400">
            {!loading && (
              <span>
                <span className="text-stone-700 font-bold">{activeTab === 'news' ? displayedNews.length : displayedJobs.length}</span> of {totalCount} results
              </span>
            )}
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs text-stone-400">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button 
                onClick={() => fetchData(activeTab, roleFilter, page)} 
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div className={`grid gap-4 ${activeTab === 'news' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} isNews={activeTab === 'news'} />
            ))}
          </div>
        ) : (activeTab === 'news' ? displayedNews.length : displayedJobs.length) === 0 ? (
          <div className="text-center py-28 bg-white rounded-2xl border border-dashed border-stone-200 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center mx-auto mb-5">
              <Search className="w-7 h-7 text-stone-300" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">No results found</h3>
            <p className="text-stone-500 max-w-sm mx-auto text-sm leading-relaxed">
              We couldn&apos;t find any fresh {activeTab} matching your criteria in the last 48 hours. Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className={`grid gap-4 ${activeTab === 'news' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl'}`}>
            <AnimatePresence>
              {activeTab !== 'news' 
                ? displayedJobs.map((job, idx) => <JobCard key={job.id} job={job} index={idx} />)
                : displayedNews.map((item, idx) => <NewsCard key={item.id} item={item} index={idx} />)
              }
            </AnimatePresence>
          </div>
        )}

        {/* ── PAGINATION ── */}
        {!loading && totalCount > 30 && (
          <div className="flex justify-center items-center gap-3 mt-14">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)} 
              className="w-11 h-11 rounded-xl border border-stone-200/80 bg-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-stone-600" />
            </button>
            <span className="text-sm font-bold text-stone-500 px-4 py-2 bg-white rounded-xl border border-stone-200/80 shadow-sm min-w-[100px] text-center">
              Page {page}
            </span>
            <button 
              disabled={displayedJobs.length < 30 && displayedNews.length < 24}
              onClick={() => setPage(p => p + 1)} 
              className="w-11 h-11 rounded-xl border border-stone-200/80 bg-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        )}

        {/* ── CTA BANNER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-24 relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-10 md:p-14 border border-amber-200/60"
        >
          {/* Decorative shapes */}
          <div className="absolute top-6 right-8 w-24 h-24 rounded-full border-2 border-amber-200/40 pointer-events-none" />
          <div className="absolute bottom-8 right-24 w-12 h-12 rounded-full border-2 border-rose-200/40 pointer-events-none" />
          <div className="absolute top-12 left-8 w-8 h-8 rounded-lg border-2 border-amber-200/50 rotate-12 pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            <div className="w-14 h-14 rounded-2xl bg-white border border-amber-200 flex items-center justify-center mb-6 shadow-sm">
              <Sparkles className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-4 tracking-tight leading-[1.15]">
              Found the right role?<br />
              <span className="text-amber-700">Make your resume match.</span>
            </h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Our AI rewrites your resume specifically for the job description to bypass ATS filters. 
              Get more callbacks, land more interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/resume" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-colors shadow-lg">
                Build ATS Resume
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a href="/projects" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-stone-700 font-bold text-sm border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm">
                Explore Projects
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
