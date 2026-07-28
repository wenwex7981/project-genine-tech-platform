"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export default function AIGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/generate-abstract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate abstract');
      }

      setResult(data.result);
    } catch (error: any) {
      console.error('Error generating abstract:', error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          Powered by AI
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Abstract <span className="text-primary">Generator</span></h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Enter your project topic or keywords, and our AI will generate a professional title and abstract instantly.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg p-6 md:p-8">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-semibold mb-2">Project Topic or Keywords</label>
            <textarea 
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., E-commerce website for local farmers using React and Node.js..."
              className="w-full min-h-[100px] p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={!topic || isGenerating}
            size="lg"
            className="w-full md:w-auto md:self-end h-12 px-8 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Abstract
              </>
            )}
          </Button>
        </div>

        {result && (
          <div className="mt-8 pt-8 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generated Result
            </h3>
            <div className="p-6 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(result)}>Copy to Clipboard</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
