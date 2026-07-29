import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR' } = await req.json();

    // Support both server-side and public env var naming
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("RAZORPAY KEYS MISSING IN ENVIRONMENT. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel dashboard.");
      return NextResponse.json({ error: "Payment gateway not configured. Contact support." }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Parse amount to ensure it is a clean number
    const safeAmount = typeof amount === 'string'
      ? parseFloat(amount.replace(/,/g, '').replace(/[^\d.-]/g, ''))
      : Number(amount);

    if (!safeAmount || safeAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const options = {
      amount: Math.round(safeAmount * 100), // convert to paise
      currency,
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
