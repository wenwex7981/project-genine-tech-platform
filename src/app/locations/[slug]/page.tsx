import { seoLocations } from '@/lib/seo-data';
import { notFound } from 'next/navigation';
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return seoLocations.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const location = seoLocations.find((l) => l.slug === params.slug);
  
  if (!location) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `Premium BTech & Final Year Projects in ${location.name} | GraduateNex`,
    description: `Get production-ready Mini & Major academic projects, zero-plagiarism documentation, and source code tailored for students in ${location.name}. Access ATS resumes and AI tools to land your dream job.`,
    alternates: {
      canonical: `https://www.graduatenex.online/locations/${location.slug}`,
    }
  };
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const location = seoLocations.find((l) => l.slug === params.slug);

  if (!location) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-b overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col justify-center space-y-8 items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-4 uppercase tracking-wider">
              Now Serving {location.name}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-foreground leading-tight">
              Elevate Your Academic Projects in <span className="text-primary">{location.name}</span>
            </h1>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
              Premium mini and major projects for students in {location.name}. 
              Includes source code, zero-plagiarism documentation, research papers, and AI-powered abstracts tailored for your university guidelines.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row mt-8">
              <Link href="/projects">
                <Button size="lg" className="gap-2 w-full sm:w-auto h-14 px-8 text-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl">
                  Browse All Projects <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/custom-requirements">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto h-14 px-8 text-md rounded-xl border-2">
                  Request Custom Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reused Content Section (Similar to homepage features) */}
      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-3xl">💻</div>
              <h3 className="text-xl font-bold mb-3">100+ Source Codes</h3>
              <p className="text-muted-foreground leading-relaxed">Ready-to-deploy projects in AI, ML, IoT, Web, and App Development.</p>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 text-3xl">📄</div>
              <h3 className="text-xl font-bold mb-3">Zero Plagiarism</h3>
              <p className="text-muted-foreground leading-relaxed">Professionally written SRS documents, architecture diagrams, and IEEE format papers.</p>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1">
              <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6 text-3xl">🚀</div>
              <h3 className="text-xl font-bold mb-3">ATS Resume Builder</h3>
              <p className="text-muted-foreground leading-relaxed">Land your dream job with FANG-level, ATS-friendly templates customized for your domain.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
