import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR' } = await req.json();

    // Ensure environment variables exist, otherwise mock the response for local testing
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn("Razorpay keys not found. Returning mock order for development.");
      return NextResponse.json({
        id: `order_mock_${Date.now()}`,
        amount,
        currency
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Parse amount to ensure it is a clean number, handle string inputs correctly
    const safeAmount = typeof amount === 'string' 
      ? parseFloat(amount.replace(/,/g, '').replace(/[^\d.-]/g, '')) 
      : Number(amount);
      
    const options = {
      amount: Math.round(safeAmount * 100), // amount in smallest currency unit (paise) safely rounded
      currency,
      receipt: `receipt_${Date.now().toString().slice(-8)}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
