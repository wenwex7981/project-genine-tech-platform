"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ResumeTemplatesPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('resume_templates').select('*').order('created_at', { ascending: false });
        if (error) console.error(error);
        setData(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRequest = (templateTitle: string) => {
    // Redirect to the custom requirements page, but we can pass the template name via URL params
    window.location.href = `/?service=Resume&template=${encodeURIComponent(templateTitle)}#custom-form`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary/5 py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Professional <span className="text-primary">Resume Templates</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Stand out to recruiters with our ATS-friendly, professionally designed resume templates. Choose a template and we'll customize it for your specific profile and projects.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-16 max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((template) => (
            <div key={template.id} className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative h-64 bg-muted border-b overflow-hidden">
                {template.image_url ? (
                  <Image src={template.image_url} alt={template.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm flex-col gap-3">
                    <FileText className="w-12 h-12 opacity-30" />
                    <div>No Preview Available</div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur text-foreground font-extrabold px-3 py-1.5 rounded-lg shadow-sm border text-sm">
                  {template.price}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl mb-3">{template.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">
                  {template.description}
                </p>
                
                <ul className="space-y-2 mb-8 text-sm font-medium text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> ATS Friendly Layout</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Professional Formatting</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Project Highlighting</li>
                </ul>
                
                <Button 
                  onClick={() => handleRequest(template.title)}
                  className="w-full py-6 text-base shadow-md hover:shadow-lg transition-all"
                >
                  Order This Template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Templates Available Yet</h3>
            <p className="text-muted-foreground">Check back soon for our new professional resume templates!</p>
          </div>
        )}
      </div>
    </div>
  );
}
