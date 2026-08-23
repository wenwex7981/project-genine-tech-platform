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

    let templates: any = [];
    try {
      // Find the first JSON block (array or object)
      const match = jsonStr.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      const cleaned = match ? match[0] : jsonStr;
      
      let parsed = JSON.parse(cleaned);
      
      if (Array.isArray(parsed)) {
        templates = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        const arrayVal = Object.values(parsed).find(val => Array.isArray(val));
        if (arrayVal) {
          templates = arrayVal;
        } else {
          // It might be a single object, wrap it
          templates = [parsed];
        }
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
