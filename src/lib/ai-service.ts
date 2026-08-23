import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';

export type AIModel = 'deepseek' | 'openai' | 'mistral' | 'groq' | 'cerebras' | 'fireworks' | 'kimi' | 'xai';

interface AIGenerateOptions {
  prompt: string;
  systemPrompt?: string;
  preferredModel?: AIModel;
  maxTokens?: number;
  temperature?: number;
  jsonMode?: boolean;
}

export async function generateAIResponse(options: AIGenerateOptions): Promise<string> {
  const {
    prompt,
    systemPrompt = "You are a helpful AI assistant.",
    preferredModel = 'deepseek',
    maxTokens = 4000,
    temperature = 0.4,
    jsonMode = false,
  } = options;

  const fallbackOrder: AIModel[] = [preferredModel];
  const allModels: AIModel[] = ['deepseek', 'cerebras', 'fireworks', 'openai', 'mistral', 'groq', 'kimi', 'xai'];
  
  // Add remaining models as fallbacks in order
  for (const m of allModels) {
    if (!fallbackOrder.includes(m)) {
      fallbackOrder.push(m);
    }
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  let lastError = null;

  for (const model of fallbackOrder) {
    try {
      console.log(`Attempting AI generation with model: ${model}`);
      let content = '';

      if (model === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
        // DeepSeek is OpenAI compatible
        const openai = new OpenAI({ 
          apiKey: process.env.DEEPSEEK_API_KEY,
          baseURL: 'https://api.deepseek.com/v1' 
        });
        const completion = await openai.chat.completions.create({
          messages: messages as any,
          model: 'deepseek-chat',
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode && { response_format: { type: 'json_object' } }),
        });
        content = completion.choices[0]?.message?.content || '';
      } 
      else if (model === 'openai' && process.env.OPENAI_API_KEY) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          messages: messages as any,
          model: 'gpt-4o-mini',
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode && { response_format: { type: 'json_object' } }),
        });
        content = completion.choices[0]?.message?.content || '';
      }
      else if (model === 'cerebras' && process.env.CEREBRAS_API_KEY) {
        const openai = new OpenAI({ 
          apiKey: process.env.CEREBRAS_API_KEY,
          baseURL: 'https://api.cerebras.ai/v1' 
        });
        const completion = await openai.chat.completions.create({
          messages: messages as any,
          model: 'llama3.1-70b',
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode && { response_format: { type: 'json_object' } }),
        });
        content = completion.choices[0]?.message?.content || '';
      }
      else if (model === 'fireworks' && process.env.FIREWORKS_API_KEY) {
        const openai = new OpenAI({ 
          apiKey: process.env.FIREWORKS_API_KEY,
          baseURL: 'https://api.fireworks.ai/inference/v1' 
        });
        const completion = await openai.chat.completions.create({
          messages: messages as any,
          model: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode && { response_format: { type: 'json_object' } }),
        });
        content = completion.choices[0]?.message?.content || '';
      }
      else if (model === 'mistral' && process.env.MISTRAL_API_KEY) {
        const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
        const completion = await mistral.chat.complete({
          messages: messages as any,
          model: 'mistral-large-latest',
          temperature,
          maxTokens: maxTokens,
          ...(jsonMode && { responseFormat: { type: 'json_object' } }),
        });
        content = (completion.choices?.[0]?.message?.content as string) || '';
      }
      else if (model === 'groq' && process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'dummy_key_for_build') {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
          messages: messages as any,
          model: 'openai/gpt-oss-120b',
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode && { response_format: { type: 'json_object' } }),
        });
        content = completion.choices[0]?.message?.content || '';
      }
      else if (model === 'kimi' && process.env.KIMI_API_KEY) {
        const openai = new OpenAI({ 
          apiKey: process.env.KIMI_API_KEY,
          baseURL: 'https://api.moonshot.cn/v1' 
        });
        const completion = await openai.chat.completions.create({
          messages: messages as any,
          model: 'moonshot-v1-8k',
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode && { response_format: { type: 'json_object' } }),
        });
        content = completion.choices[0]?.message?.content || '';
      }
      else if (model === 'xai' && process.env.XAI_API_KEY) {
        const openai = new OpenAI({ 
          apiKey: process.env.XAI_API_KEY,
          baseURL: 'https://api.x.ai/v1' 
        });
        const completion = await openai.chat.completions.create({
          messages: messages as any,
          model: 'grok-beta',
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode && { response_format: { type: 'json_object' } }),
        });
        content = completion.choices[0]?.message?.content || '';
      }
      else {
        console.warn(`Skipping ${model} - No API key found`);
        continue; // Skip if no API key
      }

      if (content) {
        // Validate JSON if jsonMode is true
        if (jsonMode) {
          JSON.parse(content);
        }
        console.log(`Success with ${model}`);
        return content;
      }

    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error.message);
      lastError = error;
      // Continue to next model in fallback array
    }
  }

  throw new Error(`All AI models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
