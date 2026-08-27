import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const {
      history = [],
      userMessage,
      preferredModel = 'groq',
      topic = 'general',
    } = await req.json();

    if (!userMessage || !userMessage.trim()) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const systemPrompt = `You are "Alex" — a warm, encouraging, and fluent English-speaking AI friend helping an Indian engineering student improve their spoken English and communication skills. You are NOT a teacher or a robot. You talk like a real friend.

Your personality:
- Super friendly, casual, supportive — like a best friend who speaks great English
- You genuinely care about helping them get better
- Never make them feel embarrassed or stupid
- Use simple, natural everyday English

Your CRITICAL job in EVERY single response:
1. ALWAYS continue the conversation naturally — respond to what they said, share your thoughts, ask a follow-up question to keep it going
2. IF they made any English mistake (grammar, wrong word, awkward phrasing) — you MUST correct it gently in a friendly way. Use phrases like:
   - "By the way, a more natural way to say that is..."
   - "Oh and just a small tip — instead of '...' you can say '...'"
   - "Quick fix: '...' sounds more natural as '...'"
3. Give positive encouragement when they speak well — "That was well said!" or "Nice one!"
4. NEVER correct more than 2 mistakes per message — focus on the most important ones only
5. Keep your responses SHORT — max 3-4 sentences. This is a casual chat, not a lecture.
6. Current conversation topic: ${topic}

Response FORMAT (always follow this exact structure):
{
  "friendReply": "Your casual, friendly reply continuing the conversation and keeping it engaging",
  "correctionsMade": true or false,
  "corrections": [
    {
      "original": "what they said wrong",
      "fixed": "the correct natural English version",
      "tip": "very short friendly tip why"
    }
  ],
  "encouragement": "a short positive note if they spoke well, or empty string if corrections were made"
}

Return ONLY raw JSON. No markdown, no explanation.`;

    const conversationHistory = history
      .map((msg: any) => `${msg.role === 'user' ? 'STUDENT' : 'ALEX'}: ${msg.content}`)
      .join('\n\n');

    const userPrompt = conversationHistory
      ? `${conversationHistory}\n\nSTUDENT: ${userMessage}\n\nGenerate Alex's reply as JSON.`
      : `STUDENT: ${userMessage}\n\nGenerate Alex's reply as JSON. This is the first message, greet them warmly.`;

    const responseContent = await generateAIResponse({
      systemPrompt,
      prompt: userPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      temperature: 0.75,
    });

    const parsed = JSON.parse(responseContent);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error in english-friend route:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
