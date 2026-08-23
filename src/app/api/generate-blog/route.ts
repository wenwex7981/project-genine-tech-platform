import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { topic, category } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
    });

    const prompt = `You are an expert SEO blog writer. Write a comprehensive, Google-friendly article with natural keyword density based on the topic: "${topic}" and category: "${category}".

The output must be a JSON object with the following fields:
- title: A catchy, SEO-optimized H1 title.
- slug: A URL-friendly slug based on the title.
- excerpt: A meta description of 150-160 characters.
- keywords: A comma-separated string of SEO keywords.
- content: A 2000+ word Markdown article with H2/H3 headings, bullet points, and internal links to /projects, /resume, /hackathons, and /blog.

Do not include any text outside the JSON object. Output valid JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return NextResponse.json({
      title: parsed.title || '',
      slug: parsed.slug || '',
      excerpt: parsed.excerpt || '',
      keywords: parsed.keywords || '',
      content: parsed.content || '',
      category: category,
    });
  } catch (error: any) {
    console.error('Error generating blog:', error);
    return NextResponse.json({ error: error.message || 'Error generating blog' }, { status: 500 });
  }
}
