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
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
            
            .handwritten-page {
              font-family: 'Patrick Hand', 'Caveat', cursive;
              background-color: #fdfbf7;
              background-image: linear-gradient(transparent 95%, #e2e8f0 5%);
              background-size: 100% 2rem;
              line-height: 2rem;
              padding: 40px;
              color: #1e1b4b;
              min-height: 1122px; /* A4 approx */
            }
            .handwritten-box {
              border: 3px solid #db2777;
              border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
              padding: 15px;
              margin: 15px 0;
              background: rgba(255,255,255,0.8);
            }
            .handwritten-code {
              font-family: monospace;
              background: #f8fafc;
              border: 2px solid #475569;
              border-radius: 10px;
              padding: 15px;
              margin: 15px 0;
              font-size: 14px;
              line-height: 1.5;
            }
          `}} />
          
          <div className="bg-white px-4 py-3 border-b text-sm font-bold flex justify-between items-center shadow-sm z-10">
            <span>Visual Preview</span>
            <span className="text-xs font-normal text-muted-foreground">This will be converted to PDF</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
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
                      
                      <div className="flex justify-between items-end border-b-4 border-indigo-200 pb-2 mb-6">
                        <h2 className="text-4xl font-bold text-indigo-700" style={{fontFamily: 'Caveat'}}>{page.chapterTitle}</h2>
                        <span className="text-xl text-pink-500 border-2 border-pink-500 rounded-full w-8 h-8 flex items-center justify-center">{idx + 1}</span>
                      </div>
                      
                      {page.summary && (
                        <div className="handwritten-box text-lg">
                          <strong>Summary:</strong> {page.summary}
                        </div>
                      )}
                      
                      <div className="space-y-4 mt-6 text-xl">
                        {page.items?.map((item: any, i: number) => {
                          if (item.type === 'bullet') {
                            return (
                              <div key={i} className="flex gap-3 items-start">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>{item.text}</span>
                              </div>
                            );
                          }
                          if (item.type === 'code') {
                            return (
                              <div key={i} className="handwritten-code">
                                <div className="text-xs text-gray-500 mb-1 border-b pb-1 uppercase">{item.language}</div>
                                <pre className="whitespace-pre-wrap">{item.code}</pre>
                              </div>
                            );
                          }
                          if (item.type === 'diagram') {
                            return (
                              <div key={i} className="flex justify-center my-6 bg-white p-4 border-2 border-dashed border-gray-300 rounded-xl">
                                <pre className="mermaid-diagram">{item.mermaid}</pre>
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
