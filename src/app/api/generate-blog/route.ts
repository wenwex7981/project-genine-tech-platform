import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import OpenAI from 'openai';

export const maxDuration = 60; // Allow up to 60 seconds for long AI generation

export async function POST(req: Request) {
  try {
    const { topic, category } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if ((!groqApiKey || groqApiKey === 'dummy_key_for_build') && !openaiApiKey) {
      return NextResponse.json({ error: 'No API keys configured on the server.' }, { status: 500 });
    }

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

    let rawContent = '';

    // Hybrid Approach: Try Groq First
    if (groqApiKey && groqApiKey !== 'dummy_key_for_build') {
      try {
        const groq = new Groq({ apiKey: groqApiKey });
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'openai/gpt-oss-120b',
          temperature: 0.4,
          max_tokens: 4000,
          response_format: { type: 'json_object' },
        });
        rawContent = chatCompletion.choices[0]?.message?.content || '';
        
        // Attempt to parse to see if it's truncated/invalid
        JSON.parse(rawContent);
      } catch (groqError: any) {
        console.warn('Groq generation failed, falling back to OpenAI...', groqError.message);
        rawContent = ''; // reset to trigger fallback
      }
    }

    // Fallback: Try OpenAI if Groq failed or wasn't available
    if (!rawContent && openaiApiKey) {
      try {
        console.log("Using OpenAI Fallback");
        const openai = new OpenAI({ apiKey: openaiApiKey });
        const completion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-4o-mini',
          temperature: 0.4,
          max_tokens: 8000,
          response_format: { type: 'json_object' },
        });
        rawContent = completion.choices[0]?.message?.content || '';
      } catch (openaiError: any) {
        console.error('OpenAI fallback failed:', openaiError);
        return NextResponse.json({ error: `Hybrid AI Generation Failed: ${openaiError.message}` }, { status: 500 });
      }
    }

    if (!rawContent) {
      return NextResponse.json({ error: 'AI returned empty response from both providers. Please try again.' }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error('Failed to parse AI JSON response:', rawContent.substring(0, 500));
      return NextResponse.json({ error: 'AI returned invalid JSON (possibly truncated). Please try a shorter topic.' }, { status: 500 });
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
    console.error('Error in AI generate-blog route:', error);
    return NextResponse.json({ error: `Failed to generate blog: ${error.message}` }, { status: 500 });
  }
}
