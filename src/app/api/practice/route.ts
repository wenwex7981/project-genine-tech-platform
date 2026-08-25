import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-service';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { topic, code, history, isFixRequest, mode } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }
    
    const isQuizMode = mode === "quiz";

    const systemPrompt = `You are an elite, interactive AI coding tutor. The user has 0 prior knowledge and is learning the topic: "${topic}".
Your goal is to take them from absolute beginner ("Zero") to advanced ("Hero").

You must guide the user through a storyline/curriculum consisting of 5 to 10 sequential, practical coding tasks.
CRITICAL RULES:
${isQuizMode 
  ? "1. STRICT QUIZ MODE: DO NOT write the final code for the user. Force them to write the code themselves. Just give hints."
  : "1. LEARNING MODE: You are a friendly tutor. If the user asks for the answer or struggles, you MAY write the code for them and explain how it works."}
2. Start from the absolute basics if this is the first task.
3. Keep your explanations concise, engaging, and story-driven.

The user has just submitted this code:
\`\`\`
${code || '(No code submitted yet)'}
\`\`\`

Evaluate their code based on the current context:
1. If this is the start of the conversation, introduce the story and give Task 1.
2. Act as a compiler/interpreter. Simulate the EXACT terminal output of their code. If there are syntax errors, simulate the error.
3. If this is a "Fix with AI" request (isFixRequest=true), DO NOT progress the story. Just provide a gentle hint about what's wrong with their code.
4. If they solved the challenge correctly (and it's not a fix request), congratulate them, progress the story, and give the next numbered task (e.g., Task 2). If incorrect, give a small hint.

You MUST return your response as a raw JSON object with exactly these fields:
{
  "terminal": "The simulated output of the user's code. If no code was run, make this empty.",
  "story": "The narrative, feedback, hint, and/or the next challenge.",
  "completed": true or false (true ONLY if they passed the current challenge and should progress to the next task)
}`;

    let prompt = "";
    if (!history || history.length === 0) {
      prompt = "Start the adventure! Give me my first task (Task 1).";
    } else if (isFixRequest) {
      prompt = "Here is the conversation history so far:\n" + 
               history.map((h: any) => `${h.role}: ${h.content}`).join("\n") +
               `\n\nI just clicked 'Fix with AI'. I am stuck on this code:\n${code}\nPlease give me a hint to fix the error in the story field. DO NOT progress the task.`;
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
