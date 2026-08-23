import { NextResponse } from 'next/server';
import { generateAIResponse, AIModel } from '@/lib/ai-service';
import { pingGoogleForIndexing } from '@/lib/google-indexing';

export const maxDuration = 60; // Allow up to 60 seconds for long AI generation

export async function POST(req: Request) {
  try {
    const { topic, category, preferredModel } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
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
   - [Premium Interview Prep Guides](/study)
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

    const rawContent = await generateAIResponse({
      prompt,
      preferredModel: preferredModel as AIModel,
      maxTokens: 4000,
      temperature: 0.4,
      jsonMode: true
    });

    const parsed = JSON.parse(rawContent);

    // Validate required fields exist
    if (!parsed.title || !parsed.content) {
      return NextResponse.json({ error: 'AI response missing required fields (title or content). Please try again.' }, { status: 500 });
    }

    // Generate slug from title if AI didn't provide one
    const slug = parsed.slug || parsed.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Ping Google to crawl new blog
    pingGoogleForIndexing().catch(() => {});

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
