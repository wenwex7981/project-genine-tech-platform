import { NextResponse } from "next/server";
import { generateAIResponse, AIModel } from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const { topic, count = 5, preferredModel = "deepseek" } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert academic project generator. 
Your task is to generate ${count} unique, high-quality final year engineering projects about "${topic}".
You MUST return ONLY a JSON array of objects. Do not include markdown formatting or extra text.
Each object in the array must have the following fields:
- "title" (string): A catchy, academic project title.
- "type" (string): Either "Major" or "Mini".
- "sub_domain" (string): E.g., AI/ML, Blockchain, Web Dev, IoT.
- "description" (string): A highly detailed, long markdown-formatted description (at least 4 to 8 paragraphs). It MUST include sections with markdown headers like "## Project Overview", "## Problem Statement", "## Proposed Solution", and "## Expected Outcomes".
- "features" (array of strings): 3 to 5 key features of the project.`;

    const prompt = `Generate ${count} academic projects for the topic: ${topic}. Format as a JSON array.`;

    const jsonStr = await generateAIResponse({
      prompt,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      maxTokens: 3000,
    });

    let projects: any = [];
    try {
      let parsed;
      try {
        // Try to parse the raw string directly first (in case it's perfectly valid JSON)
        parsed = JSON.parse(jsonStr);
      } catch (initialError) {
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
        parsed = JSON.parse(cleaned);
      }
      
      if (Array.isArray(parsed)) {
        projects = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        const arrayVal = Object.values(parsed).find(val => Array.isArray(val));
        if (arrayVal) {
          projects = arrayVal;
        } else {
          // It might be a single object, wrap it
          projects = [parsed];
        }
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from AI:", jsonStr);
      return NextResponse.json({ error: `AI returned invalid JSON format. RAW: ${jsonStr.substring(0, 200)}` }, { status: 500 });
    }

    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: "AI did not return an array" }, { status: 500 });
    }

    return NextResponse.json({ projects });

  } catch (error: any) {
    console.error("Bulk Generate API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate projects" }, { status: 500 });
  }
}
