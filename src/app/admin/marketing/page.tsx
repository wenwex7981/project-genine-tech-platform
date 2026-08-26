"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Megaphone, Copy, CheckCircle2, Loader2, Target, Hash, Mail, Briefcase, Send, MessageSquare, PlayCircle, Database, CheckSquare, Settings } from "lucide-react";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { supabase } from "@/lib/supabase";

export default function MarketingEngine() {
  const [activeTab, setActiveTab] = useState<"manual" | "bulk">("manual");

  // Manual State
  const [topic, setTopic] = useState("");
  const [preferredModel, setPreferredModel] = useState<AIModel>("deepseek");
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState("");

  // Bulk State
  const [projects, setProjects] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<Record<string, any>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkLogs, setBulkLogs] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === "bulk") {
      fetchProjectsAndCampaigns();
    }
  }, [activeTab]);

  const fetchProjectsAndCampaigns = async () => {
    const { data: projData } = await supabase.from('projects').select('id, title, sub_domain, created_at').order('created_at', { ascending: false });
    const { data: campData } = await supabase.from('project_marketing_campaigns').select('project_id, campaign_data');
    
    if (projData) setProjects(projData);
    if (campData) {
      const campMap: Record<string, any> = {};
      campData.forEach(c => campMap[c.project_id] = c.campaign_data);
      setCampaigns(campMap);
    }
  };

  const handleManualGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    setError("");
    setCampaign(null);

    try {
      const res = await fetch("/api/generate-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, preferredModel }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to generate campaign";
        try {
          errorMessage = JSON.parse(errorText).error || errorMessage;
        } catch {
          errorMessage = `Server Error: ${errorText.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setCampaign(data.campaign);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const runBulkGeneration = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkRunning(true);
    setBulkProgress(0);
    setBulkLogs(["Starting bulk engine..."]);

    let successCount = 0;
    for (let i = 0; i < selectedIds.length; i++) {
      const pId = selectedIds[i];
      const pTitle = projects.find(p => p.id === pId)?.title || pId;
      setBulkLogs(prev => [...prev, `[${i+1}/${selectedIds.length}] Generating for: ${pTitle.substring(0, 40)}...`]);
      
      try {
        const res = await fetch("/api/generate-project-campaign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: pId, preferredModel }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setCampaigns(prev => ({ ...prev, [pId]: data.campaign }));
          successCount++;
          setBulkLogs(prev => [...prev, `✅ Success: ${pTitle.substring(0, 40)}`]);
        } else {
          setBulkLogs(prev => [...prev, `❌ Failed: ${pTitle.substring(0, 40)}`]);
        }
      } catch (e: any) {
        setBulkLogs(prev => [...prev, `❌ Error: ${e.message}`]);
      }
      setBulkProgress(((i + 1) / selectedIds.length) * 100);
    }

    setBulkLogs(prev => [...prev, `🎉 Completed! Successfully generated ${successCount} campaigns.`]);
    setIsBulkRunning(false);
    setSelectedIds([]); // clear selection
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(""), 2000);
  };

  const renderContentCard = (title: string, icon: React.ReactNode, content: string | string[], id: string) => (
    <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 border-b">
        <h3 className="font-bold flex items-center gap-2">{icon} {title}</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => copyToClipboard(Array.isArray(content) ? content.join(", ") : content, id)}
          className="h-8 gap-2"
        >
          {copiedSection === id ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copiedSection === id ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="p-6 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {Array.isArray(content) ? (
          <div className="flex flex-wrap gap-2">
            {content.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full font-medium text-xs">
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-orange-500" /> AI Bulk Marketing Engine
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Automatically generate high-converting social media posts, ad copy, and SEO tags.
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("manual")} 
            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'manual' ? 'bg-white dark:bg-zinc-900 shadow-sm text-orange-600' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Manual Prompt
          </button>
          <button 
            onClick={() => setActiveTab("bulk")} 
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'bulk' ? 'bg-white dark:bg-zinc-900 shadow-sm text-orange-600' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Database className="w-4 h-4" /> Bulk Auto-Engine
          </button>
        </div>
      </div>

      {activeTab === "manual" && (
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm sticky top-6">
              <form onSubmit={handleManualGenerate} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-zinc-800 dark:text-zinc-200">
                    Topic, Product, or Project Name
                  </label>
                  <textarea 
                    required 
                    rows={4}
                    placeholder="e.g. A new Python Machine Learning Project that predicts crop disease, suitable for BTech students." 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)}
                    className="w-full p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block text-zinc-800 dark:text-zinc-200">
                    Select AI Brain
                  </label>
                  <ModelSelector value={preferredModel} onChange={setPreferredModel} className="w-full" />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isGenerating || !topic} 
                  className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg shadow-orange-500/20"
                >
                  {isGenerating ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cooking Campaign...</>
                  ) : (
                    <><Target className="mr-2 h-5 w-5" /> Generate Full Campaign</>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div>
            {!campaign && !isGenerating && (
              <div className="h-full min-h-[400px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-400 bg-gray-50/50 dark:bg-zinc-900/20 p-8 text-center">
                <Megaphone className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="font-bold text-xl mb-2 text-zinc-600 dark:text-zinc-400">No Campaign Yet</h3>
                <p className="max-w-md">Enter a topic on the left and hit generate to instantly create your multi-channel marketing content.</p>
              </div>
            )}

            {isGenerating && (
              <div className="h-full min-h-[400px] border rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-zinc-900 shadow-sm p-8 text-center">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-orange-500" />
                <h3 className="font-bold text-xl mb-2 text-zinc-700">Writing Copy...</h3>
                <p className="text-muted-foreground animate-pulse">Our elite AI CMO is crafting your hooks, ads, and SEO tags.</p>
              </div>
            )}

            {campaign && !isGenerating && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderContentCard("LinkedIn Post", <Briefcase className="w-5 h-5 text-blue-600" />, campaign.linkedin, "linkedin")}
                {renderContentCard("Twitter Thread", <Send className="w-5 h-5 text-sky-500" />, campaign.twitter, "twitter")}
                {renderContentCard("Facebook / Instagram Ad", <MessageSquare className="w-5 h-5 text-purple-600" />, campaign.facebookAd, "fb")}
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                      <h3 className="font-bold flex items-center gap-2"><Mail className="w-5 h-5 text-rose-500" /> Email Subject</h3>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(campaign.emailSubject, "sub")} className="h-8 w-8">
                        {copiedSection === "sub" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="p-6 font-medium text-zinc-800 dark:text-zinc-200">{campaign.emailSubject}</div>
                  </div>
                  
                  <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                      <h3 className="font-bold flex items-center gap-2"><Hash className="w-5 h-5 text-emerald-500" /> SEO Tags</h3>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(campaign.seoTags?.join(", ") || "", "seo")} className="h-8 w-8">
                        {copiedSection === "seo" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {campaign.seoTags?.map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {renderContentCard("Email Newsletter Body", <Mail className="w-5 h-5 text-rose-500" />, campaign.emailBody, "email")}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "bulk" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[700px]">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                  <Database className="w-5 h-5 text-orange-500" /> Projects Database ({projects.length})
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedIds(projects.filter(p => !campaigns[p.id]).map(p => p.id))}
                  >
                    Select All Missing
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedIds([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="overflow-y-auto p-4 flex-1 space-y-2">
                {projects.map(p => {
                  const hasCampaign = !!campaigns[p.id];
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => !isBulkRunning && setSelectedIds(prev => isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                      className={`p-3 rounded-xl border flex items-center gap-4 cursor-pointer transition-colors ${isSelected ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50'} ${isBulkRunning ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.sub_domain}</p>
                      </div>
                      <div>
                        {hasCampaign ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">Done</span>
                        ) : (
                          <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-md">Missing</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Settings className="w-5 h-5" /> Bulk Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">AI Brain for Bulk</label>
                    <ModelSelector value={preferredModel} onChange={setPreferredModel} className="w-full" disabled={isBulkRunning} />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Selected for Generation:</span>
                      <span className="text-orange-600">{selectedIds.length}</span>
                    </div>
                    {isBulkRunning && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-orange-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${bulkProgress}%` }}></div>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={runBulkGeneration}
                    disabled={isBulkRunning || selectedIds.length === 0} 
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg"
                  >
                    {isBulkRunning ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      <><PlayCircle className="mr-2 h-5 w-5" /> Auto-Generate Selected</>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-zinc-900 border-zinc-800 rounded-2xl p-4 shadow-sm h-[320px] flex flex-col">
                <h3 className="font-bold text-sm text-zinc-400 mb-2 font-mono">Terminal Output</h3>
                <div className="flex-1 overflow-y-auto bg-black rounded-xl p-3 font-mono text-xs text-green-400 space-y-1">
                  {bulkLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                  {bulkLogs.length === 0 && <div className="text-zinc-600">Waiting for bulk task...</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
