import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan_id,
      plan_name,
      user_email,
      is_lifetime
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      // Mock success for local dev without keys
      return NextResponse.json({ success: true, verified: false, mock: true });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      
      // Calculate expiration date (30 days from now) if not lifetime
      let expires_at = null;
      if (!is_lifetime) {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        expires_at = date.toISOString();
      }

      // Record subscription
      const { error } = await supabase.from('user_subscriptions').insert({
        user_email,
        plan_id,
        plan_name,
        expires_at,
        status: 'active'
      });

      if (error) {
        console.error("Supabase Error recording subscription:", error);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
      }

      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verify Subscription Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
