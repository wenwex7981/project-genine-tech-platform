import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export const maxDuration = 60;

const EVALUATION_PROMPT = `You are an elite technical interview coach and evaluator.
Your task is to analyze the candidate's answers from a mock interview and provide a comprehensive evaluation report.

CRITICAL INSTRUCTION: You MUST return the output STRICTLY as a JSON object matching this exact structure. Do NOT wrap it in markdown blocks, just return raw JSON:

{
  "overallScore": 76,
  "metrics": {
    "communication": 78,
    "technicalKnowledge": 81,
    "jdRelevance": 74,
    "answerStructure": 72,
    "confidence": 69
  },
  "strongAreas": [
    "SQL fundamentals",
    "Clear explanations"
  ],
  "needsImprovement": [
    "Answers are sometimes too long",
    "Weak STAR structure",
    "Limited examples"
  ],
  "recommendedPractice": [
    "SQL joins",
    "STAR method",
    "Behavioral questions",
    "Self-introduction"
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { 
      history, role, company, round, difficulty, jd, resume, preferredModel = 'deepseek' 
    } = await req.json();

    if (!history || history.length === 0) {
      return NextResponse.json({ error: 'No interview history provided' }, { status: 400 });
    }

    const context = `
Role: ${role}
Company: ${company || 'N/A'}
Round: ${round || 'Technical'}
Difficulty: ${difficulty}
${jd ? `JD: ${jd}\n` : ''}
${resume ? `Resume: ${resume}\n` : ''}
    `;

    const formattedHistory = history.map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");

    const userPrompt = `=== INTERVIEW CONTEXT ===\n${context}\n\n=== INTERVIEW TRANSCRIPT ===\n${formattedHistory}\n\nBased on this transcript, generate the evaluation report.`;

    const responseContent = await generateAIResponse({
      systemPrompt: EVALUATION_PROMPT,
      prompt: userPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      temperature: 0.1,
    });

    const report = JSON.parse(responseContent);
    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Error evaluating mock interview:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
