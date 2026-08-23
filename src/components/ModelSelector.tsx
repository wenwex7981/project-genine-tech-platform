"use client";

import { BrainCircuit } from "lucide-react";

export type AIModel = 'deepseek' | 'openai' | 'mistral' | 'groq' | 'cerebras' | 'fireworks';

interface ModelSelectorProps {
  value: AIModel;
  onChange: (value: AIModel) => void;
  className?: string;
}

export function ModelSelector({ value, onChange, className = "" }: ModelSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BrainCircuit className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline-block">AI Model:</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value as AIModel)}
        className="w-[180px] h-9 text-xs px-2 py-1 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <option value="deepseek">DeepSeek V3 (Primary)</option>
        <option value="openai">OpenAI GPT-4o Mini (Fast)</option>
        <option value="mistral">Mistral Large (Smart)</option>
        <option value="cerebras">Cerebras (Llama 3.1 70B)</option>
        <option value="fireworks">Fireworks (Llama 3.1 70B)</option>
        <option value="groq">Groq (Instant)</option>
      </select>
    </div>
  );
}
