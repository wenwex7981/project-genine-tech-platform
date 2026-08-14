"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminBlogNew() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    keywords: "",
    category: "Projects",
    image_url: "",
    published: false
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publishNow: boolean) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("blogs").insert([{
        ...formData,
        published: publishNow
      }]);

      if (error) {
        if (error.code === '23505') {
          alert("A blog post with this slug already exists. Please change the title or slug.");
        } else {
          throw error;
        }
      } else {
        router.push("/admin/blog");
      }
    } catch (error: any) {
      console.error("Error creating blog:", error);
      alert(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Write SEO Blog</h1>
          <p className="text-muted-foreground mt-1">Create high-ranking content.</p>
        </div>
      </div>

      <form className="space-y-8" onSubmit={(e) => handleSubmit(e, false)}>
        <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          
          {/* Title & Slug */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">H1 Blog Title <span className="text-red-500">*</span></label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Top 10 Best Final Year Projects in Hyderabad"
                className="w-full p-3 border rounded-lg bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all text-lg font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-muted-foreground">URL Slug</label>
              <div className="flex items-center border rounded-lg bg-muted/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <span className="px-3 text-muted-foreground border-r bg-muted">graduatenex.online/blog/</span>
                <input 
                  required
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full p-3 bg-transparent outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* SEO Meta */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border rounded-lg bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Projects">Projects & Ideas</option>
                <option value="AI">AI Services</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Resumes">Resumes & Careers</option>
                <option value="Updates">Platform Updates</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold">SEO Keywords (Comma separated)</label>
              <input 
                type="text" 
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="e.g., final year projects, btech projects hyderabad, cse projects"
                className="w-full p-3 border rounded-lg bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">Meta Description & Excerpt</label>
            <textarea 
              rows={2}
              required
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="A short, catchy summary containing your main keywords (150-160 characters best for Google)."
              className="w-full p-3 border rounded-lg bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold">OpenGraph Image URL (Optional)</label>
            <input 
              type="url" 
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://... (Image shown when link is shared on WhatsApp/LinkedIn)"
              className="w-full p-3 border rounded-lg bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          <hr />

          {/* Main Content */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Article Content (Markdown supported)</label>
            <div className="text-xs text-muted-foreground mb-2">
              Use Markdown: **bold**, # Heading 2, ## Heading 3, - lists, [links](url).
            </div>
            <textarea 
              required
              rows={15}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your ultra-level SEO content here..."
              className="w-full p-4 border rounded-lg bg-muted/10 outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
            />
          </div>

        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-background border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="text-sm text-muted-foreground hidden sm:block">
              Make sure to double check your URL slug before publishing.
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button type="button" variant="outline" className="flex-1 sm:flex-none gap-2" onClick={(e) => handleSubmit(e, false)} disabled={loading}>
                <Save className="h-4 w-4" /> Save as Draft
              </Button>
              <Button type="button" className="flex-1 sm:flex-none gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={(e) => handleSubmit(e, true)} disabled={loading}>
                <Globe className="h-4 w-4" /> Publish Now
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
