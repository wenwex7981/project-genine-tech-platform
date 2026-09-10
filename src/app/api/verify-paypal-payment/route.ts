import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      paypal_order_id,
      items,
      total_amount,
      currency_code = 'USD',
      country_code = 'US',
      user_email
    } = body;

    if (!paypal_order_id) {
        return NextResponse.json({ success: false, error: 'Missing paypal_order_id' }, { status: 400 });
    }

    // Insert into orders table, mapping paypal order id to razorpay fields for compatibility
    const { error } = await supabase.from('orders').insert({
      razorpay_order_id: `paypal_${paypal_order_id}`,
      razorpay_payment_id: `paypal_capture_${paypal_order_id}`,
      items,
      total_amount,
      currency_code,
      country_code,
      status: 'paid',
      user_email: user_email || null
    });

    if (error) {
      console.error("Supabase Error recording paypal order:", error);
      return NextResponse.json({ success: false, error: 'Database insert failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error: any) {
    console.error('Verify PayPal Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
