import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) return null;
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export async function POST(req: Request) {
  try {
    const { goal, background } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
    }

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json({ error: 'Groq API Key is not configured.' }, { status: 500 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach and technical mentor. Provide highly detailed step-by-step career roadmaps for students. Break down into months or phases. Recommend specific technologies, projects to build, and skills to master. Use Markdown formatting with headers (##), bullet points, and bold text. Be encouraging and highly specific.'
        },
        {
          role: 'user',
          content: `I am a student with this background: ${background || 'Recent graduate'}. My ultimate career goal is: ${goal}. Please generate a detailed roadmap for me.`
        }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 1500,
    });

    return NextResponse.json({ roadmap: completion.choices[0]?.message?.content || '' });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate roadmap.' }, { status: 500 });
  }
}
