"use client";

import { BrainCircuit } from "lucide-react";

export type AIModel = 'gemini' | 'deepseek' | 'openai' | 'mistral' | 'groq' | 'cerebras' | 'fireworks' | 'kimi' | 'xai' | 'meta' | 'openrouter';

interface ModelSelectorProps {
  value: AIModel;
  onChange: (value: AIModel) => void;
  className?: string;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, className = "", disabled = false }: ModelSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BrainCircuit className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline-block">AI Model:</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value as AIModel)}
        disabled={disabled}
        className="w-[180px] h-9 text-xs px-2 py-1 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="gemini">Gemini 3.6 Flash</option>
        <option value="deepseek">DeepSeek V3 (Primary)</option>
        <option value="openai">OpenAI GPT-4o Mini (Fast)</option>
        <option value="mistral">Mistral Large (Smart)</option>
        <option value="cerebras">Cerebras (Llama 3.1 70B)</option>
        <option value="fireworks">Fireworks (Llama 3.1 70B)</option>
        <option value="groq">Groq (Instant)</option>
        <option value="kimi">Kimi AI (Moonshot)</option>
        <option value="xai">xAI (Grok)</option>
        <option value="meta">Meta Llama (Llama 3.1 405B)</option>
        <option value="openrouter">OpenRouter (Auto)</option>
      </select>
    </div>
  );
}
