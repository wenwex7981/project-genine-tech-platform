"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Users,
  Inbox,
  PenTool,
  GraduationCap,
  Plus,
  ArrowRight,
  Loader2,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    hackathons: 0,
    customRequests: 0,
    resumeTemplates: 0,
    communityResumes: 0,
  });

  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Fetch KPI counts
        const [
          { count: projectsCount },
          { count: blogsCount },
          { count: customRequestsCount },
          { count: resumeTemplatesCount },
          { count: communityResumesCount },
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("blogs").select("*", { count: "exact", head: true }).eq("published", true),
          supabase.from("custom_requests").select("*", { count: "exact", head: true }),
          supabase.from("resume_templates").select("*", { count: "exact", head: true }),
          supabase.from("community_resumes").select("*", { count: "exact", head: true }),
        ]);

        // Handle hackathons logic
        let hackathonsCount = 0;
        const { count: hv2Count, error: hv2Error } = await supabase
          .from("hackathons_v2")
          .select("*", { count: "exact", head: true });
        
        if (!hv2Error && hv2Count !== null) {
          hackathonsCount = hv2Count;
        } else {
          const { count: hCount } = await supabase
            .from("hackathons")
            .select("*", { count: "exact", head: true });
          hackathonsCount = hCount || 0;
        }

        setStats({
          projects: projectsCount || 0,
          blogPosts: blogsCount || 0,
          hackathons: hackathonsCount,
          customRequests: customRequestsCount || 0,
          resumeTemplates: resumeTemplatesCount || 0,
          communityResumes: communityResumesCount || 0,
        });

        // Fetch Recent Activity
        const { data: requestsData } = await supabase
          .from("custom_requests")
          .select("id, name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: blogsData } = await supabase
          .from("blogs")
          .select("id, title, published, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        setRecentRequests(requestsData || []);
        setRecentBlogs(blogsData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  const kpis = [
    { label: "Total Projects", value: stats.projects, icon: FolderGit2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Published Blogs", value: stats.blogPosts, icon: FileText, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Hackathons", value: stats.hackathons, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Custom Requests", value: stats.customRequests, icon: Inbox, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Resume Templates", value: stats.resumeTemplates, icon: PenTool, color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Community Resumes", value: stats.communityResumes, icon: Users, color: "text-teal-500", bg: "bg-teal-500/10" },
  ];

  const quickActions = [
    { label: "New Project", href: "/admin/projects/new", icon: Plus, desc: "Add a new portfolio project" },
    { label: "New Blog Post", href: "/admin/blog/new", icon: Plus, desc: "Write and publish a new article" },
    { label: "New Resume Template", href: "/admin/resumes/new", icon: Plus, desc: "Create a new ATS resume template" },
    { label: "New Study Material", href: "/admin/study/new", icon: Plus, desc: "Upload educational resources" },
    { label: "View All Requests", href: "/admin/requests", icon: ArrowRight, desc: "Manage client custom requests" },
    { label: "View Blog Manager", href: "/admin/blog", icon: ArrowRight, desc: "Manage all blog posts" },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-blue-500" />
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Welcome back. Here's what's happening with your platform today.</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <div>
              <p className="text-gray-400 font-medium text-sm mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} href={action.href}>
              <div className="flex items-center p-4 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors group">
                <div className="flex-1">
                  <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    {action.label}
                  </h4>
                  <p className="text-gray-500 text-sm mt-1">{action.desc}</p>
                </div>
                <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Requests */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-orange-500" />
              Recent Requests
            </h3>
            <Link href="/admin/requests" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {recentRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No recent requests</div>
            ) : (
              recentRequests.map((req) => (
                <div key={req.id} className="p-4 hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{req.name}</p>
                    <p className="text-gray-400 text-sm">{req.email}</p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(req.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              Recent Blog Posts
            </h3>
            <Link href="/admin/blog" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {recentBlogs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No recent blogs</div>
            ) : (
              recentBlogs.map((blog) => (
                <div key={blog.id} className="p-4 hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <p className="text-white font-medium truncate">{blog.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${blog.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm gap-1 flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
