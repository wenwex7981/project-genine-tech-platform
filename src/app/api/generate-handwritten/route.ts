import { NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const { topic, preferredModel } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `Topic: ${topic}`;
    const systemPrompt = `You are an expert technical instructor creating structured, handwritten-style study notes.
You MUST respond with valid JSON and NO markdown formatting or wrapping around it.
Do NOT wrap the output in \`\`\`json blocks.
Generate 3 to 5 pages of notes. 

JSON Schema:
{
  "title": "String - Main Topic Title",
  "pages": [
    {
      "chapterTitle": "String - Chapter Title",
      "summary": "String - Brief chapter summary box",
      "items": [
        {
          "type": "bullet",
          "text": "String - Detailed bullet point"
        },
        {
          "type": "code",
          "title": "String - 'Syntax:' or 'Example:'",
          "code": "String - The code snippet (do NOT include line numbers in the string)"
        },
        {
          "type": "callout",
          "text": "String - A short, fun, encouraging phrase (e.g., 'Good logs lead to happy apps!')"
        }
      ]
    }
  ]
}

Ensure the items array has a mix of bullets, code snippets, and at least one callout per page. Make the text concise and easy to read.`;

    const content = await generateAIResponse({
      prompt,
      systemPrompt,
      preferredModel: preferredModel as AIModel,
      maxTokens: 4000,
      temperature: 0.5,
    });

    let parsedContent;
    try {
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse JSON from AI", content);
      throw new Error("AI returned invalid JSON");
    }

    return NextResponse.json(parsedContent);
  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate handwritten notes.' }, { status: 500 });
  }
}
