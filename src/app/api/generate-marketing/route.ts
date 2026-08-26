import { NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export const maxDuration = 60; // Max execution time for vercel serverless

export async function POST(req: Request) {
  try {
    const { topic, preferredModel = 'deepseek' } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const systemPrompt = `You are a world-class Chief Marketing Officer (CMO) and an elite copywriter. 
Your task is to take the user's project, product, or topic and generate a complete multi-channel marketing campaign.
You MUST return your response ONLY as a JSON object with NO markdown formatting outside the JSON block.

The JSON object MUST strictly adhere to this structure:
{
  "linkedin": "A highly engaging LinkedIn post. Use the AIDA framework (Attention, Interest, Desire, Action). Include emojis and a strong hook.",
  "twitter": "A viral Twitter thread (3-4 tweets). Keep sentences short and punchy. Include relevant hashtags.",
  "facebookAd": "A high-converting Facebook/Instagram ad copy. Focus on pain points, emotional triggers, and a clear Call to Action (CTA).",
  "seoTags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "emailSubject": "A catchy email subject line with high open rates.",
  "emailBody": "A persuasive email newsletter body promoting this topic."
}
Do not return any extra text.`;

    const prompt = `Generate a complete multi-channel marketing campaign for the following topic/product:\n\n${topic}`;

    const jsonStr = await generateAIResponse({
      prompt,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      maxTokens: 2500,
      temperature: 0.7,
    });

    let campaign;
    try {
      // Clean potential markdown blocks
      const jsonBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      let cleaned = jsonBlockMatch && jsonBlockMatch[1] ? jsonBlockMatch[1] : jsonStr;
      
      const firstIdx = cleaned.search(/\{/);
      const lastIdx = cleaned.lastIndexOf('}');
      if (firstIdx !== -1 && lastIdx !== -1 && lastIdx >= firstIdx) {
        cleaned = cleaned.substring(firstIdx, lastIdx + 1);
      }
      
      campaign = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", jsonStr);
      return NextResponse.json({ error: "AI returned invalid JSON format. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ campaign });

  } catch (error: any) {
    console.error('Marketing API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate marketing campaign.' },
      { status: 500 }
    );
  }
}
