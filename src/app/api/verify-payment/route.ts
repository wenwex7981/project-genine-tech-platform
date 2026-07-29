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
      items,
      total_amount
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      // For local testing without keys, just simulate success and save order
      const { error } = await supabase.from('orders').insert({
        razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id || 'mock_payment',
        items,
        total_amount,
        status: 'paid',
        user_email: body.user_email || null
      });
      return NextResponse.json({ success: true, verified: false, mock: true });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

      if (generated_signature === razorpay_signature) {
      // Signature is legit, record order
      const { error } = await supabase.from('orders').insert({
        razorpay_order_id,
        razorpay_payment_id,
        items,
        total_amount,
        status: 'paid',
        user_email: body.user_email || null
      });

      if (error) {
        console.error("Supabase Error recording order:", error);
      }

      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
