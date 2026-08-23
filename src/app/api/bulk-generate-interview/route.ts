import { NextResponse } from "next/server";
import { generateAIResponse, AIModel } from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const { topic, count = 5, preferredModel = "deepseek" } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert tech recruiter and interview coach. 
Your task is to generate ${count} unique, highly detailed interview preparation guides for the role or company: "${topic}".
You MUST return ONLY a JSON array of objects. Do not include markdown formatting outside the JSON array or extra text.
Each object in the array must have the following fields:
- "title" (string): A catchy title, e.g., "Top 20 TCS Ninja Fresher Interview Questions" or "Advanced React.js Developer Interview Guide".
- "company_name" (string): The company name or role name (e.g., "Deloitte", "Software Engineer").
- "description" (string): A massive, highly detailed markdown-formatted guide. It MUST include at least 15-20 specific interview questions with detailed answers, technical rounds, HR round tips, and a syllabus. Format it beautifully with markdown headers, lists, and bold text.`;

    const prompt = `Generate ${count} interview prep guides for: ${topic}. Format strictly as a JSON array.`;

    const jsonStr = await generateAIResponse({
      prompt,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      maxTokens: 4000,
    });

    let docs: any = [];
    try {
      // Find JSON block if wrapped in markdown
      const jsonBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      let cleaned = jsonStr;
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        cleaned = jsonBlockMatch[1];
      } else {
        // Fallback: extract substring from first [ or { to last ] or }
        const firstIdx = jsonStr.search(/\[|\{/);
        const lastIdx = Math.max(jsonStr.lastIndexOf(']'), jsonStr.lastIndexOf('}'));
        if (firstIdx !== -1 && lastIdx !== -1 && lastIdx >= firstIdx) {
          cleaned = jsonStr.substring(firstIdx, lastIdx + 1);
        }
      }
      
      let parsed = JSON.parse(cleaned);
      
      if (Array.isArray(parsed)) {
        docs = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        const arrayVal = Object.values(parsed).find(val => Array.isArray(val));
        if (arrayVal) {
          docs = arrayVal;
        } else {
          // It might be a single object, wrap it
          docs = [parsed];
        }
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from AI:", jsonStr);
      return NextResponse.json({ error: "AI returned invalid JSON format" }, { status: 500 });
    }

    if (!Array.isArray(docs)) {
      return NextResponse.json({ error: "AI did not return an array" }, { status: 500 });
    }

    return NextResponse.json({ docs });

  } catch (error: any) {
    console.error("Bulk Generate Interview API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate interview prep docs" }, { status: 500 });
  }
}
