import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize only if API key is present so it doesn't crash on build if missing
const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) return null;
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const groq = getGroqClient();
    if (!groq) {
      return NextResponse.json(
        { error: 'Groq API Key is not configured in .env.local' },
        { status: 500 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert academic advisor and project manager. The user will provide a topic or keyword. Generate 5 highly innovative and professional Project Title suggestions. Then, provide a comprehensive Academic Abstract (150-250 words) based on the best title, suitable for a final year engineering or computer science project. Format the output clearly with "Project Title Suggestions:" (as a numbered list) and "Abstract:" headers. Be professional, innovative, and realistic. IMPORTANT: Do NOT use any markdown formatting, do NOT use asterisks (**) or bolding.'
        },
        {
          role: 'user',
          content: `Topic: ${topic}`
        }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 800,
    });

    const result = completion.choices[0]?.message?.content || 'Failed to generate abstract.';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate abstract. Please try again later.' },
      { status: 500 }
    );
  }
}
