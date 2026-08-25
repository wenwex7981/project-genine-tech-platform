import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-service';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert technical interviewer and educator.
Your task is to generate a short, 5-question multiple-choice quiz about the domain: "${domain}".

The questions should range from basic to intermediate difficulty.

You MUST return the output strictly as a JSON array of objects.
Each object must have exactly these fields:
- "question": the question text
- "options": an array of 4 string options
- "correctAnswer": the index (0-3) of the correct option
- "explanation": a short explanation of why the answer is correct

Example format:
[
  {
    "question": "What is the time complexity of binary search?",
    "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    "correctAnswer": 2,
    "explanation": "Binary search halves the search space each step, resulting in logarithmic time."
  }
]
`;

    const responseContent = await generateAIResponse({
      systemPrompt,
      prompt: `Generate 5 quiz questions for: ${domain}`,
      preferredModel: 'groq',
      jsonMode: true,
      temperature: 0.7,
    });

    let questions;
    try {
      questions = JSON.parse(responseContent);
    } catch (e) {
      console.error("Error parsing AI response for quiz", e);
      return NextResponse.json({ error: 'Failed to generate valid quiz data.' }, { status: 500 });
    }

    return NextResponse.json(questions);
  } catch (error: any) {
    console.error('Error generating daily quiz:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
