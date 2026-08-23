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
- "description" (string): A detailed 2-3 sentence abstract/description.
- "features" (array of strings): 3 to 5 key features of the project.`;

    const prompt = `Generate ${count} academic projects for the topic: ${topic}. Format as a JSON array.`;

    const jsonStr = await generateAIResponse({
      prompt,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      maxTokens: 8000,
    });

    let projects = [];
    try {
      projects = JSON.parse(jsonStr);
      // If the AI wrapped it in an object like { "projects": [...] }
      if (projects.projects && Array.isArray(projects.projects)) {
        projects = projects.projects;
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from AI:", jsonStr);
      return NextResponse.json({ error: "AI returned invalid JSON format" }, { status: 500 });
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
