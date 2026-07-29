"use client";

import { useState } from "react";
import { Loader2, Map, CheckCircle2, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function CareerGuidancePage() {
  const [goal, setGoal] = useState("");
  const [background, setBackground] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    setIsLoading(true);
    setRoadmap("");

    try {
      const res = await fetch("/api/career-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, background }),
      });

      if (!res.ok) throw new Error("Failed to generate roadmap");

      const data = await res.json();
      setRoadmap(data.roadmap);
    } catch (error) {
      console.error(error);
      alert("Error generating roadmap. Please check API configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-20 border-b relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Map className="h-64 w-64" />
        </div>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
          <Link href="/study" className="text-indigo-200 hover:text-white hover:underline font-semibold mb-4 inline-flex items-center gap-1">
            <ChevronRight className="rotate-180 w-4 h-4" /> Back to Study Hub
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            AI Career <span className="text-purple-300">Roadmap Generator</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed max-w-2xl">
            Tell our Groq-powered AI your career goals and current background. It will generate a highly detailed, step-by-step learning roadmap tailored just for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12 max-w-4xl">
        <div className="grid md:grid-cols-[1fr_2fr] gap-8">
          
          {/* Form Side */}
          <div className="space-y-6">
            <form onSubmit={handleGenerate} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">What is your dream role?</label>
                <input 
                  required
                  placeholder="e.g. Senior AI Engineer"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Current Background (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. 3rd year CS student, know basic Python"
                  value={background}
                  onChange={e => setBackground(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Map className="mr-2 h-5 w-5" />}
                {isLoading ? "Generating..." : "Generate Roadmap"}
              </Button>
            </form>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" /> Powered by Groq</h3>
              <p className="text-sm text-muted-foreground">
                Our AI uses the Llama 3 model running on Groq's LPU inference engine to generate your customized roadmap in milliseconds.
              </p>
            </div>
          </div>

          {/* Results Side */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm min-h-[500px]">
            {!roadmap && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-50">
                <Map className="w-20 h-20 mb-4" />
                <h3 className="text-xl font-bold">Your Roadmap Awaits</h3>
                <p>Fill out the form to generate your step-by-step guide.</p>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-indigo-500">
                <Loader2 className="w-16 h-16 animate-spin mb-4" />
                <h3 className="text-xl font-bold animate-pulse">Analyzing career path...</h3>
              </div>
            )}

            {roadmap && !isLoading && (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="flex justify-between items-center mb-6 pb-6 border-b">
                  <h2 className="text-2xl font-bold">Your Custom Roadmap</h2>
                  <Button variant="outline" size="sm" onClick={() => alert("Share feature coming soon!")}>
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{roadmap}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
