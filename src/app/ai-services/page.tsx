"use client";

import { useState } from "react";
import AIHelper from "@/components/AIHelper";
import AIHumanizer from "@/components/AIHumanizer";
import { Sparkles, BrainCircuit, FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AIServicesPage() {
  const [activeTab, setActiveTab] = useState<'document' | 'stealth'>('document');
  return (
    <div className="flex flex-col min-h-screen bg-muted/20 pb-20">
      <div className="relative min-h-[400px] flex items-center justify-center text-white py-20 px-4 md:px-6 mb-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <Image 
            src="/images/ai-services-banner.png" 
            alt="AI Services Hub Banner" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 container mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-sm font-semibold backdrop-blur-md">
            <BrainCircuit className="h-4 w-4 text-purple-200" />
            <span className="text-purple-50">Next-Gen Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">AI Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hub</span></h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Generate complex academic documents instantly and enhance AI-generated content into natural, human-quality writing using our advanced rewriting engines.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button 
              size="lg" 
              onClick={() => setActiveTab('document')}
              className={`h-14 px-8 text-lg font-bold rounded-full transition-all shadow-xl ${
                activeTab === 'document' 
                  ? 'bg-primary hover:bg-primary/90 text-white scale-105 border-none' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md'
              }`}
            >
              <FileText className="mr-2 h-5 w-5" /> Document Generator
            </Button>
            <Button 
              size="lg" 
              onClick={() => setActiveTab('stealth')}
              className={`h-14 px-8 text-lg font-bold rounded-full transition-all shadow-xl ${
                activeTab === 'stealth' 
                  ? 'bg-green-600 hover:bg-green-700 text-white scale-105 border-none' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md'
              }`}
            >
              <BrainCircuit className="mr-2 h-5 w-5" /> Stealth Write
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {activeTab === 'document' ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Document Generator</h2>
            </div>
            <AIHelper />
          </section>
        ) : (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-green-500" />
              <h2 className="text-3xl font-bold">Stealth Humanizer</h2>
            </div>
            <AIHumanizer />
          </section>
        )}
      </div>
    </div>
  );
}
