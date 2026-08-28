'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, GraduationCap, Sparkles, Clock, Search, MapPin, 
  Banknote, Link as LinkIcon, Heart, Filter, ChevronLeft, ChevronRight,
  TrendingUp, Globe, Code, Database, Palette, Smartphone, Cloud, Bot
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

function CompanyAvatar({ company }: { company: string }) {
  const letter = (company || 'C')[0].toUpperCase();
  const colors = [
    'from-indigo-500 to-purple-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-red-500',
    'from-blue-400 to-indigo-500',
    'from-fuchsia-400 to-pink-500',
    'from-cyan-400 to-blue-500'
  ];
  const color = colors[letter.charCodeAt(0) % colors.length];
  
  return (
    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center font-black text-xl text-white shadow-lg shrink-0`}>
      {letter}
    </div>
  );
}

// ── Components
const JobCard = ({ job, index }: { job: Job, index: number }) => (
  <motion.a
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -4, scale: 1.01 }}
    href={job.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block group"
  >
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300">
      <div className="flex gap-5 items-start">
        <CompanyAvatar company={job.company} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {job.title}
            </h3>
            <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-500/20">
              {job.role_category.toUpperCase()}
            </span>
          </div>
          
          <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-4">
            {job.company}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span className="truncate max-w-[120px]">{job.location}</span>
            </span>
            
            {job.salary && (
              <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-500/20">
                <Banknote className="w-3.5 h-3.5" />
                {job.salary}
              </span>
            )}
            
            <span className={`px-2.5 py-1 rounded-md font-bold ${
              job.job_type === 'internship' 
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' 
                : 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
            }`}>
              {job.job_type}
            </span>
            
            <span className="flex items-center gap-1.5 ml-auto text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(job.posted_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.a>
);

const NewsCard = ({ item, index }: { item: NewsItem, index: number }) => (
  <motion.a
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -4, scale: 1.02 }}
    href={item.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 overflow-hidden group"
  >
    {item.cover_image && (
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={item.cover_image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    )}
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {item.title}
      </h3>
      
      {item.summary && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {item.summary}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
        <div className="flex gap-2 flex-wrap">
          {(item.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
          {item.reactions > 0 && (
            <span className="flex items-center gap-1 text-rose-500">
              <Heart className="w-3.5 h-3.5 fill-current" />
              {item.reactions}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(item.published_at)}
          </span>
        </div>
      </div>
    </div>
  </motion.a>
);

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 selection:bg-indigo-500/30">
      
      {/* ── HERO SECTION ── */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
        <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-8 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Live Updates • Refreshed every 10 mins
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tight mb-6 leading-[1.1]"
          >
            Curated Opportunities <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400">
              For Top Talent
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-12 font-medium"
          >
            Aggregated from 10+ premium sources. We filter out the noise so you only see high-quality roles and essential industry news from the last 48 hours.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8"
          >
            {[
              { icon: Briefcase, label: "Verified Jobs", color: "text-blue-500" },
              { icon: GraduationCap, label: "Premium Internships", color: "text-emerald-500" },
              { icon: Sparkles, label: "AI Intel", color: "text-purple-500" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                {stat.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* Navigation & Search Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
          {/* Custom Tabs */}
          <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 w-full lg:w-auto">
            {[
              { id: 'jobs', label: '💼 Jobs' },
              { id: 'internships', label: '🎓 Internships' },
              { id: 'news', label: '🤖 Tech Updates' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex-1 lg:flex-none px-6 py-3 text-sm font-bold rounded-xl transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 mix-blend-exclusion text-white">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search companies, roles, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Role Filters (Horizontal Scroll) */}
        <AnimatePresence>
          {activeTab !== 'news' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 mb-6"
            >
              {ROLE_FILTERS.map(role => (
                <button
                  key={role.key}
                  onClick={() => setRoleFilter(role.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold border transition-all ${
                    roleFilter === role.key 
                      ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-md' 
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <role.icon className={`w-4 h-4 ${roleFilter === role.key ? '' : 'opacity-70'}`} />
                  {role.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <div>
            {!loading && (
              <span>Showing {activeTab === 'news' ? displayedNews.length : displayedJobs.length} of {totalCount} results</span>
            )}
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <button onClick={() => fetchData(activeTab, roleFilter, page)} className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
                <TrendingUp className="w-4 h-4" /> Refresh Now
              </button>
            </div>
          )}
        </div>

        {/* ── CONTENT GRIDS ── */}
        
        {loading ? (
          // Skeleton Loading
          <div className={`grid gap-6 ${activeTab === 'news' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 h-40">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                      <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (activeTab === 'news' ? displayedNews.length : displayedJobs.length) === 0 ? (
          // Empty State
          <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-300 dark:border-zinc-800 shadow-sm">
            <Filter className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">No results found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              We couldn't find any fresh {activeTab} matching your criteria in the last 48 hours. Try adjusting your filters.
            </p>
          </div>
        ) : (
          // Data Grids
          <div className={`grid gap-5 ${activeTab === 'news' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
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
          <div className="flex justify-center items-center gap-4 mt-16">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)} 
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </button>
            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 px-4">
              Page {page}
            </span>
            <button 
              disabled={displayedJobs.length < 30 && displayedNews.length < 24}
              onClick={() => setPage(p => p + 1)} 
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </button>
          </div>
        )}

        {/* ── PREMIUM CTA BANNER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-32 relative rounded-[3rem] overflow-hidden bg-zinc-950 p-12 md:p-16 text-center border border-indigo-500/30 shadow-[0_0_80px_rgba(79,70,229,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/30 border border-white/10">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Don't just browse.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Dominate the ATS.</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-10 font-medium leading-relaxed">
              Found the perfect job above? Make sure your resume actually reaches human eyes. Our AI rewrites your resume specifically for the JD to bypass ATS filters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/resume" className="px-8 py-4 rounded-2xl bg-white text-zinc-950 font-black text-lg hover:bg-zinc-100 transition-colors shadow-xl">
                Build ATS Resume →
              </a>
              <a href="/projects" className="px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-lg hover:bg-zinc-800 transition-colors">
                Explore Projects
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
