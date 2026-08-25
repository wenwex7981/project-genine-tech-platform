import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export async function POST(req: NextRequest) {
  try {
    const { 
      history, role, company, experienceLevel, round, difficulty, jd, resume, preferredModel = 'deepseek' 
    } = await req.json();

    if (!history || !role || !difficulty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = `You are a professional technical interviewer for the position of ${role}${company ? ` at ${company}` : ''}.
This is the ${round} round, and the target difficulty is ${difficulty}.
The candidate's experience level is: ${experienceLevel || 'Not specified (assume mid-level)'}.

${jd ? `Job Description:\n${jd}\n` : ''}
${resume ? `Candidate Resume:\n${resume}\n` : ''}

Your instructions:
1. Act exclusively as the interviewer. Never break character.
2. Keep your responses short and spoken conversational style. Do NOT provide lists or long explanations. Only ask one question at a time.
3. Base your questions strictly on the specified Experience Level (${experienceLevel || 'mid-level'}). If they are a fresher, ask foundational questions. If they are senior, ask architectural/scaling questions.
4. You MUST ask exactly 20 questions in total for this interview. Sequentially number your questions starting from "Question 1:", "Question 2:", all the way to "Question 20:", at the beginning of your response so the candidate knows how far along they are. Do not add introductory greetings. Just ask the question.
5. React briefly to their previous answer (e.g. "That makes sense", "Good point") before asking the next numbered question.
6. If they don't know the answer, do not give them the full answer. Give a tiny hint or move on to the next question.`;

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
