import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Presentation, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ServicesPage() {
  const services = [
    {
      id: "research",
      title: "Research Papers",
      description: "Professional research paper writing and formatting for IEEE, Springer, and other renowned journals.",
      price: "From ₹1,499",
      icon: <FileText className="h-8 w-8 text-primary" />,
      features: ["Plagiarism-free content", "Proper IEEE/APA formatting", "Revisions included", "Fast delivery"],
    },
    {
      id: "docs",
      title: "Documentation Services",
      description: "Comprehensive project reports, System Requirement Specifications (SRS), and user manuals.",
      price: "From ₹999",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      features: ["Complete SRS creation", "UML Diagrams (Use case, ER, etc.)", "Chapter-wise breakdown", "Source code explanation"],
    },
    {
      id: "ppt",
      title: "PPT Making",
      description: "Stunning, professional PowerPoint presentations that will impress your evaluators and reviewers.",
      price: "From ₹499",
      icon: <Presentation className="h-8 w-8 text-primary" />,
      features: ["Premium templates", "Infographics & charts", "Speaker notes", "15-20 slides optimized for time"],
    },
    {
      id: "resume",
      title: "Resume Making",
      description: "ATS-friendly, professionally designed resumes that stand out to recruiters and land you interviews.",
      price: "From ₹499",
      icon: <FileText className="h-8 w-8 text-primary" />,
      features: ["Multiple premium templates", "ATS keyword optimization", "Cover letter included", "Unlimited revisions"],
    },
    {
      id: "job-profile",
      title: "Job Profile Optimization",
      description: "Complete overhaul of your LinkedIn, GitHub, and portfolio to make you highly hirable.",
      price: "From ₹1,999",
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      features: ["LinkedIn SEO", "GitHub repo cleanup", "Portfolio review", "Interview tips"],
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Academic <span className="text-primary">Services</span></h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Beyond just source code. We provide full-stack academic support to ensure you get the best grades for your project.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl group">
            
            {/* Service Thumbnail */}
            <div className="relative h-48 w-full bg-muted overflow-hidden border-b">
              <Image 
                src="/service_thumb.png" 
                alt={service.title} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 inline-flex p-3 rounded-xl bg-white/90 dark:bg-zinc-900/90 shadow-sm">
                {service.icon}
              </div>
            </div>

            <div className="p-8 flex-1">
              <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
              <p className="text-muted-foreground mb-6 h-16">{service.description}</p>
              <div className="text-3xl font-extrabold mb-6 text-foreground">{service.price}</div>
              
              <div className="space-y-3 mb-8">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 border-t">
              <Button className="w-full text-lg h-12" size="lg">
                Book Service
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
