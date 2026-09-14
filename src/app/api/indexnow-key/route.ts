import { NextResponse } from 'next/server';

// This file serves the IndexNow key verification
// The key must match INDEXNOW_KEY in your .env.local
export async function GET() {
  const key = process.env.INDEXNOW_KEY || 'graduatenex2026indexnow';
  return new NextResponse(key, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
