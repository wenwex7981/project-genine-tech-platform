"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Megaphone, Copy, CheckCircle2, Loader2, Target, Hash, Mail, Linkedin, Twitter, MessageSquare } from "lucide-react";
import { ModelSelector, AIModel } from "@/components/ModelSelector";

export default function MarketingEngine() {
  const [topic, setTopic] = useState("");
  const [preferredModel, setPreferredModel] = useState<AIModel>("deepseek");
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-orange-500" /> AI Bulk Marketing Engine
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Automatically generate high-converting social media posts, ad copy, and SEO tags for your products.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        {/* Left Column: Input Form */}
        <div>
          <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm sticky top-6">
            <form onSubmit={handleGenerate} className="space-y-6">
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
                <ModelSelector selectedModel={preferredModel} onSelect={setPreferredModel} />
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

        {/* Right Column: Results */}
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
              {renderContentCard("LinkedIn Post", <Linkedin className="w-5 h-5 text-blue-600" />, campaign.linkedin, "linkedin")}
              {renderContentCard("Twitter Thread", <Twitter className="w-5 h-5 text-sky-500" />, campaign.twitter, "twitter")}
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
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(campaign.seoTags.join(", "), "seo")} className="h-8 w-8">
                      {copiedSection === "seo" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {campaign.seoTags.map((tag: string, i: number) => (
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
    </div>
  );
}
