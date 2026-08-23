import { NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const { topic, preferredModel } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const systemPrompt = 'You are an expert academic advisor and project manager. The user will provide a topic or keyword. Generate 5 highly innovative and professional Project Title suggestions. Then, provide a comprehensive Academic Abstract (150-250 words) based on the best title, suitable for a final year engineering or computer science project. Format the output clearly with "Project Title Suggestions:" (as a numbered list) and "Abstract:" headers. Be professional, innovative, and realistic. IMPORTANT: Do NOT use any markdown formatting, do NOT use asterisks (**) or bolding.';
    
    const result = await generateAIResponse({
      prompt: `Topic: ${topic}`,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      maxTokens: 800,
      temperature: 0.7,
    });

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate abstract. Please try again later.' },
      { status: 500 }
    );
  }
}
