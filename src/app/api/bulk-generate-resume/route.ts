import { NextResponse } from "next/server";
import { generateAIResponse, AIModel } from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const { topic, count = 5, preferredModel = "deepseek" } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert career coach and ATS resume writer. 
Your task is to generate ${count} unique, highly detailed ATS-friendly resume template posts for the role or domain: "${topic}".
You MUST return ONLY a JSON array of objects. Do not include markdown formatting outside the JSON array or extra text.
Each object in the array must have the following fields:
- "title" (string): A catchy title for the resume template, e.g., "ATS-Friendly Modern AI Engineer Resume" or "Google SWE Recommended Layout".
- "description" (string): A massive, highly detailed markdown-formatted description. It MUST include what sections the template covers, why it's good for ATS (Applicant Tracking Systems), recommended action verbs, and how to use it. Format it beautifully with markdown headers, bullet points, and bold text.`;

    const prompt = `Generate ${count} resume template posts for: ${topic}. Format strictly as a JSON array.`;

    const jsonStr = await generateAIResponse({
      prompt,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      maxTokens: 4000,
    });

    let templates = [];
    try {
      templates = JSON.parse(jsonStr);
      if (templates.templates && Array.isArray(templates.templates)) {
        templates = templates.templates;
      } else if (templates.resumes && Array.isArray(templates.resumes)) {
        templates = templates.resumes;
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from AI:", jsonStr);
      return NextResponse.json({ error: "AI returned invalid JSON format" }, { status: 500 });
    }

    if (!Array.isArray(templates)) {
      return NextResponse.json({ error: "AI did not return an array" }, { status: 500 });
    }

    return NextResponse.json({ templates });

  } catch (error: any) {
    console.error("Bulk Generate Resume API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate resume templates" }, { status: 500 });
  }
}
