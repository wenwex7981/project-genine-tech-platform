import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-service';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { topic, code, history } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const systemPrompt = `You are an interactive, game-like AI coding tutor.
The user is currently learning the topic: "${topic}".

Your goal is to guide the user through a storyline where they must solve small coding challenges to progress.

The user has just submitted this code:
\`\`\`
${code || '(No code submitted yet)'}
\`\`\`

Evaluate their code based on the current context of the conversation.
1. If this is the start of the conversation (no history), introduce the story, explain the first concept, and give them their first coding challenge.
2. If they submitted code, act as a compiler/interpreter. Simulate the EXACT terminal output of their code. If there are syntax errors, simulate the error.
3. If they solved the challenge correctly, congratulate them, progress the story, and give the next challenge. If incorrect, give a small hint.

You MUST return your response as a raw JSON object with exactly these fields:
{
  "terminal": "The simulated output of the user's code. If no code was run, make this empty.",
  "story": "The narrative, feedback, and the next challenge.",
  "completed": true or false (true if they passed the current challenge, false if they need to try again or if this is the start)
}`;

    let prompt = "";
    if (!history || history.length === 0) {
      prompt = "Start the adventure! Give me my first task.";
    } else {
      prompt = "Here is the conversation history so far:\n" + 
               history.map((h: any) => `${h.role}: ${h.content}`).join("\n") +
               `\n\nI just submitted this code:\n${code}\nEvaluate it.`;
    }

    const responseContent = await generateAIResponse({
      systemPrompt,
      prompt,
      preferredModel: 'groq',
      jsonMode: true,
      temperature: 0.5,
    });

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (e) {
      // Fallback if the AI messes up JSON format
      parsedResponse = {
        terminal: "Error parsing AI response.",
        story: responseContent,
        completed: false
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error: any) {
    console.error('Error in practice API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
