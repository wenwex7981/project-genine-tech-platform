import { NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const { goal, background, preferredModel } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
    }

    const prompt = `I am a student with this background: ${background || 'Recent graduate'}. My ultimate career goal is: ${goal}. Please generate a detailed roadmap for me.`;
    const systemPrompt = 'You are an expert career coach and technical mentor. Provide highly detailed step-by-step career roadmaps for students. Break down into months or phases. Recommend specific technologies, projects to build, and skills to master. Use Markdown formatting with headers (##), bullet points, and bold text. Be encouraging and highly specific.';

    const content = await generateAIResponse({
      prompt,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      maxTokens: 1500,
      temperature: 0.7,
    });

    return NextResponse.json({ roadmap: content });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate roadmap.' }, { status: 500 });
  }
}
