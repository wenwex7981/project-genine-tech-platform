import { NextResponse } from "next/server";
import { generateAIResponse, AIModel } from "@/lib/ai-service";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { topic, count = 5, preferredModel = "deepseek" } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert academic project generator. 
Your task is to generate ${count} unique, high-quality final year engineering projects about "${topic}".
You MUST return ONLY a JSON array of objects. Do not include markdown formatting or extra text outside the JSON.
Each object in the array must have the following fields:
- "title" (string): A catchy, academic project title. It MUST explicitly sound like a "Final Year Project" or include the term if appropriate.
- "type" (string): Either "Major" or "Mini". (DO NOT use any other string).
- "sub_domain" (string): E.g., AI/ML, Blockchain, Web Dev, IoT.
- "description" (string): A very lengthy, detailed markdown-formatted description (at least 8 to 12 paragraphs). 
  It MUST include the following specific markdown headers:
  "## Abstract": A comprehensive abstract summarizing the project.
  "## Project Overview": Detailed introduction.
  "## Problem Statement": What real-world problem it solves.
  "## Proposed Solution": Technical details of the architecture and solution.
  "## Expected Outcomes": What the final deliverable achieves.
  "## Research Papers & References": A list of 3-5 realistic or actual research paper titles with fabricated but realistic IEEE Xplore or Google Scholar search query links (e.g. [Paper Title](https://scholar.google.com/scholar?q=encoded+query)). This is to ensure authenticity.
- "features" (array of strings): 5 to 7 key technical features of the project.`;

    const prompt = `Generate ${count} massive, highly-detailed final year academic projects for the topic: ${topic}. Format strictly as a JSON array.`;

    const jsonStr = await generateAIResponse({
      prompt,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      maxTokens: 6000,
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
