import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { goal, background } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY || 'dummy_key_for_build';
    const groq = new Groq({ apiKey });

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI service not configured. Please contact support." }, { status: 503 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert career coach and technical mentor. Your job is to provide highly detailed, step-by-step career roadmaps for students. Break down the roadmap into months or phases. Recommend specific technologies, projects to build, and skills to master. Use Markdown formatting with headers (##), bullet points, and bold text. Be encouraging and highly specific."
        },
        {
          role: "user",
          content: `I am a student with this background: ${background || "Recent graduate"}. My ultimate career goal is: ${goal}. Please generate a detailed roadmap for me.`
        }
      ],
      model: "llama3-8b-8192",
    });

    return NextResponse.json({ roadmap: completion.choices[0]?.message?.content || "" });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap. Please check your API key." }, { status: 500 });
  }
}
