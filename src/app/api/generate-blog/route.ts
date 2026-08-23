import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const maxDuration = 60; // Allow up to 60 seconds for long AI generation

export async function POST(req: Request) {
  try {
    const { topic, category } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'dummy_key_for_build') {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured on the server.' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const prompt = `You are an expert SEO content writer for GraduateNex, a platform that provides final year engineering projects, ATS resume tools, and hackathon listings for Indian students.

Write a comprehensive, Google-ranking blog article for the topic: "${topic}"
Category: "${category}"

STRICT RULES:
1. The article must be 1500-2000 words long in Markdown format.
2. Use H2 (##) and H3 (###) headings to structure the content properly.
3. Include bullet points, numbered lists, and bold text for key terms.
4. Naturally include internal links using Markdown syntax:
   - [Browse Final Year Projects](/projects)
   - [Free ATS Resume Checker](/resume)
   - [Upcoming Hackathons in India](/hackathons)
   - [Read More Guides](/blog)
5. Write in a helpful, authoritative tone targeted at Indian engineering students.
6. Include a compelling introduction and a clear conclusion with a CTA.
7. Use natural keyword density — don't stuff keywords.

OUTPUT FORMAT: Return a valid JSON object with exactly these fields:
{
  "title": "SEO-optimized H1 title (60-70 characters ideal)",
  "slug": "url-friendly-slug-with-hyphens",
  "excerpt": "Compelling meta description under 160 characters with the main keyword",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "content": "The full Markdown article content here"
}

Return ONLY the JSON object, nothing else.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.4,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    });

    const rawContent = chatCompletion.choices[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json({ error: 'AI returned empty response. Please try again.' }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error('Failed to parse AI JSON response:', rawContent.substring(0, 500));
      return NextResponse.json({ error: 'AI returned invalid JSON. Please try again with a different topic.' }, { status: 500 });
    }

    // Validate required fields exist
    if (!parsed.title || !parsed.content) {
      return NextResponse.json({ error: 'AI response missing required fields (title or content). Please try again.' }, { status: 500 });
    }

    // Generate slug from title if AI didn't provide one
    const slug = parsed.slug || parsed.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return NextResponse.json({
      title: parsed.title,
      slug: slug,
      excerpt: parsed.excerpt || parsed.title,
      keywords: parsed.keywords || topic,
      content: parsed.content,
      category: category,
    });
  } catch (error: any) {
    console.error('Error generating blog:', error);
    
    // Provide more specific error messages
    const message = error.message || 'Unknown error';
    if (message.includes('rate_limit')) {
      return NextResponse.json({ error: 'AI rate limit reached. Please wait 30 seconds and try again.' }, { status: 429 });
    }
    if (message.includes('decommissioned') || message.includes('model')) {
      return NextResponse.json({ error: 'AI model error. Contact admin.' }, { status: 500 });
    }
    
    return NextResponse.json({ error: `Failed to generate blog: ${message}` }, { status: 500 });
  }
}
