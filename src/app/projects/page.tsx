"use client";

import Link from "next/link";
import { Code, BookOpen, FileText, ShieldAlert, ArrowRight, ShoppingCart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProjectsHub() {
  const { addToCart } = useCart();
  
  const [selectedDegree, setSelectedDegree] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) setProjects(data);
      setIsLoading(false);
    }
    fetchProjects();
  }, []);

  const degrees = ["All", "BTech", "MTech", "MCA", "BCA", "Degree", "MBA"];
  const domains = ["All", "Artificial Intelligence", "Machine Learning", "IoT", "Blockchain", "Cybersecurity", "App Development"];

  const filteredProjects = projects.filter(project => {
    const matchDegree = selectedDegree === "All" || (project.education && project.education.toLowerCase().includes(selectedDegree.toLowerCase()));
    const matchDomain = selectedDomain === "All" || (project.sub_domain && project.sub_domain.toLowerCase().includes(selectedDomain.toLowerCase()));
    return matchDegree && matchDomain;
  });

  const services = [
    {
      title: "Project Source Code",
      description: "Get complete, ready-to-deploy source code for Mini & Major academic projects across domains like AI, Web, and IoT.",
      icon: <Code className="h-8 w-8 text-blue-500" />,
      href: "/projects/source-code",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100"
    },
    {
      title: "Documentation & SRS",
      description: "Professionally written project reports, System Requirement Specifications (SRS), and presentation manuals.",
      icon: <BookOpen className="h-8 w-8 text-emerald-500" />,
      href: "/projects/documentation",
      color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100"
    },
    {
      title: "Research Papers",
      description: "High-quality academic research writing formatted for IEEE, Springer, and other leading journals.",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      href: "/projects/research-paper",
      color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100"
    },
    {
      title: "Plagiarism Removal",
      description: "Advanced paraphrasing and editing to ensure your documentation and papers are original and properly cited.",
      icon: <ShieldAlert className="h-8 w-8 text-rose-500" />,
      href: "/projects/plagiarism-removal",
      color: "bg-rose-50 dark:bg-rose-900/20 border-rose-100"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* Hero Banner */}
      <div className="relative min-h-[400px] flex items-center justify-center text-white py-24 px-4 md:px-6 mb-12 overflow-hidden shadow-2xl border-b border-zinc-800">
        <div className="absolute inset-0">
          <Image 
            src="/images/projects-banner.png" 
            alt="Final Year Projects Hub Banner" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="container mx-auto max-w-6xl text-center space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg text-white">Final Year <span className="text-primary">Projects Hub</span></h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Everything you need to score top grades. From full deployable source code to pristine, zero-plagiarism documentation.
          </p>
        </div>
      </div>

      {/* Top 4 Features (Horizontally Displayed) */}
      <div className="container mx-auto px-4 md:px-6 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto -mt-20 relative z-20">
          {services.map((svc, i) => (
            <Link key={i} href={svc.href} className="group block h-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border overflow-hidden hover:-translate-y-2 transition-transform duration-300">
              <div className={`p-6 h-full ${svc.color} flex flex-col justify-between`}>
                <div>
                  <div className="bg-white dark:bg-zinc-900 w-12 h-12 rounded-xl shadow-sm border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {svc.icon}
                  </div>
                  <h2 className="text-xl font-bold mb-2 flex items-center justify-between text-zinc-900 dark:text-white">
                    {svc.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                    {svc.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-primary font-bold text-sm">
                  Request Now <ArrowRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Massive Marketplace Section with Left Sidebar Filters */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Marketplace</h2>
          <p className="text-muted-foreground text-lg">Browse high-quality, pre-built projects by Degree and Domain.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Filters (Amazon Style) */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" /> Filters
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Degree</h4>
                  <div className="space-y-2">
                    {degrees.map(deg => (
                      <label key={deg} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="degree" 
                          checked={selectedDegree === deg} 
                          onChange={() => setSelectedDegree(deg)}
                          className="w-4 h-4 text-primary accent-primary"
                        />
                        <span className={`text-sm font-medium transition-colors ${selectedDegree === deg ? 'text-primary font-bold' : 'text-foreground group-hover:text-primary'}`}>
                          {deg}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Domain</h4>
                  <div className="space-y-2">
                    {domains.map(dom => (
                      <label key={dom} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="domain" 
                          checked={selectedDomain === dom} 
                          onChange={() => setSelectedDomain(dom)}
                          className="w-4 h-4 text-primary accent-primary"
                        />
                        <span className={`text-sm font-medium transition-colors ${selectedDomain === dom ? 'text-primary font-bold' : 'text-foreground group-hover:text-primary'}`}>
                          {dom}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => { setSelectedDegree("All"); setSelectedDomain("All"); }}
                  variant="outline" 
                  className="w-full text-xs font-bold uppercase tracking-wider"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Amazon-style Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground font-bold">Loading Projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed rounded-3xl">
                <p className="text-lg text-muted-foreground font-bold">No projects found matching these filters.</p>
                <Button 
                  onClick={() => { setSelectedDegree("All"); setSelectedDomain("All"); }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <div key={project.id} className="group flex flex-col bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300">
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
                        <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">{project.title}</h3>
                      </Link>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between border-t mt-4">
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{project.price}</p>
                        <Button onClick={(e) => {
                          e.preventDefault();
                          addToCart(project);
                        }} size="icon" className="rounded-xl shadow-md h-10 w-10 bg-orange-500 hover:bg-orange-600 text-white">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
