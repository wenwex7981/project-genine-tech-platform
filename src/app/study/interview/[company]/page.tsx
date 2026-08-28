import { seoLocations } from '@/lib/seo-data';
import { notFound } from 'next/navigation';
import Link from "next/link";
import { PlayCircle, Target, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const companies = seoLocations.filter(l => l.type === 'company');
  return companies.map((company) => ({
    company: company.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const comp = seoLocations.find((l) => l.slug === company && l.type === 'company');
  
  if (!comp) return { title: 'Not Found' };

  const title = `Crack the ${comp.name} Interview | Mock Interviews & Questions [2026]`;
  const desc = `Prepare for ${comp.name} campus placements. Practice with AI mock interviews, technical coding rounds, and previous year ${comp.name} HR interview questions.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `https://www.graduatenex.online/study/interview/${comp.slug}` },
    openGraph: { title, description: desc, url: `https://www.graduatenex.online/study/interview/${comp.slug}` },
  };
}

export default async function CompanyInterviewPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const comp = seoLocations.find((l) => l.slug === company && l.type === 'company');

  if (!comp) notFound();

  // JSON-LD Course / EducationalOccupationalProgram
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${comp.name} Interview Preparation Masterclass`,
    description: `Complete technical and HR interview preparation specifically tailored for ${comp.name} campus drives.`,
    provider: {
      '@type': 'Organization',
      name: 'GraduateNex',
      sameAs: 'https://www.graduatenex.online'
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="w-full py-16 md:py-24 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/study" className="hover:text-white">Study Hub</Link>
            <span>/</span>
            <span className="text-white/90 font-medium">{comp.name}</span>
          </nav>
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-6">
              <Target className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-100">Campus Placements 2026</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Crack the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">{comp.name}</span> Interview
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Don't leave your placement to chance. Practice with our AI Mock Interviewer tuned to ask the exact technical and HR questions asked by {comp.name} recruiters.
            </p>
            <div className="flex gap-4">
              <Link href="/study/interview-prep/mock-interview">
                <Button size="lg" className="h-14 px-8 text-md font-bold bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl shadow-lg">
                  <PlayCircle className="mr-2 h-5 w-5" /> Start Mock Interview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">What to expect in the {comp.name} process</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Online Coding & Aptitude Round</h4>
                    <p className="text-sm text-muted-foreground mt-1">Practice time-bound coding challenges and quantitative aptitude specifically tailored to {comp.name}'s platform.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Technical Interview</h4>
                    <p className="text-sm text-muted-foreground mt-1">Our AI asks deep-dive questions into your final year project, OOPs concepts, DBMS, and Data Structures.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 border rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
              <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
              <p className="text-muted-foreground mb-6">Our mock interviews simulate real {comp.name} panel members. Get instant feedback on your communication, confidence, and technical accuracy.</p>
              <Link href="/study/interview-prep/mock-interview">
                <Button className="w-full h-12 text-md font-bold">Launch {comp.name} Simulator</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
