import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Dynamically generate SEO Metadata for this specific blog post
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  
  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .eq("published", true)
    .single();

  if (!blog) {
    return {
      title: "Post Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = blog.image_url ? [blog.image_url, ...previousImages] : previousImages;

  return {
    title: `${blog.title} | GraduateNex`,
    description: blog.excerpt,
    keywords: blog.keywords,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.created_at,
      url: `https://www.graduatenex.online/blog/${blog.slug}`,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: ogImage,
    },
    alternates: {
      canonical: `https://www.graduatenex.online/blog/${blog.slug}`,
    }
  };
}

// Force dynamic rendering to ensure blogs reflect latest updates
export const dynamic = "force-dynamic";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .eq("published", true)
    .single();

  if (error || !blog) {
    notFound();
  }

  // Generate JSON-LD Structured Data for ultra-level Google Indexing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.image_url ? [blog.image_url] : [],
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: [{
      '@type': 'Organization',
      name: 'GraduateNex',
      url: 'https://www.graduatenex.online'
    }],
    publisher: {
      '@type': 'Organization',
      name: 'GraduateNex',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.graduatenex.online/icon.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.graduatenex.online/blog/${blog.slug}`
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.prose', 'article']
    }
  };

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950 pb-24">
      {/* Inject JSON-LD into the head securely */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to all articles
          </Link>
          
          <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Tag className="h-4 w-4" /> {blog.category || 'Tech'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
            {blog.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed font-medium">
            {blog.excerpt}
          </p>
        </div>
      </div>

      {/* Optional Featured Image */}
      {blog.image_url && (
        <div className="max-w-6xl mx-auto px-4 -mt-12 md:-mt-24 mb-16 relative z-10">
          <div className="aspect-[2/1] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border bg-muted">
            <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Main Markdown Content */}
      <div className={`max-w-3xl mx-auto px-4 ${!blog.image_url ? 'pt-16' : ''}`}>
        <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none text-left">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        <hr className="my-12 border-muted" />

        <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              G
            </div>
            <div>
              <div className="font-bold">GraduateNex Editorial</div>
              <div className="text-sm text-muted-foreground">Expert tech guidance and resources.</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
