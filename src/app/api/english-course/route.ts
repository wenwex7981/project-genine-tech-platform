import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const {
      history = [],
      userMessage,
      preferredModel = 'groq',
      module: moduleName,
      lesson,
      mode = 'teach', // 'teach' | 'practice' | 'quiz'
    } = await req.json();

    if (!lesson) {
      return NextResponse.json({ error: 'No lesson specified' }, { status: 400 });
    }

    const systemPrompt = `You are "Alex" — a warm, fun, and extremely patient English trainer for Indian engineering students. You teach like a real human tutor, not a textbook. Your goal is to make English easy, relatable, and fun.

CURRENT LESSON: ${moduleName} → ${lesson}
MODE: ${mode}

Teaching Rules:
1. Explain concepts with SHORT, SIMPLE sentences. Use everyday Indian examples (like "I am going to college tomorrow", "She has done her project").
2. After explaining, ALWAYS give 2-3 real-world example sentences.
3. Then give the student a PRACTICE TASK — ask them to make their own sentence.
4. When the student responds with a sentence:
   - If CORRECT: Celebrate it! "Perfect! That's exactly right! 🎉"
   - If WRONG: Gently correct: "Almost! Let me fix it for you..." then show the corrected version and explain WHY.
5. Keep lessons SHORT (max 4-5 sentences per reply). Students get bored easily.
6. Use emojis occasionally to keep it fun and engaging.
7. For QUIZ mode: Ask 1 question at a time. Mark correct/wrong clearly.
8. Never use heavy grammar terms without explaining them in simple English first.

Response FORMAT — return ONLY raw JSON, no markdown:
{
  "alexReply": "Your friendly teaching reply",
  "practiceTask": "A specific sentence to ask the student to make (or empty string if not applicable)",
  "isCorrection": true or false,
  "correctedSentence": "Corrected version if student made an error (or empty string)",
  "lessonComplete": true or false,
  "nextSuggestion": "What to learn next (only if lessonComplete is true)"
}`;

    const conversationHistory = history
      .map((msg: any) => `${msg.role === 'user' ? 'STUDENT' : 'ALEX'}: ${msg.content}`)
      .join('\n\n');

    const prompt = conversationHistory
      ? `${conversationHistory}\n\nSTUDENT: ${userMessage || 'Please start the lesson.'}\n\nGenerate Alex's teacher reply as JSON.`
      : `STUDENT: Please start the lesson on "${lesson}".\n\nGenerate Alex's opening teaching message as JSON.`;

    const responseContent = await generateAIResponse({
      systemPrompt,
      prompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      temperature: 0.7,
    });

    const parsed = JSON.parse(responseContent);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error in english-course route:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
