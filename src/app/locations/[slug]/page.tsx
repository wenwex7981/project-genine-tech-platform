import { seoLocations } from '@/lib/seo-data';
import { notFound } from 'next/navigation';
import Link from "next/link";
import { ArrowRight, CheckCircle, GraduationCap, Code, FileText, Briefcase, Star, MapPin, Users, BookOpen, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export async function generateStaticParams() {
  return seoLocations.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = seoLocations.find((l) => l.slug === slug);
  
  if (!location) {
    return { title: 'Not Found' };
  }

  const titleMap: Record<string, string> = {
    state: `Best Final Year Projects & Resume Builder in ${location.name} [2026] — GraduateNex`,
    city: `Final Year CSE Projects in ${location.name} with Source Code [2026] — GraduateNex`,
    university: `${location.name} Final Year Project Ideas & Source Code [2026] — GraduateNex`,
  };

  const descMap: Record<string, string> = {
    state: `Get production-ready BTech & MTech final year projects with full source code for students in ${location.name}. Zero-plagiarism documentation, research papers, AI resume builder, and hackathon listings. Trusted by 2,500+ students.`,
    city: `Download 100+ final year projects for CSE, IT, ECE students in ${location.name}. Includes source code, IEEE format research papers, SRS documents, and free ATS resume checker. Same-day delivery.`,
    university: `Premium final year project ideas and source code for ${location.name} students. Get university-guideline-compliant documentation, plagiarism-free reports, and AI-powered career tools.`,
  };

  return {
    title: titleMap[location.type],
    description: descMap[location.type],
    alternates: {
      canonical: `https://www.graduatenex.online/locations/${location.slug}`,
    },
    openGraph: {
      title: titleMap[location.type],
      description: descMap[location.type],
      url: `https://www.graduatenex.online/locations/${location.slug}`,
    },
  };
}

// Generate unique stats per location type
function getLocationStats(type: string, name: string) {
  if (type === 'university') {
    return {
      students: '500+',
      projects: '150+',
      deliveryTime: '2-4 Hours',
      subtitle: `Tailored specifically for ${name} curriculum and examination guidelines`,
    };
  }
  if (type === 'city') {
    return {
      students: '1,000+',
      projects: '200+',
      deliveryTime: 'Instant',
      subtitle: `Serving engineering colleges across ${name} with production-ready academic projects`,
    };
  }
  return {
    students: '2,500+',
    projects: '300+',
    deliveryTime: 'Same Day',
    subtitle: `The #1 platform for engineering students across ${name} to get top-grade final year projects`,
  };
}

// Generate unique FAQs per location type
function getLocationFAQs(type: string, name: string) {
  const baseFAQs = [
    {
      q: `What types of final year projects are available for students in ${name}?`,
      a: `We offer 100+ production-ready projects across Machine Learning, AI, Web Development (MERN, Next.js), App Development (Flutter, React Native), IoT, Blockchain, Cloud Computing, Cybersecurity, and Data Science. Each project comes with complete source code, database schemas, and deployment instructions.`
    },
    {
      q: `Do you provide zero-plagiarism documentation for ${name} students?`,
      a: `Yes! Every project includes professionally written SRS documents, architecture diagrams, IEEE-format research papers, abstracts, and PowerPoint presentations. All documents are plagiarism-screened and comply with university submission guidelines.`
    },
    {
      q: `How quickly can I get my project delivered in ${name}?`,
      a: `Digital products (source code, documentation) are delivered instantly after payment. Custom projects take 3-7 business days depending on complexity. We also offer express delivery for urgent submissions.`
    },
  ];

  if (type === 'university') {
    baseFAQs.push({
      q: `Are the projects compliant with ${name} guidelines?`,
      a: `Absolutely. Our projects and documentation are structured to meet the specific submission formats and evaluation criteria used by ${name}. We stay updated with the latest curriculum changes and examination patterns.`
    });
    baseFAQs.push({
      q: `Can I get viva preparation support for my ${name} project?`,
      a: `Yes, we provide comprehensive viva preparation support including likely questions, architecture walkthrough guides, and technical explanations customized for your specific project. Our team is available Monday–Friday, 9AM–6PM IST.`
    });
  }

  if (type === 'city') {
    baseFAQs.push({
      q: `Do you offer in-person project support in ${name}?`,
      a: `While our primary delivery is digital, we have a network of mentors in ${name} who can provide in-person guidance for complex custom projects. Contact us at +91 79819 94870 for more details.`
    });
  }

  if (type === 'state') {
    baseFAQs.push({
      q: `Which universities in ${name} do you serve?`,
      a: `We serve students from all major universities and engineering colleges in ${name}, including government, private, and autonomous institutions. Our projects and documentation meet the standards required by AICTE-approved colleges.`
    });
  }

  return baseFAQs;
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = seoLocations.find((l) => l.slug === slug);

  if (!location) {
    notFound();
  }

  const stats = getLocationStats(location.type, location.name);
  const faqs = getLocationFAQs(location.type, location.name);
  
  // Get related locations for cross-linking
  const relatedLocations = seoLocations
    .filter(l => l.type === location.type && l.slug !== location.slug)
    .slice(0, 6);

  // Fetch some popular projects dynamically to make the page unique and valuable for SEO
  const { data: popularProjects } = await supabase
    .from('projects')
    .select('id, title, education, sub_domain, image_url, price')
    .order('created_at', { ascending: false })
    .limit(4);

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.graduatenex.online' },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://www.graduatenex.online/locations' },
      { '@type': 'ListItem', position: 3, name: location.name, item: `https://www.graduatenex.online/locations/${location.slug}` },
    ],
  };

  // FAQPage JSON-LD
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero Section */}
      <section className="w-full py-16 md:py-28 bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/90 font-medium">{location.name}</span>
          </nav>

          <div className="flex flex-col justify-center space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold backdrop-blur-sm w-fit">
              <MapPin className="h-4 w-4 text-blue-300" />
              <span className="text-blue-100">Now Serving {location.name}</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
              Final Year Projects & Career Tools for Students in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{location.name}</span>
            </h1>
            <p className="max-w-[700px] text-lg text-white/70 leading-relaxed">
              {stats.subtitle}. Get production-ready source code, zero-plagiarism documentation, AI-powered resumes, and hackathon listings — all in one platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <Link href="/projects">
                <Button size="lg" className="gap-2 h-14 px-8 text-md bg-white text-indigo-900 hover:bg-zinc-100 font-bold shadow-xl rounded-xl">
                  Browse All Projects <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/resume">
                <Button size="lg" className="gap-2 h-14 px-8 text-md bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 font-bold rounded-xl">
                  Free Resume Checker
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full py-8 bg-white dark:bg-zinc-950 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-black text-primary">{stats.students}</div>
              <div className="text-sm text-muted-foreground font-medium">Students Served</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-primary">{stats.projects}</div>
              <div className="text-sm text-muted-foreground font-medium">Ready Projects</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-primary">{stats.deliveryTime}</div>
              <div className="text-sm text-muted-foreground font-medium">Delivery Time</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground font-medium">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Unique content */}
      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Everything You Need to <span className="text-primary">Ace Your Academics</span> in {location.name}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From project source code to job-ready resumes — we cover the complete student lifecycle.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Code className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Production-Ready Source Code</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Download fully functional projects in Python, Java, React, Node.js, Flutter, and more. Every project is tested, documented, and ready to deploy for your {location.type === 'university' ? `${location.name} submission` : `university in ${location.name}`}.
              </p>
              <Link href="/projects" className="text-primary font-semibold hover:underline mt-auto">
                Browse Projects →
              </Link>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Zero-Plagiarism Documentation</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Get professionally written SRS documents, system architecture diagrams, IEEE-format research papers, abstracts, and PowerPoint presentations. Every document is plagiarism-screened and formatted for {location.type === 'university' ? location.name : `universities across ${location.name}`}.
              </p>
              <Link href="/projects/documentation" className="text-primary font-semibold hover:underline mt-auto">
                View Documentation Services →
              </Link>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Resume Builder & ATS Checker</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Build ATS-friendly resumes that pass automated screening. Our 17-point ATS analysis and 20-point JD matching system helps freshers from {location.name} land their dream jobs at FAANG, startups, and MNCs.
              </p>
              <Link href="/resume" className="text-primary font-semibold hover:underline mt-auto">
                Build Your Resume →
              </Link>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="h-7 w-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hackathon Directory</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Discover upcoming hackathons, coding competitions, and tech events {location.type === 'city' ? `in ${location.name}` : `across ${location.name}`}. Win cash prizes, build your portfolio, and get noticed by recruiters.
              </p>
              <Link href="/hackathons" className="text-primary font-semibold hover:underline mt-auto">
                Find Hackathons →
              </Link>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Interview Preparation</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Prepare for campus placements with our curated study materials, aptitude tests, coding problems, and mock interview resources tailored for engineering students.
              </p>
              <Link href="/study/interview-prep" className="text-primary font-semibold hover:underline mt-auto">
                Start Preparing →
              </Link>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border shadow-sm flex flex-col transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Star className="h-7 w-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Tools</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Generate project abstracts, create documentation, humanize AI-written text, and build research papers using our suite of AI tools designed specifically for engineering students.
              </p>
              <Link href="/ai-services" className="text-primary font-semibold hover:underline mt-auto">
                Explore AI Tools →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Location-specific */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-12">
            Why {location.type === 'university' ? location.name : `Students in ${location.name}`} Choose GraduateNex
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "100+ production-ready projects across 10+ technology domains",
              "Zero-plagiarism guarantee on all documentation and reports",
              "University-guideline compliant SRS, IEEE papers, and PPTs",
              "Free 17-point ATS resume checker with AI-powered suggestions",
              "24/7 post-purchase technical support for project setup",
              "Viva preparation guides and architecture walkthroughs",
              "Same-day digital delivery via secure download links",
              "Trusted by 2,500+ engineering students across India",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl hover:bg-muted/30 transition-colors">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Projects Section */}
      {popularProjects && popularProjects.length > 0 && (
        <section className="w-full py-20 bg-muted/30 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                Top Final Year Projects for {location.name}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore the most downloaded projects by engineering students in your region.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {popularProjects.map(project => (
                <div key={project.id} className="group flex flex-col bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <Link href={`/projects/${project.id}`} className="block relative aspect-video bg-muted overflow-hidden">
                    {project.image_url ? (
                      <Image src={project.image_url} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Preview</div>
                    )}
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider rounded-md">{project.education}</span>
                      {project.sub_domain && <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-extrabold uppercase tracking-wider rounded-md">{project.sub_domain}</span>}
                    </div>
                    
                    <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-sm font-bold leading-tight mb-2 line-clamp-2">{project.title}</h3>
                    </Link>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t mt-4">
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{project.price}</p>
                      <Link href={`/projects/${project.id}`}>
                        <Button size="icon" className="rounded-xl shadow-md h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/projects">
                <Button variant="outline" size="lg" className="rounded-xl font-bold">
                  View All Projects in {location.name}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-4">
            Frequently Asked Questions — {location.name}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Common questions from engineering students in {location.name} about our services.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-zinc-950 border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Locations - Cross-linking */}
      <section className="w-full py-16 bg-background border-t">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Also Serving {location.type === 'state' ? 'Other States' : location.type === 'city' ? 'Other Cities' : 'Other Universities'}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {relatedLocations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="px-4 py-2 rounded-full border bg-muted/30 hover:bg-primary hover:text-white transition-all text-sm font-medium"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-r from-indigo-600 to-blue-700 text-white text-center">
        <div className="container mx-auto px-4 md:px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to Score Top Marks in {location.name}?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join 2,500+ students who have already secured top grades and landed their dream jobs using GraduateNex.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/projects">
              <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-indigo-700 hover:bg-zinc-100 rounded-xl shadow-xl">
                Browse Projects <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/custom-requirements">
              <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white/15 border-2 border-white text-white hover:bg-white/25 rounded-xl">
                Request Custom Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
