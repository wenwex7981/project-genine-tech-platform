"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, ArrowLeft, UploadCloud, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import mermaid from "mermaid";

export default function HandwrittenNotesGenerator() {
  const [topic, setTopic] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [price, setPrice] = useState("49");
  const [model, setModel] = useState<AIModel>("deepseek");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [generatedNotes, setGeneratedNotes] = useState<any>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsGenerating(true);
    setGeneratedNotes(null);
    try {
      const res = await fetch("/api/generate-handwritten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, preferredModel: model })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      setGeneratedNotes(data);
      
      // Give React a moment to render, then render mermaid diagrams
      setTimeout(async () => {
        try {
          await mermaid.run({
            querySelector: '.mermaid-diagram'
          });
        } catch (err) {
          console.error("Mermaid error:", err);
        }
      }, 500);

    } catch (err: any) {
      alert("Failed to generate: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedNotes || !previewRef.current) return;
    
    setIsPublishing(true);
    try {
      // 1. Generate PDF
      const html2pdf = (await import('html2pdf.js')).default;
      const element = previewRef.current;
      const opt = {
        margin: 10,
        filename: `${topic.replace(/\s+/g, '-').toLowerCase()}-notes.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };
      
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
      
      // 2. Upload to Cloudflare R2
      const formData = new FormData();
      formData.append('file', new File([pdfBlob], opt.filename, { type: 'application/pdf' }));
      formData.append('folder', 'handwritten-notes');
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadRes.ok) throw new Error("Failed to upload PDF");
      const { url: pdfUrl } = await uploadRes.json();
      
      // 3. Save to Supabase (Study Hub)
      const { error } = await supabase.from('interview_prep_docs').insert([
        {
          title: generatedNotes.title || topic,
          description: `Beautiful handwritten-style notes about ${topic}.`,
          company_name: companyName || "Handwritten Series",
          price: parseFloat(price) || 0,
          file_url: pdfUrl,
          // We can leave image_url blank or put a placeholder
          image_url: ""
        }
      ]);
      
      if (error) throw error;
      
      alert("Successfully generated, compiled, and published to Study Hub!");
      
    } catch (err: any) {
      console.error(err);
      alert("Failed to publish: " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/study">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">AI Handwritten Notes Engine</h1>
          <p className="text-muted-foreground">Generate beautiful PDF study guides and auto-publish them to the store.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[400px_1fr] gap-8">
        {/* Form Panel */}
        <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm h-fit">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">Note Topic / Subject *</label>
              <input 
                required 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Python Logging & Monitoring"
                className="w-full p-3 rounded-xl border bg-muted/20 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Brand / Tag (optional)</label>
              <input 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Pythonix Hub"
                className="w-full p-3 rounded-xl border bg-muted/20 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Price (₹) *</label>
              <input 
                type="number"
                required 
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full p-3 rounded-xl border bg-muted/20 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">AI Engine</label>
              <ModelSelector value={model} onChange={setModel} />
            </div>
            
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="w-full h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
              {isGenerating ? "Generating Content..." : "Generate Notes"}
            </Button>
          </form>

          {generatedNotes && (
            <div className="mt-8 pt-6 border-t">
              <Button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full h-12 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isPublishing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <UploadCloud className="w-5 h-5 mr-2" />}
                {isPublishing ? "Compiling PDF & Publishing..." : "Publish to Study Hub"}
              </Button>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-100 border rounded-2xl overflow-hidden min-h-[600px] flex flex-col relative">
          <style dangerouslySetInnerHTML={{__html: `
            @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Kalam:wght@700&display=swap');
            
            .handwritten-page {
              font-family: 'Comic Neue', cursive;
              background-color: #ffffff;
              background-image: 
                linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 59px, #ef4444 60px, rgba(255,255,255,0) 61px),
                linear-gradient(#bfdbfe 1px, rgba(255,255,255,0) 1px);
              background-size: 100% 100%, 100% 2rem;
              line-height: 2rem;
              padding: 40px 40px 40px 80px;
              color: #1e3a8a;
              min-height: 1122px; /* A4 approx */
              position: relative;
            }
            .handwritten-title {
              font-family: 'Kalam', cursive;
              font-weight: 700;
              color: #dc2626;
              font-size: 32px;
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 24px;
            }
            .handwritten-summary {
              border: 2px solid #15803d;
              border-radius: 8px;
              padding: 12px 20px;
              margin: 20px 0;
              background: #ffffff;
            }
            .summary-title {
              color: #dc2626;
              font-family: 'Kalam', cursive;
              text-align: center;
              font-size: 24px;
              margin-bottom: 8px;
            }
            .heart-bullet {
              color: #ec4899;
              display: inline-block;
              width: 20px;
            }
            .handwritten-bullet {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              margin-bottom: 4px;
              font-size: 18px;
              font-weight: 700;
            }
            .handwritten-bullet-dot {
              color: #2563eb;
              margin-top: -2px;
            }
            .handwritten-code-title {
              color: #16a34a;
              font-family: 'Kalam', cursive;
              font-size: 22px;
              margin-top: 16px;
              margin-bottom: 4px;
            }
            .handwritten-code-box {
              border: 2px solid #7e22ce;
              border-radius: 8px;
              background: #ffffff;
              padding: 12px;
              font-family: 'Comic Neue', monospace;
              font-size: 16px;
              color: #4c1d95;
              display: flex;
              margin-bottom: 16px;
            }
            .code-lines {
              color: #94a3b8;
              text-align: right;
              padding-right: 12px;
              user-select: none;
            }
            .callout-cloud {
              position: relative;
              float: right;
              margin-left: 20px;
              margin-bottom: 20px;
              width: 180px;
              text-align: center;
              padding: 30px 20px;
              color: #be185d;
              font-family: 'Kalam', cursive;
              font-size: 18px;
              line-height: 1.2;
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 50,75 C 50,50 80,40 100,50 C 110,30 150,30 160,55 C 180,60 180,90 160,100 C 170,120 130,130 110,120 C 90,135 60,125 50,110 C 30,100 30,80 50,75 Z' fill='%23ffffff' stroke='%23fbcfe8' stroke-width='4'/%3E%3C/svg%3E");
              background-size: 100% 100%;
            }
          `}} />
          
          <div className="bg-white px-4 py-3 border-b text-sm font-bold flex justify-between items-center shadow-sm z-10">
            <span>Visual Preview</span>
            <span className="text-xs font-normal text-muted-foreground">This will be converted to PDF</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-200">
            {!generatedNotes ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Generate notes to see preview...
              </div>
            ) : (
              <div className="shadow-2xl mx-auto max-w-[800px]">
                <div ref={previewRef} className="bg-white">
                  {/* Notes Render */}
                  {generatedNotes.pages?.map((page: any, idx: number) => (
                    <div key={idx} className="handwritten-page">
                      
                      <div className="absolute top-10 left-4 w-10 h-10 border-2 border-pink-600 text-pink-600 rounded-full flex items-center justify-center font-bold text-xl bg-white" style={{fontFamily: 'Kalam'}}>
                        {idx + 1}
                      </div>
                      
                      <h2 className="handwritten-title">
                        {page.chapterTitle}
                      </h2>
                      
                      {page.summary && (
                        <div className="handwritten-summary">
                          <div className="summary-title">Chapter Summary</div>
                          <div className="flex gap-2 items-start font-bold">
                            <span className="heart-bullet">♥</span>
                            <span>{page.summary}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        {page.items?.map((item: any, i: number) => {
                          if (item.type === 'callout') {
                            return (
                              <div key={i} className="callout-cloud">
                                {item.text}
                              </div>
                            );
                          }
                          if (item.type === 'bullet') {
                            return (
                              <div key={i} className="handwritten-bullet">
                                <span className="handwritten-bullet-dot">●</span>
                                <span>{item.text}</span>
                              </div>
                            );
                          }
                          if (item.type === 'code') {
                            const lines = item.code.split('\\n');
                            return (
                              <div key={i}>
                                <div className="handwritten-code-title">{item.title || "Syntax:"}</div>
                                <div className="handwritten-code-box">
                                  <div className="code-lines">
                                    {lines.map((_: any, li: number) => (
                                      <div key={li}>{li + 1}</div>
                                    ))}
                                  </div>
                                  <div className="flex-1">
                                    {lines.map((line: string, li: number) => (
                                      <div key={li} className="whitespace-pre">{line || ' '}</div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
