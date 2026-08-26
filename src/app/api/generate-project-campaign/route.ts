import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateAIResponse, AIModel } from '@/lib/ai-service';

export const runtime = 'edge';
export const maxDuration = 60; // Max execution time for vercel serverless

export async function POST(req: NextRequest) {
  try {
    const { projectId, preferredModel = 'deepseek' } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // 1. Fetch project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Generate Marketing Campaign
    const prompt = `Generate a complete marketing campaign for this product:
Title: ${project.title}
Branch: ${project.branch}
Education: ${project.education}
Sub-domain: ${project.sub_domain}
Description: ${project.description}

Identify the target student or fresher audience and the main problem the product solves. Create persuasive, natural, conversion-focused content for Instagram, Facebook, LinkedIn, X/Twitter, WhatsApp, Reddit, and SEO. Include headline, value proposition, benefits, CTA, Instagram caption, Facebook post, LinkedIn post, X post, WhatsApp message, Reddit post, SEO title, SEO meta description, SEO keywords, and hashtags. Emphasize practical student benefits such as placement preparation, learning, interview readiness, career improvement, time saving, affordability, or skill development when relevant. Adapt the message to each platform and avoid spammy wording. Never invent testimonials, statistics, guarantees, company partnerships, or results. Return valid JSON only. Do not use markdown or code fences.`;

    const generatedContent = await generateAIResponse({
      prompt,
      systemPrompt: "You are an elite Silicon Valley digital marketing expert and copywriter specializing in EdTech and student products. Return exactly one JSON object.",
      preferredModel: preferredModel as AIModel,
      jsonMode: true,
      maxTokens: 8000,
    });

    const parsedCampaign = JSON.parse(generatedContent);

    // 3. Save to database
    // We use upsert-like logic: delete existing campaign for this project if it exists, then insert new.
    await supabase
      .from('project_marketing_campaigns')
      .delete()
      .eq('project_id', projectId);

    const { error: insertError } = await supabase
      .from('project_marketing_campaigns')
      .insert([
        {
          project_id: projectId,
          campaign_data: parsedCampaign
        }
      ]);

    if (insertError) {
      console.error('Error saving campaign:', insertError);
      return NextResponse.json({ error: 'Failed to save campaign to database', details: insertError }, { status: 500 });
    }

    return NextResponse.json({ success: true, campaign: parsedCampaign });
  } catch (error: any) {
    console.error('Project Campaign Generator Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate campaign' }, { status: 500 });
  }
}
