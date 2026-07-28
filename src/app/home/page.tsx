import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code, FileText, Presentation } from "lucide-react";
import Image from "next/image";
import CustomRequirementsForm from "@/components/CustomRequirementsForm";
import AIHelper from "@/components/AIHelper";
import AIHumanizer from "@/components/AIHumanizer";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-b overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-foreground leading-tight">
                  Elevate Your <br className="hidden lg:inline" /><span className="text-primary">Final Year Project</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                  Premium mini and major projects for B.Tech, M.Tech, Degree, BCA, MCA, and MBA students. Plus expert documentation, research papers, and AI-powered abstracts.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/projects">
                  <Button size="lg" className="gap-2 w-full sm:w-auto h-12 px-8 text-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    Browse Projects <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-md bg-white dark:bg-zinc-900 shadow-sm">
                    View Academic Services
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative mx-auto w-full max-w-[600px] aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border bg-muted">
              <Image 
                src="/hero_bg.png"
                alt="Students collaborating on a project in a modern tech environment"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Grid */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Premium Services</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Everything you need to score top grades, from full source code to presentation materials.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
            <Link href="/resume" className="group block overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-48 w-full overflow-hidden border-b bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/30 dark:to-teal-950/30">
                <Image src="/service_resume_hub.png" alt="Resume Analyzer" fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                  Resume Hub <ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Massive 17-point ATS scoring & 20-point JD Matching with Cover Letter generation.</p>
              </div>
            </Link>

            <Link href="/hackathons" className="group block overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-48 w-full overflow-hidden border-b bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30">
                <Image src="/service_projects_marketplace.png" alt="Hackathons Directory" fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                  Hackathons <ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Discover, post, and register for nationwide student hackathons in a central directory.</p>
              </div>
            </Link>

            <Link href="/ai-services" className="group block overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-48 w-full overflow-hidden border-b bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
                <Image src="/service_ai_humanizer.png" alt="AI Stealth Humanizer" fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                  Stealth Humanizer <ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Aggressive AI detection bypass protocol. Scores 99%+ Human on strict detectors.</p>
              </div>
            </Link>

            <Link href="/resume" className="group block overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-48 w-full overflow-hidden border-b bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
                <Image src="/service_plagiarism_checker.png" alt="Zero Plagiarism Documents" fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                  Community <ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Publish and explore a gallery of winning resumes shortlisted by top companies.</p>
              </div>
            </Link>
            
          </div>
        </div>
      </section>

      {/* AI Abstract Promo -> AI Helper Integrated */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-50/50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Powered by AI
            </div>
            <h2 className="text-3xl font-extrabold tracking-tighter md:text-5xl">AI <span className="text-primary">Helper</span></h2>
            <p className="mt-4 text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Create abstract, generate suggested titles and create custom PDF, DOCX, or Excel documents instantly!
            </p>
          </div>
          <AIHelper />
          <AIHumanizer />
        </div>
      </section>
      {/* Custom Form Section */}
      <section className="w-full py-12 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Need Something Custom?</h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Fill out this quick form right here on the home page, and we'll get back to you with a custom project built just for you.
            </p>
          </div>
          <CustomRequirementsForm />
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/917981994870" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all flex items-center justify-center animate-bounce"
        title="Chat with us on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c.003-3.625 2.952-6.57 6.577-6.57a6.6 6.6 0 0 1 4.646 1.918 6.59 6.59 0 0 1 1.917 4.646c-.004 3.625-2.953 6.57-6.577 6.57zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
}
