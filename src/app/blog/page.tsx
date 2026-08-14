import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GraduateNex Blog & Resources | Ultimate Tech Guides",
  description: "Read the latest guides on final year projects, data science, AI services, hackathons, and resume building from GraduateNex.",
};

// Next.js Revalidation - dynamically fetch at most every 60 seconds (for ISR SEO)
export const revalidate = 60;

export default async function BlogIndex() {
  // Fetch published blogs from Supabase
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, category, created_at, image_url")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 py-24 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">GraduateNex Resources</h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-medium">
          Ultimate guides to final year projects, hackathons, resumes, and the future of AI.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {(!blogs || blogs.length === 0) ? (
          <div className="text-center py-20 text-muted-foreground">
            No blog posts published yet. Check back soon!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group flex flex-col bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {blog.image_url ? (
                  <div className="h-48 w-full overflow-hidden bg-muted">
                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center">
                    <span className="text-indigo-300 dark:text-indigo-800 font-bold text-4xl">GN</span>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <Tag className="h-3 w-3" /> {blog.category || 'Tech'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-auto">
                    Read Article <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
