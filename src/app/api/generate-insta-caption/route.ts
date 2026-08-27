import { NextRequest, NextResponse } from 'next/server';
import { generateAIContent } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const systemPrompt = "You are an expert social media manager. Write a short, engaging Instagram caption with emojis and hashtags based on the user's topic. Do not include quotes around the caption.";
    
    // Using the robust AI service which will automatically fallback to other providers
    // if one (like OpenAI) hits a quota limit.
    const caption = await generateAIContent(topic, systemPrompt, { 
      fallbackMode: true,
      temperature: 0.7 
    });

    return NextResponse.json({ caption: caption.trim() }, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow Chrome Extension to hit this API
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    console.error("Caption Generation Error:", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
