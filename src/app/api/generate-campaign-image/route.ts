import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';
import { r2Client } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60; // DALL-E generation can take 10-15s

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // 1. Fetch project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('title')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Fetch existing campaign
    const { data: campaignRow, error: campaignError } = await supabase
      .from('project_marketing_campaigns')
      .select('campaign_data')
      .eq('project_id', projectId)
      .single();

    if (campaignError || !campaignRow) {
      return NextResponse.json({ error: 'Campaign not found. Please generate text campaign first.' }, { status: 404 });
    }

    const campaign = campaignRow.campaign_data;
    const keywords = campaign.seoKeywords || campaign.hashtags || project.title;

    // 3. Generate Image with DALL-E 3
    const prompt = `A hyper-realistic, professional, modern digital marketing illustration for a tech/educational product titled "${project.title}". Core themes: ${keywords}. Clean, vibrant, tech-startup aesthetic. No text or words in the image.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("OpenAI failed to return an image URL");
    }

    // 4. Download Image Buffer
    const imageRes = await fetch(imageUrl);
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Upload to Cloudflare R2
    const fileName = `campaigns/${projectId}-${Date.now()}.png`;
    
    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: "image/png",
      })
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;

    // 6. Update Campaign in Database
    const updatedCampaign = {
      ...campaign,
      imageUrl: publicUrl
    };

    const { error: updateError } = await supabase
      .from('project_marketing_campaigns')
      .update({ campaign_data: updatedCampaign })
      .eq('project_id', projectId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, imageUrl: publicUrl, campaign: updatedCampaign });

  } catch (error: any) {
    console.error("DALL-E Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 });
  }
}
