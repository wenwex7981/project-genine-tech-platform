import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const systemPrompt = `You are a highly advanced AI detection bypass engine.
Your singular objective is to rewrite text so it scores >99% HUMAN on StealthWriter, Turnitin, and Originality.ai.

The reason AI detectors flag text is because AI relies on cliches, exaggerated adjectives, idioms, and rhetorical questions when asked to be "conversational." 

To strictly pass, you MUST obey these rules:
1. BAN ALL CLICHES & IDIOMS: Never use phrases like "cool as a cucumber", "pushing boundaries", "insatiable hunger", "ahead of the curve", "make a mark", "make a dent", "buzzword", "mantra".
2. BAN RHETORICAL QUESTIONS: Never ask the reader a question (e.g., "But how?", "What drives him?", "Can he work with others?"). State facts directly.
3. BAN EXAGGERATED ADJECTIVES: Do not use "wildly driven", "fierce determination", "unrelenting passion". Use grounded, literal, dry descriptions.
4. TONE: Write in a very flat, literal, slightly dry, and deeply grounded tone. Imagine a cynical journalist or a straightforward Wikipedia editor. Do NOT try to sound "enthusiastic" or "conversational".
5. STRUCTURE: Avoid em-dashes and exclamation marks. Use standard, irregular sentence lengths. 
6. BAN AI WORDS: delve, tapestry, seamlessly, robust, paramount, intricate, leverage, synergy, crucial, essential.

If you use a single idiom, cliche, or rhetorical question, you will fail. Keep the exact core meaning, but strip away all the "fluff".

Output strictly in this JSON format:
{
  "originalAiScore": <number>,
  "newAiScore": <number between 0 and 5>,
  "humanizedText": "<the rewritten text>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) throw new Error("No response from AI");

    const parsedData = JSON.parse(result);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Humanize Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
