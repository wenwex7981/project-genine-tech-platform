import { seoLocations } from '@/lib/seo-data';
import { notFound } from 'next/navigation';
import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const roles = seoLocations.filter(l => l.type === 'role');
  return roles.map((role) => ({
    slug: role.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = seoLocations.find((l) => l.slug === slug && l.type === 'role');
  
  if (!role) return { title: 'Not Found' };

  const title = `Best ATS Resume Builder for ${role.name} [2026] — GraduateNex`;
  const desc = `Build a high-scoring ATS-friendly resume for ${role.name} positions. Use AI to match job descriptions, fix grammar, and get 20+ action verbs customized for ${role.name}.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `https://www.graduatenex.online/resume/role/${role.slug}` },
    openGraph: { title, description: desc, url: `https://www.graduatenex.online/resume/role/${role.slug}` },
  };
}

export default async function RoleResumePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = seoLocations.find((l) => l.slug === slug && l.type === 'role');

  if (!role) notFound();

  // JSON-LD SoftwareApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `GraduateNex Resume Builder for ${role.name}`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    },
    description: `AI-powered ATS Resume builder specifically optimized for ${role.name} roles.`
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/resume" className="hover:text-white">Resume Hub</Link>
            <span>/</span>
            <span className="text-white/90 font-medium">{role.name}</span>
          </nav>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Create the Perfect <span className="text-emerald-400">{role.name}</span> Resume
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Tailor your resume specifically for {role.name} positions. Our AI scans your resume against real {role.name} job descriptions, highlighting missing keywords and formatting issues that ATS bots flag.
            </p>
            <div className="flex gap-4">
              <Link href="/resume">
                <Button size="lg" className="h-14 px-8 text-md font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg">
                  <Upload className="mr-2 h-5 w-5" /> Upload Current Resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">How to build a winning {role.name} Resume</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Include {role.name} Keywords</h3>
              <p className="text-muted-foreground">ATS systems filter out resumes that lack core skills. Our tool identifies the top 20 hard skills recruiters look for in a {role.name}.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm">
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quantify Your Impact</h3>
              <p className="text-muted-foreground">Don't just list duties. Our AI rewrite tool helps you add metrics (e.g., "improved performance by X%") to your {role.name} experiences.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm">
              <div className="h-12 w-12 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-xl flex items-center justify-center mb-6">
                <ArrowRight className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">ATS-Friendly Formatting</h3>
              <p className="text-muted-foreground">Complex layouts break ATS parsers. We enforce single-column, standard fonts so your {role.name} application actually reaches a human.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
