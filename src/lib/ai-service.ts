import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';
import { supabase } from '@/lib/supabase';

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
    maxTokens = 8000,
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

  let errors: string[] = [];

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
          model: 'llama3.1-8b',
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
          model: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
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
          model: 'llama-3.1-8b-instant',
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
        errors.push(`${model}: No API key configured`);
        continue; // Skip if no API key
      }

      if (content) {
        // Validate JSON if jsonMode is true
        if (jsonMode) {
          JSON.parse(content);
        }
        console.log(`Success with ${model}`);
        
        // Asynchronously log usage metrics to Supabase
        const estimatedTokens = Math.ceil(content.length / 4);
        supabase.rpc('increment_ai_usage', { 
          p_model_name: model, 
          p_tokens: estimatedTokens 
        }).then(({ error }) => {
          if (error) {
            // Fallback if RPC doesn't exist (e.g. they just created a standard table without RPC)
            // We can't do upsert easily without knowing ID, so we just insert a new log row
            supabase.from('ai_usage_metrics').insert([{
              model_name: model,
              requests_count: 1,
              tokens_used: estimatedTokens
            }]).then(() => {});
          }
        });

        return content;
      }

    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error.message);
      errors.push(`${model} error: ${error.message}`);
      // Continue to next model in fallback array
    }
  }

  const preferredModelError = errors.find(e => e.startsWith(`${preferredModel} `) || e.startsWith(`${preferredModel}:`));
  const errorMessage = preferredModelError 
    ? `Your selected model (${preferredModel}) failed: ${preferredModelError}. Fallbacks also failed. All errors: ${errors.join(' | ')}`
    : `All AI models failed. Errors: ${errors.join(' | ')}`;

  throw new Error(errorMessage);
}
