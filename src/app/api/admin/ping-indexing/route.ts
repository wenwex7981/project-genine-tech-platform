import { NextResponse } from 'next/server';
import { pingGoogleIndexingAPI } from '@/lib/indexing-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, type } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await pingGoogleIndexingAPI(url, type || 'URL_UPDATED');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
