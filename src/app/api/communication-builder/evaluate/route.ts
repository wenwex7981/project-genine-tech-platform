import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export const maxDuration = 60;

const EVALUATION_PROMPT = `You are a world-class English Speech Coach and Communication Specialist.
Your task is to analyze a candidate's spoken speech or self-introduction transcript and evaluate their fluency, vocabulary, filler word control, confidence, and structure.

CRITICAL INSTRUCTION: You MUST return the output STRICTLY as a JSON object matching this exact structure. Do NOT wrap it in markdown blocks, just return raw JSON:

{
  "overallScore": 82,
  "metrics": {
    "fluency": 78,
    "vocabularyQuality": 85,
    "structureAndFlow": 80,
    "fillerWordControl": 75,
    "confidenceAndTone": 84
  },
  "wordsPerMinute": 135,
  "wpmAnalysis": "Ideal speaking pace. Clear and easy to follow.",
  "fillerWordsFound": [
    { "word": "um", "count": 3 },
    { "word": "like", "count": 2 },
    { "word": "basically", "count": 1 }
  ],
  "strengths": [
    "Good opening greeting and clear name mention",
    "Highlighted relevant technical stack clearly",
    "Maintained professional tone"
  ],
  "areasToPolish": [
    "Slight pause before describing the final year project",
    "Replaced filler word 'basically' with structured transitions",
    "End with a stronger career objective statement"
  ],
  "speechRhythmAdvice": "Try taking a breath between sentences instead of using 'um' as a bridge word. Structure your intro into 3 clear blocks: Who you are -> What you have built -> Where you want to grow.",
  "perfectRewrittenScript": "Hello! I am a final year Computer Science student with a strong passion for full-stack software development. Throughout my degree, I have specialized in React, Next.js, and AI-driven applications, including building a production-ready academic marketplace used by hundreds of students. I thrive in collaborative environments and am excited to bring my technical skills and problem-solving mindset to a dynamic engineering team."
}`;

export async function POST(req: NextRequest) {
  try {
    const { 
      transcript, mode = "60s_self_intro", timeTakenSeconds = 60, role = "Software Engineer", experienceLevel = "Fresher", targetAudience = "Campus Recruiter", preferredModel = "groq" 
    } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: 'No speech transcript provided to analyze.' }, { status: 400 });
    }

    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const timeMinutes = Math.max(timeTakenSeconds, 5) / 60;
    const calculatedWPM = Math.round(wordCount / timeMinutes);

    const userPrompt = `=== CANDIDATE SPEECH PRACTICE DATA ===
Mode: ${mode}
Time Taken: ${timeTakenSeconds} seconds
Calculated Words Spoken: ${wordCount} words
Calculated WPM: ${calculatedWPM} WPM
Target Position/Role: ${role} (${experienceLevel})
Target Audience: ${targetAudience}

=== CANDIDATE RAW TRANSCRIPT ===
"${transcript}"

Analyze the transcript above and output the detailed JSON evaluation report. Make sure the "perfectRewrittenScript" is a polished, highly professional version of what they intended to say in 50 to 90 words.`;

    const responseContent = await generateAIResponse({
      systemPrompt: EVALUATION_PROMPT,
      prompt: userPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      temperature: 0.2,
    });

    const report = JSON.parse(responseContent);
    // Ensure calculated WPM is fallback accurate
    if (!report.wordsPerMinute) {
      report.wordsPerMinute = calculatedWPM;
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Error evaluating communication practice:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
