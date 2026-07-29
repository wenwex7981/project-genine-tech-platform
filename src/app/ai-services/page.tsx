"use client";

import AIHelper from "@/components/AIHelper";
import AIHumanizer from "@/components/AIHumanizer";
import { Sparkles, BrainCircuit } from "lucide-react";

export default function AIServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20 pb-20">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white py-20 px-4 md:px-6 mb-12">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-semibold backdrop-blur-sm">
            <BrainCircuit className="h-4 w-4 text-purple-300" />
            <span className="text-purple-100">Next-Gen Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">AI Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hub</span></h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Generate complex academic documents instantly and enhance AI-generated content into natural, human-quality writing using our advanced rewriting engines.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 space-y-24">
        {/* Document Generation */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Document Generator</h2>
          </div>
          <AIHelper />
        </section>

        {/* AI Stealth Humanizer */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl font-bold">Stealth Humanizer</h2>
          </div>
          <AIHumanizer />
        </section>
      </div>
    </div>
  );
}
