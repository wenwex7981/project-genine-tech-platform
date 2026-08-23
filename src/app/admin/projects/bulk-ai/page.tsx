"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Bot, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModelSelector, AIModel } from "@/components/ModelSelector";

export default function BulkAIProjectPublisher() {
  const router = useRouter();
  
  const [topic, setTopic] = useState("");
  const [totalCount, setTotalCount] = useState(50);
  const [preferredModel, setPreferredModel] = useState<AIModel>("deepseek");
  
  const [education, setEducation] = useState("BTech");
  const [branch, setBranch] = useState("CSE");
  const [price, setPrice] = useState("1999");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [statusText, setStatusText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const BATCH_SIZE = 10;

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    setProgress({ current: 0, total: totalCount });
    setLogs([]);
    addLog(`Starting bulk generation for ${totalCount} projects on "${topic}"...`);

    let generatedCount = 0;

    try {
      while (generatedCount < totalCount) {
        const remaining = totalCount - generatedCount;
        const countToFetch = Math.min(BATCH_SIZE, remaining);

        setStatusText(`Generating batch of ${countToFetch} projects via AI...`);
        
        // 1. Fetch AI projects
        const res = await fetch("/api/bulk-generate-projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, count: countToFetch, preferredModel }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch from AI");
        }

        const data = await res.json();
        const projects = data.projects;

        if (!Array.isArray(projects) || projects.length === 0) {
          throw new Error("AI returned empty or invalid data format.");
        }

        addLog(`AI successfully generated ${projects.length} projects. Parsing and uploading...`);

        // 2. Prepare for Supabase
        const dbPayload = projects.map(p => ({
          title: p.title || "Untitled Project",
          type: p.type || "Major",
          sub_domain: p.sub_domain || "",
          description: p.description || "",
          features: Array.isArray(p.features) ? p.features : [],
          education: education,
          branch: branch,
          price: price,
          image_url: null, // AI doesn't generate real images, fallback logic in UI
        }));

        // 3. Insert into Supabase
        const { error } = await supabase.from("projects").insert(dbPayload);

        if (error) {
          throw error;
        }

        generatedCount += projects.length;
        setProgress({ current: generatedCount, total: totalCount });
        addLog(`Inserted ${projects.length} projects into database. Total: ${generatedCount}/${totalCount}`);
      }

      setStatusText("Complete!");
      addLog("All projects have been successfully generated and published!");
      
    } catch (error: any) {
      console.error(error);
      addLog(`ERROR: ${error.message}`);
      setStatusText("Process stopped due to an error.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="text-purple-500" /> AI Bulk Publisher
          </h1>
          <p className="text-muted-foreground text-sm">Mass generate and instantly publish 50+ projects.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form Settings */}
        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Topic & Quantity
              </h2>
              
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Project Topic / Category</label>
                <input 
                  required 
                  placeholder="e.g. Machine Learning Beginner Projects, Advanced Cyber Security" 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block">Number of Projects to Generate</label>
                <input 
                  required 
                  type="number" 
                  min={1} 
                  max={200}
                  value={totalCount} 
                  onChange={e => setTotalCount(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                  disabled={isGenerating}
                />
                <p className="text-xs text-muted-foreground mt-1">We will generate these in batches of {BATCH_SIZE} to avoid AI timeouts.</p>
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Preferred AI Model</label>
                <ModelSelector value={preferredModel} onChange={setPreferredModel} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b pb-2">Global Project Settings</h2>
              <p className="text-xs text-muted-foreground">These attributes will be applied to ALL generated projects in this batch.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Education Level</label>
                  <select 
                    value={education} 
                    onChange={e => setEducation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-gray-50 outline-none"
                    disabled={isGenerating}
                  >
                    <option value="BTech">BTech</option>
                    <option value="MTech">MTech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="Degree">Degree</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Branch</label>
                  <input 
                    type="text" 
                    value={branch} 
                    onChange={e => setBranch(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-gray-50 outline-none"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block">Default Price (₹)</label>
                <input 
                  required 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-gray-50 outline-none"
                  disabled={isGenerating}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              disabled={isGenerating || !topic || totalCount <= 0}
            >
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
              {isGenerating ? "Generating Projects..." : `Generate & Publish ${totalCount} Projects`}
            </Button>
          </form>
        </div>

        {/* Live Terminal / Status */}
        <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800 shadow-2xl flex flex-col h-full min-h-[400px]">
          <h3 className="text-white font-mono font-bold text-sm mb-4 flex justify-between items-center border-b border-zinc-800 pb-2">
            <span>Server Execution Log</span>
            {isGenerating && <span className="text-emerald-400 animate-pulse text-xs">RUNNING</span>}
          </h3>
          
          <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 mb-4 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-zinc-600 italic">Waiting to start...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={`${log.startsWith('ERROR') ? 'text-rose-400' : log.includes('successfully') ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  <span className="text-zinc-600 opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))
            )}
            {isGenerating && (
              <div className="text-zinc-500 animate-pulse">_</div>
            )}
          </div>

          {progress.total > 0 && (
            <div className="mt-auto border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2">
                <span>Progress</span>
                <span className="text-emerald-400">{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2.5 transition-all duration-500 ease-out"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-xs text-zinc-400 mt-3">{statusText}</p>
            </div>
          )}

          {progress.current > 0 && progress.current === progress.total && !isGenerating && (
            <div className="mt-4 bg-emerald-900/30 border border-emerald-800 p-3 rounded-lg text-emerald-400 text-sm flex items-center justify-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5" /> 
              {progress.current} Projects Published!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
