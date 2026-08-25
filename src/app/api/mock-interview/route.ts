import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    const { history, role, level, preferredModel = 'deepseek' } = await req.json();

    if (!history || !role || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = `You are an expert, professional, and slightly strict technical interviewer. 
You are conducting a mock interview for a ${level} ${role} role.

Rules for your responses:
1. Speak naturally as a human interviewer would.
2. DO NOT output markdown, bold text, bullet points, or complex formatting. Output ONLY plain conversational text, because your response will be directly fed into a Text-to-Speech engine.
3. If this is the start of the interview (no prior conversation), introduce yourself briefly and ask the first question.
4. If the candidate just answered, briefly evaluate their answer (saying "Good point" or "You missed X"), then ask the next relevant follow-up question.
5. Keep your responses concise (under 4 sentences) so the candidate can answer quickly.`;

    // Construct the user prompt from the history
    let prompt = "";
    if (history.length === 0) {
      prompt = "Start the interview now.";
    } else {
      prompt = history.map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");
      prompt += "\n\nGenerate your next response as the INTERVIEWER.";
    }

    const responseContent = await generateAIResponse({
      systemPrompt,
      prompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: false,
      temperature: 0.7,
    });

    return NextResponse.json({ text: responseContent.trim() });
  } catch (error: any) {
    console.error('Error in mock-interview:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
